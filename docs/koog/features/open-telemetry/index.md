# OpenTelemetry 支持

本页详细介绍了 Koog 智能体框架对 OpenTelemetry 的支持，用于对您的 AI 智能体进行跟踪和监控。

## 概览

OpenTelemetry 是一个可观测性框架，提供用于从应用程序生成、收集和导出遥测数据（跟踪）的工具。Koog 的 OpenTelemetry 功能允许您对 AI 智能体进行插桩以收集遥测数据，这可以帮助您：

- 监控智能体性能和行为
- 调试复杂智能体工作流中的问题
- 可视化智能体的执行流
- 跟踪 LLM 调用和工具使用情况
- 分析智能体行为模式

## OpenTelemetry 核心概念

- **Spans**：span 代表分布式跟踪中的单个工作单元或操作。它们指示应用程序中特定活动的开始和结束，例如智能体执行、函数调用、LLM 调用或工具调用。
- **属性 (Attributes)**：属性提供有关遥测相关项（如 span）的元数据。属性以键值对的形式表示。
- **事件 (Events)**：事件是 span 生命周期（与 span 相关的事件）中表示可能发生的值得注意的事情的特定时间点。
- **导出器 (Exporters)**：导出器是负责将收集到的遥测数据发送到各种后端或目的地的组件。
- **收集器 (Collectors)**：收集器接收、处理并导出遥测数据。它们充当您的应用程序与可观测性后端之间的中间人。
- **采样器 (Samplers)**：采样器根据采样策略决定是否应记录跟踪。它们用于管理遥测数据的量。
- **资源 (Resources)**：资源代表产生遥测数据的实体。它们由资源属性标识，这些属性是提供有关资源信息的键值对。

Koog 中的 OpenTelemetry 功能会自动为各种智能体事件创建 span，包括：

- 智能体执行开始和结束
- 节点执行
- LLM 调用
- 工具调用

## 安装

要在 Koog 中使用 OpenTelemetry，请将 OpenTelemetry 功能添加到您的智能体中：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
                // 此处进行配置选项设置
            }
        }
    )
    ```
    <!--- KNIT example-opentelemetry-support-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava01 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var agent = AIAgent.builder()
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .install(OpenTelemetry.Feature, config -> {
            // 此处进行配置选项设置
        })
        .build();
    ```
    <!--- KNIT exampleOpentelemetrySupportJava01.java -->

## 配置

### 基础配置

以下是在智能体中配置 OpenTelemetry 功能时设置的可用属性的完整列表：

| 名称               | 数据类型             | 默认值                          | 描述                                           |
|-------------------|--------------------|------------------------------|----------------------------------------------|
| `serviceName`     | `String`           | `ai.koog`                    | 正在插桩的服务的名称。                                  |
| `serviceVersion`  | `String`           | 当前 Koog 库版本                   | 正在插桩的服务的版本。                                  |
| `isVerbose`       | `Boolean`          | `false`                      | 是否启用详细日志记录，以用于调试 OpenTelemetry 配置。            |
| `sdk`             | `OpenTelemetrySdk` |                              | 用于遥测收集的 OpenTelemetry SDK 实例。              |
| `tracer`          | `Tracer`           |                              | 用于创建 span 的 OpenTelemetry tracer 实例。      |

!!! note
`sdk` 和 `tracer` 属性是您可以访问的公共属性，但您只能使用下面列出的公共方法进行设置。

