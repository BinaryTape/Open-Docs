import{_ as c,C as n,c as m,o as y,G as a,ag as k,j as i,w as e,a as t}from"./chunks/framework.Bksy39di.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-mustache.md","filePath":"ktor/server-mustache.md","lastUpdated":1755457140000}'),v={name:"ktor/server-mustache.md"};function F(b,s,f,_,C,A){const o=n("TopicTitle"),d=n("show-structure"),u=n("primary-label"),r=n("Links"),E=n("tldr"),l=n("code-block"),p=n("TabItem"),h=n("Tabs"),g=n("list");return y(),m("div",null,[a(o,{labelRef:"server-plugin",title:"Mustache"}),a(d,{for:"chapter",depth:"2"}),a(u,{ref:"server-plugin"},null,512),a(E,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"所需依赖项"),t(": "),i("code",null,"io.ktor:ktor-server-mustache")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"代码示例"),t(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/mustache"}," mustache ")],-1)),i("p",null,[i("b",null,[a(r,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并允许您在无需额外运行时或虚拟机的情况下运行服务器。"},{default:e(()=>s[0]||(s[0]=[t("原生服务器")])),_:1}),s[1]||(s[1]=t(" 支持"))]),s[2]||(s[2]=t(": ✖️ "))])]),_:1}),s[17]||(s[17]=k("",3)),a(h,{group:"languages"},{default:e(()=>[a(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-mustache:$ktor_version")'})]),_:1}),a(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-mustache:$ktor_version"'})]),_:1}),a(p,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-mustache-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[t("安装 Mustache "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 Mustache {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=t(" 要")),s[7]||(s[7]=i("a",{href:"#install"},"安装",-1)),s[8]||(s[8]=t()),s[9]||(s[9]=i("code",null,"Mustache",-1)),s[10]||(s[10]=t(" 插件到应用程序， 请将其传递给指定")),a(r,{href:"/ktor/server-modules",summary:"模块允许您通过对路由进行分组来构建应用程序。"},{default:e(()=>s[5]||(s[5]=[t("模块")])),_:1}),s[11]||(s[11]=t("中的 ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=t(" 函数。 以下代码片段展示了如何安装 ")),s[14]||(s[14]=i("code",null,"Mustache",-1)),s[15]||(s[15]=t(" ... "))]),a(g,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[t(" ... 在 "),i("code",null,"embeddedServer"),t(" 函数调用内部。 ")],-1),i("li",null,[t(" ... 在显式定义的 "),i("code",null,"module"),t(" 内部，它是 "),i("code",null,"Application"),t(" 类的扩展函数。 ")],-1)])),_:1}),a(h,null,{default:e(()=>[a(p,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.mustache.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Mustache)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(p,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.mustache.*
            // ...
            fun Application.module() {
                install(Mustache)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",12))])}const B=c(v,[["render",F]]);export{q as __pageData,B as default};
