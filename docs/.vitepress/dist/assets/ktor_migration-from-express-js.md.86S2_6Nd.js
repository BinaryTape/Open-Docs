import{_ as q,C as p,c as S,o as j,G as e,w as r,j as n,a as l}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/migration-from-express-js.md","filePath":"ktor/migration-from-express-js.md","lastUpdated":1755457140000}'),w={name:"ktor/migration-from-express-js.md"},E={style:{}},T={style:{}},P={style:{}},K={style:{}},A={style:{}},C={style:{}},N={style:{}},R={style:{}},O={style:{}},F={style:{}},L={style:{}},B={style:{}},D={style:{}},H={style:{}},M={style:{}},J={style:{}},$={style:{}},G={style:{}},U={style:{}};function W(V,t,I,Y,z,X){const k=p("show-structure"),x=p("link-summary"),b=p("tldr"),o=p("control"),s=p("code-block"),g=p("list"),u=p("Links"),i=p("chapter"),d=p("Path"),v=p("tip"),a=p("tab"),f=p("tabs"),m=p("emphasis"),y=p("topic");return j(),S("div",null,[e(y,{"xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",title:"从 Express 迁移到 Ktor",id:"migration-from-express-js","help-id":"express-js;migrating-from-express-js"},{default:r(()=>[e(k,{for:"chapter",depth:"2"}),e(x,null,{default:r(()=>t[0]||(t[0]=[l("本指南展示了如何创建、运行和测试一个简单的 Ktor 应用程序。")])),_:1}),e(b,null,{default:r(()=>t[1]||(t[1]=[n("p",null,[n("b",null,"代码示例"),l(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express"},"migrating-express"),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor"},"migrating-express-ktor")],-1)])),_:1}),t[280]||(t[280]=n("p",null," 在本指南中，我们将探讨在基本场景下如何将 Express 应用程序迁移到 Ktor： 从生成应用程序和编写第一个应用程序，到创建中间件以扩展应用程序功能。 ",-1)),e(i,{title:"生成应用",id:"generate"},{default:r(()=>[n("table",E,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[2]||(t[2]=[l("Express")])),_:1})]),n("td",null,[t[3]||(t[3]=n("p",null,[l(" 您可以使用 "),n("code",null,"express-generator"),l(" 工具生成一个新的 Express 应用程序： ")],-1)),e(s,{lang:"shell",code:"                        npx express-generator"})])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[4]||(t[4]=[l("Ktor")])),_:1})]),n("td",null,[t[12]||(t[12]=n("p",null," Ktor 提供了以下方式来生成应用程序骨架： ",-1)),e(g,null,{default:r(()=>[t[7]||(t[7]=n("li",null,[n("p",null,[n("a",{href:"https://start.ktor.io/"},"Ktor 项目生成器"),l(" — 使用基于 Web 的生成器。 ")])],-1)),n("li",null,[t[5]||(t[5]=n("p",null,[n("a",{href:"https://github.com/ktorio/ktor-cli"}," Ktor CLI 工具 "),l(" — 使用 "),n("code",null,"ktor new"),l(" 命令通过命令行界面生成 Ktor 项目： ")],-1)),e(s,{lang:"shell",code:"                                ktor new ktor-sample"})]),n("li",null,[t[6]||(t[6]=n("p",null,[n("a",{href:"https://www.npmjs.com/package/generator-ktor"}," Yeoman 生成器 "),l(" — 交互式配置项目设置并选择所需的插件： ")],-1)),e(s,{lang:"shell",code:"                                yo ktor"})]),t[8]||(t[8]=n("li",null,[n("p",null,[n("a",{href:"https://ktor.io/idea/"},"IntelliJ IDEA Ultimate"),l(" — 使用内置的 Ktor 项目向导。 ")])],-1))]),_:1}),n("p",null,[t[10]||(t[10]=l(" 有关详细说明，请参阅")),e(u,{href:"/ktor/server-create-a-new-project",summary:"了解如何使用 Ktor 打开、运行和测试服务器应用程序。"},{default:r(()=>t[9]||(t[9]=[l("创建、打开和运行新的 Ktor 项目")])),_:1}),t[11]||(t[11]=l("教程。 "))])])])])]),_:1}),e(i,{title:"Hello world",id:"hello"},{default:r(()=>[t[40]||(t[40]=n("p",null,[l(" 在本节中，我们将介绍如何创建最简单的服务器应用程序，该应用程序接受 "),n("code",null,"GET"),l(" 请求并响应预定义的纯文本。 ")],-1)),n("table",T,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[13]||(t[13]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[15]||(t[15]=l(" 以下示例展示了 Express 应用程序如何启动服务器并监听 ")),e(o,null,{default:r(()=>t[14]||(t[14]=[l("3000")])),_:1}),t[16]||(t[16]=l(" 端口的连接。 "))]),e(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[17]||(t[17]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/1_hello/app.js"},"1_hello"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[18]||(t[18]=[l("Ktor")])),_:1})]),n("td",null,[t[19]||(t[19]=n("p",null,[l(" 在 Ktor 中，您可以使用 "),n("a",{href:"#embedded-server"},"embeddedServer"),l(" 函数在代码中配置服务器参数并快速运行应用程序。 ")],-1)),e(s,{lang:"kotlin",code:`import io.ktor.server.engine.*
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
}`}),t[20]||(t[20]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt"},"1_hello"),l(" 项目。 ")],-1)),t[21]||(t[21]=n("p",null,[l(" 您还可以在使用 HOCON 或 YAML 格式的"),n("a",{href:"#engine-main"},"外部配置文件"),l("中指定服务器设置。 ")],-1))])])]),n("p",null,[t[25]||(t[25]=l(" 请注意，上述 Express 应用程序添加了 ")),e(o,null,{default:r(()=>t[22]||(t[22]=[l("Date")])),_:1}),t[26]||(t[26]=l("、")),e(o,null,{default:r(()=>t[23]||(t[23]=[l("X-Powered-By")])),_:1}),t[27]||(t[27]=l(" 和 ")),e(o,null,{default:r(()=>t[24]||(t[24]=[l("ETag")])),_:1}),t[28]||(t[28]=l(" 响应头部，它们可能如下所示： "))]),e(s,{code:`            Date: Fri, 05 Aug 2022 06:30:48 GMT
            X-Powered-By: Express
            ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"`}),n("p",null,[t[34]||(t[34]=l(" 要在 Ktor 中为每个响应添加默认的 ")),e(o,null,{default:r(()=>t[29]||(t[29]=[l("Server")])),_:1}),t[35]||(t[35]=l(" 和 ")),e(o,null,{default:r(()=>t[30]||(t[30]=[l("Date")])),_:1}),t[36]||(t[36]=l(" 头部，您需要安装 ")),e(u,{href:"/ktor/server-default-headers",summary:"所需依赖项：io.ktor:%artifact_name% 原生服务器支持：✅"},{default:r(()=>t[31]||(t[31]=[l("DefaultHeaders")])),_:1}),t[37]||(t[37]=l(" 插件。 ")),e(u,{href:"/ktor/server-conditional-headers",summary:"所需依赖项：io.ktor:%artifact_name% 代码示例：%example_name% 原生服务器支持：✅"},{default:r(()=>t[32]||(t[32]=[l("ConditionalHeaders")])),_:1}),t[38]||(t[38]=l(" 插件可用于配置 ")),e(o,null,{default:r(()=>t[33]||(t[33]=[l("ETag")])),_:1}),t[39]||(t[39]=l(" 响应头部。 "))])]),_:1}),e(i,{title:"提供静态内容",id:"static"},{default:r(()=>[n("p",null,[t[43]||(t[43]=l(" 在本节中，我们将了解如何在 Express 和 Ktor 中提供图像、CSS 文件和 JavaScript 文件等静态文件。 假设我们有一个 ")),e(d,null,{default:r(()=>t[41]||(t[41]=[l("public")])),_:1}),t[44]||(t[44]=l(" 文件夹，其中包含主 ")),e(d,null,{default:r(()=>t[42]||(t[42]=[l("index.html")])),_:1}),t[45]||(t[45]=l(" 页面 和一组链接的资源。 "))]),e(s,{code:`            public
            ├── index.html
            ├── ktor_logo.png
            ├── css
            │   └──styles.css
            └── js
                └── script.js`}),n("table",P,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[46]||(t[46]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[48]||(t[48]=l(" 在 Express 中，将文件夹名称传递给 ")),e(o,null,{default:r(()=>t[47]||(t[47]=[l("express.static")])),_:1}),t[49]||(t[49]=l(" 函数。 "))]),e(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`}),t[50]||(t[50]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/2_static/app.js"},"2_static"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[51]||(t[51]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[55]||(t[55]=l(" 在 Ktor 中，使用 ")),t[56]||(t[56]=n("a",{href:"#folders"},[n("code",null,"staticFiles()")],-1)),t[57]||(t[57]=l(" 函数将任何对 ")),e(d,null,{default:r(()=>t[52]||(t[52]=[l("/")])),_:1}),t[58]||(t[58]=l(" 路径的请求映射到 ")),e(d,null,{default:r(()=>t[53]||(t[53]=[l("public")])),_:1}),t[59]||(t[59]=l(" 物理文件夹。 此函数支持递归提供 ")),e(d,null,{default:r(()=>t[54]||(t[54]=[l("public")])),_:1}),t[60]||(t[60]=l(" 文件夹中的所有文件。 "))]),e(s,{lang:"kotlin",code:`import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        staticFiles("", File("public"), "index.html")
    }
}`}),t[61]||(t[61]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt"},"2_static"),l(" 项目。 ")],-1))])])]),t[73]||(t[73]=n("p",null," 提供静态内容时，Express 会添加几个响应头部，可能如下所示： ",-1)),e(s,{code:`            Accept-Ranges: bytes
            Cache-Control: public, max-age=0
            ETag: W/"181-1823feafeb1"
            Last-Modified: Wed, 27 Jul 2022 13:49:01 GMT`}),t[74]||(t[74]=n("p",null," 要在 Ktor 中管理这些头部，您需要安装以下插件： ",-1)),e(g,null,{default:r(()=>[n("li",null,[n("p",null,[e(o,null,{default:r(()=>t[62]||(t[62]=[l("Accept-Ranges")])),_:1}),t[64]||(t[64]=l(" : ")),e(u,{href:"/ktor/server-partial-content",summary:"所需依赖项：io.ktor:%artifact_name% 服务器示例：download-file，客户端示例：client-download-file-range 原生服务器支持：✅"},{default:r(()=>t[63]||(t[63]=[l("PartialContent")])),_:1})])]),n("li",null,[n("p",null,[e(o,null,{default:r(()=>t[65]||(t[65]=[l("Cache-Control")])),_:1}),t[67]||(t[67]=l(" : ")),e(u,{href:"/ktor/server-caching-headers",summary:"所需依赖项：io.ktor:%artifact_name% 代码示例：%example_name% 原生服务器支持：✅"},{default:r(()=>t[66]||(t[66]=[l("CachingHeaders")])),_:1})])]),n("li",null,[n("p",null,[e(o,null,{default:r(()=>t[68]||(t[68]=[l("ETag")])),_:1}),t[71]||(t[71]=l(" 和 ")),e(o,null,{default:r(()=>t[69]||(t[69]=[l("Last-Modified")])),_:1}),t[72]||(t[72]=l(" : ")),e(u,{href:"/ktor/server-conditional-headers",summary:"所需依赖项：io.ktor:%artifact_name% 代码示例：%example_name% 原生服务器支持：✅"},{default:r(()=>t[70]||(t[70]=[l("ConditionalHeaders")])),_:1})])])]),_:1})]),_:1}),e(i,{title:"路由",id:"routing"},{default:r(()=>[n("p",null,[e(u,{href:"/ktor/server-routing",summary:"路由是用于处理服务器应用程序中传入请求的核心插件。"},{default:r(()=>t[75]||(t[75]=[l("路由")])),_:1}),t[77]||(t[77]=l("允许处理对特定端点的传入请求， 该端点由特定的 HTTP 请求方法（例如 ")),t[78]||(t[78]=n("code",null,"GET",-1)),t[79]||(t[79]=l("、")),t[80]||(t[80]=n("code",null,"POST",-1)),t[81]||(t[81]=l(" 等）和路径定义。 以下示例展示了如何处理对 ")),e(d,null,{default:r(()=>t[76]||(t[76]=[l("/")])),_:1}),t[82]||(t[82]=l(" 路径的 ")),t[83]||(t[83]=n("code",null,"GET",-1)),t[84]||(t[84]=l(" 和 ")),t[85]||(t[85]=n("code",null,"POST",-1)),t[86]||(t[86]=l(" 请求。 "))]),n("table",K,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[87]||(t[87]=[l("Express")])),_:1})]),n("td",null,[e(s,{lang:"javascript",code:`app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
})`}),t[88]||(t[88]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[89]||(t[89]=[l("Ktor")])),_:1})]),n("td",null,[e(s,{lang:"kotlin",code:`    routing {
        get("/") {
            call.respondText("GET request to the homepage")
        }
        post("/") {
            call.respondText("POST request to the homepage")
        }
    }`}),e(v,null,{default:r(()=>t[90]||(t[90]=[n("p",null,[l(" 请参阅 "),n("a",{href:"#receive-request"},"接收请求"),l("，了解如何接收 "),n("code",null,"POST"),l("、"),n("code",null,"PUT"),l(" 或 "),n("code",null,"PATCH"),l(" 请求的请求体。 ")],-1)])),_:1}),t[91]||(t[91]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),l(" 项目。 ")],-1))])])]),t[123]||(t[123]=n("p",null," 以下示例演示了如何按路径对路由处理程序进行分组。 ",-1)),n("table",A,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[92]||(t[92]=[l("Express")])),_:1})]),n("td",null,[t[93]||(t[93]=n("p",null,[l(" 在 Express 中，您可以使用 "),n("code",null,"app.route()"),l(" 为路由路径创建可链式调用的路由处理程序。 ")],-1)),e(s,{lang:"javascript",code:`app.route('/book')
    .get((req, res) => {
        res.send('Get a random book')
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    })`}),t[94]||(t[94]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[95]||(t[95]=[l("Ktor")])),_:1})]),n("td",null,[t[96]||(t[96]=n("p",null,[l(" Ktor 提供了一个 "),n("code",null,"route"),l(" 函数， 您可以通过它定义路径，然后将该路径的动词作为嵌套函数放置。 ")],-1)),e(s,{lang:"kotlin",code:`    routing {
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
    }`}),t[97]||(t[97]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),l(" 项目。 ")],-1))])])]),t[124]||(t[124]=n("p",null," 这两种框架都允许您将相关路由分组到单个文件中。 ",-1)),n("table",C,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[98]||(t[98]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[101]||(t[101]=l(" Express 提供了 ")),t[102]||(t[102]=n("code",null,"express.Router",-1)),t[103]||(t[103]=l(" 类来创建可挂载的路由处理程序。 假设应用程序目录中有一个 ")),e(d,null,{default:r(()=>t[99]||(t[99]=[l("birds.js")])),_:1}),t[104]||(t[104]=l(" 路由文件。 此路由模块可以像 ")),e(d,null,{default:r(()=>t[100]||(t[100]=[l("app.js")])),_:1}),t[105]||(t[105]=l(" 中所示那样加载到应用程序中： "))]),e(f,null,{default:r(()=>[e(a,{title:"birds.js"},{default:r(()=>[e(s,{lang:"javascript",code:`const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Birds home page')
})

