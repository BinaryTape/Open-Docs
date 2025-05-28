[//]: # (title: Ktor 서버에서 베어러 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

베어러(Bearer) 인증 스키마는 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 스키마는 베어러 토큰이라고 하는 보안 토큰을 포함합니다. 베어러 인증 스키마는 [OAuth](server-oauth.md) 또는 [JWT](server-jwt.md)의 일부로 사용되지만, 베어러 토큰을 승인하기 위한 사용자 정의 로직을 제공할 수도 있습니다.

Ktor의 인증에 대한 일반적인 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

> 베어러 인증은 [HTTPS/TLS](server-ssl.md)를 통해서만 사용해야 합니다.

## 의존성 추가 {id="add_dependencies"}
`bearer` 인증을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 베어러 인증 흐름 {id="flow"}

일반적으로 베어러 인증 흐름은 다음과 같습니다.

1. 사용자가 성공적으로 인증 및 접근을 승인한 후, 서버는 클라이언트에 접근 토큰을 반환합니다.
2. 클라이언트는 `Authorization` 헤더에 `Bearer` 스키마를 사용하여 토큰을 전달하여 보호된 리소스에 요청을 보낼 수 있습니다.
   ```HTTP
   ```
   {src="snippets/auth-bearer/get.http"}
3. 서버는 요청을 수신하고 토큰을 [검증](#configure)합니다.
4. 검증 후, 서버는 보호된 리소스의 내용을 응답합니다.

## 베어러 인증 설치 {id="install"}
`bearer` 인증 프로바이더를 설치하려면 `install` 블록 내에서 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 함수를 호출합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

선택적으로 [지정된 경로를 인증](#authenticate-route)하는 데 사용할 수 있는 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## 베어러 인증 구성 {id="configure"}

Ktor에서 다양한 인증 프로바이더를 구성하는 방법에 대한 일반적인 아이디어를 얻으려면 [](server-auth.md#configure)를 참조하세요. 이 섹션에서는 `bearer` 인증 프로바이더의 구성 세부 사항을 살펴보겠습니다.

### 1단계: 베어러 프로바이더 구성 {id="configure-provider"}

`bearer` 인증 프로바이더는 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예시에서는 다음 설정이 지정됩니다.
*   `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 렐름(realm)을 설정합니다.
*   `authenticate` 함수는 클라이언트가 보낸 토큰을 확인하고, 인증 성공 시 `UserIdPrincipal`을 반환하거나 인증 실패 시 `null`을 반환합니다.

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="9-20"}

### 2단계: 특정 리소스 보호 {id="authenticate-route"}

`bearer` 프로바이더를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증 성공 시, `call.principal` 함수를 사용하여 라우트 핸들러 내에서 인증된 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="21-27"}