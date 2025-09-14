[//]: # (title: Ktor 伺服器中的工作階段驗證)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必備依賴項</b>：<code>io.ktor:ktor-server-auth</code>、<code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

[工作階段](server-sessions.md)提供了一種在不同 HTTP 請求之間持久化資料的機制。典型的用例包括儲存已登入使用者的 ID、購物車內容，或在用戶端保留使用者偏好設定。

在 Ktor 中，已關聯工作階段的使用者可以使用 `session` 提供者進行驗證。例如，當使用者首次使用[網頁表單](server-form-based-auth.md)登入時，您可以將使用者名稱儲存到 Cookie 工作階段，並在後續請求中使用 `session` 提供者授權此使用者。

> 您可以在[Ktor 伺服器中的驗證與授權](server-auth.md)區段中獲取關於 Ktor 中驗證與授權的一般資訊。

## 添加依賴項 {id="add_dependencies"}
要啟用 `session` 驗證，您需要在建置腳本中包含以下構件：

*   添加 `ktor-server-sessions` 依賴項以使用工作階段：

    <var name="artifact_name" value="ktor-server-sessions"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>

*   添加 `ktor-server-auth` 依賴項以進行驗證：

    <var name="artifact_name" value="ktor-server-auth"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>

## 工作階段驗證流程 {id="flow"}

使用工作階段的驗證流程可能會有所不同，並取決於您的應用程式中如何驗證使用者。讓我們看看[表單驗證](server-form-based-auth.md)可能如何實作：

1.  用戶端向伺服器發出包含網頁表單資料（包括使用者名稱和密碼）的請求。
2.  伺服器驗證用戶端傳送的憑證，將使用者名稱儲存到 Cookie 工作階段，並回應請求的內容以及包含使用者名稱的 Cookie。
3.  用戶端帶著 Cookie 向受保護的資源發出後續請求。
4.  根據收到的 Cookie 資料，Ktor 檢查此使用者是否存在 Cookie 工作階段，並可選擇性地對收到的工作階段資料執行額外驗證。如果驗證成功，伺服器將回應請求的內容。

## 安裝工作階段驗證 {id="install"}
要安裝 `session` 驗證提供者，請在 `install` 區塊內呼叫 [session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html) 函數並指定所需的工作階段類型：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // 配置工作階段驗證
    }
}
```

## 配置工作階段驗證 {id="configure"}

本節演示如何使用[表單驗證](server-form-based-auth.md)驗證使用者，將此使用者的資訊儲存到 Cookie 工作階段，然後在後續請求中使用 `session` 提供者授權此使用者。

> 如需完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。

### 步驟 1：建立資料類別 {id="data-class"}

首先，您需要建立一個用於儲存工作階段資料的資料類別：

```kotlin
@Serializable
data class UserSession(val name: String, val count: Int)
```

### 步驟 2：安裝並配置工作階段 {id="install-session"}

建立資料類別後，您需要安裝並配置 `Sessions` 外掛程式。下面的範例
安裝並配置了一個帶有指定 Cookie 路徑和過期時間的 Cookie 工作階段。

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 60
    }
}
```

> 要了解更多關於配置工作階段的資訊，請參閱[工作階段配置概述](server-sessions.md#configuration_overview)。

### 步驟 3：配置工作階段驗證 {id="configure-session-auth"}

`session` 驗證提供者透過 [
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)
類別公開其設定。在下面的範例中，指定了以下設定：

*   `validate()` 函數檢查[工作階段實例](#data-class)並在成功驗證的情況下傳回 `Any` 類型的 principal。
*   `challenge()` 函數指定驗證失敗時執行的動作。例如，您可以重定向回登入頁面或傳送 [
    `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)。

```kotlin
install(Authentication) {
    session<UserSession>("auth-session") {
        validate { session ->
            if(session.name.startsWith("jet")) {
                session
            } else {
                null
            }
        }
        challenge {
            call.respondRedirect("/login")
        }
    }
}
```

### 步驟 4：將使用者資料儲存在工作階段中 {id="save-session"}

要將已登入使用者的資訊儲存到工作階段，請使用 [
`call.sessions.set()`](server-sessions.md#use_sessions)
函數。

以下範例展示了使用網頁表單的簡單驗證流程：

```kotlin
authenticate("auth-form") {
    post("/login") {
        val userName = call.principal<UserIdPrincipal>()?.name.toString()
        call.sessions.set(UserSession(name = userName, count = 1))
        call.respondRedirect("/hello")
    }
}
```

> 有關表單驗證流程的更多詳細資訊，請參閱[表單驗證](server-form-based-auth.md)文件。

### 步驟 5：保護特定資源 {id="authenticate-route"}

配置 `session` 提供者後，您可以使用
[`authenticate()`](server-auth.md#authenticate-route) 函數保護應用程式中的特定資源。

成功驗證後，您可以透過在路由處理常式內使用 `call.principal()` 函數來檢索已驗證的 principal (在此情況下為 [`UserSession`](#data-class) 實例)：

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
        call.sessions.set(userSession?.copy(count = userSession.count + 1))
        call.respondText("Hello, ${userSession?.name}! Visit count is ${userSession?.count}.")
    }
}
```

> 如需完整範例，請參閱
> [auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)。