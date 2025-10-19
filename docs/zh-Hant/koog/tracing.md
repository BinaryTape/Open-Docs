# 追蹤

此頁面包含有關追蹤 (Tracing) 功能的詳細資訊，該功能為 AI 代理程式提供了全面的追蹤能力。

## 功能概述

追蹤功能是一個強大的監控與偵錯工具，它能擷取關於代理程式執行過程的詳細資訊，包括：

*   策略執行
*   LLM 呼叫
*   LLM 串流 (開始、幀、完成、錯誤)
*   工具呼叫
*   代理程式圖中的節點執行

此功能透過攔截代理程式管線中的關鍵事件，並將其轉發給可設定的訊息處理器。這些處理器可以將追蹤資訊輸出到各種目的地，例如紀錄檔或檔案系統中的其他類型檔案，使開發者能夠深入瞭解代理程式的行為並有效地排解問題。

### 事件流程

1.  追蹤功能攔截代理程式管線中的事件。
2.  事件會根據設定的訊息篩選器進行篩選。
3.  篩選後的事件會傳遞給已註冊的訊息處理器。
4.  訊息處理器會格式化並將事件輸出到各自的目的地。

## 設定與初始化

### 基本設定

若要使用追蹤功能，您需要：

1.  擁有一或多個訊息處理器（您可以使用現有的或建立自己的）。
2.  在您的代理程式中安裝 `Tracing`。
3.  配置訊息篩選器（可選）。
4.  將訊息處理器添加到該功能中。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.ToolCallStartingEvent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
-->
```kotlin
// Defining a logger/file that will be used as a destination of trace messages 
val logger = KotlinLogging.logger { }
val outputPath = Path("/path/to/trace.log")

// Creating an agent
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Tracing) {

        // Configure message processors to handle trace events
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        addMessageProcessor(TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
        ))
    }
}
```
<!--- KNIT example-tracing-01.kt -->

### 訊息篩選

您可以處理所有現有事件，或根據特定準則選擇其中一些。訊息篩選器可讓您控制哪些事件被處理。這對於專注於代理程式執行過程的特定方面非常有用：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.*
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Tracing) {
-->
<!--- SUFFIX
   }
}
-->
```kotlin

val fileWriter = TraceFeatureMessageFileWriter(
    outputPath,
    { path: Path -> SystemFileSystem.sink(path).buffered() }
)

addMessageProcessor(fileWriter)

// Filter for LLM-related events only
fileWriter.setMessageFilter { message ->
    message is LLMCallStartingEvent || message is LLMCallCompletedEvent
}

// Filter for tool-related events only
fileWriter.setMessageFilter { message -> 
    message is ToolCallStartingEvent ||
           message is ToolCallCompletedEvent ||
           message is ToolValidationFailedEvent ||
           message is ToolCallFailedEvent
}

// Filter for node execution events only
fileWriter.setMessageFilter { message -> 
    message is NodeExecutionStartingEvent || message is NodeExecutionCompletedEvent
}
```
<!--- KNIT example-tracing-02.kt -->

### 大量追蹤資料

對於具有複雜策略或長時間執行的代理程式，追蹤事件的數量可能會非常龐大。考慮使用以下方法來管理事件量：

*   使用特定的訊息篩選器來減少事件數量。
*   實作帶有緩衝或取樣功能的自訂訊息處理器。
*   使用紀錄檔輪替來防止紀錄檔過大。

### 依賴關係圖

追蹤功能具有以下依賴項：

```
Tracing
├── AIAgentPipeline (用於攔截事件)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (from ai.koog.agents.core.feature.model)
    ├── AgentStartingEvent
    ├── AgentCompletedEvent
    ├── AgentExecutionFailedEvent
    ├── StrategyStartingEvent
    ├── StrategyCompletedEvent
    ├── NodeExecutionStartingEvent
    ├── NodeExecutionCompletedEvent
    ├── LLMCallStartingEvent
    ├── LLMCallCompletedEvent
    ├── LLMStreamingStartingEvent
    ├── LLMStreamingFrameReceivedEvent
    ├── LLMStreamingFailedEvent
    ├── LLMStreamingCompletedEvent
    ├── ToolCallStartingEvent
    ├── ToolValidationFailedEvent
    ├── ToolCallFailedEvent
    └── ToolCallCompletedEvent
```

## 範例與快速入門

