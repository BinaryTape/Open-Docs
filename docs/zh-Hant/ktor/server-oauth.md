[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

[OAuth](https://oauth.net/) 是一個用於存取委託的開放標準。OAuth 可用於透過外部提供者（例如 Google、Facebook、Twitter 等）授權您的應用程式使用者。

`oauth` 提供者支援授權碼流程 (authorization code flow)。您可以在一個地方配置 OAuth 參數，Ktor 將自動使用必要的參數向指定的授權伺服器發出請求。

> 您可以在 [Ktor Server 中的驗證與授權](server-auth.md) 章節中取得關於 Ktor 驗證與授權的一般資訊。

## 新增相依性 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置指令碼中包含 <code>%artifact_name%</code> 構件：
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

## 安裝 Sessions 外掛程式

為避免用戶端每次嘗試存取受保護資源時都請求授權，您可以在成功授權後將存取權杖儲存在 Session 中。
然後，您可以在受保護路由的處理器中從目前的 Session 擷取存取權杖，並使用它來請求資源。

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

## OAuth 授權流程 {id="flow"}

Ktor 應用程式中的 OAuth 授權流程可能如下所示：

1.  使用者在 Ktor 應用程式中開啟登入頁面。
2.  Ktor 會自動重新導向至特定提供者的授權頁面，並傳遞必要的 [參數](#configure-oauth-provider)：
    *   用於存取所選提供者 API 的用戶端 ID (client ID)。
    *   回調 (callback) 或重新導向 (redirect) URL，指定授權完成後將開啟的 Ktor 應用程式頁面。
    *   Ktor 應用程式所需之第三方資源的範圍 (scopes)。
    *   用於取得存取權杖的授權類型 (grant type) (Authorization Code)。
    *   用於減輕 CSRF 攻擊並重新導向使用者的 `state` 參數。
    *   特定提供者專屬的選用參數。
3.  授權頁面會顯示一個同意畫面，其中包含 Ktor 應用程式所需的權限等級。這些權限取決於在 [步驟 2：配置 OAuth 提供者](#configure-oauth-provider) 中配置的指定範圍。
4.  如果使用者批准了請求的權限，授權伺服器會重新導向回指定的重新導向 URL 並傳送授權碼。
5.  Ktor 會再次自動請求指定的存取權杖 URL，其中包含以下參數：
    *   授權碼。
    *   用戶端 ID 和用戶端密鑰。

    授權伺服器回應時會傳回一個存取權杖。
6.  用戶端隨後可以使用此權杖向所選提供者的所需服務發出請求。在大多數情況下，權杖將使用 `Bearer` 方案在 `Authorization` 標頭中傳送。
7.  服務驗證權杖，使用其範圍進行授權，並傳回請求的資料。

## 安裝 OAuth {id="install"}

若要安裝 `oauth` 驗證提供者，請在 `install` 區塊中呼叫 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 函式。您可以選用性地 [指定提供者名稱](server-auth.md#provider-name)。
例如，若要安裝名稱為 "auth-oauth-google" 的 `oauth` 提供者，它將如下所示：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*

fun Application.main(httpClient: HttpClient = applicationHttpClient) {
    install(Authentication) {
        oauth("auth-oauth-google") {
            // Configure oauth authentication
        }
    }
}
```

## 配置 OAuth {id="configure-oauth"}

本節示範如何配置 `oauth` 提供者，以使用 Google 授權您的應用程式使用者。
有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 先決條件：建立授權憑證 {id="authorization-credentials"}

若要存取 Google API，您需要在 Google Cloud Console 中建立授權憑證。

1.  在 Google Cloud Console 中開啟 [憑證](https://console.cloud.google.com/apis/credentials) 頁面。
2.  按一下 **CREATE CREDENTIALS** 並選擇 `OAuth client ID`。
3.  從下拉式選單中選擇 `Web application`。
4.  指定以下設定：
    *   **已授權的 JavaScript 來源 (Authorised JavaScript origins)**：`http://localhost:8080`。
    *   **已授權的重新導向 URI (Authorised redirect URIs)**：`http://localhost:8080/callback`。
        在 Ktor 中，[urlProvider](#configure-oauth-provider) 屬性用於指定授權完成後將開啟的重新導向路由。

5.  按一下 **CREATE**。
6.  在彈出的對話框中，複製所建立的用戶端 ID (client ID) 和用戶端密鑰 (client secret)，這些將用於配置 `oauth` 提供者。

### 步驟 1：建立 HTTP 用戶端 {id="create-http-client"}

在配置 `oauth` 提供者之前，您需要建立 [HttpClient](client-create-and-configure.md)，該用戶端將由伺服器用於向 OAuth 伺服器發出請求。[ContentNegotiation](client-serialization.md) 用戶端外掛程式與 JSON 序列化器是必要的，以便在 [向 API 發出請求](#request-api) 後反序列化接收到的 JSON 資料。

```kotlin
val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

用戶端實例會傳遞給 `main` [模組函式](server-modules.md)，以便在伺服器 [測試](server-testing.md) 中建立獨立的用戶端實例。

```kotlin
fun Application.main(httpClient: HttpClient = applicationHttpClient) {
}
```

### 步驟 2：配置 OAuth 提供者 {id="configure-oauth-provider"}

下面的程式碼片段示範了如何建立和配置名稱為 `auth-oauth-google` 的 `oauth` 提供者。

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
```

*   `urlProvider` 指定一個 [重新導向路由](#redirect-route)，該路由將在授權完成時被呼叫。
    > 確保此路由已添加到 [**已授權的重新導向 URI (Authorised redirect URIs)**](#authorization-credentials) 列表中。
*   `providerLookup` 允許您為所需的提供者指定 OAuth 設定。這些設定由 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 類別表示，並允許 Ktor 自動向 OAuth 伺服器發出請求。
*   `client` 屬性指定由 Ktor 用於向 OAuth 伺服器發出請求的 [HttpClient](#create-http-client)。

### 步驟 3：新增登入路由 {id="login-route"}

配置 `oauth` 提供者後，您需要在 `authenticate` 函式中 [建立一個受保護的登入路由](server-auth.md#authenticate-route)，該路由接受 `oauth` 提供者的名稱。當 Ktor 收到對此路由的請求時，它將自動重新導向到 [providerLookup](#configure-oauth-provider) 中定義的 `authorizeUrl`。

```kotlin
routing {
    authenticate("auth-oauth-google") {
        get("/login") {
            // Redirects to 'authorizeUrl' automatically
        }
    }
}
```

使用者將會看到授權頁面，其中包含 Ktor 應用程式所需的權限等級。這些權限取決於 [providerLookup](#configure-oauth-provider) 中指定的 `defaultScopes`。

### 步驟 4：新增重新導向路由 {id="redirect-route"}

除了登入路由之外，您還需要為 `urlProvider` 建立重新導向路由，如 [步驟 2：配置 OAuth 提供者](#configure-oauth-provider) 中所指定。

在此路由中，您可以使用 `call.principal` 函式擷取 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 物件。`OAuthAccessTokenResponse` 允許您存取 OAuth 伺服器傳回的權杖和其他參數。

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

在此範例中，在收到權杖後執行以下動作：

*   權杖儲存在 [Session](server-sessions.md) 中，其內容可在其他路由中存取。
*   使用者重新導向到下一個路由，在此路由中向 Google API 發出請求。
*   如果找不到請求的路由，使用者將重新導向到 `/home` 路由。

### 步驟 5：向 API 發出請求 {id="request-api"}

在 [重新導向路由](#redirect-route) 中收到權杖並將其儲存到 Session 後，您可以使用此權杖向外部 API 發出請求。以下程式碼片段示範了如何使用 [HttpClient](#create-http-client) 發出此類請求，並透過在 `Authorization` 標頭中傳送此權杖來獲取使用者資訊。

建立一個名為 `getPersonalGreeting` 的新函式，該函式將發出請求並傳回回應主體：

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

然後，您可以在 `get` 路由中呼叫此函式以擷取使用者資訊：

```kotlin
get("/{path}") {
    val userSession: UserSession? = getSession(call)
    if (userSession != null) {
        val userInfo: UserInfo = getPersonalGreeting(httpClient, userSession)
        call.respondText("Hello, ${userInfo.name}!")
    }
}
```

有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。