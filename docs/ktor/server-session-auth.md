[//]: # (title: Ktor Server 中的会话认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必需依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您在无需额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

[会话](server-sessions.md) 提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保存用户偏好。

在 Ktor 中，已有关联会话的用户可以使用 `session` 提供者进行认证。例如，当用户首次使用 [Web 表单](server-form-based-auth.md)登录时，您可以将用户名保存到 cookie 会话中，并在后续请求中使用 `session` 提供者授权该用户。

> 有关 Ktor 中认证和授权的一般信息，请参见 [](server-auth.md) 小节。

## 添加依赖项 {id="add_dependencies"}
要启用 `session` 认证，您需要在构建脚本中包含以下构件：

* 添加 `ktor-server-sessions` 依赖项以使用会话：

  <var name="artifact_name" value="ktor-server-sessions"/>
  
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
    

* 添加 `ktor-server-auth` 依赖项用于认证：

  <var name="artifact_name" value="ktor-server-auth"/>
  
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
    

## 会话认证流程 {id="flow"}

使用会话的认证流程可能会有所不同，并取决于用户在您的应用程序中如何进行认证。让我们看看它如何与 [表单认证](server-form-based-auth.md) 相结合：

1.  客户端向服务器发起请求，包含 Web 表单数据（包括用户名和密码）。
2.  服务器验证客户端发送的凭据，将用户名保存到 cookie 会话中，并响应所请求的内容以及一个包含用户名的 cookie。
3.  客户端使用 cookie 向受保护的资源发起后续请求。
4.  基于收到的 cookie 数据，Ktor 检测此用户是否存在 cookie 会话，并可选择性地对收到的会话数据执行额外的验证。如果验证成功，服务器将响应所请求的内容。

## 安装会话认证 {id="install"}
要安装 `session` 认证提供者，请在 `install` 代码块内调用 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函数并传入所需的会话类型：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // Configure session authentication
    }
}
```

## 配置会话认证 {id="configure"}

本节演示了如何使用 [表单认证](server-form-based-auth.md) 认证用户，将该用户的信息保存到 cookie 会话中，然后在后续请求中使用 `session` 提供者授权该用户。

> 有关完整示例，请参见
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步骤 1: 创建数据类 {id="data-class"}

首先，您需要创建一个数据类用于存储会话数据：

[object Promise]

### 步骤 2: 安装和配置会话 {id="install-session"}

创建数据类后，您需要安装和配置 `Sessions` 插件。以下示例
安装并配置了一个 cookie 会话，具有指定的 cookie 路径和过期时间。

[object Promise]

> 要了解有关配置会话的更多信息，请参见 [](server-sessions.md#configuration_overview)。

### 步骤 3: 配置会话认证 {id="configure-session-auth"}

`session` 认证提供者通过
[
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)
类暴露其设置。在以下示例中，指定了以下设置：

*   `validate()` 函数检测 [会话实例](#data-class)，并在认证成功的情况下返回一个 `Any` 类型的 principal。
*   `challenge()` 函数指定了认证失败时执行的操作。例如，您可以重定向回登录页面或发送一个 [
    `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

[object Promise]

### 步骤 4: 在会话中保存用户数据 {id="save-session"}

要将已登录用户的信息保存到会话中，请使用 [
`call.sessions.set()`](server-sessions.md#use_sessions)
函数。

以下示例展示了使用 Web 表单的简单认证流程：

[object Promise]

> 有关基于表单认证流程的更多详细信息，请参考
[表单认证](server-form-based-auth.md) 文档。

### 步骤 5: 保护特定资源 {id="authenticate-route"}

配置 `session` 提供者后，您可以使用
[`authenticate()`](server-auth.md#authenticate-route) 函数保护应用程序中的特定资源。

认证成功后，您可以通过在路由处理函数内部使用 `call.principal()` 函数来
检索已认证的 principal（在本例中，即 [`UserSession`](#data-class) 实例）：

[object Promise]

> 有关完整示例，请参见
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。