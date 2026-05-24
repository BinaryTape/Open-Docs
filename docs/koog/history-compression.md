# 历史压缩

AI 代理维护着一个消息历史记录，其中包括用户消息、助手响应、工具调用和工具响应。
此历史记录随着代理执行其策略而随着每次交互增长。

对于长时间运行的对话，历史记录可能会变得非常庞大并消耗大量 token。
历史压缩通过将完整的消息列表总结为一条或多条仅包含后续代理操作所需重要信息的消息，从而帮助减少开销。

历史压缩解决了代理系统中的关键挑战：

- **优化上下文使用情况**：集中且更小的上下文可以提高 LLM 性能，并防止因超出 token 限制而导致的失败。
- **提高性能**：压缩历史记录可以减少 LLM 处理的消息数量，从而实现更快的响应。
- **提高准确性**：专注于相关信息有助于 LLM 保持专注并完成任务，而不受干扰。
- **降低成本**：减少无关消息可以降低 token 使用量，从而降低 API 调用的总成本。

## 何时压缩历史记录

历史压缩在代理工作流的特定步骤中执行：

- 在代理策略的逻辑步骤（子图）之间。
- 当上下文变得过长时。

## 历史压缩实现

在代理中实现历史压缩有两种主要方法：

- 在策略图中实现
- 在自定义节点中实现

### 策略图中的历史压缩

要在策略图中压缩历史记录，你需要使用预定义节点，该节点可以将当前消息历史记录压缩为简明摘要：

* **Kotlin**: `nodeLLMCompressHistory`
* **Java**: `AIAgentNode.llmCompressHistory()`

有关更多信息和具体示例，请参阅[历史压缩节点](nodes-and-components.md#history-compression-node)。

根据你决定执行压缩的步骤，可以使用以下场景：

* 要在历史记录过长时对其进行压缩，请检查边条件中的消息计数并添加历史压缩节点。要检查历史记录长度，请执行以下操作：

* **Kotlin**: 定义一个辅助扩展。
* **Java**: 在 `.onCondition()` 中使用内联 lambda表达式。

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
    // 如果消息数量超过 100 条，则定义为历史记录过长
    private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }
    
    val strategy = strategy<String, String>("execute-with-history-compression") {
        val callLLM by nodeLLMRequest()
        val executeTool by nodeExecuteTools()
        val sendToolResult by nodeLLMSendToolResults()
    
        // 压缩 LLM 历史记录并为下一个节点保留当前的 ReceivedToolResults
        val compressHistory by nodeLLMCompressHistory<ReceivedToolResults>()
    
        edge(nodeStart forwardTo callLLM)
        edge(callLLM forwardTo nodeFinish onTextMessage { true })
        edge(callLLM forwardTo executeTool onToolCalls { true })
    
        // 如果历史记录过长，则在执行任何工具后压缩历史记录 
        edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
        edge(compressHistory forwardTo sendToolResult)
        // 否则，继续执行下一个 LLM 请求
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

    // 压缩 LLM 历史记录；携带的 ReceivedToolResults 流入下一个节点。
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(ReceivedToolResults.class)
        .build();

    // 从 start 到 callLLM 的边
    graph.edge(AIAgentEdge.builder()
        .from(graph.nodeStart)
        .to(callLLM)
        .build());

    // 收到文本响应时从 callLLM 到 finish 的边
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(graph.nodeFinish)
        .onTextMessage()
        .build());

    // 发生工具调用时从 callLLM 到 executeTool 的边
    graph.edge(AIAgentEdge.builder()
        .from(callLLM)
        .to(executeTool)
        .onToolCalls()
        .build());

    // 如果历史记录过长，则在执行任何工具后压缩历史记录
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

    // 否则，继续执行下一个 LLM 请求
    graph.edge(AIAgentEdge.builder()
        .from(executeTool)
        .to(sendToolResult)
        .onCondition((message, ctx) ->
            ctx.getLlm().readSession(session ->
                session.getPrompt().getMessages().size() <= 100
            )
        )
        .build());

    // 发生工具调用时从 sendToolResult 到 executeTool 的边
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(executeTool)
        .onToolCalls()
        .build());

    // 收到文本响应时从 sendToolResult 到 finish 的边
    graph.edge(AIAgentEdge.builder()
        .from(sendToolResult)
        .to(graph.nodeFinish)
        .onTextMessage()
        .build());
    ```
    <!--- KNIT exampleHistoryCompressionJava01.java -->

在此示例中，策略会在每次工具调用后检查历史记录是否过长。
在将工具结果发送回 LLM 之前会先压缩历史记录。这可以防止上下文在长时间对话中不断增长。

* 要在策略的逻辑步骤（子图）之间压缩历史记录，你可以按如下方式实现策略：

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
            // 收集信息的一些步骤
        }
        val compressHistory by nodeLLMCompressHistory<String>()
        val makeTheDecision by subgraph<String, String> {
            // 根据当前压缩的历史记录和收集的信息做出决策的一些步骤
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

    // 收集信息的子图
    var collectInformation = AIAgentSubgraph.builder("collectInformation")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Collect information based on: " + input)
        .build();

    // 收集信息后压缩历史记录
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .build();

    // 根据压缩后的历史记录做出决策的子图
    var makeTheDecision = AIAgentSubgraph.builder("makeTheDecision")
        .withInput(String.class)
        .withOutput(String.class)
        .limitedTools(Collections.emptyList())
        .withTask(input -> "Make a decision based on the information")
        .build();

    // 构建流程：start -> collectInformation -> compressHistory -> makeTheDecision -> finish
    graph.edge(graph.nodeStart, collectInformation);
    graph.edge(collectInformation, compressHistory);
    graph.edge(compressHistory, makeTheDecision);
    graph.edge(makeTheDecision, graph.nodeFinish);
    ```
    <!--- KNIT exampleHistoryCompressionJava02.java -->

