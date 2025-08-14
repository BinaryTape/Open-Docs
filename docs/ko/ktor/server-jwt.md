[//]: # (title: JSON 웹 토큰)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

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
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✖️
    </p>

</tldr>

<link-summary>
%plugin_name% 플러그인을 사용하면 Json 웹 토큰을 사용하여 클라이언트를 인증할 수 있습니다.
</link-summary>

[JSON 웹 토큰(JWT)](https://jwt.io/)은 당사자 간에 정보를 JSON 객체로 안전하게 전송하는 방법을 정의하는 개방형 표준입니다. 이 정보는 공유 비밀(HS256 알고리즘 사용) 또는 공개/개인 키 쌍(예: RS256)을 사용하여 서명되었으므로 검증되고 신뢰할 수 있습니다.

Ktor는 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 전달된 JWT를 처리하며 다음을 허용합니다:
* JSON 웹 토큰의 서명을 검증합니다.
* JWT 페이로드에 대한 추가 유효성 검사를 수행합니다.

> Ktor의 인증 및 권한 부여에 대한 일반 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`JWT` 인증을 활성화하려면 빌드 스크립트에 `ktor-server-auth` 및 `ktor-server-auth-jwt` 아티팩트를 포함해야 합니다:

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

## JWT 권한 부여 흐름 {id="flow"}
Ktor의 JWT 권한 부여 흐름은 다음과 같습니다:
1. 클라이언트는 자격 증명을 사용하여 서버 애플리케이션의 특정 인증 [경로](server-routing.md)로 `POST` 요청을 보냅니다. 아래 예시는 JSON으로 자격 증명을 전달하는 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 요청을 보여줍니다:
   [object Promise]
2. 자격 증명이 유효하면 서버는 JSON 웹 토큰을 생성하고 지정된 알고리즘으로 서명합니다. 예를 들어, 특정 공유 비밀을 사용하는 `HS256` 또는 공개/개인 키 쌍을 사용하는 `RS256`일 수 있습니다.
3. 서버는 생성된 JWT를 클라이언트에 전송합니다.
4. 이제 클라이언트는 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 JSON 웹 토큰을 전달하여 보호된 리소스에 요청을 할 수 있습니다.
   [object Promise]
5. 서버는 요청을 수신하고 다음 유효성 검사를 수행합니다:
   * 토큰의 서명을 검증합니다. [검증 방식](#configure-verifier)은 토큰 서명에 사용된 알고리즘에 따라 달라진다는 점에 유의하십시오.
   * JWT 페이로드에 대한 [추가 유효성 검사](#validate-payload)를 수행합니다.
6. 유효성 검사 후 서버는 보호된 리소스의 내용으로 응답합니다.

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
선택적으로 [지정된 경로를 인증](#authenticate-route)하는 데 사용할 수 있는 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## JWT 구성 {id="configure-jwt"}
이 섹션에서는 Ktor 서버 애플리케이션에서 JSON 웹 토큰을 사용하는 방법을 살펴보겠습니다. 토큰을 검증하는 방식이 약간 다르므로 토큰 서명에 대한 두 가지 접근 방식을 시연합니다:
* 지정된 공유 비밀을 사용하는 `HS256`.
* 공개/개인 키 쌍을 사용하는 `RS256`.

전체 프로젝트는 여기에서 찾을 수 있습니다: [auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256), [auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256).

### 1단계: JWT 설정 구성 {id="jwt-settings"}

JWT 관련 설정을 구성하려면 [설정 파일](server-configuration-file.topic)에 사용자 정의 `jwt` 그룹을 만들 수 있습니다. 예를 들어, `application.conf` 파일은 다음과 같을 수 있습니다:

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

> 비밀 정보는 설정 파일에 일반 텍스트로 저장해서는 안 됩니다. 이러한 매개변수를 지정하려면 [환경 변수](server-configuration-file.topic#environment-variables)를 사용하는 것을 고려하십시오.
>
{type="warning"}

다음과 같은 방법으로 [코드에서 이러한 설정에 접근](server-configuration-file.topic#read-configuration-in-code)할 수 있습니다:

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 2단계: 토큰 생성 {id="generate"}

JSON 웹 토큰을 생성하려면 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)를 사용할 수 있습니다. 아래 코드 스니펫은 `HS256` 및 `RS256` 알고리즘 모두에서 이를 수행하는 방법을 보여줍니다:

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

1. `post("/login")`은 `POST` 요청을 수신하기 위한 인증 [경로](server-routing.md)를 정의합니다.
2. `call.receive<User>()`는 JSON 객체로 전송된 사용자 자격 증명을 [수신](server-serialization.md#receive_data)하고 이를 `User` 클래스 객체로 변환합니다.
3. `JWT.create()`는 지정된 JWT 설정으로 토큰을 생성하고, 수신된 사용자 이름으로 사용자 정의 클레임을 추가하며, 지정된 알고리즘으로 토큰에 서명합니다:
   * `HS256`의 경우, 공유 비밀이 토큰 서명에 사용됩니다.
   * `RS256`의 경우, 공개/개인 키 쌍이 사용됩니다.
4. `call.respond`는 토큰을 JSON 객체로 클라이언트에 [전송](server-serialization.md#send_data)합니다.

### 3단계: 렐름 구성 {id="realm"}
`realm` 속성을 사용하면 [보호된 경로](#authenticate-route)에 접근할 때 `WWW-Authenticate` 헤더에 전달될 렐름을 설정할 수 있습니다.

[object Promise]

### 4단계: 토큰 검증기 구성 {id="configure-verifier"}

`verifier` 함수를 사용하면 토큰 형식과 서명을 검증할 수 있습니다:
* `HS256`의 경우, 토큰을 검증하려면 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 인스턴스를 전달해야 합니다.
* `RS256`의 경우, 토큰을 검증하는 데 사용되는 공개 키에 접근하기 위한 JWKS 엔드포인트를 지정하는 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)를 전달해야 합니다. 저희의 경우 발행자는 `http://0.0.0.0:8080`이므로 JWKS 엔드포인트 주소는 `http://0.0.0.0:8080/.well-known/jwks.json`이 됩니다.

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 5단계: JWT 페이로드 유효성 검사 {id="validate-payload"}

1. `validate` 함수를 사용하면 JWT 페이로드에 대한 추가 유효성 검사를 수행할 수 있습니다. [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 객체를 나타내고 JWT 페이로드를 포함하는 `credential` 매개변수를 확인하십시오. 아래 예시에서는 사용자 정의 `username` 클레임의 값이 확인됩니다.
   [object Promise]

   인증 성공 시 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)을 반환합니다.
2. `challenge` 함수를 사용하면 인증에 실패할 경우 전송될 응답을 구성할 수 있습니다.
   [object Promise]

### 6단계: 특정 리소스 보호 {id="authenticate-route"}

`jwt` 프로바이더를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증 성공 시, `call.principal` 함수를 사용하여 경로 핸들러 내에서 인증된 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)을 검색하고 JWT 페이로드를 가져올 수 있습니다. 아래 예시에서는 사용자 정의 `username` 클레임의 값과 토큰 만료 시간이 검색됩니다.

[object Promise]