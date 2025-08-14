<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="整合資料庫與 Kotlin、Ktor 和 Exposed" id="server-integrate-database">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-db-integration"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="路由（Routing）是伺服器應用程式中用於處理傳入請求的核心外掛程式。">Routing</Links>,<Links href="/ktor/server-static-content" summary="了解如何提供靜態內容，例如樣式表、腳本、圖片等。">Static Content</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>, <Links href="/ktor/server-status-pages" summary="%plugin_name% 允許 Ktor 應用程式根據拋出的例外或狀態碼，對任何失敗狀態做出適當回應。">Status pages</Links>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">kotlinx.serialization</Links>,
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md">Exposed</a>,
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md">Postgres</a>
    </p>
</tldr>
<card-summary>
    了解如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。
</card-summary>
<link-summary>
    了解如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。
</link-summary>
<web-summary>
    了解如何使用 Kotlin 和 Ktor 建置單頁應用程式（SPA），其中 RESTful 服務連結到資料庫儲存庫。它使用 Exposed SQL 函式庫，並允許您為測試偽造儲存庫。
</web-summary>
<p>
    在本文中，您將學習如何使用 Kotlin 的 SQL 函式庫 <a
        href="https://github.com/JetBrains/Exposed">Exposed</a>，將您的 Ktor 服務與關聯式資料庫整合。
</p>
<p>完成本教學後，您將學習如何執行以下操作：</p>
<list>
    <li>建立使用 JSON 序列化的 RESTful 服務。</li>
    <li>將不同的儲存庫注入這些服務。</li>
    <li>使用偽造儲存庫為您的服務建立單元測試。</li>
    <li>使用 Exposed 和依賴注入 (DI) 建置可運作的儲存庫。</li>
    <li>部署存取外部資料庫的服務。</li>
</list>
<p>
    在先前的教學中，我們使用任務管理器範例來涵蓋基礎知識，例如 <Links href="/ktor/server-requests-and-responses" summary="了解如何使用 Ktor 在 Kotlin 中進行路由、處理請求和參數，建置一個任務管理器應用程式。">處理請求</Links>、
    <Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建置後端服務，其中包含生成 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links> 或
    <Links href="/ktor/server-create-website" summary="學習如何使用 Kotlin、Ktor 和 Thymeleaf 模板建置網站。">使用 Thymeleaf 模板建置 Web 應用程式</Links>。
    雖然這些教學著重於使用簡單的記憶體內 <code>TaskRepository</code> 的前端功能，但本指南將重點轉移到展示您的 Ktor 服務如何透過
    <a href="https://github.com/JetBrains/Exposed">Exposed SQL 函式庫</a>與關聯式資料庫互動。
</p>
<p>
    即使本指南更長且更複雜，您仍將快速生成可運行的程式碼並逐步引入新功能。
</p>
<p>本指南將分為兩個部分：</p>
<list type="decimal">
    <li>
        <a href="#create-restful-service-and-repository">使用記憶體內儲存庫建立您的應用程式。</a>
    </li>
    <li>
        <a href="#add-postgresql-repository">將記憶體內儲存庫替換為使用 PostgreSQL 的儲存庫。</a>
    </li>
</list>
<chapter title="先決條件" id="prerequisites">
    <p>
        您可以獨立完成本教學，但我們建議您完成<Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建置後端服務，其中包含生成 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links> 教學，以熟悉 Content
        Negotiation 和 REST。
    </p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以使用您選擇的其他 IDE。
    </p>
