# KoogエージェントをOpenTelemetryでLangfuseにトレースする

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

このノートブックは、OpenTelemetryを使用してKoogエージェントのトレースをLangfuseインスタンスにエクスポートする方法を示します。環境変数を設定し、シンプルなエージェントを実行した後、Langfuseでスパンとトレースを検査します。

## 学習内容

- KoogがOpenTelemetryとどのように統合してトレースを生成するか
- 環境変数経由でLangfuseエクスポーターを設定する方法
- エージェントを実行し、そのトレースをLangfuseで表示する方法

## 前提条件

- Langfuseプロジェクト（ホストURL、公開キー、シークレットキー）
- LLMエグゼキューター用のOpenAI APIキー
- シェルに設定されている環境変数：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # or your self-hosted URL
export LANGFUSE_PUBLIC_KEY=pk_...
export LANGFUSE_SECRET_KEY=sk_...
```

```kotlin
%useLatestDescriptors
//%use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * Koogエージェントが[Langfuse](https://langfuse.com/)にトレースする例
 *
 * エージェントのトレースは以下にエクスポートされます。
 * - [OtlpHttpSpanExporter]を使用するLangfuse OTLPエンドポイントインスタンス
 *
 * この例を実行するには：
 *  1. [こちら](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)に記載されているとおり、Langfuseプロジェクトと資格情報をセットアップします
 *  2. [こちら](https://langfuse.com/faq/all/where-are-langfuse-api-keys)に記載されているとおり、Langfuse資格情報を取得します
 *  3. `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY`の環境変数を設定します
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetryドキュメント</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## エージェントとLangfuseエクスポーターを設定する

次のセルでは、次のことを行います。

- OpenAIをLLMエグゼキューターとして使用するAIAgentを作成します
- OpenTelemetry機能をインストールし、Langfuseエクスポーターを追加します
- Langfuseの設定のために環境変数に依存します

内部的には、Koogはエージェントのライフサイクル、LLM呼び出し、およびツール実行（もしあれば）のためにスパンを生成します。Langfuseエクスポーターは、OpenTelemetryエンドポイント経由でそれらのスパンをLangfuseインスタンスに送信します。

```kotlin
import kotlinx.coroutines.runBlocking

println("Langfuseトレースでエージェントを実行中")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "結果: $result
Langfuseインスタンスでトレースを確認してください"
}

```

## エージェントを実行し、トレースを表示する

次のセルを実行して、シンプルなプロンプトをトリガーします。これにより、Langfuseプロジェクトにエクスポートされるスパンが生成されます。

### Langfuseで確認する場所

1. Langfuseダッシュボードを開き、プロジェクトを選択します
2. トレース/スパンビューに移動します
3. このセルを実行した時刻付近の最近のエントリを探します
4. スパンをドリルダウンして以下を確認します。
   - エージェントのライフサイクルイベント
   - LLMリクエスト/レスポンスメタデータ
   - エラー（もしあれば）

### トラブルシューティング

- トレースが表示されない場合：
  - `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY`を再度確認してください
  - ネットワークがLangfuseエンドポイントへのアウトバウンドHTTPSを許可していることを確認してください
  - Langfuseプロジェクトがアクティブであり、キーが正しいプロジェクトに属していることを確認してください
- 認証エラー
  - Langfuseでキーを再生成し、環境変数を更新してください
- OpenAIに関する問題
  - `OPENAI_API_KEY`が設定され、有効であることを確認してください