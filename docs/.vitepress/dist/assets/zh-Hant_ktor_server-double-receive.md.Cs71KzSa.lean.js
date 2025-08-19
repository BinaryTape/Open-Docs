import{_ as v,C as l,c as g,o as E,G as i,ag as d,j as s,w as t,a}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-double-receive.md","filePath":"zh-Hant/ktor/server-double-receive.md","lastUpdated":1755457140000}'),b={name:"zh-Hant/ktor/server-double-receive.md"};function y(m,e,_,f,F,C){const k=l("TopicTitle"),h=l("primary-label"),r=l("Links"),c=l("tldr"),n=l("code-block"),o=l("TabItem"),p=l("Tabs"),u=l("list");return E(),g("div",null,[i(k,{labelRef:"server-plugin",title:"DoubleReceive"}),i(h,{ref:"server-plugin"},null,512),i(c,null,{default:t(()=>[e[3]||(e[3]=s("p",null,[s("b",null,"所需依賴項"),a("："),s("code",null,"io.ktor:ktor-server-double-receive")],-1)),e[4]||(e[4]=s("p",null,[s("b",null,"程式碼範例"),a("： "),s("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/double-receive"}," double-receive ")],-1)),s("p",null,[s("b",null,[i(r,{href:"/ktor/server-native",summary:"Ktor 支援 Kotlin/Native，並允許您在沒有額外執行環境或虛擬機器下執行伺服器。"},{default:t(()=>e[0]||(e[0]=[a("原生伺服器")])),_:1}),e[1]||(e[1]=a("支援"))]),e[2]||(e[2]=a("：✅ "))])]),_:1}),e[9]||(e[9]=d("",4)),i(p,{group:"languages"},{default:t(()=>[i(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[i(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-double-receive:$ktor_version")'})]),_:1}),i(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[i(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-double-receive:$ktor_version"'})]),_:1}),i(o,{title:"Maven","group-key":"maven"},{default:t(()=>[i(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-double-receive-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[10]||(e[10]=s("h2",{id:"install_plugin",tabindex:"-1"},[a("安裝 DoubleReceive "),s("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 DoubleReceive {id="install_plugin"}"'},"​")],-1)),s("p",null,[e[6]||(e[6]=a(" 若要將 `DoubleReceive` 外掛[安裝](#install)到應用程式， 請將其傳遞給指定[模組](")),i(r,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>e[5]||(e[5]=[a("模組")])),_:1}),e[7]||(e[7]=a(")中的 `install` 函式。 下方的程式碼片段展示了如何安裝 `DoubleReceive` ... "))]),i(u,null,{default:t(()=>e[8]||(e[8]=[s("li",null," ... 在 `embeddedServer` 函式呼叫內。 ",-1),s("li",null," ... 在明確定義的 `module` 內，該 `module` 是 `Application` 類別的一個擴充函式。 ",-1)])),_:1}),i(p,null,{default:t(()=>[i(o,{title:"embeddedServer"},{default:t(()=>[i(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DoubleReceive)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(o,{title:"module"},{default:t(()=>[i(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*
            // ...
            fun Application.module() {
                install(DoubleReceive)
                // ...
            }`})]),_:1})]),_:1}),e[11]||(e[11]=d("",13))])}const D=v(b,[["render",y]]);export{T as __pageData,D as default};