</chapter>
<chapter title="建立 RESTful 服務和記憶體內儲存庫" id="create-restful-service-and-repository">
    <p>
        首先，您將重新建立您的任務管理器 RESTful 服務。最初，這將使用記憶體內儲存庫，但您將設計一種結構，使其可以最小的努力進行替換。
    </p>
    <p>您將分六個階段進行：</p>
    <list type="decimal">
        <li>
            <a href="#create-project">建立初始專案。</a>
        </li>
        <li>
            <a href="#add-starter-code">新增入門程式碼。</a>
        </li>
        <li>
            <a href="#add-routes">新增 CRUD 路由。</a>
        </li>
        <li>
            <a href="#add-client-page">新增單頁應用程式 (SPA)。</a>
        </li>
        <li>
            <a href="#test-manually">手動測試應用程式。</a>
        </li>
        <li>
            <a href="#add-automated-tests">新增自動化測試。</a>
        </li>
    </list>
    <chapter title="建立包含外掛程式的新專案" id="create-project">
        <p>
            若要使用 Ktor 專案產生器建立新專案，請遵循以下步驟：
        </p>
        <procedure id="create-project-procedure">
            <step>
<p>
    導覽至
    <a href="https://start.ktor.io/">Ktor 專案產生器</a>
    。
</p>
            </step>
            <step>
                <p>在
                    <control>Project artifact</control>
                    欄位中，輸入
                    <Path>com.example.ktor-exposed-task-app</Path>
                    作為您的專案構件名稱。
                    <img src="tutorial_server_db_integration_project_artifact.png"
                         alt="在 Ktor 專案產生器中命名專案構件"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    在外掛程式部分搜尋並透過點擊
                    <control>Add</control>
                    按鈕新增以下外掛程式：
                </p>
                <list type="bullet">
                    <li>Routing</li>
                    <li>Content Negotiation</li>
                    <li>Kotlinx.serialization</li>
                    <li>Static Content</li>
                    <li>Status Pages</li>
                    <li>Exposed</li>
                    <li>Postgres</li>
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
                    新增外掛程式後，點擊外掛程式部分右上方的
                    <control>7 plugins</control>
                    按鈕以查看已新增的外掛程式。
                </p>
                <p>您將看到將新增到您的專案中的所有外掛程式清單：
                    <img src="tutorial_server_db_integration_plugin_list.png"
                         alt="Ktor 專案產生器中的外掛程式下拉選單"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
<p>
    點擊
    <control>Download</control>
    按鈕以生成並下載您的 Ktor 專案。
