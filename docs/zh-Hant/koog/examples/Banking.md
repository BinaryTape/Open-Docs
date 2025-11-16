# 使用 Koog 建立 AI 銀行助理

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb
){ .md-button }

在本教學課程中，我們將使用 Kotlin 中的 **Koog** 代理程式來建構一個小型銀行助理。
您將學習如何：
- 定義領域模型 (domain models) 和範例資料
- 針對**資金轉帳 (money transfers)** 和**交易分析 (transaction analytics)** 揭露以能力為中心的工具
- 分類使用者意圖 (user intent) (轉帳 vs. 分析)
- 以兩種風格協調呼叫：
  1) 圖形/子圖 (graph/subgraph) 策略
  2) 「代理程式作為工具 (agents as tools)」

最後，您將能夠將自由形式的使用者請求路由到正確的工具，並產生有幫助且可稽核的回應。

## 設定與依賴項

我們將使用 Kotlin Notebook 核心。請確保您的 Koog 構件可從 Maven Central 解析，並且您的 LLM 供應商金鑰可透過 `OPENAI_API_KEY` 取得。

```kotlin
%useLatestDescriptors
%use datetime

// uncomment this for using koog from Maven Central
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## 定義系統提示

一個精心設計的系統提示 (system prompt) 有助於 AI 理解其角色和限制。此提示將指導我們所有代理程式的行為。

```kotlin
val bankingAssistantSystemPrompt = """
    |您是一位銀行助理，正在與使用者 (userId=123) 互動。
    |您的目標是理解使用者的請求，並判斷是否可以使用可用工具來完成。
    |
    |如果任務可以使用提供的工具完成，請照常進行，
    |在對話結束時回應：「任務已成功完成。」
    |如果任務無法使用可用工具執行，請回應：「無法執行任務。」
""".trimMargin()
```

## 領域模型與範例資料

首先，讓我們定義我們的領域模型和範例資料。我們將使用 Kotlin 的資料類別 (data class) 並支援序列化。

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

## 工具：資金轉帳

工具應該是**純粹的 (pure)** 且**可預測的 (predictable)**。

我們模擬兩個「軟性合約 (soft contracts)」：
- `chooseRecipient` 在檢測到歧義時傳回*候選人 (candidates)*。
- `sendMoney` 支援 `confirmed` 標誌。如果為 `false`，它會要求代理程式與使用者確認。

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

@LLMDescription("錢財轉帳操作的工具。")
class MoneyTransferTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        傳回指定使用者的聯絡人清單。
        此示範中的使用者始終為 userId=123。
        """
    )
    fun getContacts(
        @LLMDescription("請求聯絡人清單之使用者的唯一識別碼。") userId: Int
    ): String = buildString {
        contactList.forEach { c ->
            appendLine("${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})")
        }
    }.trimEnd()

    @Tool
    @LLMDescription("傳回目前餘額 (示範值)。")
    fun getBalance(
        @LLMDescription("使用者的唯一識別碼。") userId: Int
    ): String = "Balance: 200.00 EUR"

    @Tool
    @LLMDescription("傳回預設使用者貨幣 (示範值)。")
    fun getDefaultCurrency(
        @LLMDescription("使用者的唯一識別碼。") userId: Int
    ): String = "EUR"

    @Tool
    @LLMDescription("傳回兩個 ISO 貨幣之間的示範匯率 (例如 EUR→USD)。")
    fun getExchangeRate(
        @LLMDescription("基礎貨幣 (例如，EUR)。") from: String,
        @LLMDescription("目標貨幣 (例如，USD)。") to: String
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
        傳回模稜兩可名稱的可能收款人排名清單。
        代理程式應要求使用者選擇其中一個，然後使用選定的聯絡人 ID。
        """
    )
    fun chooseRecipient(
        @LLMDescription("模稜兩可或部分聯絡人名稱。") confusingRecipientName: String
    ): String {
        val matches = contactList.filter { c ->
            c.name.contains(confusingRecipientName, ignoreCase = true) ||
                (c.surname?.contains(confusingRecipientName, ignoreCase = true) ?: false)
        }
        if (matches.isEmpty()) {
            return "找不到名稱為 '$confusingRecipientName' 的候選人。請使用 getContacts 並要求使用者選擇。"
        }
        return matches.mapIndexed { idx, c ->
            "${idx + 1}. ${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})"
        }.joinToString("
")
    }

    @Tool
    @LLMDescription(
        """
        將錢從使用者傳送給聯絡人。
        如果 confirmed=false，則傳回「REQUIRES_CONFIRMATION」並附上人類可讀的摘要。
        代理程式應在以 confirmed=true 重試之前與使用者確認。
        """
    )
    fun sendMoney(
        @LLMDescription("寄件使用者 ID。") senderId: Int,
        @LLMDescription("寄件人預設貨幣的金額。") amount: Double,
        @LLMDescription("收款人聯絡人 ID。") recipientId: Int,
        @LLMDescription("簡短目的/描述。") purpose: String,
        @LLMDescription("使用者是否已確認此轉帳。") confirmed: Boolean = false
    ): String {
        val recipient = contactById[recipientId] ?: return "無效收款人。"
        val summary = "Transfer €%.2f to %s %s (%s) for \"%s\"."
            .format(amount, recipient.name, recipient.surname ?: "", recipient.phoneNumber, purpose)

        if (!confirmed) {
            return "REQUIRES_CONFIRMATION: $summary"
        }

        // 在實際系統中，這就是您呼叫付款 API 的地方。
        return "Money was sent. $summary"
    }
}
```

