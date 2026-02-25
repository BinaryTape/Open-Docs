# OpenTelemetry 支持

本页面提供了有关 Koog 代理框架 (agentic framework) 对 OpenTelemetry 支持的详细信息，用于对您的 AI agent 进行跟踪 (tracing) 和监控。

## 概览

OpenTelemetry 是一个可观测性框架，提供了用于从应用程序中生成、收集和导出遥测数据（跟踪 (trace)）的工具。Koog 的 OpenTelemetry 功能允许您对 AI agent 进行插桩以收集遥测数据，这可以帮助您：

- 监控 agent 的性能和行为
- 调试复杂 agent 工作流中的问题
- 可视化 agent 的执行流程
- 跟踪 LLM 调用和工具使用情况
- 分析 agent 的行为模式

## OpenTelemetry 核心概念

- **span**：span 代表分布式跟踪中的单个工作单元或操作。它们表示应用程序中特定活动的开始和结束，例如 agent 执行、函数调用 (function call)、LLM 调用或工具调用。
- **特性 (Attributes)**：特性提供有关遥测相关项（如 span）的元数据。特性以键值对的形式表示。
- **事件 (Events)**：事件是 span 生命周期中的特定时间点（与 span 相关的事件），代表发生的具有潜在价值的事项。
- **导出器 (Exporters)**：导出器是负责将收集到的遥测数据发送到各种后端或目的地的组件。
- **收集器 (Collectors)**：收集器接收、处理并导出遥测数据。它们充当您的应用程序与可观测性后端之间的中介。
- **采样器 (Samplers)**：采样器根据采样策略确定是否应记录跟踪。它们用于管理遥测数据的容量。
- **资源 (Resources)**：资源代表产生遥测数据的实体。它们通过资源特性进行标识，资源特性是提供有关资源信息的键值对。

Koog 中的 OpenTelemetry 功能会自动为各种 agent 事件创建 span，包括：

- Agent 执行的开始和结束
- 节点 (Node) 执行
- LLM 调用
- 工具调用

## 安装

