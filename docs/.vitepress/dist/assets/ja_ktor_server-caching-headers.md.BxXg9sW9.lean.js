import{_ as u,C as t,c as y,o as C,G as a,ag as o,j as i,w as e,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-caching-headers.md","filePath":"ja/ktor/server-caching-headers.md","lastUpdated":1755457140000}'),F={name:"ja/ktor/server-caching-headers.md"};function m(v,s,f,b,A,_){const k=t("TopicTitle"),d=t("show-structure"),g=t("primary-label"),h=t("Links"),c=t("tldr"),l=t("code-block"),r=t("TabItem"),p=t("Tabs"),E=t("list");return C(),y("div",null,[a(k,{labelRef:"server-plugin",title:"キャッシュヘッダー"}),a(d,{for:"chapter",depth:"2"}),a(g,{ref:"server-plugin"},null,512),a(c,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必須の依存関係"),n(": "),i("code",null,"io.ktor:ktor-server-caching-headers")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"コード例"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/caching-headers"}," caching-headers ")],-1)),i("p",null,[i("b",null,[a(h,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:e(()=>s[0]||(s[0]=[n("ネイティブサーバー")])),_:1}),s[1]||(s[1]=n("のサポート"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),s[17]||(s[17]=o("",4)),a(p,{group:"languages"},{default:e(()=>[a(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-caching-headers:$ktor_version")'})]),_:1}),a(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-caching-headers:$ktor_version"'})]),_:1}),a(r,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-caching-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("CachingHeaders のインストール "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "CachingHeaders のインストール {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=n(" アプリケーションに ")),s[7]||(s[7]=i("code",null,"CachingHeaders",-1)),s[8]||(s[8]=n(" プラグインを")),s[9]||(s[9]=i("a",{href:"#install"},"インストール",-1)),s[10]||(s[10]=n("するには、指定された")),a(h,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:e(()=>s[5]||(s[5]=[n("モジュール")])),_:1}),s[11]||(s[11]=n("内の ")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=n(" 関数に渡します。 以下のコードスニペットは、")),s[14]||(s[14]=i("code",null,"CachingHeaders",-1)),s[15]||(s[15]=n(" をインストールする方法を示しています... "))]),a(E,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[n(" ... "),i("code",null,"embeddedServer"),n(" 関数呼び出し内。 ")],-1),i("li",null,[n(" ... "),i("code",null,"Application"),n(" クラスの拡張関数である、明示的に定義された "),i("code",null,"module"),n(" 内。 ")],-1)])),_:1}),a(p,null,{default:e(()=>[a(r,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.cachingheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(CachingHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(r,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.cachingheaders.*
            // ...
            fun Application.module() {
                install(CachingHeaders)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=o("",14))])}const T=u(F,[["render",m]]);export{B as __pageData,T as default};