router.get('/about', (req, res) => {
    res.send('About birds')
})

module.exports = router`})]),_:1}),e(a,{title:"app.js"},{default:r(()=>[e(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const birds = require('./birds')
const port = 3000

app.use('/birds', birds)

app.listen(port, () => {
    console.log(\`Responding at http://0.0.0.0:\${port}/\`)
})`})]),_:1})]),_:1}),t[106]||(t[106]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/3_router/app.js"},"3_router"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[107]||(t[107]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[110]||(t[110]=l(" 在 Ktor 中，一种常见模式是在 ")),t[111]||(t[111]=n("code",null,"Routing",-1)),t[112]||(t[112]=l(" 类型上使用扩展函数 来定义实际路由。 下面的示例（ ")),e(d,null,{default:r(()=>t[108]||(t[108]=[l("Birds.kt")])),_:1}),t[113]||(t[113]=l(" ）定义了 ")),t[114]||(t[114]=n("code",null,"birdsRoutes",-1)),t[115]||(t[115]=l(" 扩展函数。 您可以通过在 ")),t[116]||(t[116]=n("code",null,"routing",-1)),t[117]||(t[117]=l(" 代码块内调用此函数来在应用程序（ ")),e(d,null,{default:r(()=>t[109]||(t[109]=[l("Application.kt")])),_:1}),t[118]||(t[118]=l(" ）中包含相应的路由： "))]),e(f,null,{default:r(()=>[e(a,{title:"Birds.kt",id:"birds-kt"},{default:r(()=>[e(s,{lang:"kotlin",code:`import io.ktor.server.response.*
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
}`})]),_:1}),e(a,{title:"Application.kt",id:"application-kt"},{default:r(()=>[e(s,{lang:"kotlin",code:`import com.example.routes.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        birdsRoutes()
    }
}`})]),_:1})]),_:1}),t[119]||(t[119]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt"},"3_router"),l(" 项目。 ")],-1))])])]),n("p",null,[t[121]||(t[121]=l(" 除了将 URL 路径指定为字符串之外，Ktor 还包括实现")),e(u,{href:"/ktor/server-resources",summary:"Resources 插件允许您实现类型安全的路由。"},{default:r(()=>t[120]||(t[120]=[l("类型安全的路由")])),_:1}),t[122]||(t[122]=l("的能力。 "))])]),_:1}),e(i,{title:"路由和查询参数",id:"route-query-param"},{default:r(()=>[t[153]||(t[153]=n("p",null," 本节将向我们展示如何访问路由参数和查询参数。 ",-1)),t[154]||(t[154]=n("p",null," 路由（或路径）参数是用于捕获 URL 中其位置处指定值的命名 URL 段。 ",-1)),n("table",N,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[125]||(t[125]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[128]||(t[128]=l(" 要在 Express 中访问路由参数，您可以使用 ")),t[129]||(t[129]=n("code",null,"Request.params",-1)),t[130]||(t[130]=l("。 例如，下面代码片段中的 ")),t[131]||(t[131]=n("code",null,'req.parameters["login"]',-1)),t[132]||(t[132]=l(" 对于 ")),e(d,null,{default:r(()=>t[126]||(t[126]=[l("/user/admin")])),_:1}),t[133]||(t[133]=l(" 路径将返回")),e(m,null,{default:r(()=>t[127]||(t[127]=[l("admin")])),_:1}),t[134]||(t[134]=l("： "))]),e(s,{lang:"javascript",code:`app.get('/user/:login', (req, res) => {
    if (req.params['login'] === 'admin') {
        res.send('You are logged in as Admin')
    } else {
        res.send('You are logged in as Guest')
    }
})`}),t[135]||(t[135]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[136]||(t[136]=[l("Ktor")])),_:1})]),n("td",null,[t[137]||(t[137]=n("p",null,[l(" 在 Ktor 中，路由参数使用 "),n("code",null,"{param}"),l(" 语法定义。 您可以使用 "),n("code",null,"call.parameters"),l(" 在路由处理程序中访问路由参数： ")],-1)),e(s,{lang:"kotlin",code:`    routing {
        get("/user/{login}") {
            if (call.parameters["login"] == "admin") {
                call.respondText("You are logged in as Admin")
            } else {
                call.respondText("You are logged in as Guest")
            }
        }
    }`}),t[138]||(t[138]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),l(" 项目。 ")],-1))])])]),t[155]||(t[155]=n("p",null," 下表比较了如何访问查询字符串的参数。 ",-1)),n("table",R,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[139]||(t[139]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[142]||(t[142]=l(" 要在 Express 中访问路由参数，您可以使用 ")),t[143]||(t[143]=n("code",null,"Request.params",-1)),t[144]||(t[144]=l("。 例如，下面代码片段中的 ")),t[145]||(t[145]=n("code",null,'req.parameters["login"]',-1)),t[146]||(t[146]=l(" 对于 ")),e(d,null,{default:r(()=>t[140]||(t[140]=[l("/user/admin")])),_:1}),t[147]||(t[147]=l(" 路径将返回")),e(m,null,{default:r(()=>t[141]||(t[141]=[l("admin")])),_:1}),t[148]||(t[148]=l("： "))]),e(s,{lang:"javascript",code:`app.get('/products', (req, res) => {
    if (req.query['price'] === 'asc') {
        res.send('Products from the lowest price to the highest')
    }
})`}),t[149]||(t[149]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/4_parameters/app.js"},"4_parameters"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[150]||(t[150]=[l("Ktor")])),_:1})]),n("td",null,[t[151]||(t[151]=n("p",null,[l(" 在 Ktor 中，路由参数使用 "),n("code",null,"{param}"),l(" 语法定义。 您可以使用 "),n("code",null,"call.parameters"),l(" 在路由处理程序中访问路由参数： ")],-1)),e(s,{lang:"kotlin",code:`    routing {
        get("/products") {
            if (call.request.queryParameters["price"] == "asc") {
                call.respondText("Products from the lowest price to the highest")
            }
        }
    }`}),t[152]||(t[152]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt"},"4_parameters"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"发送响应",id:"send-response"},{default:r(()=>[t[191]||(t[191]=n("p",null," 在前面的章节中，我们已经了解了如何响应纯文本内容。 现在让我们看看如何发送 JSON、文件和重定向响应。 ",-1)),e(i,{title:"JSON",id:"send-json"},{default:r(()=>[n("table",O,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[156]||(t[156]=[l("Express")])),_:1})]),n("td",null,[t[157]||(t[157]=n("p",null,[l(" 要在 Express 中发送具有相应内容类型的 JSON 响应， 请调用 "),n("code",null,"res.json"),l(" 函数： ")],-1)),e(s,{lang:"javascript",code:`const car = {type:"Fiat", model:"500", color:"white"};
