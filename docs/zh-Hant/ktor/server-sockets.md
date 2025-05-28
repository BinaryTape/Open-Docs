[//]: # (title: 通訊端)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>必要依賴 (套件)</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

除了伺服器與用戶端的 HTTP/WebSocket 處理之外，Ktor 還支援 TCP 和 UDP 原始通訊端 (raw sockets)。它公開了一個暫停式 (suspending) API，底層使用了 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)。

> 通訊端 (Sockets) 使用了一個實驗性 API，預計將會在未來的更新中演進，並可能帶來破壞性變更。
>
{type="note"}

## 新增依賴 (套件) {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>
<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

若要在用戶端使用 [安全通訊端](#secure)，您還需要新增 `io.ktor:ktor-network-tls` 依賴 (套件)。

## 伺服器 {id="server"}

### 建立伺服器通訊端 {id="server_create_socket"}

要建立伺服器通訊端，請建立 `SelectorManager` 實例，對其呼叫 `SocketBuilder.tcp()` 函數，然後使用 `bind` 將伺服器通訊端繫結到特定埠：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

以上程式碼片段建立了一個 TCP 通訊端，這是 `ServerSocket` 實例。要建立 UDP 通訊端，請使用 `SocketBuilder.udp()`。

### 接受傳入連線 {id="accepts_connection"}

建立伺服器通訊端後，您需要呼叫 `ServerSocket.accept` 函數，該函數會接受通訊端連線並返回一個已連線的通訊端 (一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例)：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="14"}

一旦您有了已連線的通訊端，就可以透過從通訊端讀取或寫入來接收/傳送資料。

### 接收資料 {id="server_receive"}

要從用戶端接收資料，您需要呼叫 `Socket.openReadChannel` 函數，該函數會返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="17"}

`ByteReadChannel` 提供了非同步讀取資料的 API。例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22"}

### 傳送資料 {id="server_send"}

要向用戶端傳送資料，請呼叫 `Socket.openWriteChannel` 函數，該函數會返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="18"}

`ByteWriteChannel` 提供了非同步寫入位元組序列的 API。例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="22-23"}

### 關閉通訊端 {id="server_close"}

要釋放與 [已連線通訊端](#accepts_connection) 相關的資源，請呼叫 `Socket.close`：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt" include-lines="26"}

### 範例 {id="server-example"}

以下程式碼範例展示了如何在伺服器端使用通訊端：

```kotlin
```
{src="snippets/sockets-server/src/main/kotlin/com/example/Application.kt"}

完整範例請見此處：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 用戶端 {id="client"}

### 建立通訊端 {id="client_create_socket"}

要建立用戶端通訊端，請建立 `SelectorManager` 實例，對其呼叫 `SocketBuilder.tcp()` 函數，然後使用 `connect` 建立連線並取得一個已連線的通訊端 (一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例)：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="11-12"}

一旦您有了已連線的通訊端，就可以透過從通訊端讀取或寫入來接收/傳送資料。

### 建立安全通訊端 (SSL/TLS) {id="secure"}

安全通訊端允許您建立 TLS 連線。要使用安全通訊端，您需要新增 [ktor-network-tls](#add_dependencies) 依賴 (套件)。然後，在已連線的通訊端上呼叫 `Socket.tls` 函數：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函數允許您調整由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 參數：

```kotlin
```
{src="snippets/sockets-client-tls/src/main/kotlin/com/example/Application.kt" include-lines="14-21"}

完整範例請見此處：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收資料 {id="client_receive"}

要從伺服器接收資料，您需要呼叫 `Socket.openReadChannel` 函數，該函數會返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="14"}

`ByteReadChannel` 提供了非同步讀取資料的 API。例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="19"}

### 傳送資料 {id="client_send"}

要向伺服器傳送資料，請呼叫 `Socket.openWriteChannel` 函數，該函數會返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="15"}

`ByteWriteChannel` 提供了非同步寫入位元組序列的 API。例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="32-33"}

### 關閉連線 {id="client_close"}

要釋放與 [已連線通訊端](#client_create_socket) 相關的資源，請呼叫 `Socket.close` 和 `SelectorManager.close`：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt" include-lines="24-25"}

### 範例 {id="client-example"}

以下程式碼範例展示了如何在用戶端使用通訊端：

```kotlin
```
{src="snippets/sockets-client/src/main/kotlin/com/example/Application.kt"}

完整範例請見此處：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。