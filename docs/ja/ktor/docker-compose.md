```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   id="docker-compose" title="Docker Compose">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <control>最初のプロジェクト</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-db-integration">tutorial-server-db-integration</a>
    </p>
    <p>
        <control>最終プロジェクト</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-docker-compose">tutorial-server-docker-compose</a>
    </p>
</tldr>
<p>このトピックでは、<a href="https://docs.docker.com/compose/">Docker Compose</a>でKtorサーバーアプリケーションを実行する方法を説明します。「<Links href="/ktor/server-integrate-database" summary="Exposed SQLライブラリを使用してKtorサービスをデータベースリポジトリに接続するプロセスを学習します。">データベースを統合する</Links>」チュートリアルで作成されたプロジェクトを使用します。このプロジェクトでは、データベースとウェブアプリケーションが個別に実行される<a href="https://www.postgresql.org/docs/">PostgreSQL</a>データベースに<a href="https://github.com/JetBrains/Exposed">Exposed</a>を使用して接続します。</p>
<chapter title="アプリケーションの準備" id="prepare-app">
    <chapter title="データベース設定の抽出" id="extract-db-settings">
        <p>
            「<a href="server-integrate-database.topic#config-db-connection">データベース接続を構成する</a>」チュートリアルで作成されたプロジェクトは、データベース接続を確立するためにハードコードされた属性を使用しています。</p>
        <p>
            PostgreSQLデータベースの接続設定を
            <Links href="/ktor/server-configuration-file" summary="設定ファイルでさまざまなサーバーパラメーターを構成する方法を学習します。">カスタム設定グループ</Links>に抽出しましょう。
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/resources</Path>にある
                    <Path>application.yaml</Path>
                    ファイルを開き、<code>ktor</code>グループの外側に<code>storage</code>グループを次のように追加します。
                </p>
                [object Promise]
                <p>これらの設定は、後で<a href="#configure-docker">
                    <Path>compose.yml</Path>
                </a>ファイルで構成されます。
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/plugins/</Path>にある
                    <Path>Databases.kt</Path>
                    ファイルを開き、<code>configureDatabases()</code>関数を更新して、設定ファイルからストレージ設定をロードするようにします。
                </p>
                [object Promise]
                <p>
                    <code>configureDatabases()</code>関数は`ApplicationConfig`を受け入れるようになり、
                    <code>config.property</code>を使用してカスタム設定をロードします。
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/</Path>にある
                    <Path>Application.kt</Path>
                    ファイルを開き、アプリケーションの起動時に接続設定をロードするために
                    <code>environment.config</code>を<code>configureDatabases()</code>に渡します。
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="Ktorプラグインの構成" id="configure-ktor-plugin">
        <p>Docker上で実行するためには、アプリケーションが必要なすべてのファイルをコンテナにデプロイする必要があります。使用しているビルドシステムに応じて、これを実現するためのさまざまなプラグインがあります。</p>
        <list>
            <li><Links href="/ktor/server-fatjar" summary="Ktor Gradleプラグインを使用して実行可能なfat JARを作成および実行する方法を学習します。">Ktor Gradleプラグインを使用したfat JARの作成</Links></li>
            <li><Links href="/ktor/maven-assembly-plugin" summary="サンプルプロジェクト: tutorial-server-get-started-maven">Maven Assemblyプラグインを使用したfat JARの作成</Links></li>
        </list>
        <p>この例では、Ktorプラグインはすでに
            <Path>build.gradle.kts</Path>
            ファイルに適用されています。
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="Dockerの構成" id="configure-docker">
    <chapter title="Dockerイメージの準備" id="prepare-docker-image">
        <p>
            アプリケーションをDocker化するには、プロジェクトのルートディレクトリに新しい
            <Path>Dockerfile</Path>
            を作成し、次の内容を挿入します。
        </p>
        [object Promise]
        <tip>
            このマルチステージビルドがどのように機能するかについては、「<a href="docker.md#prepare-docker">Dockerイメージの準備</a>」を参照してください。
        </tip>
        <tip id="jdk_image_replacement_tip">
            <p>
                この例ではAmazon Corretto Dockerイメージを使用していますが、以下のようないくつかの適切な代替イメージと置き換えることができます。
            </p>
            <list>
                <li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
                <li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
                <li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
                <li><a href="https://hub.com/_/sapmachine">SAP Machine JDK</a></li>
            </list>
        </tip>
    </chapter>
    <chapter title="Docker Composeの構成" id="configure-docker-compose">
        <p>プロジェクトのルートディレクトリに新しい
            <Path>compose.yml</Path>
            ファイルを作成し、次の内容を追加します。
        </p>
        [object Promise]
        <list>
            <li><code>web</code>サービスは、<a href="#prepare-docker-image">イメージ</a>内にパッケージ化されたKtorアプリケーションを実行するために使用されます。
            </li>
            <li><code>db</code>サービスは<code>postgres</code>イメージを使用して、タスクを保存するための<code>ktor_tutorial_db</code>データベースを作成します。
            </li>
        </list>
    </chapter>
</chapter>
<chapter title="サービスのビルドと実行" id="build-run">
    <procedure>
        <step>
            <p>
                Ktorアプリケーションを含む<a href="#configure-ktor-plugin">fat JAR</a>を作成するために、次のコマンドを実行します。
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <code>docker compose up</code>コマンドを使用して、イメージをビルドし、コンテナを起動します。
            </p>
            [object Promise]
        </step>
        <step>
            Docker Composeがイメージのビルドを完了するまで待ちます。
        </step>
        <step>
            <p>
                <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a>に移動して、ウェブアプリケーションを開きます。タスクのフィルタリングと新規追加のための3つのフォーム、およびタスクのテーブルを表示するタスクマネージャー クライアントページが表示されるはずです。
            </p>
            <img src="tutorial_server_db_integration_manual_test.gif"
                 alt="タスクマネージャー クライアントを表示しているブラウザウィンドウ"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
</topic>