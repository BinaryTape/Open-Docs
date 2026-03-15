# 履歴の圧縮

AIエージェントは、ユーザーメッセージ、アシスタントの応答、ツール呼び出し、およびツールの応答を含むメッセージ履歴を保持します。
この履歴は、エージェントが戦略に従ってインタラクションを行うたびに増加します。

長期間の会話では、履歴が膨大になり、多くのトークンを消費する可能性があります。
履歴の圧縮は、メッセージの全リストを、その後のエージェントの操作に必要な重要な情報のみを含む1つまたは複数のメッセージに要約することで、これを削減するのに役立ちます。

履歴の圧縮は、エージェントシステムにおける以下の主要な課題を解決します：

- **コンテキスト使用の最適化**。コンテキストを絞り込み、小さくすることで、LLMのパフォーマンスを向上させ、トークン制限を超過することによる失敗を防ぎます。
- **パフォーマンスの向上**。履歴を圧縮することでLLMが処理するメッセージ数が減り、応答が速くなります。
- **精度の向上**。関連情報に集中することで、LLMは注意を散らすことなくタスクの完了に専念し続けることができます。
- **コストの削減**。無関係なメッセージを減らすことでトークン使用量が抑えられ、API呼び出しの全体的なコストが低下します。

## 履歴を圧縮するタイミング

履歴の圧縮は、エージェントのワークフローにおける特定のステップで実行されます：

- エージェント戦略の論理的なステップ（サブグラフ）の間。
- コンテキストが長くなりすぎたとき。

## 履歴圧縮の実装

エージェントに履歴の圧縮を実装するには、主に2つのアプローチがあります：

- ストラテジーグラフ内。
- カスタムノード内。

### ストラテジーグラフでの履歴圧縮

ストラテジーグラフで履歴を圧縮するには、`nodeLLMCompressHistory` ノードを使用する必要があります。
圧縮を実行するステップに応じて、以下のシナリオが利用可能です：

* 履歴が長くなりすぎたときに圧縮するには、ヘルパー関数を定義し、以下のロジックでストラテジーグラフに `nodeLLMCompressHistory` ノードを追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.environment.ReceivedToolResult
-->
```kotlin
// メッセージ数が100件を超えている場合に履歴が長すぎると定義する
private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy<String, String>("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // LLMの履歴を圧縮し、現在のReceivedToolResultを次のノードのために保持する
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // 履歴が長すぎる場合、ツールの実行後に履歴 को 圧縮する 
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // そうでない場合は、次のLLMリクエストに進む
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
<!--- KNIT example-history-compression-01.kt -->

この例では、戦略は各ツール呼び出しの後に履歴が長すぎないかを確認します。
ツール実行の結果をLLMに送り返す前に履歴が圧縮されます。これにより、長時間の会話中にコンテキストが増大し続けるのを防ぎます。

* 戦略の論理的なステップ（サブグラフ）の間で履歴を圧縮するには、以下のように戦略を実装できます：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
-->
```kotlin
val strategy = strategy<String, String>("execute-with-history-compression") {
    val collectInformation by subgraph<String, String> {
        // 情報収集のためのいくつかのステップ
    }
    val compressHistory by nodeLLMCompressHistory<String>()
    val makeTheDecision by subgraph<String, String> {
        // 現在の圧縮された履歴と収集された情報に基づいて意思決定を行うためのいくつかのステップ
    }
    
    nodeStart then collectInformation then compressHistory then makeTheDecision
}
```
<!--- KNIT example-history-compression-02.kt -->

この例では、情報収集フェーズが完了した後、意思決定フェーズに進む前に履歴が圧縮されます。

### カスタムノードでの履歴圧縮

カスタムノードを実装している場合は、以下のように `replaceHistoryWithTLDR()` 関数を使用して履歴を圧縮できます：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR()
}
```
<!--- KNIT example-history-compression-03.kt -->

このアプローチにより、特定の要件に基づいて、カスタムノードのロジック内の任意のポイントで柔軟に圧縮を実装できます。

カスタムノードの詳細については、[Custom nodes](custom-nodes.md) を参照してください。

## 履歴圧縮の戦略（History compression strategies）

`nodeLLMCompressHistory(strategy=...)` または `replaceHistoryWithTLDR(strategy=...)` にオプションの `strategy` パラメータを渡すことで、圧縮プロセスをカスタマイズできます。
フレームワークは、いくつかの組み込み戦略を提供しています。

### WholeHistory (デフォルト)

履歴全体を、これまでに達成された内容を要約する1つのTLDRメッセージに圧縮するデフォルトの戦略です。
この戦略は、トークン使用量を削減しながら、会話全体のコンテキストを把握し続けたいほとんどの一般的なユースケースに適しています。

以下のように使用できます：

* ストラテジーグラフ内：
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory
)
```
<!--- KNIT example-history-compression-04.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.WholeHistory)
}
```
<!--- KNIT example-history-compression-05.kt -->

### FromLastNMessages

この戦略は、最後の `n` 個のメッセージのみをTLDRメッセージに圧縮し、それ以前のメッセージを完全に破棄します。
これは、エージェントの最新の成果（または最新の発見、最新のコンテキスト）のみが問題解決に関連する場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.FromLastNMessages(5)
)
```
<!--- KNIT example-history-compression-06.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.FromLastNMessages(5))
}
```
<!--- KNIT example-history-compression-07.kt -->

