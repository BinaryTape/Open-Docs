# Agent 事件

Agent 事件是作为 Agent 工作流一部分发生的操作或交互。它们包括：

- Agent 生命周期事件
- 策略事件
- 节点执行事件
- LLM 调用事件
- LLM 流式事件
- 工具执行事件

注意：特性事件定义在 `agents-core` 模块中，位于 `ai.koog.agents.core.feature.model.events` 包下。`agents-features-trace`、`agents-features-debugger` 和 `agents-features-event-handler` 等特性会消费这些事件，以处理和转发在 Agent 执行期间创建的消息。

## 预定义事件类型

Koog 提供了可用于自定义消息处理器的预定义事件类型。这些预定义事件可以根据它们相关的实体分为几个类别：

- [Agent 事件](#agent-events)
- [策略事件](#strategy-events)
- [节点事件](#node-events)
- [LLM 调用事件](#llm-call-events)
- [LLM 流式事件](#llm-streaming-events)
- [工具执行事件](#tool-execution-events)

### Agent 事件

#### AgentStartingEvent

表示 Agent 运行的开始。包括以下字段：

| 名称       | 数据类型 | 必需 | 默认 | 描述                                     |
|------------|-----------|----------|---------|------------------------------------------|
| `agentId`  | String    | Yes      |         | AI Agent 的唯一标识符。                  |
| `runId`    | String    | Yes      |         | AI Agent 运行的唯一标识符。              |

#### AgentCompletedEvent

表示 Agent 运行的结束。包括以下字段：

| 名称       | 数据类型 | 必需 | 默认 | 描述                                                         |
|------------|-----------|----------|---------|--------------------------------------------------------------|
| `agentId`  | String    | Yes      |         | AI Agent 的唯一标识符。                                      |
| `runId`    | String    | Yes      |         | AI Agent 运行的唯一标识符。                                  |
| `result`   | String    | Yes      |         | Agent 运行的结果。如果没有结果，可以为 `null`。              |

#### AgentExecutionFailedEvent

表示在 Agent 运行期间发生错误。包括以下字段：

| 名称      | 数据类型     | 必需 | 默认 | 描述                                                                                                     |
|-----------|---------------|----------|---------|-----------------------------------------------------------------------------------------------------------------|
| `agentId` | String        | Yes      |         | AI Agent 的唯一标识符。                                                                          |
| `runId`   | String        | Yes      |         | AI Agent 运行的唯一标识符。                                                                      |
| `error`   | AIAgentError  | Yes      |         | 在 Agent 运行期间发生的特定错误。关于详情，请参见 [AIAgentError](#aiagenterror)。                  |

#### AgentClosingEvent

表示 Agent 的关闭或终止。包括以下字段：

| 名称      | 数据类型 | 必需 | 默认 | 描述                                     |
|-----------|-----------|----------|---------|------------------------------------------|
| `agentId` | String    | Yes      |         | AI Agent 的唯一标识符。                  |

<a id="aiagenterror"></a>
`AIAgentError` 类提供了关于在 Agent 运行期间发生错误的更多详情。包括以下字段：

| 名称         | 数据类型 | 必需 | 默认 | 描述                                                      |
|--------------|-----------|----------|---------|-----------------------------------------------------------|
| `message`    | String    | Yes      |         | 提供了关于特定错误的更多详情的消息。                      |
| `stackTrace` | String    | Yes      |         | 直到最后执行代码的堆栈记录集合。                          |
| `cause`      | String    | No       | null    | 如果可用，表示错误的起因。                                |

### 策略事件

#### GraphStrategyStartingEvent

表示基于图的策略运行的开始。包括以下字段：

| 名称            | 数据类型              | 必需 | 默认 | 描述                                     |
|-----------------|------------------------|----------|---------|------------------------------------------|
| `runId`         | String                 | Yes      |         | 策略运行的唯一标识符。                   |
| `strategyName`  | String                 | Yes      |         | 策略的名称。                             |
| `graph`         | StrategyEventGraph     | Yes      |         | 表示策略工作流的图结构。                 |

#### FunctionalStrategyStartingEvent

表示函数式策略运行的开始。包括以下字段：

| 名称            | 数据类型 | 必需 | 默认 | 描述                                     |
|-----------------|-----------|----------|---------|------------------------------------------|
| `runId`         | String    | Yes      |         | 策略运行的唯一标识符。                   |
| `strategyName`  | String    | Yes      |         | 策略的名称。                             |

#### StrategyCompletedEvent

表示策略运行的结束。包括以下字段：

| 名称           | 数据类型 | 必需 | 默认 | 描述                                                         |
|----------------|-----------|----------|---------|--------------------------------------------------------------|
| `runId`        | String    | Yes      |         | 策略运行的唯一标识符。                                       |
| `strategyName` | String    | Yes      |         | 策略的名称。                                                 |
| `result`       | String    | Yes      |         | 运行的结果。如果没有结果，可以为 `null`。                    |

### 节点事件

#### NodeExecutionStartingEvent

表示节点运行的开始。包括以下字段：

| 名称       | 数据类型 | 必需 | 默认 | 描述                                     |
|------------|-----------|----------|---------|------------------------------------------|
| `runId`    | String    | Yes      |         | 策略运行的唯一标识符。                   |
| `nodeName` | String    | Yes      |         | 运行开始的节点的名称。                   |
| `input`    | String    | Yes      |         | 节点的输入值。                           |

#### NodeExecutionCompletedEvent

表示节点运行的结束。包括以下字段：

| 名称       | 数据类型 | 必需 | 默认 | 描述                                     |
|------------|-----------|----------|---------|------------------------------------------|
| `runId`    | String    | Yes      |         | 策略运行的唯一标识符。                   |
| `nodeName` | String    | Yes      |         | 运行结束的节点的名称。                   |
| `input`    | String    | Yes      |         | 节点的输入值。                           |
| `output`   | String    | Yes      |         | 节点产生的输出值。                       |

#### NodeExecutionFailedEvent

表示在节点运行期间发生的错误。包括以下字段：

| 名称       | 数据类型    | 必需 | 默认 | 描述                                                                                                     |
|------------|-------------|----------|---------|-----------------------------------------------------------------------------------------------------------------|
| `runId`    | String      | Yes      |         | 策略运行的唯一标识符。                                                                          |
| `nodeName` | String      | Yes      |         | 发生错误的节点的名称。                                                                          |
| `error`    | AIAgentError | Yes      |         | 在节点运行期间发生的特定错误。关于详情，请参见 [AIAgentError](#aiagenterror)。                  |

### LLM 调用事件

#### LLMCallStartingEvent

表示 LLM 调用的开始。包括以下字段：

| 名称     | 数据类型          | 必需 | 默认 | 描述                                                                        |
|----------|--------------------|----------|---------|-----------------------------------------------------------------------------|
| `runId`  | String             | Yes      |         | LLM 运行的唯一标识符。                                                      |
| `prompt` | Prompt             | Yes      |         | 发送给模型的 Prompt。关于详情，请参见 [Prompt](#prompt)。                     |
| `model`  | String             | Yes      |         | 模型标识符，格式为 `llm_provider:model_id`。                                |
| `tools`  | List<String>       | Yes      |         | 模型可以调用的工具 list。                                                   |

<a id="prompt"></a>
`Prompt` 类表示一个 Prompt 的数据结构，由消息 list、唯一标识符和用于语言模型设置的可选参数组成。包括以下字段：

| 名称       | 数据类型           | 必需 | 默认     | 描述                                                       |
|------------|--------------------|----------|-------------|------------------------------------------------------------|
| `messages` | List<Message>       | Yes      |             | 构成 Prompt 的消息 list。                                  |
| `id`       | String              | Yes      |             | Prompt 的唯一标识符。                                      |
| `params`   | LLMParams           | No       | LLMParams() | 控制 LLM 生成内容方式的设置。                            |

#### LLMCallCompletedEvent

表示 LLM 调用的结束。包括以下字段：

| 名称                 | 数据类型                      | 必需 | 默认 | 描述                                                       |
|----------------------|--------------------------------|----------|---------|------------------------------------------------------------|
| `runId`              | String                         | Yes      |         | LLM 运行的唯一标识符。                                       |
| `prompt`             | Prompt                         | Yes      |         | 调用中使用的 Prompt。                                        |
| `model`              | String                         | Yes      |         | 模型标识符，格式为 `llm_provider:model_id`。                 |
| `responses`          | List<Message.Response>         | Yes      |         | 模型返回的一个或多个响应。                                   |
| `moderationResponse` | ModerationResult               | No       | null    | 如果有，表示审核响应。                                       |

### LLM 流式事件

#### LLMStreamingStartingEvent

表示 LLM 流式调用的开始。包括以下字段：

| 名称     | 数据类型    | 必需 | 默认 | 描述                                                       |
|----------|-------------|----------|---------|------------------------------------------------------------|
| `runId`  | String      | Yes      |         | LLM 运行的唯一标识符。                                     |
| `prompt` | Prompt      | Yes      |         | 发送给模型的 Prompt。                                      |
| `model`  | String      | Yes      |         | 模型标识符，格式为 `llm_provider:model_id`。               |
| `tools`  | List<String> | Yes      |         | 模型可以调用的工具 list。                                  |

#### LLMStreamingFrameReceivedEvent

表示从 LLM 接收到的流式帧。包括以下字段：

| 名称     | 数据类型   | 必需 | 默认 | 描述                                     |
|----------|------------|----------|---------|------------------------------------------|
| `runId`  | String     | Yes      |         | LLM 运行的唯一标识符。                   |
| `frame`  | StreamFrame | Yes      |         | 从流中接收到的帧。                       |

#### LLMStreamingFailedEvent

表示在 LLM 流式调用期间发生错误。包括以下字段：

| 名称    | 数据类型    | 必需 | 默认 | 描述                                                                                                     |
|---------|-------------|----------|---------|-----------------------------------------------------------------------------------------------------------------|
| `runId` | String      | Yes      |         | LLM 运行的唯一标识符。                                                                          |
| `error` | AIAgentError | Yes      |         | 在流式传输期间发生的特定错误。关于详情，请参见 [AIAgentError](#aiagenterror)。                  |

#### LLMStreamingCompletedEvent

表示 LLM 流式调用的结束。包括以下字段：

| 名称     | 数据类型    | 必需 | 默认 | 描述                                                       |
|----------|-------------|----------|---------|------------------------------------------------------------|
| `runId`  | String      | Yes      |         | LLM 运行的唯一标识符。                                     |
| `prompt` | Prompt      | Yes      |         | 发送给模型的 Prompt。                                      |
| `model`  | String      | Yes      |         | 模型标识符，格式为 `llm_provider:model_id`。               |
| `tools`  | List<String> | Yes      |         | 模型可以调用的工具 list。                                  |

### 工具执行事件

#### ToolExecutionStartingEvent

表示模型调用工具的事件。包括以下字段：

| 名称          | 数据类型   | 必需 | 默认 | 描述                                     |
|---------------|------------|----------|---------|------------------------------------------|
| `runId`       | String     | Yes      |         | 策略/Agent 运行的唯一标识符。            |
| `toolCallId`  | String     | No       | null    | 如果可用，表示工具调用的标识符。         |
| `toolName`    | String     | Yes      |         | 工具的名称。                             |
| `toolArgs`    | JsonObject | Yes      |         | 提供给工具的实参。                       |

#### ToolValidationFailedEvent

表示在工具调用期间发生验证错误。包括以下字段：

| 名称          | 数据类型   | 必需 | 默认 | 描述                                     |
|---------------|------------|----------|---------|------------------------------------------|
| `runId`       | String     | Yes      |         | 策略/Agent 运行的唯一标识符。            |
| `toolCallId`  | String     | No       | null    | 如果可用，表示工具调用的标识符。         |
| `toolName`    | String     | Yes      |         | 验证失败的工具的名称。                   |
| `toolArgs`    | JsonObject | Yes      |         | 提供给工具的实参。                       |
| `error`       | String     | Yes      |         | 验证错误消息。                           |

#### ToolExecutionFailedEvent

表示执行工具失败。包括以下字段：

| 名称          | 数据类型    | 必需 | 默认 | 描述                                                                                                             |
|---------------|-------------|----------|---------|-----------------------------------------------------------------------------------------------------------------|
| `runId`       | String      | Yes      |         | 策略/Agent 运行的唯一标识符。                                                                                    |
| `toolCallId`  | String      | No       | null    | 如果可用，表示工具调用的标识符。                                                                                |
| `toolName`    | String      | Yes      |         | 工具的名称。                                                                                                    |
| `toolArgs`    | JsonObject  | Yes      |         | 提供给工具的实参。                                                                                              |
| `error`       | AIAgentError | Yes      |         | 尝试调用工具时发生的特定错误。关于详情，请参见 [AIAgentError](#aiagenterror)。                                   |

#### ToolExecutionCompletedEvent

表示成功调用工具并返回结果。包括以下字段：

| 名称          | 数据类型  | 必需 | 默认 | 描述                                     |
|---------------|-----------|----------|---------|------------------------------------------|
| `runId`       | String    | Yes      |         | 运行的唯一标识符。                       |
| `toolCallId`  | String    | No       | null    | 工具调用的标识符。                       |
| `toolName`    | String    | Yes      |         | 工具的名称。                             |
| `toolArgs`    | JsonObject | Yes      |         | 提供给工具的实参。                       |
| `result`      | String    | Yes      |         | 工具调用的结果（可空的）。               |

## 常见问题和故障排除

以下部分包含与跟踪特性相关的常见问题和解答。

### 如何仅跟踪 Agent 执行的特定部分？

使用 `messageFilter` 属性来过滤事件。例如，要仅跟踪节点执行：

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

### 我可以使用多个消息处理器吗？

是的，您可以添加多个消息处理器，以同时跟踪到不同的目标：

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

### 如何创建自定义消息处理器？

实现 `FeatureMessageProcessor` 接口：

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
        // Close connections of established
    }
}

// Use your custom processor
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-03.kt -->

关于可由消息处理器处理的现有事件类型详情，请参见 [预定义事件类型](#predefined-event-types)。