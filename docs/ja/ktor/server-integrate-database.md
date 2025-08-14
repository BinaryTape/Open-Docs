<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin、Ktor、Exposed を使用してデータベースを統合する" id="server-integrate-database">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-db-integration"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用プラグイン</b>: <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションでの受信リクエストを処理するためのコアプラグインです。">ルーティング</Links>、<Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツ</Links>、
        <Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインには、クライアントとサーバー間でメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。">コンテンツネゴシエーション</Links>、 <Links href="/ktor/server-status-pages" summary="%plugin_name% を使用すると、Ktorアプリケーションは、スローされた例外またはステータスコードに基づいて、あらゆる障害状態に適切に応答できます。">ステータスページ</Links>、
        <Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインには、クライアントとサーバー間でメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。">kotlinx.serialization</Links>、
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md">Exposed</a>、
        <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md">Postgres</a>
    </p>
</tldr>
<card-summary>
    KtorサービスをExposed SQLライブラリでデータベースリポジトリに接続するプロセスを学びます。
</card-summary>
<link-summary>
    KtorサービスをExposed SQLライブラリでデータベースリポジトリに接続するプロセスを学びます。
</link-summary>
<web-summary>
    KotlinとKtorを使用して、RESTfulサービスがデータベースリポジトリにリンクするシングルページアプリケーション（SPA）を構築する方法を学びます。Exposed SQLライブラリを使用し、テスト用にリポジトリを偽装できます。
</web-summary>
<p>
    この記事では、Kotlin用SQLライブラリである<a
        href="https://github.com/JetBrains/Exposed">Exposed</a>を使用して、Ktorサービスをリレーショナルデータベースと統合する方法を学びます。
</p>
<p>このチュートリアルの終わりまでに、以下の方法を学ぶことができます:</p>
<list>
    <li>JSONシリアライゼーションを使用するRESTfulサービスを作成する。</li>
    <li>これらのサービスに異なるリポジトリを注入する。</li>
    <li>フェイクリポジトリを使用してサービスの単体テストを作成する。</li>
    <li>Exposedと依存性注入（DI）を使用して動作するリポジトリを構築する。</li>
    <li>外部データベースにアクセスするサービスをデプロイする。</li>
</list>
<p>
    これまでのチュートリアルでは、タスクマネージャーの例を使用して、<Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinでのルーティング、リクエスト処理、パラメーターの基本を学びます。">リクエストの処理</Links>、
    <Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">RESTful APIの作成</Links>、または
    <Links href="/ktor/server-create-website" summary="KtorとThymeleafテンプレートを使用して、KotlinでWebサイトを構築する方法を学びます。">Thymeleafテンプレートを使用したWebアプリケーションの構築</Links>といった基本を扱いました。
    これらのチュートリアルでは、シンプルなインメモリの<code>TaskRepository</code>を使用したフロントエンド機能に焦点を当てましたが、
    このガイドでは、Ktorサービスが<a href="https://github.com/JetBrains/Exposed">Exposed SQLライブラリ</a>を介してリレーショナルデータベースとどのように相互作用できるかに焦点を移します。
</p>
<p>
    このガイドはより長く複雑ですが、それでも迅速に動作するコードを作成し、徐々に新しい機能を導入することができます。
</p>
<p>このガイドは2つのパートに分かれています:</p>
<list type="decimal">
    <li>
        <a href="#create-restful-service-and-repository">インメモリリポジトリでアプリケーションを作成する。</a>
    </li>
    <li>
        <a href="#add-postgresql-repository">インメモリリポジトリをPostgreSQLを使用するリポジトリに置き換える。</a>
    </li>
</list>
<chapter title="前提条件" id="prerequisites">
    <p>
        このチュートリアルは単独で実行できますが、Content NegotiationとRESTに慣れるために<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">RESTful APIの作成</Links>チュートリアルを完了することをお勧めします。
    </p>
    <p><a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>をインストールすることをお勧めしますが、任意のIDEを使用できます。
    </p>
