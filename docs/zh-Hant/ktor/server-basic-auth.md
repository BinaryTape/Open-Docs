[//]: # (title: Ktor 伺服器中的基本認證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行時或虛擬機器即可執行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

基本認證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制與認證。在此方案中，使用者憑證以 Base64 編碼的使用者名稱/密碼對形式傳輸。

Ktor 允許您使用基本認證來登入使用者並保護特定的 [路由](server-routing.md)。您可以在 [Ktor 伺服器中的認證與授權](server-auth.md) 區段中取得關於 Ktor 認證的一般資訊。

> 鑑於基本認證以明文傳輸使用者名稱和密碼，您需要使用 [HTTPS/TLS](server-ssl.md) 來保護敏感資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `basic` 認證，您需要在建置腳本中包含 `%artifact_name%` artifact：

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

## 基本認證流程 {id="flow"}

基本認證流程如下：

1. 用戶端向伺服器應用程式中的特定 [路由](server-routing.md) 發出不帶 `Authorization` 標頭的請求。
2. 伺服器以 `401` (未授權) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭提供資訊，表明基本認證方案用於保護路由。典型的 `WWW-Authenticate` 標頭如下所示：
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   在 Ktor 中，您可以在 [設定](#configure-provider) `basic` 認證供應器時，使用相應的屬性來指定 realm 和 charset。

3. 通常，用戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，用戶端發出包含以 Base64 編碼的使用者名稱和密碼對的 `Authorization` 標頭的請求，例如：
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器 [驗證](#configure-provider) 用戶端發送的憑證，並回應所請求的內容。

## 安裝基本認證 {id="install"}
若要安裝 `basic` 認證供應器，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/basic.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // Configure basic authentication
    }
}
```

您可以選擇性地指定一個 [供應器名稱](server-auth.md#provider-name)，該名稱可用於 [認證指定的路由](#authenticate-route)。

## 設定基本認證 {id="configure"}

若要了解如何在 Ktor 中設定不同的認證供應器，請參閱 [設定認證](server-auth.md#configure)。在本節中，我們將看到 `basic` 認證供應器的特定設定。

### 步驟 1：設定基本供應器 {id="configure-provider"}

`basic` 認證供應器透過 [BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
* `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的 realm。
* `validate` 函數驗證使用者名稱和密碼。

```kotlin
install(Authentication) {
    basic("auth-basic") {
        realm = "Access to the '/' path"
        validate { credentials ->
            if (credentials.name == "jetbrains" && credentials.password == "foobar") {
                UserIdPrincipal(credentials.name)
            } else {
                null
            }
        }
    }
}
```
   
`validate` 函數檢查 `UserPasswordCredential`，並在認證成功時返回 `UserIdPrincipal`，如果認證失敗則返回 `null`。
> 您也可以使用 [UserHashedTableAuth](#validate-user-hash) 來驗證儲存在記憶體內表格中的使用者，該表格會儲存使用者名稱和密碼雜湊。

### 步驟 2：保護特定資源 {id="authenticate-route"}

設定 `basic` 供應器後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數保護應用程式中的特定資源。在成功認證的情況下，您可以使用 `call.principal` 函數在路由處理常式中擷取已認證的 [UserIdPrincipal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已認證使用者的名稱。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

## 使用 UserHashedTableAuth 驗證 {id="validate-user-hash"}

Ktor 允許您使用 [UserHashedTableAuth](#validate-user-hash) 來 [驗證](#configure-provider) 儲存在記憶體內表格中的使用者，該表格會儲存使用者名稱和密碼雜湊。這讓您可以避免在資料來源洩露時危及使用者密碼。

若要使用 `UserHashedTableAuth` 驗證使用者，請按照以下步驟操作：

1. 使用 [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html) 函數，建立具有指定演算法和鹽值供應器的摘要函數：
   
   ```kotlin
   val digestFunction = getDigestFunction("SHA-256") { "ktor${it.length}" }
   ```

2. 初始化 `UserHashedTableAuth` 的新實例，並指定以下屬性：
   * 使用 `table` 屬性提供一個使用者名稱和雜湊密碼的表格。
   * 將摘要函數指派給 `digester` 屬性。
   
   ```kotlin
   val hashedUserTable = UserHashedTableAuth(
       table = mapOf(
           "jetbrains" to digestFunction("foobar"),
           "admin" to digestFunction("password")
       ),
       digester = digestFunction
   )
   ```
   
3. 在 `validate` 函數內部，呼叫 [UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html) 函數來認證使用者，並在憑證有效時返回 `UserIdPrincipal` 的實例：

   ```kotlin
   install(Authentication) {
       basic("auth-basic-hashed") {
           realm = "Access to the '/' path"
           validate { credentials ->
               hashedUserTable.authenticate(credentials)
           }
       }
   }
   ```