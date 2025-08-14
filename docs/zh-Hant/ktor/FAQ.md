```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="常見問題 (FAQ)"
   id="FAQ">
<chapter title="Ktor 的正確發音是什麼？" id="pronounce">
    <p>
        <emphasis>/keɪ-tor/</emphasis>
    </p>
</chapter>
<chapter title='「Ktor」這個名字代表什麼？' id="name-meaning">
    <p>
        Ktor 這個名字源自於縮寫 <code>ctor</code> (建構函式)，並將首字母替換為代表 Kotlin 的「K」。
    </p>
</chapter>
<chapter title="我該如何提問、回報錯誤、聯繫您、貢獻、提供意見回饋等？" id="feedback">
    <p>
        前往<a href="https://ktor.io/support/">支援</a>頁面，了解更多可用的支援管道。
        <a href="https://github.com/ktorio/ktor/blob/main/CONTRIBUTING.md">如何貢獻</a>指南描述了您可以為 Ktor 貢獻的方式。
    </p>
</chapter>
<chapter title="CIO 是什麼意思？" id="cio">
    <p>
        CIO 代表<emphasis>基於協程的 I/O</emphasis> (Coroutine-based I/O)。
        通常我們稱它為一種引擎，該引擎使用 Kotlin 和協程來實作 IETF RFC 或其他協定的邏輯，而無需依賴外部基於 JVM 的函式庫。
    </p>
</chapter>
<chapter title="如何修正未解析 (紅色) 的 Ktor 匯入？" id="ktor-artifact">
    <p>
        請確保在建置腳本中新增了對應的 <Links href="/ktor/server-dependencies" summary="了解如何將 Ktor 伺服器依賴項新增到現有的 Gradle/Maven 專案。">Ktor 構件 (artifacts)</Links>。
    </p>
</chapter>
<chapter
        title="Ktor 是否提供一種捕捉 IPC 訊號 (例如 SIGTERM 或 SIGINT) 的方式，以便優雅地處理伺服器關閉？"
        id="sigterm">
    <p>
        如果您正在執行 <a href="#engine-main">EngineMain</a>，它將會自動處理。
        否則，您需要<a
            href="https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-cio/jvmAndNix/src/io/ktor/server/cio/EngineMain.kt#L21">手動處理</a>。
        您可以使用 JVM 的 <code>Runtime.getRuntime().addShutdownHook</code> 功能。
    </p>
</chapter>
<chapter title="如何取得代理後端的用戶端 IP？" id="proxy-ip">
    <p>
        如果代理提供正確的標頭，並且 <Links href="/ktor/server-forward-headers" summary="所需依賴項：io.ktor:%artifact_name%
    程式碼範例：
        %example_name%
    原生伺服器支援：✅">ForwardedHeader</Links> 外掛已安裝，則 <code>call.request.origin</code> 屬性會提供關於原始呼叫者 (代理) 的<a href="#request_information">連線資訊</a>。
    </p>
</chapter>
<chapter title="如何測試 main 分支上的最新提交？" id="bleeding-edge">
    <p>
        您可以從 <code>jetbrains.space</code> 取得 Ktor 夜間建置版本。
        更多資訊請參閱<a href="https://ktor.io/eap/">搶先體驗計畫 (Early Access Program)</a>。
    </p>
</chapter>
<chapter title="如何確定我正在使用哪個版本的 Ktor？" id="ktor-version-used">
    <p>
        您可以使用 <Links href="/ktor/server-default-headers" summary="所需依賴項：io.ktor:%artifact_name%
    原生伺服器支援：✅">DefaultHeaders</Links> 外掛，它會在回應標頭中傳送一個包含 Ktor 版本的 <code>Server</code> 標頭，例如：
    </p>
    [object Promise]
</chapter>
<chapter title="我的路由未被執行。我該如何偵錯？" id="route-not-executing">
    <p>
        Ktor 提供了一種追蹤機制來協助排查路由決策問題。
        請查看<a href="#trace_routes">追蹤路由</a>章節。
    </p>
</chapter>
<chapter title="如何解決「回應已送出」？" id="response-already-sent">
    <p>
        這表示您、或外掛、或攔截器，已經呼叫了 <code>call.respond* </code> 函式，而您又再次呼叫它。
    </p>
</chapter>
<chapter title="如何訂閱 Ktor 事件？" id="ktor-events">
    <p>
        請參閱<Links href="/ktor/server-events" summary="程式碼範例：
        %example_name%">應用程式監控</Links>頁面以了解更多資訊。
    </p>
</chapter>
<chapter title="如何解決「找不到鍵為 ktor 的設定」？" id="cannot-find-application-conf">
    <p>
        這表示 Ktor 無法找到<Links href="/ktor/server-configuration-file" summary="了解如何在設定檔中配置各種伺服器參數。">設定檔</Links>。
        請確保 <code>resources</code> 資料夾中有一個設定檔，並且該 <code>resources</code> 資料夾已標記為資源資料夾。
        考慮使用 <a href="https://start.ktor.io/">Ktor 專案產生器</a>或
        <a href="https://plugins.jetbrains.com/plugin/16008-ktor">IntelliJ IDEA Ultimate 的 Ktor 外掛</a>來設定專案，以作為基礎工作專案。更多資訊請參閱<Links href="/ktor/server-create-a-new-project" summary="了解如何開啟、執行和測試使用 Ktor 的伺服器應用程式。">建立、開啟和執行新的 Ktor 專案</Links>。
    </p>
</chapter>
<chapter title="我可以在 Android 上使用 Ktor 嗎？" id="android-support">
    <p>
        是的，Ktor 伺服器和用戶端已知可在 Android 5 (API 21) 或更高版本上運作，至少使用 Netty 引擎時是如此。
    </p>
</chapter>
<chapter title="為什麼「CURL -I」返回「404 Not Found」？" id="curl-head-not-found">
    <p>
        <code>CURL -I</code> 是 <code>CURL --head</code> 的別名，用於執行 <code>HEAD</code> 請求。
        依預設，Ktor 不會處理 <code>GET</code> 處理常式的 <code>HEAD</code> 請求。
        若要啟用此功能，請安裝 <Links href="/ktor/server-autoheadresponse" summary="%plugin_name% 提供了為每個定義了 GET 的路由自動回應 HEAD 請求的功能。">AutoHeadResponse</Links> 外掛。
    </p>
</chapter>
<chapter title="使用「HttpsRedirect」外掛時如何解決無限重新導向？" id="infinite-redirect">
    <p>
        最可能的原因是您的後端位於反向代理或負載平衡器之後，且此中間層正在向您的後端發出正常的 HTTP 請求，因此您的 Ktor 後端中的 <code>HttpsRedirect</code> 外掛認為這是一個正常的 HTTP 請求並回應重新導向。
    </p>
    <p>
        通常，反向代理會傳送一些描述原始請求的標頭 (例如是否為 HTTPS，或原始 IP 位址)，並且有一個 <Links href="/ktor/server-forward-headers" summary="所需依賴項：io.ktor:%artifact_name%
    程式碼範例：
        %example_name%
    原生伺服器支援：✅">ForwardedHeader</Links> 外掛可以解析這些
        標頭，因此 <Links href="/ktor/server-https-redirect" summary="所需依賴項：io.ktor:%artifact_name%
    程式碼範例：
        %example_name%
    原生伺服器支援：✅">HttpsRedirect</Links> 外掛知道原始請求是 HTTPS。
    </p>
</chapter>
<chapter title="如何在 Windows 上安裝「curl」以便在 Kotlin/Native 上使用對應的引擎？" id="native-curl">
    <p>
        <a href="#curl">Curl</a> 用戶端引擎需要安裝 <code>curl</code> 函式庫。
        在 Windows 上，您可能需要考慮使用 MinGW/MSYS2 的 <code>curl</code> 二進位檔。
    </p>
    <procedure>
        <step>
            <p>
                依照 <a href="https://www.msys2.org/">MinGW/MSYS2</a> 中的說明安裝 MinGW/MSYS2。
            </p>
        </step>
        <step>
            <p>
                使用以下命令安裝 <code>libcurl</code>：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                如果您已將 MinGW/MSYS2 安裝到預設位置，請將
                <Path>C:\msys64\mingw64\bin\</Path>
                新增到 <code>PATH</code> 環境變數中。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="如何解決「NoTransformationFoundException」？" id="no-transformation-found-exception">
    <p>
        <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.call/-no-transformation-found-exception/index.html">NoTransformationFoundException</a>
        表示無法找到從<b>結果</b>類型到用戶端<b>預期</b>類型之間，針對<emphasis>接收到的主體</emphasis>的合適轉換。
    </p>
    <procedure>
        <step>
            <p>
                檢查您請求中的 <code>Accept</code> 標頭是否指定了所需的內容類型，並且伺服器回應中的 <code>Content-Type</code> 標頭是否與用戶端預期的類型相符。
            </p>
        </step>
        <step>
            <p>
                為您正在使用的特定內容類型註冊必要的內容轉換。
            </p>
            <p>
                您可以使用用戶端 <a href="https://ktor.io/docs/serialization-client.html">ContentNegotiation</a> 外掛。
                此外掛允許您指定如何針對不同的內容類型進行資料序列化和反序列化。
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                請確保您安裝了所有必要的外掛。可能缺少的功能：
            </p>
            <list type="bullet">
                <li>用戶端 <a href="https://ktor.io/docs/websocket-client.html">WebSockets</a> 和
                    伺服器 <a href="https://ktor.io/docs/websocket.html">WebSockets</a></li>
                <li>用戶端 <a href="https://ktor.io/docs/serialization-client.html">ContentNegotiation</a> 和
                    伺服器 <a href="https://ktor.io/docs/serialization.html">ContentNegotiation</a></li>
                <li><a href="https://ktor.io/docs/compression.html">Compression</a></li>
            </list>
        </step>
    </procedure>
</chapter>