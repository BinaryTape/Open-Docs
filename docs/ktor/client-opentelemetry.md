[//]: # (title: Ktor Client 中使用 OpenTelemetry 进行分布式追踪)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 集成了 [OpenTelemetry](https://opentelemetry.io/)——一个用于收集追踪、指标和日志等遥测数据的开源可观测性框架。它提供了一种标准方法来插装应用程序并将数据导出到 Grafana 或 Jaeger 等监控和可观测性工具。

`%plugin_name%` 插件允许您自动追踪传出 HTTP 请求。它捕获诸如方法、URL 和状态码等元数据，并在服务之间传播追踪上下文。您还可以自定义 span 属性或使用自己的 OpenTelemetry 配置。

> 在服务器端，OpenTelemetry 提供了 [KtorServerTelemetry](server-opentelemetry.md) 插件，用于插装到您服务器的传入 HTTP 请求。

## 安装 %plugin_name% {id="install_plugin"}

要安装 `%plugin_name%` 插件，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 内的 `install` 函数，并设置 [已配置的 `OpenTelemetry` 实例](#configure-otel)：

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

## 配置追踪

您可以自定义 Ktor 客户端如何记录和导出传出 HTTP 调用所对应的 OpenTelemetry span。以下选项允许您调整追踪哪些请求、span 的命名方式、它们包含哪些属性、捕获哪些头以及如何确定 span 类型。

> 关于这些概念的更多信息，请参见 [OpenTelemetry 追踪文档](https://opentelemetry.io/docs/concepts/signals/traces/)。

### 捕获响应头

要将特定的 HTTP 响应头作为 span 属性捕获，请使用 `capturedResponseHeaders` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

## 后续步骤

安装并配置好 %plugin_name% 后，您可以通过向同样启用了遥测的服务（例如使用 [`KtorServerTelemetry`](server-opentelemetry.md) 的服务）发送请求来验证 span 是否正在创建和传播。在 [Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/) 或 [Grafana Tempo](https://grafana.com/oss/tempo/) 等可观测性后端中查看追踪的两端，将确认分布式追踪正在端到端地工作。