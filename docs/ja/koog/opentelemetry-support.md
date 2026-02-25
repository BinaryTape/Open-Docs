# OpenTelemetryのサポート

このページでは、AIエージェントのトレースとモニタリングを行うためのKoogエージェントフレームワーク（agentic framework）におけるOpenTelemetryサポートの詳細について説明します。

## 概要

OpenTelemetryは、アプリケーションからテレメトリデータ（トレース）を生成、収集、エクスポートするためのツールを提供するオブザーバビリティフレームワークです。KoogのOpenTelemetry機能を使用すると、AIエージェントに計装（instrumentation）を施してテレメトリデータを収集できます。これにより、以下のことが可能になります。

- エージェントのパフォーマンスと動作の監視
- 複雑なエージェントワークフローにおける問題のデバッグ
- エージェントの実行フローの可視化
- LLM呼び出しとツール使用の追跡
- エージェントの動作パターンの分析

## OpenTelemetryの主要な概念

- **スパン (Spans)**: スパンは、分散トレース内における個々の作業単位または操作を表します。エージェントの実行、関数呼び出し、LLM呼び出し、ツール呼び出しなど、アプリケーションにおける特定の活動の開始と終了を示します。
- **属性 (Attributes)**: 属性は、スパンなどのテレメトリ関連アイテムに関するメタデータを提供します。属性はキーと値のペアで表されます。
- **イベント (Events)**: イベントは、スパンの存続期間中の特定の時点（スパン関連イベント）であり、発生した注目すべき出来事を表します。
- **エクスポーター (Exporters)**: エクスポーターは、収集されたテレメトリデータをさまざまなバックエンドや出力先に送信する役割を担うコンポーネントです。
- **コレクター (Collectors)**: コレクターは、テレメトリデータを受信、処理、エクスポートします。アプリケーションとオブザーバビリティバックエンドの中間体として機能します。
- **サンプラー (Samplers)**: サンプラーは、サンプリング戦略に基づいてトレースを記録するかどうかを決定します。これらはテレメトリデータの量を管理するために使用されます。
- **リソース (Resources)**: リソースは、テレメトリデータを生成するエンティティを表します。これらはリソース属性によって識別されます。リソース属性は、リソースに関する情報を提供するキーと値のペアです。

KoogのOpenTelemetry機能は、以下を含むさまざまなエージェントイベントに対してスパンを自動的に作成します。

- エージェントの実行開始と終了
- ノードの実行
- LLM呼び出し
- ツール呼び出し

## インストール

KoogでOpenTelemetryを使用するには、エージェントにOpenTelemetry機能を追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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

## 設定

### 基本設定

エージェントでOpenTelemetry機能を設定する際に使用できる、利用可能なプロパティの全リストは以下の通りです。

| 名前 | データ型 | デフォルト値 | 説明 |
|------------------|--------------------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 計装されるサービスの名前。 |
| `serviceVersion` | `String`           | 現在のKoogライブラリのバージョン | 計装されるサービスのバージョン。 |
| `isVerbose`      | `Boolean`          | `false`                      | OpenTelemetry設定のデバッグ用に詳細なロギングを有効にするかどうか。 |
| `sdk`            | `OpenTelemetrySdk` |                              | テレメトリ収集に使用するOpenTelemetry SDKインスタンス。 |
| `tracer`         | `Tracer`           |                              | スパンの作成に使用されるOpenTelemetryトレーサーインスタンス。 |

!!! note
    `sdk` と `tracer` プロパティはアクセス可能な公開プロパティですが、設定は以下に記載する公開メソッドを使用してのみ行うことができます。

`OpenTelemetryConfig` クラスには、さまざまな設定項目に関連するアクションを表すメソッドも含まれています。以下は、基本的な設定項目セットを使用してOpenTelemetry機能をインストールする例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

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
    // サービス情報の設定
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Loggingエクスポーターの追加
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

利用可能なメソッドのリファレンスについては、以下のセクションを参照してください。

#### setServiceInfo

名前とバージョンを含むサービス情報を設定します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | はい |               | 計装されるサービスの名前。 |
| `serviceVersion`   | String    | はい |               | 計装されるサービスのバージョン。 |

#### addSpanExporter

