[//]: # (title: Ktor 伺服器中的表單式驗證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl">auth-form-html-dsl</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session">auth-form-session</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

表單式驗證 (Form-based authentication) 使用 [網頁表單](https://developer.mozilla.org/en-US/docs/Learn/Forms) 來收集憑證資訊並驗證使用者。
要在 Ktor 中建立網頁表單，您可以使用 [HTML DSL](server-html-dsl.md#html_response) 或選擇 JVM [模板引擎](server-templating.md)，例如 FreeMarker、Velocity 等。

> 鑑於使用表單式驗證時，使用者名稱和密碼會以明文傳遞，您需要使用 [HTTPS/TLS](server-ssl.md) 來保護敏感資訊。

## 新增依賴項 {id="add_dependencies"}
要啟用 `form` 驗證，您需要在建置腳本中包含 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 表單式驗證流程 {id="flow"}

表單式驗證流程可能如下所示：

1. 未經身份驗證的客戶端向伺服器應用程式中的特定 [路由](server-routing.md) 發出請求。
2. 伺服器回傳一個 HTML 頁面，該頁面至少包含一個基於 HTML 的網頁表單，提示使用者輸入使用者名稱和密碼。
   > Ktor 允許您使用 [Kotlin DSL](server-html-dsl.md) 建構表單，或者您可以選擇各種 JVM 模板引擎，例如 FreeMarker、Velocity 等。
3. 當使用者提交使用者名稱和密碼時，客戶端會向伺服器發出包含網頁表單資料（包括使用者名稱和密碼）的請求。
   
   ```kotlin
   ```
   {src="snippets/auth-form-html-dsl/post.http"}
   
   在 Ktor 中，您需要 [指定參數名稱](#configure-provider) 以擷取使用者名稱和密碼。

4. 伺服器 [驗證](#configure-provider) 客戶端傳送的憑證並回應所請求的內容。

## 安裝表單驗證 {id="install"}
要安裝 `form` 驗證提供者，請在 `install` 區塊內呼叫 [form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    form {
        // Configure form authentication
    }
}
```

您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於 [驗證指定路由](#authenticate-route)。

## 配置表單驗證 {id="configure"}

### 步驟 1: 配置表單提供者 {id="configure-provider"}
`form` 驗證提供者透過 [FormAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-form-authentication-provider/-config/index.html) 類別公開其設定。在以下範例中，指定了以下設定：
* `userParamName` 和 `passwordParamName` 屬性指定了用於擷取使用者名稱和密碼的參數名稱。
* `validate` 函數驗證使用者名稱和密碼。
  `validate` 函數檢查 `UserPasswordCredential` 並在成功驗證的情況下回傳 `UserIdPrincipal`，如果驗證失敗則回傳 `null`。
* `challenge` 函數指定了驗證失敗時執行的動作。例如，您可以重定向回登入頁面或傳送 [UnauthorizedResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="12-27"}

> 至於 `basic` 驗證，您也可以使用 [UserHashedTableAuth](server-basic-auth.md#validate-user-hash) 來驗證儲存在記憶體表格中、保留使用者名稱和密碼雜湊的使用者。

### 步驟 2: 保護特定資源 {id="authenticate-route"}

配置 `form` 提供者後，您需要定義一個資料傳送的 `post` 路由。
然後，將此路由新增到 **[authenticate](server-auth.md#authenticate-route)** 函數內部。
在成功驗證的情況下，您可以使用 `call.principal` 函數在路由處理器內部擷取已驗證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並獲取已驗證使用者的名稱。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="29-34,55"}

您可以使用 [Session 驗證](server-session-auth.md) 來儲存已登入使用者的 ID。
例如，當使用者首次使用網頁表單登入時，您可以將使用者名稱儲存到 cookie session 中，並在後續請求中使用 `session` 提供者授權該使用者。