import{_ as E,C as i,c as g,o as w,G as l,w as o,j as e,a as n}from"./chunks/framework.Bksy39di.js";const R=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/client-server-sent-events.md","filePath":"ktor/client-server-sent-events.md","lastUpdated":1755514048000}'),C={name:"ktor/client-server-sent-events.md"};function x(T,t,y,z,b,H){const m=i("show-structure"),c=i("primary-label"),u=i("tldr"),v=i("link-summary"),p=i("Links"),f=i("tip"),s=i("chapter"),r=i("code-block"),a=i("list"),d=i("def"),S=i("deflist"),k=i("topic");return w(),g("div",null,[l(k,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"client-server-sent-events",title:"Ktor Client 中的 Server-Sent Events","help-id":"sse_client"},{default:o(()=>[l(m,{for:"chapter",depth:"2"}),l(c,{ref:"client-plugin"},null,512),l(u,null,{default:o(()=>t[0]||(t[0]=[e("p",null,[e("b",null,"代码示例"),n(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-sse"}," client-sse ")],-1)])),_:1}),l(v,null,{default:o(()=>t[1]||(t[1]=[n(" SSE 插件允许客户端通过 HTTP 连接从服务器接收基于事件的更新。 ")])),_:1}),t[34]||(t[34]=e("p",null," Server-Sent Events (SSE) 是一种技术，允许服务器通过 HTTP 连接持续推送事件到客户端。在服务器需要发送基于事件的更新而无需客户端重复轮询服务器的场景中，它尤其有用。 ",-1)),t[35]||(t[35]=e("p",null," Ktor 支持的 SSE 插件提供了一种直接的方法，用于在服务器和客户端之间创建单向连接。 ",-1)),l(f,null,{default:o(()=>[e("p",null,[t[3]||(t[3]=n("关于 SSE 插件服务器端支持的更多信息，请参见 ")),l(p,{href:"/ktor/server-server-sent-events",summary:"The SSE plugin allows a server to send event-based updates to a client over an HTTP connection."},{default:o(()=>t[2]||(t[2]=[n("SSE 服务器插件")])),_:1}),t[4]||(t[4]=n(" 。 "))])]),_:1}),l(s,{title:"添加依赖项",id:"add_dependencies"},{default:o(()=>[e("p",null,[t[6]||(t[6]=e("code",null,"SSE",-1)),t[7]||(t[7]=n(" 仅需要 ")),l(p,{href:"/ktor/client-dependencies",summary:"Learn how to add client dependencies to an existing project."},{default:o(()=>t[5]||(t[5]=[n("ktor-client-core")])),_:1}),t[8]||(t[8]=n(" artifact，并且不需要任何特定依赖项。 "))])]),_:1}),l(s,{title:"安装 SSE",id:"install_plugin"},{default:o(()=>[t[9]||(t[9]=e("p",null,[n(" 要安装 "),e("code",null,"SSE"),n(" 插件，请在"),e("a",{href:"#configure-client"},"客户端配置代码块"),n("内将其传入 "),e("code",null,"install"),n(" 函数： ")],-1)),l(r,{lang:"kotlin",code:`            import io.ktor.client.*
            import io.ktor.client.engine.cio.*
            import io.ktor.client.plugins.sse.*

            //...
            val client = HttpClient(CIO) {
                install(SSE)
            }`})]),_:1}),l(s,{title:"配置 SSE 插件",id:"configure"},{default:o(()=>[t[14]||(t[14]=e("p",null,[n(" 您可以选择在 "),e("code",null,"install"),n(" 代码块中通过设置 "),e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-s-s-e-config/index.html"},"SSEConfig"),n(" 类支持的属性来配置 SSE 插件。 ")],-1)),l(s,{title:"SSE 重新连接",id:"sse-reconnect"},{default:o(()=>[l(u,null,{default:o(()=>t[10]||(t[10]=[e("p",null,[n("️️不支持："),e("code",null,"OkHttp")],-1)])),_:1}),t[11]||(t[11]=e("p",null,[n(" 要为支持的引擎启用自动重新连接，请将 "),e("code",null,"maxReconnectionAttempts"),n(" 设置为大于 "),e("code",null,"0"),n(" 的值。您还可以使用 "),e("code",null,"reconnectionTime"),n(" 配置尝试之间的延迟： ")],-1)),l(r,{lang:"kotlin",code:`                install(SSE) {
                    maxReconnectionAttempts = 4
                    reconnectionTime = 2.seconds
                }`}),t[12]||(t[12]=e("p",null,[n(" 如果与服务器的连接丢失，客户端将等待指定的 "),e("code",null,"reconnectionTime"),n("，然后尝试重新连接。它将最多进行 指定的 "),e("code",null,"maxReconnectionAttempts"),n(" 次尝试以重新建立连接。 ")],-1))]),_:1}),l(s,{title:"过滤事件",id:"filter-events"},{default:o(()=>[t[13]||(t[13]=e("p",null,[n(" 在以下示例中，SSE 插件安装到 HTTP 客户端中，并配置为在传入流中仅包含注释事件和仅包含 "),e("code",null,"retry"),n(" 字段的事件： ")],-1)),l(r,{lang:"kotlin",code:`        install(SSE) {
            showCommentEvents()
            showRetryEvents()
        }`})]),_:1})]),_:1}),l(s,{title:"处理 SSE 会话",id:"handle-sse-sessions"},{default:o(()=>[t[33]||(t[33]=e("p",null,[n(" 客户端的 SSE 会话由 "),e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html"},[e("code",null,"ClientSSESession")]),n(" 接口表示。此接口暴露了允许您从服务器接收 Server-Sent Events 的 API。 ")],-1)),l(s,{title:"访问 SSE 会话",id:"access-sse-session"},{default:o(()=>[t[21]||(t[21]=e("p",null,[e("code",null,"HttpClient"),n(" 允许您通过以下方式之一访问 SSE 会话：")],-1)),l(a,null,{default:o(()=>t[15]||(t[15]=[e("li",null,[e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse.html"},[e("code",null,"sse()")]),n(" 函数创建 SSE 会话并允许您对其进行操作。 ")],-1),e("li",null,[e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse-session.html"},[e("code",null,"sseSession()")]),n(" 函数允许您打开 SSE 会话。 ")],-1)])),_:1}),t[22]||(t[22]=e("p",null,"要指定 URL 端点，您有两种选择：",-1)),l(a,null,{default:o(()=>t[16]||(t[16]=[e("li",null,[n("使用 "),e("code",null,"urlString"),n(" 形参将整个 URL 指定为字符串。")],-1),e("li",null,[n("使用 "),e("code",null,"schema"),n("、"),e("code",null,"host"),n("、"),e("code",null,"port"),n(" 和 "),e("code",null,"path"),n(" 形参分别指定协议方案、域名、端口号和路径名。 ")],-1)])),_:1}),l(r,{lang:"kotlin",code:`                runBlocking {
                    client.sse(host = &quot;127.0.0.1&quot;, port = 8080, path = &quot;/events&quot;) {
                        // this: ClientSSESession
                    }
                }`}),t[23]||(t[23]=e("p",null,"可选地，以下形参可用于配置连接：",-1)),l(S,null,{default:o(()=>[l(d,{id:"reconnectionTime-param"},{default:o(()=>t[17]||(t[17]=[e("title",null,"<code>reconnectionTime</code>",-1),n(" 设置重新连接延迟。 ")])),_:1}),l(d,{id:"showCommentEvents-param"},{default:o(()=>t[18]||(t[18]=[e("title",null,"<code>showCommentEvents</code>",-1),n(" 指定是否在传入流中显示仅包含注释的事件。 ")])),_:1}),l(d,{id:"showRetryEvents-param"},{default:o(()=>t[19]||(t[19]=[e("title",null,"<code>showRetryEvents</code>",-1),n(" 指定是否在传入流中显示仅包含 "),e("code",null,"retry",-1),n(" 字段的事件。 ")])),_:1}),l(d,{id:"deserialize-param"},{default:o(()=>t[20]||(t[20]=[e("title",null,"<code>deserialize</code>",-1),n(" 一个反序列化函数，用于将 "),e("code",null,"TypedServerSentEvent",-1),n(" 的 "),e("code",null,"data",-1),n(" 字段转换为对象。关于更多信息，请参见"),e("a",{href:"#deserialization"},"反序列化",-1),n("。 ")])),_:1})]),_:1})]),_:1}),l(s,{title:"SSE 会话代码块",id:"sse-session-block"},{default:o(()=>[t[26]||(t[26]=e("p",null,[n(" 在 lambda 实参中，您可以访问 "),e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html"},[e("code",null,"ClientSSESession")]),n(" 上下文。代码块中可用以下属性： ")],-1)),l(S,null,{default:o(()=>[l(d,{id:"call"},{default:o(()=>t[24]||(t[24]=[e("title",null,"<code>call</code>",-1),n(" 发起会话的关联 "),e("code",null,"HttpClientCall",-1),n("。 ")])),_:1}),l(d,{id:"incoming"},{default:o(()=>t[25]||(t[25]=[e("title",null,"<code>incoming</code>",-1),n(" 传入的 Server-Sent Events 流。 ")])),_:1})]),_:1}),t[27]||(t[27]=e("p",null,[n(" 以下示例使用 "),e("code",null,"events"),n(" 端点创建新的 SSE 会话，通过 "),e("code",null,"incoming"),n(" 属性读取事件并打印接收到的 "),e("a",{href:"https://api.ktor.io/ktor-shared/ktor-sse/io.ktor.sse/-server-sent-event/index.html"},[e("code",null,"ServerSentEvent")]),n(" 。 ")],-1)),l(r,{lang:"kotlin",code:`fun main() {
    val client = HttpClient {
        install(SSE) {
            showCommentEvents()
            showRetryEvents()
        }
    }
    runBlocking {
        client.sse(host = "0.0.0.0", port = 8080, path = "/events") {
            while (true) {
                incoming.collect { event ->
                    println("Event from server:")
                    println(event)
                }
            }
        }
    }
}`}),t[28]||(t[28]=e("p",null,[n("关于完整示例，请参见 "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-sse"},"client-sse"),n("。 ")],-1))]),_:1}),l(s,{title:"反序列化",id:"deserialization"},{default:o(()=>[t[29]||(t[29]=e("p",null," SSE 插件支持将 Server-Sent Events 反序列化为类型安全的 Kotlin 对象。当处理来自服务器的结构化数据时，此特性尤其有用。 ",-1)),t[30]||(t[30]=e("p",null,[n(" 要启用反序列化，请使用 SSE 访问函数上的 "),e("code",null,"deserialize"),n(" 形参提供自定义反序列化函数，并使用 "),e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session-with-deserialization/index.html"},[e("code",null,"ClientSSESessionWithDeserialization")]),n(" 类来处理反序列化后的事件。 ")],-1)),t[31]||(t[31]=e("p",null,[n(" 这是一个使用 "),e("code",null,"kotlinx.serialization"),n(" 反序列化 JSON 数据的示例： ")],-1)),l(r,{lang:"Kotlin",code:`        client.sse({
            url("http://localhost:8080/serverSentEvents")
        }, deserialize = {
                typeInfo, jsonString ->
            val serializer = Json.serializersModule.serializer(typeInfo.kotlinType!!)
            Json.decodeFromString(serializer, jsonString)!!
        }) { // \`this\` is \`ClientSSESessionWithDeserialization\`
            incoming.collect { event: TypedServerSentEvent<String> ->
                when (event.event) {
                    "customer" -> {
                        val customer: Customer? = deserialize<Customer>(event.data)
                    }
                    "product" -> {
                        val product: Product? = deserialize<Product>(event.data)
                    }
                }
            }
        }`}),t[32]||(t[32]=e("p",null,[n("关于完整示例，请参见 "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-sse"},"client-sse"),n("。 ")],-1))]),_:1})]),_:1})]),_:1})])}const L=E(C,[["render",x]]);export{R as __pageData,L as default};
