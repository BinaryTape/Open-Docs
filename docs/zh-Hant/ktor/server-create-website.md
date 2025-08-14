<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="使用 Ktor 在 Kotlin 中建立網站" id="server-create-website">
<tldr>
    <var name="example_name" value="tutorial-server-web-application"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">路由</Links>,
        <Links href="/ktor/server-static-content" summary="Learn how to serve static content, such as stylesheets, scripts, images, and so on.">靜態內容</Links>,
        <Links href="/ktor/server-thymeleaf" summary="Required dependencies: io.ktor:%artifact_name%
    Code example:
        %example_name%
    Native server support: ✖️">Thymeleaf</Links>
    </p>
</tldr>
<web-summary>
    了解如何使用 Ktor 和 Kotlin 建立網站。本教學課程將向您展示如何結合 Thymeleaf 模板與 Ktor 路由，在伺服器端生成基於 HTML 的使用者介面。
</web-summary>
<card-summary>
    了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中建立網站。
</card-summary>
<link-summary>
    了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中建立網站。
</link-summary>
<p>
    在本教學課程中，我們將向您展示如何使用 Ktor 和
    <a href="https://www.thymeleaf.org/">Thymeleaf</a> 模板在 Kotlin 中建立互動式網站。
</p>
<p>
    在 <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
    RESTful API that generates JSON files.">先前教學課程</Links> 中，您學習了如何建立 RESTful
    服務，我們假設該服務將由以 JavaScript 撰寫的單頁應用程式 (SPA) 消費。儘管
    這是一種非常流行的架構，但它並不適合所有專案。
</p>
<p>
    您可能希望將所有實作保留在伺服器端並僅將標記傳送至
    用戶端的原因有很多，例如：
</p>
<list>
    <li>簡潔性 - 維護單一程式碼庫。</li>
    <li>安全性 - 防止將可能向攻擊者提供資訊的資料或程式碼放置在瀏覽器上。
    </li>
    <li>
        可支援性 - 允許用戶端使用盡可能廣泛的客戶端，包括傳統瀏覽器和禁用 JavaScript 的瀏覽器。
    </li>
</list>
<p>
    Ktor 透過整合 <Links href="/ktor/server-templating" summary="Learn how to work with views built with HTML/CSS or JVM template engines.">多種伺服器頁面
    技術</Links> 來支援此方法。
</p>
<chapter title="先決條件" id="prerequisites">
    <p>
        您可以獨立完成本教學課程，但是，我們強烈建議您完成
        <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
    RESTful API that generates JSON files.">先前教學課程</Links>，以了解如何建立 RESTful API。
    </p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以使用任何您選擇的其他 IDE。
    </p>
</chapter>
<chapter title="你好，任務管理器網路應用程式" id="hello-task-manager">
    <p>
        在本教學課程中，您將把在 <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
    RESTful API that generates JSON files.">先前教學課程</Links> 中建置的任務管理器轉換為網路
        應用程式。為此，您將使用多個 Ktor <Links href="/ktor/server-plugins" summary="Plugins provide common functionality, such as serialization, content encoding, compression, and so on.">外掛程式</Links>。
    </p>
    <p>
        雖然您可以手動將這些外掛程式新增到您現有的專案中，但更簡單的方法是生成一個新專案，
        並逐步整合先前教學課程中的程式碼。我們將沿途提供所有必要的程式碼，
        因此您不需要手邊有先前的專案。
    </p>
    <procedure title="使用外掛程式建立初始專案" id="create-project">
        <step>
<p>
    前往
    <a href="https://start.ktor.io/">Ktor 專案生成器</a>
    。
</p>
        </step>
        <step>
            <p>
                在
                <control>專案構件</control>
                欄位中，輸入
                <Path>com.example.ktor-task-web-app</Path>
                作為您的專案構件名稱。
                <img src="server_create_web_app_generator_project_artifact.png"
                     alt="Ktor 專案生成器專案構件名稱"
                     style="block"
                     border-effect="line" width="706"/>
            </p>
        </step>
        <step>
            <p> 在下一個畫面中，搜尋並點擊
                <control>新增</control>
                按鈕以新增以下外掛程式：
            </p>
            <list>
                <li>Routing</li>
                <li>Static Content</li>
                <li>Thymeleaf</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif"
                     alt="在 Ktor 專案生成器中新增外掛程式"
                     border-effect="line"
                     style="block"
                     width="706"/>
                新增外掛程式後，您將看到所有
                三個外掛程式列在專案設定下方。
                <img src="server_create_web_app_generator_plugins.png"
                     alt="Ktor 專案生成器外掛程式清單"
                     style="block"
                     border-effect="line" width="706"/>
            </p>
        </step>
        <step>
<p>
    點擊
    <control>下載</control>
    按鈕以生成並下載您的 Ktor 專案。
