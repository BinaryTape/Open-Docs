[//]: # (title: Ktor Server 中的身份驗證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 外掛程式在 Ktor 中處理身份驗證和授權。
</link-summary>

Ktor 提供了 [Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html) 外掛程式來處理身份驗證和授權。典型的使用場景包括使用者登入、授予特定資源的存取權限，以及在各方之間安全地傳輸資訊。您也可以將 `Authentication` 與 [Sessions](server-sessions.md) 結合使用，以在請求之間保留使用者的資訊。

> 在客戶端，Ktor 提供了 [Authentication](client-auth.md) 外掛程式來處理身份驗證和授權。

## 支援的身份驗證類型 {id="supported"}
Ktor 支援以下身份驗證和授權方案：

### HTTP 身份驗證 {id="http-auth"}
HTTP 提供了一個 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用於存取控制和身份驗證。在 Ktor 中，您可以使用以下 HTTP 身份驗證方案：
* [Basic](server-basic-auth.md) - 使用 `Base64` 編碼來提供使用者名稱和密碼。如果沒有與 HTTPS 結合使用，通常不建議使用。
* [Digest](server-digest-auth.md) - 一種透過對使用者名稱和密碼應用雜湊函數來以加密形式通訊使用者憑證的身份驗證方法。
* [Bearer](server-bearer-auth.md) - 一種涉及稱為 Bearer 權杖（bearer tokens）的安全性權杖（security tokens）的身份驗證方案。
  Bearer 身份驗證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以提供自訂邏輯來授權 Bearer 權杖。

### 基於表單的身份驗證 {id="form-auth"}
[基於表單的](server-form-based-auth.md) 身份驗證使用 [網路表單](https://developer.mozilla.org/en-US/docs/Learn/Forms) 來收集憑證資訊並驗證使用者。

### JSON Web 權杖 (JWT) {id="jwt"}
[JSON Web Token](server-jwt.md) 是一種開放標準，用於在各方之間以 JSON 物件的形式安全傳輸資訊。您可以將 JSON Web 權杖用於授權：當使用者登入時，每個請求都將包含一個權杖，允許使用者存取該權杖所允許的資源。在 Ktor 中，您可以使用 `jwt` 身份驗證來驗證權杖並驗證其中包含的聲明 (claims)。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一種開放且跨平台的協定，用於目錄服務身份驗證。Ktor 提供了 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函數，用於針對指定的 LDAP 伺服器驗證使用者憑證。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一種保護 API 存取的開放標準。Ktor 中的 `oauth` 供應商允許您使用外部供應商（如 Google、Facebook、Twitter 等）來實作身份驗證。

### Session {id="sessions"}
[Session](server-sessions.md) 提供了在不同 HTTP 請求之間持久化資料的機制。典型的用例包括儲存登入使用者 ID、購物籃的內容或在客戶端保留使用者偏好設定。在 Ktor 中，已有關聯會話的使用者可以使用 `session` 供應商進行身份驗證。從 [](server-session-auth.md) 了解如何執行此操作。

### 自訂 {id="custom"}
Ktor 還提供了用於建立 [自訂外掛程式](server-custom-plugins.md) 的 API，可用於實作您自己的外掛程式來處理身份驗證和授權。
例如，`AuthenticationChecked` [鉤子](server-custom-plugins.md#call-handling) 在檢查身份驗證憑證後執行，它允許您實作授權：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

請注意，某些身份驗證供應商，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要額外的構件 (artifacts)。

## 安裝 Authentication {id="install"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 Authentication {id="configure"}
[安裝 Authentication](#install) 後，您可以按如下方式配置和使用 `Authentication`：

### 步驟 1：選擇身份驗證供應商 {id="choose-provider"}

要使用特定的身份驗證供應商，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，您需要在 `install` 區塊內呼叫對應的函數。例如，要使用基本身份驗證，請呼叫 [`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
}
```

在此函數內部，您可以 [配置](#configure-provider) 此供應商特有的設定。

### 步驟 2：指定供應商名稱 {id="provider-name"}

[使用特定供應商](#choose-provider) 的函數可選擇地讓您指定供應商名稱。以下程式碼範例分別安裝了名為 `"auth-basic"` 和 `"auth-form"` 的 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 和 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 供應商：

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
    form("auth-form") {
        // [[[Configure form authentication|server-form-based-auth.md]]]
    }
    // ...
}
```
{disable-links="false"}

這些名稱稍後可用於使用不同的供應商 [驗證不同的路由](#authenticate-route)。
> 請注意，供應商名稱應該是唯一的，並且您只能定義一個沒有名稱的供應商。
>
{style="note"}

### 步驟 3：配置供應商 {id="configure-provider"}

每種 [供應商類型](#choose-provider) 都有自己的配置。例如，[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html) 類別為 [`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html) 函數提供了選項。此類別中的關鍵函數是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)，它負責驗證使用者名稱和密碼。以下程式碼範例演示了其用法：

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}

要了解 `validate()` 函數的工作原理，我們需要介紹兩個術語：

* _主體（principal）_ 是可以被身份驗證的實體：使用者、電腦、服務等。在 Ktor 中，各種身份驗證供應商可能會使用不同的主體。例如，`basic`、`digest` 和 `form` 供應商驗證 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，而 `jwt` 供應商驗證 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
  > 您也可以建立自訂主體。這在以下情況中可能有用：
  > - 將憑證映射到自訂主體允許您在 [路由處理器](#get-principal) 內部擁有關於已驗證主體的額外資訊。
  > - 如果您使用 [會話身份驗證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
* _憑證（credential）_ 是一組用於伺服器驗證主體的屬性：使用者/密碼對、API 金鑰等。例如，`basic` 和 `form` 供應商使用 [`UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html) 來驗證使用者名稱和密碼，而 `jwt` 驗證 [`JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函數檢查指定的憑證，並在身份驗證成功時返回一個主體 `Any`，如果身份驗證失敗則返回 `null`。

> 要根據特定條件跳過身份驗證，請使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。
> 例如，如果 [會話](server-sessions.md) 已經存在，您可以跳過 `basic` 身份驗證：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 步驟 4：保護特定資源 {id="authenticate-route"}

最後一步是保護應用程式中的特定資源。您可以透過使用 [`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html) 函數來實現。此函數接受兩個可選參數：

- 用於驗證巢狀路由的 [供應商名稱](#provider-name)。
  以下程式碼片段使用名為 _auth-basic_ 的供應商來保護 `/login` 和 `/orders` 路由：
   ```kotlin
   routing {
       authenticate("auth-basic") {
           get("/login") {
               // ...
           }    
           get("/orders") {
               // ...
           }    
       }
       get("/") {
           // ...
       }
   }
   ```
- 用於解析巢狀身份驗證供應商的策略。
  此策略由 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html) 列舉值表示。

  例如，客戶端應為所有以 `AuthenticationStrategy.Required` 策略註冊的供應商提供身份驗證資料。
  在下面的程式碼片段中，只有通過 [會話身份驗證](server-session-auth.md) 的使用者才能嘗試使用基本身份驗證存取 `/admin` 路由：
   ```kotlin
   routing {
       authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
           get("/hello") {
               // ...
           }    
           authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
               get("/admin") {
                   // ...
               }
           }  
       }
   }
   ```

> 欲查看完整範例，請參閱 [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步驟 5：在路由處理器中取得主體 {id="get-principal"}

成功身份驗證後，您可以使用 `call.principal()` 函數在路由處理器中檢索已驗證的主體。此函數接受由 [配置的身份驗證供應商](#configure-provider) 返回的特定主體類型。在以下範例中，`call.principal()` 用於取得 `UserIdPrincipal` 並取得已驗證使用者的名稱。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

如果您使用 [會話身份驗證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
因此，您需要將此資料類別傳遞給 `call.principal()`：

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-79,82-83"}

在 [巢狀身份驗證供應商](#authenticate-route) 的情況下，您可以將 [供應商名稱](#provider-name) 傳遞給 `call.principal()` 以取得所需供應商的主體。

在下面的範例中，傳遞了 `"auth-session"` 值以取得最上層的會話供應商的主體：

```kotlin
```
{src="snippets/auth-form-session-nested/src/main/kotlin/com/example/Application.kt" include-lines="87,93-95,97-99"}