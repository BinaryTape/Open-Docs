import{_ as y,C as e,c as F,o as v,G as i,ag as d,j as a,w as n,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-request-validation.md","filePath":"zh-Hant/ktor/server-request-validation.md","lastUpdated":1755457140000}'),b={name:"zh-Hant/ktor/server-request-validation.md"};function m(C,s,q,f,B,V){const o=e("TopicTitle"),r=e("show-structure"),E=e("primary-label"),h=e("Links"),g=e("tldr"),c=e("link-summary"),l=e("code-block"),p=e("TabItem"),k=e("Tabs"),u=e("list");return v(),F("div",null,[i(o,{labelRef:"server-plugin",title:"請求驗證"}),i(r,{for:"chapter",depth:"2"}),i(E,{ref:"server-plugin"},null,512),i(g,null,{default:n(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"所需依賴項"),t("："),a("code",null,"io.ktor:ktor-server-request-validation")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"程式碼範例"),t("： "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/request-validation"}," request-validation ")],-1)),a("p",null,[a("b",null,[i(h,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，讓您無需額外的執行時或虛擬機器即可運行伺服器。"},{default:n(()=>s[0]||(s[0]=[t("原生伺服器")])),_:1}),s[1]||(s[1]=t("支援"))]),s[2]||(s[2]=t("：✅ "))])]),_:1}),i(c,null,{default:n(()=>s[5]||(s[5]=[t(" RequestValidation 提供了驗證傳入請求主體的能力。 ")])),_:1}),s[18]||(s[18]=d("",3)),i(k,{group:"languages"},{default:n(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-request-validation:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-request-validation:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:n(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-request-validation-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[t("安裝 RequestValidation "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 RequestValidation {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=t(" 若要將 ")),s[8]||(s[8]=a("code",null,"RequestValidation",-1)),s[9]||(s[9]=t(" 外掛程式")),s[10]||(s[10]=a("a",{href:"#install"},"安裝",-1)),s[11]||(s[11]=t("至應用程式， 請將其傳遞給指定")),i(h,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:n(()=>s[6]||(s[6]=[t("模組")])),_:1}),s[12]||(s[12]=t("中的 ")),s[13]||(s[13]=a("code",null,"install",-1)),s[14]||(s[14]=t(" 函數。 以下程式碼片段顯示如何安裝 ")),s[15]||(s[15]=a("code",null,"RequestValidation",-1)),s[16]||(s[16]=t(" ... "))]),i(u,null,{default:n(()=>s[17]||(s[17]=[a("li",null,[t(" ... 在 "),a("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),a("li",null,[t(" ... 在明確定義的 "),a("code",null,"module"),t(" 內部，它是 "),a("code",null,"Application"),t(" 類別的擴充函數。 ")],-1)])),_:1}),i(k,null,{default:n(()=>[i(p,{title:"embeddedServer"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RequestValidation)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*
            // ...
            fun Application.module() {
                install(RequestValidation)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=d("",26))])}const _=y(b,[["render",m]]);export{A as __pageData,_ as default};
