[//]: # (title: Ktor Client의 Bearer 인증)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 인증은 _Bearer 토큰_이라고 불리는 보안 토큰을 사용합니다. 이러한 토큰은 일반적으로 Google, Facebook, X(구 Twitter)와 같은 외부 프로바이더를 통해 사용자를 인증하는 OAuth 2.0 흐름의 일부로 사용됩니다.

OAuth 프로세스에 대한 자세한 내용은 [Ktor 서버 문서의 OAuth 인증 흐름 섹션](server-oauth.md#flow)에서 확인할 수 있습니다.

> 서버측에서 Ktor는 Bearer 인증을 처리하기 위한 [Authentication](server-bearer-auth.md) 플러그인을 제공합니다.

## Bearer 인증 구성하기 {id="configure"}

Ktor 클라이언트를 사용하면 `Bearer` 스키마를 사용하여 `Authorization` 헤더에 토큰을 보낼 수 있습니다. 또한 토큰이 만료되었을 때 토큰을 갱신하는 로직을 정의할 수도 있습니다.

Bearer 인증을 구성하려면 `Auth` 플러그인을 설치하고 `bearer` 프로바이더를 구성하세요.

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
   install(Auth) {
      bearer {
         // Bearer 인증 구성
      }
   }
}
```

### 토큰 로드

`loadTokens {}` 콜백을 사용하여 초기 액세스 및 리프레시 토큰을 제공합니다. 일반적으로 이 콜백은 로컬 저장소에서 캐시된 토큰을 로드하고 이를 `BearerTokens` 인스턴스로 반환합니다.

```kotlin
install(Auth) {
   bearer {
       loadTokens {
           // 로컬 저장소에서 토큰을 로드하고 이를 'BearerTokens' 인스턴스로 반환합니다.
           BearerTokens("abc123", "xyz111")
       }
   }
}
```

이 예제에서 클라이언트는 `Authorization` 헤더에 `abc123` 액세스 토큰을 담아 보냅니다.

```HTTP
GET http://localhost:8080/
Authorization: Bearer abc123
```

### 토큰 갱신

`refreshTokens {}` 콜백을 사용하여 현재 액세스 토큰이 유효하지 않게 되었을 때 클라이언트가 새 토큰을 얻는 방법을 정의합니다.

```kotlin
install(Auth) {
   bearer {
       // 토큰 로드 ...
       refreshTokens { // this: RefreshTokensParams
           // 토큰을 갱신하고 'BearerTokens' 인스턴스로 반환합니다.
           BearerTokens("def456", "xyz111")
       }
   }
}
```
   
갱신 프로세스는 다음과 같이 작동합니다.
   
1. 클라이언트가 유효하지 않은 액세스 토큰을 사용하여 보호된 리소스에 요청을 보냅니다.
2. 리소스 서버가 `401 Unauthorized` 응답을 반환합니다.
3. 클라이언트는 자동으로 `refreshTokens {}` 콜백을 호출하여 새 토큰을 얻습니다.
4. 클라이언트는 새 토큰을 사용하여 보호된 리소스에 대한 요청을 재시도합니다.

여러 요청이 동시에 `401 Unauthorized`로 실패할 경우, 클라이언트는 토큰 갱신을 한 번만 수행합니다. `401` 응답을 받은 첫 번째 요청이 `refreshTokens {}` 콜백을 트리거합니다. 다른 요청들은 갱신 작업이 완료될 때까지 기다렸다가 새 토큰으로 재시도됩니다.

> 만약 [여러 프로바이더](client-auth.md#realm)가 설치된 경우, 응답에는 `WWW-Authenticate` 헤더가 포함되어 있어야 합니다.
> 클라이언트가 단 하나의 인증 프로바이더만 설치한 경우, Ktor는 `WWW-Authenticate` 헤더가 없거나 다른 스키마를 지정하더라도 `401 Unauthorized` 응답에 대해 해당 프로바이더를 시도합니다.
>
{style="tip"}

### 401을 기다리지 않고 자격 증명 보내기

기본적으로 클라이언트는 `401 Unauthorized` 응답을 받은 후에만 자격 증명을 보냅니다.

`sendWithoutRequest {}` 콜백 함수를 사용하여 이 동작을 재정의할 수 있습니다. 이 콜백은 요청을 보내기 전에 클라이언트가 자격 증명을 첨부해야 하는지 여부를 결정합니다.

예를 들어, 다음 구성은 Google API에 액세스할 때 항상 토큰을 보냅니다.

```kotlin
install(Auth) {
   bearer {
       // 토큰 로드 및 갱신 ...
       sendWithoutRequest { request ->
           request.url.host == "www.googleapis.com"
       }
   }
}
```

### 토큰 캐싱

`cacheTokens` 속성을 사용하여 요청 간에 Bearer 토큰을 캐싱할지 여부를 제어합니다.

캐싱을 비활성화하면 클라이언트는 모든 요청에 대해 `loadTokens {}` 함수를 호출합니다.
   
```kotlin
install(Auth) {
    bearer {
        cacheTokens = false   // 매 요청마다 토큰을 다시 로드함
        loadTokens {
            loadDynamicTokens()
        }
    }
}
```

캐싱을 비활성화하는 것은 토큰이 자주 변경되는 경우 유용할 수 있습니다.
   
> 프로그래밍 방식으로 캐시된 자격 증명을 지우는 방법에 대한 자세한 내용은 일반적인 [토큰 캐싱 및 캐시 제어](client-auth.md#token-caching) 문서를 참조하세요.
> 
{style="tip"}

## 예제: Bearer 인증을 사용하여 Google API 액세스하기 {id="example-oauth-google"}

이 예제는 인증 및 권한 부여를 위해 [OAuth 2.0 프로토콜](https://developers.google.com/identity/protocols/oauth2)을 사용하는 Google API에 Bearer 인증을 사용하는 방법을 보여줍니다.

예제 애플리케이션인 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google)은 사용자의 Google 프로필 정보를 가져옵니다.

### 클라이언트 자격 증명 얻기 {id="google-client-credentials"}

Google API에 액세스하려면 먼저 OAuth 클라이언트 자격 증명을 얻어야 합니다.

1. Google 계정을 생성하거나 로그인합니다.
2. [Google Cloud 콘솔](https://console.cloud.google.com/apis/credentials)을 엽니다.
3. `Android` 애플리케이션 유형으로 `OAuth 클라이언트 ID`를 생성합니다. 이 클라이언트 ID를 사용하여 [권한 부여(authorization grant)](#step1)를 얻게 됩니다.

### OAuth 인증 흐름 {id="oauth-flow"}

OAuth 인증 흐름은 다음 단계로 구성됩니다.

1. 클라이언트가 리소스 소유자에게 [인증 요청](#step1)을 보냅니다.
2. 리소스 소유자가 [인증 코드(authorization code)를 반환](#step2)합니다.
3. 클라이언트가 인증 서버로 [인증 코드를 보냅니다](#step3).
4. 인증 서버가 [액세스 및 리프레시 토큰을 반환](#step4)합니다.
5. 클라이언트가 액세스 토큰을 사용하여 [리소스 서버에 요청](#step5)을 보냅니다.
6. 리소스 서버가 [보호된 리소스를 반환](#step6)합니다.
7. 액세스 토큰이 만료된 후, 클라이언트가 [만료된 토큰으로 요청](#step7)을 보냅니다.
8. 리소스 서버가 [401 Unauthorized로 응답](#step8)합니다.
9. 클라이언트가 인증 서버로 [리프레시 토큰을 보냅니다](#step9).
10. 인증 서버가 [새로운 액세스 및 리프레시 토큰을 반환](#step10)합니다.
11. 클라이언트가 새로운 액세스 토큰을 사용하여 [리소스 서버에 새로운 요청](#step11)을 보냅니다.
12. 리소스 서버가 [보호된 리소스를 반환](#step12)합니다.

다음 섹션에서는 Ktor 클라이언트가 각 단계를 어떻게 구현하는지 설명합니다.

#### 인증 요청 {id="step1"}

먼저 필요한 권한을 요청하는 데 사용되는 인증 URL을 생성합니다. 이는 필요한 쿼리 파라미터를 추가하여 수행됩니다.

```kotlin
val authorizationUrlQuery = parameters {
    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
    append("scope", "https://www.googleapis.com/auth/userinfo.profile")
    append("response_type", "code")
    append("redirect_uri", "http://127.0.0.1:8080")
    append("access_type", "offline")
}.formUrlEncode()
println("https://accounts.google.com/o/oauth2/auth?$authorizationUrlQuery")
println("위 링크를 열어 인증 코드를 받고, 아래에 입력한 후 Enter를 누르세요.")
```

- `client_id`: Google API에 액세스하는 데 사용되는 [OAuth 클라이언트 ID](#google-client-credentials)입니다.
- `scope`: 애플리케이션이 요청하는 권한입니다. 이 경우 사용자의 프로필 정보입니다.
- `response_type`: 액세스 토큰을 얻는 데 사용되는 권한 부여 유형입니다. 인증 코드를 얻기 위해 `"code"`로 설정합니다.
- `redirect_uri`: `http://127.0.0.1:8080` 값은 인증 코드를 얻기 위해 _루프백(Loopback) IP 주소_ 흐름이 사용됨을 나타냅니다.
   > 이 URL을 사용하여 인증 코드를 받으려면 애플리케이션이 로컬 웹 서버에서 리스닝 중이어야 합니다. 예를 들어, [Ktor 서버](server-create-and-configure.topic)를 사용하여 쿼리 파라미터로 인증 코드를 받을 수 있습니다.
- `access_type`: 사용자가 브라우저에 없을 때도 애플리케이션이 액세스 토큰을 갱신할 수 있도록 `offline`으로 설정합니다.

#### 권한 부여 (코드) {id="step2"}

액세스를 승인하면 브라우저에 인증 코드가 반환됩니다. 코드를 복사하여 변수에 저장합니다.

```kotlin
val authorizationCode = readln()
```

#### 인증 코드를 토큰으로 교환 {id="step3"}

다음으로 인증 코드를 토큰으로 교환합니다. 이를 위해 클라이언트를 생성하고 JSON 직렬화 도구가 포함된 [`ContentNegotiation`](client-serialization.md) 플러그인을 설치합니다.

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

이 직렬화 도구는 Google OAuth 토큰 엔드포인트로부터 받은 토큰을 역직렬화하는 데 필요합니다.

생성된 클라이언트를 사용하여 인증 코드와 기타 필요한 옵션을 [폼 파라미터](client-requests.md#form_parameters)로 토큰 엔드포인트에 전달합니다.

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

토큰 엔드포인트는 JSON 응답을 반환하며, 클라이언트는 이를 `TokenInfo` 인스턴스로 역직렬화합니다. `TokenInfo` 클래스는 다음과 같습니다.

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

#### 토큰 저장 {id="step4"}

토큰을 받으면 `loadTokens {}` 및 `refreshTokens {}` 콜백에 제공할 수 있도록 저장합니다. 이 예제에서 저장소는 `BearerTokens`의 가변 리스트입니다.

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 토큰 저장소는 클라이언트 구성 내부에서 사용되므로 [클라이언트 초기화](#step3) 전에 생성해야 합니다.
>
{style="note"}

#### 유효한 토큰으로 요청 보내기 {id="step5"}

이제 유효한 토큰을 사용할 수 있으므로 클라이언트는 보호된 Google API에 요청을 보내고 사용자 정보를 검색할 수 있습니다.

그 전에 Bearer 인증을 사용하도록 클라이언트를 구성합니다.

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

다음 설정이 지정되었습니다. 

* `loadTokens` 콜백은 [저장소](#step4)에서 토큰을 가져옵니다.
* `sendWithoutRequest {}` 콜백은 Google API를 호출할 때 `401 Unauthorized` 응답을 기다리지 않고 액세스 토큰을 보냅니다.

이 클라이언트를 사용하면 이제 보호된 리소스에 요청을 보낼 수 있습니다.

```kotlin
while (true) {
    println("요청을 보내시겠습니까? 진행하려면 'yes'를 입력하고 Enter를 누르세요.")
    when (readln()) {
        "yes" -> {
            val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
            try {
                val userInfo: UserInfo = response.body()
                println("Hello, ${userInfo.name}!")
            } catch (e: Exception) {
                val errorInfo: ErrorInfo = response.body()
                println(errorInfo.error.message)
            }
        }
        else -> return@runBlocking
    }
}
```

#### 보호된 리소스 액세스 {id="step6"}

리소스 서버는 JSON 형식으로 사용자 정보를 반환합니다. 응답을 `UserInfo` 클래스 인스턴스로 역직렬화하고 개인화된 인사말을 표시할 수 있습니다.

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

#### 만료된 토큰으로 요청 {id="step7"}

어느 시점에 클라이언트는 [5단계](#step5)의 요청을 반복하지만, 이번에는 만료된 액세스 토큰을 사용하게 됩니다.

#### 401 Unauthorized 응답 {id="step8"}

토큰이 더 이상 유효하지 않으면 리소스 서버는 `401 Unauthorized` 응답을 반환합니다. 그러면 클라이언트는 새 토큰을 얻는 역할을 하는 `refreshTokens {}` 콜백을 호출합니다.

> `401 Unauthorized` 응답은 오류 세부 정보가 포함된 JSON 데이터를 반환합니다. 이는 [응답을 받을 때 처리](#step12)해야 합니다.
>
{style="tip"}

#### 액세스 토큰 갱신 {id="step9"}

새 액세스 토큰을 얻으려면 토큰 엔드포인트에 다른 요청을 보내도록 `refreshTokens {}` 콜백을 구성합니다. 이번에는 `authorization_code` 대신 `refresh_token` 권한 부여 유형을 사용합니다.

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

`refreshTokens {}` 콜백은 `RefreshTokensParams`를 수신 객체(receiver)로 사용하며 다음 설정에 액세스할 수 있도록 합니다.
* 폼 파라미터를 제출하는 데 사용할 수 있는 `client` 인스턴스.
* 리프레시 토큰에 액세스하여 토큰 엔드포인트로 보내는 데 사용되는 `oldTokens` 속성.
* `HttpRequestBuilder`에서 제공하는 `.markAsRefreshTokenRequest()` 함수는 해당 요청이 인증 토큰 갱신을 위한 것임을 표시하여 특수하게 처리되도록 합니다.

#### 갱신된 토큰 저장 {id="step10"}

새 토큰을 받은 후 [토큰 저장소](#step4)에 저장합니다. 이를 포함한 `refreshTokens {}` 콜백은 다음과 같습니다.

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

#### 새 토큰으로 요청 {id="step11"}

갱신된 액세스 토큰이 저장되면 보호된 리소스에 대한 다음 요청은 성공해야 합니다.
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

#### API 오류 처리 {id="step12"}

[`401 Unauthorized` 응답](#step8)이 오류 세부 정보가 포함된 JSON 데이터를 반환하므로, 오류 응답을 `ErrorInfo` 객체로 읽도록 예제를 업데이트합니다.

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

`ErrorInfo` 클래스는 다음과 같이 정의됩니다.

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

> 전체 예제는 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-oauth-google)을 참조하세요.
> 
{style="tip"}