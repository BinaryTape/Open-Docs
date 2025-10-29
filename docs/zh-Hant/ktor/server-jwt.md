[//]: # (title: JSON Web 權杖)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必需的依賴</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links> 支援</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% 外掛程式允許您使用 JSON Web Token 驗證客戶端。
</link-summary>

[JSON Web Token (JWT)](https://jwt.io/) 是一個開放標準，它定義了一種將資訊以 JSON 物件形式在各方之間安全傳輸的方式。由於這些資訊是使用共享密鑰（透過 `HS256` 演算法）或公鑰/私鑰對（例如 `RS256`）簽署的，因此可以被驗證和信任。

Ktor 處理透過 `Authorization` 標頭以 `Bearer` 模式傳遞的 JWT，並允許您：
* 驗證 JSON web token 的簽章；
* 對 JWT 酬載執行額外驗證。

> 您可以在 [Ktor 伺服器中的驗證和授權](server-auth.md) 章節中獲取有關 Ktor 中驗證和授權的一般資訊。

## 新增依賴 {id="add_dependencies"}
若要啟用 `JWT` 驗證，您需要在建置腳本中包含 `ktor-server-auth` 和 `ktor-server-auth-jwt` 構件：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="範例" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="範例" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="範例" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jwt-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## JWT 授權流程 {id="flow"}
Ktor 中的 JWT 授權流程可能如下所示：
1. 客戶端向伺服器應用程式中的特定驗證 [路由](server-routing.md) 發出帶有憑證的 `POST` 請求。以下範例顯示了一個 [HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) 的 `POST` 請求，其中憑證以 JSON 形式傳遞：
   ```HTTP
   POST http://localhost:8080/login
   Content-Type: application/json
   
   {
     "username": "jetbrains",
     "password": "foobar"
   }
   ```
2. 如果憑證有效，伺服器會生成一個 JSON web token，並使用指定的演算法對其進行簽署。例如，這可以是帶有特定共享密鑰的 `HS256`，或者帶有公鑰/私鑰對的 `RS256`。
3. 伺服器將生成的 JWT 發送給客戶端。
4. 客戶端現在可以使用透過 `Authorization` 標頭以 `Bearer` 模式傳遞的 JSON web token 向受保護的資源發出請求。
   ```HTTP
   GET http://localhost:8080/hello
   Authorization: Bearer {{auth_token}}
   ```
5. 伺服器接收請求並執行以下驗證：
   * 驗證 token 的簽章。請注意，[驗證方式](#configure-verifier) 取決於用於簽署 token 的演算法。
   * 對 JWT 酬載執行 [額外驗證](#validate-payload)。
6. 驗證後，伺服器會回應受保護資源的內容。

## 安裝 JWT {id="install"}
若要安裝 `jwt` 驗證提供者，請在 `install` 區塊內呼叫 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函數：

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
您可以選擇指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證指定的路由](#authenticate-route)。

## 配置 JWT {id="configure-jwt"}
在本節中，我們將看到如何在 Ktor 伺服器應用程式中使用 JSON web token。我們將展示兩種簽署 token 的方法，因為它們需要略微不同的 token 驗證方式：
* 使用 `HS256` 與指定的共享密鑰。
* 使用 `RS256` 與公鑰/私鑰對。

您可以在這裡找到完整的專案：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)，[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步驟 1：配置 JWT 設定 {id="jwt-settings"}

若要配置 JWT 相關設定，您可以在 [配置檔](server-configuration-file.topic) 中建立一個自訂的 `jwt` 群組。例如，`application.conf` 檔案可能如下所示：

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

> 請注意，機密資訊不應以純文字形式儲存在配置檔中。考慮使用 [環境變數](server-configuration-file.topic#environment-variables) 來指定此類參數。
>
{type="warning"}

您可以透過以下方式在 [程式碼中存取這些設定](server-configuration-file.topic#read-configuration-in-code)：

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

### 步驟 2：生成 token {id="generate"}

若要生成 JSON web token，您可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。以下程式碼片段展示了如何為 `HS256` 和 `RS256` 演算法執行此操作：

<Tabs group="sign-alg">
<TabItem title="HS256" group-key="hs256">

```kotlin
post("/login") {
    val user = call.receive<User>()
    // 檢查使用者名稱和密碼
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
    // 檢查使用者名稱和密碼
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

1. `post("/login")` 定義了一個用於接收 `POST` 請求的驗證 [路由](server-routing.md)。
2. `call.receive<User>()` [接收](server-serialization.md#receive_data) 作為 JSON 物件傳送的使用者憑證，並將其轉換為 `User` 類別物件。
3. `JWT.create()` 使用指定的 JWT 設定生成 token，添加一個帶有接收到的使用者名稱的自訂 `claim`，並使用指定的演算法簽署 token：
   * 對於 `HS256`，使用共享密鑰簽署 token。
   * 對於 `RS256`，使用公鑰/私鑰對。
4. `call.respond` [將](server-serialization.md#send_data) token 作為 JSON 物件發送給客戶端。

### 3. 配置 realm {id="realm"}
`realm` 屬性允許您設定在存取 [受保護路由](#authenticate-route) 時要在 `WWW-Authenticate` 標頭中傳遞的 `realm`。

```kotlin
val myRealm = environment.config.property("jwt.realm").getString()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
    }
}
```

### 步驟 4：配置 token 驗證器 {id="configure-verifier"}

`verifier` 函數允許您驗證 token 的格式及其簽章：
* 對於 `HS256`，您需要傳遞一個 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 實例來驗證 token。
* 對於 `RS256`，您需要傳遞 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定一個 JWKS 端點，用於存取用於驗證 token 的公鑰。在我們的案例中，發行者是 `http://0.0.0.0:8080`，因此 JWKS 端點位址將是 `http://0.0.0.0:8080/.well-known/jwks.json`。

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

### 步驟 5：驗證 JWT 酬載 {id="validate-payload"}

1. `validate` 函數允許您對 JWT 酬載執行額外驗證。檢查 `credential` 參數，它代表一個 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 物件並包含 JWT 酬載。在以下範例中，檢查了自訂 `username` `claim` 的值。
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
   
   在成功驗證的情況下，傳回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2. `challenge` 函數允許您配置在驗證失敗時要發送的回應。
   ```kotlin
   install(Authentication) {
       jwt("auth-jwt") {
           challenge { defaultScheme, realm ->
               call.respond(HttpStatusCode.Unauthorized, "Token is not valid or has expired")
           }
       }
   }
   ```

### 步驟 6：保護特定資源 {id="authenticate-route"}

配置 `jwt` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數保護應用程式中的特定資源。在成功驗證的情況下，您可以使用 `call.principal` 函數在路由處理程式中取得已驗證的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)，並獲取 JWT 酬載。在以下範例中，擷取了自訂 `username` `claim` 的值和 token 的過期時間。

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
```