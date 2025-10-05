# 使用 Koog 构建 AI 银行助手

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb
){ .md-button }

在本教程中，我们将使用 Kotlin 中的 **Koog** 代理构建一个小型银行助手。
你将学习如何：
- 定义领域模型和样本数据
- 暴露专注于功能的工具，用于**资金转账**和**交易分析**
- 分类用户意图（转账 vs 分析）
- 以两种风格编排调用：
  1) 图/子图策略
  2) “将代理作为工具”

最后，你将能够将自由格式的用户请求路由到正确的工具，并生成有用且可审计的响应。

## 设置与依赖项

我们将使用 Kotlin Notebook 内核。确保你的 Koog 构件可以从 Maven Central 解析，并且你的 LLM 提供商密钥可以通过 `OPENAI_API_KEY` 环境变量获取。

```kotlin
%useLatestDescriptors
%use datetime

// 从 Maven Central 使用 Koog 时取消此行注释
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("请设置 OPENAI_API_KEY 环境变量")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## 定义系统提示

精心编写的系统提示有助于 AI 理解其角色和约束。此提示将指导我们所有代理的行为。

```kotlin
val bankingAssistantSystemPrompt = """
    |你是一位银行助手，与用户 (userId=123) 进行交互。
    |你的目标是理解用户的请求，并确定是否可以使用可用工具来完成该请求。
    |
    |如果任务可以通过提供的工具完成，请相应地进行，
    |在对话结束时回复：“任务已成功完成。”
    |如果任务无法通过可用工具执行，请回复：“无法执行任务。”
""".trimMargin()
```

## 领域模型与样本数据

首先，让我们定义领域模型和样本数据。我们将使用支持序列化的 Kotlin 数据类。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Contact(
    val id: Int,
    val name: String,
    val surname: String? = null,
    val phoneNumber: String
)

val contactList = listOf(
    Contact(100, "Alice", "Smith", "+1 415 555 1234"),
    Contact(101, "Bob", "Johnson", "+49 151 23456789"),
    Contact(102, "Charlie", "Williams", "+36 20 123 4567"),
    Contact(103, "Daniel", "Anderson", "+46 70 123 45 67"),
    Contact(104, "Daniel", "Garcia", "+34 612 345 678"),
)

val contactById = contactList.associateBy(Contact::id)
```

## 工具：资金转账

工具应该**纯粹**且可预测。

我们建模了两个“软契约”：
- `chooseRecipient` 当检测到歧义时，返回*候选者*。
- `sendMoney` 支持一个 `confirmed` 标志。如果为 `false`，它会要求代理与用户确认。

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

