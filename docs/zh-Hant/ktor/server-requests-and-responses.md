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
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由是伺服器應用程式中處理傳入請求的核心插件。">路由</Links>
    </p>
</tldr>
<link-summary>
    學習使用 Ktor 在 Kotlin 中處理路由、請求和參數的基礎知識，透過建構一個任務管理器應用程式。
</link-summary>
<card-summary>
    透過建立一個任務管理器應用程式來學習 Ktor 中的路由和請求如何運作。
</card-summary>
<web-summary>
    學習使用 Kotlin 和 Ktor 建立的服務之驗證、錯誤處理和單元測試基礎知識。
</web-summary>
<p>
    在本教學中，您將透過建構一個任務管理器應用程式，學習使用 Ktor 在 Kotlin 中處理路由、請求和參數的基礎知識。
</p>
<p>
    完成本教學後，您將了解如何執行以下操作：
</p>
<list type="bullet">
    <li>處理 GET 和 POST 請求。</li>
    <li>從請求中提取資訊。</li>
    <li>轉換資料時處理錯誤。</li>
    <li>使用單元測試驗證路由。</li>
</list>
<chapter title="前置條件" id="prerequisites">
    <p>
        這是 Ktor 伺服器入門指南的第二個教學。您可以獨立完成本教學，但我們強烈建議您完成先前的教學，以了解如何<Links href="/ktor/server-create-a-new-project" summary="學習如何開啟、執行和測試 Ktor 伺服器應用程式。">建立、開啟和執行新的 Ktor 專案</Links>。
    </p>
    <p>對於 HTTP 請求類型、標頭和狀態碼有基本了解也非常有用。</p>
    <p>我們建議您安裝 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您也可以使用其他您選擇的 IDE。
    </p>
</chapter>
<chapter title="任務管理器應用程式" id="sample-application">
    <p>在本教學中您將逐步建構一個具有以下功能的任務管理器應用程式：</p>
    <list type="bullet">
        <li>將所有可用任務視為 HTML 表格。</li>
        <li>再次以 HTML 形式按優先級和名稱查看任務。</li>
        <li>透過提交 HTML 表單新增額外任務。</li>
    </list>
    <p>
        您將盡可能以最少的工作量實現一些基本功能，然後在七個迭代中改進和擴展此功能。此最低功能將包括一個包含一些模型類型、一個值列表和一個單一路由的專案。
    </p>
