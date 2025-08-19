import{_ as A,C as d,c as L,o as K,G as l,w as e,j as o,a as t}from"./chunks/framework.Bksy39di.js";const $=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-configuration-file.md","filePath":"zh-Hant/ktor/server-configuration-file.md","lastUpdated":1755457140000}'),b={name:"zh-Hant/ktor/server-configuration-file.md"},j={id:"ssl"};function z(O,n,G,N,T,R){const g=d("show-structure"),v=d("link-summary"),s=d("Links"),m=d("Path"),k=d("note"),S=d("list"),i=d("code-block"),p=d("tab"),a=d("tabs"),u=d("chapter"),w=d("snippet"),P=d("warning"),f=d("emphasis"),r=d("def"),y=d("deflist"),x=d("topic");return K(),L("div",null,[l(x,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"在檔案中設定",id:"server-configuration-file","help-id":"Configuration-file;server-configuration-in-file"},{default:e(()=>[l(g,{for:"chapter",depth:"2"}),l(v,null,{default:e(()=>n[0]||(n[0]=[t(" 瞭解如何在配置檔案中設定各種伺服器參數。 ")])),_:1}),o("p",null,[n[3]||(n[3]=t(" Ktor 允許您設定各種伺服器參數，例如主機位址和連接埠、要載入的 ")),l(s,{href:"/ktor/server-modules",summary:"模組允許您透過將路由分組來組織您的應用程式。"},{default:e(()=>n[1]||(n[1]=[t("模組")])),_:1}),n[4]||(n[4]=t(" 等等。 配置取決於您用於建立伺服器的方式 — ")),l(s,{href:"/ktor/server-create-and-configure",summary:"瞭解如何根據您的應用程式部署需求建立伺服器。"},{default:e(()=>n[2]||(n[2]=[t(" embeddedServer 或 EngineMain ")])),_:1}),n[5]||(n[5]=t(" 。 "))]),n[134]||(n[134]=o("p",null,[t(" 對於 "),o("code",null,"EngineMain"),t("，Ktor 會從使用 "),o("a",{href:"https://github.com/lightbend/config/blob/master/HOCON.md"}," HOCON "),t(" 或 YAML 格式的配置檔案中載入其配置。這種方式為設定伺服器提供了更大的彈性，並允許您在不重新編譯應用程式的情況下更改配置。此外，您可以從命令列執行應用程式，並透過傳遞對應的 "),o("a",{href:"#command-line"}," 命令列 "),t(" 引數來覆寫所需的伺服器參數。 ")],-1)),l(u,{title:"概覽",id:"configuration-file-overview"},{default:e(()=>[o("p",null,[n[8]||(n[8]=t(" 如果您使用 ")),n[9]||(n[9]=o("a",{href:"#engine-main"}," EngineMain ",-1)),n[10]||(n[10]=t(" 來啟動伺服器，Ktor 會自動從位於 ")),l(m,null,{default:e(()=>n[6]||(n[6]=[t("resources")])),_:1}),n[11]||(n[11]=t(" 目錄中名為 ")),l(m,null,{default:e(()=>n[7]||(n[7]=[t("application.*")])),_:1}),n[12]||(n[12]=t(" 的檔案載入配置設定。支援兩種配置格式： "))]),l(S,null,{default:e(()=>[o("li",null,[o("p",null,[n[14]||(n[14]=t(" HOCON ( ")),l(m,null,{default:e(()=>n[13]||(n[13]=[t("application.conf")])),_:1}),n[15]||(n[15]=t(" ) "))])]),o("li",null,[o("p",null,[n[17]||(n[17]=t(" YAML ( ")),l(m,null,{default:e(()=>n[16]||(n[16]=[t("application.yaml")])),_:1}),n[18]||(n[18]=t(" ) "))]),l(k,null,{default:e(()=>[o("p",null,[n[20]||(n[20]=t(" 要使用 YAML 配置檔案，您需要新增 ")),n[21]||(n[21]=o("code",null,"ktor-server-config-yaml",-1)),l(s,{href:"/ktor/server-dependencies",summary:"瞭解如何將 Ktor Server 相依性新增到現有的 Gradle/Maven 專案。"},{default:e(()=>n[19]||(n[19]=[t(" 相依性 ")])),_:1}),n[22]||(n[22]=t(" 。 "))])]),_:1})])]),_:1}),o("p",null,[n[24]||(n[24]=t(" 配置檔案應至少包含使用 ")),n[25]||(n[25]=o("code",null,"ktor.application.modules",-1)),n[26]||(n[26]=t(" 屬性指定的 ")),l(s,{href:"/ktor/server-modules",summary:"模組允許您透過將路由分組來組織您的應用程式。"},{default:e(()=>n[23]||(n[23]=[t(" 要載入的模組 ")])),_:1}),n[27]||(n[27]=t(" ，例如： "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-2"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-2"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),o("p",null,[n[29]||(n[29]=t(" 在這種情況下，Ktor 會呼叫下方 ")),l(m,null,{default:e(()=>n[28]||(n[28]=[t("Application.kt")])),_:1}),n[30]||(n[30]=t(" 檔案中的 ")),n[31]||(n[31]=o("code",null,"Application.module",-1)),n[32]||(n[32]=t(" 函數： "))]),l(i,{lang:"kotlin",code:`package com.example

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
}`}),n[46]||(n[46]=o("p",null,[t(" 除了要載入的模組之外，您還可以設定各種伺服器設定，包括 "),o("a",{href:"#predefined-properties"},"預定義"),t(" 的設定（例如連接埠或主機、SSL 設定等）和自訂設定。 讓我們看幾個範例。 ")],-1)),l(u,{title:"基本設定",id:"config-basic"},{default:e(()=>[n[33]||(n[33]=o("p",null,[t(" 在下面的範例中，使用 "),o("code",null,"ktor.deployment.port"),t(" 屬性將伺服器監聽連接埠設定為 "),o("code",null,"8080"),t("。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-3"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
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
            - com.example.ApplicationKt.module`})]),_:1})]),_:1})]),_:1}),l(u,{title:"引擎設定",id:"config-engine"},{default:e(()=>[l(w,{id:"engine-main-configuration"},{default:e(()=>[n[35]||(n[35]=o("p",null,[t(" 如果您使用 "),o("code",null,"EngineMain"),t("，您可以在 "),o("code",null,"ktor.deployment"),t(" 群組中指定所有引擎通用的選項。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                            ktor {
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
                                   shutdownTimeout: 3000`})]),_:1})]),_:1}),l(u,{title:"Netty",id:"netty-file"},{default:e(()=>[n[34]||(n[34]=o("p",null,[t(" 您也可以在配置檔案中的 "),o("code",null,"ktor.deployment"),t(" 群組內設定 Netty 特有選項： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:e(()=>[l(i,{lang:"shell",code:`                               ktor {
                                   deployment {
                                       maxInitialLineLength = 2048
                                       maxHeaderSize = 1024
                                       maxChunkSize = 42
                                   }
                               }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:e(()=>[l(i,{lang:"yaml",code:`                               ktor:
                                   deployment:
                                       maxInitialLineLength: 2048
                                       maxHeaderSize: 1024
                                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),l(u,{title:"SSL 設定",id:"config-ssl"},{default:e(()=>[o("p",null,[n[37]||(n[37]=t(" 以下範例使 Ktor 能夠監聽 ")),n[38]||(n[38]=o("code",null,"8443",-1)),n[39]||(n[39]=t(" SSL 連接埠，並在獨立的 ")),n[40]||(n[40]=o("code",null,"security",-1)),n[41]||(n[41]=t(" 區塊中指定所需的 ")),l(s,{href:"/ktor/server-ssl",summary:"所需相依性：io.ktor:ktor-network-tls-certificates 程式碼範例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[36]||(n[36]=[t(" SSL 設定 ")])),_:1}),n[42]||(n[42]=t(" 。 "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
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
            privateKeyPassword: foobar`})]),_:1})]),_:1})]),_:1}),l(u,{title:"自訂設定",id:"config-custom"},{default:e(()=>[n[44]||(n[44]=o("p",null,[t(" 除了指定 "),o("a",{href:"#predefined-properties"},"預定義屬性"),t(" 之外，Ktor 還允許您將自訂設定保存在配置檔案中。 以下配置檔案包含一個用於儲存 "),o("a",{href:"#jwt-settings"},"JWT"),t(" 設定的自訂 "),o("code",null,"jwt"),t(" 群組。 ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-4"},{default:e(()=>[l(i,{lang:"shell",code:`ktor {
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
    realm: "Access to 'hello'"`})]),_:1})]),_:1}),n[45]||(n[45]=o("p",null,[t(" 您可以在程式碼中 "),o("a",{href:"#read-configuration-in-code"},"讀取和處理此類設定"),t(" 。 ")],-1)),l(P,null,{default:e(()=>n[43]||(n[43]=[o("p",null,[t(" 請注意，敏感資料（如密鑰、資料庫連線設定等）不應以純文字形式儲存在配置檔案中。請考慮使用 "),o("a",{href:"#environment-variables"}," 環境變數 "),t(" 來指定此類參數。 ")],-1)])),_:1})]),_:1})]),_:1}),l(u,{title:"預定義屬性",id:"predefined-properties"},{default:e(()=>[n[87]||(n[87]=o("p",null,[t(" 以下是在 "),o("a",{href:"#configuration-file-overview"}," 配置檔案 "),t(" 中可以使用的預定義設定列表。 ")],-1)),l(y,{type:"wide"},{default:e(()=>[l(r,{title:"ktor.deployment.host",id:"ktor-deployment-host"},{default:e(()=>[n[50]||(n[50]=o("p",null," 主機位址。 ",-1)),o("p",null,[l(f,null,{default:e(()=>n[47]||(n[47]=[t("範例")])),_:1}),n[48]||(n[48]=t(" : ")),n[49]||(n[49]=o("code",null,"0.0.0.0",-1))])]),_:1}),l(r,{title:"ktor.deployment.port",id:"ktor-deployment-port"},{default:e(()=>[n[56]||(n[56]=o("p",null,[t(" 監聽連接埠。您可以將此屬性設定為 "),o("code",null,"0"),t(" 以在隨機連接埠上執行伺服器。 ")],-1)),o("p",null,[l(f,null,{default:e(()=>n[51]||(n[51]=[t("範例")])),_:1}),n[52]||(n[52]=t(" : ")),n[53]||(n[53]=o("code",null,"8080",-1)),n[54]||(n[54]=t(", ")),n[55]||(n[55]=o("code",null,"0",-1))])]),_:1}),l(r,{title:"ktor.deployment.sslPort",id:"ktor-deployment-ssl-port"},{default:e(()=>[n[63]||(n[63]=o("p",null,[t(" 監聽 SSL 連接埠。您可以將此屬性設定為 "),o("code",null,"0"),t(" 以在隨機連接埠上執行伺服器。 ")],-1)),o("p",null,[l(f,null,{default:e(()=>n[57]||(n[57]=[t("範例")])),_:1}),n[58]||(n[58]=t(" : ")),n[59]||(n[59]=o("code",null,"8443",-1)),n[60]||(n[60]=t(", ")),n[61]||(n[61]=o("code",null,"0",-1))]),l(k,null,{default:e(()=>n[62]||(n[62]=[o("p",null,[t(" 請注意，SSL 需要 "),o("a",{href:"#ssl"},"下方列出的"),t(" 額外選項。 ")],-1)])),_:1})]),_:1}),l(r,{title:"ktor.deployment.watch",id:"ktor-deployment-watch"},{default:e(()=>n[64]||(n[64]=[o("p",null,[t(" 用於 "),o("a",{href:"#watch-paths"},"自動重載"),t(" 的監看路徑。 ")],-1)])),_:1}),l(r,{title:"ktor.deployment.rootPath",id:"ktor-deployment-root-path"},{default:e(()=>[o("p",null,[l(s,{href:"/ktor/server-war",summary:"瞭解如何使用 Ktor Gradle 外掛程式在 Servlet 容器中執行和部署 Ktor 應用程式，使用 WAR 歸檔。"},{default:e(()=>n[65]||(n[65]=[t("Servlet")])),_:1}),n[66]||(n[66]=t(" 上下文路徑。 "))]),o("p",null,[l(f,null,{default:e(()=>n[67]||(n[67]=[t("範例")])),_:1}),n[68]||(n[68]=t(" : ")),n[69]||(n[69]=o("code",null,"/",-1))])]),_:1}),l(r,{title:"ktor.deployment.shutdown.url",id:"ktor-deployment-shutdown-url"},{default:e(()=>[o("p",null,[n[71]||(n[71]=t(" 關閉 URL。 請注意，此選項使用 ")),l(s,{href:"/ktor/server-shutdown-url",summary:"程式碼範例：%example_name%"},{default:e(()=>n[70]||(n[70]=[t("關閉 URL")])),_:1}),n[72]||(n[72]=t(" 外掛程式。 "))])]),_:1}),l(r,{title:"ktor.deployment.shutdownGracePeriod",id:"ktor-deployment-shutdown-grace-period"},{default:e(()=>n[73]||(n[73]=[o("p",null," 伺服器停止接受新請求的最大時間（毫秒）。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.shutdownTimeout",id:"ktor-deployment-shutdown-timeout"},{default:e(()=>n[74]||(n[74]=[o("p",null," 等待伺服器完全停止的最大時間（毫秒）。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.callGroupSize",id:"ktor-deployment-call-group-size"},{default:e(()=>n[75]||(n[75]=[o("p",null," 用於處理應用程式呼叫的執行緒池的最小大小。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.connectionGroupSize",id:"ktor-deployment-connection-group-size"},{default:e(()=>n[76]||(n[76]=[o("p",null," 用於接受新連線並開始呼叫處理的執行緒數量。 ",-1)])),_:1}),l(r,{title:"ktor.deployment.workerGroupSize",id:"ktor-deployment-worker-group-size"},{default:e(()=>n[77]||(n[77]=[o("p",null," 用於處理連線、解析訊息和執行引擎內部工作的事件群組的大小。 ",-1)])),_:1})]),_:1}),o("p",j,[n[79]||(n[79]=t(" 如果您已設定 ")),n[80]||(n[80]=o("code",null,"ktor.deployment.sslPort",-1)),n[81]||(n[81]=t("，則需要指定以下 ")),l(s,{href:"/ktor/server-ssl",summary:"所需相依性：io.ktor:ktor-network-tls-certificates 程式碼範例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[78]||(n[78]=[t(" SSL 特有 ")])),_:1}),n[82]||(n[82]=t(" 屬性： "))]),l(y,{type:"wide"},{default:e(()=>[l(r,{title:"ktor.security.ssl.keyStore",id:"ktor-security-ssl-keystore"},{default:e(()=>n[83]||(n[83]=[o("p",null," SSL 密鑰儲存。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.keyAlias",id:"ktor-security-ssl-key-alias"},{default:e(()=>n[84]||(n[84]=[o("p",null," SSL 密鑰儲存的別名。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.keyStorePassword",id:"ktor-security-ssl-keystore-password"},{default:e(()=>n[85]||(n[85]=[o("p",null," SSL 密鑰儲存的密碼。 ",-1)])),_:1}),l(r,{title:"ktor.security.ssl.privateKeyPassword",id:"ktor-security-ssl-private-key-password"},{default:e(()=>n[86]||(n[86]=[o("p",null," SSL 私鑰的密碼。 ",-1)])),_:1})]),_:1})]),_:1}),l(u,{title:"環境變數",id:"environment-variables"},{default:e(()=>[n[88]||(n[88]=o("p",null,[t(" 在配置檔案中，您可以使用 "),o("code",null,"${ENV}"),t(" / "),o("code",null,"$ENV"),t(" 語法將參數替換為環境變數。 例如，您可以透過以下方式將 "),o("code",null,"PORT"),t(" 環境變數指派給 "),o("code",null,"ktor.deployment.port"),t(" 屬性： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"env-var-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = \${PORT}
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"env-var-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: $PORT`})]),_:1})]),_:1}),n[89]||(n[89]=o("p",null,[t(" 在這種情況下，將使用環境變數值來指定監聽連接埠。 如果在執行時期 "),o("code",null,"PORT"),t(" 環境變數不存在，您可以提供預設連接埠值，如下所示： ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"config-conf"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                            port = \${?PORT}
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: "$PORT:8080"`})]),_:1})]),_:1})]),_:1}),l(u,{title:"在程式碼中讀取配置",id:"read-configuration-in-code"},{default:e(()=>[n[90]||(n[90]=o("p",null,[t(" Ktor 允許您在程式碼中存取配置檔案中指定的屬性值。 例如，如果您已指定 "),o("code",null,"ktor.deployment.port"),t(" 屬性，... ")],-1)),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"config-conf-1"},{default:e(()=>[l(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                        }
                    }`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml-1"},{default:e(()=>[l(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: 8080`})]),_:1})]),_:1}),n[91]||(n[91]=o("p",null,[t(" ... 您可以使用 "),o("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html"}," ApplicationEnvironment.config "),t(" 存取應用程式的配置，並透過以下方式取得所需的屬性值： ")],-1)),l(i,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.response.*
            import io.ktor.server.routing.*

            fun Application.module() {
                val port = environment.config.propertyOrNull("ktor.deployment.port")?.getString() ?: "8080"
                routing {
                    get {
                        call.respondText("Listening on port $port")
                    }
                }
            }`}),n[92]||(n[92]=o("p",null,[t(" 當您在配置檔案中保留 "),o("a",{href:"#custom-property"},"自訂設定"),t(" 並需要存取其值時，這尤其有用。 ")],-1))]),_:1}),l(u,{title:"命令列",id:"command-line"},{default:e(()=>[o("p",null,[n[94]||(n[94]=t(" 如果您使用 ")),n[95]||(n[95]=o("a",{href:"#engine-main"},"EngineMain",-1)),n[96]||(n[96]=t(" 來建立伺服器，您可以從命令列執行 ")),l(s,{href:"/ktor/server-fatjar",summary:"瞭解如何使用 Ktor Gradle 外掛程式建立和執行可執行胖 JAR。"},{default:e(()=>n[93]||(n[93]=[t("打包應用程式")])),_:1}),n[97]||(n[97]=t(" ，並透過傳遞對應的命令列引數來覆寫所需的伺服器參數。例如，您可以透過以下方式覆寫配置檔案中指定的連接埠： "))]),l(i,{lang:"shell",code:"            java -jar sample-app.jar -port=8080"}),n[118]||(n[118]=o("p",null," 可用的命令列選項列在下方： ",-1)),l(y,{type:"narrow"},{default:e(()=>[l(r,{title:"-jar",id:"jar"},{default:e(()=>n[98]||(n[98]=[o("p",null," JAR 檔案路徑。 ",-1)])),_:1}),l(r,{title:"-config",id:"config"},{default:e(()=>[o("p",null,[n[101]||(n[101]=t(" 自訂配置檔案的路徑，用於取代 resources 中的 ")),l(m,null,{default:e(()=>n[99]||(n[99]=[t("application.conf")])),_:1}),n[102]||(n[102]=t(" / ")),l(m,null,{default:e(()=>n[100]||(n[100]=[t("application.yaml")])),_:1}),n[103]||(n[103]=t(" 。 "))]),o("p",null,[l(f,null,{default:e(()=>n[104]||(n[104]=[t("範例")])),_:1}),n[105]||(n[105]=t(" : ")),n[106]||(n[106]=o("code",null,"java -jar sample-app.jar -config=anotherfile.conf",-1))]),o("p",null,[l(f,null,{default:e(()=>n[107]||(n[107]=[t("注意")])),_:1}),n[108]||(n[108]=t(" : 您可以傳遞多個值。")),n[109]||(n[109]=o("code",null,"java -jar sample-app.jar -config=config-base.conf -config=config-dev.conf",-1)),n[110]||(n[110]=t("。在這種情況下，所有配置將會合併，其中右側配置中的值將具有優先權。 "))])]),_:1}),l(r,{title:"-host",id:"host"},{default:e(()=>n[111]||(n[111]=[o("p",null," 主機位址。 ",-1)])),_:1}),l(r,{title:"-port",id:"port"},{default:e(()=>n[112]||(n[112]=[o("p",null," 監聽連接埠。 ",-1)])),_:1}),l(r,{title:"-watch",id:"watch"},{default:e(()=>n[113]||(n[113]=[o("p",null,[t(" 用於 "),o("a",{href:"#watch-paths"},"自動重載"),t(" 的監看路徑。 ")],-1)])),_:1})]),_:1}),o("p",null,[l(s,{href:"/ktor/server-ssl",summary:"所需相依性：io.ktor:ktor-network-tls-certificates 程式碼範例：ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[114]||(n[114]=[t("SSL 特有")])),_:1}),n[115]||(n[115]=t(" 選項： "))]),l(y,{type:"narrow"},{default:e(()=>[l(r,{title:"-sslPort",id:"ssl-port"},{default:e(()=>n[116]||(n[116]=[o("p",null," 監聽 SSL 連接埠。 ",-1)])),_:1}),l(r,{title:"-sslKeyStore",id:"ssl-keystore"},{default:e(()=>n[117]||(n[117]=[o("p",null," SSL 密鑰儲存。 ",-1)])),_:1})]),_:1}),n[119]||(n[119]=o("p",null,[t(" 如果您需要覆寫沒有對應命令列選項的 "),o("a",{href:"#predefined-properties"},"預定義屬性"),t(" ，請使用 "),o("code",null,"-P"),t(" 旗標，例如： ")],-1)),l(i,{code:"            java -jar sample-app.jar -P:ktor.deployment.callGroupSize=7"}),n[120]||(n[120]=o("p",null,[t(" 您也可以使用 "),o("code",null,"-P"),t(" 旗標來覆寫 "),o("a",{href:"#config-custom"},"自訂屬性"),t(" 。 ")],-1))]),_:1}),l(u,{title:"範例：如何使用自訂屬性指定環境",id:"custom-property"},{default:e(()=>[o("p",null,[n[123]||(n[123]=t(" 您可能希望根據伺服器是在本機執行還是在生產機器上執行來執行不同的操作。為此，您可以在 ")),l(m,null,{default:e(()=>n[121]||(n[121]=[t("application.conf")])),_:1}),n[124]||(n[124]=t(" / ")),l(m,null,{default:e(()=>n[122]||(n[122]=[t("application.yaml")])),_:1}),n[125]||(n[125]=t(" 中新增一個自訂屬性，並使用專用的 ")),n[126]||(n[126]=o("a",{href:"#environment-variables"},"環境變數",-1)),n[127]||(n[127]=t(" 初始化它，該變數的值取決於伺服器是在本機還是生產環境中執行。在下面的範例中，")),n[128]||(n[128]=o("code",null,"KTOR_ENV",-1)),n[129]||(n[129]=t(" 環境變數被指派給自訂的 ")),n[130]||(n[130]=o("code",null,"ktor.environment",-1)),n[131]||(n[131]=t(" 屬性。 "))]),l(a,{group:"config"},{default:e(()=>[l(p,{title:"application.conf","group-key":"hocon",id:"application-conf-5"},{default:e(()=>[l(i,{code:`ktor {
    environment = \${?KTOR_ENV}
}`})]),_:1}),l(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-5"},{default:e(()=>[l(i,{lang:"yaml",code:`ktor:
    environment: $?KTOR_ENV`})]),_:1})]),_:1}),n[132]||(n[132]=o("p",null,[t(" 您可以在執行時期透過 "),o("a",{href:"#read-configuration-in-code"}," 在程式碼中讀取配置 "),t(" 來存取 "),o("code",null,"ktor.environment"),t(" 值並執行所需動作： ")],-1)),l(i,{lang:"kotlin",code:`import io.ktor.server.application.*
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
}`}),n[133]||(n[133]=o("p",null,[t(" 您可以在此處找到完整範例： "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-custom-environment"}," engine-main-custom-environment "),t("。 ")],-1))]),_:1})]),_:1})])}const M=A(b,[["render",z]]);export{$ as __pageData,M as default};
