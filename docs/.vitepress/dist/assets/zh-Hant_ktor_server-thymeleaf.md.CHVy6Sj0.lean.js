import{_ as F,C as l,c as u,o as m,G as a,ag as r,j as i,w as t,a as n}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-thymeleaf.md","filePath":"zh-Hant/ktor/server-thymeleaf.md","lastUpdated":1755457140000}'),c={name:"zh-Hant/ktor/server-thymeleaf.md"};function f(C,s,v,B,b,q){const d=l("TopicTitle"),o=l("show-structure"),E=l("primary-label"),p=l("Links"),g=l("tldr"),e=l("code-block"),h=l("TabItem"),k=l("Tabs"),y=l("list");return m(),u("div",null,[a(d,{labelRef:"server-plugin",title:"Thymeleaf"}),a(o,{for:"chapter",depth:"2"}),a(E,{ref:"server-plugin"},null,512),a(g,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),n("："),i("code",null,"io.ktor:ktor-server-thymeleaf")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),n("： "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/thymeleaf"}," thymeleaf ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。"},{default:t(()=>s[0]||(s[0]=[n("原生伺服器")])),_:1}),s[1]||(s[1]=n("支援"))]),s[2]||(s[2]=n("：✖️ "))])]),_:1}),s[17]||(s[17]=r("",3)),a(k,{group:"languages"},{default:t(()=>[a(h,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-thymeleaf:$ktor_version")'})]),_:1}),a(h,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-thymeleaf:$ktor_version"'})]),_:1}),a(h,{title:"Maven","group-key":"maven"},{default:t(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-thymeleaf-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("安裝 Thymeleaf "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Thymeleaf {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=n(" 要將 ")),s[7]||(s[7]=i("code",null,"Thymeleaf",-1)),s[8]||(s[8]=n(" 插件")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=n("到應用程式中， 請在指定的")),a(p,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>s[5]||(s[5]=[n("模組")])),_:1}),s[11]||(s[11]=n("中將其傳遞給 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=n(" 函數。 下面的程式碼片段顯示了如何安裝 ")),s[14]||(s[14]=i("code",null,"Thymeleaf",-1)),s[15]||(s[15]=n(" ... "))]),a(y,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[n(" ... 在 "),i("code",null,"embeddedServer"),n(" 函數呼叫內部。 ")],-1),i("li",null,[n(" ... 在顯式定義的 "),i("code",null,"module"),n(" 內部，該 "),i("code",null,"module"),n(" 是 "),i("code",null,"Application"),n(" 類別的擴展函數。 ")],-1)])),_:1}),a(k,null,{default:t(()=>[a(h,{title:"embeddedServer"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.thymeleaf.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Thymeleaf)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(h,{title:"module"},{default:t(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.thymeleaf.*
            // ...
            fun Application.module() {
                install(Thymeleaf)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=r("",15))])}const D=F(c,[["render",f]]);export{T as __pageData,D as default};
