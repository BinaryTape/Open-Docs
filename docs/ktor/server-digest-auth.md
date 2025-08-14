[//]: # (title: Ktor Server 中的 Digest 认证)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">Native server</Links> 支持</b>: ✖️
    </p>
    
</tldr>

Digest 认证方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的一部分，用于访问控制和认证。在此方案中，在通过网络发送用户名和密码之前，会对其应用哈希函数。

Ktor 允许你使用 digest 认证来登录用户和保护特定[路由](server-routing.md)。你可以在 [](server-auth.md) 部分获取有关 Ktor 认证的通用信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `digest` 认证，你需要将 `%artifact_name%` 构件包含在构建脚本中：

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
    

## Digest 认证流程 {id="flow"}

digest 认证流程如下所示：

1. 客户端向服务器应用程序中的特定[路由](server-routing.md)发出不带 `Authorization` 头的请求。
2. 服务器向客户端响应 `401` (Unauthorized) 响应状态，并使用 `WWW-Authenticate` 响应头提供信息，说明该路由使用 digest 认证方案进行保护。典型的 `WWW-Authenticate` 头如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   在 Ktor 中，你可以在[配置](#configure-provider) `digest` 认证提供程序时指定 realm 和 nonce 值的生成方式。

3. 通常，客户端会显示一个登录对话框，用户可以在其中输入凭据。然后，客户端发出一个带有以下 `Authorization` 头的请求：

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
   
   a. `HA1 = MD5(用户名:realm:密码)`
   > 这部分[存储](#digest-table)在服务器上，Ktor 可以用它来验证用户凭据。
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

4. 服务器[验证](#configure-provider)客户端发送的凭据并响应请求的内容。

## 安装 digest 认证 {id="install"}
要安装 `digest` 认证提供程序，请在 `install` 代码块中调用 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // Configure digest authentication
    }
}
```
你可以选择指定一个[提供程序名称](server-auth.md#provider-name)，该名称可用于[认证特定路由](#authenticate-route)。

## 配置 digest 认证 {id="configure"}

要了解如何在 Ktor 中配置不同的认证提供程序的通用概念，请参见 [](server-auth.md#configure)。在本节中，我们将介绍 `digest` 认证提供程序的配置细节。

### 步骤 1：提供带有 digest 的用户表 {id="digest-table"}

`digest` 认证提供程序使用 digest 消息的 `HA1` 部分验证用户凭据。因此，你可以提供一个包含用户名和相应 `HA1` 散列的用户表。在下面的示例中，`getMd5Digest` 函数用于生成 `HA1` 散列：

[object Promise]

### 步骤 2：配置 digest 提供程序 {id="configure-provider"}

`digest` 认证提供程序通过 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 类公开其设置。在下面的示例中，指定了以下设置：
* `realm` 属性设置要传递到 `WWW-Authenticate` 头中的 realm。
* `digestProvider` 函数获取指定用户名的 digest 的 `HA1` 部分。
* (可选) `validate` 函数允许你将凭据映射到自定义 principal。

[object Promise]

你还可以使用 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 属性来指定如何生成 nonce 值。

### 步骤 3：保护特定资源 {id="authenticate-route"}

配置 `digest` 提供程序后，你可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。在认证成功的情况下，你可以使用 `call.principal` 函数在路由处理器中检索已认证的 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)，并获取已认证用户的名称。

[object Promise]