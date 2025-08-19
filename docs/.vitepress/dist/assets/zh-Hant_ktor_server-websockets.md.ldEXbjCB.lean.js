import{_ as F,C as t,c as b,o as m,G as a,ag as o,j as i,w as n,a as e}from"./chunks/framework.Bksy39di.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-websockets.md","filePath":"zh-Hant/ktor/server-websockets.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-websockets.md"};function C(f,s,S,B,w,q){const r=t("TopicTitle"),d=t("show-structure"),E=t("primary-label"),p=t("Links"),c=t("tldr"),g=t("link-summary"),y=t("snippet"),l=t("code-block"),k=t("TabItem"),h=t("Tabs"),u=t("list");return m(),b("div",null,[a(r,{labelRef:"server-plugin",title:"Ktor 伺服器中的 WebSocket"}),a(d,{for:"chapter",depth:"2"}),a(E,{ref:"server-plugin"},null,512),a(c,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需相依性"),e(": "),i("code",null,"io.ktor:ktor-server-websockets")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),e(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/server-websockets"}," server-websockets ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native 並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。"},{default:n(()=>s[0]||(s[0]=[e("原生伺服器")])),_:1}),s[1]||(s[1]=e(" 支援"))]),s[2]||(s[2]=e(": ✅ "))])]),_:1}),a(g,null,{default:n(()=>s[5]||(s[5]=[e(" WebSocket 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。 ")])),_:1}),a(y,{id:"websockets-description"},{default:n(()=>s[6]||(s[6]=[i("p",null,"WebSocket 是一種協定，透過單一 TCP 連線在用戶的瀏覽器和伺服器之間提供全雙工通訊會話。它對於建立需要從伺服器即時傳輸資料到伺服器以及從伺服器接收即時資料的應用程式特別有用。",-1),i("p",null,"Ktor 同時支援伺服器端和用戶端的 WebSocket 協定。",-1)])),_:1}),s[19]||(s[19]=o("",6)),a(h,{group:"languages"},{default:n(()=>[a(k,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-websockets:$ktor_version")'})]),_:1}),a(k,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-websockets:$ktor_version"'})]),_:1}),a(k,{title:"Maven","group-key":"maven"},{default:n(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-websockets-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[20]||(s[20]=i("h2",{id:"install_plugin",tabindex:"-1"},[e("安裝 WebSockets "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 WebSockets {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[8]||(s[8]=e(" 若要將 ")),s[9]||(s[9]=i("code",null,"WebSockets",-1)),s[10]||(s[10]=e(" 外掛程式")),s[11]||(s[11]=i("a",{href:"#install"},"安裝",-1)),s[12]||(s[12]=e("到應用程式中，請在指定的")),a(p,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:n(()=>s[7]||(s[7]=[e("模組")])),_:1}),s[13]||(s[13]=e("中將其傳遞給 ")),s[14]||(s[14]=i("code",null,"install",-1)),s[15]||(s[15]=e(" 函式。以下程式碼片段展示如何安裝 ")),s[16]||(s[16]=i("code",null,"WebSockets",-1)),s[17]||(s[17]=e(" ... "))]),a(u,null,{default:n(()=>s[18]||(s[18]=[i("li",null,[e(" ... 在 "),i("code",null,"embeddedServer"),e(" 函式呼叫內部。 ")],-1),i("li",null,[e(" ... 在明確定義的 "),i("code",null,"module"),e(" 內部，它是 "),i("code",null,"Application"),e(" 類別的擴充函式。 ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(k,{title:"embeddedServer"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.websocket.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(WebSockets)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(k,{title:"module"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.websocket.*
            // ...
            fun Application.module() {
                install(WebSockets)
                // ...
            }`})]),_:1})]),_:1}),s[21]||(s[21]=o("",35))])}const _=F(v,[["render",C]]);export{x as __pageData,_ as default};
