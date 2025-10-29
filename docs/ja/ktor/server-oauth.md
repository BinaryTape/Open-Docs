[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Nativeサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

[OAuth](https://oauth.net/)は、アクセス委任のためのオープンな標準規格です。OAuthは、Google、Facebook、Twitterなどの外部プロバイダーを使用して、アプリケーションのユーザーを承認するために使用できます。

`oauth`プロバイダーは認可コードフローをサポートしています。OAuthパラメーターを一箇所で設定でき、Ktorは必要なパラメーターとともに指定された認可サーバーへ自動的にリクエストを行います。

> Ktorにおける認証と認可に関する一般的な情報は、[Ktorサーバーでの認証と認可](server-auth.md)セクションで確認できます。

## 依存関係を追加する {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
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

## セッションプラグインをインストールする

クライアントが保護されたリソースにアクセスしようとするたびに認可を要求するのを避けるため、認可が成功した際にアクセストークンをセッションに保存することができます。
その後、保護されたルートのハンドラー内で現在のセッションからアクセストークンを取得し、それを使用してリソースを要求できます。

```kotlin
import io.ktor.server.sessions.*

fun Application.main(httpClient: HttpClient = applicationHttpClient) {
    install(Sessions) {
        cookie<UserSession>("user_session")
    }
}
@Serializable
data class UserSession(val state: String, val token: String)
```

## OAuth認可フロー {id="flow"}

KtorアプリケーションにおけるOAuth認可フローは以下のようになります:

1.  ユーザーがKtorアプリケーションのログインページを開きます。
2.  Ktorは、特定のプロバイダーの認可ページへ自動的にリダイレクトし、必要な[パラメーター](#configure-oauth-provider)を渡します:
    *   選択されたプロバイダーのAPIにアクセスするために使用されるクライアントID。
    *   認可完了後に開かれるKtorアプリケーションのページを指定するコールバックまたはリダイレクトURL。
    *   Ktorアプリケーションに必要なサードパーティリソースのスコープ。
    *   アクセストークン（認可コード）を取得するために使用されるグラントタイプ。
    *   CSRF攻撃を軽減し、ユーザーをリダイレクトするために使用される`state`パラメーター。
    *   特定のプロバイダーに固有のオプションパラメーター。
3.  認可ページには、Ktorアプリケーションに必要な権限レベルを示す同意画面が表示されます。これらの権限は、[ステップ2: OAuthプロバイダーの設定](#configure-oauth-provider)で設定された指定スコープに依存します。
4.  ユーザーが要求された権限を承認すると、認可サーバーは指定されたリダイレクトURLにリダイレクトし、認可コードを送信します。
5.  Ktorは、指定されたアクセストークンURLに次のパラメーターを含めて、もう一度自動的にリクエストを行います:
    *   認可コード。
    *   クライアントIDとクライアントシークレット。

    認可サーバーはアクセストークンを返却して応答します。
6.  クライアントはこのトークンを使用して、選択されたプロバイダーの必要なサービスへリクエストを行うことができます。ほとんどの場合、トークンは`Bearer`スキーマを使用して`Authorization`ヘッダーで送信されます。
7.  サービスはトークンを検証し、そのスコープを認可に利用して、要求されたデータを返します。

## OAuthのインストール {id="install"}

`oauth`認証プロバイダーをインストールするには、`install`ブロック内で[oauth](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/oauth.html)関数を呼び出します。オプションで、[プロバイダー名を指定](server-auth.md#provider-name)できます。例えば、"auth-oauth-google"という名前で`oauth`プロバイダーをインストールするには、以下のようになります:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*

fun Application.main(httpClient: HttpClient = applicationHttpClient) {
    install(Authentication) {
        oauth("auth-oauth-google") {
            // Configure oauth authentication
            urlProvider = { "http://localhost:8080/callback" }
        }
    }
}
```

## OAuthの設定 {id="configure-oauth"}

このセクションでは、Googleを使用してアプリケーションのユーザーを認可するための`oauth`プロバイダーの設定方法を説明します。完全に実行可能な例については、[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)を参照してください。

### 前提条件: 認可クレデンシャルを作成する {id="authorization-credentials"}

Google APIにアクセスするには、Google Cloud Consoleで認可クレデンシャルを作成する必要があります。

1.  Google Cloud Consoleで[認証情報](https://console.cloud.google.com/apis/credentials)ページを開きます。
2.  **認証情報を作成**をクリックし、`OAuth クライアント ID`を選択します。
3.  ドロップダウンから`ウェブ アプリケーション`を選択します。
4.  次の設定を指定します:
    *   **承認済みのJavaScript生成元**: `http://localhost:8080`。
    *   **承認済みのリダイレクトURI**: `http://localhost:8080/callback`。
        Ktorでは、[urlProvider](#configure-oauth-provider)プロパティを使用して、認可完了時に開かれるリダイレクトルートを指定します。

5.  **作成**をクリックします。
6.  表示されたダイアログで、作成されたクライアントIDとクライアントシークレットをコピーします。これらは`oauth`プロバイダーの設定に使用されます。

### ステップ1: HTTPクライアントを作成する {id="create-http-client"}

`oauth`プロバイダーを設定する前に、サーバーがOAuthサーバーにリクエストを行うために使用する[HttpClient](client-create-and-configure.md)を作成する必要があります。[ContentNegotiation](client-serialization.md)クライアントプラグインとJSONシリアライザーは、[APIへのリクエスト後](#request-api)に受信したJSONデータをデシリアライズするために必要です。

```kotlin
val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
        })
    }
}
```

クライアントインスタンスは、サーバー[テスト](server-testing.md)で別のクライアントインスタンスを作成できるように、`main`[モジュール関数](server-modules.md)に渡されます。

```kotlin
fun Application.main(httpClient: HttpClient = applicationHttpClient) {
}
```

### ステップ2: OAuthプロバイダーを設定する {id="configure-oauth-provider"}

以下のコードスニペットは、`auth-oauth-google`という名前で`oauth`プロバイダーを作成および設定する方法を示しています。

```kotlin
val redirects = mutableMapOf<String, String>()
install(Authentication) {
    oauth("auth-oauth-google") {
        // Configure oauth authentication
        urlProvider = { "http://localhost:8080/callback" }
        providerLookup = {
            OAuthServerSettings.OAuth2ServerSettings(
                name = "google",
                authorizeUrl = "https://accounts.google.com/o/oauth2/auth",
                accessTokenUrl = "https://accounts.google.com/o/oauth2/token",
                requestMethod = HttpMethod.Post,
                clientId = System.getenv("GOOGLE_CLIENT_ID"),
                clientSecret = System.getenv("GOOGLE_CLIENT_SECRET"),
                defaultScopes = listOf("https://www.googleapis.com/auth/userinfo.profile"),
                extraAuthParameters = listOf("access_type" to "offline"),
                onStateCreated = { call, state ->
                    //saves new state with redirect url value
                    call.request.queryParameters["redirectUrl"]?.let {
                        redirects[state] = it
                    }
                }
            )
        }
        client = httpClient
    }
}
```

*   `urlProvider`は、認可が完了したときに呼び出される[リダイレクトルート](#redirect-route)を指定します。
    > このルートが[**承認済みのリダイレクトURI**](#authorization-credentials)のリストに追加されていることを確認してください。
*   `providerLookup`を使用すると、必要なプロバイダーのOAuth設定を指定できます。これらの設定は[OAuthServerSettings](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html)クラスによって表現され、KtorがOAuthサーバーへ自動的にリクエストを行うことを可能にします。
*   `client`プロパティは、KtorがOAuthサーバーへリクエストを行うために使用する[HttpClient](#create-http-client)を指定します。

### ステップ3: ログインルートを追加する {id="login-route"}

`oauth`プロバイダーを設定した後、`authenticate`関数内に`oauth`プロバイダーの名前を受け入れる[保護されたログインルート](server-auth.md#authenticate-route)を作成する必要があります。Ktorがこのルートへのリクエストを受信すると、[providerLookup](#configure-oauth-provider)で定義された`authorizeUrl`に自動的にリダイレクトされます。

```kotlin
routing {
    authenticate("auth-oauth-google") {
        get("/login") {
            // Redirects to 'authorizeUrl' automatically
        }
    }
}
```

ユーザーは、Ktorアプリケーションに必要な権限レベルを示す認可ページを目にします。これらの権限は、[providerLookup](#configure-oauth-provider)で指定された`defaultScopes`に依存します。

### ステップ4: リダイレクトルートを追加する {id="redirect-route"}

ログインルートとは別に、[ステップ2: OAuthプロバイダーの設定](#configure-oauth-provider)で指定されているように、`urlProvider`のリダイレクトルートを作成する必要があります。

このルート内では、`call.principal`関数を使用して[OAuthAccessTokenResponse](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html)オブジェクトを取得できます。`OAuthAccessTokenResponse`を使用すると、OAuthサーバーから返されたトークンやその他のパラメーターにアクセスできます。

```kotlin
    routing {
        authenticate("auth-oauth-google") {
            get("/login") {
                // Redirects to 'authorizeUrl' automatically
            }

            get("/callback") {
                val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()
                // redirects home if the url is not found before authorization
                currentPrincipal?.let { principal ->
                    principal.state?.let { state ->
                        call.sessions.set(UserSession(state, principal.accessToken))
                        redirects[state]?.let { redirect ->
                            call.respondRedirect(redirect)
                            return@get
                        }
                    }
                }
                call.respondRedirect("/home")
            }
        }
    }
```

この例では、トークンを受信した後に次のアクションが実行されます:

*   トークンは[セッション](server-sessions.md)に保存され、その内容は他のルート内からアクセスできます。
*   ユーザーはGoogle APIへのリクエストが行われる次のルートにリダイレクトされます。
*   要求されたルートが見つからない場合、ユーザーは`/home`ルートにリダイレクトされます。

### ステップ5: APIへリクエストを行う {id="request-api"}

[リダイレクトルート](#redirect-route)内でトークンを受信し、セッションに保存した後、このトークンを使用して外部APIへリクエストを行うことができます。以下のコードスニペットは、[HttpClient](#create-http-client)を使用してそのようなリクエストを行い、`Authorization`ヘッダーにこのトークンを送信することでユーザー情報を取得する方法を示しています。

リクエストを行い、レスポンスボディを返す`getPersonalGreeting`という新しい関数を作成します:

```kotlin
private suspend fun getPersonalGreeting(
    httpClient: HttpClient,
    userSession: UserSession
): UserInfo = httpClient.get("https://www.googleapis.com/oauth2/v2/userinfo") {
    headers {
        append(HttpHeaders.Authorization, "Bearer ${userSession.token}")
    }
}.body()
```

次に、`get`ルート内でその関数を呼び出し、ユーザー情報を取得できます:

```kotlin
get("/{path}") {
    val userSession: UserSession? = getSession(call)
    if (userSession != null) {
        val userInfo: UserInfo = getPersonalGreeting(httpClient, userSession)
        call.respondText("Hello, ${userInfo.name}!")
    }
}
```

完全に実行可能な例については、[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)を参照してください。