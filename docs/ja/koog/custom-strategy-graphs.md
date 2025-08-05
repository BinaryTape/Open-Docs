# カスタム戦略グラフ

戦略グラフは、Koogフレームワークにおけるエージェントのワークフローの根幹をなすものです。これらは、エージェントがどのように入力を処理し、ツールと対話し、出力を生成するかを定義します。戦略グラフは、エッジで接続されたノードで構成され、条件によって実行フローが決定されます。

戦略グラフを作成することで、シンプルなチャットボット、複雑なデータ処理パイプライン、あるいはその中間にあるものなど、特定のニーズに合わせてエージェントの動作を調整できます。

## 戦略グラフのアーキテクチャ

大まかに見て、戦略グラフは以下のコンポーネントで構成されています。

-   **Strategy**: `strategy`関数を使用して作成される、グラフのトップレベルのコンテナ。
-   **Subgraphs**: 独自のツールセットとコンテキストを持つことができるグラフのセクション。
-   **Nodes**: ワークフロー内の個々の操作または変換。
-   **Edges**: ノード間の接続で、遷移条件と変換を定義します。

戦略グラフは`nodeStart`という特別なノードから始まり、`nodeFinish`で終わります。これらノード間のパスは、グラフで指定されたエッジと条件によって決定されます。

## 戦略グラフのコンポーネント

### ノード

ノードは戦略グラフの構成要素です。各ノードは特定の操作を表します。

Koogフレームワークは事前定義されたノードを提供しており、`node`関数を使用してカスタムノードを作成することもできます。

詳細については、[事前定義ノードとコンポーネント](nodes-and-components.md)および[カスタムノード](custom-nodes.md)を参照してください。

### エッジ

エッジはノードを接続し、戦略グラフにおける操作のフローを定義します。エッジは`edge`関数と`forwardTo`中置関数を使用して作成されます。

```kotlin
edge(sourceNode forwardTo targetNode)
```

#### 条件

条件は、戦略グラフで特定のエッジをたどるタイミングを決定します。条件にはいくつかの種類があります。

| 条件の種類          | 説明                                                                     |
|:--------------------|:-------------------------------------------------------------------------|
| onCondition         | 論理値を返すラムダ式を受け取る汎用条件。                                 |
| onToolCall          | LLMがツールを呼び出したときに一致する条件。                              |
| onAssistantMessage  | LLMがメッセージで応答したときに一致する条件。                            |
| onMultipleToolCalls | LLMが複数のツールを呼び出したときに一致する条件。                        |
| onToolNotCalled     | LLMがツールを呼び出さなかったときに一致する条件。                        |

`transformed`関数を使用すると、出力をターゲットノードに渡す前に変換できます。

```kotlin
edge(sourceNode forwardTo targetNode 
        onCondition { input -> input.length > 10 }
        transformed { input -> input.uppercase() }
)
```

### サブグラフ

サブグラフは、独自のツールセットとコンテキストで動作する戦略グラフのセクションです。戦略グラフは複数のサブグラフを含むことができます。各サブグラフは`subgraph`関数を使用して定義されます。

```kotlin
val strategy = strategy("strategy-name") {
    val firstSubgraph by subgraph("first") {
        // Define nodes and edges for this subgraph
    }
    val secondSubgraph by subgraph("second") {
        // Define nodes and edges for this subgraph
    }
}
```
サブグラフはツールレジストリから任意のツールを使用できます。ただし、そのレジストリからサブグラフで使用できるツールのサブセットを指定し、`subgraph`関数の引数として渡すこともできます。

```kotlin
val strategy = strategy("strategy-name") {
    val firstSubgraph by subgraph(
        name = "first",
        tools = listOf(someTool)
    ) {
        // Define nodes and edges for this subgraph
    }
   // Define other subgraphs
}
```

## 基本的な戦略グラフの作成

基本的な戦略グラフは次のように動作します。

1.  入力をLLMに送信します。
2.  LLMがメッセージで応答した場合、プロセスを終了します。
3.  LLMがツールを呼び出した場合、ツールを実行します。
4.  ツールの結果をLLMに送り返します。
5.  LLMがメッセージで応答した場合、プロセスを終了します。
6.  LLMが別のツールを呼び出した場合、ツールを実行し、プロセスはステップ4から繰り返されます。

![basic-strategy-graph](img/basic-strategy-graph.png)

以下は基本的な戦略グラフの例です。

```kotlin
val myStrategy = strategy("my-strategy") {
    val nodeCallLLM by nodeLLMRequest()
    val executeToolCall by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeCallLLM forwardTo executeToolCall onToolCall { true })
    edge(executeToolCall forwardTo sendToolResult)
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(sendToolResult forwardTo executeToolCall onToolCall { true })
}
```
## 高度な戦略テクニック

### 履歴圧縮

長期にわたる会話では、履歴が肥大化し、多くのトークンを消費する可能性があります。履歴を圧縮する方法については、[履歴圧縮](history-compression.md)を参照してください。

### ツール並列実行

複数のツールを並列で実行する必要があるワークフローでは、`nodeExecuteMultipleTools`ノードを使用できます。

