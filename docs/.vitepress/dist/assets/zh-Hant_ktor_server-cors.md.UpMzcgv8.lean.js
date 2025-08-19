import{_ as u,C as n,c as y,o as F,G as a,ag as o,j as i,w as e,a as t}from"./chunks/framework.Bksy39di.js";const H=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-cors.md","filePath":"zh-Hant/ktor/server-cors.md","lastUpdated":1755457140000}'),C={name:"zh-Hant/ktor/server-cors.md"};function v(m,s,b,f,q,B){const r=n("TopicTitle"),d=n("show-structure"),E=n("primary-label"),h=n("Links"),c=n("tldr"),l=n("code-block"),p=n("TabItem"),k=n("Tabs"),g=n("list");return F(),y("div",null,[a(r,{labelRef:"server-plugin",title:"CORS"}),a(d,{for:"chapter",depth:"2"}),a(E,{ref:"server-plugin"},null,512),a(c,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴"),t(": "),i("code",null,"io.ktor:ktor-server-cors")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/cors"}," cors ")],-1)),i("p",null,[i("b",null,[a(h,{href:"/ktor/server-native",summary:"模組允許您透過分組路由來組織應用程式。"},{default:e(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t("支援"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),s[17]||(s[17]=o("",3)),a(k,{group:"languages"},{default:e(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-cors:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-cors:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-cors-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 CORS "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 CORS {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=t(" 若要將 ")),s[7]||(s[7]=i("code",null,"CORS",-1)),s[8]||(s[8]=t(" 外掛")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=t("到應用程式， 請將其傳遞給指定")),a(h,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:e(()=>s[5]||(s[5]=[t("模組")])),_:1}),s[11]||(s[11]=t("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=t(" 函數。 以下程式碼片段顯示如何安裝 ")),s[14]||(s[14]=i("code",null,"CORS",-1)),s[15]||(s[15]=t(" ... "))]),a(g,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函數呼叫中。 ")],-1),i("li",null,[t(" ... 在明確定義的 "),i("code",null,"module"),t(" 中，該模組是 "),i("code",null,"Application"),t(" 類別的擴展函數。 ")],-1)])),_:1}),a(k,null,{default:e(()=>[a(p,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.cors.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CORS)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.cors.*
            // ...
            fun Application.module() {
                install(CORS)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=o("",36))])}const _=u(C,[["render",v]]);export{H as __pageData,_ as default};
