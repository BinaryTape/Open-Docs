# 歷程記錄壓縮

AI agent 會維護一個訊息歷程記錄，其中包含使用者訊息、助理回應、工具呼叫和工具回應。
此歷程記錄會隨著每次互動而增長，因為 agent 會遵循其策略。

對於長時間運作的對話，歷程記錄可能會變得非常龐大並消耗大量 token。
歷程記錄壓縮透過將完整的訊息列表摘要成一條或多條僅包含後續 agent 運作所需重要資訊的訊息，來協助減少這種消耗。

歷程記錄壓縮解決了 agent 系統中的關鍵挑戰：

- **最佳化上下文使用量**。集中且較小的上下文可提升 LLM 效能，並防止因超過 token 限制而導致的失敗。
- **提升效能**。壓縮歷程記錄可減少 LLM 處理的訊息數量，從而加快回應速度。
- **增強準確性**。專注於相關資訊有助於 LLM 保持集中並完成任務，而不會受到干擾。
- **降低成本**。減少無關訊息可降低 token 使用量，進而降低 API 呼叫的整體成本。

## 何時壓縮歷程記錄

歷程記錄壓縮會在 agent 工作流的特定步驟執行：

- 在 agent 策略的邏輯步驟（子圖 subgraph）之間。
- 當上下文變得過長時。

## 歷程記錄壓縮實作

在您的 agent 中實作歷程記錄壓縮有兩種主要方法：

- 在策略圖 (strategy graph) 中
- 在自訂節點 (custom node) 中（Kotlin）

!!! warning
    自訂節點邏輯內部的歷程記錄壓縮僅適用於 Kotlin。

### 策略圖中的歷程記錄壓縮

要在策略圖中壓縮歷程記錄，您需要使用預定義的節點，該節點會將目前的訊息歷程記錄壓縮成簡潔的摘要：

* **Kotlin**：`nodeLLMCompressHistory`
* **Java**：`AIAgentNode.llmCompressHistory()`

如需更多資訊和具體範例，請參閱 [歷程記錄壓縮節點](nodes-and-components.md#history-compression-node)。

根據您決定執行壓縮的步驟，可以使用以下情境：

* 若要在歷程記錄變得過長時進行壓縮，請檢查 edge 條件中的訊息數量，並新增歷程記錄壓縮節點。若要檢查歷程記錄長度，請執行以下操作：

* **Kotlin**：定義一個輔助擴充 (helper extension)。
* **Java**：在 `.onCondition()` 中使用內嵌 lambda 運算式。

=== "Kotlin"

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
    // 如果訊息超過 100 條，則定義歷程記錄過長
    private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }
    
    val strategy = strategy<String, String>("execute-with-history-compression") {
        val callLLM by nodeLLMRequest()
        val executeTool by nodeExecuteTool()
        val sendToolResult by nodeLLMSendToolResult()
    
        // 壓縮 LLM 歷程記錄，並為下一個節點保留目前的 ReceivedToolResult
        val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()
    
        edge(nodeStart forwardTo callLLM)
        edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
        edge(callLLM forwardTo executeTool onToolCall { true })
    
        // 如果歷程記錄過長，在執行任何工具後壓縮歷程記錄
        edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
        edge(compressHistory forwardTo sendToolResult)
        // 否則，繼續進行下一個 LLM 請求
        edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })
    
        edge(sendToolResult forwardTo executeTool onToolCall { true })
        edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
    }
    ```
    <!--- KNIT example-history-compression-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.environment.ReceivedToolResult;
    import ai.koog.prompt.message.Message;
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

    var callLLM = AIAgentNode.llmRequest();
    var executeTool = AIAgentNode.executeTool();
    var sendToolResult = AIAgentNode.llmSendToolResult();

    // 壓縮 LLM 歷程記錄，並為下一個節點保留目前的 ReceivedToolResult
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(ReceivedToolResult.class)
        .build();

    // 從 start 到 callLLM 的 edge
    graph.edge(graph.nodeStart, callLLM);

    // 當收到助理訊息時，從 callLLM 到 finish 的 edge
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(graph.nodeFinish)
        .onIsInstance(Message.Assistant.class)
        .transformed(Message.Assistant::getContent)
        .build());

    // 當收到工具呼叫時，從 callLLM 到 executeTool 的 edge
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(executeTool)
        .onIsInstance(Message.Tool.Call.class)
        .build());

    // 如果歷程記錄過長，在執行任何工具後壓縮歷程記錄
    graph.edge(AIAgentEdge.builder()
        .from(executeTool)
        .to(compressHistory)
        .onCondition((toolResult, ctx) ->
            ctx.getLlm().readSession(session ->
                session.getPrompt().getMessages().size() > 100
            )
        )
        .build());

    graph.edge(compressHistory, sendToolResult);

    // 否則，繼續進行下一個 LLM 請求
    graph.edge(AIAgentEdge.builder()
        .from(executeTool)
        .to(sendToolResult)
        .onCondition((toolResult, ctx) ->
            ctx.getLlm().readSession(session ->
                session.getPrompt().getMessages().size() <= 100
            )
        )
        .build());

    // 當收到工具呼叫時，從 sendToolResult 到 executeTool 的 edge
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(executeTool)
        .onIsInstance(Message.Tool.Call.class)
        .build());

    // 當收到助理訊息時，從 sendToolResult 到 finish 的 edge
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(graph.nodeFinish)
        .onIsInstance(Message.Assistant.class)
        .transformed(Message.Assistant::getContent)
        .build());
    ```
    <!--- KNIT exampleHistoryCompressionJava01.java -->

