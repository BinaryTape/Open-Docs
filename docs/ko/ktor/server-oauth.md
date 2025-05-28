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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[OAuth](https://oauth.net/)는 액세스 위임을 위한 개방형 표준입니다. OAuth는 Google, Facebook, Twitter 등과 같은 외부 제공자를 사용하여 애플리케이션 사용자를 인증하는 데 사용될 수 있습니다.

`oauth` 제공자는 인증 코드 흐름(authorization code flow)을 지원합니다. OAuth 매개변수를 한 곳에서 구성할 수 있으며, Ktor는 필요한 매개변수와 함께 지정된 인증 서버에 자동으로 요청을 보냅니다.

> Ktor의 인증 및 권한 부여에 대한 일반적인 정보는 [](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 세션 플러그인 설치

클라이언트가 보호된 리소스에 접근하려 할 때마다 인증을 요청하는 것을 방지하려면, 성공적인 인증 시 액세스 토큰을 세션에 저장할 수 있습니다. 그런 다음, 보호된 경로의 핸들러 내에서 현재 세션으로부터 액세스 토큰을 검색하고 이를 사용하여 리소스를 요청할 수 있습니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="14,25-29,101,128-129"}

## OAuth 인증 흐름 {id="flow"}

Ktor 애플리케이션의 OAuth 인증 흐름은 다음과 같습니다:

1. 사용자가 Ktor 애플리케이션에서 로그인 페이지를 엽니다.
2. Ktor는 특정 제공자의 인증 페이지로 자동 리다이렉트하고 필요한 [매개변수](#configure-oauth-provider)를 전달합니다:
    * 선택한 제공자의 API에 접근하는 데 사용되는 클라이언트 ID입니다.
    * 인증이 완료된 후 열릴 Ktor 애플리케이션 페이지를 지정하는 콜백 또는 리다이렉트 URL입니다.
    * Ktor 애플리케이션에 필요한 서드파티 리소스의 스코프입니다.
    * 액세스 토큰(인증 코드)을 얻는 데 사용되는 그랜트 타입입니다.
    * CSRF 공격을 완화하고 사용자를 리다이렉트하는 데 사용되는 `state` 매개변수입니다.
    * 특정 제공자에 특화된 선택적 매개변수입니다.
3. 인증 페이지는 Ktor 애플리케이션에 필요한 권한 수준을 포함하는 동의 화면을 보여줍니다. 이러한 권한은 [](#configure-oauth-provider)에서 구성된 대로 지정된 스코프에 따라 달라집니다.
4. 사용자가 요청된 권한을 승인하면, 인증 서버는 지정된 리다이렉트 URL로 다시 리다이렉트하고 인증 코드를 보냅니다.
5. Ktor는 지정된 액세스 토큰 URL로 다음 매개변수를 포함하여 한 번 더 자동 요청을 보냅니다:
    * 인증 코드.
    * 클라이언트 ID 및 클라이언트 시크릿.

   인증 서버는 액세스 토큰을 반환하여 응답합니다.
6. 클라이언트는 이 토큰을 사용하여 선택한 제공자의 필수 서비스에 요청을 보낼 수 있습니다. 대부분의 경우, 토큰은 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 전송됩니다.
7. 서비스는 토큰을 유효성 검사하고, 권한 부여를 위해 해당 스코프를 사용하며, 요청된 데이터를 반환합니다.

## OAuth 설치 {id="install"}

`oauth` 인증 제공자를 설치하려면, `install` 블록 내에서 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 함수를 호출하세요. 선택적으로, [제공자 이름을 지정](server-auth.md#provider-name)할 수 있습니다. 예를 들어, "auth-oauth-google" 이름으로 `oauth` 제공자를 설치하는 방법은 다음과 같습니다:

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="9-10,25-26,31-33,54-55,101"}

## OAuth 구성 {id="configure-oauth"}

이 섹션에서는 Google을 사용하여 애플리케이션 사용자를 인증하도록 `oauth` 제공자를 구성하는 방법을 보여줍니다. 전체 실행 가능한 예제는 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)을 참조하세요.

### 전제 조건: 인증 자격 증명 생성 {id="authorization-credentials"}

Google API에 접근하려면 Google Cloud Console에서 인증 자격 증명을 생성해야 합니다.

1. Google Cloud Console에서 [사용자 인증 정보](https://console.cloud.google.com/apis/credentials) 페이지를 엽니다.
2. **사용자 인증 정보 만들기**를 클릭하고 `OAuth 클라이언트 ID`를 선택합니다.
3. 드롭다운에서 `웹 애플리케이션`을 선택합니다.
4. 다음 설정을 지정합니다:
    * **승인된 자바스크립트 원본**: `http://localhost:8080`.
    * **승인된 리디렉션 URI**: `http://localhost:8080/callback`.
      Ktor에서는 [urlProvider](#configure-oauth-provider) 속성을 사용하여 인증이 완료될 때 열릴 리다이렉트 경로를 지정합니다.

5. **만들기**를 클릭합니다.
6. 나타나는 대화 상자에서 생성된 클라이언트 ID와 클라이언트 시크릿을 복사합니다. 이는 `oauth` 제공자를 구성하는 데 사용됩니다.

### 1단계: HTTP 클라이언트 생성 {id="create-http-client"}

`oauth` 제공자를 구성하기 전에, 서버가 OAuth 서버에 요청을 보내는 데 사용될 [HttpClient](client-create-and-configure.md)를 생성해야 합니다. [ContentNegotiation](client-serialization.md) 클라이언트 플러그인과 JSON 직렬 변환기는 [API 요청 후](#request-api) 수신된 JSON 데이터를 역직렬화하는 데 필요합니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="20-24"}

클라이언트 인스턴스는 서버 [테스트](server-testing.md)에서 별도의 클라이언트 인스턴스를 생성할 수 있도록 `main` [모듈 함수](server-modules.md)에 전달됩니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="26,101"}

### 2단계: OAuth 제공자 구성 {id="configure-oauth-provider"}

아래 코드 스니펫은 `auth-oauth-google` 이름으로 `oauth` 제공자를 생성하고 구성하는 방법을 보여줍니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="30-54"}

* `urlProvider`는 인증이 완료될 때 호출될 [리다이렉트 경로](#redirect-route)를 지정합니다.
  > 이 경로가 [**승인된 리디렉션 URI**](#authorization-credentials) 목록에 추가되었는지 확인하세요.
* `providerLookup`을 사용하면 필수 제공자에 대한 OAuth 설정을 지정할 수 있습니다. 이러한 설정은 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 클래스로 표현되며 Ktor가 OAuth 서버에 자동 요청을 보내도록 합니다.
* `client` 속성은 Ktor가 OAuth 서버에 요청을 보내는 데 사용하는 [HttpClient](#create-http-client)를 지정합니다.

### 3단계: 로그인 경로 추가 {id="login-route"}

`oauth` 제공자를 구성한 후, `oauth` 제공자의 이름을 허용하는 `authenticate` 함수 내에 [보호된 로그인 경로](server-auth.md#authenticate-route)를 생성해야 합니다. Ktor가 이 경로로 요청을 받으면, [providerLookup](#configure-oauth-provider)에 정의된 `authorizeUrl`로 자동으로 리다이렉트됩니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-60,76,100"}

사용자는 Ktor 애플리케이션에 필요한 권한 수준을 포함하는 인증 페이지를 보게 됩니다. 이러한 권한은 [providerLookup](#configure-oauth-provider)에 지정된 `defaultScopes`에 따라 달라집니다.

### 4단계: 리다이렉트 경로 추가 {id="redirect-route"}

로그인 경로 외에도, [](#configure-oauth-provider)에 지정된 대로 `urlProvider`에 대한 리다이렉트 경로를 생성해야 합니다.

이 경로 내에서 `call.principal` 함수를 사용하여 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 객체를 검색할 수 있습니다. `OAuthAccessTokenResponse`를 통해 OAuth 서버에서 반환된 토큰 및 기타 매개변수에 접근할 수 있습니다.

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-76,100"}

이 예제에서는 토큰을 받은 후 다음 작업이 수행됩니다:

* 토큰은 [세션](server-sessions.md)에 저장되며, 이 세션의 내용은 다른 경로에서 접근할 수 있습니다.
* 사용자는 Google API에 요청이 이루어지는 다음 경로로 리다이렉트됩니다.
* 요청된 경로를 찾을 수 없는 경우, 사용자는 `/home` 경로로 리다이렉트됩니다.

### 5단계: API에 요청하기 {id="request-api"}

[리다이렉트 경로](#redirect-route) 내에서 토큰을 받고 세션에 저장한 후, 이 토큰을 사용하여 외부 API에 요청을 보낼 수 있습니다. 아래 코드 스니펫은 [HttpClient](#create-http-client)를 사용하여 이러한 요청을 보내고 `Authorization` 헤더에 이 토큰을 전송하여 사용자 정보를 얻는 방법을 보여줍니다.

요청을 보내고 응답 본문을 반환하는 `getPersonalGreeting`이라는 새 함수를 생성합니다:

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="103-110"}

그런 다음, `get` 경로 내에서 해당 함수를 호출하여 사용자 정보를 검색할 수 있습니다:

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="93-99"}

전체 실행 가능한 예제는 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)을 참조하세요.