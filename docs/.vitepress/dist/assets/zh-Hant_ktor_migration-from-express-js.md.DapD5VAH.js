import{_ as q,C as p,c as S,o as j,G as l,w as r,j as n,a as e}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/migration-from-express-js.md","filePath":"zh-Hant/ktor/migration-from-express-js.md","lastUpdated":1755457140000}'),w={name:"zh-Hant/ktor/migration-from-express-js.md"},E={style:{}},T={style:{}},P={style:{}},K={style:{}},A={style:{}},C={style:{}},N={style:{}},R={style:{}},O={style:{}},F={style:{}},L={style:{}},H={style:{}},B={style:{}},D={style:{}},J={style:{}},M={style:{}},$={style:{}},G={style:{}},U={style:{}};function W(z,t,V,I,Y,X){const k=p("show-structure"),x=p("link-summary"),b=p("tldr"),o=p("control"),s=p("code-block"),g=p("list"),u=p("Links"),i=p("chapter"),d=p("Path"),v=p("tip"),a=p("tab"),f=p("tabs"),m=p("emphasis"),y=p("topic");return j(),S("div",null,[l(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"從 Express 遷移到 Ktor",id:"migration-from-express-js","help-id":"express-js;migrating-from-express-js"},{default:r(()=>[l(k,{for:"chapter",depth:"2"}),l(x,null,{default:r(()=>t[0]||(t[0]=[e("本指南將展示如何建立、執行及測試一個簡單的 Ktor 應用程式。")])),_:1}),l(b,null,{default:r(()=>t[1]||(t[1]=[n("p",null,[n("b",null,"程式碼範例"),e(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express"},"migrating-express"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor"},"migrating-express-ktor")],-1)])),_:1}),t[280]||(t[280]=n("p",null," 在本指南中，我們將探討如何在基本情境下將 Express 應用程式遷移到 Ktor：從產生應用程式、編寫您的第一個應用程式，到建立中介軟體以擴展應用程式功能。 ",-1)),l(i,{title:"產生應用程式",id:"generate"},{default:r(()=>[n("table",E,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[2]||(t[2]=[e("Express")])),_:1})]),n("td",null,[t[3]||(t[3]=n("p",null,[e(" 您可以使用 "),n("code",null,"express-generator"),e(" 工具產生一個新的 Express 應用程式： ")],-1)),l(s,{lang:"shell",code:"                        npx express-generator"})])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[4]||(t[4]=[e("Ktor")])),_:1})]),n("td",null,[t[12]||(t[12]=n("p",null," Ktor 提供以下方式來產生應用程式骨架： ",-1)),l(g,null,{default:r(()=>[t[7]||(t[7]=n("li",null,[n("p",null,[n("a",{href:"https://start.ktor.io/"},"Ktor 專案產生器"),e(" — 使用網頁版產生器。 ")])],-1)),n("li",null,[t[5]||(t[5]=n("p",null,[n("a",{href:"https://github.com/ktorio/ktor-cli"}," Ktor CLI 工具 "),e(" — 透過命令列介面使用 "),n("code",null,"ktor new"),e(" 命令產生 Ktor 專案： ")],-1)),l(s,{lang:"shell",code:"                                ktor new ktor-sample"})]),n("li",null,[t[6]||(t[6]=n("p",null,[n("a",{href:"https://www.npmjs.com/package/generator-ktor"}," Yeoman 產生器 "),e(" — 互動式配置專案設定並選擇所需的插件： ")],-1)),l(s,{lang:"shell",code:"                                yo ktor"})]),t[8]||(t[8]=n("li",null,[n("p",null,[n("a",{href:"https://ktor.io/idea/"},"IntelliJ IDEA Ultimate"),e(" — 使用內建的 Ktor 專案精靈。 ")])],-1))]),_:1}),n("p",null,[t[10]||(t[10]=e(" 有關詳細說明，請參閱")),l(u,{href:"/ktor/server-create-a-new-project",summary:"了解如何使用 Ktor 開啟、執行及測試伺服器應用程式。"},{default:r(()=>t[9]||(t[9]=[e("建立、開啟及執行新的 Ktor 專案")])),_:1}),t[11]||(t[11]=e("教學課程。 "))])])])])]),_:1}),l(i,{title:"Hello world",id:"hello"},{default:r(()=>[t[40]||(t[40]=n("p",null,[e(" 在本節中，我們將探討如何建立最簡單的伺服器應用程式，該應用程式接受 "),n("code",null,"GET"),e(" 請求並以預定義的純文字回應。 ")],-1)),n("table",T,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[13]||(t[13]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[15]||(t[15]=e(" 以下範例展示了 Express 應用程式，它啟動一個伺服器並在埠")),l(o,null,{default:r(()=>t[14]||(t[14]=[e("3000")])),_:1}),t[16]||(t[16]=e("監聽連線。 "))]),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[17]||(t[17]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/1_hello/app.js"},"1_hello"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[18]||(t[18]=[e("Ktor")])),_:1})]),n("td",null,[t[19]||(t[19]=n("p",null,[e(" 在 Ktor 中，您可以使用"),n("a",{href:"#embedded-server"},"embeddedServer"),e("函數在程式碼中配置伺服器參數並快速執行應用程式。 ")],-1)),l(s,{lang:"kotlin",code:`import io.ktor.server.engine.*
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
}`}),t[20]||(t[20]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt"},"1_hello"),e("專案。 ")],-1)),t[21]||(t[21]=n("p",null,[e(" 您也可以在採用 HOCON 或 YAML 格式的"),n("a",{href:"#engine-main"},"外部配置檔案"),e("中指定伺服器設定。 ")],-1))])])]),n("p",null,[t[25]||(t[25]=e(" 請注意，上述 Express 應用程式會新增")),l(o,null,{default:r(()=>t[22]||(t[22]=[e("Date")])),_:1}),t[26]||(t[26]=e("、")),l(o,null,{default:r(()=>t[23]||(t[23]=[e("X-Powered-By")])),_:1}),t[27]||(t[27]=e("和")),l(o,null,{default:r(()=>t[24]||(t[24]=[e("ETag")])),_:1}),t[28]||(t[28]=e("回應標頭，其外觀可能如下所示： "))]),l(s,{code:`            Date: Fri, 05 Aug 2022 06:30:48 GMT
            X-Powered-By: Express
            ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"`}),n("p",null,[t[34]||(t[34]=e(" 若要在 Ktor 中將預設的")),l(o,null,{default:r(()=>t[29]||(t[29]=[e("Server")])),_:1}),t[35]||(t[35]=e("和")),l(o,null,{default:r(()=>t[30]||(t[30]=[e("Date")])),_:1}),t[36]||(t[36]=e("標頭新增到每個回應中，您需要安裝")),l(u,{href:"/ktor/server-default-headers",summary:"所需依賴項：io.ktor:%artifact_name% 原生伺服器支援：✅"},{default:r(()=>t[31]||(t[31]=[e("DefaultHeaders")])),_:1}),t[37]||(t[37]=e("插件。")),l(u,{href:"/ktor/server-conditional-headers",summary:"所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅"},{default:r(()=>t[32]||(t[32]=[e("ConditionalHeaders")])),_:1}),t[38]||(t[38]=e("插件可用於配置")),l(o,null,{default:r(()=>t[33]||(t[33]=[e("Etag")])),_:1}),t[39]||(t[39]=e("回應標頭。 "))])]),_:1}),l(i,{title:"提供靜態內容",id:"static"},{default:r(()=>[n("p",null,[t[43]||(t[43]=e(" 在本節中，我們將了解如何在 Express 和 Ktor 中提供靜態檔案，例如圖像、CSS 檔案和 JavaScript 檔案。假設我們有一個")),l(d,null,{default:r(()=>t[41]||(t[41]=[e("public")])),_:1}),t[44]||(t[44]=e("資料夾，其中包含主要的")),l(d,null,{default:r(()=>t[42]||(t[42]=[e("index.html")])),_:1}),t[45]||(t[45]=e("頁面和一組連結的資產。 "))]),l(s,{code:`            public
            ├── index.html
            ├── ktor_logo.png
            ├── css
            │   └──styles.css
            └── js
                └── script.js`}),n("table",P,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[46]||(t[46]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[48]||(t[48]=e(" 在 Express 中，將資料夾名稱傳遞給")),l(o,null,{default:r(()=>t[47]||(t[47]=[e("express.static")])),_:1}),t[49]||(t[49]=e("函數。 "))]),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[50]||(t[50]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/2_static/app.js"},"2_static"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[51]||(t[51]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[55]||(t[55]=e(" 在 Ktor 中，使用")),t[56]||(t[56]=n("a",{href:"#folders"},[n("code",null,"staticFiles()")],-1)),t[57]||(t[57]=e("函數將對")),l(d,null,{default:r(()=>t[52]||(t[52]=[e("/")])),_:1}),t[58]||(t[58]=e("路徑的任何請求映射到")),l(d,null,{default:r(()=>t[53]||(t[53]=[e("public")])),_:1}),t[59]||(t[59]=e("實體資料夾。此函數支援從")),l(d,null,{default:r(()=>t[54]||(t[54]=[e("public")])),_:1}),t[60]||(t[60]=e("資料夾遞迴提供所有檔案。 "))]),l(s,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        staticFiles("", File("public"), "index.html")
    }
}`}),t[61]||(t[61]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt"},"2_static"),e("專案。 ")],-1))])])]),t[73]||(t[73]=n("p",null," 提供靜態內容時，Express 會新增一些回應標頭，其外觀可能如下所示： ",-1)),l(s,{code:`            Accept-Ranges: bytes
            Cache-Control: public, max-age=0
            ETag: W/"181-1823feafeb1"
            Last-Modified: Wed, 27 Jul 2022 13:49:01 GMT`}),t[74]||(t[74]=n("p",null," 若要在 Ktor 中管理這些標頭，您需要安裝以下插件： ",-1)),l(g,null,{default:r(()=>[n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[62]||(t[62]=[e("Accept-Ranges")])),_:1}),t[64]||(t[64]=e(" : ")),l(u,{href:"/ktor/server-partial-content",summary:"所需依賴項：io.ktor:%artifact_name% 伺服器範例：download-file，客戶端範例：client-download-file-range 原生伺服器支援：✅"},{default:r(()=>t[63]||(t[63]=[e("PartialContent")])),_:1})])]),n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[65]||(t[65]=[e("Cache-Control")])),_:1}),t[67]||(t[67]=e(" : ")),l(u,{href:"/ktor/server-caching-headers",summary:"所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅"},{default:r(()=>t[66]||(t[66]=[e("CachingHeaders")])),_:1})])]),n("li",null,[n("p",null,[l(o,null,{default:r(()=>t[68]||(t[68]=[e("ETag")])),_:1}),t[71]||(t[71]=e(" 和 ")),l(o,null,{default:r(()=>t[69]||(t[69]=[e("Last-Modified")])),_:1}),t[72]||(t[72]=e(" : ")),l(u,{href:"/ktor/server-conditional-headers",summary:"所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅"},{default:r(()=>t[70]||(t[70]=[e("ConditionalHeaders")])),_:1})])])]),_:1})]),_:1}),l(i,{title:"路由",id:"routing"},{default:r(()=>[n("p",null,[l(u,{href:"/ktor/server-routing",summary:"路由是伺服器應用程式中處理傳入請求的核心插件。"},{default:r(()=>t[75]||(t[75]=[e("路由")])),_:1}),t[77]||(t[77]=e("允許處理對特定端點的傳入請求，該端點由特定的 HTTP 請求方法（例如 ")),t[78]||(t[78]=n("code",null,"GET",-1)),t[79]||(t[79]=e("、")),t[80]||(t[80]=n("code",null,"POST",-1)),t[81]||(t[81]=e(" 等）和路徑定義。以下範例展示了如何處理對")),l(d,null,{default:r(()=>t[76]||(t[76]=[e("/")])),_:1}),t[82]||(t[82]=e("路徑的 ")),t[83]||(t[83]=n("code",null,"GET",-1)),t[84]||(t[84]=e(" 和 ")),t[85]||(t[85]=n("code",null,"POST",-1)),t[86]||(t[86]=e(" 請求。 "))]),n("table",K,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[87]||(t[87]=[e("Express")])),_:1})]),n("td",null,[l(s,{lang:"javascript",code:`app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
})`}),t[88]||(t[88]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[89]||(t[89]=[e("Ktor")])),_:1})]),n("td",null,[l(s,{lang:"kotlin",code:`    routing {
        get("/") {
            call.respondText("GET request to the homepage")
        }
        post("/") {
            call.respondText("POST request to the homepage")
        }
    }`}),l(v,null,{default:r(()=>t[90]||(t[90]=[n("p",null,[e(" 請參閱"),n("a",{href:"#receive-request"},"接收請求"),e("以了解如何接收 "),n("code",null,"POST"),e("、"),n("code",null,"PUT"),e(" 或 "),n("code",null,"PATCH"),e(" 請求的請求主體。 ")],-1)])),_:1}),t[91]||(t[91]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e("專案。 ")],-1))])])]),t[123]||(t[123]=n("p",null," 以下範例展示了如何按路徑分組路由處理器。 ",-1)),n("table",A,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[92]||(t[92]=[e("Express")])),_:1})]),n("td",null,[t[93]||(t[93]=n("p",null,[e(" 在 Express 中，您可以使用 "),n("code",null,"app.route()"),e(" 為路由路徑建立可串聯的路由處理器。 ")],-1)),l(s,{lang:"javascript",code:`app.route('/book')
    .get((req, res) => {
        res.send('Get a random book')
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    })`}),t[94]||(t[94]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[95]||(t[95]=[e("Ktor")])),_:1})]),n("td",null,[t[96]||(t[96]=n("p",null,[e(" Ktor 提供了一個 "),n("code",null,"route"),e(" 函數，您可以透過它定義路徑，然後將該路徑的動詞作為巢狀函數放置。 ")],-1)),l(s,{lang:"kotlin",code:`    routing {
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
    }`}),t[97]||(t[97]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e("專案。 ")],-1))])])]),t[124]||(t[124]=n("p",null," 這兩個框架都允許您將相關路由分組到單一檔案中。 ",-1)),n("table",C,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[98]||(t[98]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[101]||(t[101]=e(" Express 提供了 ")),t[102]||(t[102]=n("code",null,"express.Router",-1)),t[103]||(t[103]=e(" 類別來建立可掛載的路由處理器。假設我們的應用程式目錄中有一個")),l(d,null,{default:r(()=>t[99]||(t[99]=[e("birds.js")])),_:1}),t[104]||(t[104]=e("路由檔案。這個路由模組可以按照")),l(d,null,{default:r(()=>t[100]||(t[100]=[e("app.js")])),_:1}),t[105]||(t[105]=e("中的方式載入到應用程式中： "))]),l(f,null,{default:r(()=>[l(a,{title:"birds.js"},{default:r(()=>[l(s,{lang:"javascript",code:`const express = require('express')
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
})`})]),_:1})]),_:1}),t[106]||(t[106]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[107]||(t[107]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[110]||(t[110]=e(" 在 Ktor 中，一種常見模式是使用 ")),t[111]||(t[111]=n("code",null,"Routing",-1)),t[112]||(t[112]=e(" 類型上的擴展函數來定義實際路由。以下範例（")),l(d,null,{default:r(()=>t[108]||(t[108]=[e("Birds.kt")])),_:1}),t[113]||(t[113]=e("）定義了 ")),t[114]||(t[114]=n("code",null,"birdsRoutes",-1)),t[115]||(t[115]=e(" 擴展函數。您可以透過在 ")),t[116]||(t[116]=n("code",null,"routing",-1)),t[117]||(t[117]=e(" 區塊內呼叫此函數，在應用程式（")),l(d,null,{default:r(()=>t[109]||(t[109]=[e("Application.kt")])),_:1}),t[118]||(t[118]=e("）中包含相應的路由： "))]),l(f,null,{default:r(()=>[l(a,{title:"Birds.kt",id:"birds-kt"},{default:r(()=>[l(s,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`})]),_:1})]),_:1}),t[119]||(t[119]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),e("專案。 ")],-1))])])]),n("p",null,[t[121]||(t[121]=e(" 除了將 URL 路徑指定為字串之外，Ktor 還包含了實作")),l(u,{href:"/ktor/server-resources",summary:"Resources 插件允許您實作型別安全的路由。"},{default:r(()=>t[120]||(t[120]=[e("型別安全路由")])),_:1}),t[122]||(t[122]=e("的功能。 "))])]),_:1}),l(i,{title:"路由和查詢參數",id:"route-query-param"},{default:r(()=>[t[153]||(t[153]=n("p",null," 本節將向我們展示如何存取路由和查詢參數。 ",-1)),t[154]||(t[154]=n("p",null," 路由（或路徑）參數是一個命名的 URL 片段，用於捕獲其在 URL 中指定位置的值。 ",-1)),n("table",N,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[125]||(t[125]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[128]||(t[128]=e(" 若要存取 Express 中的路由參數，您可以使用 ")),t[129]||(t[129]=n("code",null,"Request.params",-1)),t[130]||(t[130]=e("。例如，以下程式碼片段中的 ")),t[131]||(t[131]=n("code",null,'req.parameters["login"]',-1)),t[132]||(t[132]=e(" 將針對")),l(d,null,{default:r(()=>t[126]||(t[126]=[e("/user/admin")])),_:1}),t[133]||(t[133]=e("路徑回傳")),l(m,null,{default:r(()=>t[127]||(t[127]=[e("admin")])),_:1}),t[134]||(t[134]=e("： "))]),l(s,{lang:"javascript",code:`app.get('/user/:login', (req, res) => {
    if (req.params['login'] === 'admin') {
        res.send('You are logged in as Admin')
    } else {
        res.send('You are logged in as Guest')
    }
})`}),t[135]||(t[135]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[136]||(t[136]=[e("Ktor")])),_:1})]),n("td",null,[t[137]||(t[137]=n("p",null,[e(" 在 Ktor 中，路由參數使用 "),n("code",null,"{param}"),e(" 語法定義。您可以使用 "),n("code",null,"call.parameters"),e(" 在路由處理器中存取路由參數： ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        get("/user/{login}") {
            if (call.parameters["login"] == "admin") {
                call.respondText("You are logged in as Admin")
            } else {
                call.respondText("You are logged in as Guest")
            }
        }
    }`}),t[138]||(t[138]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),e("專案。 ")],-1))])])]),t[155]||(t[155]=n("p",null," 下表比較了如何存取查詢字串的參數。 ",-1)),n("table",R,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[139]||(t[139]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[142]||(t[142]=e(" 若要存取 Express 中的路由參數，您可以使用 ")),t[143]||(t[143]=n("code",null,"Request.params",-1)),t[144]||(t[144]=e("。例如，以下程式碼片段中的 ")),t[145]||(t[145]=n("code",null,'req.parameters["login"]',-1)),t[146]||(t[146]=e(" 將針對")),l(d,null,{default:r(()=>t[140]||(t[140]=[e("/user/admin")])),_:1}),t[147]||(t[147]=e("路徑回傳")),l(m,null,{default:r(()=>t[141]||(t[141]=[e("admin")])),_:1}),t[148]||(t[148]=e("： "))]),l(s,{lang:"javascript",code:`app.get('/products', (req, res) => {
    if (req.query['price'] === 'asc') {
        res.send('Products from the lowest price to the highest')
    }
})`}),t[149]||(t[149]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[150]||(t[150]=[e("Ktor")])),_:1})]),n("td",null,[t[151]||(t[151]=n("p",null,[e(" 在 Ktor 中，路由參數使用 "),n("code",null,"{param}"),e(" 語法定義。您可以使用 "),n("code",null,"call.parameters"),e(" 在路由處理器中存取路由參數： ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        get("/products") {
            if (call.request.queryParameters["price"] == "asc") {
                call.respondText("Products from the lowest price to the highest")
            }
        }
    }`}),t[152]||(t[152]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"傳送回應",id:"send-response"},{default:r(()=>[t[191]||(t[191]=n("p",null," 在前面的章節中，我們已經了解如何以純文字內容回應。現在讓我們看看如何傳送 JSON、檔案和重新導向回應。 ",-1)),l(i,{title:"JSON",id:"send-json"},{default:r(()=>[n("table",O,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[156]||(t[156]=[e("Express")])),_:1})]),n("td",null,[t[157]||(t[157]=n("p",null,[e(" 若要在 Express 中傳送具有適當內容類型 (content type) 的 JSON 回應，請呼叫 "),n("code",null,"res.json"),e(" 函數： ")],-1)),l(s,{lang:"javascript",code:`const car = {type:"Fiat", model:"500", color:"white"};
app.get('/json', (req, res) => {
    res.json(car)
})`}),t[158]||(t[158]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[159]||(t[159]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[161]||(t[161]=e(" 在 Ktor 中，您需要安裝")),l(u,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有兩個目的：協商客戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:r(()=>t[160]||(t[160]=[e("ContentNegotiation")])),_:1}),t[162]||(t[162]=e("插件並配置 JSON 序列化器： "))]),l(s,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[163]||(t[163]=n("p",null,[e(" 若要將資料序列化為 JSON，您需要建立一個帶有 "),n("code",null,"@Serializable"),e(" 註解的資料類別： ")],-1)),l(s,{lang:"kotlin",code:`@Serializable
data class Car(val type: String, val model: String, val color: String)`}),t[164]||(t[164]=n("p",null,[e(" 然後，您可以使用 "),n("code",null,"call.respond"),e(" 在回應中傳送此類別的物件： ")],-1)),l(s,{lang:"kotlin",code:`        get("/json") {
            call.respond(Car("Fiat", "500", "white"))
        }`}),t[165]||(t[165]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"檔案",id:"send-file"},{default:r(()=>[n("table",F,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[166]||(t[166]=[e("Express")])),_:1})]),n("td",null,[t[167]||(t[167]=n("p",null,[e(" 若要在 Express 中回應一個檔案，請使用 "),n("code",null,"res.sendFile"),e("： ")],-1)),l(s,{lang:"javascript",code:`const path = require("path")

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'ktor_logo.png'))
})`}),t[168]||(t[168]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[169]||(t[169]=[e("Ktor")])),_:1})]),n("td",null,[t[170]||(t[170]=n("p",null,[e(" Ktor 提供了 "),n("code",null,"call.respondFile"),e(" 函數，用於向客戶端傳送檔案： ")],-1)),l(s,{lang:"kotlin",code:`        get("/file") {
            val file = File("public/ktor_logo.png")
            call.respondFile(file)
        }`}),t[171]||(t[171]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e("專案。 ")],-1))])])]),n("p",null,[t[174]||(t[174]=e(" Express 應用程式在回應檔案時會新增")),l(o,null,{default:r(()=>t[172]||(t[172]=[e("Accept-Ranges")])),_:1}),t[175]||(t[175]=e("HTTP 回應標頭。伺服器使用此標頭來宣傳其支援客戶端對檔案下載的部分請求。在 Ktor 中，您需要安裝")),l(u,{href:"/ktor/server-partial-content",summary:"所需依賴項：io.ktor:%artifact_name% 伺服器範例：download-file，客戶端範例：client-download-file-range 原生伺服器支援：✅"},{default:r(()=>t[173]||(t[173]=[e("PartialContent")])),_:1}),t[176]||(t[176]=e("插件以支援部分請求。 "))])]),_:1}),l(i,{title:"檔案附件",id:"send-file-attachment"},{default:r(()=>[n("table",L,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[177]||(t[177]=[e("Express")])),_:1})]),n("td",null,[t[178]||(t[178]=n("p",null,[n("code",null,"res.download"),e(" 函數將指定檔案作為附件傳輸： ")],-1)),l(s,{lang:"javascript",code:`app.get('/file-attachment', (req, res) => {
    res.download("ktor_logo.png")
})`}),t[179]||(t[179]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[180]||(t[180]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[182]||(t[182]=e(" 在 Ktor 中，您需要手動配置")),l(o,null,{default:r(()=>t[181]||(t[181]=[e("Content-Disposition")])),_:1}),t[183]||(t[183]=e("標頭，以將檔案作為附件傳輸： "))]),l(s,{lang:"kotlin",code:`        get("/file-attachment") {
            val file = File("public/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }`}),t[184]||(t[184]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"重新導向",id:"redirect"},{default:r(()=>[n("table",H,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[185]||(t[185]=[e("Express")])),_:1})]),n("td",null,[t[186]||(t[186]=n("p",null,[e(" 若要在 Express 中產生重新導向回應，請呼叫 "),n("code",null,"redirect"),e(" 函數： ")],-1)),l(s,{lang:"javascript",code:`app.get('/old', (req, res) => {
    res.redirect(301, "moved")
})

app.get('/moved', (req, res) => {
    res.send('Moved resource')
})`}),t[187]||(t[187]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[188]||(t[188]=[e("Ktor")])),_:1})]),n("td",null,[t[189]||(t[189]=n("p",null,[e(" 在 Ktor 中，使用 "),n("code",null,"respondRedirect"),e(" 傳送重新導向回應： ")],-1)),l(s,{lang:"kotlin",code:`        get("/old") {
            call.respondRedirect("/moved", permanent = true)
        }
        get("/moved") {
            call.respondText("Moved resource")
        }`}),t[190]||(t[190]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),e("專案。 ")],-1))])])])]),_:1})]),_:1}),l(i,{title:"範本",id:"templates"},{default:r(()=>[t[207]||(t[207]=n("p",null," Express 和 Ktor 都支援使用範本引擎來處理視圖。 ",-1)),n("table",B,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[192]||(t[192]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[194]||(t[194]=e(" 假設我們在")),l(d,null,{default:r(()=>t[193]||(t[193]=[e("views")])),_:1}),t[195]||(t[195]=e("資料夾中有以下 Pug 範本： "))]),l(s,{code:`html
  head
    title= title
  body
    h1= message`}),t[196]||(t[196]=n("p",null,[e(" 若要用此範本回應，請呼叫 "),n("code",null,"res.render"),e("： ")],-1)),l(s,{lang:"javascript",code:`app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})`}),t[197]||(t[197]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/6_templates/app.js"},"6_templates"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[198]||(t[198]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[200]||(t[200]=e(" Ktor 支援多種")),l(u,{href:"/ktor/server-templating",summary:"了解如何使用 HTML/CSS 或 JVM 範本引擎建構視圖。"},{default:r(()=>t[199]||(t[199]=[e("JVM 範本引擎")])),_:1}),t[201]||(t[201]=e("，例如 FreeMarker、Velocity 等。例如，如果您需要使用位於應用程式資源中的 FreeMarker 範本進行回應，請安裝並配置 ")),t[202]||(t[202]=n("code",null,"FreeMarker",-1)),t[203]||(t[203]=e(" 插件，然後使用 ")),t[204]||(t[204]=n("code",null,"call.respond",-1)),t[205]||(t[205]=e(" 傳送範本： "))]),l(s,{lang:"kotlin",code:`fun Application.module() {
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

data class Article(val title: String, val message: String)`}),t[206]||(t[206]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt"},"6_templates"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"接收請求",id:"receive-request"},{default:r(()=>[t[265]||(t[265]=n("p",null," 本節將展示如何接收不同格式的請求主體。 ",-1)),l(i,{title:"原始文字",id:"receive-raw-text"},{default:r(()=>[t[215]||(t[215]=n("p",null,[e(" 以下 "),n("code",null,"POST"),e(" 請求向伺服器傳送文字資料： ")],-1)),l(s,{lang:"http",code:`POST http://0.0.0.0:3000/text
Content-Type: text/plain

Hello, world!`}),t[216]||(t[216]=n("p",null," 讓我們看看如何在伺服器端將此請求的主體作為純文字接收。 ",-1)),n("table",D,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[208]||(t[208]=[e("Express")])),_:1})]),n("td",null,[t[209]||(t[209]=n("p",null,[e(" 若要在 Express 中解析傳入的請求主體，您需要新增 "),n("code",null,"body-parser"),e("： ")],-1)),l(s,{lang:"javascript",code:"const bodyParser = require('body-parser')"}),t[210]||(t[210]=n("p",null,[e(" 在 "),n("code",null,"post"),e(" 處理器中，您需要傳遞文字解析器（"),n("code",null,"bodyParser.text"),e("）。請求主體將在 "),n("code",null,"req.body"),e(" 屬性下可用： ")],-1)),l(s,{lang:"javascript",code:`app.post('/text', bodyParser.text(), (req, res) => {
    let text = req.body
    res.send(text)
})`}),t[211]||(t[211]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[212]||(t[212]=[e("Ktor")])),_:1})]),n("td",null,[t[213]||(t[213]=n("p",null,[e(" 在 Ktor 中，您可以使用 "),n("code",null,"call.receiveText"),e(" 將主體作為文字接收： ")],-1)),l(s,{lang:"kotlin",code:`    routing {
        post("/text") {
            val text = call.receiveText()
            call.respondText(text)`}),t[214]||(t[214]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"JSON",id:"receive-json"},{default:r(()=>[t[229]||(t[229]=n("p",null,[e(" 在本節中，我們將探討如何接收 JSON 主體。以下範例展示了一個 "),n("code",null,"POST"),e(" 請求，其主體中包含一個 JSON 物件： ")],-1)),l(s,{lang:"http",code:`POST http://0.0.0.0:3000/json
Content-Type: application/json

{
  "type": "Fiat",
  "model" : "500",
  "color": "white"
}`}),n("table",J,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[217]||(t[217]=[e("Express")])),_:1})]),n("td",null,[t[218]||(t[218]=n("p",null,[e(" 若要在 Express 中接收 JSON，請使用 "),n("code",null,"bodyParser.json"),e("： ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/json', bodyParser.json(), (req, res) => {
    let car = req.body
    res.send(car)
})`}),t[219]||(t[219]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[220]||(t[220]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[222]||(t[222]=e(" 在 Ktor 中，您需要安裝")),l(u,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有兩個目的：協商客戶端和伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。"},{default:r(()=>t[221]||(t[221]=[e("ContentNegotiation")])),_:1}),t[223]||(t[223]=e("插件 並配置 ")),t[224]||(t[224]=n("code",null,"Json",-1)),t[225]||(t[225]=e(" 序列化器： "))]),l(s,{lang:"kotlin",code:`fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })`}),t[226]||(t[226]=n("p",null," 若要將接收到的資料反序列化為物件，您需要建立一個資料類別： ",-1)),l(s,{lang:"kotlin",code:"@Serializable"}),t[227]||(t[227]=n("p",null,[e(" 然後，使用接受此資料類別作為參數的 "),n("code",null,"receive"),e(" 方法： ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/json") {
            val car = call.receive<Car>()
            call.respond(car)`}),t[228]||(t[228]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"URL 編碼",id:"receive-url-encoded"},{default:r(()=>[n("p",null,[t[231]||(t[231]=e(" 現在讓我們看看如何接收使用")),l(o,null,{default:r(()=>t[230]||(t[230]=[e("application/x-www-form-urlencoded")])),_:1}),t[232]||(t[232]=e("類型傳送的表單資料。以下程式碼片段展示了一個包含表單資料的 ")),t[233]||(t[233]=n("code",null,"POST",-1)),t[234]||(t[234]=e(" 請求範例： "))]),l(s,{lang:"http",code:`POST http://localhost:3000/urlencoded
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar`}),n("table",M,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[235]||(t[235]=[e("Express")])),_:1})]),n("td",null,[t[236]||(t[236]=n("p",null,[e(" 與純文字和 JSON 一樣，Express 需要 "),n("code",null,"body-parser"),e("。您需要將解析器類型設定為 "),n("code",null,"bodyParser.urlencoded"),e("： ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/urlencoded', bodyParser.urlencoded({extended: true}), (req, res) => {
    let user = req.body
    res.send(\`The \${user["username"]} account is created\`)
})`}),t[237]||(t[237]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[238]||(t[238]=[e("Ktor")])),_:1})]),n("td",null,[t[239]||(t[239]=n("p",null,[e(" 在 Ktor 中，使用 "),n("code",null,"call.receiveParameters"),e(" 函數： ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/urlencoded") {
            val formParameters = call.receiveParameters()
            val username = formParameters["username"].toString()
            call.respondText("The '$username' account is created")`}),t[240]||(t[240]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"原始資料",id:"receive-raw-data"},{default:r(()=>[n("p",null,[t[242]||(t[242]=e(" 下一個用例是處理二進位資料。以下請求將帶有")),l(o,null,{default:r(()=>t[241]||(t[241]=[e("application/octet-stream")])),_:1}),t[243]||(t[243]=e("類型的 PNG 圖像傳送到伺服器： "))]),l(s,{lang:"http",code:`POST http://localhost:3000/raw
Content-Type: application/octet-stream

< ./ktor_logo.png`}),n("table",$,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[244]||(t[244]=[e("Express")])),_:1})]),n("td",null,[t[245]||(t[245]=n("p",null,[e(" 若要在 Express 中處理二進位資料，請將解析器類型設定為 "),n("code",null,"raw"),e("： ")],-1)),l(s,{lang:"javascript",code:`const bodyParser = require('body-parser')
const fs = require('fs')

app.post('/raw', bodyParser.raw({type: () => true}), (req, res) => {
    let rawBody = req.body
    fs.createWriteStream('./uploads/ktor_logo.png').write(rawBody)
    res.send('A file is uploaded')
})`}),t[246]||(t[246]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[247]||(t[247]=[e("Ktor")])),_:1})]),n("td",null,[t[248]||(t[248]=n("p",null,[e(" Ktor 提供了 "),n("code",null,"ByteReadChannel"),e(" 和 "),n("code",null,"ByteWriteChannel"),e("，用於非同步讀取/寫入位元組序列： ")],-1)),l(s,{lang:"kotlin",code:`        }
        post("/raw") {
            val file = File("uploads/ktor_logo.png")
            call.receiveChannel().copyAndClose(file.writeChannel())
            call.respondText("A file is uploaded")`}),t[249]||(t[249]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"多部分",id:"receive-multipart"},{default:r(()=>[n("p",null,[t[252]||(t[252]=e(" 在最後一節中，讓我們看看如何處理")),l(m,null,{default:r(()=>t[250]||(t[250]=[e("多部分")])),_:1}),t[253]||(t[253]=e("主體。以下 ")),t[254]||(t[254]=n("code",null,"POST",-1)),t[255]||(t[255]=e(" 請求使用")),l(o,null,{default:r(()=>t[251]||(t[251]=[e("multipart/form-data")])),_:1}),t[256]||(t[256]=e("類型傳送帶有描述的 PNG 圖像： "))]),l(s,{lang:"http",code:`POST http://localhost:3000/multipart
Content-Type: multipart/form-data; boundary=WebAppBoundary

--WebAppBoundary
Content-Disposition: form-data; name="description"
Content-Type: text/plain

Ktor logo
--WebAppBoundary
Content-Disposition: form-data; name="image"; filename="ktor_logo.png"
Content-Type: image/png

< ./ktor_logo.png
--WebAppBoundary--`}),n("table",G,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[257]||(t[257]=[e("Express")])),_:1})]),n("td",null,[n("p",null,[t[259]||(t[259]=e(" Express 需要一個單獨的模組來解析多部分資料。在以下範例中，")),l(o,null,{default:r(()=>t[258]||(t[258]=[e("multer")])),_:1}),t[260]||(t[260]=e("用於將檔案上傳到伺服器： "))]),l(s,{lang:"javascript",code:`const multer = require('multer')

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
})`}),t[261]||(t[261]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[262]||(t[262]=[e("Ktor")])),_:1})]),n("td",null,[t[263]||(t[263]=n("p",null,[e(" 在 Ktor 中，如果您需要接收作為多部分請求一部分傳送的檔案，請呼叫 "),n("code",null,"receiveMultipart"),e(" 函數，然後根據需要迴圈遍歷每個部分。在以下範例中，使用 "),n("code",null,"PartData.FileItem"),e(" 將檔案作為位元組流接收： ")],-1)),l(s,{lang:"kotlin",code:`        }
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
            }`}),t[264]||(t[264]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),e("專案。 ")],-1))])])])]),_:1})]),_:1}),l(i,{title:"建立中介軟體",id:"middleware"},{default:r(()=>[t[276]||(t[276]=n("p",null," 我們將探討的最後一件事是如何建立中介軟體，它允許您擴展伺服器功能。以下範例展示了如何使用 Express 和 Ktor 實作請求日誌記錄。 ",-1)),n("table",U,[n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[266]||(t[266]=[e("Express")])),_:1})]),n("td",null,[t[267]||(t[267]=n("p",null,[e(" 在 Express 中，中介軟體是使用 "),n("code",null,"app.use"),e(" 繫結到應用程式的函數： ")],-1)),l(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

const requestLogging = function (req, res, next) {
    let scheme = req.protocol
    let host = req.headers.host
    let url = req.url
    console.log(\`Request URL: \${scheme}://\${host}\${url}\`)
    next()
}

app.use(requestLogging)`}),t[268]||(t[268]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/8_middleware/app.js"},"8_middleware"),e("專案。 ")],-1))])]),n("tr",null,[n("td",null,[l(o,null,{default:r(()=>t[269]||(t[269]=[e("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[271]||(t[271]=e(" Ktor 允許您使用")),l(u,{href:"/ktor/server-custom-plugins",summary:"了解如何建立您自己的自訂插件。"},{default:r(()=>t[270]||(t[270]=[e("自訂插件")])),_:1}),t[272]||(t[272]=e("擴展其功能。以下程式碼範例展示了如何處理 ")),t[273]||(t[273]=n("code",null,"onCall",-1)),t[274]||(t[274]=e(" 以實作請求日誌記錄： "))]),l(s,{lang:"kotlin",code:`val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}`}),t[275]||(t[275]=n("p",null,[e(" 有關完整範例，請參閱"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt"},"8_middleware"),e("專案。 ")],-1))])])])]),_:1}),l(i,{title:"下一步",id:"next"},{default:r(()=>[n("p",null,[t[278]||(t[278]=e(" 本指南中仍有許多未涵蓋的用例，例如會話管理、授權、資料庫整合等等。對於其中大多數功能，Ktor 提供了專用插件，這些插件可以安裝在應用程式中並根據需要進行配置。要繼續您的 Ktor 之旅，請訪問")),l(o,null,{default:r(()=>t[277]||(t[277]=[n("a",{href:"https://ktor.io/learn/"},"學習頁面",-1)])),_:1}),t[279]||(t[279]=e("，其中提供了一系列逐步指南和可立即使用的範例。 "))])]),_:1})]),_:1})])}const _=q(w,[["render",W]]);export{Z as __pageData,_ as default};
