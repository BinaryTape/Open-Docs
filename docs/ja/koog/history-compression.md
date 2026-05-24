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

- ストラテジーグラフ内
- カスタムノード内

### ストラテジーグラフでの履歴圧縮

ストラテジーグラフで履歴を圧縮するには、現在のメッセージ履歴を簡潔な要約に圧縮する、事前定義されたノードを使用する必要があります：

* **Kotlin**: `nodeLLMCompressHistory`
* **Java**: `AIAgentNode.llmCompressHistory()`

詳細情報と具体的な例については、[History compression node](nodes-and-components.md#history-compression-node) を参照してください。

圧縮を実行するステップに応じて、以下のシナリオが利用可能です：

* 履歴が長くなりすぎたときに圧縮するには、エッジの条件でメッセージ数を確認し、履歴圧縮ノードを追加します。履歴の長さを確認するには、以下のように行います：

* **Kotlin**: ヘルパー拡張（helper extension）を定義します。
* **Java**: `.onCondition()` 内でインラインのラムダ式を使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.context.AIAgentContext
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.nodeExecuteTools
    import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
    import ai.koog.agents.core.dsl.extension.nodeLLMRequest
    import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResults
    import ai.koog.agents.core.dsl.extension.onTextMessage
    import ai.koog.agents.core.dsl.extension.onToolCalls
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    -->
    ```kotlin
    // メッセージ数が100件を超えている場合に履歴が長すぎると定義する
    private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }
    
    val strategy = strategy<String, String>("execute-with-history-compression") {
        val callLLM by nodeLLMRequest()
        val executeTool by nodeExecuteTools()
        val sendToolResult by nodeLLMSendToolResults()
    
        // LLMの履歴を圧縮し、現在のReceivedToolResultsを次のノードのために保持する
        val compressHistory by nodeLLMCompressHistory<ReceivedToolResults>()
    
        edge(nodeStart forwardTo callLLM)
        edge(callLLM forwardTo nodeFinish onTextMessage { true })
        edge(callLLM forwardTo executeTool onToolCalls { true })
    
        // 履歴が長すぎる場合、ツールの実行後に履歴を圧縮する 
        edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
        edge(compressHistory forwardTo sendToolResult)
        // そうでない場合は、次のLLMリクエストに進む
        edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })
    
        edge(sendToolResult forwardTo executeTool onToolCalls { true })
        edge(sendToolResult forwardTo nodeFinish onTextMessage { true })
    }
    ```
    <!--- KNIT example-history-compression-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults;
    class exampleHistoryCompressionJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
        .withInput(String.class)
        .withOutput(String.class);

    var callLLM = AIAgentNode.llmRequest(null);
    var executeTool = AIAgentNode.executeTools(null);
    var sendToolResult = AIAgentNode.llmSendToolResults(null);

    // LLMの履歴を圧縮する。保持された ReceivedToolResults が次のノードに流れる。
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(ReceivedToolResults.class)
        .build();

    // startからcallLLMへのエッジ
    graph.edge(AIAgentEdge.builder()
        .from(graph.nodeStart)
        .to(callLLM)
        .build());

    // テキスト応答時にcallLLMからfinishへのエッジ
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(graph.nodeFinish)
        .onTextMessage()
        .build());

    // ツール呼び出し時にcallLLMからexecuteToolへのエッジ
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(executeTool)
        .onToolCalls()
        .build());

    // 履歴が長すぎる場合、ツールの実行後に履歴を圧縮する
    graph.edge(AIAgentEdge.builder()
        .from(executeTool)
        .to(compressHistory)
        .onCondition((message, ctx) ->
            ctx.getLlm().readSession(session ->
                session.getPrompt().getMessages().size() > 100
            )
        )
        .build());

    graph.edge(compressHistory, sendToolResult);

    // そうでない場合は、次のLLMリクエストに進む
    graph.edge(AIAgentEdge.builder()
        .from(executeTool)
        .to(sendToolResult)
        .onCondition((message, ctx) ->
            ctx.getLlm().readSession(session ->
                session.getPrompt().getMessages().size() <= 100
            )
        )
        .build());

    // ツール呼び出し時にsendToolResultからexecuteToolへのエッジ
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(executeTool)
        .onToolCalls()
        .build());

    // テキスト応答時にsendToolResultからfinishへのエッジ
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(graph.nodeFinish)
        .onTextMessage()
        .build());
    ```
    <!--- KNIT exampleHistoryCompressionJava01.java -->

この例では、戦略は各ツール呼び出しの後に履歴が長すぎないかを確認します。
ツール実行の結果をLLMに送り返す前に履歴が圧縮されます。これにより、長時間の会話中にコンテキストが増大し続けるのを防ぎます。

* 戦略の論理的なステップ（サブグラフ）の間で履歴を圧縮するには、以下のように戦略を実装できます：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import java.util.Collections;
    class exampleHistoryCompressionJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
        .withInput(String.class)
        .withOutput(String.class);

    // 情報収集のためのサブグラフ
    var collectInformation = AIAgentSubgraph.builder("collectInformation")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Collect information based on: " + input)
        .build();

    // 情報収集の後に履歴を圧縮する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .build();

    // 圧縮された履歴に基づいて意思決定を行うサブグラフ
    var makeTheDecision = AIAgentSubgraph.builder("makeTheDecision")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Make a decision based on the information")
        .build();

    // フローを構築: start -> collectInformation -> compressHistory -> makeTheDecision -> finish
    graph.edge(graph.nodeStart, collectInformation);
    graph.edge(collectInformation, compressHistory);
    graph.edge(compressHistory, makeTheDecision);
    graph.edge(makeTheDecision, graph.nodeFinish);
    ```
    <!--- KNIT exampleHistoryCompressionJava02.java -->

