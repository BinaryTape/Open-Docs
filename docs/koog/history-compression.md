# 历史压缩

AI 代理维护着一个消息历史记录，其中包括用户消息、助手响应、工具调用和工具响应。
随着代理执行其策略，此历史记录会随着每次交互而增长。

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

- 在策略图中实现。
- 在自定义节点中实现。

### 策略图中的历史压缩

要在策略图中压缩历史记录，你需要使用 `nodeLLMCompressHistory` 节点。
根据你决定执行压缩的步骤，可以使用以下场景：

* 要在历史记录过长时对其进行压缩，你可以定义一个辅助函数，并按照以下逻辑将 `nodeLLMCompressHistory` 节点添加到策略图中：

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
// 如果消息数量超过 100 条，则定义为历史记录过长
private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy<String, String>("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // 压缩 LLM 历史记录并为下一个节点保留当前的 ReceivedToolResult
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // 如果历史记录过长，则在执行任何工具后压缩历史记录
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // 否则，继续执行下一个 LLM 请求
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
<!--- KNIT example-history-compression-01.kt -->

在此示例中，策略会在每次工具调用后检查历史记录是否过长。
在将工具结果发送回 LLM 之前会先压缩历史记录。这可以防止上下文在长时间对话中不断增长。

* 要在策略的逻辑步骤（子图）之间压缩历史记录，你可以按如下方式实现策略：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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

在此示例中，历史记录在完成信息收集阶段之后、但在继续决策阶段之前被压缩。

### 自定义节点中的历史压缩

如果你正在实现自定义节点，可以使用 `replaceHistoryWithTLDR()` 函数压缩历史记录，如下所示：

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

这种方法为你提供了更大的灵活性，可以根据你的具体要求在自定义节点逻辑中的任何位置执行压缩。

要了解有关自定义节点的更多信息，请参阅[自定义节点](custom-nodes.md)。

## 历史压缩策略

你可以通过向 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)` 传递可选的 `strategy` 参数来自定义压缩过程。
该框架提供了几种内置策略。

### WholeHistory（默认）

这是默认策略，它将整个历史记录压缩为一条 TLDR 消息，总结到目前为止所取得的成就。
该策略适用于大多数通用用例，即你希望在减少 token 使用量的同时保持对整个对话上下文的感知。

你可以按如下方式使用它：

* 在策略图中：
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

* 在自定义节点中：

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

该策略仅将最后 `n` 条消息压缩为一条 TLDR 消息，并完全丢弃较早的消息。
当只有代理最新的成就（或最新发现的事实、最新的上下文）与解决问题相关时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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

* 在自定义节点中：

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

该策略将整个消息历史记录拆分为固定大小的块，并将每个块独立地压缩为一条 TLDR 消息。
当你不仅需要到目前为止所做工作的简明 TLDR，还希望跟踪整体进度，并且某些较旧的信息也可能很重要时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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

* 在自定义节点中：

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

该策略在历史记录中搜索与提供的概念列表相关的特定事实并检索它们。
它将整个历史记录更改为仅包含这些事实，并将它们作为未来 LLM 请求的上下文。
当你清楚哪些确切的事实将有助于 LLM 更好地执行任务时，这非常有用。

你可以按如下方式使用它：

* 在策略图中：

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

* 在自定义节点中：

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

## 自定义历史压缩策略实现

你可以通过继承 `HistoryCompressionStrategy` 抽象类并实现 `compress` 方法来创建自己的历史压缩策略。

示例如下：

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
        // 1. 处理 llmSession.prompt.messages 中的当前历史记录
        // 2. 创建新的压缩消息
        // 3. 使用压缩消息更新 prompt

        // 保存原始消息以保留它们
        val originalMessages = llmSession.prompt.messages
        
        // 示例实现：
        val importantMessages = llmSession.prompt.messages.filter {
            // 你的自定义过滤逻辑
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // 注意：你也可以使用 `llmSession` 发起 LLM 请求，并让 LLM 为你执行一些工作，
        // 例如使用 `llmSession.requestLLMWithoutTools()`
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

* 在自定义节点中：

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

## 压缩期间的记忆保留

所有历史压缩方法都有 `preserveMemory` 参数，该参数决定在压缩期间是否应保留与记忆相关的消息。
这些消息包含从记忆中检索到的事实或指示未启用记忆功能的说明。

你可以按如下方式使用 `preserveMemory` 参数：

* 在策略图中：

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

* 在自定义节点中：

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
```
<!--- KNIT example-history-compression-16.kt -->