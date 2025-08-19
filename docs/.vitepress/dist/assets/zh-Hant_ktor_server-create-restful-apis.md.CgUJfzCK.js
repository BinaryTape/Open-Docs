import{_ as A,a as N,b as R,c as w,d as J,e as I,f as H,g as j,h as q}from"./chunks/tutorial_creating_restful_apis_delete_task.BtAbUZys.js";import{_ as K}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as g}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as y}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as D,C as u,c as O,o as L,G as o,w as i,j as l,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-create-restful-apis.md","filePath":"zh-Hant/ktor/server-create-restful-apis.md","lastUpdated":1755457140000}'),B={name:"zh-Hant/ktor/server-create-restful-apis.md"};function z(M,t,G,$,U,V){const T=u("show-structure"),d=u("Links"),v=u("tldr"),P=u("card-summary"),S=u("web-summary"),E=u("link-summary"),f=u("list"),a=u("chapter"),e=u("step"),m=u("control"),s=u("Path"),p=u("procedure"),r=u("code-block"),b=u("format"),k=u("ui-path"),x=u("note"),C=u("topic");return L(),O("div",null,[o(C,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"如何使用 Ktor 在 Kotlin 中建立 RESTful API",id:"server-create-restful-apis","help-id":"create-restful-apis"},{default:i(()=>[o(T,{for:"chapter",depth:"2"}),o(v,null,{default:i(()=>[t[9]||(t[9]=l("p",null,[l("b",null,"程式碼範例"),n(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-restful-api"}," tutorial-server-restful-api ")],-1)),l("p",null,[t[3]||(t[3]=l("b",null,"使用的外掛程式",-1)),t[4]||(t[4]=n(": ")),o(d,{href:"/ktor/server-routing",summary:"路由是伺服器應用程式中用於處理傳入請求的核心外掛程式。"},{default:i(()=>t[0]||(t[0]=[n("Routing")])),_:1}),t[5]||(t[5]=n(",")),o(d,{href:"/ktor/server-static-content",summary:"了解如何提供靜態內容，例如樣式表、指令碼、影像等。"},{default:i(()=>t[1]||(t[1]=[n("Static Content")])),_:1}),t[6]||(t[6]=n(", ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個用途：協商用戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:i(()=>t[2]||(t[2]=[n("Content Negotiation")])),_:1}),t[7]||(t[7]=n(", ")),t[8]||(t[8]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(P,null,{default:i(()=>t[10]||(t[10]=[n(" 了解如何使用 Ktor 建立 RESTful API。本教學課程涵蓋真實範例的設定、路由和測試。 ")])),_:1}),o(S,null,{default:i(()=>t[11]||(t[11]=[n(" 學習如何使用 Ktor 建立 Kotlin RESTful API。本教學課程涵蓋真實範例的設定、路由和測試。這是 Kotlin 後端開發人員的理想入門教學課程。 ")])),_:1}),o(E,null,{default:i(()=>t[12]||(t[12]=[n(" 學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。 ")])),_:1}),t[230]||(t[230]=l("p",null," 在本教學課程中，我們將說明如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個生成 JSON 檔案的 RESTful API 範例。 ",-1)),l("p",null,[t[14]||(t[14]=n(" 在")),o(d,{href:"/ktor/server-requests-and-responses",summary:"透過建立任務管理器應用程式，了解使用 Ktor 在 Kotlin 中進行路由、處理請求和參數的基礎知識。"},{default:i(()=>t[13]||(t[13]=[n("上一個教學課程")])),_:1}),t[15]||(t[15]=n("中，我們向您介紹了驗證、錯誤處理和單元測試的基礎知識。本教學課程將透過建立一個用於管理任務的 RESTful 服務來擴展這些主題。 "))]),t[231]||(t[231]=l("p",null," 您將學習如何執行以下操作： ",-1)),o(f,null,{default:i(()=>[t[19]||(t[19]=l("li",null,"建立使用 JSON 序列化的 RESTful 服務。",-1)),l("li",null,[t[17]||(t[17]=n("了解")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個用途：協商用戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:i(()=>t[16]||(t[16]=[n("內容協商 (Content Negotiation)")])),_:1}),t[18]||(t[18]=n("的過程。"))]),t[20]||(t[20]=l("li",null,"在 Ktor 中定義 REST API 的路由。",-1))]),_:1}),o(a,{title:"先決條件",id:"prerequisites"},{default:i(()=>[l("p",null,[t[22]||(t[22]=n("您可以獨立執行本教學課程， 但是，我們強烈建議您完成上一個教學課程，以了解如何")),o(d,{href:"/ktor/server-requests-and-responses",summary:"透過建立任務管理器應用程式，了解使用 Ktor 在 Kotlin 中進行路由、處理請求和參數的基礎知識。"},{default:i(()=>t[21]||(t[21]=[n("處理請求並生成回應")])),_:1}),t[23]||(t[23]=n("。 "))]),t[24]||(t[24]=l("p",null,[n("我們建議您安裝"),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),n("，但您可以使用您選擇的其他 IDE。 ")],-1))]),_:1}),o(a,{title:"您好，RESTful 任務管理器",id:"hello-restful-task-manager"},{default:i(()=>[l("p",null,[t[26]||(t[26]=n("在本教學課程中，您將把現有的任務管理器重寫為 RESTful 服務。為此，您將使用多個 Ktor ")),o(d,{href:"/ktor/server-plugins",summary:"外掛程式提供常見功能，例如序列化、內容編碼、壓縮等。"},{default:i(()=>t[25]||(t[25]=[n("外掛程式")])),_:1}),t[27]||(t[27]=n("。"))]),t[70]||(t[70]=l("p",null," 雖然您可以手動將其新增到您現有的專案，但更簡單的方法是生成一個新專案，然後逐步新增上一個教學課程的程式碼。您將在執行過程中重複所有程式碼，因此您不需要手邊有上一個專案。 ",-1)),o(p,{title:"建立帶有外掛程式的新專案"},{default:i(()=>[o(e,null,{default:i(()=>t[28]||(t[28]=[l("p",null,[n(" 導航至 "),l("a",{href:"https://start.ktor.io/"},"Ktor Project Generator"),n(" 。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[31]||(t[31]=n("在 ")),o(m,null,{default:i(()=>t[29]||(t[29]=[n("專案 artifact")])),_:1}),t[32]||(t[32]=n(" 欄位中，輸入 ")),o(s,null,{default:i(()=>t[30]||(t[30]=[n("com.example.ktor-rest-task-app")])),_:1}),t[33]||(t[33]=n(" 作為您的專案 artifact 名稱。 ")),t[34]||(t[34]=l("img",{src:A,alt:"在 Ktor 專案產生器中命名專案 artifact",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[36]||(t[36]=n(" 在外掛程式區段中，透過點擊 ")),o(m,null,{default:i(()=>t[35]||(t[35]=[n("新增")])),_:1}),t[37]||(t[37]=n(" 按鈕，搜尋並新增以下外掛程式： "))]),o(f,{type:"bullet"},{default:i(()=>t[38]||(t[38]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1)])),_:1}),t[39]||(t[39]=l("p",null,[l("img",{src:K,alt:"在 Ktor 專案產生器中新增外掛程式","border-effect":"line",style:{},width:"706"}),n(" 新增外掛程式後，您將在專案設定下方看到所有四個外掛程式。 "),l("img",{src:N,alt:"Ktor 專案產生器中的外掛程式列表","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[41]||(t[41]=n(" 點擊 ")),o(m,null,{default:i(()=>t[40]||(t[40]=[n("下載")])),_:1}),t[42]||(t[42]=n(" 按鈕以產生並下載您的 Ktor 專案。 "))])]),_:1})]),_:1}),o(p,{title:"新增啟動程式碼",id:"add-starter-code"},{default:i(()=>[o(e,null,{default:i(()=>t[43]||(t[43]=[l("p",null,[n("在 IntelliJ IDEA 中開啟您的專案，如"),l("a",{href:"./server-create-a-new-project#open-explore-run"},"在 IntelliJ IDEA 中開啟、探索並執行您的 Ktor 專案"),n("教學課程中先前所述。")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[46]||(t[46]=n(" 導航至 ")),o(s,null,{default:i(()=>t[44]||(t[44]=[n("src/main/kotlin/com/example")])),_:1}),t[47]||(t[47]=n(" 並建立一個名為 ")),o(s,null,{default:i(()=>t[45]||(t[45]=[n("model")])),_:1}),t[48]||(t[48]=n(" 的子套件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[51]||(t[51]=n(" 在 ")),o(s,null,{default:i(()=>t[49]||(t[49]=[n("model")])),_:1}),t[52]||(t[52]=n(" 套件中，建立一個新的 ")),o(s,null,{default:i(()=>t[50]||(t[50]=[n("Task.kt")])),_:1}),t[53]||(t[53]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[55]||(t[55]=n(" 開啟 ")),o(s,null,{default:i(()=>t[54]||(t[54]=[n("Task.kt")])),_:1}),t[56]||(t[56]=n(" 檔案並新增一個 ")),t[57]||(t[57]=l("code",null,"enum",-1)),t[58]||(t[58]=n(" 來表示優先順序，以及一個 ")),t[59]||(t[59]=l("code",null,"class",-1)),t[60]||(t[60]=n(" 來表示任務： "))]),o(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[61]||(t[61]=l("p",null,[n(" 在上一個教學課程中，您使用擴充功能將 "),l("code",null,"Task"),n(" 轉換為 HTML。在此情況下， "),l("code",null,"Task"),n(" 類別使用來自 "),l("code",null,"kotlinx.serialization"),n(" 程式庫的 "),l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"},[l("code",null,"Serializable")]),n(" 類型進行註解。 ")],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[63]||(t[63]=n(" 開啟 ")),o(s,null,{default:i(()=>t[62]||(t[62]=[n("Routing.kt")])),_:1}),t[64]||(t[64]=n(" 檔案並將現有程式碼替換為以下實作： "))]),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            get("/tasks") {
                                call.respond(
                                    listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )
                                )
                            }
                        }
                    }`}),t[65]||(t[65]=l("p",null,[n(" 與上一個教學課程類似，您為對 URL "),l("code",null,"/tasks"),n(" 的 GET 請求建立了路由。 這次，您不再手動轉換任務列表，而是直接回傳列表。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[66]||(t[66]=[l("p",null,[n("在 IntelliJ IDEA 中，點擊執行按鈕 ("),l("img",{src:g,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"}),n(") 以啟動應用程式。")],-1)])),_:1}),o(e,null,{default:i(()=>t[67]||(t[67]=[l("p",null,[n(" 在瀏覽器中導航至"),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("。您應該會看到任務列表的 JSON 版本，如下所示： ")],-1)])),_:1}),t[68]||(t[68]=l("img",{src:R,alt:"瀏覽器畫面中顯示的 JSON 資料","border-effect":"rounded",width:"706"},null,-1)),t[69]||(t[69]=l("p",null,"顯然，我們代表執行了大量工作。究竟發生了什麼事？",-1))]),_:1})]),_:1}),o(a,{title:"了解內容協商",id:"content-negotiation"},{default:i(()=>[o(a,{title:"透過瀏覽器進行內容協商",id:"via-browser"},{default:i(()=>[l("p",null,[t[73]||(t[73]=n(" 當您建立專案時，您包含了")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個用途：協商用戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:i(()=>t[71]||(t[71]=[n("Content Negotiation")])),_:1}),t[74]||(t[74]=n(" 外掛程式。此外掛程式會查看用戶端可以呈現的內容類型，並將其與當前服務可以提供的內容類型進行匹配。因此，稱為 ")),o(b,{style:{}},{default:i(()=>t[72]||(t[72]=[n("內容協商")])),_:1}),t[75]||(t[75]=n(" 。 "))]),t[81]||(t[81]=l("p",null,[n(" 在 HTTP 中，用戶端透過 "),l("code",null,"Accept"),n(" 標頭發出它可以呈現的內容類型訊號。此標頭的值是一個或多個內容類型。在上面的情況下，您可以使用瀏覽器內建的開發工具檢查此標頭的值。 ")],-1)),t[82]||(t[82]=l("p",null," 考慮以下範例： ",-1)),o(r,{code:"                text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}),t[83]||(t[83]=l("p",null,[n("請注意 "),l("code",null,[l("em",null,"/")]),n(" 的包含。此標頭表示它接受 HTML、XML 或影像——但它也將接受任何其他內容 類型。")],-1)),l("p",null,[t[78]||(t[78]=n("Content Negotiation 外掛程式需要找到一種格式將資料傳回瀏覽器。如果您查看專案中生成的程式碼，您會發現 ")),o(s,null,{default:i(()=>t[76]||(t[76]=[n("src/main/kotlin/com/example")])),_:1}),t[79]||(t[79]=n(" 中包含一個名為 ")),o(s,null,{default:i(()=>t[77]||(t[77]=[n("Serialization.kt")])),_:1}),t[80]||(t[80]=n(" 的檔案，其中包含以下內容： "))]),o(r,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[84]||(t[84]=l("p",null,[n(" 此程式碼安裝了 "),l("code",null,"ContentNegotiation"),n(" 外掛程式，同時也配置了 "),l("code",null,"kotlinx.serialization"),n(" 外掛程式。有了這個，當用戶端發送請求時，伺服器可以回傳序列化為 JSON 的物件。 ")],-1)),t[85]||(t[85]=l("p",null,[n(" 在來自瀏覽器的請求情況下，"),l("code",null,"ContentNegotiation"),n(" 外掛程式知道它只能回傳 JSON，並且瀏覽器將嘗試顯示它收到的任何內容。因此請求成功。 ")],-1))]),_:1}),o(p,{title:"透過 JavaScript 進行內容協商",id:"via-javascript"},{default:i(()=>[t[99]||(t[99]=l("p",null,[n(" 在生產環境中，您不會希望直接在瀏覽器中顯示 JSON。相反，瀏覽器中會執行 JavaScript 程式碼，該程式碼將發出請求，然後將返回的資料作為單頁應用程式 (SPA) 的一部分顯示。通常，這種應用程式會使用 "),l("a",{href:"https://react.dev/"},"React"),n("、 "),l("a",{href:"https://angular.io/"},"Angular"),n(" 或 "),l("a",{href:"https://vuejs.org/"},"Vue.js"),n(" 等框架來編寫。 ")],-1)),o(e,null,{default:i(()=>[l("p",null,[t[88]||(t[88]=n(" 為了模擬這一點，開啟 ")),o(s,null,{default:i(()=>t[86]||(t[86]=[n("src/main/resources/static")])),_:1}),t[89]||(t[89]=n(" 中的 ")),o(s,null,{default:i(()=>t[87]||(t[87]=[n("index.html")])),_:1}),t[90]||(t[90]=n(" 頁面，並將預設內容替換為以下內容： "))]),o(r,{lang:"html",code:`<html>
