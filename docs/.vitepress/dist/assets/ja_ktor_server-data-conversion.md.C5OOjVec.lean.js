import{_ as u,C as t,c as v,o as y,G as a,ag as k,j as i,w as e,a as n}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-data-conversion.md","filePath":"ja/ktor/server-data-conversion.md","lastUpdated":1755514048000}'),m={name:"ja/ktor/server-data-conversion.md"};function F(C,s,D,b,f,A){const d=t("TopicTitle"),h=t("primary-label"),p=t("Links"),E=t("tldr"),g=t("link-summary"),l=t("code-block"),o=t("TabItem"),r=t("Tabs"),c=t("list");return y(),v("div",null,[a(d,{labelRef:"server-plugin",title:"データ変換"}),a(h,{ref:"server-plugin"},null,512),a(E,null,{default:e(()=>[s[3]||(s[3]=i("p",null,[i("b",null,"コード例"),n(": "),i("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/data-conversion"}," data-conversion ")],-1)),s[4]||(s[4]=i("p",null,[i("b",null,"必要な依存関係"),n(": "),i("code",null,"io.ktor:ktor-server-data-conversion")],-1)),i("p",null,[i("b",null,[a(p,{href:"/ktor/server-native",summary:"KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。"},{default:e(()=>s[0]||(s[0]=[n("ネイティブサーバー")])),_:1}),s[1]||(s[1]=n("のサポート"))]),s[2]||(s[2]=n(": ✅ "))])]),_:1}),a(g,null,{default:e(()=>s[5]||(s[5]=[n(" Ktorサーバー用の`DataConversion`プラグインを使用すると、値のリストのシリアライズおよびデシリアライズのためのカスタムコンバーターを追加できます。 ")])),_:1}),s[17]||(s[17]=k("",3)),a(r,{group:"languages"},{default:e(()=>[a(o,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:e(()=>[a(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-data-conversion:$ktor_version")'})]),_:1}),a(o,{title:"Gradle (Groovy)","group-key":"groovy"},{default:e(()=>[a(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-data-conversion:$ktor_version"'})]),_:1}),a(o,{title:"Maven","group-key":"maven"},{default:e(()=>[a(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-data-conversion-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[18]||(s[18]=i("h2",{id:"install_plugin",tabindex:"-1"},[n("DataConversionをインストールする "),i("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "DataConversionをインストールする {id="install_plugin"}"'},"​")],-1)),i("p",null,[s[7]||(s[7]=i("code",null,"DataConversion",-1)),s[8]||(s[8]=n("プラグインをアプリケーションに")),s[9]||(s[9]=i("a",{href:"#install"},"インストール",-1)),s[10]||(s[10]=n("するには、指定された")),a(p,{href:"/ktor/server-modules",summary:"モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。"},{default:e(()=>s[6]||(s[6]=[n("モジュール")])),_:1}),s[11]||(s[11]=n("の")),s[12]||(s[12]=i("code",null,"install",-1)),s[13]||(s[13]=n("関数に渡します。 以下のコードスニペットは、")),s[14]||(s[14]=i("code",null,"DataConversion",-1)),s[15]||(s[15]=n("をインストールする方法を示しています... "))]),a(c,null,{default:e(()=>s[16]||(s[16]=[i("li",null,[n(" ..."),i("code",null,"embeddedServer"),n("関数呼び出し内で。 ")],-1),i("li",null,[n(" ...明示的に定義された"),i("code",null,"module"),n("内。これは"),i("code",null,"Application"),n("クラスの拡張関数です。 ")],-1)])),_:1}),a(r,null,{default:e(()=>[a(o,{title:"embeddedServer"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(DataConversion)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),a(o,{title:"module"},{default:e(()=>[a(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.dataconversion.*
            // ...
            fun Application.module() {
                install(DataConversion)
                // ...
            }`})]),_:1})]),_:1}),s[19]||(s[19]=k("",14))])}const T=u(m,[["render",F]]);export{B as __pageData,T as default};
