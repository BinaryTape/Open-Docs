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

// 取消註解此行以使用 Maven Central 的 Koog
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
    |You are a banking assistant interacting with a user (userId=123).
    |Your goal is to understand the user's request and determine whether it can be fulfilled using the available tools.
    |
    |If the task can be accomplished with the provided tools, proceed accordingly,
    |at the end of the conversation respond with: "Task completed successfully."
    |If the task cannot be performed with the tools available, respond with: "Can't perform the task."
""".trimMargin()
```

## 領域模型與範例資料

首先，讓我們定義我們的領域模型和範例資料。我們將使用 Kotlin 的 data class 並支援序列化。

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

@LLMDescription("Tools for money transfer operations.")
class MoneyTransferTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        Returns the list of contacts for the given user.
        The user in this demo is always userId=123.
        """
    )
    fun getContacts(
        @LLMDescription("The unique identifier of the user whose contact list is requested.") userId: Int
    ): String = buildString {
        contactList.forEach { c ->
            appendLine("${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})")
        }
    }.trimEnd()

    @Tool
    @LLMDescription("Returns the current balance (demo value).")
    fun getBalance(
        @LLMDescription("The unique identifier of the user.") userId: Int
    ): String = "Balance: 200.00 EUR"

    @Tool
    @LLMDescription("Returns the default user currency (demo value).")
    fun getDefaultCurrency(
        @LLMDescription("The unique identifier of the user.") userId: Int
    ): String = "EUR"

    @Tool
    @LLMDescription("Returns a demo FX rate between two ISO currencies (e.g. EUR→USD).")
    fun getExchangeRate(
        @LLMDescription("Base currency (e.g., EUR).") from: String,
        @LLMDescription("Target currency (e.g., USD).") to: String
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
        Returns a ranked list of possible recipients for an ambiguous name.
        The agent should ask the user to pick one and then use the selected contact id.
        """
    )
    fun chooseRecipient(
        @LLMDescription("An ambiguous or partial contact name.") confusingRecipientName: String
    ): String {
        val matches = contactList.filter { c ->
            c.name.contains(confusingRecipientName, ignoreCase = true) ||
                (c.surname?.contains(confusingRecipientName, ignoreCase = true) ?: false)
        }
        if (matches.isEmpty()) {
            return "No candidates found for '$confusingRecipientName'. Use getContacts and ask the user to choose."
        }
        return matches.mapIndexed { idx, c ->
            "${idx + 1}. ${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})"
        }.joinToString("
")
    }

    @Tool
    @LLMDescription(
        """
        Sends money from the user to a contact.
        If confirmed=false, return "REQUIRES_CONFIRMATION" with a human-readable summary.
        The agent should confirm with the user before retrying with confirmed=true.
        """
    )
    fun sendMoney(
        @LLMDescription("Sender user id.") senderId: Int,
        @LLMDescription("Amount in sender's default currency.") amount: Double,
        @LLMDescription("Recipient contact id.") recipientId: Int,
        @LLMDescription("Short purpose/description.") purpose: String,
        @LLMDescription("Whether the user already confirmed this transfer.") confirmed: Boolean = false
    ): String {
        val recipient = contactById[recipientId] ?: return "Invalid recipient."
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
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.agents.ext.tool.AskUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

val transferAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = bankingAssistantSystemPrompt,
    temperature = 0.0,  // 對於金融操作使用確定性回應
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// 使用各種情境測試代理程式
println("Banking Assistant started")
val message = "Send 25 euros to Daniel for dinner at the restaurant."

// 您可以嘗試的其他測試訊息：
// - "Send 50 euros to Alice for the concert tickets"
// - "What's my current balance?"
// - "Transfer 100 euros to Bob for the shared vacation expenses"

runBlocking {
    val result = transferAgent.run(message)
    result
}
```

    Banking Assistant started
    There are two contacts named Daniel. Please confirm which one you would like to send money to:
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Please confirm the transfer of €25.00 to Daniel Garcia (+34 612 345 678) for "Dinner at the restaurant".

    Task completed successfully.

## 新增交易分析
讓我們使用交易分析工具擴展助理的功能。
首先，我們將定義交易領域模型。

```kotlin
import kotlinx.serialization.Serializable

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
@LLMDescription("Tools for analyzing transaction history")
class TransactionAnalysisTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        Retrieves transactions filtered by userId, category, start date, and end date.
        All parameters are optional. If no parameters are provided, all transactions are returned.
        Dates should be in the format YYYY-MM-DD.
        """
    )
    fun getTransactions(
        @LLMDescription("The ID of the user whose transactions to retrieve.")
        userId: String? = null,
        @LLMDescription("The category to filter transactions by (e.g., 'Food & Dining').")
        category: String? = null,
        @LLMDescription("The start date to filter transactions by, in the format YYYY-MM-DD.")
        startDate: String? = null,
        @LLMDescription("The end date to filter transactions by, in the format YYYY-MM-DD.")
        endDate: String? = null
    ): String {
        var filteredTransactions = sampleTransactions

        // 驗證 userId (在生產環境中，這將查詢實際資料庫)
        if (userId != null && userId != "123") {
            return "No transactions found for user $userId."
        }

        // 套用類別篩選器
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "Invalid category: $cat. Available: ${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 套用日期範圍篩選器
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "No transactions found matching the specified criteria."
        }

        return filteredTransactions.joinToString("
") { transaction ->
            "${transaction.date}: ${transaction.merchant} - " +
                "${transaction.amount} (${transaction.category.title})"
        }
    }

    @Tool
    @LLMDescription("Calculates the sum of an array of double numbers.")
    fun sumArray(
        @LLMDescription("Comma-separated list of double numbers to sum (e.g., '1.5,2.3,4.7').")
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
        require(parts.size == 3) { "Invalid date format. Use YYYY-MM-DD" }

        return if (startOfDay) {
            LocalDateTime(parts[0], parts[1], parts[2], 0, 0, 0, 0)
        } else {
            LocalDateTime(parts[0], parts[1], parts[2], 23, 59, 59, 999999999)
        }
    }
}
```

```kotlin
val analysisAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt",
    temperature = 0.0,
    toolRegistry = ToolRegistry {
        tools(TransactionAnalysisTools().asTools())
    }
)

