import{_ as y,C as e,c as F,o as v,G as i,ag as d,j as a,w as n,a as t}from"./chunks/framework.Bksy39di.js";const A=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-request-validation.md","filePath":"ja/ktor/server-request-validation.md","lastUpdated":1755457140000}'),b={name:"ja/ktor/server-request-validation.md"};function m(C,s,q,f,B,V){const o=e("TopicTitle"),r=e("show-structure"),E=e("primary-label"),h=e("Links"),g=e("tldr"),u=e("link-summary"),l=e("code-block"),p=e("TabItem"),k=e("Tabs"),c=e("list");return v(),F("div",null,[i(o,{labelRef:"server-plugin",title:"リクエストのバリデーション"}),i(r,{for:"chapter",depth:"2"}),i(E,{ref:"server-plugin"},null,512),i(g,null,{default:n(()=>[s[3]||(s[3]=a("p",null,[a("b",null,"必須の依存関係"),t(": "),a("code",null,"io.ktor:ktor-server-request-validation")],-1)),s[4]||(s[4]=a("p",null,[a("b",null,"コード例"),t(": "),a("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/request-validation"}," request-validation ")],-1)),a("p",null,[a("b",null,[i(h,{href:"/ktor/server-native",summary:"Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine."},{default:n(()=>s[0]||(s[0]=[t("ネイティブサーバー")])),_:1}),s[1]||(s[1]=t("のサポート"))]),s[2]||(s[2]=t(": ✅ "))])]),_:1}),i(u,null,{default:n(()=>s[5]||(s[5]=[t(" RequestValidation は、受信リクエストのボディをバリデートする機能を提供します。 ")])),_:1}),s[18]||(s[18]=d("",3)),i(k,{group:"languages"},{default:n(()=>[i(p,{title:"Gradle (Kotlin)","group-key":"kotlin"},{default:n(()=>[i(l,{lang:"Kotlin",code:'            implementation("io.ktor:ktor-server-request-validation:$ktor_version")'})]),_:1}),i(p,{title:"Gradle (Groovy)","group-key":"groovy"},{default:n(()=>[i(l,{lang:"Groovy",code:'            implementation "io.ktor:ktor-server-request-validation:$ktor_version"'})]),_:1}),i(p,{title:"Maven","group-key":"maven"},{default:n(()=>[i(l,{lang:"XML",code:`            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-server-request-validation-jvm</artifactId>
                <version>\${ktor_version}</version>
            </dependency>`})]),_:1})]),_:1}),s[19]||(s[19]=a("h2",{id:"install_plugin",tabindex:"-1"},[t("RequestValidationのインストール "),a("a",{class:"header-anchor",href:"#install_plugin","aria-label":'Permalink to "RequestValidationのインストール {id="install_plugin"}"'},"​")],-1)),a("p",null,[s[7]||(s[7]=t(" アプリケーションに")),s[8]||(s[8]=a("a",{href:"#install"},"インストール",-1)),s[9]||(s[9]=t("するには、指定された")),i(h,{href:"/ktor/server-modules",summary:"Modules allow you to structure your application by grouping routes."},{default:n(()=>s[6]||(s[6]=[t("モジュール")])),_:1}),s[10]||(s[10]=t("の")),s[11]||(s[11]=a("code",null,"install",-1)),s[12]||(s[12]=t("関数に")),s[13]||(s[13]=a("code",null,"RequestValidation",-1)),s[14]||(s[14]=t("プラグインを渡します。 以下のコードスニペットは、")),s[15]||(s[15]=a("code",null,"RequestValidation",-1)),s[16]||(s[16]=t("をインストールする方法を示しています... "))]),i(c,null,{default:n(()=>s[17]||(s[17]=[a("li",null,[t(" ... "),a("code",null,"embeddedServer"),t("関数呼び出しの内部。 ")],-1),a("li",null,[t(" ... "),a("code",null,"Application"),t("クラスの拡張関数である、明示的に定義された"),a("code",null,"module"),t("の内部。 ")],-1)])),_:1}),i(k,null,{default:n(()=>[i(p,{title:"embeddedServer"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.engine.*
            import io.ktor.server.netty.*
            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*

            fun main() {
                embeddedServer(Netty, port = 8080) {
                    install(RequestValidation)
                    // ...
                }.start(wait = true)
            }`})]),_:1}),i(p,{title:"module"},{default:n(()=>[i(l,{lang:"kotlin",code:`            import io.ktor.server.application.*
            import io.ktor.server.plugins.requestvalidation.*
            // ...
            fun Application.module() {
                install(RequestValidation)
                // ...
            }`})]),_:1})]),_:1}),s[20]||(s[20]=d("",26))])}const _=y(b,[["render",m]]);export{A as __pageData,_ as default};
