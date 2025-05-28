[//]: # (title: Ktor 서버의 기본 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>코드 예시</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

기본 인증(Basic authentication) 방식은 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 방식에서는 사용자 자격 증명(credentials)이 Base64로 인코딩된 사용자 이름/비밀번호 쌍으로 전송됩니다.

Ktor는 사용자를 로그인시키고 특정 [경로(routes)](server-routing.md)를 보호하기 위해 기본 인증을 사용할 수 있도록 합니다. Ktor의 인증에 대한 일반적인 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

> 기본 인증은 사용자 이름과 비밀번호를 평문으로 전달하므로, 민감한 정보를 보호하기 위해 [HTTPS/TLS](server-ssl.md)를 사용해야 합니다.

## 의존성 추가 {id="add_dependencies"}
기본 인증을 활성화하려면 `%artifact_name%` 아티팩트를 빌드 스크립트에 포함해야 합니다:

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 기본 인증 흐름 {id="flow"}

기본 인증 흐름은 다음과 같습니다:

1. 클라이언트가 서버 애플리케이션의 특정 [경로](server-routing.md)로 `Authorization` 헤더 없이 요청을 보냅니다.
2. 서버는 클라이언트에게 `401` (Unauthorized) 응답 상태로 응답하고, `WWW-Authenticate` 응답 헤더를 사용하여 해당 경로를 보호하기 위해 기본 인증 방식이 사용되고 있음을 알리는 정보를 제공합니다. 일반적인 `WWW-Authenticate` 헤더는 다음과 같습니다:
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   Ktor에서는 `basic` 인증 공급자(provider)를 [구성](#configure-provider)할 때 해당 속성을 사용하여 realm과 charset을 지정할 수 있습니다.

3. 일반적으로 클라이언트는 사용자가 자격 증명을 입력할 수 있는 로그인 대화 상자를 표시합니다. 그런 다음 클라이언트는 Base64로 인코딩된 사용자 이름과 비밀번호 쌍을 포함하는 `Authorization` 헤더와 함께 요청을 보냅니다. 예를 들어:
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 서버는 클라이언트가 보낸 자격 증명을 [검증](#configure-provider)하고 요청된 콘텐츠로 응답합니다.

## 기본 인증 설치 {id="install"}
`basic` 인증 공급자를 설치하려면 `install` 블록 내에서 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 함수를 호출합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // Configure basic authentication
    }
}
```

선택적으로 [지정된 경로를 인증](#authenticate-route)하는 데 사용할 수 있는 [공급자 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## 기본 인증 구성 {id="configure"}

Ktor에서 다양한 인증 공급자를 구성하는 방법에 대한 일반적인 아이디어는 [](server-auth.md#configure)를 참조하세요. 이 섹션에서는 `basic` 인증 공급자의 특정 구성에 대해 살펴보겠습니다. 

### 1단계: 기본 공급자 구성 {id="configure-provider"}

`basic` 인증 공급자는 [BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예시에서는 다음 설정이 지정됩니다:
* `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 realm을 설정합니다.
* `validate` 함수는 사용자 이름과 비밀번호를 검증합니다.

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}
   
`validate` 함수는 `UserPasswordCredential`을 확인하고 인증에 성공하면 `UserIdPrincipal`을 반환하며, 인증에 실패하면 `null`을 반환합니다. 
> 사용자 이름과 비밀번호 해시를 저장하는 인메모리 테이블에 있는 사용자를 검증하기 위해 [UserHashedTableAuth](#validate-user-hash)를 사용할 수도 있습니다.

### 2단계: 특정 리소스 보호 {id="authenticate-route"}

`basic` 공급자를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증에 성공하면, `call.principal` 함수를 사용하여 경로 핸들러 내에서 인증된 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 검색하고 인증된 사용자의 이름을 얻을 수 있습니다.

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

## UserHashedTableAuth로 검증 {id="validate-user-hash"}

Ktor는 사용자 이름과 비밀번호 해시를 저장하는 인메모리 테이블에 있는 사용자를 [검증](#configure-provider)하기 위해 [UserHashedTableAuth](#validate-user-hash)를 사용할 수 있도록 합니다. 이를 통해 데이터 소스가 유출되더라도 사용자 비밀번호가 유출되지 않도록 할 수 있습니다.

사용자를 검증하기 위해 `UserHashedTableAuth`를 사용하려면 다음 단계를 따르세요:

1. [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html) 함수를 사용하여 지정된 알고리즘과 솔트(salt) 제공자(provider)로 다이제스트 함수를 생성합니다:
   
   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="9"}

2. `UserHashedTableAuth`의 새 인스턴스를 초기화하고 다음 속성을 지정합니다:
   * `table` 속성을 사용하여 사용자 이름과 해시된 비밀번호 테이블을 제공합니다.
   * `digester` 속성에 다이제스트 함수를 할당합니다.
   
   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}
   
3. `validate` 함수 내에서 [UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html) 함수를 호출하여 사용자를 인증하고, 자격 증명이 유효한 경우 `UserIdPrincipal`의 인스턴스를 반환합니다:

   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="19-26"}