[//]: # (title: 调用日志)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许你运行服务器而无需额外的运行时或虚拟机。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

Ktor 提供了使用 [SLF4J](http://www.slf4j.org/) 库记录应用程序事件的能力。你可以从 [Ktor 服务器中的日志记录](server-logging.md) 主题了解通用日志配置。

`%plugin_name%` 插件允许你记录传入的客户端请求。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要将 <code>%artifact_name%</code> artifact 包含到构建脚本中:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，请在指定的 <Links href="/ktor/server-modules" summary="模块允许你通过分组路由来组织应用程序。">模块</Links> 中将其传递给 <code>install</code> 函数。下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，该 <code>module</code> 是 <code>Application</code> 类的扩展函数。
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

## 配置日志设置 {id="configure"}

你可以通过多种方式配置 `%plugin_name%`：指定日志级别、根据指定条件过滤请求、自定义日志消息等等。你可以在 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.call-logging/-call-logging-config/index.html) 中查看可用的配置设置。

### 设置日志级别 {id="logging_level"}

默认情况下，Ktor 使用 `Level.INFO` 日志级别。要更改它，请使用 `level` 属性:

```kotlin
install(CallLogging) {
    level = Level.INFO
}
```

### 过滤日志请求 {id="filter"}

`filter` 属性允许你添加过滤请求的条件。在下面的示例中，只有发往 `/api/v1` 的请求才会被记录到日志中:

```kotlin
install(CallLogging) {
    filter { call ->
        call.request.path().startsWith("/api/v1")
    }
}
```

### 自定义日志消息格式 {id="format"}

通过使用 `format` 函数，你可以将与请求/响应相关的任何数据放入日志中。下面的示例展示了如何记录每个请求的响应状态、请求 HTTP 方法和 `User-Agent` 标头值。

```kotlin
install(CallLogging) {
    format { call ->
        val status = call.response.status()
        val httpMethod = call.request.httpMethod.value
        val userAgent = call.request.headers["User-Agent"]
        "Status: $status, HTTP method: $httpMethod, User agent: $userAgent"
    }
}
```

你可以在这里找到完整示例: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 将调用参数放入 MDC {id="mdc"}

`%plugin_name%` 插件支持 MDC (Mapped Diagnostic Context)。你可以使用 `mdc` 函数将所需上下文值以指定名称放入 MDC。例如，在下面的代码片段中，将 `name` 查询参数添加到 MDC:

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

你可以在 `ApplicationCall` 的生命周期内访问添加的值:

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")