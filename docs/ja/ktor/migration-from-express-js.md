<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="ExpressからKtorへの移行"
       id="migration-from-express-js" help-id="express-js;migrating-from-express-js">
    <show-structure for="chapter" depth="2"/>
    <link-summary>このガイドでは、シンプルなKtorアプリケーションを作成、実行、テストする方法を示します。</link-summary>
    <tldr>
        <p>
            <b>コード例</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express">migrating-express</a>
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor">migrating-express-ktor</a>
        </p>
    </tldr>
    <p>
        このガイドでは、基本的なシナリオでExpressアプリケーションをKtorに移行する方法を見ていきます。アプリケーションの生成から最初のアプリケーションの記述、アプリケーション機能を拡張するためのミドルウェアの作成までを扱います。
    </p>
    <chapter title="アプリを生成する" id="generate">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        新しいExpressアプリケーションは、<code>express-generator</code>ツールを使用して生成できます。
                    </p>
                    [object Promise]
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorは、アプリケーションのスケルトンを生成するために以下の方法を提供します。
                    </p>
                    <list>
                        <li>
                            <p>
                                <a href="https://start.ktor.io/">Ktor Project Generator</a> — ウェブベースのジェネレーターを使用します。
                            </p>
                        </li>
                        <li>
                            <p>
                                <a href="https://github.com/ktorio/ktor-cli">
                                    Ktor CLI tool
                                </a> — コマンドラインインターフェースを介して<code>ktor new</code>コマンドでKtorプロジェクトを生成します。
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://www.npmjs.com/package/generator-ktor">
                                    Yeoman generator
                                </a>
                                — プロジェクト設定をインタラクティブに構成し、必要なプラグインを選択します。
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://ktor.io/idea/">IntelliJ IDEA Ultimate</a> — 組み込みのKtorプロジェクトウィザードを使用します。
                            </p>
                        </li>
                    </list>
                    <p>
                        詳細な手順については、「<Links href="/ktor/server-create-a-new-project" summary="Learn how to open, run and test a server application with Ktor.">新しいKtorプロジェクトの作成、オープン、実行</Links>」チュートリアルを参照してください。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="Hello world" id="hello">
        <p>
            このセクションでは、<code>GET</code>リクエストを受け入れ、事前定義されたプレーンテキストで応答する最もシンプルなサーバーアプリケーションを作成する方法を見ていきます。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        以下の例は、サーバーを起動し、ポート
                        <control>3000</control>
                        で接続をリッスンするExpressアプリケーションを示しています。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/1_hello/app.js">1_hello</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorでは、<a href="#embedded-server"><code>embeddedServer</code></a>関数を使用して、コードでサーバーパラメータを設定し、アプリケーションを素早く実行できます。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt">1_hello</a>
                        プロジェクトを参照してください。
                    </p>
                    <p>
                        HOCONまたはYAML形式を使用する<a href="#engine-main">外部設定ファイル</a>でサーバー設定を指定することもできます。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            上記のExpressアプリケーションは、以下のように表示される可能性のある
            <control>Date</control>
            、
            <control>X-Powered-By</control>
            、および
            <control>ETag</control>
            レスポンスヘッダーを追加することに注意してください。
        </p>
        [object Promise]
        <p>
            Ktorで各レスポンスにデフォルトの
            <control>Server</control>
            および
            <control>Date</control>
            ヘッダーを追加するには、<Links href="/ktor/server-default-headers" summary="Required dependencies: io.ktor:%artifact_name%
        Native server support: ✅">DefaultHeaders</Links>プラグインをインストールする必要があります。
            <Links href="/ktor/server-conditional-headers" summary="Required dependencies: io.ktor:%artifact_name%
        Code example:
            %example_name%
        Native server support: ✅">ConditionalHeaders</Links>プラグインは、
            <control>Etag</control>
            レスポンスヘッダーを設定するために使用できます。
        </p>
    </chapter>
    <chapter title="静的コンテンツの提供" id="static">
        <p>
            このセクションでは、ExpressとKtorで画像、CSSファイル、JavaScriptファイルなどの静的ファイルを提供する方法を見ていきます。
            メインの
            <Path>index.html</Path>
            ページと一連のリンクされたアセットを持つ
            <Path>public</Path>
            フォルダがあると仮定します。
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressでは、フォルダ名を
                        <control>express.static</control>
                        関数に渡します。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/2_static/app.js">2_static</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorでは、<a href="#folders"><code>staticFiles()</code></a>関数を使用して、
                        <Path>/</Path>
                        パスへのあらゆるリクエストを
                        <Path>public</Path>
                        物理フォルダにマッピングします。
                        この関数は、
                        <Path>public</Path>
                        フォルダ内のすべてのファイルを再帰的に提供できるようにします。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、<a
                            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt">2_static</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            静的コンテンツを提供する場合、Expressは以下のような複数のレスポンスヘッダーを追加します。
        </p>
        [object Promise]
        <p>
            Ktorでこれらのヘッダーを管理するには、以下のプラグインをインストールする必要があります。
        </p>
        <list>
            <li>
                <p>
                    <control>Accept-Ranges</control>
                    : <Links href="/ktor/server-partial-content" summary="Required dependencies: io.ktor:%artifact_name%
