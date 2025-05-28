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
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

Ktor は、サーバーとクライアントの両方で HTTP/WebSocket の処理に加えて、TCP および UDP の生ソケットをサポートしています。
内部では [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html) を使用するサスペンディング API を公開しています。

> ソケットは実験的なAPIを使用しており、今後のアップデートで破壊的変更を伴って進化する可能性があります。
>
{type="note"}

## 依存関係を追加する {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

クライアントで[セキュアソケット](#secure)を使用するには、`io.ktor:ktor-network-tls` も追加する必要があります。

## サーバー {id="server"}

### サーバーソケットを作成する {id="server_create_socket"}

サーバーソケットを構築するには、`SelectorManager` インスタンスを作成し、そのインスタンスで `SocketBuilder.tcp()` 関数を呼び出し、
次に `bind` を使用してサーバーソケットを特定のポートにバインドします。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

上記のコードスニペットは、[ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) インスタンスである TCP ソケットを作成します。
UDP ソケットを作成するには、`SocketBuilder.udp()` を使用します。

### 受信接続をacceptする {id="accepts_connection"}

サーバーソケットを作成したら、ソケット接続をacceptし、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) インスタンス）を返す `ServerSocket.accept` 関数を呼び出す必要があります。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="14"}

接続されたソケットを取得したら、ソケットから読み書きすることでデータの受信/送信が可能です。

### データを受信する {id="server_receive"}

クライアントからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) を返す `Socket.openReadChannel` 関数を呼び出す必要があります。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="17"}

`ByteReadChannel` は、データの非同期読み取りのための API を提供します。
たとえば、`ByteReadChannel.readUTF8Line` を使用して、UTF-8 文字の行を読み取ることができます。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22"}

### データを送信する {id="server_send"}

クライアントにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html) を返す `Socket.openWriteChannel` 関数を呼び出します。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="18"}

`ByteWriteChannel` は、バイトシーケンスの非同期書き込みのための API を提供します。
たとえば、`ByteWriteChannel.writeStringUtf8` を使用して、UTF-8 文字の行を書き込むことができます。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22-23"}

### ソケットを閉じる {id="server_close"}

[接続されたソケット](#accepts_connection)に関連付けられたリソースを解放するには、`Socket.close` を呼び出します。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="26"}

### 例 {id="server-example"}

以下のコードサンプルは、サーバー側でソケットを使用する方法を示しています。

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt"}

完全な例はこちらにあります: [sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## クライアント {id="client"}

### ソケットを作成する {id="client_create_socket"}

クライアントソケットを構築するには、`SelectorManager` インスタンスを作成し、そのインスタンスで `SocketBuilder.tcp()` 関数を呼び出し、
次に `connect` を使用して接続を確立し、接続されたソケット（[Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) インスタンス）を取得します。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="11-12"}

接続されたソケットを取得したら、ソケットから読み書きすることでデータの受信/送信が可能です。

### セキュアソケットを作成する (SSL/TLS) {id="secure"}

セキュアソケットを使用すると、TLS 接続を確立できます。
セキュアソケットを使用するには、[ktor-network-tls](#add_dependencies) の依存関係を追加する必要があります。
その後、接続されたソケットで `Socket.tls` 関数を呼び出します。

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 関数を使用すると、[TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) によって提供される TLS パラメーターを調整できます。

```kotlin
```
{src="snippets/sockets-client-tls/src/main/kotlin/com/example/Application.kt" include-lines="14-21"}

完全な例はこちらにあります: [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### データを受信する {id="client_receive"}

サーバーからデータを受信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) を返す `Socket.openReadChannel` 関数を呼び出す必要があります。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="14"}

`ByteReadChannel` は、データの非同期読み取りのための API を提供します。
たとえば、`ByteReadChannel.readUTF8Line` を使用して、UTF-8 文字の行を読み取ることができます。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="19"}

### データを送信する {id="client_send"}

サーバーにデータを送信するには、[ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html) を返す `Socket.openWriteChannel` 関数を呼び出します。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="15"}

`ByteWriteChannel` は、バイトシーケンスの非同期書き込みのための API を提供します。
たとえば、`ByteWriteChannel.writeStringUtf8` を使用して、UTF-8 文字の行を書き込むことができます。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="32-33"}

### 接続を閉じる {id="client_close"}

[接続されたソケット](#client_create_socket)に関連付けられたリソースを解放するには、`Socket.close` と `SelectorManager.close` を呼び出します。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="24-25"}

### 例 {id="client-example"}

以下のコードサンプルは、クライアント側でソケットを使用する方法を示しています。

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt"}

完全な例はこちらにあります: [sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。