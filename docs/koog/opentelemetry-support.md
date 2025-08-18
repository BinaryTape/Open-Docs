# OpenTelemetry 支持

本页面详细介绍了 Koog 代理框架对 OpenTelemetry 的支持，用于跟踪和监控您的 AI 代理。

## 概述

OpenTelemetry 是一个可观测性框架，它提供工具用于从应用程序生成、收集和导出遥测数据（跟踪）。Koog 的 OpenTelemetry 特性允许您对 AI 代理进行插桩以收集遥测数据，这可以帮助您：

- 监控代理性能和行为
- 调试复杂代理工作流中的问题
- 可视化代理的执行流
- 跟踪 LLM 调用和工具使用
- 分析代理行为模式

## OpenTelemetry 关键概念

- **Span**：Span 表示分布式跟踪中的单个工作单元或操作。它们指示应用程序中特定活动的开始和结束，例如代理执行、函数调用、LLM 调用或工具调用。
- **属性**：属性提供关于遥测相关项（例如 Span）的元数据。属性以键值对的形式表示。
- **事件**：事件是 Span 生命周期中特定时间点发生的、可能值得注意的事情。
- **导出器**：导出器是负责将收集到的遥测数据发送到各种后端或目标位置的组件。
- **收集器**：收集器接收、处理和导出遥测数据。它们充当应用程序与可观测性后端之间的中介。
- **采样器**：采样器根据采样策略决定是否应记录跟踪。它们用于管理遥测数据的量。
- **资源**：资源表示生成遥测数据的实体。它们通过资源属性进行标识，这些属性是提供有关资源的键值对。

Koog 中的 OpenTelemetry 特性会自动为各种代理事件创建 Span，包括：

- 代理执行的开始和结束
- 节点执行
- LLM 调用
- 工具调用

## 安装

