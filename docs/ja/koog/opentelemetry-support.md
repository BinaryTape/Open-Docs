# OpenTelemetryのサポート

このページでは、AIエージェントのトレースと監視のために、KoogエージェントフレームワークにおけるOpenTelemetryのサポートについて詳しく説明します。

## 概要

OpenTelemetryは、アプリケーションからテレメトリーデータ（トレース）を生成、収集、エクスポートするためのツールを提供する可観測性フレームワークです。KoogのOpenTelemetry機能を使用すると、AIエージェントを計装してテレメトリーデータを収集できます。これは、以下の点で役立ちます。

- エージェントのパフォーマンスと挙動を監視する
- 複雑なエージェントのワークフローにおける問題をデバッグする
- エージェントの実行フローを可視化する
- LLM呼び出しとツール使用状況を追跡する
- エージェントの挙動パターンを分析する

## OpenTelemetryの主要な概念

- **Spans**: スパンは、分散トレース内の個々の作業単位または操作を表します。これらは、エージェントの実行、関数呼び出し、LLM呼び出し、ツール呼び出しなど、アプリケーション内の特定の活動の開始と終了を示します。
- **Attributes**: 属性は、スパンなどのテレメトリー関連アイテムに関するメタデータを提供します。属性はキーと値のペアとして表現されます。
- **Events**: イベントは、スパンのライフタイム中の特定の時点（スパン関連イベント）であり、発生した可能性のある注目すべき事柄を表します。
- **Exporters**: エクスポーターは、収集されたテレメトリーデータをさまざまなバックエンドまたは宛先に送信する役割を担うコンポーネントです。
- **Collectors**: コレクターは、テレメトリーデータを受信、処理、エクスポートします。これらはアプリケーションと可観測性バックエンドの間の仲介役として機能します。
- **Samplers**: サンプラーは、サンプリング戦略に基づいてトレースを記録するかどうかを決定します。これらはテレメトリーデータのボリュームを管理するために使用されます。
- **Resources**: リソースは、テレメトリーデータを生成するエンティティを表します。これらはリソース属性によって識別され、リソースに関する情報を提供するキーと値のペアです。

KoogのOpenTelemetry機能は、さまざまなエージェントイベントに対してスパンを自動的に作成します。これには以下が含まれます。

- エージェントの実行開始と終了
- ノードの実行
- LLM呼び出し
- ツール呼び出し

## インストール

