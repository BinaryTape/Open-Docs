[//]: # (title: Dropwizard Metrics)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DropwizardMetrics"/>
<var name="package_name" value="io.ktor.server.metrics.dropwizard"/>
<var name="artifact_name" value="ktor-server-metrics"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="dropwizard-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% 外掛程式讓您可以設定 Metrics 函式庫，以獲取有關伺服器和傳入請求的實用資訊。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html) 外掛程式讓您可以設定 [Metrics](http://metrics.dropwizard.io/) 函式庫，以獲取有關伺服器和傳入請求的實用資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `%plugin_name%`，您需要在建置腳本中包含以下構件：
* 新增 `%artifact_name%` 依賴項：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 您可以選擇性地新增特定報告器所需的依賴項。以下範例展示了如何新增透過 JMX 報告指標所需的構件：

  <var name="group_id" value="io.dropwizard.metrics"/>
  <var name="artifact_name" value="metrics-jmx"/>
  <var name="version" value="dropwizard_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  您可以將 `$dropwizard_version` 替換為 `metrics-jmx` 構件的所需版本，例如 `%dropwizard_version%`。

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 設定 %plugin_name% {id="configure_plugin"}

`%plugin_name%` 允許您使用 `registry` 屬性來使用任何受支援的 [指標報告器](http://metrics.dropwizard.io/)。讓我們看看如何設定 SLF4J 和 JMX 報告器。

### SLF4J 報告器 {id="slf4j"}

SLF4J 報告器允許您定期將報告發送至 SLF4J 支援的任何輸出。
例如，若要每 10 秒輸出一次指標，您可以這樣做：

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12-18,25"}

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您執行應用程式並開啟 [http://0.0.0.0:8080](http://0.0.0.0:8080)，輸出將會是這樣：

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

JMX 報告器允許您將所有指標公開到 JMX，讓您可以使用 `jconsole` 檢視這些指標。

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,19-23,25"}

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您執行應用程式並使用 [JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html) 連接到其程序，指標將會是這樣：

![Ktor Metrics: JMX](jmx.png){width="758"}

## 公開的指標 {id="exposed-metrics"}

`%plugin_name%` 公開以下指標：

-   [全域指標](#global-metrics) 包含 Ktor 特有的指標和 [JVM 指標](#jvm-metrics)。
-   [端點指標](#endpoint-metrics)。

### 全域指標 {id="global-metrics"}

全域指標包含以下 Ktor 特有的指標：

*   `ktor.calls.active`:`Count` - 未完成的活躍請求數。
*   `ktor.calls.duration` - 呼叫持續時間的資訊。
*   `ktor.calls.exceptions` - 異常數量的資訊。
*   `ktor.calls.status.NNN` - 特定 HTTP 狀態碼 `NNN` 發生次數的資訊。

請注意，指標名稱以 `ktor.calls` 前綴開頭。您可以使用 `baseName` 屬性來客製化它：

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### 每端點指標 {id="endpoint-metrics"}

*   `"/uri(method:VERB).NNN"` - 針對此路徑和動詞，特定 HTTP 狀態碼 `NNN` 發生次數的資訊。
*   `"/uri(method:VERB).meter"` - 針對此路徑和動詞的呼叫次數資訊。
*   `"/uri(method:VERB).timer"` - 此端點持續時間的資訊。

### JVM 指標 {id="jvm-metrics"}

除了 HTTP 指標外，Ktor 還公開了一組用於監控 JVM 的指標。您可以使用 `registerJvmMetricSets` 屬性來停用這些指標：

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,24-25"}

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。