[//]: # (title: Ktor 伺服器中的摘要認證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要依賴</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外執行環境或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>：✖️
    </p>
    
</tldr>

摘要認證方案 (Digest authentication scheme) 是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制與認證。在此方案中，雜湊函式會在使用者名稱和密碼傳送至網路前應用於其上。

Ktor 允許您使用摘要認證來登入使用者並保護特定的 [路由](server-routing.md)。您可以在 [](server-auth.md) 部分中取得 Ktor 中關於認證的一般資訊。

## 新增依賴 {id="add_dependencies"}
為了啟用 `digest` 認證，您需要在建置腳本中包含 `%artifact_name%` 套件：

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
    

## 摘要認證流程 {id="flow"}

摘要認證流程如下所示：

1.  用戶端在伺服器應用程式中，向特定 [路由](server-routing.md) 發出沒有 `Authorization` 標頭的請求。
2.  伺服器回應用戶端 `401` (未授權) 回應狀態，並使用 `WWW-Authenticate` 回應標頭提供資訊，指出摘要認證方案用於保護路由。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   在 Ktor 中，您可以在 [設定](#configure-provider) `digest` 認證提供者時，指定領域 (realm) 和產生 nonce 值的方式。

3.  通常用戶端會顯示登入對話框，讓使用者輸入憑證。然後，用戶端發出帶有以下 `Authorization` 標頭的請求：

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 值是透過以下方式產生：
   
   a. `HA1 = MD5(username:realm:password)`
   > 這部分儲存在伺服器上，Ktor 可用於驗證使用者憑證。
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

4.  伺服器 [驗證](#configure-provider) 用戶端傳送的憑證，並回應請求的內容。

## 安裝摘要認證 {id="install"}
為了安裝 `digest` 認證提供者，請在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // Configure digest authentication
    }
}
```
您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證特定路由](#authenticate-route)。

## 設定摘要認證 {id="configure"}

為了大致了解如何在 Ktor 中設定不同的認證提供者，請參閱 [](server-auth.md#configure)。在本節中，我們將探討 `digest` 認證提供者的具體設定。

### 步驟 1：提供一個包含摘要的使用者表格 {id="digest-table"}

`digest` 認證提供者使用摘要訊息的 `HA1` 部分驗證使用者憑證。因此，您可以提供一個使用者表格，其中包含使用者名稱和對應的 `HA1` 雜湊值。在下面的範例中，`getMd5Digest` 函式用於產生 `HA1` 雜湊值：

[object Promise]

### 步驟 2：設定摘要提供者 {id="configure-provider"}

`digest` 認證提供者透過 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
*   `realm` 屬性設定了將在 `WWW-Authenticate` 標頭中傳遞的領域。
*   `digestProvider` 函式擷取針對指定使用者名稱的摘要 `HA1` 部分。
*   (可選) `validate` 函式允許您將憑證對應到自訂的 Principal。

[object Promise]

您也可以使用 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 屬性來指定如何產生 nonce 值。

### 步驟 3：保護特定資源 {id="authenticate-route"}

設定 `digest` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式保護應用程式中的特定資源。在成功認證的情況下，您可以在路由處理器內部使用 `call.principal` 函式擷取已認證的 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)，並取得已認證使用者的名稱。

[object Promise]