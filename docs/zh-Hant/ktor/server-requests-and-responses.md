<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="使用 Ktor 和 Kotlin 處理 HTTP 請求並產生回應" id="server-requests-and-responses">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-routing-and-requests"/>
    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="Routing 是 Ktor 伺服器應用程式中用於處理傳入請求的核心外掛程式。">Routing</Links>
    </p>
</tldr>
<link-summary>
    透過建置任務管理應用程式，學習使用 Ktor 和 Kotlin 進行路由、處理請求和參數的基礎知識。
</link-summary>
<card-summary>
    透過建立任務管理應用程式，學習 Ktor 中的路由和請求如何運作。
</card-summary>
<web-summary>
    學習使用 Kotlin 和 Ktor 建立的服務中，驗證、錯誤處理和單元測試的基本知識。
</web-summary>
<p>
    在本教學中，您將透過建置一個任務管理應用程式，學習使用 Ktor 和 Kotlin 進行路由、處理請求和參數的基礎知識。
</p>
<p>
    完成本教學後，您將了解如何執行以下操作：
</p>
<list type="bullet">
    <li>處理 GET 和 POST 請求。</li>
    <li>從請求中提取資訊。</li>
    <li>處理資料轉換時的錯誤。</li>
    <li>使用單元測試來驗證路由。</li>
</list>
<chapter title="先決條件" id="prerequisites">
    <p>
        這是「Ktor 伺服器入門指南」的第二個教學。您可以獨立完成本教學，但是，我們強烈建議您完成先前的教學，以學習如何<Links href="/ktor/server-create-a-new-project" summary="學習如何使用 Ktor 開啟、執行和測試伺服器應用程式。">建立、開啟和執行新的 Ktor 專案</Links>。
    </p>
    <p>對 HTTP 請求類型、標頭和狀態碼有基本了解也很有用。</p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>，但您也可以使用其他您選擇的 IDE。
    </p>
</chapter>
<chapter title="任務管理應用程式" id="sample-application">
    <p>在本教學中，您將逐步建置一個具有以下功能的任務管理應用程式：</p>
    <list type="bullet">
        <li>將所有可用任務以 HTML 表格形式顯示。</li>
        <li>依優先順序和名稱顯示任務，同樣以 HTML 形式。</li>
        <li>透過提交 HTML 表單來新增任務。</li>
    </list>
    <p>
        您將盡可能地實現一些基本功能，然後透過七次迭代改進和擴展這些功能。這基本功能將包含一個專案，其中包含一些模型型別、一個值清單和一個單一路由。
    </p>
