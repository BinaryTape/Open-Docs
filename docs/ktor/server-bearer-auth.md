[//]: # (title: Ktor 服务器中的承载认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必需的依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

承载认证 (Bearer authentication) 方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的一部分，用于访问控制和身份验证。该方案涉及称为承载令牌 (bearer tokens) 的安全令牌。承载认证方案可作为 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但你也可以提供自定义逻辑来授权承载令牌。

你可以在 [](server-auth.md) 部分获取有关 Ktor 中认证的常规信息。

> 承载认证应仅通过 [HTTPS/TLS](server-ssl.md) 使用。

## 添加依赖项 {id="add_dependencies"}
要启用 `bearer` 认证，你需要在构建脚本中包含 `%artifact_name%` 工件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 承载认证流程 {id="flow"}

通常，承载认证流程可能如下所示：

1. 用户成功认证并授权访问后，服务器将访问令牌返回给客户端。
2. 客户端可以使用 `Bearer` 方案，将令牌通过 `Authorization` 头传递到受保护资源。
   ```HTTP
   ```
   {src="snippets/auth-bearer/get.http"}
3. 服务器接收请求并[验证](#configure)令牌。
4. 验证后，服务器返回受保护资源的内容。

## 安装承载认证 {id="install"}
要安装 `bearer` 认证提供者，请在 `install` 块中调用 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

你可以选择指定一个[提供者名称](server-auth.md#provider-name)，该名称可用于[认证指定的路由](#authenticate-route)。

## 配置承载认证 {id="configure"}

要了解如何在 Ktor 中配置不同的认证提供者，请参阅 [](server-auth.md#configure)。在本节中，我们将介绍 `bearer` 认证提供者的具体配置。

### 步骤 1：配置承载提供者 {id="configure-provider"}

`bearer` 认证提供者通过 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 类公开其设置。在下面的示例中，指定了以下设置：
* `realm` 属性设置要在 `WWW-Authenticate` 头中传递的领域。
* `authenticate` 函数检查客户端发送的令牌，并在认证成功时返回 `UserIdPrincipal`，或在认证失败时返回 `null`。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="9-20"}

### 步骤 2：保护特定资源 {id="authenticate-route"}

配置 `bearer` 提供者后，你可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。如果认证成功，你可以在路由处理器内部使用 `call.principal` 函数检索已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取认证用户的名称。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="21-27"}