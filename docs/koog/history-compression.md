# 历史压缩

AI 代理会维护一个消息历史，其中包括用户消息、助手响应、工具调用和工具响应。当代理遵循其策略时，此历史会随着每次交互而增长。

对于长期对话，历史可能会变得庞大并消耗大量 token。历史压缩通过将完整的消息列表总结为一条或多条仅包含对代理后续操作而言必需的重要信息的消息，从而帮助减少这种情况。

历史压缩解决了代理系统中的关键挑战：

*   **优化上下文使用。** 聚焦且更小的上下文可以提升 LLM 性能，并防止因超出 token 限制而导致的失败。
*   **提升性能。** 压缩历史可以减少 LLM 处理的消息数量，从而实现更快的响应。
*   **提高准确性。** 聚焦于相关信息有助于 LLM 保持专注并完成任务而不受干扰。
*   **降低成本。** 减少不相关消息可以降低 token 使用量，从而降低 API 调用的总成本。

## 何时压缩历史

历史压缩在代理工作流的特定步骤执行：

*   在代理策略的逻辑步骤（子图）之间。
*   当上下文变得过长时。

## 历史压缩实现

在代理中实现历史压缩有两种主要方法：

*   在策略图中。
*   在自定义节点中。

### 在策略图中实现历史压缩

要在策略图中压缩历史，你需要使用 `nodeLLMCompressHistory` 节点。根据你决定在哪一步执行压缩，有以下场景可用：

*   当历史过长时压缩历史，你可以定义一个辅助函数并将 `nodeLLMCompressHistory` 节点添加到你的策略图，采用以下逻辑：

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

    在此示例中，策略会在每次工具调用后检测历史是否过长。历史会在将工具结果发送回 LLM 之前被压缩。这可以防止上下文在长期对话中不断增长。

*   要在策略的逻辑步骤（子图）之间压缩历史，你可以按如下方式实现你的策略：

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

    在此示例中，历史会在信息收集阶段完成后，但在进入决策阶段之前被压缩。

### 在自定义节点中实现历史压缩

如果你正在实现自定义节点，你可以使用 `replaceHistoryWithTLDR()` 函数压缩历史，如下所示：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR()
}
```

这种方法为你提供了更大的灵活性，可以根据你的具体要求在自定义节点逻辑中的任何位置实现压缩。

有关自定义节点的更多信息，请参阅 [自定义节点](custom-nodes.md)。

## 历史压缩策略

你可以通过向 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)` 传递一个可选的 `strategy` 形参来自定义压缩过程。
该框架提供了几种内置策略。

### WholeHistory（默认）

此默认策略将整个历史压缩为一条 TLDR 消息，总结了迄今为止已完成的工作。
此策略适用于大多数通用用例，在这些用例中，你希望保持对整个对话上下文的了解，同时减少 token 使用量。

你可以按如下方式使用它：

*   在策略图中：

    ```kotlin
    val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
        strategy = HistoryCompressionStrategy.WholeHistory
    )
    ```

*   在自定义节点中：

    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.WholeHistory)
    }
    ```

### FromLastNMessages

此策略仅将最后 `n` 条消息压缩为一条 TLDR 消息，并完全丢弃较早的消息。
当只有代理的最新成就（或最新发现的事实、最新上下文）与解决问题相关时，此方法很有用。

你可以按如下方式使用它：

*   在策略图中：

    ```kotlin
    val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
        strategy = HistoryCompressionStrategy.FromLastNMessages(5)
    )
    ```

*   在自定义节点中：

    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.FromLastNMessages(5))
    }
    ```

### Chunked

此策略将整个消息历史分割成固定大小的块，并独立压缩每个块，生成一条 TLDR 消息。
当你不仅需要迄今为止完成工作的简洁 TLDR，还需要跟踪整体进度，并且某些较旧的信息也可能很重要时，此方法很有用。

你可以按如下方式使用它：

*   在策略图中：

    ```kotlin
    val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
        strategy = HistoryCompressionStrategy.Chunked(10)
    )
    ```

*   在自定义节点中：

    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.Chunked(10))
    }
    ```

### RetrieveFactsFromHistory

此策略会在历史中搜索与提供的概念列表相关的特定事实，并检索它们。
它将整个历史更改为仅包含这些事实，并将其作为未来 LLM 请求的上下文。
当你对哪些确切事实与 LLM 更好地执行任务相关有所了解时，此方法很有用。

你可以按如下方式使用它：

*   在策略图中：

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

*   在自定义节点中：

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

## 自定义历史压缩策略实现

你可以通过扩展 `HistoryCompressionStrategy` 抽象类并实现 `compress` 方法来创建你自己的历史压缩策略。

以下是一个示例：

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

在此示例中，自定义策略会过滤包含“important”一词的消息，并仅将这些消息保留在压缩后的历史中。

然后你可以按如下方式使用它：

*   在策略图中：

    ```kotlin
    val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
        strategy = MyCustomCompressionStrategy()
    )
    ```

*   在自定义节点中：

    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(strategy = MyCustomCompressionStrategy())
    }
    ```

## 压缩期间的内存保留

所有历史压缩方法都包含 `preserveMemory` 形参，用于确定在压缩过程中是否应保留与内存相关的消息。
这些消息包含从内存中检索到的事实，或指示内存特性未启用。

你可以按如下方式使用 `preserveMemory` 形参：

*   在策略图中：

    ```kotlin
    val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
        strategy = HistoryCompressionStrategy.WholeHistory,
        preserveMemory = true
    )
    ```

*   在自定义节点中：

    ```kotlin
    llm.writeSession {
        replaceHistoryWithTLDR(
            strategy = HistoryCompressionStrategy.WholeHistory,
            preserveMemory = true
        )
    }