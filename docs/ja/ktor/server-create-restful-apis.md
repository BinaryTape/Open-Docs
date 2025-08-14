<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="KotlinとKtorでRESTful APIを作成する方法" id="server-create-restful-apis"
       help-id="create-restful-apis">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-restful-api"/>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>使用プラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するための中核となるプラグインです。">Routing</Links>,<Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">Static Content</Links>,
            <Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエートと、特定の形式でのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。">Content Negotiation</Links>, <a
                href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
        </p>
</tldr>
<card-summary>
    KtorでRESTful APIを構築する方法を学びます。このチュートリアルでは、実際の例を通してセットアップ、ルーティング、テストを扱います。
</card-summary>
<web-summary>
    KtorでKotlin RESTful APIを構築する方法を学びます。このチュートリアルでは、実際の例を通してセットアップ、ルーティング、テストを扱います。Kotlinバックエンド開発者にとって理想的な入門チュートリアルです。
</web-summary>
<link-summary>
    KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。
</link-summary>
<p>
    このチュートリアルでは、KotlinとKtorを使用してバックエンドサービスを構築する方法を、JSONファイルを生成するRESTful APIの例を交えて解説します。
</p>
<p>
    <Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。">前のチュートリアル</Links>では、バリデーション、エラーハンドリング、ユニットテストの基礎を紹介しました。このチュートリアルでは、タスク管理のためのRESTfulサービスを作成することで、これらのトピックをさらに深掘りします。
</p>
<p>
    次のことを学びます。
</p>
<list>
    <li>JSONシリアライゼーションを使用するRESTfulサービスを作成する。</li>
    <li><Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエートと、特定の形式でのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。">Content Negotiation</Links>のプロセスを理解する。</li>
    <li>Ktor内でREST APIのルートを定義する。</li>
</list>
<chapter title="前提条件" id="prerequisites">
    <p>このチュートリアルは単独で行うこともできますが、
        その前のチュートリアルを完了して、<Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。">リクエストを処理し、レスポンスを生成する</Links>方法を学ぶことを強くお勧めします。
    </p>
    <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>をインストールすることをお勧めしますが、他のIDEを使用することも可能です。
    </p>
</chapter>
<chapter title="Hello RESTfulタスクマネージャー" id="hello-restful-task-manager">
    <p>このチュートリアルでは、既存のタスクマネージャーをRESTfulサービスとして書き換えます。これには、Ktorのいくつかの<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの一般的な機能を提供します。">プラグイン</Links>を使用します。</p>
    <p>
        既存のプロジェクトに手動で追加することもできますが、新しいプロジェクトを生成し、そこから前のチュートリアルのコードを段階的に追加する方が簡単です。すべてのコードを段階的に繰り返すため、前のプロジェクトを手元に用意する必要はありません。
    </p>
    <procedure title="プラグインを使用して新しいプロジェクトを作成する">
        <step>
    <p>
        <a href="https://start.ktor.io/">Ktorプロジェクトジェネレーター</a>に移動します。
    </p>
        </step>
        <step>
            <p><control>Project artifact</control>フィールドに<Path>com.example.ktor-rest-task-app</Path>をプロジェクトアーティファクト名として入力します。
                <img src="tutorial_creating_restful_apis_project_artifact.png"
                     alt="Ktorプロジェクトジェネレーターでのプロジェクトアーティファクトの命名"
                     style="block"
                     border-effect="line"
                     width="706"/>
            </p>
        </step>
        <step>
            <p>
                プラグインセクションで、<control>Add</control>ボタンをクリックして、以下のプラグインを検索し、追加します。
            </p>
            <list type="bullet">
                <li>Routing</li>
                <li>Content Negotiation</li>
                <li>Kotlinx.serialization</li>
                <li>Static Content</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif" alt="Ktorプロジェクトジェネレーターでのプラグインの追加"
                     border-effect="line"
                     style="block"
                     width="706"/>
                プラグインを追加すると、プロジェクト設定の下に4つすべてのプラグインが表示されます。
                <img src="tutorial_creating_restful_apis_plugins_list.png"
                     alt="Ktorプロジェクトジェネレーターのプラグインリスト"
                     border-effect="line"
                     style="block"
                     width="706"/>
            </p>
        </step>
        <step>
    <p>
        <control>Download</control>ボタンをクリックして、Ktorプロジェクトを生成し、ダウンロードします。
    </p>
        </step>
    </procedure>
    <procedure title="スターターコードを追加する" id="add-starter-code">
        <step>
            <p>以前に<a href="server-create-a-new-project.topic#open-explore-run">IntelliJ IDEAでKtorプロジェクトを開き、探索し、実行する</a>チュートリアルで説明したように、IntelliJ IDEAでプロジェクトを開きます。</p>
        </step>
        <step>
            <p>
                <Path>src/main/kotlin/com/example</Path>に移動し、<Path>model</Path>というサブパッケージを作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>model</Path>パッケージ内に、新しい<Path>Task.kt</Path>ファイルを作成します。
            </p>
        </step>
        <step>
            <p>
                <Path>Task.kt</Path>ファイルを開き、優先順位を表す<code>enum</code>とタスクを表す<code>class</code>を追加します。
            </p>
            [object Promise]
            <p>
                前のチュートリアルでは、拡張関数を使用して<code>Task</code>をHTMLに変換しました。この場合、
                <code>Task</code>クラスは<code>kotlinx.serialization</code>ライブラリの<a
                    href="https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"><code>Serializable</code></a>型でアノテーションされています。
            </p>
        </step>
        <step>
            <p>
                <Path>Routing.kt</Path>ファイルを開き、既存のコードを以下の実装に置き換えます。
            </p>
            [object Promise]
            <p>
                前のチュートリアルと同様に、URL <code>/tasks</code>へのGETリクエストのルートを作成しました。
                今回は、タスクのリストを手動で変換する代わりに、単純にリストを返します。
            </p>
        </step>
        <step>
    <p>IntelliJ IDEAで、実行ボタン（
        <img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="IntelliJ IDEAの実行アイコン"/>）
        をクリックしてアプリケーションを開始します。</p>
        </step>
        <step>
            <p>
                ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。以下に示すように、タスクのリストのJSONバージョンが表示されます。
            </p>
        </step>
        <img src="tutorial_creating_restful_apis_starter_code_preview.png"
             alt="ブラウザ画面に表示されたJSONデータ"
             border-effect="rounded"
             width="706"/>
        <p>明らかに、多くの作業が私たちに代わって実行されています。一体何が起こっているのでしょうか？</p>
    </procedure>
