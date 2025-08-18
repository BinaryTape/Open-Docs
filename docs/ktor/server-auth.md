[//]: # (title: Ktor 服务器中的认证与授权)

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
Ktor 中的 Authentication 插件负责处理认证和授权。
</link-summary>

Ktor 提供了 [Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html) 插件来处理认证和授权。典型使用场景包括用户登录、授予对特定资源的访问权限以及在各方之间安全地传输信息。您还可以将 `Authentication` 与 [Sessions](server-sessions.md) 结合使用，以在请求之间保留用户的会话信息。

> 在客户端，Ktor 提供了 [Authentication](client-auth.md) 插件用于处理认证和授权。

## 支持的认证类型 {id="supported"}
Ktor 支持以下认证和授权方案：

### HTTP 认证 {id="http-auth"}
HTTP 提供了 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用于访问控制和认证。在 Ktor 中，您可以使用以下 HTTP 认证方案：
* [Basic](server-basic-auth.md) - 使用 `Base64` 编码提供用户名和密码。通常不建议单独使用，除非与 HTTPS 结合使用。
* [Digest](server-digest-auth.md) - 一种认证方法，通过对用户名和密码应用哈希函数，以加密形式通信用户凭据。
* [Bearer](server-bearer-auth.md) - 一种涉及称为 bearer 令牌的安全令牌的认证方案。
  Bearer 认证方案作为 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以为授权 bearer 令牌提供自定义逻辑。

### 基于表单的认证 {id="form-auth"}
[基于表单的](server-form-based-auth.md)认证使用 [Web 表单](https://developer.mozilla.org/en-US/docs/Learn/Forms) 收集凭据信息并认证用户。

### JSON Web Token (JWT) {id="jwt"}
[JSON Web Token](server-jwt.md) 是一种开放标准，用于将信息作为 JSON 对象在各方之间安全传输。您可以将 JSON Web Token 用于授权：当用户登录后，每个请求都将包含一个 token，允许用户访问该 token 允许的资源。在 Ktor 中，您可以使用 `jwt` 认证来验证 token 并校验其中包含的声明。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一种开放且跨平台的协议，用于目录服务认证。Ktor 提供了 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函数，用于根据指定的 LDAP 服务器认证用户凭据。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一种用于保护 API 访问安全的开放标准。Ktor 中的 `oauth` 提供者允许您使用 Google、Facebook、Twitter 等外部提供者实现认证。

### Session {id="sessions"}
[Sessions](server-sessions.md) 提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储登录用户的 ID、购物车内容或在客户端保存用户偏好。在 Ktor 中，已有关联 session 的用户可以使用 `session` 提供者进行认证。关于如何实现，请参阅 [Ktor 服务器中的 Session 认证](server-session-auth.md)。

### 自定义 {id="custom"}
Ktor 还提供了用于创建 [自定义插件](server-custom-plugins.md) 的 API，可用于实现您自己的插件来处理认证和授权。
例如，`AuthenticationChecked` [钩子](server-custom-plugins.md#call-handling) 在认证凭据检测后执行，它允许您实现授权：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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

请注意，一些认证提供者，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要额外的 artifacts。

## 安装 Authentication {id="install"}

<p>
    要 <a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序中，
    请将其传递给指定 <Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links> 中的 <code>install</code> 函数。
    下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置 Authentication {id="configure"}
安装 Authentication 后，您可以按如下方式配置和使用 `Authentication`：

### 步骤 1：选择认证提供者 {id="choose-provider"}

要使用特定的认证提供者，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，
您需要在 `install` 代码块中调用相应的函数。例如，要使用 basic 认证，
请调用 [
`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
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

在此函数中，您可以 [配置](#configure-provider) 此提供者特有的设置。

### 步骤 2：指定提供者名称 {id="provider-name"}

用于 [使用特定提供者](#choose-provider) 的函数可选地允许您指定提供者名称。下面的代码
示例安装了 basic 和 form 提供者，分别命名为 `"auth-basic"` 和 `"auth-form"`：

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

这些名称稍后可以使用来 [认证不同的路由](#authenticate-route)，使用不同的提供者。
> 请注意，提供者名称应该是唯一的，并且您只能定义一个没有名称的提供者。
>
{style="note"}

### 步骤 3：配置提供者 {id="configure-provider"}

每种 [提供者类型](#choose-provider) 都有自己的配置。例如，
[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)
类为 [
`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函数提供选项。此类中的关键函数是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)，
它负责校验用户名和密码。以下代码示例演示了其用法：

```kotlin
install(Authentication) {
    basic("auth-basic") {
        realm = "Access to the '/' path"
        validate { credentials ->
            if (credentials.name == "jetbrains" && credentials.password == "foobar") {
                UserIdPrincipal(credentials.name)
            } else {
                null
            }
        }
    }
}
```

要理解 `validate()` 函数的工作原理，我们需要介绍两个术语：

* principal 是一种可以被认证的实体：用户、计算机、服务等。在 Ktor 中，各种认证提供者可能会使用不同的 principal。例如，`basic`、`digest` 和 `form` 提供者认证 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，
  而 `jwt` 提供者验证 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
  > 您也可以创建自定义 principal。这在以下情况下可能很有用：
  > - 将凭据映射到自定义 principal 允许您在 [路由处理器](#get-principal) 内部获取已认证 principal 的额外信息。
  > - 如果您使用 [session 认证](server-session-auth.md)，principal 可能是一个存储 session 数据的数据类。
* credential 是一组服务器用于认证 principal 的属性：用户名/密码对、API 密钥等。例如，`basic` 和 `form` 提供者使用 [
  `UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)
  校验用户名和密码，而 `jwt`
  校验 [
  `JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函数会检测指定的凭据并在认证成功的情况下返回一个 `Any` 类型的 principal，或在认证失败时返回 `null`。

> 要根据特定条件跳过认证，
> 请使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。
> 例如，如果 [session](server-sessions.md) 已存在，您可以跳过 `basic` 认证：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 步骤 4：保护特定资源 {id="authenticate-route"}

最后一步是保护应用程序中的特定资源。您可以使用
[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)
函数来实现。此函数接受两个可选形参：

- 用于认证嵌套路由的 [提供者名称](#provider-name)。
  下面的代码片段使用名为 _auth-basic_ 的提供者来保护 `/login` 和 `/orders` 路由：
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
- 用于解析嵌套认证提供者的策略。
  此策略由 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)
  枚举值表示。

  例如，客户端应为所有使用 `AuthenticationStrategy.Required` 策略注册的提供者提供认证数据。
  在下面的代码片段中，只有通过 [session 认证](server-session-auth.md) 的用户才能尝试使用 basic 认证访问 `/admin` 路由：
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

> 完整示例请参阅 [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步骤 5：在路由处理器内部获取 principal {id="get-principal"}

认证成功后，您可以使用 `call.principal()` 函数在路由处理器内部检索已认证的 principal。此函数接受由 [配置的认证提供者](#configure-provider) 返回的特定 principal 类型。在以下示例中，`call.principal()` 用于获取 `UserIdPrincipal` 并获取已认证用户的名称。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

如果您使用 [session 认证](server-session-auth.md)，principal 可能是一个存储 session 数据的数据类。
因此，您需要将此数据类传递给 `call.principal()`：

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
    }
}
```

在 [嵌套认证提供者](#authenticate-route) 的情况下，您可以将 [提供者名称](#provider-name) 传递给 `call.principal()` 以获取所需提供者的 principal。

在下面的示例中，传递了 `"auth-session"` 值以获取顶层 session 提供者的 principal：

```kotlin
authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
    authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
        get("/admin") {
            val userSession = call.principal<UserSession>("auth-session")
        }
    }
}
```