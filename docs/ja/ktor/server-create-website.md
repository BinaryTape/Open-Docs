<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="KotlinとKtorでウェブサイトを作成する" id="server-create-website">
<tldr>
        <var name="example_name" value="tutorial-server-web-application"/>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>使用されるプラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">ルーティング</Links>、
            <Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツ</Links>、
            <Links href="/ktor/server-thymeleaf" summary="必要な依存関係: io.ktor:%artifact_name%
        コード例:
            %example_name%
        ネイティブサーバーのサポート: ✖️">Thymeleaf</Links>
        </p>
</tldr>
<web-summary>
        KtorとKotlinでウェブサイトを構築する方法を学びましょう。このチュートリアルでは、ThymeleafテンプレートとKtorルートを組み合わせて、サーバー側でHTMLベースのユーザーインターフェースを生成する方法を示します。
</web-summary>
<card-summary>
        KotlinでKtorとThymeleafテンプレートを使用してウェブサイトを構築する方法を学びます。
</card-summary>
<link-summary>
        KotlinでKtorとThymeleafテンプレートを使用してウェブサイトを構築する方法を学びます。
</link-summary>
<p>
        このチュートリアルでは、Ktorと
        <a href="https://www.thymeleaf.org/">Thymeleaf</a>テンプレートを使用して、Kotlinでインタラクティブなウェブサイトを構築する方法を示します。
</p>
<p>
        <Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">前のチュートリアル</Links>では、RESTfulサービスを作成する方法を学びました。これは、JavaScriptで記述されたシングルページアプリケーション（SPA）によって消費されることを想定していました。このアーキテクチャは非常に一般的ですが、すべてのプロジェクトに適しているわけではありません。
</p>
<p>
        実装のすべてをサーバーに保持し、マークアップのみをクライアントに送信したいと考える理由は数多くあります。例えば、以下のようなものが挙げられます。
</p>
<list>
        <li>シンプルさ - 単一のコードベースを維持するため。</li>
        <li>セキュリティ - 攻撃者に情報を提供する可能性のあるデータやコードをブラウザに配置するのを防ぐため。
        </li>
        <li>
            サポート性 - レガシーブラウザやJavaScriptが無効になっているものを含む、可能な限り幅広いクライアントが使用できるようにするため。
        </li>
</list>
<p>
        Ktorは、<Links href="/ktor/server-templating" summary="HTML/CSSまたはJVMテンプレートエンジンで構築されたビューを扱う方法を学びます。">いくつかのサーバーページテクノロジー</Links>との統合により、このアプローチをサポートしています。
</p>
<chapter title="前提条件" id="prerequisites">
        <p>
            このチュートリアルは独立して実行できますが、RESTful APIの作成方法を学ぶために、
            <Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">先行チュートリアル</Links>を完了することを強くお勧めします。
        </p>
        <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
            IDEA</a>のインストールをお勧めしますが、お好みの他のIDEを使用することもできます。
        </p>
