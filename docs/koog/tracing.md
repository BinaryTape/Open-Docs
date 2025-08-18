# 追踪

本页面包含有关 Tracing 特性的详细信息，该特性为 AI 代理提供了全面的追踪能力。

## 特性概览

Tracing 特性是一个强大的监控和调试工具，它捕获有关代理运行的详细信息，包括：

-   策略执行
-   LLM 调用
-   工具调用
-   代理图中的节点执行

此特性通过拦截代理流水线中的关键事件并将其转发给可配置的消息处理器来运行。这些处理器可以将追踪信息输出到各种目标，例如日志文件或文件系统中的其他类型文件，使开发者能够深入了解代理行为并有效排查问题。

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

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.ToolCallEvent
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
// 定义将用作追踪消息目标的日志器/文件
val logger = KotlinLogging.logger { }
val outputPath = Path("/path/to/trace.log")

// 创建代理
val agent = AIAgent(
   executor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
      // 配置消息处理器以处理追踪事件
      addMessageProcessor(TraceFeatureMessageLogWriter(logger))
      addMessageProcessor(
         TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
         )
      )

      // 可选地过滤消息
      messageFilter = { message ->
         // 仅追踪 LLM 调用和工具调用
         message is AfterLLMCallEvent || message is ToolCallEvent
      }
   }
}
```
<!--- KNIT example-tracing-01.kt -->

### 消息过滤

你可以处理所有现有事件，或根据特定条件选择其中一些。消息过滤器允许你控制哪些事件被处理。这对于关注代理运行的特定方面很有用：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.*
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
   executor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// 仅过滤与 LLM 相关的事件
messageFilter = { message -> 
    message is BeforeLLMCallEvent || message is AfterLLMCallEvent
}

// 仅过滤与工具相关的事件
messageFilter = { message -> 
    message is ToolCallEvent ||
           message is ToolCallResultEvent ||
           message is ToolValidationErrorEvent ||
           message is ToolCallFailureEvent
}

// 仅过滤节点执行事件
messageFilter = { message -> 
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```
<!--- KNIT example-tracing-02.kt -->

### 大量追踪数据

对于具有复杂策略或长时间运行的代理，追踪事件量可能非常大。考虑使用以下方法管理事件量：

-   使用特定的消息过滤器来减少事件数量。
-   实现带有缓冲或采样的自定义消息处理器。
-   对日志文件使用文件轮转，以防止它们变得过大。

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
// 创建一个日志器
val logger = KotlinLogging.logger { }

fun main() {
    runBlocking {
       // 创建一个带追踪功能的代理
       val agent = AIAgent(
          executor = simpleOllamaAIExecutor(),
          llmModel = OllamaModels.Meta.LLAMA_3_2,
       ) {
          install(Tracing) {
             addMessageProcessor(TraceFeatureMessageLogWriter(logger))
          }
       }

       // 运行代理
       agent.run("Hello, agent!")
    }
}
```
<!--- KNIT example-tracing-03.kt -->

## 错误处理与边缘情况

### 没有消息处理器

如果 Tracing 特性没有添加任何消息处理器，将记录一条警告：

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

该特性仍将拦截事件，但它们不会被处理或输出到任何地方。

### 资源管理

消息处理器可能会持有需要正确释放的资源（如文件句柄）。使用 `use` 扩展函数以确保正确清理：

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
// 创建代理
val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
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
// 运行代理
agent.run(input)
// Writer will be automatically closed when the block exits
```
<!--- KNIT example-tracing-04.kt -->

