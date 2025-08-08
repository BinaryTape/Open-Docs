# トレーシング

このページでは、AIエージェント向けの包括的なトレーシング機能を提供する**トレーシング機能**について詳しく説明します。

## 機能概要

トレーシング機能は、エージェントの実行に関する詳細情報を捕捉する強力なモニタリングおよびデバッグツールです。捕捉される情報には以下が含まれます。

- エージェントの作成と初期化
- 戦略の実行
- LLM呼び出し
- ツール呼び出し
- エージェントグラフ内のノード実行

この機能は、エージェントパイプライン内の主要なイベントを傍受し、構成可能なメッセージプロセッサーに転送することで動作します。これらのプロセッサーは、トレース情報をログファイルやファイルシステムなどの様々な出力先に出力でき、開発者はエージェントの動作を把握し、問題を効果的にトラブルシューティングできます。

### イベントフロー

1. トレーシング機能は、エージェントパイプライン内のイベントを傍受します。
2. イベントは、設定されたメッセージフィルターに基づいてフィルタリングされます。
3. フィルタリングされたイベントは、登録されたメッセージプロセッサーに渡されます。
4. メッセージプロセッサーはイベントをフォーマットし、それぞれの出力先に送ります。

## 設定と初期化

### 基本的なセットアップ

トレーシング機能を使用するには、以下が必要です。

1. 1つ以上のメッセージプロセッサーを用意する（既存のものを使用するか、独自に作成できます）。
2. エージェントに`Tracing`をインストールします。
3. メッセージフィルターを設定する（オプション）。
4. メッセージプロセッサーを機能に追加します。

```kotlin
// トレースメッセージの出力先として使用されるロガー/ファイルを定義しています
val logger = LoggerFactory.create("my.trace.logger")
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/trace.log")

// エージェントを作成しています
val agent = AIAgent(...) {
    install(Tracing) {
        // トレースイベントを処理するメッセージプロセッサーを設定します
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, fileSystem::sink))

        // オプションでメッセージをフィルタリングします
        messageFilter = { message -> 
            // LLM呼び出しとツール呼び出しのみをトレースします
            message is LLMCallStartEvent || message is ToolCallEvent 
        }
    }
}
```

### メッセージフィルタリング

既存のすべてのイベントを処理することも、特定の基準に基づいて一部を選択することもできます。
メッセージフィルターを使用すると、どのイベントを処理するかを制御できます。これは、エージェント実行の特定の側面に焦点を当てるのに役立ちます。

```kotlin
// LLM関連イベントのみをフィルタリング
messageFilter = { message ->
    message is LLMCallStartEvent ||
            message is LLMCallEndEvent ||
            message is LLMCallWithToolsStartEvent ||
            message is LLMCallWithToolsEndEvent
}

// ツール関連イベントのみをフィルタリング
messageFilter = { message ->
    message is ToolCallsEvent ||
            message is ToolCallResultEvent ||
            message is ToolValidationErrorEvent ||
            message is ToolCallFailureEvent
}

// ノード実行イベントのみをフィルタリング
messageFilter = { message ->
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```

### 大量のトレースデータ

複雑な戦略を持つエージェントや、長時間の実行を行うエージェントでは、トレースイベントの量が膨大になる可能性があります。イベントの量を管理するために、以下の方法を検討してください。

- 特定のメッセージフィルターを使用してイベント数を減らします。
- バッファリングまたはサンプリング機能を備えたカスタムメッセージプロセッサーを実装します。
- ログファイルが肥大化するのを防ぐために、ファイルローテーションを使用します。

### 依存関係グラフ

トレーシング機能には以下の依存関係があります。

```
Tracing
├── AIAgentPipeline (イベント傍受用)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (ai.koog.agents.core.feature.modelから)
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

```kotlin
// ロガーを作成します
val logger = LoggerFactory.create("my.agent.trace")

// トレーシング機能付きエージェントを作成します
val agent = AIAgent(...) {
    install(Tracing) {
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    }
}

// エージェントを実行します
agent.run("Hello, agent!")
```

## エラー処理とエッジケース

### メッセージプロセッサーがない場合

Tracing機能にメッセージプロセッサーが追加されていない場合、警告がログに記録されます。

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

この機能は引き続きイベントを傍受しますが、どこにも処理または出力されません。

### リソース管理

メッセージプロセッサーは、適切に解放する必要のあるリソース（ファイルハンドルなど）を保持する場合があります。適切なクリーンアップを確実に行うために、`use`拡張関数を使用します。

```kotlin
TraceFeatureMessageFileWriter(fs, path).use { writer ->
    // ライターを使用します
    install(Tracing) {
        addMessageProcessor(writer)
    }

    // エージェントを実行します
    agent.run(input)

    // ブロックが終了すると、ライターは自動的に閉じられます
}
```

### 特定のイベントをファイルにトレースする

```kotlin
// ファイルライターを作成します
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/llm-calls.log")
val writer = TraceFeatureMessageFileWriter(fs, path)

// フィルタリングされたトレーシング機能付きエージェントを作成します
val agent = AIAgent(...) {
    install(Tracing) {
        // LLM呼び出しのみをトレースします
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// エージェントを実行します
agent.run("Generate a story about a robot.")
```

### 特定のイベントをリモートエンドポイントにトレースする

```kotlin
// ファイルライターを作成します
val port = 8080
val serverConfig = ServerConnectionConfig(port = port)
val writer = TraceFeatureMessageRemoteWriter(connectionConfig = serverConfig)

// フィルタリングされたトレーシング機能付きエージェントを作成します
val agent = AIAgent(...) {
    install(Tracing) {
        // LLM呼び出しのみをトレースします
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// エージェントを実行します
agent.run("Generate a story about a robot.")
```

## APIドキュメント

Tracing機能は、以下の主要コンポーネントを持つモジュラーアーキテクチャに従います。

1.  [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-tracing/index.html): エージェントパイプライン内のイベントを傍受する主要な機能クラスです。
2.  [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-trace-feature-config/index.html): 機能の動作をカスタマイズするための設定クラスです。
3.  Message Processors: トレースイベントを処理し、出力するコンポーネントです。
    -   [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-log-writer/index.html): トレースイベントをロガーに書き込みます。
    -   [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-file-writer/index.html): トレースイベントをファイルに書き込みます。
    -   [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-remote-writer/index.html): トレースイベントをリモートサーバーに送信します。

## FAQとトラブルシューティング

以下のセクションには、Tracing機能に関連するよくある質問とその回答が含まれています。

### エージェント実行の特定の部分のみをトレースするにはどうすればよいですか？

`messageFilter`プロパティを使用してイベントをフィルタリングします。例えば、ノード実行のみをトレースするには：

```kotlin
install(Tracing) {
    messageFilter = { message ->
        message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
    }
    addMessageProcessor(writer)
}
```

### 複数のメッセージプロセッサーを使用できますか？

はい、複数のメッセージプロセッサーを追加して、同時に異なる出力先にトレースできます。

```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(fs, path))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```

### カスタムメッセージプロセッサーを作成するにはどうすればよいですか？

`FeatureMessageProcessor`インターフェースを実装します。

```kotlin
class CustomTraceProcessor : FeatureMessageProcessor {
    override suspend fun onMessage(message: FeatureMessage) {
        // カスタム処理ロジック
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // ノード開始イベントを処理
            }
            is LLMCallWithToolsEndEvent -> {
                // LLM呼び出し終了イベントを処理
            }
            // その他のイベントタイプを処理
        }
    }
}

// カスタムプロセッサーを使用します
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}