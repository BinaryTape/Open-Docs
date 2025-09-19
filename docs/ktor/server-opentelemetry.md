[//]: # (title: Ktor 服务器中的 OpenTelemetry 分布式追踪)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="plugin_name" value="KtorServerTelemetry"/>
<var name="package_name" value="io.opentelemetry.instrumentation"/>
<var name="artifact_name" value="opentelemetry-ktor-3.0"/>

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

<snippet id="opentelemetry-description">

Ktor 集成了 [OpenTelemetry](https://opentelemetry.io/) —— 这是一个开源可观测性框架，用于收集追踪、指标和日志等遥测数据。它提供了一种标准方式来为应用程序植入探针并将其数据导出到 Grafana 或 Jaeger 等监控和可观测性工具。

</snippet>

`%plugin_name%` 插件在 Ktor 服务器应用程序中启用了对传入 HTTP 请求的分布式追踪。它自动创建包含路由、HTTP 方法和状态码信息的 [span](https://opentelemetry.io/docs/concepts/signals/traces/#spans)，从传入请求头中提取现有的追踪上下文，并允许自定义 span 名称、属性和 span 种类。

> 在客户端，OpenTelemetry 提供了 [KtorClientTelemetry](client-opentelemetry.md) 插件，用于收集对外部服务的传出 HTTP 调用追踪。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
</p>

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="             &lt;dependencies&gt;&#10;              &lt;dependency&gt;&#10;                &lt;groupId&gt;io.opentelemetry.instrumentation&lt;/groupId&gt;&#10;                &lt;artifactId&gt;opentelemetry-ktor-3.0&lt;/artifactId&gt;&#10;                &lt;version&gt;%opentelemetry_version%&lt;/version&gt;&#10;              &lt;/dependency&gt;&#10;            &lt;/dependencies&gt;"/>
    </TabItem>
</Tabs>

## 配置 OpenTelemetry {id="configure-otel"}

在 Ktor 应用程序中安装 `%plugin_name%` 插件之前，你需要配置并初始化一个 `OpenTelemetry` 实例。此实例负责管理遥测数据，包括追踪和指标。

### 自动配置

配置 OpenTelemetry 的常用方式是使用 [`AutoConfiguredOpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk-extension-autoconfigure/latest/io/opentelemetry/sdk/autoconfigure/AutoConfiguredOpenTelemetrySdk.html)。通过根据系统属性和环境变量自动配置导出器和资源，这简化了设置。

你仍然可以自定义自动检测到的配置——例如，通过添加 `service.name` 资源属性：

```kotlin
package com.example

import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.sdk.autoconfigure.AutoConfiguredOpenTelemetrySdk
import io.opentelemetry.semconv.ServiceAttributes

fun getOpenTelemetry(serviceName: String): OpenTelemetry {

    return AutoConfiguredOpenTelemetrySdk.builder().addResourceCustomizer { oldResource, _ ->
        oldResource.toBuilder()
            .putAll(oldResource.attributes)
            .put(ServiceAttributes.SERVICE_NAME, serviceName)
            .build()
    }.build().openTelemetrySdk
}

```

### 编程方式配置

要在代码中定义导出器、处理器和传播器，而不是依赖于基于环境的配置，你可以使用 [`OpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk/latest/io/opentelemetry/sdk/OpenTelemetrySdk.html)。

以下示例展示了如何使用 OTLP 导出器、span 处理器和追踪上下文传播器以编程方式配置 OpenTelemetry：

```kotlin
import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator
import io.opentelemetry.context.propagation.ContextPropagators
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor

fun configureOpenTelemetry(): OpenTelemetry {
    val spanExporter = OtlpGrpcSpanExporter.builder()
        .setEndpoint("http://localhost:4317")
        .build()

    val tracerProvider = SdkTracerProvider.builder()
        .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
        .build()

    return OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
        .buildAndRegisterGlobal()
}
```

如果你需要完全控制遥测设置，或者你的部署环境无法依赖自动配置，请使用这种方法。

> 关于更多信息，请参见 [OpenTelemetry SDK components documentation](https://opentelemetry.io/docs/languages/java/sdk/#sdk-components)。
>
{style="tip"}

## 安装 %plugin_name% {id="install_plugin"}

要将 `%plugin_name%` 插件[安装](server-plugins.md#install)到应用程序，请将其传递给指定[模块](server-modules.md)中的 `install` 函数，并设置[已配置的 `OpenTelemetry` 实例](#configure-otel)：

<Tabs>
<TabItem title="embeddedServer">

```kotlin
    import io.ktor.server.engine.*
    import io.ktor.server.netty.*
    import io.ktor.server.application.*
    import %package_name%.*

    fun main() {
        embeddedServer(Netty, port = 8080) {
            val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

            install(%plugin_name%){
                setOpenTelemetry(openTelemetry)
            }
            // ...
        }.start(wait = true)
    }
```
</TabItem>
<TabItem title="module">

```kotlin

    import io.ktor.server.application.*
    import %package_name%.*
    // ...

    fun Application.module() {
        val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

        install(%plugin_name%){
            setOpenTelemetry(openTelemetry)
        }
        // ...
    }
```
</TabItem>
</Tabs>

> 确保 `%plugin_name%` 在任何其他日志或遥测相关插件之前安装。
>
{style="note"}

## 配置追踪 {id="configuration"}

你可以自定义 Ktor 服务器如何记录和导出 OpenTelemetry span。以下选项允许你调整追踪哪些请求、span 如何命名、它们包含哪些属性以及 span 种类如何确定。

> 关于这些概念的更多信息，请参见 [OpenTelemetry tracing documentation](https://opentelemetry.io/docs/concepts/signals/traces/)。

### 追踪额外的 HTTP 方法 {id="config-known-methods"}

默认情况下，该插件追踪标准 HTTP 方法（`GET`、`POST`、`PUT` 等）。要追踪额外的或自定义的方法，请配置 `knownMethods` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    knownMethods(HttpMethod.DefaultMethods + CUSTOM_METHOD)
}
```

### 捕获请求头 {id="config-request-headers"}

要将特定的 HTTP 请求头作为 span 属性包含在内，请使用 `capturedRequestHeaders` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedRequestHeaders(HttpHeaders.UserAgent)
}
```

### 选择 span 种类 {id="config-span-kind"}

要基于请求特征覆盖 span 种类（例如 `SERVER`、`CLIENT`、`PRODUCER`、`CONSUMER`），请使用 `spanKindExtractor` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    spanKindExtractor {
        if (httpMethod == HttpMethod.Post) {
            SpanKind.PRODUCER
        } else {
            SpanKind.CLIENT
        }
    }
}
```

### 添加自定义属性 {id="config-custom-attributes"}

要在 span 的开始或结束时附加自定义属性，请使用 `attributesExtractor` 属性：

```kotlin
install(%plugin_name%) {
    // ...
    attributesExtractor {
        onStart {
            attributes.put("start-time", System.currentTimeMillis())
        }
        onEnd {
            attributes.put("end-time", Instant.now().toEpochMilli())
        }
    }
}
```

### 额外属性 {id="additional-properties"}

要微调整个应用程序的追踪行为，你还可以配置额外的 OpenTelemetry 属性，例如传播器、属性限制以及启用/禁用植入探针。关于更多详细信息，请参见 [OpenTelemetry Java configuration guide](https://opentelemetry.io/docs/languages/java/configuration/)。

## 使用 Grafana LGTM 验证遥测数据

要可视化并验证你的遥测数据，你可以将追踪、指标和日志导出到分布式追踪后端，例如 Grafana。`grafana/otel-lgtm` 一体化镜像捆绑了 [Grafana](https://grafana.com/)、[Tempo](https://grafana.com/oss/tempo/)（追踪）、[Loki](https://grafana.com/oss/loki/)（日志）和 [Mimir](https://grafana.com/oss/mimir/)（指标）。

### 使用 Docker Compose

创建一个内容如下的 **docker-compose.yml** 文件：

```yaml
services:
  grafana-lgtm:
    image: grafana/otel-lgtm:latest
    ports:
      - "4317:4317"   # OTLP gRPC 接收器（追踪、指标、日志）
      - "4318:4318"   # OTLP HTTP 接收器
      - "3000:3000"   # Grafana 用户界面
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped
```

要启动 Grafana LGTM 一体化容器，请运行以下命令：

```shell
docker compose up -d
```

### 使用 Docker CLI

或者，你可以直接使用 Docker 命令行运行 Grafana：

```shell
docker run -d --name grafana_lgtm \
    -p 4317:4317 \   # OTLP gRPC 接收器（追踪、指标、日志）
    -p 4318:4318 \   # OTLP HTTP 接收器
    -p 3000:3000 \   # Grafana 用户界面
    -e GF_SECURITY_ADMIN_USER=admin \
    -e GF_SECURITY_ADMIN_PASSWORD=admin \
    grafana/otel-lgtm:latest
```

### 应用程序导出配置

要将遥测数据从 Ktor 应用程序发送到 OTLP 端点，请配置 OpenTelemetry SDK 以使用 gRPC 协议。在构建 SDK 之前，你可以通过环境变量设置这些值：

```shell
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

或者使用 JVM 标志：

```text
-Dotel.traces.exporter=otlp -Dotel.exporter.otlp.protocol=grpc -Dotel.exporter.otlp.endpoint=http://localhost:4317
```

### 访问 Grafana 用户界面

运行后，Grafana 用户界面将在 [http://localhost:3000/](http://localhost:3000/) 可用。

<procedure>
    <step>
        在 <a href="http://localhost:3000/">http://localhost:3000/</a> 打开 Grafana 用户界面。
    </step>
    <step>
        使用默认凭据登录：
        <list>
            <li><ui-path>用户：</ui-path><code>admin</code></li>
            <li><ui-path>密码：</ui-path><code>admin</code></li>
        </list>
    </step>
    <step>
        在左侧导航菜单中，前往 <ui-path>下钻 → 追踪</ui-path>：
        <img src="opentelemetry-grafana-ui.png" alt="Grafana UI Drilldown traces view" width="706" corners="rounded"/>
        进入 <ui-path>追踪</ui-path> 视图后，你可以：
        <list>
            <li>选择速率、错误或持续时间指标。</li>
            <li>应用 span 过滤器（例如，按服务名称或 span 名称）来缩小数据范围。</li>
            <li>查看追踪、探查详情并与 span 时间线交互。</li>
        </list>
    </step>
</procedure>