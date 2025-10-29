[//]: # (title: LDAP)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-ldap</code>
</p>
<var name="example_name" value="auth-ldap"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

LDAP는 사용자 정보를 저장할 수 있는 다양한 디렉터리 서비스와 연동하기 위한 프로토콜입니다. Ktor를 사용하면 [basic](server-basic-auth.md), [digest](server-digest-auth.md), 또는 [폼 기반(form-based)](server-form-based-auth.md) 인증 스킴을 사용하여 LDAP 사용자를 인증할 수 있습니다.

> Ktor의 인증 및 권한 부여에 대한 일반적인 정보는 [Ktor 서버의 인증 및 권한 부여](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`LDAP` 인증을 활성화하려면 빌드 스크립트에 `ktor-server-auth` 및 `ktor-server-auth-ldap` 아티팩트를 포함해야 합니다.

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="Sample" code="            implementation(&quot;io.ktor:ktor-server-auth:$ktor_version&quot;)&#10;            implementation(&quot;io.ktor:ktor-server-auth-ldap:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="Sample" code="            implementation &quot;io.ktor:ktor-server-auth:$ktor_version&quot;&#10;            implementation &quot;io.ktor:ktor-server-auth-ldap:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" title="Sample" code="&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;&#10;&amp;lt;dependency&amp;gt;&#10;&amp;lt;groupId&amp;gt;io.ktor&amp;lt;/groupId&amp;gt;&#10;&amp;lt;artifactId&amp;gt;ktor-server-auth-ldap&amp;lt;/artifactId&amp;gt;&#10;&amp;lt;version&amp;gt;${ktor_version}&amp;lt;/version&amp;gt;&#10;&amp;lt;/dependency&amp;gt;"/>
   </TabItem>
</Tabs>

## LDAP 구성 {id="configure"}

### 1단계: 인증 프로바이더 선택 {id="choose-auth"}

LDAP 사용자를 인증하려면 먼저 사용자 이름과 비밀번호 유효성 검사를 위한 인증 프로바이더를 선택해야 합니다. Ktor에서는 이를 위해 [basic](server-basic-auth.md), [digest](server-digest-auth.md), 또는 [폼 기반(form-based)](server-form-based-auth.md) 프로바이더를 사용할 수 있습니다. 예를 들어, `basic` 인증 프로바이더를 사용하려면 `install` 블록 내에서 [basic](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/basic.html) 함수를 호출합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.ldap.*
//...
install(Authentication) {
    basic {
        validate { credentials ->
            // Authenticate an LDAP user
        }
    }
}
```

`validate` 함수는 사용자 자격 증명을 확인하는 데 사용됩니다.
 

### 2단계: LDAP 사용자 인증 {id="authenticate"}

LDAP 사용자를 인증하려면 [ldapAuthenticate](https://api.ktor.io/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 함수를 호출해야 합니다. 이 함수는 [UserPasswordCredential](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)을 허용하고 지정된 LDAP 서버에 대해 유효성을 검사합니다.

```kotlin
install(Authentication) {
    basic("auth-ldap") {
        validate { credentials ->
            ldapAuthenticate(credentials, "ldap://0.0.0.0:389", "cn=%s,dc=ktor,dc=io")
        }
    }
}
```

`validate` 함수는 인증 성공 시 [UserIdPrincipal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 반환하고, 인증 실패 시 `null`을 반환합니다.

선택적으로, 인증된 사용자에 대한 추가 유효성 검사를 추가할 수 있습니다.

```kotlin
install(Authentication) {
    basic("auth-ldap") {
        validate { credentials ->
            ldapAuthenticate(credentials, "ldap://localhost:389", "cn=%s,dc=ktor,dc=io") {
                if (it.name == it.password) {
                    UserIdPrincipal(it.name)
                } else {
                    null
                }
            }
        }
    }
}
```

### 3단계: 특정 리소스 보호 {id="authenticate-route"}

LDAP를 구성한 후, **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증에 성공하면 라우트 핸들러 내에서 `call.principal` 함수를 사용하여 인증된 [UserIdPrincipal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

```kotlin
routing {
    authenticate("auth-ldap") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

완전한 실행 가능한 예시는 다음에서 찾을 수 있습니다: [auth-ldap](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-ldap).

> 현재 LDAP 구현은 동기(synchronous) 방식임을 명심하십시오.