在此示例中，历史记录在完成信息收集阶段之后、但在继续决策阶段之前被压缩。

### 自定义节点中的历史压缩

如果你正在实现自定义节点，可以使用 `replaceHistoryWithTLDR()` 函数 (Kotlin) 压缩历史记录，如下所示：

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

这种方法为你提供了更大的灵活性，可以根据你的具体要求在自定义节点逻辑中的任何位置执行压缩。

要了解有关自定义节点的更多信息，请参阅[自定义节点](custom-nodes.md)。

## 历史压缩策略

你可以使用可选的 `strategy` 参数自定义压缩过程：

* **Kotlin**: 将策略传递给 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)`。
* **Java**: 使用 `.compressionStrategy()` 构建器方法。

该框架提供了几种内置策略。

### WholeHistory（默认）

默认策略，它将整个历史记录压缩为一条 TLDR 消息，总结了目前已取得的成就。
该策略适用于大多数通用用例，即你希望在减少 token 使用量的同时保持对整个对话上下文的感知。

你可以按如下方式使用它：

* 在策略图中：

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
    // 在压缩节点中使用 WholeHistory 策略
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .build();

    // 注意：此示例仅显示节点的创建。
    // 你需要添加边和其他节点来完成图。
    ```
    <!--- KNIT exampleHistoryCompressionJava03.java -->

* 在自定义节点中：

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

该策略仅将最后 `n` 条消息压缩为一条 TLDR 消息，并完全丢弃较早的消息。
当只有代理最新的成就（或最新发现的事实、最新的上下文）与解决问题相关时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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
    // 使用 FromLastNMessages 策略仅压缩最后 5 条消息
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.FromLastNMessages(5))
        .build();

    // 注意：此示例仅显示节点的创建。
    // 你需要添加边和其他节点来完成图。
    ```
    <!--- KNIT exampleHistoryCompressionJava05.java -->

* 在自定义节点中：

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

该策略将整个消息历史记录拆分为固定大小的块，并将每个块独立地压缩为一条 TLDR 消息。
当你不仅需要到目前为止所做工作的简明 TLDR，还希望跟踪整体进度，并且某些较旧的信息也可能很重要时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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
    // 使用 Chunked 策略按每 10 条消息一个块来压缩历史记录
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.Chunked(10))
        .build();

    // 注意：此示例仅显示节点的创建。
    // 你需要添加边和其他节点来完成图。
    ```
    <!--- KNIT exampleHistoryCompressionJava07.java -->

* 在自定义节点中：

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