@LLMDescription("用于资金转账操作的工具。")
class MoneyTransferTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        返回给定用户的联系人列表。
        此演示中的用户始终是 userId=123。
        """
    )
    fun getContacts(
        @LLMDescription("请求其联系人列表的用户的唯一标识符。") userId: Int
    ): String = buildString {
        contactList.forEach { c ->
            appendLine("${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})")
        }
    }.trimEnd()

    @Tool
    @LLMDescription("返回当前余额（演示值）。")
    fun getBalance(
        @LLMDescription("用户的唯一标识符。") userId: Int
    ): String = "Balance: 200.00 EUR"

    @Tool
    @LLMDescription("返回默认用户货币（演示值）。")
    fun getDefaultCurrency(
        @LLMDescription("用户的唯一标识符。") userId: Int
    ): String = "EUR"

    @Tool
    @LLMDescription("返回两种 ISO 货币之间的演示汇率（例如 EUR→USD）。")
    fun getExchangeRate(
        @LLMDescription("基础货币（例如，EUR）。") from: String,
        @LLMDescription("目标货币（例如，USD）。") to: String
    ): String = when (from.uppercase() to to.uppercase()) {
        "EUR" to "USD" -> "1.10"
        "EUR" to "GBP" -> "0.86"
        "GBP" to "EUR" -> "1.16"
        "USD" to "EUR" -> "0.90"
        else -> "No information about exchange rate available."
    }

    @Tool
    @LLMDescription(
        """
        返回一个针对模糊姓名的可能收款人排名列表。
        代理应要求用户选择一个，然后使用所选的联系人 id。
        """
    )
    fun chooseRecipient(
        @LLMDescription("模糊或部分的联系人姓名。") confusingRecipientName: String
    ): String {
        val matches = contactList.filter { c ->
            c.name.contains(confusingRecipientName, ignoreCase = true) ||
                (c.surname?.contains(confusingRecipientName, ignoreCase = true) ?: false)
        }
        if (matches.isEmpty()) {
            return "未找到与 '$confusingRecipientName' 匹配的候选者。请使用 getContacts 并要求用户选择。"
        }
        return matches.mapIndexed { idx, c ->
            "${idx + 1}. ${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})"
        }.joinToString("
")
    }

    @Tool
    @LLMDescription(
        """
        将资金从用户发送给联系人。
        如果 confirmed=false，则返回带有易读摘要的 "REQUIRES_CONFIRMATION"。
        代理应在以 confirmed=true 重试之前与用户确认。
        """
    )
    fun sendMoney(
        @LLMDescription("发送者用户 id。") senderId: Int,
        @LLMDescription("发送者默认货币的金额。") amount: Double,
        @LLMDescription("收款人联系人 id。") recipientId: Int,
        @LLMDescription("简短目的/描述。") purpose: String,
        @LLMDescription("用户是否已确认此转账。") confirmed: Boolean = false
    ): String {
        val recipient = contactById[recipientId] ?: return "无效的收款人。"
        val summary = "将 €%.2f 转账给 %s %s (%s)，用于“%s”。"
            .format(amount, recipient.name, recipient.surname ?: "", recipient.phoneNumber, purpose)

        if (!confirmed) {
            return "REQUIRES_CONFIRMATION: $summary"
        }

        // 在真实系统中，这里是调用支付 API 的地方。
        return "资金已发送。$summary"
    }
}
```

## 创建你的第一个代理
现在，让我们创建一个使用资金转账工具的代理。
代理将大型语言模型 (LLM) 与工具结合起来以完成任务。

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.agents.ext.tool.AskUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

val transferAgentService = AIAgentService(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = bankingAssistantSystemPrompt,
    temperature = 0.0,  // 对金融操作使用确定性响应
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// 测试代理在各种场景下的表现
println("银行助手已启动")
val message = "转账 25 欧元给 Daniel，用于餐厅晚餐。"

// 你可以尝试的其他测试消息：
// - “转账 50 欧元给 Alice，用于演唱会门票”
// - “我的当前余额是多少？”
// - “转账 100 欧元给 Bob，用于分摊的度假费用”

runBlocking {
    val result = transferAgentService.createAgentAndRun(message)
    result
}
```

    银行助手已启动
    有两个名为 Daniel 的联系人。请确认你想将钱转给哪一个：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请确认将 €25.00 转账给 Daniel Garcia (+34 612 345 678)，用于“餐厅晚餐”。

    任务已成功完成。

## 添加交易分析功能
让我们通过交易分析工具扩展助手的`功能`。
首先，我们将定义交易领域模型。

```kotlin
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime

@Serializable
enum class TransactionCategory(val title: String) {
    FOOD_AND_DINING("餐饮"),
    SHOPPING("购物"),
    TRANSPORTATION("交通"),
    ENTERTAINMENT("娱乐"),
    GROCERIES("日用杂货"),
    HEALTH("健康"),
    UTILITIES("公共事业"),
    HOME_IMPROVEMENT("家居装修");

    companion object {
        fun fromString(value: String): TransactionCategory? =
            entries.find { it.title.equals(value, ignoreCase = true) }

        fun availableCategories(): String =
            entries.joinToString(", ") { it.title }
    }
}

@Serializable
data class Transaction(
    val merchant: String,
    val amount: Double,
    val category: TransactionCategory,
    val date: LocalDateTime
)
```

### 交易样本数据

```kotlin
val transactionAnalysisPrompt = """
今天是 2025-05-22。
可用的交易类别：${TransactionCategory.availableCategories()}
"""

val sampleTransactions = listOf(
    Transaction("Starbucks", 5.99, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 22, 8, 30, 0, 0)),
    Transaction("Amazon", 129.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 22, 10, 15, 0, 0)),
    Transaction(
        "Shell Gas Station",
        45.50,
        TransactionCategory.TRANSPORTATION,
        LocalDateTime(2025, 5, 21, 18, 45, 0, 0)
    ),
    Transaction("Netflix", 15.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 21, 12, 0, 0, 0)),
    Transaction("AMC Theaters", 32.50, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 20, 19, 30, 0, 0)),
    Transaction("Whole Foods", 89.75, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 20, 16, 20, 0, 0)),
    Transaction("Target", 67.32, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 20, 14, 30, 0, 0)),
    Transaction("CVS Pharmacy", 23.45, TransactionCategory.HEALTH, LocalDateTime(2025, 5, 19, 11, 25, 0, 0)),
    Transaction("Subway", 12.49, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 19, 13, 15, 0, 0)),
    Transaction("Spotify Premium", 9.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 19, 14, 15, 0, 0)),
    Transaction("AT&T", 85.00, TransactionCategory.UTILITIES, LocalDateTime(2025, 5, 18, 9, 0, 0, 0)),
    Transaction("Home Depot", 156.78, TransactionCategory.HOME_IMPROVEMENT, LocalDateTime(2025, 5, 18, 15, 45, 0, 0)),
    Transaction("Amazon", 129.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 17, 10, 15, 0, 0)),
    Transaction("Starbucks", 5.99, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 17, 8, 30, 0, 0)),
    Transaction("Whole Foods", 89.75, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 16, 16, 20, 0, 0)),
    Transaction("CVS Pharmacy", 23.45, TransactionCategory.HEALTH, LocalDateTime(2025, 5, 15, 11, 25, 0, 0)),
    Transaction("AT&T", 85.00, TransactionCategory.UTILITIES, LocalDateTime(2025, 5, 14, 9, 0, 0, 0)),
    Transaction("Xbox Game Pass", 14.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 14, 16, 45, 0, 0)),
    Transaction("Aldi", 76.45, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 13, 17, 30, 0, 0)),
    Transaction("Chipotle", 15.75, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 13, 12, 45, 0, 0)),
    Transaction("Best Buy", 299.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 12, 14, 20, 0, 0)),
    Transaction("Olive Garden", 89.50, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 12, 19, 15, 0, 0)),
    Transaction("Whole Foods", 112.34, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 11, 10, 30, 0, 0)),
    Transaction("Old Navy", 45.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 11, 13, 45, 0, 0)),
    Transaction("Panera Bread", 18.25, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 10, 11, 30, 0, 0)),
    Transaction("Costco", 245.67, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 10, 15, 20, 0, 0)),
    Transaction("Five Guys", 22.50, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 9, 18, 30, 0, 0)),
    Transaction("Macy's", 156.78, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 9, 14, 15, 0, 0)),
    Transaction("Hulu Plus", 12.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 8, 20, 0, 0, 0)),
    Transaction("Whole Foods", 94.23, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 8, 16, 45, 0, 0)),
    Transaction("Texas Roadhouse", 78.90, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 8, 19, 30, 0, 0)),
    Transaction("Walmart", 167.89, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 7, 11, 20, 0, 0)),
    Transaction("Chick-fil-A", 14.75, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 7, 12, 30, 0, 0)),
    Transaction("Aldi", 82.45, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 6, 15, 45, 0, 0)),
    Transaction("TJ Maxx", 67.90, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 6, 13, 20, 0, 0)),
    Transaction("P.F. Chang's", 95.40, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 5, 19, 15, 0, 0)),
    Transaction("Whole Foods", 78.34, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 4, 14, 30, 0, 0)),
    Transaction("H&M", 89.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 3, 16, 20, 0, 0)),
    Transaction("Red Lobster", 112.45, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 2, 18, 45, 0, 0)),
    Transaction("Whole Foods", 67.23, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 2, 11, 30, 0, 0)),
    Transaction("Marshalls", 123.45, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 1, 15, 20, 0, 0)),
    Transaction(
        "Buffalo Wild Wings",
        45.67,
        TransactionCategory.FOOD_AND_DINING,
        LocalDateTime(2025, 5, 1, 19, 30, 0, 0)
    ),
    Transaction("Aldi", 145.78, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 1, 10, 15, 0, 0))
)
```

## 交易分析工具

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

@LLMDescription("用于分析交易历史的工具")
class TransactionAnalysisTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        检索按 userId、类别、开始日期和结束日期筛选的交易。
        所有形参都是可选的。如果未提供形参，则返回所有交易。
        日期应采用 YYYY-MM-DD 格式。
        """
    )
    fun getTransactions(
        @LLMDescription("要检索其交易的用户的 ID。")
        userId: String? = null,
        @LLMDescription("用于筛选交易的类别（例如，'餐饮'）。")
        category: String? = null,
        @LLMDescription("用于筛选交易的开始日期，格式为 YYYY-MM-DD。")
        startDate: String? = null,
        @LLMDescription("用于筛选交易的结束日期，格式为 YYYY-MM-DD。")
        endDate: String? = null
    ): String {
        var filteredTransactions = sampleTransactions

        // 验证 userId（在生产环境中，这将查询真实数据库）
        if (userId != null && userId != "123") {
            return "未找到用户 $userId 的交易。"
        }

        // 应用类别过滤器
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "无效类别：$cat。可用类别：${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 应用日期范围过滤器
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "未找到符合指定条件的交易。"
        }

        return filteredTransactions.joinToString("
") { transaction ->
            "${transaction.date}: ${transaction.merchant} - " +
                "${transaction.amount} (${transaction.category.title})"
        }
    }

    @Tool
    @LLMDescription("计算双精度浮点数数组的总和。")
    fun sumArray(
        @LLMDescription("逗号分隔的双精度浮点数列表，用于求和（例如，'1.5,2.3,4.7'）。")
        numbers: String
    ): String {
        val numbersList = numbers.split(",")
            .mapNotNull { it.trim().toDoubleOrNull() }
        val sum = numbersList.sum()
        return "总和：$%.2f".format(sum)
    }

    // 解析日期的辅助函数
    private fun parseDate(dateStr: String, startOfDay: Boolean): LocalDateTime {
        val parts = dateStr.split("-").map { it.toInt() }
        require(parts.size == 3) { "日期格式无效。请使用 YYYY-MM-DD" }

        return if (startOfDay) {
            LocalDateTime(parts[0], parts[1], parts[2], 0, 0, 0, 0)
        } else {
            LocalDateTime(parts[0], parts[1], parts[2], 23, 59, 59, 999999999)
        }
    }
}
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

