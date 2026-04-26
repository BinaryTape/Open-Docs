# Datadog エクスポーター

Koogは、オブザーバビリティデータのオープン標準である[OpenTelemetry](https://opentelemetry.io/)を使用して、エージェントトレースを出力します。
これらのトレースを[Datadog](https://www.datadoghq.com/)に送信するために、Koogには組み込みのOpenTelemetryエクスポーターが含まれており、手動での計装（instrumentation）は不要です。

接続されると、Datadogの[OpenTelemetryサポート](https://docs.datadoghq.com/opentelemetry/)により、エージェントがLLM、ツール、および外部APIとどのように相互作用するかを可視化、分析、およびデバッグできるようになります。

---

## セットアップ手順

1. [https://www.datadoghq.com/](https://www.datadoghq.com/) でDatadogアカウントを作成します。

2. [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) からAPIキーを取得します。

3. APIキーを提供します。[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) のパラメータとして渡すか、環境変数を介して行います。
```bash
export DD_API_KEY="<your-api-key>"
```
4. (任意) US1 (`datadoghq.com`) 以外のDatadogリージョンを使用するには、サイトを [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) のパラメータとして渡すか、環境変数を設定します。
```bash
export DD_SITE="datadoghq.eu"
```
サポートされているサイト：

| サイト | リージョン |
|------|--------|
| `datadoghq.com` | US1 (デフォルト) |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1 (日本) |

<!--- KNIT example-datadog-exporter-01.txt -->

## 設定

Datadogへのエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) を呼び出します。

### 基本的な例

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

## トレース属性

KoogがエージェントのアクティビティをDatadogに送信する際、それは一連の「スパン（span）」として行われます。スパンは、LLMの呼び出しやツールの実行といった個々の作業記録です。関連するスパンは「トレース（trace）」にグループ化され、これは開始から終了までの完全なエージェントの実行を表します。

[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) は `traceAttributes` パラメータを受け取ります。これはトレースを出力するアプリケーションを記述するキーと値のペアのマップです。これらはすべてのスパンに付与されるため、Datadog上で環境やバージョンなどのプロパティによってトレースを簡単にフィルタリングしたりグループ化したりできるようになります。

含めるべき一般的な属性：

- **env**: 環境名 (例: `production`, `staging`, `development`)
- **service.name**: サービスまたはアプリケーションの名前
- **version**: アプリケーションのバージョン。デプロイをまたいだ動作の比較に役立ちます。

### トレース属性を使用した例

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
                    datadogSite = "datadoghq.eu",  // EUリージョンを使用
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
                    null,                           // DD_API_KEY環境変数を使用
                    "datadoghq.eu",                 // EUリージョンを使用
                    null,                           // デフォルトのタイムアウト
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

## カスタムエクスポーターのラッピング

エクスポーターを登録する前に追加の処理ロジックでラップするために、エクスポーターオブジェクトに直接アクセスする必要がある場合は、[`buildDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.buildDatadogExporter) を使用します。
例えば、`SpanExporter.composite()` を使用して、トレースを複数のバックエンドに同時に送信できます。

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

## トレースの対象

Datadogエクスポーターは、Koogの一般的なOpenTelemetry統合と同じアクティビティをキャプチャします。
キャプチャされるスパンの全リスト、およびLLMのプロンプトとレスポンスの内容を含める方法については、[トレースの対象](index.md#what-gets-traced)を参照してください。

DatadogのOpenTelemetryサポートの詳細については、[Datadog OTLP API Intake](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)を参照してください。

---

## トラブルシューティング

- **トレースが表示されない**: `DD_API_KEY` と `DD_SITE` が正しく設定されていることを確認してください（[セットアップ手順](#setup-instructions)を参照）。
- **認証エラー**: [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) で、キーがアクティブであることを確認してください。
- **接続の問題**: 環境が `https://otlp.<DD_SITE>/v1/traces` に到達できることを確認してください。例えば、US1の場合は `https://otlp.datadoghq.com/v1/traces` です。

全般的なトラブルシューティングについては、[トラブルシューティング](index.md#troubleshooting)を参照してください。