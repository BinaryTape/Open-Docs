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
            <b>使用プラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">Routing</Links>
        </p>
</tldr>
<link-summary>
        タスクマネージャーアプリケーションを構築することで、KtorとKotlinでのルーティング、リクエスト処理、パラメーターの基本を学びましょう。
</link-summary>
<card-summary>
        タスクマネージャーアプリケーションを作成して、Ktorでのルーティングとリクエストの仕組みを学びましょう。
</card-summary>
<web-summary>
        KotlinとKtorで作成されたサービスに対する検証、エラー処理、ユニットテストの基本を学びましょう。
</web-summary>
<p>
        このチュートリアルでは、タスクマネージャーアプリケーションを構築することで、KtorとKotlinでのルーティング、リクエストの処理、パラメーターの基本を学びます。
</p>
<p>
        このチュートリアルを終えるまでに、以下のことができるようになります。
</p>
<list type="bullet">
        <li>GETおよびPOSTリクエストを処理する。</li>
        <li>リクエストから情報を抽出する。</li>
        <li>データの変換時にエラーを処理する。</li>
        <li>ユニットテストを使用してルーティングを検証する。</li>
</list>
<chapter title="前提条件" id="prerequisites">
        <p>
            これはKtorサーバーの入門ガイドの2番目のチュートリアルです。このチュートリアルは単独で行うこともできますが、<Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びましょう。">新しいKtorプロジェクトを作成、開いて実行する方法</Links>を学ぶために、前のチュートリアルを完了することを強くお勧めします。
        </p>
        <p>HTTPリクエストの種類、ヘッダー、ステータスコードの基本的な理解も非常に役立ちます。</p>
        <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>をインストールすることをお勧めしますが、お好みの他のIDEを使用することもできます。
        </p>
</chapter>
<chapter title="タスクマネージャーアプリケーション" id="sample-application">
        <p>このチュートリアルでは、以下の機能を持つタスクマネージャーアプリケーションを段階的に構築します。</p>
        <list type="bullet">
            <li>利用可能なすべてのタスクをHTMLテーブルとして表示する。</li>
            <li>優先度と名前でタスクを表示する（これもHTML）。</li>
            <li>HTMLフォームを送信して、追加のタスクを追加する。</li>
        </list>
        <p>
            基本的な機能が動作するように最小限の作業を行い、その後、7回のイテレーションでこの機能を改善および拡張します。この最小限の機能は、いくつかのモデル型、値のリスト、および単一のルートを含むプロジェクトで構成されます。
        </p>
