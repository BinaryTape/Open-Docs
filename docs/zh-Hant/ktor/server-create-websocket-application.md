<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="在 Kotlin 中使用 Ktor 建立 WebSocket 應用程式" id="server-create-websocket-application">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-websockets"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="Routing 是一個用於處理伺服器應用程式中傳入請求的核心外掛程式。">Routing</Links>,<Links href="/ktor/server-static-content" summary="了解如何提供靜態內容，例如樣式表、腳本、圖片等。">Static Content</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個用途：協商客戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>, <Links href="/ktor/server-websockets" summary="WebSockets 外掛程式允許您在伺服器和客戶端之間建立多向通訊會話。">WebSockets in Ktor Server</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
    </p>
</tldr>
<card-summary>
    了解如何利用 WebSocket 的強大功能來傳送和接收內容。
</card-summary>
<link-summary>
    了解如何利用 WebSocket 的強大功能來傳送和接收內容。
</link-summary>
<web-summary>
    了解如何使用 Kotlin 和 Ktor 建立 WebSocket 應用程式。本教學將引導您完成透過 WebSocket 將後端服務與客戶端連接的過程。
</web-summary>
<p>
    本文將引導您完成使用 Kotlin 和 Ktor 建立 WebSocket 應用程式的過程。它是基於
    <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links>教學中涵蓋的內容。
</p>
<p>本文將教您如何執行以下操作：</p>
<list>
    <li>建立使用 JSON 序列化的服務。</li>
    <li>透過 WebSocket 連線傳送和接收內容。</li>
    <li>同時向多個客戶端廣播內容。</li>
</list>
<chapter title="先決條件" id="prerequisites">
    <p>您可以獨立完成本教學，然而，我們建議您完成
        <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links>教學，以熟悉 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個用途：協商客戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>和 REST。
    </p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以使用您選擇的其他 IDE。
    </p>
</chapter>
<chapter title="WebSockets 初體驗" id="hello-websockets">
    <p>
        在本教學中，您將在<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links>教學中開發的 Task Manager 服務基礎上進行擴展，透過 WebSocket 連線增加與客戶端交換 <code>Task</code> 物件的功能。為此，您需要新增<Links href="/ktor/server-websockets" summary="WebSockets 外掛程式允許您在伺服器和客戶端之間建立多向通訊會話。">WebSockets
        外掛程式</Links>。雖然您可以手動將其新增到現有專案中，但為了本教學的目的，我們將從頭開始建立一個新專案。
    </p>
    <chapter title="使用外掛程式建立初始專案" id="create=project">
        <procedure>
            <step>
<p>
    導覽至
    <a href="https://start.ktor.io/">Ktor 專案產生器</a>
    。
</p>
            </step>
            <step>
                <p>在
                    <control>專案 artifact</control>
                    欄位中，輸入
                    <Path>com.example.ktor-websockets-task-app</Path>
                    作為您的專案 artifact 名稱。
                    <img src="tutorial_server_websockets_project_artifact.png"
                         alt="在 Ktor 專案產生器中命名專案 artifact"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    在外掛程式部分搜尋並透過點擊
                    <control>新增</control>
                    按鈕新增以下外掛程式：
                </p>
                <list type="bullet">
                    <li>Routing</li>
                    <li>Content Negotiation</li>
                    <li>Kotlinx.serialization</li>
                    <li>WebSockets</li>
                    <li>Static Content</li>
                </list>
                <p>
                    <img src="ktor_project_generator_add_plugins.gif"
                         alt="在 Ktor 專案產生器中新增外掛程式"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    新增外掛程式後，點擊外掛程式部分右上角的
                    <control>5 個外掛程式</control>
                    按鈕，以顯示已新增的外掛程式。
                </p>
                <p>您將看到所有將新增到您專案中的外掛程式列表：
                    <img src="tutorial_server_websockets_project_plugins.png"
                         alt="Ktor 專案產生器中的外掛程式列表"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
<p>
    點擊
    <control>下載</control>
    按鈕以產生並下載您的 Ktor 專案。
