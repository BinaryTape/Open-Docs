[//]: # (title: ソケット)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

Ktorは、サーバーとクライアントにおけるHTTP/WebSocket処理に加えて、TCPおよびUDPのrawソケットをサポートしています。
内部で[java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)を使用するサスペンドAPIを公開しています。

> ソケットは実験的なAPIを使用しており、今後のアップデートで破壊的変更が行われる可能性があります。
>
{type="note"}

## 依存関係を追加する {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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

クライアントで[セキュアソケット](#secure)を使用するには、`io.ktor:ktor-network-tls`も追加する必要があります。

## サーバー {id="server"}

### サーバーソケットを作成する {id="server_create_socket"}

サーバーソケットを構築するには、`SelectorManager`インスタンスを作成し、その上で`SocketBuilder.tcp()`関数を呼び出し、`bind`を使用してサーバーソケットを特定のポートにバインドします。

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
```

上記のスニペットは、[ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html)インスタンスであるTCPソケットを作成します。
UDPソケットを作成するには、`SocketBuilder.udp()`を使用します。

### 着信接続を受け入れる {id="accepts_connection"}

サーバーソケットを作成した後、ソケット接続を受け入れ、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html)インスタンス）を返す`ServerSocket.accept`関数を呼び出す必要があります。

```kotlin
val socket = serverSocket.accept()
```

接続されたソケットを取得したら、ソケットから読み書きすることでデータを受送信できます。

### データを受信する {id="server_receive"}

クライアントからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を返す`Socket.openReadChannel`関数を呼び出す必要があります。

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel`はデータの非同期読み取りのためのAPIを提供します。
例えば、`ByteReadChannel.readUTF8Line`を使用してUTF-8文字の行を読み取ることができます。

```kotlin
val name = receiveChannel.readUTF8Line()
```

### データを送信する {id="server_send"}

クライアントにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)を返す`Socket.openWriteChannel`関数を呼び出します。

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel`はバイトシーケンスの非同期書き込みのためのAPIを提供します。
例えば、`ByteWriteChannel.writeStringUtf8`を使用してUTF-8文字の行を書き込むことができます。

```kotlin
val name = receiveChannel.readUTF8Line()
sendChannel.writeStringUtf8("Hello, $name!
")
```

### ソケットを閉じる {id="server_close"}

[接続されたソケット](#accepts_connection)に関連付けられたリソースを解放するには、`Socket.close`を呼び出します。

```kotlin
socket.close()
```

### 例 {id="server-example"}

以下のコードサンプルは、サーバーサイドでソケットを使用する方法を示しています。

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

完全な例は[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)で確認できます。

## クライアント {id="client"}

### ソケットを作成する {id="client_create_socket"}

クライアントソケットを構築するには、`SelectorManager`インスタンスを作成し、その上で`SocketBuilder.tcp()`関数を呼び出し、`connect`を使用して接続を確立し、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html)インスタンス）を取得します。

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 9002)
```

接続されたソケットを取得したら、ソケットから読み書きすることでデータを受送信できます。

### セキュアソケットを作成する (SSL/TLS) {id="secure"}

セキュアソケットを使用すると、TLS接続を確立できます。
セキュアソケットを使用するには、[ktor-network-tls](#add_dependencies)の依存関係を追加する必要があります。
その後、接続されたソケットで`Socket.tls`関数を呼び出します。

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls`関数を使用すると、[TLSConfigBuilder](https://api.ktor.io/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)によって提供されるTLSパラメーターを調整できます。

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

完全な例は[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)で確認できます。

### データを受信する {id="client_receive"}

サーバーからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を返す`Socket.openReadChannel`関数を呼び出す必要があります。

```kotlin
val receiveChannel = socket.openReadChannel()
```

`ByteReadChannel`はデータの非同期読み取りのためのAPIを提供します。
例えば、`ByteReadChannel.readUTF8Line`を使用してUTF-8文字の行を読み取ることができます。

```kotlin
val greeting = receiveChannel.readUTF8Line()
```

### データを送信する {id="client_send"}

サーバーにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)を返す`Socket.openWriteChannel`関数を呼び出します。

```kotlin
val sendChannel = socket.openWriteChannel(autoFlush = true)
```

`ByteWriteChannel`はバイトシーケンスの非同期書き込みのためのAPIを提供します。
例えば、`ByteWriteChannel.writeStringUtf8`を使用してUTF-8文字の行を書き込むことができます。

```kotlin
val myMessage = readln()
sendChannel.writeStringUtf8("$myMessage
")
```

### 接続を閉じる {id="client_close"}

[接続されたソケット](#client_create_socket)に関連付けられたリソースを解放するには、`Socket.close`と`SelectorManager.close`を呼び出します。

```kotlin
socket.close()
selectorManager.close()
```

### 例 {id="client-example"}

以下のコードサンプルは、クライアントサイドでソケットを使用する方法を示しています。

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

完全な例は[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)で確認できます。