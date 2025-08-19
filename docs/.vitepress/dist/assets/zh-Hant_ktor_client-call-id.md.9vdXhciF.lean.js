import{_ as C,C as t,c as y,o as m,G as s,ag as p,j as l,w as e,a}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/client-call-id.md","filePath":"zh-Hant/ktor/client-call-id.md","lastUpdated":1755457140000}'),I={name:"zh-Hant/ktor/client-call-id.md"};function b(v,i,f,_,F,D){const r=t("TopicTitle"),k=t("show-structure"),h=t("primary-label"),c=t("tldr"),u=t("link-summary"),n=t("code-block"),o=t("TabItem"),d=t("Tabs"),g=t("Links"),E=t("list");return m(),y("div",null,[s(r,{labelRef:"client-plugin",title:"在 Ktor Client 中追蹤請求"}),s(k,{for:"chapter",depth:"2"}),s(h,{ref:"client-plugin"},null,512),s(c,null,{default:e(()=>i[0]||(i[0]=[l("p",null,[l("b",null,"必要依賴"),a(": "),l("code",null,"io.ktor:ktor-client-call-id")],-1),l("p",null,[l("b",null,"程式碼範例"),a(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/client-call-id"}," client-call-id ")],-1)])),_:1}),s(u,null,{default:e(()=>i[1]||(i[1]=[a(" CallId 用戶端外掛程式允許您使用唯一的呼叫 ID 來追蹤用戶端請求。 ")])),_:1}),i[14]||(i[14]=p("",6)),s(d,{group:"languages"},{default:e(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[s(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-client-call-id:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[s(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-client-call-id:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:e(()=>[s(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-client-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[15]||(i[15]=l("h2",{id:"install_plugin",tabindex:"-1"},[a("安裝 CallId "),l("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 CallId {id="install_plugin"}"'},"​")],-1)),l("p",null,[i[3]||(i[3]=a(" 若要將 ")),i[4]||(i[4]=l("code",null,"CallId",-1)),i[5]||(i[5]=a(" 外掛程式")),i[6]||(i[6]=l("a",{href:"#install"},"安裝",-1)),i[7]||(i[7]=a("到應用程式中，請將其傳遞給指定")),s(g,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:e(()=>i[2]||(i[2]=[a("模組")])),_:1}),i[8]||(i[8]=a("中的 ")),i[9]||(i[9]=l("code",null,"install",-1)),i[10]||(i[10]=a(" 函數。 下面的程式碼片段展示了如何安裝 ")),i[11]||(i[11]=l("code",null,"CallId",-1)),i[12]||(i[12]=a("... "))]),s(E,null,{default:e(()=>i[13]||(i[13]=[l("li",null,[a(" ...在 "),l("code",null,"embeddedServer"),a(" 函數呼叫內部。 ")],-1),l("li",null,[a(" ...在明確定義的 "),l("code",null,"module"),a(" 內部，該模組是 "),l("code",null,"Application"),a(" 類別的一個擴充函數。 ")],-1)])),_:1}),s(d,null,{default:e(()=>[s(o,{title:"embeddedServer"},{default:e(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:e(()=>[s(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.client.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),i[16]||(i[16]=p("",24))])}const x=C(I,[["render",b]]);export{T as __pageData,x as default};
