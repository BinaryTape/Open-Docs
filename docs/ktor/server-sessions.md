[//]: # (title: 会话)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并且允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
</p>
</tldr>

<link-summary>
Sessions 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。
</link-summary>

`Sessions` 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保存用户偏好设置。在 Ktor 中，您可以使用 Cookie 或自定义头部（header）来实现会话，选择是在服务器端存储会话数据还是将其传递给客户端，对会话数据进行签名和加密等。

在本主题中，我们将探讨如何安装 `Sessions` 插件、配置它，以及在[路由处理器](server-routing.md#define_route)内部访问会话数据。

## 添加依赖项 {id="add_dependencies"}
为了启用会话支持，您需要在构建脚本中包含 `ktor-server-sessions` 构件：

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

## 安装 Sessions {id="install_plugin"}

<p>
    要将 `Sessions` 插件<a href="#install">安装</a>到应用程序中，
    请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
    以下代码片段展示了如何安装 <code>Sessions</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，<code>module</code> 是 <code>Application</code> 类的一个扩展函数。
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
<p>
    <code>Sessions</code> 插件也可以<a href="#install-route">安装到特定的路由</a>。
    如果您需要为不同的应用程序资源使用不同的 <code>Sessions</code> 配置，这可能会很有用。
</p>

## 会话配置概述 {id="configuration_overview"}
要配置 `Sessions` 插件，您需要执行以下步骤：
1. *[创建数据类](#data_class)*：在配置会话之前，您需要创建一个 [data class](https://kotlinlang.org/docs/data-classes.html) 用于存储会话数据。
2. *[选择服务器和客户端之间的数据传递方式](#cookie_header)*：使用 Cookie 或自定义头部。Cookie 更适合纯 HTML 应用程序，而自定义头部适用于 API。
3. *[选择会话负载的存储位置](#client_server)*：在客户端或服务器端。您可以使用 Cookie/头部值将序列化的会话数据传递给客户端，或者将负载存储在服务器上，只传递会话标识符。

   如果您想将会话负载存储在服务器上，您可以*[选择如何存储它](#storages)*：在服务器内存中或在一个文件夹中。您还可以实现自定义存储以保留会话数据。
4. *[保护会话数据](#protect_session)*：为了保护传递给客户端的敏感会话数据，您需要对会话负载进行签名和加密。

配置 `Sessions` 后，您可以在[路由处理器](server-routing.md#define_route)内部[获取和设置会话数据](#use_sessions)。

## 创建数据类 {id="data_class"}

在配置会话之前，您需要创建一个 [data class](https://kotlinlang.org/docs/data-classes.html) 用于存储会话数据。
例如，下面的 `UserSession` 类将用于存储会话 ID 和页面浏览次数：

```kotlin
@Serializable
data class UserSession(val id: String, val count: Int)
```

如果您打算使用多个会话，则需要创建多个数据类。

## 传递会话数据：Cookie vs 头部 {id="cookie_header"}

### Cookie {id="cookie"}
要使用 Cookie 传递会话数据，请在 `install(Sessions)` 代码块内调用 `cookie` 函数，并指定名称和数据类：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上面的示例中，会话数据将通过添加到 `Set-Cookie` 头部 的 `user_session` 属性传递给客户端。您可以通过在 `cookie` 代码块内传递其他 Cookie 属性来配置它们。例如，以下代码片段展示了如何指定 Cookie 的路径和过期时间：

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
    }
}
```

如果所需属性没有显式暴露，请使用 `extensions` 属性。例如，您可以通过以下方式传递 `SameSite` 属性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解更多可用的配置设置，请参见 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在将应用程序[部署](server-deployment.md)到生产环境之前，请确保将 `secure` 属性设置为 `true`。这会启用仅通过[安全连接](server-ssl.md)传输 Cookie，并保护会话数据免受 HTTPS 降级攻击。
>
{type="warning"}

### 头部 {id="header"}
要使用自定义头部传递会话数据，请在 `install(Sessions)` 代码块内调用 `header` 函数，并指定名称和数据类：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上面的示例中，会话数据将通过 `cart_session` 自定义头部传递给客户端。
在客户端，您需要将此头部附加到每个请求中以获取会话数据。

> 如果您使用 [CORS](server-cors.md) 插件处理跨域请求，请将您的自定义头部添加到 `CORS` 配置中，如下所示：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 存储会话负载：客户端 vs 服务器 {id="client_server"}

在 Ktor 中，您可以通过两种方式管理会话数据：
- _在客户端和服务器之间传递会话数据_。

  如果您只将会话名称传递给 [cookie 或 header](#cookie_header) 函数，会话数据将在客户端和服务器之间传递。在这种情况下，您需要对会话负载进行[签名和加密](#protect_session)，以保护传递给客户端的敏感会话数据。
- _将数据存储在服务器上，并且只在客户端和服务器之间传递会话 ID_。

  在这种情况下，您可以选择[在服务器上存储负载的位置](#storages)。例如，您可以将会话数据存储在内存中、指定的文件夹中，或者您可以实现自己的自定义存储。

## 在服务器上存储会话负载 {id="storages"}

Ktor 允许您[在服务器上](#client_server)存储会话数据，并且只在服务器和客户端之间传递会话 ID。在这种情况下，您可以选择在服务器上保留负载的位置。

### 内存存储 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 能够将会话内容存储在内存中。此存储在服务器运行时保留数据，并在服务器停止后丢弃信息。例如，您可以如下所示在服务器内存中存储 Cookie：

```kotlin
cookie<CartSession>("cart_session", SessionStorageMemory()) {
}
```

您可以在此处找到完整示例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 请注意，`SessionStorageMemory` 仅用于开发目的。

### 目录存储 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用于将会话数据存储在指定目录下的文件中。例如，要将会在 `build/.sessions` 目录下的文件中存储会话数据，请以这种方式创建 `directorySessionStorage`：
```kotlin
header<CartSession>("cart_session", directorySessionStorage(File("build/.sessions"))) {
}
```

您可以在此处找到完整示例：[session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### 自定义存储 {id="custom_storage"}

Ktor 提供了 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 接口，允许您实现自定义存储。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
所有这三个函数都是[挂起函数](https://kotlinlang.org/docs/composing-suspending-functions.html)。您可以使用 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt) 作为参考。

## 保护会话数据 {id="protect_session"}

### 签名会话数据 {id="sign_session"}

签名会话数据可以防止修改会话内容，但允许用户查看此内容。
要对会话进行签名，请将签名密钥传递给 `SessionTransportTransformerMessageAuthentication` 构造函数，并将此实例传递给 `transform` 函数：

```kotlin
install(Sessions) {
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<CartSession>("cart_session", SessionStorageMemory()) {
        cookie.path = "/"
        transform(SessionTransportTransformerMessageAuthentication(secretSignKey))
    }
}
```

`SessionTransportTransformerMessageAuthentication` 默认使用 `HmacSHA256` 作为认证算法，该算法可以更改。

### 签名并加密会话数据 {id="sign_encrypt_session"}

签名和加密会话数据可以防止读取和修改会话内容。
要对会话进行签名和加密，请将签名/加密密钥传递给 `SessionTransportTransformerEncrypt` 构造函数，并将此实例传递给 `transform` 函数：

```kotlin
install(Sessions) {
    val secretEncryptKey = hex("00112233445566778899aabbccddeeff")
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
        transform(SessionTransportTransformerEncrypt(secretEncryptKey, secretSignKey))
    }
}
```

> 请注意，Ktor `3.0.0` 版本中[加密方法已更新](migrating-3.md#session-encryption-method-update)。如果您是从早期版本迁移，请在 `SessionTransportTransformerEncrypt` 的构造函数中使用 `backwardCompatibleRead` 属性，以确保与现有会话的兼容性。
>
{style="note"}

默认情况下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 算法，这些算法可以更改。

> 请注意，签名/加密密钥不应在代码中指定。您可以使用[配置文件](server-configuration-file.topic#configuration-file-overview)中的自定义组来存储签名/加密密钥，并使用[环境变量](server-configuration-file.topic#environment-variables)初始化它们。
>
{type="warning"}

## 获取和设置会话内容 {id="use_sessions"}
要为特定[路由](server-routing.md)设置会话内容，请使用 `call.sessions` 属性。`set` 方法允许您创建新的会话实例：

```kotlin
get("/login") {
    call.sessions.set(UserSession(id = "123abc", count = 0))
    call.respondRedirect("/user")
}
```

要获取会话内容，您可以调用 `get`，并将其中一个已注册的会话类型作为类型参数传入：

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
}
```

要修改会话，例如，递增计数器，您需要调用数据类的 `copy` 方法：

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
        call.sessions.set(userSession.copy(count = userSession.count + 1))
        call.respondText("Session ID is ${userSession.id}. Reload count is ${userSession.count}.")
    } else {
        call.respondText("Session doesn't exist or is expired.")
    }
}
```

当您因任何原因需要清除会话时（例如，用户登出时），请调用 `clear` 函数：

```kotlin
get("/logout") {
    call.sessions.clear<UserSession>()
    call.respondRedirect("/user")
}
```

您可以在此处找到完整示例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 延迟会话检索

默认情况下，Ktor 会尝试为每个包含会话的请求从存储中读取会话，无论路由是否实际需要它。这种行为可能会导致不必要的开销 —— 特别是对于使用自定义会话存储的应用程序。

您可以通过启用 `io.ktor.server.sessions.deferred` 系统属性来延迟会话加载：

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 示例 {id="examples"}

以下可运行示例展示了如何使用 `Sessions` 插件：

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [Cookie](#cookie) 将[签名并加密](#sign_encrypt_session)的会话负载传递给[客户端](#client_server)。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何将会话负载保存在[服务器内存](#in_memory_storage)中，并使用 [Cookie](#cookie) 将[签名](#sign_session)的会话 ID 传递给客户端。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何将负载保存在服务器的[目录存储](#directory_storage)中，并使用[自定义头部](#header)将[签名](#sign_session)的会话 ID 传递给客户端。