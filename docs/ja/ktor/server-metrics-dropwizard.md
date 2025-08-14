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

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✖️
    </p>
    
</tldr>

<link-summary>%plugin_name%プラグインを使用すると、Metricsライブラリを設定して、サーバーと着信リクエストに関する有用な情報を取得できます。</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html)プラグインを使用すると、[Metrics](http://metrics.dropwizard.io/)ライブラリを設定して、サーバーと着信リクエストに関する有用な情報を取得できます。

## 依存関係を追加 {id="add_dependencies"}
`%plugin_name%`を有効にするには、ビルドスクリプトに次のアーティファクトを含める必要があります。
* `%artifact_name%`の依存関係を追加します。

  
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
    

* オプションで、特定のレポーターに必要な依存関係を追加します。以下の例は、JMX経由でメトリクスを報告するために必要なアーティファクトを追加する方法を示しています。

  <var name="group_id" value="io.dropwizard.metrics"/>
  <var name="artifact_name" value="metrics-jmx"/>
  <var name="version" value="dropwizard_version"/>
  
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
    
  
  `$dropwizard_version`を、たとえば`%dropwizard_version%`などの`metrics-jmx`アーティファクトの必要なバージョンに置き換えることができます。

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
        指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
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
    

## %plugin_name%の設定 {id="configure_plugin"}

`%plugin_name%`を使用すると、`registry`プロパティを使用して、サポートされている任意の[メトリクスレポーター](http://metrics.dropwizard.io/)を利用できます。SLF4JおよびJMXレポーターの設定方法を見てみましょう。

### SLF4Jレポーター {id="slf4j"}

SLF4Jレポーターを使用すると、SLF4Jがサポートするあらゆる出力に定期的にレポートを送信できます。
たとえば、10秒ごとにメトリクスを出力するには、次のようにします。

[object Promise]

完全な例はこちらにあります: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

アプリケーションを実行し、[http://0.0.0.0:8080](http://0.0.0.0:8080)を開くと、出力は次のようになります。

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

### JMXレポーター {id="jmx"}

JMXレポーターを使用すると、すべてのメトリクスをJMXに公開し、`jconsole`を使用してそれらのメトリクスを表示できます。

[object Promise]

完全な例はこちらにあります: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

アプリケーションを実行し、[JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html)を使用してそのプロセスに接続すると、メトリクスは次のようになります。

![Ktor メトリクス: JMX](jmx.png){width="758"}

## 公開されるメトリクス {id="exposed-metrics"}

`%plugin_name%`は以下のメトリクスを公開します。

- [グローバルメトリクス](#global-metrics)には、Ktor固有のメトリクスと[JVMメトリクス](#jvm-metrics)が含まれます。
- [エンドポイントごとのメトリクス](#endpoint-metrics)。

### グローバルメトリクス {id="global-metrics"}

グローバルメトリクスには、以下のKtor固有のメトリクスが含まれます。

* `ktor.calls.active`:`Count` - 未完了のアクティブなリクエストの数。
* `ktor.calls.duration` - 呼び出しの所要時間に関する情報。
* `ktor.calls.exceptions` - 例外の数に関する情報。
* `ktor.calls.status.NNN` - 特定のHTTPステータスコード`NNN`が発生した回数に関する情報。

メトリクス名が`ktor.calls`プレフィックスで始まることに注意してください。これは`baseName`プロパティを使用してカスタマイズできます。

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### エンドポイントごとのメトリクス {id="endpoint-metrics"}

* `"/uri(method:VERB).NNN"` - このパスと動詞に対して特定のHTTPステータスコード`NNN`が発生した回数に関する情報。
* `"/uri(method:VERB).meter"` - このパスと動詞に対する呼び出しの数に関する情報。
* `"/uri(method:VERB).timer"` - このエンドポイントの所要時間に関する情報。

### JVMメトリクス {id="jvm-metrics"}

HTTPメトリクスに加えて、KtorはJVMを監視するためのメトリクスのセットを公開しています。これらのメトリクスは`registerJvmMetricSets`プロパティを使用して無効にできます。

[object Promise]

完全な例はこちらにあります: [dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。