### 基本追蹤到紀錄器

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
-->
```kotlin
// Create a logger
val logger = KotlinLogging.logger { }

fun main() {
    runBlocking {
       // Create an agent with tracing
       val agent = AIAgent(
          promptExecutor = simpleOllamaAIExecutor(),
          llmModel = OllamaModels.Meta.LLAMA_3_2,
       ) {
          install(Tracing) {
             addMessageProcessor(TraceFeatureMessageLogWriter(logger))
          }
       }

       // Run the agent
       agent.run("Hello, agent!")
    }
}
```
<!--- KNIT example-tracing-03.kt -->

## 錯誤處理與邊緣情況

### 無訊息處理器

如果沒有訊息處理器添加到追蹤功能中，將會記錄一則警告：

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

該功能仍將攔截事件，但它們不會被處理或輸出到任何地方。

### 資源管理

訊息處理器可能會佔用需要適當釋放的資源（例如檔案控制代碼）。使用 `use` 擴充函數以確保適當的清理：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
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
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating an agent
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val writer = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// Run the agent
agent.run(input)
// Writer will be automatically closed when the block exits
```
<!--- KNIT example-tracing-04.kt -->

### 將特定事件追蹤到檔案

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
<!--- KNIT example-tracing-05.kt -->

### 將特定事件追蹤到遠端端點

當您需要透過網路傳送事件資料時，可以使用追蹤到遠端端點。一旦啟動，追蹤到遠端端點會在指定的埠號啟動一個輕量型伺服器，並透過 Kotlin 伺服器傳送事件 (SSE) 傳送事件。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating an agent
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val connectionConfig = DefaultServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(
        connectionConfig = connectionConfig
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// Run the agent
agent.run(input)
// Writer will be automatically closed when the block exits
```
<!--- KNIT example-tracing-06.kt -->

在客戶端，您可以使用 `FeatureMessageRemoteClient` 來接收事件並將其反序列化。

<!--- INCLUDE
import ai.koog.agents.core.feature.model.events.AgentCompletedEvent
import ai.koog.agents.core.feature.model.events.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.DefaultClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.utils.io.use
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.consumeAsFlow

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
val clientConfig = DefaultClientConnectionConfig(host = host, port = port, protocol = URLProtocol.HTTP)
val agentEvents = mutableListOf<DefinedFeatureEvent>()

val clientJob = launch {
    FeatureMessageRemoteClient(connectionConfig = clientConfig, scope = this).use { client ->
        val collectEventsJob = launch {
            client.receivedMessages.consumeAsFlow().collect { event ->
                // Collect events from server
                agentEvents.add(event as DefinedFeatureEvent)

                // Stop collecting events on agent finished
                if (event is AgentCompletedEvent) {
                    cancel()
                }
            }
        }
        client.connect()
        collectEventsJob.join()
        client.healthCheck()
    }
}

listOf(clientJob).joinAll()
```
<!--- KNIT example-tracing-07.kt -->

## API 文件

追蹤功能遵循模組化架構，包含以下關鍵元件：

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-tracing/index.html)：主要功能類別，用於攔截代理程式管線中的事件。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-trace-feature-config/index.html)：用於自訂功能行為的設定類別。
3.  訊息處理器：處理並輸出追蹤事件的元件：
    *   [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-log-writer/index.html)：將追蹤事件寫入紀錄器。
    *   [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-file-writer/index.html)：將追蹤事件寫入檔案。
    *   [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-remote-writer/index.html)：將追蹤事件傳送到遠端伺服器。

## 常見問題與疑難排解

以下部分包含與追蹤功能相關的常見問題和解答。

### 如何僅追蹤代理程式執行的特定部分？

使用 `messageFilter` 屬性來篩選事件。例如，若要僅追蹤 LLM 呼叫：

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

    // 僅追蹤 LLM 呼叫
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-tracing-08.kt -->

### 我可以使用多個訊息處理器嗎？

可以，您可以添加多個訊息處理器以同時追蹤到不同的目的地：

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
        // 建立一個代理程式
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
<!--- KNIT example-tracing-09.kt -->

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
        // 建立一個代理程式
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

    // 處理器的目前開放狀態
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()

    override suspend fun processMessage(message: FeatureMessage) {
        // 自訂處理邏輯
        when (message) {
            is NodeExecutionStartingEvent -> {
                // 處理節點開始事件
            }

            is LLMCallCompletedEvent -> {
                // 處理 LLM 呼叫完成事件
            }
            // 處理其他事件類型
        }
    }

    override suspend fun close() {
        // 關閉已建立的連接
    }
}

// 使用您的自訂處理器
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-10.kt -->

有關訊息處理器可以處理的現有事件類型的更多資訊，請參閱[預定義事件類型](#predefined-event-types)。

## 預定義事件類型

Koog 提供了可用於自訂訊息處理器的預定義事件類型。預定義事件可根據其相關實體分為多個類別：

*   [代理程式事件](#agent-events)
*   [策略事件](#strategy-events)
*   [節點事件](#node-events)
*   [LLM 呼叫事件](#llm-call-events)
*   [工具呼叫事件](#tool-call-events)

### 代理程式事件

#### AgentStartingEvent

表示代理程式執行的開始。包含以下欄位：

| 名稱           | 資料類型 | 必填 | 預設值               | 說明                                       |
|----------------|-----------|----------|-----------------------|--------------------------------------------|
| `strategyName` | String    | 是      |                       | 代理程式應遵循的策略名稱。                    |
| `eventId`      | String    | 否       | `AgentStartingEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### AgentCompletedEvent

