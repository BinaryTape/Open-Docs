<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-websockets" title="Ktor 客户端中的 WebSockets">
    <show-structure for="chapter" depth="3"/>
    <primary-label ref="client-plugin"/>
    <var name="example_name" value="client-websockets"/>
    <var name="artifact_name" value="ktor-client-websockets"/>
    <tldr>
        <p>
            <b>必需的依赖项</b>: <code>io.ktor:ktor-client-websockets</code>
        </p>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        WebSockets 插件允许您在服务器和客户端之间创建多向通信会话。
    </link-summary>
    <snippet id="websockets-description">
WebSocket 是一种协议，它通过单个 TCP 连接在用户浏览器和服务器之间提供全双工通信会话。它对于创建需要与服务器进行实时数据传输的应用程序特别有用。Ktor 在服务器端和客户端都支持 WebSocket 协议。
</snippet>
    <p>WebSockets 客户端插件允许您处理 WebSocket 会话以与服务器交换消息。</p>
    <note>
        <p>并非所有引擎都支持 WebSockets。关于支持的引擎概述，请参考<a href="client-engines.md#limitations">限制</a>。</p>
    </note>
    <tip>
        <p>要了解服务器端的 WebSocket 支持，请参见<Links href="/ktor/server-websockets" summary="WebSockets 插件允许您在服务器和客户端之间创建多向通信会话。">Ktor 服务器中的 WebSockets</Links>。</p>
    </tip>
    <chapter title="添加依赖项" id="add_dependencies">
        <p>要使用 <code>WebSockets</code>，您需要将 <code>%artifact_name%</code> artifact 添加到构建脚本中：</p>
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
    <p>
        您可以从<Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links>了解有关 Ktor 客户端所需 artifact 的更多信息。
    </p>
    </chapter>
    <chapter title="安装 WebSockets" id="install_plugin">
        <p>要安装 <code>WebSockets</code> 插件，请将其传递到 <a href="#configure-client">客户端配置块</a>内的 <code>install</code> 函数中：</p>
        [object Promise]
    </chapter>
    <chapter title="配置" id="configure_plugin">
        <p>您可以选择在 <code>install</code> 块内部配置插件，方法是传入 
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/-web-sockets/-config/index.html">WebSockets.Config</a>
            支持的属性。
        </p>
        <deflist>
            <def id="maxFrameSize">
                <title><code>maxFrameSize</code></title>
                设置可接收或发送的最大 <code>Frame</code> 大小。
            </def>
            <def id="contentConverter">
                <title><code>contentConverter</code></title>
                设置用于序列化/反序列化的转换器。
            </def>
            <def id="pingIntervalMillis">
                <title><code>pingIntervalMillis</code></title>
                以 <code>Long</code> 格式指定 ping 间隔时长。
            </def>
            <def id="pingInterval">
                <title><code>pingInterval</code></title>
                以 <code>Duration</code> 格式指定 ping 间隔时长。
            </def>
        </deflist>
        <warning>
            <p><code>pingInterval</code> 和 <code>pingIntervalMillis</code> 属性不适用于 OkHttp 引擎。要为 OkHttp 设置 ping 间隔，您可以使用
                <a href="#okhttp">引擎配置</a>：
            </p>
            [object Promise]
        </warning>
        <p>
            在以下示例中，WebSockets 插件配置了 20 秒（<code>20_000</code> 毫秒）的 ping 间隔，以自动发送 ping 帧并保持 WebSocket 连接活跃：
        </p>
        [object Promise]
    </chapter>
    <chapter title="使用 WebSocket 会话" id="working-wtih-session">
        <p>客户端的 WebSocket 会话由
            <a href="https://api.ktor.io/ktor-shared/ktor-websockets/io.ktor.websocket/-default-web-socket-session/index.html">DefaultClientWebSocketSession</a>
            接口表示。此接口公开了允许您发送和接收 WebSocket 帧以及关闭会话的 API。
        </p>
        <chapter title="访问 WebSocket 会话" id="access-session">
            <p>
                <code>HttpClient</code> 提供了两种主要方式来访问 WebSocket 会话：
            </p>
            <list>
                <li>
                    <p><a
                            href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket.html">webSocket()</a>
                        函数接受 <code>DefaultClientWebSocketSession</code> 作为代码块实参。</p>
                    [object Promise]
                </li>
                <li>
                    <a
                        href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket-session.html">webSocketSession()</a>
                    函数返回 <code>DefaultClientWebSocketSession</code> 实例，并允许您在 <code>runBlocking</code> 或 <code>launch</code> 作用域外部访问会话。
                </li>
            </list>
        </chapter>
        <chapter title="处理 WebSocket 会话" id="handle-session">
            <p>在函数代码块中，您为指定的路径定义处理程序。以下函数和属性在该代码块中可用：</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    使用 <code>send()</code> 函数向服务器发送文本内容。
                </def>
                <def id="outgoing">
                    <title><code>outgoing</code></title>
                    使用 <code>outgoing</code> 属性访问用于发送 WebSocket 帧的通道。帧由 <code>Frame</code> 类表示。
                </def>
                <def id="incoming">
                    <title><code>incoming</code></title>
                    使用 <code>incoming</code> 属性访问用于接收 WebSocket 帧的通道。帧由 <code>Frame</code> 类表示。
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    使用 <code>close()</code> 函数发送带有指定原因的关闭帧。
                </def>
            </deflist>
        </chapter>
        <chapter title="帧类型" id="frame-types">
            <p>
                您可以探查 WebSocket 帧的类型并进行相应处理。一些常见的帧类型包括：
            </p>
            <list>
                <li><code>Frame.Text</code> 表示文本帧。使用
                    <code>Frame.Text.readText()</code> 读取其内容。
                </li>
                <li><code>Frame.Binary</code> 表示二进制帧。使用 <code>Frame.Binary.readBytes()</code>
                    读取其内容。
                </li>
                <li><code>Frame.Close</code> 表示关闭帧。使用 <code>Frame.Close.readReason()</code>
                    获取会话关闭的原因。
                </li>
            </list>
        </chapter>
        <chapter title="示例" id="example">
            <p>以下示例创建了 <code>echo</code> WebSocket 端点，并展示了如何向服务器发送和从服务器接收消息。</p>
            [object Promise]
            <p>有关完整示例，
                请参见
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets">client-websockets</a>。
            </p>
        </chapter>
    </chapter>
</topic>