# トレーシング

このページでは、AIエージェント向けの包括的なトレーシング機能を提供するTracing機能について詳しく説明します。

## 機能概要

Tracing機能は、エージェントの実行に関する詳細情報を捕捉する強力なモニタリングおよびデバッグツールです。捕捉される情報には以下が含まれます。

- 戦略の実行
- LLM呼び出し
- ツール呼び出し
- エージェントグラフ内のノード実行

この機能は、エージェントパイプライン内の主要なイベントを傍受し、構成可能なメッセージプロセッサーに転送することで動作します。これらのプロセッサーは、トレース情報をログファイルやファイルシステム内のその他の種類のファイルなど、様々な出力先に出力でき、開発者はエージェントの動作を把握し、問題を効果的にトラブルシューティングできます。

### イベントフロー

1.  Tracing機能は、エージェントパイプライン内のイベントを傍受します。
2.  イベントは、設定されたメッセージフィルターに基づいてフィルタリングされます。
3.  フィルタリングされたイベントは、登録されたメッセージプロセッサーに渡されます。
4.  メッセージプロセッサーはイベントをフォーマットし、それぞれの出力先に送ります。

## 設定と初期化

### 基本的なセットアップ

Tracing機能を使用するには、以下が必要です。

1.  1つ以上のメッセージプロセッサーを用意する（既存のものを使用するか、独自に作成できます）。
2.  エージェントに`Tracing`をインストールします。
3.  メッセージフィルターを設定する（オプション）。
4.  メッセージプロセッサーを機能に追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.ToolCallEvent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
-->
```kotlin
// トレースメッセージの出力先として使用されるロガー/ファイルを定義しています
val logger = KotlinLogging.logger { }
val outputPath = Path("/path/to/trace.log")

// エージェントを作成しています
val agent = AIAgent(
   promptExecutor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
      // トレースイベントを処理するメッセージプロセッサーを設定します
      addMessageProcessor(TraceFeatureMessageLogWriter(logger))
      addMessageProcessor(
         TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
         )
      )

      // オプションでメッセージをフィルタリングします
      messageFilter = { message ->
         // LLM呼び出しとツール呼び出しのみをトレースします
         message is AfterLLMCallEvent || message is ToolCallEvent
      }
   }
}
```
<!--- KNIT example-tracing-01.kt -->

### メッセージフィルタリング

既存のすべてのイベントを処理することも、特定の基準に基づいて一部を選択することもできます。
メッセージフィルターを使用すると、どのイベントを処理するかを制御できます。これは、エージェント実行の特定の側面に焦点を当てるのに役立ちます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.*
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
   promptExecutor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// LLM関連イベントのみをフィルタリング
messageFilter = { message -> 
    message is BeforeLLMCallEvent || message is AfterLLMCallEvent
}

// ツール関連イベントのみをフィルタリング
messageFilter = { message -> 
    message is ToolCallEvent ||
           message is ToolCallResultEvent ||
           message is ToolValidationErrorEvent ||
           message is ToolCallFailureEvent
}

