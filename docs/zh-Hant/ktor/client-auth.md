[//]: # (title: Ktor 用戶端中的認證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 外掛程式處理您用戶端應用程式中的認證與授權。
</link-summary>

Ktor 提供
[Auth](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth/-auth)
外掛程式，用於處理您用戶端應用程式中的認證與授權。
典型使用情境包括使用者登入及取得特定資源的存取權。

> 在伺服器端，Ktor 提供 [Authentication](server-auth.md) 外掛程式來處理認證與
> 授權。

## 支援的認證類型 {id="supported"}

HTTP 提供一個 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用於存取控制和認證。Ktor 用戶端允許您使用以下 HTTP 認證方案：

*   [基本](client-basic-auth.md) - 使用 `Base64` 編碼提供使用者名稱和密碼。如果未與 HTTPS 結合使用，通常不建議使用。
*   [摘要](client-digest-auth.md) - 一種認證方法，透過將雜湊函數應用於使用者名稱和密碼，以加密形式傳輸使用者憑證。
*   [承載者](client-bearer-auth.md) - 一種認證方案，涉及稱為承載者令牌的安全令牌。例如，您可以將此方案作為 OAuth 流程的一部分，透過使用外部提供者（如 Google、Facebook、Twitter 等）來授權您的應用程式使用者。

## 添加依賴項 {id="add_dependencies"}

若要啟用認證，您需要在建構腳本中包含 `ktor-client-auth` 構件：

<var name="artifact_name" value="ktor-client-auth"/>
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
<p>
    您可以從 <Links href="/ktor/client-dependencies" summary="瞭解如何將用戶端依賴項添加到現有專案。">添加用戶端依賴項</Links> 瞭解更多關於 Ktor 用戶端所需的構件資訊。
</p>

## 安裝 Auth {id="install_plugin"}
若要安裝 `Auth` 外掛程式，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 配置認證
    }
}
```
現在您可以 [配置](#configure_authentication) 所需的認證提供者。

## 配置認證 {id="configure_authentication"}

### 步驟 1：選擇認證提供者 {id="choose-provider"}

若要使用特定的認證提供者（[基本](client-basic-auth.md)、[摘要](client-digest-auth.md) 或 [承載者](client-bearer-auth.md)），您需要在 `install` 區塊內呼叫對應的函數。例如，若要使用 `basic` 認證，請呼叫 [basic](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函數：

```kotlin
install(Auth) {
    basic {
        // 配置基本認證
    }
}
```
在區塊內部，您可以配置此提供者特有的設定。

### 步驟 2：（可選）配置領域 {id="realm"}

您可以選擇使用 `realm` 屬性配置領域：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以建立幾個具有不同領域的提供者，以存取不同的資源：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
    basic {
        realm = "Access to the '/admin' path"
        // ...
    }
}
```

在此情況下，用戶端會根據包含領域的 `WWW-Authenticate` 回應標頭來選擇必要的提供者。

### 3：配置提供者 {id="configure-provider"}

若要瞭解如何為特定的[提供者](#supported) 配置設定，請參閱對應的主題：
*   [Ktor 用戶端中的基本認證](client-basic-auth.md)
*   [Ktor 用戶端中的摘要認證](client-digest-auth.md)
*   [Ktor 用戶端中的承載者認證](client-bearer-auth.md)