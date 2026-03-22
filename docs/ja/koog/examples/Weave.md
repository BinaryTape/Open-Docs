# Koog エージェントの Weave トレーシング

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

このノートブックでは、OpenTelemetry (OTLP) を使用して Koog エージェントを W&B Weave でトレースする方法を説明します。
シンプルな Koog `AIAgent` を作成し、Weave エクスポーターを有効にしてプロンプトを実行し、Weave UI で詳細なトレースを確認します。

背景知識については、Weave OpenTelemetry のドキュメントを参照してください: https://weave-docs.wandb.ai/guides/tracking/otel/

## 前提条件

サンプルを実行する前に、以下が準備されていることを確認してください。

- Weave/W&B アカウント: https://wandb.ai
- https://wandb.ai/authorize から取得した API キー。環境変数 `WEAVE_API_KEY` として設定されていること。
- Weave エンティティ（チームまたはユーザー）名。`WEAVE_ENTITY` として設定されていること。
  - W&B ダッシュボード（https://wandb.ai/home）の左サイドバー「Teams」で確認できます。
- プロジェクト名。`WEAVE_PROJECT_NAME` として設定されていること（設定されていない場合、このサンプルでは `koog-tracing` が使用されます）。
- Koog エージェントを実行するための OpenAI API キー。`OPENAI_API_KEY` として設定されていること。

設定例 (macOS/Linux):
```bash
export WEAVE_API_KEY=...  # Weave で必須
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## ノートブックのセットアップ

最新の Kotlin Jupyter ディスクリプタを使用します。Koog が `%use` プラグインとして事前設定されている場合は、以下の行のコメントアウトを解除してください。

```kotlin
%useLatestDescriptors
//%use koog

```

## エージェントの作成と Weave トレーシングの有効化

最小限の `AIAgent` を構築し、Weave エクスポーターを使用して `OpenTelemetry` フィーチャー (feature) をインストールします。
エクスポーターは、環境設定を使用して OTLP スパンを Weave に送信します：
- `WEAVE_API_KEY` — Weave への認証
- `WEAVE_ENTITY` — どのチーム/ユーザーがトレースを所有するか
- `WEAVE_PROJECT_NAME` — トレースを保存する Weave プロジェクト名

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"

val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
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

## エージェントの実行と Weave でのトレース確認

シンプルなプロンプトを実行します。完了後、出力されたリンクを開いて Weave でトレースを確認してください。
エージェントの実行、モデルの呼び出し、およびその他のインストルメント（計測）された操作のスパンが表示されます。

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

- トレースが表示されない場合は、環境変数 `WEAVE_API_KEY`、`WEAVE_ENTITY`、`WEAVE_PROJECT_NAME` が正しく設定されているか確認してください。
- ネットワークが Weave の OTLP エンドポイントへのアウトバウンド HTTPS 通信を許可していることを確認してください。
- OpenAI キーが有効であり、選択したモデルがアカウントからアクセス可能であることを確認してください。