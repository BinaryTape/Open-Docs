import{_ as y,C as t,c as F,o as v,G as e,ag as o,j as i,w as n,a}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-sessions.md","filePath":"zh-Hant/ktor/server-sessions.md","lastUpdated":1755457140000}'),m={name:"zh-Hant/ktor/server-sessions.md"};function b(C,s,f,q,S,_){const r=t("TopicTitle"),d=t("show-structure"),E=t("primary-label"),p=t("Links"),g=t("tldr"),c=t("link-summary"),l=t("code-block"),h=t("TabItem"),k=t("Tabs"),u=t("list");return v(),F("div",null,[e(r,{labelRef:"server-plugin",title:"會話"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),a(": "),i("code",null,"io.ktor:ktor-server-sessions")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),a(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-client"},"session-cookie-client"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-cookie-server"},"session-cookie-server"),a(", "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/session-header-server"},"session-header-server")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在無需額外執行時或虛擬機器下運行伺服器。"},{default:n(()=>s[0]||(s[0]=[a("原生伺服器")])),_:1}),s[1]||(s[1]=a(" 支援"))]),s[2]||(s[2]=a(": ✅ "))])]),_:1}),e(c,null,{default:n(()=>s[5]||(s[5]=[a(" Sessions 外掛提供了一種在不同 HTTP 請求之間持久化資料的機制。 ")])),_:1}),s[18]||(s[18]=o("",4)),e(k,{group:"languages"},{default:n(()=>[e(h,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-sessions:$ktor_version")'})]),_:1}),e(h,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-sessions:$ktor_version"'})]),_:1}),e(h,{title:"Maven","group-key":"maven"},{default:n(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-sessions-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[a("安裝 Sessions "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Sessions {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=a(" 要將 ")),s[8]||(s[8]=i("code",null,"Sessions",-1)),s[9]||(s[9]=a(" 外掛")),s[10]||(s[10]=i("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=a("到應用程式中， 請將其傳遞給指定")),e(p,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:n(()=>s[6]||(s[6]=[a("模組")])),_:1}),s[12]||(s[12]=a("中的 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=a(" 函數。 下面的程式碼片段展示了如何安裝 ")),s[15]||(s[15]=i("code",null,"Sessions",-1)),s[16]||(s[16]=a(" ... "))]),e(u,null,{default:n(()=>s[17]||(s[17]=[i("li",null,[a(" ... 在 "),i("code",null,"embeddedServer"),a(" 函數呼叫內部。 ")],-1),i("li",null,[a(" ... 在明確定義的 "),i("code",null,"module"),a(" 內部，它是一個 "),i("code",null,"Application"),a(" 類別的擴充函數。 ")],-1)])),_:1}),e(k,null,{default:n(()=>[e(h,{title:"embeddedServer"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.sessions.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Sessions)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(h,{title:"module"},{default:n(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.sessions.*
            // ...
            fun Application.module() {
                install(Sessions)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=o("",70))])}const x=y(m,[["render",b]]);export{A as __pageData,x as default};
