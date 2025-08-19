import{_ as y,C as n,c as v,o as F,G as i,ag as p,j as a,w as e,a as t}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/server-auth.md","filePath":"zh-Hant/ktor/server-auth.md","lastUpdated":1755457140000}'),b={name:"zh-Hant/ktor/server-auth.md"};function m(f,s,q,A,C,B){const o=n("TopicTitle"),k=n("show-structure"),d=n("primary-label"),c=n("tldr"),u=n("link-summary"),l=n("code-block"),r=n("TabItem"),h=n("Tabs"),E=n("Links"),g=n("list");return F(),v("div",null,[i(o,{labelRef:"server-plugin",title:"Ktor 伺服器中的認證與授權"}),i(k,{for:"chapter",depth:"2"}),i(d,{ref:"server-plugin"},null,512),i(c,null,{default:e(()=>s[0]||(s[0]=[a("p",null,[a("b",null,"所需相依性"),t("："),a("code",null,"io.ktor:ktor-server-auth")],-1)])),_:1}),i(u,null,{default:e(()=>s[1]||(s[1]=[t(" Authentication 外掛程式處理 Ktor 中的認證與授權。 ")])),_:1}),s[14]||(s[14]=p("",21)),i(h,{group:"languages"},{default:e(()=>[i(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-auth:$ktor_version")'})]),_:1}),i(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-auth:$ktor_version"'})]),_:1}),i(r,{title:"Maven","group-key":"maven"},{default:e(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-auth-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[15]||(s[15]=a("p",null,[t("請注意，某些認證供應器，例如 "),a("a",{href:"./server-jwt"},"JWT"),t(" 和 "),a("a",{href:"./server-ldap"},"LDAP"),t("，需要額外的 artifact。")],-1)),s[16]||(s[16]=a("h2",{id:"install",tabindex:"-1"},[t("安裝 Authentication "),a("a",{class:"header-anchor",href:"#install","aria-label":'Permalink to "安裝 Authentication {id="install"}"'},"​")],-1)),a("p",null,[s[3]||(s[3]=t(" 若要將 ")),s[4]||(s[4]=a("code",null,"Authentication",-1)),s[5]||(s[5]=t(" 外掛程式")),s[6]||(s[6]=a("a",{href:"#install"},"安裝",-1)),s[7]||(s[7]=t("到應用程式， 請在指定的")),i(E,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:e(()=>s[2]||(s[2]=[t("模組")])),_:1}),s[8]||(s[8]=t("中將其傳遞給 ")),s[9]||(s[9]=a("code",null,"install",-1)),s[10]||(s[10]=t(" 函數。 以下程式碼片段展示了如何安裝 ")),s[11]||(s[11]=a("code",null,"Authentication",-1)),s[12]||(s[12]=t(" ... "))]),i(g,null,{default:e(()=>s[13]||(s[13]=[a("li",null,[t(" ... 在 "),a("code",null,"embeddedServer"),t(" 函數呼叫內部。 ")],-1),a("li",null,[t(" ... 在明確定義的 "),a("code",null,"module"),t(" 內部，該 "),a("code",null,"module"),t(" 是 "),a("code",null,"Application"),t(" 類別的擴展函數。 ")],-1)])),_:1}),i(h,null,{default:e(()=>[i(r,{title:"embeddedServer"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
            }`})]),_:1})]),_:1}),s[17]||(s[17]=p("",30))])}const T=y(b,[["render",m]]);export{D as __pageData,T as default};
