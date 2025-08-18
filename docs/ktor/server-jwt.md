[//]: # (title: JSON Web 令牌)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% 插件允许您使用 Json Web 令牌对客户端进行身份验证。
</link-summary>

[JSON Web 令牌 (JWT)](https://jwt.io/) 是一种开放标准，它定义了一种以 JSON 对象形式在各方之间安全传输信息的方式。由于它使用共享密钥（通过 `HS256` 算法）或公钥/私钥对（例如 `RS256`）进行签名，因此这些信息可以被验证和信任。

Ktor 处理在 `Authorization` 请求头中使用 `Bearer` 方案传递的 JWT，并允许您：
*   验证 JSON Web 令牌的签名；
*   对 JWT 载荷执行额外验证。

> 您可以在 [Ktor 服务器中的身份验证和授权](server-auth.md)章节中获取有关 Ktor 中身份验证和授权的通用信息。

## 添加依赖项 {id="add_dependencies"}
要启用 `JWT` 身份验证，您需要在构建脚本中包含 `ktor-server-auth` 和 `ktor-server-auth-jwt` artifact：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="Sample" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="Sample" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="Sample" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jwt-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## JWT 授权流程 {id="flow"}
Ktor 中的 JWT 授权流程可能如下所示：
1.  客户端向服务器应用程序中特定身份验证[路由](server-routing.md)发起包含凭据的 `POST` 请求。以下示例显示了一个 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)的 `POST` 请求，其中凭据以 JSON 形式传递：
    ```HTTP
    POST http://localhost:8080/login
    Content-Type: application/json
    
    {
      "username": "jetbrains",
      "password": "foobar"
    }
    ```
2.  如果凭据有效，服务器会生成一个 JSON Web 令牌，并使用指定算法对其签名。例如，这可能是使用特定共享密钥的 `HS256`，或使用公钥/私钥对的 `RS256`。
3.  服务器将生成的 JWT 发送给客户端。
4.  客户端现在可以使用 JSON Web 令牌向受保护资源发出请求，该令牌在 `Authorization` 请求头中使用 `Bearer` 方案传递。
    ```HTTP
    GET http://localhost:8080/hello
    Authorization: Bearer {{auth_token}}
    ```
5.  服务器收到请求并执行以下验证：
    *   验证令牌的签名。请注意，[验证方式](#configure-verifier)取决于用于签名令牌的算法。
    *   对 JWT 载荷执行[额外验证](#validate-payload)。
6.  验证后，服务器响应受保护资源的内容。

## 安装 JWT {id="install"}
要安装 `jwt` 身份验证提供程序，请在 `install` 代码块内调用 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函数：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // 配置 jwt 身份验证
    }
}
```
您可以可选地指定一个[提供程序名称](server-auth.md#provider-name)，该名称可用于[身份验证指定的路由](#authenticate-route)。

## 配置 JWT {id="configure-jwt"}
在本节中，我们将介绍如何在服务器 Ktor 应用程序中使用 JSON Web 令牌。我们将演示两种签名令牌的方法，因为它们需要稍微不同的令牌验证方式：
*   使用 `HS256` 和指定共享密钥。
*   使用 `RS256` 和公钥/私钥对。

您可以在此处找到完整的项目：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)，[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步骤 1：配置 JWT 设置 {id="jwt-settings"}

要配置 JWT 相关设置，您可以在[配置文件](server-configuration-file.topic)中创建自定义的 `jwt` 组。例如，`application.conf` 文件可能如下所示：

<Tabs group="sign-alg">
<TabItem title="HS256" group-key="hs256">

```
jwt {
    secret = "secret"
    issuer = "http://0.0.0.0:8080/"
    audience = "http://0.0.0.0:8080/hello"
    realm = "Access to 'hello'"
}
```

</TabItem>
<TabItem title="RS256" group-key="rs256">

```
jwt {
    privateKey = "MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAtfJaLrzXILUg1U3N1KV8yJr92GHn5OtYZR7qWk1Mc4cy4JGjklYup7weMjBD9f3bBVoIsiUVX6xNcYIr0Ie0AQIDAQABAkEAg+FBquToDeYcAWBe1EaLVyC45HG60zwfG1S4S3IB+y4INz1FHuZppDjBh09jptQNd+kSMlG1LkAc/3znKTPJ7QIhANpyB0OfTK44lpH4ScJmCxjZV52mIrQcmnS3QzkxWQCDAiEA1Tn7qyoh+0rOO/9vJHP8U/beo51SiQMw0880a1UaiisCIQDNwY46EbhGeiLJR1cidr+JHl86rRwPDsolmeEF5AdzRQIgK3KXL3d0WSoS//K6iOkBX3KMRzaFXNnDl0U/XyeGMuUCIHaXv+n+Brz5BDnRbWS+2vkgIe9bUNlkiArpjWvX+2we"
    issuer = "http://0.0.0.0:8080/"
    audience = "http://0.0.0.0:8080/hello"
    realm = "Access to 'hello'"
}
```

</TabItem>
</Tabs>

> 请注意，敏感信息不应以纯文本形式存储在配置文件中。考虑使用[环境变量](server-configuration-file.topic#environment-variables)来指定此类参数。
>
{type="warning"}

您可以通过以下方式[在代码中访问这些设置](server-configuration-file.topic#read-configuration-in-code)：

<Tabs group="sign-alg">
<TabItem title="HS256" group-key="hs256">

```kotlin
val secret = environment.config.property("jwt.secret").getString()
val issuer = environment.config.property("jwt.issuer").getString()
val audience = environment.config.property("jwt.audience").getString()
val myRealm = environment.config.property("jwt.realm").getString()
```

</TabItem>
<TabItem title="RS256" group-key="rs256">

```kotlin
val privateKeyString = environment.config.property("jwt.privateKey").getString()
val issuer = environment.config.property("jwt.issuer").getString()
val audience = environment.config.property("jwt.audience").getString()
val myRealm = environment.config.property("jwt.realm").getString()
```

</TabItem>
</Tabs>

### 步骤 2：生成令牌 {id="generate"}

要生成 JSON Web 令牌，您可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。下面的代码片段展示了如何为 `HS256` 和 `RS256` 算法执行此操作：

<Tabs group="sign-alg">
<TabItem title="HS256" group-key="hs256">

```kotlin
post("/login") {
    val user = call.receive<User>()
    // Check username and password
    // ...
    val token = JWT.create()
        .withAudience(audience)
        .withIssuer(issuer)
        .withClaim("username", user.username)
        .withExpiresAt(Date(System.currentTimeMillis() + 60000))
        .sign(Algorithm.HMAC256(secret))
    call.respond(hashMapOf("token" to token))
}
```

</TabItem>
<TabItem title="RS256" group-key="rs256">

```kotlin
post("/login") {
    val user = call.receive<User>()
    // Check username and password
    // ...
    val publicKey = jwkProvider.get("6f8856ed-9189-488f-9011-0ff4b6c08edc").publicKey
    val keySpecPKCS8 = PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyString))
    val privateKey = KeyFactory.getInstance("RSA").generatePrivate(keySpecPKCS8)
    val token = JWT.create()
        .withAudience(audience)
        .withIssuer(issuer)
        .withClaim("username", user.username)
        .withExpiresAt(Date(System.currentTimeMillis() + 60000))
        .sign(Algorithm.RSA256(publicKey as RSAPublicKey, privateKey as RSAPrivateKey))
    call.respond(hashMapOf("token" to token))
}
```

</TabItem>
</Tabs>

1.  `post("/login")` 定义了一个用于接收 `POST` 请求的身份验证[路由](server-routing.md)。
2.  `call.receive<User>()` [接收](server-serialization.md#receive_data)以 JSON 对象形式发送的用户凭据，并将其转换为 `User` 类对象。
3.  `JWT.create()` 生成一个具有指定 JWT 设置的令牌，添加一个包含所接收用户名的自定义声明，并使用指定算法对令牌签名：
    *   对于 `HS256`，使用共享密钥对令牌签名。
    *   对于 `RS256`，使用公钥/私钥对。
4.  `call.respond` [将](server-serialization.md#send_data)令牌作为 JSON 对象发送给客户端。

### 步骤 3：配置 realm {id="realm"}
`realm` 属性允许您设置在访问[受保护路由](#authenticate-route)时要在 `WWW-Authenticate` 请求头中传递的 realm。

```kotlin
val myRealm = environment.config.property("jwt.realm").getString()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
    }
}
```

### 步骤 4：配置令牌验证器 {id="configure-verifier"}

`verifier` 函数允许您验证令牌格式及其签名：
*   对于 `HS256`，您需要传递一个 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 实例来验证令牌。
*   对于 `RS256`，您需要传递 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定一个 JWKS 端点，用于访问用于验证令牌的公钥。在我们的例子中，issuer 是 `http://0.0.0.0:8080`，因此 JWKS 端点地址将是 `http://0.0.0.0:8080/.well-known/jwks.json`。

