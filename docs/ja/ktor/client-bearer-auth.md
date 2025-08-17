[//]: # (title: Ktor Clientにおけるベアラー認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

ベアラー認証には、ベアラー型トークンと呼ばれるセキュリティトークンが関与します。例えば、これらのトークンはOAuthフローの一部として、Google、Facebook、Twitterなどの外部プロバイダーを使用してアプリケーションのユーザーを認証するために使用できます。Ktorサーバーの[OAuth認証フロー](server-oauth.md#flow)セクションから、OAuthフローがどのように見えるか学ぶことができます。

> サーバー側では、Ktorはベアラー認証を処理するための[Authentication (認証)](server-bearer-auth.md)プラグインを提供しています。

## ベアラー認証を設定する {id="configure"}

Ktorクライアントを使用すると、`Authorization`ヘッダーに`Bearer`スキームを使用して送信するトークンを設定できます。古いトークンが無効な場合にトークンを更新するロジックも指定できます。`bearer`プロバイダーを設定するには、以下の手順に従います。

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

2.  `loadTokens`コールバックを使用して、初期のアクセストークンとリフレッシュトークンを取得する方法を設定します。このコールバックは、ローカルストレージからキャッシュされたトークンをロードし、それらを`BearerTokens`インスタンスとして返すことを目的としています。

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

    `abc123`アクセストークンは、各[リクエスト](client-requests.md)で`Authorization`ヘッダーに`Bearer`スキームを使用して送信されます。
    ```HTTP
    GET http://localhost:8080/
    Authorization: Bearer abc123
    ```

3.  古いトークンが無効な場合に新しいトークンを取得する方法を`refreshTokens`を使用して指定します。

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

    このコールバックは次のように機能します。

    a. クライアントは無効なアクセストークンを使用して保護されたリソースにリクエストを送信し、`401` (Unauthorized) レスポンスを受け取ります。
       > [複数のプロバイダー](client-auth.md#realm)がインストールされている場合、レスポンスには`WWW-Authenticate`ヘッダーが必要です。

    b. クライアントは新しいトークンを取得するために`refreshTokens`を自動的に呼び出します。

    c. クライアントは今回、新しいトークンを使用して保護されたリソースにもう一度リクエストを自動的に送信します。

4.  オプションで、`401` (Unauthorized) レスポンスを待つことなく認証情報を送信するための条件を指定します。例えば、リクエストが指定されたホストに対して行われたかどうかを確認できます。

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

## 例: ベアラー認証を使用してGoogle APIにアクセスする {id="example-oauth-google"}

認証と認可に[OAuth 2.0プロトコル](https://developers.google.com/identity/protocols/oauth2)を使用するGoogle APIにアクセスするために、ベアラー認証を使用する方法を見てみましょう。Googleのプロファイル情報を取得する[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)コンソールアプリケーションを調査します。

### クライアント認証情報を取得する {id="google-client-credentials"}
最初のステップとして、Google APIにアクセスするために必要なクライアント認証情報を取得する必要があります。
1.  Googleアカウントを作成します。
2.  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)を開き、`Android`アプリケーションタイプで`OAuth client ID`認証情報を作成します。このクライアントIDは[ステップ1](#step1)で認可グラントを取得するために使用されます。

### OAuth認証フロー {id="oauth-flow"}

私たちのアプリケーションのOAuth認証フローは次のようになります。

```Console
(1)  --> Authorization request                Resource owner
(2)  <-- Authorization grant (code)           Resource owner
(3)  --> Authorization grant (code)           Authorization server
(4)  <-- Access and refresh tokens            Authorization server
(5)  --> Request with valid token             Resource server
(6)  <-- Protected resource                   Resource server
⌛⌛⌛    Token expired
(7)  --> Request with expired token           Resource server
(8)  <-- 401 Unauthorized response            Resource server
(9)  --> Authorization grant (refresh token)  Authorization server
(10) <-- Access and refresh tokens            Authorization server
(11) --> Request with new token               Resource server
(12) <-- Protected resource                   Resource server
```
{disable-links="false"}

各ステップがどのように実装され、`Bearer`認証プロバイダーがAPIへのアクセスをどのように支援するかを調査しましょう。

### (1) -> 認可リクエスト {id="step1"}

最初のステップとして、必要な権限をリクエストするために使用される認可リンクを構築する必要があります。これを行うには、指定されたクエリパラメータをURLに追加する必要があります。

```kotlin
val authorizationUrlQuery = parameters {
    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
    append("scope", "https://www.googleapis.com/auth/userinfo.profile")
    append("response_type", "code")
    append("redirect_uri", "http://127.0.0.1:8080")
    append("access_type", "offline")
}.formUrlEncode()
println("https://accounts.google.com/o/oauth2/auth?$authorizationUrlQuery")
println("Open a link above, get the authorization code, insert it below, and press Enter.")
```

-   `client_id`: [以前取得した](#google-client-credentials)クライアントIDがGoogle APIへのアクセスに使用されます。
-   `scope`: Ktorアプリケーションに必要なリソースのスコープです。このケースでは、アプリケーションはユーザーのプロファイルに関する情報をリクエストします。
-   `response_type`: アクセストークンを取得するために使用されるグラントタイプです。このケースでは、認可コードを取得する必要があります。
-   `redirect_uri`: `http://127.0.0.1:8080`の値は、認可コードを取得するために_ループバックIPアドレスフロー_が使用されることを示します。
    > このURLを使用して認可コードを受け取るには、アプリケーションがローカルWebサーバーでリッスンしている必要があります。
    > 例えば、[Ktorサーバー](server-create-and-configure.topic)を使用して、認可コードをクエリパラメータとして取得できます。
-   `access_type`: コンソールアプリケーションがユーザーがブラウザにいないときにアクセストークンを更新する必要があるため、アクセスの種類は`offline`に設定されます。

### (2) <- 認可グラント (コード) {id="step2"}

このステップでは、ブラウザから認可コードをコピーし、コンソールに貼り付け、変数に保存します。

```kotlin
val authorizationCode = readln()
```

### (3) -> 認可グラント (コード) {id="step3"}

これで、認可コードをトークンと交換する準備ができました。これを行うには、クライアントを作成し、`json`シリアライザーとともに[ContentNegotiation (コンテンツネゴシエーション)](client-serialization.md)プラグインをインストールする必要があります。このシリアライザーは、Google OAuthトークンエンドポイントから受信したトークンを逆シリアル化するために必要です。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

作成したクライアントを使用して、認可コードとその他の必要なオプションを[フォームパラメータ](client-requests.md#form_parameters)としてトークンエンドポイントに安全に渡すことができます。

```kotlin
val tokenInfo: TokenInfo = client.submitForm(
    url = "https://accounts.google.com/o/oauth2/token",
    formParameters = parameters {
        append("grant_type", "authorization_code")
        append("code", authorizationCode)
        append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
        append("client_secret", System.getenv("GOOGLE_CLIENT_SECRET"))
        append("redirect_uri", "http://127.0.0.1:8080")
    }
).body()
```

結果として、トークンエンドポイントはJSONオブジェクトでトークンを送信し、これはインストールされた`json`シリアライザーを使用して`TokenInfo`クラスのインスタンスに逆シリアル化されます。`TokenInfo`クラスは次のようになります。

```kotlin
import kotlinx.serialization.*

@Serializable
data class TokenInfo(
    @SerialName("access_token") val accessToken: String,
    @SerialName("expires_in") val expiresIn: Int,
    @SerialName("refresh_token") val refreshToken: String? = null,
    val scope: String,
    @SerialName("token_type") val tokenType: String,
    @SerialName("id_token") val idToken: String,
)
```

### (4) <- アクセスおよびリフレッシュトークン {id="step4"}

トークンを受信したら、ストレージに保存できます。この例では、ストレージは`BearerTokens`インスタンスのミュータブルリストです。これは、その要素を`loadTokens`および`refreshTokens`コールバックに渡せることを意味します。

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> `bearerTokenStorage`は、クライアント構成内で使用されるため、[クライアントの初期化](#step3)の前に作成する必要があることに注意してください。

### (5) -> 有効なトークンでのリクエスト {id="step5"}

これで有効なトークンが手に入ったので、保護されたGoogle APIにリクエストを行い、ユーザーに関する情報を取得できます。まず、クライアントの[構成](#step3)を調整する必要があります。

```kotlin
        val client = HttpClient(CIO) {
            install(ContentNegotiation) {
                json()
            }

            install(Auth) {
                bearer {
                    loadTokens {
                        bearerTokenStorage.last()
                    }
                    sendWithoutRequest { request ->
                        request.url.host == "www.googleapis.com"
                    }
                }
            }
        }
```

次の設定が指定されています。

-   既にインストールされている[ContentNegotiation (コンテンツネゴシエーション)](client-serialization.md)プラグインと`json`シリアライザーは、リソースサーバーからJSON形式で受信したユーザー情報を逆シリアル化するために必要です。

-   [Auth (認証)](client-auth.md)プラグインの`bearer`プロバイダーは次のように設定されます。
    *   `loadTokens`コールバックは[ストレージ](#step4)からトークンをロードします。
    *   `sendWithoutRequest`コールバックは、`401` (Unauthorized) レスポンスを待つことなく、保護されたリソースへのアクセスを提供するホストにのみ認証情報を送信するように設定されています。

このクライアントを使用して、保護されたリソースにリクエストを行うことができます。

```kotlin
while (true) {
```

### (6) <- 保護されたリソース {id="step6"}

リソースサーバーはJSON形式でユーザーに関する情報を返します。レスポンスを`UserInfo`クラスインスタンスに逆シリアル化し、個人的な挨拶を表示できます。

```kotlin
val userInfo: UserInfo = response.body()
println("Hello, ${userInfo.name}!")
```

`UserInfo`クラスは次のようになります。

```kotlin
import kotlinx.serialization.*

@Serializable
data class UserInfo(
    val id: String,
    val name: String,
    @SerialName("given_name") val givenName: String,
    @SerialName("family_name") val familyName: String,
    val picture: String,
    val locale: String
)
```

### (7) -> 有効期限切れのトークンでのリクエスト {id="step7"}

ある時点で、クライアントは[ステップ5](#step5)のようにリクエストを行いますが、有効期限切れのアクセストークンを使用します。

### (8) <- 401 Unauthorizedレスポンス {id="step8"}

リソースサーバーは`401` Unauthorizedレスポンスを返すため、クライアントは`refreshTokens`コールバックを呼び出す必要があります。
> `401`レスポンスはエラー詳細を含むJSONデータを返すため、レスポンスを受信する際にこのケースを[処理](#step12)する必要があることに注意してください。

### (9) -> 認可グラント (リフレッシュトークン) {id="step9"}

新しいアクセストークンを取得するには、`refreshTokens`を設定し、トークンエンドポイントにもう一度リクエストを行う必要があります。今回は、`authorization_code`ではなく`refresh_token`グラントタイプを使用します。

```kotlin
install(Auth) {
    bearer {
        refreshTokens {
            val refreshTokenInfo: TokenInfo = client.submitForm(
                url = "https://accounts.google.com/o/oauth2/token",
                formParameters = parameters {
                    append("grant_type", "refresh_token")
                    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
                    append("refresh_token", oldTokens?.refreshToken ?: "")
                }
            ) { markAsRefreshTokenRequest() }.body()
        }
    }
}
```

`refreshTokens`コールバックがレシーバーとして`RefreshTokensParams`を使用し、以下の設定にアクセスできることに注意してください。
-   `client`インスタンス。上記のコードスニペットでは、フォームパラメータを送信するためにこれを使用しています。
-   `oldTokens`プロパティは、リフレッシュトークンにアクセスし、それをトークンエンドポイントに送信するために使用されます。

> `HttpRequestBuilder`によって公開される`markAsRefreshTokenRequest`関数は、リフレッシュトークンを取得するために使用されるリクエストの特別な処理を可能にします。

### (10) <- アクセスおよびリフレッシュトークン {id="step10"}

新しいトークンを受信した後、それらを[ストレージ](#step4)に保存できるため、`refreshTokens`は次のようになります。

```kotlin
refreshTokens {
    val refreshTokenInfo: TokenInfo = client.submitForm(
        url = "https://accounts.google.com/o/oauth2/token",
        formParameters = parameters {
            append("grant_type", "refresh_token")
            append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
            append("refresh_token", oldTokens?.refreshToken ?: "")
        }
    ) { markAsRefreshTokenRequest() }.body()
    bearerTokenStorage.add(BearerTokens(refreshTokenInfo.accessToken, oldTokens?.refreshToken!!))
    bearerTokenStorage.last()
}
```

### (11) -> 新しいトークンでのリクエスト {id="step11"}

このステップでは、保護されたリソースへのリクエストには新しいトークンが含まれており、問題なく動作するはずです。

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 保護されたリソース {id="step12"}

[401レスポンス](#step8)がエラー詳細を含むJSONデータを返すため、エラーに関する情報を`ErrorInfo`オブジェクトとして受け取るようにサンプルを更新する必要があります。

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
try {
    val userInfo: UserInfo = response.body()
    println("Hello, ${userInfo.name}!")
} catch (e: Exception) {
    val errorInfo: ErrorInfo = response.body()
    println(errorInfo.error.message)
}
```

`ErrorInfo`クラスは次のようになります。

```kotlin
import kotlinx.serialization.*

@Serializable
data class ErrorInfo(val error: ErrorDetails)

@Serializable
data class ErrorDetails(
    val code: Int,
    val message: String,
    val status: String,
)
```

完全な例はこちらで見つけることができます: [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。