要在 Koog 中使用 OpenTelemetry，请将 OpenTelemetry 功能添加到您的 agent 中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
            // 配置选项在此处设置
        }
    }
)
```
<!--- KNIT example-opentelemetry-support-01.kt -->

## 配置

### 基础配置

以下是在 agent 中配置 OpenTelemetry 功能时设置的可用属性的完整列表：

| 名称 | 数据类型 | 默认值 | 描述 |
|------------------|--------------------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 正在插桩的服务名称。 |
| `serviceVersion` | `String`           | 当前 Koog 库版本 | 正在插桩的服务版本。 |
| `isVerbose`      | `Boolean`          | `false`                      | 是否启用详细日志记录，用于调试 OpenTelemetry 配置。 |
| `sdk`            | `OpenTelemetrySdk` |                              | 用于遥测收集的 OpenTelemetry SDK 实例。 |
| `tracer`         | `Tracer`           |                              | 用于创建 span 的 OpenTelemetry tracer 实例。 |

!!! note
    `sdk` 和 `tracer` 属性是可以访问的公共属性，但您只能使用下面列出的公共方法来设置它们。

`OpenTelemetryConfig` 类还包含代表与不同配置项相关的操作方法。以下是一个使用基础配置项集安装 OpenTelemetry 功能的示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // 设置您的服务配置
    setServiceInfo("my-agent-service", "1.0.0")
    
    // 添加 Logging 导出器
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

有关可用方法的参考，请参阅以下部分。

#### setServiceInfo

设置服务信息，包括名称和版本。接受以下实参 (argument)：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | 是 |               | 正在插桩的服务名称。 |
| `serviceVersion`   | String    | 是 |               | 正在插桩的服务版本。 |

#### addSpanExporter

添加 span 导出器以将遥测数据发送到外部系统。接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | 是 |               | 要添加到自定义 span 导出器列表中的 `SpanExporter` 实例。 |

#### addSpanProcessor

添加 span 处理器工厂，以便在导出 span 之前对其进行处理。接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|-------------|-----------------------------------|----------|---------------|--------------------------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 是 |               | 为给定导出器创建 span 处理器的函数。允许您为每个导出器自定义处理。 |

#### addResourceAttributes

添加资源特性以提供有关服务的额外上下文。接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 是 |               | 提供有关服务额外详情的键值对。 |

#### setSampler

设置采样策略以控制收集哪些 span。接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | 是 |               | 为 OpenTelemetry 配置设置的采样器实例。 |

#### setVerbose

启用或禁用详细日志记录。接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | 是 | `false`       | 如果为 true，应用程序将收集更详细的遥测数据。 |

!!! note

    出于安全原因，OpenTelemetry span 的某些内容默认会被遮盖。例如，LLM 消息会被遮盖为 `HIDDEN:non-empty` 而不是实际的消息内容。要获取内容，请将 `verbose` 实参的值设置为 `true`。

#### setSdk

注入预配置的 OpenTelemetrySdk 实例。

- 当您调用 setSdk(sdk) 时，提供的 SDK 将按原样使用，通过 addSpanExporter、addSpanProcessor、addResourceAttributes 或 setSampler 应用的任何自定义配置都将被忽略。
- Tracer 的插桩范围名称/版本将与您的服务信息保持一致。

| 名称 | 数据类型 | 是否必须 | 描述 |
|-------|--------------------|----------|---------------------------------------|
| `sdk` | `OpenTelemetrySdk` | 是 | 在 agent 中使用的 SDK 实例。 |

### 高级配置

对于更高级的配置，您还可以自定义以下配置选项：

- 采样器 (Sampler)：配置采样策略以调整收集数据的频率和数量。
- 资源特性：添加更多关于产生遥测数据的进程的信息。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.sdk.trace.samplers.Sampler

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // 设置您的服务配置
    setServiceInfo("my-agent-service", "1.0.0")
    
    // 添加 Logging 导出器
    addSpanExporter(LoggingSpanExporter.create())
    
    // 设置采样器 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // 添加资源特性
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### 采样器 (Sampler)

要定义采样器，请使用 `opentelemetry-java` SDK 中 `Sampler` 类 (`io.opentelemetry.sdk.trace.samplers.Sampler`) 的相应方法，该方法代表您想要使用的采样策略。

默认采样策略如下：

- `Sampler.alwaysOn()`：默认采样策略，其中每个 span（跟踪）都会被采样。

有关可用采样器和采样策略的更多信息，请参阅 OpenTelemetry [采样器](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 文档。

#### 资源特性

资源特性代表有关产生遥测数据的进程的附加信息。Koog 包含一组默认设置的资源特性：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 特性的默认值为 `ai.koog`，而默认的 `service.version` 值为当前使用的 Koog 库版本。

除了默认资源特性外，您还可以添加自定义特性。要在 Koog 的 OpenTelemetry 配置中添加自定义特性，请在 OpenTelemetry 配置中使用 `addResourceAttributes()` 方法，该方法接受一个键和一个值作为其实参。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
-->
<!--- SUFFIX
        }
    }
)
-->
```kotlin
addResourceAttributes(mapOf(
    AttributeKey.stringKey("custom.attribute") to "custom-value")
)
```
<!--- KNIT example-opentelemetry-support-04.kt -->

## Span 类型和特性

OpenTelemetry 功能会自动创建不同类型的 span 来跟踪 agent 中的各种操作：

- **CreateAgentSpan**：在您运行 agent 时创建，在 agent 关闭或进程终止时关闭。
- **InvokeAgentSpan**：agent 的调用。
- **StrategySpan**：agent 策略的执行（顶层执行流）。
- **NodeExecuteSpan**：agent 策略中节点 (node) 的执行。这是一个自定义的、Koog 特有的 span。
- **SubgraphExecuteSpan**：agent 策略中子图 (subgraph) 的执行。这是一个自定义的、Koog 特有的 span。
- **InferenceSpan**：一个 LLM 调用。
- **ExecuteToolSpan**：一个工具调用。
- **McpClientSpan**：一个 MCP (Model Context Protocol) 客户端操作。此 span 遵循 MCP 的 OpenTelemetry 语义约定。

Span 以嵌套的层次结构组织。以下是一个 span 结构示例：

```text
CreateAgentSpan
    InvokeAgentSpan
        StrategySpan
            NodeExecuteSpan
                InferenceSpan
            NodeExecuteSpan
                ExecuteToolSpan
            SubgraphExecuteSpan
                NodeExecuteSpan
                    InferenceSpan
