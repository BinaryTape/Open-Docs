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

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

Ktor 提供了使用 [SLF4J](http://www.slf4j.org/) 库记录应用程序事件的能力。关于通用的日志配置，请参阅 [](server-logging.md) 主题。

`%plugin_name%` 插件允许您记录传入的客户端请求。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> artifact 包含在构建脚本中：
    </p>
    

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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，该模块是 <code>Application</code> 类的扩展函数。
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
    

## 配置日志设置 {id="configure"}

您可以通过多种方式配置 `%plugin_name%`：指定日志级别、基于指定条件过滤请求、自定义日志消息等等。您可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html) 中查看可用的配置设置。

### 设置日志级别 {id="logging_level"}

默认情况下，Ktor 使用 `Level.INFO` 日志级别。要更改它，请使用 `level` 属性：

[object Promise]

### 过滤日志请求 {id="filter"}

`filter` 属性允许您添加用于过滤请求的条件。在下面的示例中，只有发送到 `/api/v1` 的请求才会进入日志：

[object Promise]

### 自定义日志消息格式 {id="format"}

通过使用 `format` 函数，您可以将与请求/响应相关的任何数据放入日志中。下面的示例展示了如何记录响应状态、请求 HTTP 方法以及每个请求的 `User-Agent` 标头值。

[object Promise]

您可以在此处找到完整示例：[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 将调用参数放入 MDC {id="mdc"}

`%plugin_name%` 插件支持 MDC（映射诊断上下文）。您可以使用 `mdc` 函数将所需的上下文值以及指定名称放入 MDC。例如，在下面的代码片段中，将 `name` 查询参数添加到了 MDC：

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

您可以在 `ApplicationCall` 的生命周期内访问添加的值：

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")
```