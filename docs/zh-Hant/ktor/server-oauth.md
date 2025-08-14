[//]: # (title: OAuth)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="OAuth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需相依性</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-oauth-google"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不額外執行階段或虛擬機器下執行伺服器。">原生伺服器</Links>支援</b>：✅
    </p>
    
</tldr>

[OAuth](https://oauth.net/) 是一種用於存取委派的開放標準。OAuth 可用於透過外部提供者（例如 Google、Facebook、Twitter 等）授權您的應用程式使用者。

<code>oauth</code> 提供者支援授權碼流程。您可以在一個地方配置 OAuth 參數，Ktor 將自動向指定的授權伺服器發出帶有所需參數的請求。

> 您可以在 [](server-auth.md) 章節中取得有關 Ktor 中身份驗證和授權的一般資訊。

## 新增相依性 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安裝 Sessions 外掛程式

為了避免每次用戶端嘗試存取受保護資源時都請求授權，您可以在成功授權後將存取權杖儲存在會話中。然後，您可以從受保護路由的處理函式中的目前會話中擷取存取權杖，並使用它來請求資源。

[object Promise]

## OAuth 授權流程 {id="flow"}

Ktor 應用程式中的 OAuth 授權流程可能如下所示：

1. 使用者在 Ktor 應用程式中開啟登入頁面。
2. Ktor 自動重新導向到特定提供者的授權頁面，並傳遞必要的 [參數](#configure-oauth-provider)：
    * 用於存取所選提供者 API 的用戶端 ID。
    * 指定 Ktor 應用程式頁面的回呼或重新導向 URL，該頁面將在授權完成後開啟。
    * Ktor 應用程式所需的第三方資源範圍。
    * 用於取得存取權杖（授權碼）的授權類型。
    * 用於緩解 CSRF 攻擊和重新導向使用者的 <code>state</code> 參數。
    * 針對特定提供者的選用參數。
3. 授權頁面顯示一個同意畫面，其中包含 Ktor 應用程式所需的權限級別。這些權限取決於指定的範圍，如 [](#configure-oauth-provider) 中所配置。
4. 如果使用者批准了請求的權限，授權伺服器會重新導向回指定的重新導向 URL 並傳送授權碼。
5. Ktor 再次自動向指定的存取權杖 URL 發出請求，包含以下參數：
    * 授權碼。
    * 用戶端 ID 和用戶端密鑰。

   授權伺服器回應時會返回一個存取權杖。
6. 用戶端隨後可以使用此權杖向所選提供者所需的服務發出請求。在大多數情況下，權杖將使用 <code>Bearer</code> 方案透過 <code>Authorization</code> 標頭傳送。
7. 服務驗證權杖，使用其範圍進行授權，並返回請求的資料。

## 安裝 OAuth {id="install"}

若要安裝 <code>oauth</code> 身份驗證提供者，請在 <code>install</code> 區塊內呼叫 [oauth](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/oauth.html) 函式。您可以選用 [指定提供者名稱](server-auth.md#provider-name)。例如，若要安裝名稱為 "auth-oauth-google" 的 <code>oauth</code> 提供者，其配置會如下所示：

[object Promise]

## 配置 OAuth {id="configure-oauth"}

本節將示範如何配置 <code>oauth</code> 提供者，以便使用 Google 授權您的應用程式使用者。有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 先決條件：建立授權憑證 {id="authorization-credentials"}

若要存取 Google API，您需要在 Google Cloud Console 中建立授權憑證。

1. 在 Google Cloud Console 中開啟 [憑證](https://console.cloud.google.com/apis/credentials) 頁面。
2. 點擊 **建立憑證** 並選擇 <code>OAuth 用戶端 ID</code>。
3. 從下拉選單中選擇 <code>Web 應用程式</code>。
4. 指定以下設定：
    * <b>授權的 JavaScript 來源</b>：<code>http://localhost:8080</code>。
    * <b>授權的重新導向 URI</b>：<code>http://localhost:8080/callback</code>。
      在 Ktor 中，[urlProvider](#configure-oauth-provider) 屬性用於指定重新導向路由，該路由將在授權完成後開啟。

5. 點擊 **建立**。
6. 在彈出的對話框中，複製所建立的用戶端 ID 和用戶端密鑰，這些將用於配置 <code>oauth</code> 提供者。

### 步驟 1：建立 HTTP 用戶端 {id="create-http-client"}

在配置 <code>oauth</code> 提供者之前，您需要建立 [HttpClient](client-create-and-configure.md)，伺服器將使用它向 OAuth 伺服器發出請求。需要帶有 JSON 序列化器的 [ContentNegotiation](client-serialization.md) 用戶端外掛程式，才能在 [向 API 發出請求後](#request-api) 反序列化接收到的 JSON 資料。

[object Promise]

用戶端實例會傳遞給 <code>main</code> [模組函式](server-modules.md)，以便能夠在伺服器 [測試](server-testing.md) 中建立獨立的用戶端實例。

[object Promise]

### 步驟 2：配置 OAuth 提供者 {id="configure-oauth-provider"}

以下程式碼片段示範如何建立並配置名稱為 <code>auth-oauth-google</code> 的 <code>oauth</code> 提供者。

[object Promise]

* <code>urlProvider</code> 指定一個 [重新導向路由](#redirect-route)，該路由將在授權完成時被呼叫。
  > 確保此路由已新增到 [**授權的重新導向 URI**](#authorization-credentials) 列表中。
* <code>providerLookup</code> 允許您為所需的提供者指定 OAuth 設定。這些設定由 [OAuthServerSettings](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-server-settings/index.html) 類別表示，並允許 Ktor 自動向 OAuth 伺服器發出請求。
* <code>client</code> 屬性指定 Ktor 用於向 OAuth 伺服器發出請求的 [HttpClient](#create-http-client)。

### 步驟 3：新增登入路由 {id="login-route"}

配置 <code>oauth</code> 提供者後，您需要在 <code>authenticate</code> 函式內部 [建立一個受保護的登入路由](server-auth.md#authenticate-route)，該路由接受 <code>oauth</code> 提供者的名稱。當 Ktor 收到對此路由的請求時，它將自動重新導向到 [providerLookup](#configure-oauth-provider) 中定義的 <code>authorizeUrl</code>。

[object Promise]

使用者將看到授權頁面，其中顯示 Ktor 應用程式所需的權限級別。這些權限取決於 [providerLookup](#configure-oauth-provider) 中指定的 <code>defaultScopes</code>。

### 步驟 4：新增重新導向路由 {id="redirect-route"}

除了登入路由之外，您還需要為 <code>urlProvider</code> 建立重新導向路由，如 [](#configure-oauth-provider) 中所指定。

在此路由中，您可以使用 <code>call.principal</code> 函式擷取 [OAuthAccessTokenResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-o-auth-access-token-response/index.html) 物件。<code>OAuthAccessTokenResponse</code> 允許您存取 OAuth 伺服器返回的權杖和其他參數。

[object Promise]

在此範例中，收到權杖後會執行以下操作：

* 權杖儲存到 [Session](server-sessions.md) 中，其內容可在其他路由中存取。
* 使用者被重新導向到下一個路由，該路由會向 Google API 發出請求。
* 如果請求的路由未找到，使用者將被重新導向到 <code>/home</code> 路由。

### 步驟 5：向 API 發出請求 {id="request-api"}

在 [重新導向路由](#redirect-route) 內部收到權杖並將其儲存到會話後，您可以使用此權杖向外部 API 發出請求。以下程式碼片段示範如何使用 [HttpClient](#create-http-client) 發出此類請求，並透過在 <code>Authorization</code> 標頭中傳送此權杖來取得使用者資訊。

建立一個名為 <code>getPersonalGreeting</code> 的新函式，該函式將發出請求並返回回應主體：

[object Promise]

然後，您可以在 <code>get</code> 路由中呼叫該函式以擷取使用者資訊：

[object Promise]

有關完整的可執行範例，請參閱 [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。