[//]: # (title: Micrometer 指標)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>所需依賴項</b>：`io.ktor:ktor-server-metrics-micrometer`
</p>
<var name="example_name" value="micrometer-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>MicrometerMetrics 外掛程式在您的 Ktor 伺服器應用程式中啟用 Micrometer 指標，並允許您選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics) 外掛程式在您的 Ktor 伺服器應用程式中啟用 [Micrometer](https://micrometer.io/docs) 指標，並允許您選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等。預設情況下，Ktor 會公開用於監控 HTTP 請求的指標以及一組用於[監控 JVM][micrometer_jvm_metrics] 的低階指標。您可以自訂這些指標或建立新的指標。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `MicrometerMetrics`，您需要將以下構件包含在建置腳本中：
*   新增 `ktor-server-metrics-micrometer` 依賴項：

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  
*   新增監控系統所需的依賴項。以下範例顯示如何為 Prometheus 新增構件：

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  您可以將 `$prometheus_version` 替換為 `micrometer-registry-prometheus` 構件所需的版本，例如 `%prometheus_version%`。

## 安裝 MicrometerMetrics {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>
<include from="lib.topic" element-id="install_plugin"/>

### 公開的指標 {id="ktor_metrics"}
Ktor 會公開以下用於監控 HTTP 請求的指標：
*   `ktor.http.server.requests.active`：一個[計量器](https://micrometer.io/docs/concepts#_gauges)，用於計算併發 HTTP 請求的數量。此指標不提供任何標籤。
*   `ktor.http.server.requests`：一個[計時器](https://micrometer.io/docs/concepts#_timers)，用於測量每個請求的時間。此指標提供一組用於監控請求資料的標籤，包括用於請求 URL 的 `address`、用於 HTTP 方法的 `method`、用於處理請求的 Ktor 路由的 `route` 等。

您可以使用 `metricName` [組態](#configure_metrics)屬性來自訂預設的 `ktor.http.server.requests` 字首。

> 指標名稱可能因所設定的監控系統而[異](https://micrometer.io/docs/concepts#_naming_meters)。

除了 HTTP 指標之外，Ktor 還公開了一組用於[監控 JVM](#jvm_metrics) 的指標。

## 建立註冊表 {id="create_registry"}

安裝 `MicrometerMetrics` 後，您需要為[您的監控系統建立一個註冊表](https://micrometer.io/docs/concepts#_registry)並將其指派給 `registry` 屬性。在下面的範例中，`PrometheusMeterRegistry` 是在 `install` 區塊之外建立的，以便能夠在不同的[路由處理器](server-routing.md)中重複使用此註冊表：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32,42"}

## 設定指標 {id="configure_metrics"}

`MicrometerMetrics` 外掛程式提供各種組態選項，可透過 [MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html) 存取。

### 計時器 {id="timers"}
若要自訂每個計時器的標籤，您可以使用為每個請求呼叫的 `timers` 函數：
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 分佈統計 {id="distribution_statistics"}
您可以使用 `distributionStatisticConfig` 屬性設定[分佈統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)，例如：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,19-26,32"}

### JVM 和系統指標 {id="jvm_metrics"}
除了 [HTTP 指標](#ktor_metrics)之外，Ktor 還公開了一組用於[監控 JVM][micrometer_jvm_metrics] 的指標。您可以使用 `meterBinders` 屬性自訂這些指標的清單，例如：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,27-32"}

您也可以指派一個空清單來完全禁用這些指標。

## Prometheus：公開抓取端點 {id="prometheus_endpoint"}
如果您使用 Prometheus 作為監控系統，您需要向 Prometheus 抓取器公開一個 HTTP 端點。在 Ktor 中，您可以透過以下方式執行此操作：
1.  建立一個專用的[路由](server-routing.md)，該路由透過所需位址（在以下範例中為 `/metrics`）接受 GET 請求。
2.  使用 `call.respond` 將抓取資料傳送給 Prometheus。

   ```kotlin
   ```
   {src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32-33,38-42"}

   您可以在此處找到完整範例：[micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。