[//]: # (title: Ktor 服务器中的表单认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl">auth-form-html-dsl</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session">auth-form-session</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 且允许你无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

表单认证使用 [Web 表单](https://developer.mozilla.org/en-US/docs/Learn/Forms) 来收集凭证信息并认证用户。要在 Ktor 中创建 Web 表单，你可以使用 [HTML DSL](server-html-dsl.md#html_response)，或选择 JVM [模板引擎](server-templating.md)，例如 FreeMarker、Velocity 等。

> 鉴于在使用表单认证时，用户名和密码以明文形式传递，你需要使用 [HTTPS/TLS](server-ssl.md) 来保护敏感信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `form` 认证，你需要在构建脚本中包含 `%artifact_name%` artifact：

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
    

## 表单认证流程 {id="flow"}

表单认证流程可能如下所示：

1. 未认证的客户端向服务器应用程序中的特定 [路由](server-routing.md) 发出请求。
2. 服务器返回一个 HTML 页面，该页面至少包含一个基于 HTML 的 Web 表单，提示用户输入用户名和密码。 
   > Ktor 允许你使用 [Kotlin DSL](server-html-dsl.md) 构建表单，或者你可以选择各种 JVM 模板引擎，例如 FreeMarker、Velocity 等。
3. 当用户提交用户名和密码时，客户端向服务器发出包含 Web 表单数据（包括用户名和密码）的请求。
   
   [object Promise]
   
   在 Ktor 中，你需要[指定参数名称](#configure-provider) 用于获取用户名和密码。

4. 服务器[验证](#configure-provider) 客户端发送的凭证，并响应所请求的内容。

## 安装表单认证 {id="install"}
要安装 `form` 认证提供者，在 `install` 代码块内调用 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    form {
        // 配置表单认证
    }
}
```

你可以可选地指定一个[提供者名称](server-auth.md#provider-name)，该名称可用于[认证指定路由](#authenticate-route)。

## 配置表单认证 {id="configure"}

### 步骤 1：配置表单提供者 {id="configure-provider"}
`form` 认证提供者通过 [FormAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-form-authentication-provider/-config/index.html) 类暴露其设置。在下面的示例中，指定了以下设置：
* `userParamName` 和 `passwordParamName` 属性指定用于获取用户名和密码的参数名称。
* `validate` 函数验证用户名和密码。
  `validate` 函数检测 `UserPasswordCredential`，并在认证成功的情况下返回一个 `UserIdPrincipal`，如果认证失败则返回 `null`。
* `challenge` 函数指定在认证失败时执行的操作。例如，你可以重定向回登录页面或发送 [UnauthorizedResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

[object Promise]

> 至于 `basic` 认证，你也可以使用 [UserHashedTableAuth](server-basic-auth.md#validate-user-hash) 来验证存储在内存表中并保存用户名和密码哈希的用户。

### 步骤 2：保护特定资源 {id="authenticate-route"}

配置 `form` 提供者后，你需要定义一个 `post` 路由，数据将被发送到该路由。
然后，将此路由添加到 **[authenticate](server-auth.md#authenticate-route)** 函数内。
在认证成功的情况下，你可以在路由处理器内部使用 `call.principal` 函数检索一个已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取已认证用户的名称。

[object Promise]

你可以使用 [会话认证](server-session-auth.md) 来存储登录用户的 ID。
例如，当用户首次使用 Web 表单登录时，你可以将用户名保存到 cookie 会话中，并使用 `session` 提供者在后续请求中授权此用户。