</p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增啟動程式碼" id="add-starter-code">
        <p>下載完成後，在 IntelliJ IDEA 中開啟您的專案，並依照以下步驟操作：</p>
        <procedure>
            <step>
                導覽至
                <Path>src/main/kotlin</Path>
                並建立一個名為
                <Path>model</Path>
                的新子套件。
            </step>
            <step>
                <p>
                    在
                    <Path>model</Path>
                    套件內建立一個新的
                    <Path>Task.kt</Path>
                    檔案。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>Task.kt</Path>
                    檔案，並新增一個 <code>enum</code> 來表示優先級，以及一個 <code>data class</code> 來
                    表示任務：
                </p>
                [object Promise]
                <p>
                    請注意，<code>Task</code> 類別使用
                    <code>kotlinx.serialization</code>
                    函式庫中的 <code>Serializable</code> 型別進行註解。這表示實例可以在 JSON 和 JSON 之間進行轉換，允許其內容透過網路傳輸。
                </p>
                <p>
                    由於您包含了 WebSockets 外掛程式，一個
                    <Path>Sockets.kt</Path>
                    檔案已在
                    <Path>src/main/kotlin/com/example/plugins</Path>
                    中產生。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>Sockets.kt</Path>
                    檔案，並將現有的 <code>Application.configureSockets()</code> 函式替換為以下實作：
                </p>
                [object Promise]
                <p>
                    在此程式碼中，執行了以下步驟：
                </p>
                <list type="decimal">
                    <li>WebSockets 外掛程式已安裝並配置標準設定。</li>
                    <li>設定了 <code>contentConverter</code> 屬性，使外掛程式能夠透過 <a
                            href="https://github.com/Kotlin/kotlinx.serialization">kotlinx.serialization</a>
                        函式庫序列化傳送和接收的物件。
                    </li>
                    <li>路由配置了一個單一的端點，相對 URL 為 <code>/tasks</code>。
                    </li>
                    <li>收到請求後，任務列表將透過 WebSocket 連線序列化。</li>
                    <li>一旦所有項目傳送完畢，伺服器將關閉連線。</li>
                </list>
                <p>
                    為了演示目的，在傳送任務之間引入了一秒的延遲。這
                    讓我們能夠觀察到任務在客戶端中逐步出現。如果沒有這個延遲，
                    範例將與之前文章中開發的<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。">RESTful
                    服務</Links>和<Links href="/ktor/server-create-website" summary="了解如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板建立網站。">Web 應用程式</Links>相同。
                </p>
                <p>
                    此迭代的最後一步是為此端點建立一個客戶端。由於您包含了
                    <Links href="/ktor/server-static-content" summary="了解如何提供靜態內容，例如樣式表、腳本、圖片等。">Static Content</Links> 外掛程式，因此一個
                    <Path>index.html</Path>
                    檔案已在
                    <Path>src/main/resources/static</Path>
                    中產生。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>index.html</Path>
                    檔案，並將現有內容替換為以下內容：
                </p>
                [object Promise]
                <p>
                    此頁面使用所有現代瀏覽器中都可用的 <a href="https://websockets.spec.whatwg.org//#websocket">WebSocket 型別</a>。我們在 JavaScript 中建立此物件，將端點的 URL 傳入其建構函式。隨後，我們為
                    <code>onopen</code>、<code>onclose</code>、
                    和 <code>onmessage</code> 事件附加事件處理器。觸發 <code>onmessage</code> 事件時，我們使用 document 物件的方法向表格附加一行。
                </p>
            </step>
            <step>
