[//]: # (title: Micrometer 指标)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[micrometer_jvm_metrics]: https://micrometer.io/docs/ref/jvm

<var name="package_name" value="io.ktor.server.metrics.micrometer"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-metrics-micrometer</code>
</p>
<var name="example_name" value="micrometer-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>MicrometerMetrics 插件在您的 Ktor 服务器应用程序中启用 Micrometer 指标，并允许您选择所需的监控系统，例如 Prometheus、JMX、Elastic 等。</link-summary>

[MicrometerMetrics](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics) 插件在您的 Ktor 服务器应用程序中启用 [Micrometer](https://micrometer.io/docs) 指标，并允许您选择所需的监控系统，例如 Prometheus、JMX、Elastic 等。默认情况下，Ktor 暴露用于监控 HTTP 请求的指标和一组用于[监控 JVM][micrometer_jvm_metrics] 的低级指标。您可以自定义这些指标或创建新指标。

## 添加依赖项 {id="add_dependencies"}
要启用 `MicrometerMetrics`，您需要在构建脚本中包含以下 Artifact：
* 添加 `ktor-server-metrics-micrometer` 依赖项：

  <var name="artifact_name" value="ktor-server-metrics-micrometer"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  
* 添加监控系统所需的依赖项。以下示例展示了如何为 Prometheus 添加 Artifact：

  <var name="group_id" value="io.micrometer"/>
  <var name="artifact_name" value="micrometer-registry-prometheus"/>
  <var name="version" value="prometheus_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  您可以将 `$prometheus_version` 替换为 `micrometer-registry-prometheus` Artifact 所需的版本，例如 `%prometheus_version%`。

## 安装 MicrometerMetrics {id="install_plugin"}

<var name="plugin_name" value="MicrometerMetrics"/>
<include from="lib.topic" element-id="install_plugin"/>

### 暴露的指标 {id="ktor_metrics"}
Ktor 暴露以下指标用于监控 HTTP 请求：
* `ktor.http.server.requests.active`：一个[测量仪 (gauge)](https://micrometer.io/docs/concepts#_gauges)，用于统计并发 HTTP 请求的数量。此指标不提供任何标签。
* `ktor.http.server.requests`：一个[计时器 (timer)](https://micrometer.io/docs/concepts#_timers)，用于测量每个请求的时间。此指标提供一组标签用于监控请求数据，包括用于请求 URL 的 `address`、用于 HTTP 方法的 `method`、用于处理请求的 Ktor 路由的 `route` 等。

您可以使用 `metricName` [配置](#configure_metrics)属性自定义默认的 `ktor.http.server.requests` 前缀。

> 指标名称可能会根据配置的监控系统而[有所不同](https://micrometer.io/docs/concepts#_naming_meters)。

除了 HTTP 指标，Ktor 还暴露了一组用于[监控 JVM](#jvm_metrics) 的指标。

## 创建注册表 {id="create_registry"}

安装 `MicrometerMetrics` 后，您需要为您的监控系统创建一个[注册表 (registry)](https://micrometer.io/docs/concepts#_registry)，并将其分配给 `registry` 属性。在以下示例中，`PrometheusMeterRegistry` 是在 `install` 块外部创建的，以便能够在不同的[路由处理器](server-routing.md)中重用此注册表：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32,42"}

## 配置指标 {id="configure_metrics"}

`MicrometerMetrics` 插件提供了各种配置选项，可以通过 [MicrometerMetricsConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics-micrometer/io.ktor.server.metrics.micrometer/-micrometer-metrics-config/index.html) 访问。

### 计时器 {id="timers"}
要为每个计时器自定义标签，您可以使用为每个请求调用的 `timers` 函数：
```kotlin
install(MicrometerMetrics) {
    // ...
    timers { call, exception ->
        tag("region", call.request.headers["regionId"])
    }
}
```

### 分布统计 {id="distribution_statistics"}
您可以使用 `distributionStatisticConfig` 属性配置[分布统计](https://micrometer.io/docs/concepts#_configuring_distribution_statistics)，例如：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,19-26,32"}

### JVM 和系统指标 {id="jvm_metrics"}
除了 [HTTP 指标](#ktor_metrics)外，Ktor 还暴露了一组用于[监控 JVM][micrometer_jvm_metrics] 的指标。您可以使用 `meterBinders` 属性自定义这些指标的列表，例如：

```kotlin
```
{src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="17,27-32"}

您还可以分配一个空列表来完全禁用这些指标。

## Prometheus：暴露抓取端点 {id="prometheus_endpoint"}
如果您使用 Prometheus 作为监控系统，您需要向 Prometheus 抓取器暴露一个 HTTP 端点。在 Ktor 中，您可以按以下方式操作：
1. 创建一个接受所需地址（以下示例中为 `/metrics`）的 GET 请求的专用[路由](server-routing.md)。
2. 使用 `call.respond` 将抓取数据发送到 Prometheus。

   ```kotlin
   ```
   {src="snippets/micrometer-metrics/src/main/kotlin/com/example/Application.kt" include-lines="15-18,32-33,38-42"}

   您可以在此处找到完整示例：[micrometer-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/micrometer-metrics)。