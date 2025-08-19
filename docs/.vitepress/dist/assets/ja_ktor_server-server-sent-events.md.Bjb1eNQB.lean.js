import{_ as z,C as s,c as x,o as I,G as l,w as o,j as t,a as n}from"./chunks/framework.Bksy39di.js";const J=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-server-sent-events.md","filePath":"ja/ktor/server-server-sent-events.md","lastUpdated":1755457140000}'),N={name:"ja/ktor/server-server-sent-events.md"};function T($,e,j,C,L,P){const m=s("show-structure"),k=s("primary-label"),f=s("tldr"),g=s("link-summary"),E=s("snippet"),u=s("Links"),b=s("tip"),a=s("note"),i=s("chapter"),r=s("code-block"),d=s("tab"),S=s("tabs"),v=s("list"),p=s("def"),y=s("deflist"),w=s("topic");return I(),x("div",null,[l(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"server-server-sent-events",title:"KtorサーバーでのServer-Sent Events (SSE)","help-id":"sse_server"},{default:o(()=>[l(m,{for:"chapter",depth:"2"}),l(k,{ref:"server-plugin"},null,512),l(f,null,{default:o(()=>e[0]||(e[0]=[t("p",null,[t("b",null,"必須の依存関係"),n(": "),t("code",null,"io.ktor:ktor-server-sse")],-1),t("p",null,[t("b",null,"コード例"),n(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"}," server-sse ")],-1)])),_:1}),l(g,null,{default:o(()=>e[1]||(e[1]=[n(" SSEプラグインを使用すると、サーバーはHTTP接続経由でイベントベースの更新をクライアントに送信できます。 ")])),_:1}),l(E,{id:"sse-description"},{default:o(()=>e[2]||(e[2]=[t("p",null," Server-Sent Events (SSE) は、サーバーがHTTP接続を介してクライアントにイベントを継続的にプッシュできる技術です。クライアントがサーバーを繰り返しポーリングすることなく、サーバーがイベントベースの更新を送信する必要がある場合に特に役立ちます。 ",-1),t("p",null," KtorがサポートするSSEプラグインは、サーバーとクライアント間で一方的な接続を確立するための簡単な方法を提供します。 ",-1)])),_:1}),l(b,null,{default:o(()=>[t("p",null,[e[4]||(e[4]=n("クライアント側のSSEプラグインについては、 ")),l(u,{href:"/ktor/client-server-sent-events",summary:"SSEプラグインを使用すると、クライアントはHTTP接続経由でサーバーからイベントベースの更新を受信できます。"},{default:o(()=>e[3]||(e[3]=[n("SSEクライアントプラグイン")])),_:1}),e[5]||(e[5]=n(" を参照してください。 "))])]),_:1}),l(a,null,{default:o(()=>[t("p",null,[e[7]||(e[7]=n(" 双方向通信には")),l(u,{href:"/ktor/server-websockets",summary:"WebSocketsプラグインを使用すると、サーバーとクライアント間で双方向通信セッションを作成できます。"},{default:o(()=>e[6]||(e[6]=[n("WebSockets")])),_:1}),e[8]||(e[8]=n(" の使用を検討してください。WebSocketsは、WebSocketプロトコルを使用してサーバーとクライアント間で全二重通信を提供します。 "))])]),_:1}),l(i,{title:"制限事項",id:"limitations"},{default:o(()=>[t("p",null,[e[10]||(e[10]=n(" KtorはSSEレスポンスのデータ圧縮をサポートしていません。 ")),l(u,{href:"/ktor/server-compression",summary:"必須の依存関係: io.ktor:ktor-server-sse コード例: server-sse ネイティブサーバーサポート: ✖️"},{default:o(()=>e[9]||(e[9]=[n("Compression")])),_:1}),e[11]||(e[11]=n(" プラグインを使用している場合、デフォルトでSSEレスポンスの圧縮はスキップされます。 "))])]),_:1}),l(i,{title:"依存関係の追加",id:"add_dependencies"},{default:o(()=>[e[12]||(e[12]=t("p",null,[t("code",null,"SSE"),n(" を使用するには、ビルドスクリプトに "),t("code",null,"ktor-server-sse"),n(" アーティファクトを含める必要があります。 ")],-1)),l(S,{group:"languages"},{default:o(()=>[l(d,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:o(()=>[l(r,{lang:"Kotlin",code:'                    implementation("io.ktor:ktor-server-sse:$ktor_version")'})]),_:1}),l(d,{title:"Gradle (Groovy)","group-key":"groovy"},{default:o(()=>[l(r,{lang:"Groovy",code:'                    implementation "io.ktor:ktor-server-sse:$ktor_version"'})]),_:1}),l(d,{title:"Maven","group-key":"maven"},{default:o(()=>[l(r,{lang:"XML",code:`                    <dependency>
                        <groupId>io.ktor</groupId>
                        <artifactId>ktor-server-sse-jvm</artifactId>
                        <version>\${ktor_version}</version>
                    </dependency>`})]),_:1})]),_:1})]),_:1}),l(i,{title:"SSEのインストール",id:"install_plugin"},{default:o(()=>[t("p",null,[e[14]||(e[14]=n(" アプリケーションに ")),e[15]||(e[15]=t("code",null,"SSE",-1)),e[16]||(e[16]=n(" プラグインを")),e[17]||(e[17]=t("a",{href:"#install"},"インストール",-1)),e[18]||(e[18]=n("するには、指定された")),l(u,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化することでアプリケーションを構造化できます。"},{default:o(()=>e[13]||(e[13]=[n("モジュール")])),_:1}),e[19]||(e[19]=n(" の ")),e[20]||(e[20]=t("code",null,"install",-1)),e[21]||(e[21]=n(" 関数に渡します。 以下のコードスニペットは、")),e[22]||(e[22]=t("code",null,"SSE",-1)),e[23]||(e[23]=n(" をインストールする方法を示しています... "))]),l(v,null,{default:o(()=>e[24]||(e[24]=[t("li",null,[n(" ... "),t("code",null,"embeddedServer"),n(" 関数呼び出し内で。 ")],-1),t("li",null,[n(" ... "),t("code",null,"Application"),n(" クラスの拡張関数である、明示的に定義された "),t("code",null,"module"),n(" 内で。 ")],-1)])),_:1}),l(S,null,{default:o(()=>[l(d,{title:"embeddedServer"},{default:o(()=>[l(r,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1})]),_:1})]),_:1}),l(i,{title:"SSEセッションの処理",id:"handle-sessions"},{default:o(()=>[e[45]||(e[45]=t("p",null,[t("code",null,"SSE"),n(" プラグインをインストールしたら、SSEセッションを処理するためのルートを追加できます。 そのためには、"),t("a",{href:"#define_route"},"ルーティング"),n(" ブロック内で "),t("code",null,"sse()"),n(" 関数を呼び出します。SSEルートを設定するには、2つの方法があります。 ")],-1)),l(v,{type:"decimal"},{default:o(()=>[t("li",null,[e[25]||(e[25]=t("p",null,"特定のURLパスを使用する場合:",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse(&quot;/events&quot;) {
                            // send events to clients
                        }
                    }`})]),t("li",null,[e[26]||(e[26]=t("p",null," パスなしの場合: ",-1)),l(r,{lang:"kotlin",code:`                    routing {
                        sse {
                            // send events to clients
                        }
                    }`})])]),_:1}),l(i,{title:"SSEセッションブロック",id:"session-block"},{default:o(()=>[e[36]||(e[36]=t("p",null,[t("code",null,"sse"),n(" ブロック内では、指定されたパスのハンドラを定義します。これは "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html"},[t("code",null,"ServerSSESession")]),n(" クラスで表されます。このブロック内で利用できる関数とプロパティは次のとおりです。 ")],-1)),l(y,null,{default:o(()=>[l(p,{id:"send"},{default:o(()=>e[27]||(e[27]=[t("title",null,"<code>send()</code>",-1),t("code",null,"ServerSentEvent",-1),n(" を作成し、クライアントに送信します。 ")])),_:1}),l(p,{id:"call"},{default:o(()=>e[28]||(e[28]=[t("title",null,"<code>call</code>",-1),n(" セッションの起点となった関連する受信 "),t("code",null,"ApplicationCall",-1),n(" です。 ")])),_:1}),l(p,{id:"close"},{default:o(()=>[e[30]||(e[30]=t("title",null,"<code>close()</code>",-1)),e[31]||(e[31]=n(" セッションを閉じ、クライアントとの接続を終了します。すべての ")),e[32]||(e[32]=t("code",null,"send()",-1)),e[33]||(e[33]=n(" 操作が完了すると、")),e[34]||(e[34]=t("code",null,"close()",-1)),e[35]||(e[35]=n(" メソッドが自動的に呼び出されます。 ")),l(a,null,{default:o(()=>e[29]||(e[29]=[t("code",null,"close()",-1),n(" 関数を使用してセッションを閉じても、クライアントに終了イベントは送信されません。セッションを閉じる前にSSEストリームの終了を示すには、"),t("code",null,"send()",-1),n(" 関数を使用して特定のイベントを送信します。 ")])),_:1})]),_:1})]),_:1})]),_:1}),l(i,{title:"例: 単一セッションの処理",id:"handle-single-session"},{default:o(()=>[e[37]||(e[37]=t("p",null,[n(" 以下の例では、"),t("code",null,"/events"),n(" エンドポイントでSSEセッションを設定し、SSEチャネル経由で6つの個別のイベントをそれぞれ1秒（1000ミリ秒）の間隔で送信する方法を示します。 ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/events") {
            repeat(6) {
                send(ServerSentEvent("this is SSE #$it"))
                delay(1000)
            }
        }
    }`}),e[38]||(e[38]=t("p",null,[n("完全な例は "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n(" を参照してください。 ")],-1))]),_:1}),l(i,{title:"SSEハートビート",id:"heartbeat"},{default:o(()=>[e[39]||(e[39]=t("p",null," ハートビートは、非アクティブ期間中に定期的にイベントを送信することで、SSE接続がアクティブな状態を維持するようにします。セッションがアクティブである限り、サーバーは設定された間隔で指定されたイベントを送信します。 ",-1)),e[40]||(e[40]=t("p",null,[n(" ハートビートを有効にして設定するには、SSEルートハンドラ内で "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html"},[t("code",null,".heartbeat()")]),n(" 関数を使用します。 ")],-1)),l(r,{lang:"kotlin",code:`    routing {
        sse("/heartbeat") {
            heartbeat {
                period = 10.milliseconds
                event = ServerSentEvent("heartbeat")
            }
            // ...
        }
    }`}),e[41]||(e[41]=t("p",null," この例では、接続を維持するために10ミリ秒ごとにハートビートイベントが送信されます。 ",-1))]),_:1}),l(i,{title:"シリアライズ",id:"serialization"},{default:o(()=>[e[42]||(e[42]=t("p",null,[n(" シリアライズを有効にするには、SSEルートの "),t("code",null,"serialize"),n(" パラメータを使用してカスタムシリアライズ関数を提供します。ハンドラ内で、 "),t("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html"},[t("code",null,"ServerSSESessionWithSerialization")]),n(" クラスを使用して、シリアライズされたイベントを送信できます。 ")],-1)),l(r,{lang:"kotlin",code:`@Serializable
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
}`}),e[43]||(e[43]=t("p",null,[n(" この例の "),t("code",null,"serialize"),n(" 関数は、データオブジェクトをJSONに変換し、それを "),t("code",null,"ServerSentEvent"),n(" の "),t("code",null,"data"),n(" フィールドに配置する役割を担っています。 ")],-1)),e[44]||(e[44]=t("p",null,[n("完全な例は "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-sse"},"server-sse"),n(" を参照してください。 ")],-1))]),_:1})]),_:1})]),_:1})])}const K=z(N,[["render",T]]);export{J as __pageData,K as default};