```

### Span 特性

Span 特性提供与 span 相关的元数据。每个 span 都有其特性集，而某些 span 也可以重复特性。

Koog 支持一系列遵循 OpenTelemetry [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) 的预定义特性。例如，约定定义了一个名为 `gen_ai.conversation.id` 的特性，这通常是 span 的必需特性。在 Koog 中，此特性的值是 agent 运行的唯一标识符，当您调用 `agent.run()` 方法时会自动设置该值。

此外，Koog 还包含自定义的、Koog 特有的特性。您可以通过 `koog.` 前缀识别大多数这些特性。以下是可用的自定义特性：

- `koog.strategy.name`：agent 策略的名称。策略是一个与 Koog 相关的实体，描述了 agent 的目的。用于 `StrategySpan` span。
- `koog.node.id`：正在执行的节点 (node) 的标识符（名称）。用于 `NodeExecuteSpan` span。
- `koog.node.input`：在执行开始时传递给节点 (node) 的输入。在节点启动时的 `NodeExecuteSpan` 上呈现。
- `koog.node.output`：节点在完成后产生的输出。在节点成功完成时的 `NodeExecuteSpan` 上呈现。
- `koog.subgraph.id`：正在执行的子图 (subgraph) 的标识符（名称）。用于 `SubgraphExecuteSpan` span。
- `koog.subgraph.input`：在执行开始时传递给子图 (subgraph) 的输入。在子图启动时的 `SubgraphExecuteSpan` 上呈现。
- `koog.subgraph.output`：子图在完成后产生的输出。在子图成功完成时的 `SubgraphExecuteSpan` 上呈现。

### 事件 (Events)

Span 还可以附加一个“事件”。事件描述了发生相关事项的特定时间点。例如，当 LLM 调用开始或结束时。事件也有特性，此外还包括事件“正文字段 (body fields)”。

以下事件类型受支持，并与 OpenTelemetry 的 [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) 保持一致：

- **SystemMessageEvent**：传递给模型的系统指令。
- **UserMessageEvent**：传递给模型的用户消息。
- **AssistantMessageEvent**：传递给模型的新助理消息。
- **ToolMessageEvent**：从工具或函数调用传递给模型的响应。
- **ChoiceEvent**：来自模型的响应消息。
- **ModerationResponseEvent**：模型审核结果或信号。

!!! note   
    `optentelemetry-java` SDK 在添加事件时不支持事件正文字段参数。因此，在 Koog 的 OpenTelemetry 支持中，事件正文字段是一个单独的特性，其键为 `body`，值类型为字符串。该字符串包含事件正文字段的内容或有效负载，通常是一个类 JSON 对象。有关事件正文字段的示例，请参阅 [OpenTelemetry 文档](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有关 `opentelemetry-java` 中事件正文字段支持的状态，请参阅相关的 [GitHub 问题](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## 导出器 (Exporters)

导出器将收集到的遥测数据发送到 OpenTelemetry 收集器或其他类型的目的地或后端实现。要添加导出器，请在安装 OpenTelemetry 功能时使用 `addSpanExporter()` 方法。该方法接受以下实参：

| 名称 | 数据类型 | 是否必须 | 默认值 | 描述 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | 是 |         | 要添加到自定义 span 导出器列表中的 SpanExporter 实例。 |

以下部分提供了有关 `opentelemetry-java` SDK 中一些最常用导出器的信息。

!!! note
    如果您没有配置任何自定义导出器，Koog 默认将使用控制台 LoggingSpanExporter。这有助于在本地开发和调试。

### Logging 导出器

一种将跟踪信息输出到控制台的日志导出器。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

这种类型的导出对于开发和调试目的非常有用。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // 添加 logging 导出器
    addSpanExporter(LoggingSpanExporter.create())
    // 根据需要添加更多导出器
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTP 导出器

OpenTelemetry HTTP 导出器 (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，通过 HTTP 将 span 数据发送到后端。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import java.util.concurrent.TimeUnit

const val apiKey = ""
const val AUTH_STRING = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // 添加 OpenTelemetry HTTP 导出器 
   addSpanExporter(
      OtlpHttpSpanExporter.builder()
         // 设置等待收集器处理导出的批次 span 的最长时间 
         .setTimeout(30, TimeUnit.SECONDS)
         // 设置要连接的 OpenTelemetry 端点 (endpoint)
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // 添加授权头
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPC 导出器

OpenTelemetry gRPC 导出器 (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它通过 gRPC 将遥测数据导出到后端，并允许您定义接收数据的后端、收集器或端点的宿主和端口。默认端口为 `4317`。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // 添加 OpenTelemetry gRPC 导出器 
   addSpanExporter(
      OtlpGrpcSpanExporter.builder()
          // 设置宿主和端口
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## 与 Langfuse 集成

Langfuse 为 LLM/agent 工作负载提供跟踪可视化和分析。

您可以配置 Koog，使用辅助函数将 OpenTelemetry 跟踪直接导出到 Langfuse：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    addLangfuseExporter(
        langfuseUrl = "https://cloud.langfuse.com",
        langfusePublicKey = "...",
        langfuseSecretKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-08.kt -->

请阅读有关与 Langfuse 集成的 [完整文档](opentelemetry-langfuse-exporter.md)。

## 与 W&B Weave 集成

W&B Weave 为 LLM/agent 工作负载提供跟踪可视化和分析。可以通过预定义的导出器配置与 W&B Weave 的集成：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    addWeaveExporter(
        weaveOtelBaseUrl = "https://trace.wandb.ai",
        weaveEntity = "my-team",
        weaveProjectName = "my-project",
        weaveApiKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-09.kt -->

请阅读有关与 W&B Weave 集成的 [完整文档](opentelemetry-weave-exporter.md)。

## 与 Jaeger 集成

Jaeger 是一个流行的分布式跟踪系统，可与 OpenTelemetry 配合使用。Koog 仓库中 `examples` 目录下的 `opentelemetry` 目录包含了一个将 OpenTelemetry 与 Jaeger 和 Koog agent 结合使用的示例。

### 前置条件

要使用 Koog 和 Jaeger 测试 OpenTelemetry，请通过运行以下命令并使用提供的 `docker-compose.yaml` 文件来启动 Jaeger OpenTelemetry 一体化进程：

```bash
docker compose up -d
```

提供的 Docker Compose YAML 文件包含以下内容：

```yaml
# docker-compose.yaml
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:1.39
    container_name: jaeger-all-in-one
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "4317:4317"
      - "16686:16686"
