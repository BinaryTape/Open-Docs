# W&B Weave エクスポーター

Koog は、AI アプリケーションのオブザーバビリティ（可観測性）と分析のための Weights & Biases 製開発者ツールである [W&B Weave](https://wandb.ai/site/weave/) への、エージェントトレースのエクスポートを標準でサポートしています。  
Weave 統合を使用することで、プロンプト、コンプリーション（生成結果）、システムコンテキスト、実行トレースをキャプチャし、W&B ワークスペースで直接可視化できます。

Koog の OpenTelemetry サポートに関する背景については、[OpenTelemetry サポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1. [https://wandb.ai](https://wandb.ai) で W&B アカウントを作成します。
2. [https://wandb.ai/authorize](https://wandb.ai/authorize) から API キーを取得します。
3. [https://wandb.ai/home](https://wandb.ai/home) の W&B ダッシュボードにアクセスして、エンティティ名（entity name）を確認します。
   エンティティは通常、個人アカウントの場合はユーザー名、組織の場合はチーム/組織名になります。
4. プロジェクト名を定義します。事前に対象のプロジェクトを作成しておく必要はありません。最初のトレースが送信される際に自動的に作成されます。
5. Weave のエンティティ、プロジェクト名、API キーを Weave エクスポーターに渡します。
   これらは、`addWeaveExporter()` 関数のパラメータとして渡すか、以下のように環境変数として設定することで行えます。

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```
<!--- KNIT example-weave-exporter-01.txt -->

## 設定

Weave へのエクスポートを有効にするには、**OpenTelemetry 機能**をインストールし、`WeaveExporter` を追加します。  
このエクスポーターは、`OtlpHttpSpanExporter` を介して Weave の OpenTelemetry エンドポイントを使用します。

### 例: Weave トレースを有効にしたエージェント

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
        val entity = System.getenv()["WEAVE_ENTITY"] 
            ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
        
        val projectName = System.getenv()["WEAVE_PROJECT_NAME"] 
            ?: "koog-tracing"
        
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addWeaveExporter()
            }
        }
    
        println("Running agent with Weave tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces")
    }
    ```
    <!--- KNIT example-weave-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Optional;
    public class exampleWeaveExporterJava01 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var entity = Optional.ofNullable(System.getenv("WEAVE_ENTITY"))
            .filter(env -> !env.isBlank())
            .orElseThrow(() -> new IllegalArgumentException("WEAVE_ENTITY is not set"));

        var projectName = Optional.ofNullable(System.getenv("WEAVE_PROJECT_NAME"))
            .filter(env -> !env.isBlank())
            .orElse("koog-tracing");

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a helpful assistant.")
            .install(OpenTelemetry.Feature, config ->
                config.addWeaveExporter(null, entity, projectName)
            )
            .build();

        System.out.println("Running agent with Weave tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on https://wandb.ai/" + entity + "/" + projectName + "/weave/traces");
    }
    ```
    <!--- KNIT exampleWeaveExporterJava01.java -->

## トレースされる内容

有効にすると、Weave エクスポーターは Koog の一般的な OpenTelemetry 統合と同じスパンをキャプチャします。これには以下が含まれます：

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLM とのやり取り**: プロンプト、コンプリーション、レイテンシ
- **ツール呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koog のバージョンなどのメタデータ

セキュリティ上の理由により、OpenTelemetry スパンの一部の内容はデフォルトでマスク（非表示に）されます。
Weave でこれらの内容を表示できるようにするには、OpenTelemetry 設定で [setVerbose](opentelemetry-support.md#setverbose) メソッドを使用し、次のように `verbose` 引数を `true` に設定します：

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
        addWeaveExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-weave-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleWeaveExporterJava02 {
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
        config.addWeaveExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleWeaveExporterJava02.java -->

W&B Weave で可視化すると、トレースは次のように表示されます：
![W&B Weave traces](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave traces](img/opentelemetry-weave-exporter-dark.png#only-dark)

詳細については、公式の [Weave OpenTelemetry ドキュメント](https://weave-docs.wandb.ai/guides/tracking/otel/)を参照してください。

---

## トラブルシューティング

### Weave にトレースが表示されない
- `WEAVE_API_KEY`、`WEAVE_ENTITY`、および `WEAVE_PROJECT_NAME` が環境変数に設定されているか確認してください。
- W&B アカウントが、指定されたエンティティおよびプロジェクトへのアクセス権を持っていることを確認してください。

### 認証エラー
- `WEAVE_API_KEY` が有効であることを確認してください。
- API キーには、選択したエンティティに対してトレースを書き込む権限が必要です。

### 接続の問題
- お使いの環境から W&B の OpenTelemetry 受信エンドポイントへのネットワークアクセスが可能であることを確認してください。