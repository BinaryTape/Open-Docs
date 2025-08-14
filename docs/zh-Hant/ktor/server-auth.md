[//]: # (title: Ktor 伺服器中的身份驗證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 外掛程式處理 Ktor 中的身份驗證與授權。
</link-summary>

Ktor 提供了
[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)
外掛程式來處理身份驗證與授權。典型的使用情境包括使用者登入、授予特定資源的存取權限，以及在各方之間安全地傳輸資訊。您也可以將 `Authentication`
與 [Sessions](server-sessions.md) 結合使用，以在請求之間保留使用者的資訊。

> 在客戶端，Ktor 提供了 [Authentication](client-auth.md) 外掛程式來處理身份驗證與授權。

## 支援的身份驗證類型 {id="supported"}
Ktor 支援以下身份驗證與授權方案：

### HTTP 身份驗證 {id="http-auth"}
HTTP 提供了一個 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用於存取控制與身份驗證。在 Ktor 中，您可以使用以下 HTTP 身份驗證方案：
* [Basic](server-basic-auth.md) - 使用 `Base64` 編碼提供使用者名稱和密碼。如果未與 HTTPS 結合使用，通常不建議使用。
* [Digest](server-digest-auth.md) - 一種身份驗證方法，透過將雜湊函數應用於使用者名稱和密碼，以加密形式傳輸使用者憑證。
* [Bearer](server-bearer-auth.md) - 一種涉及稱為承載者令牌（bearer tokens）安全令牌的身份驗證方案。
  承載者身份驗證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以為承載者令牌的授權提供自訂邏輯。

### 基於表單的身份驗證 {id="form-auth"}
[基於表單](server-form-based-auth.md) 的身份驗證使用 [網路表單](https://developer.mozilla.org/en-US/docs/Learn/Forms) 來收集憑證資訊並驗證使用者。

### JSON Web 令牌 (JWT) {id="jwt"}
[JSON Web 令牌](server-jwt.md) 是一個開放標準，用於在各方之間以 JSON 物件形式安全地傳輸資訊。您可以將 JSON Web 令牌用於授權：當使用者登入後，每個請求都將包含一個令牌，允許使用者存取該令牌允許的資源。在 Ktor 中，您可以使用 `jwt` 身份驗證來驗證令牌並驗證其中包含的聲明。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一個開放且跨平台的協定，用於目錄服務身份驗證。Ktor 提供了 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函數，用於針對指定的 LDAP 伺服器驗證使用者憑證。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一個保護 API 存取的開放標準。Ktor 中的 `oauth` 提供者允許您使用外部提供者（例如 Google、Facebook、Twitter 等）實作身份驗證。

### 會話 {id="sessions"}
[會話](server-sessions.md) 提供了一種在不同 HTTP 請求之間持久化資料的機制。典型的用例包括儲存已登入使用者的 ID、購物車內容，或在客戶端保留使用者偏好設定。在 Ktor 中，已具有關聯會話的使用者可以使用 `session` 提供者進行身份驗證。從 [](server-session-auth.md) 了解如何執行此操作。

### 自訂 {id="custom"}
Ktor 還提供了用於建立 [自訂外掛程式](server-custom-plugins.md) 的 API，可用於實作您自己的外掛程式來處理身份驗證與授權。
例如，`AuthenticationChecked` [鉤子](server-custom-plugins.md#call-handling) 在身份驗證憑證檢查後執行，它允許您實作授權：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
    </p>

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

請注意，某些身份驗證提供者，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要額外的構件。

## 安裝 Authentication {id="install"}

    <p>
        要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
        請在指定的<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的一個擴展函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>

## 配置 Authentication {id="configure"}
[安裝 Authentication](#install) 後，您可以按如下方式配置和使用 `Authentication`：

### 步驟 1：選擇身份驗證提供者 {id="choose-provider"}

要使用特定的身份驗證提供者，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，
您需要在 `install` 區塊內呼叫對應的函數。例如，要使用基本身份驗證，
請呼叫 [`basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函數：

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

在此函數內部，您可以 [配置](#configure-provider) 此提供者特定的設定。

### 步驟 2：指定提供者名稱 {id="provider-name"}

[使用特定提供者](#choose-provider) 的函數可選擇允許您指定提供者名稱。以下程式碼範例
分別安裝了 [basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
和 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 提供者，
名稱為 `"auth-basic"` 和 `"auth-form"`：

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // Configure basic authentication
    }
    form("auth-form") {
        // Configure form authentication
    }
    // ...
}
```
{disable-links="false"}

這些名稱稍後可用於使用不同的提供者 [驗證不同的路由](#authenticate-route)。
> 請注意，提供者名稱應該是唯一的，並且您只能定義一個沒有名稱的提供者。
>
{style="note"}

### 步驟 3：配置提供者 {id="configure-provider"}

每種 [提供者類型](#choose-provider) 都有自己的配置。例如，
[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)
類別為 [`basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函數提供了選項。此類別中的關鍵函數是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)
，它負責驗證使用者名稱和密碼。以下程式碼範例演示了其用法：

[object Promise]

要理解 `validate()` 函數的工作原理，我們需要引入兩個術語：

*   _主體 (principal)_ 是一個可以被驗證的實體：使用者、電腦、服務等。在 Ktor 中，各種
    身份驗證提供者可能會使用不同的主體。例如，`basic`、`digest` 和 `form` 提供者
    驗證 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，
    而 `jwt` 提供者
    驗證 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
    > 您也可以建立自訂主體。這在以下情況下可能有用：
    > - 將憑證映射到自訂主體允許您在 [路由處理器](#get-principal) 內部擁有關於已驗證主體的額外資訊。
    > - 如果您使用 [會話身份驗證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
*   _憑證 (credential)_ 是伺服器用於驗證主體的一組屬性：使用者/密碼對、API 金鑰等等。例如，`basic` 和 `form` 提供者
    使用 [
    `UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)
    來驗證使用者名稱和密碼，而 `jwt`
    驗證 [
    `JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函數檢查指定的憑證，並在身份驗證成功的情況下返回一個 `Any` 主體，如果身份驗證失敗則返回 `null`。

> 要根據特定條件跳過身份驗證，
> 請使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。
> 例如，如果 [會話](server-sessions.md) 已存在，您可以跳過 `basic` 身份驗證：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 步驟 4：保護特定資源 {id="authenticate-route"}

最後一步是保護應用程式中的特定資源。您可以使用
[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)
函數來執行此操作。此函數接受兩個可選參數：

-   用於驗證巢狀路由的 [提供者名稱](#provider-name)。
    以下程式碼片段使用名為 _auth-basic_ 的提供者來保護 `/login` 和 `/orders` 路由：
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
-   用於解析巢狀身份驗證提供者的策略。
    此策略由 [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)
    列舉值表示。

    例如，客戶端應為所有使用 `AuthenticationStrategy.Required` 策略註冊的提供者提供身份驗證資料。
    在以下程式碼片段中，只有通過 [會話身份驗證](server-session-auth.md) 的使用者才能嘗試使用基本身份驗證存取 `/admin` 路由：
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

> 完整的範例請參閱
> [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步驟 5：在路由處理器中獲取主體 {id="get-principal"}

身份驗證成功後，您可以使用 `call.principal()` 函數在路由處理器中檢索已驗證的主體。此函數接受
由 [配置的身份驗證提供者](#configure-provider) 返回的特定主體類型。在以下範例中，
`call.principal()` 用於獲取 `UserIdPrincipal` 並獲取已驗證使用者的名稱。

[object Promise]

如果您使用 [會話身份驗證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
因此，您需要將此資料類別傳遞給 `call.principal()`：

[object Promise]

在 [巢狀身份驗證提供者](#authenticate-route) 的情況下，
您可以將 [提供者名稱](#provider-name) 傳遞給 `call.principal()` 以獲取所需提供者的主體。

在以下範例中，`"auth-session"` 值被傳遞以獲取最頂層會話提供者的主體：

[object Promise]