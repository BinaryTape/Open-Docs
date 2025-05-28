[//]: # (title: Ktor Server의 세션 인증)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

[세션](server-sessions.md)은 서로 다른 HTTP 요청 간에 데이터를 유지하는 메커니즘을 제공합니다. 일반적인 사용 사례로는 로그인한 사용자의 ID 저장, 장바구니 내용 저장, 클라이언트의 사용자 환경설정 유지 등이 있습니다.

Ktor에서 이미 연결된 세션을 가진 사용자는 `session` 프로바이더를 사용하여 인증될 수 있습니다. 예를 들어, 사용자가 [웹 폼](server-form-based-auth.md)을 사용하여 처음 로그인할 때, 사용자 이름을 쿠키 세션에 저장하고 이후 요청에서 `session` 프로바이더를 사용하여 이 사용자를 인증할 수 있습니다.

> Ktor의 인증 및 인가에 대한 일반적인 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`session` 인증을 활성화하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:

* 세션 사용을 위해 `ktor-server-sessions` 의존성을 추가합니다:

  <var name="artifact_name" value="ktor-server-sessions"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 인증을 위해 `ktor-server-auth` 의존성을 추가합니다:

  <var name="artifact_name" value="ktor-server-auth"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

## 세션 인증 흐름 {id="flow"}

세션을 사용하는 인증 흐름은 다양할 수 있으며, 애플리케이션에서 사용자가 어떻게 인증되는지에 따라 달라집니다. [폼 기반 인증](server-form-based-auth.md)을 사용했을 때의 모습을 살펴보겠습니다:

1. 클라이언트가 웹 폼 데이터(사용자 이름과 비밀번호 포함)를 담은 요청을 서버에 보냅니다.
2. 서버는 클라이언트가 보낸 자격 증명을 검증하고, 사용자 이름을 쿠키 세션에 저장한 다음, 요청된 콘텐츠와 사용자 이름이 포함된 쿠키로 응답합니다.
3. 클라이언트는 쿠키를 포함하여 보호된 리소스에 후속 요청을 보냅니다.
4. 수신된 쿠키 데이터를 기반으로 Ktor는 이 사용자를 위한 쿠키 세션이 존재하는지 확인하고, 선택적으로 수신된 세션 데이터에 대한 추가 검증을 수행합니다. 검증에 성공하면 서버는 요청된 콘텐츠로 응답합니다.

## 세션 인증 설치 {id="install"}
`session` 인증 프로바이더를 설치하려면 `install` 블록 내에서 필요한 세션 유형과 함께 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 함수를 호출합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // Configure session authentication
    }
}
```

## 세션 인증 구성 {id="configure"}

이 섹션에서는 [폼 기반 인증](server-form-based-auth.md)을 사용하여 사용자를 인증하고, 이 사용자에 대한 정보를 쿠키 세션에 저장한 다음, `session` 프로바이더를 사용하여 이후 요청에서 이 사용자를 인증하는 방법을 보여줍니다.

> 전체 예제는 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)에서 확인할 수 있습니다.

### 1단계: 데이터 클래스 생성 {id="data-class"}

먼저, 세션 데이터를 저장할 데이터 클래스를 생성해야 합니다:

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

### 2단계: 세션 설치 및 구성 {id="install-session"}

데이터 클래스를 생성한 후, `Sessions` 플러그인을 설치하고 구성해야 합니다. 아래 예제는 지정된 쿠키 경로와 만료 시간을 가진 쿠키 세션을 설치하고 구성합니다.

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

> 세션 구성에 대한 자세한 내용은 [](server-sessions.md#configuration_overview)를 참조하세요.

### 3단계: 세션 인증 구성 {id="configure-session-auth"}

`session` 인증 프로바이더는 [`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예제에서는 다음 설정이 지정됩니다:

* `validate()` 함수는 [세션 인스턴스](#data-class)를 확인하고 인증에 성공하면 `Any` 타입의 principal을 반환합니다.
* `challenge()` 함수는 인증 실패 시 수행되는 작업을 지정합니다. 예를 들어, 로그인 페이지로 리디렉션하거나 [`UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)를 보낼 수 있습니다.

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="22,34-46"}

### 4단계: 세션에 사용자 데이터 저장 {id="save-session"}

로그인한 사용자에 대한 정보를 세션에 저장하려면 [`call.sessions.set()`](server-sessions.md#use_sessions) 함수를 사용합니다.

다음 예제는 웹 폼을 사용한 간단한 인증 흐름을 보여줍니다:

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="69-75"}

> 폼 기반 인증 흐름에 대한 자세한 내용은 [폼 기반 인증](server-form-based-auth.md) 문서를 참조하세요.

### 5단계: 특정 리소스 보호 {id="authenticate-route"}

`session` 프로바이더를 구성한 후, [`authenticate()`](server-auth.md#authenticate-route) 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다.

인증에 성공하면, 라우트 핸들러 내에서 `call.principal()` 함수를 사용하여 인증된 principal(이 경우 [`UserSession`](#data-class) 인스턴스)을 검색할 수 있습니다:

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-83"}

> 전체 예제는 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)에서 확인할 수 있습니다.