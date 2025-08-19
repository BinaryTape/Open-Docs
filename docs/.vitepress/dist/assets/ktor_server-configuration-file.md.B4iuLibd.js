import{_ as A,C as d,c as L,o as b,G as l,w as e,j as o,a as t}from"./chunks/framework.Bksy39di.js";const $=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-configuration-file.md","filePath":"ktor/server-configuration-file.md","lastUpdated":1755514048000}'),K={name:"ktor/server-configuration-file.md"},j={id:"ssl"};function O(z,n,N,T,G,R){const g=d("show-structure"),v=d("link-summary"),s=d("Links"),m=d("Path"),k=d("note"),S=d("list"),i=d("code-block"),p=d("tab"),a=d("tabs"),u=d("chapter"),w=d("snippet"),P=d("warning"),f=d("emphasis"),r=d("def"),y=d("deflist"),x=d("topic");return b(),L("div",null,[l(x,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"文件中的配置",id:"server-configuration-file","help-id":"Configuration-file;server-configuration-in-file"},{default:e(()=>[l(g,{for:"chapter",depth:"2"}),l(v,null,{default:e(()=>n[0]||(n[0]=[t(" 了解如何在配置文件中配置各种服务器参数。 ")])),_:1}),o("p",null,[n[3]||(n[3]=t(" Ktor 允许你配置各种服务器参数，例如主机地址和端口、 ")),l(s,{href:"/ktor/server-modules",summary:"模块允许你通过路由分组来组织应用程序。"},{default:e(()=>n[1]||(n[1]=[t("模块")])),_:1}),n[4]||(n[4]=t(" 加载等。 配置方式取决于你创建服务器的方式，即 ")),l(s,{href:"/ktor/server-create-and-configure",summary:"了解如何根据应用程序部署需求创建服务器。"},{default:e(()=>n[2]||(n[2]=[t(" embeddedServer 或 EngineMain ")])),_:1}),n[5]||(n[5]=t(" 。 "))]),n[135]||(n[135]=o("p",null,[t(" 对于 "),o("code",null,"EngineMain"),t("，Ktor 从使用 "),o("a",{href:"https://github.com/lightbend/config/blob/master/HOCON.md"}," HOCON "),t(" 或 YAML 格式的配置文件加载其配置。这种方式提供了更大的灵活性来配置服务器，并允许你在不重新编译应用程序的情况下更改配置。此外，你可以从命令行运行应用程序，并通过传递相应的 "),o("a",{href:"#command-line"}," 命令行 "),t(" 实参来覆盖所需的服务器参数。 ")],-1)),l(u,{title:"概述",id:"configuration-file-overview"},{default:e(()=>[o("p",null,[n[8]||(n[8]=t(" 如果你使用 ")),n[9]||(n[9]=o("a",{href:"#engine-main"}," EngineMain ",-1)),n[10]||(n[10]=t(" 启动服务器，Ktor 会自动从位于 ")),l(m,null,{default:e(()=>n[6]||(n[6]=[t("resources")])),_:1}),n[11]||(n[11]=t(" 目录中的名为 ")),l(m,null,{default:e(()=>n[7]||(n[7]=[t("application.*")])),_:1}),n[12]||(n[12]=t(" 的文件加载配置设置。支持两种配置格式： "))]),l(S,null,{default:e(()=>[o("li",null,[o("p",null,[n[14]||(n[14]=t(" HOCON ( ")),l(m,null,{default:e(()=>n[13]||(n[13]=[t("application.conf")])),_:1}),n[15]||(n[15]=t(" ) "))])]),o("li",null,[o("p",null,[n[17]||(n[17]=t(" YAML ( ")),l(m,null,{default:e(()=>n[16]||(n[16]=[t("application.yaml")])),_:1}),n[18]||(n[18]=t(" ) "))]),l(k,null,{default:e(()=>[o("p",null,[n[20]||(n[20]=t(" 要使用 YAML 配置文件，你需要添加 ")),n[21]||(n[21]=o("code",null,"ktor-server-config-yaml",-1)),l(s,{href:"/ktor/server-dependencies",summary:"了解如何向现有的 Gradle/Maven 项目添加 Ktor Server 依赖项。"},{default:e(()=>n[19]||(n[19]=[t(" 依赖项 ")])),_:1}),n[22]||(n[22]=t(" 。 "))])]),_:1})])]),_:1}),o("p",null,[n[24]||(n[24]=t(" 配置文件中应至少包含使用 ")),n[25]||(n[25]=o("code",null,"ktor.application.modules",-1)),n[26]||(n[26]=t(" 属性指定的 ")),l(s,{href:"/ktor/server-modules",summary:"模块允许你通过路由分组来组织应用程序。"},{default:e(()=>n[23]||(n[23]=[t(" 要加载的模块 ")])),_:1}),n[27]||(n[27]=t(" ，例如： "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-2"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-2"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),o("p",null,[n[29]||(n[29]=t(" 在这种情况下，Ktor 会调用以下 ")),l(m,null,{default:e(()=>n[28]||(n[28]=[t("Application.kt")])),_:1}),n[30]||(n[30]=t(" 文件中的 ")),n[31]||(n[31]=o("code",null,"Application.module",-1)),n[32]||(n[32]=t(" 函数： "))]),l(i,{lang:"kotlin",code:`package com.example

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
}`}),n[46]||(n[46]=o("p",null,[t(" 除了要加载的模块之外，你还可以配置各种服务器设置，包括 "),o("a",{href:"#predefined-properties"},"预定义的"),t(" （例如端口或主机、SSL 设置等）和自定义设置。 让我们看几个例子。 ")],-1)),l(u,{title:"基本配置",id:"config-basic"},{default:e(()=>[n[33]||(n[33]=o("p",null,[t(" 在下面的示例中，服务器侦听端口使用 "),o("code",null,"ktor.deployment.port"),t(" 属性设置为 "),o("code",null,"8080"),t("。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-3"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-3"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1})]),_:1}),l(u,{title:"引擎配置",id:"config-engine"},{default:e(()=>[l(w,{id:"engine-main-configuration"},{default:e(()=>[n[35]||(n[35]=o("p",null,[t(" 如果你使用 "),o("code",null,"EngineMain"),t("，可以在 "),o("code",null,"ktor.deployment"),t(" 组中指定所有引擎通用的选项。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                            ktor {
                                deployment {
                                    connectionGroupSize = 2
                                    workerGroupSize = 5
                                    callGroupSize = 10
                                    shutdownGracePeriod = 2000
                                    shutdownTimeout = 3000
                                }
                            }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"engine-main-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`                           ktor:
                               deployment:
                                   connectionGroupSize: 2
                                   workerGroupSize: 5
                                   callGroupSize: 10
                                   shutdownGracePeriod: 2000
                                   shutdownTimeout: 3000`})]),_:1})]),_:1}),l(u,{title:"Netty",id:"netty-file"},{default:e(()=>[n[34]||(n[34]=o("p",null,[t(" 你还可以在配置文件中 "),o("code",null,"ktor.deployment"),t(" 组内配置 Netty 特有的选项： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:e(()=>[l(i,{lang:"shell",code:`                               ktor {
                                   deployment {
                                       maxInitialLineLength = 2048
                                       maxHeaderSize = 1024
                                       maxChunkSize = 42
                                   }
                               }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:e(()=>[l(i,{lang:"yaml",code:`                               ktor:
                                   deployment:
                                       maxInitialLineLength: 2048
                                       maxHeaderSize: 1024
                                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(u,{title:"SSL 配置",id:"config-ssl"},{default:e(()=>[o("p",null,[n[37]||(n[37]=t(" 下面的示例使 Ktor 能够侦听 ")),n[38]||(n[38]=o("code",null,"8443",-1)),n[39]||(n[39]=t(" SSL 端口，并在单独的 ")),n[40]||(n[40]=o("code",null,"security",-1)),n[41]||(n[41]=t(" 代码块中指定所需的 ")),l(s,{href:"/ktor/server-ssl",summary:"所需依赖项：io.ktor:ktor-network-tls-certificates 代码示例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[36]||(n[36]=[t(" SSL 设置 ")])),_:1}),n[42]||(n[42]=t(" 。 "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
        sslPort = 8443
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }

    security {
        ssl {
            keyStore = keystore.jks
            keyAlias = sampleAlias
            keyStorePassword = foobar
            privateKeyPassword = foobar
        }
    }
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
        sslPort: 8443
    application:
        modules:
            - com.example.ApplicationKt.module

    security:
        ssl:
            keyStore: keystore.jks
            keyAlias: sampleAlias
            keyStorePassword: foobar
            privateKeyPassword: foobar`})]),_:1})]),_:1})]),_:1}),l(u,{title:"自定义配置",id:"config-custom"},{default:e(()=>[n[44]||(n[44]=o("p",null,[t(" 除了指定"),o("a",{href:"#predefined-properties"},"预定义属性"),t("之外， Ktor 允许你在配置文件中保留自定义设置。 下面的配置文件包含一个用于保存 "),o("a",{href:"#jwt-settings"},"JWT"),t(" 设置的自定义 "),o("code",null,"jwt"),t(" 组。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-4"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
    }

    application {
        modules = [ com.example.ApplicationKt.main ]
    }
}

jwt {
    secret = "secret"
    issuer = "http://0.0.0.0:8080/"
    audience = "http://0.0.0.0:8080/hello"
    realm = "Access to 'hello'"
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-4"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.main

jwt:
    secret: "secret"
    issuer: "http://0.0.0.0:8080/"
    audience: "http://0.0.0.0:8080/hello"
    realm: "Access to 'hello'"`})]),_:1})]),_:1}),n[45]||(n[45]=o("p",null,[t(" 你可以在代码中"),o("a",{href:"#read-configuration-in-code"},"读取和处理此类设置"),t("。 ")],-1)),l(P,null,{default:e(()=>n[43]||(n[43]=[o("p",null,[t(" 请注意，敏感数据（如密钥、数据库连接设置等）不应以纯文本形式存储在配置文件中。请考虑使用 "),o("a",{href:"#environment-variables"}," 环境变量 "),t(" 来指定此类参数。 ")],-1)])),_:1})]),_:1})]),_:1}),l(u,{title:"预定义属性",id:"predefined-properties"},{default:e(()=>[n[88]||(n[88]=o("p",null,[t(" 以下是可以在"),o("a",{href:"#configuration-file-overview"},"配置文件"),t("中使用的预定义设置列表。 ")],-1)),l(y,{type:"wide"},{default:e(()=>[l(r,{title:"ktor.deployment.host",id:"ktor-deployment-host"},{default:e(()=>[n[50]||(n[50]=o("p",null," 主机地址。 ",-1)),o("p",null,[l(f,null,{default:e(()=>n[47]||(n[47]=[t("示例")])),_:1}),n[48]||(n[48]=t(" : ")),n[49]||(n[49]=o("code",null,"0.0.0.0",-1))])]),_:1}),l(r,{title:"ktor.deployment.port",id:"ktor-deployment-port"},{default:e(()=>[n[56]||(n[56]=o("p",null,[t(" 侦听端口。你可以将此属性设置为 "),o("code",null,"0"),t("，以便在随机端口上运行服务器。 ")],-1)),o("p",null,[l(f,null,{default:e(()=>n[51]||(n[51]=[t("示例")])),_:1}),n[52]||(n[52]=t(" : ")),n[53]||(n[53]=o("code",null,"8080",-1)),n[54]||(n[54]=t(", ")),n[55]||(n[55]=o("code",null,"0",-1))])]),_:1}),l(r,{title:"ktor.deployment.sslPort",id:"ktor-deployment-ssl-port"},{default:e(()=>[n[63]||(n[63]=o("p",null,[t(" 侦听 SSL 端口。你可以将此属性设置为 "),o("code",null,"0"),t("，以便在随机端口上运行服务器。 ")],-1)),o("p",null,[l(f,null,{default:e(()=>n[57]||(n[57]=[t("示例")])),_:1}),n[58]||(n[58]=t(" : ")),n[59]||(n[59]=o("code",null,"8443",-1)),n[60]||(n[60]=t(", ")),n[61]||(n[61]=o("code",null,"0",-1))]),l(k,null,{default:e(()=>n[62]||(n[62]=[o("p",null,[t(" 请注意，SSL 需要"),o("a",{href:"#ssl"},"下面列出的"),t("额外选项。 ")],-1)])),_:1})]),_:1}),l(r,{title:"ktor.deployment.watch",id:"ktor-deployment-watch"},{default:e(()=>n[64]||(n[64]=[o("p",null,[t(" 用于"),o("a",{href:"#watch-paths"},"自动重新加载"),t("的监听路径。 ")],-1)])),_:1}),l(r,{title:"ktor.deployment.rootPath",id:"ktor-deployment-root-path"},{default:e(()=>[o("p",null,[n[66]||(n[66]=t(" 一个")),l(s,{href:"/ktor/server-war",summary:"了解如何使用 WAR 归档在 Servlet 容器中运行和部署 Ktor 应用程序。"},{default:e(()=>n[65]||(n[65]=[t("servlet")])),_:1}),n[67]||(n[67]=t("上下文路径。 "))]),o("p",null,[l(f,null,{default:e(()=>n[68]||(n[68]=[t("示例")])),_:1}),n[69]||(n[69]=t(" : ")),n[70]||(n[70]=o("code",null,"/",-1))])]),_:1}),l(r,{title:"ktor.deployment.shutdown.url",id:"ktor-deployment-shutdown-url"},{default:e(()=>[o("p",null,[n[72]||(n[72]=t(" 一个关闭 URL。 请注意，此选项使用")),l(s,{href:"/ktor/server-shutdown-url",summary:"代码示例： %example_name%"},{default:e(()=>n[71]||(n[71]=[t("关闭 URL")])),_:1}),n[73]||(n[73]=t(" 插件。 "))])]),_:1}),l(r,{title:"ktor.deployment.shutdownGracePeriod",id:"ktor-deployment-shutdown-grace-period"},{default:e(()=>n[74]||(n[74]=[o("p",null," 服务器停止接受新请求的最长时间（以毫秒为单位）。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.shutdownTimeout",id:"ktor-deployment-shutdown-timeout"},{default:e(()=>n[75]||(n[75]=[o("p",null," 等待服务器完全停止的最长时间（以毫秒为单位）。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.callGroupSize",id:"ktor-deployment-call-group-size"},{default:e(()=>n[76]||(n[76]=[o("p",null," 用于处理应用程序调用的线程池的最小大小。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.connectionGroupSize",id:"ktor-deployment-connection-group-size"},{default:e(()=>n[77]||(n[77]=[o("p",null," 用于接受新连接并启动调用处理的线程数。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.workerGroupSize",id:"ktor-deployment-worker-group-size"},{default:e(()=>n[78]||(n[78]=[o("p",null," 用于处理连接、解析消息和执行引擎内部工作的事件组的大小。 ",-1)])),_:1})]),_:1}),o("p",j,[n[80]||(n[80]=t(" 如果你设置了 ")),n[81]||(n[81]=o("code",null,"ktor.deployment.sslPort",-1)),n[82]||(n[82]=t("，则需要指定以下 ")),l(s,{href:"/ktor/server-ssl",summary:"所需依赖项：io.ktor:ktor-network-tls-certificates 代码示例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[79]||(n[79]=[t(" SSL 特有的 ")])),_:1}),n[83]||(n[83]=t(" 属性： "))]),l(y,{type:"wide"},{default:e(()=>[l(r,{title:"ktor.security.ssl.keyStore",id:"ktor-security-ssl-keystore"},{default:e(()=>n[84]||(n[84]=[o("p",null," 一个 SSL 密钥库。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.keyAlias",id:"ktor-security-ssl-key-alias"},{default:e(()=>n[85]||(n[85]=[o("p",null," SSL 密钥库的别名。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.keyStorePassword",id:"ktor-security-ssl-keystore-password"},{default:e(()=>n[86]||(n[86]=[o("p",null," SSL 密钥库的密码。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.privateKeyPassword",id:"ktor-security-ssl-private-key-password"},{default:e(()=>n[87]||(n[87]=[o("p",null," SSL 私钥的密码。 ",-1)])),_:1})]),_:1})]),_:1}),l(u,{title:"环境变量",id:"environment-variables"},{default:e(()=>[n[89]||(n[89]=o("p",null,[t(" 在配置文件中，你可以使用 "),o("code",null,"${ENV}"),t(" / "),o("code",null,"$ENV"),t(" 语法将参数替换为环境变量。 例如，你可以通过以下方式将 "),o("code",null,"PORT"),t(" 环境变量赋值给 "),o("code",null,"ktor.deployment.port"),t(" 属性： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"env-var-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = \${PORT}
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"env-var-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: $PORT`})]),_:1})]),_:1}),n[90]||(n[90]=o("p",null,[t(" 在这种情况下，环境变量值将用于指定侦听端口。 如果 "),o("code",null,"PORT"),t(" 环境变量在运行时不存在，你可以按如下方式提供默认端口值： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"config-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                            port = \${?PORT}
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: "$PORT:8080"`})]),_:1})]),_:1})]),_:1}),l(u,{title:"在代码中读取配置",id:"read-configuration-in-code"},{default:e(()=>[n[91]||(n[91]=o("p",null,[t(" Ktor 允许你访问配置文件中指定的属性值。 例如，如果你指定了 "),o("code",null,"ktor.deployment.port"),t(" 属性，... ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"config-conf-1"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml-1"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: 8080`})]),_:1})]),_:1}),n[92]||(n[92]=o("p",null,[t(" ... 你可以使用 "),o("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html"}," ApplicationEnvironment.config "),t(" 访问应用程序的配置，并按以下方式获取所需的属性值： ")],-1)),l(i,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.response.*
            import io.ktor.server.routing.*

            fun Application.module() {
                val port = environment.config.propertyOrNull("ktor.deployment.port")?.getString() ?: "8080"
                routing {
                    get {
                        call.respondText("Listening on port $port")
                    }
                }
            }`}),n[93]||(n[93]=o("p",null,[t(" 当你将"),o("a",{href:"#custom-property"},"自定义设置"),t("保存在配置文件中并需要访问其值时，这尤其有用。 ")],-1))]),_:1}),l(u,{title:"命令行",id:"command-line"},{default:e(()=>[o("p",null,[n[95]||(n[95]=t(" 如果你使用")),n[96]||(n[96]=o("a",{href:"#engine-main"},"EngineMain",-1)),n[97]||(n[97]=t("创建服务器，你可以从命令行运行")),l(s,{href:"/ktor/server-fatjar",summary:"了解如何使用 Ktor Gradle 插件创建和运行可执行 fat JAR。"},{default:e(()=>n[94]||(n[94]=[t("打包好的应用程序")])),_:1}),n[98]||(n[98]=t("，并通过传递相应的命令行实参来覆盖所需的服务器参数。例如，你可以通过以下方式覆盖配置文件中指定的端口： "))]),l(i,{lang:"shell",code:"            java -jar sample-app.jar -port=8080"}),n[119]||(n[119]=o("p",null," 可用命令行选项如下： ",-1)),l(y,{type:"narrow"},{default:e(()=>[l(r,{title:"-jar",id:"jar"},{default:e(()=>n[99]||(n[99]=[o("p",null," JAR 文件的路径。 ",-1)])),_:1}),l(r,{title:"-config",id:"config"},{default:e(()=>[o("p",null,[n[102]||(n[102]=t(" 自定义配置文件的路径，用于替代 resources 中的 ")),l(m,null,{default:e(()=>n[100]||(n[100]=[t("application.conf")])),_:1}),n[103]||(n[103]=t(" / ")),l(m,null,{default:e(()=>n[101]||(n[101]=[t("application.yaml")])),_:1}),n[104]||(n[104]=t(" 。 "))]),o("p",null,[l(f,null,{default:e(()=>n[105]||(n[105]=[t("示例")])),_:1}),n[106]||(n[106]=t(" : ")),n[107]||(n[107]=o("code",null,"java -jar sample-app.jar -config=anotherfile.conf",-1))]),o("p",null,[l(f,null,{default:e(()=>n[108]||(n[108]=[t("注意")])),_:1}),n[109]||(n[109]=t(" : 你可以传递多个值。 ")),n[110]||(n[110]=o("code",null,"java -jar sample-app.jar -config=config-base.conf -config=config-dev.conf",-1)),n[111]||(n[111]=t("。在这种情况下，所有配置都将合并，其中右侧配置中的值具有更高优先级。 "))])]),_:1}),l(r,{title:"-host",id:"host"},{default:e(()=>n[112]||(n[112]=[o("p",null," 主机地址。 ",-1)])),_:1}),l(r,{title:"-port",id:"port"},{default:e(()=>n[113]||(n[113]=[o("p",null," 侦听端口。 ",-1)])),_:1}),l(r,{title:"-watch",id:"watch"},{default:e(()=>n[114]||(n[114]=[o("p",null,[t(" 用于"),o("a",{href:"#watch-paths"},"自动重新加载"),t("的监听路径。 ")],-1)])),_:1})]),_:1}),o("p",null,[l(s,{href:"/ktor/server-ssl",summary:"所需依赖项：io.ktor:ktor-network-tls-certificates 代码示例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[115]||(n[115]=[t("SSL 特有的")])),_:1}),n[116]||(n[116]=t("选项： "))]),l(y,{type:"narrow"},{default:e(()=>[l(r,{title:"-sslPort",id:"ssl-port"},{default:e(()=>n[117]||(n[117]=[o("p",null," 侦听 SSL 端口。 ",-1)])),_:1}),l(r,{title:"-sslKeyStore",id:"ssl-keystore"},{default:e(()=>n[118]||(n[118]=[o("p",null," 一个 SSL 密钥库。 ",-1)])),_:1})]),_:1}),n[120]||(n[120]=o("p",null,[t(" 如果你需要覆盖没有相应命令行选项的"),o("a",{href:"#predefined-properties"},"预定义属性"),t("，请使用 "),o("code",null,"-P"),t(" 标志，例如： ")],-1)),l(i,{code:"            java -jar sample-app.jar -P:ktor.deployment.callGroupSize=7"}),n[121]||(n[121]=o("p",null,[t(" 你还可以使用 "),o("code",null,"-P"),t(" 标志来覆盖"),o("a",{href:"#config-custom"},"自定义属性"),t("。 ")],-1))]),_:1}),l(u,{title:"示例：如何使用自定义属性指定环境",id:"custom-property"},{default:e(()=>[o("p",null,[n[124]||(n[124]=t(" 你可能希望根据服务器是在本地运行还是在生产机器上运行来执行不同的操作。为此，你可以在 ")),l(m,null,{default:e(()=>n[122]||(n[122]=[t("application.conf")])),_:1}),n[125]||(n[125]=t(" / ")),l(m,null,{default:e(()=>n[123]||(n[123]=[t("application.yaml")])),_:1}),n[126]||(n[126]=t(" 中添加一个自定义属性，并使用一个专用")),n[127]||(n[127]=o("a",{href:"#environment-variables"},"环境变量",-1)),n[128]||(n[128]=t("对其进行初始化，该变量的值取决于服务器是在本地运行还是在生产环境中运行。在下面的示例中，")),n[129]||(n[129]=o("code",null,"KTOR_ENV",-1)),n[130]||(n[130]=t(" 环境变量被赋值给自定义的 ")),n[131]||(n[131]=o("code",null,"ktor.environment",-1)),n[132]||(n[132]=t(" 属性。 "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-5"},{default:e(()=>[l(i,{code:`ktor {
    environment = \${?KTOR_ENV}
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-5"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
                environment: $?KTOR_ENV`})]),_:1})]),_:1}),n[133]||(n[133]=o("p",null,[t(" 你可以在运行时通过"),o("a",{href:"#read-configuration-in-code"},"在代码中读取配置"),t("来访问 "),o("code",null,"ktor.environment"),t(" 值并执行所需操作： ")],-1)),l(i,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module() {
    val env = environment.config.propertyOrNull("ktor.environment")?.getString()
    routing {
        get {
            call.respondText(when (env) {
                "dev" -> "Development"
                "prod" -> "Production"
                else -> "..."
            })
        }
    }
}`}),n[134]||(n[134]=o("p",null,[t(" 你可以在此处找到完整示例： "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-custom-environment"}," engine-main-custom-environment "),t("。 ")],-1))]),_:1})]),_:1})])}const M=A(K,[["render",O]]);export{$ as __pageData,M as default};
