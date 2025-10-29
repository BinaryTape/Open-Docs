[//]: # (title: Ktor 伺服器中的摘要認證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

摘要認證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制和認證。在此方案中，使用者名稱和密碼在透過網路傳送之前會應用雜湊函式。

Ktor 允許您使用摘要認證來登入使用者並保護特定的 [路由](server-routing.md)。您可以在 [Ktor 伺服器中的認證和授權](server-auth.md) 部分中取得 Ktor 中認證的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `digest` 認證，您需要在建置腳本中包含 `%artifact_name%` 構件：

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

## 摘要認證流程 {id="flow"}

摘要認證流程如下所示：

1.  客戶端向伺服器應用程式中的特定 [路由](server-routing.md) 發出沒有 `Authorization` 標頭的請求。
2.  伺服器回應客戶端 `401` (Unauthorized) 回應狀態，並使用 `WWW-Authenticate` 回應標頭提供資訊，說明使用摘要認證方案來保護路由。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   在 Ktor 中，您可以在[配置](#configure-provider) `digest` 認證提供者時指定領域 (realm) 和生成一次性隨機數 (nonce) 的方式。

3.  通常客戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，客戶端發出帶有以下 `Authorization` 標頭的請求：

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 值透過以下方式生成：
   
   a. `HA1 = MD5(username:realm:password)`
   > 此部分[儲存](#digest-table)在伺服器上，Ktor 可以使用此部分來驗證使用者憑證。
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

4.  伺服器[驗證](#configure-provider)客戶端傳送的憑證，並回應所請求的內容。

## 安裝摘要認證 {id="install"}
若要安裝 `digest` 認證提供者，請在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/digest.html) 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // 配置摘要認證
    }
}
```
您可以選擇性地指定一個[提供者名稱](server-auth.md#provider-name)，該名稱可用於[認證指定的路由](#authenticate-route)。

## 配置摘要認證 {id="configure"}

若要大致了解如何在 Ktor 中配置不同的認證提供者，請參閱 [配置認證](server-auth.md#configure)。在本節中，我們將了解 `digest` 認證提供者的配置細節。

### 步驟 1：提供包含摘要的使用者表格 {id="digest-table"}

`digest` 認證提供者使用摘要訊息的 `HA1` 部分驗證使用者憑證。因此，您可以提供一個包含使用者名稱和對應 `HA1` 雜湊的使用者表格。在下面的範例中，`getMd5Digest` 函式用於生成 `HA1` 雜湊：

```kotlin
fun getMd5Digest(str: String): ByteArray = MessageDigest.getInstance("MD5").digest(str.toByteArray(UTF_8))

val myRealm = "Access to the '/' path"
val userTable: Map<String, ByteArray> = mapOf(
    "jetbrains" to getMd5Digest("jetbrains:$myRealm:foobar"),
    "admin" to getMd5Digest("admin:$myRealm:password")
)
```

### 步驟 2：配置摘要提供者 {id="configure-provider"}

`digest` 認證提供者透過 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
*   `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的領域。
*   `digestProvider` 函式為指定的使用者名稱提取摘要的 `HA1` 部分。
*   (可選) `validate` 函式允許您將憑證映射到自訂主體。

```kotlin
fun Application.main() {
    install(Authentication) {
        digest("auth-digest") {
            realm = myRealm
            digestProvider { userName, realm ->
                userTable[userName]
            }
            validate { credentials ->
                if (credentials.userName.isNotEmpty()) {
                    CustomPrincipal(credentials.userName, credentials.realm)
                } else {
                    null
                }
            }
        }
    }
}

data class CustomPrincipal(val userName: String, val realm: String)
```

您也可以使用 [nonceManager](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 屬性來指定如何生成一次性隨機數 (nonce) 值。

### 步驟 3：保護特定資源 {id="authenticate-route"}

配置 `digest` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式保護應用程式中的特定資源。如果認證成功，您可以在路由處理器內部使用 `call.principal` 函式擷取已認證的 [Principal](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-principal/index.html) 主體，並取得已認證使用者的名稱。

```kotlin
routing {
    authenticate("auth-digest") {
        get("/") {
            call.respondText("Hello, ${call.principal<CustomPrincipal>()?.userName}!")
        }
    }
}