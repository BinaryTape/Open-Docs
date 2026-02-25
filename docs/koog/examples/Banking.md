# 使用 Koog 构建 AI 银行助手

[:material-github: 在 GitHub 上打开](https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb){ .md-button }

在本教程中，我们将使用 Kotlin 中的 **Koog** 智能体构建一个小型银行助手。
您将学习如何：
- 定义领域模型和示例数据
- 公开专注于功能的工具，用于**资金转账**和**交易分析**
- 分类用户意图（转账 vs 分析）
- 以两种风格编排调用：
  1) 图 (Graph)/子图 (Subgraph) 策略
  2) “将智能体作为工具”

到最后，您将能够将自由格式的用户请求路由到正确的工具，并生成有用且可审计的响应。

## 设置与依赖项

我们将使用 Kotlin Notebook 内核。请确保您的 Koog 构件可从 Maven 中央仓库解析，并且已通过 `OPENAI_API_KEY` 提供您的 LLM 提供商密钥。

```kotlin
%useLatestDescriptors
%use datetime

// 取消注释此行以使用来自 Maven 中央仓库的 koog
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("请设置 OPENAI_API_KEY 环境变量")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## 定义系统提示词

精心设计的系统提示词有助于 AI 理解其角色和约束。此提示词将引导我们所有智能体的行为。

```kotlin
val bankingAssistantSystemPrompt = """
    |您是一名与用户 (userId=123) 互动的银行助手。
    |您的目标是理解用户的请求，并确定是否可以使用可用工具来满足该请求。
    |
    |如果可以使用提供的工具完成任务，请相应执行，
    |并在对话结束时回复：“任务成功完成。”
    |如果无法使用可用工具执行任务，请回复：“无法执行任务。”
""".trimMargin()
```

## 领域模型与示例数据

首先，让我们定义领域模型和示例数据。我们将使用支持序列化的 Kotlin 数据类。

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
    Contact(102, "Charlie", "Williams", "+36 20 123 45 67"),
    Contact(103, "Daniel", "Anderson", "+46 70 123 45 67"),
    Contact(104, "Daniel", "Garcia", "+34 612 345 678"),
)

val contactById = contactList.associateBy(Contact::id)
```

## 工具：资金转账

工具应当是**纯粹**且可预测的。

