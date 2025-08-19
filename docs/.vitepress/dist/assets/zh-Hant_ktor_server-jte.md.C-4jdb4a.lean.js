import{_ as y,C as n,c as m,o as c,G as e,ag as k,j as i,w as a,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-jte.md","filePath":"zh-Hant/ktor/server-jte.md","lastUpdated":1755457140000}'),v={name:"zh-Hant/ktor/server-jte.md"};function F(f,s,C,b,_,q){const h=n("TopicTitle"),d=n("show-structure"),E=n("primary-label"),r=n("Links"),g=n("tldr"),l=n("code-block"),p=n("TabItem"),o=n("Tabs"),u=n("list");return c(),m("div",null,[e(h,{labelRef:"server-plugin",title:"JTE"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:a(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),t("："),i("code",null,"io.ktor:ktor-server-jte")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),t("： "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/jte"}," jte ")],-1)),i("p",null,[i("b",null,[e(r,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，可讓您在無需額外執行時或虛擬機器下運行伺服器。"},{default:a(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t("支援"))]),s[2]||(s[2]=t("：✖️ "))])]),_:1}),s[17]||(s[17]=k("",3)),e(o,{group:"languages"},{default:a(()=>[e(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-jte:$ktor_version")'})]),_:1}),e(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-jte:$ktor_version"'})]),_:1}),e(p,{title:"Maven","group-key":"maven"},{default:a(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-jte-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("blockquote",null,[i("p",null,[t("若要處理 "),i("code",null,".kte"),t(" 檔案，您需要將 "),i("code",null,"gg.jte:jte-kotlin"),t(" 構件新增到您的專案。")])],-1)),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 Jte "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Jte {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=t(" 若要將 ")),s[7]||(s[7]=i("code",null,"Jte",-1)),s[8]||(s[8]=t(" 外掛 ")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=t(" 到應用程式， 請將其傳遞給指定 ")),e(r,{href:"/ktor/server-modules",summary:"模組可讓您透過群組化路由來建構您的應用程式。"},{default:a(()=>s[5]||(s[5]=[t("模組")])),_:1}),s[11]||(s[11]=t(" 中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=t(" 函數。 以下程式碼片段顯示如何安裝 ")),s[14]||(s[14]=i("code",null,"Jte",-1)),s[15]||(s[15]=t(" ... "))]),e(u,null,{default:a(()=>s[16]||(s[16]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),i("li",null,[t(" ... 在明確定義的 "),i("code",null,"module"),t(" 內部，該 "),i("code",null,"module"),t(" 是 "),i("code",null,"Application"),t(" 類的擴展函數。 ")],-1)])),_:1}),e(o,null,{default:a(()=>[e(p,{title:"embeddedServer"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.jte.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Jte)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(p,{title:"module"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.jte.*
            // ...
            fun Application.module() {
                install(Jte)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=k("",12))])}const B=y(v,[["render",F]]);export{A as __pageData,B as default};
