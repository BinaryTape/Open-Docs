import{_ as F,C as t,c as b,o as m,G as a,ag as o,j as i,w as n,a as e}from"./chunks/framework.Bksy39di.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-websockets.md","filePath":"ktor/server-websockets.md","lastUpdated":1755457140000}'),v={name:"ktor/server-websockets.md"};function C(f,s,S,B,w,q){const r=t("TopicTitle"),d=t("show-structure"),E=t("primary-label"),p=t("Links"),c=t("tldr"),g=t("link-summary"),y=t("snippet"),l=t("code-block"),k=t("TabItem"),h=t("Tabs"),u=t("list");return m(),b("div",null,[a(r,{labelRef:"server-plugin",title:"Ktor 服务器中的 WebSockets"}),a(d,{for:"chapter",depth:"2"}),a(E,{ref:"server-plugin"},null,512),a(c,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依赖项"),e(": "),i("code",null,"io.ktor:ktor-server-websockets")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),e(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-websockets"}," server-websockets ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。"},{default:n(()=>s[0]||(s[0]=[e("原生服务器")])),_:1}),s[1]||(s[1]=e("支持"))]),s[2]||(s[2]=e(": ✅ "))])]),_:1}),a(g,null,{default:n(()=>s[5]||(s[5]=[e(" Websockets 插件允许您在服务器和客户端之间创建多向通信会话。 ")])),_:1}),a(y,{id:"websockets-description"},{default:n(()=>s[6]||(s[6]=[i("p",null,"WebSocket 是一种协议，它通过单个 TCP 连接在用户浏览器和服务器之间提供全双工通信会话。 它对于创建需要从服务器和向服务器实时数据传输的应用程序特别有用。",-1),i("p",null,"Ktor 在服务端和客户端都支持 WebSocket 协议。",-1)])),_:1}),s[19]||(s[19]=o("",6)),a(h,{group:"languages"},{default:n(()=>[a(k,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-websockets:$ktor_version")'})]),_:1}),a(k,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-websockets:$ktor_version"'})]),_:1}),a(k,{title:"Maven","group-key":"maven"},{default:n(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-websockets-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[20]||(s[20]=i("h2",{id:"install_plugin",tabindex:"-1"},[e("安装 WebSockets "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 WebSockets {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[8]||(s[8]=e(" 要将 ")),s[9]||(s[9]=i("code",null,"WebSockets",-1)),s[10]||(s[10]=e(" 插件")),s[11]||(s[11]=i("a",{href:"#install"},"安装",-1)),s[12]||(s[12]=e("到应用程序， 请在指定的")),a(p,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织您的应用程序。"},{default:n(()=>s[7]||(s[7]=[e("模块")])),_:1}),s[13]||(s[13]=e("中将其传递给 ")),s[14]||(s[14]=i("code",null,"install",-1)),s[15]||(s[15]=e(" 函数。 以下代码片段展示了如何安装 ")),s[16]||(s[16]=i("code",null,"WebSockets",-1)),s[17]||(s[17]=e("... "))]),a(u,null,{default:n(()=>s[18]||(s[18]=[i("li",null,[e(" ...在 "),i("code",null,"embeddedServer"),e(" 函数调用内部。 ")],-1),i("li",null,[e(" ...在显式定义的 "),i("code",null,"module"),e(" 内部，`module` 是 "),i("code",null,"Application"),e(" 类的扩展函数。 ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(k,{title:"embeddedServer"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.websocket.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(WebSockets)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(k,{title:"module"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.websocket.*
            // ...
            fun Application.module() {
                install(WebSockets)
                // ...
            }`})]),_:1})]),_:1}),s[21]||(s[21]=o("",35))])}const _=F(v,[["render",C]]);export{x as __pageData,_ as default};
