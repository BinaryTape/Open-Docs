[//]: # (title: Dropwizard Metrics)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DropwizardMetrics"/>
<var name="package_name" value="io.ktor.server.metrics.dropwizard"/>
<var name="artifact_name" value="ktor-server-metrics"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="dropwizard-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>%plugin_name% プラグインを使用すると、Metrics ライブラリを構成して、サーバーと受信リクエストに関する有用な情報を取得できます。</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html) プラグインを使用すると、[Metrics](http://metrics.dropwizard.io/) ライブラリを構成して、サーバーと受信リクエストに関する有用な情報を取得できます。

## 依存関係を追加する {id="add_dependencies"}
`%plugin_name%` を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `%artifact_name%` の依存関係を追加します。

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 必要に応じて、特定のレポーターに必要な依存関係を追加します。以下の例は、JMX 経由でメトリクスをレポートするために必要なアーティファクトを追加する方法を示しています。

  <var name="group_id" value="io.dropwizard.metrics"/>
  <var name="artifact_name" value="metrics-jmx"/>
  <var name="version" value="dropwizard_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  `$dropwizard_version` は、必要な `metrics-jmx` アーティファクトのバージョンに置き換えることができます。例えば、`%dropwizard_version%` などです。

## %plugin_name% をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% を構成する {id="configure_plugin"}

`%plugin_name%` を使用すると、`registry` プロパティを使用してサポートされている任意の [Metric reporter](http://metrics.dropwizard.io/) を使用できます。SLF4J レポーターと JMX レポーターの構成方法を見てみましょう。

### SLF4J レポーター {id="slf4j"}

SLF4J レポーターを使用すると、SLF4J がサポートする任意の出力に定期的にレポートを送信できます。
例えば、10秒ごとにメトリクスを出力するには、以下のようにします。

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12-18,25"}

完全な例は、こちらで見つけることができます: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

アプリケーションを実行し、[http://0.0.0.0:8080](http://0.0.0.0:8080) を開くと、出力は次のようになります。

```Bash
[DefaultDispatcher-worker-1] INFO  Application - Responding at http://0.0.0.0:8080
... type=COUNTER, name=ktor.calls.active, count=0
... type=METER, name=ktor.calls./(method:GET).200, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.98655785084844, rate_unit=events/second
... type=METER, name=ktor.calls./(method:GET).meter, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9841134429134598, rate_unit=events/second
... type=METER, name=ktor.calls.exceptions, count=0, m1_rate=0.0, m5_rate=0.0, m15_rate=0.0, mean_rate=0.0, rate_unit=events/second
... type=METER, name=ktor.calls.status.200, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9866015088545449, rate_unit=events/second
... type=TIMER, name=ktor.calls./(method:GET).timer, count=6, min=0.359683, max=14.213046, mean=2.691307542732234, stddev=5.099546889849414, p50=0.400967, p75=0.618972, p95=14.213046, p98=14.213046, p99=14.213046, p999=14.213046, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9830677128229028, rate_unit=events/second, duration_unit=milliseconds
... type=TIMER, name=ktor.calls.duration, count=6, min=0.732149, max=33.735719, mean=6.238046092985701, stddev=12.169258340009847, p50=0.778864, p75=1.050454, p95=33.735719, p98=33.735719, p99=33.735719, p999=33.735719, m1_rate=0.2, m5_rate=0.2, m15_rate=0.2, mean_rate=0.6040311229887146, rate_unit=events/second, duration_unit=milliseconds
```

### JMX レポーター {id="jmx"}

JMX レポーターを使用すると、すべてのメトリクスを JMX に公開でき、`jconsole` を使用してこれらのメトリクスを表示できます。

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,19-23,25"}

完全な例は、こちらで見つけることができます: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

アプリケーションを実行し、[JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html) を使用してそのプロセスに接続すると、メトリクスは次のようになります。

![Ktor メトリクス: JMX](jmx.png){width="758"}

## 公開されるメトリクス {id="exposed-metrics"}

`%plugin_name%` は以下のメトリクスを公開します。

- Ktor 固有のメトリクスと [JVM メトリクス](#jvm-metrics) を含む [グローバルメトリクス](#global-metrics)。
- [エンドポイントごとのメトリクス](#endpoint-metrics)。

### グローバルメトリクス {id="global-metrics"}

グローバルメトリクスには、以下の Ktor 固有のメトリクスが含まれます。

* `ktor.calls.active`:`Count` - 未完了のアクティブなリクエストの数。
* `ktor.calls.duration` - 呼び出しの継続時間に関する情報。
* `ktor.calls.exceptions` - 例外の数に関する情報。
* `ktor.calls.status.NNN` - 特定の HTTP ステータスコード `NNN` が発生した回数に関する情報。

メトリクス名が `ktor.calls` プリフィックスで始まることに注意してください。`baseName` プロパティを使用してカスタマイズできます。

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### エンドポイントごとのメトリクス {id="endpoint-metrics"}

* `"/uri(method:VERB).NNN"` - このパスと動詞に対して特定の HTTP ステータスコード `NNN` が発生した回数に関する情報。
* `"/uri(method:VERB).meter"` - このパスと動詞に対する呼び出しの数に関する情報。
* `"/uri(method:VERB).timer"` - このエンドポイントの継続時間に関する情報。

### JVM メトリクス {id="jvm-metrics"}

HTTP メトリクスに加えて、Ktor は JVM を監視するための一連のメトリクスを公開します。`registerJvmMetricSets` プロパティを使用してこれらのメトリクスを無効にできます。

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,24-25"}

完全な例は、こちらで見つけることができます: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。