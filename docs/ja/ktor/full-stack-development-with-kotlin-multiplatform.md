<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Build a full-stack application with Kotlin Multiplatform" id="full-stack-development-with-kotlin-multiplatform">
    <show-structure for="chapter, procedure" depth="2"/>
    <web-summary>
        KotlinとKtorを使ってクロスプラットフォームのフルスタックアプリケーションを開発する方法を学びましょう。このチュートリアルでは、Kotlin Multiplatformを使ってAndroid、iOS、デスクトップ向けにビルドし、Ktorを使って楽にデータを扱う方法を学びます。
    </web-summary>
    <link-summary>
        KotlinとKtorを使ってクロスプラットフォームのフルスタックアプリケーションを開発する方法を学びましょう。
    </link-summary>
    <card-summary>
        KotlinとKtorを使ってクロスプラットフォームのフルスタックアプリケーションを開発する方法を学びましょう。
    </card-summary>
    <tldr>
        <var name="example_name" value="full-stack-task-manager"/>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>使用プラグイン</b>: <Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">Routing</Links>、
            <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>、
            <Links href="/ktor/server-serialization" summary="The ContentNegotiation plugin serves two primary purposes: negotiating media types between the client and server and serializing/deserializing the content in a specific format.">Content Negotiation</Links>、
            <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>、
            <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin Multiplatform</a>
        </p>
    </tldr>
    <p>
        この記事では、Kotlinでフルスタックアプリケーションを開発し、Android、iOS、デスクトッププラットフォームで実行する方法について、Ktorを活用したシームレスなデータ処理とともに学びます。
    </p>
    <p>このチュートリアルを終えるまでに、以下のことができるようになります。</p>
    <list>
        <li><a
                href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">
            Kotlin Multiplatform</a> を使ってフルスタックアプリケーションを作成する。
        </li>
        <li>IntelliJ IDEAで生成されたプロジェクトを理解する。</li>
        <li>Ktorサービスを呼び出す<a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>クライアントを作成する。
        </li>
        <li>設計の異なるレイヤー間で共有タイプを再利用する。</li>
        <li>マルチプラットフォームライブラリを正しく含め、構成する。</li>
    </list>
    <p>
        以前のチュートリアルでは、タスクマネージャーの例を使用して、
        <Links href="/ktor/server-requests-and-responses" summary="Learn the basics of routing, handling requests, and parameters in Kotlin with Ktor by
        building a task manager application.">リクエストを処理</Links>し、
        <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
        RESTful API that generates JSON files.">RESTful APIを作成</Links>し、
        <Links href="/ktor/server-integrate-database" summary="Learn the process of connecting Ktor services to database repositories with the Exposed SQL Library.">Exposedでデータベースを統合</Links>しました。
        クライアントアプリケーションは可能な限り最小限に抑えられ、Ktorの基本を学ぶことに集中できるようにしました。
    </p>
    <p>
        Ktorサービスを使用して表示するデータを取得し、Android、iOS、デスクトッププラットフォームをターゲットとするクライアントを作成します。可能な限り、クライアントとサーバー間でデータ型を共有することで、開発をスピードアップし、エラーの可能性を減らします。
    </p>
    <chapter title="前提条件" id="prerequisites">
        <p>
            これまでの記事と同様に、IDEとしてIntelliJ IDEAを使用します。環境をインストールおよび設定するには、
            <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html">
                Kotlin Multiplatformクイックスタート
            </a> ガイドを参照してください。
        </p>
        <p>
            Compose Multiplatformを初めて使用する場合は、このチュートリアルを開始する前に
            <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html">
                Compose Multiplatformを始める
            </a>
            チュートリアルを完了することをお勧めします。タスクの複雑さを軽減するために、単一のクライアントプラットフォームに焦点を当てることができます。たとえば、iOSを一度も使用したことがない場合は、デスクトップまたはAndroid開発に焦点を当てるのが賢明かもしれません。
        </p>
    </chapter>
    <chapter title="新しいプロジェクトを作成する" id="create-project">
        <p>
            Ktorプロジェクトジェネレーターの代わりに、IntelliJ IDEAのKotlin Multiplatformプロジェクトウィザードを使用します。
            これにより、クライアントとサービスを拡張できる基本的なマルチプラットフォームプロジェクトが作成されます。クライアントはSwiftUIのようなネイティブUIライブラリを使用することもできますが、このチュートリアルでは
            <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>を使用して、すべてのプラットフォームで共有UIを作成します。
        </p>
        <procedure id="generate-project">
            <step>
                IntelliJ IDEAを起動します。
            </step>
            <step>
                IntelliJ IDEAで、<ui-path>File | New | Project</ui-path> を選択します。
            </step>
            <step>
                左側のパネルで、<ui-path>Kotlin Multiplatform</ui-path> を選択します。
            </step>
            <step>
                <ui-path>New Project</ui-path> ウィンドウで以下のフィールドを指定します。
                <list>
                    <li>
                        <ui-path>Name</ui-path>
                        : full-stack-task-manager
                    </li>
                    <li>
                        <ui-path>Group</ui-path>
                        : com.example.ktor
                    </li>
                </list>
            </step>
            <step>
                <p>
                    ターゲットプラットフォームとして
                    <ui-path>Android</ui-path>
                    、
                    <ui-path>Desktop</ui-path>
                    、および
                    <ui-path>Server</ui-path>
                    を選択します。
                </p>
            </step>
            <step>
                <p>
                    Macを使用している場合は、<ui-path>iOS</ui-path> も選択します。<ui-path>Share UI</ui-path> オプションが選択されていることを確認してください。
                    <img style="block" src="full_stack_development_tutorial_create_project.png"
                         alt="Kotlin Multiplatform wizard settings" width="706" border-effect="rounded"/>
                </p>
            </step>
            <step>
                <p>
                    <control>Create</control> ボタンをクリックし、IDEがプロジェクトを生成およびインポートするのを待ちます。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="サービスを実行する" id="run-service">
        <procedure id="run-service-procedure">
            <step>
                <ui-path>Project</ui-path> ビューで、<Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path> に移動し、<Path>Application.kt</Path> ファイルを開きます。
            </step>
            <step>
                <code>main()</code> 関数の横にある <ui-path>Run</ui-path> ボタン (<img src="intellij_idea_run_icon.svg"
                      style="inline" height="16" width="16"
                      alt="IntelliJ IDEA run icon"/>) をクリックしてアプリケーションを起動します。
                <p>
                    <ui-path>Run</ui-path> ツールウィンドウに新しいタブが開き、ログが "Responding at http://0.0.0.0:8080" というメッセージで終了します。
                </p>
            </step>
            <step>
                <p>
                    <a href="http://0.0.0.0:8080/">http://0.0.0.0:8080/</a> にアクセスしてアプリケーションを開きます。
                    ブラウザにKtorからのメッセージが表示されるはずです。
                    <img src="full_stack_development_tutorial_run.png"
                         alt="A Ktor server browser response" width="706"
                         border-effect="rounded" style="block"/>
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="プロジェクトを調査する" id="examine-project">
        <p>
            <Path>server</Path> フォルダは、プロジェクト内の3つのKotlinモジュールのうちの1つです。他の2つは <Path>shared</Path> と <Path>composeApp</Path> です。
        </p>
        <p>
            <Path>server</Path> モジュールの構造は、<a href="https://start.ktor.io/">Ktor Project Generator</a> によって生成されるものと非常によく似ています。
            プラグインと依存関係を宣言するための専用のビルドファイルと、Ktorサービスをビルドして起動するためのコードを含むソースセットがあります。
        </p>
        <img src="full_stack_development_tutorial_server_folder.png"
             alt="Contents of the server folder in a Kotlin Multiplatform project" width="300"
             border-effect="line"/>
        <p>
            <Path>Application.kt</Path> ファイルのルーティング指示を見ると、<code>greet()</code> 関数の呼び出しが見られます。
        </p>
        [object Promise]
        <p>
            これは <code>Greeting</code> 型のインスタンスを作成し、その <code>greet()</code> メソッドを呼び出します。
            <code>Greeting</code> クラスは <Path>shared</Path> モジュールで定義されています。
            <img src="full_stack_development_tutorial_shared_module.png"
                 alt="Greeting.kt and Platform.kt opened in IntelliJ IDEA" width="706"
                 border-effect="line" style="block"/>
        </p>
        <p>
            <Path>shared</Path> モジュールには、異なるターゲットプラットフォーム間で使用されるコードが含まれています。
        </p>
        <p>
            <Path>shared</Path> モジュールの <Path>commonMain</Path> ソースセットには、すべてのプラットフォームで使用される型が保持されています。
            ご覧のとおり、ここに <code>Greeting</code> 型が定義されています。
            ここには、サーバーとすべての異なるクライアントプラットフォーム間で共有される共通のコードも配置します。
        </p>
        <p>
            <Path>shared</Path> モジュールには、クライアントを提供したい各プラットフォームのソースセットも含まれています。これは、
            <Path>commonMain</Path> 内で宣言された型が、ターゲットプラットフォームによって異なる機能を必要とする場合があるためです。
            <code>Greeting</code> 型の場合、プラットフォーム固有のAPIを使用して現在のプラットフォームの名前を取得したいとします。これは
            <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html">expected および actual 宣言</a>
            によって実現されます。
        </p>
        <p>
            <Path>shared</Path> モジュールの <Path>commonMain</Path> ソースセットで、<code>getPlatform()</code> 関数を <code>expect</code> キーワードで宣言します。
        </p>
        <tabs>
            <tab title="commonMain/Platform.kt" id="commonMain">
                [object Promise]
            </tab>
        </tabs>
        <p>その後、各ターゲットプラットフォームは、以下に示すように <code>getPlatform()</code> 関数の <code>actual</code> 宣言を提供する必要があります。
        </p>
        <tabs>
            <tab title="Platform.ios.kt" id="iosMain">
                [object Promise]
            </tab>
            <tab title="Platform.android.kt" id="androidMain">
                [object Promise]
            </tab>
            <tab title="Platform.jvm.kt" id="jvmMain">
                [object Promise]
            </tab>
            <tab title="Platform.wasmJs.kt" id="wasmJsMain">
                [object Promise]
            </tab>
        </tabs>
        <p>
            プロジェクトには、<Path>composeApp</Path> モジュールという追加のモジュールがあります。
            これには、Android、iOS、デスクトップ、およびウェブクライアントアプリケーションのコードが含まれています。
            これらのアプリケーションは現在Ktorサービスにリンクされていませんが、共有の <code>Greeting</code> クラスを使用しています。
        </p>
    </chapter>
    <chapter title="クライアントアプリケーションを実行する" id="run-client-app">
        <p>
            ターゲットの実行構成を実行することで、クライアントアプリケーションを実行できます。iOSシミュレーターでアプリケーションを実行するには、以下の手順に従います。
        </p>
        <procedure id="run-ios-app-procedure">
            <step>
                IntelliJ IDEAで、<Path>iosApp</Path> 実行構成とシミュレートされたデバイスを選択します。
                <img src="full_stack_development_tutorial_run_configurations.png"
                     alt="Run &amp; Debug window" width="400"
                     border-effect="line" style="block"/>
            </step>
            <step>
                <ui-path>Run</ui-path> ボタン (<img src="intellij_idea_run_icon.svg"
                      style="inline" height="16" width="16"
                      alt="IntelliJ IDEA run icon"/>) をクリックして、構成を実行します。
            </step>
            <step>
                <p>
                    iOSアプリを実行すると、内部的にXcodeでビルドされ、iOSシミュレーターで起動されます。
                    アプリには、クリックすると画像が切り替わるボタンが表示されます。
                    <img style="block" src="full_stack_development_tutorial_run_ios.gif"
                         alt="Running the app in the iOS Simulator" width="300" border-effect="rounded"/>
                </p>
                <p>
                    ボタンが初めて押されると、現在のプラットフォームの詳細がそのテキストに追加されます。これを実現するコードは
                    <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt</Path> にあります。
                    :
                </p>
                [object Promise]
                <p>
                    これはコンポーザブル関数であり、この記事の後半で変更します。現時点での重要な点は、UIを表示し、共有された <code>Greeting</code> 型を使用していることです。この <code>Greeting</code> 型は、共通の <code>Platform</code> インターフェースを実装するプラットフォーム固有のクラスを使用しています。
                </p>
            </step>
        </procedure>
        <p>
            生成されたプロジェクトの構造を理解できたので、タスクマネージャーの機能を段階的に追加できます。
        </p>
    </chapter>
    <chapter title="モデルタイプを追加する" id="add-model-types">
        <p>
            まず、モデルタイプを追加し、クライアントとサーバーの両方からアクセスできるようにします。
        </p>
        <procedure id="add-model-types-procedure">
            <step>
                <Path>shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path> に移動し、<Path>model</Path> という新しいパッケージを作成します。
            </step>
            <step>
                新しいパッケージ内に、<Path>Task.kt</Path> という新しいファイルを作成します。
            </step>
            <step>
                <p>
                    優先順位を表す <code>enum</code> とタスクを表す <code>class</code> を追加します。
                    <code>Task</code> クラスは <code>kotlinx.serialization</code> ライブラリの <code>Serializable</code> 型でアノテーションされています。
                </p>
                [object Promise]
                <p>
                    インポートもアノテーションもコンパイルされないことに気づくでしょう。これは、プロジェクトがまだ <code>kotlinx.serialization</code> ライブラリに依存関係を持っていないためです。
                </p>
            </step>
            <step>
                <p>
                    <Path>shared/build.gradle.kts</Path> に移動し、シリアライゼーションプラグインを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    同じファイルで、<Path>commonMain</Path> ソースセットに新しい依存関係を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <Path>gradle/libs.versions.toml</Path> に移動し、以下を定義します。
                [object Promise]
            </step>
            <!-- the plugin version can also be set in the version catalog -->
            <step>
                IntelliJ IDEAで、<ui-path>Build | Sync Project with Gradle Files</ui-path> を選択して更新を適用します。Gradleのインポートが完了すると、<Path>Task.kt</Path> ファイルが正常にコンパイルされるはずです。
            </step>
        </procedure>
        <!-- The following seems like a lot of nuance to cover for this newbie-oriented tutorial.
         I think at this point it's enough to know that the serialization library requires a Gradle plugin.
         If it's important, it would be nice to make the terminology more precise: earlier we said it won't compile, and now
         we're saying it would, so I'm not sure what's going on in the end.
         -->
        <p>
            シリアライゼーションプラグインを含まなくてもコードはコンパイルされますが、ネットワーク上で <code>Task</code> オブジェクトをシリアライズするために必要な型は生成されません。これにより、サービスを呼び出そうとするとランタイムエラーが発生します。
        </p>
        <p>
            シリアライゼーションプラグインを別のモジュール（<Path>server</Path> や <Path>composeApp</Path> など）に配置してもビルド時にエラーは発生しません。しかし、ここでも、シリアライズに必要な追加の型は生成されず、ランタイムエラーが発生します。
        </p>
    </chapter>
    <chapter title="サーバーを作成する" id="create-server">
        <p>
            次の段階は、タスクマネージャーのサーバー実装を作成することです。
        </p>
        <procedure id="create-server-procedure">
            <step>
                <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path> フォルダに移動し、<Path>model</Path> というサブパッケージを作成します。
            </step>
            <step>
                <p>
                    このパッケージ内に、<Path>TaskRepository.kt</Path> という新しいファイルを作成し、リポジトリ用の以下のインターフェースを追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    同じパッケージ内に、以下のクラスを含む <Path>InMemoryTaskRepository.kt</Path> という新しいファイルを作成します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>server/src/main/kotlin/.../Application.kt</Path> に移動し、既存のコードを以下の実装に置き換えます。
                </p>
                [object Promise]
                <p>
                    この実装は以前のチュートリアルと非常によく似ていますが、今回はすべてのルーティングコードを簡潔にするために <code>Application.module()</code> 関数内に配置しています。
                </p>
                <p>
                    このコードを入力してインポートを追加すると、複数のコンパイラエラーが発生します。これは、コードが複数のKtorプラグインを使用しており、ウェブクライアントと対話するための
                    <Links href="/ktor/server-cors" summary="Required dependencies: io.ktor:%artifact_name%
        Code example:
            %example_name%
        Native server support: ✅">CORS</Links> プラグインを含む依存関係として含める必要があるためです。
                </p>
            </step>
            <step>
                <Path>gradle/libs.versions.toml</Path> ファイルを開き、以下のライブラリを定義します。
                [object Promise]
            </step>
            <step>
                <p>
                    サーバーモジュールのビルドファイル（<Path>server/build.gradle.kts</Path>）を開き、以下の依存関係を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                もう一度、メインメニューで <ui-path>Build | Sync Project with Gradle Files</ui-path> を実行します。
                インポートが完了すると、<code>ContentNegotiation</code> 型と <code>json()</code> 関数のインポートが正しく機能するはずです。
            </step>
            <step>
                サーバーを再起動します。ブラウザからルートにアクセスできるはずです。
            </step>
            <step>
                <p>
                    <a href="http://0.0.0.0:8080/tasks"></a> と <a href="http://0.0.0.0:8080/tasks/byPriority/Medium"></a> にアクセスして、タスクがJSON形式で含まれたサーバー応答を確認します。
                    <img style="block" src="full_stack_development_tutorial_run_server.gif"
                         width="707" border-effect="rounded" alt="Server response in browser"/>
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="クライアントを作成する" id="create-client">
        <p>
            クライアントがサーバーにアクセスできるようにするには、Ktorクライアントを含める必要があります。これには、次の3種類の依存関係が関係しています。
        </p>
        <list>
            <li>Ktorクライアントのコア機能。</li>
            <li>ネットワークを処理するプラットフォーム固有のエンジン。</li>
            <li>コンテンツネゴシエーションとシリアライゼーションのサポート。</li>
        </list>
        <procedure id="create-client-procedure">
            <step>
                <Path>gradle/libs.versions.toml</Path> ファイルに、以下のライブラリを追加します。
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>composeApp/build.gradle.kts</Path> に移動し、以下の依存関係を追加します。
                </p>
                [object Promise]
                <p>
                    これが完了したら、クライアントがKtorクライアントを薄くラップする <code>TaskApi</code> 型を追加できます。
                </p>
            </step>
            <step>
                メインメニューで <ui-path>Build | Sync Project with Gradle Files</ui-path> を選択し、ビルドファイルの変更をインポートします。
            </step>
            <step>
                <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path> に移動し、<Path>network</Path> という新しいパッケージを作成します。
            </step>
            <step>
                <p>
                    新しいパッケージ内に、クライアント構成用の新しい <Path>HttpClientManager.kt</Path> を作成します。
                </p>
                [object Promise]
                <p>
                    <code>1.2.3.4</code> を現在のマシンのIPアドレスに置き換える必要があることに注意してください。Android仮想デバイスや
                    iOSシミュレーターで実行されているコードから <code>0.0.0.0</code> または <code>localhost</code> に呼び出しを行うことはできません。
                    <!-- should we include instructions on finding out the IP address?
                         `ipconfig getifaddr en0`or something -->
                </p>
            </step>
            <step>
                <p>
                    同じ <Path>composeApp/.../full_stack_task_manager/network</Path> パッケージ内に、以下の実装を持つ新しい <Path>TaskApi.kt</Path> ファイルを作成します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <Path>commonMain/.../App.kt</Path> に移動し、既存のAppコンポーザブルを以下の実装に置き換えます。
                    これにより、<code>TaskApi</code> 型を使用してサーバーからタスクのリストを取得し、各タスクの名前を列に表示します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    サーバーが実行されている間に、<ui-path>iosApp</ui-path> 実行構成を実行してiOSアプリケーションをテストします。
                </p>
            </step>
            <step>
                <p>
                    <control>Fetch Tasks</control> ボタンをクリックしてタスクのリストを表示します。
                    <img style="block" src="full_stack_development_tutorial_run_iOS.png"
                         alt="App running on iOS" width="363" border-effect="rounded"/>
                </p>
                <note>
                    このデモでは、分かりやすさのためにプロセスを簡素化しています。実際のアプリケーションでは、暗号化されていないデータをネットワーク経由で送信しないことが重要です。
                </note>
            </step>
            <step>
                <p>
                    Androidプラットフォームでは、アプリケーションにネットワークパーミッションを明示的に与え、プレーンテキストでのデータの送受信を許可する必要があります。これらのパーミッションを有効にするには、
                    <Path>composeApp/src/androidMain/AndroidManifest.xml</Path> を開き、以下の設定を追加します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <ui-path>composeApp</ui-path> 実行構成を使用してAndroidアプリケーションを実行します。
                    Androidクライアントも実行されるはずです。
                    <img style="block" src="full_stack_development_tutorial_run_android.png"
                         alt="App running on Android" width="350" border-effect="rounded"/>
                </p>
            </step>
            <step>
                <p>
                    デスクトップクライアントの場合、コンテナウィンドウに寸法とタイトルを割り当てる必要があります。
                    <Path>composeApp/src/desktopMain/.../main.kt</Path> ファイルを開き、<code>title</code> を変更し、<code>state</code> プロパティを設定することでコードを変更します。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    <ui-path>composeApp [desktop]</ui-path> 実行構成を使用してデスクトップアプリケーションを実行します。
                    <img style="block" src="full_stack_development_tutorial_run_desktop_resized.png"
                         alt="App running on desktop" width="400" border-effect="rounded"/>
                </p>
            </step>
            <step>
                <p>
                    <ui-path>composeApp [wasmJs]</ui-path> 実行構成を使用してウェブクライアントを実行します。
                </p>
                <img style="block" src="full_stack_development_tutorial_run_web.png"
                     alt="App running on desktop" width="400" border-effect="rounded"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="UIを改善する" id="improve-ui">
        <p>
            クライアントは現在サーバーと通信していますが、これは魅力的なUIとは言えません。
        </p>
        <procedure id="improve-ui-procedure">
            <step>
                <p>
                    <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path> にある <Path>App.kt</Path> ファイルを開き、既存の <code>App</code> を以下の <code>App</code> と <code>TaskCard</code> コンポーザブルに置き換えます。
                </p>
                [object Promise]
                <p>
                    この実装により、クライアントは基本的な機能を持つようになりました。
                </p>
                <p>
                    <code>LaunchedEffect</code> 型を使用することで、すべてのタスクが起動時にロードされ、<code>LazyColumn</code> コンポーザブルによりユーザーはタスクをスクロールできるようになります。
                </p>
                <p>
                    最後に、個別の <code>TaskCard</code> コンポーザブルが作成され、それが <code>Card</code> を使用して各 <code>Task</code> の詳細を表示します。タスクを削除および更新するためのボタンも追加されています。
                </p>
            </step>
            <step>
                <p>
                    クライアントアプリケーション（例: Androidアプリ）を再実行します。
                    これで、タスクをスクロールしたり、詳細を表示したり、削除したりできるようになります。
                    <img style="block" src="full_stack_development_tutorial_improved_ui.gif"
                         alt="App running on Android with improved UI" width="350" border-effect="rounded"/>
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="更新機能を追加する" id="add-update-functionality">
        <p>
            クライアントを完成させるために、タスクの詳細を更新できるようにする機能を追加します。
        </p>
        <procedure id="add-update-func-procedure">
            <step>
                <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path> にある <Path>App.kt</Path> ファイルに移動します。
            </step>
            <step>
                <p>
                    以下の例に示すように、<code>UpdateTaskDialog</code> コンポーザブルと必要なインポートを追加します。
                </p>
                [object Promise]
                <p>
                    これは、ダイアログボックスで <code>Task</code> の詳細を表示するコンポーザブルです。
                    <code>description</code> と <code>priority</code> は <code>TextField</code> コンポーザブル内に配置されているため、更新可能です。
                    ユーザーが更新ボタンを押すと、<code>onConfirm()</code> コールバックがトリガーされます。
                </p>
            </step>
            <step>
                <p>
                    同じファイル内の <code>App</code> コンポーザブルを更新します。
                </p>
                [object Promise]
                <p>
                    追加の状態（現在選択されているタスク）を保持しています。この値がnullでない場合、<code>UpdateTaskDialog</code> コンポーザブルを呼び出し、<code>onConfirm()</code> コールバックを <code>TaskApi</code> を使用してサーバーにPOSTリクエストを送信するように設定します。
                </p>
                <p>
                    最後に、<code>TaskCard</code> コンポーザブルを作成する際に、<code>onUpdate()</code> コールバックを使用して <code>currentTask</code> ステート変数を設定します。
                </p>
            </step>
            <step>
                クライアントアプリケーションを再実行します。これで、ボタンを使用して各タスクの詳細を更新できるようになります。
                <img style="block" src="full_stack_development_tutorial_update_task.gif"
                     alt="Deleting tasks on Android" width="350" border-effect="rounded"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="次のステップ" id="next-steps">
        <p>
            この記事では、Kotlin Multiplatformアプリケーションのコンテキスト内でKtorを使用しました。これで、複数のサービスとクライアントを含むプロジェクトを作成し、さまざまなプラットフォームをターゲットにできます。
        </p>
        <p>
            ご覧のとおり、コードの重複や冗長性をなくして機能を構築することが可能です。プロジェクトのすべてのレイヤーで必要な型は、
            <Path>shared</Path> マルチプラットフォームモジュール内に配置できます。
            サービスにのみ必要な機能は <Path>server</Path> モジュールに、クライアントにのみ必要な機能は <Path>composeApp</Path> に配置されます。
        </p>
        <p>
            このような開発には、クライアントとサーバー両方の技術に関する知識が不可欠です。しかし、
            <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin Multiplatform</a> ライブラリと
            <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> を使用することで、学習すべき新しい内容を最小限に抑えることができます。
            たとえ当初は単一のプラットフォームにしか焦点を当てていなかったとしても、アプリケーションの需要が高まるにつれて、他のプラットフォームを簡単に追加できます。
        </p>
    </chapter>
</topic>