我们模拟了两个“软合约”：
- 当检测到歧义时，`chooseRecipient` 返回*候选者*。
- `sendMoney` 支持 `confirmed` 标志。如果为 `false`，它会要求智能体向用户确认。

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
        在本演示中，用户始终为 userId=123。
        """
    )
    fun getContacts(
        @LLMDescription("请求其联系人列表的用户唯一标识符。") userId: Int
    ): String = buildString {
        contactList.forEach { c ->
            appendLine("${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})")
        }
    }.trimEnd()

    @Tool
    @LLMDescription("返回当前余额（演示值）。")
    fun getBalance(
        @LLMDescription("用户的唯一标识符。") userId: Int
    ): String = "余额：200.00 EUR"

    @Tool
    @LLMDescription("返回用户默认货币（演示值）。")
    fun getDefaultCurrency(
        @LLMDescription("用户的唯一标识符。") userId: Int
    ): String = "EUR"

    @Tool
    @LLMDescription("返回两个 ISO 货币之间的演示汇率（例如 EUR→USD）。")
    fun getExchangeRate(
        @LLMDescription("基准货币（例如 EUR）。") from: String,
        @LLMDescription("目标货币（例如 USD）。") to: String
    ): String = when (from.uppercase() to to.uppercase()) {
        "EUR" to "USD" -> "1.10"
        "EUR" to "GBP" -> "0.86"
        "GBP" to "EUR" -> "1.16"
        "USD" to "EUR" -> "0.90"
        else -> "没有可用的汇率信息。"
    }

    @Tool
    @LLMDescription(
        """
        针对有歧义的名称，返回可能收款人的排名列表。
        智能体应要求用户选择一个，然后使用所选的联系人 id。
        """
    )
    fun chooseRecipient(
        @LLMDescription("有歧义或不完整的联系人姓名。") confusingRecipientName: String
    ): String {
        val matches = contactList.filter { c ->
            c.name.contains(confusingRecipientName, ignoreCase = true) ||
                (c.surname?.contains(confusingRecipientName, ignoreCase = true) ?: false)
        }
        if (matches.isEmpty()) {
            return "未找到 '$confusingRecipientName' 的候选者。请使用 getContacts 并要求用户选择。"
        }
        return matches.mapIndexed { idx, c ->
            "${idx + 1}. ${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})"
        }.joinToString("
")
    }

    @Tool
    @LLMDescription(
        """
        将资金从用户发送到联系人。
        如果 confirmed=false，则返回 "REQUIRES_CONFIRMATION" 以及人类可读的摘要。
        在以 confirmed=true 重试之前，智能体应先向用户确认。
        """
    )
    fun sendMoney(
        @LLMDescription("发送者用户 id。") senderId: Int,
        @LLMDescription("以发送者默认货币表示的金额。") amount: Double,
        @LLMDescription("收款人联系人 id。") recipientId: Int,
        @LLMDescription("简短的目的/描述。") purpose: String,
        @LLMDescription("用户是否已确认此次转账。") confirmed: Boolean = false
    ): String {
        val recipient = contactById[recipientId] ?: return "无效的收款人。"
        val summary = "向 %s %s (%s) 转账 €%.2f，备注为 \"%s\"。"
            .format(recipient.name, recipient.surname ?: "", recipient.phoneNumber, amount, purpose)

        if (!confirmed) {
            return "REQUIRES_CONFIRMATION: $summary"
        }

        // 在真实系统中，此处将调用支付 API。
        return "资金已发送。$summary"
    }
}
```

## 创建您的第一个智能体
现在，让我们创建一个使用资金转账工具的智能体。
智能体将 LLM 与工具结合起来以完成任务。

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
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = bankingAssistantSystemPrompt,
    temperature = 0.0,  // 对金融操作使用确定性响应
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// 使用各种场景测试智能体
println("银行助手已启动")
val message = "给 Daniel 发送 25 欧元，用于在餐厅吃晚饭。"

// 您可以尝试的其他测试消息：
// - "给 Alice 发送 50 欧元买演唱会门票"
// - "我目前的余额是多少？"
// - "向 Bob 转账 100 欧元，用于分摊度假费用"

runBlocking {
    val result = transferAgentService.createAgentAndRun(message)
    result
}
```

    银行助手已启动
    有两名联系人名为 Daniel。请确认您想给哪一位发款：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请确认向 Daniel Garcia (+34 612 345 678) 转账 €25.00，备注为“在餐厅吃晚饭”。

    任务成功完成。

## 添加交易分析
让我们通过交易分析工具扩展助手的功能。
首先，我们将定义交易领域模型。

```kotlin
@Serializable
enum class TransactionCategory(val title: String) {
    FOOD_AND_DINING("餐饮"),
    SHOPPING("购物"),
    TRANSPORTATION("交通"),
    ENTERTAINMENT("娱乐"),
    GROCERIES("日用品"),
    HEALTH("医疗健康"),
    UTILITIES("公用事业"),
    HOME_IMPROVEMENT("家居改善");

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

### 示例交易数据

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
@LLMDescription("用于分析交易历史记录的工具")
class TransactionAnalysisTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        检索按 userId、类别、开始日期和结束日期筛选的交易。
        所有参数均为可选。如果未提供参数，则返回所有交易。
        日期格式应为 YYYY-MM-DD。
        """
    )
    fun getTransactions(
        @LLMDescription("要检索其交易的用户 ID。")
        userId: String? = null,
        @LLMDescription("用于筛选交易的类别（例如“餐饮”）。")
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

        // 应用类别筛选
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "无效类别：$cat。可用类别：${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 应用日期范围筛选
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "未找到匹配指定条件的交易。"
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
        @LLMDescription("要相加的以逗号分隔的双精度数字列表（例如 '1.5,2.3,4.7'）。")
        numbers: String
    ): String {
        val numbersList = numbers.split(",")
            .mapNotNull { it.trim().toDoubleOrNull() }
        val sum = numbersList.sum()
        return "总和：$%.2f".format(sum)
    }

    // 用于解析日期的辅助函数
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
val analysisAgentService = AIAgentService(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt",
    temperature = 0.0,
    toolRegistry = ToolRegistry {
        tools(TransactionAnalysisTools().asTools())
    }
)

println("交易分析助手已启动")
val analysisMessage = "我这个月在餐厅花了多少钱？"

// 可以尝试的其他查询：
// - "我这个月在餐厅消费最高的一笔是多少？"
// - "我在 5 月份的第一周花了多少钱买日用品？"
// - "我 5 月份在娱乐方面的总支出是多少？"
// - "显示上周的所有交易"

runBlocking {
    val result = analysisAgentService.createAgentAndRun(analysisMessage)
    result
}
```

    交易分析助手已启动

    您本月在餐厅的总支出为 $517.64。
    
    任务成功完成。

## 使用图 (Graph) 构建智能体
现在，让我们将专门的智能体组合成一个图智能体，它可以将请求路由到适当的处理程序。

### 请求分类
首先，我们需要一种分类传入请求的方法：

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
@LLMDescription("由智能体分类的银行请求。")
data class ClassifiedBankRequest(
    @property:LLMDescription("请求类型：转账或分析")
    val requestType: RequestType,
    @property:LLMDescription("银行应用程序要执行的实际请求")
    val userRequest: String
)
```

