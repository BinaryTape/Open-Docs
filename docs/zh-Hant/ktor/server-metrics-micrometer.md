[//]: # (title: Micrometer 指標)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您無需額外的執行時或虛擬機器即可執行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

<link-summary>MicrometerMetrics 外掛程式在您的 Ktor 伺服器應用程式中啟用 Micrometer 指標，並允許您選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等等。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics) 外掛程式在您的 Ktor 伺服器應用程式中啟用 [Micrometer](https://micrometer.io/docs) 指標，並允許您選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等等。預設情況下，Ktor 會暴露用於監控 HTTP 請求的指標以及一組用於[監控 JVM][micrometer_jvm_metrics] 的低階指標。您可以自訂這些指標或建立新的指標。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `MicrometerMetrics`，您需要將以下構件包含在建置指令碼中：
* 新增 `ktor-server-metrics-micrometer` 依賴項：

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
    
  
* 新增監控系統所需的依賴項。以下範例說明如何為 Prometheus 新增一個構件：

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
    
  
  您可以將 `$prometheus_version` 替換為 `micrometer-registry-prometheus` 構件的所需版本，例如 `%prometheus_version%`。

## 安裝 MicrometerMetrics {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
        以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫中。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 中，該模組是 <code>Application</code> 類別的延伸函數。
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
    

### 暴露的指標 {id="ktor_metrics"}
Ktor 暴露以下指標用於監控 HTTP 請求：
* `ktor.http.server.requests.active`: 一個[計量器](https://micrometer.io/docs/concepts#_gauges)，用於計算並行 HTTP 請求的數量。此指標不提供任何標籤。
* `ktor.http.server.requests`: 一個[計時器](https://micrometer.io/docs/concepts#_timers)，用於測量每個請求的時間。此指標提供一組標籤用於監控請求資料，包括用於請求 URL 的 `address`、用於 HTTP 方法的 `method`、用於 Ktor 處理請求的路由的 `route` 等等。

您可以使用 `metricName` [配置](#configure_metrics)屬性自訂預設的 `ktor.http.server.requests` 前綴。

> 根據所配置的監控系統，指標名稱可能會[有所不同](https://micrometer.io/docs/concepts#_naming_meters)。

除了 HTTP 指標之外，Ktor 還暴露一組用於[監控 JVM](#jvm_metrics) 的指標。

## 建立註冊表 {id="create_registry"}

安裝 `MicrometerMetrics` 後，您需要為您的監控系統建立一個[註冊表](https://micrometer.io/docs/concepts#_registry)，並將其指派給 `registry` 屬性。在以下範例中，`PrometheusMeterRegistry` 在 `install` 區塊外部建立，以便能夠在不同的[路由處理器](server-routing.md)中重用此註冊表：

[object Promise]

## 配置指標 {id="configure_metrics"}

`MicrometerMetrics` 外掛程式提供各種配置選項，可以透過 [MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html) 進行存取。

### 計時器 {id="timers"}
若要自訂每個計時器的標籤，您可以使用針對每個請求呼叫的 `timers` 函數：
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 分佈統計 {id="distribution_statistics"}
您可以使用 `distributionStatisticConfig` 屬性配置[分佈統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)，例如：

[object Promise]

### JVM 與系統指標 {id="jvm_metrics"}
除了 [HTTP 指標](#ktor_metrics)之外，Ktor 還暴露一組用於[監控 JVM][micrometer_jvm_metrics] 的指標。您可以使用 `meterBinders` 屬性自訂這些指標的清單，例如：

[object Promise]

您也可以指派一個空列表以完全禁用這些指標。

## Prometheus：暴露一個抓取端點 {id="prometheus_endpoint"}
如果您使用 Prometheus 作為監控系統，您需要向 Prometheus 抓取器暴露一個 HTTP 端點。在 Ktor 中，您可以透過以下方式完成此操作：
1. 建立一個專用的[路由](server-routing.md)，該路由接受指定地址（以下範例中的 `/metrics`）的 GET 請求。
2. 使用 `call.respond` 將抓取資料傳送到 Prometheus。

   [object Promise]

   您可以在此處找到完整範例：[micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。