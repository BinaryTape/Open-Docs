import{_ as S,C as i,c as b,o as w,G as r,w as o,j as t,a as e}from"./chunks/framework.Bksy39di.js";const H=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-create-and-configure.md","filePath":"zh-Hant/ktor/server-create-and-configure.md","lastUpdated":1755457140000}'),C={name:"zh-Hant/ktor/server-create-and-configure.md"};function x(L,n,A,N,K,T){const f=i("show-structure"),g=i("tldr"),v=i("link-summary"),l=i("Links"),p=i("control"),m=i("list"),s=i("code-block"),u=i("chapter"),d=i("Path"),a=i("tab"),k=i("tabs"),y=i("topic");return w(),b("div",null,[r(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"建立伺服器",id:"server-create-and-configure","help-id":"start_server;create_server"},{default:o(()=>[r(f,{for:"chapter",depth:"2"}),r(g,null,{default:o(()=>n[0]||(n[0]=[t("p",null,[t("b",null,"程式碼範例"),e(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server"},"embedded-server"),e(", "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main"},"engine-main"),e(", "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-yaml"},"engine-main-yaml")],-1)])),_:1}),r(v,null,{default:o(()=>n[1]||(n[1]=[e(" 瞭解如何根據您的應用程式部署需求建立伺服器。 ")])),_:1}),t("p",null,[n[3]||(n[3]=e(" 在建立 Ktor 應用程式之前，您需要考量您的應用程式將如何 ")),r(l,{href:"/ktor/server-deployment",summary:"Code example: %example_name%"},{default:o(()=>n[2]||(n[2]=[e(" 部署 ")])),_:1}),n[4]||(n[4]=e(" ： "))]),r(m,null,{default:o(()=>[t("li",null,[t("p",null,[n[6]||(n[6]=e(" 作為 ")),r(p,null,{default:o(()=>n[5]||(n[5]=[t("a",{href:"#embedded"},"獨立套件",-1)])),_:1})]),t("p",null,[n[8]||(n[8]=e(" 在此情況下，用於處理網路請求的應用程式")),r(l,{href:"/ktor/server-engines",summary:"Learn about engines that process network requests."},{default:o(()=>n[7]||(n[7]=[e("引擎")])),_:1}),n[9]||(n[9]=e("應該是您應用程式的一部分。 您的應用程式可控制引擎設定、連線和 SSL 選項。 "))])]),t("li",null,[t("p",null,[n[11]||(n[11]=e(" 作為 ")),r(p,null,{default:o(()=>n[10]||(n[10]=[t("a",{href:"#servlet"},"Servlet",-1)])),_:1})]),n[12]||(n[12]=t("p",null," 在此情況下，Ktor 應用程式可以部署在 Servlet 容器中（例如 Tomcat 或 Jetty）， 該容器控制應用程式生命週期和連線設定。 ",-1))])]),_:1}),r(u,{title:"獨立套件",id:"embedded"},{default:o(()=>[t("p",null,[n[14]||(n[14]=e(" 若要將 Ktor 伺服器應用程式作為獨立套件交付，您需要先建立一個伺服器。 伺服器配置可包含不同的設定：一個伺服器")),r(l,{href:"/ktor/server-engines",summary:"Learn about engines that process network requests."},{default:o(()=>n[13]||(n[13]=[e("引擎")])),_:1}),n[15]||(n[15]=e("（例如 Netty、Jetty 等）、 各種引擎特定選項、主機和埠值等。 Ktor 中有兩種主要方法用於建立和執行伺服器： "))]),r(m,null,{default:o(()=>n[16]||(n[16]=[t("li",null,[t("p",null,[t("code",null,"embeddedServer"),e(" 函數是一種簡單的方式，可以在 "),t("a",{href:"#embedded-server"}," 程式碼中配置伺服器參數 "),e(" 並快速執行應用程式。 ")])],-1),t("li",null,[t("p",null,[t("code",null,"EngineMain"),e(" 為配置伺服器提供了更大的靈活性。您可以 "),t("a",{href:"#engine-main"}," 在檔案中指定伺服器參數 "),e(" ，並在不重新編譯應用程式的情況下更改配置。此外，您可以從命令列執行應用程式，並透過傳遞相應的命令列引數來覆寫所需的伺服器參數。 ")])],-1)])),_:1}),r(u,{title:"在程式碼中配置",id:"embedded-server"},{default:o(()=>[t("p",null,[n[19]||(n[19]=t("code",null,"embeddedServer",-1)),n[20]||(n[20]=e(" 函數是一種簡單的方式，可以在 ")),r(l,{href:"/ktor/server-configuration-code",summary:"Learn how to configure various server parameters in code."},{default:o(()=>n[17]||(n[17]=[e("程式碼")])),_:1}),n[21]||(n[21]=e(" 中配置伺服器參數並快速執行應用程式。在下面的程式碼片段中，它接受一個 ")),r(l,{href:"/ktor/server-engines",summary:"Learn about engines that process network requests."},{default:o(()=>n[18]||(n[18]=[e("引擎")])),_:1}),n[22]||(n[22]=e(" 和埠作為參數來啟動伺服器。在下面的範例中，我們使用 ")),n[23]||(n[23]=t("code",null,"Netty",-1)),n[24]||(n[24]=e(" 引擎運行伺服器並監聽 ")),n[25]||(n[25]=t("code",null,"8080",-1)),n[26]||(n[26]=e(" 埠： "))]),r(s,{lang:"kotlin",code:`package com.example

import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        println("Running basic server...")
        println("Provide the 'configured' argument to run a configured server.")
        runBasicServer()
    }

    when (args[0]) {
        "basic" -> runBasicServer()
        "configured" -> runConfiguredServer()
        else -> runServerWithCommandLineConfig(args)
    }
}

fun runBasicServer() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}

fun runConfiguredServer() {
    embeddedServer(Netty, configure = {
        connectors.add(EngineConnectorBuilder().apply {
            host = "127.0.0.1"
            port = 8080
        })
        connectionGroupSize = 2
        workerGroupSize = 5
        callGroupSize = 10
        shutdownGracePeriod = 2000
        shutdownTimeout = 3000
    }) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}

fun runServerWithCommandLineConfig(args: Array<String>) {
    embeddedServer(
        factory = Netty,
        configure = {
            val cliConfig = CommandLineConfig(args)
            takeFrom(cliConfig.engineConfig)
            loadCommonConfiguration(cliConfig.rootConfig.environment.config)
        }
    ) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}`}),n[27]||(n[27]=t("p",null,[e(" 有關完整範例，請參閱 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server"}," embedded-server "),e(" 。 ")],-1))]),_:1}),r(u,{title:"在檔案中配置",id:"engine-main"},{default:o(()=>[t("p",null,[n[33]||(n[33]=t("code",null,"EngineMain",-1)),n[34]||(n[34]=e(" 使用選定的引擎啟動伺服器，並載入外部")),r(l,{href:"/ktor/server-configuration-file",summary:"Learn how to configure various server parameters in a configuration file."},{default:o(()=>n[28]||(n[28]=[e("配置檔案")])),_:1}),n[35]||(n[35]=e("中指定的應用程式")),r(l,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:o(()=>n[29]||(n[29]=[e("模組")])),_:1}),n[36]||(n[36]=e("， 該檔案位於 ")),r(d,null,{default:o(()=>n[30]||(n[30]=[e("resources")])),_:1}),n[37]||(n[37]=e(" 目錄中： ")),r(d,null,{default:o(()=>n[31]||(n[31]=[e("application.conf")])),_:1}),n[38]||(n[38]=e(" 或 ")),r(d,null,{default:o(()=>n[32]||(n[32]=[e("application.yaml")])),_:1}),n[39]||(n[39]=e(" 。 除了要載入的模組之外，配置檔案還可以包含各種伺服器參數（例如下面範例中的 ")),n[40]||(n[40]=t("code",null,"8080",-1)),n[41]||(n[41]=e(" 埠）。 "))]),r(k,null,{default:o(()=>[r(a,{title:"Application.kt",id:"application-kt"},{default:o(()=>[r(s,{lang:"kotlin",code:`package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, world!")
        }
    }
}`})]),_:1}),r(a,{title:"application.conf",id:"application-conf"},{default:o(()=>[r(s,{code:`ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),r(a,{title:"application.yaml",id:"application-yaml"},{default:o(()=>[r(s,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),n[42]||(n[42]=t("p",null,[e(" 有關完整範例，請參閱 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main"}," engine-main "),e(" 和 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-yaml"}," engine-main-yaml "),e(" 。 ")],-1))]),_:1})]),_:1}),r(u,{title:"Servlet",id:"servlet"},{default:o(()=>[t("p",null,[n[44]||(n[44]=e(" Ktor 應用程式可以在包含 Tomcat 和 Jetty 的 Servlet 容器中運行和部署。 若要部署到 Servlet 容器中，您需要產生一個 ")),r(l,{href:"/ktor/server-war",summary:"Learn how to run and deploy a Ktor application inside a servlet container using a WAR archive."},{default:o(()=>n[43]||(n[43]=[e("WAR")])),_:1}),n[45]||(n[45]=e(" 歸檔檔，然後將其部署到支援 WAR 檔的伺服器或雲服務上。 "))])]),_:1})]),_:1})])}const z=S(C,[["render",x]]);export{H as __pageData,z as default};
