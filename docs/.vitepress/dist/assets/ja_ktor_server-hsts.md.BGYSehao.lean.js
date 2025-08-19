import{_ as m,C as l,c as S,o as v,G as t,ag as d,j as e,w as n,a as i}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-hsts.md","filePath":"ja/ktor/server-hsts.md","lastUpdated":1755457140000}'),c={name:"ja/ktor/server-hsts.md"};function f(T,s,E,y,b,_){const k=l("TopicTitle"),h=l("primary-label"),o=l("Links"),u=l("tldr"),a=l("code-block"),r=l("TabItem"),p=l("Tabs"),g=l("list");return v(),S("div",null,[t(k,{labelRef:"server-plugin",title:"HSTS"}),t(h,{ref:"server-plugin"},null,512),t(u,null,{default:n(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"必要な依存関係"),i(": "),e("code",null,"io.ktor:ktor-server-hsts")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"コード例"),i(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/ssl-engine-main-hsts"}," ssl-engine-main-hsts ")],-1)),e("p",null,[e("b",null,[t(o,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:n(()=>s[0]||(s[0]=[i("ネイティブサーバー")])),_:1}),s[1]||(s[1]=i("のサポート"))]),s[2]||(s[2]=i(": ✅ "))])]),_:1}),s[17]||(s[17]=d("",4)),t(p,{group:"languages"},{default:n(()=>[t(r,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[t(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-hsts:$ktor_version")'})]),_:1}),t(r,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[t(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-hsts:$ktor_version"'})]),_:1}),t(r,{title:"Maven","group-key":"maven"},{default:n(()=>[t(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-hsts-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=e("h2",{id:"install_plugin",tabindex:"-1"},[i("HSTSのインストール "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "HSTSのインストール {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[6]||(s[6]=i(" アプリケーションに")),s[7]||(s[7]=e("code",null,"HSTS",-1)),s[8]||(s[8]=i("プラグインを")),s[9]||(s[9]=e("a",{href:"#install"},"インストール",-1)),s[10]||(s[10]=i("するには、指定された")),t(o,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:n(()=>s[5]||(s[5]=[i("モジュール")])),_:1}),s[11]||(s[11]=i("の")),s[12]||(s[12]=e("code",null,"install",-1)),s[13]||(s[13]=i("関数に渡します。以下のコードスニペットは、")),s[14]||(s[14]=e("code",null,"HSTS",-1)),s[15]||(s[15]=i("をインストールする方法を示しています... "))]),t(g,null,{default:n(()=>s[16]||(s[16]=[e("li",null,[i(" ... "),e("code",null,"embeddedServer"),i("関数呼び出し内で。 ")],-1),e("li",null,[i(" ... "),e("code",null,"Application"),i("クラスの拡張関数である、明示的に定義された"),e("code",null,"module"),i("内で。 ")],-1)])),_:1}),t(p,null,{default:n(()=>[t(r,{title:"embeddedServer"},{default:n(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(HSTS)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(r,{title:"module"},{default:n(()=>[t(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.hsts.*
            // ...
            fun Application.module() {
                install(HSTS)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=d("",7))])}const F=m(c,[["render",f]]);export{C as __pageData,F as default};
