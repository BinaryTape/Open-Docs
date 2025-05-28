[//]: # (title: Ktor ClientでのBearer認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

Bearer認証には、ベアラートークンと呼ばれるセキュリティトークンが関与します。例えば、これらのトークンはOAuthフローの一部として、Google、Facebook、Twitterなどの外部プロバイダーを使用してアプリケーションのユーザーを認可するために使用できます。KtorサーバーでのOAuthフローの様子は、[OAuth認可フロー](server-oauth.md#flow)のセクションで確認できます。

> サーバー側では、Ktorはベアラー認証を処理するための[Authentication](server-bearer-auth.md)プラグインを提供しています。

## ベアラー認証を設定する {id="configure"}

Ktorクライアントでは、`Bearer`スキームを使用して`Authorization`ヘッダーで送信するトークンを設定できます。古いトークンが無効な場合に、トークンを更新するロジックを指定することもできます。`bearer`プロバイダーを設定するには、以下の手順に従います。

1.  `install`ブロック内で`bearer`関数を呼び出します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.cio.*
    import io.ktor.client.plugins.auth.*
    //...
    val client = HttpClient(CIO) {
        install(Auth) {
           bearer {
              // Configure bearer authentication
           }
        }
    }
    ```

2.  `loadTokens`コールバックを使用して、初期のアクセスとリフレッシュトークンを取得する方法を設定します。このコールバックは、ローカルストレージからキャッシュされたトークンをロードし、それらを`BearerTokens`インスタンスとして返すことを目的としています。

    ```kotlin
    install(Auth) {
        bearer {
            loadTokens {
                // Load tokens from a local storage and return them as the 'BearerTokens' instance
                BearerTokens("abc123", "xyz111")
            }
        }
    }
    ```

    `abc123`アクセストークンは、各[リクエスト](client-requests.md)で`Bearer`スキームを使用して`Authorization`ヘッダーに送信されます。
    ```HTTP
    GET http://localhost:8080/
    Authorization: Bearer abc123
    ```

3.  `refreshTokens`を使用して、古いトークンが無効な場合に新しいトークンを取得する方法を指定します。

    ```kotlin
    install(Auth) {
        bearer {
            // Load tokens ...
            refreshTokens { // this: RefreshTokensParams
                // Refresh tokens and return them as the 'BearerTokens' instance
                BearerTokens("def456", "xyz111")
            }
        }
    }
    ```

    このコールバックは次のように動作します。

    a. クライアントは無効なアクセストークンを使用して保護されたリソースにリクエストを送信し、`401` (Unauthorized) レスポンスを受け取ります。
      > [複数のプロバイダー](client-auth.md#realm)がインストールされている場合、レスポンスには`WWW-Authenticate`ヘッダーが含まれている必要があります。

    b. クライアントは新しいトークンを取得するために`refreshTokens`を自動的に呼び出します。

    c. クライアントは今度は新しいトークンを使用して、保護されたリソースに自動的に再度リクエストを送信します。

4.  オプションで、`401` (Unauthorized) レスポンスを待たずに資格情報を送信する条件を指定します。例えば、特定されたホストへのリクエストかどうかを確認できます。

    ```kotlin
    install(Auth) {
        bearer {
            // Load and refresh tokens ...
            sendWithoutRequest { request ->
                request.url.host == "www.googleapis.com"
            }
        }
    }
    ```

## 例: Bearer認証を使用してGoogle APIにアクセスする {id="example-oauth-google"}

認証と認可に[OAuth 2.0プロトコル](https://developers.google.com/identity/protocols/oauth2)を使用するGoogle APIに、ベアラー認証を使用してアクセスする方法を見てみましょう。Googleのプロフィール情報を取得する[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)コンソールアプリケーションを調査します。

### クライアント資格情報を取得する {id="google-client-credentials"}
最初のステップとして、Google APIにアクセスするために必要なクライアント資格情報を取得する必要があります。
1.  Googleアカウントを作成します。
2.  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)を開き、`Android`アプリケーションタイプで`OAuth クライアントID`資格情報を作成します。このクライアントIDは、[認可グラント](#step1)を取得するために使用されます。

### OAuth認可フロー {id="oauth-flow"}

私たちのアプリケーションのOAuth認可フローは次のようになります。

```Console
(1)  --> [[[Authorization request|#step1]]]                Resource owner
(2)  <-- [[[Authorization grant (code)|#step2]]]           Resource owner
(3)  --> [[[Authorization grant (code)|#step3]]]           Authorization server
(4)  <-- [[[Access and refresh tokens|#step4]]]            Authorization server
(5)  --> [[[Request with valid token|#step5]]]             Resource server
(6)  <-- [[[Protected resource|#step6]]]                   Resource server
⌛⌛⌛    Token expired
(7)  --> [[[Request with expired token|#step7]]]           Resource server
(8)  <-- [[[401 Unauthorized response|#step8]]]            Resource server
(9)  --> [[[Authorization grant (refresh token)|#step9]]]  Authorization server
(10) <-- [[[Access and refresh tokens|#step10]]]            Authorization server
(11) --> [[[Request with new token|#step11]]]               Resource server
(12) <-- [[[Protected resource|#step12]]]                   Resource server
```
{disable-links="false"}

各ステップがどのように実装され、`Bearer`認証プロバイダーがAPIへのアクセスにどのように役立つかを見ていきましょう。

### (1) -> 認可リクエスト {id="step1"}

最初のステップとして、必要なパーミッションをリクエストするために使用する認可リンクを構築する必要があります。これを行うには、指定されたクエリパラメーターをURLに追加する必要があります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="23-31"}

-   `client_id`: Google APIへのアクセスに使用する、[以前取得した](#google-client-credentials)クライアントIDです。
-   `scope`: Ktorアプリケーションに必要なリソースのスコープです。このケースでは、アプリケーションはユーザーのプロフィール情報をリクエストします。
-   `response_type`: アクセストークンを取得するために使用されるグラントタイプです。このケースでは、認可コードを取得する必要があります。
-   `redirect_uri`: `http://127.0.0.1:8080`の値は、認可コードを取得するために_Loopback IP address_フローが使用されることを示します。
    > このURLを使用して認可コードを受け取るには、アプリケーションがローカルのWebサーバーでリッスンしている必要があります。
    > 例えば、[Ktorサーバー](server-create-and-configure.topic)を使用して、クエリパラメーターとして認可コードを取得できます。
-   `access_type`: 私たちのコンソールアプリケーションは、ユーザーがブラウザにいないときにアクセストークンをリフレッシュする必要があるため、アクセスタイプは`offline`に設定されています。

### (2) <- 認可グラント (コード) {id="step2"}

このステップでは、ブラウザから認可コードをコピーし、コンソールに貼り付けて変数に保存します。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="32"}

### (3) -> 認可グラント (コード) {id="step3"}

これで、認可コードをトークンと交換する準備ができました。これを行うには、クライアントを作成し、`json`シリアライザーとともに[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。このシリアライザーは、Google OAuthトークンエンドポイントから受信したトークンをデシリアライズするために必要です。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-41,65"}

作成したクライアントを使用して、認可コードとその他の必要なオプションを[フォームパラメーター](client-requests.md#form_parameters)としてトークンエンドポイントに安全に渡すことができます。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="68-77"}

結果として、トークンエンドポイントはJSONオブジェクトでトークンを送信し、これはインストールされた`json`シリアライザーを使用して`TokenInfo`クラスインスタンスにデシリアライズされます。`TokenInfo`クラスは次のようになります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/TokenInfo.kt" include-lines="3-13"}

### (4) <- アクセスおよびリフレッシュトークン {id="step4"}

トークンが受信されたら、ストレージに保存できます。この例では、ストレージは`BearerTokens`インスタンスの可変リストです。これは、その要素を`loadTokens`および`refreshTokens`コールバックに渡せることを意味します。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="35-36,78"}

> `bearerTokenStorage`はクライアント設定内で使用されるため、[クライアントの初期化](#step3)より前に作成する必要があることに注意してください。

### (5) -> 有効なトークンでのリクエスト {id="step5"}

これで有効なトークンが手に入ったので、保護されたGoogle APIにリクエストを行い、ユーザーに関する情報を取得できます。まず、クライアントの[設定](#step3)を調整する必要があります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-47,60-65"}

次の設定が指定されています。

-   既にインストールされている`json`シリアライザーを持つ[ContentNegotiation](client-serialization.md)プラグインは、リソースサーバーから受信したユーザー情報をJSON形式でデシリアライズするために必要です。

-   `bearer`プロバイダーを持つ[Auth](client-auth.md)プラグインは次のように設定されています。
    *   `loadTokens`コールバックは[ストレージ](#step4)からトークンをロードします。
    *   `sendWithoutRequest`コールバックは、保護されたリソースへのアクセスを提供するホストにのみ、`401` (Unauthorized) レスポンスを待たずに資格情報を送信するように設定されています。

このクライアントを使用して、保護されたリソースにリクエストを行うことができます。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="81"}

### (6) <- 保護されたリソース {id="step6"}

リソースサーバーはJSON形式でユーザーに関する情報を返します。レスポンスを`UserInfo`クラスインスタンスにデシリアライズし、個別の挨拶を表示できます。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="87-88"}

`UserInfo`クラスは次のようになります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/UserInfo.kt" include-lines="3-13"}

### (7) -> 有効期限切れのトークンでのリクエスト {id="step7"}

ある時点で、クライアントは[ステップ5](#step5)と同様のリクエストを行いますが、有効期限切れのアクセストークンを使用します。

### (8) <- 401 Unauthorizedレスポンス {id="step8"}

リソースサーバーは`401`不正な認証レスポンスを返すため、クライアントは`refreshTokens`コールバックを呼び出す必要があります。
> `401`レスポンスはエラー詳細を含むJSONデータを返すため、レスポンスを受け取った際に[このケースを処理](#step12)する必要があることに注意してください。

### (9) -> 認可グラント (リフレッシュトークン) {id="step9"}

新しいアクセストークンを取得するには、`refreshTokens`を設定し、トークンエンドポイントに再度リクエストを行う必要があります。今回は、`authorization_code`の代わりに`refresh_token`グラントタイプを使用します。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="43-44,48-56,59,63-64"}

`refreshTokens`コールバックは`RefreshTokensParams`をレシーバーとして使用し、次の設定にアクセスできることに注意してください。
-   `client`インスタンス。上記のコードスニペットでは、フォームパラメーターを送信するためにこれを使用しています。
-   `oldTokens`プロパティは、リフレッシュトークンにアクセスし、それをトークンエンドポイントに送信するために使用されます。

> `HttpRequestBuilder`によって公開される`markAsRefreshTokenRequest`関数は、リフレッシュトークンを取得するために使用されるリクエストの特別な処理を可能にします。

### (10) <- アクセスおよびリフレッシュトークン {id="step10"}

新しいトークンを受け取った後、それらを[ストレージ](#step4)に保存できるため、`refreshTokens`は次のようになります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="48-59"}

### (11) -> 新しいトークンでのリクエスト {id="step11"}

このステップでは、保護されたリソースへのリクエストには新しいトークンが含まれており、正常に動作するはずです。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85"}

### (12) <-- 保護されたリソース {id="step12"}

[401レスポンス](#step8)がエラー詳細を含むJSONデータを返すことを考えると、エラーに関する情報を`ErrorInfo`オブジェクトとして受け取るようにサンプルを更新する必要があります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85-92"}

`ErrorInfo`クラスは次のようになります。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/ErrorInfo.kt" include-lines="3-13"}

完全な例はこちらで確認できます: [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。