要在 Koog 中使用 OpenTelemetry，请将 OpenTelemetry 特性添加到您的代理中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
            // 配置选项在此处
        }
    }
)
```
<!--- KNIT example-opentelemetry-support-01.kt -->

## 配置

### 基本配置

以下是在代理中配置 OpenTelemetry 特性时可设置的全部可用属性列表：

| Name             | 数据类型          | 默认值                | 描述                                                                  |
|------------------|--------------------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 正在插桩的服务名称。                                  |
| `serviceVersion` | `String`           | 当前 Koog 库版本 | 正在插桩的服务版本。                               |
| `isVerbose`      | `Boolean`          | `false`                      | 是否为 OpenTelemetry 配置调试启用详细日志记录。 |
| `sdk`            | `OpenTelemetrySdk` |                              | 用于遥测数据收集的 OpenTelemetry SDK 实例。              |
| `tracer`         | `Tracer`           |                              | 用于创建 Span 的 OpenTelemetry tracer 实例。                   |

!!! note
    `sdk` 和 `tracer` 属性是您可以访问的公共属性，但只能使用下面列出的公共方法进行设置。

`OpenTelemetryConfig` 类还包含表示与不同配置项相关的操作的方法。以下是安装 OpenTelemetry 特性并使用一组基本配置项的示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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
    
    // 添加日志记录导出器
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

有关可用方法的参考，请参阅以下章节。

#### setServiceInfo

设置服务信息，包括名称和版本。接受以下实参：

| Name               | 数据类型 | 必需的 | 默认值 | 描述                                                 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | Yes      |               | 正在插桩的服务名称。                 |
| `serviceVersion`   | String    | Yes      |               | 正在插桩的服务版本。              |

#### addSpanExporter

添加 Span 导出器以将遥测数据发送到外部系统。接受以下实参：

| Name       | 数据类型      | 必需的 | 默认值 | 描述                                                                   |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | Yes      |               | 要添加到自定义 Span 导出器列表的 `SpanExporter` 实例。 |

#### addSpanProcessor

添加 Span 处理器以在导出 Span 之前对其进行处理。接受以下实参：

| Name        | 数据类型       | 必需的 | 默认值 | 描述                                                                                |
|-------------|-----------------|----------|---------------|--------------------------------------------------------------------------------------------|
| `processor` | `SpanProcessor` | Yes      |               | 包含用于在导出前处理遥测数据的自定义逻辑的 Span 处理器。 |

#### addResourceAttributes

添加资源属性以提供有关服务的额外上下文。接受以下实参：

| Name         | 数据类型                 | 必需的 | 默认值 | 描述                                                            |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | Yes      |               | 提供有关服务的额外详细信息的键值对。 |

#### setSampler

设置采样策略以控制收集哪些 Span。接受以下实参：

| Name      | 数据类型 | 必需的 | 默认值 | 描述                                                      |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | Yes      |               | 为 OpenTelemetry 配置设置的采样器实例。 |

#### setVerbose

启用或禁用用于调试 OpenTelemetry 配置的详细日志记录。接受以下实参：

| Name      | 数据类型 | 必需的 | 默认值 | 描述                                                     |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | Yes      | `false`       | 如果为 true，应用程序将收集更详细的遥测数据。 |

### 高级配置

对于更高级的配置，您还可以自定义以下配置选项：

- 采样器：配置采样策略以调整收集数据的频率和数量。
- 资源属性：添加有关生成遥测数据的进程的更多信息。

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
    executor = simpleOpenAIExecutor(apiKey),
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
    
    // 添加日志记录导出器
    addSpanExporter(LoggingSpanExporter.create())
    
    // 设置采样器 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // 添加资源属性
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### 采样器

要定义采样器，请使用 `opentelemetry-java` SDK 中 `Sampler` 类 (`io.opentelemetry.sdk.trace.samplers.Sampler`) 的相应方法，该方法表示您要使用的采样策略。

默认采样策略如下：

- `Sampler.alwaysOn()`：默认采样策略，其中每个 Span（跟踪）都被采样。

有关可用采样器和采样策略的更多信息，请参阅 OpenTelemetry [采样器](https://opentelemetry.io/docs/languages/java/sdk/#sampler)文档。

#### 资源属性

资源属性表示有关生成遥测数据的进程的额外信息。Koog 包含一组默认设置的资源属性：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 属性的默认值为 `ai.koog`，而 `service.version` 的默认值是当前使用的 Koog 库版本。

除了默认资源属性外，您还可以添加自定义属性。要在 Koog 的 OpenTelemetry 配置中添加自定义属性，请在 OpenTelemetry 配置中使用 `addResourceAttributes()` 方法，该方法接受键和值作为其实参。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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

## Span 类型和属性

OpenTelemetry 特性会自动创建不同类型的 Span 以跟踪代理中的各种操作：

- **CreateAgentSpan**：在您运行代理时创建，在代理关闭或进程终止时关闭。
- **InvokeAgentSpan**：代理的调用。
- **NodeExecuteSpan**：代理策略中节点的执行。这是一个自定义的、Koog 特有的 Span。
- **InferenceSpan**：LLM 调用。
- **ExecuteToolSpan**：工具调用。

Span 以嵌套的、分层的结构组织。以下是 Span 结构的示例：

```text
CreateAgentSpan
    InvokeAgentSpan
        NodeExecuteSpan
            InferenceSpan
        NodeExecuteSpan
            ExecuteToolSpan
        NodeExecuteSpan
            InferenceSpan    
