# Langfuseエクスポーター

Koogは、AIアプリケーションの可観測性と分析のためのプラットフォームである[Langfuse](https://langfuse.com/)へのエージェントのトレースのエクスポートを組み込みでサポートしています。
Langfuse連携により、KoogエージェントがLLM、API、その他のコンポーネントとどのように連携するかを可視化、分析、デバッグできます。

KoogのOpenTelemetryサポートに関する背景情報については、[OpenTelemetryサポート](https://docs.koog.ai/opentelemetry-support/)を参照してください。

---

## セットアップ手順

1.  Langfuseプロジェクトを作成します。[Create new project in Langfuse](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)のセットアップガイドに従ってください。
2.  API認証情報を取得します。[Where are Langfuse API keys?](https://langfuse.com/faq/all/where-are-langfuse-api-keys)で説明されているように、Langfuseの`public key`と`secret key`を取得します。
3.  Langfuseホスト、公開キー、およびシークレットキーをLangfuseエクスポーターに渡します。
    これは、`addLangfuseExporter()`関数のパラメーターとして提供するか、または以下に示すように環境変数を設定することで行えます。

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 設定

Langfuseエクスポートを有効にするには、**OpenTelemetry機能**をインストールし、`LangfuseExporter`を追加します。
エクスポーターは内部で`OtlpHttpSpanExporter`を使用して、LangfuseのOpenTelemetryエンドポイントにトレースを送信します。

### 例: Langfuseトレースを持つエージェント

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
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
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

Langfuseは、セッション、環境、タグ、その他のメタデータなどの機能で可観測性を向上させるために、トレースレベルの属性を使用します。
`addLangfuseExporter`関数は、`CustomAttribute`オブジェクトのリストを受け入れる`traceAttributes`パラメーターをサポートしています。

これらの属性は、各トレースのルート`InvokeAgentSpan`スパンに追加され、Langfuseの高度な機能を有効にします。Langfuseがサポートする任意の属性を渡すことができます。詳細については、[LangfuseのOpenTelemetryドキュメントで完全なリスト](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)を参照してください。

一般的な属性:
-   **セッション** (`langfuse.session.id`): 関連するトレースをグループ化して、集計メトリクス、コスト分析、スコアリングを行います
-   **環境**: 本番トレースを開発およびステージングから分離し、よりクリーンな分析を行います
-   **タグ** (`langfuse.trace.tags`): トレースに機能名、実験ID、または顧客セグメントをラベル付けします（文字列の配列）

### セッションとタグの例

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
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
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

    // Multiple runs with the same session ID will be grouped in Langfuse
    agent.run("What is Kotlin?")
    agent.run("Show me a coroutine example")
}
```
<!--- KNIT example-langfuse-exporter-02.kt -->

## 何がトレースされるか

有効にすると、Langfuseエクスポーターは、Koogの一般的なOpenTelemetry連携と同じスパンをキャプチャします。以下を含みます:

-   **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
-   **LLMインタラクション**: プロンプト、レスポンス、トークン使用量、レイテンシー
-   **ツール呼び出し**: ツール呼び出しの実行トレース
-   **システムコンテキスト**: モデル名、環境、Koogバージョンなどのメタデータ

Koogは、Langfuseが[エージェントグラフ](https://langfuse.com/docs/observability/features/agent-graphs)を表示するのに必要なスパン属性もキャプチャします。

セキュリティ上の理由により、OpenTelemetryスパンの一部コンテンツはデフォルトでマスクされています。
Langfuseでコンテンツを利用可能にするには、OpenTelemetry構成で[setVerbose](opentelemetry-support.md#setverbose)メソッドを使用し、その`verbose`引数を以下のように`true`に設定します。

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

Langfuseで視覚化されると、トレースは次のようになります:
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/optelemettry-langfuse-exporter-dark.png#only-dark)

Langfuse OpenTelemetryトレースの詳細については、以下を参照してください:
[Langfuse OpenTelemetry Docs](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint).

---

## トラブルシューティング

### Langfuseにトレースが表示されない
-   `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY`、および`LANGFUSE_SECRET_KEY`が環境に設定されていることを再確認してください。
-   セルフホスト型Langfuseで実行している場合は、`LANGFUSE_HOST`がアプリケーション環境から到達可能であることを確認してください。
-   公開/シークレットキーペアが正しいプロジェクトに属していることを確認してください。