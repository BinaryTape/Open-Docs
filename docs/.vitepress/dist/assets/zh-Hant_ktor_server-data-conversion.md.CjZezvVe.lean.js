import{_ as u,C as e,c as v,o as y,G as a,ag as k,j as i,w as t,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-data-conversion.md","filePath":"zh-Hant/ktor/server-data-conversion.md","lastUpdated":1755457140000}'),m={name:"zh-Hant/ktor/server-data-conversion.md"};function F(C,s,D,b,f,A){const d=e("TopicTitle"),h=e("primary-label"),p=e("Links"),E=e("tldr"),g=e("link-summary"),l=e("code-block"),o=e("TabItem"),r=e("Tabs"),c=e("list");return y(),v("div",null,[a(d,{labelRef:"server-plugin",title:"資料轉換"}),a(h,{ref:"server-plugin"},null,512),a(E,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"程式碼範例"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/data-conversion"}," data-conversion ")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"所需依賴項"),n(": "),i("code",null,"io.ktor:ktor-server-data-conversion")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，允許您在不依賴額外執行時或虛擬機器的情況下執行伺服器。"},{default:t(()=>s[0]||(s[0]=[n("原生伺服器")])),_:1}),s[1]||(s[1]=n(" 支援"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),a(g,null,{default:t(()=>s[5]||(s[5]=[n(" Ktor 伺服器的 DataConversion 外掛允許您新增自訂轉換器，以序列化和反序列化值列表。 ")])),_:1}),s[18]||(s[18]=k("",3)),a(r,{group:"languages"},{default:t(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-data-conversion:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-data-conversion:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:t(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-data-conversion-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("安裝 DataConversion "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 DataConversion {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=n(" 若要將 ")),s[8]||(s[8]=i("code",null,"DataConversion",-1)),s[9]||(s[9]=n(" 外掛")),s[10]||(s[10]=i("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=n("到應用程式中，請在指定的")),a(p,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>s[6]||(s[6]=[n("模組")])),_:1}),s[12]||(s[12]=n("中將其傳遞給 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=n(" 函數。以下程式碼片段展示了如何安裝 ")),s[15]||(s[15]=i("code",null,"DataConversion",-1)),s[16]||(s[16]=n(" ... "))]),a(c,null,{default:t(()=>s[17]||(s[17]=[i("li",null,[n(" ... 在 "),i("code",null,"embeddedServer"),n(" 函數呼叫內部。 ")],-1),i("li",null,[n(" ... 在明確定義的 "),i("code",null,"module"),n(" 內部，後者是 "),i("code",null,"Application"),n(" 類別的一個擴展函數。 ")],-1)])),_:1}),a(r,null,{default:t(()=>[a(o,{title:"embeddedServer"},{default:t(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DataConversion)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(o,{title:"module"},{default:t(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*
            // ...
            fun Application.module() {
                install(DataConversion)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=k("",18))])}const T=u(m,[["render",F]]);export{B as __pageData,T as default};
