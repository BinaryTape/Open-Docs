[//]: # (title: Ktor Server 中的表单认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl">auth-form-html-dsl</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session">auth-form-session</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

基于表单的认证使用 [Web 表单](https://developer.mozilla.org/en-US/docs/Learn/Forms)来收集凭据信息并认证用户。要在 Ktor 中创建 Web 表单，您可以使用 [HTML DSL](server-html-dsl.md#html_response) 或选择 JVM [模板引擎](server-templating.md)，例如 FreeMarker、Velocity 等。

> 考虑到在使用基于表单的认证时，用户名和密码以明文形式传递，您需要使用 [HTTPS/TLS](server-ssl.md) 来保护敏感信息。

## 添加依赖 {id="add_dependencies"}
要启用 `form` 认证，您需要在构建脚本中包含 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 基于表单的认证流程 {id="flow"}

基于表单的认证流程可能如下所示：

1.  未认证的客户端向服务器应用程序中的特定[路由](server-routing.md)发起请求。
2.  服务器返回一个 HTML 页面，该页面至少包含一个基于 HTML 的 Web 表单，提示用户输入用户名和密码。
    > Ktor 允许您使用 [Kotlin DSL](server-html-dsl.md) 构建表单，或者您可以选择各种 JVM 模板引擎，例如 FreeMarker、Velocity 等。
3.  当用户提交用户名和密码时，客户端向服务器发出包含 Web 表单数据（包括用户名和密码）的请求。

    ```kotlin
    ```
    {src="snippets/auth-form-html-dsl/post.http"}

    在 Ktor 中，您需要[指定用于获取用户名和密码的参数名](#configure-provider)。

4.  服务器[验证](#configure-provider)客户端发送的凭据并响应请求的内容。

## 安装表单认证 {id="install"}
要安装 `form` 认证提供者，请在 `install` 块内调用 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    form {
        // Configure form authentication
    }
}
```

您可以选择性地指定一个[提供者名称](server-auth.md#provider-name)，该名称可用于[认证指定的路由](#authenticate-route)。

## 配置表单认证 {id="configure"}

### 步骤 1：配置表单提供者 {id="configure-provider"}
`form` 认证提供者通过 [FormAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-form-authentication-provider/-config/index.html) 类暴露其设置。在下面的示例中，指定了以下设置：
*   `userParamName` 和 `passwordParamName` 属性指定了用于获取用户名和密码的参数名。
*   `validate` 函数用于验证用户名和密码。
    `validate` 函数会检查 `UserPasswordCredential` 并在认证成功时返回一个 `UserIdPrincipal`，如果认证失败则返回 `null`。
*   `challenge` 函数指定了认证失败时执行的操作。例如，您可以重定向回登录页面或发送 [UnauthorizedResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="12-27"}

> 至于 `basic` 认证，您也可以使用 [UserHashedTableAuth](server-basic-auth.md#validate-user-hash) 来验证存储在内存表中的用户，该表保存了用户名和密码哈希。

### 步骤 2：保护特定资源 {id="authenticate-route"}

配置 `form` 提供者后，您需要定义一个 `post` 路由，数据将发送到该路由。
然后，将此路由添加到 **[authenticate](server-auth.md#authenticate-route)** 函数中。
在认证成功的情况下，您可以使用 `call.principal` 函数在路由处理器中检索已认证的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，并获取已认证用户的名称。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="29-34,55"}

您可以使用[会话认证](server-session-auth.md)来存储登录用户的 ID。
例如，当用户第一次使用 Web 表单登录时，您可以将用户名保存到 Cookie 会话中，并使用 `session` 提供者在后续请求中授权该用户。