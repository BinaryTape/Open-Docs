import{_ as c,C as l,c as u,o as m,G as i,ag as r,j as a,w as t,a as n}from"./chunks/framework.Bksy39di.js";const L=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-rate-limit.md","filePath":"ktor/server-rate-limit.md","lastUpdated":1755457140000}'),C={name:"ktor/server-rate-limit.md"};function B(q,s,v,b,f,A){const E=l("TopicTitle"),d=l("show-structure"),o=l("primary-label"),k=l("Links"),g=l("tldr"),y=l("link-summary"),e=l("code-block"),p=l("TabItem"),h=l("Tabs"),F=l("list");return m(),u("div",null,[i(E,{labelRef:"server-plugin",title:"限流"}),i(d,{for:"chapter",depth:"2"}),i(o,{ref:"server-plugin"},null,512),i(g,null,{default:t(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"所需依赖项"),n(": "),a("code",null,"io.ktor:ktor-server-rate-limit")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"代码示例"),n(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/rate-limit"}," rate-limit ")],-1)),a("p",null,[a("b",null,[i(k,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。"},{default:t(()=>s[0]||(s[0]=[n("原生服务器")])),_:1}),s[1]||(s[1]=n("支持"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),i(y,null,{default:t(()=>s[5]||(s[5]=[n(" RateLimit 提供了验证传入请求体的功能。 ")])),_:1}),s[18]||(s[18]=r("",4)),i(h,{group:"languages"},{default:t(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[i(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-rate-limit:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[i(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-rate-limit:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:t(()=>[i(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-rate-limit-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[n("安装 RateLimit "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 RateLimit {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=n(" 要")),s[8]||(s[8]=a("a",{href:"#install"},"安装",-1)),s[9]||(s[9]=n()),s[10]||(s[10]=a("code",null,"RateLimit",-1)),s[11]||(s[11]=n(" 插件到应用程序， 请在指定的")),i(k,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:t(()=>s[6]||(s[6]=[n("模块")])),_:1}),s[12]||(s[12]=n("中将其传递给 ")),s[13]||(s[13]=a("code",null,"install",-1)),s[14]||(s[14]=n(" 函数。 下面的代码片段展示了如何安装 ")),s[15]||(s[15]=a("code",null,"RateLimit",-1)),s[16]||(s[16]=n(" ... "))]),i(F,null,{default:t(()=>s[17]||(s[17]=[a("li",null,[n(" ... 在 "),a("code",null,"embeddedServer"),n(" 函数调用内部。 ")],-1),a("li",null,[n(" ... 在显式定义的 "),a("code",null,"module"),n(" 内部，它是一个 "),a("code",null,"Application"),n(" 类的扩展函数。 ")],-1)])),_:1}),i(h,null,{default:t(()=>[i(p,{title:"embeddedServer"},{default:t(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RateLimit)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:t(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.ratelimit.*
            // ...
            fun Application.module() {
                install(RateLimit)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=r("",20))])}const R=c(C,[["render",B]]);export{L as __pageData,R as default};
