[//]: # (title: KtorサーバーでのOpenTelemetryによる分散トレース)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="plugin_name" value="KtorServerTelemetry"/>
<var name="package_name" value="io.opentelemetry.instrumentation"/>
<var name="artifact_name" value="opentelemetry-ktor-3.0"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<snippet id="opentelemetry-description">

Ktorは[OpenTelemetry](https://opentelemetry.io/)と統合されています。OpenTelemetryは、トレース、メトリクス、ログなどのテレメトリーデータを収集するためのオープンソースの可観測性フレームワークです。アプリケーションを計測し、データをGrafanaやJaegerなどの監視および可観測性ツールにエクスポートするための標準的な方法を提供します。

</snippet>

`%plugin_name%`プラグインは、Ktorサーバーアプリケーションにおける受信HTTPリクエストの分散トレースを可能にします。このプラグインは、ルート、HTTPメソッド、ステータスコード情報を含む[spans](https://opentelemetry.io/docs/concepts/signals/traces/#spans)を自動的に作成し、受信リクエストヘッダーから既存のトレースコンテキストを抽出し、スパン名、属性、スパンの種類をカスタマイズできるようにします。

> クライアント側では、OpenTelemetryは[KtorClientTelemetry](client-opentelemetry.md)プラグインを提供しており、これは外部サービスへの送信HTTP呼び出しのトレースを収集します。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
</p>

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="             &lt;dependencies&gt;&#10;              &lt;dependency&gt;&#10;                &lt;groupId&gt;io.opentelemetry.instrumentation&lt;/groupId&gt;&#10;                &lt;artifactId&gt;opentelemetry-ktor-3.0&lt;/artifactId&gt;&#10;                &lt;version&gt;%opentelemetry_version%&lt;/version&gt;&#10;              &lt;/dependency&gt;&#10;            &lt;/dependencies&gt;"/>
    </TabItem>
</Tabs>

## OpenTelemetryの構成 {id="configure-otel"}

Ktorアプリケーションに`%plugin_name%`プラグインをインストールする前に、`OpenTelemetry`インスタンスを構成および初期化する必要があります。このインスタンスは、トレースやメトリクスを含むテレメトリーデータの管理を担当します。

### 自動構成

OpenTelemetryを構成する一般的な方法は、[`AutoConfiguredOpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk-extension-autoconfigure/latest/io/opentelemetry/sdk/autoconfigure/AutoConfiguredOpenTelemetrySdk.html)を使用することです。これにより、システムプロパティと環境変数に基づいてエクスポーターとリソースが自動的に構成され、セットアップが簡素化されます。

自動検出された構成は、例えば`service.name`リソース属性を追加するなどして、引き続きカスタマイズできます。

```kotlin
package com.example

import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.sdk.autoconfigure.AutoConfiguredOpenTelemetrySdk
import io.opentelemetry.semconv.ServiceAttributes

fun getOpenTelemetry(serviceName: String): OpenTelemetry {

    return AutoConfiguredOpenTelemetrySdk.builder().addResourceCustomizer { oldResource, _ ->
        oldResource.toBuilder()
            .putAll(oldResource.attributes)
            .put(ServiceAttributes.SERVICE_NAME, serviceName)
            .build()
    }.build().openTelemetrySdk
}

```

### プログラムによる構成

環境ベースの構成に依存する代わりに、コードでエクスポーター、プロセッサー、およびプロパゲーターを定義するには、[`OpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk/latest/io/opentelemetry/sdk/OpenTelemetrySdk.html)を使用できます。

次の例は、OTLPエクスポーター、スパンプロセッサー、およびトレースコンテキストプロパゲーターを使用してOpenTelemetryをプログラムで構成する方法を示しています。

```kotlin
import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator
import io.opentelemetry.context.propagation.ContextPropagators
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor

fun configureOpenTelemetry(): OpenTelemetry {
    val spanExporter = OtlpGrpcSpanExporter.builder()
        .setEndpoint("http://localhost:4317")
        .build()

    val tracerProvider = SdkTracerProvider.builder()
        .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
        .build()

    return OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
        .buildAndRegisterGlobal()
}
```

このアプローチは、テレメトリーのセットアップを完全に制御する必要がある場合、またはデプロイ環境が自動構成に依存できない場合に使用します。

> 詳細については、[OpenTelemetry SDKコンポーネントのドキュメント](https://opentelemetry.io/docs/languages/java/sdk/#sdk-components)を参照してください。
>
{style="tip"}

## %plugin_name%のインストール {id="install_plugin"}

アプリケーションに`%plugin_name%`プラグインを[インストール](server-plugins.md#install)するには、指定された[モジュール](server-modules.md)の`install`関数に渡し、[構成済みの`OpenTelemetry`インスタンス](#configure-otel)を設定します。

<Tabs>
<TabItem title="embeddedServer">

```kotlin
    import io.ktor.server.engine.*
    import io.ktor.server.netty.*
    import io.ktor.server.application.*
    import %package_name%.*

    fun main() {
        embeddedServer(Netty, port = 8080) {
            val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

            install(%plugin_name%){
                setOpenTelemetry(openTelemetry)
            }
            // ...
        }.start(wait = true)
    }
```
</TabItem>
<TabItem title="module">

```kotlin

    import io.ktor.server.application.*
    import %package_name%.*
    // ...

    fun Application.module() {
        val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

        install(%plugin_name%){
            setOpenTelemetry(openTelemetry)
        }
        // ...
    }
```
</TabItem>
</Tabs>

> `%plugin_name%`は、他のロギングまたはテレメトリー関連のプラグインよりも前にインストールされていることを確認してください。
>
{style="note"}

## トレースの構成 {id="configuration"}

KtorサーバーがOpenTelemetryスパンを記録およびエクスポートする方法をカスタマイズできます。以下のオプションを使用すると、どのリクエストがトレースされるか、スパンがどのように命名されるか、含まれる属性、およびスパンの種類の決定方法を調整できます。

> これらの概念の詳細については、[OpenTelemetryトレースドキュメント](https://opentelemetry.io/docs/concepts/signals/traces/)を参照してください。

### 追加のHTTPメソッドをトレースする {id="config-known-methods"}

デフォルトでは、このプラグインは標準のHTTPメソッド（`GET`、`POST`、`PUT`など）をトレースします。追加またはカスタムのメソッドをトレースするには、`knownMethods`プロパティを構成します。

```kotlin
install(%plugin_name%) {
    // ...
    knownMethods(HttpMethod.DefaultMethods + CUSTOM_METHOD)
}
```

### ヘッダーをキャプチャする {id="config-request-headers"}

特定のリクエストヘッダーをスパン属性として含めるには、`capturedRequestHeaders`プロパティを使用します。

```kotlin
install(%plugin_name%) {
    // ...
    capturedRequestHeaders(HttpHeaders.UserAgent)
}
```

### スパンの種類の選択 {id="config-span-kind"}

リクエストの特性に基づいてスパンの種類（`SERVER`、`CLIENT`、`PRODUCER`、`CONSUMER`など）をオーバーライドするには、`spanKindExtractor`プロパティを使用します。

```kotlin
install(%plugin_name%) {
    // ...
    spanKindExtractor {
        if (httpMethod == HttpMethod.Post) {
            SpanKind.PRODUCER
        } else {
            SpanKind.CLIENT
        }
    }
}
```

### カスタム属性の追加 {id="config-custom-attributes"}

スパンの開始時または終了時にカスタム属性をアタッチするには、`attributesExtractor`プロパティを使用します。

```kotlin
install(%plugin_name%) {
    // ...
    attributesExtractor {
        onStart {
            attributes.put("start-time", System.currentTimeMillis())
        }
        onEnd {
            attributes.put("end-time", Instant.now().toEpochMilli())
        }
    }
}
```

### その他のプロパティ {id="additional-properties"}

アプリケーション全体のトレース動作を細かく調整するために、プロパゲーター、属性制限、計測の有効化/無効化など、追加のOpenTelemetryプロパティも構成できます。詳細については、[OpenTelemetry Java構成ガイド](https://opentelemetry.io/docs/languages/java/configuration/)を参照してください。

## Grafana LGTMでテレメトリーデータを検証する

テレメトリーデータを視覚化および検証するために、トレース、メトリクス、ログをGrafanaなどの分散トレースバックエンドにエクスポートできます。`grafana/otel-lgtm`オールインワンイメージには、[Grafana](https://grafana.com/)、[Tempo](https://grafana.com/oss/tempo/)（トレース）、[Loki](https://grafana.com/oss/loki/)（ログ）、および[Mimir](https://grafana.com/oss/mimir/)（メトリクス）がバンドルされています。

### Docker Composeの使用

以下の内容で**docker-compose.yml**ファイルを作成します。

```yaml
services:
  grafana-lgtm:
    image: grafana/otel-lgtm:latest
    ports:
      - "4317:4317"   # OTLP gRPC receiver (traces, metrics, logs)
      - "4318:4318"   # OTLP HTTP receiver
      - "3000:3000"   # Grafana UI
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped
```

Grafana LGTMオールインワンコンテナを起動するには、次のコマンドを実行します。

```shell
docker compose up -d
```

### Docker CLIの使用

あるいは、Dockerコマンドラインを使用してGrafanaを直接実行することもできます。

```shell
docker run -d --name grafana_lgtm \
    -p 4317:4317 \   # OTLP gRPC receiver (traces, metrics, logs)
    -p 4318:4318 \   # OTLP HTTP receiver
    -p 3000:3000 \   # Grafana UI
    -e GF_SECURITY_ADMIN_USER=admin \
    -e GF_SECURITY_ADMIN_PASSWORD=admin \
    grafana/otel-lgtm:latest
```

### アプリケーションエクスポート構成

KtorアプリケーションからOTLPエンドポイントにテレメトリーを送信するには、OpenTelemetry SDKがgRPCプロトコルを使用するように構成します。これらの値は、SDKをビルドする前に環境変数で設定できます。

```shell
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

または、JVMフラグを使用します。

```text
-Dotel.traces.exporter=otlp -Dotel.exporter.otlp.protocol=grpc -Dotel.exporter.otlp.endpoint=http://localhost:4317
```

### Grafana UIへのアクセス

実行されると、Grafana UIは[http://localhost:3000/](http://localhost:3000/)で利用可能になります。

<procedure>
    <step>
        Grafana UIを<a href="http://localhost:3000/">http://localhost:3000/</a>で開きます。
    </step>
    <step>
        以下のデフォルトの認証情報でログインします。
        <list>
            <li><ui-path>ユーザー:</ui-path><code>admin</code></li>
            <li><ui-path>パスワード:</ui-path><code>admin</code></li>
        </list>
    </step>
    <step>
        左側のナビゲーションメニューで、<ui-path>ドリルダウン → トレース</ui-path>に移動します。
        <img src="opentelemetry-grafana-ui.png" alt="Grafana UI Drilldown traces view" width="706" corners="rounded"/>
        <ui-path>トレース</ui-path>ビューでは、次のことができます。
        <list>
            <li>レート、エラー、または期間のメトリクスを選択します。</li>
            <li>サービス名やスパン名などでスパンフィルターを適用して、データを絞り込みます。</li>
            <li>トレースを表示し、詳細を検査し、スパンのタイムラインを操作します。</li>
        </list>
    </step>
</procedure>