この例では、情報収集フェーズが完了した後、意思決定フェーズに進む前に履歴が圧縮されます。

### カスタムノードでの履歴圧縮

カスタムノードを実装している場合は、以下のように `replaceHistoryWithTLDR()` 関数（Kotlin）を使用して履歴を圧縮できます：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
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

## 履歴圧縮の戦略

オプションの `strategy` パラメータを使用して、圧縮プロセスをカスタマイズできます：

* **Kotlin**: `nodeLLMCompressHistory(strategy=...)` または `replaceHistoryWithTLDR(strategy=...)` に戦略を渡します。
* **Java**: `.compressionStrategy()` ビルダーメソッドを使用します。

フレームワークは、いくつかの組み込み戦略を提供しています。

### WholeHistory (デフォルト)

履歴全体を、これまでに達成された内容を要約する1つのTLDRメッセージに圧縮するデフォルトの戦略です。
この戦略は、トークン使用量を削減しながら、会話全体のコンテキストを把握し続けたいほとんどの一般的なユースケースに適しています。

以下のように使用できます：

* ストラテジーグラフ内：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava03 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 圧縮ノードでWholeHistory戦略を使用する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .build();

    // 注：この例はノードの作成のみを示しています。
    // グラフを完成させるには、エッジや他のノードを追加する必要があります。
    ```
    <!--- KNIT exampleHistoryCompressionJava03.java -->

* カスタムノード内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava05 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
        var compressHistory = AIAgentNode.builder()
            .withInput(String.class)
            .withOutput(String.class)
            .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
            })
            .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory);
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava04.java -->

### FromLastNMessages

この戦略は、最後の `n` 個のメッセージのみをTLDRメッセージに圧縮し、それ以前のメッセージを完全に破棄します。
これは、エージェントの最新の成果（または最新の発見、最新のコンテキスト）のみが問題解決に関連する場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava04 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // FromLastNMessages戦略を使用して、最後の5つのメッセージのみを圧縮する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.FromLastNMessages(5))
        .build();

    // 注：この例はノードの作成のみを示しています。
    // グラフを完成させるには、エッジや他のノードを追加する必要があります。
    ```
    <!--- KNIT exampleHistoryCompressionJava05.java -->

* カスタムノード内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava07 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
        var compressHistory = AIAgentNode.builder()
            .withInput(String.class)
            .withOutput(String.class)
            .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
            })
            .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(5));
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava06.java -->

### Chunked

