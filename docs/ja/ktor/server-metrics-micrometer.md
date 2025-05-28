[//]: # (title: Micrometerメトリクス)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>「MicrometerMetrics」プラグインは、KtorサーバーアプリケーションでMicrometerメトリクスを有効にし、Prometheus、JMX、Elasticなどの必要なモニタリングシステムを選択できるようにします。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics)プラグインは、Ktorサーバーアプリケーションで[Micrometer](https://micrometer.io/docs)メトリクスを有効にし、Prometheus、JMX、Elasticなどの必要なモニタリングシステムを選択できるようにします。デフォルトでは、KtorはHTTPリクエストのモニタリング用メトリクスと、[JVMのモニタリング][micrometer_jvm_metrics]用の低レベルメトリクスのセットを公開します。これらのメトリクスをカスタマイズしたり、新しいメトリクスを作成したりできます。

## 依存関係を追加する {id="add_dependencies"}
`MicrometerMetrics`を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* 「`ktor-server-metrics-micrometer`」の依存関係を追加します。

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  
* モニタリングシステムに必要な依存関係を追加します。以下の例は、Prometheus用のアーティファクトを追加する方法を示しています。

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  `$prometheus_version`を、必要な`micrometer-registry-prometheus`アーティファクトのバージョン（例: `%prometheus_version%`）に置き換えることができます。

## MicrometerMetricsをインストールする {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>
<include from="lib.topic" element-id="install_plugin"/>

### 公開されるメトリクス {id="ktor_metrics"}
KtorはHTTPリクエストのモニタリング用に以下のメトリクスを公開します。
* `ktor.http.server.requests.active`: 同時HTTPリクエストの数をカウントする[ゲージ](https://micrometer.io/docs/concepts#_gauges)です。このメトリクスにはタグは提供されません。
* `ktor.http.server.requests`: 各リクエストの時間を測定するための[タイマー](https://micrometer.io/docs/concepts#_timers)です。このメトリクスは、リクエストされたURLの`address`、HTTPメソッドの`method`、リクエストを処理するKtorルートの`route`など、リクエストデータをモニタリングするための一連のタグを提供します。

デフォルトの`ktor.http.server.requests`プレフィックスは、`metricName`[設定](#configure_metrics)プロパティを使用してカスタマイズできます。

> メトリクス名は、設定されたモニタリングシステムによって[異なる](https://micrometer.io/docs/concepts#_naming_meters)場合があります。

HTTPメトリクスに加えて、Ktorは[JVMのモニタリング](#jvm_metrics)用の一連のメトリクスを公開します。

## レジストリを作成する {id="create_registry"}

`MicrometerMetrics`をインストールした後、[モニタリングシステム用のレジストリ](https://micrometer.io/docs/concepts#_registry)を作成し、それを`registry`プロパティに割り当てる必要があります。以下の例では、`PrometheusMeterRegistry`が`install`ブロックの外で作成されており、異なる[ルートハンドラ](server-routing.md)でこのレジストリを再利用できる能力を持たせています。

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32,42"}

## メトリクスを設定する {id="configure_metrics"}

`MicrometerMetrics`プラグインは、[MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html)を使用してアクセスできる様々な設定オプションを提供します。

### タイマー {id="timers"}
各タイマーのタグをカスタマイズするには、リクエストごとに呼び出される`timers`関数を使用できます。
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### ディストリビューション統計 {id="distribution_statistics"}
`distributionStatisticConfig`プロパティを使用して、[ディストリビューション統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)を設定します。例：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,19-26,32"}

### JVMおよびシステムメトリクス {id="jvm_metrics"}
[HTTPメトリクス](#ktor_metrics)に加えて、Ktorは[JVMのモニタリング][micrometer_jvm_metrics]用の一連のメトリクスを公開します。`meterBinders`プロパティを使用して、これらのメトリクスのリストをカスタマイズできます。例：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,27-32"}

これらのメトリクスを完全に無効にするために、空のリストを割り当てることもできます。

## Prometheus: スクレイプエンドポイントを公開する {id="prometheus_endpoint"}
Prometheusをモニタリングシステムとして使用する場合、PrometheusスクレイパーにHTTPエンドポイントを公開する必要があります。Ktorでは、次の方法でこれを行うことができます。
1. 必要なアドレス（以下の例では`/metrics`）でGETリクエストを受け入れる専用の[ルート](server-routing.md)を作成します。
2. `call.respond`を使用してスクレイピングデータをPrometheusに送信します。

   ```kotlin
   ```
   {src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32-33,38-42"}

   完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)で確認できます: [micrometer-metrics]