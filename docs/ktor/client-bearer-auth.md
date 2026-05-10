[//]: # (title: Ktor Client 中的 Bearer 身份验证)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 身份验证使用称为 _bearer token_ 的安全令牌。这些令牌通常用于 OAuth 2.0 流程中，通过 Google、Facebook 和 X 等外部提供商来授权用户。

您可以从 [Ktor 服务器文档的 OAuth 授权流程部分](server-oauth.md#flow)详细了解 OAuth 流程。

> 在服务器上，Ktor 提供了 [Authentication](server-bearer-auth.md) 插件来处理 bearer 身份验证。

## 配置 bearer 身份验证 {id="configure"}

Ktor 客户端允许您使用 `Bearer` 方案在 `Authorization` 标头中发送令牌。您还可以定义当令牌过期时刷新令牌的逻辑。

要配置 bearer 身份验证，请安装 `Auth` 插件并配置 `bearer` 提供程序：

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

### 加载令牌

使用 `loadTokens {}` 回调来提供初始访问令牌和刷新令牌。通常，此回调从本地存储中加载缓存的令牌，并将其作为 `BearerTokens` 实例返回。

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

在此示例中，客户端在 `Authorization` 标头中发送 `abc123` 访问令牌：

```HTTP
GET http://localhost:8080/
Authorization: Bearer abc123
```

### 刷新令牌

使用 `refreshTokens {}` 回调来定义当当前访问令牌失效时，客户端如何获取新令牌：

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
   
刷新过程如下所示：
   
1. 客户端使用无效的访问令牌向受保护资源发起请求。
2. 资源服务器返回 `401 Unauthorized` 响应。
3. 客户端自动调用 `refreshTokens {}` 回调以获取新令牌。
4. 客户端使用新令牌重试对受保护资源的请求。

当多个请求同时因 `401 Unauthorized` 失败时，客户端仅执行一次令牌刷新。第一个收到 `401` 响应的请求会触发 `refreshTokens {}` 回调。其他请求会等待刷新操作完成，然后使用新令牌重试。

> 如果安装了[多个提供程序](client-auth.md#realm)，响应应包含 `WWW-Authenticate` 标头。
> 如果客户端仅安装了一个身份验证提供程序，即使 `WWW-Authenticate` 标头缺失或指定了不同的方案，Ktor 也会针对 `401 Unauthorized` 响应尝试该提供程序。
>
{style="tip"}

### 在不等待 401 的情况下发送凭据

默认情况下，客户端仅在收到 `401 Unauthorized` 响应后才发送凭据。

您可以使用 `sendWithoutRequest {}` 回调函数覆盖此行为。此回调决定客户端是否应在发送请求之前附加凭据。

例如，以下配置在访问 Google API 时始终发送令牌：

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

### 缓存令牌

使用 `cacheTokens` 属性控制是否在请求之间缓存 bearer token。

如果禁用缓存，客户端将为每个请求调用 `loadTokens {}` 函数：
   
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

当令牌频繁更改时，禁用缓存非常有用。
   
> 有关以编程方式清除缓存凭据的详细信息，请参阅通用的[令牌缓存和缓存控制](client-auth.md#token-caching)文档。
> 
{style="tip"}

## 示例：使用 Bearer 身份验证访问 Google API {id="example-oauth-google"}

此示例演示了如何对 Google API 使用 bearer 身份验证，该 API 使用 [OAuth 2.0 协议](https://developers.google.com/identity/protocols/oauth2)进行身份验证和授权。

示例应用程序 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google) 会检索用户的 Google 个人资料信息。

### 获取客户端凭据 {id="google-client-credentials"}

要访问 Google API，您首先需要获取 OAuth 客户端凭据：

1. 创建或登录 Google 帐户。
2. 打开 [Google Cloud 控制台](https://console.cloud.google.com/apis/credentials)。
3. 创建一个应用类型为 `Android` 的 `OAuth 客户端 ID`。您将使用此客户端 ID 来获取[授权许可](#step1)。

### OAuth 授权流程 {id="oauth-flow"}

OAuth 授权流程包含以下步骤：

1. 客户端向资源所有者发送[授权请求](#step1)。
2. 资源所有者[返回授权码](#step2)。
3. 客户端[将授权码发送](#step3)到授权服务器。
4. 授权服务器[返回访问令牌和刷新令牌](#step4)。
5. 客户端[使用访问令牌向资源服务器发送请求](#step5)。
6. 资源服务器[返回受保护资源](#step6)。
7. 在访问令牌过期后，客户端[使用过期的令牌发送请求](#step7)。
8. 资源服务器[响应 401 Unauthorized](#step8)。
9. 客户端[将刷新令牌发送](#step9)到授权服务器。
10. 授权服务器[返回新的访问令牌和刷新令牌](#step10)。
11. 客户端[使用新的访问令牌向资源服务器发送新请求](#step11)。
12. 资源服务器[返回受保护资源](#step12)。

以下部分解释了 Ktor 客户端如何实现每个步骤。

#### 授权请求 {id="step1"}

首先，构建用于请求必要权限的授权 URL。这是通过附加所需的查询参数来完成的：

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

- `client_id`：用于访问 Google API 的 [OAuth 客户端 ID](#google-client-credentials)。
- `scope`：应用程序请求的权限。在这种情况下，是关于用户个人资料的信息。
- `response_type`：用于获取访问令牌的许可类型。设置为 `"code"` 以获取授权码。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 *Loopback IP address* 流程来获取授权码。
   > 要使用此 URL 接收授权码，您的应用程序必须侦听本地 Web 服务器。
   > 例如，您可以使用 [Ktor 服务器](server-create-and-configure.topic)来获取授权码作为查询参数。
- `access_type`：设置为 `offline`，以便应用程序可以在用户不在浏览器前时刷新访问令牌。

#### 授权许可 (授权码) {id="step2"}

授予访问权限后，浏览器会返回一个授权码。复制该代码并将其存储在变量中：

```kotlin
val authorizationCode = readln()
```

#### 用授权码交换令牌 {id="step3"}

接下来，用授权码交换令牌。为此，请创建一个客户端并安装带 JSON 序列化程序的 [`ContentNegotiation`](client-serialization.md) 插件：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

需要此序列化程序来反序列化从 Google OAuth 令牌端点接收到的令牌。

使用创建的客户端，将授权码和其他必要选项作为[表单参数](client-requests.md#form_parameters)传递给令牌端点：

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

令牌端点返回一个 JSON 响应，客户端将其反序列化为 `TokenInfo` 实例。`TokenInfo` 类如下所示：

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

#### 存储令牌 {id="step4"}

收到令牌后，请将其存储起来，以便提供给 `loadTokens {}` 和 `refreshTokens {}` 回调。在此示例中，存储空间是一个 `BearerTokens` 的可变列表：

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 请在[初始化客户端](#step3)之前创建令牌存储，因为它将在客户端配置内部使用。
>
{style="note"}

#### 使用有效令牌发送请求 {id="step5"}

现在有了有效的令牌，客户端可以向受保护的 Google API 发起请求并检索用户信息。

在此之前，配置客户端以使用 bearer 身份验证：

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

* `loadTokens` 回调从[存储](#step4)中获取令牌。
* `sendWithoutRequest {}` 回调在调用 Google API 时，无需等待 `401 Unauthorized` 响应即可发送访问令牌。

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

#### 访问受保护资源 {id="step6"}

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

#### 使用过期的令牌发起请求 {id="step7"}

在某个时间点，客户端重复[步骤 5](#step5) 中的请求，但使用的是已过期的访问令牌。

#### 401 Unauthorized 响应 {id="step8"}

当令牌不再有效时，资源服务器返回 `401 Unauthorized` 响应。然后客户端调用 `refreshTokens {}` 回调，该回调负责获取新令牌。

> `401 Unauthorized` 响应返回包含错误详情的 JSON 数据。这需要在[接收响应时进行处理](#step12)。
>
{style="tip"}

#### 刷新访问令牌 {id="step9"}

要获取新的访问令牌，请配置 `refreshTokens {}` 回调以向令牌端点发起另一个请求。这一次，使用 `refresh_token` 许可类型而不是 `authorization_code`：

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

`refreshTokens {}` 回调使用 `RefreshTokensParams` 作为接收者，并允许您访问以下设置：

* `client` 实例，可用于提交表单参数。
* `oldTokens` 属性用于访问刷新令牌并将其发送到令牌端点。
* `HttpRequestBuilder.markAsRefreshTokenRequest()` 函数将请求标记为令牌刷新请求。以这种方式标记的请求将被排除在身份验证重试机制之外。这可以防止在刷新请求本身因 `401 Unauthorized` 失败时客户端再次尝试刷新令牌，从而避免无限刷新循环。

#### 保存刷新的令牌 {id="step10"}

收到新令牌后，将其保存在[令牌存储](#step4)中。至此，`refreshTokens {}` 回调如下所示：

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

#### 使用新令牌发起请求 {id="step11"}

随着刷新的访问令牌已存储，下一次对受保护资源的请求应该会成功：
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

#### 处理 API 错误 {id="step12"}

鉴于 [`401 Unauthorized` 响应](#step8)返回包含错误详情的 JSON 数据，请更新示例以将错误响应读取为 `ErrorInfo` 对象：

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

`ErrorInfo` 类定义如下：

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

> 有关完整示例，请参阅 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google)。
> 
{style="tip"}