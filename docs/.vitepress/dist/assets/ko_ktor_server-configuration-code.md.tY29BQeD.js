import{_ as f,C as s,c as k,o as v,G as r,w as o,j as n,a as t}from"./chunks/framework.Bksy39di.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-configuration-code.md","filePath":"ko/ktor/server-configuration-code.md","lastUpdated":1755514048000}'),c={name:"ko/ktor/server-configuration-code.md"};function y(C,e,S,b,j,w){const p=s("show-structure"),u=s("link-summary"),a=s("Links"),i=s("code-block"),l=s("chapter"),m=s("snippet"),d=s("tip"),g=s("topic");return v(),k("div",null,[r(g,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"코드에서 구성",id:"server-configuration-code","help-id":"Configuration-code;server-configuration-in-code"},{default:o(()=>[r(p,{for:"chapter"}),r(u,null,{default:o(()=>e[0]||(e[0]=[t(" 코드에서 다양한 서버 파라미터를 구성하는 방법을 알아봅니다. ")])),_:1}),n("p",null,[e[3]||(e[3]=t(" Ktor를 사용하면 호스트 주소, 포트, ")),r(a,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:o(()=>e[1]||(e[1]=[t("서버 모듈")])),_:1}),e[4]||(e[4]=t(" 등 다양한 서버 파라미터를 코드에서 직접 구성할 수 있습니다. 구성 방식은 ")),r(a,{href:"/ktor/server-create-and-configure",summary:"애플리케이션 배포 요구사항에 따라 서버를 생성하는 방법을 알아봅니다."},{default:o(()=>e[2]||(e[2]=[t("embeddedServer 또는 EngineMain")])),_:1}),e[5]||(e[5]=t("을 사용하는 서버 설정 방식에 따라 달라집니다. "))]),n("p",null,[e[7]||(e[7]=n("code",null,"embeddedServer",-1)),e[8]||(e[8]=t("를 사용하면 원하는 파라미터를 함수에 직접 전달하여 서버를 구성할 수 있습니다. ")),e[9]||(e[9]=n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html"}," embeddedServer ",-1)),e[10]||(e[10]=t(" 함수는 ")),r(a,{href:"/ktor/server-engines",summary:"네트워크 요청을 처리하는 엔진에 대해 알아봅니다."},{default:o(()=>e[6]||(e[6]=[t("서버 엔진")])),_:1}),e[11]||(e[11]=t(", 서버가 수신할 호스트 및 포트, 추가 구성 등 서버 구성을 위한 다양한 파라미터를 허용합니다. "))]),e[32]||(e[32]=n("p",null,[t(" 이 섹션에서는 "),n("code",null,"embeddedServer"),t("를 실행하는 몇 가지 다른 예시를 살펴보고, 서버를 효과적으로 구성하는 방법을 설명합니다. ")],-1)),r(l,{title:"기본 구성",id:"embedded-basic"},{default:o(()=>[e[12]||(e[12]=n("p",null,[t(" 아래 코드 스니펫은 Netty 엔진과 "),n("code",null,"8080"),t(" 포트를 사용한 기본 서버 설정을 보여줍니다. ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),e[13]||(e[13]=n("p",null,[n("code",null,"port"),t(" 파라미터를 "),n("code",null,"0"),t("으로 설정하여 서버를 임의의 포트에서 실행할 수 있습니다. "),n("code",null,"embeddedServer"),t(" 함수는 엔진 인스턴스를 반환하므로, "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html"}," ApplicationEngine.resolvedConnectors "),t(" 함수를 사용하여 코드에서 포트 값을 얻을 수 있습니다. ")],-1))]),_:1}),r(l,{title:"엔진 구성",id:"embedded-engine"},{default:o(()=>[r(m,{id:"embedded-engine-configuration"},{default:o(()=>[e[20]||(e[20]=n("p",null,[n("code",null,"embeddedServer"),t(" 함수를 사용하면 "),n("code",null,"configure"),t(" 파라미터를 통해 엔진별 옵션을 전달할 수 있습니다. 이 파라미터에는 모든 엔진에 공통적으로 적용되며 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"}," ApplicationEngine.Configuration "),t(" 클래스에 노출되는 옵션이 포함됩니다. ")],-1)),e[21]||(e[21]=n("p",null,[t(" 아래 예시는 "),n("code",null,"Netty"),t(" 엔진을 사용하여 서버를 구성하는 방법을 보여줍니다. "),n("code",null,"configure"),t(" 블록 내에서 호스트와 포트를 지정하기 위해 "),n("code",null,"connector"),t("를 정의하고 다양한 서버 파라미터를 사용자 정의합니다. ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),e[22]||(e[22]=n("p",null,[n("code",null,"connectors.add()"),t(" 메서드는 지정된 호스트("),n("code",null,"127.0.0.1"),t(")와 포트("),n("code",null,"8080"),t(")를 가진 커넥터를 정의합니다. ")],-1)),e[23]||(e[23]=n("p",null,"이러한 옵션 외에도 다른 엔진별 속성을 구성할 수 있습니다.",-1)),r(l,{title:"Netty",id:"netty-code"},{default:o(()=>[e[14]||(e[14]=n("p",null,[t(" Netty 관련 옵션은 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),t(" 클래스에 의해 노출됩니다. ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1}),r(l,{title:"Jetty",id:"jetty-code"},{default:o(()=>[e[15]||(e[15]=n("p",null,[t(" Jetty 관련 옵션은 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),t(" 클래스에 의해 노출됩니다. ")],-1)),e[16]||(e[16]=n("p",null,[t("Jetty 서버는 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),t(" 블록 내에서 구성할 수 있으며, 이 블록은 "),n("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),t(" 인스턴스에 대한 접근을 제공합니다. ")],-1)),e[17]||(e[17]=n("p",null,[n("code",null,"idleTimeout"),t(" 속성을 사용하여 연결이 닫히기 전까지 유휴 상태로 있을 수 있는 시간(기간)을 지정합니다. ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1}),r(l,{title:"CIO",id:"cio-code"},{default:o(()=>[e[18]||(e[18]=n("p",null,[t("CIO 관련 옵션은 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),t(" 클래스에 의해 노출됩니다. ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.cio.*

                    fun main() {
                        embeddedServer(CIO, configure = {
                            connectionIdleTimeoutSeconds = 45
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1}),r(l,{title:"Tomcat",id:"tomcat-code"},{default:o(()=>[e[19]||(e[19]=n("p",null,[t("Tomcat을 엔진으로 사용하는 경우, "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),t(" 속성을 사용하여 구성할 수 있으며, 이 속성은 "),n("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),t(" 인스턴스에 대한 접근을 제공합니다. ")],-1)),r(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.tomcat.jakarta.*

                    fun main() {
                        embeddedServer(Tomcat, configure = {
                            configureTomcat = { // this: Tomcat -&gt;
                                // ...
                            }
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1})]),_:1})]),_:1}),r(l,{title:"사용자 지정 환경",id:"embedded-custom"},{default:o(()=>[e[25]||(e[25]=n("p",null,[t(" 아래 예시는 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"}," ApplicationEngine.Configuration "),t(" 클래스로 표현되는 사용자 지정 구성을 사용하여 여러 커넥터 엔드포인트가 있는 서버를 실행하는 방법을 보여줍니다. ")],-1)),r(i,{lang:"kotlin",code:`import io.ktor.server.application.*
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
}`}),e[26]||(e[26]=n("p",null,[t(" 전체 예시는 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server-multiple-connectors"}," embedded-server-multiple-connectors "),t("를 참조하세요. ")],-1)),r(d,null,{default:o(()=>e[24]||(e[24]=[n("p",null,[t(" 사용자 지정 환경을 사용하여 "),n("a",{href:"#embedded-server"}," HTTPS를 제공 "),t("할 수도 있습니다. ")],-1)])),_:1})]),_:1}),r(l,{id:"command-line",title:"명령줄 구성"},{default:o(()=>[e[28]||(e[28]=n("p",null,[t(" Ktor를 사용하면 명령줄 인수를 사용하여 "),n("code",null,"embeddedServer"),t("를 동적으로 구성할 수 있습니다. 이는 포트, 호스트 또는 타임아웃과 같은 구성이 런타임에 지정되어야 하는 경우에 특히 유용합니다. ")],-1)),e[29]||(e[29]=n("p",null,[t(" 이를 위해 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html"}," CommandLineConfig "),t(" 클래스를 사용하여 명령줄 인수를 구성 객체로 파싱하고 구성 블록 내에서 전달합니다. ")],-1)),r(i,{lang:"kotlin",code:`fun main(args: Array<String>) {
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
}`}),e[30]||(e[30]=n("p",null,[t(" 이 예시에서 "),n("code",null,"Application.Configuration"),t("의 "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html"},[n("code",null,"takeFrom()")]),t(" 함수는 "),n("code",null,"port"),t(" 및 "),n("code",null,"host"),t("와 같은 엔진 구성 값을 오버라이드하는 데 사용됩니다. "),n("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html"},[n("code",null,"loadCommonConfiguration()")]),t(" 함수는 타임아웃과 같은 루트 환경에서 구성을 로드합니다. ")],-1)),e[31]||(e[31]=n("p",null," 서버를 실행하려면 다음과 같이 인수를 지정합니다. ",-1)),r(i,{lang:"shell",code:'            ./gradlew run --args="-port=8080"'}),r(d,null,{default:o(()=>e[27]||(e[27]=[t(" 정적 구성의 경우, 구성 파일이나 환경 변수를 사용할 수 있습니다. 자세한 내용은 "),n("a",{href:"#command-line"}," 파일 구성 ",-1),t("을 참조하세요. ")])),_:1})]),_:1})]),_:1})])}const N=f(c,[["render",y]]);export{x as __pageData,N as default};