`OpenTelemetryConfig` 类还包含代表不同配置项相关操作的方法。以下是使用基础配置项集安装 OpenTelemetry 功能的示例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 设置您的服务信息
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 添加 Logging 导出器
        addSpanExporter(LoggingSpanExporter.create())
    }
    ```
    <!--- KNIT example-opentelemetry-support-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava02 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 设置您的服务信息
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 添加 Logging 导出器
        config.addSpanExporter(LoggingSpanExporter.create());
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava02.java -->

有关可用方法的参考，请参阅以下部分。

#### setServiceInfo

设置包含名称和版本在内的服务信息。接受以下实参：

| 名称                 | 数据类型   | 是否必填 | 默认值 | 描述                     |
|--------------------|--------|------|-----|------------------------|
| `serviceName`      | String | 是    |     | 正在插桩的服务的名称。            |
| `serviceVersion`   | String | 是    |     | 正在插桩的服务的版本。            |

#### addSpanExporter

添加 span 导出器以将遥测数据发送到外部系统。接受以下实参：

| 名称         | 数据类型           | 是否必填 | 默认值 | 描述                                       |
|------------|----------------|------|-----|------------------------------------------|
| `exporter` | `SpanExporter` | 是    |     | 要添加到自定义 span 导出器列表中的 `SpanExporter` 实例。 |

#### addSpanProcessor

添加 span 处理器工厂，以便在导出 span 之前对其进行处理。接受以下实参：

| 名称          | 数据类型                              | 是否必填 | 默认值 | 描述                                               |
|-------------|-----------------------------------|------|-----|--------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 是    |     | 为给定导出器创建 span 处理器的函数。允许您为每个导出器自定义处理过程。           |

#### addResourceAttributes

添加资源属性以提供有关服务的额外上下文。接受以下实参：

| 名称           | 数据类型                      | 是否必填 | 默认值 | 描述                             |
|--------------|---------------------------|------|-----|--------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 是    |     | 提供有关服务额外详细信息的键值对。              |

#### setSampler

设置采样策略以控制收集哪些 span。接受以下实参：

| 名称        | 数据类型      | 是否必填 | 默认值 | 描述                               |
|-----------|-----------|------|-----|----------------------------------|
| `sampler` | `Sampler` | 是    |     | 为 OpenTelemetry 配置设置的采样器实例。 |

#### setVerbose

启用或禁用详细日志记录。接受以下实参：

| 名称        | 数据类型      | 是否必填 | 默认值     | 描述                           |
|-----------|-----------|------|---------|------------------------------|
| `verbose` | `Boolean` | 是    | `false` | 如果为 true，应用程序将收集更详细的遥测数据。 |

!!! note

    出于安全原因，OpenTelemetry span 的某些内容默认会被遮掩。例如，LLM 消息会被遮掩为 `HIDDEN:non-empty`，而不是实际的消息内容。要获取内容，请将 `verbose` 参数的值设置为 `true`。

#### setSdk

注入预配置的 OpenTelemetrySdk 实例。

- 当您调用 `setSdk(sdk)` 时，提供的 SDK 将按原样使用，通过 `addSpanExporter`、`addSpanProcessor`、`addResourceAttributes` 或 `setSampler` 应用的任何自定义配置都将被忽略。
- tracer 的插桩作用域名称/版本将与您的服务信息保持一致。

| 名称    | 数据类型               | 是否必填 | 描述                      |
|-------|--------------------|------|-------------------------|
| `sdk` | `OpenTelemetrySdk` | 是    | 智能体中要使用的 SDK 实例。       |

### 高级配置

对于更高级的配置，您还可以自定义以下配置选项：

- 采样器：配置采样策略以调整收集数据的频率和数量。
- 资源属性：添加有关产生遥测数据的进程的更多信息。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.sdk.trace.samplers.Sampler
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 设置您的服务信息
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 添加 Logging 导出器
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.sdk.trace.samplers.Sampler;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 设置您的服务信息
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 添加 Logging 导出器
        config.addSpanExporter(LoggingSpanExporter.create());

        // 设置采样器
        config.setSampler(Sampler.traceIdRatioBased(0.5));

        // 添加资源属性
        config.addResourceAttributes(Map.of(
            AttributeKey.stringKey("custom.attribute"), "custom-value"
        ));
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava03.java -->

#### 采样器 (Sampler)

要定义采样器，请使用 `opentelemetry-java` SDK 中 `Sampler` 类 (`io.opentelemetry.sdk.trace.samplers.Sampler`) 的相应方法，该方法代表您想要使用的采样策略。

默认采样策略如下：

- `Sampler.alwaysOn()`：默认采样策略，对每个 span（跟踪）都进行采样。

有关可用采样器和采样策略的更多信息，请参阅 OpenTelemetry [采样器](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 文档。

#### 资源属性 (Resource attributes)

资源属性代表有关产生遥测数据的进程的额外信息。Koog 包含一组默认设置的资源属性：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 属性的默认值为 `ai.koog`，而 `service.version` 的默认值是当前使用的 Koog 库版本。

除了默认资源属性外，您还可以添加自定义属性。要在 Koog 的 OpenTelemetry 配置中添加自定义属性，请在 OpenTelemetry 配置中使用 `addResourceAttributes()` 方法，该方法接受键和值作为其实参。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava04 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .install(OpenTelemetry.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    config.addResourceAttributes(Map.of(
        AttributeKey.stringKey("custom.attribute"), "custom-value"
    ));
    ```
    <!--- KNIT exampleOpentelemetrySupportJava04.java -->

