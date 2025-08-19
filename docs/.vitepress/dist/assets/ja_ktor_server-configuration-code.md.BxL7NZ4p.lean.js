import{_ as f,C as d,c,o as k,G as t,w as r,j as e,a as o}from"./chunks/framework.Bksy39di.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-configuration-code.md","filePath":"ja/ktor/server-configuration-code.md","lastUpdated":1755457140000}'),v={name:"ja/ktor/server-configuration-code.md"};function y(C,n,S,b,j,w){const p=d("show-structure"),u=d("link-summary"),s=d("Links"),i=d("code-block"),l=d("chapter"),m=d("snippet"),a=d("tip"),g=d("topic");return k(),c("div",null,[t(g,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"コードでの設定",id:"server-configuration-code","help-id":"Configuration-code;server-configuration-in-code"},{default:r(()=>[t(p,{for:"chapter"}),t(u,null,{default:r(()=>n[0]||(n[0]=[o(" コードで様々なサーバーパラメータを設定する方法を学びます。 ")])),_:1}),e("p",null,[n[3]||(n[3]=o(" Ktorでは、ホストアドレス、ポート、")),t(s,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:r(()=>n[1]||(n[1]=[o("サーバーモジュール")])),_:1}),n[4]||(n[4]=o("など、様々なサーバーパラメータをコード内で直接設定できます。設定方法は、")),t(s,{href:"/ktor/server-create-and-configure",summary:"アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。"},{default:r(()=>n[2]||(n[2]=[e("code",null,"embeddedServer",-1),o(" または "),e("code",null,"EngineMain",-1)])),_:1}),n[5]||(n[5]=o("を使用してサーバーをセットアップする方法によって異なります。 "))]),e("p",null,[n[7]||(n[7]=e("code",null,"embeddedServer",-1)),n[8]||(n[8]=o("を使用すると、必要なパラメータを関数に直接渡すことでサーバーを設定できます。 ")),n[9]||(n[9]=e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html"},[e("code",null,"embeddedServer")],-1)),n[10]||(n[10]=o(" 関数は、")),t(s,{href:"/ktor/server-engines",summary:"ネットワークリクエストを処理するエンジンについて学びます。"},{default:r(()=>n[6]||(n[6]=[o("サーバーエンジン")])),_:1}),n[11]||(n[11]=o("、サーバーがリッスンするホストとポート、および追加の設定など、サーバー設定のための様々なパラメータを受け入れます。 "))]),n[32]||(n[32]=e("p",null,[o(" このセクションでは、"),e("code",null,"embeddedServer"),o("を実行するいくつかの異なる例を見て、サーバーを有利に設定する方法を説明します。 ")],-1)),t(l,{title:"基本設定",id:"embedded-basic"},{default:r(()=>[n[12]||(n[12]=e("p",null,[o(" 以下のコードスニペットは、Nettyエンジンと"),e("code",null,"8080"),o("ポートを使用した基本的なサーバー設定を示しています。 ")],-1)),t(i,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),n[13]||(n[13]=e("p",null,[e("code",null,"port"),o("パラメータを"),e("code",null,"0"),o("に設定すると、サーバーをランダムなポートで実行できることに注意してください。 "),e("code",null,"embeddedServer"),o("関数はエンジンインスタンスを返すため、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html"},[e("code",null,"ApplicationEngine.resolvedConnectors")]),o(" 関数を使用してコード内でポート値を取得できます。 ")],-1))]),_:1}),t(l,{title:"エンジン設定",id:"embedded-engine"},{default:r(()=>[t(m,{id:"embedded-engine-configuration"},{default:r(()=>[n[20]||(n[20]=e("p",null,[e("code",null,"embeddedServer"),o("関数を使用すると、"),e("code",null,"configure"),o("パラメータを介してエンジン固有のオプションを渡すことができます。このパラメータには、すべてのエンジンに共通し、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"},[e("code",null,"ApplicationEngine.Configuration")]),o(" クラスによって公開されるオプションが含まれます。 ")],-1)),n[21]||(n[21]=e("p",null,[o(" 以下の例は、"),e("code",null,"Netty"),o("エンジンを使用してサーバーを設定する方法を示しています。"),e("code",null,"configure"),o("ブロック内で、ホストとポートを指定するための"),e("code",null,"connector"),o("を定義し、様々なサーバーパラメータをカスタマイズします。 ")],-1)),t(i,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),n[22]||(n[22]=e("p",null,[e("code",null,"connectors.add()"),o("メソッドは、指定されたホスト ("),e("code",null,"127.0.0.1"),o(") とポート ("),e("code",null,"8080"),o(") を持つコネクタを定義します。 ")],-1)),n[23]||(n[23]=e("p",null,"これらのオプションに加えて、その他のエンジン固有のプロパティを設定できます。",-1)),t(l,{title:"Netty",id:"netty-code"},{default:r(()=>[n[14]||(n[14]=e("p",null,[o(" Netty固有のオプションは、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"},[e("code",null,"NettyApplicationEngine.Configuration")]),o(" クラスによって公開されます。 ")],-1)),t(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1}),t(l,{title:"Jetty",id:"jetty-code"},{default:r(()=>[n[15]||(n[15]=e("p",null,[o(" Jetty固有のオプションは、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"},[e("code",null,"JettyApplicationEngineBase.Configuration")]),o(" クラスによって公開されます。 ")],-1)),n[16]||(n[16]=e("p",null,[o("Jettyサーバーは "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"},[e("code",null,"configureServer")]),o(" ブロック内で設定でき、そこから "),e("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},[e("code",null,"Server")]),o(" インスタンスにアクセスできます。 ")],-1)),n[17]||(n[17]=e("p",null,[e("code",null,"idleTimeout"),o("プロパティを使用して、コネクションが閉じられる前にアイドル状態になり得る時間の長さを指定します。 ")],-1)),t(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
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
                    }`})]),_:1}),t(l,{title:"CIO",id:"cio-code"},{default:r(()=>[n[18]||(n[18]=e("p",null,[o("CIO固有のオプションは、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"},[e("code",null,"CIOApplicationEngine.Configuration")]),o(" クラスによって公開されます。 ")],-1)),t(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.cio.*

                    fun main() {
                        embeddedServer(CIO, configure = {
                            connectionIdleTimeoutSeconds = 45
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1}),t(l,{title:"Tomcat",id:"tomcat-code"},{default:r(()=>[n[19]||(n[19]=e("p",null,[o("エンジンとしてTomcatを使用する場合、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"},[e("code",null,"configureTomcat")]),o(" プロパティを使用して設定できます。これにより、 "),e("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},[e("code",null,"Tomcat")]),o(" インスタンスにアクセスできます。 ")],-1)),t(i,{lang:"kotlin",code:`                    import io.ktor.server.engine.*
                    import io.ktor.server.tomcat.jakarta.*

                    fun main() {
                        embeddedServer(Tomcat, configure = {
                            configureTomcat = { // this: Tomcat -&gt;
                                // ...
                            }
                        }) {
                            // ...
                        }.start(true)
                    }`})]),_:1})]),_:1})]),_:1}),t(l,{title:"カスタム環境",id:"embedded-custom"},{default:r(()=>[n[25]||(n[25]=e("p",null,[o(" 以下の例は、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html"},[e("code",null,"ApplicationEngine.Configuration")]),o(" クラスで表現されるカスタム設定を使用して、複数のコネクタエンドポイントを持つサーバーを実行する方法を示しています。 ")],-1)),t(i,{lang:"kotlin",code:`import io.ktor.server.application.*
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
}`}),n[26]||(n[26]=e("p",null,[o(" 完全な例については、 "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/embedded-server-multiple-connectors"},[e("code",null,"embedded-server-multiple-connectors")]),o("を参照してください。 ")],-1)),t(a,null,{default:r(()=>n[24]||(n[24]=[e("p",null,[o(" カスタム環境を使用して "),e("a",{href:"#embedded-server"}," HTTPSを提供する "),o("こともできます。 ")],-1)])),_:1})]),_:1}),t(l,{id:"command-line",title:"コマンドライン設定"},{default:r(()=>[n[28]||(n[28]=e("p",null,[o(" Ktorでは、コマンドライン引数を使用して"),e("code",null,"embeddedServer"),o("を動的に設定できます。これは、ポート、ホスト、タイムアウトなどの設定を実行時に指定する必要がある場合に特に役立ちます。 ")],-1)),n[29]||(n[29]=e("p",null,[o(" これを実現するには、 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html"},[e("code",null,"CommandLineConfig")]),o(" クラスを使用してコマンドライン引数を設定オブジェクトにパースし、設定ブロック内で渡します。 ")],-1)),t(i,{lang:"kotlin",code:`fun main(args: Array<String>) {
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
}`}),n[30]||(n[30]=e("p",null,[o(" この例では、"),e("code",null,"Application.Configuration"),o("の "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html"},[e("code",null,"takeFrom()")]),o(" 関数が、"),e("code",null,"port"),o("や"),e("code",null,"host"),o("などのエンジン設定値を上書きするために使用されます。 "),e("a",{href:"https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html"},[e("code",null,"loadCommonConfiguration()")]),o(" 関数は、タイムアウトなど、ルート環境から設定をロードします。 ")],-1)),n[31]||(n[31]=e("p",null," サーバーを実行するには、次のように引数を指定します。 ",-1)),t(i,{lang:"shell",code:'            ./gradlew run --args="-port=8080"'}),t(a,null,{default:r(()=>n[27]||(n[27]=[o(" 静的な設定には、設定ファイルまたは環境変数を使用できます。 詳細については、 "),e("a",{href:"#command-line"}," ファイルでの設定 ",-1),o(" を参照してください。 ")])),_:1})]),_:1})]),_:1})])}const N=f(v,[["render",y]]);export{x as __pageData,N as default};
