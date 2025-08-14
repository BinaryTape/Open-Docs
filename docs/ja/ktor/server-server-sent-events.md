<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="server-server-sent-events" title="KtorサーバーにおけるServer-Sent Events" help-id="sse_server">
    <show-structure for="chapter" depth="2"/>
    <primary-label ref="server-plugin"/>
    <var name="plugin_name" value="SSE"/>
    <var name="example_name" value="server-sse"/>
    <var name="package_name" value="io.ktor.server.sse"/>
    <var name="artifact_name" value="ktor-server-sse"/>
    <tldr>
        <p>
            <b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
        </p>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        SSEプラグインを使用すると、サーバーはHTTP接続を介してイベントベースの更新をクライアントに送信できます。
    </link-summary>
    <snippet id="sse-description">
        <p>
            Server-Sent Events (SSE) は、サーバーがHTTP接続を介してクライアントに継続的にイベントをプッシュすることを可能にするテクノロジーです。クライアントがサーバーを繰り返しポーリングすることなく、サーバーがイベントベースの更新を送信する必要がある場合に特に役立ちます。
        </p>
        <p>
            KtorがサポートするSSEプラグインは、サーバーとクライアントの間で一方向の接続を作成するための簡単な方法を提供します。
        </p>
    </snippet>
    <tip>
        <p>クライアント側のサポートのためのSSEプラグインの詳細については、
            <Links href="/ktor/client-server-sent-events" summary="SSEプラグインを使用すると、クライアントはHTTP接続を介してサーバーからイベントベースの更新を受信できます。">SSEクライアントプラグイン</Links>
            を参照してください。
        </p>
    </tip>
    <note>
        <p>
            双方向通信には、<Links href="/ktor/server-websockets" summary="Websocketsプラグインを使用すると、サーバーとクライアントの間で双方向通信セッションを作成できます。">WebSockets</Links>の使用を検討してください。WebSocketsは、WebSocketプロトコルを使用してサーバーとクライアント間の全二重通信を提供します。
        </p>
    </note>
    <chapter title="制限事項" id="limitations">
        <p>
            KtorはSSEレスポンスのデータ圧縮をサポートしていません。
            <Links href="/ktor/server-compression" summary="必須の依存関係: io.ktor:%artifact_name%
        コード例:
            %example_name%
        ネイティブサーバーサポート: ✖️">Compression</Links>プラグインを使用する場合、デフォルトでSSEレスポンスの圧縮はスキップされます。
        </p>
    </chapter>
    <chapter title="依存関係の追加" id="add_dependencies">
    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
    </p>
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    </chapter>
    <chapter title="SSEのインストール" id="install_plugin">
    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>内（これは<code>Application</code>クラスの拡張関数です）。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    </chapter>
    <chapter title="SSEセッションの処理" id="handle-sessions">
        <p>
            <code>SSE</code>プラグインをインストールしたら、SSEセッションを処理するルートを追加できます。
            そのためには、<a href="#define_route">ルーティング</a>ブロック内で<code>sse()</code>関数を呼び出します。SSEルートを設定する方法は2つあります:
        </p>
        <list type="decimal">
            <li>
                <p>特定のURLパスを使用する場合:</p>
                [object Promise]
            </li>
            <li>
                <p>
                    パスを使用しない場合:
                </p>
                [object Promise]
            </li>
        </list>
        <chapter title="SSEセッションブロック" id="session-block">
            <p>
                <code>sse</code>ブロック内では、指定されたパスのハンドラを定義します。これは
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                    <code>ServerSSESession</code>
                </a>
                クラスによって表されます。ブロック内で利用可能な以下の関数とプロパティがあります:</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    <code>ServerSentEvent</code>を作成し、クライアントに送信します。
                </def>
                <def id="call">
                    <title><code>call</code></title>
                    セッションを開始した、関連する受信<code>ApplicationCall</code>。
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    セッションを閉じ、クライアントとの接続を終了します。<code>close()</code>メソッドは、すべての<code>send()</code>操作が完了すると自動的に呼び出されます。
                    <note>
                        <code>close()</code>関数を使用してセッションを閉じても、クライアントに終了イベントは送信されません。セッションを閉じる前にSSEストリームの終了を示すには、<code>send()</code>関数を使用して特定のイベントを送信してください。
                    </note>
                </def>
            </deflist>
        </chapter>
        <chapter title="例: 単一セッションの処理" id="handle-single-session">
            <p>
                以下の例は、<code>/events</code>エンドポイントでSSEセッションを設定し、SSEチャネルを介して6つのイベントをそれぞれ1秒（1000ミリ秒）の間隔で送信する方法を示しています:
            </p>
            [object Promise]
            <p>完全な例については、
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>を参照してください。
            </p>
        </chapter>
        <chapter title="SSEハートビート" id="heartbeat">
            <p>
                ハートビートは、非アクティブ期間中に定期的にイベントを送信することで、SSE接続がアクティブな状態を維持するようにします。セッションがアクティブである限り、サーバーは設定された間隔で指定されたイベントを送信します。
            </p>
            <p>
                ハートビートを有効にして設定するには、SSEルートハンドラ内で
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html">
                    <code>.heartbeat()</code>
                </a>
                関数を使用します:
            </p>
            [object Promise]
            <p>
                この例では、接続を維持するために10ミリ秒ごとにハートビートイベントが送信されます。
            </p>
        </chapter>
        <chapter title="シリアライズ" id="serialization">
            <p>
                シリアライズを有効にするには、SSEルートの<code>serialize</code>パラメータを使用してカスタムシリアライズ関数を提供します。ハンドラ内では、
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                    <code>ServerSSESessionWithSerialization</code>
                </a>
                クラスを使用してシリアライズされたイベントを送信できます:
            </p>
            [object Promise]
            <p>
                この例の<code>serialize</code>関数は、データオブジェクトをJSONに変換し、それを<code>ServerSentEvent</code>の<code>data</code>フィールドに配置する役割を担います。
            </p>
            <p>完全な例については、
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>を参照してください。
            </p>
        </chapter>
    </chapter>
</topic>