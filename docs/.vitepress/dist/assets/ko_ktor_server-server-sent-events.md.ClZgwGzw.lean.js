import{_ as z,C as s,c as x,o as N,G as l,w as o,j as t,a as n}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ko/ktor/server-server-sent-events.md","filePath":"ko/ktor/server-server-sent-events.md","lastUpdated":1755522191000}'),I={name:"ko/ktor/server-server-sent-events.md"};function T($,e,C,L,P,J){const m=s("show-structure"),k=s("primary-label"),f=s("tldr"),g=s("link-summary"),E=s("snippet"),u=s("Links"),b=s("tip"),a=s("note"),i=s("chapter"),r=s("code-block"),d=s("tab"),v=s("tabs"),S=s("list"),p=s("def"),y=s("deflist"),w=s("topic");return N(),x("div",null,[l(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"server-server-sent-events",title:"Ktor 서버의 Server-Sent Events (SSE)","help-id":"sse_server"},{default:o(()=>[l(m,{for:"chapter",depth:"2"}),l(k,{ref:"server-plugin"},null,512),l(f,null,{default:o(()=>e[0]||(e[0]=[t("p",null,[t("b",null,"필수 의존성"),n(": "),t("code",null,"io.ktor:ktor-server-sse")],-1),t("p",null,[t("b",null,"코드 예시"),n(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"}," server-sse ")],-1)])),_:1}),l(g,null,{default:o(()=>e[1]||(e[1]=[n(" SSE 플러그인을 사용하면 서버가 HTTP 연결을 통해 클라이언트에 이벤트 기반 업데이트를 보낼 수 있습니다. ")])),_:1}),l(E,{id:"sse-description"},{default:o(()=>e[2]||(e[2]=[t("p",null," Server-Sent Events (SSE)는 서버가 HTTP 연결을 통해 클라이언트에 이벤트를 지속적으로 푸시할 수 있도록 하는 기술입니다. 클라이언트가 서버를 반복적으로 폴링할 필요 없이 서버가 이벤트 기반 업데이트를 전송해야 하는 경우에 특히 유용합니다. ",-1),t("p",null," Ktor에서 지원하는 SSE 플러그인은 서버와 클라이언트 간에 단방향 연결을 생성하는 간단한 방법을 제공합니다. ",-1)])),_:1}),l(b,null,{default:o(()=>[t("p",null,[e[4]||(e[4]=n("클라이언트 측 지원을 위한 SSE 플러그인에 대해 자세히 알아보려면 다음을 참조하십시오: ")),l(u,{href:"/ktor/client-server-sent-events",summary:"SSE 플러그인을 사용하면 클라이언트가 HTTP 연결을 통해 서버로부터 이벤트 기반 업데이트를 받을 수 있습니다."},{default:o(()=>e[3]||(e[3]=[n("SSE 클라이언트 플러그인")])),_:1}),e[5]||(e[5]=n(" . "))])]),_:1}),l(a,null,{default:o(()=>[t("p",null,[e[7]||(e[7]=n(" 양방향 통신에는 ")),l(u,{href:"/ktor/server-websockets",summary:"Websockets 플러그인을 사용하면 서버와 클라이언트 간에 양방향 통신 세션을 생성할 수 있습니다."},{default:o(()=>e[6]||(e[6]=[n("WebSockets")])),_:1}),e[8]||(e[8]=n(" 사용을 고려하십시오. WebSockets는 Websocket 프로토콜을 사용하여 서버와 클라이언트 간에 전이중 통신을 제공합니다. "))])]),_:1}),l(i,{title:"제한 사항",id:"limitations"},{default:o(()=>[t("p",null,[e[10]||(e[10]=n(" Ktor는 SSE 응답에 대한 데이터 압축을 지원하지 않습니다. 만약 ")),l(u,{href:"/ktor/server-compression",summary:"필수 의존성: io.ktor:ktor-server-sse 코드 예시: server-sse 네이티브 서버 지원: ✖️"},{default:o(()=>e[9]||(e[9]=[n("Compression")])),_:1}),e[11]||(e[11]=n(" 플러그인을 사용하는 경우, 기본적으로 SSE 응답에 대한 압축을 건너뜁니다. "))])]),_:1}),l(i,{title:"의존성 추가",id:"add_dependencies"},{default:o(()=>[e[12]||(e[12]=t("p",null,[t("code",null,"SSE"),n("을(를) 사용하려면 빌드 스크립트에 "),t("code",null,"ktor-server-sse"),n(" 아티팩트를 포함해야 합니다: ")],-1)),l(v,{group:"languages"},{default:o(()=>[l(d,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:o(()=>[l(r,{lang:"Kotlin",code:'                    implementation("io.ktor:ktor-server-sse:$ktor_version")'})]),_:1}),l(d,{title:"Gradle (Groovy)","group-key":"groovy"},{default:o(()=>[l(r,{lang:"Groovy",code:'                    implementation "io.ktor:ktor-server-sse:$ktor_version"'})]),_:1}),l(d,{title:"Maven","group-key":"maven"},{default:o(()=>[l(r,{lang:"XML",code:`                    <dependency>
                        <groupId>io.ktor</groupId>
                        <artifactId>ktor-server-sse-jvm</artifactId>
                        <version>\${ktor_version}</version>
                    </dependency>`})]),_:1})]),_:1})]),_:1}),l(i,{title:"SSE 설치",id:"install_plugin"},{default:o(()=>[t("p",null,[e[14]||(e[14]=t("code",null,"SSE",-1)),e[15]||(e[15]=n(" 플러그인을 애플리케이션에 ")),e[16]||(e[16]=t("a",{href:"#install"},"설치",-1)),e[17]||(e[17]=n("하려면, 지정된 ")),l(u,{href:"/ktor/server-modules",summary:"모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다."},{default:o(()=>e[13]||(e[13]=[n("모듈")])),_:1}),e[18]||(e[18]=n("의 ")),e[19]||(e[19]=t("code",null,"install",-1)),e[20]||(e[20]=n(" 함수에 전달하십시오. 아래 코드 스니펫은 ")),e[21]||(e[21]=t("code",null,"SSE",-1)),e[22]||(e[22]=n("을(를) 설치하는 방법을 보여줍니다... "))]),l(S,null,{default:o(()=>e[23]||(e[23]=[t("li",null,[n(" ... "),t("code",null,"embeddedServer"),n(" 함수 호출 내부에. ")],-1),t("li",null,[n(" ... "),t("code",null,"Application"),n(" 클래스의 확장 함수인 명시적으로 정의된 "),t("code",null,"module"),n(" 내부에. ")],-1)])),_:1}),l(v,null,{default:o(()=>[l(d,{title:"embeddedServer"},{default:o(()=>[l(r,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.netty.*
                    import io.ktor.server.application.*
                    import io.ktor.server.sse.*
        
                    fun main() {
                        embeddedServer(Netty, port = 8080) {
                            install(SSE)
                            // ...
                        }.start(wait = true)
                    }`})]),_:1}),l(d,{title:"module"},{default:o(()=>[l(r,{lang:"kotlin",code:`                    import io.ktor.server.application.*
                    import io.ktor.server.sse.*
                    // ...
                    fun Application.module() {
                        install(SSE)
                        // ...
                    }`})]),_:1})]),_:1})]),_:1}),l(i,{title:"SSE 세션 처리",id:"handle-sessions"},{default:o(()=>[e[44]||(e[44]=t("p",null,[t("code",null,"SSE"),n(" 플러그인을 설치한 후, SSE 세션을 처리할 라우트를 추가할 수 있습니다. 이를 위해 "),t("a",{href:"#define_route"},"라우팅"),n(" 블록 내에서 "),t("code",null,"sse()"),n(" 함수를 호출합니다. SSE 라우트를 설정하는 두 가지 방법이 있습니다: ")],-1)),l(S,{type:"decimal"},{default:o(()=>[t("li",null,[e[24]||(e[24]=t("p",null,"특정 URL 경로 사용:",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse(&quot;/events&quot;) {
                            // send events to clients
                        }
                    }`})]),t("li",null,[e[25]||(e[25]=t("p",null," 경로 없음: ",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse {
                            // send events to clients
                        }
                    }`})])]),_:1}),l(i,{title:"SSE 세션 블록",id:"session-block"},{default:o(()=>[e[35]||(e[35]=t("p",null,[t("code",null,"sse"),n(" 블록 내에서 지정된 경로에 대한 핸들러를 정의하는데, 이는 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html"},[t("code",null,"ServerSSESession")]),n(" 클래스로 표현됩니다. 이 블록 내에서 다음 함수와 속성을 사용할 수 있습니다:")],-1)),l(y,null,{default:o(()=>[l(p,{id:"send"},{default:o(()=>e[26]||(e[26]=[t("title",null,"<code>send()</code>",-1),t("code",null,"ServerSentEvent",-1),n("를 생성하여 클라이언트에 전송합니다. ")])),_:1}),l(p,{id:"call"},{default:o(()=>e[27]||(e[27]=[t("title",null,"<code>call</code>",-1),n(" 세션을 시작한 연결된 수신 "),t("code",null,"ApplicationCall",-1),n("입니다. ")])),_:1}),l(p,{id:"close"},{default:o(()=>[e[29]||(e[29]=t("title",null,"<code>close()</code>",-1)),e[30]||(e[30]=n(" 세션을 닫고 클라이언트와의 연결을 종료합니다. ")),e[31]||(e[31]=t("code",null,"close()",-1)),e[32]||(e[32]=n(" 메서드는 모든 ")),e[33]||(e[33]=t("code",null,"send()",-1)),e[34]||(e[34]=n(" 작업이 완료되면 자동으로 호출됩니다. ")),l(a,null,{default:o(()=>e[28]||(e[28]=[t("code",null,"close()",-1),n(" 함수를 사용하여 세션을 닫는다고 해서 클라이언트에 종료 이벤트가 전송되는 것은 아닙니다. 세션을 닫기 전에 SSE 스트림의 끝을 알리려면 "),t("code",null,"send()",-1),n(" 함수를 사용하여 특정 이벤트를 전송하십시오. ")])),_:1})]),_:1})]),_:1})]),_:1}),l(i,{title:"예시: 단일 세션 처리",id:"handle-single-session"},{default:o(()=>[e[36]||(e[36]=t("p",null,[n(" 아래 예시는 "),t("code",null,"/events"),n(" 엔드포인트에 SSE 세션을 설정하고, 각 이벤트 사이에 1초(1000ms) 지연을 두어 SSE 채널을 통해 6개의 개별 이벤트를 전송하는 방법을 보여줍니다: ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/events") {
            repeat(6) {
                send(ServerSentEvent("this is SSE #$it"))
                delay(1000)
            }
        }
    }`}),e[37]||(e[37]=t("p",null,[n("전체 예시는 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("를 참조하십시오. ")],-1))]),_:1}),l(i,{title:"SSE 하트비트",id:"heartbeat"},{default:o(()=>[e[38]||(e[38]=t("p",null," 하트비트는 비활성 기간 동안 이벤트를 주기적으로 전송하여 SSE 연결이 활성 상태를 유지하도록 보장합니다. 세션이 활성 상태로 유지되는 한, 서버는 구성된 간격으로 지정된 이벤트를 전송합니다. ",-1)),e[39]||(e[39]=t("p",null,[n(" 하트비트를 활성화하고 구성하려면 SSE 라우트 핸들러 내에서 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html"},[t("code",null,".heartbeat()")]),n(" 함수를 사용하십시오: ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/heartbeat") {
            heartbeat {
                period = 10.milliseconds
                event = ServerSentEvent("heartbeat")
            }
            // ...
        }
    }`}),e[40]||(e[40]=t("p",null," 이 예시에서는 연결을 유지하기 위해 10밀리초마다 하트비트 이벤트가 전송됩니다. ",-1))]),_:1}),l(i,{title:"직렬화",id:"serialization"},{default:o(()=>[e[41]||(e[41]=t("p",null,[n(" 직렬화를 활성화하려면 SSE 라우트에서 "),t("code",null,"serialize"),n(" 매개변수를 사용하여 사용자 정의 직렬화 함수를 제공하십시오. 핸들러 내에서 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html"},[t("code",null,"ServerSSESessionWithSerialization")]),n(" 클래스를 사용하여 직렬화된 이벤트를 전송할 수 있습니다: ")],-1)),l(r,{lang:"kotlin",code:`@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)

@Serializable
data class Product(val id: Int, val prices: List<Int>)

fun Application.module() {
    install(SSE)

    routing {
        // example with serialization
        sse("/json", serialize = { typeInfo, it ->
            val serializer = Json.serializersModule.serializer(typeInfo.kotlinType!!)
            Json.encodeToString(serializer, it)
        }) {
            send(Customer(0, "Jet", "Brains"))
            send(Product(0, listOf(100, 200)))
        }
    }
}`}),e[42]||(e[42]=t("p",null,[n(" 이 예시의 "),t("code",null,"serialize"),n(" 함수는 데이터 객체를 JSON으로 변환하는 역할을 하며, 변환된 JSON은 "),t("code",null,"ServerSentEvent"),n("의 "),t("code",null,"data"),n(" 필드에 배치됩니다. ")],-1)),e[43]||(e[43]=t("p",null,[n("전체 예시는 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("를 참조하십시오. ")],-1))]),_:1})]),_:1})]),_:1})])}const W=z(I,[["render",T]]);export{K as __pageData,W as default};
