import{_ as w,a as v,b as C,c as x,d as A}from"./chunks/tutorial_server_websockets_iteration_2_test.BE55vRda.js";import{_ as W}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as P}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as R}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as N}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as z,C as u,c as L,o as K,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-create-websocket-application.md","filePath":"zh-Hant/ktor/server-create-websocket-application.md","lastUpdated":1755457140000}'),E={name:"zh-Hant/ktor/server-create-websocket-application.md"};function I(J,n,D,M,O,B){const f=u("show-structure"),r=u("Links"),g=u("tldr"),T=u("card-summary"),b=u("link-summary"),S=u("web-summary"),k=u("list"),d=u("chapter"),s=u("step"),p=u("control"),i=u("Path"),m=u("procedure"),a=u("code-block"),y=u("topic");return K(),L("div",null,[o(y,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Kotlin 與 Ktor 建立 WebSocket 應用程式",id:"server-create-websocket-application"},{default:e(()=>[o(f,{for:"chapter",depth:"2"}),o(g,null,{default:e(()=>[n[11]||(n[11]=l("p",null,[l("b",null,"程式碼範例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-websockets"}," tutorial-server-websockets ")],-1)),l("p",null,[n[4]||(n[4]=l("b",null,"使用的插件",-1)),n[5]||(n[5]=t(": ")),o(r,{href:"/ktor/server-routing",summary:"路由是伺服器應用程式中處理傳入請求的核心插件。"},{default:e(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[6]||(n[6]=t("、")),o(r,{href:"/ktor/server-static-content",summary:"了解如何提供靜態內容，例如樣式表、腳本、圖片等。"},{default:e(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[7]||(n[7]=t("、 ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有兩個目的：協商用戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[8]||(n[8]=t("、")),o(r,{href:"/ktor/server-websockets",summary:"WebSockets 插件允許您在伺服器和用戶端之間建立多向通訊會話。"},{default:e(()=>n[3]||(n[3]=[t("WebSockets in Ktor Server")])),_:1}),n[9]||(n[9]=t("、 ")),n[10]||(n[10]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(T,null,{default:e(()=>n[12]||(n[12]=[t(" 了解如何善用 WebSockets 的強大功能來傳送和接收內容。 ")])),_:1}),o(b,null,{default:e(()=>n[13]||(n[13]=[t(" 了解如何善用 WebSockets 的強大功能來傳送和接收內容。 ")])),_:1}),o(S,null,{default:e(()=>n[14]||(n[14]=[t(" 了解如何使用 Kotlin 和 Ktor 建置 WebSocket 應用程式。本教學將引導您完成透過 WebSockets 將後端服務與用戶端連接的過程。 ")])),_:1}),l("p",null,[n[16]||(n[16]=t(" 本文將引導您完成使用 Kotlin 和 Ktor 建立 WebSocket 應用程式的過程。它建立在 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[15]||(n[15]=[t("建立 RESTful API")])),_:1}),n[17]||(n[17]=t(" 教學中涵蓋的內容基礎上。 "))]),n[186]||(n[186]=l("p",null,"本文將教您如何執行以下操作：",-1)),o(k,null,{default:e(()=>n[18]||(n[18]=[l("li",null,"建立使用 JSON 序列化的服務。",-1),l("li",null,"透過 WebSocket 連線傳送和接收內容。",-1),l("li",null,"同時向多個用戶端廣播內容。",-1)])),_:1}),o(d,{title:"先決條件",id:"prerequisites"},{default:e(()=>[l("p",null,[n[21]||(n[21]=t("您可以獨立完成本教學，但我們建議您完成 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[19]||(n[19]=[t("建立 RESTful API")])),_:1}),n[22]||(n[22]=t(" 教學，以熟悉 ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有兩個目的：協商用戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[20]||(n[20]=[t("Content Negotiation")])),_:1}),n[23]||(n[23]=t(" 和 REST。 "))]),n[24]||(n[24]=l("p",null,[t("我們建議您安裝 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t("，但您也可以使用您選擇的其他 IDE。 ")],-1))]),_:1}),o(d,{title:"Hello WebSockets",id:"hello-websockets"},{default:e(()=>[l("p",null,[n[27]||(n[27]=t(" 在本教學中，您將在 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[25]||(n[25]=[t("建立 RESTful API")])),_:1}),n[28]||(n[28]=t(" 教學中開發的任務管理器服務的基礎上，新增透過 WebSocket 連線與用戶端交換 ")),n[29]||(n[29]=l("code",null,"Task",-1)),n[30]||(n[30]=t(" 物件的能力。為此，您需要新增 ")),o(r,{href:"/ktor/server-websockets",summary:"Websockets 插件允許您在伺服器和用戶端之間建立多向通訊會話。"},{default:e(()=>n[26]||(n[26]=[t("WebSockets 插件")])),_:1}),n[31]||(n[31]=t("。雖然您可以手動將其新增到現有專案中，但為了本教學的目的，我們將從頭開始建立一個新專案。 "))]),o(d,{title:"使用插件建立初始專案",id:"create=project"},{default:e(()=>[o(m,null,{default:e(()=>[o(s,null,{default:e(()=>n[32]||(n[32]=[l("p",null,[t(" 導覽至 "),l("a",{href:"https://start.ktor.io/"},"Ktor 專案產生器"),t("。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[35]||(n[35]=t("在 ")),o(p,null,{default:e(()=>n[33]||(n[33]=[t("Project artifact")])),_:1}),n[36]||(n[36]=t(" 欄位中，輸入 ")),o(i,null,{default:e(()=>n[34]||(n[34]=[t("com.example.ktor-websockets-task-app")])),_:1}),n[37]||(n[37]=t(" 作為專案成品的名稱。 ")),n[38]||(n[38]=l("img",{src:w,alt:"在 Ktor 專案產生器中命名專案成品","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[40]||(n[40]=t(" 在插件區塊中，搜尋並點擊 ")),o(p,null,{default:e(()=>n[39]||(n[39]=[t("Add")])),_:1}),n[41]||(n[41]=t(" 按鈕新增以下插件： "))]),o(k,{type:"bullet"},{default:e(()=>n[42]||(n[42]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"WebSockets",-1),l("li",null,"Static Content",-1)])),_:1}),n[43]||(n[43]=l("p",null,[l("img",{src:W,alt:"在 Ktor 專案產生器中新增插件","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[45]||(n[45]=t(" 新增插件後，點擊插件區塊右上角的 ")),o(p,null,{default:e(()=>n[44]||(n[44]=[t("5 plugins")])),_:1}),n[46]||(n[46]=t(" 按鈕，顯示已新增的插件。 "))]),n[47]||(n[47]=l("p",null,[t("您將看到所有將新增到專案中的插件列表： "),l("img",{src:v,alt:"Ktor 專案產生器中的插件列表","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[49]||(n[49]=t(" 點擊 ")),o(p,null,{default:e(()=>n[48]||(n[48]=[t("Download")])),_:1}),n[50]||(n[50]=t(" 按鈕來產生並下載您的 Ktor 專案。 "))])]),_:1})]),_:1})]),_:1}),o(d,{title:"新增啟動程式碼",id:"add-starter-code"},{default:e(()=>[n[107]||(n[107]=l("p",null,"下載完成後，在 IntelliJ IDEA 中開啟您的專案並按照以下步驟操作：",-1)),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[n[53]||(n[53]=t(" 導覽至 ")),o(i,null,{default:e(()=>n[51]||(n[51]=[t("src/main/kotlin")])),_:1}),n[54]||(n[54]=t(" 並建立一個名為 ")),o(i,null,{default:e(()=>n[52]||(n[52]=[t("model")])),_:1}),n[55]||(n[55]=t(" 的新子套件。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[58]||(n[58]=t(" 在 ")),o(i,null,{default:e(()=>n[56]||(n[56]=[t("model")])),_:1}),n[59]||(n[59]=t(" 套件內建立一個新的 ")),o(i,null,{default:e(()=>n[57]||(n[57]=[t("Task.kt")])),_:1}),n[60]||(n[60]=t(" 檔案。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[62]||(n[62]=t(" 開啟 ")),o(i,null,{default:e(()=>n[61]||(n[61]=[t("Task.kt")])),_:1}),n[63]||(n[63]=t(" 檔案並新增一個 ")),n[64]||(n[64]=l("code",null,"enum",-1)),n[65]||(n[65]=t(" 來表示優先級，以及一個 ")),n[66]||(n[66]=l("code",null,"data class",-1)),n[67]||(n[67]=t(" 來表示任務： "))]),o(a,{lang:"kotlin",code:`package model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),n[73]||(n[73]=l("p",null,[t(" 請注意，"),l("code",null,"Task"),t(" 類別使用 "),l("code",null,"kotlinx.serialization"),t(" 函式庫中的 "),l("code",null,"Serializable"),t(" 型別進行標註。這表示實例可以轉換為 JSON 格式，也可以從 JSON 轉換回來，從而允許其內容透過網路傳輸。 ")],-1)),l("p",null,[n[70]||(n[70]=t(" 因為您包含了 WebSockets 插件，一個 ")),o(i,null,{default:e(()=>n[68]||(n[68]=[t("Sockets.kt")])),_:1}),n[71]||(n[71]=t(" 檔案已在 ")),o(i,null,{default:e(()=>n[69]||(n[69]=[t("src/main/kotlin/com/example/plugins")])),_:1}),n[72]||(n[72]=t(" 內產生。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[75]||(n[75]=t(" 開啟 ")),o(i,null,{default:e(()=>n[74]||(n[74]=[t("Sockets.kt")])),_:1}),n[76]||(n[76]=t(" 檔案並將現有的 ")),n[77]||(n[77]=l("code",null,"Application.configureSockets()",-1)),n[78]||(n[78]=t(" 函數替換為以下實作： "))]),o(a,{lang:"kotlin",code:`                        fun Application.configureSockets() {
                            install(WebSockets) {
                                contentConverter = KotlinxWebsocketSerializationConverter(Json)
                                pingPeriod = 15.seconds
                                timeout = 15.seconds
                                maxFrameSize = Long.MAX_VALUE
                                masking = false
                            }

                            routing {
                                webSocket("/tasks") {
                                    val tasks = listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )

                                    for (task in tasks) {
                                        sendSerialized(task)
                                        delay(1000)
                                    }

                                    close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                                }
                            }
                        }`}),n[92]||(n[92]=l("p",null," 在此程式碼中執行了以下步驟： ",-1)),o(k,{type:"decimal"},{default:e(()=>n[79]||(n[79]=[l("li",null,"安裝並配置了 WebSockets 插件，並使用標準設定。",-1),l("li",null,[t("設定了 "),l("code",null,"contentConverter"),t(" 屬性，使插件能夠 透過 "),l("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},"kotlinx.serialization"),t(" 函式庫序列化傳送和接收的物件。 ")],-1),l("li",null,[t("配置了路由，只有一個端點，其相對 URL 為 "),l("code",null,"/tasks"),t("。 ")],-1),l("li",null,"收到請求後，將任務列表透過 WebSocket 連線序列化傳送。",-1),l("li",null,"所有項目傳送完畢後，伺服器關閉連線。",-1)])),_:1}),l("p",null,[n[82]||(n[82]=t(" 為了演示目的，在傳送任務之間引入了一秒的延遲。這 讓我們能夠觀察到任務在用戶端中遞增地出現。如果沒有此延遲， 該範例看起來會與在先前文章中開發的 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[80]||(n[80]=[t("RESTful 服務")])),_:1}),n[83]||(n[83]=t(" 和 ")),o(r,{href:"/ktor/server-create-website",summary:"了解如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板建置網站。"},{default:e(()=>n[81]||(n[81]=[t("網路應用程式")])),_:1}),n[84]||(n[84]=t(" 相同。 "))]),l("p",null,[n[88]||(n[88]=t(" 此迭代的最後一步是為此端點建立一個用戶端。因為您包含了 ")),o(r,{href:"/ktor/server-static-content",summary:"了解如何提供靜態內容，例如樣式表、腳本、圖片等。"},{default:e(()=>n[85]||(n[85]=[t("Static Content")])),_:1}),n[89]||(n[89]=t(" 插件，一個 ")),o(i,null,{default:e(()=>n[86]||(n[86]=[t("index.html")])),_:1}),n[90]||(n[90]=t(" 檔案已在 ")),o(i,null,{default:e(()=>n[87]||(n[87]=[t("src/main/resources/static")])),_:1}),n[91]||(n[91]=t(" 內產生。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[94]||(n[94]=t(" 開啟 ")),o(i,null,{default:e(()=>n[93]||(n[93]=[t("index.html")])),_:1}),n[95]||(n[95]=t(" 檔案並將現有內容替換為以下內容： "))]),o(a,{lang:"html",code:`<html>
<head>
    <title>Using Ktor WebSockets</title>
    <script>
        function readAndDisplayAllTasks() {
            clearTable();

            const serverURL = 'ws://0.0.0.0:8080/tasks';
            const socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function clearTable() {
            tableBody().innerHTML = "";
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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
<h1>Viewing Tasks Via WebSockets</h1>
<form action="javascript:readAndDisplayAllTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[96]||(n[96]=l("p",null,[t(" 此頁面使用 "),l("a",{href:"https://websockets.spec.whatwg.org//#websocket"},"WebSocket 型別"),t("， 所有現代瀏覽器都支援。我們在 JavaScript 中建立此物件，將 端點的 URL 傳入建構式。隨後，我們為 "),l("code",null,"onopen"),t("、"),l("code",null,"onclose"),t(" 和 "),l("code",null,"onmessage"),t(" 事件附加事件處理器。觸發 "),l("code",null,"onmessage"),t(" 事件後，我們使用 document 物件的方法將一行附加到表格中。 ")],-1))]),_:1}),o(s,null,{default:e(()=>n[97]||(n[97]=[l("p",null,[t("在 IntelliJ IDEA 中，點擊執行按鈕 ("),l("img",{src:P,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"}),t(") 來啟動應用程式。")],-1)])),_:1}),o(s,null,{default:e(()=>[n[103]||(n[103]=l("p",null,[t(" 導覽至 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t("。 您應該會看到一個帶有按鈕和空表格的表單： ")],-1)),n[104]||(n[104]=l("img",{src:C,alt:"顯示帶有一個按鈕的 HTML 表單的網頁","border-effect":"rounded",width:"706"},null,-1)),l("p",null,[n[100]||(n[100]=t(" 當您點擊表單時，任務應以每秒一個的速度從伺服器載入， 並遞增填充表格。您還可以透過在瀏覽器的 ")),o(p,null,{default:e(()=>n[98]||(n[98]=[t("開發者工具")])),_:1}),n[101]||(n[101]=t("中開啟 ")),o(p,null,{default:e(()=>n[99]||(n[99]=[t("JavaScript 控制台")])),_:1}),n[102]||(n[102]=t(" 來查看記錄的訊息。 "))]),n[105]||(n[105]=l("img",{src:x,alt:"顯示在按鈕點擊時列表項目的網頁","border-effect":"rounded",width:"706"},null,-1)),n[106]||(n[106]=l("p",null," 至此，您可以看到服務正如預期般運作。WebSocket 連線已開啟，項目已傳送至用戶端，然後連線關閉。底層網路存在許多複雜性，但 Ktor 預設處理所有這些。 ",-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(d,{title:"理解 WebSockets",id:"understanding-websockets"},{default:e(()=>[n[109]||(n[109]=l("p",null,[t(" 在進入下一個迭代之前，回顧一些 WebSockets 的基礎知識可能會有所幫助。 如果您已經熟悉 WebSockets，您可以繼續"),l("a",{href:"#improve-design"},"改進服務的設計"),t("。 ")],-1)),n[110]||(n[110]=l("p",null," 在先前的教學中，您的用戶端傳送 HTTP 請求並接收 HTTP 回應。這運作良好，並使網際網路具有可擴展性和彈性。 ",-1)),n[111]||(n[111]=l("p",null,"然而，它不適用於以下情境：",-1)),o(k,null,{default:e(()=>n[108]||(n[108]=[l("li",null,"內容隨時間遞增產生。",-1),l("li",null,"內容根據事件頻繁變化。",-1),l("li",null,"用戶端需要在內容產生時與伺服器互動。",-1),l("li",null,"一個用戶端傳送的資料需要快速傳播給其他用戶端。",-1)])),_:1}),n[112]||(n[112]=l("p",null," 這些情境的範例包括股票交易、購買電影和音樂會門票、在線上拍賣中競標以及社交媒體中的聊天功能。WebSockets 的開發就是為了處理這些情況。 ",-1)),n[113]||(n[113]=l("p",null," WebSocket 連線透過 TCP 建立，並且可以持續較長時間。此連線提供「全雙工通訊」，意味著用戶端可以同時向伺服器傳送訊息並從伺服器接收訊息。 ",-1)),n[114]||(n[114]=l("p",null,[t(" WebSocket API 定義了四個事件（open、message、close 和 error）和兩種動作（send 和 close）。 此功能的存取方式可能因不同的語言和函式庫而異。 例如，在 Kotlin 中，您可以將傳入訊息序列作為 "),l("a",{href:"https://kotlinlang.org/docs/flow.html"},"Flow"),t(" 消耗。 ")],-1))]),_:1}),o(d,{title:"改進設計",id:"improve-design"},{default:e(()=>[n[132]||(n[132]=l("p",null,"接下來，您將重構現有程式碼，為更進階的範例騰出空間。",-1)),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[117]||(n[117]=t(" 在 ")),o(i,null,{default:e(()=>n[115]||(n[115]=[t("model")])),_:1}),n[118]||(n[118]=t(" 套件中，建立一個新的 ")),o(i,null,{default:e(()=>n[116]||(n[116]=[t("TaskRepository.kt")])),_:1}),n[119]||(n[119]=t(" 檔案。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[121]||(n[121]=t(" 開啟 ")),o(i,null,{default:e(()=>n[120]||(n[120]=[t("TaskRepository.kt")])),_:1}),n[122]||(n[122]=t(" 並新增一個 ")),n[123]||(n[123]=l("code",null,"TaskRepository",-1)),n[124]||(n[124]=t(" 型別： "))]),o(a,{lang:"kotlin",code:`package model

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

    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }
}`}),n[125]||(n[125]=l("p",null,"您可能還記得此程式碼來自先前的教學。",-1))]),_:1}),o(s,null,{default:e(()=>[n[128]||(n[128]=t(" 導覽至 ")),o(i,null,{default:e(()=>n[126]||(n[126]=[t("plugins")])),_:1}),n[129]||(n[129]=t(" 套件並開啟 ")),o(i,null,{default:e(()=>n[127]||(n[127]=[t("Sockets.kt")])),_:1}),n[130]||(n[130]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[131]||(n[131]=l("p",null,[t(" 您現在可以透過利用 "),l("code",null,"TaskRepository"),t(" 來簡化 "),l("code",null,"Application.configureSockets()"),t(" 中的路由： ")],-1)),o(a,{lang:"kotlin",code:`                    routing {
                        webSocket("/tasks") {
                            for (task in TaskRepository.allTasks()) {
                                sendSerialized(task)
                                delay(1000)
                            }

                            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                        }
                    }`})]),_:1})]),_:1})]),_:1}),o(d,{title:"透過 WebSockets 傳送訊息",id:"send-messages"},{default:e(()=>[n[157]||(n[157]=l("p",null," 為了說明 WebSockets 的強大功能，您將建立一個新端點，其中： ",-1)),o(k,null,{default:e(()=>n[133]||(n[133]=[l("li",null," 當用戶端啟動時，它會接收所有現有任務。 ",-1),l("li",null," 用戶端可以建立和傳送任務。 ",-1),l("li",null," 當一個用戶端傳送任務時，其他用戶端會收到通知。 ",-1)])),_:1}),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[135]||(n[135]=t(" 在 ")),o(i,null,{default:e(()=>n[134]||(n[134]=[t("Sockets.kt")])),_:1}),n[136]||(n[136]=t(" 檔案中，將目前的 ")),n[137]||(n[137]=l("code",null,"configureSockets()",-1)),n[138]||(n[138]=t(" 方法替換為以下實作： "))]),o(a,{lang:"kotlin",code:`fun Application.configureSockets() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        val sessions =
            Collections.synchronizedList<WebSocketServerSession>(ArrayList())

        webSocket("/tasks") {
            sendAllTasks()
            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
        }

        webSocket("/tasks2") {
            sessions.add(this)
            sendAllTasks()

            while(true) {
                val newTask = receiveDeserialized<Task>()
                TaskRepository.addTask(newTask)
                for(session in sessions) {
                    session.sendSerialized(newTask)
                }
            }
        }
    }
}

private suspend fun DefaultWebSocketServerSession.sendAllTasks() {
    for (task in TaskRepository.allTasks()) {
        sendSerialized(task)
        delay(1000)
    }
}`}),n[143]||(n[143]=l("p",null,"透過此程式碼，您已執行以下操作：",-1)),o(k,null,{default:e(()=>n[139]||(n[139]=[l("li",null," 將傳送所有現有任務的功能重構為輔助方法。 ",-1),l("li",null,[t(" 在 "),l("code",null,"routing"),t(" 區塊中，您建立了一個執行緒安全的 "),l("code",null,"session"),t(" 物件列表，以追蹤所有用戶端。 ")],-1),l("li",null,[t(" 新增了一個相對 URL 為 "),l("code",null,"/task2"),t(" 的新端點。當用戶端連接到 此端點時，對應的 "),l("code",null,"session"),t(" 物件會被新增到列表中。伺服器 隨後進入無限迴圈，等待接收新任務。收到新任務後，伺服器 將其儲存到儲存庫中，並將副本傳送給所有用戶端，包括當前的用戶端。 ")],-1)])),_:1}),l("p",null,[n[141]||(n[141]=t(" 為了測試此功能，您將建立一個擴展 ")),o(i,null,{default:e(()=>n[140]||(n[140]=[t("index.html")])),_:1}),n[142]||(n[142]=t(" 功能的頁面。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[146]||(n[146]=t(" 在 ")),o(i,null,{default:e(()=>n[144]||(n[144]=[t("src/main/resources/static")])),_:1}),n[147]||(n[147]=t(" 內建立一個名為 ")),o(i,null,{default:e(()=>n[145]||(n[145]=[t("wsClient.html")])),_:1}),n[148]||(n[148]=t(" 的新 HTML 檔案。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[150]||(n[150]=t(" 開啟 ")),o(i,null,{default:e(()=>n[149]||(n[149]=[t("wsClient.html")])),_:1}),n[151]||(n[151]=t(" 並新增以下內容： "))]),o(a,{lang:"html",code:`<html>
<head>
    <title>WebSocket Client</title>
    <script>
        let serverURL;
        let socket;

        function setupSocket() {
            serverURL = 'ws://0.0.0.0:8080/tasks2';
            socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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

        function getFormValue(name) {
            return document.forms[0][name].value
        }

        function buildTaskFromForm() {
            return {
                name: getFormValue("newTaskName"),
                description: getFormValue("newTaskDescription"),
                priority: getFormValue("newTaskPriority")
            }
        }

        function logSendingToConsole(data) {
            console.log("About to send",data);
        }

        function sendTaskViaSocket(data) {
            socket.send(JSON.stringify(data));
        }

        function sendTaskToServer() {
            let data = buildTaskFromForm();
            logSendingToConsole(data);
            sendTaskViaSocket(data);
            //prevent form submission
            return false;
        }
    <\/script>
</head>
<body onload="setupSocket()">
<h1>Viewing Tasks Via WebSockets</h1>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
<div>
    <h3>Create a new task</h3>
    <form onsubmit="return sendTaskToServer()">
        <div>
            <label for="newTaskName">Name: </label>
            <input type="text" id="newTaskName"
                   name="newTaskName" size="10">
        </div>
        <div>
            <label for="newTaskDescription">Description: </label>
            <input type="text" id="newTaskDescription"
                   name="newTaskDescription" size="20">
        </div>
        <div>
            <label for="newTaskPriority">Priority: </label>
            <select id="newTaskPriority" name="newTaskPriority">
                <option name="Low">Low</option>
                <option name="Medium">Medium</option>
                <option name="High">High</option>
                <option name="Vital">Vital</option>
            </select>
        </div>
        <input type="submit">
    </form>
</div>
</body>
</html>`}),n[152]||(n[152]=l("p",null,[t(" 這個新頁面引入了一個 HTML 表單，使用者可以在其中輸入新任務的資訊。 提交表單後，會呼叫 "),l("code",null,"sendTaskToServer"),t(" 事件處理器。這會用 表單資料建置一個 JavaScript 物件，並使用 WebSocket 物件的 "),l("code",null,"send"),t(" 方法將其傳送給伺服器。 ")],-1))]),_:1}),o(s,null,{default:e(()=>n[153]||(n[153]=[l("p",null,[t(" 在 IntelliJ IDEA 中，點擊重新執行按鈕（"),l("img",{src:R,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新執行圖示"}),t("）來重新啟動應用程式。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[n[155]||(n[155]=l("p",null,"為了測試此功能，並排開啟兩個瀏覽器並按照以下步驟操作。",-1)),o(k,{type:"decimal"},{default:e(()=>n[154]||(n[154]=[l("li",null,[t(" 在瀏覽器 A 中，導覽至 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t("。 您應該會看到預設任務顯示。 ")],-1),l("li",null," 在瀏覽器 A 中新增一個任務。新任務應該會出現在該頁面的表格中。 ",-1),l("li",null,[t(" 在瀏覽器 B 中，導覽至 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t("。 您應該會看到預設任務，以及您在瀏覽器 A 中新增的任何新任務。 ")],-1),l("li",null," 在任一瀏覽器中新增一個任務。您應該會看到新項目同時出現在兩個頁面上。 ",-1)])),_:1}),n[156]||(n[156]=l("img",{src:A,alt:"兩個網頁並排顯示透過 HTML 表單建立新任務的過程","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(d,{title:"新增自動化測試",id:"add-automated-tests"},{default:e(()=>[l("p",null,[n[159]||(n[159]=t(" 為了簡化您的品保流程，使其快速、可重現且無需手動操作，您可以使用 Ktor 內建的 ")),o(r,{href:"/ktor/server-testing",summary:"了解如何使用特殊的測試引擎測試您的伺服器應用程式。"},{default:e(()=>n[158]||(n[158]=[t("自動化測試支援")])),_:1}),n[160]||(n[160]=t("。請按照以下步驟操作： "))]),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[163]||(n[163]=t(" 將以下依賴項新增到 ")),o(i,null,{default:e(()=>n[161]||(n[161]=[t("build.gradle.kts")])),_:1}),n[164]||(n[164]=t(" 中，以允許您在 Ktor 用戶端中配置 ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有兩個目的：協商用戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[162]||(n[162]=[t("內容協商")])),_:1}),n[165]||(n[165]=t(" 支援： "))]),o(a,{lang:"kotlin",code:'    testImplementation("io.ktor:ktor-client-content-negotiation-jvm:$ktor_version")'})]),_:1}),o(s,null,{default:e(()=>n[166]||(n[166]=[l("p",null,[l("p",null,[t("在 IntelliJ IDEA 中，點擊編輯器右側的 Gradle 通知圖示 ("),l("img",{alt:"IntelliJ IDEA Gradle 圖示",src:N,width:"16",height:"26"}),t(") 以載入 Gradle 變更。")])],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[169]||(n[169]=t(" 導覽至 ")),o(i,null,{default:e(()=>n[167]||(n[167]=[t("src/test/kotlin/com/example")])),_:1}),n[170]||(n[170]=t(" 並開啟 ")),o(i,null,{default:e(()=>n[168]||(n[168]=[t("ApplicationTest.kt")])),_:1}),n[171]||(n[171]=t(" 檔案。 "))])]),_:1}),o(s,null,{default:e(()=>[n[180]||(n[180]=l("p",null," 將產生測試類別替換為以下實作： ",-1)),o(a,{lang:"kotlin",code:`package com.example

import com.example.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.flow.*
import kotlinx.serialization.json.Json
import model.Priority
import model.Task
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
            configureSerialization()
            configureSockets()
        }

        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
            install(WebSockets) {
                contentConverter =
                    KotlinxWebsocketSerializationConverter(Json)
            }
        }

        val expectedTasks = listOf(
            Task("cleaning", "Clean the house", Priority.Low),
            Task("gardening", "Mow the lawn", Priority.Medium),
            Task("shopping", "Buy the groceries", Priority.High),
            Task("painting", "Paint the fence", Priority.Medium)
        )
        var actualTasks = emptyList<Task>()

        client.webSocket("/tasks") {
            consumeTasksAsFlow().collect { allTasks ->
                actualTasks = allTasks
            }
        }

        assertEquals(expectedTasks.size, actualTasks.size)
        expectedTasks.forEachIndexed { index, task ->
            assertEquals(task, actualTasks[index])
        }
    }

    private fun DefaultClientWebSocketSession.consumeTasksAsFlow() = incoming
        .consumeAsFlow()
        .map {
            converter!!.deserialize<Task>(it)
        }
        .scan(emptyList<Task>()) { list, task ->
            list + task
        }
}`}),n[181]||(n[181]=l("p",null," 透過此設定，您： ",-1)),o(k,null,{default:e(()=>[n[175]||(n[175]=l("li",null," 配置您的服務在測試環境中執行，並啟用與生產環境中相同的功能，包括 Routing、JSON 序列化和 WebSockets。 ",-1)),l("li",null,[n[173]||(n[173]=t(" 在 ")),o(r,{href:"/ktor/client-create-and-configure",summary:"了解如何建立和配置 Ktor 用戶端。"},{default:e(()=>n[172]||(n[172]=[t("Ktor 用戶端")])),_:1}),n[174]||(n[174]=t(" 中配置 Content Negotiation 和 WebSocket 支援。如果沒有這些，用戶端將不知道在使用 WebSocket 連線時如何 (反)序列化 JSON 物件。 "))]),n[176]||(n[176]=l("li",null,[t(" 宣告您期望服務傳回的 "),l("code",null,"Tasks"),t(" 列表。 ")],-1)),n[177]||(n[177]=l("li",null,[t(" 使用用戶端物件的 "),l("code",null,"websocket"),t(" 方法向 "),l("code",null,"/tasks"),t(" 傳送請求。 ")],-1)),n[178]||(n[178]=l("li",null,[t(" 將傳入的任務作為 "),l("code",null,"flow"),t(" 消耗，並遞增地將它們新增到列表中。 ")],-1)),n[179]||(n[179]=l("li",null,[t(" 一旦收到所有任務，以通常的方式比較 "),l("code",null,"expectedTasks"),t(" 與 "),l("code",null,"actualTasks"),t("。 ")],-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(d,{title:"後續步驟",id:"next-steps"},{default:e(()=>[n[185]||(n[185]=l("p",null," 幹得好！透過整合 WebSocket 通訊和使用 Ktor 用戶端的自動化測試，您已大幅增強您的任務管理器服務。 ",-1)),l("p",null,[n[183]||(n[183]=t(" 繼續閱讀 ")),o(r,{href:"/ktor/server-integrate-database",summary:"了解如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。"},{default:e(()=>n[182]||(n[182]=[t("下一個教學")])),_:1}),n[184]||(n[184]=t(" 以探索您的服務如何使用 Exposed 函式庫與關聯式資料庫無縫互動。 "))])]),_:1})]),_:1})])}const G=z(E,[["render",I]]);export{q as __pageData,G as default};
