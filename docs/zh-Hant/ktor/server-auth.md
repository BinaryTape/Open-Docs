[//]: # (title: Ktor 伺服器中的認證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需相依性</b>：<code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
Authentication 外掛程式處理 Ktor 中的認證與授權。
</link-summary>

Ktor 提供
[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)
外掛程式來處理認證與授權。典型的使用情境包括登入使用者、授予對特定資源的存取權限以及在各方之間安全地傳輸資訊。您也可以將 `Authentication`
與 [Sessions](server-sessions.md) 搭配使用，以在請求之間保留使用者的資訊。

> 在客戶端，Ktor 提供 [Authentication](client-auth.md) 外掛程式來處理認證與授權。

## 支援的認證類型 {id="supported"}
Ktor 支援以下認證與授權方案：

### HTTP 認證 {id="http-auth"}
HTTP 提供了一個用於存取控制與認證的[通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)。在 Ktor 中，您可以使用以下 HTTP 認證方案：
* [Basic](server-basic-auth.md) - 使用 `Base64` 編碼提供使用者名稱與密碼。如果未與 HTTPS 結合使用，通常不建議。
* [Digest](server-digest-auth.md) - 一種認證方法，透過對使用者名稱和密碼應用雜湊函數，以加密形式傳輸使用者憑證。
* [Bearer](server-bearer-auth.md) - 一種涉及稱為 Bearer token 的安全令牌的認證方案。
  Bearer 認證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以提供自訂邏輯來授權 Bearer token。

### 基於表單的認證 {id="form-auth"}
[基於表單的](server-form-based-auth.md)認證使用[網路表單](https://developer.mozilla.org/en-US/docs/Learn/Forms)來收集憑證資訊並驗證使用者。

### JSON Web Token (JWT) {id="jwt"}
[JSON Web Token](server-jwt.md) 是一種用於在各方之間安全傳輸資訊的開放標準，以 JSON 物件形式呈現。您可以將 JSON Web Token 用於授權：當使用者登入後，每個請求都將包含一個 token，允許使用者存取該 token 允許的資源。在 Ktor 中，您可以使用 `jwt` 認證來驗證 token 並驗證其中包含的 claims。

### LDAP {id="ldap"}
[LDAP](server-ldap.md) 是一種開放且跨平台的協議，用於目錄服務認證。Ktor 提供 [ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html) 函數，用於根據指定的 LDAP 伺服器驗證使用者憑證。

### OAuth {id="oauth"}
[OAuth](server-oauth.md) 是一種用於保護 API 存取的開放標準。Ktor 中的 `oauth` 供應器允許您使用 Google、Facebook、Twitter 等外部供應器來實作認證。

### 會話 {id="sessions"}
[會話](server-sessions.md) 提供一種機制，用於在不同 HTTP 請求之間持久化資料。典型的使用情境包括儲存已登入使用者的 ID、購物籃的內容或在客戶端保留使用者偏好設定。在 Ktor 中，已具有關聯會話的使用者可以使用 `session` 供應器進行認證。從 [Ktor 伺服器中的會話認證](server-session-auth.md)了解如何執行此操作。

### 自訂 {id="custom"}
Ktor 還提供一個用於建立[自訂外掛程式](server-custom-plugins.md)的 API，可用於實作您自己的外掛程式來處理認證與授權。
例如，`AuthenticationChecked` [鉤點](server-custom-plugins.md#call-handling) 在認證憑證檢查後執行，它允許您實作授權：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 新增相依性 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
</p>
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

請注意，某些認證供應器，例如 [JWT](server-jwt.md) 和 [LDAP](server-ldap.md)，需要額外的 artifact。

## 安裝 Authentication {id="install"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
    請在指定的<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中將其傳遞給 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的擴展函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 設定 Authentication {id="configure"}
在[安裝 Authentication](#install) 之後，您可以如下設定和使用 `Authentication`：

### 步驟 1：選擇認證供應器 {id="choose-provider"}

若要使用特定的認證
供應器，例如 [basic](server-basic-auth.md)、[digest](server-digest-auth.md) 或 [form](server-form-based-auth.md)，
您需要在 `install` 區塊內呼叫對應的函數。例如，要使用基本認證，
請呼叫 [
`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
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

在此函數內部，您可以[設定](#configure-provider)此供應器特有的設定。

### 步驟 2：指定供應器名稱 {id="provider-name"}

[使用特定供應器](#choose-provider)的函數允許您選擇性地指定供應器名稱。下面的程式碼範例分別使用 `"auth-basic"` 和 `"auth-form"` 名稱安裝
[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
和 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 供應器：

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

這些名稱稍後可用於使用不同供應器[驗證不同的路由](#authenticate-route)。
> 請注意，供應器名稱應該是唯一的，並且您只能定義一個沒有名稱的供應器。
>
{style="note"}

### 步驟 3：設定供應器 {id="configure-provider"}

每個[供應器類型](#choose-provider)都有其自己的設定。例如，
[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)
類別為
[`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)
函數提供了選項。此類別中的關鍵函數是 [`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)，
它負責驗證使用者名稱和密碼。以下程式碼範例展示了其用法：

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

為了理解 `validate()` 函數如何運作，我們需要介紹兩個術語：

* _主體_ 是一個可以被認證的實體：使用者、電腦、服務等。在 Ktor 中，各種
  認證供應器可能會使用不同的主體。例如，`basic`、`digest` 和 `form` 供應器
  認證 [`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，
  而 `jwt` 供應器
  驗證 [`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
  > 您也可以建立自訂主體。這在以下情況中可能很有用：
  > - 將憑證映射到自訂主體允許您在[路由處理器](#get-principal)內部擁有關於已認證主體的額外資訊。
  > - 如果您使用[會話認證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
* _憑證_ 是一組用於伺服器認證主體的屬性：使用者/密碼對、API 金鑰等等。例如，`basic` 和 `form` 供應器
  使用 [
  `UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)
  來驗證使用者名稱和密碼，而 `jwt`
  驗證 [
  `JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)。

因此，`validate()` 函數檢查指定的憑證，並在認證成功時傳回一個 `Any` 主體，如果認證失敗則傳回 `null`。

> 若要根據特定條件跳過認證，
> 請使用 [`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)。
> 例如，如果[會話](server-sessions.md)已存在，您可以跳過 `basic` 認證：
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### 步驟 4：保護特定資源 {id="authenticate-route"}

最後一步是保護應用程式中的特定資源。您可以使用
[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)
函數來完成此操作。此函數接受兩個可選參數：

- 用於認證巢狀路由的[供應器名稱](#provider-name)。
  以下程式碼片段使用名為 _auth-basic_ 的供應器來保護 `/login` 和 `/orders` 路由：
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
- 用於解析巢狀認證供應器的策略。
  此策略由
  [`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)
  列舉值表示。

  例如，客戶端應為所有使用 `AuthenticationStrategy.Required` 策略註冊的供應器提供認證資料。
  在以下程式碼片段中，只有通過[會話認證](server-session-auth.md)的使用者
  才能嘗試使用基本認證存取 `/admin` 路由：
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

> 有關完整範例，請參閱
> [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)。

### 步驟 5：在路由處理器內部取得主體 {id="get-principal"}

認證成功後，您可以使用 `call.principal()` 函數在路由處理器內部檢索已認證的主體。此函數接受由
[已設定的認證供應器](#configure-provider)傳回的特定主體類型。在以下範例中，
`call.principal()` 用於取得 `UserIdPrincipal` 並獲取已認證使用者的名稱。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

如果您使用[會話認證](server-session-auth.md)，主體可能是一個儲存會話資料的資料類別。
因此，您需要將此資料類別傳遞給 `call.principal()`：

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
    }
}
```

在[巢狀認證供應器](#authenticate-route)的情況下，
您可以將[供應器名稱](#provider-name)傳遞給 `call.principal()` 以取得所需供應器的主體。

在下面的範例中，將 `"auth-session"` 值傳遞給 `call.principal()` 以取得最上層會話供應器的主體：

```kotlin
authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
    authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
        get("/admin") {
            val userSession = call.principal<UserSession>("auth-session")
        }
    }
}
```