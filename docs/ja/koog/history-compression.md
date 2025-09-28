# 履歴圧縮

AIエージェントは、ユーザーメッセージ、アシスタントの応答、ツール呼び出し、およびツール応答を含むメッセージ履歴を保持します。
この履歴は、エージェントが戦略に従うにつれて、各対話で増加します。

長期間にわたる会話では、履歴が肥大化し、多くのトークンを消費する可能性があります。
履歴圧縮は、さらなるエージェント操作に必要な重要な情報のみを含む1つまたは複数のメッセージにメッセージの完全なリストを要約することで、これを削減するのに役立ちます。

履歴圧縮は、エージェントシステムにおける主要な課題に対処します。

-   **コンテキストの使用を最適化します。** 集中したより小さなコンテキストは、LLMのパフォーマンスを向上させ、トークン制限を超過することによる失敗を防ぎます。
-   **パフォーマンスを向上させます。** 履歴を圧縮することで、LLMが処理するメッセージ数が減り、応答が高速化されます。
-   **精度を向上させます。** 関連情報に焦点を当てることで、LLMは集中力を維持し、気を散らすことなくタスクを完了できます。
-   **コストを削減します。** 無関係なメッセージを削減することで、トークン使用量が減り、API呼び出しの全体的なコストが削減されます。

## 履歴を圧縮するタイミング

履歴圧縮は、エージェントワークフローの特定のステップで実行されます。

-   エージェント戦略の論理的ステップ（サブグラフ）間。
-   コンテキストが長くなりすぎた場合。

## 履歴圧縮の実装

エージェントで履歴圧縮を実装するには、主に2つのアプローチがあります。

-   戦略グラフ内。
-   カスタムノード内。

### 戦略グラフでの履歴圧縮

戦略グラフで履歴を圧縮するには、`nodeLLMCompressHistory`ノードを使用する必要があります。
圧縮を実行するステップに応じて、次のシナリオが利用可能です。

