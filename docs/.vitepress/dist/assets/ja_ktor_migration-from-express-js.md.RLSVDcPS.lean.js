import{_ as q,C as p,c as S,o as j,G as l,w as r,j as n,a as e}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/migration-from-express-js.md","filePath":"ja/ktor/migration-from-express-js.md","lastUpdated":1755457140000}'),w={name:"ja/ktor/migration-from-express-js.md"},E={style:{}},T={style:{}},P={style:{}},K={style:{}},A={style:{}},C={style:{}},N={style:{}},R={style:{}},O={style:{}},F={style:{}},L={style:{}},B={style:{}},D={style:{}},H={style:{}},J={style:{}},M={style:{}},$={style:{}},G={style:{}},U={style:{}};function W(V,t,I,Y,z,X){const k=p("show-structure"),x=p("link-summary"),b=p("tldr"),o=p("control"),s=p("code-block"),g=p("list"),u=p("Links"),i=p("chapter"),d=p("Path"),v=p("tip"),a=p("tab"),f=p("tabs"),m=p("emphasis"),y=p("topic");return j(),S("div",null,[l(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"ExpressからKtorへの移行",id:"migration-from-express-js","help-id":"express-js;migrating-from-express-js"},{default:r(()=>[l(k,{for:"chapter",depth:"2"}),l(x,null,{default:r(()=>t[0]||(t[0]=[e("このガイドでは、シンプルなKtorアプリケーションの作成、実行、テスト方法を説明します。")])),_:1}),l(b,null,{default:r(()=>t[1]||(t[1]=[n("p",null,[n("b",null,"コード例"),e(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express"},"migrating-express"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor"},"migrating-express-ktor")],-1)])),_:1}),t[280]||(t[280]=n("p",null," このガイドでは、基本的なシナリオにおけるExpressアプリケーションからKtorへの移行方法について説明します。アプリケーションの生成から最初のアプリケーションの記述、そしてアプリケーション機能を拡張するためのミドルウェアの作成までを扱います。 ",-1)),l(i,{title:"アプリケーションを生成する",id:"generate"},{default:r(()=>[n("table",E,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[2]||(t[2]=[e("Express")])),_:1})]),n("td",null,[t[3]||(t[3]=n("p",null,[n("code",null,"express-generator"),e("ツールを使用して、新しいExpressアプリケーションを生成できます。 ")],-1)),l(s,{lang:"shell",code:"                        npx express-generator"})])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[4]||(t[4]=[e("Ktor")])),_:1})]),n("td",null,[t[12]||(t[12]=n("p",null," Ktorは、アプリケーションのスケルトンを生成する以下の方法を提供します。 ",-1)),l(g,null,{default:r(()=>[t[7]||(t[7]=n("li",null,[n("p",null,[n("a",{href:"https://start.ktor.io/"},"Ktorプロジェクトジェネレーター"),e(" — Webベースのジェネレーターを使用します。 ")])],-1)),n("li",null,[t[5]||(t[5]=n("p",null,[n("a",{href:"https://github.com/ktorio/ktor-cli"}," Ktor CLIツール "),e(" — コマンドラインインターフェースを介して"),n("code",null,"ktor new"),e("コマンドでKtorプロジェクトを生成します。 ")],-1)),l(s,{lang:"shell",code:"                                ktor new ktor-sample"})]),n("li",null,[t[6]||(t[6]=n("p",null,[n("a",{href:"https://www.npmjs.com/package/generator-ktor"}," Yeomanジェネレーター "),e(" — 対話形式でプロジェクト設定を行い、必要なプラグインを選択します。 ")],-1)),l(s,{lang:"shell",code:"                                yo ktor"})]),t[8]||(t[8]=n("li",null,[n("p",null,[n("a",{href:"https://ktor.io/idea/"},"IntelliJ IDEA Ultimate"),e(" — 組み込みのKtorプロジェクトウィザードを使用します。 ")])],-1))]),_:1}),n("p",null,[t[10]||(t[10]=e(" 詳細な手順については、")),l(u,{href:"/ktor/server-create-a-new-project",summary:"Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びます。"},{default:r(()=>t[9]||(t[9]=[e("新しいKtorプロジェクトを作成、開く、実行する")])),_:1}),t[11]||(t[11]=e("チュートリアルを参照してください。 "))])])])])]),_:1}),l(i,{title:"Hello world",id:"hello"},{default:r(()=>[t[40]||(t[40]=n("p",null,[e(" このセクションでは、"),n("code",null,"GET"),e("リクエストを受け入れ、事前定義されたプレーンテキストで応答する最もシンプルなサーバーアプリケーションを作成する方法を見ていきます。 ")],-1)),n("table",T,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[13]||(t[13]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[15]||(t[15]=e(" 以下の例は、サーバーを起動し、ポート ")),l(o,null,{default:r(()=>t[14]||(t[14]=[e("3000")])),_:1}),t[16]||(t[16]=e(" で接続をリッスンするExpressアプリケーションを示しています。 "))]),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[17]||(t[17]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/1_hello/app.js"},"1_hello"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[18]||(t[18]=[e("Ktor")])),_:1})]),n("td",null,[t[19]||(t[19]=n("p",null,[e(" Ktorでは、"),n("a",{href:"#embedded-server"},"embeddedServer"),e(" 関数を使用してコード内でサーバーパラメータを設定し、アプリケーションを素早く実行できます。 ")],-1)),l(s,{lang:"kotlin",code:`import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        routing {
            get("/") {
                call.respondText("Hello World!")
            }
        }
    }.start(wait = true)
}`}),t[20]||(t[20]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt"},"1_hello"),e(" プロジェクトを参照してください。 ")],-1)),t[21]||(t[21]=n("p",null,[e(" また、HOCONまたはYAML形式を使用する"),n("a",{href:"#engine-main"},"外部設定ファイル"),e("でサーバー設定を指定することもできます。 ")],-1))])])]),n("p",null,[t[25]||(t[25]=e(" 上記のExpressアプリケーションは、 ")),l(o,null,{default:r(()=>t[22]||(t[22]=[e("Date")])),_:1}),t[26]||(t[26]=e(" 、 ")),l(o,null,{default:r(()=>t[23]||(t[23]=[e("X-Powered-By")])),_:1}),t[27]||(t[27]=e(" 、および ")),l(o,null,{default:r(()=>t[24]||(t[24]=[e("ETag")])),_:1}),t[28]||(t[28]=e(" 応答ヘッダーを追加することに注意してください。これらは次のようになります。 "))]),l(s,{code:`            Date: Fri, 05 Aug 2022 06:30:48 GMT
            X-Powered-By: Express
            ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"`}),n("p",null,[t[34]||(t[34]=e(" Ktorの各レスポンスにデフォルトの ")),l(o,null,{default:r(()=>t[29]||(t[29]=[e("Server")])),_:1}),t[35]||(t[35]=e(" および ")),l(o,null,{default:r(()=>t[30]||(t[30]=[e("Date")])),_:1}),t[36]||(t[36]=e(" ヘッダーを追加するには、")),l(u,{href:"/ktor/server-default-headers",summary:"必要な依存関係: io.ktor:%artifact_name% ネイティブサーバーサポート: ✅"},{default:r(()=>t[31]||(t[31]=[e("DefaultHeaders")])),_:1}),t[37]||(t[37]=e("プラグインをインストールする必要があります。 ")),l(u,{href:"/ktor/server-conditional-headers",summary:"必要な依存関係: io.ktor:%artifact_name% コード例: %example_name% ネイティブサーバーサポート: ✅"},{default:r(()=>t[32]||(t[32]=[e("ConditionalHeaders")])),_:1}),t[38]||(t[38]=e("プラグインは、 ")),l(o,null,{default:r(()=>t[33]||(t[33]=[e("Etag")])),_:1}),t[39]||(t[39]=e(" 応答ヘッダーを設定するために使用できます。 "))])]),_:1}),l(i,{title:"静的コンテンツの提供",id:"static"},{default:r(()=>[n("p",null,[t[43]||(t[43]=e(" このセクションでは、ExpressとKtorで画像、CSSファイル、JavaScriptファイルなどの静的ファイルをどのように提供するかを見ていきます。 ")),l(d,null,{default:r(()=>t[41]||(t[41]=[e("public")])),_:1}),t[44]||(t[44]=e(" フォルダにメインの ")),l(d,null,{default:r(()=>t[42]||(t[42]=[e("index.html")])),_:1}),t[45]||(t[45]=e(" ページと、それにリンクされた一連のアセットがあるとします。 "))]),l(s,{code:`            public
            ├── index.html
            ├── ktor_logo.png
            ├── css
            │   └──styles.css
            └── js
                └── script.js`}),n("table",P,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[46]||(t[46]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[48]||(t[48]=e(" Expressでは、フォルダ名を ")),l(o,null,{default:r(()=>t[47]||(t[47]=[e("express.static")])),_:1}),t[49]||(t[49]=e(" 関数に渡します。 "))]),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[50]||(t[50]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/2_static/app.js"},"2_static"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[51]||(t[51]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[55]||(t[55]=e(" Ktorでは、")),t[56]||(t[56]=n("a",{href:"#folders"},[n("code",null,"staticFiles()")],-1)),t[57]||(t[57]=e(" 関数を使用して、 ")),l(d,null,{default:r(()=>t[52]||(t[52]=[e("/")])),_:1}),t[58]||(t[58]=e(" パスへのリクエストを ")),l(d,null,{default:r(()=>t[53]||(t[53]=[e("public")])),_:1}),t[59]||(t[59]=e(" 物理フォルダにマッピングします。 この関数は、 ")),l(d,null,{default:r(()=>t[54]||(t[54]=[e("public")])),_:1}),t[60]||(t[60]=e(" フォルダ内のすべてのファイルを再帰的に提供することを可能にします。 "))]),l(s,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        staticFiles("", File("public"), "index.html")
    }
}`}),t[61]||(t[61]=n("p",null,[e(" 完全な例については、"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt"},"2_static"),e(" プロジェクトを参照してください。 ")],-1))])])]),t[73]||(t[73]=n("p",null," 静的コンテンツを提供する場合、Expressは次のような応答ヘッダーをいくつか追加します。 ",-1)),l(s,{code:`            Accept-Ranges: bytes
            Cache-Control: public, max-age=0
            ETag: W/"181-1823feafeb1"
            Last-Modified: Wed, 27 Jul 2022 13:49:01 GMT`}),t[74]||(t[74]=n("p",null," Ktorでこれらのヘッダーを管理するには、以下のプラグインをインストールする必要があります。 ",-1)),l(g,null,{default:r(()=>[n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[62]||(t[62]=[e("Accept-Ranges")])),_:1}),t[64]||(t[64]=e(" : ")),l(u,{href:"/ktor/server-partial-content",summary:"必要な依存関係: io.ktor:%artifact_name% サーバー例: download-file, クライアント例: client-download-file-range ネイティブサーバーサポート: ✅"},{default:r(()=>t[63]||(t[63]=[e("PartialContent")])),_:1})])]),n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[65]||(t[65]=[e("Cache-Control")])),_:1}),t[67]||(t[67]=e(" : ")),l(u,{href:"/ktor/server-caching-headers",summary:"必要な依存関係: io.ktor:%artifact_name% コード例: %example_name% ネイティブサーバーサポート: ✅"},{default:r(()=>t[66]||(t[66]=[e("CachingHeaders")])),_:1})])]),n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[68]||(t[68]=[e("ETag")])),_:1}),t[71]||(t[71]=e(" および ")),l(o,null,{default:r(()=>t[69]||(t[69]=[e("Last-Modified")])),_:1}),t[72]||(t[72]=e(" : ")),l(u,{href:"/ktor/server-conditional-headers",summary:"必要な依存関係: io.ktor:%artifact_name% コード例: %example_name% ネイティブサーバーサポート: ✅"},{default:r(()=>t[70]||(t[70]=[e("ConditionalHeaders")])),_:1})])])]),_:1})]),_:1}),l(i,{title:"ルーティング",id:"routing"},{default:r(()=>[n("p",null,[l(u,{href:"/ktor/server-routing",summary:"ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。"},{default:r(()=>t[75]||(t[75]=[e("ルーティング")])),_:1}),t[77]||(t[77]=e("は、特定のHTTPリクエストメソッド（")),t[78]||(t[78]=n("code",null,"GET",-1)),t[79]||(t[79]=e("、")),t[80]||(t[80]=n("code",null,"POST",-1)),t[81]||(t[81]=e("など）とパスによって定義される、特定のエンドポイントへの受信リクエストを処理できます。 以下の例は、")),l(d,null,{default:r(()=>t[76]||(t[76]=[e("/")])),_:1}),t[82]||(t[82]=e("パスへの")),t[83]||(t[83]=n("code",null,"GET",-1)),t[84]||(t[84]=e("および ")),t[85]||(t[85]=n("code",null,"POST",-1)),t[86]||(t[86]=e("リクエストを処理する方法を示しています。 "))]),n("table",K,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[87]||(t[87]=[e("Express")])),_:1})]),n("td",null,[l(s,{lang:"javascript",code:`app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
})`}),t[88]||(t[88]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[89]||(t[89]=[e("Ktor")])),_:1})]),n("td",null,[l(s,{lang:"kotlin",code:`    routing {
        get("/") {
            call.respondText("GET request to the homepage")
        }
        post("/") {
            call.respondText("POST request to the homepage")
        }
    }`}),l(v,null,{default:r(()=>t[90]||(t[90]=[n("p",null,[n("code",null,"POST"),e("、"),n("code",null,"PUT"),e("、または "),n("code",null,"PATCH"),e("リクエストの本文を受信する方法については、"),n("a",{href:"#receive-request"},"リクエストの受信"),e("を参照してください。 ")],-1)])),_:1}),t[91]||(t[91]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])])]),t[123]||(t[123]=n("p",null," 以下の例は、パスごとにルートハンドラーをグループ化する方法を示しています。 ",-1)),n("table",A,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[92]||(t[92]=[e("Express")])),_:1})]),n("td",null,[t[93]||(t[93]=n("p",null,[e(" Expressでは、"),n("code",null,"app.route()"),e("を使用して、ルートパスの連鎖可能なルートハンドラーを作成できます。 ")],-1)),l(s,{lang:"javascript",code:`app.route('/book')
    .get((req, res) => {
        res.send('Get a random book')
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    })`}),t[94]||(t[94]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[95]||(t[95]=[e("Ktor")])),_:1})]),n("td",null,[t[96]||(t[96]=n("p",null,[e(" Ktorは"),n("code",null,"route"),e("関数を提供しており、これによりパスを定義し、そのパスの動詞をネストされた関数として配置できます。 ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        route("book") {
            get {
                call.respondText("Get a random book")
            }
            post {
                call.respondText("Add a book")
            }
            put {
                call.respondText("Update the book")
            }
        }
    }`}),t[97]||(t[97]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])])]),t[124]||(t[124]=n("p",null," どちらのフレームワークも、関連するルートを単一のファイルにグループ化することを可能にします。 ",-1)),n("table",C,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[98]||(t[98]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[101]||(t[101]=e(" Expressは、マウント可能なルートハンドラーを作成するために")),t[102]||(t[102]=n("code",null,"express.Router",-1)),t[103]||(t[103]=e("クラスを提供します。 アプリケーションのディレクトリに ")),l(d,null,{default:r(()=>t[99]||(t[99]=[e("birds.js")])),_:1}),t[104]||(t[104]=e(" ルーターファイルがあるとします。 このルーターモジュールは、")),l(d,null,{default:r(()=>t[100]||(t[100]=[e("app.js")])),_:1}),t[105]||(t[105]=e(" に示されているようにアプリケーションにロードできます。 "))]),l(f,null,{default:r(()=>[l(a,{title:"birds.js"},{default:r(()=>[l(s,{lang:"javascript",code:`const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Birds home page')
})

router.get('/about', (req, res) => {
    res.send('About birds')
})

module.exports = router`})]),_:1}),l(a,{title:"app.js"},{default:r(()=>[l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const birds = require('./birds')
const port = 3000

app.use('/birds', birds)

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`})]),_:1})]),_:1}),t[106]||(t[106]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[107]||(t[107]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[110]||(t[110]=e(" Ktorでは、一般的なパターンとして、")),t[111]||(t[111]=n("code",null,"Routing",-1)),t[112]||(t[112]=e("型に拡張関数を使用して実際のルートを定義します。 以下のサンプル（ ")),l(d,null,{default:r(()=>t[108]||(t[108]=[e("Birds.kt")])),_:1}),t[113]||(t[113]=e(" ）は、")),t[114]||(t[114]=n("code",null,"birdsRoutes",-1)),t[115]||(t[115]=e("拡張関数を定義しています。 この関数を")),t[116]||(t[116]=n("code",null,"routing",-1)),t[117]||(t[117]=e("ブロック内で呼び出すことで、対応するルートをアプリケーション（ ")),l(d,null,{default:r(()=>t[109]||(t[109]=[e("Application.kt")])),_:1}),t[118]||(t[118]=e(" ）に含めることができます。 "))]),l(f,null,{default:r(()=>[l(a,{title:"Birds.kt",id:"birds-kt"},{default:r(()=>[l(s,{lang:"kotlin",code:`import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.birdsRoutes() {
    route("/birds") {
        get {
            call.respondText("Birds home page")
        }
        get("/about") {
            call.respondText("About birds")
        }
    }
}`})]),_:1}),l(a,{title:"Application.kt",id:"application-kt"},{default:r(()=>[l(s,{lang:"kotlin",code:`import com.example.routes.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        birdsRoutes()
    }
}`})]),_:1})]),_:1}),t[119]||(t[119]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e(" プロジェクトを参照してください。 ")],-1))])])]),n("p",null,[t[121]||(t[121]=e(" URLパスを文字列として指定する以外に、Ktorには")),l(u,{href:"/ktor/server-resources",summary:"Resourcesプラグインを使用すると、型安全なルーティングを実装できます。"},{default:r(()=>t[120]||(t[120]=[e("型安全なルート")])),_:1}),t[122]||(t[122]=e("を実装する機能が含まれています。 "))])]),_:1}),l(i,{title:"ルートパラメータとクエリパラメータ",id:"route-query-param"},{default:r(()=>[t[153]||(t[153]=n("p",null," このセクションでは、ルートパラメータとクエリパラメータにアクセスする方法を示します。 ",-1)),t[154]||(t[154]=n("p",null," ルート（またはパス）パラメータは、URL内のその位置で指定された値をキャプチャするために使用される、名前付きのURLセグメントです。 ",-1)),n("table",N,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[125]||(t[125]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[128]||(t[128]=e(" Expressでルートパラメータにアクセスするには、")),t[129]||(t[129]=n("code",null,"Request.params",-1)),t[130]||(t[130]=e("を使用できます。 例えば、以下のコードスニペットの")),t[131]||(t[131]=n("code",null,'req.parameters["login"]',-1)),t[132]||(t[132]=e("は、 ")),l(m,null,{default:r(()=>t[126]||(t[126]=[e("admin")])),_:1}),t[133]||(t[133]=e(" を")),l(d,null,{default:r(()=>t[127]||(t[127]=[e("/user/admin")])),_:1}),t[134]||(t[134]=e(" パスの場合に返します。 "))]),l(s,{lang:"javascript",code:`app.get('/user/:login', (req, res) => {
    if (req.params['login'] === 'admin') {
        res.send('You are logged in as Admin')
    } else {
        res.send('You are logged in as Guest')
    }
})`}),t[135]||(t[135]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[136]||(t[136]=[e("Ktor")])),_:1})]),n("td",null,[t[137]||(t[137]=n("p",null,[e(" Ktorでは、ルートパラメータは"),n("code",null,"{param}"),e("構文を使用して定義されます。 ルートハンドラーでルートパラメータにアクセスするには、"),n("code",null,"call.parameters"),e("を使用できます。 ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        get("/user/{login}") {
            if (call.parameters["login"] == "admin") {
                call.respondText("You are logged in as Admin")
            } else {
                call.respondText("You are logged in as Guest")
            }
        }
    }`}),t[138]||(t[138]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),e(" プロジェクトを参照してください。 ")],-1))])])]),t[155]||(t[155]=n("p",null," 以下の表は、クエリ文字列のパラメータにアクセスする方法を比較しています。 ",-1)),n("table",R,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[139]||(t[139]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[142]||(t[142]=e(" Expressでルートパラメータにアクセスするには、")),t[143]||(t[143]=n("code",null,"Request.params",-1)),t[144]||(t[144]=e("を使用できます。 例えば、以下のコードスニペットの")),t[145]||(t[145]=n("code",null,'req.parameters["login"]',-1)),t[146]||(t[146]=e("は、 ")),l(m,null,{default:r(()=>t[140]||(t[140]=[e("admin")])),_:1}),t[147]||(t[147]=e(" を")),l(d,null,{default:r(()=>t[141]||(t[141]=[e("/user/admin")])),_:1}),t[148]||(t[148]=e(" パスの場合に返します。 "))]),l(s,{lang:"javascript",code:`app.get('/products', (req, res) => {
    if (req.query['price'] === 'asc') {
        res.send('Products from the lowest price to the highest')
    }
})`}),t[149]||(t[149]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[150]||(t[150]=[e("Ktor")])),_:1})]),n("td",null,[t[151]||(t[151]=n("p",null,[e(" Ktorでは、ルートパラメータは"),n("code",null,"{param}"),e("構文を使用して定義されます。 ルートハンドラーでルートパラメータにアクセスするには、"),n("code",null,"call.parameters"),e("を使用できます。 ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        get("/products") {
            if (call.request.queryParameters["price"] == "asc") {
                call.respondText("Products from the lowest price to the highest")
            }
        }
    }`}),t[152]||(t[152]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"レスポンスの送信",id:"send-response"},{default:r(()=>[t[191]||(t[191]=n("p",null," これまでのセクションでは、プレーンテキストコンテンツで応答する方法を見てきました。 JSON、ファイル、およびリダイレクト応答を送信する方法を見ていきましょう。 ",-1)),l(i,{title:"JSON",id:"send-json"},{default:r(()=>[n("table",O,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[156]||(t[156]=[e("Express")])),_:1})]),n("td",null,[t[157]||(t[157]=n("p",null,[e(" Expressで適切なコンテンツタイプを含むJSONレスポンスを送信するには、 "),n("code",null,"res.json"),e("関数を呼び出します。 ")],-1)),l(s,{lang:"javascript",code:`const car = {type:"Fiat", model:"500", color:"white"};
app.get('/json', (req, res) => {
    res.json(car)
})`}),t[158]||(t[158]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[159]||(t[159]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[161]||(t[161]=e(" Ktorでは、")),l(u,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインには、クライアントとサーバー間でメディアタイプをネゴシエートすること、およびコンテンツを特定の形式でシリアライズ/デシリアライズすることという2つの主要な目的があります。"},{default:r(()=>t[160]||(t[160]=[e("ContentNegotiation")])),_:1}),t[162]||(t[162]=e(" プラグインをインストールし、 JSONシリアライザを設定する必要があります。 "))]),l(s,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[163]||(t[163]=n("p",null,[e(" データをJSONにシリアライズするには、"),n("code",null,"@Serializable"),e("アノテーションを付けたデータクラスを作成する必要があります。 ")],-1)),l(s,{lang:"kotlin",code:`@Serializable
data class Car(val type: String, val model: String, val color: String)`}),t[164]||(t[164]=n("p",null,[e(" 次に、"),n("code",null,"call.respond"),e("を使用してこのクラスのオブジェクトをレスポンスで送信できます。 ")],-1)),l(s,{lang:"kotlin",code:`        get("/json") {
            call.respond(Car("Fiat", "500", "white"))
        }`}),t[165]||(t[165]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"ファイル",id:"send-file"},{default:r(()=>[n("table",F,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[166]||(t[166]=[e("Express")])),_:1})]),n("td",null,[t[167]||(t[167]=n("p",null,[e(" Expressでファイルで応答するには、"),n("code",null,"res.sendFile"),e("を使用します。 ")],-1)),l(s,{lang:"javascript",code:`const path = require("path")

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'ktor_logo.png'))
})`}),t[168]||(t[168]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[169]||(t[169]=[e("Ktor")])),_:1})]),n("td",null,[t[170]||(t[170]=n("p",null,[e(" Ktorは、クライアントにファイルを送信するための"),n("code",null,"call.respondFile"),e("関数を提供します。 ")],-1)),l(s,{lang:"kotlin",code:`        get("/file") {
            val file = File("public/ktor_logo.png")
            call.respondFile(file)
        }`}),t[171]||(t[171]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])])]),n("p",null,[t[174]||(t[174]=e(" Expressアプリケーションは、ファイルで応答する際に ")),l(o,null,{default:r(()=>t[172]||(t[172]=[e("Accept-Ranges")])),_:1}),t[175]||(t[175]=e(" HTTP応答ヘッダーを追加します。 サーバーは、ファイルダウンロードのためのクライアントからの部分的なリクエストのサポートを宣伝するためにこのヘッダーを使用します。 Ktorでは、部分的なリクエストをサポートするために")),l(u,{href:"/ktor/server-partial-content",summary:"必要な依存関係: io.ktor:%artifact_name% サーバー例: download-file, クライアント例: client-download-file-range ネイティブサーバーサポート: ✅"},{default:r(()=>t[173]||(t[173]=[e("PartialContent")])),_:1}),t[176]||(t[176]=e("プラグインをインストールする必要があります。 "))])]),_:1}),l(i,{title:"ファイル添付",id:"send-file-attachment"},{default:r(()=>[n("table",L,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[177]||(t[177]=[e("Express")])),_:1})]),n("td",null,[t[178]||(t[178]=n("p",null,[n("code",null,"res.download"),e("関数は、指定されたファイルを添付ファイルとして転送します。 ")],-1)),l(s,{lang:"javascript",code:`app.get('/file-attachment', (req, res) => {
    res.download("ktor_logo.png")
})`}),t[179]||(t[179]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[180]||(t[180]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[182]||(t[182]=e(" Ktorでは、ファイルを添付ファイルとして転送するために、 ")),l(o,null,{default:r(()=>t[181]||(t[181]=[e("Content-Disposition")])),_:1}),t[183]||(t[183]=e(" ヘッダーを手動で設定する必要があります。 "))]),l(s,{lang:"kotlin",code:`        get("/file-attachment") {
            val file = File("public/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }`}),t[184]||(t[184]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"リダイレクト",id:"redirect"},{default:r(()=>[n("table",B,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[185]||(t[185]=[e("Express")])),_:1})]),n("td",null,[t[186]||(t[186]=n("p",null,[e(" Expressでリダイレクト応答を生成するには、"),n("code",null,"redirect"),e("関数を呼び出します。 ")],-1)),l(s,{lang:"javascript",code:`app.get('/old', (req, res) => {
    res.redirect(301, "moved")
})