</chapter>
<chapter title="Content Negotiationを理解する" id="content-negotiation">
    <chapter title="ブラウザを介したContent Negotiation" id="via-browser">
        <p>
            プロジェクトを作成した際に、<Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプのネゴシエートと、特定の形式でのコンテンツのシリアライズ/デシリアライズという2つの主要な目的を果たします。">Content Negotiation</Links>プラグインを含めました。このプラグインは、クライアントがレンダリングできるコンテンツのタイプを調べ、現在のサービスが提供できるコンテンツタイプと照合します。このため、<format style="italic">Content Negotiation</format>という用語が使われます。
        </p>
        <p>
            HTTPでは、クライアントは<code>Accept</code>ヘッダーを介してレンダリングできるコンテンツタイプを通知します。このヘッダーの値は1つ以上のコンテンツタイプです。上記の場合、ブラウザに組み込まれている開発ツールを使用してこのヘッダーの値を調べることができます。
        </p>
        <p>
            以下の例を考えてみましょう。
        </p>
        [object Promise]
        <p><code>*/*</code>の含まれている点に注意してください。このヘッダーは、HTML、XML、または画像を許可することを示していますが、他のあらゆるコンテンツタイプも許可します。</p>
        <p>Content Negotiationプラグインは、データをブラウザに送り返す形式を見つける必要があります。プロジェクト内の生成されたコードを見ると、<Path>src/main/kotlin/com/example</Path>内に<Path>Serialization.kt</Path>というファイルがあり、以下が含まれています。
        </p>
        [object Promise]
        <p>
            このコードは<code>ContentNegotiation</code>プラグインをインストールし、<code>kotlinx.serialization</code>プラグインも設定します。これにより、クライアントがリクエストを送信すると、サーバーはJSONとしてシリアライズされたオブジェクトを返送できます。
        </p>
        <p>
            ブラウザからのリクエストの場合、<code>ContentNegotiation</code>プラグインはJSONのみを返せることを知っており、ブラウザは送信されたものを何でも表示しようとします。したがって、リクエストは成功します。
        </p>
    </chapter>
    <procedure title="JavaScriptを介したContent Negotiation" id="via-javascript">
        <p>
            本番環境では、JSONをブラウザに直接表示したくはないでしょう。代わりに、ブラウザ内でJavaScriptコードが実行され、それがリクエストを行い、返されたデータをSingle Page Application (SPA)の一部として表示します。通常、この種のアプリケーションは<a href="https://react.dev/">React</a>、
            <a href="https://angular.io/">Angular</a>、
            または<a href="https://vuejs.org/">Vue.js</a>のようなフレームワークを使用して書かれます。
        </p>
        <step>
            <p>
                これをシミュレートするために、<Path>src/main/resources/static</Path>内にある<Path>index.html</Path>ページを開き、デフォルトのコンテンツを以下に置き換えます。
            </p>
            [object Promise]
            <p>
                このページにはHTMLフォームと空のテーブルが含まれています。フォームを送信すると、JavaScriptのイベントハンドラーが<code>Accept</code>ヘッダーを
                <code>application/json</code>に設定して<code>/tasks</code>エンドポイントにリクエストを送信します。返されたデータは、その後デシリアライズされ、HTMLテーブルに追加されます。
            </p>
        </step>
        <step>
    <p>
        IntelliJ IDEAで、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEAの再実行アイコン"/>）をクリックしてアプリケーションを再起動します。
    </p>
        </step>
        <step>
            <p>
                URL <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>に移動します。<control>View The Tasks</control>ボタンをクリックしてデータを取得できるはずです。
            </p>
            <img src="tutorial_creating_restful_apis_tasks_via_js.png"
                 alt="ボタンとHTMLテーブルとして表示されたタスクを示すブラウザウィンドウ"
                 border-effect="line"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="GETルートを追加する" id="porting-get-routes">
    <p>
        Content Negotiationのプロセスに慣れたところで、<Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメーターの基本を学びます。">前のチュートリアル</Links>からの機能をこのチュートリアルに転送する作業を続けます。
    </p>
    <chapter title="タスクリポジトリを再利用する" id="task-repository">
        <p>
            タスクのリポジトリは変更なしで再利用できるため、まずそれを行います。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>model</Path>パッケージ内に、新しい<Path>TaskRepository.kt</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>を開き、以下のコードを追加します。
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="GETリクエストのルートを再利用する" id="get-requests">
        <p>
            リポジトリを作成したので、GETリクエストのルートを実装できます。タスクをHTMLに変換することを心配する必要がなくなったため、以前のコードは簡素化できます。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example</Path>内の<Path>Routing.kt</Path>ファイルに移動します。
                </p>
            </step>
            <step>
                <p>
                    <code>Application.configureRouting()</code>関数内の<code>/tasks</code>ルートのコードを以下の実装で更新します。
                </p>
                [object Promise]
                <p>
                    これにより、サーバーは以下のGETリクエストに応答できます。</p>
                <list>
                    <li><code>/tasks</code>はリポジトリ内のすべてのタスクを返します。</li>
                    <li><code>/tasks/byName/{taskName}</code>は、指定された<code>taskName</code>でフィルタリングされたタスクを返します。
                    </li>
                    <li><code>/tasks/byPriority/{priority}</code>は、指定された<code>priority</code>でフィルタリングされたタスクを返します。
                    </li>
                </list>
            </step>
            <step>
    <p>
        IntelliJ IDEAで、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEAの再実行アイコン"/>）をクリックしてアプリケーションを再起動します。
    </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="機能をテストする" id="test-tasks-routes">
        <procedure title="ブラウザを使用する">
            <p>これらのルートはブラウザでテストできます。例えば、<a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>に移動すると、<code>Medium</code>優先度のすべてのタスクがJSON形式で表示されます。</p>
            <img src="tutorial_creating_restful_apis_tasks_medium_priority.png"
                 alt="JSON形式で中程度の優先度のタスクを示すブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
            <p>
                これらの種類のリクエストは通常JavaScriptから来るため、よりきめ細かなテストが望ましいです。これには、<a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>のような専門ツールを使用できます。
            </p>
        </procedure>
        <procedure title="Postmanを使用する">
            <step>
                <p>Postmanで、URL
                    <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>を使用して新しいGETリクエストを作成します。</p>
            </step>
            <step>
                <p>
                    <ui-path>Headers</ui-path>ペインで、<ui-path>Accept</ui-path>ヘッダーの値を<code>application/json</code>に設定します。
                </p>
            </step>
            <step>
                <p><control>Send</control>をクリックしてリクエストを送信し、レスポンスビューアーで応答を確認します。
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_postman.png"
                     alt="Postmanにおける、中程度の優先度のタスクをJSON形式で示すGETリクエスト"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
        <procedure title="HTTPリクエストファイルを使用する">
            <p>IntelliJ IDEA Ultimateでは、HTTPリクエストファイルで同じ手順を実行できます。</p>
            <step>
                <p>
                    プロジェクトのルートディレクトリに、新しい<Path>REST Task Manager.http</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>REST Task Manager.http</Path>ファイルを開き、以下のGETリクエストを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    IntelliJ IDE内でリクエストを送信するには、その横にあるガターアイコン（<img
                        alt="IntelliJ IDEAのガターアイコン"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>）をクリックします。
                </p>
            </step>
            <step>
                <p>これにより、<Path>Services</Path>ツールウィンドウで開かれて実行されます。
                </p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority_http_file.png"
                     alt="HTTPファイルにおける、中程度の優先度のタスクをJSON形式で示すGETリクエスト"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <note>
                ルートをテストする別の方法として、Kotlin Notebook内から<a
                    href="https://khttp.readthedocs.io/en/latest/">khttp</a>ライブラリを使用することもできます。
            </note>
        </chapter>
    </chapter>
    <chapter title="POSTリクエストのルートを追加する" id="add-a-route-for-post-requests">
        <p>
            前のチュートリアルでは、HTMLフォームを通じてタスクを作成していました。しかし、現在はRESTfulサービスを構築しているため、その必要はありません。代わりに、<code>kotlinx.serialization</code>フレームワークを利用することで、ほとんどの重い処理が行われます。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example</Path>内にある<Path>Routing.kt</Path>ファイルを開きます。
                </p>
            </step>
            <step>
                <p>
                    <code>Application.configureRouting()</code>関数に新しいPOSTルートを次のように追加します。
                </p>
                [object Promise]
                <p>
                    以下の新しいインポートを追加します。
                </p>
                [object Promise]
                <p>
                    <code>/tasks</code>にPOSTリクエストが送信されると、<code>kotlinx.serialization</code>フレームワークがリクエストのボディを<code>Task</code>オブジェクトに変換するために使用されます。これが成功した場合、タスクはリポジトリに追加されます。デシリアライゼーションプロセスが失敗した場合は、サーバーは<code>SerializationException</code>を処理する必要があり、タスクが重複している場合は<code>IllegalStateException</code>を処理する必要があります。
                </p>
            </step>
            <step>
                <p>
                    アプリケーションを再起動します。
                </p>
            </step>
            <step>
                <p>
                    Postmanでこの機能をテストするには、URL <code>http://0.0.0.0:8080/tasks</code>への新しいPOSTリクエストを作成します。
                </p>
            </step>
            <step>
                <p>
                    <ui-path>Body</ui-path>ペインに、新しいタスクを表す以下のJSONドキュメントを追加します。
                </p>
                [object Promise]
                <img src="tutorial_creating_restful_apis_add_task.png"
                     alt="Postmanにおける、新しいタスクを追加するためのPOSTリクエスト"
                     border-effect="line"
                     width="706"/>
            </step>
            <step>
                <p><control>Send</control>をクリックしてリクエストを送信します。
                </p>
            </step>
            <step>
                <p>
                    <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>にGETリクエストを送信することで、タスクが追加されたことを確認できます。
                </p>
            </step>
            <step>
                <p>
                    IntelliJ IDEA Ultimateでは、HTTPリクエストファイルに以下を追加することで、同じ手順を実行できます。
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="削除のサポートを追加する" id="remove-tasks">
        <p>
            サービスの基本的な操作の追加はほぼ完了しました。これらはよくCRUD操作、つまりCreate、Read、Update、Deleteの略語としてまとめられます。今回はDelete操作を実装します。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>ファイルに、タスクをその名前で削除するための以下のメソッドを<code>TaskRepository</code>オブジェクト内に追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>Routing.kt</Path>ファイルを開き、DELETEリクエストを処理するためのエンドポイントを<code>routing()</code>関数に追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    アプリケーションを再起動します。
                </p>
            </step>
            <step>
                <p>
                    HTTPリクエストファイルに以下のDELETEリクエストを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    IntelliJ IDE内でDELETEリクエストを送信するには、その横にあるガターアイコン（<img
                        alt="IntelliJ IDEAのガターアイコン"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>）をクリックします。
                </p>
            </step>
            <step>
                <p>
                    <Path>Services</Path>ツールウィンドウで応答を確認できます。
                </p>
                <img src="tutorial_creating_restful_apis_delete_task.png"
                     alt="HTTPリクエストファイルにおけるDELETEリクエスト"
                     border-effect="line"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="Ktorクライアントでユニットテストを作成する" id="create-unit-tests">
        <p>
            これまではアプリケーションを手動でテストしてきましたが、すでに気づいているように、このアプローチは時間がかかり、スケールしません。代わりに、組み込みの<code>client</code>オブジェクトを使用してJSONをフェッチおよびデシリアライズする<Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">JUnitテスト</Links>を実装できます。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path>内の<Path>ApplicationTest.kt</Path>ファイルを開きます。
                </p>
            </step>
            <step>
                <p>
                    <Path>ApplicationTest.kt</Path>ファイルの内容を以下に置き換えます。
                </p>
                [object Promise]
                <p>
                    サーバーで行ったのと同様に、<a href="client-create-and-configure.md#plugins">Plugins</a>に<code>ContentNegotiation</code>および
                    <code>kotlinx.serialization</code>プラグインをインストールする必要があることに注意してください。
                </p>
            </step>
            <step>
                <p>
                    <Path>gradle/libs.versions.toml</Path>にあるバージョンカタログに以下の依存関係を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>build.gradle.kts</Path>ファイルに新しい依存関係を追加します。
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="JsonPathでユニットテストを作成する" id="unit-tests-via-jsonpath">
        <p>
            Ktorクライアント、または類似のライブラリでサービスをテストするのは便利ですが、品質保証 (QA) の観点から見ると欠点があります。サーバーはJSONを直接処理しないため、JSON構造に関するその仮定について確信を持つことができません。
        </p>
        <p>
            例えば、以下のような仮定です。
        </p>
        <list>
            <li>実際には<code>object</code>が使用されているのに、値が<code>array</code>に格納されている。</li>
            <li>実際には<code>string</code>なのに、プロパティが<code>number</code>として格納されている。</li>
            <li>メンバーが宣言順にシリアライズされていると仮定されているが、実際はそうではない。</li>
        </list>
        <p>
            サービスが複数のクライアントによって使用されることを意図している場合、JSON構造に確信を持つことが重要です。これを実現するには、Ktorクライアントを使用してサーバーからテキストを取得し、そのコンテンツを<a href="https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path">JSONPath</a>ライブラリを使用して分析します。</p>
        <procedure>
            <step>
                <p><Path>build.gradle.kts</Path>ファイルに、JSONPathライブラリを<code>dependencies</code>ブロックに追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path>フォルダーに移動し、新しい<Path>ApplicationJsonPathTest.kt</Path>ファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>ApplicationJsonPathTest.kt</Path>ファイルを開き、以下の内容を追加します。
                </p>
                [object Promise]
                <p>
                    JsonPathクエリは次のように機能します。
                </p>
                <list>
                    <li>
                        <code>$[*].name</code>は、「ドキュメントを配列として扱い、各エントリのnameプロパティの値を返す」ことを意味します。
                    </li>
                    <li>
                        <code>$[?(@.priority == '$priority')].name</code>は、「配列内のすべてのエントリのうち、指定された値と等しい優先度を持つもののnameプロパティの値を返す」ことを意味します。
                    </li>
                </list>
                <p>
                    これらのクエリを使用して、返されるJSONの理解を確認できます。コードのリファクタリングやサービスの再デプロイを行う際に、シリアライゼーションの変更があれば、現在のフレームワークでのデシリアライゼーションを妨げない場合でも、それらが特定されます。これにより、公開APIを自信を持って再公開できます。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="次のステップ" id="next-steps">
        <p>
            おめでとうございます！タスクマネージャーアプリケーションのRESTful APIサービスの作成が完了し、KtorクライアントとJsonPathを使ったユニットテストの細部まで学びました。</p>
        <p>
            APIサービスを再利用してWebアプリケーションを構築する方法を学ぶために、<Links href="/ktor/server-create-website" summary="Kotlin、Ktor、Thymeleafテンプレートを使用してウェブサイトを構築する方法を学びます。">次のチュートリアル</Links>に進んでください。
        </p>
    </chapter>
</topic>