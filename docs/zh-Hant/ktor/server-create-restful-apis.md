<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="如何在 Kotlin 中使用 Ktor 建立 RESTful API" id="server-create-restful-apis"
       help-id="create-restful-apis">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-restful-api"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由（Routing）是一個核心插件，用於處理伺服器應用程式中的傳入請求。">Routing</Links>,<Links href="/ktor/server-static-content" summary="了解如何提供靜態內容，例如樣式表、腳本、影像等。">Static Content</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件有兩個主要用途：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>, <a
            href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
    </p>
</tldr>
<card-summary>
    了解如何使用 Ktor 建立 RESTful API。本教學將涵蓋真實範例的設定、路由和測試。
</card-summary>
<web-summary>
    了解如何使用 Ktor 建立 Kotlin RESTful API。本教學涵蓋真實範例的設定、路由和測試。這是 Kotlin 後端開發人員理想的入門教學。
</web-summary>
<link-summary>
    了解如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。
</link-summary>
<p>
    在本教學中，我們將說明如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。
</p>
<p>
    在<Links href="/ktor/server-requests-and-responses" summary="透過建立任務管理器應用程式，了解 Kotlin 中使用 Ktor 進行路由、處理請求和參數的基礎知識。">上一個教學</Links>中，我們向您介紹了驗證、錯誤處理和單元測試的基礎知識。本教學將透過建立一個用於管理任務的 RESTful 服務來擴展這些主題。
</p>
<p>
    您將學習如何執行以下操作：
</p>
<list>
    <li>建立使用 JSON 序列化的 RESTful 服務。</li>
    <li>了解<Links href="/ktor/server-serialization" summary="ContentNegotiation 插件有兩個主要用途：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">內容協商</Links>的過程。</li>
    <li>在 Ktor 中定義 REST API 的路由。</li>
</list>
<chapter title="先決條件" id="prerequisites">
    <p>您可以獨立完成本教學，
        然而，我們強烈建議您先完成之前的教學，以了解如何<Links href="/ktor/server-requests-and-responses" summary="透過建立任務管理器應用程式，了解 Kotlin 中使用 Ktor 進行路由、處理請求和參數的基礎知識。">處理請求和產生回應</Links>
        。
    </p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以選擇使用其他 IDE。
    </p>
</chapter>
<chapter title="Hello RESTful 任務管理器" id="hello-restful-task-manager">
    <p>在本教學中，您將把現有的任務管理器重寫為 RESTful 服務。為此，您將使用幾個 Ktor <Links href="/ktor/server-plugins" summary="插件提供常見功能，例如序列化、內容編碼、壓縮等。">插件</Links>。</p>
    <p>
        雖然您可以手動將其新增到現有專案中，但更簡單的方法是產生一個新專案，然後逐步新增來自上一個教學的程式碼。您將逐步重寫所有程式碼，因此無需準備上一個專案。
    </p>
    <procedure title="建立帶有插件的新專案">
        <step>
<p>
    導航到
    <a href="https://start.ktor.io/">Ktor 專案產生器</a>
    。
</p>
        </step>
        <step>
            <p>在
                <control>專案構件</control>
                欄位中，輸入
                <Path>com.example.ktor-rest-task-app</Path>
                作為您的專案構件名稱。
                <img src="tutorial_creating_restful_apis_project_artifact.png"
                     alt="在 Ktor 專案產生器中命名專案構件"
                     style="block"
                     border-effect="line"
                     width="706"/>
            </p>
        </step>
        <step>
            <p>
                在插件區塊中，點擊
                <control>新增</control>
                按鈕，搜尋並新增以下插件：
            </p>
            <list type="bullet">
                <li>Routing</li>
                <li>Content Negotiation</li>
                <li>Kotlinx.serialization</li>
                <li>Static Content</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif" alt="在 Ktor 專案產生器中新增插件"
                     border-effect="line"
                     style="block"
                     width="706"/>
                新增插件後，您將在專案設定下方看到所有
                四個插件的列表。
                <img src="tutorial_creating_restful_apis_plugins_list.png"
                     alt="Ktor 專案產生器中的插件列表"
                     border-effect="line"
                     style="block"
                     width="706"/>
            </p>
        </step>
        <step>
<p>
    點擊
    <control>下載</control>
    按鈕來產生並下載您的 Ktor 專案。
