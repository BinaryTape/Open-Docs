[//]: # (title: Ktor 服务器中的身份验证和授权)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 插件在 Ktor 中处理身份验证和授权。
</link-summary>

Ktor 提供了 [Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html) 插件来处理身份验证和授权。典型的使用场景包括用户登录、授予特定资源访问权限以及在各方之间安全传输信息。你还可以将 `Authentication` 与[会话 (Sessions)](server-sessions.md) 结合使用，以在请求之间保留用户信息。

> 在客户端，Ktor 提供了 [Authentication](client-auth.md) 插件来处理身份验证和授权。

## 支持的身份验证类型 {id="supported"}
Ktor 支持以下身份验证和授权方案：

### HTTP 身份验证 {id="http-auth"}
HTTP 提供了用于访问控制和身份验证的[通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)。在 Ktor 中，你可以使用以下 HTTP 身份验证方案：
* [Basic](server-basic-auth.md) - 使用 `Base64` 编码提供用户名和密码。通常不建议单独使用，除非与 HTTPS 结合使用。
* [Digest](server-digest-auth.md) - 一种通过对用户名和密码应用哈希函数来以加密形式传输用户凭据的身份验证方法。
* [Bearer](server-bearer-auth.md) - 一种涉及称为不记名令牌（bearer tokens）的安全令牌的身份验证方案。不记名（Bearer）身份验证方案是 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分，但你也可以提供自定义逻辑来授权不记名令牌。

### 基于表单的身份验证 {id="form-auth"}
[基于表单](server-form-based-auth.md)的身份验证使用 [Web 表单](https://developer.mozilla.org/en-US/docs/Learn/Forms)来收集凭据信息并验证用户。

### JSON Web 令牌 (JWT) {id="jwt"}
[JSON Web 令牌 (JSON Web Token)](server-jwt.md) 是一种开放标准，用于以 JSON 对象的形式安全地在各方之间传输信息。你可以使用 JSON Web 令牌进行授权：当用户登录后，每个请求都将包含一个令牌，允许用户访问该令牌所允许的资源。在 Ktor 中，你可以使用 `jwt` 身份验证来验证令牌并验证其中包含的声明。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一种开放的跨平台协议，用于目录服务身份验证。Ktor 提供了 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函数，用于针对指定的 LDAP 服务器验证用户凭据。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一种用于保护 API 访问的开放标准。Ktor 中的 `oauth` 提供程序允许你使用 Google、Facebook、Twitter 等外部提供程序实现身份验证。

### 会话 (Session) {id="sessions"}
[会话 (Sessions)](server-sessions.md) 提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保留用户偏好设置。在 Ktor 中，已有关联会话的用户可以使用 `session` 提供程序进行身份验证。请从 [](server-session-auth.md) 了解如何操作。

### 自定义 {id="custom"}
Ktor 还提供了用于创建[自定义插件 (custom plugins)](server-custom-plugins.md) 的 API，可用于实现自己的插件来处理身份验证和授权。例如，`AuthenticationChecked` [钩子 (hook)](server-custom-plugins.md#call-handling) 在身份验证凭据检查后执行，它允许你实现授权：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

请注意，某些身份验证提供程序，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要额外的工件。

## 安装 Authentication {id="install"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 Authentication {id="configure"}
[安装 Authentication](#install) 后，你可以按如下方式配置和使用 `Authentication`：

### 步骤 1：选择身份验证提供程序 {id="choose-provider"}

要使用特定的身份验证提供程序，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，你需要在 `install` 块内调用相应的函数。例如，要使用 basic 身份验证，请调用 [`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
}
```

在此函数内部，你可以[配置](#configure-provider)此提供程序特有的设置。

### 步骤 2：指定提供程序名称 {id="provider-name"}

[使用特定提供程序](#choose-provider)的函数允许你选择性地指定提供程序名称。下面的代码示例分别安装了名为 `"auth-basic"` 和 `"auth-form"` 的 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 和 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 提供程序：

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
    form("auth-form") {
        // [[[Configure form authentication|server-form-based-auth.md]]]
    }
    // ...
}
```
{disable-links="false"}

这些名称以后可用于[验证不同的路由](#authenticate-route)。
> 请注意，提供程序名称应该是唯一的，并且你只能定义一个没有名称的提供程序。
>
{style="note"}

### 步骤 3：配置提供程序 {id="configure-provider"}

每种[提供程序类型](#choose-provider)都有自己的配置。例如，[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 类为 [`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函数提供选项。此类中的关键函数是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)，它负责验证用户名和密码。以下代码示例演示了其用法：

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}

为了理解 `validate()` 函数的工作原理，我们需要引入两个术语：

*   _principal_（主体）是可进行身份验证的实体：用户、计算机、服务等。在 Ktor 中，各种身份验证提供程序可能使用不同的 principal。例如，`basic`、`digest` 和 `form` 提供程序验证 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，而 `jwt` 提供程序验证 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
    > 你还可以创建自定义 principal。这在以下情况中可能很有用：
    > - 将凭据映射到自定义 principal 允许你在[路由处理程序](#get-principal)内部拥有关于已验证 principal 的额外信息。
    > - 如果你使用[会话身份验证](server-session-auth.md)，principal 可能是一个存储会话数据的数据类。
*   _credential_（凭据）是服务器用于验证 principal 的一组属性：用户名/密码对、API 密钥等。例如，`basic` 和 `form` 提供程序使用 [`UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 来验证用户名和密码，而 `jwt` 验证 [`JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函数检查指定的凭据，并在身份验证成功时返回一个 principal `Any`，如果身份验证失败则返回 `null`。

> 要根据特定条件跳过身份验证，请使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。例如，如果[会话 (session)](server-sessions.md) 已存在，则可以跳过 `basic` 身份验证：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 步骤 4：保护特定资源 {id="authenticate-route"}

最后一步是保护应用程序中的特定资源。你可以通过使用 [`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html) 函数来完成此操作。此函数接受两个可选参数：

-   一个[提供程序名称](#provider-name)，用于验证嵌套路由。下面的代码片段使用名为 _auth-basic_ 的提供程序来保护 `/login` 和 `/orders` 路由：
    ```kotlin
    routing {
        authenticate("auth-basic") {
            get("/login") {
                // ...
            }    
            get("/orders") {
                // ...
            }    
        }
        get("/") {
            // ...
        }
    }
    ```
-   一种用于解析嵌套身份验证提供程序的策略。此策略由 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html) 枚举值表示。

    例如，客户端应为所有使用 `AuthenticationStrategy.Required` 策略注册的提供程序提供身份验证数据。在下面的代码片段中，只有通过[会话身份验证](server-session-auth.md)的用户才能尝试使用 basic 身份验证访问 `/admin` 路由：
    ```kotlin
    routing {
        authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
            get("/hello") {
                // ...
            }    
            authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
                get("/admin") {
                    // ...
                }
            }  
        }
    }
    ```

> 有关完整示例，请参阅 [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步骤 5：在路由处理程序中获取 principal {id="get-principal"}

身份验证成功后，你可以使用 `call.principal()` 函数在路由处理程序中检索已验证的 principal。此函数接受[已配置的身份验证提供程序](#configure-provider)返回的特定 principal 类型。在以下示例中，`call.principal()` 用于获取 `UserIdPrincipal` 并获取已验证用户的名称。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

如果你使用[会话身份验证](server-session-auth.md)，principal 可能是一个存储会话数据的数据类。因此，你需要将此数据类传递给 `call.principal()`：

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-79,82-83"}

在[嵌套身份验证提供程序](#authenticate-route)的情况下，你可以将[提供程序名称](#provider-name)传递给 `call.principal()` 以获取所需提供程序的 principal。

在下面的示例中，传递了 `"auth-session"` 值以获取最顶层会话提供程序的 principal：

```kotlin
```
{src="snippets/auth-form-session-nested/src/main/kotlin/com/example/Application.kt" include-lines="87,93-95,97-99"}