<Tabs group="sign-alg">
<TabItem title="HS256" group-key="hs256">

```kotlin
val secret = environment.config.property("jwt.secret").getString()
val issuer = environment.config.property("jwt.issuer").getString()
val audience = environment.config.property("jwt.audience").getString()
val myRealm = environment.config.property("jwt.realm").getString()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
        verifier(JWT
                .require(Algorithm.HMAC256(secret))
                .withAudience(audience)
                .withIssuer(issuer)
                .build())
    }
}
```

</TabItem>
<TabItem title="RS256" group-key="rs256">

```kotlin
val issuer = environment.config.property("jwt.issuer").getString()
val audience = environment.config.property("jwt.audience").getString()
val myRealm = environment.config.property("jwt.realm").getString()
val jwkProvider = JwkProviderBuilder(issuer)
    .cached(10, 24, TimeUnit.HOURS)
    .rateLimited(10, 1, TimeUnit.MINUTES)
    .build()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
        verifier(jwkProvider, issuer) {
            acceptLeeway(3)
        }
    }
}
```

</TabItem>
</Tabs>

### 步骤 5：验证 JWT 载荷 {id="validate-payload"}

1.  `validate` 函数允许您对 JWT 载荷执行额外验证。检查 `credential` 形参，它表示一个 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 对象并包含 JWT 载荷。在下面的示例中，检查了自定义 `username` 声明的值。
    ```kotlin
    install(Authentication) {
        jwt("auth-jwt") {
            validate { credential ->
                if (credential.payload.getClaim("username").asString() != "") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }
    ```

    如果身份验证成功，则返回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2.  `challenge` 函数允许您配置在身份验证失败时发送的响应。
    ```kotlin
    install(Authentication) {
        jwt("auth-jwt") {
            challenge { defaultScheme, realm ->
                call.respond(HttpStatusCode.Unauthorized, "Token is not valid or has expired")
            }
        }
    }
    ```

### 步骤 6：保护特定资源 {id="authenticate-route"}

配置 `jwt` 提供程序后，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函数保护应用程序中的特定资源。如果身份验证成功，您可以使用 `call.principal` 函数在路由处理程序内部检索已验证的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)，并获取 JWT 载荷。在下面的示例中，检索了自定义 `username` 声明的值和令牌过期时间。

```kotlin
routing {
    authenticate("auth-jwt") {
        get("/hello") {
            val principal = call.principal<JWTPrincipal>()
            val username = principal!!.payload.getClaim("username").asString()
            val expiresAt = principal.expiresAt?.time?.minus(System.currentTimeMillis())
            call.respondText("Hello, $username! Token is expired at $expiresAt ms.")
        }
    }
}