</chapter>
<chapter title="Hello Task Manager Webアプリケーション" id="hello-task-manager">
        <p>
            このチュートリアルでは、<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">前のチュートリアル</Links>で構築したTask ManagerをWebアプリケーションに変換します。これを行うには、いくつかのKtorの<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの一般的な機能を提供します。">プラグイン</Links>を使用します。
        </p>
        <p>
            これらのプラグインを既存のプロジェクトに手動で追加することもできますが、新しいプロジェクトを生成し、以前のチュートリアルからのコードを段階的に組み込む方が簡単です。必要なコードはすべて途中で提供しますので、以前のプロジェクトを手元に用意しておく必要はありません。
        </p>
        <procedure title="プラグインを使用して初期プロジェクトを作成する" id="create-project">
            <step>
    <p>
        <a href="https://start.ktor.io/">Ktor Project Generator</a>に移動します。
    </p>
            </step>
            <step>
                <p>
                    <control>プロジェクトアーティファクト</control>
                    フィールドに、プロジェクトアーティファクトの名前として
                    <Path>com.example.ktor-task-web-app</Path>
                    を入力します。
                    <img src="server_create_web_app_generator_project_artifact.png"
                         alt="Ktor Project Generator project artifact name"
                         style="block"
                         border-effect="line" width="706"/>
                </p>
            </step>
            <step>
                <p> 次の画面で、<control>追加</control>ボタンをクリックして、以下のプラグインを検索して追加します。
                </p>
                <list>
                    <li>ルーティング</li>
                    <li>静的コンテンツ</li>
                    <li>Thymeleaf</li>
                </list>
                <p>
                    <img src="ktor_project_generator_add_plugins.gif"
                         alt="Adding plugins in the Ktor Project Generator"
                         border-effect="line"
                         style="block"
                         width="706"/>
                    プラグインを追加すると、プロジェクト設定の下に3つのプラグインがすべて表示されます。
                    <img src="server_create_web_app_generator_plugins.png"
                         alt="Ktor Project Generator plugins list"
                         style="block"
                         border-effect="line" width="706"/>
                </p>
            </step>
            <step>
    <p>
        <control>ダウンロード</control>
        ボタンをクリックして、Ktorプロジェクトを生成しダウンロードします。
    </p>
            </step>
        </procedure>
        <procedure title="スターターコードを追加する" id="add-starter-code">
            <step>
                IntelliJ IDEAまたはお好みの他のIDEでプロジェクトを開きます。
            </step>
            <step>
                <Path>src/main/kotlin/com/example</Path>に移動し、<Path>model</Path>というサブパッケージを作成します。
            </step>
            <step>
                <Path>model</Path>パッケージ内に、新しい<Path>Task.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>Task.kt</Path>ファイルに、優先順位を表す<code>enum</code>とタスクを表す<code>data class</code>を追加します。
                </p>
                [object Promise]
                <p>
                    再び、<code>Task</code>オブジェクトを作成し、表示可能な形式でクライアントに送信したいと考えています。
                </p>
                <p>
                    以前のチュートリアルで、以下のことを覚えているかもしれません。
                </p>
                <list>
                    <li>
                        <Links href="/ktor/server-requests-and-responses" summary="KtorでKotlinのルーティング、リクエスト処理、パラメータの基本をタスクマネージャーアプリケーションを構築しながら学びます。">リクエストを処理してレスポンスを生成する</Links>
                        チュートリアルで、TaskをHTMLに変換するための手書きの拡張関数を追加しました。
                    </li>
                    <li>
                        <Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">RESTful APIを作成する</Links>チュートリアルで、
                        <code>Task</code>クラスに
                        <code>kotlinx.serialization</code>ライブラリの<code>Serializable</code>型をアノテーションしました。
                    </li>
                </list>
                <p>
                    この場合、私たちの目標は、タスクの内容をブラウザに書き込むことができるサーバーページを作成することです。
                </p>
            </step>
            <step>
                <Path>plugins</Path>パッケージ内の<Path>Templating.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    <code>configureTemplating()</code>メソッドに、以下に示すように<code>/tasks</code>のルートを追加します。
                </p>
                [object Promise]
                <p>
                    サーバーが<code>/tasks</code>へのリクエストを受信すると、タスクのリストを作成し、それをThymeleafテンプレートに渡します。<code>ThymeleafContent</code>型は、トリガーしたいテンプレートの名前と、ページでアクセス可能にしたい値のテーブルを受け取ります。
                </p>
                <p>
                    メソッドの先頭にあるThymeleafプラグインの初期化部分で、Ktorがサーバーページのために
                    <Path>templates/thymeleaf</Path>内を検索することがわかります。静的コンテンツと同様に、このフォルダが<Path>resources</Path>ディレクトリ内にあることを期待します。また、<Path>.html</Path>のサフィックスも期待します。
                </p>
                <p>
                    この場合、名前<code>all-tasks</code>はパス
                    <code>src/main/resources/templates/thymeleaf/all-tasks.html</code>にマッピングされます。
                </p>
            </step>
            <step>
                <Path>src/main/resources/templates/thymeleaf</Path>に移動し、新しい<Path>all-tasks.html</Path>ファイルを作成します。
            </step>
            <step>
                <p><Path>all-tasks.html</Path>ファイルを開き、以下のコンテンツを追加します。
                </p>
                [object Promise]
            </step>
            <step>
    <p>IntelliJ IDEAで、実行ボタン
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="intelliJ IDEA run icon"/>)
        をクリックしてアプリケーションを開始します。</p>
            </step>
            <step>
                <p>
                    ブラウザで<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>に移動します。以下に示すように、すべての現在のタスクがテーブルに表示されます。
                </p>
                <img src="server_create_web_app_all_tasks.png"
                     alt="A web browser window displaying a list of tasks" border-effect="rounded" width="706"/>
                <p>
                    すべてのサーバーページフレームワークと同様に、Thymeleafテンプレートは静的コンテンツ（ブラウザに送信される）と動的コンテンツ（サーバーで実行される）を混在させます。<a href="https://freemarker.apache.org/">Freemarker</a>のような代替フレームワークを選択していた場合でも、わずかに異なる構文で同じ機能を提供できたでしょう。
                </p>
            </step>
        </procedure>