val analysisAgentService = AIAgentService(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt",
    temperature = 0.0,
    toolRegistry = ToolRegistry {
        tools(TransactionAnalysisTools().asTools())
    }
)

println("交易分析助手已启动")
val analysisMessage = "我这个月在餐厅花了多少钱？"

// 其他可以尝试的查询：
// - “我这个月在餐厅的最高消费是多少？”
// - “五月第一周我在日用杂货上花了多少钱？”
// - “五月我在娱乐方面的总开销是多少？”
// - “显示我上周的所有交易”

runBlocking {
    val result = analysisAgentService.createAgentAndRun(analysisMessage)
    result
}
```

    交易分析助手已启动

    你本月在餐饮上的总支出为 $517.64。
    
    任务已成功完成。

## 使用图构建代理
现在，让我们将专门的代理组合成一个图代理，它可以将请求路由到适当的处理程序。

### 请求分类
首先，我们需要一种方法来对传入请求进行分类：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Suppress("unused")
@SerialName("UserRequestType")
@Serializable
@LLMDescription("用户请求类型：转账或分析")
enum class RequestType { Transfer, Analytics }

@Serializable
@LLMDescription("由代理分类的银行请求。")
data class ClassifiedBankRequest(
    @property:LLMDescription("请求类型：转账或分析")
    val requestType: RequestType,
    @property:LLMDescription("银行应用程序要执行的实际请求")
    val userRequest: String
)

```

