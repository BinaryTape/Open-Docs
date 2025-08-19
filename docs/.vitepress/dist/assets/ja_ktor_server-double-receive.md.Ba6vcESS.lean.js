import{_ as v,C as n,c as g,o as E,G as s,ag as d,j as i,w as t,a as l}from"./chunks/framework.Bksy39di.js";const T=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-double-receive.md","filePath":"ja/ktor/server-double-receive.md","lastUpdated":1755457140000}'),b={name:"ja/ktor/server-double-receive.md"};function y(m,e,f,F,_,C){const k=n("TopicTitle"),u=n("primary-label"),r=n("Links"),h=n("tldr"),a=n("code-block"),o=n("TabItem"),p=n("Tabs"),c=n("list");return E(),g("div",null,[s(k,{labelRef:"server-plugin",title:"DoubleReceive"}),s(u,{ref:"server-plugin"},null,512),s(h,null,{default:t(()=>[e[3]||(e[3]=i("p",null,[i("b",null,"必要な依存関係"),l(": "),i("code",null,"io.ktor:ktor-server-double-receive")],-1)),e[4]||(e[4]=i("p",null,[i("b",null,"コード例"),l(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/double-receive"}," double-receive ")],-1)),i("p",null,[i("b",null,[s(r,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:t(()=>e[0]||(e[0]=[l("ネイティブサーバー")])),_:1}),e[1]||(e[1]=l("サポート"))]),e[2]||(e[2]=l(": ✅ "))])]),_:1}),e[17]||(e[17]=d("",4)),s(p,{group:"languages"},{default:t(()=>[s(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:t(()=>[s(a,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-double-receive:$ktor_version")'})]),_:1}),s(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:t(()=>[s(a,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-double-receive:$ktor_version"'})]),_:1}),s(o,{title:"Maven","group-key":"maven"},{default:t(()=>[s(a,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-double-receive-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),e[18]||(e[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[l("DoubleReceiveをインストールする "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DoubleReceiveをインストールする {id="install_plugin"}"'},"​")],-1)),i("p",null,[e[6]||(e[6]=l(" アプリケーションに")),e[7]||(e[7]=i("code",null,"DoubleReceive",-1)),e[8]||(e[8]=l("プラグインを")),e[9]||(e[9]=i("a",{href:"#install"},"インストール",-1)),e[10]||(e[10]=l("するには、指定された")),s(r,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:t(()=>e[5]||(e[5]=[l("モジュール")])),_:1}),e[11]||(e[11]=l("内の")),e[12]||(e[12]=i("code",null,"install",-1)),e[13]||(e[13]=l("関数に渡します。 以下のコードスニペットは、")),e[14]||(e[14]=i("code",null,"DoubleReceive",-1)),e[15]||(e[15]=l("をインストールする方法を示しています... "))]),s(c,null,{default:t(()=>e[16]||(e[16]=[i("li",null,[l(" ... "),i("code",null,"embeddedServer"),l("関数呼び出し内で。 ")],-1),i("li",null,[l(" ... "),i("code",null,"Application"),l("クラスの拡張関数である明示的に定義された"),i("code",null,"module"),l("内で。 ")],-1)])),_:1}),s(p,null,{default:t(()=>[s(o,{title:"embeddedServer"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DoubleReceive)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),s(o,{title:"module"},{default:t(()=>[s(a,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.doublereceive.*
            // ...
            fun Application.module() {
                install(DoubleReceive)
                // ...
            }`})]),_:1})]),_:1}),e[19]||(e[19]=d("",13))])}const D=v(b,[["render",y]]);export{T as __pageData,D as default};
