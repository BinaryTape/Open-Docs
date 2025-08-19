import{_ as L,a as M,b as H,c as N,d as O,e as D}from"./chunks/server_create_web_app_new_task_added.aEfqvYQu.js";import{_ as B}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as $}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as P}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as q,C as u,c as J,o as V,G as n,w as r,j as o,a as l}from"./chunks/framework.Bksy39di.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-create-website.md","filePath":"ktor/server-create-website.md","lastUpdated":1755514048000}'),W={name:"ktor/server-create-website.md"};function G(j,t,F,U,z,Y){const p=u("Links"),S=u("tldr"),C=u("web-summary"),E=u("card-summary"),R=u("link-summary"),m=u("project"),f=u("list"),a=u("chapter"),i=u("step"),k=u("control"),s=u("Path"),y=u("procedure"),d=u("task"),e=u("code-block"),K=u("extension"),I=u("function"),b=u("method"),v=u("application"),x=u("framework"),w=u("functionality"),g=u("parameter"),T=u("repository"),A=u("topic");return V(),J("div",null,[n(A,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Ktor 在 Kotlin 中创建网站",id:"server-create-website"},{default:r(()=>[n(S,null,{default:r(()=>[t[7]||(t[7]=o("p",null,[o("b",null,"代码示例"),l(": "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-web-application"}," tutorial-server-web-application ")],-1)),o("p",null,[t[3]||(t[3]=o("b",null,"所用插件",-1)),t[4]||(t[4]=l(": ")),n(p,{href:"/ktor/server-routing",summary:"路由是服务器应用程序中用于处理传入请求的核心插件。"},{default:r(()=>t[0]||(t[0]=[l("Routing")])),_:1}),t[5]||(t[5]=l(", ")),n(p,{href:"/ktor/server-static-content",summary:"了解如何提供静态内容，例如样式表、脚本、图像等。"},{default:r(()=>t[1]||(t[1]=[l("Static Content")])),_:1}),t[6]||(t[6]=l(", ")),n(p,{href:"/ktor/server-thymeleaf",summary:"所需依赖项：io.ktor:%artifact_name% 代码示例：tutorial-server-web-application 原生服务器支持：✖️"},{default:r(()=>t[2]||(t[2]=[l("Thymeleaf")])),_:1})])]),_:1}),n(C,null,{default:r(()=>t[8]||(t[8]=[l(" 了解如何使用 Ktor 和 Kotlin 构建网站。本教程将向你展示如何将 Thymeleaf 模板与 Ktor 路由结合，在服务器端生成基于 HTML 的用户界面。 ")])),_:1}),n(E,null,{default:r(()=>t[9]||(t[9]=[l(" 了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。 ")])),_:1}),n(R,null,{default:r(()=>t[10]||(t[10]=[l(" 了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。 ")])),_:1}),t[329]||(t[329]=o("p",null,[l(" 在本教程中，我们将向你展示如何使用 Ktor 和 "),o("a",{href:"https://www.thymeleaf.org/"},"Thymeleaf"),l(" 模板在 Kotlin 中构建交互式网站。 ")],-1)),o("p",null,[t[13]||(t[13]=l(" 在")),n(p,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:r(()=>t[11]||(t[11]=[l("上一教程")])),_:1}),t[14]||(t[14]=l("中，你学习了如何创建 RESTful 服务，我们假设该服务将由用 JavaScript 编写的单页应用程序 (SPA) 使用。尽管这是一种非常流行的架构，但它并不适合所有")),n(m,null,{default:r(()=>t[12]||(t[12]=[l("项目")])),_:1}),t[15]||(t[15]=l("。 "))]),t[330]||(t[330]=o("p",null," 你可能希望将所有实现保留在服务器端，并且只向客户端发送标记，原因有很多，例如： ",-1)),n(f,null,{default:r(()=>t[16]||(t[16]=[o("li",null,"简洁性 - 维护单一代码库。",-1),o("li",null,"安全性 - 防止将可能为攻击者提供洞察力的数据或代码放置到浏览器上。 ",-1),o("li",null," 可支持性 - 允许客户端使用尽可能广泛的客户端，包括旧版浏览器和禁用 JavaScript 的客户端。 ",-1)])),_:1}),o("p",null,[t[18]||(t[18]=l(" Ktor 通过与")),n(p,{href:"/ktor/server-templating",summary:"了解如何使用 HTML/CSS 或 JVM 模板引擎构建视图。"},{default:r(()=>t[17]||(t[17]=[l("多种服务器页面技术")])),_:1}),t[19]||(t[19]=l("集成来支持这种方法。 "))]),n(a,{title:"先决条件",id:"prerequisites"},{default:r(()=>[o("p",null,[t[21]||(t[21]=l(" 你可以独立完成本教程，但是，我们强烈建议你完成")),n(p,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:r(()=>t[20]||(t[20]=[l("前一个教程")])),_:1}),t[22]||(t[22]=l("，以学习如何创建 RESTful API。 "))]),t[23]||(t[23]=o("p",null,[l("我们建议你安装 "),o("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),l("，但你也可以使用其他你选择的 IDE。 ")],-1))]),_:1}),n(a,{title:"Hello 任务管理器 Web 应用程序",id:"hello-task-manager"},{default:r(()=>[o("p",null,[t[26]||(t[26]=l(" 在本教程中，你将把在")),n(p,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:r(()=>t[24]||(t[24]=[l("上一教程")])),_:1}),t[27]||(t[27]=l("中构建的“任务管理器”转换为 Web 应用程序。为此，你将使用多个 Ktor ")),n(p,{href:"/ktor/server-plugins",summary:"插件提供常见功能，例如序列化、内容编码、压缩等。"},{default:r(()=>t[25]||(t[25]=[l("插件")])),_:1}),t[28]||(t[28]=l("。 "))]),o("p",null,[t[32]||(t[32]=l(" 尽管你可以手动将这些插件添加到现有")),n(m,null,{default:r(()=>t[29]||(t[29]=[l("项目")])),_:1}),t[33]||(t[33]=l("中，但生成一个新")),n(m,null,{default:r(()=>t[30]||(t[30]=[l("项目")])),_:1}),t[34]||(t[34]=l("并逐步整合上一教程中的代码会更容易。我们将在整个过程中提供所有必要的代码，因此你无需手边拥有之前的")),n(m,null,{default:r(()=>t[31]||(t[31]=[l("项目")])),_:1}),t[35]||(t[35]=l("。 "))]),n(y,{title:"创建带插件的初始项目",id:"create-project"},{default:r(()=>[n(i,null,{default:r(()=>t[36]||(t[36]=[o("p",null,[l(" 导航到 "),o("a",{href:"https://start.ktor.io/"},"Ktor 项目生成器"),l(" 。 ")],-1)])),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[40]||(t[40]=l(" 在 ")),n(k,null,{default:r(()=>t[37]||(t[37]=[l("项目 artifact")])),_:1}),t[41]||(t[41]=l(" 字段中，输入 ")),n(s,null,{default:r(()=>t[38]||(t[38]=[l("com.example.ktor-task-web-app")])),_:1}),t[42]||(t[42]=l(" 作为你的")),n(m,null,{default:r(()=>t[39]||(t[39]=[l("项目")])),_:1}),t[43]||(t[43]=l(" artifact 名称。 ")),t[44]||(t[44]=o("img",{src:L,alt:"Ktor 项目生成器项目 artifact 名称",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[46]||(t[46]=l(" 在下一个屏幕中，点击 ")),n(k,null,{default:r(()=>t[45]||(t[45]=[l("添加")])),_:1}),t[47]||(t[47]=l(" 按钮，搜索并添加以下插件： "))]),n(f,null,{default:r(()=>t[48]||(t[48]=[o("li",null,"Routing",-1),o("li",null,"Static Content",-1),o("li",null,"Thymeleaf",-1)])),_:1}),o("p",null,[t[50]||(t[50]=o("img",{src:B,alt:"在 Ktor 项目生成器中添加插件","border-effect":"line",style:{},width:"706"},null,-1)),t[51]||(t[51]=l(" 一旦你添加了这些插件，你将看到所有 三个插件都列在")),n(m,null,{default:r(()=>t[49]||(t[49]=[l("项目")])),_:1}),t[52]||(t[52]=l("设置下方。 ")),t[53]||(t[53]=o("img",{src:M,alt:"Ktor 项目生成器插件列表",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[56]||(t[56]=l(" 点击 ")),n(k,null,{default:r(()=>t[54]||(t[54]=[l("下载")])),_:1}),t[57]||(t[57]=l(" 按钮以生成并下载你的 Ktor ")),n(m,null,{default:r(()=>t[55]||(t[55]=[l("项目")])),_:1}),t[58]||(t[58]=l("。 "))])]),_:1})]),_:1}),n(y,{title:"添加启动代码",id:"add-starter-code"},{default:r(()=>[n(i,null,{default:r(()=>[t[60]||(t[60]=l(" 打开你的")),n(m,null,{default:r(()=>t[59]||(t[59]=[l("项目")])),_:1}),t[61]||(t[61]=l("，使用 IntelliJ IDEA 或其他你选择的 IDE。 "))]),_:1}),n(i,null,{default:r(()=>[t[64]||(t[64]=l(" 导航到 ")),n(s,null,{default:r(()=>t[62]||(t[62]=[l("src/main/kotlin/com/example")])),_:1}),t[65]||(t[65]=l(" 并创建一个名为 ")),n(s,null,{default:r(()=>t[63]||(t[63]=[l("model")])),_:1}),t[66]||(t[66]=l(" 的子包。 "))]),_:1}),n(i,null,{default:r(()=>[t[69]||(t[69]=l(" 在 ")),n(s,null,{default:r(()=>t[67]||(t[67]=[l("model")])),_:1}),t[70]||(t[70]=l(" 包内，创建一个新的 ")),n(s,null,{default:r(()=>t[68]||(t[68]=[l("Task.kt")])),_:1}),t[71]||(t[71]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[74]||(t[74]=l(" 在 ")),n(s,null,{default:r(()=>t[72]||(t[72]=[l("Task.kt")])),_:1}),t[75]||(t[75]=l(" 文件中，添加一个 ")),t[76]||(t[76]=o("code",null,"enum",-1)),t[77]||(t[77]=l(" 来表示优先级，以及一个 ")),t[78]||(t[78]=o("code",null,"data class",-1)),t[79]||(t[79]=l(" 来表示")),n(d,null,{default:r(()=>t[73]||(t[73]=[l("任务")])),_:1}),t[80]||(t[80]=l("： "))]),n(e,{lang:"kotlin",code:`enum class Priority {
    Low, Medium, High, Vital
}

