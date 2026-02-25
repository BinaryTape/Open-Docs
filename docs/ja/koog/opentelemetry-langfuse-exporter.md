# Langfuse エクスポーター

Koog は、AI アプリケーションのオブザーバビリティ（可観測性）と分析のためのプラットフォームである [Langfuse](https://langfuse.com/) へのエージェントトレースのエクスポートを組み込みでサポートしています。
Langfuse と統合することで、Koog エージェントが LLM、API、その他のコンポーネントとどのようにやり取りするかを可視化、分析、およびデバッグできます。

Koog の OpenTelemetry サポートに関する背景については、[OpenTelemetry サポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1. Langfuse プロジェクトを作成します。[Langfuse で新しいプロジェクトを作成する](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)のセットアップガイドに従ってください。
2. API 認証情報を取得します。[Langfuse API キーはどこにありますか？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) の説明に従って、Langfuse の `public key` と `secret key` を取得してください。
3. Langfuse のホスト、パブリックキー、シークレットキーを Langfuse エクスポーターに渡します。
これは、`addLangfuseExporter()` 関数のパラメータとして渡すか、以下のように環境変数を設定することで行えます。

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 設定

Langfuse へのエクスポートを有効にするには、**OpenTelemetry 機能**をインストールし、`LangfuseExporter` を追加します。
このエクスポーターは、内部で `OtlpHttpSpanExporter` を使用して Langfuse の OpenTelemetry エンドポイントにトレースを送信します。

### 例：Langfuse トレーシングを使用したエージェント

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
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

## トレース属性

Langfuse は、セッション、環境、タグ、その他のメタデータなどの機能を使用してオブザーバビリティを向上させるために、トレースレベルの属性を使用します。
`addLangfuseExporter` 関数は、`CustomAttribute` オブジェクトのリストを受け取る `traceAttributes` パラメータをサポートしています。

これらの属性は、各トレースのルートである `InvokeAgentSpan` スパンに追加され、Langfuse の高度な機能を有効にします。Langfuse がサポートする任意の属性を渡すことができます。詳細は [Langfuse の OpenTelemetry ドキュメントにある完全なリスト](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)を参照してください。

一般的な属性：
- **セッション** (`langfuse.session.id`): 関連するトレースをグループ化し、集計メトリクス、コスト分析、スコアリングに使用します。
- **環境**: 本番環境のトレースを開発やステージングから分離し、よりクリーンな分析を可能にします。
- **タグ** (`langfuse.trace.tags`): 機能名、実験 ID、またはカスタマーセグメントでトレースにラベルを付けます（文字列の配列）。

### セッションとタグを使用した例

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
import java.util.UUID
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    val sessionId = UUID.randomUUID().toString()

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
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

    // 同じセッション ID で複数回実行すると、Langfuse 内でグループ化されます
    agent.run("What is Kotlin?")
    agent.run("Show me a coroutine example")
}
```
<!--- KNIT example-langfuse-exporter-02.kt -->

## トレースされる内容

有効にすると、Langfuse エクスポーターは Koog の一般的な OpenTelemetry 統合と同じスパンをキャプチャします。これには以下が含まれます：

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLM とのやり取り**: プロンプト、レスポンス、トークン使用量、レイテンシ
- **ツール呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koog バージョンなどのメタデータ

また、Koog は [エージェントグラフ (Agent Graphs)](https://langfuse.com/docs/observability/features/agent-graphs) を表示するために Langfuse が必要とするスパン属性もキャプチャします。

セキュリティ上の理由から、OpenTelemetry スパンの一部のコンテンツはデフォルトでマスクされています。
Langfuse でコンテンツを利用可能にするには、OpenTelemetry 設定で [setVerbose](opentelemetry-support.md#setverbose) メソッドを使用し、次のように `verbose` 引数を `true` に設定します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
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
    addLangfuseExporter()
    setVerbose(true)
}
```
<!--- KNIT example-langfuse-exporter-03.kt -->

Langfuse で視覚化すると、トレースは次のように表示されます：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

Langfuse OpenTelemetry トレーシングの詳細については、以下を参照してください：
[Langfuse OpenTelemetry ドキュメント](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)

---

## トラブルシューティング

### Langfuse にトレースが表示されない
- `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、および `LANGFUSE_SECRET_KEY` が環境に設定されているか再確認してください。
- セルフホスト型の Langfuse を使用している場合は、アプリケーション環境から `LANGFUSE_HOST` にアクセスできることを確認してください。
- パブリックキーとシークレットキーのペアが正しいプロジェクトのものであることを確認してください。