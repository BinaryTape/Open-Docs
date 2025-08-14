[//]: # (title: 套接字)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

除了为服务器和客户端提供 HTTP/WebSocket 处理之外，Ktor 还支持 TCP 和 UDP 原始套接字。
它公开了一个底层使用 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html) 的挂起 API。

> 套接字使用实验性的 API，预计将在未来的更新中演进，可能包含破坏性变更。
>
{type="note"}

## 添加依赖项 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

要在客户端使用[安全套接字](#secure)，您还需要添加 `io.ktor:ktor-network-tls`。

## 服务器 {id="server"}

### 创建服务器套接字 {id="server_create_socket"}

要构建服务器套接字，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，
然后使用 `bind` 将服务器套接字绑定到特定端口：

[object Promise]

上述代码片段创建了一个 TCP 套接字，即 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 实例。
要创建 UDP 套接字，请使用 `SocketBuilder.udp()`。

### 接受传入连接 {id="accepts_connection"}

创建服务器套接字后，您需要调用 `ServerSocket.accept` 函数，该函数接受套接字连接并
返回一个已连接套接字（一个 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 实例）：

[object Promise]

一旦您拥有一个已连接套接字，就可以通过从套接字读取数据或向套接字写入数据来接收/发送数据。

### 接收数据 {id="server_receive"}

要从客户端接收数据，您需要调用 `Socket.openReadChannel` 函数，该函数返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

[object Promise]

`ByteReadChannel` 提供了用于异步读取数据的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

[object Promise]

### 发送数据 {id="server_send"}

要向客户端发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

[object Promise]

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

[object Promise]

### 关闭套接字 {id="server_close"}

要释放与[已连接套接字](#accepts_connection)相关的资源，请调用 `Socket.close`：

[object Promise]

### 示例 {id="server-example"}

以下代码示例演示了如何在服务器端使用套接字：

[object Promise]

您可以在此处找到完整示例：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 客户端 {id="client"}

### 创建套接字 {id="client_create_socket"}

要构建客户端套接字，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，
然后使用 `connect` 建立连接并获取已连接套接字（一个 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 实例）：

[object Promise]

一旦您拥有一个已连接套接字，就可以通过从套接字读取数据或向套接字写入数据来接收/发送数据。

### 创建安全套接字 (SSL/TLS) {id="secure"}

安全套接字允许您建立 TLS 连接。
要使用安全套接字，您需要添加 [ktor-network-tls](#add_dependencies) 依赖项。
然后，在已连接套接字上调用 `Socket.tls` 函数：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函数允许您调整由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 参数：

[object Promise]

您可以在此处找到完整示例：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收数据 {id="client_receive"}

要从服务器接收数据，您需要调用 `Socket.openReadChannel` 函数，该函数返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

[object Promise]

`ByteReadChannel` 提供了用于异步读取数据的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

[object Promise]

### 发送数据 {id="client_send"}

要向服务器发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

[object Promise]

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

[object Promise]

### 关闭连接 {id="client_close"}

要释放与[已连接套接字](#client_create_socket)相关的资源，请调用 `Socket.close` 和 `SelectorManager.close`：

[object Promise]

### 示例 {id="client-example"}

以下代码示例演示了如何在客户端使用套接字：

[object Promise]

您可以在此处找到完整示例：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。