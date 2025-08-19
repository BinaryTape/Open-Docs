import{_ as f,C as l,c as v,o as m,G as t,ag as p,j as a,w as i,a as s}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-default-headers.md","filePath":"ktor/server-default-headers.md","lastUpdated":1755457140000}'),E={name:"ktor/server-default-headers.md"};function y(b,e,_,H,C,q){const u=l("TopicTitle"),k=l("show-structure"),h=l("primary-label"),o=l("Links"),c=l("tldr"),n=l("code-block"),r=l("TabItem"),d=l("Tabs"),g=l("list");return m(),v("div",null,[t(u,{labelRef:"server-plugin",title:"默认标头"}),t(k,{for:"chapter",depth:"2"}),t(h,{ref:"server-plugin"},null,512),t(c,null,{default:i(()=>[e[3]||(e[3]=a("p",null,[a("b",null,"所需依赖项"),s(": "),a("code",null,"io.ktor:ktor-server-default-headers")],-1)),a("p",null,[a("b",null,[t(o,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许您无需额外运行时或虚拟机即可运行服务器。"},{default:i(()=>e[0]||(e[0]=[s("原生服务器")])),_:1}),e[1]||(e[1]=s("支持"))]),e[2]||(e[2]=s(": ✅ "))])]),_:1}),e[16]||(e[16]=p("",3)),t(d,{group:"languages"},{default:i(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-default-headers:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-default-headers:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:i(()=>[t(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-default-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[17]||(e[17]=a("h2",{id:"install_plugin",tabindex:"-1"},[s("安装 DefaultHeaders "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 DefaultHeaders {id="install_plugin"}"'},"​")],-1)),a("p",null,[e[5]||(e[5]=s(" 要将 ")),e[6]||(e[6]=a("code",null,"DefaultHeaders",-1)),e[7]||(e[7]=s(" 插件")),e[8]||(e[8]=a("a",{href:"#install"},"安装",-1)),e[9]||(e[9]=s("到应用程序中， 请在指定的")),t(o,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:i(()=>e[4]||(e[4]=[s("模块")])),_:1}),e[10]||(e[10]=s("中将其传递给 ")),e[11]||(e[11]=a("code",null,"install",-1)),e[12]||(e[12]=s(" 函数。 下面的代码片段展示了如何安装 ")),e[13]||(e[13]=a("code",null,"DefaultHeaders",-1)),e[14]||(e[14]=s(" ... "))]),t(g,null,{default:i(()=>e[15]||(e[15]=[a("li",null,[s(" ... 在 "),a("code",null,"embeddedServer"),s(" 函数调用内部。 ")],-1),a("li",null,[s(" ... 在显式定义的 "),a("code",null,"module"),s(" 内部，它是 "),a("code",null,"Application"),s(" 类的扩展函数。 ")],-1)])),_:1}),t(d,null,{default:i(()=>[t(r,{title:"embeddedServer"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DefaultHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*
            // ...
            fun Application.module() {
                install(DefaultHeaders)
                // ...
            }`})]),_:1})]),_:1}),e[18]||(e[18]=p("",11))])}const T=f(E,[["render",y]]);export{D as __pageData,T as default};
