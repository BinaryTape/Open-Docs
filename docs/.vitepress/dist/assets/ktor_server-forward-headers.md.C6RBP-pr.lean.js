import{_ as m}from"./chunks/forwarded-headers.CS4yn2xX.js";import{_ as f,C as i,c as v,o as y,G as t,ag as k,j as r,w as d,a as o}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-forward-headers.md","filePath":"ktor/server-forward-headers.md","lastUpdated":1755457140000}'),F={name:"ktor/server-forward-headers.md"};function w(b,e,E,q,H,_){const u=i("TopicTitle"),h=i("show-structure"),c=i("primary-label"),n=i("Links"),g=i("tldr"),a=i("code-block"),s=i("TabItem"),l=i("Tabs"),p=i("list");return y(),v("div",null,[t(u,{labelRef:"server-plugin",title:"转发标头"}),t(h,{for:"chapter",depth:"2"}),t(c,{ref:"server-plugin"},null,512),t(g,null,{default:d(()=>[e[3]||(e[3]=r("p",null,[r("b",null,"所需依赖项"),o(": "),r("code",null,"io.ktor:ktor-server-forwarded-header")],-1)),e[4]||(e[4]=r("p",null,[r("b",null,"代码示例"),o(": "),r("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/forwarded-header"}," forwarded-header ")],-1)),r("p",null,[r("b",null,[t(n,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许您无需额外运行时或虚拟机即可运行服务器。"},{default:d(()=>e[0]||(e[0]=[o("原生服务器")])),_:1}),e[1]||(e[1]=o("支持"))]),e[2]||(e[2]=o(": ✅ "))])]),_:1}),e[29]||(e[29]=k("",5)),t(l,{group:"languages"},{default:d(()=>[t(s,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:d(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-forwarded-header:$ktor_version")'})]),_:1}),t(s,{title:"Gradle (Groovy)","group-key":"groovy"},{default:d(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-forwarded-header:$ktor_version"'})]),_:1}),t(s,{title:"Maven","group-key":"maven"},{default:d(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-forwarded-header-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[30]||(e[30]=r("h2",{id:"install_plugin",tabindex:"-1"},[o("安装插件 "),r("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装插件 {id="install_plugin"}"'},"​")],-1)),t(l,null,{default:d(()=>[t(s,{title:"ForwardedHeader"},{default:d(()=>[r("p",null,[e[6]||(e[6]=o(" 要将 ")),e[7]||(e[7]=r("code",null,"ForwardedHeaders",-1)),e[8]||(e[8]=o(" 插件")),e[9]||(e[9]=r("a",{href:"#install"},"安装",-1)),e[10]||(e[10]=o("到应用程序中， 请将其传递给指定")),t(n,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:d(()=>e[5]||(e[5]=[o("模块")])),_:1}),e[11]||(e[11]=o("中的 ")),e[12]||(e[12]=r("code",null,"install",-1)),e[13]||(e[13]=o(" 函数。 下面的代码片段展示了如何安装 ")),e[14]||(e[14]=r("code",null,"ForwardedHeaders",-1)),e[15]||(e[15]=o(" ... "))]),t(p,null,{default:d(()=>e[16]||(e[16]=[r("li",null,[o(" ...在 "),r("code",null,"embeddedServer"),o(" 函数调用内部。 ")],-1),r("li",null,[o(" ...在显式定义的 "),r("code",null,"module"),o(" 内部，后者是 "),r("code",null,"Application"),o(" 类的扩展函数。 ")],-1)])),_:1}),t(l,null,{default:d(()=>[t(s,{title:"embeddedServer"},{default:d(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(s,{title:"module"},{default:d(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(ForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1}),t(s,{title:"XForwardedHeader"},{default:d(()=>[r("p",null,[e[18]||(e[18]=o(" 要将 ")),e[19]||(e[19]=r("code",null,"XForwardedHeaders",-1)),e[20]||(e[20]=o(" 插件")),e[21]||(e[21]=r("a",{href:"#install"},"安装",-1)),e[22]||(e[22]=o("到应用程序中， 请将其传递给指定")),t(n,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:d(()=>e[17]||(e[17]=[o("模块")])),_:1}),e[23]||(e[23]=o("中的 ")),e[24]||(e[24]=r("code",null,"install",-1)),e[25]||(e[25]=o(" 函数。 下面的代码片段展示了如何安装 ")),e[26]||(e[26]=r("code",null,"XForwardedHeaders",-1)),e[27]||(e[27]=o(" ... "))]),t(p,null,{default:d(()=>e[28]||(e[28]=[r("li",null,[o(" ...在 "),r("code",null,"embeddedServer"),o(" 函数调用内部。 ")],-1),r("li",null,[o(" ...在显式定义的 "),r("code",null,"module"),o(" 内部，后者是 "),r("code",null,"Application"),o(" 类的扩展函数。 ")],-1)])),_:1}),t(l,null,{default:d(()=>[t(s,{title:"embeddedServer"},{default:d(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(s,{title:"module"},{default:d(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(XForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1})]),_:1}),e[31]||(e[31]=k("",17))])}const X=f(F,[["render",w]]);export{P as __pageData,X as default};