</p>
        </step>
    </procedure>
    <procedure title="新增入門程式碼" id="add-starter-code">
        <step>
            在 IntelliJ IDEA 或您選擇的其他 IDE 中開啟您的專案。
        </step>
        <step>
            前往
            <Path>src/main/kotlin/com/example</Path>
            並建立一個名為
            <Path>model</Path>
            的子套件。
        </step>
        <step>
            在
            <Path>model</Path>
            套件內，建立一個新的
            <Path>Task.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                在
                <Path>Task.kt</Path>
                檔案中，新增一個 <code>enum</code> 來表示優先級，以及一個 <code>data class</code> 來表示
                任務：
            </p>
            [object Promise]
            <p>
                我們再次希望建立 <code>Task</code> 物件並以可顯示的形式將它們傳送給用戶端。
            </p>
            <p>
                您可能還記得：
            </p>
            <list>
                <li>
                    在 <Links href="/ktor/server-requests-and-responses" summary="Learn the basics of routing, handling requests, and parameters in Kotlin with Ktor by
        building a task manager application.">處理請求並生成回應</Links>
                    教學課程中，我們新增了手寫的擴充功能函式以將任務轉換為 HTML。
                </li>
                <li>
                    在 <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
        RESTful API that generates JSON files.">建立 RESTful API</Links> 教學課程中，我們使用
                    <code>kotlinx.serialization</code> 函式庫中的 <code>Serializable</code> 型別
                    註解了 <code>Task</code> 類別。
                </li>
            </list>
            <p>
                在此情況下，我們的目標是建立一個伺服器頁面，該頁面可以將任務內容寫入
                瀏覽器。
            </p>
        </step>
        <step>
            開啟
            <Path>plugins</Path>
            套件中的
            <Path>Templating.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                在 <code>configureTemplating()</code> 方法中，如下所示為 <code>/tasks</code> 新增路由：
            </p>
            [object Promise]
            <p>
                當伺服器收到 <code>/tasks</code> 的請求時，它會建立一個任務清單，然後
                將其傳遞給 Thymeleaf 模板。<code>ThymeleafContent</code> 型別接受我們希望觸發的
                模板名稱，以及我們希望在頁面上可存取的值表。
            </p>
            <p>
                在方法頂部的 Thymeleaf 外掛程式初始化中，您可以看到 Ktor
                將在
                <Path>templates/thymeleaf</Path>
                中尋找伺服器頁面。與靜態內容一樣，它會預期此資料夾位於
                <Path>resources</Path>
                目錄內。它還會預期一個
                <Path>.html</Path>
                副檔名。
            </p>
            <p>
                在此情況下，名稱 <code>all-tasks</code> 將映射到路徑
                <code>src/main/resources/templates/thymeleaf/all-tasks.html</code>
            </p>
        </step>
        <step>
            前往
            <Path>src/main/resources/templates/thymeleaf</Path>
            並建立一個新的
            <Path>all-tasks.html</Path>
            檔案。
        </step>
        <step>
            <p>開啟
                <Path>all-tasks.html</Path>
                檔案並新增以下內容：
            </p>
            [object Promise]
        </step>
        <step>
<p>在 IntelliJ IDEA 中，點擊執行按鈕
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="intelliJ IDEA run icon"/>)
    來啟動應用程式。</p>
        </step>
        <step>
            <p>
                在您的瀏覽器中前往 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您
                應該會看到所有目前的任務顯示在一個表格中，如下所示：
            </p>
            <img src="server_create_web_app_all_tasks.png"
                 alt="顯示任務清單的網頁瀏覽器視窗" border-effect="rounded" width="706"/>
            <p>
                像所有伺服器頁面框架一樣，Thymeleaf 模板將靜態內容（傳送給瀏覽器）
                與動態內容（在伺服器上執行）混合。如果我們選擇了替代框架，例如
                <a href="https://freemarker.apache.org/">Freemarker</a>，我們可以使用略有不同的語法提供相同的功能。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="新增 GET 路由" id="add-get-routes">
    <p>既然您已熟悉請求伺服器頁面的過程，請繼續將
        先前教學課程中的功能轉移到此教學課程中。</p>
    <p>因為您包含了
        <control>靜態內容</control>
        外掛程式，以下程式碼將會出現在
        <Path>Routing.kt</Path>
        檔案中：
    </p>
    [object Promise]
    <p>
        這表示，例如，對 <code>/static/index.html</code> 的請求將會從
        以下路徑提供內容：
    </p>
    <code>src/main/resources/static/index.html</code>
    <p>
        由於此檔案已是生成專案的一部分，您可以將其用作您希望新增功能的
        主頁。
    </p>
    <procedure title="重複使用首頁">
        <step>
            <p>
                開啟
                <Path>src/main/resources/static</Path>
                中的
                <Path>index.html</Path>
                檔案，並將其內容替換為以下實作：
            </p>
            [object Promise]
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA rerun icon"/>) 來重新啟動
    應用程式。
