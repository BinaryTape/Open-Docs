# 歷史記錄壓縮

AI 代理維護一個包含使用者訊息、助理回應、工具呼叫和工具回應的訊息記錄。隨著代理依循其策略進行每次互動，此記錄會不斷增長。

對於長期對話，記錄可能會變得龐大並消耗大量 Token。歷史記錄壓縮有助於減少此情況，它將完整的訊息列表摘要成一個或多個僅包含代理進一步運作所需重要資訊的訊息。

歷史記錄壓縮解決了代理系統中的關鍵挑戰：

- 優化上下文使用。專注且更小的上下文可提高 LLM 效能，並防止因超出 Token 限制而導致的失敗。
- 提高效能。壓縮歷史記錄減少了 LLM 處理的訊息數量，從而加快回應速度。
- 增強準確性。專注於相關資訊有助於 LLM 保持專注並完成任務而不受干擾。
- 降低成本。減少不相關的訊息會降低 Token 使用量，從而降低 API 呼叫的總成本。

## 何時壓縮歷史記錄

歷史記錄壓縮在代理工作流程的特定步驟中執行：

- 在代理策略的邏輯步驟（子圖）之間。
- 當上下文變得太長時。

## 歷史記錄壓縮實作

在您的代理中實作歷史記錄壓縮有兩種主要方法：

- 在策略圖中。
- 在自訂節點中。

### 策略圖中的歷史記錄壓縮

若要在策略圖中壓縮歷史記錄，您需要使用 `nodeLLMCompressHistory` 節點。根據您決定執行壓縮的步驟，有以下情境可用：

*   當歷史記錄變得太長時壓縮歷史記錄，您可以定義一個輔助函數並將 `nodeLLMCompressHistory` 節點新增到您的策略圖中，其邏輯如下：

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
在此範例中，策略會在每次工具呼叫後檢查歷史記錄是否太長。歷史記錄在將工具結果發送回 LLM 之前進行壓縮。這可防止上下文在長期對話中增長。

*   若要在策略的邏輯步驟（子圖）之間壓縮歷史記錄，您可以如下實作您的策略：

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
在此範例中，歷史記錄在完成資訊收集階段後、但在進入決策制定階段之前進行壓縮。

### 自訂節點中的歷史記錄壓縮

如果您正在實作自訂節點，您可以使用 `replaceHistoryWithTLDR()` 函數來壓縮歷史記錄，如下所示：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR()
}
```
這種方法讓您有更大的彈性，可以在自訂節點邏輯中的任何點根據您的特定需求實作壓縮。

要了解有關自訂節點的更多資訊，請參閱 [Custom nodes](custom-nodes.md)。

## 歷史記錄壓縮策略

您可以透過向 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)` 傳遞一個可選的 `strategy` 參數來自訂壓縮過程。該框架提供了幾種內建策略。

### WholeHistory (預設)

此為預設策略，它將整個歷史記錄壓縮成一條 TLDR 訊息，總結到目前為止已完成的內容。此策略適用於大多數通用使用情境，在這些情境中您希望維持對整個對話上下文的感知，同時減少 Token 使用量。

您可以如下使用它：

*   在策略圖中：
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory
)
```

*   在自訂節點中：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.WholeHistory)
}
```

### FromLastNMessages

此策略僅將最後 `n` 條訊息壓縮成一條 TLDR 訊息，並完全丟棄較早的訊息。當只有代理的最新成就（或最新發現的事實、最新上下文）與解決問題相關時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.FromLastNMessages(5)
)
```

*   在自訂節點中：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.FromLastNMessages(5))
}
```

### Chunked

此策略將整個訊息歷史記錄分割成固定大小的塊，並將每個塊獨立壓縮成一條 TLDR 訊息。當您不僅需要迄今為止的簡明 TLDR，還希望追蹤整體進度，並且某些舊資訊可能也很重要時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.Chunked(10)
)
```

*   在自訂節點中：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.Chunked(10))
}
```

### RetrieveFactsFromHistory

此策略在歷史記錄中搜尋與所提供概念列表相關的特定事實並將其擷取。它將整個歷史記錄更改為僅包含這些事實，並將其作為未來 LLM 請求的上下文。當您了解哪些確切事實將有助於 LLM 更好地執行任務時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

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

*   在自訂節點中：

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

## 自訂歷史記錄壓縮策略實作

您可以透過繼承 `HistoryCompressionStrategy` 抽象類別並實作 `compress` 方法來建立自己的歷史記錄壓縮策略。

以下是一個範例：

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

在此範例中，自訂策略會篩選包含 "important" 字樣的訊息，並僅將這些訊息保留在壓縮後的歷史記錄中。

然後您可以如下使用它：

*   在策略圖中：

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = MyCustomCompressionStrategy()
)
```

*   在自訂節點中：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = MyCustomCompressionStrategy())
}
```

## 壓縮期間的記憶體保留

所有歷史記錄壓縮方法都有一個 `preserveMemory` 參數，它決定在壓縮期間是否應保留記憶體相關訊息。這些訊息包含從記憶體中擷取的事實，或指示記憶體功能未啟用。

您可以如下使用 `preserveMemory` 參數：

*   在策略圖中：

```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory,
    preserveMemory = true
)
```

*   在自訂節點中：

```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = HistoryCompressionStrategy.WholeHistory,
        preserveMemory = true
    )
}