</chapter>
<chapter title="GETルートを追加する" id="add-get-routes">
        <p>サーバーページの要求プロセスに慣れたところで、以前のチュートリアルからの機能をこのチュートリアルに転送する作業を続けます。</p>
        <p><control>静的コンテンツ</control>プラグインを含めたため、<Path>Routing.kt</Path>ファイルには以下のコードが含まれています。
        </p>
        [object Promise]
        <p>
            これは、たとえば、<code>/static/index.html</code>へのリクエストでは、以下のパスからコンテンツが提供されることを意味します。
        </p>
        <code>src/main/resources/static/index.html</code>
        <p>
            このファイルはすでに生成されたプロジェクトの一部であるため、追加したい機能のホームページとして使用できます。
        </p>
        <procedure title="インデックスページを再利用する">
            <step>
                <p>
                    <Path>src/main/resources/static</Path>内の<Path>index.html</Path>ファイルを開き、その内容を以下の実装に置き換えます。
                </p>
                [object Promise]
            </step>
            <step>
    <p>
        IntelliJ IDEAで、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA rerun icon"/>）をクリックしてアプリケーションを再起動します。
    </p>
            </step>
            <step>
                <p>
                    ブラウザで<a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a>に移動します。リンクボタンと、タスクの表示、フィルタリング、作成を可能にする3つのHTMLフォームが表示されます。
                </p>
                <img src="server_create_web_app_tasks_form.png"
                     alt="A web browser displaying an HTML form" border-effect="rounded" width="706"/>
                <p>
                    <code>name</code>または<code>priority</code>でタスクをフィルタリングする場合、GETリクエストを介してHTMLフォームを送信していることに注意してください。これは、パラメータがURLの後にクエリ文字列として追加されることを意味します。
                </p>
                <p>
                    例えば、<code>Medium</code>優先度のタスクを検索する場合、サーバーに送信されるリクエストは以下のようになります。
                </p>
                <code>http://localhost:8080/tasks/byPriority?priority=Medium</code>
            </step>
        </procedure>
        <procedure title="TaskRepositoryを再利用する" id="task-repository">
            <p>
                タスクのリポジトリは、以前のチュートリアルからのものと同一で構いません。
            </p>
            <p>
                <Path>model</Path>パッケージ内に、新しい<Path>TaskRepository.kt</Path>ファイルを作成し、以下のコードを追加します。
            </p>
            [object Promise]
        </procedure>
        <procedure title="GETリクエストのルートを再利用する" id="reuse-routes">
            <p>
                リポジトリを作成したので、GETリクエストのルートを実装できます。
            </p>
            <step>
                <Path>src/main/kotlin/com/example/plugins</Path>にある<Path>Templating.kt</Path>ファイルに移動します。
            </step>
            <step>
                <p>
                    現在の<code>configureTemplating()</code>の実装を以下に置き換えます。
                </p>
                [object Promise]
                <p>
                    上記のコードは以下のように要約できます。
                </p>
                <list>
                    <li>
                        <code>/tasks</code>へのGETリクエストでは、サーバーはリポジトリからすべてのタスクを取得し、
                        <Path>all-tasks</Path>テンプレートを使用して、ブラウザに送信される次のビューを生成します。
                    </li>
                    <li>
                        <code>/tasks/byName</code>へのGETリクエストでは、サーバーは<code>queryString</code>からパラメータ<code>taskName</code>を取得し、一致するタスクを見つけて、
                        <Path>single-task</Path>テンプレートを使用して、ブラウザに送信される次のビューを生成します。
                    </li>
                    <li>
                        <code>/tasks/byPriority</code>へのGETリクエストでは、サーバーはパラメータ
                        <code>priority</code>を<code>queryString</code>から取得し、一致するタスクを見つけて、
                        <Path>tasks-by-priority</Path>テンプレートを使用して、ブラウザに送信される次のビューを生成します。
                    </li>
                </list>
                <p>これらすべてが機能するには、追加のテンプレートが必要です。</p>
            </step>
            <step>
                <Path>src/main/resources/templates/thymeleaf</Path>に移動し、新しい<Path>single-task.html</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>single-task.html</Path>ファイルを開き、以下のコンテンツを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>同じフォルダに、<Path>tasks-by-priority.html</Path>という新しいファイルを作成します。
                </p>
            </step>
            <step>
                <p>
                    <Path>tasks-by-priority.html</Path>ファイルを開き、以下のコンテンツを追加します。
                </p>
                [object Promise]
            </step>
        </procedure>
