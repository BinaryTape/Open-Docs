[//]: # (title: Ktor 客户端中的基本认证)

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

Basic [认证方案](client-auth.md) 可用于登录用户。在此方案中，用户凭证以用户名/密码对的形式传输，使用 Base64 编码。

> 在服务器端，Ktor 提供了 [Authentication](server-basic-auth.md) 插件来处理基本认证。

## 基本认证流程 {id="flow"}

基本认证流程如下所示：

1.  客户端发起请求，不带 `Authorization` 请求头，访问服务器应用程序中的某个特定资源。
2.  服务器向客户端响应一个 `401`（未经授权）响应状态，并使用 `WWW-Authenticate` 响应头提供信息，表明基本认证方案用于保护某个路由。一个典型的 `WWW-Authenticate` 请求头如下所示：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 客户端允许你使用 `sendWithoutRequest` [函数](#configure) 在不等待 `WWW-Authenticate` 请求头的情况下发送凭证。

3.  通常，客户端会显示一个登录对话框，用户可以在其中输入凭证。然后，客户端发起一个带有 `Authorization` 请求头（其中包含使用 Base64 编码的用户名和密码对）的请求，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4.  服务器验证客户端发送的凭证，并响应请求的内容。

## 配置基本认证 {id="configure"}

要使用 `Basic` 方案在 `Authorization` 请求头中发送用户凭证，你需要按如下方式配置 `basic` 认证提供程序：

1.  在 `install` 代码块中调用 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函数。
2.  使用 [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供所需的凭证，并将此对象传递给 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函数。
3.  使用 `realm` 属性配置 `realm`。

   [object Promise]

4.  可选地，启用在初始请求中发送凭证，而无需等待带有 `WWW-Authenticate` 请求头的 `401`（未经授权）响应。你需要调用返回布尔值的 `sendWithoutRequest` 函数，并检测请求参数。

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

> 你可以在这里找到完整示例：[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。