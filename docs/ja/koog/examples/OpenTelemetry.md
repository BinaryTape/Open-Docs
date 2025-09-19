# KoogでのOpenTelemetry: AIエージェントのトレース

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

このノートブックでは、Koog AIエージェントにOpenTelemetryベースのトレースを追加する方法を示します。以下を行います。
- 迅速なローカルデバッグのために、スパンをコンソールに出力します。
- スパンをOpenTelemetry Collectorにエクスポートし、Jaegerで表示します。

前提条件：
- Docker/Docker Composeがインストールされていること
- 環境変数`OPENAI_API_KEY`にOpenAI APIキーが設定されていること

ノートブックを実行する前に、ローカルのOpenTelemetryスタック（Collector + Jaeger）を起動してください：
```bash
./docker-compose up -d
```
エージェントの実行後、Jaeger UIを開きます：
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
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

```

## OpenTelemetryエクスポーターの設定

次のセルでは、以下を行います。
- Koog AIAgentを作成します
- OpenTelemetry機能をインストールします
- 2つのスパンエクスポーターを追加します：
  - コンソールログ用の`LoggingSpanExporter`
  - http://localhost:4317 (Collector)へのOTLP gRPCエクスポーター

これは、ローカルデバッグ用のコンソールログと、Jaegerでトレースを表示するためのOTLPという、例の説明を反映しています。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // ローカルデバッグ用にコンソールロガーを追加
        addSpanExporter(LoggingSpanExporter.create())

        // OpenTelemetryコレクターにトレースを送信
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## エージェントを実行してJaegerでトレースを表示する

次のセルを実行して簡単なプロンプトをトリガーします。以下が表示されるはずです：
- `LoggingSpanExporter`からのコンソールのスパンログ
- ローカルのOpenTelemetry Collectorにエクスポートされ、http://localhost:16686のJaegerで表示されるトレース

ヒント：セルを実行した後、Jaegerの検索機能を使用して最近のトレースを見つけてください。

```kotlin
import ai.koog.agents.utils.use
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.use { agent ->
        println("OpenTelemetryトレースを使用してエージェントを実行しています...")

        val result = agent.run("Tell me a joke about programming")

        "エージェントの実行が完了しました。結果: '$result'。
Jaeger UI (http://localhost:16686)でトレースを確認してください"
    }
}
```

## クリーンアップとトラブルシューティング

完了したら：

- サービスを停止します：
  ```bash
  docker-compose down
  ```

- Jaegerでトレースが表示されない場合：
  - スタックが実行されていることを確認してください：`./docker-compose up -d`を実行し、起動まで数秒間待ってください。
  - ポートを確認してください：
    - Collector (OTLP gRPC): http://localhost:4317
    - Jaeger UI: http://localhost:16686
  - コンテナログを確認してください：`docker-compose logs --tail=200`
  - ノートブックが実行される環境で、`OPENAI_API_KEY`が設定されていることを確認してください。
  - エクスポーター内のエンドポイントがコレクターと一致していることを確認してください：`http://localhost:4317`。

- 期待されるスパン：
  - Koogエージェントのライフサイクル
  - LLMのリクエスト/レスポンスメタデータ
  - あらゆるツール実行スパン（ツールを追加した場合）

これで、エージェントを反復処理し、トレースパイプラインの変更を観察できます。