表示代理程式執行的結束。包含以下欄位：

| 名稱           | 資料類型 | 必填 | 預設值                | 說明                                       |
|----------------|-----------|----------|------------------------|--------------------------------------------|
| `strategyName` | String    | 是      |                        | 代理程式遵循的策略名稱。                    |
| `result`       | String    | 是      |                        | 代理程式執行的結果。如果沒有結果，可以為 `null`。 |
| `eventId`      | String    | 否       | `AgentCompletedEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### AgentExecutionFailedEvent

表示代理程式執行期間發生錯誤。包含以下欄位：

| 名稱           | 資料類型    | 必填 | 預設值                | 說明                                                                                                     |
|----------------|--------------|----------|------------------------|-----------------------------------------------------------------------------------------------------------------|
| `strategyName` | String       | 是      |                        | 代理程式遵循的策略名稱。                                                                                        |
| `error`        | AIAgentError | 是      |                        | 代理程式執行期間發生的特定錯誤。有關更多資訊，請參閱 [AIAgentError](#aiagenterror)。                           |
| `eventId`      | String       | 否       | `AgentExecutionFailedEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。                                                                   |

<a id="aiagenterror"></a>
`AIAgentError` 類別提供了關於代理程式執行期間發生錯誤的更多詳細訊息。包含以下欄位：

| 名稱         | 資料類型 | 必填 | 預設值 | 說明                                          |
|--------------|-----------|----------|---------|-----------------------------------------------|
| `message`    | String    | 是      |         | 提供關於特定錯誤的更多詳細訊息。                   |
| `stackTrace` | String    | 是      |         | 直到最後執行程式碼的堆疊記錄集合。                   |
| `cause`      | String    | 否       | null    | 錯誤的原因，如果可用。                           |

### 策略事件

#### StrategyStartingEvent

表示策略執行的開始。包含以下欄位：

| 名稱           | 資料類型 | 必填 | 預設值                     | 說明                                       |
|----------------|-----------|----------|-----------------------------|--------------------------------------------|
| `strategyName` | String    | 是      |                             | 策略的名稱。                               |
| `eventId`      | String    | 否       | `StrategyStartingEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### StrategyCompletedEvent

表示策略執行的結束。包含以下欄位：

| 名稱           | 資料類型 | 必填 | 預設值                        | 說明                                       |
|----------------|-----------|----------|--------------------------------|--------------------------------------------|
| `strategyName` | String    | 是      |                                | 策略的名稱。                               |
| `result`       | String    | 是      |                                | 執行的結果。                               |
| `eventId`      | String    | 否       | `StrategyCompletedEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

### 節點事件

#### NodeExecutionStartingEvent

表示節點執行的開始。包含以下欄位：

| 名稱       | 資料類型 | 必填 | 預設值                          | 說明                                       |
|------------|-----------|----------|----------------------------------|--------------------------------------------|
| `nodeName` | String    | 是      |                                  | 開始執行的節點名稱。                        |
| `input`    | String    | 是      |                                  | 節點的輸入值。                             |
| `eventId`  | String    | 否       | `NodeExecutionStartingEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### NodeExecutionCompletedEvent

表示節點執行的結束。包含以下欄位：

| 名稱       | 資料類型 | 必填 | 預設值                        | 說明                                       |
|------------|-----------|----------|--------------------------------|--------------------------------------------|
| `nodeName` | String    | 是      |                                | 結束執行的節點名稱。                        |
| `input`    | String    | 是      |                                | 節點的輸入值。                             |
| `output`   | String    | 是      |                                | 節點產生的輸出值。                         |
| `eventId`  | String    | 否       | `NodeExecutionCompletedEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

