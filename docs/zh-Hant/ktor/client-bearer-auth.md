[//]: # (title: Ktor Client 中的 Bearer 驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要的相依性</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Bearer 驗證涉及稱為 Bearer 權杖（bearer token）的安全性權杖。舉例來說，這些權杖可作為 OAuth 流程的一部分，透過 Google、Facebook、Twitter 等外部提供者來授權應用程式的使用者。您可以從 Ktor 伺服器的 [OAuth 授權流程](server-oauth.md#flow) 章節了解 OAuth 流程的運作方式。

> 在伺服器上，Ktor 提供了 [Authentication](server-bearer-auth.md) 外掛程式來處理 Bearer 驗證。

## 配置 Bearer 驗證 {id="configure"}

Ktor 用戶端允許您配置在使用 `Bearer` 方案的 `Authorization` 標頭中傳送的權杖。您也可以指定當舊權杖無效時重新整理權杖的邏輯。要配置 `bearer` 提供者，請遵循以下步驟：

1. 在 `install` 區塊內呼叫 `bearer` 函式。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // 配置 Bearer 驗證
          }
       }
   }
   ```
   
2. 使用 `loadTokens` 回呼配置如何取得初始存取與重新整理權杖。此回呼旨在從本機儲存空間載入快取的權杖，並將其作為 `BearerTokens` 執行個體傳回。

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // 從本機儲存空間載入權杖並將其作為 'BearerTokens' 執行個體傳回
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123` 存取權杖會隨每個 [請求](client-requests.md) 在使用 `Bearer` 方案的 `Authorization` 標頭中傳送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 使用 `refreshTokens` 指定當舊權杖無效時如何取得新權杖。

   ```kotlin
   install(Auth) {
       bearer {
           // 載入權杖 ...
           refreshTokens { // this: RefreshTokensParams
               // 重新整理權杖並將其作為 'BearerTokens' 執行個體傳回
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   此回呼的運作方式如下：
   
   a. 用戶端使用無效的存取權杖向受保護的資源發出請求，並獲得 `401` (Unauthorized) 回應。
     > 如果安裝了 [多個提供者](client-auth.md#realm)，回應應包含 `WWW-Authenticate` 標頭。
   
   b. 用戶端自動呼叫 `refreshTokens` 以取得新權杖。

   c. 用戶端這次會自動使用新權杖再次向受保護的資源發出請求。

4. （選用）指定在不等待 `401` (Unauthorized) 回應的情況下傳送憑據的條件。例如，您可以檢查請求是否發送到指定的主機。

   ```kotlin
   install(Auth) {
       bearer {
           // 載入與重新整理權杖 ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

5. （選用）使用 `cacheTokens` 選項來控制是否在請求之間快取 Bearer 權杖。停用快取會強制用戶端針對每個請求重新載入權杖，這在權杖頻繁變更時非常有用：
   
    ```kotlin
   install(Auth) {
        bearer {
            cacheTokens = false   // 針對每個請求重新載入權杖
            loadTokens {
                loadDynamicTokens()
            }
        }
    }
    ```
   
    > 有關以程式化方式清除快取憑據的詳細資訊，請參閱通用的 [權杖快取與快取控制](client-auth.md#token-caching) 章節。

## 範例：使用 Bearer 驗證存取 Google API {id="example-oauth-google"}

讓我們來看看如何使用 Bearer 驗證來存取使用 [OAuth 2.0 協定](https://developers.google.com/identity/protocols/oauth2) 進行驗證與授權的 Google API。我們將研究獲取 Google 個人資料資訊的 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 主控台應用程式。

### 取得用戶端憑據 {id="google-client-credentials"}
要存取 Google API，您首先需要 OAuth 用戶端憑據：
1. 建立或登入 Google 帳戶。
2. 開啟 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 並建立一個應用程式類型為 `Android` 的 `OAuth 用戶端 ID`。此用戶端 ID 將用於取得 [授權許可](#step1)。

### OAuth 授權流程 {id="oauth-flow"}

OAuth 授權流程如下所示：

```Console
(1)  --> 授權請求                             資源擁有者
(2)  <-- 授權許可 (代碼)                       資源擁有者
(3)  --> 授權許可 (代碼)                       授權伺服器
(4)  <-- 存取與重新整理權杖                    授權伺服器
(5)  --> 使用有效權杖發出請求                  資源伺服器
(6)  <-- 受保護的資源                         資源伺服器
⌛⌛⌛    權杖已過期
(7)  --> 使用過期權杖發出請求                  資源伺服器
(8)  <-- 401 Unauthorized 回應                資源伺服器
(9)  --> 授權許可 (重新整理權杖)               授權伺服器
(10) <-- 存取與重新整理權杖                    授權伺服器
(11) --> 使用新權杖發出請求                    資源伺服器
(12) <-- 受保護的資源                         資源伺服器
```
{disable-links="false"}

接下來的章節將說明每個步驟是如何實作的，以及 `Bearer` 驗證提供者如何協助存取 API。

### (1) -> 授權請求 {id="step1"}

第一步是構建用於請求必要權限的授權 URL。這是透過附加所需的查詢參數來完成的：

```kotlin
val authorizationUrlQuery = parameters {
    append("client_id", System.getenv("GOOGLE_CLIENT_ID"))
    append("scope", "https://www.googleapis.com/auth/userinfo.profile")
    append("response_type", "code")
    append("redirect_uri", "http://127.0.0.1:8080")
    append("access_type", "offline")
}.formUrlEncode()
println("https://accounts.google.com/o/oauth2/auth?$authorizationUrlQuery")
println("開啟上方連結，取得授權碼，將其插入下方，然後按 Enter 鍵。")
```

- `client_id`：先前[取得](#google-client-credentials)的用戶端 ID，用於存取 Google API。
- `scope`：Ktor 應用程式所需資源的範圍。在此案例中，應用程式請求有關使用者個人資料的資訊。
- `response_type`：用於取得存取權杖的授權類型。在此案例中，它被設定為 `"code"` 以取得授權碼。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _迴圈回送 IP 位址 (Loopback IP address)_ 流程來取得授權碼。
   > 要使用此 URL 接收授權碼，您的應用程式必須在該本機 Web 伺服器上進行監聽。
   > 例如，您可以使用 [Ktor 伺服器](server-create-and-configure.topic) 來取得作為查詢參數的授權碼。
- `access_type`：設定為 `offline`，以便應用程式在使用者不在瀏覽器前時也能重新整理存取權杖。

### (2)  <- 授權許可 (代碼) {id="step2"}

從瀏覽器複製授權碼，貼到主控台中，並將其儲存在變數中：

```kotlin
val authorizationCode = readln()
```

### (3)  -> 授權許可 (代碼) {id="step3"}

接下來，用授權碼交換權杖。為此，請建立一個用戶端並安裝具有 `json` 序列化程式的 [ContentNegotiation](client-serialization.md) 外掛程式。此序列化程式是用來還原序列化從 Google OAuth 權杖端點收到的權杖。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

使用建立的用戶端，您可以安全地將授權碼和其他必要選項作為 [表單參數](client-requests.md#form_parameters) 傳遞給權杖端點：

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

結果，權杖端點會傳送一個 JSON 物件形式的權杖，並使用已安裝的 `json` 序列化程式將其還原序列化為 `TokenInfo` 類別執行個體。`TokenInfo` 類別如下所示：

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

### (4)  <- 存取與重新整理權杖 {id="step4"}

收到權杖後，將其儲存，以便提供給 `loadTokens` 和 `refreshTokens` 回呼。在此範例中，儲存空間是一個 `BearerTokens` 的可變清單：

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 請注意，`bearerTokenStorage` 應在 [初始化用戶端](#step3) 之前建立，因為它將在用戶端配置內使用。

### (5)  -> 使用有效權杖發出請求 {id="step5"}

既然有了有效的權杖，用戶端就可以向受保護的 Google API 發出請求並檢索使用者資訊。

在此之前，您需要調整用戶端 [配置](#step3)：

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

- 已安裝的帶有 `json` 序列化程式的 [ContentNegotiation](client-serialization.md) 外掛程式是必要的，用於將從資源伺服器收到的 JSON 格式使用者資訊還原序列化。

- 帶有 `bearer` 提供者的 [Auth](client-auth.md) 外掛程式配置如下：
  * `loadTokens` 回呼從 [儲存空間](#step4) 載入權杖。
  * `sendWithoutRequest` 回呼在存取 Google 受保護的 API 時，無需等待 `401 Unauthorized` 回應即可傳送存取權杖。

有了這個用戶端，您現在可以向受保護的資源發出請求：

```kotlin
while (true) {
    println("要發出請求嗎？輸入 'yes' 並按 Enter 鍵繼續。")
    when (readln()) {
        "yes" -> {
            val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
            try {
                val userInfo: UserInfo = response.body()
                println("哈囉，${userInfo.name}！")
            } catch (e: Exception) {
                val errorInfo: ErrorInfo = response.body()
                println(errorInfo.error.message)
            }
        }
        else -> return@runBlocking
    }
}
```

### (6)  <- 受保護的資源 {id="step6"}

資源伺服器以 JSON 格式傳回使用者的資訊。您可以將回應還原序列化為 `UserInfo` 類別執行個體並顯示個人化問候：

```kotlin
val userInfo: UserInfo = response.body()
println("哈囉，${userInfo.name}！")
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

### (7)  -> 使用過期權杖發出請求 {id="step7"}

在某些時候，用戶端會重複 [步驟 5](#step5) 的請求，但使用的是已過期的存取權杖。

### (8)  <- 401 Unauthorized 回應 {id="step8"}

當權杖不再有效時，資源伺服器會傳回 `401 Unauthorized` 回應。用戶端接著會叫用 `refreshTokens` 回呼，該回呼負責取得新權杖。

> `401` 回應會傳回包含錯誤詳細資訊的 JSON 資料。這需要在 [接收回應時處理](#step12)。

### (9)  -> 授權許可 (重新整理權杖) {id="step9"}

要取得新的存取權杖，您需要配置 `refreshTokens` 以向權杖端點發出另一個請求。這一次，使用的是 `refresh_token` 授權類型，而不是 `authorization_code`：

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

`refreshTokens` 回呼使用 `RefreshTokensParams` 作為接收者 (receiver)，並允許您存取以下設定：
- `client` 執行個體，可用於提交表單參數。
- `oldTokens` 屬性，用於存取重新整理權杖並將其傳送到權杖端點。

> `HttpRequestBuilder` 提供的 `markAsRefreshTokenRequest` 函式可以對用於取得重新整理權杖的請求進行特殊處理。

### (10) <- 存取與重新整理權杖 {id="step10"}

收到新權杖後，需要將其儲存在 [權杖儲存空間](#step4) 中。至此，`refreshTokens` 回呼如下所示：

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

### (11) -> 使用新權杖發出請求 {id="step11"}

隨著儲存了重新整理後的存取權杖，下一次對受保護資源的請求應該會成功：
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### (12) <-- 受保護的資源 {id="step12"}

鑑於 [401 回應](#step8) 傳回包含錯誤詳細資訊的 JSON 資料，請更新範例以將錯誤回應讀取為 `ErrorInfo` 物件：

```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
try {
    val userInfo: UserInfo = response.body()
    println("哈囉，${userInfo.name}！")
} catch (e: Exception) {
    val errorInfo: ErrorInfo = response.body()
    println(errorInfo.error.message)
}
```

`ErrorInfo` 類別定義如下：

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

有關完整範例，請參閱 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。