</chapter>
<chapter title="RESTfulサービスとインメモリリポジトリを作成する" id="create-restful-service-and-repository">
    <p>
        まず、タスクマネージャーのRESTfulサービスを再作成します。最初はインメモリリポジトリを使用しますが、最小限の労力で置き換えられるような設計構造にします。
    </p>
    <p>これには6つの段階があります:</p>
    <list type="decimal">
        <li>
            <a href="#create-project">初期プロジェクトを作成する。</a>
        </li>
        <li>
            <a href="#add-starter-code">スターターコードを追加する。</a>
        </li>
        <li>
            <a href="#add-routes">CRUDルートを追加する。</a>
        </li>
        <li>
            <a href="#add-client-page">シングルページアプリケーション（SPA）を追加する。</a>
        </li>
        <li>
            <a href="#test-manually">アプリケーションを手動でテストする。</a>
        </li>
        <li>
            <a href="#add-automated-tests">自動テストを追加する。</a>
        </li>
    </list>
    <chapter title="プラグインを使用して新しいプロジェクトを作成する" id="create-project">
        <p>
            Ktorプロジェクトジェネレーターで新しいプロジェクトを作成するには、以下の手順に従います:
        </p>
        <procedure id="create-project-procedure">
            <step>
<p>
    <a href="https://start.ktor.io/">Ktorプロジェクトジェネレーター</a>に移動します。
</p>
            </step>
            <step>
                <p>
                    <control>Project artifact</control>フィールドに、プロジェクト成果物の名前として
                    <Path>com.example.ktor-exposed-task-app</Path>を入力します。
                    <img src="tutorial_server_db_integration_project_artifact.png"
                         alt="Ktorプロジェクトジェネレーターでのプロジェクト成果物の命名"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    プラグインセクションで、<control>Add</control>ボタンをクリックして以下のプラグインを検索し追加します:
                </p>
                <list type="bullet">
                    <li>Routing</li>
                    <li>Content Negotiation</li>
                    <li>Kotlinx.serialization</li>
                    <li>Static Content</li>
                    <li>Status Pages</li>
                    <li>Exposed</li>
                    <li>Postgres</li>
                </list>
                <p>
                    <img src="ktor_project_generator_add_plugins.gif"
                         alt="Ktorプロジェクトジェネレーターでのプラグインの追加"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    プラグインを追加したら、プラグインセクションの右上にある<control>7 plugins</control>ボタンをクリックして、追加されたプラグインを確認します。
                </p>
                <p>プロジェクトに追加されるすべてのプラグインのリストが表示されます:
                    <img src="tutorial_server_db_integration_plugin_list.png"
                         alt="Ktorプロジェクトジェネレーターでのプラグインのドロップダウン"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
<p>
    <control>Download</control>ボタンをクリックして、Ktorプロジェクトを生成しダウンロードします。
