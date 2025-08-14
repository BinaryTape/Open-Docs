<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="ファイルでの設定"
       id="server-configuration-file" help-id="Configuration-file;server-configuration-in-file">
<show-structure for="chapter" depth="2"/>
<link-summary>
    さまざまなサーバーパラメータを構成ファイルで設定する方法を学びます。
</link-summary>
<p>
    Ktor では、ホストアドレスやポート、読み込む<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>など、さまざまなサーバーパラメータを設定できます。
    設定は、サーバーを作成するために使用した方法によって異なります —
    <Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。">
        embeddedServer または EngineMain
    </Links>
    です。
</p>
<p>
    <code>EngineMain</code> の場合、Ktor は
    <a href="https://github.com/lightbend/config/blob/master/HOCON.md">
        HOCON
    </a>
    または YAML 形式を使用する構成ファイルから設定をロードします。この方法は、サーバーを設定するための柔軟性を高め、アプリケーションを再コンパイルせずに設定を変更できるようにします。さらに、コマンドラインからアプリケーションを実行し、対応する
    <a href="#command-line">
        コマンドライン
    </a>
    引数を渡すことで、必要なサーバーパラメータをオーバーライドできます。
</p>
<chapter title="概要" id="configuration-file-overview">
    <p>
        <a href="#engine-main">
            EngineMain
        </a>
        を使用してサーバーを起動する場合、Ktor は
        <Path>resources</Path>
        ディレクトリにある
        <Path>application.*</Path>
        という名前のファイルから自動的に設定をロードします。次の 2 つの構成形式がサポートされています。
    </p>
    <list>
        <li>
            <p>
                HOCON (
                <Path>application.conf</Path>
                )
            </p>
        </li>
        <li>
            <p>
                YAML (
                <Path>application.yaml</Path>
                )
            </p>
            <note>
                <p>
                    YAML 構成ファイルを使用するには、<code>ktor-server-config-yaml</code>
                    <Links href="/ktor/server-dependencies" summary="既存の Gradle/Maven プロジェクトに Ktor サーバーの依存関係を追加する方法を学びます。">
                        依存関係
                    </Links>
                    を追加する必要があります。
                </p>
            </note>
        </li>
    </list>
    <p>
        構成ファイルには、<code>ktor.application.modules</code> プロパティを使用して指定された、少なくとも
        <Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">
            読み込むモジュール
        </Links>
        が含まれている必要があります。例：
    </p>
    <tabs group="config">
        <tab title="application.conf" group-key="hocon" id="application-conf-2">
            [object Promise]
        </tab>
        <tab title="application.yaml" group-key="yaml" id="application-yaml-2">
            [object Promise]
        </tab>
    </tabs>
    <p>
        この場合、Ktor は以下の
        <Path>Application.kt</Path>
        ファイルで <code>Application.module</code> 関数を呼び出します。
    </p>
    [object Promise]
    <p>
        読み込むモジュールに加えて、<a href="#predefined-properties">事前定義された</a>もの (ポートやホスト、SSL 設定など) およびカスタムのものを含む、さまざまなサーバー設定を構成できます。
        いくつかの例を見てみましょう。
    </p>
    <chapter title="基本設定" id="config-basic">
        <p>
            以下の例では、<code>ktor.deployment.port</code> プロパティを使用して、サーバーのリスニングポートを <code>8080</code> に設定しています。
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="application-conf-3">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="application-yaml-3">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="エンジン設定" id="config-engine">
        <snippet id="engine-main-configuration">
            <p>
                <code>EngineMain</code> を使用する場合、<code>ktor.deployment</code> グループ内で、すべてのエンジンに共通のオプションを指定できます。
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="engine-main-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="engine-main-yaml">
                    [object Promise]
                </tab>
            </tabs>
            <chapter title="Netty" id="netty-file">
                <p>
                    構成ファイルの <code>ktor.deployment</code> グループ内で、Netty 固有のオプションも設定できます。
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon" id="application-conf-1">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml" id="application-yaml-1">
                        [object Promise]
                    </tab>
                </tabs>
            </chapter>
        </snippet>
    </chapter>
    <chapter title="SSL 設定" id="config-ssl">
        <p>
            以下の例では、Ktor が <code>8443</code> SSL ポートをリッスンできるようにし、必要な
            <Links href="/ktor/server-ssl" summary="必要な依存関係: io.ktor:ktor-network-tls-certificates