KoogでOpenTelemetryを使用するには、OpenTelemetry機能をエージェントに追加します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
            // Configuration options go here
        }
    }
)
```
<!--- KNIT example-opentelemetry-support-01.kt -->

## 設定

### 基本設定

エージェントでOpenTelemetry機能を設定する際に設定できる利用可能なプロパティの完全なリストを以下に示します。

| Name             | Data type          | Default value                | Description                                                                  |
|:-----------------|:-------------------|:-----------------------------|:-----------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 計装されるサービスの名前。                                                   |
| `serviceVersion` | `String`           | Current Koog library version | 計装されるサービスのバージョン。                                             |
| `isVerbose`      | `Boolean`          | `false`                      | OpenTelemetry設定のデバッグのための詳細ログを有効にするかどうか。            |
| `sdk`            | `OpenTelemetrySdk` |                              | テレメトリー収集に使用するOpenTelemetry SDKインスタンス。                    |
| `tracer`         | `Tracer`           |                              | スパン作成に使用するOpenTelemetryトレーサーインスタンス。                    |

!!! note
    `sdk`および`tracer`プロパティは、アクセス可能なパブリックプロパティですが、以下にリストされているパブリックメソッドを使用してのみ設定できます。

`OpenTelemetryConfig`クラスには、異なる設定項目に関連するアクションを表すメソッドも含まれています。以下は、基本的な設定項目セットでOpenTelemetry機能をインストールする例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

利用可能なメソッドのリファレンスについては、以下のセクションを参照してください。

#### setServiceInfo

名前とバージョンを含むサービス情報を設定します。以下の引数を取ります。

| Name               | Data type | Required | Default value | Description                                                 |
|:-------------------|:----------|:---------|:--------------|:------------------------------------------------------------|
| `serviceName`      | String    | Yes      |               | 計装されるサービスの名前。                                  |
| `serviceVersion`   | String    | Yes      |               | 計装されるサービスのバージョン。                            |

#### addSpanExporter

テレメトリーデータを外部システムに送信するためのスパンエクスポーターを追加します。以下の引数を取ります。

| Name       | Data type      | Required | Default value | Description                                                                   |
|:-----------|:---------------|:---------|:--------------|:------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | Yes      |               | カスタムスパンエクスポーターのリストに追加する`SpanExporter`インスタンス。    |

#### addSpanProcessor

スパンがエクスポートされる前に処理するためのスパンプロセッサーファクトリを追加します。以下の引数を取ります。

| Name        | Data type                         | Required | Default value | Description                                                                                |
|:------------|:----------------------------------|:---------|:--------------|:-------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | Yes      |               | 指定されたエクスポーター用のスパンプロセッサーを作成する関数。エクスポーターごとに処理をカスタマイズできます。 |

#### addResourceAttributes

サービスに関する追加のコンテキストを提供するためのリソース属性を追加します。以下の引数を取ります。

| Name         | Data type                 | Required | Default value | Description                                                            |
|:-------------|:--------------------------|:---------|:--------------|:-----------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | Yes      |               | サービスに関する追加の詳細を提供するキーと値のペア。                   |

#### setSampler

どのスパンを収集するかを制御するためにサンプリング戦略を設定します。以下の引数を取ります。

| Name      | Data type | Required | Default value | Description                                                      |
|:----------|:----------|:---------|:--------------|:-----------------------------------------------------------------|
| `sampler` | `Sampler` | Yes      |               | OpenTelemetry設定のために設定するサンプラーインスタンス。        |

#### setVerbose

OpenTelemetry設定のデバッグ用の詳細ログを有効または無効にします。以下の引数を取ります。

| Name      | Data type | Required | Default value | Description                                                     |
|:----------|:----------|:---------|:--------------|:----------------------------------------------------------------|
| `verbose` | `Boolean` | Yes      | `false`       | trueの場合、アプリケーションはより詳細なテレメトリーデータを収集します。 |

#### setSdk

事前設定された`OpenTelemetrySdk`インスタンスを注入します。

- `setSdk(sdk)`を呼び出すと、提供されたSDKがそのまま使用され、`addSpanExporter`、`addSpanProcessor`、`addResourceAttributes`、または`setSampler`を介して適用されたカスタム設定はすべて無視されます。
- トレーサーの計装スコープ名/バージョンは、サービス情報と同期されます。

| Name | Data type         | Required | Description                           |
|:-----|:------------------|:---------|:--------------------------------------|
| `sdk`| `OpenTelemetrySdk`| Yes      | エージェントで使用するSDKインスタンス。 |

### 高度な設定

より高度な設定については、以下の設定オプションもカスタマイズできます。

- Sampler: 収集されるデータの頻度と量を調整するためにサンプリング戦略を設定します。
- Resource attributes: テレメトリーデータを生成しているプロセスに関する情報を追加します。

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
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    
    // Set the sampler 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // Add resource attributes
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### Sampler

サンプラーを定義するには、使用したいサンプリング戦略を表す`opentelemetry-java` SDKの`Sampler`クラス（`io.opentelemetry.sdk.trace.samplers.Sampler`）の対応するメソッドを使用します。

デフォルトのサンプリング戦略は以下の通りです。

- `Sampler.alwaysOn()`: すべてのスパン（トレース）がサンプリングされるデフォルトのサンプリング戦略。

利用可能なサンプラーとサンプリング戦略の詳細については、OpenTelemetryの[Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler)ドキュメントを参照してください。

#### Resource attributes

リソース属性は、テレメトリーデータを生成するプロセスに関する追加情報を表します。Koogには、デフォルトで設定される一連のリソース属性が含まれています。

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name`属性のデフォルト値は`ai.koog`であり、`service.version`のデフォルト値は現在使用されているKoogライブラリのバージョンです。

デフォルトのリソース属性に加えて、カスタム属性を追加することもできます。KoogでOpenTelemetry設定にカスタム属性を追加するには、OpenTelemetry設定で`addResourceAttributes()`メソッドを使用します。このメソッドはキーと値を引数として取ります。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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

OpenTelemetry機能は、エージェント内のさまざまな操作を追跡するために、異なるタイプのスパンを自動的に作成します。

