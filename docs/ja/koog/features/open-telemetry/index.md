# OpenTelemetry のサポート

このページでは、AI エージェントのトレースとモニタリングのための Koog エージェンティック・フレームワーク（agentic framework）における OpenTelemetry サポートの詳細について説明します。

## 概要

OpenTelemetry は、アプリケーションからテレメトリデータ（トレース）を生成、収集、エクスポートするためのツールを提供するオブザーバビリティ（可観測性）フレームワークです。Koog の OpenTelemetry 機能を使用すると、AI エージェントをインスツルメント（instrument）してテレメトリデータを収集できます。これにより、以下のことが可能になります。

- エージェントのパフォーマンスと動作の監視
- 複雑なエージェント・ワークフローにおける問題のデバッグ
- エージェントの実行フローの可視化
- LLM の呼び出しとツール使用の追跡
- エージェントの動作パターンの分析

## OpenTelemetry の主要な概念

- **スパン (Spans)**: スパンは、分散トレース内での個々の作業単位または操作を表します。エージェントの実行、関数呼び出し、LLM の呼び出し、ツールの呼び出しなど、アプリケーション内の特定の活動の開始と終了を示します。
- **属性 (Attributes)**: 属性は、スパンなどのテレメトリ関連アイテムに関するメタデータを提供します。属性はキー・バリューペアとして表されます。
- **イベント (Events)**: イベントは、スパンの生存期間中の特定の時点（スパン関連イベント）であり、発生した注目すべき出来事を表します。
- **エクスポーター (Exporters)**: エクスポーターは、収集されたテレメトリデータをさまざまなバックエンドや宛先に送信する役割を担うコンポーネントです。
- **コレクター (Collectors)**: コレクターは、テレメトリデータを受信、処理、エクスポートします。アプリケーションとオブザーバビリティ・バックエンドの間の仲介役として機能します。
- **サンプラー (Samplers)**: サンプラーは、サンプリング戦略に基づいてトレースを記録するかどうかを決定します。テレメトリデータのボリュームを管理するために使用されます。
- **リソース (Resources)**: リソースは、テレメトリデータを生成するエンティティを表します。これらはリソース属性によって識別されます。リソース属性は、リソースに関する情報を提供するキー・バリューペアです。

Koog の OpenTelemetry 機能は、以下を含むさまざまなエージェントイベントに対して自動的にスパンを作成します。

- エージェント実行の開始と終了
- ノードの実行
- LLM の呼び出し
- ツールの呼び出し

## インストール

Koog で OpenTelemetry を使用するには、OpenTelemetry 機能をエージェントに追加します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
                // ここに設定オプションを記述します
            }
        }
    )
    ```
    <!--- KNIT example-opentelemetry-support-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava01 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var agent = AIAgent.builder()
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .install(OpenTelemetry.Feature, config -> {
            // ここに設定オプションを記述します
        })
        .build();
    ```
    <!--- KNIT exampleOpentelemetrySupportJava01.java -->

## 設定

### 基本設定

エージェントで OpenTelemetry 機能を設定する際に指定可能なプロパティの一覧は以下の通りです。

| 名前 | データ型 | デフォルト値 | 説明 |
|------------------|-----------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`  | `ai.koog`                    | インスツルメントされるサービスの名前。 |
| `serviceVersion` | `String`  | 現在の Koog ライブラリバージョン | インスツルメントされるサービスのバージョン。 |
| `isVerbose`      | `Boolean` | `false`                      | OpenTelemetry 設定のデバッグ用に詳細なロギングを有効にするかどうか。 |
| `tracer`         | `Tracer`  |                              | スパンの作成に使用される OpenTelemetry トレーサーインスタンス。 |

!!! note
`tracer` プロパティはアクセス可能なパブリックプロパティですが、提供されたエクスポーターとリソース属性に基づいて自動的に設定されます。

`OpenTelemetryConfig` クラスには、異なる設定項目に関連するアクションを表すメソッドも含まれています。以下は、基本的な設定項目セットを使用して OpenTelemetry 機能をインストールする例です。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // サービス情報を設定
        setServiceInfo("my-agent-service", "1.0.0")
        
        // Logging エクスポーターを追加
        addSpanExporter(LoggingSpanExporter.create())
    }
    ```
    <!--- KNIT example-opentelemetry-support-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava02 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // サービス情報を設定
        config.setServiceInfo("my-agent-service", "1.0.0");

        // Logging エクスポーターを追加
        config.addSpanExporter(LoggingSpanExporter.create());
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava02.java -->