Server example:
download-file,
client example:
client-download-file-range
        Native server support: ✅">PartialContent</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>Cache-Control</control>
                    : <Links href="/ktor/server-caching-headers" summary="Required dependencies: io.ktor:%artifact_name%
        Code example:
            %example_name%
        Native server support: ✅">CachingHeaders</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>ETag</control>
                    と
                    <control>Last-Modified</control>
                    :
                    <Links href="/ktor/server-conditional-headers" summary="Required dependencies: io.ktor:%artifact_name%
        Code example:
            %example_name%
        Native server support: ✅">ConditionalHeaders</Links>
                </p>
            </li>
        </list>
    </chapter>
    <chapter title="ルーティング" id="routing">
        <p>
            <Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">ルーティング</Links>は、特定のHTTPリクエストメソッド（<code>GET</code>、<code>POST</code>など）とパスによって定義される特定のエンドポイントへの受信リクエストを処理できるようにします。
            以下の例は、
            <Path>/</Path>
            パスへの<code>GET</code>および<code>POST</code>リクエストを処理する方法を示しています。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    [object Promise]
                    <tip>
                        <p>
                            <code>POST</code>、<code>PUT</code>、または
                            <code>PATCH</code>リクエストの要求ボディを受信する方法については、未定義のドキュメントを参照してください。
                        </p>
                    </tip>
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            以下の例は、パスごとにルートハンドラーをグループ化する方法を示しています。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressでは、<code>app.route()</code>を使用してルートパスのチェイン可能なルートハンドラーを作成できます。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorは<code>route</code>関数を提供しており、これによりパスを定義し、そのパスに対する動詞をネストされた関数として配置できます。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            どちらのフレームワークも、関連するルートを単一のファイルにグループ化できます。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressは、マウント可能なルートハンドラーを作成するために<code>express.Router</code>クラスを提供します。
                        アプリケーションのディレクトリに
                        <Path>birds.js</Path>
                        ルーターファイルがあると仮定します。
                        このルーターモジュールは、
                        <Path>app.js</Path>
                        に示されているようにアプリケーションにロードできます。
                    </p>
                    <tabs>
                        <tab title="birds.js">
                            [object Promise]
                        </tab>
                        <tab title="app.js">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorでは、<code>Routing</code>型に対する拡張関数を使用して実際のルートを定義するのが一般的なパターンです。
                        以下のサンプル（
                        <Path>Birds.kt</Path>
                        ）は、<code>birdsRoutes</code>拡張関数を定義しています。
                        対応するルートをアプリケーション（
                        <Path>Application.kt</Path>
                        ）に含めるには、<code>routing</code>ブロック内でこの関数を呼び出します。
                    </p>
                    <tabs>
                        <tab title="Birds.kt" id="birds-kt">
                            [object Promise]
                        </tab>
                        <tab title="Application.kt" id="application-kt">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            URLパスを文字列として指定する以外に、Ktorには<Links href="/ktor/server-resources" summary="The Resources plugin allows you to implement type-safe routing.">型安全なルート</Links>を実装する機能が含まれています。
        </p>
    </chapter>
    <chapter title="ルートとクエリパラメーター" id="route-query-param">
        <p>
            このセクションでは、ルートとクエリパラメータにアクセスする方法を示します。
        </p>
        <p>
            ルート（またはパス）パラメータは、URL内のその位置で指定された値をキャプチャするために使用される名前付きのURLセグメントです。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressでルートパラメータにアクセスするには、<code>Request.params</code>を使用できます。
                        たとえば、以下のコードスニペットの<code>req.parameters["login"]</code>は、
                        <Path>/user/admin</Path>
                        パスの場合、
                        <emphasis>admin</emphasis>
                        を返します。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorでは、ルートパラメータは<code>{param}</code>構文を使用して定義されます。
                        ルートハンドラーでルートパラメータにアクセスするには、<code>call.parameters</code>を使用できます。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            以下の表は、クエリ文字列のパラメータにアクセスする方法を比較しています。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressでルートパラメータにアクセスするには、<code>Request.params</code>を使用できます。
                        たとえば、以下のコードスニペットの<code>req.parameters["login"]</code>は、
                        <Path>/user/admin</Path>
                        パスの場合、
                        <emphasis>admin</emphasis>
                        を返します。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorでは、ルートパラメータは<code>{param}</code>構文を使用して定義されます。
                        ルートハンドラーでルートパラメータにアクセスするには、<code>call.parameters</code>を使用できます。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="レスポンスの送信" id="send-response">
        <p>
            前のセクションでは、プレーンテキストコンテンツで応答する方法を既に見てきました。
            JSON、ファイル、およびリダイレクトレスポンスを送信する方法を見ていきましょう。
        </p>
        <chapter title="JSON" id="send-json">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressで適切なコンテンツタイプでJSONレスポンスを送信するには、<code>res.json</code>関数を呼び出します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、<Links href="/ktor/server-serialization" summary="The ContentNegotiation plugin serves two primary purposes: negotiating media types between the client and server and serializing/deserializing the content in a specific format.">ContentNegotiation</Links>プラグインをインストールし、JSONシリアライザーを設定する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            データをJSONにシリアライズするには、<code>@Serializable</code>アノテーション付きのデータクラスを作成する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            その後、<code>call.respond</code>を使用してこのクラスのオブジェクトをレスポンスで送信できます。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="ファイル" id="send-file">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressでファイルで応答するには、<code>res.sendFile</code>を使用します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorは、クライアントにファイルを送信するための<code>call.respondFile</code>関数を提供します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
            <p>
                Expressアプリケーションは、ファイルで応答するときに
                <control>Accept-Ranges</control>
                HTTPレスポンスヘッダーを追加します。
                サーバーはこのヘッダーを使用して、ファイルダウンロードのためのクライアントからの部分的なリクエストのサポートをアドバタイズします。
                Ktorでは、部分的なリクエストをサポートするために<Links href="/ktor/server-partial-content" summary="Required dependencies: io.ktor:%artifact_name%
