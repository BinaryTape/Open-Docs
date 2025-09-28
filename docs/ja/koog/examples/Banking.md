# KoogでAIバンキングアシスタントを構築する

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb
){ .md-button }

このチュートリアルでは、Kotlinで**Koog**エージェントを使用して、小規模なバンキングアシスタントを構築します。
ここでは、以下の方法を学びます。
- ドメインモデルとサンプルデータを定義する
- **資金移動**と**取引分析**のための機能に特化したツールを公開する
- ユーザーの意図を分類する（移動 vs 分析）
- 2つのスタイルで呼び出しをオーケストレーションする：
  1) グラフ/サブグラフ戦略
  2) 「ツールとしてのエージェント」

最終的には、自由形式のユーザーリクエストを適切なツールにルーティングし、役立つ監査可能な応答を生成できるようになります。

## セットアップと依存関係

Kotlin Notebookカーネルを使用します。KoogアーティファクトがMaven Centralから解決可能であり、LLMプロバイダーキーが`OPENAI_API_KEY`経由で利用可能であることを確認してください。

```kotlin
%useLatestDescriptors
%use datetime

// Maven Centralからkoogを使用する場合は、これをコメント解除してください
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## システムプロンプトの定義

適切に作成されたシステムプロンプトは、AIがその役割と制約を理解するのに役立ちます。このプロンプトがすべてのエージェントの動作を導きます。

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

まず、ドメインモデルとサンプルデータを定義しましょう。Kotlinのデータクラスとシリアライゼーションサポートを使用します。

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

## ツール：資金移動

ツールは**純粋**で予測可能であるべきです。

2つの「ソフトコントラクト」をモデル化します。
- `chooseRecipient` は、曖昧さが検出された場合に*候補*を返します。
- `sendMoney` は `confirmed` フラグをサポートします。`false` の場合、エージェントにユーザーに確認を求めます。

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
        else -> "為替レートの情報はありません。"
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
            return "'$confusingRecipientName' の候補が見つかりませんでした。getContactsを使用して、ユーザーに選択を依頼してください。"
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
        val recipient = contactById[recipientId] ?: return "無効な受取人です。"
        val summary = "%.2fユーロを %s %s (%s) に「%s」の目的で送金します。"
            .format(amount, recipient.name, recipient.surname ?: "", recipient.phoneNumber, purpose)

        if (!confirmed) {
            return "REQUIRES_CONFIRMATION: $summary"
        }

        // 実際のシステムでは、ここで支払いAPIを呼び出します。
        return "送金が完了しました。$summary"
    }
}
```

## 最初のエージェントの作成
では、資金移動ツールを使用するエージェントを作成しましょう。
エージェントはLLMとツールを組み合わせてタスクを実行します。

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
    temperature = 0.0,  // 金融取引には決定論的な応答を使用
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// さまざまなシナリオでエージェントをテストします
println("バンキングアシスタントが起動しました")
val message = "Send 25 euros to Daniel for dinner at the restaurant."

// 他に試せるテストメッセージ：
// - "Send 50 euros to Alice for the concert tickets"
// - "What's my current balance?"
// - "Transfer 100 euros to Bob for the shared vacation expenses"

runBlocking {
    val result = transferAgent.run(message)
    result
}
```

    バンキングアシスタントが起動しました
    「Daniel」という名前の連絡先が2件見つかりました。どちらに送金しますか？
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Daniel Garcia (+34 612 345 678)に「ディナー代」として25.00ユーロを送金することを確認してください。

    タスクが正常に完了しました。

## 取引分析の追加
アシスタントの機能を取引分析ツールで拡張しましょう。
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

### サンプル取引データ

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

        // userIdを検証します（本番環境では、これは実際のデータベースをクエリします）
        if (userId != null && userId != "123") {
            return "ユーザー $userId の取引は見つかりませんでした。"
        }

        // カテゴリフィルターを適用します
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "無効なカテゴリ: $cat。利用可能なカテゴリ: ${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 日付範囲フィルターを適用します
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "指定された条件に一致する取引は見つかりませんでした。"
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
        return "合計: $%.2f".format(sum)
    }

    // 日付を解析するためのヘルパー関数
    private fun parseDate(dateStr: String, startOfDay: Boolean): LocalDateTime {
        val parts = dateStr.split("-").map { it.toInt() }
        require(parts.size == 3) { "無効な日付形式です。YYYY-MM-DDを使用してください。" }

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

println("取引分析アシスタントが起動しました")
val analysisMessage = "How much have I spent on restaurants this month?"

// 他に試せるクエリ：
// - "What's my maximum check at a restaurant this month?"
// - "How much did I spend on groceries in the first week of May?"
// - "What's my total spending on entertainment in May?"
// - "Show me all transactions from last week"

runBlocking {
    val result = analysisAgent.run(analysisMessage)
    result
}
```

    取引分析アシスタントが起動しました

    今月のレストランでの支出合計は$517.64です。

    タスクが正常に完了しました。

