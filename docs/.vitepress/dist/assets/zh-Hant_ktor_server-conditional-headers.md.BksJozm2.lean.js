import{_ as c,C as a,c as E,o as f,G as n,ag as p,j as e,w as t,a as s}from"./chunks/framework.Bksy39di.js";const S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-conditional-headers.md","filePath":"zh-Hant/ktor/server-conditional-headers.md","lastUpdated":1755457140000}'),m={name:"zh-Hant/ktor/server-conditional-headers.md"};function y(v,i,C,_,F,b){const k=a("TopicTitle"),h=a("primary-label"),r=a("Links"),g=a("tldr"),o=a("code-block"),l=a("TabItem"),d=a("Tabs"),u=a("list");return f(),E("div",null,[n(k,{labelRef:"server-plugin",title:"條件式標頭"}),n(h,{ref:"server-plugin"},null,512),n(g,null,{default:t(()=>[i[3]||(i[3]=e("p",null,[e("b",null,"所需依賴項"),s("："),e("code",null,"io.ktor:ktor-server-conditional-headers")],-1)),i[4]||(i[4]=e("p",null,[e("b",null,"程式碼範例"),s("： "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/conditional-headers"}," conditional-headers ")],-1)),e("p",null,[e("b",null,[n(r,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。"},{default:t(()=>i[0]||(i[0]=[s("Native server")])),_:1}),i[1]||(i[1]=s(" 支援"))]),i[2]||(i[2]=s(": ✅ "))])]),_:1}),i[17]||(i[17]=p("",4)),n(d,{group:"languages"},{default:t(()=>[n(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[n(o,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-conditional-headers:$ktor_version")'})]),_:1}),n(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[n(o,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-conditional-headers:$ktor_version"'})]),_:1}),n(l,{title:"Maven","group-key":"maven"},{default:t(()=>[n(o,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-conditional-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),i[18]||(i[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[s("安裝 ConditionalHeaders "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 ConditionalHeaders {id="install_plugin"}"'},"​")],-1)),e("p",null,[i[6]||(i[6]=s(" 要將 ")),i[7]||(i[7]=e("code",null,"ConditionalHeaders",-1)),i[8]||(i[8]=s(" 外掛程式")),i[9]||(i[9]=e("a",{href:"#install"},"安裝",-1)),i[10]||(i[10]=s("到應用程式中， 請將其傳遞給指定")),n(r,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織您的應用程式。"},{default:t(()=>i[5]||(i[5]=[s("模組")])),_:1}),i[11]||(i[11]=s("中的 ")),i[12]||(i[12]=e("code",null,"install",-1)),i[13]||(i[13]=s(" 函數。 以下程式碼片段展示了如何安裝 ")),i[14]||(i[14]=e("code",null,"ConditionalHeaders",-1)),i[15]||(i[15]=s(" ... "))]),n(u,null,{default:t(()=>i[16]||(i[16]=[e("li",null,[s(" ... 在 "),e("code",null,"embeddedServer"),s(" 函數呼叫內部。 ")],-1),e("li",null,[s(" ... 在明確定義的 "),e("code",null,"module"),s(" 內部，該 "),e("code",null,"module"),s(" 是 "),e("code",null,"Application"),s(" 類別的一個擴充函數。 ")],-1)])),_:1}),n(d,null,{default:t(()=>[n(l,{title:"embeddedServer"},{default:t(()=>[n(o,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(ConditionalHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),n(l,{title:"module"},{default:t(()=>[n(o,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.conditionalheaders.*
            // ...
            fun Application.module() {
                install(ConditionalHeaders)
                // ...
            }`})]),_:1})]),_:1}),i[19]||(i[19]=p("",6))])}const H=c(m,[["render",y]]);export{S as __pageData,H as default};