</chapter>
<chapter title="静的HTMLコンテンツの表示" id="display-static-html">
        <p>最初のイテレーションでは、静的HTMLコンテンツを返す新しいルートをアプリケーションに追加します。</p>
        <p><a href="https://start.ktor.io">Ktorプロジェクトジェネレーター</a>を使用して、<control>ktor-task-app</control>という新しいプロジェクトを作成します。すべてのデフォルトオプションを受け入れることができますが、<control>artifact</control>名を変更したい場合もあります。
        </p>
        <tip>
            新しいプロジェクトの作成に関する詳細は、<Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びましょう。">新しいKtorプロジェクトの作成、開いて実行</Links>を参照してください。そのチュートリアルを最近完了した場合は、そこで作成したプロジェクトを自由に再利用してください。
        </tip>
        <procedure>
            <step><Path>src/main/kotlin/com/example/plugins</Path>フォルダ内の<Path>Routing.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。</p>
                [object Promise]
                <p>これにより、URL <code>/tasks</code>とGETリクエストタイプに対して新しいルートが作成されました。GETリクエストはHTTPで最も基本的なリクエストタイプです。これは、ユーザーがブラウザのアドレスバーに入力したり、通常のHTMLリンクをクリックしたりしたときにトリガーされます。</p>
                <p>
                    現時点では静的コンテンツを返しているだけです。HTMLを送信することをクライアントに通知するために、HTTP Content Typeヘッダーを<code>"text/html"</code>に設定します。
                </p>
            </step>
            <step>
                <p>
                    <code>ContentType</code>オブジェクトにアクセスするために、以下のインポートを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>IntelliJ IDEAで、<Path>Application.kt</Path>の<code>main()</code>関数
                    の隣にある実行ガターアイコン（<img alt="intelliJ IDEA アプリケーション実行アイコン"
                                                                        src="intellij_idea_gutter_icon.svg" height="16"
                                                                        width="16"/>）をクリックしてアプリケーションを起動します。
                </p>
            </step>
            <step>
                <p>
                    ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。To-Doリストが表示されるはずです。
                </p>
                <img src="tutorial_routing_and_requests_implementation_1.png"
                     alt="2つの項目があるTo-Doリストを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="タスクモデルの実装" id="implement-a-task-model">
        <p>
            プロジェクトを作成し、基本的なルーティングを設定したので、次に以下の作業を行うことでアプリケーションを拡張します。
        </p>
        <list type="decimal">
            <li><a href="#create-model-types">タスクを表すモデル型を作成する。</a></li>
            <li><a href="#create-sample-values">サンプル値を含むタスクのリストを宣言する。</a></li>
            <li><a href="#add-a-route">このリストを返すようにルートとリクエストハンドラーを変更する。</a></li>
            <li><a href="#test">ブラウザを使用して新しい機能が動作することを確認する。</a></li>
        </list>
        <procedure title="モデル型の作成" id="create-model-types">
            <step>
                <p><Path>src/main/kotlin/com/example</Path>内に、<Path>model</Path>という新しいサブパッケージを作成します。
                </p>
            </step>
            <step>
                <p><Path>model</Path>ディレクトリ内に、新しい<Path>Task.kt</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p><Path>Task.kt</Path>ファイルを開き、優先度を表す以下の<code>enum</code>とタスクを表す<code>class</code>を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>タスク情報をHTMLテーブル内でクライアントに送信するため、以下の拡張関数も追加します。</p>
                [object Promise]
                <p>
                    関数<code>Task.taskAsRow()</code>は<code>Task</code>オブジェクトをテーブルの行としてレンダリングできるようにし、一方<code><![CDATA[List<Task>.tasksAsTable()]]></code>
                    はタスクのリストをテーブルとしてレンダリングできるようにします。
                </p>
            </step>
        </procedure>
        <procedure title="サンプル値の作成" id="create-sample-values">
            <step>
                <p><Path>model</Path>ディレクトリ内に、新しい<Path>TaskRepository.kt</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p><Path>TaskRepository.kt</Path>を開き、タスクのリストを定義するために以下のコードを追加します。
                </p>
                [object Promise]
            </step>
        </procedure>
        <procedure title="新しいルートの追加" id="add-a-route">
            <step>
                <p><Path>Routing.kt</Path>ファイルを開き、既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。
                </p>
                [object Promise]
                <p>
                    静的コンテンツをクライアントに返す代わりに、タスクのリストを提供するようになりました。リストはネットワーク経由で直接送信できないため、クライアントが理解できる形式に変換する必要があります。この場合、タスクはHTMLテーブルに変換されます。
                </p>
            </step>
            <step>
                <p>必要なインポートを追加します。</p>
                [object Promise]
            </step>
        </procedure>
        <procedure title="新しい機能のテスト" id="test">
            <step>
                <p>IntelliJ IDEAで、再実行ボタン（<img alt="intelliJ IDEA 再実行ボタンアイコン"
                                                                     src="intellij_idea_rerun_icon.svg"
                                                                     height="16"
                                                                     width="16"/>）をクリックしてアプリケーションを再起動します。</p>
            </step>
            <step>
                <p>ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。タスクを含むHTMLテーブルが表示されるはずです。
                </p>
                <img src="tutorial_routing_and_requests_implementation_2.png"
                     alt="4行のテーブルを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
                <p>もし表示されたら、おめでとうございます！アプリケーションの基本的な機能は正しく動作しています。</p>
            </step>
        </procedure>