</p>
        </step>
        <step>
            <p>
                在您的瀏覽器中前往 <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a>
                。您應該會看到一個連結按鈕和三個 HTML 表單，
                這些表單允許您檢視、篩選和建立任務：
            </p>
            <img src="server_create_web_app_tasks_form.png"
                 alt="顯示 HTML 表單的網頁瀏覽器" border-effect="rounded" width="706"/>
            <p>
                請注意，當您按 <code>name</code> 或 <code>priority</code> 篩選任務時，您是
                透過 GET 請求提交 HTML 表單。這表示參數將會新增到 URL 後面的
                查詢字串中。
            </p>
            <p>
                例如，如果您搜尋 <code>Medium</code> 優先級的任務，這就是將
                傳送給伺服器的請求：
            </p>
            <code>http://localhost:8080/tasks/byPriority?priority=Medium</code>
        </step>
    </procedure>
    <procedure title="重複使用 TaskRepository" id="task-repository">
        <p>
            任務的儲存庫可以與先前教學課程中的儲存庫保持相同。
        </p>
        <p>
            在
            <Path>model</Path>
            套件內建立一個新的
            <Path>TaskRepository.kt</Path>
            檔案並新增以下程式碼：
        </p>
        [object Promise]
    </procedure>
    <procedure title="重複使用 GET 請求的路由" id="reuse-routes">
        <p>
            既然您已建立儲存庫，您就可以實作 GET 請求的路由。
        </p>
        <step>
            前往
            <Path>src/main/kotlin/com/example/plugins</Path>
            中的
            <Path>Templating.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                將目前版本的 <code>configureTemplating()</code> 替換為以下實作：
            </p>
            [object Promise]
            <p>
                上述程式碼可以概括如下：
            </p>
            <list>
                <li>
                    在對 <code>/tasks</code> 的 GET 請求中，伺服器從
                    儲存庫中檢索所有任務，並使用
                    <Path>all-tasks</Path>
                    模板生成傳送給瀏覽器的下一個視圖。
                </li>
                <li>
                    在對 <code>/tasks/byName</code> 的 GET 請求中，伺服器從 <code>queryString</code> 中檢索參數
                    <code>taskName</code>，找到匹配的任務，並使用
                    <Path>single-task</Path>
                    模板生成傳送給瀏覽器的下一個視圖。
                </li>
                <li>
                    在對 <code>/tasks/byPriority</code> 的 GET 請求中，伺服器從
                    <code>queryString</code> 中檢索參數
                    <code>priority</code>，找到匹配的任務，並使用
                    <Path>tasks-by-priority</Path>
                    模板生成傳送給瀏覽器的下一個視圖。
                </li>
            </list>
            <p>為了使這一切正常運作，您需要新增額外的模板。</p>
        </step>
        <step>
            前往
            <Path>src/main/resources/templates/thymeleaf</Path>
            並建立一個新的
            <Path>single-task.html</Path>
            檔案。
        </step>
        <step>
            <p>
                開啟
                <Path>single-task.html</Path>
                檔案並新增以下內容：
            </p>
            [object Promise]
        </step>
        <step>
            <p>在同一個資料夾中，建立一個名為
                <Path>tasks-by-priority.html</Path>
                的新檔案。
            </p>
        </step>
        <step>
            <p>
                開啟
                <Path>tasks-by-priority.html</Path>
                檔案並新增以下內容：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="新增對 POST 請求的支援" id="add-post-requests">
    <p>
        接下來，您將為 <code>/tasks</code> 新增一個 POST 請求處理器，以執行以下操作：
    </p>
    <list>
        <li>從表單參數中提取資訊。</li>
        <li>使用儲存庫新增一個任務。</li>
        <li>透過重複使用
            <control>all-tasks</control>
            模板來顯示任務。
        </li>
    </list>
    <procedure>
        <step>
            前往
            <Path>src/main/kotlin/com/example/plugins</Path>
            中的
            <Path>Templating.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                在 <code>configureTemplating()</code>
                方法中新增以下 <code>post</code> 請求路由：
            </p>
            [object Promise]
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA rerun icon"/>) 來重新啟動
    應用程式。
</p>
        </step>
        <step>
            在您的瀏覽器中前往 <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
        </step>
        <step>
            <p>
                在
                <control>建立或編輯任務</control>
                表單中輸入新的任務詳細資訊。
            </p>
            <img src="server_create_web_app_new_task.png"
                 alt="顯示 HTML 表單的網頁瀏覽器" border-effect="rounded" width="706"/>
        </step>
        <step>
            <p>點擊
                <control>提交</control>
                按鈕以提交表單。
                您將看到新任務顯示在所有任務的清單中：
            </p>
            <img src="server_create_web_app_new_task_added.png"
                 alt="顯示任務清單的網頁瀏覽器" border-effect="rounded" width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="下一步" id="next-steps">
    <p>
        恭喜！您現在已完成將任務管理器重建為網路應用程式，並
        學習了如何利用 Thymeleaf 模板。</p>
    <p>
        繼續進行 <Links href="/ktor/server-create-websocket-application" summary="Learn how to harness the power of WebSockets to send and receive content.">下一個教學課程</Links>，了解如何使用
        Web Sockets。
    </p>
</chapter>
</topic>