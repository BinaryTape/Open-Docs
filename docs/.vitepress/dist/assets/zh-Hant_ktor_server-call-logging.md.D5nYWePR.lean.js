import{_ as c,C as n,c as y,o as m,G as a,ag as k,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-call-logging.md","filePath":"zh-Hant/ktor/server-call-logging.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-call-logging.md"};function F(C,s,f,b,_,q){const h=n("TopicTitle"),d=n("show-structure"),g=n("primary-label"),p=n("Links"),E=n("tldr"),e=n("code-block"),o=n("TabItem"),r=n("Tabs"),u=n("list");return m(),y("div",null,[a(h,{labelRef:"server-plugin",title:"呼叫記錄"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(E,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),l(": "),i("code",null,"io.ktor:ktor-server-call-logging")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/logging"}," logging ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，讓您無需額外的執行階段或虛擬機器即可執行伺服器。"},{default:t(()=>s[0]||(s[0]=[l("原生伺服器")])),_:1}),s[1]||(s[1]=l("支援"))]),s[2]||(s[2]=l(": ✖️ "))])]),_:1}),s[17]||(s[17]=k("",4)),a(r,{group:"languages"},{default:t(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-logging:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-logging:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-logging-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("安裝 CallLogging "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 CallLogging {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=l(" 若要將 ")),s[7]||(s[7]=i("code",null,"CallLogging",-1)),s[8]||(s[8]=l(" 外掛程式")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=l("到應用程式中，請將其傳遞給指定")),a(p,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>s[5]||(s[5]=[l("模組")])),_:1}),s[11]||(s[11]=l("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=l(" 函式。 以下程式碼片段展示了如何安裝 ")),s[14]||(s[14]=i("code",null,"CallLogging",-1)),s[15]||(s[15]=l(" ... "))]),a(u,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[l(" ... 在 "),i("code",null,"embeddedServer"),l(" 函式呼叫內部。 ")],-1),i("li",null,[l(" ... 在明確定義的 "),i("code",null,"module"),l(" 內部，該模組是 "),i("code",null,"Application"),l(" 類別的擴充函式。 ")],-1)])),_:1}),a(r,null,{default:t(()=>[a(o,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
