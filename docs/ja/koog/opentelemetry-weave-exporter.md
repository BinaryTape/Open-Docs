# W&B Weaveエクスポーター

Koogは、AIアプリケーションの可観測性と分析のためのWeights & Biasesが提供する開発者ツールである[W&B Weave](https://wandb.ai/site/weave/)へエージェントのトレースをエクスポートする組み込みのサポートを提供します。
Weave連携により、プロンプト、補完、システムコンテキスト、および実行トレースをキャプチャし、それらをW&Bワークスペースで直接可視化できます。

KoogのOpenTelemetryサポートに関する背景については、[OpenTelemetryサポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1.  [https://wandb.ai](https://wandb.ai)でW&Bアカウントを作成します。
2.  [https://wandb.ai/authorize](https://wandb.ai/authorize)からAPIキーを取得します。
3.  [https://wandb.ai/home](https://wandb.ai/home)でW&Bダッシュボードにアクセスしてエンティティ名を見つけます。個人のアカウントであればユーザー名、チーム/組織名であればチーム/組織名がエンティティ名となります。
4.  プロジェクト名を定義します。事前にプロジェクトを作成する必要はなく、最初のトレースが送信されたときに自動的に作成されます。
5.  Weaveエンティティ、プロジェクト名、APIキーをWeaveエクスポーターに渡します。
    これは、`addWeaveExporter()`関数にパラメーターとして渡すか、または以下に示すように環境変数を設定することで可能です。

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```

## 設定

Weaveエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、`WeaveExporter`を追加します。
エクスポーターは、`OtlpHttpSpanExporter`経由でWeaveのOpenTelemetryエンドポイントを使用します。

### 例: Weaveトレースを使用するエージェント

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
    val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"
    
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
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

## トレースされるもの

有効にすると、WeaveエクスポーターはKoogの一般的なOpenTelemetry連携と同様に、以下のスパンをキャプチャします。

-   **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
-   **LLMのインタラクション**: プロンプト、補完、レイテンシー
-   **ツール呼び出し**: ツール呼び出しの実行トレース
-   **システムコンテキスト**: モデル名、環境、Koogバージョンなどのメタデータ

W&B Weaveで可視化すると、トレースは以下のようになります。
![W&B Weave traces](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave traces](img/opentelemetry-weave-exporter-dark.png#only-dark)

詳細については、公式の[Weave OpenTelemetryドキュメント](https://weave-docs.wandb.ai/guides/tracking/otel/)を参照してください。

---

## トラブルシューティング

### Weaveにトレースが表示されない
-   環境変数に`WEAVE_API_KEY`、`WEAVE_ENTITY`、および`WEAVE_PROJECT_NAME`が設定されていることを確認してください。
-   W&Bアカウントが指定されたエンティティとプロジェクトへのアクセス権を持っていることを確認してください。

### 認証エラー
-   `WEAVE_API_KEY`が有効であることを確認してください。
-   APIキーに、選択されたエンティティのトレースを書き込むための権限があることを確認してください。

### 接続の問題
-   環境がW&BのOpenTelemetry取り込みエンドポイントへのネットワークアクセスを持っていることを確認してください。