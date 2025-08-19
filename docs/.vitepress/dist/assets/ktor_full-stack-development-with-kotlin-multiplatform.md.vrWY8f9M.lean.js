import{_ as M,a as x,b as P,c as I,d as j,e as z,f as K,g as D,h as R,i as O,j as N,k as B,l as H,m as U}from"./chunks/full_stack_development_tutorial_update_task.Cf-lbZdc.js";import{_ as E,C as d,c as L,o as W,G as l,w as i,j as o,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/full-stack-development-with-kotlin-multiplatform.md","filePath":"ktor/full-stack-development-with-kotlin-multiplatform.md","lastUpdated":1755457140000}'),J={name:"ktor/full-stack-development-with-kotlin-multiplatform.md"};function F(q,t,G,V,$,X){const v=d("show-structure"),T=d("web-summary"),w=d("link-summary"),C=d("card-summary"),m=d("Links"),b=d("tldr"),f=d("list"),a=d("chapter"),e=d("step"),u=d("ui-path"),g=d("control"),p=d("procedure"),r=d("Path"),s=d("code-block"),k=d("tab"),y=d("tabs"),A=d("note"),S=d("topic");return W(),L("div",null,[l(S,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Kotlin Multiplatform 构建全栈应用程序",id:"full-stack-development-with-kotlin-multiplatform"},{default:i(()=>[l(v,{for:"chapter, procedure",depth:"2"}),l(T,null,{default:i(()=>t[0]||(t[0]=[n(" 了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。在本教程中，你将了解如何使用 Kotlin Multiplatform 构建 Android、iOS 和桌面应用程序，并使用 Ktor 轻松处理数据。 ")])),_:1}),l(w,null,{default:i(()=>t[1]||(t[1]=[n(" 了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。 ")])),_:1}),l(C,null,{default:i(()=>t[2]||(t[2]=[n(" 了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。 ")])),_:1}),l(b,null,{default:i(()=>[t[14]||(t[14]=o("p",null,[o("b",null,"代码示例"),n(": "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/full-stack-task-manager"}," full-stack-task-manager ")],-1)),o("p",null,[t[5]||(t[5]=o("b",null,"使用的插件",-1)),t[6]||(t[6]=n(": ")),l(m,{href:"/ktor/server-routing",summary:"Routing 是一个用于在服务器应用程序中处理传入请求的核心插件。"},{default:i(()=>t[3]||(t[3]=[n("Routing")])),_:1}),t[7]||(t[7]=n(", ")),t[8]||(t[8]=o("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1)),t[9]||(t[9]=n(", ")),l(m,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件有两个主要用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:i(()=>t[4]||(t[4]=[n("Content Negotiation")])),_:1}),t[10]||(t[10]=n(", ")),t[11]||(t[11]=o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform",-1)),t[12]||(t[12]=n(", ")),t[13]||(t[13]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform",-1))])]),_:1}),t[313]||(t[313]=o("p",null," 在本文中，你将学习如何使用 Kotlin 开发一个全栈应用程序，该应用程序可在 Android、iOS 和桌面平台上运行，并同时利用 Ktor 实现无缝数据处理。 ",-1)),t[314]||(t[314]=o("p",null,"完成本教程后，你将了解如何执行以下操作：",-1)),l(f,null,{default:i(()=>t[15]||(t[15]=[o("li",null,[n("使用 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"}," Kotlin Multiplatform"),n(" 创建全栈应用程序。 ")],-1),o("li",null,"了解使用 IntelliJ IDEA 生成的项目。",-1),o("li",null,[n("创建调用 Ktor 服务的 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n(" 客户端。 ")],-1),o("li",null,"在设计的不同层之间复用共享类型。",-1),o("li",null,"正确包含和配置多平台库。",-1)])),_:1}),o("p",null,[t[19]||(t[19]=n(" 在之前的教程中，我们使用任务管理器示例来 ")),l(m,{href:"/ktor/server-requests-and-responses",summary:"了解如何使用 Kotlin 和 Ktor 通过构建任务管理器应用程序来处理请求、路由和参数的基础知识。"},{default:i(()=>t[16]||(t[16]=[n("处理请求")])),_:1}),t[20]||(t[20]=n("、 ")),l(m,{href:"/ktor/server-create-restful-apis",summary:"了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。"},{default:i(()=>t[17]||(t[17]=[n("创建 RESTful API")])),_:1}),t[21]||(t[21]=n("，并 ")),l(m,{href:"/ktor/server-integrate-database",summary:"了解使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库的过程。"},{default:i(()=>t[18]||(t[18]=[n("与 Exposed 集成数据库")])),_:1}),t[22]||(t[22]=n("。 客户端应用程序保持尽可能精简，以便你能够专注于学习 Ktor 的基础知识。 "))]),t[315]||(t[315]=o("p",null," 你将创建一个面向 Android、iOS 和桌面平台的客户端，并使用 Ktor 服务来获取要显示的数据。在可能的情况下，你将在客户端和服务器之间共享数据类型，从而加快开发速度并减少潜在错误。 ",-1)),l(a,{title:"先决条件",id:"prerequisites"},{default:i(()=>t[23]||(t[23]=[o("p",null,[n(" 与之前的文章一样，你将使用 IntelliJ IDEA 作为 IDE。要安装和配置你的环境，请参阅 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html"}," Kotlin Multiplatform 快速入门 "),n(" 指南。 ")],-1),o("p",null,[n(" 如果这是你首次使用 Compose Multiplatform，我们建议你在开始本教程之前，先完成 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html"}," Compose Multiplatform 入门 "),n(" 教程。为了降低任务的复杂性，你可以专注于一个客户端平台。例如，如果你从未使用过 iOS，那么专注于桌面或 Android 开发可能更明智。 ")],-1)])),_:1}),l(a,{title:"创建新项目",id:"create-project"},{default:i(()=>[t[54]||(t[54]=o("p",null,[n(" 请使用 IntelliJ IDEA 中的 Kotlin Multiplatform 项目向导，而不是 Ktor 项目生成器。 它将创建一个基本的多平台项目，你可以通过客户端和服务对其进行扩展。客户端可以使用原生 UI 库，例如 SwiftUI，但在本教程中，你将使用 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n(" 为所有平台创建共享 UI。 ")],-1)),l(p,{id:"generate-project"},{default:i(()=>[l(e,null,{default:i(()=>t[24]||(t[24]=[n(" 启动 IntelliJ IDEA。 ")])),_:1}),l(e,null,{default:i(()=>[t[26]||(t[26]=n(" 在 IntelliJ IDEA 中，选择 ")),l(u,null,{default:i(()=>t[25]||(t[25]=[n("File | New | Project")])),_:1}),t[27]||(t[27]=n(" 。 "))]),_:1}),l(e,null,{default:i(()=>[t[29]||(t[29]=n(" 在左侧面板中，选择 ")),l(u,null,{default:i(()=>t[28]||(t[28]=[n("Kotlin Multiplatform")])),_:1}),t[30]||(t[30]=n(" 。 "))]),_:1}),l(e,null,{default:i(()=>[t[36]||(t[36]=n(" 在 ")),l(u,null,{default:i(()=>t[31]||(t[31]=[n("New Project")])),_:1}),t[37]||(t[37]=n(" 窗口中指定以下字段： ")),l(f,null,{default:i(()=>[o("li",null,[l(u,null,{default:i(()=>t[32]||(t[32]=[n("Name")])),_:1}),t[33]||(t[33]=n(" : full-stack-task-manager "))]),o("li",null,[l(u,null,{default:i(()=>t[34]||(t[34]=[n("Group")])),_:1}),t[35]||(t[35]=n(" : com.example.ktor "))])]),_:1})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[41]||(t[41]=n(" 选择 ")),l(u,null,{default:i(()=>t[38]||(t[38]=[n("Android")])),_:1}),t[42]||(t[42]=n(" 、 ")),l(u,null,{default:i(()=>t[39]||(t[39]=[n("Desktop")])),_:1}),t[43]||(t[43]=n(" 和 ")),l(u,null,{default:i(()=>t[40]||(t[40]=[n("Server")])),_:1}),t[44]||(t[44]=n(" 作为目标平台。 "))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[47]||(t[47]=n(" 如果你使用的是 Mac，请同时选择 ")),l(u,null,{default:i(()=>t[45]||(t[45]=[n("iOS")])),_:1}),t[48]||(t[48]=n(" 。确保选中 ")),l(u,null,{default:i(()=>t[46]||(t[46]=[n("Share UI")])),_:1}),t[49]||(t[49]=n(" 选项。 ")),t[50]||(t[50]=o("img",{style:{},src:M,alt:"Kotlin Multiplatform 向导设置",width:"706","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[52]||(t[52]=n(" 单击 ")),l(g,null,{default:i(()=>t[51]||(t[51]=[n("Create")])),_:1}),t[53]||(t[53]=n(" 按钮，等待 IDE 生成并导入项目。 "))])]),_:1})]),_:1})]),_:1}),l(a,{title:"运行服务",id:"run-service"},{default:i(()=>[l(p,{id:"run-service-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[58]||(t[58]=n(" 在 ")),l(u,null,{default:i(()=>t[55]||(t[55]=[n("Project")])),_:1}),t[59]||(t[59]=n(" 视图中，导航到 ")),l(r,null,{default:i(()=>t[56]||(t[56]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[60]||(t[60]=n(" 并打开 ")),l(r,null,{default:i(()=>t[57]||(t[57]=[n("Application.kt")])),_:1}),t[61]||(t[61]=n(" 文件。 "))]),_:1}),l(e,null,{default:i(()=>[t[67]||(t[67]=n(" 单击 ")),l(u,null,{default:i(()=>t[62]||(t[62]=[n("Run")])),_:1}),t[68]||(t[68]=n(" 按钮 (")),t[69]||(t[69]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 运行图标"},null,-1)),t[70]||(t[70]=n(") ，启动 ")),t[71]||(t[71]=o("code",null,"main()",-1)),t[72]||(t[72]=n(" 函数旁边的应用程序。 ")),o("p",null,[l(u,null,{default:i(()=>t[63]||(t[63]=[n("Run")])),_:1}),t[64]||(t[64]=n(" 工具窗口中将打开一个新选项卡，其日志以消息“Responding at ")),t[65]||(t[65]=o("a",{href:"http://0.0.0.0:8080",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080",-1)),t[66]||(t[66]=n("”结尾。 "))])]),_:1}),l(e,null,{default:i(()=>t[73]||(t[73]=[o("p",null,[n(" 导航到 "),o("a",{href:"http://0.0.0.0:8080/"},[o("a",{href:"http://0.0.0.0:8080/",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/")]),n(" 以打开应用程序。 你将看到浏览器中显示来自 Ktor 的消息。 "),o("img",{src:P,alt:"Ktor 服务器浏览器响应",width:"706","border-effect":"rounded",style:{}})],-1)])),_:1})]),_:1})]),_:1}),l(a,{title:"检查项目",id:"examine-project"},{default:i(()=>[o("p",null,[t[77]||(t[77]=n(" 项目的 ")),l(r,null,{default:i(()=>t[74]||(t[74]=[n("server")])),_:1}),t[78]||(t[78]=n(" 文件夹是三个 Kotlin 模块之一。另外两个是 ")),l(r,null,{default:i(()=>t[75]||(t[75]=[n("shared")])),_:1}),t[79]||(t[79]=n(" 和 ")),l(r,null,{default:i(()=>t[76]||(t[76]=[n("composeApp")])),_:1}),t[80]||(t[80]=n(" 。 "))]),o("p",null,[l(r,null,{default:i(()=>t[81]||(t[81]=[n("server")])),_:1}),t[82]||(t[82]=n(" 模块的结构与 ")),t[83]||(t[83]=o("a",{href:"https://start.ktor.io/"},"Ktor 项目生成器",-1)),t[84]||(t[84]=n("生成的结构非常相似。 你有一个专门的构建文件来声明插件和依赖项，以及一个包含构建和启动 Ktor 服务代码的源代码集： "))]),t[130]||(t[130]=o("img",{src:I,alt:"Kotlin Multiplatform 项目中 server 文件夹的内容",width:"300","border-effect":"line"},null,-1)),o("p",null,[t[86]||(t[86]=n(" 如果你查看 ")),l(r,null,{default:i(()=>t[85]||(t[85]=[n("Application.kt")])),_:1}),t[87]||(t[87]=n(" 文件中的路由指令，你将看到对 ")),t[88]||(t[88]=o("code",null,"greet()",-1)),t[89]||(t[89]=n(" 函数的调用： "))]),l(s,{lang:"kotlin",code:`            fun Application.module() {
                routing {
                    get("/") {
                        call.respondText("Ktor: \${Greeting().greet()}")
                    }
                }
            }`}),o("p",null,[t[91]||(t[91]=n(" 这将创建 ")),t[92]||(t[92]=o("code",null,"Greeting",-1)),t[93]||(t[93]=n(" 类型的一个实例，并调用其 ")),t[94]||(t[94]=o("code",null,"greet()",-1)),t[95]||(t[95]=n(" 方法。 ")),t[96]||(t[96]=o("code",null,"Greeting",-1)),t[97]||(t[97]=n(" 类在 ")),l(r,null,{default:i(()=>t[90]||(t[90]=[n("shared")])),_:1}),t[98]||(t[98]=n(" 模块中定义： ")),t[99]||(t[99]=o("img",{src:j,alt:"在 IntelliJ IDEA 中打开的 Greeting.kt 和 Platform.kt",width:"706","border-effect":"line",style:{}},null,-1))]),o("p",null,[l(r,null,{default:i(()=>t[100]||(t[100]=[n("shared")])),_:1}),t[101]||(t[101]=n(" 模块包含将在不同目标平台之间使用的代码。 "))]),o("p",null,[l(r,null,{default:i(()=>t[102]||(t[102]=[n("shared")])),_:1}),t[104]||(t[104]=n(" 模块集中的 ")),l(r,null,{default:i(()=>t[103]||(t[103]=[n("commonMain")])),_:1}),t[105]||(t[105]=n(" 源代码集包含将在所有平台上使用的类型。 如你所见，")),t[106]||(t[106]=o("code",null,"Greeting",-1)),t[107]||(t[107]=n(" 类型就是在此处定义的。 这也是你放置要在服务器和所有不同客户端平台之间共享的公共代码的地方。 "))]),o("p",null,[l(r,null,{default:i(()=>t[108]||(t[108]=[n("shared")])),_:1}),t[110]||(t[110]=n(" 模块还包含你希望提供客户端的每个平台的源代码集。这是因为 ")),l(r,null,{default:i(()=>t[109]||(t[109]=[n("commonMain")])),_:1}),t[111]||(t[111]=n(" 中声明的类型可能需要因目标平台而异的功能。对于 ")),t[112]||(t[112]=o("code",null,"Greeting",-1)),t[113]||(t[113]=n(" 类型，你希望使用平台特有的 API 获取当前平台的名称。 这通过 ")),t[114]||(t[114]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html"},"预期 和实际声明",-1)),t[115]||(t[115]=n(" 实现。 "))]),o("p",null,[t[118]||(t[118]=n(" 在 ")),l(r,null,{default:i(()=>t[116]||(t[116]=[n("shared")])),_:1}),t[119]||(t[119]=n(" 模块的 ")),l(r,null,{default:i(()=>t[117]||(t[117]=[n("commonMain")])),_:1}),t[120]||(t[120]=n(" 源代码集中，你使用 ")),t[121]||(t[121]=o("code",null,"expect",-1)),t[122]||(t[122]=n(" 关键字声明一个 ")),t[123]||(t[123]=o("code",null,"getPlatform()",-1)),t[124]||(t[124]=n(" 函数： "))]),l(y,null,{default:i(()=>[l(k,{title:"commonMain/Platform.kt",id:"commonMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform`})]),_:1})]),_:1}),t[131]||(t[131]=o("p",null,[n("然后，每个目标平台 都必须提供 "),o("code",null,"getPlatform()"),n(" 函数的 "),o("code",null,"actual"),n(" 声明，如下所示： ")],-1)),l(y,null,{default:i(()=>[l(k,{title:"Platform.ios.kt",id:"iosMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import platform.UIKit.UIDevice

class IOSPlatform: Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}

actual fun getPlatform(): Platform = IOSPlatform()`})]),_:1}),l(k,{title:"Platform.android.kt",id:"androidMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android \${Build.VERSION.SDK_INT}"
}

actual fun getPlatform(): Platform = AndroidPlatform()`})]),_:1}),l(k,{title:"Platform.jvm.kt",id:"jvmMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class JVMPlatform: Platform {
    override val name: String = "Java \${System.getProperty("java.version")}"
}

actual fun getPlatform(): Platform = JVMPlatform()`})]),_:1}),l(k,{title:"Platform.wasmJs.kt",id:"wasmJsMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class WasmPlatform : Platform {
    override val name: String = "Web with Kotlin/Wasm"
}

actual fun getPlatform(): Platform = WasmPlatform()`})]),_:1})]),_:1}),o("p",null,[t[126]||(t[126]=n(" 项目中还有一个额外的模块，即 ")),l(r,null,{default:i(()=>t[125]||(t[125]=[n("composeApp")])),_:1}),t[127]||(t[127]=n(" 模块。 它包含 Android、iOS、桌面和 Web 客户端应用的代码。 这些应用目前未链接到 Ktor 服务，但它们确实使用了共享的 ")),t[128]||(t[128]=o("code",null,"Greeting",-1)),t[129]||(t[129]=n(" 类。 "))])]),_:1}),l(a,{title:"运行客户端应用程序",id:"run-client-app"},{default:i(()=>[t[146]||(t[146]=o("p",null," 你可以通过执行目标平台的运行配置来运行客户端应用程序。要在 iOS 模拟器上运行应用程序，请按照以下步骤操作： ",-1)),l(p,{id:"run-ios-app-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[133]||(t[133]=n(" 在 IntelliJ IDEA 中，选择 ")),l(r,null,{default:i(()=>t[132]||(t[132]=[n("iosApp")])),_:1}),t[134]||(t[134]=n(" 运行配置和模拟设备。 ")),t[135]||(t[135]=o("img",{src:z,alt:"运行与调试窗口",width:"400","border-effect":"line",style:{}},null,-1))]),_:1}),l(e,null,{default:i(()=>[t[137]||(t[137]=n(" 单击 ")),l(u,null,{default:i(()=>t[136]||(t[136]=[n("Run")])),_:1}),t[138]||(t[138]=n(" 按钮 (")),t[139]||(t[139]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 运行图标"},null,-1)),t[140]||(t[140]=n(") 以运行配置。 "))]),_:1}),l(e,null,{default:i(()=>[t[144]||(t[144]=o("p",null,[n(" 当你运行 iOS 应用时，它在后台使用 Xcode 构建并在 iOS 模拟器中启动。 该应用显示一个按钮，点击时切换图像。 "),o("img",{style:{},src:K,alt:"在 iOS 模拟器中运行应用",width:"300","border-effect":"rounded"})],-1)),o("p",null,[t[142]||(t[142]=n(" 首次按下按钮时，当前平台的详细信息将添加到其文本中。实现此功能的代码位于 ")),l(r,null,{default:i(()=>t[141]||(t[141]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt")])),_:1}),t[143]||(t[143]=n(" 中： "))]),l(s,{lang:"kotlin",code:`            @Composable
            fun App() {
                MaterialTheme {
                    var greetingText by remember { mutableStateOf("Hello World!") }
                    var showImage by remember { mutableStateOf(false) }
                    Column(
                        Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Button(onClick = {
                            greetingText = "Compose: \${Greeting().greet()}"
                            showImage = !showImage
                        }) {
                            Text(greetingText)
                        }
                        AnimatedVisibility(showImage) {
                            Image(
                                painterResource(Res.drawable.compose_multiplatform),
                                null
                            )
                        }
                    }
                }
            }`}),t[145]||(t[145]=o("p",null,[n(" 这是一个可组合函数，你将在本文后面进行修改。目前重要的是，它显示了一个 UI 并使用了共享的 "),o("code",null,"Greeting"),n(" 类型，而 "),o("code",null,"Greeting"),n(" 类型又使用了实现通用 "),o("code",null,"Platform"),n(" 接口的平台特有类。 ")],-1))]),_:1})]),_:1}),t[147]||(t[147]=o("p",null," 现在你了解了生成的项目结构，可以逐步添加任务管理器功能了。 ",-1))]),_:1}),l(a,{title:"添加模型类型",id:"add-model-types"},{default:i(()=>[t[177]||(t[177]=o("p",null," 首先，添加模型类型，并确保客户端和服务器都可以访问它们。 ",-1)),l(p,{id:"add-model-types-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[150]||(t[150]=n(" 导航到 ")),l(r,null,{default:i(()=>t[148]||(t[148]=[n("shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[151]||(t[151]=n(" 并创建一个名为 ")),l(r,null,{default:i(()=>t[149]||(t[149]=[n("model")])),_:1}),t[152]||(t[152]=n(" 的新包。 "))]),_:1}),l(e,null,{default:i(()=>[t[154]||(t[154]=n(" 在新包中，创建一个名为 ")),l(r,null,{default:i(()=>t[153]||(t[153]=[n("Task.kt")])),_:1}),t[155]||(t[155]=n(" 的新文件。 "))]),_:1}),l(e,null,{default:i(()=>[t[156]||(t[156]=o("p",null,[n(" 添加一个 "),o("code",null,"enum"),n(" 来表示优先级，并添加一个 "),o("code",null,"class"),n(" 来表示任务。 "),o("code",null,"Task"),n(" 类使用 "),o("code",null,"kotlinx.serialization"),n(" 库中的 "),o("code",null,"Serializable"),n(" 类型进行注解： ")],-1)),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[157]||(t[157]=o("p",null,[n(" 你会注意到导入和注解都无法编译。这是因为项目尚未依赖 "),o("code",null,"kotlinx.serialization"),n(" 库。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[159]||(t[159]=n(" 导航到 ")),l(r,null,{default:i(()=>t[158]||(t[158]=[n("shared/build.gradle.kts")])),_:1}),t[160]||(t[160]=n(" 并添加序列化插件： "))]),l(s,{lang:"kotlin",code:`plugins {
    //...
    kotlin("plugin.serialization") version "2.1.21"
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[162]||(t[162]=n(" 在同一个文件中，向 ")),l(r,null,{default:i(()=>t[161]||(t[161]=[n("commonMain")])),_:1}),t[163]||(t[163]=n(" 源代码集添加一个新的依赖项： "))]),l(s,{lang:"kotlin",code:`    sourceSets {
        commonMain.dependencies {
            // put your Multiplatform dependencies here
            implementation(libs.kotlinx.serialization.json)
        }
        //...
    }`})]),_:1}),l(e,null,{default:i(()=>[t[165]||(t[165]=n(" 导航到 ")),l(r,null,{default:i(()=>t[164]||(t[164]=[n("gradle/libs.versions.toml")])),_:1}),t[166]||(t[166]=n(" 并定义以下内容： ")),l(s,{lang:"toml",code:`[versions]
kotlinxSerializationJson = "1.8.1"

[libraries]
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinxSerializationJson" }`})]),_:1}),l(e,null,{default:i(()=>[t[169]||(t[169]=n(" 在 IntelliJ IDEA 中，选择 ")),l(u,null,{default:i(()=>t[167]||(t[167]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[170]||(t[170]=n(" 以应用更新。Gradle 导入完成后，你将发现你的 ")),l(r,null,{default:i(()=>t[168]||(t[168]=[n("Task.kt")])),_:1}),t[171]||(t[171]=n(" 文件成功编译。 "))]),_:1})]),_:1}),t[178]||(t[178]=o("p",null,[n(" 请注意，即使不包含序列化插件，代码也能够编译，但是，在网络上序列化 "),o("code",null,"Task"),n(" 对象所需的类型将不会生成。这将导致在尝试调用服务时出现运行时错误。 ")],-1)),o("p",null,[t[174]||(t[174]=n(" 将序列化插件放在另一个模块（例如 ")),l(r,null,{default:i(()=>t[172]||(t[172]=[n("server")])),_:1}),t[175]||(t[175]=n(" 或 ")),l(r,null,{default:i(()=>t[173]||(t[173]=[n("composeApp")])),_:1}),t[176]||(t[176]=n(" ）不会在构建时导致错误。但同样，序列化所需的额外类型也不会生成，从而导致运行时错误。 "))])]),_:1}),l(a,{title:"创建服务器",id:"create-server"},{default:i(()=>[t[212]||(t[212]=o("p",null," 下一阶段是为我们的任务管理器创建服务器实现。 ",-1)),l(p,{id:"create-server-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[181]||(t[181]=n(" 导航到 ")),l(r,null,{default:i(()=>t[179]||(t[179]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[182]||(t[182]=n(" 文件夹，并创建一个名为 ")),l(r,null,{default:i(()=>t[180]||(t[180]=[n("model")])),_:1}),t[183]||(t[183]=n(" 的子包。 "))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[185]||(t[185]=n(" 在此包中，创建一个新的 ")),l(r,null,{default:i(()=>t[184]||(t[184]=[n("TaskRepository.kt")])),_:1}),t[186]||(t[186]=n(" 文件，并为我们的版本库添加以下接口： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

interface TaskRepository {
    fun allTasks(): List<Task>
    fun tasksByPriority(priority: Priority): List<Task>
    fun taskByName(name: String): Task?
    fun addOrUpdateTask(task: Task)
    fun removeTask(name: String): Boolean
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[188]||(t[188]=n(" 在同一个包中，创建一个名为 ")),l(r,null,{default:i(()=>t[187]||(t[187]=[n("InMemoryTaskRepository.kt")])),_:1}),t[189]||(t[189]=n(" 的新文件，其中包含以下类： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

class InMemoryTaskRepository : TaskRepository {
    private var tasks = listOf(
        Task("Cleaning", "Clean the house", Priority.Low),
        Task("Gardening", "Mow the lawn", Priority.Medium),
        Task("Shopping", "Buy the groceries", Priority.High),
        Task("Painting", "Paint the fence", Priority.Low),
        Task("Cooking", "Cook the dinner", Priority.Medium),
        Task("Relaxing", "Take a walk", Priority.High),
        Task("Exercising", "Go to the gym", Priority.Low),
        Task("Learning", "Read a book", Priority.Medium),
        Task("Snoozing", "Go for a nap", Priority.High),
        Task("Socializing", "Go to a party", Priority.High)
    )

    override fun allTasks(): List<Task> = tasks

    override fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    override fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    override fun addOrUpdateTask(task: Task) {
        var notFound = true

        tasks = tasks.map {
            if (it.name == task.name) {
                notFound = false
                task
            } else {
                it
            }
        }
        if (notFound) {
            tasks = tasks.plus(task)
        }
    }

    override fun removeTask(name: String): Boolean {
        val oldTasks = tasks
        tasks = tasks.filterNot { it.name == name }
        return oldTasks.size > tasks.size
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[191]||(t[191]=n(" 导航到 ")),l(r,null,{default:i(()=>t[190]||(t[190]=[n("server/src/main/kotlin/.../Application.kt")])),_:1}),t[192]||(t[192]=n(" 并用以下实现替换现有代码： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.model.InMemoryTaskRepository
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = SERVER_PORT, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Delete)
        // For ease of demonstration we allow any connections.
        // Don't do this in production.
        anyHost()
    }
    val repository = InMemoryTaskRepository()

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
                    repository.addOrUpdateTask(task)
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
}`}),t[196]||(t[196]=o("p",null,[n(" 此实现与之前教程中的实现非常相似，不同之处在于现在为了简化起见，你已将所有路由代码放置在 "),o("code",null,"Application.module()"),n(" 函数中。 ")],-1)),o("p",null,[t[194]||(t[194]=n(" 一旦你输入此代码并添加了导入，你将发现多个编译错误，因为代码使用了多个 Ktor 插件，这些插件需要作为依赖项包含在内， 其中包括用于与 Web 客户端交互的 ")),l(m,{href:"/ktor/server-cors",summary:"Required dependencies: io.ktor:%artifact_name% Code example: full-stack-task-manager Native server support: ✅"},{default:i(()=>t[193]||(t[193]=[n("CORS")])),_:1}),t[195]||(t[195]=n(" 插件。 "))])]),_:1}),l(e,null,{default:i(()=>[t[198]||(t[198]=n(" 打开 ")),l(r,null,{default:i(()=>t[197]||(t[197]=[n("gradle/libs.versions.toml")])),_:1}),t[199]||(t[199]=n(" 文件并定义以下库： ")),l(s,{lang:"toml",code:`[libraries]
ktor-serialization-kotlinx-json-jvm = { module = "io.ktor:ktor-serialization-kotlinx-json-jvm", version.ref = "ktor" }
ktor-server-content-negotiation-jvm = { module = "io.ktor:ktor-server-content-negotiation-jvm", version.ref = "ktor" }
ktor-server-cors-jvm = { module = "io.ktor:ktor-server-cors-jvm", version.ref = "ktor" }`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[201]||(t[201]=n(" 打开服务器模块构建文件（ ")),l(r,null,{default:i(()=>t[200]||(t[200]=[n("server/build.gradle.kts")])),_:1}),t[202]||(t[202]=n(" ）并添加以下依赖项： "))]),l(s,{lang:"kotlin",code:`dependencies {
    //...
    implementation(libs.ktor.serialization.kotlinx.json.jvm)
    implementation(libs.ktor.server.content.negotiation.jvm)
    implementation(libs.ktor.server.cors.jvm)
}`})]),_:1}),l(e,null,{default:i(()=>[t[204]||(t[204]=n(" 再次，从主菜单中选择 ")),l(u,null,{default:i(()=>t[203]||(t[203]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[205]||(t[205]=n("。 导入完成后，你将发现 ")),t[206]||(t[206]=o("code",null,"ContentNegotiation",-1)),t[207]||(t[207]=n(" 类型和 ")),t[208]||(t[208]=o("code",null,"json()",-1)),t[209]||(t[209]=n(" 函数的导入工作正常。 "))]),_:1}),l(e,null,{default:i(()=>t[210]||(t[210]=[n(" 重新运行服务器。你将发现可以从浏览器访问路由。 ")])),_:1}),l(e,null,{default:i(()=>t[211]||(t[211]=[o("p",null,[n(" 导航到 "),o("a",{href:"http://0.0.0.0:8080/tasks"}),n(" 和 "),o("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"}),n(" 以查看 JSON 格式的任务服务器响应。 "),o("img",{style:{},src:D,width:"707","border-effect":"rounded",alt:"浏览器中的服务器响应"})],-1)])),_:1})]),_:1})]),_:1}),l(a,{title:"创建客户端",id:"create-client"},{default:i(()=>[t[275]||(t[275]=o("p",null," 为了使你的客户端能够访问服务器，你需要包含 Ktor Client。这涉及三种类型的依赖项： ",-1)),l(f,null,{default:i(()=>t[213]||(t[213]=[o("li",null,"Ktor Client 的核心功能。",-1),o("li",null,"平台特有的引擎来处理网络连接。",-1),o("li",null,"对内容协商和序列化的支持。",-1)])),_:1}),l(p,{id:"create-client-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[215]||(t[215]=n(" 在 ")),l(r,null,{default:i(()=>t[214]||(t[214]=[n("gradle/libs.versions.toml")])),_:1}),t[216]||(t[216]=n(" 文件中，添加以下库： ")),l(s,{lang:"toml",code:`[libraries]
ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
ktor-client-cio = { module = "io.ktor:ktor-client-cio", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-wasm = { module = "io.ktor:ktor-client-js-wasm-js", version.ref = "ktor"}
ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }`})]),_:1}),l(e,null,{default:i(()=>[t[218]||(t[218]=n(" 导航到 ")),l(r,null,{default:i(()=>t[217]||(t[217]=[n("composeApp/build.gradle.kts")])),_:1}),t[219]||(t[219]=n(" 并添加以下依赖项： ")),l(s,{lang:"kotlin",code:`kotlin {

    //...
    sourceSets {
        val desktopMain by getting
        
        androidMain.dependencies {
            //...
            implementation(libs.ktor.client.android)
        }
        commonMain.dependencies {
            //...
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
        }
        desktopMain.dependencies {
            //...
            implementation(libs.ktor.client.cio)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
        wasmJsMain.dependencies {
            implementation(libs.ktor.client.wasm)
        }
    }
}`}),t[220]||(t[220]=o("p",null,[n(" 完成后，你可以为客户端添加一个 "),o("code",null,"TaskApi"),n(" 类型，作为 Ktor Client 的轻量级包装器。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[t[222]||(t[222]=n(" 从主菜单中选择 ")),l(u,null,{default:i(()=>t[221]||(t[221]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[223]||(t[223]=n(" 以导入构建文件中的更改。 "))]),_:1}),l(e,null,{default:i(()=>[t[226]||(t[226]=n(" 导航到 ")),l(r,null,{default:i(()=>t[224]||(t[224]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[227]||(t[227]=n(" 并创建一个名为 ")),l(r,null,{default:i(()=>t[225]||(t[225]=[n("network")])),_:1}),t[228]||(t[228]=n(" 的新包。 "))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[230]||(t[230]=n(" 在新包中，为客户端配置创建一个新的 ")),l(r,null,{default:i(()=>t[229]||(t[229]=[n("HttpClientManager.kt")])),_:1}),t[231]||(t[231]=n(" 文件： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

fun createHttpClient() = HttpClient {
    install(ContentNegotiation) {
        json(Json {
            encodeDefaults = true
            isLenient = true
            coerceInputValues = true
            ignoreUnknownKeys = true
        })
    }
    defaultRequest {
        host = "1.2.3.4"
        port = 8080
    }
}`}),t[232]||(t[232]=o("p",null,[n(" 请注意，你应该将 "),o("code",null,"1.2.3.4"),n(" 替换为当前机器的 IP 地址。你无法从 Android 虚拟设备或 iOS 模拟器上运行的代码调用 "),o("code",null,"0.0.0.0"),n(" 或 "),o("code",null,"localhost"),n("。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[235]||(t[235]=n(" 在同一个 ")),l(r,null,{default:i(()=>t[233]||(t[233]=[n("composeApp/.../full_stack_task_manager/network")])),_:1}),t[236]||(t[236]=n(" 包中，创建一个新的 ")),l(r,null,{default:i(()=>t[234]||(t[234]=[n("TaskApi.kt")])),_:1}),t[237]||(t[237]=n(" 文件，其中包含以下实现： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType

class TaskApi(private val httpClient: HttpClient) {

    suspend fun getAllTasks(): List<Task> {
        return httpClient.get("tasks").body()
    }

    suspend fun removeTask(task: Task) {
        httpClient.delete("tasks/\${task.name}")
    }

    suspend fun updateTask(task: Task) {
        httpClient.post("tasks") {
            contentType(ContentType.Application.Json)
            setBody(task)
        }
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[239]||(t[239]=n(" 导航到 ")),l(r,null,{default:i(()=>t[238]||(t[238]=[n("commonMain/.../App.kt")])),_:1}),t[240]||(t[240]=n(" 并用以下实现替换 ")),t[241]||(t[241]=o("code",null,"App",-1)),t[242]||(t[242]=n(" 可组合项。 这将使用 ")),t[243]||(t[243]=o("code",null,"TaskApi",-1)),t[244]||(t[244]=n(" 类型从服务器检索任务 list，然后 在列中显示每个任务的名称： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        val tasks = remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = {
                scope.launch {
                    tasks.value = taskApi.getAllTasks()
                }
            }) {
                Text("Fetch Tasks")
            }
            for (task in tasks.value) {
                Text(task.name)
            }
        }
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[246]||(t[246]=n(" 在服务器运行时，通过运行 ")),l(u,null,{default:i(()=>t[245]||(t[245]=[n("iosApp")])),_:1}),t[247]||(t[247]=n(" 运行配置来测试 iOS 应用程序。 "))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[249]||(t[249]=n(" 单击 ")),l(g,null,{default:i(()=>t[248]||(t[248]=[n("Fetch Tasks")])),_:1}),t[250]||(t[250]=n(" 按钮以显示任务 list： ")),t[251]||(t[251]=o("img",{style:{},src:R,alt:"应用在 iOS 上运行",width:"363","border-effect":"rounded"},null,-1))]),l(A,null,{default:i(()=>t[252]||(t[252]=[n(" 在此演示中，为了清晰起见，我们简化了流程。在实际应用程序中，避免通过网络发送未加密的数据至关重要。 ")])),_:1})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[254]||(t[254]=n(" 在 Android 平台上，你需要显式地授予应用程序网络权限，并允许它以明文形式发送和接收数据。要启用这些权限，请打开 ")),l(r,null,{default:i(()=>t[253]||(t[253]=[n("composeApp/src/androidMain/AndroidManifest.xml")])),_:1}),t[255]||(t[255]=n(" 并添加以下设置： "))]),l(s,{lang:"xml",code:`                    <manifest>
                        ...
                        <application
                                android:usesCleartextTraffic="true">
                        ...
                        ...
                        </application>
                        <uses-permission android:name="android.permission.INTERNET"/>
                    </manifest>`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[257]||(t[257]=n(" 使用 ")),l(u,null,{default:i(()=>t[256]||(t[256]=[n("composeApp")])),_:1}),t[258]||(t[258]=n(" 运行配置运行 Android 应用程序。 你现在将发现你的 Android 客户端也将运行： ")),t[259]||(t[259]=o("img",{style:{},src:O,alt:"应用在 Android 上运行",width:"350","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[261]||(t[261]=n(" 对于桌面客户端，你应该为包含窗口分配尺寸和标题。 打开文件 ")),l(r,null,{default:i(()=>t[260]||(t[260]=[n("composeApp/src/desktopMain/.../main.kt")])),_:1}),t[262]||(t[262]=n(" 并通过更改 ")),t[263]||(t[263]=o("code",null,"title",-1)),t[264]||(t[264]=n(" 和设置 ")),t[265]||(t[265]=o("code",null,"state",-1)),t[266]||(t[266]=n(" 属性来修改代码： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    val state = WindowState(
        size = DpSize(400.dp, 600.dp),
        position = WindowPosition(200.dp, 100.dp)
    )
    Window(
        title = "Task Manager (Desktop)",
        state = state,
        onCloseRequest = ::exitApplication
    ) {
        App()
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[268]||(t[268]=n(" 使用 ")),l(u,null,{default:i(()=>t[267]||(t[267]=[n("composeApp [desktop]")])),_:1}),t[269]||(t[269]=n(" 运行配置运行桌面应用程序： ")),t[270]||(t[270]=o("img",{style:{},src:N,alt:"应用在桌面运行",width:"400","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[272]||(t[272]=n(" 使用 ")),l(u,null,{default:i(()=>t[271]||(t[271]=[n("composeApp [wasmJs]")])),_:1}),t[273]||(t[273]=n(" 运行配置运行 Web 客户端： "))]),t[274]||(t[274]=o("img",{style:{},src:B,alt:"应用在桌面运行",width:"400","border-effect":"rounded"},null,-1))]),_:1})]),_:1})]),_:1}),l(a,{title:"改进 UI",id:"improve-ui"},{default:i(()=>[t[291]||(t[291]=o("p",null," 客户端现在正在与服务器通信，但这远非一个吸引人的 UI。 ",-1)),l(p,{id:"improve-ui-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[o("p",null,[t[278]||(t[278]=n(" 打开位于 ")),l(r,null,{default:i(()=>t[276]||(t[276]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[279]||(t[279]=n(" 中的 ")),l(r,null,{default:i(()=>t[277]||(t[277]=[n("App.kt")])),_:1}),t[280]||(t[280]=n(" 文件，并用下面的 ")),t[281]||(t[281]=o("code",null,"App",-1)),t[282]||(t[282]=n(" 和 ")),t[283]||(t[283]=o("code",null,"TaskCard",-1)),t[284]||(t[284]=n(" 可组合项替换现有的 ")),t[285]||(t[285]=o("code",null,"App",-1)),t[286]||(t[286]=n("： "))]),l(s,{lang:"kotlin","collapsed-title-line-number":"31",collapsible:"true",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        LazyColumn(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                    }
                )
            }
        }
    }
}

@Composable
fun TaskCard(
    task: Task,
    onDelete: (Task) -> Unit,
    onUpdate: (Task) -> Unit
) {
    fun pickWeight(priority: Priority) = when (priority) {
        Priority.Low -> FontWeight.SemiBold
        Priority.Medium -> FontWeight.Bold
        Priority.High, Priority.Vital -> FontWeight.ExtraBold
    }

    Card(
        modifier = Modifier.fillMaxWidth().padding(4.dp),
        shape = RoundedCornerShape(CornerSize(4.dp))
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(
                "\${task.name}: \${task.description}",
                fontSize = 20.sp,
                fontWeight = pickWeight(task.priority)
            )

            Row {
                OutlinedButton(onClick = { onDelete(task) }) {
                    Text("Delete")
                }
                Spacer(Modifier.width(8.dp))
                OutlinedButton(onClick = { onUpdate(task) }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[287]||(t[287]=o("p",null," 通过此实现，你的客户端现在具有一些基本功能。 ",-1)),t[288]||(t[288]=o("p",null,[n(" 通过使用 "),o("code",null,"LaunchedEffect"),n(" 类型，所有任务都在启动时加载，而 "),o("code",null,"LazyColumn"),n(" 可组合项允许用户滚动浏览任务。 ")],-1)),t[289]||(t[289]=o("p",null,[n(" 最后，创建了一个单独的 "),o("code",null,"TaskCard"),n(" 可组合项，它又使用一个 "),o("code",null,"Card"),n(" 来显示每个 "),o("code",null,"Task"),n(" 的详细信息。已添加按钮来删除和更新任务。 ")],-1))]),_:1}),l(e,null,{default:i(()=>t[290]||(t[290]=[o("p",null,[n(" 重新运行客户端应用程序——例如，Android 应用。 你现在可以滚动浏览任务、查看其详细信息并删除它们： "),o("img",{style:{},src:H,alt:"应用在 Android 上运行，UI 已改进",width:"350","border-effect":"rounded"})],-1)])),_:1})]),_:1})]),_:1}),l(a,{title:"添加更新功能",id:"add-update-functionality"},{default:i(()=>[t[303]||(t[303]=o("p",null," 要完成客户端，请集成允许更新任务详细信息的功能。 ",-1)),l(p,{id:"add-update-func-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[294]||(t[294]=n(" 导航到 ")),l(r,null,{default:i(()=>t[292]||(t[292]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[295]||(t[295]=n(" 中的 ")),l(r,null,{default:i(()=>t[293]||(t[293]=[n("App.kt")])),_:1}),t[296]||(t[296]=n(" 文件。 "))]),_:1}),l(e,null,{default:i(()=>[t[297]||(t[297]=o("p",null,[n(" 添加 "),o("code",null,"UpdateTaskDialog"),n(" 可组合项和必要的导入，如下所示： ")],-1)),l(s,{lang:"kotlin",code:`import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.window.Dialog

@Composable
fun UpdateTaskDialog(
    task: Task,
    onConfirm: (Task) -> Unit
) {
    var description by remember { mutableStateOf(task.description) }
    var priorityText by remember { mutableStateOf(task.priority.toString()) }
    val colors = TextFieldDefaults.colors(
        focusedTextColor = Color.Blue,
        focusedContainerColor = Color.White,
    )

    Dialog(onDismissRequest = {}) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(4.dp),
            shape = RoundedCornerShape(CornerSize(4.dp))
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Text("Update \${task.name}", fontSize = 20.sp)
                TextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description") },
                    colors = colors
                )
                TextField(
                    value = priorityText,
                    onValueChange = { priorityText = it },
                    label = { Text("Priority") },
                    colors = colors
                )
                OutlinedButton(onClick = {
                    val newTask = Task(
                        task.name,
                        description,
                        try {
                            Priority.valueOf(priorityText)
                        } catch (e: IllegalArgumentException) {
                            Priority.Low
                        }
                    )
                    onConfirm(newTask)
                }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[298]||(t[298]=o("p",null,[n(" 这是一个可组合项，通过对话框显示 "),o("code",null,"Task"),n(" 的详细信息。"),o("code",null,"description"),n(" 和 "),o("code",null,"priority"),n(" 放置在 "),o("code",null,"TextField"),n(" 可组合项中，以便可以更新它们。当用户按下更新按钮时，它会触发 "),o("code",null,"onConfirm()"),n(" 回调。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[t[299]||(t[299]=o("p",null,[n(" 更新同一个文件中的 "),o("code",null,"App"),n(" 可组合项： ")],-1)),l(s,{lang:"kotlin",code:`@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()
        var currentTask by remember { mutableStateOf<Task?>(null) }

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        if (currentTask != null) {
            UpdateTaskDialog(
                currentTask!!,
                onConfirm = {
                    scope.launch {
                        taskApi.updateTask(it)
                        tasks = taskApi.getAllTasks()
                    }
                    currentTask = null
                }
            )
        }

        LazyColumn(modifier = Modifier
            .safeContentPadding()
            .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                        currentTask = task
                    }
                )
            }
        }
    }
}`}),t[300]||(t[300]=o("p",null,[n(" 你正在存储一个额外的状态片段，即当前选定的任务。如果此值不为 null，则我们调用 "),o("code",null,"UpdateTaskDialog"),n(" 可组合项，并将 "),o("code",null,"onConfirm()"),n(" 回调设置为使用 "),o("code",null,"TaskApi"),n(" 向服务器发送 POST 请求。 ")],-1)),t[301]||(t[301]=o("p",null,[n(" 最后，当你创建 "),o("code",null,"TaskCard"),n(" 可组合项时，你使用 "),o("code",null,"onUpdate()"),n(" 回调来设置 "),o("code",null,"currentTask"),n(" 状态变量。 ")],-1))]),_:1}),l(e,null,{default:i(()=>t[302]||(t[302]=[n(" 重新运行客户端应用程序。你现在应该能够使用按钮更新每个任务的详细信息。 "),o("img",{style:{},src:U,alt:"在 Android 上删除任务",width:"350","border-effect":"rounded"},null,-1)])),_:1})]),_:1})]),_:1}),l(a,{title:"后续步骤",id:"next-steps"},{default:i(()=>[t[311]||(t[311]=o("p",null," 在本文中，你已在 Kotlin Multiplatform 应用程序的上下文中使用 Ktor。你现在可以创建一个包含多个服务和客户端的项目，面向各种不同的平台。 ",-1)),o("p",null,[t[307]||(t[307]=n(" 如你所见，可以构建特性而无需任何代码重复或冗余。项目所有层中所需的类型都可以放置在 ")),l(r,null,{default:i(()=>t[304]||(t[304]=[n("shared")])),_:1}),t[308]||(t[308]=n(" 多平台模块中。服务所需的功能放置在 ")),l(r,null,{default:i(()=>t[305]||(t[305]=[n("server")])),_:1}),t[309]||(t[309]=n(" 模块中，而客户端所需的功能则放置在 ")),l(r,null,{default:i(()=>t[306]||(t[306]=[n("composeApp")])),_:1}),t[310]||(t[310]=n(" 中。 "))]),t[312]||(t[312]=o("p",null,[n(" 这种开发不可避免地需要客户端和服务器技术知识。但是你可以使用 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform"),n(" 库和 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"}," Compose Multiplatform"),n(" 来最大限度地减少你需要学习的新内容。即使你的重点最初只在一个平台上，随着你的应用程序需求增长，你也可以轻松添加其他平台。 ")],-1))]),_:1})]),_:1})])}const _=E(J,[["render",F]]);export{Z as __pageData,_ as default};
