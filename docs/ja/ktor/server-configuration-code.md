<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="コードでの設定"
       id="server-configuration-code" help-id="Configuration-code;server-configuration-in-code">
<show-structure for="chapter"/>
<link-summary>
    コードで様々なサーバーパラメーターを設定する方法を学びます。
</link-summary>
<p>
    Ktorでは、ホストアドレス、ポート、<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">サーバーモジュール</Links>など、様々なサーバーパラメーターをコードで直接設定できます。設定方法は、<Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。">embeddedServerまたはEngineMain</Links>を使用するなど、サーバーをセットアップする方法によって異なります。
</p>
<p>
    <code>embeddedServer</code>を使用すると、目的のパラメーターを関数に直接渡すことでサーバーを設定します。
    <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html">
        <code>embeddedServer</code>
    </a>
    関数は、<Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">サーバーエンジン</Links>、サーバーがリッスンするホストとポート、追加の設定など、サーバー設定のための様々なパラメーターを受け入れます。
</p>
<p>
    このセクションでは、<code>embeddedServer</code>を実行するいくつかの異なる例を見て、サーバーを有利に構成する方法を説明します。
</p>
<chapter title="基本的な設定" id="embedded-basic">
    <p>
        以下のコードスニペットは、Nettyエンジンと<code>8080</code>ポートを使用した基本的なサーバー設定を示しています。
    </p>
    [object Promise]
    <p>
        <code>port</code>パラメーターを<code>0</code>に設定すると、サーバーをランダムなポートで実行できることに注意してください。
        <code>embeddedServer</code>関数はエンジンインスタンスを返すため、<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html">ApplicationEngine.resolvedConnectors</a>関数を使用してコードでポート値を取得できます。
    </p>
</chapter>
<chapter title="エンジン設定" id="embedded-engine">
    <snippet id="embedded-engine-configuration">
        <p>
            <code>embeddedServer</code>関数では、<code>configure</code>パラメーターを使用してエンジン固有のオプションを渡すことができます。このパラメーターには、すべてのエンジンに共通し、<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">ApplicationEngine.Configuration</a>クラスによって公開されるオプションが含まれます。
        </p>
        <p>
            以下の例は、<code>Netty</code>エンジンを使用してサーバーを設定する方法を示しています。<code>configure</code>ブロック内で、ホストとポートを指定するための<code>connector</code>を定義し、様々なサーバーパラメーターをカスタマイズします。
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code>メソッドは、指定されたホスト（<code>127.0.0.1</code>）とポート（<code>8080</code>）を持つコネクタを定義します。
        </p>
        <p>これらのオプションに加えて、他のエンジン固有のプロパティも設定できます。</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty固有のオプションは、<a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">NettyApplicationEngine.Configuration</a>クラスによって公開されます。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty固有のオプションは、<a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">JettyApplicationEngineBase.Configuration</a>クラスによって公開されます。
            </p>
            <p><a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html"><code>configureServer</code></a>ブロック内でJettyサーバーを設定でき、これにより<a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>インスタンスにアクセスできます。
            </p>
            <p>
                <code>idleTimeout</code>プロパティを使用して、接続がクローズされるまでにアイドル状態であることができる期間を指定します。
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO固有のオプションは、<a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">CIOApplicationEngine.Configuration</a>クラスによって公開されます。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>エンジンとしてTomcatを使用する場合、<a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html"><code>configureTomcat</code></a>プロパティを使用してTomcatを設定でき、これにより<a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>インスタンスにアクセスできます。
            </p>
            [object Promise]
        </chapter>
    </snippet>
</chapter>
<chapter title="カスタム環境" id="embedded-custom">
    <p>
        以下の例は、<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">ApplicationEngine.Configuration</a>クラスで表されるカスタム設定を使用して、複数のコネクタエンドポイントを持つサーバーを実行する方法を示しています。
    </p>
    [object Promise]
    <p>
        完全な例については、<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-multiple-connectors">embedded-server-multiple-connectors</a>を参照してください。
    </p>
    <tip>
        <p>
            カスタム環境を使用して<a href="#embedded-server">HTTPSを提供</a>することもできます。
        </p>
    </tip>
</chapter>
<chapter id="command-line" title="コマンドライン設定">
    <p>
        Ktorでは、コマンドライン引数を使用して<code>embeddedServer</code>を動的に設定できます。これは、ポート、ホスト、タイムアウトなどの設定をランタイムで指定する必要がある場合に特に役立ちます。
    </p>
    <p>
        これを実現するには、<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html">CommandLineConfig</a>クラスを使用してコマンドライン引数を設定オブジェクトに解析し、設定ブロック内で渡します。
    </p>
    [object Promise]
    <p>
        この例では、<code>Application.Configuration</code>の<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html"><code>takeFrom()</code></a>関数が、<code>port</code>や<code>host</code>などのエンジン設定値を上書きするために使用されます。
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html"><code>loadCommonConfiguration()</code></a>関数は、タイムアウトなどのルート環境から設定をロードします。
    </p>
    <p>
        サーバーを実行するには、次のように引数を指定します。
    </p>
    [object Promise]
    <tip>
        静的な設定には、設定ファイルまたは環境変数を使用できます。
        詳細については、<a href="#command-line">ファイルでの設定</a>を参照してください。
    </tip>
</chapter>