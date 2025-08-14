[//]: # (title: Ktor 伺服器中的 WebSockets)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行環境或虛擬機器的情況下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
Websockets 外掛程式可讓您在伺服器和客戶端之間建立多向通訊會話。
</link-summary>

<snippet id="websockets-description">

WebSocket 是一種協定，透過單一 TCP 連線在使用者瀏覽器和伺服器之間提供全雙工通訊會話。它對於建立需要與伺服器進行即時資料傳輸的應用程式特別有用。

Ktor 在伺服器端和客戶端都支援 WebSocket 協定。

</snippet>

Ktor 讓您可以：

* 配置基本的 WebSocket 設定，例如訊框大小、ping 週期等等。
* 處理 WebSocket 會話以在伺服器和客戶端之間交換訊息。
* 新增 WebSocket 擴充功能。例如，您可以使用 [Deflate](server-websocket-deflate.md) 擴充功能或實作 [自訂擴充功能](server-websocket-extensions.md)。

> 若要了解客戶端 WebSocket 支援，請參閱 [WebSockets 客戶端外掛程式](client-websockets.topic)。

> 對於單向通訊會話，請考慮使用 [Server-Sent Events (SSE)](server-server-sent-events.topic)。SSE 在伺服器需要向客戶端發送基於事件的更新時特別有用。
>
{style="note"}

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    

## 安裝 WebSockets {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式 <a href="#install">安裝</a> 到應用程式中，
        請將其傳遞給指定 <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links> 中的 <code>install</code> 函數。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置 WebSockets {id="configure"}

您可以選擇性地在 `install` 區塊內透過傳遞 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html) 來配置此外掛程式：

* 使用 `pingPeriod` 屬性來指定 ping 之間的持續時間。
* 使用 `timeout` 屬性來設定連線應關閉的逾時時間。
* 使用 `maxFrameSize` 屬性來設定可接收或發送的最大訊框。
* 使用 `masking` 屬性來指定是否啟用遮罩。
* 使用 `contentConverter` 屬性來設定用於序列化/反序列化的轉換器。

[object Promise]

## 處理 WebSockets 會話 {id="handle-sessions"}

### API 概述 {id="api-overview"}

一旦您安裝並配置了 `WebSockets` 外掛程式，您就可以定義一個端點來處理 WebSocket 會話。若要在伺服器上定義 WebSocket 端點，請在 [routing](server-routing.md#define_route) 區塊內呼叫 `webSocket` 函數：

```kotlin
routing { 
    webSocket("/echo") {
       // 處理 WebSocket 會話
    }
}
```

在此範例中，當使用 [預設配置](server-configuration-file.topic) 時，伺服器會接受對 `ws://localhost:8080/echo` 的 WebSocket 請求。

在 `webSocket` 區塊內部，您定義了 WebSocket 會話的處理程序，它由 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 類別表示。
以下函數和屬性在此區塊內可用：

* 使用 `send` 函數將文字內容發送到客戶端。
* 使用 `incoming` 和 `outgoing` 屬性來存取用於接收和發送 WebSocket 訊框的通道。訊框由 `Frame` 類別表示。
* 使用 `close` 函數發送一個帶有指定原因的關閉訊框。

處理會話時，您可以檢查訊框類型，例如：

* `Frame.Text` 是一個文字訊框。對於此訊框類型，您可以使用 `Frame.Text.readText()` 讀取其內容。
* `Frame.Binary` 是一個二進位訊框。對於此類型，您可以使用 `Frame.Binary.readBytes()` 讀取其內容。

> 請注意，`incoming` 通道不包含控制訊框，例如 ping/pong 或關閉訊框。
> 若要處理控制訊框並重新組裝分段訊框，請使用 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 函數來處理 WebSocket 會話。
>
{style="note"}

> 若要取得客戶端資訊（例如客戶端的 IP 位址），請使用 `call` 屬性。了解 [](server-requests.md#request_information)。

下面，我們將看看使用此 API 的範例。

### 範例：處理單一會話 {id="handle-single-session"}

以下範例展示了如何建立 `echo` WebSocket 端點來處理與單一客戶端的會話：

[object Promise]

如需完整範例，請參閱 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)。

### 範例：處理多個會話 {id="handle-multiple-session"}

為了有效地管理多個 WebSocket 會話並處理廣播，您可以使用 Kotlin 的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)。這種方法為管理 WebSocket 通訊提供了一種可擴展且支援並發的方案。以下是實作此模式的方法：

1. 定義用於廣播訊息的 `SharedFlow`：

[object Promise]

2. 在您的 WebSocket 路由中，實作廣播和訊息處理邏輯：

[object Promise]

`runCatching` 區塊處理傳入訊息並將其發射到 `SharedFlow`，然後由其廣播給所有收集器。

透過使用此模式，您可以有效地管理多個 WebSocket 會話，而無需手動追蹤個別連線。這種方法對於具有許多並發 WebSocket 連線的應用程式具有良好的擴展性，並提供了一種簡潔、反應式的方式來處理訊息廣播。

如需完整範例，請參閱 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)。

## WebSocket API 與 Ktor {id="websocket-api"}

[WebSocket API 的標準事件](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 在 Ktor 中對應如下：

* `onConnect` 在區塊開始時發生。
* `onMessage` 在成功讀取訊息（例如，使用 `incoming.receive()`）或使用 `for(frame in incoming)` 進行掛起迭代後發生。
* `onClose` 在 `incoming` 通道關閉時發生。這將完成掛起迭代，或在嘗試接收訊息時拋出 `ClosedReceiveChannelException`。
* `onError` 等同於其他例外。

在 `onClose` 和 `onError` 中，都會設定 `closeReason` 屬性。

在以下範例中，無限迴圈只會在發生例外（`ClosedReceiveChannelException` 或其他例外）時才會退出：

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