data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[101]||(t[101]=o("p",null,[l(" 同样，我们希望创建 "),o("code",null,"Task"),l(" 对象并以可显示的形式将其发送给客户端。 ")],-1)),t[102]||(t[102]=o("p",null," 你可能记得： ",-1)),n(f,null,{default:r(()=>[o("li",null,[t[85]||(t[85]=l(" 在")),n(p,{href:"/ktor/server-requests-and-responses",summary:"学习如何使用 Kotlin 和 Ktor 构建任务管理器应用程序，从而了解路由、请求处理和形参的基础知识。"},{default:r(()=>t[81]||(t[81]=[l("处理请求和生成响应")])),_:1}),t[86]||(t[86]=l(" 教程中，我们添加了手写的")),n(K,null,{default:r(()=>t[82]||(t[82]=[l("扩展")])),_:1}),n(I,null,{default:r(()=>t[83]||(t[83]=[l("函数")])),_:1}),t[87]||(t[87]=l("来将")),n(d,null,{default:r(()=>t[84]||(t[84]=[l("任务")])),_:1}),t[88]||(t[88]=l("转换为 HTML。 "))]),o("li",null,[t[90]||(t[90]=l(" 在")),n(p,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:r(()=>t[89]||(t[89]=[l("创建 RESTful API")])),_:1}),t[91]||(t[91]=l("教程中，我们使用 ")),t[92]||(t[92]=o("code",null,"kotlinx.serialization",-1)),t[93]||(t[93]=l(" 库中的 ")),t[94]||(t[94]=o("code",null,"Serializable",-1)),t[95]||(t[95]=l(" 类型标注了 ")),t[96]||(t[96]=o("code",null,"Task",-1)),t[97]||(t[97]=l(" 类。 "))])]),_:1}),o("p",null,[t[99]||(t[99]=l(" 在这种情况下，我们的目标是创建一个服务器页面，能够将")),n(d,null,{default:r(()=>t[98]||(t[98]=[l("任务")])),_:1}),t[100]||(t[100]=l("的内容写入浏览器。 "))])]),_:1}),n(i,null,{default:r(()=>[t[105]||(t[105]=l(" 打开 ")),n(s,null,{default:r(()=>t[103]||(t[103]=[l("plugins")])),_:1}),t[106]||(t[106]=l(" 包内的 ")),n(s,null,{default:r(()=>t[104]||(t[104]=[l("Templating.kt")])),_:1}),t[107]||(t[107]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[109]||(t[109]=l(" 在 ")),t[110]||(t[110]=o("code",null,"configureTemplating()",-1)),t[111]||(t[111]=l()),n(b,null,{default:r(()=>t[108]||(t[108]=[l("方法")])),_:1}),t[112]||(t[112]=l("中，添加一个 ")),t[113]||(t[113]=o("code",null,"/tasks",-1)),t[114]||(t[114]=l(" 的路由，如下所示： "))]),n(e,{lang:"kotlin",code:`fun Application.configureTemplating() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/thymeleaf/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        get("/html-thymeleaf") {
            call.respond(ThymeleafContent(
                "index",
                mapOf("user" to ThymeleafUser(1, "user1"))
            ))
        }
        // 这是要添加的额外路由
        get("/tasks") {
            val tasks = listOf(
                Task("cleaning", "Clean the house", Priority.Low),
                Task("gardening", "Mow the lawn", Priority.Medium),
                Task("shopping", "Buy the groceries", Priority.High),
                Task("painting", "Paint the fence", Priority.Medium)
            )
            call.respond(ThymeleafContent("all-tasks", mapOf("tasks" to tasks)))
        }
    }
}`}),o("p",null,[t[117]||(t[117]=l(" 当服务器收到 ")),t[118]||(t[118]=o("code",null,"/tasks",-1)),t[119]||(t[119]=l(" 的请求时，它会创建一个")),n(d,null,{default:r(()=>t[115]||(t[115]=[l("任务")])),_:1}),t[120]||(t[120]=l("的 ")),n(f,null,{default:r(()=>t[116]||(t[116]=[l("list")])),_:1}),t[121]||(t[121]=l("，然后将其传递给 Thymeleaf 模板。")),t[122]||(t[122]=o("code",null,"ThymeleafContent",-1)),t[123]||(t[123]=l(" 类型接受我们希望触发的模板名称以及我们希望在页面上可访问的值表。 "))]),o("p",null,[t[128]||(t[128]=l(" 在")),n(b,null,{default:r(()=>t[124]||(t[124]=[l("方法")])),_:1}),t[129]||(t[129]=l("顶部的 Thymeleaf 插件初始化中，你可以看到 Ktor 会在 ")),n(s,null,{default:r(()=>t[125]||(t[125]=[l("templates/thymeleaf")])),_:1}),t[130]||(t[130]=l(" 中查找服务器页面。与静态内容一样，它会期望此文件夹位于 ")),n(s,null,{default:r(()=>t[126]||(t[126]=[l("resources")])),_:1}),t[131]||(t[131]=l(" 目录中。它还将期望使用 ")),n(s,null,{default:r(()=>t[127]||(t[127]=[l(".html")])),_:1}),t[132]||(t[132]=l(" 后缀。 "))]),t[133]||(t[133]=o("p",null,[l(" 在这种情况下，名称 "),o("code",null,"all-tasks"),l(" 将映射到路径 "),o("code",null,"src/main/resources/templates/thymeleaf/all-tasks.html")],-1))]),_:1}),n(i,null,{default:r(()=>[t[136]||(t[136]=l(" 导航到 ")),n(s,null,{default:r(()=>t[134]||(t[134]=[l("src/main/resources/templates/thymeleaf")])),_:1}),t[137]||(t[137]=l(" 并创建一个新的 ")),n(s,null,{default:r(()=>t[135]||(t[135]=[l("all-tasks.html")])),_:1}),t[138]||(t[138]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[140]||(t[140]=l("打开 ")),n(s,null,{default:r(()=>t[139]||(t[139]=[l("all-tasks.html")])),_:1}),t[141]||(t[141]=l(" 文件并添加以下内容： "))]),n(e,{lang:"html",code:`<!DOCTYPE html >
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>All Current Tasks</title>
</head>
<body>
<h1>All Current Tasks</h1>
<table>
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="task: \${tasks}">
        <td th:text="\${task.name}"></td>
        <td th:text="\${task.description}"></td>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[143]||(t[143]=l("在 IntelliJ IDEA 中，点击运行按钮 (")),t[144]||(t[144]=o("img",{src:$,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 运行图标"},null,-1)),t[145]||(t[145]=l(") 来启动")),n(v,null,{default:r(()=>t[142]||(t[142]=[l("应用程序")])),_:1}),t[146]||(t[146]=l("。"))])]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[148]||(t[148]=l(" 在浏览器中导航到 ")),t[149]||(t[149]=o("a",{href:"http://0.0.0.0:8080/tasks"},[o("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")],-1)),t[150]||(t[150]=l("。你应该会看到所有当前")),n(d,null,{default:r(()=>t[147]||(t[147]=[l("任务")])),_:1}),t[151]||(t[151]=l("以表格形式显示，如下所示： "))]),t[161]||(t[161]=o("img",{src:H,alt:"显示任务 list 的 Web 浏览器窗口","border-effect":"rounded",width:"706"},null,-1)),o("p",null,[t[155]||(t[155]=l(" 像所有服务器页面")),n(x,null,{default:r(()=>t[152]||(t[152]=[l("框架")])),_:1}),t[156]||(t[156]=l("一样，Thymeleaf 模板将静态内容（发送到浏览器）与动态内容（在服务器上执行）混合。如果我们选择了替代")),n(x,null,{default:r(()=>t[153]||(t[153]=[l("框架")])),_:1}),t[157]||(t[157]=l("，例如 ")),t[158]||(t[158]=o("a",{href:"https://freemarker.apache.org/"},"Freemarker",-1)),t[159]||(t[159]=l("，我们本可以以稍微不同的语法提供相同的")),n(w,null,{default:r(()=>t[154]||(t[154]=[l("功能")])),_:1}),t[160]||(t[160]=l("。 "))])]),_:1})]),_:1})]),_:1}),n(a,{title:"添加 GET 路由",id:"add-get-routes"},{default:r(()=>[o("p",null,[t[163]||(t[163]=l("既然你熟悉了请求服务器页面的过程，接下来将之前教程中的")),n(w,null,{default:r(()=>t[162]||(t[162]=[l("功能")])),_:1}),t[164]||(t[164]=l("转移到本教程中。"))]),o("p",null,[t[167]||(t[167]=l("因为你包含了 ")),n(k,null,{default:r(()=>t[165]||(t[165]=[l("Static Content")])),_:1}),t[168]||(t[168]=l(" 插件，以下代码将出现在 ")),n(s,null,{default:r(()=>t[166]||(t[166]=[l("Routing.kt")])),_:1}),t[169]||(t[169]=l(" 文件中： "))]),n(e,{lang:"kotlin",code:'            staticResources("/static", "static")'}),t[273]||(t[273]=o("p",null,[l(" 这意味着，例如，对 "),o("code",null,"/static/index.html"),l(" 的请求将从以下路径提供内容： ")],-1)),t[274]||(t[274]=o("code",null,"src/main/resources/static/index.html",-1)),o("p",null,[t[172]||(t[172]=l(" 由于此文件已是生成的")),n(m,null,{default:r(()=>t[170]||(t[170]=[l("项目")])),_:1}),t[173]||(t[173]=l("的一部分，你可以将其用作要添加的")),n(w,null,{default:r(()=>t[171]||(t[171]=[l("功能")])),_:1}),t[174]||(t[174]=l("的主页。 "))]),n(y,{title:"复用索引页"},{default:r(()=>[n(i,null,{default:r(()=>[o("p",null,[t[177]||(t[177]=l(" 打开 ")),n(s,null,{default:r(()=>t[175]||(t[175]=[l("src/main/resources/static")])),_:1}),t[178]||(t[178]=l(" 目录下的 ")),n(s,null,{default:r(()=>t[176]||(t[176]=[l("index.html")])),_:1}),t[179]||(t[179]=l(" 文件，并将其内容替换为以下实现： "))]),n(e,{lang:"html",code:`<html>
<head>
</head>
<body>
<h1>Task Manager Web Application</h1>
<div>
    <h3><a href="/tasks">View all the tasks</a></h3>
</div>
<div>
    <h3>View tasks by priority</h3>
    <form method="get" action="/tasks/byPriority">
        <select name="priority">
            <option name="Low">Low</option>
            <option name="Medium">Medium</option>
            <option name="High">High</option>
            <option name="Vital">Vital</option>
        </select>
        <input type="submit">
    </form>
</div>
<div>
    <h3>View a task by name</h3>
    <form method="get" action="/tasks/byName">
        <input type="text" name="name" width="10">
        <input type="submit">
    </form>
</div>
<div>
    <h3>Create or edit a task</h3>
    <form method="post" action="/tasks">
        <div>
            <label for="name">Name: </label>
            <input type="text" id="name" name="name" size="10">
        </div>
        <div>
            <label for="description">Description: </label>
            <input type="text" id="description"
                   name="description" size="20">
        </div>
        <div>
            <label for="priority">Priority: </label>
            <select id="priority" name="priority">
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
</html>`})]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[181]||(t[181]=l(" 在 IntelliJ IDEA 中，点击重新运行按钮 (")),t[182]||(t[182]=o("img",{src:P,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新运行图标"},null,-1)),t[183]||(t[183]=l(") 以重启")),n(v,null,{default:r(()=>t[180]||(t[180]=[l("应用程序")])),_:1}),t[184]||(t[184]=l("。 "))])]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[186]||(t[186]=l(" 在浏览器中导航到 ")),t[187]||(t[187]=o("a",{href:"http://localhost:8080/static/index.html"},[o("a",{href:"http://localhost:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://localhost:8080/static/index.html")],-1)),t[188]||(t[188]=l("。你应该会看到一个链接按钮和三个 HTML 表单，它们允许你查看、过滤和创建")),n(d,null,{default:r(()=>t[185]||(t[185]=[l("任务")])),_:1}),t[189]||(t[189]=l("： "))]),t[204]||(t[204]=o("img",{src:N,alt:"显示 HTML 表单的 Web 浏览器","border-effect":"rounded",width:"706"},null,-1)),o("p",null,[t[192]||(t[192]=l(" 请注意，当你按 ")),t[193]||(t[193]=o("code",null,"name",-1)),t[194]||(t[194]=l(" 或 ")),t[195]||(t[195]=o("code",null,"priority",-1)),t[196]||(t[196]=l(" 过滤")),n(d,null,{default:r(()=>t[190]||(t[190]=[l("任务")])),_:1}),t[197]||(t[197]=l("时，你是通过 GET 请求提交 HTML 表单。这意味着")),n(g,null,{default:r(()=>t[191]||(t[191]=[l("形参")])),_:1}),t[198]||(t[198]=l("将添加到 URL 后的查询字符串中。 "))]),o("p",null,[t[200]||(t[200]=l(" 例如，如果你搜索 ")),t[201]||(t[201]=o("code",null,"Medium",-1)),t[202]||(t[202]=l(" 优先级的")),n(d,null,{default:r(()=>t[199]||(t[199]=[l("任务")])),_:1}),t[203]||(t[203]=l("，这将是发送到服务器的请求： "))]),t[205]||(t[205]=o("code",null,[o("a",{href:"http://localhost:8080/tasks/byPriority?priority=Medium",target:"_blank",rel:"noreferrer"},"http://localhost:8080/tasks/byPriority?priority=Medium")],-1))]),_:1})]),_:1}),n(y,{title:"复用 TaskRepository",id:"task-repository"},{default:r(()=>[o("p",null,[n(d,null,{default:r(()=>t[206]||(t[206]=[l("任务")])),_:1}),t[208]||(t[208]=l("的")),n(T,null,{default:r(()=>t[207]||(t[207]=[l("版本库")])),_:1}),t[209]||(t[209]=l("可以与上一教程中的保持一致。 "))]),o("p",null,[t[212]||(t[212]=l(" 在 ")),n(s,null,{default:r(()=>t[210]||(t[210]=[l("model")])),_:1}),t[213]||(t[213]=l(" 包内，创建一个新的 ")),n(s,null,{default:r(()=>t[211]||(t[211]=[l("TaskRepository.kt")])),_:1}),t[214]||(t[214]=l(" 文件并添加以下代码： "))]),n(e,{lang:"kotlin",code:`object TaskRepository {
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
}`})]),_:1}),n(y,{title:"复用 GET 请求的路由",id:"reuse-routes"},{default:r(()=>[o("p",null,[t[216]||(t[216]=l(" 现在你已经创建了")),n(T,null,{default:r(()=>t[215]||(t[215]=[l("版本库")])),_:1}),t[217]||(t[217]=l("，你可以实现 GET 请求的路由了。 "))]),n(i,null,{default:r(()=>[t[220]||(t[220]=l(" 导航到 ")),n(s,null,{default:r(()=>t[218]||(t[218]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[221]||(t[221]=l(" 中的 ")),n(s,null,{default:r(()=>t[219]||(t[219]=[l("Templating.kt")])),_:1}),t[222]||(t[222]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[t[256]||(t[256]=o("p",null,[l(" 将当前版本的 "),o("code",null,"configureTemplating()"),l(" 替换为以下实现： ")],-1)),n(e,{lang:"kotlin",code:`fun Application.configureTemplating() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/thymeleaf/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        route("/tasks") {
            get {
                val tasks = TaskRepository.allTasks()
                call.respond(
                    ThymeleafContent("all-tasks", mapOf("tasks" to tasks))
                )
            }
            get("/byName") {
                val name = call.request.queryParameters["name"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = TaskRepository.taskByName(name)
                if (task == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@get
                }
                call.respond(
                    ThymeleafContent("single-task", mapOf("task" to task))
                )
            }
            get("/byPriority") {
                val priorityAsText = call.request.queryParameters["priority"]
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
                    val data = mapOf(
                        "priority" to priority,
                        "tasks" to tasks
                    )
                    call.respond(ThymeleafContent("tasks-by-priority", data))
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
        }
    }
}`}),t[257]||(t[257]=o("p",null," 上述代码可总结如下： ",-1)),n(f,null,{default:r(()=>[o("li",null,[t[226]||(t[226]=l(" 在对 ")),t[227]||(t[227]=o("code",null,"/tasks",-1)),t[228]||(t[228]=l(" 的 GET 请求中，服务器从")),n(T,null,{default:r(()=>t[223]||(t[223]=[l("版本库")])),_:1}),t[229]||(t[229]=l("中检索所有")),n(d,null,{default:r(()=>t[224]||(t[224]=[l("任务")])),_:1}),t[230]||(t[230]=l("，并使用 ")),n(s,null,{default:r(()=>t[225]||(t[225]=[l("all-tasks")])),_:1}),t[231]||(t[231]=l(" 模板生成发送到浏览器的下一个视图。 "))]),o("li",null,[t[235]||(t[235]=l(" 在对 ")),t[236]||(t[236]=o("code",null,"/tasks/byName",-1)),t[237]||(t[237]=l(" 的 GET 请求中，服务器从 ")),t[238]||(t[238]=o("code",null,"queryString",-1)),t[239]||(t[239]=l(" 中检索")),n(g,null,{default:r(()=>t[232]||(t[232]=[l("形参")])),_:1}),t[240]||(t[240]=o("code",null,"taskName",-1)),t[241]||(t[241]=l("，找到匹配的")),n(d,null,{default:r(()=>t[233]||(t[233]=[l("任务")])),_:1}),t[242]||(t[242]=l("，并使用 ")),n(s,null,{default:r(()=>t[234]||(t[234]=[l("single-task")])),_:1}),t[243]||(t[243]=l(" 模板生成发送到浏览器的下一个视图。 "))]),o("li",null,[t[247]||(t[247]=l(" 在对 ")),t[248]||(t[248]=o("code",null,"/tasks/byPriority",-1)),t[249]||(t[249]=l(" 的 GET 请求中，服务器从 ")),t[250]||(t[250]=o("code",null,"queryString",-1)),t[251]||(t[251]=l(" 中检索")),n(g,null,{default:r(()=>t[244]||(t[244]=[l("形参")])),_:1}),t[252]||(t[252]=o("code",null,"priority",-1)),t[253]||(t[253]=l("，找到匹配的")),n(d,null,{default:r(()=>t[245]||(t[245]=[l("任务")])),_:1}),t[254]||(t[254]=l("，并使用 ")),n(s,null,{default:r(()=>t[246]||(t[246]=[l("tasks-by-priority")])),_:1}),t[255]||(t[255]=l(" 模板生成发送到浏览器的下一个视图。 "))])]),_:1}),t[258]||(t[258]=o("p",null,"为了使所有这些都正常工作，你需要添加额外的模板。",-1))]),_:1}),n(i,null,{default:r(()=>[t[261]||(t[261]=l(" 导航到 ")),n(s,null,{default:r(()=>t[259]||(t[259]=[l("src/main/resources/templates/thymeleaf")])),_:1}),t[262]||(t[262]=l(" 并创建一个新的 ")),n(s,null,{default:r(()=>t[260]||(t[260]=[l("single-task.html")])),_:1}),t[263]||(t[263]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[265]||(t[265]=l(" 打开 ")),n(s,null,{default:r(()=>t[264]||(t[264]=[l("single-task.html")])),_:1}),t[266]||(t[266]=l(" 文件并添加以下内容： "))]),n(e,{lang:"html",code:`<!DOCTYPE html >
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>All Current Tasks</title>
</head>
<body>
<h1>The Selected Task</h1>
<table>
    <tbody>
    <tr>
        <th>Name</th>
        <td th:text="\${task.name}"></td>
    </tr>
    <tr>
        <th>Description</th>
        <td th:text="\${task.description}"></td>
    </tr>
    <tr>
        <th>Priority</th>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[268]||(t[268]=l("在同一个文件夹中，创建一个新文件叫 ")),n(s,null,{default:r(()=>t[267]||(t[267]=[l("tasks-by-priority.html")])),_:1}),t[269]||(t[269]=l(" 。 "))])]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[271]||(t[271]=l(" 打开 ")),n(s,null,{default:r(()=>t[270]||(t[270]=[l("tasks-by-priority.html")])),_:1}),t[272]||(t[272]=l(" 文件并添加以下内容： "))]),n(e,{lang:"html",code:`<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Tasks By Priority </title>
</head>
<body>
<h1>Tasks With Priority <span th:text="\${priority}"></span></h1>
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Priority</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="task: \${tasks}">
        <td th:text="\${task.name}"></td>
        <td th:text="\${task.description}"></td>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1})]),_:1})]),_:1}),n(a,{title:"添加对 POST 请求的支持",id:"add-post-requests"},{default:r(()=>[t[322]||(t[322]=o("p",null,[l(" 接下来，你将向 "),o("code",null,"/tasks"),l(" 添加一个 POST 请求处理程序，以执行以下操作： ")],-1)),n(f,null,{default:r(()=>[o("li",null,[t[276]||(t[276]=l("从表单")),n(g,null,{default:r(()=>t[275]||(t[275]=[l("形参")])),_:1}),t[277]||(t[277]=l("中提取信息。"))]),o("li",null,[t[280]||(t[280]=l("使用")),n(T,null,{default:r(()=>t[278]||(t[278]=[l("版本库")])),_:1}),t[281]||(t[281]=l("添加新")),n(d,null,{default:r(()=>t[279]||(t[279]=[l("任务")])),_:1}),t[282]||(t[282]=l("。"))]),o("li",null,[t[285]||(t[285]=l("通过复用 ")),n(k,null,{default:r(()=>t[283]||(t[283]=[l("all-tasks")])),_:1}),t[286]||(t[286]=l(" 模板来显示")),n(d,null,{default:r(()=>t[284]||(t[284]=[l("任务")])),_:1}),t[287]||(t[287]=l("。 "))])]),_:1}),n(y,null,{default:r(()=>[n(i,null,{default:r(()=>[t[290]||(t[290]=l(" 导航到 ")),n(s,null,{default:r(()=>t[288]||(t[288]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[291]||(t[291]=l(" 中的 ")),n(s,null,{default:r(()=>t[289]||(t[289]=[l("Templating.kt")])),_:1}),t[292]||(t[292]=l(" 文件。 "))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[294]||(t[294]=l(" 在 ")),t[295]||(t[295]=o("code",null,"configureTemplating()",-1)),t[296]||(t[296]=l()),n(b,null,{default:r(()=>t[293]||(t[293]=[l("方法")])),_:1}),t[297]||(t[297]=l("中添加以下 ")),t[298]||(t[298]=o("code",null,"post",-1)),t[299]||(t[299]=l(" 请求路由： "))]),n(e,{lang:"kotlin",code:`            post {
                val formContent = call.receiveParameters()
                val params = Triple(
                    formContent["name"] ?: "",
                    formContent["description"] ?: "",
                    formContent["priority"] ?: ""
                )
                if (params.toList().any { it.isEmpty() }) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@post
                }
                try {
                    val priority = Priority.valueOf(params.third)
                    TaskRepository.addTask(
                        Task(
                            params.first,
                            params.second,
                            priority
                        )
                    )
                    val tasks = TaskRepository.allTasks()
                    call.respond(
                        ThymeleafContent("all-tasks", mapOf("tasks" to tasks))
                    )
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }`})]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[301]||(t[301]=l(" 在 IntelliJ IDEA 中，点击重新运行按钮 (")),t[302]||(t[302]=o("img",{src:P,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新运行图标"},null,-1)),t[303]||(t[303]=l(") 以重启")),n(v,null,{default:r(()=>t[300]||(t[300]=[l("应用程序")])),_:1}),t[304]||(t[304]=l("。 "))])]),_:1}),n(i,null,{default:r(()=>t[305]||(t[305]=[l(" 导航到 "),o("a",{href:"http://0.0.0.0:8080/static/index.html"},[o("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1),l("。 ")])),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[308]||(t[308]=l(" 在 ")),n(k,null,{default:r(()=>t[306]||(t[306]=[l("创建或编辑任务")])),_:1}),t[309]||(t[309]=l(" 表单中输入新的")),n(d,null,{default:r(()=>t[307]||(t[307]=[l("任务")])),_:1}),t[310]||(t[310]=l("详细信息。 "))]),t[311]||(t[311]=o("img",{src:O,alt:"显示 HTML 表单的 Web 浏览器","border-effect":"rounded",width:"706"},null,-1))]),_:1}),n(i,null,{default:r(()=>[o("p",null,[t[316]||(t[316]=l("点击 ")),n(k,null,{default:r(()=>t[312]||(t[312]=[l("提交")])),_:1}),t[317]||(t[317]=l(" 按钮以提交表单。 然后你将看到新")),n(d,null,{default:r(()=>t[313]||(t[313]=[l("任务")])),_:1}),t[318]||(t[318]=l("显示在所有")),n(d,null,{default:r(()=>t[314]||(t[314]=[l("任务")])),_:1}),t[319]||(t[319]=l("的 ")),n(f,null,{default:r(()=>t[315]||(t[315]=[l("list")])),_:1}),t[320]||(t[320]=l(" 中： "))]),t[321]||(t[321]=o("img",{src:D,alt:"显示任务 list 的 Web 浏览器","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),n(a,{title:"后续步骤",id:"next-steps"},{default:r(()=>[o("p",null,[t[324]||(t[324]=l(" 恭喜！你现在已经完成了将")),n(d,null,{default:r(()=>t[323]||(t[323]=[l("任务")])),_:1}),t[325]||(t[325]=l("管理器重建为 Web 应用程序，并学习了如何利用 Thymeleaf 模板。"))]),o("p",null,[t[327]||(t[327]=l(" 继续阅读")),n(p,{href:"/ktor/server-create-websocket-application",summary:"学习如何利用 WebSockets 的强大功能来发送和接收内容。"},{default:r(()=>t[326]||(t[326]=[l("下一教程")])),_:1}),t[328]||(t[328]=l("，了解如何使用 Web Sockets。 "))])]),_:1})]),_:1})])}const tt=q(W,[["render",G]]);export{c as __pageData,tt as default};