コード例: 
ssl-engine-main, 
ssl-embedded-server">
                SSL 設定
            </Links>
            を個別の <code>security</code> ブロックで指定しています。
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="application-conf">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="application-yaml">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="カスタム設定" id="config-custom">
        <p>
            Ktor では、<a href="#predefined-properties">事前定義されたプロパティ</a>を指定するだけでなく、カスタム設定を構成ファイルに保持できます。
            以下の構成ファイルには、<a href="#jwt-settings">JWT</a> 設定を保持するために使用されるカスタム <code>jwt</code> グループが含まれています。
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="application-conf-4">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="application-yaml-4">
                [object Promise]
            </tab>
        </tabs>
        <p>
            コード内で<a href="#read-configuration-in-code">これらの設定を読み取り、処理</a>できます。
        </p>
        <warning>
            <p>
                シークレットキー、データベース接続設定などの機密データは、構成ファイルに平文で保存しないでください。
                これらのパラメータを指定するには、<a href="#environment-variables">環境変数</a>を使用することを検討してください。
            </p>
        </warning>
    </chapter>
</chapter>
<chapter title="事前定義されたプロパティ" id="predefined-properties">
    <p>
        以下は、<a href="#configuration-file-overview">構成ファイル</a>内で使用できる事前定義された設定のリストです。
    </p>
    <deflist type="wide">
        <def title="ktor.deployment.host" id="ktor-deployment-host">
            <p>
                ホストアドレス。
            </p>
            <p>
                <emphasis>例</emphasis>
                : <code>0.0.0.0</code>
            </p>
        </def>
        <def title="ktor.deployment.port" id="ktor-deployment-port">
            <p>
                リスニングポート。このプロパティを <code>0</code> に設定すると、ランダムなポートでサーバーが実行されます。
            </p>
            <p>
                <emphasis>例</emphasis>
                : <code>8080</code>、<code>0</code>
            </p>
        </def>
        <def title="ktor.deployment.sslPort" id="ktor-deployment-ssl-port">
            <p>
                リスニング SSL ポート。このプロパティを <code>0</code> に設定すると、ランダムなポートでサーバーが実行されます。
            </p>
            <p>
                <emphasis>例</emphasis>
                : <code>8443</code>、<code>0</code>
            </p>
            <note>
                <p>
                    SSL には、<a href="#ssl">以下にリストされている</a>追加のオプションが必要です。
                </p>
            </note>
        </def>
        <def title="ktor.deployment.watch" id="ktor-deployment-watch">
            <p>
                <a href="#watch-paths">自動リロード</a>に使用される監視パス。
            </p>
        </def>
        <def title="ktor.deployment.rootPath" id="ktor-deployment-root-path">
            <p>
                <Links href="/ktor/server-war" summary="WAR アーカイブを使用してサーブレットコンテナ内で Ktor アプリケーションを実行およびデプロイする方法を学びます。">サーブレット</Links>コンテキストパス。
            </p>
            <p>
                <emphasis>例</emphasis>
                : <code>/</code>
            </p>
        </def>
        <def title="ktor.deployment.shutdown.url" id="ktor-deployment-shutdown-url">
            <p>
                シャットダウン URL。
                このオプションは<Links href="/ktor/server-shutdown-url" summary="コード例:
            %example_name%">シャットダウン URL</Links>プラグインを使用することに注意してください。
            </p>
        </def>
        <def title="ktor.deployment.shutdownGracePeriod" id="ktor-deployment-shutdown-grace-period">
            <p>
                サーバーが新しいリクエストの受け入れを停止するまでの最大時間 (ミリ秒)。
            </p>
        </def>
        <def title="ktor.deployment.shutdownTimeout" id="ktor-deployment-shutdown-timeout">
            <p>
                サーバーが完全に停止するまで待機する最大時間 (ミリ秒)。
            </p>
        </def>
        <def title="ktor.deployment.callGroupSize" id="ktor-deployment-call-group-size">
            <p>
                アプリケーションコールを処理するために使用されるスレッドプールの最小サイズ。
            </p>
        </def>
        <def title="ktor.deployment.connectionGroupSize" id="ktor-deployment-connection-group-size">
            <p>
                新しい接続を受け入れ、コール処理を開始するために使用されるスレッド数。
            </p>
        </def>
        <def title="ktor.deployment.workerGroupSize" id="ktor-deployment-worker-group-size">
            <p>
                接続の処理、メッセージの解析、エンジンの内部作業を行うためのイベントグループのサイズ。
            </p>
        </def>
    </deflist>
    <p id="ssl">
        <code>ktor.deployment.sslPort</code> を設定した場合、以下の
        <Links href="/ktor/server-ssl" summary="必要な依存関係: io.ktor:ktor-network-tls-certificates
