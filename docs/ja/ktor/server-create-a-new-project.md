<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="新しいKtorプロジェクトを作成、開く、実行する"
       id="server-create-a-new-project"
       help-id="server_create_a_new_project">
    <show-structure for="chapter" depth="2"/>
    <tldr>
        <var name="example_name" value="tutorial-server-get-started"/>
        <p>
            <b>コード例</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
                %example_name%
            </a>
        </p>
    </tldr>
    <link-summary>
        Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学ぶ。
    </link-summary>
    <web-summary>
        初めてのKtorサーバーアプリケーションの構築を始めましょう。このチュートリアルでは、新しいKtorプロジェクトを作成、開く、実行する方法を学びます。
    </web-summary>
    <p>
        このチュートリアルでは、初めてのKtorサーバープロジェクトを作成、開く、実行する方法を学びます。一度起動して実行できるようになれば、Ktorに慣れるための連続したタスクに挑戦できます。
    </p>
    <p>
        これは、Ktorでサーバーアプリケーションの構築を開始するためのチュートリアルシリーズの最初のものです。各チュートリアルは独立して実行できますが、推奨される順序に従うことを強くお勧めします。
    </p>
    <list type="decimal">
        <li>新しいKtorプロジェクトを作成、開く、実行する。</li>
        <li><Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメータの基本を学びます。">リクエストを処理し、レスポンスを生成する</Links>。</li>
        <li><Links href="/ktor/server-create-restful-apis" summary="KotlinとKtorを使用してバックエンドサービスを構築する方法を学びます。JSONファイルを生成するRESTful APIの例を紹介します。">JSONを生成するRESTful APIを作成する</Links>。</li>
        <li><Links href="/ktor/server-create-website" summary="KtorとThymeleafテンプレートを使用してKotlinでウェブサイトを構築する方法を学びます。">Thymeleafテンプレートを使用してウェブサイトを作成する</Links>。</li>
        <li><Links href="/ktor/server-create-websocket-application" summary="WebSocketの機能を活用してコンテンツを送受信する方法を学びます。">WebSocketアプリケーションを作成する</Links>。</li>
        <li><Links href="/ktor/server-integrate-database" summary="KtorサービスをExposed SQLライブラリでデータベースリポジトリに接続するプロセスを学びます。">Exposedでデータベースを統合する</Links>。</li>
    </list>
    <chapter id="create-project" title="新しいKtorプロジェクトを作成する">
        <p>
            新しいKtorプロジェクトを作成する最も速い方法の1つは、<a href="#create-project-with-the-ktor-project-generator">WebベースのKtorプロジェクトジェネレーターを使用する</a>ことです。
        </p>
        <p>
            または、<a href="#create_project_with_intellij">IntelliJ IDEA Ultimate専用のKtorプラグイン</a>または
            <a href="#create_project_with_ktor_cli_tool">Ktor CLIツール</a>を使用してプロジェクトを生成することもできます。
        </p>
        <chapter title="Ktorプロジェクトジェネレーターを使用する"
                 id="create-project-with-the-ktor-project-generator">
            <p>
                Ktorプロジェクトジェネレーターで新しいプロジェクトを作成するには、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    <p><a href="https://start.ktor.io/">Ktor Project Generator</a>に移動します。</p>
                </step>
                <step>
                    <p>
                        <control>Project artifact</control>フィールドに、プロジェクトアーティファクト名として
                        <Path>com.example.ktor-sample-app</Path>を入力します。
                        <img src="ktor_project_generator_new_project_artifact_name.png"
                             alt="プロジェクトアーティファクト名com.example.ktor-sample-appを指定したKtorプロジェクトジェネレーター"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        <control>Configure</control>をクリックして設定のドロップダウンメニューを開きます。
                        <img src="ktor_project_generator_new_project_configure.png"
                             style="block"
                             alt="Ktorプロジェクト設定の展開ビュー" border-effect="line" width="706"/>
                    </p>
                    <p>
                        以下の設定が利用可能です。
                    </p>
                    <list>
                        <li>
                            <p>
                                <control>Build System</control>
                                :
                                希望する<Links href="/ktor/server-dependencies" summary="既存のGradle/MavenプロジェクトにKtorサーバーの依存関係を追加する方法を学びます。">ビルドシステム</Links>を選択します。
                                これはKotlinまたはGroovy DSLを用いた
                                <emphasis>Gradle</emphasis>、あるいは
                                <emphasis>Maven</emphasis>です。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Ktor version</control>
                                :
                                必要なKtorバージョンを選択します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Engine</control>
                                :
                                サーバーを実行するために使用する<Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>を選択します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Configuration</control>
                                :
                                サーバーパラメータを<Links href="/ktor/server-configuration-file" summary="設定ファイルで様々なサーバーパラメータを設定する方法を学びます。">YAMLまたはHOCONファイルで指定するか</Links>、
                                <Links href="/ktor/server-configuration-code" summary="コードで様々なサーバーパラメータを設定する方法を学びます。">コードで指定するか</Links>を選択します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Include samples</control>
                                :
                                プラグインのサンプルコードを追加するために、このオプションを有効のままにします。
                            </p>
                        </li>
                    </list>
                    <p>このチュートリアルでは、これらの設定のデフォルト値をそのまま使用できます。</p>
                </step>
                <step>
                    <p>
                        <control>Done</control>をクリックして設定を保存し、メニューを閉じます。
                    </p>
                </step>
                <step>
                    <p>以下に、プロジェクトに追加できる<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。">プラグイン</Links>のセットがあります。プラグインは、認証、シリアライゼーションとコンテンツエンコーディング、圧縮、Cookieサポートなど、Ktorアプリケーションで共通機能を提供するビルディングブロックです。</p>
                    <p>このチュートリアルでは、この段階でプラグインを追加する必要はありません。</p>
                </step>
                <step>
                    <p>
                        <control>Download</control>ボタンをクリックしてKtorプロジェクトを生成し、ダウンロードします。
                        <img src="ktor_project_generator_new_project_download.png"
                             alt="Ktorプロジェクトジェネレーターのダウンロードボタン"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <p>ダウンロードは自動的に開始されます。</p>
            </procedure>
            <p>新しいプロジェクトを生成したので、引き続き<a href="#unpacking">Ktorプロジェクトを解凍して実行</a>します。</p>
        </chapter>
        <chapter title="IntelliJ IDEA Ultimate用Ktorプラグインを使用する" id="create_project_with_intellij"
                 collapsible="true">
            <p>
                このセクションでは、IntelliJ IDEA Ultimate用の<a
                    href="https://plugins.jetbrains.com/plugin/16008-ktor">Ktorプラグイン</a>を使用したプロジェクト設定について説明します。
            </p>
            <p>
                新しいKtorプロジェクトを作成するには、<a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">IntelliJ IDEAを開き</a>、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    <p>
                        ようこそ画面で、<control>New Project</control>をクリックします。
                    </p>
                    <p>
                        そうでない場合は、メインメニューから<ui-path>File | New | Project</ui-path>を選択します。
                    </p>
                </step>
                <step>
                    <p>
                        <control>New Project</control>ウィザードで、左側のリストから<control>Ktor</control>を選択します。
                    </p>
                </step>
                <step>
                    <p>
                        右側のペインで、以下の設定を指定できます。
                    </p>
                    <img src="ktor_idea_new_project_settings.png" alt="Ktorプロジェクト設定" width="706"
                         border-effect="rounded"/>
                    <list>
                        <li>
                            <p>
                                <control>Name</control>
                                :
                                プロジェクト名を指定します。プロジェクト名として
                                <Path>ktor-sample-app</Path>を入力します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Location</control>
                                :
                                プロジェクトのディレクトリを指定します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Website</control>
                                :
                                パッケージ名を生成するために使用するドメインを指定します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Artifact</control>
                                :
                                このフィールドには生成されたアーティファクト名が表示されます。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Engine</control>
                                :
                                サーバーを実行するために使用する<Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>を選択します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Include samples</control>
                                :
                                プラグインのサンプルコードを追加するために、このオプションを有効のままにします。
                            </p>
                        </li>
                    </list>
                </step>
                <step>
                    <p>
                        <control>Advanced Settings</control>をクリックして、
                        追加設定メニューを展開します。
                    </p>
                    <img src="ktor_idea_new_project_advanced_settings.png" alt="Ktorプロジェクトの高度な設定"
                         width="706" border-effect="rounded"/>
                    <p>
                        以下の設定が利用可能です。
                    </p>
                    <list>
                        <li>
                            <p>
                                <control>Build System</control>
                                :
                                希望する<Links href="/ktor/server-dependencies" summary="既存のGradle/MavenプロジェクトにKtorサーバーの依存関係を追加する方法を学びます。">ビルドシステム</Links>を選択します。
                                これはKotlinまたはGroovy DSLを用いた
                                <emphasis>Gradle</emphasis>、あるいは
                                <emphasis>Maven</emphasis>です。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Ktor version</control>
                                :
                                必要なKtorバージョンを選択します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Configuration</control>
                                :
                                サーバーパラメータを<Links href="/ktor/server-configuration-file" summary="設定ファイルで様々なサーバーパラメータを設定する方法を学びます。">YAMLまたはHOCONファイルで指定するか</Links>、
                                <Links href="/ktor/server-configuration-code" summary="コードで様々なサーバーパラメータを設定する方法を学びます。">コードで指定するか</Links>を選択します。
                            </p>
                        </li>
                    </list>
                    <p>このチュートリアルでは、これらの設定のデフォルト値をそのまま使用できます。</p>
                </step>
                <step>
                    <p>
                        <control>Next</control>をクリックして、次のページに進みます。
                    </p>
                    <img src="ktor_idea_new_project_plugins_list.png" alt="Ktorプラグイン" width="706"
                         border-effect="rounded"/>
                    <p>
                        このページでは、<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。">プラグイン</Links>のセットを選択できます。これらは、認証、シリアライゼーションとコンテンツエンコーディング、圧縮、Cookieサポートなど、Ktorアプリケーションの共通機能を提供するビルディングブロックです。
                    </p>
                    <p>このチュートリアルでは、この段階でプラグインを追加する必要はありません。</p>
                </step>
                <step>
                    <p>
                        <control>Create</control>をクリックし、IntelliJ IDEAがプロジェクトを生成し、
                        依存関係をインストールするまで待ちます。
                    </p>
                </step>
            </procedure>
            <p>
                新しいプロジェクトを作成したので、引き続きアプリケーションを<a href="#open-explore-run">開く、探索する、実行する</a>方法を学びます。
            </p>
        </chapter>
        <chapter title="Ktor CLIツールを使用する" id="create_project_with_ktor_cli_tool"
                 collapsible="true">
            <p>
                このセクションでは、<a href="https://github.com/ktorio/ktor-cli">Ktor CLIツール</a>を使用したプロジェクト設定について説明します。
            </p>
            <p>
                新しいKtorプロジェクトを作成するには、任意のターミナルを開き、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    以下のいずれかのコマンドを使用してKtor CLIツールをインストールします。
                    <tabs>
                        <tab title="macOS/Linux" id="macos-linux">
                            [object Promise]
                        </tab>
                        <tab title="Windows" id="windows">
                            [object Promise]
                        </tab>
                    </tabs>
                </step>
                <step>
                    インタラクティブモードで新しいプロジェクトを生成するには、以下のコマンドを使用します。
                    [object Promise]
                </step>
                <step>
                    プロジェクト名として
                    <Path>ktor-sample-app</Path>を入力します。
                    <img src="server_create_cli_tool_name_dark.png"
                         alt="インタラクティブモードでKtor CLIツールを使用する"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>
                        (オプション) プロジェクト名の下の
                        <ui-path>Location</ui-path>パスを編集して、プロジェクトが保存される場所を変更することもできます。
                    </p>
                </step>
                <step>
                    続行するには<shortcut>Enter</shortcut>を押します。
                </step>
                <step>
                    次のステップでは、プロジェクトに<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。">プラグイン</Links>を検索して追加できます。プラグインは、認証、シリアライゼーションとコンテンツエンコーディング、圧縮、Cookieサポートなど、Ktorアプリケーションで共通機能を提供するビルディングブロックです。
                    <img src="server_create_cli_tool_add_plugins_dark.png"
                         alt="Ktor CLIツールを使用してプロジェクトにプラグインを追加する"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>このチュートリアルでは、この段階でプラグインを追加する必要はありません。</p>
                </step>
                <step>
                    プロジェクトを生成するには<shortcut>CTRL+G</shortcut>を押します。
                    <p>
                        または、<control>CREATE PROJECT (CTRL+G)</control>を選択して<shortcut>Enter</shortcut>を押すことでプロジェクトを生成することもできます。
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="Ktorプロジェクトを解凍して実行する" id="unpacking">
        <p>
            このセクションでは、コマンドラインからプロジェクトを解凍、ビルド、実行する方法を学びます。以下の説明では、以下を前提としています。
        </p>
        <list type="bullet">
            <li><Path>ktor-sample-app</Path>という名前のプロジェクトを作成し、ダウンロードしていること。
            </li>
            <li>これがホームディレクトリ内の<Path>myprojects</Path>というフォルダに配置されていること。
            </li>
        </list>
        <p>必要に応じて、自身のセットアップに合わせて名前とパスを変更してください。</p>
        <p>任意のコマンドラインツールを開き、以下の手順に従ってください。</p>
        <procedure>
            <step>
                <p>ターミナルで、プロジェクトをダウンロードしたフォルダに移動します。</p>
                [object Promise]
            </step>
            <step>
                <p>ZIPアーカイブを同名のフォルダに解凍します。</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>これで、ディレクトリにはZIPアーカイブと解凍されたフォルダが含まれます。</p>
            </step>
            <step>
                <p>そのディレクトリから、新しく作成されたフォルダに移動します。</p>
                [object Promise]
            </step>
            <step>
                <p>macOS/UNIXシステムでは、gradlew Gradleヘルパースクリプトを実行可能にする必要があります。そのためには、<code>chmod</code>コマンドを使用します。</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>プロジェクトをビルドするには、以下のコマンドを使用します。</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>ビルドが成功したと表示されたら、再びGradle経由でプロジェクトを実行できます。</p>
            </step>
            <step>
                <p>プロジェクトを実行するには、以下のコマンドを使用します。</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>プロジェクトが実行されていることを確認するには、出力に記載されているURL (<a
                        href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) でブラウザを開きます。
                    画面に「Hello World!」というメッセージが表示されるはずです。</p>
                <img src="server_get_started_ktor_sample_app_output.png" alt="生成されたKtorプロジェクトの出力"
                     border-effect="line" width="706"/>
            </step>
        </procedure>
        <p>おめでとうございます！Ktorプロジェクトの起動に成功しました。</p>
        <p>Ktorアプリケーションを実行している基盤となるプロセスがビジー状態であるため、コマンドラインが応答しないことに注意してください。
            アプリケーションを終了するには
            <shortcut>CTRL+C</shortcut>を押すことができます。
        </p>
    </chapter>
    <chapter title="IntelliJ IDEAでKtorプロジェクトを開く、探索する、実行する" id="open-explore-run">
        <chapter title="プロジェクトを開く" id="open">
            <p><a href="https://www.jetbrains.com/idea/">IntelliJ IDEA</a>がインストールされている場合、コマンドラインから簡単にプロジェクトを開くことができます。
            </p>
            <p>
                プロジェクトフォルダにいることを確認し、現在のフォルダを表すピリオドに続けて<code>idea</code>コマンドを入力します。
            </p>
            [object Promise]
            <p>
                または、手動でプロジェクトを開くにはIntelliJ IDEAを起動します。
            </p>
            <p>
                ようこそ画面が開いたら、<control>Open</control>をクリックします。そうでない場合は、メインメニューで
                <ui-path>File | Open</ui-path>に進み、
                <Path>ktor-sample-app</Path>フォルダを選択して開きます。
            </p>
            <tip>
                プロジェクトの管理に関する詳細は、
                <a href="https://www.jetbrains.com/help/idea/creating-and-managing-projects.html">IntelliJ IDEAのドキュメント</a>を参照してください。
            </tip>
        </chapter>
        <chapter title="プロジェクトを探索する" id="explore">
            <p>どちらのオプションを選択しても、プロジェクトは以下のように開くはずです。</p>
            <img src="server_get_started_idea_project_view.png" alt="IDEでの生成されたKtorプロジェクトビュー" width="706"/>
            <p>
                プロジェクトのレイアウトを説明するために、<control>Project</control>ビューで構造を展開し、
                <Path>settings-gradle.kts</Path>ファイルを選択しました。
            </p>
            <p>
                アプリケーションを実行するコードは、<Path>src/main/kotlin</Path>の下のパッケージに存在することがわかります。デフォルトのパッケージは
                <Path>com.example</Path>と呼ばれ、<Path>plugins</Path>というサブパッケージを含んでいます。
                これらのパッケージ内に、<Path>Application.kt</Path>と
                <Path>Routing.kt</Path>という2つのファイルが作成されています。
            </p>
            <img src="server_get_started_idea_main_folder.png" alt="Ktorプロジェクトのsrcフォルダ構造" width="400"/>
            <p>プロジェクト名は
                <Path>settings-gradle.kts</Path>で設定されます。
            </p>
            <img src="server_get_started_idea_settings_file.png" alt="settings.gradle.ktの内容" width="706"/>
            <p>
                設定ファイルやその他のコンテンツは、
                <Path>src/main/resources</Path>フォルダ内にあります。
            </p>
            <img src="server_get_started_idea_resources_folder.png" alt="Ktorプロジェクトのresourcesフォルダ構造"
                 width="400"/>
            <p>
                <Path>src/test/kotlin</Path>の下のパッケージにスケルトンテストが作成されています。
            </p>
            <img src="server_get_started_idea_test_folder.png" alt="Ktorプロジェクトのtestフォルダ構造" width="400"/>
        </chapter>
        <chapter title="プロジェクトを実行する" id="run">
            <procedure>
                <p>IntelliJ IDEA内からプロジェクトを実行するには、以下の手順に従います。</p>
                <step>
                    <p><a href="https://www.jetbrains.com/help/idea/jetgradle-tool-window.html">Gradleツールウィンドウ</a>
                        を右サイドバーのGradleアイコン (<img alt="IntelliJ IDEA Gradleアイコン"
                                                          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
                        をクリックして開きます。</p>
                    <img src="server_get_started_idea_gradle_tab.png" alt="IntelliJ IDEAのGradleタブ"
                         border-effect="line" width="706"/>
                </step>
                <step>
                    <p>このツールウィンドウ内で
                        <ui-path>Tasks | application</ui-path>に移動し、
                        <control>run</control>タスクをダブルクリックします。
                    </p>
                    <img src="server_get_started_idea_gradle_run.png" alt="IntelliJ IDEAのGradleタブ"
                         border-effect="line" width="450"/>
                </step>
                <step>
                    <p>Ktorアプリケーションは、IDE下部の<a
                            href="https://www.jetbrains.com/help/idea/run-tool-window.html">Runツールウィンドウ</a>で起動します。</p>
                    <img src="server_get_started_idea_run_terminal.png" alt="ターミナルで実行中のプロジェクト" width="706"/>
                    <p>以前コマンドラインに表示されていたメッセージと同じメッセージが、
                        <ui-path>Run</ui-path>ツールウィンドウに表示されるようになります。
                    </p>
                </step>
                <step>
                    <p>プロジェクトが実行されていることを確認するには、指定されたURL
                        (<a href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) でブラウザを開きます。</p>
                    <p>再び「Hello World!」というメッセージが画面に表示されるはずです。</p>
                    <img src="server_get_started_ktor_sample_app_output.png" alt="ブラウザ画面でのHello World"
                         width="706"/>
                </step>
            </procedure>
            <p>
                <ui-path>Run</ui-path>ツールウィンドウからアプリケーションを管理できます。
            </p>
            <list type="bullet">
                <li>
                    アプリケーションを終了するには、停止ボタン <img src="intellij_idea_terminate_icon.svg"
                                                                             style="inline" height="16" width="16"
                                                                             alt="IntelliJ IDEA終了アイコン"/>をクリックします。
                </li>
                <li>
                    プロセスを再起動するには、再実行ボタン <img src="intellij_idea_rerun_icon.svg"
                                                                        style="inline" height="16" width="16"
                                                                        alt="IntelliJ IDEA再実行アイコン"/>をクリックします。
                </li>
            </list>
            <p>
                これらのオプションについては、<a href="https://www.jetbrains.com/help/idea/run-tool-window.html#run-toolbar">IntelliJ IDEA Run
                ツールウィンドウのドキュメント</a>でさらに詳しく説明されています。
            </p>
        </chapter>
    </chapter>
    <chapter title="追加で試すべきタスク" id="additional-tasks">
        <p>以下に、試してみたい追加のタスクをいくつか示します。</p>
        <list type="decimal">
            <li><a href="#change-the-default-port">デフォルトポートを変更する。</a></li>
            <li><a href="#change-the-port-via-yaml">YAML経由でポートを変更する。</a></li>
            <li><a href="#add-a-new-http-endpoint">新しいHTTPエンドポイントを追加する。</a></li>
            <li><a href="#configure-static-content">静的コンテンツを設定する。</a></li>
            <li><a href="#write-an-integration-test">統合テストを作成する。</a></li>
            <li><a href="#register-error-handlers">エラーハンドラを登録する。</a></li>
        </list>
        <p>
            これらのタスクは互いに依存していませんが、徐々に複雑さが増します。宣言された順序で試すことが、段階的に学習する最も簡単な方法です。簡潔にするため、および重複を避けるため、以下の説明では、タスクを順番に試していることを前提としています。
        </p>
        <p>
            コーディングが必要な場合は、コードとその対応するインポートの両方を指定しています。IDEがこれらのインポートを自動的に追加する場合があります。
        </p>
        <chapter title="デフォルトポートを変更する" id="change-the-default-port">
            <p>
                <ui-path>Project</ui-path>ビューで、<Path>src/main/kotlin</Path>フォルダに移動し、作成された単一のパッケージに入って、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    <p><Path>Application.kt</Path>ファイルを開きます。次のようなコードが見つかるはずです。
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p><code>embeddedServer()</code>関数で、<code>port</code>パラメータを「9292」など、任意の別の番号に変更します。</p>
                    [object Promise]
                </step>
                <step>
                    <p>再実行ボタン (<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        をクリックしてアプリケーションを再起動します。</p>
                </step>
                <step>
                    <p>アプリケーションが新しいポート番号で実行されていることを確認するには、新しいURL (<a href="http://0.0.0.0:9292">http://0.0.0.0:9292</a>) でブラウザを開くか、
                        <a href="https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#creating-http-request-files">IntelliJ IDEAで新しいHTTPリクエストファイルを作成</a>します。</p>
                    <img src="server_get_started_port_change.png"
                         alt="IntelliJ IDEAでHTTPリクエストファイルを使用してポート変更をテストする" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="YAML経由でポートを変更する" id="change-the-port-via-yaml">
            <p>
                新しいKtorプロジェクトを作成する際、設定をYAMLまたは
                HOCONファイルとして外部に保存するオプションがあります。
            </p>
            <img src="ktor_project_generator_configuration_options.png" width="400"
                 alt="Ktorプロジェクトジェネレーターの設定オプション"/>
            <p>
                設定を外部に保存することを選択した場合、<Path>Application.kt</Path>のコードは次のようになります。
            </p>
            [object Promise]
            <p>
                これらは<Path>src/main/resources/</Path>内の設定ファイルに保存される値です。
            </p>
            <tabs>
                <tab title="application.yaml (YAML)" group-key="yaml">
                    [object Promise]
                </tab>
                <tab title="application.conf (HOCON)" group-key="hocon">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                この場合、ポート番号を変更するためにコードを修正する必要はありません。YAMLまたはHOCONファイル内の値を変更し、アプリケーションを再起動するだけです。この変更は、上記の<a href="#change-the-default-port">デフォルトポートの変更</a>と同じ方法で確認できます。
            </p>
        </chapter>
        <chapter title="新しいHTTPエンドポイントを追加する" id="add-a-new-http-endpoint">
            <p>次に、GETリクエストに応答する新しいHTTPエンドポイントを作成します。</p>
            <p>
                <ui-path>Project</ui-path>ツールウィンドウで、<Path>src/main/kotlin/com/example</Path>フォルダに移動し、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    <p><Path>Application.kt</Path>ファイルを開き、<code>configureRouting()</code>関数を見つけます。</p>
                </step>
                <step>
                    <p>IntelliJ IDEAで、関数名にキャレットを置いて
                        <shortcut>⌘Cmd+B</shortcut>を押して、<code>configureRouting()</code>関数に移動します。
                    </p>
                    <p>または、<code>Routing.kt</code>ファイルを開いて関数に移動することもできます。</p>
                    <p>これが表示されるコードです。</p>
                    [object Promise]
                </step>
                <step>
                    <p>新しいエンドポイントを作成するには、以下に示す5行のコードを追加します。</p>
                    [object Promise]
                    <p><code>/test1</code> URLは任意に変更できることに注意してください。</p>
                </step>
                <step>
                    <p><code>ContentType</code>を利用するために、以下のインポートを追加します。</p>
                    [object Promise]
                </step>
                <step>
                    <p>再実行ボタン (<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        をクリックしてアプリケーションを再起動します。</p>
                </step>
                <step>
                    <p>ブラウザで新しいURL (<a
                            href="http://0.0.0.0:9292/test1">http://0.0.0.0:9292/test1</a>) をリクエストします。使用するポート番号は、最初のタスク(<a
                                href="#change-the-default-port">デフォルトポートの変更</a>)を試したかどうかによって異なります。以下に表示される出力が表示されるはずです。</p>
                    <img src="server_get_started_add_new_http_endpoint_output.png"
                         alt="「Hello from Ktor」と表示されたブラウザ画面" width="706"/>
                    <p>HTTPリクエストファイルを作成している場合は、そこでも新しいエンドポイントを確認できます。</p>
                    <img src="server_get_started_add_new_http_endpoint.png" alt="IntelliJ IDEAのHTTPリクエストファイル"
                         width="450"/>
                    <p>異なるリクエストを区切るには、3つのハッシュ(###)を含む行が必要であることに注意してください。</p>
                </step>
            </procedure>
        </chapter>
        <chapter title="静的コンテンツを設定する" id="configure-static-content">
            <p>
                <ui-path>Project</ui-path>ツールウィンドウで、<Path>src/main/kotlin/com/example/plugins</Path>フォルダに移動し、以下の手順に従ってください。
            </p>
            <procedure>
                <step>
                    <p><code>Routing.kt</code>ファイルを開きます。</p>
                    <p>これは再びデフォルトのコンテンツであるはずです。</p>
                    [object Promise]
                    <p>このタスクでは、<a href="#add-a-new-http-endpoint">新しいHTTPエンドポイントの追加</a>で指定された追加エンドポイントのコンテンツを挿入したかどうかは関係ありません。</p>
                </step>
                <step>
                    <p>ルーティングセクションに以下の行を追加します。</p>
                    [object Promise]
                    <p>この行の意味は次のとおりです。</p>
                    <list type="bullet">
                        <li><code>staticResources()</code>を呼び出すことで、Ktorに、HTMLやJavaScriptファイルなどの標準的なウェブサイトコンテンツをアプリケーションが提供できるようにしたいことを伝えます。このコンテンツはブラウザ内で実行される場合がありますが、サーバーの観点からは静的と見なされます。
                        </li>
                        <li>URL <code>/content</code>は、このコンテンツを取得するために使用されるパスを指定します。
                        </li>
                        <li>パス<code>mycontent</code>は、静的コンテンツが配置されるフォルダの名前です。Ktorは<code>resources</code>ディレクトリ内でこのフォルダを探します。
                        </li>
                    </list>
                </step>
                <step>
                    <p>以下のインポートを追加します。</p>
                    [object Promise]
                </step>
                <step>
                    <p>
                        <control>Project</control>ツールウィンドウで、<code>src/main/resources</code>フォルダを右クリックし、
                        <control>New | Directory</control>を選択します。
                    </p>
                    <p>または、<code>src/main/resources</code>フォルダを選択し、
                        <shortcut>⌘Сmd+N</shortcut>を押し、
                        <control>Directory</control>をクリックします。
                    </p>
                </step>
                <step>
                    <p>新しいディレクトリに<code>mycontent</code>という名前を付け、<shortcut>↩Enter</shortcut>を押します。</p>
                </step>
                <step>
                    <p>新しく作成したフォルダを右クリックし、<control>New | File</control>をクリックします。</p>
                </step>
                <step>
                    <p>新しいファイルに「sample.html」という名前を付け、<shortcut>↩Enter</shortcut>を押します。</p>
                </step>
                <step>
                    <p>新しく作成したファイルページに、例えば次のような有効なHTMLを入力します。</p>
                    [object Promise]
                </step>
                <step>
                    <p>再実行ボタン (<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        をクリックしてアプリケーションを再起動します。</p>
                </step>
                <step>
                    <p>ブラウザで<a href="http://0.0.0.0:9292/content/sample.html">http://0.0.0.0:9292/content/sample.html</a>を開くと、サンプルページの内容が表示されるはずです。</p>
                    <img src="server_get_started_configure_static_content_output.png"
                         alt="ブラウザに表示される静的ページの出力" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="統合テストを作成する" id="write-an-integration-test">
            <p>
                Ktorは<Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">統合テストの作成</Links>をサポートしており、生成されたプロジェクトにはこの機能がバンドルされています。
            </p>
            <p>これを利用するには、以下の手順に従ってください。</p>
            <procedure>
                <step>
                    <p>
                        <Path>src</Path>の下に「test」という新しいディレクトリを作成し、その中に「kotlin」というサブディレクトリを作成します。
                    </p>
                </step>
                <step>
                    <p><Path>src/test/kotlin</Path>内に「com.example」という新しいパッケージを作成します。</p>
                </step>
                <step>
                    <p>
                        <Path>src/test/kotlin/com.example</Path>内に「ApplicationTest.kt」という新しいファイルを作成します。
                    </p>
                </step>
                <step>
                    <p><code>ApplicationTest.kt</code>ファイルを開き、以下のコードを追加します。</p>
                    [object Promise]
                    <p><code>testApplication()</code>メソッドはKtorの新しいインスタンスを作成します。このインスタンスは、Nettyのようなサーバーとは対照的に、テスト環境内で実行されます。</p>
                    <p>次に、<code>application()</code>メソッドを使用して、<code>embeddedServer()</code>から呼び出されるのと同じセットアップを呼び出すことができます。</p>
                    <p>最後に、組み込みの<code>client</code>オブジェクトとJUnitアサーションを使用して、サンプルリクエストを送信し、レスポンスをチェックできます。</p>
                </step>
                <step>
                    <p>以下の必要なインポートを追加します。</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                テストは、IntelliJ IDEAでテストを実行する標準的な方法のいずれかで実行できます。Ktorの新しいインスタンスを実行しているため、テストの成否はアプリケーションが0.0.0.0で実行されているかどうかに依存しないことに注意してください。
            </p>
            <p>
                <a href="#add-a-new-http-endpoint">新しいHTTPエンドポイントの追加</a>を正常に完了している場合、この追加テストを追加できるはずです。
            </p>
            [object Promise]
            <p>以下の追加インポートが必要です。</p>
            [object Promise]
        </chapter>
        <chapter title="エラーハンドラを登録する" id="register-error-handlers">
            <p>
                <Links href="/ktor/server-status-pages" summary="`%plugin_name%`は、スローされた例外やステータスコードに基づいて、Ktorアプリケーションが任意の失敗状態に適切に応答できるようにします。">StatusPagesプラグイン</Links>を使用して、Ktorアプリケーションのエラーを処理できます。
            </p>
            <p>
                このプラグインは、デフォルトではプロジェクトに含まれていません。Ktor
                Project Generatorの<ui-path>Plugins</ui-path>セクション、またはIntelliJ IDEAのプロジェクトウィザード経由でプロジェクトに追加できたはずです。既にプロジェクトを作成しているため、次のステップではプラグインを手動で追加および設定する方法を学びます。
            </p>
            <p>
                これには4つのステップがあります。
            </p>
            <list type="decimal">
                <li><a href="#add-dependency">Gradleビルドファイルに新しい依存関係を追加する。</a></li>
                <li><a href="#install-plugin-and-specify-handler">プラグインをインストールし、例外ハンドラを指定する。</a></li>
                <li><a href="#write-sample-code">ハンドラをトリガーするサンプルコードを作成する。</a></li>
                <li><a href="#restart-and-invoke">サンプルコードを再起動して呼び出す。</a></li>
            </list>
            <procedure title="新しい依存関係を追加する" id="add-dependency">
                <p>
                    <control>Project</control>ツールウィンドウで、プロジェクトのルートフォルダに移動し、以下の手順に従ってください。
                </p>
                <step>
                    <p><code>build.gradle.kts</code>ファイルを開きます。</p>
                </step>
                <step>
                    <p>依存関係セクションに、以下に示す追加の依存関係を追加します。</p>
                    [object Promise]
                    <p>これを完了したら、この新しい依存関係を認識させるためにプロジェクトをリロードする必要があります。</p>
                </step>
                <step>
                    <p>macOSでは<shortcut>Shift+⌘Cmd+I</shortcut>、Windowsでは
                        <shortcut>Ctrl+Shift+O</shortcut>を押してプロジェクトをリロードします。
                    </p>
                </step>
            </procedure>
            <procedure title="プラグインをインストールし、例外ハンドラを指定する"
                       id="install-plugin-and-specify-handler">
                <step>
                    <p><code>Routing.kt</code>の<code>configureRouting()</code>メソッドに移動し、以下のコード行を追加します。</p>
                    [object Promise]
                    <p>これらの行は<code>StatusPages</code>プラグインをインストールし、<code>IllegalStateException</code>型の例外がスローされた場合に実行するアクションを指定します。</p>
                </step>
                <step>
                    <p>以下のインポートを追加します。</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                通常、HTTPエラーコードはレスポンスに設定されますが、このタスクの目的のために、出力はブラウザに直接表示されます。
            </p>
            <procedure title="ハンドラをトリガーするサンプルコードを作成する" id="write-sample-code">
                <step>
                    <p><code>configureRouting()</code>メソッド内にとどまり、以下に示す追加の行を追加します。</p>
                    [object Promise]
                    <p>これで、URL <code>/error-test</code>を持つエンドポイントを追加しました。このエンドポイントがトリガーされると、ハンドラで使用されている型の例外がスローされます。</p>
                </step>
            </procedure>
            <procedure title="サンプルコードを再起動して呼び出す" id="restart-and-invoke">
                <step>
                    <p>再実行ボタン (<img alt="IntelliJ IDEA再実行ボタンアイコン"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        をクリックしてアプリケーションを再起動します。</p></step>
                <step>
                    <p>ブラウザでURL <a href="http://0.0.0.0:9292/error-test">http://0.0.0.0:9292/error-test</a>に移動します。
                        以下に示すエラーメッセージが表示されるはずです。</p>
                    <img src="server_get_started_register_error_handler_output.png"
                         alt="「App in illegal state as Too Busy」というメッセージが表示されたブラウザ画面" width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="次のステップ" id="next_steps">
        <p>
            追加タスクの最後まで完了した場合、Ktorサーバーの設定、Ktorプラグインの統合、新しいルートの実装の理解が深まったはずです。しかし、これは始まりに過ぎません。Ktorの基本的な概念をさらに深く掘り下げるには、このガイドの次のチュートリアルに進んでください。
        </p>
        <p>
            次に、<Links href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを構築することで、KtorとKotlinにおけるルーティング、リクエスト処理、パラメータの基本を学びます。">タスクマネージャーアプリケーションを作成してリクエストを処理し、レスポンスを生成する</Links>方法を学びます。
        </p>
    </chapter>
</topic>