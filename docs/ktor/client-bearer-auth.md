[//]: # (title: Ktor 客户端中的 Bearer 认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 认证涉及称为 bearer token 的安全令牌。例如，这些 token 可用作 OAuth 流程的一部分，通过 Google、Facebook、Twitter 等外部提供商来授权应用程序的用户。关于 Ktor 服务端中 OAuth 流程的可能样子，你可以从 [OAuth authorization flow](server-oauth.md#flow) 小节了解。

> 在服务端，Ktor 提供了 [Authentication](server-bearer-auth.md) 插件来处理 bearer 认证。

## 配置 bearer 认证 {id="configure"}

Ktor 客户端允许你配置 token，以便使用 `Bearer` 方案将其在 `Authorization` 请求头中发送。你还可以指定当旧 token 无效时刷新 token 的逻辑。要配置 `bearer` 提供程序，请按照以下步骤操作：

1. 在 `install` 代码块中调用 `bearer` 函数。
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
   
2. 配置如何使用 `loadTokens` 回调来获取初始的访问 token 和刷新 token。此回调旨在从本地存储中加载缓存的 token，并将其作为 `BearerTokens` 实例返回。

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
   
   `abc123` 访问 token 会在每个 [请求](client-requests.md) 中，使用 `Bearer` 方案在 `Authorization` 请求头中发送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 使用 `refreshTokens` 指定当旧 token 无效时如何获取新 token。

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
   
   此回调的工作方式如下：
   
   a. 客户端使用无效的访问 token 向受保护的资源发出请求，并获得 `401` (Unauthorized) 响应。
     > 如果安装了 [多个提供程序](client-auth.md#realm)，响应应包含 `WWW-Authenticate` 请求头。
   
   b. 客户端自动调用 `refreshTokens` 以获取新 token。

   c. 客户端这次自动使用新 token 再次向受保护的资源发出请求。

4. （可选）指定在不等待 `401` (Unauthorized) 响应的情况下发送凭据的条件。例如，你可以检测请求是否发送到指定的主机。

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

## 示例：使用 Bearer 认证访问 Google API {id="example-oauth-google"}

让我们看看如何使用 bearer 认证来访问 Google API，这些 API 使用 [OAuth 2.0 协议](https://developers.google.com/identity/protocols/oauth2) 进行认证和授权。我们将探查 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 控制台应用程序，该应用程序用于获取 Google 的个人资料信息。

### 获取客户端凭据 {id="google-client-credentials"}
作为第一步，我们需要获取访问 Google API 所需的客户端凭据：
1. 创建一个 Google 账户。
2. 打开 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 并创建类型为 `Android` 应用程序的 `OAuth client ID` 凭据。此客户端 ID 将用于获取 [authorization grant](#step1)。

### OAuth 授权流程 {id="oauth-flow"}

我们应用程序的 OAuth 授权流程如下所示：

```Console
(1)  --> Authorization request                资源所有者
(2)  <-- Authorization grant (code)           资源所有者
(3)  --> Authorization grant (code)           授权服务器
(4)  <-- Access and refresh tokens            授权服务器
(5)  --> Request with valid token             资源服务器
(6)  <-- Protected resource                   资源服务器
⌛⌛⌛    Token 过期
(7)  --> Request with expired token           资源服务器
(8)  <-- 401 Unauthorized response            资源服务器
(9)  --> Authorization grant (refresh token)  授权服务器
(10) <-- Access and refresh tokens            授权服务器
(11) --> Request with new token               资源服务器
(12) <-- Protected resource                   资源服务器
```
{disable-links="false"}

让我们探查每个步骤是如何实现的，以及 `Bearer` 认证提供程序如何帮助我们访问 API。

### (1) -> 授权请求 {id="step1"}

作为第一步，我们需要构建授权链接，用于请求所需的权限。为此，我们需要将指定的查询参数附加到 URL：

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

- `client_id`：用于访问 Google API 的 [先前获取的](#google-client-credentials) 客户端 ID。
- `scope`：Ktor 应用程序所需资源的范围。在我们的例子中，应用程序请求用户的个人资料信息。
- `response_type`：用于获取访问 token 的授权类型。在我们的例子中，我们需要获取授权码。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _环回 IP 地址_ 流程来获取授权码。
   > 要使用此 URL 接收授权码，你的应用程序必须在本地 Web 服务器上侦听。
   > 例如，你可以使用 [Ktor 服务端](server-create-and-configure.topic) 来获取作为查询参数的授权码。
- `access_type`：访问类型设置为 `offline`，因为当用户不在浏览器前时，我们的控制台应用程序需要刷新访问 token。

### (2) <- 授权码（code） {id="step2"}

在此步骤中，我们将授权码从浏览器复制，粘贴到控制台中，并将其保存到变量中：

```kotlin
val authorizationCode = readln()
```

### (3) -> 授权码（code） {id="step3"}

现在我们准备好将授权码换取 token。为此，我们需要创建一个客户端，并安装带有 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 插件。此序列化器用于反序列化从 Google OAuth token 端点接收的 token。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

使用创建的客户端，我们可以将授权码和其他必要选项作为 [表单参数](client-requests.md#form_parameters) 安全地传递到 token 端点：

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

结果，token 端点会以 JSON 对象的格式发送 token，该对象使用安装的 `json` 序列化器反序列化为 `TokenInfo` 类实例。`TokenInfo` 类如下所示：

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

### (4) <- 访问 token 和刷新 token {id="step4"}

收到 token 后，我们可以将其保存到存储中。在我们的例子中，存储是 `BearerTokens` 实例的一个可变 `list`。这意味着我们可以将其元素传递给 `loadTokens` 和 `refreshTokens` 回调。

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 请注意，`bearerTokenStorage` 应在 [初始化客户端](#step3) 之前创建，因为它将在客户端配置内部使用。

### (5) -> 附带有效 token 的请求 {id="step5"}

现在我们有了有效的 token，因此我们可以向受保护的 Google API 发出请求并获取用户信息。首先，我们需要调整客户端 [配置](#step3)：

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

指定了以下设置：

- 已经安装的带 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 插件，用于反序列化从资源服务器接收到的 JSON 格式的用户信息。

- 带 `bearer` 提供程序的 [Auth](client-auth.md) 插件配置如下：
   * `loadTokens` 回调从 [存储](#step4) 中加载 token。
   * `sendWithoutRequest` 回调配置为仅向提供受保护资源访问权限的主机发送凭据，而无需等待 `401` (Unauthorized) 响应。

此客户端可用于向受保护的资源发出请求：

```kotlin
while (true) {
```

### (6) <- 受保护资源 {id="step6"}

资源服务器以 JSON 格式返回用户信息。我们可以将响应反序列化为 `UserInfo` 类实例并显示个人问候语：

```kotlin
val userInfo: UserInfo = response.body()
println("Hello, ${userInfo.name}!")
```

`UserInfo` 类如下所示：

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

### (7) -> 附带过期 token 的请求 {id="step7"}

在某个时刻，客户端发出与 [步骤 5](#step5) 中相同的请求，但使用的是过期的访问 token。

### (8) <- 401 未授权响应 {id="step8"}

资源服务器返回 `401` 未授权响应，因此客户端应调用 `refreshTokens` 回调。
> 请注意，`401` 响应返回包含错误详情的 JSON 数据，并且我们需要在接收到响应时 [处理这种情况](#step12)。

### (9) -> 授权许可（刷新 token） {id="step9"}

为了获取新的访问 token，我们需要配置 `refreshTokens` 并向 token 端点发出另一个请求。这次，我们使用 `refresh_token` 授权类型而不是 `authorization_code`：

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

请注意，`refreshTokens` 回调使用 `RefreshTokensParams` 作为接收者，并允许你访问以下设置：
- `client` 实例。在上面的代码片段中，我们使用它来提交表单参数。
- `oldTokens` 属性用于访问刷新 token 并将其发送到 token 端点。

> `HttpRequestBuilder` 暴露的 `markAsRefreshTokenRequest` 函数能够特殊处理用于获取刷新 token 的请求。

### (10) <- 访问 token 和刷新 token {id="step10"}

收到新的 token 后，我们可以将其保存到 [存储](#step4) 中，因此 `refreshTokens` 如下所示：

```kotlin
refreshTokens {
    val refreshTokenInfo: TokenInfo = client.submitForm(
        url = "https://accounts.google.com/o/oauth2/token",
        formParameters = parameters {
            append("grant_type", "refresh_token")
            append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
            append("refresh_token", oldTokens?.refreshToken!! + "INVALID") // Changed for testing
        }
    ) { markAsRefreshTokenRequest() }.body()
    bearerTokenStorage.add(BearerTokens(refreshTokenInfo.accessToken, oldTokens?.refreshToken!!))
    bearerTokenStorage.last()
}
```

### (11) -> 附带新 token 的请求 {id="step11"}

在此步骤中，向受保护资源发出的请求包含新 token，并且应该正常工作。

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 受保护资源 {id="step12"}

鉴于 [401 响应](#step8) 返回包含错误详情的 JSON 数据，我们需要更新示例以将错误信息作为 `ErrorInfo` 对象接收：

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

`ErrorInfo` 类如下所示：

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

你可以在此处找到完整的示例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。