import{_ as c,C as n,c as m,o as y,G as a,ag as k,j as i,w as e,a as t}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-mustache.md","filePath":"zh-Hant/ktor/server-mustache.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-mustache.md"};function F(b,s,f,_,C,A){const o=n("TopicTitle"),d=n("show-structure"),u=n("primary-label"),h=n("Links"),E=n("tldr"),l=n("code-block"),p=n("TabItem"),r=n("Tabs"),g=n("list");return y(),m("div",null,[a(o,{labelRef:"server-plugin",title:"Mustache"}),a(d,{for:"chapter",depth:"2"}),a(u,{ref:"server-plugin"},null,512),a(E,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),t("："),i("code",null,"io.ktor:ktor-server-mustache")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),t("： "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/mustache"}," mustache ")],-1)),i("p",null,[i("b",null,[a(h,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器下運行伺服器。"},{default:e(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t("支援"))]),s[2]||(s[2]=t("：✖️ "))])]),_:1}),s[17]||(s[17]=k("",3)),a(r,{group:"languages"},{default:e(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-mustache:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-mustache:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-mustache-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 Mustache "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Mustache {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=t(" 若要")),s[7]||(s[7]=i("a",{href:"#install"},"安裝",-1)),s[8]||(s[8]=t()),s[9]||(s[9]=i("code",null,"Mustache",-1)),s[10]||(s[10]=t(" 外掛程式到應用程式，請將其傳遞給指定")),a(h,{href:"/ktor/server-modules",summary:"模組允許您透過將路由分組來建構您的應用程式。"},{default:e(()=>s[5]||(s[5]=[t("模組")])),_:1}),s[11]||(s[11]=t("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=t(" 函數。 下方的程式碼片段顯示了如何安裝 ")),s[14]||(s[14]=i("code",null,"Mustache",-1)),s[15]||(s[15]=t(" ... "))]),a(g,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函數呼叫內。 ")],-1),i("li",null,[t(" ... 在明確定義的 "),i("code",null,"module"),t(" 內，這是 "),i("code",null,"Application"),t(" 類別的擴充函數。 ")],-1)])),_:1}),a(r,null,{default:e(()=>[a(p,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.mustache.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Mustache)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.mustache.*
            // ...
            fun Application.module() {
                install(Mustache)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",12))])}const B=c(v,[["render",F]]);export{q as __pageData,B as default};
