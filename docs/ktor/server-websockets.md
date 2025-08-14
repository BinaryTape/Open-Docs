[//]: # (title: Ktor Server 中的 WebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
WebSockets 插件允许您在服务器与客户端之间创建多向通信会话。
</link-summary>

<snippet id="websockets-description">

WebSocket 是一种协议，它通过单个 TCP 连接在用户浏览器和服务器之间提供全双工通信会话。它尤其适用于创建需要实时数据传输（从服务器到服务器以及从服务器到客户端）的应用程序。

Ktor 在服务器端和客户端都支持 WebSocket 协议。

</snippet>

Ktor 允许您：

* 配置基本的 WebSocket 设置，例如帧大小、ping 周期等。
* 处理 WebSocket 会话以在服务器和客户端之间交换消息。
* 添加 WebSocket 扩展。例如，您可以使用 [Deflate](server-websocket-deflate.md) 扩展或实现 [自定义扩展](server-websocket-extensions.md)。

> 关于客户端 WebSocket 支持，请参见 [WebSockets 客户端插件](client-websockets.topic)。

> 对于单向通信会话，请考虑使用 [Server-Sent Events (SSE)](server-server-sent-events.topic)。SSE 尤其适用于服务器需要向客户端发送基于事件的更新的情况。
>
{style="note"}

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> 构件引入构建脚本：
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
    

## 安装 WebSockets {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，请将其传入指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
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
    

## 配置 WebSockets {id="configure"}

可选地，您可以通过传入 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html) 在 `install` 代码块内部配置插件：

* 使用 `pingPeriod` 属性来指定 ping 之间的持续时间。
* 使用 `timeout` 属性来设置超时，超时后连接将被关闭。
* 使用 `maxFrameSize` 属性来设置可以接收或发送的最大 Frame。
* 使用 `masking` 属性来指定是否启用掩码。
* 使用 `contentConverter` 属性来设置用于序列化/反序列化的转换器。

[object Promise]

## 处理 WebSockets 会话 {id="handle-sessions"}

### API 概述 {id="api-overview"}

安装并配置 `WebSockets` 插件后，您可以定义一个端点来处理 WebSocket 会话。要在服务器上定义 WebSocket 端点，请在 [routing](server-routing.md#define_route) 代码块内部调用 `webSocket` 函数：

```kotlin
routing { 
    webSocket("/echo") {
       // 处理 WebSocket 会话
    }
}
```

在此示例中，当使用 [默认配置](server-configuration-file.topic) 时，服务器接受对 `ws://localhost:8080/echo` 的 WebSocket 请求。

在 `webSocket` 代码块内部，您定义了 WebSocket 会话的处理器，该处理器由 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 类表示。
以下函数和属性在该代码块内可用：

* 使用 `send` 函数向客户端发送文本内容。
* 使用 `incoming` 和 `outgoing` 属性访问用于接收和发送 WebSocket 帧的通道。帧由 `Frame` 类表示。
* 使用 `close` 函数发送带有指定原因的关闭帧。

处理会话时，您可以检测帧类型，例如：

* `Frame.Text` 是文本帧。对于此帧类型，您可以使用 `Frame.Text.readText()` 读取其内容。
* `Frame.Binary` 是二进制帧。对于此类型，您可以使用 `Frame.Binary.readBytes()` 读取其内容。

> 请注意，`incoming` 通道不包含控制帧，例如 ping/pong 或关闭帧。
> 要处理控制帧并重新组装分段帧，请使用 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 函数来处理 WebSocket 会话。
>
{style="note"}

> 要获取有关客户端的信息（例如客户端的 IP 地址），请使用 `call` 属性。了解更多信息，请参阅 [](server-requests.md#request_information)。

下面，我们将通过示例来了解如何使用此 API。

### 示例：处理单个会话 {id="handle-single-session"}

以下示例展示了如何创建 `echo` WebSocket 端点以处理与一个客户端的会话：

[object Promise]

有关完整示例，请参见 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)。

### 示例：处理多个会话 {id="handle-multiple-session"}

为了高效管理多个 WebSocket 会话并处理广播，您可以利用 Kotlin 的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)。此方法提供了一种可伸缩且并发友好的方法来管理 WebSocket 通信。以下是实现此模式的方法：

1. 定义一个用于广播消息的 `SharedFlow`：

[object Promise]

2. 在 WebSocket 路由中，实现广播和消息处理逻辑：

[object Promise]

`runCatching` 代码块处理传入消息并将其发射到 `SharedFlow`，然后 `SharedFlow` 将其广播给所有收集器。

通过使用此模式，您可以高效管理多个 WebSocket 会话，而无需手动跟踪单个连接。此方法对于具有许多并发 WebSocket 连接的应用程序能良好地伸缩，并提供了一种清晰、反应式的方法来处理消息广播。

有关完整示例，请参见 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)。

## WebSocket API 与 Ktor {id="websocket-api"}

[WebSocket API 中的标准事件](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 以以下方式映射到 Ktor：

* `onConnect` 发生在代码块的开始处。
* `onMessage` 在成功读取消息（例如，使用 `incoming.receive()`）或使用 `for(frame in incoming)` 进行挂起迭代后发生。
* `onClose` 在 `incoming` 通道关闭时发生。这将完成挂起迭代，或在尝试接收消息时抛出 `ClosedReceiveChannelException`。
* `onError` 等同于其他异常。

在 `onClose` 和 `onError` 中，都会设置 `closeReason` 属性。

在以下示例中，无限循环将仅当出现异常时才会退出（无论是 `ClosedReceiveChannelException` 还是其他异常）：

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
```