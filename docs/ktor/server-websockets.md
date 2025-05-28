[//]: # (title: Ktor 服务器中的 WebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Websockets 插件允许您在服务器和客户端之间创建多向通信会话。
</link-summary>

<snippet id="websockets-description">

WebSocket 是一种协议，它通过单个 TCP 连接在用户浏览器和服务器之间提供全双工通信会话。它对于创建需要从服务器和向服务器实时传输数据的应用程序特别有用。

Ktor 在服务器端和客户端都支持 WebSocket 协议。

</snippet>

Ktor 允许您：

*   配置基本的 WebSocket 设置，例如帧大小、ping 周期等。
*   处理 WebSocket 会话，用于在服务器和客户端之间交换消息。
*   添加 WebSocket 扩展。例如，您可以使用 [Deflate](server-websocket-deflate.md) 扩展或实现一个[自定义扩展](server-websocket-extensions.md)。

> 要了解客户端的 WebSocket 支持，请参阅 [WebSockets 客户端插件](client-websockets.topic)。

> 对于单向通信会话，请考虑使用 [Server-Sent Events (SSE)](server-server-sent-events.topic)。SSE 在服务器需要向客户端发送基于事件的更新时特别有用。
>
{style="note"}

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 WebSockets {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 WebSockets {id="configure"}

您可以选择在 `install` 块中通过传递 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html) 来配置插件：

*   使用 `pingPeriod` 属性指定 ping 之间的持续时间。
*   使用 `timeout` 属性设置连接关闭前的超时时间。
*   使用 `maxFrameSize` 属性设置可接收或发送的最大帧。
*   使用 `masking` 属性指定是否启用掩码。
*   使用 `contentConverter` 属性设置用于序列化/反序列化的转换器。

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="13-18"}

## 处理 WebSockets 会话 {id="handle-sessions"}

### API 概述 {id="api-overview"}

安装并配置 `WebSockets` 插件后，您可以定义一个端点来处理 Websocket 会话。要在服务器上定义 WebSocket 端点，请在 [routing](server-routing.md#define_route) 块内调用 `webSocket` 函数：

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

在此示例中，当使用[默认配置](server-configuration-file.topic)时，服务器接受对 `ws://localhost:8080/echo` 的 WebSocket 请求。

在 `webSocket` 块内，您定义 WebSocket 会话的处理程序，该会话由 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 类表示。
在该块中可以使用以下函数和属性：

*   使用 `send` 函数向客户端发送文本内容。
*   使用 `incoming` 和 `outgoing` 属性访问用于接收和发送 WebSocket 帧的通道。帧由 `Frame` 类表示。
*   使用 `close` 函数发送带有指定原因的关闭帧。

处理会话时，您可以检查帧类型，例如：

*   `Frame.Text` 是一个文本帧。对于这种帧类型，您可以使用 `Frame.Text.readText()` 读取其内容。
*   `Frame.Binary` 是一个二进制帧。对于这种类型，您可以使用 `Frame.Binary.readBytes()` 读取其内容。

> 请注意，`incoming` 通道不包含控制帧，例如 ping/pong 或 close 帧。
> 要处理控制帧并重新组装分段帧，请使用 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 函数来处理 WebSocket 会话。
>
{style="note"}

> 要获取有关客户端的信息（例如客户端的 IP 地址），请使用 `call` 属性。了解 [](server-requests.md#request_information)。

下面，我们将查看使用此 API 的示例。

### 示例：处理单个会话 {id="handle-single-session"}

以下示例展示了如何创建 `echo` WebSocket 端点来处理与一个客户端的会话：

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="19,24-36"}

有关完整示例，请参阅 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)。

### 示例：处理多个会话 {id="handle-multiple-session"}

为了高效地管理多个 WebSocket 会话并处理广播，您可以利用 Kotlin 的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)。
这种方法提供了一种可扩展且并发友好的方式来管理 WebSocket 通信。以下是如何实现此模式：

1.  定义一个 `SharedFlow` 用于广播消息：

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="23-24"}

2.  在您的 WebSocket 路由中，实现广播和消息处理逻辑：

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="25-48"}

`runCatching` 块处理传入消息并将它们发送到 `SharedFlow`，然后 `SharedFlow` 广播给所有收集器。

通过使用此模式，您可以高效地管理多个 WebSocket 会话，而无需手动跟踪单个连接。这种方法适用于具有许多并发 WebSocket 连接的应用程序，并提供了一种清晰、响应式的方式来处理消息广播。

有关完整示例，请参阅 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)。

## WebSocket API 和 Ktor {id="websocket-api"}

[WebSocket API 中的标准事件](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 以以下方式映射到 Ktor：

*   `onConnect` 发生在块的开始。
*   `onMessage` 发生在成功读取消息（例如，使用 `incoming.receive()`）或使用 `for(frame in incoming)` 进行挂起迭代之后。
*   `onClose` 发生在 `incoming` 通道关闭时。这将完成挂起迭代，或者在尝试接收消息时抛出 `ClosedReceiveChannelException`。
*   `onError` 等同于其他异常。

在 `onClose` 和 `onError` 中，`closeReason` 属性都会被设置。

在以下示例中，只有当异常发生时（无论是 `ClosedReceiveChannelException` 还是其他异常），无限循环才会退出：

```kotlin
webSocket("/echo") {
    println("onConnect")
    try {
        for (frame in incoming){
            val text = (frame as Frame.Text).readText()
            println("onMessage")
            received += text
            outgoing.send(Frame.Text(text))
        }
    } catch (e: ClosedReceiveChannelException) {
        println("onClose ${closeReason.await()}")
    } catch (e: Throwable) {
        println("onError ${closeReason.await()}")
        e.printStackTrace()
    }
}