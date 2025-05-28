[//]: # (title: Ktor Server의 인증 및 권한 부여)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 플러그인은 Ktor에서 인증 및 권한 부여를 처리합니다.
</link-summary>

Ktor는 인증 및 권한 부여를 처리하기 위해 [Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html) 플러그인을 제공합니다. 일반적인 사용 시나리오는 사용자 로그인, 특정 리소스에 대한 접근 권한 부여, 그리고 당사자 간의 정보 안전한 전송을 포함합니다. 또한 `Authentication`을 [세션](server-sessions.md)과 함께 사용하여 요청 간에 사용자 정보를 유지할 수도 있습니다.

> 클라이언트 측에서는 Ktor가 인증 및 권한 부여 처리를 위한 [Authentication](client-auth.md) 플러그인을 제공합니다.

## 지원되는 인증 유형 {id="supported"}
Ktor는 다음 인증 및 권한 부여 스키마를 지원합니다:

### HTTP 인증 {id="http-auth"}
HTTP는 접근 제어 및 인증을 위한 [일반적인 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)를 제공합니다. Ktor에서는 다음 HTTP 인증 스키마를 사용할 수 있습니다:
* [Basic](server-basic-auth.md) - `Base64` 인코딩을 사용하여 사용자 이름과 비밀번호를 제공합니다. HTTPS와 함께 사용되지 않으면 일반적으로 권장되지 않습니다.
* [Digest](server-digest-auth.md) - 사용자 이름과 비밀번호에 해시 함수를 적용하여 암호화된 형태로 사용자 자격 증명(credential)을 전달하는 인증 방식입니다.
* [Bearer](server-bearer-auth.md) - 베어러 토큰(bearer token)이라는 보안 토큰을 포함하는 인증 스키마입니다.
  베어러 인증 스키마는 [OAuth](server-oauth.md) 또는 [JWT](server-jwt.md)의 일부로 사용되지만, 베어러 토큰 권한 부여를 위한 사용자 지정 로직을 제공할 수도 있습니다.

### 폼 기반 인증 {id="form-auth"}
[폼 기반](server-form-based-auth.md) 인증은 [웹 폼](https://developer.mozilla.org/en-US/docs/Learn/Forms)을 사용하여 자격 증명 정보를 수집하고 사용자를 인증합니다.

### JSON 웹 토큰 (JWT) {id="jwt"}
[JSON 웹 토큰](server-jwt.md)은 JSON 객체로 당사자 간에 정보를 안전하게 전송하기 위한 개방형 표준입니다. JSON 웹 토큰을 권한 부여를 위해 사용할 수 있습니다: 사용자가 로그인하면 각 요청에 토큰이 포함되어 사용자가 해당 토큰으로 허용된 리소스에 접근할 수 있도록 합니다. Ktor에서는 `jwt` 인증을 사용하여 토큰을 검증하고 그 안에 포함된 클레임(claim)을 유효성 검사할 수 있습니다.

### LDAP {id="ldap"}
[LDAP](server-ldap.md)는 디렉터리 서비스 인증에 사용되는 개방형 및 크로스 플랫폼 프로토콜입니다. Ktor는 지정된 LDAP 서버에 대해 사용자 자격 증명을 인증하기 위한 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 함수를 제공합니다.

### OAuth {id="oauth"}
[OAuth](server-oauth.md)는 API 접근 보안을 위한 개방형 표준입니다. Ktor의 `oauth` 프로바이더는 Google, Facebook, Twitter 등과 같은 외부 프로바이더를 사용하여 인증을 구현할 수 있도록 합니다.

### 세션 {id="sessions"}
[세션](server-sessions.md)은 서로 다른 HTTP 요청 간에 데이터를 유지하는 메커니즘을 제공합니다. 일반적인 사용 사례로는 로그인한 사용자 ID 저장, 장바구니 내용 저장, 또는 클라이언트에서 사용자 기본 설정 유지가 포함됩니다. Ktor에서는 이미 연관된 세션을 가진 사용자가 `session` 프로바이더를 사용하여 인증될 수 있습니다. 이를 수행하는 방법은 [](server-session-auth.md)에서 확인할 수 있습니다.

### 사용자 지정 {id="custom"}
Ktor는 또한 [사용자 지정 플러그인](server-custom-plugins.md) 생성을 위한 API를 제공하며, 이를 사용하여 인증 및 권한 부여를 처리하는 자신만의 플러그인을 구현할 수 있습니다.
예를 들어, `AuthenticationChecked` [훅](server-custom-plugins.md#call-handling)은 인증 자격 증명(credential)이 확인된 후 실행되며, 이를 통해 권한 부여를 구현할 수 있습니다: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization).

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

참고로, [JWT](server-jwt.md) 및 [LDAP](server-ldap.md)와 같은 일부 인증 프로바이더는 추가 아티팩트가 필요합니다.

## Authentication 설치 {id="install"}

<include from="lib.topic" element-id="install_plugin"/>

## Authentication 구성 {id="configure"}
[Authentication](#install)을 설치한 후, 다음과 같이 `Authentication`을 구성하고 사용할 수 있습니다:

### 1단계: 인증 프로바이더 선택 {id="choose-provider"}

[basic](server-basic-auth.md), [digest](server-digest-auth.md), 또는 [form](server-form-based-auth.md)과 같은 특정 인증 프로바이더를 사용하려면 `install` 블록 내에서 해당 함수를 호출해야 합니다. 예를 들어, 기본 인증을 사용하려면 [
`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 함수를 호출합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
}
```

이 함수 내에서 이 프로바이더에 특정한 설정을 [구성](#configure-provider)할 수 있습니다.

### 2단계: 프로바이더 이름 지정 {id="provider-name"}

[특정 프로바이더를 사용하는](#choose-provider) 함수는 선택적으로 프로바이더 이름을 지정할 수 있도록 합니다. 아래 코드 예시는 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 및 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 프로바이더를 각각 `"auth-basic"` 및 `"auth-form"` 이름으로 설치합니다:

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
    form("auth-form") {
        // [[[Configure form authentication|server-form-based-auth.md]]]
    }
    // ...
}
```
{disable-links="false"}

이러한 이름은 나중에 다른 프로바이더를 사용하여 [다른 경로를 인증](#authenticate-route)하는 데 사용될 수 있습니다.
> 참고로, 프로바이더 이름은 고유해야 하며, 이름이 없는 프로바이더는 하나만 정의할 수 있습니다.
>
{style="note"}

### 3단계: 프로바이더 구성 {id="configure-provider"}

각 [프로바이더 유형](#choose-provider)에는 고유한 구성이 있습니다. 예를 들어, [`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 클래스는 [`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 함수에 대한 옵션을 제공합니다. 이 클래스의 핵심 함수는 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)이며, 이는 사용자 이름과 비밀번호를 검증하는 역할을 합니다. 다음 코드 예시는 그 사용법을 보여줍니다:

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}

`validate()` 함수가 어떻게 작동하는지 이해하려면 두 가지 용어를 소개해야 합니다:

*   _Principal_ (인증 주체)은 인증될 수 있는 개체입니다: 사용자, 컴퓨터, 서비스 등. Ktor에서 다양한 인증 프로바이더는 다른 Principal을 사용할 수 있습니다. 예를 들어, `basic`, `digest`, `form` 프로바이더는 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 인증하고, `jwt` 프로바이더는 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)을 검증합니다.
    > 사용자 지정 Principal을 생성할 수도 있습니다. 이는 다음 경우에 유용할 수 있습니다:
    > - 자격 증명(credential)을 사용자 지정 Principal에 매핑하면 [경로 핸들러](#get-principal) 내에서 인증된 Principal에 대한 추가 정보를 가질 수 있습니다.
    > - [세션 인증](server-session-auth.md)을 사용하는 경우, Principal은 세션 데이터를 저장하는 데이터 클래스일 수 있습니다.
*   _Credential_ (자격 증명)은 서버가 Principal을 인증하는 데 사용하는 속성 집합입니다: 사용자/비밀번호 쌍, API 키 등. 예를 들어, `basic` 및 `form` 프로바이더는 [`UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)을 사용하여 사용자 이름과 비밀번호를 유효성 검사하고, `jwt`는 [`JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)을 유효성 검사합니다.

따라서 `validate()` 함수는 지정된 자격 증명을 확인하고, 인증 성공 시 Principal `Any`를 반환하거나, 인증 실패 시 `null`을 반환합니다.

> 특정 기준에 따라 인증을 건너뛰려면 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)을 사용하십시오. 예를 들어, [세션](server-sessions.md)이 이미 존재하는 경우 `basic` 인증을 건너뛸 수 있습니다:
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 4단계: 특정 리소스 보호 {id="authenticate-route"}

마지막 단계는 애플리케이션의 특정 리소스를 보호하는 것입니다. 이는 [`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html) 함수를 사용하여 수행할 수 있습니다. 이 함수는 두 개의 선택적 매개변수를 허용합니다:

-   중첩된 경로를 인증하는 데 사용되는 [프로바이더 이름](#provider-name).
    아래 코드 스니펫은 _auth-basic_ 이름의 프로바이더를 사용하여 `/login` 및 `/orders` 경로를 보호합니다:
    ```kotlin
    routing {
        authenticate("auth-basic") {
            get("/login") {
                // ...
            }
            get("/orders") {
                // ...
            }
        }
        get("/") {
            // ...
        }
    }
    ```
-   중첩된 인증 프로바이더를 해결하는 데 사용되는 전략.
    이 전략은 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html) 열거형 값으로 표현됩니다.

    예를 들어, 클라이언트는 `AuthenticationStrategy.Required` 전략으로 등록된 모든 프로바이더에 대한 인증 데이터를 제공해야 합니다.
    아래 코드 스니펫에서, [세션 인증](server-session-auth.md)을 통과한 사용자만이 기본 인증을 사용하여 `/admin` 경로에 접근을 시도할 수 있습니다:
    ```kotlin
    routing {
        authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
            get("/hello") {
                // ...
            }
            authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
                get("/admin") {
                    // ...
                }
            }
        }
    }
    ```

> 전체 예시는 [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)를 참조하십시오.

### 5단계: 경로 핸들러 내에서 Principal 가져오기 {id="get-principal"}

인증 성공 시, `call.principal()` 함수를 사용하여 경로 핸들러 내에서 인증된 Principal을 검색할 수 있습니다. 이 함수는 [구성된 인증 프로바이더](#configure-provider)가 반환하는 특정 Principal 유형을 허용합니다. 다음 예시에서는 `call.principal()`을 사용하여 `UserIdPrincipal`을 얻고 인증된 사용자 이름을 가져옵니다.

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

[세션 인증](server-session-auth.md)을 사용하는 경우, Principal은 세션 데이터를 저장하는 데이터 클래스일 수 있습니다. 따라서 이 데이터 클래스를 `call.principal()`에 전달해야 합니다:

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-79,82-83"}

[중첩된 인증 프로바이더](#authenticate-route)의 경우, 원하는 프로바이더에 대한 Principal을 얻기 위해 `call.principal()`에 [프로바이더 이름](#provider-name)을 전달할 수 있습니다.

아래 예시에서는 최상위 세션 프로바이더에 대한 Principal을 얻기 위해 `"auth-session"` 값이 전달됩니다:

```kotlin
```
{src="snippets/auth-form-session-nested/src/main/kotlin/com/example/Application.kt" include-lines="87,93-95,97-99"}