[//]: # (title: Ktor 客户端中的 Bearer 认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

</tldr>

Bearer 认证涉及被称为 bearer 令牌的安全令牌。例如，这些令牌可以作为 OAuth 流程的一部分，通过使用 Google、Facebook、Twitter 等外部提供程序来授权你的应用程序用户。你可以从 Ktor 服务器的 [OAuth 授权流程](server-oauth.md#flow) 部分了解 OAuth 流程可能的样子。

> 在服务器端，Ktor 提供 [Authentication](server-bearer-auth.md) 插件来处理 bearer 认证。

## 配置 bearer 认证 {id="configure"}

Ktor 客户端允许你配置一个令牌，以便使用 `Bearer` 方案在 `Authorization` 头部中发送。如果旧令牌无效，你还可以指定刷新令牌的逻辑。要配置 `bearer` 提供程序，请按照以下步骤操作：

1. 调用 `bearer` 函数在 `install` 代码块中。
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

2. 配置如何使用 `loadTokens` 回调获取初始访问令牌和刷新令牌。此回调旨在从本地存储中加载缓存的令牌，并将其作为 `BearerTokens` 实例返回。

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

   `abc123` 访问令牌会随每个 [请求](client-requests.md) 使用 `Bearer` 方案在 `Authorization` 头部中发送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```

3. 指定当旧令牌无效时如何使用 `refreshTokens` 获取新令牌。

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

   a. 客户端使用无效的访问令牌向受保护的资源发出请求，并获得 `401`（未经授权）响应。
     > 如果安装了 [多个提供程序](client-auth.md#realm)，响应应包含 `WWW-Authenticate` 头部。

   b. 客户端自动调用 `refreshTokens` 以获取新令牌。

   c. 客户端此次使用新令牌自动向受保护的资源发出另一次请求。

4. 可选地，指定在不等待 `401`（未经授权）响应的情况下发送凭据的条件。例如，你可以检测请求是否发送到指定主机。

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

让我们来看看如何使用 bearer 认证来访问 Google API，这些 API 使用 [OAuth 2.0 协议](https://developers.google.com/identity/protocols/oauth2) 进行认证和授权。我们将研究 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 控制台应用程序，它用于获取 Google 的资料信息。

### 获取客户端凭据 {id="google-client-credentials"}
第一步，我们需要获取访问 Google API 所需的客户端凭据：
1. 创建一个 Google 账户。
2. 打开 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 并创建具有 `Android` 应用程序类型的 `OAuth client ID` 凭据。此客户端 ID 将用于获取 [授权许可](#step1)。

### OAuth 授权流程 {id="oauth-flow"}

我们应用程序的 OAuth 授权流程如下所示：

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

让我们研究一下每个步骤是如何实现的，以及 `Bearer` 认证提供程序如何帮助我们访问 API。

### (1) -> 授权请求 {id="step1"}

第一步，我们需要构建用于请求所需权限的授权链接。为此，我们需要将指定的查询参数附加到 URL：

[object Promise]

- `client_id`：用于访问 Google API 的 [先前获取的](#google-client-credentials) 客户端 ID。
- `scope`：Ktor 应用程序所需的资源作用域。在我们的案例中，应用程序请求用户资料信息。
- `response_type`：用于获取访问令牌的许可类型。在我们的案例中，我们需要获取授权码。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _Loopback IP 地址_ 流程来获取授权码。
   > 要使用此 URL 接收授权码，你的应用程序必须正在本地 Web 服务器上监听。
   > 例如，你可以使用 [Ktor 服务器](server-create-and-configure.topic) 来获取授权码作为查询参数。
- `access_type`：访问类型设置为 `offline`，因为我们的控制台应用程序需要在用户不在浏览器中时刷新访问令牌。

### (2) <- 授权许可（码） {id="step2"}

在此步骤中，我们从浏览器复制授权码，将其粘贴到控制台，并将其保存到一个变量中：

[object Promise]

### (3) -> 授权许可（码） {id="step3"}

现在我们准备好将授权码换取令牌了。为此，我们需要创建一个客户端并安装带 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 插件。此序列化器是反序列化从 Google OAuth 令牌端点接收到的令牌所必需的。

[object Promise]

使用创建的客户端，我们可以安全地将授权码和其他必要选项作为 [表单参数](client-requests.md#form_parameters) 传递给令牌端点：

[object Promise]

结果，令牌端点以 JSON 对象形式发送令牌，该对象使用已安装的 `json` 序列化器反序列化为 `TokenInfo` 类实例。`TokenInfo` 类如下所示：

[object Promise]

### (4) <- 访问令牌和刷新令牌 {id="step4"}

收到令牌后，我们可以将其保存在存储中。在我们的示例中，存储是一个 `BearerTokens` 实例的可变 list。这意味着我们可以将其元素传递给 `loadTokens` 和 `refreshTokens` 回调。

[object Promise]

> 请注意，`bearerTokenStorage` 应该在 [初始化客户端](#step3) 之前创建，因为它将在客户端配置中使用。

### (5) -> 带有有效令牌的请求 {id="step5"}

现在我们有了有效令牌，因此可以向受保护的 Google API 发出请求并获取用户资料信息。首先，我们需要调整客户端 [配置](#step3)：

[object Promise]

指定了以下设置：

- 已安装的 [ContentNegotiation](client-serialization.md) 插件（带 `json` 序列化器）是反序列化从资源服务器以 JSON 格式接收到的用户资料信息所必需的。

- 带 `bearer` 提供程序的 [Auth](client-auth.md) 插件配置如下：
   * `loadTokens` 回调从 [存储](#step4) 加载令牌。
   * `sendWithoutRequest` 回调配置为仅向提供受保护资源访问权限的主机发送凭据，而无需等待 `401`（未经授权）响应。

此客户端可用于向受保护的资源发出请求：

[object Promise]

### (6) <- 受保护的资源 {id="step6"}

资源服务器以 JSON 格式返回用户资料信息。我们可以将响应反序列化为 `UserInfo` 类实例并显示个性化问候：

[object Promise]

`UserInfo` 类如下所示：

[object Promise]

### (7) -> 带有过期令牌的请求 {id="step7"}

在某个时候，客户端会发出像 [步骤 5](#step5) 中那样的请求，但使用的是过期的访问令牌。

### (8) <- 401 未经授权响应 {id="step8"}

资源服务器返回 `401` 未经授权响应，因此客户端应该调用 `refreshTokens` 回调。
> 请注意，`401` 响应会返回包含错误详细信息的 JSON 数据，我们收到响应时需要 [处理此情况](#step12)。

### (9) -> 授权许可（刷新令牌） {id="step9"}

为了获取新的访问令牌，我们需要配置 `refreshTokens` 并向令牌端点发出另一个请求。这次，我们使用 `refresh_token` 许可类型而不是 `authorization_code`：

[object Promise]

请注意，`refreshTokens` 回调使用 `RefreshTokensParams` 作为接收者，并允许你访问以下设置：
- `client` 实例。在上面的代码片段中，我们使用它来提交表单参数。
- `oldTokens` 属性用于访问刷新令牌并将其发送到令牌端点。

> `HttpRequestBuilder` 公开的 `markAsRefreshTokenRequest` 函数能够特殊处理用于获取刷新令牌的请求。

### (10) <- 访问令牌和刷新令牌 {id="step10"}

收到新令牌后，我们可以将其保存在 [存储](#step4) 中，因此 `refreshTokens` 如下所示：

[object Promise]

### (11) -> 带有新令牌的请求 {id="step11"}

在此步骤中，对受保护资源的请求包含一个新令牌，应该能正常工作。

[object Promise]

### (12) <-- 受保护的资源 {id="step12"}

鉴于 [401 响应](#step8) 返回包含错误详细信息的 JSON 数据，我们需要更新示例以将错误信息作为 `ErrorInfo` 对象接收：

[object Promise]

`ErrorInfo` 类如下所示：

[object Promise]

你可以在此处找到完整示例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。