println("Transaction Analysis Assistant started")
val analysisMessage = "How much have I spent on restaurants this month?"

// 您可以嘗試的其他查詢：
// - "What's my maximum check at a restaurant this month?"
// - "How much did I spend on groceries in the first week of May?"
// - "What's my total spending on entertainment in May?"
// - "Show me all transactions from last week"

runBlocking {
    val result = analysisAgent.run(analysisMessage)
    result
}
```

    Transaction Analysis Assistant started

    You have spent a total of $517.64 on restaurants this month. 
    
    Task completed successfully.

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
@LLMDescription("Type of user request: Transfer or Analytics")
enum class RequestType { Transfer, Analytics }

@Serializable
@LLMDescription("The bank request that was classified by the agent.")
data class ClassifiedBankRequest(
    @property:LLMDescription("Type of request: Transfer or Analytics")
    val requestType: RequestType,
    @property:LLMDescription("Actual request to be performed by the banking application")
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

val strategy = strategy<String, String>("banking assistant") {

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
                fixingModel = OpenAIModels.CostOptimized.GPT4oMini,
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
                transformed { it.getOrThrow().structure }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "Failed to understand the user's intent" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "Please call `${AskUser.name}` tool instead of chatting" }
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
        Specifically, you need to help with the following request:
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
        Specifically, you need to help with the following request:
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
println("Banking Assistant started")
val testMessage = "Send 25 euros to Daniel for dinner at the restaurant."

// 測試各種情境：
// 轉帳請求：
//   - "Send 50 euros to Alice for the concert tickets"
//   - "Transfer 100 to Bob for groceries"
//   - "What's my current balance?"
//
// 分析請求：
//   - "How much have I spent on restaurants this month?"
//   - "What's my maximum check at a restaurant this month?"
//   - "How much did I spend on groceries in the first week of May?"
//   - "What's my total spending on entertainment in May?"

runBlocking {
    val result = agent.run(testMessage)
    "Result: $result"
}
```

    Banking Assistant started
    I found multiple contacts with the name Daniel. Please choose the correct one:
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Please specify the number of the correct recipient.
    Please confirm if you would like to proceed with sending €25 to Daniel Garcia for "dinner at the restaurant."

    Result: Task completed successfully.

## 代理程式組成 — 將代理程式作為工具使用

Koog 允許您在其他代理程式中將代理程式作為工具使用，從而實現強大的組成模式。

```kotlin
import ai.koog.agents.core.agent.asTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // 將代理程式轉換為工具
        tool(
            transferAgent.asTool(
                agentName = "transferMoney",
                agentDescription = "Transfers money and handles all related operations",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "Transfer request from the user",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgent.asTool(
                agentName = "analyzeTransactions",
                agentDescription = "Performs analytics on user transactions",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "Transaction analytics request",
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
println("Banking Assistant started")
val composedMessage = "Send 25 euros to Daniel for dinner at the restaurant."

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "Result: $result"
}
```

    Banking Assistant started
    There are two contacts named Daniel. Please confirm which one you would like to send money to:
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Please confirm the transfer of €25.00 to Daniel Anderson (+46 70 123 45 67) for "Dinner at the restaurant".

    Result: Can't perform the task.

## 摘要
在本教學課程中，您已學會如何：

1.  建立帶有清晰描述的 LLM 驅動工具，以幫助 AI 理解何時以及如何使用它們
2.  建構將 LLM 與工具結合以完成特定任務的單一目的代理程式
3.  使用策略和子圖實現圖形代理程式以處理複雜的工作流程
4.  透過在其他代理程式中將代理程式作為工具使用來組成代理程式
5.  處理使用者互動，包括確認和消除歧義

## 最佳實踐

1.  **清晰的工具描述：** 編寫詳細的 `LLMDescription` 註釋以幫助 AI 理解工具的使用方式
2.  **慣用 Kotlin：** 使用 Kotlin 功能，例如 data class、擴充函式和作用域函式
3.  **錯誤處理：** 始終驗證輸入並提供有意義的錯誤訊息
4.  **使用者體驗：** 對於資金轉帳等關鍵操作，包含確認步驟
5.  **模組化：** 將不同關注點分離到不同的工具和代理程式中，以提高可維護性