テレメトリデータを外部システムに送信するためのスパンエクスポーターを追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | はい |               | カスタムスパンエクスポーターのリストに追加される `SpanExporter` インスタンス。 |

#### addSpanProcessor

エクスポートされる前にスパンを処理するためのスパンプロセッサーファクトリを追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-------------|-----------------------------------|----------|---------------|--------------------------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | はい |               | 指定されたエクスポーターのスパンプロセッサーを作成する関数。エクスポーターごとに処理をカスタマイズできます。 |

#### addResourceAttributes

サービスに関する追加のコンテキストを提供するためのリソース属性を追加します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | はい |               | サービスに関する追加の詳細を提供するキーと値のペア。 |

#### setSampler

どのスパンを収集するかを制御するサンプリング戦略を設定します。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | はい |               | OpenTelemetry設定に使用するサンプラーインスタンス。 |

#### setVerbose

詳細なロギングを有効または無効にします。以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト値 | 説明 |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | はい | `false`       | trueの場合、アプリケーションはより詳細なテレメトリデータを収集します。 |

!!! note

    セキュリティ上の理由から、OpenTelemetryスパンの一部のコンテンツはデフォルトでマスクされています。例えば、LLMメッセージは実際のメッセージ内容ではなく `HIDDEN:non-empty` としてマスクされます。コンテンツを取得するには、`verbose` 引数の値を `true` に設定してください。

#### setSdk

設定済みの `OpenTelemetrySdk` インスタンスを注入します。

- `setSdk(sdk)` を呼び出すと、提供されたSDKがそのまま使用され、`addSpanExporter`、`addSpanProcessor`、`addResourceAttributes`、または `setSampler` を介して適用されたカスタム設定は無視されます。
- トレーサーの計装スコープ（instrumentation scope）の名前とバージョンは、サービス情報に合わせて調整されます。

| 名前 | データ型 | 必須 | 説明 |
|-------|--------------------|----------|---------------------------------------|
| `sdk` | `OpenTelemetrySdk` | はい | エージェントで使用するSDKインスタンス。 |

### 高度な設定

より高度な設定として、以下の設定オプションをカスタマイズすることもできます。

- サンプラー (Sampler): 収集データの頻度と量を調整するためにサンプリング戦略を設定します。
- リソース属性 (Resource attributes): テレメトリデータを生成しているプロセスに関する情報を追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.sdk.trace.samplers.Sampler

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
    // サービス情報の設定
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Loggingエクスポーターの追加
    addSpanExporter(LoggingSpanExporter.create())
    
    // サンプラーの設定 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // リソース属性の追加
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### サンプラー (Sampler)

サンプラーを定義するには、使用したいサンプリング戦略を表す `opentelemetry-java` SDKの `Sampler` クラス (`io.opentelemetry.sdk.trace.samplers.Sampler`) の対応するメソッドを使用します。

デフォルトのサンプリング戦略は以下の通りです。

- `Sampler.alwaysOn()`: すべてのスパン（トレース）がサンプリングされるデフォルトのサンプリング戦略です。

利用可能なサンプラーとサンプリング戦略の詳細については、OpenTelemetryの [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) ドキュメントを参照してください。

#### リソース属性 (Resource attributes)

リソース属性は、テレメトリデータを生成するプロセスに関する追加情報を表します。Koogには、デフォルトで設定されるリソース属性のセットが含まれています。

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 属性のデフォルト値は `ai.koog` であり、`service.version` のデフォルト値は現在使用されているKoogライブラリのバージョンです。