```kotlin
val executeMultipleTools by nodeExecuteMultipleTools()
val processMultipleResults by nodeLLMSendMultipleToolResults()

edge(someNode forwardTo executeMultipleTools)
edge(executeMultipleTools forwardTo processMultipleResults)
```

ストリーミングデータには、`toParallelToolCallsRaw`拡張関数も使用できます。

```kotlin
parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(BookTool::class).collect()
```

詳細については、[ツール](tools-overview.md#parallel-tool-calls)を参照してください。

### 条件分岐

特定の条件に基づいて異なるパスを必要とする複雑なワークフローでは、条件分岐を使用できます。

```kotlin
val branchA by node<String, String> { input ->
    // Logic for branch A
    "Branch A: $input"
}

val branchB by node<String, String> { input ->
    // Logic for branch B
    "Branch B: $input"
}

edge(
    (someNode forwardTo branchA)
            onCondition { input -> input.contains("A") }
)
edge(
    (someNode forwardTo branchB)
            onCondition { input -> input.contains("B") }
)
```

## ベストプラクティス

カスタム戦略グラフを作成する際は、以下のベストプラクティスに従ってください。

-   シンプルに保つ。シンプルなグラフから始め、必要に応じて複雑さを追加します。
-   グラフを理解しやすくするために、ノードとエッジにわかりやすい名前を付けます。
-   考えられるすべてのパスとエッジケースを処理します。
-   さまざまな入力でグラフをテストし、期待どおりに動作することを確認します。
-   将来の参照のために、グラフの目的と動作を文書化します。
-   事前定義された戦略や一般的なパターンを起点として使用します。
-   長期にわたる会話では、トークン使用量を削減するために履歴圧縮を使用します。
-   グラフを整理し、ツールアクセスを管理するためにサブグラフを使用します。

## 使用例

### トーン分析戦略

トーン分析戦略は、履歴圧縮を含むツールベースの戦略の良い例です。

```kotlin
fun toneStrategy(name: String, toolRegistry: ToolRegistry): AIAgentStrategy {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()
        val nodeCompressHistory by nodeLLMCompressHistory<Message.Tool.Result>()

        // Define the flow of the agent
        edge(nodeStart forwardTo nodeSendInput)

        // If the LLM responds with a message, finish
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // If the LLM calls a tool, execute it
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the history gets too large, compress it
        edge(
            (nodeExecuteTool forwardTo nodeCompressHistory)
                    onCondition { _ -> llm.readSession { prompt.messages.size > 100 } }
        )

        edge(nodeCompressHistory forwardTo nodeSendToolResult)

        // Otherwise, send the tool result directly
        edge(
            (nodeExecuteTool forwardTo nodeSendToolResult)
                    onCondition { _ -> llm.readSession { prompt.messages.size <= 100 } }
        )

        // If the LLM calls another tool, execute it
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the LLM responds with a message, finish
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```

この戦略は以下のことを行います。

1.  入力をLLMに送信します。
2.  LLMがメッセージで応答した場合、戦略はプロセスを終了します。
3.  LLMがツールを呼び出した場合、戦略はそのツールを実行します。
4.  履歴が大きすぎる（100メッセージを超える）場合、戦略はツールの結果を送信する前に圧縮します。
5.  それ以外の場合、戦略はツールの結果を直接送信します。
6.  LLMが別のツールを呼び出した場合、戦略はそれを実行します。
7.  LLMがメッセージで応答した場合、戦略はプロセスを終了します。

## トラブルシューティング

カスタム戦略グラフを作成する際に、いくつかの一般的な問題に遭遇する可能性があります。以下に、トラブルシューティングのヒントをいくつか示します。

### グラフが終了ノードに到達しない

グラフが終了ノードに到達しない場合は、以下を確認してください。

-   開始ノードからのすべてのパスが最終的に終了ノードにつながっていること。
-   条件が厳しすぎず、エッジがたどれないようにしていないこと。
-   グラフ内に終了条件を持たないサイクルがないこと。

### ツール呼び出しが実行されない

ツール呼び出しが実行されない場合は、以下を確認してください。

-   ツールがツールレジストリに適切に登録されていること。
-   LLMノードからツール実行ノードへのエッジに正しい条件 (`onToolCall { true }`) が設定されていること。

### 履歴が大きくなりすぎる

履歴が大きくなりすぎ、多くのトークンを消費する場合は、以下を検討してください。

-   履歴圧縮ノードを追加します。
-   履歴のサイズをチェックし、大きすぎる場合に圧縮する条件を使用します。
-   より積極的な圧縮戦略（例: `FromLastNMessages`で小さいN値）を使用します。

### グラフが予期せぬ分岐をする

グラフが予期せぬ分岐をする場合は、以下を確認してください。

-   条件が正しく定義されていること。
-   条件が期待される順序で評価されていること（エッジは定義された順序でチェックされます）。
-   より一般的な条件で誤って条件を上書きしていないこと。

### パフォーマンスの問題が発生する

グラフにパフォーマンスの問題がある場合は、以下を検討してください。

-   不要なノードやエッジを削除してグラフを簡素化します。
-   独立した操作にはツール並列実行を使用します。
-   履歴を圧縮します。
-   より効率的なノードと操作を使用します。