### 共享工具注册表

```kotlin
// 为多代理系统创建一个综合工具注册表
val toolRegistry = ToolRegistry {
    tool(AskUser)  // 允许代理请求澄清
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## 代理策略

现在我们将创建一个编排多个节点的策略：

```kotlin
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("banking assistant") {

    // 用于分类用户请求的子图
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 使用结构化输出以确保正确的分类
        val requestClassification by nodeLLMRequestStructured<ClassifiedBankRequest>(
            examples = listOf(
                ClassifiedBankRequest(
                    requestType = RequestType.Transfer,
                    userRequest = "转账 25 欧元给 Daniel，用于餐厅晚餐。"
                ),
                ClassifiedBankRequest(
                    requestType = RequestType.Analytics,
                    userRequest = "提供上个月的交易概览"
                )
            ),
            fixingParser = StructureFixingParser(
                fixingModel = OpenAIModels.CostOptimized.GPT4oMini,
                retries = 2,
            )
        )

        val callLLM by nodeLLMRequest()
        val callAskUserTool by nodeExecuteTool()

        // 定义流程
        edge(nodeStart forwardTo requestClassification)

        edge(
            requestClassification forwardTo nodeFinish
                onCondition { it.isSuccess }
                transformed { it.getOrThrow().structure }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "无法理解用户的意图" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "请调用 `${AskUser.name}` 工具而不是聊天" }
        )

        edge(callAskUserTool forwardTo requestClassification
            transformed { it.result.toString() })
    }

    // 用于处理资金转账的子图
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 对转账使用功能更强大的模型
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        具体来说，你需要帮助处理以下请求：
        ${request.userRequest}
        """.trimIndent()
    }

    // 用于交易分析的子图
    val transactionAnalysis by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = TransactionAnalysisTools().asTools() + AskUser,
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        $transactionAnalysisPrompt
        具体来说，你需要帮助处理以下请求：
        ${request.userRequest}
        """.trimIndent()
    }

    // 连接子图
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 将结果路由到结束节点
    edge(transferMoney forwardTo nodeFinish)
    edge(transactionAnalysis forwardTo nodeFinish)
}
```

```kotlin
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels // 导入 OpenAIModels

