# 追蹤

此頁面包含有關追蹤 (Tracing) 功能的詳細資訊，該功能為 AI 代理程式提供了全面的追蹤能力。

## 功能概述

追蹤功能是一個強大的監控與偵錯工具，它能擷取關於代理程式執行的詳細資訊，包括：

*   代理程式的建立與初始化
*   策略執行
*   LLM 呼叫
*   工具調用
*   代理程式圖中的節點執行

此功能透過攔截代理程式管線中的關鍵事件，並將其轉發給可設定的訊息處理器來運作。這些處理器可以將追蹤資訊輸出到各種目的地，例如紀錄檔或檔案系統，使開發者能夠深入瞭解代理程式的行為並有效地排解問題。

### 事件流程

1.  追蹤功能攔截代理程式管線中的事件。
2.  事件會根據設定的訊息篩選器進行篩選。
3.  篩選後的事件會傳遞給已註冊的訊息處理器。
4.  訊息處理器會格式化事件並將其輸出到各自的目的地。

## 設定與初始化

### 基本設定

若要使用追蹤功能，您需要：

1.  擁有一或多個訊息處理器（您可以使用現有的或建立自己的）。
2.  在您的代理程式中安裝 `Tracing`。
3.  設定訊息篩選器（可選）。
4.  將訊息處理器添加到該功能中。

```kotlin
// Defining a logger/file that will be used as a destination of trace messages 
val logger = LoggerFactory.create("my.trace.logger")
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/trace.log")

// Creating an agent
val agent = AIAgent(...) {
    install(Tracing) {
        // Configure message processors to handle trace events
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, fileSystem::sink))

        // Optionally filter messages
        messageFilter = { message -> 
            // Only trace LLM calls and tool calls
            message is LLMCallStartEvent || message is ToolCallEvent 
        }
    }
}
```

### 訊息篩選

您可以處理所有現有事件，或根據特定準則選擇其中一些。訊息篩選器可讓您控制哪些事件被處理。這對於專注於代理程式執行過程的特定方面非常有用：

```kotlin
// Filter for LLM-related events only
messageFilter = { message ->
    message is LLMCallStartEvent ||
            message is LLMCallEndEvent ||
            message is LLMCallWithToolsStartEvent ||
            message is LLMCallWithToolsEndEvent
}

// Filter for tool-related events only
messageFilter = { message ->
    message is ToolCallsEvent ||
            message is ToolCallResultEvent ||
            message is ToolValidationErrorEvent ||
            message is ToolCallFailureEvent
}

// Filter for node execution events only
messageFilter = { message ->
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```

### 大量追蹤資料

對於具有複雜策略或長時間執行的代理程式，追蹤事件的數量可能會非常龐大。考慮使用以下方法來管理事件量：

*   使用特定的訊息篩選器來減少事件數量。
*   實作自訂訊息處理器，並帶有緩衝或取樣功能。
*   使用紀錄檔輪替來防止紀錄檔過大。

### 依賴關係圖

追蹤功能具有以下依賴項：

```
Tracing
├── AIAgentPipeline (for intercepting events)
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
    ├── AIAgentStartedEvent
    ├── AIAgentFinishedEvent
    ├── AIAgentRunErrorEvent
    ├── AIAgentStrategyStartEvent
    ├── AIAgentStrategyFinishedEvent
    ├── AIAgentNodeExecutionStartEvent
    ├── AIAgentNodeExecutionEndEvent
    ├── LLMCallStartEvent
    ├── LLMCallWithToolsStartEvent
    ├── LLMCallEndEvent
    ├── LLMCallWithToolsEndEvent
    ├── ToolCallEvent
    ├── ToolValidationErrorEvent
    ├── ToolCallFailureEvent
    └── ToolCallResultEvent
```

## 範例與快速入門

### 基本追蹤到紀錄器

```kotlin
// Create a logger
val logger = LoggerFactory.create("my.agent.trace")

// Create an agent with tracing
val agent = AIAgent(...) {
    install(Tracing) {
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    }
}

// Run the agent
agent.run("Hello, agent!")
```

## 錯誤處理與邊緣情況

### 無訊息處理器

如果沒有訊息處理器添加到追蹤功能中，將會紀錄一則警告：

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

該功能仍將攔截事件，但它們不會被處理或輸出到任何地方。

### 資源管理

訊息處理器可能會佔用需要適當釋放的資源（例如檔案控制代碼）。使用 `use` 擴充函數以確保適當的清理：

```kotlin
TraceFeatureMessageFileWriter(fs, path).use { writer ->
    // Use the writer
    install(Tracing) {
        addMessageProcessor(writer)
    }

    // Run the agent
    agent.run(input)

    // Writer will be automatically closed when the block exits
}
```

### 將特定事件追蹤到檔案

```kotlin
// Create a file writer
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/llm-calls.log")
val writer = TraceFeatureMessageFileWriter(fs, path)

// Create an agent with filtered tracing
val agent = AIAgent(...) {
    install(Tracing) {
        // Only trace LLM calls
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// Run the agent
agent.run("Generate a story about a robot.")
```

### 將特定事件追蹤到遠端端點

```kotlin
// Create a file writer
val port = 8080
val serverConfig = ServerConnectionConfig(port = port)
val writer = TraceFeatureMessageRemoteWriter(connectionConfig = serverConfig)

// Create an agent with filtered tracing
val agent = AIAgent(...) {
    install(Tracing) {
        // Only trace LLM calls
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// Run the agent
agent.run("Generate a story about a robot.")
```

## API 文件

追蹤功能遵循模組化架構，包含以下關鍵元件：

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-tracing/index.html)：主要功能類別，用於攔截代理程式管線中的事件。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-trace-feature-config/index.html)：用於自訂功能行為的設定類別。
3.  訊息處理器：處理並輸出追蹤事件的元件：
    *   [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-log-writer/index.html)：將追蹤事件寫入紀錄器。
    *   [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-file-writer/index.html)：將追蹤事件寫入檔案。
    *   [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-remote-writer/index.html)：將追蹤事件傳送到遠端伺服器。

## 常見問題與疑難排解

以下部分包含與追蹤功能相關的常見問題和解答。

### 如何僅追蹤代理程式執行的特定部分？

使用 `messageFilter` 屬性來篩選事件。例如，若要僅追蹤節點執行：

```kotlin
install(Tracing) {
    messageFilter = { message ->
        message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
    }
    addMessageProcessor(writer)
}
```

### 我可以使用多個訊息處理器嗎？

可以，您可以添加多個訊息處理器以同時追蹤到不同的目的地：

```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(fs, path))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```

### 如何建立自訂訊息處理器？

實作 `FeatureMessageProcessor` 介面：

```kotlin
class CustomTraceProcessor : FeatureMessageProcessor {
    override suspend fun onMessage(message: FeatureMessage) {
        // Custom processing logic
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // Process node start event
            }
            is LLMCallWithToolsEndEvent -> {
                // Process LLM call end event
            }
            // Handle other event types
        }
    }
}

// Use your custom processor
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}