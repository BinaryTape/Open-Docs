# LLM 工作階段與手動歷程管理

本頁面提供了關於 LLM 工作階段的詳細資訊，包括如何使用讀取與寫入工作階段、管理對話歷程，以及向語言模型發送請求。

## 簡介

LLM 工作階段是一個核心概念，提供了一種與大型語言模型 (LLM) 互動的結構化方式。它們管理對話歷程、處理發送至 LLM 的請求，並為執行工具和處理回應提供一致的介面。

## 了解 LLM 工作階段

一個 LLM 工作階段代表了與語言模型互動的上下文 (context)。它封裝了：

- 對話歷程 (提示詞)
- 可用的工具
- 向 LLM 發送請求的方法
- 更新對話歷程的方法
- 執行工具的方法

工作階段由 `AIAgentLLMContext` 類別管理，該類別提供了建立讀取和寫入工作階段的方法。

### 工作階段類型

Koog 架構提供了兩種類型的工作階段：

1.  **寫入工作階段** (`AIAgentLLMWriteSession`)：允許修改提示詞與工具、發送 LLM 請求以及執行工具。在寫入工作階段中所做的變更會被持久化回 LLM 上下文。

2.  **讀取工作階段** (`AIAgentLLMReadSession`)：提供對提示詞與工具的唯讀存取。這對於在不進行變更的情況下檢查目前狀態非常有用。

關鍵區別在於寫入工作階段可以修改對話歷程，而讀取工作階段則不行。

### 工作階段生命週期

工作階段具有明確的生命週期：

1.  **建立**：使用 `llm.writeSession { ... }` 或 `llm.readSession { ... }` 建立工作階段。
2.  **活動階段**：當 Lambda 區塊正在執行時，工作階段處於活動狀態。
3.  **終止**：當 Lambda 區塊執行完成時，工作階段會自動關閉。

工作階段實作了 `AutoCloseable` 介面，確保即使發生例外狀況，它們也能被妥善清理。

## 使用 LLM 工作階段

### 建立工作階段

工作階段是使用 `AIAgentLLMContext` 類別上的擴充函式建立的：

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
// 建立寫入工作階段
llm.writeSession {
    // 此處為工作階段程式碼
}

// 建立讀取工作階段
llm.readSession {
    // 此處為工作階段程式碼
}
```
<!--- KNIT example-sessions-01.kt -->

這些函式接受一個在工作階段上下文中執行的 Lambda 區塊。當區塊完成時，工作階段會自動關閉。

### 工作階段作用域與執行緒安全

工作階段使用讀寫鎖來確保執行緒安全：

- 多個讀取工作階段可以同時處於活動狀態。
- 一次只能有一個寫入工作階段處於活動狀態。
- 寫入工作階段會阻塞所有其他工作階段（包括讀取與寫入）。

這確保了對話歷程不會因並行修改而損壞。

### 存取工作階段屬性

在工作階段內，您可以存取提示詞與工具：

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

在寫入工作階段中，您還可以修改這些屬性：

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
    // 修改提示詞
    appendPrompt {
        user("New user message")
    }

    // 修改工具
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

如需更多資訊，請參閱 [AIAgentLLMReadSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMReadSession) 與 [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) 的詳細 API 參考。

## 發送 LLM 請求

### 基本請求方法

發送 LLM 請求最常用的方法有：

1.  `requestLLM()`：使用目前的提示詞與工具向 LLM 發送請求，傳回單一回應。

2.  `requestLLMMultiple()`：使用目前的提示詞與工具向 LLM 發送請求，傳回多個回應。

3.  `requestLLMWithoutTools()`：使用目前的提示詞但不帶任何工具向 LLM 發送請求，傳回單一回應。

4.  `requestLLMForceOneTool`：使用目前的提示詞與工具向 LLM 發送請求，強制使用一個工具。

5.  `requestLLMOnlyCallingTools`：向 LLM 發送僅應透過使用工具來處理的請求。

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
    // 在啟用工具的情況下發送請求
    val response = requestLLM()

    // 在不使用工具的情況下發送請求
    val responseWithoutTools = requestLLMWithoutTools()

    // 發送傳回多個回應的請求
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### 請求運作方式

當您明確呼叫其中一個請求方法時，就會發送 LLM 請求。需要理解的重點如下：

1.  **明確調用**：只有當您呼叫如 `requestLLM()`、`requestLLMWithoutTools()` 等方法時，才會發生請求。
2.  **立即執行**：當您呼叫請求方法時，請求會立即發送，且該方法會阻塞直到收到回應。
3.  **自動歷程更新**：在寫入工作階段中，回應會自動新增到對話歷程中。
4.  **無隱含請求**：系統不會發送隱含請求；您需要明確呼叫請求方法。

### 帶工具的請求方法

在啟用工具的情況下發送請求時，LLM 可能會以工具呼叫 (tool call) 而非文字回應。請求方法會透明地處理此情況：

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

    // 回應可能是工具呼叫或文字回應
    if (response is Message.Tool.Call) {
        // 處理工具呼叫
    } else {
        // 處理文字回應
    }
}
```
<!--- KNIT example-sessions-05.kt -->

在實作中，您通常不需要手動檢查回應類型，因為代理圖 (agent graph) 會自動處理此路由。

### 結構化與串流請求

