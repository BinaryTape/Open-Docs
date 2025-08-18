[//]: # (title: Micrometer 指標)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

<link-summary>MicrometerMetrics 插件在您的 Ktor 伺服器應用程式中啟用 Micrometer 指標，讓您可以選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics) 插件在您的 Ktor 伺服器應用程式中啟用 [Micrometer](https://micrometer.io/docs) 指標，讓您可以選擇所需的監控系統，例如 Prometheus、JMX、Elastic 等。Ktor 預設會暴露用於監控 HTTP 請求的指標，以及一組用於[監控 JVM][micrometer_jvm_metrics] 的低階指標。您可以自訂這些指標或建立新的指標。

## 新增依賴 {id="add_dependencies"}
要啟用 `MicrometerMetrics`，您需要在建置腳本中包含以下構件：
* 新增 `ktor-server-metrics-micrometer` 依賴：

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
  
* 新增監控系統所需的依賴。以下範例展示如何新增 Prometheus 的構件：

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
  
  您可以將 `$prometheus_version` 替換為 `micrometer-registry-prometheus` 構件所需的版本，例如 `%prometheus_version%`。

## 安裝 MicrometerMetrics {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>
<p>
    若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴展函數。
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

### 暴露的指標 {id="ktor_metrics"}
Ktor 暴露以下指標用於監控 HTTP 請求：
* `ktor.http.server.requests.active`：一個[測量計](https://micrometer.io/docs/concepts#_gauges)，用於計算併發 HTTP 請求的數量。此指標不提供任何標籤。
* `ktor.http.server.requests`：一個[計時器](https://micrometer.io/docs/concepts#_timers)，用於測量每個請求的時間。此指標提供一組標籤用於監控請求資料，包括用於請求 URL 的 `address`、用於 HTTP 方法的 `method`、用於處理請求的 Ktor 路由的 `route` 等等。

您可以使用 `metricName` [組態](#configure_metrics)屬性來自訂預設的 `ktor.http.server.requests` 前綴。

> 指標名稱可能因配置的監控系統而[異](https://micrometer.io/docs/concepts#_naming_meters)。

除了 HTTP 指標之外，Ktor 還暴露一組用於[監控 JVM](#jvm_metrics) 的指標。

## 建立註冊表 {id="create_registry"}

安裝 `MicrometerMetrics` 後，您需要為您的監控系統建立一個[註冊表](https://micrometer.io/docs/concepts#_registry)並將其指派給 `registry` 屬性。在以下範例中，`PrometheusMeterRegistry` 在 `install` 區塊外部建立，以便能夠在不同的[路由處理程式](server-routing.md)中重複使用此註冊表：

```kotlin
fun Application.module() {
    val appMicrometerRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
    }
}
```

## 配置指標 {id="configure_metrics"}

`MicrometerMetrics` 插件提供各種配置選項，可以使用 [MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html) 進行存取。

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
您可以使用 `distributionStatisticConfig` 屬性來配置[分佈統計](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)，例如：

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

### JVM 和系統指標 {id="jvm_metrics"}
除了 [HTTP 指標](#ktor_metrics)之外，Ktor 還暴露一組用於[監控 JVM][micrometer_jvm_metrics] 的指標。您可以使用 `meterBinders` 屬性來自訂這些指標的列表，例如：

```kotlin
install(MicrometerMetrics) {
    meterBinders = listOf(
        JvmMemoryMetrics(),
        JvmGcMetrics(),
        ProcessorMetrics()
    )
}
```

您也可以指派一個空列表來完全禁用這些指標。

## Prometheus：暴露一個抓取端點 {id="prometheus_endpoint"}
如果您使用 Prometheus 作為監控系統，您需要向 Prometheus 抓取器暴露一個 HTTP 端點。在 Ktor 中，您可以透過以下方式完成此操作：
1. 建立一個專用的[路由](server-routing.md)，它接受所需位址的 GET 請求（以下範例中為 `/metrics`）。
2. 使用 `call.respond` 將抓取資料傳送給 Prometheus。

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

   您可以在這裡找到完整範例：[micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。