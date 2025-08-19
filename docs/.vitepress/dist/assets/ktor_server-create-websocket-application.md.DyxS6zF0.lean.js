import{_ as w,a as v,b as C,c as x,d as A}from"./chunks/tutorial_server_websockets_iteration_2_test.BE55vRda.js";import{_ as W}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as R}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as P}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as N}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as L,C as u,c as K,o as E,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-create-websocket-application.md","filePath":"ktor/server-create-websocket-application.md","lastUpdated":1755457140000}'),z={name:"ktor/server-create-websocket-application.md"};function I(J,n,D,M,O,B){const f=u("show-structure"),r=u("Links"),g=u("tldr"),T=u("card-summary"),b=u("link-summary"),S=u("web-summary"),k=u("list"),d=u("chapter"),s=u("step"),p=u("control"),i=u("Path"),m=u("procedure"),a=u("code-block"),y=u("topic");return E(),K("div",null,[o(y,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Ktor 在 Kotlin 中创建 WebSocket 应用程序",id:"server-create-websocket-application"},{default:e(()=>[o(f,{for:"chapter",depth:"2"}),o(g,null,{default:e(()=>[n[11]||(n[11]=l("p",null,[l("b",null,"代码示例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-websockets"}," tutorial-server-websockets ")],-1)),l("p",null,[n[4]||(n[4]=l("b",null,"已使用的插件",-1)),n[5]||(n[5]=t(": ")),o(r,{href:"/ktor/server-routing",summary:"路由是用于处理服务器应用程序中传入请求的核心插件。"},{default:e(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[6]||(n[6]=t(",")),o(r,{href:"/ktor/server-static-content",summary:"了解如何提供静态内容，例如样式表、脚本、图像等。"},{default:e(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[7]||(n[7]=t(", ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[8]||(n[8]=t(", ")),o(r,{href:"/ktor/server-websockets",summary:"WebSockets 插件允许您在服务器和客户端之间创建多向通信会话。"},{default:e(()=>n[3]||(n[3]=[t("WebSockets in Ktor Server")])),_:1}),n[9]||(n[9]=t(", ")),n[10]||(n[10]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(T,null,{default:e(()=>n[12]||(n[12]=[t(" 了解如何利用 WebSockets 的强大功能来发送和接收内容。 ")])),_:1}),o(b,null,{default:e(()=>n[13]||(n[13]=[t(" 了解如何利用 WebSockets 的强大功能来发送和接收内容。 ")])),_:1}),o(S,null,{default:e(()=>n[14]||(n[14]=[t(" 了解如何使用 Ktor 在 Kotlin 中构建 WebSocket 应用程序。本教程将引导您完成通过 WebSockets 将后端服务与客户端连接的过程。 ")])),_:1}),l("p",null,[n[16]||(n[16]=t(" 本文将引导您完成使用 Ktor 在 Kotlin 中创建 WebSocket 应用程序的过程。它建立在 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[15]||(n[15]=[t("创建 RESTful API")])),_:1}),n[17]||(n[17]=t(" 教程中涵盖的内容之上。 "))]),n[186]||(n[186]=l("p",null,"本文将教您如何执行以下操作：",-1)),o(k,null,{default:e(()=>n[18]||(n[18]=[l("li",null,"创建使用 JSON 序列化的服务。",-1),l("li",null,"通过 WebSocket 连接发送和接收内容。",-1),l("li",null,"同时向多个客户端广播内容。",-1)])),_:1}),o(d,{title:"先决条件",id:"prerequisites"},{default:e(()=>[l("p",null,[n[21]||(n[21]=t("您可以独立完成本教程，但是，我们建议您完成 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[19]||(n[19]=[t("创建 RESTful API")])),_:1}),n[22]||(n[22]=t(" 教程，以熟悉 ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[20]||(n[20]=[t("Content Negotiation")])),_:1}),n[23]||(n[23]=t(" 和 REST。 "))]),n[24]||(n[24]=l("p",null,[t("我们建议您安装 "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t("，但您也可以选择其他 IDE。")],-1))]),_:1}),o(d,{title:"Hello WebSockets",id:"hello-websockets"},{default:e(()=>[l("p",null,[n[27]||(n[27]=t(" 在本教程中，您将基于 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[25]||(n[25]=[t("创建 RESTful API")])),_:1}),n[28]||(n[28]=t(" 教程中开发的任务管理器服务，添加通过 WebSocket 连接与客户端交换 ")),n[29]||(n[29]=l("code",null,"Task",-1)),n[30]||(n[30]=t(" 对象的能力。为此，您需要添加 ")),o(r,{href:"/ktor/server-websockets",summary:"WebSockets 插件允许您在服务器和客户端之间创建多向通信会话。"},{default:e(()=>n[26]||(n[26]=[t("WebSockets 插件")])),_:1}),n[31]||(n[31]=t("。虽然您可以手动将其添加到现有项目，但为了本教程的演示，我们将从头开始创建一个新项目。 "))]),o(d,{title:"使用插件创建初始项目",id:"create=project"},{default:e(()=>[o(m,null,{default:e(()=>[o(s,null,{default:e(()=>n[32]||(n[32]=[l("p",null,[t(" 导航到 "),l("a",{href:"https://start.ktor.io/"},"Ktor 项目生成器"),t(" 。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[35]||(n[35]=t("在 ")),o(p,null,{default:e(()=>n[33]||(n[33]=[t("项目 artifact")])),_:1}),n[36]||(n[36]=t(" 字段中，输入 ")),o(i,null,{default:e(()=>n[34]||(n[34]=[t("com.example.ktor-websockets-task-app")])),_:1}),n[37]||(n[37]=t(" 作为您的项目 artifact 名称。 ")),n[38]||(n[38]=l("img",{src:w,alt:"在 Ktor 项目生成器中命名项目 artifact","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[40]||(n[40]=t(" 在插件部分中搜索并点击 ")),o(p,null,{default:e(()=>n[39]||(n[39]=[t("添加")])),_:1}),n[41]||(n[41]=t(" 按钮添加以下插件： "))]),o(k,{type:"bullet"},{default:e(()=>n[42]||(n[42]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"WebSockets",-1),l("li",null,"Static Content",-1)])),_:1}),n[43]||(n[43]=l("p",null,[l("img",{src:W,alt:"在 Ktor 项目生成器中添加插件","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[45]||(n[45]=t(" 添加插件后，点击插件部分右上角的 ")),o(p,null,{default:e(()=>n[44]||(n[44]=[t("5 plugins")])),_:1}),n[46]||(n[46]=t(" 按钮，以显示已添加的插件。 "))]),n[47]||(n[47]=l("p",null,[t("您将看到一个列表，其中包含将添加到您项目的所有插件： "),l("img",{src:v,alt:"Ktor 项目生成器中的插件列表","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[49]||(n[49]=t(" 点击 ")),o(p,null,{default:e(()=>n[48]||(n[48]=[t("下载")])),_:1}),n[50]||(n[50]=t(" 按钮以生成并下载您的 Ktor 项目。 "))])]),_:1})]),_:1})]),_:1}),o(d,{title:"添加启动代码",id:"add-starter-code"},{default:e(()=>[n[107]||(n[107]=l("p",null,"下载完成后，在 IntelliJ IDEA 中打开您的项目并按照以下步骤操作：",-1)),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[n[53]||(n[53]=t(" 导航到 ")),o(i,null,{default:e(()=>n[51]||(n[51]=[t("src/main/kotlin")])),_:1}),n[54]||(n[54]=t(" 并创建一个名为 ")),o(i,null,{default:e(()=>n[52]||(n[52]=[t("model")])),_:1}),n[55]||(n[55]=t(" 的新子包。 "))]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[58]||(n[58]=t(" 在 ")),o(i,null,{default:e(()=>n[56]||(n[56]=[t("model")])),_:1}),n[59]||(n[59]=t(" 包内创建一个新文件 ")),o(i,null,{default:e(()=>n[57]||(n[57]=[t("Task.kt")])),_:1}),n[60]||(n[60]=t(" 。"))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[62]||(n[62]=t(" 打开 ")),o(i,null,{default:e(()=>n[61]||(n[61]=[t("Task.kt")])),_:1}),n[63]||(n[63]=t(" 文件，并添加一个 ")),n[64]||(n[64]=l("code",null,"enum",-1)),n[65]||(n[65]=t(" 来表示优先级，以及一个 ")),n[66]||(n[66]=l("code",null,"data class",-1)),n[67]||(n[67]=t(" 来表示任务： "))]),o(a,{lang:"kotlin",code:`package model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),n[73]||(n[73]=l("p",null,[t(" 请注意，"),l("code",null,"Task"),t(" 类使用 "),l("code",null,"kotlinx.serialization"),t(" 库中的 "),l("code",null,"Serializable"),t(" 类型进行注解。这意味着实例可以转换为 JSON 或从 JSON 转换回来，从而允许其内容通过网络传输。 ")],-1)),l("p",null,[n[70]||(n[70]=t(" 由于您包含了 WebSockets 插件，因此在 ")),o(i,null,{default:e(()=>n[68]||(n[68]=[t("src/main/kotlin/com/example/plugins")])),_:1}),n[71]||(n[71]=t(" 中已生成了一个 ")),o(i,null,{default:e(()=>n[69]||(n[69]=[t("Sockets.kt")])),_:1}),n[72]||(n[72]=t(" 文件。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[75]||(n[75]=t(" 打开 ")),o(i,null,{default:e(()=>n[74]||(n[74]=[t("Sockets.kt")])),_:1}),n[76]||(n[76]=t(" 文件，并用以下实现替换现有的 ")),n[77]||(n[77]=l("code",null,"Application.configureSockets()",-1)),n[78]||(n[78]=t(" 函数： "))]),o(a,{lang:"kotlin",code:`                        fun Application.configureSockets() {
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
                        }`}),n[92]||(n[92]=l("p",null," 此代码执行以下步骤： ",-1)),o(k,{type:"decimal"},{default:e(()=>n[79]||(n[79]=[l("li",null,"安装 WebSockets 插件并使用标准设置进行配置。",-1),l("li",null,[t("设置 "),l("code",null,"contentConverter"),t(" 属性，使插件能够通过 "),l("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},"kotlinx.serialization"),t(" 库序列化发送和接收的对象。 ")],-1),l("li",null,[t("路由配置了一个单端点，其相对 URL 为 "),l("code",null,"/tasks"),t("。")],-1),l("li",null,"收到请求后，任务列表通过 WebSocket 连接进行序列化传输。",-1),l("li",null,"所有项发送完毕后，服务器关闭连接。",-1)])),_:1}),l("p",null,[n[82]||(n[82]=t(" 为了演示目的，在发送任务之间引入了一秒的延迟。这 使我们能够观察任务在客户端中逐渐出现。如果没有此延迟， 该示例将与先前文章中开发的 ")),o(r,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。"},{default:e(()=>n[80]||(n[80]=[t("RESTful 服务")])),_:1}),n[83]||(n[83]=t(" 和 ")),o(r,{href:"/ktor/server-create-website",summary:"了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。"},{default:e(()=>n[81]||(n[81]=[t("Web 应用程序")])),_:1}),n[84]||(n[84]=t(" 看起来相同。 "))]),l("p",null,[n[88]||(n[88]=t(" 此迭代的最后一步是为此端点创建一个客户端。由于您包含了 ")),o(r,{href:"/ktor/server-static-content",summary:"了解如何提供静态内容，例如样式表、脚本、图像等。"},{default:e(()=>n[85]||(n[85]=[t("静态内容")])),_:1}),n[89]||(n[89]=t(" 插件，因此在 ")),o(i,null,{default:e(()=>n[86]||(n[86]=[t("src/main/resources/static")])),_:1}),n[90]||(n[90]=t(" 中已生成了一个 ")),o(i,null,{default:e(()=>n[87]||(n[87]=[t("index.html")])),_:1}),n[91]||(n[91]=t(" 文件。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[94]||(n[94]=t(" 打开 ")),o(i,null,{default:e(()=>n[93]||(n[93]=[t("index.html")])),_:1}),n[95]||(n[95]=t(" 文件，并用以下内容替换现有内容： "))]),o(a,{lang:"html",code:`<html>
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
</html>`}),n[96]||(n[96]=l("p",null,[t(" 此页面使用所有现代浏览器中可用的 "),l("a",{href:"https://websockets.spec.whatwg.org//#websocket"},"WebSocket 类型"),t("。我们在 JavaScript 中创建此对象，将端点的 URL 传递给构造函数。随后，我们为 "),l("code",null,"onopen"),t("、"),l("code",null,"onclose"),t(" 和 "),l("code",null,"onmessage"),t(" 事件附加事件处理程序。当触发 "),l("code",null,"onmessage"),t(" 事件时，我们使用 document 对象的方法将一行附加到表格中。 ")],-1))]),_:1}),o(s,null,{default:e(()=>n[97]||(n[97]=[l("p",null,[t("在 IntelliJ IDEA 中，点击运行按钮 ("),l("img",{src:R,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 运行图标"}),t(") 以启动应用程序。")],-1)])),_:1}),o(s,null,{default:e(()=>[n[103]||(n[103]=l("p",null,[t(" 导航到 "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t("。 您应该会看到一个带有按钮的表单和一个空表格： ")],-1)),n[104]||(n[104]=l("img",{src:C,alt:"一个显示带有按钮的 HTML 表单的网页","border-effect":"rounded",width:"706"},null,-1)),l("p",null,[n[100]||(n[100]=t(" 当您点击表单时，任务将从服务器加载，每秒出现一个。因此，表格将逐渐填充。您还可以通过在浏览器的 ")),o(p,null,{default:e(()=>n[98]||(n[98]=[t("开发者工具")])),_:1}),n[101]||(n[101]=t(" 中打开 ")),o(p,null,{default:e(()=>n[99]||(n[99]=[t("JavaScript 控制台")])),_:1}),n[102]||(n[102]=t(" 来查看已记录的消息。 "))]),n[105]||(n[105]=l("img",{src:x,alt:"一个在点击按钮时显示列表项的网页","border-effect":"rounded",width:"706"},null,-1)),n[106]||(n[106]=l("p",null," 通过此操作，您可以看到服务按预期运行。WebSocket 连接已打开，项目发送到客户端，然后连接关闭。底层网络有很多复杂性，但 Ktor 默认处理所有这些。 ",-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(d,{title:"理解 WebSockets",id:"understanding-websockets"},{default:e(()=>[n[109]||(n[109]=l("p",null,[t(" 在进入下一个迭代之前，回顾一些 WebSockets 的基础知识可能会有所帮助。 如果您已经熟悉 WebSockets，可以继续"),l("a",{href:"#improve-design"},"改进服务的设计"),t("。 ")],-1)),n[110]||(n[110]=l("p",null," 在之前的教程中，您的客户端发送 HTTP 请求并接收 HTTP 响应。这工作得很好，并使互联网具有可伸缩性和弹性。 ",-1)),n[111]||(n[111]=l("p",null,"然而，它不适用于以下场景：",-1)),o(k,null,{default:e(()=>n[108]||(n[108]=[l("li",null,"内容随时间增量生成。",-1),l("li",null,"内容根据事件频繁变化。",-1),l("li",null,"客户端需要在内容生成时与服务器交互。",-1),l("li",null,"一个客户端发送的数据需要快速传播给其他客户端。",-1)])),_:1}),n[112]||(n[112]=l("p",null," 这些场景的示例包括股票交易、购买电影和音乐会门票、在线拍卖竞价以及社交媒体中的聊天功能。WebSockets 的开发是为了处理这些情况。 ",-1)),n[113]||(n[113]=l("p",null," WebSocket 连接建立在 TCP 之上，可以持续很长时间。该连接提供“全双工通信”，这意味着客户端可以同时向服务器发送消息并从服务器接收消息。 ",-1)),n[114]||(n[114]=l("p",null,[t(" WebSocket API 定义了四个事件（open、message、close 和 error）和两个动作（send 和 close）。此功能的访问方式在不同的语言和库中可能有所不同。 例如，在 Kotlin 中，您可以将传入消息序列作为 "),l("a",{href:"https://kotlinlang.org/docs/flow.html"},"Flow"),t(" 进行消费。 ")],-1))]),_:1}),o(d,{title:"改进设计",id:"improve-design"},{default:e(()=>[n[132]||(n[132]=l("p",null,"接下来，您将重构现有代码，为更高级的示例腾出空间。",-1)),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[117]||(n[117]=t(" 在 ")),o(i,null,{default:e(()=>n[115]||(n[115]=[t("model")])),_:1}),n[118]||(n[118]=t(" 包中，创建一个新文件 ")),o(i,null,{default:e(()=>n[116]||(n[116]=[t("TaskRepository.kt")])),_:1}),n[119]||(n[119]=t(" 。"))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[121]||(n[121]=t(" 打开 ")),o(i,null,{default:e(()=>n[120]||(n[120]=[t("TaskRepository.kt")])),_:1}),n[122]||(n[122]=t(" 并添加 ")),n[123]||(n[123]=l("code",null,"TaskRepository",-1)),n[124]||(n[124]=t(" 类型： "))]),o(a,{lang:"kotlin",code:`package model

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
}`}),n[125]||(n[125]=l("p",null,"您可能还记得之前教程中的这段代码。",-1))]),_:1}),o(s,null,{default:e(()=>[n[128]||(n[128]=t(" 导航到 ")),o(i,null,{default:e(()=>n[126]||(n[126]=[t("plugins")])),_:1}),n[129]||(n[129]=t(" 包并打开 ")),o(i,null,{default:e(()=>n[127]||(n[127]=[t("Sockets.kt")])),_:1}),n[130]||(n[130]=t(" 文件。 "))]),_:1}),o(s,null,{default:e(()=>[n[131]||(n[131]=l("p",null,[t(" 您现在可以通过利用 "),l("code",null,"TaskRepository"),t(" 来简化 "),l("code",null,"Application.configureSockets()"),t(" 中的路由： ")],-1)),o(a,{lang:"kotlin",code:`                    routing {
                        webSocket("/tasks") {
                            for (task in TaskRepository.allTasks()) {
                                sendSerialized(task)
                                delay(1000)
                            }

                            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                        }
                    }`})]),_:1})]),_:1})]),_:1}),o(d,{title:"通过 WebSockets 发送消息",id:"send-messages"},{default:e(()=>[n[157]||(n[157]=l("p",null," 为了说明 WebSockets 的强大功能，您将创建一个新端点，其中： ",-1)),o(k,null,{default:e(()=>n[133]||(n[133]=[l("li",null," 当客户端启动时，它会收到所有现有任务。 ",-1),l("li",null," 客户端可以创建和发送任务。 ",-1),l("li",null," 当一个客户端发送任务时，其他客户端会收到通知。 ",-1)])),_:1}),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[135]||(n[135]=t(" 在 ")),o(i,null,{default:e(()=>n[134]||(n[134]=[t("Sockets.kt")])),_:1}),n[136]||(n[136]=t(" 文件中，用以下实现替换当前的 ")),n[137]||(n[137]=l("code",null,"configureSockets()",-1)),n[138]||(n[138]=t(" 方法： "))]),o(a,{lang:"kotlin",code:`fun Application.configureSockets() {
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
}`}),n[143]||(n[143]=l("p",null,"通过此代码，您完成了以下操作：",-1)),o(k,null,{default:e(()=>n[139]||(n[139]=[l("li",null," 将发送所有现有任务的功能重构为一个辅助方法。 ",-1),l("li",null,[t(" 在 "),l("code",null,"routing"),t(" 部分，您创建了一个线程安全的 "),l("code",null,"session"),t(" 对象 list，用于跟踪所有客户端。 ")],-1),l("li",null,[t(" 添加了一个相对 URL 为 "),l("code",null,"/task2"),t(" 的新端点。当客户端连接到 此端点时，相应的 "),l("code",null,"session"),t(" 对象会添加到 list 中。服务器 然后进入无限循环，等待接收新任务。收到新任务后，服务器将其存储在 repository 中，并将副本发送给所有客户端，包括当前客户端。 ")],-1)])),_:1}),l("p",null,[n[141]||(n[141]=t(" 为了测试此功能，您将创建一个新页面，扩展 ")),o(i,null,{default:e(()=>n[140]||(n[140]=[t("index.html")])),_:1}),n[142]||(n[142]=t(" 中的功能。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[146]||(n[146]=t(" 在 ")),o(i,null,{default:e(()=>n[144]||(n[144]=[t("src/main/resources/static")])),_:1}),n[147]||(n[147]=t(" 中创建一个名为 ")),o(i,null,{default:e(()=>n[145]||(n[145]=[t("wsClient.html")])),_:1}),n[148]||(n[148]=t(" 的新 HTML 文件。 "))])]),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[150]||(n[150]=t(" 打开 ")),o(i,null,{default:e(()=>n[149]||(n[149]=[t("wsClient.html")])),_:1}),n[151]||(n[151]=t(" 并添加以下内容： "))]),o(a,{lang:"html",code:`<html>
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
    <h3>创建新任务</h3>
    <form onsubmit="return sendTaskToServer()">
        <div>
            <label for="newTaskName">名称: </label>
            <input type="text" id="newTaskName"
                   name="newTaskName" size="10">
        </div>
        <div>
            <label for="newTaskDescription">描述: </label>
            <input type="text" id="newTaskDescription"
                   name="newTaskDescription" size="20">
        </div>
        <div>
            <label for="newTaskPriority">优先级: </label>
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
</html>`}),n[152]||(n[152]=l("p",null,[t(" 此新页面引入了一个 HTML 表单，用户可以在其中输入新任务的信息。 提交表单后，将调用 "),l("code",null,"sendTaskToServer"),t(" 事件处理程序。 它使用表单数据构建一个 JavaScript 对象，并使用 WebSocket 对象的 "),l("code",null,"send"),t(" 方法将其发送到服务器。 ")],-1))]),_:1}),o(s,null,{default:e(()=>n[153]||(n[153]=[l("p",null,[t(" 在 IntelliJ IDEA 中，点击重新运行按钮（"),l("img",{src:P,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 重新运行图标"}),t("）以重新启动应用程序。 ")],-1)])),_:1}),o(s,null,{default:e(()=>[n[155]||(n[155]=l("p",null,"为了测试此功能，请并排打开两个浏览器并按照以下步骤操作。",-1)),o(k,{type:"decimal"},{default:e(()=>n[154]||(n[154]=[l("li",null,[t(" 在浏览器 A 中，导航到 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t(" 。您应该会看到显示默认任务。 ")],-1),l("li",null," 在浏览器 A 中添加一个新任务。新任务应该出现在该页面上的表格中。 ",-1),l("li",null,[t(" 在浏览器 B 中，导航到 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t(" 。您应该会看到默认任务，以及您在浏览器 A 中添加的任何新任务。 ")],-1),l("li",null," 在任一浏览器中添加任务。您应该会看到新项出现在两个页面上。 ",-1)])),_:1}),n[156]||(n[156]=l("img",{src:A,alt:"两个并排的网页，演示通过 HTML 表单创建新任务","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(d,{title:"添加自动化测试",id:"add-automated-tests"},{default:e(()=>[l("p",null,[n[159]||(n[159]=t(" 为了简化您的 QA 流程，使其快速、可复现且无需手动操作，您可以使用 Ktor 内置的 ")),o(r,{href:"/ktor/server-testing",summary:"了解如何使用特殊的测试引擎测试您的服务器应用程序。"},{default:e(()=>n[158]||(n[158]=[t("自动化测试支持")])),_:1}),n[160]||(n[160]=t("。请按照以下步骤操作： "))]),o(m,null,{default:e(()=>[o(s,null,{default:e(()=>[l("p",null,[n[163]||(n[163]=t(" 将以下依赖项添加到 ")),o(i,null,{default:e(()=>n[161]||(n[161]=[t("build.gradle.kts")])),_:1}),n[164]||(n[164]=t(" ，以便您可以在 Ktor Client 中配置 ")),o(r,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要目的：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:e(()=>n[162]||(n[162]=[t("Content Negotiation")])),_:1}),n[165]||(n[165]=t(" 的支持： "))]),o(a,{lang:"kotlin",code:'    testImplementation("io.ktor:ktor-client-content-negotiation-jvm:$ktor_version")'})]),_:1}),o(s,null,{default:e(()=>n[166]||(n[166]=[l("p",null,[l("p",null,[t("在 IntelliJ IDEA 中，点击通知 Gradle 图标 ("),l("img",{alt:"IntelliJ IDEA Gradle 图标",src:N,width:"16",height:"26"}),t(") 在编辑器右侧，以加载 Gradle 更改。")])],-1)])),_:1}),o(s,null,{default:e(()=>[l("p",null,[n[169]||(n[169]=t(" 导航到 ")),o(i,null,{default:e(()=>n[167]||(n[167]=[t("src/test/kotlin/com/example")])),_:1}),n[170]||(n[170]=t(" 并打开 ")),o(i,null,{default:e(()=>n[168]||(n[168]=[t("ApplicationTest.kt")])),_:1}),n[171]||(n[171]=t(" 文件。 "))])]),_:1}),o(s,null,{default:e(()=>[n[180]||(n[180]=l("p",null," 用以下实现替换生成的测试类： ",-1)),o(a,{lang:"kotlin",code:`package com.example

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
}`}),n[181]||(n[181]=l("p",null," 通过此设置，您： ",-1)),o(k,null,{default:e(()=>[n[175]||(n[175]=l("li",null," 将您的服务配置为在测试环境中运行，并启用与生产环境相同的功能，包括路由、JSON 序列化和 WebSockets。 ",-1)),l("li",null,[n[173]||(n[173]=t(" 在 ")),o(r,{href:"/ktor/client-create-and-configure",summary:"了解如何创建和配置 Ktor 客户端。"},{default:e(()=>n[172]||(n[172]=[t("Ktor Client")])),_:1}),n[174]||(n[174]=t(" 中配置 Content Negotiation 和 WebSocket 支持。否则，客户端在使用 WebSocket 连接时将不知道如何（反）序列化 JSON 对象。 "))]),n[176]||(n[176]=l("li",null,[t(" 声明您期望服务返回的 "),l("code",null,"Tasks"),t(" list。 ")],-1)),n[177]||(n[177]=l("li",null,[t(" 使用客户端对象的 "),l("code",null,"websocket"),t(" 方法向 "),l("code",null,"/tasks"),t(" 发送请求。 ")],-1)),n[178]||(n[178]=l("li",null,[t(" 将传入任务作为 "),l("code",null,"flow"),t(" 消费，并将其增量添加到 list 中。 ")],-1)),n[179]||(n[179]=l("li",null,[t(" 收到所有任务后，以常规方式比较 "),l("code",null,"expectedTasks"),t(" 和 "),l("code",null,"actualTasks"),t("。 ")],-1))]),_:1})]),_:1})]),_:1})]),_:1}),o(d,{title:"后续步骤",id:"next-steps"},{default:e(()=>[n[185]||(n[185]=l("p",null," 干得好！通过集成 WebSocket 通信和使用 Ktor Client 进行自动化测试，您显著增强了任务管理器服务。 ",-1)),l("p",null,[n[183]||(n[183]=t(" 继续")),o(r,{href:"/ktor/server-integrate-database",summary:"了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库的过程。"},{default:e(()=>n[182]||(n[182]=[t("下一个教程")])),_:1}),n[184]||(n[184]=t("， 探索您的服务如何使用 Exposed 库与关系数据库无缝交互。 "))])]),_:1})]),_:1})])}const G=L(z,[["render",I]]);export{q as __pageData,G as default};
