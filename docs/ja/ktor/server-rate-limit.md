[//]: # (title: レートリミット)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name%は、受信リクエストの本文を検証する機能を提供します。
</link-summary>

[%plugin_name%](%plugin_api_link%)プラグインを使用すると、クライアントが特定の期間内に行える[リクエスト](server-requests.md)の数を制限できます。
Ktorは、レートリミットの設定にさまざまな方法を提供します。例えば、次のとおりです。
- アプリケーション全体にレートリミットをグローバルに有効にしたり、異なる[リソース](server-routing.md)に異なるレートリミットを設定したりできます。
- IPアドレス、APIキー、アクセストークンなど、特定のリクエストパラメーターに基づいてレートリミットを設定できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name%を設定する {id="configure"}

### 概要 {id="overview"}

Ktorはレートリミットに_トークンバケット_アルゴリズムを使用します。これは次のように機能します。
1. まず、バケットがその容量（トークン数）によって定義されます。
2. 受信リクエストごとにバケットから1つのトークンを消費しようとします。
    - 十分な容量がある場合、サーバーはリクエストを処理し、以下のヘッダーとともにレスポンスを送信します。
        - `X-RateLimit-Limit`: 指定されたバケット容量。
        - `X-RateLimit-Remaining`: バケットに残っているトークン数。
        - `X-RateLimit-Reset`: バケットが補充される時刻を指定するUTCタイムスタンプ（秒単位）。
    - 容量が不足している場合、サーバーは`429 Too Many Requests`レスポンスを使用してリクエストを拒否し、クライアントが後続のリクエストを行う前にどれだけ待つべきか（秒単位）を示す`Retry-After`ヘッダーを追加します。
3. 指定された期間の後、バケット容量は補充されます。

### レートリミッターを登録する {id="register"}
Ktorでは、レートリミットをアプリケーション全体にグローバルに適用したり、特定のルートに適用したりできます。
- アプリケーション全体にレートリミットを適用するには、`global`メソッドを呼び出し、設定済みのレートリミッターを渡します。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register`メソッドは、特定のルートに適用できるレートリミッターを登録します。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="14-17,33"}

上記のコードサンプルは、`%plugin_name%`プラグインの最小限の設定を示していますが、`register`メソッドを使用して登録されたレートリミッターの場合、[特定のルート](#rate-limiting-scope)にも適用する必要があります。

### レートリミットを設定する {id="configure-rate-limiting"}

このセクションでは、レートリミットの設定方法について説明します。

1. (オプション) `register`メソッドを使用すると、[特定のルート](#rate-limiting-scope)にレートリミットルールを適用するために使用できるレートリミッター名を指定できます。
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter`メソッドは、2つのパラメーターを持つレートリミッターを作成します。`limit`はバケット容量を定義し、`refillPeriod`はこのバケットの補充期間を指定します。
   以下の例のレートリミッターは、1分あたり30リクエストを処理できます。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21-22,32"}

3. (オプション) `requestKey`を使用すると、リクエストのキーを返す関数を指定できます。
   異なるキーを持つリクエストは、独立したレートリミットを持ちます。
   以下の例では、`login` [クエリパラメーター](server-requests.md#query_parameters)が異なるユーザーを区別するために使用されるキーです。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-25,32"}

   > キーは適切な`equals`および`hashCode`の実装を持つ必要があることに注意してください。

4. (オプション) `requestWeight`は、リクエストによって消費されるトークン数を返す関数を設定します。
   以下の例では、リクエストキーを使用してリクエストウェイトを設定します。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-32"}

5. (オプション) `modifyResponse`を使用すると、各リクエストとともに送信されるデフォルトの`X-RateLimit-*`ヘッダーをオーバーライドできます。
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### レートリミットスコープを定義する {id="rate-limiting-scope"}

レートリミッターを設定した後、`rateLimit`メソッドを使用してそのルールを特定のルートに適用できます。

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40-46,60"}

このメソッドは、[レートリミッター名](#configure-rate-limiting)も受け入れることができます。

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40,53-60"}

## 例 {id="example"}

以下のコードサンプルは、`RateLimit`プラグインを使用して異なるレートリミッターを異なるリソースに適用する方法を示しています。
[StatusPages](server-status-pages.md)プラグインは、`429 Too Many Requests`レスポンスが送信された拒否されたリクエストを処理するために使用されます。

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt"}

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)で見つけることができます。