- **CreateAgentSpan**: エージェントを実行すると作成され、エージェントが閉じられるか、プロセスが終了すると閉じられます。
- **InvokeAgentSpan**: エージェントの呼び出し。
- **NodeExecuteSpan**: エージェントの戦略におけるノードの実行。これはカスタムのKoog固有スパンです。
- **InferenceSpan**: LLM呼び出し。
- **ExecuteToolSpan**: ツール呼び出し。

スパンはネストされた階層構造で整理されます。以下はスパン構造の例です。

```text
CreateAgentSpan
    InvokeAgentSpan
        NodeExecuteSpan
            InferenceSpan
        NodeExecuteSpan
            ExecuteToolSpan
        NodeExecuteSpan
            InferenceSpan    
```

### スパン属性

スパン属性は、スパンに関連するメタデータを提供します。各スパンは独自の属性セットを持ち、一部のスパンは属性を繰り返すこともできます。

Koogは、OpenTelemetryの[生成AIイベントのセマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)に従う事前定義された属性のリストをサポートしています。たとえば、規約では`gen_ai.conversation.id`という名前の属性が定義されており、これは通常、スパンに必須の属性です。Koogでは、この属性の値はエージェント実行の一意の識別子であり、`agent.run()`メソッドを呼び出すと自動的に設定されます。

さらに、KoogはカスタムのKoog固有属性も含まれています。これらの属性のほとんどは`koog.`プレフィックスで識別できます。利用可能なカスタム属性は以下の通りです。

- `koog.agent.strategy.name`: エージェント戦略の名前。戦略は、エージェントの目的を説明するKoog関連エンティティです。`InvokeAgentSpan`スパンで使用されます。
- `koog.node.name`: 実行中のノードの名前。`NodeExecuteSpan`スパンで使用されます。

### イベント

スパンには_イベント_もアタッチできます。イベントは、何か関連する出来事が起こった特定の時点を表します。たとえば、LLM呼び出しが開始または終了したときなどです。イベントには属性もあり、さらにイベントの_本体フィールド_も含まれます。

OpenTelemetryの[生成AIイベントのセマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)に沿って、以下のイベントタイプがサポートされています。

- **SystemMessageEvent**: モデルに渡されるシステム指示。
- **UserMessageEvent**: モデルに渡されるユーザーメッセージ。
- **AssistantMessageEvent**: モデルに渡されるアシスタントメッセージ。
- **ToolMessageEvent**: モデルに渡されるツールまたは関数呼び出しからの応答。
- **ChoiceEvent**: モデルからの応答メッセージ。
- **ModerationResponseEvent**: モデルのモデレーション結果またはシグナル。

