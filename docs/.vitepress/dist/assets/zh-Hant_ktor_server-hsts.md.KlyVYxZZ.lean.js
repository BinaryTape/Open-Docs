import{_ as m,C as l,c as S,o as c,G as t,ag as d,j as e,w as i,a as n}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-hsts.md","filePath":"zh-Hant/ktor/server-hsts.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-hsts.md"};function f(E,s,T,y,_,b){const k=l("TopicTitle"),h=l("primary-label"),r=l("Links"),u=l("tldr"),a=l("code-block"),o=l("TabItem"),p=l("Tabs"),g=l("list");return c(),S("div",null,[t(k,{labelRef:"server-plugin",title:"HSTS"}),t(h,{ref:"server-plugin"},null,512),t(u,null,{default:i(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"所需依賴項"),n("："),e("code",null,"io.ktor:ktor-server-hsts")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"程式碼範例"),n("： "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-hsts"}," ssl-engine-main-hsts ")],-1)),e("p",null,[e("b",null,[t(r,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，可讓您在沒有額外運行時或虛擬機器的情況下運行伺服器。"},{default:i(()=>s[0]||(s[0]=[n("原生伺服器")])),_:1}),s[1]||(s[1]=n("支援"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),s[15]||(s[15]=d("",4)),t(p,{group:"languages"},{default:i(()=>[t(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-hsts:$ktor_version")'})]),_:1}),t(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-hsts:$ktor_version"'})]),_:1}),t(o,{title:"Maven","group-key":"maven"},{default:i(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-hsts-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[16]||(s[16]=e("h2",{id:"install_plugin",tabindex:"-1"},[n("安裝 HSTS "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 HSTS {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[6]||(s[6]=n(" 為了將 ")),s[7]||(s[7]=e("code",null,"HSTS",-1)),s[8]||(s[8]=n(" 外掛[安裝](#install)到應用程式中，請將其傳遞給指定")),t(r,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:i(()=>s[5]||(s[5]=[n("模組")])),_:1}),s[9]||(s[9]=n("中的 ")),s[10]||(s[10]=e("code",null,"install",-1)),s[11]||(s[11]=n(" 函數。下面的程式碼片段展示了如何安裝 ")),s[12]||(s[12]=e("code",null,"HSTS",-1)),s[13]||(s[13]=n(" ... "))]),t(g,null,{default:i(()=>s[14]||(s[14]=[e("li",null,[n(" ... 在 "),e("code",null,"embeddedServer"),n(" 函數呼叫中。 ")],-1),e("li",null,[n(" ... 在明確定義的 "),e("code",null,"module"),n(" 中，該 "),e("code",null,"module"),n(" 是 "),e("code",null,"Application"),n(" 類別的擴充函數。 ")],-1)])),_:1}),t(p,null,{default:i(()=>[t(o,{title:"embeddedServer"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(HSTS)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(o,{title:"module"},{default:i(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*
            // ...
            fun Application.module() {
                install(HSTS)
                // ...
            }`})]),_:1})]),_:1}),s[17]||(s[17]=d("",7))])}const F=m(v,[["render",f]]);export{C as __pageData,F as default};
