[//]: # (title: Ktor 客户端中的基本认证)

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Basic [认证方案](client-auth.md) 可用于用户登录。在此方案中，用户凭据以 Base64 编码的用户名/密码对形式传输。

> 在服务器端，Ktor 提供了 [Authentication](server-basic-auth.md) 插件用于处理基本认证。

## 基本认证流程 {id="flow"}

基本认证流程如下所示：

1. 客户端向服务器应用程序中的特定资源发起请求，但不带 `Authorization` 请求头。
2. 服务器向客户端响应 `401`（未授权）响应状态，并使用 `WWW-Authenticate` 响应头提供信息，表明基本认证方案用于保护某个路由。典型的 `WWW-Authenticate` 请求头如下所示：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 客户端允许你使用 `sendWithoutRequest` [函数](#configure) 发送凭据，而无需等待 `WWW-Authenticate` 请求头。

3. 通常，客户端会显示一个登录对话框，用户可以在其中输入凭据。然后，客户端发起一个带有 `Authorization` 请求头的请求，该请求头包含使用 Base64 编码的用户名和密码对，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 服务器验证客户端发送的凭据，并响应请求的内容。

## 配置基本认证 {id="configure"}

为了在 `Authorization` 请求头中使用 `Basic` 方案发送用户凭据，你需要按如下方式配置基本认证提供者：

1. 在 `install` 代码块中调用 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函数。
2. 使用 [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供所需凭据，并将此对象传递给 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函数。
3. 使用 `realm` 属性配置认证领域。

   ```kotlin
   val client = HttpClient(CIO) {
       install(Auth) {
           basic {
               credentials {
                   BasicAuthCredentials(username = "jetbrains", password = "foobar")
               }
               realm = "Access to the '/' path"
           }
       }
   }
   ```

4. 可选地，在不等待 `401`（未授权）响应和 `WWW-Authenticate` 请求头的情况下，启用在初始请求中发送凭据。你需要调用返回布尔值的 `sendWithoutRequest` 函数并检测请求参数。

   ```kotlin
   install(Auth) {
       basic {
           // ...
           sendWithoutRequest { request ->
               request.url.host == "0.0.0.0"
           }
       }
   }
   ```

> 你可以在此处找到完整的示例：[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。