對於更進階的使用案例，平台提供了結構化與串流請求的方法：

1.  `requestLLMStructured()`：請求 LLM 以特定的結構化格式提供回應。

2.  `requestLLMStructuredOneShot()`：類似於 `requestLLMStructured()`，但沒有重試或修正機制。

3.  `requestLLMStreaming()`：向 LLM 發送串流請求，傳回回應片段 (chunk) 的流 (flow)。

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
    // 發送結構化請求
    val structuredResponse = requestLLMStructured<JokeRating>()

    // 發送串流請求
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // 在每個片段到達時進行處理
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 管理對話歷程

### 更新提示詞

在寫入工作階段中，您可以使用 `appendPrompt` 方法將訊息新增至提示詞（對話歷程）：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlin.time.Clock

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
        // 新增系統訊息
        system("You are a helpful assistant.")

        // 新增使用者訊息
        user("Hello, can you help me with a coding question?")

        // 新增助理訊息
        assistant("Of course! What's your question?")

        // 新增工具結果
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

您也可以使用 `rewritePrompt` 方法完全重寫提示詞：

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
        // 根據舊提示詞建立新提示詞
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### 回應時的自動歷程更新

當您在寫入工作階段中發送 LLM 請求時，回應會自動新增到對話歷程中：

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
    // 新增使用者訊息
    appendPrompt {
        user("What's the capital of France?")
    }

    // 發送請求 – 回應會自動新增到歷程記錄中
    val response = requestLLM()

    // 現在提示詞同時包含使用者訊息與模型的回應
}
```
<!--- KNIT example-sessions-09.kt -->

這種自動歷程更新是寫入工作階段的關鍵功能，確保對話流自然銜接。

### 歷程壓縮

對於長期執行的對話，歷程記錄可能會變得很龐大並消耗大量權杖 (token)。平台提供了壓縮歷程記錄的方法：

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
    // 使用 TLDR 方法壓縮歷程記錄
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

您也可以在策略圖中使用 `nodeLLMCompressHistory` 節點在特定點壓縮歷程記錄。

如需更多關於歷程壓縮與壓縮策略的資訊，請參閱 [歷程壓縮](history-compression.md)。

## 在工作階段中執行工具

### 呼叫工具

寫入工作階段提供了多種呼叫工具的方法：

1.  `callTool(tool, args)`：透過參照呼叫工具。

2.  `callTool(toolName, args)`：透過名稱呼叫工具。

3.  `callTool(toolClass, args)`：透過類別呼叫工具。

4.  `callToolRaw(toolName, args)`：透過名稱呼叫工具並傳回原始字串結果。

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
    // 透過參照呼叫工具
    val result = callTool(myTool, myArgs)

    // 透過名稱呼叫工具
    val result2 = callTool("myToolName", myArgs)

    // 透過類別呼叫工具
    val result3 = callTool(MyTool::class, myArgs)

    // 呼叫工具並取得原始結果
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### 並行工具執行

為了並行執行多個工具，寫入工作階段在 `Flow` 上提供了擴充函式：

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
    // 並行執行工具
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // 處理每個結果
    }

    // 並行執行工具並取得原始結果
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // 處理每個原始結果
    }
}
```
<!--- KNIT example-sessions-12.kt -->

這對於高效處理大量資料非常有用。

## 最佳實務

在使用 LLM 工作階段時，請遵循以下最佳實務：

1.  **使用正確的工作階段類型**：當您需要修改對話歷程時使用寫入工作階段，當您只需要讀取時使用讀取工作階段。

2.  **保持工作階段簡短**：工作階段應專注於特定任務，並儘快關閉以釋放資源。

3.  **處理例外狀況**：確保在工作階段內處理例外狀況，以防止資源洩漏。

4.  **管理歷程大小**：對於長期執行的對話，使用歷程壓縮來減少權杖用量。

5.  **偏好高階抽象**：盡可能使用基於節點的 API。例如，使用 `nodeLLMRequest` 而不是直接操作工作階段。

6.  **注意執行緒安全**：請記住寫入工作階段會阻塞其他工作階段，因此請盡可能縮短寫入操作的時間。

7.  **對複雜資料使用結構化請求**：當您需要 LLM 傳回結構化資料時，使用 `requestLLMStructured` 而不是剖析自由格式文字。

8.  **對長回應使用串流**：對於長回應，使用 `requestLLMStreaming` 以在回應到達時立即處理。

## 疑難排解

### 工作階段已關閉

如果您看到類似 `Cannot use session after it was closed` 的錯誤，表示您正嘗試在 Lambda 區塊完成後使用工作階段。請確保所有工作階段操作都在工作階段區塊內執行。

### 歷程記錄過大

如果您的歷程記錄變得太大並消耗過多權杖，請使用歷程壓縮技術：

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

如需更多資訊，請參閱 [歷程壓縮](history-compression.md)

### 找不到工具

如果您看到有關找不到工具的錯誤，請檢查：

- 工具是否已在工具註冊表中正確註冊。
- 您是否使用了正確的工具名稱或類別。

## API 文件

如需更多資訊，請參閱完整的 [AIAgentLLMSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMSession) 與 [AIAgentLLMContext](api:agents-core::ai.koog.agents.core.agent.context.AIAgentLLMContext) 參考。