!!! note   
    `optentelemetry-java` SDKは、イベントを追加する際にイベント本体フィールドパラメータをサポートしていません。したがって、KoogのOpenTelemetryサポートでは、イベント本体フィールドはキーが`body`で値の型が文字列である個別の属性です。この文字列には、イベント本体フィールドのコンテンツまたはペイロードが含まれており、通常はJSONのようなオブジェクトです。イベント本体フィールドの例については、[OpenTelemetryドキュメント](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)を参照してください。`opentelemetry-java`におけるイベント本体フィールドのサポート状況については、関連する[GitHubイシュー](https://github.com/open-telemetry/semantic-conventions/issues/1870)を参照してください。

## エクスポーター

エクスポーターは、収集されたテレメトリーデータをOpenTelemetry Collectorまたは他の種類の宛先やバックエンド実装に送信します。エクスポーターを追加するには、OpenTelemetry機能をインストールする際に`addSpanExporter()`メソッドを使用します。このメソッドは以下の引数を取ります。

| Name       | Data type    | Required | Default | Description                                                                 |
|:-----------|:-------------|:---------|:--------|:----------------------------------------------------------------------------|
| `exporter` | SpanExporter | Yes      |         | カスタムスパンエクスポーターのリストに追加する`SpanExporter`インスタンス。 |

以下のセクションでは、`opentelemetry-java` SDKの最も一般的に使用されるエクスポーターのいくつかについて説明します。

!!! note
    カスタムエクスポーターを何も設定しない場合、Koogはデフォルトでコンソール用の`LoggingSpanExporter`を使用します。これはローカル開発とデバッグに役立ちます。

### ロギングエクスポーター

トレース情報をコンソールに出力するロギングエクスポーターです。`LoggingSpanExporter`（`io.opentelemetry.exporter.logging.LoggingSpanExporter`）は、`opentelemetry-java` SDKの一部です。

このタイプのエクスポートは、開発およびデバッグ目的で役立ちます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Add the logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    // Add more exporters as needed
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTPエクスポーター

OpenTelemetry HTTPエクスポーター（`OtlpHttpSpanExporter`）は、`opentelemetry-java` SDK（`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`）の一部であり、HTTP経由でスパンデータをバックエンドに送信します。

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
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry HTTP exporter 
   addSpanExporter(
      OtlpHttpSpanExporter.builder()
         // Set the maximum time to wait for the collector to process an exported batch of spans 
         .setTimeout(30, TimeUnit.SECONDS)
         // Set the OpenTelemetry endpoint to connect to
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // Add the authorization header
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPCエクスポーター

OpenTelemetry gRPCエクスポーター（`OtlpGrpcSpanExporter`）は、`opentelemetry-java` SDK（`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`）の一部です。gRPC経由でテレメトリーデータをバックエンドにエクスポートし、データを受信するバックエンド、コレクター、またはエンドポイントのホストとポートを定義できます。デフォルトのポートは`4317`です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry gRPC exporter 
   addSpanExporter(
      OtlpGrpcSpanExporter.builder()
          // Set the host and the port
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## Langfuseとの統合

Langfuseは、LLM/エージェントのワークロードのためのトレース可視化と分析を提供します。

ヘルパー関数を使用して、KoogがOpenTelemetryトレースをLangfuseに直接エクスポートするように設定できます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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

Langfuseとの統合に関する[完全なドキュメント](opentelemetry-langfuse-exporter.md)をご覧ください。

## W&B Weaveとの統合

W&B Weaveは、LLM/エージェントのワークロードのためのトレース可視化と分析を提供します。W&B Weaveとの統合は、事前定義されたエクスポーターを介して設定できます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    executor = simpleOpenAIExecutor(apiKey),
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

W&B Weaveとの統合に関する[完全なドキュメント](opentelemetry-weave-exporter.md)をご覧ください。

## Jaegerとの統合

Jaegerは、OpenTelemetryと連携する人気の分散トレースシステムです。Koogリポジトリの`examples`内の`opentelemetry`ディレクトリには、JaegerとKoogエージェントでOpenTelemetryを使用する例が含まれています。

### 前提条件

KoogとJaegerでOpenTelemetryをテストするには、提供されている`docker-compose.yaml`ファイルを使用してJaeger OpenTelemetryオールインワンプロセスを開始します。以下のコマンドを実行してください。

```bash
docker compose up -d
```

提供されているDocker Compose YAMLファイルには、以下の内容が含まれています。

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

Jaeger UIにアクセスしてトレースを表示するには、`http://localhost:16686`を開いてください。

### 例

Jaegerで使用するためのテレメトリーデータをエクスポートするために、この例では`opentelemetry-java` SDKの`LoggingSpanExporter`（`io.opentelemetry.exporter.logging.LoggingSpanExporter`）と`OtlpGrpcSpanExporter`（`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`）を使用しています。

以下に完全なコードサンプルを示します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.utils.use
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
            executor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Reasoning.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // Add a console logger for local debugging
                addSpanExporter(LoggingSpanExporter.create())

                // Send traces to OpenTelemetry collector
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

1.  **Jaeger、Langfuse、またはW&B Weaveにトレースが表示されない**
    -   サービスが実行されており、OpenTelemetryポート（4317）にアクセス可能であることを確認してください。
    -   OpenTelemetryエクスポーターが正しいエンドポイントで設定されていることを確認してください。
    -   トレースがエクスポートされるまで、エージェントの実行後に数秒待つようにしてください。

2.  **スパンが見つからない、またはトレースが不完全**
    -   エージェントの実行が正常に完了したことを確認してください。
    -   エージェントの実行後にアプリケーションを早すぎる段階で終了させていないことを確認してください。
    -   スパンがエクスポートされる時間を確保するために、エージェント実行後に遅延を追加してください。

3.  **過剰な数のスパン**
    -   `sampler`プロパティを設定して、別のサンプリング戦略の使用を検討してください。
    -   たとえば、`Sampler.traceIdRatioBased(0.1)`を使用して、トレースの10%のみをサンプリングします。

4.  **スパンアダプターが互いに上書きされる**
    -   現在、OpenTelemetryエージェント機能は複数のスパンアダプターの適用をサポートしていません [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。