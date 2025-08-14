```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="client-websockets" title="Ktor ClientにおけるWebSockets">
    <show-structure for="chapter" depth="3"/>
    <primary-label ref="client-plugin"/>
    <var name="example_name" value="client-websockets"/>
    <var name="artifact_name" value="ktor-client-websockets"/>
    <tldr>
        <p>
            <b>必要な依存関係</b>: <code>io.ktor:ktor-client-websockets</code>
        </p>
    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        Websocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。
    </link-summary>
    <snippet id="websockets-description">
WebSocketは、単一のTCP接続を介してユーザーのブラウザとサーバー間で全二重通信セッションを提供するプロトコルです。特に、サーバーとの間でリアルタイムデータ転送を必要とするアプリケーションの作成に役立ちます。Ktorは、サーバー側とクライアント側の両方でWebSocketプロトコルをサポートしています。
</snippet>
    <p>クライアント向けのWebsocketsプラグインを使用すると、サーバーとのメッセージ交換のためのWebSocketセッションを処理できます。</p>
    <note>
        <p>すべてのエンジンがWebSocketsをサポートしているわけではありません。サポートされているエンジンの概要については、「<a href="client-engines.md#limitations">制限事項</a>」を参照してください。</p>
    </note>
    <tip>
        <p>サーバー側のWebSocketサポートについては、「<Links href="/ktor/server-websockets" summary="Websocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。">KtorサーバーにおけるWebSockets</Links>」を参照してください。</p>
    </tip>
    <chapter title="依存関係を追加" id="add_dependencies">
        <p><code>WebSockets</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。</p>
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
    <p>
        Ktorクライアントで必要となるアーティファクトについては、「<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法について学びます。">クライアントの依存関係の追加</Links>」から詳しく学ぶことができます。
    </p>
    </chapter>
    <chapter title="WebSocketsのインストール" id="install_plugin">
        <p><code>WebSockets</code>プラグインをインストールするには、<a href="#configure-client">クライアント設定ブロック</a>内で<code>install</code>関数に渡します。</p>
        [object Promise]
    </chapter>
    <chapter title="設定" id="configure_plugin">
        <p>オプションとして、<code>install</code>ブロック内でプラグインを設定するには、
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/-web-sockets/-config/index.html">WebSockets.Config</a>でサポートされているプロパティを渡します。
        </p>
        <deflist>
            <def id="maxFrameSize">
                <title><code>maxFrameSize</code></title>
                送受信できる<code>Frame</code>の最大サイズを設定します。
            </def>
            <def id="contentConverter">
                <title><code>contentConverter</code></title>
                シリアライズ/デシリアライズ用のコンバーターを設定します。
            </def>
            <def id="pingIntervalMillis">
                <title><code>pingIntervalMillis</code></title>
                <code>Long</code>形式でPing間の期間を指定します。
            </def>
            <def id="pingInterval">
                <title><code>pingInterval</code></title>
                <code>Duration</code>形式でPing間の期間を指定します。
            </def>
        </deflist>
        <warning>
            <p><code>pingInterval</code>および<code>pingIntervalMillis</code>プロパティは、OkHttpエンジンには適用されません。OkHttpのPing間隔を設定するには、
                <a href="#okhttp">エンジン設定</a>を使用できます。
            </p>
            [object Promise]
        </warning>
        <p>
            以下の例では、WebSocketsプラグインが20秒（<code>20_000</code>ミリ秒）のPing間隔で構成されており、Pingフレームを自動的に送信してWebSocket接続を維持します。
        </p>
        [object Promise]
    </chapter>
    <chapter title="WebSocketセッションの操作" id="working-wtih-session">
        <p>クライアントのWebSocketセッションは、
            <a href="https://api.ktor.io/ktor-shared/ktor-websockets/io.ktor.websocket/-default-web-socket-session/index.html">DefaultClientWebSocketSession</a>インターフェースによって表現されます。このインターフェースは、WebSocketフレームの送受信、およびセッションのクローズを可能にするAPIを公開しています。
        </p>
        <chapter title="WebSocketセッションへのアクセス" id="access-session">
            <p>
                <code>HttpClient</code>は、WebSocketセッションにアクセスするための2つの主要な方法を提供します。
            </p>
            <list>
                <li>
                    <p><a
                            href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket.html">webSocket()</a>関数は、<code>DefaultClientWebSocketSession</code>をブロック引数として受け入れます。</p>
                    [object Promise]
                </li>
                <li>
                    <a
                        href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.websocket/web-socket-session.html">webSocketSession()</a>関数は、<code>DefaultClientWebSocketSession</code>インスタンスを返し、<code>runBlocking</code>または<code>launch</code>スコープ外でセッションにアクセスできます。
                </li>
            </list>
        </chapter>
        <chapter title="WebSocketセッションの処理" id="handle-session">
            <p>関数ブロック内で、指定されたパスのハンドラーを定義します。ブロック内では以下の関数とプロパティが利用可能です。</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    テキストコンテンツをサーバーに送信するには、<code>send()</code>関数を使用します。
                </def>
                <def id="outgoing">
                    <title><code>outgoing</code></title>
                    WebSocketフレームを送信するためのチャネルにアクセスするには、<code>outgoing</code>プロパティを使用します。フレームは<code>Frame</code>クラスで表現されます。
                </def>
                <def id="incoming">
                    <title><code>incoming</code></title>
                    WebSocketフレームを受信するためのチャネルにアクセスするには、<code>incoming</code>プロパティを使用します。フレームは<code>Frame</code>クラスで表現されます。
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    指定された理由でクローズフレームを送信するには、<code>close()</code>関数を使用します。
                </def>
            </deflist>
        </chapter>
        <chapter title="フレームタイプ" id="frame-types">
            <p>
                WebSocketフレームのタイプを検査し、それに応じて処理できます。一般的なフレームタイプは次のとおりです。
            </p>
            <list>
                <li><code>Frame.Text</code>はテキストフレームを表します。そのコンテンツを読み取るには、
                    <code>Frame.Text.readText()</code>を使用します。
                </li>
                <li><code>Frame.Binary</code>はバイナリフレームを表します。そのコンテンツを読み取るには、<code>Frame.Binary.readBytes()</code>
                    を使用します。
                </li>
                <li><code>Frame.Close</code>はクローズフレームを表します。セッションのクローズ理由を取得するには、<code>Frame.Close.readReason()</code>
                    を使用します。
                </li>
            </list>
        </chapter>
        <chapter title="例" id="example">
            <p>以下の例では、<code>echo</code> WebSocketエンドポイントを作成し、サーバーとの間でメッセージを送受信する方法を示します。</p>
            [object Promise]
            <p>完全な例については、
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets">client-websockets</a>を参照してください。
            </p>
        </chapter>
    </chapter>
</topic>