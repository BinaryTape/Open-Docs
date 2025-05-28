[//]: # (title: Ktor 客户端中的 Bearer 认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

Bearer 认证涉及称为 bearer token 的安全令牌。例如，这些令牌可以作为 OAuth 流程的一部分，用于通过 Google、Facebook、Twitter 等外部提供商授权您的应用程序用户。您可以从 Ktor 服务器的 [OAuth 授权流程](server-oauth.md#flow) 部分了解 OAuth 流程可能的样子。

> 在服务器端，Ktor 提供了 [Authentication](server-bearer-auth.md) 插件来处理 Bearer 认证。

## 配置 Bearer 认证 {id="configure"}

Ktor 客户端允许您配置一个令牌，以便使用 `Bearer` 方案在 `Authorization` 请求头中发送。您还可以指定在旧令牌无效时刷新令牌的逻辑。要配置 `bearer` 提供程序，请按照以下步骤操作：

1. 在 `install` 块内调用 `bearer` 函数。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // 配置 Bearer 认证
          }
       }
   }
   ```
   
2. 配置如何使用 `loadTokens` 回调获取初始访问令牌和刷新令牌。此回调旨在从本地存储加载缓存的令牌，并将其作为 `BearerTokens` 实例返回。

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
   
   `abc123` 访问令牌会随着每个 [请求](client-requests.md) 使用 `Bearer` 方案在 `Authorization` 请求头中发送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 指定在旧令牌无效时如何使用 `refreshTokens` 获取新令牌。

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
   
   a. 客户端使用无效的访问令牌向受保护资源发出请求，并获得 `401`（未经授权）响应。
     > 如果安装了[多个提供程序](client-auth.md#realm)，响应应包含 `WWW-Authenticate` 请求头。
   
   b. 客户端自动调用 `refreshTokens` 以获取新令牌。

   c. 客户端此次自动使用新令牌再次向受保护资源发出请求。

4. （可选）指定一个条件，用于在不等待 `401`（未经授权）响应的情况下发送凭据。例如，您可以检查请求是否发送到指定的主机。

   ```kotlin
   install(Auth) {
       bearer {
           // 加载并刷新令牌 ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

## 示例：使用 Bearer 认证访问 Google API {id="example-oauth-google"}

我们来看看如何使用 Bearer 认证访问 Google API，这些 API 使用 [OAuth 2.0 协议](https://developers.google.com/identity/protocols/oauth2) 进行认证和授权。我们将研究 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 控制台应用程序，该应用程序获取 Google 的个人资料信息。 

### 获取客户端凭据 {id="google-client-credentials"}
第一步，我们需要获取访问 Google API 所需的客户端凭据：
1. 创建一个 Google 帐户。
2. 打开 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 并创建 `OAuth client ID` 凭据，应用程序类型选择 `Android`。此客户端 ID 将用于获取[授权许可](#step1)。

### OAuth 授权流程 {id="oauth-flow"}

我们应用程序的 OAuth 授权流程如下所示：

```Console
(1)  --> [[[授权请求|#step1]]]                资源所有者
(2)  <-- [[[授权许可（代码）|#step2]]]           资源所有者
(3)  --> [[[授权许可（代码）|#step3]]]           授权服务器
(4)  <-- [[[访问和刷新令牌|#step4]]]            授权服务器
(5)  --> [[[带有效令牌的请求|#step5]]]             资源服务器
(6)  <-- [[[受保护资源|#step6]]]                   资源服务器
⌛⌛⌛    令牌过期
(7)  --> [[[带过期令牌的请求|#step7]]]           资源服务器
(8)  <-- [[[401 未经授权响应|#step8]]]            资源服务器
(9)  --> [[[授权许可（刷新令牌）|#step9]]]  授权服务器
(10) <-- [[[访问和刷新令牌|#step10]]]            授权服务器
(11) --> [[[带新令牌的请求|#step11]]]               资源服务器
(12) <-- [[[受保护资源|#step12]]]                   资源服务器
```
{disable-links="false"}

让我们研究每个步骤是如何实现的，以及 `Bearer` 认证提供程序如何帮助我们访问 API。

### (1) -> 授权请求 {id="step1"}

第一步，我们需要构建用于请求所需权限的授权链接。为此，我们需要将指定的查询参数附加到 URL：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="23-31"}

- `client_id`：用于访问 Google API 的客户端 ID（[之前已获取](#google-client-credentials)）。
- `scope`：Ktor 应用程序所需的资源范围。在我们的例子中，应用程序请求用户的个人资料信息。
- `response_type`：用于获取访问令牌的授权类型。在我们的例子中，我们需要获取一个授权码。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _环回 IP 地址_ 流程来获取授权码。
   > 要使用此 URL 接收授权码，您的应用程序必须在本地 Web 服务器上监听。
   > 例如，您可以使用 [Ktor 服务器](server-create-and-configure.topic) 将授权码作为查询参数获取。
- `access_type`：访问类型设置为 `offline`，因为当用户不在浏览器前时，我们的控制台应用程序需要刷新访问令牌。

### (2) <- 授权许可（代码） {id="step2"}

在此步骤中，我们从浏览器复制授权码，将其粘贴到控制台，并保存到一个变量中：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="32"}

### (3) -> 授权许可（代码） {id="step3"}

现在我们准备好将授权码换取令牌了。为此，我们需要创建一个客户端并安装带 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 插件。此序列化器是反序列化从 Google OAuth 令牌端点接收到的令牌所必需的。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-41,65"}

使用创建的客户端，我们可以将授权码和其他必要选项作为[表单参数](client-requests.md#form_parameters)安全地传递给令牌端点：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="68-77"}

结果是，令牌端点以 JSON 对象的形式发送令牌，该对象使用已安装的 `json` 序列化器反序列化为 `TokenInfo` 类实例。`TokenInfo` 类如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/TokenInfo.kt" include-lines="3-13"}

### (4) <- 访问和刷新令牌 {id="step4"}

收到令牌后，我们可以将其保存在存储中。在我们的示例中，存储是一个 `BearerTokens` 实例的可变列表。这意味着我们可以将其元素传递给 `loadTokens` 和 `refreshTokens` 回调。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="35-36,78"}

> 请注意，`bearerTokenStorage` 应该在[初始化客户端](#step3)之前创建，因为它将在客户端配置中使用。

### (5) -> 带有效令牌的请求 {id="step5"}

现在我们有了有效的令牌，所以我们可以向受保护的 Google API 发出请求并获取用户信息。首先，我们需要调整客户端[配置](#step3)：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-47,60-65"}

指定了以下设置： 

- 已安装的带有 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 插件，用于反序列化从资源服务器接收到的 JSON 格式的用户信息。

- 带有 `bearer` 提供程序的 [Auth](client-auth.md) 插件配置如下：
   * `loadTokens` 回调从[存储](#step4)加载令牌。
   * `sendWithoutRequest` 回调配置为仅向提供受保护资源访问的主机发送凭据，而无需等待 `401`（未经授权）响应。

此客户端可用于向受保护资源发出请求：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="81"}

### (6) <- 受保护资源 {id="step6"}

资源服务器以 JSON 格式返回用户信息。我们可以将响应反序列化为 `UserInfo` 类实例并显示个性化问候语：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="87-88"}

`UserInfo` 类如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/UserInfo.kt" include-lines="3-13"}

### (7) -> 带过期令牌的请求 {id="step7"}

在某个时候，客户端会像[步骤 5](#step5) 中那样发出请求，但此时的访问令牌已过期。

### (8) <- 401 未经授权响应 {id="step8"}

资源服务器返回 `401` 未经授权响应，因此客户端应调用 `refreshTokens` 回调。 
> 请注意，`401` 响应返回包含错误详细信息的 JSON 数据，在接收响应时我们需要[处理这种情况](#step12)。

### (9) -> 授权许可（刷新令牌） {id="step9"}

要获取新的访问令牌，我们需要配置 `refreshTokens` 并向令牌端点发出另一个请求。这次，我们使用 `refresh_token` 授权类型而不是 `authorization_code`：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="43-44,48-56,59,63-64"}

请注意，`refreshTokens` 回调使用 `RefreshTokensParams` 作为接收器，并允许您访问以下设置：
- `client` 实例。在上面的代码片段中，我们使用它来提交表单参数。
- `oldTokens` 属性用于访问刷新令牌并将其发送到令牌端点。

> `HttpRequestBuilder` 公开的 `markAsRefreshTokenRequest` 函数能够对用于获取刷新令牌的请求进行特殊处理。

### (10) <- 访问和刷新令牌 {id="step10"}

收到新令牌后，我们可以将其保存在[存储](#step4)中，因此 `refreshTokens` 如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="48-59"}

### (11) -> 带新令牌的请求 {id="step11"}

在此步骤中，对受保护资源的请求包含新令牌，并且应该正常工作。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85"}

### (12) <-- 受保护资源 {id="step12"}

鉴于 [401 响应](#step8) 返回包含错误详细信息的 JSON 数据，我们需要更新我们的示例以将错误信息作为 `ErrorInfo` 对象接收：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85-92"}

`ErrorInfo` 类如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/ErrorInfo.kt" include-lines="3-13"}

您可以在此处找到完整示例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。