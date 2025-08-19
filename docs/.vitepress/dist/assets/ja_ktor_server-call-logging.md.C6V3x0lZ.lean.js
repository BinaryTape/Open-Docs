import{_ as c,C as n,c as y,o as m,G as a,ag as k,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-call-logging.md","filePath":"ja/ktor/server-call-logging.md","lastUpdated":1755457140000}'),v={name:"ja/ktor/server-call-logging.md"};function F(C,s,f,b,_,q){const h=n("TopicTitle"),d=n("show-structure"),g=n("primary-label"),p=n("Links"),E=n("tldr"),e=n("code-block"),o=n("TabItem"),r=n("Tabs"),u=n("list");return m(),y("div",null,[a(h,{labelRef:"server-plugin",title:"コールロギング"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(E,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必要な依存関係"),l(": "),i("code",null,"io.ktor:ktor-server-call-logging")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"コード例"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/logging"}," logging ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:t(()=>s[0]||(s[0]=[l("ネイティブサーバー")])),_:1}),s[1]||(s[1]=l("のサポート"))]),s[2]||(s[2]=l(": ✖️ "))])]),_:1}),s[17]||(s[17]=k("",4)),a(r,{group:"languages"},{default:t(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-logging:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-logging:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-logging-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("CallLoggingをインストールする "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "CallLoggingをインストールする {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=l(" アプリケーションに")),s[7]||(s[7]=i("code",null,"CallLogging",-1)),s[8]||(s[8]=l("プラグインを")),s[9]||(s[9]=i("a",{href:"#install"},"インストール",-1)),s[10]||(s[10]=l("するには、指定された")),a(p,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:t(()=>s[5]||(s[5]=[l("モジュール")])),_:1}),s[11]||(s[11]=l("内の")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=l("関数に渡します。以下のコードスニペットは、")),s[14]||(s[14]=i("code",null,"CallLogging",-1)),s[15]||(s[15]=l("をインストールする方法を示しています... "))]),a(u,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[l(" ... "),i("code",null,"embeddedServer"),l("関数呼び出し内。 ")],-1),i("li",null,[l(" ... "),i("code",null,"Application"),l("クラスの拡張関数である明示的に定義された"),i("code",null,"module"),l("内。 ")],-1)])),_:1}),a(r,null,{default:t(()=>[a(o,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.calllogging.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallLogging)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(o,{title:"module"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.calllogging.*
            // ...
            fun Application.module() {
                install(CallLogging)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",17))])}const D=c(v,[["render",F]]);export{B as __pageData,D as default};
