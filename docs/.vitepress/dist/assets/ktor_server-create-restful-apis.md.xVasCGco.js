import{_ as C,a as N,b as w,c as R,d as J,e as I,f as H,g as j,h as q}from"./chunks/tutorial_creating_restful_apis_delete_task.BtAbUZys.js";import{_ as K}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as g}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as y}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as D,C as u,c as O,o as B,G as o,w as i,j as l,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-create-restful-apis.md","filePath":"ktor/server-create-restful-apis.md","lastUpdated":1755457140000}'),L={name:"ktor/server-create-restful-apis.md"};function M(z,t,G,$,U,V){const T=u("show-structure"),d=u("Links"),v=u("tldr"),S=u("card-summary"),P=u("web-summary"),E=u("link-summary"),f=u("list"),a=u("chapter"),e=u("step"),m=u("control"),s=u("Path"),p=u("procedure"),r=u("code-block"),b=u("format"),k=u("ui-path"),x=u("note"),A=u("topic");return B(),O("div",null,[o(A,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"如何在 Kotlin 中使用 Ktor 创建 RESTful API",id:"server-create-restful-apis","help-id":"create-restful-apis"},{default:i(()=>[o(T,{for:"chapter",depth:"2"}),o(v,null,{default:i(()=>[t[9]||(t[9]=l("p",null,[l("b",null,"代码示例"),n(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-restful-api"}," tutorial-server-restful-api ")],-1)),l("p",null,[t[3]||(t[3]=l("b",null,"使用的插件",-1)),t[4]||(t[4]=n(": ")),o(d,{href:"/ktor/server-routing",summary:"路由是服务器应用程序中用于处理传入请求的核心插件。"},{default:i(()=>t[0]||(t[0]=[n("Routing")])),_:1}),t[5]||(t[5]=n(",")),o(d,{href:"/ktor/server-static-content",summary:"了解如何提供静态内容，例如样式表、脚本、图像等。"},{default:i(()=>t[1]||(t[1]=[n("Static Content")])),_:1}),t[6]||(t[6]=n(", ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:i(()=>t[2]||(t[2]=[n("Content Negotiation")])),_:1}),t[7]||(t[7]=n(", ")),t[8]||(t[8]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(S,null,{default:i(()=>t[10]||(t[10]=[n(" 了解如何使用 Ktor 构建 RESTful API。本教程涵盖了真实示例的设置、路由和测试。 ")])),_:1}),o(P,null,{default:i(()=>t[11]||(t[11]=[n(" 学习使用 Ktor 构建 Kotlin RESTful API。本教程涵盖了真实示例的设置、路由和测试。它是 Kotlin 后端开发者的理想入门教程。 ")])),_:1}),o(E,null,{default:i(()=>t[12]||(t[12]=[n(" 了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。 ")])),_:1}),t[230]||(t[230]=l("p",null," 在本教程中，我们将解释如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。 ",-1)),l("p",null,[t[14]||(t[14]=n(" 在")),o(d,{href:"/ktor/server-requests-and-responses",summary:"了解如何使用 Ktor 在 Kotlin 中构建任务管理器应用程序，学习路由、处理请求和参数的基础知识。"},{default:i(()=>t[13]||(t[13]=[n("之前的教程")])),_:1}),t[15]||(t[15]=n("中，我们向你介绍了验证、错误处理和单元测试的基础知识。本教程将通过创建一个用于管理任务的 RESTful 服务来扩展这些主题。 "))]),t[231]||(t[231]=l("p",null," 你将学习如何执行以下操作： ",-1)),o(f,null,{default:i(()=>[t[19]||(t[19]=l("li",null,"创建使用 JSON 序列化的 RESTful 服务。",-1)),l("li",null,[t[17]||(t[17]=n("理解 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:i(()=>t[16]||(t[16]=[n("内容协商")])),_:1}),t[18]||(t[18]=n(" 的过程。"))]),t[20]||(t[20]=l("li",null,"在 Ktor 中定义 REST API 的路由。",-1))]),_:1}),o(a,{title:"先决条件",id:"prerequisites"},{default:i(()=>[l("p",null,[t[22]||(t[22]=n("你可以独立完成本教程， 但是，我们强烈建议你完成之前的教程，了解如何")),o(d,{href:"/ktor/server-requests-and-responses",summary:"了解如何使用 Ktor 在 Kotlin 中构建任务管理器应用程序，学习路由、处理请求和参数的基础知识。"},{default:i(()=>t[21]||(t[21]=[n("处理请求和生成响应")])),_:1}),t[23]||(t[23]=n(" 。 "))]),t[24]||(t[24]=l("p",null,[n("我们建议你安装 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),n("，但你也可以使用你选择的其他 IDE。 ")],-1))]),_:1}),o(a,{title:"Hello RESTful 任务管理器",id:"hello-restful-task-manager"},{default:i(()=>[l("p",null,[t[26]||(t[26]=n("在本教程中，你将把现有的任务管理器重写为 RESTful 服务。为此，你将使用多个 Ktor ")),o(d,{href:"/ktor/server-plugins",summary:"插件提供通用功能，例如序列化、内容编码、压缩等。"},{default:i(()=>t[25]||(t[25]=[n("插件")])),_:1}),t[27]||(t[27]=n("。"))]),t[70]||(t[70]=l("p",null," 虽然你可以手动将其添加到现有项目中，但更简单的方法是生成一个新项目，然后逐步添加之前教程中的代码。你将在过程中重复所有的代码，因此你不需要手头有之前的项目。 ",-1)),o(p,{title:"创建带有插件的新项目"},{default:i(()=>[o(e,null,{default:i(()=>t[28]||(t[28]=[l("p",null,[n(" 导航到 "),l("a",{href:"https://start.ktor.io/"},"Ktor 项目生成器"),n(" 。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[31]||(t[31]=n("在 ")),o(m,null,{default:i(()=>t[29]||(t[29]=[n("项目构件")])),_:1}),t[32]||(t[32]=n(" 字段中，输入 ")),o(s,null,{default:i(()=>t[30]||(t[30]=[n("com.example.ktor-rest-task-app")])),_:1}),t[33]||(t[33]=n(" 作为你的项目构件名称。 ")),t[34]||(t[34]=l("img",{src:C,alt:"在 Ktor 项目生成器中命名项目构件",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[36]||(t[36]=n(" 在插件部分，通过点击 ")),o(m,null,{default:i(()=>t[35]||(t[35]=[n("添加")])),_:1}),t[37]||(t[37]=n(" 按钮搜索并添加以下插件： "))]),o(f,{type:"bullet"},{default:i(()=>t[38]||(t[38]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1)])),_:1}),t[39]||(t[39]=l("p",null,[l("img",{src:K,alt:"在 Ktor 项目生成器中添加插件","border-effect":"line",style:{},width:"706"}),n(" 添加插件后，你将看到所有 四个插件列在项目设置下方。 "),l("img",{src:N,alt:"Ktor 项目生成器中的插件列表","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[41]||(t[41]=n(" 点击 ")),o(m,null,{default:i(()=>t[40]||(t[40]=[n("下载")])),_:1}),t[42]||(t[42]=n(" 按钮以生成并下载你的 Ktor 项目。 "))])]),_:1})]),_:1}),o(p,{title:"添加启动代码",id:"add-starter-code"},{default:i(()=>[o(e,null,{default:i(()=>t[43]||(t[43]=[l("p",null,[n("在 IntelliJ IDEA 中打开你的项目，如"),l("a",{href:"./server-create-a-new-project#open-explore-run"},"在 IntelliJ IDEA 中打开、探索并运行你的 Ktor 项目"),n("教程中所述。")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[46]||(t[46]=n(" 导航到 ")),o(s,null,{default:i(()=>t[44]||(t[44]=[n("src/main/kotlin/com/example")])),_:1}),t[47]||(t[47]=n(" 并创建一个名为 ")),o(s,null,{default:i(()=>t[45]||(t[45]=[n("model")])),_:1}),t[48]||(t[48]=n(" 的子包。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[51]||(t[51]=n(" 在")),o(s,null,{default:i(()=>t[49]||(t[49]=[n("model")])),_:1}),t[52]||(t[52]=n("包内，创建一个新的 ")),o(s,null,{default:i(()=>t[50]||(t[50]=[n("Task.kt")])),_:1}),t[53]||(t[53]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[55]||(t[55]=n(" 打开 ")),o(s,null,{default:i(()=>t[54]||(t[54]=[n("Task.kt")])),_:1}),t[56]||(t[56]=n(" 文件，添加一个 ")),t[57]||(t[57]=l("code",null,"enum",-1)),t[58]||(t[58]=n(" 来表示优先级，以及一个 ")),t[59]||(t[59]=l("code",null,"class",-1)),t[60]||(t[60]=n(" 来表示任务： "))]),o(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[61]||(t[61]=l("p",null,[n(" 在之前的教程中，你使用了扩展函数将 "),l("code",null,"Task"),n(" 转换为 HTML。在本例中， "),l("code",null,"Task"),n(" 类使用"),l("code",null,"kotlinx.serialization"),n("库中的"),l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"},[l("code",null,"Serializable")]),n(" 类型进行了注解。 ")],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[63]||(t[63]=n(" 打开 ")),o(s,null,{default:i(()=>t[62]||(t[62]=[n("Routing.kt")])),_:1}),t[64]||(t[64]=n(" 文件，并用以下实现替换现有代码： "))]),o(r,{lang:"kotlin",code:`                    package com.example

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
                    }`}),t[65]||(t[65]=l("p",null,[n(" 与之前的教程类似，你为 URL "),l("code",null,"/tasks"),n(" 的 GET 请求创建了一个路由。 这次，你不再手动转换任务列表，而是直接返回该列表。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[66]||(t[66]=[l("p",null,[n("在 IntelliJ IDEA 中，点击运行按钮 ("),l("img",{src:g,style:{},height:"16",width:"16",alt:"intelliJ IDEA 运行图标"}),n(") 来启动应用程序。")],-1)])),_:1}),o(e,null,{default:i(()=>t[67]||(t[67]=[l("p",null,[n(" 在浏览器中导航到 "),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("。你应该会看到任务列表的 JSON 版本，如下所示： ")],-1)])),_:1}),t[68]||(t[68]=l("img",{src:w,alt:"浏览器屏幕中显示的 JSON 数据","border-effect":"rounded",width:"706"},null,-1)),t[69]||(t[69]=l("p",null,"显然，有很多工作正在替我们完成。到底发生了什么？",-1))]),_:1})]),_:1}),o(a,{title:"理解内容协商",id:"content-negotiation"},{default:i(()=>[o(a,{title:"通过浏览器进行内容协商",id:"via-browser"},{default:i(()=>[l("p",null,[t[73]||(t[73]=n(" 创建项目时，你包含了")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。"},{default:i(()=>t[71]||(t[71]=[n("Content Negotiation")])),_:1}),t[74]||(t[74]=n(" 插件。该插件会查看客户端可以渲染的内容类型，并将其与当前服务可以提供的内容类型进行匹配。因此，得名 ")),o(b,{style:{}},{default:i(()=>t[72]||(t[72]=[n("内容协商")])),_:1}),t[75]||(t[75]=n(" 。 "))]),t[81]||(t[81]=l("p",null,[n(" 在 HTTP 中，客户端通过 "),l("code",null,"Accept"),n(" 标头表明它可以渲染哪些内容类型。此标头的值是一个或多个内容类型。在上述情况下，你可以使用浏览器内置的开发工具来检查此标头的值。 ")],-1)),t[82]||(t[82]=l("p",null," 考虑以下示例： ",-1)),o(r,{code:"                text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}),t[83]||(t[83]=l("p",null,[n("请注意包含 "),l("code",null,[l("em",null,"/")]),n("。此标头表示它接受 HTML、XML 或图像——但它也会接受任何其他内容 类型。")],-1)),l("p",null,[t[78]||(t[78]=n("Content Negotiation 插件需要找到一种格式将数据发送回浏览器。如果你查看项目中的生成代码，你会发现")),o(s,null,{default:i(()=>t[76]||(t[76]=[n("src/main/kotlin/com/example")])),_:1}),t[79]||(t[79]=n("目录下有一个名为")),o(s,null,{default:i(()=>t[77]||(t[77]=[n("Serialization.kt")])),_:1}),t[80]||(t[80]=n("的文件，其中包含以下内容： "))]),o(r,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[84]||(t[84]=l("p",null,[n(" 此代码安装了 "),l("code",null,"ContentNegotiation"),n(" 插件，并配置了 "),l("code",null,"kotlinx.serialization"),n(" 插件。这样，当客户端发送请求时，服务器可以发送回序列化为 JSON 的对象。 ")],-1)),t[85]||(t[85]=l("p",null,[n(" 在来自浏览器的请求中，"),l("code",null,"ContentNegotiation"),n(" 插件知道它只能返回 JSON，并且浏览器会尝试显示它收到的任何内容。因此请求成功。 ")],-1))]),_:1}),o(p,{title:"通过 JavaScript 进行内容协商",id:"via-javascript"},{default:i(()=>[t[99]||(t[99]=l("p",null,[n(" 在生产环境中，你不会希望直接在浏览器中显示 JSON。相反，会有 JavaScript 代码在浏览器中运行，它会发出请求，然后将返回的数据作为单页应用 (SPA) 的一部分显示出来。通常，这类应用会使用诸如 "),l("a",{href:"https://react.dev/"},"React"),n("、 "),l("a",{href:"https://angular.io/"},"Angular"),n(" 或 "),l("a",{href:"https://vuejs.org/"},"Vue.js"),n(" 等框架编写。 ")],-1)),o(e,null,{default:i(()=>[l("p",null,[t[88]||(t[88]=n(" 为了模拟这一点，打开 ")),o(s,null,{default:i(()=>t[86]||(t[86]=[n("src/main/resources/static")])),_:1}),t[89]||(t[89]=n(" 目录下的 ")),o(s,null,{default:i(()=>t[87]||(t[87]=[n("index.html")])),_:1}),t[90]||(t[90]=n(" 页面，并用以下内容替换默认内容： "))]),o(r,{lang:"html",code:`<html>
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
</html>`}),t[91]||(t[91]=l("p",null,[n(" 此页面包含一个 HTML 表单和一个空表。提交表单后，JavaScript 事件处理程序会向 "),l("code",null,"/tasks"),n(" 端点发送请求，并将 "),l("code",null,"Accept"),n(" 标头设置为 "),l("code",null,"application/json"),n("。返回的数据随后被反序列化并添加到 HTML 表格中。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[92]||(t[92]=[l("p",null,[n(" 在 IntelliJ IDEA 中，点击重新运行按钮 ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"intelliJ IDEA 重新运行图标"}),n(") 来重新启动应用程序。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[94]||(t[94]=n(" 导航到 URL ")),t[95]||(t[95]=l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1)),t[96]||(t[96]=n("。 你应该能够通过点击 ")),o(m,null,{default:i(()=>t[93]||(t[93]=[n("查看任务")])),_:1}),t[97]||(t[97]=n(" 按钮来获取数据： "))]),t[98]||(t[98]=l("img",{src:R,alt:"显示按钮和 HTML 表格中显示任务的浏览器窗口","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"添加 GET 路由",id:"porting-get-routes"},{default:i(()=>[l("p",null,[t[101]||(t[101]=n(" 既然你已经熟悉了内容协商的过程，接下来请继续将")),o(d,{href:"/ktor/server-requests-and-responses",summary:"了解如何使用 Ktor 在 Kotlin 中构建任务管理器应用程序，学习路由、处理请求和参数的基础知识。"},{default:i(()=>t[100]||(t[100]=[n("上一个教程")])),_:1}),t[102]||(t[102]=n("中的功能迁移到本教程中。 "))]),o(a,{title:"重用任务仓库",id:"task-repository"},{default:i(()=>[t[111]||(t[111]=l("p",null," 你可以不加修改地重用任务仓库，所以我们先来做这件事。 ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[105]||(t[105]=n(" 在")),o(s,null,{default:i(()=>t[103]||(t[103]=[n("model")])),_:1}),t[106]||(t[106]=n("包内，创建一个新的 ")),o(s,null,{default:i(()=>t[104]||(t[104]=[n("TaskRepository.kt")])),_:1}),t[107]||(t[107]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[109]||(t[109]=n(" 打开 ")),o(s,null,{default:i(()=>t[108]||(t[108]=[n("TaskRepository.kt")])),_:1}),t[110]||(t[110]=n(" 并添加以下代码： "))]),o(r,{lang:"kotlin",code:`package com.example.model

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
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"重用 GET 请求的路由",id:"get-requests"},{default:i(()=>[t[121]||(t[121]=l("p",null," 现在你已经创建了仓库，可以实现 GET 请求的路由了。之前的代码可以简化，因为你不再需要担心将任务转换为 HTML： ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[114]||(t[114]=n(" 导航到")),o(s,null,{default:i(()=>t[112]||(t[112]=[n("src/main/kotlin/com/example")])),_:1}),t[115]||(t[115]=n("目录下的 ")),o(s,null,{default:i(()=>t[113]||(t[113]=[n("Routing.kt")])),_:1}),t[116]||(t[116]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[t[118]||(t[118]=l("p",null,[n(" 使用以下实现更新"),l("code",null,"Application.configureRouting()"),n("函数中"),l("code",null,"/tasks"),n("路由的代码： ")],-1)),o(r,{lang:"kotlin",code:`                    package com.example

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

                            //updated implementation
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
                    }`}),t[119]||(t[119]=l("p",null," 有了这个，你的服务器可以响应以下 GET 请求：",-1)),o(f,null,{default:i(()=>t[117]||(t[117]=[l("li",null,[l("code",null,"/tasks"),n(" 返回仓库中的所有任务。")],-1),l("li",null,[l("code",null,"/tasks/byName/{taskName}"),n(" 返回按指定 "),l("code",null,"taskName"),n(" 过滤的任务。 ")],-1),l("li",null,[l("code",null,"/tasks/byPriority/{priority}"),n(" 返回按指定 "),l("code",null,"priority"),n(" 过滤的任务。 ")],-1)])),_:1})]),_:1}),o(e,null,{default:i(()=>t[120]||(t[120]=[l("p",null,[n(" 在 IntelliJ IDEA 中，点击重新运行按钮 ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"intelliJ IDEA 重新运行图标"}),n(") 来重新启动应用程序。 ")],-1)])),_:1})]),_:1})]),_:1}),o(a,{title:"测试功能",id:"test-tasks-routes"},{default:i(()=>[o(p,{title:"使用浏览器"},{default:i(()=>t[122]||(t[122]=[l("p",null,[n("你可以在浏览器中测试这些路由。例如，导航到 "),l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n(" 以 JSON 格式查看所有具有 "),l("code",null,"Medium"),n(" 优先级的任务：")],-1),l("img",{src:J,alt:"显示具有 Medium 优先级任务的 JSON 格式的浏览器窗口","border-effect":"rounded",width:"706"},null,-1),l("p",null,[n(" 鉴于这些类型的请求通常来自 JavaScript，更精细的测试是更优的选择。为此，你可以使用像 "),l("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),n(" 这样的专业工具。 ")],-1)])),_:1}),o(p,{title:"使用 Postman"},{default:i(()=>[o(e,null,{default:i(()=>t[123]||(t[123]=[l("p",null,[n("在 Postman 中，创建一个新的 GET 请求，URL 为 "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("。")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[126]||(t[126]=n(" 在 ")),o(k,null,{default:i(()=>t[124]||(t[124]=[n("Headers")])),_:1}),t[127]||(t[127]=n(" 窗格中，将 ")),o(k,null,{default:i(()=>t[125]||(t[125]=[n("Accept")])),_:1}),t[128]||(t[128]=n(" 标头的值设置为 ")),t[129]||(t[129]=l("code",null,"application/json",-1)),t[130]||(t[130]=n("。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[132]||(t[132]=n("点击 ")),o(m,null,{default:i(()=>t[131]||(t[131]=[n("发送")])),_:1}),t[133]||(t[133]=n(" 以发送请求并在响应查看器中查看响应。 "))]),t[134]||(t[134]=l("img",{src:I,alt:"Postman 中显示具有 Medium 优先级任务的 JSON 格式的 GET 请求","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(p,{title:"使用 HTTP 请求文件"},{default:i(()=>[t[146]||(t[146]=l("p",null,"在 IntelliJ IDEA Ultimate 中，你可以在 HTTP 请求文件中执行相同的步骤。",-1)),o(e,null,{default:i(()=>[l("p",null,[t[136]||(t[136]=n(" 在项目根目录中，创建一个新的 ")),o(s,null,{default:i(()=>t[135]||(t[135]=[n("REST Task Manager.http")])),_:1}),t[137]||(t[137]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[139]||(t[139]=n(" 打开 ")),o(s,null,{default:i(()=>t[138]||(t[138]=[n("REST Task Manager.http")])),_:1}),t[140]||(t[140]=n(" 文件并添加以下 GET 请求： "))]),o(r,{lang:"http",code:`GET http://0.0.0.0:8080/tasks/byPriority/Medium
Accept: application/json`})]),_:1}),o(e,null,{default:i(()=>t[141]||(t[141]=[l("p",null,[n(" 要在 IntelliJ IDE 中发送请求，请点击其旁边的边栏图标 ("),l("img",{alt:"intelliJ IDEA 边栏图标",src:g,width:"16",height:"26"}),n(")。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[143]||(t[143]=n("这将在 ")),o(s,null,{default:i(()=>t[142]||(t[142]=[n("Services")])),_:1}),t[144]||(t[144]=n(" 工具窗口中打开并运行： "))]),t[145]||(t[145]=l("img",{src:H,alt:"HTTP 文件中显示具有 Medium 优先级任务的 JSON 格式的 GET 请求","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(x,null,{default:i(()=>t[147]||(t[147]=[n(" 另一种测试路由的方法是在 Kotlin Notebook 中使用 "),l("a",{href:"https://khttp.readthedocs.io/en/latest/"},"khttp",-1),n(" 库。 ")])),_:1})]),_:1})]),_:1}),o(a,{title:"为 POST 请求添加路由",id:"add-a-route-for-post-requests"},{default:i(()=>[t[167]||(t[167]=l("p",null,[n(" 在之前的教程中，任务是通过 HTML 表单创建的。然而，由于你现在正在构建一个 RESTful 服务，你不再需要那样做。相反，你将利用 "),l("code",null,"kotlinx.serialization"),n(" 框架，它将完成大部分繁重的工作。 ")],-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[150]||(t[150]=n(" 打开 ")),o(s,null,{default:i(()=>t[148]||(t[148]=[n("src/main/kotlin/com/example")])),_:1}),t[151]||(t[151]=n(" 目录下的 ")),o(s,null,{default:i(()=>t[149]||(t[149]=[n("Routing.kt")])),_:1}),t[152]||(t[152]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[t[153]||(t[153]=l("p",null,[n(" 按如下方式向"),l("code",null,"Application.configureRouting()"),n("函数添加一个新的 POST 路由： ")],-1)),o(r,{lang:"kotlin",code:`                    //...

                    fun Application.configureRouting() {
                        routing {
                            //...

                            route("/tasks") {
                                //...

                                //add the following new route
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
                    }`}),t[154]||(t[154]=l("p",null," 添加以下新的导入： ",-1)),o(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.Task
                    import io.ktor.serialization.*
                    import io.ktor.server.request.*`}),t[155]||(t[155]=l("p",null,[n(" 当 POST 请求发送到 "),l("code",null,"/tasks"),n(" 时，"),l("code",null,"kotlinx.serialization"),n(" 框架用于将请求正文转换为 "),l("code",null,"Task"),n(" 对象。如果成功，任务将被添加到仓库。如果反序列化过程失败，服务器将需要处理 "),l("code",null,"SerializationException"),n("，而如果任务重复，则需要处理 "),l("code",null,"IllegalStateException"),n("。 ")],-1))]),_:1}),o(e,null,{default:i(()=>t[156]||(t[156]=[l("p",null," 重新启动应用程序。 ",-1)])),_:1}),o(e,null,{default:i(()=>t[157]||(t[157]=[l("p",null,[n(" 要在 Postman 中测试此功能，创建一个新的 POST 请求，URL 为 "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[159]||(t[159]=n(" 在 ")),o(k,null,{default:i(()=>t[158]||(t[158]=[n("Body")])),_:1}),t[160]||(t[160]=n(" 窗格中，添加以下 JSON 文档以表示新任务： "))]),o(r,{lang:"json",code:`{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`}),t[161]||(t[161]=l("img",{src:j,alt:"Postman 中用于添加新任务的 POST 请求","border-effect":"line",width:"706"},null,-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[163]||(t[163]=n("点击 ")),o(m,null,{default:i(()=>t[162]||(t[162]=[n("发送")])),_:1}),t[164]||(t[164]=n(" 以发送请求。 "))])]),_:1}),o(e,null,{default:i(()=>t[165]||(t[165]=[l("p",null,[n(" 你可以通过向 "),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n(" 发送 GET 请求来验证任务是否已添加。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[t[166]||(t[166]=l("p",null," 在 IntelliJ IDEA Ultimate 中，你可以通过将以下内容添加到你的 HTTP 请求文件来执行相同的步骤： ",-1)),o(r,{lang:"http",code:`###

POST http://0.0.0.0:8080/tasks
Content-Type: application/json

{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"添加移除支持",id:"remove-tasks"},{default:i(()=>[t[185]||(t[185]=l("p",null," 你已接近完成向服务添加基本操作。这些操作通常被概括为 CRUD 操作——即创建（Create）、读取（Read）、更新（Update）和删除（Delete）的缩写。现在你将实现删除操作。 ",-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[169]||(t[169]=n(" 在 ")),o(s,null,{default:i(()=>t[168]||(t[168]=[n("TaskRepository.kt")])),_:1}),t[170]||(t[170]=n(" 文件中，在 ")),t[171]||(t[171]=l("code",null,"TaskRepository",-1)),t[172]||(t[172]=n(" 对象中添加以下方法，以根据任务名称移除任务： "))]),o(r,{lang:"kotlin",code:`    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }`})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[174]||(t[174]=n(" 打开 ")),o(s,null,{default:i(()=>t[173]||(t[173]=[n("Routing.kt")])),_:1}),t[175]||(t[175]=n(" 文件，并在 ")),t[176]||(t[176]=l("code",null,"routing()",-1)),t[177]||(t[177]=n(" 函数中添加一个端点来处理 DELETE 请求： "))]),o(r,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        //...

                        routing {
                            route("/tasks") {
                                //...
                                //add the following function
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
                    }`})]),_:1}),o(e,null,{default:i(()=>t[178]||(t[178]=[l("p",null," 重新启动应用程序。 ",-1)])),_:1}),o(e,null,{default:i(()=>[t[179]||(t[179]=l("p",null," 将以下 DELETE 请求添加到你的 HTTP 请求文件： ",-1)),o(r,{lang:"http",code:`###

DELETE http://0.0.0.0:8080/tasks/gardening`})]),_:1}),o(e,null,{default:i(()=>t[180]||(t[180]=[l("p",null,[n(" 要在 IntelliJ IDE 中发送 DELETE 请求，请点击其旁边的边栏图标 ("),l("img",{alt:"intelliJ IDEA 边栏图标",src:g,width:"16",height:"26"}),n(")。 ")],-1)])),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[182]||(t[182]=n("你将在 ")),o(s,null,{default:i(()=>t[181]||(t[181]=[n("Services")])),_:1}),t[183]||(t[183]=n(" 工具窗口中看到响应： "))]),t[184]||(t[184]=l("img",{src:q,alt:"HTTP 请求文件中的 DELETE 请求","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"使用 Ktor 客户端创建单元测试",id:"create-unit-tests"},{default:i(()=>[l("p",null,[t[187]||(t[187]=n(" 到目前为止，你都是手动测试应用程序，但正如你已经注意到的那样，这种方法耗时且无法扩展。相反，你可以实现")),o(d,{href:"/ktor/server-testing",summary:"了解如何使用专用测试引擎测试你的服务器应用程序。"},{default:i(()=>t[186]||(t[186]=[n("JUnit 测试")])),_:1}),t[188]||(t[188]=n("，使用内置的 ")),t[189]||(t[189]=l("code",null,"client",-1)),t[190]||(t[190]=n(" 对象来获取和反序列化 JSON。 "))]),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[193]||(t[193]=n(" 打开 ")),o(s,null,{default:i(()=>t[191]||(t[191]=[n("src/test/kotlin/com/example")])),_:1}),t[194]||(t[194]=n(" 目录下的 ")),o(s,null,{default:i(()=>t[192]||(t[192]=[n("ApplicationTest.kt")])),_:1}),t[195]||(t[195]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[197]||(t[197]=n(" 用以下内容替换 ")),o(s,null,{default:i(()=>t[196]||(t[196]=[n("ApplicationTest.kt")])),_:1}),t[198]||(t[198]=n(" 文件的内容： "))]),o(r,{lang:"kotlin",code:`package com.example

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
}`}),t[199]||(t[199]=l("p",null,[n(" 请注意，你需要将 "),l("code",null,"ContentNegotiation"),n(" 和 "),l("code",null,"kotlinx.serialization"),n(" 插件安装到"),l("a",{href:"./client-create-and-configure#plugins"},"插件"),n("中，与你在服务器上安装的方式相同。 ")],-1))]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[201]||(t[201]=n(" 将以下依赖项添加到位于 ")),o(s,null,{default:i(()=>t[200]||(t[200]=[n("gradle/libs.versions.toml")])),_:1}),t[202]||(t[202]=n(" 的版本目录中： "))]),o(r,{lang:"yaml",code:`                    [libraries]
                    # ...
                    ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[204]||(t[204]=n(" 将新依赖项添加到你的 ")),o(s,null,{default:i(()=>t[203]||(t[203]=[n("build.gradle.kts")])),_:1}),t[205]||(t[205]=n(" 文件： "))]),o(r,{lang:"kotlin",code:"                    testImplementation(libs.ktor.client.content.negotiation)"})]),_:1})]),_:1})]),_:1}),o(a,{title:"使用 JsonPath 创建单元测试",id:"unit-tests-via-jsonpath"},{default:i(()=>[t[223]||(t[223]=l("p",null," 使用 Ktor 客户端或类似库测试你的服务很方便，但从质量保证 (QA) 的角度来看，它有一个缺点。服务器不直接处理 JSON，因此无法确定其对 JSON 结构的假设。 ",-1)),t[224]||(t[224]=l("p",null," 例如，假设如下： ",-1)),o(f,null,{default:i(()=>t[206]||(t[206]=[l("li",null,[n("值存储在 "),l("code",null,"array"),n(" 中，而实际上使用了 "),l("code",null,"object"),n("。")],-1),l("li",null,[n("属性存储为 "),l("code",null,"numbers"),n("，而实际上它们是 "),l("code",null,"strings"),n("。")],-1),l("li",null,"成员按声明顺序序列化，而实际上并非如此。",-1)])),_:1}),t[225]||(t[225]=l("p",null,[n(" 如果你的服务旨在供多个客户端使用，那么对 JSON 结构有信心至关重要。为了实现这一点，请使用 Ktor 客户端从服务器检索文本，然后使用 "),l("a",{href:"https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path"},"JSONPath"),n(" 库分析此内容。")],-1)),o(p,null,{default:i(()=>[o(e,null,{default:i(()=>[l("p",null,[t[208]||(t[208]=n("在你的 ")),o(s,null,{default:i(()=>t[207]||(t[207]=[n("build.gradle.kts")])),_:1}),t[209]||(t[209]=n(" 文件中，将 JSONPath 库添加到 ")),t[210]||(t[210]=l("code",null,"dependencies",-1)),t[211]||(t[211]=n(" 代码块： "))]),o(r,{lang:"kotlin",code:'    testImplementation("com.jayway.jsonpath:json-path:2.9.0")'})]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[214]||(t[214]=n(" 导航到 ")),o(s,null,{default:i(()=>t[212]||(t[212]=[n("src/test/kotlin/com/example")])),_:1}),t[215]||(t[215]=n(" 文件夹并创建一个新的 ")),o(s,null,{default:i(()=>t[213]||(t[213]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[216]||(t[216]=n(" 文件。 "))])]),_:1}),o(e,null,{default:i(()=>[l("p",null,[t[218]||(t[218]=n(" 打开 ")),o(s,null,{default:i(()=>t[217]||(t[217]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[219]||(t[219]=n(" 文件并添加以下内容： "))]),o(r,{lang:"kotlin",code:`package com.example

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
}`}),t[221]||(t[221]=l("p",null," JsonPath 查询的工作方式如下： ",-1)),o(f,null,{default:i(()=>t[220]||(t[220]=[l("li",null,[l("code",null,"$[*].name"),n(" 表示“将文档视为一个数组，并返回每个条目的 name 属性值”。 ")],-1),l("li",null,[l("code",null,"$[?(@.priority == '$priority')].name"),n(" 表示“返回数组中每个 priority 等于所提供值的条目的 name 属性值”。 ")],-1)])),_:1}),t[222]||(t[222]=l("p",null," 你可以使用这些查询来确认你对返回 JSON 的理解。当你进行代码重构和服务重新部署时，即使当前的框架不会中断反序列化，序列化中的任何修改也会被识别出来。这让你能够放心地重新发布公共可用的 API。 ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"后续步骤",id:"next-steps"},{default:i(()=>[t[229]||(t[229]=l("p",null," 恭喜！你现在已经完成了为你的任务管理器应用程序创建 RESTful API 服务，并学习了使用 Ktor 客户端和 JsonPath 进行单元测试的要点。",-1)),l("p",null,[t[227]||(t[227]=n(" 继续学习 ")),o(d,{href:"/ktor/server-create-website",summary:"了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板构建网站。"},{default:i(()=>t[226]||(t[226]=[n("下一个教程")])),_:1}),t[228]||(t[228]=n(" ，了解如何重用你的 API 服务来构建一个 Web 应用程序。 "))])]),_:1})]),_:1})])}const _=D(L,[["render",M]]);export{Z as __pageData,_ as default};
