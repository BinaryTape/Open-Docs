[//]: # (title: Ktor Client 中的驗證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 外掛程式負責處理您用戶端應用程式中的驗證與授權。
</link-summary>

Ktor 提供 [`Auth`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 外掛程式來處理您用戶端應用程式中的驗證與授權。典型的使用場景包括登入使用者以及獲取特定資源的存取權限。

> 在伺服器端，Ktor 提供 [`Authentication`](server-auth.md) 外掛程式來處理驗證與授權。

## 支援的驗證類型 {id="supported"}

HTTP 為存取控制與驗證提供了一個 [通用架構](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)。Ktor 用戶端允許您使用以下 HTTP 驗證配置：

* [Basic](client-basic-auth.md) - 使用 `Base64` 編碼來提供使用者名稱與密碼。若未與 HTTPS 搭配使用，通常不建議採用。
* [Digest](client-digest-auth.md) - 一種驗證方法，透過對使用者名稱與密碼套用雜湊函式，以加密形式傳輸使用者憑據 (credentials)。
* [Bearer](client-bearer-auth.md) - 一種涉及稱為 Bearer 權杖 (bearer tokens) 之安全權杖的驗證配置。例如，您可以將此配置作為 OAuth 流程的一部分，透過使用外部提供者 (如 Google、Facebook、Twitter 等) 來授權您應用程式的使用者。

## 新增相依性 {id="add_dependencies"}

若要啟用驗證，您需要在建置指令碼中包含 `ktor-client-auth` 構件：

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
    您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將用戶端相依性新增到現有專案。">新增用戶端相依性</Links> 進一步了解 Ktor 用戶端所需的構件。
</p>

## 安裝 Auth {id="install_plugin"}
若要安裝 `Auth` 外掛程式，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install()` 函式：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 配置驗證
    }
}
```
現在您可以 [配置](#configure_authentication) 所需的驗證提供者。

## 配置驗證 {id="configure_authentication"}

### 步驟 1：選擇驗證提供者 {id="choose-provider"}

若要使用特定的驗證提供者 ([`basic`](client-basic-auth.md)、[`digest`](client-digest-auth.md) 或 [`bearer`](client-bearer-auth.md))，您需要在 `install {}` 區塊內呼叫相應的函式。例如，若要使用 `basic` 驗證，請呼叫 [`basic {}`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函式：

```kotlin
install(Auth) {
    basic {
        // 配置 basic 驗證
    }
}
```
在該區塊內，您可以配置此提供者特定的設定。

### 步驟 2：(選用) 配置 realm {id="realm"}

（選用）您可以使用 `realm` 屬性配置 realm：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以建立多個具有不同 realm 的提供者來存取不同的資源：

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

在這種情況下，用戶端會根據包含 realm 的 `WWW-Authenticate` 回應標頭來選擇必要的提供者。

### 步驟 3：配置提供者 {id="configure-provider"}

若要了解如何為特定 [提供者](#supported) 配置設定，請參閱相應的主題：
* [Ktor Client 中的 Basic 驗證](client-basic-auth.md)
* [Ktor Client 中的 Digest 驗證](client-digest-auth.md)
* [Ktor Client 中的 Bearer 驗證](client-bearer-auth.md)

## 權杖快取與快取控制 {id="token-caching"}

Basic 與 Bearer 驗證提供者維護著內部的憑據或權杖快取。此快取允許用戶端重複使用先前載入的驗證資料，而不是為每個請求重新載入，從而在憑據變更時仍能保持完全控制的同時提高效能。

### 存取驗證提供者

當驗證狀態需要在用戶端工作階段期間動態更新時，您可以使用 `authProvider` 擴充來存取特定的提供者：

```kotlin
val provider = client.authProvider<BearerAuthProvider>()
```

若要檢索所有已安裝的提供者，請使用 `authProviders` 屬性：

```kotlin
val providers = client.authProviders
```

這些公用程式允許您以程式化方式檢查提供者或清除快取的權杖。

### 清除快取的權杖

若要清除單一提供者的快取憑據，請使用 `clearToken()` 函式：

```kotlin
val provider = client.authProvider<BasicAuthProvider>()
provider?.clearToken()
``` 

若要清除所有支援清除快取的驗證提供者中的快取權杖，請使用 `clearAuthTokens()` 函式：

```kotlin
client.clearAuthTokens()
```

清除快取的權杖通常用於以下場景：

- 當使用者登出時。
- 當您應用程式儲存的憑據或權杖變更時。
- 當您需要強制提供者在下一個請求時重新載入驗證狀態時。

以下是使用者登出時清除快取權杖的範例：

```kotlin
fun logout() {
    client.clearAuthTokens()
    storage.deleteCredentials()
}
```

### 控制快取行為

Basic 與 Bearer 驗證提供者都允許您使用 `cacheTokens` 選項來控制是否在請求之間快取權杖或憑據。

例如，當動態提供憑據時，您可以停用快取：

```kotlin
basic {
    cacheTokens = false   // 為每個請求重新載入憑據
    credentials {
        loadCurrentCredentials()
    }
}
```

當驗證資料頻繁變更或必須反映最新狀態時，停用權杖快取特別有用。