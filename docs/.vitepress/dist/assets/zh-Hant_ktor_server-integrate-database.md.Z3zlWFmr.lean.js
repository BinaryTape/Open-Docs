import{_ as A,a as P,b as R,c as I,d as N,e as D}from"./chunks/tutorial_server_db_integration_src_folder.CYo2B4hT.js";import{_ as C}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as T}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as L}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as g}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as B}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as O,C as a,c as j,o as K,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-integrate-database.md","filePath":"zh-Hant/ktor/server-integrate-database.md","lastUpdated":1755457140000}'),q={name:"zh-Hant/ktor/server-integrate-database.md"};function F(H,n,z,J,M,Q){const y=a("show-structure"),d=a("Links"),b=a("tldr"),v=a("card-summary"),S=a("link-summary"),E=a("web-summary"),k=a("list"),u=a("chapter"),s=a("step"),m=a("control"),i=a("Path"),r=a("code-block"),p=a("procedure"),f=a("tip"),x=a("ui-path"),w=a("topic");return K(),j("div",null,[o(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"將資料庫與 Kotlin、Ktor 和 Exposed 整合",id:"server-integrate-database"},{default:e(()=>[o(y,{for:"chapter",depth:"2"}),o(b,null,{default:e(()=>[n[15]||(n[15]=l("p",null,[l("b",null,"程式碼範例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"}," tutorial-server-db-integration ")],-1)),l("p",null,[n[5]||(n[5]=l("b",null,"使用的外掛程式",-1)),n[6]||(n[6]=t(": ")),o(d,{href:"/ktor/server-routing",summary:"路由是處理伺服器應用程式中傳入請求的核心外掛程式。"},{default:e(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[7]||(n[7]=t("、")),o(d,{href:"/ktor/server-static-content",summary:"瞭解如何提供靜態內容，例如樣式表、腳本、圖片等。"},{default:e(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[8]||(n[8]=t("、 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[9]||(n[9]=t("、 ")),o(d,{href:"/ktor/server-status-pages",summary:"%plugin_name% 允許 Ktor 應用程式根據拋出的異常或狀態碼對任何故障狀態作出適當的回應。"},{default:e(()=>n[3]||(n[3]=[t("Status pages")])),_:1}),n[10]||(n[10]=t("、 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[4]||(n[4]=[t("kotlinx.serialization")])),_:1}),n[11]||(n[11]=t("、 ")),n[12]||(n[12]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md"},"Exposed",-1)),n[13]||(n[13]=t("、 ")),n[14]||(n[14]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md"},"Postgres",-1))])]),_:1}),o(v,null,{default:e(()=>n[16]||(n[16]=[t(" 學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。 ")])),_:1}),o(S,null,{default:e(()=>n[17]||(n[17]=[t(" 學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫。 ")])),_:1}),o(E,null,{default:e(()=>n[18]||(n[18]=[t(" 學習如何使用 Kotlin 和 Ktor 建立單頁應用程式 (SPA)，其中 RESTful 服務連結到資料庫儲存庫。它使用 Exposed SQL 函式庫並允許您使用模擬儲存庫進行測試。 ")])),_:1}),n[314]||(n[314]=l("p",null,[t(" 在本文中，您將學習如何使用 Kotlin 的 SQL 函式庫 "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t("，將您的 Ktor 服務與關聯式資料庫整合。 ")],-1)),n[315]||(n[315]=l("p",null,"透過本教程，您將學習如何執行以下操作：",-1)),o(k,null,{default:e(()=>n[19]||(n[19]=[l("li",null,"建立使用 JSON 序列化的 RESTful 服務。",-1),l("li",null,"將不同的儲存庫注入到這些服務中。",-1),l("li",null,"使用模擬儲存庫為您的服務建立單元測試。",-1),l("li",null,"使用 Exposed 和依賴注入 (DI) 建立可運作的儲存庫。",-1),l("li",null,"部署存取外部資料庫的服務。",-1)])),_:1}),l("p",null,[n[23]||(n[23]=t(" 在先前的教程中，我們使用「任務管理器」範例涵蓋了基礎知識，例如")),o(d,{href:"/ktor/server-requests-and-responses",summary:"學習在 Kotlin 中使用 Ktor 建立任務管理器應用程式時，關於路由、處理請求和參數的基礎知識。"},{default:e(()=>n[20]||(n[20]=[t("處理請求")])),_:1}),n[24]||(n[24]=t("、 ")),o(d,{href:"/ktor/server-create-restful-apis",summary:"學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[21]||(n[21]=[t("建立 RESTful API")])),_:1}),n[25]||(n[25]=t(" 或 ")),o(d,{href:"/ktor/server-create-website",summary:"學習如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板建立網站。"},{default:e(()=>n[22]||(n[22]=[t("使用 Thymeleaf 模板建立 Web 應用程式")])),_:1}),n[26]||(n[26]=t("。 雖然這些教程側重於使用簡單的記憶體內部 ")),n[27]||(n[27]=l("code",null,"TaskRepository",-1)),n[28]||(n[28]=t(" 的前端功能， 本指南則將重點轉移到如何透過 ")),n[29]||(n[29]=l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed SQL 函式庫",-1)),n[30]||(n[30]=t("讓您的 Ktor 服務與關聯式資料庫互動。 "))]),n[316]||(n[316]=l("p",null," 儘管本指南較長且更複雜，您仍然能快速產生可運作的程式碼並逐步引入新功能。 ",-1)),n[317]||(n[317]=l("p",null,"本指南將分為兩個部分：",-1)),o(k,{type:"decimal"},{default:e(()=>n[31]||(n[31]=[l("li",null,[l("a",{href:"#create-restful-service-and-repository"},"使用記憶體內部儲存庫建立您的應用程式。")],-1),l("li",null,[l("a",{href:"#add-postgresql-repository"},"將記憶體內部儲存庫替換為使用 PostgreSQL 的儲存庫。")],-1)])),_:1}),o(u,{title:"先決條件",id:"prerequisites"},{default:e(()=>[l("p",null,[n[33]||(n[33]=t(" 您可以獨立完成本教程，但是，我們建議您完成")),o(d,{href:"/ktor/server-create-restful-apis",summary:"學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[32]||(n[32]=[t("建立 RESTful API")])),_:1}),n[34]||(n[34]=t(" 教程，以便熟悉內容協商 (Content Negotiation) 和 REST。 "))]),n[35]||(n[35]=l("p",null,[t("我們建議您安裝 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t("，但您也可以使用您選擇的其他 IDE。 ")],-1))]),_:1}),o(u,{title:"建立 RESTful 服務和記憶體內部儲存庫",id:"create-restful-service-and-repository"},{default:e(()=>[n[175]||(n[175]=l("p",null," 首先，您將重新建立您的任務管理器 RESTful 服務。最初，這將使用記憶體內部儲存庫，但您將設計其結構，使其能夠以最小的努力進行替換。 ",-1)),n[176]||(n[176]=l("p",null,"您將分六個階段進行：",-1)),o(k,{type:"decimal"},{default:e(()=>n[36]||(n[36]=[l("li",null,[l("a",{href:"#create-project"},"建立初始專案。")],-1),l("li",null,[l("a",{href:"#add-starter-code"},"新增入門程式碼。")],-1),l("li",null,[l("a",{href:"#add-routes"},"新增 CRUD 路由。")],-1),l("li",null,[l("a",{href:"#add-client-page"},"新增單頁應用程式 (SPA)。")],-1),l("li",null,[l("a",{href:"#test-manually"},"手動測試應用程式。")],-1),l("li",null,[l("a",{href:"#add-automated-tests"},"新增自動化測試。")],-1)])),_:1}),o(u,{title:"使用外掛程式建立新專案",id:"create-project"},{default:e(()=>[n[70]||(n[70]=l("p",null," 若要使用 Ktor 專案生成器建立新專案，請按照以下步驟操作： ",-1)),o(p,{id:"create-project-procedure"},{default:e(()=>[o(s,null,{default:e(()=>n[37]||(n[37]=[l("p",null,[t(" 導航至 "),l("a",{href:"https://start.ktor.io/"},"Ktor 專案生成器"),t(" 。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[40]||(n[40]=t("在 ")),o(m,null,{default:e(()=>n[38]||(n[38]=[t("專案構件")])),_:1}),n[41]||(n[41]=t(" 欄位中，輸入 ")),o(i,null,{default:e(()=>n[39]||(n[39]=[t("com.example.ktor-exposed-task-app")])),_:1}),n[42]||(n[42]=t(" 作為您的專案構件名稱。 ")),n[43]||(n[43]=l("img",{src:A,alt:"在 Ktor 專案生成器中命名專案構件","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[45]||(n[45]=t(" 在外掛程式區段中，透過點擊 ")),o(m,null,{default:e(()=>n[44]||(n[44]=[t("新增")])),_:1}),n[46]||(n[46]=t(" 按鈕來搜尋並新增以下外掛程式： "))]),o(k,{type:"bullet"},{default:e(()=>n[47]||(n[47]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1),l("li",null,"Status Pages",-1),l("li",null,"Exposed",-1),l("li",null,"Postgres",-1)])),_:1}),n[48]||(n[48]=l("p",null,[l("img",{src:C,alt:"在 Ktor 專案生成器中新增外掛程式","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[50]||(n[50]=t(" 新增外掛程式後，點擊外掛程式區段右上角的 ")),o(m,null,{default:e(()=>n[49]||(n[49]=[t("7 plugins")])),_:1}),n[51]||(n[51]=t(" 按鈕，以查看已新增的外掛程式。 "))]),n[52]||(n[52]=l("p",null,[t("然後您將看到所有將新增到您專案中的外掛程式列表： "),l("img",{src:P,alt:"Ktor 專案生成器中的外掛程式下拉選單","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[54]||(n[54]=t(" 點擊 ")),o(m,null,{default:e(()=>n[53]||(n[53]=[t("下載")])),_:1}),n[55]||(n[55]=t(" 按鈕以生成並下載您的 Ktor 專案。 "))])]),_:1}),o(s,null,{default:e(()=>n[56]||(n[56]=[l("p",null,[t(" 在 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t(" 或您選擇的其他 IDE 中開啟生成的專案。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[60]||(n[60]=t(" 導航至 ")),o(i,null,{default:e(()=>n[57]||(n[57]=[t("src/main/kotlin/com/example")])),_:1}),n[61]||(n[61]=t(" 並刪除檔案 ")),o(i,null,{default:e(()=>n[58]||(n[58]=[t("CitySchema.kt")])),_:1}),n[62]||(n[62]=t(" 和 ")),o(i,null,{default:e(()=>n[59]||(n[59]=[t("UsersSchema.kt")])),_:1}),n[63]||(n[63]=t(" 。 "))])]),_:1}),o(s,{id:"delete-function"},{default:e(()=>[l("p",null,[n[65]||(n[65]=t(" 開啟 ")),o(i,null,{default:e(()=>n[64]||(n[64]=[t("Databases.kt")])),_:1}),n[66]||(n[66]=t(" 檔案並移除 ")),n[67]||(n[67]=l("code",null,"configureDatabases()",-1)),n[68]||(n[68]=t(" 函數的內容。 "))]),o(r,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                        }`}),n[69]||(n[69]=l("p",null," 移除此功能的理由是 Ktor 專案生成器已新增範例程式碼，以展示如何將使用者和城市資料持久化到 HSQLDB 或 PostgreSQL。本教程中不需要該範例程式碼。 ",-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"新增入門程式碼",id:"add-starter-code"},{default:e(()=>[o(p,{id:"add-starter-code-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[n[73]||(n[73]=t(" 導航至 ")),o(i,null,{default:e(()=>n[71]||(n[71]=[t("src/main/kotlin/com/example")])),_:1}),n[74]||(n[74]=t(" 並建立一個名為 ")),o(i,null,{default:e(()=>n[72]||(n[72]=[t("model")])),_:1}),n[75]||(n[75]=t(" 的子套件。 "))]),_:1}),o(s,null,{default:e(()=>[n[78]||(n[78]=t(" 在 ")),o(i,null,{default:e(()=>n[76]||(n[76]=[t("model")])),_:1}),n[79]||(n[79]=t(" 套件內，建立一個新的 ")),o(i,null,{default:e(()=>n[77]||(n[77]=[t("Task.kt")])),_:1}),n[80]||(n[80]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[82]||(n[82]=t(" 開啟 ")),o(i,null,{default:e(()=>n[81]||(n[81]=[t("Task.kt")])),_:1}),n[83]||(n[83]=t(" 並新增一個 ")),n[84]||(n[84]=l("code",null,"enum",-1)),n[85]||(n[85]=t(" 來表示優先級，以及一個 ")),n[86]||(n[86]=l("code",null,"class",-1)),n[87]||(n[87]=t(" 來表示任務。 "))]),o(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),l("p",null,[n[89]||(n[89]=l("code",null,"Task",-1)),n[90]||(n[90]=t(" 類別使用 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式主要有兩個目的：協商客戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:e(()=>n[88]||(n[88]=[t("kotlinx.serialization")])),_:1}),n[91]||(n[91]=t(" 函式庫中的 ")),n[92]||(n[92]=l("code",null,"Serializable",-1)),n[93]||(n[93]=t(" 類型進行註解。 "))]),n[94]||(n[94]=l("p",null,[t(" 與先前的教程一樣，您將建立一個記憶體內部儲存庫。然而，這次儲存庫將實作一個 "),l("code",null,"interface"),t("，以便您以後可以輕鬆替換它。 ")],-1))]),_:1}),o(s,null,{default:e(()=>[n[97]||(n[97]=t(" 在 ")),o(i,null,{default:e(()=>n[95]||(n[95]=[t("model")])),_:1}),n[98]||(n[98]=t(" 子套件中，建立一個新的 ")),o(i,null,{default:e(()=>n[96]||(n[96]=[t("TaskRepository.kt")])),_:1}),n[99]||(n[99]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[101]||(n[101]=t(" 開啟 ")),o(i,null,{default:e(()=>n[100]||(n[100]=[t("TaskRepository.kt")])),_:1}),n[102]||(n[102]=t(" 並新增以下 ")),n[103]||(n[103]=l("code",null,"interface",-1)),n[104]||(n[104]=t("： "))]),o(r,{lang:"kotlin",code:`                        package com.example.model

                        interface TaskRepository {
                            fun allTasks(): List<Task>
                            fun tasksByPriority(priority: Priority): List<Task>
                            fun taskByName(name: String): Task?
                            fun addTask(task: Task)
                            fun removeTask(name: String): Boolean
                        }`})]),_:1}),o(s,null,{default:e(()=>[n[106]||(n[106]=t(" 在同一個目錄中建立一個新的 ")),o(i,null,{default:e(()=>n[105]||(n[105]=[t("FakeTaskRepository.kt")])),_:1}),n[107]||(n[107]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[109]||(n[109]=t(" 開啟 ")),o(i,null,{default:e(()=>n[108]||(n[108]=[t("FakeTaskRepository.kt")])),_:1}),n[110]||(n[110]=t(" 並新增以下 ")),n[111]||(n[111]=l("code",null,"class",-1)),n[112]||(n[112]=t("： "))]),o(r,{lang:"kotlin",code:`                        package com.example.model

                        class FakeTaskRepository : TaskRepository {
                            private val tasks = mutableListOf(
                                Task("cleaning", "Clean the house", Priority.Low),
                                Task("gardening", "Mow the lawn", Priority.Medium),
                                Task("shopping", "Buy the groceries", Priority.High),
                                Task("painting", "Paint the fence", Priority.Medium)
                            )

                            override fun allTasks(): List<Task> = tasks

                            override fun tasksByPriority(priority: Priority) = tasks.filter {
                                it.priority == priority
                            }

                            override fun taskByName(name: String) = tasks.find {
                                it.name.equals(name, ignoreCase = true)
                            }

                            override fun addTask(task: Task) {
                                if (taskByName(task.name) != null) {
                                    throw IllegalStateException("Cannot duplicate task names!")
                                }
                                tasks.add(task)
                            }

                            override fun removeTask(name: String): Boolean {
                                return tasks.removeIf { it.name == name }
                            }
                        }`})]),_:1})]),_:1})]),_:1}),o(u,{title:"新增路由",id:"add-routes"},{default:e(()=>[o(p,{id:"add-routes-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[n[115]||(n[115]=t(" 開啟 ")),o(i,null,{default:e(()=>n[113]||(n[113]=[t("src/main/kotlin/com/example")])),_:1}),n[116]||(n[116]=t(" 中的 ")),o(i,null,{default:e(()=>n[114]||(n[114]=[t("Serialization.kt")])),_:1}),n[117]||(n[117]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[125]||(n[125]=l("p",null,[t(" 將現有的 "),l("code",null,"Application.configureSerialization()"),t(" 函數替換為以下實作： ")],-1)),o(r,{lang:"kotlin",code:`package com.example

import com.example.model.Priority
import com.example.model.Task
import com.example.model.TaskRepository
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureSerialization(repository: TaskRepository) {
    install(ContentNegotiation) {
        json()
    }
    routing {
        route("/tasks") {
            get {
                val tasks = repository.allTasks()
                call.respond(tasks)
            }

            get("/byName/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = repository.taskByName(name)
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
                    val tasks = repository.tasksByPriority(priority)


                    if (tasks.isEmpty()) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    call.respond(tasks)
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            post {
                try {
                    val task = call.receive<Task>()
                    repository.addTask(task)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            delete("/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (repository.removeTask(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}`}),l("p",null,[n[119]||(n[119]=t(" 這是您在 ")),o(d,{href:"/ktor/server-create-restful-apis",summary:"學習如何使用 Kotlin 和 Ktor 建立後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。"},{default:e(()=>n[118]||(n[118]=[t("建立 RESTful API")])),_:1}),n[120]||(n[120]=t(" 教程中實作的相同路由，只是現在您將儲存庫作為參數傳遞到 ")),n[121]||(n[121]=l("code",null,"routing()",-1)),n[122]||(n[122]=t(" 函數中。由於參數的類型是一個 ")),n[123]||(n[123]=l("code",null,"interface",-1)),n[124]||(n[124]=t("，因此可以注入許多不同的實作。 "))]),n[126]||(n[126]=l("p",null,[t(" 現在您已將參數新增到 "),l("code",null,"configureSerialization()"),t("，現有的呼叫將不再編譯。幸運的是，此函數僅被呼叫一次。 ")],-1))]),_:1}),o(s,null,{default:e(()=>[n[129]||(n[129]=t(" 開啟 ")),o(i,null,{default:e(()=>n[127]||(n[127]=[t("src/main/kotlin/com/example")])),_:1}),n[130]||(n[130]=t(" 內的 ")),o(i,null,{default:e(()=>n[128]||(n[128]=[t("Application.kt")])),_:1}),n[131]||(n[131]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[132]||(n[132]=l("p",null,[t(" 將 "),l("code",null,"module()"),t(" 函數替換為以下實作： ")],-1)),o(r,{lang:"kotlin",code:`                    import com.example.model.FakeTaskRepository
                    //...

                    fun Application.module() {
                        val repository = FakeTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[133]||(n[133]=l("p",null,[t(" 您現在正將 "),l("code",null,"FakeTaskRepository"),t(" 的實例注入到 "),l("code",null,"configureSerialization()"),t(" 中。 長期目標是能夠將其替換為 "),l("code",null,"PostgresTaskRepository"),t("。 ")],-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"新增客戶端頁面",id:"add-client-page"},{default:e(()=>[o(p,{id:"add-client-page-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[n[136]||(n[136]=t(" 開啟 ")),o(i,null,{default:e(()=>n[134]||(n[134]=[t("src/main/resources/static")])),_:1}),n[137]||(n[137]=t(" 中的 ")),o(i,null,{default:e(()=>n[135]||(n[135]=[t("index.html")])),_:1}),n[138]||(n[138]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[139]||(n[139]=l("p",null," 將目前的內容替換為以下實作： ",-1)),o(r,{lang:"html",code:`<html>
<head>
    <title>A Simple SPA For Tasks</title>
    <script type="application/javascript">
        function displayAllTasks() {
            clearTasksTable();
            fetchAllTasks().then(displayTasks)
        }

        function displayTasksWithPriority() {
            clearTasksTable();
            const priority = readTaskPriority();
            fetchTasksWithPriority(priority).then(displayTasks)
        }

        function displayTask(name) {
            fetchTaskWithName(name).then(t =>
                taskDisplay().innerHTML
                    = \`\${t.priority} priority task \${t.name} with description "\${t.description}"\`
            )
        }

        function deleteTask(name) {
            deleteTaskWithName(name).then(() => {
                clearTaskDisplay();
                displayAllTasks();
            })
        }

        function deleteTaskWithName(name) {
            return sendDELETE(\`/tasks/\${name}\`)
        }

        function addNewTask() {
            const task = buildTaskFromForm();
            sendPOST("/tasks", task).then(displayAllTasks);
        }

        function buildTaskFromForm() {
            return {
                name: getTaskFormValue("newTaskName"),
                description: getTaskFormValue("newTaskDescription"),
                priority: getTaskFormValue("newTaskPriority")
            }
        }

        function getTaskFormValue(controlName) {
            return document.addTaskForm[controlName].value;
        }

        function taskDisplay() {
            return document.getElementById("currentTaskDisplay");
        }

        function readTaskPriority() {
            return document.priorityForm.priority.value
        }

        function fetchTasksWithPriority(priority) {
            return sendGET(\`/tasks/byPriority/\${priority}\`);
        }

        function fetchTaskWithName(name) {
            return sendGET(\`/tasks/byName/\${name}\`);
        }

        function fetchAllTasks() {
            return sendGET("/tasks")
        }

        function sendGET(url) {
            return fetch(
                url,
                {headers: {'Accept': 'application/json'}}
            ).then(response => {
                if (response.ok) {
                    return response.json()
                }
                return [];
            });
        }

        function sendPOST(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        }

        function sendDELETE(url) {
            return fetch(url, {
                method: "DELETE"
            });
        }

        function tasksTable() {
            return document.getElementById("tasksTableBody");
        }

        function clearTasksTable() {
            tasksTable().innerHTML = "";
        }

        function clearTaskDisplay() {
            taskDisplay().innerText = "None";
        }

        function displayTasks(tasks) {
            const tasksTableBody = tasksTable()
            tasks.forEach(task => {
                const newRow = taskRow(task);
                tasksTableBody.appendChild(newRow);
            });
        }

        function taskRow(task) {
            return tr([
                td(task.name),
                td(task.priority),
                td(viewLink(task.name)),
                td(deleteLink(task.name)),
            ]);
        }

        function tr(children) {
            const node = document.createElement("tr");
            children.forEach(child => node.appendChild(child));
            return node;
        }

        function td(content) {
            const node = document.createElement("td");
            if (content instanceof Element) {
                node.appendChild(content)
            } else {
                node.appendChild(document.createTextNode(content));
            }
            return node;
        }

        function viewLink(taskName) {
            const node = document.createElement("a");
            node.setAttribute(
                "href", \`javascript:displayTask("\${taskName}")\`
            )
            node.appendChild(document.createTextNode("view"));
            return node;
        }

        function deleteLink(taskName) {
            const node = document.createElement("a");
            node.setAttribute(
                "href", \`javascript:deleteTask("\${taskName}")\`
            )
            node.appendChild(document.createTextNode("delete"));
            return node;
        }
    <\/script>
</head>
<body onload="displayAllTasks()">
<h1>任務管理器客戶端</h1>
<form action="javascript:displayAllTasks()">
    <span>檢視所有任務</span>
    <input type="submit" value="前往">
</form>
<form name="priorityForm" action="javascript:displayTasksWithPriority()">
    <span>檢視具有優先級的任務</span>
    <select name="priority">
        <option name="Low">低</option>
        <option name="Medium">中</option>
        <option name="High">高</option>
        <option name="Vital">關鍵</option>
    </select>
    <input type="submit" value="前往">
</form>
<form name="addTaskForm" action="javascript:addNewTask()">
    <span>建立新任務與</span>
    <label for="newTaskName">名稱</label>
    <input type="text" id="newTaskName" name="newTaskName" size="10">
    <label for="newTaskDescription">描述</label>
    <input type="text" id="newTaskDescription" name="newTaskDescription" size="20">
    <label for="newTaskPriority">優先級</label>
    <select id="newTaskPriority" name="newTaskPriority">
        <option name="Low">低</option>
        <option name="Medium">中</option>
        <option name="High">高</option>
        <option name="Vital">關鍵</option>
    </select>
    <input type="submit" value="前往">
</form>
<hr>
<div>
    目前任務是 <em id="currentTaskDisplay">無</em>
</div>
<hr>
<table>
    <thead>
    <tr>
        <th>名稱</th>
        <th>優先級</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[140]||(n[140]=l("p",null," 這與先前教程中使用的 SPA 相同。因為它是用 JavaScript 編寫的，並且只使用了瀏覽器中可用的函式庫，所以您不必擔心客戶端依賴項。 ",-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"手動測試應用程式",id:"test-manually"},{default:e(()=>[o(p,{id:"test-manually-procedure"},{default:e(()=>[n[156]||(n[156]=l("p",null," 由於這次迭代使用的是記憶體內部儲存庫，而不是連接到資料庫，您需要確保應用程式已正確配置。 ",-1)),o(s,null,{default:e(()=>[l("p",null,[n[142]||(n[142]=t(" 導航至 ")),o(i,null,{default:e(()=>n[141]||(n[141]=[t("src/main/resources/application.yaml")])),_:1}),n[143]||(n[143]=t(" 並移除 ")),n[144]||(n[144]=l("code",null,"postgres",-1)),n[145]||(n[145]=t(" 配置。 "))]),o(r,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module
    deployment:
        port: 8080`})]),_:1}),o(s,null,{default:e(()=>n[146]||(n[146]=[l("p",null,[t("在 IntelliJ IDEA 中，點擊執行按鈕 ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"}),t(") 來啟動應用程式。")],-1)])),_:1}),o(s,null,{default:e(()=>n[147]||(n[147]=[l("p",null,[t(" 在瀏覽器中導航至 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t("。您應該會看到客戶端頁面，其中包含三個表單和一個顯示篩選結果的表格。 ")],-1),l("img",{src:R,alt:"顯示任務管理器客戶端的瀏覽器視窗","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[151]||(n[151]=t(" 透過填寫並使用 ")),o(m,null,{default:e(()=>n[148]||(n[148]=[t("前往")])),_:1}),n[152]||(n[152]=t(" 按鈕傳送表單來測試應用程式。使用表格項目上的 ")),o(m,null,{default:e(()=>n[149]||(n[149]=[t("檢視")])),_:1}),n[153]||(n[153]=t(" 和 ")),o(m,null,{default:e(()=>n[150]||(n[150]=[t("刪除")])),_:1}),n[154]||(n[154]=t(" 按鈕。 "))]),n[155]||(n[155]=l("img",{src:L,alt:"顯示任務管理器客戶端的瀏覽器視窗","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"新增自動化單元測試",id:"add-automated-tests"},{default:e(()=>[o(p,{id:"add-automated-tests-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[159]||(n[159]=t(" 開啟 ")),o(i,null,{default:e(()=>n[157]||(n[157]=[t("src/test/kotlin/com/example")])),_:1}),n[160]||(n[160]=t(" 中的 ")),o(i,null,{default:e(()=>n[158]||(n[158]=[t("ApplicationTest.kt")])),_:1}),n[161]||(n[161]=t(" 並新增以下測試： "))]),o(r,{lang:"kotlin",code:`package com.example

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
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
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
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
        }
        val response = client.get("/tasks/byPriority/Invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun unusedPriorityProduces404() = testApplication {
        application {
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
        }

        val response = client.get("/tasks/byPriority/Vital")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
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
        assertEquals(HttpStatusCode.NoContent, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2
            .body<List<Task>>()
            .map { it.name }

        assertContains(taskNames, "swimming")
    }
}`}),n[162]||(n[162]=l("p",null,[t(" 為使這些測試能夠編譯和執行，您需要為 Ktor 客戶端新增對 "),l("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html"},"Content Negotiation"),t(" 外掛程式的依賴項。 ")],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[164]||(n[164]=t(" 開啟 ")),o(i,null,{default:e(()=>n[163]||(n[163]=[t("gradle/libs.versions.toml")])),_:1}),n[165]||(n[165]=t(" 檔案並指定以下函式庫： "))]),o(r,{lang:"kotlin",code:`                        [libraries]
                        #...
                        ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[167]||(n[167]=t(" 開啟 ")),o(i,null,{default:e(()=>n[166]||(n[166]=[t("build.gradle.kts")])),_:1}),n[168]||(n[168]=t(" 並新增以下依賴項： "))]),o(r,{lang:"kotlin",code:`                        dependencies {
                            //...
                            testImplementation(libs.ktor.client.content.negotiation)
                        }`})]),_:1}),o(s,null,{default:e(()=>n[169]||(n[169]=[l("p",null,[t("在 IntelliJ IDEA 中，點擊通知 Gradle 圖示 ("),l("img",{alt:"IntelliJ IDEA Gradle 圖示",src:g,width:"16",height:"26"}),t(") 在編輯器右側以載入 Gradle 變更。")],-1)])),_:1}),o(s,null,{default:e(()=>[n[173]||(n[173]=l("p",null,[t("在 IntelliJ IDEA 中，點擊測試類別定義旁邊的執行按鈕 ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"}),t(") 來執行測試。")],-1)),l("p",null,[n[171]||(n[171]=t("然後您應該會在 ")),o(m,null,{default:e(()=>n[170]||(n[170]=[t("執行")])),_:1}),n[172]||(n[172]=t(" 窗格中看到測試成功執行。 "))]),n[174]||(n[174]=l("img",{src:I,alt:"IntelliJ IDEA 執行窗格中顯示成功的測試結果","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(u,{title:"新增 PostgreSQL 儲存庫",id:"add-postgresql-repository"},{default:e(()=>[n[303]||(n[303]=l("p",null," 現在您已經有一個使用記憶體內部資料的運作中應用程式，下一步是將資料儲存外部化到 PostgreSQL 資料庫。 ",-1)),n[304]||(n[304]=l("p",null," 您將透過執行以下操作來實現這一點： ",-1)),o(k,{type:"decimal"},{default:e(()=>n[177]||(n[177]=[l("li",null,[l("a",{href:"#create-schema"},"在 PostgreSQL 中建立資料庫綱要。")],-1),l("li",null,[l("a",{href:"#adapt-repo"},[t("使 "),l("code",null,"TaskRepository"),t(" 適應非同步存取。")])],-1),l("li",null,[l("a",{href:"#config-db-connection"},"在應用程式中配置資料庫連線。")],-1),l("li",null,[l("a",{href:"#create-mapping"},[t("將 "),l("code",null,"Task"),t(" 類型映射到相關的資料庫表格。")])],-1),l("li",null,[l("a",{href:"#create-new-repo"},"基於此映射建立一個新的儲存庫。")],-1),l("li",null,[l("a",{href:"#switch-repo"},"在啟動程式碼中切換到這個新儲存庫。")],-1)])),_:1}),o(u,{title:"建立資料庫綱要",id:"create-schema"},{default:e(()=>[o(p,{id:"create-schema-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[179]||(n[179]=t(" 使用您選擇的資料庫管理工具，在 PostgreSQL 中建立一個新資料庫。 名稱無關緊要，只要您記得它即可。在此範例中，我們將使用 ")),o(i,null,{default:e(()=>n[178]||(n[178]=[t("ktor_tutorial_db")])),_:1}),n[180]||(n[180]=t(" 。 "))]),o(f,null,{default:e(()=>n[181]||(n[181]=[l("p",null,[t(" 有關 PostgreSQL 的更多資訊，請參閱 "),l("a",{href:"https://www.postgresql.org/docs/current/"},"官方文件"),t("。 ")],-1),l("p",null,[t(" 在 IntelliJ IDEA 中，您可以使用資料庫工具來"),l("a",{href:"https://www.jetbrains.com/help/idea/postgresql.html"},"連接和管理您的 PostgreSQL 資料庫。")],-1)])),_:1})]),_:1}),o(s,null,{default:e(()=>[n[199]||(n[199]=l("p",null," 對您的資料庫執行以下 SQL 命令。這些命令將建立並填充資料庫綱要： ",-1)),o(r,{lang:"sql",code:`                        DROP TABLE IF EXISTS task;
                        CREATE TABLE task(id SERIAL PRIMARY KEY, name VARCHAR(50), description VARCHAR(50), priority VARCHAR(50));

                        INSERT INTO task (name, description, priority) VALUES ('cleaning', 'Clean the house', 'Low');
                        INSERT INTO task (name, description, priority) VALUES ('gardening', 'Mow the lawn', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('shopping', 'Buy the groceries', 'High');
                        INSERT INTO task (name, description, priority) VALUES ('painting', 'Paint the fence', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('exercising', 'Walk the dog', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('meditating', 'Contemplate the infinite', 'High');`}),n[200]||(n[200]=l("p",null," 請注意以下事項： ",-1)),o(k,null,{default:e(()=>[l("li",null,[n[186]||(n[186]=t(" 您正在建立一個名為 ")),o(i,null,{default:e(()=>n[182]||(n[182]=[t("task")])),_:1}),n[187]||(n[187]=t(" 的單一表格，其中包含用於 ")),o(i,null,{default:e(()=>n[183]||(n[183]=[t("name")])),_:1}),n[188]||(n[188]=t(" 、 ")),o(i,null,{default:e(()=>n[184]||(n[184]=[t("description")])),_:1}),n[189]||(n[189]=t(" 和 ")),o(i,null,{default:e(()=>n[185]||(n[185]=[t("priority")])),_:1}),n[190]||(n[190]=t(" 的欄位。這些欄位需要映射到 ")),n[191]||(n[191]=l("code",null,"Task",-1)),n[192]||(n[192]=t(" 類別的屬性。 "))]),n[198]||(n[198]=l("li",null," 如果表格已存在，您將重新建立它，因此您可以重複執行腳本。 ",-1)),l("li",null,[n[194]||(n[194]=t(" 還有一個名為 ")),o(i,null,{default:e(()=>n[193]||(n[193]=[t("id")])),_:1}),n[195]||(n[195]=t(" 的額外欄位，其類型為 ")),n[196]||(n[196]=l("code",null,"SERIAL",-1)),n[197]||(n[197]=t("。這將是一個整數值，用於為每一列提供其主鍵。這些值將由資料庫為您自動分配。 "))])]),_:1})]),_:1})]),_:1})]),_:1}),o(u,{title:"調整現有儲存庫",id:"adapt-repo"},{default:e(()=>[o(p,{id:"adapt-repo-procedure"},{default:e(()=>[n[215]||(n[215]=l("p",null,[t(" 當對資料庫執行查詢時，最好讓它們非同步執行以避免阻塞處理 HTTP 請求的執行緒。在 Kotlin 中，這最好透過 "),l("a",{href:"https://kotlinlang.org/docs/coroutines-overview.html"},"協程 (coroutines)"),t(" 來管理。 ")],-1)),o(s,null,{default:e(()=>[l("p",null,[n[203]||(n[203]=t(" 開啟 ")),o(i,null,{default:e(()=>n[201]||(n[201]=[t("src/main/kotlin/com/example/model")])),_:1}),n[204]||(n[204]=t(" 中的 ")),o(i,null,{default:e(()=>n[202]||(n[202]=[t("TaskRepository.kt")])),_:1}),n[205]||(n[205]=t(" 檔案。 "))])]),_:1}),o(s,null,{default:e(()=>[n[206]||(n[206]=l("p",null,[t(" 將 "),l("code",null,"suspend"),t(" 關鍵字新增到所有介面方法： ")],-1)),o(r,{lang:"kotlin",code:`                    interface TaskRepository {
                        suspend fun allTasks(): List<Task>
                        suspend fun tasksByPriority(priority: Priority): List<Task>
                        suspend fun taskByName(name: String): Task?
                        suspend fun addTask(task: Task)
                        suspend fun removeTask(name: String): Boolean
                    }`}),n[207]||(n[207]=l("p",null," 這將允許介面方法的實作在不同的協程調度器 (Coroutine Dispatcher) 上啟動工作。 ",-1)),n[208]||(n[208]=l("p",null,[t(" 您現在需要調整 "),l("code",null,"FakeTaskRepository"),t(" 的方法以匹配，儘管您不需要在該實作中切換調度器。 ")],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[210]||(n[210]=t(" 開啟 ")),o(i,null,{default:e(()=>n[209]||(n[209]=[t("FakeTaskRepository.kt")])),_:1}),n[211]||(n[211]=t(" 檔案並將 ")),n[212]||(n[212]=l("code",null,"suspend",-1)),n[213]||(n[213]=t(" 關鍵字新增到所有方法： "))]),o(r,{lang:"kotlin",code:`                    class FakeTaskRepository : TaskRepository {
                        //...

                        override suspend fun allTasks(): List<Task> = tasks

                        override suspend fun tasksByPriority(priority: Priority) = tasks.filter {
                            //...
                        }

                        override suspend fun taskByName(name: String) = tasks.find {
                            //...
                        }

                        override suspend fun addTask(task: Task) {
                            //...
                        }

                        override suspend fun removeTask(name: String): Boolean {
                            //...
                        }
                    }`}),n[214]||(n[214]=l("p",null,[t(" 到目前為止，您沒有引入任何新功能。相反，您為建立一個將非同步執行資料庫查詢的 "),l("code",null,"PostgresTaskRepository"),t(" 奠定了基礎。 ")],-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"配置資料庫連線",id:"config-db-connection"},{default:e(()=>[o(p,{id:"config-db-connection-procedure"},{default:e(()=>[l("p",null,[n[217]||(n[217]=t(" 在 ")),n[218]||(n[218]=l("a",{href:"#delete-function"},"本教程的第一部分",-1)),n[219]||(n[219]=t(" 中，您刪除了在 ")),o(i,null,{default:e(()=>n[216]||(n[216]=[t("Databases.kt")])),_:1}),n[220]||(n[220]=t(" 中找到的 ")),n[221]||(n[221]=l("code",null,"configureDatabases()",-1)),n[222]||(n[222]=t(" 方法中的範例程式碼。您現在已準備好新增您自己的實作。 "))]),o(s,null,{default:e(()=>[n[225]||(n[225]=t(" 開啟 ")),o(i,null,{default:e(()=>n[223]||(n[223]=[t("src/main/kotlin/com/example")])),_:1}),n[226]||(n[226]=t(" 中的 ")),o(i,null,{default:e(()=>n[224]||(n[224]=[t("Databases.kt")])),_:1}),n[227]||(n[227]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[230]||(n[230]=l("p",null,[t(" 使用 "),l("code",null,"Database.connect()"),t(" 函數連接到您的資料庫，調整設定值以符合您的環境： ")],-1)),o(r,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                            Database.connect(
                                "jdbc:postgresql://localhost:5432/ktor_tutorial_db",
                                user = "postgres",
                                password = "password"
                            )
                        }`}),n[231]||(n[231]=l("p",null,[t("請注意，"),l("code",null,"url"),t(" 包含以下組件：")],-1)),o(k,null,{default:e(()=>n[228]||(n[228]=[l("li",null,[l("code",null,"localhost:5432"),t(" 是 PostgreSQL 資料庫運行的主機和埠。 ")],-1),l("li",null,[l("code",null,"ktor_tutorial_db"),t(" 是執行服務時建立的資料庫名稱。 ")],-1)])),_:1}),o(f,null,{default:e(()=>n[229]||(n[229]=[t(" 更多資訊請參閱 "),l("a",{href:"https://jetbrains.github.io/Exposed/database-and-datasource.html"}," 在 Exposed 中使用 Database 和 DataSource",-1),t("。 ")])),_:1})]),_:1})]),_:1})]),_:1}),o(u,{title:"建立物件/關聯式對應",id:"create-mapping"},{default:e(()=>[o(p,{id:"create-mapping-procedure"},{default:e(()=>[o(s,null,{default:e(()=>[n[234]||(n[234]=t(" 導航至 ")),o(i,null,{default:e(()=>n[232]||(n[232]=[t("src/main/kotlin/com/example")])),_:1}),n[235]||(n[235]=t(" 並建立一個名為 ")),o(i,null,{default:e(()=>n[233]||(n[233]=[t("db")])),_:1}),n[236]||(n[236]=t(" 的新套件。 "))]),_:1}),o(s,null,{default:e(()=>[n[239]||(n[239]=t(" 在 ")),o(i,null,{default:e(()=>n[237]||(n[237]=[t("db")])),_:1}),n[240]||(n[240]=t(" 套件內，建立一個新的 ")),o(i,null,{default:e(()=>n[238]||(n[238]=[t("mapping.kt")])),_:1}),n[241]||(n[241]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[243]||(n[243]=t(" 開啟 ")),o(i,null,{default:e(()=>n[242]||(n[242]=[t("mapping.kt")])),_:1}),n[244]||(n[244]=t(" 並新增類型 ")),n[245]||(n[245]=l("code",null,"TaskTable",-1)),n[246]||(n[246]=t(" 和 ")),n[247]||(n[247]=l("code",null,"TaskDAO",-1)),n[248]||(n[248]=t("： "))]),o(r,{lang:"kotlin",code:`package com.example.db

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object TaskTable : IntIdTable("task") {
    val name = varchar("name", 50)
    val description = varchar("description", 50)
    val priority = varchar("priority", 50)
}

class TaskDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<TaskDAO>(TaskTable)

    var name by TaskTable.name
    var description by TaskTable.description
    var priority by TaskTable.priority
}`}),l("p",null,[n[250]||(n[250]=t(" 這些類型使用 Exposed 函式庫將 ")),n[251]||(n[251]=l("code",null,"Task",-1)),n[252]||(n[252]=t(" 類型中的屬性映射到資料庫中 ")),o(i,null,{default:e(()=>n[249]||(n[249]=[t("task")])),_:1}),n[253]||(n[253]=t(" 表格中的欄位。")),n[254]||(n[254]=l("code",null,"TaskTable",-1)),n[255]||(n[255]=t(" 類型定義了基本映射，而 ")),n[256]||(n[256]=l("code",null,"TaskDAO",-1)),n[257]||(n[257]=t(" 類型則新增了輔助方法來建立、尋找、更新和刪除任務。 "))]),n[258]||(n[258]=l("p",null," Ktor 專案生成器尚未新增對 DAO 類型的支援，因此您需要在 Gradle 建置檔案中新增相關依賴項。 ",-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[260]||(n[260]=t(" 開啟 ")),o(i,null,{default:e(()=>n[259]||(n[259]=[t("gradle/libs.versions.toml")])),_:1}),n[261]||(n[261]=t(" 檔案並指定以下函式庫： "))]),o(r,{lang:"kotlin",code:`                       [libraries]
                       #...
                       exposed-dao = { module = "org.jetbrains.exposed:exposed-dao", version.ref = "exposed-version" }`})]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[263]||(n[263]=t(" 開啟 ")),o(i,null,{default:e(()=>n[262]||(n[262]=[t("build.gradle.kts")])),_:1}),n[264]||(n[264]=t(" 檔案並新增以下依賴項： "))]),o(r,{lang:"kotlin",code:`                        dependencies {
                            //...
                            implementation(libs.exposed.dao)
                        }`})]),_:1}),o(s,null,{default:e(()=>n[265]||(n[265]=[l("p",null,[t("在 IntelliJ IDEA 中，點擊通知 Gradle 圖示 ("),l("img",{alt:"IntelliJ IDEA Gradle 圖示",src:g,width:"16",height:"26"}),t(") 在編輯器右側以載入 Gradle 變更。")],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[267]||(n[267]=t(" 導航回 ")),o(i,null,{default:e(()=>n[266]||(n[266]=[t("mapping.kt")])),_:1}),n[268]||(n[268]=t(" 檔案並新增以下兩個輔助函數： "))]),o(r,{lang:"kotlin",code:`suspend fun <T> suspendTransaction(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao: TaskDAO) = Task(
    dao.name,
    dao.description,
    Priority.valueOf(dao.priority)
)`}),n[269]||(n[269]=l("p",null,[l("code",null,"suspendTransaction()"),t(" 接受一個程式碼區塊，並在資料庫交易中，透過 IO 調度器 (IO Dispatcher) 執行它。這是為了將阻塞型工作卸載到執行緒池 (thread pool)。 ")],-1)),n[270]||(n[270]=l("p",null,[l("code",null,"daoToModel()"),t(" 將 "),l("code",null,"TaskDAO"),t(" 類型的一個實例轉換為 "),l("code",null,"Task"),t(" 物件。 ")],-1))]),_:1}),o(s,null,{default:e(()=>[n[271]||(n[271]=l("p",null," 新增以下缺少的匯入： ",-1)),o(r,{lang:"kotlin",code:`import com.example.model.Priority
import com.example.model.Task
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction`})]),_:1})]),_:1})]),_:1}),o(u,{title:"編寫新儲存庫",id:"create-new-repo"},{default:e(()=>[o(p,{id:"create-new-repo-procedure"},{default:e(()=>[n[281]||(n[281]=l("p",null,"您現在擁有建立資料庫特定儲存庫所需的所有資源。",-1)),o(s,null,{default:e(()=>[n[274]||(n[274]=t(" 導航至 ")),o(i,null,{default:e(()=>n[272]||(n[272]=[t("src/main/kotlin/com/example/model")])),_:1}),n[275]||(n[275]=t(" 並建立一個新的 ")),o(i,null,{default:e(()=>n[273]||(n[273]=[t("PostgresTaskRepository.kt")])),_:1}),n[276]||(n[276]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[278]||(n[278]=t(" 開啟 ")),o(i,null,{default:e(()=>n[277]||(n[277]=[t("PostgresTaskRepository.kt")])),_:1}),n[279]||(n[279]=t(" 檔案並使用以下實作建立一個新類型： "))]),o(r,{lang:"kotlin",code:`package com.example.model

import com.example.db.TaskDAO
import com.example.db.TaskTable
import com.example.db.daoToModel
import com.example.db.suspendTransaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

class PostgresTaskRepository : TaskRepository {
    override suspend fun allTasks(): List<Task> = suspendTransaction {
        TaskDAO.all().map(::daoToModel)
    }

    override suspend fun tasksByPriority(priority: Priority): List<Task> = suspendTransaction {
        TaskDAO
            .find { (TaskTable.priority eq priority.toString()) }
            .map(::daoToModel)
    }

    override suspend fun taskByName(name: String): Task? = suspendTransaction {
        TaskDAO
            .find { (TaskTable.name eq name) }
            .limit(1)
            .map(::daoToModel)
            .firstOrNull()
    }

    override suspend fun addTask(task: Task): Unit = suspendTransaction {
        TaskDAO.new {
            name = task.name
            description = task.description
            priority = task.priority.toString()
        }
    }

    override suspend fun removeTask(name: String): Boolean = suspendTransaction {
        val rowsDeleted = TaskTable.deleteWhere {
            TaskTable.name eq name
        }
        rowsDeleted == 1
    }
}`}),n[280]||(n[280]=l("p",null,[t(" 在此實作中，您使用 "),l("code",null,"TaskDAO"),t(" 和 "),l("code",null,"TaskTable"),t(" 類型的輔助方法與資料庫互動。建立此新儲存庫後，剩下的唯一任務是在您的路由中切換到使用它。 ")],-1))]),_:1})]),_:1})]),_:1}),o(u,{title:"切換到新儲存庫",id:"switch-repo"},{default:e(()=>[o(p,{id:"switch-repo-procedure"},{default:e(()=>[n[297]||(n[297]=l("p",null,"要切換到外部資料庫，您只需要更改儲存庫類型。",-1)),o(s,null,{default:e(()=>[n[284]||(n[284]=t(" 開啟 ")),o(i,null,{default:e(()=>n[282]||(n[282]=[t("src/main/kotlin/com/example")])),_:1}),n[285]||(n[285]=t(" 中的 ")),o(i,null,{default:e(()=>n[283]||(n[283]=[t("Application.kt")])),_:1}),n[286]||(n[286]=t(" 檔案。 "))]),_:1}),o(s,null,{default:e(()=>[n[287]||(n[287]=l("p",null,[t(" 在 "),l("code",null,"Application.module()"),t(" 函數中，將 "),l("code",null,"FakeTaskRepository"),t(" 替換為 "),l("code",null,"PostgresTaskRepository"),t("： ")],-1)),o(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.PostgresTaskRepository

                    //...

                    fun Application.module() {
                        val repository = PostgresTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[288]||(n[288]=l("p",null," 由於您透過介面注入依賴項，因此實作中的切換對於管理路由的程式碼是透明的。 ",-1))]),_:1}),o(s,null,{default:e(()=>n[289]||(n[289]=[l("p",null,[t(" 在 IntelliJ IDEA 中，點擊重新執行按鈕 ("),l("img",{src:B,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新執行圖示"}),t(") 以重新啟動應用程式。 ")],-1)])),_:1}),o(s,null,{default:e(()=>n[290]||(n[290]=[t(" 導航至 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1),t("。 UI 保持不變，但它現在從資料庫中獲取資料。 ")])),_:1}),o(s,null,{default:e(()=>[n[296]||(n[296]=l("p",null," 為了驗證這一點，請使用表單新增一個新任務，並查詢 PostgreSQL 中任務表格中儲存的資料。 ",-1)),o(f,null,{default:e(()=>[n[294]||(n[294]=l("p",null,[t(" 在 IntelliJ IDEA 中，您可以使用 "),l("a",{href:"https://www.jetbrains.com/help/idea/query-consoles.html#create_console"},"查詢主控台 (Query Console)"),t(" 和 "),l("code",null,"SELECT"),t(" SQL 陳述式來查詢表格資料： ")],-1)),o(r,{lang:"SQL",code:"                            SELECT * FROM task;"}),l("p",null,[n[292]||(n[292]=t(" 查詢後，資料應顯示在 ")),o(x,null,{default:e(()=>n[291]||(n[291]=[t("服務")])),_:1}),n[293]||(n[293]=t(" 窗格中，包括新任務： "))]),n[295]||(n[295]=l("img",{src:N,alt:"IntelliJ IDEA 服務窗格中顯示的任務表格","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),n[305]||(n[305]=l("p",null," 至此，您已成功將資料庫整合到您的應用程式中。 ",-1)),l("p",null,[n[299]||(n[299]=t(" 由於 ")),n[300]||(n[300]=l("code",null,"FakeTaskRepository",-1)),n[301]||(n[301]=t(" 類型在生產程式碼中不再需要，您可以將其移至測試原始碼集，即 ")),o(i,null,{default:e(()=>n[298]||(n[298]=[t("src/test/com/example")])),_:1}),n[302]||(n[302]=t(" 。 "))]),n[306]||(n[306]=l("p",null," 最終的專案結構應如下所示： ",-1)),n[307]||(n[307]=l("img",{src:D,alt:"IntelliJ IDEA 專案視圖中顯示的 src 資料夾","border-effect":"line",width:"400"},null,-1))]),_:1}),o(u,{title:"下一步",id:"next-steps"},{default:e(()=>[n[313]||(n[313]=l("p",null,[t(" 您現在擁有一個與 Ktor RESTful 服務通信的應用程式。該服務又使用 "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t(" 編寫的儲存庫來存取 "),l("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL"),t("。您還擁有"),l("a",{href:"#add-automated-tests"},"一套測試"),t("，可以在不需要網路伺服器或資料庫的情況下驗證核心功能。 ")],-1)),l("p",null,[n[309]||(n[309]=t(" 此結構可以根據需要擴展以支援任意功能，但是，您可能需要首先考慮設計的非功能性方面，例如容錯、安全性與可擴展性。您可以從")),n[310]||(n[310]=l("a",{href:"./docker-compose#extract-db-settings"},"將資料庫設定提取",-1)),n[311]||(n[311]=t("到")),o(d,{href:"/ktor/server-configuration-file",summary:"瞭解如何在設定檔中配置各種伺服器參數。"},{default:e(()=>n[308]||(n[308]=[t("設定檔")])),_:1}),n[312]||(n[312]=t("開始。 "))])]),_:1})]),_:1})])}const _=O(q,[["render",F]]);export{Z as __pageData,_ as default};
