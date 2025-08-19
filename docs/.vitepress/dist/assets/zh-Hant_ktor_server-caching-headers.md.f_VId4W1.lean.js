import{_ as u,C as t,c as y,o as C,G as a,ag as k,j as i,w as e,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-caching-headers.md","filePath":"zh-Hant/ktor/server-caching-headers.md","lastUpdated":1755457140000}'),F={name:"zh-Hant/ktor/server-caching-headers.md"};function m(v,s,f,b,A,_){const o=t("TopicTitle"),d=t("show-structure"),g=t("primary-label"),p=t("Links"),E=t("tldr"),l=t("code-block"),h=t("TabItem"),r=t("Tabs"),c=t("list");return C(),y("div",null,[a(o,{labelRef:"server-plugin",title:"快取標頭"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(E,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依賴項"),n("："),i("code",null,"io.ktor:ktor-server-caching-headers")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),n("： "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/caching-headers"}," caching-headers ")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native 並允許您在沒有額外運行時或虛擬機器下運行伺服器。"},{default:e(()=>s[0]||(s[0]=[n("Native server")])),_:1}),s[1]||(s[1]=n(" 支援"))]),s[2]||(s[2]=n("：✅ "))])]),_:1}),s[17]||(s[17]=k("",4)),a(r,{group:"languages"},{default:e(()=>[a(h,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-caching-headers:$ktor_version")'})]),_:1}),a(h,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-caching-headers:$ktor_version"'})]),_:1}),a(h,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-caching-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("安裝 CachingHeaders "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 CachingHeaders {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=n(" 若要將 ")),s[7]||(s[7]=i("code",null,"CachingHeaders",-1)),s[8]||(s[8]=n(" 插件")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=n("到應用程式， 請將其傳遞給指定")),a(p,{href:"/ktor/server-modules",summary:"模組允許您透過將路由分組來建構應用程式。"},{default:e(()=>s[5]||(s[5]=[n("模組")])),_:1}),s[11]||(s[11]=n("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=n(" 函數。 以下程式碼片段展示了如何安裝 ")),s[14]||(s[14]=i("code",null,"CachingHeaders",-1)),s[15]||(s[15]=n(" ... "))]),a(c,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[n(" ... 在 "),i("code",null,"embeddedServer"),n(" 函數呼叫內部。 ")],-1),i("li",null,[n(" ... 在明確定義的 "),i("code",null,"module"),n(" 內部，它是一個 "),i("code",null,"Application"),n(" 類別的擴充函數。 ")],-1)])),_:1}),a(r,null,{default:e(()=>[a(h,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.cachingheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CachingHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(h,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.cachingheaders.*
            // ...
            fun Application.module() {
                install(CachingHeaders)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",14))])}const T=u(F,[["render",m]]);export{B as __pageData,T as default};
