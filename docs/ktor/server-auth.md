[//]: # (title: Ktor Server 中的认证与授权)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 插件在 Ktor 中处理认证与授权。
</link-summary>

Ktor 提供
[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)
插件来处理认证与授权。典型的使用场景包括用户登录、授予特定资源访问权限以及在各方之间安全传输信息。你还可以将 `Authentication`
与 [Sessions](server-sessions.md) 结合使用，以在请求之间保留用户信息。

> 在客户端，Ktor 提供了 [Authentication](client-auth.md) 插件来处理认证与授权。

## 支持的认证类型 {id="supported"}
Ktor 支持以下认证与授权方案：

### HTTP 认证 {id="http-auth"}
HTTP 提供了一个[通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)用于访问控制和认证。在 Ktor 中，你可以使用以下 HTTP 认证方案：
*   [Basic](server-basic-auth.md) - 使用 `Base64` 编码提供用户名和密码。通常不建议在不结合 HTTPS 的情况下使用。
*   [Digest](server-digest-auth.md) - 一种认证方法，通过对用户名和密码应用哈希函数，以加密形式传递用户凭证。
*   [Bearer](server-bearer-auth.md) - 一种涉及称为不记名令牌（bearer tokens）的安全令牌的认证方案。
    不记名认证方案作为 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但你也可以提供自定义逻辑来授权不记名令牌。

### 基于表单的认证 {id="form-auth"}
[基于表单的](server-form-based-auth.md)认证使用[网页表单](https://developer.mozilla.org/en-US/docs/Learn/Forms)来收集凭证信息并认证用户。

### JSON Web 令牌 (JWT) {id="jwt"}
[JSON Web 令牌](server-jwt.md)是一种开放标准，用于以 JSON 对象的形式在各方之间安全地传输信息。你可以使用 JSON Web 令牌进行授权：当用户登录后，每个请求都将包含一个令牌，允许用户访问该令牌所允许的资源。在 Ktor 中，你可以使用 `jwt` 认证来验证令牌并验证其中包含的声明。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一种开放的、跨平台的协议，用于目录服务认证。Ktor 提供了 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函数，用于根据指定的 LDAP 服务器认证用户凭证。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一种用于保护 API 访问的开放标准。Ktor 中的 `oauth` 提供者允许你使用外部提供者（例如 Google、Facebook、Twitter 等）来实现认证。

### 会话 {id="sessions"}
[会话](server-sessions.md)提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保留用户偏好。在 Ktor 中，已关联会话的用户可以使用 `session` 提供者进行认证。请从 [](server-session-auth.md) 了解如何实现。

### 自定义 {id="custom"}
Ktor 还提供了用于创建[自定义插件](server-custom-plugins.md)的 API，可用于实现自己的认证与授权处理插件。
例如，`AuthenticationChecked` [钩子](server-custom-plugins.md#call-handling)在认证凭证被检测后执行，它允许你实现授权：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
    </p>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>

请注意，某些认证提供者，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要额外的构件。

## 安装 Authentication {id="install"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过对路由进行分组来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是一个 <code>Application</code> 类的扩展函数。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>

## 配置 Authentication {id="configure"}
[安装 Authentication](#install) 后，你可以按以下方式配置和使用 `Authentication`：

### 步骤 1: 选择认证提供者 {id="choose-provider"}

要使用特定的认证
提供者，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，
你需要调用 `install` 代码块中的相应函数。例如，要使用 basic 认证，
请调用 [`
.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // Configure basic authentication
    }
}
```

在此函数内部，你可以[配置](#configure-provider)此提供者特有的设置。

### 步骤 2: 指定提供者名称 {id="provider-name"}

[使用特定提供者](#choose-provider)的函数允许你选择性地指定提供者名称。以下代码示例安装了
[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
和 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 提供者，
名称分别为 `"auth-basic"` 和 `"auth-form"`：

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // Configure basic authentication
    }
    form("auth-form") {
        // Configure form authentication
    }
    // ...
}
```
{disable-links="false"}

这些名称稍后可用于[使用不同的提供者认证不同的路由](#authenticate-route)。
> 请注意，提供者名称应该是唯一的，并且你只能定义一个不带名称的提供者。
>
{style="note"}

### 步骤 3: 配置提供者 {id="configure-provider"}

每种[提供者类型](#choose-provider)都有自己的配置。例如，
[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)
类为 [`
.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函数提供了选项。这个类中的关键函数是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)
，它负责验证用户名和密码。以下代码示例演示了其用法：

[object Promise]

要理解 `validate()` 函数的工作原理，我们需要引入两个术语：

*   _主体 (principal)_ 是可以被认证的实体：用户、计算机、服务等。在 Ktor 中，各种
    认证提供者可能会使用不同的主体。例如，`basic`、`digest` 和 `form` 提供者认证 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)
    而 `jwt` 提供者
    则验证 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
    > 你也可以创建自定义主体。这在以下情况中可能很有用：
    > - 将凭证映射到自定义主体，可以让你在[路由处理程序](#get-principal)内部拥有关于已认证主体的额外信息。
    > - 如果你使用[会话认证](server-session-auth.md)，主体可能是一个存储会话数据的数据类。
*   _凭证 (credential)_ 是一组用于服务器认证主体的属性：用户名/密码对、API 密钥等。
    例如，`basic` 和 `form` 提供者
    使用 [`
    UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)
    来验证用户名和密码，而 `jwt`
    则验证 [`
    JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函数会检测指定的凭证，并在认证成功时返回一个 `Any` 类型的主体，如果认证失败则返回 `null`。

> 要根据特定条件跳过认证，
> 请使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。
> 例如，如果[会话](server-sessions.md)已存在，你可以跳过 `basic` 认证：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }
> ```

### 步骤 4: 保护特定资源 {id="authenticate-route"}

最后一步是保护应用程序中的特定资源。你可以通过使用 [`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)
函数来完成此操作。此函数接受两个可选参数：

*   用于认证嵌套路由的[提供者名称](#provider-name)。
    以下代码片段使用名为 _auth-basic_ 的提供者来保护 `/login` 和 `/orders` 路由：
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
*   用于解析嵌套认证提供者的策略 (strategy)。
    此策略由 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)
    枚举值表示。

    例如，客户端应为所有使用 `AuthenticationStrategy.Required` 策略注册的提供者提供认证数据。
    在以下代码片段中，只有通过[会话认证](server-session-auth.md)的用户
    才能尝试使用 basic 认证访问 `/admin` 路由：
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

> 有关完整示例，请参阅
> [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步骤 5: 在路由处理程序中获取主体 {id="get-principal"}

认证成功后，你可以使用 `call.principal()` 函数在路由处理程序中检索
已认证的主体。此函数接受[已配置的认证提供者](#configure-provider)返回的特定主体类型。在以下示例中，
`call.principal()` 用于获取 `UserIdPrincipal` 并获取已认证用户的名称。

[object Promise]

如果你使用[会话认证](server-session-auth.md)，主体可能是一个存储会话数据的数据类。
因此，你需要将此数据类传递给 `call.principal()`：

[object Promise]

在[嵌套认证提供者](#authenticate-route)的情况下，
你可以将[提供者名称](#provider-name)传递给 `call.principal()` 以获取所需提供者的主体。

在下面的示例中，传递 `"auth-session"` 值以获取最顶层会话提供者的主体：

[object Promise]