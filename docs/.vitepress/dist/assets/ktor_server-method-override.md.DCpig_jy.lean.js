import{_ as F,C as e,c as u,o as m,G as a,ag as r,j as i,w as n,a as t}from"./chunks/framework.Bksy39di.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-method-override.md","filePath":"ktor/server-method-override.md","lastUpdated":1755457140000}'),c={name:"ktor/server-method-override.md"};function v(C,s,B,f,T,A){const d=e("TopicTitle"),o=e("primary-label"),k=e("Links"),E=e("tldr"),g=e("link-summary"),l=e("code-block"),p=e("TabItem"),h=e("Tabs"),y=e("list");return m(),u("div",null,[a(d,{labelRef:"server-plugin",title:"XHttpMethodOverride"}),a(o,{ref:"server-plugin"},null,512),a(E,null,{default:n(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依赖项"),t(": "),i("code",null,"io.ktor:ktor-server-method-override")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/json-kotlinx-method-override"}," json-kotlinx-method-override ")],-1)),i("p",null,[i("b",null,[a(k,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。"},{default:n(()=>s[0]||(s[0]=[t("原生服务器")])),_:1}),s[1]||(s[1]=t(" 支持"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),a(g,null,{default:n(()=>s[5]||(s[5]=[t(" XHttpMethodOverride 使得能够将 HTTP 动词通过 X-HTTP-Method-Override header 进行隧道化。 ")])),_:1}),s[18]||(s[18]=r("",3)),a(h,{group:"languages"},{default:n(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-method-override:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-method-override:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:n(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-method-override-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安装 XHttpMethodOverride "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 XHttpMethodOverride {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=t(" 要将 ")),s[8]||(s[8]=i("code",null,"XHttpMethodOverride",-1)),s[9]||(s[9]=t(" 插件")),s[10]||(s[10]=i("a",{href:"#install"},"安装",-1)),s[11]||(s[11]=t("到应用程序中，请将其传递给指定")),a(k,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:n(()=>s[6]||(s[6]=[t("模块")])),_:1}),s[12]||(s[12]=t("中的 ")),s[13]||(s[13]=i("code",null,"install",-1)),s[14]||(s[14]=t(" 函数。下面的代码片段展示了如何安装 ")),s[15]||(s[15]=i("code",null,"XHttpMethodOverride",-1)),s[16]||(s[16]=t(" ... "))]),a(y,null,{default:n(()=>s[17]||(s[17]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函数调用内部。 ")],-1),i("li",null,[t(" ... 在显式定义的 "),i("code",null,"module"),t(" 内部，这是一个 "),i("code",null,"Application"),t(" 类的扩展函数。 ")],-1)])),_:1}),a(h,null,{default:n(()=>[a(p,{title:"embeddedServer"},{default:n(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
