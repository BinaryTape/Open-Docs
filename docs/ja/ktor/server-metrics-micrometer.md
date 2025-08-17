[//]: # (title: Micrometer メトリクス)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

<link-summary>MicrometerMetricsプラグインは、KtorサーバーアプリケーションでMicrometerメトリクスを有効にし、Prometheus、JMX、Elasticなどの必要な監視システムを選択できるようにします。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics)プラグインは、Ktorサーバーアプリケーションで[Micrometer](https://micrometer.io/docs)メトリクスを有効にし、Prometheus、JMX、Elasticなどの必要な監視システムを選択できるようにします。デフォルトでは、KtorはHTTPリクエストを監視するためのメトリクスと、[JVMを監視][micrometer_jvm_metrics]するための一連の低レベルメトリクスを公開します。これらのメトリクスをカスタマイズしたり、新しいメトリクスを作成したりできます。

## 依存関係を追加する {id="add_dependencies"}
`MicrometerMetrics`を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `ktor-server-metrics-micrometer`の依存関係を追加します。

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  
* 監視システムに必要な依存関係を追加します。以下の例は、Prometheus用のアーティファクトを追加する方法を示しています。

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  
  `$prometheus_version`は、`micrometer-registry-prometheus`アーティファクトの必要なバージョンに置き換えることができます。例: `%prometheus_version%`。

## MicrometerMetrics をインストールする {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>
<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）内で。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

### 公開されるメトリクス {id="ktor_metrics"}
KtorはHTTPリクエストを監視するために、以下のメトリクスを公開します。
* `ktor.http.server.requests.active`: 同時HTTPリクエスト数をカウントする[ゲージ](https://micrometer.io/docs/concepts#_gauges)。このメトリクスにはタグは提供されません。
* `ktor.http.server.requests`: 各リクエストの時間を測定するための[タイマー](https://micrometer.io/docs/concepts#_timers)。このメトリクスは、要求されたURLの`address`、HTTPメソッドの`method`、リクエストを処理するKtorルートの`route`など、リクエストデータを監視するための一連のタグを提供します。

デフォルトの`ktor.http.server.requests`プレフィックスは、`metricName` [設定](#configure_metrics)プロパティを使用してカスタマイズできます。

> メトリクス名は、設定された監視システムによって[異なる](https://micrometer.io/docs/concepts#_naming_meters)場合があります。

HTTPメトリクスに加えて、Ktorは[JVMを監視する](#jvm_metrics)ための一連のメトリクスを公開します。

## レジストリを作成する {id="create_registry"}

`MicrometerMetrics`をインストールした後、[監視システム用のレジストリ](https://micrometer.io/docs/concepts#_registry)を作成し、それを`registry`プロパティに割り当てる必要があります。以下の例では、`PrometheusMeterRegistry`は`install`ブロックの外で作成されており、このレジストリを異なる[ルートハンドラー](server-routing.md)で再利用できるようになっています。

```kotlin
fun Application.module() {
    val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
    }
}
```

## メトリクスを設定する {id="configure_metrics"}

`MicrometerMetrics`プラグインは、[MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html)を使用してアクセスできるさまざまな設定オプションを提供します。

### タイマー {id="timers"}
各タイマーのタグをカスタマイズするには、各リクエストで呼び出される`timers`関数を使用できます。
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 分布統計 {id="distribution_statistics"}
[分布統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)は、`distributionStatisticConfig`プロパティを使用して設定します。例:

```kotlin
install(MicrometerMetrics) {
    distributionStatisticConfig = DistributionStatisticConfig.Builder()
        .percentilesHistogram(true)
        .maximumExpectedValue(Duration.ofSeconds(20).toNanos().toDouble())
        .serviceLevelObjectives(
            Duration.ofMillis(100).toNanos().toDouble(),
            Duration.ofMillis(500).toNanos().toDouble()
        )
        .build()
}
```

### JVMおよびシステムメトリクス {id="jvm_metrics"}
[HTTPメトリクス](#ktor_metrics)に加えて、Ktorは[JVMを監視する][micrometer_jvm_metrics]ための一連のメトリクスを公開します。これらのメトリクスのリストは、`meterBinders`プロパティを使用してカスタマイズできます。例:

```kotlin
install(MicrometerMetrics) {
    meterBinders = listOf(
        JvmMemoryMetrics(),
        JvmGcMetrics(),
        ProcessorMetrics()
    )
}
```

これらのメトリクスを完全に無効にするために、空のリストを割り当てることもできます。

## Prometheus: スクレイピングエンドポイントを公開する {id="prometheus_endpoint"}
Prometheusを監視システムとして使用する場合、PrometheusスクレイパーにHTTPエンドポイントを公開する必要があります。Ktorでは、以下の方法でこれを行うことができます。
1. 必要なアドレス（以下の例では`/metrics`）でGETリクエストを受け付ける専用の[ルート](server-routing.md)を作成します。
2. `call.respond`を使用して、スクレイピングデータをPrometheusに送信します。

   ```kotlin
   fun Application.module() {
       val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
       install(MicrometerMetrics) {
           registry = appMicrometerRegistry
       }
       routing {
           get("/metrics") {
               call.respond(appMicrometerRegistry.scrape())
           }
       }
   }
   ```

   完全な例はこちらで確認できます: [micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。