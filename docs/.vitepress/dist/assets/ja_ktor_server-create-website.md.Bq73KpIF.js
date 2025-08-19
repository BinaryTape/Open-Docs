import{_ as w,a as x,b as P,c as S,d as C,e as E}from"./chunks/server_create_web_app_new_task_added.aEfqvYQu.js";import{_ as R}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as K}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as k}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as I,C as s,c as A,o as M,G as e,w as r,j as n,a as l}from"./chunks/framework.Bksy39di.js";const W=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-create-website.md","filePath":"ja/ktor/server-create-website.md","lastUpdated":1755457140000}'),L={name:"ja/ktor/server-create-website.md"};function H(N,t,O,D,B,$){const u=s("Links"),y=s("tldr"),g=s("web-summary"),T=s("card-summary"),b=s("link-summary"),m=s("list"),f=s("chapter"),i=s("step"),d=s("control"),o=s("Path"),p=s("procedure"),a=s("code-block"),v=s("topic");return M(),A("div",null,[e(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"KotlinとKtorでウェブサイトを作成する",id:"server-create-website"},{default:r(()=>[e(y,null,{default:r(()=>[t[7]||(t[7]=n("p",null,[n("b",null,"コード例"),l(": "),n("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-web-application"}," tutorial-server-web-application ")],-1)),n("p",null,[t[3]||(t[3]=n("b",null,"使用されているプラグイン",-1)),t[4]||(t[4]=l(": ")),e(u,{href:"/ktor/server-routing",summary:"ルーティングは、サーバーアプリケーションにおける受信リクエストを処理するための中核プラグインです。"},{default:r(()=>t[0]||(t[0]=[l("Routing")])),_:1}),t[5]||(t[5]=l("、 ")),e(u,{href:"/ktor/server-static-content",summary:"スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。"},{default:r(()=>t[1]||(t[1]=[l("Static Content")])),_:1}),t[6]||(t[6]=l("、 ")),e(u,{href:"/ktor/server-thymeleaf",summary:"必要な依存関係: io.ktor:%artifact_name% コード例: tutorial-server-web-application ネイティブサーバーサポート: ✖️"},{default:r(()=>t[2]||(t[2]=[l("Thymeleaf")])),_:1})])]),_:1}),e(g,null,{default:r(()=>t[8]||(t[8]=[l(" KtorとKotlinでウェブサイトを構築する方法を学びます。このチュートリアルでは、ThymeleafテンプレートとKtorルートを組み合わせて、サーバーサイドでHTMLベースのユーザーインターフェースを生成する方法を示します。 ")])),_:1}),e(T,null,{default:r(()=>t[9]||(t[9]=[l(" KtorとThymeleafテンプレートを使ってKotlinでウェブサイトを構築する方法を学びます。 ")])),_:1}),e(b,null,{default:r(()=>t[10]||(t[10]=[l(" KtorとThymeleafテンプレートを使ってKotlinでウェブサイトを構築する方法を学びます。 ")])),_:1}),t[170]||(t[170]=n("p",null,[l(" このチュートリアルでは、Kotlin、Ktor、そして "),n("a",{href:"https://www.thymeleaf.org/"},"Thymeleaf"),l("テンプレートを使ってインタラクティブなウェブサイトを構築する方法を紹介します。 ")],-1)),n("p",null,[e(u,{href:"/ktor/server-create-restful-apis",summary:"KotlinとKtorを使用してバックエンドサービスを構築する方法を学び、JSONファイルを生成するRESTful APIの例を紹介します。"},{default:r(()=>t[11]||(t[11]=[l("前のチュートリアル")])),_:1}),t[12]||(t[12]=l("では、JavaScriptで書かれたシングルページアプリケーション（SPA）によって利用されることを想定したRESTfulサービスを作成する方法を学びました。これは非常に一般的なアーキテクチャですが、すべてのプロジェクトに適しているわけではありません。 "))]),t[171]||(t[171]=n("p",null," 実装をすべてサーバー側に保持し、マークアップのみをクライアントに送信したいと考える理由はたくさんあります。例えば、以下のようなものが挙げられます。 ",-1)),e(m,null,{default:r(()=>t[13]||(t[13]=[n("li",null,"シンプルさ - 単一のコードベースを維持するため。",-1),n("li",null,"セキュリティ - 攻撃者に情報を提供する可能性のあるデータやコードがブラウザに置かれるのを防ぐため。 ",-1),n("li",null," サポート性 - レガシーブラウザやJavaScriptが無効なブラウザを含む、可能な限り幅広いクライアントが使用できるようにするため。 ",-1)])),_:1}),n("p",null,[t[15]||(t[15]=l(" Ktorは、")),e(u,{href:"/ktor/server-templating",summary:"HTML/CSSまたはJVMテンプレートエンジンで構築されたビューを操作する方法を学びます。"},{default:r(()=>t[14]||(t[14]=[l("いくつかのサーバーページ技術")])),_:1}),t[16]||(t[16]=l("と統合することで、このアプローチをサポートします。 "))]),e(f,{title:"前提条件",id:"prerequisites"},{default:r(()=>[n("p",null,[t[18]||(t[18]=l(" このチュートリアルは単独で行うこともできますが、RESTful APIの作成方法を学ぶために ")),e(u,{href:"/ktor/server-create-restful-apis",summary:"KotlinとKtorを使用してバックエンドサービスを構築する方法を学び、JSONファイルを生成するRESTful APIの例を紹介します。"},{default:r(()=>t[17]||(t[17]=[l("先行するチュートリアル")])),_:1}),t[19]||(t[19]=l("を完了することを強くお勧めします。 "))]),t[20]||(t[20]=n("p",null,[n("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),l("をインストールすることをお勧めしますが、お好みの他のIDEを使用することもできます。 ")],-1))]),_:1}),e(f,{title:"Hello Task Manager Webアプリケーション",id:"hello-task-manager"},{default:r(()=>[n("p",null,[t[23]||(t[23]=l(" このチュートリアルでは、")),e(u,{href:"/ktor/server-create-restful-apis",summary:"KotlinとKtorを使用してバックエンドサービスを構築する方法を学び、JSONファイルを生成するRESTful APIの例を紹介します。"},{default:r(()=>t[21]||(t[21]=[l("前のチュートリアル")])),_:1}),t[24]||(t[24]=l("で構築したタスクマネージャーをWebアプリケーションに変換します。これには、いくつかのKtor ")),e(u,{href:"/ktor/server-plugins",summary:"プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの一般的な機能を提供します。"},{default:r(()=>t[22]||(t[22]=[l("プラグイン")])),_:1}),t[25]||(t[25]=l("を使用します。 "))]),t[89]||(t[89]=n("p",null," これらのプラグインを既存のプロジェクトに手動で追加することもできますが、新しいプロジェクトを生成し、以前のチュートリアルからのコードを徐々に組み込んでいく方が簡単です。必要なコードはすべて提供するので、以前のプロジェクトを手元に置く必要はありません。 ",-1)),e(p,{title:"プラグインを使用して初期プロジェクトを作成する",id:"create-project"},{default:r(()=>[e(i,null,{default:r(()=>t[26]||(t[26]=[n("p",null,[n("a",{href:"https://start.ktor.io/"},"Ktor Project Generator"),l(" に移動します。 ")],-1)])),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(d,null,{default:r(()=>t[27]||(t[27]=[l("Project artifact")])),_:1}),t[29]||(t[29]=l(" フィールドに、プロジェクトアーティファクト名として ")),e(o,null,{default:r(()=>t[28]||(t[28]=[l("com.example.ktor-task-web-app")])),_:1}),t[30]||(t[30]=l(" を入力します。 ")),t[31]||(t[31]=n("img",{src:w,alt:"Ktor Project Generatorのプロジェクトアーティファクト名",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),e(i,null,{default:r(()=>[n("p",null,[t[33]||(t[33]=l(" 次の画面で、以下のプラグインを検索し、")),e(d,null,{default:r(()=>t[32]||(t[32]=[l("Add")])),_:1}),t[34]||(t[34]=l("ボタンをクリックして追加します。 "))]),e(m,null,{default:r(()=>t[35]||(t[35]=[n("li",null,"Routing",-1),n("li",null,"Static Content",-1),n("li",null,"Thymeleaf",-1)])),_:1}),t[36]||(t[36]=n("p",null,[n("img",{src:R,alt:"Ktor Project Generatorでのプラグインの追加","border-effect":"line",style:{},width:"706"}),l(" プラグインを追加すると、プロジェクト設定の下に3つのプラグインがすべて表示されます。 "),n("img",{src:x,alt:"Ktor Project Generatorのプラグインリスト",style:{},"border-effect":"line",width:"706"})],-1))]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(d,null,{default:r(()=>t[37]||(t[37]=[l("Download")])),_:1}),t[38]||(t[38]=l(" ボタンをクリックして、Ktorプロジェクトを生成し、ダウンロードします。 "))])]),_:1})]),_:1}),e(p,{title:"スターターコードを追加する",id:"add-starter-code"},{default:r(()=>[e(i,null,{default:r(()=>t[39]||(t[39]=[l(" IntelliJ IDEA、または選択した別のIDEでプロジェクトを開きます。 ")])),_:1}),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[40]||(t[40]=[l("src/main/kotlin/com/example")])),_:1}),t[42]||(t[42]=l(" に移動し、 ")),e(o,null,{default:r(()=>t[41]||(t[41]=[l("model")])),_:1}),t[43]||(t[43]=l(" というサブパッケージを作成します。 "))]),_:1}),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[44]||(t[44]=[l("model")])),_:1}),t[46]||(t[46]=l(" パッケージ内に、新しい ")),e(o,null,{default:r(()=>t[45]||(t[45]=[l("Task.kt")])),_:1}),t[47]||(t[47]=l(" ファイルを作成します。 "))]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(o,null,{default:r(()=>t[48]||(t[48]=[l("Task.kt")])),_:1}),t[49]||(t[49]=l(" ファイルに、優先順位を表す")),t[50]||(t[50]=n("code",null,"enum",-1)),t[51]||(t[51]=l("と、タスクを表す")),t[52]||(t[52]=n("code",null,"data class",-1)),t[53]||(t[53]=l("を追加します。 "))]),e(a,{lang:"kotlin",code:`enum class Priority {
    Low, Medium, High, Vital
}

