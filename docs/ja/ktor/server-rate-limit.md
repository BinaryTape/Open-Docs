[//]: # (title: レート制限)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

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
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name%は、受信リクエストのボディを検証する機能を提供します。
</link-summary>

[%plugin_name%](%plugin_api_link%)プラグインを使用すると、クライアントが特定の期間内に行える[リクエスト](server-requests.md)の数を制限できます。
Ktorは、レート制限を設定するためのさまざまな方法を提供します。例えば、
- アプリケーション全体に対してグローバルにレート制限を有効にしたり、異なる[リソース](server-routing.md)に対して異なるレート制限を設定したりできます。
- IPアドレス、APIキー、アクセストークンなどの特定のリクエストパラメータに基づいてレート制限を設定できます。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name%のインストール {id="install_plugin"}

<p>
    <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>のインストール方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## %plugin_name%の設定 {id="configure"}

### 概要 {id="overview"}

Ktorはレート制限に_トークンバケット_アルゴリズムを使用しており、これは次のように機能します。
1. まず、容量（トークンの数）によって定義されるバケットがあります。
2. 各受信リクエストは、バケットから1つのトークンを消費しようとします。
    - 十分な容量がある場合、サーバーはリクエストを処理し、以下のヘッダーを含むレスポンスを送信します。
        - `X-RateLimit-Limit`: 指定されたバケット容量。
        - `X-RateLimit-Remaining`: バケットに残っているトークンの数。
        - `X-RateLimit-Reset`: バケットが補充される時刻を指定するUTCタイムスタンプ（秒単位）。
    - 容量が不足している場合、サーバーは`429 Too Many Requests`レスポンスを使用してリクエストを拒否し、クライアントが次のリクエストを行うまでに待つべき時間（秒単位）を示す`Retry-After`ヘッダーを追加します。
3. 指定された期間の後、バケットの容量は補充されます。

### レートリミッターの登録 {id="register"}
Ktorでは、アプリケーション全体にグローバルにレート制限を適用したり、特定のルートに適用したりできます。
- アプリケーション全体にレート制限を適用するには、`global`メソッドを呼び出し、設定済みのレートリミッターを渡します。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register`メソッドは、特定のルートに適用できるレートリミッターを登録します。
   ```kotlin
   install(RateLimit) {
       register {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

上記のコードサンプルは、`%plugin_name%`プラグインの最小限の設定を示していますが、`register`メソッドを使用して登録されたレートリミッターについては、[特定のルート](#rate-limiting-scope)に適用する必要もあります。

### レート制限の設定 {id="configure-rate-limiting"}

このセクションでは、レート制限を設定する方法を説明します。

1. (オプション)`register`メソッドを使用すると、[特定のルート](#rate-limiting-scope)にレート制限ルールを適用するために使用できるレートリミッター名を指定できます。
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter`メソッドは2つのパラメータを持つレートリミッターを作成します。`limit`はバケット容量を定義し、`refillPeriod`はこのバケットのリフィル期間を指定します。
   以下の例のレートリミッターは、1分あたり30リクエストを処理できます。
   ```kotlin
   register(RateLimitName("protected")) {
       rateLimiter(limit = 30, refillPeriod = 60.seconds)
   }
   ```

3. (オプション)`requestKey`を使用すると、リクエストのキーを返す関数を指定できます。
   異なるキーを持つリクエストは、独立したレート制限を持ちます。
   以下の例では、`login`[クエリパラメータ](server-requests.md#query_parameters)が異なるユーザーを区別するためのキーとして使用されています。
   ```kotlin
   register(RateLimitName("protected")) {
       requestKey { applicationCall ->
           applicationCall.request.queryParameters["login"]!!
       }
   }
   ```

   > キーは適切な`equals`および`hashCode`の実装を持つ必要があることに注意してください。

4. (オプション)`requestWeight`は、リクエストによって消費されるトークン数を返す関数を設定します。
   以下の例では、リクエストキーを使用してリクエストの重みを設定しています。
   ```kotlin
   register(RateLimitName("protected")) {
       requestKey { applicationCall ->
           applicationCall.request.queryParameters["login"]!!
       }
       requestWeight { applicationCall, key ->
           when(key) {
               "jetbrains" -> 1
               else -> 2
           }
       }
   }
   ```

5. (オプション)`modifyResponse`を使用すると、各リクエストとともに送信されるデフォルトの`X-RateLimit-*`ヘッダーを上書きできます。
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### レート制限スコープの定義 {id="rate-limiting-scope"}

レートリミッターを設定した後、`rateLimit`メソッドを使用してそのルールを特定のルートに適用できます。

```kotlin
routing {
    rateLimit {
        get("/") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            call.respondText("ホームページへようこそ！ 残りリクエスト数: $requestsLeft")
        }
    }
}
```

このメソッドは、[レートリミッター名](#configure-rate-limiting)も受け入れることができます。

```kotlin
routing {
    rateLimit(RateLimitName("protected")) {
        get("/protected-api") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            val login = call.request.queryParameters["login"]
            call.respondText("保護されたAPIへようこそ、 $login! 残りリクエスト数: $requestsLeft")
        }
    }
}
```

## 例 {id="example"}

以下のコードサンプルは、`RateLimit`プラグインを使用して、異なるリソースに異なるレートリミッターを適用する方法を示しています。
[StatusPages](server-status-pages.md)プラグインは、`429 Too Many Requests`レスポンスが送信された、拒否されたリクエストを処理するために使用されます。

```kotlin
package com.example

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.time.Duration.Companion.seconds

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(RateLimit) {
        register {
            rateLimiter(limit = 5, refillPeriod = 60.seconds)
        }
        register(RateLimitName("public")) {
            rateLimiter(limit = 10, refillPeriod = 60.seconds)
        }
        register(RateLimitName("protected")) {
            rateLimiter(limit = 30, refillPeriod = 60.seconds)
            requestKey { applicationCall ->
                applicationCall.request.queryParameters["login"]!!
            }
            requestWeight { applicationCall, key ->
                when(key) {
                    "jetbrains" -> 1
                    else -> 2
                }
            }
        }
    }
    install(StatusPages) {
        status(HttpStatusCode.TooManyRequests) { call, status ->
            val retryAfter = call.response.headers["Retry-After"]
            call.respondText(text = "429: リクエストが多すぎます。$retryAfter秒間お待ちください。", status = status)
        }
    }
    routing {
        rateLimit {
            get("/") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("ホームページへようこそ！ 残りリクエスト数: $requestsLeft")
            }
        }
        rateLimit(RateLimitName("public")) {
            get("/public-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("公開APIへようこそ！ 残りリクエスト数: $requestsLeft")
            }
        }
        rateLimit(RateLimitName("protected")) {
            get("/protected-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                val login = call.request.queryParameters["login"]
                call.respondText("保護されたAPIへようこそ、 $login! 残りリクエスト数: $requestsLeft")
            }
        }
    }
}
```

完全な例はこちらにあります: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。