</p>
            </step>
            <step>
                <p>
                    生成されたプロジェクトを<a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
                        IDEA</a>または任意のIDEで開きます。
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example</Path>に移動し、ファイル<Path>CitySchema.kt</Path>と
                    <Path>UsersSchema.kt</Path>を削除します。
                </p>
            </step>
            <step id="delete-function">
                <p>
                    <Path>Databases.kt</Path>ファイルを開き、<code>configureDatabases()</code>関数の内容を削除します。
                </p>
                [object Promise]
                <p>
                    この機能を削除する理由は、Ktorプロジェクトジェネレーターがユーザーと都市に関するデータをHSQLDBまたはPostgreSQLに永続化する方法を示すサンプルコードを追加したためです。このチュートリアルでは、そのサンプルコードは必要ありません。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="スターターコードを追加する" id="add-starter-code">
        <procedure id="add-starter-code-procedure">
            <step>
                <Path>src/main/kotlin/com/example</Path>に移動し、<Path>model</Path>というサブパッケージを作成します。
            </step>
            <step>
                <Path>model</Path>パッケージ内に、新しい<Path>Task.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>Task.kt</Path>を開き、優先度を表す<code>enum</code>とタスクを表す<code>class</code>を追加します。
                </p>
                [object Promise]
                <p>
                    <code>Task</code>クラスには、<Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインには、クライアントとサーバー間でメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアライズ/デシリアライズすることという、主に2つの目的があります。">kotlinx.serialization</Links>ライブラリの<code>Serializable</code>型がアノテーションされています。
                </p>
                <p>
                    以前のチュートリアルと同様に、インメモリリポジトリを作成します。ただし、今回はリポジトリが<code>interface</code>を実装するため、後で簡単に置き換えることができます。
                </p>
            </step>
            <step>
                <Path>model</Path>サブパッケージ内に、新しい<Path>TaskRepository.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>TaskRepository.kt</Path>を開き、以下の<code>interface</code>を追加します:
                </p>
                [object Promise]
            </step>
            <step>
                同じディレクトリ内に新しい<Path>FakeTaskRepository.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>FakeTaskRepository.kt</Path>を開き、以下の<code>class</code>を追加します:
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="ルートを追加する" id="add-routes">
        <procedure id="add-routes-procedure">
            <step>
                <Path>src/main/kotlin/com/example</Path>にある<Path>Serialization.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    既存の<code>Application.configureSerialization()</code>関数を以下の実装に置き換えます:
                </p>
                [object Promise]
                <p>
                    これは<Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">RESTful APIの作成</Links>チュートリアルで実装したルーティングと同じですが、今回はリポジトリを<code>routing()</code>関数にパラメーターとして渡しています。パラメーターの型が<code>interface</code>であるため、多くの異なる実装を注入することができます。
                </p>
                <p>
                    <code>configureSerialization()</code>にパラメーターを追加したため、既存の呼び出しはコンパイルされなくなります。幸い、この関数は一度しか呼び出されません。
                </p>
            </step>
            <step>
                <Path>src/main/kotlin/com/example</Path>内にある<Path>Application.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    <code>module()</code>関数を以下の実装に置き換えます:
                </p>
                [object Promise]
                <p>
                    これで<code>FakeTaskRepository</code>のインスタンスを<code>configureSerialization()</code>に注入しています。
                    長期的な目標は、これを<code>PostgresTaskRepository</code>に置き換えられるようにすることです。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="クライアントページを追加する" id="add-client-page">
        <procedure id="add-client-page-procedure">
            <step>
                <Path>src/main/resources/static</Path>にある<Path>index.html</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    現在の内容を以下の実装に置き換えます:
                </p>
                [object Promise]
                <p>
                    これは以前のチュートリアルで使用されたSPAと同じです。JavaScriptで書かれており、ブラウザ内で利用可能なライブラリのみを使用しているため、クライアント側の依存関係について心配する必要はありません。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="アプリケーションを手動でテストする" id="test-manually">
        <procedure id="test-manually-procedure">
            <p>
                この最初のイテレーションでは、データベースに接続する代わりにインメモリリポジトリを使用しているため、アプリケーションが適切に設定されていることを確認する必要があります。
            </p>
            <step>
                <p>
                    <Path>src/main/resources/application.yaml</Path>に移動し、<code>postgres</code>構成を削除します。
                </p>
                [object Promise]
            </step>
            <step>
<p>IntelliJ IDEAで、実行ボタン
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="IntelliJ IDEA実行アイコン"/>)
    をクリックしてアプリケーションを開始します。</p>
            </step>
            <step>
                <p>
                    ブラウザで<a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>に移動します。3つのフォームとフィルタリングされた結果を表示するテーブルで構成されるクライアントページが表示されるはずです。
                </p>
                <img src="tutorial_server_db_integration_index_page.png"
                     alt="タスクマネージャーのクライアントを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
            <step>
                <p>
                    <control>Go</control>ボタンを使用してフォームに入力し送信することでアプリケーションをテストします。テーブル項目の<control>View</control>および
                    <control>Delete</control>ボタンを使用します。
                </p>
                <img src="tutorial_server_db_integration_manual_test.gif"
                     alt="タスクマネージャーのクライアントを表示するブラウザウィンドウ"
                     border-effect="rounded"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="自動単体テストを追加する" id="add-automated-tests">
        <procedure id="add-automated-tests-procedure">
            <step>
                <p>
                    <Path>src/test/kotlin/com/example</Path>にある<Path>ApplicationTest.kt</Path>を開き、以下のテストを追加します:
                </p>
                [object Promise]
                <p>
                    これらのテストをコンパイルして実行するには、Ktorクライアント用の<a
                        href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html">Content
                    Negotiation</a>プラグインへの依存関係を追加する必要があります。
                </p>
            </step>
            <step>
                <p>
                    <Path>gradle/libs.versions.toml</Path>ファイルを開き、以下のライブラリを指定します:
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>build.gradle.kts</Path>を開き、以下の依存関係を追加します:
                </p>
                [object Promise]
            </step>
            <step>