## Span 类型与属性

OpenTelemetry 功能会自动创建不同类型的 span，以跟踪智能体中的各种操作：

- **CreateAgentSpan**：在运行智能体时创建，在智能体关闭或进程终止时关闭。
- **InvokeAgentSpan**：对智能体的调用。
- **StrategySpan**：智能体策略的执行（顶级执行流）。
- **NodeExecuteSpan**：智能体策略中某个节点的执行。这是一个 Koog 特有的自定义 span。
- **SubgraphExecuteSpan**：智能体策略中某个子图的执行。这是一个 Koog 特有的自定义 span。
- **InferenceSpan**：LLM 调用。
- **ExecuteToolSpan**：工具调用。
- **McpClientSpan**：MCP (Model Context Protocol) 客户端操作。此 span 遵循 MCP 的 OpenTelemetry 语义约定。

Span 以嵌套的层次结构组织。以下是 span 结构的示例：

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
<!--- KNIT example-opentelemetry-support-01.txt -->

### Span 属性

Span 属性提供与 span 相关的元数据。每个 span 都有其属性集，而某些 span 也可以重复属性。

Koog 支持一系列预定义属性，这些属性遵循 OpenTelemetry 的 [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)。例如，该约定定义了一个名为 `gen_ai.conversation.id` 的属性，这通常是 span 的必需属性。在 Koog 中，此属性的值是智能体运行的唯一标识符，会在您调用 `agent.run()` 方法时自动设置。

此外，Koog 还包含 Koog 特有的自定义属性。您可以通过 `koog.` 前缀识别其中大多数属性。以下是可用的自定义属性：

- `koog.strategy.name`：智能体策略的名称。策略是 Koog 相关的实体，描述了智能体的目的。用于 `StrategySpan` span。
- `koog.node.id`：正在执行的节点的标识符（名称）。用于 `NodeExecuteSpan` span。
- `koog.node.input`：执行开始时传递给节点的输入。在节点启动时存在于 `NodeExecuteSpan` 上。
- `koog.node.output`：完成后由节点产生的输出。在节点成功完成时存在于 `NodeExecuteSpan` 上。
- `koog.subgraph.id`：正在执行的子图的标识符（名称）。用于 `SubgraphExecuteSpan` span。
- `koog.subgraph.input`：执行开始时传递给子图的输入。在子图启动时存在于 `SubgraphExecuteSpan` 上。
- `koog.subgraph.output`：完成后由子图产生的输出。在子图成功完成时存在于 `SubgraphExecuteSpan` 上。

### 事件 (Events)

Span 还可以附加 _事件 (event)_。事件描述了发生相关事情的特定时间点。例如，LLM 调用开始或结束的时间。事件也具有属性，并且还包含事件 _正文列字段 (body fields)_。

以下事件类型受支持，且与 OpenTelemetry 的 [生成式 AI 事件语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) 保持一致：

- **SystemMessageEvent**：传递给模型的系统指令。
- **UserMessageEvent**：传递给模型的用户消息。
- **AssistantMessageEvent**：传递给模型的助手消息。
- **ToolMessageEvent**：传递给模型的工具或函数调用的响应。
- **ChoiceEvent**：模型的响应消息。
- **ModerationResponseEvent**：模型审核结果或信号。

