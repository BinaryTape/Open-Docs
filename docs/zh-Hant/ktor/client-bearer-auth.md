[//]: # (title: Ktor Client 中的持有人驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必需的依賴項</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

持有人驗證涉及稱為持有人權杖 (bearer tokens) 的安全權杖。舉例來說，這些權杖可用於 OAuth 流程中，透過 Google、Facebook、Twitter 等外部提供者來授權您的應用程式使用者。您可以從 Ktor 伺服器的 [OAuth 授權流程](server-oauth.md#flow) 章節了解 OAuth 流程的可能樣貌。

> 在伺服器端，Ktor 提供了 [Authentication](server-bearer-auth.md) 外掛程式來處理持有人驗證。

## 設定持有人驗證 {id="configure"}

Ktor 用戶端允許您設定一個權杖，以便使用 `Bearer` 方案在 `Authorization` 標頭中傳送。如果舊權杖無效，您也可以指定重新整理權杖的邏輯。若要設定 `bearer` 提供者，請遵循以下步驟：

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
   
2. 設定如何使用 `loadTokens` 回呼來取得初始的存取權杖和重新整理權杖。此回呼旨在從本機儲存載入快取權杖，並將它們作為 `BearerTokens` 實例返回。

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
   
   `abc123` 存取權杖會使用 `Bearer` 方案，在 `Authorization` 標頭中隨每個 [請求](client-requests.md) 傳送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 指定如果舊權杖無效時，如何使用 `refreshTokens` 取得新權杖。

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
   
   a. 用戶端使用無效的存取權杖向受保護的資源發出請求，並收到 `401` (Unauthorized) 回應。
     > 如果安裝了 [多個提供者](client-auth.md#realm)，回應應該包含 `WWW-Authenticate` 標頭。
   
   b. 用戶端會自動呼叫 `refreshTokens` 以取得新權杖。

   c. 用戶端這次會自動使用新權杖向受保護的資源發出另一個請求。

4. （可選）指定在不等待 `401` (Unauthorized) 回應的情況下傳送憑證的條件。例如，您可以檢查請求是否發送至指定的伺服器主機 (host)。

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

## 範例：使用持有人驗證存取 Google API {id="example-oauth-google"}

讓我們看看如何使用持有人驗證來存取 Google API，該 API 使用 [OAuth 2.0 協定](https://developers.google.com/identity/protocols/oauth2) 進行身份驗證和授權。我們將探討 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 主控台應用程式，它用於取得 Google 的個人資料資訊。

### 取得用戶端憑證 {id="google-client-credentials"}
第一步，我們需要取得存取 Google API 所需的用戶端憑證：
1. 建立一個 Google 帳戶。
2. 開啟 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 並建立應用程式類型為 `Android` 的 `OAuth client ID` 憑證。此用戶端 ID 將用於取得 [授權許可](#step1)。

### OAuth 授權流程 {id="oauth-flow"}

我們的應用程式的 OAuth 授權流程如下所示：

```Console
(1)  --> Authorization request                Resource owner
(2)  <-- Authorization grant (code)           Resource owner
(3)  --> Authorization grant (code)           Authorization server
(4)  <-- Access and refresh tokens            Authorization server
(5)  --> Request with valid token             Resource server
(6)  <-- Protected resource                   Resource server
⌛⌛⌛    Token expired
(7)  --> Request with expired token           Resource server
(8)  <-- 401 Unauthorized response            Resource server
(9)  --> Authorization grant (refresh token)  Authorization server
(10) <-- Access and refresh tokens            Authorization server
(11) --> Request with new token               Resource server
(12) <-- Protected resource                   Resource server
```
{disable-links="false"}

讓我們探討每個步驟是如何實作的，以及 `Bearer` 驗證提供者如何幫助我們存取 API。

### (1) -> 授權請求 {id="step1"}

第一步，我們需要建立用於請求所需權限的授權連結。為此，我們需要將指定的查詢參數附加到 URL：

[object Promise]

- `client_id`：用於存取 Google API 的 [先前取得](#google-client-credentials) 的用戶端 ID。
- `scope`：Ktor 應用程式所需的資源範圍。在本例中，應用程式請求使用者的個人資料資訊。
- `response_type`：用於取得存取權杖的授權類型。在本例中，我們需要取得一個授權碼。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _迴路 IP 位址_ 流程來取得授權碼。
   > 若要使用此 URL 接收授權碼，您的應用程式必須在本機網頁伺服器上監聽。
   > 例如，您可以使用 [Ktor 伺服器](server-create-and-configure.topic) 作為查詢參數來取得授權碼。
- `access_type`：存取類型設定為 `offline`，因為當使用者不在瀏覽器時，我們的主控台應用程式需要重新整理存取權杖。

### (2) <- 授權許可 (code) {id="step2"}

在此步驟，我們將授權碼從瀏覽器複製，貼上到主控台，並將其儲存在變數中：

[object Promise]

### (3) -> 授權許可 (code) {id="step3"}

現在我們準備好將授權碼交換為權杖。為此，我們需要建立一個用戶端並安裝帶有 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 外掛程式。此序列化器是將從 Google OAuth 權杖端點接收到的權杖進行反序列化所必需的。

[object Promise]

使用建立的用戶端，我們可以安全地將授權碼和其他必要選項作為 [表單參數](client-requests.md#form_parameters) 傳遞給權杖端點：

[object Promise]

結果，權杖端點會以 JSON 物件的形式傳送權杖，該 JSON 物件會使用已安裝的 `json` 序列化器反序列化為 `TokenInfo` 類別實例。`TokenInfo` 類別如下所示：

[object Promise]

### (4) <- 存取與重新整理權杖 {id="step4"}

收到權杖後，我們可以將它們儲存在儲存中。在我們的範例中，儲存是一個 `BearerTokens` 實例的可變列表。這意味著我們可以將其元素傳遞給 `loadTokens` 和 `refreshTokens` 回呼。

[object Promise]

> 請注意，`bearerTokenStorage` 應該在 [初始化用戶端](#step3) 之前建立，因為它將在用戶端設定內部使用。

### (5) -> 帶有有效權杖的請求 {id="step5"}

現在我們擁有有效權杖，因此可以向受保護的 Google API 發出請求並取得使用者資訊。首先，我們需要調整用戶端 [設定](#step3)：

[object Promise]

指定了以下設定： 

- 已安裝的 [ContentNegotiation](client-serialization.md) 外掛程式與 `json` 序列化器，用於反序列化從資源伺服器以 JSON 格式接收到的使用者資訊。

- 帶有 `bearer` 提供者的 [Auth](client-auth.md) 外掛程式配置如下：
   * `loadTokens` 回呼從 [儲存](#step4) 中載入權杖。
   * `sendWithoutRequest` 回呼配置為只向提供受保護資源存取權的伺服器主機 (host) 傳送憑證，而無需等待 `401` (Unauthorized) 回應。

此用戶端可用於向受保護的資源發出請求：

[object Promise]

### (6) <- 受保護的資源 {id="step6"}

資源伺服器以 JSON 格式返回使用者資訊。我們可以將回應反序列化為 `UserInfo` 類別實例並顯示個人問候語：

[object Promise]

`UserInfo` 類別如下所示：

[object Promise]

### (7) -> 帶有過期權杖的請求 {id="step7"}

在某個時刻，用戶端發出一個與 [步驟 5](#step5) 相同的請求，但這次帶有過期的存取權杖。

### (8) <- 401 未授權回應 {id="step8"}

資源伺服器返回 `401` 未授權回應，因此用戶端應呼叫 `refreshTokens` 回呼。
> 請注意，`401` 回應會返回帶有錯誤詳細資訊的 JSON 資料，我們需要在接收回應時 [處理此情況](#step12)。

### (9) -> 授權許可 (refresh token) {id="step9"}

若要取得新的存取權杖，我們需要設定 `refreshTokens` 並向權杖端點發出另一個請求。這次，我們使用 `refresh_token` 授權類型，而不是 `authorization_code`：

[object Promise]

請注意，`refreshTokens` 回呼使用 `RefreshTokensParams` 作為接收者，並允許您存取以下設定：
- `client` 實例。在上面的程式碼片段中，我們使用它來提交表單參數。
- `oldTokens` 屬性用於存取重新整理權杖並將其傳送至權杖端點。

> 由 `HttpRequestBuilder` 暴露的 `markAsRefreshTokenRequest` 函式，支援特殊處理用於取得重新整理權杖的請求。

### (10) <- 存取與重新整理權杖 {id="step10"}

收到新權杖後，我們可以將它們儲存在 [儲存](#step4) 中，因此 `refreshTokens` 如下所示：

[object Promise]

### (11) -> 帶有新權杖的請求 {id="step11"}

在此步驟，對受保護資源的請求包含一個新權杖，並且應該能正常工作。

[object Promise]

### (12) <-- 受保護的資源 {id="step12"}

鑑於 [401 回應](#step8) 返回帶有錯誤詳細資訊的 JSON 資料，我們需要更新我們的範例，以 `ErrorInfo` 物件的形式接收錯誤資訊：

[object Promise]

`ErrorInfo` 類別如下所示：

[object Promise]

您可以在此處找到完整範例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。