app.get('/moved', (req, res) => {
    res.send('Moved resource')
})`}),t[187]||(t[187]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[188]||(t[188]=[e("Ktor")])),_:1})]),n("td",null,[t[189]||(t[189]=n("p",null,[e(" Ktorでは、"),n("code",null,"respondRedirect"),e("を使用してリダイレクト応答を送信します。 ")],-1)),l(s,{lang:"kotlin",code:`        get("/old") {
            call.respondRedirect("/moved", permanent = true)
        }
        get("/moved") {
            call.respondText("Moved resource")
        }`}),t[190]||(t[190]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1})]),_:1}),l(i,{title:"テンプレート",id:"templates"},{default:r(()=>[t[207]||(t[207]=n("p",null," ExpressとKtorの両方で、ビューを扱うためのテンプレートエンジンを使用できます。 ",-1)),n("table",D,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[192]||(t[192]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[194]||(t[194]=e(" 以下に示すPugテンプレートが ")),l(d,null,{default:r(()=>t[193]||(t[193]=[e("views")])),_:1}),t[195]||(t[195]=e(" フォルダにあるとします。 "))]),l(s,{code:`html
  head
    title= title
  body
    h1= message`}),t[196]||(t[196]=n("p",null,[e(" このテンプレートで応答するには、"),n("code",null,"res.render"),e("を呼び出します。 ")],-1)),l(s,{lang:"javascript",code:`app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})`}),t[197]||(t[197]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/6_templates/app.js"},"6_templates"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[198]||(t[198]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[200]||(t[200]=e(" Ktorは、FreeMarker、Velocityなど、いくつかの")),l(u,{href:"/ktor/server-templating",summary:"HTML/CSSまたはJVMテンプレートエンジンで構築されたビューを扱う方法を学びます。"},{default:r(()=>t[199]||(t[199]=[e("JVMテンプレートエンジン")])),_:1}),t[201]||(t[201]=e("をサポートしています。 例えば、アプリケーションリソースに配置されたFreeMarkerテンプレートで応答する必要がある場合、 ")),t[202]||(t[202]=n("code",null,"FreeMarker",-1)),t[203]||(t[203]=e("プラグインをインストールして設定し、 ")),t[204]||(t[204]=n("code",null,"call.respond",-1)),t[205]||(t[205]=e("を使用してテンプレートを送信します。 "))]),l(s,{lang:"kotlin",code:`fun Application.module() {
    install(FreeMarker) {
        templateLoader = ClassTemplateLoader(this::class.java.classLoader, "views")
    }
    routing {
        get("/") {
            val article = Article("Hey", "Hello there!")
            call.respond(FreeMarkerContent("index.ftl", mapOf("article" to article)))
        }
    }
}

