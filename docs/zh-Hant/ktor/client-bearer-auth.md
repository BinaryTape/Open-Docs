[//]: # (title: Ktor Client 中的 Bearer 驗證)

<show-structure for="chapter" depth="3"/>

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

Bearer 驗證使用稱為 _Bearer 權杖 (bearer token)_ 的安全性權杖。這些權杖通常用於 OAuth 2.0 流程，透過 Google、Facebook 和 X 等外部提供者來授權使用者。

您可以在 [Ktor 伺服器文件的 OAuth 授權流程章節](server-oauth.md#flow) 中進一步了解 OAuth 流程。

> 在伺服器上，Ktor 提供了 [Authentication](server-bearer-auth.md) 外掛程式來處理 Bearer 驗證。

## 配置 Bearer 驗證 {id="configure"}

Ktor 用戶端允許您使用 `Bearer` 方案在 `Authorization` 標頭中傳送權杖。您也可以定義當權杖過期時重新整理權杖的邏輯。

要配置 Bearer 驗證，請安裝 `Auth` 外掛程式並配置 `bearer` 提供者：

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

### 載入權杖

使用 `loadTokens {}` 回呼提供初始存取與重新整理權杖。通常，此回呼會從本機儲存空間載入快取的權杖，並將其作為 `BearerTokens` 執行個體傳回。

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

在此範例中，用戶端在 `Authorization` 標頭中傳送 `abc123` 存取權杖：

```HTTP
GET http://localhost:8080/
Authorization: Bearer abc123
```

### 重新整理權杖

當目前的存取權杖變為無效時，使用 `refreshTokens {}` 回呼來定義用戶端如何獲取新權杖：

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
   
重新整理程序運作如下：
   
1. 用戶端使用無效的存取權杖向受保護的資源發出請求。
2. 資源伺服器傳回 `401 Unauthorized` 回應。
3. 用戶端自動叫用 `refreshTokens {}` 回呼以獲取新權杖。
4. 用戶端使用新權杖重試對受保護資源的請求。

當多個請求同時因 `401 Unauthorized` 失敗時，用戶端僅執行一次權杖重新整理。第一個收到 `401` 回應的請求會觸發 `refreshTokens {}` 回呼。其他請求則等待重新整理操作完成，然後使用新權杖進行重試。

> 如果安裝了[多個提供者](client-auth.md#realm)，回應應包含 `WWW-Authenticate` 標頭。
> 如果用戶端僅安裝了一個驗證提供者，即使遺失 `WWW-Authenticate` 標頭或指定了不同的方案，Ktor 仍會針對 `401 Unauthorized` 回應嘗試該提供者。
>
{style="tip"}

### 無需等待 401 即可傳送憑據

預設情況下，用戶端僅在收到 `401 Unauthorized` 回應後才傳送憑據。

您可以使用 `sendWithoutRequest {}` 回呼函式來覆寫此行為。此回呼決定用戶端是否應在傳送請求之前附加憑據。

例如，以下配置在存取 Google API 時一律傳送權杖：

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

### 快取權杖

使用 `cacheTokens` 屬性來控制是否在請求之間快取 Bearer 權杖。

如果停用快取，用戶端會針對每個請求呼叫 `loadTokens {}` 函式：
   
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

當權杖頻繁變更時，停用快取可能會很有用。
   
> 有關以程式化方式清除快取憑據的詳細資訊，請參閱通用的[權杖快取與快取控制](client-auth.md#token-caching)文件。
> 
{style="tip"}

## 範例：使用 Bearer 驗證存取 Google API {id="example-oauth-google"}

此範例示範如何對 Google API 使用 Bearer 驗證，Google API 使用 [OAuth 2.0 協定](https://developers.google.com/identity/protocols/oauth2)進行驗證與授權。

範例應用程式 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 會抓取使用者的 Google 個人資料資訊。

### 取得用戶端憑據 {id="google-client-credentials"}

要存取 Google API，您首先需要取得 OAuth 用戶端憑據：

1. 建立或登入 Google 帳戶。
2. 開啟 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)。
3. 建立一個應用程式類型為 `Android` 的 `OAuth 用戶端 ID`。您將使用此用戶端 ID 來取得[授權許可](#step1)。

### OAuth 授權流程 {id="oauth-flow"}

OAuth 授權流程包含以下步驟：

1. 用戶端向資源擁有者傳送[授權請求](#step1)。
2. 資源擁有者[傳回授權碼](#step2)。
3. 用戶端將[授權碼傳送](#step3)至授權伺服器。
4. 授權伺服器[傳回存取與重新整理權杖](#step4)。
5. 用戶端[使用存取權杖向資源伺服器傳送請求](#step5)。
6. 資源伺服器[傳回受保護的資源](#step6)。
7. 在存取權杖過期後，用戶端[使用過期的權杖傳送請求](#step7)。
8. 資源伺服器[回應 401 Unauthorized](#step8)。
9. 用戶端將[重新整理權杖傳送](#step9)至授權伺服器。
10. 授權伺服器[傳回新的存取與重新整理權杖](#step10)。
11. 用戶端[使用新的存取權杖向資源伺服器傳送新請求](#step11)。
12. 資源伺服器[傳回受保護的資源](#step12)。

以下章節將說明 Ktor 用戶端如何實作每個步驟。

#### 授權請求 {id="step1"}

首先，構建用於請求必要權限的授權 URL。這是透過附加所需的查詢參數來完成的：

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

- `client_id`：用於存取 Google API 的 [OAuth 用戶端 ID](#google-client-credentials)。
- `scope`：應用程式請求的權限。在此案例中，是關於使用者個人資料的資訊。
- `response_type`：用於獲取存取權杖的授權類型。設定為 `"code"` 以獲取授權碼。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _迴圈回送 IP 位址 (Loopback IP address)_ 流程來獲取授權碼。
   > 要使用此 URL 接收授權碼，您的應用程式必須在該本機 Web 伺服器上進行監聽。
   > 例如，您可以使用 [Ktor 伺服器](server-create-and-configure.topic) 來獲取作為查詢參數的授權碼。
- `access_type`：設定為 `offline`，以便應用程式在使用者不在瀏覽器前時也能重新整理存取權杖。

#### 授權許可 (代碼) {id="step2"}

在授權存取後，瀏覽器會傳回一個授權碼。複製該程式碼並將其儲存在變數中：

```kotlin
val authorizationCode = readln()
```

#### 用授權碼交換權杖 {id="step3"}

接下來，用授權碼交換權杖。為此，請建立一個用戶端並安裝具有 JSON 序列化程式的 [`ContentNegotiation`](client-serialization.md) 外掛程式：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

此序列化程式是將從 Google OAuth 權杖端點收到的權杖還原序列化所必需的。

使用建立的用戶端，將授權碼和其他必要選項作為[表單參數](client-requests.md#form_parameters)傳遞給權杖端點：

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

權杖端點傳回一個 JSON 回應，用戶端將其還原序列化為 `TokenInfo` 執行個體。`TokenInfo` 類別如下所示：

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

#### 儲存權杖 {id="step4"}

收到權杖後，將其儲存，以便提供給 `loadTokens {}` 和 `refreshTokens {}` 回呼。在此範例中，儲存空間是一個 `BearerTokens` 的可變清單：

```kotlin
        val bearerTokenStorage = mutableListOf<BearerTokens>()

        bearerTokenStorage.add(BearerTokens(tokenInfo.accessToken, tokenInfo.refreshToken!!))
```

> 請在[初始化用戶端](#step3)之前建立權杖儲存空間，因為它將在用戶端配置內使用。
>
{style="note"}

#### 使用有效權杖傳送請求 {id="step5"}

既然有了有效的權杖，用戶端就可以向受保護的 Google API 發出請求並檢索使用者資訊。

在此之前，配置用戶端使用 Bearer 驗證：

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

* `loadTokens` 回呼從[儲存空間](#step4)檢索權杖。
* `sendWithoutRequest {}` 回呼在呼叫 Google API 時，無需等待 `401 Unauthorized` 回應即可傳送存取權杖。

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

#### 存取受保護的資源 {id="step6"}

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

#### 使用過期權杖發出請求 {id="step7"}

在某些時候，用戶端會重複[步驟 5](#step5) 的請求，但使用的是已過期的存取權杖。

#### 401 Unauthorized 回應 {id="step8"}

當權杖不再有效時，資源伺服器會傳回 `401 Unauthorized` 回應。用戶端接著會叫用 `refreshTokens {}` 回呼，該回呼負責獲取新權杖。

> `401 Unauthorized` 回應會傳回包含錯誤詳細資訊的 JSON 資料。這需要在[接收回應時處理](#step12)。
>
{style="tip"}

#### 重新整理存取權杖 {id="step9"}

要獲取新的存取權杖，配置 `refreshTokens {}` 回呼以向權杖端點發出另一個請求。這一次，使用的是 `refresh_token` 授權類型，而不是 `authorization_code`：

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

`refreshTokens {}` 回呼使用 `RefreshTokensParams` 作為接收者 (receiver)，並允許您存取以下設定：
* `client` 執行個體，可用於提交表單參數。
* `oldTokens` 屬性用於存取重新整理權杖並將其傳送到權杖端點。
* `HttpRequestBuilder` 提供的 `.markAsRefreshTokenRequest()` 函式可將請求標記為重新整理驗證權杖，從而對其進行特殊處理。

#### 儲存重新整理後的權杖 {id="step10"}

收到新權杖後，將其儲存在[權杖儲存空間](#step4)中。至此，`refreshTokens {}` 回呼如下所示：

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

#### 使用新權杖發出請求 {id="step11"}

隨著儲存了重新整理後的存取權杖，下一次對受保護資源的請求應該會成功：
```kotlin
val response: HttpResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
```

#### 處理 API 錯誤 {id="step12"}

鑑於 [`401 Unauthorized` 回應](#step8) 傳回包含錯誤詳細資訊的 JSON 資料，請更新範例以將錯誤回應讀取為 `ErrorInfo` 物件：

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

> 有關完整範例，請參閱 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。
> 
{style="tip"}