```

要访问 Jaeger UI 并查看您的跟踪，请打开 `http://localhost:16686`。

### 示例

为了导出供 Jaeger 使用的遥测数据，该示例使用了 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 和 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

以下是完整的代码示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.utils.io.use
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "open-ai-api-key"

-->
```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // 添加控制台日志记录器用于本地调试
                addSpanExporter(LoggingSpanExporter.create())

                // 将跟踪发送到 OpenTelemetry 收集器
                addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                )
            }
        }

        agent.use { agent ->
            println("正在运行带有 OpenTelemetry 跟踪的 agent...")

            val result = agent.run("告诉我一个关于编程的笑话")

            println("Agent 运行完成，结果为：'$result'。" +
                    "
查看 Jaeger UI (http://localhost:16686) 以查看跟踪")
        }
    }
}
```
<!--- KNIT example-opentelemetry-support-10.kt -->

## 故障排除

### 常见问题

1. **Jaeger、Langfuse 或 W&B Weave 中没有出现跟踪**
    - 确保服务正在运行且 OpenTelemetry 端口 (4317) 可访问。
    - 检查 OpenTelemetry 导出器是否配置了正确的端点 (endpoint)。
    - 确保在 agent 执行后等待几秒钟，以便导出跟踪。

2. **缺少 span 或跟踪不完整**
    - 验证 agent 执行是否成功完成。
    - 确保在 agent 执行后没有过快关闭应用程序。
    - 在 agent 执行后添加延迟，以便为导出 span 留出时间。