この戦略は、メッセージ履歴全体を固定サイズのチャンクに分割し、各チャンクを個別にTLDRメッセージに圧縮します。
これは、これまでに何が行われたかの簡潔な要約だけでなく、全体的な進捗も把握し続ける必要があり、古い情報も重要である可能性がある場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava08 {
    public static void main(String[] args) {
        var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
            .withInput(String.class)
            .withOutput(String.class);
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Chunked戦略を使用して、履歴を10メッセージずつのチャンクで圧縮する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.Chunked(10))
        .build();

    // 注：この例はノードの作成のみを示しています。
    // グラフを完成させるには、エッジや他のノードを追加する必要があります。
    ```
    <!--- KNIT exampleHistoryCompressionJava07.java -->

* カスタムノード内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava09 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
        var compressHistory = AIAgentNode.builder()
            .withInput(String.class)
            .withOutput(String.class)
            .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
            })
            .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.replaceHistoryWithTLDR(HistoryCompressionStrategy.Chunked(10));
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava08.java -->

### FactRetrievalHistoryCompressionStrategy

この戦略は、履歴の中から提供されたコンセプトのリストに関連する特定の事実を検索して抽出します。
履歴全体をこれらの事実のみに変更し、将来のLLMリクエストのためのコンテキストとして残します。
これは、タスクをより適切に実行するためにLLMにとってどのような具体的な事実が関連するか、あらかじめ分かっている場合に有用です。

以下のように使用できます：

* ストラテジーグラフ内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
    import ai.koog.agents.core.dsl.extension.FactRetrievalHistoryCompressionStrategy
    import ai.koog.agents.core.dsl.extension.Concept
    import ai.koog.agents.core.dsl.extension.FactType
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
        strategy = FactRetrievalHistoryCompressionStrategy(
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.environment.ReceivedToolResult;
    import ai.koog.agents.core.dsl.extension.FactRetrievalHistoryCompressionStrategy;
    import ai.koog.agents.core.dsl.extension.Concept;
    import ai.koog.agents.core.dsl.extension.FactType;
    class exampleHistoryCompressionJava06 {
    public static void main(String[] args) {
        var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
            .withInput(String.class)
            .withOutput(String.class);
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // FactRetrievalHistoryCompressionStrategy戦略を使用して特定の事実を抽出する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(ReceivedToolResult.class)
        .compressionStrategy(new FactRetrievalHistoryCompressionStrategy(
            new Concept(
                "user_preferences",
                "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                FactType.MULTIPLE
            ),
            new Concept(
                "product_details",
                "Brief details about products in the catalog the user has been checking",
                FactType.MULTIPLE
            ),
            new Concept(
                "issue_solved",
                "Was the initial user's issue resolved?",
                FactType.SINGLE
            )
        ))
        .build();

        // 注：この例はノードの作成のみを示しています。
        // グラフを完成させるには、エッジや他のノードを追加する必要があります。
    ```
    <!--- KNIT exampleHistoryCompressionJava09.java -->

* カスタムノード内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.FactRetrievalHistoryCompressionStrategy
    import ai.koog.agents.core.dsl.extension.Concept
    import ai.koog.agents.core.dsl.extension.FactType
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
            strategy = FactRetrievalHistoryCompressionStrategy(
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
    }
    ```
    <!--- KNIT example-history-compression-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    import ai.koog.agents.core.dsl.extension.FactRetrievalHistoryCompressionStrategy;
    import ai.koog.agents.core.dsl.extension.Concept;
    import ai.koog.agents.core.dsl.extension.FactType;
    class exampleHistoryCompressionJava11 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
        var compressHistory = AIAgentNode.builder()
            .withInput(String.class)
            .withOutput(String.class)
            .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
            })
            .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.replaceHistoryWithTLDR(new FactRetrievalHistoryCompressionStrategy(
                new Concept(
                    "user_preferences", 
                    // LLMへの説明 -- 具体的に何を検索するか
                    "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                    // LLMはこのコンセプトに関連する複数の関連事実を検索する：
                    FactType.MULTIPLE
                ),
                new Concept(
                    "product_details",
                    // LLMへの説明 -- 具体的に何を検索するか
                    "Brief details about products in the catalog the user has been checking",
                    // LLMはこのコンセプトに関連する複数の関連事実を検索する：
                    FactType.MULTIPLE
                ),
                new Concept(
                    "issue_solved",
                    // LLMへの説明 -- 具体的に何を検索するか
                    "Was the initial user's issue resolved?",
                    // LLMはこの質問に対する単一の回答を検索する：
                    FactType.SINGLE
                )
            ));
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava10.java -->

## カスタム履歴圧縮戦略の実装

!!! warning
    カスタム履歴圧縮戦略は、Kotlinでのみ利用可能です。

`HistoryCompressionStrategy` 抽象クラスを継承し、`compress` メソッドを実装することで、独自の履歴圧縮戦略を作成できます。

以下に例を示します：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.session.AIAgentLLMWriteSession
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
    import ai.koog.prompt.message.Message
    import ai.koog.prompt.message.MessagePart
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
            val importantMessages = llmSession.prompt.messages
                .filterIsInstance<Message.Assistant>()
                .filter { message ->
                    // カスタムのフィルタリングロジック
                    message.parts.filterIsInstance<MessagePart.Text>().any { it.text.contains("important") }
                }
            
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

=== "Kotlin"

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

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
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

すべての履歴圧縮メソッドは、圧縮中にメモリ関連のメッセージを保持するかどうかを決定するメモリ保持（memory preservation）をサポートしています。Kotlinでは `preserveMemory` パラメータを使用し、Javaでは `.preserveMemory()` ビルダーメソッドを使用します。
これらは、メモリから抽出された事実を含むメッセージや、メモリ機能が有効になっていないことを示すメッセージです。

メモリ保持を有効にするには：

* **Kotlin**: `preserveMemory` パラメータを使用します。
* **Java**: `.preserveMemory()` ビルダーメソッドを使用します。

* ストラテジーグラフ内：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava15 {
    public static void main(String[] args) {
        var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
            .withInput(String.class)
            .withOutput(String.class);
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // preserveMemory=true でWholeHistory戦略を使用する
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .preserveMemory(true)
        .build();

    // 注：この例はノードの作成のみを示しています。
    // グラフを完成させるには、エッジや他のノードを追加する必要があります。
    ```
    <!--- KNIT exampleHistoryCompressionJava11.java -->

* カスタムノード内：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy;
    class exampleHistoryCompressionJava16 {
        public static void main(String[] args) {
            var graph = AIAgentGraphStrategy.builder("execute-with-history-compression")
                .withInput(String.class)
                .withOutput(String.class);
        var compressHistory = AIAgentNode.builder()
            .withInput(String.class)
            .withOutput(String.class)
            .withAction((input, ctx) -> {
    -->
    <!--- SUFFIX
                    return null;
            })
            .build();
        }
    }
    -->
    ```java
    ctx.getLlm().writeSession(session -> {
        session.replaceHistoryWithTLDR(
            /** strategy */ HistoryCompressionStrategy.WholeHistory,
            /** preserveMemory */ true
        );
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava12.java -->