// ノード実行イベントのみをフィルタリング
messageFilter = { message -> 
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```
<!--- KNIT example-tracing-02.kt -->

### 大量のトレースデータ

複雑な戦略を持つエージェントや、長時間の実行を行うエージェントでは、トレースイベントの量が膨大になる可能性があります。イベントの量を管理するために、以下の方法を検討してください。

- 特定のメッセージフィルターを使用してイベント数を減らします。
- バッファリングまたはサンプリング機能を備えたカスタムメッセージプロセッサーを実装します。
- ログファイルが肥大化するのを防ぐために、ファイルローテーションを使用します。

### 依存関係グラフ

Tracing機能には以下の依存関係があります。

```
Tracing
├── AIAgentPipeline (for intercepting events)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (from ai.koog.agents.core.feature.model)
    ├── AIAgentStartedEvent
    ├── AIAgentFinishedEvent
    ├── AIAgentRunErrorEvent
    ├── AIAgentStrategyStartEvent
    ├── AIAgentStrategyFinishedEvent
    ├── AIAgentNodeExecutionStartEvent
    ├── AIAgentNodeExecutionEndEvent
    ├── LLMCallStartEvent
    ├── LLMCallWithToolsStartEvent
    ├── LLMCallEndEvent
    ├── LLMCallWithToolsEndEvent
    ├── ToolCallEvent
    ├── ToolValidationErrorEvent
    ├── ToolCallFailureEvent
    └── ToolCallResultEvent
```

## 例とクイックスタート

### ロガーへの基本的なトレーシング

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
-->
```kotlin
// ロガーを作成します
val logger = KotlinLogging.logger { }

fun main() {
    runBlocking {
       // トレーシング機能付きエージェントを作成します
       val agent = AIAgent(
          promptExecutor = simpleOllamaAIExecutor(),
          llmModel = OllamaModels.Meta.LLAMA_3_2,
       ) {
          install(Tracing) {
             addMessageProcessor(TraceFeatureMessageLogWriter(logger))
          }
       }

       // エージェントを実行します
       agent.run("Hello, agent!")
    }
}
```
<!--- KNIT example-tracing-03.kt -->

## エラー処理とエッジケース

### メッセージプロセッサーがない場合

Tracing機能にメッセージプロセッサーが追加されていない場合、警告がログに記録されます。

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

この機能は引き続きイベントを傍受しますが、どこにも処理または出力されません。

### リソース管理

メッセージプロセッサーは、適切に解放する必要のあるリソース（ファイルハンドルなど）を保持する場合があります。適切なクリーンアップを確実に行うために、`use`拡張関数を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
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
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// エージェントを作成しています
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val writer = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// エージェントを実行します
agent.run(input)
// ブロックが終了すると、ライターは自動的に閉じられます
```
<!--- KNIT example-tracing-04.kt -->

### 特定のイベントをファイルにトレースする

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.BeforeLLMCallEvent
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
        // エージェントを作成しています
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
    // LLM呼び出しのみをトレースします
    messageFilter = { message ->
        message is BeforeLLMCallEvent || message is AfterLLMCallEvent
    }
    addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-05.kt -->

### 特定のイベントをリモートエンドポイントにトレースする

ネットワーク経由でイベントデータを送信する必要がある場合は、リモートエンドポイントへのトレーシングを使用します。一旦開始されると、リモートエンドポイントへのトレーシングは指定されたポート番号で軽量サーバーを起動し、Kotlin Server-Sent Events (SSE)を介してイベントを送信します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// エージェントを作成しています
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val connectionConfig = DefaultServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(
        connectionConfig = connectionConfig
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// エージェントを実行します
agent.run(input)
```
<!--- KNIT example-tracing-06.kt -->

クライアント側では、`FeatureMessageRemoteClient`を使用してイベントを受信し、逆シリアル化できます。

<!--- INCLUDE
import ai.koog.agents.core.feature.model.events.AIAgentFinishedEvent
import ai.koog.agents.core.feature.model.events.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.DefaultClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.agents.utils.use
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.consumeAsFlow

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
val clientConfig = DefaultClientConnectionConfig(host = host, port = port, protocol = URLProtocol.HTTP)
val agentEvents = mutableListOf<DefinedFeatureEvent>()

val clientJob = launch {
    FeatureMessageRemoteClient(connectionConfig = clientConfig, scope = this).use { client ->
        val collectEventsJob = launch {
            client.receivedMessages.consumeAsFlow().collect { event ->
                // サーバーからイベントを収集
                agentEvents.add(event as DefinedFeatureEvent)

                // エージェント完了時にイベント収集を停止
                if (event is AIAgentFinishedEvent) {
                    cancel()
                }
            }
        }
        client.connect()
        collectEventsJob.join()
        client.healthCheck()
    }
}

listOf(clientJob).joinAll()
```
<!--- KNIT example-tracing-07.kt -->

## APIドキュメント

Tracing機能は、以下の主要コンポーネントを持つモジュラーアーキテクチャに従います。

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-tracing/index.html): エージェントパイプライン内のイベントを傍受する主要な機能クラスです。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-trace-feature-config/index.html): 機能の動作をカスタマイズするための設定クラスです。
3.  Message Processors: トレースイベントを処理し、出力するコンポーネントです。
    - [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-log-writer/index.html): トレースイベントをロガーに書き込みます。
    - [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-file-writer/index.html): トレースイベントをファイルに書き込みます。
    - [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-remote-writer/index.html): トレースイベントをリモートサーバーに送信します。

