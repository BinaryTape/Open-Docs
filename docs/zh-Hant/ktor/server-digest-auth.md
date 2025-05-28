[//]: # (title: Ktor 伺服器中的摘要驗證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

摘要驗證 (Digest authentication) 方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制和驗證。在此方案中，在透過網路傳送使用者名稱和密碼之前，會對它們應用雜湊函式。

Ktor 允許您使用摘要驗證來登入使用者並保護特定的[路由](server-routing.md)。您可以在 [](server-auth.md) 部分中取得 Ktor 中有關驗證的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `digest` 驗證，您需要在建置腳本中包含 `%artifact_name%` 構件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 摘要驗證流程 {id="flow"}

摘要驗證流程如下所示：

1.  用戶端向伺服器應用程式中的特定[路由](server-routing.md)發出不帶 `Authorization` 標頭的請求。
2.  伺服器以 `401` (Unauthorized) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭提供資訊，指出使用摘要驗證方案來保護路由。典型的 `WWW-Authenticate` 標頭如下所示：

    ```
    WWW-Authenticate: Digest
            realm="Access to the '/' path",
            nonce="e4549c0548886bc2",
            algorithm="MD5"
    ```
    {style="block"}

    在 Ktor 中，您可以在[配置](#configure-provider) `digest` 驗證提供者時指定領域 (realm) 和產生 nonce 值的方式。

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

    `response` 值透過以下方式產生：
    
    a. `HA1 = MD5(username:realm:password)`
    > 這部分[儲存](#digest-table)在伺服器上，可供 Ktor 用於驗證使用者憑證。
    
    b. `HA2 = MD5(method:digestURI)`
    
    c. `response = MD5(HA1:nonce:HA2)`

4.  伺服器[驗證](#configure-provider)用戶端傳送的憑證，並回應所請求的內容。

## 安裝摘要驗證 {id="install"}
若要安裝 `digest` 驗證提供者，請在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 函式：

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
您可以選擇性地指定一個[提供者名稱](server-auth.md#provider-name)，該名稱可用於[驗證指定的路由](#authenticate-route)。

## 配置摘要驗證 {id="configure"}

若要了解如何在 Ktor 中配置不同的驗證提供者，請參閱 [](server-auth.md#configure)。在本節中，我們將探討 `digest` 驗證提供者的特定配置。

### 步驟 1：提供包含摘要的使用者表 {id="digest-table"}

`digest` 驗證提供者使用摘要訊息的 `HA1` 部分來驗證使用者憑證。因此，您可以提供一個包含使用者名稱和相應 `HA1` 雜湊的使用者表。在下面的範例中，`getMd5Digest` 函式用於產生 `HA1` 雜湊：

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="10-16"}

### 步驟 2：配置摘要提供者 {id="configure-provider"}

`digest` 驗證提供者透過 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
*   `realm` 屬性設定要傳遞到 `WWW-Authenticate` 標頭中的領域。
*   `digestProvider` 函式擷取指定使用者名稱的 `HA1` 部分。
*   （可選）`validate` 函式允許您將憑證映射到自訂 Principal。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="18-33,41-43"}

您還可以使用 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 屬性來指定如何產生 nonce 值。

### 步驟 3：保護特定資源 {id="authenticate-route"}

配置 `digest` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式來保護應用程式中的特定資源。在驗證成功的情況下，您可以在路由處理器內部使用 `call.principal` 函式擷取已驗證的 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)，並取得已驗證使用者的名稱。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="34-40"}