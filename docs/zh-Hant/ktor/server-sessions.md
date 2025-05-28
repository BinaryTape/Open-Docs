[//]: # (title: 工作階段)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>必要依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
工作階段外掛程式提供了一種在不同 HTTP 請求之間持久化資料的機制。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html) 外掛程式提供了一種在不同 HTTP 請求之間持久化資料的機制。典型的用例包括儲存已登入使用者的 ID、購物車內容，或在客戶端保留使用者偏好設定。在 Ktor 中，您可以使用 Cookie 或自訂標頭來實作工作階段，選擇將工作階段資料儲存在伺服器上還是傳遞給客戶端，簽署和加密工作階段資料等等。

在本主題中，我們將探討如何安裝 `%plugin_name%` 外掛程式、配置它，以及在 [路由處理器](server-routing.md#define_route) 內部存取工作階段資料。

## 新增依賴項 {id="add_dependencies"}
為了啟用對工作階段的支援，您需要在建置腳本中包含 `%artifact_name%` 構件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝工作階段 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 工作階段配置概覽 {id="configuration_overview"}
要配置 `%plugin_name%` 外掛程式，您需要執行以下步驟：
1.  *[建立資料類別](#data_class)*：在配置工作階段之前，您需要建立一個用於儲存工作階段資料的 [資料類別](https://kotlinlang.org/docs/data-classes.html)。
2.  *[選擇伺服器與客戶端之間傳遞資料的方式](#cookie_header)*：使用 Cookie 或自訂標頭。Cookie 更適合純 HTML 應用程式，而自訂標頭則適用於 API。
3.  *[選擇工作階段負載的儲存位置](#client_server)*：在客戶端或伺服器上。您可以透過 Cookie/標頭值將序列化的工作階段資料傳遞給客戶端，或者將負載儲存在伺服器上，僅傳遞工作階段識別碼。

   如果您想將工作階段負載儲存在伺服器上，您可以 *[選擇如何儲存](#storages)*：在伺服器記憶體中或在資料夾中。您也可以實作自訂儲存區來保存工作階段資料。
4.  *[保護工作階段資料](#protect_session)*：為保護傳遞給客戶端的敏感工作階段資料，您需要簽署並加密工作階段的負載。

配置 `%plugin_name%` 後，您可以在 [路由處理器](server-routing.md#define_route) 內部 [取得和設定工作階段資料](#use_sessions)。

## 建立資料類別 {id="data_class"}

在配置工作階段之前，您需要建立一個用於儲存工作階段資料的 [資料類別](https://kotlinlang.org/docs/data-classes.html)。
例如，下面的 `UserSession` 類別將用於儲存工作階段 ID 和頁面瀏覽次數：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="10-11"}

如果您打算使用多個工作階段，則需要建立多個資料類別。

## 傳遞工作階段資料：Cookie 與標頭 {id="cookie_header"}

### Cookie {id="cookie"}
要使用 Cookie 傳遞工作階段資料，請在 `install(Sessions)` 區塊內呼叫 `cookie` 函式，並指定名稱和資料類別：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上面的範例中，工作階段資料將透過新增到 `Set-Cookie` 標頭的 `user_session` 屬性傳遞給客戶端。您可以透過在 `cookie` 區塊內傳遞其他 Cookie 屬性來進行配置。例如，下面的程式碼片段展示了如何指定 Cookie 的路徑和過期時間：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14,17-19,21-22"}

如果所需的屬性未明確公開，請使用 `extensions` 屬性。例如，您可以透過以下方式傳遞 `SameSite` 屬性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解有關可用配置設定的更多資訊，請參閱 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在將應用程式 [部署](server-deployment.md) 到生產環境之前，請確保將 `secure` 屬性設定為 `true`。這僅允許透過 [安全連線](server-ssl.md) 傳輸 Cookie，並保護工作階段資料免受 HTTPS 降級攻擊。
>
{type="warning"}

### 標頭 {id="header"}
要使用自訂標頭傳遞工作階段資料，請在 `install(Sessions)` 區塊內呼叫 `header` 函式，並指定名稱和資料類別：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上面的範例中，工作階段資料將透過 `cart_session` 自訂標頭傳遞給客戶端。
在客戶端，您需要將此標頭附加到每個請求中以取得工作階段資料。

> 如果您使用 [CORS](server-cors.md) 外掛程式來處理跨來源請求，請將您的自訂標頭新增到 `CORS` 配置中，如下所示：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 儲存工作階段負載：客戶端與伺服器 {id="client_server"}

在 Ktor 中，您可以透過兩種方式管理工作階段資料：
-   _在客戶端和伺服器之間傳遞工作階段資料_。

    如果您只將工作階段名稱傳遞給 [cookie 或標頭](#cookie_header) 函式，工作階段資料將在客戶端和伺服器之間傳遞。在這種情況下，您需要 [簽署並加密](#protect_session) 工作階段的負載，以保護傳遞給客戶端的敏感工作階段資料。
-   _將工作階段資料儲存在伺服器上，並僅在客戶端和伺服器之間傳遞工作階段 ID_。

    在這種情況下，您可以選擇在伺服器上 [儲存負載的位置](#storages)。例如，您可以將工作階段資料儲存在記憶體中、指定資料夾中，或者您可以實作自己的自訂儲存區。

## 在伺服器上儲存工作階段負載 {id="storages"}

Ktor 允許您將工作階段資料儲存在 [伺服器上](#client_server)，並且僅在伺服器和客戶端之間傳遞工作階段 ID。在這種情況下，您可以選擇在伺服器上保存負載的位置。

### 記憶體儲存區 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 能夠在記憶體中儲存工作階段內容。此儲存區在伺服器執行期間保留資料，一旦伺服器停止便會丟棄資訊。例如，您可以如下所示在伺服器記憶體中儲存 Cookie：

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="16,19"}

您可以在這裡找到完整範例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 請注意，`SessionStorageMemory` 僅用於開發目的。

### 目錄儲存區 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用於將工作階段資料儲存在指定目錄下的檔案中。例如，要將工作階段資料儲存在 `build/.sessions` 目錄下的檔案中，請以這種方式建立 `directorySessionStorage`：
```kotlin
```
{src="snippets/session-header-server/src/main/kotlin/com/example/Application.kt" include-lines="17,19"}

您可以在這裡找到完整範例：[session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### 自訂儲存區 {id="custom_storage"}

Ktor 提供了 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 介面，允許您實作自訂儲存區。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
這三個函式都是 [暫停函式 (suspending functions)](https://kotlinlang.org/docs/composing-suspending-functions.html)。您可以將 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt) 作為參考。

## 保護工作階段資料 {id="protect_session"}

### 簽署工作階段資料 {id="sign_session"}

簽署工作階段資料可防止修改工作階段內容，但允許使用者檢視此內容。
要簽署工作階段，請將簽署金鑰傳遞給 `SessionTransportTransformerMessageAuthentication` 建構函式，並將此實例傳遞給 `transform` 函式：

```kotlin
```
{src="snippets/session-cookie-server/src/main/kotlin/com/example/Application.kt" include-lines="14-20"}

`SessionTransportTransformerMessageAuthentication` 使用 `HmacSHA256` 作為預設的身份驗證演算法，該演算法可以更改。

### 簽署並加密工作階段資料 {id="sign_encrypt_session"}

簽署並加密工作階段資料可防止讀取和修改工作階段內容。
要簽署並加密工作階段，請將簽署/加密金鑰傳遞給 `SessionTransportTransformerEncrypt` 建構函式，並將此實例傳遞給 `transform` 函式：

```kotlin
```

{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="14-22"}

> 請注意，Ktor 版本 `3.0.0` 中 [加密方法已更新](migrating-3.md#session-encryption-method-update)。如果您從較早版本遷移，請在 `SessionTransportTransformerEncrypt` 的建構函式中使用 `backwardCompatibleRead` 屬性，以確保與現有工作階段的相容性。
>
{style="note"}

預設情況下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 演算法，這可以更改。

> 請注意，簽署/加密金鑰不應在程式碼中指定。您可以在 [配置檔](server-configuration-file.topic#configuration-file-overview) 中使用自訂組來儲存簽署/加密金鑰，並使用 [環境變數](server-configuration-file.topic#environment-variables) 對其進行初始化。
>
{type="warning"}

## 取得和設定工作階段內容 {id="use_sessions"}
要為特定 [路由](server-routing.md) 設定工作階段內容，請使用 `call.sessions` 屬性。`set` 方法允許您建立新的工作階段實例：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="24-27"}

要取得工作階段內容，您可以呼叫 `get`，並將其中一個已註冊的工作階段類型作為類型參數傳遞：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-31,37"}

要修改工作階段，例如，增加計數器，您需要呼叫資料類別的 `copy` 方法：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="29-37"}

當您因任何原因需要清除工作階段時（例如，使用者登出時），請呼叫 `clear` 函式：

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="39-42"}

您可以在這裡找到完整範例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 範例 {id="examples"}

以下可執行的範例展示了如何使用 `%plugin_name%` 外掛程式：

-   [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [Cookie](#cookie) 將 [簽署並加密](#sign_encrypt_session) 的工作階段負載傳遞給 [客戶端](#client_server)。
-   [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何將工作階段負載保存在 [伺服器記憶體](#in_memory_storage) 中，並使用 [Cookie](#cookie) 將 [簽署](#sign_session) 的工作階段 ID 傳遞給客戶端。
-   [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何將工作階段負載保存在伺服器的 [目錄儲存區](#directory_storage) 中，並使用 [自訂標頭](#header) 將 [簽署](#sign_session) 的工作階段 ID 傳遞給客戶端。