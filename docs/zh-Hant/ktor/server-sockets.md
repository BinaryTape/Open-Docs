[//]: # (title: 通訊端)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-network</code>、<code>io.ktor:ktor-network-tls</code>
</p>
<p><b>程式碼範例</b>：
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>、
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>、
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

除了伺服器和用戶端的 HTTP/WebSocket 處理之外，Ktor 還支援 TCP 和 UDP 原始通訊端。
它暴露了一個掛起式 API，底層使用 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)。

> 通訊端使用實驗性 API，預計在即將到來的更新中會演進，並可能帶來重大變更。
>
{type="note"}

## 新增依賴項 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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

若要在用戶端使用[安全通訊端](#secure)，您還需要新增 `io.ktor:ktor-network-tls`。

## 伺服器 {id="server"}

### 建立伺服器通訊端 {id="server_create_socket"}

若要建立伺服器通訊端，請建立 `SelectorManager` 實例，在其上呼叫 `SocketBuilder.tcp()` 函式，然後使用 `bind` 將伺服器通訊端繫結到特定連接埠：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
```

上面的程式碼片段建立了一個 TCP 通訊端，它是 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 實例。
若要建立 UDP 通訊端，請使用 `SocketBuilder.udp()`。

### 接受傳入連線 {id="accepts_connection"}

建立伺服器通訊端後，您需要呼叫 `ServerSocket.accept` 函式，它接受一個通訊端連線並返回一個已連線通訊端（一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例）：

```kotlin
val socket = serverSocket.accept()
```

一旦您擁有一個已連線通訊端，就可以透過從通訊端讀取或寫入來接收/傳送資料。

### 接收資料 {id="server_receive"}

若要從用戶端接收資料，您需要呼叫 `Socket.openReadChannel` 函式，它返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel` 提供了非同步讀取資料的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

```kotlin
val name = receiveChannel.readUTF8Line()
```

### 傳送資料 {id="server_send"}

若要將資料傳送給用戶端，請呼叫 `Socket.openWriteChannel` 函式，它返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel` 提供了非同步寫入位元組序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

```kotlin
val name = receiveChannel.readUTF8Line()
sendChannel.writeStringUtf8("Hello, $name!
")
```

### 關閉通訊端 {id="server_close"}

若要釋放與[已連線通訊端](#accepts_connection)相關聯的資源，請呼叫 `Socket.close`：

```kotlin
socket.close()
```

### 範例 {id="server-example"}

以下程式碼範例展示了如何在伺服器端使用通訊端：

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

您可以在此處找到完整範例：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 用戶端 {id="client"}

### 建立通訊端 {id="client_create_socket"}

若要建立用戶端通訊端，請建立 `SelectorManager` 實例，在其上呼叫 `SocketBuilder.tcp()` 函式，
然後使用 `connect` 建立連線並取得一個已連線通訊端（一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例）：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 9002)
```

一旦您擁有一個已連線通訊端，就可以透過從通訊端讀取或寫入來接收/傳送資料。

### 建立安全通訊端 (SSL/TLS) {id="secure"}

安全通訊端允許您建立 TLS 連線。
若要使用安全通訊端，您需要新增 [ktor-network-tls](#add_dependencies) 依賴項。
然後，在已連線通訊端上呼叫 `Socket.tls` 函式：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函式允許您調整 [TLSConfigBuilder](https://api.ktor.io/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 參數：

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

您可以在此處找到完整範例：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收資料 {id="client_receive"}

若要從伺服器接收資料，您需要呼叫 `Socket.openReadChannel` 函式，它返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel` 提供了非同步讀取資料的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

```kotlin
val greeting = receiveChannel.readUTF8Line()
```

### 傳送資料 {id="client_send"}

若要將資料傳送給伺服器，請呼叫 `Socket.openWriteChannel` 函式，它返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel` 提供了非同步寫入位元組序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

```kotlin
val myMessage = readln()
sendChannel.writeStringUtf8("$myMessage
")
```

### 關閉連線 {id="client_close"}

若要釋放與[已連線通訊端](#client_create_socket)相關聯的資源，請呼叫 `Socket.close` 和 `SelectorManager.close`：

```kotlin
socket.close()
selectorManager.close()
```

### 範例 {id="client-example"}

以下程式碼範例展示了如何在用戶端使用通訊端：

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

您可以在此處找到完整範例：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。