</chapter>
<chapter title="モデルのリファクタリング" id="refactor-the-model">
        <p>
            アプリの機能拡張を続ける前に、リポジトリ内に値のリストをカプセル化することで設計をリファクタリングする必要があります。これにより、データ管理を一元化し、Ktor固有のコードに集中できるようになります。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>ファイルに戻り、既存のタスクリストを以下のコードに置き換えます。
                </p>
                [object Promise]
                <p>
                    これは、リストに基づいた非常にシンプルなタスクのデータストアを実装しています。この例の目的では、タスクが追加される順序が保持されますが、重複は例外をスローすることで禁止されます。</p>
                <p>今後のチュートリアルでは、<a href="https://github.com/JetBrains/Exposed">Exposedライブラリ</a>を介してリレーショナルデータベースに接続するリポジトリを実装する方法を学びます。
                </p>
                <p>
                    今のところ、リポジトリをルート内で利用します。
                </p>
            </step>
            <step>
                <p>
                    <Path>Routing.kt</Path>ファイルを開き、既存の<code>Application.configureRouting()</code>関数を以下の実装に置き換えます。
                </p>
                [object Promise]
                <p>
                    リクエストが到着すると、リポジトリを使用して現在のタスクリストがフェッチされます。その後、これらのタスクを含むHTTPレスポンスが構築されます。
                </p>
            </step>
        </procedure>
        <procedure title="リファクタリングされたコードをテストする">
            <step>
                <p>IntelliJ IDEAで、再実行ボタン（<img alt="intelliJ IDEA 再実行ボタンアイコン"
                                                                     src="intellij_idea_rerun_icon.svg" height="16"
                                                                     width="16"/>）をクリックしてアプリケーションを再起動します。</p>
            </step>
            <step>
                <p>
                    ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。出力はHTMLテーブルが表示されたままであるはずです。
                </p>
                <img src="tutorial_routing_and_requests_implementation_2.png"
                     alt="4行のテーブルを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="パラメーターの操作" id="work-with-parameters">
        <p>
            このイテレーションでは、ユーザーが優先度別にタスクを表示できるようにします。そのためには、アプリケーションは以下のURLへのGETリクエストを許可する必要があります。
        </p>
        <list type="bullet">
            <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
            <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
            <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
            <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
        </list>
        <p>
            追加するルートは<code>/tasks/byPriority/{priority?}</code>で、<code>{priority?}</code>は実行時に抽出する必要があるパスパラメーターを表し、疑問符はパラメーターがオプションであることを示します。クエリパラメーターは任意の名前を付けることができますが、<code>priority</code>が最も適切な選択肢のようです。
        </p>
        <p>
            リクエストを処理するプロセスは、次のように要約できます。
        </p>
        <list type="decimal">
            <li>リクエストから<code>priority</code>というパスパラメーターを抽出する。</li>
            <li>このパラメーターがない場合、<code>400</code>ステータス（不正なリクエスト）を返す。</li>
            <li>パラメーターのテキスト値を<code>Priority</code>列挙値に変換する。</li>
            <li>これが失敗した場合、<code>400</code>ステータスコードのレスポンスを返す。</li>
            <li>リポジトリを使用して、指定された優先度のすべてのタスクを検索する。</li>
            <li>一致するタスクがない場合、<code>404</code>ステータス（見つかりません）を返す。</li>
            <li>一致するタスクをHTMLテーブルとして整形して返す。</li>
        </list>
        <p>
            まずこの機能を実装し、次にそれが動作していることを確認する最良の方法を見つけます。
        </p>
        <procedure title="新しいルートの追加">
            <p><Path>Routing.kt</Path>ファイルを開き、以下のルートをコードに追加します。
            </p>
            [object Promise]
            <p>
                上記で要約したように、URL<code>/tasks/byPriority/{priority?}</code>のハンドラーを記述しました。シンボル<code>priority</code>
                はユーザーが追加したパスパラメーターを表します。残念ながら、サーバー側ではこれが対応するKotlinの列挙型の4つの値のいずれかであることを保証する方法がないため、手動でチェックする必要があります。
            </p>
            <p>
                パスパラメーターが存在しない場合、サーバーはクライアントに<code>400</code>ステータスコードを返します。それ以外の場合、パラメーターの値を抽出し、列挙型のメンバーに変換しようとします。これが失敗した場合、例外がスローされ、サーバーはそれをキャッチして<code>400</code>ステータスコードを返します。
            </p>
            <p>
                変換が成功したと仮定すると、リポジトリを使用して一致する<code>Tasks</code>を検索します。指定された優先度のタスクがない場合、サーバーは<code>404</code>ステータスコードを返します。それ以外の場合、一致するタスクをHTMLテーブルで返します。
            </p>
        </procedure>
        <procedure title="新しいルートのテスト">
            <p>
                この機能は、異なるURLをリクエストすることでブラウザでテストできます。
            </p>
            <step>
                <p>IntelliJ IDEAで、再実行ボタン（<img alt="intelliJ IDEA 再実行ボタンアイコン"
                                                                     src="intellij_idea_rerun_icon.svg"
                                                                     height="16"
                                                                     width="16"/>）をクリックしてアプリケーションを再起動します。</p>
            </step>
            <step>
                <p>
                    すべての中優先度タスクを取得するには、<a
                        href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>に移動します。
                </p>
                <img src="tutorial_routing_and_requests_implementation_4.png"
                     alt="中優先度のタスクを含むテーブルを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    残念ながら、エラーの場合、ブラウザを介して行えるテストは限られています。開発者拡張機能を使用しない限り、ブラウザは失敗したレスポンスの詳細を表示しません。より簡単な代替手段としては、<a
                        href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>などの専門ツールを使用する方法があります。
                </p>
            </step>
            <step>
                <p>
                    Postmanで、同じURL<code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>
                    に対してGETリクエストを送信します。
                </p>
                <img src="tutorial_routing_and_requests_postman.png"
                     alt="Postmanでレスポンス詳細を表示するGETリクエスト"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    これは、サーバーからの生出力と、リクエストおよびレスポンスのすべての詳細を示しています。
                </p>
            </step>
            <step>
                <p>
                    重要タスクのリクエストに対して<code>404</code>ステータスコードが返されることを確認するには、<code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>
                    に新しいGETリクエストを送信します。すると、<control>Response</control>ペインの右上隅にステータスコードが表示されます。
                </p>
                <img src="tutorial_routing_and_requests_postman_vital.png"
                     alt="ステータスコードを表示するPostmanでのGETリクエスト"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    無効な優先度が指定された場合に<code>400</code>が返されることを確認するには、無効なプロパティを持つ別のGETリクエストを作成します。
                </p>
                <img src="tutorial_routing_and_requests_postman_bad_request.png"
                     alt="不正なリクエストステータスコードを持つPostmanでのGETリクエスト"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="ユニットテストの追加" id="add-unit-tests">
        <p>
            これまで、すべてのタスクを取得するためのルートと、優先度別にタスクを取得するためのルートの2つを追加しました。Postmanのようなツールを使用すると、これらのルートを完全にテストできますが、手動での検査が必要であり、Ktorとは外部で実行されます。
        </p>
        <p>
            これはプロトタイピングや小規模なアプリケーションでは許容されます。しかし、このアプローチは、頻繁に実行する必要がある数千ものテストが存在する大規模なアプリケーションにはスケールしません。より良い解決策は、テストを完全に自動化することです。
        </p>
        <p>
            Ktorは、ルートの自動検証をサポートするために独自の<Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びましょう。">テストフレームワーク</Links>を提供しています。
            次に、アプリの既存の機能に対するいくつかのテストを記述します。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src</Path>内に<Path>test</Path>という新しいディレクトリと、その中に<Path>kotlin</Path>というサブディレクトリを作成します。
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
                [object Promise]
                <p>
                    これらの各テストでは、Ktorの新しいインスタンスが作成されます。これはNettyのようなウェブサーバー内ではなく、テスト環境内で実行されます。プロジェクトジェネレーターによって作成されたモジュールがロードされ、それがルーティング関数を呼び出します。その後、組み込みの<code>client</code>オブジェクトを使用してアプリケーションにリクエストを送信し、返されるレスポンスを検証できます。
                </p>
                <p>
                    テストはIDE内、またはCI/CDパイプラインの一部として実行できます。
                </p>
            </step>
            <step>
                <p>IntelliJ IDE内でテストを実行するには、各テスト関数の隣にあるガターアイコン（<img
                        alt="intelliJ IDEA ガターアイコン"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>）をクリックします。</p>
                <tip>
                    IntelliJ IDEでユニットテストを実行する方法の詳細については、<a
                        href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEAのドキュメント</a>を参照してください。
                </tip>
            </step>
        </procedure>
