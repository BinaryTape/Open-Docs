import{_ as g}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as C,a as T,b as E,c as x,d as H,e as L,f as M,g as S,h as I}from"./chunks/tutorial_routing_and_requests_iteration_6_test_2.SecfwpmD.js";import{_ as k}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as q,C as u,c as K,o as B,G as o,w as i,j as n,a as l}from"./chunks/framework.Bksy39di.js";const W=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-requests-and-responses.md","filePath":"ktor/server-requests-and-responses.md","lastUpdated":1755457140000}'),N={name:"ktor/server-requests-and-responses.md"};function O(D,t,G,J,U,V){const b=u("show-structure"),f=u("Links"),w=u("tldr"),P=u("link-summary"),A=u("card-summary"),R=u("web-summary"),a=u("list"),p=u("chapter"),m=u("control"),y=u("tip"),r=u("Path"),s=u("step"),e=u("code-block"),d=u("procedure"),v=u("topic");return B(),K("div",null,[o(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Ktor 和 Kotlin 处理 HTTP 请求并生成响应",id:"server-requests-and-responses"},{default:i(()=>[o(b,{for:"chapter",depth:"2"}),o(w,null,{default:i(()=>[t[3]||(t[3]=n("p",null,[n("b",null,"代码示例"),l(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-routing-and-requests"}," tutorial-server-routing-and-requests ")],-1)),n("p",null,[t[1]||(t[1]=n("b",null,"使用的插件",-1)),t[2]||(t[2]=l(": ")),o(f,{href:"/ktor/server-routing",summary:"Routing 是一个核心插件，用于处理服务器应用程序中的传入请求。"},{default:i(()=>t[0]||(t[0]=[l("Routing")])),_:1})])]),_:1}),o(P,null,{default:i(()=>t[4]||(t[4]=[l(" 通过构建任务管理器应用程序，学习如何使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。 ")])),_:1}),o(A,null,{default:i(()=>t[5]||(t[5]=[l(" 通过创建任务管理器应用程序，学习 Ktor 中路由和请求的工作原理。 ")])),_:1}),o(R,null,{default:i(()=>t[6]||(t[6]=[l(" 学习使用 Kotlin 和 Ktor 创建的服务进行验证、错误处理和单元测试的基础知识。 ")])),_:1}),t[202]||(t[202]=n("p",null," 在本教程中，你将通过构建任务管理器应用程序，学习如何使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。 ",-1)),t[203]||(t[203]=n("p",null," 完成本教程后，你将了解如何执行以下操作： ",-1)),o(a,{type:"bullet"},{default:i(()=>t[7]||(t[7]=[n("li",null,"处理 GET 和 POST 请求。",-1),n("li",null,"从请求中提取信息。",-1),n("li",null,"转换数据时处理错误。",-1),n("li",null,"使用单元测试来验证路由。",-1)])),_:1}),o(p,{title:"先决条件",id:"prerequisites"},{default:i(()=>[n("p",null,[t[9]||(t[9]=l(" 这是 Ktor 服务器入门指南的第二个教程。你可以独立完成本教程，但我们强烈建议你先完成前一个教程，学习如何")),o(f,{href:"/ktor/server-create-a-new-project",summary:"学习如何使用 Ktor 打开、运行和测试服务器应用程序。"},{default:i(()=>t[8]||(t[8]=[l("创建、打开和运行新的 Ktor 项目")])),_:1}),t[10]||(t[10]=l("。 "))]),t[11]||(t[11]=n("p",null,"了解 HTTP 请求类型、标头和状态码的基本知识也很有用。",-1)),t[12]||(t[12]=n("p",null,[l("我们推荐安装 "),n("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),l("，但你也可以使用其他你选择的 IDE。 ")],-1))]),_:1}),o(p,{title:"任务管理器应用程序",id:"sample-application"},{default:i(()=>[t[14]||(t[14]=n("p",null,"在本教程中，你将逐步构建一个具有以下功能的任务管理器应用程序：",-1)),o(a,{type:"bullet"},{default:i(()=>t[13]||(t[13]=[n("li",null,"以 HTML 表格形式查看所有可用的任务。",-1),n("li",null,"再次以 HTML 形式，按优先级和名称查看任务。",-1),n("li",null,"通过提交 HTML 表单添加其他任务。",-1)])),_:1}),t[15]||(t[15]=n("p",null," 你将尽可能地实现一些基本功能，然后通过七次迭代改进和扩展此功能。这项基本功能将由一个包含某些模型类型、值列表和一个路由的项目组成。 ",-1))]),_:1}),o(p,{title:"显示静态 HTML 内容",id:"display-static-html"},{default:i(()=>[t[43]||(t[43]=n("p",null,"在第一次迭代中，你将为应用程序添加一个新路由，它将返回静态 HTML 内容。",-1)),n("p",null,[t[18]||(t[18]=l("使用 ")),t[19]||(t[19]=n("a",{href:"https://start.ktor.io"},"Ktor 项目生成器",-1)),t[20]||(t[20]=l("，创建一个名为 ")),o(m,null,{default:i(()=>t[16]||(t[16]=[l("ktor-task-app")])),_:1}),t[21]||(t[21]=l(" 的新项目。你可以接受所有默认选项，但可能希望更改 ")),o(m,null,{default:i(()=>t[17]||(t[17]=[l("artifact")])),_:1}),t[22]||(t[22]=l(" 名称。 "))]),o(y,null,{default:i(()=>[t[24]||(t[24]=l(" 关于创建新项目的更多信息，请参见")),o(f,{href:"/ktor/server-create-a-new-project",summary:"学习如何使用 Ktor 打开、运行和测试服务器应用程序。"},{default:i(()=>t[23]||(t[23]=[l("创建、打开和运行新的 Ktor 项目")])),_:1}),t[25]||(t[25]=l("。如果你最近完成了该教程，可以随意重用在那里创建的项目。 "))]),_:1}),o(d,null,{default:i(()=>[o(s,null,{default:i(()=>[t[28]||(t[28]=l("打开 ")),o(r,null,{default:i(()=>t[26]||(t[26]=[l("Routing.kt")])),_:1}),t[29]||(t[29]=l(" 文件，该文件位于 ")),o(r,null,{default:i(()=>t[27]||(t[27]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[30]||(t[30]=l(" 文件夹中。 "))]),_:1}),o(s,null,{default:i(()=>[t[31]||(t[31]=n("p",null,[l("将现有的 "),n("code",null,"Application.configureRouting()"),l(" 函数替换为以下实现：")],-1)),o(e,{lang:"kotlin",code:`                        fun Application.configureRouting() {
                            routing {
                                get("/tasks") {
                                    call.respondText(
                                        contentType = ContentType.parse("text/html"),
                                            text = """
                                        <h3>TODO:</h3>
                                        <ol>
                                            <li>A table of all the tasks</li>
                                            <li>A form to submit new tasks</li>
                                        </ol>
                                        """.trimIndent()
                                    )
                                }
                            }
                        }`}),t[32]||(t[32]=n("p",null,[l("这样，你已为 URL "),n("code",null,"/tasks"),l(" 和 GET 请求类型创建了一个新路由。GET 请求是 HTTP 中最基本的请求类型。当用户在浏览器的地址栏中键入或点击常规 HTML 链接时会触发它。")],-1)),t[33]||(t[33]=n("p",null,[l(" 目前你只返回静态内容。要通知客户端你将发送 HTML，你需要将 HTTP Content Type 标头设置为 "),n("code",null,'"text/html"'),l("。 ")],-1))]),_:1}),o(s,null,{default:i(()=>[t[34]||(t[34]=n("p",null,[l(" 添加以下导入以访问 "),n("code",null,"ContentType"),l(" 对象： ")],-1)),o(e,{lang:"kotlin",code:"                    import io.ktor.http.ContentType"})]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[36]||(t[36]=l("在 IntelliJ IDEA 中，点击 ")),o(r,null,{default:i(()=>t[35]||(t[35]=[l("Application.kt")])),_:1}),t[37]||(t[37]=l(" 中 ")),t[38]||(t[38]=n("code",null,"main()",-1)),t[39]||(t[39]=l(" 函数旁边的运行边槽图标 (")),t[40]||(t[40]=n("img",{alt:"intelliJ IDEA run application icon",src:g,height:"16",width:"16"},null,-1)),t[41]||(t[41]=l(")，以启动应用程序。 "))])]),_:1}),o(s,null,{default:i(()=>t[42]||(t[42]=[n("p",null,[l(" 在浏览器中导航至 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("。你应该会看到待办列表显示： ")],-1),n("img",{src:C,alt:"A browser window displaying a to-do list with two items","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(p,{title:"实现任务模型",id:"implement-a-task-model"},{default:i(()=>[t[81]||(t[81]=n("p",null," 现在你已经创建了项目并设置了基本路由，接下来你将通过以下操作扩展你的应用程序： ",-1)),o(a,{type:"decimal"},{default:i(()=>t[44]||(t[44]=[n("li",null,[n("a",{href:"#create-model-types"},"创建模型类型来表示任务。")],-1),n("li",null,[n("a",{href:"#create-sample-values"},"声明包含示例值的任务列表。")],-1),n("li",null,[n("a",{href:"#add-a-route"},"修改路由和请求处理程序以返回此列表。")],-1),n("li",null,[n("a",{href:"#test"},"使用浏览器测试新特性是否正常工作。")],-1)])),_:1}),o(d,{title:"创建模型类型",id:"create-model-types"},{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[47]||(t[47]=l("在 ")),o(r,null,{default:i(()=>t[45]||(t[45]=[l("src/main/kotlin/com/example")])),_:1}),t[48]||(t[48]=l(" 内部，创建一个名为 ")),o(r,null,{default:i(()=>t[46]||(t[46]=[l("model")])),_:1}),t[49]||(t[49]=l(" 的新子包。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[52]||(t[52]=l("在 ")),o(r,null,{default:i(()=>t[50]||(t[50]=[l("model")])),_:1}),t[53]||(t[53]=l(" 目录中，创建一个新文件 ")),o(r,null,{default:i(()=>t[51]||(t[51]=[l("Task.kt")])),_:1}),t[54]||(t[54]=l(" 。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[56]||(t[56]=l("打开 ")),o(r,null,{default:i(()=>t[55]||(t[55]=[l("Task.kt")])),_:1}),t[57]||(t[57]=l(" 文件，添加以下 ")),t[58]||(t[58]=n("code",null,"enum",-1)),t[59]||(t[59]=l(" 来表示优先级，并添加一个 ")),t[60]||(t[60]=n("code",null,"class",-1)),t[61]||(t[61]=l(" 来表示任务： "))]),o(e,{lang:"kotlin",code:`                    enum class Priority {
                        Low, Medium, High, Vital
                    }
                    data class Task(
                        val name: String,
                        val description: String,
                        val priority: Priority
                    )`})]),_:1}),o(s,null,{default:i(()=>[t[62]||(t[62]=n("p",null,"你将把任务信息发送到客户端的 HTML 表格中，因此也请添加以下扩展函数：",-1)),o(e,{lang:"kotlin",code:`                    fun Task.taskAsRow() = """
                        <tr>
                            <td>$name</td><td>$description</td><td>$priority</td>
                        </tr>
                        """.trimIndent()

                    fun List<Task>.tasksAsTable() = this.joinToString(
                        prefix = "<table rules=\\"all\\">",
                        postfix = "</table>",
                        separator = "
",
                        transform = Task::taskAsRow
                    )`}),t[63]||(t[63]=n("p",null,[n("code",null,"Task.taskAsRow()"),l(" 函数使 "),n("code",null,"Task"),l(" 对象能够渲染为表格行，而 "),n("code",null,"List<Task>.tasksAsTable()"),l(" 允许将任务列表渲染为表格。 ")],-1))]),_:1})]),_:1}),o(d,{title:"创建示例值",id:"create-sample-values"},{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[66]||(t[66]=l("在你的 ")),o(r,null,{default:i(()=>t[64]||(t[64]=[l("model")])),_:1}),t[67]||(t[67]=l(" 目录中，创建一个新文件 ")),o(r,null,{default:i(()=>t[65]||(t[65]=[l("TaskRepository.kt")])),_:1}),t[68]||(t[68]=l(" 。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[70]||(t[70]=l("打开 ")),o(r,null,{default:i(()=>t[69]||(t[69]=[l("TaskRepository.kt")])),_:1}),t[71]||(t[71]=l(" 并添加以下代码来定义一个任务列表： "))]),o(e,{lang:"kotlin",code:`                    val tasks = mutableListOf(
                        Task("cleaning", "Clean the house", Priority.Low),
                        Task("gardening", "Mow the lawn", Priority.Medium),
                        Task("shopping", "Buy the groceries", Priority.High),
                        Task("painting", "Paint the fence", Priority.Medium)
                    )`})]),_:1})]),_:1}),o(d,{title:"添加新路由",id:"add-a-route"},{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[73]||(t[73]=l("打开 ")),o(r,null,{default:i(()=>t[72]||(t[72]=[l("Routing.kt")])),_:1}),t[74]||(t[74]=l(" 文件，并将现有 ")),t[75]||(t[75]=n("code",null,"Application.configureRouting()",-1)),t[76]||(t[76]=l(" 函数替换为以下实现： "))]),o(e,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            get("/tasks") {
                                call.respondText(
                                    contentType = ContentType.parse("text/html"),
                                    text = tasks.tasksAsTable()
                                )
                            }
                        }
                    }`}),t[77]||(t[77]=n("p",null," 现在你不再向客户端返回静态内容，而是提供任务列表。由于列表无法直接通过网络发送，因此必须将其转换为客户端能理解的格式。在此例中，任务被转换为 HTML 表格。 ",-1))]),_:1}),o(s,null,{default:i(()=>[t[78]||(t[78]=n("p",null,"添加所需的导入：",-1)),o(e,{lang:"kotlin",code:"                    import model.*"})]),_:1})]),_:1}),o(d,{title:"测试新特性",id:"test"},{default:i(()=>[o(s,null,{default:i(()=>t[79]||(t[79]=[n("p",null,[l("在 IntelliJ IDEA 中，点击重新运行按钮 ("),n("img",{alt:"intelliJ IDEA rerun button icon",src:k,height:"16",width:"16"}),l(") 以重新启动应用程序。")],-1)])),_:1}),o(s,null,{default:i(()=>t[80]||(t[80]=[n("p",null,[l("在浏览器中导航至 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("。它应该显示一个包含任务的 HTML 表格：")],-1),n("img",{src:T,alt:"A browser window displaying a table with four rows","border-effect":"rounded",width:"706"},null,-1),n("p",null,"如果是这样，恭喜你！应用程序的基本功能已正常工作。",-1)])),_:1})]),_:1})]),_:1}),o(p,{title:"重构模型",id:"refactor-the-model"},{default:i(()=>[t[96]||(t[96]=n("p",null," 在继续扩展应用程序的功能之前，你需要通过将值列表封装在版本库中来重构设计。这将使你能够集中管理数据，从而专注于 Ktor 特有的代码。 ",-1)),o(d,null,{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[83]||(t[83]=l(" 返回 ")),o(r,null,{default:i(()=>t[82]||(t[82]=[l("TaskRepository.kt")])),_:1}),t[84]||(t[84]=l(" 文件，并将现有任务列表替换为以下代码： "))]),o(e,{lang:"kotlin",code:`package model

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
        if(taskByName(task.name) != null) {
            throw IllegalStateException("Cannot duplicate task names!")
        }
        tasks.add(task)
    }
}`}),t[85]||(t[85]=n("p",null," 这实现了一个非常简单的基于列表的任务数据存储。为了示例目的，任务的添加顺序将被保留，但通过抛出异常来禁止重复项。",-1)),t[86]||(t[86]=n("p",null,[l("在后续教程中，你将学习如何通过 "),n("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed 库"),l("实现连接到关系型数据库的版本库。 ")],-1)),t[87]||(t[87]=n("p",null," 目前，你将在路由中使用此版本库。 ",-1))]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[89]||(t[89]=l(" 打开 ")),o(r,null,{default:i(()=>t[88]||(t[88]=[l("Routing.kt")])),_:1}),t[90]||(t[90]=l(" 文件，并将现有 ")),t[91]||(t[91]=n("code",null,"Application.configureRouting()",-1)),t[92]||(t[92]=l(" 函数替换为以下实现： "))]),o(e,{lang:"Kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            get("/tasks") {
                                val tasks = TaskRepository.allTasks()
                                call.respondText(
                                    contentType = ContentType.parse("text/html"),
                                    text = tasks.tasksAsTable()
                                )
                            }
                        }
                    }`}),t[93]||(t[93]=n("p",null," 当请求到来时，版本库用于获取当前的任务列表。然后，构建包含这些任务的 HTTP 响应。 ",-1))]),_:1})]),_:1}),o(d,{title:"测试重构后的代码"},{default:i(()=>[o(s,null,{default:i(()=>t[94]||(t[94]=[n("p",null,[l("在 IntelliJ IDEA 中，点击重新运行按钮 ("),n("img",{alt:"intelliJ IDEA rerun button icon",src:k,height:"16",width:"16"}),l(") 以重新启动应用程序。")],-1)])),_:1}),o(s,null,{default:i(()=>t[95]||(t[95]=[n("p",null,[l(" 在浏览器中导航至 "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("。输出应保持不变，显示 HTML 表格： ")],-1),n("img",{src:T,alt:"A browser window displaying a table with four rows","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(p,{title:"处理参数",id:"work-with-parameters"},{default:i(()=>[t[119]||(t[119]=n("p",null," 在此次迭代中，你将允许用户按优先级查看任务。为此，你的应用程序必须允许对以下 URL 发送 GET 请求： ",-1)),o(a,{type:"bullet"},{default:i(()=>t[97]||(t[97]=[n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Low"},"/tasks/byPriority/Low")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},"/tasks/byPriority/Medium")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/High"},"/tasks/byPriority/High")],-1),n("li",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Vital"},"/tasks/byPriority/Vital")],-1)])),_:1}),t[120]||(t[120]=n("p",null,[l(" 你将添加的路由是 "),n("code",null,"/tasks/byPriority/{priority?}"),l(" ，其中 "),n("code",null,"{priority?}"),l(" 表示你需要在运行时提取的路径参数，问号用于表示参数是可选的。查询参数可以是你喜欢的任何名称，但 "),n("code",null,"priority"),l(" 似乎是显而易见的选择。 ")],-1)),t[121]||(t[121]=n("p",null," 处理请求的过程可总结如下： ",-1)),o(a,{type:"decimal"},{default:i(()=>t[98]||(t[98]=[n("li",null,[l("从请求中提取一个名为 "),n("code",null,"priority"),l(" 的路径参数。")],-1),n("li",null,[l("如果此参数缺失，则返回 "),n("code",null,"400"),l(" 状态（Bad Request）。")],-1),n("li",null,[l("将参数的文本值转换为 "),n("code",null,"Priority"),l(" 枚举值。")],-1),n("li",null,[l("如果失败，则返回状态码为 "),n("code",null,"400"),l(" 的响应。")],-1),n("li",null,"使用版本库查找所有具有指定优先级的任务。",-1),n("li",null,[l("如果没有匹配的任务，则返回 "),n("code",null,"404"),l(" 状态（Not Found）。")],-1),n("li",null,"返回匹配的任务，格式化为 HTML 表格。",-1)])),_:1}),t[122]||(t[122]=n("p",null," 你将首先实现此功能，然后找到检测其是否正常工作的最佳方式。 ",-1)),o(d,{title:"添加新路由"},{default:i(()=>[n("p",null,[t[100]||(t[100]=l("打开 ")),o(r,null,{default:i(()=>t[99]||(t[99]=[l("Routing.kt")])),_:1}),t[101]||(t[101]=l(" 文件，并将以下路由添加到你的代码中，如下所示： "))]),o(e,{lang:"kotlin",code:`                routing {
                    get("/tasks") { ... }

                    //add the following route
                    get("/tasks/byPriority/{priority?}") {
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

                            call.respondText(
                                contentType = ContentType.parse("text/html"),
                                text = tasks.tasksAsTable()
                            )
                        } catch(ex: IllegalArgumentException) {
                            call.respond(HttpStatusCode.BadRequest)
                        }
                    }
                }`}),t[102]||(t[102]=n("p",null,[l(" 如上所述，你已为 URL "),n("code",null,"/tasks/byPriority/{priority?}"),l(" 编写了一个处理程序。符号 "),n("code",null,"priority"),l(" 代表用户添加的路径参数。不幸的是，在服务器上无法保证这对应于 Kotlin 枚举中的四个值之一，因此必须手动检测。 ")],-1)),t[103]||(t[103]=n("p",null,[l(" 如果路径参数缺失，服务器将向客户端返回 "),n("code",null,"400"),l(" 状态码。否则，它会提取参数的值并尝试将其转换为枚举的成员。如果此操作失败，则会抛出异常，服务器会捕获该异常并返回 "),n("code",null,"400"),l(" 状态码。 ")],-1)),t[104]||(t[104]=n("p",null,[l(" 假设转换成功，版本库将用于查找匹配的 "),n("code",null,"Tasks"),l("。如果没有指定优先级的任务，服务器会返回 "),n("code",null,"404"),l(" 状态码，否则会以 HTML 表格的形式发送匹配项。 ")],-1))]),_:1}),o(d,{title:"测试新路由"},{default:i(()=>[t[118]||(t[118]=n("p",null," 你可以通过在浏览器中请求不同的 URL 来测试此功能。 ",-1)),o(s,null,{default:i(()=>t[105]||(t[105]=[n("p",null,[l("在 IntelliJ IDEA 中，点击重新运行按钮 ("),n("img",{alt:"intelliJ IDEA rerun button icon",src:k,height:"16",width:"16"}),l(") 以重新启动应用程序。")],-1)])),_:1}),o(s,null,{default:i(()=>t[106]||(t[106]=[n("p",null,[l(" 要检索所有中等优先级任务，请导航至 "),n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),l("： ")],-1),n("img",{src:E,alt:"A browser window displaying a table with Medium priority tasks","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(s,null,{default:i(()=>t[107]||(t[107]=[n("p",null,[l(" 不幸的是，在出现错误的情况下，你通过浏览器进行的测试是有限的。除非你使用开发者扩展，否则浏览器不会显示不成功响应的详细信息。一个更简单的替代方案是使用专业工具，例如 "),n("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),l("。 ")],-1)])),_:1}),o(s,null,{default:i(()=>t[108]||(t[108]=[n("p",null,[l(" 在 Postman 中，发送针对相同 URL "),n("code",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),l(" 的 GET 请求。 ")],-1),n("img",{src:x,alt:"A GET request in Postman showing the response details","border-effect":"rounded",width:"706"},null,-1),n("p",null," 这显示了服务器的原始输出，以及请求和响应的所有详细信息。 ",-1)])),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[110]||(t[110]=l(" 要检测对紧急任务的请求是否返回 ")),t[111]||(t[111]=n("code",null,"404",-1)),t[112]||(t[112]=l(" 状态码，请向 ")),t[113]||(t[113]=n("code",null,[n("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Vital",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Vital")],-1)),t[114]||(t[114]=l(" 发送新的 GET 请求。然后你将在 ")),o(m,null,{default:i(()=>t[109]||(t[109]=[l("Response")])),_:1}),t[115]||(t[115]=l(" 面板的右上角看到显示的状态码。 "))]),t[116]||(t[116]=n("img",{src:H,alt:"A GET request in Postman showing the status code","border-effect":"rounded",width:"706"},null,-1))]),_:1}),o(s,null,{default:i(()=>t[117]||(t[117]=[n("p",null,[l(" 要验证当指定无效优先级时是否返回 "),n("code",null,"400"),l("，请创建另一个包含无效属性的 GET 请求： ")],-1),n("img",{src:L,alt:"A GET request in Postman with a Bad Request status code","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1})]),_:1}),o(p,{title:"添加单元测试",id:"add-unit-tests"},{default:i(()=>[t[145]||(t[145]=n("p",null," 到目前为止，你已经添加了两个路由——一个用于检索所有任务，另一个用于按优先级检索任务。像 Postman 这样的工具使你能够完全测试这些路由，但它们需要手动探查并在 Ktor 外部运行。 ",-1)),t[146]||(t[146]=n("p",null," 这在原型设计和小型应用程序中是可以接受的。然而，这种方法不适用于大型应用程序，其中可能需要频繁运行数千个测试。一个更好的解决方案是完全自动化你的测试。 ",-1)),n("p",null,[t[124]||(t[124]=l(" Ktor 提供其自己的")),o(f,{href:"/ktor/server-testing",summary:"学习如何使用特殊的测试引擎测试你的服务器应用程序。"},{default:i(()=>t[123]||(t[123]=[l("测试框架")])),_:1}),t[125]||(t[125]=l("来支持路由的自动化验证。接下来，你将为你应用程序的现有功能编写一些测试。 "))]),o(d,null,{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[129]||(t[129]=l(" 在 ")),o(r,null,{default:i(()=>t[126]||(t[126]=[l("src")])),_:1}),t[130]||(t[130]=l(" 中创建一个名为 ")),o(r,null,{default:i(()=>t[127]||(t[127]=[l("test")])),_:1}),t[131]||(t[131]=l(" 的新目录，并创建一个名为 ")),o(r,null,{default:i(()=>t[128]||(t[128]=[l("kotlin")])),_:1}),t[132]||(t[132]=l(" 的子目录。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[135]||(t[135]=l(" 在 ")),o(r,null,{default:i(()=>t[133]||(t[133]=[l("src/test/kotlin")])),_:1}),t[136]||(t[136]=l(" 内部，创建一个新文件 ")),o(r,null,{default:i(()=>t[134]||(t[134]=[l("ApplicationTest.kt")])),_:1}),t[137]||(t[137]=l(" 。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[139]||(t[139]=l("打开 ")),o(r,null,{default:i(()=>t[138]||(t[138]=[l("ApplicationTest.kt")])),_:1}),t[140]||(t[140]=l(" 文件并添加以下代码： "))]),o(e,{lang:"kotlin",code:`                    package com.example

                    import io.ktor.client.request.*
                    import io.ktor.client.statement.*
                    import io.ktor.http.*
                    import io.ktor.server.testing.*
                    import org.junit.Test
                    import kotlin.test.assertContains
                    import kotlin.test.assertEquals


                    class ApplicationTest {
                        @Test
                        fun tasksCanBeFoundByPriority() = testApplication {
                            application {
                                module()
                            }

                            val response = client.get("/tasks/byPriority/Medium")
                            val body = response.bodyAsText()

                            assertEquals(HttpStatusCode.OK, response.status)
                            assertContains(body, "Mow the lawn")
                            assertContains(body, "Paint the fence")
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
                    }`}),t[141]||(t[141]=n("p",null,[l(" 在每个测试中都创建了一个新的 Ktor 实例。这在测试环境中运行，而不是像 Netty 这样的 Web 服务器中运行。项目生成器为你编写的模块会被加载，这反过来会调用路由函数。然后，你可以使用内置的 "),n("code",null,"client"),l(" 对象向应用程序发送请求，并验证返回的响应。 ")],-1)),t[142]||(t[142]=n("p",null," 测试可以在 IDE 内部运行，也可以作为 CI/CD 流水线的一部分运行。 ",-1))]),_:1}),o(s,null,{default:i(()=>[t[144]||(t[144]=n("p",null,[l("要在 IntelliJ IDE 中运行测试，请点击每个测试函数旁边的边槽图标 ("),n("img",{alt:"intelliJ IDEA gutter icon",src:g,width:"16",height:"26"}),l(")。")],-1)),o(y,null,{default:i(()=>t[143]||(t[143]=[l(" 有关如何在 IntelliJ IDE 中运行单元测试的更多详细信息，请参见"),n("a",{href:"https://www.jetbrains.com/help/idea/performing-tests.html"},"IntelliJ IDEA 文档",-1),l("。 ")])),_:1})]),_:1})]),_:1})]),_:1}),o(p,{title:"处理 POST 请求",id:"handle-post-requests"},{default:i(()=>[t[191]||(t[191]=n("p",null," 你可以按照上述过程创建任意数量的 GET 请求附加路由。这些将允许用户使用我们喜欢的任何搜索条件来获取任务。但用户也希望能够创建新任务。 ",-1)),t[192]||(t[192]=n("p",null," 在这种情况下，合适的 HTTP 请求类型是 POST。POST 请求通常在用户完成并提交 HTML 表单时触发。 ",-1)),t[193]||(t[193]=n("p",null,[l(" 与 GET 请求不同，POST 请求具有一个 "),n("code",null,"body"),l("，其中包含表单中所有输入的名称和值。此信息经过编码，以分离不同输入的数据并转义非法字符。你无需担心此过程的详细信息，因为浏览器和 Ktor 将为我们管理它。 ")],-1)),t[194]||(t[194]=n("p",null," 接下来，你将通过以下步骤扩展现有应用程序以允许创建新任务： ",-1)),o(a,{type:"decimal"},{default:i(()=>t[147]||(t[147]=[n("li",null,[n("a",{href:"#create-static-content"},"创建一个包含 HTML 表单的静态内容文件夹。")],-1),n("li",null,[n("a",{href:"#register-folder"},"让 Ktor 知道此文件夹，以便可以提供其内容。")],-1),n("li",null,[n("a",{href:"#add-form-handler"},"添加新的请求处理程序来处理表单提交。")],-1),n("li",null,[n("a",{href:"#test-functionality"},"测试已完成的功能。")],-1)])),_:1}),o(d,{title:"创建静态内容",id:"create-static-content"},{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[150]||(t[150]=l(" 在 ")),o(r,null,{default:i(()=>t[148]||(t[148]=[l("src/main/resources")])),_:1}),t[151]||(t[151]=l(" 内部，创建一个名为 ")),o(r,null,{default:i(()=>t[149]||(t[149]=[l("task-ui")])),_:1}),t[152]||(t[152]=l(" 的新目录。 这将是你静态内容的文件夹。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[155]||(t[155]=l(" 在 ")),o(r,null,{default:i(()=>t[153]||(t[153]=[l("task-ui")])),_:1}),t[156]||(t[156]=l(" 文件夹中，创建一个新文件 ")),o(r,null,{default:i(()=>t[154]||(t[154]=[l("task-form.html")])),_:1}),t[157]||(t[157]=l(" 。 "))])]),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[159]||(t[159]=l("打开新创建的 ")),o(r,null,{default:i(()=>t[158]||(t[158]=[l("task-form.html")])),_:1}),t[160]||(t[160]=l(" 文件并向其中添加以下内容： "))]),o(e,{lang:"html",code:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Adding a new task</title>
</head>
<body>
<h1>Adding a new task</h1>
<form method="post" action="/tasks">
    <div>
        <label for="name">Name: </label>
        <input type="text" id="name" name="name" size="10">
    </div>
    <div>
        <label for="description">Description: </label>
        <input type="text" id="description" name="description" size="20">
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
</body>
</html>`})]),_:1})]),_:1}),o(d,{title:"向 Ktor 注册文件夹",id:"register-folder"},{default:i(()=>[o(s,null,{default:i(()=>[n("p",null,[t[163]||(t[163]=l(" 导航至 ")),o(r,null,{default:i(()=>t[161]||(t[161]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[164]||(t[164]=l(" 中的 ")),o(r,null,{default:i(()=>t[162]||(t[162]=[l("Routing.kt")])),_:1}),t[165]||(t[165]=l(" 文件。 "))])]),_:1}),o(s,null,{default:i(()=>[t[166]||(t[166]=n("p",null,[l(" 将以下对 "),n("code",null,"staticResources()"),l(" 的调用添加到 "),n("code",null,"Application.configureRouting()"),l(" 函数中： ")],-1)),o(e,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        routing {
                            //add the following line
                            staticResources("/task-ui", "task-ui")

                            get("/tasks") { ... }

                            get("/tasks/byPriority/{priority?}") { … }
                        }
                    }`}),t[167]||(t[167]=n("p",null,"这将需要以下导入：",-1)),o(e,{lang:"kotlin",code:"                    import io.ktor.server.http.content.staticResources"})]),_:1}),o(s,null,{default:i(()=>t[168]||(t[168]=[n("p",null,"重新启动应用程序。",-1)])),_:1}),o(s,null,{default:i(()=>t[169]||(t[169]=[n("p",null,[l(" 在浏览器中导航至 "),n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html"},[n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/task-ui/task-form.html")]),l("。HTML 表单应该会显示： ")],-1),n("img",{src:M,alt:"A browser window displaying an HTML form","border-effect":"rounded",width:"706"},null,-1)])),_:1})]),_:1}),o(d,{title:"添加表单处理程序",id:"add-form-handler"},{default:i(()=>[n("p",null,[t[171]||(t[171]=l(" 在 ")),o(r,null,{default:i(()=>t[170]||(t[170]=[l("Routing.kt")])),_:1}),t[172]||(t[172]=l(" 中，将以下附加路由添加到 ")),t[173]||(t[173]=n("code",null,"configureRouting()",-1)),t[174]||(t[174]=l(" 函数中： "))]),o(e,{lang:"kotlin",code:`                fun Application.configureRouting() {
                    routing {
                        //...

                        //add the following route
                        post("/tasks") {
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

                                call.respond(HttpStatusCode.NoContent)
                            } catch (ex: IllegalArgumentException) {
                                call.respond(HttpStatusCode.BadRequest)
                            } catch (ex: IllegalStateException) {
                                call.respond(HttpStatusCode.BadRequest)
                            }
                        }
                    }
                }`}),t[175]||(t[175]=n("p",null,[l(" 如你所见，新路由映射到 POST 请求而不是 GET 请求。Ktor 通过调用 "),n("code",null,"receiveParameters()"),l(" 处理请求体。这会返回请求体中存在的参数集合。 ")],-1)),t[176]||(t[176]=n("p",null,[l(" 共有三个参数，因此你可以将关联的值存储在 "),n("a",{href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/"},"Triple"),l(" 中。如果参数不存在，则存储一个空字符串。 ")],-1)),t[177]||(t[177]=n("p",null,[l(" 如果任何值为空，服务器将返回状态码为 "),n("code",null,"400"),l(" 的响应。然后，它将尝试将第三个参数转换为 "),n("code",null,"Priority"),l("，如果成功，则将信息作为新 "),n("code",null,"Task"),l(" 添加到版本库中。这两个操作都可能导致异常，在这种情况下，再次返回状态码 "),n("code",null,"400"),l("。 ")],-1)),t[178]||(t[178]=n("p",null,[l(" 否则，如果一切成功，服务器将向客户端返回 "),n("code",null,"204"),l(" 状态码（ No Content）。这表示他们的请求已成功，但没有新的信息可以发送给他们。 ")],-1))]),_:1}),o(d,{title:"测试已完成的功能",id:"test-functionality"},{default:i(()=>[o(s,null,{default:i(()=>t[179]||(t[179]=[n("p",null," 重新启动应用程序。 ",-1)])),_:1}),o(s,null,{default:i(()=>t[180]||(t[180]=[n("p",null,[l("在浏览器中导航至 "),n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html"},[n("a",{href:"http://0.0.0.0:8080/task-ui/task-form.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/task-ui/task-form.html")]),l("。 ")],-1)])),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[182]||(t[182]=l(" 使用示例数据填写表单，然后点击 ")),o(m,null,{default:i(()=>t[181]||(t[181]=[l("Submit")])),_:1}),t[183]||(t[183]=l(" 。 "))]),t[184]||(t[184]=n("img",{src:S,alt:"A browser window displaying an HTML form with sample data","border-effect":"rounded",width:"706"},null,-1)),t[185]||(t[185]=n("p",null,"当你提交表单时，不应被重定向到新页面。",-1))]),_:1}),o(s,null,{default:i(()=>t[186]||(t[186]=[n("p",null,[l(" 导航至 URL "),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("。你应该 会看到新任务已添加。 ")],-1),n("img",{src:I,alt:"A browser window displaying an HTML table with tasks","border-effect":"rounded",width:"706"},null,-1)])),_:1}),o(s,null,{default:i(()=>[n("p",null,[t[188]||(t[188]=l(" 为了验证该功能，请将以下测试添加到 ")),o(r,null,{default:i(()=>t[187]||(t[187]=[l("ApplicationTest.kt")])),_:1}),t[189]||(t[189]=l("： "))]),o(e,{lang:"kotlin",code:`                    @Test
                    fun newTasksCanBeAdded() = testApplication {
                        application {
                            module()
                        }

                        val response1 = client.post("/tasks") {
                            header(
                                HttpHeaders.ContentType,
                                ContentType.Application.FormUrlEncoded.toString()
                            )
                            setBody(
                                listOf(
                                    "name" to "swimming",
                                    "description" to "Go to the beach",
                                    "priority" to "Low"
                                ).formUrlEncode()
                            )
                        }

                        assertEquals(HttpStatusCode.NoContent, response1.status)

                        val response2 = client.get("/tasks")
                        assertEquals(HttpStatusCode.OK, response2.status)
                        val body = response2.bodyAsText()

                        assertContains(body, "swimming")
                        assertContains(body, "Go to the beach")
                    }`}),t[190]||(t[190]=n("p",null,[l(" 在此测试中，两个请求发送到服务器：一个 POST 请求创建新任务，一个 GET 请求确认新任务已添加。进行第一个请求时，使用 "),n("code",null,"setBody()"),l(" 方法将内容插入请求体中。测试框架提供了一个作用于集合的 "),n("code",null,"formUrlEncode()"),l(" 扩展方法，它抽象了像浏览器那样格式化数据的过程。 ")],-1))]),_:1})]),_:1})]),_:1}),o(p,{title:"重构路由",id:"refactor-the-routing"},{default:i(()=>[t[195]||(t[195]=n("p",null,[l(" 如果你检查目前的路由，你会发现所有路由都以 "),n("code",null,"/tasks"),l(" 开头。你可以通过将它们放入自己的子路由来消除这种重复： ")],-1)),o(e,{lang:"kotlin",code:`            fun Application.configureRouting() {
                routing {
                    staticResources("/task-ui", "task-ui")

                    route("/tasks") {
                        get {
                            //Code remains the same
                        }

                        get("/byPriority/{priority?}") {
                            //Code remains the same
                        }

                        post {
                            //Code remains the same
                        }
                    }
            }`}),t[196]||(t[196]=n("p",null," 如果你的应用程序达到拥有多个子路由的阶段，那么将每个子路由放入自己的辅助函数中是合适的。但是，目前这不是必需的。 ",-1)),t[197]||(t[197]=n("p",null," 你的路由组织得越好，就越容易扩展它们。例如，你可以添加一个按名称查找任务的路由： ",-1)),o(e,{lang:"kotlin",code:`            fun Application.configureRouting() {
                routing {
                    staticResources("/task-ui", "task-ui")

                    route("/tasks") {
                        get {
                            //Code remains the same
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

                            call.respondText(
                                contentType = ContentType.parse("text/html"),
                                text = listOf(task).tasksAsTable()
                            )
                        }

                        get("/byPriority/{priority?}") {
                            //Code remains the same
                        }

                        post {
                            //Code remains the same
                        }
                    }
                }
            }`})]),_:1}),o(p,{title:"后续步骤",id:"next-steps"},{default:i(()=>[t[201]||(t[201]=n("p",null," 你现在已经实现了基本的路由和请求处理功能。此外，你还了解了验证、错误处理和单元测试。所有这些主题都将在后续教程中扩展。 ",-1)),n("p",null,[t[199]||(t[199]=l(" 继续阅读")),o(f,{href:"/ktor/server-create-restful-apis",summary:"学习如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:i(()=>t[198]||(t[198]=[l("下一个教程")])),_:1}),t[200]||(t[200]=l("，学习如何为你的任务管理器创建一个生成 JSON 文件的 RESTful API。 "))])]),_:1})]),_:1})])}const X=q(N,[["render",O]]);export{W as __pageData,X as default};
