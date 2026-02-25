# トレーシング

このページでは、AI エージェントに包括的なトレース機能を提供するトレーシング（Tracing）機能の詳細について説明します。

## 機能の概要

トレーシング機能は、エージェントの実行に関する詳細な情報を取得する、強力なモニタリングおよびデバッグツールです。以下の情報が含まれます。

- ストラテジー（Strategy）の実行
- LLM 呼び出し
- LLM ストリーミング（開始、フレーム、完了、エラー）
- ツール呼び出し
- エージェントグラフ内でのノードの実行

この機能は、エージェントパイプラインにおける主要なイベントをインターセプト（捕捉）し、設定可能なメッセージプロセッサーに転送することで動作します。これらのプロセッサーは、トレース情報をログファイルやファイルシステム内の他の種類のファイルなど、さまざまな出力先に出力できます。これにより、開発者はエージェントの挙動を把握し、問題を効果的にトラブルシューティングできるようになります。

### イベントの流れ

1. トレーシング機能がエージェントパイプライン内のイベントをインターセプトします。
2. 設定されたメッセージフィルタに基づいて、イベントがフィルタリングされます。
3. フィルタリングされたイベントは、登録されたメッセージプロセッサーに渡されます。
4. メッセージプロセッサーはイベントをフォーマットし、それぞれの出力先に出力します。

## 設定と初期化

### 基本セットアップ

トレーシング機能を使用するには、以下の手順が必要です。

1. 1つ以上のメッセージプロセッサーを用意する（既存のものを使用するか、独自に作成できます）。
2. エージェントに `Tracing` をインストールする。
3. メッセージフィルタを設定する（任意）。
4. メッセージプロセッサーを機能に追加する。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.ToolCallStartingEvent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
-->
```kotlin
// トレースメッセージの出力先として使用されるロガー/ファイルを定義します
val logger = KotlinLogging.logger { }
val outputPath = Path("/path/to/trace.log")

// エージェントを作成します
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Tracing) {

        // トレースイベントを処理するメッセージプロセッサーを設定します
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        addMessageProcessor(TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
        ))
    }
}
```
<!--- KNIT example-tracing-01.kt -->

### メッセージのフィルタリング

既存のすべてのイベントを処理することも、特定の基準に基づいて一部のイベントを選択することもできます。
メッセージフィルタを使用すると、どのイベントを処理するかを制御できます。これは、エージェント実行の特定の側面に焦点を当てたい場合に便利です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.*
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

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

val fileWriter = TraceFeatureMessageFileWriter(
    outputPath,
    { path: Path -> SystemFileSystem.sink(path).buffered() }
)

addMessageProcessor(fileWriter)

// LLM 関連のイベントのみをフィルタリングします
fileWriter.setMessageFilter { message ->
    message is LLMCallStartingEvent || message is LLMCallCompletedEvent
}

// ツール関連のイベントのみをフィルタリングします
fileWriter.setMessageFilter { message -> 
    message is ToolCallStartingEvent ||
           message is ToolCallCompletedEvent ||
           message is ToolValidationFailedEvent ||
           message is ToolCallFailedEvent
}

