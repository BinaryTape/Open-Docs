import{_ as f,C as s,c as k,o as v,G as r,w as o,j as t,a as n}from"./chunks/framework.Bksy39di.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-configuration-code.md","filePath":"ktor/server-configuration-code.md","lastUpdated":1755514048000}'),c={name:"ktor/server-configuration-code.md"};function y(C,e,S,b,j,w){const p=s("show-structure"),u=s("link-summary"),a=s("Links"),i=s("code-block"),l=s("chapter"),m=s("snippet"),d=s("tip"),g=s("topic");return v(),k("div",null,[r(g,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"代码中的配置",id:"server-configuration-code","help-id":"Configuration-code;server-configuration-in-code"},{default:o(()=>[r(p,{for:"chapter"}),r(u,null,{default:o(()=>e[0]||(e[0]=[n(" 了解如何在代码中配置各种服务器参数。 ")])),_:1}),t("p",null,[e[3]||(e[3]=n(" Ktor 允许你直接在代码中配置各种服务器形参，包括主机地址、端口、")),r(a,{href:"/ktor/server-modules",summary:"模块允许你通过路由分组来组织应用程序。"},{default:o(()=>e[1]||(e[1]=[n("服务器模块")])),_:1}),e[4]||(e[4]=n("等。配置方法取决于你设置服务器的方式——是使用 ")),r(a,{href:"/ktor/server-create-and-configure",summary:"了解如何根据应用程序部署需求创建服务器。"},{default:o(()=>e[2]||(e[2]=[n("embeddedServer 还是 EngineMain")])),_:1}),e[5]||(e[5]=n("。 "))]),t("p",null,[e[7]||(e[7]=n(" 使用 ")),e[8]||(e[8]=t("code",null,"embeddedServer",-1)),e[9]||(e[9]=n(" 时，你可以通过将所需的形参直接传递给该函数来配置服务器。 ")),e[10]||(e[10]=t("code",null,[t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html"}," embeddedServer ")],-1)),e[11]||(e[11]=n(" 函数接受不同的形参来配置服务器，包括一个 ")),r(a,{href:"/ktor/server-engines",summary:"了解处理网络请求的引擎。"},{default:o(()=>e[6]||(e[6]=[n("服务器引擎")])),_:1}),e[12]||(e[12]=n("、服务器监听的主机和端口，以及其他配置。 "))]),e[33]||(e[33]=t("p",null,[n(" 在本节中，我们将介绍运行 "),t("code",null,"embeddedServer"),n(" 的几个不同示例，展示如何配置服务器以满足你的需求。 ")],-1)),r(l,{title:"基本配置",id:"embedded-basic"},{default:o(()=>[e[13]||(e[13]=t("p",null,[n(" 下面的代码片段展示了一个使用 Netty 引擎和 "),t("code",null,"8080"),n(" 端口的基本服务器设置。 ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}`}),e[14]||(e[14]=t("p",null,[n(" 请注意，你可以将 "),t("code",null,"port"),n(" 形参设置为 "),t("code",null,"0"),n("，以便在随机端口上运行服务器。 "),t("code",null,"embeddedServer"),n(" 函数会返回一个引擎实例，因此你可以在代码中使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html"}," ApplicationEngine.resolvedConnectors "),n(" 函数获取端口值。 ")],-1))]),_:1}),r(l,{title:"引擎配置",id:"embedded-engine"},{default:o(()=>[r(m,{id:"embedded-engine-configuration"},{default:o(()=>[e[21]||(e[21]=t("p",null,[t("code",null,"embeddedServer"),n(" 函数允许你使用 "),t("code",null,"configure"),n(" 形参传递引擎特有的选项。此形参包含所有引擎共有的选项，并由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"}," ApplicationEngine.Configuration "),n(" 类公开。 ")],-1)),e[22]||(e[22]=t("p",null,[n(" 以下示例展示了如何使用 "),t("code",null,"Netty"),n(" 引擎配置服务器。在 "),t("code",null,"configure"),n(" 代码块中，我们定义了一个 "),t("code",null,"connector"),n(" 来指定主机和端口，并自定义各种服务器形参： ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
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
}`}),e[23]||(e[23]=t("p",null,[t("code",null,"connectors.add()"),n(" 方法定义了一个连接器，其中包含指定的主机（"),t("code",null,"127.0.0.1"),n("） 和端口（"),t("code",null,"8080"),n("）。 ")],-1)),e[24]||(e[24]=t("p",null,"除了这些选项，你还可以配置其他引擎特有的属性。",-1)),r(l,{title:"Netty",id:"netty-code"},{default:o(()=>[e[15]||(e[15]=t("p",null,[n(" Netty 特有的选项由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),n(" 类公开。 ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.netty.*

                    fun main() {
                        embeddedServer(Netty, configure = {
                            requestQueueLimit = 16
                            shareWorkGroup = false
                            configureBootstrap = {
                                // ...
                            }
                            responseWriteTimeoutSeconds = 10
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1}),r(l,{title:"Jetty",id:"jetty-code"},{default:o(()=>[e[16]||(e[16]=t("p",null,[n(" Jetty 特有的选项由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),n(" 类公开。 ")],-1)),e[17]||(e[17]=t("p",null,[n("你可以在 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),n(" 代码块内配置 Jetty 服务器，该代码块提供对 "),t("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),n(" 实例的访问。 ")],-1)),e[18]||(e[18]=t("p",null,[n(" 使用 "),t("code",null,"idleTimeout"),n(" 属性指定连接在关闭前可以空闲的时长。 ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.jetty.jakarta.*

                    fun main() {
                        embeddedServer(Jetty, configure = {
                            configureServer = { // this: Server -&gt;
                                // ...
                            }
                            idleTimeout = 30.seconds
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1}),r(l,{title:"CIO",id:"cio-code"},{default:o(()=>[e[19]||(e[19]=t("p",null,[n("CIO 特有的选项由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),n(" 类公开。 ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.cio.*

                    fun main() {
                        embeddedServer(CIO, configure = {
                            connectionIdleTimeoutSeconds = 45
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1}),r(l,{title:"Tomcat",id:"tomcat-code"},{default:o(()=>[e[20]||(e[20]=t("p",null,[n("如果你使用 Tomcat 作为引擎，则可以使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),n(" 属性配置它，该属性提供对 "),t("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),n(" 实例的访问。 ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.tomcat.jakarta.*

                    fun main() {
                        embeddedServer(Tomcat, configure = {
                            configureTomcat = { // this: Tomcat -&gt;
                                // ...
                            }
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1})]),_:1})]),_:1}),r(l,{title:"自定义环境",id:"embedded-custom"},{default:o(()=>[e[26]||(e[26]=t("p",null,[n(" 以下示例展示了如何使用由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"}," ApplicationEngine.Configuration "),n(" 类表示的自定义配置来运行具有多个连接器端点的服务器。 ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    val appProperties = serverConfig {
        module { module() }
    }
    embeddedServer(Netty, appProperties) {
        envConfig()
    }.start(true)
}

fun ApplicationEngine.Configuration.envConfig() {
    connector {
        host = "0.0.0.0"
        port = 8080
    }
    connector {
        host = "127.0.0.1"
        port = 9090
    }
}`}),e[27]||(e[27]=t("p",null,[n(" 有关完整示例，请参见 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server-multiple-connectors"}," embedded-server-multiple-connectors "),n("。 ")],-1)),r(d,null,{default:o(()=>e[25]||(e[25]=[t("p",null,[n(" 你还可以使用自定义环境来 "),t("a",{href:"#embedded-server"}," 提供 HTTPS 服务 "),n("。 ")],-1)])),_:1})]),_:1}),r(l,{id:"command-line",title:"命令行配置"},{default:o(()=>[e[29]||(e[29]=t("p",null,[n(" Ktor 允许你使用命令行实参动态配置 "),t("code",null,"embeddedServer"),n("。这 在需要运行时指定端口、主机或超时等配置的情况下特别有用。 ")],-1)),e[30]||(e[30]=t("p",null,[n(" 为此，请使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html"}," CommandLineConfig "),n(" 类将命令行实参解析为配置对象，并在配置代码块中传递它： ")],-1)),r(i,{lang:"kotlin",code:`fun main(args: Array<String>) {
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
}`}),e[31]||(e[31]=t("p",null,[n(" 在此示例中，"),t("code",null,"Application.Configuration"),n(" 中的 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html"},[t("code",null,"takeFrom()")]),n(" 函数用于覆盖引擎配置值，例如 "),t("code",null,"port"),n(" 和 "),t("code",null,"host"),n("。 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html"},[t("code",null,"loadCommonConfiguration()")]),n(" 函数从根环境（例如超时）加载配置。 ")],-1)),e[32]||(e[32]=t("p",null," 要运行服务器，请按以下方式指定实参： ",-1)),r(i,{lang:"shell",code:'            ./gradlew run --args="-port=8080"'}),r(d,null,{default:o(()=>e[28]||(e[28]=[n(" 对于静态配置，你可以使用配置文件或环境变量。 要了解更多信息，请参见 "),t("a",{href:"#command-line"}," 文件中的配置 ",-1),n(" 。 ")])),_:1})]),_:1})]),_:1})])}const N=f(c,[["render",y]]);export{x as __pageData,N as default};
