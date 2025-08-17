[//]: # (title: Ktor Client 中的持有者驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>：`io.ktor:ktor-client-auth`
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

持有者驗證涉及稱為持有者權杖的安全權杖。舉例來說，這些權杖可用作 OAuth 流程的一部分，透過 Google、Facebook、Twitter 等外部供應商授權您的應用程式使用者。您可以從 Ktor 伺服器的[OAuth 授權流程](server-oauth.md#flow)部分了解 OAuth 流程的樣貌。

> 在伺服器端，Ktor 提供 [Authentication](server-bearer-auth.md) 外掛程式來處理持有者驗證。

## 設定持有者驗證 {id="configure"}

Ktor 客戶端允許您設定要使用 `Bearer` 方案在 `Authorization` 標頭中傳送的權杖。您還可以指定當舊權杖無效時重新整理權杖的邏輯。要設定 `bearer` 提供者，請遵循以下步驟：

1. 在 `install` 區塊內呼叫 `bearer` 函式。
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
   
2. 使用 `loadTokens` 回呼設定如何取得初始的存取和重新整理權杖。此回呼旨在從本地儲存載入快取的權杖，並將它們作為 `BearerTokens` 實例返回。

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
   
   `abc123` 存取權杖會使用 `Bearer` 方案隨每個 [請求](client-requests.md)在 `Authorization` 標頭中傳送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 指定當舊權杖無效時如何使用 `refreshTokens` 取得新權杖。

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
   
   此回呼的工作方式如下：
   
   a. 客戶端使用無效的存取權杖向受保護的資源發出請求，並獲得 `401` (Unauthorized) 回應。
     > 如果安裝了[多個提供者](client-auth.md#realm)，回應應包含 `WWW-Authenticate` 標頭。
   
   b. 客戶端自動呼叫 `refreshTokens` 以取得新權杖。

   c. 客戶端再次自動使用新權杖向受保護的資源發出請求。

4. （可選）指定在不等待 `401` (Unauthorized) 回應的情況下傳送憑證的條件。例如，您可以檢查請求是否發送到指定的主機。

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

## 範例：使用持有者驗證存取 Google API {id="example-oauth-google"}

讓我們看看如何使用持有者驗證來存取 Google API，Google API 使用 [OAuth 2.0 協定](https://developers.google.com/identity/protocols/oauth2) 進行驗證和授權。我們將研究 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 主控台應用程式，該應用程式取得 Google 的個人資料資訊。

### 取得客戶端憑證 {id="google-client-credentials"}
作為第一步，我們需要取得存取 Google API 所需的客戶端憑證：
1. 建立 Google 帳戶。
2. 開啟 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 並建立應用程式類型為 `Android` 的 `OAuth client ID` 憑證。此客戶端 ID 將用於取得[授權許可](#step1)。

### OAuth 授權流程 {id="oauth-flow"}

我們應用程式的 OAuth 授權流程如下：

```Console
(1)  --> 授權請求                資源擁有者
(2)  <-- 授權許可 (碼)           資源擁有者
(3)  --> 授權許可 (碼)           授權伺服器
(4)  <-- 存取和重新整理權杖            授權伺服器
(5)  --> 攜帶有效權杖的請求             資源伺服器
(6)  <-- 受保護的資源                   資源伺服器
⌛⌛⌛    權杖過期
(7)  --> 攜帶過期權杖的請求           資源伺服器
(8)  <-- 401 未經授權回應            資源伺服器
(9)  --> 授權許可 (重新整理權杖)  授權伺服器
(10) <-- 存取和重新整理權杖            授權伺服器
(11) --> 攜帶新權杖的請求               資源伺服器
(12) <-- 受保護的資源                   資源伺服器
```
{disable-links="false"}

讓我們調查每個步驟的實現方式，以及 `Bearer` 驗證提供者如何幫助我們存取 API。

### (1) -> 授權請求 {id="step1"}

作為第一步，我們需要建立用於請求所需權限的授權連結。為此，我們需要將指定的查詢參數附加到 URL：

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

- `client_id`：[先前取得的](#google-client-credentials)客戶端 ID 用於存取 Google API。
- `scope`：Ktor 應用程式所需的資源範圍。在我們的案例中，應用程式請求使用者的個人資料資訊。
- `response_type`：用於取得存取權杖的授予類型。在我們的案例中，我們需要取得授權碼。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _回環 IP 位址流程_ 取得授權碼。
   > 要使用此 URL 接收授權碼，您的應用程式必須在本地網頁伺服器上監聽。
   > 例如，您可以使用 [Ktor 伺服器](server-create-and-configure.topic)將授權碼作為查詢參數取得。
- `access_type`：存取類型設定為 `offline`，因為我們的主控台應用程式需要在使用者不在瀏覽器時重新整理存取權杖。

### (2) <- 授權許可 (碼) {id="step2"}

在此步驟中，我們從瀏覽器複製授權碼，將其貼到主控台，並將其儲存在變數中：

```kotlin
val authorizationCode = readln()
```

### (3) -> 授權許可 (碼) {id="step3"}

現在我們準備好將授權碼換取權杖。為此，我們需要建立一個客戶端並安裝 [ContentNegotiation](client-serialization.md) 外掛程式，並使用 `json` 序列化器。此序列化器是反序列化從 Google OAuth 權杖端點接收的權杖所必需的。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

使用建立的客戶端，我們可以安全地將授權碼和其他必要的選項作為[表單參數](client-requests.md#form_parameters)傳遞到權杖端點：

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

結果，權杖端點以 JSON 物件的形式傳送權杖，該 JSON 物件使用已安裝的 `json` 序列化器反序列化為 `TokenInfo` 類別實例。`TokenInfo` 類別如下所示：

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

### (4) <- 存取和重新整理權杖 {id="step4"}

接收到權杖後，我們可以將它們儲存在儲存區中。在我們的範例中，儲存區是 `BearerTokens` 實例的可變列表。這表示我們可以將其元素傳遞給 `loadTokens` 和 `refreshTokens` 回呼。

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 請注意，`bearerTokenStorage` 應該在[初始化客戶端](#step3)之前建立，因為它將在客戶端設定中使用。

### (5) -> 攜帶有效權杖的請求 {id="step5"}

現在我們擁有有效的權杖，因此我們可以向受保護的 Google API 發出請求並取得使用者資訊。首先，我們需要調整客戶端[設定](#step3)：

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

指定了以下設定：

- 已安裝的 [ContentNegotiation](client-serialization.md) 外掛程式與 `json` 序列化器，用於反序列化從資源伺服器以 JSON 格式接收的使用者資訊。

- 帶有 `bearer` 提供者的 [Auth](client-auth.md) 外掛程式設定如下：
   * `loadTokens` 回呼從[儲存區](#step4)載入權杖。
   * `sendWithoutRequest` 回呼設定為只向提供受保護資源存取權限的主機傳送憑證，而不等待 `401` (Unauthorized) 回應。

此客戶端可用於向受保護資源發出請求：

```kotlin
while (true) {
```

### (6) <- 受保護的資源 {id="step6"}

資源伺服器以 JSON 格式返回使用者資訊。我們可以將回應反序列化為 `UserInfo` 類別實例並顯示個人問候語：

```kotlin
val userInfo: UserInfo = response.body()
println("Hello, ${userInfo.name}!")
```

`UserInfo` 類別如下所示：

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

### (7) -> 攜帶過期權杖的請求 {id="step7"}

在某些時候，客戶端會像[步驟 5](#step5) 中那樣發出請求，但使用過期的存取權杖。

### (8) <- 401 未經授權回應 {id="step8"}

資源伺服器返回 `401` 未經授權的回應，因此客戶端應呼叫 `refreshTokens` 回呼。
> 請注意，`401` 回應返回包含錯誤詳細資訊的 JSON 資料，我們需要在接收回應時[處理此情況](#step12)。

### (9) -> 授權許可 (重新整理權杖) {id="step9"}

為了取得新的存取權杖，我們需要設定 `refreshTokens` 並向權杖端點發出另一個請求。這次，我們使用 `refresh_token` 授予類型而不是 `authorization_code`：

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

請注意，`refreshTokens` 回呼使用 `RefreshTokensParams` 作為接收者，並允許您存取以下設定：
- `client` 實例。在上面的程式碼片段中，我們使用它來提交表單參數。
- `oldTokens` 屬性用於存取重新整理權杖並將其傳送到權杖端點。

> `HttpRequestBuilder` 暴露的 `markAsRefreshTokenRequest` 函式啟用對用於取得重新整理權杖的請求的特殊處理。

### (10) <- 存取和重新整理權杖 {id="step10"}

收到新權杖後，我們可以將它們儲存在[儲存區](#step4)中，因此 `refreshTokens` 如下所示：

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

### (11) -> 攜帶新權杖的請求 {id="step11"}

在此步驟中，對受保護資源的請求包含新權杖，並且應該正常工作。

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 受保護的資源 {id="step12"}

鑑於 [401 回應](#step8)返回包含錯誤詳細資訊的 JSON 資料，我們需要更新範例以將錯誤資訊作為 `ErrorInfo` 物件接收：

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

`ErrorInfo` 類別如下所示：

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

您可以在此處找到完整範例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。