## 建立您的第一個代理程式
現在讓我們建立一個使用資金轉帳工具的代理程式。
代理程式將 LLM 與工具結合以完成任務。

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
    temperature = 0.0,  // Use deterministic responses for financial operations
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// 使用各種情境測試代理程式
println("銀行助理已啟動")
val message = "Send 25 euros to Daniel for dinner at the restaurant."

// 您可以嘗試的其他測試訊息：
// - "傳送 50 歐元給 Alice 作為音樂會門票"
// - "我的目前餘額是多少？"
// - "轉帳 100 歐元給 Bob 作為共享假期費用"

runBlocking {
    val result = transferAgentService.createAgentAndRun(message)
    result
}
```

    銀行助理已啟動
    有兩個名為 Daniel 的聯絡人。請確認您想將錢傳送給哪一位：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    請確認將 €25.00 轉帳給 Daniel Garcia (+34 612 345 678) 作為「餐廳晚餐」。

    任務已成功完成。

## 新增交易分析
讓我們使用交易分析工具擴展助理的功能。
首先，我們將定義交易領域模型。

```kotlin
@Serializable
enum class TransactionCategory(val title: String) {
    FOOD_AND_DINING("Food & Dining"),
    SHOPPING("Shopping"),
    TRANSPORTATION("Transportation"),
    ENTERTAINMENT("Entertainment"),
    GROCERIES("Groceries"),
    HEALTH("Health"),
    UTILITIES("Utilities"),
    HOME_IMPROVEMENT("Home Improvement");

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

### 範例交易資料

```kotlin
val transactionAnalysisPrompt = """
Today is 2025-05-22.
Available categories for transactions: ${TransactionCategory.availableCategories()}
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
@LLMDescription("用於分析交易歷史的工具。")
class TransactionAnalysisTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        根據 userId、類別、開始日期和結束日期篩選交易。
        所有參數都是可選的。如果未提供任何參數，則傳回所有交易。
        日期應為 YYYY-MM-DD 格式。
        """
    )
    fun getTransactions(
        @LLMDescription("要檢索其交易的使用者 ID。")
        userId: String? = null,
        @LLMDescription("用於篩選交易的類別 (例如，'Food & Dining')。")
        category: String? = null,
        @LLMDescription("用於篩選交易的開始日期，格式為 YYYY-MM-DD。")
        startDate: String? = null,
        @LLMDescription("用於篩選交易的結束日期，格式為 YYYY-MM-DD。")
        endDate: String? = null
    ): String {
        var filteredTransactions = sampleTransactions

        // Validate userId (in production, this would query a real database)
        if (userId != null && userId != "123") {
            return "找不到使用者 $userId 的交易。"
        }

        // Apply category filter
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "無效類別：$cat。可用類別：${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // Apply date range filters
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "找不到符合指定條件的交易。"
        }

        return filteredTransactions.joinToString("
") { transaction ->
            "${transaction.date}: ${transaction.merchant} - " +
                "${transaction.amount} (${transaction.category.title})"
        }
    }

    @Tool
    @LLMDescription("計算雙精度浮點數陣列的總和。")
    fun sumArray(
        @LLMDescription("以逗號分隔的雙精度浮點數清單，用於求和 (例如，'1.5,2.3,4.7')。")
        numbers: String
    ): String {
        val numbersList = numbers.split(",")
            .mapNotNull { it.trim().toDoubleOrNull() }
        val sum = numbersList.sum()
        return "Sum: $%.2f".format(sum)
    }

    // 解析日期的輔助函式
    private fun parseDate(dateStr: String, startOfDay: Boolean): LocalDateTime {
        val parts = dateStr.split("-").map { it.toInt() }
        require(parts.size == 3) { "無效日期格式。請使用 YYYY-MM-DD" }

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
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt",
    temperature = 0.0,
    toolRegistry = ToolRegistry {
        tools(TransactionAnalysisTools().asTools())
    }
)

println("交易分析助理已啟動")
val analysisMessage = "How much have I spent on restaurants this month?"

// 您可以嘗試的其他查詢：
// - "我本月在餐廳的最高消費是多少？"
// - "我在五月的第一週在雜貨上花了多少錢？"
// - "我五月在娛樂上的總花費是多少？"
// - "顯示我上週的所有交易"

runBlocking {
    val result = analysisAgentService.createAgentAndRun(analysisMessage)
    result
}
```

