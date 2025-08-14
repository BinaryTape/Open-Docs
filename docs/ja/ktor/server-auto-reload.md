```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="オートリロード"
   id="server-auto-reload" help-id="Auto_reload">
<tldr>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">autoreload-embedded-server</a>
    </p>
</tldr>
<link-summary>
    コード変更時にアプリケーションクラスをリロードするオートリロードの使用方法について説明します。
</link-summary>
<p>
    開発中にサーバーを<Links href="/ktor/server-run" summary="サーバーKtorアプリケーションの実行方法を学ぶ。">再起動</Links>するには時間がかかる場合があります。
    Ktorは、<emphasis>オートリロード</emphasis>を使用することでこの制限を克服できます。オートリロードは、コード変更時にアプリケーションクラスをリロードし、高速なフィードバックループを提供します。
    オートリロードを使用するには、以下の手順に従います。
</p>
<list style="decimal">
    <li>
        <p>
            <a href="#enable">開発モードを有効にする</a>
        </p>
    </li>
    <li>
        <p>
            (オプション) <a href="#watch-paths">ウォッチパスを設定する</a>
        </p>
    </li>
    <li>
        <p>
            <a href="#recompile">変更時の再コンパイルを有効にする</a>
        </p>
    </li>
</list>
<chapter title="開発モードを有効にする" id="enable">
    <p>
        オートリロードを使用するには、まず<a href="#enable">開発モード</a>を有効にする必要があります。
        これは、サーバーを<Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学ぶ。">作成して実行</Links>する方法によって異なります。
    </p>
    <list>
        <li>
            <p>
                <code>EngineMain</code>を使用してサーバーを実行する場合、<a href="#application-conf">設定ファイル</a>で開発モードを有効にします。
            </p>
        </li>
        <li>
            <p>
                <code>embeddedServer</code>を使用してサーバーを実行する場合、<a href="#system-property">io.ktor.development</a>システムプロパティを使用できます。
            </p>
        </li>
    </list>
    <p>
        開発モードが有効になっている場合、Ktorはワーキングディレクトリからの出力ファイルを自動的に監視します。
        必要に応じて、<a href="#watch-paths">ウォッチパス</a>を指定することで、監視対象のフォルダのセットを絞り込むことができます。
    </p>
</chapter>
<chapter title="ウォッチパスを設定する" id="watch-paths">
    <p>
        <a href="#enable">開発モードを有効にする</a>と、
        Ktorはワーキングディレクトリからの出力ファイルを監視し始めます。
        例えば、Gradleでビルドされた<Path>ktor-sample</Path>プロジェクトの場合、以下のフォルダが監視されます。
    </p>
    [object Promise]
    <p>
        ウォッチパスを使用すると、監視対象のフォルダのセットを絞り込むことができます。
        これを行うには、監視対象パスの一部を指定します。
        例えば、<Path>ktor-sample/build/classes</Path>サブフォルダ内の変更を監視するには、<code>classes</code>をウォッチパスとして渡します。
        サーバーを実行する方法によって、ウォッチパスを以下の方法で指定できます。
    </p>
    <list>
        <li>
            <p>
                <Path>application.conf</Path>または<Path>application.yaml</Path>ファイルで、<code>watch</code>オプションを指定します。
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                複数のウォッチパスを指定することもできます。例えば、
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                完全な例はこちらで見つけることができます。<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>。
            </p>
        </li>
        <li>
            <p>
                <code>embeddedServer</code>を使用している場合、ウォッチパスを<code>watchPaths</code>パラメータとして渡します。
            </p>
            [object Promise]
            <p>
                完全な例は、
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">
                    autoreload-embedded-server
                </a>
                を参照してください。
            </p>
        </li>
    </list>
</chapter>
<chapter title="変更時に再コンパイルする" id="recompile">
    <p>
        オートリロードは出力ファイル内の変更を検出するため、
        プロジェクトを再ビルドする必要があります。
        これはIntelliJ IDEAで手動で行うか、
        Gradleで<code>-t</code>コマンドラインオプションを使用して継続的なビルド実行を有効にすることで可能です。
    </p>
    <list>
        <li>
            <p>
                IntelliJ IDEAでプロジェクトを手動で再ビルドするには、メインメニューから
                <ui-path>Build | Rebuild Project</ui-path>を選択します。
            </p>
        </li>
        <li>
            <p>
                Gradleを使用してプロジェクトを自動的に再ビルドするには、
                ターミナルで<code>-t</code>オプションを付けて<code>build</code>タスクを実行します。
            </p>
            [object Promise]
            <tip>
                <p>
                    プロジェクトをリロードする際にテストの実行をスキップするには、<code>build</code>タスクに<code>-x</code>オプションを渡すことができます。
                </p>
                [object Promise]
            </tip>
        </li>
    </list>
</chapter>
</topic>