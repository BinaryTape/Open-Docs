<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="server-server-sent-events" title="KtorサーバーでのServer-Sent Events (SSE)" help-id="sse_server">
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
    SSEプラグインを使用すると、サーバーはHTTP接続経由でイベントベースの更新をクライアントに送信できます。
</link-summary>
<snippet id="sse-description">
    <p>
        Server-Sent Events (SSE) は、サーバーがHTTP接続を介してクライアントにイベントを継続的にプッシュできる技術です。クライアントがサーバーを繰り返しポーリングすることなく、サーバーがイベントベースの更新を送信する必要がある場合に特に役立ちます。
    </p>
    <p>
        KtorがサポートするSSEプラグインは、サーバーとクライアント間で一方的な接続を確立するための簡単な方法を提供します。
    </p>
</snippet>
<tip>
    <p>クライアント側のSSEプラグインについては、
        <Links href="/ktor/client-server-sent-events" summary="SSEプラグインを使用すると、クライアントはHTTP接続経由でサーバーからイベントベースの更新を受信できます。">SSEクライアントプラグイン</Links>
        を参照してください。
    </p>
</tip>
<note>
    <p>
        双方向通信には<Links href="/ktor/server-websockets" summary="WebSocketsプラグインを使用すると、サーバーとクライアント間で双方向通信セッションを作成できます。">WebSockets</Links> の使用を検討してください。WebSocketsは、WebSocketプロトコルを使用してサーバーとクライアント間で全二重通信を提供します。
    </p>
</note>
<chapter title="制限事項" id="limitations">
    <p>
        KtorはSSEレスポンスのデータ圧縮をサポートしていません。
        <Links href="/ktor/server-compression" summary="必須の依存関係: io.ktor:%artifact_name% コード例: %example_name% ネイティブサーバーサポート: ✖️">Compression</Links> プラグインを使用している場合、デフォルトでSSEレスポンスの圧縮はスキップされます。
    </p>
</chapter>
<chapter title="依存関係の追加" id="add_dependencies">
    <p>
        <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
    </p>
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="                    implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="                    implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </tab>
        <tab title="Maven" group-key="maven">
            <code-block lang="XML" code="                    &lt;dependency&gt;&#10;                        &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                        &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                        &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;                    &lt;/dependency&gt;"/>
        </tab>
    </tabs>
</chapter>
<chapter title="SSEのインストール" id="install_plugin">
    <p>
        アプリケーションに <code>%plugin_name%</code> プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化することでアプリケーションを構造化できます。">モジュール</Links> の <code>install</code> 関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code> クラスの拡張関数である、明示的に定義された <code>module</code> 内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            <code-block lang="kotlin" code="                    import io.ktor.server.engine.*&#10;                    import io.ktor.server.netty.*&#10;                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;        &#10;                    fun main() {&#10;                        embeddedServer(Netty, port = 8080) {&#10;                            install(%plugin_name%)&#10;                            // ...&#10;                        }.start(wait = true)&#10;                    }"/>
        </tab>
        <tab title="module">
            <code-block lang="kotlin" code="                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;                    // ...&#10;                    fun Application.module() {&#10;                        install(%plugin_name%)&#10;                        // ...&#10;                    }"/>
        </tab>
    </tabs>
</chapter>
<chapter title="SSEセッションの処理" id="handle-sessions">
    <p>
        <code>SSE</code> プラグインをインストールしたら、SSEセッションを処理するためのルートを追加できます。
        そのためには、<a href="#define_route">ルーティング</a> ブロック内で <code>sse()</code> 関数を呼び出します。SSEルートを設定するには、2つの方法があります。
    </p>
    <list type="decimal">
        <li>
            <p>特定のURLパスを使用する場合:</p>
            <code-block lang="kotlin" code="                    routing {&#10;                        sse(&amp;quot;/events&amp;quot;) {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
        </li>
        <li>
            <p>
                パスなしの場合:
            </p>
            <code-block lang="kotlin" code="                    routing {&#10;                        sse {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
        </li>
    </list>
    <chapter title="SSEセッションブロック" id="session-block">
        <p>
            <code>sse</code> ブロック内では、指定されたパスのハンドラを定義します。これは
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                <code>ServerSSESession</code>
            </a>
            クラスで表されます。このブロック内で利用できる関数とプロパティは次のとおりです。
        </p>
        <deflist>
            <def id="send">
                <title><code>send()</code></title>
                <code>ServerSentEvent</code> を作成し、クライアントに送信します。
            </def>
            <def id="call">
                <title><code>call</code></title>
                セッションの起点となった関連する受信 <code>ApplicationCall</code> です。
            </def>
            <def id="close">
                <title><code>close()</code></title>
                セッションを閉じ、クライアントとの接続を終了します。すべての <code>send()</code> 操作が完了すると、<code>close()</code> メソッドが自動的に呼び出されます。
                <note>
                    <code>close()</code> 関数を使用してセッションを閉じても、クライアントに終了イベントは送信されません。セッションを閉じる前にSSEストリームの終了を示すには、<code>send()</code> 関数を使用して特定のイベントを送信します。
                </note>
            </def>
        </deflist>
    </chapter>
    <chapter title="例: 単一セッションの処理" id="handle-single-session">
        <p>
            以下の例では、<code>/events</code> エンドポイントでSSEセッションを設定し、SSEチャネル経由で6つの個別のイベントをそれぞれ1秒（1000ミリ秒）の間隔で送信する方法を示します。
        </p>
        <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/events&quot;) {&#10;            repeat(6) {&#10;                send(ServerSentEvent(&quot;this is SSE #$it&quot;))&#10;                delay(1000)&#10;            }&#10;        }&#10;    }"/>
        <p>完全な例は
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a> を参照してください。
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
            関数を使用します。
        </p>
        <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/heartbeat&quot;) {&#10;            heartbeat {&#10;                period = 10.milliseconds&#10;                event = ServerSentEvent(&quot;heartbeat&quot;)&#10;            }&#10;            // ...&#10;        }&#10;    }"/>
        <p>
            この例では、接続を維持するために10ミリ秒ごとにハートビートイベントが送信されます。
        </p>
    </chapter>
    <chapter title="シリアライズ" id="serialization">
        <p>
            シリアライズを有効にするには、SSEルートの <code>serialize</code> パラメータを使用してカスタムシリアライズ関数を提供します。ハンドラ内で、
            <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                <code>ServerSSESessionWithSerialization</code>
            </a>
            クラスを使用して、シリアライズされたイベントを送信できます。
        </p>
        <code-block lang="kotlin" code="@Serializable&#10;data class Customer(val id: Int, val firstName: String, val lastName: String)&#10;&#10;@Serializable&#10;data class Product(val id: Int, val prices: List&lt;Int&gt;)&#10;&#10;fun Application.module() {&#10;    install(SSE)&#10;&#10;    routing {&#10;        // example with serialization&#10;        sse(&quot;/json&quot;, serialize = { typeInfo, it -&gt;&#10;            val serializer = Json.serializersModule.serializer(typeInfo.kotlinType!!)&#10;            Json.encodeToString(serializer, it)&#10;        }) {&#10;            send(Customer(0, &quot;Jet&quot;, &quot;Brains&quot;))&#10;            send(Product(0, listOf(100, 200)))&#10;        }&#10;    }&#10;}"/>
        <p>
            この例の <code>serialize</code> 関数は、データオブジェクトをJSONに変換し、それを <code>ServerSentEvent</code> の <code>data</code> フィールドに配置する役割を担っています。
        </p>
        <p>完全な例は
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a> を参照してください。
        </p>
    </chapter>
</chapter>
</topic>