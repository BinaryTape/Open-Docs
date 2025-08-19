import{_ as g,C as o,c as v,o as f,G as r,ag as p,j as t,w as n,a as i}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-https-redirect.md","filePath":"zh-Hant/ktor/server-https-redirect.md","lastUpdated":1755457140000}'),h={name:"zh-Hant/ktor/server-https-redirect.md"};function _(b,e,T,y,H,E){const u=o("TopicTitle"),k=o("primary-label"),d=o("Links"),c=o("tldr"),s=o("code-block"),l=o("TabItem"),a=o("Tabs"),m=o("list");return f(),v("div",null,[r(u,{labelRef:"server-plugin",title:"HttpsRedirect"}),r(k,{ref:"server-plugin"},null,512),r(c,null,{default:n(()=>[e[3]||(e[3]=t("p",null,[t("b",null,"所需依賴項"),i(": "),t("code",null,"io.ktor:ktor-server-http-redirect")],-1)),e[4]||(e[4]=t("p",null,[t("b",null,"程式碼範例"),i(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-redirect"}," ssl-engine-main-redirect ")],-1)),t("p",null,[t("b",null,[r(d,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，可讓您在沒有額外執行時間或虛擬機器的情況下執行伺服器。"},{default:n(()=>e[0]||(e[0]=[i("原生伺服器")])),_:1}),e[1]||(e[1]=i("支援"))]),e[2]||(e[2]=i(": ✅ "))])]),_:1}),e[17]||(e[17]=p("",3)),r(a,{group:"languages"},{default:n(()=>[r(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[r(s,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-http-redirect:$ktor_version")'})]),_:1}),r(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[r(s,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-http-redirect:$ktor_version"'})]),_:1}),r(l,{title:"Maven","group-key":"maven"},{default:n(()=>[r(s,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-http-redirect-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=t("h2",{id:"install_plugin",tabindex:"-1"},[i("安裝 HttpsRedirect "),t("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 HttpsRedirect {id="install_plugin"}"'},"​")],-1)),t("p",null,[e[6]||(e[6]=i(" 若要將 ")),e[7]||(e[7]=t("code",null,"HttpsRedirect",-1)),e[8]||(e[8]=i(" 插件")),e[9]||(e[9]=t("a",{href:"#install"},"安裝",-1)),e[10]||(e[10]=i("到應用程式中， 請在指定的")),r(d,{href:"/ktor/server-modules",summary:"模組可讓您透過分組路由來建構應用程式。"},{default:n(()=>e[5]||(e[5]=[i("模組")])),_:1}),e[11]||(e[11]=i("中將其傳遞給 ")),e[12]||(e[12]=t("code",null,"install",-1)),e[13]||(e[13]=i(" 函數。 以下程式碼片段顯示了如何安裝 ")),e[14]||(e[14]=t("code",null,"HttpsRedirect",-1)),e[15]||(e[15]=i(" ... "))]),r(m,null,{default:n(()=>e[16]||(e[16]=[t("li",null,[i(" ... 在 "),t("code",null,"embeddedServer"),i(" 函數呼叫內部。 ")],-1),t("li",null,[i(" ... 在明確定義的 "),t("code",null,"module"),i(" 內部，它是 "),t("code",null,"Application"),i(" 類別的擴充功能。 ")],-1)])),_:1}),r(a,null,{default:n(()=>[r(l,{title:"embeddedServer"},{default:n(()=>[r(s,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