利用可能なメソッドのリファレンスについては、以下のセクションを参照してください。

#### setServiceInfo

名前とバージョンを含むサービス情報を設定します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | はい |               | インスツルメントされるサービスの名前。 |
| `serviceVersion`   | String    | はい |               | インスツルメントされるサービスのバージョン。 |

#### addSpanExporter

テレメトリデータを外部システムに送信するためのスパンエクスポーターを追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | はい |               | カスタムスパンエクスポーターのリストに追加される `SpanExporter` インスタンス。 |

Kotlin SDK (`io.opentelemetry.kotlin.tracing.export.SpanExporter`) と Java SDK (`io.opentelemetry.sdk.trace.export.SpanExporter`) の両方のエクスポーターを使用できます。Java SDK エクスポーターは、互換ブリッジ（compat bridge）を介して自動的に変換されます。

エクスポーターは `batchSpanProcessor` の背後に登録されます。これは本番環境における OpenTelemetry 推奨のデフォルト設定です。スパンはバッファリングされ、ワーカースレッドでフラッシュされるため、スパンの終了時にエージェントがネットワーク I/O でブロックされることはありません。プロセッサーを完全に制御する必要がある場合（カスタムバッチ処理パラメータ、テスト用のシンプルなプロセッサー、または複合プロセッサーなど）は、代わりに [`addSpanProcessor`](#addspanprocessor) を使用してください。

#### addSpanProcessor

[`addSpanExporter`](#addspanexporter) による `batchSpanProcessor` のラッピングをバイパスして、`SpanProcessor` を直接登録します。ファクトリは SDK の `TraceExportConfigDsl` スコープ内で実行され、`batchSpanProcessor`、`simpleSpanProcessor`、および `compositeSpanProcessor` を公開します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------|------------------------------------------|----------|---------------|--------------------------------------------------------------------------|
| `factory` | `TraceExportConfigDsl.() -> SpanProcessor` | はい |               | 登録する `SpanProcessor` を返すラムダ。 |

以下のような場合に使用します。

- カスタムバッチ処理パラメータを使用したい場合: `addSpanProcessor { batchSpanProcessor(exporter, scheduleDelayMs = 500) }`
- スパンを同期的にフラッシュしたい場合（テストに便利）: `addSpanProcessor { simpleSpanProcessor(exporter) }`
- 同時に複数のプロセッサーにファンアウト（fan out）したい場合: `addSpanProcessor { compositeSpanProcessor(p1, p2) }`

Java SDK エクスポーターの場合は、まず compat パッケージの `toOtelKotlinSpanExporter()` でラップしてください。

#### addResourceAttributes

サービスに関する追加のコンテキストを提供するためのリソース属性を追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|--------------|--------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<String, Any>` | はい |               | サービスに関する詳細情報を提供するキー・バリューペア。サポートされている値の型: `String`, `Long`, `Double`, `Boolean` |

#### setVerbose

詳細なロギングを有効または無効にします。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | はい | `false`       | true の場合、アプリケーションはより詳細なテレメトリデータを収集します。 |

!!! note

    セキュリティ上の理由から、OpenTelemetry スパンの一部のコンテンツはデフォルトでマスクされます。例えば、LLM のメッセージは実際のメッセージ内容ではなく `HIDDEN:non-empty` としてマスクされます。内容を取得するには、`verbose` 引数の値を `true` に設定してください。

#### addMetricExporter

メトリクスデータを外部システムに送信するためのメトリクスエクスポーターを追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------------|------------------|----------|---------------|------------------------------------------------------------------------------|
| `exporter`      | `MetricExporter` | はい |               | 定期的なメトリクスリーダーに登録する `MetricExporter` インスタンス。 |
| `meterInterval` | `Duration`       | いいえ | `1s`          | メトリクス読み取りの間隔。`java.time.Duration` としても利用可能です。 |

メトリクスエクスポーターが登録されていない場合、メトリクスは無効になります。メトリクスは Java OpenTelemetry SDK に支えられた JVM 限定の機能です。Kotlin Multiplatform SDK 0.2.0 では、まだメトリクス API は公開されていません。

#### addMetricFilter

特定のメトリクスインストゥルメントに対して報告される属性キーを制限します。これにより、リストにない属性を削除する OpenTelemetry の `View` がインストールされます。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------------|---------------|----------|---------------|-------------------------------------------------------------|
| `metricName`    | `String`      | はい |               | フィルターを適用するメトリクスインストゥルメントの名前。 |
| `keysToRetain`  | `Set<String>` | はい |               | このメトリクスで保持すべき属性キー。 |

これを使用して、高カーディナリティ（high-cardinality）な属性（リクエスト識別子など）がメトリクスバックエンドを圧迫するのを防ぎつつ、メトリクス自体はエクスポートし続けることができます。

### 高度な設定

より高度な設定を行うために、リソース属性をカスタマイズして、テレメトリデータを生成しているプロセスに関する情報をさらに追加することもできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // サービス情報を設定
        setServiceInfo("my-agent-service", "1.0.0")
        
        // Logging エクスポーターを追加
        addSpanExporter(LoggingSpanExporter.create())
    
        // リソース属性を追加
        addResourceAttributes(mapOf(
            "custom.attribute" to "custom-value")
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // サービス情報を設定
        config.setServiceInfo("my-agent-service", "1.0.0");

        // Logging エクスポーターを追加
        config.addSpanExporter(LoggingSpanExporter.create());

        // リソース属性を追加
        config.addResourceAttributes(Map.of(
            "custom.attribute", "custom-value"
        ));
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava03.java -->

#### リソース属性

リソース属性は、テレメトリデータを生成するプロセスに関する追加情報を表します。Koog には、デフォルトで設定される一連のリソース属性が含まれています。

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 属性のデフォルト値は `ai.koog` であり、`service.version` のデフォルト値は現在使用されている Koog ライブラリのバージョンです。

デフォルトのリソース属性に加えて、カスタム属性を追加することもできます。Koog の OpenTelemetry 設定にカスタム属性を追加するには、引数としてキーと値を受け取る `addResourceAttributes()` メソッドを使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
    -->
    <!--- SUFFIX
            }
        }
    )
    -->
    ```kotlin
    addResourceAttributes(mapOf(
        "custom.attribute" to "custom-value")
    )
    ```
    <!--- KNIT example-opentelemetry-support-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava04 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .install(OpenTelemetry.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    config.addResourceAttributes(Map.of(
        "custom.attribute", "custom-value"
    ));
    ```
    <!--- KNIT exampleOpentelemetrySupportJava04.java -->

## トレースの対象

OpenTelemetry 機能は以下のエージェント活動をキャプチャします。

- **エージェントのライフサイクルイベント**: エージェントの開始、停止、エラー
- **LLM インタラクション**: プロンプト、レスポンス、トークン使用量、レイテンシ、および失敗（LLM 呼び出しが例外を投げた場合、スパンはスパンステータ `ERROR` および `error.type` でマークされます）
- **ツールの呼び出し**: ツール実行のトレース
- **システムコンテキスト**: モデル名、環境、Koog バージョンなどのメタデータ

デフォルトでは、機密データの露出を避けるため、エクスポートされたスパン内の LLM のプロンプトとレスポンスの内容はマスクされます。完全な内容を含めるには、[`setVerbose(true)`](#setverbose) を呼び出してください。

個々のスパンの種類と属性の詳細な内訳については、[スパンの種類と属性](#span-types-and-attributes) を参照してください。

## スパンの種類と属性

OpenTelemetry 機能は、エージェント内のさまざまな操作を追跡するために、異なる種類のスパンを自動的に作成します。

- **CreateAgentSpan**: エージェントを実行したときに作成され、エージェントが閉じられるかプロセスが終了したときに閉じられます。
- **InvokeAgentSpan**: エージェントの呼び出し。
- **StrategySpan**: エージェントの戦略（最上位の実行フロー）の実行。
- **NodeExecuteSpan**: エージェントの戦略内のノードの実行。これは Koog 固有のカスタムスパンです。
- **SubgraphExecuteSpan**: エージェント戦略内のサブグラフの実行。これは Koog 固有のカスタムスパンです。
- **InferenceSpan**: LLM の呼び出し。
- **ExecuteToolSpan**: ツールの呼び出し。
- **McpClientSpan**: MCP (Model Context Protocol) クライアント操作。このスパンは、MCP に関する OpenTelemetry セマンティック・コンベンションに従います。

スパンは入れ子になった階層構造で構成されます。スパン構造の例を以下に示します。

```text
CreateAgentSpan
    InvokeAgentSpan
        StrategySpan
            NodeExecuteSpan
                InferenceSpan
            NodeExecuteSpan
                ExecuteToolSpan
            SubgraphExecuteSpan
                NodeExecuteSpan
                    InferenceSpan
```
<!--- KNIT example-opentelemetry-support-01.txt -->

### スパン属性

スパン属性は、スパンに関連するメタデータを提供します。各スパンには独自の属性セットがありますが、一部のスパンでは属性が重複する場合もあります。

Koog は、OpenTelemetry の [生成 AI スパン用セマンティック・コンベンション](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) に従った定義済み属性のリストをサポートしています。例えば、コンベンションでは `gen_ai.conversation.id` という属性を定義しており、これは通常スパンに必須の属性です。Koog では、この属性の値はエージェント実行のユニークな識別子であり、`agent.run()` メソッドを呼び出したときに自動的に設定されます。

さらに、Koog にはカスタムの Koog 固有属性も含まれています。これらの属性のほとんどは `koog.` プレフィックスで識別できます。利用可能なカスタム属性は以下の通りです。

- `koog.strategy.name`: エージェント戦略の名前。戦略はエージェントの目的を記述する Koog 関連のエンティティです。`StrategySpan` スパンで使用されます。
- `koog.node.id`: 実行されているノードの識別子（名前）。`NodeExecuteSpan` スパンで使用されます。
- `koog.node.input`: 実行開始時にノードに渡された入力。ノード開始時の `NodeExecuteSpan` に存在します。
- `koog.node.output`: 完了時にノードによって生成された出力。ノードが正常に完了したときの `NodeExecuteSpan` に存在します。
- `koog.subgraph.id`: 実行されているサブグラフの識別子（名前）。`SubgraphExecuteSpan` スパンで使用されます。
- `koog.subgraph.input`: 実行開始時にサブグラフに渡された入力。サブグラフ開始時の `SubgraphExecuteSpan` に存在します。
- `koog.subgraph.output`: 完了時にサブグラフによって生成された出力。サブグラフが正常に完了したときの `SubgraphExecuteSpan` に存在します。
- `koog.moderation.result`: LLM 呼び出しに対する JSON エンコードされたモデレーション結果（利用可能な場合）。モデレーションが実行された場合のみ `InferenceSpan` に存在します。OpenTelemetry 生成 AI セマンティック・コンベンションにはモデレーション属性が定義されていないため、Koog はこれを `koog.` 名前空間の下で公開します。

### メッセージ内容

OpenTelemetry 生成 AI セマンティック・コンベンションに従い、メッセージ内容はメッセージごとのイベントではなく、2 つのスパン属性を介して `InferenceSpan` に保持されます。

- `gen_ai.input.messages`: モデルに送信されたメッセージ（system / user / assistant / tool ロール）の JSON 配列。
- `gen_ai.output.messages`: モデルから返されたメッセージの JSON 配列。

Koog の以前のバージョンでは、メッセージ内容をキャプチャするためにメッセージごとの OpenTelemetry イベント (`gen_ai.system.message`, `gen_ai.user.message`, `gen_ai.assistant.message`, `gen_ai.tool.message`, `gen_ai.choice`) を出力していました。これらのイベントは OpenTelemetry 生成 AI 仕様から削除されたため、Koog からも出力されなくなりました。インデックス化された `gen_ai.prompt.{i}.*` / `gen_ai.completion.{i}.*` 形式を依然として期待するバックエンド（Langfuse、Weave）は、対応するスパンアダプターを介して引き続きそれらを受信します。

## メトリクス

スパンに加えて、OpenTelemetry 機能は OpenTelemetry の [生成 AI メトリクス用セマンティック・コンベンション](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-metrics/) に従ったメトリクスを出力します。メトリクスは [addMetricExporter](#addmetricexporter) を介して設定されたメータープロバイダーを通じてエクスポートされます。エクスポーターが登録されていない場合、デフォルトでコンソールの `LoggingMetricExporter` が使用されます。

以下のインストゥルメント（計測器）が登録されます。

| 名前 | インストゥルメント | 単位 | 説明 |
|-------------------------------------|------------|---------|-------------------------------------------------------------------------------------------------------------|
| `gen_ai.client.token.usage`         | Histogram  | `{token}` | 各 LLM 呼び出しに対して報告されるトークン使用量。`gen_ai.token.type` (`input`/`output`) で分割されます。 |
| `gen_ai.client.operation.duration`  | Histogram  | `s`     | 生成 AI 操作の所要時間。`text_completion` (LLM 呼び出し) と `execute_tool` (ツール呼び出し) の両方が対象です。 |
| `koog.gen_ai.client.tool.call.count`| Counter    | `{call}` | エージェントによって実行されたツール呼び出しの Koog 固有カウンター。ツール名と呼び出しステータスでラベル付けされます。 |

セマンティック・コンベンションに沿って、明示的なヒストグラムバケット境界がアドバイスとして提供されます。

- `gen_ai.client.token.usage`: `[1, 4, 16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864]`
- `gen_ai.client.operation.duration`: `[0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.28, 2.56, 5.12, 10.24, 20.48, 40.96, 81.92]`

### gen_ai.provider.name

すべてのデータポイントには `gen_ai.provider.name` 属性が付与されます。

- `text_completion` 操作の場合、値は LLM プロバイダー ID（例: `openai`, `anthropic`）です。
- `execute_tool` 操作の場合、ツールの実行はサードパーティプロバイダーではなくプロセス内で発生するため、値は `koog` になります。MCP ツール実行はこの値を維持しつつ、対応するスパン上の個別の `mcp.*` 属性を通じて MCP 固有の詳細を表示します。これにより、ツールメトリクスのカーディナリティを低く保つことができます。

### error.type

`error.type` は、生成 AI セマンティック・コンベンションの要件に従い、失敗した `gen_ai.client.operation.duration` データポイントにのみ設定されます。値は失敗の原因となったエラーの正規の Java クラス名であるため、例外階層によって制限され、メトリクスディメンションとして安全に使用できます。

- `AIAgentError` のサブクラス — `execute_tool` の失敗およびツールの検証失敗用。
- LLM クライアントまたはエージェントランタイムによって発生した任意の `Throwable` — エージェントレベルの失敗フックを通じて表面化する `text_completion` の失敗用。
- `_OTHER` — 関連するエラーなしにエージェントのクローズ時などで実行中の操作がフラッシュされた場合のフォールバック。

この属性は、成功した操作には設定されません。

### restrictToolNameCardinality

ツールメトリクスには `gen_ai.tool.name` がラベル付けされます。名前が動的またはユーザー生成であるツールを公開する場合、ツール名のカーディナリティが無制限に増加する可能性があります。`restrictToolNameCardinality` を使用して、許可リスト外の名前を単一のフォールバック値にマップしてください。

任意のインストゥルメントおよび属性キーに適用されるメトリクス固有 of 属性フィルタリングについては、[addMetricFilter](#addmetricfilter) を使用してください。

## エクスポーター

エクスポーターは、収集されたテレメトリデータを OpenTelemetry コレクター、または他の種類の宛先やバックエンド実装に送信します。エクスポーターを追加するには、OpenTelemetry 機能をインストールするときに `addSpanExporter()` メソッドを使用します。このメソッドは以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト | 説明 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | はい |         | カスタムスパンエクスポーターのリストに追加される SpanExporter インスタンス。 |

以下のセクションでは、最も一般的に使用されるエクスポーターの一部について説明します。Koog は Kotlin SDK と Java SDK の両方のエクスポーターを受け入れます。Java SDK エクスポーターは互換ブリッジを介して自動的に変換されます。

!!! note
カスタムエクスポーターを設定しない場合、Koog はデフォルトでコンソールの標準出力（stdout）エクスポーターを使用します。これはローカルでの開発やデバッグに役立ちます。

### Logging エクスポーター

トレース情報をコンソールに出力するロギングエクスポーターです。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) は、`opentelemetry-java` SDK の一部です。

このタイプのエクスポートは、開発およびデバッグ目的に便利です。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // logging エクスポーターを追加
        addSpanExporter(LoggingSpanExporter.create())
        // 必要に応じてさらにエクスポーターを追加
    }
    ```
    <!--- KNIT example-opentelemetry-support-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava05 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // logging エクスポーターを追加
        config.addSpanExporter(LoggingSpanExporter.create());
        // 必要に応じてさらにエクスポーターを追加
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava05.java -->

### OpenTelemetry HTTP エクスポーター

OpenTelemetry HTTP エクスポーター (`OtlpHttpSpanExporter`) は、`opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) の一部であり、HTTP を介してバックエンドにスパンデータを送信します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import java.util.concurrent.TimeUnit
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    const val AUTH_STRING = ""
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // OpenTelemetry HTTP エクスポーターを追加
        addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // コレクターがエクスポートされたスパンのバッチを処理するのを待機する最大時間を設定
                .setTimeout(30, TimeUnit.SECONDS)
                // 接続先の OpenTelemetry エンドポイントを設定
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // Authorization ヘッダーを追加
                .addHeader("Authorization", "Basic $AUTH_STRING")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
    import java.util.concurrent.TimeUnit;
    public class exampleOpentelemetrySupportJava06 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            String AUTH_STRING = "";
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // OpenTelemetry HTTP エクスポーターを追加
        config.addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // コレクターがエクスポートされたスパンのバッチを処理するのを待機する最大時間を設定
                .setTimeout(30, TimeUnit.SECONDS)
                // 接続先の OpenTelemetry エンドポイントを設定
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // Authorization ヘッダーを追加
                .addHeader("Authorization", "Basic " + AUTH_STRING)
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava06.java -->

### OpenTelemetry gRPC エクスポーター

OpenTelemetry gRPC エクスポーター (`OtlpGrpcSpanExporter`) は、`opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) の一部です。これは gRPC を介してバックエンドにテレメトリデータをエクスポートし、データを受信するバックエンド、コレクター、またはエンドポイントのホストとポートを定義できます。デフォルトのポートは `4317` です。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // OpenTelemetry gRPC エクスポーターを追加
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // ホストとポートを設定
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava07 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // OpenTelemetry gRPC エクスポーターを追加
        config.addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // ホストとポートを設定
                .setEndpoint("http://localhost:4317")
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava07.java -->

## Langfuse との統合

Langfuse は、LLM/エージェントのワークロードに対するトレースの可視化と分析を提供します。

Koog を設定して、ヘルパー関数を使用して OpenTelemetry トレースを直接 Langfuse にエクスポートすることができます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor 
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addLangfuseExporter(
            langfuseUrl = "https://cloud.langfuse.com",
            langfusePublicKey = "...",
            langfuseSecretKey = "..."
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.agents.features.opentelemetry.integration.langfuse.LangfuseKt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava08 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        LangfuseKt.addLangfuseExporter(
            config,
            "https://cloud.langfuse.com",
            "...",
            "..."
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava08.java -->

Langfuse との統合に関する詳細は、[完全なドキュメント](opentelemetry-langfuse-exporter.md) をお読みください。

## W&B Weave との統合

W&B Weave は、LLM/エージェントのワークロードに対するトレースの可視化と分析を提供します。W&B Weave との統合は、定義済みのエクスポーターを介して設定できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addWeaveExporter(
            weaveOtelBaseUrl = "https://trace.wandb.ai",
            weaveEntity = "my-team",
            weaveProjectName = "my-project",
            weaveApiKey = "..."
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-09.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.agents.features.opentelemetry.integration.weave.WeaveKt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava09 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        WeaveKt.addWeaveExporter(
            config,
            "https://trace.wandb.ai",
            "my-team",
            "my-project",
            "..."
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava09.java -->

W&B Weave との統合に関する詳細は、[完全なドキュメント](opentelemetry-weave-exporter.md) をお読みください。

## Datadog との統合

Datadog は、クラウドスケールのアプリケーション向けのモニタリング、オブザーバビリティ、および分析を提供します。Datadog との統合は、定義済みのエクスポーターを介して設定できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addDatadogExporter(
            datadogApiKey = "...",
            url = "datadoghq.com"
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.agents.features.opentelemetry.integration.datadog.DatadogKt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava10 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        DatadogKt.addDatadogExporter(
            config,
            "...",           // datadogApiKey
            "datadoghq.com"  // url
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava10.java -->

Datadog との統合に関する詳細は、[完全なドキュメント](opentelemetry-datadog-exporter.md) をお読みください。

## Jaeger との統合

Jaeger は、OpenTelemetry で動作する人気のある分散トレースシステムです。Koog リポジトリの `examples` 内にある `opentelemetry` ディレクトリには、Jaeger と Koog エージェントで OpenTelemetry を使用する例が含まれています。

### 前提条件

Koog と Jaeger で OpenTelemetry をテストするには、提供されている `docker-compose.yaml` ファイルを使用して、Jaeger OpenTelemetry オールインワン・プロセスを開始します。以下のコマンドを実行してください。

```bash
docker compose up -d
```
<!--- KNIT example-opentelemetry-support-02.txt -->

提供されている Docker Compose YAML ファイルの内容は以下の通りです。

```yaml
# docker-compose.yaml
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:1.39
    container_name: jaeger-all-in-one
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "4317:4317"
      - "16686:16686"
```
<!--- KNIT example-opentelemetry-support-03.txt -->

Jaeger UI にアクセスしてトレースを表示するには、`http://localhost:16686` を開いてください。

### 例

Jaeger で使用するためにテレメトリデータをエクスポートする際、この例では `opentelemetry-java` SDK の `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) と `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) を使用します。

以下は完全なコードサンプルです。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.utils.io.use
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
    --> 
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // ローカルデバッグ用にコンソールロガーを追加
                addSpanExporter(LoggingSpanExporter.create())

                // OpenTelemetry コレクターにトレースを送信
                addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                )
            }
        }

        agent.use { agent ->
            println("Running the agent with OpenTelemetry tracing...")

            val result = agent.run("Tell me a joke about programming")

            println("Agent run completed with result: '$result'." +
                    "
Check Jaeger UI at http://localhost:16686 to view traces")
        }
    }
    ```
    <!--- KNIT example-opentelemetry-support-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava11 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.O4Mini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config -> {
                // ローカルデバッグ用にコンソールロガーを追加
                config.addSpanExporter(LoggingSpanExporter.create());

                // OpenTelemetry コレクターにトレースを送信
                config.addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                );
            })
            .build();

        System.out.println("Running the agent with OpenTelemetry tracing...");

        var result = agent.run("Tell me a joke about programming");

        System.out.println(
            "Agent run completed with result: '" + result + "'." +
                "
Check Jaeger UI at http://localhost:16686 to view traces"
        );
    }
    ```
    <!--- KNIT exampleOpentelemetrySupportJava11.java -->

