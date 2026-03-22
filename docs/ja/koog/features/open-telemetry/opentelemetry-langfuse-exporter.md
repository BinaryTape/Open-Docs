# Langfuseエクスポーター

Koogは、AIアプリケーションのオブザーバビリティ（可観測性）と分析のためのプラットフォームである[Langfuse](https://langfuse.com/)へのエージェント・トレースのエクスポートをネイティブにサポートしています。
Langfuseとの統合により、KoogエージェントがLLM、API、その他のコンポーネントとどのように相互作用するかを視覚化、分析、デバッグできます。

KoogのOpenTelemetryサポートに関する背景については、[OpenTelemetryのサポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1. Langfuseプロジェクトを作成します。[Langfuseで新しいプロジェクトを作成する](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)のセットアップガイドに従ってください。
2. API認証情報を取得します。[LangfuseのAPIキーはどこにありますか？](https://langfuse.com/faq/all/where-are-langfuse-api-keys)の説明に従って、Langfuseの `public key` と `secret key` を取得してください。
3. Langfuseのホスト、パブリックキー、シークレットキーをLangfuseエクスポーターに渡します。
   これは、`addLangfuseExporter()` 関数のパラメータとして指定するか、以下のように環境変数を設定することで行えます。

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```
<!--- KNIT example-langfuse-exporter-01.txt -->

## 設定

Langfuseエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、`LangfuseExporter` を追加します。  
このエクスポーターは、内部で `OtlpHttpSpanExporter` を使用して、LangfuseのOpenTelemetryエンドポイントにトレースを送信します。

### 例：Langfuseトレースを伴うエージェント

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
                addLangfuseExporter()
            }
        }
    
        println("Running agent with Langfuse tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on the Langfuse instance")
    }
    ```
    <!--- KNIT example-langfuse-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleLangfuseExporterJava01 {
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
                config.addLangfuseExporter()
            )
            .build();

        System.out.println("Running agent with Langfuse tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on the Langfuse instance");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava01.java -->

## トレース属性

Langfuseは、セッション、環境、タグ、その他のメタデータなどの機能を使用してオブザーバビリティを強化するために、トレースレベルの属性を使用します。
`addLangfuseExporter` 関数は、`CustomAttribute` オブジェクトのリストを受け取る `traceAttributes` パラメータをサポートしています。

これらの属性は、各トレースのルートとなる `InvokeAgentSpan` スパンに追加され、Langfuseのアドバンスド機能を有効にします。Langfuseがサポートする任意の属性を渡すことができます。詳細は、[LangfuseのOpenTelemetryドキュメントにある完全なリスト](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)を参照してください。

一般的な属性：
- **セッション** (`langfuse.session.id`): 関連するトレースをグループ化し、集計メトリクス、コスト分析、スコアリングに使用します。
- **環境**: 開発やステージングから本番環境のトレースを分離し、よりクリーンな分析を可能にします。
- **タグ** (`langfuse.trace.tags`): トレースに機能名、実験ID、または顧客セグメントのラベルを付けます（文字列の配列）。

### セッションとタグを使用した例

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    import java.util.UUID
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val sessionId = UUID.randomUUID().toString()
    
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
            install(OpenTelemetry) {
                addLangfuseExporter(
                    traceAttributes = listOf(
                        CustomAttribute("langfuse.session.id", sessionId),
                        CustomAttribute("langfuse.trace.tags", listOf("chat", "kotlin", "production"))
                    )
                )
            }
        }
    
        println("Running agent with Langfuse tracing")

        // 同じセッションIDでの複数の実行は、Langfuse内でグループ化されます
        agent.run("What is Kotlin?")
        agent.run("Show me a coroutine example")
    }
    ```
    <!--- KNIT example-langfuse-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava02 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var sessionId = UUID.randomUUID().toString();

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .systemPrompt("You are a helpful assistant.")
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .install(OpenTelemetry.Feature, config ->
                config.addLangfuseExporter(
                    null, null, null, null,
                    List.of(
                        new CustomAttribute("langfuse.session.id", sessionId),
                        new CustomAttribute("langfuse.trace.tags", List.of("chat", "kotlin", "production"))
                    )
                ))
            .build();

        System.out.println("Running agent with Langfuse tracing");

        // 同じセッションIDでの複数の実行は、Langfuse内でグループ化されます
        agent.run("How to setup Langfuse integration in Koog agent?");
        agent.run("Show me a Java API  example");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava02.java -->

## トレースされる内容

有効にすると、LangfuseエクスポーターはKoogの一般的なOpenTelemetry統合と同じスパンをキャプチャします。これには以下が含まれます：

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLMとのやり取り**: プロンプト、レスポンス、トークン使用量、レイテンシ
- **ツール呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koogのバージョンなどのメタデータ

Koogは、Langfuseで[エージェント・グラフ](https://langfuse.com/docs/observability/features/agent-graphs)を表示するために必要なスパン属性もキャプチャします。

セキュリティ上の理由から、OpenTelemetryスパンの一部の内容はデフォルトでマスクされています。
Langfuseで内容を表示できるようにするには、OpenTelemetry設定で [setVerbose](opentelemetry-support.md#setverbose) メソッドを使用し、以下のように `verbose` 引数を `true` に設定してください。

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
        addLangfuseExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-langfuse-exporter-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava03 {
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
        config.addLangfuseExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleLangfuseExporterJava03.java -->

Langfuseで視覚化すると、トレースは次のように表示されます：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

Langfuse OpenTelemetryトレースの詳細については、以下を参照してください：  
[Langfuse OpenTelemetry Docs](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint).

---

## トラブルシューティング

### Langfuseにトレースが表示されない
- `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、および `LANGFUSE_SECRET_KEY` が環境変数に設定されているか再確認してください。
- セルフホスト型のLangfuseを実行している場合は、アプリケーション環境から `LANGFUSE_HOST` に到達可能であることを確認してください。
- パブリックキーとシークレットキーのペアが正しいプロジェクトのものであることを確認してください。