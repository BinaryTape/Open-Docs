import{_ as w,a as N,b as C,c as R,d as J,e as I,f as j,g as H,h as q}from"./chunks/tutorial_creating_restful_apis_delete_task.BtAbUZys.js";import{_ as K}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as g}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as y}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as D,C as u,c as O,o as B,G as o,w as e,j as l,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-create-restful-apis.md","filePath":"ja/ktor/server-create-restful-apis.md","lastUpdated":1755457140000}'),L={name:"ja/ktor/server-create-restful-apis.md"};function M(z,t,G,$,V,U){const T=u("show-structure"),d=u("Links"),v=u("tldr"),S=u("card-summary"),P=u("web-summary"),E=u("link-summary"),f=u("list"),a=u("chapter"),i=u("step"),m=u("control"),s=u("Path"),p=u("procedure"),r=u("code-block"),b=u("format"),k=u("ui-path"),x=u("note"),A=u("topic");return B(),O("div",null,[o(A,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"KtorでKotlinのRESTful APIを作成する方法",id:"server-create-restful-apis","help-id":"create-restful-apis"},{default:e(()=>[o(T,{for:"chapter",depth:"2"}),o(v,null,{default:e(()=>[t[9]||(t[9]=l("p",null,[l("b",null,"コード例"),n(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-restful-api"}," tutorial-server-restful-api ")],-1)),l("p",null,[t[3]||(t[3]=l("b",null,"使用プラグイン",-1)),t[4]||(t[4]=n(": ")),o(d,{href:"/ktor/server-routing",summary:"ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。"},{default:e(()=>t[0]||(t[0]=[n("ルーティング")])),_:1}),t[5]||(t[5]=n("、")),o(d,{href:"/ktor/server-static-content",summary:"スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学習します。"},{default:e(()=>t[1]||(t[1]=[n("静的コンテンツ")])),_:1}),t[6]||(t[6]=n("、 ")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプをネゴシエートすることと、コンテンツを特定の形式でシリアライズ/デシリアライズすることという、2つの主要な目的を果たします。"},{default:e(()=>t[2]||(t[2]=[n("コンテンツネゴシエーション")])),_:1}),t[7]||(t[7]=n("、 ")),t[8]||(t[8]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),o(S,null,{default:e(()=>t[10]||(t[10]=[n(" KtorでRESTful APIを構築する方法を学びます。このチュートリアルでは、実際の例でセットアップ、ルーティング、テストについて説明します。 ")])),_:1}),o(P,null,{default:e(()=>t[11]||(t[11]=[n(" KtorでKotlinのRESTful APIを構築する方法を学びます。このチュートリアルでは、実際の例でセットアップ、ルーティング、テストについて説明します。Kotlinバックエンド開発者にとって理想的な入門チュートリアルです。 ")])),_:1}),o(E,null,{default:e(()=>t[12]||(t[12]=[n(" KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。 ")])),_:1}),t[203]||(t[203]=l("p",null," このチュートリアルでは、KotlinとKtorを使用してバックエンドサービスを構築する方法を説明します。JSONファイルを生成するRESTful APIの例も紹介します。 ",-1)),l("p",null,[o(d,{href:"/ktor/server-requests-and-responses",summary:"タスク管理アプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。"},{default:e(()=>t[13]||(t[13]=[n("以前のチュートリアル")])),_:1}),t[14]||(t[14]=n("では、バリデーション、エラーハンドリング、ユニットテストの基礎を紹介しました。このチュートリアルでは、タスクを管理するためのRESTfulサービスを作成することで、これらのトピックを拡張します。 "))]),t[204]||(t[204]=l("p",null," 次のことを学習します。 ",-1)),o(f,null,{default:e(()=>[t[17]||(t[17]=l("li",null,"JSONシリアライズを使用するRESTfulサービスを作成する。",-1)),l("li",null,[o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプをネゴシエートすることと、コンテンツを特定の形式でシリアライズ/デシリアライズすることという、2つの主要な目的を果たします。"},{default:e(()=>t[15]||(t[15]=[n("コンテンツネゴシエーション")])),_:1}),t[16]||(t[16]=n("のプロセスを理解する。"))]),t[18]||(t[18]=l("li",null,"Ktor内でREST APIのルートを定義する。",-1))]),_:1}),o(a,{title:"前提条件",id:"prerequisites"},{default:e(()=>[l("p",null,[t[20]||(t[20]=n("このチュートリアルは単独で行うこともできますが、 ")),o(d,{href:"/ktor/server-requests-and-responses",summary:"タスク管理アプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。"},{default:e(()=>t[19]||(t[19]=[n("リクエストを処理してレスポンスを生成する")])),_:1}),t[21]||(t[21]=n("方法を学ぶために、先行するチュートリアルを完了することを強くお勧めします。 "))]),t[22]||(t[22]=l("p",null,[l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),n("をインストールすることをお勧めしますが、任意のIDEを使用することもできます。 ")],-1))]),_:1}),o(a,{title:"Hello RESTfulタスクマネージャー",id:"hello-restful-task-manager"},{default:e(()=>[l("p",null,[t[24]||(t[24]=n("このチュートリアルでは、既存のタスクマネージャーをRESTfulサービスとして書き換えます。これを行うには、いくつかのKtor ")),o(d,{href:"/ktor/server-plugins",summary:"プラグインは、シリアライズ、コンテンツエンコーディング、圧縮などの共通機能を提供します。"},{default:e(()=>t[23]||(t[23]=[n("プラグイン")])),_:1}),t[25]||(t[25]=n("を使用します。"))]),t[62]||(t[62]=l("p",null," 既存のプロジェクトに手動で追加することもできますが、新しいプロジェクトを生成し、以前のチュートリアルのコードを段階的に追加する方が簡単です。すべてのコードを繰り返していくので、以前のプロジェクトを手元に置く必要はありません。 ",-1)),o(p,{title:"プラグインを使用して新しいプロジェクトを作成する"},{default:e(()=>[o(i,null,{default:e(()=>t[26]||(t[26]=[l("p",null,[l("a",{href:"https://start.ktor.io/"},"Ktorプロジェクトジェネレーター"),n("に移動します。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[27]||(t[27]=[n("Project artifact")])),_:1}),t[29]||(t[29]=n(" フィールドに、プロジェクトアーティファクトの名前として")),o(s,null,{default:e(()=>t[28]||(t[28]=[n("com.example.ktor-rest-task-app")])),_:1}),t[30]||(t[30]=n("を入力します。 ")),t[31]||(t[31]=l("img",{src:w,alt:"Ktorプロジェクトジェネレーターでのプロジェクトアーティファクトの命名",style:{},"border-effect":"line",width:"706"},null,-1))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[33]||(t[33]=n(" プラグインセクションで、")),o(m,null,{default:e(()=>t[32]||(t[32]=[n("Add")])),_:1}),t[34]||(t[34]=n("ボタンをクリックして次のプラグインを検索し、追加します。 "))]),o(f,{type:"bullet"},{default:e(()=>t[35]||(t[35]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1)])),_:1}),t[36]||(t[36]=l("p",null,[l("img",{src:K,alt:"Ktorプロジェクトジェネレーターでのプラグインの追加","border-effect":"line",style:{},width:"706"}),n(" プラグインを追加すると、プロジェクト設定の下に4つのプラグインすべてがリストされます。 "),l("img",{src:N,alt:"Ktorプロジェクトジェネレーターのプラグインリスト","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[37]||(t[37]=[n("Download")])),_:1}),t[38]||(t[38]=n("ボタンをクリックして、Ktorプロジェクトを生成しダウンロードします。 "))])]),_:1})]),_:1}),o(p,{title:"スターターコードを追加する",id:"add-starter-code"},{default:e(()=>[o(i,null,{default:e(()=>t[39]||(t[39]=[l("p",null,[n("以前に"),l("a",{href:"./server-create-a-new-project#open-explore-run"},"IntelliJ IDEAでKtorプロジェクトを開き、探索し、実行する"),n("チュートリアルで説明したように、IntelliJ IDEAでプロジェクトを開きます。")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[40]||(t[40]=[n("src/main/kotlin/com/example")])),_:1}),t[42]||(t[42]=n("に移動し、")),o(s,null,{default:e(()=>t[41]||(t[41]=[n("model")])),_:1}),t[43]||(t[43]=n("というサブパッケージを作成します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[44]||(t[44]=[n("model")])),_:1}),t[46]||(t[46]=n("パッケージ内に、新しい")),o(s,null,{default:e(()=>t[45]||(t[45]=[n("Task.kt")])),_:1}),t[47]||(t[47]=n("ファイルを作成します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[48]||(t[48]=[n("Task.kt")])),_:1}),t[49]||(t[49]=n("ファイルを開き、優先順位を表す")),t[50]||(t[50]=l("code",null,"enum",-1)),t[51]||(t[51]=n("とタスクを表す")),t[52]||(t[52]=l("code",null,"class",-1)),t[53]||(t[53]=n("を追加します。 "))]),o(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[54]||(t[54]=l("p",null,[n(" 以前のチュートリアルでは、拡張関数を使用して"),l("code",null,"Task"),n("をHTMLに変換しました。この場合、 "),l("code",null,"Task"),n("クラスは"),l("code",null,"kotlinx.serialization"),n("ライブラリの"),l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"},[l("code",null,"Serializable")]),n("型でアノテーションが付けられています。 ")],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[55]||(t[55]=[n("Routing.kt")])),_:1}),t[56]||(t[56]=n("ファイルを開き、既存のコードを以下の実装に置き換えます。 "))]),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            get("/tasks") {
                                call.respond(
                                    listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )
                                )
                            }
                        }
                    }`}),t[57]||(t[57]=l("p",null,[n(" 以前のチュートリアルと同様に、URL "),l("code",null,"/tasks"),n("へのGETリクエストのルートを作成しました。 今回は、手動でタスクリストを変換するのではなく、単にリストを返しています。 ")],-1))]),_:1}),o(i,null,{default:e(()=>t[58]||(t[58]=[l("p",null,[n("IntelliJ IDEAで、実行ボタン ("),l("img",{src:g,style:{},height:"16",width:"16",alt:"intelliJ IDEA run icon"}),n(") をクリックしてアプリケーションを開始します。")],-1)])),_:1}),o(i,null,{default:e(()=>t[59]||(t[59]=[l("p",null,[n(" ブラウザで"),l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("に移動します。以下に示すように、タスクリストのJSONバージョンが表示されるはずです。 ")],-1)])),_:1}),t[60]||(t[60]=l("img",{src:C,alt:"ブラウザ画面に表示されたJSONデータ","border-effect":"rounded",width:"706"},null,-1)),t[61]||(t[61]=l("p",null,"明らかに、私たちの代わりに多くの作業が実行されています。一体何が起こっているのでしょうか？",-1))]),_:1})]),_:1}),o(a,{title:"コンテンツネゴシエーションを理解する",id:"content-negotiation"},{default:e(()=>[o(a,{title:"ブラウザ経由のコンテンツネゴシエーション",id:"via-browser"},{default:e(()=>[l("p",null,[t[65]||(t[65]=n(" プロジェクトを作成したとき、")),o(d,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプをネゴシエートすることと、コンテンツを特定の形式でシリアライズ/デシリアライズすることという、2つの主要な目的を果たします。"},{default:e(()=>t[63]||(t[63]=[n("Content Negotiation")])),_:1}),t[66]||(t[66]=n("プラグインを含めました。このプラグインは、 クライアントがレンダリングできるコンテンツのタイプを調べ、これらを現在のサービスが提供できるコンテンツタイプと照合します。これが")),o(b,{style:{}},{default:e(()=>t[64]||(t[64]=[n("コンテンツネゴシエーション")])),_:1}),t[67]||(t[67]=n("という用語の由来です。 "))]),t[73]||(t[73]=l("p",null,[n(" HTTPでは、クライアントは"),l("code",null,"Accept"),n("ヘッダーを介してレンダリングできるコンテンツタイプを通知します。このヘッダーの値は1つ以上のコンテンツタイプです。上記の場合、ブラウザに組み込まれている開発ツールを使用して、このヘッダーの値を調べることができます。 ")],-1)),t[74]||(t[74]=l("p",null," 次の例を検討してください。 ",-1)),o(r,{code:"                text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}),t[75]||(t[75]=l("p",null,[l("code",null,[l("em",null,"/")]),n("の組み込みに注意してください。このヘッダーは、HTML、XML、または画像を_受け入れる_ことを示していますが、 他のコンテンツタイプも_受け入れます_。")],-1)),l("p",null,[t[70]||(t[70]=n("Content Negotiationプラグインは、ブラウザにデータを送り返す形式を見つける必要があります。プロジェクトの生成されたコードを調べると、")),o(s,null,{default:e(()=>t[68]||(t[68]=[n("src/main/kotlin/com/example")])),_:1}),t[71]||(t[71]=n("内に")),o(s,null,{default:e(()=>t[69]||(t[69]=[n("Serialization.kt")])),_:1}),t[72]||(t[72]=n("というファイルがあり、次の内容が含まれています。"))]),o(r,{lang:"kotlin",code:`    install(ContentNegotiation) {
        json()
    }`}),t[76]||(t[76]=l("p",null,[n(" このコードは"),l("code",null,"ContentNegotiation"),n("プラグインをインストールし、"),l("code",null,"kotlinx.serialization"),n("プラグインも構成します。これにより、クライアントがリクエストを送信すると、サーバーはJSONとしてシリアライズされたオブジェクトを返送できます。 ")],-1)),t[77]||(t[77]=l("p",null,[n(" ブラウザからのリクエストの場合、"),l("code",null,"ContentNegotiation"),n("プラグインはJSONのみを返すことができることを認識しており、ブラウザは送信されたものを表示しようとします。したがって、リクエストは成功します。 ")],-1))]),_:1}),o(p,{title:"JavaScript経由のコンテンツネゴシエーション",id:"via-javascript"},{default:e(()=>[t[91]||(t[91]=l("p",null,[n(" 本番環境では、JSONをブラウザに直接表示したくありません。代わりに、ブラウザ内でJavaScriptコードが実行され、リクエストを行い、返されたデータをシングルページアプリケーション（SPA）の一部として表示します。通常、この種のアプリケーションは"),l("a",{href:"https://react.dev/"},"React"),n("、 "),l("a",{href:"https://angular.io/"},"Angular"),n("、 または"),l("a",{href:"https://vuejs.org/"},"Vue.js"),n("のようなフレームワークを使用して記述されます。 ")],-1)),o(i,null,{default:e(()=>[l("p",null,[t[80]||(t[80]=n(" これをシミュレートするには、")),o(s,null,{default:e(()=>t[78]||(t[78]=[n("src/main/resources/static")])),_:1}),t[81]||(t[81]=n("内の")),o(s,null,{default:e(()=>t[79]||(t[79]=[n("index.html")])),_:1}),t[82]||(t[82]=n("ページを開き、デフォルトのコンテンツを次のもので置き換えます。 "))]),o(r,{lang:"html",code:`<html>
<head>
    <title>A Simple SPA For Tasks</title>
    <script type="application/javascript">
        function fetchAndDisplayTasks() {
            fetchTasks()
                .then(tasks => displayTasks(tasks))
        }

        function fetchTasks() {
            return fetch(
                "/tasks",
                {
                    headers: { 'Accept': 'application/json' }
                }
            ).then(resp => resp.json());
        }

        function displayTasks(tasks) {
            const tasksTableBody = document.getElementById("tasksTableBody")
            tasks.forEach(task => {
                const newRow = taskRow(task);
                tasksTableBody.appendChild(newRow);
            });
        }

        function taskRow(task) {
            return tr([
                td(task.name),
                td(task.description),
                td(task.priority)
            ]);
        }

        function tr(children) {
            const node = document.createElement("tr");
            children.forEach(child => node.appendChild(child));
            return node;
        }

        function td(text) {
            const node = document.createElement("td");
            node.appendChild(document.createTextNode(text));
            return node;
        }
    <\/script>
</head>
<body>
<h1>Viewing Tasks Via JS</h1>
<form action="javascript:fetchAndDisplayTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table>
    <thead>
    <tr><th>Name</th><th>Description</th><th>Priority</th></tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),t[83]||(t[83]=l("p",null,[n(" このページにはHTMLフォームと空のテーブルが含まれています。フォームを送信すると、JavaScriptイベントハンドラーが "),l("code",null,"Accept"),n("ヘッダーを"),l("code",null,"application/json"),n("に設定して"),l("code",null,"/tasks"),n("エンドポイントにリクエストを送信します。返されたデータはデシリアライズされ、HTMLテーブルに追加されます。 ")],-1))]),_:1}),o(i,null,{default:e(()=>t[84]||(t[84]=[l("p",null,[n(" IntelliJ IDEAで、再実行ボタン ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"intelliJ IDEA rerun icon"}),n(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[86]||(t[86]=n(" URL ")),t[87]||(t[87]=l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1)),t[88]||(t[88]=n("に移動します。 ")),o(m,null,{default:e(()=>t[85]||(t[85]=[n("View The Tasks")])),_:1}),t[89]||(t[89]=n("ボタンをクリックしてデータを取得できるはずです。 "))]),t[90]||(t[90]=l("img",{src:R,alt:"ボタンとHTMLテーブルとして表示されたタスクを示すブラウザウィンドウ","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"GETルートを追加する",id:"porting-get-routes"},{default:e(()=>[l("p",null,[t[93]||(t[93]=n(" コンテンツネゴシエーションのプロセスに慣れたところで、")),o(d,{href:"/ktor/server-requests-and-responses",summary:"タスク管理アプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。"},{default:e(()=>t[92]||(t[92]=[n("以前のチュートリアル")])),_:1}),t[94]||(t[94]=n("の機能をこのチュートリアルに転送し続けます。 "))]),o(a,{title:"タスクリポジトリを再利用する",id:"task-repository"},{default:e(()=>[t[101]||(t[101]=l("p",null," タスクのリポジトリは修正なしで再利用できるので、まずそれを行います。 ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[95]||(t[95]=[n("model")])),_:1}),t[97]||(t[97]=n("パッケージ内に新しい")),o(s,null,{default:e(()=>t[96]||(t[96]=[n("TaskRepository.kt")])),_:1}),t[98]||(t[98]=n("ファイルを作成します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[99]||(t[99]=[n("TaskRepository.kt")])),_:1}),t[100]||(t[100]=n("を開き、以下のコードを追加します。 "))]),o(r,{lang:"kotlin",code:`package com.example.model

object TaskRepository {
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
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"GETリクエストのルートを再利用する",id:"get-requests"},{default:e(()=>[t[110]||(t[110]=l("p",null," リポジトリを作成したので、GETリクエストのルートを実装できます。タスクをHTMLに変換する心配をする必要がないため、以前のコードを簡略化できます。 ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[102]||(t[102]=[n("src/main/kotlin/com/example")])),_:1}),t[104]||(t[104]=n("内の")),o(s,null,{default:e(()=>t[103]||(t[103]=[n("Routing.kt")])),_:1}),t[105]||(t[105]=n("ファイルに移動します。 "))])]),_:1}),o(i,null,{default:e(()=>[t[107]||(t[107]=l("p",null,[l("code",null,"Application.configureRouting()"),n("関数内の"),l("code",null,"/tasks"),n("ルートのコードを以下の実装で更新します。 ")],-1)),o(r,{lang:"kotlin",code:`                    package com.example

                    import com.example.model.Priority
                    import com.example.model.TaskRepository
                    import io.ktor.http.*
                    import io.ktor.server.application.*
                    import io.ktor.server.http.content.*
                    import io.ktor.server.response.*
                    import io.ktor.server.routing.*

                    fun Application.configureRouting() {
                        routing {
                            staticResources("static", "static")

                            //updated implementation
                            route("/tasks") {
                                get {
                                    val tasks = TaskRepository.allTasks()
                                    call.respond(tasks)
                                }

                                get("/byName/{taskName}") {
                                    val name = call.parameters["taskName"]
                                    if (name == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@get
                                    }

                                    val task = TaskRepository.taskByName(name)
                                    if (task == null) {
                                        call.respond(HttpStatusCode.NotFound)
                                        return@get
                                    }
                                    call.respond(task)
                                }
                                get("/byPriority/{priority}") {
                                    val priorityAsText = call.parameters["priority"]
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
                                        call.respond(tasks)
                                    } catch (ex: IllegalArgumentException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[108]||(t[108]=l("p",null," これにより、サーバーは次のGETリクエストに応答できます。",-1)),o(f,null,{default:e(()=>t[106]||(t[106]=[l("li",null,[l("code",null,"/tasks"),n(": リポジトリ内のすべてのタスクを返します。")],-1),l("li",null,[l("code",null,"/tasks/byName/{taskName}"),n(": 指定された"),l("code",null,"taskName"),n("でフィルタリングされたタスクを返します。 ")],-1),l("li",null,[l("code",null,"/tasks/byPriority/{priority}"),n(": 指定された"),l("code",null,"priority"),n("でフィルタリングされたタスクを返します。 ")],-1)])),_:1})]),_:1}),o(i,null,{default:e(()=>t[109]||(t[109]=[l("p",null,[n(" IntelliJ IDEAで、再実行ボタン ("),l("img",{src:y,style:{},height:"16",width:"16",alt:"intelliJ IDEA rerun icon"}),n(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1})]),_:1})]),_:1}),o(a,{title:"機能をテストする",id:"test-tasks-routes"},{default:e(()=>[o(p,{title:"ブラウザを使用する"},{default:e(()=>t[111]||(t[111]=[l("p",null,[n("これらのルートはブラウザでテストできます。たとえば、"),l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"},[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("に移動すると、"),l("code",null,"Medium"),n("優先順位のすべてのタスクがJSON形式で表示されます。")],-1),l("img",{src:J,alt:"中優先順位のタスクがJSON形式で表示されたブラウザウィンドウ","border-effect":"rounded",width:"706"},null,-1),l("p",null,[n(" これらの種類のリクエストは通常JavaScriptから来ることを考えると、よりきめ細かなテストが望ましいです。これには、"),l("a",{href:"https://learning.postman.com/docs/sending-requests/requests/"},"Postman"),n("などの専用ツールを使用できます。 ")],-1)])),_:1}),o(p,{title:"Postmanを使用する"},{default:e(()=>[o(i,null,{default:e(()=>t[112]||(t[112]=[l("p",null,[n("Postmanで、URL "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks/byPriority/Medium")]),n("で新しいGETリクエストを作成します。")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(k,null,{default:e(()=>t[113]||(t[113]=[n("Headers")])),_:1}),t[115]||(t[115]=n("ペインで、")),o(k,null,{default:e(()=>t[114]||(t[114]=[n("Accept")])),_:1}),t[116]||(t[116]=n("ヘッダーの値を")),t[117]||(t[117]=l("code",null,"application/json",-1)),t[118]||(t[118]=n("に設定します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[119]||(t[119]=[n("Send")])),_:1}),t[120]||(t[120]=n("をクリックしてリクエストを送信し、レスポンスビューアーでレスポンスを確認します。 "))]),t[121]||(t[121]=l("img",{src:I,alt:"Postmanで中優先順位のタスクをJSON形式で示すGETリクエスト","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(p,{title:"HTTPリクエストファイルを使用する"},{default:e(()=>[t[132]||(t[132]=l("p",null,"IntelliJ IDEA Ultimateでは、HTTPリクエストファイルで同じ手順を実行できます。",-1)),o(i,null,{default:e(()=>[l("p",null,[t[123]||(t[123]=n(" プロジェクトのルートディレクトリに、新しい")),o(s,null,{default:e(()=>t[122]||(t[122]=[n("REST Task Manager.http")])),_:1}),t[124]||(t[124]=n("ファイルを作成します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[125]||(t[125]=[n("REST Task Manager.http")])),_:1}),t[126]||(t[126]=n("ファイルを開き、次のGETリクエストを追加します。 "))]),o(r,{lang:"http",code:`GET http://0.0.0.0:8080/tasks/byPriority/Medium
Accept: application/json`})]),_:1}),o(i,null,{default:e(()=>t[127]||(t[127]=[l("p",null,[n(" IntelliJ IDE内でリクエストを送信するには、その横にあるガターアイコン ("),l("img",{alt:"intelliJ IDEA gutter icon",src:g,width:"16",height:"26"}),n(") をクリックします。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[t[129]||(t[129]=n("これは")),o(s,null,{default:e(()=>t[128]||(t[128]=[n("Services")])),_:1}),t[130]||(t[130]=n("ツールウィンドウで開かれ、実行されます。 "))]),t[131]||(t[131]=l("img",{src:j,alt:"HTTPファイルで中優先順位のタスクをJSON形式で示すGETリクエスト","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1}),o(x,null,{default:e(()=>t[133]||(t[133]=[n(" ルートをテストする別の方法として、Kotlin Notebook内から"),l("a",{href:"https://khttp.readthedocs.io/en/latest/"},"khttp",-1),n("ライブラリを使用することもできます。 ")])),_:1})]),_:1})]),_:1}),o(a,{title:"POSTリクエストのルートを追加する",id:"add-a-route-for-post-requests"},{default:e(()=>[t[150]||(t[150]=l("p",null,[n(" 以前のチュートリアルでは、HTMLフォームを介してタスクが作成されました。しかし、今回はRESTfulサービスを構築しているため、その必要はありません。代わりに、"),l("code",null,"kotlinx.serialization"),n("フレームワークを使用し、ほとんどの重い処理を任せます。 ")],-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[134]||(t[134]=[n("src/main/kotlin/com/example")])),_:1}),t[136]||(t[136]=n("内の")),o(s,null,{default:e(()=>t[135]||(t[135]=[n("Routing.kt")])),_:1}),t[137]||(t[137]=n("ファイルを開きます。 "))])]),_:1}),o(i,null,{default:e(()=>[t[138]||(t[138]=l("p",null,[l("code",null,"Application.configureRouting()"),n("関数に新しいPOSTルートを次のように追加します。 ")],-1)),o(r,{lang:"kotlin",code:`                    //...

                    fun Application.configureRouting() {
                        routing {
                            //...

                            route("/tasks") {
                                //...

                                //add the following new route
                                post {
                                    try {
                                        val task = call.receive<Task>()
                                        TaskRepository.addTask(task)
                                        call.respond(HttpStatusCode.Created)
                                    } catch (ex: IllegalStateException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    } catch (ex: SerializationException) {
                                        call.respond(HttpStatusCode.BadRequest)
                                    }
                                }
                            }
                        }
                    }`}),t[139]||(t[139]=l("p",null," 次の新しいインポートを追加します。 ",-1)),o(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.Task
                    import io.ktor.serialization.*
                    import io.ktor.server.request.*`}),t[140]||(t[140]=l("p",null,[n(" POSTリクエストが"),l("code",null,"/tasks"),n("に送信されると、"),l("code",null,"kotlinx.serialization"),n("フレームワークがリクエストのボディを"),l("code",null,"Task"),n("オブジェクトに変換するために使用されます。これが成功すると、タスクがリポジトリに追加されます。デシリアライズプロセスが失敗した場合は、サーバーは"),l("code",null,"SerializationException"),n("を処理する必要があり、タスクが重複している場合は"),l("code",null,"IllegalStateException"),n("を処理する必要があります。 ")],-1))]),_:1}),o(i,null,{default:e(()=>t[141]||(t[141]=[l("p",null," アプリケーションを再起動します。 ",-1)])),_:1}),o(i,null,{default:e(()=>t[142]||(t[142]=[l("p",null,[n(" この機能をPostmanでテストするには、URL "),l("code",null,[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("に新しいPOSTリクエストを作成します。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(k,null,{default:e(()=>t[143]||(t[143]=[n("Body")])),_:1}),t[144]||(t[144]=n("ペインに、新しいタスクを表す次のJSONドキュメントを追加します。 "))]),o(r,{lang:"json",code:`{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`}),t[145]||(t[145]=l("img",{src:H,alt:"新しいタスクを追加するためのPostmanでのPOSTリクエスト","border-effect":"line",width:"706"},null,-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(m,null,{default:e(()=>t[146]||(t[146]=[n("Send")])),_:1}),t[147]||(t[147]=n("をクリックしてリクエストを送信します。 "))])]),_:1}),o(i,null,{default:e(()=>t[148]||(t[148]=[l("p",null,[l("a",{href:"http://0.0.0.0:8080/tasks"},[l("a",{href:"http://0.0.0.0:8080/tasks",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/tasks")]),n("にGETリクエストを送信することで、タスクが追加されたことを確認できます。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[t[149]||(t[149]=l("p",null," IntelliJ IDEA Ultimateでは、HTTPリクエストファイルに次を追加することで同じ手順を実行できます。 ",-1)),o(r,{lang:"http",code:`###

POST http://0.0.0.0:8080/tasks
Content-Type: application/json

{
    "name": "cooking",
    "description": "Cook the dinner",
    "priority": "High"
}`})]),_:1})]),_:1})]),_:1}),o(a,{title:"削除のサポートを追加する",id:"remove-tasks"},{default:e(()=>[t[165]||(t[165]=l("p",null," サービスの基本的な操作の追加はほぼ完了しました。これらはしばしばCRUD操作（作成、読み取り、更新、削除の略）として要約されます。次に、削除操作を実装します。 ",-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[151]||(t[151]=[n("TaskRepository.kt")])),_:1}),t[152]||(t[152]=n("ファイルで、")),t[153]||(t[153]=l("code",null,"TaskRepository",-1)),t[154]||(t[154]=n("オブジェクト内に、名前でタスクを削除する次のメソッドを追加します。 "))]),o(r,{lang:"kotlin",code:`    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }`})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[155]||(t[155]=[n("Routing.kt")])),_:1}),t[156]||(t[156]=n("ファイルを開き、DELETEリクエストを処理するためのエンドポイントを")),t[157]||(t[157]=l("code",null,"routing()",-1)),t[158]||(t[158]=n("関数に追加します。 "))]),o(r,{lang:"kotlin",code:`                    fun Application.configureRouting() {
                        //...

                        routing {
                            route("/tasks") {
                                //...
                                //add the following function
                                delete("/{taskName}") {
                                    val name = call.parameters["taskName"]
                                    if (name == null) {
                                        call.respond(HttpStatusCode.BadRequest)
                                        return@delete
                                    }

                                    if (TaskRepository.removeTask(name)) {
                                        call.respond(HttpStatusCode.NoContent)
                                    } else {
                                        call.respond(HttpStatusCode.NotFound)
                                    }
                                }
                            }
                        }
                    }`})]),_:1}),o(i,null,{default:e(()=>t[159]||(t[159]=[l("p",null," アプリケーションを再起動します。 ",-1)])),_:1}),o(i,null,{default:e(()=>[t[160]||(t[160]=l("p",null," HTTPリクエストファイルに次のDELETEリクエストを追加します。 ",-1)),o(r,{lang:"http",code:`###

DELETE http://0.0.0.0:8080/tasks/gardening`})]),_:1}),o(i,null,{default:e(()=>t[161]||(t[161]=[l("p",null,[n(" IntelliJ IDE内でDELETEリクエストを送信するには、その横にあるガターアイコン ("),l("img",{alt:"intelliJ IDEA gutter icon",src:g,width:"16",height:"26"}),n(") をクリックします。 ")],-1)])),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[162]||(t[162]=[n("Services")])),_:1}),t[163]||(t[163]=n("ツールウィンドウにレスポンスが表示されます。 "))]),t[164]||(t[164]=l("img",{src:q,alt:"HTTPリクエストファイル内のDELETEリクエスト","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"Ktorクライアントでユニットテストを作成する",id:"create-unit-tests"},{default:e(()=>[l("p",null,[t[167]||(t[167]=n(" これまではアプリケーションを手動でテストしていましたが、既にお気づきのとおり、このアプローチは時間がかかり、スケーラブルではありません。代わりに、組み込みの ")),t[168]||(t[168]=l("code",null,"client",-1)),t[169]||(t[169]=n("オブジェクトを使用してJSONを取得し、デシリアライズする")),o(d,{href:"/ktor/server-testing",summary:"特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学習します。"},{default:e(()=>t[166]||(t[166]=[n("JUnitテスト")])),_:1}),t[170]||(t[170]=n("を実装できます。 "))]),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[171]||(t[171]=[n("src/test/kotlin/com/example")])),_:1}),t[173]||(t[173]=n("内の")),o(s,null,{default:e(()=>t[172]||(t[172]=[n("ApplicationTest.kt")])),_:1}),t[174]||(t[174]=n("ファイルを開きます。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[175]||(t[175]=[n("ApplicationTest.kt")])),_:1}),t[176]||(t[176]=n("ファイルの内容を次のもので置き換えます。 "))]),o(r,{lang:"kotlin",code:`package com.example

import com.example.model.Priority
import com.example.model.Task
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val response = client.get("/tasks/byPriority/Medium")
        val results = response.body<List<Task>>()

        assertEquals(HttpStatusCode.OK, response.status)

        val expectedTaskNames = listOf("gardening", "painting")
        val actualTaskNames = results.map(Task::name)
        assertContentEquals(expectedTaskNames, actualTaskNames)
    }

    @Test
    fun invalidPriorityProduces400() = testApplication {
        application {
            module()
        }
        val response = client.get("/tasks/byPriority/Invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }


    @Test
    fun unusedPriorityProduces404() = testApplication {
        application {
            module()
        }
        val response = client.get("/tasks/byPriority/Vital")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            module()
        }
        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val task = Task("swimming", "Go to the beach", Priority.Low)
        val response1 = client.post("/tasks") {
            header(
                HttpHeaders.ContentType,
                ContentType.Application.Json
            )

            setBody(task)
        }
        assertEquals(HttpStatusCode.Created, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2
            .body<List<Task>>()
            .map { it.name }

        assertContains(taskNames, "swimming")
    }
}`}),t[177]||(t[177]=l("p",null,[n(" サーバーで行ったのと同様に、"),l("a",{href:"./client-create-and-configure#plugins"},"プラグイン"),n("に"),l("code",null,"ContentNegotiation"),n("プラグインと"),l("code",null,"kotlinx.serialization"),n("プラグインをインストールする必要があることに注意してください。 ")],-1))]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[178]||(t[178]=[n("gradle/libs.versions.toml")])),_:1}),t[179]||(t[179]=n("にあるバージョンカタログに次の依存関係を追加します。 "))]),o(r,{lang:"yaml",code:`                    [libraries]
                    # ...
                    ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[180]||(t[180]=[n("build.gradle.kts")])),_:1}),t[181]||(t[181]=n("ファイルに新しい依存関係を追加します。 "))]),o(r,{lang:"kotlin",code:"                    testImplementation(libs.ktor.client.content.negotiation)"})]),_:1})]),_:1})]),_:1}),o(a,{title:"JsonPathでユニットテストを作成する",id:"unit-tests-via-jsonpath"},{default:e(()=>[t[196]||(t[196]=l("p",null," Ktorクライアントや類似のライブラリでサービスをテストするのは便利ですが、品質保証（QA）の観点から見ると欠点があります。サーバーはJSONを直接処理しないため、JSON構造に関する前提が正しいかどうかを確実に判断できません。 ",-1)),t[197]||(t[197]=l("p",null," たとえば、次のような前提です。 ",-1)),o(f,null,{default:e(()=>t[182]||(t[182]=[l("li",null,[n("値が実際には"),l("code",null,"object"),n("が使用されているにもかかわらず、"),l("code",null,"array"),n("に格納されている。")],-1),l("li",null,[n("プロパティが実際には"),l("code",null,"strings"),n("であるにもかかわらず、"),l("code",null,"numbers"),n("として格納されている。")],-1),l("li",null,"メンバーが宣言順にシリアライズされていないのに、そのようにされている。",-1)])),_:1}),t[198]||(t[198]=l("p",null,[n(" サービスが複数のクライアントで使用されることを意図している場合、JSON構造に信頼性を持たせることは非常に重要です。これを実現するには、Ktorクライアントを使用してサーバーからテキストを取得し、"),l("a",{href:"https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path"},"JSONPath"),n(" ライブラリを使用してこのコンテンツを分析します。")],-1)),o(p,null,{default:e(()=>[o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[183]||(t[183]=[n("build.gradle.kts")])),_:1}),t[184]||(t[184]=n("ファイルで、")),t[185]||(t[185]=l("code",null,"dependencies",-1)),t[186]||(t[186]=n("ブロックにJSONPathライブラリを追加します。 "))]),o(r,{lang:"kotlin",code:'    testImplementation("com.jayway.jsonpath:json-path:2.9.0")'})]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[187]||(t[187]=[n("src/test/kotlin/com/example")])),_:1}),t[189]||(t[189]=n("フォルダに移動し、新しい")),o(s,null,{default:e(()=>t[188]||(t[188]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[190]||(t[190]=n("ファイルを作成します。 "))])]),_:1}),o(i,null,{default:e(()=>[l("p",null,[o(s,null,{default:e(()=>t[191]||(t[191]=[n("ApplicationJsonPathTest.kt")])),_:1}),t[192]||(t[192]=n("ファイルを開き、以下のコンテンツを追加します。 "))]),o(r,{lang:"kotlin",code:`package com.example

import com.jayway.jsonpath.DocumentContext
import com.jayway.jsonpath.JsonPath
import io.ktor.client.*
import com.example.model.Priority
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*


class ApplicationJsonPathTest {
    @Test
    fun tasksCanBeFound() = testApplication {
        application {
            module()
        }
        val jsonDoc = client.getAsJsonPath("/tasks")

        val result: List<String> = jsonDoc.read("$[*].name")
        assertEquals("cleaning", result[0])
        assertEquals("gardening", result[1])
        assertEquals("shopping", result[2])
    }

    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application {
            module()
        }
        val priority = Priority.Medium
        val jsonDoc = client.getAsJsonPath("/tasks/byPriority/$priority")

        val result: List<String> =
            jsonDoc.read("$[?(@.priority == '$priority')].name")
        assertEquals(2, result.size)

        assertEquals("gardening", result[0])
        assertEquals("painting", result[1])
    }

    suspend fun HttpClient.getAsJsonPath(url: String): DocumentContext {
        val response = this.get(url) {
            accept(ContentType.Application.Json)
        }
        return JsonPath.parse(response.bodyAsText())
    }
}`}),t[194]||(t[194]=l("p",null," JsonPathクエリは次のように機能します。 ",-1)),o(f,null,{default:e(()=>t[193]||(t[193]=[l("li",null,[l("code",null,"$[*].name"),n(": 「ドキュメントを配列として扱い、各エントリの名前プロパティの値を返す」という意味です。 ")],-1),l("li",null,[l("code",null,"$[?(@.priority == '$priority')].name"),n(": 「配列内の、指定された値と等しい優先順位を持つすべてのエントリの名前プロパティの値を返す」という意味です。 ")],-1)])),_:1}),t[195]||(t[195]=l("p",null," これらのクエリを使用して、返されたJSONの理解を確認できます。コードのリファクタリングやサービスの再デプロイを行う際、シリアライズの変更は、現在のフレームワークでのデシリアライズを中断しない場合でも特定されます。これにより、自信を持って公開APIを再公開できます。 ",-1))]),_:1})]),_:1})]),_:1}),o(a,{title:"次のステップ",id:"next-steps"},{default:e(()=>[t[202]||(t[202]=l("p",null," おめでとうございます！タスクマネージャーアプリケーションのRESTful APIサービスの作成を完了し、KtorクライアントとJsonPathを使用したユニットテストの細部を学習しました。",-1)),l("p",null,[t[200]||(t[200]=n(" 次の")),o(d,{href:"/ktor/server-create-website",summary:"KtorとThymeleafテンプレートを使用してKotlinでウェブサイトを構築する方法を学びます。"},{default:e(()=>t[199]||(t[199]=[n("チュートリアル")])),_:1}),t[201]||(t[201]=n("に進み、APIサービスを再利用してウェブアプリケーションを構築する方法を学びましょう。 "))])]),_:1})]),_:1})])}const _=D(L,[["render",M]]);export{Z as __pageData,_ as default};