</chapter>
<chapter title="POSTリクエストのサポートを追加する" id="add-post-requests">
        <p>
            次に、以下の処理を行うために、<code>/tasks</code>にPOSTリクエストハンドラを追加します。
        </p>
        <list>
            <li>フォームパラメータから情報を抽出する。</li>
            <li>リポジトリを使用して新しいタスクを追加する。</li>
            <li><control>all-tasks</control>テンプレートを再利用してタスクを表示する。
            </li>
        </list>
        <procedure>
            <step>
                <Path>src/main/kotlin/com/example/plugins</Path>にある<Path>Templating.kt</Path>ファイルに移動します。
            </step>
            <step>
                <p>
                    <code>configureTemplating()</code>メソッド内に、以下の<code>post</code>リクエストルートを追加します。
                </p>
                [object Promise]
            </step>
            <step>
    <p>
        IntelliJ IDEAで、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA rerun icon"/>）をクリックしてアプリケーションを再起動します。
    </p>
            </step>
            <step>
                ブラウザで<a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>に移動します。
            </step>
            <step>
                <p>
                    <control>タスクの作成または編集</control>フォームに新しいタスクの詳細を入力します。
                </p>
                <img src="server_create_web_app_new_task.png"
                     alt="A web browser displaying HTML forms" border-effect="rounded" width="706"/>
            </step>
            <step>
                <p><control>送信</control>ボタンをクリックしてフォームを送信します。
                    すると、新しいタスクがすべてのタスクのリストに表示されます。
                </p>
                <img src="server_create_web_app_new_task_added.png"
                     alt="A web browser displaying a list of tasks" border-effect="rounded" width="706"/>
            </step>
        </procedure>
</chapter>
<chapter title="次のステップ" id="next-steps">
        <p>
            おめでとうございます！これでTask Managerをウェブアプリケーションとして再構築し、Thymeleafテンプレートの利用方法を学びました。</p>
        <p>
            Webソケットを扱う方法を学ぶために、<Links href="/ktor/server-create-websocket-application" summary="WebSocketsの能力を活用してコンテンツを送受信する方法を学びます。">次のチュートリアル</Links>に進んでください。
        </p>
</chapter>
</topic>