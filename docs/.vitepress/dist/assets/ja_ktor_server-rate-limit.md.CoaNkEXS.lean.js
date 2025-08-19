import{_ as c,C as l,c as u,o as m,G as i,ag as r,j as a,w as t,a as n}from"./chunks/framework.Bksy39di.js";const L=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-rate-limit.md","filePath":"ja/ktor/server-rate-limit.md","lastUpdated":1755457140000}'),C={name:"ja/ktor/server-rate-limit.md"};function B(q,s,v,b,A,f){const E=l("TopicTitle"),d=l("show-structure"),o=l("primary-label"),k=l("Links"),g=l("tldr"),y=l("link-summary"),e=l("code-block"),p=l("TabItem"),h=l("Tabs"),F=l("list");return m(),u("div",null,[i(E,{labelRef:"server-plugin",title:"レート制限"}),i(d,{for:"chapter",depth:"2"}),i(o,{ref:"server-plugin"},null,512),i(g,null,{default:t(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"必須の依存関係"),n(": "),a("code",null,"io.ktor:ktor-server-rate-limit")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"コード例"),n(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/rate-limit"}," rate-limit ")],-1)),a("p",null,[a("b",null,[i(k,{href:"/ktor/server-native",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:t(()=>s[0]||(s[0]=[n("ネイティブサーバー")])),_:1}),s[1]||(s[1]=n("のサポート"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),i(y,null,{default:t(()=>s[5]||(s[5]=[n(" RateLimitは、受信リクエストのボディを検証する機能を提供します。 ")])),_:1}),s[17]||(s[17]=r("",4)),i(h,{group:"languages"},{default:t(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[i(e,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-rate-limit:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[i(e,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-rate-limit:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:t(()=>[i(e,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-rate-limit-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=a("h2",{id:"install_plugin",tabindex:"-1"},[n("RateLimitのインストール "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "RateLimitのインストール {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=a("code",null,"RateLimit",-1)),s[8]||(s[8]=n("プラグインをアプリケーションに")),s[9]||(s[9]=a("a",{href:"#install"},"インストール",-1)),s[10]||(s[10]=n("するには、指定された")),i(k,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:t(()=>s[6]||(s[6]=[n("モジュール")])),_:1}),s[11]||(s[11]=n("内の")),s[12]||(s[12]=a("code",null,"install",-1)),s[13]||(s[13]=n("関数に渡します。 以下のコードスニペットは、")),s[14]||(s[14]=a("code",null,"RateLimit",-1)),s[15]||(s[15]=n("のインストール方法を示しています... "))]),i(F,null,{default:t(()=>s[16]||(s[16]=[a("li",null,[n(" ... "),a("code",null,"embeddedServer"),n("関数呼び出し内。 ")],-1),a("li",null,[n(" ... "),a("code",null,"Application"),n("クラスの拡張関数である、明示的に定義された"),a("code",null,"module"),n("内。 ")],-1)])),_:1}),i(h,null,{default:t(()=>[i(p,{title:"embeddedServer"},{default:t(()=>[i(e,{lang:"kotlin",code:`            import io.ktor.server.engine.*
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
            }`})]),_:1})]),_:1}),s[19]||(s[19]=r("",20))])}const R=c(C,[["render",B]]);export{L as __pageData,R as default};
