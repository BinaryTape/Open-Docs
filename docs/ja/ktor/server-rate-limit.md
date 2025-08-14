[//]: # (title: レートリミット)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%は、着信リクエストのボディを検証する機能を提供します。
</link-summary>

[%plugin_name%](%plugin_api_link%)プラグインを使用すると、クライアントが特定の期間内に行える[リクエスト](server-requests.md)の数を制限できます。
Ktorは、レート制限を構成するためのさまざまな方法を提供します。たとえば、次のとおりです。
- アプリケーション全体に対してグローバルにレート制限を有効にしたり、異なる[リソース](server-routing.md)に対して異なるレート制限を設定したりできます。
- 特定のリクエストパラメータ（IPアドレス、APIキー、アクセストークンなど）に基づいてレート制限を設定できます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）内で。
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
    

## %plugin_name%の設定 {id="configure"}

### 概要 {id="overview"}

Ktorはレート制限に_トークンバケット_アルゴリズムを使用します。これは次のように機能します。
1.  まず、容量（トークンの数）によって定義されるバケットがあります。
2.  各着信リクエストはバケットから1つのトークンを消費しようとします。
    *   十分な容量がある場合、サーバーはリクエストを処理し、以下のヘッダーを含むレスポンスを送信します。
        *   `X-RateLimit-Limit`: 指定されたバケット容量。
        *   `X-RateLimit-Remaining`: バケットに残っているトークンの数。
        *   `X-RateLimit-Reset`: バケットが補充される時刻を指定するUTCタイムスタンプ（秒単位）。
    *   容量が不十分な場合、サーバーは`429 Too Many Requests`レスポンスを使用してリクエストを拒否し、`Retry-After`ヘッダーを追加して、クライアントが後続のリクエストを行う前に待機すべき時間（秒単位）を示します。
3.  指定された期間の後、バケットの容量は補充されます。

### レートリミッターの登録 {id="register"}
Ktorでは、レート制限をアプリケーション全体にグローバルに適用したり、特定のルートに適用したりできます。
- アプリケーション全体にレート制限を適用するには、`global`メソッドを呼び出し、構成済みのレートリミッターを渡します。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register`メソッドは、特定のルートに適用できるレートリミッターを登録します。
   [object Promise]

上記のコードサンプルは、`%plugin_name%`プラグインの最小限の構成を示していますが、`register`メソッドを使用して登録されたレートリミッターの場合、[特定のルート](#rate-limiting-scope)にも適用する必要があります。

### レート制限の構成 {id="configure-rate-limiting"}

このセクションでは、レート制限を構成する方法について説明します。

1.  (オプション) `register`メソッドを使用すると、[特定のルート](#rate-limiting-scope)にレート制限ルールを適用するために使用できるレートリミッター名を指定できます。
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2.  `rateLimiter`メソッドは、2つのパラメータを持つレートリミッターを作成します。`limit`はバケット容量を定義し、`refillPeriod`はこのバケットの補充期間を指定します。
   以下の例のレートリミッターは、1分あたり30リクエストを処理できます。
   [object Promise]

3.  (オプション) `requestKey`を使用すると、リクエストのキーを返す関数を指定できます。異なるキーを持つリクエストは、独立したレート制限を持ちます。
   以下の例では、`login`[クエリパラメータ](server-requests.md#query_parameters)が異なるユーザーを区別するためのキーとして使用されています。
   [object Promise]

   > キーは適切な`equals`および`hashCode`の実装を持つ必要があることに注意してください。

4.  (オプション) `requestWeight`は、リクエストによって消費されるトークン数を返す関数を設定します。
   以下の例では、リクエストキーがリクエストの重みを構成するために使用されています。
   [object Promise]

5.  (オプション) `modifyResponse`を使用すると、各リクエストとともに送信されるデフォルトの`X-RateLimit-*`ヘッダーをオーバーライドできます。
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### レート制限スコープの定義 {id="rate-limiting-scope"}

レートリミッターを構成した後、`rateLimit`メソッドを使用してそのルールを特定のルートに適用できます。

[object Promise]

このメソッドは、[レートリミッター名](#configure-rate-limiting)も受け入れることができます。

[object Promise]

## 例 {id="example"}

以下のコードサンプルは、`RateLimit`プラグインを使用して、異なるレートリミッターを異なるリソースに適用する方法を示しています。
[StatusPages](server-status-pages.md)プラグインは、`429 Too Many Requests`レスポンスが送信された拒否されたリクエストを処理するために使用されます。

[object Promise]

完全な例はこちらで確認できます: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。