<p>IntelliJ IDEAで、エディターの右側にある通知Gradleアイコン
    (<img alt="IntelliJ IDEA Gradleアイコン"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    をクリックしてGradleの変更をロードします。</p>
            </step>
            <step>
<p>IntelliJ IDEAで、テストクラス定義の横にある実行ボタン
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="IntelliJ IDEA実行アイコン"/>)
    をクリックしてテストを実行します。</p>
                <p><control>Run</control>ペインにテストが正常に実行されたことが表示されるはずです。
                </p>
                <img src="tutorial_server_db_integration_test_results.png"
                     alt="IntelliJ IDEAの「Run」ペインにテスト結果が成功と表示される"
                     border-effect="line"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="PostgreSQLリポジトリを追加する" id="add-postgresql-repository">
    <p>
        インメモリデータを使用する動作するアプリケーションができたので、次のステップはデータストレージをPostgreSQLデータベースに外部化することです。
    </p>
    <p>
        これを達成するには、次のことを行います:
    </p>
    <list type="decimal">
        <li><a href="#create-schema">PostgreSQL内にデータベーススキーマを作成する。</a></li>
        <li><a href="#adapt-repo"><code>TaskRepository</code>を非同期アクセスに対応させる。</a></li>
        <li><a href="#config-db-connection">アプリケーション内でデータベース接続を構成する。</a></li>
        <li><a href="#create-mapping"><code>Task</code>型を関連するデータベーステーブルにマッピングする。</a></li>
        <li><a href="#create-new-repo">このマッピングに基づいて新しいリポジトリを作成する。</a></li>
        <li><a href="#switch-repo">起動コードでこの新しいリポジトリに切り替える。</a></li>
    </list>
    <chapter title="データベーススキーマを作成する" id="create-schema">
        <procedure id="create-schema-procedure">
            <step>
                <p>
                    選択したデータベース管理ツールを使用して、PostgreSQL内に新しいデータベースを作成します。
                    名前は何でも構いませんが、覚えておく必要があります。この例では、<Path>ktor_tutorial_db</Path>を使用します。
                </p>
                <tip>
                    <p>
                        PostgreSQLの詳細については、<a
                            href="https://www.postgresql.org/docs/current/">公式ドキュメント</a>を参照してください。
                    </p>
                    <p>
                        IntelliJ IDEAでは、データベースツールを使用して<a
                            href="https://www.jetbrains.com/help/idea/postgresql.html">PostgreSQLデータベースに接続および管理</a>できます。
                    </p>
                </tip>
            </step>
            <step>
                <p>
                    データベースに対して以下のSQLコマンドを実行します。これらのコマンドは、データベーススキーマを作成し、データを投入します:
                </p>
                [object Promise]
                <p>
                    以下の点に注意してください:
                </p>
                <list>
                    <li>
                        <Path>task</Path>という単一のテーブルを作成しており、<Path>name</Path>、
                        <Path>description</Path>、<Path>priority</Path>の列があります。これらは<code>Task</code>クラスのプロパティにマッピングする必要があります。
                    </li>
                    <li>
                        テーブルが既に存在する場合は再作成するため、スクリプトを繰り返し実行できます。
                    </li>
                    <li>
                        <code>SERIAL</code>型の<Path>id</Path>という追加の列があります。これは整数値で、各行にプライマリキーを割り当てるために使用されます。これらの値はデータベースによって自動的に割り当てられます。
                    </li>
                </list>
            </step>
        </procedure>
    </chapter>
    <chapter title="既存のリポジトリを適応させる" id="adapt-repo">
        <procedure id="adapt-repo-procedure">
            <p>
                データベースに対してクエリを実行する場合、HTTPリクエストを処理するスレッドをブロックしないように、非同期で実行することが望ましいです。Kotlinでは、これは<a
                    href="https://kotlinlang.org/docs/coroutines-overview.html">コルーチン</a>を通じて管理するのが最適です。
            </p>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/model</Path>にある<Path>TaskRepository.kt</Path>ファイルを開きます。
                </p>
            </step>
            <step>
                <p>
                    すべてのインターフェースメソッドに<code>suspend</code>キーワードを追加します:
                </p>
                [object Promise]
                <p>
                    これにより、インターフェースメソッドの実装が別のコルーチンディスパッチャーで作業を開始できるようになります。
                </p>
                <p>
                    次に、<code>FakeTaskRepository</code>のメソッドを調整する必要がありますが、その実装ではディスパッチャーを切り替える必要はありません。
                </p>
            </step>
            <step>
                <p>
                    <Path>FakeTaskRepository.kt</Path>ファイルを開き、すべてのメソッドに<code>suspend</code>キーワードを追加します:
                </p>
                [object Promise]
                <p>
                    ここまでは、新しい機能は導入していません。代わりに、データベースに対して非同期でクエリを実行する<code>PostgresTaskRepository</code>を作成するための基盤を構築してきました。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="データベース接続を構成する" id="config-db-connection">
        <procedure id="config-db-connection-procedure">
            <p>
                <a href="#delete-function">このチュートリアルの最初のパート</a>では、<Path>Databases.kt</Path>内の<code>configureDatabases()</code>メソッドにあるサンプルコードを削除しました。これで独自の実現を追加する準備ができました。
            </p>
            <step>
                <Path>src/main/kotlin/com/example</Path>にある<Path>Databases.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    <code>Database.connect()</code>関数を使用してデータベースに接続し、設定の値を環境に合わせて調整します:
                </p>
                [object Promise]
                <p><code>url</code>には以下のコンポーネントが含まれていることに注意してください:</p>
                <list>
                    <li>
                        <code>localhost:5432</code>は、PostgreSQLデータベースが動作しているホストとポートです。
                    </li>
                    <li>
                        <code>ktor_tutorial_db</code>は、サービス実行時に作成されたデータベースの名前です。
                    </li>
                </list>
                <tip>
                    詳細については、<a href="https://jetbrains.github.io/Exposed/database-and-datasource.html">Exposedでデータベースとデータソースを操作する</a>を参照してください。
                </tip>
            </step>
        </procedure>
    </chapter>
    <chapter title="オブジェクト/リレーショナルマッピングを作成する" id="create-mapping">
        <procedure id="create-mapping-procedure">
            <step>
                <Path>src/main/kotlin/com/example</Path>に移動し、<Path>db</Path>という新しいパッケージを作成します。
            </step>
            <step>
                <Path>db</Path>パッケージ内に、新しい<Path>mapping.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>mapping.kt</Path>を開き、<code>TaskTable</code>と<code>TaskDAO</code>の型を追加します:
                </p>
                [object Promise]
                <p>
                    これらの型はExposedライブラリを使用して、<code>Task</code>型のプロパティをデータベースの<Path>task</Path>テーブルの列にマッピングします。<code>TaskTable</code>型は基本的なマッピングを定義し、<code>TaskDAO</code>型はタスクを作成、検索、更新、削除するためのヘルパーメソッドを追加します。
                </p>
                <p>
                    KtorプロジェクトジェネレーターではDAO型のサポートが追加されていないため、Gradleビルドファイルに関連する依存関係を追加する必要があります。
                </p>
            </step>
            <step>
                <p>
                    <Path>gradle/libs.versions.toml</Path>ファイルを開き、以下のライブラリを指定します:
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>build.gradle.kts</Path>ファイルを開き、以下の依存関係を追加します:
                </p>
                [object Promise]
            </step>
            <step>