<head>
    <title>A Simple SPA For Tasks</title>
    <script type="application/javascript">
        function fetchAndDisplayTasks() {
            fetchTasks()
                .then(tasks => displayTasks(tasks))
        }

        function fetchTasks() {
            return fetch(
                "/tasks",
                {
                    headers: { 'Accept': 'application/json' }
                }
            ).then(resp => resp.json());
        }

        function displayTasks(tasks) {
            const tasksTableBody = document.getElementById("tasksTableBody")
            tasks.forEach(task => {
                const newRow = taskRow(task);
                tasksTableBody.appendChild(newRow);
            });
        }

        function taskRow(task) {
            return tr([
                td(task.name),
                td(task.description),
                td(task.priority)
            ]);
        }

        function tr(children) {
            const node = document.createElement("tr");
            children.forEach(child => node.appendChild(child));
            return node;
        }

        function td(text) {
            const node = document.createElement("td");
            node.appendChild(document.createTextNode(text));
            return node;
        }
    <\/script>
</head>
<body>
<h1>Viewing Tasks Via JS</h1>
<form action="javascript:fetchAndDisplayTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table>
    <thead>
    <tr><th>Name</th><th>Description</th><th>Priority</th></tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),t[91]||(t[91]=l("p",null,[n(" 此頁面包含一個 HTML 表單和一個空表。提交表單後，一個 JavaScript 事件處理常式 會向 "),l("code",null,"/tasks"),n(" 端點發送請求，並將 "),l("code",null,"Accept"),n(" 標頭設定為 "),l("code",null,"application/json"),n("。返回的資料隨後會被反序列化並新增到 HTML 表格中。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[92]||(t[92]=[l("p",null,[n(" 在 IntelliJ IDEA 中，點擊重新執行按鈕 ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新執行圖示"}),n(") 以重新啟動應用程式。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[94]||(t[94]=n(" 導航至 URL ")),t[95]||(t[95]=l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1)),t[96]||(t[96]=n("。 您應該能夠透過點擊 ")),o(m,null,{default:i(()=>t[93]||(t[93]=[n("檢視任務")])),_:1}),t[97]||(t[97]=n(" 按鈕來擷取資料： "))]),t[98]||(t[98]=l("img",{src:w,alt:"顯示按鈕和以 HTML 表格顯示任務的瀏覽器視窗","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"新增 GET 路由",id:"porting-get-routes"},{default:i(()=>[l("p",null,[t[101]||(t[101]=n(" 既然您已熟悉內容協商的過程，請繼續將 ")),o(d,{href:"/ktor/server-requests-and-responses",summary:"透過建立任務管理器應用程式，了解使用 Ktor 在 Kotlin 中進行路由、處理請求和參數的基礎知識。"},{default:i(()=>t[100]||(t[100]=[n("上一個教學課程")])),_:1}),t[102]||(t[102]=n("的功能轉移過來。 "))]),o(a,{title:"重複使用任務儲存庫",id:"task-repository"},{default:i(()=>[t[111]||(t[111]=l("p",null," 您可以重複使用任務儲存庫，無需任何修改，所以讓我們首先這樣做。 ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[105]||(t[105]=n(" 在 ")),o(s,null,{default:i(()=>t[103]||(t[103]=[n("model")])),_:1}),t[106]||(t[106]=n(" 套件中，建立一個新的 ")),o(s,null,{default:i(()=>t[104]||(t[104]=[n("TaskRepository.kt")])),_:1}),t[107]||(t[107]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[109]||(t[109]=n(" 開啟 ")),o(s,null,{default:i(()=>t[108]||(t[108]=[n("TaskRepository.kt")])),_:1}),t[110]||(t[110]=n(" 並新增以下程式碼： "))]),o(r,{lang:"kotlin",code:`package com.example.model

object TaskRepository {
    private val tasks = mutableListOf(
        Task("cleaning", "Clean the house", Priority.Low),
        Task("gardening", "Mow the lawn", Priority.Medium),
        Task("shopping", "Buy the groceries", Priority.High),
        Task("painting", "Paint the fence", Priority.Medium)
    )

    fun allTasks(): List<Task> = tasks

    fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    fun addTask(task: Task) {
        if (taskByName(task.name) != null) {
            throw IllegalStateException("Cannot duplicate task names!")
        }
        tasks.add(task)
    }
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"重複使用 GET 請求的路由",id:"get-requests"},{default:i(()=>[t[121]||(t[121]=l("p",null," 現在您已經建立了儲存庫，您可以實作 GET 請求的路由。由於您不再需要擔心將任務轉換為 HTML，因此之前的 程式碼可以簡化： ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[114]||(t[114]=n(" 導航至 ")),o(s,null,{default:i(()=>t[112]||(t[112]=[n("src/main/kotlin/com/example")])),_:1}),t[115]||(t[115]=n(" 中的 ")),o(s,null,{default:i(()=>t[113]||(t[113]=[n("Routing.kt")])),_:1}),t[116]||(t[116]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[t[118]||(t[118]=l("p",null,[n(" 使用以下實作更新 "),l("code",null,"Application.configureRouting()"),n(" 函式中 "),l("code",null,"/tasks"),n(" 路由的程式碼： ")],-1)),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.Priority
                    import com.example.model.TaskRepository
                    import io.ktor.http.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            //已更新的實作
                            route("/tasks") {
                                get {
                                    val tasks = TaskRepository.allTasks()
                                    call.respond(tasks)
                                }

                                get("/byName/{taskName}") {
                                    val name = call.parameters["taskName"]
                                    if (name == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@get
                                    }

                                    val task = TaskRepository.taskByName(name)
                                    if (task == null) {
                                        call.respond(HttpStatusCode.NotFound)
                                        return@get
                                    }
                                    call.respond(task)
                                }
                                get("/byPriority/{priority}") {
                                    val priorityAsText = call.parameters["priority"]
                                    if (priorityAsText == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@get
                                    }
                                    try {
                                        val priority = Priority.valueOf(priorityAsText)
                                        val tasks = TaskRepository.tasksByPriority(priority)

                                        if (tasks.isEmpty()) {
                                            call.respond(HttpStatusCode.NotFound)
                                            return@get
                                        }
                                        call.respond(tasks)
                                    } catch (ex: IllegalArgumentException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[119]||(t[119]=l("p",null," 有了這個，您的伺服器可以回應以下 GET 請求：",-1)),o(f,null,{default:i(()=>t[117]||(t[117]=[l("li",null,[l("code",null,"/tasks"),n(" 返回儲存庫中的所有任務。")],-1),l("li",null,[l("code",null,"/tasks/byName/{taskName}"),n(" 返回按指定 "),l("code",null,"taskName"),n(" 過濾的任務。 ")],-1),l("li",null,[l("code",null,"/tasks/byPriority/{priority}"),n(" 返回按指定 "),l("code",null,"priority"),n(" 過濾的任務。 ")],-1)])),_:1})]),_:1}),o(e,null,{default:i(()=>t[120]||(t[120]=[l("p",null,[n(" 在 IntelliJ IDEA 中，點擊重新執行按鈕 ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新執行圖示"}),n(") 以重新啟動應用程式。 ")],-1)])),_:1})]),_:1})]),_:1}),o(a,{title:"測試功能",id:"test-tasks-routes"},{default:i(()=>[o(p,{title:"使用瀏覽器"},{default:i(()=>t[122]||(t[122]=[l("p",null,[n("您可以在瀏覽器中測試這些路由。例如，導航至 "),l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n(" 以 JSON 格式顯示所有 "),l("code",null,"Medium"),n(" 優先順序的任務：")],-1),l("img",{src:J,alt:"顯示具有中等優先順序 JSON 格式任務的瀏覽器視窗","border-effect":"rounded",width:"706"},null,-1),l("p",null,[n(" 鑑於這類請求通常來自 JavaScript，因此更 細粒度的測試是更受歡迎的。為此，您可以使用專用工具，例如 "),l("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),n("。 ")],-1)])),_:1}),o(p,{title:"使用 Postman"},{default:i(()=>[o(e,null,{default:i(()=>t[123]||(t[123]=[l("p",null,[n("在 Postman 中，建立一個新的 GET 請求，URL 為 "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("。")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[126]||(t[126]=n(" 在 ")),o(k,null,{default:i(()=>t[124]||(t[124]=[n("標頭")])),_:1}),t[127]||(t[127]=n(" 窗格中，將 ")),o(k,null,{default:i(()=>t[125]||(t[125]=[n("Accept")])),_:1}),t[128]||(t[128]=n(" 標頭的值設定為 ")),t[129]||(t[129]=l("code",null,"application/json",-1)),t[130]||(t[130]=n("。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[132]||(t[132]=n("點擊 ")),o(m,null,{default:i(()=>t[131]||(t[131]=[n("傳送")])),_:1}),t[133]||(t[133]=n(" 以傳送請求並在回應檢視器中查看回應。 "))]),t[134]||(t[134]=l("img",{src:I,alt:"Postman 中顯示中等優先順序 JSON 格式任務的 GET 請求","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(p,{title:"使用 HTTP 請求檔案"},{default:i(()=>[t[146]||(t[146]=l("p",null,"在 IntelliJ IDEA Ultimate 中，您可以在 HTTP 請求檔案中執行相同的步驟。",-1)),o(e,null,{default:i(()=>[l("p",null,[t[136]||(t[136]=n(" 在專案根目錄中，建立一個新的 ")),o(s,null,{default:i(()=>t[135]||(t[135]=[n("REST Task Manager.http")])),_:1}),t[137]||(t[137]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[139]||(t[139]=n(" 開啟 ")),o(s,null,{default:i(()=>t[138]||(t[138]=[n("REST Task Manager.http")])),_:1}),t[140]||(t[140]=n(" 檔案並新增以下 GET 請求： "))]),o(r,{lang:"http",code:`GET http://0.0.0.0:8080/tasks/byPriority/Medium
Accept: application/json`})]),_:1}),o(e,null,{default:i(()=>t[141]||(t[141]=[l("p",null,[n(" 要在 IntelliJ IDE 中傳送請求，請點擊其旁邊的側邊欄圖示 ("),l("img",{alt:"IntelliJ IDEA 側邊欄圖示",src:g,width:"16",height:"26"}),n(")。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[143]||(t[143]=n("這將在 ")),o(s,null,{default:i(()=>t[142]||(t[142]=[n("Services")])),_:1}),t[144]||(t[144]=n(" 工具視窗中開啟並執行： "))]),t[145]||(t[145]=l("img",{src:H,alt:"HTTP 檔案中顯示中等優先順序 JSON 格式任務的 GET 請求","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(x,null,{default:i(()=>t[147]||(t[147]=[n(" 測試路由的另一種方法是使用 Kotlin Notebook 中的 "),l("a",{href:"https://khttp.readthedocs.io/en/latest/"},"khttp",-1),n(" 程式庫。 ")])),_:1})]),_:1})]),_:1}),o(a,{title:"新增 POST 請求的路由",id:"add-a-route-for-post-requests"},{default:i(()=>[t[167]||(t[167]=l("p",null,[n(" 在之前的教學課程中，任務是透過 HTML 表單建立的。然而，由於您現在正在建立 RESTful 服務，您不再需要這樣做。相反，您將利用 "),l("code",null,"kotlinx.serialization"),n(" 框架，它將完成大部分繁重的工作。 ")],-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[150]||(t[150]=n(" 開啟 ")),o(s,null,{default:i(()=>t[148]||(t[148]=[n("src/main/kotlin/com/example")])),_:1}),t[151]||(t[151]=n(" 中的 ")),o(s,null,{default:i(()=>t[149]||(t[149]=[n("Routing.kt")])),_:1}),t[152]||(t[152]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[t[153]||(t[153]=l("p",null,[n(" 新增一個新的 POST 路由到 "),l("code",null,"Application.configureRouting()"),n(" 函式，如下所示： ")],-1)),o(r,{lang:"kotlin",code:`                    //...

                    fun Application.configureRouting() {
                        routing {
                            //...

                            route("/tasks") {
                                //...

                                //新增以下新路由
                                post {
                                    try {
                                        val task = call.receive<Task>()
                                        TaskRepository.addTask(task)
                                        call.respond(HttpStatusCode.Created)
                                    } catch (ex: IllegalStateException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    } catch (ex: SerializationException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[154]||(t[154]=l("p",null," 新增以下新引入： ",-1)),o(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.Task
                    import io.ktor.serialization.*
                    import io.ktor.server.request.*`}),t[155]||(t[155]=l("p",null,[n(" 當 POST 請求傳送到 "),l("code",null,"/tasks"),n(" 時，"),l("code",null,"kotlinx.serialization"),n(" 框架 用於將請求主體轉換為 "),l("code",null,"Task"),n(" 物件。如果成功，任務將被新增到儲存庫。如果反序列化過程失敗，伺服器將需要 處理 "),l("code",null,"SerializationException"),n("，而如果任務重複，則需要處理 "),l("code",null,"IllegalStateException"),n("。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[156]||(t[156]=[l("p",null," 重新啟動應用程式。 ",-1)])),_:1}),o(e,null,{default:i(()=>t[157]||(t[157]=[l("p",null,[n(" 為了在 Postman 中測試此功能，建立一個新的 POST 請求到 URL "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[159]||(t[159]=n(" 在 ")),o(k,null,{default:i(()=>t[158]||(t[158]=[n("主體")])),_:1}),t[160]||(t[160]=n(" 窗格中，新增以下 JSON 文件以表示一個新任務： "))]),o(r,{lang:"json",code:`{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`}),t[161]||(t[161]=l("img",{src:j,alt:"Postman 中用於新增任務的 POST 請求","border-effect":"line",width:"706"},null,-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[163]||(t[163]=n("點擊 ")),o(m,null,{default:i(()=>t[162]||(t[162]=[n("傳送")])),_:1}),t[164]||(t[164]=n(" 以傳送請求。 "))])]),_:1}),o(e,null,{default:i(()=>t[165]||(t[165]=[l("p",null,[n(" 您可以透過向 "),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n(" 傳送 GET 請求來驗證任務是否已新增。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[t[166]||(t[166]=l("p",null," 在 IntelliJ IDEA Ultimate 中，您可以透過將以下內容新增到您的 HTTP 請求檔案來執行相同的步驟： ",-1)),o(r,{lang:"http",code:`###

POST http://0.0.0.0:8080/tasks
Content-Type: application/json

{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"新增刪除支援",id:"remove-tasks"},{default:i(()=>[t[185]||(t[185]=l("p",null," 您幾乎已經完成了為您的服務新增基本操作。這些操作通常被總結為 CRUD 操作——即建立 (Create)、讀取 (Read)、更新 (Update) 和刪除 (Delete) 的縮寫。現在您將實作刪除操作。 ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[169]||(t[169]=n(" 在 ")),o(s,null,{default:i(()=>t[168]||(t[168]=[n("TaskRepository.kt")])),_:1}),t[170]||(t[170]=n(" 檔案中，在 ")),t[171]||(t[171]=l("code",null,"TaskRepository",-1)),t[172]||(t[172]=n(" 物件中新增以下方法，以根據任務名稱移除任務： "))]),o(r,{lang:"kotlin",code:`    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }`})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[174]||(t[174]=n(" 開啟 ")),o(s,null,{default:i(()=>t[173]||(t[173]=[n("Routing.kt")])),_:1}),t[175]||(t[175]=n(" 檔案並在 ")),t[176]||(t[176]=l("code",null,"routing()",-1)),t[177]||(t[177]=n(" 函式中新增一個端點來處理 DELETE 請求： "))]),o(r,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        //...

                        routing {
                            route("/tasks") {
                                //...
                                //新增以下函式
                                delete("/{taskName}") {
                                    val name = call.parameters["taskName"]
                                    if (name == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@delete
                                    }

                                    if (TaskRepository.removeTask(name)) {
                                        call.respond(HttpStatusCode.NoContent)
                                    } else {
                                        call.respond(HttpStatusCode.NotFound)
                                    }
                                }
                            }
                        }
                    }`})]),_:1}),o(e,null,{default:i(()=>t[178]||(t[178]=[l("p",null," 重新啟動應用程式。 ",-1)])),_:1}),o(e,null,{default:i(()=>[t[179]||(t[179]=l("p",null," 將以下 DELETE 請求新增到您的 HTTP 請求檔案中： ",-1)),o(r,{lang:"http",code:`###

DELETE http://0.0.0.0:8080/tasks/gardening`})]),_:1}),o(e,null,{default:i(()=>t[180]||(t[180]=[l("p",null,[n(" 要在 IntelliJ IDE 中傳送 DELETE 請求，請點擊其旁邊的側邊欄圖示 ("),l("img",{alt:"IntelliJ IDEA 側邊欄圖示",src:g,width:"16",height:"26"}),n(")。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[182]||(t[182]=n("您將在 ")),o(s,null,{default:i(()=>t[181]||(t[181]=[n("Services")])),_:1}),t[183]||(t[183]=n(" 工具視窗中看到回應： "))]),t[184]||(t[184]=l("img",{src:q,alt:"HTTP 請求檔案中的 DELETE 請求","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"使用 Ktor 用戶端建立單元測試",id:"create-unit-tests"},{default:i(()=>[l("p",null,[t[187]||(t[187]=n(" 到目前為止，您已經手動測試了您的應用程式，但是，正如您已經注意到的，這種方法耗時且無法擴展。相反，您可以實作 ")),o(d,{href:"/ktor/server-testing",summary:"了解如何使用特殊的測試引擎來測試您的伺服器應用程式。"},{default:i(()=>t[186]||(t[186]=[n("JUnit 測試")])),_:1}),t[188]||(t[188]=n("， 使用內建的 ")),t[189]||(t[189]=l("code",null,"client",-1)),t[190]||(t[190]=n(" 物件來擷取和反序列化 JSON。 "))]),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[193]||(t[193]=n(" 開啟 ")),o(s,null,{default:i(()=>t[191]||(t[191]=[n("src/test/kotlin/com/example")])),_:1}),t[194]||(t[194]=n(" 中的 ")),o(s,null,{default:i(()=>t[192]||(t[192]=[n("ApplicationTest.kt")])),_:1}),t[195]||(t[195]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[197]||(t[197]=n(" 將 ")),o(s,null,{default:i(()=>t[196]||(t[196]=[n("ApplicationTest.kt")])),_:1}),t[198]||(t[198]=n(" 檔案的內容替換為以下內容： "))]),o(r,{lang:"kotlin",code:`package com.example

import com.example.model.Priority
import com.example.model.Task
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val response = client.get("/tasks/byPriority/Medium")
        val results = response.body<List<Task>>()

        assertEquals(HttpStatusCode.OK, response.status)

        val expectedTaskNames = listOf("gardening", "painting")
        val actualTaskNames = results.map(Task::name)
        assertContentEquals(expectedTaskNames, actualTaskNames)
    }

    @Test
    fun invalidPriorityProduces400() = testApplication {
        application {
            module()
        }
        val response = client.get("/tasks/byPriority/Invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }


    @Test
    fun unusedPriorityProduces404() = testApplication {
        application {
            module()
        }
        val response = client.get("/tasks/byPriority/Vital")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val task = Task("swimming", "Go to the beach", Priority.Low)
        val response1 = client.post("/tasks") {
            header(
                HttpHeaders.ContentType,
                ContentType.Application.Json
            )

            setBody(task)
        }
        assertEquals(HttpStatusCode.Created, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2
            .body<List<Task>>()
            .map { it.name }

        assertContains(taskNames, "swimming")
    }
}`}),t[199]||(t[199]=l("p",null,[n(" 請注意，您需要在 "),l("a",{href:"./client-create-and-configure#plugins"},"外掛程式"),n("中安裝 "),l("code",null,"ContentNegotiation"),n(" 和 "),l("code",null,"kotlinx.serialization"),n(" 外掛程式，就像您在 伺服器端所做的一樣。 ")],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[201]||(t[201]=n(" 將以下依賴項新增到您位於 ")),o(s,null,{default:i(()=>t[200]||(t[200]=[n("gradle/libs.versions.toml")])),_:1}),t[202]||(t[202]=n(" 的版本目錄中： "))]),o(r,{lang:"yaml",code:`                    [libraries]
                    # ...
                    ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[204]||(t[204]=n(" 將新依賴項新增到您的 ")),o(s,null,{default:i(()=>t[203]||(t[203]=[n("build.gradle.kts")])),_:1}),t[205]||(t[205]=n(" 檔案中： "))]),o(r,{lang:"kotlin",code:"                    testImplementation(libs.ktor.client.content.negotiation)"})]),_:1})]),_:1})]),_:1}),o(a,{title:"使用 JsonPath 建立單元測試",id:"unit-tests-via-jsonpath"},{default:i(()=>[t[223]||(t[223]=l("p",null," 使用 Ktor 用戶端或類似的程式庫測試您的服務很方便，但從品質保證 (QA) 的角度來看，它有一個缺點。伺服器不直接處理 JSON，因此無法確定其對 JSON 結構的假設是否正確。 ",-1)),t[224]||(t[224]=l("p",null," 例如，假設以下情況： ",-1)),o(f,null,{default:i(()=>t[206]||(t[206]=[l("li",null,[n("值以 "),l("code",null,"array"),n(" 形式儲存，而實際上使用的是 "),l("code",null,"object"),n("。")],-1),l("li",null,[n("屬性以 "),l("code",null,"numbers"),n(" 形式儲存，而實際上是 "),l("code",null,"strings"),n("。")],-1),l("li",null,"成員在宣告時按照順序序列化，但實際並非如此。",-1)])),_:1}),t[225]||(t[225]=l("p",null,[n(" 如果您的服務 intended for use by multiple clients, it's crucial to have confidence in the JSON structure. To achieve this, use the Ktor Client to retrieve text from the server and then analyze this content using the "),l("a",{href:"https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path"},"JSONPath"),n(" 程式庫。")],-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[208]||(t[208]=n("在您的 ")),o(s,null,{default:i(()=>t[207]||(t[207]=[n("build.gradle.kts")])),_:1}),t[209]||(t[209]=n(" 檔案中，將 JSONPath 程式庫新增到 ")),t[210]||(t[210]=l("code",null,"dependencies",-1)),t[211]||(t[211]=n(" 區塊： "))]),o(r,{lang:"kotlin",code:'    testImplementation("com.jayway.jsonpath:json-path:2.9.0")'})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[214]||(t[214]=n(" 導航至 ")),o(s,null,{default:i(()=>t[212]||(t[212]=[n("src/test/kotlin/com/example")])),_:1}),t[215]||(t[215]=n(" 資料夾並建立一個新的 ")),o(s,null,{default:i(()=>t[213]||(t[213]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[216]||(t[216]=n(" 檔案。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[218]||(t[218]=n(" 開啟 ")),o(s,null,{default:i(()=>t[217]||(t[217]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[219]||(t[219]=n(" 檔案並將以下內容新增到其中： "))]),o(r,{lang:"kotlin",code:`package com.example

import com.jayway.jsonpath.DocumentContext
import com.jayway.jsonpath.JsonPath
import io.ktor.client.*
import com.example.model.Priority
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*


class ApplicationJsonPathTest {
    @Test
    fun tasksCanBeFound() = testApplication {
        application {
            module()
        }
        val jsonDoc = client.getAsJsonPath("/tasks")

        val result: List<String> = jsonDoc.read("$[*].name")
        assertEquals("cleaning", result[0])
        assertEquals("gardening", result[1])
        assertEquals("shopping", result[2])
    }

    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val priority = Priority.Medium
        val jsonDoc = client.getAsJsonPath("/tasks/byPriority/$priority")

        val result: List<String> =
            jsonDoc.read("$[?(@.priority == '$priority')].name")
        assertEquals(2, result.size)

        assertEquals("gardening", result[0])
        assertEquals("painting", result[1])
    }

    suspend fun HttpClient.getAsJsonPath(url: String): DocumentContext {
        val response = this.get(url) {
            accept(ContentType.Application.Json)
        }
        return JsonPath.parse(response.bodyAsText())
    }
}`}),t[221]||(t[221]=l("p",null," JsonPath 查詢的工作方式如下： ",-1)),o(f,null,{default:i(()=>t[220]||(t[220]=[l("li",null,[l("code",null,"$[*].name"),n(" 表示「將文件視為陣列，並返回每個條目的 "),l("code",null,"name"),n(" 屬性值」。 ")],-1),l("li",null,[l("code",null,"$[?(@.priority == '$priority')].name"),n(" 表示「返回陣列中所有 "),l("code",null,"priority"),n(" 等於提供值的條目的 "),l("code",null,"name"),n(" 屬性值」。 ")],-1)])),_:1}),t[222]||(t[222]=l("p",null," 您可以使用這些查詢來確認您對返回 JSON 的理解。當您進行程式碼重構和服務重新部署時，序列化中的任何修改都將被識別，即使它們不會破壞目前框架的反序列化。這使您可以自信地重新發布公開可用的 API。 ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"下一步",id:"next-steps"},{default:i(()=>[t[229]||(t[229]=l("p",null," 恭喜！您現在已經完成了為您的任務管理器應用程式建立 RESTful API 服務，並學習了使用 Ktor Client 和 JsonPath 進行單元測試的細節。 ",-1)),l("p",null,[t[227]||(t[227]=n(" 繼續閱讀 ")),o(d,{href:"/ktor/server-create-website",summary:"了解如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板建立網站。"},{default:i(()=>t[226]||(t[226]=[n("下一個教學課程")])),_:1}),t[228]||(t[228]=n(" ，學習如何重複使用您的 API 服務來建立網路應用程式。 "))])]),_:1})]),_:1})])}const h=D(B,[["render",z]]);export{Z as __pageData,h as default};
