[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>：✅
</p>
</tldr>

[OAuth](https://oauth.net/) 是一种用于访问委托的开放标准。OAuth 可用于通过 Google、Facebook、Twitter 等外部提供商授权你的应用程序用户。

`oauth` 提供商支持授权码流。你可以在一处配置 OAuth 参数，Ktor 将自动向指定的授权服务器发出请求，并带上必要的参数。

> 你可以在[Ktor 服务器中的认证与授权](server-auth.md)部分获取 Ktor 中有关认证和授权的常规信息。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要在构建脚本中引入 <code>%artifact_name%</code> 构件：
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

## 安装 Sessions 插件

为避免客户端每次尝试访问受保护资源时都请求授权，你可以在成功授权后将访问令牌存储在会话中。
然后，你可以在受保护路由的处理程序中从当前会话中检索访问令牌，并使用它来请求资源。

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

## OAuth 授权流程 {id="flow"}

Ktor 应用程序中的 OAuth 授权流程可能如下所示：

1.  用户在 Ktor 应用程序中打开登录页面。
2.  Ktor 自动重定向到特定提供商的授权页面，并传递必要的[参数](#configure-oauth-provider)：
    *   用于访问所选提供商 API 的客户端 ID。
    *   一个回调或重定向 URL，指定授权完成后将打开的 Ktor 应用程序页面。
    *   Ktor 应用程序所需第三方资源的范围。
    *   用于获取访问令牌的授权类型（Authorization Code）。
    *   用于缓解 CSRF 攻击和重定向用户的 `state` 参数。
    *   特定提供商特有的可选参数。
3.  授权页面显示一个同意屏幕，其中包含 Ktor 应用程序所需的权限级别。这些权限取决于指定的范围，如[步骤 2：配置 OAuth 提供商](#configure-oauth-provider)中所配置。
4.  如果用户批准了请求的权限，授权服务器将重定向回指定的重定向 URL 并发送授权码。
5.  Ktor 再次自动请求指定的访问令牌 URL，其中包含以下参数：
    *   授权码。
    *   客户端 ID 和客户端密钥。

    授权服务器通过返回访问令牌进行响应。
6.  客户端随后可以使用此令牌向所选提供商的所需服务发出请求。在大多数情况下，令牌将使用 `Bearer` 方案在 `Authorization` 头中发送。
7.  服务会验证令牌，使用其范围进行授权，并返回请求的数据。

## 安装 OAuth {id="install"}

要安装 `oauth` 认证提供商，请在 `install` 代码块内调用 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 函数。你可以选择[指定提供商名称](server-auth.md#provider-name)。例如，要安装名为 "auth-oauth-google" 的 `oauth` 提供商，它将如下所示：

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

## 配置 OAuth {id="configure-oauth"}

本节演示如何配置 `oauth` 提供商，以使用 Google 授权你的应用程序用户。有关完整的可运行示例，请参见 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 前提条件：创建授权凭证 {id="authorization-credentials"}

要访问 Google API，你需要在 Google Cloud Console 中创建授权凭证。

1.  在 Google Cloud Console 中打开[凭证](https://console.cloud.google.com/apis/credentials)页面。
2.  点击 **CREATE CREDENTIALS** 并选择 `OAuth client ID`。
3.  从下拉菜单中选择 `Web application`。
4.  指定以下设置：
    *   **授权 JavaScript 源**：`http://localhost:8080`。
    *   **授权重定向 URI**：`http://localhost:8080/callback`。
        在 Ktor 中，[urlProvider](#configure-oauth-provider) 属性用于指定授权完成后将打开的重定向路由。

5.  点击 **CREATE**。
6.  在弹出的对话框中，复制创建的客户端 ID 和客户端密钥，这些将用于配置 `oauth` 提供商。

### 步骤 1：创建 HTTP 客户端 {id="create-http-client"}

在配置 `oauth` 提供商之前，你需要创建 [HttpClient](client-create-and-configure.md)，服务器将使用它向 OAuth 服务器发出请求。需要使用带有 JSON 序列化器的 [ContentNegotiation](client-serialization.md) 客户端插件，以便在[请求 API](#request-api) 后反序列化接收到的 JSON 数据。

```kotlin
val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
        })
    }
}
```

客户端实例被传递给 `main` [模块函数](server-modules.md)，以便在服务器[测试](server-testing.md)中能够创建独立的客户端实例。

```kotlin
fun Application.main(httpClient: HttpClient = applicationHttpClient) {
}
```

### 2：配置 OAuth 提供商 {id="configure-oauth-provider"}

以下代码片段展示了如何创建和配置名为 `auth-oauth-google` 的 `oauth` 提供商。

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
                    //将新状态与重定向 URL 值一同保存
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

*   `urlProvider` 指定一个[重定向路由](#redirect-route)，该路由将在授权完成后被调用。
    > 确保此路由已添加到[**授权重定向 URI**](#authorization-credentials)列表中。
*   `providerLookup` 允许你为所需提供商指定 OAuth 设置。这些设置由 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 类表示，并允许 Ktor 自动向 OAuth 服务器发出请求。
*   `client` 属性指定 Ktor 用于向 OAuth 服务器发出请求的 [HttpClient](#create-http-client)。

### 步骤 3：添加登录路由 {id="login-route"}

配置 `oauth` 提供商后，你需要在 `authenticate` 函数内部[创建一个受保护的登录路由](server-auth.md#authenticate-route)，该路由接受 `oauth` 提供商的名称。当 Ktor 收到对此路由的请求时，它将自动重定向到[providerLookup](#configure-oauth-provider)中定义的 `authorizeUrl`。

```kotlin
routing {
    authenticate("auth-oauth-google") {
        get("/login") {
            // Redirects to 'authorizeUrl' automatically
        }
    }
}
```

用户将看到授权页面，其中包含 Ktor 应用程序所需的权限级别。这些权限取决于[providerLookup](#configure-oauth-provider)中指定的 `defaultScopes`。

### 步骤 4：添加重定向路由 {id="redirect-route"}

除了登录路由之外，你还需要为 `urlProvider` 创建重定向路由，如[步骤 2：配置 OAuth 提供商](#configure-oauth-provider)中所述。

在此路由内部，你可以使用 `call.principal` 函数检索 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 对象。`OAuthAccessTokenResponse` 允许你访问 OAuth 服务器返回的令牌和其他参数。

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

在此示例中，接收到令牌后执行以下操作：

*   令牌保存在一个[会话](server-sessions.md)中，其内容可以在其他路由中访问。
*   用户被重定向到下一个路由，在那里会向 Google API 发出请求。
*   如果请求的路由未找到，用户将被重定向到 `/home` 路由。

### 步骤 5：请求 API {id="request-api"}

在[重定向路由](#redirect-route)中接收到令牌并将其保存到会话后，你可以使用此令牌向外部 API 发出请求。以下代码片段展示了如何使用 [HttpClient](#create-http-client) 发出此类请求，并通过在 `Authorization` 头中发送此令牌来获取用户的信息。

创建一个名为 `getPersonalGreeting` 的新函数，该函数将发出请求并返回响应体：

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

然后，你可以在 `get` 路由中调用该函数以检索用户的信息：

```kotlin
get("/{path}") {
    val userSession: UserSession? = getSession(call)
    if (userSession != null) {
        val userInfo: UserInfo = getPersonalGreeting(httpClient, userSession)
        call.respondText("Hello, ${userInfo.name}!")
    }
}
```

有关完整的可运行示例，请参见 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。