# トレーシング

このページでは、AIエージェントに包括的なトレーシング機能を提供するトレーシング機能の詳細について説明します。

## 機能の概要

トレーシング機能は、エージェントの実行に関する詳細な情報をキャプチャする、強力なモニタリングおよびデバッグツールです。これには以下の内容が含まれます。

- ストラテジーの実行
- LLM呼び出し
- LLMストリーミング（開始、フレーム、完了、エラー）
- ツール呼び出し
- エージェントグラフ内でのノードの実行

この機能は、エージェントパイプライン内のキーイベントをインターセプトし、設定可能なメッセージプロセッサに転送することで動作します。これらのプロセッサは、トレース情報をログファイルやファイルシステム内の他の種類のファイルなど、さまざまな出力先に出力できます。これにより、開発者はエージェントの動作に関する洞察を得て、効果的にトラブルシューティングを行うことができます。

### イベントの流れ

1. トレーシング機能がエージェントパイプライン内のイベントをインターセプトします。
2. 設定されたメッセージフィルタに基づいてイベントがフィルタリングされます。
3. フィルタリングされたイベントが、登録されたメッセージプロセッサに渡されます。
4. メッセージプロセッサがイベントをフォーマットし、それぞれの出力先に出力します。

## 設定と初期化

### 基本的なセットアップ

トレーシング機能を使用するには、以下の手順が必要です。

1. 1つ以上のメッセージプロセッサを用意する（既存のものを使用するか、独自に作成できます）。
2. エージェントに `Tracing` をインストールする。
3. メッセージフィルタを設定する（任意）。
4. メッセージプロセッサを機能に追加する。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
    import ai.koog.agents.core.feature.model.events.ToolCallStartingEvent
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
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
    
    // エージェントの作成
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            // トレースイベントを処理するためのメッセージプロセッサを設定します
            addMessageProcessor(TraceFeatureMessageLogWriter(logger))
            addMessageProcessor(TraceFeatureMessageFileWriter.create(outputPath))
        }
    }
    ```
    <!--- KNIT example-tracing-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import org.slf4j.LoggerFactory;
    import java.nio.file.Path;
    public class exampleTracingJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // トレースメッセージの出力先として使用されるロガー/ファイルを定義します
    var logger = LoggerFactory.getLogger("tracing");
    var outputPath = Path.of("/path/to/trace.log");

    // エージェントの作成
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            // トレースイベントを処理するためのメッセージプロセッサを設定します
            config.addMessageProcessor(TraceFeatureMessageLogWriter.create(logger));
            config.addMessageProcessor(TraceFeatureMessageFileWriter.create(outputPath));
        })
        .build();
    ```
    <!--- KNIT exampleTracingJava01.java -->

### メッセージのフィルタリング

既存のすべてのイベントを処理することも、特定の基準に基づいて一部を選択することもできます。
メッセージフィルタを使用すると、どのイベントを処理するかを制御できます。これは、エージェントの実行における特定の側面に焦点を当てる場合に便利です。

=== "Kotlin"

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
    
    // LLM関連のイベントのみをフィルタリングします
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.model.events.*;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava02 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            var agent = AIAgent.builder()
                .promptExecutor(PromptExecutor.builder().ollama().build())
                .llmModel(OllamaModels.Meta.LLAMA_3_2)
                .install(Tracing.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    var fileWriter = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    config.addMessageProcessor(fileWriter);

    // LLM関連のイベントのみをフィルタリングします
    fileWriter.setMessageFilter(message ->
        message instanceof LLMCallStartingEvent || message instanceof LLMCallCompletedEvent
    );

    // ツール関連のイベントのみをフィルタリングします
    fileWriter.setMessageFilter(message ->
        message instanceof ToolCallStartingEvent ||
            message instanceof ToolCallCompletedEvent ||
            message instanceof ToolValidationFailedEvent ||
            message instanceof ToolCallFailedEvent
    );

    // ノード実行イベントのみをフィルタリングします
    fileWriter.setMessageFilter(message ->
        message instanceof NodeExecutionStartingEvent || message instanceof NodeExecutionCompletedEvent
    );
    ```
    <!--- KNIT exampleTracingJava02.java -->

### 大規模なトレースボリューム

複雑なストラテジーを持つエージェントや実行時間が長いエージェントの場合、トレースイベントのボリュームが膨大になる可能性があります。ボリュームを管理するために、以下の方法を検討してください。

- 特定のメッセージフィルタを使用してイベント数を減らす。
- バッファリングやサンプリングを行うカスタムメッセージプロセッサを実装する。
- ログファイルのサイズが大きくなりすぎないように、ファイルローテーションを使用する。

### 依存関係グラフ

トレーシング機能には以下の依存関係があります。

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
    ├── LLMCallFailedEvent
    ├── LLMStreamingStartingEvent
    ├── LLMStreamingFrameReceivedEvent
    ├── LLMStreamingFailedEvent
    ├── LLMStreamingCompletedEvent
    ├── ToolCallStartingEvent
    ├── ToolValidationFailedEvent
    ├── ToolCallFailedEvent
    └── ToolCallCompletedEvent
```
<!--- KNIT example-tracing-01.txt -->

## 例とクイックスタート

### ロガーへの基本的なトレーシング

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import io.github.oshai.kotlinlogging.KotlinLogging
    import kotlinx.coroutines.runBlocking
    fun main() = runBlocking {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // ロガーの作成
    val logger = KotlinLogging.logger { }

    // トレーシングを有効にしてエージェントを作成
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        }
    }

    // エージェントを実行
    agent.run("Hello, agent!")
    ```
    <!--- KNIT example-tracing-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import org.slf4j.LoggerFactory;
    public class exampleTracingJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // ロガーの作成
    var logger = LoggerFactory.getLogger("tracing");

    // トレーシングを有効にしてエージェントを作成
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(TraceFeatureMessageLogWriter.create(logger));
        })
        .build();

    // エージェントを実行
    agent.run("Hello, agent!");
    ```
    <!--- KNIT exampleTracingJava03.java -->