该策略在历史记录中搜索与提供的概念列表相关的特定事实并检索它们。
它将整个历史记录更改为仅包含这些事实，并将它们作为未来 LLM 请求的上下文。
当你清楚哪些确切的事实将有助于 LLM 更好地执行任务时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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
                // 给 LLM 的描述 —— 具体要搜索什么
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLM 将搜索与此概念相关的多个相关事实：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // 给 LLM 的描述 —— 具体要搜索什么
                description = "Brief details about products in the catalog the user has been checking",
                // LLM 将搜索与此概念相关的多个相关事实：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // 给 LLM 的描述 —— 具体要搜索什么
                description = "Was the initial user's issue resolved?",
                // LLM 将搜索问题的单个答案：
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
    // 使用 FactRetrievalHistoryCompressionStrategy 策略提取特定事实
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

        // 注意：此示例仅显示节点的创建。
        // 你需要添加边和其他节点来完成图。
    ```
    <!--- KNIT exampleHistoryCompressionJava09.java -->

* 在自定义节点中：

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
                    // 给 LLM 的描述 —— 具体要搜索什么
                    description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                    // LLM 将搜索与此概念相关的多个相关事实：
                    factType = FactType.MULTIPLE
                ),
                Concept(
                    keyword = "product_details",
                    // 给 LLM 的描述 —— 具体要搜索什么
                    description = "Brief details about products in the catalog the user has been checking",
                    // LLM 将搜索与此概念相关的多个相关事实：
                    factType = FactType.MULTIPLE
                ),
                Concept(
                    keyword = "issue_solved",
                    // 给 LLM 的描述 —— 具体要搜索什么
                    description = "Was the initial user's issue resolved?",
                    // LLM 将搜索问题的单个答案：
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
                    // 给 LLM 的描述 —— 具体要搜索什么
                    "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                    // LLM 将搜索与此概念相关的多个相关事实：
                    FactType.MULTIPLE
                ),
                new Concept(
                    "product_details",
                    // 给 LLM 的描述 —— 具体要搜索什么
                    "Brief details about products in the catalog the user has been checking",
                    // LLM 将搜索与此概念相关的多个相关事实：
                    FactType.MULTIPLE
                ),
                new Concept(
                    "issue_solved",
                    // 给 LLM 的描述 —— 具体要搜索什么
                    "Was the initial user's issue resolved?",
                    // LLM 将搜索问题的单个答案：
                    FactType.SINGLE
                )
            ));
        return null;
    });
    ```
    <!--- KNIT exampleHistoryCompressionJava10.java -->

## 自定义历史压缩策略实现

!!! warning
    自定义历史压缩策略仅限 Kotlin。

你可以通过继承 `HistoryCompressionStrategy` 抽象类并实现 `compress` 方法来创建自己的历史压缩策略。

示例如下：

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
            // 1. 处理 llmSession.prompt.messages 中的当前历史记录
            // 2. 创建新的压缩消息
            // 3. 使用压缩消息更新 prompt
    
            // 保存原始消息以保留它们
            val originalMessages = llmSession.prompt.messages
            
            // 示例实现：
            val importantMessages = llmSession.prompt.messages
                .filterIsInstance<Message.Assistant>()
                .filter { message ->
                    // 你的自定义过滤逻辑
                    message.parts.filterIsInstance<MessagePart.Text>().any { it.text.contains("important") }
                }
            
            // 注意：你也可以使用 `llmSession` 发起 LLM 请求，并让 LLM 为你执行一些工作，例如使用 `llmSession.requestLLMWithoutTools()`
            // 或者你可以更改当前模型：`llmSession.model = AnthropicModels.Opus_4_6` 并向其他 LLM 模型发起请求 —— 但不要忘记在完成后将其改回
    
            // 使用过滤后的消息组成 prompt
            val compressedMessages = composeMessageHistory(
                originalMessages,
                importantMessages,
                memoryMessages
            )
        }
    }
    ```
    <!--- KNIT example-history-compression-12.kt -->

在此示例中，自定义策略会过滤包含 "important" 一词的消息，并在压缩的历史记录中仅保留这些消息。

然后你可以按如下方式使用它：

* 在策略图中：

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

* 在自定义节点中：

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

## 压缩期间的记忆保留

所有历史压缩方法都支持记忆保留，这决定了在压缩期间是否应保留与记忆相关的消息。在 Kotlin 中，使用 `preserveMemory` 参数。在 Java 中，使用 `.preserveMemory()` 构建器方法。
这些消息包含从记忆中检索到的事实或指示未启用记忆功能的说明。

要启用记忆保留：

* **Kotlin**: 使用 `preserveMemory` 参数。
* **Java**: 使用 `.preserveMemory()` 构建器方法。

* 在策略图中：

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
    // 使用 WholeHistory 策略并设置 preserveMemory=true
    var compressHistory = AIAgentNode
        .llmCompressHistory("compressHistory")
        .withInput(String.class)
        .compressionStrategy(HistoryCompressionStrategy.WholeHistory)
        .preserveMemory(true)
        .build();

    // 注意：此示例仅显示节点的创建。
    // 你需要添加边和其他节点来完成图。
    ```
    <!--- KNIT exampleHistoryCompressionJava11.java -->

* 在自定义节点中：

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