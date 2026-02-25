[//]: # (title: Ktor Client 中的 OpenTelemetry 分布式跟踪)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>必要依赖项</b>：<code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 与 [OpenTelemetry](https://opentelemetry.io/) 集成 — 这是一个用于收集跟踪、指标和日志等遥测数据的开源可观测性框架。它提供了一种标准化的方式来检测应用程序，并将数据导出到 Grafana 或 Jaeger 等监控与可观测性工具中。

`%plugin_name%` 插件允许您自动跟踪发出的 HTTP 请求。它捕获方法、URL 和状态码等元数据，并跨服务传播跟踪上下文。您还可以自定义 span 属性或使用您自己的 OpenTelemetry 配置。

> 在服务器端，OpenTelemetry 提供了 [KtorServerTelemetry](server-opentelemetry.md) 插件，用于检测发送到服务器的传入 HTTP 请求。

undefined
undefined

## 安装 %plugin_name% {id="install_plugin"}

要安装 `%plugin_name%` 插件，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 内部的 `install` 函数，并设置 [已配置的 `OpenTelemetry` 实例](#configure-otel)：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...

val client = HttpClient(CIO) {
    val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-client")

    install(%plugin_name%) {
        setOpenTelemetry(openTelemetry)
    }
}
```

## 配置跟踪

您可以自定义 Ktor 客户端如何记录和导出发出 HTTP 调用时的 OpenTelemetry span。通过以下选项，您可以调整哪些请求被跟踪、span 的命名方式、它们包含哪些属性、捕获哪些标头以及如何确定 span 种类。

> 有关这些概念的更多信息，请参阅 [OpenTelemetry 跟踪文档](https://opentelemetry.io/docs/concepts/signals/traces/)。

undefined
undefined

### 捕获响应标头

要将特定的 HTTP 响应标头捕获为 span 属性，请使用 `capturedResponseHeaders` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

undefined

## 后续步骤

安装并配置好 %plugin_name% 后，您可以通过向同样启用了遥测功能的服务（例如使用 [`KtorServerTelemetry`](server-opentelemetry.md) 的服务）发送请求，来验证 span 是否已创建并传播。在 [Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/) 或 [Grafana Tempo](https://grafana.com/oss/tempo/) 等可观测性后端中查看跟踪的两端，将确认分布式跟踪正在端到端运行。