!!! note   
`optentelemetry-java` SDK 在添加事件时不支持事件正文列字段参数。因此，在 Koog 的 OpenTelemetry 支持中，事件正文列字段是一个单独的属性，其键为 `body`，值类型为字符串。该字符串包含事件正文列字段的内容或有效负载，通常是一个类 JSON 对象。有关事件正文列字段的示例，请参阅 [OpenTelemetry 文档](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有关 `opentelemetry-java` 中事件正文列字段支持的状态，请参阅相关的 [GitHub 问题](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## 导出器 (Exporters)

导出器将收集到的遥测数据发送到 OpenTelemetry 收集器或其他类型的目的地或后端实现。要在安装 OpenTelemetry 功能时添加导出器，请使用 `addSpanExporter()` 方法。该方法接受以下实参：

| 名称         | 数据类型         | 是否必填 | 默认值 | 描述                                       |
|------------|--------------|------|-----|------------------------------------------|
| `exporter` | SpanExporter | 是    |     | 要添加到自定义 span 导出器列表中的 SpanExporter 实例。 |

以下部分提供了有关 `opentelemetry-java` SDK 中一些最常用导出器的信息。

!!! note
如果您不配置任何自定义导出器，Koog 默认将使用控制台 `LoggingSpanExporter`。这有助于本地开发和调试。

### Logging 导出器

一种将跟踪信息输出到控制台的 logging 导出器。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

这种类型的导出对于开发和调试目的非常有用。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava05 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 添加 logging 导出器
        config.addSpanExporter(LoggingSpanExporter.create());
        // 根据需要添加更多导出器
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava05.java -->

### OpenTelemetry HTTP 导出器

OpenTelemetry HTTP 导出器 (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，通过 HTTP 将 span 数据发送到后端。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import java.util.concurrent.TimeUnit
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    const val AUTH_STRING = ""
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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
                // 设置等待收集器处理导出的 span 批次的最大时间 
                .setTimeout(30, TimeUnit.SECONDS)
                // 设置要连接的 OpenTelemetry 端点
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 添加授权头
                .addHeader("Authorization", "Basic $AUTH_STRING")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
    import java.util.concurrent.TimeUnit;
    public class exampleOpentelemetrySupportJava06 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            String AUTH_STRING = "";
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 添加 OpenTelemetry HTTP 导出器
        config.addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // 设置等待收集器处理导出的 span 批次的最大时间
                .setTimeout(30, TimeUnit.SECONDS)
                // 设置要连接的 OpenTelemetry 端点
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 添加授权头
                .addHeader("Authorization", "Basic " + AUTH_STRING)
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava06.java -->

### OpenTelemetry gRPC 导出器

OpenTelemetry gRPC 导出器 (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它通过 gRPC 将遥测数据导出到后端，并允许您定义接收数据的后端、收集器或端点的主机和端口。默认端口为 `4317`。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava07 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 添加 OpenTelemetry gRPC 导出器
        config.addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // 设置主机和端口
                .setEndpoint("http://localhost:4317")
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava07.java -->

## 与 Langfuse 集成

Langfuse 为 LLM/智能体工作负载提供跟踪可视化和分析。

您可以配置 Koog，使用辅助函数将 OpenTelemetry 跟踪直接导出到 Langfuse：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor 
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava08 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addLangfuseExporter(
            "https://cloud.langfuse.com",
            "...",
            "...",
            null,
            null
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava08.java -->

请阅读有关与 Langfuse 集成的[完整文档](opentelemetry-langfuse-exporter.md)。

## 与 W&B Weave 集成

W&B Weave 为 LLM/智能体工作负载提供跟踪可视化和分析。可以通过预定义的导出器配置与 W&B Weave 的集成：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava09 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addWeaveExporter(
            "https://trace.wandb.ai",
            "my-team",
            "my-project",
            "..."
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava09.java -->

请阅读有关与 W&B Weave 集成的[完整文档](opentelemetry-weave-exporter.md)。

## 与 Jaeger 集成

Jaeger 是一个流行的分布式跟踪系统，可与 OpenTelemetry 配合使用。Koog 仓库中 `examples` 内的 `opentelemetry` 目录包含一个在 Koog 智能体中使用 OpenTelemetry 和 Jaeger 的示例。

### 前置条件

要使用 Koog 和 Jaeger 测试 OpenTelemetry，请使用提供的 `docker-compose.yaml` 文件启动 Jaeger OpenTelemetry 一体化进程，运行以下命令：

```bash
docker compose up -d
```
<!--- KNIT example-opentelemetry-support-02.txt -->

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
<!--- KNIT example-opentelemetry-support-03.txt -->

要访问 Jaeger UI 并查看您的跟踪，请打开 `http://localhost:16686`。

### 示例

为了导出供 Jaeger 使用的遥测数据，该示例使用了 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 和 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

以下是完整的代码示例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.utils.io.use
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
    --> 
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // 添加控制台记录器用于本地调试
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
            println("Running the agent with OpenTelemetry tracing...")

            val result = agent.run("Tell me a joke about programming")

            println("Agent run completed with result: '$result'." +
                    "
Check Jaeger UI at http://localhost:16686 to view traces")
        }
    }
    ```
    <!--- KNIT example-opentelemetry-support-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava10 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.O4Mini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config -> {
                // 添加控制台记录器用于本地调试
                config.addSpanExporter(LoggingSpanExporter.create());

                // 将跟踪发送到 OpenTelemetry 收集器
                config.addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                );
            })
            .build();

        System.out.println("Running the agent with OpenTelemetry tracing...");

        var result = agent.run("Tell me a joke about programming");

        System.out.println(
            "Agent run completed with result: '" + result + "'." +
                "
Check Jaeger UI at http://localhost:16686 to view traces"
        );
    }
    ```
    <!--- KNIT exampleOpentelemetrySupportJava10.java -->

## 故障排除

### 常见问题

1. **Jaeger、Langfuse 或 W&B Weave 中没有出现跟踪**
    - 确保服务正在运行且 OpenTelemetry 端口 (4317) 可访问。
    - 检查 OpenTelemetry 导出器是否配置了正确的端点。
    - 确保在智能体执行后等待几秒钟，以便导出跟踪。

2. **缺失 span 或跟踪不完整**
    - 验证智能体执行是否成功完成。
    - 确保在智能体执行后没有过快关闭应用程序。
    - 在智能体执行后添加延迟，以便有时间导出 span。

3. **span 数量过多**
    - 考虑通过配置 `sampler` 属性来使用不同的采样策略。
    - 例如，使用 `Sampler.traceIdRatioBased(0.1)` 仅采样 10% 的跟踪。

4. **Span 适配器互相覆盖**
    - 目前，OpenTelemetry 智能体功能不支持应用多个 span 适配器 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) 遥测支持

Koog 遵循[官方 OpenTelemetry MCP 语义约定](https://github.com/open-telemetry/semantic-conventions/pull/2083)，为 MCP 操作提供全面的 OpenTelemetry 插桩。

### 概览

MCP 遥测支持包括：

- **自动丰富**：使用 MCP 特有属性丰富工具执行 span
- **客户端插桩**：针对 MCP 客户端操作 (tools/call) 的插桩
- **完全符合语义约定**：符合所有必需、条件必需和推荐的属性

### MCP 属性

MCP 遥测遵循 OpenTelemetry 语义约定，并包含以下属性组：

**必需属性：**
- `mcp.method.name`：MCP 方法名称（例如 "tools/call"）

**条件必需属性：**
- `gen_ai.tool.name`：当操作涉及工具时
- `gen_ai.prompt.name`：当操作涉及提示词时
- `jsonrpc.request.id`：当执行请求（非通知）时
- `error.type`：当操作失败时

**推荐属性：**
- `mcp.session.id`：会话标识符
- `mcp.protocol.version`：MCP 协议版本（例如 "2025-06-18"）
- `network.transport`：传输类型（stdio 为 "pipe"，HTTP 为 "tcp"）
- `server.address` 和 `server.port`：用于客户端操作

### Span 命名约定

MCP span 遵循命名约定：`{mcp.method.name} {target}`

其中 `{target}` 在适用时为工具名称或提示词名称。示例：
- `"tools/call search"` - 调用名为 "search" 的工具

### 最佳做法

- **始终设置会话 ID**：在处理持久 MCP 会话时设置会话 ID，以启用会话跟踪
- **传播请求 ID**：从 JSON-RPC 请求中传播请求 ID，以实现完整的请求跟踪
- **监控指标**：识别 MCP 操作中的性能瓶颈

### 示例：具有遥测功能的完整 MCP 客户端

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.mcp.McpToolRegistryProvider
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.utils.io.use
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import kotlinx.coroutines.runBlocking
    fun main() {
        runBlocking {
            val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    // 创建 MCP 工具注册表
    val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")
    
    // 创建启用了 OpenTelemetry 的智能体并传递工具注册表
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry
    ) {
        install(OpenTelemetry) {
            setServiceInfo("mcp-agent-service", "1.0.0")
            addSpanExporter(LoggingSpanExporter.create())
        }
    }
    
    // 运行智能体 - MCP 工具调用将被自动插桩
    agent.use {
        it.run("Use the search tool to find information")
    }
    ```
    <!--- KNIT example-opentelemetry-support-11.kt -->

此设置遵循 OpenTelemetry 最佳做法和语义约定，只需极少的代码更改即可为 MCP 操作提供完整的可观测性。