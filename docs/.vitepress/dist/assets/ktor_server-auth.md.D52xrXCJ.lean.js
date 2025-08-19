import{_ as y,C as n,c as v,o as F,G as i,ag as p,j as a,w as e,a as t}from"./chunks/framework.Bksy39di.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/server-auth.md","filePath":"ktor/server-auth.md","lastUpdated":1755457140000}'),b={name:"ktor/server-auth.md"};function m(f,s,q,A,C,B){const o=n("TopicTitle"),k=n("show-structure"),d=n("primary-label"),c=n("tldr"),E=n("link-summary"),l=n("code-block"),r=n("TabItem"),h=n("Tabs"),u=n("Links"),g=n("list");return F(),v("div",null,[i(o,{labelRef:"server-plugin",title:"Ktor 服务器中的认证与授权"}),i(k,{for:"chapter",depth:"2"}),i(d,{ref:"server-plugin"},null,512),i(c,null,{default:e(()=>s[0]||(s[0]=[a("p",null,[a("b",null,"必需的依赖项"),t(": "),a("code",null,"io.ktor:ktor-server-auth")],-1)])),_:1}),i(E,null,{default:e(()=>s[1]||(s[1]=[t(" Ktor 中的 Authentication 插件负责处理认证和授权。 ")])),_:1}),s[14]||(s[14]=p("",21)),i(h,{group:"languages"},{default:e(()=>[i(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-auth:$ktor_version")'})]),_:1}),i(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-auth:$ktor_version"'})]),_:1}),i(r,{title:"Maven","group-key":"maven"},{default:e(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-auth-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[15]||(s[15]=a("p",null,[t("请注意，一些认证提供者，例如 "),a("a",{href:"./server-jwt"},"JWT"),t(" 和 "),a("a",{href:"./server-ldap"},"LDAP"),t("，需要额外的 artifacts。")],-1)),s[16]||(s[16]=a("h2",{id:"install",tabindex:"-1"},[t("安装 Authentication "),a("a",{class:"header-anchor",href:"#install","aria-label":'Permalink to "安装 Authentication {id="install"}"'},"​")],-1)),a("p",null,[s[3]||(s[3]=t(" 要 ")),s[4]||(s[4]=a("a",{href:"#install"},"安装",-1)),s[5]||(s[5]=t()),s[6]||(s[6]=a("code",null,"Authentication",-1)),s[7]||(s[7]=t(" 插件到应用程序中， 请将其传递给指定 ")),i(u,{href:"/ktor/server-modules",summary:"模块允许您通过分组路由来组织应用程序。"},{default:e(()=>s[2]||(s[2]=[t("模块")])),_:1}),s[8]||(s[8]=t(" 中的 ")),s[9]||(s[9]=a("code",null,"install",-1)),s[10]||(s[10]=t(" 函数。 下面的代码片段展示了如何安装 ")),s[11]||(s[11]=a("code",null,"Authentication",-1)),s[12]||(s[12]=t(" ... "))]),i(g,null,{default:e(()=>s[13]||(s[13]=[a("li",null,[t(" ... 在 "),a("code",null,"embeddedServer"),t(" 函数调用内部。 ")],-1),a("li",null,[t(" ... 在显式定义的 "),a("code",null,"module"),t(" 内部，它是 "),a("code",null,"Application"),t(" 类的一个扩展函数。 ")],-1)])),_:1}),i(h,null,{default:e(()=>[i(r,{title:"embeddedServer"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.auth.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Authentication)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(r,{title:"module"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.auth.*
            // ...
            fun Application.module() {
                install(Authentication)
                // ...
            }`})]),_:1})]),_:1}),s[17]||(s[17]=p("",30))])}const T=y(b,[["render",m]]);export{_ as __pageData,T as default};