## エラーハンドリングとエッジケース

### メッセージプロセッサがない場合

トレーシング機能にメッセージプロセッサが追加されていない場合、警告がログに記録されます。

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```
<!--- KNIT example-tracing-02.txt -->

機能は引き続きイベントをインターセプトしますが、それらは処理されず、どこにも出力されません。

### リソース管理

メッセージプロセッサは、適切に解放する必要があるリソース（ファイルハンドルなど）を保持している場合があります。適切なクリーンアップを確実に行うために、`use` 拡張関数を使用してください。

=== "Kotlin"

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
    val writer = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    // エージェントの作成
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(writer)
        }
    }

    // エージェントを実行
    agent.run(input)

    // ブロックを抜けるとライターは自動的に閉じられます
    ```
    <!--- KNIT example-tracing-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava04 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            String input = "What's the weather like in New York?";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var writer = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    // エージェントの作成
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(writer);
        })
        .build();

    // エージェントを実行
    agent.run(input);

    // ブロックを抜けるとライターは自動的に閉じられます
    ```
    <!--- KNIT exampleTracingJava04.java -->

### 特定のイベントをファイルにトレースする

=== "Kotlin"

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

    // エージェントの作成
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(fileWriter)

            // LLM呼び出しのみをトレースします
            fileWriter.setMessageFilter { message ->
                message is LLMCallStartingEvent || message is LLMCallCompletedEvent
            }
        }
    }
    ```
    <!--- KNIT example-tracing-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent;
    import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava05 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            String input = "What's the weather like in New York?";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var fileWriter = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    // エージェントの作成
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(fileWriter);

            // LLM呼び出しのみをトレースします
            fileWriter.setMessageFilter(message ->
                message instanceof LLMCallStartingEvent || message instanceof LLMCallCompletedEvent
            );
        })
        .build();
    ```
    <!--- KNIT exampleTracingJava05.java -->

### 特定のイベントをリモートエンドポイントにトレースする

ネットワーク経由でイベントデータを送信する必要がある場合は、リモートエンドポイントへのトレーシングを使用します。開始されると、リモートエンドポイントへのトレーシングは指定されたポート番号で軽量サーバーを起動し、Kotlin Server-Sent Events (SSE) を介してイベントを送信します。

=== "Kotlin"

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
    val connectionConfig = DefaultServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(connectionConfig)

    // エージェントの作成
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(writer)
        }
    }

    // エージェントを実行
    agent.run(input)

    // ブロックを抜けるとライターは自動的に閉じられます
    ```
    <!--- KNIT example-tracing-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    public class exampleTracingJava06 {
        public static void main(String[] args) {
            String input = "What's the weather like in New York?";
            int port = 4991;
            String host = "localhost";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var connectionConfig = new DefaultServerConnectionConfig(host, port);
    var writer = new TraceFeatureMessageRemoteWriter(connectionConfig);

    // エージェントの作成
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(writer);
        })
        .build();

    // エージェントを実行
    agent.run(input);

    // ブロックを抜けるとライターは自動的に閉じられます
    ```
    <!--- KNIT exampleTracingJava06.java -->

クライアント側では、`FeatureMessageRemoteClient` を使用してイベントを受信し、デシリアライズできます。

=== "Kotlin"

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

## APIドキュメント

トレーシング機能は、以下の主要コンポーネントによるモジュール型アーキテクチャに従っています。

1. [Tracing](api:agents-features-trace::ai.koog.agents.features.tracing.feature.Tracing): エージェントパイプライン内のイベントをインターセプトするメインの機能クラスです。
2. [TraceFeatureConfig](api:agents-features-trace::ai.koog.agents.features.tracing.feature.TraceFeatureConfig): 機能の動作をカスタマイズするための設定クラスです。
3. メッセージプロセッサ: トレースイベントを処理して出力するコンポーネントです。
    - [TraceFeatureMessageLogWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter): トレースイベントをロガーに書き込みます。
    - [TraceFeatureMessageFileWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter): トレースイベントをファイルに書き込みます。
    - [TraceFeatureMessageRemoteWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter): トレースイベントをリモートサーバーに送信します。