// ノード実行イベントのみをフィルタリングします
fileWriter.setMessageFilter { message -> 
    message is NodeExecutionStartingEvent || message is NodeExecutionCompletedEvent
}
```
<!--- KNIT example-tracing-02.kt -->

### 大規模なトレース量

複雑なストラテジーを持つエージェントや、長時間実行されるエージェントの場合、トレースイベントの量が膨大になる可能性があります。イベント量を管理するために、以下の方法を検討してください。

- 特定のメッセージフィルタを使用して、イベント数を削減する。
- バッファリングやサンプリングを行うカスタムメッセージプロセッサーを実装する。
- ログファイルが大きくなりすぎないよう、ファイルローテーションを使用する。

### 依存関係グラフ

トレーシング機能は、以下の依存関係を持っています。

```
Tracing
├── AIAgentPipeline (イベントのインターセプト用)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (ai.koog.agents.core.feature.model より)
    ├── AgentStartingEvent
    ├── AgentCompletedEvent
    ├── AgentExecutionFailedEvent
    ├── AgentClosingEvent
    ├── GraphStrategyStartingEvent
    ├── FunctionalStrategyStartingEvent
    ├── StrategyCompletedEvent
    ├── NodeExecutionStartingEvent
    ├── NodeExecutionCompletedEvent
    ├── NodeExecutionFailedEvent
    ├── SubgraphExecutionStartingEvent
    ├── SubgraphExecutionCompletedEvent
    ├── SubgraphExecutionFailedEvent
    ├── LLMCallStartingEvent
    ├── LLMCallCompletedEvent
    ├── LLMStreamingStartingEvent
    ├── LLMStreamingFrameReceivedEvent
    ├── LLMStreamingFailedEvent
    ├── LLMStreamingCompletedEvent
    ├── ToolCallStartingEvent
    ├── ToolValidationFailedEvent
    ├── ToolCallFailedEvent
    └── ToolCallCompletedEvent
```

## 例とクイックスタート

### ロガーへの基本的なトレーシング

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
-->
```kotlin
// ロガーを作成します
val logger = KotlinLogging.logger { }

fun main() {
    runBlocking {
       // トレーシングを有効にしてエージェントを作成します
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

## エラーハンドリングとエッジケース

### メッセージプロセッサーがない場合

トレーシング機能にメッセージプロセッサーが1つも追加されていない場合、警告がログに記録されます。

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

この場合でも機能はイベントをインターセプトしますが、それらが処理されたりどこかに出力されたりすることはありません。

### リソース管理

メッセージプロセッサーは、適切に解放する必要があるリソース（ファイルハンドルなど）を保持している場合があります。適切なクリーンアップを確実に行うために、`use` 拡張関数を使用してください。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
// エージェントを作成します
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
// ブロックを抜けると writer は自動的にクローズされます
```
<!--- KNIT example-tracing-04.kt -->

### 特定のイベントをファイルにトレースする

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"

fun main() {
    runBlocking {
        // エージェントを作成します
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
    
    // LLM 呼び出しのみをトレースします
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-tracing-05.kt -->

### 特定のイベントをリモートエンドポイントにトレースする

ネットワーク経由でイベントデータを送信する必要がある場合は、リモートエンドポイントへのトレーシングを使用します。開始されると、リモートエンドポイントへのトレーシングは指定されたポート番号で軽量なサーバーを起動し、Kotlin Server-Sent Events (SSE) を介してイベントを送信します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
// エージェントを作成します
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
// ブロックを抜けると writer は自動的にクローズされます
```
<!--- KNIT example-tracing-06.kt -->

クライアント側では、`FeatureMessageRemoteClient` を使用してイベントを受信し、デシリアライズすることができます。

<!--- INCLUDE
import ai.koog.agents.core.feature.model.events.AgentCompletedEvent
import ai.koog.agents.core.feature.model.events.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.DefaultClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.utils.io.use
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
                // サーバーからイベントを収集します
                agentEvents.add(event as DefinedFeatureEvent)

                // エージェントが終了したらイベントの収集を停止します
                if (event is AgentCompletedEvent) {
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

## API ドキュメント

トレーシング機能は、以下の主要コンポーネントによるモジュール構造に従っています。

1. [Tracing](api:agents-features-trace::ai.koog.agents.features.tracing.feature.Tracing): エージェントパイプライン内のイベントをインターセプトするメインの機能クラス。
2. [TraceFeatureConfig](api:agents-features-trace::ai.koog.agents.features.tracing.feature.TraceFeatureConfig): 機能の挙動をカスタマイズするための設定クラス。
3. メッセージプロセッサー: トレースイベントを処理して出力するコンポーネント:
    - [TraceFeatureMessageLogWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter): トレースイベントをロガーに書き込みます。
    - [TraceFeatureMessageFileWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter): トレースイベントをファイルに書き込みます。
    - [TraceFeatureMessageRemoteWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter): トレースイベントをリモートサーバーに送信します。