```

### Span 属性

Span 属性提供与 Span 相关的元数据。每个 Span 都有自己的一组属性，而有些 Span 也可以重复属性。

Koog 支持遵循 OpenTelemetry [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)的预定义属性列表。例如，这些约定定义了一个名为 `gen_ai.conversation.id` 的属性，这通常是 Span 的必需属性。在 Koog 中，此属性的值是代理运行的唯一标识符，当您调用 `agent.run()` 方法时会自动设置。

此外，Koog 还包括自定义的、Koog 特有的属性。您可以通过 `koog.` 前缀识别其中大多数属性。以下是可用的自定义属性：

- `koog.agent.strategy.name`：代理策略的名称。策略是与 Koog 相关的实体，描述代理的用途。用于 `InvokeAgentSpan` Span。
- `koog.node.name`：正在运行的节点的名称。用于 `NodeExecuteSpan` Span。

### 事件

Span 也可以附加一个_事件_。事件描述了在特定时间点发生的相关事情。例如，LLM 调用开始或结束时。事件也具有属性，并且还包含事件_正文字段_。

以下事件类型符合 OpenTelemetry [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)的要求：

- **SystemMessageEvent**：传递给模型的系统指令。
- **UserMessageEvent**：传递给模型的用户消息。
- **AssistantMessageEvent**：传递给模型的助手消息。
- **ToolMessageEvent**：从工具或函数调用返回并传递给模型的响应。
- **ChoiceEvent**：从模型返回的响应消息。

!!! note   
    `optentelemetry-java` SDK 在添加事件时不支持事件正文字段实参。因此，在 Koog 的 OpenTelemetry 支持中，事件正文字段是一个单独的属性，其键为 `body`，值类型为字符串。该字符串包含事件正文字段的内容或载荷，通常是类似 JSON 的对象。有关事件正文字段的示例，请参阅 [OpenTelemetry 文档](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有关 `opentelemetry-java` 中事件正文字段支持状态的信息，请参阅相关的 [GitHub 议题](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## 导出器

导出器将收集到的遥测数据发送到 OpenTelemetry Collector 或其他类型的目标位置或后端实现。要添加导出器，请在安装 OpenTelemetry 特性时使用 `addSpanExporter()` 方法。该方法接受以下实参：

| Name       | 数据类型    | 必需的 | 默认值 | 描述                                                                 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | Yes      |         | 要添加到自定义 Span 导出器列表的 SpanExporter 实例。 |

以下章节提供了有关 `opentelemetry-java` SDK 中一些最常用导出器的信息。

### 日志记录导出器

一个日志记录导出器，将跟踪信息输出到控制台。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

这种类型的导出对于开发和调试目的非常有用。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // 添加日志记录导出器
    addSpanExporter(LoggingSpanExporter.create())
    // 根据需要添加更多导出器
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTP 导出器

OpenTelemetry HTTP 导出器 (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，通过 HTTP 将 Span 数据发送到后端。

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
    executor = simpleOpenAIExecutor(apiKey),
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
         // 设置等待收集器处理导出的 Span 批次的最长时间 
         .setTimeout(30, TimeUnit.SECONDS)
         // 设置要连接的 OpenTelemetry 端点
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // 添加授权请求头
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPC 导出器

OpenTelemetry gRPC 导出器 (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它通过 gRPC 将遥测数据导出到后端，并允许您定义接收数据的后端、收集器或端点的主机和端口。默认端口是 `4317`。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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
          // 设置主机和端口
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## 与 Jaeger 集成

Jaeger 是一个流行的分布式跟踪系统，可与 OpenTelemetry 配合使用。Koog 版本库中 `examples` 目录下的 `opentelemetry` 目录包含一个将 OpenTelemetry 与 Jaeger 和 Koog 代理结合使用的示例。

### 先决条件

要测试 OpenTelemetry 与 Koog 和 Jaeger 的集成，请使用提供的 `docker-compose.yaml` 文件，通过运行以下命令来启动 Jaeger OpenTelemetry 一体化进程：

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

为了将遥测数据导出到 Jaeger 中使用，该示例使用了 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 和 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

以下是完整的代码样本：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.utils.use
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
            executor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Reasoning.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // 添加用于本地调试的控制台日志记录器
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
            println("正在运行带有 OpenTelemetry 跟踪的代理...")

            val result = agent.run("Tell me a joke about programming")

            println("代理运行完成，结果为：'$result'。" +
                    "
请访问 http://localhost:16686 上的 Jaeger UI 查看跟踪")
        }
    }
}
```
<!--- KNIT example-opentelemetry-support-08.kt -->

## 故障排除

### 常见问题

1. **Jaeger 或 Langfuse 中未出现跟踪**
    - 确保服务正在运行且 OpenTelemetry 端口 (4317) 可访问。
    - 检查 OpenTelemetry 导出器是否配置了正确的端点。
    - 确保在代理执行后等待几秒钟，以便导出跟踪。

2. **Span 缺失或跟踪不完整**
    - 验证代理执行是否成功完成。
    - 确保您没有在代理执行后过快地关闭应用程序。
    - 在代理执行后添加延迟，以便有时间导出 Span。

3. **Span 数量过多**
    - 考虑通过配置 `sampler` 属性来使用不同的采样策略。
    - 例如，使用 `Sampler.traceIdRatioBased(0.1)` 仅对 10% 的跟踪进行采样。

    ```