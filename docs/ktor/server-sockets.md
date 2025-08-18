[//]: # (title: Socket)

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
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生服务器</Links>支持</b>: ✅
</p>
</tldr>

除了服务器和客户端的 HTTP/WebSocket 处理外，Ktor 还支持 TCP 和 UDP 原始 socket。它公开了一个底层使用 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html) 的挂起 API。

> Socket 使用的是实验性的 API，预计会在未来的更新中演进，并可能带来破坏性变更。
>
{type="note"}

## 添加依赖项 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<p>
    要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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

要在客户端使用[安全 socket](#secure)，你还需要添加 `io.ktor:ktor-network-tls`。

## 服务端 {id="server"}

### 创建服务端 socket {id="server_create_socket"}

要构建服务端 socket，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，然后使用 `bind` 将服务端 socket 绑定到特定端口：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
```

上述代码片段创建了一个 TCP socket，它是 `ServerSocket` 实例。要创建 UDP socket，请使用 `SocketBuilder.udp()`。

### 接受传入连接 {id="accepts_connection"}

创建服务端 socket 后，你需要调用 `ServerSocket.accept` 函数，该函数接受一个 socket 连接并返回一个已连接的 socket（一个 `Socket` 实例）：

```kotlin
val socket = serverSocket.accept()
```

一旦你拥有了一个已连接的 socket，你就可以通过从 socket 读取或向 socket 写入来接收/发送数据。

### 接收数据 {id="server_receive"}

要从客户端接收数据，你需要调用 `Socket.openReadChannel` 函数，该函数返回 `ByteReadChannel`：

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel` 提供了用于异步读取数据的 API。例如，你可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

```kotlin
val name = receiveChannel.readUTF8Line()
```

### 发送数据 {id="server_send"}

要向客户端发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 `ByteWriteChannel`：

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。例如，你可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

```kotlin
val name = receiveChannel.readUTF8Line()
sendChannel.writeStringUtf8("Hello, $name!
")
```

### 关闭 socket {id="server_close"}

要释放与[已连接 socket](#accepts_connection) 相关联的资源，请调用 `Socket.close`：

```kotlin
socket.close()
```

### 示例 {id="server-example"}

下面的代码示例演示了如何在服务端使用 socket：

```kotlin
package com.example

import io.ktor.network.selector.*
import io.ktor.network.sockets.*
import io.ktor.utils.io.*
import kotlinx.coroutines.*

fun main(args: Array<String>) {
    runBlocking {
        val selectorManager = SelectorManager(Dispatchers.IO)
        val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
        println("Server is listening at ${serverSocket.localAddress}")
        while (true) {
            val socket = serverSocket.accept()
            println("Accepted $socket")
            launch {
                val receiveChannel = socket.openReadChannel()
                val sendChannel = socket.openWriteChannel(autoFlush = true)
                sendChannel.writeStringUtf8("Please enter your name
")
                try {
                    while (true) {
                        val name = receiveChannel.readUTF8Line()
                        sendChannel.writeStringUtf8("Hello, $name!
")
                    }
                } catch (e: Throwable) {
                    socket.close()
                }
            }
        }
    }
}

```

你可以在此处找到完整示例：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 客户端 {id="client"}

### 创建 socket {id="client_create_socket"}

要构建客户端 socket，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，然后使用 `connect` 建立连接并获取已连接的 socket（一个 `Socket` 实例）：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 9002)
```

一旦你拥有了一个已连接的 socket，你就可以通过从 socket 读取或向 socket 写入来接收/发送数据。

### 创建安全 socket (SSL/TLS) {id="secure"}

安全 socket 允许你建立 TLS 连接。要使用安全 socket，你需要添加 [ktor-network-tls](#add_dependencies) 依赖项。然后，在已连接的 socket 上调用 `Socket.tls` 函数：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函数允许你调整由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 参数：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("youtrack.jetbrains.com", port = 443).tls(coroutineContext = coroutineContext) {
    trustManager = object : X509TrustManager {
        override fun getAcceptedIssuers(): Array<X509Certificate?> = arrayOf()
        override fun checkClientTrusted(certs: Array<X509Certificate?>?, authType: String?) {}
        override fun checkServerTrusted(certs: Array<X509Certificate?>?, authType: String?) {}
    }
}
```

你可以在此处找到完整示例：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收数据 {id="client_receive"}

要从服务器接收数据，你需要调用 `Socket.openReadChannel` 函数，该函数返回 `ByteReadChannel`：

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel` 提供了用于异步读取数据的 API。例如，你可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

```kotlin
val greeting = receiveChannel.readUTF8Line()
```

### 发送数据 {id="client_send"}

要向服务器发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 `ByteWriteChannel`：

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。例如，你可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

```kotlin
val myMessage = readln()
sendChannel.writeStringUtf8("$myMessage
")
```

### 关闭连接 {id="client_close"}

要释放与[已连接 socket](#client_create_socket) 相关联的资源，请调用 `Socket.close` 和 `SelectorManager.close`：

```kotlin
socket.close()
selectorManager.close()
```

### 示例 {id="client-example"}

下面的代码示例演示了如何在客户端使用 socket：

```kotlin
package com.example

import io.ktor.network.selector.*
import io.ktor.network.sockets.*
import io.ktor.utils.io.*
import kotlinx.coroutines.*
import kotlin.system.*

fun main(args: Array<String>) {
    runBlocking {
        val selectorManager = SelectorManager(Dispatchers.IO)
        val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 9002)

        val receiveChannel = socket.openReadChannel()
        val sendChannel = socket.openWriteChannel(autoFlush = true)

        launch(Dispatchers.IO) {
            while (true) {
                val greeting = receiveChannel.readUTF8Line()
                if (greeting != null) {
                    println(greeting)
                } else {
                    println("Server closed a connection")
                    socket.close()
                    selectorManager.close()
                    exitProcess(0)
                }
            }
        }

        while (true) {
            val myMessage = readln()
            sendChannel.writeStringUtf8("$myMessage
")
        }
    }
}

```

你可以在此处找到完整示例：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。