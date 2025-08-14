[//]: # (title: Dropwizard metrics)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DropwizardMetrics"/>
<var name="package_name" value="io.ktor.server.metrics.dropwizard"/>
<var name="artifact_name" value="ktor-server-metrics"/>

<tldr>
<p>
<b>必需的依賴項</b>： <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="dropwizard-metrics"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>： ✖️
    </p>
    
</tldr>

<link-summary>%plugin_name% 外掛程式允許您配置 Metrics 函式庫，以獲取有關伺服器和傳入請求的有用資訊。</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html) 外掛程式允許您配置 [Metrics](http://metrics.dropwizard.io/) 函式庫，以獲取有關伺服器和傳入請求的有用資訊。

## 新增依賴項 {id="add_dependencies"}
要啟用 `%plugin_name%`，您需要在建構指令碼中包含以下工件：
* 新增 `%artifact_name%` 依賴項：

  
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
    

* 或者，新增特定報告器所需的依賴項。以下範例展示如何新增透過 JMX 報告指標所需的工件：

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
    
  
  您可以將 `$dropwizard_version` 替換為 `metrics-jmx` 工件所需的版本，例如 `%dropwizard_version%`。

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函式。以下程式碼片段顯示如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函式。
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
    

## 配置 %plugin_name% {id="configure_plugin"}

`%plugin_name%` 允許您使用 `registry` 屬性使用任何受支援的 [Metric 報告器](http://metrics.dropwizard.io/)。讓我們看看如何配置 SLF4J 和 JMX 報告器。

### SLF4J 報告器 {id="slf4j"}

SLF4J 報告器允許您定期向 SLF4J 支援的任何輸出發出報告。
例如，要每 10 秒輸出一次指標，您可以：

[object Promise]

您可以在這裡找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您執行應用程式並開啟 [http://0.0.0.0:8080](http://0.0.0.0:8080)，輸出將如下所示：

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

### JMX 報告器 {id="jmx"}

JMX 報告器允許您將所有指標暴露給 JMX，從而可以使用 `jconsole` 檢視這些指標。

[object Promise]

您可以在這裡找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您執行應用程式並使用 [JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html) 連接到其行程，指標將如下所示：

![Ktor Metrics: JMX](jmx.png){width="758"}

## 暴露的指標 {id="exposed-metrics"}

`%plugin_name%` 暴露以下指標：

- [全域指標](#global-metrics)，包括 Ktor 特定的指標和 [JVM 指標](#jvm-metrics)。
- [每個端點的指標](#endpoint-metrics)。

### 全域指標 {id="global-metrics"}

全域指標包括以下 Ktor 特定的指標：

* `ktor.calls.active`:`Count` - 未完成的活躍請求數。
* `ktor.calls.duration` - 呼叫持續時間的資訊。
* `ktor.calls.exceptions` - 異常數量的資訊。
* `ktor.calls.status.NNN` - 特定 HTTP 狀態碼 `NNN` 出現次數的資訊。

請注意，指標名稱以 `ktor.calls` 前綴開頭。您可以使用 `baseName` 屬性來自訂它：

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### 每個端點的指標 {id="endpoint-metrics"}

* `"/uri(method:VERB).NNN"` - 特定 HTTP 狀態碼 `NNN` 在此路徑和動詞下出現次數的資訊。
* `"/uri(method:VERB).meter"` - 此路徑和動詞的呼叫次數資訊。
* `"/uri(method:VERB).timer"` - 此端點的持續時間資訊。

### JVM 指標 {id="jvm-metrics"}

除了 HTTP 指標之外，Ktor 還暴露一組用於監控 JVM 的指標。您可以使用 `registerJvmMetricSets` 屬性禁用這些指標：

[object Promise]

您可以在這裡找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。