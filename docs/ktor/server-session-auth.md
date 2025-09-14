[//]: # (title: Ktor Server 中的会话认证)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

[会话](server-sessions.md) 提供了一种在不同 HTTP 请求之间持久化数据的机制。典型的用例包括存储已登录用户的 ID、购物车的内容，或者在客户端保留用户偏好设置。

在 Ktor 中，已经拥有关联会话的用户可以使用 `session` 提供程序进行认证。例如，当用户首次使用 [web 表单](server-form-based-auth.md) 登录时，你可以将用户名保存到 cookie 会话中，并在后续请求中使用 `session` 提供程序授权该用户。

> 你可以在 [Ktor Server 中的认证与授权](server-auth.md) 部分获取关于 Ktor 中认证和授权的通用信息。

## 添加依赖项 {id="add_dependencies"}
为了启用 `session` 认证，你需要将以下 artifact 包含在构建脚本中：

* 添加 `ktor-server-sessions` 依赖项用于使用会话：

  <var name="artifact_name" value="ktor-server-sessions"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 添加 `ktor-server-auth` 依赖项用于认证：

  <var name="artifact_name" value="ktor-server-auth"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

## 会话认证流程 {id="flow"}

带有会话的认证流程可能会有所不同，取决于用户在你的应用程序中如何被认证。让我们看看它在 [基于表单的认证](server-form-based-auth.md) 中会是什么样子：

1. 客户端向服务器发出包含 web 表单数据（包括用户名和密码）的请求。
2. 服务器验证客户端发送的凭据，将用户名保存到 cookie 会话中，并响应请求的内容以及一个包含用户名的 cookie。
3. 客户端使用 cookie 向受保护的资源发出后续请求。
4. 根据收到的 cookie 数据，Ktor 检测此用户是否存在 cookie 会话，并且，可选地，对收到的会话数据执行额外的验证。在验证成功的情况下，服务器响应请求的内容。

## 安装会话认证 {id="install"}
为了安装 `session` 认证提供程序，请在 `install` 代码块内调用 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函数，并传入所需的会话类型：

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

本节演示了如何使用 [基于表单的认证](server-form-based-auth.md) 认证用户，将此用户的信息保存到 cookie 会话中，然后在使用 `session` 提供程序的后续请求中授权该用户。

> 有关完整示例，请参见 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步骤 1：创建数据类 {id="data-class"}

首先，你需要创建一个数据类用于存储会话数据：

```kotlin
@Serializable
data class UserSession(val name: String, val count: Int)
```

### 2. 安装并配置会话 {id="install-session"}

创建数据类后，你需要安装并配置 `Sessions` 插件。以下示例安装并配置了一个 cookie 会话，带有指定的 cookie 路径和过期时间。

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 60
    }
}
```

> 要了解更多关于配置会话的信息，请参见 [会话配置概述](server-sessions.md#configuration_overview)。

### 步骤 3：配置会话认证 {id="configure-session-auth"}

`session` 认证提供程序通过 [`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html) 类公开其设置。在以下示例中，指定了以下设置：

* `validate()` 函数检测 [会话实例](#data-class)，并在认证成功的情况下返回 `Any` 类型的 principal。
* `challenge()` 函数指定了认证失败时执行的操作。例如，你可以重定向回登录页面或发送一个 [`UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
install(Authentication) {
    session<UserSession>("auth-session") {
        validate { session ->
            if(session.name.startsWith("jet")) {
                session
            } else {
                null
            }
        }
        challenge {
            call.respondRedirect("/login")
        }
    }
}
```

### 步骤 4：在会话中保存用户数据 {id="save-session"}

要将已登录用户的信息保存到会话中，请使用 [`call.sessions.set()`](server-sessions.md#use_sessions) 函数。

以下示例展示了一个使用 web 表单的简单认证流程：

```kotlin
authenticate("auth-form") {
    post("/login") {
        val userName = call.principal<UserIdPrincipal>()?.name.toString()
        call.sessions.set(UserSession(name = userName, count = 1))
        call.respondRedirect("/hello")
    }
}
```

> 有关基于表单的认证流程的更多详细信息，请参考 [基于表单的认证](server-form-based-auth.md) 文档。

### 步骤 5：保护特定资源 {id="authenticate-route"}

配置 `session` 提供程序后，你可以在你的应用程序中使用 [`authenticate()`](server-auth.md#authenticate-route) 函数保护特定资源。

认证成功后，你可以通过在路由处理程序内使用 `call.principal()` 函数来检索已认证的 principal（在这种情况下，是 [`UserSession`](#data-class) 实例）：

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
        call.sessions.set(userSession?.copy(count = userSession.count + 1))
        call.respondText("Hello, ${userSession?.name}! Visit count is ${userSession?.count}.")
    }
}
```

> 有关完整示例，请参见 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。