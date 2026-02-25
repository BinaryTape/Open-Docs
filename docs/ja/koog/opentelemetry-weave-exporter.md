# W&B Weave エクスポーター

Koogは、AIアプリケーションのオブザーバビリティ（可観測性）と分析のためのWeights & Biasesの開発者ツールである[W&B Weave](https://wandb.ai/site/weave/)へのエージェントトレースのエクスポートをネイティブにサポートしています。
Weaveとの統合により、プロンプト、完了（completion）、システムコンテキスト、実行トレースをキャプチャし、W&Bワークスペースで直接可視化できます。

KoogのOpenTelemetryサポートの背景については、[OpenTelemetryサポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1. [https://wandb.ai](https://wandb.ai) でW&Bアカウントを作成します。
2. [https://wandb.ai/authorize](https://wandb.ai/authorize) からAPIキーを取得します。
3. [https://wandb.ai/home](https://wandb.ai/home) のW&Bダッシュボードにアクセスして、エンティティ名（entity name）を確認します。
   エンティティは通常、個人アカウントの場合はユーザー名、またはチーム/組織名です。
4. プロジェクト名を定義します。プロジェクトを事前に作成しておく必要はありません。最初のトレースが送信されたときに自動的に作成されます。
5. Weaveのエンティティ、プロジェクト名、およびAPIキーをWeaveエクスポーターに渡します。
   これは、`addWeaveExporter()` 関数のパラメータとして指定するか、以下のように環境変数を設定することで行えます。

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```

## 設定

Weaveへのエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、`WeaveExporter`を追加します。
エクスポーターは、`OtlpHttpSpanExporter`を介してWeaveのOpenTelemetryエンドポイントを使用します。

### 例：Weaveトレースを使用したエージェント

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
        promptExecutor = simpleOpenAIExecutor(apiKey),
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

## トレースされる内容

有効にすると、WeaveエクスポーターはKoogの一般的なOpenTelemetry統合と同じスパンをキャプチャします。これには以下が含まれます：

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLMインタラクション**: プロンプト、完了（completion）、レイテンシ
- **ツール呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koogのバージョンなどのメタデータ

セキュリティ上の理由から、OpenTelemetryスパンの一部はデフォルトでマスクされています。
Weaveでコンテンツを利用可能にするには、OpenTelemetry設定で[setVerbose](opentelemetry-support.md#setverbose)メソッドを使用し、以下のように `verbose` 引数を `true` に設定します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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

W&B Weaveで可視化すると、トレースは次のように表示されます：
![W&B Weave traces](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave traces](img/opentelemetry-weave-exporter-dark.png#only-dark)

詳細については、公式の[Weave OpenTelemetry ドキュメント](https://weave-docs.wandb.ai/guides/tracking/otel/)を参照してください。

---

## トラブルシューティング

### Weaveにトレースが表示されない
- `WEAVE_API_KEY`、`WEAVE_ENTITY`、および `WEAVE_PROJECT_NAME` が環境変数に設定されていることを確認してください。
- W&Bアカウントが、指定したエンティティおよびプロジェクトへのアクセス権を持っていることを確認してください。

### 認証エラー
- `WEAVE_API_KEY` が有効であることを確認してください。
- APIキーには、選択したエンティティに対してトレースを書き込む権限が必要です。

### 接続の問題
- 使用している環境からW&BのOpenTelemetry取り込みエンドポイントへのネットワークアクセスがあることを確認してください。