コード例: 
ssl-engine-main, 
ssl-embedded-server">
            SSL 固有
        </Links>
        のプロパティを指定する必要があります。
    </p>
    <deflist type="wide">
        <def title="ktor.security.ssl.keyStore" id="ktor-security-ssl-keystore">
            <p>
                SSL キーストア。
            </p>
        </def>
        <def title="ktor.security.ssl.keyAlias" id="ktor-security-ssl-key-alias">
            <p>
                SSL キーストアのエイリアス。
            </p>
        </def>
        <def title="ktor.security.ssl.keyStorePassword" id="ktor-security-ssl-keystore-password">
            <p>
                SSL キーストアのパスワード。
            </p>
        </def>
        <def title="ktor.security.ssl.privateKeyPassword" id="ktor-security-ssl-private-key-password">
            <p>
                SSL プライベートキーのパスワード。
            </p>
        </def>
    </deflist>
</chapter>
<chapter title="環境変数" id="environment-variables">
    <p>
        構成ファイルでは、<code>${ENV}</code> / <code>$ENV</code> 構文を使用してパラメータを環境変数に置き換えることができます。
        たとえば、次のように <code>PORT</code> 環境変数を <code>ktor.deployment.port</code> プロパティに割り当てることができます。
    </p>
    <tabs group="config">
        <tab title="application.conf" group-key="hocon" id="env-var-conf">
            [object Promise]
        </tab>
        <tab title="application.yaml" group-key="yaml" id="env-var-yaml">
            [object Promise]
        </tab>
    </tabs>
    <p>
        この場合、環境変数の値がリスニングポートの指定に使用されます。
        実行時に <code>PORT</code> 環境変数が存在しない場合は、次のようにデフォルトのポート値を指定できます。
    </p>
    <tabs group="config">
        <tab title="application.conf" group-key="hocon" id="config-conf">
            [object Promise]
        </tab>
        <tab title="application.yaml" group-key="yaml" id="config-yaml">
            [object Promise]
        </tab>
    </tabs>
</chapter>
<chapter title="コードでの設定の読み込み" id="read-configuration-in-code">
    <p>
        Ktor では、構成ファイル内で指定されたプロパティ値にコードからアクセスできます。
        たとえば、<code>ktor.deployment.port</code> プロパティを指定した場合...
    </p>
    <tabs group="config">
        <tab title="application.conf" group-key="hocon" id="config-conf-1">
            [object Promise]
        </tab>
        <tab title="application.yaml" group-key="yaml" id="config-yaml-1">
            [object Promise]
        </tab>
    </tabs>
    <p>
        ...<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html">
        ApplicationEnvironment.config
    </a> を使用してアプリケーションの設定にアクセスし、次のように必要なプロパティ値を取得できます。
    </p>
    [object Promise]
    <p>
        これは、構成ファイルに<a href="#custom-property">カスタム設定</a>を保持し、その値にアクセスする必要がある場合に特に役立ちます。
    </p>
