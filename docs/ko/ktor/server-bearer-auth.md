[//]: # (title: Ktor 서버의 Bearer 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

Bearer 인증 체계 (Bearer authentication scheme)는 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 체계는 Bearer 토큰이라고 불리는 보안 토큰을 포함합니다. Bearer 인증 체계는 [OAuth](server-oauth.md) 또는 [JWT](server-jwt.md)의 일부로 사용되지만, Bearer 토큰을 승인하기 위한 커스텀 로직을 제공할 수도 있습니다.

Ktor의 인증에 대한 일반적인 정보는 [인증](server-auth.md) 섹션에서 확인할 수 있습니다.

> Bearer 인증은 [HTTPS/TLS](server-ssl.md)를 통해서만 사용되어야 합니다.

## 의존성 추가 {id="add_dependencies"}
`bearer` 인증을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

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
    

## Bearer 인증 흐름 {id="flow"}

일반적으로 Bearer 인증 흐름은 다음과 같습니다:

1. 사용자가 성공적으로 인증하고 접근을 승인하면 서버는 클라이언트에게 접근 토큰을 반환합니다.
2. 클라이언트는 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 토큰을 전달하여 보호된 리소스에 요청할 수 있습니다.
   [object Promise]
3. 서버는 요청을 받고 토큰을 [검증](#configure)합니다.
4. 검증 후 서버는 보호된 리소스의 내용을 응답합니다.

## Bearer 인증 설치 {id="install"}
`bearer` 인증 프로바이더를 설치하려면 `install` 블록 내에서 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 함수를 호출합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Bearer 인증 구성
    }
}
```

선택적으로 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있으며, 이 이름은 [특정 경로를 인증](#authenticate-route)하는 데 사용될 수 있습니다.

## Bearer 인증 구성 {id="configure"}

Ktor에서 다양한 인증 프로바이더를 구성하는 방법에 대한 일반적인 아이디어를 얻으려면 [구성](server-auth.md#configure)을 참조하세요. 이 섹션에서는 `bearer` 인증 프로바이더의 구성 세부 사항을 살펴봅니다. 

### 1단계: Bearer 프로바이더 구성 {id="configure-provider"}

`bearer` 인증 프로바이더는 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예시에서는 다음 설정이 지정됩니다.
*   `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 realm을 설정합니다.
*   `authenticate` 함수는 클라이언트가 보낸 토큰을 확인하고, 인증에 성공한 경우 `UserIdPrincipal`을 반환하거나, 인증에 실패한 경우 `null`을 반환합니다.

[object Promise]

### 2단계: 특정 리소스 보호 {id="authenticate-route"}

`bearer` 프로바이더를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션 내의 특정 리소스를 보호할 수 있습니다. 인증에 성공한 경우, `call.principal` 함수를 사용하여 경로 핸들러 내에서 인증된 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

[object Promise]