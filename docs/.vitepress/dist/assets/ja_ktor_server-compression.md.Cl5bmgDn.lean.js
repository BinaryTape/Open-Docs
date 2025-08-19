import{_ as u,C as t,c as m,o as y,G as e,ag as d,j as i,w as a,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-compression.md","filePath":"ja/ktor/server-compression.md","lastUpdated":1755457140000}'),v={name:"ja/ktor/server-compression.md"};function b(f,s,C,_,F,q){const k=t("TopicTitle"),h=t("show-structure"),c=t("primary-label"),p=t("Links"),E=t("tldr"),l=t("code-block"),o=t("TabItem"),r=t("Tabs"),g=t("list");return y(),m("div",null,[e(k,{labelRef:"server-plugin",title:"圧縮"}),e(h,{for:"chapter",depth:"2"}),e(c,{ref:"server-plugin"},null,512),e(E,null,{default:a(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"必須の依存関係"),n(": "),i("code",null,"io.ktor:ktor-server-compression")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"コード例"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/compression"}," compression ")],-1)),i("p",null,[i("b",null,[e(p,{href:"/ktor/server-native",summary:"Ktor は Kotlin/Native をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:a(()=>s[0]||(s[0]=[n("ネイティブサーバー")])),_:1}),s[1]||(s[1]=n("のサポート"))]),s[2]||(s[2]=n(": ✖️ "))])]),_:1}),s[16]||(s[16]=d("",5)),e(r,{group:"languages"},{default:a(()=>[e(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:a(()=>[e(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-compression:$ktor_version")'})]),_:1}),e(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:a(()=>[e(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-compression:$ktor_version"'})]),_:1}),e(o,{title:"Maven","group-key":"maven"},{default:a(()=>[e(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-compression-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[17]||(s[17]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("Compression のインストール "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "Compression のインストール {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[6]||(s[6]=i("code",null,"Compression",-1)),s[7]||(s[7]=n(" プラグインをアプリケーションに")),s[8]||(s[8]=i("a",{href:"#install"},"インストール",-1)),s[9]||(s[9]=n("するには、指定された")),e(p,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:a(()=>s[5]||(s[5]=[n("モジュール")])),_:1}),s[10]||(s[10]=n("内で ")),s[11]||(s[11]=i("code",null,"install",-1)),s[12]||(s[12]=n(" 関数に渡します。 以下のコードスニペットは、")),s[13]||(s[13]=i("code",null,"Compression",-1)),s[14]||(s[14]=n(" をインストールする方法を示しています... "))]),e(g,null,{default:a(()=>s[15]||(s[15]=[i("li",null,[n(" ... "),i("code",null,"embeddedServer"),n(" 関数呼び出し内。 ")],-1),i("li",null,[n(" ... "),i("code",null,"Application"),n(" クラスの拡張関数である、明示的に定義された "),i("code",null,"module"),n(" 内。 ")],-1)])),_:1}),e(r,null,{default:a(()=>[e(o,{title:"embeddedServer"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.compression.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(Compression)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),e(o,{title:"module"},{default:a(()=>[e(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.compression.*
            // ...
            fun Application.module() {
                install(Compression)
                // ...
            }`})]),_:1})]),_:1}),s[18]||(s[18]=d("",24))])}const x=u(v,[["render",b]]);export{B as __pageData,x as default};