</p>
            </step>
            <step>
                <p>
                    在
                    <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
                        IDEA</a> 或您選擇的其他 IDE 中開啟生成的專案。
                </p>
            </step>
            <step>
                <p>
                    導覽至
                    <Path>src/main/kotlin/com/example</Path>
                    並刪除檔案
                    <Path>CitySchema.kt</Path>
                    和
                    <Path>UsersSchema.kt</Path>
                    。
                </p>
            </step>
            <step id="delete-function">
                <p>
                    開啟
                    <Path>Databases.kt</Path>
                    檔案並移除 <code>configureDatabases()</code> 函式的內容。
                </p>
                [object Promise]
                <p>
                    移除此功能的原因是 Ktor 專案產生器已新增範例程式碼，以展示如何將使用者和城市的資料持久化到 HSQLDB 或 PostgreSQL。您在本教學中將不需要該範例程式碼。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增入門程式碼" id="add-starter-code">
        <procedure id="add-starter-code-procedure">
            <step>
                導覽至
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
                    開啟
                    <Path>Task.kt</Path>
                    並新增一個 <code>enum</code> 來表示優先順序，以及一個 <code>class</code> 來表示任務。
                </p>
                [object Promise]
                <p>
                    <code>Task</code> 類別使用來自 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">kotlinx.serialization</Links> 函式庫的 <code>Serializable</code> 類型進行註解。
                </p>
                <p>
                    如同先前的教學，您將建立一個記憶體內儲存庫。然而，這次儲存庫將實作一個 <code>interface</code>，以便您之後可以輕鬆替換它。
                </p>
            </step>
            <step>
                在
                <Path>model</Path>
                子套件中，建立一個新的
                <Path>TaskRepository.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    開啟
                    <Path>TaskRepository.kt</Path>
                    並新增以下 <code>interface</code>：
                </p>
                [object Promise]
            </step>
            <step>
                在同一目錄內建立一個新的
                <Path>FakeTaskRepository.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    開啟
                    <Path>FakeTaskRepository.kt</Path>
                    並新增以下 <code>class</code>：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="新增路由" id="add-routes">
        <procedure id="add-routes-procedure">
            <step>
                開啟
                <Path>src/main/kotlin/com/example</Path>
                中的
                <Path>Serialization.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    將現有的 <code>Application.configureSerialization()</code> 函式替換為以下實作：
                </p>
                [object Promise]
                <p>
                    這與您在 <Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建置後端服務，其中包含生成 JSON 檔案的 RESTful API 範例。">建立
                    RESTful API</Links> 教學中實作的路由相同，不同之處在於您現在將儲存庫作為參數傳遞給
                    <code>routing()</code> 函式。由於參數的類型是 <code>interface</code>，因此可以注入許多不同的實作。
                </p>
                <p>
                    現在您已將參數新增到 <code>configureSerialization()</code>，現有的呼叫將無法再編譯。幸運的是，此函式僅被呼叫一次。
                </p>
            </step>
            <step>
                開啟
                <Path>src/main/kotlin/com/example</Path>
                中的
                <Path>Application.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    將 <code>module()</code> 函式替換為以下實作：
                </p>
                [object Promise]
                <p>
                    您現在將 <code>FakeTaskRepository</code> 的實例注入到
                    <code>configureSerialization()</code> 中。長遠目標是能夠將其替換為 <code>PostgresTaskRepository</code>。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增客戶端頁面" id="add-client-page">
        <procedure id="add-client-page-procedure">
            <step>
                開啟
                <Path>src/main/resources/static</Path>
                中的
                <Path>index.html</Path>
                檔案。
            </step>
            <step>
                <p>
                    將當前內容替換為以下實作：
                </p>
                [object Promise]
                <p>
                    這與先前教學中使用的 SPA 相同。因為它是用 JavaScript 編寫的，並且只使用瀏覽器中可用的函式庫，所以您無需擔心客戶端依賴項。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="手動測試應用程式" id="test-manually">
        <procedure id="test-manually-procedure">
            <p>
                因為第一次迭代使用記憶體內儲存庫而不是連接到資料庫，您需要確保應用程式已正確配置。
            </p>
            <step>
                <p>
                    導覽至
                    <Path>src/main/resources/application.yaml</Path>
                    並移除 <code>postgres</code> 配置。
                </p>
                [object Promise]
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
                    在您的瀏覽器中導覽至 <a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。您應該會看到客戶端頁面，其中包含三個表單和一個顯示過濾結果的表格。
                </p>
                <img src="tutorial_server_db_integration_index_page.png"
                     alt="顯示任務管理器客戶端的瀏覽器視窗"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    透過使用
                    <control>Go</control>
                    按鈕填寫並提交表單來測試應用程式。使用表格項目上的
                    <control>View</control>
                    和
                    <control>Delete</control>
                    按鈕。
                </p>
                <img src="tutorial_server_db_integration_manual_test.gif"
                     alt="顯示任務管理器客戶端的瀏覽器視窗"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增自動化單元測試" id="add-automated-tests">
        <procedure id="add-automated-tests-procedure">
            <step>
                <p>
                    開啟
                    <Path>ApplicationTest.kt</Path>
                    在
                    <Path>src/test/kotlin/com/example</Path>
                    中，並新增以下測試：
                </p>
                [object Promise]
                <p>
                    為了讓這些測試編譯和執行，您將需要為 Ktor Client 新增對 <a
                        href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html">Content
                    Negotiation</a>
                    外掛程式的依賴項。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>gradle/libs.versions.toml</Path>
                    檔案並指定以下函式庫：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    開啟
                    <Path>build.gradle.kts</Path>
                    並新增以下依賴項：
                </p>
                [object Promise]
            </step>
            <step>
