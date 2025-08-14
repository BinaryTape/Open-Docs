---
aside: false
---
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="ようこそ"
       id="welcome">
    <section-starting-page>
        <title>Ktor ドキュメント</title>
        <description>
            Ktor は、非同期のサーバーサイドおよびクライアントサイドアプリケーションを簡単に構築するためのフレームワークです。
        </description>
        <spotlight>
            <card href="/ktor/server-create-a-new-project" summary="Ktor を使ってサーバーアプリケーションを作成、実行、テストする方法を学びます。">
                Ktor サーバーを始める
            </card>
            <card href="/ktor/client-create-new-application" summary="Ktor を使ってクライアントアプリケーションを作成、実行、テストする方法を学びます。">
                Ktor クライアントを始める
            </card>
        </spotlight>
        <primary>
            <title>Ktor サーバー</title>
            <card href="/ktor/server-requests-and-responses" summary="タスクマネージャーアプリケーションを作成して、Ktor でルーティングとリクエストがどのように機能するかを学びます。">
                リクエストを処理してレスポンスを生成する
            </card>
            <card href="/ktor/server-create-restful-apis" summary="Ktor で RESTful API を構築する方法を学びます。このチュートリアルでは、実際の例でセットアップ、ルーティング、テストをカバーします。">RESTful API を作成する</card>
            <card href="/ktor/server-create-website" summary="Ktor と Thymeleaf テンプレートを使って Kotlin でウェブサイトを構築する方法を学びます。">ウェブサイトを作成する</card>
            <card href="/ktor/server-create-websocket-application" summary="WebSockets の力を利用してコンテンツを送受信する方法を学びます。">
                WebSocket アプリケーションを作成する
            </card>
            <card href="/ktor/server-integrate-database" summary="Exposed SQL Library を使用して Ktor サービスをデータベースリポジトリに接続するプロセスを学びます。">データベースを統合する</card>
        </primary>
        <misc>
            <links narrow="true">
                <group>
                    <title>サーバー設定</title>
                    <Links href="/ktor/server-create-a-new-project" summary="Ktor を使ってサーバーアプリケーションを開く、実行する、テストする方法を学びます。">新しい Ktor プロジェクトを作成、開く、実行する</Links>
                    <Links href="/ktor/server-dependencies" summary="既存の Gradle/Maven プロジェクトに Ktor サーバーの依存関係を追加する方法を学びます。">サーバーの依存関係を追加する</Links>
                    <Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。">サーバーを作成する</Links>
                    <Links href="/ktor/server-configuration-code" summary="コードでさまざまなサーバーパラメータを設定する方法を学びます。">コードでの設定</Links>
                    <Links href="/ktor/server-configuration-file" summary="設定ファイルでさまざまなサーバーパラメータを設定する方法を学びます。">ファイルでの設定</Links>
                    <Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの一般的な機能を提供します。">サーバープラグイン</Links>
                </group>
                <group>
                    <title>ルーティング</title>
                    <Links href="/ktor/server-routing" summary="ルーティングは、サーバーアプリケーションで受信リクエストを処理するための中核となるプラグインです。">ルーティング</Links>
                    <Links href="/ktor/server-resources" summary="Resources プラグインを使用すると、型安全なルーティングを実装できます。">型安全なルーティング</Links>
                    <Links href="/ktor/server-application-structure" summary="アプリケーションの成長に合わせて保守性を保つために、アプリケーションをどのように構造化するかを学びます。">アプリケーション構造</Links>
                    <Links href="/ktor/server-requests" summary="ルートハンドラー内で受信リクエストを処理する方法を学びます。">リクエストの処理</Links>
                    <Links href="/ktor/server-responses" summary="さまざまな種類のレスポンスを送信する方法を学びます。">レスポンスの送信</Links>
                    <Links href="/ktor/server-static-content" summary="スタイルシート、スクリプト、画像などの静的コンテンツを提供する方法を学びます。">静的コンテンツの提供</Links>
                </group>
                <group>
                    <title>プラグイン</title>
                    <Links href="/ktor/server-serialization" summary="ContentNegotiation プラグインは、クライアントとサーバー間のメディアタイプをネゴシエートし、特定の形式でコンテンツをシリアライズ/デシリアライズするという2つの主要な目的を果たします。">Ktor サーバーでのコンテンツネゴシエーションとシリアライゼーション</Links>
                    <Links href="/ktor/server-templating" summary="HTML/CSS または JVM テンプレートエンジンで構築されたビューを操作する方法を学びます。">テンプレート処理</Links>
                    <Links href="/ktor/server-auth" summary="Authentication プラグインは、Ktor での認証と認可を処理します。">Ktor サーバーでの認証と認可</Links>
                    <Links href="/ktor/server-sessions" summary="Sessions プラグインは、異なる HTTP リクエスト間でデータを永続化するメカニズムを提供します。">セッション</Links>
                    <Links href="/ktor/server-websockets" summary="Websockets プラグインを使用すると、サーバーとクライアントの間で多方向通信セッションを作成できます。">Ktor サーバーでの WebSockets</Links>
                    <Links href="/ktor/server-server-sent-events" summary="SSE プラグインを使用すると、サーバーは HTTP 接続を介してクライアントにイベントベースの更新を送信できます。">Ktor サーバーでの Server-Sent Events</Links>
                    <Links href="/ktor/server-swagger-ui" summary="SwaggerUI プラグインを使用すると、プロジェクトの Swagger UI を生成できます。">Swagger UI</Links> / <Links href="/ktor/server-openapi" summary="OpenAPI プラグインを使用すると、プロジェクトの OpenAPI ドキュメントを生成できます。">OpenAPI</Links>
                    <Links href="/ktor/server-custom-plugins" summary="独自のカスタムプラグインを作成する方法を学びます。">カスタムサーバープラグイン</Links>
                </group>
                <group>
                    <title>実行、デバッグ、テスト</title>
                    <Links href="/ktor/server-run" summary="サーバー Ktor アプリケーションを実行する方法を学びます。">実行</Links>
                    <Links href="/ktor/server-auto-reload" summary="Auto-reload を使用して、コード変更時にアプリケーションクラスをリロードする方法を学びます。">自動リロード</Links>
                    <Links href="/ktor/server-testing" summary="特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。">Ktor サーバーでのテスト</Links>
                </group>
                <group>
                    <title>デプロイ</title>
                    <Links href="/ktor/server-fatjar" summary="Ktor Gradle プラグインを使用して実行可能な Fat JAR を作成および実行する方法を学びます。">Fat JAR の作成</Links>
                    <Links href="/ktor/server-war" summary="WAR アーカイブを使用して、サーブレットコンテナ内で Ktor アプリケーションを実行およびデプロイする方法を学びます。">WAR</Links>
                    <Links href="/ktor/graalvm" summary="さまざまなプラットフォームでネイティブイメージに GraalVM を使用する方法を学びます。">GraalVM</Links>
                    <Links href="/ktor/docker" summary="アプリケーションを Docker コンテナにデプロイする方法を学びます。">Docker</Links>
                    <Links href="/ktor/google-app-engine" summary="Google App Engine 標準環境にプロジェクトをデプロイする方法を学びます。">Google App Engine</Links>
                    <Links href="/ktor/heroku" summary="Ktor アプリケーションを Heroku に準備およびデプロイする方法を学びます。">Heroku</Links>
                </group>
            </links>
            <cards>
                <title>Ktor クライアント</title>
                <card href="/ktor/client-create-new-application" summary="Ktor でクライアントアプリケーションを作成します。">
                    クライアントアプリケーションを作成する
                </card>
                <card href="/ktor/client-create-multiplatform-application" summary="Kotlin Multiplatform Mobile アプリケーションを作成し、Ktor クライアントでリクエストを作成し、レスポンスを受信する方法を学びます。">
                    クロスプラットフォームモバイルアプリケーションを作成する
                </card>
            </cards>
            <links narrow="true">
                <group>
                    <title>クライアントセットアップ</title>
                    <Links href="/ktor/client-create-new-application" summary="リクエストを送信し、レスポンスを受信するための最初のクライアントアプリケーションを作成します。">クライアントアプリケーションを作成する</Links>
                    <Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係を追加する</Links>
                    <Links href="/ktor/client-create-and-configure" summary="Ktor クライアントを作成および設定する方法を学びます。">クライアントの作成と設定</Links>
                    <Links href="/ktor/client-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">クライアントエンジン</Links>
                    <Links href="/ktor/client-plugins" summary="ロギング、シリアライゼーション、認可などの一般的な機能を提供するプラグインについて学びます。">クライアントプラグイン</Links>
                </group>
                <group>
                    <title>リクエスト</title>
                    <Links href="/ktor/client-requests" summary="リクエストを作成し、リクエストURL、HTTPメソッド、ヘッダー、リクエストボディなど、さまざまなリクエストパラメータを指定する方法を学びます。">リクエストの作成</Links>
                    <Links href="/ktor/client-resources" summary="Resources プラグインを使用して、型安全なリクエストを作成する方法を学びます。">型安全なリクエスト</Links>
                    <Links href="/ktor/client-default-request" summary="DefaultRequest プラグインを使用すると、すべてのリクエストのデフォルトパラメータを設定できます。">デフォルトリクエスト</Links>
                    <Links href="/ktor/client-request-retry" summary="HttpRequestRetry プラグインを使用すると、失敗したリクエストの再試行ポリシーを設定できます。">失敗したリクエストの再試行</Links>
                </group>
                <group>
                    <title>レスポンス</title>
                    <Links href="/ktor/client-responses" summary="レスポンスを受信し、レスポンスボディを取得し、レスポンスパラメータを取得する方法を学びます。">レスポンスの受信</Links>
                    <Links href="/ktor/client-response-validation" summary="ステータスコードに応じてレスポンスを検証する方法を学びます。">レスポンスの検証</Links>
                </group>
                <group>
                    <title>プラグイン</title>
                    <Links href="/ktor/client-auth" summary="Auth プラグインは、クライアントアプリケーションでの認証と認可を処理します。">Ktor クライアントでの認証と認可</Links>
                    <Links href="/ktor/client-cookies" summary="HttpCookies プラグインはクッキーを自動的に処理し、呼び出し間でストレージに保持します。">クッキー</Links>
                    <Links href="/ktor/client-content-encoding" summary="ContentEncoding プラグインを使用すると、指定された圧縮アルゴリズム（'gzip'や'deflate'など）を有効にし、その設定を構成できます。">コンテンツエンコーディング</Links>
                    <Links href="/ktor/client-bom-remover" summary="BOMRemover プラグインを使用すると、レスポンスボディからバイトオーダーマーク（BOM）を削除できます。">BOM リムーバー</Links>
                    <Links href="/ktor/client-caching" summary="HttpCache プラグインを使用すると、以前にフェッチしたリソースをメモリ内または永続的なキャッシュに保存できます。">キャッシング</Links>
                    <Links href="/ktor/client-websockets" summary="Websockets プラグインを使用すると、サーバーとクライアントの間で多方向通信セッションを作成できます。">Ktor クライアントでの WebSockets</Links>
                    <Links href="/ktor/client-server-sent-events" summary="SSE プラグインを使用すると、クライアントは HTTP 接続を介してサーバーからイベントベースの更新を受信できます。">Ktor クライアントでの Server-Sent Events</Links>
                    <Links href="/ktor/client-custom-plugins" summary="独自のカスタムクライアントプラグインを作成する方法を学びます。">カスタムクライアントプラグイン</Links>
                </group>
                <group>
                    <title>テスト</title>
                    <Links href="/ktor/client-testing" summary="MockEngine を使用して HTTP 呼び出しをシミュレートすることで、クライアントをテストする方法を学びます。">Ktor クライアントでのテスト</Links>
                </group>
            </links>
            <cards>
                <title>統合</title>
                <card href="/ktor//ktor/full-stack-development-with-kotlin-multiplatform" summary="Kotlin と Ktor でクロスプラットフォームのフルスタックアプリケーションを開発する方法を学びます。">Kotlin Multiplatform を使用してフルスタックアプリケーションを構築する</card>
                <card href="/ktor//ktor/tutorial-first-steps-with-kotlin-rpc" summary="Kotlin RPC と Ktor を使用して最初のアプリケーションを作成する方法を学びます。">Kotlin RPC を始める</card>
            </cards>
        </misc>
    </section-starting-page>
</topic>