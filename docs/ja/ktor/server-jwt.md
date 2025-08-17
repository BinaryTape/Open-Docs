[//]: # (title: JSON Webトークン)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Nativeサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% プラグインを使用すると、Json Web Token (JWT) を使用してクライアントを認証できます。 
</link-summary>

[JSON Web Token (JWT)](https://jwt.io/)は、JSONオブジェクトとして当事者間で情報を安全に転送する方法を定義するオープンスタンダードです。この情報は、共有シークレット（<code>HS256</code>アルゴリズムを使用）または公開/秘密鍵ペア（たとえば<code>RS256</code>）を使用して署名されているため、検証および信頼できます。

Ktorは、<code>Bearer</code>スキーマを使用して<code>Authorization</code>ヘッダーで渡されるJWTを処理し、以下のことを可能にします。
* JSON Webトークンの署名を検証します。
* JWTペイロードに対して追加の検証を実行します。

> Ktorにおける認証と認可に関する一般的な情報は、[Ktor Serverの認証と認可](server-auth.md)セクションを参照してください。

## 依存関係の追加 {id="add_dependencies"}
<code>JWT</code>認証を有効にするには、ビルドスクリプトに<code>ktor-server-auth</code>および<code>ktor-server-auth-jwt</code>アーティファクトを含める必要があります。

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="サンプル" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="サンプル" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="サンプル" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jwt-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## JWT認証フロー {id="flow"}
KtorにおけるJWT認証フローは次のようになります。
1. クライアントは、サーバーアプリケーションの特定の認証[ルート](server-routing.md)に対して、認証情報を含む<code>POST</code>リクエストを送信します。以下の例は、JSONで認証情報を渡す[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の<code>POST</code>リクエストを示しています。
   ```HTTP
   POST http://localhost:8080/login
   Content-Type: application/json
   
   {
     "username": "jetbrains",
     "password": "foobar"
   }
   ```
2. 認証情報が有効な場合、サーバーはJSON Webトークンを生成し、指定されたアルゴリズムで署名します。たとえば、これは特定の共有シークレットを使用する<code>HS256</code>、または公開/秘密鍵ペアを使用する<code>RS256</code>である場合があります。
3. サーバーは生成されたJWTをクライアントに送信します。
4. クライアントは、<code>Bearer</code>スキーマを使用して<code>Authorization</code>ヘッダーにJSON Webトークンを渡すことで、保護されたリソースにリクエストを送信できるようになります。
   ```HTTP
   GET http://localhost:8080/hello
   Authorization: Bearer {{auth_token}}
   ```
5. サーバーはリクエストを受信し、以下の検証を実行します。
   * トークンの署名を検証します。署名の[検証方法](#configure-verifier)は、トークンの署名に使用されたアルゴリズムによって異なることに注意してください。
   * JWTペイロードに対して[追加の検証](#validate-payload)を実行します。
6. 検証後、サーバーは保護されたリソースの内容で応答します。

## JWTのインストール {id="install"}
<code>jwt</code>認証プロバイダーをインストールするには、<code>install</code>ブロック内で[<code>jwt</code>関数](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html)を呼び出します。

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
オプションで、[プロバイダー名](server-auth.md#provider-name)を指定できます。これは、[指定されたルートを認証する](#authenticate-route)ために使用できます。

## JWTの設定 {id="configure-jwt"}
このセクションでは、サーバーKtorアプリケーションでJSON Webトークンを使用する方法を見ていきます。トークンを検証するためにわずかに異なる方法が必要となるため、トークンを署名する2つのアプローチを示します。
* 指定された共有シークレットを使用して<code>HS256</code>を使用します。 
* 公開/秘密鍵ペアを使用して<code>RS256</code>を使用します。

完全なプロジェクトはこちらで確認できます: [auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)、[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### ステップ1: JWT設定の構成 {id="jwt-settings"}

JWT関連の設定を構成するには、[設定ファイル](server-configuration-file.topic)にカスタムの<code>jwt</code>グループを作成できます。たとえば、<code>application.conf</code>ファイルは次のようになります。

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

> 機密情報は設定ファイルに平文で保存すべきではありません。[環境変数](server-configuration-file.topic#environment-variables)を使用して、このようなパラメーターを指定することを検討してください。
>
{type="warning"}

[コード内でこれらの設定にアクセスする](server-configuration-file.topic#read-configuration-in-code)には、次の方法で行うことができます。

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

### ステップ2: トークンの生成 {id="generate"}

JSON Webトークンを生成するには、[JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)を使用できます。以下のコードスニペットは、<code>HS256</code>および<code>RS256</code>アルゴリズムの両方でこれを行う方法を示しています。

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

1. <code>post("/login")</code>は、<code>POST</code>リクエストを受信するための認証[ルート](server-routing.md)を定義します。
2. <code>call.receive<User>()</code>は、JSONオブジェクトとして送信されたユーザー認証情報を[受信し](server-serialization.md#receive_data)、それを<code>User</code>クラスオブジェクトに変換します。
3. <code>JWT.create()</code>は、指定されたJWT設定でトークンを生成し、受信したユーザー名を含むカスタムクレームを追加し、指定されたアルゴリズムでトークンに署名します。
   * <code>HS256</code>の場合、共有シークレットがトークンの署名に使用されます。
   * <code>RS256</code>の場合、公開/秘密鍵ペアが使用されます。
4. <code>call.respond</code>は、トークンをJSONオブジェクトとしてクライアントに[送信します](server-serialization.md#send_data)。

### ステップ3: レルムの構成 {id="realm"}
<code>realm</code>プロパティを使用すると、[保護されたルート](#authenticate-route)にアクセスする際に<code>WWW-Authenticate</code>ヘッダーで渡されるレルムを設定できます。

```kotlin
val myRealm = environment.config.property("jwt.realm").getString()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
    }
}
```

### ステップ4: トークン検証器の構成 {id="configure-verifier"}

<code>verifier</code>関数を使用すると、トークンの形式とその署名を検証できます。
* <code>HS256</code>の場合、トークンを検証するために[JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html)インスタンスを渡す必要があります。
* <code>RS256</code>の場合、トークンを検証するために使用される公開鍵にアクセスするためのJWKSエンドポイントを指定する[JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)を渡す必要があります。この場合、issuerが<code>http://0.0.0.0:8080</code>なので、JWKSエンドポイントのアドレスは<code>http://0.0.0.0:8080/.well-known/jwks.json</code>になります。

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

### ステップ5: JWTペイロードの検証 {id="validate-payload"}

1. <code>validate</code>関数を使用すると、JWTペイロードに対して追加の検証を実行できます。<code>credential</code>パラメータを確認します。これは[JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)オブジェクトを表し、JWTペイロードを含んでいます。以下の例では、カスタムの<code>username</code>クレームの値がチェックされています。
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
   
   認証に成功した場合、[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を返します。 
2. <code>challenge</code>関数を使用すると、認証が失敗した場合に送信される応答を構成できます。
   ```kotlin
   install(Authentication) {
       jwt("auth-jwt") {
           challenge { defaultScheme, realm ->
               call.respond(HttpStatusCode.Unauthorized, "Token is not valid or has expired")
           }
       }
   }
   ```

### ステップ6: 特定のリソースを保護する {id="authenticate-route"}

<code>jwt</code>プロバイダーを設定した後、**[<code>authenticate</code>関数](server-auth.md#authenticate-route)**を使用して、アプリケーション内の特定のリソースを保護できます。認証に成功した場合、ルートハンドラー内で<code>call.principal</code>関数を使用して認証された[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を取得し、JWTペイロードを取得できます。以下の例では、カスタムの<code>username</code>クレームの値とトークンの有効期限が取得されています。

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