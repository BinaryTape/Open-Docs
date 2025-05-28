[//]: # (title: Ktor 伺服器中的 WebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>必需的依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
WebSockets 外掛程式允許您在伺服器和客戶端之間建立多向通訊會話。
</link-summary>

<snippet id="websockets-description">

WebSocket 是一種協定，透過單一 TCP 連線在使用者瀏覽器和伺服器之間提供全雙工通訊會話。
它對於建立需要從伺服器即時傳輸資料的應用程式特別有用。

Ktor 在伺服器端和客戶端都支援 WebSocket 協定。

</snippet>

Ktor 允許您：

*   設定基本的 WebSocket 設定，例如幀大小、ping 週期等。
*   處理 WebSocket 會話以在伺服器和客戶端之間交換訊息。
*   新增 WebSocket 擴充功能。例如，您可以使用 [Deflate](server-websocket-deflate.md) 擴充功能或實作 [自訂擴充功能](server-websocket-extensions.md)。

> 若要了解客戶端的 WebSocket 支援，請參閱 [WebSockets 客戶端外掛程式](client-websockets.topic)。

> 對於單向通訊會話，請考慮使用 [伺服器傳送事件 (SSE)](server-server-sent-events.topic)。SSE 在伺服器需要向客戶端傳送基於事件的更新時特別有用。
>
{style="note"}

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 WebSockets {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 WebSockets {id="configure"}

您可以選擇在 `install` 區塊內，透過傳遞 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html) 來配置外掛程式：

*   使用 `pingPeriod` 屬性來指定 ping 之間的持續時間。
*   使用 `timeout` 屬性來設定逾時時間，超過此時間後連線將被關閉。
*   使用 `maxFrameSize` 屬性來設定可接收或傳送的最大幀。
*   使用 `masking` 屬性來指定是否啟用遮罩 (masking)。
*   使用 `contentConverter` 屬性來設定用於序列化/反序列化的轉換器。

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="13-18"}

## 處理 WebSockets 會話 {id="handle-sessions"}

### API 概覽 {id="api-overview"}

安裝並配置 `WebSockets` 外掛程式後，您可以定義一個端點來處理 WebSocket 會話。若要在伺服器上定義 WebSocket 端點，請在 [routing](server-routing.md#define_route) 區塊內呼叫 `webSocket` 函數：

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

在此範例中，當使用 [預設配置](server-configuration-file.topic) 時，伺服器接受發往 `ws://localhost:8080/echo` 的 WebSocket 請求。

在 `webSocket` 區塊內，您定義 WebSocket 會話的處理器，該處理器由 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 類別表示。
區塊內可用的函數和屬性如下：

*   使用 `send` 函數向客戶端傳送文字內容。
*   使用 `incoming` 和 `outgoing` 屬性來存取接收和傳送 WebSocket 幀 (frame) 的通道。幀由 `Frame` 類別表示。
*   使用 `close` 函數傳送帶有指定原因的關閉幀。

處理會話時，您可以檢查幀類型，例如：

*   `Frame.Text` 是一個文字幀。對於此幀類型，您可以使用 `Frame.Text.readText()` 讀取其內容。
*   `Frame.Binary` 是一個二進位幀。對於此類型，您可以使用 `Frame.Binary.readBytes()` 讀取其內容。

> 請注意，`incoming` 通道不包含控制幀，例如 ping/pong 或關閉幀。若要處理控制幀並重新組裝分段幀，請使用 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 函數來處理 WebSocket 會話。
>
{style="note"}

> 若要取得有關客戶端的資訊（例如客戶端的 IP 位址），請使用 `call` 屬性。了解 [](server-requests.md#request_information)。

下面，我們將看看使用此 API 的範例。

### 範例：處理單一會話 {id="handle-single-session"}

下面的範例展示了如何建立 `echo` WebSocket 端點來處理與一個客戶端的會話：

```kotlin
```

{src="snippets/server-websockets/src/main/kotlin/com/example/Application.kt" include-lines="19,24-36"}

如需完整範例，請參閱 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)。

### 範例：處理多個會話 {id="handle-multiple-session"}

為了有效地管理多個 WebSocket 會話並處理廣播，您可以利用 Kotlin 的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)。
這種方法提供了一種可擴展且有利於並發的 WebSocket 通訊管理方式。以下是實作此模式的方法：

1.  定義一個用於廣播訊息的 `SharedFlow`：

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="23-24"}

2.  在您的 WebSocket 路由中，實作廣播和訊息處理邏輯：

```kotlin
```

{src="snippets/server-websockets-sharedflow/src/main/kotlin/com/example/plugins/Sockets.kt" include-lines="25-48"}

`runCatching` 區塊處理傳入的訊息並將其發送到 `SharedFlow`，然後 `SharedFlow` 會廣播給所有收集器 (collector)。

透過使用此模式，您可以有效地管理多個 WebSocket 會話，而無需手動追蹤個別連線。這種方法非常適合處理大量併發 WebSocket 連線的應用程式，並提供了一種簡潔、響應式的方式來處理訊息廣播。

如需完整範例，請參閱 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)。

## WebSocket API 與 Ktor {id="websocket-api"}

[WebSocket API 的標準事件](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 在 Ktor 中以以下方式對應：

*   `onConnect` 發生在區塊的開頭。
*   `onMessage` 發生在成功讀取訊息（例如，使用 `incoming.receive()`）或使用 `for(frame in incoming)` 進行暫停迭代之後。
*   `onClose` 發生在 `incoming` 通道關閉時。這將完成暫停迭代，或在嘗試接收訊息時拋出 `ClosedReceiveChannelException`。
*   `onError` 等同於其他異常。

在 `onClose` 和 `onError` 中，都會設定 `closeReason` 屬性。

在以下範例中，只有當異常發生時（無論是 `ClosedReceiveChannelException` 還是其他異常），無限循環才會退出：

```kotlin
webSocket("/echo") {
    println("onConnect")
    try {
        for (frame in incoming){
            val text = (frame as Frame.Text).readText()
            println("onMessage")
            received += text
            outgoing.send(Frame.Text(text))
        }
    } catch (e: ClosedReceiveChannelException) {
        println("onClose ${closeReason.await()}")
    } catch (e: Throwable) {
        println("onError ${closeReason.await()}")
        e.printStackTrace()
    }
}
```