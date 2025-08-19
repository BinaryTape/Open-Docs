import{_ as g,C as o,c as v,o as f,G as r,ag as p,j as t,w as n,a as i}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-https-redirect.md","filePath":"ja/ktor/server-https-redirect.md","lastUpdated":1755457140000}'),h={name:"ja/ktor/server-https-redirect.md"};function _(b,e,y,T,E,H){const u=o("TopicTitle"),k=o("primary-label"),a=o("Links"),c=o("tldr"),s=o("code-block"),l=o("TabItem"),d=o("Tabs"),m=o("list");return f(),v("div",null,[r(u,{labelRef:"server-plugin",title:"HttpsRedirect"}),r(k,{ref:"server-plugin"},null,512),r(c,null,{default:n(()=>[e[3]||(e[3]=t("p",null,[t("b",null,"必須依存関係"),i(": "),t("code",null,"io.ktor:ktor-server-http-redirect")],-1)),e[4]||(e[4]=t("p",null,[t("b",null,"コード例"),i(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-redirect"}," ssl-engine-main-redirect ")],-1)),t("p",null,[t("b",null,[r(a,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:n(()=>e[0]||(e[0]=[i("ネイティブサーバー")])),_:1}),e[1]||(e[1]=i("サポート"))]),e[2]||(e[2]=i(": ✅ "))])]),_:1}),e[17]||(e[17]=p("",3)),r(d,{group:"languages"},{default:n(()=>[r(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[r(s,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-http-redirect:$ktor_version")'})]),_:1}),r(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[r(s,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-http-redirect:$ktor_version"'})]),_:1}),r(l,{title:"Maven","group-key":"maven"},{default:n(()=>[r(s,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-http-redirect-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=t("h2",{id:"install_plugin",tabindex:"-1"},[i("HttpsRedirect をインストールする "),t("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "HttpsRedirect をインストールする {id="install_plugin"}"'},"​")],-1)),t("p",null,[e[6]||(e[6]=i(" アプリケーションに ")),e[7]||(e[7]=t("code",null,"HttpsRedirect",-1)),e[8]||(e[8]=i(" プラグインを")),e[9]||(e[9]=t("a",{href:"#install"},"インストール",-1)),e[10]||(e[10]=i("するには、指定された")),r(a,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:n(()=>e[5]||(e[5]=[i("モジュール")])),_:1}),e[11]||(e[11]=i("内の ")),e[12]||(e[12]=t("code",null,"install",-1)),e[13]||(e[13]=i(" 関数に渡します。 以下のコードスニペットは、")),e[14]||(e[14]=t("code",null,"HttpsRedirect",-1)),e[15]||(e[15]=i(" をインストールする方法を示しています... "))]),r(m,null,{default:n(()=>e[16]||(e[16]=[t("li",null,[i(" ... "),t("code",null,"embeddedServer"),i(" 関数呼び出し内。 ")],-1),t("li",null,[i(" ... "),t("code",null,"Application"),i(" クラスの拡張関数である、明示的に定義された "),t("code",null,"module"),i(" 内。 ")],-1)])),_:1}),r(d,null,{default:n(()=>[r(l,{title:"embeddedServer"},{default:n(()=>[r(s,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.httpsredirect.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(HttpsRedirect)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),r(l,{title:"module"},{default:n(()=>[r(s,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.httpsredirect.*
            // ...
            fun Application.module() {
                install(HttpsRedirect)
                // ...
            }`})]),_:1})]),_:1}),e[19]||(e[19]=p("",6))])}const S=g(h,[["render",_]]);export{P as __pageData,S as default};
