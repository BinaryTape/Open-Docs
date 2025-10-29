[//]: # (title: JSON 웹 토큰)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="인증 JWT"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% 플러그인은 JSON 웹 토큰을 사용하여 클라이언트를 인증할 수 있게 해줍니다. 
</link-summary>

[JSON 웹 토큰 (JWT)](https://jwt.io/)은 당사자 간에 정보를 JSON 객체로 안전하게 전송하는 방법을 정의하는 개방형 표준입니다. 이 정보는 공유 비밀(`HS256` 알고리즘 사용) 또는 공개/개인 키 쌍(예: `RS256`)으로 서명되므로 검증되고 신뢰할 수 있습니다.

Ktor는 `Authorization` 헤더를 통해 `Bearer` 스키마를 사용하여 전달되는 JWT를 처리하며 다음과 같은 기능을 제공합니다:
* JSON 웹 토큰의 서명 확인
* JWT 페이로드에 대한 추가 유효성 검사 수행

> Ktor의 인증 및 권한 부여에 대한 일반 정보는 [Ktor 서버의 인증 및 권한 부여](server-auth.md) 섹션에서 얻을 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`JWT` 인증을 활성화하려면 빌드 스크립트에 `ktor-server-auth` 및 `ktor-server-auth-jwt` 아티팩트를 포함해야 합니다:

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="예시" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="예시" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-jwt:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="예시" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-jwt-jvm&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## JWT 인증 흐름 {id="flow"}
Ktor의 JWT 인증 흐름은 다음과 같습니다:
1. 클라이언트가 특정 인증 [경로](server-routing.md)로 서버 애플리케이션에 자격 증명을 포함한 `POST` 요청을 보냅니다. 아래 예시는 JSON으로 전달된 자격 증명이 포함된 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 요청을 보여줍니다:
   ```HTTP
   POST http://localhost:8080/login
   Content-Type: application/json
   
   {
     "username": "jetbrains",
     "password": "foobar"
   }
   ```
2. 자격 증명이 유효하면, 서버는 JSON 웹 토큰을 생성하고 지정된 알고리즘으로 서명합니다. 예를 들어, 특정 공유 비밀을 사용하는 `HS256` 또는 공개/개인 키 쌍을 사용하는 `RS256`일 수 있습니다.
3. 서버는 생성된 JWT를 클라이언트에 보냅니다.
4. 클라이언트는 이제 `Authorization` 헤더에 `Bearer` 스키마를 사용하여 JSON 웹 토큰을 전달하여 보호된 리소스에 요청을 보낼 수 있습니다.
   ```HTTP
   GET http://localhost:8080/hello
   Authorization: Bearer {{auth_token}}
   ```
5. 서버는 요청을 수신하고 다음 유효성 검사를 수행합니다:
   * 토큰의 서명을 확인합니다. [검증 방식](#configure-verifier)은 토큰 서명에 사용된 알고리즘에 따라 달라집니다.
   * JWT 페이로드에 대한 [추가 유효성 검사](#validate-payload)를 수행합니다.
6. 유효성 검사 후, 서버는 보호된 리소스의 내용을 응답합니다.

## JWT 설치 {id="install"}
`jwt` 인증 프로바이더를 설치하려면 `install` 블록 내에서 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 함수를 호출합니다:

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
선택적으로 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있으며, 이는 [지정된 경로를 인증](#authenticate-route)하는 데 사용될 수 있습니다.

## JWT 구성 {id="configure-jwt"}
이 섹션에서는 서버 Ktor 애플리케이션에서 JSON 웹 토큰을 사용하는 방법을 살펴보겠습니다. 토큰을 확인하는 방식이 약간 다르기 때문에 토큰 서명에 대한 두 가지 접근 방식을 시연할 것입니다:
* 지정된 공유 비밀을 사용하는 `HS256`
* 공개/개인 키 쌍을 사용하는 `RS256`

전체 프로젝트는 여기에서 찾을 수 있습니다: [auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256), [auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256).

### 단계 1: JWT 설정 구성 {id="jwt-settings"}

JWT 관련 설정을 구성하려면 [구성 파일](server-configuration-file.topic)에 사용자 정의 `jwt` 그룹을 생성할 수 있습니다. 예를 들어, `application.conf` 파일은 다음과 같을 수 있습니다:

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

> 비밀 정보는 구성 파일에 일반 텍스트로 저장해서는 안 됩니다. 이러한 매개변수를 지정하는 데 [환경 변수](server-configuration-file.topic#environment-variables)를 사용하는 것을 고려하십시오.
>
{type="warning"}

다음과 같은 방식으로 [코드에서 이러한 설정에 액세스](server-configuration-file.topic#read-configuration-in-code)할 수 있습니다:

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

### 단계 2: 토큰 생성 {id="generate"}

JSON 웹 토큰을 생성하려면 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)를 사용할 수 있습니다. 아래 코드 스니펫은 `HS256` 및 `RS256` 알고리즘 모두에 대해 이 작업을 수행하는 방법을 보여줍니다:

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

1. `post("/login")`은 `POST` 요청을 수신하기 위한 인증 [경로](server-routing.md)를 정의합니다.
2. `call.receive<User>()`는 JSON 객체로 전송된 사용자 자격 증명을 [수신](server-serialization.md#receive_data)하고 이를 `User` 클래스 객체로 변환합니다.
3. `JWT.create()`는 지정된 JWT 설정으로 토큰을 생성하고, 수신된 사용자 이름으로 사용자 정의 클레임을 추가하고, 지정된 알고리즘으로 토큰에 서명합니다:
   * `HS256`의 경우, 공유 비밀이 토큰 서명에 사용됩니다.
   * `RS256`의 경우, 공개/개인 키 쌍이 사용됩니다.
4. `call.respond`는 토큰을 JSON 객체로 클라이언트에 [전송](server-serialization.md#send_data)합니다.

### 단계 3: Realm 구성 {id="realm"}
`realm` 속성을 사용하면 [보호된 경로](#authenticate-route)에 액세스할 때 `WWW-Authenticate` 헤더에 전달될 realm을 설정할 수 있습니다.

```kotlin
val myRealm = environment.config.property("jwt.realm").getString()
install(Authentication) {
    jwt("auth-jwt") {
        realm = myRealm
    }
}
```

### 단계 4: 토큰 검증기 구성 {id="configure-verifier"}

`verifier` 함수를 사용하면 토큰 형식과 서명을 확인할 수 있습니다:
* `HS256`의 경우, 토큰을 확인하기 위해 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 인스턴스를 전달해야 합니다.
* `RS256`의 경우, 토큰을 확인하는 데 사용되는 공개 키에 액세스하기 위한 JWKS 엔드포인트를 지정하는 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)를 전달해야 합니다. 이 경우, 발급자는 `http://0.0.0.0:8080`이므로 JWKS 엔드포인트 주소는 `http://0.0.0.0:8080/.well-known/jwks.json`이 됩니다.

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

### 단계 5: JWT 페이로드 유효성 검사 {id="validate-payload"}

1. `validate` 함수를 사용하면 JWT 페이로드에 대한 추가 유효성 검사를 수행할 수 있습니다. [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 객체를 나타내고 JWT 페이로드를 포함하는 `credential` 매개변수를 확인합니다. 아래 예시에서는 사용자 정의 `username` 클레임의 값이 확인됩니다.
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
   
   인증에 성공한 경우, [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)을 반환합니다. 
2. `challenge` 함수를 사용하면 인증 실패 시 전송할 응답을 구성할 수 있습니다.
   ```kotlin
   install(Authentication) {
       jwt("auth-jwt") {
           challenge { defaultScheme, realm ->
               call.respond(HttpStatusCode.Unauthorized, "Token is not valid or has expired")
           }
       }
   }
   ```

### 단계 6: 특정 리소스 보호 {id="authenticate-route"}

`jwt` 프로바이더를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증에 성공한 경우, `call.principal` 함수를 사용하여 경로 핸들러 내에서 인증된 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)을 검색하고 JWT 페이로드를 가져올 수 있습니다. 아래 예시에서는 사용자 정의 `username` 클레임의 값과 토큰 만료 시간이 검색됩니다.

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