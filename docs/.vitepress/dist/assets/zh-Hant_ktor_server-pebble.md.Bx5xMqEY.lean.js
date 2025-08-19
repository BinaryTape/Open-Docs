import{_ as u,C as l,c as y,o as m,G as e,ag as h,j as i,w as t,a}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-pebble.md","filePath":"zh-Hant/ktor/server-pebble.md","lastUpdated":1755457140000}'),c={name:"zh-Hant/ktor/server-pebble.md"};function v(F,s,f,C,_,B){const o=l("TopicTitle"),d=l("show-structure"),E=l("primary-label"),r=l("Links"),g=l("tldr"),n=l("code-block"),p=l("TabItem"),k=l("Tabs"),b=l("list");return m(),y("div",null,[e(o,{labelRef:"server-plugin",title:"Pebble"}),e(d,{for:"chapter",depth:"2"}),e(E,{ref:"server-plugin"},null,512),e(g,null,{default:t(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必需的依賴項"),a(": "),i("code",null,"io.ktor:ktor-server-pebble")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"程式碼範例"),a(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/pebble"}," pebble ")],-1)),i("p",null,[i("b",null,[e(r,{href:"/ktor/server-native",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>s[0]||(s[0]=[a("原生伺服器")])),_:1}),s[1]||(s[1]=a(" 支援"))]),s[2]||(s[2]=a(": ✖️ "))])]),_:1}),s[17]||(s[17]=h("",3)),e(k,{group:"languages"},{default:t(()=>[e(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[e(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-pebble:$ktor_version")'})]),_:1}),e(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[e(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-pebble:$ktor_version"'})]),_:1}),e(p,{title:"Maven","group-key":"maven"},{default:t(()=>[e(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-pebble-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[a("安裝 Pebble "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安裝 Pebble {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=a(" 若要將 ")),s[7]||(s[7]=i("code",null,"Pebble",-1)),s[8]||(s[8]=a(" 插件")),s[9]||(s[9]=i("a",{href:"#install"},"安裝",-1)),s[10]||(s[10]=a("至應用程式， 請在指定的 ")),e(r,{href:"/ktor/server-modules",summary:"模組允許您透過分組路由來組織應用程式。"},{default:t(()=>s[5]||(s[5]=[a("模組")])),_:1}),s[11]||(s[11]=a(" 中將其傳遞給 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=a(" 函數。 以下程式碼片段展示了如何安裝 ")),s[14]||(s[14]=i("code",null,"Pebble",-1)),s[15]||(s[15]=a(" ... "))]),e(b,null,{default:t(()=>s[16]||(s[16]=[i("li",null,[a(" ...在 "),i("code",null,"embeddedServer"),a(" 函數呼叫內部。 ")],-1),i("li",null,[a(" ...在明確定義的 "),i("code",null,"module"),a(" 內部，此為 "),i("code",null,"Application"),a(" 類別的擴展函數。 ")],-1)])),_:1}),e(k,null,{default:t(()=>[e(p,{title:"embeddedServer"},{default:t(()=>[e(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.pebble.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Pebble)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(p,{title:"module"},{default:t(()=>[e(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.pebble.*
            // ...
            fun Application.module() {
                install(Pebble)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=h("",12))])}const q=u(c,[["render",v]]);export{A as __pageData,q as default};