<p>在 IntelliJ IDEA 中，點擊執行按鈕
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="intelliJ IDEA 執行圖示"/>)
    以啟動應用程式。</p>
            </step>
            <step>
                <p>
                    導覽至 <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                    您應該會看到一個帶有按鈕和空表格的表單：
                </p>
                <img src="tutorial_server_websockets_iteration_1.png"
                     alt="顯示帶有一個按鈕的 HTML 表單的網頁"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    當您點擊表單時，任務應該會從伺服器載入，以每秒一個的速度出現。因此，表格應該會逐步填充。您也可以透過在瀏覽器的
                    <control>開發者工具</control>
                    中開啟
                    <control>JavaScript Console</control>
                    來檢視記錄的訊息。
                </p>
                <img src="tutorial_server_websockets_iteration_1_click.gif"
                     alt="顯示點擊按鈕後列表項目的網頁"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    透過此操作，您可以看到服務正在按預期執行。WebSocket 連線已開啟，項目已傳送到客戶端，然後連線關閉。底層網路有許多複雜性，但 Ktor 預設會處理所有這些。
                </p>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="了解 WebSockets" id="understanding-websockets">
    <p>
        在進入下一個迭代之前，回顧一些 WebSockets 的基本原理可能會有所幫助。
        如果您已經熟悉 WebSockets，您可以繼續<a href="#improve-design">改進您的服務設計</a>。
    </p>
    <p>
        在先前的教學中，您的客戶端會傳送 HTTP 請求並接收 HTTP 回應。這運作良好
        並使網際網路具有可擴展性和彈性。
    </p>
    <p>然而，它不適用於以下場景：</p>
    <list>
        <li>內容隨著時間逐步產生。</li>
        <li>內容經常因應事件而變化。</li>
        <li>客戶端需要在內容產生時與伺服器互動。</li>
        <li>一個客戶端傳送的資料需要快速傳播給其他客戶端。</li>
    </list>
    <p>
        這些場景的範例包括股票交易、購買電影和音樂會門票、線上拍賣競標以及社群媒體中的聊天功能。WebSockets 的開發就是為了處理這些情況。
    </p>
    <p>
        WebSocket 連線是透過 TCP 建立的，並且可以持續很長一段時間。該連線提供
        「全雙工通訊」，這表示客戶端可以同時向伺服器傳送訊息並從伺服器接收訊息。
    </p>
    <p>
        WebSocket API 定義了四個事件（open、message、close 和 error）和兩個動作（send 和 close）。
        如何存取此功能因不同的語言和函式庫而異。
        例如，在 Kotlin 中，您可以將傳入訊息序列作為 <a
            href="https://kotlinlang.org/docs/flow.html">Flow</a>來消費。
    </p>
</chapter>
<chapter title="改進設計" id="improve-design">
    <p>接下來，您將重構現有程式碼，為更進階的範例騰出空間。</p>
    <procedure>
        <step>
            <p>
                在
                <Path>model</Path>
                套件中，建立一個新的
                <Path>TaskRepository.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                開啟
                <Path>TaskRepository.kt</Path>
                並新增一個 <code>TaskRepository</code> 型別：
            </p>
            [object Promise]
            <p>您可能會回想起先前教學中的這段程式碼。</p>
        </step>
        <step>
            導覽至
            <Path>plugins</Path>
            套件並開啟
            <Path>Sockets.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                現在您可以透過利用
                <code>TaskRepository</code>
                來簡化 <code>Application.configureSockets()</code> 中的路由：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="透過 WebSockets 傳送訊息" id="send-messages">
    <p>
        為了展示 WebSockets 的強大功能，您將建立一個新的端點，其中：
    </p>
    <list>
        <li>
            當客戶端啟動時，它會收到所有現有任務。
        </li>
        <li>
            客戶端可以建立和傳送任務。
        </li>
        <li>
            當一個客戶端傳送任務時，其他客戶端會收到通知。
        </li>
    </list>
    <procedure>
        <step>
            <p>
                在
                <Path>Sockets.kt</Path>
                檔案中，將目前的 <code>configureSockets()</code> 方法替換為以下實作：
            </p>
            [object Promise]
            <p>透過這段程式碼，您已完成以下操作：</p>
            <list>
                <li>
                    將傳送所有現有任務的功能重構為一個輔助方法。
                </li>
                <li>
                    在 <code>routing</code> 部分，您建立了一個執行緒安全的 <code>session</code>
                    物件列表，以追蹤所有客戶端。
                </li>
                <li>
                    新增了一個相對 URL 為 <code>/task2</code> 的新端點。當客戶端連接到
                    此端點時，相應的 <code>session</code> 物件會新增到列表中。然後伺服器
                    進入一個無限循環，等待接收新任務。收到新任務後，伺服器會將其儲存在儲存庫中，並將副本傳送給所有客戶端，包括目前的客戶端。
                </li>
            </list>
            <p>
                為了測試此功能，您將建立一個新頁面，以擴展
                <Path>index.html</Path>
                中的功能。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>src/main/resources/static</Path>
                中建立一個名為
                <Path>wsClient.html</Path>
                的新 HTML 檔案。
            </p>
        </step>
        <step>
            <p>
                開啟
                <Path>wsClient.html</Path>
                並新增以下內容：
            </p>
            [object Promise]
            <p>
                這個新頁面引入了一個 HTML 表單，使用者可以在其中輸入新任務的資訊。
                提交表單後，會呼叫 <code>sendTaskToServer</code> 事件處理器。這會用表單資料建立一個
                JavaScript 物件，並使用 WebSocket 物件的
                <code>send</code> 方法將其傳送給伺服器。
            </p>
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="intelliJ IDEA 重新執行圖示"/>) 以重新啟動應用程式。
</p>
        </step>
        <step>
            <p>為了測試此功能，請並排開啟兩個瀏覽器並依照以下步驟操作。</p>
            <list type="decimal">
                <li>
                    在瀏覽器 A 中，導覽至
                    <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>
                    。您應該會看到預設任務。
                </li>
                <li>
                    在瀏覽器 A 中新增一個任務。新任務應該會出現在該頁面的表格中。
                </li>
                <li>
                    在瀏覽器 B 中，導覽至
                    <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>
                    。您應該會看到預設任務，以及您在瀏覽器 A 中新增的任何新任務。
                </li>
                <li>
                    在任一瀏覽器中新增一個任務。您應該會看到新項目出現在兩個頁面上。
                </li>
            </list>
            <img src="tutorial_server_websockets_iteration_2_test.gif"
                 alt="兩個網頁並排顯示，透過 HTML 表單演示建立新任務"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="新增自動化測試" id="add-automated-tests">
    <p>
        為了簡化您的 QA 流程並使其快速、可重現且自動化，您可以使用 Ktor 內建的
        <Links href="/ktor/server-testing" summary="了解如何使用特殊的測試引擎測試您的伺服器應用程式。">自動化測試支援</Links>。請依照以下步驟操作：
    </p>
    <procedure>
        <step>
            <p>
                將以下依賴項新增到
                <Path>build.gradle.kts</Path>
                中，以允許您配置 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個用途：協商客戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>
                在 Ktor 客戶端內的支援：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
