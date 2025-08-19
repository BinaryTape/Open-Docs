import{_ as x,C as d,c as L,o as K,G as o,w as e,j as l,a as t}from"./chunks/framework.Bksy39di.js";const $=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-configuration-file.md","filePath":"ko/ktor/server-configuration-file.md","lastUpdated":1755457140000}'),j={name:"ko/ktor/server-configuration-file.md"},b={id:"ssl"};function z(T,n,G,N,O,R){const g=d("show-structure"),v=d("link-summary"),s=d("Links"),m=d("Path"),k=d("note"),S=d("list"),i=d("code-block"),p=d("tab"),a=d("tabs"),u=d("chapter"),w=d("snippet"),A=d("warning"),f=d("emphasis"),r=d("def"),y=d("deflist"),P=d("topic");return K(),L("div",null,[o(P,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"파일을 통한 설정",id:"server-configuration-file","help-id":"Configuration-file;server-configuration-in-file"},{default:e(()=>[o(g,{for:"chapter",depth:"2"}),o(v,null,{default:e(()=>n[0]||(n[0]=[t(" 설정 파일에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요. ")])),_:1}),l("p",null,[n[3]||(n[3]=t(" Ktor를 사용하면 호스트 주소와 포트, ")),o(s,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다."},{default:e(()=>n[1]||(n[1]=[t("모듈")])),_:1}),n[4]||(n[4]=t(" 로드 등 다양한 서버 매개변수를 구성할 수 있습니다. 설정은 서버를 생성한 방식에 따라 달라집니다. ")),o(s,{href:"/ktor/server-create-and-configure",summary:"애플리케이션 배포 요구 사항에 따라 서버를 생성하는 방법을 알아보세요."},{default:e(()=>n[2]||(n[2]=[l("code",null,"embeddedServer",-1),t(" 또는 "),l("code",null,"EngineMain",-1)])),_:1}),n[5]||(n[5]=t(" . "))]),n[133]||(n[133]=l("p",null,[l("code",null,"EngineMain"),t("의 경우, Ktor는 HOCON 또는 YAML 형식을 사용하는 설정 파일에서 구성을 로드합니다. 이 방법은 서버를 구성하는 데 더 많은 유연성을 제공하며 애플리케이션을 다시 컴파일하지 않고도 구성을 변경할 수 있도록 합니다. 또한, 명령줄에서 애플리케이션을 실행하고 해당 "),l("a",{href:"#command-line"},"명령줄"),t(" 인수를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다. ")],-1)),o(u,{title:"개요",id:"configuration-file-overview"},{default:e(()=>[l("p",null,[n[7]||(n[7]=l("a",{href:"#engine-main"},"EngineMain",-1)),n[8]||(n[8]=t("을 사용하여 서버를 시작하면 Ktor는 ")),n[9]||(n[9]=l("code",null,"resources",-1)),n[10]||(n[10]=t(" 디렉터리에 있는 ")),o(m,null,{default:e(()=>n[6]||(n[6]=[t("application.*")])),_:1}),n[11]||(n[11]=t("이라는 파일에서 자동으로 설정 설정을 로드합니다. 두 가지 설정 형식이 지원됩니다: "))]),o(S,null,{default:e(()=>[l("li",null,[l("p",null,[n[13]||(n[13]=t(" HOCON ( ")),o(m,null,{default:e(()=>n[12]||(n[12]=[t("application.conf")])),_:1}),n[14]||(n[14]=t(" ) "))])]),l("li",null,[l("p",null,[n[16]||(n[16]=t(" YAML ( ")),o(m,null,{default:e(()=>n[15]||(n[15]=[t("application.yaml")])),_:1}),n[17]||(n[17]=t(" ) "))]),o(k,null,{default:e(()=>[l("p",null,[n[19]||(n[19]=t(" YAML 설정 파일을 사용하려면 ")),n[20]||(n[20]=l("code",null,"ktor-server-config-yaml",-1)),n[21]||(n[21]=t()),o(s,{href:"/ktor/server-dependencies",summary:"기존 Gradle/Maven 프로젝트에 Ktor 서버 의존성을 추가하는 방법을 알아보세요."},{default:e(()=>n[18]||(n[18]=[t("의존성")])),_:1}),n[22]||(n[22]=t("을 추가해야 합니다. "))])]),_:1})])]),_:1}),l("p",null,[n[24]||(n[24]=t(" 설정 파일은 최소한 ")),n[25]||(n[25]=l("code",null,"ktor.application.modules",-1)),n[26]||(n[26]=t(" 속성을 사용하여 지정된 ")),o(s,{href:"/ktor/server-modules",summary:"모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다."},{default:e(()=>n[23]||(n[23]=[t("로드할 모듈")])),_:1}),n[27]||(n[27]=t("을 포함해야 합니다. 예를 들면 다음과 같습니다: "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-2"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-2"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1}),l("p",null,[n[29]||(n[29]=t(" 이 경우 Ktor는 아래 ")),o(m,null,{default:e(()=>n[28]||(n[28]=[t("Application.kt")])),_:1}),n[30]||(n[30]=t(" 파일의 ")),n[31]||(n[31]=l("code",null,"Application.module",-1)),n[32]||(n[32]=t(" 함수를 호출합니다: "))]),o(i,{lang:"kotlin",code:`package com.example

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
}`}),n[46]||(n[46]=l("p",null,[t(" 로드할 모듈 외에도 "),l("a",{href:"#predefined-properties"},"미리 정의된"),t(" (예: 포트 또는 호스트, SSL 설정 등) 설정과 사용자 지정 설정을 포함하여 다양한 서버 설정을 구성할 수 있습니다. 몇 가지 예를 살펴보겠습니다. ")],-1)),o(u,{title:"기본 설정",id:"config-basic"},{default:e(()=>[n[33]||(n[33]=l("p",null,[t(" 아래 예시에서 서버 수신 포트는 "),l("code",null,"ktor.deployment.port"),t(" 속성을 사용하여 "),l("code",null,"8080"),t("으로 설정됩니다. ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-3"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
    deployment {
        port = 8080
    }
    application {
        modules = [ com.example.ApplicationKt.module ]
    }
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-3"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.module`})]),_:1})]),_:1})]),_:1}),o(u,{title:"엔진 설정",id:"config-engine"},{default:e(()=>[o(w,{id:"engine-main-configuration"},{default:e(()=>[n[35]||(n[35]=l("p",null,[l("code",null,"EngineMain"),t("을 사용하는 경우, "),l("code",null,"ktor.deployment"),t(" 그룹 내에서 모든 엔진에 공통적인 옵션을 지정할 수 있습니다. ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                            ktor {
                                deployment {
                                    connectionGroupSize = 2
                                    workerGroupSize = 5
                                    callGroupSize = 10
                                    shutdownGracePeriod = 2000
                                    shutdownTimeout = 3000
                                }
                            }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"engine-main-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                           ktor:
                               deployment:
                                   connectionGroupSize: 2
                                   workerGroupSize: 5
                                   callGroupSize: 10
                                   shutdownGracePeriod: 2000
                                   shutdownTimeout: 3000`})]),_:1})]),_:1}),o(u,{title:"Netty",id:"netty-file"},{default:e(()=>[n[34]||(n[34]=l("p",null,[l("code",null,"ktor.deployment"),t(" 그룹 내의 설정 파일에서 Netty 관련 옵션도 구성할 수 있습니다: ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:e(()=>[o(i,{lang:"shell",code:`                               ktor {
                                   deployment {
                                       maxInitialLineLength = 2048
                                       maxHeaderSize = 1024
                                       maxChunkSize = 42
                                   }
                               }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:e(()=>[o(i,{lang:"yaml",code:`                               ktor:
                                   deployment:
                                       maxInitialLineLength: 2048
                                       maxHeaderSize: 1024
                                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),o(u,{title:"SSL 설정",id:"config-ssl"},{default:e(()=>[l("p",null,[n[37]||(n[37]=t(" 아래 예시는 Ktor가 ")),n[38]||(n[38]=l("code",null,"8443",-1)),n[39]||(n[39]=t(" SSL 포트에서 수신하도록 활성화하고, 별도의 ")),n[40]||(n[40]=l("code",null,"security",-1)),n[41]||(n[41]=t(" 블록에서 필요한 ")),o(s,{href:"/ktor/server-ssl",summary:"필수 의존성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[36]||(n[36]=[t("SSL 설정")])),_:1}),n[42]||(n[42]=t("을 지정합니다. "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
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
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
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
            privateKeyPassword: foobar`})]),_:1})]),_:1})]),_:1}),o(u,{title:"사용자 지정 설정",id:"config-custom"},{default:e(()=>[n[44]||(n[44]=l("p",null,[l("a",{href:"#predefined-properties"},"미리 정의된 속성"),t("을 지정하는 것 외에도 Ktor는 설정 파일에 사용자 지정 설정을 유지할 수 있도록 합니다. 아래 설정 파일에는 "),l("a",{href:"#jwt-settings"},"JWT"),t(" 설정을 유지하는 데 사용되는 사용자 지정 "),l("code",null,"jwt"),t(" 그룹이 포함되어 있습니다. ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-4"},{default:e(()=>[o(i,{lang:"shell",code:`ktor {
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
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-4"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    deployment:
        port: 8080
    application:
        modules:
            - com.example.ApplicationKt.main

jwt:
    secret: "secret"
    issuer: "http://0.0.0.0:8080/"
    audience: "http://0.0.0.0:8080/hello"
    realm: "Access to 'hello'"`})]),_:1})]),_:1}),n[45]||(n[45]=l("p",null,[t(" 코드에서 이러한 설정을 "),l("a",{href:"#read-configuration-in-code"},"읽고 처리"),t("할 수 있습니다. ")],-1)),o(A,null,{default:e(()=>n[43]||(n[43]=[l("p",null,[t(" 비밀 키, 데이터베이스 연결 설정 등과 같은 민감한 데이터는 설정 파일에 일반 텍스트로 저장해서는 안 됩니다. 이러한 매개변수를 지정하려면 "),l("a",{href:"#environment-variables"},"환경 변수"),t("를 사용하는 것을 고려하세요. ")],-1)])),_:1})]),_:1})]),_:1}),o(u,{title:"미리 정의된 속성",id:"predefined-properties"},{default:e(()=>[n[86]||(n[86]=l("p",null,[t(" 아래는 "),l("a",{href:"#configuration-file-overview"},"설정 파일"),t(" 내에서 사용할 수 있는 미리 정의된 설정 목록입니다. ")],-1)),o(y,{type:"wide"},{default:e(()=>[o(r,{title:"ktor.deployment.host",id:"ktor-deployment-host"},{default:e(()=>[n[50]||(n[50]=l("p",null," 호스트 주소. ",-1)),l("p",null,[o(f,null,{default:e(()=>n[47]||(n[47]=[t("예시")])),_:1}),n[48]||(n[48]=t(" : ")),n[49]||(n[49]=l("code",null,"0.0.0.0",-1))])]),_:1}),o(r,{title:"ktor.deployment.port",id:"ktor-deployment-port"},{default:e(()=>[n[56]||(n[56]=l("p",null,[t(" 수신 포트. 이 속성을 "),l("code",null,"0"),t("으로 설정하여 서버를 임의 포트에서 실행할 수 있습니다. ")],-1)),l("p",null,[o(f,null,{default:e(()=>n[51]||(n[51]=[t("예시")])),_:1}),n[52]||(n[52]=t(" : ")),n[53]||(n[53]=l("code",null,"8080",-1)),n[54]||(n[54]=t(", ")),n[55]||(n[55]=l("code",null,"0",-1))])]),_:1}),o(r,{title:"ktor.deployment.sslPort",id:"ktor-deployment-ssl-port"},{default:e(()=>[n[63]||(n[63]=l("p",null,[t(" 수신 SSL 포트. 이 속성을 "),l("code",null,"0"),t("으로 설정하여 서버를 임의 포트에서 실행할 수 있습니다. ")],-1)),l("p",null,[o(f,null,{default:e(()=>n[57]||(n[57]=[t("예시")])),_:1}),n[58]||(n[58]=t(" : ")),n[59]||(n[59]=l("code",null,"8443",-1)),n[60]||(n[60]=t(", ")),n[61]||(n[61]=l("code",null,"0",-1))]),o(k,null,{default:e(()=>n[62]||(n[62]=[l("p",null,[t(" SSL에는 "),l("a",{href:"#ssl"},"아래에 나열된"),t(" 추가 옵션이 필요합니다. ")],-1)])),_:1})]),_:1}),o(r,{title:"ktor.deployment.watch",id:"ktor-deployment-watch"},{default:e(()=>n[64]||(n[64]=[l("p",null,[l("a",{href:"#watch-paths"},"자동 재로드"),t("에 사용되는 감시 경로. ")],-1)])),_:1}),o(r,{title:"ktor.deployment.rootPath",id:"ktor-deployment-root-path"},{default:e(()=>[l("p",null,[o(s,{href:"/ktor/server-war",summary:"WAR 아카이브를 사용하여 서블릿 컨테이너 내에서 Ktor 애플리케이션을 실행하고 배포하는 방법을 알아보세요."},{default:e(()=>n[65]||(n[65]=[t("서블릿")])),_:1}),n[66]||(n[66]=t(" 컨텍스트 경로. "))]),l("p",null,[o(f,null,{default:e(()=>n[67]||(n[67]=[t("예시")])),_:1}),n[68]||(n[68]=t(" : ")),n[69]||(n[69]=l("code",null,"/",-1))])]),_:1}),o(r,{title:"ktor.deployment.shutdown.url",id:"ktor-deployment-shutdown-url"},{default:e(()=>[l("p",null,[n[71]||(n[71]=t(" 종료 URL. 이 옵션은 ")),o(s,{href:"/ktor/server-shutdown-url",summary:"코드 예시: %example_name%"},{default:e(()=>n[70]||(n[70]=[t("종료 URL")])),_:1}),n[72]||(n[72]=t(" 플러그인을 사용합니다. "))])]),_:1}),o(r,{title:"ktor.deployment.shutdownGracePeriod",id:"ktor-deployment-shutdown-grace-period"},{default:e(()=>n[73]||(n[73]=[l("p",null," 서버가 새 요청 수신을 중지하기 위한 최대 시간(밀리초). ",-1)])),_:1}),o(r,{title:"ktor.deployment.shutdownTimeout",id:"ktor-deployment-shutdown-timeout"},{default:e(()=>n[74]||(n[74]=[l("p",null," 서버가 완전히 중지될 때까지 기다릴 최대 시간(밀리초). ",-1)])),_:1}),o(r,{title:"ktor.deployment.callGroupSize",id:"ktor-deployment-call-group-size"},{default:e(()=>n[75]||(n[75]=[l("p",null," 애플리케이션 호출을 처리하는 데 사용되는 스레드 풀의 최소 크기. ",-1)])),_:1}),o(r,{title:"ktor.deployment.connectionGroupSize",id:"ktor-deployment-connection-group-size"},{default:e(()=>n[76]||(n[76]=[l("p",null," 새 연결을 수락하고 호출 처리를 시작하는 데 사용되는 스레드 수. ",-1)])),_:1}),o(r,{title:"ktor.deployment.workerGroupSize",id:"ktor-deployment-worker-group-size"},{default:e(()=>n[77]||(n[77]=[l("p",null," 연결 처리, 메시지 구문 분석 및 엔진의 내부 작업을 수행하기 위한 이벤트 그룹의 크기. ",-1)])),_:1})]),_:1}),l("p",b,[n[79]||(n[79]=l("code",null,"ktor.deployment.sslPort",-1)),n[80]||(n[80]=t("를 설정한 경우, 다음 ")),o(s,{href:"/ktor/server-ssl",summary:"필수 의존성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[78]||(n[78]=[t("SSL 관련")])),_:1}),n[81]||(n[81]=t(" 속성을 지정해야 합니다: "))]),o(y,{type:"wide"},{default:e(()=>[o(r,{title:"ktor.security.ssl.keyStore",id:"ktor-security-ssl-keystore"},{default:e(()=>n[82]||(n[82]=[l("p",null," SSL 키 저장소. ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.keyAlias",id:"ktor-security-ssl-key-alias"},{default:e(()=>n[83]||(n[83]=[l("p",null," SSL 키 저장소의 별칭. ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.keyStorePassword",id:"ktor-security-ssl-keystore-password"},{default:e(()=>n[84]||(n[84]=[l("p",null," SSL 키 저장소의 비밀번호. ",-1)])),_:1}),o(r,{title:"ktor.security.ssl.privateKeyPassword",id:"ktor-security-ssl-private-key-password"},{default:e(()=>n[85]||(n[85]=[l("p",null," SSL 개인 키의 비밀번호. ",-1)])),_:1})]),_:1})]),_:1}),o(u,{title:"환경 변수",id:"environment-variables"},{default:e(()=>[n[87]||(n[87]=l("p",null,[t(" 설정 파일에서 "),l("code",null,"${ENV}"),t(" / "),l("code",null,"$ENV"),t(" 구문을 사용하여 매개변수를 환경 변수로 대체할 수 있습니다. 예를 들어, "),l("code",null,"PORT"),t(" 환경 변수를 "),l("code",null,"ktor.deployment.port"),t(" 속성에 다음과 같이 할당할 수 있습니다: ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"env-var-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = \${PORT}
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"env-var-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: $PORT`})]),_:1})]),_:1}),n[88]||(n[88]=l("p",null,[t(" 이 경우, 환경 변수 값이 수신 포트를 지정하는 데 사용됩니다. 런타임에 "),l("code",null,"PORT"),t(" 환경 변수가 존재하지 않으면, 다음과 같이 기본 포트 값을 제공할 수 있습니다: ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"config-conf"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                            port = \${?PORT}
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: "$PORT:8080"`})]),_:1})]),_:1})]),_:1}),o(u,{title:"코드에서 설정 읽기",id:"read-configuration-in-code"},{default:e(()=>[n[89]||(n[89]=l("p",null,[t(" Ktor를 사용하면 코드에서 설정 파일 내에 지정된 속성 값에 접근할 수 있습니다. 예를 들어, "),l("code",null,"ktor.deployment.port"),t(" 속성을 지정했다면... ")],-1)),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"config-conf-1"},{default:e(()=>[o(i,{lang:"shell",code:`                    ktor {
                        deployment {
                            port = 8080
                        }
                    }`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"config-yaml-1"},{default:e(()=>[o(i,{lang:"yaml",code:`                    ktor:
                        deployment:
                            port: 8080`})]),_:1})]),_:1}),n[90]||(n[90]=l("p",null,[t(" ... "),l("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html"},"ApplicationEnvironment.config"),t("를 사용하여 애플리케이션 설정에 접근하고 다음과 같이 필요한 속성 값을 얻을 수 있습니다: ")],-1)),o(i,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.response.*
            import io.ktor.server.routing.*

            fun Application.module() {
                val port = environment.config.propertyOrNull("ktor.deployment.port")?.getString() ?: "8080"
                routing {
                    get {
                        call.respondText("Listening on port $port")
                    }
                }
            }`}),n[91]||(n[91]=l("p",null,[t(" 이것은 설정 파일에 "),l("a",{href:"#custom-property"},"사용자 지정 설정"),t("을 유지하고 해당 값에 접근해야 할 때 특히 유용합니다. ")],-1))]),_:1}),o(u,{title:"명령줄",id:"command-line"},{default:e(()=>[l("p",null,[n[93]||(n[93]=l("a",{href:"#engine-main"},"EngineMain",-1)),n[94]||(n[94]=t("을 사용하여 서버를 생성하는 경우, 명령줄에서 ")),o(s,{href:"/ktor/server-fatjar",summary:"Ktor Gradle 플러그인을 사용하여 실행 가능한 단일 JAR(fat JAR)을 생성하고 실행하는 방법을 알아보세요."},{default:e(()=>n[92]||(n[92]=[t("패키징된 애플리케이션")])),_:1}),n[95]||(n[95]=t("을 실행하고 해당 명령줄 인수를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다. 예를 들어, 설정 파일에 지정된 포트를 다음과 같이 재정의할 수 있습니다: "))]),o(i,{lang:"shell",code:"            java -jar sample-app.jar -port=8080"}),n[117]||(n[117]=l("p",null," 사용 가능한 명령줄 옵션은 다음과 같습니다: ",-1)),o(y,{type:"narrow"},{default:e(()=>[o(r,{title:"-jar",id:"jar"},{default:e(()=>n[96]||(n[96]=[l("p",null," JAR 파일 경로. ",-1)])),_:1}),o(r,{title:"-config",id:"config"},{default:e(()=>[l("p",null,[n[99]||(n[99]=l("code",null,"resources",-1)),n[100]||(n[100]=t("의 ")),o(m,null,{default:e(()=>n[97]||(n[97]=[t("application.conf")])),_:1}),n[101]||(n[101]=t(" / ")),o(m,null,{default:e(()=>n[98]||(n[98]=[t("application.yaml")])),_:1}),n[102]||(n[102]=t(" 대신 사용되는 사용자 지정 설정 파일 경로. "))]),l("p",null,[o(f,null,{default:e(()=>n[103]||(n[103]=[t("예시")])),_:1}),n[104]||(n[104]=t(" : ")),n[105]||(n[105]=l("code",null,"java -jar sample-app.jar -config=anotherfile.conf",-1))]),l("p",null,[o(f,null,{default:e(()=>n[106]||(n[106]=[t("참고")])),_:1}),n[107]||(n[107]=t(" : 여러 값을 전달할 수 있습니다. ")),n[108]||(n[108]=l("code",null,"java -jar sample-app.jar -config=config-base.conf -config=config-dev.conf",-1)),n[109]||(n[109]=t(". 이 경우 모든 설정이 병합되며, 오른쪽 설정의 값이 우선권을 가집니다. "))])]),_:1}),o(r,{title:"-host",id:"host"},{default:e(()=>n[110]||(n[110]=[l("p",null," 호스트 주소. ",-1)])),_:1}),o(r,{title:"-port",id:"port"},{default:e(()=>n[111]||(n[111]=[l("p",null," 수신 포트. ",-1)])),_:1}),o(r,{title:"-watch",id:"watch"},{default:e(()=>n[112]||(n[112]=[l("p",null,[l("a",{href:"#watch-paths"},"자동 재로드"),t("에 사용되는 감시 경로. ")],-1)])),_:1})]),_:1}),l("p",null,[o(s,{href:"/ktor/server-ssl",summary:"필수 의존성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server"},{default:e(()=>n[113]||(n[113]=[t("SSL 관련")])),_:1}),n[114]||(n[114]=t(" 옵션: "))]),o(y,{type:"narrow"},{default:e(()=>[o(r,{title:"-sslPort",id:"ssl-port"},{default:e(()=>n[115]||(n[115]=[l("p",null," 수신 SSL 포트. ",-1)])),_:1}),o(r,{title:"-sslKeyStore",id:"ssl-keystore"},{default:e(()=>n[116]||(n[116]=[l("p",null," SSL 키 저장소. ",-1)])),_:1})]),_:1}),n[118]||(n[118]=l("p",null,[t(" 해당하는 명령줄 옵션이 없는 "),l("a",{href:"#predefined-properties"},"미리 정의된 속성"),t("을 재정의해야 하는 경우, "),l("code",null,"-P"),t(" 플래그를 사용하세요. 예를 들면 다음과 같습니다: ")],-1)),o(i,{code:"            java -jar sample-app.jar -P:ktor.deployment.callGroupSize=7"}),n[119]||(n[119]=l("p",null,[t(" 또한 "),l("code",null,"-P"),t(" 플래그를 사용하여 "),l("a",{href:"#config-custom"},"사용자 지정 속성"),t("을 재정의할 수 있습니다. ")],-1))]),_:1}),o(u,{title:"예시: 사용자 지정 속성을 사용하여 환경 지정 방법",id:"custom-property"},{default:e(()=>[l("p",null,[n[122]||(n[122]=t(" 서버가 로컬에서 실행 중인지 또는 프로덕션 환경에서 실행 중인지에 따라 다른 작업을 수행하고 싶을 수 있습니다. 이를 위해 ")),o(m,null,{default:e(()=>n[120]||(n[120]=[t("application.conf")])),_:1}),n[123]||(n[123]=t(" / ")),o(m,null,{default:e(()=>n[121]||(n[121]=[t("application.yaml")])),_:1}),n[124]||(n[124]=t("에 사용자 지정 속성을 추가하고, 서버가 로컬에서 실행 중인지 프로덕션에서 실행 중인지에 따라 값이 달라지는 전용 ")),n[125]||(n[125]=l("a",{href:"#environment-variables"},"환경 변수",-1)),n[126]||(n[126]=t("로 초기화할 수 있습니다. 아래 예시에서는 ")),n[127]||(n[127]=l("code",null,"KTOR_ENV",-1)),n[128]||(n[128]=t(" 환경 변수가 사용자 지정 ")),n[129]||(n[129]=l("code",null,"ktor.environment",-1)),n[130]||(n[130]=t(" 속성에 할당됩니다. "))]),o(a,{group:"config"},{default:e(()=>[o(p,{title:"application.conf","group-key":"hocon",id:"application-conf-5"},{default:e(()=>[o(i,{code:`ktor {
    environment = \${?KTOR_ENV}
}`})]),_:1}),o(p,{title:"application.yaml","group-key":"yaml",id:"application-yaml-5"},{default:e(()=>[o(i,{lang:"yaml",code:`ktor:
    environment: $?KTOR_ENV`})]),_:1})]),_:1}),n[131]||(n[131]=l("p",null,[t(" 런타임에 "),l("a",{href:"#read-configuration-in-code"},"코드에서 설정을 읽어"),t(),l("code",null,"ktor.environment"),t(" 값에 접근하고 필요한 작업을 수행할 수 있습니다: ")],-1)),o(i,{lang:"kotlin",code:`import io.ktor.server.application.*
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
}`}),n[132]||(n[132]=l("p",null,[t(" 전체 예시는 다음에서 찾을 수 있습니다: "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/engine-main-custom-environment"}," engine-main-custom-environment "),t(". ")],-1))]),_:1})]),_:1})])}const M=x(j,[["render",z]]);export{$ as __pageData,M as default};