    交易分析助理已啟動

    您本月在餐廳共花費 $517.64。
    
    任務已成功完成。

## 使用圖形建立代理程式
現在讓我們將專業代理程式組合成一個圖形代理程式 (graph agent)，它可以將請求路由到適當的處理器。

### 請求分類
首先，我們需要一種方法來分類傳入請求：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Suppress("unused")
@SerialName("UserRequestType")
@Serializable
@LLMDescription("使用者請求的類型：轉帳或分析")
enum class RequestType { Transfer, Analytics }

@Serializable
@LLMDescription("代理程式分類的銀行請求。")
data class ClassifiedBankRequest(
    @property:LLMDescription("請求類型：轉帳或分析")
    val requestType: RequestType,
    @property:LLMDescription("銀行應用程式要執行的實際請求")
    val userRequest: String
)

```

### 共享工具註冊表

```kotlin
// 為多代理程式系統建立一個綜合工具註冊表
val toolRegistry = ToolRegistry {
    tool(AskUser)  // 允許代理程式要求澄清
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## 代理程式策略

現在我們將建立一個協調多個節點的策略：

```kotlin
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("銀行助理") {

    // 用於分類使用者請求的子圖
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 使用結構化輸出以確保正確分類
        val requestClassification by nodeLLMRequestStructured<ClassifiedBankRequest>(
            examples = listOf(
                ClassifiedBankRequest(
                    requestType = RequestType.Transfer,
                    userRequest = "Send 25 euros to Daniel for dinner at the restaurant."
                ),
                ClassifiedBankRequest(
                    requestType = RequestType.Analytics,
                    userRequest = "Provide transaction overview for the last month"
                )
            ),
            fixingParser = StructureFixingParser(
                model = OpenAIModels.CostOptimized.GPT4oMini,
                retries = 2,
            )
        )

        val callLLM by nodeLLMRequest()
        val callAskUserTool by nodeExecuteTool()

        // 定義流程
        edge(nodeStart forwardTo requestClassification)

        edge(
            requestClassification forwardTo nodeFinish
                onCondition { it.isSuccess }
                transformed { it.getOrThrow().data }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "無法理解使用者的意圖" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "請呼叫 `${AskUser.name}` 工具，而不是聊天" }
        )

        edge(callAskUserTool forwardTo requestClassification
            transformed { it.result.toString() })
    }

    // 用於處理資金轉帳的子圖
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 對於轉帳使用功能更強大的模型
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        具體來說，您需要協助處理以下請求：
        ${request.userRequest}
        """.trimIndent()
    }

    // 用於交易分析的子圖
    val transactionAnalysis by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = TransactionAnalysisTools().asTools() + AskUser,
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        $transactionAnalysisPrompt
        具體來說，您需要協助處理以下請求：
        ${request.userRequest}
        """.trimIndent()
    }

    // 連接子圖
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 將結果路由到結束節點
    edge(transferMoney forwardTo nodeFinish)
    edge(transactionAnalysis forwardTo nodeFinish)
}
```

```kotlin
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt

val agentConfig = AIAgentConfig(
    prompt = prompt(id = "banking assistant") {
        system("$bankingAssistantSystemPrompt
$transactionAnalysisPrompt")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50  // 允許複雜的多步驟操作
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## 執行圖形代理程式

```kotlin
println("銀行助理已啟動")
val testMessage = "Send 25 euros to Daniel for dinner at the restaurant."

// 測試各種情境：
// 轉帳請求：
//   - "傳送 50 歐元給 Alice 作為音樂會門票"
//   - "轉帳 100 給 Bob 作為雜貨費用"
//   - "我的目前餘額是多少？"
//
// 分析請求：
//   - "我本月在餐廳花費了多少錢？"
//   - "我本月在餐廳的最高消費是多少？"
//   - "我在五月的第一週在雜貨上花了多少錢？"
//   - "我五月在娛樂上的總花費是多少？"

runBlocking {
    val result = agent.run(testMessage)
    "結果：$result"
}
```

    銀行助理已啟動
    我找到多個名為 Daniel 的聯絡人。請選擇正確的一個：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    請指定正確收款人的號碼。
    請確認您是否要繼續將 €25 傳送給 Daniel Garcia 作為「餐廳晚餐」。

    結果：任務已成功完成。

## 代理程式組成 — 將代理程式作為工具使用

Koog 允許您在其他代理程式中將代理程式作為工具使用，從而實現強大的組成模式。

```kotlin
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // 將代理程式轉換為工具
        tool(
            transferAgentService.createAgentTool(
                agentName = "transferMoney",
                agentDescription = "轉帳並處理所有相關操作",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "來自使用者的轉帳請求",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgentService.createAgentTool(
                agentName = "analyzeTransactions",
                agentDescription = "對使用者交易執行分析",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "交易分析請求",
                    type = ToolParameterType.String
                )
            )
        )
    },
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt"
)
```

## 執行組合代理程式

```kotlin
println("銀行助理已啟動")
val composedMessage = "Send 25 euros to Daniel for dinner at the restaurant."

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "結果：$result"
}
```

    銀行助理已啟動
    有兩個名為 Daniel 的聯絡人。請確認您想將錢傳送給哪一位：
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    請確認將 €25.00 轉帳給 Daniel Anderson (+46 70 123 45 67) 作為「餐廳晚餐」。

    結果：無法執行任務。

## 摘要
在本教學課程中，您已學會如何：

1.  建立具有清晰描述的 LLM 驅動工具，以幫助 AI 理解何時以及如何使用它們
2.  建構將 LLM 與工具結合以完成特定任務的單一目的代理程式
3.  使用策略和子圖實現圖形代理程式以處理複雜的工作流程
4.  透過在其他代理程式中將代理程式作為工具使用來組成代理程式
5.  處理使用者互動，包括確認和消除歧義

## 最佳實踐

1.  清晰的工具描述：編寫詳細的 `LLMDescription` 註釋以幫助 AI 理解工具的使用方式
2.  慣用 Kotlin：使用 Kotlin 功能，例如資料類別、擴充函式和作用域函式
3.  錯誤處理：始終驗證輸入並提供有意義的錯誤訊息
4.  使用者體驗：對於資金轉帳等關鍵操作，包含確認步驟
5.  模組化：將不同關注點分離到不同的工具和代理程式中，以提高可維護性