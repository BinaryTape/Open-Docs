import{_ as m,C as l,c as S,o as v,G as t,ag as d,j as e,w as i,a as n}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-hsts.md","filePath":"ktor/server-hsts.md","lastUpdated":1755457140000}'),f={name:"ktor/server-hsts.md"};function c(E,s,T,y,b,_){const k=l("TopicTitle"),h=l("primary-label"),o=l("Links"),u=l("tldr"),a=l("code-block"),r=l("TabItem"),p=l("Tabs"),g=l("list");return v(),S("div",null,[t(k,{labelRef:"server-plugin",title:"HSTS"}),t(h,{ref:"server-plugin"},null,512),t(u,null,{default:i(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"必需的依赖项"),n(": "),e("code",null,"io.ktor:ktor-server-hsts")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"代码示例"),n(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-hsts"}," ssl-engine-main-hsts ")],-1)),e("p",null,[e("b",null,[t(o,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并允许您在没有额外运行时或虚拟机的情况下运行服务器。"},{default:i(()=>s[0]||(s[0]=[n("原生服务器")])),_:1}),s[1]||(s[1]=n("支持"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),s[17]||(s[17]=d("",4)),t(p,{group:"languages"},{default:i(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-hsts:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-hsts:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:i(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-hsts-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[n("安装 HSTS "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 HSTS {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[6]||(s[6]=n(" 要将 ")),s[7]||(s[7]=e("code",null,"HSTS",-1)),s[8]||(s[8]=n(" 插件")),s[9]||(s[9]=e("a",{href:"#install"},"安装",-1)),s[10]||(s[10]=n("到应用程序，请将其传递给指定")),t(o,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:i(()=>s[5]||(s[5]=[n("模块")])),_:1}),s[11]||(s[11]=n("中的 ")),s[12]||(s[12]=e("code",null,"install",-1)),s[13]||(s[13]=n(" 函数。以下代码片段展示了如何安装 ")),s[14]||(s[14]=e("code",null,"HSTS",-1)),s[15]||(s[15]=n(" ... "))]),t(g,null,{default:i(()=>s[16]||(s[16]=[e("li",null,[n(" ... 在 "),e("code",null,"embeddedServer"),n(" 函数调用内部。 ")],-1),e("li",null,[n(" ... 在显式定义的 "),e("code",null,"module"),n(" 内部，它是 "),e("code",null,"Application"),n(" 类的扩展函数。 ")],-1)])),_:1}),t(p,null,{default:i(()=>[t(r,{title:"embeddedServer"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(HSTS)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*
            // ...
            fun Application.module() {
                install(HSTS)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=d("",7))])}const F=m(f,[["render",c]]);export{C as __pageData,F as default};