### Chunked

この戦略は、メッセージ履歴全体を固定サイズのチャンクに分割し、各チャンクを個別にTLDRメッセージに圧縮します。
これは、これまでに何が行われたかの簡潔な要約だけでなく、全体的な進捗も把握し続ける必要があり、古い情報も重要である可能性がある場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.Chunked(10)
)
```
<!--- KNIT example-history-compression-08.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.Chunked(10))
}
```
<!--- KNIT example-history-compression-09.kt -->

### RetrieveFactsFromHistory

この戦略は、履歴の中から提供されたコンセプトのリストに関連する特定の事実を検索して抽出します。
履歴全体をこれらの事実のみに変更し、将来のLLMリクエストのためのコンテキストとして残します。
これは、タスクをより適切に実行するためにLLMにとってどのような具体的な事実が関連するか、あらかじめ分かっている場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.memory.feature.history.RetrieveFactsFromHistory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = RetrieveFactsFromHistory(
        Concept(
            keyword = "user_preferences",
            // LLMへの説明 -- 具体的に何を検索するか
            description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
            // LLMはこのコンセプトに関連する複数の関連事実を検索する：
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "product_details",
            // LLMへの説明 -- 具体的に何を検索するか
            description = "Brief details about products in the catalog the user has been checking",
            // LLMはこのコンセプトに関連する複数の関連事実を検索する：
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "issue_solved",
            // LLMへの説明 -- 具体的に何を検索するか
            description = "Was the initial user's issue resolved?",
            // LLMはこの質問に対する単一の回答を検索する：
            factType = FactType.SINGLE
        )
    )
)
```
<!--- KNIT example-history-compression-10.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR
import ai.koog.agents.memory.feature.history.RetrieveFactsFromHistory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = RetrieveFactsFromHistory(
            Concept(
                keyword = "user_preferences", 
                // LLMへの説明 -- 具体的に何を検索するか
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLMはこのコンセプトに関連する複数の関連事実を検索する：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // LLMへの説明 -- 具体的に何を検索するか
                description = "Brief details about products in the catalog the user has been checking",
                // LLMはこのコンセプトに関連する複数の関連事実を検索する：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // LLMへの説明 -- 具体的に何を検索するか
                description = "Was the initial user's issue resolved?",
                // LLMはこの質問に対する単一의 回答を検索する：
                factType = FactType.SINGLE
            )
        )
    )
}
```
<!--- KNIT example-history-compression-11.kt -->

## カスタム履歴圧縮戦略の実装

`HistoryCompressionStrategy` 抽象クラスを継承し、`compress` メソッドを実装することで、独自の履歴圧縮戦略を作成できます。

以下に例を示します：

<!--- INCLUDE
import ai.koog.agents.core.agent.session.AIAgentLLMWriteSession
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.prompt.message.Message
-->
```kotlin
class MyCustomCompressionStrategy : HistoryCompressionStrategy() {
    override suspend fun compress(
        llmSession: AIAgentLLMWriteSession,
        memoryMessages: List<Message>
    ) {
        // 1. llmSession.prompt.messages にある現在の履歴を処理する
        // 2. 新しく圧縮されたメッセージを作成する
        // 3. 圧縮されたメッセージでプロンプトを更新する

        // 元のメッセージを保存しておく
        val originalMessages = llmSession.prompt.messages
        
        // 実装例：
        val importantMessages = llmSession.prompt.messages.filter {
            // カスタムのフィルタリングロジック
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // 注：`llmSession` を使用してLLMリクエストを行い、LLMに作業を依頼することもできます（例：`llmSession.requestLLMWithoutTools()`）
        // または、現在のモデルを変更することも可能です：`llmSession.model = AnthropicModels.Opus_4_6` として別のLLMモデルに依頼する。ただし、後で戻すのを忘れないでください。

        // フィルタリングされたメッセージでプロンプトを構成する
        val compressedMessages = composeMessageHistory(
            originalMessages,
            importantMessages,
            memoryMessages
        )
    }
}
```
<!--- KNIT example-history-compression-12.kt -->

この例では、カスタム戦略は "important" という単語を含むメッセージをフィルタリングし、それらのみを圧縮履歴に保持します。

その後、以下のように使用できます：

* ストラテジーグラフ内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.example.exampleHistoryCompression12.MyCustomCompressionStrategy

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = MyCustomCompressionStrategy()
)
```
<!--- KNIT example-history-compression-13.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR
import ai.koog.agents.example.exampleHistoryCompression12.MyCustomCompressionStrategy

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = MyCustomCompressionStrategy())
}
```
<!--- KNIT example-history-compression-14.kt -->

## 圧縮中のメモリ保持（Memory preservation during compression）

すべての履歴圧縮メソッドには、圧縮中にメモリ関連のメッセージを保持するかどうかを決定する `preserveMemory` パラメータがあります。
これらは、メモリから抽出された事実を含むメッセージや、メモリ機能が有効になっていないことを示すメッセージです。

`preserveMemory` パラメータは以下のように使用できます：

* ストラテジーグラフ内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory,
    preserveMemory = true
)
```
<!--- KNIT example-history-compression-15.kt -->

* カスタムノード内：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.subgraph
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = HistoryCompressionStrategy.WholeHistory,
        preserveMemory = true
    )
}
```
<!--- KNIT example-history-compression-16.kt -->