</chapter>
<chapter title="顯示靜態 HTML 內容" id="display-static-html">
    <p>在第一個迭代中，您將為應用程式新增一個會回傳靜態 HTML 內容的路由。</p>
    <p>使用 <a href="https://start.ktor.io">Ktor 專案產生器</a>，建立一個名為
        <control>ktor-task-app</control>
        的新專案。您可以接受所有預設選項，但也許希望更改
        <control>artifact</control>
        名稱。
    </p>
    <tip>
        有關建立新專案的更多資訊，請參閱<Links href="/ktor/server-create-a-new-project" summary="學習如何開啟、執行和測試 Ktor 伺服器應用程式。">建立、開啟和執行新的 Ktor 專案</Links>。如果您最近完成了該教學，請隨意重複使用在那裡建立的專案。
    </tip>
    <procedure>
        <step>開啟
            <Path>Routing.kt</Path>
            檔案，它位於
            <Path>src/main/kotlin/com/example/plugins</Path>
            資料夾中。
        </step>
        <step>
            <p>將現有的 <code>Application.configureRouting()</code> 函式替換為以下實作：</p>
            [object Promise]
            <p>透過此操作，您已為 URL <code>/tasks</code> 和 GET 請求類型建立了一個新路由。GET 請求是 HTTP 中最基本的
                請求類型。當使用者在瀏覽器位址列中輸入或點擊常規 HTML 連結時，它會被觸發。 </p>
            <p>
                目前您只是回傳靜態內容。為了通知客戶端您將傳送 HTML，您將 HTTP Content Type 標頭設定為 <code>"text/html"</code>。
            </p>
        </step>
        <step>
            <p>
                新增以下 import 以存取 <code>ContentType</code> 物件：
            </p>
            [object Promise]
        </step>
        <step>
            <p>在 IntelliJ IDEA 中，點擊 <Path>Application.kt</Path> 檔案中 <code>main()</code>
                函式旁的執行側邊圖示（<img alt="intelliJ IDEA 執行應用程式圖示"
                                                         src="intellij_idea_gutter_icon.svg" height="16"
                                                         width="16"/>）以啟動應用程式。
            </p>
        </step>
        <step>
            <p>
                在您的瀏覽器中導航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您應該會看到待辦事項列表顯示：
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="顯示包含兩個項目的待辦事項列表的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="實作任務模型" id="implement-a-task-model">
    <p>
        您已經建立專案並設定了基本路由，接下來您將透過執行以下操作來擴展您的應用程式：
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">建立模型類型來表示任務。</a></li>
        <li><a href="#create-sample-values">宣告一個包含範例值的任務列表。</a></li>
        <li><a href="#add-a-route">修改路由和請求處理器以回傳此列表。</a></li>
        <li><a href="#test">使用瀏覽器測試新功能是否正常運作。</a></li>
    </list>
    <procedure title="建立模型類型" id="create-model-types">
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
                檔案，新增以下 <code>enum</code> 來表示優先級，並新增一個 <code>class</code> 來表示任務：
            </p>
            [object Promise]
        </step>
        <step>
            <p>您將在 HTML 表格中將任務資訊傳送給客戶端，因此也請新增以下擴展函式：</p>
            [object Promise]
            <p>
                函式 <code>Task.taskAsRow()</code> 使得 <code>Task</code> 物件能夠呈現為表格列，而 <code><![CDATA[List<Task>.tasksAsTable()]]></code>
                則允許任務列表呈現為表格。
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
                並新增以下程式碼來定義任務列表：
            </p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="新增路由" id="add-a-route">
        <step>
            <p>開啟
                <Path>Routing.kt</Path>
                檔案，並將現有的 <code>Application.configureRouting()</code> 函式替換為以下實作：
            </p>
            [object Promise]
            <p>
                您現在不是向客戶端回傳靜態內容，而是提供一個任務列表。由於列表不能直接透過網路傳送，因此必須將其轉換為客戶端能夠理解的格式。在本例中，任務被轉換為 HTML 表格。
            </p>
        </step>
        <step>
            <p>新增所需的 import：</p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="測試新功能" id="test">
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕（<img alt="intelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg"
                                                                 height="16"
                                                                 width="16"/>）
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>在您的瀏覽器中導航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。
                它應該顯示一個包含任務的 HTML 表格：</p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="顯示包含四行表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
            <p>如果是這樣，恭喜！應用程式的基本功能運作正常。</p>
        </step>
    </procedure>
