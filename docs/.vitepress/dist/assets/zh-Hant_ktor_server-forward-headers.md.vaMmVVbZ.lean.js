import{_ as m}from"./chunks/forwarded-headers.CS4yn2xX.js";import{_ as f,C as s,c as v,o as F,G as o,ag as k,j as r,w as d,a as t}from"./chunks/framework.Bksy39di.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-forward-headers.md","filePath":"zh-Hant/ktor/server-forward-headers.md","lastUpdated":1755457140000}'),y={name:"zh-Hant/ktor/server-forward-headers.md"};function w(b,e,E,H,q,_){const u=s("TopicTitle"),h=s("show-structure"),c=s("primary-label"),n=s("Links"),g=s("tldr"),a=s("code-block"),i=s("TabItem"),l=s("Tabs"),p=s("list");return F(),v("div",null,[o(u,{labelRef:"server-plugin",title:"轉送標頭"}),o(h,{for:"chapter",depth:"2"}),o(c,{ref:"server-plugin"},null,512),o(g,null,{default:d(()=>[e[3]||(e[3]=r("p",null,[r("b",null,"所需依賴項"),t("："),r("code",null,"io.ktor:ktor-server-forwarded-header")],-1)),e[4]||(e[4]=r("p",null,[r("b",null,"程式碼範例"),t("： "),r("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/forwarded-header"}," forwarded-header ")],-1)),r("p",null,[r("b",null,[o(n,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。"},{default:d(()=>e[0]||(e[0]=[t("原生伺服器")])),_:1}),e[1]||(e[1]=t("支援"))]),e[2]||(e[2]=t("：✅ "))])]),_:1}),e[29]||(e[29]=k("",5)),o(l,{group:"languages"},{default:d(()=>[o(i,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:d(()=>[o(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-forwarded-header:$ktor_version")'})]),_:1}),o(i,{title:"Gradle (Groovy)","group-key":"groovy"},{default:d(()=>[o(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-forwarded-header:$ktor_version"'})]),_:1}),o(i,{title:"Maven","group-key":"maven"},{default:d(()=>[o(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-forwarded-header-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[30]||(e[30]=r("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝外掛 "),r("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝外掛 {id="install_plugin"}"'},"​")],-1)),o(l,null,{default:d(()=>[o(i,{title:"ForwardedHeader"},{default:d(()=>[r("p",null,[e[6]||(e[6]=t(" 要將 ")),e[7]||(e[7]=r("code",null,"ForwardedHeaders",-1)),e[8]||(e[8]=t(" 外掛")),e[9]||(e[9]=r("a",{href:"#install"},"安裝",-1)),e[10]||(e[10]=t("到應用程式， 請在指定的")),o(n,{href:"/ktor/server-modules",summary:"模組允許您通過分組路由來組織應用程式。"},{default:d(()=>e[5]||(e[5]=[t("模組")])),_:1}),e[11]||(e[11]=t("中將其傳遞給 ")),e[12]||(e[12]=r("code",null,"install",-1)),e[13]||(e[13]=t(" 函數。 下面的程式碼片段展示了如何在以下位置安裝 ")),e[14]||(e[14]=r("code",null,"ForwardedHeaders",-1)),e[15]||(e[15]=t(" ... "))]),o(p,null,{default:d(()=>e[16]||(e[16]=[r("li",null,[t(" ... 在 "),r("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),r("li",null,[t(" ... 在明確定義的 "),r("code",null,"module"),t(" 內部，該模組是 "),r("code",null,"Application"),t(" 類別的擴展函數。 ")],-1)])),_:1}),o(l,null,{default:d(()=>[o(i,{title:"embeddedServer"},{default:d(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),o(i,{title:"module"},{default:d(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(ForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1}),o(i,{title:"XForwardedHeader"},{default:d(()=>[r("p",null,[e[18]||(e[18]=t(" 要將 ")),e[19]||(e[19]=r("code",null,"XForwardedHeaders",-1)),e[20]||(e[20]=t(" 外掛")),e[21]||(e[21]=r("a",{href:"#install"},"安裝",-1)),e[22]||(e[22]=t("到應用程式， 請在指定的")),o(n,{href:"/ktor/server-modules",summary:"模組允許您通過分組路由來組織應用程式。"},{default:d(()=>e[17]||(e[17]=[t("模組")])),_:1}),e[23]||(e[23]=t("中將其傳遞給 ")),e[24]||(e[24]=r("code",null,"install",-1)),e[25]||(e[25]=t(" 函數。 下面的程式碼片段展示了如何在以下位置安裝 ")),e[26]||(e[26]=r("code",null,"XForwardedHeaders",-1)),e[27]||(e[27]=t(" ... "))]),o(p,null,{default:d(()=>e[28]||(e[28]=[r("li",null,[t(" ... 在 "),r("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),r("li",null,[t(" ... 在明確定義的 "),r("code",null,"module"),t(" 內部，該模組是 "),r("code",null,"Application"),t(" 類別的擴展函數。 ")],-1)])),_:1}),o(l,null,{default:d(()=>[o(i,{title:"embeddedServer"},{default:d(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XForwardedHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),o(i,{title:"module"},{default:d(()=>[o(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.forwardedheaders.*
            // ...
            fun Application.module() {
                install(XForwardedHeaders)
                // ...
            }`})]),_:1})]),_:1})]),_:1})]),_:1}),e[31]||(e[31]=k("",17))])}const X=f(y,[["render",w]]);export{P as __pageData,X as default};
