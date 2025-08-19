import{_ as E,C as a,c,o as f,G as s,ag as p,j as e,w as t,a as n}from"./chunks/framework.Bksy39di.js";const S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-conditional-headers.md","filePath":"ktor/server-conditional-headers.md","lastUpdated":1755457140000}'),m={name:"ktor/server-conditional-headers.md"};function y(v,i,C,_,F,b){const k=a("TopicTitle"),h=a("primary-label"),r=a("Links"),g=a("tldr"),o=a("code-block"),l=a("TabItem"),d=a("Tabs"),u=a("list");return f(),c("div",null,[s(k,{labelRef:"server-plugin",title:"条件标头"}),s(h,{ref:"server-plugin"},null,512),s(g,null,{default:t(()=>[i[3]||(i[3]=e("p",null,[e("b",null,"所需依赖项"),n(": "),e("code",null,"io.ktor:ktor-server-conditional-headers")],-1)),i[4]||(i[4]=e("p",null,[e("b",null,"代码示例"),n(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/conditional-headers"}," conditional-headers ")],-1)),e("p",null,[e("b",null,[s(r,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许你在没有额外运行时或虚拟机的情况下运行服务器。"},{default:t(()=>i[0]||(i[0]=[n("原生服务器")])),_:1}),i[1]||(i[1]=n("支持"))]),i[2]||(i[2]=n(": ✅ "))])]),_:1}),i[17]||(i[17]=p("",4)),s(d,{group:"languages"},{default:t(()=>[s(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[s(o,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-conditional-headers:$ktor_version")'})]),_:1}),s(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[s(o,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-conditional-headers:$ktor_version"'})]),_:1}),s(l,{title:"Maven","group-key":"maven"},{default:t(()=>[s(o,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-conditional-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[18]||(i[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[n("安装 ConditionalHeaders "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 ConditionalHeaders {id="install_plugin"}"'},"​")],-1)),e("p",null,[i[6]||(i[6]=n(" 要将 ")),i[7]||(i[7]=e("code",null,"ConditionalHeaders",-1)),i[8]||(i[8]=n(" 插件")),i[9]||(i[9]=e("a",{href:"#install"},"安装",-1)),i[10]||(i[10]=n("到应用程序， 请将其传递给指定")),s(r,{href:"/ktor/server-modules",summary:"模块允许你通过对路由进行分组来组织你的应用程序。"},{default:t(()=>i[5]||(i[5]=[n("模块")])),_:1}),i[11]||(i[11]=n("中的 ")),i[12]||(i[12]=e("code",null,"install",-1)),i[13]||(i[13]=n(" 函数。 下面的代码片段展示了如何安装 ")),i[14]||(i[14]=e("code",null,"ConditionalHeaders",-1)),i[15]||(i[15]=n(" ... "))]),s(u,null,{default:t(()=>i[16]||(i[16]=[e("li",null,[n(" ... 在 "),e("code",null,"embeddedServer"),n(" 函数调用内部。 ")],-1),e("li",null,[n(" ... 在显式定义的 "),e("code",null,"module"),n(" 内部，它是 "),e("code",null,"Application"),n(" 类的扩展函数。 ")],-1)])),_:1}),s(d,null,{default:t(()=>[s(l,{title:"embeddedServer"},{default:t(()=>[s(o,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ConditionalHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(l,{title:"module"},{default:t(()=>[s(o,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*
            // ...
            fun Application.module() {
                install(ConditionalHeaders)
                // ...
            }`})]),_:1})]),_:1}),i[19]||(i[19]=p("",6))])}const A=E(m,[["render",y]]);export{S as __pageData,A as default};