Server example:
download-file,
client example:
client-download-file-range
        Native server support: ✅">PartialContent</Links>プラグインをインストールする必要があります。
            </p>
        </chapter>
        <chapter title="ファイルの添付" id="send-file-attachment">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            <code>res.download</code>関数は、指定されたファイルを添付ファイルとして転送します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、ファイルを添付ファイルとして転送するために、
                            <control>Content-Disposition</control>
                            ヘッダーを手動で設定する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="リダイレクト" id="redirect">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressでリダイレクトレスポンスを生成するには、<code>redirect</code>関数を呼び出します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、<code>respondRedirect</code>を使用してリダイレクトレスポンスを送信します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="テンプレート" id="templates">
        <p>
            ExpressとKtorの両方で、ビューを扱うためのテンプレートエンジンでの作業が可能です。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        <Path>views</Path>
                        フォルダに以下のPugテンプレートがあると仮定します。
                    </p>
                    [object Promise]
                    <p>
                        このテンプレートで応答するには、<code>res.render</code>を呼び出します。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/6_templates/app.js">6_templates</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        KtorはFreeMarker、Velocityなど、いくつかの<Links href="/ktor/server-templating" summary="Learn how to work with views built with HTML/CSS or JVM template engines.">JVMテンプレートエンジン</Links>をサポートしています。
                        たとえば、アプリケーションリソースに配置されたFreeMarkerテンプレートで応答する必要がある場合は、<code>FreeMarker</code>プラグインをインストールして設定し、<code>call.respond</code>を使用してテンプレートを送信します。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt">6_templates</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="リクエストの受信" id="receive-request">
        <p>
            このセクションでは、さまざまな形式でリクエストボディを受信する方法を示します。
        </p>
        <chapter title="生テキスト" id="receive-raw-text">
            <p>
                以下の<code>POST</code>リクエストは、テキストデータをサーバーに送信します。
            </p>
            [object Promise]
            <p>
                このリクエストのボディをサーバー側でプレーンテキストとして受信する方法を見ていきましょう。
            </p>
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressで受信リクエストボディを解析するには、<code>body-parser</code>を追加する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            <code>post</code>ハンドラーでは、テキストパーサー（<code>bodyParser.text</code>）を渡す必要があります。
                            リクエストボディは<code>req.body</code>プロパティの下で利用可能になります。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、<code>call.receiveText</code>を使用してボディをテキストとして受信できます。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="JSON" id="receive-json">
            <p>
                このセクションでは、JSONボディを受信する方法を見ていきます。
                以下のサンプルは、ボディにJSONオブジェクトを含む<code>POST</code>リクエストを示しています。
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            ExpressでJSONを受信するには、<code>bodyParser.json</code>を使用します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、<Links href="/ktor/server-serialization" summary="The ContentNegotiation plugin serves two primary purposes: negotiating media types between the client and server and serializing/deserializing the content in a specific format.">ContentNegotiation</Links>プラグインをインストールし、<code>Json</code>シリアライザーを設定する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            受信したデータをオブジェクトにデシリアライズするには、データクラスを作成する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            その後、このデータクラスをパラメータとして受け入れる<code>receive</code>メソッドを使用します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="URLエンコード" id="receive-url-encoded">
            <p>
                次に、
                <control>application/x-www-form-urlencoded</control>
                タイプを使用して送信されたフォームデータを受信する方法を見ていきましょう。
                以下のコードスニペットは、フォームデータを含むサンプル<code>POST</code>リクエストを示しています。
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            プレーンテキストやJSONと同様に、Expressは<code>body-parser</code>を必要とします。
                            パーサータイプを<code>bodyParser.urlencoded</code>に設定する必要があります。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、<code>call.receiveParameters</code>関数を使用します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="生データ" id="receive-raw-data">
            <p>
                次のユースケースはバイナリデータの処理です。
                以下のリクエストは、
                <control>application/octet-stream</control>
                と共にPNG画像をサーバーに送信します。
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressでバイナリデータを処理するには、パーサータイプを<code>raw</code>に設定します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorは、バイトシーケンスの非同期読み書きのために<code>ByteReadChannel</code>と<code>ByteWriteChannel</code>を提供します。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive
                                request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="マルチパート" id="receive-multipart">
            <p>
                最後のセクションでは、<emphasis>マルチパート</emphasis>ボディを処理する方法を見ていきましょう。
                以下の<code>POST</code>リクエストは、
                <control>multipart/form-data</control>
                タイプを使用して説明付きのPNG画像を送信します。
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Expressは、マルチパートデータを解析するために別のモジュールを必要とします。
                            以下の例では、
                            <control>multer</control>
                            がファイルをサーバーにアップロードするために使用されています。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktorでは、マルチパートリクエストの一部として送信されたファイルを受信する必要がある場合、<code>receiveMultipart</code>関数を呼び出し、必要に応じて各パートをループします。
                            以下の例では、<code>PartData.FileItem</code>がファイルをバイトストリームとして受信するために使用されています。
                        </p>
                        [object Promise]
                        <p>
                            完全な例については、
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            プロジェクトを参照してください。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="ミドルウェアの作成" id="middleware">
        <p>
            最後に、サーバー機能を拡張できるミドルウェアを作成する方法を見ていきます。
            以下の例は、ExpressとKtorを使用してリクエストロギングを実装する方法を示しています。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Expressでは、ミドルウェアは<code>app.use</code>を使用してアプリケーションにバインドされる関数です。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/8_middleware/app.js">8_middleware</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktorは、<Links href="/ktor/server-custom-plugins" summary="Learn how to create your own custom plugins.">カスタムプラグイン</Links>を使用して機能を拡張できます。
                        以下のコード例は、リクエストロギングを実装するために<code>onCall</code>を処理する方法を示しています。
                    </p>
                    [object Promise]
                    <p>
                        完全な例については、
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt">8_middleware</a>
                        プロジェクトを参照してください。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="次のステップ" id="next">
        <p>
            このガイドではカバーされていないユースケースがまだたくさんあります。
            例えば、セッション管理、認証、データベース統合などです。
            これらの機能のほとんどについて、Ktorは専用のプラグインを提供しており、アプリケーションにインストールして必要に応じて設定できます。
            Ktorでの学習を続けるには、ステップバイステップガイドとすぐに使えるサンプルのセットを提供する
            <control><a href="https://ktor.io/learn/">「Learn」ページ</a></control>
            をご覧ください。
        </p>
    </chapter>
</topic>