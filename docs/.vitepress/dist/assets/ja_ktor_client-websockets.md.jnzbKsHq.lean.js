import{_ as C,C as i,c as y,o as x,G as o,w as l,a as n,j as e}from"./chunks/framework.Bksy39di.js";const j=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/client-websockets.md","filePath":"ja/ktor/client-websockets.md","lastUpdated":1755457140000}'),_={name:"ja/ktor/client-websockets.md"};function I(M,t,F,H,B,O){const a=i("show-structure"),m=i("primary-label"),b=i("tldr"),f=i("link-summary"),g=i("note"),c=i("Links"),S=i("tip"),s=i("code-block"),u=i("tab"),w=i("tabs"),r=i("chapter"),d=i("def"),p=i("deflist"),v=i("warning"),k=i("list"),W=i("topic");return x(),y("div",null,[o(W,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",id:"client-websockets",title:"Ktor ClientにおけるWebSockets"},{default:l(()=>[o(a,{for:"chapter",depth:"3"}),o(m,{ref:"client-plugin"},null,512),o(b,null,{default:l(()=>t[0]||(t[0]=[e("p",null,[e("b",null,"必要な依存関係"),n(": "),e("code",null,"io.ktor:ktor-client-websockets")],-1),e("p",null,[e("b",null,"コード例"),n(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-websockets"}," client-websockets ")],-1)])),_:1}),o(f,null,{default:l(()=>t[1]||(t[1]=[n(" WebSocketsプラグインを使用すると、サーバーとクライアント間の多方向通信セッションを作成できます。 ")])),_:1}),t[31]||(t[31]=n(" WebSocketは、単一のTCP接続を介してユーザーのブラウザとサーバー間の全二重通信セッションを提供するプロトコルです。これは、サーバーとの間でリアルタイムのデータ転送を必要とするアプリケーションを作成するのに特に役立ちます。 Ktorは、サーバー側とクライアント側の両方でWebSocketプロトコルをサポートしています。 ")),t[32]||(t[32]=e("p",null,"クライアント向けのWebSocketsプラグインを使用すると、サーバーとのメッセージ交換のためのWebSocketセッションを処理できます。",-1)),o(g,null,{default:l(()=>t[2]||(t[2]=[e("p",null,[n("すべてのエンジンがWebSocketsをサポートしているわけではありません。サポートされているエンジンの概要については、「"),e("a",{href:"./client-engines#limitations"},"制限事項"),n("」を参照してください。")],-1)])),_:1}),o(S,null,{default:l(()=>[e("p",null,[t[4]||(t[4]=n("サーバー側のWebSocketサポートについては、「")),o(c,{href:"/ktor/server-websockets",summary:"WebSocketsプラグインを使用すると、サーバーとクライアント間の多方向通信セッションを作成できます。"},{default:l(()=>t[3]||(t[3]=[n("Ktor ServerにおけるWebSockets")])),_:1}),t[5]||(t[5]=n("」を参照してください。"))])]),_:1}),o(r,{title:"依存関係の追加",id:"add_dependencies"},{default:l(()=>[t[9]||(t[9]=e("p",null,[e("code",null,"WebSockets"),n("を使用するには、ビルドスクリプトに"),e("code",null,"ktor-client-websockets"),n("アーティファクトを含める必要があります。")],-1)),o(w,{group:"languages"},{default:l(()=>[o(u,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:l(()=>[o(s,{lang:"Kotlin",code:'                    implementation("io.ktor:ktor-client-websockets:$ktor_version")'})]),_:1}),o(u,{title:"Gradle (Groovy)","group-key":"groovy"},{default:l(()=>[o(s,{lang:"Groovy",code:'                    implementation "io.ktor:ktor-client-websockets:$ktor_version"'})]),_:1}),o(u,{title:"Maven","group-key":"maven"},{default:l(()=>[o(s,{lang:"XML",code:`                    <dependency>
                        <groupId>io.ktor</groupId>
                        <artifactId>ktor-client-websockets-jvm</artifactId>
                        <version>\${ktor_version}</version>
                    </dependency>`})]),_:1})]),_:1}),e("p",null,[t[7]||(t[7]=n(" Ktorクライアントで必要となるアーティファクトについては、「")),o(c,{href:"/ktor/client-dependencies",summary:"既存のプロジェクトにクライアント依存関係を追加する方法について学びます。"},{default:l(()=>t[6]||(t[6]=[n("クライアント依存関係の追加")])),_:1}),t[8]||(t[8]=n("」から詳細を確認できます。 "))])]),_:1}),o(r,{title:"WebSocketsのインストール",id:"install_plugin"},{default:l(()=>[t[10]||(t[10]=e("p",null,[e("code",null,"WebSockets"),n("プラグインをインストールするには、「"),e("a",{href:"#configure-client"},"クライアント設定ブロック"),n("」内で"),e("code",null,"install"),n("関数に渡します。")],-1)),o(s,{lang:"kotlin",code:`            import io.ktor.client.*
            import io.ktor.client.engine.cio.*
            import io.ktor.client.plugins.websocket.*

            //...
            val client = HttpClient(CIO) {
                install(WebSockets)
            }`})]),_:1}),o(r,{title:"設定",id:"configure_plugin"},{default:l(()=>[t[16]||(t[16]=e("p",null,[n("オプションで、"),e("code",null,"install"),n("ブロック内でプラグインを構成するには、"),e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/-web-sockets/-config/index.html"},"WebSockets.Config"),n("のサポートされているプロパティを渡します。 ")],-1)),o(p,null,{default:l(()=>[o(d,{id:"maxFrameSize"},{default:l(()=>t[11]||(t[11]=[e("title",null,"<code>maxFrameSize</code>",-1),n(" 送受信可能な"),e("code",null,"Frame",-1),n("の最大サイズを設定します。 ")])),_:1}),o(d,{id:"contentConverter"},{default:l(()=>t[12]||(t[12]=[e("title",null,"<code>contentConverter</code>",-1),n(" シリアル化/デシリアル化のためのコンバーターを設定します。 ")])),_:1}),o(d,{id:"pingIntervalMillis"},{default:l(()=>t[13]||(t[13]=[e("title",null,"<code>pingIntervalMillis</code>",-1),e("code",null,"Long",-1),n("形式でピング間の期間を指定します。 ")])),_:1}),o(d,{id:"pingInterval"},{default:l(()=>t[14]||(t[14]=[e("title",null,"<code>pingInterval</code>",-1),e("code",null,"Duration",-1),n("形式でピング間の期間を指定します。 ")])),_:1})]),_:1}),o(v,null,{default:l(()=>[t[15]||(t[15]=e("p",null,[e("code",null,"pingInterval"),n("と"),e("code",null,"pingIntervalMillis"),n("プロパティはOkHttpエンジンには適用されません。OkHttpのピング間隔を設定するには、"),e("a",{href:"#okhttp"},"エンジン設定"),n("を使用できます。 ")],-1)),o(s,{lang:"kotlin",code:`                import io.ktor.client.engine.okhttp.OkHttp

                val client = HttpClient(OkHttp) {
                    engine {
                        preconfigured = OkHttpClient.Builder()
                            .pingInterval(20, TimeUnit.SECONDS)
                            .build()
                    }
                }`})]),_:1}),t[17]||(t[17]=e("p",null,[n(" 以下の例では、WebSocketsプラグインが20秒（"),e("code",null,"20_000"),n("ミリ秒）のピング間隔で構成され、ピングフレームを自動的に送信してWebSocket接続を維持します。 ")],-1)),o(s,{lang:"kotlin",code:`    val client = HttpClient(CIO) {
        install(WebSockets) {
            pingIntervalMillis = 20_000
        }
    }`})]),_:1}),o(r,{title:"WebSocketセッションの操作",id:"working-wtih-session"},{default:l(()=>[t[30]||(t[30]=e("p",null,[n("クライアントのWebSocketセッションは、"),e("a",{href:"https://api.ktor.io/ktor-shared/ktor-websockets/io.ktor.websocket/-default-web-socket-session/index.html"},"DefaultClientWebSocketSession"),n("インターフェースによって表現されます。このインターフェースは、WebSocketフレームの送受信とセッションのクローズを可能にするAPIを公開しています。 ")],-1)),o(r,{title:"WebSocketセッションへのアクセス",id:"access-session"},{default:l(()=>[t[20]||(t[20]=e("p",null,[e("code",null,"HttpClient"),n("は、WebSocketセッションにアクセスする主な2つの方法を提供します。 ")],-1)),o(k,null,{default:l(()=>[e("li",null,[t[18]||(t[18]=e("p",null,[e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket.html"},[e("code",null,"webSocket()")]),n("関数は、"),e("code",null,"DefaultClientWebSocketSession"),n("をブロック引数として受け入れます。")],-1)),o(s,{lang:"kotlin",code:`                        runBlocking {
                            client.webSocket(
                                method = HttpMethod.Get,
                                host = "127.0.0.1",
                                port = 8080,
                                path = "/echo"
                            ) {
                                // this: DefaultClientWebSocketSession
                            }
                        }`})]),t[19]||(t[19]=e("li",null,[e("a",{href:"https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket-session.html"},[e("code",null,"webSocketSession()")]),n("関数は、"),e("code",null,"DefaultClientWebSocketSession"),n("インスタンスを返し、"),e("code",null,"runBlocking"),n("または"),e("code",null,"launch"),n("スコープの外でセッションにアクセスできます。 ")],-1))]),_:1})]),_:1}),o(r,{title:"WebSocketセッションの処理",id:"handle-session"},{default:l(()=>[t[25]||(t[25]=e("p",null,"関数ブロック内で、指定されたパスのハンドラーを定義します。以下の関数とプロパティがブロック内で利用可能です。",-1)),o(p,null,{default:l(()=>[o(d,{id:"send"},{default:l(()=>t[21]||(t[21]=[e("title",null,"<code>send()</code>",-1),n(" サーバーにテキストコンテンツを送信するには、"),e("code",null,"send()",-1),n("関数を使用します。 ")])),_:1}),o(d,{id:"outgoing"},{default:l(()=>t[22]||(t[22]=[e("title",null,"<code>outgoing</code>",-1),n(" WebSocketフレームを送信するためのチャネルにアクセスするには、"),e("code",null,"outgoing",-1),n("プロパティを使用します。フレームは"),e("code",null,"Frame",-1),n("クラスによって表現されます。 ")])),_:1}),o(d,{id:"incoming"},{default:l(()=>t[23]||(t[23]=[e("title",null,"<code>incoming</code>",-1),n(" WebSocketフレームを受信するためのチャネルにアクセスするには、"),e("code",null,"incoming",-1),n("プロパティを使用します。フレームは"),e("code",null,"Frame",-1),n("クラスによって表現されます。 ")])),_:1}),o(d,{id:"close"},{default:l(()=>t[24]||(t[24]=[e("title",null,"<code>close()</code>",-1),n(" 指定された理由でクローズフレームを送信するには、"),e("code",null,"close()",-1),n("関数を使用します。 ")])),_:1})]),_:1})]),_:1}),o(r,{title:"フレームタイプ",id:"frame-types"},{default:l(()=>[t[27]||(t[27]=e("p",null," WebSocketフレームのタイプを検査し、それに応じて処理できます。一般的なフレームタイプには以下があります。 ",-1)),o(k,null,{default:l(()=>t[26]||(t[26]=[e("li",null,[e("code",null,"Frame.Text"),n("はテキストフレームを表します。そのコンテンツを読み取るには、"),e("code",null,"Frame.Text.readText()"),n("を使用します。 ")],-1),e("li",null,[e("code",null,"Frame.Binary"),n("はバイナリフレームを表します。そのコンテンツを読み取るには、"),e("code",null,"Frame.Binary.readBytes()"),n("を使用します。 ")],-1),e("li",null,[e("code",null,"Frame.Close"),n("はクローズフレームを表します。セッション終了の理由を取得するには、"),e("code",null,"Frame.Close.readReason()"),n("を使用します。 ")],-1)])),_:1})]),_:1}),o(r,{title:"例",id:"example"},{default:l(()=>[t[28]||(t[28]=e("p",null,[n("以下の例では、"),e("code",null,"echo"),n(" WebSocketエンドポイントを作成し、サーバーとの間でメッセージを送受信する方法を示します。")],-1)),o(s,{lang:"kotlin","include-symbol":"main",code:`package com.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.http.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import java.util.*

fun main() {
    val client = HttpClient(CIO) {
        install(WebSockets) {
            pingIntervalMillis = 20_000
        }
    }
    runBlocking {
        client.webSocket(method = HttpMethod.Get, host = "127.0.0.1", port = 8080, path = "/echo") {
            while(true) {
                val othersMessage = incoming.receive() as? Frame.Text
                println(othersMessage?.readText())
                val myMessage = Scanner(System.\`in\`).next()
                if(myMessage != null) {
                    send(myMessage)
                }
            }
        }
    }
    client.close()
}`}),t[29]||(t[29]=e("p",null,[n("完全な例については、「"),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-websockets"},"client-websockets"),n("」を参照してください。 ")],-1))]),_:1})]),_:1})]),_:1})])}const D=C(_,[["render",I]]);export{j as __pageData,D as default};
