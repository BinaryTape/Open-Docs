[//]: # (title: JSON Web 權杖)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

<link-summary>
%plugin_name% 插件允許您使用 JSON Web 權杖驗證客戶端。
</link-summary>

[JSON Web 權杖 (JWT)](https://jwt.io/) 是一個開放標準，它定義了一種將資訊以 JSON 物件形式在各方之間安全傳輸的方式。由於這些資訊是使用共享密鑰（透過 `HS256` 演算法）或公開/私有金鑰對（例如 `RS256`）簽署的，因此可以被驗證和信任。

Ktor 處理在 `Authorization` 標頭中以 `Bearer` 模式傳遞的 JWT，並允許您：
* 驗證 JSON Web 權杖的簽名；
* 對 JWT 酬載執行額外驗證。

> 您可以在 [](server-auth.md) 章節中取得有關 Ktor 中身份驗證和授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `JWT` 身份驗證，您需要在建置腳本中包含 `ktor-server-auth` 和 `ktor-server-auth-jwt` 構件：

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

## JWT 授權流程 {id="flow"}
Ktor 中的 JWT 授權流程可能如下所示：
1. 客戶端向伺服器應用程式中的特定身份驗證 [路由](server-routing.md) 發出帶有憑證的 `POST` 請求。以下範例顯示了一個 [HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其中憑證以 JSON 格式傳遞：
   [object Promise]
2. 如果憑證有效，伺服器會生成一個 JSON Web 權杖並使用指定演算法對其進行簽署。例如，這可能是使用特定共享密鑰的 `HS256` 或使用公開/私有金鑰對的 `RS256`。
3. 伺服器將生成的 JWT 發送給客戶端。
4. 客戶端現在可以使用在 `Authorization` 標頭中以 `Bearer` 模式傳遞的 JSON Web 權杖，向受保護的資源發出請求。
   [object Promise]
5. 伺服器接收到請求並執行以下驗證：
   * 驗證權杖的簽名。請注意，[驗證方式](#configure-verifier) 取決於用於簽署權杖的演算法。
   * 對 JWT 酬載執行 [額外驗證](#validate-payload)。
6. 驗證後，伺服器會以受保護資源的內容進行回應。

## 安裝 JWT {id="install"}
若要安裝 `jwt` 身份驗證提供者，請在 `install` 區塊內呼叫 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // Configure jwt authentication
    }
}
```
您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證指定路由](#authenticate-route)。

## 設定 JWT {id="configure-jwt"}
在本節中，我們將探討如何在 Ktor 伺服器應用程式中使用 JSON Web 權杖。我們將示範兩種簽署權杖的方法，因為它們需要稍微不同的權杖驗證方式：
* 使用指定共享密鑰的 `HS256`。
* 使用公開/私有金鑰對的 `RS256`。

您可以在此處找到完整的專案：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)、[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步驟 1：設定 JWT 設定 {id="jwt-settings"}

若要設定 JWT 相關設定，您可以在 [設定檔](server-configuration-file.topic) 中建立一個自訂的 `jwt` 群組。例如，`application.conf` 檔案可能如下所示：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

> 請注意，密鑰資訊不應以純文本形式儲存在設定檔中。請考慮使用 [環境變數](server-configuration-file.topic#environment-variables) 來指定這些參數。
>
{type="warning"}

您可以透過以下方式在 [程式碼中存取這些設定](server-configuration-file.topic#read-configuration-in-code)：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 步驟 2：生成權杖 {id="generate"}

若要生成 JSON Web 權杖，您可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。以下程式碼片段展示了如何針對 `HS256` 和 `RS256` 演算法執行此操作：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

1. `post("/login")` 定義一個用於接收 `POST` 請求的身份驗證 [路由](server-routing.md)。
2. `call.receive<User>()` [接收](server-serialization.md#receive_data) 作為 JSON 物件發送的使用者憑證，並將其轉換為 `User` 類別物件。
3. `JWT.create()` 使用指定的 JWT 設定生成權杖，新增一個包含接收到的使用者名稱的自訂聲明，並使用指定演算法簽署權杖：
   * 對於 `HS256`，使用共享密鑰簽署權杖。
   * 對於 `RS256`，使用公開/私有金鑰對。
4. `call.respond` 將權杖以 JSON 物件形式 [發送](server-serialization.md#send_data) 給客戶端。

### 步驟 3：設定 realm {id="realm"}
當存取 [受保護路由](#authenticate-route) 時，`realm` 屬性允許您設定要在 `WWW-Authenticate` 標頭中傳遞的 realm。

[object Promise]

### 步驟 4：設定權杖驗證器 {id="configure-verifier"}

`verifier` 函式允許您驗證權杖格式及其簽名：
* 對於 `HS256`，您需要傳遞一個 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 實例來驗證權杖。
* 對於 `RS256`，您需要傳遞 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定一個 JWKS 端點，用於存取用於驗證權杖的公開金鑰。在我們的案例中，發行者是 `http://0.0.0.0:8080`，因此 JWKS 端點位址將是 `http://0.0.0.0:8080/.well-known/jwks.json`。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### 步驟 5：驗證 JWT 酬載 {id="validate-payload"}

1. `validate` 函式允許您對 JWT 酬載執行額外驗證。檢查 `credential` 參數，該參數代表一個 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 物件並包含 JWT 酬載。在以下範例中，檢查了自訂 `username` 聲明的值。
   [object Promise]
   
   在身份驗證成功的情況下，返回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2. `challenge` 函式允許您設定在身份驗證失敗時發送的回應。
   [object Promise]

### 步驟 6：保護特定資源 {id="authenticate-route"}

設定 `jwt` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式保護應用程式中的特定資源。在身份驗證成功的情況下，您可以在路由處理器內部使用 `call.principal` 函式檢索已驗證的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)，並獲取 JWT 酬載。在以下範例中，檢索了自訂 `username` 聲明的值和權杖過期時間。

[object Promise]