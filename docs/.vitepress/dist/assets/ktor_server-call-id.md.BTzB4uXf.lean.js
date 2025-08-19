import{_ as y,C as t,c as v,o as m,G as i,ag as o,j as a,w as l,a as e}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-call-id.md","filePath":"ktor/server-call-id.md","lastUpdated":1755457140000}'),b={name:"ktor/server-call-id.md"};function C(I,s,f,F,D,q){const h=t("TopicTitle"),k=t("show-structure"),c=t("primary-label"),r=t("Links"),g=t("tldr"),u=t("link-summary"),n=t("code-block"),p=t("TabItem"),d=t("Tabs"),E=t("list");return m(),v("div",null,[i(h,{labelRef:"server-plugin",title:"在 Ktor 服务器中跟踪请求"}),i(k,{for:"chapter",depth:"2"}),i(c,{ref:"server-plugin"},null,512),i(g,null,{default:l(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"所需依赖项"),e(": "),a("code",null,"io.ktor:ktor-server-call-id")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"代码示例"),e(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/call-id"}," call-id ")],-1)),a("p",null,[a("b",null,[i(r,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并允许您无需额外运行时或虚拟机即可运行服务器。"},{default:l(()=>s[0]||(s[0]=[e("原生服务器")])),_:1}),s[1]||(s[1]=e("支持"))]),s[2]||(s[2]=e(": ✅ "))])]),_:1}),i(u,null,{default:l(()=>s[5]||(s[5]=[e(" CallId 服务器插件允许您使用唯一的调用 ID 跟踪客户端请求。 ")])),_:1}),s[18]||(s[18]=o("",6)),i(d,{group:"languages"},{default:l(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:l(()=>[i(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-id:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:l(()=>[i(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-id:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:l(()=>[i(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[e("安装 CallId "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 CallId {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=e(" 要将 ")),s[8]||(s[8]=a("a",{href:"#install"},"安装",-1)),s[9]||(s[9]=e()),s[10]||(s[10]=a("code",null,"CallId",-1)),s[11]||(s[11]=e(" 插件到应用程序， 请在指定的 ")),i(r,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来构建应用程序。"},{default:l(()=>s[6]||(s[6]=[e("模块")])),_:1}),s[12]||(s[12]=e(" 中将其传递给 ")),s[13]||(s[13]=a("code",null,"install",-1)),s[14]||(s[14]=e(" 函数。 以下代码片段展示了如何安装 ")),s[15]||(s[15]=a("code",null,"CallId",-1)),s[16]||(s[16]=e(" ... "))]),i(E,null,{default:l(()=>s[17]||(s[17]=[a("li",null,[e(" ... 在 "),a("code",null,"embeddedServer"),e(" 函数调用内部。 ")],-1),a("li",null,[e(" ... 在显式定义的 "),a("code",null,"module"),e(" 内部，它是 "),a("code",null,"Application"),e(" 类的一个扩展函数。 ")],-1)])),_:1}),i(d,null,{default:l(()=>[i(p,{title:"embeddedServer"},{default:l(()=>[i(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:l(()=>[i(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=o("",23))])}const x=y(b,[["render",C]]);export{B as __pageData,x as default};
