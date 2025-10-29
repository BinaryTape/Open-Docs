[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
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

[OAuth](https://oauth.net/)는 액세스 위임을 위한 개방형 표준입니다. OAuth는 Google, Facebook, Twitter 등과 같은 외부 제공자(provider)를 사용하여 애플리케이션 사용자를 인가하는 데 사용될 수 있습니다.

`oauth` 프로바이더는 인가 코드 흐름(authorization code flow)을 지원합니다. OAuth 매개변수를 한 곳에서 구성할 수 있으며, Ktor는 필요한 매개변수를 사용하여 지정된 인가 서버(authorization server)에 자동으로 요청을 보냅니다.

> Ktor의 인증 및 인가에 대한 일반적인 정보는 [Ktor 서버의 인증 및 인가](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
</p>
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

## Sessions 플러그인 설치

클라이언트가 보호된 리소스에 접근할 때마다 인가를 요청하는 것을 피하려면, 성공적인 인가 시 세션에 액세스 토큰을 저장할 수 있습니다.
그런 다음 보호된 경로의 핸들러 내에서 현재 세션으로부터 액세스 토큰을 검색하고 이를 사용하여 리소스를 요청할 수 있습니다.

```kotlin
import io.ktor.server.sessions.*

fun Application.main(httpClient: HttpClient = applicationHttpClient) {
    install(Sessions) {
        cookie<UserSession>("user_session")
    }
}
@Serializable
data class UserSession(val state: String, val token: String)
```

## OAuth 인가 흐름 {id="flow"}

Ktor 애플리케이션의 OAuth 인가 흐름은 다음과 같습니다:

1.  사용자가 Ktor 애플리케이션에서 로그인 페이지를 엽니다.
2.  Ktor는 특정 제공자의 인가 페이지로 자동으로 리디렉션하고 필요한 [매개변수](#configure-oauth-provider)를 전달합니다:
    *   선택된 제공자의 API에 액세스하는 데 사용되는 클라이언트 ID.
    *   인가가 완료된 후 열릴 Ktor 애플리케이션 페이지를 지정하는 콜백 또는 리디렉션 URL.
    *   Ktor 애플리케이션에 필요한 서드파티 리소스의 스코프(scope).
    *   액세스 토큰을 얻는 데 사용되는 그랜트 타입(Grant Type) (Authorization Code).
    *   CSRF 공격을 완화하고 사용자를 리디렉션하는 데 사용되는 `state` 매개변수.
    *   특정 제공자에 특화된 선택적 매개변수.
3.  인가 페이지는 Ktor 애플리케이션에 필요한 권한 수준을 포함하는 동의 화면을 표시합니다. 이 권한은 [단계 2: OAuth 프로바이더 구성](#configure-oauth-provider)에서 구성된 지정된 스코프에 따라 달라집니다.
4.  사용자가 요청된 권한을 승인하면, 인가 서버는 지정된 리디렉션 URL로 다시 리디렉션하고 인가 코드(authorization code)를 보냅니다.
5.  Ktor는 다음 매개변수를 포함하여 지정된 액세스 토큰 URL로 한 번 더 자동 요청을 보냅니다:
    *   인가 코드.
    *   클라이언트 ID 및 클라이언트 시크릿(client secret).

    인가 서버는 액세스 토큰을 반환하여 응답합니다.
6.  클라이언트는 이 토큰을 사용하여 선택된 제공자의 필요한 서비스에 요청을 보낼 수 있습니다. 대부분의 경우 토큰은 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 전송됩니다.
7.  서비스는 토큰을 검증하고, 인가를 위해 스코프를 사용하며, 요청된 데이터를 반환합니다.

## OAuth 설치 {id="install"}

`oauth` 인증 프로바이더를 설치하려면 `install` 블록 내에서 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 함수를 호출하세요. 선택적으로 [프로바이더 이름](server-auth.md#provider-name)을 지정할 수 있습니다. 예를 들어, "auth-oauth-google"이라는 이름으로 `oauth` 프로바이더를 설치하는 방법은 다음과 같습니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*

fun Application.main(httpClient: HttpClient = applicationHttpClient) {
    install(Authentication) {
        oauth("auth-oauth-google") {
            // Configure oauth authentication
            urlProvider = { "http://localhost:8080/callback" }
        }
    }
}
```

## OAuth 구성 {id="configure-oauth"}

이 섹션에서는 Google을 사용하여 애플리케이션 사용자를 인가하기 위한 `oauth` 프로바이더를 구성하는 방법을 보여줍니다. 완전한 실행 예시는 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)에서 확인할 수 있습니다.

### 전제 조건: 인가 자격 증명 생성 {id="authorization-credentials"}

Google API에 액세스하려면 Google Cloud Console에서 인가 자격 증명(authorization credentials)을 생성해야 합니다.

1.  Google Cloud Console에서 [자격 증명](https://console.cloud.google.com/apis/credentials) 페이지를 엽니다.
2.  **CREATE CREDENTIALS**를 클릭하고 `OAuth client ID`를 선택하세요.
3.  드롭다운에서 `Web application`을 선택하세요.
4.  다음 설정을 지정하세요:
    *   **인증된 JavaScript 원본(origins)**: `http://localhost:8080`.
    *   **인증된 리디렉션 URI(URIs)**: `http://localhost:8080/callback`.
      Ktor에서는 [urlProvider](#configure-oauth-provider) 속성이 인가가 완료될 때 열릴 리디렉션 경로를 지정하는 데 사용됩니다.

5.  **CREATE**를 클릭하세요.
6.  호출된 대화 상자에서 생성된 클라이언트 ID와 클라이언트 시크릿(client secret)을 복사하세요. 이는 `oauth` 프로바이더를 구성하는 데 사용됩니다.

### 단계 1: HTTP 클라이언트 생성 {id="create-http-client"}

`oauth` 프로바이더를 구성하기 전에, 서버가 OAuth 서버에 요청을 보내는 데 사용할 [HttpClient](client-create-and-configure.md)를 생성해야 합니다. 수신된 JSON 데이터를 [API 요청 후](#request-api) 역직렬화하려면 JSON 직렬 변환기(serializer)를 포함한 [ContentNegotiation](client-serialization.md) 클라이언트 플러그인이 필요합니다.

```kotlin
val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
        })
    }
}
```

클라이언트 인스턴스는 서버 [테스트](server-testing.md)에서 별도의 클라이언트 인스턴스를 생성할 수 있도록 `main` [모듈 함수](server-modules.md)에 전달됩니다.

```kotlin
fun Application.main(httpClient: HttpClient = applicationHttpClient) {
}
```

### 단계 2: OAuth 프로바이더 구성 {id="configure-oauth-provider"}

아래 코드 스니펫은 `auth-oauth-google` 이름으로 `oauth` 프로바이더를 생성하고 구성하는 방법을 보여줍니다.

```kotlin
val redirects = mutableMapOf<String, String>()
install(Authentication) {
    oauth("auth-oauth-google") {
        // Configure oauth authentication
        urlProvider = { "http://localhost:8080/callback" }
        providerLookup = {
            OAuthServerSettings.OAuth2ServerSettings(
                name = "google",
                authorizeUrl = "https://accounts.google.com/o/oauth2/auth",
                accessTokenUrl = "https://accounts.google.com/o/oauth2/token",
                requestMethod = HttpMethod.Post,
                clientId = System.getenv("GOOGLE_CLIENT_ID"),
                clientSecret = System.getenv("GOOGLE_CLIENT_SECRET"),
                defaultScopes = listOf("https://www.googleapis.com/auth/userinfo.profile"),
                extraAuthParameters = listOf("access_type" to "offline"),
                onStateCreated = { call, state ->
                    //saves new state with redirect url value
                    call.request.queryParameters["redirectUrl"]?.let {
                        redirects[state] = it
                    }
                }
            )
        }
        client = httpClient
    }
}
```

*   `urlProvider`는 인가가 완료될 때 호출될 [리디렉션 경로](#redirect-route)를 지정합니다.
    > 이 경로가 [**인증된 리디렉션 URI**](#authorization-credentials) 목록에 추가되었는지 확인하세요.
*   `providerLookup`을(를) 사용하면 필요한 프로바이더에 대한 OAuth 설정을 지정할 수 있습니다. 이 설정은 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 클래스로 표현되며 Ktor가 OAuth 서버에 자동으로 요청을 보내도록 허용합니다.
*   `client` 속성은 Ktor가 OAuth 서버에 요청을 보내는 데 사용하는 [HttpClient](#create-http-client)를 지정합니다.

### 단계 3: 로그인 경로 추가 {id="login-route"}

`oauth` 프로바이더를 구성한 후, `authenticate` 함수 내부에 `oauth` 프로바이더의 이름을 허용하는 [보호된 로그인 경로](server-auth.md#authenticate-route)를 생성해야 합니다. Ktor가 이 경로로 요청을 받으면, [providerLookup](#configure-oauth-provider)에 정의된 `authorizeUrl`로 자동으로 리디렉션됩니다.

```kotlin
routing {
    authenticate("auth-oauth-google") {
        get("/login") {
            // Redirects to 'authorizeUrl' automatically
        }
    }
}
```

사용자는 Ktor 애플리케이션에 필요한 권한 수준을 포함하는 인가 페이지를 보게 됩니다. 이 권한은 [providerLookup](#configure-oauth-provider)에 지정된 `defaultScopes`에 따라 달라집니다.

### 단계 4: 리디렉션 경로 추가 {id="redirect-route"}

로그인 경로 외에도, [단계 2: OAuth 프로바이더 구성](#configure-oauth-provider)에서 지정된 대로 `urlProvider`에 대한 리디렉션 경로를 생성해야 합니다.

이 경로 내에서 `call.principal` 함수를 사용하여 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 객체를 검색할 수 있습니다. `OAuthAccessTokenResponse`를 사용하면 OAuth 서버가 반환한 토큰 및 기타 매개변수에 액세스할 수 있습니다.

```kotlin
    routing {
        authenticate("auth-oauth-google") {
            get("/login") {
                // Redirects to 'authorizeUrl' automatically
            }

            get("/callback") {
                val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()
                // redirects home if the url is not found before authorization
                currentPrincipal?.let { principal ->
                    principal.state?.let { state ->
                        call.sessions.set(UserSession(state, principal.accessToken))
                        redirects[state]?.let { redirect ->
                            call.respondRedirect(redirect)
                            return@get
                        }
                    }
                }
                call.respondRedirect("/home")
            }
        }
    }
```

이 예시에서는 토큰을 받은 후 다음 작업이 수행됩니다:

*   토큰은 [세션](server-sessions.md)에 저장되며, 해당 내용은 다른 경로 내에서 액세스할 수 있습니다.
*   사용자는 Google API에 대한 요청이 이루어지는 다음 경로로 리디렉션됩니다.
*   요청된 경로를 찾을 수 없는 경우, 사용자는 `/home` 경로로 리디렉션됩니다.

### 단계 5: API 요청 {id="request-api"}

[리디렉션 경로](#redirect-route) 내에서 토큰을 받고 이를 세션에 저장한 후, 이 토큰을 사용하여 외부 API에 요청을 보낼 수 있습니다. 아래 코드 스니펫은 [HttpClient](#create-http-client)를 사용하여 이러한 요청을 수행하고 `Authorization` 헤더에 이 토큰을 전송하여 사용자 정보를 얻는 방법을 보여줍니다.

`getPersonalGreeting`이라는 새 함수를 생성합니다. 이 함수는 요청을 수행하고 응답 본문(response body)을 반환합니다:

```kotlin
private suspend fun getPersonalGreeting(
    httpClient: HttpClient,
    userSession: UserSession
): UserInfo = httpClient.get("https://www.googleapis.com/oauth2/v2/userinfo") {
    headers {
        append(HttpHeaders.Authorization, "Bearer ${userSession.token}")
    }
}.body()
```

그런 다음, `get` 경로 내에서 해당 함수를 호출하여 사용자 정보를 검색할 수 있습니다:

```kotlin
get("/{path}") {
    val userSession: UserSession? = getSession(call)
    if (userSession != null) {
        val userInfo: UserInfo = getPersonalGreeting(httpClient, userSession)
        call.respondText("Hello, ${userInfo.name}!")
    }
}
```

완전한 실행 예시는 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)에서 확인할 수 있습니다.