[//]: # (title: Ktor 서버의 세션 인증)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 의존성</b>: `io.ktor:ktor-server-auth`, `io.ktor:ktor-server-sessions`
</p>
<var name="example_name" value="auth-form-session"/>
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

[세션](server-sessions.md)은 서로 다른 HTTP 요청 간에 데이터를 유지하는 메커니즘을 제공합니다. 일반적인 사용 사례로는 로그인한 사용자의 ID, 장바구니 내용 저장, 또는 클라이언트의 사용자 환경설정 유지가 있습니다.

Ktor에서 이미 연결된 세션을 가진 사용자는 `session` 프로바이더를 사용하여 인증될 수 있습니다. 예를 들어, 사용자가 처음으로 [웹 폼](server-form-based-auth.md)을 사용하여 로그인할 때, 사용자 이름을 쿠키 세션에 저장하고, 후속 요청에서는 `session` 프로바이더를 사용하여 이 사용자를 인증할 수 있습니다.

> Ktor의 인증 및 권한 부여에 대한 일반적인 정보는 [Ktor 서버의 인증 및 권한 부여](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`session` 인증을 활성화하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:

* 세션을 사용하기 위한 `ktor-server-sessions` 의존성 추가:

  <var name="artifact_name" value="ktor-server-sessions"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 인증을 위한 `ktor-server-auth` 의존성 추가:

  <var name="artifact_name" value="ktor-server-auth"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

## 세션 인증 흐름 {id="flow"}

세션을 이용한 인증 흐름은 애플리케이션에서 사용자가 인증되는 방식에 따라 달라질 수 있습니다. [폼 기반 인증](server-form-based-auth.md)에서는 어떻게 작동하는지 살펴보겠습니다:

1.  클라이언트가 웹 폼 데이터(사용자 이름과 비밀번호 포함)가 담긴 요청을 서버로 보냅니다.
2.  서버는 클라이언트가 보낸 자격 증명을 검증하고, 사용자 이름을 쿠키 세션에 저장하며, 요청된 콘텐츠와 사용자 이름이 포함된 쿠키로 응답합니다.
3.  클라이언트가 쿠키를 포함하여 보호된 리소스에 대한 후속 요청을 보냅니다.
4.  수신된 쿠키 데이터를 기반으로 Ktor는 이 사용자에 대한 쿠키 세션이 존재하는지 확인하고, 선택적으로 수신된 세션 데이터에 대해 추가적인 유효성 검사를 수행합니다. 유효성 검사가 성공하면 서버는 요청된 콘텐츠로 응답합니다.

## 세션 인증 설치 {id="install"}
`session` 인증 프로바이더를 설치하려면 `install` 블록 내에서 필요한 세션 타입과 함께 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 함수를 호출합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // 세션 인증 구성
    }
}
```

## 세션 인증 구성 {id="configure"}

이 섹션에서는 [폼 기반 인증](server-form-based-auth.md)으로 사용자를 인증하고, 이 사용자에 대한 정보를 쿠키 세션에 저장한 다음, 후속 요청에서 `session` 프로바이더를 사용하여 이 사용자를 인증하는 방법을 보여줍니다.

> 전체 예시는 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)을 참조하세요.

### 1단계: 데이터 클래스 생성 {id="data-class"}

먼저, 세션 데이터를 저장하기 위한 데이터 클래스를 생성해야 합니다:

```kotlin
@Serializable
data class UserSession(val name: String, val count: Int)
```

### 2단계: 세션 설치 및 구성 {id="install-session"}

데이터 클래스를 생성한 후, `Sessions` 플러그인을 설치하고 구성해야 합니다. 아래 예시는 지정된 쿠키 경로와 만료 시간으로 쿠키 세션을 설치하고 구성합니다.

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 60
    }
}
```

> 세션 구성에 대해 더 자세히 알아보려면 [세션 구성 개요](server-sessions.md#configuration_overview)를 참조하세요.

### 3단계: 세션 인증 구성 {id="configure-session-auth"}

`session` 인증 프로바이더는 [`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예시에서는 다음 설정들이 지정됩니다:

*   `validate()` 함수는 [세션 인스턴스](#data-class)를 확인하고, 인증 성공 시 `Any` 타입의 Principal을 반환합니다.
*   `challenge()` 함수는 인증 실패 시 수행될 동작을 지정합니다. 예를 들어, 로그인 페이지로 리디렉션하거나 [`UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)를 보낼 수 있습니다.

```kotlin
install(Authentication) {
    session<UserSession>("auth-session") {
        validate { session ->
            if(session.name.startsWith("jet")) {
                session
            } else {
                null
            }
        }
        challenge {
            call.respondRedirect("/login")
        }
    }
}
```

### 4단계: 세션에 사용자 데이터 저장 {id="save-session"}

로그인한 사용자에 대한 정보를 세션에 저장하려면 [`call.sessions.set()`](server-sessions.md#use_sessions) 함수를 사용합니다.

다음 예시는 웹 폼을 사용하는 간단한 인증 흐름을 보여줍니다:

```kotlin
authenticate("auth-form") {
    post("/login") {
        val userName = call.principal<UserIdPrincipal>()?.name.toString()
        call.sessions.set(UserSession(name = userName, count = 1))
        call.respondRedirect("/hello")
    }
}
```

> 폼 기반 인증 흐름에 대한 자세한 내용은 [폼 기반 인증](server-form-based-auth.md) 문서를 참조하세요.

### 5단계: 특정 리소스 보호 {id="authenticate-route"}

`session` 프로바이더를 구성한 후, [`authenticate()`](server-auth.md#authenticate-route) 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다.

인증 성공 시, 라우트 핸들러 내에서 `call.principal()` 함수를 사용하여 인증된 Principal (이 경우 [`UserSession`](#data-class) 인스턴스)을 검색할 수 있습니다:

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
        call.sessions.set(userSession?.copy(count = userSession.count + 1))
        call.respondText("Hello, ${userSession?.name}! Visit count is ${userSession?.count}.")
    }
}
```

> 전체 예시는 [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)을 참조하세요.