</chapter>
<chapter title="コマンドライン" id="command-line">
    <p>
        <a href="#engine-main">EngineMain</a> を使用してサーバーを作成する場合、コマンドラインから<Links href="/ktor/server-fatjar" summary="Ktor Gradle プラグインを使用して実行可能な fat JAR を作成および実行する方法を学びます。">パッケージ化されたアプリケーション</Links>を実行し、対応するコマンドライン引数を渡すことで、必要なサーバーパラメータをオーバーライドできます。たとえば、構成ファイルで指定されたポートを次のようにオーバーライドできます。
    </p>
    [object Promise]
    <p>
        利用可能なコマンドラインオプションは以下のとおりです。
    </p>
    <deflist type="narrow">
        <def title="-jar" id="jar">
            <p>
                JAR ファイルへのパス。
            </p>
        </def>
        <def title="-config" id="config">
            <p>
                リソースからの
                <Path>application.conf</Path>
                /
                <Path>application.yaml</Path>
                の代わりに使用されるカスタム構成ファイルへのパス。
            </p>
            <p>
                <emphasis>例</emphasis>
                : <code>java -jar sample-app.jar -config=anotherfile.conf</code>
            </p>
            <p>
                <emphasis>注</emphasis>
                : 複数の値を渡すことができます。<code>java -jar sample-app.jar -config=config-base.conf
                -config=config-dev.conf</code>。この場合、すべての構成がマージされ、右側の構成の値が優先されます。
            </p>
        </def>
        <def title="-host" id="host">
            <p>
                ホストアドレス。
            </p>
        </def>
        <def title="-port" id="port">
            <p>
                リスニングポート。
            </p>
        </def>
        <def title="-watch" id="watch">
            <p>
                <a href="#watch-paths">自動リロード</a>に使用される監視パス。
            </p>
        </def>
    </deflist>
    <p>
        <Links href="/ktor/server-ssl" summary="必要な依存関係: io.ktor:ktor-network-tls-certificates
コード例: 
ssl-engine-main, 
ssl-embedded-server">SSL 固有</Links>のオプション:
    </p>
    <deflist type="narrow">
        <def title="-sslPort" id="ssl-port">
            <p>
                リスニング SSL ポート。
            </p>
        </def>
        <def title="-sslKeyStore" id="ssl-keystore">
            <p>
                SSL キーストア。
            </p>
        </def>
    </deflist>
    <p>
        対応するコマンドラインオプションがない<a href="#predefined-properties">事前定義されたプロパティ</a>をオーバーライドする必要がある場合は、たとえば次のように <code>-P</code> フラグを使用します。
    </p>
    [object Promise]
    <p>
        <code>-P</code> フラグを使用して<a href="#config-custom">カスタムプロパティ</a>をオーバーライドすることもできます。
    </p>
</chapter>
<chapter title="例: カスタムプロパティを使用して環境を指定する方法" id="custom-property">
    <p>
        サーバーがローカルで実行されているか、本番環境で実行されているかによって、異なる処理を実行したい場合があります。これを実現するには、<Path>application.conf</Path> / <Path>application.yaml</Path> にカスタムプロパティを追加し、サーバーがローカルまたは本番環境で実行されているかによって値が異なる専用の<a href="#environment-variables">環境変数</a>で初期化します。以下の例では、<code>KTOR_ENV</code> 環境変数がカスタムの <code>ktor.environment</code> プロパティに割り当てられています。
    </p>
    <tabs group="config">
        <tab title="application.conf" group-key="hocon" id="application-conf-5">
            [object Promise]
        </tab>
        <tab title="application.yaml" group-key="yaml" id="application-yaml-5">
            [object Promise]
        </tab>
    </tabs>
    <p>
        <a href="#read-configuration-in-code">
            コードで設定を読み取る
        </a>
        ことで、実行時に <code>ktor.environment</code> の値にアクセスし、必要なアクションを実行できます。
    </p>
    [object Promise]
    <p>
        完全な例は次の場所にあります。
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-custom-environment">
            engine-main-custom-environment
        </a>。
    </p>
</chapter>