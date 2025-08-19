import{_ as z,C as s,c as x,o as I,G as l,w as o,j as t,a as n}from"./chunks/framework.Bksy39di.js";const K=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-server-sent-events.md","filePath":"ktor/server-server-sent-events.md","lastUpdated":1755522191000}'),N={name:"ktor/server-server-sent-events.md"};function T($,e,C,L,P,G){const m=s("show-structure"),k=s("primary-label"),f=s("tldr"),g=s("link-summary"),E=s("snippet"),u=s("Links"),b=s("tip"),a=s("note"),i=s("chapter"),r=s("code-block"),d=s("tab"),v=s("tabs"),S=s("list"),p=s("def"),y=s("deflist"),w=s("topic");return I(),x("div",null,[l(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"server-server-sent-events",title:"Ktor Server 中的 Server-Sent Events","help-id":"sse_server"},{default:o(()=>[l(m,{for:"chapter",depth:"2"}),l(k,{ref:"server-plugin"},null,512),l(f,null,{default:o(()=>e[0]||(e[0]=[t("p",null,[t("b",null,"所需依赖项"),n(": "),t("code",null,"io.ktor:ktor-server-sse")],-1),t("p",null,[t("b",null,"代码示例"),n(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"}," server-sse ")],-1)])),_:1}),l(g,null,{default:o(()=>e[1]||(e[1]=[n(" SSE 插件允许服务器通过 HTTP 连接向客户端发送基于事件的更新。 ")])),_:1}),l(E,{id:"sse-description"},{default:o(()=>e[2]||(e[2]=[t("p",null," Server-Sent Events (SSE) 是一种技术，它允许服务器通过 HTTP 连接持续向客户端推送事件。当服务器需要发送基于事件的更新而无需客户端反复轮询服务器时，它尤其有用。 ",-1),t("p",null," Ktor 支持的 SSE 插件提供了一种创建服务器与客户端之间单向连接的直接方法。 ",-1)])),_:1}),l(b,null,{default:o(()=>[t("p",null,[e[4]||(e[4]=n("要了解有关用于客户端支持的 SSE 插件的更多信息，请参阅 ")),l(u,{href:"/ktor/client-server-sent-events",summary:"SSE 插件允许客户端通过 HTTP 连接从服务器接收基于事件的更新。"},{default:o(()=>e[3]||(e[3]=[n("SSE 客户端插件")])),_:1}),e[5]||(e[5]=n(" 。 "))])]),_:1}),l(a,null,{default:o(()=>[t("p",null,[e[7]||(e[7]=n(" 对于多向通信，请考虑使用 ")),l(u,{href:"/ktor/server-websockets",summary:"Websockets 插件允许您创建服务器与客户端之间的多向通信会话。"},{default:o(()=>e[6]||(e[6]=[n("WebSockets")])),_:1}),e[8]||(e[8]=n("。它们使用 Websocket 协议在服务器和客户端之间提供全双工通信。 "))])]),_:1}),l(i,{title:"限制",id:"limitations"},{default:o(()=>[t("p",null,[e[10]||(e[10]=n(" Ktor 不支持 SSE 响应的数据压缩。 如果您使用 ")),l(u,{href:"/ktor/server-compression",summary:"所需依赖项: io.ktor:ktor-server-sse 代码示例: server-sse 原生服务器支持: ✖️"},{default:o(()=>e[9]||(e[9]=[n("Compression")])),_:1}),e[11]||(e[11]=n(" 插件，它将默认跳过 SSE 响应的压缩。 "))])]),_:1}),l(i,{title:"添加依赖项",id:"add_dependencies"},{default:o(()=>[e[12]||(e[12]=t("p",null,[n(" 要使用 "),t("code",null,"SSE"),n("，您需要在构建脚本中包含 "),t("code",null,"ktor-server-sse"),n(" artifact： ")],-1)),l(v,{group:"languages"},{default:o(()=>[l(d,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:o(()=>[l(r,{lang:"Kotlin",code:'                    implementation("io.ktor:ktor-server-sse:$ktor_version")'})]),_:1}),l(d,{title:"Gradle (Groovy)","group-key":"groovy"},{default:o(()=>[l(r,{lang:"Groovy",code:'                    implementation "io.ktor:ktor-server-sse:$ktor_version"'})]),_:1}),l(d,{title:"Maven","group-key":"maven"},{default:o(()=>[l(r,{lang:"XML",code:`                    <dependency>
                        <groupId>io.ktor</groupId>
                        <artifactId>ktor-server-sse-jvm</artifactId>
                        <version>\${ktor_version}</version>
                    </dependency>`})]),_:1})]),_:1})]),_:1}),l(i,{title:"安装 SSE",id:"install_plugin"},{default:o(()=>[t("p",null,[e[14]||(e[14]=n(" 要将 ")),e[15]||(e[15]=t("a",{href:"#install"},"安装",-1)),e[16]||(e[16]=n()),e[17]||(e[17]=t("code",null,"SSE",-1)),e[18]||(e[18]=n(" 插件到应用程序中， 请将其传递给指定")),l(u,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来构建应用程序。"},{default:o(()=>e[13]||(e[13]=[n("模块")])),_:1}),e[19]||(e[19]=n("中的 ")),e[20]||(e[20]=t("code",null,"install",-1)),e[21]||(e[21]=n(" 函数。 以下代码片段展示了如何安装 ")),e[22]||(e[22]=t("code",null,"SSE",-1)),e[23]||(e[23]=n(" ... "))]),l(S,null,{default:o(()=>e[24]||(e[24]=[t("li",null,[n(" ... 在 "),t("code",null,"embeddedServer"),n(" 函数调用内部。 ")],-1),t("li",null,[n(" ... 在显式定义的 "),t("code",null,"module"),n(" 内部，它是 "),t("code",null,"Application"),n(" 类的一个扩展函数。 ")],-1)])),_:1}),l(v,null,{default:o(()=>[l(d,{title:"embeddedServer"},{default:o(()=>[l(r,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1})]),_:1})]),_:1}),l(i,{title:"处理 SSE 会话",id:"handle-sessions"},{default:o(()=>[e[45]||(e[45]=t("p",null,[n(" 安装 "),t("code",null,"SSE"),n(" 插件后，您可以添加一个路由来处理 SSE 会话。 为此，请在 "),t("a",{href:"#define_route"},"路由"),n(" 代码块内调用 "),t("code",null,"sse()"),n(" 函数。设置 SSE 路由有两种方式： ")],-1)),l(S,{type:"decimal"},{default:o(()=>[t("li",null,[e[25]||(e[25]=t("p",null,"使用特定的 URL 路径：",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse(&quot;/events&quot;) {
                            // send events to clients
                        }
                    }`})]),t("li",null,[e[26]||(e[26]=t("p",null," 不带路径： ",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse {
                            // send events to clients
                        }
                    }`})])]),_:1}),l(i,{title:"SSE 会话代码块",id:"session-block"},{default:o(()=>[e[36]||(e[36]=t("p",null,[n(" 在 "),t("code",null,"sse"),n(" 代码块中，您定义了指定路径的处理程序，它由 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html"},[t("code",null,"ServerSSESession")]),n(" 类表示。以下函数和属性在该代码块中可用：")],-1)),l(y,null,{default:o(()=>[l(p,{id:"send"},{default:o(()=>e[27]||(e[27]=[t("title",null,"<code>send()</code>",-1),n(" 创建并向客户端发送一个 "),t("code",null,"ServerSentEvent",-1),n("。 ")])),_:1}),l(p,{id:"call"},{default:o(()=>e[28]||(e[28]=[t("title",null,"<code>call</code>",-1),n(" 关联的已接收 "),t("code",null,"ApplicationCall",-1),n("，它发起了该会话。 ")])),_:1}),l(p,{id:"close"},{default:o(()=>[e[30]||(e[30]=t("title",null,"<code>close()</code>",-1)),e[31]||(e[31]=n(" 关闭会话并终止与客户端的连接。当所有 ")),e[32]||(e[32]=t("code",null,"send()",-1)),e[33]||(e[33]=n(" 操作完成后，")),e[34]||(e[34]=t("code",null,"close()",-1)),e[35]||(e[35]=n(" 方法会自动调用。 ")),l(a,null,{default:o(()=>e[29]||(e[29]=[n(" 使用 "),t("code",null,"close()",-1),n(" 函数关闭会话不会向客户端发送终止事件。要在关闭会话前指示 SSE 流的结束，请使用 "),t("code",null,"send()",-1),n(" 函数发送一个特定事件。 ")])),_:1})]),_:1})]),_:1})]),_:1}),l(i,{title:"示例：处理单个会话",id:"handle-single-session"},{default:o(()=>[e[37]||(e[37]=t("p",null,[n(" 以下示例演示了如何在 "),t("code",null,"/events"),n(" 端点上设置 SSE 会话，通过 SSE 通道发送 6 个独立事件，每个事件之间有 1 秒（1000 毫秒）的延迟： ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/events") {
            repeat(6) {
                send(ServerSentEvent("this is SSE #$it"))
                delay(1000)
            }
        }
    }`}),e[38]||(e[38]=t("p",null,[n("有关完整示例，请参见 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("。 ")],-1))]),_:1}),l(i,{title:"SSE 心跳",id:"heartbeat"},{default:o(()=>[e[39]||(e[39]=t("p",null," 心跳通过周期性发送事件，确保 SSE 连接在不活动期间保持活跃。只要会话保持活跃，服务器将按配置的间隔发送指定事件。 ",-1)),e[40]||(e[40]=t("p",null,[n(" 要启用和配置心跳，请在 SSE 路由处理程序内使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html"},[t("code",null,".heartbeat()")]),n(" 函数： ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/heartbeat") {
            heartbeat {
                period = 10.milliseconds
                event = ServerSentEvent("heartbeat")
            }
            // ...
        }
    }`}),e[41]||(e[41]=t("p",null," 在此示例中，心跳事件每 10 毫秒发送一次，以维持连接。 ",-1))]),_:1}),l(i,{title:"序列化",id:"serialization"},{default:o(()=>[e[42]||(e[42]=t("p",null,[n(" 要启用序列化，请在 SSE 路由上使用 "),t("code",null,"serialize"),n(" 形参提供一个自定义序列化函数。在处理程序内部，您可以使用 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html"},[t("code",null,"ServerSSESessionWithSerialization")]),n(" 类来发送序列化事件： ")],-1)),l(r,{lang:"kotlin",code:`@Serializable
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
}`}),e[43]||(e[43]=t("p",null,[n(" 在此示例中，"),t("code",null,"serialize"),n(" 函数负责将数据对象转换为 JSON，然后将其放置在 "),t("code",null,"ServerSentEvent"),n(" 的 "),t("code",null,"data"),n(" 字段中。 ")],-1)),e[44]||(e[44]=t("p",null,[n("有关完整示例，请参见 "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n("。 ")],-1))]),_:1})]),_:1})]),_:1})])}const j=z(N,[["render",T]]);export{K as __pageData,j as default};
