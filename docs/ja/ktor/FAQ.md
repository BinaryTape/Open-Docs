```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="FAQ"
       id="FAQ">
    <chapter title="Ktorの正しい発音は何ですか？" id="pronounce">
        <p>
            <emphasis>/keɪ-tor/</emphasis>
        </p>
    </chapter>
    <chapter title='「Ktor」という名前は何を意味しますか？' id="name-meaning">
        <p>
            Ktorという名前は、`ctor`（コンストラクター）の略語に、Kotlinの「K」が最初の文字として置き換えられたものです。
        </p>
    </chapter>
    <chapter title="質問、バグ報告、連絡、貢献、フィードバックなどはどのように行えばよいですか？" id="feedback">
        <p>
            利用可能なサポートチャネルの詳細については、<a href="https://ktor.io/support/">サポート</a>ページをご覧ください。
            Ktorへの貢献方法については、<a href="https://github.com/ktorio/ktor/blob/main/CONTRIBUTING.md">貢献方法</a>ガイドで説明されています。
        </p>
    </chapter>
    <chapter title="CIOとは何を意味しますか？" id="cio">
        <p>
            CIOは<emphasis>Coroutine-based I/O</emphasis>（コルーチンベースI/O）の略です。
            通常、Kotlinとコルーチンを使用して、外部のJVMベースライブラリに依存せずに、IETF RFCまたは他のプロトコルを実装するロジックを実装するエンジンを指します。
        </p>
    </chapter>
    <chapter title="解決されていない（赤色の）Ktorインポートを修正するには？" id="ktor-artifact">
        <p>
            対応する<Links href="/ktor/server-dependencies" summary="既存のGradle/MavenプロジェクトにKtor Serverの依存関係を追加する方法を学びます。">Ktorアーティファクト</Links>がビルドスクリプトに追加されていることを確認してください。
        </p>
    </chapter>
    <chapter
            title="KtorはIPCシグナル（例：SIGTERMやSIGINT）をキャッチし、サーバーのシャットダウンを適切に処理する方法を提供しますか？"
            id="sigterm">
        <p>
            <a href="#engine-main">EngineMain</a>を実行している場合、自動的に処理されます。
            それ以外の場合は、<a
                href="https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-cio/jvmAndNix/src/io/ktor/server/cio/EngineMain.kt#L21">手動で処理する</a>必要があります。
            JVMの機能である`Runtime.getRuntime().addShutdownHook`を使用できます。
        </p>
    </chapter>
    <chapter title="プロキシの背後にあるクライアントのIPアドレスを取得するにはどうすればよいですか？" id="proxy-ip">
        <p>
            プロキシが適切なヘッダーを提供し、<Links href="/ktor/server-forward-headers" summary="必須の依存関係: io.ktor:%artifact_name%
        コード例:
            %example_name%
        ネイティブサーバーのサポート: ✅">ForwardedHeader</Links>プラグインがインストールされている場合、`call.request.origin`プロパティは元の呼び出し元（プロキシ）に関する<a href="#request_information">接続情報</a>を提供します。
        </p>
    </chapter>
    <chapter title="mainブランチの最新コミットをテストするにはどうすればよいですか？" id="bleeding-edge">
        <p>
            Ktorのナイトリービルドを`jetbrains.space`から取得できます。
            詳細は<a href="https://ktor.io/eap/">早期アクセスプログラム</a>でご確認ください。
        </p>
    </chapter>
    <chapter title="使用しているKtorのバージョンをどのように確認できますか？" id="ktor-version-used">
        <p>
            <Links href="/ktor/server-default-headers" summary="必須の依存関係: io.ktor:%artifact_name%
        ネイティブサーバーのサポート: ✅">DefaultHeaders</Links>プラグインを使用すると、Ktorのバージョンを含む`Server`応答ヘッダーが送信されます（例：
        </p>
        [object Promise]
    </chapter>
    <chapter title="ルートが実行されません。どのようにデバッグすればよいですか？" id="route-not-executing">
        <p>
            Ktorはルーティングの決定に関するトラブルシューティングを支援するトレースメカニズムを提供します。
            <a href="#trace_routes">ルートのトレース</a>セクションを確認してください。
        </p>
    </chapter>
    <chapter title="「Response has already been sent」を解決するには？" id="response-already-sent">
        <p>
            これは、あなた、またはプラグインやインターセプターがすでに`call.respond*`関数を呼び出しており、それを再度呼び出していることを意味します。
        </p>
    </chapter>
    <chapter title="Ktorイベントを購読するにはどうすればよいですか？" id="ktor-events">
        <p>
            詳細は<Links href="/ktor/server-events" summary="コード例:
            %example_name%">アプリケーション監視</Links>ページをご覧ください。
        </p>
    </chapter>
    <chapter title="「No configuration setting found for key ktor」を解決するには？" id="cannot-find-application-conf">
        <p>
            これはKtorが<Links href="/ktor/server-configuration-file" summary="設定ファイルで様々なサーバーパラメータを設定する方法を学びます。">設定ファイル</Links>を見つけられなかったことを意味します。
            `resources`フォルダーに設定ファイルがあり、その`resources`フォルダーが適切にマークされていることを確認してください。
            基本となる動作するプロジェクトを持つには、<a href="https://start.ktor.io/">Ktorプロジェクトジェネレーター</a>または
            <a href="https://plugins.jetbrains.com/plugin/16008-ktor">IntelliJ IDEA Ultimate用Ktorプラグイン</a>を使用してプロジェクトをセットアップすることを検討してください。詳細については、<Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びます。">新しいKtorプロジェクトの作成、オープン、実行</Links>をご覧ください。
        </p>
    </chapter>
    <chapter title="KtorをAndroidで使用できますか？" id="android-support">
        <p>
            はい、Ktorサーバーとクライアントは、少なくともNettyエンジンを使用した場合、Android 5 (API 21)以降で動作することが知られています。
        </p>
    </chapter>
    <chapter title="「CURL -I」が「404 Not Found」を返すのはなぜですか？" id="curl-head-not-found">
        <p>
            `CURL -I`は`HEAD`リクエストを実行する`CURL --head`のエイリアスです。
            デフォルトでは、Ktorは`GET`ハンドラーに対する`HEAD`リクエストを処理しません。
            この機能を有効にするには、<Links href="/ktor/server-autoheadresponse" summary="%plugin_name%は、GETが定義されているすべてのルートに対してHEADリクエストに自動的に応答する機能を提供します。">AutoHeadResponse</Links>プラグインをインストールしてください。
        </p>
    </chapter>
    <chapter title="「HttpsRedirect」プラグイン使用時に無限リダイレクトを解決するには？" id="infinite-redirect">
        <p>
            最も可能性の高い原因は、バックエンドがリバースプロキシまたはロードバランサーの背後にあり、その中間者がバックエンドに通常のHTTPリクエストを行っているため、Ktorバックエンド内の`HttpsRedirect`プラグインがそれを通常のHTTPリクエストと判断してリダイレクトで応答していることです。
        </p>
        <p>
            通常、リバースプロキシは元々のリクエストを記述するヘッダー（HTTPSであったか、元のIPアドレスなど）を送信し、それらのヘッダーを解析するための<Links href="/ktor/server-forward-headers" summary="必須の依存関係: io.ktor:%artifact_name%
        コード例:
            %example_name%
        ネイティブサーバーのサポート: ✅">ForwardedHeader</Links>プラグインがあります。これにより、<Links href="/ktor/server-https-redirect" summary="必須の依存関係: io.ktor:%artifact_name%
        コード例:
            %example_name%
        ネイティブサーバーのサポート: ✅">HttpsRedirect</Links>プラグインは元のリクエストがHTTPSであったことを認識します。
        </p>
    </chapter>
    <chapter title="Kotlin/Nativeで対応するエンジンを使用するためにWindowsに「curl」をインストールするには？" id="native-curl">
        <p>
            <a href="#curl">Curl</a>クライアントエンジンを使用するには、`curl`ライブラリのインストールが必要です。
            Windowsでは、MinGW/MSYS2 `curl`バイナリを検討すると良いでしょう。
        </p>
        <procedure>
            <step>
                <p>
                    <a href="https://www.msys2.org/">MinGW/MSYS2</a>に記載されているとおりにMinGW/MSYS2をインストールします。
                </p>
            </step>
            <step>
                <p>
                    以下のコマンドを使用して`libcurl`をインストールします。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    MinGW/MSYS2をデフォルトの場所にインストールした場合は、
                    <Path>C:\msys64\mingw64\bin\</Path>
                    を`PATH`環境変数に追加します。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="「NoTransformationFoundException」を解決するには？" id="no-transformation-found-exception">
        <p>
            <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.call/-no-transformation-found-exception/index.html">NoTransformationFoundException</a>は、<b>結果の</b>型からクライアントが<b>期待する</b>型への、<i>受信したボディ</i>に対する適切な変換が見つからないことを表します。
        </p>
        <procedure>
            <step>
                <p>
                    リクエストの`Accept`ヘッダーが目的のコンテンツタイプを指定していること、およびサーバーの応答の`Content-Type`ヘッダーがクライアント側で期待されるタイプと一致していることを確認してください。
                </p>
            </step>
            <step>
                <p>
                    作業している特定のコンテンツタイプに必要なコンテンツ変換を登録します。
                </p>
                <p>
                    クライアント側には<a href="https://ktor.io/docs/serialization-client.html">ContentNegotiation</a>プラグインを使用できます。
                    このプラグインを使用すると、異なるコンテンツタイプに対してデータをシリアライズおよびデシリアライズする方法を指定できます。
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    必要なプラグインがすべてインストールされていることを確認してください。不足している可能性のある機能:
                </p>
                <list type="bullet">
                    <li>クライアントの<a href="https://ktor.io/docs/websocket-client.html">WebSockets</a>と
                        サーバーの<a href="https://ktor.io/docs/websocket.html">WebSockets</a></li>
                    <li>クライアントの<a href="https://ktor.io/docs/serialization-client.html">ContentNegotiation</a>と
                        サーバーの<a href="https://ktor.io/docs/serialization.html">ContentNegotiation</a></li>
                    <li><a href="https://ktor.io/docs/compression.html">Compression</a></li>
                </list>
            </step>
        </procedure>
    </chapter>
</topic>