</p>
        </step>
    </procedure>
    <procedure title="新增起始程式碼" id="add-starter-code">
        <step>
            <p>在 IntelliJ IDEA 中開啟您的專案，如<a href="server-create-a-new-project.topic#open-explore-run">在 IntelliJ IDEA 中開啟、探索並執行您的 Ktor 專案</a>教學中所述。</p>
        </step>
        <step>
            <p>
                導航到
                <Path>src/main/kotlin/com/example</Path>
                並建立一個名為
                <Path>model</Path>
                的子套件。
            </p>
        </step>
        <step>
            <p>
                在<Path>model</Path>套件內，建立一個新的
                <Path>Task.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                開啟<Path>Task.kt</Path>檔案，並新增一個 <code>enum</code> 來表示優先級，以及一個 <code>class</code>
                來表示任務：
            </p>
            [object Promise]
            <p>
                在上一個教學中，您使用了擴充函式將 <code>Task</code> 轉換為 HTML。在此情況下，
                <code>Task</code> 類別使用來自 <code>kotlinx.serialization</code> 函式庫的 <a
                    href="https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"><code>Serializable</code></a>
                類型進行註解。
            </p>
        </step>
        <step>
            <p>
                開啟<Path>Routing.kt</Path>檔案，並將現有程式碼替換為以下實作：
            </p>
            [object Promise]
            <p>
                與之前的教學類似，您為 URL <code>/tasks</code> 的 GET 請求建立了路由。
                這次，您無需手動轉換任務列表，只需直接返回列表即可。
            </p>
        </step>
        <step>
<p>在 IntelliJ IDEA 中，點擊執行按鈕
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="IntelliJ IDEA 執行圖示"/>)
    以啟動應用程式。</p>
        </step>
        <step>
            <p>
                在瀏覽器中導航到 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您
                應該會看到任務列表的 JSON 版本，如下所示：
            </p>
        </step>
        <img src="tutorial_creating_restful_apis_starter_code_preview.png"
             alt="在瀏覽器螢幕中顯示的 JSON 資料"
             border-effect="rounded"
             width="706"/>
        <p>顯然，系統為我們完成了大量工作。這究竟是怎麼回事？</p>
    </procedure>
