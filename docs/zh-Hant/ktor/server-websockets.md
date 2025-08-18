[//]: # (title: Ktor 伺服器中的 WebSocket)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="WebSockets"/>
<var name="package_name" value="io.ktor.server.websocket"/>
<var name="artifact_name" value="ktor-server-websockets"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="server-websockets"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

<link-summary>
WebSocket 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。
</link-summary>

<snippet id="websockets-description">

WebSocket 是一種協定，透過單一 TCP 連線在用戶的瀏覽器和伺服器之間提供全雙工通訊會話。它對於建立需要從伺服器即時傳輸資料到伺服器以及從伺服器接收即時資料的應用程式特別有用。

Ktor 同時支援伺服器端和用戶端的 WebSocket 協定。

</snippet>

Ktor 允許您：

* 配置基本的 WebSocket 設定，例如訊框大小、ping 週期等。
* 處理 WebSocket 會話，用於伺服器和用戶端之間交換訊息。
* 新增 WebSocket 擴充功能。例如，您可以使用 [Deflate](server-websocket-deflate.md) 擴充功能或實作 [自訂擴充功能](server-websocket-extensions.md)。

> 若要了解用戶端 WebSocket 支援，請參閱 [WebSocket 用戶端外掛程式](client-websockets.topic)。

> 對於單向通訊會話，請考慮使用 [Server-Sent Events (SSE)](server-server-sent-events.topic)。SSE 在伺服器需要向用戶端傳送基於事件的更新時特別有用。
>
{style="note"}

## 新增相依性 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> artifact 加入到建置腳本中：
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

## 安裝 WebSockets {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，請在指定的<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函式。以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函式呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函式。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置 WebSockets {id="configure"}

您可以選擇在 <code>install</code> 區塊內部配置此外掛程式，透過傳遞 [WebSocketOptions](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-web-sockets/-web-socket-options/index.html)：

* 使用 <code>pingPeriod</code> 屬性來指定 ping 之間的持續時間。
* 使用 <code>timeout</code> 屬性來設定逾時時間，達到該時間後連線將被關閉。
* 使用 <code>maxFrameSize</code> 屬性來設定可接收或傳送的最大訊框大小。
* 使用 <code>masking</code> 屬性來指定是否啟用遮罩。
* 使用 <code>contentConverter</code> 屬性來設定用於序列化/反序列化的轉換器。

```kotlin
install(WebSockets) {
    pingPeriod = 15.seconds
    timeout = 15.seconds
    maxFrameSize = Long.MAX_VALUE
    masking = false
}
```

## 處理 WebSocket 會話 {id="handle-sessions"}

### API 概述 {id="api-overview"}

一旦您安裝並配置了 <code>WebSockets</code> 外掛程式，您就可以定義一個端點來處理 WebSocket 會話。若要在伺服器上定義 WebSocket 端點，請在 [路由](server-routing.md#define_route) 區塊內部呼叫 <code>webSocket</code> 函式：

```kotlin
routing { 
    webSocket("/echo") {
       // Handle a WebSocket session
    }
}
```

在此範例中，當使用 [預設配置](server-configuration-file.topic) 時，伺服器接受 <code>ws://localhost:8080/echo</code> 的 WebSocket 請求。

在 <code>webSocket</code> 區塊內部，您定義 WebSocket 會話的處理常式，該處理常式由 [DefaultWebSocketServerSession](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/-default-web-socket-server-session/index.html) 類別表示。
以下函式和屬性在此區塊內可用：

* 使用 <code>send</code> 函式將文字內容傳送給用戶端。
* 使用 <code>incoming</code> 和 <code>outgoing</code> 屬性來存取用於接收和傳送 WebSocket 訊框的頻道。訊框由 <code>Frame</code> 類別表示。
* 使用 <code>close</code> 函式傳送帶有指定原因的關閉訊框。

處理會話時，您可以檢查訊框類型，例如：

* <code>Frame.Text</code> 是一個文字訊框。對於此訊框類型，您可以使用 <code>Frame.Text.readText()</code> 讀取其內容。
* <code>Frame.Binary</code> 是一個二進位訊框。對於此類型，您可以使用 <code>Frame.Binary.readBytes()</code> 讀取其內容。

> 請注意，<code>incoming</code> 頻道不包含控制訊框，例如 ping/pong 或關閉訊框。
> 若要處理控制訊框並重新組合分段訊框，請使用 [webSocketRaw](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-websockets/io.ktor.server.websocket/web-socket-raw.html) 函式來處理 WebSocket 會話。
>
{style="note"}

> 若要取得用戶端資訊（例如用戶端的 IP 位址），請使用 <code>call</code> 屬性。了解 [一般請求資訊](server-requests.md#request_information)。

下面，我們將看看使用此 API 的範例。

### 範例：處理單一會話 {id="handle-single-session"}

下面的範例展示如何建立 <code>echo</code> WebSocket 端點以處理與一個用戶端的會話：

```kotlin
routing {
    webSocket("/echo") {
        send("Please enter your name")
        for (frame in incoming) {
            frame as? Frame.Text ?: continue
            val receivedText = frame.readText()
            if (receivedText.equals("bye", ignoreCase = true)) {
                close(CloseReason(CloseReason.Codes.NORMAL, "Client said BYE"))
            } else {
                send(Frame.Text("Hi, $receivedText!"))
            }
        }
    }
}
```

如需完整範例，請參閱 [server-websockets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets)。

### 範例：處理多個會話 {id="handle-multiple-session"}

為了有效管理多個 WebSocket 會話並處理廣播，您可以利用 Kotlin 的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)。
這種方法提供了一種可擴展且併發友好的方法，用於管理 WebSocket 通訊。以下是實作此模式的方法：

1. 定義一個用於廣播訊息的 <code>SharedFlow</code>：

```kotlin
val messageResponseFlow = MutableSharedFlow<MessageResponse>()
val sharedFlow = messageResponseFlow.asSharedFlow()
```

2. 在您的 WebSocket 路由中，實作廣播和訊息處理邏輯：

```kotlin

        webSocket("/ws") {
            send("You are connected to WebSocket!")

            val job = launch {
                sharedFlow.collect { message ->
                    send(message.message)
                }
            }

            runCatching {
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        val receivedText = frame.readText()
                        val messageResponse = MessageResponse(receivedText)
                        messageResponseFlow.emit(messageResponse)
                    }
                }
            }.onFailure { exception ->
                println("WebSocket exception: ${exception.localizedMessage}")
            }.also {
                job.cancel()
            }
        }
```

<code>runCatching</code> 區塊處理傳入訊息並將它們發射到 <code>SharedFlow</code>，然後廣播給所有收集器。

透過使用此模式，您可以有效地管理多個 WebSocket 會話，而無需手動追蹤個別連線。這種方法對於具有許多併發 WebSocket 連線的應用程式具有良好的擴展性，並提供一種簡潔、響應式的方式來處理訊息廣播。

如需完整範例，請參閱 [server-websockets-sharedflow](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-sharedflow)。

## WebSocket API 與 Ktor {id="websocket-api"}

[WebSocket API 中的標準事件](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 以以下方式對應到 Ktor：

* <code>onConnect</code> 發生在區塊的開頭。
* <code>onMessage</code> 發生在成功讀取訊息（例如，使用 <code>incoming.receive()</code>）或使用 <code>for(frame in incoming)</code> 進行掛起迭代之後。
* <code>onClose</code> 發生在 <code>incoming</code> 頻道關閉時。這將完成掛起迭代，或在嘗試接收訊息時拋出 <code>ClosedReceiveChannelException</code>。
* <code>onError</code> 等同於其他例外。

在 <code>onClose</code> 和 <code>onError</code> 中，<code>closeReason</code> 屬性會被設定。

在以下範例中，無限迴圈只會在發生例外（無論是 <code>ClosedReceiveChannelException</code> 還是其他例外）時才會退出：

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