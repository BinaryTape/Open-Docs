import{_ as w,a as v,b as C,c as x,d as A}from"./chunks/tutorial_server_websockets_iteration_2_test.BE55vRda.js";import{_ as W}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as P}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as R}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as N}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as L,C as u,c as K,o as E,G as e,w as o,j as l,a as t}from"./chunks/framework.Bksy39di.js";const $=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-create-websocket-application.md","filePath":"ja/ktor/server-create-websocket-application.md","lastUpdated":1755457140000}'),z={name:"ja/ktor/server-create-websocket-application.md"};function I(D,n,J,M,B,O){const f=u("show-structure"),r=u("Links"),g=u("tldr"),T=u("card-summary"),b=u("link-summary"),S=u("web-summary"),k=u("list"),a=u("chapter"),s=u("step"),p=u("control"),i=u("Path"),m=u("procedure"),d=u("code-block"),y=u("topic");return E(),K("div",null,[e(y,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Ktor を使用して Kotlin で WebSocket アプリケーションを作成する",id:"server-create-websocket-application"},{default:o(()=>[e(f,{for:"chapter",depth:"2"}),e(g,null,{default:o(()=>[n[11]||(n[11]=l("p",null,[l("b",null,"コード例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-websockets"}," tutorial-server-websockets ")],-1)),l("p",null,[n[4]||(n[4]=l("b",null,"使用プラグイン",-1)),n[5]||(n[5]=t(": ")),e(r,{href:"/ktor/server-routing",summary:"Routingは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。"},{default:o(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[6]||(n[6]=t("、")),e(r,{href:"/ktor/server-static-content",summary:"スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。"},{default:o(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[7]||(n[7]=t("、 ")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定のフォーマットでのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。"},{default:o(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[8]||(n[8]=t("、 ")),e(r,{href:"/ktor/server-websockets",summary:"WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。"},{default:o(()=>n[3]||(n[3]=[t("Ktor Server の WebSockets")])),_:1}),n[9]||(n[9]=t("、 ")),n[10]||(n[10]=l("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1))])]),_:1}),e(T,null,{default:o(()=>n[12]||(n[12]=[t(" WebSockets の機能を活用してコンテンツを送受信する方法を学びます。 ")])),_:1}),e(b,null,{default:o(()=>n[13]||(n[13]=[t(" WebSockets の機能を活用してコンテンツを送受信する方法を学びます。 ")])),_:1}),e(S,null,{default:o(()=>n[14]||(n[14]=[t(" Ktor を使用して Kotlin で WebSocket アプリケーションを構築する方法を学びます。このチュートリアルでは、WebSockets を介してバックエンドサービスとクライアントを接続するプロセスを説明します。 ")])),_:1}),l("p",null,[n[16]||(n[16]=t(" この記事では、Ktor を使用して Kotlin で WebSocket アプリケーションを作成するプロセスについて説明します。")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学び、JSON ファイルを生成する RESTful API の例を紹介します。"},{default:o(()=>n[15]||(n[15]=[t("RESTful API の作成")])),_:1}),n[17]||(n[17]=t("チュートリアルで扱った内容を基にしています。 "))]),n[170]||(n[170]=l("p",null,"この記事では、次のことを学習します:",-1)),e(k,null,{default:o(()=>n[18]||(n[18]=[l("li",null,"JSON シリアライゼーションを使用するサービスを作成する。",-1),l("li",null,"WebSocket 接続を介してコンテンツを送受信する。",-1),l("li",null,"複数のクライアントに同時にコンテンツをブロードキャストする。",-1)])),_:1}),e(a,{title:"前提条件",id:"prerequisites"},{default:o(()=>[l("p",null,[n[21]||(n[21]=t("このチュートリアルは単独で実行できますが、")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学び、JSON ファイルを生成する RESTful API の例を紹介します。"},{default:o(()=>n[19]||(n[19]=[t("RESTful API の作成")])),_:1}),n[22]||(n[22]=t("チュートリアルを完了して、")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定のフォーマットでのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。"},{default:o(()=>n[20]||(n[20]=[t("Content Negotiation")])),_:1}),n[23]||(n[23]=t("と REST に慣れることをお勧めします。 "))]),n[24]||(n[24]=l("p",null,[l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t(" をインストールすることをお勧めしますが、任意の他の IDE を使用することもできます。 ")],-1))]),_:1}),e(a,{title:"Hello WebSockets",id:"hello-websockets"},{default:o(()=>[l("p",null,[n[27]||(n[27]=t(" このチュートリアルでは、")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学び、JSON ファイルを生成する RESTful API の例を紹介します。"},{default:o(()=>n[25]||(n[25]=[t("RESTful API の作成")])),_:1}),n[28]||(n[28]=t("チュートリアルで開発したタスクマネージャーサービスを基に、WebSocket 接続を介してクライアントと ")),n[29]||(n[29]=l("code",null,"Task",-1)),n[30]||(n[30]=t(" オブジェクトを交換する機能を追加します。これを実現するには、")),e(r,{href:"/ktor/server-websockets",summary:"WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。"},{default:o(()=>n[26]||(n[26]=[t("WebSockets プラグイン")])),_:1}),n[31]||(n[31]=t("を追加する必要があります。既存のプロジェクトに手動で追加することもできますが、このチュートリアルのために、新しいプロジェクトを作成して最初から始めます。 "))]),e(a,{title:"プラグインを使用して初期プロジェクトを作成する",id:"create=project"},{default:o(()=>[e(m,null,{default:o(()=>[e(s,null,{default:o(()=>n[32]||(n[32]=[l("p",null,[l("a",{href:"https://start.ktor.io/"},"Ktor Project Generator"),t(" に移動します。 ")],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(p,null,{default:o(()=>n[33]||(n[33]=[t("Project artifact")])),_:1}),n[35]||(n[35]=t(" フィールドに、プロジェクトアーティファクトの名前として ")),e(i,null,{default:o(()=>n[34]||(n[34]=[t("com.example.ktor-websockets-task-app")])),_:1}),n[36]||(n[36]=t(" を入力します。 ")),n[37]||(n[37]=l("img",{src:w,alt:"Ktor Project Generatorでプロジェクトアーティファクトに名前を付ける","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[39]||(n[39]=t(" プラグインセクションで、")),e(p,null,{default:o(()=>n[38]||(n[38]=[t("Add")])),_:1}),n[40]||(n[40]=t(" ボタンをクリックして以下のプラグインを検索し、追加します: "))]),e(k,{type:"bullet"},{default:o(()=>n[41]||(n[41]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"WebSockets",-1),l("li",null,"Static Content",-1)])),_:1}),n[42]||(n[42]=l("p",null,[l("img",{src:W,alt:"Ktor Project Generatorでプラグインを追加する","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[44]||(n[44]=t(" プラグインを追加したら、プラグインセクションの右上にある ")),e(p,null,{default:o(()=>n[43]||(n[43]=[t("5 plugins")])),_:1}),n[45]||(n[45]=t(" ボタンをクリックして、追加されたプラグインを表示します。 "))]),n[46]||(n[46]=l("p",null,[t("プロジェクトに追加されるすべてのプラグインのリストが表示されます: "),l("img",{src:v,alt:"Ktor Project Generatorのプラグインリスト","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(p,null,{default:o(()=>n[47]||(n[47]=[t("Download")])),_:1}),n[48]||(n[48]=t(" ボタンをクリックして、Ktor プロジェクトを生成し、ダウンロードします。 "))])]),_:1})]),_:1})]),_:1}),e(a,{title:"スターターコードを追加する",id:"add-starter-code"},{default:o(()=>[n[100]||(n[100]=l("p",null,"ダウンロードが完了したら、IntelliJ IDEA でプロジェクトを開き、以下の手順に従います:",-1)),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[49]||(n[49]=[t("src/main/kotlin")])),_:1}),n[51]||(n[51]=t(" に移動し、")),e(i,null,{default:o(()=>n[50]||(n[50]=[t("model")])),_:1}),n[52]||(n[52]=t(" という新しいサブパッケージを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[53]||(n[53]=[t("model")])),_:1}),n[55]||(n[55]=t(" パッケージ内に、新しい ")),e(i,null,{default:o(()=>n[54]||(n[54]=[t("Task.kt")])),_:1}),n[56]||(n[56]=t(" ファイルを作成します。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[57]||(n[57]=[t("Task.kt")])),_:1}),n[58]||(n[58]=t(" ファイルを開き、優先度を表す ")),n[59]||(n[59]=l("code",null,"enum",-1)),n[60]||(n[60]=t(" とタスクを表す ")),n[61]||(n[61]=l("code",null,"data class",-1)),n[62]||(n[62]=t(" を追加します: "))]),e(d,{lang:"kotlin",code:`package model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),n[68]||(n[68]=l("p",null,[l("code",null,"Task"),t(" クラスには "),l("code",null,"kotlinx.serialization"),t(" ライブラリの "),l("code",null,"Serializable"),t(" 型アノテーションが付いていることに注意してください。これは、インスタンスを JSON に変換してネットワーク経由でその内容を転送できることを意味します。 ")],-1)),l("p",null,[n[65]||(n[65]=t(" WebSockets プラグインを含めたため、 ")),e(i,null,{default:o(()=>n[63]||(n[63]=[t("Sockets.kt")])),_:1}),n[66]||(n[66]=t(" ファイルが ")),e(i,null,{default:o(()=>n[64]||(n[64]=[t("src/main/kotlin/com/example/plugins")])),_:1}),n[67]||(n[67]=t(" 内に生成されています。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[69]||(n[69]=[t("Sockets.kt")])),_:1}),n[70]||(n[70]=t(" ファイルを開き、既存の ")),n[71]||(n[71]=l("code",null,"Application.configureSockets()",-1)),n[72]||(n[72]=t(" 関数を以下の実装に置き換えます: "))]),e(d,{lang:"kotlin",code:`                        fun Application.configureSockets() {
                            install(WebSockets) {
                                contentConverter = KotlinxWebsocketSerializationConverter(Json)
                                pingPeriod = 15.seconds
                                timeout = 15.seconds
                                maxFrameSize = Long.MAX_VALUE
                                masking = false
                            }

                            routing {
                                webSocket("/tasks") {
                                    val tasks = listOf(
                                        Task("cleaning", "Clean the house", Priority.Low),
                                        Task("gardening", "Mow the lawn", Priority.Medium),
                                        Task("shopping", "Buy the groceries", Priority.High),
                                        Task("painting", "Paint the fence", Priority.Medium)
                                    )

                                    for (task in tasks) {
                                        sendSerialized(task)
                                        delay(1000)
                                    }

                                    close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                                }
                            }
                        }`}),n[86]||(n[86]=l("p",null," このコードでは、以下の手順が実行されます: ",-1)),e(k,{type:"decimal"},{default:o(()=>n[73]||(n[73]=[l("li",null,"WebSockets プラグインがインストールされ、標準設定で構成されます。",-1),l("li",null,[l("code",null,"contentConverter"),t(" プロパティが設定され、"),l("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},"kotlinx.serialization"),t(" ライブラリを介して送受信されるオブジェクトをプラグインがシリアライズできるようになります。 ")],-1),l("li",null,[t("ルーティングが単一のエンドポイントで構成され、相対 URL は "),l("code",null,"/tasks"),t(" です。 ")],-1),l("li",null,"リクエストを受信すると、タスクのリストが WebSocket 接続を介してシリアライズされます。",-1),l("li",null,"すべてのアイテムが送信されると、サーバーは接続を閉じます。",-1)])),_:1}),l("p",null,[n[76]||(n[76]=t(" デモンストレーションのため、タスクの送信間に1秒の遅延が導入されています。これにより、クライアントでタスクが段階的に表示されるのを観察できます。この遅延がないと、この例は以前の記事で開発された")),e(r,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を学び、JSON ファイルを生成する RESTful API の例を紹介します。"},{default:o(()=>n[74]||(n[74]=[t("RESTful サービス")])),_:1}),n[77]||(n[77]=t("や")),e(r,{href:"/ktor/server-create-website",summary:"Ktor と Thymeleaf テンプレートを使用して Kotlin で Webサイトを構築する方法を学びます。"},{default:o(()=>n[75]||(n[75]=[t("Web アプリケーション")])),_:1}),n[78]||(n[78]=t("とまったく同じように見えます。 "))]),l("p",null,[n[82]||(n[82]=t(" このイテレーションの最終ステップは、このエンドポイントのクライアントを作成することです。")),e(r,{href:"/ktor/server-static-content",summary:"スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。"},{default:o(()=>n[79]||(n[79]=[t("Static Content")])),_:1}),n[83]||(n[83]=t(" プラグインを含めたため、 ")),e(i,null,{default:o(()=>n[80]||(n[80]=[t("index.html")])),_:1}),n[84]||(n[84]=t(" ファイルが ")),e(i,null,{default:o(()=>n[81]||(n[81]=[t("src/main/resources/static")])),_:1}),n[85]||(n[85]=t(" 内に生成されています。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[87]||(n[87]=[t("index.html")])),_:1}),n[88]||(n[88]=t(" ファイルを開き、既存のコンテンツを以下に置き換えます: "))]),e(d,{lang:"html",code:`<html>
<head>
    <title>Using Ktor WebSockets</title>
    <script>
        function readAndDisplayAllTasks() {
            clearTable();

            const serverURL = 'ws://0.0.0.0:8080/tasks';
            const socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function clearTable() {
            tableBody().innerHTML = "";
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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
<h1>Viewing Tasks Via WebSockets</h1>
<form action="javascript:readAndDisplayAllTasks()">
    <input type="submit" value="View The Tasks">
</form>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[89]||(n[89]=l("p",null,[t(" このページでは、すべての最新ブラウザで利用可能な "),l("a",{href:"https://websockets.spec.whatwg.org//#websocket"},"WebSocket 型"),t("を使用しています。JavaScript でこのオブジェクトを作成し、エンドポイントの URL をコンストラクタに渡します。その後、"),l("code",null,"onopen"),t("、"),l("code",null,"onclose"),t("、 および "),l("code",null,"onmessage"),t(" イベントのイベントハンドラーをアタッチします。"),l("code",null,"onmessage"),t(" イベントがトリガーされると、ドキュメントオブジェクトのメソッドを使用してテーブルに行を追加します。 ")],-1))]),_:1}),e(s,null,{default:o(()=>n[90]||(n[90]=[l("p",null,[t("IntelliJ IDEA で、実行ボタン ("),l("img",{src:P,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 実行アイコン"}),t(") をクリックしてアプリケーションを起動します。")],-1)])),_:1}),e(s,null,{default:o(()=>[n[96]||(n[96]=l("p",null,[l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t(" に移動します。ボタンと空のテーブルを含むフォームが表示されるはずです: ")],-1)),n[97]||(n[97]=l("img",{src:C,alt:"ボタン1つがあるHTMLフォームを表示するウェブブラウザページ","border-effect":"rounded",width:"706"},null,-1)),l("p",null,[n[93]||(n[93]=t(" フォームをクリックすると、タスクがサーバーからロードされ、1秒に1つのペースで表示されます。その結果、テーブルには段階的にデータが入力されます。ブラウザの ")),e(p,null,{default:o(()=>n[91]||(n[91]=[t("developer tools")])),_:1}),n[94]||(n[94]=t(" で ")),e(p,null,{default:o(()=>n[92]||(n[92]=[t("JavaScript Console")])),_:1}),n[95]||(n[95]=t(" を開くと、ログに記録されたメッセージも表示できます。 "))]),n[98]||(n[98]=l("img",{src:x,alt:"ボタンをクリックするとリストアイテムを表示するウェブブラウザページ","border-effect":"rounded",width:"706"},null,-1)),n[99]||(n[99]=l("p",null," これにより、サービスが期待どおりに動作していることがわかります。WebSocket 接続が開かれ、アイテムがクライアントに送信され、接続が閉じられます。基盤となるネットワークには多くの複雑さがありますが、Ktor はこれらすべてをデフォルトで処理します。 ",-1))]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{title:"WebSockets を理解する",id:"understanding-websockets"},{default:o(()=>[n[102]||(n[102]=l("p",null,[t(" 次のイテレーションに進む前に、WebSockets の基本をいくつか確認しておくと役立つかもしれません。 すでに WebSockets に精通している場合は、"),l("a",{href:"#improve-design"},"サービスの設計を改善する"),t("に進むことができます。 ")],-1)),n[103]||(n[103]=l("p",null," 以前のチュートリアルでは、クライアントは HTTP リクエストを送信し、HTTP レスポンスを受信していました。これはうまく機能し、インターネットをスケーラブルで弾力性のあるものにしています。 ",-1)),n[104]||(n[104]=l("p",null,"しかし、次のようなシナリオには適していません:",-1)),e(k,null,{default:o(()=>n[101]||(n[101]=[l("li",null,"コンテンツが時間とともに段階的に生成される場合。",-1),l("li",null,"イベントに応答してコンテンツが頻繁に変化する場合。",-1),l("li",null,"コンテンツが生成される際にクライアントがサーバーと対話する必要がある場合。",-1),l("li",null,"あるクライアントが送信したデータが、他のクライアントに迅速に伝播される必要がある場合。",-1)])),_:1}),n[105]||(n[105]=l("p",null," これらのシナリオの例としては、株式取引、映画やコンサートのチケット購入、オンラインオークションでの入札、ソーシャルメディアのチャット機能などがあります。WebSockets は、これらの状況を処理するために開発されました。 ",-1)),n[106]||(n[106]=l("p",null," WebSocket 接続は TCP 上で確立され、長期間持続することができます。この接続は「全二重通信」を提供し、クライアントがサーバーにメッセージを送信し、同時にサーバーからメッセージを受信できることを意味します。 ",-1)),n[107]||(n[107]=l("p",null,[t(" WebSocket API は、4つのイベント (open、message、close、および error) と2つのアクション (send と close) を定義しています。 この機能へのアクセス方法は、異なる言語やライブラリによって異なる場合があります。 たとえば、Kotlin では、受信メッセージのシーケンスを "),l("a",{href:"https://kotlinlang.org/docs/flow.html"},"Flow"),t(" として消費できます。 ")],-1))]),_:1}),e(a,{title:"設計を改善する",id:"improve-design"},{default:o(()=>[n[122]||(n[122]=l("p",null,"次に、より高度な例のためのスペースを確保するために、既存のコードをリファクタリングします。",-1)),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[108]||(n[108]=[t("model")])),_:1}),n[110]||(n[110]=t(" パッケージに、新しい ")),e(i,null,{default:o(()=>n[109]||(n[109]=[t("TaskRepository.kt")])),_:1}),n[111]||(n[111]=t(" ファイルを作成します。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[112]||(n[112]=[t("TaskRepository.kt")])),_:1}),n[113]||(n[113]=t(" を開き、")),n[114]||(n[114]=l("code",null,"TaskRepository",-1)),n[115]||(n[115]=t(" 型を追加します: "))]),e(d,{lang:"kotlin",code:`package model

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

    fun removeTask(name: String): Boolean {
        return tasks.removeIf { it.name == name }
    }
}`}),n[116]||(n[116]=l("p",null,"このコードは以前のチュートリアルで覚えているかもしれません。",-1))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[117]||(n[117]=[t("plugins")])),_:1}),n[119]||(n[119]=t(" パッケージに移動し、")),e(i,null,{default:o(()=>n[118]||(n[118]=[t("Sockets.kt")])),_:1}),n[120]||(n[120]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[121]||(n[121]=l("p",null,[t(" これで、"),l("code",null,"TaskRepository"),t(" を利用して "),l("code",null,"Application.configureSockets()"),t(" のルーティングを簡素化できます: ")],-1)),e(d,{lang:"kotlin",code:`                    routing {
                        webSocket("/tasks") {
                            for (task in TaskRepository.allTasks()) {
                                sendSerialized(task)
                                delay(1000)
                            }

                            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
                        }
                    }`})]),_:1})]),_:1})]),_:1}),e(a,{title:"WebSockets を介してメッセージを送信する",id:"send-messages"},{default:o(()=>[n[144]||(n[144]=l("p",null," WebSockets の威力を示すために、次の新しいエンドポイントを作成します: ",-1)),e(k,null,{default:o(()=>n[123]||(n[123]=[l("li",null," クライアントが起動すると、すべての既存のタスクを受信します。 ",-1),l("li",null," クライアントはタスクを作成して送信できます。 ",-1),l("li",null," あるクライアントがタスクを送信すると、他のクライアントに通知されます。 ",-1)])),_:1}),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[124]||(n[124]=[t("Sockets.kt")])),_:1}),n[125]||(n[125]=t(" ファイルで、現在の ")),n[126]||(n[126]=l("code",null,"configureSockets()",-1)),n[127]||(n[127]=t(" メソッドを以下の実装に置き換えます: "))]),e(d,{lang:"kotlin",code:`fun Application.configureSockets() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        val sessions =
            Collections.synchronizedList<WebSocketServerSession>(ArrayList())

        webSocket("/tasks") {
            sendAllTasks()
            close(CloseReason(CloseReason.Codes.NORMAL, "All done"))
        }

        webSocket("/tasks2") {
            sessions.add(this)
            sendAllTasks()

            while(true) {
                val newTask = receiveDeserialized<Task>()
                TaskRepository.addTask(newTask)
                for(session in sessions) {
                    session.sendSerialized(newTask)
                }
            }
        }
    }
}

private suspend fun DefaultWebSocketServerSession.sendAllTasks() {
    for (task in TaskRepository.allTasks()) {
        sendSerialized(task)
        delay(1000)
    }
}`}),n[132]||(n[132]=l("p",null,"このコードで、次のことを行いました:",-1)),e(k,null,{default:o(()=>n[128]||(n[128]=[l("li",null," すべての既存のタスクを送信する機能をヘルパーメソッドにリファクタリングしました。 ",-1),l("li",null,[l("code",null,"routing"),t(" セクションで、すべてのクライアントを追跡するための "),l("code",null,"session"),t(" オブジェクトのスレッドセーフなリストを作成しました。 ")],-1),l("li",null,[t(" 相対 URL が "),l("code",null,"/task2"),t(" の新しいエンドポイントを追加しました。クライアントがこのエンドポイントに接続すると、対応する "),l("code",null,"session"),t(" オブジェクトがリストに追加されます。その後、サーバーは新しいタスクを受信するのを待つ無限ループに入ります。新しいタスクを受信すると、サーバーはそれをリポジトリに保存し、現在のクライアントを含むすべてのクライアントにコピーを送信します。 ")],-1)])),_:1}),l("p",null,[n[130]||(n[130]=t(" この機能をテストするために、")),e(i,null,{default:o(()=>n[129]||(n[129]=[t("index.html")])),_:1}),n[131]||(n[131]=t(" の機能を拡張する新しいページを作成します。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[133]||(n[133]=[t("src/main/resources/static")])),_:1}),n[135]||(n[135]=t(" 内に、")),e(i,null,{default:o(()=>n[134]||(n[134]=[t("wsClient.html")])),_:1}),n[136]||(n[136]=t(" という新しい HTML ファイルを作成します。 "))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[137]||(n[137]=[t("wsClient.html")])),_:1}),n[138]||(n[138]=t(" を開き、以下の内容を追加します: "))]),e(d,{lang:"html",code:`<html>
<head>
    <title>WebSocket Client</title>
    <script>
        let serverURL;
        let socket;

        function setupSocket() {
            serverURL = 'ws://0.0.0.0:8080/tasks2';
            socket = new WebSocket(serverURL);

            socket.onopen = logOpenToConsole;
            socket.onclose = logCloseToConsole;
            socket.onmessage = readAndDisplayTask;
        }

        function readAndDisplayTask(event) {
            let task = JSON.parse(event.data);
            logTaskToConsole(task);
            addTaskToTable(task);
        }

        function logTaskToConsole(task) {
            console.log(\`Received \${task.name}\`);
        }

        function logCloseToConsole() {
            console.log("Web socket connection closed");
        }

        function logOpenToConsole() {
            console.log("Web socket connection opened");
        }

        function tableBody() {
            return document.getElementById("tasksTableBody");
        }

        function addTaskToTable(task) {
            tableBody().appendChild(taskRow(task));
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

        function getFormValue(name) {
            return document.forms[0][name].value
        }

        function buildTaskFromForm() {
            return {
                name: getFormValue("newTaskName"),
                description: getFormValue("newTaskDescription"),
                priority: getFormValue("newTaskPriority")
            }
        }

        function logSendingToConsole(data) {
            console.log("About to send",data);
        }

        function sendTaskViaSocket(data) {
            socket.send(JSON.stringify(data));
        }

        function sendTaskToServer() {
            let data = buildTaskFromForm();
            logSendingToConsole(data);
            sendTaskViaSocket(data);
            //prevent form submission
            return false;
        }
    <\/script>
</head>
<body onload="setupSocket()">
<h1>Viewing Tasks Via WebSockets</h1>
<table rules="all">
    <thead>
    <tr>
        <th>Name</th><th>Description</th><th>Priority</th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
<div>
    <h3>Create a new task</h3>
    <form onsubmit="return sendTaskToServer()">
        <div>
            <label for="newTaskName">Name: </label>
            <input type="text" id="newTaskName"
                   name="newTaskName" size="10">
        </div>
        <div>
            <label for="newTaskDescription">Description: </label>
            <input type="text" id="newTaskDescription"
                   name="newTaskDescription" size="20">
        </div>
        <div>
            <label for="newTaskPriority">Priority: </label>
            <select id="newTaskPriority" name="newTaskPriority">
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
</html>`}),n[139]||(n[139]=l("p",null,[t(" この新しいページでは、ユーザーが新しいタスクの情報を入力できる HTML フォームを導入しています。 フォームを送信すると、"),l("code",null,"sendTaskToServer"),t(" イベントハンドラーが呼び出されます。これは、フォームデータを持つ JavaScript オブジェクトを構築し、WebSocket オブジェクトの "),l("code",null,"send"),t(" メソッドを使用してサーバーに送信します。 ")],-1))]),_:1}),e(s,null,{default:o(()=>n[140]||(n[140]=[l("p",null,[t(" IntelliJ IDEA で、再実行ボタン ("),l("img",{src:R,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 再実行アイコン"}),t(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1}),e(s,null,{default:o(()=>[n[142]||(n[142]=l("p",null,"この機能をテストするには、2つのブラウザを並べて開き、以下の手順に従います。",-1)),e(k,{type:"decimal"},{default:o(()=>n[141]||(n[141]=[l("li",null,[t(" ブラウザ A で、 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t(" に移動します。デフォルトのタスクが表示されるはずです。 ")],-1),l("li",null," ブラウザ A で新しいタスクを追加します。新しいタスクはそのページのテーブルに表示されるはずです。 ",-1),l("li",null,[t(" ブラウザ B で、 "),l("a",{href:"http://0.0.0.0:8080/static/wsClient.html"},[l("a",{href:"http://0.0.0.0:8080/static/wsClient.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/wsClient.html")]),t(" に移動します。デフォルトのタスクと、ブラウザ A で追加した新しいタスクが表示されるはずです。 ")],-1),l("li",null," いずれかのブラウザでタスクを追加します。新しいアイテムが両方のページに表示されるはずです。 ",-1)])),_:1}),n[143]||(n[143]=l("img",{src:A,alt:"HTMLフォームを介して新しいタスクを作成する様子を示す2つのウェブブラウザページが並んでいる","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"自動テストを追加する",id:"add-automated-tests"},{default:o(()=>[l("p",null,[n[146]||(n[146]=t(" QA プロセスを効率化し、高速で再現性があり、ハンズフリーにするために、Ktor の組み込みの ")),e(r,{href:"/ktor/server-testing",summary:"特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。"},{default:o(()=>n[145]||(n[145]=[t("自動テストサポート")])),_:1}),n[147]||(n[147]=t(" を使用できます。以下の手順に従ってください: "))]),e(m,null,{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[n[150]||(n[150]=t(" Ktor クライアント内で ")),e(r,{href:"/ktor/server-serialization",summary:"ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエーションと、特定のフォーマットでのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。"},{default:o(()=>n[148]||(n[148]=[t("Content Negotiation")])),_:1}),n[151]||(n[151]=t(" のサポートを設定できるように、 ")),e(i,null,{default:o(()=>n[149]||(n[149]=[t("build.gradle.kts")])),_:1}),n[152]||(n[152]=t(" に以下の依存関係を追加します: "))]),e(d,{lang:"kotlin",code:'    testImplementation("io.ktor:ktor-client-content-negotiation-jvm:$ktor_version")'})]),_:1}),e(s,null,{default:o(()=>n[153]||(n[153]=[l("p",null,[l("p",null,[t("IntelliJ IDEA で、エディタの右側にある通知 Gradle アイコン ("),l("img",{alt:"IntelliJ IDEA Gradle アイコン",src:N,width:"16",height:"26"}),t(") をクリックして、Gradle の変更をロードします。")])],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[154]||(n[154]=[t("src/test/kotlin/com/example")])),_:1}),n[156]||(n[156]=t(" に移動し、 ")),e(i,null,{default:o(()=>n[155]||(n[155]=[t("ApplicationTest.kt")])),_:1}),n[157]||(n[157]=t(" ファイルを開きます。 "))])]),_:1}),e(s,null,{default:o(()=>[n[165]||(n[165]=l("p",null," 生成されたテストクラスを以下の実装に置き換えます: ",-1)),e(d,{lang:"kotlin",code:`package com.example

import com.example.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlinx.coroutines.flow.*
import kotlinx.serialization.json.Json
import model.Priority
import model.Task
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            configureRouting()
            configureSerialization()
            configureSockets()
        }

        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
            install(WebSockets) {
                contentConverter =
                    KotlinxWebsocketSerializationConverter(Json)
            }
        }

        val expectedTasks = listOf(
            Task("cleaning", "Clean the house", Priority.Low),
            Task("gardening", "Mow the lawn", Priority.Medium),
            Task("shopping", "Buy the groceries", Priority.High),
            Task("painting", "Paint the fence", Priority.Medium)
        )
        var actualTasks = emptyList<Task>()

        client.webSocket("/tasks") {
            consumeTasksAsFlow().collect { allTasks ->
                actualTasks = allTasks
            }
        }

        assertEquals(expectedTasks.size, actualTasks.size)
        expectedTasks.forEachIndexed { index, task ->
            assertEquals(task, actualTasks[index])
        }
    }

    private fun DefaultClientWebSocketSession.consumeTasksAsFlow() = incoming
        .consumeAsFlow()
        .map {
            converter!!.deserialize<Task>(it)
        }
        .scan(emptyList<Task>()) { list, task ->
            list + task
        }
}`}),n[166]||(n[166]=l("p",null," このセットアップで、次のことを行います: ",-1)),e(k,null,{default:o(()=>[n[160]||(n[160]=l("li",null," サービスをテスト環境で実行するように構成し、ルーティング、JSON シリアライゼーション、WebSockets など、本番環境と同じ機能を有効にします。 ",-1)),l("li",null,[e(r,{href:"/ktor/client-create-and-configure",summary:"Ktor クライアントを作成および構成する方法を学びます。"},{default:o(()=>n[158]||(n[158]=[t("Ktor クライアント")])),_:1}),n[159]||(n[159]=t(" 内で Content Negotiation および WebSocket サポートを構成します。これがないと、クライアントは WebSocket 接続を使用する際にオブジェクトを JSON として (デ)シリアライズする方法を認識しません。 "))]),n[161]||(n[161]=l("li",null,[t(" サービスが返すことを期待する "),l("code",null,"Tasks"),t(" のリストを宣言します。 ")],-1)),n[162]||(n[162]=l("li",null,[t(" クライアントオブジェクトの "),l("code",null,"websocket"),t(" メソッドを使用して、"),l("code",null,"/tasks"),t(" へのリクエストを送信します。 ")],-1)),n[163]||(n[163]=l("li",null,[t(" 受信するタスクを "),l("code",null,"flow"),t(" として消費し、段階的にリストに追加します。 ")],-1)),n[164]||(n[164]=l("li",null,[t(" すべてのタスクが受信されたら、通常の方法で "),l("code",null,"expectedTasks"),t(" と "),l("code",null,"actualTasks"),t(" を比較します。 ")],-1))]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{title:"次のステップ",id:"next-steps"},{default:o(()=>[n[169]||(n[169]=l("p",null," 素晴らしい！Ktor クライアントとの WebSocket 通信と自動テストを組み込むことで、タスクマネージャーサービスが大幅に強化されました。 ",-1)),l("p",null,[e(r,{href:"/ktor/server-integrate-database",summary:"Exposed SQL ライブラリを使用して Ktor サービスをデータベースリポジトリに接続するプロセスを学びます。"},{default:o(()=>n[167]||(n[167]=[t("次のチュートリアル")])),_:1}),n[168]||(n[168]=t(" に進んで、Exposed ライブラリを使用してサービスがリレーショナルデータベースとシームレスに連携する方法を探ります。 "))])]),_:1})]),_:1})])}const q=L(z,[["render",I]]);export{$ as __pageData,q as default};
