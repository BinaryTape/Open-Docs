[//]: # (title: 会话)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Sessions 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html) 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。典型用例包括存储已登录用户的 ID、购物车内容或在客户端保留用户偏好设置。在 Ktor 中，你可以使用 Cookie 或自定义 Header 来实现会话，选择将会话数据存储在服务器上还是传递给客户端，以及签名和加密会话数据等等。

在本主题中，我们将介绍如何安装 `%plugin_name%` 插件、如何配置它，以及如何在[路由处理器](server-routing.md#define_route)中访问会话数据。

## 添加依赖项 {id="add_dependencies"}
要启用会话支持，你需要在构建脚本中包含 `%artifact_name%` 工件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 Sessions {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 会话配置概述 {id="configuration_overview"}
要配置 `%plugin_name%` 插件，你需要执行以下步骤：
1. *[创建数据类](#data_class)*：在配置会话之前，你需要创建一个[数据类](https://kotlinlang.org/docs/data-classes.html)来存储会话数据。
2. *[选择服务器和客户端之间的数据传递方式](#cookie_header)*：使用 Cookie 或自定义 Header。Cookie 更适合纯 HTML 应用，而自定义 Header 则适用于 API。
3. *[选择会话负载的存储位置](#client_server)*：在客户端或服务器。你可以使用 Cookie/Header 值将序列化的会话数据传递给客户端，或者将负载存储在服务器上，仅传递会话标识符。

   如果你想将会话负载存储在服务器上，你可以*[选择如何存储](#storages)*：在服务器内存中或在文件夹中。你也可以实现自定义存储来保存会话数据。
4. *[保护会话数据](#protect_session)*：为了保护传递给客户端的敏感会话数据，你需要对会话负载进行签名和加密。

配置 `%plugin_name%` 后，你可以在[路由处理器](server-routing.md#define_route)中[获取和设置会话数据](#use_sessions)。

## 创建数据类 {id="data_class"}

在配置会话之前，你需要创建一个[数据类](https://kotlinlang.org/docs/data-classes.html)来存储会话数据。
例如，下面的 `UserSession` 类将用于存储会话 ID 和页面浏览次数：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="10-11"}

如果你要使用多个会话，你需要创建多个数据类。

## 传递会话数据：Cookie 与 Header {id="cookie_header"}

### Cookie {id="cookie"}
要使用 Cookie 传递会话数据，请在 `install(Sessions)` 块内调用 `cookie` 函数，并指定名称和数据类：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上面的示例中，会话数据将通过添加到 `Set-Cookie` Header 中的 `user_session` 属性传递给客户端。你可以通过在 `cookie` 块内部传递其他 Cookie 属性来配置它们。例如，以下代码片段展示了如何指定 Cookie 的路径和过期时间：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14,17-19,21-22"}

如果所需的属性没有显式暴露，请使用 `extensions` 属性。例如，你可以通过以下方式传递 `SameSite` 属性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解更多可用配置设置，请参阅 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在将应用程序[部署](server-deployment.md)到生产环境之前，请确保将 `secure` 属性设置为 `true`。这会使 Cookie 仅通过[安全连接](server-ssl.md)传输，并保护会话数据免受 HTTPS 降级攻击。
>
{type="warning"}

### Header {id="header"}
要使用自定义 Header 传递会话数据，请在 `install(Sessions)` 块内调用 `header` 函数，并指定名称和数据类：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上面的示例中，会话数据将通过 `cart_session` 自定义 Header 传递给客户端。
在客户端，你需要将此 Header 附加到每个请求中以获取会话数据。

> 如果你使用 [CORS](server-cors.md) 插件来处理跨域请求，请按如下方式将自定义 Header 添加到 `CORS` 配置中：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 存储会话负载：客户端与服务器 {id="client_server"}

在 Ktor 中，你可以通过两种方式管理会话数据：
- _在客户端和服务器之间传递会话数据_。
   
  如果你只将会话名称传递给 [cookie 或 header](#cookie_header) 函数，会话数据将在客户端和服务器之间传递。在这种情况下，你需要对会话的负载进行[签名和加密](#protect_session)，以保护传递给客户端的敏感会话数据。
- _将会话数据存储在服务器上，并在客户端和服务器之间仅传递会话 ID_。
   
  在这种情况下，你可以选择[在服务器上存储负载的位置](#storages)。例如，你可以将会话数据存储在内存中、指定文件夹中，或者你可以实现自己的自定义存储。

## 在服务器上存储会话负载 {id="storages"}

Ktor 允许你将数据存储[在服务器上](#client_server)，并在服务器和客户端之间仅传递会话 ID。在这种情况下，你可以选择在服务器上保留负载的位置。

### 内存存储 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 支持将会话内容存储在内存中。此存储在服务器运行时保留数据，并在服务器停止后丢弃信息。例如，你可以按如下方式将 Cookie 存储在服务器内存中：

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="16,19"}

你可以在这里找到完整示例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 请注意，`SessionStorageMemory` 仅用于开发目的。

### 目录存储 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用于在指定目录下以文件形式存储会话数据。例如，要将数据存储在 `build/.sessions` 目录下的文件中，请按以下方式创建 `directorySessionStorage`：
```kotlin
```
{src="snippets/session-header-server/src/main/kotlin/com/example/Application.kt" include-lines="17,19"}

你可以在这里找到完整示例：[session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### 自定义存储 {id="custom_storage"}

Ktor 提供了 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 接口，允许你实现自定义存储。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
所有三个函数都是[挂起函数](https://kotlinlang.org/docs/composing-suspending-functions.html)。你可以参考 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)。

## 保护会话数据 {id="protect_session"}

### 签名会话数据 {id="sign_session"}

对会话数据进行签名可以防止修改会话内容，但允许用户查看此内容。
要对会话进行签名，请将签名密钥传递给 `SessionTransportTransformerMessageAuthentication` 构造函数，并将此实例传递给 `transform` 函数：

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="14-20"}

`SessionTransportTransformerMessageAuthentication` 默认使用 `HmacSHA256` 作为身份验证算法，该算法可以更改。

### 签名和加密会话数据 {id="sign_encrypt_session"}

对会话数据进行签名和加密可以防止读取和修改会话内容。
要对会话进行签名和加密，请将签名/加密密钥传递给 `SessionTransportTransformerEncrypt` 构造函数，并将此实例传递给 `transform` 函数：

```kotlin
```

{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14-22"}

> 请注意，Ktor `3.0.0` 版本中[加密方法已更新](migrating-3.md#session-encryption-method-update)。如果你正在从早期版本迁移，请在 `SessionTransportTransformerEncrypt` 的构造函数中使用 `backwardCompatibleRead` 属性，以确保与现有会话的兼容性。
>
{style="note"}

默认情况下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 算法，这些算法可以更改。

> 请注意，签名/加密密钥不应在代码中指定。你可以在[配置文件](server-configuration-file.topic#configuration-file-overview)中使用自定义组来存储签名/加密密钥，并使用[环境变量](server-configuration-file.topic#environment-variables)对其进行初始化。
>
{type="warning"}

## 获取和设置会话内容 {id="use_sessions"}
要为特定[路由](server-routing.md)设置会话内容，请使用 `call.sessions` 属性。 `set` 方法允许你创建一个新的会话实例：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="24-27"}

要获取会话内容，你可以调用 `get` 并传入已注册的会话类型之一作为类型参数：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-31,37"}

要修改会话，例如，递增计数器，你需要调用数据类的 `copy` 方法：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-37"}

当你需要因任何原因（例如用户退出登录）清除会话时，请调用 `clear` 函数：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="39-42"}

你可以在这里找到完整示例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 示例 {id="examples"}

以下可运行示例演示了如何使用 `%plugin_name%` 插件：

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [Cookie](#cookie) 将[签名和加密的](#sign_encrypt_session)会话负载传递给[客户端](#client_server)。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何将会话负载保存在[服务器内存中](#in_memory_storage)并使用 [Cookie](#cookie) 将[签名后的](#sign_session)会话 ID 传递给客户端。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何在服务器上的[目录存储](#directory_storage)中保留会话负载，并使用[自定义 Header](#header) 将[签名后的](#sign_session)会话 ID 传递给客户端。