[//]: # (title: Ktor 用戶端中的承載者驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

承載者驗證涉及到稱為承載者權杖 (bearer tokens) 的安全性權杖。例如，這些權杖可用作 OAuth 流程的一部分，透過使用外部供應商 (例如 Google、Facebook、Twitter 等) 來授權您的應用程式使用者。您可以從 Ktor 伺服器的 [OAuth 授權流程](server-oauth.md#flow)章節中了解 OAuth 流程可能的外觀。

> 在伺服器端，Ktor 提供了 [Authentication](server-bearer-auth.md) 外掛程式來處理承載者驗證。

## 設定承載者驗證 {id="configure"}

Ktor 用戶端允許您設定一個權杖，使用 `Bearer` 方案在 `Authorization` 標頭中傳送。您也可以指定當舊權杖失效時刷新權杖的邏輯。若要設定 `bearer` 提供者，請依照以下步驟操作：

1. 在 `install` 區塊內呼叫 `bearer` 函數。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.client.plugins.auth.*
   //...
   val client = HttpClient(CIO) {
       install(Auth) {
          bearer {
             // 設定承載者驗證
          }
       }
   }
   ```
   
2. 使用 `loadTokens` 回呼設定如何取得初始存取權杖和刷新權杖。此回呼旨在從本地儲存載入快取權杖，並將其作為 `BearerTokens` 實例返回。

   ```kotlin
   install(Auth) {
       bearer {
           loadTokens {
               // 從本地儲存載入權杖，並將其作為 'BearerTokens' 實例返回
               BearerTokens("abc123", "xyz111")
           }
       }
   }
   ```
   
   `abc123` 存取權杖會隨每個 [請求](client-requests.md) 使用 `Bearer` 方案在 `Authorization` 標頭中傳送：
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   ```
   
3. 使用 `refreshTokens` 指定當舊權杖失效時如何取得新權杖。

   ```kotlin
   install(Auth) {
       bearer {
           // 載入權杖 ...
           refreshTokens { // this: RefreshTokensParams
               // 刷新權杖並將其作為 'BearerTokens' 實例返回
               BearerTokens("def456", "xyz111")
           }
       }
   }
   ```
   
   此回呼的運作方式如下：
   
   a. 用戶端使用無效的存取權杖向受保護資源發出請求，並獲得 `401` (未經授權) 回應。
     > 如果安裝了[多個提供者](client-auth.md#realm)，回應應包含 `WWW-Authenticate` 標頭。
   
   b. 用戶端會自動呼叫 `refreshTokens` 以取得新權杖。

   c. 用戶端此次會自動使用新權杖再次向受保護資源發出請求。

4. (可選) 指定一個條件，以便在不等待 `401` (未經授權) 回應的情況下傳送憑證。例如，您可以檢查請求是否發送到指定主機。

   ```kotlin
   install(Auth) {
       bearer {
           // 載入並刷新權杖 ...
           sendWithoutRequest { request ->
               request.url.host == "www.googleapis.com"
           }
       }
   }
   ```

## 範例：使用承載者驗證存取 Google API {id="example-oauth-google"}

讓我們看看如何使用承載者驗證來存取 Google API，該 API 使用 [OAuth 2.0 協定](https://developers.google.com/identity/protocols/oauth2) 進行驗證和授權。我們將研究獲取 Google 個人資料資訊的 [client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google) 主控台應用程式。

### 取得用戶端憑證 {id="google-client-credentials"}
作為第一步，我們需要取得存取 Google API 所需的用戶端憑證：
1. 建立一個 Google 帳戶。
2. 開啟 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 並建立應用程式類型為 `Android` 的 `OAuth client ID` 憑證。這個用戶端 ID 將用於取得[授權授權](#step1)。

### OAuth 授權流程 {id="oauth-flow"}

我們應用程式的 OAuth 授權流程如下所示：

```Console
(1)  --> [[[授權請求|#step1]]]                資源擁有者
(2)  <-- [[[授權碼授權|#step2]]]           資源擁有者
(3)  --> [[[授權碼授權|#step3]]]           授權伺服器
(4)  <-- [[[存取與刷新權杖|#step4]]]            授權伺服器
(5)  --> [[[帶有效權杖的請求|#step5]]]             資源伺服器
(6)  <-- [[[受保護資源|#step6]]]                   資源伺服器
⌛⌛⌛    權杖過期
(7)  --> [[[帶過期權杖的請求|#step7]]]           資源伺服器
(8)  <-- [[[401 未經授權回應|#step8]]]            資源伺服器
(9)  --> [[[刷新權杖授權|#step9]]]  授權伺服器
(10) <-- [[[存取與刷新權杖|#step10]]]            授權伺服器
(11) --> [[[帶新權杖的請求|#step11]]]               資源伺服器
(12) <-- [[[受保護資源|#step12]]]                   資源伺服器
```
{disable-links="false"}

讓我們研究每個步驟的實作方式，以及 `Bearer` 驗證提供者如何協助我們存取 API。

### (1) -> 授權請求 {id="step1"}

作為第一步，我們需要建立用於請求所需權限的授權連結。為此，我們需要將指定的查詢參數附加到 URL：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="23-31"}

- `client_id`：用於存取 Google API 的[先前取得](#google-client-credentials)的用戶端 ID。
- `scope`：Ktor 應用程式所需的資源範圍。在我們的案例中，應用程式請求使用者的個人資料資訊。
- `response_type`：用於取得存取權杖的授權類型。在我們的案例中，我們需要取得一個授權碼。
- `redirect_uri`：`http://127.0.0.1:8080` 值表示使用 _迴路 IP 位址_ 流程來取得授權碼。
   > 若要使用此 URL 接收授權碼，您的應用程式必須正在本地網頁伺服器上監聽。
   > 例如，您可以使用 [Ktor 伺服器](server-create-and-configure.topic) 來取得作為查詢參數的授權碼。
- `access_type`：存取類型設定為 `offline`，因為當使用者不在瀏覽器前時，我們的主控台應用程式需要刷新存取權杖。

### (2) <- 授權碼授權 {id="step2"}

在此步驟中，我們從瀏覽器複製授權碼，將其貼到主控台中，並將其儲存到變數中：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="32"}

### (3) -> 授權碼授權 {id="step3"}

現在我們準備好將授權碼交換為權杖。為此，我們需要建立一個用戶端並安裝帶有 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 外掛程式。這個序列化器是將從 Google OAuth 權杖端點接收到的權杖反序列化所需的。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-41,65"}

使用已建立的用戶端，我們可以安全地將授權碼和其他必要選項作為[表單參數](client-requests.md#form_parameters)傳遞給權杖端點：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="68-77"}

結果，權杖端點會以 JSON 物件的形式傳送權杖，該物件會使用已安裝的 `json` 序列化器反序列化為 `TokenInfo` 類別實例。`TokenInfo` 類別如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/TokenInfo.kt" include-lines="3-13"}

### (4) <- 存取與刷新權杖 {id="step4"}

接收到權杖後，我們可以將它們儲存在儲存中。在我們的範例中，儲存是一個 `BearerTokens` 實例的可變列表。這意味著我們可以將其元素傳遞給 `loadTokens` 和 `refreshTokens` 回呼。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="35-36,78"}

> 請注意，`bearerTokenStorage` 應在[初始化用戶端](#step3)之前建立，因為它將在用戶端配置內部使用。

### (5) -> 帶有效權杖的請求 {id="step5"}

現在我們擁有了有效的權杖，因此我們可以向受保護的 Google API 發出請求並獲取使用者資訊。首先，我們需要調整用戶端[配置](#step3)：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="38-47,60-65"}

指定了以下設定：

- 已經安裝的帶有 `json` 序列化器的 [ContentNegotiation](client-serialization.md) 外掛程式，用於反序列化從資源伺服器接收到的 JSON 格式的使用者資訊。

- 帶有 `bearer` 提供者的 [Auth](client-auth.md) 外掛程式配置如下：
   * `loadTokens` 回呼從[儲存](#step4)載入權杖。
   * `sendWithoutRequest` 回呼配置為僅向提供對受保護資源存取權的主機傳送憑證，而無需等待 `401` (未經授權) 回應。

此用戶端可用於向受保護資源發出請求：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="81"}

### (6) <- 受保護資源 {id="step6"}

資源伺服器以 JSON 格式返回使用者資訊。我們可以將回應反序列化為 `UserInfo` 類別實例，並顯示個人問候語：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="87-88"}

`UserInfo` 類別如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/UserInfo.kt" include-lines="3-13"}

### (7) -> 帶過期權杖的請求 {id="step7"}

在某個時刻，用戶端發出類似於[步驟 5](#step5) 的請求，但使用過期的存取權杖。

### (8) <- 401 未經授權回應 {id="step8"}

資源伺服器返回 `401` 未經授權的回應，因此用戶端應呼叫 `refreshTokens` 回呼。
> 請注意，`401` 回應會返回帶有錯誤詳細資訊的 JSON 資料，我們需要在接收回應時[處理此情況](#step12)。

### (9) -> 刷新權杖授權 {id="step9"}

若要取得新的存取權杖，我們需要配置 `refreshTokens` 並向權杖端點發出另一個請求。這次，我們使用 `refresh_token` 授權類型而不是 `authorization_code`：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="43-44,48-56,59,63-64"}

請注意，`refreshTokens` 回呼使用 `RefreshTokensParams` 作為接收者，並允許您存取以下設定：
- `client` 實例。在上面的程式碼片段中，我們使用它來提交表單參數。
- `oldTokens` 屬性用於存取刷新權杖並將其傳送到權杖端點。

> `HttpRequestBuilder` 公開的 `markAsRefreshTokenRequest` 函數啟用了用於取得刷新權杖請求的特殊處理。

### (10) <- 存取與刷新權杖 {id="step10"}

收到新權杖後，我們可以將它們儲存在[儲存](#step4)中，因此 `refreshTokens` 如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="48-59"}

### (11) -> 帶新權杖的請求 {id="step11"}

在此步驟中，對受保護資源的請求包含一個新權杖，並且應該正常運作。

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85"}

### (12) <-- 受保護資源 {id="step12"}

鑒於 [401 回應](#step8) 返回帶有錯誤詳細資訊的 JSON 資料，我們需要更新我們的範例以將錯誤資訊作為 `ErrorInfo` 物件接收：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/Application.kt" include-lines="85-92"}

`ErrorInfo` 類別如下所示：

```kotlin
```
{src="snippets/client-auth-oauth-google/src/main/kotlin/com/example/models/ErrorInfo.kt" include-lines="3-13"}

您可以在此處找到完整範例：[client-auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-oauth-google)。