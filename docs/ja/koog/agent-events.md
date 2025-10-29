# エージェントイベント

エージェントイベントは、エージェントのワークフローの一部として発生するアクションまたはインタラクションです。これには以下が含まれます。

- エージェントのライフサイクルイベント
- ストラテジーイベント
- ノード実行イベント
- LLM呼び出しイベント
- LLMストリーミングイベント
- ツール実行イベント

注記：フィーチャーイベントは `agents-core` モジュールで定義されており、`ai.koog.agents.core.feature.model.events` パッケージの下にあります。`agents-features-trace`、`agents-features-event-handler` などのフィーチャーは、これらのイベントを利用して、エージェントの実行中に作成されたメッセージを処理および転送します。

## 事前定義されたイベントタイプ

Koog は、カスタムメッセージプロセッサーで使用できる事前定義されたイベントタイプを提供しており、事前定義されたイベントは、関連するエンティティに応じて、いくつかのカテゴリに分類できます。

- [エージェントイベント](#agent-events)
- [ストラテジーイベント](#strategy-events)
- [ノードイベント](#node-events)
- [LLM呼び出しイベント](#llm-call-events)
- [LLMストリーミングイベント](#llm-streaming-events)
- [ツール実行イベント](#tool-execution-events)

### エージェントイベント

#### AgentStartingEvent

エージェントの実行開始を表します。以下のフィールドが含まれます。

| 名前       | データ型 | 必須 | デフォルト | 説明                                     |
|------------|-----------|----------|---------|------------------------------------------|
| `agentId`  | String    | Yes      |         | AIエージェントの一意の識別子。           |
| `runId`    | String    | Yes      |         | AIエージェント実行の一意の識別子。       |

#### AgentCompletedEvent

エージェントの実行終了を表します。以下のフィールドが含まれます。

| 名前       | データ型 | 必須 | デフォルト | 説明                                                 |
|------------|-----------|----------|---------|------------------------------------------------------|
| `agentId`  | String    | Yes      |         | AIエージェントの一意の識別子。                       |
| `runId`    | String    | Yes      |         | AIエージェント実行の一意の識別子。                   |
| `result`   | String    | Yes      |         | エージェント実行の結果。結果がない場合は `null` になります。 |

#### AgentExecutionFailedEvent

エージェント実行中にエラーが発生したことを表します。以下のフィールドが含まれます。

| 名前      | データ型     | 必須 | デフォルト | 説明                                                                                         |
|-----------|---------------|----------|---------|----------------------------------------------------------------------------------------------|
| `agentId` | String        | Yes      |         | AIエージェントの一意の識別子。                                                               |
| `runId`   | String        | Yes      |         | AIエージェント実行の一意の識別子。                                                           |
| `error`   | AIAgentError  | Yes      |         | エージェント実行中に発生した特定のエラー。詳細については、[AIAgentError](#aiagenterror) を参照してください。 |

#### AgentClosingEvent

エージェントのクローズまたは終了を表します。以下のフィールドが含まれます。

| 名前      | データ型 | 必須 | デフォルト | 説明                                     |
|-----------|-----------|----------|---------|------------------------------------------|
| `agentId` | String    | Yes      |         | AIエージェントの一意の識別子。           |

<a id="aiagenterror"></a>
`AIAgentError` クラスは、エージェント実行中に発生したエラーに関する詳細を提供します。以下のフィールドが含まれます。

| 名前         | データ型 | 必須 | デフォルト | 説明                                                         |
|--------------|-----------|----------|---------|--------------------------------------------------------------|
| `message`    | String    | Yes      |         | 特定のエラーに関する詳細を提供するメッセージ。             |
| `stackTrace` | String    | Yes      |         | 最後に実行されたコードまでのスタックレコードのコレクション。 |
| `cause`      | String    | No       | null    | エラーの原因（利用可能な場合）。                             |

### ストラテジーイベント

#### GraphStrategyStartingEvent

グラフベースのストラテジー実行の開始を表します。以下のフィールドが含まれます。

| 名前            | データ型              | 必須 | デフォルト | 説明                                             |
|-----------------|------------------------|----------|---------|--------------------------------------------------|
| `runId`         | String                 | Yes      |         | ストラテジー実行の一意の識別子。                 |
| `strategyName`  | String                 | Yes      |         | ストラテジーの名前。                             |
| `graph`         | StrategyEventGraph     | Yes      |         | ストラテジーワークフローを表すグラフ構造。       |

#### FunctionalStrategyStartingEvent

機能的ストラテジー実行の開始を表します。以下のフィールドが含まれます。

| 名前            | データ型 | 必須 | デフォルト | 説明                               |
|-----------------|-----------|----------|---------|------------------------------------|
| `runId`         | String    | Yes      |         | ストラテジー実行の一意の識別子。   |
| `strategyName`  | String    | Yes      |         | ストラテジーの名前。               |

#### StrategyCompletedEvent

ストラテジー実行の終了を表します。以下のフィールドが含まれます。

| 名前           | データ型 | 必須 | デフォルト | 説明                                                             |
|----------------|-----------|----------|---------|------------------------------------------------------------------|
| `runId`        | String    | Yes      |         | ストラテジー実行の一意の識別子。                                 |
| `strategyName` | String    | Yes      |         | ストラテジーの名前。                                             |
| `result`       | String    | Yes      |         | 実行の結果。結果がない場合は `null` になります。                 |

### ノードイベント

#### NodeExecutionStartingEvent

ノード実行の開始を表します。以下のフィールドが含まれます。

| 名前       | データ型   | 必須 | デフォルト | 説明                             |
|------------|-------------|----------|---------|----------------------------------|
| `runId`    | String      | Yes      |         | ストラテジー実行の一意の識別子。 |
| `nodeName` | String      | Yes      |         | 実行が開始されたノードの名前。   |
| `input`    | JsonElement | No       | null    | ノードへの入力値。               |

#### NodeExecutionCompletedEvent

ノード実行の終了を表します。以下のフィールドが含まれます。

| 名前       | データ型   | 必須 | デフォルト | 説明                           |
|------------|-------------|----------|---------|--------------------------------|
| `runId`    | String      | Yes      |         | ストラテジー実行の一意の識別子。 |
| `nodeName` | String      | Yes      |         | 実行が終了したノードの名前。   |
| `input`    | JsonElement | No       | null    | ノードへの入力値。             |
| `output`   | JsonElement | No       | null    | ノードによって生成された出力値。 |

#### NodeExecutionFailedEvent

ノード実行中に発生したエラーを表します。以下のフィールドが含まれます。

| 名前       | データ型    | 必須 | デフォルト | 説明                                                                                         |
|------------|---------------|----------|---------|----------------------------------------------------------------------------------------------|
| `runId`    | String        | Yes      |         | ストラテジー実行の一意の識別子。                                                             |
| `nodeName` | String        | Yes      |         | エラーが発生したノードの名前。                                                               |
| `input`    | JsonElement  | No       | null    | ノードに提供された入力データ。                                                               |
| `error`    | AIAgentError  | Yes      |         | ノード実行中に発生した特定のエラー。詳細については、[AIAgentError](#aiagenterror) を参照してください。 |

### LLM呼び出しイベント

#### LLMCallStartingEvent

LLM呼び出しの開始を表します。以下のフィールドが含まれます。

| 名前     | データ型          | 必須 | デフォルト | 説明                                                                     |
|----------|--------------------|----------|---------|--------------------------------------------------------------------------|
| `runId`  | String             | Yes      |         | LLM実行の一意の識別子。                                                  |
| `prompt` | Prompt             | Yes      |         | モデルに送信されるプロンプト。詳細については、[Prompt](#prompt) を参照してください。 |
| `model`  | String             | Yes      |         | `llm_provider:model_id` の形式のモデル識別子。                           |
| `tools`  | List&lt;String&gt;       | Yes      |         | モデルが呼び出すことができるツールのリスト。                             |

<a id="prompt"></a>
`Prompt` クラスは、メッセージのリスト、一意の識別子、および言語モデル設定のオプションパラメータで構成されるプロンプトのデータ構造を表します。以下のフィールドが含まれます。

| 名前       | データ型           | 必須 | デフォルト     | 説明                                                 |
|------------|--------------------|----------|-------------|------------------------------------------------------|
| `messages` | List&lt;Message&gt;       | Yes      |             | プロンプトを構成するメッセージのリスト。             |
| `id`       | String              | Yes      |             | プロンプトの一意の識別子。                           |
| `params`   | LLMParams           | No       | LLMParams() | LLMがコンテンツを生成する方法を制御する設定。        |

#### LLMCallCompletedEvent

LLM呼び出しの終了を表します。以下のフィールドが含まれます。

| 名前                 | データ型                      | 必須 | デフォルト | 説明                                             |
|----------------------|--------------------------------|----------|---------|--------------------------------------------------|
| `runId`              | String                         | Yes      |         | LLM実行の一意の識別子。                          |
| `prompt`             | Prompt                         | Yes      |         | 呼び出しで使用されたプロンプト。                 |
| `model`              | String                         | Yes      |         | `llm_provider:model_id` の形式のモデル識別子。   |
| `responses`          | List&lt;Message.Response&gt;         | Yes      |         | モデルから返された1つまたは複数の応答。          |
| `moderationResponse` | ModerationResult               | No       | null    | モデレーション応答（存在する場合）。             |

### LLMストリーミングイベント

#### LLMStreamingStartingEvent

LLMストリーミング呼び出しの開始を表します。以下のフィールドが含まれます。

| 名前     | データ型    | 必須 | デフォルト | 説明                                     |
|----------|--------------|----------|---------|------------------------------------------|
| `runId`  | String       | Yes      |         | LLM実行の一意の識別子。                  |
| `prompt` | Prompt       | Yes      |         | モデルに送信されるプロンプト。           |
| `model`  | String       | Yes      |         | `llm_provider:model_id` の形式のモデル識別子。 |
| `tools`  | List&lt;String&gt; | Yes      |         | モデルが呼び出すことができるツールのリスト。 |

#### LLMStreamingFrameReceivedEvent

LLMから受信したストリーミングフレームを表します。以下のフィールドが含まれます。

| 名前     | データ型   | 必須 | デフォルト | 説明                               |
|----------|-------------|----------|---------|------------------------------------|
| `runId`  | String      | Yes      |         | LLM実行の一意の識別子。            |
| `frame`  | StreamFrame | Yes      |         | ストリームから受信したフレーム。   |

#### LLMStreamingFailedEvent

LLMストリーミング呼び出し中にエラーが発生したことを表します。以下のフィールドが含まれます。

| 名前    | データ型    | 必須 | デフォルト | 説明                                                                                         |
|---------|---------------|----------|---------|----------------------------------------------------------------------------------------------|
| `runId` | String        | Yes      |         | LLM実行の一意の識別子。                                                                      |
| `error` | AIAgentError  | Yes      |         | ストリーミング中に発生した特定のエラー。詳細については、[AIAgentError](#aiagenterror) を参照してください。 |

#### LLMStreamingCompletedEvent

LLMストリーミング呼び出しの終了を表します。以下のフィールドが含まれます。

| 名前     | データ型    | 必須 | デフォルト | 説明                                     |
|----------|--------------|----------|---------|------------------------------------------|
| `runId`  | String       | Yes      |         | LLM実行の一意の識別子。                  |
| `prompt` | Prompt       | Yes      |         | モデルに送信されるプロンプト。           |
| `model`  | String       | Yes      |         | `llm_provider:model_id` の形式のモデル識別子。 |
| `tools`  | List&lt;String&gt; | Yes      |         | モデルが呼び出すことができるツールのリスト。 |

### ツール実行イベント

#### ToolExecutionStartingEvent

モデルがツールを呼び出すイベントを表します。以下のフィールドが含まれます。

| 名前          | データ型   | 必須 | デフォルト | 説明                                     |
|---------------|-------------|----------|---------|------------------------------------------|
| `runId`       | String      | Yes      |         | ストラテジー/エージェント実行の一意の識別子。 |
| `toolCallId`  | String      | No       | null    | ツール呼び出しの識別子（利用可能な場合）。 |
| `toolName`    | String      | Yes      |         | ツールの名前。                           |
| `toolArgs`    | JsonObject  | Yes      |         | ツールに提供される引数。                 |

#### ToolValidationFailedEvent

ツール呼び出し中に検証エラーが発生したことを表します。以下のフィールドが含まれます。

| 名前          | データ型   | 必須 | デフォルト | 説明                                     |
|---------------|-------------|----------|---------|------------------------------------------|
| `runId`       | String      | Yes      |         | ストラテジー/エージェント実行の一意の識別子。 |
| `toolCallId`  | String      | No       | null    | ツール呼び出しの識別子（利用可能な場合）。 |
| `toolName`    | String      | Yes      |         | 検証に失敗したツールの名前。             |
| `toolArgs`    | JsonObject  | Yes      |         | ツールに提供される引数。                 |
| `error`       | String      | Yes      |         | 検証エラーメッセージ。                   |

#### ToolExecutionFailedEvent

ツールの実行失敗を表します。以下のフィールドが含まれます。

| 名前          | データ型    | 必須 | デフォルト | 説明                                                                                         |
|---------------|---------------|----------|---------|----------------------------------------------------------------------------------------------|
| `runId`       | String        | Yes      |         | ストラテジー/エージェント実行の一意の識別子。                                                |
| `toolCallId`  | String        | No       | null    | ツール呼び出しの識別子（利用可能な場合）。                                                   |
| `toolName`    | String        | Yes      |         | ツールの名前。                                                                               |
| `toolArgs`    | JsonObject    | Yes      |         | ツールに提供される引数。                                                                     |
| `error`       | AIAgentError  | Yes      |         | ツールを呼び出そうとしたときに発生した特定のエラー。詳細については、[AIAgentError](#aiagenterror) を参照してください。 |

#### ToolExecutionCompletedEvent

結果を返してツール呼び出しが成功したことを表します。以下のフィールドが含まれます。

| 名前          | データ型  | 必須 | デフォルト | 説明                             |
|---------------|------------|----------|---------|----------------------------------|
| `runId`       | String     | Yes      |         | 実行の一意の識別子。             |
| `toolCallId`  | String     | No       | null    | ツール呼び出しの識別子。         |
| `toolName`    | String     | Yes      |         | ツールの名前。                   |
| `toolArgs`    | JsonObject | Yes      |         | ツールに提供される引数。         |
| `result`      | String     | Yes      |         | ツール呼び出しの結果（null許容）。 |

## FAQとトラブルシューティング

以下のセクションには、トレース機能に関するよくある質問とその回答が含まれています。

### エージェント実行の特定の箇所のみをトレースするにはどうすればよいですか？

イベントをフィルタリングするには、`messageFilter` プロパティを使用します。たとえば、LLM呼び出しのみをトレースするには、次のようにします。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
            val writer = TraceFeatureMessageFileWriter(
                outputPath,
                { path: Path -> SystemFileSystem.sink(path).buffered() }
            )
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath, 
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )
    addMessageProcessor(fileWriter)
    
    // LLM呼び出しのみをトレース
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-events-01.kt -->

### 複数のメッセージプロセッサーを使用できますか？

はい、複数のメッセージプロセッサーを追加して、異なる宛先に同時にトレースできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"
val syncOpener = { path: Path -> SystemFileSystem.sink(path).buffered() }
val logger = KotlinLogging.logger {}
val connectionConfig = DefaultServerConnectionConfig(host = ai.koog.agents.example.exampleTracing06.host, port = ai.koog.agents.example.exampleTracing06.port)

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, syncOpener))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```
<!--- KNIT example-events-02.kt -->

### カスタムメッセージプロセッサーを作成するにはどうすればよいですか？

`FeatureMessageProcessor` インターフェースを実装します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.NodeExecutionStartingEvent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.message.FeatureMessage
import ai.koog.agents.core.feature.message.FeatureMessageProcessor
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
class CustomTraceProcessor : FeatureMessageProcessor() {

    // プロセッサーの現在のオープン状態
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // カスタム処理ロジック
        when (message) {
            is NodeExecutionStartingEvent -> {
                // ノード開始イベントを処理
            }

            is LLMCallCompletedEvent -> {
                // LLM呼び出し終了イベントを処理 
            }
            // 他のイベントタイプを処理 
        }
    }

    override suspend fun close() {
        // 確立された接続を閉じる
    }
}

// カスタムプロセッサーを使用
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-events-03.kt -->

メッセージプロセッサーで処理できる既存のイベントタイプに関する詳細については、[事前定義されたイベントタイプ](#predefined-event-types) を参照してください。