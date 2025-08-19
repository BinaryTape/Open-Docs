import{_ as P,a as A,b as R,c as N,d as I,e as D}from"./chunks/tutorial_server_db_integration_src_folder.CYo2B4hT.js";import{_ as C}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as T}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as L}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as g}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as j}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as B,C as u,c as O,o as K,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-integrate-database.md","filePath":"ktor/server-integrate-database.md","lastUpdated":1755457140000}'),q={name:"ktor/server-integrate-database.md"};function F(H,n,J,z,V,M){const y=u("show-structure"),d=u("Links"),b=u("tldr"),v=u("card-summary"),S=u("link-summary"),E=u("web-summary"),k=u("list"),a=u("chapter"),r=u("step"),m=u("control"),i=u("Path"),s=u("code-block"),p=u("procedure"),f=u("tip"),x=u("ui-path"),w=u("topic");return K(),O("div",null,[o(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"将数据库与 Kotlin、Ktor 和 Exposed 集成",id:"server-integrate-database"},{default:e(()=>[o(y,{for:"chapter",depth:"2"}),o(b,null,{default:e(()=>[n[15]||(n[15]=l("p",null,[l("b",null,"代码示例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"}," tutorial-server-db-integration ")],-1)),l("p",null,[n[5]||(n[5]=l("b",null,"使用的插件",-1)),n[6]||(n[6]=t(": ")),o(d,{href:"/ktor/server-routing",summary:"Routing 是一个核心插件，用于处理服务器应用程序中的传入请求。"},{default:e(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[7]||(n[7]=t(",")),o(d,{href:"/ktor/server-static-content",summary:"了解如何提供静态内容，例如样式表、脚本、图像等。"},{default:e(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[8]||(n[8]=t(", ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[9]||(n[9]=t(", ")),o(d,{href:"/ktor/server-status-pages",summary:"%plugin_name% 允许 Ktor 应用程序根据抛出的异常或状态码对任何失败状态做出适当响应。"},{default:e(()=>n[3]||(n[3]=[t("Status pages")])),_:1}),n[10]||(n[10]=t(", ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[4]||(n[4]=[t("kotlinx.serialization")])),_:1}),n[11]||(n[11]=t(", ")),n[12]||(n[12]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md"},"Exposed",-1)),n[13]||(n[13]=t(", ")),n[14]||(n[14]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md"},"Postgres",-1))])]),_:1}),o(v,null,{default:e(()=>n[16]||(n[16]=[t(" 学习使用 Exposed SQL Library 将 Ktor 服务连接到数据库版本库的过程。 ")])),_:1}),o(S,null,{default:e(()=>n[17]||(n[17]=[t(" 学习使用 Exposed SQL Library 将 Ktor 服务连接到数据库版本库的过程。 ")])),_:1}),o(E,null,{default:e(()=>n[18]||(n[18]=[t(" 了解如何使用 Kotlin 和 Ktor 构建一个单页应用程序 (SPA)，其中 RESTful 服务连接到 数据库版本库。它使用 Exposed SQL 库，并允许您为测试伪造版本库。 ")])),_:1}),n[314]||(n[314]=l("p",null,[t(" 在本文中，您将学习如何使用 Kotlin 的 SQL 库 "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t(" 将您的 Ktor 服务与关系数据库集成。 ")],-1)),n[315]||(n[315]=l("p",null,"通过本教程，您将学习如何执行以下操作：",-1)),o(k,null,{default:e(()=>n[19]||(n[19]=[l("li",null,"创建使用 JSON 序列化的 RESTful 服务。",-1),l("li",null,"将不同的版本库注入到这些服务中。",-1),l("li",null,"使用伪造版本库为您的服务创建单元测试。",-1),l("li",null,"使用 Exposed 和依赖项注入 (DI) 构建可用的版本库。",-1),l("li",null,"部署访问外部数据库的服务。",-1)])),_:1}),l("p",null,[n[23]||(n[23]=t(" 在之前的教程中，我们使用任务管理器示例涵盖了基础知识，例如 ")),o(d,{href:"/ktor/server-requests-and-responses",summary:"了解如何使用 Kotlin 和 Ktor 构建任务管理器应用程序，掌握路由、请求处理和参数的基础知识。"},{default:e(()=>n[20]||(n[20]=[t("处理请求")])),_:1}),n[24]||(n[24]=t("、 ")),o(d,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[21]||(n[21]=[t("创建 RESTful API")])),_:1}),n[25]||(n[25]=t(" 或 ")),o(d,{href:"/ktor/server-create-website",summary:"了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板构建网站。"},{default:e(()=>n[22]||(n[22]=[t("使用 Thymeleaf 模板构建 Web 应用")])),_:1}),n[26]||(n[26]=t("。 虽然这些教程侧重于使用简单的内存中 ")),n[27]||(n[27]=l("code",null,"TaskRepository",-1)),n[28]||(n[28]=t(" 的前端功能， 本指南将重点转移到展示您的 Ktor 服务如何通过 ")),n[29]||(n[29]=l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed SQL Library",-1)),n[30]||(n[30]=t(" 与关系数据库交互。 "))]),n[316]||(n[316]=l("p",null," 尽管本指南更长、更复杂，但您仍将快速产出可用代码并逐步 引入新特性。 ",-1)),n[317]||(n[317]=l("p",null,"本指南将分为两部分：",-1)),o(k,{type:"decimal"},{default:e(()=>n[31]||(n[31]=[l("li",null,[l("a",{href:"#create-restful-service-and-repository"},"使用内存中版本库创建您的应用程序。")],-1),l("li",null,[l("a",{href:"#add-postgresql-repository"},"将内存中版本库替换为使用 PostgreSQL 的版本库。")],-1)])),_:1}),o(a,{title:"先决条件",id:"prerequisites"},{default:e(()=>[l("p",null,[n[33]||(n[33]=t(" 您可以独立完成本教程，但是，我们建议您完成 ")),o(d,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[32]||(n[32]=[t("创建 RESTful API")])),_:1}),n[34]||(n[34]=t(" 教程以熟悉 Content Negotiation 和 REST。 "))]),n[35]||(n[35]=l("p",null,[t("我们建议您安装 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t("，但您也可以选择使用其他 IDE。 ")],-1))]),_:1}),o(a,{title:"创建 RESTful 服务和内存中版本库",id:"create-restful-service-and-repository"},{default:e(()=>[n[175]||(n[175]=l("p",null," 首先，您将重新创建任务管理器 RESTful 服务。最初，这将使用内存中 版本库，但您将构建一个设计，使其能够以最小的努力进行替换。 ",-1)),n[176]||(n[176]=l("p",null,"您将分六个阶段完成此操作：",-1)),o(k,{type:"decimal"},{default:e(()=>n[36]||(n[36]=[l("li",null,[l("a",{href:"#create-project"},"创建初始项目。")],-1),l("li",null,[l("a",{href:"#add-starter-code"},"添加起始代码。")],-1),l("li",null,[l("a",{href:"#add-routes"},"添加 CRUD 路由。")],-1),l("li",null,[l("a",{href:"#add-client-page"},"添加单页应用程序 (SPA)。")],-1),l("li",null,[l("a",{href:"#test-manually"},"手动测试应用程序。")],-1),l("li",null,[l("a",{href:"#add-automated-tests"},"添加自动化测试。")],-1)])),_:1}),o(a,{title:"使用插件创建新项目",id:"create-project"},{default:e(()=>[n[70]||(n[70]=l("p",null," 要使用 Ktor Project Generator 创建新项目，请按照以下步骤操作： ",-1)),o(p,{id:"create-project-procedure"},{default:e(()=>[o(r,null,{default:e(()=>n[37]||(n[37]=[l("p",null,[t(" 导航到 "),l("a",{href:"https://start.ktor.io/"},"Ktor Project Generator"),t(" 。 ")],-1)])),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[40]||(n[40]=t("在 ")),o(m,null,{default:e(()=>n[38]||(n[38]=[t("Project artifact")])),_:1}),n[41]||(n[41]=t(" 字段中，输入 ")),o(i,null,{default:e(()=>n[39]||(n[39]=[t("com.example.ktor-exposed-task-app")])),_:1}),n[42]||(n[42]=t(" 作为您的项目 artifact 名称。 ")),n[43]||(n[43]=l("img",{src:P,alt:"在 Ktor Project Generator 中命名项目 artifact","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[45]||(n[45]=t(" 在插件部分中，点击 ")),o(m,null,{default:e(()=>n[44]||(n[44]=[t("Add")])),_:1}),n[46]||(n[46]=t(" 按钮搜索并添加以下插件： "))]),o(k,{type:"bullet"},{default:e(()=>n[47]||(n[47]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1),l("li",null,"Status Pages",-1),l("li",null,"Exposed",-1),l("li",null,"Postgres",-1)])),_:1}),n[48]||(n[48]=l("p",null,[l("img",{src:C,alt:"在 Ktor Project Generator 中添加插件","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[50]||(n[50]=t(" 添加插件后，点击插件部分右上角的 ")),o(m,null,{default:e(()=>n[49]||(n[49]=[t("7 plugins")])),_:1}),n[51]||(n[51]=t(" 按钮以查看已添加的插件。 "))]),n[52]||(n[52]=l("p",null,[t("您将看到一个包含所有将添加到您的项目的插件的列表： "),l("img",{src:A,alt:"Ktor Project Generator 中的插件下拉列表","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[54]||(n[54]=t(" 点击 ")),o(m,null,{default:e(()=>n[53]||(n[53]=[t("Download")])),_:1}),n[55]||(n[55]=t(" 按钮以生成并下载您的 Ktor 项目。 "))])]),_:1}),o(r,null,{default:e(()=>n[56]||(n[56]=[l("p",null,[t(" 在 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t(" 或您选择的其他 IDE 中打开生成的项目。 ")],-1)])),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[60]||(n[60]=t(" 导航到 ")),o(i,null,{default:e(()=>n[57]||(n[57]=[t("src/main/kotlin/com/example")])),_:1}),n[61]||(n[61]=t(" 并删除文件 ")),o(i,null,{default:e(()=>n[58]||(n[58]=[t("CitySchema.kt")])),_:1}),n[62]||(n[62]=t(" 和 ")),o(i,null,{default:e(()=>n[59]||(n[59]=[t("UsersSchema.kt")])),_:1}),n[63]||(n[63]=t(" 。 "))])]),_:1}),o(r,{id:"delete-function"},{default:e(()=>[l("p",null,[n[65]||(n[65]=t(" 打开 ")),o(i,null,{default:e(()=>n[64]||(n[64]=[t("Databases.kt")])),_:1}),n[66]||(n[66]=t(" 文件并删除 ")),n[67]||(n[67]=l("code",null,"configureDatabases()",-1)),n[68]||(n[68]=t(" 函数的内容。 "))]),o(s,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                        }`}),n[69]||(n[69]=l("p",null," 删除此功能的原因是 Ktor Project Generator 添加了示例 代码来演示如何将用户和城市数据持久化到 HSQLDB 或 PostgreSQL。 在本教程中您将不需要该示例代码。 ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"添加起始代码",id:"add-starter-code"},{default:e(()=>[o(p,{id:"add-starter-code-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[n[73]||(n[73]=t(" 导航到 ")),o(i,null,{default:e(()=>n[71]||(n[71]=[t("src/main/kotlin/com/example")])),_:1}),n[74]||(n[74]=t(" 并创建一个名为 ")),o(i,null,{default:e(()=>n[72]||(n[72]=[t("model")])),_:1}),n[75]||(n[75]=t(" 的子包。 "))]),_:1}),o(r,null,{default:e(()=>[n[78]||(n[78]=t(" 在 ")),o(i,null,{default:e(()=>n[76]||(n[76]=[t("model")])),_:1}),n[79]||(n[79]=t(" 包内，创建一个新文件 ")),o(i,null,{default:e(()=>n[77]||(n[77]=[t("Task.kt")])),_:1}),n[80]||(n[80]=t(" 。 "))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[82]||(n[82]=t(" 打开 ")),o(i,null,{default:e(()=>n[81]||(n[81]=[t("Task.kt")])),_:1}),n[83]||(n[83]=t(" 并添加一个 ")),n[84]||(n[84]=l("code",null,"enum",-1)),n[85]||(n[85]=t(" 来表示优先级，以及一个 ")),n[86]||(n[86]=l("code",null,"class",-1)),n[87]||(n[87]=t(" 来表示 任务。 "))]),o(s,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),l("p",null,[n[89]||(n[89]=l("code",null,"Task",-1)),n[90]||(n[90]=t(" 类使用 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[88]||(n[88]=[t("kotlinx.serialization")])),_:1}),n[91]||(n[91]=t(" 库中的 ")),n[92]||(n[92]=l("code",null,"Serializable",-1)),n[93]||(n[93]=t(" 类型进行注解。 "))]),n[94]||(n[94]=l("p",null,[t(" 与之前的教程一样，您将创建一个内存中版本库。然而，这次 版本库将实现一个 "),l("code",null,"interface"),t("，以便您以后可以轻松替换它。 ")],-1))]),_:1}),o(r,null,{default:e(()=>[n[97]||(n[97]=t(" 在 ")),o(i,null,{default:e(()=>n[95]||(n[95]=[t("model")])),_:1}),n[98]||(n[98]=t(" 子包中，创建一个新文件 ")),o(i,null,{default:e(()=>n[96]||(n[96]=[t("TaskRepository.kt")])),_:1}),n[99]||(n[99]=t(" 。 "))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[101]||(n[101]=t(" 打开 ")),o(i,null,{default:e(()=>n[100]||(n[100]=[t("TaskRepository.kt")])),_:1}),n[102]||(n[102]=t(" 并添加以下 ")),n[103]||(n[103]=l("code",null,"interface",-1)),n[104]||(n[104]=t("： "))]),o(s,{lang:"kotlin",code:`                        package com.example.model

                        interface TaskRepository {
                            fun allTasks(): List<Task>
                            fun tasksByPriority(priority: Priority): List<Task>
                            fun taskByName(name: String): Task?
                            fun addTask(task: Task)
                            fun removeTask(name: String): Boolean
                        }`})]),_:1}),o(r,null,{default:e(()=>[n[106]||(n[106]=t(" 在同一目录中创建一个新文件 ")),o(i,null,{default:e(()=>n[105]||(n[105]=[t("FakeTaskRepository.kt")])),_:1}),n[107]||(n[107]=t(" 。 "))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[109]||(n[109]=t(" 打开 ")),o(i,null,{default:e(()=>n[108]||(n[108]=[t("FakeTaskRepository.kt")])),_:1}),n[110]||(n[110]=t(" 并添加以下 ")),n[111]||(n[111]=l("code",null,"class",-1)),n[112]||(n[112]=t("： "))]),o(s,{lang:"kotlin",code:`                        package com.example.model

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
                        }`})]),_:1})]),_:1})]),_:1}),o(a,{title:"添加路由",id:"add-routes"},{default:e(()=>[o(p,{id:"add-routes-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[n[115]||(n[115]=t(" 打开 ")),o(i,null,{default:e(()=>n[113]||(n[113]=[t("src/main/kotlin/com/example")])),_:1}),n[116]||(n[116]=t(" 中的 ")),o(i,null,{default:e(()=>n[114]||(n[114]=[t("Serialization.kt")])),_:1}),n[117]||(n[117]=t(" 文件。 "))]),_:1}),o(r,null,{default:e(()=>[n[125]||(n[125]=l("p",null,[t(" 将现有的 "),l("code",null,"Application.configureSerialization()"),t(" 函数替换为以下 实现： ")],-1)),o(s,{lang:"kotlin",code:`package com.example

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
}`}),l("p",null,[n[119]||(n[119]=t(" 这是您在 ")),o(d,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[118]||(n[118]=[t("创建 RESTful API")])),_:1}),n[120]||(n[120]=t(" 教程中实现的相同路由，不同之处在于您现在将版本库作为 参数传递给 ")),n[121]||(n[121]=l("code",null,"routing()",-1)),n[122]||(n[122]=t(" 函数。因为参数的类型是一个 ")),n[123]||(n[123]=l("code",null,"interface",-1)),n[124]||(n[124]=t("， 所以可以注入许多不同的实现。 "))]),n[126]||(n[126]=l("p",null,[t(" 现在您已向 "),l("code",null,"configureSerialization()"),t(" 添加了一个参数，现有的调用 将不再编译。幸运的是，此函数只被调用一次。 ")],-1))]),_:1}),o(r,null,{default:e(()=>[n[129]||(n[129]=t(" 打开 ")),o(i,null,{default:e(()=>n[127]||(n[127]=[t("src/main/kotlin/com/example")])),_:1}),n[130]||(n[130]=t(" 中的 ")),o(i,null,{default:e(()=>n[128]||(n[128]=[t("Application.kt")])),_:1}),n[131]||(n[131]=t(" 文件。 "))]),_:1}),o(r,null,{default:e(()=>[n[132]||(n[132]=l("p",null,[t(" 将 "),l("code",null,"module()"),t(" 函数替换为以下实现： ")],-1)),o(s,{lang:"kotlin",code:`                    import com.example.model.FakeTaskRepository
                    //...

                    fun Application.module() {
                        val repository = FakeTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[133]||(n[133]=l("p",null,[t(" 您现在将 "),l("code",null,"FakeTaskRepository"),t(" 的一个实例注入到 "),l("code",null,"configureSerialization()"),t(" 中。 长期目标是能够将其替换为 "),l("code",null,"PostgresTaskRepository"),t("。 ")],-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"添加客户端页面",id:"add-client-page"},{default:e(()=>[o(p,{id:"add-client-page-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[n[136]||(n[136]=t(" 打开 ")),o(i,null,{default:e(()=>n[134]||(n[134]=[t("src/main/resources/static")])),_:1}),n[137]||(n[137]=t(" 中的 ")),o(i,null,{default:e(()=>n[135]||(n[135]=[t("index.html")])),_:1}),n[138]||(n[138]=t(" 文件。 "))]),_:1}),o(r,null,{default:e(()=>[n[139]||(n[139]=l("p",null," 将当前内容替换为以下实现： ",-1)),o(s,{lang:"html",code:`<html>
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
<h1>Task Manager Client</h1>
<form action="javascript:displayAllTasks()">
    <span>View all the tasks</span>
    <input type="submit" value="Go">
</form>
<form name="priorityForm" action="javascript:displayTasksWithPriority()">
    <span>View tasks with priority</span>
    <select name="priority">
        <option name="Low">Low</option>
        <option name="Medium">Medium</option>
        <option name="High">High</option>
        <option name="Vital">Vital</option>
    </select>
    <input type="submit" value="Go">
</form>
<form name="addTaskForm" action="javascript:addNewTask()">
    <span>Create new task with</span>
    <label for="newTaskName">name</label>
    <input type="text" id="newTaskName" name="newTaskName" size="10">
    <label for="newTaskDescription">description</label>
    <input type="text" id="newTaskDescription" name="newTaskDescription" size="20">
    <label for="newTaskPriority">priority</label>
    <select id="newTaskPriority" name="newTaskPriority">
        <option name="Low">Low</option>
        <option name="Medium">Medium</option>
        <option name="High">High</option>
        <option name="Vital">Vital</option>
    </select>
    <input type="submit" value="Go">
</form>
<hr>
<div>
    Current task is <em id="currentTaskDisplay">None</em>
</div>
<hr>
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Priority</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[140]||(n[140]=l("p",null," 这是之前教程中使用的同一个 SPA。由于它是用 JavaScript 编写的， 并且只使用浏览器中可用的库，您无需担心客户端 依赖项。 ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"手动测试应用程序",id:"test-manually"},{default:e(()=>[o(p,{id:"test-manually-procedure"},{default:e(()=>[n[156]||(n[156]=l("p",null," 由于第一次迭代使用的是内存中版本库而不是连接到数据库， 您需要确保应用程序已正确配置。 ",-1)),o(r,null,{default:e(()=>[l("p",null,[n[142]||(n[142]=t(" 导航到 ")),o(i,null,{default:e(()=>n[141]||(n[141]=[t("src/main/resources/application.yaml")])),_:1}),n[143]||(n[143]=t(" 并删除 ")),n[144]||(n[144]=l("code",null,"postgres",-1)),n[145]||(n[145]=t(" 配置。 "))]),o(s,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module
    deployment:
        port: 8080`})]),_:1}),o(r,null,{default:e(()=>n[146]||(n[146]=[l("p",null,[t("在 IntelliJ IDEA 中，点击运行按钮 ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"intelliJ IDEA 运行图标"}),t(") 启动应用程序。")],-1)])),_:1}),o(r,null,{default:e(()=>n[147]||(n[147]=[l("p",null,[t(" 在浏览器中导航到 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t(" 。您应该会看到客户端页面，其中包含三个表单和一个显示 过滤结果的表格。 ")],-1),l("img",{src:R,alt:"显示任务管理器客户端的浏览器窗口","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[151]||(n[151]=t(" 通过填写并使用 ")),o(m,null,{default:e(()=>n[148]||(n[148]=[t("Go")])),_:1}),n[152]||(n[152]=t(" 按钮发送表单来测试应用程序。 使用表格项上的 ")),o(m,null,{default:e(()=>n[149]||(n[149]=[t("View")])),_:1}),n[153]||(n[153]=t(" 和 ")),o(m,null,{default:e(()=>n[150]||(n[150]=[t("Delete")])),_:1}),n[154]||(n[154]=t(" 按钮。 "))]),n[155]||(n[155]=l("img",{src:L,alt:"显示任务管理器客户端的浏览器窗口","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"添加自动化单元测试",id:"add-automated-tests"},{default:e(()=>[o(p,{id:"add-automated-tests-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[l("p",null,[n[159]||(n[159]=t(" 打开 ")),o(i,null,{default:e(()=>n[157]||(n[157]=[t("src/test/kotlin/com/example")])),_:1}),n[160]||(n[160]=t(" 中的 ")),o(i,null,{default:e(()=>n[158]||(n[158]=[t("ApplicationTest.kt")])),_:1}),n[161]||(n[161]=t(" ，并添加以下测试： "))]),o(s,{lang:"kotlin",code:`package com.example

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
}`}),n[162]||(n[162]=l("p",null,[t(" 为了使这些测试能够编译和运行，您需要在 Ktor Client 的 "),l("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html"},"Content Negotiation"),t(" 插件上添加依赖项。 ")],-1))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[164]||(n[164]=t(" 打开 ")),o(i,null,{default:e(()=>n[163]||(n[163]=[t("gradle/libs.versions.toml")])),_:1}),n[165]||(n[165]=t(" 文件并指定以下库： "))]),o(s,{lang:"kotlin",code:`                        [libraries]
                        #...
                        ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[167]||(n[167]=t(" 打开 ")),o(i,null,{default:e(()=>n[166]||(n[166]=[t("build.gradle.kts")])),_:1}),n[168]||(n[168]=t(" 并添加以下依赖项： "))]),o(s,{lang:"kotlin",code:`                        dependencies {
                            //...
                            testImplementation(libs.ktor.client.content.negotiation)
                        }`})]),_:1}),o(r,null,{default:e(()=>n[169]||(n[169]=[l("p",null,[t("在 IntelliJ IDEA 中，点击编辑器右侧的 Gradle 通知图标 ("),l("img",{alt:"intelliJ IDEA gradle 图标",src:g,width:"16",height:"26"}),t(") 以加载 Gradle 更改。")],-1)])),_:1}),o(r,null,{default:e(()=>[n[173]||(n[173]=l("p",null,[t("在 IntelliJ IDEA 中，点击测试类定义旁边的运行按钮 ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"intelliJ IDEA 运行图标"}),t(") 以运行测试。")],-1)),l("p",null,[n[171]||(n[171]=t("您应该会看到测试在 ")),o(m,null,{default:e(()=>n[170]||(n[170]=[t("Run")])),_:1}),n[172]||(n[172]=t(" 窗格中成功运行。 "))]),n[174]||(n[174]=l("img",{src:N,alt:"IntelliJ IDEA 的 Run 窗格中显示测试结果成功","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(a,{title:"添加 PostgreSQL 版本库",id:"add-postgresql-repository"},{default:e(()=>[n[303]||(n[303]=l("p",null," 现在您有了一个使用内存中数据的可用应用程序，下一步是将数据 存储外部化到 PostgreSQL 数据库。 ",-1)),n[304]||(n[304]=l("p",null," 您将通过以下方式实现此目标： ",-1)),o(k,{type:"decimal"},{default:e(()=>n[177]||(n[177]=[l("li",null,[l("a",{href:"#create-schema"},"在 PostgreSQL 中创建数据库 schema。")],-1),l("li",null,[l("a",{href:"#adapt-repo"},[t("调整 "),l("code",null,"TaskRepository"),t(" 以进行异步访问。")])],-1),l("li",null,[l("a",{href:"#config-db-connection"},"在应用程序中配置数据库连接。")],-1),l("li",null,[l("a",{href:"#create-mapping"},[t("将 "),l("code",null,"Task"),t(" 类型映射到关联的数据库表。")])],-1),l("li",null,[l("a",{href:"#create-new-repo"},"基于此映射创建一个新的版本库。")],-1),l("li",null,[l("a",{href:"#switch-repo"},"在启动代码中切换到这个新版本库。")],-1)])),_:1}),o(a,{title:"创建数据库 schema",id:"create-schema"},{default:e(()=>[o(p,{id:"create-schema-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[l("p",null,[n[179]||(n[179]=t(" 使用您选择的数据库管理工具，在 PostgreSQL 中创建一个新数据库。 名称无关紧要，只要您记住它即可。在此示例中，我们将使用 ")),o(i,null,{default:e(()=>n[178]||(n[178]=[t("ktor_tutorial_db")])),_:1}),n[180]||(n[180]=t(" 。 "))]),o(f,null,{default:e(()=>n[181]||(n[181]=[l("p",null,[t(" 有关 PostgreSQL 的更多信息，请参阅"),l("a",{href:"https://www.postgresql.org/docs/current/"},"官方 文档"),t("。 ")],-1),l("p",null,[t(" 在 IntelliJ IDEA 中，您可以使用数据库工具"),l("a",{href:"https://www.jetbrains.com/help/idea/postgresql.html"},"连接和管理您的 PostgreSQL 数据库。")],-1)])),_:1})]),_:1}),o(r,null,{default:e(()=>[n[199]||(n[199]=l("p",null," 对您的数据库运行以下 SQL 命令。这些命令将创建并填充 数据库 schema： ",-1)),o(s,{lang:"sql",code:`                        DROP TABLE IF EXISTS task;
                        CREATE TABLE task(id SERIAL PRIMARY KEY, name VARCHAR(50), description VARCHAR(50), priority VARCHAR(50));

                        INSERT INTO task (name, description, priority) VALUES ('cleaning', 'Clean the house', 'Low');
                        INSERT INTO task (name, description, priority) VALUES ('gardening', 'Mow the lawn', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('shopping', 'Buy the groceries', 'High');
                        INSERT INTO task (name, description, priority) VALUES ('painting', 'Paint the fence', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('exercising', 'Walk the dog', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('meditating', 'Contemplate the infinite', 'High');`}),n[200]||(n[200]=l("p",null," 请注意以下几点： ",-1)),o(k,null,{default:e(()=>[l("li",null,[n[186]||(n[186]=t(" 您正在创建一个名为 ")),o(i,null,{default:e(()=>n[182]||(n[182]=[t("task")])),_:1}),n[187]||(n[187]=t(" 的单表，其中包含 ")),o(i,null,{default:e(()=>n[183]||(n[183]=[t("name")])),_:1}),n[188]||(n[188]=t(" 、 ")),o(i,null,{default:e(()=>n[184]||(n[184]=[t("description")])),_:1}),n[189]||(n[189]=t(" 和 ")),o(i,null,{default:e(()=>n[185]||(n[185]=[t("priority")])),_:1}),n[190]||(n[190]=t(" 列。这些列需要映射到 ")),n[191]||(n[191]=l("code",null,"Task",-1)),n[192]||(n[192]=t(" 类的属性。 "))]),n[198]||(n[198]=l("li",null," 如果表已存在，您将重新创建它，因此您可以重复运行脚本。 ",-1)),l("li",null,[n[194]||(n[194]=t(" 还有一个名为 ")),o(i,null,{default:e(()=>n[193]||(n[193]=[t("id")])),_:1}),n[195]||(n[195]=t(" 的额外列，其类型为 ")),n[196]||(n[196]=l("code",null,"SERIAL",-1)),n[197]||(n[197]=t("。这将是一个整数值， 用于为每行提供其主键。这些值将由数据库为您分配。 "))])]),_:1})]),_:1})]),_:1})]),_:1}),o(a,{title:"调整现有版本库",id:"adapt-repo"},{default:e(()=>[o(p,{id:"adapt-repo-procedure"},{default:e(()=>[n[215]||(n[215]=l("p",null,[t(" 当对数据库执行查询时，最好让它们异步运行，以避免 阻塞处理 HTTP 请求的线程。在 Kotlin 中，这最好通过"),l("a",{href:"https://kotlinlang.org/docs/coroutines-overview.html"},"协程"),t("来管理。 ")],-1)),o(r,null,{default:e(()=>[l("p",null,[n[203]||(n[203]=t(" 打开 ")),o(i,null,{default:e(()=>n[201]||(n[201]=[t("src/main/kotlin/com/example/model")])),_:1}),n[204]||(n[204]=t(" 中的 ")),o(i,null,{default:e(()=>n[202]||(n[202]=[t("TaskRepository.kt")])),_:1}),n[205]||(n[205]=t(" 文件。 "))])]),_:1}),o(r,null,{default:e(()=>[n[206]||(n[206]=l("p",null,[t(" 向所有接口方法添加 "),l("code",null,"suspend"),t(" 关键字： ")],-1)),o(s,{lang:"kotlin",code:`                    interface TaskRepository {
                        suspend fun allTasks(): List<Task>
                        suspend fun tasksByPriority(priority: Priority): List<Task>
                        suspend fun taskByName(name: String): Task?
                        suspend fun addTask(task: Task)
                        suspend fun removeTask(name: String): Boolean
                    }`}),n[207]||(n[207]=l("p",null," 这将允许接口方法的实现者在不同的 Coroutine Dispatcher 上启动作业。 ",-1)),n[208]||(n[208]=l("p",null,[t(" 您现在需要调整 "),l("code",null,"FakeTaskRepository"),t(" 的方法以 匹配，尽管在该实现中您不需要切换 Dispatcher。 ")],-1))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[210]||(n[210]=t(" 打开 ")),o(i,null,{default:e(()=>n[209]||(n[209]=[t("FakeTaskRepository.kt")])),_:1}),n[211]||(n[211]=t(" 文件并向所有方法添加 ")),n[212]||(n[212]=l("code",null,"suspend",-1)),n[213]||(n[213]=t(" 关键字： "))]),o(s,{lang:"kotlin",code:`                    class FakeTaskRepository : TaskRepository {
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
                    }`}),n[214]||(n[214]=l("p",null,[t(" 到目前为止，您没有引入任何新功能。相反，您已经为创建 "),l("code",null,"PostgresTaskRepository"),t(" 奠定了基础， 它将异步运行数据库查询。 ")],-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"配置数据库连接",id:"config-db-connection"},{default:e(()=>[o(p,{id:"config-db-connection-procedure"},{default:e(()=>[l("p",null,[n[217]||(n[217]=t(" 在")),n[218]||(n[218]=l("a",{href:"#delete-function"},"本教程的第一部分",-1)),n[219]||(n[219]=t("中，您删除了 ")),o(i,null,{default:e(()=>n[216]||(n[216]=[t("Databases.kt")])),_:1}),n[220]||(n[220]=t(" 文件中 ")),n[221]||(n[221]=l("code",null,"configureDatabases()",-1)),n[222]||(n[222]=t(" 方法中的示例代码。您现在可以添加自己的实现。 "))]),o(r,null,{default:e(()=>[n[225]||(n[225]=t(" 打开 ")),o(i,null,{default:e(()=>n[223]||(n[223]=[t("src/main/kotlin/com/example")])),_:1}),n[226]||(n[226]=t(" 中的 ")),o(i,null,{default:e(()=>n[224]||(n[224]=[t("Databases.kt")])),_:1}),n[227]||(n[227]=t(" 文件。 "))]),_:1}),o(r,null,{default:e(()=>[n[230]||(n[230]=l("p",null,[t(" 使用 "),l("code",null,"Database.connect()"),t(" 函数连接到您的数据库，调整 设置的值以匹配您的环境： ")],-1)),o(s,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                            Database.connect(
                                "jdbc:postgresql://localhost:5432/ktor_tutorial_db",
                                user = "postgres",
                                password = "password"
                            )
                        }`}),n[231]||(n[231]=l("p",null,[t("请注意，"),l("code",null,"url"),t(" 包含以下组件：")],-1)),o(k,null,{default:e(()=>n[228]||(n[228]=[l("li",null,[l("code",null,"localhost:5432"),t(" 是 PostgreSQL 数据库运行的主机和端口。 ")],-1),l("li",null,[l("code",null,"ktor_tutorial_db"),t(" 是运行服务时创建的数据库的名称。 ")],-1)])),_:1}),o(f,null,{default:e(()=>n[229]||(n[229]=[t(" 有关更多信息，请参阅 "),l("a",{href:"https://jetbrains.github.io/Exposed/database-and-datasource.html"}," 在 Exposed 中使用 Database 和 DataSource",-1),t("。 ")])),_:1})]),_:1})]),_:1})]),_:1}),o(a,{title:"创建对象/关系映射",id:"create-mapping"},{default:e(()=>[o(p,{id:"create-mapping-procedure"},{default:e(()=>[o(r,null,{default:e(()=>[n[234]||(n[234]=t(" 导航到 ")),o(i,null,{default:e(()=>n[232]||(n[232]=[t("src/main/kotlin/com/example")])),_:1}),n[235]||(n[235]=t(" 并创建一个名为 ")),o(i,null,{default:e(()=>n[233]||(n[233]=[t("db")])),_:1}),n[236]||(n[236]=t(" 的新包。 "))]),_:1}),o(r,null,{default:e(()=>[n[239]||(n[239]=t(" 在 ")),o(i,null,{default:e(()=>n[237]||(n[237]=[t("db")])),_:1}),n[240]||(n[240]=t(" 包内，创建一个新文件 ")),o(i,null,{default:e(()=>n[238]||(n[238]=[t("mapping.kt")])),_:1}),n[241]||(n[241]=t(" 。 "))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[243]||(n[243]=t(" 打开 ")),o(i,null,{default:e(()=>n[242]||(n[242]=[t("mapping.kt")])),_:1}),n[244]||(n[244]=t(" 并添加 ")),n[245]||(n[245]=l("code",null,"TaskTable",-1)),n[246]||(n[246]=t(" 和 ")),n[247]||(n[247]=l("code",null,"TaskDAO",-1)),n[248]||(n[248]=t(" 类型： "))]),o(s,{lang:"kotlin",code:`package com.example.db

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
}`}),l("p",null,[n[250]||(n[250]=t(" 这些类型使用 Exposed 库将 ")),n[251]||(n[251]=l("code",null,"Task",-1)),n[252]||(n[252]=t(" 类型中的属性映射到 数据库中 ")),o(i,null,{default:e(()=>n[249]||(n[249]=[t("task")])),_:1}),n[253]||(n[253]=t(" 表的列。")),n[254]||(n[254]=l("code",null,"TaskTable",-1)),n[255]||(n[255]=t(" 类型定义了基本映射，而 ")),n[256]||(n[256]=l("code",null,"TaskDAO",-1)),n[257]||(n[257]=t(" 类型添加了创建、查找、更新和删除任务的辅助方法。 "))]),n[258]||(n[258]=l("p",null," Ktor Project Generator 尚未添加对 DAO 类型的支持，因此您需要 在 Gradle 构建文件中添加相关依赖项。 ",-1))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[260]||(n[260]=t(" 打开 ")),o(i,null,{default:e(()=>n[259]||(n[259]=[t("gradle/libs.versions.toml")])),_:1}),n[261]||(n[261]=t(" 文件并指定以下库： "))]),o(s,{lang:"kotlin",code:`                       [libraries]
                       #...
                       exposed-dao = { module = "org.jetbrains.exposed:exposed-dao", version.ref = "exposed-version" }`})]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[263]||(n[263]=t(" 打开 ")),o(i,null,{default:e(()=>n[262]||(n[262]=[t("build.gradle.kts")])),_:1}),n[264]||(n[264]=t(" 文件并添加以下依赖项： "))]),o(s,{lang:"kotlin",code:`                        dependencies {
                            //...
                            implementation(libs.exposed.dao)
                        }`})]),_:1}),o(r,null,{default:e(()=>n[265]||(n[265]=[l("p",null,[t("在 IntelliJ IDEA 中，点击编辑器右侧的 Gradle 通知图标 ("),l("img",{alt:"intelliJ IDEA gradle 图标",src:g,width:"16",height:"26"}),t(") 以加载 Gradle 更改。")],-1)])),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[267]||(n[267]=t(" 导航回 ")),o(i,null,{default:e(()=>n[266]||(n[266]=[t("mapping.kt")])),_:1}),n[268]||(n[268]=t(" 文件并添加以下两个辅助函数： "))]),o(s,{lang:"kotlin",code:`suspend fun <T> suspendTransaction(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao: TaskDAO) = Task(
    dao.name,
    dao.description,
    Priority.valueOf(dao.priority)
)`}),n[269]||(n[269]=l("p",null,[l("code",null,"suspendTransaction()"),t(" 接受一段代码块，并通过 IO Dispatcher 在数据库 事务中运行它。这旨在将阻塞的作业卸载到线程池中。 ")],-1)),n[270]||(n[270]=l("p",null,[l("code",null,"daoToModel()"),t(" 将 "),l("code",null,"TaskDAO"),t(" 类型的一个实例转换为 "),l("code",null,"Task"),t(" 对象。 ")],-1))]),_:1}),o(r,null,{default:e(()=>[n[271]||(n[271]=l("p",null," 添加以下缺失的 import： ",-1)),o(s,{lang:"kotlin",code:`import com.example.model.Priority
import com.example.model.Task
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction`})]),_:1})]),_:1})]),_:1}),o(a,{title:"编写新版本库",id:"create-new-repo"},{default:e(()=>[o(p,{id:"create-new-repo-procedure"},{default:e(()=>[n[281]||(n[281]=l("p",null,"您现在拥有创建数据库特定版本库所需的所有资源。",-1)),o(r,null,{default:e(()=>[n[274]||(n[274]=t(" 导航到 ")),o(i,null,{default:e(()=>n[272]||(n[272]=[t("src/main/kotlin/com/example/model")])),_:1}),n[275]||(n[275]=t(" 并创建一个新文件 ")),o(i,null,{default:e(()=>n[273]||(n[273]=[t("PostgresTaskRepository.kt")])),_:1}),n[276]||(n[276]=t(" 。 "))]),_:1}),o(r,null,{default:e(()=>[l("p",null,[n[278]||(n[278]=t(" 打开 ")),o(i,null,{default:e(()=>n[277]||(n[277]=[t("PostgresTaskRepository.kt")])),_:1}),n[279]||(n[279]=t(" 文件并使用以下实现创建一个新类型： "))]),o(s,{lang:"kotlin",code:`package com.example.model

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
}`}),n[280]||(n[280]=l("p",null,[t(" 在此实现中，您使用 "),l("code",null,"TaskDAO"),t(" 和 "),l("code",null,"TaskTable"),t(" 类型的辅助方法与 数据库交互。创建此新版本库后，唯一剩下的任务是在您的路由中切换到使用它。 ")],-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"切换到新版本库",id:"switch-repo"},{default:e(()=>[o(p,{id:"switch-repo-procedure"},{default:e(()=>[n[297]||(n[297]=l("p",null,"要切换到外部数据库，您只需更改版本库类型。",-1)),o(r,null,{default:e(()=>[n[284]||(n[284]=t(" 打开 ")),o(i,null,{default:e(()=>n[282]||(n[282]=[t("src/main/kotlin/com/example")])),_:1}),n[285]||(n[285]=t(" 中的 ")),o(i,null,{default:e(()=>n[283]||(n[283]=[t("Application.kt")])),_:1}),n[286]||(n[286]=t(" 文件。 "))]),_:1}),o(r,null,{default:e(()=>[n[287]||(n[287]=l("p",null,[t(" 在 "),l("code",null,"Application.module()"),t(" 函数中，将 "),l("code",null,"FakeTaskRepository"),t(" 替换为 "),l("code",null,"PostgresTaskRepository"),t("： ")],-1)),o(s,{lang:"kotlin",code:`                    //...
                    import com.example.model.PostgresTaskRepository

                    //...

                    fun Application.module() {
                        val repository = PostgresTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[288]||(n[288]=l("p",null," 因为您通过接口注入依赖项，所以实现的切换对于管理路由的代码来说是透明的。 ",-1))]),_:1}),o(r,null,{default:e(()=>n[289]||(n[289]=[l("p",null,[t(" 在 IntelliJ IDEA 中，点击重新运行按钮 ("),l("img",{src:j,style:{},height:"16",width:"16",alt:"intelliJ IDEA 重新运行图标"}),t(") 以重新启动应用程序。 ")],-1)])),_:1}),o(r,null,{default:e(()=>n[290]||(n[290]=[t(" 导航到 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1),t("。 UI 保持不变，但现在它从数据库中获取数据。 ")])),_:1}),o(r,null,{default:e(()=>[n[296]||(n[296]=l("p",null," 要验证这一点，请使用表单添加新任务，并查询 PostgreSQL 中 tasks 表中保存的数据。 ",-1)),o(f,null,{default:e(()=>[n[294]||(n[294]=l("p",null,[t(" 在 IntelliJ IDEA 中，您可以使用"),l("a",{href:"https://www.jetbrains.com/help/idea/query-consoles.html#create_console"},"查询 控制台"),t("和 "),l("code",null,"SELECT"),t(" SQL 语句来查询表数据： ")],-1)),o(s,{lang:"SQL",code:"                            SELECT * FROM task;"}),l("p",null,[n[292]||(n[292]=t(" 查询后，数据应显示在 ")),o(x,null,{default:e(()=>n[291]||(n[291]=[t("Service")])),_:1}),n[293]||(n[293]=t(" 窗格中，包括新任务： "))]),n[295]||(n[295]=l("img",{src:I,alt:"IntelliJ IDEA 的 Service 窗格中显示的任务表","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),n[305]||(n[305]=l("p",null," 至此，您已成功将数据库集成到您的应用程序中。 ",-1)),l("p",null,[n[299]||(n[299]=t(" 由于生产代码中不再需要 ")),n[300]||(n[300]=l("code",null,"FakeTaskRepository",-1)),n[301]||(n[301]=t(" 类型，您可以将其移至测试 源代码集，即 ")),o(i,null,{default:e(()=>n[298]||(n[298]=[t("src/test/com/example")])),_:1}),n[302]||(n[302]=t(" 。 "))]),n[306]||(n[306]=l("p",null," 最终项目结构应如下所示： ",-1)),n[307]||(n[307]=l("img",{src:D,alt:"IntelliJ IDEA 的 Project View 中显示的 src 文件夹","border-effect":"line",width:"400"},null,-1))]),_:1}),o(a,{title:"下一步",id:"next-steps"},{default:e(()=>[n[313]||(n[313]=l("p",null,[t(" 您现在有了一个与 Ktor RESTful 服务通信的应用程序。该服务又使用 "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t(" 编写的 版本库来访问 "),l("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL"),t("。您还拥有"),l("a",{href:"#add-automated-tests"},"一套测试"),t("， 可以验证核心功能，而无需 Web 服务器或数据库。 ")],-1)),l("p",null,[n[309]||(n[309]=t(" 此结构可以根据需要扩展以支持任意功能，但是，您 可能首先需要考虑设计的非功能性方面，例如容错性、安全性以及 可伸缩性。您可以从")),n[310]||(n[310]=l("a",{href:"./docker-compose#extract-db-settings"},"将数据库设置提取",-1)),n[311]||(n[311]=t("到")),o(d,{href:"/ktor/server-configuration-file",summary:"了解如何在配置文件中配置各种服务器参数。"},{default:e(()=>n[308]||(n[308]=[t("配置文件")])),_:1}),n[312]||(n[312]=t("开始。 "))])]),_:1})]),_:1})])}const h=B(q,[["render",F]]);export{Z as __pageData,h as default};