</chapter>
<chapter title="重構模型" id="refactor-the-model">
    <p>
        在繼續擴展應用程式功能之前，
        您需要透過將值列表封裝在儲存庫中來重構設計。這將允許您集中管理資料，從而專注於 Ktor 特定的程式碼。
    </p>
    <procedure>
        <step>
            <p>
                返回
                <Path>TaskRepository.kt</Path>
                檔案，並將現有的任務列表替換為以下程式碼：
            </p>
            [object Promise]
            <p>
                這實作了一個非常簡單的基於列表的任務資料儲存。為了範例的目的，任務新增的順序將被保留，但透過拋出異常將不允許重複。</p>
            <p>在後續教學中，您將學習如何透過 <a href="https://github.com/JetBrains/Exposed">Exposed 函式庫</a>實作連接到關聯式資料庫的儲存庫。
            </p>
            <p>
                目前，您將在路由中利用該儲存庫。
            </p>
        </step>
        <step>
            <p>
                開啟
                <Path>Routing.kt</Path>
                檔案，並將現有的 <code>Application.configureRouting()</code> 函式替換為以下實作：
            </p>
            [object Promise]
            <p>
                當請求到達時，儲存庫用於獲取當前的任務列表。然後，建構一個包含這些任務的 HTTP 回應。
            </p>
        </step>
    </procedure>
    <procedure title="測試重構後的程式碼">
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕（<img alt="intelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg" height="16"
                                                                 width="16"/>）
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>
                在您的瀏覽器中導航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。
                輸出應該保持不變，顯示 HTML 表格：
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="顯示包含四行表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="處理參數" id="work-with-parameters">
    <p>
        在本次迭代中，您將允許使用者按優先級查看任務。為此，您的應用程式必須允許 GET 請求訪問以下 URL：
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
        ，其中 <code>{priority?}</code> 表示一個路徑參數，您需要在執行時提取該參數，問號用於指示參數是可選的。查詢參數可以隨意命名，但 <code>priority</code> 似乎是顯而易見的選擇。
    </p>
    <p>
        處理請求的過程可以總結如下：
    </p>
    <list type="decimal">
        <li>從請求中提取名為 <code>priority</code> 的路徑參數。</li>
        <li>如果此參數不存在，則回傳 <code>400</code> 狀態（錯誤請求）。</li>
        <li>將參數的文字值轉換為 <code>Priority</code> enum 值。</li>
        <li>如果失敗，則回傳狀態碼為 <code>400</code> 的回應。</li>
        <li>使用儲存庫查找所有具有指定優先級的任務。</li>
        <li>如果沒有匹配的任務，則回傳 <code>404</code> 狀態（未找到）。</li>
        <li>回傳匹配的任務，格式化為 HTML 表格。</li>
    </list>
    <p>
        您將首先實作此功能，然後找到最佳方法來檢查其是否正常運作。
    </p>
    <procedure title="新增路由">
        <p>開啟
            <Path>Routing.kt</Path>
            檔案，並在您的程式碼中新增以下路由，如下所示：
        </p>
        [object Promise]
        <p>
            如上所述，您已為 URL
            <code>/tasks/byPriority/{priority?}</code>
            撰寫了一個處理程式。符號
            <code>priority</code>
            代表使用者新增的路徑參數。不幸的是，在伺服器端無法保證這是對應 Kotlin 列舉中的四個值之一，
            因此必須手動檢查。
        </p>
        <p>
            如果路徑參數不存在，伺服器會向客戶端回傳 <code>400</code> 狀態碼。
            否則，它會提取參數的值並嘗試將其轉換為列舉的成員。如果轉換失敗，將拋出異常，伺服器會捕獲該異常並回傳 <code>400</code> 狀態碼。
        </p>
        <p>
            假設轉換成功，儲存庫會用於查找匹配的 <code>Tasks</code>。如果
            沒有指定優先級的任務，伺服器會回傳 <code>404</code> 狀態碼，否則會以 HTML 表格的形式回傳匹配結果。
        </p>
    </procedure>
    <procedure title="測試新路由">
        <p>
            您可以透過請求不同的 URL 在瀏覽器中測試此功能。
        </p>
        <step>
            <p>在 IntelliJ IDEA 中，點擊重新執行按鈕（<img alt="intelliJ IDEA 重新執行按鈕圖示"
                                                                 src="intellij_idea_rerun_icon.svg"
                                                                 height="16"
                                                                 width="16"/>）
                以重新啟動應用程式。</p>
        </step>
        <step>
            <p>
                若要擷取所有中優先級任務，請導航至 <a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>：
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="顯示中優先級任務表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                不幸的是，透過瀏覽器進行的錯誤測試是有限的。除非您使用開發者擴充功能，否則瀏覽器不會顯示失敗回應的詳細資訊。
                一個更簡單的替代方案是使用專業工具，例如 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
            </p>
        </step>
        <step>
            <p>
                在 Postman 中，對相同的 URL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>
                傳送 GET 請求。
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="Postman 中顯示回應詳細資訊的 GET 請求"
                 border-effect="rounded"
                 width="706"/>
            <p>
                這顯示了伺服器的原始輸出，以及請求和回應的所有詳細資訊。
            </p>
        </step>
        <step>
            <p>
                若要檢查請求關鍵任務時是否回傳 <code>404</code> 狀態碼，請向
                <code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>
                傳送新的 GET 請求。然後，您將在
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
                若要驗證指定無效優先級時回傳 <code>400</code>，請建立另一個帶有無效屬性的 GET 請求：
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="Postman 中帶有錯誤請求狀態碼的 GET 請求"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="新增單元測試" id="add-unit-tests">
    <p>
        到目前為止，您已新增了兩個路由 - 一個用於擷取所有任務，另一個用於按優先級擷取任務。像 Postman 這樣的工具使您能夠充分測試這些路由，但它們需要手動檢查並且在 Ktor 外部執行。
    </p>
    <p>
        這在原型設計和小應用程式中是可接受的。然而，這種方法無法擴展到需要頻繁執行數千個測試的大型應用程式。更好的解決方案是完全自動化您的測試。
    </p>
    <p>
        Ktor 提供了自己的<Links href="/ktor/server-testing" summary="了解如何使用特殊的測試引擎測試您的伺服器應用程式。">測試框架</Links>來支援路由的自動驗證。
        接下來，您將為應用程式的現有功能編寫一些測試。
    </p>
    <procedure>
        <step>
            <p>
                在
                <Path>src</Path>
                中建立一個名為
                <Path>test</Path>
                的新目錄，並在其中建立一個名為
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
            [object Promise]
            <p>
                在每個測試中，都會建立一個新的 Ktor 實例。這是在測試環境中執行，而不是像 Netty 這樣的 Web 伺服器。
                專案產生器為您編寫的模組將被載入，這反過來會呼叫路由函式。然後，您可以使用內建的 <code>client</code> 物件向應用程式傳送請求，並驗證回傳的回應。
            </p>
            <p>
                該測試可以在 IDE 內部或作為您的 CI/CD 管道的一部分執行。
            </p>
        </step>
        <step>
            <p>若要在 IntelliJ IDE 中執行測試，點擊每個測試函式旁的側邊圖示（<img
                    alt="intelliJ IDEA 側邊圖示"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>）。</p>
            <tip>
                有關如何在 IntelliJ IDE 中執行單元測試的更多詳細資訊，請參閱 <a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEA 文件</a>。
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="處理 POST 請求" id="handle-post-requests">
    <p>
        您可以遵循上述過程來為 GET 請求建立任意數量的額外路由。這將允許使用者使用任何他們喜歡的搜尋條件來獲取任務。但使用者也會希望能夠建立新任務。
    </p>
    <p>
        在這種情況下，適當的 HTTP 請求類型是 POST。POST 請求通常在使用者填寫並提交 HTML 表單時觸發。
    </p>
    <p>
        與 GET 請求不同，POST 請求有一個 <code>body</code>，其中包含表單上所有輸入的名稱和值。此資訊經過編碼，以將資料從不同的輸入中分離並轉義非法字元。您無需擔心此過程的細節，因為瀏覽器和 Ktor 會為我們管理它。
    </p>
    <p>
        接下來，您將透過以下步驟擴展現有應用程式以允許建立新任務：
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">建立一個包含 HTML 表單的靜態內容資料夾</a>。</li>
        <li><a href="#register-folder">讓 Ktor 知道此資料夾，以便其內容可以被提供服務</a>。</li>
        <li><a href="#add-form-handler">新增一個請求處理程式來處理表單提交</a>。</li>
        <li><a href="#test-functionality">測試已完成的功能</a>。</li>
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
                檔案，並將以下內容新增到其中：
            </p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="向 Ktor 註冊資料夾" id="register-folder">
        <step>
            <p>
                導航至
                <Path>src/main/kotlin/com/example/plugins</Path>
                中的
                <Path>Routing.kt</Path>
                檔案。
            </p>
        </step>
        <step>
            <p>
                將以下對 <code>staticResources()</code> 的呼叫新增到 <code>Application.configureRouting()</code>
                函式中：
            </p>
            [object Promise]
            <p>這將需要以下 import：</p>
            [object Promise]
        </step>
        <step>
            <p>重新啟動應用程式。 </p>
        </step>
        <step>
            <p>
                在您的瀏覽器中導航至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。應該會顯示 HTML 表單：
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="顯示 HTML 表單的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="新增表單處理程式" id="add-form-handler">
        <p>
            在
            <Path>Routing.kt</Path>
            中，將以下額外路由新增到 <code>configureRouting()</code> 函式中：
        </p>
        [object Promise]
        <p>
            如您所見，新路由映射到 POST 請求而非 GET 請求。Ktor
            透過呼叫 <code>receiveParameters()</code> 處理請求主體。這會回傳請求主體中存在的參數集合。
        </p>
        <p>
            有三個參數，因此您可以將相關值儲存在 <a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a> 中。如果參數
            不存在，則儲存空字串。
        </p>
        <p>
            如果任何值為空，伺服器將回傳狀態碼
            為 <code>400</code> 的回應。然後，它將嘗試將第三個參數轉換為 <code>Priority</code>
            ，如果成功，則將資訊新增到儲存庫中的新 <code>Task</code>。這兩種操作都可能導致異常，在這種情況下，再次回傳狀態碼 <code>400</code>。
        </p>
        <p>
            否則，如果一切成功，伺服器將向客戶端回傳 <code>204</code> 狀態碼（
            無內容）。這
            表示他們的請求已成功，但沒有新的資訊可以傳送給他們。
        </p>
    </procedure>
    <procedure title="測試已完成的功能" id="test-functionality">
        <step>
            <p>
                重新啟動應用程式。
            </p>
        </step>
        <step>
            <p>在瀏覽器中導航至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。
            </p>
        </step>
        <step>
            <p>
                填寫範例資料並點擊
                <control>提交</control>
                。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="顯示帶有範例資料的 HTML 表單的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
            <p>提交表單時，您不應被導向新頁面。</p>
        </step>
        <step>
            <p>
                導航至 URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您應該
                會看到新任務已新增。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="顯示帶有任務的 HTML 表格的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                若要驗證此功能，請將以下測試新增到 <Path>ApplicationTest.kt</Path>：
            </p>
            [object Promise]
            <p>
                在此測試中，會向伺服器傳送兩個請求：一個 POST 請求用於建立新任務，一個 GET
                請求用於確認新任務已新增。在發出第一個請求時，
                <code>setBody()</code> 方法用於將內容插入請求主體中。測試
                框架在集合上提供了一個 <code>formUrlEncode()</code>
                擴展方法，它抽象了像瀏覽器那樣格式化資料的過程。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="重構路由" id="refactor-the-routing">
    <p>
        如果您檢查目前的路由，您會發現所有路由都以 <code>/tasks</code> 開頭。您可以
        透過將它們放入自己的子路由中來消除這種重複：
    </p>
    [object Promise]
    <p>
        如果您的應用程式達到有多個子路由的階段，那麼將每個子路由放入其自己的輔助函式中將是適當的。然而，目前還不需要這樣做。
    </p>
    <p>
        您的路由組織得越好，就越容易擴展它們。例如，您可以新增一個按名稱查找任務的路由：
    </p>
    [object Promise]
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        您現在已實作基本路由和請求處理功能。此外，您還接觸了驗證、錯誤處理和單元測試。所有這些主題都將在後續教學中擴展。
    </p>
    <p>
        繼續<Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建構後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">下一個教學</Links>，學習如何為您的任務管理器建立一個產生 JSON 檔案的 RESTful API。
    </p>
</chapter>
</topic>