app.get('/json', (req, res) => {
    res.json(car)
})`}),t[158]||(t[158]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[159]||(t[159]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[161]||(t[161]=l(" 在 Ktor 中，您需要安装 ")),e(u,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:r(()=>t[160]||(t[160]=[l("ContentNegotiation")])),_:1}),t[162]||(t[162]=l(" 插件并 配置 JSON 序列化器： "))]),e(s,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[163]||(t[163]=n("p",null,[l(" 要将数据序列化为 JSON，您需要创建一个带有 "),n("code",null,"@Serializable"),l(" 注解的数据类： ")],-1)),e(s,{lang:"kotlin",code:`@Serializable
data class Car(val type: String, val model: String, val color: String)`}),t[164]||(t[164]=n("p",null,[l(" 然后，您可以使用 "),n("code",null,"call.respond"),l(" 在响应中发送此类的对象： ")],-1)),e(s,{lang:"kotlin",code:`        get("/json") {
            call.respond(Car("Fiat", "500", "white"))
        }`}),t[165]||(t[165]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"文件",id:"send-file"},{default:r(()=>[n("table",F,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[166]||(t[166]=[l("Express")])),_:1})]),n("td",null,[t[167]||(t[167]=n("p",null,[l(" 要在 Express 中响应文件，请使用 "),n("code",null,"res.sendFile"),l("： ")],-1)),e(s,{lang:"javascript",code:`const path = require("path")

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'ktor_logo.png'))
})`}),t[168]||(t[168]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[169]||(t[169]=[l("Ktor")])),_:1})]),n("td",null,[t[170]||(t[170]=n("p",null,[l(" Ktor 提供了 "),n("code",null,"call.respondFile"),l(" 函数用于向客户端发送文件： ")],-1)),e(s,{lang:"kotlin",code:`        get("/file") {
            val file = File("public/ktor_logo.png")
            call.respondFile(file)
        }`}),t[171]||(t[171]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),l(" 项目。 ")],-1))])])]),n("p",null,[t[174]||(t[174]=l(" Express 应用程序在响应文件时会添加 ")),e(o,null,{default:r(()=>t[172]||(t[172]=[l("Accept-Ranges")])),_:1}),t[175]||(t[175]=l(" HTTP 响应头部。 服务器使用此头部来声明其支持客户端对文件下载的局部请求。 在 Ktor 中，您需要安装 ")),e(u,{href:"/ktor/server-partial-content",summary:"所需依赖项：io.ktor:%artifact_name% 服务器示例：download-file，客户端示例：client-download-file-range 原生服务器支持：✅"},{default:r(()=>t[173]||(t[173]=[l("PartialContent")])),_:1}),t[176]||(t[176]=l(" 插件以 支持局部请求。 "))])]),_:1}),e(i,{title:"文件附件",id:"send-file-attachment"},{default:r(()=>[n("table",L,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[177]||(t[177]=[l("Express")])),_:1})]),n("td",null,[t[178]||(t[178]=n("p",null,[n("code",null,"res.download"),l(" 函数将指定文件作为附件传输： ")],-1)),e(s,{lang:"javascript",code:`app.get('/file-attachment', (req, res) => {
    res.download("ktor_logo.png")
})`}),t[179]||(t[179]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[180]||(t[180]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[182]||(t[182]=l(" 在 Ktor 中，您需要手动配置 ")),e(o,null,{default:r(()=>t[181]||(t[181]=[l("Content-Disposition")])),_:1}),t[183]||(t[183]=l(" 头部，以将文件作为附件传输： "))]),e(s,{lang:"kotlin",code:`        get("/file-attachment") {
            val file = File("public/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }`}),t[184]||(t[184]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"重定向",id:"redirect"},{default:r(()=>[n("table",B,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[185]||(t[185]=[l("Express")])),_:1})]),n("td",null,[t[186]||(t[186]=n("p",null,[l(" 要在 Express 中生成重定向响应，请调用 "),n("code",null,"redirect"),l(" 函数： ")],-1)),e(s,{lang:"javascript",code:`app.get('/old', (req, res) => {
    res.redirect(301, "moved")
})

