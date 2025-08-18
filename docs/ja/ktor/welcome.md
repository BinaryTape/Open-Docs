---
aside: false
---
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="ようこそ"
       id="welcome">
    <section-starting-page>
        <title>Ktorドキュメント</title>
        <description>
            Ktorは、非同期のサーバーサイドおよびクライアントサイドアプリケーションを簡単に構築するためのフレームワークです。
        </description>
        <spotlight>
            <card href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを作成、実行、テストする方法を学びます。">
                Ktorサーバーを始める
            </card>
            <card href="/ktor/client-create-new-application" summary="Ktorでクライアントアプリケーションを作成、実行、テストする方法を学びます。">
                Ktorクライアントを始める
            </card>
        </spotlight>
        <primary>
            <title>Ktorサーバー</title>
            <card href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを作成して、Ktorでのルーティングとリクエストの動作を学びます。">
                リクエストを処理し、レスポンスを生成する
            </card>
            <card href="/ktor/server-create-restful-apis" summary="KtorでRESTful APIを構築する方法を学びます。このチュートリアルでは、実際の例に基づいてセットアップ、ルーティング、テストを扱います。">RESTful APIを作成する</card>
            <card href="/ktor/server-create-website" summary="KtorとThymeleafテンプレートを使用して、Kotlinでウェブサイトを構築する方法を学びます。">ウェブサイトを作成する</card>
            <card href="/ktor/server-create-websocket-application" summary="WebSocketの力を活用してコンテンツを送受信する方法を学びます。">
                WebSocketアプリケーションを作成する
            </card>
            <card href="/ktor/server-integrate-database" summary="KtorサービスをExposed SQLライブラリを使用してデータベースリポジトリに接続するプロセスを学びます。">データベースを統合する</card>
        </primary>
        <misc>
            <links narrow="true">
                <group>
                    <title>サーバー設定</title>
                    <Links href="/ktor/server-create-a-new-project" summary="Ktorでサーバーアプリケーションを開き、実行し、テストする方法を学びます。">新しいKtorプロジェクトを作成、開いて実行する</Links>
                    <Links href="/ktor/server-dependencies" summary="既存のGradle/MavenプロジェクトにKtorサーバーの依存関係を追加する方法を学びます。">サーバーの依存関係を追加する</Links>
                    <Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。">サーバーを作成する</Links>
                    <Links href="/ktor/server-configuration-code" summary="コードで様々なサーバーパラメータを設定する方法を学びます。">コードでの設定</Links>
                    <Links href="/ktor/server-configuration-file" summary="設定ファイルで様々なサーバーパラメータを設定する方法を学びます。">ファイルでの設定</Links>
                    <Links href="/ktor/server-plugins" summary="プラグインは、シリアル化、コンテンツエンコーディング、圧縮などの共通機能を提供します。">サーバープラグイン</Links>
                </group>
                <group>
                    <title>ルーティング</title>
                    <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。">ルーティング</Links>
                    <Links href="/ktor/server-resources" summary="Resourcesプラグインを使用すると、型安全なルーティングを実装できます。">型安全なルーティング</Links>
                    <Links href="/ktor/server-application-structure" summary="アプリケーションの成長に合わせて、保守しやすい構造にする方法を学びます。">アプリケーションの構造</Links>
                    <Links href="/ktor/server-requests" summary="ルートハンドラ内で受信リクエストを処理する方法を学びます。">リクエストの処理</Links>
                    <Links href="/ktor/server-responses" summary="異なる種類のレスポンスを送信する方法を学びます。">レスポンスの送信</Links>
                    <Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツの提供</Links>
                </group>
                <group>
                    <title>プラグイン</title>
                    <Links href="/ktor/server-serialization" summary="ContentNegotiationプラグインには2つの主な目的があります。クライアントとサーバー間のメディアタイプをネゴシエートすることと、特定の形式でコンテンツをシリアル化/デシリアル化することです。">Ktorサーバーでのコンテンツネゴシエーションとシリアル化</Links>
                    <Links href="/ktor/server-templating" summary="HTML/CSSまたはJVMテンプレートエンジンで構築されたビューを操作する方法を学びます。">テンプレート</Links>
                    <Links href="/ktor/server-auth" summary="AuthenticationプラグインはKtorでの認証と認可を処理します。">Ktorサーバーでの認証と認可</Links>
                    <Links href="/ktor/server-sessions" summary="Sessionsプラグインは、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。">セッション</Links>
                    <Links href="/ktor/server-websockets" summary="WebSocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。">KtorサーバーでのWebSockets</Links>
                    <Links href="/ktor/server-server-sent-events" summary="SSEプラグインを使用すると、サーバーはHTTP接続を介してクライアントにイベントベースの更新を送信できます。">KtorサーバーでのServer-Sent Events</Links>
                    <Links href="/ktor/server-swagger-ui" summary="SwaggerUIプラグインを使用すると、プロジェクトのSwagger UIを生成できます。">Swagger UI</Links> / <Links href="/ktor/server-openapi" summary="OpenAPIプラグインを使用すると、プロジェクトのOpenAPIドキュメントを生成できます。">OpenAPI</Links>
                    <Links href="/ktor/server-custom-plugins" summary="独自のカスタムプラグインを作成する方法を学びます。">カスタムサーバープラグイン</Links>
                </group>
                <group>
                    <title>実行、デバッグ、テスト</title>
                    <Links href="/ktor/server-run" summary="Ktorサーバーアプリケーションを実行する方法を学びます。">実行</Links>
                    <Links href="/ktor/server-auto-reload" summary="Auto-reloadを使用して、コード変更時にアプリケーションクラスをリロードする方法を学びます。">自動リロード</Links>
                    <Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">Ktorサーバーでのテスト</Links>
                </group>
                <group>
                    <title>デプロイ</title>
                    <Links href="/ktor/server-fatjar" summary="Ktor Gradleプラグインを使用して、実行可能なfat JARを作成および実行する方法を学びます。">Fat JARの作成</Links>
                    <Links href="/ktor/server-war" summary="WARアーカイブを使用して、サーブレットコンテナ内でKtorアプリケーションを実行およびデプロイする方法を学びます。">WAR</Links>
                    <Links href="/ktor/graalvm" summary="様々なプラットフォームでネイティブイメージにGraalVMを使用する方法を学びます。">GraalVM</Links>
                    <Links href="/ktor/docker" summary="アプリケーションをDockerコンテナにデプロイする方法を学びます。">Docker</Links>
                    <Links href="/ktor/google-app-engine" summary="Google App Engine標準環境にプロジェクトをデプロイする方法を学びます。">Google App Engine</Links>
                    <Links href="/ktor/heroku" summary="HerokuにKtorアプリケーションを準備およびデプロイする方法を学びます。">Heroku</Links>
                </group>
            </links>
            <cards>
                <title>Ktorクライアント</title>
                <card href="/ktor/client-create-new-application" summary="Ktorでクライアントアプリケーションを作成します。">
                    クライアントアプリケーションを作成する
                </card>
                <card href="/ktor/client-create-multiplatform-application" summary="Kotlin Multiplatform Mobileアプリケーションを作成し、Ktorクライアントでリクエストを作成し、レスポンスを受信する方法を学びます。">
                    クロスプラットフォームモバイルアプリケーションを作成する
                </card>
            </cards>
            <links narrow="true">
                <group>
                    <title>クライアントのセットアップ</title>
                    <Links href="/ktor/client-create-new-application" summary="リクエストを送信し、レスポンスを受信するための最初のクライアントアプリケーションを作成します。">クライアントアプリケーションを作成する</Links>
                    <Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係を追加する</Links>
                    <Links href="/ktor/client-create-and-configure" summary="Ktorクライアントを作成および設定する方法を学びます。">クライアントの作成と設定</Links>
                    <Links href="/ktor/client-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">クライアントエンジン</Links>
                    <Links href="/ktor/client-plugins" summary="ロギング、シリアル化、認可などの共通機能を提供するプラグインについて理解を深めます。">クライアントプラグイン</Links>
                </group>
                <group>
                    <title>リクエスト</title>
                    <Links href="/ktor/client-requests" summary="リクエストの作成方法と、リクエストURL、HTTPメソッド、ヘッダー、リクエスト本文など、様々なリクエストパラメータを指定する方法を学びます。">リクエストの作成</Links>
                    <Links href="/ktor/client-resources" summary="Resourcesプラグインを使用して型安全なリクエストを作成する方法を学びます。">型安全なリクエスト</Links>
                    <Links href="/ktor/client-default-request" summary="DefaultRequestプラグインを使用すると、すべてのリクエストのデフォルトパラメータを設定できます。">デフォルトリクエスト</Links>
                    <Links href="/ktor/client-request-retry" summary="HttpRequestRetryプラグインを使用すると、失敗したリクエストの再試行ポリシーを設定できます。">失敗したリクエストの再試行</Links>
                </group>
                <group>
                    <title>レスポンス</title>
                    <Links href="/ktor/client-responses" summary="レスポンスの受信方法、レスポンス本文の取得方法、レスポンスパラメータの取得方法を学びます。">レスポンスの受信</Links>
                    <Links href="/ktor/client-response-validation" summary="ステータスコードに応じてレスポンスを検証する方法を学びます。">レスポンスの検証</Links>
                </group>
                <group>
                    <title>プラグイン</title>
                    <Links href="/ktor/client-auth" summary="Authプラグインは、クライアントアプリケーションでの認証と認可を処理します。">Ktorクライアントでの認証と認可</Links>
                    <Links href="/ktor/client-cookies" summary="HttpCookiesプラグインはクッキーを自動的に処理し、ストレージで呼び出し間で保持します。">クッキー</Links>
                    <Links href="/ktor/client-content-encoding" summary="ContentEncodingプラグインを使用すると、指定された圧縮アルゴリズム（「gzip」や「deflate」など）を有効にし、その設定を構成できます。">コンテンツエンコーディング</Links>
                    <Links href="/ktor/client-bom-remover" summary="BOMRemoverプラグインを使用すると、レスポンス本文からバイトオーダーマーク (BOM) を削除できます。">BOMリムーバー</Links>
                    <Links href="/ktor/client-caching" summary="HttpCacheプラグインを使用すると、以前にフェッチしたリソースをインメモリまたは永続キャッシュに保存できます。">キャッシング</Links>
                    <Links href="/ktor/client-websockets" summary="Websocketsプラグインを使用すると、サーバーとクライアント間で多方向通信セッションを作成できます。">KtorクライアントでのWebSockets</Links>
                    <Links href="/ktor/client-server-sent-events" summary="SSEプラグインを使用すると、クライアントはHTTP接続を介してサーバーからイベントベースの更新を受信できます。">KtorクライアントでのServer-Sent Events</Links>
                    <Links href="/ktor/client-custom-plugins" summary="独自のカスタムクライアントプラグインを作成する方法を学びます。">カスタムクライアントプラグイン</Links>
                </group>
                <group>
                    <title>テスト</title>
                    <Links href="/ktor/client-testing" summary="MockEngineを使用してHTTP呼び出しをシミュレートすることにより、クライアントをテストする方法を学びます。">Ktorクライアントでのテスト</Links>
                </group>
            </links>
            <cards>
                <title>統合</title>
                <card href="/ktor//ktor/full-stack-development-with-kotlin-multiplatform" summary="KotlinとKtorでクロスプラットフォームのフルスタックアプリケーションを開発する方法を学びます。">Kotlin Multiplatformでフルスタックアプリケーションを構築する</card>
                <card href="/ktor//ktor/tutorial-first-steps-with-kotlin-rpc" summary="Kotlin RPCとKtorで最初のアプリケーションを作成する方法を学びます。">Kotlin RPCの最初のステップ</card>
            </cards>
        </misc>
    </section-starting-page>
</topic>