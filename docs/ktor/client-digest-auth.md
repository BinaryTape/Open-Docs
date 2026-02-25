[//]: # (title: Ktor Client 中的 Digest 身份验证)

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在 Digest 身份验证方案中，用户名和密码在通过网络发送之前会应用哈希函数。

> 在服务器端，Ktor 提供了 [身份验证](server-digest-auth.md) 插件来处理 Digest 身份验证。

## Digest 身份验证流程 {id="flow"}

Digest 身份验证流程如下：

1. 客户端向服务器应用程序中的特定资源发出不带 `Authorization` 标头的请求。
2. 服务器向客户端返回 `401` (Unauthorized) 响应状态，并使用 `WWW-Authenticate` 响应标头提供有关使用 Digest 身份验证方案保护路由的信息。典型的 `WWW-Authenticate` 标头如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常，客户端会显示一个登录对话框，用户可以在其中输入凭据。然后，客户端发出带有以下 `Authorization` 标头的请求：

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

   b. `HA2 = MD5(method:digestURI)`

   c. `response = MD5(HA1:nonce:HA2)`

4. 服务器验证客户端发送的凭据并返回请求的内容。

## 配置 Digest 身份验证 {id="configure"}

若要使用 `Digest` 方案在 `Authorization` 标头中发送用户凭据，您需要按如下方式配置 `digest` 身份验证提供程序：

1. 在 `install` 块内调用 [digest](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html) 函数。
2. 使用 [DigestAuthCredentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html) 提供所需的凭据，并将此对象传递给 [credentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html) 函数。
3. （可选）使用 `realm` 属性配置 realm。

```kotlin
val client = HttpClient(CIO) {
    install(Auth) {
        digest {
            credentials {
                DigestAuthCredentials(username = "jetbrains", password = "foobar")
            }
            realm = "Access to the '/' path"
        }
    }
}
```

> 您可以在此处找到完整的示例：[client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。