data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[64]||(t[64]=n("p",null,[l(" ここでも、"),n("code",null,"Task"),l("オブジェクトを作成し、表示可能な形式でクライアントに送信したいと考えます。 ")],-1)),t[65]||(t[65]=n("p",null," 思い出されるかもしれません。 ",-1)),e(m,null,{default:r(()=>[n("li",null,[e(u,{href:"/ktor/server-requests-and-responses",summary:"KtorでKotlinのルーティング、リクエスト処理、パラメータの基本を学び、タスクマネージャーアプリケーションを構築します。"},{default:r(()=>t[54]||(t[54]=[l("リクエストを処理しレスポンスを生成する")])),_:1}),t[55]||(t[55]=l("チュートリアルでは、タスクをHTMLに変換するために手書きの拡張関数を追加しました。 "))]),n("li",null,[e(u,{href:"/ktor/server-create-restful-apis",summary:"KotlinとKtorを使用してバックエンドサービスを構築する方法を学び、JSONファイルを生成するRESTful APIの例を紹介します。"},{default:r(()=>t[56]||(t[56]=[l("RESTful APIを作成する")])),_:1}),t[57]||(t[57]=l("チュートリアルでは、")),t[58]||(t[58]=n("code",null,"Task",-1)),t[59]||(t[59]=l("クラスに")),t[60]||(t[60]=n("code",null,"kotlinx.serialization",-1)),t[61]||(t[61]=l("ライブラリの")),t[62]||(t[62]=n("code",null,"Serializable",-1)),t[63]||(t[63]=l("型をアノテーションしました。 "))])]),_:1}),t[66]||(t[66]=n("p",null," この場合、私たちの目標は、タスクの内容をブラウザに書き込めるサーバーページを作成することです。 ",-1))]),_:1}),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[67]||(t[67]=[l("plugins")])),_:1}),t[69]||(t[69]=l(" パッケージ内の ")),e(o,null,{default:r(()=>t[68]||(t[68]=[l("Templating.kt")])),_:1}),t[70]||(t[70]=l(" ファイルを開きます。 "))]),_:1}),e(i,null,{default:r(()=>[t[78]||(t[78]=n("p",null,[n("code",null,"configureTemplating()"),l("メソッドに、以下に示すように"),n("code",null,"/tasks"),l("のルートを追加します。 ")],-1)),e(a,{lang:"kotlin",code:`fun Application.configureTemplating() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/thymeleaf/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        get("/html-thymeleaf") {
            call.respond(ThymeleafContent(
                "index",
                mapOf("user" to ThymeleafUser(1, "user1"))
            ))
        }
        //this is the additional route to add
        get("/tasks") {
            val tasks = listOf(
                Task("cleaning", "Clean the house", Priority.Low),
                Task("gardening", "Mow the lawn", Priority.Medium),
                Task("shopping", "Buy the groceries", Priority.High),
                Task("painting", "Paint the fence", Priority.Medium)
            )
            call.respond(ThymeleafContent("all-tasks", mapOf("tasks" to tasks)))
        }
    }
}`}),t[79]||(t[79]=n("p",null,[l(" サーバーが"),n("code",null,"/tasks"),l("へのリクエストを受信すると、タスクのリストを作成し、それをThymeleafテンプレートに渡します。"),n("code",null,"ThymeleafContent"),l("型は、トリガーしたいテンプレートの名前と、ページでアクセス可能にしたい値のテーブルを受け取ります。 ")],-1)),n("p",null,[t[74]||(t[74]=l(" メソッドの先頭にあるThymeleafプラグインの初期化を見ると、Ktorがサーバーページのために ")),e(o,null,{default:r(()=>t[71]||(t[71]=[l("templates/thymeleaf")])),_:1}),t[75]||(t[75]=l(" 内を検索することがわかります。静的コンテンツと同様に、このフォルダが ")),e(o,null,{default:r(()=>t[72]||(t[72]=[l("resources")])),_:1}),t[76]||(t[76]=l(" ディレクトリ内にあることを想定しています。また、 ")),e(o,null,{default:r(()=>t[73]||(t[73]=[l(".html")])),_:1}),t[77]||(t[77]=l(" のサフィックスを想定しています。 "))]),t[80]||(t[80]=n("p",null,[l(" この場合、"),n("code",null,"all-tasks"),l("という名前は "),n("code",null,"src/main/resources/templates/thymeleaf/all-tasks.html"),l(" のパスにマッピングされます。 ")],-1))]),_:1}),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[81]||(t[81]=[l("src/main/resources/templates/thymeleaf")])),_:1}),t[83]||(t[83]=l(" に移動し、新しい ")),e(o,null,{default:r(()=>t[82]||(t[82]=[l("all-tasks.html")])),_:1}),t[84]||(t[84]=l(" ファイルを作成します。 "))]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(o,null,{default:r(()=>t[85]||(t[85]=[l("all-tasks.html")])),_:1}),t[86]||(t[86]=l(" ファイルを開き、以下のコンテンツを追加します。 "))]),e(a,{lang:"html",code:`<!DOCTYPE html >
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>All Current Tasks</title>
</head>
<body>
<h1>All Current Tasks</h1>
<table>
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="task: \${tasks}">
        <td th:text="\${task.name}"></td>
        <td th:text="\${task.description}"></td>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1}),e(i,null,{default:r(()=>t[87]||(t[87]=[n("p",null,[l("IntelliJ IDEAで実行ボタン ("),n("img",{src:K,style:{},height:"16",width:"16",alt:"IntelliJ IDEAの実行アイコン"}),l(") をクリックしてアプリケーションを開始します。")],-1)])),_:1}),e(i,null,{default:r(()=>t[88]||(t[88]=[n("p",null,[l(" ブラウザで"),n("a",{href:"http://0.0.0.0:8080/tasks"},[n("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),l("に移動します。以下に示すように、現在のすべてのタスクがテーブルに表示されるはずです。 ")],-1),n("img",{src:P,alt:"タスクのリストを表示するWebブラウザウィンドウ","border-effect":"rounded",width:"706"},null,-1),n("p",null,[l(" すべてのサーバーページフレームワークと同様に、Thymeleafテンプレートは静的コンテンツ（ブラウザに送信される）と動的コンテンツ（サーバーで実行される）を混在させます。もし "),n("a",{href:"https://freemarker.apache.org/"},"Freemarker"),l(" のような代替フレームワークを選択していたら、わずかに異なる構文で同じ機能を提供できたでしょう。 ")],-1)])),_:1})]),_:1})]),_:1}),e(f,{title:"GETルートを追加する",id:"add-get-routes"},{default:r(()=>[t[144]||(t[144]=n("p",null,"サーバーページの要求プロセスに慣れたので、以前のチュートリアルからの機能をこのチュートリアルに転送し続けます。",-1)),n("p",null,[e(d,null,{default:r(()=>t[90]||(t[90]=[l("Static Content")])),_:1}),t[92]||(t[92]=l(" プラグインを含めたため、以下のコードが ")),e(o,null,{default:r(()=>t[91]||(t[91]=[l("Routing.kt")])),_:1}),t[93]||(t[93]=l(" ファイルに存在します。 "))]),e(a,{lang:"kotlin",code:'            staticResources("/static", "static")'}),t[145]||(t[145]=n("p",null,[l(" これは、例えば"),n("code",null,"/static/index.html"),l("へのリクエストが、以下のパスからコンテンツを提供されることを意味します。 ")],-1)),t[146]||(t[146]=n("code",null,"src/main/resources/static/index.html",-1)),t[147]||(t[147]=n("p",null," このファイルはすでに生成されたプロジェクトの一部であるため、追加したい機能のホームページとして使用できます。 ",-1)),e(p,{title:"インデックスページを再利用する"},{default:r(()=>[e(i,null,{default:r(()=>[n("p",null,[e(o,null,{default:r(()=>t[94]||(t[94]=[l("src/main/resources/static")])),_:1}),t[96]||(t[96]=l(" 内の ")),e(o,null,{default:r(()=>t[95]||(t[95]=[l("index.html")])),_:1}),t[97]||(t[97]=l(" ファイルを開き、その内容を以下の実装に置き換えます。 "))]),e(a,{lang:"html",code:`<html>
<head>
</head>
<body>
<h1>Task Manager Web Application</h1>
<div>
    <h3><a href="/tasks">View all the tasks</a></h3>
</div>
<div>
    <h3>View tasks by priority</h3>
    <form method="get" action="/tasks/byPriority">
        <select name="priority">
            <option name="Low">Low</option>
            <option name="Medium">Medium</option>
            <option name="High">High</option>
            <option name="Vital">Vital</option>
        </select>
        <input type="submit">
    </form>
</div>
<div>
    <h3>View a task by name</h3>
    <form method="get" action="/tasks/byName">
        <input type="text" name="name" width="10">
        <input type="submit">
    </form>
</div>
<div>
    <h3>Create or edit a task</h3>
    <form method="post" action="/tasks">
        <div>
            <label for="name">Name: </label>
            <input type="text" id="name" name="name" size="10">
        </div>
        <div>
            <label for="description">Description: </label>
            <input type="text" id="description"
                   name="description" size="20">
        </div>
        <div>
            <label for="priority">Priority: </label>
            <select id="priority" name="priority">
                <option name="Low">Low</option>
                <option name="Medium">Medium</option>
                <option name="High">High</option>
                <option name="Vital">Vital</option>
            </select>
        </div>
        <input type="submit">
    </form>
</div>
</body>
</html>`})]),_:1}),e(i,null,{default:r(()=>t[98]||(t[98]=[n("p",null,[l(" IntelliJ IDEAで再実行ボタン ("),n("img",{src:k,style:{},height:"16",width:"16",alt:"IntelliJ IDEAの再実行アイコン"}),l(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1}),e(i,null,{default:r(()=>t[99]||(t[99]=[n("p",null,[l(" ブラウザで"),n("a",{href:"http://localhost:8080/static/index.html"},[n("a",{href:"http://localhost:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://localhost:8080/static/index.html")]),l("に移動します。タスクの表示、フィルタリング、作成を可能にするリンクボタンと3つのHTMLフォームが表示されるはずです。 ")],-1),n("img",{src:S,alt:"HTMLフォームを表示するWebブラウザ","border-effect":"rounded",width:"706"},null,-1),n("p",null,[n("code",null,"name"),l("または"),n("code",null,"priority"),l("でタスクをフィルタリングする場合、GETリクエストを通じてHTMLフォームを送信していることに注意してください。これは、パラメータがURLの後にクエリ文字列として追加されることを意味します。 ")],-1),n("p",null,[l(" 例えば、"),n("code",null,"Medium"),l("優先度のタスクを検索する場合、サーバーに送信されるリクエストは以下のようになります。 ")],-1),n("code",null,[n("a",{href:"http://localhost:8080/tasks/byPriority?priority=Medium",target:"_blank",rel:"noreferrer"},"http://localhost:8080/tasks/byPriority?priority=Medium")],-1)])),_:1})]),_:1}),e(p,{title:"TaskRepositoryを再利用する",id:"task-repository"},{default:r(()=>[t[104]||(t[104]=n("p",null," タスクのリポジトリは、前のチュートリアルのものと同一のままで構いません。 ",-1)),n("p",null,[e(o,null,{default:r(()=>t[100]||(t[100]=[l("model")])),_:1}),t[102]||(t[102]=l(" パッケージ内に新しい ")),e(o,null,{default:r(()=>t[101]||(t[101]=[l("TaskRepository.kt")])),_:1}),t[103]||(t[103]=l(" ファイルを作成し、以下のコードを追加します。 "))]),e(a,{lang:"kotlin",code:`object TaskRepository {
    private val tasks = mutableListOf(
        Task("cleaning", "Clean the house", Priority.Low),
        Task("gardening", "Mow the lawn", Priority.Medium),
        Task("shopping", "Buy the groceries", Priority.High),
        Task("painting", "Paint the fence", Priority.Medium)
    )

    fun allTasks(): List<Task> = tasks

    fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    fun addTask(task: Task) {
        if (taskByName(task.name) != null) {
            throw IllegalStateException("Cannot duplicate task names!")
        }
        tasks.add(task)
    }
}`})]),_:1}),e(p,{title:"GETリクエストのルートを再利用する",id:"reuse-routes"},{default:r(()=>[t[143]||(t[143]=n("p",null," リポジトリを作成したので、GETリクエストのルートを実装できます。 ",-1)),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[105]||(t[105]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[107]||(t[107]=l(" にある ")),e(o,null,{default:r(()=>t[106]||(t[106]=[l("Templating.kt")])),_:1}),t[108]||(t[108]=l(" ファイルに移動します。 "))]),_:1}),e(i,null,{default:r(()=>[t[129]||(t[129]=n("p",null,[l(" 現在の"),n("code",null,"configureTemplating()"),l("のバージョンを以下の実装に置き換えます。 ")],-1)),e(a,{lang:"kotlin",code:`fun Application.configureTemplating() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/thymeleaf/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        route("/tasks") {
            get {
                val tasks = TaskRepository.allTasks()
                call.respond(
                    ThymeleafContent("all-tasks", mapOf("tasks" to tasks))
                )
            }
            get("/byName") {
                val name = call.request.queryParameters["name"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = TaskRepository.taskByName(name)
                if (task == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@get
                }
                call.respond(
                    ThymeleafContent("single-task", mapOf("task" to task))
                )
            }
            get("/byPriority") {
                val priorityAsText = call.request.queryParameters["priority"]
                if (priorityAsText == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                try {
                    val priority = Priority.valueOf(priorityAsText)
                    val tasks = TaskRepository.tasksByPriority(priority)


                    if (tasks.isEmpty()) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    val data = mapOf(
                        "priority" to priority,
                        "tasks" to tasks
                    )
                    call.respond(ThymeleafContent("tasks-by-priority", data))
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
        }
    }
}`}),t[130]||(t[130]=n("p",null," 上記のコードは次のように要約できます。 ",-1)),e(m,null,{default:r(()=>[n("li",null,[t[110]||(t[110]=n("code",null,"/tasks",-1)),t[111]||(t[111]=l("へのGETリクエストでは、サーバーはリポジトリからすべてのタスクを取得し、 ")),e(o,null,{default:r(()=>t[109]||(t[109]=[l("all-tasks")])),_:1}),t[112]||(t[112]=l(" テンプレートを使用してブラウザに送信される次のビューを生成します。 "))]),n("li",null,[t[114]||(t[114]=n("code",null,"/tasks/byName",-1)),t[115]||(t[115]=l("へのGETリクエストでは、サーバーは")),t[116]||(t[116]=n("code",null,"queryString",-1)),t[117]||(t[117]=l("からパラメータ")),t[118]||(t[118]=n("code",null,"taskName",-1)),t[119]||(t[119]=l("を取得し、一致するタスクを見つけ、 ")),e(o,null,{default:r(()=>t[113]||(t[113]=[l("single-task")])),_:1}),t[120]||(t[120]=l(" テンプレートを使用してブラウザに送信される次のビューを生成します。 "))]),n("li",null,[t[122]||(t[122]=n("code",null,"/tasks/byPriority",-1)),t[123]||(t[123]=l("へのGETリクエストでは、サーバーは")),t[124]||(t[124]=n("code",null,"queryString",-1)),t[125]||(t[125]=l("からパラメータ ")),t[126]||(t[126]=n("code",null,"priority",-1)),t[127]||(t[127]=l("を取得し、一致するタスクを見つけ、 ")),e(o,null,{default:r(()=>t[121]||(t[121]=[l("tasks-by-priority")])),_:1}),t[128]||(t[128]=l(" テンプレートを使用してブラウザに送信される次のビューを生成します。 "))])]),_:1}),t[131]||(t[131]=n("p",null,"これらすべてが機能するには、追加のテンプレートを追加する必要があります。",-1))]),_:1}),e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[132]||(t[132]=[l("src/main/resources/templates/thymeleaf")])),_:1}),t[134]||(t[134]=l(" に移動し、新しい ")),e(o,null,{default:r(()=>t[133]||(t[133]=[l("single-task.html")])),_:1}),t[135]||(t[135]=l(" ファイルを作成します。 "))]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(o,null,{default:r(()=>t[136]||(t[136]=[l("single-task.html")])),_:1}),t[137]||(t[137]=l(" ファイルを開き、以下のコンテンツを追加します。 "))]),e(a,{lang:"html",code:`<!DOCTYPE html >
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>All Current Tasks</title>
</head>
<body>
<h1>The Selected Task</h1>
<table>
    <tbody>
    <tr>
        <th>Name</th>
        <td th:text="\${task.name}"></td>
    </tr>
    <tr>
        <th>Description</th>
        <td th:text="\${task.description}"></td>
    </tr>
    <tr>
        <th>Priority</th>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1}),e(i,null,{default:r(()=>[n("p",null,[t[139]||(t[139]=l("同じフォルダに、 ")),e(o,null,{default:r(()=>t[138]||(t[138]=[l("tasks-by-priority.html")])),_:1}),t[140]||(t[140]=l(" という新しいファイルを作成します。 "))])]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(o,null,{default:r(()=>t[141]||(t[141]=[l("tasks-by-priority.html")])),_:1}),t[142]||(t[142]=l(" ファイルを開き、以下のコンテンツを追加します。 "))]),e(a,{lang:"html",code:`<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Tasks By Priority </title>
</head>
<body>
<h1>Tasks With Priority <span th:text="\${priority}"></span></h1>
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Priority</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="task: \${tasks}">
        <td th:text="\${task.name}"></td>
        <td th:text="\${task.description}"></td>
        <td th:text="\${task.priority}"></td>
    </tr>
    </tbody>
</table>
</body>
</html>`})]),_:1})]),_:1})]),_:1}),e(f,{title:"POSTリクエストのサポートを追加する",id:"add-post-requests"},{default:r(()=>[t[165]||(t[165]=n("p",null,[l(" 次に、以下のことを行うために、"),n("code",null,"/tasks"),l("にPOSTリクエストハンドラーを追加します。 ")],-1)),e(m,null,{default:r(()=>[t[150]||(t[150]=n("li",null,"フォームパラメータから情報を抽出する。",-1)),t[151]||(t[151]=n("li",null,"リポジトリを使用して新しいタスクを追加する。",-1)),n("li",null,[e(d,null,{default:r(()=>t[148]||(t[148]=[l("all-tasks")])),_:1}),t[149]||(t[149]=l("テンプレートを再利用してタスクを表示する。"))])]),_:1}),e(p,null,{default:r(()=>[e(i,null,{default:r(()=>[e(o,null,{default:r(()=>t[152]||(t[152]=[l("src/main/kotlin/com/example/plugins")])),_:1}),t[154]||(t[154]=l(" にある ")),e(o,null,{default:r(()=>t[153]||(t[153]=[l("Templating.kt")])),_:1}),t[155]||(t[155]=l(" ファイルに移動します。 "))]),_:1}),e(i,null,{default:r(()=>[t[156]||(t[156]=n("p",null,[n("code",null,"configureTemplating()"),l("メソッド内に、以下の"),n("code",null,"post"),l("リクエストルートを追加します。 ")],-1)),e(a,{lang:"kotlin",code:`            post {
                val formContent = call.receiveParameters()
                val params = Triple(
                    formContent["name"] ?: "",
                    formContent["description"] ?: "",
                    formContent["priority"] ?: ""
                )
                if (params.toList().any { it.isEmpty() }) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@post
                }
                try {
                    val priority = Priority.valueOf(params.third)
                    TaskRepository.addTask(
                        Task(
                            params.first,
                            params.second,
                            priority
                        )
                    )
                    val tasks = TaskRepository.allTasks()
                    call.respond(
                        ThymeleafContent("all-tasks", mapOf("tasks" to tasks))
                    )
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }`})]),_:1}),e(i,null,{default:r(()=>t[157]||(t[157]=[n("p",null,[l(" IntelliJ IDEAで再実行ボタン ("),n("img",{src:k,style:{},height:"16",width:"16",alt:"IntelliJ IDEAの再実行アイコン"}),l(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1}),e(i,null,{default:r(()=>t[158]||(t[158]=[l(" ブラウザで"),n("a",{href:"http://0.0.0.0:8080/static/index.html"},[n("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1),l("に移動します。 ")])),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(d,null,{default:r(()=>t[159]||(t[159]=[l("Create or edit a task")])),_:1}),t[160]||(t[160]=l(" フォームに新しいタスクの詳細を入力します。 "))]),t[161]||(t[161]=n("img",{src:C,alt:"HTMLフォームを表示するWebブラウザ","border-effect":"rounded",width:"706"},null,-1))]),_:1}),e(i,null,{default:r(()=>[n("p",null,[e(d,null,{default:r(()=>t[162]||(t[162]=[l("Submit")])),_:1}),t[163]||(t[163]=l(" ボタンをクリックしてフォームを送信します。 その後、新しいタスクがすべてのタスクのリストに表示されます。 "))]),t[164]||(t[164]=n("img",{src:E,alt:"タスクのリストを表示するWebブラウザ","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),e(f,{title:"次のステップ",id:"next-steps"},{default:r(()=>[t[169]||(t[169]=n("p",null," おめでとうございます！これで、タスクマネージャーをWebアプリケーションとして再構築し、Thymeleafテンプレートの利用方法を習得しました。",-1)),n("p",null,[t[167]||(t[167]=l(" Webソケットの操作方法を学ぶために、")),e(u,{href:"/ktor/server-create-websocket-application",summary:"WebSocketsの力を活用してコンテンツを送受信する方法を学びます。"},{default:r(()=>t[166]||(t[166]=[l("次のチュートリアル")])),_:1}),t[168]||(t[168]=l("に進んでください。 "))])]),_:1})]),_:1})])}const F=I(L,[["render",H]]);export{W as __pageData,F as default};