在此範例中，策略會在每次工具呼叫後檢查歷程記錄是否過長。
歷程記錄會在將工具結果傳回 LLM 之前進行壓縮。這可以防止上下文在長時間對話期間無限增長。

* 若要在策略的邏輯步驟（子圖 subgraph）之間壓縮歷程記錄，您可以按照以下方式實作您的策略：

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
            // 收集資訊的某些步驟
        }
        val compressHistory by nodeLLMCompressHistory<String>()
        val makeTheDecision by subgraph<String, String> {
            // 根據目前壓縮的歷程記錄和收集到的資訊做出決策的某些步驟
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

    // 用於收集資訊的子圖
    var collectInformation = AIAgentSubgraph.builder("collectInformation")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Collect information based on: " + input)
        .build();

    // 收集資訊後壓縮歷程記錄
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .build();

    // 根據壓縮後的歷程記錄做出決策的子圖
    var makeTheDecision = AIAgentSubgraph.builder("makeTheDecision")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Make a decision based on the information")
        .build();

    // 建立流程：start -> collectInformation -> compressHistory -> makeTheDecision -> finish
    graph.edge(graph.nodeStart, collectInformation);
    graph.edge(collectInformation, compressHistory);
    graph.edge(compressHistory, makeTheDecision);
    graph.edge(makeTheDecision, graph.nodeFinish);
    ```
    <!--- KNIT exampleHistoryCompressionJava02.java -->

在此範例中，歷程記錄會在完成資訊收集階段後，但在進行決策階段之前進行壓縮。

### 自訂節點中的歷程記錄壓縮

!!! warning
    自訂節點邏輯內部的歷程記錄壓縮僅適用於 Kotlin。

如果您正在實作自訂節點，您可以使用 `replaceHistoryWithTLDR()` 函式（Kotlin）壓縮歷程記錄，如下所示：

=== "Kotlin"

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

這種方法讓您能夠根據特定需求，在自訂節點邏輯中的任何位置靈活地實作壓縮。

若要了解更多關於自訂節點的資訊，請參閱 [自訂節點](custom-nodes.md)。

## 歷程記錄壓縮策略

您可以透過選用的 `strategy` 參數來自訂壓縮過程：

* **Kotlin**：將策略傳遞給 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)`。
* **Java**：使用 `.compressionStrategy()` builder 方法。

該架構提供了幾種內建策略。

### WholeHistory (預設)

這是預設策略，它將整個歷程記錄壓縮成一條 TLDR 訊息，摘要目前為止已完成的工作。
此策略適用於大多數一般使用案例，即您希望在減少 token 使用量的同時，維持對整個對話上下文的覺察。

您可以按以下方式使用它：

* 在策略圖中：

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
    // 在壓縮節點中使用 WholeHistory 策略
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .build();

    // 注意：此範例僅顯示節點的建立。
    // 您需要新增 edge 和其他節點來完成圖。
    ```
    <!--- KNIT exampleHistoryCompressionJava03.java -->

* 在自訂節點中（僅限 Kotlin）：

=== "Kotlin"

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

此策略僅將最後 `n` 條訊息壓縮成一條 TLDR 訊息，並完全捨棄較早的訊息。
當只有 agent 的最新成就（或最新發現的事實、最新的上下文）與解決問題相關時，這非常有用。

您可以按以下方式使用它：

* 在策略圖中：

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
    // 使用 FromLastNMessages 策略僅壓縮最後 5 條訊息
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.FromLastNMessages(5))
        .build();

    // 注意：此範例僅顯示節點的建立。
    // 您需要新增 edge 和其他節點來完成圖。
    ```
    <!--- KNIT exampleHistoryCompressionJava04.java -->

* 在自訂節點中（僅限 Kotlin）：

=== "Kotlin"

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

此策略將整個訊息歷程記錄分成固定大小的區塊，並將每個區塊獨立壓縮成一條 TLDR 訊息。
當您不僅需要目前為止所做工作的簡潔 TLDR，還需要追蹤整體進度，且某些較舊的資訊也可能很重要時，這非常有用。

您可以按以下方式使用它：

* 在策略圖中：

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
    class exampleHistoryCompressionJava05 {
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
    // 使用 Chunked 策略以每 10 條訊息為區塊壓縮歷程記錄
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.Chunked(10))
        .build();

    // 注意：此範例僅顯示節點的建立。
    // 您需要新增 edge 和其他節點來完成圖。
    ```
    <!--- KNIT exampleHistoryCompressionJava05.java -->

* 在自訂節點中（僅限 Kotlin）：

=== "Kotlin"

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

此策略在歷程記錄中搜尋與提供的概念列表相關的特定事實並將其擷取。
它將整個歷程記錄更改為僅包含這些事實，並將其作為未來 LLM 請求的上下文。
當您知道哪些確切事實與 LLM 更好地執行任務相關時，這非常有用。

您可以按以下方式使用它：

* 在策略圖中：

=== "Kotlin"

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
                // 給 LLM 的描述 -- 具體要搜尋什麼
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLM 將搜尋與此概念相關的多個相關事實：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // 給 LLM 的描述 -- 具體要搜尋什麼
                description = "Brief details about products in the catalog the user has been checking",
                // LLM 將搜尋與此概念相關的多個相關事實：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // 給 LLM 的描述 -- 具體要搜尋什麼
                description = "Was the initial user's issue resolved?",
                // LLM 將搜尋該問題的單一答案：
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
    import ai.koog.agents.memory.feature.history.RetrieveFactsFromHistory;
    import ai.koog.agents.memory.model.Concept;
    import ai.koog.agents.memory.model.FactType;
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
    // 使用 RetrieveFactsFromHistory 策略提取特定事實
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(ReceivedToolResult.class)
        .compressionStrategy(new RetrieveFactsFromHistory(
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

        // 注意：此範例僅顯示節點的建立。
        // 您需要新增 edge 和其他節點來完成圖。
    ```
    <!--- KNIT exampleHistoryCompressionJava06.java -->

* 在自訂節點中（僅限 Kotlin）：

=== "Kotlin"

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
                    // 給 LLM 的描述 -- 具體要搜尋什麼
                    description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                    // LLM 將搜尋與此概念相關的多個相關事實：
                    factType = FactType.MULTIPLE
                ),
                Concept(
                    keyword = "product_details",
                    // 給 LLM 的描述 -- 具體要搜尋什麼
                    description = "Brief details about products in the catalog the user has been checking",
                    // LLM 將搜尋與此概念相關的多個相關事實：
                    factType = FactType.MULTIPLE
                ),
                Concept(
                    keyword = "issue_solved",
                    // 給 LLM 的描述 -- 具體要搜尋什麼
                    description = "Was the initial user's issue resolved?",
                    // LLM 將搜尋該問題的單一答案：
                    factType = FactType.SINGLE
                )
            )
        )
    }
    ```
    <!--- KNIT example-history-compression-11.kt -->

## 自訂歷程記錄壓縮策略實作

!!! warning
    自訂歷程記錄壓縮策略僅適用於 Kotlin。

您可以透過擴充 `HistoryCompressionStrategy` 抽象類別並實作 `compress` 方法來建立自己的歷程記錄壓縮策略。

以下是一個範例：

=== "Kotlin"

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
            // 1. 處理 llmSession.prompt.messages 中目前的歷程記錄
            // 2. 建立新的壓縮訊息
            // 3. 使用壓縮後的訊息更新 prompt
    
            // 儲存原始訊息以保留它們
            val originalMessages = llmSession.prompt.messages
            
            // 實作範例：
            val importantMessages = llmSession.prompt.messages.filter {
                // 您的自訂過濾邏輯
                it.content.contains("important")
            }.filterIsInstance<Message.Response>()
            
            // 注意：您也可以使用 `llmSession` 發出 LLM 請求，並要求 LLM 為您執行某些工作，
            // 例如使用 `llmSession.requestLLMWithoutTools()`
            // 或者您可以更改目前的模型：`llmSession.model = AnthropicModels.Opus_4_6` 並詢問其他 LLM 模型 -- 但別忘了之後要改回來
    
            // 使用過濾後的訊息組成 prompt
            val compressedMessages = composeMessageHistory(
                originalMessages,
                importantMessages,
                memoryMessages
            )
        }
    }
    ```
    <!--- KNIT example-history-compression-12.kt -->

