# LLM 會話與手動歷史記錄管理

本頁提供關於 LLM 會話的詳細資訊，包括如何使用讀取和寫入會話、管理對話歷史記錄，以及向語言模型發出請求。

## 簡介

LLM 會話是一個基本概念，它提供了一種結構化方式來與語言模型 (LLMs) 互動。它們管理對話歷史記錄、處理對 LLM 的請求，並為執行工具和處理回應提供一致的介面。

## 理解 LLM 會話

LLM 會話代表了與語言模型互動的上下文。它封裝了：

- 對話歷史記錄 (提示)
- 可用的工具
- 發出 LLM 請求的方法
- 更新對話歷史記錄的方法
- 執行工具的方法

會話由 `AIAgentLLMContext` 類別管理，該類別提供建立讀取和寫入會話的方法。

### 會話類型

Koog 框架提供兩種會話類型：

1.  **寫入會話** (`AIAgentLLMWriteSession`)：允許修改提示和工具、發出 LLM 請求並執行工具。在寫入會話中所做的更改會被持久化回 LLM 上下文。

2.  **讀取會話** (`AIAgentLLMReadSession`)：提供對提示和工具的唯讀存取。它們對於檢查當前狀態而無需進行更改非常有用。

關鍵區別在於寫入會話可以修改對話歷史記錄，而讀取會話則不能。

### 會話生命週期

會話具有明確定義的生命週期：

1.  **建立**：使用 `llm.writeSession { ... }` 或 `llm.readSession { ... }` 建立會話。
2.  **活躍階段**：當 lambda 區塊正在執行時，會話處於活躍狀態。
3.  **終止**：當 lambda 區塊完成時，會話會自動關閉。

會話實作了 `AutoCloseable` 介面，確保即使發生例外情況，它們也能正確清理。

## 使用 LLM 會話

### 建立會話

會話使用 `AIAgentLLMContext` 類別上的擴展函數建立：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating a write session
llm.writeSession {
    // Session code here
}

// Creating a read session
llm.readSession {
    // Session code here
}
```
<!--- KNIT example-sessions-01.kt -->

這些函數接受一個 lambda 區塊，該區塊在會話的上下文內執行。當區塊完成時，會話會自動關閉。

### 會話範圍與執行緒安全

會話使用讀寫鎖來確保執行緒安全：

-   多個讀取會話可以同時處於活躍狀態。
-   一次只能有一個寫入會話處於活躍狀態。
-   寫入會話會阻塞所有其他會話（包括讀取和寫入）。

這確保了對話歷史記錄不會因並發修改而損壞。

### 存取會話屬性

在會話內部，您可以存取提示和工具：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.readSession {
    val messageCount = prompt.messages.size
    val availableTools = tools.map { it.name }
}
```
<!--- KNIT example-sessions-02.kt -->

在寫入會話中，您也可以修改這些屬性：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolDescriptor

val newTools = listOf<ToolDescriptor>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Modify the prompt
    appendPrompt {
        user("New user message")
    }

    // Modify the tools
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

有關更多資訊，請參閱 [AIAgentLLMReadSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-read-session/index.html) 和 [AIAgentLLMWriteSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html) 的詳細 API 參考。

## 發出 LLM 請求

### 基本請求方法

發出 LLM 請求最常用的方法有：

1.  `requestLLM()`：向 LLM 發出帶有當前提示和工具的請求，返回單個回應。

2.  `requestLLMMultiple()`：向 LLM 發出帶有當前提示和工具的請求，返回多個回應。

3.  `requestLLMWithoutTools()`：向 LLM 發出帶有當前提示但不帶任何工具的請求，返回單個回應。

4.  `requestLLMForceOneTool`：向 LLM 發出帶有當前提示和工具的請求，強制使用一個工具。

5.  `requestLLMOnlyCallingTools`：向 LLM 發出應僅使用工具處理的請求。

範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a request with tools enabled
    val response = requestLLM()

    // Make a request without tools
    val responseWithoutTools = requestLLMWithoutTools()

    // Make a request that returns multiple responses
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### 請求的工作方式

當您明確呼叫其中一個請求方法時，就會發出 LLM 請求。需要理解的關鍵點是：

1.  **明確調用**：只有當您呼叫 `requestLLM()`、`requestLLMWithoutTools()` 等方法時，請求才會發生。
2.  **即時執行**：當您呼叫請求方法時，請求會立即發出，並且該方法會阻塞，直到收到回應。
3.  **自動歷史記錄更新**：在寫入會話中，回應會自動添加到對話歷史記錄中。
4.  **無隱式請求**：系統不會發出隱式請求；您需要明確呼叫請求方法。

### 帶工具的請求方法

