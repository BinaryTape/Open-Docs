import{_ as F,C as e,c as u,o as m,G as a,ag as r,j as i,w as n,a as t}from"./chunks/framework.Bksy39di.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-method-override.md","filePath":"zh-Hant/ktor/server-method-override.md","lastUpdated":1755457140000}'),c={name:"zh-Hant/ktor/server-method-override.md"};function v(C,s,B,f,T,A){const d=e("TopicTitle"),o=e("primary-label"),k=e("Links"),E=e("tldr"),g=e("link-summary"),l=e("code-block"),p=e("TabItem"),h=e("Tabs"),y=e("list");return m(),u("div",null,[a(d,{labelRef:"server-plugin",title:"XHttpMethodOverride"}),a(o,{ref:"server-plugin"},null,512),a(E,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴"),t(": "),i("code",null,"io.ktor:ktor-server-method-override")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/json-kotlinx-method-override"}," json-kotlinx-method-override ")],-1)),i("p",null,[i("b",null,[a(k,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native 並允許您在不依賴額外運行時或虛擬機器的情況下運行伺服器。"},{default:n(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t(" 支援"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),a(g,null,{default:n(()=>s[5]||(s[5]=[t(" XHttpMethodOverride 啟用在 X-HTTP-Method-Override 標頭內部通道 HTTP 動詞的功能。 ")])),_:1}),s[18]||(s[18]=r("",3)),a(h,{group:"languages"},{default:n(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-method-override:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-method-override:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:n(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-method-override-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 XHttpMethodOverride "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 XHttpMethodOverride {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=t(" 要將 ")),s[8]||(s[8]=i("code",null,"XHttpMethodOverride",-1)),s[9]||(s[9]=t(" 外掛程式")),s[10]||(s[10]=i("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=t("到應用程式， 請將其傳遞給指定")),a(k,{href:"/ktor/server-modules",summary:"模組允許您通過分組路由來組織應用程式。"},{default:n(()=>s[6]||(s[6]=[t("模組")])),_:1}),s[12]||(s[12]=t("中的 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=t(" 函數。 下面的程式碼片段顯示了如何安裝 ")),s[15]||(s[15]=i("code",null,"XHttpMethodOverride",-1)),s[16]||(s[16]=t(" ... "))]),a(y,null,{default:n(()=>s[17]||(s[17]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),i("li",null,[t(" ... 在明確定義的 "),i("code",null,"module"),t(" 內部，它是一個 "),i("code",null,"Application"),t(" 類別的擴充函數。 ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(p,{title:"embeddedServer"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.methodoverride.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(XHttpMethodOverride)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.methodoverride.*
            // ...
            fun Application.module() {
                install(XHttpMethodOverride)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",8))])}const D=F(c,[["render",v]]);export{_ as __pageData,D as default};
