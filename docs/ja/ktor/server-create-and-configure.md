<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="サーバーの作成"
       id="server-create-and-configure" help-id="start_server;create_server">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">engine-main-yaml</a>
    </p>
</tldr>
<link-summary>
    アプリケーションのデプロイ要件に応じて、サーバーを作成する方法を学びます。
</link-summary>
<p>
    Ktorアプリケーションを作成する前に、アプリケーションがどのように
    <Links href="/ktor/server-deployment" summary="コード例: %example_name%">
        デプロイされるか
    </Links>
    を考慮する必要があります。
</p>
<list>
    <li>
        <p>
            <control><a href="#embedded">自己完結型パッケージ</a></control>として
        </p>
        <p>
            この場合、ネットワークリクエストを処理するために使用されるアプリケーション
            <Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>
            がアプリケーションの一部である必要があります。アプリケーションは、エンジン設定、接続、およびSSLオプションを制御できます。
        </p>
    </li>
    <li>
        <p>
            <control>
                <a href="#servlet">サーブレット</a>
            </control>として
        </p>
        <p>
            この場合、Ktorアプリケーションは、サーブレットコンテナ（TomcatやJettyなど）内にデプロイでき、コンテナがアプリケーションのライフサイクルと接続設定を制御します。
        </p>
    </li>
</list>
<chapter title="自己完結型パッケージ" id="embedded">
    <p>
        Ktorサーバーアプリケーションを自己完結型パッケージとして提供するには、まずサーバーを作成する必要があります。
        サーバー構成には、さまざまな設定が含まれます。サーバー
        <Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>（Netty、Jettyなど）、
        さまざまなエンジン固有のオプション、ホストとポートの値などです。
        Ktorには、サーバーを作成および実行するための主なアプローチが2つあります。
    </p>
    <list>
        <li>
            <p>
                <code>embeddedServer</code>関数は、
                <a href="#embedded-server">
                    コードでサーバーパラメーターを設定
                </a>
                し、アプリケーションを素早く実行する簡単な方法です。
            </p>
        </li>
        <li>
            <p>
                <code>EngineMain</code>は、サーバーを構成するためのより高い柔軟性を提供します。
                <a href="#engine-main">
                    ファイルでサーバーパラメーターを指定
                </a>
                し、アプリケーションを再コンパイルすることなく構成を変更できます。さらに、コマンドラインからアプリケーションを実行し、対応するコマンドライン引数を渡すことで、必要なサーバーパラメーターをオーバーライドすることもできます。
            </p>
        </li>
    </list>
    <chapter title="コードでの設定" id="embedded-server">
        <p>
            <code>embeddedServer</code>関数は、
            <Links href="/ktor/server-configuration-code" summary="コードでさまざまなサーバーパラメーターを設定する方法を学びます。">コード</Links>でサーバーパラメーターを設定し、アプリケーションを素早く実行する簡単な方法です。以下のコードスニペットでは、
            <Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>
            とポートをパラメーターとして受け取り、サーバーを起動します。以下の例では、<code>Netty</code>エンジンでサーバーを実行し、<code>8080</code>ポートでリッスンします。
        </p>
        [object Promise]
        <p>
            完全な例については、
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">
                embedded-server
            </a>
            を参照してください。
        </p>
    </chapter>
    <chapter title="ファイルでの設定" id="engine-main">
        <p>
            <code>EngineMain</code>は、選択されたエンジンでサーバーを起動し、<Path>resources</Path>ディレクトリに配置された外部
            <Links href="/ktor/server-configuration-file" summary="構成ファイルでさまざまなサーバーパラメーターを設定する方法を学びます。">構成ファイル</Links>で指定された
            <Links href="/ktor/server-modules" summary="モジュールは、ルートをグループ化してアプリケーションを構造化することを可能にします。">アプリケーションモジュール</Links>を読み込みます。
            <Path>application.conf</Path>
            または
            <Path>application.yaml</Path>
            。
            読み込むモジュールの他に、構成ファイルにはさまざまなサーバーパラメーター（以下の例では<code>8080</code>ポート）を含めることができます。
        </p>
        <tabs>
            <tab title="Application.kt" id="application-kt">
                [object Promise]
            </tab>
            <tab title="application.conf" id="application-conf">
                [object Promise]
            </tab>
            <tab title="application.yaml" id="application-yaml">
                [object Promise]
            </tab>
        </tabs>
        <p>
            完全な例については、
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">
                engine-main
            </a>
            と
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">
                engine-main-yaml
            </a>
            を参照してください。
        </p>
    </chapter>
</chapter>
<chapter title="サーブレット" id="servlet">
    <p>
        Ktorアプリケーションは、TomcatやJettyを含むサーブレットコンテナ内で実行およびデプロイできます。
        サーブレットコンテナ内にデプロイするには、
        <Links href="/ktor/server-war" summary="WARアーカイブを使用してKtorアプリケーションをサーブレットコンテナ内で実行およびデプロイする方法を学びます。">WAR</Links>
        アーカイブを生成し、それをWARをサポートするサーバーまたはクラウドサービスにデプロイする必要があります。
    </p>
</chapter>
</topic>