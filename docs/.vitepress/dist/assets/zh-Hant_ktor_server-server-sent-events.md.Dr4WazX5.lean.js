import{_ as w,C as s,c as x,o as I,G as l,w as o,j as t,a as n}from"./chunks/framework.Bksy39di.js";const J=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-server-sent-events.md","filePath":"zh-Hant/ktor/server-server-sent-events.md","lastUpdated":1755522191000}'),N={name:"zh-Hant/ktor/server-server-sent-events.md"};function T($,e,C,L,P,H){const m=s("show-structure"),k=s("primary-label"),f=s("tldr"),g=s("link-summary"),E=s("snippet"),u=s("Links"),b=s("tip"),a=s("note"),i=s("chapter"),r=s("code-block"),d=s("tab"),v=s("tabs"),S=s("list"),p=s("def"),y=s("deflist"),z=s("topic");return I(),x("div",null,[l(z,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"server-server-sent-events",title:"Ktor 伺服器中的伺服器傳送事件 (Server-Sent Events)","help-id":"sse_server"},{default:o(()=>[l(m,{for:"chapter",depth:"2"}),l(k,{ref:"server-plugin"},null,512),l(f,null,{default:o(()=>e[0]||(e[0]=[t("p",null,[t("b",null,"必要依賴項"),n("："),t("code",null,"io.ktor:ktor-server-sse")],-1),t("p",null,[t("b",null,"程式碼範例"),n("： "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"}," server-sse ")],-1)])),_:1}),l(g,null,{default:o(()=>e[1]||(e[1]=[n(" SSE 插件允許伺服器透過 HTTP 連線向客戶端傳送基於事件的更新。 ")])),_:1}),l(E,{id:"sse-description"},{default:o(()=>e[2]||(e[2]=[t("p",null," 伺服器傳送事件 (Server-Sent Events, SSE) 是一種技術，允許伺服器透過 HTTP 連線不斷向客戶端推送事件。 當伺服器需要傳送基於事件的更新而無需客戶端重複輪詢伺服器時，這項技術特別有用。 ",-1),t("p",null," Ktor 支援的 SSE 插件提供了一種直接的方法，用於在伺服器和客戶端之間建立單向連線。 ",-1)])),_:1}),l(b,null,{default:o(()=>[t("p",null,[e[4]||(e[4]=n("要了解更多關於客戶端支援的 SSE 插件，請參閱 ")),l(u,{href:"/ktor/client-server-sent-events",summary:"SSE 插件允許客戶端透過 HTTP 連線從伺服器接收基於事件的更新。"},{default:o(()=>e[3]||(e[3]=[n("SSE 客戶端插件")])),_:1}),e[5]||(e[5]=n(" 。 "))])]),_:1}),l(a,null,{default:o(()=>[t("p",null,[e[7]||(e[7]=n(" 對於多向通訊，請考慮使用 ")),l(u,{href:"/ktor/server-websockets",summary:"Websockets 插件允許您在伺服器和客戶端之間建立多向通訊會話。"},{default:o(()=>e[6]||(e[6]=[n("WebSockets")])),_:1}),e[8]||(e[8]=n(" 。它們使用 Websocket 協定在伺服器和客戶端之間提供全雙工通訊。 "))])]),_:1}),l(i,{title:"限制",id:"limitations"},{default:o(()=>[t("p",null,[e[10]||(e[10]=n(" Ktor 不支援 SSE 回應的資料壓縮。 如果您使用 ")),l(u,{href:"/ktor/server-compression",summary:"必要依賴項：io.ktor:ktor-server-sse 程式碼範例：server-sse 原生伺服器支援：✖️"},{default:o(()=>e[9]||(e[9]=[n("Compression")])),_:1}),e[11]||(e[11]=n(" 插件，它將預設跳過 SSE 回應的壓縮。 "))])]),_:1}),l(i,{title:"新增依賴項",id:"add_dependencies"},{default:o(()=>[e[12]||(e[12]=t("p",null,[n(" 要使用 "),t("code",null,"SSE"),n("，您需要在建置腳本中包含 "),t("code",null,"ktor-server-sse"),n(" 構件： ")],-1)),l(v,{group:"languages"},{default:o(()=>[l(d,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:o(()=>[l(r,{lang:"Kotlin",code:'                    implementation("io.ktor:ktor-server-sse:$ktor_version")'})]),_:1}),l(d,{title:"Gradle (Groovy)","group-key":"groovy"},{default:o(()=>[l(r,{lang:"Groovy",code:'                    implementation "io.ktor:ktor-server-sse:$ktor_version"'})]),_:1}),l(d,{title:"Maven","group-key":"maven"},{default:o(()=>[l(r,{lang:"XML",code:`                    <dependency>
                        <groupId>io.ktor</groupId>
                        <artifactId>ktor-server-sse-jvm</artifactId>
                        <version>\${ktor_version}</version>
                    </dependency>`})]),_:1})]),_:1})]),_:1}),l(i,{title:"安裝 SSE",id:"install_plugin"},{default:o(()=>[t("p",null,[e[14]||(e[14]=n(" 要將 ")),e[15]||(e[15]=t("code",null,"SSE",-1)),e[16]||(e[16]=n(" 插件")),e[17]||(e[17]=t("a",{href:"#install"},"安裝",-1)),e[18]||(e[18]=n("到應用程式中，請將其傳遞給指定")),l(u,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:o(()=>e[13]||(e[13]=[n("模組")])),_:1}),e[19]||(e[19]=n("中的 ")),e[20]||(e[20]=t("code",null,"install",-1)),e[21]||(e[21]=n(" 函數。 下面的程式碼片段展示了如何安裝 ")),e[22]||(e[22]=t("code",null,"SSE",-1)),e[23]||(e[23]=n(" ... "))]),l(S,null,{default:o(()=>e[24]||(e[24]=[t("li",null,[n(" ... 在 "),t("code",null,"embeddedServer"),n(" 函數呼叫內部。 ")],-1),t("li",null,[n(" ... 在明確定義的 "),t("code",null,"module"),n(" 內部，它是一個 "),t("code",null,"Application"),n(" 類別的擴充函數。 ")],-1)])),_:1}),l(v,null,{default:o(()=>[l(d,{title:"embeddedServer"},{default:o(()=>[l(r,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1})]),_:1})]),_:1}),l(i,{title:"處理 SSE 會話",id:"handle-sessions"},{default:o(()=>[e[45]||(e[45]=t("p",null,[n(" 安裝 "),t("code",null,"SSE"),n(" 插件後，您可以新增路由來處理 SSE 會話。 為此，請在 "),t("a",{href:"#define_route"},"路由"),n(" 區塊內部呼叫 "),t("code",null,"sse()"),n(" 函數。有兩種方式可以設定 SSE 路由： ")],-1)),l(S,{type:"decimal"},{default:o(()=>[t("li",null,[e[25]||(e[25]=t("p",null,"使用特定的 URL 路徑：",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse(&quot;/events&quot;) {
                            // send events to clients
                        }
                    }`})]),t("li",null,[e[26]||(e[26]=t("p",null," 不帶路徑： ",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse {
                            // send events to clients
                        }
                    }`})])]),_:1}),l(i,{title:"SSE 會話區塊",id:"session-block"},{default:o(()=>[e[36]||(e[36]=t("p",null,[n(" 在 "),t("code",null,"sse"),n(" 區塊中，您定義了指定路徑的處理器，該處理器由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html"},[t("code",null,"ServerSSESession")]),n(" 類別表示。以下函數和屬性在此區塊中可用：")],-1)),l(y,null,{default:o(()=>[l(p,{id:"send"},{default:o(()=>e[27]||(e[27]=[t("title",null,"<code>send()</code>",-1),n(" 建立並傳送 "),t("code",null,"ServerSentEvent",-1),n(" 到客戶端。 ")])),_:1}),l(p,{id:"call"},{default:o(()=>e[28]||(e[28]=[t("title",null,"<code>call</code>",-1),n(" 關聯的、發起此會話的已接收 "),t("code",null,"ApplicationCall",-1),n("。 ")])),_:1}),l(p,{id:"close"},{default:o(()=>[e[30]||(e[30]=t("title",null,"<code>close()</code>",-1)),e[31]||(e[31]=n(" 關閉會話並終止與客戶端的連線。當所有 ")),e[32]||(e[32]=t("code",null,"send()",-1)),e[33]||(e[33]=n(" 操作完成後，")),e[34]||(e[34]=t("code",null,"close()",-1)),e[35]||(e[35]=n(" 方法會自動呼叫。 ")),l(a,null,{default:o(()=>e[29]||(e[29]=[n(" 使用 "),t("code",null,"close()",-1),n(" 函數關閉會話不會向客戶端傳送終止事件。要在關閉會話前指示 SSE 流的結束，請使用 "),t("code",null,"send()",-1),n(" 函數傳送特定事件。 ")])),_:1})]),_:1})]),_:1})]),_:1}),l(i,{title:"範例：處理單一會話",id:"handle-single-session"},{default:o(()=>[e[37]||(e[37]=t("p",null,[n(" 以下範例展示了如何在 "),t("code",null,"/events"),n(" 端點上設定一個 SSE 會話，透過 SSE 通道傳送 6 個獨立事件，每個事件之間延遲 1 秒 (1000 毫秒)： ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/events") {
            repeat(6) {
                send(ServerSentEvent("this is SSE #$it"))
                delay(1000)
            }
        }
    }`}),e[38]||(e[38]=t("p",null,[n("有關完整範例，請參閱 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("。 ")],-1))]),_:1}),l(i,{title:"SSE 心跳",id:"heartbeat"},{default:o(()=>[e[39]||(e[39]=t("p",null," 心跳確保 SSE 連線在閒置期間透過定期傳送事件保持活躍。 只要會話保持活躍，伺服器就會以配置的間隔傳送指定事件。 ",-1)),e[40]||(e[40]=t("p",null,[n(" 要啟用和配置心跳，請在 SSE 路由處理器中呼叫 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html"},[t("code",null,".heartbeat()")]),n(" 函數： ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/heartbeat") {
            heartbeat {
                period = 10.milliseconds
                event = ServerSentEvent("heartbeat")
            }
            // ...
        }
    }`}),e[41]||(e[41]=t("p",null," 在此範例中，每 10 毫秒傳送一次心跳事件以維持連線。 ",-1))]),_:1}),l(i,{title:"序列化",id:"serialization"},{default:o(()=>[e[42]||(e[42]=t("p",null,[n(" 要啟用序列化，請在 SSE 路由上使用 "),t("code",null,"serialize"),n(" 參數提供自訂序列化函數。 在處理器內部，您可以使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html"},[t("code",null,"ServerSSESessionWithSerialization")]),n(" 類別來傳送序列化事件： ")],-1)),l(r,{lang:"kotlin",code:`@Serializable
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
}`}),e[43]||(e[43]=t("p",null,[n(" 此範例中的 "),t("code",null,"serialize"),n(" 函數負責將資料物件轉換為 JSON，然後將其放入 "),t("code",null,"ServerSentEvent"),n(" 的 "),t("code",null,"data"),n(" 欄位中。 ")],-1)),e[44]||(e[44]=t("p",null,[n("有關完整範例，請參閱 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("。 ")],-1))]),_:1})]),_:1})]),_:1})])}const K=w(N,[["render",T]]);export{J as __pageData,K as default};
