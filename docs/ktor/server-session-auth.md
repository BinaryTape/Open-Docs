[//]: # (title: Ktor 服务器中的会话认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

[会话](server-sessions.md) 提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保留用户偏好设置。

在 Ktor 中，已关联会话的用户可以使用 `session` 提供程序进行认证。例如，当用户首次使用 [Web 表单](server-form-based-auth.md) 登录时，您可以将用户名保存到 cookie 会话中，并在后续请求中使用 `session` 提供程序授权此用户。

> 您可以在 [](server-auth.md) 章节中获取有关 Ktor 认证和授权的一般信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `session` 认证，您需要在构建脚本中包含以下构件：

*   添加 `ktor-server-sessions` 依赖项，用于使用会话：

    <var name="artifact_name" value="ktor-server-sessions"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>

*   添加 `ktor-server-auth` 依赖项，用于认证：

    <var name="artifact_name" value="ktor-server-auth"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>

## 会话认证流程 {id="flow"}

会话认证流程可能有所不同，这取决于用户在您的应用程序中如何认证。让我们看看它在 [基于表单的认证](server-form-based-auth.md) 中是如何实现的：

1.  客户端向服务器发送包含 Web 表单数据（包括用户名和密码）的请求。
2.  服务器验证客户端发送的凭据，将用户名保存到 cookie 会话中，并以请求内容和包含用户名的 cookie 作为响应。
3.  客户端向受保护资源发送带有 cookie 的后续请求。
4.  根据收到的 cookie 数据，Ktor 会检查此用户是否存在 cookie 会话，并（可选地）对收到的会话数据执行额外的验证。如果验证成功，服务器会以请求内容作为响应。

## 安装会话认证 {id="install"}
要安装 `session` 认证提供程序，请在 `install` 块内调用带有所需会话类型的 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // 配置会话认证
    }
}
```

## 配置会话认证 {id="configure"}

本节演示了如何通过 [基于表单的认证](server-form-based-auth.md) 认证用户，将此用户的信息保存到 cookie 会话中，然后在后续请求中使用 `session` 提供程序授权此用户。

> 有关完整示例，请参阅 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步骤 1: 创建数据类 {id="data-class"}

首先，您需要创建一个用于存储会话数据的数据类：

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

### 步骤 2: 安装和配置会话 {id="install-session"}

创建数据类后，您需要安装并配置 `Sessions` 插件。以下示例安装并配置了一个具有指定 cookie 路径和过期时间的 cookie 会话。

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

> 要了解更多关于配置会话的信息，请参阅 [](server-sessions.md#configuration_overview)。

### 步骤 3: 配置会话认证 {id="configure-session-auth"}

`session` 认证提供程序通过 [`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html) 类公开其设置。在下面的示例中，指定了以下设置：

*   `validate()` 函数检查 [会话实例](#data-class)，并在认证成功的情况下返回 `Any` 类型的 principal。
*   `challenge()` 函数指定认证失败时执行的操作。例如，您可以重定向回登录页面或发送一个 [`UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="22,34-46"}

### 步骤 4: 在会话中保存用户数据 {id="save-session"}

要将已登录用户的信息保存到会话中，请使用 [`call.sessions.set()`](server-sessions.md#use_sessions) 函数。

以下示例展示了一个使用 Web 表单的简单认证流程：

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="69-75"}

> 有关基于表单的认证流程的更多详细信息，请参阅 [基于表单的认证](server-form-based-auth.md) 文档。

### 步骤 5: 保护特定资源 {id="authenticate-route"}

配置 `session` 提供程序后，您可以使用 [`authenticate()`](server-auth.md#authenticate-route) 函数保护应用程序中的特定资源。

认证成功后，您可以通过在路由处理程序内使用 `call.principal()` 函数来检索已认证的 principal（在此示例中，是 [`UserSession`](#data-class) 实例）：

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-83"}

> 有关完整示例，请参阅 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。