## FAQとトラブルシューティング

以下のセクションには、Tracing機能に関連するよくある質問とその回答が含まれています。

### エージェント実行の特定の部分のみをトレースするにはどうすればよいですか？

`messageFilter`プロパティを使用してイベントをフィルタリングします。例えば、ノード実行のみをトレースするには：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.BeforeLLMCallEvent
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
        // エージェントを作成しています
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
   // LLM呼び出しのみをトレースします
   messageFilter = { message ->
      message is BeforeLLMCallEvent || message is AfterLLMCallEvent
   }
   addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-08.kt -->

### 複数のメッセージプロセッサーを使用できますか？

はい、複数のメッセージプロセッサーを追加して、同時に異なる出力先にトレースできます。

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
      // エージェントを作成しています
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
<!--- KNIT example-tracing-09.kt -->

### カスタムメッセージプロセッサーを作成するにはどうすればよいですか？

`FeatureMessageProcessor`インターフェースを実装します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AIAgentNodeExecutionStartEvent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
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
      // エージェントを作成しています
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
            is AIAgentNodeExecutionStartEvent -> {
                // ノード開始イベントを処理
            }

            is AfterLLMCallEvent -> {
                // LLM呼び出し終了イベントを処理
           }
            // その他のイベントタイプを処理
        }
    }

    override suspend fun close() {
        // 確立された接続を閉じる
    }
}

// カスタムプロセッサーを使用します
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-10.kt -->