<p>在 IntelliJ IDEA 中，點擊通知 Gradle 圖示
    (<img alt="intelliJ IDEA Gradle 圖示"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    在編輯器右側以載入 Gradle 變更。</p>
            </p>
        </step>
        <step>
            <p>
                導覽至
                <Path>src/test/kotlin/com/example</Path>
                並開啟
                <Path>ApplicationTest.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                將生成的測試類別替換為以下實作：
            </p>
            [object Promise]
            <p>
                透過此設定，您：
            </p>
            <list>
                <li>
                    配置您的服務在測試環境中運行，並啟用與生產環境中相同的功能，包括 Routing、JSON 序列化和 WebSockets。
                </li>
                <li>
                    在<Links href="/ktor/client-create-and-configure" summary="了解如何建立和配置 Ktor 客戶端。">Ktor 客戶端</Links>中配置 Content Negotiation 和 WebSocket 支援。如果沒有這個，客戶端將不知道在使用 WebSocket 連線時如何將物件序列化/反序列化為 JSON。
                </li>
                <li>
                    宣告您期望服務傳回的 <code>Tasks</code> 列表。
                </li>
                <li>
                    使用客戶端物件的 <code>websocket</code> 方法向
                    <code>/tasks</code>
                    傳送請求。
                </li>
                <li>
                    將傳入的任務作為 <code>flow</code> 消費，逐步將它們新增到列表中。
                </li>
                <li>
                    一旦所有任務都已接收，按照常規方式比較 <code>expectedTasks</code> 與 <code>actualTasks</code>
                    。
                </li>
            </list>
        </step>
    </procedure>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        做得好！透過整合 WebSocket 通訊和使用 Ktor 客戶端進行自動化測試，您已顯著增強了 Task Manager 服務。
    </p>
    <p>
        繼續前往
        <Links href="/ktor/server-integrate-database" summary="了解如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫的過程。">下一個教學</Links>
        ，探索您的服務如何使用 Exposed 函式庫與關聯式資料庫無縫互動。
    </p>
</chapter>