在此範例中，自訂策略會過濾包含「important」一詞的訊息，並僅將這些訊息保留在壓縮的歷程記錄中。

然後您可以按以下方式使用它：

* 在策略圖中：

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

* 在自訂節點中：

=== "Kotlin"

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

## 壓縮期間的記憶保留

所有歷程記錄壓縮方法都支援記憶保留，這決定了在壓縮期間是否應保留與記憶相關的訊息。在 Kotlin 中，使用 `preserveMemory` 參數。在 Java 中，使用 `.preserveMemory()` builder 方法。
這些訊息包含從記憶體中檢索到的事實，或表示記憶功能尚未啟用的訊息。

若要啟用記憶保留：

* **Kotlin**：使用 `preserveMemory` 參數。
* **Java**：使用 `.preserveMemory()` builder 方法。

* 在策略圖中：

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
    class exampleHistoryCompressionJava07 {
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
    // 使用 WholeHistory 策略並設定 preserveMemory=true
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .preserveMemory(true)
        .build();

    // 注意：此範例僅顯示節點的建立。
    // 您需要新增 edge 和其他節點來完成圖。
    ```
    <!--- KNIT exampleHistoryCompressionJava07.java -->

* 在自訂節點中（僅限 Kotlin）：

=== "Kotlin"

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