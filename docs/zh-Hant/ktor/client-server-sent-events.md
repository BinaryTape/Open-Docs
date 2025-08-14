<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-server-sent-events" title="Ktor 用戶端中的 Server-Sent Events" help-id="sse_client">
<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<tldr>
    <var name="example_name" value="client-sse"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    SSE 插件允許用戶端透過 HTTP 連線從伺服器接收基於事件的更新。
</link-summary>
<p>
    伺服器傳送事件 (Server-Sent Events, SSE) 是一種允許伺服器透過 HTTP 連線持續向用戶端推送事件的技術。這在伺服器需要傳送基於事件的更新而不需要用戶端重複輪詢伺服器的情況下特別有用。
</p>
<p>
    Ktor 支援的 SSE 插件提供了一種直接的方法，用於在伺服器和用戶端之間建立單向連線。
</p>
<tip>
    <p>要了解更多關於用於伺服器端支援的 SSE 插件，請參閱
        <Links href="/ktor/server-server-sent-events" summary="SSE 插件允許伺服器透過 HTTP 連線向用戶端傳送基於事件的更新。">SSE 伺服器插件</Links>
        。
    </p>
</tip>
<chapter title="新增依賴" id="add_dependencies">
    <p>
        <code>SSE</code> 僅需要 <Links href="/ktor/client-dependencies" summary="了解如何將用戶端依賴新增到現有專案。">ktor-client-core</Links> 構件，不需要任何特定的依賴。
    </p>
</chapter>
<chapter title="安裝 SSE" id="install_plugin">
    <p>
        要安裝 <code>SSE</code> 插件，請將其傳遞給
        <a href="#configure-client">用戶端配置區塊</a>內的 <code>install</code> 函式：
    </p>
    [object Promise]
</chapter>
<chapter title="配置 SSE 插件" id="configure">
    <p>
        您可以透過設定
        <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-s-s-e-config/index.html">SSEConfig</a>
        類別的支援屬性，在 <code>install</code> 區塊內選擇性地配置 SSE 插件。
    </p>
    <chapter title="SSE 重新連線" id="sse-reconnect">
        <tldr>
            <p>️️不支援：<code>OkHttp</code></p>
        </tldr>
        <p>
            要啟用與支援引擎的自動重新連線，請將
            <code>maxReconnectionAttempts</code> 設定為大於 <code>0</code> 的值。您也可以使用
            <code>reconnectionTime</code> 配置嘗試之間的延遲：
        </p>
        [object Promise]
        <p>
            如果與伺服器的連線遺失，用戶端將等待指定的
            <code>reconnectionTime</code>，然後嘗試重新連線。它將最多嘗試指定的 <code>maxReconnectionAttempts</code> 次來重新建立連線。
        </p>
    </chapter>
    <chapter title="過濾事件" id="filter-events">
        <p>
            在以下範例中，SSE 插件安裝到 HTTP 用戶端，並配置為包含僅包含註解的事件以及傳入流中僅包含 <code>retry</code> 欄位的事件：
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="處理 SSE 工作階段" id="handle-sse-sessions">
    <p>
        用戶端的 SSE 工作階段由
        <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html">
            <code>ClientSSESession</code>
        </a>
        介面表示。此介面公開了允許您從伺服器接收伺服器傳送事件的 API。
    </p>
    <chapter title="存取 SSE 工作階段" id="access-sse-session">
        <p><code>HttpClient</code> 允許您透過以下其中一種方式存取 SSE 工作階段：</p>
        <list>
            <li>
                <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse.html">
                    <code>sse()</code>
                </a>
                函式會建立 SSE 工作階段並允許您在其上執行操作。
            </li>
            <li>
                <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse-session.html">
                    <code>sseSession()</code>
                </a>
                函式允許您開啟 SSE 工作階段。
            </li>
        </list>
        <p>要指定 URL 端點，您可以從兩種選項中選擇：</p>
        <list>
            <li>使用 <code>urlString</code> 參數將整個 URL 指定為字串。</li>
            <li>使用 <code>schema</code>、<code>host</code>、<code>port</code> 和 <code>path</code> 參數分別指定協定方案、網域名稱、埠號和路徑名稱。
            </li>
        </list>
        [object Promise]
        <p>可選地，以下參數可用於配置連線：</p>
        <deflist>
            <def id="reconnectionTime-param">
                <title><code>reconnectionTime</code></title>
                設定重新連線延遲。
            </def>
            <def id="showCommentEvents-param">
                <title><code>showCommentEvents</code></title>
                指定是否在傳入流中顯示僅包含註解的事件。
            </def>
            <def id="showRetryEvents-param">
                <title><code>showRetryEvents</code></title>
                指定是否在傳入流中顯示僅包含 <code>retry</code> 欄位的事件。
            </def>
            <def id="deserialize-param">
                <title><code>deserialize</code></title>
                一個反序列化函式，用於將 <code>TypedServerSentEvent</code> 的 <code>data</code> 欄位轉換為物件。有關更多資訊，請參閱未定義。
            </def>
        </deflist>
    </chapter>
    <chapter title="SSE 工作階段區塊" id="sse-session-block">
        <p>
            在 Lambda 參數中，您可以存取
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html"><code>ClientSSESession</code></a>
            上下文。以下屬性可在區塊內使用：
        </p>
        <deflist>
            <def id="call">
                <title><code>call</code></title>
                與該工作階段關聯的 <code>HttpClientCall</code>。
            </def>
            <def id="incoming">
                <title><code>incoming</code></title>
                一個傳入的伺服器傳送事件流。
            </def>
        </deflist>
        <p>
            以下範例建立一個新的 SSE 工作階段，使用 <code>events</code> 端點，
            透過 <code>incoming</code> 屬性讀取事件，並印出接收到的
            <a href="https://api.ktor.io/ktor-shared/ktor-sse/io.ktor.sse/-server-sent-event/index.html"><code>ServerSentEvent</code></a>
            。
        </p>
        [object Promise]
        <p>有關完整範例，請參閱
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a>。
        </p>
    </chapter>
    <chapter title="反序列化" id="deserialization">
        <p>
            SSE 插件支援將伺服器傳送事件反序列化為型別安全的 Kotlin 物件。此功能在處理來自伺服器的結構化資料時特別有用。
        </p>
        <p>
            要啟用反序列化，請使用 SSE 存取函式上的 <code>deserialize</code> 參數提供一個自訂的反序列化函式，並使用
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session-with-deserialization/index.html">
                <code>ClientSSESessionWithDeserialization</code>
            </a>
            類別來處理反序列化事件。
        </p>
        <p>
            這裡有一個使用 <code>kotlinx.serialization</code> 反序列化 JSON 資料的範例：
        </p>
        [object Promise]
        <p>有關完整範例，請參閱
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a>。
        </p>
    </chapter>
</chapter>
</topic>