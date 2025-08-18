[//]: # (title: Ktor 서버의 베어러 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필요한 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

베어러(Bearer) 인증 스키마는 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 스키마는 베어러 토큰이라고 불리는 보안 토큰을 포함합니다. 베어러 인증 스키마는 [OAuth](server-oauth.md) 또는 [JWT](server-jwt.md)의 일부로 사용되지만, 베어러 토큰을 인증하기 위한 사용자 정의 로직을 제공할 수도 있습니다.

Ktor의 인증에 대한 일반 정보는 [Ktor 서버의 인증 및 권한 부여](server-auth.md) 섹션에서 확인할 수 있습니다.

> 베어러 인증은 [HTTPS/TLS](server-ssl.md)를 통해서만 사용해야 합니다.

## 의존성 추가 {id="add_dependencies"}
`bearer` 인증을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 베어러 인증 흐름 {id="flow"}

일반적으로 베어러 인증 흐름은 다음과 같습니다.

1.  사용자가 성공적으로 인증 및 접근 권한을 부여한 후, 서버는 클라이언트에게 접근 토큰을 반환합니다.
2.  클라이언트는 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 토큰을 전달하여 보호된 리소스에 요청을 할 수 있습니다.
    ```HTTP
    GET http://localhost:8080/
    Authorization: Bearer abc123
    
    
    ```
3.  서버는 요청을 수신하고 토큰을 [검증](#configure)합니다.
4.  검증 후, 서버는 보호된 리소스의 내용으로 응답합니다.

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

선택적으로 [지정된 라우트를 인증](#authenticate-route)하는 데 사용될 수 있는 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## 베어러 인증 설정 {id="configure"}

Ktor에서 다양한 인증 프로바이더를 설정하는 방법에 대한 일반적인 아이디어를 얻으려면 [인증 설정](server-auth.md#configure)을 참조하세요. 이 섹션에서는 `bearer` 인증 프로바이더의 설정 세부 사항을 살펴보겠습니다.

### 1단계: 베어러 프로바이더 설정 {id="configure-provider"}

`bearer` 인증 프로바이더는 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예제에서는 다음 설정이 지정되어 있습니다.
*   `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 realm을 설정합니다.
*   `authenticate` 함수는 클라이언트가 보낸 토큰을 확인하고, 인증 성공 시 `UserIdPrincipal`을 반환하거나 인증 실패 시 `null`을 반환합니다.

```kotlin
install(Authentication) {
    bearer("auth-bearer") {
        realm = "Access to the '/' path"
        authenticate { tokenCredential ->
            if (tokenCredential.token == "abc123") {
                UserIdPrincipal("jetbrains")
            } else {
                null
            }
        }
    }
}
```

### 2단계: 특정 리소스 보호 {id="authenticate-route"}

`bearer` 프로바이더를 설정한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증 성공 시, 라우트 핸들러 내에서 `call.principal` 함수를 사용하여 인증된 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

```kotlin
routing {
    authenticate("auth-bearer") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}