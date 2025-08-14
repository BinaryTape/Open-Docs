[//]: # (title: Ktor 伺服器中的會話認證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-auth</code>、<code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行時或虛擬機器下執行伺服器。">原生伺服器</Links> 支援</b>：✖️
    </p>
    
</tldr>

[會話](server-sessions.md) 提供了一種在不同 HTTP 請求之間持久化資料的機制。典型用例包括儲存已登入使用者的 ID、購物車內容，或在客戶端保留使用者偏好設定。

在 Ktor 中，已具備關聯會話的使用者可以使用 `session` 提供者進行認證。例如，當使用者首次使用 [網路表單](server-form-based-auth.md) 登入時，您可以將使用者名稱儲存到 Cookie 會話中，並在後續請求中使用 `session` 提供者授權此使用者。

> 您可以在 [](server-auth.md) 章節中獲取關於 Ktor 認證與授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `session` 認證，您需要在建置指令碼中包含以下構件：

* 為使用會話，新增 `ktor-server-sessions` 依賴項：

  <var name="artifact_name" value="ktor-server-sessions"/>
  
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
    

* 為認證功能，新增 `ktor-server-auth` 依賴項：

  <var name="artifact_name" value="ktor-server-auth"/>
  
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
    

## 會話認證流程 {id="flow"}

使用會話的認證流程可能因您的應用程式中使用者認證方式而異。讓我們看看它在 [基於表單的認證](server-form-based-auth.md) 中可能如何呈現：

1. 客戶端向伺服器發出包含網路表單資料（包括使用者名稱和密碼）的請求。
2. 伺服器驗證客戶端發送的憑證，將使用者名稱儲存到 Cookie 會話中，並以所請求的內容和包含使用者名稱的 Cookie 作為回應。
3. 客戶端向受保護資源發出帶有 Cookie 的後續請求。
4. 根據收到的 Cookie 資料，Ktor 會檢查此使用者是否存在 Cookie 會話，並可選地對收到的會話資料執行額外的驗證。在驗證成功的情況下，伺服器會以所請求的內容作為回應。

## 安裝會話認證 {id="install"}
若要安裝 `session` 認證提供者，請在 `install` 區塊內呼叫帶有所需會話類型的 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函數：

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

## 配置會話認證 {id="configure"}

本節演示如何使用 [基於表單的認證](server-form-based-auth.md) 來認證使用者，將此使用者的資訊儲存到 Cookie 會話中，然後在後續請求中使用 `session` 提供者授權此使用者。

> 有關完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步驟 1：建立資料類別 {id="data-class"}

首先，您需要建立一個用於儲存會話資料的資料類別：

[object Promise]

### 步驟 2：安裝並配置會話 {id="install-session"}

建立資料類別後，您需要安裝並配置 `Sessions` 外掛程式。以下範例安裝並配置了一個帶有指定 Cookie 路徑和過期時間的 Cookie 會話。

[object Promise]

> 要了解更多關於配置會話的資訊，請參閱 [](server-sessions.md#configuration_overview)。

### 步驟 3：配置會話認證 {id="configure-session-auth"}

`session` 認證提供者透過 [
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)
類別公開其設定。在以下範例中，指定了以下設定：

* `validate()` 函數檢查 [會話實例](#data-class)，並在認證成功時返回 `Any` 類型的 `principal`。
* `challenge()` 函數指定了認證失敗時執行的動作。例如，您可以重新導向回登入頁面或發送一個 [
  `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

[object Promise]

### 步驟 4：將使用者資料儲存到會話中 {id="save-session"}

若要將已登入使用者的資訊儲存到會話中，請使用 [
`call.sessions.set()`](server-sessions.md#use_sessions)
函數。

以下範例展示了使用網路表單的簡單認證流程：

[object Promise]

> 有關基於表單的認證流程的更多詳情，請參閱 [基於表單的認證](server-form-based-auth.md) 文件。

### 步驟 5：保護特定資源 {id="authenticate-route"}

配置 `session` 提供者後，您可以使用 [
`authenticate()`](server-auth.md#authenticate-route) 函數保護應用程式中的特定資源。

成功認證後，您可以使用 `call.principal()` 函數在路由處理器中檢索已認證的 `principal`（在此情況下為 [`UserSession`](#data-class) 實例）：

[object Promise]

> 有關完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。