デフォルトのリソース属性に加えて、カスタム属性を追加することもできます。KoogでOpenTelemetry設定にカスタム属性を追加するには、キーと値を引数として取る `addResourceAttributes()` メソッドを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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
    AttributeKey.stringKey("custom.attribute") to "custom-value")
)
```
<!--- KNIT example-opentelemetry-support-04.kt -->

## スパンの種類と属性

OpenTelemetry機能は、エージェント内のさまざまな操作を追跡するために、異なる種類のスパンを自動的に作成します。

- **CreateAgentSpan**: エージェントを実行したときに作成され、エージェントが閉じられるかプロセスが終了したときに閉じられます。
- **InvokeAgentSpan**: エージェントの呼び出し。
- **StrategySpan**: エージェントの戦略（トップレベルの実行フロー）の実行。
- **NodeExecuteSpan**: エージェントの戦略におけるノードの実行。これはKoog固有のカスタムスパンです。
- **SubgraphExecuteSpan**: エージェントの戦略内におけるサブグラフの実行。これはKoog固有のカスタムスパンです。
- **InferenceSpan**: LLM呼び出し。
- **ExecuteToolSpan**: ツール呼び出し。
- **McpClientSpan**: MCP (Model Context Protocol) クライアント操作。このスパンは、MCPのOpenTelemetryセマンティックコンベンション（semantic conventions）に従います。

スパンは、入れ子になった階層構造で構成されます。以下はスパン構造の例です。

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

### スパン属性

スパン属性は、スパンに関連するメタデータを提供します。各スパンには独自の属性セットがありますが、一部のスパンでは属性が重複する場合もあります。

Koogは、OpenTelemetryの [生成AIイベントのためのセマンティックコンベンション](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) に従った事前定義済みの属性リストをサポートしています。例えば、コンベンションでは `gen_ai.conversation.id` という名前の属性が定義されており、これは通常、スパンに必要な属性です。Koogでは、この属性の値はエージェント実行の一意の識別子であり、`agent.run()` メソッドを呼び出すと自動的に設定されます。

さらに、KoogにはカスタムのKoog固有の属性も含まれています。これらの属性のほとんどは `koog.` プレフィックスで識別できます。利用可能なカスタム属性は以下の通りです。

- `koog.strategy.name`: エージェント戦略の名前。戦略は、エージェントの目的を記述するKoog関連のエンティティです。`StrategySpan` スパンで使用されます。
- `koog.node.id`: 実行されているノードの識別子（名前）。`NodeExecuteSpan` スパンで使用されます。
- `koog.node.input`: 実行開始時にノードに渡された入力。ノード開始時の `NodeExecuteSpan` に存在します。
- `koog.node.output`: 完了時にノードによって生成された出力。ノードが正常に完了した際の `NodeExecuteSpan` に存在します。
- `koog.subgraph.id`: 実行されているサブグラフの識別子（名前）。`SubgraphExecuteSpan` スパンで使用されます。
- `koog.subgraph.input`: 実行開始時にサブグラフに渡された入力。サブグラフ開始時の `SubgraphExecuteSpan` に存在します。
- `koog.subgraph.output`: 完了時にサブグラフによって生成された出力。サブグラフが正常に完了した際の `SubgraphExecuteSpan` に存在します。

### イベント

スパンには、スパンに付随する「イベント」を含めることもできます。イベントは、何らかの関連する出来事が発生した特定の時点を記述します。例えば、LLM呼び出しが開始または終了したときなどです。イベントにも属性があり、さらに「イベントボディフィールド (event body fields)」が含まれます。

OpenTelemetryの [生成AIイベントのためのセマンティックコンベンション](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) に沿って、以下のイベントタイプがサポートされています。

- **SystemMessageEvent**: モデルに渡されたシステム指示。
- **UserMessageEvent**: モデルに渡されたユーザーメッセージ。
- **AssistantMessageEvent**: モデルに渡されたアシスタントメッセージ。
- **ToolMessageEvent**: モデルに渡されたツールまたは関数呼び出しからのレスポンス。
- **ChoiceEvent**: モデルからのレスポンスメッセージ。
- **ModerationResponseEvent**: モデルのモデレーション結果またはシグナル。

!!! note   
    `opentelemetry-java` SDKは、イベント追加時のイベントボディフィールドパラメータをサポートしていません。そのため、KoogのOpenTelemetryサポートでは、イベントボディフィールドは、キーが `body` で値の型が文字列の独立した属性として扱われます。この文字列には、イベントボディフィールドのコンテンツまたはペイロードが含まれており、通常はJSON形式のオブジェクトです。イベントボディフィールドの例については、[OpenTelemetryドキュメント](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples) を参照してください。`opentelemetry-java` におけるイベントボディフィールドのサポート状況については、関連する [GitHub issue](https://github.com/open-telemetry/semantic-conventions/issues/1870) を参照してください。

## エクスポーター (Exporters)

エクスポーターは、収集されたテレメトリデータをOpenTelemetry Collector、またはその他の種類の出力先やバックエンド実装に送信します。エクスポーターを追加するには、OpenTelemetry機能をインストールする際に `addSpanExporter()` メソッドを使用します。このメソッドは以下の引数を取ります。

| 名前 | データ型 | 必須 | デフォルト | 説明 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | はい |         | カスタムスパンエクスポーターのリストに追加される SpanExporter インスタンス。 |

以下のセクションでは、`opentelemetry-java` SDKで最も一般的に使用されるエクスポーターに関する情報を提供します。

!!! note
    カスタムエクスポーターを設定しない場合、Koogはデフォルトでコンソールの `LoggingSpanExporter` を使用します。これは、ローカルでの開発やデバッグに役立ちます。

### Loggingエクスポーター

トレース情報をコンソールに出力するロギングエクスポーターです。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) は `opentelemetry-java` SDKの一部です。

このタイプのエクスポートは、開発およびデバッグの目的に有用です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

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
    // loggingエクスポーターの追加
    addSpanExporter(LoggingSpanExporter.create())
    // 必要に応じてさらにエクスポーターを追加
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTPエクスポーター

OpenTelemetry HTTPエクスポーター (`OtlpHttpSpanExporter`) は `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) の一部であり、HTTP経由でスパンデータをバックエンドに送信します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import java.util.concurrent.TimeUnit

