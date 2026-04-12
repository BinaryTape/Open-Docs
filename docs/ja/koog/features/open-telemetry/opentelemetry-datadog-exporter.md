# Datadog エクスポーター

Koogは、専用のLLMオブザーバビリティ（LLM Observability）機能を備えたモニタリングおよび分析プラットフォームである[Datadog](https://www.datadoghq.com/)へのエージェントトレースのエクスポートを組み込みでサポートしています。
Datadogと連携することで、KoogエージェントがLLM、API、およびその他のコンポーネントとどのように相互作用するかを可視化、分析、デバッグできます。

KoogのOpenTelemetryサポートに関する背景については、[OpenTelemetryサポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1) [https://www.datadoghq.com/](https://www.datadoghq.com/) でDatadogアカウントを作成します。

2) [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) からAPIキーを取得します。

3) Datadog APIキーをDatadogエクスポーターに渡します。
これは、`addDatadogExporter()` 関数のパラメータとして渡すか、環境変数を設定することで行えます。

```bash
export DD_API_KEY="<your-api-key>"
```

4) (任意) Datadogサイトを設定します。Datadogは複数のリージョンで運用されています。デフォルトでは、エクスポーターは `datadoghq.com` (US1リージョン) にトレースを送信します。
別のリージョンを使用するには、`DD_SITE` 環境変数を設定するか、`addDatadogExporter()` に `datadogSite` パラメータを渡します。

```bash
export DD_SITE="datadoghq.eu"
```

一般的なサイトの値：

| サイト | リージョン |
|------|--------|
| `datadoghq.com` | US1 (デフォルト) |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1 (日本) |

<!--- KNIT example-datadog-exporter-01.txt -->

## 設定

Datadogへのエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、`DatadogExporter`を追加します。
このエクスポーターは、内部で `OtlpHttpSpanExporter` を使用して、DatadogのOTLPインテークエンドポイントに直接トレースを送信します。

### 例：Datadogトレースを有効にしたエージェント

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

## トレース属性

`addDatadogExporter` 関数は、リソースレベルの属性のマップを受け取る `traceAttributes` パラメータをサポートしています。
これらの属性は、エクスポートされるすべてのスパンに追加され、トレースにアプリケーション固有のメタデータをタグ付けするのに役立ちます。

一般的な属性：
- **env**: 環境名 (例: `production`, `staging`, `development`)
- **service.name**: サービスまたはアプリケーションの名前
- **version**: デプロイを追跡するためのアプリケーションバージョン

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
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava02.java -->

## カスタムエクスポーターのラッピング

登録前にエクスポーターをカスタムデコレーターでラップする必要がある場合は、`buildDatadogExporter()` 関数を使用できます。

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
        val wrapped = MyCustomSpanExporter(exporter) // 例：属性の後処理など
        addSpanExporter(wrapped)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-04.kt -->

## トレースの対象

有効にすると、DatadogエクスポーターはKoogの一般的なOpenTelemetry統合と同じスパンをキャプチャします。これには以下が含まれます。

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLMとのインタラクション**: プロンプト、レスポンス、トークン使用量、レイテンシ
- **ツール呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koogバージョンなどのメタデータ

エクスポーターには、スパンをDatadogのLLMオブザーバビリティ製品にルーティングするために `dd-otlp-source: llmobs` ヘッダーが含まれています。

セキュリティ上の理由から、OpenTelemetryスパンの一部の内容はデフォルトでマスキングされています。
Datadogで内容を利用可能にするには、OpenTelemetry設定で [setVerbose](opentelemetry-support.md#setverbose) メソッドを使用し、次のように `verbose` 引数を `true` に設定してください。

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

DatadogのLLMオブザーバビリティおよびOpenTelemetryサポートの詳細については、以下を参照してください。

- [Datadog LLM Observability ドキュメント](https://docs.datadoghq.com/llm_observability/)
- [Datadog OTLP API Intake](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)

---

## トラブルシューティング

### Datadogにトレースが表示されない
- `DD_API_KEY` が環境変数に設定されているか再確認してください。
- Datadogリージョンに対して正しい `DD_SITE` を使用しているか確認してください（USは `datadoghq.com`、EUは `datadoghq.eu`）。
- APIキーにトレースを送信するために必要な権限があることを確認してください。

### 認証エラー
- `DD_API_KEY` が有効でアクティブであることを確認してください。
- APIキーは [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys) で確認できます。

### 接続の問題
- 環境がDatadog OTLPインテークエンドポイント (`https://otlp.<site>/v1/traces`) へのネットワークアクセス権を持っていることを確認してください。
- アウトバウンド接続をブロックする可能性のあるファイアウォールやプロキシの設定を確認してください。