3. **span 数量过多**
    - 考虑通过配置 `sampler` 属性使用不同的采样策略。
    - 例如，使用 `Sampler.traceIdRatioBased(0.1)` 仅对 10% 的跟踪进行采样。

4. **span 适配器相互覆盖**
    - 目前，OpenTelemetry agent 功能不支持应用多个 span 适配器 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) 遥测支持

Koog 遵循 [官方 MCP OpenTelemetry 语义约定](https://github.com/open-telemetry/semantic-conventions/pull/2083)，为 MCP 操作提供了全面的 OpenTelemetry 插桩。

### 概览

MCP 遥测支持包括：

- 使用 MCP 特有的特性 **自动增强** 工具执行 span
- 用于 MCP 客户端操作 (tools/call) 的 **客户端插桩**
- **完全符合语义约定**，包含所有必需、有条件必需和推荐的特性

### MCP 特性

MCP 遥测遵循 OpenTelemetry 语义约定，并包含以下特性组：

**必需特性：**
- `mcp.method.name`：MCP 方法名称（例如 "tools/call"）

**有条件必需的特性：**
- `gen_ai.tool.name`：当操作涉及工具时
- `gen_ai.prompt.name`：当操作涉及 prompt 时
- `jsonrpc.request.id`：当执行请求（非通知）时
- `error.type`：当操作失败时

**推荐特性：**
- `mcp.session.id`：会话标识符
- `mcp.protocol.version`：MCP 协议版本（例如 "2025-06-18"）
- `network.transport`：传输类型（stdio 为 "pipe"，HTTP 为 "tcp"）
- `server.address` 和 `server.port`：用于客户端操作

### Span 命名约定

MCP span 遵循命名约定：`{mcp.method.name} {target}`

其中 `{target}` 在适用时为工具名称或 prompt 名称。示例：
- `"tools/call search"` - 调用名为 "search" 的工具

### 最佳做法

- 在处理持久 MCP 会话时，**始终设置会话 ID** 以实现会话跟踪。
- 从 JSON-RPC 请求中 **传播请求 ID**，以实现完整的请求跟踪。
- **监控指标** 以识别 MCP 操作中的性能瓶颈。

### 示例：带有遥测功能的完整 MCP 客户端

```kotlin
// 创建 MCP 工具注册表
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")

// 创建启用了 OpenTelemetry 的 agent 并传递工具注册表
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry
) {
    install(OpenTelemetry) {
        setServiceInfo("mcp-agent-service", "1.0.0")
        addSpanExporter(LoggingSpanExporter.create())
    }
}

// 运行 agent - MCP 工具调用将被自动插桩
agent.use {
    it.run("Use the search tool to find information")
}
```

此设置遵循 OpenTelemetry 最佳做法和语义约定，只需极少的代码更改即可为 MCP 操作提供完整的可观测性。