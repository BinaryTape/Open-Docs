<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-server-sent-events" title="Ktorクライアントにおけるサーバー送信イベント" help-id="sse_client">
<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<tldr>
    <var name="example_name" value="client-sse"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    SSEプラグインを使用すると、クライアントはHTTP接続経由でサーバーからイベントベースの更新を受信できます。
</link-summary>
<p>
    サーバー送信イベント (SSE) は、サーバーがHTTP接続経由でクライアントに継続的にイベントをプッシュすることを可能にする技術です。これは、クライアントがサーバーを繰り返しポーリングすることなく、サーバーがイベントベースの更新を送信する必要がある場合に特に役立ちます。
</p>
<p>
    KtorがサポートするSSEプラグインは、サーバーとクライアント間の単方向接続を作成するための簡単な方法を提供します。
</p>
<tip>
    <p>サーバーサイドのSSEプラグインの詳細については、
        <Links href="/ktor/server-server-sent-events" summary="SSEプラグインを使用すると、サーバーはHTTP接続経由でクライアントにイベントベースの更新を送信できます。">SSEサーバープラグイン</Links>
        を参照してください。
    </p>
</tip>
<chapter title="依存関係の追加" id="add_dependencies">
    <p>
        <code>SSE</code> には <Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">ktor-client-core</Links> アーティファクトのみが必要で、特定の依存関係は必要ありません。
    </p>
</chapter>
<chapter title="SSEのインストール" id="install_plugin">
    <p>
        <code>SSE</code> プラグインをインストールするには、<a href="#configure-client">クライアント設定ブロック</a>内で <code>install</code> 関数に渡します。
    </p>
    [object Promise]
</chapter>
<chapter title="SSEプラグインの設定" id="configure">
    <p>
        <code>install</code> ブロック内で、<a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-s-s-e-config/index.html">SSEConfig</a> クラスのサポートされているプロパティを設定することで、SSEプラグインをオプションで設定できます。
    </p>
    <chapter title="SSEの再接続" id="sse-reconnect">
        <tldr>
            <p>️️<code>OkHttp</code> ではサポートされていません</p>
        </tldr>
        <p>
            サポートされているエンジンで自動再接続を有効にするには、<code>maxReconnectionAttempts</code> を <code>0</code> より大きい値に設定します。また、<code>reconnectionTime</code> を使用して試行間の遅延を設定することもできます。
        </p>
        [object Promise]
        <p>
            サーバーへの接続が失われた場合、クライアントは指定された <code>reconnectionTime</code> を待ってから再接続を試みます。指定された <code>maxReconnectionAttempts</code> まで接続を再確立しようとします。
        </p>
    </chapter>
    <chapter title="イベントのフィルタリング" id="filter-events">
        <p>
            次の例では、SSEプラグインがHTTPクライアントにインストールされ、受信フロー内のコメントのみを含むイベントと <code>retry</code> フィールドのみを含むイベントを含めるように設定されています。
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="SSEセッションの処理" id="handle-sse-sessions">
    <p>
        クライアントのSSEセッションは、<a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html">
            <code>ClientSSESession</code>
        </a>
        インターフェースによって表されます。このインターフェースは、サーバーからサーバー送信イベントを受信できるようにするAPIを公開します。
    </p>
    <chapter title="SSEセッションへのアクセス" id="access-sse-session">
        <p><code>HttpClient</code> を使用すると、次のいずれかの方法でSSEセッションにアクセスできます。</p>
        <list>
            <li><a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse.html">
                <code>sse()</code>
            </a>
            関数はSSEセッションを作成し、そのセッションで操作を実行できるようにします。
            </li>
            <li><a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/sse-session.html">
                <code>sseSession()</code>
            </a>
            関数はSSEセッションを開くことができます。
            </li>
        </list>
        <p>URLエンドポイントを指定するには、2つのオプションから選択できます。</p>
        <list>
            <li><code>urlString</code> パラメーターを使用して、URL全体を文字列として指定します。</li>
            <li><code>schema</code>、<code>host</code>、<code>port</code>、および <code>path</code> パラメーターを使用して、それぞれプロトコルスキーム、ドメイン名、ポート番号、およびパス名を指定します。
            </li>
        </list>
        [object Promise]
        <p>オプションで、接続を設定するために次のパラメーターが利用できます。</p>
        <deflist>
            <def id="reconnectionTime-param">
                <title><code>reconnectionTime</code></title>
                再接続遅延を設定します。
            </def>
            <def id="showCommentEvents-param">
                <title><code>showCommentEvents</code></title>
                受信フローにコメントのみを含むイベントを表示するかどうかを指定します。
            </def>
            <def id="showRetryEvents-param">
                <title><code>showRetryEvents</code></title>
                受信フローに <code>retry</code> フィールドのみを含むイベントを表示するかどうかを指定します。
            </def>
            <def id="deserialize-param">
                <title><code>deserialize</code></title>
                <code>TypedServerSentEvent</code> の <code>data</code> フィールドをオブジェクトに変換するためのデシリアライザー関数です。詳細については、未定義を参照してください。
            </def>
        </deflist>
    </chapter>
    <chapter title="SSEセッションブロック" id="sse-session-block">
        <p>
            ラムダ引数内で、<a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session/index.html"><code>ClientSSESession</code></a> コンテキストにアクセスできます。次のプロパティがブロック内で利用可能です。
        </p>
        <deflist>
            <def id="call">
                <title><code>call</code></title>
                セッションの元となった関連する <code>HttpClientCall</code>。
            </def>
            <def id="incoming">
                <title><code>incoming</code></title>
                受信サーバー送信イベントフロー。
            </def>
        </deflist>
        <p>
            以下の例では、<code>events</code> エンドポイントを使用して新しいSSEセッションを作成し、<code>incoming</code> プロパティを通じてイベントを読み取り、受信した
            <a href="https://api.ktor.io/ktor-shared/ktor-sse/io.ktor.sse/-server-sent-event/index.html"><code>ServerSentEvent</code></a>
            を出力します。
        </p>
        [object Promise]
        <p>完全な例については、<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a> を参照してください。
        </p>
    </chapter>
    <chapter title="デシリアライゼーション" id="deserialization">
        <p>
            SSEプラグインは、サーバー送信イベントを型安全なKotlinオブジェクトにデシリアライズする機能をサポートしています。この機能は、サーバーからの構造化データを扱う際に特に役立ちます。
        </p>
        <p>
            デシリアライゼーションを有効にするには、SSEアクセス関数で <code>deserialize</code> パラメーターを使用してカスタムのデシリアライゼーション関数を提供し、
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.sse/-client-s-s-e-session-with-deserialization/index.html">
                <code>ClientSSESessionWithDeserialization</code>
            </a>
            クラスを使用してデシリアライズされたイベントを処理します。
        </p>
        <p>
            以下は、<code>kotlinx.serialization</code> を使用してJSONデータをデシリアライズする例です。
        </p>
        [object Promise]
        <p>完全な例については、<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-sse">client-sse</a> を参照してください。
        </p>
    </chapter>
</chapter>
</topic>