<p>在 IntelliJ IDEA 中，點擊通知 Gradle 圖示
    (<img alt="IntelliJ IDEA Gradle 圖示"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    在編輯器右側以載入 Gradle 變更。</p>
            </step>
            <step>
<p>在 IntelliJ IDEA 中，點擊執行按鈕
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="IntelliJ IDEA 執行圖示"/>)
    在測試類別定義旁邊以執行測試。</p>
                <p>您應該會看到測試在
                    <control>Run</control>
                    窗格中成功執行。
                </p>
                <img src="tutorial_server_db_integration_test_results.png"
                     alt="IntelliJ IDEA 執行窗格中顯示的成功測試結果"
                     border-effect="line"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="新增 PostgreSQL 儲存庫" id="add-postgresql-repository">
    <p>
        現在您有一個使用記憶體內資料的運作中應用程式，下一步是將資料儲存外部化到 PostgreSQL 資料庫。
    </p>
    <p>
        您將透過執行以下操作來實現這一點：
    </p>
    <list type="decimal">
        <li><a href="#create-schema">在 PostgreSQL 中建立資料庫綱要。</a></li>
        <li><a href="#adapt-repo">調整 <code>TaskRepository</code> 以進行非同步存取。</a></li>
        <li><a href="#config-db-connection">在應用程式中配置資料庫連接。</a></li>
        <li><a href="#create-mapping">將 <code>Task</code> 類型對應到相關的資料庫表格。</a></li>
        <li><a href="#create-new-repo">根據此對應建立新的儲存庫。</a></li>
        <li><a href="#switch-repo">在啟動程式碼中切換到這個新的儲存庫。</a></li>
    </list>
    <chapter title="建立資料庫綱要" id="create-schema">
        <procedure id="create-schema-procedure">
            <step>
                <p>
                    使用您選擇的資料庫管理工具，在 PostgreSQL 中建立一個新的資料庫。
                    名稱不重要，只要您記住它即可。在此範例中，我們將使用
                    <Path>ktor_tutorial_db</Path>
                    。
                </p>
                <tip>
                    <p>
                        有關 PostgreSQL 的更多資訊，請參閱<a
                            href="https://www.postgresql.org/docs/current/">官方文件</a>。
                    </p>
                    <p>
                        在 IntelliJ IDEA 中，您可以使用資料庫工具來<a
                            href="https://www.jetbrains.com/help/idea/postgresql.html">連接和管理您的
                        PostgreSQL
                        資料庫。</a>
                    </p>
                </tip>
            </step>
            <step>
                <p>
                    對您的資料庫執行以下 SQL 命令。這些命令將建立並填充資料庫綱要：
                </p>
                [object Promise]
                <p>
                    請注意以下事項：
                </p>
                <list>
                    <li>
                        您正在建立一個名為
                        <Path>task</Path>
                        的單一表格，其中包含用於
                        <Path>name</Path>
                        、
                        <Path>description</Path>
                        和
                        <Path>priority</Path>
                        的欄位。這些欄位需要對應到 <code>Task</code> 類別的屬性。
                    </li>
                    <li>
                        如果表格已存在，您將重新建立它，因此您可以重複執行此腳本。
                    </li>
                    <li>
                        還有一個額外的欄位名為
                        <Path>id</Path>
                        ，其類型為 <code>SERIAL</code>。這將是一個整數值，用於為每行提供其主鍵。這些值將由資料庫為您分配。
                    </li>
                </list>
            </step>
        </procedure>
    </chapter>
    <chapter title="調整現有儲存庫" id="adapt-repo">
        <procedure id="adapt-repo-procedure">
            <p>
                當對資料庫執行查詢時，最好讓它們非同步運行，以避免阻塞處理 HTTP 請求的執行緒。在 Kotlin 中，這最好透過 <a
                    href="https://kotlinlang.org/docs/coroutines-overview.html">協程</a>來管理。
            </p>
            <step>
                <p>
                    開啟
                    <Path>src/main/kotlin/com/example/model</Path>
                    中的
                    <Path>TaskRepository.kt</Path>
                    檔案。
                </p>
            </step>
            <step>
                <p>
                    將 <code>suspend</code> 關鍵字新增到所有介面方法：
                </p>
                [object Promise]
                <p>
                    這將允許介面方法的實作在不同的 Coroutine Dispatcher 上啟動工作任務。
                </p>
                <p>
                    您現在需要調整 <code>FakeTaskRepository</code> 的方法以匹配，儘管您不需要在該實作中切換 Dispatcher。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>FakeTaskRepository.kt</Path>
                    檔案並將 <code>suspend</code> 關鍵字新增到所有方法：
                </p>
                [object Promise]
                <p>
                    到目前為止，您尚未引入任何新功能。相反，您已為建立一個將非同步執行資料庫查詢的 <code>PostgresTaskRepository</code> 奠定了基礎。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="配置資料庫連接" id="config-db-connection">
        <procedure id="config-db-connection-procedure">
            <p>
                在 <a href="#delete-function">本教學的第一部分</a>中，您刪除了
                <Path>Databases.kt</Path>
                中 <code>configureDatabases()</code> 方法中的範例程式碼。您現在可以新增自己的實作了。
            </p>
            <step>
                開啟
                <Path>src/main/kotlin/com/example</Path>
                中的
                <Path>Databases.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    使用 <code>Database.connect()</code> 函式連接到您的資料庫，調整設定值以符合您的環境：
                </p>
                [object Promise]
                <p>請注意，<code>url</code> 包含以下組件：</p>
                <list>
                    <li>
                        <code>localhost:5432</code> 是 PostgreSQL 資料庫運行的主機和埠。
                    </li>
                    <li>
                        <code>ktor_tutorial_db</code> 是運行服務時建立的資料庫名稱。
                    </li>
                </list>
                <tip>
                    有關更多資訊，請參閱
                    <a href="https://jetbrains.github.io/Exposed/database-and-datasource.html">
                        在 Exposed 中使用 Database 和 DataSource</a>。
                </tip>
            </step>
        </procedure>
    </chapter>
    <chapter title="建立物件 / 關聯對應" id="create-mapping">
        <procedure id="create-mapping-procedure">
            <step>
                導覽至
                <Path>src/main/kotlin/com/example</Path>
                並建立一個名為
                <Path>db</Path>
                的新套件。
            </step>
            <step>
                在
                <Path>db</Path>
                套件內，建立一個新的
                <Path>mapping.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    開啟
                    <Path>mapping.kt</Path>
                    並新增 <code>TaskTable</code> 和 <code>TaskDAO</code> 類型：
                </p>
                [object Promise]
                <p>
                    這些類型使用 Exposed 函式庫將 <code>Task</code> 類型中的屬性對應到資料庫中
                    <Path>task</Path>
                    表格的欄位。<code>TaskTable</code> 類型定義了基本對應，而
                    <code>TaskDAO</code> 類型則新增了建立、查找、更新和刪除任務的輔助方法。
                </p>
                <p>
                    Ktor 專案產生器尚未新增對 DAO 類型的支援，因此您需要在 Gradle 建置檔案中新增相關依賴項。
                </p>
            </step>
            <step>
                <p>
                    開啟
                    <Path>gradle/libs.versions.toml</Path>
                    檔案並指定以下函式庫：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    開啟
                    <Path>build.gradle.kts</Path>
                    檔案並新增以下依賴項：
                </p>
                [object Promise]
            </step>
            <step>
