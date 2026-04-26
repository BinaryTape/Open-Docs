# Datadog exporter

Koog 使用 [OpenTelemetry](https://opentelemetry.io/) 發出 Agent 追蹤 (trace)，這是一個觀測能力 (observability) 資料的開放標準。
為了將這些追蹤傳送到 [Datadog](https://www.datadoghq.com/)，Koog 內建了 OpenTelemetry exporter — 不需要手動進行檢測 (instrumentation)。

連線後，Datadog 的 [OpenTelemetry 支援](https://docs.datadoghq.com/opentelemetry/) 讓您可以視覺化、分析並偵錯您的 Agent 如何與 LLM、工具及外部 API 進行互動。

---

## Setup instructions

1. 在 [https://www.datadoghq.com/](https://www.datadoghq.com/) 建立 Datadog 帳戶。

2. 從 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 取得您的 API 金鑰 (API key)。

3. 提供您的 API 金鑰 — 可以作為參數傳遞給 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)，或透過環境變數設定：
```bash
export DD_API_KEY="<your-api-key>"
```
4. （選填）若要使用 US1 (`datadoghq.com`) 以外的 Datadog 區域，請將站點 (site) 作為參數傳遞給 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)，或設定環境變數：
```bash
export DD_SITE="datadoghq.eu"
```
支援的站點：

| 站點 | 區域 |
|------|--------|
| `datadoghq.com` | US1（預設） |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1（日本） |

<!--- KNIT example-datadog-exporter-01.txt -->

## Configuration

若要啟用 Datadog 匯出，請安裝 **OpenTelemetry 功能** 並呼叫 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)。

### 基本範例

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

## Trace attributes

當 Koog 將 Agent 活動傳送到 Datadog 時，會以一系列的 *span* 形式傳送 — 這是個別的工作記錄，例如 LLM 呼叫或工具執行。相關的 span 會被分組為一個追蹤 (trace)，代表從開始到結束的完整 Agent 執行過程。

[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 接受一個 `traceAttributes` 參數 — 這是一個描述發出追蹤之應用程式的鍵值對 (key-value pair) Map。這些屬性會附加到每個 span 中，讓您可以輕鬆地在 Datadog 中依據環境或版本等屬性對追蹤進行篩選與分組。

常用的屬性包括：

- **env**：環境名稱（例如：`production`、`staging` 或 `development`）
- **service.name**：您的服務或應用程式名稱
- **version**：應用程式版本，對於比較不同部署之間的行為非常有用

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
    <!--- KNIT exampleDatadogExporterJava02.java -->

## Custom exporter wrapping

當您需要直接存取 exporter 物件，以便在註冊前對其封裝額外的處理邏輯時，請使用 [`buildDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.buildDatadogExporter)。
例如，使用 `SpanExporter.composite()` 同時將追蹤傳送到多個後端：

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

## What gets traced

Datadog exporter 擷取的活動與 Koog 的一般 OpenTelemetry 整合相同。
有關擷取的 span 完整清單，以及如何包含 LLM 提示與回應內容，請參閱 [What gets traced](index.md#what-gets-traced)。

有關 Datadog 的 OpenTelemetry 支援之更多詳細資訊，請參閱 [Datadog OTLP API Intake](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)。

---

## 疑難排解

- **未顯示任何追蹤**：確認 `DD_API_KEY` 與 `DD_SITE` 設定正確（請參閱 [Setup instructions](#setup-instructions)）。
- **驗證錯誤**：在 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 中確認您的金鑰處於啟用狀態。
- **連線問題**：確認您的環境可以連線至 `https://otlp.<DD_SITE>/v1/traces` — 例如，US1 的位址為 `https://otlp.datadoghq.com/v1/traces`。

如需一般疑難排解，請參閱 [疑難排解](index.md#troubleshooting)。