### 共享工具注册表

```kotlin
// 为多智能体系统创建一个全面的工具注册表
val toolRegistry = ToolRegistry {
    tool(AskUser)  // 允许智能体寻求澄清
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## 智能体策略

现在我们将创建一个编排多个节点的策略：

```kotlin
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("银行助手") {

    // 用于分类用户请求的子图
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 使用结构化输出以确保正确的分类
        val requestClassification by nodeLLMRequestStructured<ClassifiedBankRequest>(
            examples = listOf(
                ClassifiedBankRequest(
                    requestType = RequestType.Transfer,
                    userRequest = "给 Daniel 发送 25 欧元，用于在餐厅吃晚饭。"
                ),
                ClassifiedBankRequest(
                    requestType = RequestType.Analytics,
                    userRequest = "提供上个月的交易概览"
                )
            ),
            fixingParser = StructureFixingParser(
                model = OpenAIModels.Chat.GPT4oMini,
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
                transformed { it.getOrThrow().data }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "未能理解用户的意图" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "请调用 `${AskUser.name}` 工具而不是直接聊天" }
        )

        edge(callAskUserTool forwardTo requestClassification
            transformed { it.result.toString() })
    }

    // 用于处理资金转账的子图
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 为转账使用更强大的模型
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        具体来说，您需要帮助处理以下请求：
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
        具体来说，您需要帮助处理以下请求：
        ${request.userRequest}
        """.trimIndent()
    }

    // 连接子图
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 将结果路由到完成节点
    edge(transferMoney forwardTo nodeFinish)
    edge(transactionAnalysis forwardTo nodeFinish)
}
```

```kotlin
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt

val agentConfig = AIAgentConfig(
    prompt = prompt(id = "银行助手") {
        system("$bankingAssistantSystemPrompt
$transactionAnalysisPrompt")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50  // 允许复杂的多步骤操作
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## 运行图智能体

```kotlin
println("银行助手已启动")
val testMessage = "给 Daniel 发送 25 欧元，用于在餐厅吃晚饭。"

// 测试各种场景：
// 转账请求：
//   - "给 Alice 发送 50 欧元买演唱会门票"
//   - "向 Bob 转账 100 欧元买日用品"
//   - "我目前的余额是多少？"
//
// 分析请求：
//   - "我这个月在餐厅花了多少钱？"
//   - "我这个月在餐厅消费最高的一笔是多少？"
//   - "我在 5 月份的第一周花了多少钱买日用品？"
//   - "我 5 月份在娱乐方面的总支出是多少？"

runBlocking {
    val result = agent.run(testMessage)
    "结果：$result"
}
```

    银行助手已启动
    我找到了多位名为 Daniel 的联系人。请选择正确的一位：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请指定正确收款人的编号。
    请确认您是否要继续向 Daniel Garcia 发送 €25，备注为“在餐厅吃晚饭”。

    结果：任务成功完成。

## 智能体组合 —— 将智能体作为工具使用

Koog 允许您将智能体作为工具在其他智能体中使用，从而实现强大的组合模式。

```kotlin
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Chat.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // 将智能体转换为工具
        tool(
            transferAgentService.createAgentTool(
                agentName = "transferMoney",
                agentDescription = "转账资金并处理所有相关操作",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "来自用户的转账请求",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgentService.createAgentTool(
                agentName = "analyzeTransactions",
                agentDescription = "对用户交易执行分析",
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

## 运行组合智能体

```kotlin
println("银行助手已启动")
val composedMessage = "给 Daniel 发送 25 欧元，用于在餐厅吃晚饭。"

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "结果：$result"
}
```

    银行助手已启动
    有两名联系人名为 Daniel。请确认您想给哪一位发款：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    请确认向 Daniel Anderson (+46 70 123 45 67) 转账 €25.00，备注为“在餐厅吃晚饭”。

    结果：无法执行任务。

## 总结
在本教程中，您学习了如何：

1. 创建带有清晰描述的 LLM 驱动工具，帮助 AI 理解何时以及如何使用它们
2. 构建单一用途的智能体，将 LLM 与工具结合以完成特定任务
3. 使用策略 (Strategy) 和子图 (Subgraph) 实现处理复杂工作流的图智能体
4. 通过将智能体作为其他智能体中的工具使用来实现组合
5. 处理用户交互，包括确认和消除歧义

## 最佳实践

1. 清晰的工具描述：编写详细的 `LLMDescription` 注解，帮助 AI 理解工具用法
2. 惯用的 Kotlin：利用 Kotlin 特性，如数据类、扩展函数和作用域函数
3. 错误处理：始终验证输入并提供有意义的错误消息
4. 用户体验：针对关键操作（如资金转账）包含确认步骤
5. 模块化：将关注点分离到不同的工具和智能体中，以获得更好的可维护性