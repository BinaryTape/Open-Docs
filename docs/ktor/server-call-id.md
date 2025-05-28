[//]: # (title: Ktor Server 中的请求追踪)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="call-id"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 服务器插件允许您使用唯一的调用 ID 追踪客户端请求。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 插件允许您使用唯一的请求 ID 或调用 ID 端到端地追踪客户端请求。通常，在 Ktor 中使用调用 ID 的过程可能如下所示：
1.  首先，您需要通过以下方式之一获取特定请求的调用 ID：
    *   反向代理（如 Nginx）或云服务提供商（如 [Heroku](heroku.md)）可能会在特定请求头中添加调用 ID，例如 `X-Request-Id`。在这种情况下，Ktor 允许您[检索](#retrieve)调用 ID。
    *   否则，如果请求没有附带调用 ID，您可以在 Ktor 服务器上[生成](#generate)它。
2.  接下来，Ktor 使用预定义的字典[验证](#verify)已检索/生成的调用 ID。您也可以提供自己的条件来验证调用 ID。
3.  最后，您可以在特定请求头中将调用 ID [发送](#send)给客户端，例如 `X-Request-Id`。

将 `%plugin_name%` 与 [CallLogging](server-call-logging.md) 结合使用，有助于您通过将[调用 ID 放入 MDC 上下文](#put-call-id-mdc)并配置日志记录器以显示每个请求的调用 ID 来进行调用故障排除。

> 在客户端，Ktor 提供了 [CallId](client-call-id.md) 插件用于追踪客户端请求。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

### 检索调用 ID {id="retrieve"}

%plugin_name% 提供了几种检索调用 ID 的方法：

*   要从指定的请求头中检索调用 ID，请使用 `retrieveFromHeader` 函数，例如：
    ```kotlin
    install(CallId) {
        retrieveFromHeader(HttpHeaders.XRequestId)
    }
    ```
    您还可以使用 `header` 函数在同一个请求头中[检索并发送调用 ID](#send)。

*   如果需要，您可以从 `ApplicationCall` 中检索调用 ID：
    ```kotlin
    install(CallId) {
        retrieve { call ->
            call.request.header(HttpHeaders.XRequestId)
        }
    }
    ```
请注意，所有检索到的调用 ID 都将使用默认字典进行[验证](#verify)。

### 生成调用 ID {id="generate"}

如果传入请求不包含调用 ID，您可以使用 `generate` 函数生成它：
*   以下示例展示了如何从预定义的字典中生成具有特定长度的调用 ID：
    ```kotlin
    install(CallId) {
        generate(10, "abcde12345")
    }
    ```
*   在以下示例中，`generate` 函数接受一个用于生成调用 ID 的代码块：
    ```kotlin
    install(CallId) {
        val counter = atomic(0)
        generate {
            "generated-call-id-${counter.getAndIncrement()}"
        }
    }
    ```

### 验证调用 ID {id="verify"}

所有[检索](#retrieve)/[生成](#generate)的调用 ID 都将使用默认字典进行验证，其内容如下：

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
这意味着包含大写字母的调用 ID 将无法通过验证。如果需要，您可以使用 `verify` 函数应用更宽松的规则：

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13,15-18"}

您可以在此处找到完整示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### 将调用 ID 发送给客户端 {id="send"}

在[检索](#retrieve)/[生成](#generate)调用 ID 后，您可以将其发送给客户端：

*   `header` 函数可用于[检索调用 ID](#retrieve) 并在同一个请求头中发送它：

    ```kotlin
    ```
    {src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13-14,18"}

    您可以在此处找到完整示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

*   `replyToHeader` 函数在指定的请求头中发送调用 ID：
    ```kotlin
    install(CallId) {
        replyToHeader(HttpHeaders.XRequestId)
    }
    ```

*   如果需要，您可以使用 `ApplicationCall` 在[响应](server-responses.md)中发送调用 ID：
    ```kotlin
    reply { call, callId ->
        call.response.header(HttpHeaders.XRequestId, callId)
    }
    ```

## 将调用 ID 放入 MDC {id="put-call-id-mdc"}

将 `%plugin_name%` 与 [CallLogging](server-call-logging.md) 结合使用，有助于您通过将调用 ID 放入 MDC 上下文并配置日志记录器以显示每个请求的调用 ID 来进行调用故障排除。为此，请在 `CallLogging` 配置块内部调用 `callIdMdc` 函数，并指定要放入 MDC 上下文中的所需键：

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="19-21"}

此键可以传递给[日志记录器配置](server-logging.md#configure-logger)，以便在日志中显示调用 ID。例如，`logback.xml` 文件可能如下所示：
```
```
{style="block" src="snippets/call-id/src/main/resources/logback.xml" include-lines="2-6"}

您可以在此处找到完整示例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。