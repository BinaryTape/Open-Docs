<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="將資料庫與 Kotlin、Ktor 和 Exposed 整合" id="server-integrate-database">
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
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="路由是處理伺服器應用程式中傳入請求的核心外掛程式。">Routing</Links>、<Links href="/ktor/server-static-content" summary="瞭解如何提供靜態內容，例如樣式表、腳本、圖片等。">Static Content</Links>、
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>、 <Links href="/ktor/server-status-pages" summary="%plugin_name% 允許 Ktor 應用程式根據拋出的異常或狀態碼對任何故障狀態作出適當的回應。">Status pages</Links>、
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">kotlinx.serialization</Links>、
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md">Exposed</a>、
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md">Postgres</a>
    </p>
</tldr>
<card-summary>
    學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。
</card-summary>
<link-summary>
    學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。
</link-summary>
<web-summary>
    學習如何使用 Kotlin 和 Ktor 建立單頁應用程式 (SPA)，其中 RESTful 服務連結到資料庫儲存庫。它使用 Exposed SQL 函式庫並允許您使用模擬儲存庫進行測試。
</web-summary>
<p>
    在本文中，您將學習如何使用 Kotlin 的 SQL 函式庫 <a
        href="https://github.com/JetBrains/Exposed">Exposed</a>，將您的 Ktor 服務與關聯式資料庫整合。
</p>
<p>透過本教程，您將學習如何執行以下操作：</p>
<list>
    <li>建立使用 JSON 序列化的 RESTful 服務。</li>
    <li>將不同的儲存庫注入到這些服務中。</li>
    <li>使用模擬儲存庫為您的服務建立單元測試。</li>
    <li>使用 Exposed 和依賴注入 (DI) 建立可運作的儲存庫。</li>
    <li>部署存取外部資料庫的服務。</li>
</list>
<p>
    在先前的教程中，我們使用「任務管理器」範例涵蓋了基礎知識，例如<Links href="/ktor/server-requests-and-responses" summary="學習在 Kotlin 中使用 Ktor 建立任務管理器應用程式時，關於路由、處理請求和參數的基礎知識。">處理請求</Links>、
    <Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links> 或
    <Links href="/ktor/server-create-website" summary="學習如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板建立網站。">使用 Thymeleaf 模板建立 Web 應用程式</Links>。
    雖然這些教程側重於使用簡單的記憶體內部 <code>TaskRepository</code> 的前端功能，
    本指南則將重點轉移到如何透過 <a href="https://github.com/JetBrains/Exposed">Exposed SQL 函式庫</a>讓您的 Ktor 服務與關聯式資料庫互動。
</p>
<p>
    儘管本指南較長且更複雜，您仍然能快速產生可運作的程式碼並逐步引入新功能。
</p>
<p>本指南將分為兩個部分：</p>
<list type="decimal">
    <li>
        <a href="#create-restful-service-and-repository">使用記憶體內部儲存庫建立您的應用程式。</a>
    </li>
    <li>
        <a href="#add-postgresql-repository">將記憶體內部儲存庫替換為使用 PostgreSQL 的儲存庫。</a>
    </li>
</list>
<chapter title="先決條件" id="prerequisites">
    <p>
        您可以獨立完成本教程，但是，我們建議您完成<Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links> 教程，以便熟悉內容協商 (Content Negotiation) 和 REST。
    </p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以使用您選擇的其他 IDE。
    </p>
