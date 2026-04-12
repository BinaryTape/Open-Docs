# Datadog 导出器

Koog 提供了将 agent 跟踪导出到 [Datadog](https://www.datadoghq.com/) 的内置支持，Datadog 是一个具有专用 LLM 可观测性功能的监控与分析平台。
通过 Datadog 集成，您可以可视化、分析和调试 Koog agent 如何与 LLM、API 及其他组件进行交互。

有关 Koog 的 OpenTelemetry 支持的背景信息，请参阅 [OpenTelemetry 支持](https://docs.koog.ai/opentelemetry-support/)。

---

## 设置说明

1) 在 [https://www.datadoghq.com/](https://www.datadoghq.com/) 创建 Datadog 帐户。

2) 从 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 获取您的 API 密钥。

3) 将 Datadog API 密钥传递给 Datadog 导出器。
这可以通过将其作为 `addDatadogExporter()` 函数的参数提供，或通过设置环境变量来完成：

```bash
export DD_API_KEY="<your-api-key>"
```

4)（可选）配置 Datadog 站点。Datadog 在多个地区运行。默认情况下，导出器将跟踪发送到 `datadoghq.com`（US1 地区）。
要使用不同的地区，请设置 `DD_SITE` 环境变量或将 `datadogSite` 参数传递给 `addDatadogExporter()`：

```bash
export DD_SITE="datadoghq.eu"
```

常见的站点值：

| 站点 | 地区 |
|------|--------|
| `datadoghq.com` | US1（默认） |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1（日本） |

<!--- KNIT example-datadog-exporter-01.txt -->

## 配置

要启用 Datadog 导出，请安装 **OpenTelemetry 功能**并添加 `DatadogExporter`。
该导出器在底层使用 `OtlpHttpSpanExporter` 将跟踪直接发送到 Datadog 的 OTLP 接收端点。

### 示例：带有 Datadog 跟踪的 agent

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addDatadogExporter()
            }
        }

        println("Running agent with Datadog tracing")

        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces in Datadog LLM Observability")
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleDatadogExporterJava01 {
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
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config ->
                config.addDatadogExporter()
            )
            .build();

        System.out.println("Running agent with Datadog tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces in Datadog LLM Observability");
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava01.java -->

## 跟踪属性

`addDatadogExporter` 函数支持 `traceAttributes` 参数，该参数接受资源级属性的映射。
这些属性会被添加到所有导出的 span 中，对于使用应用程序特定的元数据标记跟踪非常有用。

常用属性：
- **env**: 环境名称（例如 `production`、`staging`、`development`）
- **service.name**: 您的服务或应用程序的名称
- **version**: 用于跟踪部署的应用程序版本

### 带有跟踪属性的示例

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
            install(OpenTelemetry) {
                addDatadogExporter(
                    datadogSite = "datadoghq.eu",  // 使用欧洲地区
                    traceAttributes = mapOf(
                        "env" to "production",
                        "service.name" to "my-agent",
                        "version" to "1.0.0"
                    )
                )
            }
        }

        println("Running agent with Datadog tracing")

        agent.run("What is Kotlin?")
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Map;
    public class exampleDatadogExporterJava02 {
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
            .systemPrompt("You are a helpful assistant.")
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .install(OpenTelemetry.Feature, config ->
                config.addDatadogExporter(
                    null,                           // 使用 DD_API_KEY 环境变量
                    "datadoghq.eu",                 // 使用欧洲地区
                    null,                           // 默认超时
                    Map.of(
                        "env", "production",
                        "service.name", "my-agent",
                        "version", "1.0.0"
                    )
                ))
            .build();

        System.out.println("Running agent with Datadog tracing");

        agent.run("What is Kotlin?");
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava02.java -->

## 自定义导出器包装

如果您需要在注册导出器之前使用自定义装饰器对其进行包装，可以使用 `buildDatadogExporter()` 函数：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.sdk.trace.export.SpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    class MyCustomSpanExporter(private val delegate: SpanExporter) : SpanExporter by delegate
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        val exporter = buildDatadogExporter()
        val wrapped = MyCustomSpanExporter(exporter) // 例如：属性后处理
        addSpanExporter(wrapped)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-04.kt -->

## 跟踪哪些内容

启用后，Datadog 导出器会捕获与 Koog 通用 OpenTelemetry 集成相同的 span，包括：

- **Agent 生命周期事件**：agent 启动、停止、错误
- **LLM 交互**：提示词、响应、token 使用情况、延迟
- **工具调用**：工具调用的执行跟踪
- **系统上下文**：元数据，如模型名称、环境、Koog 版本

导出器包含 `dd-otlp-source: llmobs` 标头，用于将 span 路由到 Datadog 的 LLM 可观测性产品。

出于安全原因，OpenTelemetry span 的某些内容默认会被掩码。
要在 Datadog 中使内容可用，请在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，并将其 `verbose` 参数设置为 `true`，如下所示：

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
        addDatadogExporter()
        setVerbose(true)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleDatadogExporterJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .systemPrompt("You are a helpful assistant.")
                .llmModel(OpenAIModels.Chat.GPT4oMini)
                .
    -->
    <!--- SUFFIX
            .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addDatadogExporter();
        config.setVerbose(true);
    })
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava03.java -->

有关 Datadog 的 LLM 可观测性和 OpenTelemetry 支持的更多详细信息，请参阅：

- [Datadog LLM 可观测性文档](https://docs.datadoghq.com/llm_observability/)
- [Datadog OTLP API 接收](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)

---

## 故障排除

### Datadog 中没有出现跟踪
- 仔细检查您的环境中是否设置了 `DD_API_KEY`。
- 验证您是否为所在的 Datadog 地区使用了正确的 `DD_SITE`（美国使用 `datadoghq.com`，欧洲使用 `datadoghq.eu`）。
- 确保您的 API 密钥具有发送跟踪所需的权限。

### 身份验证错误
- 检查您的 `DD_API_KEY` 是否有效且处于激活状态。
- 可以在 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 中验证 API 密钥。

### 连接问题
- 确保您的环境具有访问 Datadog OTLP 接收端点 (`https://otlp.<site>/v1/traces`) 的网络权限。
- 检查是否存在可能阻止出站连接的任何防火墙或代理设置。