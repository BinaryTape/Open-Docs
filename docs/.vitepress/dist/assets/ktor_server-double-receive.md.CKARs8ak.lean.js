import{_ as v,C as n,c as g,o as E,G as s,ag as d,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-double-receive.md","filePath":"ktor/server-double-receive.md","lastUpdated":1755457140000}'),b={name:"ktor/server-double-receive.md"};function y(m,e,f,_,F,C){const k=n("TopicTitle"),u=n("primary-label"),r=n("Links"),h=n("tldr"),a=n("code-block"),o=n("TabItem"),p=n("Tabs"),c=n("list");return E(),g("div",null,[s(k,{labelRef:"server-plugin",title:"DoubleReceive"}),s(u,{ref:"server-plugin"},null,512),s(h,null,{default:t(()=>[e[3]||(e[3]=i("p",null,[i("b",null,"所需依赖项"),l(": "),i("code",null,"<code>io.ktor:ktor-server-double-receive</code>")],-1)),e[4]||(e[4]=i("p",null,[i("b",null,"代码示例"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/double-receive"}," double-receive ")],-1)),i("p",null,[i("b",null,[s(r,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，无需额外的运行时或虚拟机即可运行服务器。"},{default:t(()=>e[0]||(e[0]=[l("原生服务器")])),_:1}),e[1]||(e[1]=l("支持"))]),e[2]||(e[2]=l(": ✅ "))])]),_:1}),e[17]||(e[17]=d("",4)),s(p,{group:"languages"},{default:t(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[s(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-double-receive:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[s(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-double-receive:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:t(()=>[s(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-double-receive-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("安装 DoubleReceive "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 DoubleReceive {id="install_plugin"}"'},"​")],-1)),i("p",null,[e[6]||(e[6]=l(" 要将 `")),e[7]||(e[7]=i("code",null,"DoubleReceive",-1)),e[8]||(e[8]=l("` 插件")),e[9]||(e[9]=i("a",{href:"#install"},"安装",-1)),e[10]||(e[10]=l("到应用程序，请在指定的")),s(r,{href:"/ktor/server-modules",summary:"模块允许你通过对路由进行分组来组织应用程序。"},{default:t(()=>e[5]||(e[5]=[l("模块")])),_:1}),e[11]||(e[11]=l("中将其传递给 `")),e[12]||(e[12]=i("code",null,"install",-1)),e[13]||(e[13]=l("` 函数。以下代码片段展示了如何安装 `")),e[14]||(e[14]=i("code",null,"DoubleReceive",-1)),e[15]||(e[15]=l("` ... "))]),s(c,null,{default:t(()=>e[16]||(e[16]=[i("li",null,[l(" ... 在 `"),i("code",null,"embeddedServer"),l("` 函数调用内部。 ")],-1),i("li",null,[l(" ... 在显式定义的 `"),i("code",null,"module"),l("` 内部，这是一个 `"),i("code",null,"Application"),l("` 类的扩展函数。 ")],-1)])),_:1}),s(p,null,{default:t(()=>[s(o,{title:"embeddedServer"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DoubleReceive)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*
            // ...
            fun Application.module() {
                install(DoubleReceive)
                // ...
            }`})]),_:1})]),_:1}),e[19]||(e[19]=d("",13))])}const D=v(b,[["render",y]]);export{T as __pageData,D as default};
