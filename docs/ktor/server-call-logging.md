[//]: # (title: 调用日志)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor 提供了使用 [SLF4J](http://www.slf4j.org/) 库记录应用程序事件的能力。你可以从 [](server-logging.md) 主题了解通用日志配置。

`CallLogging` 插件允许你记录传入的客户端请求。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 CallLogging {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置日志设置 {id="configure"}

你可以通过多种方式配置 `CallLogging`：指定日志级别、根据指定条件过滤请求、自定义日志消息等等。你可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html) 查看可用的配置设置。

### 设置日志级别 {id="logging_level"}

默认情况下，Ktor 使用 `Level.INFO` 日志级别。要更改它，请使用 `level` 属性：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14-15,25"}

### 过滤日志请求 {id="filter"}

`filter` 属性允许你添加过滤请求的条件。在下面的示例中，只有对 `/api/v1` 的请求才会记录到日志中：

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,16-18,25"}

### 自定义日志消息格式 {id="format"}

通过使用 `format` 函数，你可以将与请求/响应相关的任何数据放入日志中。以下示例展示了如何为每个请求记录响应状态、请求 HTTP 方法以及 `User-Agent` 标头值。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,19-25"}

你可以在这里找到完整的示例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 将调用参数放入 MDC {id="mdc"}

`CallLogging` 插件支持 MDC (Mapped Diagnostic Context)。你可以使用 `mdc` 函数将所需的上下文值及其指定名称放入 MDC。例如，在下面的代码片段中，一个 `name` 查询参数被添加到 MDC：

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

你可以在 `ApplicationCall` 的生命周期中访问添加的值：

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")