import{_ as m}from"./chunks/forwarded-headers.CS4yn2xX.js";import{_ as v,C as d,c as f,o as y,G as o,ag as k,j as r,w as s,a as t}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-forward-headers.md","filePath":"ja/ktor/server-forward-headers.md","lastUpdated":1755457140000}'),F={name:"ja/ktor/server-forward-headers.md"};function b(w,e,E,q,H,_){const u=d("TopicTitle"),h=d("show-structure"),c=d("primary-label"),n=d("Links"),g=d("tldr"),a=d("code-block"),i=d("TabItem"),l=d("Tabs"),p=d("list");return y(),f("div",null,[o(u,{labelRef:"server-plugin",title:"フォワードヘッダー"}),o(h,{for:"chapter",depth:"2"}),o(c,{ref:"server-plugin"},null,512),o(g,null,{default:s(()=>[e[3]||(e[3]=r("p",null,[r("b",null,"必須の依存関係"),t(": "),r("code",null,"io.ktor:ktor-server-forwarded-header")],-1)),e[4]||(e[4]=r("p",null,[r("b",null,"コード例"),t(": "),r("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/forwarded-header"}," forwarded-header ")],-1)),r("p",null,[r("b",null,[o(n,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:s(()=>e[0]||(e[0]=[t("ネイティブサーバー")])),_:1}),e[1]||(e[1]=t("のサポート"))]),e[2]||(e[2]=t(": ✅ "))])]),_:1}),e[29]||(e[29]=k("",5)),o(l,{group:"languages"},{default:s(()=>[o(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:s(()=>[o(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-forwarded-header:$ktor_version")'})]),_:1}),o(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:s(()=>[o(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-forwarded-header:$ktor_version"'})]),_:1}),o(i,{title:"Maven","group-key":"maven"},{default:s(()=>[o(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-forwarded-header-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[30]||(e[30]=r("h2",{id:"install_plugin",tabindex:"-1"},[t("プラグインのインストール "),r("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "プラグインのインストール {id="install_plugin"}"'},"​")],-1)),o(l,null,{default:s(()=>[o(i,{title:"ForwardedHeader"},{default:s(()=>[r("p",null,[e[6]||(e[6]=t(" アプリケーションに")),e[7]||(e[7]=r("code",null,"ForwardedHeaders",-1)),e[8]||(e[8]=t("プラグインを")),e[9]||(e[9]=r("a",{href:"#install"},"インストール",-1)),e[10]||(e[10]=t("するには、 指定された")),o(n,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:s(()=>e[5]||(e[5]=[t("モジュール")])),_:1}),e[11]||(e[11]=t("内の")),e[12]||(e[12]=r("code",null,"install",-1)),e[13]||(e[13]=t("関数に渡します。 以下のコードスニペットは、")),e[14]||(e[14]=r("code",null,"ForwardedHeaders",-1)),e[15]||(e[15]=t("をインストールする方法を示しています... "))]),o(p,null,{default:s(()=>e[16]||(e[16]=[r("li",null,[t(" ... "),r("code",null,"embeddedServer"),t("関数呼び出し内で。 ")],-1),r("li",null,[t(" ... "),r("code",null,"Application"),t("クラスの拡張関数である、明示的に定義された"),r("code",null,"module"),t("内で。 ")],-1)])),_:1}),o(l,null,{default:s(()=>[o(i,{title:"embeddedServer"},{default:s(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),o(i,{title:"module"},{default:s(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(ForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1}),o(i,{title:"XForwardedHeader"},{default:s(()=>[r("p",null,[e[18]||(e[18]=t(" アプリケーションに")),e[19]||(e[19]=r("code",null,"XForwardedHeaders",-1)),e[20]||(e[20]=t("プラグインを")),e[21]||(e[21]=r("a",{href:"#install"},"インストール",-1)),e[22]||(e[22]=t("するには、 指定された")),o(n,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:s(()=>e[17]||(e[17]=[t("モジュール")])),_:1}),e[23]||(e[23]=t("内の")),e[24]||(e[24]=r("code",null,"install",-1)),e[25]||(e[25]=t("関数に渡します。 以下のコードスニペットは、")),e[26]||(e[26]=r("code",null,"XForwardedHeaders",-1)),e[27]||(e[27]=t("をインストールする方法を示しています... "))]),o(p,null,{default:s(()=>e[28]||(e[28]=[r("li",null,[t(" ... "),r("code",null,"embeddedServer"),t("関数呼び出し内で。 ")],-1),r("li",null,[t(" ... "),r("code",null,"Application"),t("クラスの拡張関数である、明示的に定義された"),r("code",null,"module"),t("内で。 ")],-1)])),_:1}),o(l,null,{default:s(()=>[o(i,{title:"embeddedServer"},{default:s(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),o(i,{title:"module"},{default:s(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(XForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1})]),_:1}),e[31]||(e[31]=k("",17))])}const X=v(F,[["render",b]]);export{P as __pageData,X as default};
