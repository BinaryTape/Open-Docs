# Koog と OpenTelemetry: AI エージェントのトレース

[:material-github: GitHub で開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

このノートブックでは、OpenTelemetry ベースのトレースを Koog AI エージェントに追加する方法を解説します。具体的には以下の内容を行います：
- コンソールにスパン（span）を出力して、迅速なローカルデバッグを行う。
- スパンを OpenTelemetry Collector にエクスポートし、Jaeger で表示する。

事前準備：
- Docker/Docker Compose がインストールされていること
- 環境変数 `OPENAI_API_KEY` に OpenAI API キーが設定されていること

ノートブックを実行する前に、ローカルの OpenTelemetry スタック（Collector + Jaeger）を起動します：
```bash
./docker-compose up -d
```
エージェントの実行後、Jaeger UI を開きます：
- http://localhost:16686

後でサービスを停止するには：
```bash
docker-compose down
```

---

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetryConfigJvm.addSpanExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

```

## OpenTelemetry エクスポーターの設定

次のセルでは、以下の操作を行います：
- Koog の `AIAgent` を作成する
- `OpenTelemetry` 機能をインストールする
- 2 つのスパンエクスポーターを追加する：
  - ローカルデバッグ用の `LoggingSpanExporter`（コンソールログ）
  - http://localhost:4317（Collector）へ送信するための OTLP gRPC エクスポーター

これは、ローカルデバッグのためのコンソールログ出力と、Jaeger でトレースを確認するための OTLP 出力という、この例の構成を反映しています。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // ローカルデバッグ用のコンソールロガーを追加
        addSpanExporter(LoggingSpanExporter.create())

        // OpenTelemetry collector にトレースを送信
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## エージェントの実行と Jaeger でのトレース表示

次のセルを実行して、シンプルなプロンプトをトリガーします。以下が表示されるはずです：
- `LoggingSpanExporter` によるコンソールのスパンログ
- ローカルの OpenTelemetry Collector にエクスポートされ、Jaeger（http://localhost:16686）で確認できるトレース

ヒント：セルを実行した後、Jaeger の検索機能を使用して最近のトレースを見つけてください。

```kotlin
import ai.koog.agents.utils.use
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.use { agent ->
        println("Running agent with OpenTelemetry tracing...")

        val result = agent.run("Tell me a joke about programming")

        "Agent run completed with result: '$result'.
Check Jaeger UI at http://localhost:16686 to view traces"
    }
}
```

## クリーンアップとトラブルシューティング

終了時：

- サービスの停止：
  ```bash
  docker-compose down
  ```

- Jaeger にトレースが表示されない場合：
  - スタックが実行されていることを確認してください：`./docker-compose up -d` を実行し、起動まで数秒待ちます。
  - ポートの確認：
    - Collector (OTLP gRPC): http://localhost:4317
    - Jaeger UI: http://localhost:16686
  - コンテナログの確認：`docker-compose logs --tail=200`
  - ノートブックが実行されている環境に `OPENAI_API_KEY` が設定されていることを確認してください。
  - エクスポーターのエンドポイントがコレクターと一致していることを確認してください：`http://localhost:4317`。

- 期待されるスパンの内容：
  - Koog エージェントのライフサイクル
  - LLM のリクエスト/レスポンスのメタデータ
  - ツール実行のスパン（ツールを追加した場合）

これで、エージェントの反復開発を行いながら、トレースパイプラインで変更を観察できるようになりました。