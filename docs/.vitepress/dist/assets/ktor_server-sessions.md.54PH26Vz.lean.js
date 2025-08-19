import{_ as y,C as t,c as F,o as m,G as e,ag as o,j as i,w as n,a}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-sessions.md","filePath":"ktor/server-sessions.md","lastUpdated":1755457140000}'),v={name:"ktor/server-sessions.md"};function b(C,s,f,q,_,S){const r=t("TopicTitle"),d=t("show-structure"),E=t("primary-label"),p=t("Links"),g=t("tldr"),c=t("link-summary"),l=t("code-block"),h=t("TabItem"),k=t("Tabs"),u=t("list");return m(),F("div",null,[e(r,{labelRef:"server-plugin",title:"会话"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依赖项"),a(": "),i("code",null,"io.ktor:ktor-server-sessions")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),a(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-client"},"session-cookie-client"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-server"},"session-cookie-server"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-header-server"},"session-header-server")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并且允许您在没有额外运行时或虚拟机的情况下运行服务器。"},{default:n(()=>s[0]||(s[0]=[a("原生服务器")])),_:1}),s[1]||(s[1]=a("支持"))]),s[2]||(s[2]=a(": ✅ "))])]),_:1}),e(c,null,{default:n(()=>s[5]||(s[5]=[a(" Sessions 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。 ")])),_:1}),s[16]||(s[16]=o("",4)),e(k,{group:"languages"},{default:n(()=>[e(h,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-sessions:$ktor_version")'})]),_:1}),e(h,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-sessions:$ktor_version"'})]),_:1}),e(h,{title:"Maven","group-key":"maven"},{default:n(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-sessions-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[17]||(s[17]=i("h2",{id:"install_plugin",tabindex:"-1"},[a("安装 Sessions "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 Sessions {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=a(" 要将 `Sessions` 插件")),s[8]||(s[8]=i("a",{href:"#install"},"安装",-1)),s[9]||(s[9]=a("到应用程序中， 请在指定的")),e(p,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:n(()=>s[6]||(s[6]=[a("模块")])),_:1}),s[10]||(s[10]=a("中将其传递给 ")),s[11]||(s[11]=i("code",null,"install",-1)),s[12]||(s[12]=a(" 函数。 以下代码片段展示了如何安装 ")),s[13]||(s[13]=i("code",null,"Sessions",-1)),s[14]||(s[14]=a(" ... "))]),e(u,null,{default:n(()=>s[15]||(s[15]=[i("li",null,[a(" ... 在 "),i("code",null,"embeddedServer"),a(" 函数调用内部。 ")],-1),i("li",null,[a(" ... 在显式定义的 "),i("code",null,"module"),a(" 内部，"),i("code",null,"module"),a(" 是 "),i("code",null,"Application"),a(" 类的一个扩展函数。 ")],-1)])),_:1}),e(k,null,{default:n(()=>[e(h,{title:"embeddedServer"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.sessions.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Sessions)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(h,{title:"module"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.sessions.*
            // ...
            fun Application.module() {
                install(Sessions)
                // ...
            }`})]),_:1})]),_:1}),s[18]||(s[18]=o("",70))])}const x=y(v,[["render",b]]);export{A as __pageData,x as default};
