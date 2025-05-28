[//]: # (title: Ktor 伺服器中的 Bearer 驗證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

Bearer 驗證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的一部分，用於存取控制與驗證。此方案涉及稱為 Bearer 權杖的安全性權杖。Bearer 驗證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以提供自訂邏輯來授權 Bearer 權杖。

您可以在 [](server-auth.md) 章節中取得有關 Ktor 中驗證的一般資訊。

> Bearer 驗證應僅在 [HTTPS/TLS](server-ssl.md) 上使用。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `bearer` 驗證，您需要在建置指令碼中包含 `%artifact_name%` 構件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## Bearer 驗證流程 {id="flow"}

一般而言，Bearer 驗證流程可能如下所示：

1.  使用者成功驗證並授權存取後，伺服器會將存取權杖回傳給用戶端。
2.  用戶端可以使用 `Bearer` 方案，將權杖透過 `Authorization` 標頭傳遞，向受保護資源發出請求。
    ```HTTP
    ```
    {src="snippets/auth-bearer/get.http"}
3.  伺服器收到請求並[驗證](#configure)權杖。
4.  驗證後，伺服器會回傳受保護資源的內容。

## 安裝 Bearer 驗證 {id="install"}
若要安裝 `bearer` 驗證提供者，請在 `install` 區塊內呼叫 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於[驗證指定路由](#authenticate-route)。

## 設定 Bearer 驗證 {id="configure"}

若要了解如何在 Ktor 中設定不同的驗證提供者，請參閱 [](server-auth.md#configure)。在本節中，我們將探討 `bearer` 驗證提供者的具體設定。

### 步驟 1：設定 Bearer 提供者 {id="configure-provider"}

`bearer` 驗證提供者透過 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 類別公開其設定。在以下範例中，指定了以下設定：
*   `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的領域。
*   `authenticate` 函式檢查用戶端傳送的權杖，並在驗證成功時回傳 `UserIdPrincipal`，或在驗證失敗時回傳 `null`。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="9-20"}

### 步驟 2：保護特定資源 {id="authenticate-route"}

設定 `bearer` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式來保護應用程式中的特定資源。在驗證成功的情況下，您可以在路由處理器內部使用 `call.principal` 函式擷取經過驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得經過驗證的使用者名稱。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="21-27"}