## トラブルシューティング

### よくある問題

1. **バックエンドにトレースが表示されない**
    - 必要なすべての環境変数がシェルで設定およびエクスポートされているか確認してください。
    - API キーまたはシークレットが有効であり、失効しておらず、書き込み/トレース権限があることを確認してください。
    - サービスが実行されており、OpenTelemetry ポート (4317) にアクセス可能であることを確認してください。
    - エクスポーターが正しいエンドポイントで設定されているか確認してください。
    - エージェントの実行後、トレースが表示されるまで数秒待ってください。

2. **接続の問題**
    - 環境がエクスポーターのインテーク（取り込み）エンドポイントに到達可能であることを確認してください。
    - 送信 HTTPS トラフィックをブロックするファイアウォールまたはプロキシ設定がないか確認してください。

3. **スパンが不足している、またはトレースが不完全である**
    - エージェントの実行が正常に完了することを確認してください。
    - エージェントの実行後、アプリケーションをすぐに終了していないか確認してください。
    - スパンがエクスポートされる時間を確保するために、エージェント実行後に遅延を追加してください。

4. **スパンの数が多すぎる**
    - `sampler` プロパティを設定して、別のサンプリング戦略を使用することを検討してください。
    - 例えば、`Sampler.traceIdRatioBased(0.1)` を使用して、トレースの 10% のみをサンプリングするようにします。

