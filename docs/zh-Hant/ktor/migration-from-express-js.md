<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="從 Express 遷移到 Ktor"
       id="migration-from-express-js" help-id="express-js;migrating-from-express-js">
    <show-structure for="chapter" depth="2"/>
    <link-summary>本指南介紹如何建立、執行及測試一個簡單的 Ktor 應用程式。</link-summary>
    <tldr>
        <p>
            <b>程式碼範例</b>：
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express">migrating-express</a>
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor">migrating-express-ktor</a>
        </p>
    </tldr>
    <p>
        在本指南中，我們將探討如何在基本情境下將 Express 應用程式遷移到 Ktor：從生成應用程式、編寫您的第一個應用程式到建立中介軟體以擴展應用程式功能。
    </p>
    <chapter title="生成應用程式" id="generate">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        您可以使用 <code>express-generator</code> 工具生成新的 Express 應用程式：
                    </p>
                    [object Promise]
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 提供以下方式來生成應用程式骨架：
                    </p>
                    <list>
                        <li>
                            <p>
                                <a href="https://start.ktor.io/">Ktor 專案生成器</a> — 使用基於網頁的生成器。
                            </p>
                        </li>
                        <li>
                            <p>
                                <a href="https://github.com/ktorio/ktor-cli">
                                    Ktor CLI 工具
                                </a> — 透過命令列介面使用
                                <code>ktor new</code> 指令生成 Ktor 專案：
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://www.npmjs.com/package/generator-ktor">
                                    Yeoman 生成器
                                </a>
                                — 互動式配置專案設定並選擇所需的外掛程式：
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://ktor.io/idea/">IntelliJ IDEA Ultimate</a> — 使用內建的 Ktor 專案精靈。
                            </p>
                        </li>
                    </list>
                    <p>
                        如需詳細說明，請參閱<Links href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 開啟、執行及測試伺服器應用程式。">建立、開啟及執行新的 Ktor 專案</Links>教學。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="哈囉世界" id="hello">
        <p>
            在本節中，我們將探討如何建立最簡單的伺服器應用程式，該應用程式接受 <code>GET</code> 請求並回應預定義的純文字。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        以下範例展示了啟動伺服器並在埠
                        <control>3000</control>
                        上監聽連線的 Express 應用程式。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/1_hello/app.js">1_hello</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，您可以使用 <a href="#embedded-server">embeddedServer</a>
                        函數在程式碼中配置伺服器參數並快速執行應用程式。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt">1_hello</a>
                        專案。
                    </p>
                    <p>
                        您也可以在一個使用 HOCON 或 YAML 格式的<a href="#engine-main">外部組態檔</a>中指定伺服器設定。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            請注意，上面的 Express 應用程式會添加
            <control>Date</control>
            、
            <control>X-Powered-By</control>
            和
            <control>ETag</control>
            回應標頭，其外觀可能如下：
        </p>
        [object Promise]
        <p>
            要在 Ktor 中將預設的
            <control>Server</control>
            和
            <control>Date</control>
            標頭添加到每個回應中，
            您需要安裝 <Links href="/ktor/server-default-headers" summary="所需依賴項：io.ktor:%artifact_name% 原生伺服器支援：✅">DefaultHeaders</Links> 外掛程式。
            <Links href="/ktor/server-conditional-headers" summary="所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅">ConditionalHeaders</Links> 外掛程式可用於配置
            <control>Etag</control>
            回應標頭。
        </p>
    </chapter>
    <chapter title="提供靜態內容" id="static">
        <p>
            在本節中，我們將探討如何在 Express 和 Ktor 中提供圖片、CSS 檔案和 JavaScript 檔案等靜態檔案。
            假設我們有一個
            <Path>public</Path>
            資料夾，其中包含主要的
            <Path>index.html</Path>
            頁面
            及一組連結的資產。
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，將資料夾名稱傳遞給
                        <control>express.static</control>
                        函數。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/2_static/app.js">2_static</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，使用 <a href="#folders"><code>staticFiles()</code></a>
                        函數將對
                        <Path>/</Path>
                        路徑的任何請求對應到
                        <Path>public</Path>
                        實體資料夾。
                        此函數允許遞迴地提供
                        <Path>public</Path>
                        資料夾中的所有檔案。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱 <a
                            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt">2_static</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            提供靜態內容時，Express 會添加一些回應標頭，其外觀可能如下所示：
        </p>
        [object Promise]
        <p>
            要在 Ktor 中管理這些標頭，您需要安裝以下外掛程式：
        </p>
        <list>
            <li>
                <p>
                    <control>Accept-Ranges</control>
                    : <Links href="/ktor/server-partial-content" summary="所需依賴項：io.ktor:%artifact_name% 伺服器範例：download-file，客戶端範例：client-download-file-range 原生伺服器支援：✅">PartialContent</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>Cache-Control</control>
                    : <Links href="/ktor/server-caching-headers" summary="所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅">CachingHeaders</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>ETag</control>
                    和
                    <control>Last-Modified</control>
                    :
                    <Links href="/ktor/server-conditional-headers" summary="所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅">ConditionalHeaders</Links>
                </p>
            </li>
        </list>
    </chapter>
    <chapter title="路由" id="routing">
        <p>
            <Links href="/ktor/server-routing" summary="路由是處理伺服器應用程式中傳入請求的核心外掛程式。">路由</Links>允許處理對特定端點的傳入請求，
            該端點由特定的 HTTP 請求方法（<code>GET</code>、<code>POST</code> 等）和路徑定義。
            以下範例展示如何處理對
            <Path>/</Path>
            路徑的 <code>GET</code> 和
            <code>POST</code> 請求。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    [object Promise]
                    <tip>
                        <p>
                            請參閱 undefined 以了解如何接收 <code>POST</code>、<code>PUT</code> 或
                            <code>PATCH</code> 請求的主體。
                        </p>
                    </tip>
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            以下範例演示如何依路徑分組路由處理器。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，您可以透過使用
                        <code>app.route()</code> 為路由路徑建立可鏈式路由處理器。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 提供一個 <code>route</code> 函數，
                        您可以透過它定義路徑，然後將該路徑的動詞作為巢狀函數放置。
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            兩個框架都允許您將相關路由分組到單一檔案中。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express 提供 <code>express.Router</code> 類別來建立可掛載的路由處理器。
                        假設應用程式目錄中有
                        <Path>birds.js</Path>
                        路由檔案。
                        此路由模組可以在
                        <Path>app.js</Path>
                        中載入，如下所示：
                    </p>
                    <tabs>
                        <tab title="birds.js">
                            [object Promise]
                        </tab>
                        <tab title="app.js">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，一種常見模式是使用 <code>Routing</code> 型別上的擴充功能
                        來定義實際路由。
                        以下範例（
                        <Path>Birds.kt</Path>
                        ）定義了 <code>birdsRoutes</code> 擴充功能。
                        您可以透過在 <code>routing</code> 區塊內呼叫此函數，將相應的路由包含在應用程式（
                        <Path>Application.kt</Path>
                        ）中：
                    </p>
                    <tabs>
                        <tab title="Birds.kt" id="birds-kt">
                            [object Promise]
                        </tab>
                        <tab title="Application.kt" id="application-kt">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            除了將 URL 路徑指定為字串外，Ktor 還包括實作 <Links href="/ktor/server-resources" summary="Resources 外掛程式允許您實作型別安全路由。">型別安全路由</Links>的功能。
        </p>
    </chapter>
    <chapter title="路由與查詢參數" id="route-query-param">
        <p>
            本節將向我們展示如何存取路由和查詢參數。
        </p>
        <p>
            路由（或路徑）參數是用於捕獲 URL 中其位置處指定值的命名 URL 片段。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        要在 Express 中存取路由參數，您可以使用 <code>Request.params</code>。
                        例如，以下程式碼片段中的 <code>req.parameters["login"]</code> 將
                        針對
                        <Path>/user/admin</Path>
                        路徑返回
                        <emphasis>admin</emphasis>
                        ：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，路由參數使用 <code>{param}</code> 語法定義。
                        您可以在路由處理器中使用 <code>call.parameters</code> 存取路由參數：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            下表比較如何存取查詢字串的參數。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        要在 Express 中存取路由參數，您可以使用 <code>Request.params</code>。
                        例如，以下程式碼片段中的 <code>req.parameters["login"]</code> 將
                        針對
                        <Path>/user/admin</Path>
                        路徑返回
                        <emphasis>admin</emphasis>
                        ：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，路由參數使用 <code>{param}</code> 語法定義。
                        您可以在路由處理器中使用 <code>call.parameters</code> 存取路由參數：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="傳送回應" id="send-response">
        <p>
            在前面的章節中，我們已經了解如何回應純文字內容。
            現在讓我們看看如何傳送 JSON、檔案和重新導向回應。
        </p>
        <chapter title="JSON" id="send-json">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中傳送具有適當內容型別的 JSON 回應，
                            請呼叫 <code>res.json</code> 函數：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，您需要安裝 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端和伺服器之間的媒體型別，以及以特定格式序列化/反序列化內容。">ContentNegotiation</Links>
                            外掛程式並
                            配置 JSON 序列化器：
                        </p>
                        [object Promise]
                        <p>
                            要將資料序列化為 JSON，您需要建立一個帶有
                            <code>@Serializable</code> 註解的資料類別：
                        </p>
                        [object Promise]
                        <p>
                            然後，您可以使用 <code>call.respond</code> 在回應中傳送此類別的物件：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="檔案" id="send-file">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中回應檔案，請使用 <code>res.sendFile</code>：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktor 提供 <code>call.respondFile</code> 函數用於將檔案傳送給客戶端：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
            <p>
                Express 應用程式在回應檔案時會添加
                <control>Accept-Ranges</control>
                HTTP 回應標頭。
                伺服器使用此標頭來宣傳其支援客戶端對於檔案
                下載的部分請求。
                在 Ktor 中，您需要安裝 <Links href="/ktor/server-partial-content" summary="所需依賴項：io.ktor:%artifact_name% 伺服器範例：download-file，客戶端範例：client-download-file-range 原生伺服器支援：✅">PartialContent</Links> 外掛程式以
                支援部分請求。
            </p>
        </chapter>
        <chapter title="檔案附件" id="send-file-attachment">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            <code>res.download</code> 函數將指定檔案作為附件傳輸：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，您需要手動配置
                            <control>Content-Disposition</control>
                            標頭，以將檔案作為附件傳輸：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="重新導向" id="redirect">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中生成重新導向回應，請呼叫 <code>redirect</code> 函數：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，使用 <code>respondRedirect</code> 來傳送重新導向回應：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="模板" id="templates">
        <p>
            Express 和 Ktor 都支援使用模板引擎處理視圖。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        假設我們在
                        <Path>views</Path>
                        資料夾中有以下 Pug 模板：
                    </p>
                    [object Promise]
                    <p>
                        要用此模板回應，請呼叫 <code>res.render</code>：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/6_templates/app.js">6_templates</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 支援多種 <Links href="/ktor/server-templating" summary="了解如何使用 HTML/CSS 或 JVM 模板引擎建立的視圖。">JVM 模板引擎</Links>，
                        例如 FreeMarker、Velocity 等。
                        例如，如果您需要使用應用程式資源中的 FreeMarker 模板進行回應，
                        請安裝並配置 <code>FreeMarker</code> 外掛程式，然後使用 <code>call.respond</code> 傳送模板：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt">6_templates</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="接收請求" id="receive-request">
        <p>
            本節將展示如何接收不同格式的請求主體。
        </p>
        <chapter title="純文字" id="receive-raw-text">
            <p>
                下面的 <code>POST</code> 請求向伺服器傳送文字資料：
            </p>
            [object Promise]
            <p>
                讓我們看看如何在伺服器端將此請求的主體作為純文字接收。
            </p>
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中解析傳入的請求主體，您需要添加 <code>body-parser</code>：
                        </p>
                        [object Promise]
                        <p>
                            在 <code>post</code> 處理器中，
                            您需要傳遞文字解析器（<code>bodyParser.text</code>）。
                            請求主體將在 <code>req.body</code> 屬性下可用：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，您可以使用 <code>call.receiveText</code> 將主體作為文字接收：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="JSON" id="receive-json">
            <p>
                在本節中，我們將探討如何接收 JSON 主體。
                以下範例展示了一個其主體中包含 JSON 物件的 <code>POST</code> 請求：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中接收 JSON，請使用 <code>bodyParser.json</code>：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，您需要安裝 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端和伺服器之間的媒體型別，以及以特定格式序列化/反序列化內容。">ContentNegotiation</Links>
                            外掛程式
                            並配置 <code>Json</code> 序列化器：
                        </p>
                        [object Promise]
                        <p>
                            要將接收到的資料反序列化為物件，您需要建立一個資料類別：
                        </p>
                        [object Promise]
                        <p>
                            然後，使用接受此資料類別作為參數的 <code>receive</code> 方法：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="URL 編碼" id="receive-url-encoded">
            <p>
                現在讓我們看看如何接收使用
                <control>application/x-www-form-urlencoded</control>
                型別傳送的表單資料。
                以下程式碼片段展示了一個包含表單資料的 <code>POST</code> 請求範例：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            與純文字和 JSON 一樣，Express 需要 <code>body-parser</code>。
                            您需要將解析器型別設定為 <code>bodyParser.urlencoded</code>：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，使用 <code>call.receiveParameters</code> 函數：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="原始資料" id="receive-raw-data">
            <p>
                下一個用例是處理二進位資料。
                下面的請求使用
                <control>application/octet-stream</control>
                將 PNG 圖片傳送給伺服器：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中處理二進位資料，請將解析器型別設定為 <code>raw</code>：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktor 提供 <code>ByteReadChannel</code> 和 <code>ByteWriteChannel</code>
                            用於非同步讀寫位元組序列：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive
                                request</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="多部分" id="receive-multipart">
            <p>
                在最後一節中，讓我們看看如何處理
                <emphasis>多部分</emphasis>
                主體。
                下面的 <code>POST</code> 請求使用
                <control>multipart/form-data</control>
                型別傳送帶有描述的 PNG 圖片：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Express 需要一個單獨的模組來解析多部分資料。
                            在下面的範例中，
                            <control>multer</control>
                            用於將檔案上傳到伺服器：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，如果您需要接收作為多部分請求一部分傳送的檔案，
                            請呼叫 <code>receiveMultipart</code> 函數，然後根據需要遍歷每個部分。
                            在下面的範例中，<code>PartData.FileItem</code> 用於將檔案作為位元組流接收：
                        </p>
                        [object Promise]
                        <p>
                            如需完整範例，請參閱
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            專案。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="建立中介軟體" id="middleware">
        <p>
            我們要探討的最後一件事是如何建立中介軟體，它允許您擴展伺服器功能。
            以下範例展示如何使用 Express 和 Ktor 實作請求日誌記錄。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，中介軟體是使用 <code>app.use</code> 綁定到應用程式的函數：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/8_middleware/app.js">8_middleware</a>
                        專案。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 允許您使用 <Links href="/ktor/server-custom-plugins" summary="了解如何建立自己的自訂外掛程式。">自訂外掛程式</Links>擴展其功能。
                        以下程式碼範例展示如何處理 <code>onCall</code> 以實作請求日誌記錄：
                    </p>
                    [object Promise]
                    <p>
                        如需完整範例，請參閱
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt">8_middleware</a>
                        專案。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="接下來是什麼" id="next">
        <p>
            本指南中仍有許多未涵蓋的用例，
            例如工作階段管理、授權、資料庫整合等等。
            對於這些功能中的大多數，Ktor 提供了專用的外掛程式，
            可以安裝在應用程式中並根據需要進行配置。
            要繼續您的 Ktor 之旅，
            請訪問
            <control><a href="https://ktor.io/learn/">學習頁面</a></control>
            ，該頁面提供了一系列逐步指南和可直接使用的範例。
        </p>
    </chapter>
</topic>