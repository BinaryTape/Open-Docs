# Koog を使用した AI 銀行アシスタントの構築

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb
){ .md-button }

このチュートリアルでは、Kotlin の **Koog** エージェントを使用して、小規模な銀行アシスタントを構築します。
以下の方法について学びます：
- ドメインモデルとサンプルデータの定義
- **送金**および**取引分析**に特化したツールの公開
- ユーザーの意図（送金 vs 取引分析）の分類
- 2つのスタイルによる呼び出しのオーケストレーション：
  1) グラフ/サブグラフ戦略
  2) 「ツールとしてのエージェント」

最後には、自由形式のユーザーリクエストを適切なツールにルーティングし、役立つ、かつ監査可能なレスポンスを生成できるようになります。

## セットアップと依存関係

Kotlin Notebook カーネルを使用します。Koog のアーティファクトが Maven Central から解決可能であること、および LLM プロバイダーのキーが `OPENAI_API_KEY` を通じて利用可能であることを確認してください。

```kotlin
%useLatestDescriptors
%use datetime

// Maven Central から koog を使用する場合は、この行のコメントを解除してください
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## システムプロンプトの定義

適切に設計されたシステムプロンプトは、AI が自身の役割と制約を理解するのに役立ちます。このプロンプトは、すべてのエージェントの動作をガイドします。

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

## ドメインモデルとサンプルデータ

まず、ドメインモデルとサンプルデータを定義しましょう。Kotlin のデータクラスとシリアライズ・サポートを使用します。

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

## ツール：送金

ツールは**純粋 (pure)** で予測可能である必要があります。

ここでは2つの「ソフトコントラクト」をモデル化します：
- `chooseRecipient` は、曖昧さが検出された場合に「候補」を返します。
- `sendMoney` は `confirmed` フラグをサポートします。`false` の場合、エージェントにユーザーへの確認を求めます。

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

        // 実際のシステムでは、ここで決済 API を呼び出します。
        return "Money was sent. $summary"
    }
}
```

## 最初のエージェントの作成
それでは、送金ツールを使用するエージェントを作成しましょう。
エージェントは LLM とツールを組み合わせて、タスクを遂行します。

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
    temperature = 0.0,  // 金融操作には決定論的なレスポンスを使用します
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// さまざまなシナリオでエージェントをテストします
println("Banking Assistant started")
val message = "Send 25 euros to Daniel for dinner at the restaurant."

// 他に試せるテストメッセージ：
// - "Send 50 euros to Alice for the concert tickets"
// - "What's my current balance?"
// - "Transfer 100 euros to Bob for the shared vacation expenses"

runBlocking {
    val result = transferAgentService.createAgentAndRun(message)
    result
}
```

    Banking Assistant started
    There are two contacts named Daniel. Please confirm which one you would like to send money to:
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Please confirm the transfer of €25.00 to Daniel Garcia (+34 612 345 678) for "Dinner at the restaurant".

    Task completed successfully.

## 取引分析の追加
取引分析ツールを追加して、アシスタントの機能を拡張しましょう。
まず、取引のドメインモデルを定義します。

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

### 取引サンプルデータ

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

## 取引分析ツール

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

        // userId の検証 (本番環境では実際のデータベースに問い合わせます)
        if (userId != null && userId != "123") {
            return "No transactions found for user $userId."
        }

        // カテゴリフィルタの適用
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "Invalid category: $cat. Available: ${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 日付範囲フィルタの適用
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

    // 日付をパースするためのヘルパー関数
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

println("Transaction Analysis Assistant started")
val analysisMessage = "How much have I spent on restaurants this month?"

// 他に試せるクエリ：
// - "What's my maximum check at a restaurant this month?"
// - "How much did I spend on groceries in the first week of May?"
// - "What's my total spending on entertainment in May?"
// - "Show me all transactions from last week"

runBlocking {
    val result = analysisAgentService.createAgentAndRun(analysisMessage)
    result
}
```

    Transaction Analysis Assistant started

    You have spent a total of $517.64 on restaurants this month. 
    
    Task completed successfully.

## グラフを使用したエージェントの構築
次に、これらの特化型エージェントを、リクエストを適切なハンドラーにルーティングできるグラフ・エージェントとして統合しましょう。

### リクエストの分類
まず、入力リクエストを分類する方法が必要です：

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

### 共有ツールレジストリ

```kotlin
// マルチエージェントシステム用の包括的なツールレジストリを作成します
val toolRegistry = ToolRegistry {
    tool(AskUser)  // エージェントが説明を求められるようにします
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## エージェント戦略

複数のノードを調整するストラテジーを作成します：

```kotlin
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("banking assistant") {

    // ユーザーリクエストを分類するためのサブグラフ
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 適切な分類を確実にするために、構造化出力を使用します
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
                model = OpenAIModels.Chat.GPT4oMini,
                retries = 2,
            )
        )

        val callLLM by nodeLLMRequest()
        val callAskUserTool by nodeExecuteTool()

        // フローを定義します
        edge(nodeStart forwardTo requestClassification)

        edge(
            requestClassification forwardTo nodeFinish
                onCondition { it.isSuccess }
                transformed { it.getOrThrow().data }
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

    // 送金を処理するためのサブグラフ
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 送金にはより高性能なモデルを使用します
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        Specifically, you need to help with the following request:
        ${request.userRequest}
        """.trimIndent()
    }

    // 取引分析のためのサブグラフ
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

    // サブグラフを接続します
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 結果を終了ノードにルーティングします
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
    maxAgentIterations = 50  // 複雑なマルチステップ操作を可能にします
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## グラフ・エージェントの実行

```kotlin
println("Banking Assistant started")
val testMessage = "Send 25 euros to Daniel for dinner at the restaurant."

// さまざまなシナリオをテスト：
// 送金リクエスト：
//   - "Send 50 euros to Alice for the concert tickets"
//   - "Transfer 100 to Bob for groceries"
//   - "What's my current balance?"
//
// 分析リクエスト：
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

## エージェントの構成 — エージェントをツールとして使用する

Koog では、エージェントを他のエージェント内でツールとして使用することができ、強力な構成（コンポジション）パターンを実現できます。

```kotlin
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Chat.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // エージェントをツールに変換します
        tool(
            transferAgentService.createAgentTool(
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
            analysisAgentService.createAgentTool(
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

## 構成済みエージェントの実行

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

## まとめ
このチュートリアルでは、以下の内容を学びました：

1. AI がいつどのように使用するかを理解できるように、明確な説明文（description）を備えた LLM 駆動ツールの作成
2. LLM とツールを組み合わせて特定のタスクを遂行する単一目的エージェントの構築
3. ストラテジーとサブグラフを使用した、複雑なワークフロー向けのグラフ・エージェントの実装
4. エージェントを他のエージェント内のツールとして使用することによるエージェントの構成
5. 確認や曖昧さの解消を含む、ユーザーとの対話の処理

## ベストプラクティス

1. 明確なツールの説明：AI がツールの使用方法を理解できるように、詳細な `LLMDescription` アノテーションを記述します。
2. 慣用的な Kotlin：データクラス、拡張関数、スコープ関数などの Kotlin の機能を活用します。
3. エラー処理：常に入力を検証し、意味のあるエラーメッセージを提供します。
4. ユーザーエクスペリエンス：送金などの重要な操作には確認ステップを含めます。
5. モジュール性：保守性を高めるために、関心事を異なるツールやエージェントに分離します。