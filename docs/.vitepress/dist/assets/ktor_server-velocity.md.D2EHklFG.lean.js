import{_ as c,C as n,c as u,o as F,G as i,ag as o,j as a,w as l,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-velocity.md","filePath":"ktor/server-velocity.md","lastUpdated":1755457140000}'),v={name:"ktor/server-velocity.md"};function m(C,s,b,f,_,q){const r=n("TopicTitle"),d=n("show-structure"),E=n("primary-label"),k=n("Links"),g=n("tldr"),e=n("code-block"),p=n("TabItem"),h=n("Tabs"),y=n("list");return F(),u("div",null,[i(r,{labelRef:"server-plugin",title:"Velocity"}),i(d,{for:"chapter",depth:"2"}),i(E,{ref:"server-plugin"},null,512),i(g,null,{default:l(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"所需依赖项"),t(": "),a("code",null,"io.ktor:ktor-server-velocity")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"代码示例"),t(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/velocity"}," velocity ")],-1)),a("p",null,[a("b",null,[i(k,{href:"/ktor/server-native",summary:"Ktor 支持 Kotlin/Native，并允许您无需额外运行时或虚拟机即可运行服务器。"},{default:l(()=>s[0]||(s[0]=[t("原生服务器")])),_:1}),s[1]||(s[1]=t(" 支持"))]),s[2]||(s[2]=t(": ✖️ "))])]),_:1}),s[17]||(s[17]=o("",3)),i(h,{group:"languages"},{default:l(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:l(()=>[i(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-velocity:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:l(()=>[i(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-velocity:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:l(()=>[i(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-velocity-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=a("h2",{id:"install_plugin",tabindex:"-1"},[t("安装 Velocity "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "安装 Velocity {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[6]||(s[6]=t(" 要将 ")),s[7]||(s[7]=a("code",null,"Velocity",-1)),s[8]||(s[8]=t(" 插件")),s[9]||(s[9]=a("a",{href:"#install"},"安装",-1)),s[10]||(s[10]=t("到应用程序中， 请将其传递给指定 ")),i(k,{href:"/ktor/server-modules",summary:"模块允许您通过对路由进行分组来组织您的应用程序。"},{default:l(()=>s[5]||(s[5]=[t("模块")])),_:1}),s[11]||(s[11]=t(" 中的 ")),s[12]||(s[12]=a("code",null,"install",-1)),s[13]||(s[13]=t(" 函数。 以下代码片段展示了如何安装 ")),s[14]||(s[14]=a("code",null,"Velocity",-1)),s[15]||(s[15]=t(" ... "))]),i(y,null,{default:l(()=>s[16]||(s[16]=[a("li",null,[t(" ... 在 "),a("code",null,"embeddedServer"),t(" 函数调用内部。 ")],-1),a("li",null,[t(" ... 在显式定义的模块（它是 "),a("code",null,"Application"),t(" 类的扩展函数）内部。 ")],-1)])),_:1}),i(h,null,{default:l(()=>[i(p,{title:"embeddedServer"},{default:l(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.velocity.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Velocity)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:l(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.velocity.*
            // ...
            fun Application.module() {
                install(Velocity)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=o("",15))])}const V=c(v,[["render",m]]);export{A as __pageData,V as default};
