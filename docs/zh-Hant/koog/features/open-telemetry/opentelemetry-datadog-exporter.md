# Datadog 匯出器 (exporter)

Koog 使用 [OpenTelemetry](https://opentelemetry.io/) 發出 Agent 追蹤 (trace)，這是一個觀測能力 (observability) 資料的開放標準。
為了將這些追蹤傳送到 [Datadog](https://www.datadoghq.com/)，Koog 內建了 OpenTelemetry 匯出器 — 不需要手動進行檢測 (instrumentation)。

連線後，Datadog 的 [OpenTelemetry 支援](https://docs.datadoghq.com/opentelemetry/) 讓您可以視覺化、分析並偵錯您的 Agent 如何與 LLM、工具及外部 API 進行互動。

---

## 設定說明

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

## 配置

若要啟用 Datadog 匯出，請安裝 **OpenTelemetry 功能** 並呼叫 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)。

### 基本範例

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
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
    import ai.koog.agents.features.opentelemetry.integration.datadog.DatadogKt;
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
                DatadogKt.addDatadogExporter(config)
            )
            .build();

        System.out.println("Running agent with Datadog tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces in Datadog LLM Observability");
    }
    ```
    <!--- KNIT exampleDatadogExporterJava01.java -->

## 追蹤屬性

當 Koog 將 Agent 活動傳送到 Datadog 時，會以一系列的 *span* 形式傳送 — 這是個別的工作記錄，例如 LLM 呼叫或工具執行。相關的 span 會被分組為一個 *trace* (追蹤)，代表從開始到結束的完整 Agent 執行過程。

[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 接受一個 `resourceAttributes` 參數 — 這是一個描述發出追蹤之應用程式的鍵值對 (key-value pair) Map。這些屬性會附加到每個 span 中，讓您可以輕鬆地在 Datadog 中依據環境或版本等屬性對追蹤進行篩選與分組。

常用的屬性包括：

- **env**：環境名稱（例如：`production`、`staging` 或 `development`）
- **service.name**：您的服務或應用程式名稱
- **version**：應用程式版本，對於比較不同部署之間的行為非常有用

### 具有追蹤屬性的範例

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
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
                    url = "datadoghq.eu",  // 使用 EU 區域
                    resourceAttributes = mapOf(
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
    import ai.koog.agents.features.opentelemetry.integration.datadog.DatadogKt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
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
                DatadogKt.addDatadogExporter(
                    config,
                    null,                            // datadogApiKey: 使用 DD_API_KEY 環境變數
                    "datadoghq.eu"                   // url: 使用 EU 區域
                ))
            .build();

        System.out.println("Running agent with Datadog tracing");

        agent.run("What is Kotlin?");
    }
    ```
    <!--- KNIT exampleDatadogExporterJava02.java -->

    !!! note
        目前不支援從 Java 設定 `resourceAttributes`，因為底層的 Kotlin 函式帶有一個 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 參數（一個值類別），這會導致所有多載（包括其後的參數）發生 JVM 名稱重整 (mangling)。需要 `resourceAttributes` 時，請使用上述的 Kotlin 範例。

## 傳送至多個後端

若要同時將追蹤傳送到 Datadog 和另一個後端，請透過 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 註冊 Datadog，並透過 [`addSpanExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.feature.OpenTelemetryConfig.addSpanExporter) 新增第二個匯出器。
每次呼叫都會註冊一個獨立的批次 span 處理器，因此這兩個後端會並行導出：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
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
        addDatadogExporter()
        addSpanExporter(
            OtlpHttpSpanExporter.builder()
                .setEndpoint("http://localhost:4318/v1/traces")
                .build()
        )
    }
    ```
    <!--- KNIT example-datadog-exporter-03.kt -->

## 擷取哪些內容

Datadog 匯出器擷取的活動與 Koog 的一般 OpenTelemetry 整合相同。
有關擷取的 span 完整清單，以及如何包含 LLM 提示與回應內容，請參閱 [擷取哪些內容](index.md#what-gets-traced)。

有關 Datadog 的 OpenTelemetry 支援之更多詳細資訊，請參閱 [Datadog OTLP API Intake](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)。

---

## 疑難排解

- **未顯示任何追蹤**：確認 `DD_API_KEY` 與 `DD_SITE` 設定正確（請參閱 [設定說明](#setup-instructions)）。
- **驗證錯誤**：在 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) 中確認您的金鑰處於啟用狀態。
- **連線問題**：確認您的環境可以連線至 `https://otlp.<DD_SITE>/v1/traces` — 例如，US1 的位址為 `https://otlp.datadoghq.com/v1/traces`。

如需一般疑難排解，請參閱 [疑難排解](index.md#troubleshooting)。