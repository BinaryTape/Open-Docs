import{_ as c,C as l,c as u,o as F,G as a,ag as o,j as i,w as n,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-velocity.md","filePath":"zh-Hant/ktor/server-velocity.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-velocity.md"};function m(C,s,b,f,_,q){const r=l("TopicTitle"),d=l("show-structure"),E=l("primary-label"),k=l("Links"),g=l("tldr"),e=l("code-block"),p=l("TabItem"),h=l("Tabs"),y=l("list");return F(),u("div",null,[a(r,{labelRef:"server-plugin",title:"Velocity"}),a(d,{for:"chapter",depth:"2"}),a(E,{ref:"server-plugin"},null,512),a(g,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必備依賴項"),t(": "),i("code",null,"io.ktor:ktor-server-velocity")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/velocity"}," velocity ")],-1)),i("p",null,[i("b",null,[a(k,{href:"/ktor/server-native",summary:"模組允許您透過將路由分組來建構應用程式。"},{default:n(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t("支援"))]),s[2]||(s[2]=t(": ✖️ "))])]),_:1}),s[17]||(s[17]=o("",3)),a(h,{group:"languages"},{default:n(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-velocity:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-velocity:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:n(()=>[a(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-velocity-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 Velocity "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Velocity {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=t(" 若要將 ")),s[7]||(s[7]=i("code",null,"Velocity",-1)),s[8]||(s[8]=t(" 外掛程式")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=t("到應用程式中，請在指定的 ")),a(k,{href:"/ktor/server-modules",summary:"模組允許您透過將路由分組來建構應用程式。"},{default:n(()=>s[5]||(s[5]=[t("模組")])),_:1}),s[11]||(s[11]=t(" 中將其傳遞給 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=t(" 函數。以下程式碼片段展示了如何安裝 ")),s[14]||(s[14]=i("code",null,"Velocity",-1)),s[15]||(s[15]=t(" ... "))]),a(y,null,{default:n(()=>s[16]||(s[16]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),i("li",null,[t(" ... 在明確定義的 "),i("code",null,"module"),t(" 內部，該模組是 "),i("code",null,"Application"),t(" 類別的一個擴展函數。 ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(p,{title:"embeddedServer"},{default:n(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.velocity.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Velocity)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:n(()=>[a(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.velocity.*
            // ...
            fun Application.module() {
                install(Velocity)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=o("",15))])}const V=c(v,[["render",m]]);export{A as __pageData,V as default};