*   履歴が長くなりすぎたときに圧縮するには、ヘルパー関数を定義し、次のロジックで`nodeLLMCompressHistory`ノードを戦略グラフに追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.environment.ReceivedToolResult
-->
```kotlin
// 履歴が100メッセージを超える場合に長すぎると定義します
private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy<String, String>("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // LLM履歴を圧縮し、現在のReceivedToolResultを次のノードに保持します
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // 履歴が長すぎる場合、任意のツール実行後に履歴を圧縮します 
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // そうでない場合は、次のLLMリクエストに進みます
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
<!--- KNIT example-history-compression-01.kt -->

この例では、戦略は各ツール呼び出しの後に履歴が長すぎるかどうかをチェックします。
履歴は、ツール結果をLLMに送り返す前に圧縮されます。これにより、長い会話中にコンテキストが肥大化するのを防ぎます。

*   戦略の論理ステップ（サブグラフ）間で履歴を圧縮するには、戦略を次のように実装できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
-->
```kotlin
val strategy = strategy<String, String>("execute-with-history-compression") {
    val collectInformation by subgraph<String, String> {
        // 情報を収集するためのいくつかのステップ
    }
    val compressHistory by nodeLLMCompressHistory<String>()
    val makeTheDecision by subgraph<String, String> {
        // 現在の圧縮された履歴と収集された情報に基づいて意思決定を行うためのいくつかのステップ
    }
    
    nodeStart then collectInformation then compressHistory then makeTheDecision
}
```
<!--- KNIT example-history-compression-02.kt -->

この例では、履歴は情報収集フェーズが完了した後、意思決定フェーズに進む前に圧縮されます。

### カスタムノードでの履歴圧縮

カスタムノードを実装している場合は、`replaceHistoryWithTLDR()`関数を使用して次のように履歴を圧縮できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

このアプローチにより、特定の要件に基づいて、カスタムノードロジックの任意の時点で圧縮を実装する柔軟性が高まります。

カスタムノードの詳細については、[カスタムノード](custom-nodes.md)を参照してください。

## 履歴圧縮戦略

オプションの`strategy`パラメータを`nodeLLMCompressHistory(strategy=...)`または`replaceHistoryWithTLDR(strategy=...)`に渡すことで、圧縮プロセスをカスタマイズできます。
フレームワークにはいくつかの組み込み戦略が用意されています。

### WholeHistory (デフォルト)

これまでの達成内容を要約する1つのTLDRメッセージに履歴全体を圧縮するデフォルト戦略です。
この戦略は、トークン使用量を削減しながら会話全体のコンテキストを把握したいという、ほとんどの一般的なユースケースでうまく機能します。

次のように使用できます。

*   戦略グラフで:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

この戦略は、最後の`n`個のメッセージのみをTLDRメッセージに圧縮し、それ以前のメッセージを完全に破棄します。
これは、エージェントの最新の成果（または最新の発見された事実、最新のコンテキスト）のみが問題解決に関連する場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
これは、これまでの進捗の簡潔なTLDRだけでなく、全体的な進行状況を追跡する必要がある場合や、古い情報も重要である場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

この戦略は、履歴内で提供された概念リストに関連する特定の事実を検索し、それらを取得します。
履歴全体をこれらの事実のみに変更し、将来のLLMリクエストのコンテキストとして残します。
これは、LLMがタスクをより適切に実行するためにどのような事実が関連するかについて、アイデアがある場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
            // LLMはこの概念に関連する複数の関連事実を検索します:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "product_details",
            // LLMへの説明 -- 具体的に何を検索するか
            description = "Brief details about products in the catalog the user has been checking",
            // LLMはこの概念に関連する複数の関連事実を検索します:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "issue_solved",
            // LLMへの説明 -- 具体的に何を検索するか
            description = "Was the initial user's issue resolved?",
            // LLMはこの質問に対する単一の回答を検索します:
            factType = FactType.SINGLE
        )
    )
)
```
<!--- KNIT example-history-compression-10.kt -->

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
                // LLMはこの概念に関連する複数の関連事実を検索します:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // LLMへの説明 -- 具体的に何を検索するか
                description = "Brief details about products in the catalog the user has been checking",
                // LLMはこの概念に関連する複数の関連事実を検索します:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // LLMへの説明 -- 具体的に何を検索するか
                description = "Was the initial user's issue resolved?",
                // LLMはこの質問に対する単一の回答を検索します:
                factType = FactType.SINGLE
            )
        )
    )
}
```
<!--- KNIT example-history-compression-11.kt -->

## カスタム履歴圧縮戦略の実装

`HistoryCompressionStrategy`抽象クラスを拡張し、`compress`メソッドを実装することで、独自の履歴圧縮戦略を作成できます。

例を次に示します。

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
        // 1. llmSession.prompt.messages内の現在の履歴を処理します
        // 2. 新しい圧縮されたメッセージを作成します
        // 3. 圧縮されたメッセージでプロンプトを更新します

        // オリジナルのメッセージを保存して保持します
        val originalMessages = llmSession.prompt.messages
        
        // 例の実装:
        val importantMessages = llmSession.prompt.messages.filter {
            // カスタムフィルタリングロジック
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // 注: `llmSession`を使用してLLMリクエストを行い、たとえば`llmSession.requestLLMWithoutTools()`を使用してLLMにいくつかのタスクを実行させることもできます
        // あるいは、現在のモデルを変更することもできます: `llmSession.model = AnthropicModels.Sonnet_3_7` として他のLLMモデルに依頼することもできますが、後で元に戻すことを忘れないでください

        // フィルタリングされたメッセージでプロンプトを構成します
        val compressedMessages = composeMessageHistory(
            originalMessages,
            importantMessages,
            memoryMessages
        )
    }
}
```
<!--- KNIT example-history-compression-12.kt -->

この例では、カスタム戦略は「important」という単語を含むメッセージをフィルタリングし、圧縮された履歴にはそれらのメッセージのみを保持します。

次のように使用できます。

*   戦略グラフで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

## 圧縮中のメモリ保持

すべての履歴圧縮メソッドには、圧縮中にメモリ関連のメッセージを保持するかどうかを決定する`preserveMemory`パラメータがあります。
これらは、メモリから取得された事実を含むメッセージ、またはメモリ機能が有効になっていないことを示すメッセージです。

`preserveMemory`パラメータは次のように使用できます。

*   戦略グラフで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

*   カスタムノードで:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
}
```
<!--- KNIT example-history-compression-16.kt -->