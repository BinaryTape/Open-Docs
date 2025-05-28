[//]: # (title: Ktor 服务器中的摘要认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

摘要认证方案 (Digest authentication scheme) 是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用于访问控制和认证。在此方案中，用户名和密码在发送到网络之前会应用哈希函数进行处理。

Ktor 允许您使用摘要认证来登录用户和保护特定 [路由](server-routing.md)。您可以在 [](server-auth.md) 章节中获取有关 Ktor 中认证的一般信息。

## 添加依赖 {id="add_dependencies"}
要启用 `digest` 认证，您需要在构建脚本中包含 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 摘要认证流程 {id="flow"}

摘要认证流程如下所示：

1.  客户端向服务器应用中的特定 [路由](server-routing.md) 发起不带 `Authorization` 头部的请求。
2.  服务器以 `401` (未授权) 响应状态回复客户端，并使用 `WWW-Authenticate` 响应头提供信息，表明摘要认证方案用于保护该路由。典型的 `WWW-Authenticate` 头部如下所示：

    ```
    WWW-Authenticate: Digest
            realm="Access to the '/' path",
            nonce="e4549c0548886bc2",
            algorithm="MD5"
    ```
    {style="block"}

    在 Ktor 中，您可以在 [配置](#configure-provider) `digest` 认证提供者时指定 realm 和生成 nonce 值的方式。

3.  通常客户端会显示一个登录对话框，用户可以在其中输入凭据。然后，客户端会发起带有以下 `Authorization` 头部信息的请求：

    ```
    Authorization: Digest username="jetbrains",
            realm="Access to the '/' path",
            nonce="e4549c0548886bc2",
            uri="/",
            algorithm=MD5,
            response="6299988bb4f05c0d8ad44295873858cf"
    ```
    {style="block"}

    `response` 值通过以下方式生成：

    a. `HA1 = MD5(username:realm:password)`
    > 这部分 [存储](#digest-table) 在服务器上，可由 Ktor 用于验证用户凭据。

    b. `HA2 = MD5(method:digestURI)`

    c. `response = MD5(HA1:nonce:HA2)`

4.  服务器 [验证](#configure-provider) 客户端发送的凭据并响应请求的内容。

## 安装摘要认证 {id="install"}
要安装 `digest` 认证提供者，请在 `install` 块内调用 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // 配置摘要认证
    }
}
```
您可以可选地指定一个 [提供者名称](server-auth.md#provider-name)，该名称可用于 [认证指定路由](#authenticate-route)。

## 配置摘要认证 {id="configure"}

要大致了解如何在 Ktor 中配置不同的认证提供者，请参见 [](server-auth.md#configure)。在本节中，我们将看到 `digest` 认证提供者的具体配置。

### 步骤 1: 提供包含摘要的用户表 {id="digest-table"}

`digest` 认证提供者使用摘要消息的 `HA1` 部分验证用户凭据。因此，您可以提供一个包含用户名和相应 `HA1` 散列值的用户表。在下面的示例中，`getMd5Digest` 函数用于生成 `HA1` 散列值：

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="10-16"}

### 步骤 2: 配置摘要提供者 {id="configure-provider"}

`digest` 认证提供者通过 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 类暴露其设置。在下面的示例中，指定了以下设置：
*   `realm` 属性设置要在 `WWW-Authenticate` 头部中传递的 realm。
*   `digestProvider` 函数为指定用户名获取摘要的 `HA1` 部分。
*   （可选） `validate` 函数允许您将凭据映射到自定义主体 (Principal)。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="18-33,41-43"}

您还可以使用 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 属性来指定如何生成 nonce 值。

### 步骤 3: 保护特定资源 {id="authenticate-route"}

配置 `digest` 提供者后，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数来保护应用程序中的特定资源。在认证成功的情况下，您可以在路由处理程序内部使用 `call.principal` 函数检索一个认证主体 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)，并获取认证用户的名称。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="34-40"}