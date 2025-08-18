[//]: # (title: Ktor 클라이언트의 베어러 인증)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

베어러 인증(Bearer authentication)은 베어러 토큰(bearer tokens)이라는 보안 토큰을 포함합니다. 예를 들어, 이러한 토큰은 OAuth 흐름(OAuth flow)의 일부로 Google, Facebook, Twitter 등과 같은 외부 공급자를 사용하여 애플리케이션 사용자를 인증하는 데 사용될 수 있습니다. Ktor 서버의 [OAuth 권한 부여 흐름](server-oauth.md#flow) 섹션에서 OAuth 흐름이 어떻게 작동하는지 알아볼 수 있습니다.

> 서버에서 Ktor는 베어러 인증을 처리하기 위해 [Authentication](server-bearer-auth.md) 플러그인을 제공합니다.

## 베어러 인증 구성 {id="configure"}

Ktor 클라이언트는 `Authorization` 헤더에 `Bearer` 스킴을 사용하여 보낼 토큰을 구성할 수 있도록 합니다. 또한, 이전 토큰이 유효하지 않은 경우 토큰을 새로 고치는 로직을 지정할 수 있습니다. `bearer` 제공자를 구성하려면 다음 단계를 따르세요.

1.  `install` 블록 내에서 `bearer` 함수를 호출합니다.
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // Configure bearer authentication
          }
       }
   }
   ```
   
2.  `loadTokens` 콜백을 사용하여 초기 액세스 토큰과 리프레시 토큰을 얻는 방법을 구성합니다. 이 콜백은 로컬 저장소에서 캐시된 토큰을 로드하고 이를 `BearerTokens` 인스턴스로 반환하는 역할을 합니다.

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // Load tokens from a local storage and return them as the 'BearerTokens' instance
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123` 액세스 토큰은 `Authorization` 헤더에 `Bearer` 스킴을 사용하여 각 [요청](client-requests.md)과 함께 전송됩니다.
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3.  `refreshTokens`를 사용하여 이전 토큰이 유효하지 않은 경우 새 토큰을 얻는 방법을 지정합니다.

   ```kotlin
   install(Auth) {
       bearer {
           // Load tokens ...
           refreshTokens { // this: RefreshTokensParams
               // Refresh tokens and return them as the 'BearerTokens' instance
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   이 콜백은 다음과 같이 작동합니다.
   
   a. 클라이언트는 유효하지 않은 액세스 토큰을 사용하여 보호된 리소스에 요청하고 `401` (Unauthorized) 응답을 받습니다.
     > [여러 제공자](client-auth.md#realm)가 설치된 경우, 응답에 `WWW-Authenticate` 헤더가 있어야 합니다.
   
   b. 클라이언트는 새로운 토큰을 얻기 위해 `refreshTokens`를 자동으로 호출합니다.

   c. 클라이언트는 이번에는 새로운 토큰을 사용하여 보호된 리소스에 자동으로 한 번 더 요청합니다.

4.  선택적으로, `401` (Unauthorized) 응답을 기다리지 않고 자격 증명(credentials)을 보낼 조건을 지정할 수 있습니다. 예를 들어, 요청이 지정된 호스트로 이루어지는지 확인할 수 있습니다.

   ```kotlin
   install(Auth) {
       bearer {
           // Load and refresh tokens ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

## 예시: 베어러 인증을 사용하여 Google API에 액세스 {id="example-oauth-google"}

인증 및 권한 부여를 위해 [OAuth 2.0 프로토콜](https://developers.google.com/identity/protocols/oauth2)을 사용하는 Google API에 액세스하기 위해 베어러 인증을 사용하는 방법을 살펴보겠습니다. Google 프로필 정보를 가져오는 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 콘솔 애플리케이션을 조사할 것입니다.

### 클라이언트 자격 증명 얻기 {id="google-client-credentials"}
첫 번째 단계로, Google API에 액세스하는 데 필요한 클라이언트 자격 증명(client credentials)을 얻어야 합니다.
1.  Google 계정을 만듭니다.
2.  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)을 열고 `Android` 애플리케이션 유형으로 `OAuth client ID` 자격 증명을 생성합니다. 이 클라이언트 ID는 [권한 부여 승인](#step1)을 얻는 데 사용됩니다.

### OAuth 권한 부여 흐름 {id="oauth-flow"}

애플리케이션의 OAuth 권한 부여 흐름은 다음과 같습니다.

```Console
(1)  --> 권한 부여 요청                리소스 소유자(Resource owner)
(2)  <-- 권한 부여 승인 (코드)           리소스 소유자(Resource owner)
(3)  --> 권한 부여 승인 (코드)           권한 부여 서버(Authorization server)
(4)  <-- 액세스 및 리프레시 토큰            권한 부여 서버(Authorization server)
(5)  --> 유효한 토큰으로 요청             리소스 서버(Resource server)
(6)  <-- 보호된 리소스                   리소스 서버(Resource server)
⌛⌛⌛    토큰 만료
(7)  --> 만료된 토큰으로 요청           리소스 서버(Resource server)
(8)  <-- 401 Unauthorized 응답            리소스 서버(Resource server)
(9)  --> 권한 부여 승인 (리프레시 토큰)  권한 부여 서버(Authorization server)
(10) <-- 액세스 및 리프레시 토큰            권한 부여 서버(Authorization server)
(11) --> 새 토큰으로 요청               리소스 서버(Resource server)
(12) <-- 보호된 리소스                   리소스 서버(Resource server)
```
{disable-links="false"}

각 단계가 어떻게 구현되는지, 그리고 `Bearer` 인증 제공자가 API에 액세스하는 데 어떻게 도움이 되는지 살펴보겠습니다.

### (1) -> 권한 부여 요청 {id="step1"}

첫 번째 단계로, 원하는 권한을 요청하는 데 사용되는 권한 부여 링크를 빌드해야 합니다. 이를 위해 지정된 쿼리 매개변수를 URL에 추가해야 합니다.

```kotlin
val authorizationUrlQuery = parameters {
    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
    append("scope", "https://www.googleapis.com/auth/userinfo.profile")
    append("response_type", "code")
    append("redirect_uri", "http://127.0.0.1:8080")
    append("access_type", "offline")
}.formUrlEncode()
println("https://accounts.google.com/o/oauth2/auth?$authorizationUrlQuery")
println("Open a link above, get the authorization code, insert it below, and press Enter.")
```

- `client_id`: [이전에 얻은](#google-client-credentials) 클라이언트 ID는 Google API에 액세스하는 데 사용됩니다.
- `scope`: Ktor 애플리케이션에 필요한 리소스의 범위(scopes). 이 경우 애플리케이션은 사용자 프로필에 대한 정보를 요청합니다.
- `response_type`: 액세스 토큰을 얻는 데 사용되는 승인 유형(grant type). 이 경우 권한 부여 코드(authorization code)를 얻어야 합니다.
- `redirect_uri`: `http://127.0.0.1:8080` 값은 권한 부여 코드를 얻기 위해 루프백 IP 주소(Loopback IP address) 흐름이 사용됨을 나타냅니다.
   > 이 URL을 사용하여 권한 부여 코드를 받으려면 애플리케이션이 로컬 웹 서버에서 수신 대기하고 있어야 합니다.
   > 예를 들어, [Ktor 서버](server-create-and-configure.topic)를 사용하여 쿼리 매개변수로 권한 부여 코드를 얻을 수 있습니다.
- `access_type`: 콘솔 애플리케이션이 사용자가 브라우저에 없을 때 액세스 토큰을 새로 고쳐야 하므로 액세스 유형은 `offline`으로 설정됩니다.

### (2)  <- 권한 부여 승인 (코드) {id="step2"}

이 단계에서는 브라우저에서 권한 부여 코드를 복사하여 콘솔에 붙여넣고 변수에 저장합니다.

```kotlin
val authorizationCode = readln()
```

### (3)  -> 권한 부여 승인 (코드) {id="step3"}

이제 권한 부여 코드를 토큰으로 교환할 준비가 되었습니다. 이를 위해 클라이언트를 생성하고 `json` 직렬 변환기(serializer)와 함께 [ContentNegotiation](client-serialization.md) 플러그인을 설치해야 합니다. 이 직렬 변환기는 Google OAuth 토큰 엔드포인트에서 받은 토큰을 역직렬화하는 데 필요합니다.

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

생성된 클라이언트를 사용하여 권한 부여 코드와 기타 필요한 옵션을 [폼 매개변수(form parameters)](client-requests.md#form_parameters)로 토큰 엔드포인트에 안전하게 전달할 수 있습니다.

```kotlin
val tokenInfo: TokenInfo = client.submitForm(
    url = "https://accounts.google.com/o/oauth2/token",
    formParameters = parameters {
        append("grant_type", "authorization_code")
        append("code", authorizationCode)
        append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
        append("client_secret", System.getenv("GOOGLE_CLIENT_SECRET"))
        append("redirect_uri", "http://127.0.0.1:8080")
    }
).body()
```

그 결과, 토큰 엔드포인트는 JSON 객체로 토큰을 전송하고, 이는 설치된 `json` 직렬 변환기를 사용하여 `TokenInfo` 클래스 인스턴스로 역직렬화됩니다. `TokenInfo` 클래스는 다음과 같습니다.

```kotlin
import kotlinx.serialization.*

@Serializable
data class TokenInfo(
    @SerialName("access_token") val accessToken: String,
    @SerialName("expires_in") val expiresIn: Int,
    @SerialName("refresh_token") val refreshToken: String? = null,
    val scope: String,
    @SerialName("token_type") val tokenType: String,
    @SerialName("id_token") val idToken: String,
)
```

### (4)  <- 액세스 및 리프레시 토큰 {id="step4"}

토큰을 받으면 저장소(storage)에 저장할 수 있습니다. 이 예시에서 저장소는 `BearerTokens` 인스턴스의 변경 가능한(mutable) 리스트입니다. 이는 해당 요소를 `loadTokens` 및 `refreshTokens` 콜백에 전달할 수 있음을 의미합니다.

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> `bearerTokenStorage`는 클라이언트 구성 내에서 사용될 것이므로 [클라이언트 초기화](#step3) 전에 생성되어야 합니다.

### (5)  -> 유효한 토큰으로 요청 {id="step5"}

이제 유효한 토큰이 있으므로 보호된 Google API에 요청하여 사용자 정보를 가져올 수 있습니다. 먼저 클라이언트 [구성](#step3)을 조정해야 합니다.

```kotlin
        val client = HttpClient(CIO) {
            install(ContentNegotiation) {
                json()
            }

            install(Auth) {
                bearer {
                    loadTokens {
                        bearerTokenStorage.last()
                    }
                    sendWithoutRequest { request ->
                        request.url.host == "www.googleapis.com"
                    }
                }
            }
        }
```

다음 설정이 지정됩니다.

- 이미 설치된 `json` 직렬 변환기가 있는 [ContentNegotiation](client-serialization.md) 플러그인은 리소스 서버에서 JSON 형식으로 받은 사용자 정보를 역직렬화하는 데 필요합니다.

- `bearer` 제공자가 있는 [Auth](client-auth.md) 플러그인은 다음과 같이 구성됩니다.
   * `loadTokens` 콜백은 [저장소](#step4)에서 토큰을 로드합니다.
   * `sendWithoutRequest` 콜백은 보호된 리소스에 대한 액세스를 제공하는 호스트에만 `401` (Unauthorized) 응답을 기다리지 않고 자격 증명을 보내도록 구성됩니다.

이 클라이언트는 보호된 리소스에 요청하는 데 사용될 수 있습니다.

```kotlin
while (true) {
```

### (6)  <- 보호된 리소스 {id="step6"}

리소스 서버는 사용자 정보를 JSON 형식으로 반환합니다. 응답을 `UserInfo` 클래스 인스턴스로 역직렬화하고 개인적인 인사말을 표시할 수 있습니다.

```kotlin
val userInfo: UserInfo = response.body()
println("Hello, ${userInfo.name}!")
```

`UserInfo` 클래스는 다음과 같습니다.

```kotlin
import kotlinx.serialization.*

@Serializable
data class UserInfo(
    val id: String,
    val name: String,
    @SerialName("given_name") val givenName: String,
    @SerialName("family_name") val familyName: String,
    val picture: String,
    val locale: String
)
```

### (7)  -> 만료된 토큰으로 요청 {id="step7"}

어느 시점에서 클라이언트는 [5단계](#step5)와 같이 요청을 하지만 만료된 액세스 토큰으로 요청합니다.

### (8)  <- 401 Unauthorized 응답 {id="step8"}

리소스 서버는 `401` 무단(unauthorized) 응답을 반환하므로 클라이언트는 `refreshTokens` 콜백을 호출해야 합니다.
> `401` 응답은 오류 세부 정보가 포함된 JSON 데이터를 반환하므로 응답을 받을 때 이 경우를 [처리](#step12)해야 합니다.

### (9)  -> 권한 부여 승인 (리프레시 토큰) {id="step9"}

새 액세스 토큰을 얻으려면 `refreshTokens`를 구성하고 토큰 엔드포인트에 또 다른 요청을 해야 합니다. 이번에는 `authorization_code` 대신 `refresh_token` 승인 유형(grant type)을 사용합니다.

```kotlin
install(Auth) {
    bearer {
        refreshTokens {
            val refreshTokenInfo: TokenInfo = client.submitForm(
                url = "https://accounts.google.com/o/oauth2/token",
                formParameters = parameters {
                    append("grant_type", "refresh_token")
                    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
                    append("refresh_token", oldTokens?.refreshToken ?: "")
                }
            ) { markAsRefreshTokenRequest() }.body()
        }
    }
}
```

`refreshTokens` 콜백은 `RefreshTokensParams`를 리시버로 사용하며 다음 설정에 액세스할 수 있다는 점에 유의하세요.
- `client` 인스턴스. 위 코드 스니펫에서는 폼 매개변수를 제출하는 데 사용됩니다.
- `oldTokens` 속성은 리프레시 토큰에 액세스하여 토큰 엔드포인트로 전송하는 데 사용됩니다.

> `HttpRequestBuilder`에서 노출되는 `markAsRefreshTokenRequest` 함수는 리프레시 토큰을 얻는 데 사용되는 요청을 특별히 처리할 수 있도록 합니다.

### (10) <- 액세스 및 리프레시 토큰 {id="step10"}

새 토큰을 받은 후 [저장소](#step4)에 저장할 수 있으므로 `refreshTokens`는 다음과 같습니다.

```kotlin
refreshTokens {
    val refreshTokenInfo: TokenInfo = client.submitForm(
        url = "https://accounts.google.com/o/oauth2/token",
        formParameters = parameters {
            append("grant_type", "refresh_token")
            append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
            append("refresh_token", oldTokens?.refreshToken ?: "")
        }
    ) { markAsRefreshTokenRequest() }.body()
    bearerTokenStorage.add(BearerTokens(refreshTokenInfo.accessToken, oldTokens?.refreshToken!!))
    bearerTokenStorage.last()
}
```

### (11) -> 새 토큰으로 요청 {id="step11"}

이 단계에서 보호된 리소스에 대한 요청은 새 토큰을 포함하며 제대로 작동해야 합니다.

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 보호된 리소스 {id="step12"}

[401 응답](#step8)이 오류 세부 정보가 포함된 JSON 데이터를 반환한다는 점을 감안할 때, 오류에 대한 정보를 `ErrorInfo` 객체로 받도록 샘플을 업데이트해야 합니다.

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
try {
    val userInfo: UserInfo = response.body()
    println("Hello, ${userInfo.name}!")
} catch (e: Exception) {
    val errorInfo: ErrorInfo = response.body()
    println(errorInfo.error.message)
}
```

`ErrorInfo` 클래스는 다음과 같습니다.

```kotlin
import kotlinx.serialization.*

@Serializable
data class ErrorInfo(val error: ErrorDetails)

@Serializable
data class ErrorDetails(
    val code: Int,
    val message: String,
    val status: String,
)
```

전체 예시는 여기에서 찾을 수 있습니다: [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google).