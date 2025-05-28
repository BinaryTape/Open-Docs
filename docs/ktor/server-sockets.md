[//]: # (title: 套接字)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

除了服务器和客户端的 HTTP/WebSocket 处理外，Ktor 还支持 TCP 和 UDP 原始套接字。它提供了一个挂起 API，该 API 在底层使用 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)。

> 套接字使用了一个实验性 API，预计在未来的更新中会演进，并可能伴随破坏性变更。
>
{type="note"}

## 添加依赖项 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

要在客户端中使用[安全套接字](#secure)，你还需要添加 `io.ktor:ktor-network-tls`。

## 服务器 {id="server"}

### 创建服务器套接字 {id="server_create_socket"}

要构建服务器套接字，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，然后使用 `bind` 将服务器套接字绑定到特定端口：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

上述代码片段创建了一个 TCP 套接字，即 `ServerSocket` 实例。要创建 UDP 套接字，请使用 `SocketBuilder.udp()`。

### 接受传入连接 {id="accepts_connection"}

创建服务器套接字后，你需要调用 `ServerSocket.accept` 函数，该函数接受一个套接字连接并返回一个已连接套接字（一个 `Socket` 实例）：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="14"}

一旦你有了已连接套接字，你就可以通过从套接字读取或向套接字写入来收发数据。

### 接收数据 {id="server_receive"}

要从客户端接收数据，你需要调用 `Socket.openReadChannel` 函数，该函数返回 `ByteReadChannel`：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="17"}

`ByteReadChannel` 提供了用于异步读取数据的 API。例如，你可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22"}

### 发送数据 {id="server_send"}

要向客户端发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 `ByteWriteChannel`：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="18"}

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。例如，你可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22-23"}

### 关闭套接字 {id="server_close"}

要释放与[已连接套接字](#accepts_connection)相关的资源，请调用 `Socket.close`：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="26"}

### 示例 {id="server-example"}

下面的代码示例演示了如何在服务器端使用套接字：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt"}

你可以在这里找到完整示例：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 客户端 {id="client"}

### 创建套接字 {id="client_create_socket"}

要构建客户端套接字，请创建 `SelectorManager` 实例，在其上调用 `SocketBuilder.tcp()` 函数，然后使用 `connect` 建立连接并获取已连接套接字（一个 `Socket` 实例）：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="11-12"}

一旦你有了已连接套接字，你就可以通过从套接字读取或向套接字写入来收发数据。

### 创建安全套接字 (SSL/TLS) {id="secure"}

安全套接字允许你建立 TLS 连接。要使用安全套接字，你需要添加 [ktor-network-tls](#add_dependencies) 依赖项。然后，在已连接套接字上调用 `Socket.tls` 函数：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函数允许你调整由 `TLSConfigBuilder` 提供的 TLS 参数：

```kotlin
```
{src="snippets/sockets-client-tls/src/main/kotlin/com/example/Application.kt" include-lines="14-21"}

你可以在这里找到完整示例：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收数据 {id="client_receive"}

要从服务器接收数据，你需要调用 `Socket.openReadChannel` 函数，该函数返回 `ByteReadChannel`：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="14"}

`ByteReadChannel` 提供了用于异步读取数据的 API。例如，你可以使用 `ByteReadChannel.readUTF8Line` 读取一行 UTF-8 字符：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="19"}

### 发送数据 {id="client_send"}

要向服务器发送数据，请调用 `Socket.openWriteChannel` 函数，该函数返回 `ByteWriteChannel`：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="15"}

`ByteWriteChannel` 提供了用于异步写入字节序列的 API。例如，你可以使用 `ByteWriteChannel.writeStringUtf8` 写入一行 UTF-8 字符：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="32-33"}

### 关闭连接 {id="client_close"}

要释放与[已连接套接字](#client_create_socket)相关的资源，请调用 `Socket.close` 和 `SelectorManager.close`：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="24-25"}

### 示例 {id="client-example"}

下面的代码示例演示了如何在客户端使用套接字：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt"}

你可以在这里找到完整示例：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。