<p>IntelliJ IDEAで、エディターの右側にある通知Gradleアイコン
    (<img alt="IntelliJ IDEA Gradleアイコン"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    をクリックしてGradleの変更をロードします。</p>
            </step>
            <step>
                <p>
                    <Path>mapping.kt</Path>ファイルに戻り、以下の2つのヘルパー関数を追加します:
                </p>
                [object Promise]
                <p>
                    <code>suspendTransaction()</code>はコードブロックを受け取り、IOディスパッチャーを介してデータベーストランザクション内で実行します。これは、ブロックする作業をスレッドプールにオフロードするように設計されています。
                </p>
                <p>
                    <code>daoToModel()</code>は、<code>TaskDAO</code>型のインスタンスを<code>Task</code>オブジェクトに変換します。
                </p>
            </step>
            <step>
                <p>
                    以下の不足しているインポートを追加します:
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="新しいリポジトリを作成する" id="create-new-repo">
        <procedure id="create-new-repo-procedure">
            <p>データベース固有のリポジトリを作成するために必要なすべてのリソースが揃いました。</p>
            <step>
                <Path>src/main/kotlin/com/example/model</Path>に移動し、新しい<Path>PostgresTaskRepository.kt</Path>ファイルを作成します。
            </step>
            <step>
                <p>
                    <Path>PostgresTaskRepository.kt</Path>ファイルを開き、以下の実装で新しい型を作成します:
                </p>
                [object Promise]
                <p>
                    この実装では、<code>TaskDAO</code>および<code>TaskTable</code>型のヘルパーメソッドを使用してデータベースと対話します。この新しいリポジトリを作成したら、残りのタスクはルート内でそれを使用するように切り替えることだけです。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新しいリポジトリに切り替える" id="switch-repo">
        <procedure id="switch-repo-procedure">
            <p>外部データベースに切り替えるには、リポジトリのタイプを変更するだけです。</p>
            <step>
                <Path>src/main/kotlin/com/example</Path>にある<Path>Application.kt</Path>ファイルを開きます。
            </step>
            <step>
                <p>
                    <code>Application.module()</code>関数で、<code>FakeTaskRepository</code>を<code>PostgresTaskRepository</code>に置き換えます:
                </p>
                [object Promise]
                <p>
                    インターフェースを通じて依存性を注入しているため、実装の切り替えはルートを管理するコードからは透過的です。
                </p>
            </step>
            <step>
<p>
    IntelliJ IDEAで、再実行ボタン (<img src="intellij_idea_rerun_icon.svg"
                                   style="inline" height="16" width="16"
                                   alt="IntelliJ IDEA再実行アイコン"/>) をクリックして
    アプリケーションを再起動します。
</p>
            </step>
            <step>
                <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>に移動します。
                UIは変更されませんが、データはデータベースから取得されるようになります。
            </step>
            <step>
                <p>
                    これを検証するには、フォームを使用して新しいタスクを追加し、PostgreSQLのタスクテーブルに保持されているデータをクエリします。
                </p>
                <tip>
                    <p>
                        IntelliJ IDEAでは、<a href="https://www.jetbrains.com/help/idea/query-consoles.html#create_console">クエリコンソール</a>と
                        <code>SELECT</code> SQLステートメントを使用してテーブルデータをクエリできます:
                    </p>
                    [object Promise]
                    <p>
                        クエリ後、データは<ui-path>Service</ui-path>ペインに表示されるはずです。新しいタスクも含まれます:
                    </p>
                    <img src="tutorial_server_db_integration_task_table.png"
                         alt="IntelliJ IDEAの「Service」ペインに表示されたタスクのテーブル"
                         border-effect="line"
                         width="706"/>
                </tip>
            </step>
        </procedure>
    </chapter>
    <p>
        これで、データベースをアプリケーションに統合することに成功しました。
    </p>
    <p>
        <code>FakeTaskRepository</code>型はプロダクションコードではもはや必要ないため、
        <Path>src/test/com/example</Path>にあるテストソースセットに移動できます。
    </p>
    <p>
        最終的なプロジェクト構造は次のようになります:
    </p>
    <img src="tutorial_server_db_integration_src_folder.png"
         alt="IntelliJ IDEAの「Project」ビュー内に表示されたsrcフォルダー"
         border-effect="line"
         width="400"/>
</chapter>
<chapter title="次のステップ" id="next-steps">
    <p>
        これで、Ktor RESTfulサービスと通信するアプリケーションができました。このアプリケーションは、<a href="https://github.com/JetBrains/Exposed">Exposed</a>で書かれたリポジトリを使用して
        <a href="https://www.postgresql.org/docs/">PostgreSQL</a>にアクセスします。また、Webサーバーもデータベースも必要としない、コア機能を検証する<a href="#add-automated-tests">テストスイート</a>も備えています。
    </p>
    <p>
        この構造は必要に応じて任意の機能をサポートするように拡張できますが、フォールトトレランス、セキュリティ、スケーラビリティなどの非機能的な側面を最初に検討することをお勧めします。まず、<a href="docker-compose.topic#extract-db-settings">データベース設定を</a><Links href="/ktor/server-configuration-file" summary="設定ファイルでさまざまなサーバーパラメーターを構成する方法を学びます。">設定ファイル</Links>に抽出することから始められます。
    </p>
</chapter>
</topic>