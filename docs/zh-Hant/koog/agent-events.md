# Agent 事件

Agent 事件是在 Agent 工作流程中發生動作或互動。其包含：

- Agent 生命週期事件
- 策略事件
- 節點執行事件
- LLM 呼叫事件
- LLM 串流事件
- 工具執行事件

注意：功能事件定義在 `agents-core` 模組中，位於 `ai.koog.agents.core.feature.model.events` 套件下。諸如 `agents-features-trace`、`agents-features-debugger` 和 `agents-features-event-handler` 等功能會消耗這些事件，以處理並轉發在 Agent 執行期間建立的訊息。

## 預定義事件類型

Koog 提供了可用於自訂訊息處理器的預定義事件類型。預定義事件可根據其相關實體歸類為數個類別：

- [Agent 事件](#agent-events)
- [策略事件](#strategy-events)
- [節點事件](#node-events)
- [LLM 呼叫事件](#llm-call-events)
- [LLM 串流事件](#llm-streaming-events)
- [工具執行事件](#tool-execution-events)

### Agent 事件

#### AgentStartingEvent

代表 Agent 執行 (run) 的開始。包含以下欄位：

| 名稱        | 資料類型 | 必要 | 預設 | 說明                           |
|-------------|----------|------|------|--------------------------------|
| `agentId`   | String   | 是   |      | AI Agent 的唯一識別碼。        |
| `runId`     | String   | 是   |      | AI Agent 執行的唯一識別碼。    |

#### AgentCompletedEvent

代表 Agent 執行 (run) 的結束。包含以下欄位：

| 名稱        | 資料類型 | 必要 | 預設 | 說明                                     |
|-------------|----------|------|------|------------------------------------------|
| `agentId`   | String   | 是   |      | AI Agent 的唯一識別碼。                  |
| `runId`     | String   | 是   |      | AI Agent 執行的唯一識別碼。              |
| `result`    | String   | 是   |      | Agent 執行的結果。若無結果，可為 `null`。|

#### AgentExecutionFailedEvent

代表 Agent 執行 (run) 期間發生錯誤。包含以下欄位：

| 名稱        | 資料類型     | 必要 | 預設 | 說明                                                                                             |
|-------------|--------------|------|------|--------------------------------------------------------------------------------------------------|
| `agentId`   | String       | 是   |      | AI Agent 的唯一識別碼。                                                                          |
| `runId`     | String       | 是   |      | AI Agent 執行的唯一識別碼。                                                                      |
| `error`     | AIAgentError | 是   |      | 在 Agent 執行期間發生的特定錯誤。詳細資訊請參閱 [AIAgentError](#aiagenterror)。|

#### AgentClosingEvent

代表 Agent 的關閉或終止。包含以下欄位：

| 名稱        | 資料類型 | 必要 | 預設 | 說明                           |
|-------------|----------|------|------|--------------------------------|
| `agentId`   | String   | 是   |      | AI Agent 的唯一識別碼。        |

<a id="aiagenterror"></a>
`AIAgentError` 類別提供了在 Agent 執行期間發生的錯誤的更多詳細資訊。包含以下欄位：

| 名稱         | 資料類型 | 必要 | 預設 | 說明                               |
|--------------|----------|------|------|------------------------------------|
| `message`    | String   | 是   |      | 提供特定錯誤詳細資訊的訊息。       |
| `stackTrace` | String   | 是   |      | 直到最後執行程式碼的堆疊追蹤記錄。 |
| `cause`      | String   | 否   | null | 錯誤的原因（如果有的話）。         |

### 策略事件

#### GraphStrategyStartingEvent

代表圖形策略執行 (run) 的開始。包含以下欄位：

| 名稱           | 資料類型           | 必要 | 預設 | 說明                                   |
|----------------|--------------------|------|------|----------------------------------------|
| `runId`        | String             | 是   |      | 策略執行的唯一識別碼。                 |
| `strategyName` | String             | 是   |      | 策略的名稱。                           |
| `graph`        | StrategyEventGraph | 是   |      | 代表策略工作流程的圖形結構。           |

#### FunctionalStrategyStartingEvent

代表函數式策略執行 (run) 的開始。包含以下欄位：

| 名稱           | 資料類型 | 必要 | 預設 | 說明                           |
|----------------|----------|------|------|--------------------------------|
| `runId`        | String   | 是   |      | 策略執行的唯一識別碼。         |
| `strategyName` | String   | 是   |      | 策略的名稱。                   |

#### StrategyCompletedEvent

代表策略執行 (run) 的結束。包含以下欄位：

| 名稱           | 資料類型 | 必要 | 預設 | 說明                                       |
|----------------|----------|------|------|--------------------------------------------|
| `runId`        | String   | 是   |      | 策略執行的唯一識別碼。                     |
| `strategyName` | String   | 是   |      | 策略的名稱。                               |
| `result`       | String   | 是   |      | 執行的結果。若無結果，可為 `null`。        |

### 節點事件

#### NodeExecutionStartingEvent

代表節點執行 (run) 的開始。包含以下欄位：

| 名稱       | 資料類型 | 必要 | 預設 | 說明                           |
|------------|----------|------|------|--------------------------------|
| `runId`    | String   | 是   |      | 策略執行的唯一識別碼。         |
| `nodeName` | String   | 是   |      | 開始執行的節點名稱。           |
| `input`    | String   | 是   |      | 節點的輸入值。                 |

#### NodeExecutionCompletedEvent

代表節點執行 (run) 的結束。包含以下欄位：

| 名稱       | 資料類型 | 必要 | 預設 | 說明                           |
|------------|----------|------|------|--------------------------------|
| `runId`    | String   | 是   |      | 策略執行的唯一識別碼。         |
| `nodeName` | String   | 是   |      | 結束執行的節點名稱。           |
| `input`    | String   | 是   |      | 節點的輸入值。                 |
| `output`   | String   | 是   |      | 節點產生的輸出值。             |

#### NodeExecutionFailedEvent

代表節點執行 (run) 期間發生的錯誤。包含以下欄位：

| 名稱       | 資料類型     | 必要 | 預設 | 說明                                                                                             |
|------------|--------------|------|------|--------------------------------------------------------------------------------------------------|
| `runId`    | String       | 是   |      | 策略執行的唯一識別碼。                                                                           |
| `nodeName` | String       | 是   |      | 發生錯誤的節點名稱。                                                                             |
| `error`    | AIAgentError | 是   |      | 在節點執行期間發生的特定錯誤。詳細資訊請參閱 [AIAgentError](#aiagenterror)。|

### LLM 呼叫事件

#### LLMCallStartingEvent

代表 LLM 呼叫的開始。包含以下欄位：

| 名稱     | 資料類型    | 必要 | 預設 | 說明                                       |
|----------|-------------|------|------|--------------------------------------------|
| `runId`  | String      | 是   |      | LLM 執行的唯一識別碼。                     |
| `prompt` | Prompt      | 是   |      | 傳送至模型的提示。詳細資訊請參閱 [Prompt](#prompt)。|
| `model`  | String      | 是   |      | 模型識別碼，格式為 `llm_provider:model_id`。|
| `tools`  | List&lt;String&gt; | 是   |      | 模型可呼叫的工具列表。                     |

<a id="prompt"></a>
`Prompt` 類別代表提示的資料結構，由訊息列表、唯一識別碼以及語言模型設定的可選參數組成。包含以下欄位：

| 名稱       | 資料類型          | 必要 | 預設        | 說明                                           |
|------------|-------------------|------|-------------|------------------------------------------------|
| `messages` | List&lt;Message&gt;     | 是   |             | 提示包含的訊息列表。                           |
| `id`       | String            | 是   |             | 提示的唯一識別碼。                             |
| `params`   | LLMParams         | 否   | LLMParams() | 控制 LLM 生成內容方式的設定。                |

#### LLMCallCompletedEvent

代表 LLM 呼叫的結束。包含以下欄位：

| 名稱                 | 資料類型               | 必要 | 預設 | 說明                                       |
|----------------------|------------------------|------|------|--------------------------------------------|
| `runId`              | String                 | 是   |      | LLM 執行的唯一識別碼。                     |
| `prompt`             | Prompt                 | 是   |      | 呼叫中使用的提示。                         |
| `model`              | String                 | 是   |      | 模型識別碼，格式為 `llm_provider:model_id`。|
| `responses`          | List&lt;Message.Response&gt; | 是   |      | 模型返回的一個或多個回應。                 |
| `moderationResponse` | ModerationResult       | 否   | null | 審核回應（如果有的話）。                   |

### LLM 串流事件

#### LLMStreamingStartingEvent

代表 LLM 串流呼叫的開始。包含以下欄位：

| 名稱     | 資料類型    | 必要 | 預設 | 說明                                       |
|----------|-------------|------|------|--------------------------------------------|
| `runId`  | String      | 是   |      | LLM 執行的唯一識別碼。                     |
| `prompt` | Prompt      | 是   |      | 傳送至模型的提示。                         |
| `model`  | String      | 是   |      | 模型識別碼，格式為 `llm_provider:model_id`。|
| `tools`  | List&lt;String&gt; | 是   |      | 模型可呼叫的工具列表。                     |

#### LLMStreamingFrameReceivedEvent

代表從 LLM 接收到的串流影格。包含以下欄位：

| 名稱     | 資料類型    | 必要 | 預設 | 說明                       |
|----------|-------------|------|------|----------------------------|
| `runId`  | String      | 是   |      | LLM 執行的唯一識別碼。     |
| `frame`  | StreamFrame | 是   |      | 從串流接收到的影格。       |

#### LLMStreamingFailedEvent

代表 LLM 串流呼叫期間發生錯誤。包含以下欄位：

| 名稱    | 資料類型     | 必要 | 預設 | 說明                                                                                             |
|---------|--------------|------|------|--------------------------------------------------------------------------------------------------|
| `runId` | String       | 是   |      | LLM 執行的唯一識別碼。                                                                           |
| `error` | AIAgentError | 是   |      | 串流期間發生的特定錯誤。詳細資訊請參閱 [AIAgentError](#aiagenterror)。|

#### LLMStreamingCompletedEvent

代表 LLM 串流呼叫的結束。包含以下欄位：

| 名稱     | 資料類型    | 必要 | 預設 | 說明                                       |
|----------|-------------|------|------|--------------------------------------------|
| `runId`  | String      | 是   |      | LLM 執行的唯一識別碼。                     |
| `prompt` | Prompt      | 是   |      | 傳送至模型的提示。                         |
| `model`  | String      | 是   |      | 模型識別碼，格式為 `llm_provider:model_id`。|
| `tools`  | List&lt;String&gt; | 是   |      | 模型可呼叫的工具列表。                     |

### 工具執行事件

#### ToolExecutionStartingEvent

代表模型呼叫工具的事件。包含以下欄位：

| 名稱           | 資料類型   | 必要 | 預設 | 說明                           |
|----------------|------------|------|------|--------------------------------|
| `runId`        | String     | 是   |      | 策略/Agent 執行的唯一識別碼。  |
| `toolCallId`   | String     | 否   | null | 工具呼叫的識別碼（如果有的話）。|
| `toolName`     | String     | 是   |      | 工具的名稱。                   |
| `toolArgs`     | JsonObject | 是   |      | 提供給工具的參數。             |

#### ToolValidationFailedEvent

代表工具呼叫期間發生驗證錯誤。包含以下欄位：

| 名稱           | 資料類型   | 必要 | 預設 | 說明                           |
|----------------|------------|------|------|--------------------------------|
| `runId`        | String     | 是   |      | 策略/Agent 執行的唯一識別碼。  |
| `toolCallId`   | String     | 否   | null | 工具呼叫的識別碼（如果有的話）。|
| `toolName`     | String     | 是   |      | 驗證失敗的工具名稱。           |
| `toolArgs`     | JsonObject | 是   |      | 提供給工具的參數。             |
| `error`        | String     | 是   |      | 驗證錯誤訊息。                 |

#### ToolExecutionFailedEvent

代表執行工具失敗。包含以下欄位：

| 名稱           | 資料類型     | 必要 | 預設 | 說明                                                                                                 |
|----------------|--------------|------|------|------------------------------------------------------------------------------------------------------|
| `runId`        | String       | 是   |      | 策略/Agent 執行的唯一識別碼。                                                                        |
| `toolCallId`   | String       | 否   | null | 工具呼叫的識別碼（如果有的話）。                                                                     |
| `toolName`     | String       | 是   |      | 工具的名稱。                                                                                         |
| `toolArgs`     | JsonObject   | 是   |      | 提供給工具的參數。                                                                                   |
| `error`        | AIAgentError | 是   |      | 嘗試呼叫工具時發生的特定錯誤。詳細資訊請參閱 [AIAgentError](#aiagenterror)。|

#### ToolExecutionCompletedEvent

代表成功呼叫工具並返回結果。包含以下欄位：

| 名稱           | 資料類型   | 必要 | 預設 | 說明                       |
|----------------|------------|------|------|----------------------------|
| `runId`        | String     | 是   |      | 執行的唯一識別碼。         |
| `toolCallId`   | String     | 否   | null | 工具呼叫的識別碼。         |
| `toolName`     | String     | 是   |      | 工具的名稱。               |
| `toolArgs`     | JsonObject | 是   |      | 提供給工具的參數。         |
| `result`       | String     | 是   |      | 工具呼叫的結果（可為 null）。|

## 常見問題與疑難排解

以下部分包含與追蹤功能相關的常見問題和解答。

### 如何只追蹤 Agent 執行的特定部分？

使用 `messageFilter` 屬性來篩選事件。例如，只追蹤 LLM 呼叫：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
            val writer = TraceFeatureMessageFileWriter(
                outputPath,
                { path: Path -> SystemFileSystem.sink(path).buffered() }
            )
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath, 
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )
    addMessageProcessor(fileWriter)
    
    // Only trace LLM calls
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-tracing-01.kt -->

### 我可以使用多個訊息處理器嗎？

是的，您可以加入多個訊息處理器以同時追蹤至不同的目的地：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"
val syncOpener = { path: Path -> SystemFileSystem.sink(path).buffered() }
val logger = KotlinLogging.logger {}
val connectionConfig = DefaultServerConnectionConfig(host = ai.koog.agents.example.exampleTracing06.host, port = ai.koog.agents.example.exampleTracing06.port)

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, syncOpener))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```
<!--- KNIT example-tracing-02.kt -->

### 如何建立自訂訊息處理器？

實作 `FeatureMessageProcessor` 介面：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.NodeExecutionStartingEvent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.message.FeatureMessage
import ai.koog.agents.core.feature.message.FeatureMessageProcessor
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
class CustomTraceProcessor : FeatureMessageProcessor() {

    // Current open state of the processor
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // Custom processing logic
        when (message) {
            is NodeExecutionStartingEvent -> {
                // Process node start event
            }

            is LLMCallCompletedEvent -> {
                // Process LLM call end event 
            }
            // Handle other event types 
        }
    }

    override suspend fun close() {
        // Close established connections
    }
}

// Use your custom processor
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-03.kt -->

有關可由訊息處理器處理的現有事件類型的更多資訊，請參閱 [預定義事件類型](#predefined-event-types)。