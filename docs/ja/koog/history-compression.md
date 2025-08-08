# 履歴圧縮

AIエージェントは、ユーザーメッセージ、アシスタントの応答、ツール呼び出し、ツール応答を含むメッセージ履歴を保持します。エージェントが戦略に従うにつれて、この履歴は各対話で増加します。

長期間にわたる会話では、履歴が肥大化し、多くのトークンを消費する可能性があります。履歴圧縮は、メッセージの完全なリストを、さらなるエージェント操作に必要な重要な情報のみを含む1つまたは複数のメッセージに要約することで、これを削減するのに役立ちます。

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

戦略グラフで履歴を圧縮するには、`nodeLLMCompressHistory`ノードを使用する必要があります。圧縮を実行するステップに応じて、次のシナリオが利用可能です。

*   履歴が長くなりすぎたときに圧縮するには、ヘルパー関数を定義し、次のロジックで`nodeLLMCompressHistory`ノードを戦略グラフに追加します。

```kotlin
// Define that the history is too long if there are more than 100 messages
private suspend fun AIAgentContextBase.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // Compress the LLM history and keep the current ReceivedToolResult for the next node
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // Compress history after executing any tool if the history is too long 
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // Otherwise, proceed to the next LLM request
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
この例では、戦略は各ツール呼び出しの後に履歴が長すぎるかどうかをチェックします。履歴は、ツール結果をLLMに送り返す前に圧縮されます。これにより、長い会話中にコンテキストが肥大化するのを防ぎます。

*   戦略の論理ステップ（サブグラフ）間で履歴を圧縮するには、戦略を次のように実装できます。

```kotlin
val strategy = strategy("execute-with-history-compression") {
    val collectInformation by subgraph<String, String> {
        // Some steps to collect the information
    }
    val compressHistory by nodeLLMCompressHistory<String>()
    val makeTheDecision by subgraph<String, Decision> {
        // Some steps to make the decision based on the current compressed history and collected information
    }
    
    nodeStart then collectInformation then compressHistory then makeTheDecision
}
```
この例では、履歴は情報収集フェーズが完了した後、意思決定フェーズに進む前に圧縮されます。

### カスタムノードでの履歴圧縮

カスタムノードを実装している場合は、`replaceHistoryWithTLDR()`関数を使用して次のように履歴を圧縮できます。

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR()
}
```
このアプローチにより、特定の要件に基づいて、カスタムノードロジックの任意の時点で圧縮を実装する柔軟性が高まります。

カスタムノードの詳細については、[カスタムノード](custom-nodes.md)を参照してください。

## 履歴圧縮戦略

オプションの`strategy`パラメータを`nodeLLMCompressHistory(strategy=...)`または`replaceHistoryWithTLDR(strategy=...)`に渡すことで、圧縮プロセスをカスタマイズできます。フレームワークにはいくつかの組み込み戦略が用意されています。

### WholeHistory (デフォルト)

これまでの達成内容を要約する1つのTLDRメッセージに履歴全体を圧縮するデフォルト戦略です。この戦略は、トークン使用量を削減しながら会話全体のコンテキストを把握したいという、ほとんどの一般的なユースケースでうまく機能します。

次のように使用できます。

*   戦略グラフで:
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.WholeHistory)
}
```

### FromLastNMessages

この戦略は、最後の`n`個のメッセージのみをTLDRメッセージに圧縮し、それ以前のメッセージを完全に破棄します。これは、エージェントの最新の成果（または最新の発見された事実、最新のコンテキスト）のみが問題解決に関連する場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.FromLastNMessages(5)
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.FromLastNMessages(5))
}
```

### Chunked

この戦略は、メッセージ履歴全体を固定サイズのチャンクに分割し、各チャンクを個別にTLDRメッセージに圧縮します。これは、これまでの進捗の簡潔なTLDRだけでなく、全体的な進行状況を追跡する必要がある場合や、古い情報も重要である場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.Chunked(10)
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.Chunked(10))
}
```

### RetrieveFactsFromHistory

この戦略は、履歴内で提供された概念リストに関連する特定の事実を検索し、それらを取得します。履歴全体をこれらの事実のみに変更し、将来のLLMリクエストのコンテキストとして残します。これは、LLMがタスクをより適切に実行するためにどのような事実が関連するかについて、アイデアがある場合に役立ちます。

次のように使用できます。

*   戦略グラフで:

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = RetrieveFactsFromHistory(
        Concept(
            keyword = "user_preferences",
            // Description to the LLM -- what specifically to search for
            description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
            // LLM would search for multiple relevant facts related to this concept:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "product_details",
            // Description to the LLM -- what specifically to search for
            description = "Brief details about products in the catalog the user has been checking",
            // LLM would search for multiple relevant facts related to this concept:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "issue_solved",
            // Description to the LLM -- what specifically to search for
            description = "Was the initial user's issue resolved?",
            // LLM would search for a single answer to the question:
            factType = FactType.SINGLE
        )
    )
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = RetrieveFactsFromHistory(
            Concept(
                keyword = "user_preferences", 
                // Description to the LLM -- what specifically to search for
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLM would search for multiple relevant facts related to this concept:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // Description to the LLM -- what specifically to search for
                description = "Brief details about products in the catalog the user has been checking",
                // LLM would search for multiple relevant facts related to this concept:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // Description to the LLM -- what specifically to search for
                description = "Was the initial user's issue resolved?",
                // LLM would search for a single answer to the question:
                factType = FactType.SINGLE
            )
        )
    )
}
```

## カスタム履歴圧縮戦略の実装

`HistoryCompressionStrategy`抽象クラスを拡張し、`compress`メソッドを実装することで、独自の履歴圧縮戦略を作成できます。

例を次に示します。

```kotlin
class MyCustomCompressionStrategy : HistoryCompressionStrategy() {
    override suspend fun compress(
        llmSession: AIAgentLLMWriteSession,
        preserveMemory: Boolean,
        memoryMessages: List<Message>
    ) {
        // 1. Process the current history in llmSession.prompt.messages
        // 2. Create new compressed messages
        // 3. Update the prompt with the compressed messages

        // Example implementation:
        val importantMessages = llmSession.prompt.messages.filter {
            // Your custom filtering logic
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // Note: you can also make LLM requests using the `llmSession` and ask the LLM to do some job for you using, for example, `llmSession.requestLLMWithoutTools()`
        // Or you can change the current model: `llmSession.model = AnthropicModels.Sonnet_3_7` and ask some other LLM model -- but don't forget to change it back after

        // Compose the prompt with the filtered messages
        composePromptWithRequiredMessages(
            llmSession,
            importantMessages,
            preserveMemory,
            memoryMessages
        )
    }
}
```

この例では、カスタム戦略は「important」という単語を含むメッセージをフィルタリングし、圧縮された履歴にはそれらのメッセージのみを保持します。

次のように使用できます。

*   戦略グラフで:

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = MyCustomCompressionStrategy()
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = MyCustomCompressionStrategy())
}
```

## 圧縮中のメモリ保持

すべての履歴圧縮メソッドには、圧縮中にメモリ関連のメッセージを保持するかどうかを決定する`preserveMemory`パラメータがあります。これらは、メモリから取得された事実を含むメッセージ、またはメモリ機能が有効になっていないことを示すメッセージです。

`preserveMemory`パラメータは次のように使用できます。

*   戦略グラフで:

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory,
    preserveMemory = true
)
```

*   カスタムノードで:

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = HistoryCompressionStrategy.WholeHistory,
        preserveMemory = true
    )
}