const val apiKey = ""
const val AUTH_STRING = ""

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
   // OpenTelemetry HTTPエクスポーターの追加
   addSpanExporter(
      OtlpHttpSpanExporter.builder()
         // コレクターがエクスポートされたスパンのバッチを処理するのを待機する最大時間を設定
         .setTimeout(30, TimeUnit.SECONDS)
         // 接続先となるOpenTelemetryエンドポイントを設定
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // Authorizationヘッダーを追加
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPCエクスポーター

OpenTelemetry gRPCエクスポーター (`OtlpGrpcSpanExporter`) は `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) の一部です。これはgRPC経由でテレメトリデータをバックエンドにエクスポートし、データを受信するバックエンド、コレクター、またはエンドポイントのホストとポートを定義できます。デフォルトのポートは `4317` です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

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
   // OpenTelemetry gRPCエクスポーターの追加
   addSpanExporter(
      OtlpGrpcSpanExporter.builder()
          // ホストとポートを設定
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## Langfuseとの統合

Langfuseは、LLM/エージェントのワークロードに対するトレースの可視化と分析を提供します。

ヘルパー関数を使用して、OpenTelemetryトレースを直接LangfuseにエクスポートするようにKoogを設定できます。

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
    addLangfuseExporter(
        langfuseUrl = "https://cloud.langfuse.com",
        langfusePublicKey = "...",
        langfuseSecretKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-08.kt -->

Langfuseとの統合に関する [完全なドキュメント](opentelemetry-langfuse-exporter.md) をお読みください。

## W&B Weaveとの統合

W&B Weaveは、LLM/エージェントのワークロードに対するトレースの可視化と分析を提供します。W&B Weaveとの統合は、事前定義されたエクスポーターを介して設定できます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
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
    addWeaveExporter(
        weaveOtelBaseUrl = "https://trace.wandb.ai",
        weaveEntity = "my-team",
        weaveProjectName = "my-project",
        weaveApiKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-09.kt -->

W&B Weaveとの統合に関する [完全なドキュメント](opentelemetry-weave-exporter.md) をお読みください。

## Jaegerとの統合

Jaegerは、OpenTelemetryと連携する人気の分散トレースシステムです。Koogリポジトリ内の `examples` にある `opentelemetry` ディレクトリには、JaegerとKoogエージェントでOpenTelemetryを使用する例が含まれています。

### 前提条件

KoogとJaegerでOpenTelemetryをテストするには、提供されている `docker-compose.yaml` ファイルを使用し、次のコマンドを実行してJaeger OpenTelemetry all-in-oneプロセスを起動します。

```bash
docker compose up -d
```

提供されているDocker Compose YAMLファイルの内容は以下の通りです。

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

Jaeger UIにアクセスしてトレースを表示するには、`http://localhost:16686` を開きます。

### 例

Jaegerで使用するためにテレメトリデータをエクスポートするために、この例では `opentelemetry-java` SDKの `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) と `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) を使用します。

