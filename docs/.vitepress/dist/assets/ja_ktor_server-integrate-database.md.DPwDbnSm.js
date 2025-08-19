import{_ as P,a as A,b as R,c as I,d as N,e as D}from"./chunks/tutorial_server_db_integration_src_folder.CYo2B4hT.js";import{_ as C}from"./chunks/ktor_project_generator_add_plugins.Cua1Lg9U.js";import{_ as T}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as L}from"./chunks/tutorial_server_db_integration_manual_test.DHfnfXew.js";import{_ as g}from"./chunks/intellij_idea_gradle_icon.dCXxPOpm.js";import{_ as j}from"./chunks/intellij_idea_rerun_icon.tlG8QH6A.js";import{_ as B,C as u,c as O,o as K,G as e,w as o,j as l,a as t}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ja/ktor/server-integrate-database.md","filePath":"ja/ktor/server-integrate-database.md","lastUpdated":1755457140000}'),q={name:"ja/ktor/server-integrate-database.md"};function F(H,n,J,M,z,V){const y=u("show-structure"),p=u("Links"),b=u("tldr"),v=u("card-summary"),S=u("link-summary"),E=u("web-summary"),k=u("list"),a=u("chapter"),s=u("step"),m=u("control"),i=u("Path"),r=u("code-block"),d=u("procedure"),f=u("tip"),x=u("ui-path"),w=u("topic");return K(),O("div",null,[e(w,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Kotlin、Ktor、Exposed とデータベースを統合する",id:"server-integrate-database"},{default:o(()=>[e(y,{for:"chapter",depth:"2"}),e(b,null,{default:o(()=>[n[15]||(n[15]=l("p",null,[l("b",null,"コード例"),t(": "),l("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-server-db-integration"}," tutorial-server-db-integration ")],-1)),l("p",null,[n[5]||(n[5]=l("b",null,"使用されるプラグイン",-1)),n[6]||(n[6]=t(": ")),e(p,{href:"/ktor/server-routing",summary:"ルーティングは、サーバーアプリケーションにおける受信リクエストを処理するためのコアプラグインです。"},{default:o(()=>n[0]||(n[0]=[t("Routing")])),_:1}),n[7]||(n[7]=t("、")),e(p,{href:"/ktor/server-static-content",summary:"スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学習します。"},{default:o(()=>n[1]||(n[1]=[t("Static Content")])),_:1}),n[8]||(n[8]=t("、 ")),e(p,{href:"/ktor/server-serialization",summary:"ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。"},{default:o(()=>n[2]||(n[2]=[t("Content Negotiation")])),_:1}),n[9]||(n[9]=t("、 ")),e(p,{href:"/ktor/server-status-pages",summary:"%plugin_name% を使用すると、Ktor アプリケーションはスローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に応答できます。"},{default:o(()=>n[3]||(n[3]=[t("Status pages")])),_:1}),n[10]||(n[10]=t("、 ")),e(p,{href:"/ktor/server-serialization",summary:"ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。"},{default:o(()=>n[4]||(n[4]=[t("kotlinx.serialization")])),_:1}),n[11]||(n[11]=t("、 ")),n[12]||(n[12]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md"},"Exposed",-1)),n[13]||(n[13]=t("、 ")),n[14]||(n[14]=l("a",{href:"https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md"},"Postgres",-1))])]),_:1}),e(v,null,{default:o(()=>n[16]||(n[16]=[t(" Exposed SQL ライブラリを使用して、Ktor サービスをデータベースリポジトリに接続するプロセスを学習します。 ")])),_:1}),e(S,null,{default:o(()=>n[17]||(n[17]=[t(" Exposed SQL ライブラリを使用して、Ktor サービスをデータベースリポジトリに接続するプロセスを学習します。 ")])),_:1}),e(E,null,{default:o(()=>n[18]||(n[18]=[t(" Kotlin と Ktor を使用して、RESTful サービスがデータベースリポジトリにリンクするシングルページアプリケーション (SPA) を構築する方法を学習します。これは Exposed SQL ライブラリを使用し、テスト用にリポジトリを偽装（フェイク）できます。 ")])),_:1}),n[278]||(n[278]=l("p",null,[t(" この記事では、Kotlin 用の SQL ライブラリである "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t(" を使用して、Ktor サービスをリレーショナルデータベースと統合する方法を学習します。 ")],-1)),n[279]||(n[279]=l("p",null,"このチュートリアルを終えるまでに、以下の方法を学習します。",-1)),e(k,null,{default:o(()=>n[19]||(n[19]=[l("li",null,"JSON シリアライズを使用する RESTful サービスを作成する。",-1),l("li",null,"これらのサービスに異なるリポジトリを注入する。",-1),l("li",null,"偽装（フェイク）リポジトリを使用してサービスのユニットテストを作成する。",-1),l("li",null,"Exposed と依存性注入（DI）を使用して動作するリポジトリを構築する。",-1),l("li",null,"外部データベースにアクセスするサービスをデプロイする。",-1)])),_:1}),l("p",null,[n[23]||(n[23]=t(" 以前のチュートリアルでは、Task Manager の例を使用して、")),e(p,{href:"/ktor/server-requests-and-responses",summary:"ルーティング、リクエスト、パラメーターの基本を Kotlin と Ktor でタスクマネージャーアプリケーションを構築することで学習します。"},{default:o(()=>n[20]||(n[20]=[t("リクエストの処理")])),_:1}),n[24]||(n[24]=t("、 ")),e(p,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を、JSON ファイルを生成する RESTful API の例を特徴として学習します。"},{default:o(()=>n[21]||(n[21]=[t("RESTful API の作成")])),_:1}),n[25]||(n[25]=t("、または ")),e(p,{href:"/ktor/server-create-website",summary:"Kotlin と Ktor、Thymeleaf テンプレートを使用して Web サイトを構築する方法を学習します。"},{default:o(()=>n[22]||(n[22]=[t("Thymeleaf テンプレートでの Web アプリの構築")])),_:1}),n[26]||(n[26]=t(" などの基本を扱いました。 これらのチュートリアルは、シンプルなインメモリの ")),n[27]||(n[27]=l("code",null,"TaskRepository",-1)),n[28]||(n[28]=t(" を使用したフロントエンド機能に焦点を当てていましたが、 このガイドでは、Ktor サービスが ")),n[29]||(n[29]=l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed SQL ライブラリ",-1)),n[30]||(n[30]=t(" を介してリレーショナルデータベースと対話する方法を示すことに焦点を移します。 "))]),n[280]||(n[280]=l("p",null," このガイドは長く複雑ですが、それでもすぐに動作するコードを作成し、新しい機能を段階的に導入できます。 ",-1)),n[281]||(n[281]=l("p",null,"このガイドは2つのパートに分かれます。",-1)),e(k,{type:"decimal"},{default:o(()=>n[31]||(n[31]=[l("li",null,[l("a",{href:"#create-restful-service-and-repository"},"インメモリリポジトリでアプリケーションを作成する。")],-1),l("li",null,[l("a",{href:"#add-postgresql-repository"},"インメモリリポジトリを PostgreSQL を使用するものに切り替える。")],-1)])),_:1}),e(a,{title:"前提条件",id:"prerequisites"},{default:o(()=>[l("p",null,[n[33]||(n[33]=t(" このチュートリアルは独立して行うことができますが、Content Negotiation と REST に慣れるために、")),e(p,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を、JSON ファイルを生成する RESTful API の例を特徴として学習します。"},{default:o(()=>n[32]||(n[32]=[t("RESTful API の作成")])),_:1}),n[34]||(n[34]=t(" チュートリアルを完了することをお勧めします。 "))]),n[35]||(n[35]=l("p",null,[l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t(" のインストールをお勧めしますが、お好みの他の IDE を使用することもできます。 ")],-1))]),_:1}),e(a,{title:"RESTful サービスとインメモリリポジトリを作成する",id:"create-restful-service-and-repository"},{default:o(()=>[n[160]||(n[160]=l("p",null," まず、Task Manager RESTful サービスを再作成します。最初はインメモリリポジトリを使用しますが、最小限の労力で置き換えられるような設計を構築します。 ",-1)),n[161]||(n[161]=l("p",null,"これには6つの段階があります。",-1)),e(k,{type:"decimal"},{default:o(()=>n[36]||(n[36]=[l("li",null,[l("a",{href:"#create-project"},"初期プロジェクトを作成する。")],-1),l("li",null,[l("a",{href:"#add-starter-code"},"スターターコードを追加する。")],-1),l("li",null,[l("a",{href:"#add-routes"},"CRUD ルートを追加する。")],-1),l("li",null,[l("a",{href:"#add-client-page"},"シングルページアプリケーション（SPA）を追加する。")],-1),l("li",null,[l("a",{href:"#test-manually"},"アプリケーションを手動でテストする。")],-1),l("li",null,[l("a",{href:"#add-automated-tests"},"自動テストを追加する。")],-1)])),_:1}),e(a,{title:"プラグインを使用して新しいプロジェクトを作成する",id:"create-project"},{default:o(()=>[n[68]||(n[68]=l("p",null," Ktor Project Generator を使用して新しいプロジェクトを作成するには、以下の手順に従ってください。 ",-1)),e(d,{id:"create-project-procedure"},{default:o(()=>[e(s,null,{default:o(()=>n[37]||(n[37]=[l("p",null,[l("a",{href:"https://start.ktor.io/"},"Ktor Project Generator"),t(" に移動します。 ")],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[40]||(n[40]=t("[")),e(m,null,{default:o(()=>n[38]||(n[38]=[t("Project artifact")])),_:1}),n[41]||(n[41]=t("] フィールドに、プロジェクトアーティファクト名として ")),e(i,null,{default:o(()=>n[39]||(n[39]=[t("com.example.ktor-exposed-task-app")])),_:1}),n[42]||(n[42]=t(" を入力します。 ")),n[43]||(n[43]=l("img",{src:P,alt:"Ktor Project Generator でプロジェクトアーティファクトに名前を付ける","border-effect":"line",style:{},width:"706"},null,-1))])]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[45]||(n[45]=t("プラグインセクションで、[")),e(m,null,{default:o(()=>n[44]||(n[44]=[t("Add")])),_:1}),n[46]||(n[46]=t("] ボタンをクリックして以下のプラグインを検索し、追加します。 "))]),e(k,{type:"bullet"},{default:o(()=>n[47]||(n[47]=[l("li",null,"Routing",-1),l("li",null,"Content Negotiation",-1),l("li",null,"Kotlinx.serialization",-1),l("li",null,"Static Content",-1),l("li",null,"Status Pages",-1),l("li",null,"Exposed",-1),l("li",null,"Postgres",-1)])),_:1}),n[48]||(n[48]=l("p",null,[l("img",{src:C,alt:"Ktor Project Generator でプラグインを追加する","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[50]||(n[50]=t(" プラグインを追加したら、プラグインセクションの右上にある ")),e(m,null,{default:o(()=>n[49]||(n[49]=[t("7 plugins")])),_:1}),n[51]||(n[51]=t(" ボタンをクリックして、追加されたプラグインを確認します。 "))]),n[52]||(n[52]=l("p",null,[t("プロジェクトに追加されるすべてのプラグインのリストが表示されます。 "),l("img",{src:A,alt:"Ktor Project Generator のプラグインドロップダウン","border-effect":"line",style:{},width:"706"})],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[54]||(n[54]=t(" [")),e(m,null,{default:o(()=>n[53]||(n[53]=[t("Download")])),_:1}),n[55]||(n[55]=t("] ボタンをクリックして、Ktor プロジェクトを生成およびダウンロードします。 "))])]),_:1}),e(s,null,{default:o(()=>n[56]||(n[56]=[l("p",null,[t(" 生成されたプロジェクトを "),l("a",{href:"https://www.jetbrains.com/help/idea/installation-guide.html"},"IntelliJ IDEA"),t(" またはお好みの他の IDE で開きます。 ")],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[57]||(n[57]=[t("src/main/kotlin/com/example")])),_:1}),n[60]||(n[60]=t(" に移動し、")),e(i,null,{default:o(()=>n[58]||(n[58]=[t("CitySchema.kt")])),_:1}),n[61]||(n[61]=t(" および ")),e(i,null,{default:o(()=>n[59]||(n[59]=[t("UsersSchema.kt")])),_:1}),n[62]||(n[62]=t(" ファイルを削除します。 "))])]),_:1}),e(s,{id:"delete-function"},{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[63]||(n[63]=[t("Databases.kt")])),_:1}),n[64]||(n[64]=t(" ファイルを開き、")),n[65]||(n[65]=l("code",null,"configureDatabases()",-1)),n[66]||(n[66]=t(" 関数のコンテンツを削除します。 "))]),e(r,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                        }`}),n[67]||(n[67]=l("p",null," この機能を削除する理由は、Ktor Project Generator がユーザーと都市に関するデータを HSQLDB または PostgreSQL に永続化する方法を示すサンプルコードを追加しているためです。このチュートリアルでは、そのサンプルコードは必要ありません。 ",-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"スターターコードを追加する",id:"add-starter-code"},{default:o(()=>[e(d,{id:"add-starter-code-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[69]||(n[69]=[t("src/main/kotlin/com/example")])),_:1}),n[71]||(n[71]=t(" に移動し、")),e(i,null,{default:o(()=>n[70]||(n[70]=[t("model")])),_:1}),n[72]||(n[72]=t(" というサブパッケージを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[73]||(n[73]=[t("model")])),_:1}),n[75]||(n[75]=t(" パッケージ内に、新しい ")),e(i,null,{default:o(()=>n[74]||(n[74]=[t("Task.kt")])),_:1}),n[76]||(n[76]=t(" ファイルを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[77]||(n[77]=[t("Task.kt")])),_:1}),n[78]||(n[78]=t(" を開き、優先度を表す ")),n[79]||(n[79]=l("code",null,"enum",-1)),n[80]||(n[80]=t(" とタスクを表す ")),n[81]||(n[81]=l("code",null,"class",-1)),n[82]||(n[82]=t(" を追加します。 "))]),e(r,{lang:"kotlin",code:`package com.example.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),l("p",null,[n[84]||(n[84]=l("code",null,"Task",-1)),n[85]||(n[85]=t(" クラスには、")),e(p,{href:"/ktor/server-serialization",summary:"ContentNegotiation プラグインには、クライアントとサーバー間のメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。"},{default:o(()=>n[83]||(n[83]=[t("kotlinx.serialization")])),_:1}),n[86]||(n[86]=t(" ライブラリの ")),n[87]||(n[87]=l("code",null,"Serializable",-1)),n[88]||(n[88]=t(" 型がアノテーションされています。 "))]),n[89]||(n[89]=l("p",null,[t(" 以前のチュートリアルと同様に、インメモリリポジトリを作成します。ただし、今回はリポジトリが "),l("code",null,"interface"),t(" を実装するようにすることで、後で簡単に置き換えられるようにします。 ")],-1))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[90]||(n[90]=[t("model")])),_:1}),n[92]||(n[92]=t(" サブパッケージ内に、新しい ")),e(i,null,{default:o(()=>n[91]||(n[91]=[t("TaskRepository.kt")])),_:1}),n[93]||(n[93]=t(" ファイルを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[94]||(n[94]=[t("TaskRepository.kt")])),_:1}),n[95]||(n[95]=t(" を開き、以下の ")),n[96]||(n[96]=l("code",null,"interface",-1)),n[97]||(n[97]=t(" を追加します。 "))]),e(r,{lang:"kotlin",code:`                        package com.example.model

                        interface TaskRepository {
                            fun allTasks(): List<Task>
                            fun tasksByPriority(priority: Priority): List<Task>
                            fun taskByName(name: String): Task?
                            fun addTask(task: Task)
                            fun removeTask(name: String): Boolean
                        }`})]),_:1}),e(s,null,{default:o(()=>[n[99]||(n[99]=t(" 同じディレクトリ内に新しい ")),e(i,null,{default:o(()=>n[98]||(n[98]=[t("FakeTaskRepository.kt")])),_:1}),n[100]||(n[100]=t(" ファイルを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[101]||(n[101]=[t("FakeTaskRepository.kt")])),_:1}),n[102]||(n[102]=t(" を開き、以下の ")),n[103]||(n[103]=l("code",null,"class",-1)),n[104]||(n[104]=t(" を追加します。 "))]),e(r,{lang:"kotlin",code:`                        package com.example.model

                        class FakeTaskRepository : TaskRepository {
                            private val tasks = mutableListOf(
                                Task("cleaning", "Clean the house", Priority.Low),
                                Task("gardening", "Mow the lawn", Priority.Medium),
                                Task("shopping", "Buy the groceries", Priority.High),
                                Task("painting", "Paint the fence", Priority.Medium)
                            )

                            override fun allTasks(): List<Task> = tasks

                            override fun tasksByPriority(priority: Priority) = tasks.filter {
                                it.priority == priority
                            }

                            override fun taskByName(name: String) = tasks.find {
                                it.name.equals(name, ignoreCase = true)
                            }

                            override fun addTask(task: Task) {
                                if (taskByName(task.name) != null) {
                                    throw IllegalStateException("Cannot duplicate task names!")
                                }
                                tasks.add(task)
                            }

                            override fun removeTask(name: String): Boolean {
                                return tasks.removeIf { it.name == name }
                            }
                        }`})]),_:1})]),_:1})]),_:1}),e(a,{title:"ルートを追加する",id:"add-routes"},{default:o(()=>[e(d,{id:"add-routes-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[105]||(n[105]=[t("src/main/kotlin/com/example")])),_:1}),n[107]||(n[107]=t(" にある ")),e(i,null,{default:o(()=>n[106]||(n[106]=[t("Serialization.kt")])),_:1}),n[108]||(n[108]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[116]||(n[116]=l("p",null,[t(" 既存の "),l("code",null,"Application.configureSerialization()"),t(" 関数を以下の実装に置き換えます。 ")],-1)),e(r,{lang:"kotlin",code:`package com.example

import com.example.model.Priority
import com.example.model.Task
import com.example.model.TaskRepository
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureSerialization(repository: TaskRepository) {
    install(ContentNegotiation) {
        json()
    }
    routing {
        route("/tasks") {
            get {
                val tasks = repository.allTasks()
                call.respond(tasks)
            }

            get("/byName/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = repository.taskByName(name)
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
                    val tasks = repository.tasksByPriority(priority)


                    if (tasks.isEmpty()) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    call.respond(tasks)
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            post {
                try {
                    val task = call.receive<Task>()
                    repository.addTask(task)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            delete("/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (repository.removeTask(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}`}),l("p",null,[n[110]||(n[110]=t(" これは、")),e(p,{href:"/ktor/server-create-restful-apis",summary:"Kotlin と Ktor を使用してバックエンドサービスを構築する方法を、JSON ファイルを生成する RESTful API の例を特徴として学習します。"},{default:o(()=>n[109]||(n[109]=[t("RESTful API の作成")])),_:1}),n[111]||(n[111]=t(" チュートリアルで実装したルーティングと同じですが、今回はリポジトリをパラメーターとして ")),n[112]||(n[112]=l("code",null,"routing()",-1)),n[113]||(n[113]=t(" 関数に渡しています。パラメーターの型が ")),n[114]||(n[114]=l("code",null,"interface",-1)),n[115]||(n[115]=t(" であるため、さまざまな実装を注入できます。 "))]),n[117]||(n[117]=l("p",null,[l("code",null,"configureSerialization()"),t(" にパラメーターを追加したため、既存の呼び出しはコンパイルされなくなります。幸いなことに、この関数は一度しか呼び出されません。 ")],-1))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[118]||(n[118]=[t("src/main/kotlin/com/example")])),_:1}),n[120]||(n[120]=t(" 内の ")),e(i,null,{default:o(()=>n[119]||(n[119]=[t("Application.kt")])),_:1}),n[121]||(n[121]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[122]||(n[122]=l("p",null,[l("code",null,"module()"),t(" 関数を以下の実装に置き換えます。 ")],-1)),e(r,{lang:"kotlin",code:`                    import com.example.model.FakeTaskRepository
                    //...

                    fun Application.module() {
                        val repository = FakeTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[123]||(n[123]=l("p",null,[l("code",null,"FakeTaskRepository"),t(" のインスタンスを "),l("code",null,"configureSerialization()"),t(" に注入しています。長期的な目標は、これを "),l("code",null,"PostgresTaskRepository"),t(" に置き換えられるようにすることです。 ")],-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"クライアントページを追加する",id:"add-client-page"},{default:o(()=>[e(d,{id:"add-client-page-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[124]||(n[124]=[t("src/main/resources/static")])),_:1}),n[126]||(n[126]=t(" にある ")),e(i,null,{default:o(()=>n[125]||(n[125]=[t("index.html")])),_:1}),n[127]||(n[127]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[128]||(n[128]=l("p",null," 現在のコンテンツを以下の実装に置き換えます。 ",-1)),e(r,{lang:"html",code:`<html>
<head>
    <title>A Simple SPA For Tasks</title>
    <script type="application/javascript">
        function displayAllTasks() {
            clearTasksTable();
            fetchAllTasks().then(displayTasks)
        }

        function displayTasksWithPriority() {
            clearTasksTable();
            const priority = readTaskPriority();
            fetchTasksWithPriority(priority).then(displayTasks)
        }

        function displayTask(name) {
            fetchTaskWithName(name).then(t =>
                taskDisplay().innerHTML
                    = \`\${t.priority} priority task \${t.name} with description "\${t.description}"\`
            )
        }

        function deleteTask(name) {
            deleteTaskWithName(name).then(() => {
                clearTaskDisplay();
                displayAllTasks();
            })
        }

        function deleteTaskWithName(name) {
            return sendDELETE(\`/tasks/\${name}\`)
        }

        function addNewTask() {
            const task = buildTaskFromForm();
            sendPOST("/tasks", task).then(displayAllTasks);
        }

        function buildTaskFromForm() {
            return {
                name: getTaskFormValue("newTaskName"),
                description: getTaskFormValue("newTaskDescription"),
                priority: getTaskFormValue("newTaskPriority")
            }
        }

        function getTaskFormValue(controlName) {
            return document.addTaskForm[controlName].value;
        }

        function taskDisplay() {
            return document.getElementById("currentTaskDisplay");
        }

        function readTaskPriority() {
            return document.priorityForm.priority.value
        }

        function fetchTasksWithPriority(priority) {
            return sendGET(\`/tasks/byPriority/\${priority}\`);
        }

        function fetchTaskWithName(name) {
            return sendGET(\`/tasks/byName/\${name}\`);
        }

        function fetchAllTasks() {
            return sendGET("/tasks")
        }

        function sendGET(url) {
            return fetch(
                url,
                {headers: {'Accept': 'application/json'}}
            ).then(response => {
                if (response.ok) {
                    return response.json()
                }
                return [];
            });
        }

        function sendPOST(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        }

        function sendDELETE(url) {
            return fetch(url, {
                method: "DELETE"
            });
        }

        function tasksTable() {
            return document.getElementById("tasksTableBody");
        }

        function clearTasksTable() {
            tasksTable().innerHTML = "";
        }

        function clearTaskDisplay() {
            taskDisplay().innerText = "None";
        }

        function displayTasks(tasks) {
            const tasksTableBody = tasksTable()
            tasks.forEach(task => {
                const newRow = taskRow(task);
                tasksTableBody.appendChild(newRow);
            });
        }

        function taskRow(task) {
            return tr([
                td(task.name),
                td(task.priority),
                td(viewLink(task.name)),
                td(deleteLink(task.name)),
            ]);
        }

        function tr(children) {
            const node = document.createElement("tr");
            children.forEach(child => node.appendChild(child));
            return node;
        }

        function td(content) {
            const node = document.createElement("td");
            if (content instanceof Element) {
                node.appendChild(content)
            } else {
                node.appendChild(document.createTextNode(content));
            }
            return node;
        }

        function viewLink(taskName) {
            const node = document.createElement("a");
            node.setAttribute(
                "href", \`javascript:displayTask("\${taskName}")\`
            )
            node.appendChild(document.createTextNode("view"));
            return node;
        }

        function deleteLink(taskName) {
            const node = document.createElement("a");
            node.setAttribute(
                "href", \`javascript:deleteTask("\${taskName}")\`
            )
            node.appendChild(document.createTextNode("delete"));
            return node;
        }
    <\/script>
</head>
<body onload="displayAllTasks()">
<h1>Task Manager Client</h1>
<form action="javascript:displayAllTasks()">
    <span>View all the tasks</span>
    <input type="submit" value="Go">
</form>
<form name="priorityForm" action="javascript:displayTasksWithPriority()">
    <span>View tasks with priority</span>
    <select name="priority">
        <option name="Low">Low</option>
        <option name="Medium">Medium</option>
        <option name="High">High</option>
        <option name="Vital">Vital</option>
    </select>
    <input type="submit" value="Go">
</form>
<form name="addTaskForm" action="javascript:addNewTask()">
    <span>Create new task with</span>
    <label for="newTaskName">name</label>
    <input type="text" id="newTaskName" name="newTaskName" size="10">
    <label for="newTaskDescription">description</label>
    <input type="text" id="newTaskDescription" name="newTaskDescription" size="20">
    <label for="newTaskPriority">priority</label>
    <select id="newTaskPriority" name="newTaskPriority">
        <option name="Low">Low</option>
        <option name="Medium">Medium</option>
        <option name="High">High</option>
        <option name="Vital">Vital</option>
    </select>
    <input type="submit" value="Go">
</form>
<hr>
<div>
    Current task is <em id="currentTaskDisplay">None</em>
</div>
<hr>
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Priority</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody id="tasksTableBody">
    </tbody>
</table>
</body>
</html>`}),n[129]||(n[129]=l("p",null," これは以前のチュートリアルで使用された SPA と同じものです。JavaScript で書かれており、ブラウザ内で利用可能なライブラリのみを使用するため、クライアント側の依存関係を心配する必要はありません。 ",-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"アプリケーションを手動でテストする",id:"test-manually"},{default:o(()=>[e(d,{id:"test-manually-procedure"},{default:o(()=>[n[144]||(n[144]=l("p",null," この最初のイテレーションでは、データベースに接続する代わりにインメモリリポジトリを使用しているため、アプリケーションが適切に構成されていることを確認する必要があります。 ",-1)),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[130]||(n[130]=[t("src/main/resources/application.yaml")])),_:1}),n[131]||(n[131]=t(" に移動し、")),n[132]||(n[132]=l("code",null,"postgres",-1)),n[133]||(n[133]=t(" 設定を削除します。 "))]),e(r,{lang:"yaml",code:`ktor:
    application:
        modules:
            - com.example.ApplicationKt.module
    deployment:
        port: 8080`})]),_:1}),e(s,null,{default:o(()=>n[134]||(n[134]=[l("p",null,[t("IntelliJ IDEA で、実行ボタン ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"IntelliJ IDEA の実行アイコン"}),t(") をクリックしてアプリケーションを起動します。")],-1)])),_:1}),e(s,null,{default:o(()=>n[135]||(n[135]=[l("p",null,[t(" ブラウザで "),l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")]),t(" に移動します。3つのフォームとフィルタリングされた結果を表示するテーブルで構成されるクライアントページが表示されるはずです。 ")],-1),l("img",{src:R,alt:"タスクマネージャー クライアントを表示するブラウザウィンドウ","border-effect":"rounded",width:"706"},null,-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[n[139]||(n[139]=t(" [")),e(m,null,{default:o(()=>n[136]||(n[136]=[t("Go")])),_:1}),n[140]||(n[140]=t("] ボタンを使用してフォームに入力して送信し、アプリケーションをテストします。テーブルの項目にある [")),e(m,null,{default:o(()=>n[137]||(n[137]=[t("View")])),_:1}),n[141]||(n[141]=t("] および [")),e(m,null,{default:o(()=>n[138]||(n[138]=[t("Delete")])),_:1}),n[142]||(n[142]=t("] ボタンを使用します。 "))]),n[143]||(n[143]=l("img",{src:L,alt:"タスクマネージャー クライアントを表示するブラウザウィンドウ","border-effect":"rounded",width:"706"},null,-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"自動ユニットテストを追加する",id:"add-automated-tests"},{default:o(()=>[e(d,{id:"add-automated-tests-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[145]||(n[145]=[t("src/test/kotlin/com/example")])),_:1}),n[147]||(n[147]=t(" にある ")),e(i,null,{default:o(()=>n[146]||(n[146]=[t("ApplicationTest.kt")])),_:1}),n[148]||(n[148]=t(" を開き、以下のテストを追加します。 "))]),e(r,{lang:"kotlin",code:`package com.example

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
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
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
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
        }
        val response = client.get("/tasks/byPriority/Invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun unusedPriorityProduces404() = testApplication {
        application {
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
        }

        val response = client.get("/tasks/byPriority/Vital")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            val repository = FakeTaskRepository()
            configureSerialization(repository)
            configureRouting()
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
        assertEquals(HttpStatusCode.NoContent, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2
            .body<List<Task>>()
            .map { it.name }

        assertContains(taskNames, "swimming")
    }
}`}),n[149]||(n[149]=l("p",null,[t(" これらのテストをコンパイルして実行するには、Ktor クライアント用の "),l("a",{href:"https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html"},"Content Negotiation"),t(" プラグインへの依存関係を追加する必要があります。 ")],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[150]||(n[150]=[t("gradle/libs.versions.toml")])),_:1}),n[151]||(n[151]=t(" ファイルを開き、以下のライブラリを指定します。 "))]),e(r,{lang:"kotlin",code:`                        [libraries]
                        #...
                        ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor-version" }`})]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[152]||(n[152]=[t("build.gradle.kts")])),_:1}),n[153]||(n[153]=t(" を開き、以下の依存関係を追加します。 "))]),e(r,{lang:"kotlin",code:`                        dependencies {
                            //...
                            testImplementation(libs.ktor.client.content.negotiation)
                        }`})]),_:1}),e(s,null,{default:o(()=>n[154]||(n[154]=[l("p",null,[t("IntelliJ IDEA で、エディターの右側にある通知 Gradle アイコン ("),l("img",{alt:"IntelliJ IDEA の Gradle アイコン",src:g,width:"16",height:"26"}),t(") をクリックして Gradle の変更をロードします。")],-1)])),_:1}),e(s,null,{default:o(()=>[n[158]||(n[158]=l("p",null,[t("IntelliJ IDEA で、テストクラス定義の隣にある実行ボタン ("),l("img",{src:T,style:{},height:"16",width:"16",alt:"IntelliJ IDEA の実行アイコン"}),t(") をクリックしてテストを実行します。")],-1)),l("p",null,[n[156]||(n[156]=t("その後、[")),e(m,null,{default:o(()=>n[155]||(n[155]=[t("Run")])),_:1}),n[157]||(n[157]=t("] ペインでテストが正常に実行されたことが確認できます。 "))]),n[159]||(n[159]=l("img",{src:I,alt:"IntelliJ IDEA の [Run] ペインに表示される成功したテスト結果","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{title:"PostgreSQL リポジトリを追加する",id:"add-postgresql-repository"},{default:o(()=>[n[272]||(n[272]=l("p",null," インメモリデータを使用する動作中のアプリケーションができたので、次のステップはデータストレージを PostgreSQL データベースに外部化することです。 ",-1)),n[273]||(n[273]=l("p",null," これを行うには、以下の手順に従います。 ",-1)),e(k,{type:"decimal"},{default:o(()=>n[162]||(n[162]=[l("li",null,[l("a",{href:"#create-schema"},"PostgreSQL 内にデータベーススキーマを作成する。")],-1),l("li",null,[l("a",{href:"#adapt-repo"},[t("非同期アクセス用に "),l("code",null,"TaskRepository"),t(" を適合させる。")])],-1),l("li",null,[l("a",{href:"#config-db-connection"},"アプリケーション内でデータベース接続を構成する。")],-1),l("li",null,[l("a",{href:"#create-mapping"},[l("code",null,"Task"),t(" 型を関連するデータベーステーブルにマップする。")])],-1),l("li",null,[l("a",{href:"#create-new-repo"},"このマッピングに基づいて新しいリポジトリを作成する。")],-1),l("li",null,[l("a",{href:"#switch-repo"},"起動コードでこの新しいリポジトリに切り替える。")],-1)])),_:1}),e(a,{title:"データベーススキーマを作成する",id:"create-schema"},{default:o(()=>[e(d,{id:"create-schema-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[l("p",null,[n[164]||(n[164]=t(" お好みのデータベース管理ツールを使用して、PostgreSQL 内に新しいデータベースを作成します。 名前は覚えていれば何でも構いません。この例では、 ")),e(i,null,{default:o(()=>n[163]||(n[163]=[t("ktor_tutorial_db")])),_:1}),n[165]||(n[165]=t(" を使用します。 "))]),e(f,null,{default:o(()=>n[166]||(n[166]=[l("p",null,[t(" PostgreSQL の詳細については、"),l("a",{href:"https://www.postgresql.org/docs/current/"},"公式ドキュメント"),t(" を参照してください。 ")],-1),l("p",null,[t(" IntelliJ IDEA では、データベースツールを使用して "),l("a",{href:"https://www.jetbrains.com/help/idea/postgresql.html"},"PostgreSQL データベースに接続し、管理する"),t(" ことができます。 ")],-1)])),_:1})]),_:1}),e(s,null,{default:o(()=>[n[182]||(n[182]=l("p",null," データベースに対して以下の SQL コマンドを実行します。これらのコマンドはデータベーススキーマを作成し、データを投入します。 ",-1)),e(r,{lang:"sql",code:`                        DROP TABLE IF EXISTS task;
                        CREATE TABLE task(id SERIAL PRIMARY KEY, name VARCHAR(50), description VARCHAR(50), priority VARCHAR(50));

                        INSERT INTO task (name, description, priority) VALUES ('cleaning', 'Clean the house', 'Low');
                        INSERT INTO task (name, description, priority) VALUES ('gardening', 'Mow the lawn', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('shopping', 'Buy the groceries', 'High');
                        INSERT INTO task (name, description, priority) VALUES ('painting', 'Paint the fence', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('exercising', 'Walk the dog', 'Medium');
                        INSERT INTO task (name, description, priority) VALUES ('meditating', 'Contemplate the infinite', 'High');`}),n[183]||(n[183]=l("p",null," 以下に注意してください。 ",-1)),e(k,null,{default:o(()=>[l("li",null,[e(i,null,{default:o(()=>n[167]||(n[167]=[t("task")])),_:1}),n[171]||(n[171]=t(" という単一のテーブルを作成しており、")),e(i,null,{default:o(()=>n[168]||(n[168]=[t("name")])),_:1}),n[172]||(n[172]=t("、 ")),e(i,null,{default:o(()=>n[169]||(n[169]=[t("description")])),_:1}),n[173]||(n[173]=t("、および ")),e(i,null,{default:o(()=>n[170]||(n[170]=[t("priority")])),_:1}),n[174]||(n[174]=t(" の列があります。これらは ")),n[175]||(n[175]=l("code",null,"Task",-1)),n[176]||(n[176]=t(" クラスのプロパティにマップする必要があります。 "))]),n[181]||(n[181]=l("li",null," テーブルが既に存在する場合は再作成されるため、スクリプトを繰り返し実行できます。 ",-1)),l("li",null,[n[178]||(n[178]=l("code",null,"SERIAL",-1)),n[179]||(n[179]=t(" 型の ")),e(i,null,{default:o(()=>n[177]||(n[177]=[t("id")])),_:1}),n[180]||(n[180]=t(" という追加の列があります。これは整数値で、各行に主キーを付与するために使用されます。これらの値はデータベースによって自動的に割り当てられます。 "))])]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{title:"既存のリポジトリを適合させる",id:"adapt-repo"},{default:o(()=>[e(d,{id:"adapt-repo-procedure"},{default:o(()=>[n[196]||(n[196]=l("p",null,[t(" データベースに対してクエリを実行する際、HTTP リクエストを処理するスレッドのブロックを避けるために、非同期で実行することが望ましいです。Kotlin では、これは "),l("a",{href:"https://kotlinlang.org/docs/coroutines-overview.html"},"コルーチン"),t(" を介して最もよく管理されます。 ")],-1)),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[184]||(n[184]=[t("src/main/kotlin/com/example/model")])),_:1}),n[186]||(n[186]=t(" にある ")),e(i,null,{default:o(()=>n[185]||(n[185]=[t("TaskRepository.kt")])),_:1}),n[187]||(n[187]=t(" ファイルを開きます。 "))])]),_:1}),e(s,null,{default:o(()=>[n[188]||(n[188]=l("p",null,[t(" すべてのインターフェースメソッドに "),l("code",null,"suspend"),t(" キーワードを追加します。 ")],-1)),e(r,{lang:"kotlin",code:`                    interface TaskRepository {
                        suspend fun allTasks(): List<Task>
                        suspend fun tasksByPriority(priority: Priority): List<Task>
                        suspend fun taskByName(name: String): Task?
                        suspend fun addTask(task: Task)
                        suspend fun removeTask(name: String): Boolean
                    }`}),n[189]||(n[189]=l("p",null," これにより、インターフェースメソッドの実装は、異なるコルーチンディスパッチャーで作業を開始できるようになります。 ",-1)),n[190]||(n[190]=l("p",null,[t(" これで、"),l("code",null,"FakeTaskRepository"),t(" のメソッドを一致させる必要がありますが、その実装ではディスパッチャーを切り替える必要はありません。 ")],-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[191]||(n[191]=[t("FakeTaskRepository.kt")])),_:1}),n[192]||(n[192]=t(" ファイルを開き、すべてのメソッドに ")),n[193]||(n[193]=l("code",null,"suspend",-1)),n[194]||(n[194]=t(" キーワードを追加します。 "))]),e(r,{lang:"kotlin",code:`                    class FakeTaskRepository : TaskRepository {
                        //...

                        override suspend fun allTasks(): List<Task> = tasks

                        override suspend fun tasksByPriority(priority: Priority) = tasks.filter {
                            //...
                        }

                        override suspend fun taskByName(name: String) = tasks.find {
                            //...
                        }

                        override suspend fun addTask(task: Task) {
                            //...
                        }

                        override suspend fun removeTask(name: String): Boolean {
                            //...
                        }
                    }`}),n[195]||(n[195]=l("p",null,[t(" ここまでは、新しい機能は何も導入していません。その代わりに、データベースに対して非同期でクエリを実行する "),l("code",null,"PostgresTaskRepository"),t(" を作成するための基盤を築きました。 ")],-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"データベース接続を構成する",id:"config-db-connection"},{default:o(()=>[e(d,{id:"config-db-connection-procedure"},{default:o(()=>[l("p",null,[n[198]||(n[198]=l("a",{href:"#delete-function"},"このチュートリアルの最初のパート",-1)),n[199]||(n[199]=t(" で、")),e(i,null,{default:o(()=>n[197]||(n[197]=[t("Databases.kt")])),_:1}),n[200]||(n[200]=t(" 内にある ")),n[201]||(n[201]=l("code",null,"configureDatabases()",-1)),n[202]||(n[202]=t(" メソッドのサンプルコードを削除しました。これで独自の 実装を追加する準備ができました。 "))]),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[203]||(n[203]=[t("src/main/kotlin/com/example")])),_:1}),n[205]||(n[205]=t(" にある ")),e(i,null,{default:o(()=>n[204]||(n[204]=[t("Databases.kt")])),_:1}),n[206]||(n[206]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[209]||(n[209]=l("p",null,[l("code",null,"Database.connect()"),t(" 関数を使用してデータベースに接続し、設定値を環境に合わせて調整します。 ")],-1)),e(r,{lang:"kotlin",code:`                        fun Application.configureDatabases() {
                            Database.connect(
                                "jdbc:postgresql://localhost:5432/ktor_tutorial_db",
                                user = "postgres",
                                password = "password"
                            )
                        }`}),n[210]||(n[210]=l("p",null,[l("code",null,"url"),t(" には以下のコンポーネントが含まれていることに注意してください。")],-1)),e(k,null,{default:o(()=>n[207]||(n[207]=[l("li",null,[l("code",null,"localhost:5432"),t(" は PostgreSQL データベースが実行されているホストとポートです。 ")],-1),l("li",null,[l("code",null,"ktor_tutorial_db"),t(" はサービス実行時に作成されるデータベースの名前です。 ")],-1)])),_:1}),e(f,null,{default:o(()=>n[208]||(n[208]=[t(" 詳細については、 "),l("a",{href:"https://jetbrains.github.io/Exposed/database-and-datasource.html"}," Exposed でのデータベースとデータソースの操作",-1),t(" を参照してください。 ")])),_:1})]),_:1})]),_:1})]),_:1}),e(a,{title:"オブジェクト/リレーショナルマッピングを作成する",id:"create-mapping"},{default:o(()=>[e(d,{id:"create-mapping-procedure"},{default:o(()=>[e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[211]||(n[211]=[t("src/main/kotlin/com/example")])),_:1}),n[213]||(n[213]=t(" に移動し、")),e(i,null,{default:o(()=>n[212]||(n[212]=[t("db")])),_:1}),n[214]||(n[214]=t(" という新しいパッケージを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[215]||(n[215]=[t("db")])),_:1}),n[217]||(n[217]=t(" パッケージ内に、新しい ")),e(i,null,{default:o(()=>n[216]||(n[216]=[t("mapping.kt")])),_:1}),n[218]||(n[218]=t(" ファイルを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[219]||(n[219]=[t("mapping.kt")])),_:1}),n[220]||(n[220]=t(" を開き、")),n[221]||(n[221]=l("code",null,"TaskTable",-1)),n[222]||(n[222]=t(" および ")),n[223]||(n[223]=l("code",null,"TaskDAO",-1)),n[224]||(n[224]=t(" 型を追加します。 "))]),e(r,{lang:"kotlin",code:`package com.example.db

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object TaskTable : IntIdTable("task") {
    val name = varchar("name", 50)
    val description = varchar("description", 50)
    val priority = varchar("priority", 50)
}

class TaskDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<TaskDAO>(TaskTable)

    var name by TaskTable.name
    var description by TaskTable.description
    var priority by TaskTable.priority
}`}),l("p",null,[n[226]||(n[226]=t(" これらの型は Exposed ライブラリを使用して、")),n[227]||(n[227]=l("code",null,"Task",-1)),n[228]||(n[228]=t(" 型のプロパティをデータベースの ")),e(i,null,{default:o(()=>n[225]||(n[225]=[t("task")])),_:1}),n[229]||(n[229]=t(" テーブルの列にマップします。")),n[230]||(n[230]=l("code",null,"TaskTable",-1)),n[231]||(n[231]=t(" 型は基本的なマッピングを定義し、")),n[232]||(n[232]=l("code",null,"TaskDAO",-1)),n[233]||(n[233]=t(" 型はタスクの作成、検索、更新、削除を行うヘルパーメソッドを追加します。 "))]),n[234]||(n[234]=l("p",null," DAO 型のサポートは Ktor Project Generator によって追加されていないため、Gradle ビルドファイルに関連する依存関係を追加する必要があります。 ",-1))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[235]||(n[235]=[t("gradle/libs.versions.toml")])),_:1}),n[236]||(n[236]=t(" ファイルを開き、以下のライブラリを指定します。 "))]),e(r,{lang:"kotlin",code:`                       [libraries]
                       #...
                       exposed-dao = { module = "org.jetbrains.exposed:exposed-dao", version.ref = "exposed-version" }`})]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[237]||(n[237]=[t("build.gradle.kts")])),_:1}),n[238]||(n[238]=t(" ファイルを開き、以下の依存関係を追加します。 "))]),e(r,{lang:"kotlin",code:`                        dependencies {
                            //...
                            implementation(libs.exposed.dao)
                        }`})]),_:1}),e(s,null,{default:o(()=>n[239]||(n[239]=[l("p",null,[t("IntelliJ IDEA で、エディターの右側にある通知 Gradle アイコン ("),l("img",{alt:"IntelliJ IDEA の Gradle アイコン",src:g,width:"16",height:"26"}),t(") をクリックして Gradle の変更をロードします。")],-1)])),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[240]||(n[240]=[t("mapping.kt")])),_:1}),n[241]||(n[241]=t(" ファイルに戻り、以下の2つのヘルパー関数を追加します。 "))]),e(r,{lang:"kotlin",code:`suspend fun <T> suspendTransaction(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao: TaskDAO) = Task(
    dao.name,
    dao.description,
    Priority.valueOf(dao.priority)
)`}),n[242]||(n[242]=l("p",null,[l("code",null,"suspendTransaction()"),t(" はコードブロックを受け取り、IO Dispatcher を介してデータベーストランザクション内で実行します。これは、ブロッキング作業をスレッドプールにオフロードするように設計されています。 ")],-1)),n[243]||(n[243]=l("p",null,[l("code",null,"daoToModel()"),t(" は "),l("code",null,"TaskDAO"),t(" 型のインスタンスを "),l("code",null,"Task"),t(" オブジェクトに変換します。 ")],-1))]),_:1}),e(s,null,{default:o(()=>[n[244]||(n[244]=l("p",null," 以下の不足しているインポートを追加します。 ",-1)),e(r,{lang:"kotlin",code:`import com.example.model.Priority
import com.example.model.Task
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction`})]),_:1})]),_:1})]),_:1}),e(a,{title:"新しいリポジトリを作成する",id:"create-new-repo"},{default:o(()=>[e(d,{id:"create-new-repo-procedure"},{default:o(()=>[n[252]||(n[252]=l("p",null,"これで、データベース固有のリポジトリを作成するために必要なすべてのリソースが揃いました。",-1)),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[245]||(n[245]=[t("src/main/kotlin/com/example/model")])),_:1}),n[247]||(n[247]=t(" に移動し、新しい ")),e(i,null,{default:o(()=>n[246]||(n[246]=[t("PostgresTaskRepository.kt")])),_:1}),n[248]||(n[248]=t(" ファイルを作成します。 "))]),_:1}),e(s,null,{default:o(()=>[l("p",null,[e(i,null,{default:o(()=>n[249]||(n[249]=[t("PostgresTaskRepository.kt")])),_:1}),n[250]||(n[250]=t(" ファイルを開き、以下の実装で新しい型を作成します。 "))]),e(r,{lang:"kotlin",code:`package com.example.model

import com.example.db.TaskDAO
import com.example.db.TaskTable
import com.example.db.daoToModel
import com.example.db.suspendTransaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

class PostgresTaskRepository : TaskRepository {
    override suspend fun allTasks(): List<Task> = suspendTransaction {
        TaskDAO.all().map(::daoToModel)
    }

    override suspend fun tasksByPriority(priority: Priority): List<Task> = suspendTransaction {
        TaskDAO
            .find { (TaskTable.priority eq priority.toString()) }
            .map(::daoToModel)
    }

    override suspend fun taskByName(name: String): Task? = suspendTransaction {
        TaskDAO
            .find { (TaskTable.name eq name) }
            .limit(1)
            .map(::daoToModel)
            .firstOrNull()
    }

    override suspend fun addTask(task: Task): Unit = suspendTransaction {
        TaskDAO.new {
            name = task.name
            description = task.description
            priority = task.priority.toString()
        }
    }

    override suspend fun removeTask(name: String): Boolean = suspendTransaction {
        val rowsDeleted = TaskTable.deleteWhere {
            TaskTable.name eq name
        }
        rowsDeleted == 1
    }
}`}),n[251]||(n[251]=l("p",null,[t(" この実装では、"),l("code",null,"TaskDAO"),t(" および "),l("code",null,"TaskTable"),t(" 型のヘルパーメソッドを使用してデータベースと対話します。この新しいリポジトリを作成したので、残りのタスクはルート内でこれを使用するように切り替えることだけです。 ")],-1))]),_:1})]),_:1})]),_:1}),e(a,{title:"新しいリポジトリに切り替える",id:"switch-repo"},{default:o(()=>[e(d,{id:"switch-repo-procedure"},{default:o(()=>[n[267]||(n[267]=l("p",null,"外部データベースに切り替えるには、リポジトリの型を変更するだけです。",-1)),e(s,null,{default:o(()=>[e(i,null,{default:o(()=>n[253]||(n[253]=[t("src/main/kotlin/com/example")])),_:1}),n[255]||(n[255]=t(" にある ")),e(i,null,{default:o(()=>n[254]||(n[254]=[t("Application.kt")])),_:1}),n[256]||(n[256]=t(" ファイルを開きます。 "))]),_:1}),e(s,null,{default:o(()=>[n[257]||(n[257]=l("p",null,[l("code",null,"Application.module()"),t(" 関数で、"),l("code",null,"FakeTaskRepository"),t(" を "),l("code",null,"PostgresTaskRepository"),t(" に置き換えます。 ")],-1)),e(r,{lang:"kotlin",code:`                    //...
                    import com.example.model.PostgresTaskRepository

                    //...

                    fun Application.module() {
                        val repository = PostgresTaskRepository()

                        configureSerialization(repository)
                        configureDatabases()
                        configureRouting()
                    }`}),n[258]||(n[258]=l("p",null," インターフェースを介して依存関係を注入しているため、実装の切り替えはルートを管理するコードからは透過的です。 ",-1))]),_:1}),e(s,null,{default:o(()=>n[259]||(n[259]=[l("p",null,[t(" IntelliJ IDEA で、再実行ボタン ("),l("img",{src:j,style:{},height:"16",width:"16",alt:"IntelliJ IDEA の再実行アイコン"}),t(") をクリックしてアプリケーションを再起動します。 ")],-1)])),_:1}),e(s,null,{default:o(()=>n[260]||(n[260]=[l("a",{href:"http://0.0.0.0:8080/static/index.html"},[l("a",{href:"http://0.0.0.0:8080/static/index.html",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/static/index.html")],-1),t(" に移動します。 UI は変更されませんが、データはデータベースからフェッチされるようになりました。 ")])),_:1}),e(s,null,{default:o(()=>[n[266]||(n[266]=l("p",null," これを検証するには、フォームを使用して新しいタスクを追加し、PostgreSQL のタスクテーブルに保持されているデータをクエリします。 ",-1)),e(f,null,{default:o(()=>[n[264]||(n[264]=l("p",null,[t(" IntelliJ IDEA では、 "),l("a",{href:"https://www.jetbrains.com/help/idea/query-consoles.html#create_console"},"Query Console"),t(" と "),l("code",null,"SELECT"),t(" SQL ステートメントを使用してテーブルデータをクエリできます。 ")],-1)),e(r,{lang:"SQL",code:"                            SELECT * FROM task;"}),l("p",null,[n[262]||(n[262]=t(" クエリを実行すると、新しいタスクを含むデータが ")),e(x,null,{default:o(()=>n[261]||(n[261]=[t("Service")])),_:1}),n[263]||(n[263]=t(" ペインに表示されるはずです。 "))]),n[265]||(n[265]=l("img",{src:N,alt:"IntelliJ IDEA の [Service] ペインに表示されるタスクのテーブル","border-effect":"line",width:"706"},null,-1))]),_:1})]),_:1})]),_:1})]),_:1}),n[274]||(n[274]=l("p",null," これで、データベースをアプリケーションに統合する作業が正常に完了しました。 ",-1)),l("p",null,[n[269]||(n[269]=l("code",null,"FakeTaskRepository",-1)),n[270]||(n[270]=t(" 型は本番コードではもはや必要ないため、 ")),e(i,null,{default:o(()=>n[268]||(n[268]=[t("src/test/com/example")])),_:1}),n[271]||(n[271]=t(" のテストソースセットに移動できます。 "))]),n[275]||(n[275]=l("p",null," 最終的なプロジェクト構造は次のようになります。 ",-1)),n[276]||(n[276]=l("img",{src:D,alt:"IntelliJ IDEA の [Project] ビューに表示される src フォルダー","border-effect":"line",width:"400"},null,-1))]),_:1}),e(a,{title:"次のステップ",id:"next-steps"},{default:o(()=>n[277]||(n[277]=[l("p",null,[t(" これで、Ktor RESTful サービスと通信するアプリケーションができました。これは "),l("a",{href:"https://github.com/JetBrains/Exposed"},"Exposed"),t(" で記述されたリポジトリを使用して "),l("a",{href:"https://www.postgresql.org/docs/"},"PostgreSQL"),t(" にアクセスします。また、Web サーバーやデータベースを必要とせずに、コア機能を検証する一連のテストも備わっています。 ")],-1),l("p",null,[t(" この構造は、必要に応じて任意の機能をサポートするために拡張できますが、まずはフォールトトレランス、セキュリティ、スケーラビリティなどの非機能的な側面を検討することをお勧めします。"),l("a",{href:"./docker-compose#extract-db-settings"},"データベース設定を構成ファイルに抽出する"),t(" ことから始めることができます。 ")],-1)])),_:1})]),_:1})])}const _=B(q,[["render",F]]);export{Z as __pageData,_ as default};
