[//]: # (title: Ktor 伺服器中的基本驗證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要的相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不額外執行環境或虛擬機器下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

基本驗證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制和驗證。在此方案中，使用者憑證會以 Base64 編碼的使用者名稱/密碼對形式傳輸。

Ktor 允許您使用基本驗證來登入使用者並保護特定的 [路由](server-routing.md)。您可以在 [](server-auth.md) 章節中獲取有關 Ktor 中驗證的一般資訊。

> 鑑於基本驗證會以明文形式傳輸使用者名稱和密碼，您需要使用 [HTTPS/TLS](server-ssl.md) 來保護敏感資訊。

## 新增相依性 {id="add_dependencies"}
要啟用 `basic` 驗證，您需要在建置腳本中包含 `%artifact_name%` artifact：

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
    

## 基本驗證流程 {id="flow"}

基本驗證流程如下所示：

1. 用戶端向伺服器應用程式中的特定 [路由](server-routing.md) 發出不帶有 `Authorization` 標頭的請求。
2. 伺服器以 `401` (Unauthorized) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭來提供資訊，表明基本驗證方案用於保護路由。典型的 `WWW-Authenticate` 標頭如下所示：
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   在 Ktor 中，您可以在 [設定](#configure-provider) `basic` 驗證提供者時，使用對應的屬性來指定 realm 和 charset。

3. 通常，用戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，用戶端會發出一個帶有 `Authorization` 標頭的請求，其中包含使用 Base64 編碼的使用者名稱和密碼對，例如：
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器 [驗證](#configure-provider) 用戶端發送的憑證，並以請求的內容回應。

## 安裝基本驗證 {id="install"}
要安裝 `basic` 驗證提供者，請在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函式：

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

您可以選擇指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證指定的路由](#authenticate-route)。

## 設定基本驗證 {id="configure"}

要大致了解如何在 Ktor 中設定不同的驗證提供者，請參閱 [](server-auth.md#configure)。在本節中，我們將探討 `basic` 驗證提供者的具體設定。

### 步驟 1：設定基本提供者 {id="configure-provider"}

`basic` 驗證提供者透過 [BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
* `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的 realm。
* `validate` 函式驗證使用者名稱和密碼。

[object Promise]
   
`validate` 函式會檢查 `UserPasswordCredential`，並在成功驗證的情況下傳回 `UserIdPrincipal`，如果驗證失敗則傳回 `null`。
> 您也可以使用 [UserHashedTableAuth](#validate-user-hash) 來驗證儲存在記憶體內表格中的使用者，該表格會儲存使用者名稱和密碼雜湊。

### 步驟 2：保護特定資源 {id="authenticate-route"}

設定 `basic` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式來保護我們應用程式中的特定資源。在成功驗證的情況下，您可以在路由處理器內部使用 `call.principal` 函式擷取已驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已驗證使用者的名稱。

[object Promise]

## 使用 UserHashedTableAuth 進行驗證 {id="validate-user-hash"}

Ktor 允許您使用 [UserHashedTableAuth](#validate-user-hash) 來 [驗證](#configure-provider) 儲存在記憶體內表格中的使用者，該表格會儲存使用者名稱和密碼雜湊。這可以確保即使您的資料來源洩露，也不會洩露使用者密碼。

要使用 `UserHashedTableAuth` 驗證使用者，請遵循以下步驟：

1. 使用 [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html) 函式建立一個指定演算法和鹽值提供者的摘要函式：
   
   [object Promise]

2. 初始化 `UserHashedTableAuth` 的新實例並指定以下屬性：
   * 使用 `table` 屬性提供一個使用者名稱和雜湊密碼的表格。
   * 將摘要函式指派給 `digester` 屬性。
   
   [object Promise]
   
3. 在 `validate` 函式內部，呼叫 [UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html) 函式來驗證使用者，如果憑證有效則傳回 `UserIdPrincipal` 的實例：

   [object Promise]