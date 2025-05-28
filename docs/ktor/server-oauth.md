[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[OAuth](https://oauth.net/) 是一种用于访问委托的开放标准。OAuth 可用于通过外部提供商（如 Google、Facebook、Twitter 等）授权您的应用程序用户。

`oauth` 提供商支持授权码流程。您可以在一个地方配置 OAuth 参数，Ktor 将自动使用必要的参数向指定的授权服务器发出请求。

> 您可以在 [](server-auth.md) 部分获取有关 Ktor 中认证和授权的通用信息。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装会话插件

为了避免客户端每次尝试访问受保护资源时都请求授权，您可以在成功授权后将会话令牌存储在会话中。
然后，您可以在受保护路由的处理程序中从当前会话中检索访问令牌，并使用它来请求资源。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="14,25-29,101,128-129"}

## OAuth 授权流程 {id="flow"}

Ktor 应用程序中的 OAuth 授权流程可能如下所示：

1.  用户在 Ktor 应用程序中打开登录页面。
2.  Ktor 自动重定向到特定提供商的授权页面，并传递必要的[参数](#configure-oauth-provider)：
    *   用于访问所选提供商 API 的客户端 ID。
    *   指定授权完成后将打开的 Ktor 应用程序页面的回调或重定向 URL。
    *   Ktor 应用程序所需的第三方资源范围 (scopes)。
    *   用于获取访问令牌的授权类型 (Authorization Code)。
    *   用于缓解 CSRF 攻击和重定向用户的 `state` 参数。
    *   特定提供商的可选参数。
3.  授权页面显示一个同意屏幕，其中包含 Ktor 应用程序所需的权限级别。这些权限取决于在 [](#configure-oauth-provider) 中配置的指定范围。
4.  如果用户批准了请求的权限，授权服务器将重定向回指定的重定向 URL 并发送授权码。
5.  Ktor 再次自动向指定的访问令牌 URL 发出请求，其中包括以下参数：
    *   授权码。
    *   客户端 ID 和客户端秘钥。

    授权服务器通过返回访问令牌进行响应。
6.  客户端随后可以使用此令牌向所选提供商所需的服务发出请求。在大多数情况下，令牌将使用 `Bearer` 方案在 `Authorization` 头中发送。
7.  服务验证令牌，使用其范围进行授权，并返回请求的数据。

## 安装 OAuth {id="install"}

要安装 `oauth` 认证提供商，请在 `install` 块内调用 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 函数。
（可选）您可以[指定提供商名称](server-auth.md#provider-name)。
例如，要安装名称为 "auth-oauth-google" 的 `oauth` 提供商，它将如下所示：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="9-10,25-26,31-33,54-55,101"}

## 配置 OAuth {id="configure-oauth"}

本节演示如何配置 `oauth` 提供商，以使用 Google 授权您的应用程序用户。
有关完整的可运行示例，请参阅 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 先决条件：创建授权凭据 {id="authorization-credentials"}

要访问 Google API，您需要在 Google Cloud Console 中创建授权凭据。

1.  在 Google Cloud Console 中打开 [凭据](https://console.cloud.google.com/apis/credentials) 页面。
2.  点击 **创建凭据** (CREATE CREDENTIALS) 并选择 `OAuth 客户端 ID`。
3.  从下拉列表中选择 `Web 应用程序`。
4.  指定以下设置：
    *   **授权的 JavaScript 来源** (Authorised JavaScript origins)：`http://localhost:8080`。
    *   **授权的重定向 URI** (Authorised redirect URIs)：`http://localhost:8080/callback`。
        在 Ktor 中，[urlProvider](#configure-oauth-provider) 属性用于指定授权完成后将打开的重定向路由。

5.  点击 **创建** (CREATE)。
6.  在弹出的对话框中，复制创建的客户端 ID 和客户端秘钥，它们将用于配置 `oauth` 提供商。

### 步骤 1：创建 HTTP 客户端 {id="create-http-client"}

在配置 `oauth` 提供商之前，您需要创建 [HttpClient](client-create-and-configure.md)，服务器将使用它向 OAuth 服务器发出请求。
[ContentNegotiation](client-serialization.md) 客户端插件和 JSON 序列化器是必需的，以便在[向 API 发出请求](#request-api)后反序列化接收到的 JSON 数据。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="20-24"}

客户端实例被传递给 `main` [模块函数](server-modules.md)，以便能够在服务器[测试](server-testing.md)中创建单独的客户端实例。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="26,101"}

### 步骤 2：配置 OAuth 提供商 {id="configure-oauth-provider"}

下面的代码片段展示了如何使用 `auth-oauth-google` 名称创建和配置 `oauth` 提供商。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="30-54"}

*   `urlProvider` 指定授权完成后将调用的[重定向路由](#redirect-route)。
    > 确保此路由已添加到[**授权的重定向 URI**](#authorization-credentials)列表中。
*   `providerLookup` 允许您为所需的提供商指定 OAuth 设置。这些设置由 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 类表示，并允许 Ktor 自动向 OAuth 服务器发出请求。
*   `client` 属性指定 Ktor 用于向 OAuth 服务器发出请求的 [HttpClient](#create-http-client)。

### 步骤 3：添加登录路由 {id="login-route"}

配置 `oauth` 提供商后，您需要在 `authenticate` 函数内部[创建受保护的登录路由](server-auth.md#authenticate-route)，该函数接受 `oauth` 提供商的名称。
当 Ktor 收到对此路由的请求时，它将自动重定向到 [providerLookup](#configure-oauth-provider) 中定义的 `authorizeUrl`。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-60,76,100"}

用户将看到授权页面，其中包含 Ktor 应用程序所需的权限级别。这些权限取决于 [providerLookup](#configure-oauth-provider) 中指定的 `defaultScopes`。

### 步骤 4：添加重定向路由 {id="redirect-route"}

除了登录路由，您还需要为 `urlProvider` 创建重定向路由，如 [](#configure-oauth-provider) 中所述。

在此路由内部，您可以使用 `call.principal` 函数检索 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 对象。
`OAuthAccessTokenResponse` 允许您访问令牌和 OAuth 服务器返回的其他参数。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-76,100"}

在此示例中，接收到令牌后执行以下操作：

*   令牌被保存到[会话](server-sessions.md)中，其内容可以在其他路由中访问。
*   用户被重定向到将向 Google API 发出请求的下一个路由。
*   如果未找到请求的路由，用户将被重定向到 `/home` 路由。

### 步骤 5：向 API 发出请求 {id="request-api"}

在[重定向路由](#redirect-route)中接收到令牌并将其保存到会话后，您可以使用此令牌向外部 API 发出请求。
下面的代码片段展示了如何使用 [HttpClient](#create-http-client) 发出此类请求，并通过在 `Authorization` 头中发送此令牌来获取用户信息。

创建一个名为 `getPersonalGreeting` 的新函数，它将发出请求并返回响应正文：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="103-110"}

然后，您可以在 `get` 路由中调用该函数以检索用户信息：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="93-99"}

有关完整的可运行示例，请参阅 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。