[//]: # (title: Ktor Client における Bearer 認証)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 認証は、ベアラートークン（bearer tokens）と呼ばれるセキュリティトークンを使用します。これらのトークンは、Google、Facebook、X などの外部プロバイダーを通じてユーザーを認可するための OAuth 2.0 フローで一般的に使用されます。

OAuth プロセスの詳細については、Ktor サーバーのドキュメントの [OAuth 認可フローセクション](server-oauth.md#flow)で確認できます。

> サーバー側では、Ktor は Bearer 認証を処理するための [Authentication](server-bearer-auth.md) プラグインを提供しています。

## Bearer 認証の設定 {id="configure"}

Ktor クライアントでは、`Bearer` スキームを使用して `Authorization` ヘッダーでトークンを送信できます。また、トークンが期限切れになったときにトークンをリフレッシュするロジックを定義することもできます。

Bearer 認証を設定するには、`Auth` プラグインをインストールし、`bearer` プロバイダーを設定します。

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

### トークンの読み込み

`loadTokens {}` コールバックを使用して、初期のアクセスおよびリフレッシュトークンを提供します。通常、このコールバックはローカルストレージからキャッシュされたトークンを読み込み、それらを `BearerTokens` インスタンスとして返します。

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

この例では、クライアントは `Authorization` ヘッダーで `abc123` アクセストークンを送信します。

```HTTP
GET http://localhost:8080/
Authorization: Bearer abc123
```

### トークンのリフレッシュ

現在のアクセストークンが無効になったときに、クライアントが新しいトークンを取得する方法を定義するには、`refreshTokens {}` コールバックを使用します。

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
   
リフレッシュプロセスは以下のように動作します。
   
1. クライアントは無効なアクセストークンを使用して、保護されたリソースにリクエストを送信します。
2. リソースサーバーは `401 Unauthorized` レスポンスを返します。
3. クライアントは自動的に `refreshTokens {}` コールバックを呼び出して新しいトークンを取得します。
4. クライアントは新しいトークンを使用して、保護されたリソースに対してリクエストを再試行します。

複数のリクエストが同時に `401 Unauthorized` で失敗した場合、クライアントはトークンのリフレッシュを 1 回だけ実行します。最初に `401` レスポンスを受け取ったリクエストが `refreshTokens {}` コールバックをトリガーします。他のリクエストはリフレッシュ操作が完了するのを待ち、その後、新しいトークンで再試行されます。

> [複数のプロバイダー](client-auth.md#realm)がインストールされている場合、レスポンスには `WWW-Authenticate` ヘッダーが含まれている必要があります。
> クライアントに認証プロバイダーが 1 つだけインストールされている場合、`WWW-Authenticate` ヘッダーがない場合や別のスキームが指定されている場合でも、Ktor は `401 Unauthorized` レスポンスに対してそのプロバイダーを試行します。
>
{style="tip"}

### 401 を待たずに認証情報を送信する

デフォルトでは、クライアントは `401 Unauthorized` レスポンスを受け取った後にのみ認証情報を送信します。

`sendWithoutRequest {}` コールバック関数を使用すると、この動作をオーバーライドできます。このコールバックは、リクエストを送信する前にクライアントが認証情報を付加すべきかどうかを決定します。

例えば、以下の設定では、Google API にアクセスする際に常にトークンを送信します。

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

### トークンのキャッシュ

リクエスト間でベアラートークンをキャッシュするかどうかを制御するには、`cacheTokens` プロパティを使用します。

キャッシュが無効な場合、クライアントはリクエストごとに `loadTokens {}` 関数を呼び出します。
   
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

キャッシュの無効化は、トークンが頻繁に変更される場合に便利です。
   
> プログラムでキャッシュされた認証情報をクリアする詳細については、一般的な [トークンのキャッシュとキャッシュ制御](client-auth.md#token-caching) のドキュメントを参照してください。
> 
{style="tip"}

## 例: Bearer 認証を使用して Google API にアクセスする {id="example-oauth-google"}

この例では、認証と認可に [OAuth 2.0 プロトコル](https://developers.google.com/identity/protocols/oauth2) を使用する Google API で Bearer 認証を使用する方法を示します。

例となるアプリケーション [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google) は、ユーザーの Google プロファイル情報を取得します。

### クライアント認証情報の取得 {id="google-client-credentials"}

Google API にアクセスするには、まず OAuth クライアント認証情報を取得する必要があります。

1. Google アカウントを作成するか、サインインします。
2. [Google Cloud コンソール](https://console.cloud.google.com/apis/credentials)を開きます。
3. `Android` アプリケーションタイプで `OAuth クライアント ID` を作成します。このクライアント ID を使用して[認可グラント](#step1)を取得します。

### OAuth 認可フロー {id="oauth-flow"}

OAuth 認可フローは以下のステップで構成されます。

1. クライアントはリソース所有者に[認可リクエスト](#step1)を送信します。
2. リソース所有者は[認可コードを返します](#step2)。
3. クライアントは認可サーバーに[認可コードを送信します](#step3)。
4. 認可サーバーは[アクセスおよびリフレッシュトークンを返します](#step4)。
5. クライアントはアクセストークンを使用して[リソースサーバーにリクエストを送信します](#step5)。
6. リソースサーバーは[保護されたリソースを返します](#step6)。
7. アクセストークンの期限が切れた後、クライアントは[期限切れのトークンでリクエストを送信します](#step7)。
8. リソースサーバーは [401 Unauthorized で応答します](#step8)。
9. クライアントは認可サーバーに[リフレッシュトークンを送信します](#step9)。
10. 認可サーバーは[新しいアクセスおよびリフレッシュトークンを返します](#step10)。
11. クライアントは新しいアクセストークンを使用して[リソースサーバーに新しいリクエストを送信します](#step11)。
12. リソースサーバーは[保護されたリソースを返します](#step12)。

次のセクションでは、Ktor クライアントが各ステップをどのように実装するかを説明します。

#### 認可リクエスト {id="step1"}

まず、必要な権限をリクエストするために使用される認可 URL を構築します。これは、必要なクエリパラメータを追加することによって行われます。

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

- `client_id`: Google API へのアクセスに使用される [OAuth クライアント ID](#google-client-credentials) です。
- `scope`: アプリケーションによってリクエストされる権限。この場合は、ユーザーのプロファイルに関する情報です。
- `response_type`: アクセストークンを取得するために使用されるグラントタイプ。認可コードを取得するために `"code"` に設定します。
- `redirect_uri`: `http://127.0.0.1:8080` という値は、認可コードを取得するために _ループバック IP アドレス_ フローが使用されることを示しています。
   > この URL を使用して認可コードを受け取るには、アプリケーションがローカル Web サーバーでリッスンしている必要があります。
   > 例えば、[Ktor サーバー](server-create-and-configure.topic)を使用して、クエリパラメータとして認可コードを取得できます。
- `access_type`: ユーザーがブラウザを操作していないときでもアプリケーションがアクセストークンをリフレッシュできるように、`offline` に設定します。

#### 認可グラント (コード) {id="step2"}

アクセスを許可した後、ブラウザは認可コードを返します。コードをコピーして変数に保存します。

```kotlin
val authorizationCode = readln()
```

#### 認可コードをトークンと交換する {id="step3"}

次に、認可コードをトークンと交換します。これを行うには、クライアントを作成し、JSON シリアライザーを使用して [`ContentNegotiation`](client-serialization.md) プラグインをインストールします。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

このシリアライザーは、Google OAuth トークンエンドポイントから受信したトークンをデシリアライズするために必要です。

作成したクライアントを使用して、認可コードとその他の必要なオプションを[フォームパラメータ](client-requests.md#form_parameters)としてトークンエンドポイントに渡します。

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

トークンエンドポイントは JSON レスポンスを返し、クライアントはそれを `TokenInfo` インスタンスにデシリアライズします。`TokenInfo` クラスは以下の通りです。

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

#### トークンの保存 {id="step4"}

トークンを受信したら、`loadTokens {}` および `refreshTokens {}` コールバックに提供できるように保存します。この例では、ストレージは `BearerTokens` のミュータブルなリストです。

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> トークンストレージは、クライアント設定内で使用されるため、[クライアントを初期化する](#step3)前に作成してください。
>
{style="note"}

#### 有効なトークンによるリクエストの送信 {id="step5"}

有効なトークンが利用可能になったので、クライアントは保護された Google API に対してリクエストを行い、ユーザー情報を取得できます。

その前に、Bearer 認証を使用するようにクライアントを設定します。

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

* `loadTokens` コールバックは、[ストレージ](#step4)からトークンを取得します。
* `sendWithoutRequest {}` コールバックは、Google API を呼び出す際に `401 Unauthorized` レスポンスを待たずにアクセストークンを送信します。

このクライアントを使用して、保護されたリソースに対してリクエストを行うことができます。

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

#### 保護されたリソースへのアクセス {id="step6"}

リソースサーバーは、ユーザーに関する情報を JSON 形式で返します。レスポンスを `UserInfo` クラスのインスタンスにデシリアライズして、個別の挨拶を表示できます。

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

#### 期限切れトークンによるリクエスト {id="step7"}

ある時点で、クライアントは[ステップ 5](#step5) のリクエストを繰り返しますが、アクセストークンが期限切れになっています。

#### 401 Unauthorized レスポンス {id="step8"}

トークンが有効でなくなると、リソースサーバーは `401 Unauthorized` レスポンスを返します。次に、クライアントは新しいトークンの取得を担当する `refreshTokens {}` コールバックを呼び出します。

> `401 Unauthorized` レスポンスは、エラーの詳細を含む JSON データを返します。これは[レスポンスを受信したときに処理](#step12)する必要があります。
>
{style="tip"}

#### アクセストークンのリフレッシュ {id="step9"}

新しいアクセストークンを取得するには、トークンエンドポイントに対して別のリクエストを行うように `refreshTokens {}` コールバックを設定します。今回は、`authorization_code` の代わりに `refresh_token` グラントタイプを使用します。

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

`refreshTokens {}` コールバックは `RefreshTokensParams` をレシーバーとして使用し、以下の設定にアクセスできます。

* フォームパラメータの送信に使用できる `client` インスタンス。
* `oldTokens` プロパティは、リフレッシュトークンにアクセスし、それをトークンエンドポイントに送信するために使用されます。
* `HttpRequestBuilder.markAsRefreshTokenRequest()` 関数は、リクエストをトークンリフレッシュリクエストとしてマークします。このようにマークされたリクエストは、認証の再試行メカニズムから除外されます。これにより、リフレッシュリクエスト自体が `401 Unauthorized` で失敗した場合にクライアントが再びトークンのリフレッシュを試みるのを防ぎ、無限リフレッシュループを回避します。

#### リフレッシュされたトークンの保存 {id="step10"}

新しいトークンを受信したら、それらを[トークンストレージ](#step4)に保存します。これにより、`refreshTokens {}` コールバックは以下のようになります。

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

#### 新しいトークンによるリクエスト {id="step11"}

リフレッシュされたアクセストークンが保存された状態で、保護されたリソースへの次のリクエストは成功するはずです。
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

#### API エラーの処理 {id="step12"}

[`401 Unauthorized` レスポンス](#step8)がエラーの詳細を含む JSON データを返すことを踏まえ、エラーレスポンスを `ErrorInfo` オブジェクトとして読み取るように例を更新します。

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

`ErrorInfo` クラスは以下のように定義されます。

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

> 完全な例については、[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google) を参照してください。
> 
{style="tip"}