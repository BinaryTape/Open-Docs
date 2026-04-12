# Datadog exporter

Koog 內建支援將 Agent 追蹤 (trace) 匯出至 [Datadog](https://www.datadoghq.com/)，這是一個具有專屬 LLM 觀測能力 (LLM Observability) 的監控與分析平台。
透過 Datadog 整合，您可以視覺化、分析並偵錯您的 Koog Agent 如何與 LLM、API 及其他組件進行互動。

有關 Koog 的 OpenTelemetry 支援背景資訊，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

## Setup instructions

1) 在 [https://www.datadoghq.com/](https://www.datadoghq.com/) 建立 Datadog 帳戶。

2) 從 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 取得您的 API 金鑰 (API key)。

3) 將 Datadog API 金鑰傳遞給 Datadog exporter。
這可以透過將其作為參數提供給 `addDatadogExporter()` 函式，或透過設定環境變數來完成：

```bash
export DD_API_KEY="<your-api-key>"
```

4) （選填）配置 Datadog 站點 (site)。Datadog 在多個區域運作。預設情況下，exporter 會將追蹤傳送至 `datadoghq.com`（US1 區域）。
若要使用不同的區域，請設定 `DD_SITE` 環境變數或將 `datadogSite` 參數傳遞給 `addDatadogExporter()`：

```bash
export DD_SITE="datadoghq.eu"
```

常見的站點值：

| 站點 | 區域 |
|------|--------|
| `datadoghq.com` | US1（預設） |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1（日本） |

<!--- KNIT example-datadog-exporter-01.txt -->

## Configuration

若要啟用 Datadog 匯出，請安裝 **OpenTelemetry 功能** 並新增 `DatadogExporter`。
該 exporter 在底層使用 `OtlpHttpSpanExporter` 將追蹤直接傳送至 Datadog 的 OTLP 接收端點 (intake endpoint)。

### 範例：具有 Datadog 追蹤功能的 Agent

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

## Trace attributes

`addDatadogExporter` 函式支援 `traceAttributes` 參數，該參數接受資源層級 (resource-level) 屬性的 Map。
這些屬性會被新增到所有匯出的 span 中，對於使用應用程式特定元資料 (metadata) 標記追蹤非常有用。

常用屬性：
- **env**: 環境名稱（例如：`production`、`staging`、`development`）
- **service.name**: 您的服務或應用程式名稱
- **version**: 用於追蹤部署的應用程式版本

### 具有追蹤屬性的範例

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
                    datadogSite = "datadoghq.eu",  // 使用 EU 區域
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
                    null,                           // 使用 DD_API_KEY 環境變數
                    "datadoghq.eu",                 // 使用 EU 區域
                    null,                           // 預設逾時
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

## Custom exporter wrapping

如果您需要在註冊 exporter 之前使用自訂裝飾器 (decorator) 將其封裝，可以使用 `buildDatadogExporter()` 函式：

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
        val wrapped = MyCustomSpanExporter(exporter) // 例如：屬性後處理
        addSpanExporter(wrapped)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-04.kt -->

## What gets traced

啟用後，Datadog exporter 會擷取與 Koog 一般 OpenTelemetry 整合相同的 span，包括：

- **Agent 生命週期事件**：Agent 啟動、停止、錯誤
- **LLM 互動**：提示 (prompt)、回應、Token 使用量、延遲
- **工具呼叫**：工具調用的執行追蹤
- **系統上下文**：元資料 (metadata)，例如模型名稱、環境、Koog 版本

該 exporter 包含 `dd-otlp-source: llmobs` 標頭，用於將 span 路由至 Datadog 的 LLM 觀測能力 (LLM Observability) 產品。

出於安全原因，OpenTelemetry span 的部分內容預設會被遮罩。
若要使內容在 Datadog 中可用，請在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，並將其 `verbose` 引數設置為 `true`，如下所示：

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

有關 Datadog 的 LLM 觀測能力與 OpenTelemetry 支援的更多詳細資訊，請參閱：

- [Datadog LLM Observability 文件](https://docs.datadoghq.com/llm_observability/)
- [Datadog OTLP API Intake](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)

---

## 疑難排解

### Datadog 中未顯示任何追蹤
- 再次確認環境中已設定 `DD_API_KEY`。
- 驗證您是否針對您的 Datadog 區域使用了正確的 `DD_SITE`（US 使用 `datadoghq.com`，EU 使用 `datadoghq.eu`）。
- 確保您的 API 金鑰具有傳送追蹤所需的權限。

### 驗證錯誤
- 檢查您的 `DD_API_KEY` 是否有效且處於啟用狀態。
- API 金鑰可以在 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 中進行驗證。

### 連線問題
- 確保您的環境具有存取 Datadog OTLP 接收端點 (`https://otlp.<site>/v1/traces`) 的網路存取權限。
- 檢查是否有任何可能封鎖對外連線的防火牆或代理設定。