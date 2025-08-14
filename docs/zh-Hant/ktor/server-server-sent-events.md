<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="server-server-sent-events" title="Ktor 伺服器中的伺服器傳送事件" help-id="sse_server">
<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="plugin_name" value="SSE"/>
<var name="example_name" value="server-sse"/>
<var name="package_name" value="io.ktor.server.sse"/>
<var name="artifact_name" value="ktor-server-sse"/>
<tldr>
        <p>
            <b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
        </p>
    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
</tldr>
<link-summary>
        SSE 外掛程式允許伺服器透過 HTTP 連線向用戶端傳送基於事件的更新。
</link-summary>
<snippet id="sse-description">
        <p>
            伺服器傳送事件 (Server-Sent Events, SSE) 是一種技術，允許伺服器透過 HTTP 連線持續向用戶端推送事件。這在伺服器需要傳送基於事件的更新而無需用戶端重複輪詢伺服器時特別有用。
        </p>
        <p>
            Ktor 支援的 SSE 外掛程式提供了一種直接的方法來建立伺服器和用戶端之間的單向連線。
        </p>
</snippet>
<tip>
        <p>要了解更多關於用戶端支援的 SSE 外掛程式，請參閱
            <Links href="/ktor/client-server-sent-events" summary="SSE 外掛程式允許用戶端透過 HTTP 連線從伺服器接收基於事件的更新。">SSE 用戶端外掛程式</Links>
            。
        </p>
</tip>
<note>
        <p>
            對於多向通訊，請考慮使用 <Links href="/ktor/server-websockets" summary="Websockets 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。">WebSockets</Links>。它們使用 Websocket 協定在伺服器和用戶端之間提供全雙工通訊。
        </p>
</note>
<chapter title="限制" id="limitations">
        <p>
            Ktor 不支援 SSE 回應的資料壓縮。
            如果您使用 <Links href="/ktor/server-compression" summary="所需依賴項: io.ktor:%artifact_name%
        程式碼範例:
            %example_name%
        原生伺服器支援: ✖️">壓縮</Links>外掛程式，它將預設跳過 SSE 回應的壓縮。
        </p>
</chapter>
<chapter title="新增依賴項" id="add_dependencies">
<p>
        若要使用 <code>%plugin_name%</code>，您需要在建構指令碼中包含 <code>%artifact_name%</code> Artifact：
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
</chapter>
<chapter title="安裝 SSE" id="install_plugin">
<p>
        若要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式至應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
        以下程式碼片段顯示如何安裝 <code>%plugin_name%</code> ...
    </p>
<list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴展函數。
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
</chapter>
<chapter title="處理 SSE 會話" id="handle-sessions">
        <p>
            安裝 <code>SSE</code> 外掛程式後，您可以新增路由來處理 SSE 會話。
            為此，請在
            <a href="#define_route">路由</a>
            區塊內呼叫 <code>sse()</code> 函數。設定 SSE 路由有兩種方式：
        </p>
        <list type="decimal">
            <li>
                <p>使用特定 URL 路徑：</p>
                [object Promise]
            </li>
            <li>
                <p>
                    不帶路徑：
                </p>
                [object Promise]
            </li>
        </list>
        <chapter title="SSE 會話區塊" id="session-block">
            <p>
                在 <code>sse</code> 區塊內，您定義了指定路徑的處理器，由
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                    <code>ServerSSESession</code>
                </a>
                類別表示。以下函數和屬性在此區塊內可用：</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    建立並傳送 <code>ServerSentEvent</code> 到用戶端。
                </def>
                <def id="call">
                    <title><code>call</code></title>
                    與會話相關聯的接收到的 <code>ApplicationCall</code>，它是會話的來源。
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    關閉會話並終止與用戶端的連線。當所有 <code>send()</code> 操作完成後，<code>close()</code> 方法會自動呼叫。
                    <note>
                        使用 <code>close()</code> 函數關閉會話不會向用戶端傳送終止事件。要在關閉會話之前指示 SSE 流的結束，請使用 <code>send()</code> 函數傳送特定事件。
                    </note>
                </def>
            </deflist>
        </chapter>
        <chapter title="範例：處理單一會話" id="handle-single-session">
            <p>
                以下範例演示如何在 <code>/events</code> 端點上設定 SSE 會話，
                透過 SSE 通道傳送 6 個獨立事件，每個事件之間有 1 秒 (1000ms) 的延遲：
            </p>
            [object Promise]
            <p>完整範例請參閱
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>。
            </p>
        </chapter>
        <chapter title="SSE 心跳" id="heartbeat">
            <p>
                心跳透過定期傳送事件來確保 SSE 連線在不活動期間保持活躍。只要會話保持活躍，伺服器就會以配置的間隔傳送指定事件。
            </p>
            <p>
                要啟用和配置心跳，請在 SSE 路由處理器中使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html">
                    <code>.heartbeat()</code>
                </a>
                函數：
            </p>
            [object Promise]
            <p>
                在此範例中，每 10 毫秒傳送一次心跳事件以維持連線。
            </p>
        </chapter>
        <chapter title="序列化" id="serialization">
            <p>
                若要啟用序列化，請在 SSE 路由上使用 <code>serialize</code> 參數提供自訂序列化函數。在處理器內部，您可以使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                    <code>ServerSSESessionWithSerialization</code>
                </a>
                類別傳送序列化事件：
            </p>
            [object Promise]
            <p>
                此範例中的 <code>serialize</code> 函數負責將資料物件轉換為 JSON，然後將其放置在 <code>ServerSentEvent</code> 的 <code>data</code> 欄位中。
            </p>
            <p>完整範例請參閱
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>。
            </p>
        </chapter>
</chapter>