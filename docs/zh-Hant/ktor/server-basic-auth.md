[//]: # (title: Ktor Server 中的基本認證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

基本認證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制與認證。在此方案中，使用者憑證會以使用 Base64 編碼的使用者名稱/密碼對形式傳輸。

Ktor 允許您使用基本認證來登入使用者並保護特定的 [路由](server-routing.md)。您可以在 [](server-auth.md) 章節中取得有關 Ktor 中認證的一般資訊。

> 鑑於基本認證會以明文形式傳遞使用者名稱和密碼，您需要使用 [HTTPS/TLS](server-ssl.md) 來保護敏感資訊。

## 新增相依性 {id="add_dependencies"}
若要啟用 `basic` 認證，您需要將 `%artifact_name%` 構件納入建置腳本中：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 基本認證流程 {id="flow"}

基本認證流程如下所示：

1. 用戶端向伺服器應用程式中的特定 [路由](server-routing.md) 發出不帶 `Authorization` 標頭的請求。
2. 伺服器以 `401` (未經授權) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭來提供資訊，說明該路由受到基本認證方案的保護。典型的 `WWW-Authenticate` 標頭如下所示：
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   在 Ktor 中，您可以在 [配置](#configure-provider) `basic` 認證提供者時，使用相應的屬性來指定 realm 和 charset。

3. 通常，用戶端會顯示一個登入對話框，供使用者輸入憑證。然後，用戶端發出一個包含使用 Base64 編碼的使用者名稱和密碼對的 `Authorization` 標頭的請求，例如：
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器 [驗證](#configure-provider) 用戶端發送的憑證，並以請求的內容回應。

## 安裝基本認證 {id="install"}
若要安裝 `basic` 認證提供者，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函數：

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

您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證指定的路由](#authenticate-route)。

## 配置基本認證 {id="configure"}

要了解如何在 Ktor 中配置不同的認證提供者，請參閱 [](server-auth.md#configure)。在本節中，我們將介紹 `basic` 認證提供者的具體配置。 

### 步驟 1：配置基本提供者 {id="configure-provider"}

`basic` 認證提供者透過 [BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
* `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的 realm。
* `validate` 函數驗證使用者名稱和密碼。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}
   
`validate` 函數會檢查 `UserPasswordCredential`，並在成功認證時返回 `UserIdPrincipal`，或在認證失敗時返回 `null`。 
> 您也可以使用 [UserHashedTableAuth](#validate-user-hash) 來驗證儲存在記憶體內表格中的使用者，該表格保存使用者名稱和密碼雜湊。

### 步驟 2：保護特定資源 {id="authenticate-route"}

配置 `basic` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數來保護應用程式中的特定資源。在成功認證的情況下，您可以使用 `call.principal` 函數在路由處理器中檢索已認證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已認證使用者的名稱。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

## 使用 UserHashedTableAuth 驗證 {id="validate-user-hash"}

Ktor 允許您使用 [UserHashedTableAuth](#validate-user-hash) 來 [驗證](#configure-provider) 儲存在記憶體內表格中的使用者，該表格保存使用者名稱和密碼雜湊。這可以防止您的資料來源外洩時使用者密碼被洩露。

若要使用 `UserHashedTableAuth` 來驗證使用者，請遵循以下步驟：

1. 使用 [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html) 函數，以指定的演算法和鹽值提供者建立摘要函數：
   
   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="9"}

2. 初始化 `UserHashedTableAuth` 的新實例，並指定以下屬性：
   * 使用 `table` 屬性提供使用者名稱和雜湊密碼的表格。
   * 將摘要函數分配給 `digester` 屬性。
   
   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}
   
3. 在 `validate` 函數內部，呼叫 [UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html) 函數來認證使用者，如果憑證有效，則返回 `UserIdPrincipal` 的實例：

   ```kotlin
   ```
   {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="19-26"}