</chapter>
<chapter title="顯示靜態 HTML 內容" id="display-static-html">
    <p>在第一次迭代中，您將為應用程式新增一個路由，該路由將返回靜態 HTML 內容。</p>
    <p>使用 <a href="https://start.ktor.io">Ktor 專案產生器</a>，建立一個名為
        <control>ktor-task-app</control>
        的新專案。您可以接受所有預設選項，但可能希望更改
        <control>artifact</control>
        名稱。
    </p>
    <tip>
        有關建立新專案的更多資訊，請參閱<Links href="/ktor/server-create-a-new-project" summary="學習如何使用 Ktor 開啟、執行和測試伺服器應用程式。">建立、開啟和執行新的 Ktor 專案</Links>。如果您最近完成了該教學，請隨意重複使用在那裡建立的專案。
    </tip>
    <procedure>
        <step>開啟
            <Path>Routing.kt</Path>
            檔案，位於
            <Path>src/main/kotlin/com/example/plugins</Path>
            資料夾中。
        </step>
        <step>
            <p>用以下實作替換現有的 <code>Application.configureRouting()</code> 函式：</p>
            <code-block lang="kotlin" code="                        fun Application.configureRouting() {&#10;                            routing {&#10;                                get(&quot;/tasks&quot;) {&#10;                                    call.respondText(&#10;                                        contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                            text = &quot;&quot;&quot;&#10;                                        &lt;h3&gt;TODO:&lt;/h3&gt;&#10;                                        &lt;ol&gt;&#10;                                            &lt;li&gt;A table of all the tasks&lt;/li&gt;&#10;                                            &lt;li&gt;A form to submit new tasks&lt;/li&gt;&#10;                                        &lt;/ol&gt;&#10;                                        &quot;&quot;&quot;.trimIndent()&#10;                                    )&#10;                                }&#10;                            }&#10;                        }"/>
            <p>透過這樣做，您為 URL <code>/tasks</code> 和 GET 請求類型建立了一個新路由。GET 請求是 HTTP 中最基本的請求類型。當使用者在瀏覽器位址列輸入或點擊常規 HTML 連結時會觸發它。</p>
            <p>
                目前您只是返回靜態內容。為了通知客戶端您將傳送 HTML，您將 HTTP Content Type 標頭設定為 <code>"text/html"</code>。
            </p>
        </step>
        <step>
            <p>
                新增以下 import 以存取 <code>ContentType</code> 物件：
            </p>
            <code-block lang="kotlin" code="                    import io.ktor.http.ContentType"/>
        </step>
        <step>
            <p>在 IntelliJ IDEA 中，點擊
                <Path>Application.kt</Path>
                中 <code>main()</code> 函式旁邊的執行裝訂圖示 (<img alt="IntelliJ IDEA 執行應用程式圖示"
                                                                        src="intellij_idea_gutter_icon.svg" height="16"
                                                                        width="16"/>) 以啟動應用程式。
            </p>
        </step>
        <step>
            <p>
                在瀏覽器中導覽至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您應該會看到待辦事項清單顯示：
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="顯示兩個待辦事項的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="實作任務模型" id="implement-a-task-model">
    <p>
        現在您已經建立專案並設定了基本路由，您將透過執行以下操作來擴展應用程式：
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">建立模型型別來表示任務。</a></li>
        <li><a href="#create-sample-values">宣告一個包含範例值的任務清單。</a></li>
        <li><a href="#add-a-route">修改路由和請求處理器以返回此清單。</a></li>
        <li><a href="#test">使用瀏覽器測試新功能是否正常運作。</a></li>
    </list>
    <procedure title="建立模型型別" id="create-model-types">
        <step>
            <p>在
                <Path>src/main/kotlin/com/example</Path>
                內部建立一個名為
                <Path>model</Path>
                的新子套件。
            </p>
        </step>
        <step>
            <p>在
                <Path>model</Path>
                目錄中建立一個新的
                <Path>Task.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>開啟
                <Path>Task.kt</Path>
                檔案並新增以下 <code>enum</code> 以表示優先順序和 <code>class</code> 以表示任務：
            </p>
            <code-block lang="kotlin" code="                    enum class Priority {&#10;                        Low, Medium, High, Vital&#10;                    }&#10;                    data class Task(&#10;                        val name: String,&#10;                        val description: String,&#10;                        val priority: Priority&#10;                    )"/>
        </step>
        <step>
            <p>您將把任務資訊傳送到客戶端的 HTML 表格中，所以也新增以下擴充函式：</p>
            <code-block lang="kotlin" code="                    fun Task.taskAsRow() = &quot;&quot;&quot;&#10;                        &lt;tr&gt;&#10;                            &lt;td&gt;$name&lt;/td&gt;&lt;td&gt;$description&lt;/td&gt;&lt;td&gt;$priority&lt;/td&gt;&#10;                        &lt;/tr&gt;&#10;                        &quot;&quot;&quot;.trimIndent()&#10;&#10;                    fun List&lt;Task&gt;.tasksAsTable() = this.joinToString(&#10;                        prefix = &quot;&lt;table rules=\&quot;all\&quot;&gt;&quot;,&#10;                        postfix = &quot;&lt;/table&gt;&quot;,&#10;                        separator = &quot;