5. **スパンアダプターが互いに上書きされる**
    - 現在、OpenTelemetry エージェント機能は複数のスパンアダプターの適用をサポートしていません [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) テレメトリのサポート

Koog は、[公式の OpenTelemetry MCP 用セマンティック・コンベンション](https://github.com/open-telemetry/semantic-conventions/pull/2083) に従って、MCP 操作に対する包括的な OpenTelemetry インスツルメンテーションを提供します。

### 概要

MCP テレメトリサポートには以下が含まれます。

- ツール実行スパンへの MCP 固有属性の **自動エンリッチメント**
- MCP クライアント操作 (tools/call) の **クライアントサイド・インスツルメンテーション**
- 必須、条件付き必須、および推奨されるすべての属性を備えた **完全なセマンティック・コンベンションへの準拠**

### MCP 属性

MCP テレメトリは OpenTelemetry セマンティック・コンベンションに従い、以下の属性グループが含まれます。

**必須属性:**
- `mcp.method.name`: MCP メソッド名 (例: "tools/call")

**条件付き必須属性:**
- `gen_ai.tool.name`: 操作にツールが含まれる場合
- `gen_ai.prompt.name`: 操作にプロンプトが含まれる場合
- `jsonrpc.request.id`: リクエストを実行する場合（通知ではない場合）
- `error.type`: 操作が失敗した場合

**推奨属性:**
- `mcp.session.id`: セッション識別子
- `mcp.protocol.version`: MCP プロトコルバージョン (例: "2025-06-18")
- `network.transport`: トランスポートタイプ (標準入出力の場合は "pipe"、HTTP の場合は "tcp")
- `server.address` および `server.port`: クライアント操作用

### スパンの命名規則

MCP スパンは次の命名規則に従います: `{mcp.method.name} {target}`

ここで `{target}` は、該当する場合のツール名またはプロンプト名です。例：
- `"tools/call search"` - "search" という名前のツールを呼び出す場合

### ベストプラクティス

- 永続的な MCP セッションを操作する場合は、セッションの追跡を可能にするために **常にセッション ID を設定** してください。
- 完全なリクエストトレースのために、JSON-RPC リクエストから **リクエスト ID を伝播** させてください。
- MCP 操作のパフォーマンスのボトルネックを特定するために **メトリクスを監視** してください。

### 例: テレメトリを備えた完全な MCP クライアント

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.mcp.McpToolRegistryProvider
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.utils.io.use
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import kotlinx.coroutines.runBlocking
    fun main() {
        runBlocking {
            val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    // MCP ツールレジストリを作成
    val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")
    
    // OpenTelemetry を有効にしてエージェントを作成し、ツールレジストリを渡す
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry
    ) {
        install(OpenTelemetry) {
            setServiceInfo("mcp-agent-service", "1.0.0")
            addSpanExporter(LoggingSpanExporter.create())
        }
    }
    
    // エージェントを実行 - MCP ツールの呼び出しは自動的にインスツルメントされる
    agent.use {
        it.run("Use the search tool to find information")
    }
    ```
    <!--- KNIT example-opentelemetry-support-12.kt -->

このセットアップにより、OpenTelemetry のベストプラクティスとセマンティック・コンベンションに従って、最小限のコード変更で MCP 操作の完全な可観測性が提供されます。