val agentConfig = AIAgentConfig(
    prompt = prompt(id = "banking assistant") {
        system("$bankingAssistantSystemPrompt
$transactionAnalysisPrompt")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50  // 允许多步骤的复杂操作
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## 运行图代理

```kotlin
import kotlinx.coroutines.runBlocking

println("银行助手已启动")
val testMessage = "转账 25 欧元给 Daniel，用于餐厅晚餐。"

// 测试各种场景：
// 转账请求：
//   - “转账 50 欧元给 Alice，用于演唱会门票”
//   - “转账 100 欧元给 Bob，用于日用杂货”
//   - “我的当前余额是多少？”
//
// 分析请求：
//   - “我这个月在餐厅花了多少钱？”
//   - “我这个月在餐厅的最高消费是多少？”
//   - “五月第一周我在日用杂货上花了多少钱？”
//   - “五月我在娱乐方面的总开销是多少？”

runBlocking {
    val result = agent.run(testMessage)
    "结果：$result"
}
```

    银行助手已启动
    我找到了多个名为 Daniel 的联系人。请选择正确的那个：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请指定正确收款人的编号。
    请确认是否要继续将 €25 转账给 Daniel Garcia，用于“餐厅晚餐”。

    结果：任务已成功完成。

## 代理组合——将代理作为工具使用

Koog 允许你在其他代理中使用代理作为工具，从而实现强大的组合模式。

```kotlin
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.agent.AIAgent // 导入 AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels // 导入 OpenAIModels
import ai.koog.agents.core.tools.ToolRegistry // 导入 ToolRegistry
import ai.koog.agents.ext.tool.AskUser // 导入 AskUser

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // 将代理转换为工具
        tool(
            transferAgentService.createAgentTool(
                agentName = "transferMoney",
                agentDescription = "转账并处理所有相关操作",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "用户的转账请求",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgentService.createAgentTool(
                agentName = "analyzeTransactions",
                agentDescription = "对用户交易进行分析",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "交易分析请求",
                    type = ToolParameterType.String
                )
            )
        )
    },
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt"
)
```

## 运行组合代理

```kotlin
import kotlinx.coroutines.runBlocking

println("银行助手已启动")
val composedMessage = "转账 25 欧元给 Daniel，用于餐厅晚餐。"

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "结果：$result"
}
```

    银行助手已启动
    有两个名为 Daniel 的联系人。请确认你想将钱转给哪一个：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请确认将 €25.00 转账给 Daniel Anderson (+46 70 123 45 67)，用于“餐厅晚餐”。

    结果：无法执行任务。

## 总结
在本教程中，你学习了如何：

1. 创建带有清晰描述的 LLM 驱动工具，帮助 AI 理解何时以及如何使用它们
2. 构建将 LLM 与工具结合起来以完成特定任务的单一用途代理
3. 使用策略和子图实现图代理以处理复杂工作流
4. 通过将代理用作其他代理中的工具来组合代理
5. 处理用户交互，包括确认和消歧

## 最佳实践

1. 清晰的工具描述：编写详细的 LLMDescription 注解，帮助 AI 理解工具用法
2. 惯用的 Kotlin：使用 Kotlin 的特性，如数据类、扩展函数和作用域函数
3. 错误处理：始终验证输入并提供有意义的错误消息
4. 用户体验：为资金转账等关键操作包含确认步骤
5. 模块化：将关注点分离到不同的工具和代理中，以实现更好的可维护性