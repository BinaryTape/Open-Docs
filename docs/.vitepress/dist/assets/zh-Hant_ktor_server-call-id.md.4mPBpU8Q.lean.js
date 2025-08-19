import{_ as y,C as t,c as v,o as m,G as a,ag as d,j as i,w as l,a as e}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-call-id.md","filePath":"zh-Hant/ktor/server-call-id.md","lastUpdated":1755457140000}'),b={name:"zh-Hant/ktor/server-call-id.md"};function C(I,s,f,F,D,q){const h=t("TopicTitle"),k=t("show-structure"),c=t("primary-label"),r=t("Links"),g=t("tldr"),u=t("link-summary"),n=t("code-block"),p=t("TabItem"),o=t("Tabs"),E=t("list");return m(),v("div",null,[a(h,{labelRef:"server-plugin",title:"在 Ktor 伺服器中追蹤請求"}),a(k,{for:"chapter",depth:"2"}),a(c,{ref:"server-plugin"},null,512),a(g,null,{default:l(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必要的依賴項"),e(": "),i("code",null,"io.ktor:ktor-server-call-id")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),e(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/call-id"}," call-id ")],-1)),i("p",null,[i("b",null,[a(r,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:l(()=>s[0]||(s[0]=[e("原生伺服器")])),_:1}),s[1]||(s[1]=e("支援"))]),s[2]||(s[2]=e(": ✅ "))])]),_:1}),a(u,null,{default:l(()=>s[5]||(s[5]=[e(" CallId 伺服器外掛程式允許您使用唯一的呼叫 ID 來追蹤客戶端請求。 ")])),_:1}),s[18]||(s[18]=d("",6)),a(o,{group:"languages"},{default:l(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:l(()=>[a(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-call-id:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:l(()=>[a(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-call-id:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:l(()=>[a(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-call-id-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[e("安裝 CallId "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 CallId {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=e(" 要將 ")),s[8]||(s[8]=i("code",null,"CallId",-1)),s[9]||(s[9]=e(" 外掛程式")),s[10]||(s[10]=i("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=e("到應用程式中， 請將其傳遞給指定")),a(r,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:l(()=>s[6]||(s[6]=[e("模組")])),_:1}),s[12]||(s[12]=e("中的 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=e(" 函式。 下面的程式碼片段顯示了如何安裝 ")),s[15]||(s[15]=i("code",null,"CallId",-1)),s[16]||(s[16]=e(" ... "))]),a(E,null,{default:l(()=>s[17]||(s[17]=[i("li",null,[e(" ... 在 "),i("code",null,"embeddedServer"),e(" 函式呼叫內部。 ")],-1),i("li",null,[e(" ... 在明確定義的 "),i("code",null,"module"),e(" 內部，該 "),i("code",null,"module"),e(" 是 "),i("code",null,"Application"),e(" 類別的擴充函式。 ")],-1)])),_:1}),a(o,null,{default:l(()=>[a(p,{title:"embeddedServer"},{default:l(()=>[a(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CallId)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:l(()=>[a(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.callid.*
            // ...
            fun Application.module() {
                install(CallId)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=d("",23))])}const x=y(b,[["render",C]]);export{B as __pageData,x as default};
