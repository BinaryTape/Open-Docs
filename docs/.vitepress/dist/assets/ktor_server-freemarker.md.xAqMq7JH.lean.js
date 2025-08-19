import{_ as m,C as n,c as y,o as c,G as e,ag as o,j as i,w as t,a}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-freemarker.md","filePath":"ktor/server-freemarker.md","lastUpdated":1755457140000}'),F={name:"ktor/server-freemarker.md"};function f(v,s,b,_,C,B){const h=n("TopicTitle"),d=n("show-structure"),E=n("primary-label"),p=n("Links"),g=n("tldr"),l=n("code-block"),r=n("TabItem"),k=n("Tabs"),u=n("list");return c(),y("div",null,[e(h,{labelRef:"server-plugin",title:"FreeMarker"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依赖项"),a(": "),i("code",null,"io.ktor:ktor-server-freemarker")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),a(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/freemarker"}," freemarker ")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"模块允许你通过对路由进行分组来组织应用程序。"},{default:t(()=>s[0]||(s[0]=[a("原生服务器")])),_:1}),s[1]||(s[1]=a(" 支持"))]),s[2]||(s[2]=a(": ✖️ "))])]),_:1}),s[17]||(s[17]=o("",3)),e(k,{group:"languages"},{default:t(()=>[e(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-freemarker:$ktor_version")'})]),_:1}),e(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-freemarker:$ktor_version"'})]),_:1}),e(r,{title:"Maven","group-key":"maven"},{default:t(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-freemarker-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[a("安装 FreeMarker "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 FreeMarker {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=a(" 要将 ")),s[7]||(s[7]=i("code",null,"FreeMarker",-1)),s[8]||(s[8]=a(" 插件")),s[9]||(s[9]=i("a",{href:"#install"},"安装",-1)),s[10]||(s[10]=a("到应用程序中， 将其传递给指定")),e(p,{href:"/ktor/server-modules",summary:"模块允许你通过对路由进行分组来组织应用程序。"},{default:t(()=>s[5]||(s[5]=[a("模块")])),_:1}),s[11]||(s[11]=a("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=a(" 函数。 下面的代码片段展示了如何安装 ")),s[14]||(s[14]=i("code",null,"FreeMarker",-1)),s[15]||(s[15]=a(" ... "))]),e(u,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[a(" ... 在 "),i("code",null,"embeddedServer"),a(" 函数调用内部。 ")],-1),i("li",null,[a(" ... 在显式定义的 "),i("code",null,"module"),a(" 内部，它是一个 "),i("code",null,"Application"),a(" 类的扩展函数。 ")],-1)])),_:1}),e(k,null,{default:t(()=>[e(r,{title:"embeddedServer"},{default:t(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.freemarker.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(FreeMarker)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(r,{title:"module"},{default:t(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.freemarker.*
            // ...
            fun Application.module() {
                install(FreeMarker)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=o("",12))])}const T=m(F,[["render",f]]);export{q as __pageData,T as default};
