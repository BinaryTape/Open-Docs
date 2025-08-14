```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="クライアントアプリケーションを作成する"
   id="client-create-new-application"
   help-id="getting_started_ktor_client;client-getting-started;client-get-started;client-create-a-new-application">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-client-get-started"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    リクエストを送信し、レスポンスを受信する最初のクライアントアプリケーションを作成します。
</link-summary>
<p>
    Ktorにはマルチプラットフォームの非同期HTTPクライアントが含まれており、これを使用すると<Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、リクエストの本文など、さまざまなリクエストパラメータを指定してリクエストを作成する方法を学びます。">リクエストを送信し</Links>、<Links href="/ktor/client-responses" summary="レスポンスを受信し、レスポンスの本文を取得し、レスポンスパラメータを取得する方法を学びます。">レスポンスを処理</Links>し、<Links href="/ktor/client-plugins" summary="ロギング、シリアル化、認証などの共通機能を提供するプラグインに慣れ親しみます。">プラグイン</Links>（<Links href="/ktor/client-auth" summary="Authプラグインは、クライアントアプリケーションでの認証と認可を処理します。">認証</Links>、<Links href="/ktor/client-serialization" summary="ContentNegotiationプラグインには主に2つの目的があります。クライアントとサーバー間のメディアタイプをネゴシエートすることと、リクエストの送信時およびレスポンスの受信時に特定の形式でコンテンツをシリアル化/デシリアル化することです。">JSONシリアル化</Links>など）でその機能を拡張できます。
</p>
<p>
    このチュートリアルでは、リクエストを送信してレスポンスを出力する最初のKtorクライアントアプリケーションを作成する方法を説明します。
</p>
<chapter title="前提条件" id="prerequisites">
<p>
    このチュートリアルを開始する前に、<a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA Community または Ultimate をインストール</a>してください。
</p>
</chapter>
<chapter title="新規プロジェクトを作成する" id="new-project">
    <p>
        既存のプロジェクトでKtorクライアントを<Links href="/ktor/client-create-and-configure" summary="Ktorクライアントの作成と設定方法について学びます。">手動で作成し設定</Links>することもできますが、IntelliJ IDEA にバンドルされている Kotlin プラグインを使用して新しいプロジェクトを生成するのが、ゼロから始める便利な方法です。
    </p>
    <p>
        新しい Kotlin プロジェクトを作成するには、<a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">IntelliJ IDEA を開き</a>、以下の手順に従ってください。
    </p>
    <procedure>
        <step>
<p>
    ようこそ画面で、<control>新規プロジェクト</control>をクリックします。
</p>
<p>
    または、メインメニューから<ui-path>ファイル | 新規 | プロジェクト</ui-path>を選択します。
</p>
        </step>
        <step>
            <p>
                <control>新規プロジェクト</control>ウィザードで、左側のリストから<control>Kotlin</control>を選択します。
            </p>
        </step>
        <step>
            <p>
                右側のペインで、以下の設定を指定します。
            </p>
            <img src="client_get_started_new_project.png" alt="IntelliJ IDEA の新規 Kotlin プロジェクトウィンドウ"
                 border-effect="rounded"
                 width="706"/>
            <list id="kotlin_app_settings">
                <li>
                    <p>
                        <control>名前</control>
                        : プロジェクト名を指定します。
                    </p>
                </li>
                <li>
                    <p>
                        <control>場所</control>
                        : プロジェクトのディレクトリを指定します。
                    </p>
                </li>
                <li>
                    <p>
                        <control>ビルドシステム</control>
                        : <control>Gradle</control>が選択されていることを確認します。
                    </p>
                </li>
                <li>
                    <p>
                        <control>Gradle DSL</control>
                        : <control>Kotlin</control>を選択します。
                    </p>
                </li>
                <li>
                    <p>
                        <control>サンプルコードを追加</control>
                        : 生成されたプロジェクトにサンプルコードを含めるには、このオプションを選択します。
                    </p>
                </li>
            </list>
        </step>
        <step>
            <p>
                <control>作成</control>をクリックし、IntelliJ IDEA がプロジェクトを生成して依存関係をインストールするまで待ちます。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="依存関係を追加する" id="add-dependencies">
    <p>
        Ktor クライアントに必要な依存関係を追加しましょう。
    </p>
    <procedure>
        <step>
            <p>
                <Path>gradle.properties</Path>ファイルを開き、Ktor のバージョンを指定する以下の行を追加します。
            </p>
            [object Promise]
            <note id="eap-note">
                <p>
                    Ktor の EAP バージョンを使用するには、<a href="#repositories">Space リポジトリ</a>を追加する必要があります。
                </p>
            </note>
        </step>
        <step>
            <p>
                <Path>build.gradle.kts</Path>ファイルを開き、依存関係ブロックに以下のアーティファクトを追加します。
            </p>
            [object Promise]
            <list>
                <li><code>ktor-client-core</code> は、主要なクライアント機能を提供するコア依存関係です。
                </li>
                <li>
                    <code>ktor-client-cio</code> は、ネットワークリクエストを処理する<Links href="/ktor/client-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>の依存関係です。
                </li>
            </list>
        </step>
        <step>
            <p>
                <Path>build.gradle.kts</Path>ファイルの右上にある<control>Gradle の変更をロード</control>アイコンをクリックして、新しく追加された依存関係をインストールします。
            </p>
            <img src="client_get_started_load_gradle_changes_name.png" alt="Gradle の変更をロード" width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="クライアントを作成する" id="create-client">
    <p>
        クライアントの実装を追加するには、<Path>src/main/kotlin</Path>に移動して以下の手順に従います。
    </p>
    <procedure>
        <step>
            <p>
                <Path>Main.kt</Path>ファイルを開き、既存のコードを以下の実装に置き換えます。
            </p>
            [object Promise]
            <p>
                Ktor では、クライアントは<a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html"><code>HttpClient</code></a>クラスで表現されます。
            </p>
        </step>
        <step>
            <p>
                <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html"><code>HttpClient.get()</code></a>メソッドを使用して、<Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、リクエストの本文など、さまざまなリクエストパラメータを指定してリクエストを作成する方法を学びます。">GET リクエストを作成</Links>します。<Links href="/ktor/client-responses" summary="レスポンスを受信し、レスポンスの本文を取得し、レスポンスパラメータを取得する方法を学びます。">レスポンス</Links>は<code>HttpResponse</code>クラスオブジェクトとして受信されます。
            </p>
            [object Promise]
            <p>
                上記のコードを追加すると、IDEは<code>get()</code>関数に対して以下のエラーを表示します。<emphasis>「Suspend 関数 'get' はコルーチンまたは別の Suspend 関数からのみ呼び出す必要があります。」</emphasis>
            </p>
            <img src="client_get_started_suspend_error.png" alt="Suspend 関数エラー" width="706"/>
            <p>
                これを修正するには、<code>main()</code>関数を suspend 関数にする必要があります。
            </p>
            <tip>
                <code>suspend</code> 関数の呼び出しについて詳しく学ぶには、<a href="https://kotlinlang.org/docs/coroutines-basics.html">コルーチンの基本</a>を参照してください。
            </tip>
        </step>
        <step>
            <p>
                IntelliJ IDEA で、定義の横にある赤い電球をクリックし、<control>main を suspend にする</control>を選択します。
            </p>
            <img src="client_get_started_suspend_error_fix.png" alt="main を suspend にする" width="706"/>
        </step>
        <step>
            <p>
                <code>println()</code>関数を使用してサーバーから返された<a href="#status">ステータスコード</a>を出力し、<code>close()</code>関数を使用してストリームを閉じ、それに関連するリソースを解放します。<Path>Main.kt</Path>ファイルは以下のようになります。
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="アプリケーションを実行する" id="make-request">
    <p>
        アプリケーションを実行するには、<Path>Main.kt</Path>ファイルに移動して以下の手順に従います。
    </p>
    <procedure>
        <step>
            <p>
                IntelliJ IDEA で、<code>main()</code>関数の横にあるガターアイコンをクリックし、<control>「MainKt」を実行</control>を選択します。
            </p>
            <img src="client_get_started_run_main.png" alt="アプリを実行" width="706"/>
        </step>
        <step>
            IntelliJ IDEA がアプリケーションを実行するまで待ちます。
        </step>
        <step>
            <p>
                IDE下部の<control>実行</control>ペインに結果が表示されます。
            </p>
            <img src="client_get_started_run_output_with_warning.png" alt="サーバー応答" width="706"/>
            <p>
                サーバーは<code>200 OK</code>メッセージで応答しますが、SLF4J が<code>StaticLoggerBinder</code>クラスを見つけることができず、no-operation（NOP）ロガー実装にフォールバックしたことを示すエラーメッセージも表示されます。これは、実質的にロギングが無効になっていることを意味します。
            </p>
            <p>
                これで動作するクライアントアプリケーションができました。ただし、この警告を修正し、ロギングを使用して HTTP 呼び出しをデバッグできるようにするには、<a href="#enable-logging">追加の手順</a>が必要です。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="ロギングを有効にする" id="enable-logging">
    <p>
        Ktor は JVM でロギングに SLF4J 抽象化レイヤーを使用するため、ロギングを有効にするには、<a href="#jvm">Logback</a>のようなロギングフレームワークを提供する必要があります。
    </p>
    <procedure id="enable-logging-procedure">
        <step>
            <p>
                <Path>gradle.properties</Path>ファイルで、ロギングフレームワークのバージョンを指定します。
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>build.gradle.kts</Path>ファイルを開き、依存関係ブロックに以下のアーティファクトを追加します。
            </p>
            [object Promise]
        </step>
        <step>
            <control>Gradle の変更をロード</control>アイコンをクリックして、新しく追加された依存関係をインストールします。
        </step>
        <step>
<p>
    IntelliJ IDEA で、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 再実行アイコン"/>）をクリックしてアプリケーションを再起動します。
</p>
        </step>
        <step>
            <p>
                エラーは表示されなくなりますが、IDE下部の<control>実行</control>ペインには同じ<code>200 OK</code>メッセージが表示されます。
            </p>
            <img src="client_get_started_run_output.png" alt="サーバー応答" width="706"/>
            <p>
                これでロギングが有効になりました。ログを表示するには、ロギング設定を追加する必要があります。
            </p>
        </step>
        <step>
            <p><Path>src/main/resources</Path>に移動し、新しい<Path>logback.xml</Path>ファイルを作成して以下の実装を追加します。
            </p>
            [object Promise]
        </step>
        <step>
<p>
    IntelliJ IDEA で、再実行ボタン（<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 再実行アイコン"/>）をクリックしてアプリケーションを再起動します。
</p>
        </step>
        <step>
            <p>
                これで、<control>実行</control>ペイン内の出力されたレスポンスの上にトレースログが表示されるはずです。
            </p>
            <img src="client_get_started_run_output_with_logs.png" alt="サーバー応答" width="706"/>
        </step>
    </procedure>
    <tip>
        Ktor は、<Links href="/ktor/client-logging" summary="必要な依存関係: io.ktor:ktor-client-logging
    コード例:
        %example_name%">Logging</Links>プラグインを介して HTTP 呼び出しのログを追加するシンプルで直接的な方法を提供しますが、設定ファイルを追加することで、複雑なアプリケーションでのロギング動作を細かく調整できます。
    </tip>
</chapter>
<chapter title="次のステップ" id="next-steps">
    <p>
        この設定をよりよく理解し、拡張するには、<Links href="/ktor/client-create-and-configure" summary="Ktor クライアントの作成と設定方法について学びます。">Ktor クライアントの作成と設定</Links>方法を調べてください。
    </p>
</chapter>