## グラフを持つエージェントの構築
次に、専門エージェントをグラフエージェントに結合し、適切なハンドラーにリクエストをルーティングできるようにします。

### リクエストの分類
まず、受信リクエストを分類する方法が必要です。

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
// マルチエージェントシステム用の包括的なツールレジストリを作成
val toolRegistry = ToolRegistry {
    tool(AskUser)  // エージェントが明確化を求めることを許可
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## エージェント戦略

次に、複数のノードをオーケストレーションする戦略を作成します。

```kotlin
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("バンキングアシスタント") {

    // ユーザーリクエストを分類するためのサブグラフ
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 適切な分類を確実にするために構造化された出力を使用
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

        // フローを定義
        edge(nodeStart forwardTo requestClassification)

        edge(
            requestClassification forwardTo nodeFinish
                onCondition { it.isSuccess }
                transformed { it.getOrThrow().structure }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "ユーザーの意図を理解できませんでした" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "チャットする代わりに `${AskUser.name}` ツールを呼び出してください" }
        )

        edge(callAskUserTool forwardTo requestClassification
            transformed { it.result.toString() })
    }

    // 資金移動を処理するためのサブグラフ
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 資金移動にはより高性能なモデルを使用
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        具体的には、以下のリクエストに対応する必要があります:
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
        具体的には、以下のリクエストに対応する必要があります:
        ${request.userRequest}
        """.trimIndent()
    }

    // サブグラフを接続
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 結果を終了ノードにルーティング
    edge(transferMoney forwardTo nodeFinish)
    edge(transactionAnalysis forwardTo nodeFinish)
}
```

```kotlin
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt

val agentConfig = AIAgentConfig(
    prompt = prompt(id = "バンキングアシスタント") {
        system("$bankingAssistantSystemPrompt
$transactionAnalysisPrompt")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50  // 複雑な多段階操作を許可
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## グラフエージェントの実行

```kotlin
println("バンキングアシスタントが起動しました")
val testMessage = "Send 25 euros to Daniel for dinner at the restaurant."

// さまざまなシナリオをテスト：
// 資金移動リクエスト：
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
    "結果: $result"
}
```

    バンキングアシスタントが起動しました
    「Daniel」という名前の連絡先が複数見つかりました。正しい連絡先を選択してください。
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    正しい受取人の番号を指定してください。
    Daniel Garciaに「レストランでの夕食代」として25ユーロを送金することを確認しますか？

    結果: タスクが正常に完了しました。

## エージェントのコンポジション — ツールとしてのエージェントの使用

Koogでは、他のエージェント内でエージェントをツールとして使用できるため、強力なコンポジションパターンが可能になります。

```kotlin
import ai.koog.agents.core.agent.asTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // エージェントをツールに変換
        tool(
            transferAgent.asTool(
                agentName = "transferMoney",
                agentDescription = "資金を移動し、関連するすべての操作を処理します",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "ユーザーからの資金移動リクエスト",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgent.asTool(
                agentName = "analyzeTransactions",
                agentDescription = "ユーザーの取引に対する分析を実行します",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "取引分析リクエスト",
                    type = ToolParameterType.String
                )
            )
        )
    },
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt"
)
```

## 構成されたエージェントの実行

```kotlin
println("バンキングアシスタントが起動しました")
val composedMessage = "Send 25 euros to Daniel for dinner at the restaurant."

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "結果: $result"
}
```

    バンキングアシスタントが起動しました
    「Daniel」という名前の連絡先が2件見つかりました。どちらに送金しますか？
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    Daniel Anderson (+46 70 123 45 67)に「ディナー代」として25.00ユーロを送金することを確認してください。

    結果: タスクを実行できません。

## まとめ
このチュートリアルでは、以下の方法を学びました。

1. AIがツールをいつどのように使用するかを理解するのに役立つ、明確な説明を持つLLM駆動ツールを作成する
2. 特定のタスクを達成するためにLLMとツールを組み合わせた単一目的エージェントを構築する
3. 複雑なワークフローのために戦略とサブグラフを使用したグラフエージェントを実装する
4. エージェントを他のエージェント内のツールとして使用することで、エージェントを構成する
5. 確認や曖昧さの解消を含むユーザーインタラクションを処理する

## ベストプラクティス

1. 明確なツール説明: AIがツールの使用法を理解するのに役立つ詳細な`LLMDescription`アノテーションを記述する
2. イディオマティックなKotlin: データクラス、拡張関数、スコープ関数などのKotlin機能を使用する
3. エラー処理: 常にバリデーションを行い、意味のあるエラーメッセージを提供する
4. ユーザーエクスペリエンス: 資金移動のような重要な操作には確認ステップを含める
5. モジュール性: メンテナンス性を向上させるために、関心を異なるツールやエージェントに分離する