當發出啟用工具的請求時，LLM 可能會以工具呼叫而不是文本回應的形式回應。請求方法會透明地處理此問題：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    val response = requestLLM()

    // The response might be a tool call or a text response
    if (response is Message.Tool.Call) {
        // Handle tool call
    } else {
        // Handle text response
    }
}
```
<!--- KNIT example-sessions-05.kt -->

實際上，您通常不需要手動檢查回應類型，因為代理圖會自動處理此路由。

### 結構化和串流請求

對於更進階的用例，平台提供了用於結構化和串流請求的方法：

1.  `requestLLMStructured()`：請求 LLM 以特定的結構化格式提供回應。

2.  `requestLLMStructuredOneShot()`：類似於 `requestLLMStructured()`，但沒有重試或修正。

3.  `requestLLMStreaming()`：向 LLM 發出串流請求，返回回應區塊的流程。

範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleParallelNodeExecution07.JokeRating

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a structured request
    val structuredResponse = requestLLMStructured<JokeRating>()

    // Make a streaming request
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // Process each chunk as it arrives
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 管理對話歷史記錄

### 更新提示

在寫入會話中，您可以使用 `appendPrompt` 方法向提示（對話歷史記錄）新增訊息：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlinx.datetime.Clock

val myToolResult = Message.Tool.Result(
    id = "",
    tool = "",
    content = "",
    metaInfo = RequestMetaInfo(Clock.System.now())
)

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    appendPrompt {
        // Add a system message
        system("You are a helpful assistant.")

        // Add a user message
        user("Hello, can you help me with a coding question?")

        // Add an assistant message
        assistant("Of course! What's your question?")

        // Add a tool result
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

您還可以使用 `rewritePrompt` 方法完全重寫提示：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val filteredMessages = emptyList<Message>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    rewritePrompt { oldPrompt ->
        // Create a new prompt based on the old one
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### 回應時自動更新歷史記錄

當您在寫入會話中發出 LLM 請求時，回應會自動添加到對話歷史記錄中：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Add a user message
    appendPrompt {
        user("What's the capital of France?")
    }

    // Make a request – the response is automatically added to the history
    val response = requestLLM()

    // The prompt now includes both the user message and the model's response
}
```
<!--- KNIT example-sessions-09.kt -->

這種自動歷史記錄更新是寫入會話的關鍵功能，確保對話自然流動。

### 歷史記錄壓縮

對於長時間運行的對話，歷史記錄可能會變得很大並消耗大量令牌。平台提供了壓縮歷史記錄的方法：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Compress the history using a TLDR approach
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

您還可以使用策略圖中的 `nodeLLMCompressHistory` 節點在特定點壓縮歷史記錄。

有關歷史記錄壓縮和壓縮策略的更多資訊，請參閱 [歷史記錄壓縮](history-compression.md)。

## 在會話中執行工具

### 呼叫工具

寫入會話提供了幾種呼叫工具的方法：

1.  `callTool(tool, args)`：透過參考呼叫工具。

2.  `callTool(toolName, args)`：透過名稱呼叫工具。

3.  `callTool(toolClass, args)`：透過類別呼叫工具。

4.  `callToolRaw(toolName, args)`：透過名稱呼叫工具並返回原始字串結果。

範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.core.agent.session.callTool
import ai.koog.agents.core.agent.session.callToolRaw

val myTool = AskUser
val myArgs = AskUser.Args("this is a string")

typealias MyTool = AskUser

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Call a tool by reference
    val result = callTool(myTool, myArgs)

    // Call a tool by name
    val result2 = callTool("myToolName", myArgs)

    // Call a tool by class
    val result3 = callTool(MyTool::class, myArgs)

    // Call a tool and get the raw result
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### 並行工具執行

為了並行執行多個工具，寫入會話在 `Flow` 上提供了擴展函數：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import kotlinx.coroutines.flow.flow

typealias MyTool = AskUser

val data = ""
fun parseDataToArgs(data: String) = flow { emit(AskUser.Args(data)) }

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Run tools in parallel
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // Process each result
    }

    // Run tools in parallel and get raw results
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // Process each raw result
    }
}
```
<!--- KNIT example-sessions-12.kt -->

這對於高效處理大量資料很有用。

## 最佳實踐

使用 LLM 會話時，請遵循以下最佳實踐：

1.  **使用正確的會話類型**：當您需要修改對話歷史記錄時使用寫入會話，而當您只需要讀取它時使用讀取會話。

2.  **保持會話簡短**：會話應專注於特定任務並盡快關閉以釋放資源。

3.  **處理例外**：確保在會話中處理例外情況，以防止資源洩漏。

4.  **管理歷史記錄大小**：對於長時間運行的對話，使用歷史記錄壓縮來減少令牌使用量。

5.  **偏好高階抽象**：在可能的情況下，使用基於節點的 API。例如，使用 `nodeLLMRequest` 而不是直接操作會話。

6.  **注意執行緒安全**：請記住，寫入會話會阻塞其他會話，因此請盡量縮短寫入操作。

7.  **使用結構化請求處理複雜資料**：當您需要 LLM 返回結構化資料時，請使用 `requestLLMStructured` 而不是解析自由格式文本。

8.  **使用串流處理長回應**：對於長回應，使用 `requestLLMStreaming` 在回應到達時處理它。

## 故障排除

### 會話已關閉

如果您看到類似於 `Cannot use session after it was closed` 的錯誤，表示您正在嘗試在會話的 lambda 區塊完成後使用它。請確保所有會話操作都在會話區塊內執行。

### 歷史記錄過大

如果您的歷史記錄變得太大並消耗過多令牌，請使用歷史記錄壓縮技術：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
}
```
<!--- KNIT example-sessions-13.kt -->

有關更多資訊，請參閱 [歷史記錄壓縮](history-compression.md)

### 找不到工具

如果您看到有關找不到工具的錯誤，請檢查：

-   工具是否在工具註冊表中正確註冊。
-   您是否使用了正確的工具名稱或類別。

## API 文件

有關更多資訊，請參閱完整的 [AIAgentLLMSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-session/index.html) 和 [AIAgentLLMContext](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.context/-a-i-agent-l-l-m-context/index.html) 參考。