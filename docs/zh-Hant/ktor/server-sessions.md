[//]: # (title: 會話)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在無需額外執行時或虛擬機器下運行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

<link-summary>
Sessions 外掛提供了一種在不同 HTTP 請求之間持久化資料的機制。
</link-summary>

The [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html) 外掛提供了一種在不同 HTTP 請求之間持久化資料的機制。典型應用場景包括儲存已登入使用者的 ID、購物籃的內容或在客戶端保留使用者偏好設定。在 Ktor 中，您可以透過使用 Cookie 或自訂標頭來實作會話，選擇將會話資料儲存在伺服器上還是傳遞給客戶端，以及簽署和加密會話資料等等。

在本主題中，我們將探討如何安裝 `%plugin_name%` 外掛、配置它以及在[路由處理程式](server-routing.md#define_route)內部存取會話資料。

## 新增依賴項 {id="add_dependencies"}
為了啟用會話支援，您需要在建置指令碼中包含 `%artifact_name%` artifact：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 Sessions {id="install_plugin"}

<p>
    要將 <code>%plugin_name%</code> 外掛<a href="#install">安裝</a>到應用程式中，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 外掛也可以<a href="#install-route">安裝到特定路由</a>。
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這將會很有用。
</p>

## 會話配置概覽 {id="configuration_overview"}
要配置 `%plugin_name%` 外掛，您需要執行以下步驟：
1. *[建立資料類別](#data_class)*：在配置會話之前，您需要為儲存會話資料建立一個[資料類別](https://kotlinlang.org/docs/data-classes.html)。
2. *[選擇如何在伺服器和客戶端之間傳遞資料](#cookie_header)*：使用 Cookie 或自訂標頭。Cookie 更適合純 HTML 應用程式，而自訂標頭則用於 API。
3. *[選擇在哪裡儲存會話有效負載](#client_server)*：在客戶端或伺服器端。您可以透過 Cookie/標頭值將序列化的會話資料傳遞給客戶端，或者將有效負載儲存在伺服器上，僅傳遞會話識別碼。

   如果您想將會話有效負載儲存在伺服器上，您可以*[選擇如何儲存它](#storages)*：在伺服器記憶體中或在一個資料夾中。您也可以實作自訂儲存以保留會話資料。
4. *[保護會話資料](#protect_session)*：為了保護傳遞給客戶端的敏感會話資料，您需要簽署並加密會話的有效負載。

配置 `%plugin_name%` 後，您可以在[路由處理程式](server-routing.md#define_route)內部[取得並設定會話資料](#use_sessions)。

## 建立資料類別 {id="data_class"}

在配置會話之前，您需要為儲存會話資料建立一個[資料類別](https://kotlinlang.org/docs/data-classes.html)。
例如，下面的 `UserSession` 類別將用於儲存會話 ID 和頁面瀏覽次數：

```kotlin
@Serializable
data class UserSession(val id: String, val count: Int)
```

如果您打算使用多個會話，您需要建立多個資料類別。

## 傳遞會話資料：Cookie vs 標頭 {id="cookie_header"}

### Cookie {id="cookie"}
要使用 Cookie 傳遞會話資料，請在 `install(Sessions)` 區塊內呼叫帶有指定名稱和資料類別的 `cookie` 函數：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
在上面的範例中，會話資料將使用添加到 `Set-Cookie` 標頭中的 `user_session` 屬性傳遞給客戶端。您可以透過在 `cookie` 區塊內部傳遞其他 Cookie 屬性來配置它們。例如，下面的程式碼片段展示了如何指定 Cookie 的路徑和過期時間：

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
    }
}
```

如果所需的屬性沒有明確公開，請使用 `extensions` 屬性。例如，您可以透過以下方式傳遞 `SameSite` 屬性：
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
要了解更多可用的配置設定，請參閱 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)。

> 在將您的應用程式[部署](server-deployment.md)到生產環境之前，請確保 `secure` 屬性設定為 `true`。這將啟用僅透過[安全連線](server-ssl.md)傳輸 Cookie，並保護會話資料免受 HTTPS 降級攻擊。
>
{type="warning"}

### 標頭 {id="header"}
要使用自訂標頭傳遞會話資料，請在 `install(Sessions)` 區塊內呼叫帶有指定名稱和資料類別的 `header` 函數：

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

在上面的範例中，會話資料將使用 `cart_session` 自訂標頭傳遞給客戶端。
在客戶端，您需要將此標頭附加到每個請求以取得會話資料。

> 如果您使用 [CORS](server-cors.md) 外掛來處理跨來源請求，請將您的自訂標頭按如下方式添加到 `CORS` 配置中：
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 儲存會話有效負載：客戶端 vs 伺服器 {id="client_server"}

在 Ktor 中，您可以透過兩種方式管理會話資料：
- _在客戶端和伺服器之間傳遞會話資料_。
   
  如果您只將會話名稱傳遞給 [Cookie 或標頭](#cookie_header)函數，則會話資料將在客戶端和伺服器之間傳遞。在這種情況下，您需要[簽署並加密](#protect_session)會話的有效負載，以保護傳遞給客戶端的敏感會話資料。
- _在伺服器上儲存會話資料，並僅在客戶端和伺服器之間傳遞會話 ID_。
   
  在這種情況下，您可以選擇[在哪裡儲存有效負載](#storages)在伺服器上。例如，您可以將會話資料儲存在記憶體中、指定資料夾中，或者您可以實作您自己的自訂儲存。

## 在伺服器上儲存會話有效負載 {id="storages"}

Ktor 允許您在[伺服器上](#client_server)儲存會話資料，並僅在伺服器和客戶端之間傳遞會話 ID。在這種情況下，您可以選擇在哪裡保留伺服器上的有效負載。

### 記憶體儲存 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html) 啟用在記憶體中儲存會話內容。此儲存會在伺服器運行時保留資料，一旦伺服器停止就會丟棄資訊。例如，您可以如下在伺服器記憶體中儲存 Cookie：

```kotlin
cookie<CartSession>("cart_session", SessionStorageMemory()) {
}
```

您可以在此處找到完整範例：[session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)。

> 請注意，`SessionStorageMemory` 僅用於開發。

### 目錄儲存 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html) 可用於將會話資料儲存在指定目錄下的檔案中。例如，要在 `build/.sessions` 目錄下儲存會話資料，請以這種方式建立 `directorySessionStorage`：
```kotlin
header<CartSession>("cart_session", directorySessionStorage(File("build/.sessions"))) {
}
```

您可以在此處找到完整範例：[session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)。

### 自訂儲存 {id="custom_storage"}

Ktor 提供了 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 介面，允許您實作自訂儲存。
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
所有三個函數都是[ suspending](https://kotlinlang.org/docs/composing-suspending-functions.html) 函數。您可以使用 [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt) 作為參考。

## 保護會話資料 {id="protect_session"}

### 簽署會話資料 {id="sign_session"}

簽署會話資料可以防止修改會話內容，但允許使用者查看此內容。
要簽署會話，請將簽名金鑰傳遞給 `SessionTransportTransformerMessageAuthentication` 建構函數，並將此實例傳遞給 `transform` 函數：

```kotlin
install(Sessions) {
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<CartSession>("cart_session", SessionStorageMemory()) {
        cookie.path = "/"
        transform(SessionTransportTransformerMessageAuthentication(secretSignKey))
    }
}
```

`SessionTransportTransformerMessageAuthentication` 使用 `HmacSHA256` 作為預設身份驗證演算法，該演算法可以更改。

### 簽署並加密會話資料 {id="sign_encrypt_session"}

簽署並加密會話資料可以防止讀取和修改會話內容。
要簽署並加密會話，請將簽名/加密金鑰傳遞給 `SessionTransportTransformerEncrypt` 建構函數，並將此實例傳遞給 `transform` 函數：

```kotlin
install(Sessions) {
    val secretEncryptKey = hex("00112233445566778899aabbccddeeff")
    val secretSignKey = hex("6819b57a326945c1968f45236589")
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 10
        transform(SessionTransportTransformerEncrypt(secretEncryptKey, secretSignKey))
    }
}
```

> 請注意，Ktor `3.0.0` 版本中[加密方法已更新](migrating-3.md#session-encryption-method-update)。如果您從早期版本遷移，請在 `SessionTransportTransformerEncrypt` 的建構函數中使用 `backwardCompatibleRead` 屬性，以確保與現有會話的相容性。
>
{style="note"}

預設情況下，`SessionTransportTransformerEncrypt` 使用 `AES` 和 `HmacSHA256` 演算法，這些演算法可以更改。

> 請注意，簽名/加密金鑰不應在程式碼中指定。您可以在[配置檔案](server-configuration-file.topic#configuration-file-overview)中使用自訂群組來儲存簽名/加密金鑰，並使用[環境變數](server-configuration-file.topic#environment-variables)初始化它們。
>
{type="warning"}

## 取得並設定會話內容 {id="use_sessions"}
要為特定[路由](server-routing.md)設定會話內容，請使用 `call.sessions` 屬性。`set` 方法允許您建立新的會話實例：

```kotlin
get("/login") {
    call.sessions.set(UserSession(id = "123abc", count = 0))
    call.respondRedirect("/user")
}
```

要取得會話內容，您可以呼叫 `get`，將其中一個已註冊的會話類型作為類型參數：

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
}
```

要修改會話，例如遞增計數器，您需要呼叫資料類別的 `copy` 方法：

```kotlin
get("/user") {
    val userSession = call.sessions.get<UserSession>()
    if (userSession != null) {
        call.sessions.set(userSession.copy(count = userSession.count + 1))
        call.respondText("Session ID is ${userSession.id}. Reload count is ${userSession.count}.")
    } else {
        call.respondText("Session doesn't exist or is expired.")
    }
}
```

當您需要因任何原因清除會話時（例如，當使用者登出時），請呼叫 `clear` 函數：

```kotlin
get("/logout") {
    call.sessions.clear<UserSession>()
    call.respondRedirect("/user")
}
```

您可以在此處找到完整範例：[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)。

## 延遲會話擷取

預設情況下，Ktor 會嘗試為每個包含會話的請求從儲存中讀取會話，無論路由是否實際需要它。這種行為可能會導致不必要的開銷 — 特別是在使用自訂會話儲存的應用程式中。

您可以透過啟用 `io.ktor.server.sessions.deferred` 系統屬性來延遲會話載入：

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 範例 {id="examples"}

下面的可執行範例演示了如何使用 `%plugin_name%` 外掛：

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 展示了如何使用 [Cookie](#cookie) 將[簽署並加密](#sign_encrypt_session)的會話有效負載傳遞給[客戶端](#client_server)。
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server) 展示了如何將會話有效負載保留在[伺服器記憶體](#in_memory_storage)中，並使用 [Cookie](#cookie) 將[簽署的](#sign_session)會話 ID 傳遞給客戶端。
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server) 展示了如何在伺服器上的[目錄儲存](#directory_storage)中保留會話有效負載，並使用[自訂標頭](#header)將[簽署的](#sign_session)會話 ID 傳遞給客戶端。