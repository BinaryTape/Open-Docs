[//]: # (title: Ktor Client における Bearer 認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 認証は、ベアラートークンと呼ばれるセキュリティトークンを使用します。例として、これらのトークンは OAuth フローの一部として、Google、Facebook、Twitter などの外部プロバイダーを使用してアプリケーションのユーザーを認可するために使用できます。OAuth フローがどのようなものかについては、Ktor サーバー用の [OAuth 認可フロー](server-oauth.md#flow) セクションで学ぶことができます。

> サーバー側では、Ktor は Bearer 認証を処理するための [Authentication](server-bearer-auth.md) プラグインを提供しています。

## Bearer 認証の設定 {id="configure"}

Ktor クライアントでは、`Bearer` スキームを使用して `Authorization` ヘッダーで送信されるトークンを設定できます。また、古いトークンが無効な場合にトークンをリフレッシュするためのロジックを指定することもできます。`bearer` プロバイダーを設定するには、以下の手順に従ってください。

1. `install` ブロック内で `bearer` 関数を呼び出します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // Bearer 認証の設定
          }
       }
   }
   ```
   
2. `loadTokens` コールバックを使用して、初期のアクセスおよびリフレッシュトークンの取得方法を設定します。このコールバックは、ローカルストレージからキャッシュされたトークンを読み込み、それらを `BearerTokens` インスタンスとして返すことを目的としています。

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // ローカルストレージからトークンを読み込み、'BearerTokens' インスタンスとして返す
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123` アクセストークンは、各[リクエスト](client-requests.md)とともに、`Bearer` スキームを使用して `Authorization` ヘッダーで送信されます。
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. `refreshTokens` を使用して、古いトークンが無効な場合に新しいトークンを取得する方法を指定します。

   ```kotlin
   install(Auth) {
       bearer {
           // トークンの読み込み ...
           refreshTokens { // this: RefreshTokensParams
               // トークンをリフレッシュし、'BearerTokens' インスタンスとして返す
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   このコールバックは以下のように動作します。
   
   a. クライアントは無効なアクセストークンを使用して保護されたリソースにリクエストを送信し、`401` (Unauthorized) レスポンスを受け取ります。
     > [複数のプロバイダー](client-auth.md#realm)がインストールされている場合、レスポンスには `WWW-Authenticate` ヘッダーが含まれている必要があります。
   
   b. クライアントは自動的に `refreshTokens` を呼び出して新しいトークンを取得します。

   c. クライアントは、今度は新しいトークンを使用して、保護されたリソースに対して自動的に再試行リクエストを行います。

4. (オプション) `401` (Unauthorized) レスポンスを待たずに認証情報を送信するための条件を指定します。例えば、特定のリクエストが指定されたホストに対して行われているかどうかを確認できます。

   ```kotlin
   install(Auth) {
       bearer {
           // トークンの読み込みとリフレッシュ ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

5. (オプション) `cacheTokens` オプションを使用して、リクエスト間でベアラートークンをキャッシュするかどうかを制御します。キャッシュを無効にすると、クライアントはリクエストごとにトークンを再読み込みするようになります。これは、トークンが頻繁に変更される場合に便利です。
   
    ```kotlin
   install(Auth) {
        bearer {
            cacheTokens = false   // リクエストごとにトークンを再読み込みする
            loadTokens {
                loadDynamicTokens()
            }
        }
    }
    ```
   
    > キャッシュされた認証情報をプログラムでクリアする詳細については、一般的な [トークンのキャッシュとキャッシュ制御](client-auth.md#token-caching) セクションを参照してください。

## 例: Bearer 認証を使用して Google API にアクセスする {id="example-oauth-google"}

Bearer 認証を使用して、認証と認可に [OAuth 2.0 プロトコル](https://developers.google.com/identity/protocols/oauth2)を使用する Google APIs にアクセスする方法を見てみましょう。Google のプロファイル情報を取得する [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) コンソールアプリケーションについて調べます。 

### クライアント認証情報の取得 {id="google-client-credentials"}
Google APIs にアクセスするには、まず OAuth クライアント認証情報が必要です。
1. Google アカウントを作成するか、サインインします。
2. [Google Cloud コンソール](https://console.cloud.google.com/apis/credentials)を開き、`Android` アプリケーションタイプの `OAuth クライアント ID` を作成します。このクライアント ID は[認可グラント](#step1)を取得するために使用されます。

### OAuth 認可フロー {id="oauth-flow"}

OAuth 認可フローは以下の通りです。

```Console
(1)  --> 認可リクエスト                       リソース所有者
(2)  <-- 認可グラント (コード)                 リソース所有者
(3)  --> 認可グラント (コード)                 認可サーバー
(4)  <-- アクセスおよびリフレッシュトークン     認可サーバー
(5)  --> 有効なトークンによるリクエスト         リソースサーバー
(6)  <-- 保護されたリソース                   リソースサーバー
⌛⌛⌛    トークン期限切れ
(7)  --> 期限切れトークンによるリクエスト       リソースサーバー
(8)  <-- 401 Unauthorized レスポンス          リソースサーバー
(9)  --> 認可グラント (リフレッシュトークン)   認可サーバー
(10) <-- アクセスおよびリフレッシュトークン     認可サーバー
(11) --> 新しいトークンによるリクエスト         リソースサーバー
(12) <-- 保護されたリソース                   リソースサーバー
```
{disable-links="false"}

次のセクションでは、各ステップがどのように実装され、`Bearer` 認証プロバイダーが API へのアクセスをどのように支援するかを説明します。

### (1) -> 認可リクエスト {id="step1"}

最初のステップは、必要な権限をリクエストするために使用される認可 URL を構築することです。これは、必要なクエリパラメータを追加することによって行われます。

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

- `client_id`: Google APIs へのアクセスに使用される、[以前に取得した](#google-client-credentials)クライアント ID です。
- `scope`: Ktor アプリケーションに必要なリソースのスコープです。この例では、アプリケーションはユーザーのプロファイルに関する情報をリクエストしています。
- `response_type`: アクセストークンを取得するために使用されるグラントタイプです。この例では、認可コードを取得するために `"code"` に設定されています。
- `redirect_uri`: `http://127.0.0.1:8080` という値は、認可コードを取得するために _ループバック IP アドレス_ フローが使用されることを示しています。
   > この URL を使用して認可コードを受け取るには、アプリケーションがローカル Web サーバーでリッスンしている必要があります。
   > 例えば、[Ktor サーバー](server-create-and-configure.topic)を使用して、クエリパラメータとして認可コードを取得できます。
- `access_type`: ユーザーがブラウザにいないときにアプリケーションがアクセストークンをリフレッシュできるように、`offline` に設定されています。

### (2)  <- 認可グラント (コード) {id="step2"}

ブラウザから認可コードをコピーし、コンソールに貼り付けて、変数に保存します。

```kotlin
val authorizationCode = readln()
```

### (3)  -> 認可グラント (コード) {id="step3"}

次に、認可コードをトークンと交換します。これを行うには、クライアントを作成し、`json` シリアライザーを使用して [ContentNegotiation](client-serialization.md) プラグインをインストールします。このシリアライザーは、Google OAuth トークンエンドポイントから受信したトークンをデシリアライズするために必要です。

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

その結果、トークンエンドポイントは JSON オブジェクトでトークンを送信し、インストールされた `json` シリアライザーを使用して `TokenInfo` クラスのインスタンスにデシリアライズされます。`TokenInfo` クラスは以下の通りです。

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

### (4)  <- アクセスおよびリフレッシュトークン {id="step4"}

トークンを受信したら、`loadTokens` および `refreshTokens` コールバックに提供できるように保存します。この例では、ストレージは `BearerTokens` のミュータブルなリストです。

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> `bearerTokenStorage` はクライアント設定内で使用されるため、[クライアントの初期化](#step3)の前に作成する必要があることに注意してください。

### (5)  -> 有効なトークンによるリクエスト {id="step5"}

有効なトークンが利用可能になったので、クライアントは保護された Google API に対してリクエストを行い、ユーザー情報を取得できます。

その前に、クライアントの[設定](#step3)を調整する必要があります。

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

以下の設定が指定されています。

- すでにインストールされている `json` シリアライザー付きの [ContentNegotiation](client-serialization.md) プラグインは、リソースサーバーから JSON 形式で受信したユーザー情報をデシリアライズするために必要です。

- `bearer` プロバイダーを備えた [Auth](client-auth.md) プラグインは次のように設定されています。
  * `loadTokens` コールバックは、[ストレージ](#step4)からトークンを読み込みます。
  * `sendWithoutRequest` コールバックは、Google の保護された API にアクセスするときに `401 Unauthorized` レスポンスを待たずにアクセストークンを送信します。

このクライアントを使用して、保護されたリソースにリクエストを行うことができます。

```kotlin
while (true) {
    println("Make a request? Type 'yes' and press Enter to proceed.")
    when (readln()) {
        "yes" -> {
            val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
            try {
                val userInfo: UserInfo = response.body()
                println("Hello, ${userInfo.name}!")
            } catch (e: Exception) {
                val errorInfo: ErrorInfo = response.body()
                println(errorInfo.error.message)
            }
        }
        else -> return@runBlocking
    }
}
```

### (6)  <- 保護されたリソース {id="step6"}

リソースサーバーはユーザーに関する情報を JSON 形式で返します。レスポンスを `UserInfo` クラスのインスタンスにデシリアライズして、個別の挨拶を表示できます。

```kotlin
val userInfo: UserInfo = response.body()
println("Hello, ${userInfo.name}!")
```

`UserInfo` クラスは以下の通りです。

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

### (7)  -> 期限切れトークンによるリクエスト {id="step7"}

ある時点で、クライアントは[ステップ 5](#step5) のリクエストを繰り返しますが、アクセストークンが期限切れになっています。

### (8)  <- 401 Unauthorized レスポンス {id="step8"}

トークンが有効でなくなると、リソースサーバーは `401 Unauthorized` レスポンスを返します。次に、クライアントは新しいトークンの取得を担当する `refreshTokens` コールバックを呼び出します。

> `401` レスポンスは、エラーの詳細を含む JSON データを返します。これは[レスポンスを受信したときに処理](#step12)する必要があります。

### (9)  -> 認可グラント (リフレッシュトークン) {id="step9"}

新しいアクセストークンを取得するには、トークンエンドポイントに対して別のリクエストを行うように `refreshTokens` を設定する必要があります。今回は、`authorization_code` の代わりに `refresh_token` グラントタイプが使用されます。

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

`refreshTokens` コールバックは `RefreshTokensParams` をレシーバーとして使用し、以下の設定にアクセスできます。
- フォームパラメータの送信に使用できる `client` インスタンス。
- リフレッシュトークンにアクセスし、それをトークンエンドポイントに送信するために使用される `oldTokens` プロパティ。

> `HttpRequestBuilder` によって公開される `markAsRefreshTokenRequest` 関数は、リフレッシュトークンの取得に使用されるリクエストの特別な処理を可能にします。

### (10) <- アクセスおよびリフレッシュトークン {id="step10"}

新しいトークンを受信したら、それらを[トークンストレージ](#step4)に保存する必要があります。これにより、`refreshTokens` コールバックは次のようになります。

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

### (11) -> 新しいトークンによるリクエスト {id="step11"}

リフレッシュされたアクセストークンが保存された状態で、保護されたリソースへの次のリクエストは成功するはずです。
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 保護されたリソース {id="step12"}

[401 レスポンス](#step8)がエラーの詳細を含む JSON データを返すことを踏まえ、エラーレスポンスを `ErrorInfo` オブジェクトとして読み取るように例を更新します。

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

`ErrorInfo` クラスは次のように定義されます。

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

完全な例については、[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) を参照してください。