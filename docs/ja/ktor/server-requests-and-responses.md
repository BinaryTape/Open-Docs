```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="KtorとKotlinを使用してHTTPリクエストを処理し、レスポンスを生成する" id="server-requests-and-responses">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-routing-and-requests"/>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    <p>
        <b>使用されているプラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">Routing</Links>
    </p>
</tldr>
<link-summary>
    タスクマネージャーアプリケーションを構築しながら、KtorとKotlinでのルーティング、リクエスト処理、パラメーターの基本を学びます。
</link-summary>
<card-summary>
    タスクマネージャーアプリケーションを作成して、Ktorでのルーティングとリクエストの仕組みを学びます。
</card-summary>
<web-summary>
    KotlinとKtorで作成されたサービスの検証、エラー処理、単体テストの基本を学びます。
</web-summary>
<p>
    このチュートリアルでは、タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。
</p>
<p>
    このチュートリアルを終えるまでに、以下のことができるようになります。
</p>
<list type="bullet">
    <li>GETおよびPOSTリクエストを処理する。</li>
    <li>リクエストから情報を抽出する。</li>
    <li>データ変換時のエラーを処理する。</li>
    <li>ルーティングを検証するために単体テストを使用する。</li>
</list>
<chapter title="前提条件" id="prerequisites">
    <p>
        これはKtorサーバー入門ガイドの2番目のチュートリアルです。このチュートリアルは単独で行うこともできますが、先行するチュートリアルを完了して<Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びます。">新しいKtorプロジェクトを作成、開いて実行する</Links>方法を学ぶことを強くお勧めします。
    </p>
    <p>HTTPリクエストのタイプ、ヘッダー、ステータスコードに関する基本的な理解があると、非常に役立ちます。</p>
    <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>のインストールをお勧めしますが、任意の他のIDEを使用することもできます。
    </p>
</chapter>
<chapter title="タスクマネージャーアプリケーション" id="sample-application">
    <p>このチュートリアルでは、以下の機能を備えたタスクマネージャーアプリケーションを段階的に構築します。</p>
    <list type="bullet">
        <li>利用可能なすべてのタスクをHTMLテーブルとして表示する。</li>
        <li>優先度と名前でタスクを表示する（これもHTMLとして）。</li>
        <li>HTMLフォームを送信してタスクを追加する。</li>
    </list>
    <p>
        いくつかの基本的な機能が動作するように最小限の作業を行い、その後7回のイテレーションにわたってこの機能を改善および拡張します。この最小限の機能は、いくつかのモデルタイプ、値のリスト、および単一のルートを含むプロジェクトで構成されます。
    </p>
</chapter>
<chapter title="静的HTMLコンテンツの表示" id="display-static-html">
    <p>最初のイテレーションでは、静的HTMLコンテンツを返す新しいルートをアプリケーションに追加します。</p>
    <p><a href="https://start.ktor.io">Ktorプロジェクトジェネレーター</a>を使用して、<control>ktor-task-app</control>という名前の新しいプロジェクトを作成します。すべてのデフォルトオプションを受け入れることができますが、<control>artifact</control>名を変更することもできます。
    </p>
    <tip>
        新しいプロジェクトの作成に関する詳細は、<Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びます。">新しいKtorプロジェクトを作成、開いて実行する</Links>を参照してください。最近そのチュートリアルを完了した場合は、そこで作成したプロジェクトを自由に再利用してください。
    </tip>
    <procedure>
        <step>
            <Path>src/main/kotlin/com/example/plugins</Path>フォルダー内の<Path>Routing.kt</Path>ファイルを開きます。
        </step>
        <step>
            <p>既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。</p>
            <code-block lang="kotlin" code="                        fun Application.configureRouting() {&#10;                            routing {&#10;                                get(&quot;/tasks&quot;) {&#10;                                    call.respondText(&#10;                                        contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                            text = &quot;&quot;&quot;&#10;                                        &lt;h3&gt;TODO:&lt;/h3&gt;&#10;                                        &lt;ol&gt;&#10;                                            &lt;li&gt;A table of all the tasks&lt;/li&gt;&#10;                                            &lt;li&gt;A form to submit new tasks&lt;/li&gt;&#10;                                        &lt;/ol&gt;&#10;                                        &quot;&quot;&quot;.trimIndent()&#10;                                    )&#10;                                }&#10;                            }&#10;                        }"/>
            <p>これにより、URL <code>/tasks</code>とGETリクエストタイプのための新しいルートを作成しました。GETリクエストは、HTTPで最も基本的なリクエストタイプです。ユーザーがブラウザのアドレスバーに入力するか、通常のHTMLリンクをクリックしたときにトリガーされます。 </p>
            <p>
                現時点では、静的コンテンツを返しているだけです。HTMLを送信することをクライアントに通知するために、HTTP Content Typeヘッダーを<code>"text/html"</code>に設定します。
            </p>
        </step>
        <step>
            <p>
                <code>ContentType</code>オブジェクトにアクセスするために、以下のインポートを追加します。
            </p>
            <code-block lang="kotlin" code="                    import io.ktor.http.ContentType"/>
        </step>
        <step>
            <p>IntelliJ IDEAで、<Path>Application.kt</Path>内の<code>main()</code>関数の横にある実行ガターアイコン（<img alt="IntelliJ IDEA実行アプリケーションアイコン"
                                                                    src="intellij_idea_gutter_icon.svg" height="16"
                                                                    width="16"/>）をクリックして、アプリケーションを開始します。
            </p>
        </step>
        <step>
            <p>
                ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>にアクセスします。ToDoリストが表示されるはずです。
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="2つの項目があるToDoリストを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="タスクモデルの実装" id="implement-a-task-model">
    <p>
        プロジェクトを作成し、基本的なルーティングを設定したので、以下の手順でアプリケーションを拡張します。
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">タスクを表すモデルタイプを作成する。</a></li>
        <li><a href="#create-sample-values">サンプル値を含むタスクのリストを宣言する。</a></li>
        <li><a href="#add-a-route">このリストを返すようにルートとリクエストハンドラーを変更する。</a></li>
        <li><a href="#test">ブラウザを使用して新しい機能が動作するかテストする。</a></li>
    </list>
    <procedure title="モデルタイプの作成" id="create-model-types">
        <step>
            <p>
                <Path>src/main/kotlin/com/example</Path>内に、<Path>model</Path>という新しいサブパッケージを作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>model</Path>ディレクトリ内に、新しい<Path>Task.kt</Path>ファイルを作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>Task.kt</Path>ファイルを開き、優先度を表す以下の<code>enum</code>とタスクを表す<code>class</code>を追加します。
            </p>
            <code-block lang="kotlin" code="                    enum class Priority {&#10;                        Low, Medium, High, Vital&#10;                    }&#10;                    data class Task(&#10;                        val name: String,&#10;                        val description: String,&#10;                        val priority: Priority&#10;                    )"/>
        </step>
        <step>
            <p>タスク情報をHTMLテーブル内のクライアントに送信するため、以下の拡張関数も追加します。</p>
            <code-block lang="kotlin" code="                    fun Task.taskAsRow() = &quot;&quot;&quot;&#10;                        &lt;tr&gt;&#10;                            &lt;td&gt;$name&lt;/td&gt;&lt;td&gt;$description&lt;/td&gt;&lt;td&gt;$priority&lt;/td&gt;&#10;                        &lt;/tr&gt;&#10;                        &quot;&quot;&quot;.trimIndent()&#10;&#10;                    fun List&lt;Task&gt;.tasksAsTable() = this.joinToString(&#10;                        prefix = &quot;&lt;table rules=\&quot;all\&quot;&gt;&quot;,&#10;                        postfix = &quot;&lt;/table&gt;&quot;,&#10;                        separator = &quot;
&quot;,&#10;                        transform = Task::taskAsRow&#10;                    )"/>
            <p>
                関数<code>Task.taskAsRow()</code>は<code>Task</code>オブジェクトをテーブル行としてレンダリングできるようにし、一方<code>List&lt;Task&gt;.tasksAsTable()</code>
                はタスクのリストをテーブルとしてレンダリングできるようにします。
            </p>
        </step>
    </procedure>
    <procedure title="サンプル値の作成" id="create-sample-values">
        <step>
            <p>
                <Path>model</Path>ディレクトリ内に、新しい<Path>TaskRepository.kt</Path>ファイルを作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>TaskRepository.kt</Path>を開き、タスクのリストを定義するために以下のコードを追加します。
            </p>
            <code-block lang="kotlin" code="                    val tasks = mutableListOf(&#10;                        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                    )"/>
        </step>
    </procedure>
    <procedure title="新しいルートの追加" id="add-a-route">
        <step>
            <p>
                <Path>Routing.kt</Path>ファイルを開き、既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                静的コンテンツをクライアントに返す代わりに、タスクのリストを提供するようになりました。リストはネットワーク経由で直接送信できないため、クライアントが理解できる形式に変換する必要があります。この場合、タスクはHTMLテーブルに変換されます。
            </p>
        </step>
        <step>
            <p>必要なインポートを追加します。</p>
            <code-block lang="kotlin" code="                    import model.*"/>
        </step>
    </procedure>
    <procedure title="新機能のテスト" id="test">
        <step>
            <p>IntelliJ IDEAで、再実行ボタン（<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                             src="intellij_idea_rerun_icon.svg"
                                                             height="16"
                                                             width="16"/>）をクリックして、アプリケーションを再起動します。</p>
        </step>
        <step>
            <p>ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>にアクセスします。タスクを含むHTMLテーブルが表示されるはずです。
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="4行のテーブルを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
            <p>もしそうであれば、おめでとうございます！アプリケーションの基本機能は正しく動作しています。</p>
        </step>
    </procedure>
</chapter>
<chapter title="モデルのリファクタリング" id="refactor-the-model">
    <p>
        アプリの機能を拡張し続ける前に、値のリストをリポジトリ内にカプセル化することで設計をリファクタリングする必要があります。これにより、データ管理を集中化し、Ktor固有のコードに集中できるようになります。
    </p>
    <procedure>
        <step>
            <p>
                <Path>TaskRepository.kt</Path>ファイルに戻り、既存のタスクリストを以下のコードに置き換えます。
            </p>
            <code-block lang="kotlin" code="package model&#10;&#10;object TaskRepository {&#10;    private val tasks = mutableListOf(&#10;        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;    )&#10;&#10;    fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;    fun tasksByPriority(priority: Priority) = tasks.filter {&#10;        it.priority == priority&#10;    }&#10;&#10;    fun taskByName(name: String) = tasks.find {&#10;        it.name.equals(name, ignoreCase = true)&#10;    }&#10;&#10;    fun addTask(task: Task) {&#10;        if(taskByName(task.name) != null) {&#10;            throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;        }&#10;        tasks.add(task)&#10;    }&#10;}"/>
            <p>
                これは、リストに基づいたタスクの非常にシンプルなデータストアを実装しています。この例の目的のために、タスクが追加された順序は保持されますが、重複は例外をスローすることによって許可されません。</p>
            <p>今後のチュートリアルでは、<a href="https://github.com/JetBrains/Exposed">Exposedライブラリ</a>を介してリレーショナルデータベースに接続するリポジトリを実装する方法を学びます。
            </p>
            <p>
                今のところ、ルート内でリポジトリを利用します。
            </p>
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path>ファイルを開き、既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。
            </p>
            <code-block lang="Kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                val tasks = TaskRepository.allTasks()&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                リクエストが到着すると、リポジトリが現在のタスクリストを取得するために使用されます。その後、これらのタスクを含むHTTPレスポンスが構築されます。
            </p>
        </step>
    </procedure>
    <procedure title="リファクタリングされたコードのテスト">
        <step>
            <p>IntelliJ IDEAで、再実行ボタン（<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                             src="intellij_idea_rerun_icon.svg" height="16"
                                                             width="16"/>）をクリックして、アプリケーションを再起動します。</p>
        </step>
        <step>
            <p>
                ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>にアクセスします。出力はHTMLテーブルが表示されたままになるはずです。
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="4行のテーブルを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="パラメーターの操作" id="work-with-parameters">
    <p>
        このイテレーションでは、ユーザーが優先度別にタスクを表示できるようにします。これを行うには、アプリケーションが以下のURLへのGETリクエストを許可する必要があります。
    </p>
    <list type="bullet">
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
    </list>
    <p>
        追加するルートは
        <code>/tasks/byPriority/{priority?}</code>で、<code>{priority?}</code>は実行時に抽出する必要があるパスパラメーターを表し、疑問符はパラメーターがオプションであることを示します。クエリパラメーターは任意の名前を付けることができますが、<code>priority</code>が最も適切な選択肢のようです。
    </p>
    <p>
        リクエストを処理するプロセスは、次のようにまとめられます。
    </p>
    <list type="decimal">
        <li>リクエストから<code>priority</code>という名前のパスパラメーターを抽出する。</li>
        <li>このパラメーターが存在しない場合、<code>400</code>ステータス（Bad Request）を返す。</li>
        <li>パラメーターのテキスト値を<code>Priority</code>列挙値に変換する。</li>
        <li>これが失敗した場合、<code>400</code>ステータスコードのレスポンスを返す。</li>
        <li>指定された優先度を持つすべてのタスクを見つけるためにリポジトリを使用する。</li>
        <li>一致するタスクがない場合、<code>404</code>ステータス（Not Found）を返す。</li>
        <li>一致するタスクをHTMLテーブルとしてフォーマットして返す。</li>
    </list>
    <p>
        まずこの機能を実装し、次にそれが動作していることを確認する最良の方法を見つけます。
    </p>
    <procedure title="新しいルートの追加">
        <p><Path>Routing.kt</Path>ファイルを開き、以下に示すように、以下のルートをコードに追加します。
        </p>
        <code-block lang="kotlin" code="                routing {&#10;                    get(&quot;/tasks&quot;) { ... }&#10;&#10;                    //add the following route&#10;                    get(&quot;/tasks/byPriority/{priority?}&quot;) {&#10;                        val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                        if (priorityAsText == null) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                            return@get&#10;                        }&#10;&#10;                        try {&#10;                            val priority = Priority.valueOf(priorityAsText)&#10;                            val tasks = TaskRepository.tasksByPriority(priority)&#10;&#10;                            if (tasks.isEmpty()) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = tasks.tasksAsTable()&#10;                            )&#10;                        } catch(ex: IllegalArgumentException) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            上記にまとめたように、URL
            <code>/tasks/byPriority/{priority?}</code>のハンドラーを作成しました。シンボル
            <code>priority</code>は、ユーザーが追加したパスパラメーターを表します。残念ながら、サーバー側ではこれが対応するKotlin列挙型の4つの値のいずれかであることを保証する方法がないため、手動でチェックする必要があります。
        </p>
        <p>
            パスパラメーターが存在しない場合、サーバーはクライアントに<code>400</code>ステータスコードを返します。それ以外の場合、パラメーターの値を抽出し、それを列挙型のメンバーに変換しようとします。これが失敗した場合、例外がスローされ、サーバーがそれをキャッチして<code>400</code>ステータスコードを返します。
        </p>
        <p>
            変換が成功したと仮定すると、リポジトリは一致する<code>Tasks</code>を見つけるために使用されます。指定された優先度のタスクがない場合、サーバーは<code>404</code>ステータスコードを返しますが、それ以外の場合は一致するタスクをHTMLテーブルで返します。
        </p>
    </procedure>
    <procedure title="新しいルートのテスト">
        <p>
            この機能は、異なるURLをリクエストすることでブラウザでテストできます。
        </p>
        <step>
            <p>IntelliJ IDEAで、再実行ボタン（<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                             src="intellij_idea_rerun_icon.svg"
                                                             height="16"
                                                             width="16"/>）をクリックして、アプリケーションを再起動します。</p>
        </step>
        <step>
            <p>
                すべての中優先度のタスクを取得するには、<a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>に移動します。
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="中優先度のタスクを含むテーブルを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                残念ながら、エラーの場合、ブラウザを介して行えるテストは限られています。開発者拡張機能を使用しない限り、ブラウザは失敗したレスポンスの詳細を表示しません。より簡単な代替策は、<a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>のような専門ツールを使用することです。
            </p>
        </step>
        <step>
            <p>
                Postmanで、同じURL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>に対してGETリクエストを送信します。
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="レスポンスの詳細を表示するPostmanのGETリクエスト"
                 border-effect="rounded"
                 width="706"/>
            <p>
                これにより、サーバーからの生の出力と、リクエストおよびレスポンスのすべての詳細が表示されます。
            </p>
        </step>
        <step>
            <p>
                重要なタスクのリクエストで<code>404</code>ステータスコードが返されることを確認するには、<code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>に新しいGETリクエストを送信します。すると、<control>Response</control>ペインの右上隅にステータスコードが表示されます。
            </p>
            <img src="tutorial_routing_and_requests_postman_vital.png"
                 alt="ステータスコードを表示するPostmanのGETリクエスト"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                無効な優先度が指定されたときに<code>400</code>が返されることを確認するには、無効なプロパティを持つ別のGETリクエストを作成します。
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="Bad Requestステータスコードを持つPostmanのGETリクエスト"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="単体テストの追加" id="add-unit-tests">
    <p>
        これまでに、すべてのタスクを取得するためのルートと、優先度でタスクを取得するためのルートの2つを追加しました。Postmanのようなツールを使用すると、これらのルートを完全にテストできますが、手動での検査が必要であり、Ktorとは外部で実行されます。
    </p>
    <p>
        これはプロトタイプ作成時や小規模なアプリケーションでは許容されます。しかし、このアプローチは、頻繁に実行する必要がある何千ものテストがある大規模なアプリケーションにはスケールしません。より良い解決策は、テストを完全に自動化することです。
    </p>
    <p>
        Ktorは、ルートの自動検証をサポートするために、独自の<Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">テストフレームワーク</Links>を提供しています。
        次に、アプリの既存機能のテストをいくつか記述します。
    </p>
    <procedure>
        <step>
            <p>
                <Path>src</Path>内に<Path>test</Path>という新しいディレクトリと、そのサブディレクトリとして<Path>kotlin</Path>を作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>src/test/kotlin</Path>内に、新しい<Path>ApplicationTest.kt</Path>ファイルを作成します。
            </p>
        </step>
        <step>
            <p><Path>ApplicationTest.kt</Path>ファイルを開き、以下のコードを追加します。
            </p>
            <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import io.ktor.client.request.*&#10;                    import io.ktor.client.statement.*&#10;                    import io.ktor.http.*&#10;                    import io.ktor.server.testing.*&#10;                    import org.junit.Test&#10;                    import kotlin.test.assertContains&#10;                    import kotlin.test.assertEquals&#10;&#10;&#10;                    class ApplicationTest {&#10;                        @Test&#10;                        fun tasksCanBeFoundByPriority() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;                            val body = response.bodyAsText()&#10;&#10;                            assertEquals(HttpStatusCode.OK, response.status)&#10;                            assertContains(body, &quot;Mow the lawn&quot;)&#10;                            assertContains(body, &quot;Paint the fence&quot;)&#10;                        }&#10;&#10;                        @Test&#10;                        fun invalidPriorityProduces400() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;                            assertEquals(HttpStatusCode.BadRequest, response.status)&#10;                        }&#10;&#10;                        @Test&#10;                        fun unusedPriorityProduces404() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;                            assertEquals(HttpStatusCode.NotFound, response.status)&#10;                        }&#10;                    }"/>
            <p>
                これらの各テストでは、Ktorの新しいインスタンスが作成されます。これはNettyのようなWebサーバーではなく、テスト環境内で実行されます。プロジェクトジェネレーターによって作成されたモジュールがロードされ、それがルーティング関数を呼び出します。その後、組み込みの<code>client</code>オブジェクトを使用して、アプリケーションにリクエストを送信し、返されるレスポンスを検証できます。
            </p>
            <p>
                テストはIDE内で実行することも、CI/CDパイプラインの一部として実行することもできます。
            </p>
        </step>
        <step>
            <p>IntelliJ IDE内でテストを実行するには、各テスト関数の横にあるガターアイコン（<img
                    alt="IntelliJ IDEAガターアイコン"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>）をクリックします。</p>
            <tip>
                IntelliJ IDEで単体テストを実行する方法の詳細については、<a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEAドキュメント</a>を参照してください。
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="POSTリクエストの処理" id="handle-post-requests">
    <p>
        上記で説明したプロセスに従って、GETリクエスト用の追加ルートをいくつでも作成できます。これらにより、ユーザーは好きな検索条件を使用してタスクを取得できます。しかし、ユーザーは新しいタスクを作成することも望むでしょう。
    </p>
    <p>
        その場合、適切なHTTPリクエストのタイプはPOSTです。POSTリクエストは通常、ユーザーがHTMLフォームを完成させて送信したときにトリガーされます。
    </p>
    <p>
        GETリクエストとは異なり、POSTリクエストには<code>body</code>があり、これにはフォームに存在するすべての入力の名前と値が含まれています。この情報は、異なる入力からのデータを分離し、不正な文字をエスケープするためにエンコードされます。このプロセスの詳細については、ブラウザとKtorが処理してくれるため、心配する必要はありません。
    </p>
    <p>
        次に、以下の手順で既存のアプリケーションを拡張し、新しいタスクの作成を許可します。
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">HTMLフォームを含む静的コンテンツフォルダーを作成する。</a></li>
        <li><a href="#register-folder">Ktorにこのフォルダーを認識させ、その内容を提供できるようにする。</a></li>
        <li><a href="#add-form-handler">フォーム送信を処理するための新しいリクエストハンドラーを追加する。</a></li>
        <li><a href="#test-functionality">完成した機能をテストする。</a></li>
    </list>
    <procedure title="静的コンテンツの作成" id="create-static-content">
        <step>
            <p>
                <Path>src/main/resources</Path>内に、<Path>task-ui</Path>という新しいディレクトリを作成します。
                これが静的コンテンツのフォルダーになります。
            </p>
        </step>
        <step>
            <p>
                <Path>task-ui</Path>フォルダー内に、新しい<Path>task-form.html</Path>ファイルを作成します。
            </p>
        </step>
        <step>
            <p>新しく作成した<Path>task-form.html</Path>ファイルを開き、以下のコンテンツを追加します。
            </p>
            <code-block lang="html" code="&lt;!DOCTYPE html&gt;&#10;&lt;html lang=&quot;en&quot;&gt;&#10;&lt;head&gt;&#10;    &lt;meta charset=&quot;UTF-8&quot;&gt;&#10;    &lt;title&gt;Adding a new task&lt;/title&gt;&#10;&lt;/head&gt;&#10;&lt;body&gt;&#10;&lt;h1&gt;Adding a new task&lt;/h1&gt;&#10;&lt;form method=&quot;post&quot; action=&quot;/tasks&quot;&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;name&quot;&gt;Name: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; size=&quot;10&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;description&quot;&gt;Description: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;description&quot; name=&quot;description&quot; size=&quot;20&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;priority&quot;&gt;Priority: &lt;/label&gt;&#10;        &lt;select id=&quot;priority&quot; name=&quot;priority&quot;&gt;&#10;            &lt;option name=&quot;Low&quot;&gt;Low&lt;/option&gt;&#10;            &lt;option name=&quot;Medium&quot;&gt;Medium&lt;/option&gt;&#10;            &lt;option name=&quot;High&quot;&gt;High&lt;/option&gt;&#10;            &lt;option name=&quot;Vital&quot;&gt;Vital&lt;/option&gt;&#10;        &lt;/select&gt;&#10;    &lt;/div&gt;&#10;    &lt;input type=&quot;submit&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
        </step>
    </procedure>
    <procedure title="Ktorへのフォルダー登録" id="register-folder">
        <step>
            <p>
                <Path>src/main/kotlin/com/example/plugins</Path>内の<Path>Routing.kt</Path>ファイルに移動します。
            </p>
        </step>
        <step>
            <p>
                以下の<code>staticResources()</code>の呼び出しを<code>Application.configureRouting()</code>関数に追加します。
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            //add the following line&#10;                            staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                            get(&quot;/tasks&quot;) { ... }&#10;&#10;                            get(&quot;/tasks/byPriority/{priority?}&quot;) { … }&#10;                        }&#10;                    }"/>
            <p>これにより、以下のインポートが必要になります。</p>
            <code-block lang="kotlin" code="                    import io.ktor.server.http.content.staticResources"/>
        </step>
        <step>
            <p>アプリケーションを再起動します。</p>
        </step>
        <step>
            <p>
                ブラウザで<a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>にアクセスします。HTMLフォームが表示されるはずです。
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="HTMLフォームを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="フォームのハンドラーを追加" id="add-form-handler">
        <p>
            <Path>Routing.kt</Path>で、以下の追加ルートを<code>configureRouting()</code>関数に追加します。
        </p>
        <code-block lang="kotlin" code="                fun Application.configureRouting() {&#10;                    routing {&#10;                        //...&#10;&#10;                        //add the following route&#10;                        post(&quot;/tasks&quot;) {&#10;                            val formContent = call.receiveParameters()&#10;&#10;                            val params = Triple(&#10;                                formContent[&quot;name&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;description&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;priority&quot;] ?: &quot;&quot;&#10;                            )&#10;&#10;                            if (params.toList().any { it.isEmpty() }) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@post&#10;                            }&#10;&#10;                            try {&#10;                                val priority = Priority.valueOf(params.third)&#10;                                TaskRepository.addTask(&#10;                                    Task(&#10;                                        params.first,&#10;                                        params.second,&#10;                                        priority&#10;                                    )&#10;                                )&#10;&#10;                                call.respond(HttpStatusCode.NoContent)&#10;                            } catch (ex: IllegalArgumentException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            } catch (ex: IllegalStateException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            }&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            ご覧のとおり、新しいルートはGETリクエストではなくPOSTリクエストにマッピングされています。Ktorは<code>receiveParameters()</code>の呼び出しを介してリクエストのボディを処理します。これは、リクエストのボディに存在していたパラメーターのコレクションを返します。
        </p>
        <p>
            3つのパラメーターがあるため、関連する値を<a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a>に保存できます。パラメーターが存在しない場合は、代わりに空の文字列が保存されます。
        </p>
        <p>
            値のいずれかが空の場合、サーバーは<code>400</code>のステータスコードを持つレスポンスを返します。次に、3番目のパラメーターを<code>Priority</code>に変換しようと試み、成功した場合、その情報を新しい<code>Task</code>としてリポジトリに追加します。これらのアクションのどちらも例外を引き起こす可能性があり、その場合、再度<code>400</code>のステータスコードを返します。
        </p>
        <p>
            そうでなければ、すべてが成功した場合、サーバーはクライアントに<code>204</code>ステータスコード（No Content）を返します。これは、リクエストが成功したが、その結果として新しい情報を送信する必要がないことを示します。
        </p>
    </procedure>
    <procedure title="完成した機能のテスト" id="test-functionality">
        <step>
            <p>
                アプリケーションを再起動します。
            </p>
        </step>
        <step>
            <p>ブラウザで<a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>にアクセスします。
            </p>
        </step>
        <step>
            <p>
                フォームにサンプルデータを入力し、<control>Submit</control>をクリックします。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="サンプルデータを持つHTMLフォームを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
            <p>フォームを送信しても、新しいページにリダイレクトされることはありません。</p>
        </step>
        <step>
            <p>
                URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>にアクセスします。新しいタスクが追加されているはずです。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="タスクを含むHTMLテーブルを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                機能を検証するために、以下のテストを<Path>ApplicationTest.kt</Path>に追加します。
            </p>
            <code-block lang="kotlin" code="                    @Test&#10;                    fun newTasksCanBeAdded() = testApplication {&#10;                        application {&#10;                            module()&#10;                        }&#10;&#10;                        val response1 = client.post(&quot;/tasks&quot;) {&#10;                            header(&#10;                                HttpHeaders.ContentType,&#10;                                ContentType.Application.FormUrlEncoded.toString()&#10;                            )&#10;                            setBody(&#10;                                listOf(&#10;                                    &quot;name&quot; to &quot;swimming&quot;,&#10;                                    &quot;description&quot; to &quot;Go to the beach&quot;,&#10;                                    &quot;priority&quot; to &quot;Low&quot;&#10;                                ).formUrlEncode()&#10;                            )&#10;                        }&#10;&#10;                        assertEquals(HttpStatusCode.NoContent, response1.status)&#10;&#10;                        val response2 = client.get(&quot;/tasks&quot;)&#10;                        assertEquals(HttpStatusCode.OK, response2.status)&#10;                        val body = response2.bodyAsText()&#10;&#10;                        assertContains(body, &quot;swimming&quot;)&#10;                        assertContains(body, &quot;Go to the beach&quot;)&#10;                    }"/>
            <p>
                このテストでは、新しいタスクを作成するためのPOSTリクエストと、新しいタスクが追加されたことを確認するためのGETリクエストの2つのリクエストがサーバーに送信されます。最初のリクエストを行う際、<code>setBody()</code>メソッドはリクエストのボディにコンテンツを挿入するために使用されます。テストフレームワークは、コレクションに<code>formUrlEncode()</code>拡張メソッドを提供しており、これはブラウザがデータをフォーマットするプロセスを抽象化します。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="ルーティングのリファクタリング" id="refactor-the-routing">
    <p>
        これまでのルーティングを調べると、すべてのルートが<code>/tasks</code>で始まっていることがわかります。これらを独自のサブルートに配置することで、この重複を取り除くことができます。
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //コードは変更なし&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //コードは変更なし&#10;                        }&#10;&#10;                        post {&#10;                            //コードは変更なし&#10;                        }&#10;                    }&#10;            }"/>
    <p>
        アプリケーションが複数のサブルートを持つ段階に達した場合、それぞれを独自のヘルパー関数に入れるのが適切でしょう。ただし、現時点ではこれは必要ありません。
    </p>
    <p>
        ルートがより整理されていれば、拡張が容易になります。たとえば、名前でタスクを見つけるためのルートを追加できます。
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //コードは変更なし&#10;                        }&#10;                        get(&quot;/byName/{taskName}&quot;) {&#10;                            val name = call.parameters[&quot;taskName&quot;]&#10;                            if (name == null) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@get&#10;                            }&#10;&#10;                            val task = TaskRepository.taskByName(name)&#10;                            if (task == null) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = listOf(task).tasksAsTable()&#10;                            )&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //コードは変更なし&#10;                        }&#10;&#10;                        post {&#10;                            //コードは変更なし&#10;                        }&#10;                    }&#10;                }&#10;            }"/>
</chapter>
<chapter title="次のステップ" id="next-steps">
    <p>
        これで、基本的なルーティングとリクエスト処理の機能を実装しました。さらに、検証、エラー処理、単体テストについても紹介しました。これらのトピックはすべて、今後のチュートリアルでさらに詳しく説明されます。
    </p>
    <p>
        JSONファイルを生成するタスクマネージャー用のRESTful APIを作成する方法を学ぶために、<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">次のチュートリアル</Links>に進んでください。
    </p>
</chapter>
</topic>