メッセージプロセッサーで処理できる既存のイベントタイプの詳細については、[定義済みイベントタイプ](#predefined-event-types)を参照してください。

## 定義済みイベントタイプ

Koogは、カスタムメッセージプロセッサーで使用できる定義済みイベントタイプを提供します。定義済みイベントは、関連するエンティティに応じていくつかのカテゴリに分類できます。

- [エージェントイベント](#agent-events)
- [戦略イベント](#strategy-events)
- [ノードイベント](#node-events)
- [LLM呼び出しイベント](#llm-call-events)
- [ツール呼び出しイベント](#tool-call-events)

### エージェントイベント

#### AIAgentStartedEvent

エージェントの実行開始を表します。以下のフィールドが含まれます：

| 名前           | データ型 | 必須 | デフォルト               | 説明                                             |
|----------------|----------|------|------------------------|--------------------------------------------------|
| `strategyName` | String   | Yes  |                        | エージェントが従うべき戦略の名前。               |
| `eventId`      | String   | No   | `AIAgentStartedEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### AIAgentFinishedEvent

エージェントの実行終了を表します。以下のフィールドが含まれます：

| 名前           | データ型 | 必須 | デフォルト                | 説明                                                         |
|----------------|----------|------|-------------------------|--------------------------------------------------------------|
| `strategyName` | String   | Yes  |                         | エージェントが従った戦略の名前。                             |
| `result`       | String   | Yes  |                         | エージェント実行の結果。結果がない場合は`null`になります。   |
| `eventId`      | String   | No   | `AIAgentFinishedEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### AIAgentRunErrorEvent

エージェントの実行中にエラーが発生したことを表します。以下のフィールドが含まれます：

| 名前           | データ型    | 必須 | デフォルト                | 説明                                                                                             |
|----------------|-------------|------|-------------------------|--------------------------------------------------------------------------------------------------|
| `strategyName` | String      | Yes  |                         | エージェントが従った戦略の名前。                                                                 |
| `error`        | AIAgentError| Yes  |                         | エージェント実行中に発生した特定のエラー。[AIAgentError](#aiagenterror)の詳細については、を参照してください。 |
| `eventId`      | String      | No   | `AIAgentRunErrorEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。                                       |

<a id="aiagenterror"></a>
`AIAgentError`クラスは、エージェントの実行中に発生したエラーに関する詳細情報を提供します。以下のフィールドが含まれます：

| 名前         | データ型 | 必須 | デフォルト | 説明                                                   |
|--------------|----------|------|----------|--------------------------------------------------------|
| `message`    | String   | Yes  |          | 特定のエラーに関する詳細情報を提供するメッセージ。     |
| `stackTrace` | String   | Yes  |          | 最後に実行されたコードまでのスタックレコードのコレクション。 |
| `cause`      | String   | No   | null     | 利用可能な場合、エラーの原因。                         |

### 戦略イベント

#### AIAgentStrategyStartEvent

戦略の実行開始を表します。以下のフィールドが含まれます：

| 名前           | データ型 | 必須 | デフォルト                     | 説明                                             |
|----------------|----------|------|------------------------------|--------------------------------------------------|
| `strategyName` | String   | Yes  |                              | 戦略の名前。                                     |
| `eventId`      | String   | No   | `AIAgentStrategyStartEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### AIAgentStrategyFinishedEvent

戦略の実行終了を表します。以下のフィールドが含まれます：

| 名前           | データ型 | 必須 | デフォルト                        | 説明                                             |
|----------------|----------|------|---------------------------------|--------------------------------------------------|
| `strategyName` | String   | Yes  |                                 | 戦略の名前。                                     |
| `result`       | String   | Yes  |                                 | 実行の結果。                                     |
| `eventId`      | String   | No   | `AIAgentStrategyFinishedEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

### ノードイベント

#### AIAgentNodeExecutionStartEvent

ノードの実行開始を表します。以下のフィールドが含まれます：

| 名前       | データ型 | 必須 | デフォルト                          | 説明                                             |
|------------|----------|------|-----------------------------------|--------------------------------------------------|
| `nodeName` | String   | Yes  |                                   | 実行が開始されたノードの名前。                   |
| `input`    | String   | Yes  |                                   | ノードの入力値。                                 |
| `eventId`  | String   | No   | `AIAgentNodeExecutionStartEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### AIAgentNodeExecutionEndEvent

ノードの実行終了を表します。以下のフィールドが含まれます：

| 名前       | データ型 | 必須 | デフォルト                        | 説明                                             |
|------------|----------|------|---------------------------------|--------------------------------------------------|
| `nodeName` | String   | Yes  |                                 | 実行が終了したノードの名前。                     |
| `input`    | String   | Yes  |                                 | ノードの入力値。                                 |
| `output`   | String   | Yes  |                                 | ノードによって生成された出力値。                 |
| `eventId`  | String   | No   | `AIAgentNodeExecutionEndEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

### LLM呼び出しイベント

#### LLMCallStartEvent

LLM呼び出しの開始を表します。以下のフィールドが含まれます：

| 名前      | データ型          | 必須 | デフォルト             | 説明                                                         |
|-----------|-------------------|------|----------------------|--------------------------------------------------------------|
| `prompt`  | Prompt            | Yes  |                      | モデルに送信されるプロンプト。[Prompt](#prompt)の詳細については、を参照してください。 |
| `tools`   | List&lt;String&gt;| Yes  |                      | モデルが呼び出すことができるツールのリスト。                 |
| `eventId` | String            | No   | `LLMCallStartEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。   |

<a id="prompt"></a>
`Prompt`クラスは、メッセージのリスト、一意の識別子、および言語モデル設定用のオプションパラメーターで構成される、プロンプトのデータ構造を表します。以下のフィールドが含まれます：

| 名前       | データ型           | 必須 | デフォルト     | 説明                                                 |
|------------|--------------------|------|----------------|------------------------------------------------------|
| `messages` | List&lt;Message&gt;| Yes  |                | プロンプトを構成するメッセージのリスト。             |
| `id`       | String             | Yes  |                | プロンプトの一意の識別子。                           |
| `params`   | LLMParams          | No   | LLMParams()    | LLMがコンテンツを生成する方法を制御する設定。        |

#### LLMCallEndEvent

LLM呼び出しの終了を表します。以下のフィールドが含まれます：

| 名前        | データ型                    | 必須 | デフォルト           | 説明                                             |
|-------------|-----------------------------|------|--------------------|--------------------------------------------------|
| `responses` | List&lt;Message.Response&gt;| Yes  |                    | モデルによって返された1つ以上の応答。            |
| `eventId`   | String                      | No   | `LLMCallEndEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

### ツール呼び出しイベント

#### ToolCallEvent

モデルがツールを呼び出すイベントを表します。以下のフィールドが含まれます：

| 名前       | データ型  | 必須 | デフォルト         | 説明                                             |
|------------|-----------|------|--------------------|--------------------------------------------------|
| `toolName` | String    | Yes  |                    | ツールの名前。                                   |
| `toolArgs` | Tool.Args | Yes  |                    | ツールに提供される引数。                         |
| `eventId`  | String    | No   | `ToolCallEvent`    | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### ToolValidationErrorEvent

ツール呼び出し中に検証エラーが発生したことを表します。以下のフィールドが含まれます：

| 名前           | データ型  | 必須 | デフォルト                    | 説明                                             |
|----------------|-----------|------|-----------------------------|--------------------------------------------------|
| `toolName`     | String    | Yes  |                             | 検証が失敗したツールの名前。                     |
| `toolArgs`     | Tool.Args | Yes  |                             | ツールに提供される引数。                         |
| `errorMessage` | String    | Yes  |                             | 検証エラーメッセージ。                           |
| `eventId`      | String    | No   | `ToolValidationErrorEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。 |

#### ToolCallFailureEvent

ツール呼び出しの失敗を表します。以下のフィールドが含まれます：

| 名前       | データ型    | 必須 | デフォルト                | 説明                                                                                             |
|------------|-------------|------|-------------------------|--------------------------------------------------------------------------------------------------|
| `toolName` | String      | Yes  |                         | ツールの名前。                                                                                   |
| `toolArgs` | Tool.Args   | Yes  |                         | ツールに提供される引数。                                                                         |
| `error`    | AIAgentError| Yes  |                         | ツールを呼び出そうとしたときに発生した特定のエラー。[AIAgentError](#aiagenterror)の詳細については、を参照してください。 |
| `eventId`  | String      | No   | `ToolCallFailureEvent`  | イベントの識別子。通常、イベントクラスの`simpleName`です。                                       |

#### ToolCallResultEvent

結果を伴うツール呼び出しの成功を表します。以下のフィールドが含まれます：

| 名前       | データ型  | 必須 | デフォルト                | 説明                                             |
|------------|-----------|------|-------------------------|--------------------------------------------------|
| `toolName` | String    | Yes  |                         | ツールの名前。                                   |
| `toolArgs` | Tool.Args | Yes  |                         | ツールに提供される引数。                         |
| `result`   | ToolResult| Yes  |                         | ツール呼び出しの結果。                           |
| `eventId`  | String      | No   | `ToolCallResultEvent`   | イベントの識別子。通常、イベントクラスの`simpleName`です。 |