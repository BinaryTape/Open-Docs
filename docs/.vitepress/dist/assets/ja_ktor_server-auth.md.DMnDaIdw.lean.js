import{_ as y,C as n,c as v,o as F,G as i,ag as p,j as a,w as e,a as t}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-auth.md","filePath":"ja/ktor/server-auth.md","lastUpdated":1755457140000}'),b={name:"ja/ktor/server-auth.md"};function m(f,s,q,A,C,B){const o=n("TopicTitle"),k=n("show-structure"),d=n("primary-label"),c=n("tldr"),u=n("link-summary"),l=n("code-block"),r=n("TabItem"),h=n("Tabs"),E=n("Links"),g=n("list");return F(),v("div",null,[i(o,{labelRef:"server-plugin",title:"Ktor Serverにおける認証と認可"}),i(k,{for:"chapter",depth:"2"}),i(d,{ref:"server-plugin"},null,512),i(c,null,{default:e(()=>s[0]||(s[0]=[a("p",null,[a("b",null,"必要な依存関係"),t(": "),a("code",null,"io.ktor:ktor-server-auth")],-1)])),_:1}),i(u,null,{default:e(()=>s[1]||(s[1]=[t(" AuthenticationプラグインはKtorにおける認証と認可を扱います。 ")])),_:1}),s[14]||(s[14]=p("",21)),i(h,{group:"languages"},{default:e(()=>[i(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-auth:$ktor_version")'})]),_:1}),i(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-auth:$ktor_version"'})]),_:1}),i(r,{title:"Maven","group-key":"maven"},{default:e(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-auth-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[15]||(s[15]=a("p",null,[a("a",{href:"./server-jwt"},"JWT"),t("や"),a("a",{href:"./server-ldap"},"LDAP"),t("など、一部の認証プロバイダーは追加のアーティファクトを必要とすることに注意してください。")],-1)),s[16]||(s[16]=a("h2",{id:"install",tabindex:"-1"},[t("Authenticationのインストール "),a("a",{class:"header-anchor",href:"#install","aria-label":'Permalink to "Authenticationのインストール {id="install"}"'},"​")],-1)),a("p",null,[s[3]||(s[3]=t(" アプリケーションに")),s[4]||(s[4]=a("code",null,"Authentication",-1)),s[5]||(s[5]=t("プラグインを")),s[6]||(s[6]=a("a",{href:"#install"},"インストール",-1)),s[7]||(s[7]=t("するには、指定された")),i(E,{href:"/ktor/server-modules",summary:"モジュールはルートをグループ化することでアプリケーションを構造化できます。"},{default:e(()=>s[2]||(s[2]=[t("モジュール")])),_:1}),s[8]||(s[8]=t("内の")),s[9]||(s[9]=a("code",null,"install",-1)),s[10]||(s[10]=t("関数に渡します。以下のコードスニペットは、")),s[11]||(s[11]=a("code",null,"Authentication",-1)),s[12]||(s[12]=t("をインストールする方法を示しています... "))]),i(g,null,{default:e(()=>s[13]||(s[13]=[a("li",null,[t(" ... "),a("code",null,"embeddedServer"),t("関数呼び出し内で。 ")],-1),a("li",null,[t(" ... "),a("code",null,"Application"),t("クラスの拡張関数である明示的に定義された"),a("code",null,"module"),t("内で。 ")],-1)])),_:1}),i(h,null,{default:e(()=>[i(r,{title:"embeddedServer"},{default:e(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
            }`})]),_:1})]),_:1}),s[17]||(s[17]=p("",30))])}const P=y(b,[["render",m]]);export{D as __pageData,P as default};