### LLM 呼叫事件

#### LLMCallStartingEvent

表示 LLM 呼叫的開始。包含以下欄位：

| 名稱      | 資料類型          | 必填 | 預設值             | 說明                                                               |
|-----------|--------------------|----------|---------------------|--------------------------------------------------------------------|
| `prompt`  | Prompt             | 是      |                     | 發送到模型的提示。有關更多資訊，請參閱 [Prompt](#prompt)。         |
| `tools`   | List&lt;String&gt; | 是      |                     | 模型可以呼叫的工具列表。                                           |
| `eventId` | String             | 否       | `LLMCallStartingEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。                      |

<a id="prompt"></a>
`Prompt` 類別表示提示的資料結構，由訊息列表、唯一識別碼以及用於 LLM 設定的可選參數組成。包含以下欄位：

| 名稱       | 資料類型           | 必填 | 預設值     | 說明                                   |
|------------|---------------------|----------|-------------|----------------------------------------|
| `messages` | List&lt;Message&gt; | 是      |             | 提示包含的訊息列表。                     |
| `id`       | String              | 是      |             | 提示的唯一識別碼。                       |
| `params`   | LLMParams           | 否       | LLMParams() | 控制 LLM 生成內容方式的設定。            |

#### LLMCallCompletedEvent

表示 LLM 呼叫的結束。包含以下欄位：

| 名稱        | 資料類型                    | 必填 | 預設值           | 說明                                       |
|-------------|------------------------------|----------|-------------------|--------------------------------------------|
| `responses` | List&lt;Message.Response&gt; | 是      |                   | 模型返回的一或多個回應。                   |
| `eventId`   | String                       | 否       | `LLMCallCompletedEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

### 工具呼叫事件

#### ToolCallEvent

表示模型呼叫工具的事件。包含以下欄位：

| 名稱       | 資料類型 | 必填 | 預設值         | 說明                                       |
|------------|-----------|----------|-----------------|--------------------------------------------|
| `toolName` | String    | 是      |                 | 工具的名稱。                               |
| `toolArgs` | Tool.Args | 是      |                 | 提供給工具的參數。                         |
| `eventId`  | String    | 否       | `ToolCallEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### ToolValidationErrorEvent

表示工具呼叫期間發生驗證錯誤。包含以下欄位：

| 名稱           | 資料類型 | 必填 | 預設值                    | 說明                                       |
|----------------|-----------|----------|----------------------------|--------------------------------------------|
| `toolName`     | String    | 是      |                            | 驗證失敗的工具名稱。                        |
| `toolArgs`     | Tool.Args | 是      |                            | 提供給工具的參數。                         |
| `errorMessage` | String    | 是      |                            | 驗證錯誤訊息。                             |
| `eventId`      | String    | 否       | `ToolValidationErrorEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |

#### ToolCallFailureEvent

表示呼叫工具失敗。包含以下欄位：

| 名稱       | 資料類型    | 必填 | 預設值                | 說明                                                                                                           |
|------------|--------------|----------|------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `toolName` | String       | 是      |                        | 工具的名稱。                                                                                                       |
| `toolArgs` | Tool.Args    | 是      |                        | 提供給工具的參數。                                                                                                 |
| `error`    | AIAgentError | 是      |                        | 嘗試呼叫工具時發生的特定錯誤。有關更多資訊，請參閱 [AIAgentError](#aiagenterror)。                                   |
| `eventId`  | String       | 否       | `ToolCallFailureEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。                                                                         |

#### ToolCallResultEvent

表示成功的工具呼叫並返回結果。包含以下欄位：

| 名稱       | 資料類型  | 必填 | 預設值               | 說明                                       |
|------------|-----------|----------|-----------------------|--------------------------------------------|
| `toolName` | String    | 是      |                       | 工具的名稱。                               |
| `toolArgs` | Tool.Args | 是      |                       | 提供給工具的參數。                         |
| `result`   | ToolResult | 是      |                       | 工具呼叫的結果。                           |
| `eventId`  | String    | 否       | `ToolCallResultEvent` | 事件的識別碼。通常是事件類別的 `simpleName`。 |