<p>在 IntelliJ IDEA 中，點擊通知 Gradle 圖示
    (<img alt="IntelliJ IDEA Gradle 圖示"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    在編輯器右側以載入 Gradle 變更。</p>
            </step>
            <step>
                <p>
                    導覽回
                    <Path>mapping.kt</Path>
                    檔案並新增以下兩個輔助函式：
                </p>
                [object Promise]
                <p>
                    <code>suspendTransaction()</code> 接受一個程式碼塊，並透過 IO Dispatcher 在資料庫交易中執行它。這旨在將阻塞的工作任務卸載到執行緒池。
                </p>
                <p>
                    <code>daoToModel()</code> 將 <code>TaskDAO</code> 類型的實例轉換為
                    <code>Task</code> 物件。
                </p>
            </step>
            <step>
                <p>
                    新增以下缺失的導入：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="撰寫新儲存庫" id="create-new-repo">
        <procedure id="create-new-repo-procedure">
            <p>您現在擁有建立特定資料庫儲存庫所需的所有資源。</p>
            <step>
                導覽至
                <Path>src/main/kotlin/com/example/model</Path>
                並建立一個新的
                <Path>PostgresTaskRepository.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    開啟
                    <Path>PostgresTaskRepository.kt</Path>
                    檔案並使用以下實作建立一個新類型：
                </p>
                [object Promise]
                <p>
                    在此實作中，您使用 <code>TaskDAO</code> 和
                    <code>TaskTable</code> 類型的輔助方法與資料庫互動。建立此新儲存庫後，唯一剩下的任務是在您的路由中切換使用它。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="切換到新的儲存庫" id="switch-repo">
        <procedure id="switch-repo-procedure">
            <p>要切換到外部資料庫，您只需更改儲存庫類型。</p>
            <step>
                開啟
                <Path>src/main/kotlin/com/example</Path>
                中的
                <Path>Application.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    在 <code>Application.module()</code> 函式中，將 <code>FakeTaskRepository</code>
                    替換為 <code>PostgresTaskRepository</code>：
                </p>
                [object Promise]
                <p>
                    因為您透過介面注入依賴項，所以實作的切換對於管理路由的程式碼是透明的。
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
                導覽至 <a
                    href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                使用者介面保持不變，但它現在從資料庫中獲取資料。
            </step>
            <step>
                <p>
                    為驗證這一點，請使用表單新增一個任務，並查詢 PostgreSQL 中任務表格中儲存的資料。
                </p>
                <tip>
                    <p>
                        在 IntelliJ IDEA 中，您可以使用<a href="https://www.jetbrains.com/help/idea/query-consoles.html#create_console">查詢控制台</a>和 <code>SELECT</code> SQL 語句來查詢表格資料：
                    </p>
                    [object Promise]
                    <p>
                        查詢後，資料應顯示在
                        <ui-path>Service</ui-path>
                        窗格中，包括新任務：
                    </p>
                    <img src="tutorial_server_db_integration_task_table.png"
                         alt="IntelliJ IDEA 服務窗格中顯示的任務表格"
                         border-effect="line"
                         width="706"/>
                </tip>
            </step>
        </procedure>
    </chapter>
    <p>
        至此，您已成功將資料庫整合到您的應用程式中。
    </p>
    <p>
        由於 <code>FakeTaskRepository</code> 類型不再在生產程式碼中需要，您可以將其移至測試原始碼集，即
        <Path>src/test/com/example</Path>
        。
    </p>
    <p>
        最終的專案結構應如下所示：
    </p>
    <img src="tutorial_server_db_integration_src_folder.png"
         alt="IntelliJ IDEA 專案視圖中顯示的 src 資料夾"
         border-effect="line"
         width="400"/>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        您現在有一個應用程式，它與 Ktor RESTful 服務進行通訊。該服務反過來使用以 <a href="https://github.com/JetBrains/Exposed">Exposed</a> 撰寫的儲存庫來存取
        <a href="https://www.postgresql.org/docs/">PostgreSQL</a>。您還擁有 <a href="#add-automated-tests">一套測試</a>，用於驗證核心功能，而無需網路伺服器或資料庫。
    </p>
    <p>
        這種結構可以根據需要擴展以支援任意功能，但是，您可能首先要考慮設計的非功能性方面，例如容錯、安全性及可擴展性。您可以從<a href="docker-compose.topic#extract-db-settings">將資料庫設定提取</a>到一個<Links href="/ktor/server-configuration-file" summary="了解如何在組態檔中配置各種伺服器參數。">組態檔</Links>開始。
    </p>
</chapter>
</topic>