app.get('/moved', (req, res) => {
    res.send('Moved resource')
})`}),t[187]||(t[187]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/5_send_response/app.js"},"5_send_response"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[188]||(t[188]=[l("Ktor")])),_:1})]),n("td",null,[t[189]||(t[189]=n("p",null,[l(" 在 Ktor 中，使用 "),n("code",null,"respondRedirect"),l(" 发送重定向响应： ")],-1)),e(s,{lang:"kotlin",code:`        get("/old") {
            call.respondRedirect("/moved", permanent = true)
        }
        get("/moved") {
            call.respondText("Moved resource")
        }`}),t[190]||(t[190]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt"},"5_send_response"),l(" 项目。 ")],-1))])])])]),_:1})]),_:1}),e(i,{title:"模板",id:"templates"},{default:r(()=>[t[207]||(t[207]=n("p",null," Express 和 Ktor 都支持使用模板引擎来处理视图。 ",-1)),n("table",D,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[192]||(t[192]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[194]||(t[194]=l(" 假设我们在 ")),e(d,null,{default:r(()=>t[193]||(t[193]=[l("views")])),_:1}),t[195]||(t[195]=l(" 文件夹中有以下 Pug 模板： "))]),e(s,{code:`html
  head
    title= title
  body
    h1= message`}),t[196]||(t[196]=n("p",null,[l(" 要用此模板进行响应，请调用 "),n("code",null,"res.render"),l("： ")],-1)),e(s,{lang:"javascript",code:`app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})`}),t[197]||(t[197]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/6_templates/app.js"},"6_templates"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[198]||(t[198]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[200]||(t[200]=l(" Ktor 支持多种 ")),e(u,{href:"/ktor/server-templating",summary:"了解如何使用 HTML/CSS 或 JVM 模板引擎构建视图。"},{default:r(()=>t[199]||(t[199]=[l("JVM 模板引擎")])),_:1}),t[201]||(t[201]=l("， 例如 FreeMarker、Velocity 等。 例如，如果您需要使用放置在应用程序资源中的 FreeMarker 模板进行响应， 请安装并配置 ")),t[202]||(t[202]=n("code",null,"FreeMarker",-1)),t[203]||(t[203]=l(" 插件，然后使用 ")),t[204]||(t[204]=n("code",null,"call.respond",-1)),t[205]||(t[205]=l(" 发送模板： "))]),e(s,{lang:"kotlin",code:`fun Application.module() {
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

data class Article(val title: String, val message: String)`}),t[206]||(t[206]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt"},"6_templates"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"接收请求",id:"receive-request"},{default:r(()=>[t[265]||(t[265]=n("p",null," 本节将展示如何接收不同格式的请求体。 ",-1)),e(i,{title:"纯文本",id:"receive-raw-text"},{default:r(()=>[t[215]||(t[215]=n("p",null,[l(" 下面的 "),n("code",null,"POST"),l(" 请求向服务器发送文本数据： ")],-1)),e(s,{lang:"http",code:`POST http://0.0.0.0:3000/text
Content-Type: text/plain

Hello, world!`}),t[216]||(t[216]=n("p",null," 让我们看看如何在服务器端将此请求体作为纯文本接收。 ",-1)),n("table",H,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[208]||(t[208]=[l("Express")])),_:1})]),n("td",null,[t[209]||(t[209]=n("p",null,[l(" 要在 Express 中解析传入的请求体，您需要添加 "),n("code",null,"body-parser"),l("： ")],-1)),e(s,{lang:"javascript",code:"const bodyParser = require('body-parser')"}),t[210]||(t[210]=n("p",null,[l(" 在 "),n("code",null,"post"),l(" 处理程序中， 您需要传递文本解析器（"),n("code",null,"bodyParser.text"),l("）。 请求体将通过 "),n("code",null,"req.body"),l(" 属性可用： ")],-1)),e(s,{lang:"javascript",code:`app.post('/text', bodyParser.text(), (req, res) => {
    let text = req.body
    res.send(text)
})`}),t[211]||(t[211]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[212]||(t[212]=[l("Ktor")])),_:1})]),n("td",null,[t[213]||(t[213]=n("p",null,[l(" 在 Ktor 中，您可以使用 "),n("code",null,"call.receiveText"),l(" 将请求体作为文本接收： ")],-1)),e(s,{lang:"kotlin",code:`    routing {
        post("/text") {
            val text = call.receiveText()
            call.respondText(text)`}),t[214]||(t[214]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"JSON",id:"receive-json"},{default:r(()=>[t[229]||(t[229]=n("p",null,[l(" 在本节中，我们将了解如何接收 JSON 请求体。 以下示例展示了一个带有 JSON 对象的 "),n("code",null,"POST"),l(" 请求体： ")],-1)),e(s,{lang:"http",code:`POST http://0.0.0.0:3000/json
Content-Type: application/json

{
  "type": "Fiat",
  "model" : "500",
  "color": "white"
}`}),n("table",M,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[217]||(t[217]=[l("Express")])),_:1})]),n("td",null,[t[218]||(t[218]=n("p",null,[l(" 要在 Express 中接收 JSON，请使用 "),n("code",null,"bodyParser.json"),l("： ")],-1)),e(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/json', bodyParser.json(), (req, res) => {
    let car = req.body
    res.send(car)
})`}),t[219]||(t[219]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[220]||(t[220]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[222]||(t[222]=l(" 在 Ktor 中，您需要安装 ")),e(u,{href:"/ktor/server-serialization",summary:"ContentNegotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。"},{default:r(()=>t[221]||(t[221]=[l("ContentNegotiation")])),_:1}),t[223]||(t[223]=l(" 插件 并配置 ")),t[224]||(t[224]=n("code",null,"Json",-1)),t[225]||(t[225]=l(" 序列化器： "))]),e(s,{lang:"kotlin",code:`fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })`}),t[226]||(t[226]=n("p",null," 要将接收到的数据反序列化为对象，您需要创建一个数据类： ",-1)),e(s,{lang:"kotlin",code:"@Serializable"}),t[227]||(t[227]=n("p",null,[l(" 然后，使用接受此数据类作为参数的 "),n("code",null,"receive"),l(" 方法： ")],-1)),e(s,{lang:"kotlin",code:`        }
        post("/json") {
            val car = call.receive<Car>()
            call.respond(car)`}),t[228]||(t[228]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"URL 编码",id:"receive-url-encoded"},{default:r(()=>[n("p",null,[t[231]||(t[231]=l(" 现在让我们看看如何接收使用 ")),e(o,null,{default:r(()=>t[230]||(t[230]=[l("application/x-www-form-urlencoded")])),_:1}),t[232]||(t[232]=l(" 类型发送的表单数据。 以下代码片段显示了一个带有表单数据的 ")),t[233]||(t[233]=n("code",null,"POST",-1)),t[234]||(t[234]=l(" 请求示例： "))]),e(s,{lang:"http",code:`POST http://localhost:3000/urlencoded
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar`}),n("table",J,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[235]||(t[235]=[l("Express")])),_:1})]),n("td",null,[t[236]||(t[236]=n("p",null,[l(" 与纯文本和 JSON 类似，Express 需要 "),n("code",null,"body-parser"),l("。 您需要将解析器类型设置为 "),n("code",null,"bodyParser.urlencoded"),l("： ")],-1)),e(s,{lang:"javascript",code:`const bodyParser = require('body-parser')

app.post('/urlencoded', bodyParser.urlencoded({extended: true}), (req, res) => {
    let user = req.body
    res.send(\`The \${user["username"]} account is created\`)
})`}),t[237]||(t[237]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[238]||(t[238]=[l("Ktor")])),_:1})]),n("td",null,[t[239]||(t[239]=n("p",null,[l(" 在 Ktor 中，使用 "),n("code",null,"call.receiveParameters"),l(" 函数： ")],-1)),e(s,{lang:"kotlin",code:`        }
        post("/urlencoded") {
            val formParameters = call.receiveParameters()
            val username = formParameters["username"].toString()
            call.respondText("The '$username' account is created")`}),t[240]||(t[240]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"原始数据",id:"receive-raw-data"},{default:r(()=>[n("p",null,[t[242]||(t[242]=l(" 下一个用例是处理二进制数据。 下面的请求将一个带有 ")),e(o,null,{default:r(()=>t[241]||(t[241]=[l("application/octet-stream")])),_:1}),t[243]||(t[243]=l(" 类型的 PNG 图像发送到服务器： "))]),e(s,{lang:"http",code:`POST http://localhost:3000/raw
Content-Type: application/octet-stream

< ./ktor_logo.png`}),n("table",$,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[244]||(t[244]=[l("Express")])),_:1})]),n("td",null,[t[245]||(t[245]=n("p",null,[l(" 要在 Express 中处理二进制数据，请将解析器类型设置为 "),n("code",null,"raw"),l("： ")],-1)),e(s,{lang:"javascript",code:`const bodyParser = require('body-parser')
const fs = require('fs')

app.post('/raw', bodyParser.raw({type: () => true}), (req, res) => {
    let rawBody = req.body
    fs.createWriteStream('./uploads/ktor_logo.png').write(rawBody)
    res.send('A file is uploaded')
})`}),t[246]||(t[246]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[247]||(t[247]=[l("Ktor")])),_:1})]),n("td",null,[t[248]||(t[248]=n("p",null,[l(" Ktor 提供了 "),n("code",null,"ByteReadChannel"),l(" 和 "),n("code",null,"ByteWriteChannel"),l(" 用于异步读/写字节序列： ")],-1)),e(s,{lang:"kotlin",code:`        }
        post("/raw") {
            val file = File("uploads/ktor_logo.png")
            call.receiveChannel().copyAndClose(file.writeChannel())
            call.respondText("A file is uploaded")`}),t[249]||(t[249]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"Multipart",id:"receive-multipart"},{default:r(()=>[n("p",null,[t[252]||(t[252]=l(" 在最后一节中，让我们看看如何处理 ")),e(m,null,{default:r(()=>t[250]||(t[250]=[l("multipart")])),_:1}),t[253]||(t[253]=l(" 请求体。 下面的 ")),t[254]||(t[254]=n("code",null,"POST",-1)),t[255]||(t[255]=l(" 请求使用 ")),e(o,null,{default:r(()=>t[251]||(t[251]=[l("multipart/form-data")])),_:1}),t[256]||(t[256]=l(" 类型发送一个带有描述的 PNG 图像： "))]),e(s,{lang:"http",code:`POST http://localhost:3000/multipart
Content-Type: multipart/form-data; boundary=WebAppBoundary

--WebAppBoundary
Content-Disposition: form-data; name="description"
Content-Type: text/plain

Ktor logo
--WebAppBoundary
Content-Disposition: form-data; name="image"; filename="ktor_logo.png"
Content-Type: image/png

< ./ktor_logo.png
--WebAppBoundary--`}),n("table",G,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[257]||(t[257]=[l("Express")])),_:1})]),n("td",null,[n("p",null,[t[259]||(t[259]=l(" Express 需要一个单独的模块来解析 multipart 数据。 在下面的示例中， ")),e(o,null,{default:r(()=>t[258]||(t[258]=[l("multer")])),_:1}),t[260]||(t[260]=l(" 用于将文件上传到服务器： "))]),e(s,{lang:"javascript",code:`const multer = require('multer')

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
})`}),t[261]||(t[261]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/7_receive_request/app.js"},"7_receive_request"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[262]||(t[262]=[l("Ktor")])),_:1})]),n("td",null,[t[263]||(t[263]=n("p",null,[l(" 在 Ktor 中，如果您需要接收作为 multipart 请求一部分发送的文件， 请调用 "),n("code",null,"receiveMultipart"),l(" 函数，然后根据需要遍历每个部分。 在下面的示例中，"),n("code",null,"PartData.FileItem"),l(" 用于将文件作为字节流接收： ")],-1)),e(s,{lang:"kotlin",code:`        }
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
            }`}),t[264]||(t[264]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt"},"7_receive_request"),l(" 项目。 ")],-1))])])])]),_:1})]),_:1}),e(i,{title:"创建中间件",id:"middleware"},{default:r(()=>[t[276]||(t[276]=n("p",null," 我们要看的最后一件事是如何创建中间件，它允许您扩展服务器功能。 以下示例展示了如何使用 Express 和 Ktor 实现请求日志记录。 ",-1)),n("table",U,[n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[266]||(t[266]=[l("Express")])),_:1})]),n("td",null,[t[267]||(t[267]=n("p",null,[l(" 在 Express 中，中间件是使用 "),n("code",null,"app.use"),l(" 绑定到应用程序的函数： ")],-1)),e(s,{lang:"javascript",code:`const express = require('express')
const app = express()
const port = 3000

const requestLogging = function (req, res, next) {
    let scheme = req.protocol
    let host = req.headers.host
    let url = req.url
    console.log(\`Request URL: \${scheme}://\${host}\${url}\`)
    next()
}

app.use(requestLogging)`}),t[268]||(t[268]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express/8_middleware/app.js"},"8_middleware"),l(" 项目。 ")],-1))])]),n("tr",null,[n("td",null,[e(o,null,{default:r(()=>t[269]||(t[269]=[l("Ktor")])),_:1})]),n("td",null,[n("p",null,[t[271]||(t[271]=l(" Ktor 允许您使用")),e(u,{href:"/ktor/server-custom-plugins",summary:"了解如何创建自己的自定义插件。"},{default:r(()=>t[270]||(t[270]=[l("自定义插件")])),_:1}),t[272]||(t[272]=l("扩展其功能。 以下代码示例展示了如何处理 ")),t[273]||(t[273]=n("code",null,"onCall",-1)),t[274]||(t[274]=l(" 以实现请求日志记录： "))]),e(s,{lang:"kotlin",code:`val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}`}),t[275]||(t[275]=n("p",null,[l(" 有关完整示例，请参阅 "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt"},"8_middleware"),l(" 项目。 ")],-1))])])])]),_:1}),e(i,{title:"后续内容",id:"next"},{default:r(()=>[n("p",null,[t[278]||(t[278]=l(" 本指南中仍有许多未涵盖的用例， 例如会话管理、授权、数据库集成等。 对于大多数这些功能，Ktor 提供了专门的插件， 可以在应用程序中安装并根据需要进行配置。 要继续您的 Ktor 之旅， 请访问 ")),e(o,null,{default:r(()=>t[277]||(t[277]=[n("a",{href:"https://ktor.io/learn/"},"学习页面",-1)])),_:1}),t[279]||(t[279]=l(" ，该页面提供了一系列分步指南和即用型示例。 "))])]),_:1})]),_:1})])}const _=q(w,[["render",W]]);export{Z as __pageData,_ as default};
