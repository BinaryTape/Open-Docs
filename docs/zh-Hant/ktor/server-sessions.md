[//]: # (title: Sessions)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在無需額外運行時或虛擬機器下運行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
Sessions 外掛程式提供一種機制，用於在不同 HTTP 請求之間持久化資料。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html) 外掛程式提供一種機制，用於在不同 HTTP 請求之間持久化資料。典型的使用案例包括儲存登入使用者的 ID、購物車內容，或在客戶端保留使用者偏好設定。在 Ktor 中，您可以透過使用 Cookie 或自訂標頭來實作 Session，選擇將 Session 資料儲存在伺服器端或傳遞給客戶端，簽署和加密 Session 資料等等。

在本主題中，我們將探討如何安裝 `%plugin_name%` 外掛程式、進行配置，以及在 [路由處理器](server-routing.md#define_route) 內部存取 Session 資料。

## 新增依賴 {id="add_dependencies"}
為了啟用 Session 支援，您需要在建置腳本中包含 `%artifact_name%` artifact：

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
    

## 安裝 Sessions {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請在指定的 <Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來建構應用程式。">模組</Links> 中將其傳遞給 <code>install</code> 函數。
        下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定的路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能很有用。
    </p>
    

## Session 配置概觀 {id="configuration_overview"}
要配置 `%plugin_name%` 外掛程式，您需要執行以下步驟：
1. *[建立資料類別](#data_class)*：在配置 Session 之前，您需要建立一個 [資料類別](https://kotlinlang.org/docs/data-classes.html) 來儲存 Session 資料。
2. *[選擇如何在伺服器與客戶端之間傳遞資料](#cookie_header)*：使用 Cookie 或自訂標頭。Cookie 更適合普通的 HTML 應用程式，而自訂標頭則適用於 API。
3. *[選擇儲存 Session 酬載的位置](#client_server)*：在客戶端或伺服器端。您可以透過 Cookie/標頭值將序列化的 Session 資料傳遞給客戶端，或者將酬載儲存在伺服器端並僅傳遞 Session 識別碼。

   如果您想將 Session 酬載儲存在伺服器端，您可以*[選擇如何儲存](#storages)*：在伺服器記憶體中或在資料夾中。您也可以實作自訂儲存來保存 Session 資料。
4. *[保護 Session 資料](#protect_session)*：為保護傳遞給客戶端的敏感 Session 資料，您需要簽署並加密 Session 的酬載。

配置 `%plugin_name%` 後，您可以在 [路由處理器](server-routing.md#define_route) 內部[取得與設定 Session 資料](#use_sessions)。

## 建立資料類別 {id="data_class"}

在配置 Session 之前，您需要建立一個 [資料類別](https://kotlinlang.org/docs/data-classes.html) 來儲存 Session 資料。 
例如，下面的 `UserSession` 類別將用於儲存 Session ID 和頁面瀏覽次數：

[object Promise]

如果您打算使用多個 Session，則需要建立多個資料類別。

## 傳遞 Session 資料：Cookie 與標頭 {id="cookie_header"}

### Cookie {id="cookie"}
若要使用 Cookie 傳遞 Session 資料，請在 `install(Sessions)` 區塊內呼叫 `cookie` 函數，並指定名稱和資料類別：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上述範例中，Session 資料將透過新增到 `Set-Cookie` 標頭的 `user_session` 屬性傳遞給客戶端。您可以透過在 `cookie` 區塊內傳遞其他 Cookie 屬性來進行配置。例如，下面的程式碼片段展示了如何指定 Cookie 的路徑和過期時間：

[object Promise]

如果所需的屬性沒有明確公開，請使用 `extensions` 屬性。例如，您可以透過以下方式傳遞 `SameSite` 屬性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解更多可用的配置設定，請參閱 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在將您的應用程式[部署](server-deployment.md)到生產環境之前，請確保將 `secure` 屬性設為 `true`。這僅啟用透過[安全連線](server-ssl.md)傳輸 Cookie，並保護 Session 資料免受 HTTPS 降級攻擊。
>
{type="warning"}

### 標頭 {id="header"}
若要使用自訂標頭傳遞 Session 資料，請在 `install(Sessions)` 區塊內呼叫 `header` 函數，並指定名稱和資料類別：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上述範例中，Session 資料將透過 `cart_session` 自訂標頭傳遞給客戶端。 
在客戶端，您需要將此標頭附加到每個請求中以取得 Session 資料。

> 如果您使用 [CORS](server-cors.md) 外掛程式處理跨來源請求，請將您的自訂標頭新增至 `CORS` 配置，如下所示：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 儲存 Session 酬載：客戶端與伺服器端 {id="client_server"}

在 Ktor 中，您可以透過兩種方式管理 Session 資料：
- _在客戶端與伺服器之間傳遞 Session 資料_。
   
  如果您只將 Session 名稱傳遞給 [cookie 或 header](#cookie_header) 函數，則 Session 資料將在客戶端與伺服器之間傳遞。在這種情況下，您需要[簽署並加密](#protect_session) Session 的酬載，以保護傳遞給客戶端的敏感 Session 資料。
- _將 Session 資料儲存在伺服器端並僅在客戶端與伺服器之間傳遞 Session ID_。
   
  在這種情況下，您可以選擇[將酬載儲存在何處](#storages)於伺服器端。例如，您可以將 Session 資料儲存在記憶體中、在指定資料夾中，或者您可以實作自己的自訂儲存。

## 將 Session 酬載儲存在伺服器端 {id="storages"}

Ktor 允許您將 Session 資料[儲存在伺服器端](#client_server)，並僅在伺服器與客戶端之間傳遞 Session ID。在這種情況下，您可以選擇在伺服器上儲存酬載的位置。

### 記憶體儲存 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 允許將 Session 內容儲存在記憶體中。此儲存會在伺服器運行時保留資料，並在伺服器停止後丟棄資訊。例如，您可以如下將 Cookie 儲存在伺服器記憶體中：

[object Promise]

您可以在此處找到完整範例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 請注意，`SessionStorageMemory` 僅用於開發目的。
> {type="warning"}

### 目錄儲存 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用於將 Session 資料儲存在指定目錄下的檔案中。例如，若要將 Session 資料儲存在 `build/.sessions` 目錄下的檔案中，請依此方式建立 `directorySessionStorage`：
[object Promise]

您可以在此處找到完整範例：[session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### 自訂儲存 {id="custom_storage"}

Ktor 提供 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 介面，讓您可以實作自訂儲存。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
這三個函數都是[掛起函數](https://kotlinlang.org/docs/composing-suspending-functions.html)。您可以參考 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)。

## 保護 Session 資料 {id="protect_session"}

### 簽署 Session 資料 {id="sign_session"}

簽署 Session 資料可防止修改 Session 的內容，但允許使用者查看此內容。
若要簽署 Session，請將簽署金鑰傳遞給 `SessionTransportTransformerMessageAuthentication` 建構函數，並將此實例傳遞給 `transform` 函數：

[object Promise]

`SessionTransportTransformerMessageAuthentication` 預設使用 `HmacSHA256` 作為驗證演算法，此演算法可以更改。 

### 簽署並加密 Session 資料 {id="sign_encrypt_session"}

簽署並加密 Session 資料可防止讀取和修改 Session 的內容。
若要簽署並加密 Session，請將簽署/加密金鑰傳遞給 `SessionTransportTransformerEncrypt` 建構函數，並將此實例傳遞給 `transform` 函數：

[object Promise]

> 請注意，Ktor `3.0.0` 版本中已[更新加密方法](migrating-3.md#session-encryption-method-update)。如果您是從早期版本遷移，請在 `SessionTransportTransformerEncrypt` 的建構函數中使用 `backwardCompatibleRead` 屬性，以確保與現有 Session 的相容性。
>
{style="note"}

預設情況下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 演算法，此演算法可以更改。 

> 請注意，簽署/加密金鑰不應在程式碼中指定。您可以在[配置檔案](server-configuration-file.topic#configuration-file-overview)中使用自訂組來儲存簽署/加密金鑰，並使用[環境變數](server-configuration-file.topic#environment-variables)初始化它們。
>
{type="warning"}

## 取得並設定 Session 內容 {id="use_sessions"}
若要為特定的[路由](server-routing.md)設定 Session 內容，請使用 `call.sessions` 屬性。`set` 方法允許您建立新的 Session 實例：

[object Promise]

若要取得 Session 內容，您可以呼叫 `get`，並將其中一個已註冊的 Session 類型作為類型參數傳入：

[object Promise]

若要修改 Session，例如遞增計數器，您需要呼叫資料類別的 `copy` 方法：

[object Promise]

當您因任何原因需要清除 Session 時（例如，使用者登出時），請呼叫 `clear` 函數：

[object Promise]

您可以在此處找到完整範例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 延遲 Session 擷取

預設情況下，Ktor 會嘗試為每個包含 Session 的請求從儲存中讀取 Session，無論
路由是否真正需要它。這種行為可能會導致不必要的開銷 — 特別是在使用自訂 Session 儲存的應用程式中。

您可以透過啟用 `io.ktor.server.sessions.deferred` 系統屬性來延遲 Session 載入：

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 範例 {id="examples"}

以下可執行的範例展示了如何使用 `%plugin_name%` 外掛程式：

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [Cookie](#cookie) 將[簽署並加密](#sign_encrypt_session)的 Session 酬載傳遞給[客戶端](#client_server)。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何將 Session 酬載保留在[伺服器記憶體](#in_memory_storage)中，並使用 [Cookie](#cookie) 將[簽署](#sign_session)的 Session ID 傳遞給客戶端。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何將 Session 酬載保留在伺服器上的[目錄儲存](#directory_storage)中，並使用[自訂標頭](#header)將[簽署](#sign_session)的 Session ID 傳遞給客戶端。