完全なコードサンプルは以下の通りです。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.utils.io.use
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "open-ai-api-key"

-->
```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // ローカルデバッグ用にコンソールロガーを追加
                addSpanExporter(LoggingSpanExporter.create())

                // トレースをOpenTelemetryコレクターに送信
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
}
```
<!--- KNIT example-opentelemetry-support-10.kt -->

## トラブルシューティング

### よくある問題

1. **Jaeger、Langfuse、またはW&B Weaveにトレースが表示されない**
    - サービスが実行されており、OpenTelemetryポート (4317) にアクセスできることを確認してください。
    - OpenTelemetryエクスポーターが正しいエンドポイントで設定されているか確認してください。
    - トレースがエクスポートされるまで、エージェント実行後数秒間待機してください。

2. **スパンの欠落または不完全なトレース**
    - エージェントの実行が正常に完了したことを確認してください。
    - エージェント実行直後にアプリケーションを終了していないか確認してください。
    - スパンがエクスポートされる時間を確保するために、エージェント実行後に遅延を追加してください。

3. **スパンの数が多すぎる**
    - `sampler` プロパティを設定して、別のサンプリング戦略を使用することを検討してください。
    - 例えば、`Sampler.traceIdRatioBased(0.1)` を使用すると、トレースの10%のみがサンプリングされます。

4. **スパンアダプターが互いに上書きし合う**
    - 現在、OpenTelemetryエージェント機能は、複数のスパンアダプターの適用をサポートしていません [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) テレメトリのサポート

Koogは、[MCPのための公式OpenTelemetryセマンティックコンベンション](https://github.com/open-telemetry/semantic-conventions/pull/2083) に従い、MCP操作のための包括的なOpenTelemetry計装を提供します。

### 概要

MCPテレメトリのサポートには以下が含まれます。

- MCP固有の属性によるツール実行スパンの **自動エンリッチメント**
- MCPクライアント操作（tools/call）の **クライアント側計装**
- すべての必須、条件付き必須、および推奨属性を含む **完全なセマンティックコンベンションへの準拠**

### MCP属性

MCPテレメトリはOpenTelemetryセマンティックコンベンションに従い、以下の属性グループを含みます。

**必須属性:**
- `mcp.method.name`: MCPメソッド名 (例: "tools/call")

**条件付き必須属性:**
- `gen_ai.tool.name`: 操作がツールに関連する場合
- `gen_ai.prompt.name`: 操作がプロンプトに関連する場合
- `jsonrpc.request.id`: （通知ではなく）リクエストを実行する場合
- `error.type`: 操作が失敗した場合

**推奨属性:**
- `mcp.session.id`: セッション識別子
- `mcp.protocol.version`: MCPプロトコルのバージョン (例: "2025-06-18")
- `network.transport`: トランスポートタイプ (stdioの場合は "pipe"、HTTPの場合は "tcp")
- `server.address` および `server.port`: クライアント操作の場合

### スパン命名規則

MCPスパンは、次の命名規則に従います: `{mcp.method.name} {target}`

ここで `{target}` は、該当する場合のツール名またはプロンプト名です。例:
- `"tools/call search"` - "search" という名前のツールを呼び出す場合

### ベストプラクティス

- 永続的なMCPセッションを扱う場合は、セッション追跡を可能にするために **常にセッションIDを設定** してください。
- 完全なリクエストトレースを行うために、JSON-RPCリクエストから **リクエストIDを伝播** させてください。
- MCP操作におけるパフォーマンスのボトルネックを特定するために **メトリクスを監視** してください。

### 例: テレメトリを備えた完全なMCPクライアント

```kotlin
// MCPツールレジストリを作成
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")

// OpenTelemetryを有効にしてエージェントを作成し、ツールレジストリを渡す
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry
) {
    install(OpenTelemetry) {
        setServiceInfo("mcp-agent-service", "1.0.0")
        addSpanExporter(LoggingSpanExporter.create())
    }
}

// エージェントを実行 - MCPツール呼び出しが自動的に計装されます
agent.use {
    it.run("Use the search tool to find information")
}
```

このセットアップにより、最小限のコード変更で、OpenTelemetryのベストプラクティスとセマンティックコンベンションに従ったMCP操作の完全なオブザーバビリティが提供されます。