</chapter>
<chapter title="建立 RESTful 服務和記憶體內部儲存庫" id="create-restful-service-and-repository">
    <p>
        首先，您將重新建立您的任務管理器 RESTful 服務。最初，這將使用記憶體內部儲存庫，但您將設計其結構，使其能夠以最小的努力進行替換。
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
    <chapter title="使用外掛程式建立新專案" id="create-project">
        <p>
            若要使用 Ktor 專案生成器建立新專案，請按照以下步驟操作：
        </p>
        <procedure id="create-project-procedure">
            <step>
                <p>
                    導航至
                    <a href="https://start.ktor.io/">Ktor 專案生成器</a>
                    。
                </p>
            </step>
            <step>
                <p>在
                    <control>專案構件</control>
                    欄位中，輸入
                    <Path>com.example.ktor-exposed-task-app</Path>
                    作為您的專案構件名稱。
                    <img src="tutorial_server_db_integration_project_artifact.png"
                         alt="在 Ktor 專案生成器中命名專案構件"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    在外掛程式區段中，透過點擊
                    <control>新增</control>
                    按鈕來搜尋並新增以下外掛程式：
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
                         alt="在 Ktor 專案生成器中新增外掛程式"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    新增外掛程式後，點擊外掛程式區段右上角的
                    <control>7 plugins</control>
                    按鈕，以查看已新增的外掛程式。
                </p>
                <p>然後您將看到所有將新增到您專案中的外掛程式列表：
                    <img src="tutorial_server_db_integration_plugin_list.png"
                         alt="Ktor 專案生成器中的外掛程式下拉選單"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    點擊
                    <control>下載</control>
                    按鈕以生成並下載您的 Ktor 專案。
                </p>
            </step>
            <step>
                <p>
                    在 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
                        IDEA</a> 或您選擇的其他 IDE 中開啟生成的專案。
                </p>
            </step>
            <step>
                <p>
                    導航至
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
                    檔案並移除 <code>configureDatabases()</code> 函數的內容。
                </p>
                <code-block lang="kotlin" code="                        fun Application.configureDatabases() {&#10;                        }"/>
                <p>
                    移除此功能的理由是 Ktor 專案生成器已新增範例程式碼，以展示如何將使用者和城市資料持久化到 HSQLDB 或 PostgreSQL。本教程中不需要該範例程式碼。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增入門程式碼" id="add-starter-code">
        <procedure id="add-starter-code-procedure">
            <step>
                導航至
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
                    並新增一個 <code>enum</code> 來表示優先級，以及一個 <code>class</code> 來表示任務。
                </p>
                <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.serialization.Serializable&#10;&#10;enum class Priority {&#10;    Low, Medium, High, Vital&#10;}&#10;&#10;@Serializable&#10;data class Task(&#10;    val name: String,&#10;    val description: String,&#10;    val priority: Priority&#10;)"/>
                <p>
                    <code>Task</code> 類別使用 <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">kotlinx.serialization</Links> 函式庫中的 <code>Serializable</code> 類型進行註解。
                </p>
                <p>
                    與先前的教程一樣，您將建立一個記憶體內部儲存庫。然而，這次儲存庫將實作一個 <code>interface</code>，以便您以後可以輕鬆替換它。
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
                <code-block lang="kotlin" code="                        package com.example.model&#10;&#10;                        interface TaskRepository {&#10;                            fun allTasks(): List&lt;Task&gt;&#10;                            fun tasksByPriority(priority: Priority): List&lt;Task&gt;&#10;                            fun taskByName(name: String): Task?&#10;                            fun addTask(task: Task)&#10;                            fun removeTask(name: String): Boolean&#10;                        }"/>
            </step>
            <step>
                在同一個目錄中建立一個新的
                <Path>FakeTaskRepository.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    開啟
                    <Path>FakeTaskRepository.kt</Path>
                    並新增以下 <code>class</code>：
                </p>
                <code-block lang="kotlin" code="                        package com.example.model&#10;&#10;                        class FakeTaskRepository : TaskRepository {&#10;                            private val tasks = mutableListOf(&#10;                                Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                                Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                                Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                                Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                            )&#10;&#10;                            override fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;                            override fun tasksByPriority(priority: Priority) = tasks.filter {&#10;                                it.priority == priority&#10;                            }&#10;&#10;                            override fun taskByName(name: String) = tasks.find {&#10;                                it.name.equals(name, ignoreCase = true)&#10;                            }&#10;&#10;                            override fun addTask(task: Task) {&#10;                                if (taskByName(task.name) != null) {&#10;                                    throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;                                }&#10;                                tasks.add(task)&#10;                            }&#10;&#10;                            override fun removeTask(name: String): Boolean {&#10;                                return tasks.removeIf { it.name == name }&#10;                            }&#10;                        }"/>
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
                    將現有的 <code>Application.configureSerialization()</code> 函數替換為以下實作：
                </p>
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Priority&#10;import com.example.model.Task&#10;import com.example.model.TaskRepository&#10;import io.ktor.http.*&#10;import io.ktor.serialization.*&#10;import io.ktor.serialization.kotlinx.json.*&#10;import io.ktor.server.application.*&#10;import io.ktor.server.plugins.contentnegotiation.*&#10;import io.ktor.server.request.*&#10;import io.ktor.server.response.*&#10;import io.ktor.server.routing.*&#10;&#10;fun Application.configureSerialization(repository: TaskRepository) {&#10;    install(ContentNegotiation) {&#10;        json()&#10;    }&#10;    routing {&#10;        route(&quot;/tasks&quot;) {&#10;            get {&#10;                val tasks = repository.allTasks()&#10;                call.respond(tasks)&#10;            }&#10;&#10;            get(&quot;/byName/{taskName}&quot;) {&#10;                val name = call.parameters[&quot;taskName&quot;]&#10;                if (name == null) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                    return@get&#10;                }&#10;                val task = repository.taskByName(name)&#10;                if (task == null) {&#10;                    call.respond(HttpStatusCode.NotFound)&#10;                    return@get&#10;                }&#10;                call.respond(task)&#10;            }&#10;&#10;            get(&quot;/byPriority/{priority}&quot;) {&#10;                val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                if (priorityAsText == null) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                    return@get&#10;                }&#10;                try {&#10;                    val priority = Priority.valueOf(priorityAsText)&#10;                    val tasks = repository.tasksByPriority(priority)&#10;&#10;&#10;                    if (tasks.isEmpty()) {&#10;                        call.respond(HttpStatusCode.NotFound)&#10;                        return@get&#10;                    }&#10;                    call.respond(tasks)&#10;                } catch (ex: IllegalArgumentException) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                }&#10;            }&#10;&#10;            post {&#10;                try {&#10;                    val task = call.receive&lt;Task&gt;()&#10;                    repository.addTask(task)&#10;                    call.respond(HttpStatusCode.NoContent)&#10;                } catch (ex: IllegalStateException) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                } catch (ex: JsonConvertException) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                }&#10;            }&#10;&#10;            delete(&quot;/{taskName}&quot;) {&#10;                val name = call.parameters[&quot;taskName&quot;]&#10;                if (name == null) {&#10;                    call.respond(HttpStatusCode.BadRequest)&#10;                    return@delete&#10;                }&#10;                if (repository.removeTask(name)) {&#10;                    call.respond(HttpStatusCode.NoContent)&#10;                } else {&#10;                    call.respond(HttpStatusCode.NotFound)&#10;                }&#10;            }&#10;        }&#10;    }&#10;}"/>
                <p>
                    這是您在 <Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">建立
                    RESTful API</Links> 教程中實作的相同路由，只是現在您將儲存庫作為參數傳遞到 <code>routing()</code> 函數中。由於參數的類型是一個 <code>interface</code>，因此可以注入許多不同的實作。
                </p>
                <p>
                    現在您已將參數新增到 <code>configureSerialization()</code>，現有的呼叫將不再編譯。幸運的是，此函數僅被呼叫一次。
                </p>
            </step>
            <step>
                開啟
                <Path>src/main/kotlin/com/example</Path>
                內的
                <Path>Application.kt</Path>
                檔案。
            </step>
            <step>
                <p>
                    將 <code>module()</code> 函數替換為以下實作：
                </p>
                <code-block lang="kotlin" code="                    import com.example.model.FakeTaskRepository&#10;                    //...&#10;&#10;                    fun Application.module() {&#10;                        val repository = FakeTaskRepository()&#10;&#10;                        configureSerialization(repository)&#10;                        configureDatabases()&#10;                        configureRouting()&#10;                    }"/>
                <p>
                    您現在正將 <code>FakeTaskRepository</code> 的實例注入到 <code>configureSerialization()</code> 中。
                    長期目標是能夠將其替換為 <code>PostgresTaskRepository</code>。
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
                    將目前的內容替換為以下實作：
                </p>
                <code-block lang="html" code="&lt;html&gt;&#10;&lt;head&gt;&#10;    &lt;title&gt;A Simple SPA For Tasks&lt;/title&gt;&#10;    &lt;script type=&quot;application/javascript&quot;&gt;&#10;        function displayAllTasks() {&#10;            clearTasksTable();&#10;            fetchAllTasks().then(displayTasks)&#10;        }&#10;&#10;        function displayTasksWithPriority() {&#10;            clearTasksTable();&#10;            const priority = readTaskPriority();&#10;            fetchTasksWithPriority(priority).then(displayTasks)&#10;        }&#10;&#10;        function displayTask(name) {&#10;            fetchTaskWithName(name).then(t =&gt;&#10;                taskDisplay().innerHTML&#10;                    = `${t.priority} priority task ${t.name} with description &quot;${t.description}&quot;`&#10;            )&#10;        }&#10;&#10;        function deleteTask(name) {&#10;            deleteTaskWithName(name).then(() =&gt; {&#10;                clearTaskDisplay();&#10;                displayAllTasks();&#10;            })&#10;        }&#10;&#10;        function deleteTaskWithName(name) {&#10;            return sendDELETE(`/tasks/${name}`)&#10;        }&#10;&#10;        function addNewTask() {&#10;            const task = buildTaskFromForm();&#10;            sendPOST(&quot;/tasks&quot;, task).then(displayAllTasks);&#10;        }&#10;&#10;        function buildTaskFromForm() {&#10;            return {&#10;                name: getTaskFormValue(&quot;newTaskName&quot;),&#10;                description: getTaskFormValue(&quot;newTaskDescription&quot;),&#10;                priority: getTaskFormValue(&quot;newTaskPriority&quot;)&#10;            }&#10;        }&#10;&#10;        function getTaskFormValue(controlName) {&#10;            return document.addTaskForm[controlName].value;&#10;        }&#10;&#10;        function taskDisplay() {&#10;            return document.getElementById(&quot;currentTaskDisplay&quot;);&#10;        }&#10;&#10;        function readTaskPriority() {&#10;            return document.priorityForm.priority.value&#10;        }&#10;&#10;        function fetchTasksWithPriority(priority) {&#10;            return sendGET(`/tasks/byPriority/${priority}`);&#10;        }&#10;&#10;        function fetchTaskWithName(name) {&#10;            return sendGET(`/tasks/byName/${name}`);&#10;        }&#10;&#10;        function fetchAllTasks() {&#10;            return sendGET(&quot;/tasks&quot;)&#10;        }&#10;&#10;        function sendGET(url) {&#10;            return fetch(&#10;                url,&#10;                {headers: {'Accept': 'application/json'}}&#10;            ).then(response =&gt; {&#10;                if (response.ok) {&#10;                    return response.json()&#10;                }&#10;                return [];&#10;            });&#10;        }&#10;&#10;        function sendPOST(url, data) {&#10;            return fetch(url, {&#10;                method: 'POST',&#10;                headers: {'Content-Type': 'application/json'},&#10;                body: JSON.stringify(data)&#10;            });&#10;        }&#10;&#10;        function sendDELETE(url) {&#10;            return fetch(url, {&#10;                method: &quot;DELETE&quot;&#10;            });&#10;        }&#10;&#10;        function tasksTable() {&#10;            return document.getElementById(&quot;tasksTableBody&quot;);&#10;        }&#10;&#10;        function clearTasksTable() {&#10;            tasksTable().innerHTML = &quot;&quot;;&#10;        }&#10;&#10;        function clearTaskDisplay() {&#10;            taskDisplay().innerText = &quot;None&quot;;&#10;        }&#10;&#10;        function displayTasks(tasks) {&#10;            const tasksTableBody = tasksTable()&#10;            tasks.forEach(task =&gt; {&#10;                const newRow = taskRow(task);&#10;                tasksTableBody.appendChild(newRow);&#10;            });&#10;        }&#10;&#10;        function taskRow(task) {&#10;            return tr([&#10;                td(task.name),&#10;                td(task.priority),&#10;                td(viewLink(task.name)),&#10;                td(deleteLink(task.name)),&#10;            ]);&#10;        }&#10;&#10;        function tr(children) {&#10;            const node = document.createElement(&quot;tr&quot;);&#10;            children.forEach(child =&gt; node.appendChild(child));&#10;            return node;&#10;        }&#10;&#10;        function td(content) {&#10;            const node = document.createElement(&quot;td&quot;);&#10;            if (content instanceof Element) {&#10;                node.appendChild(content)&#10;            } else {&#10;                node.appendChild(document.createTextNode(content));&#10;            }&#10;            return node;&#10;        }&#10;&#10;        function viewLink(taskName) {&#10;            const node = document.createElement(&quot;a&quot;);&#10;            node.setAttribute(&#10;                &quot;href&quot;, `javascript:displayTask(&quot;${taskName}&quot;)`&#10;            )&#10;            node.appendChild(document.createTextNode(&quot;view&quot;));&#10;            return node;&#10;        }&#10;&#10;        function deleteLink(taskName) {&#10;            const node = document.createElement(&quot;a&quot;);&#10;            node.setAttribute(&#10;                &quot;href&quot;, `javascript:deleteTask(&quot;${taskName}&quot;)`&#10;            )&#10;            node.appendChild(document.createTextNode(&quot;delete&quot;));&#10;            return node;&#10;        }&#10;    &lt;/script&gt;&#10;&lt;/head&gt;&#10;&lt;body onload=&quot;displayAllTasks()&quot;&gt;&#10;&lt;h1&gt;任務管理器客戶端&lt;/h1&gt;&#10;&lt;form action=&quot;javascript:displayAllTasks()&quot;&gt;&#10;    &lt;span&gt;檢視所有任務&lt;/span&gt;&#10;    &lt;input type=&quot;submit&quot; value=&quot;前往&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;form name=&quot;priorityForm&quot; action=&quot;javascript:displayTasksWithPriority()&quot;&gt;&#10;    &lt;span&gt;檢視具有優先級的任務&lt;/span&gt;&#10;    &lt;select name=&quot;priority&quot;&gt;&#10;        &lt;option name=&quot;Low&quot;&gt;低&lt;/option&gt;&#10;        &lt;option name=&quot;Medium&quot;&gt;中&lt;/option&gt;&#10;        &lt;option name=&quot;High&quot;&gt;高&lt;/option&gt;&#10;        &lt;option name=&quot;Vital&quot;&gt;關鍵&lt;/option&gt;&#10;    &lt;/select&gt;&#10;    &lt;input type=&quot;submit&quot; value=&quot;前往&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;form name=&quot;addTaskForm&quot; action=&quot;javascript:addNewTask()&quot;&gt;&#10;    &lt;span&gt;建立新任務與&lt;/span&gt;&#10;    &lt;label for=&quot;newTaskName&quot;&gt;名稱&lt;/label&gt;&#10;    &lt;input type=&quot;text&quot; id=&quot;newTaskName&quot; name=&quot;newTaskName&quot; size=&quot;10&quot;&gt;&#10;    &lt;label for=&quot;newTaskDescription&quot;&gt;描述&lt;/label&gt;&#10;    &lt;input type=&quot;text&quot; id=&quot;newTaskDescription&quot; name=&quot;newTaskDescription&quot; size=&quot;20&quot;&gt;&#10;    &lt;label for=&quot;newTaskPriority&quot;&gt;優先級&lt;/label&gt;&#10;    &lt;select id=&quot;newTaskPriority&quot; name=&quot;newTaskPriority&quot;&gt;&#10;        &lt;option name=&quot;Low&quot;&gt;低&lt;/option&gt;&#10;        &lt;option name=&quot;Medium&quot;&gt;中&lt;/option&gt;&#10;        &lt;option name=&quot;High&quot;&gt;高&lt;/option&gt;&#10;        &lt;option name=&quot;Vital&quot;&gt;關鍵&lt;/option&gt;&#10;    &lt;/select&gt;&#10;    &lt;input type=&quot;submit&quot; value=&quot;前往&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;hr&gt;&#10;&lt;div&gt;&#10;    目前任務是 &lt;em id=&quot;currentTaskDisplay&quot;&gt;無&lt;/em&gt;&#10;&lt;/div&gt;&#10;&lt;hr&gt;&#10;&lt;table&gt;&#10;    &lt;thead&gt;&#10;    &lt;tr&gt;&#10;        &lt;th&gt;名稱&lt;/th&gt;&#10;        &lt;th&gt;優先級&lt;/th&gt;&#10;        &lt;th&gt;&lt;/th&gt;&#10;        &lt;th&gt;&lt;/th&gt;&#10;    &lt;/tr&gt;&#10;    &lt;/thead&gt;&#10;    &lt;tbody id=&quot;tasksTableBody&quot;&gt;&#10;    &lt;/tbody&gt;&#10;&lt;/table&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
                <p>
                    這與先前教程中使用的 SPA 相同。因為它是用 JavaScript 編寫的，並且只使用了瀏覽器中可用的函式庫，所以您不必擔心客戶端依賴項。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="手動測試應用程式" id="test-manually">
        <procedure id="test-manually-procedure">
            <p>
                由於這次迭代使用的是記憶體內部儲存庫，而不是連接到資料庫，您需要確保應用程式已正確配置。
            </p>
            <step>
                <p>
                    導航至
                    <Path>src/main/resources/application.yaml</Path>
                    並移除 <code>postgres</code> 配置。
                </p>
                <code-block lang="yaml" code="ktor:&#10;    application:&#10;        modules:&#10;            - com.example.ApplicationKt.module&#10;    deployment:&#10;        port: 8080"/>
            </step>
            <step>
                <p>在 IntelliJ IDEA 中，點擊執行按鈕
                    (<img src="intellij_idea_gutter_icon.svg"
                          style="inline" height="16" width="16"
                          alt="IntelliJ IDEA 執行圖示"/>)
                    來啟動應用程式。</p>
            </step>
            <step>
                <p>
                    在瀏覽器中導航至 <a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。您應該會看到客戶端頁面，其中包含三個表單和一個顯示篩選結果的表格。
                </p>
                <img src="tutorial_server_db_integration_index_page.png"
                     alt="顯示任務管理器客戶端的瀏覽器視窗"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    透過填寫並使用
                    <control>前往</control>
                    按鈕傳送表單來測試應用程式。使用表格項目上的
                    <control>檢視</control>
                    和
                    <control>刪除</control>
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
                    <Path>src/test/kotlin/com/example</Path>
                    中的
                    <Path>ApplicationTest.kt</Path>
                    並新增以下測試：
                </p>
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Priority&#10;import com.example.model.Task&#10;import io.ktor.client.call.*&#10;import io.ktor.client.plugins.contentnegotiation.*&#10;import io.ktor.client.request.*&#10;import io.ktor.http.*&#10;import io.ktor.serialization.kotlinx.json.*&#10;import io.ktor.server.testing.*&#10;import kotlin.test.*&#10;&#10;class ApplicationTest {&#10;    @Test&#10;    fun tasksCanBeFoundByPriority() = testApplication {&#10;        application {&#10;            val repository = FakeTaskRepository()&#10;            configureSerialization(repository)&#10;            configureRouting()&#10;        }&#10;&#10;        val client = createClient {&#10;            install(ContentNegotiation) {&#10;                json()&#10;            }&#10;        }&#10;&#10;        val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;        val results = response.body&lt;List&lt;Task&gt;&gt;()&#10;&#10;        assertEquals(HttpStatusCode.OK, response.status)&#10;&#10;        val expectedTaskNames = listOf(&quot;gardening&quot;, &quot;painting&quot;)&#10;        val actualTaskNames = results.map(Task::name)&#10;        assertContentEquals(expectedTaskNames, actualTaskNames)&#10;    }&#10;&#10;    @Test&#10;    fun invalidPriorityProduces400() = testApplication {&#10;        application {&#10;            val repository = FakeTaskRepository()&#10;            configureSerialization(repository)&#10;            configureRouting()&#10;        }&#10;        val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;        assertEquals(HttpStatusCode.BadRequest, response.status)&#10;    }&#10;&#10;    @Test&#10;    fun unusedPriorityProduces404() = testApplication {&#10;        application {&#10;            val repository = FakeTaskRepository()&#10;            configureSerialization(repository)&#10;            configureRouting()&#10;        }&#10;&#10;        val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;        assertEquals(HttpStatusCode.NotFound, response.status)&#10;    }&#10;&#10;    @Test&#10;    fun newTasksCanBeAdded() = testApplication {&#10;        application {&#10;            val repository = FakeTaskRepository()&#10;            configureSerialization(repository)&#10;            configureRouting()&#10;        }&#10;&#10;        val client = createClient {&#10;            install(ContentNegotiation) {&#10;                json()&#10;            }&#10;        }&#10;&#10;        val task = Task(&quot;swimming&quot;, &quot;Go to the beach&quot;, Priority.Low)&#10;        val response1 = client.post(&quot;/tasks&quot;) {&#10;            header(&#10;                HttpHeaders.ContentType,&#10;                ContentType.Application.Json&#10;            )&#10;&#10;            setBody(task)&#10;        }&#10;        assertEquals(HttpStatusCode.NoContent, response1.status)&#10;&#10;        val response2 = client.get(&quot;/tasks&quot;)&#10;        assertEquals(HttpStatusCode.OK, response2.status)&#10;&#10;        val taskNames = response2&#10;            .body&lt;List&lt;Task&gt;&gt;()&#10;            .map { it.name }&#10;&#10;        assertContains(taskNames, &quot;swimming&quot;)&#10;    }&#10;}"/>
                    <p>
                        為使這些測試能夠編譯和執行，您需要為 Ktor 客戶端新增對 <a
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
                    <code-block lang="kotlin" code="                        [libraries]&#10;                        #...&#10;                        ktor-client-content-negotiation = { module = &quot;io.ktor:ktor-client-content-negotiation&quot;, version.ref = &quot;ktor-version&quot; }"/>
                </step>
                <step>
                    <p>
                        開啟
                        <Path>build.gradle.kts</Path>
                        並新增以下依賴項：
                    </p>
                    <code-block lang="kotlin" code="                        dependencies {&#10;                            //...&#10;                            testImplementation(libs.ktor.client.content.negotiation)&#10;                        }"/>
                </step>
                <step>
                    <p>在 IntelliJ IDEA 中，點擊通知 Gradle 圖示
                        (<img alt="IntelliJ IDEA Gradle 圖示"
                              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
                        在編輯器右側以載入 Gradle 變更。</p>
                </step>
                <step>
                    <p>在 IntelliJ IDEA 中，點擊測試類別定義旁邊的執行按鈕
                        (<img src="intellij_idea_gutter_icon.svg"
                              style="inline" height="16" width="16"
                              alt="IntelliJ IDEA 執行圖示"/>)
                        來執行測試。</p>
                    <p>然後您應該會在
                        <control>執行</control>
                        窗格中看到測試成功執行。
                    </p>
                    <img src="tutorial_server_db_integration_test_results.png"
                         alt="IntelliJ IDEA 執行窗格中顯示成功的測試結果"
                         border-effect="line"
                         width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="新增 PostgreSQL 儲存庫" id="add-postgresql-repository">
        <p>
            現在您已經有一個使用記憶體內部資料的運作中應用程式，下一步是將資料儲存外部化到 PostgreSQL 資料庫。
        </p>
        <p>
            您將透過執行以下操作來實現這一點：
        </p>
        <list type="decimal">
            <li><a href="#create-schema">在 PostgreSQL 中建立資料庫綱要。</a></li>
            <li><a href="#adapt-repo">使 <code>TaskRepository</code> 適應非同步存取。</a></li>
            <li><a href="#config-db-connection">在應用程式中配置資料庫連線。</a></li>
            <li><a href="#create-mapping">將 <code>Task</code> 類型映射到相關的資料庫表格。</a></li>
            <li><a href="#create-new-repo">基於此映射建立一個新的儲存庫。</a></li>
            <li><a href="#switch-repo">在啟動程式碼中切換到這個新儲存庫。</a></li>
        </list>
        <chapter title="建立資料庫綱要" id="create-schema">
            <procedure id="create-schema-procedure">
                <step>
                    <p>
                        使用您選擇的資料庫管理工具，在 PostgreSQL 中建立一個新資料庫。
                        名稱無關緊要，只要您記得它即可。在此範例中，我們將使用
                        <Path>ktor_tutorial_db</Path>
                        。
                    </p>
                    <tip>
                        <p>
                            有關 PostgreSQL 的更多資訊，請參閱 <a
                                href="https://www.postgresql.org/docs/current/">官方文件</a>。
                        </p>
                        <p>
                            在 IntelliJ IDEA 中，您可以使用資料庫工具來<a
                                href="https://www.jetbrains.com/help/idea/postgresql.html">連接和管理您的 PostgreSQL
                            資料庫。</a>
                        </p>
                    </tip>
                </step>
                <step>
                    <p>
                        對您的資料庫執行以下 SQL 命令。這些命令將建立並填充資料庫綱要：
                    </p>
                    <code-block lang="sql" code="                        DROP TABLE IF EXISTS task;&#10;                        CREATE TABLE task(id SERIAL PRIMARY KEY, name VARCHAR(50), description VARCHAR(50), priority VARCHAR(50));&#10;&#10;                        INSERT INTO task (name, description, priority) VALUES ('cleaning', 'Clean the house', 'Low');&#10;                        INSERT INTO task (name, description, priority) VALUES ('gardening', 'Mow the lawn', 'Medium');&#10;                        INSERT INTO task (name, description, priority) VALUES ('shopping', 'Buy the groceries', 'High');&#10;                        INSERT INTO task (name, description, priority) VALUES ('painting', 'Paint the fence', 'Medium');&#10;                        INSERT INTO task (name, description, priority) VALUES ('exercising', 'Walk the dog', 'Medium');&#10;                        INSERT INTO task (name, description, priority) VALUES ('meditating', 'Contemplate the infinite', 'High');"/>
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
                            的欄位。這些欄位需要映射到 <code>Task</code> 類別的屬性。
                        </li>
                        <li>
                            如果表格已存在，您將重新建立它，因此您可以重複執行腳本。
                        </li>
                        <li>
                            還有一個名為
                            <Path>id</Path>
                            的額外欄位，其類型為 <code>SERIAL</code>。這將是一個整數值，用於為每一列提供其主鍵。這些值將由資料庫為您自動分配。
                        </li>
                    </list>
                </step>
            </procedure>
        </chapter>
        <chapter title="調整現有儲存庫" id="adapt-repo">
            <procedure id="adapt-repo-procedure">
                <p>
                    當對資料庫執行查詢時，最好讓它們非同步執行以避免阻塞處理 HTTP 請求的執行緒。在 Kotlin 中，這最好透過 <a
                        href="https://kotlinlang.org/docs/coroutines-overview.html">協程 (coroutines)</a> 來管理。
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
                    <code-block lang="kotlin" code="                    interface TaskRepository {&#10;                        suspend fun allTasks(): List&lt;Task&gt;&#10;                        suspend fun tasksByPriority(priority: Priority): List&lt;Task&gt;&#10;                        suspend fun taskByName(name: String): Task?&#10;                        suspend fun addTask(task: Task)&#10;                        suspend fun removeTask(name: String): Boolean&#10;                    }"/>
                    <p>
                        這將允許介面方法的實作在不同的協程調度器 (Coroutine Dispatcher) 上啟動工作。
                    </p>
                    <p>
                        您現在需要調整 <code>FakeTaskRepository</code> 的方法以匹配，儘管您不需要在該實作中切換調度器。
                    </p>
                </step>
                <step>
                    <p>
                        開啟
                        <Path>FakeTaskRepository.kt</Path>
                        檔案並將 <code>suspend</code> 關鍵字新增到所有方法：
                    </p>
                    <code-block lang="kotlin" code="                    class FakeTaskRepository : TaskRepository {&#10;                        //...&#10;&#10;                        override suspend fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;                        override suspend fun tasksByPriority(priority: Priority) = tasks.filter {&#10;                            //...&#10;                        }&#10;&#10;                        override suspend fun taskByName(name: String) = tasks.find {&#10;                            //...&#10;                        }&#10;&#10;                        override suspend fun addTask(task: Task) {&#10;                            //...&#10;                        }&#10;&#10;                        override suspend fun removeTask(name: String): Boolean {&#10;                            //...&#10;                        }&#10;                    }"/>
                    <p>
                        到目前為止，您沒有引入任何新功能。相反，您為建立一個將非同步執行資料庫查詢的 <code>PostgresTaskRepository</code> 奠定了基礎。
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="配置資料庫連線" id="config-db-connection">
            <procedure id="config-db-connection-procedure">
                <p>
                    在 <a href="#delete-function">本教程的第一部分</a> 中，您刪除了在
                    <Path>Databases.kt</Path>
                    中找到的 <code>configureDatabases()</code> 方法中的範例程式碼。您現在已準備好新增您自己的實作。
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
                        使用 <code>Database.connect()</code> 函數連接到您的資料庫，調整設定值以符合您的環境：
                    </p>
                    <code-block lang="kotlin" code="                        fun Application.configureDatabases() {&#10;                            Database.connect(&#10;                                &quot;jdbc:postgresql://localhost:5432/ktor_tutorial_db&quot;,&#10;                                user = &quot;postgres&quot;,&#10;                                password = &quot;password&quot;&#10;                            )&#10;                        }"/>
                    <p>請注意，<code>url</code> 包含以下組件：</p>
                    <list>
                        <li>
                            <code>localhost:5432</code> 是 PostgreSQL 資料庫運行的主機和埠。
                        </li>
                        <li>
                            <code>ktor_tutorial_db</code> 是執行服務時建立的資料庫名稱。
                        </li>
                    </list>
                    <tip>
                        更多資訊請參閱
                        <a href="https://jetbrains.github.io/Exposed/database-and-datasource.html">
                            在 Exposed 中使用 Database 和 DataSource</a>。
                    </tip>
                </step>
            </procedure>
        </chapter>
        <chapter title="建立物件/關聯式對應" id="create-mapping">
            <procedure id="create-mapping-procedure">
                <step>
                    導航至
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
                        並新增類型 <code>TaskTable</code> 和 <code>TaskDAO</code>：
                    </p>
                    <code-block lang="kotlin" code="package com.example.db&#10;&#10;import kotlinx.coroutines.Dispatchers&#10;import org.jetbrains.exposed.dao.IntEntity&#10;import org.jetbrains.exposed.dao.IntEntityClass&#10;import org.jetbrains.exposed.dao.id.EntityID&#10;import org.jetbrains.exposed.dao.id.IntIdTable&#10;&#10;object TaskTable : IntIdTable(&quot;task&quot;) {&#10;    val name = varchar(&quot;name&quot;, 50)&#10;    val description = varchar(&quot;description&quot;, 50)&#10;    val priority = varchar(&quot;priority&quot;, 50)&#10;}&#10;&#10;class TaskDAO(id: EntityID&lt;Int&gt;) : IntEntity(id) {&#10;    companion object : IntEntityClass&lt;TaskDAO&gt;(TaskTable)&#10;&#10;    var name by TaskTable.name&#10;    var description by TaskTable.description&#10;    var priority by TaskTable.priority&#10;}"/>
                    <p>
                        這些類型使用 Exposed 函式庫將 <code>Task</code> 類型中的屬性映射到資料庫中
                        <Path>task</Path>
                        表格中的欄位。<code>TaskTable</code> 類型定義了基本映射，而
                        <code>TaskDAO</code> 類型則新增了輔助方法來建立、尋找、更新和刪除任務。
                    </p>
                    <p>
                        Ktor 專案生成器尚未新增對 DAO 類型的支援，因此您需要在 Gradle 建置檔案中新增相關依賴項。
                    </p>
                </step>
                <step>
                    <p>
                        開啟
                        <Path>gradle/libs.versions.toml</Path>
                        檔案並指定以下函式庫：
                    </p>
                    <code-block lang="kotlin" code="                       [libraries]&#10;                       #...&#10;                       exposed-dao = { module = &quot;org.jetbrains.exposed:exposed-dao&quot;, version.ref = &quot;exposed-version&quot; }"/>
                </step>
                <step>
                    <p>
                        開啟
                        <Path>build.gradle.kts</Path>
                        檔案並新增以下依賴項：
                    </p>
                    <code-block lang="kotlin" code="                        dependencies {&#10;                            //...&#10;                            implementation(libs.exposed.dao)&#10;                        }"/>
                </step>
                <step>
                    <p>在 IntelliJ IDEA 中，點擊通知 Gradle 圖示
                        (<img alt="IntelliJ IDEA Gradle 圖示"
                              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
                        在編輯器右側以載入 Gradle 變更。</p>
                </step>
                <step>
                    <p>
                        導航回
                        <Path>mapping.kt</Path>
                        檔案並新增以下兩個輔助函數：
                    </p>
                    <code-block lang="kotlin" code="suspend fun &lt;T&gt; suspendTransaction(block: Transaction.() -&gt; T): T =&#10;    newSuspendedTransaction(Dispatchers.IO, statement = block)&#10;&#10;fun daoToModel(dao: TaskDAO) = Task(&#10;    dao.name,&#10;    dao.description,&#10;    Priority.valueOf(dao.priority)&#10;)"/>
                    <p>
                        <code>suspendTransaction()</code> 接受一個程式碼區塊，並在資料庫交易中，透過 IO 調度器 (IO Dispatcher) 執行它。這是為了將阻塞型工作卸載到執行緒池 (thread pool)。
                    </p>
                    <p>
                        <code>daoToModel()</code> 將 <code>TaskDAO</code> 類型的一個實例轉換為 <code>Task</code> 物件。
                    </p>
                </step>
                <step>
                    <p>
                        新增以下缺少的匯入：
                    </p>
                    <code-block lang="kotlin" code="import com.example.model.Priority&#10;import com.example.model.Task&#10;import org.jetbrains.exposed.sql.Transaction&#10;import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="編寫新儲存庫" id="create-new-repo">
            <procedure id="create-new-repo-procedure">
                <p>您現在擁有建立資料庫特定儲存庫所需的所有資源。</p>
                <step>
                    導航至
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
                    <code-block lang="kotlin" code="package com.example.model&#10;&#10;import com.example.db.TaskDAO&#10;import com.example.db.TaskTable&#10;import com.example.db.daoToModel&#10;import com.example.db.suspendTransaction&#10;import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq&#10;import org.jetbrains.exposed.sql.deleteWhere&#10;&#10;class PostgresTaskRepository : TaskRepository {&#10;    override suspend fun allTasks(): List&lt;Task&gt; = suspendTransaction {&#10;        TaskDAO.all().map(::daoToModel)&#10;    }&#10;&#10;    override suspend fun tasksByPriority(priority: Priority): List&lt;Task&gt; = suspendTransaction {&#10;        TaskDAO&#10;            .find { (TaskTable.priority eq priority.toString()) }&#10;            .map(::daoToModel)&#10;    }&#10;&#10;    override suspend fun taskByName(name: String): Task? = suspendTransaction {&#10;        TaskDAO&#10;            .find { (TaskTable.name eq name) }&#10;            .limit(1)&#10;            .map(::daoToModel)&#10;            .firstOrNull()&#10;    }&#10;&#10;    override suspend fun addTask(task: Task): Unit = suspendTransaction {&#10;        TaskDAO.new {&#10;            name = task.name&#10;            description = task.description&#10;            priority = task.priority.toString()&#10;        }&#10;    }&#10;&#10;    override suspend fun removeTask(name: String): Boolean = suspendTransaction {&#10;        val rowsDeleted = TaskTable.deleteWhere {&#10;            TaskTable.name eq name&#10;        }&#10;        rowsDeleted == 1&#10;    }&#10;}"/>
                    <p>
                        在此實作中，您使用 <code>TaskDAO</code> 和 <code>TaskTable</code> 類型的輔助方法與資料庫互動。建立此新儲存庫後，剩下的唯一任務是在您的路由中切換到使用它。
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="切換到新儲存庫" id="switch-repo">
            <procedure id="switch-repo-procedure">
                <p>要切換到外部資料庫，您只需要更改儲存庫類型。</p>
                <step>
                    開啟
                    <Path>src/main/kotlin/com/example</Path>
                    中的
                    <Path>Application.kt</Path>
                    檔案。
                </step>
                <step>
                    <p>
                        在 <code>Application.module()</code> 函數中，將 <code>FakeTaskRepository</code>
                        替換為 <code>PostgresTaskRepository</code>：
                    </p>
                    <code-block lang="kotlin" code="                    //...&#10;                    import com.example.model.PostgresTaskRepository&#10;&#10;                    //...&#10;&#10;                    fun Application.module() {&#10;                        val repository = PostgresTaskRepository()&#10;&#10;                        configureSerialization(repository)&#10;                        configureDatabases()&#10;                        configureRouting()&#10;                    }"/>
                    <p>
                        由於您透過介面注入依賴項，因此實作中的切換對於管理路由的程式碼是透明的。
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
                    導航至 <a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                    UI 保持不變，但它現在從資料庫中獲取資料。
                </step>
                <step>
                    <p>
                        為了驗證這一點，請使用表單新增一個新任務，並查詢 PostgreSQL 中任務表格中儲存的資料。
                    </p>
                    <tip>
                        <p>
                            在 IntelliJ IDEA 中，您可以使用
                            <a href="https://www.jetbrains.com/help/idea/query-consoles.html#create_console">查詢主控台 (Query
                                Console)</a> 和 <code>SELECT</code> SQL 陳述式來查詢表格資料：
                        </p>
                        <code-block lang="SQL" code="                            SELECT * FROM task;"/>
                        <p>
                            查詢後，資料應顯示在
                            <ui-path>服務</ui-path>
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
            由於 <code>FakeTaskRepository</code> 類型在生產程式碼中不再需要，您可以將其移至測試原始碼集，即
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
    <chapter title="下一步" id="next-steps">
        <p>
            您現在擁有一個與 Ktor RESTful 服務通信的應用程式。該服務又使用 <a href="https://github.com/JetBrains/Exposed">Exposed</a> 編寫的儲存庫來存取
            <a href="https://www.postgresql.org/docs/">PostgreSQL</a>。您還擁有<a href="#add-automated-tests">一套測試</a>，可以在不需要網路伺服器或資料庫的情況下驗證核心功能。
        </p>
        <p>
            此結構可以根據需要擴展以支援任意功能，但是，您可能需要首先考慮設計的非功能性方面，例如容錯、安全性與可擴展性。您可以從<a href="docker-compose.topic#extract-db-settings">將資料庫設定提取</a>到<Links href="/ktor/server-configuration-file" summary="瞭解如何在設定檔中配置各種伺服器參數。">設定檔</Links>開始。
        </p>
    </chapter>
</topic>