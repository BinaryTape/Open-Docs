import{_ as g,C as r,c,o as E,j as i,G as t,ag as h,a as e,w as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"サーバーエンジン","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-engines.md","filePath":"ja/ktor/server-engines.md","lastUpdated":1755457140000}'),y={name:"ja/ktor/server-engines.md"};function u(m,s,v,F,f,C){const p=r("show-structure"),d=r("link-summary"),l=r("code-block"),a=r("TabItem"),o=r("Tabs"),k=r("chapter");return E(),c("div",null,[s[14]||(s[14]=i("h1",{id:"サーバーエンジン",tabindex:"-1"},[e("サーバーエンジン "),i("a",{class:"header-anchor",href:"#サーバーエンジン","aria-label":'Permalink to "サーバーエンジン"'},"​")],-1)),t(p,{for:"chapter",depth:"3"}),t(d,null,{default:n(()=>s[0]||(s[0]=[e(" ネットワークリクエストを処理するエンジンについて学びます。 ")])),_:1}),s[15]||(s[15]=h("",9)),t(o,{group:"languages"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-netty:$ktor_version")'})]),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-netty:$ktor_version"'})]),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>[t(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-netty-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[16]||(s[16]=h("",9)),t(o,null,{default:n(()=>[t(a,{title:"Application.kt"},{default:n(()=>s[1]||(s[1]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"package"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," com.example")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.application."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.response."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," io.ktor.server.routing."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fun"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," main"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(args: "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Array"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"String"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">): "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Unit"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," io.ktor.server.netty.EngineMain."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"main"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(args)")]),e(`
`),i("span",{class:"line"}),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fun"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," Application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"module"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    routing"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        get"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            call."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"respondText"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"Hello, world!"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"application.conf"},{default:n(()=>s[2]||(s[2]=[i("div",{class:"language-shell vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"shell"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"ktor"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    deployment"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        port"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 8080")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    application"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        modules"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ]")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"application.yaml"},{default:n(()=>s[3]||(s[3]=[i("div",{class:"language-yaml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"yaml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ktor"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    deployment"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        port"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"8080")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        modules"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            - "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"com.example.ApplicationKt.module")])])])],-1)])),_:1})]),_:1}),s[17]||(s[17]=i("p",null,[e("ビルドシステムタスクを使用してサーバーを起動する必要がある場合は、必要な"),i("code",null,"EngineMain"),e("をメインクラスとして設定する必要があります。")],-1)),t(o,{group:"languages",id:"main-class-set-engine-main"},{default:n(()=>[t(a,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>s[4]||(s[4]=[i("div",{class:"language-kotlin vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"kotlin"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"application"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    mainClass."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"set"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"io.ktor.server.netty.EngineMain"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])])],-1)])),_:1}),t(a,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>s[5]||(s[5]=[i("div",{class:"language-groovy vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"groovy"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mainClassName "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "io.ktor.server.netty.EngineMain"')])])])],-1)])),_:1}),t(a,{title:"Maven","group-key":"maven"},{default:n(()=>s[6]||(s[6]=[i("div",{class:"language-xml vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"xml"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    <"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">io.ktor.server.netty.EngineMain</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"main.class"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),e(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"properties"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")])])])],-1)])),_:1})]),_:1}),s[18]||(s[18]=h("",5)),t(l,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`}),s[19]||(s[19]=i("p",null,[i("code",null,"connectors.add()"),e("メソッドは、指定されたホスト（"),i("code",null,"127.0.0.1"),e("） とポート（"),i("code",null,"8080"),e("）を持つコネクタを定義します。 ")],-1)),s[20]||(s[20]=i("p",null,"これらのオプションに加えて、他のエンジン固有のプロパティを設定できます。",-1)),t(k,{title:"Netty",id:"netty-code"},{default:n(()=>[s[7]||(s[7]=i("p",null,[e(" Netty固有のオプションは、 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html"}," NettyApplicationEngine.Configuration "),e(" クラスによって公開されています。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"Jetty",id:"jetty-code"},{default:n(()=>[s[8]||(s[8]=i("p",null,[e(" Jetty固有のオプションは、 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html"}," JettyApplicationEngineBase.Configuration "),e(" クラスによって公開されています。 ")],-1)),s[9]||(s[9]=i("p",null,[i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"}," configureServer "),e("ブロック内でJettyサーバーを設定できます。これは、 "),i("a",{href:"https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"},"Server"),e(" インスタンスへのアクセスを提供します。 ")],-1)),s[10]||(s[10]=i("p",null,[i("code",null,"idleTimeout"),e("プロパティを使用して、接続が閉じられるまでにアイドル状態を維持できる期間を指定します。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
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
        }`})]),_:1}),t(k,{title:"CIO",id:"cio-code"},{default:n(()=>[s[11]||(s[11]=i("p",null,[e("CIO固有のオプションは、 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html"}," CIOApplicationEngine.Configuration "),e(" クラスによって公開されています。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.cio.*

        fun main() {
            embeddedServer(CIO, configure = {
                connectionIdleTimeoutSeconds = 45
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),t(k,{title:"Tomcat",id:"tomcat-code"},{default:n(()=>[s[12]||(s[12]=i("p",null,[e("エンジンとしてTomcatを使用する場合、 "),i("a",{href:"https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"}," configureTomcat "),e(" プロパティを使用して設定できます。これは、 "),i("a",{href:"https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"},"Tomcat"),e(" インスタンスへのアクセスを提供します。 ")],-1)),t(l,{lang:"kotlin",code:`        import io.ktor.server.engine.*
        import io.ktor.server.tomcat.jakarta.*

        fun main() {
            embeddedServer(Tomcat, configure = {
                configureTomcat = { // this: Tomcat -&gt;
                    // ...
                }
            }) {
                // ...
            }.start(true)
        }`})]),_:1}),s[21]||(s[21]=i("h3",{id:"engine-main-configure",tabindex:"-1"},[e("設定ファイル内 "),i("a",{class:"header-anchor",href:"#engine-main-configure","aria-label":'Permalink to "設定ファイル内 {id="engine-main-configure"}"'},"​")],-1)),s[22]||(s[22]=i("p",null,[i("code",null,"EngineMain"),e("を使用する場合、"),i("code",null,"ktor.deployment"),e("グループ内で、すべてのエンジンに共通するオプションを指定できます。 ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"engine-main-conf"},{default:n(()=>[t(l,{lang:"shell",code:`            ktor {
                deployment {
                    connectionGroupSize = 2
                    workerGroupSize = 5
                    callGroupSize = 10
                    shutdownGracePeriod = 2000
                    shutdownTimeout = 3000
                }
            }`})]),_:1}),t(a,{title:"application.yaml","group-key":"yaml",id:"engine-main-yaml"},{default:n(()=>[t(l,{lang:"yaml",code:`           ktor:
               deployment:
                   connectionGroupSize: 2
                   workerGroupSize: 5
                   callGroupSize: 10
                   shutdownGracePeriod: 2000
                   shutdownTimeout: 3000`})]),_:1})]),_:1}),t(k,{title:"Netty",id:"netty-file"},{default:n(()=>[s[13]||(s[13]=i("p",null,[i("code",null,"ktor.deployment"),e("グループ内の設定ファイルで、Netty固有のオプションも設定できます。 ")],-1)),t(o,{group:"config"},{default:n(()=>[t(a,{title:"application.conf","group-key":"hocon",id:"application-conf-1"},{default:n(()=>[t(l,{lang:"shell",code:`               ktor {
                   deployment {
                       maxInitialLineLength = 2048
                       maxHeaderSize = 1024
                       maxChunkSize = 42
                   }
               }`})]),_:1}),t(a,{title:"application.yaml","group-key":"yaml",id:"application-yaml-1"},{default:n(()=>[t(l,{lang:"yaml",code:`               ktor:
                   deployment:
                       maxInitialLineLength: 2048
                       maxHeaderSize: 1024
                       maxChunkSize: 42`})]),_:1})]),_:1})]),_:1})])}const S=g(y,[["render",u]]);export{B as __pageData,S as default};
