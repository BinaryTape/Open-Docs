# OpenTelemetry を使用した Koog エージェントの Langfuse へのトレーシング

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

このノートブックでは、OpenTelemetry を使用して Koog エージェントのトレースを Langfuse インスタンスにエクスポートする方法について説明します。環境変数を設定し、シンプルなエージェントを実行して、Langfuse でスパンやトレースを確認します。

## 学習内容

- Koog が OpenTelemetry と連携してトレースを出力する方法
- 環境変数を使用して Langfuse エクスポーターを構成する方法
- エージェントを実行し、Langfuse でそのトレースを表示する方法

## 前提条件

- Langfuse プロジェクト（ホスト URL、パブリックキー、シークレットキー）
- LLM エグゼキューター用の OpenAI API キー
- シェルで設定された環境変数：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # またはセルフホストの URL
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
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * [Langfuse](https://langfuse.com/) への Koog エージェントのトレーシングの例
 *
 * エージェントのトレースは以下にエクスポートされます：
 * - [OtlpHttpSpanExporter] を使用した Langfuse OTLP エンドポイントインスタンス
 *
 * この例を実行するには：
 *  1. [こちら](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)の説明に従って、Langfuse プロジェクトと資格情報を設定します
 *  2. [こちら](https://langfuse.com/faq/all/where-are-langfuse-api-keys)の説明に従って、Langfuse の資格情報を取得します
 *  3. `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、および `LANGFUSE_SECRET_KEY` 環境変数を設定します
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry ドキュメント</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## エージェントと Langfuse エクスポーターの構成

次のセルでは、以下のことを行います：

- OpenAI を LLM エグゼキューターとして使用する AIAgent を作成する
- OpenTelemetry 機能をインストールし、Langfuse エクスポーターを追加する
- Langfuse の構成を環境変数に依存させる

内部では、Koog はエージェントのライフサイクル、LLM 呼び出し、およびツール実行（ある場合）のスパンを出力します。Langfuse エクスポーターは、それらのスパンを OpenTelemetry エンドポイント経由で Langfuse インスタンスに送信します。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Langfuse tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on the Langfuse instance"
}

```

## エージェントの実行とトレースの表示

次のセルを実行して、シンプルなプロンプトをトリガーします。これにより、Langfuse プロジェクトにエクスポートされるスパンが生成されます。

### Langfuse での確認場所

1. Langfuse ダッシュボードを開き、プロジェクトを選択します
2. **Traces/Spans** ビューに移動します
3. このセルを実行した時間付近の最近のエントリを探します
4. スパンを詳細に調査（ドリルダウン）して、以下を確認します：
   - エージェントのライフサイクルイベント
   - LLM のリクエスト/レスポンスのメタデータ
   - エラー（ある場合）

### トラブルシューティング

- トレースが表示されない場合
  - `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY` を再確認してください
  - ネットワークが Langfuse エンドポイントへのアウトバウンド HTTPS を許可していることを確認してください
  - Langfuse プロジェクトがアクティブであり、キーが正しいプロジェクトのものであることを確認してください
- 認証エラー
  - Langfuse でキーを再生成し、環境変数を更新してください
- OpenAI の問題
  - `OPENAI_API_KEY` が設定され、有効であることを確認してください