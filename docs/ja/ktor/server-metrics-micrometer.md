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

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Nativeサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

<link-summary>MicrometerMetricsプラグインは、KtorサーバーアプリケーションでMicrometerメトリクスを有効にし、Prometheus、JMX、Elasticなどの必要な監視システムを選択できるようにします。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics)プラグインは、Ktorサーバーアプリケーションで[Micrometer](https://micrometer.io/docs)メトリクスを有効にし、Prometheus、JMX、Elasticなどの必要な監視システムを選択できるようにします。デフォルトでは、KtorはHTTPリクエストを監視するためのメトリクスと、[JVMを監視する][micrometer_jvm_metrics]ための低レベルのメトリクスセットを公開します。これらのメトリクスをカスタマイズしたり、新しいメトリクスを作成したりできます。

## 依存関係を追加する {id="add_dependencies"}
`MicrometerMetrics`を有効にするには、以下のアーティファクトをビルドスクリプトに含める必要があります。
* `ktor-server-metrics-micrometer`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  
* 監視システムに必要な依存関係を追加します。以下の例は、Prometheus用のアーティファクトを追加する方法を示しています。

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  
  `$prometheus_version`を`micrometer-registry-prometheus`アーティファクトの必要なバージョン、例えば`%prometheus_version%`に置き換えることができます。

## MicrometerMetricsをインストールする {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

### 公開されるメトリクス {id="ktor_metrics"}
KtorはHTTPリクエストを監視するために以下のメトリクスを公開します。
* `ktor.http.server.requests.active`: 同時HTTPリクエスト数をカウントする[ゲージ](https://micrometer.io/docs/concepts#_gauges)。このメトリクスにはタグは提供されません。
* `ktor.http.server.requests`: 各リクエストの時間を測定するための[タイマー](https://micrometer.io/docs/concepts#_timers)。このメトリクスは、要求されたURLの`address`、HTTPメソッドの`method`、リクエストを処理するKtorルートの`route`など、リクエストデータを監視するための一連のタグを提供します。

デフォルトの`ktor.http.server.requests`プレフィックスは、`metricName`の[設定](#configure_metrics)プロパティを使用してカスタマイズできます。

> メトリクス名は、設定されている監視システムによって[異なる](https://micrometer.io/docs/concepts#_naming_meters)場合があります。

HTTPメトリクスに加えて、Ktorは[JVMを監視する](#jvm_metrics)ための一連のメトリクスを公開します。

## レジストリを作成する {id="create_registry"}

`MicrometerMetrics`をインストールした後、[監視システム用のレジストリ](https://micrometer.io/docs/concepts#_registry)を作成し、それを`registry`プロパティに割り当てる必要があります。以下の例では、`PrometheusMeterRegistry`が`install`ブロックの外で作成されており、異なる[ルートハンドラー](server-routing.md)でこのレジストリを再利用する機能を持っています。

[object Promise]

## メトリクスを設定する {id="configure_metrics"}

`MicrometerMetrics`プラグインは、[MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html)を使用してアクセスできるさまざまな設定オプションを提供します。

### タイマー {id="timers"}
各タイマーのタグをカスタマイズするには、各リクエストで呼び出される`timers`関数を使用します。
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 分布統計 {id="distribution_statistics"}
[分布統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)は、`distributionStatisticConfig`プロパティを使用して設定します。例えば：

[object Promise]

### JVMとシステムメトリクス {id="jvm_metrics"}
[HTTPメトリクス](#ktor_metrics)に加えて、Ktorは[JVMを監視する][micrometer_jvm_metrics]ための一連のメトリクスを公開します。これらのメトリクスのリストは、`meterBinders`プロパティを使用してカスタマイズできます。例えば：

[object Promise]

これらのメトリクスを完全に無効にするには、空のリストを割り当てることもできます。

## Prometheus: スクレイプエンドポイントを公開する {id="prometheus_endpoint"}
Prometheusを監視システムとして使用する場合、PrometheusスクレイパーにHTTPエンドポイントを公開する必要があります。Ktorでは、次の方法でこれを行うことができます。
1. 必要なアドレス（以下の例では`/metrics`）でGETリクエストを受け入れる専用の[ルート](server-routing.md)を作成します。
2. `call.respond`を使用してスクレイピングデータをPrometheusに送信します。

   [object Promise]

   完全な例はこちらで確認できます: [micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。