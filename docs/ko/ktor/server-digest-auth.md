[//]: # (title: Ktor 서버의 다이제스트 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

다이제스트(Digest) 인증 스키마는 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 스키마에서는 사용자 이름과 비밀번호를 네트워크를 통해 보내기 전에 해시 함수를 적용합니다.

Ktor를 사용하면 다이제스트 인증을 통해 사용자를 로그인시키고 특정 [라우트](server-routing.md)를 보호할 수 있습니다. Ktor의 인증에 대한 일반적인 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`digest` 인증을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 다이제스트 인증 흐름 {id="flow"}

다이제스트 인증 흐름은 다음과 같습니다:

1. 클라이언트가 서버 애플리케이션의 특정 [라우트](server-routing.md)에 `Authorization` 헤더 없이 요청을 보냅니다.
1. 서버는 클라이언트에 `401` (Unauthorized) 응답 상태로 응답하고, `WWW-Authenticate` 응답 헤더를 사용하여 다이제스트 인증 스키마가 라우트를 보호하는 데 사용된다는 정보를 제공합니다. 일반적인 `WWW-Authenticate` 헤더는 다음과 같습니다:

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   Ktor에서는 `digest` 인증 프로바이더를 [설정할](#configure-provider) 때 realm과 nonce 값을 생성하는 방법을 지정할 수 있습니다.

1. 일반적으로 클라이언트는 사용자가 자격 증명을 입력할 수 있는 로그인 대화 상자를 표시합니다. 그런 다음 클라이언트는 다음 `Authorization` 헤더와 함께 요청을 보냅니다:

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 값은 다음 방식으로 생성됩니다:
   
   a. `HA1 = MD5(username:realm:password)`
   > 이 부분은 서버에 [저장되며](#digest-table) Ktor가 사용자 자격 증명을 검증하는 데 사용될 수 있습니다.
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

1. 서버는 클라이언트가 보낸 자격 증명을 [검증하고](#configure-provider) 요청된 콘텐츠로 응답합니다.

## 다이제스트 인증 설치 {id="install"}
`digest` 인증 프로바이더를 설치하려면 `install` 블록 내에서 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 함수를 호출합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // Configure digest authentication
    }
}
```
선택적으로 [지정된 라우트를 인증하는](#authenticate-route) 데 사용될 수 있는 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## 다이제스트 인증 설정 {id="configure"}

Ktor에서 다양한 인증 프로바이더를 설정하는 방법에 대한 일반적인 아이디어를 얻으려면 [](server-auth.md#configure)를 참조하세요. 이 섹션에서는 `digest` 인증 프로바이더의 설정 세부 사항을 살펴보겠습니다.

### 1단계: 다이제스트가 포함된 사용자 테이블 제공 {id="digest-table"}

`digest` 인증 프로바이더는 다이제스트 메시지의 `HA1` 부분을 사용하여 사용자 자격 증명을 검증합니다. 따라서 사용자 이름과 해당 `HA1` 해시를 포함하는 사용자 테이블을 제공할 수 있습니다. 아래 예제에서는 `getMd5Digest` 함수를 사용하여 `HA1` 해시를 생성합니다:

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="10-16"}

### 2단계: 다이제스트 프로바이더 설정 {id="configure-provider"}

`digest` 인증 프로바이더는 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 클래스를 통해 해당 설정을 노출합니다. 아래 예제에서는 다음 설정이 지정됩니다:
* `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 realm을 설정합니다.
* `digestProvider` 함수는 지정된 사용자 이름에 대해 다이제스트의 `HA1` 부분을 가져옵니다.
* (선택 사항) `validate` 함수를 사용하면 자격 증명을 사용자 지정 Principal에 매핑할 수 있습니다.

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="18-33,41-43"}

또한 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 속성을 사용하여 nonce 값을 생성하는 방법을 지정할 수 있습니다.

### 3단계: 특정 리소스 보호 {id="authenticate-route"}

`digest` 프로바이더를 설정한 후에는 **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증 성공 시, `call.principal` 함수를 사용하여 라우트 핸들러 내에서 인증된 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="34-40"}