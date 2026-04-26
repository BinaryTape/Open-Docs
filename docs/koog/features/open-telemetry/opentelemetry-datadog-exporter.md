# Datadog 导出器

Koog 使用 [OpenTelemetry](https://opentelemetry.io/) 发送 agent 跟踪，OpenTelemetry 是可观测性数据的开放标准。
为了将这些跟踪发送到 [Datadog](https://www.datadoghq.com/)，Koog 包含了一个内置的 OpenTelemetry 导出器 —— 无需手动检测。

连接后，Datadog 的 [OpenTelemetry 支持](https://docs.datadoghq.com/opentelemetry/) 让您可以可视化、分析并调试 agent 与 LLM、工具及外部 API 的交互方式。

---

## 设置说明

1. 在 [https://www.datadoghq.com/](https://www.datadoghq.com/) 创建 Datadog 帐户。

2. 从 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 获取您的 API 密钥。

3. 提供您的 API 密钥 —— 既可以作为 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 函数的参数提供，也可以通过环境变量提供：
```bash
export DD_API_KEY="<your-api-key>"
```
4. （可选）要使用 US1 (`datadoghq.com`) 以外的 Datadog 地区，请将站点作为参数传递给 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)，或设置环境变量：
```bash
export DD_SITE="datadoghq.eu"
```
支持的站点：

| 站点 | 地区 |
|------|--------|
| `datadoghq.com` | US1（默认） |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1（日本） |

<!--- KNIT example-datadog-exporter-01.txt -->

## 配置

要启用 Datadog 导出，请安装 **OpenTelemetry 功能**并调用 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)。

### 基础示例

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
    <!--- KNIT example-datadog-exporter-01.kt -->

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
    <!--- KNIT exampleDatadogExporterJava01.java -->

## 跟踪属性

当 Koog 将 agent 活动发送到 Datadog 时，它以一系列 *span*（跨度）的形式发送 —— 即单个工作的记录，例如一次 LLM 调用或工具执行。相关的 span 被分组到一个 *trace*（跟踪）中，它代表了从开始到结束的完整 agent 运行。

[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 接受 `traceAttributes` 参数 —— 这是一个描述发送跟踪的应用程序的键值对映射。这些属性会被附加到每个 span，从而方便在 Datadog 中按环境或版本等属性对跟踪进行过滤和分组。

常用的属性包括：

- **env**：环境名称（例如 `production`、`staging` 或 `development`）
- **service.name**：您的服务或应用程序的名称
- **version**：应用程序版本，用于比较不同部署之间的行为

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
    <!--- KNIT example-datadog-exporter-02.kt -->

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
    <!--- KNIT exampleDatadogExporterJava02.java -->

## 自定义导出器包装

当您需要直接访问导出器对象，以便在注册之前使用额外的处理逻辑对其进行包装时，请使用 [`buildDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.buildDatadogExporter)。
例如，使用 `SpanExporter.composite()` 同时将跟踪发送到多个后端：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.buildDatadogExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import io.opentelemetry.sdk.trace.export.SpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
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
        val datadogExporter = buildDatadogExporter()
        val localExporter = OtlpHttpSpanExporter.builder()
            .setEndpoint("http://localhost:4318/v1/traces")
            .build()
        addSpanExporter(SpanExporter.composite(datadogExporter, localExporter))
    }
    ```
    <!--- KNIT example-datadog-exporter-03.kt -->

## 跟踪哪些内容

Datadog 导出器捕获与 Koog 的通用 OpenTelemetry 集成相同的活动。
有关捕获的 span 完整列表以及如何包含 LLM 提示词和响应内容的详细信息，请参阅[跟踪哪些内容](index.md#what-gets-traced)。

有关 Datadog 的 OpenTelemetry 支持的更多详细信息，请参阅 [Datadog OTLP API 接收](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)。

---

## 故障排除

- **没有出现跟踪**：确认 `DD_API_KEY` 和 `DD_SITE` 已正确设置（请参阅[设置说明](#setup-instructions)）。
- **身份验证错误**：在 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 中验证您的密钥是否处于激活状态。
- **连接问题**：确认您的环境可以访问 `https://otlp.<DD_SITE>/v1/traces` —— 例如，US1 地区为 `https://otlp.datadoghq.com/v1/traces`。

有关常规故障排除，请参阅[故障排除](index.md#troubleshooting)。