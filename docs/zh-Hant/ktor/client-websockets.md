<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-websockets" title="Ktor 用戶端的 WebSockets">
<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>
<var name="example_name" value="client-websockets"/>
<var name="artifact_name" value="ktor-client-websockets"/>
<tldr>
    <p>
        <b>所需依賴項</b>: <code>io.ktor:ktor-client-websockets</code>
    </p>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    Websockets 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。
</link-summary>
<snippet id="websockets-description">
WebSocket 是一種協定，它透過單一 TCP 連線在使用者瀏覽器和伺服器之間提供全雙工通訊會話。它對於建立需要與伺服器進行即時資料傳輸的應用程式特別有用。Ktor 在伺服器端和用戶端都支援 WebSocket 協定。
</snippet>
<p>用戶端的 Websockets 外掛程式允許您處理 WebSocket 會話，以便與伺服器交換訊息。</p>
<note>
    <p>並非所有引擎都支援 WebSockets。有關支援引擎的概述，請參考<a href="client-engines.md#limitations">限制</a>。</p>
</note>
<tip>
    <p>要了解伺服器端 WebSocket 支援，請參閱<Links href="/ktor/server-websockets" summary="Websockets 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。">Ktor 伺服器中的 WebSockets</Links>。</p>
</tip>
<chapter title="新增依賴項" id="add_dependencies">
    <p>要使用 <code>WebSockets</code>，您需要將 <code>%artifact_name%</code> artifact 包含在建置腳本中：</p>
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
<p>
    您可以從<Links href="/ktor/client-dependencies" summary="了解如何將用戶端依賴項新增到現有專案。">新增用戶端依賴項</Links>了解更多關於 Ktor 用戶端所需的 artifact。
</p>
</chapter>
<chapter title="安裝 WebSockets" id="install_plugin">
    <p>要安裝 <code>WebSockets</code> 外掛程式，請將其傳遞給 <a href="#configure-client">用戶端配置區塊</a>內的 <code>install</code> 函數：</p>
    [object Promise]
</chapter>
<chapter title="配置" id="configure_plugin">
    <p>您可以選擇在 <code>install</code> 區塊內透過傳遞 <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/-web-sockets/-config/index.html">WebSockets.Config</a> 支援的屬性來配置外掛程式。</p>
    <deflist>
        <def id="maxFrameSize">
            <title><code>maxFrameSize</code></title>
            設定可以接收或傳送的最大 <code>Frame</code> 大小。
        </def>
        <def id="contentConverter">
            <title><code>contentConverter</code></title>
            設定用於序列化/反序列化的轉換器。
        </def>
        <def id="pingIntervalMillis">
            <title><code>pingIntervalMillis</code></title>
            以 <code>Long</code> 格式指定 ping 之間的持續時間。
        </def>
        <def id="pingInterval">
            <title><code>pingInterval</code></title>
            以 <code>Duration</code> 格式指定 ping 之間的持續時間。
        </def>
    </deflist>
    <warning>
        <p><code>pingInterval</code> 和 <code>pingIntervalMillis</code> 屬性不適用於 OkHttp 引擎。要為 OkHttp 設定 ping 間隔，您可以使用<a href="#okhttp">引擎配置</a>：
        </p>
        [object Promise]
    </warning>
    <p>
        在以下範例中，WebSockets 外掛程式配置了 20 秒（<code>20_000</code> 毫秒）的 ping 間隔，以自動傳送 ping 幀並保持 WebSocket 連線活躍：
    </p>
    [object Promise]
</chapter>
<chapter title="使用 WebSocket 會話" id="working-wtih-session">
    <p>用戶端的 WebSocket 會話由
        <a href="https://api.ktor.io/ktor-shared/ktor-websockets/io.ktor.websocket/-default-web-socket-session/index.html">DefaultClientWebSocketSession</a>
        介面表示。此介面公開了允許您傳送和接收 WebSocket 幀以及關閉會話的 API。
    </p>
    <chapter title="存取 WebSocket 會話" id="access-session">
        <p>
            <code>HttpClient</code> 提供兩種主要方式來存取 WebSocket 會話：
        </p>
        <list>
            <li>
                <p><a
                        href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket.html">webSocket()</a>
                    函數接受 <code>DefaultClientWebSocketSession</code> 作為區塊引數。</p>
                [object Promise]
            </li>
            <li>
                <a
                    href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket-session.html">webSocketSession()</a>
                函數返回 <code>DefaultClientWebSocketSession</code> 實例，並允許您在 <code>runBlocking</code> 或 <code>launch</code> 範圍之外存取會話。
            </li>
        </list>
    </chapter>
    <chapter title="處理 WebSocket 會話" id="handle-session">
        <p>在函數區塊內，您可以為指定路徑定義處理程式。以下函數和屬性在該區塊內可用：</p>
        <deflist>
            <def id="send">
                <title><code>send()</code></title>
                使用 <code>send()</code> 函數向伺服器傳送文字內容。
            </def>
            <def id="outgoing">
                <title><code>outgoing</code></title>
                使用 <code>outgoing</code> 屬性存取用於傳送 WebSocket 幀的通道。幀由 <code>Frame</code> 類別表示。
            </def>
            <def id="incoming">
                <title><code>incoming</code></title>
                使用 <code>incoming</code> 屬性存取用於接收 WebSocket 幀的通道。幀由 <code>Frame</code> 類別表示。
            </def>
            <def id="close">
                <title><code>close()</code></title>
                使用 <code>close()</code> 函數傳送帶有指定原因的關閉幀。
            </def>
        </deflist>
    </chapter>
    <chapter title="幀類型" id="frame-types">
        <p>
            您可以檢查 WebSocket 幀的類型並據此進行處理。一些常見的幀類型是：
        </p>
        <list>
            <li><code>Frame.Text</code> 表示一個文字幀。使用
                <code>Frame.Text.readText()</code> 讀取其內容。
            </li>
            <li><code>Frame.Binary</code> 表示一個二進位幀。使用 <code>Frame.Binary.readBytes()</code>
                讀取其內容。
            </li>
            <li><code>Frame.Close</code> 表示一個關閉幀。使用 <code>Frame.Close.readReason()</code>
                獲取會話關閉的原因。
            </li>
        </list>
    </chapter>
    <chapter title="範例" id="example">
        <p>以下範例建立了 <code>echo</code> WebSocket 端點，並展示了如何向伺服器傳送和從伺服器接收訊息。</p>
        [object Promise]
        <p>有關完整範例，
            請參閱
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets">client-websockets</a>。
        </p>
    </chapter>
</chapter>
</topic>