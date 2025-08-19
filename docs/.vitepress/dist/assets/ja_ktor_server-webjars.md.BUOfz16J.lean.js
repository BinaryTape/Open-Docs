import{_ as m,C as n,c as v,o as E,G as t,ag as d,j as e,w as a,a as i}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-webjars.md","filePath":"ja/ktor/server-webjars.md","lastUpdated":1755457140000}'),y={name:"ja/ktor/server-webjars.md"};function f(j,s,c,_,F,w){const k=n("TopicTitle"),u=n("primary-label"),p=n("Links"),h=n("tldr"),g=n("link-summary"),r=n("code-block"),l=n("TabItem"),o=n("Tabs"),b=n("list");return E(),v("div",null,[t(k,{labelRef:"server-plugin",title:"Webjars"}),t(u,{ref:"server-plugin"},null,512),t(h,null,{default:a(()=>[s[3]||(s[3]=e("p",null,[e("b",null,"必須依存関係"),i(": "),e("code",null,"io.ktor:ktor-server-webjars")],-1)),s[4]||(s[4]=e("p",null,[e("b",null,"コード例"),i(": "),e("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/webjars"}," webjars ")],-1)),e("p",null,[e("b",null,[t(p,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:a(()=>s[0]||(s[0]=[i("ネイティブサーバー")])),_:1}),s[1]||(s[1]=i("のサポート"))]),s[2]||(s[2]=i(": ✖️ "))])]),_:1}),t(g,null,{default:a(()=>s[5]||(s[5]=[i(" Webjarsプラグインは、WebJarsによって提供されるクライアントサイドライブラリの提供を可能にします。 ")])),_:1}),s[21]||(s[21]=d("",3)),e("ul",null,[e("li",null,[s[6]||(s[6]=e("p",null,[e("code",null,"ktor-server-webjars"),i("依存関係を追加します:")],-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("io.ktor:ktor-server-webjars:$ktor_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "io.ktor:ktor-server-webjars:$ktor_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>io.ktor</groupId>
                  <artifactId>ktor-server-webjars-jvm</artifactId>
                  <version>\${ktor_version}</version>
              </dependency>`})]),_:1})]),_:1})]),e("li",null,[s[7]||(s[7]=e("p",null,"必要なクライアントサイドライブラリの依存関係を追加します。以下の例は、Bootstrapアーティファクトを追加する方法を示しています:",-1)),t(o,{group:"languages"},{default:a(()=>[t(l,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[t(r,{lang:"Kotlin",code:'              implementation("org.webjars:bootstrap:$bootstrap_version")'})]),_:1}),t(l,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[t(r,{lang:"Groovy",code:'              implementation "org.webjars:bootstrap:$bootstrap_version"'})]),_:1}),t(l,{title:"Maven","group-key":"maven"},{default:a(()=>[t(r,{lang:"XML",code:`              <dependency>
                  <groupId>org.webjars</groupId>
                  <artifactId>bootstrap</artifactId>
                  <version>\${bootstrap_version}</version>
              </dependency>`})]),_:1})]),_:1}),s[8]||(s[8]=e("p",null,[e("code",null,"$bootstrap_version"),i("を、例えば"),e("code",null,"5.2.3"),i("のような"),e("code",null,"bootstrap"),i("アーティファクトの必要なバージョンに置き換えることができます。")],-1))])]),s[22]||(s[22]=e("h2",{id:"install_plugin",tabindex:"-1"},[i("Webjarsをインストールする "),e("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "Webjarsをインストールする {id="install_plugin"}"'},"​")],-1)),e("p",null,[s[10]||(s[10]=i(" アプリケーションに")),s[11]||(s[11]=e("code",null,"Webjars",-1)),s[12]||(s[12]=i("プラグインを")),s[13]||(s[13]=e("a",{href:"#install"},"インストール",-1)),s[14]||(s[14]=i("するには、 指定された")),t(p,{href:"/ktor/server-modules",summary:"モジュールは、ルートをグループ化することでアプリケーションを構造化できます。"},{default:a(()=>s[9]||(s[9]=[i("モジュール")])),_:1}),s[15]||(s[15]=i("内の")),s[16]||(s[16]=e("code",null,"install",-1)),s[17]||(s[17]=i("関数に渡します。 以下のコードスニペットは、")),s[18]||(s[18]=e("code",null,"Webjars",-1)),s[19]||(s[19]=i("をインストールする方法を示しています... "))]),t(b,null,{default:a(()=>s[20]||(s[20]=[e("li",null,[i(" ... "),e("code",null,"embeddedServer"),i("関数呼び出し内で。 ")],-1),e("li",null,[i(" ... "),e("code",null,"Application"),i("クラスの拡張関数である、明示的に定義された"),e("code",null,"module"),i("内で。 ")],-1)])),_:1}),t(o,null,{default:a(()=>[t(l,{title:"embeddedServer"},{default:a(()=>[t(r,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.webjars.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Webjars)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),t(l,{title:"module"},{default:a(()=>[t(r,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.webjars.*
            // ...
            fun Application.module() {
                install(Webjars)
                // ...
            }`})]),_:1})]),_:1}),s[23]||(s[23]=d("",7))])}const W=m(y,[["render",f]]);export{T as __pageData,W as default};
