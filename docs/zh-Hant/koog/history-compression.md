# 歷史記錄壓縮

AI 代理維護一個訊息記錄，其中包含使用者訊息、助理回應、工具呼叫和工具回應。隨著代理依循其策略進行每次互動，此記錄會不斷增長。

對於長期對話，記錄可能會變得龐大並消耗大量 Token。歷史記錄壓縮有助於減少此情況，它將完整的訊息列表摘要成一個或多或少包含代理進一步運作所需重要資訊的訊息。

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
// 定義歷史記錄超過 100 條訊息時視為太長
private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy<String, String>("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // 壓縮 LLM 歷史記錄並為下一個節點保留目前的 ReceivedToolResult
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // 如果歷史記錄太長，則在執行任何工具後壓縮歷史記錄
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // 否則，繼續執行下一個 LLM 請求
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
<!--- KNIT example-history-compression-01.kt -->

在此範例中，策略會在每次工具呼叫後檢查歷史記錄是否太長。歷史記錄在將工具結果發送回 LLM 之前進行壓縮。這可防止上下文在長期對話中增長。

*   若要在策略的邏輯步驟（子圖）之間壓縮歷史記錄，您可以如下實作您的策略：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
-->
```kotlin
val strategy = strategy<String, String>("execute-with-history-compression") {
    val collectInformation by subgraph<String, String> {
        // Some steps to collect the information
    }
    val compressHistory by nodeLLMCompressHistory<String>()
    val makeTheDecision by subgraph<String, String> {
        // Some steps to make the decision based on the current compressed history and collected information
    }
    
    nodeStart then collectInformation then compressHistory then makeTheDecision
}
```
<!--- KNIT example-history-compression-02.kt -->

在此範例中，歷史記錄在完成資訊收集階段後、但在進入決策制定階段之前進行壓縮。

### 自訂節點中的歷史記錄壓縮

如果您正在實作自訂節點，您可以使用 `replaceHistoryWithTLDR()` 函數來壓縮歷史記錄，如下所示：

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

這種方法讓您有更大的彈性，可以在自訂節點邏輯中的任何點根據您的特定需求實作壓縮。

要了解有關自訂節點的更多資訊，請參閱 [Custom nodes](custom-nodes.md)。

## 歷史記錄壓縮策略

您可以透過向 `nodeLLMCompressHistory(strategy=...)` 或 `replaceHistoryWithTLDR(strategy=...)` 傳遞一個可選的 `strategy` 參數來自訂壓縮過程。該框架提供了幾種內建策略。

### WholeHistory (預設)

此為預設策略，它將整個歷史記錄壓縮成一條 TLDR 訊息，總結到目前為止已完成的內容。此策略適用於大多數通用使用情境，在這些情境中您希望維持對整個交談上下文的感知，同時減少 Token 使用量。

您可以如下使用它：

*   在策略圖中：
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

*   在自訂節點中：

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

此策略僅將最後 `n` 條訊息壓縮成一條 TLDR 訊息，並完全丟棄較早的訊息。當只有代理的最新成就（或最新發現的事實、最新上下文）與解決問題相關時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

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

*   在自訂節點中：

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

此策略將整個訊息歷史記錄分割成固定大小的塊，並將每個塊獨立壓縮成一條 TLDR 訊息。當您不僅需要迄今為止的簡明 TLDR，還希望追蹤整體進度，並且某些舊資訊可能也很重要時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

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

*   在自訂節點中：

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

此策略在歷史記錄中搜尋與所提供概念列表相關的特定事實並將其擷取。它將整個歷史記錄更改為僅包含這些事實，並將其作為未來 LLM 請求的上下文。當您了解哪些確切事實將有助於 LLM 更好地執行任務時，此策略非常有用。

您可以如下使用它：

*   在策略圖中：

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
            // 對 LLM 的描述 – 具體要搜尋什麼
            description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
            // LLM 會搜尋與此概念相關的多個事實：
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "product_details",
            // 對 LLM 的描述 – 具體要搜尋什麼
            description = "Brief details about products in the catalog the user has been checking",
            // LLM 會搜尋與此概念相關的多個事實：
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "issue_solved",
            // 對 LLM 的描述 – 具體要搜尋什麼
            description = "Was the initial user's issue resolved?",
            // LLM 會搜尋該問題的單一答案：
            factType = FactType.SINGLE
        )
    )
)
```
<!--- KNIT example-history-compression-10.kt -->

*   在自訂節點中：

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
                // 對 LLM 的描述 – 具體要搜尋什麼
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLM 會搜尋與此概念相關的多個事實：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // 對 LLM 的描述 – 具體要搜尋什麼
                description = "Brief details about products in the catalog the user has been checking",
                // LLM 會搜尋與此概念相關的多個事實：
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // 對 LLM 的描述 – 具體要搜尋什麼
                description = "Was the initial user's issue resolved?",
                // LLM 會搜尋該問題的單一答案：
                factType = FactType.SINGLE
            )
        )
    )
}
```
<!--- KNIT example-history-compression-11.kt -->

## 自訂歷史記錄壓縮策略實作

您可以透過繼承 `HistoryCompressionStrategy` 抽象類別並實作 `compress` 方法來建立自己的歷史記錄壓縮策略。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.session.AIAgentLLMWriteSession
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.prompt.message.Message
-->
```kotlin
class MyCustomCompressionStrategy : HistoryCompressionStrategy() {
    override suspend fun compress(
        llmSession: AIAgentLLMWriteSession,
        preserveMemory: Boolean,
        memoryMessages: List<Message>
    ) {
        // 1. 處理 llmSession.prompt.messages 中的目前歷史記錄
        // 2. 建立新的壓縮訊息
        // 3. 使用壓縮訊息更新 prompt

        // 範例實作：
        val importantMessages = llmSession.prompt.messages.filter {
            // 您的自訂篩選邏輯
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // 注意：您也可以使用 `llmSession` 提出 LLM 請求，並要求 LLM 替您執行某些任務，例如使用 `llmSession.requestLLMWithoutTools()`
        // 或者您可以變更目前模型：`llmSession.model = AnthropicModels.Sonnet_3_7` 並詢問其他 LLM 模型 – 但之後別忘了將其改回
        // 使用篩選後的訊息構成 prompt
        composePromptWithRequiredMessages(
            llmSession,
            importantMessages,
            preserveMemory,
            memoryMessages
        )
    }
}
```
<!--- KNIT example-history-compression-12.kt -->

在此範例中，自訂策略會篩選包含 "important" 字樣的訊息，並僅將這些訊息保留在壓縮後的歷史記錄中。

然後您可以如下使用它：

*   在策略圖中：

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

*   在自訂節點中：

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

## 壓縮期間的記憶體保留

所有歷史記錄壓縮方法都有一個 `preserveMemory` 參數，它決定在壓縮期間是否應保留記憶體相關訊息。這些訊息包含從記憶體中擷取的事實，或指示記憶體功能未啟用。

您可以如下使用 `preserveMemory` 參數：

*   在策略圖中：

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

*   在自訂節點中：

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