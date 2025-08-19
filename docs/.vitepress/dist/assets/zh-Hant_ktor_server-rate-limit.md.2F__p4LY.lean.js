import{_ as c,C as l,c as u,o as m,G as a,ag as r,j as i,w as t,a as n}from"./chunks/framework.Bksy39di.js";const L=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-rate-limit.md","filePath":"zh-Hant/ktor/server-rate-limit.md","lastUpdated":1755457140000}'),C={name:"zh-Hant/ktor/server-rate-limit.md"};function B(q,s,v,b,A,f){const E=l("TopicTitle"),d=l("show-structure"),o=l("primary-label"),k=l("Links"),g=l("tldr"),y=l("link-summary"),e=l("code-block"),p=l("TabItem"),h=l("Tabs"),F=l("list");return m(),u("div",null,[a(E,{labelRef:"server-plugin",title:"速率限制"}),a(d,{for:"chapter",depth:"2"}),a(o,{ref:"server-plugin"},null,512),a(g,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),n("："),i("code",null,"io.ktor:ktor-server-rate-limit")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),n("： "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/rate-limit"}," rate-limit ")],-1)),i("p",null,[i("b",null,[a(k,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:t(()=>s[0]||(s[0]=[n("原生伺服器")])),_:1}),s[1]||(s[1]=n("支援"))]),s[2]||(s[2]=n("：✅ "))])]),_:1}),a(y,null,{default:t(()=>s[5]||(s[5]=[n(" RateLimit 提供了驗證傳入請求主體的能力。 ")])),_:1}),s[18]||(s[18]=r("",4)),a(h,{group:"languages"},{default:t(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-rate-limit:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-rate-limit:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-rate-limit-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("安裝 RateLimit "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 RateLimit {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=n(" 若要將 ")),s[8]||(s[8]=i("code",null,"RateLimit",-1)),s[9]||(s[9]=n(" 外掛程式")),s[10]||(s[10]=i("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=n("到應用程式中， 請在指定的")),a(k,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:t(()=>s[6]||(s[6]=[n("模組")])),_:1}),s[12]||(s[12]=n("中將其傳遞給 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=n(" 函數。 下面的程式碼片段展示了如何安裝 ")),s[15]||(s[15]=i("code",null,"RateLimit",-1)),s[16]||(s[16]=n(" ... "))]),a(F,null,{default:t(()=>s[17]||(s[17]=[i("li",null,[n(" ... 在 "),i("code",null,"embeddedServer"),n(" 函數呼叫內部。 ")],-1),i("li",null,[n(" ... 在明確定義的 "),i("code",null,"module"),n(" 內部，此 "),i("code",null,"module"),n(" 是 "),i("code",null,"Application"),n(" 類別的擴充函數。 ")],-1)])),_:1}),a(h,null,{default:t(()=>[a(p,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RateLimit)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*
            // ...
            fun Application.module() {
                install(RateLimit)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",20))])}const R=c(C,[["render",B]]);export{L as __pageData,R as default};