&quot;,&#10;                        transform = Task::taskAsRow&#10;                    )"/>
            <p>
                函式 <code>Task.taskAsRow()</code> 使得 <code>Task</code> 物件可以被渲染為表格列，而 <code>List&lt;Task&gt;.tasksAsTable()</code>
                允許任務清單被渲染為表格。
            </p>
        </step>
    </procedure>
    <procedure title="建立範例值" id="create-sample-values">
        <step>
            <p>在您的
                <Path>model</Path>
                目錄中建立一個新的
                <Path>TaskRepository.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>開啟
                <Path>TaskRepository.kt</Path>
                並新增以下程式碼以定義任務清單：
            </p>
            <code-block lang="kotlin" code="                    val tasks = mutableListOf(&#10;                        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                    )"/>
        </step>
    </procedure>
    <procedure title="新增路由" id="add-a-route">
        <step>
            <p>開啟
                <Path>Routing.kt</Path>
                檔案，並用以下實作替換現有的 <code>Application.configureRouting()</code> 函式：
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                現在您提供的是任務清單，而不是將靜態內容返回給客戶端。由於清單無法直接透過網路傳送，因此必須將其轉換為客戶端能夠理解的格式。在本例中，任務被轉換為 HTML 表格。
            </p>
        </step>
        <step>
            <p>新增所需的 import：</p>
            <code-block lang="kotlin" code="                    import model.*"/>
        </step>
    </procedure>
    <procedure title="測試新功能" id="test">
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg"
                                                                 height="16"
                                                                 width="16"/>)
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>在瀏覽器中導覽至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。它應該顯示一個包含四列的 HTML 表格：</p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="顯示四列的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
            <p>如果顯示了，恭喜！應用程式的基本功能正常運作。</p>
        </step>
    </procedure>
