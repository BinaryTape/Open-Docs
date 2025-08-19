import{_ as f,C as l,c as v,o as m,G as t,ag as p,j as a,w as i,a as s}from"./chunks/framework.Bksy39di.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-default-headers.md","filePath":"ja/ktor/server-default-headers.md","lastUpdated":1755457140000}'),E={name:"ja/ktor/server-default-headers.md"};function y(b,e,_,H,C,q){const u=l("TopicTitle"),k=l("show-structure"),h=l("primary-label"),o=l("Links"),g=l("tldr"),n=l("code-block"),r=l("TabItem"),d=l("Tabs"),c=l("list");return m(),v("div",null,[t(u,{labelRef:"server-plugin",title:"デフォルトヘッダー"}),t(k,{for:"chapter",depth:"2"}),t(h,{ref:"server-plugin"},null,512),t(g,null,{default:i(()=>[e[3]||(e[3]=a("p",null,[a("b",null,"必須の依存関係"),s(": "),a("code",null,"io.ktor:ktor-server-default-headers")],-1)),a("p",null,[a("b",null,[t(o,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:i(()=>e[0]||(e[0]=[s("ネイティブサーバー")])),_:1}),e[1]||(e[1]=s("のサポート"))]),e[2]||(e[2]=s(": ✅ "))])]),_:1}),e[16]||(e[16]=p("",3)),t(d,{group:"languages"},{default:i(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:i(()=>[t(n,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-default-headers:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:i(()=>[t(n,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-default-headers:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:i(()=>[t(n,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-default-headers-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[17]||(e[17]=a("h2",{id:"install_plugin",tabindex:"-1"},[s("DefaultHeadersをインストールする "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DefaultHeadersをインストールする {id="install_plugin"}"'},"​")],-1)),a("p",null,[e[5]||(e[5]=s(" アプリケーションに")),e[6]||(e[6]=a("code",null,"DefaultHeaders",-1)),e[7]||(e[7]=s("プラグインを")),e[8]||(e[8]=a("a",{href:"#install"},"インストール",-1)),e[9]||(e[9]=s("するには、指定された")),t(o,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:i(()=>e[4]||(e[4]=[s("モジュール")])),_:1}),e[10]||(e[10]=s("内の")),e[11]||(e[11]=a("code",null,"install",-1)),e[12]||(e[12]=s("関数に渡します。 以下のコードスニペットは、")),e[13]||(e[13]=a("code",null,"DefaultHeaders",-1)),e[14]||(e[14]=s("をインストールする方法を示しています。 "))]),t(c,null,{default:i(()=>e[15]||(e[15]=[a("li",null,[s(" ... "),a("code",null,"embeddedServer"),s("関数呼び出し内で。 ")],-1),a("li",null,[s(" ... 明示的に定義された"),a("code",null,"module"),s(" (これは"),a("code",null,"Application"),s("クラスの拡張関数です) 内で。 ")],-1)])),_:1}),t(d,null,{default:i(()=>[t(r,{title:"embeddedServer"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DefaultHeaders)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:i(()=>[t(n,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.defaultheaders.*
            // ...
            fun Application.module() {
                install(DefaultHeaders)
                // ...
            }`})]),_:1})]),_:1}),e[18]||(e[18]=p("",11))])}const T=f(E,[["render",y]]);export{D as __pageData,T as default};