</chapter>
<chapter title="了解內容協商" id="content-negotiation">
    <chapter title="透過瀏覽器進行內容協商" id="via-browser">
        <p>
            當您建立專案時，您包含了<Links href="/ktor/server-serialization" summary="ContentNegotiation 插件有兩個主要用途：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">內容協商</Links>
            插件。此插件會查看客戶端可以渲染的內容類型，並將其與當前
            服務可以提供的內容類型進行匹配。因此，稱為
            <format style="italic">內容協商</format>
            。
        </p>
        <p>
            在 HTTP 中，客戶端透過 <code>Accept</code> 標頭發出訊號，指示它可以渲染哪些內容類型。此
            標頭的值是一個或多個內容類型。在上述情況下，您可以使用瀏覽器內建的開發工具檢查此
            標頭的值。
        </p>
        <p>
            請看以下範例：
        </p>
        [object Promise]
        <p>請注意包含 <code>*/*</code>。此標頭表示它接受 HTML、XML 或影像——但它
            也接受任何其他內容
            類型。</p>
        <p>內容協商插件需要找到一種格式來將資料傳回瀏覽器。如果您查看
            專案中產生的程式碼，您會發現一個名為
            <Path>Serialization.kt</Path>
            的檔案，位於
            <Path>src/main/kotlin/com/example</Path>
            內部，其中包含以下內容：
        </p>
        [object Promise]
        <p>
            這段程式碼安裝了 <code>ContentNegotiation</code> 插件，也配置了 <code>kotlinx.serialization</code>
            插件。有了這個，當客戶端發送請求時，伺服器可以將序列化為 JSON 的物件傳回。
        </p>
        <p>
            在來自瀏覽器的請求中，<code>ContentNegotiation</code> 插件知道它只能
            返回 JSON，並且瀏覽器將嘗試顯示它收到的任何內容。因此請求成功。
        </p>
    </chapter>
    <procedure title="透過 JavaScript 進行內容協商" id="via-javascript">
        <p>
            在生產環境中，您不會希望直接在瀏覽器中顯示 JSON。相反地，瀏覽器中會執行 JavaScript 程式碼，
            它會發出請求，然後將返回的資料作為單頁應用程式（SPA）的一部分顯示。通常，這種應用程式會使用像
            <a href="https://react.dev/">React</a>、
            <a href="https://angular.io/">Angular</a>、
            或 <a href="https://vuejs.org/">Vue.js</a> 這樣的框架來編寫。
        </p>
        <step>
            <p>
                為了模擬此情況，開啟
                <Path>src/main/resources/static</Path>
                中的
                <Path>index.html</Path>
                頁面，並將預設內容替換為以下內容：
            </p>
            [object Promise]
            <p>
                此頁面包含一個 HTML 表單和一個空表。提交表單後，JavaScript 事件處理器
                會向 <code>/tasks</code> 端點發送請求，並將 <code>Accept</code> 標頭設定為
                <code>application/json</code>。返回的資料隨後被反序列化並新增到 HTML 表格中。
            </p>
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="IntelliJ IDEA 重新執行圖示"/>) 以重新啟動應用程式。
</p>
        </step>
        <step>
            <p>
                導航到 URL <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                您應該能夠透過點擊
                <control>查看任務</control>
                按鈕來獲取資料：
            </p>
            <img src="tutorial_creating_restful_apis_tasks_via_js.png"
                 alt="一個瀏覽器視窗顯示按鈕和以 HTML 表格形式顯示的任務"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="新增 GET 路由" id="porting-get-routes">
    <p>
        既然您已熟悉內容協商的過程，請繼續將
        <Links href="/ktor/server-requests-and-responses" summary="透過建立任務管理器應用程式，了解 Kotlin 中使用 Ktor 進行路由、處理請求和參數的基礎知識。">上一個教學</Links>的功能
        轉移到本教學中。
    </p>
    <chapter title="重複使用任務儲存庫" id="task-repository">
        <p>
            您可以直接重複使用任務儲存庫，無需任何修改，所以讓我們從這一步開始。
        </p>
        <procedure>
            <step>
                <p>
                    在<Path>model</Path>
                    套件內建立一個新的
                    <Path>TaskRepository.kt</Path>
                    檔案。
                </p>
            </step>
            <step>
                <p>
                    開啟<Path>TaskRepository.kt</Path>
                    並新增以下程式碼：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="重複使用 GET 請求的路由" id="get-requests">
        <p>
            現在您已經建立好儲存庫，您可以實作 GET 請求的路由。之前的
            程式碼可以簡化，因為您不再需要擔心將任務轉換為 HTML：
        </p>
        <procedure>
            <step>
                <p>
                    導航到<Path>src/main/kotlin/com/example</Path>
                    中的
                    <Path>Routing.kt</Path>
                    檔案。
                </p>
            </step>
            <step>
                <p>
                    使用以下實作更新 <code>Application.configureRouting()</code> 函式中
                    <code>/tasks</code> 路由的程式碼：
                </p>
                [object Promise]
                <p>
                    有了這個，您的伺服器可以回應以下 GET 請求：</p>
                <list>
                    <li><code>/tasks</code> 返回儲存庫中的所有任務。</li>
                    <li><code>/tasks/byName/{taskName}</code> 返回根據指定
                        <code>taskName</code> 篩選的任務。
                    </li>
                    <li><code>/tasks/byPriority/{priority}</code> 返回根據指定
                        <code>priority</code> 篩選的任務。
                    </li>
                </list>
            </step>
            <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="IntelliJ IDEA 重新執行圖示"/>) 以重新啟動應用程式。
</p>
            </step>
        </procedure>
    </chapter>
    <chapter title="測試功能" id="test-tasks-routes">
        <procedure title="使用瀏覽器">
            <p>您可以在瀏覽器中測試這些路由。例如，導航到 <a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>
                以查看所有優先級為 <code>Medium</code> 的任務，並以 JSON 格式顯示：</p>
            <img src="tutorial_creating_restful_apis_tasks_medium_priority.png"
                 alt="一個瀏覽器視窗顯示優先級為 Medium 的任務，並以 JSON 格式呈現"
                 border-effect="rounded"
                 width="706"/>
            <p>
                鑑於這些類型的請求通常會來自 JavaScript，因此更
                精細的測試是更好的選擇。為此，您可以使用專業工具，例如 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
            </p>
        </procedure>
        <procedure title="使用 Postman">
            <step>
                <p>在 Postman 中，建立一個新的 GET 請求，URL 為
                    <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>。</p>
            </step>
            <step>
                <p>
                    在
                    <ui-path>標頭</ui-path>
                    窗格中，將
                    <ui-path>Accept</ui-path>
                    標頭的值設定為 <code>application/json</code>。
                </p>
            </step>
            <step>
                <p>點擊
                    <control>傳送</control>
                    以傳送請求並在回應檢視器中查看回應。
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_postman.png"
                     alt="Postman 中的 GET 請求，顯示以 JSON 格式呈現的優先級為 Medium 的任務"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <procedure title="使用 HTTP 請求檔案">
            <p>在 IntelliJ IDEA Ultimate 中，您可以在 HTTP 請求檔案中執行相同的步驟。</p>
            <step>
                <p>
                    在專案根目錄中，建立一個新的
                    <Path>REST Task Manager.http</Path>
                    檔案。
                </p>
            </step>
            <step>
                <p>
                    開啟<Path>REST Task Manager.http</Path>
                    檔案並新增以下 GET 請求：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    要在 IntelliJ IDE 中傳送請求，請點擊其旁邊的裝訂線圖示 (<img
                        alt="IntelliJ IDEA 裝訂線圖示"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>)。
                </p>
            </step>
            <step>
                <p>這將在
                    <Path>服務</Path>
                    工具視窗中開啟並執行：
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_http_file.png"
                     alt="HTTP 檔案中的 GET 請求，顯示以 JSON 格式呈現的優先級為 Medium 的任務"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <note>
            測試路由的另一種方法是從 Kotlin Notebook 中使用 <a
                href="https://khttp.readthedocs.io/en/latest/">khttp</a> 函式庫。
        </note>
    </chapter>
</chapter>
<chapter title="新增 POST 請求的路由" id="add-a-route-for-post-requests">
    <p>
        在之前的教學中，任務是透過 HTML 表單建立的。然而，由於您現在正在建立
        RESTful 服務，您不再需要這樣做。相反地，您將使用 <code>kotlinx.serialization</code>
        框架，它將完成大部分繁重的工作。
    </p>
    <procedure>
        <step>
            <p>
                開啟<Path>src/main/kotlin/com/example</Path>
                中的
                <Path>Routing.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                將新的 POST 路由新增到 <code>Application.configureRouting()</code> 函式中，如下所示：
            </p>
            [object Promise]
            <p>
                新增以下新的匯入：
            </p>
            [object Promise]
            <p>
                當 POST 請求發送到 <code>/tasks</code> 時，<code>kotlinx.serialization</code> 框架
                用於將請求主體轉換為 <code>Task</code> 物件。如果成功，任務將被新增到儲存庫中。
                如果反序列化過程失敗，伺服器將需要處理 <code>SerializationException</code>；
                而如果任務重複，則需要處理 <code>IllegalStateException</code>。
            </p>
        </step>
        <step>
            <p>
                重新啟動應用程式。
            </p>
        </step>
        <step>
            <p>
                為了在 Postman 中測試此功能，建立一個新的 POST 請求到 URL <code>http://0.0.0.0:8080/tasks</code>。
            </p>
        </step>
        <step>
            <p>
                在
                <ui-path>主體</ui-path>
                窗格中，新增以下 JSON 文件以表示一個新任務：
            </p>
            [object Promise]
            <img src="tutorial_creating_restful_apis_add_task.png"
                 alt="Postman 中用於新增任務的 POST 請求"
                 border-effect="line"
                 width="706"/>
        </step>
        <step>
            <p>點擊
                <control>傳送</control>
                以傳送請求。
            </p>
        </step>
        <step>
            <p>
                您可以透過向 <a
                    href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>
                發送 GET 請求來驗證任務是否已新增。
            </p>
        </step>
        <step>
            <p>
                在 IntelliJ IDEA Ultimate 中，您可以透過將以下內容新增到 HTTP 請求檔案中來執行相同的步驟：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="新增支援移除功能" id="remove-tasks">
    <p>
        您幾乎已完成將基本操作新增到您的服務中。這些操作通常被概括為 CRUD
        操作——即建立（Create）、讀取（Read）、更新（Update）和刪除（Delete）。現在您將實作刪除操作。
    </p>
    <procedure>
        <step>
            <p>
                在<Path>TaskRepository.kt</Path>
                檔案中，在 <code>TaskRepository</code> 物件內新增以下方法，以便根據
                任務名稱移除任務：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                開啟<Path>Routing.kt</Path>
                檔案，並在 <code>routing()</code> 函式中新增一個端點來處理 DELETE 請求：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                重新啟動應用程式。
            </p>
        </step>
        <step>
            <p>
                將以下 DELETE 請求新增到您的 HTTP 請求檔案中：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                要在 IntelliJ IDE 中傳送 DELETE 請求，請點擊其旁邊的裝訂線圖示 (<img
                    alt="IntelliJ IDEA 裝訂線圖示"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>)。
            </p>
        </step>
        <step>
            <p>您將在
                <Path>服務</Path>
                工具視窗中看到回應：
            </p>
            <img src="tutorial_creating_restful_apis_delete_task.png"
                 alt="HTTP 請求檔案中的 DELETE 請求"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="使用 Ktor 客戶端建立單元測試" id="create-unit-tests">
    <p>
        到目前為止，您一直手動測試您的應用程式，但正如您已經注意到的，這種方法既耗時又無法擴展。
        相反地，您可以實作<Links href="/ktor/server-testing" summary="了解如何使用特殊的測試引擎測試您的伺服器應用程式。">JUnit 測試</Links>，
        使用內建的
        <code>client</code> 物件來擷取和反序列化 JSON。
    </p>
    <procedure>
        <step>
            <p>
                開啟<Path>src/test/kotlin/com/example</Path>
                中的
                <Path>ApplicationTest.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                將<Path>ApplicationTest.kt</Path>
                檔案的內容替換為以下內容：
            </p>
            [object Promise]
            <p>
                請注意，您需要將 <code>ContentNegotiation</code> 和
                <code>kotlinx.serialization</code> 插件安裝到<a href="client-create-and-configure.md#plugins">插件</a>中，就像您在伺服器上所做的那樣。
            </p>
        </step>
        <step>
            <p>
                將以下依賴項新增到位於
                <Path>gradle/libs.versions.toml</Path>
                的版本目錄中：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                將新的依賴項新增到您的
                <Path>build.gradle.kts</Path>
                檔案中：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="使用 JsonPath 建立單元測試" id="unit-tests-via-jsonpath">
    <p>
        使用 Ktor 客戶端或類似函式庫測試您的服務很方便，但從品質保證（QA）的角度來看，它有一個缺點。
        伺服器未直接處理 JSON，因此無法確定其對 JSON 結構的假設是否正確。
    </p>
    <p>
        例如，以下假設：
    </p>
    <list>
        <li>實際使用<code>object</code>時，值卻儲存在<code>array</code>中。</li>
        <li>屬性被儲存為<code>numbers</code>，但實際上它們是<code>strings</code>。</li>
        <li>成員以宣告順序序列化，但實際並非如此。</li>
    </list>
    <p>
        如果您的服務旨在供多個客戶端使用，則對 JSON
        結構的信心至關重要。為此，請使用 Ktor 客戶端從伺服器擷取文字，然後使用 <a href="https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path">JSONPath</a>
        函式庫分析此內容。</p>
    <procedure>
        <step>
            <p>在您的
                <Path>build.gradle.kts</Path>
                檔案中，將 JSONPath 函式庫新增到 <code>dependencies</code> 區塊：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                導航到<Path>src/test/kotlin/com/example</Path>
                資料夾並建立一個新的
                <Path>ApplicationJsonPathTest.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                開啟<Path>ApplicationJsonPathTest.kt</Path>
                檔案並新增以下內容：
            </p>
            [object Promise]
            <p>
                JsonPath 查詢的工作方式如下：
            </p>
            <list>
                <li>
                    <code>$[*].name</code> 表示「將文件視為陣列，並返回每個條目的名稱屬性值」。
                </li>
                <li>
                    <code>$[?(@.priority == '$priority')].name</code> 表示「返回陣列中每個條目中名稱屬性的值，其優先級等於所提供的值」。
                </li>
            </list>
            <p>
                您可以使用這些查詢來確認您對返回的 JSON 的理解。當您進行程式碼
                重構和服務重新部署時，即使它們不會中斷當前框架的反序列化，序列化中的任何修改都將被識別。
                這使您能夠自信地重新發佈公開可用的 API。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        恭喜！您現在已經完成了為您的任務管理器應用程式建立 RESTful API 服務，並學習了使用 Ktor 客戶端和 JsonPath 進行單元測試的細節。</p>
    <p>
        繼續前往
        <Links href="/ktor/server-create-website" summary="了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板建立網站。">下一個教學</Links>
        ，學習如何重複使用您的 API 服務來建立網路應用程式。
    </p>
</chapter>