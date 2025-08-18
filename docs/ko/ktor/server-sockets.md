[//]: # (title: 소켓)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>코드 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

서버 및 클라이언트의 HTTP/WebSocket 처리 외에도 Ktor는 TCP 및 UDP 로우 소켓을 지원합니다. Ktor는 내부적으로 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)를 사용하는 코루틴 기반 API를 제공합니다.

> 소켓은 향후 업데이트에서 호환성이 깨지는 변경 사항과 함께 발전할 것으로 예상되는 실험적인 API를 사용합니다.
>
{type="note"}

## 의존성 추가 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<p>
    <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
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

클라이언트에서 [보안 소켓](#secure)을 사용하려면 `io.ktor:ktor-network-tls`도 추가해야 합니다.

## 서버 {id="server"}

### 서버 소켓 생성 {id="server_create_socket"}

서버 소켓을 구축하려면 `SelectorManager` 인스턴스를 생성하고, 해당 인스턴스에서 `SocketBuilder.tcp()` 함수를 호출한 다음, `bind`를 사용하여 서버 소켓을 특정 포트에 바인딩합니다.

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
```

위 코드 스니펫은 TCP 소켓인 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 인스턴스를 생성합니다.
UDP 소켓을 생성하려면 `SocketBuilder.udp()`를 사용합니다.

### 수신 연결 수락 {id="accepts_connection"}

서버 소켓을 생성한 후에는 소켓 연결을 수락하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 반환하는 `ServerSocket.accept` 함수를 호출해야 합니다.

```kotlin
val socket = serverSocket.accept()
```

연결된 소켓을 얻으면 소켓에서 읽거나 소켓에 쓰는 방식으로 데이터를 송수신할 수 있습니다.

### 데이터 수신 {id="server_receive"}

클라이언트로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel`은 비동기 데이터 읽기를 위한 API를 제공합니다.
예를 들어, `ByteReadChannel.readUTF8Line`을 사용하여 UTF-8 문자열 한 줄을 읽을 수 있습니다.

```kotlin
val name = receiveChannel.readUTF8Line()
```

### 데이터 전송 {id="server_send"}

클라이언트로 데이터를 전송하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을 반환하는 `Socket.openWriteChannel` 함수를 호출합니다.

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel`은 비동기 바이트 시퀀스 쓰기를 위한 API를 제공합니다.
예를 들어, `ByteWriteChannel.writeStringUtf8`을 사용하여 UTF-8 문자열 한 줄을 쓸 수 있습니다.

```kotlin
val name = receiveChannel.readUTF8Line()
sendChannel.writeStringUtf8("Hello, $name!
")
```

### 소켓 닫기 {id="server_close"}

[연결된 소켓](#accepts_connection)과 관련된 리소스를 해제하려면 `Socket.close`를 호출합니다.

```kotlin
socket.close()
```

### 예제 {id="server-example"}

아래 코드 샘플은 서버 측에서 소켓을 사용하는 방법을 보여줍니다.

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

전체 예제는 다음에서 찾을 수 있습니다: [sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server).

## 클라이언트 {id="client"}

### 소켓 생성 {id="client_create_socket"}

클라이언트 소켓을 구축하려면 `SelectorManager` 인스턴스를 생성하고, 해당 인스턴스에서 `SocketBuilder.tcp()` 함수를 호출한 다음, `connect`를 사용하여 연결을 설정하고 연결된 소켓([Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 인스턴스)을 얻습니다.

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 9002)
```

연결된 소켓을 얻으면 소켓에서 읽거나 소켓에 쓰는 방식으로 데이터를 송수신할 수 있습니다.

### 보안 소켓 (SSL/TLS) 생성 {id="secure"}

보안 소켓을 사용하면 TLS 연결을 설정할 수 있습니다. 보안 소켓을 사용하려면 [ktor-network-tls](#add_dependencies) 의존성을 추가해야 합니다.
그런 다음, 연결된 소켓에서 `Socket.tls` 함수를 호출합니다.

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 함수를 사용하면 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)가 제공하는 TLS 매개변수를 조정할 수 있습니다.

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

전체 예제는 다음에서 찾을 수 있습니다: [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls).

### 데이터 수신 {id="client_receive"}

서버로부터 데이터를 수신하려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을 반환하는 `Socket.openReadChannel` 함수를 호출해야 합니다.

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel`은 비동기 데이터 읽기를 위한 API를 제공합니다.
예를 들어, `ByteReadChannel.readUTF8Line`을 사용하여 UTF-8 문자열 한 줄을 읽을 수 있습니다.

```kotlin
val greeting = receiveChannel.readUTF8Line()
```

### 데이터 전송 {id="client_send"}

서버로 데이터를 전송하려면 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)을 반환하는 `Socket.openWriteChannel` 함수를 호출합니다.

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel`은 비동기 바이트 시퀀스 쓰기를 위한 API를 제공합니다.
예를 들어, `ByteWriteChannel.writeStringUtf8`을 사용하여 UTF-8 문자열 한 줄을 쓸 수 있습니다.

```kotlin
val myMessage = readln()
sendChannel.writeStringUtf8("$myMessage
")
```

### 연결 닫기 {id="client_close"}

[연결된 소켓](#client_create_socket)과 관련된 리소스를 해제하려면 `Socket.close` 및 `SelectorManager.close`를 호출합니다.

```kotlin
socket.close()
selectorManager.close()
```

### 예제 {id="client-example"}

아래 코드 샘플은 클라이언트 측에서 소켓을 사용하는 방법을 보여줍니다.

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

전체 예제는 다음에서 찾을 수 있습니다: [sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client).