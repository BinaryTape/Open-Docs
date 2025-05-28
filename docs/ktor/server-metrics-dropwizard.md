[//]: # (title: Dropwizard 指标)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DropwizardMetrics"/>
<var name="package_name" value="io.ktor.server.metrics.dropwizard"/>
<var name="artifact_name" value="ktor-server-metrics"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="dropwizard-metrics"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>%plugin_name% 插件允许你配置 Metrics 库，以获取有关服务器和传入请求的有用信息。</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html) 插件允许你配置 [Metrics](http://metrics.dropwizard.io/) 库，以获取有关服务器和传入请求的有用信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `%plugin_name%`，你需要在构建脚本中包含以下工件：
* 添加 `%artifact_name%` 依赖项：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* （可选）添加特定报告器所需的依赖项。以下示例展示了如何添加通过 JMX 报告指标所需的工件：

  <var name="group_id" value="io.dropwizard.metrics"/>
  <var name="artifact_name" value="metrics-jmx"/>
  <var name="version" value="dropwizard_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  你可以将 `$dropwizard_version` 替换为 `metrics-jmx` 工件所需的版本，例如 `%dropwizard_version%`。

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure_plugin"}

`%plugin_name%` 允许你使用 `registry` 属性来使用任何受支持的 [Metric 报告器](http://metrics.dropwizard.io/)。让我们看看如何配置 SLF4J 和 JMX 报告器。

### SLF4J 报告器 {id="slf4j"}

SLF4J 报告器允许你定期向 SLF4J 支持的任何输出发出报告。
例如，要每 10 秒输出一次指标，你可以：

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12-18,25"}

你可以在此处找到完整示例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果你运行应用程序并打开 [http://0.0.0.0:8080](http://0.0.0.0:8080)，输出将如下所示：

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

### JMX 报告器 {id="jmx"}

JMX 报告器允许你将所有指标暴露给 JMX，从而可以使用 `jconsole` 查看这些指标。

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,19-23,25"}

你可以在此处找到完整示例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果你运行应用程序并使用 [JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html) 连接到其进程，指标将如下所示：

![Ktor Metrics: JMX](jmx.png){width="758"}

## 暴露的指标 {id="exposed-metrics"}

`%plugin_name%` 暴露以下指标：

- [全局指标](#global-metrics)，包括 Ktor 特有指标和 [JVM 指标](#jvm-metrics)。
- [端点指标](#endpoint-metrics)。

### 全局指标 {id="global-metrics"}

全局指标包括以下 Ktor 特有指标：

* `ktor.calls.active`:`Count` - 未完成的活跃请求数。
* `ktor.calls.duration` - 有关调用持续时间的信息。
* `ktor.calls.exceptions` - 有关异常数量的信息。
* `ktor.calls.status.NNN` - 有关特定 HTTP 状态码 `NNN` 发生的次数信息。

请注意，指标名称以 `ktor.calls` 前缀开头。你可以使用 `baseName` 属性自定义它：

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### 每个端点的指标 {id="endpoint-metrics"}

* `"/uri(method:VERB).NNN"` - 有关此路径和动词下，特定 HTTP 状态码 `NNN` 发生的次数信息。
* `"/uri(method:VERB).meter"` - 有关此路径和动词下，调用次数的信息。
* `"/uri(method:VERB).timer"` - 有关此端点持续时间的信息。

### JVM 指标 {id="jvm-metrics"}

除了 HTTP 指标之外，Ktor 还暴露了一组用于监控 JVM 的指标。你可以使用 `registerJvmMetricSets` 属性禁用这些指标：

```kotlin
```
{src="snippets/dropwizard-metrics/src/main/kotlin/com/example/MetricsApplication.kt" include-lines="12,24-25"}

你可以在此处找到完整示例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。