</chapter>
<chapter title="POSTリクエストの処理" id="handle-post-requests">
        <p>
            上記の手順に従って、GETリクエスト用の追加ルートをいくつでも作成できます。これらにより、ユーザーは好きな検索条件を使用してタスクを取得できます。しかし、ユーザーは新しいタスクを作成することも望むでしょう。
        </p>
        <p>
            その場合、適切なHTTPリクエストタイプはPOSTです。POSTリクエストは通常、ユーザーがHTMLフォームに入力して送信したときにトリガーされます。
        </p>
        <p>
            GETリクエストとは異なり、POSTリクエストには<code>body</code>があり、これにはフォームに存在するすべての入力の名前と値が含まれます。この情報は、異なる入力からのデータを分離し、不正な文字をエスケープするためにエンコードされます。このプロセスの詳細は、ブラウザとKtorが処理してくれるため、心配する必要はありません。
        </p>
        <p>
            次に、以下の手順で既存のアプリケーションを拡張し、新しいタスクの作成を許可します。
        </p>
        <list type="decimal">
            <li><a href="#create-static-content">HTMLフォームを含む静的コンテンツフォルダを作成する</a>。</li>
            <li><a href="#register-folder">Ktorにこのフォルダを認識させ、その内容を提供できるようにする</a>。</li>
            <li><a href="#add-form-handler">フォーム送信を処理するための新しいリクエストハンドラーを追加する</a>。</li>
            <li><a href="#test-functionality">完成した機能をテストする</a>。</li>
        </list>
        <procedure title="静的コンテンツの作成" id="create-static-content">
            <step>
                <p>
                    <Path>src/main/resources</Path>内に、<Path>task-ui</Path>という新しいディレクトリを作成します。これが静的コンテンツのフォルダになります。
                </p>
            </step>
            <step>
                <p>
                    <Path>task-ui</Path>フォルダ内に、新しい<Path>task-form.html</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p>新しく作成した<Path>task-form.html</Path>ファイルを開き、以下のコンテンツを追加します。
                </p>
                [object Promise]
            </step>
        </procedure>
        <procedure title="Ktorへのフォルダ登録" id="register-folder">
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/plugins</Path>内の<Path>Routing.kt</Path>ファイルに移動します。
                </p>
            </step>
            <step>
                <p>
                    <code>Application.configureRouting()</code>関数に以下の<code>staticResources()</code>呼び出しを追加します。
                </p>
                [object Promise]
                <p>これには以下のインポートが必要です。</p>
                [object Promise]
            </step>
            <step>
                <p>アプリケーションを再起動します。</p>
            </step>
            <step>
                <p>
                    ブラウザで<a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>に移動します。HTMLフォームが表示されるはずです。
                </p>
                <img src="tutorial_routing_and_requests_implementation_6.png"
                     alt="HTMLフォームを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <procedure title="フォームのハンドラーを追加する" id="add-form-handler">
            <p>
                <Path>Routing.kt</Path>に、以下の追加ルートを<code>configureRouting()</code>関数に追加します。
            </p>
            [object Promise]
            <p>
                ご覧のとおり、新しいルートはGETリクエストではなくPOSTリクエストにマッピングされています。Ktorは<code>receiveParameters()</code>の呼び出しを介してリクエストのボディを処理します。これは、リクエストのボディに存在していたパラメーターのコレクションを返します。
            </p>
            <p>
                3つのパラメーターがあるので、関連する値を<a
                    href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a>に格納できます。パラメーターが存在しない場合は空の文字列が格納されます。
            </p>
            <p>
                いずれかの値が空の場合、サーバーはステータスコード<code>400</code>のレスポンスを返します。その後、3番目のパラメーターを<code>Priority</code>に変換しようとし、成功すれば、新しい<code>Task</code>として情報をリポジトリに追加します。これらのアクションのいずれも例外を引き起こす可能性があり、その場合、再度ステータスコード<code>400</code>を返します。
            </p>
            <p>
                そうでなければ、すべてが成功した場合、サーバーはクライアントに<code>204</code>ステータスコード（コンテンツなし）を返します。これは、リクエストが成功したものの、結果として送信する新しい情報がないことを示します。
            </p>
        </procedure>
        <procedure title="完成した機能のテスト" id="test-functionality">
            <step>
                <p>
                    アプリケーションを再起動します。
                </p>
            </step>
            <step>
                <p>ブラウザで<a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>に移動します。
                </p>
            </step>
            <step>
                <p>
                    フォームにサンプルデータを入力し、<control>Submit</control>をクリックします。
                </p>
                <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                     alt="サンプルデータを持つHTMLフォームを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
                <p>フォームを送信しても、新しいページにリダイレクトされることはありません。</p>
            </step>
            <step>
                <p>
                    URL<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。新しいタスクが追加されているはずです。
                </p>
                <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                     alt="タスクを含むHTMLテーブルを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    機能を検証するために、以下のテストを<Path>ApplicationTest.kt</Path>に追加します。
                </p>
                [object Promise]
                <p>
                    このテストでは、2つのリクエストがサーバーに送信されます。1つは新しいタスクを作成するためのPOSTリクエスト、もう1つは新しいタスクが追加されたことを確認するためのGETリクエストです。最初のリクエストを行う際、<code>setBody()</code>メソッドを使用してリクエストのボディにコンテンツを挿入します。テストフレームワークは、コレクションに<code>formUrlEncode()</code>拡張メソッドを提供しており、ブラウザがデータをフォーマットするプロセスを抽象化します。
                </p>
            </step>
        </procedure>
