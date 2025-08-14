[//]: # (title: JSON Web Tokens)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

<link-summary>
%plugin_name% 插件允许你使用 Json Web Token 对客户端进行身份验证。
</link-summary>

[JSON Web Token (JWT)](https://jwt.io/) 是一种开放标准，它定义了将信息作为 JSON 对象在各方之间安全传输的方式。由于此信息使用共享密钥（通过 `HS256` 算法）或公钥/私钥对（例如 `RS256`）进行签名，因此可以对其进行验证和信任。

Ktor 处理通过 `Authorization` 标头使用 `Bearer` 方案传递的 JWT，并允许你：
*   验证 JSON Web Token 的签名；
*   对 JWT 负载执行额外验证。

> 关于 Ktor 中的身份验证和授权，请参见 [](server-auth.md) 章节。

## 添加依赖项 {id="add_dependencies"}
要启用 `JWT` 身份验证，你需要在构建脚本中包含 `ktor-server-auth` 和 `ktor-server-auth-jwt` artifact：

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

## JWT 授权流程 {id="flow"}
Ktor 中的 JWT 授权流程可能如下所示：
1.  客户端向服务器应用程序中特定身份验证[路由](server-routing.md)发出带有凭据的 `POST` 请求。下面的示例展示了一个 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 请求，其中凭据以 JSON 形式传递：
    [object Promise]
2.  如果凭据有效，服务器将生成 JSON Web Token 并使用指定的算法对其签名。例如，这可能是使用特定共享密钥的 `HS256` 或使用公钥/私钥对的 `RS256`。
3.  服务器将生成的 JWT 发送给客户端。
4.  客户端现在可以使用通过 `Authorization` 标头以 `Bearer` 方案传递的 JSON Web Token 向受保护的资源发出请求。
    [object Promise]
5.  服务器接收请求并执行以下验证：
    *   验证 Token 的签名。请注意，[验证方式](#configure-verifier)取决于用于签名 Token 的算法。
    *   对 JWT 负载执行[额外验证](#validate-payload)。
6.  验证后，服务器响应受保护资源的内容。

## 安装 JWT {id="install"}
要安装 `jwt` 身份验证提供者，请在 `install` 代码块中调用 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // Configure jwt authentication
    }
}
```
你可以选择性地指定一个[提供者名称](server-auth.md#provider-name)，该名称可用于[对指定路由进行身份验证](#authenticate-route)。

## 配置 JWT {id="configure-jwt"}
在本节中，我们将了解如何在服务器 Ktor 应用程序中使用 JSON Web Token。我们将演示两种签名 Token 的方法，因为它们需要略有不同的 Token 验证方式：
*   使用 `HS256` 和指定的共享密钥。
*   使用 `RS256` 和公钥/私钥对。

你可以在此处找到完整的项目：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)，[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步骤 1: 配置 JWT 设置 {id="jwt-settings"}

要配置 JWT 相关设置，你可以在[配置文件](server-configuration-file.topic)中创建一个自定义 `jwt` 组。例如，`application.conf` 文件可能如下所示：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

> 请注意，机密信息不应以纯文本形式存储在配置文件中。请考虑使用[环境变量](server-configuration-file.topic#environment-variables)来指定此类参数。
>
{type="warning"}

你可以通过以下方式[在代码中访问这些设置](server-configuration-file.topic#read-configuration-in-code)：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 步骤 2: 生成 Token {id="generate"}

要生成 JSON Web Token，你可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。下面的代码片段展示了如何为 `HS256` 和 `RS256` 算法执行此操作：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

1.  `post("/login")` 定义了一个用于接收 `POST` 请求的身份验证[路由](server-routing.md)。
2.  `call.receive<User>()` [接收](server-serialization.md#receive_data)以 JSON 对象形式发送的用户凭据并将其转换为 `User` 类对象。
3.  `JWT.create()` 生成带有指定 JWT 设置的 Token，添加一个包含接收到的用户名的自定义 claim，并使用指定的算法对 Token 进行签名：
    *   对于 `HS256`，共享密钥用于签名 Token。
    *   对于 `RS256`，公钥/私钥对用于。
4.  `call.respond` [以 JSON 对象形式将 Token 发送](server-serialization.md#send_data)给客户端。

### 步骤 3: 配置 realm {id="realm"}
`realm` 属性允许你设置要在访问[受保护路由](#authenticate-route)时在 `WWW-Authenticate` 标头中传递的 realm。

[object Promise]

### 步骤 4: 配置 Token 验证器 {id="configure-verifier"}

`verifier` 函数允许你验证 Token 格式及其签名：
*   对于 `HS256`，你需要传递一个 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 实例来验证 Token。
*   对于 `RS256`，你需要传递 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定一个 JWKS 端点，用于访问用于验证 Token 的公钥。在我们的示例中，颁发者是 `http://0.0.0.0:8080`，因此 JWKS 端点地址将是 `http://0.0.0.0:8080/.well-known/jwks.json`。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 步骤 5: 验证 JWT 负载 {id="validate-payload"}

1.  `validate` 函数允许你对 JWT 负载执行额外验证。检查 `credential` 参数，它表示一个 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 对象并包含 JWT 负载。在下面的示例中，自定义 `username` claim 的值被检测。
    [object Promise]
    
    如果身份验证成功，返回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2.  `challenge` 函数允许你配置在身份验证失败时发送的响应。
    [object Promise]

### 步骤 6: 保护特定资源 {id="authenticate-route"}

配置 `jwt` 提供者后，你可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。如果身份验证成功，你可以使用 `call.principal` 函数在路由处理器内部检索已通过身份验证的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)，并获取 JWT 负载。在下面的示例中，检索自定义 `username` claim 的值和 Token 过期时间。

[object Promise]