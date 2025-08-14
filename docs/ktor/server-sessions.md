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
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
Sessions 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。
</link-summary>

Sessions 插件（plugin）提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保留用户偏好设置。在 Ktor 中，您可以使用 cookie 或自定义 header 来实现会话，选择是在服务器上存储会话数据还是将其传递给客户端，还可以签名和加密会话数据等等。

在本主题中，我们将探讨如何安装 Sessions 插件，如何配置它，以及如何在[路由处理程序](server-routing.md#define_route)中访问会话数据。

## 添加依赖项 {id="add_dependencies"}
要启用对会话的支持，您需要在构建脚本中包含 %artifact_name% 构件：

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
    

## 安装 Sessions {id="install_plugin"}

    <p>
        要将 <code>Sessions</code> 插件<a href="#install">安装</a>到应用程序，请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织您的应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。下面的代码片段展示了如何安装 <code>Sessions</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，该 <code>module</code> 是 <code>Application</code> 类的扩展函数。
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
    

    <p>
        <code>Sessions</code> 插件也可以<a href="#install-route">安装到特定的路由</a>。如果您需要针对不同的应用程序资源使用不同的 <code>Sessions</code> 配置，这可能会很有用。
    </p>
    

## 会话配置概览 {id="configuration_overview"}
要配置 Sessions 插件，您需要执行以下步骤：
1. *[创建数据类](#data_class)*：在配置会话之前，您需要创建一个用于存储会话数据的 [数据类](https://kotlinlang.org/docs/data-classes.html)。
2. *[选择服务器与客户端之间的数据传递方式](#cookie_header)*：使用 cookie 或自定义 header。cookie 更适合纯 HTML 应用程序，而自定义 header 适用于 API。
3. *[选择会话负载的存储位置](#client_server)*：在客户端或服务器上。您可以将序列化的会话数据通过 cookie/header 值传递给客户端，或者将负载存储在服务器上，只传递会话标识符。

   如果您想将会话负载存储在服务器上，您可以*[选择如何存储](#storages)*：在服务器内存中或在文件夹中。您还可以实现自定义存储来保存会话数据。
4. *[保护会话数据](#protect_session)*：为了保护传递给客户端的敏感会话数据，您需要对会话负载进行签名和加密。

配置 Sessions 后，您可以在[路由处理程序](server-routing.md#define_route)中[获取和设置会话数据](#use_sessions)。

## 创建数据类 {id="data_class"}

在配置会话之前，您需要创建一个 [数据类](https://kotlinlang.org/docs/data-classes.html) 用于存储会话数据。 
例如，下面的 `UserSession` 类将用于存储会话 ID 和页面浏览次数：

[object Promise]

如果您要使用多个会话，则需要创建多个数据类。

## 传递会话数据：Cookie vs Header {id="cookie_header"}

### Cookie {id="cookie"}
要使用 cookie 传递会话数据，请在 `install(Sessions)` 代码块中调用 `cookie` 函数，并指定名称和数据类：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上面的示例中，会话数据将通过添加到 `Set-Cookie` header 的 `user_session` 属性传递给客户端。您可以通过在 `cookie` 代码块中传递其他 cookie 属性来配置它们。例如，下面的代码片段展示了如何指定 cookie 的路径和过期时间：

[object Promise]

如果所需的属性没有显式公开，请使用 `extensions` 属性。例如，您可以通过以下方式传递 `SameSite` 属性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解有关可用配置设置的更多信息，请参阅 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在将应用程序[部署](server-deployment.md)到生产环境之前，请确保 `secure` 属性设置为 `true`。这仅允许通过[安全连接](server-ssl.md)传输 cookie，并保护会话数据免受 HTTPS 降级攻击。
>
{type="warning"}

### Header {id="header"}
要使用自定义 header 传递会话数据，请在 `install(Sessions)` 代码块中调用 `header` 函数，并指定名称和数据类：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上面的示例中，会话数据将通过 `cart_session` 自定义 header 传递给客户端。 
在客户端，您需要将此 header 附加到每个请求以获取会话数据。

> 如果您使用 [CORS](server-cors.md) 插件来处理跨域请求，请将您的自定义 header 添加到 `CORS` 配置中，如下所示：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 存储会话负载：客户端 vs 服务器 {id="client_server"}

在 Ktor 中，您可以通过两种方式管理会话数据：
- _在客户端和服务器之间传递会话数据_。
   
  如果您只将会话名称传递给 [cookie 或 header](#cookie_header) 函数，则会话数据将在客户端和服务器之间传递。在这种情况下，您需要[签名和加密](#protect_session)会话负载，以保护传递给客户端的敏感会话数据。
- _将会话数据存储在服务器上，并且只在客户端和服务器之间传递会话 ID_。
   
  在这种情况下，您可以选择[在何处存储负载](#storages)到服务器上。例如，您可以将会话数据存储在内存中、指定文件夹中，或者您可以实现自己的自定义存储。

## 将会话负载存储在服务器上 {id="storages"}

Ktor 允许您将会话数据存储在[服务器上](#client_server)，并且只在服务器和客户端之间传递会话 ID。在这种情况下，您可以选择在服务器上保存负载的位置。

### 内存存储 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 可以在内存中存储会话内容。此存储在服务器运行时保留数据，一旦服务器停止就会丢弃信息。例如，您可以按如下方式将 cookie 存储在服务器内存中：

[object Promise]

您可以在此处找到完整示例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 请注意，`SessionStorageMemory` 仅用于开发目的。

### 目录存储 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用于将会话数据存储在指定目录下的文件中。例如，要将会话数据存储在 `build/.sessions` 目录下的文件中，请按以下方式创建 `directorySessionStorage`：
[object Promise]

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
所有这三个函数都是[挂起函数](https://kotlinlang.org/docs/composing-suspending-functions.html)。您可以将 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt) 作为参考。

## 保护会话数据 {id="protect_session"}

### 签名会话数据 {id="sign_session"}

签名会话数据可防止修改会话内容，但允许用户查看此内容。
要签名会话，请将签名密钥传递给 `SessionTransportTransformerMessageAuthentication` 构造函数，并将此实例传递给 `transform` 函数：

[object Promise]

`SessionTransportTransformerMessageAuthentication` 使用 `HmacSHA256` 作为默认的认证算法，该算法可以更改。 

### 签名和加密会话数据 {id="sign_encrypt_session"}

签名和加密会话数据可防止读取和修改会话内容。
要签名和加密会话，请将签名/加密密钥传递给 `SessionTransportTransformerEncrypt` 构造函数，并将此实例传递给 `transform` 函数：

[object Promise]

> 请注意，Ktor `3.0.0` 版本中[加密方法已更新](migrating-3.md#session-encryption-method-update)。如果您是从早期版本迁移，请在 `SessionTransportTransformerEncrypt` 的构造函数中使用 `backwardCompatibleRead` 属性，以确保与现有会话的兼容性。
>
{style="note"}

默认情况下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 算法，它们可以更改。 

> 请注意，签名/加密密钥不应在代码中指定。您可以使用[配置文件](server-configuration-file.topic#configuration-file-overview)中的自定义组来存储签名/加密密钥，并使用[环境变量](server-configuration-file.topic#environment-variables)初始化它们。
>
{type="warning"}

## 获取和设置会话内容 {id="use_sessions"}
要为特定的[路由](server-routing.md)设置会话内容，请使用 `call.sessions` 属性。`set` 方法允许您创建新的会话实例：

[object Promise]

要获取会话内容，您可以调用 `get` 并将已注册的会话类型之一作为类型形参：

[object Promise]

要修改会话，例如，要递增计数器，您需要调用数据类的 `copy` 方法：

[object Promise]

当您因任何原因需要清除会话时（例如，用户注销时），请调用 `clear` 函数：

[object Promise]

您可以在此处找到完整示例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 延迟会话检索

默认情况下，Ktor 会尝试从存储中读取包含会话的每个请求的会话，无论路由是否实际需要它。这种行为可能会导致不必要的开销——尤其是在使用自定义会话存储的应用程序中。

您可以通过启用 `io.ktor.server.sessions.deferred` 系统属性来延迟会话加载：

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 示例 {id="examples"}

以下可运行的示例展示了如何使用 Sessions 插件：

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [cookie](#cookie) 将[签名和加密](#sign_encrypt_session)的会话负载传递给[客户端](#client_server)。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何将会话负载保存在[服务器内存](#in_memory_storage)中，并使用 [cookie](#cookie) 将[签名](#sign_session)的会话 ID 传递给客户端。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何将负载保存在服务器上的[目录存储](#directory_storage)中，并使用[自定义 header](#header) 将[签名](#sign_session)的会话 ID 传递给客户端。