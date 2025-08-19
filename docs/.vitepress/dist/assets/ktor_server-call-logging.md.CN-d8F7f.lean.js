import{_ as c,C as n,c as y,o as m,G as a,ag as k,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-call-logging.md","filePath":"ktor/server-call-logging.md","lastUpdated":1755457140000}'),v={name:"ktor/server-call-logging.md"};function F(C,s,f,b,_,q){const h=n("TopicTitle"),d=n("show-structure"),g=n("primary-label"),p=n("Links"),E=n("tldr"),e=n("code-block"),o=n("TabItem"),r=n("Tabs"),u=n("list");return m(),y("div",null,[a(h,{labelRef:"server-plugin",title:"调用日志"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(E,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必需的依赖项"),l(": "),i("code",null,"io.ktor:ktor-server-call-logging")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/logging"}," logging ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native 并允许你运行服务器而无需额外的运行时或虚拟机。"},{default:t(()=>s[0]||(s[0]=[l("原生服务器")])),_:1}),s[1]||(s[1]=l("支持"))]),s[2]||(s[2]=l(": ✖️ "))])]),_:1}),s[17]||(s[17]=k("",4)),a(r,{group:"languages"},{default:t(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-logging:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-logging:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-logging-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("安装 CallLogging "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 CallLogging {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=l(" 要将 ")),s[7]||(s[7]=i("code",null,"CallLogging",-1)),s[8]||(s[8]=l(" 插件")),s[9]||(s[9]=i("a",{href:"#install"},"安装",-1)),s[10]||(s[10]=l("到应用程序，请在指定的 ")),a(p,{href:"/ktor/server-modules",summary:"模块允许你通过分组路由来组织应用程序。"},{default:t(()=>s[5]||(s[5]=[l("模块")])),_:1}),s[11]||(s[11]=l(" 中将其传递给 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=l(" 函数。下面的代码片段展示了如何安装 ")),s[14]||(s[14]=i("code",null,"CallLogging",-1)),s[15]||(s[15]=l(" ... "))]),a(u,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[l(" ... 在 "),i("code",null,"embeddedServer"),l(" 函数调用内部。 ")],-1),i("li",null,[l(" ... 在显式定义的 "),i("code",null,"module"),l(" 内部，该 "),i("code",null,"module"),l(" 是 "),i("code",null,"Application"),l(" 类的扩展函数。 ")],-1)])),_:1}),a(r,null,{default:t(()=>[a(o,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
