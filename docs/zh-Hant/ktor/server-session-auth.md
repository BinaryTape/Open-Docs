[//]: # (title: Ktor Server 中的會話驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

[會話](server-sessions.md) 提供了一種在不同 HTTP 請求之間持久化資料的機制。典型的用例包括儲存已登入使用者的 ID、購物籃內容或在客戶端保留使用者偏好設定。

在 Ktor 中，已擁有相關會話的使用者可以使用 `session` 提供者進行驗證。例如，當使用者首次使用 [網頁表單](server-form-based-auth.md) 登入時，您可以將使用者名稱儲存到一個 Cookie 會話中，並在後續請求中使用 `session` 提供者來授權此使用者。

> 您可以在 [](server-auth.md) 章節中取得有關 Ktor 驗證與授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `session` 驗證，您需要在建置腳本中包含以下構件 (artifacts)：

* 新增 `ktor-server-sessions` 依賴項以使用會話：

  <var name="artifact_name" value="ktor-server-sessions"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 新增 `ktor-server-auth` 依賴項以進行驗證：

  <var name="artifact_name" value="ktor-server-auth"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

## 會話驗證流程 {id="flow"}

會話驗證流程可能有所不同，取決於您的應用程式如何驗證使用者。讓我們看看它在 [表單式驗證](server-form-based-auth.md) 中的樣子：

1. 客戶端向伺服器發出包含網頁表單資料（包括使用者名稱和密碼）的請求。
2. 伺服器驗證客戶端傳送的憑證 (credentials)，將使用者名稱儲存到一個 Cookie 會話中，並以請求的內容和包含使用者名稱的 Cookie 作為回應。
3. 客戶端攜帶 Cookie 向受保護資源發出後續請求。
4. 根據收到的 Cookie 資料，Ktor 檢查該使用者是否存在 Cookie 會話，並可選地對收到的會話資料執行額外驗證。若驗證成功，伺服器將回應請求的內容。

## 安裝會話驗證 {id="install"}
若要安裝 `session` 驗證提供者，請在 `install` 區塊內呼叫帶有所需會話型別的 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // Configure session authentication
    }
}
```

## 配置會話驗證 {id="configure"}

本節將演示如何使用 [表單式驗證](server-form-based-auth.md) 來驗證使用者，將該使用者的資訊儲存到一個 Cookie 會話中，然後在後續請求中使用 `session` 提供者來授權此使用者。

> 有關完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步驟 1: 建立資料類別 {id="data-class"}

首先，您需要建立一個用於儲存會話資料的資料類別：

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

### 步驟 2: 安裝與配置會話 {id="install-session"}

建立資料類別後，您需要安裝並配置 `Sessions` 外掛程式 (plugin)。以下範例將安裝並配置一個帶有指定 Cookie 路徑和過期時間的 Cookie 會話。

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

> 若要深入了解會話配置，請參閱 [](server-sessions.md#configuration_overview)。

### 步驟 3: 配置會話驗證 {id="configure-session-auth"}

`session` 驗證提供者透過 [
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)
類別公開其設定。在以下範例中，指定了以下設定：

* `validate()` 函數檢查 [會話實例](#data-class)，並在驗證成功時回傳 `Any` 型別的主體。
* `challenge()` 函數指定了在驗證失敗時執行的動作。例如，您可以重新導向回登入頁面，或傳送一個 [
  `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="22,34-46"}

### 步驟 4: 在會話中儲存使用者資料 {id="save-session"}

若要將已登入使用者的資訊儲存到會話中，請使用 [
`call.sessions.set()`](server-sessions.md#use_sessions)
函數。

以下範例展示了使用網頁表單的簡單驗證流程：

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="69-75"}

> 有關表單式驗證流程的更多詳細資訊，請參閱
[表單式驗證](server-form-based-auth.md) 文件。

### 步驟 5: 保護特定資源 {id="authenticate-route"}

配置 `session` 提供者後，您可以使用
[`authenticate()`](server-auth.md#authenticate-route) 函數保護應用程式中的特定資源。

成功驗證後，您可以在路由處理器中透過使用 `call.principal()` 函數來檢索已驗證的主體（在此情況下為 [`UserSession`](#data-class) 實例）：

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-83"}

> 有關完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。