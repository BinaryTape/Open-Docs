[//]: # (title: 在 Ktor 服务端跟踪请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="call-id"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你无需额外运行时或虚拟机即可运行服务端。">Kotlin/Native 服务端</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 服务端插件允许你使用唯一的调用 ID 跟踪客户端请求。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 插件允许你使用唯一的请求 ID 或调用 ID 端到端地跟踪客户端请求。通常，在 Ktor 中处理调用 ID 可能如下所示：
1. 首先，你需要通过以下方式之一获取特定请求的调用 ID：
   *   反向代理（例如 Nginx）或云服务提供商（例如 [Heroku](heroku.md)）可能会在特定请求头中添加调用 ID，例如 `X-Request-Id`。在这种情况下，Ktor 允许你[检索](#retrieve)调用 ID。
   *   否则，如果请求没有附带调用 ID，你可以在 Ktor 服务端上[生成](#generate)它。
2. 接下来，Ktor 使用预定义的字典[验证](#verify)检索/生成的调用 ID。你也可以提供自己的条件来验证调用 ID。
3. 最后，你可以将调用 ID [发送](#send)到客户端的特定请求头中，例如 `X-Request-Id`。

将 `%plugin_name%` 与 [CallLogging](server-call-logging.md) 结合使用有助于你通过将[调用 ID 放入 MDC 上下文](#put-call-id-mdc)并配置日志记录器以显示每个请求的调用 ID 来进行调用排障。

> 在客户端，Ktor 提供了 [CallId](client-call-id.md) 插件用于跟踪客户端请求。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
        请在指定的<Links href="/ktor/server-modules" summary="模块允许你通过对路由进行分组来构建应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，这是一个 <code>Application</code> 类的扩展函数。
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
    

## 配置 %plugin_name% {id="configure"}

### 检索调用 ID {id="retrieve"}

`%plugin_name%` 提供了几种检索调用 ID 的方式：

*   要从指定的请求头中检索调用 ID，请使用 `retrieveFromHeader` 函数，例如：
    ```kotlin
    install(CallId) {
        retrieveFromHeader(HttpHeaders.XRequestId)
    }
    ```
    你也可以使用 `header` 函数在同一个请求头中[检索并发送调用 ID](#send)。

*   如果需要，你可以从 `ApplicationCall` 中检索调用 ID：
    ```kotlin
    install(CallId) {
        retrieve { call ->
            call.request.header(HttpHeaders.XRequestId)
        }
    }
    ```
请注意，所有检索到的调用 ID 都会使用默认字典进行[验证](#verify)。

### 生成调用 ID {id="generate"}

如果传入的请求不包含调用 ID，你可以使用 `generate` 函数生成它：
*   下面的示例展示了如何从预定义字典中生成具有特定长度的调用 ID：
    ```kotlin
    install(CallId) {
        generate(10, "abcde12345")
    }
    ```
*   在下面的示例中，`generate` 函数接受一个用于生成调用 ID 的代码块：
    ```kotlin
    install(CallId) {
        val counter = atomic(0)
        generate {
            "generated-call-id-${counter.getAndIncrement()}"
        }
    }
    ```

### 验证调用 ID {id="verify"}

所有[检索](#retrieve)/[生成](#generate)的调用 ID 都会使用默认字典进行验证，该字典如下所示：

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
这意味着包含大写字母的调用 ID 将无法通过验证。如果需要，你可以使用 `verify` 函数应用不太严格的规则：

[object Promise]

你可以在这里找到完整的示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### 将调用 ID 发送到客户端 {id="send"}

在[检索](#retrieve)/[生成](#generate)调用 ID 后，你可以将其发送到客户端：

*   `header` 函数可用于[检索调用 ID](#retrieve) 并在同一个请求头中发送：

    [object Promise]

    你可以在这里找到完整的示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

*   `replyToHeader` 函数在指定的请求头中发送调用 ID：
    ```kotlin
    install(CallId) {
        replyToHeader(HttpHeaders.XRequestId)
    }
    ```

*   如果需要，你可以使用 `ApplicationCall` 在[响应](server-responses.md)中发送调用 ID：
    ```kotlin
    reply { call, callId ->
        call.response.header(HttpHeaders.XRequestId, callId)
    }
    ```

## 将调用 ID 放入 MDC {id="put-call-id-mdc"}

将 `%plugin_name%` 与 [CallLogging](server-call-logging.md) 结合使用有助于你通过将调用 ID 放入 MDC 上下文并配置日志记录器以显示每个请求的调用 ID 来进行调用排障。为此，请在 `CallLogging` 配置代码块中调用 `callIdMdc` 函数，并指定要放入 MDC 上下文中的所需键：

[object Promise]

此键可以传递给[日志记录器配置](server-logging.md#configure-logger)以在日志中显示调用 ID。例如，`logback.xml` 文件可能如下所示：
[object Promise]

你可以在这里找到完整的示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。