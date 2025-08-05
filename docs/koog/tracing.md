# 追踪

本页面包含有关 Tracing 特性的详细信息，该特性为 AI 代理提供了全面的追踪能力。

## 特性概览

Tracing 特性是一个强大的监控和调试工具，它捕获有关代理运行的详细信息，包括：

*   代理创建与初始化
*   策略执行
*   LLM 调用
*   工具调用
*   代理图中的节点执行

此特性通过拦截代理流水线中的关键事件并将其转发给可配置的消息处理器来运行。这些处理器可以将追踪信息输出到各种目标，例如日志文件或文件系统，使开发者能够深入了解代理行为并有效排查问题。

### 事件流

1.  Tracing 特性拦截代理流水线中的事件。
2.  事件根据配置的消息过滤器进行过滤。
3.  过滤后的事件传递给已注册的消息处理器。
4.  消息处理器格式化事件并将其输出到各自的目标。

## 配置与初始化

### 基本设置

要使用 Tracing 特性，你需要：

1.  拥有一个或多个消息处理器（你可以使用现有处理器或创建自己的处理器）。
2.  在你的代理中安装 `Tracing`。
3.  配置消息过滤器（可选）。
4.  将消息处理器添加到该特性中。

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

### 消息过滤

你可以处理所有现有事件，或根据特定条件选择其中一些。消息过滤器允许你控制哪些事件被处理。这对于关注代理运行的特定方面很有用：

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

### 大量追踪数据

对于具有复杂策略或长时间运行的代理，追踪事件量可能非常大。考虑使用以下方法管理事件量：

*   使用特定的消息过滤器来减少事件数量。
*   实现带有缓冲或采样的自定义消息处理器。
*   对日志文件使用文件轮转，以防止它们变得过大。

### 依赖图

Tracing 特性具有以下依赖项：

```
Tracing
├── AIAgentPipeline (用于拦截事件)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors (消息处理器)
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (事件类型) (from ai.koog.agents.core.feature.model)
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

## 示例与快速入门

### 基本日志追踪

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

## 错误处理与边缘情况

### 没有消息处理器

如果 Tracing 特性没有添加任何消息处理器，将记录一条警告：

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

该特性仍将拦截事件，但它们不会被处理或输出到任何地方。

### 资源管理

消息处理器可能会持有需要正确释放的资源（如文件句柄）。使用 `use` 扩展函数以确保正确清理：

```kotlin
TraceFeatureMessageFileWriter(fs, path).use { writer ->
    // Use the writer
    install(Tracing) {
        addMessageProcessor(writer)
    }

    // Run the agent
    agent.run(input)

    // Writer will be automatically closed when the block exits (当代码块退出时，writer 将自动关闭)
}
```

### 追踪特定事件到文件

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

### 追踪特定事件到远程端点

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

## API 文档

Tracing 特性遵循模块化架构，包含以下关键组件：

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-tracing/index.html)：拦截代理流水线中事件的主要特性类。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-trace-feature-config/index.html)：用于自定义特性行为的配置类。
3.  消息处理器：处理并输出追踪事件的组件：
    *   [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-log-writer/index.html)：将追踪事件写入日志器。
    *   [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-file-writer/index.html)：将追踪事件写入文件。
    *   [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-remote-writer/index.html)：将追踪事件发送到远程服务器。

## 常见问题与故障排除

以下部分包含与 Tracing 特性相关的常见问题与解答。

### 如何仅追踪代理执行的特定部分？

使用 `messageFilter` 属性来过滤事件。例如，要仅追踪节点执行：

```kotlin
install(Tracing) {
    messageFilter = { message ->
        message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
    }
    addMessageProcessor(writer)
}
```

### 我可以使用多个消息处理器吗？

是的，你可以添加多个消息处理器，以同时追踪到不同的目标：

```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(fs, path))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```

### 如何创建自定义消息处理器？

实现 `FeatureMessageProcessor` 接口：

```kotlin
class CustomTraceProcessor : FeatureMessageProcessor {
    override suspend fun onMessage(message: FeatureMessage) {
        // Custom processing logic (自定义处理逻辑)
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // Process node start event (处理节点启动事件)
            }
            is LLMCallWithToolsEndEvent -> {
                // Process LLM call end event (处理 LLM 调用结束事件)
            }
            // Handle other event types (处理其他事件类型)
        }
    }
}

// Use your custom processor (使用自定义处理器)
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}