</chapter>
<chapter title="ルーティングのリファクタリング" id="refactor-the-routing">
        <p>
            これまでのルーティングを調べると、すべてのルートが<code>/tasks</code>で始まっていることがわかります。これらを独自のサブルートに配置することで、この重複を削除できます。
        </p>
        [object Promise]
        <p>
            アプリケーションが複数のサブルートを持つ段階に達した場合、それぞれを独自のヘルパー関数に入れるのが適切でしょう。ただし、現時点ではこれは必須ではありません。
        </p>
        <p>
            ルートがより良く整理されているほど、拡張が容易になります。たとえば、名前でタスクを検索するルートを追加することもできます。
        </p>
        [object Promise]
</chapter>
<chapter title="次のステップ" id="next-steps">
        <p>
            これで、基本的なルーティングとリクエスト処理機能が実装されました。さらに、検証、エラー処理、およびユニットテストについても紹介されました。これらのトピックはすべて、今後のチュートリアルで詳しく説明されます。
        </p>
        <p>
            タスクマネージャー用のJSONファイルを生成する<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びましょう。RESTful APIがJSONファイルを生成する例を紹介します。">RESTful APIの作成方法</Links>を学ぶために、<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びましょう。RESTful APIがJSONファイルを生成する例を紹介します。">次のチュートリアル</Links>に進んでください。
        </p>
</chapter>
</topic>