</chapter>
<chapter title="重構模型" id="refactor-the-model">
    <p>
        在您繼續擴展應用程式功能之前，
        您需要透過將值清單封裝到儲存庫中來重構設計。這將允許您集中管理資料，從而專注於 Ktor 相關的程式碼。
    </p>
    <procedure>
        <step>
            <p>
                返回
                <Path>TaskRepository.kt</Path>
                檔案，並用以下程式碼替換現有的任務清單：
            </p>
            <code-block lang="kotlin" code="package model&#10;&#10;object TaskRepository {&#10;    private val tasks = mutableListOf(&#10;        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;    )&#10;&#10;    fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;    fun tasksByPriority(priority: Priority) = tasks.filter {&#10;        it.priority == priority&#10;    }&#10;&#10;    fun taskByName(name: String) = tasks.find {&#10;        it.name.equals(name, ignoreCase = true)&#10;    }&#10;&#10;    fun addTask(task: Task) {&#10;        if(taskByName(task.name) != null) {&#10;            throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;        }&#10;        tasks.add(task)&#10;    }&#10;}"/>
            <p>
                這實作了一個非常簡單的基於清單的任務資料儲存區。為了範例的目的，任務的添加順序將被保留，但透過拋出異常將不允許重複。</p>
            <p>在後續教學中，您將學習如何透過 <a href="https://github.com/JetBrains/Exposed">Exposed 函式庫</a>實作連接到關聯式資料庫的儲存庫。
            </p>
            <p>
                現在，您將在路由中使用儲存庫。
            </p>
        </step>
        <step>
            <p>
                開啟
                <Path>Routing.kt</Path>
                檔案，並用以下實作替換現有的 <code>Application.configureRouting()</code> 函式：
            </p>
            <code-block lang="Kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                val tasks = TaskRepository.allTasks()&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                當請求到達時，儲存庫用於擷取當前任務清單。然後，建立一個包含這些任務的 HTTP 回應。
            </p>
        </step>
    </procedure>
    <procedure title="測試重構後的程式碼">
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg" height="16"
                                                                 width="16"/>)
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>
                在瀏覽器中導覽至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。輸出應該保持不變，顯示 HTML 表格：
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="顯示四列的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="處理參數" id="work-with-parameters">
    <p>
        在這次迭代中，您將允許使用者依優先順序檢視任務。為此，您的應用程式必須允許對以下 URL 進行 GET 請求：
    </p>
    <list type="bullet">
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
    </list>
    <p>
        您將新增的路由是
        <code>/tasks/byPriority/{priority?}</code>
        ，其中 <code>{priority?}</code> 表示您需要在執行時提取的路徑參數，
        問號用於表示參數是可選的。查詢參數可以使用任何您喜歡的名稱，但 <code>priority</code> 似乎是顯而易見的選擇。
    </p>
    <p>
        處理請求的過程可以總結如下：
    </p>
    <list type="decimal">
        <li>從請求中提取名為 <code>priority</code> 的路徑參數。</li>
        <li>如果此參數不存在，則返回 <code>400</code> 狀態碼 (錯誤請求)。</li>
        <li>將參數的文字值轉換為 <code>Priority</code> 列舉值。</li>
        <li>如果此操作失敗，則返回帶有 <code>400</code> 狀態碼的回應。</li>
        <li>使用儲存庫尋找所有具有指定優先順序的任務。</li>
        <li>如果沒有匹配的任務，則返回 <code>404</code> 狀態碼 (找不到)。</li>
        <li>返回匹配的任務，格式化為 HTML 表格。</li>
    </list>
    <p>
        您將首先實作此功能，然後找到檢查其是否正常運作的最佳方法。
    </p>
    <procedure title="新增路由">
        <p>開啟
            <Path>Routing.kt</Path>
            檔案，並將以下路由新增到您的程式碼中，如下所示：
        </p>
        <code-block lang="kotlin" code="                routing {&#10;                    get(&quot;/tasks&quot;) { ... }&#10;&#10;                    //add the following route&#10;                    get(&quot;/tasks/byPriority/{priority?}&quot;) {&#10;                        val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                        if (priorityAsText == null) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                            return@get&#10;                        }&#10;&#10;                        try {&#10;                            val priority = Priority.valueOf(priorityAsText)&#10;                            val tasks = TaskRepository.tasksByPriority(priority)&#10;&#10;                            if (tasks.isEmpty()) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = tasks.tasksAsTable()&#10;                            )&#10;                        } catch(ex: IllegalArgumentException) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            如上所述，您為 URL <code>/tasks/byPriority/{priority?}</code>
            編寫了一個處理器。符號
            <code>priority</code>
            表示使用者新增的路徑參數。不幸的是，在伺服器上無法保證這是對應 Kotlin 列舉中的四個值之一，
            因此必須手動檢查。
        </p>
        <p>
            如果路徑參數不存在，伺服器會向客戶端返回 <code>400</code> 狀態碼。
            否則，它會提取參數的值並嘗試將其轉換為列舉的成員。如果此操作失敗，將會拋出異常，伺服器會捕獲該異常並返回 <code>400</code> 狀態碼。
        </p>
        <p>
            假設轉換成功，儲存庫將用於尋找匹配的 <code>Tasks</code>。如果沒有指定優先順序的任務，伺服器會返回 <code>404</code> 狀態碼，否則它會將匹配的任務以 HTML 表格形式傳送回。
        </p>
    </procedure>
    <procedure title="測試新路由">
        <p>
            您可以透過請求不同的 URL 在瀏覽器中測試此功能。
        </p>
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg"
                                                                 height="16"
                                                                 width="16"/>)
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>
                若要擷取所有中等優先順序的任務，請導覽至 <a
                        href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>：
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="顯示中等優先順序任務表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                不幸的是，透過瀏覽器進行的測試在錯誤情況下是有限的。除非您使用開發者擴充功能，否則瀏覽器不會顯示不成功回應的詳細資訊。
                一個更簡單的替代方案是使用專業工具，例如 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
            </p>
        </step>
        <step>
            <p>
                在 Postman 中，發送針對相同 URL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>
                的 GET 請求。
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="Postman 中顯示回應詳細資訊的 GET 請求"
                 border-effect="rounded"
                 width="706"/>
            <p>
                這顯示了來自伺服器的原始輸出，以及請求和回應的所有詳細資訊。
            </p>
        </step>
        <step>
            <p>
                為了檢查在請求緊急任務時是否返回 <code>404</code> 狀態碼，請向
                <code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>
                發送新的 GET 請求。然後您將在
                <control>Response</control>
                窗格的右上角看到狀態碼。
            </p>
            <img src="tutorial_routing_and_requests_postman_vital.png"
                 alt="Postman 中顯示狀態碼的 GET 請求"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                若要驗證當指定無效優先順序時是否返回 <code>400</code>，請建立另一個帶有無效屬性的 GET 請求：
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="Postman 中帶有「錯誤請求」狀態碼的 GET 請求"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="新增單元測試" id="add-unit-tests">
    <p>
        到目前為止，您已新增兩個路由 — 一個用於擷取所有任務，另一個用於依優先順序擷取任務。
        Postman 等工具使您能夠完整測試這些路由，但它們需要手動檢查並在 Ktor 外部運行。
    </p>
    <p>
        這在原型設計和小型應用程式中是可以接受的。然而，這種方法不適用於需要頻繁執行數千個測試的大型應用程式。更好的解決方案是完全自動化您的測試。
    </p>
    <p>
        Ktor 提供自己的<Links href="/ktor/server-testing" summary="了解如何使用特殊的測試引擎來測試您的伺服器應用程式。">測試框架</Links>以支援路由的自動化驗證。
        接下來，您將為應用程式的現有功能編寫一些測試。
    </p>
    <procedure>
        <step>
            <p>
                在
                <Path>src</Path>
                內建立一個名為
                <Path>test</Path>
                的新目錄，並建立一個名為
                <Path>kotlin</Path>
                的子目錄。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>src/test/kotlin</Path>
                內部建立一個新的
                <Path>ApplicationTest.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>開啟
                <Path>ApplicationTest.kt</Path>
                檔案並新增以下程式碼：
            </p>
            <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import io.ktor.client.request.*&#10;                    import io.ktor.client.statement.*&#10;                    import io.ktor.http.*&#10;                    import io.ktor.server.testing.*&#10;                    import org.junit.Test&#10;                    import kotlin.test.assertContains&#10;                    import kotlin.test.assertEquals&#10;&#10;&#10;                    class ApplicationTest {&#10;                        @Test&#10;                        fun tasksCanBeFoundByPriority() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;                            val body = response.bodyAsText()&#10;&#10;                            assertEquals(HttpStatusCode.OK, response.status)&#10;                            assertContains(body, &quot;Mow the lawn&quot;)&#10;                            assertContains(body, &quot;Paint the fence&quot;)&#10;                        }&#10;&#10;                        @Test&#10;                        fun invalidPriorityProduces400() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;                            assertEquals(HttpStatusCode.BadRequest, response.status)&#10;                        }&#10;&#10;                        @Test&#10;                        fun unusedPriorityProduces404() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;                            assertEquals(HttpStatusCode.NotFound, response.status)&#10;                        }&#10;                    }"/>
            <p>
                在每個測試中，都會建立一個新的 Ktor 實例。這是在測試環境中運行，而不是像 Netty 這樣的 Web 伺服器。專案產生器為您編寫的模組將被載入，這反過來會調用路由函式。然後您可以使用內建的 <code>client</code> 物件向應用程式發送請求，並驗證返回的回應。
            </p>
            <p>
                測試可以在 IDE 內部運行，也可以作為 CI/CD 流程的一部分運行。
            </p>
        </step>
        <step>
            <p>要在 IntelliJ IDE 內部執行測試，請點擊每個測試函式旁邊的裝訂圖示 (<img
                    alt="IntelliJ IDEA 裝訂圖示"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>)。</p>
            <tip>
                有關如何在 IntelliJ IDE 中執行單元測試的更多詳細資訊，請參閱<a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEA 文件</a>。
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="處理 POST 請求" id="handle-post-requests">
    <p>
        您可以按照上述過程為 GET 請求建立任意數量的其他路由。這些路由將允許使用者使用我們喜歡的任何搜尋條件來擷取任務。但使用者也希望能夠建立新任務。
    </p>
    <p>
        在這種情況下，適當的 HTTP 請求類型是 POST。POST 請求通常在使用者完成並提交 HTML 表單時觸發。
    </p>
    <p>
        與 GET 請求不同，POST 請求有一個 <code>body</code>，其中包含表單中存在的所有輸入的名稱和值。此資訊經過編碼，以將不同輸入的資料分開並跳脫非法字元。您無需擔心此過程的細節，因為瀏覽器和 Ktor 將為我們管理它。
    </p>
    <p>
        接下來，您將按照以下步驟擴展現有的應用程式以允許建立新任務：
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">建立一個包含 HTML 表單的靜態內容資料夾</a>。</li>
        <li><a href="#register-folder">讓 Ktor 了解此資料夾，以便其內容可以被提供</a>。</li>
        <li><a href="#add-form-handler">新增一個請求處理器來處理表單提交</a>。</li>
        <li><a href="#test-functionality">測試完成的功能</a>。</li>
    </list>
    <procedure title="建立靜態內容" id="create-static-content">
        <step>
            <p>
                在
                <Path>src/main/resources</Path>
                內部建立一個名為
                <Path>task-ui</Path>
                的新目錄。
                這將是您靜態內容的資料夾。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>task-ui</Path>
                資料夾中，建立一個新的
                <Path>task-form.html</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>開啟新建立的
                <Path>task-form.html</Path>
                檔案並新增以下內容：
            </p>
            <code-block lang="html" code="&lt;!DOCTYPE html&gt;&#10;&lt;html lang=&quot;en&quot;&gt;&#10;&lt;head&gt;&#10;    &lt;meta charset=&quot;UTF-8&quot;&gt;&#10;    &lt;title&gt;Adding a new task&lt;/title&gt;&#10;&lt;/head&gt;&#10;&lt;body&gt;&#10;&lt;h1&gt;Adding a new task&lt;/h1&gt;&#10;&lt;form method=&quot;post&quot; action=&quot;/tasks&quot;&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;name&quot;&gt;Name: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; size=&quot;10&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;description&quot;&gt;Description: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;description&quot; name=&quot;description&quot; size=&quot;20&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;priority&quot;&gt;Priority: &lt;/label&gt;&#10;        &lt;select id=&quot;priority&quot; name=&quot;priority&quot;&gt;&#10;            &lt;option name=&quot;Low&quot;&gt;Low&lt;/option&gt;&#10;            &lt;option name=&quot;Medium&quot;&gt;Medium&lt;/option&gt;&#10;            &lt;option name=&quot;High&quot;&gt;High&lt;/option&gt;&#10;            &lt;option name=&quot;Vital&quot;&gt;Vital&lt;/option&gt;&#10;        &lt;/select&gt;&#10;    &lt;/div&gt;&#10;    &lt;input type=&quot;submit&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
        </step>
    </procedure>
    <procedure title="向 Ktor 註冊資料夾" id="register-folder">
        <step>
            <p>
                導覽至
                <Path>src/main/kotlin/com/example/plugins</Path>
                內的
                <Path>Routing.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                在 <code>Application.configureRouting()</code> 函式中新增對 <code>staticResources()</code> 的以下呼叫：
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            //add the following line&#10;                            staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                            get(&quot;/tasks&quot;) { ... }&#10;&#10;                            get(&quot;/tasks/byPriority/{priority?}&quot;) { … }&#10;                        }&#10;                    }"/>
            <p>這將需要以下 import：</p>
            <code-block lang="kotlin" code="                    import io.ktor.server.http.content.staticResources"/>
        </step>
        <step>
            <p>重新啟動應用程式。</p>
        </step>
        <step>
            <p>
                在瀏覽器中導覽至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。應該會顯示 HTML 表單：
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="顯示 HTML 表單的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="新增表單處理器" id="add-form-handler">
        <p>
            在
            <Path>Routing.kt</Path>
            中，將以下額外路由新增到 <code>configureRouting()</code> 函式中：
        </p>
        <code-block lang="kotlin" code="                fun Application.configureRouting() {&#10;                    routing {&#10;                        //...&#10;&#10;                        //add the following route&#10;                        post(&quot;/tasks&quot;) {&#10;                            val formContent = call.receiveParameters()&#10;&#10;                            val params = Triple(&#10;                                formContent[&quot;name&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;description&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;priority&quot;] ?: &quot;&quot;&#10;                            )&#10;&#10;                            if (params.toList().any { it.isEmpty() }) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@post&#10;                            }&#10;&#10;                            try {&#10;                                val priority = Priority.valueOf(params.third)&#10;                                TaskRepository.addTask(&#10;                                    Task(&#10;                                        params.first,&#10;                                        params.second,&#10;                                        priority&#10;                                    )&#10;                                )&#10;&#10;                                call.respond(HttpStatusCode.NoContent)&#10;                            } catch (ex: IllegalArgumentException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            } catch (ex: IllegalStateException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            }&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            如您所見，新路由被映射到 POST 請求而不是 GET 請求。Ktor 透過呼叫 <code>receiveParameters()</code> 處理請求主體。這將返回請求主體中存在的參數集合。
        </p>
        <p>
            有三個參數，因此您可以將相關值儲存在 <a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a> 中。如果參數不存在，則儲存一個空字串作為替代。
        </p>
        <p>
            如果任何值為空，伺服器將返回狀態碼 <code>400</code> 的回應。然後，它將嘗試將第三個參數轉換為 <code>Priority</code>，如果成功，則將資訊新增到儲存庫中的新 <code>Task</code>。這兩個動作都可能導致異常，在這種情況下，會再次返回狀態碼 <code>400</code>。
        </p>
        <p>
            否則，如果一切成功，伺服器將返回 <code>204</code> 狀態碼（無內容）給客戶端。這表示其請求已成功，但結果沒有新的資訊要發送給他們。
        </p>
    </procedure>
    <procedure title="測試完成的功能" id="test-functionality">
        <step>
            <p>
                重新啟動應用程式。
            </p>
        </step>
        <step>
            <p>在瀏覽器中導覽至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。
            </p>
        </step>
        <step>
            <p>
                填寫帶有範例資料的表單，然後點擊
                <control>Submit</control>
                。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="顯示帶有範例資料的 HTML 表單的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
            <p>當您提交表單時，您不應該被導向新頁面。</p>
        </step>
        <step>
            <p>
                導覽至 URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您應該會看到新任務已新增。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="顯示帶有任務的 HTML 表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                為驗證此功能，請將以下測試新增到 <Path>ApplicationTest.kt</Path>：
            </p>
            <code-block lang="kotlin" code="                    @Test&#10;                    fun newTasksCanBeAdded() = testApplication {&#10;                        application {&#10;                            module()&#10;                        }&#10;&#10;                        val response1 = client.post(&quot;/tasks&quot;) {&#10;                            header(&#10;                                HttpHeaders.ContentType,&#10;                                ContentType.Application.FormUrlEncoded.toString()&#10;                            )&#10;                            setBody(&#10;                                listOf(&#10;                                    &quot;name&quot; to &quot;swimming&quot;,&#10;                                    &quot;description&quot; to &quot;Go to the beach&quot;,&#10;                                    &quot;priority&quot; to &quot;Low&quot;&#10;                                ).formUrlEncode()&#10;                            )&#10;                        }&#10;&#10;                        assertEquals(HttpStatusCode.NoContent, response1.status)&#10;&#10;                        val response2 = client.get(&quot;/tasks&quot;)&#10;                        assertEquals(HttpStatusCode.OK, response2.status)&#10;                        val body = response2.bodyAsText()&#10;&#10;                        assertContains(body, &quot;swimming&quot;)&#10;                        assertContains(body, &quot;Go to the beach&quot;)&#10;                    }"/>
            <p>
                在此測試中，有兩個請求發送到伺服器：一個 POST 請求用於建立新任務，一個 GET 請求用於確認新任務已新增。在發送第一個請求時，使用 <code>setBody()</code> 方法將內容插入請求主體中。測試框架在集合上提供了 <code>formUrlEncode()</code> 擴充方法，它將資料格式化為瀏覽器會做的方式抽象化。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="重構路由" id="refactor-the-routing">
    <p>
        如果您檢查目前的路由，您會發現所有路由都以 <code>/tasks</code> 開頭。您可以將它們放置到自己的子路由中，以消除這種重複：
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;            }"/>
    <p>
        如果您的應用程式達到有多個子路由的階段，那麼將每個子路由放入自己的輔助函式中是合適的。然而，目前還不需要這樣做。
    </p>
    <p>
        您的路由組織得越好，就越容易擴展它們。例如，您可以為按名稱查找任務新增一個路由：
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;                        get(&quot;/byName/{taskName}&quot;) {&#10;                            val name = call.parameters[&quot;taskName&quot;]&#10;                            if (name == null) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@get&#10;                            }&#10;&#10;                            val task = TaskRepository.taskByName(name)&#10;                            if (task == null) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = listOf(task).tasksAsTable()&#10;                            )&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;                }&#10;            }"/>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        您現在已經實作了基本的路由和請求處理功能。此外，您還接觸到了驗證、錯誤處理和單元測試。所有這些主題都將在後續教學中擴展。
    </p>
    <p>
        繼續<Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。">下一個教學</Links>以學習如何為您的任務管理應用程式建立一個產生 JSON 檔案的 RESTful API。
    </p>
</chapter>