### 追踪特定事件到文件

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.BeforeLLMCallEvent
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
        // 创建代理
        val agent = AIAgent(
            executor = simpleOllamaAIExecutor(),
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
    // 仅追踪 LLM 调用
    messageFilter = { message ->
        message is BeforeLLMCallEvent || message is AfterLLMCallEvent
    }
    addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-05.kt -->

### 追踪特定事件到远程端点

当你需要通过网络发送事件数据时，可以使用追踪到远程端点。一旦启动，追踪到远程端点会在指定的端口号启动一个轻量级服务器，并通过 Kotlin Server-Sent Events (SSE) 发送事件。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.AIAgentFeatureServerConnectionConfig
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
// 创建代理
val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val connectionConfig = AIAgentFeatureServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(
        connectionConfig = connectionConfig
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// 运行代理
agent.run(input)
// Writer will be automatically closed when the block exits
```
<!--- KNIT example-tracing-06.kt -->

在客户端，你可以使用 `FeatureMessageRemoteClient` 来接收事件并将其反序列化。

<!--- INCLUDE
import ai.koog.agents.core.feature.model.AIAgentFinishedEvent
import ai.koog.agents.core.feature.model.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.AIAgentFeatureClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.agents.utils.use
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
val clientConfig = AIAgentFeatureClientConnectionConfig(host = host, port = port, protocol = URLProtocol.HTTP)
val agentEvents = mutableListOf<DefinedFeatureEvent>()

val clientJob = launch {
    FeatureMessageRemoteClient(connectionConfig = clientConfig, scope = this).use { client ->
        val collectEventsJob = launch {
            client.receivedMessages.consumeAsFlow().collect { event ->
                // 从服务器收集事件
                agentEvents.add(event as DefinedFeatureEvent)

                // 在代理结束时停止收集事件
                if (event is AIAgentFinishedEvent) {
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

## API 文档

Tracing 特性遵循模块化架构，包含以下关键组件：

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-tracing/index.html)：拦截代理流水线中事件的主要特性类。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-trace-feature-config/index.html)：用于自定义特性行为的配置类。
3.  消息处理器：处理并输出追踪事件的组件：
    *   [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-log-writer/index.html)：将追踪事件写入日志器。
    *   [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-file-writer/index.html)：将追踪事件写入文件。
    *   [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-remote-writer/index.html)：将追踪事件发送到远程服务器。

## 常见问题与故障排除

以下部分包含与 Tracing 特性相关的常见问题与解答。

### 如何仅追踪代理执行的特定部分？

使用 `messageFilter` 属性来过滤事件。例如，要仅追踪节点执行：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.BeforeLLMCallEvent
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
        // 创建代理
        val agent = AIAgent(
            executor = simpleOllamaAIExecutor(),
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
   // 仅追踪 LLM 调用
   messageFilter = { message ->
      message is BeforeLLMCallEvent || message is AfterLLMCallEvent
   }
   addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-08.kt -->

### 我可以使用多个消息处理器吗？

是的，你可以添加多个消息处理器，以同时追踪到不同的目标：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.AIAgentFeatureServerConnectionConfig
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
val connectionConfig = AIAgentFeatureServerConnectionConfig(host = ai.koog.agents.example.exampleTracing06.host, port = ai.koog.agents.example.exampleTracing06.port)

fun main() {
   runBlocking {
      // 创建代理
      val agent = AIAgent(
         executor = simpleOllamaAIExecutor(),
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

### 如何创建自定义消息处理器？

实现 `FeatureMessageProcessor` 接口：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.AIAgentNodeExecutionStartEvent
import ai.koog.agents.core.feature.model.AfterLLMCallEvent
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
      // 创建代理
      val agent = AIAgent(
         executor = simpleOllamaAIExecutor(),
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

    // 处理器的当前打开状态
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // 自定义处理逻辑
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // 处理节点启动事件
            }

            is AfterLLMCallEvent -> {
                // 处理 LLM 调用结束事件
           }
            // 处理其他事件类型
        }
    }

    override suspend fun close() {
        // 关闭已建立的连接
    }
}

// 使用自定义处理器
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-10.kt -->

有关消息处理器可处理的现有事件类型的更多信息，请参见 [预定义事件类型](#predefined-event-types)。

## 预定义事件类型

Koog 提供了可在自定义消息处理器中使用的预定义事件类型。预定义事件可根据其关联的实体分为以下几类：

-   [代理事件](#agent-events)
-   [策略事件](#strategy-events)
-   [节点事件](#node-events)
-   [LLM 调用事件](#llm-call-events)
-   [工具调用事件](#tool-call-events)

### 代理事件

#### AIAgentStartedEvent

表示代理运行的开始。包含以下字段：

| 名称           | 数据类型 | 必需 | 默认                  | 描述                                                              |
|--------------|----------|----|---------------------|-----------------------------------------------------------------|
| `strategyName` | String   | 是  |                     | 代理应遵循的策略名称。                                               |
| `eventId`      | String   | 否  | `AIAgentStartedEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### AIAgentFinishedEvent

表示代理运行的结束。包含以下字段：

| 名称           | 数据类型 | 必需 | 默认                   | 描述                                                              |
|--------------|----------|----|----------------------|-----------------------------------------------------------------|
| `strategyName` | String   | 是  |                      | 代理所遵循的策略名称。                                               |
| `result`       | String   | 是  |                      | 代理运行的结果。如果没有结果，可以为 `null`。                         |
| `eventId`      | String   | 否  | `AIAgentFinishedEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### AIAgentRunErrorEvent

表示代理运行期间发生错误。包含以下字段：

| 名称           | 数据类型     | 必需 | 默认                   | 描述                                                                                            |
|--------------|------------|----|----------------------|-----------------------------------------------------------------------------------------------|
| `strategyName` | String     | 是  |                      | 代理所遵循的策略名称。                                                                           |
| `error`        | AIAgentError | 是  |                      | 代理运行期间发生的具体错误。有关更多信息，请参见 [AIAgentError](#aiagenterror)。                  |
| `eventId`      | String     | 否  | `AIAgentRunErrorEvent` | 事件的标识符。通常是事件类的 `simpleName`。                                                      |

<a id="aiagenterror"></a>
`AIAgentError` 类提供了关于代理运行期间所发生错误的更多详细信息。包含以下字段：

| 名称         | 数据类型 | 必需 | 默认 | 描述                                                      |
|----------|----------|----|----|---------------------------------------------------------|
| `message`    | String   | 是  |    | 提供有关具体错误更多详细信息的消息。                                   |
| `stackTrace` | String   | 是  |    | 直到最后执行代码的堆栈记录集合。                                       |
| `cause`      | String   | 否  | null | 错误的起因，如果可用。                                               |

### 策略事件

#### AIAgentStrategyStartEvent

表示策略运行的开始。包含以下字段：

| 名称           | 数据类型 | 必需 | 默认                      | 描述                                                              |
|--------------|----------|----|-------------------------|-----------------------------------------------------------------|
| `strategyName` | String   | 是  |                         | 策略名称。                                                         |
| `eventId`      | String   | 否  | `AIAgentStrategyStartEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### AIAgentStrategyFinishedEvent

表示策略运行的结束。包含以下字段：

| 名称           | 数据类型 | 必需 | 默认                       | 描述                                                              |
|--------------|----------|----|--------------------------|-----------------------------------------------------------------|
| `strategyName` | String   | 是  |                          | 策略名称。                                                         |
| `result`       | String   | 是  |                          | 运行结果。                                                         |
| `eventId`      | String   | 否  | `AIAgentStrategyFinishedEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

### 节点事件

#### AIAgentNodeExecutionStartEvent

表示节点运行的开始。包含以下字段：

| 名称       | 数据类型 | 必需 | 默认                             | 描述                                                              |
|----------|----------|----|--------------------------------|-----------------------------------------------------------------|
| `nodeName` | String   | 是  |                                | 已开始运行的节点名称。                                                 |
| `input`    | String   | 是  |                                | 节点的输入值。                                                     |
| `eventId`  | String   | 否  | `AIAgentNodeExecutionStartEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### AIAgentNodeExecutionEndEvent

表示节点运行的结束。包含以下字段：

| 名称       | 数据类型 | 必需 | 默认                           | 描述                                                              |
|----------|----------|----|------------------------------|-----------------------------------------------------------------|
| `nodeName` | String   | 是  |                                | 已结束运行的节点名称。                                                 |
| `input`    | String   | 是  |                                | 节点的输入值。                                                     |
| `output`   | String   | 是  |                                | 节点产生的输出值。                                                   |
| `eventId`  | String   | 否  | `AIAgentNodeExecutionEndEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

### LLM 调用事件

#### LLMCallStartEvent

表示 LLM 调用的开始。包含以下字段：

| 名称      | 数据类型           | 必需 | 默认                | 描述                                                                        |
|---------|------------------|----|-------------------|---------------------------------------------------------------------------|
| `prompt`  | Prompt           | 是  |                   | 发送到模型的提示。有关更多信息，请参见 [Prompt](#prompt)。                    |
| `tools`   | List&lt;String&gt; | 是  |                   | 模型可以调用的工具列表。                                                     |
| `eventId` | String           | 否  | `LLMCallStartEvent` | 事件的标识符。通常是事件类的 `simpleName`。                                   |

<a id="prompt"></a>
`Prompt` 类表示提示的数据结构，包含消息列表、唯一标识符以及语言模型设置的可选参数。包含以下字段：

| 名称       | 数据类型           | 必需 | 默认        | 描述                                                  |
|----------|------------------|----|-----------|-----------------------------------------------------|
| `messages` | List&lt;Message&gt; | 是  |           | 提示包含的消息列表。                                   |
| `id`       | String           | 是  |           | 提示的唯一标识符。                                     |
| `params`   | LLMParams        | 否  | LLMParams() | 控制 LLM 生成内容方式的设置。                          |

#### LLMCallEndEvent

表示 LLM 调用的结束。包含以下字段：

| 名称        | 数据类型                      | 必需 | 默认              | 描述                                                              |
|-----------|-----------------------------|----|-----------------|-----------------------------------------------------------------|
| `responses` | List&lt;Message.Response&gt; | 是  |                 | 模型返回的一个或多个响应。                                             |
| `eventId`   | String                      | 否  | `LLMCallEndEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

### 工具调用事件

#### ToolCallEvent

表示模型调用工具的事件。包含以下字段：

| 名称       | 数据类型 | 必需 | 默认            | 描述                                                              |
|----------|----------|----|---------------|-----------------------------------------------------------------|
| `toolName` | String   | 是  |               | 工具名称。                                                         |
| `toolArgs` | Tool.Args | 是  |               | 提供给工具的实参。                                                   |
| `eventId`  | String   | 否  | `ToolCallEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### ToolValidationErrorEvent

表示工具调用期间发生验证错误。包含以下字段：

| 名称           | 数据类型 | 必需 | 默认                       | 描述                                                              |
|--------------|----------|----|--------------------------|-----------------------------------------------------------------|
| `toolName`     | String   | 是  |                          | 验证失败的工具名称。                                                 |
| `toolArgs`     | Tool.Args | 是  |                          | 提供给工具的实参。                                                   |
| `errorMessage` | String   | 是  |                          | 验证错误消息。                                                     |
| `eventId`      | String   | 否  | `ToolValidationErrorEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |

#### ToolCallFailureEvent

表示调用工具失败。包含以下字段：

| 名称       | 数据类型     | 必需 | 默认                   | 描述                                                                                                        |
|----------|------------|----|----------------------|-----------------------------------------------------------------------------------------------------------|
| `toolName` | String     | 是  |                      | 工具名称。                                                                                                 |
| `toolArgs` | Tool.Args | 是  |                      | 提供给工具的实参。                                                                                         |
| `error`    | AIAgentError | 是  |                      | 尝试调用工具时发生的具体错误。有关更多信息，请参见 [AIAgentError](#aiagenterror)。                          |
| `eventId`  | String     | 否  | `ToolCallFailureEvent` | 事件的标识符。通常是事件类的 `simpleName`。                                                               |

#### ToolCallResultEvent

表示工具调用成功并返回结果。包含以下字段：

| 名称       | 数据类型   | 必需 | 默认                 | 描述                                                              |
|----------|----------|----|--------------------|-----------------------------------------------------------------|
| `toolName` | String   | 是  |                    | 工具名称。                                                         |
| `toolArgs` | Tool.Args | 是  |                    | 提供给工具的实参。                                                   |
| `result`   | ToolResult | 是  |                    | 工具调用的结果。                                                     |
| `eventId`  | String   | 否  | `ToolCallResultEvent` | 事件的标识符。通常是事件类的 `simpleName`。                           |