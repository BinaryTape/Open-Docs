[//]: # (title: Ktor Client 中的 Bearer 身份验证)

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

Bearer 身份验证涉及称为 bearer token 的安全令牌。例如，这些令牌可以作为 OAuth 流程的一部分，通过使用 Google、Facebook、Twitter 等外部提供商来授权应用程序的用户。您可以从 Ktor 服务器的 [OAuth 授权流程](server-oauth.md#flow) 章节中了解 OAuth 流程的具体形式。

> 在服务器上，Ktor 提供了 [Authentication](server-bearer-auth.md) 插件来处理 bearer 身份验证。

## 配置 bearer 身份验证 {id="configure"}

Ktor 客户端允许您配置使用 `Bearer` 方案在 `Authorization` 标头中发送的令牌。如果旧令牌无效，您还可以指定刷新令牌的逻辑。要配置 `bearer` 提供程序，请按照以下步骤操作：

1. 在 `install` 块内调用 `bearer` 函数。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // 配置 bearer 身份验证
          }
       }
   }
   ```
   
2. 使用 `loadTokens` 回调配置如何获取初始访问令牌和刷新令牌。此回调旨在从本地存储中加载缓存的令牌，并将其作为 `BearerTokens` 实例返回。

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // 从本地存储加载令牌并将其作为 'BearerTokens' 实例返回
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123` 访问令牌随每个 [请求 (request)](client-requests.md) 一起发送，使用 `Bearer` 方案放在 `Authorization` 标头中：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 使用 `refreshTokens` 指定如果旧令牌无效时如何获取新令牌。

   ```kotlin
   install(Auth) {
       bearer {
           // 加载令牌 ...
           refreshTokens { // this: RefreshTokensParams
               // 刷新令牌并将其作为 'BearerTokens' 实例返回
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   此回调的工作方式如下：
   
   a. 客户端使用无效的访问令牌向受保护资源发起请求，并收到 `401` (Unauthorized) 响应。
     > 如果安装了 [多个提供程序](client-auth.md#realm)，响应应包含 `WWW-Authenticate` 标头。
   
   b. 客户端自动调用 `refreshTokens` 以获取新令牌。

   c. 客户端这次使用新令牌自动再次向受保护资源发起一次请求。

4. (可选) 指定在不等待 `401` (Unauthorized) 响应的情况下发送凭据的条件。例如，您可以检查请求是否发送到了指定的主机。

   ```kotlin
   install(Auth) {
       bearer {
           // 加载和刷新令牌 ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

5. (可选) 使用 `cacheTokens` 选项控制是否在请求之间缓存 bearer token。禁用缓存将强制客户端为每个请求重新加载令牌，这在令牌频繁更改时非常有用：
   
    ```kotlin
   install(Auth) {
        bearer {
            cacheTokens = false   // 为每个请求重新加载令牌
            loadTokens {
                loadDynamicTokens()
            }
        }
    }
    ```
   
    > 有关以编程方式清除缓存凭据的详细信息，请参阅通用的 [令牌缓存和缓存控制](client-auth.md#token-caching) 部分。

## 示例：使用 Bearer 身份验证访问 Google API {id="example-oauth-google"}

让我们来看看如何使用 bearer 身份验证访问 Google API，它使用 [OAuth 2.0 协议](https://developers.google.com/identity/protocols/oauth2) 进行身份验证和授权。我们将研究获取 Google 个人资料信息的 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 控制台应用程序。

### 获取客户端凭据 {id="google-client-credentials"}
要访问 Google API，您首先需要 OAuth 客户端凭据：
1. 创建或登录 Google 帐户。
2. 打开 [Google Cloud 控制台](https://console.cloud.google.com/apis/credentials) 并创建一个应用类型为 `Android` 的 `OAuth 客户端 ID`。此客户端 ID 将用于获取 [授权许可](#step1)。

### OAuth 授权流程 {id="oauth-flow"}

OAuth 授权流程如下所示：

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

接下来的部分将解释每一步是如何实现的，以及 `Bearer` 身份验证提供程序如何辅助访问 API。

### (1) -> 授权请求 {id="step1"}

第一步是构建用于请求必要权限的授权 URL。这是通过附加所需的查询参数来完成的：

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

- `client_id`：用于访问 Google API 的 [先前获得](#google-client-credentials) 的客户端 ID。
- `scope`：Ktor 应用程序所需的资源作用域。在这种情况下，应用程序请求有关用户个人资料的信息。
- `response_type`：用于获取访问令牌的许可类型。在这种情况下，它被设置为 `"code"` 以获取授权码。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 *Loopback IP address* 流程来获取授权码。
   > 要使用此 URL 接收授权码，您的应用程序必须侦听本地 Web 服务器。例如，您可以使用 [Ktor 服务器](server-create-and-configure.topic) 获取授权码作为查询参数。
- `access_type`：设置为 `offline`，以便应用程序可以在用户不在浏览器前时刷新访问令牌。

### (2) <- 授权许可 (授权码) {id="step2"}

从浏览器中复制授权码，粘贴到控制台中，并将其保存在变量中：

```kotlin
val authorizationCode = readln()
```

### (3) -> 授权许可 (授权码) {id="step3"}

接下来，用授权码交换令牌。为此，请创建一个客户端并安装带 `json` 序列化程序的 [ContentNegotiation](client-serialization.md) 插件。需要此序列化程序来反序列化从 Google OAuth 令牌端点接收到的令牌。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

使用创建的客户端，您可以安全地将授权码和其他必要选项作为 [表单参数](client-requests.md#form_parameters) 传递给令牌端点：

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

结果，令牌端点在 JSON 对象中发送令牌，该对象使用安装的 `json` 序列化程序反序列化为 `TokenInfo` 类实例。`TokenInfo` 类如下所示：

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

### (4) <- 访问令牌和刷新令牌 {id="step4"}

收到令牌后，将其存储起来，以便可以将它们提供给 `loadTokens` 和 `refreshTokens` 回调。在此示例中，存储空间是一个 `BearerTokens` 的可变列表：

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 请注意，`bearerTokenStorage` 应该在 [初始化客户端](#step3) 之前创建，因为它将在客户端配置内部使用。

### (5) -> 使用有效令牌发起请求 {id="step5"}

现在有了有效的令牌，客户端可以向受保护的 Google API 发起请求并检索用户信息。

在此之前，您需要调整客户端 [配置](#step3)：

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

- 已安装的带 `json` 序列化程序的 [ContentNegotiation](client-serialization.md) 插件是必需的，用于反序列化从资源服务器接收到的 JSON 格式的用户信息。

- 带 `bearer` 提供程序的 [Auth](client-auth.md) 插件配置如下：
  * `loadTokens` 回调从 [存储](#step4) 中加载令牌。
  * `sendWithoutRequest` 回调在访问 Google 的受保护 API 时，无需等待 `401 Unauthorized` 响应即可发送访问令牌。

使用此客户端，您现在可以向受保护资源发起请求：

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

### (6) <- 受保护资源 {id="step6"}

资源服务器以 JSON 格式返回有关用户的信息。您可以将响应反序列化为 `UserInfo` 类实例并显示个人问候语：

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

### (7) -> 使用过期令牌发起请求 {id="step7"}

在某个时间点，客户端重复 [步骤 5](#step5) 中的请求，但使用的是已过期的访问令牌。

### (8) <- 401 Unauthorized 响应 {id="step8"}

当令牌不再有效时，资源服务器返回 `401 Unauthorized` 响应。然后客户端调用 `refreshTokens` 回调，该回调负责获取新令牌。

> `401` 响应返回包含错误详细信息的 JSON 数据。这需要在 [接收响应时进行处理](#step12)。

### (9) -> 授权许可 (刷新令牌) {id="step9"}

要获取新的访问令牌，您需要配置 `refreshTokens` 以向令牌端点发起另一个请求。这一次，使用 `refresh_token` 许可类型而不是 `authorization_code`：

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

`refreshTokens` 回调使用 `RefreshTokensParams` 作为接收者，并允许您访问以下设置：
- `client` 实例，可用于提交表单参数。
- `oldTokens` 属性用于访问刷新令牌并将其发送到令牌端点。

> `HttpRequestBuilder` 公开的 `markAsRefreshTokenRequest` 函数允许对用于获取刷新令牌的请求进行特殊处理。

### (10) <- 访问令牌和刷新令牌 {id="step10"}

收到新令牌后，需要将它们保存在 [令牌存储](#step4) 中。这样，`refreshTokens` 回调如下所示：

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

### (11) -> 使用新令牌发起请求 {id="step11"}

随着刷新的访问令牌已存储，下一次向受保护资源的请求应该会成功：
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 受保护资源 {id="step12"}

鉴于 [401 响应](#step8) 返回包含错误详情的 JSON 数据，请更新示例以将错误响应读取为 `ErrorInfo` 对象：

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

`ErrorInfo` 类的定义如下：

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

有关完整示例，请参阅 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。