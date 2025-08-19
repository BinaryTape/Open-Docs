import{_ as g,C as o,c as v,o as f,G as r,ag as p,j as t,w as n,a as i}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-https-redirect.md","filePath":"ktor/server-https-redirect.md","lastUpdated":1755457140000}'),h={name:"ktor/server-https-redirect.md"};function _(b,e,T,y,E,H){const u=o("TopicTitle"),k=o("primary-label"),d=o("Links"),c=o("tldr"),s=o("code-block"),l=o("TabItem"),a=o("Tabs"),m=o("list");return f(),v("div",null,[r(u,{labelRef:"server-plugin",title:"HttpsRedirect"}),r(k,{ref:"server-plugin"},null,512),r(c,null,{default:n(()=>[e[3]||(e[3]=t("p",null,[t("b",null,"所需依赖项"),i(": "),t("code",null,"io.ktor:ktor-server-http-redirect")],-1)),e[4]||(e[4]=t("p",null,[t("b",null,"代码示例"),i(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-redirect"}," ssl-engine-main-redirect ")],-1)),t("p",null,[t("b",null,[r(d,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并允许你在没有额外运行时或虚拟机的情况下运行服务器。"},{default:n(()=>e[0]||(e[0]=[i("原生服务器")])),_:1}),e[1]||(e[1]=i("支持"))]),e[2]||(e[2]=i(": ✅ "))])]),_:1}),e[17]||(e[17]=p("",3)),r(a,{group:"languages"},{default:n(()=>[r(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[r(s,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-http-redirect:$ktor_version")'})]),_:1}),r(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[r(s,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-http-redirect:$ktor_version"'})]),_:1}),r(l,{title:"Maven","group-key":"maven"},{default:n(()=>[r(s,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-http-redirect-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=t("h2",{id:"install_plugin",tabindex:"-1"},[i("安装 HttpsRedirect "),t("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 HttpsRedirect {id="install_plugin"}"'},"​")],-1)),t("p",null,[e[6]||(e[6]=i(" 要将 ")),e[7]||(e[7]=t("code",null,"HttpsRedirect",-1)),e[8]||(e[8]=i(" 插件")),e[9]||(e[9]=t("a",{href:"#install"},"安装",-1)),e[10]||(e[10]=i("到应用程序， 请在指定的 ")),r(d,{href:"/ktor/server-modules",summary:"模块允许你通过对路由进行分组来组织应用程序。"},{default:n(()=>e[5]||(e[5]=[i("模块")])),_:1}),e[11]||(e[11]=i("中将其传递给 ")),e[12]||(e[12]=t("code",null,"install",-1)),e[13]||(e[13]=i(" 函数。 下面的代码片段展示了如何安装 ")),e[14]||(e[14]=t("code",null,"HttpsRedirect",-1)),e[15]||(e[15]=i(" ... "))]),r(m,null,{default:n(()=>e[16]||(e[16]=[t("li",null,[i(" ...在 "),t("code",null,"embeddedServer"),i(" 函数调用内部。 ")],-1),t("li",null,[i(" ...在显式定义的 "),t("code",null,"module"),i(" 中，它是一个 "),t("code",null,"Application"),i(" 类的扩展函数。 ")],-1)])),_:1}),r(a,null,{default:n(()=>[r(l,{title:"embeddedServer"},{default:n(()=>[r(s,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