data class Article(val title: String, val message: String)`}),t[206]||(t[206]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt"},"6_templates"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"リクエストの受信",id:"receive-request"},{default:r(()=>[t[265]||(t[265]=n("p",null," このセクションでは、さまざまな形式でリクエストボディを受信する方法を示します。 ",-1)),l(i,{title:"生テキスト",id:"receive-raw-text"},{default:r(()=>[t[215]||(t[215]=n("p",null,[e(" 以下の"),n("code",null,"POST"),e("リクエストは、テキストデータをサーバーに送信します。 ")],-1)),l(s,{lang:"http",code:`POST http://0.0.0.0:3000/text
Content-Type: text/plain

Hello, world!`}),t[216]||(t[216]=n("p",null," このリクエストの本文をサーバー側でプレーンテキストとして受信する方法を見てみましょう。 ",-1)),n("table",H,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[208]||(t[208]=[e("Express")])),_:1})]),n("td",null,[t[209]||(t[209]=n("p",null,[e(" Expressで受信リクエストボディをパースするには、"),n("code",null,"body-parser"),e("を追加する必要があります。 ")],-1)),l(s,{lang:"javascript",code:"const bodyParser = require('body-parser')"}),t[210]||(t[210]=n("p",null,[n("code",null,"post"),e("ハンドラーでは、テキストパーサー（"),n("code",null,"bodyParser.text"),e("）を渡す必要があります。 リクエストボディは"),n("code",null,"req.body"),e("プロパティから利用できます。 ")],-1)),l(s,{lang:"javascript",code:`app.post('/text', bodyParser.text(), (req, res) => {
    let text = req.body
    res.send(text)
})`}),t[211]||(t[211]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[212]||(t[212]=[e("Ktor")])),_:1})]),n("td",null,[t[213]||(t[213]=n("p",null,[e(" Ktorでは、"),n("code",null,"call.receiveText"),e("を使用してボディをテキストとして受信できます。 ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        post("/text") {
            val text = call.receiveText()
            call.respondText(text)`}),t[214]||(t[214]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"JSON",id:"receive-json"},{default:r(()=>[t[229]||(t[229]=n("p",null,[e(" このセクションでは、JSONボディを受信する方法を見ていきます。 以下のサンプルは、JSONオブジェクトをボディに含む"),n("code",null,"POST"),e("リクエストを示しています。 ")],-1)),l(s,{lang:"http",code:`POST http://0.0.0.0:3000/json
Content-Type: application/json

{
  "type": "Fiat",
  "model" : "500",
  "color": "white"
}`}),n("table",J,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[217]||(t[217]=[e("Express")])),_:1})]),n("td",null,[t[218]||(t[218]=n("p",null,[e(" ExpressでJSONを受信するには、"),n("code",null,"bodyParser.json"),e("を使用します。 ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/json', bodyParser.json(), (req, res) => {
    let car = req.body
    res.send(car)
})`}),t[219]||(t[219]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[220]||(t[220]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[222]||(t[222]=e(" Ktorでは、")),l(u,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインには、クライアントとサーバー間でメディアタイプをネゴシエートすること、およびコンテンツを特定の形式でシリアライズ/デシリアライズすることという2つの主要な目的があります。"},{default:r(()=>t[221]||(t[221]=[e("ContentNegotiation")])),_:1}),t[223]||(t[223]=e(" プラグインをインストールし、 ")),t[224]||(t[224]=n("code",null,"Json",-1)),t[225]||(t[225]=e("シリアライザーを設定する必要があります。 "))]),l(s,{lang:"kotlin",code:`fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })`}),t[226]||(t[226]=n("p",null," 受信したデータをオブジェクトにデシリアライズするには、データクラスを作成する必要があります。 ",-1)),l(s,{lang:"kotlin",code:"@Serializable"}),t[227]||(t[227]=n("p",null,[e(" 次に、このデータクラスをパラメータとして受け入れる"),n("code",null,"receive"),e("メソッドを使用します。 ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/json") {
            val car = call.receive<Car>()
            call.respond(car)`}),t[228]||(t[228]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"URLエンコード",id:"receive-url-encoded"},{default:r(()=>[n("p",null,[t[231]||(t[231]=e(" 次に、 ")),l(o,null,{default:r(()=>t[230]||(t[230]=[e("application/x-www-form-urlencoded")])),_:1}),t[232]||(t[232]=e(" タイプを使用して送信されたフォームデータを受信する方法を見ていきましょう。 以下のコードスニペットは、フォームデータを含むサンプル")),t[233]||(t[233]=n("code",null,"POST",-1)),t[234]||(t[234]=e("リクエストを示しています。 "))]),l(s,{lang:"http",code:`POST http://localhost:3000/urlencoded
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar`}),n("table",M,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[235]||(t[235]=[e("Express")])),_:1})]),n("td",null,[t[236]||(t[236]=n("p",null,[e(" プレーンテキストやJSONと同様に、Expressでは"),n("code",null,"body-parser"),e("が必要です。 パーサーのタイプを"),n("code",null,"bodyParser.urlencoded"),e("に設定する必要があります。 ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/urlencoded', bodyParser.urlencoded({extended: true}), (req, res) => {
    let user = req.body
    res.send(\`The \${user["username"]} account is created\`)
})`}),t[237]||(t[237]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[238]||(t[238]=[e("Ktor")])),_:1})]),n("td",null,[t[239]||(t[239]=n("p",null,[e(" Ktorでは、"),n("code",null,"call.receiveParameters"),e("関数を使用します。 ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/urlencoded") {
            val formParameters = call.receiveParameters()
            val username = formParameters["username"].toString()
            call.respondText("The '$username' account is created")`}),t[240]||(t[240]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"生データ",id:"receive-raw-data"},{default:r(()=>[n("p",null,[t[242]||(t[242]=e(" 次のユースケースはバイナリデータの処理です。 以下のリクエストは、 ")),l(o,null,{default:r(()=>t[241]||(t[241]=[e("application/octet-stream")])),_:1}),t[243]||(t[243]=e(" タイプでPNG画像をサーバーに送信します。 "))]),l(s,{lang:"http",code:`POST http://localhost:3000/raw
Content-Type: application/octet-stream

< ./ktor_logo.png`}),n("table",$,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[244]||(t[244]=[e("Express")])),_:1})]),n("td",null,[t[245]||(t[245]=n("p",null,[e(" Expressでバイナリデータを扱うには、パーサーのタイプを"),n("code",null,"raw"),e("に設定します。 ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')
const fs = require('fs')

app.post('/raw', bodyParser.raw({type: () => true}), (req, res) => {
    let rawBody = req.body
    fs.createWriteStream('./uploads/ktor_logo.png').write(rawBody)
    res.send('A file is uploaded')
})`}),t[246]||(t[246]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[247]||(t[247]=[e("Ktor")])),_:1})]),n("td",null,[t[248]||(t[248]=n("p",null,[e(" Ktorは、バイトシーケンスの非同期読み書きのために"),n("code",null,"ByteReadChannel"),e("と"),n("code",null,"ByteWriteChannel"),e("を提供します。 ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/raw") {
            val file = File("uploads/ktor_logo.png")
            call.receiveChannel().copyAndClose(file.writeChannel())
            call.respondText("A file is uploaded")`}),t[249]||(t[249]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive request"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"マルチパート",id:"receive-multipart"},{default:r(()=>[n("p",null,[t[252]||(t[252]=e(" 最後のセクションでは、")),l(m,null,{default:r(()=>t[250]||(t[250]=[e("マルチパート")])),_:1}),t[253]||(t[253]=e("ボディの処理方法を見ていきましょう。 以下の")),t[254]||(t[254]=n("code",null,"POST",-1)),t[255]||(t[255]=e("リクエストは、 ")),l(o,null,{default:r(()=>t[251]||(t[251]=[e("multipart/form-data")])),_:1}),t[256]||(t[256]=e(" タイプを使用して、説明付きのPNG画像を送信します。 "))]),l(s,{lang:"http",code:`POST http://localhost:3000/multipart
Content-Type: multipart/form-data; boundary=WebAppBoundary

--WebAppBoundary
Content-Disposition: form-data; name="description"
Content-Type: text/plain

Ktor logo
--WebAppBoundary
Content-Disposition: form-data; name="image"; filename="ktor_logo.png"
Content-Type: image/png

< ./ktor_logo.png
--WebAppBoundary--`}),n("table",G,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[257]||(t[257]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[259]||(t[259]=e(" Expressは、マルチパートデータをパースするために別のモジュールを必要とします。 以下の例では、 ")),l(o,null,{default:r(()=>t[258]||(t[258]=[e("multer")])),_:1}),t[260]||(t[260]=e(" がファイルをサーバーにアップロードするために使用されています。 "))]),l(s,{lang:"javascript",code:`const multer = require('multer')

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage});
app.post('/multipart', upload.single('image'), function (req, res, next) {
    let fileDescription = req.body["description"]
    let fileName = req.file.filename
    res.send(\`\${fileDescription} is uploaded to uploads/\${fileName}\`)
})`}),t[261]||(t[261]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[262]||(t[262]=[e("Ktor")])),_:1})]),n("td",null,[t[263]||(t[263]=n("p",null,[e(" Ktorでは、マルチパートリクエストの一部として送信されたファイルを受信する必要がある場合、 "),n("code",null,"receiveMultipart"),e("関数を呼び出し、必要に応じて各パートをループ処理します。 以下の例では、"),n("code",null,"PartData.FileItem"),e("がバイトストリームとしてファイルを受信するために使用されています。 ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/multipart") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart()
            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val fileBytes = part.provider().readRemaining().readByteArray()
                        File("uploads/$fileName").writeBytes(fileBytes)
                    }

                    else -> {}
                }
                part.dispose()
            }`}),t[264]||(t[264]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1})]),_:1}),l(i,{title:"ミドルウェアの作成",id:"middleware"},{default:r(()=>[t[276]||(t[276]=n("p",null," 最後に見ていくのは、サーバー機能を拡張できるミドルウェアの作成方法です。 以下の例は、ExpressとKtorを使用してリクエストロギングを実装する方法を示しています。 ",-1)),n("table",U,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[266]||(t[266]=[e("Express")])),_:1})]),n("td",null,[t[267]||(t[267]=n("p",null,[e(" Expressでは、ミドルウェアは"),n("code",null,"app.use"),e("を使用してアプリケーションにバインドされた関数です。 ")],-1)),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

const requestLogging = function (req, res, next) {
    let scheme = req.protocol
    let host = req.headers.host
    let url = req.url
    console.log(\`Request URL: \${scheme}://\${host}\${url}\`)
    next()
}

app.use(requestLogging)`}),t[268]||(t[268]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/8_middleware/app.js"},"8_middleware"),e(" プロジェクトを参照してください。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[269]||(t[269]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[271]||(t[271]=e(" Ktorは、")),l(u,{href:"/ktor/server-custom-plugins",summary:"独自のカスタムプラグインを作成する方法を学びます。"},{default:r(()=>t[270]||(t[270]=[e("カスタムプラグイン")])),_:1}),t[272]||(t[272]=e("を使用してその機能を拡張できます。 以下のコード例は、リクエストロギングを実装するために")),t[273]||(t[273]=n("code",null,"onCall",-1)),t[274]||(t[274]=e("を処理する方法を示しています。 "))]),l(s,{lang:"kotlin",code:`val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}`}),t[275]||(t[275]=n("p",null,[e(" 完全な例については、 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt"},"8_middleware"),e(" プロジェクトを参照してください。 ")],-1))])])])]),_:1}),l(i,{title:"次のステップ",id:"next"},{default:r(()=>[n("p",null,[t[278]||(t[278]=e(" このガイドでは、セッション管理、認可、データベース統合など、まだ多くのユースケースがカバーされていません。 これらの機能のほとんどについて、Ktorはアプリケーションにインストールして必要に応じて設定できる専用のプラグインを提供しています。 Ktorでの学習を続けるには、ステップバイステップのガイドとすぐに使えるサンプルが提供されている ")),l(o,null,{default:r(()=>t[277]||(t[277]=[n("a",{href:"https://ktor.io/learn/"},"Learnページ",-1)])),_:1}),t[279]||(t[279]=e(" にアクセスしてください。 "))])]),_:1})]),_:1})])}const _=q(w,[["render",W]]);export{Z as __pageData,_ as default};
