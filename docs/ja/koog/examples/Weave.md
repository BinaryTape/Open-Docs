# KoogエージェントのためのWeaveトレース

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

このノートブックでは、OpenTelemetry (OTLP) を使用してKoogエージェントをW&B Weaveにトレースする方法を示します。シンプルなKoog `AIAgent` を作成し、Weaveエクスポーターを有効にしてプロンプトを実行し、Weave UIで詳細なトレースを表示します。

背景情報については、Weave OpenTelemetryドキュメントを参照してください: https://weave-docs.wandb.ai/guides/tracking/otel/

## 前提条件

この例を実行する前に、以下があることを確認してください。

- Weave/W&Bアカウント: https://wandb.ai
- https://wandb.ai/authorize から取得したAPIキーが環境変数 `WEAVE_API_KEY` として公開されていること
- Weaveエンティティ（チームまたはユーザー）名が `WEAVE_ENTITY` として公開されていること
  - W&Bダッシュボード: https://wandb.ai/home で確認できます（左サイドバーの「Teams」）
- プロジェクト名が `WEAVE_PROJECT_NAME` として公開されていること（設定されていない場合、この例では `koog-tracing` を使用します）
- Koogエージェントを実行するためのOpenAI APIキーが `OPENAI_API_KEY` として公開されていること

例 (macOS/Linux):
```bash
export WEAVE_API_KEY=...  # required by Weave
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## ノートブックのセットアップ

最新のKotlin Jupyterディスクリプターを使用します。Koogが `%use` プラグインとして事前設定されている場合、以下の行のコメントを解除できます。

```kotlin
%useLatestDescriptors
//%use koog

```

## エージェントを作成してWeaveトレースを有効にする

最小限の `AIAgent` を構築し、Weaveエクスポーターとともに `OpenTelemetry` 機能をインストールします。このエクスポーターは、環境設定を使用してOTLPスパンをWeaveに送信します。

- `WEAVE_API_KEY` — Weaveへの認証
- `WEAVE_ENTITY` — トレースを所有するチーム/ユーザー
- `WEAVE_PROJECT_NAME` — トレースを保存するWeaveプロジェクト

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"

val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addWeaveExporter(
            weaveEntity = entity,
            weaveProjectName = projectName
        )
    }
}
```

## エージェントを実行し、Weaveでトレースを表示する

シンプルなプロンプトを実行します。完了後、表示されたリンクを開いてWeaveでトレースを確認します。エージェントの実行、モデルの呼び出し、およびその他の計測された操作のスパンが表示されるはずです。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Weave tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces"
}
```

## トラブルシューティング

- トレースが表示されない場合は、`WEAVE_API_KEY`、`WEAVE_ENTITY`、および `WEAVE_PROJECT_NAME` が環境に設定されていることを確認してください。
- ネットワークがWeaveのOTLPエンドポイントへのアウトバウンドHTTPSを許可していることを確認してください。
- OpenAIキーが有効であり、選択したモデルがアカウントからアクセス可能であることを確認してください。