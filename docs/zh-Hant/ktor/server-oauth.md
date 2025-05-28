[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[OAuth](https://oauth.net/) (開放授權) 是一個用於存取委託的開放標準。OAuth 可用於透過外部服務提供者 (例如 Google、Facebook、Twitter 等) 授權您應用程式的使用者。

`oauth` 提供者支援授權碼流程 (authorization code flow)。您可以在一個地方設定 OAuth 參數，Ktor 將自動向指定的授權伺服器發出帶有必要參數的請求。

> 您可以在 [](server-auth.md) 章節中取得有關 Ktor 中身份驗證與授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Sessions 外掛程式

為避免客戶端每次嘗試存取受保護資源時都請求授權，您可以在成功授權後將存取權杖 (access token) 儲存在 Session 中。然後，您可以在受保護路由的處理器中從當前 Session 檢索存取權杖，並使用它來請求資源。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="14,25-29,101,128-129"}

## OAuth 授權流程 {id="flow"}

Ktor 應用程式中的 OAuth 授權流程可能如下所示：

1. 使用者在 Ktor 應用程式中開啟登入頁面。
2. Ktor 自動重定向至特定提供者的授權頁面，並傳遞必要的 [參數](#configure-oauth-provider)：
    * 用於存取所選提供者 API 的客戶端 ID。
    * 一個回調 (callback) 或重定向 URL，指定授權完成後將開啟的 Ktor 應用程式頁面。
    * Ktor 應用程式所需的第三方資源範圍 (scopes)。
    * 用於取得存取權杖 (Authorization Code) 的授權類型 (grant type)。
    * 一個 `state` 參數，用於緩解 CSRF 攻擊並重定向使用者。
    * 特定提供者的可選參數。
3. 授權頁面會顯示一個同意畫面 (consent screen)，其中包含 Ktor 應用程式所需的權限等級。這些權限取決於 [](#configure-oauth-provider) 中設定的指定範圍 (scopes)。
4. 如果使用者批准了所請求的權限，授權伺服器會重定向回指定的重定向 URL，並發送授權碼 (authorization code)。
5. Ktor 再自動請求一次指定的存取權杖 URL，包含以下參數：
    * 授權碼。
    * 客戶端 ID 和客戶端密鑰 (client secret)。

   授權伺服器透過返回存取權杖來響應。
6. 客戶端隨後可以使用此權杖向所選提供者的所需服務發出請求。在大多數情況下，權杖將使用 `Bearer` 模式 (schema) 發送到 `Authorization` 標頭中。
7. 服務驗證權杖，使用其範圍 (scope) 進行授權，並返回所請求的數據。

## 安裝 OAuth {id="install"}

若要安裝 `oauth` 身份驗證提供者，請在 `install` 區塊內呼叫 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 函式。您可以選擇 [指定提供者名稱](server-auth.md#provider-name)。例如，安裝名為 "auth-oauth-google" 的 `oauth` 提供者如下所示：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="9-10,25-26,31-33,54-55,101"}

## 設定 OAuth {id="configure-oauth"}

本節演示如何設定 `oauth` 提供者，以使用 Google 授權您應用程式的使用者。有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 先決條件：建立授權憑證 {id="authorization-credentials"}

若要存取 Google API，您需要在 Google Cloud Console 中建立授權憑證。

1. 在 Google Cloud Console 中開啟 [憑證](https://console.cloud.google.com/apis/credentials) 頁面。
2. 點擊 **建立憑證 (CREATE CREDENTIALS)** 並選擇 `OAuth client ID`。
3. 從下拉選單中選擇 `Web application`。
4. 指定以下設定：
    * **已授權的 JavaScript 來源 (Authorised JavaScript origins)**：`http://localhost:8080`。
    * **已授權的重定向 URI (Authorised redirect URIs)**：`http://localhost:8080/callback`。
      在 Ktor 中，[urlProvider](#configure-oauth-provider) 屬性用於指定授權完成時將開啟的重定向路由。

5. 點擊 **建立 (CREATE)**。
6. 在彈出的對話框中，複製所建立的客戶端 ID 和客戶端密鑰，這些將用於設定 `oauth` 提供者。

### 步驟 1：建立 HTTP 客戶端 {id="create-http-client"}

在設定 `oauth` 提供者之前，您需要建立 [HttpClient](client-create-and-configure.md)，該客戶端將由伺服器用於向 OAuth 伺服器發出請求。需要使用帶有 JSON 序列化器 (serializer) 的 [ContentNegotiation](client-serialization.md) 客戶端外掛程式，以便在 [請求 API](#request-api) 後反序列化接收到的 JSON 資料。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="20-24"}

客戶端實例 (instance) 被傳遞給 `main` [模組函式](server-modules.md)，以便能夠在伺服器 [測試](server-testing.md) 中建立一個獨立的客戶端實例。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="26,101"}

### 步驟 2：設定 OAuth 提供者 {id="configure-oauth-provider"}

下面的程式碼片段顯示如何建立和設定名為 `auth-oauth-google` 的 `oauth` 提供者。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="30-54"}

* `urlProvider` 指定一個 [重定向路由](#redirect-route)，該路由將在授權完成時被呼叫。
  > 確保此路由已新增到 [**已授權的重定向 URI (Authorised redirect URIs)**](#authorization-credentials) 列表中。
* `providerLookup` 允許您指定所需提供者的 OAuth 設定。這些設定由 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 類別表示，並允許 Ktor 自動向 OAuth 伺服器發出請求。
* `client` 屬性指定 Ktor 用於向 OAuth 伺服器發出請求的 [HttpClient](#create-http-client)。

### 步驟 3：新增登入路由 {id="login-route"}

設定 `oauth` 提供者後，您需要在 `authenticate` 函式內部 [建立一個受保護的登入路由](server-auth.md#authenticate-route)，該路由接受 `oauth` 提供者的名稱。當 Ktor 收到對此路由的請求時，它將自動重定向到 [providerLookup](#configure-oauth-provider) 中定義的 `authorizeUrl`。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-60,76,100"}

使用者將看到授權頁面，其中包含 Ktor 應用程式所需的權限等級。這些權限取決於 `defaultScopes` 指定在 [providerLookup](#configure-oauth-provider)。

### 步驟 4：新增重定向路由 {id="redirect-route"}

除了登入路由之外，您還需要為 `urlProvider` 建立重定向路由，如 [](#configure-oauth-provider) 中所指定。

在此路由內部，您可以使用 `call.principal` 函式檢索 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 物件。`OAuthAccessTokenResponse` 允許您存取由 OAuth 伺服器返回的權杖和其他參數。

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="56-76,100"}

在此範例中，收到權杖後執行以下操作：

* 權杖儲存在 [Session](server-sessions.md) 中，其內容可在其他路由中存取。
* 使用者被重定向到下一個路由，該路由會向 Google API 發出請求。
* 如果找不到所請求的路由，使用者將被重定向到 `/home` 路由。

### 步驟 5：向 API 發出請求 {id="request-api"}

在 [重定向路由](#redirect-route) 內部收到權杖並將其儲存到 Session 後，您可以使用此權杖向外部 API 發出請求。下面的程式碼片段顯示如何使用 [HttpClient](#create-http-client) 發出此類請求，並透過在 `Authorization` 標頭中發送此權杖來獲取使用者資訊。

建立一個名為 `getPersonalGreeting` 的新函式，該函式將發出請求並返回響應主體 (response body)：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="103-110"}

然後，您可以在 `get` 路由內呼叫該函式以檢索使用者資訊：

```kotlin
```

{src="snippets/auth-oauth-google/src/main/kotlin/com/example/oauth/google/Application.kt" include-lines="93-99"}

有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。