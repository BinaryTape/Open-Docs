import{_ as C,C as t,c as y,o as m,G as s,ag as p,j as l,w as a,a as e}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/client-call-id.md","filePath":"ktor/client-call-id.md","lastUpdated":1755457140000}'),I={name:"ktor/client-call-id.md"};function b(v,i,f,_,F,D){const r=t("TopicTitle"),k=t("show-structure"),h=t("primary-label"),c=t("tldr"),u=t("link-summary"),n=t("code-block"),o=t("TabItem"),d=t("Tabs"),g=t("Links"),E=t("list");return m(),y("div",null,[s(r,{labelRef:"client-plugin",title:"在 Ktor 客户端中追踪请求"}),s(k,{for:"chapter",depth:"2"}),s(h,{ref:"client-plugin"},null,512),s(c,null,{default:a(()=>i[0]||(i[0]=[l("p",null,[l("b",null,"所需依赖项"),e(": "),l("code",null,"io.ktor:ktor-client-call-id")],-1),l("p",null,[l("b",null,"代码示例"),e(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-call-id"}," client-call-id ")],-1)])),_:1}),s(u,null,{default:a(()=>i[1]||(i[1]=[e(" CallId 客户端插件允许你通过使用唯一调用 ID 来追踪客户端请求。 ")])),_:1}),i[14]||(i[14]=p("",6)),s(d,{group:"languages"},{default:a(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[s(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-client-call-id:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[s(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-client-call-id:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:a(()=>[s(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-client-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[15]||(i[15]=l("h2",{id:"install_plugin",tabindex:"-1"},[e("安装 CallId "),l("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 CallId {id="install_plugin"}"'},"​")],-1)),l("p",null,[i[3]||(i[3]=e(" 要将 ")),i[4]||(i[4]=l("code",null,"CallId",-1)),i[5]||(i[5]=e(" 插件")),i[6]||(i[6]=l("a",{href:"#install"},"安装",-1)),i[7]||(i[7]=e("到应用程序中， 请将其传递给指定")),s(g,{href:"/ktor/server-modules",summary:"模块允许你通过对路由进行分组来组织应用程序。"},{default:a(()=>i[2]||(i[2]=[e("模块")])),_:1}),i[8]||(i[8]=e("中的 ")),i[9]||(i[9]=l("code",null,"install",-1)),i[10]||(i[10]=e(" 函数。 下面的代码片段展示了如何安装 ")),i[11]||(i[11]=l("code",null,"CallId",-1)),i[12]||(i[12]=e(" ... "))]),s(E,null,{default:a(()=>i[13]||(i[13]=[l("li",null,[e(" ... 在 "),l("code",null,"embeddedServer"),e(" 函数调用内部。 ")],-1),l("li",null,[e(" ... 在显式定义的 "),l("code",null,"module"),e(" 内部，后者是 "),l("code",null,"Application"),e(" 类的扩展函数。 ")],-1)])),_:1}),s(d,null,{default:a(()=>[s(o,{title:"embeddedServer"},{default:a(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:a(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),i[16]||(i[16]=p("",24))])}const x=C(I,[["render",b]]);export{T as __pageData,x as default};
