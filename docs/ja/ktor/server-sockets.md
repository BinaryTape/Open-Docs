[//]: # (title: ソケット)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

サーバーおよびクライアントのHTTP/WebSocket処理に加えて、KtorはTCPおよびUDPの生ソケットをサポートしています。
これは、内部で[java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)を使用するコルーチン対応APIを公開しています。

> ソケットは実験的なAPIを使用しており、今後のアップデートで破壊的変更を伴う進化が予想されます。
>
{type="note"}

## 依存関係を追加する {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
    

クライアントで[セキュアソケット](#secure)を使用するには、`io.ktor:ktor-network-tls`も追加する必要があります。

## サーバー {id="server"}

### サーバーソケットを作成する {id="server_create_socket"}

サーバーソケットを構築するには、`SelectorManager`インスタンスを作成し、その上で`SocketBuilder.tcp()`関数を呼び出し、次に`bind`を使用して特定のポートにサーバーソケットをバインドします。

[object Promise]

上記のコードスニペットはTCPソケット、すなわち[ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html)インスタンスを作成します。UDPソケットを作成するには、`SocketBuilder.udp()`を使用します。

### 着信接続を受け入れる {id="accepts_connection"}

サーバーソケットを作成した後、ソケット接続を受け入れ、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html)インスタンス）を返す`ServerSocket.accept`関数を呼び出す必要があります。

[object Promise]

接続されたソケットを取得したら、ソケットからの読み取りまたはソケットへの書き込みによってデータを送受信できます。

### データを受信する {id="server_receive"}

クライアントからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を返す`Socket.openReadChannel`関数を呼び出す必要があります。

[object Promise]

`ByteReadChannel`はデータの非同期読み取りのためのAPIを提供します。
たとえば、`ByteReadChannel.readUTF8Line`を使用してUTF-8文字の行を読み取ることができます。

[object Promise]

### データを送信する {id="server_send"}

クライアントにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)を返す`Socket.openWriteChannel`関数を呼び出します。

[object Promise]

`ByteWriteChannel`はバイトシーケンスの非同期書き込みのためのAPIを提供します。
たとえば、`ByteWriteChannel.writeStringUtf8`を使用してUTF-8文字の行を書き込むことができます。

[object Promise]

### ソケットを閉じる {id="server_close"}

[接続されたソケット](#accepts_connection)に関連付けられたリソースを解放するには、`Socket.close`を呼び出します。

[object Promise]

### 例 {id="server-example"}

以下のコードサンプルは、サーバー側でソケットを使用する方法を示しています。

[object Promise]

完全な例はこちらで確認できます: [sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## クライアント {id="client"}

### ソケットを作成する {id="client_create_socket"}

クライアントソケットを構築するには、`SelectorManager`インスタンスを作成し、その上で`SocketBuilder.tcp()`関数を呼び出し、次に`connect`を使用して接続を確立し、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html)インスタンス）を取得します。

[object Promise]

接続されたソケットを取得したら、ソケットからの読み取りまたはソケットへの書き込みによってデータを送受信できます。

### セキュアソケット (SSL/TLS) を作成する {id="secure"}

セキュアソケットによりTLS接続を確立できます。
セキュアソケットを使用するには、[ktor-network-tls](#add_dependencies)の依存関係を追加する必要があります。
次に、接続されたソケットで`Socket.tls`関数を呼び出します。

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls`関数を使用すると、[TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)によって提供されるTLSパラメータを調整できます。

[object Promise]

完全な例はこちらで確認できます: [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### データを受信する {id="client_receive"}

サーバーからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を返す`Socket.openReadChannel`関数を呼び出す必要があります。

[object Promise]

`ByteReadChannel`はデータの非同期読み取りのためのAPIを提供します。
たとえば、`ByteReadChannel.readUTF8Line`を使用してUTF-8文字の行を読み取ることができます。

[object Promise]

### データを送信する {id="client_send"}

サーバーにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)を返す`Socket.openWriteChannel`関数を呼び出します。

[object Promise]

`ByteWriteChannel`はバイトシーケンスの非同期書き込みのためのAPIを提供します。
たとえば、`ByteWriteChannel.writeStringUtf8`を使用してUTF-8文字の行を書き込むことができます。

[object Promise]

### 接続を閉じる {id="client_close"}

[接続されたソケット](#client_create_socket)に関連付けられたリソースを解放するには、`Socket.close`と`SelectorManager.close`を呼び出します。

[object Promise]

### 例 {id="client-example"}

以下のコードサンプルは、クライアント側でソケットを使用する方法を示しています。

[object Promise]

完全な例はこちらで確認できます: [sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。