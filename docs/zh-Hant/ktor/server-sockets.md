[//]: # (title: 通訊端)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sockets"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-network</code>, <code>io.ktor:ktor-network-tls</code>
</p>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server">sockets-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client">sockets-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls">sockets-client-tls</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行時或虛擬機器即可執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

除了 HTTP/WebSocket 對伺服器和用戶端的處理之外，Ktor 也支援 TCP 和 UDP 原始通訊端。
它公開了一個使用底層 [java.nio](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html) 的掛起 API。

> 通訊端使用一個實驗性 API，預計在即將到來的更新中會有所演進，並可能包含破壞性變更。
>
{type="note"}

## 新增依賴項 {id="add_dependencies"}

<var name="artifact_name" value="ktor-network"/>

    <p>
        若要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> 成品包含在建置腳本中：
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
    

若要在用戶端使用 [安全通訊端](#secure)，您還需要新增 `io.ktor:ktor-network-tls`。

## 伺服器 {id="server"}

### 建立伺服器通訊端 {id="server_create_socket"}

若要建立伺服器通訊端，請建立 `SelectorManager` 實例，在其上呼叫 `SocketBuilder.tcp()` 函數，然後使用 `bind` 將伺服器通訊端繫結到特定埠：

[object Promise]

上述程式碼片段建立了一個 TCP 通訊端，即 [ServerSocket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-server-socket/index.html) 實例。
若要建立 UDP 通訊端，請使用 `SocketBuilder.udp()`。

### 接受傳入連線 {id="accepts_connection"}

建立伺服器通訊端後，您需要呼叫 `ServerSocket.accept` 函數，該函數會接受一個通訊端連線並返回一個已連線的通訊端（一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例）：

[object Promise]

一旦您擁有一個已連線的通訊端，您可以透過從通訊端讀取或寫入來接收/傳送資料。

### 接收資料 {id="server_receive"}

若要從用戶端接收資料，您需要呼叫 `Socket.openReadChannel` 函數，該函數會返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

[object Promise]

`ByteReadChannel` 提供了用於非同步讀取資料的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

[object Promise]

### 傳送資料 {id="server_send"}

若要向用戶端傳送資料，請呼叫 `Socket.openWriteChannel` 函數，該函數會返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

[object Promise]

`ByteWriteChannel` 提供了用於非同步寫入位元組序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

[object Promise]

### 關閉通訊端 {id="server_close"}

若要釋放與 [已連線通訊端](#accepts_connection) 相關的資源，請呼叫 `Socket.close`：

[object Promise]

### 範例 {id="server-example"}

以下程式碼範例展示了如何在伺服器端使用通訊端：

[object Promise]

您可以在此處找到完整範例：[sockets-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-server)。

## 用戶端 {id="client"}

### 建立通訊端 {id="client_create_socket"}

若要建立用戶端通訊端，請建立 `SelectorManager` 實例，在其上呼叫 `SocketBuilder.tcp()` 函數，然後使用 `connect` 建立連線並取得一個已連線的通訊端（一個 [Socket](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-socket/index.html) 實例）：

[object Promise]

一旦您擁有一個已連線的通訊端，您可以透過從通訊端讀取或寫入來接收/傳送資料。

### 建立安全通訊端 (SSL/TLS) {id="secure"}

安全通訊端允許您建立 TLS 連線。
若要使用安全通訊端，您需要新增 [ktor-network-tls](#add_dependencies) 依賴項。
然後，在已連線的通訊端上呼叫 `Socket.tls` 函數：

```kotlin
val selectorManager = SelectorManager(Dispatchers.IO)
val socket = aSocket(selectorManager).tcp().connect("127.0.0.1", 8443).tls()
```

`tls` 函數允許您調整由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 參數：

[object Promise]

您可以在此處找到完整範例：[sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)。

### 接收資料 {id="client_receive"}

若要從伺服器接收資料，您需要呼叫 `Socket.openReadChannel` 函數，該函數會返回 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)：

[object Promise]

`ByteReadChannel` 提供了用於非同步讀取資料的 API。
例如，您可以使用 `ByteReadChannel.readUTF8Line` 讀取一行 UTF-8 字元：

[object Promise]

### 傳送資料 {id="client_send"}

若要向伺服器傳送資料，請呼叫 `Socket.openWriteChannel` 函數，該函數會返回 [ByteWriteChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)：

[object Promise]

`ByteWriteChannel` 提供了用於非同步寫入位元組序列的 API。
例如，您可以使用 `ByteWriteChannel.writeStringUtf8` 寫入一行 UTF-8 字元：

[object Promise]

### 關閉連線 {id="client_close"}

若要釋放與 [已連線通訊端](#client_create_socket) 相關的資源，請呼叫 `Socket.close` 和 `SelectorManager.close`：

[object Promise]

### 範例 {id="client-example"}

以下程式碼範例展示了如何在用戶端使用通訊端：

[object Promise]

您可以在此處找到完整範例：[sockets-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client)。