[//]: # (title: Ktor 客戶端中的身份驗證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 外掛程式處理您的客戶端應用程式中的身份驗證與授權。
</link-summary>

Ktor 提供了 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 外掛程式，用於處理您的客戶端應用程式中的身份驗證與授權。典型的使用場景包括用戶登入以及獲取特定資源的存取權限。

> 在伺服器端，Ktor 提供了 [Authentication](server-auth.md) 外掛程式，用於處理身份驗證與授權。

## 支援的身份驗證類型 {id="supported"}

HTTP 提供了一個 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)，用於存取控制和身份驗證。Ktor 客戶端允許您使用以下 HTTP 身份驗證方案：

* [Basic](client-basic-auth.md) - 使用 `Base64` 編碼提供用戶名和密碼。如果未與 HTTPS 結合使用，通常不推薦。
* [Digest](client-digest-auth.md) - 一種身份驗證方法，透過將雜湊函數應用於用戶名和密碼，以加密形式傳輸用戶憑證。
* [Bearer](client-bearer-auth.md) - 一種身份驗證方案，涉及稱為 bearer tokens 的安全令牌。例如，您可以將此方案作為 OAuth 流程的一部分，透過使用外部提供者（例如 Google、Facebook、Twitter 等）來授權您的應用程式用戶。

## 新增依賴項 {id="add_dependencies"}

若要啟用身份驗證，您需要在構建腳本中包含 `ktor-client-auth` artifact：

<var name="artifact_name" value="ktor-client-auth"/>

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
    

    <p>
        您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴項新增到現有專案中。">新增客戶端依賴項</Links> 了解更多 Ktor 客戶端所需的 artifact 相關資訊。
    </p>
    

## 安裝 Auth {id="install_plugin"}
若要安裝 `Auth` 外掛程式，請在 [客戶端配置塊](client-create-and-configure.md#configure-client) 內部將其傳遞給 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 配置身份驗證
    }
}
```
現在您可以 [配置](#configure_authentication) 所需的身份驗證提供者。

## 配置身份驗證 {id="configure_authentication"}

### 步驟 1：選擇身份驗證提供者 {id="choose-provider"}

若要使用特定的身份驗證提供者（[basic](client-basic-auth.md)、[digest](client-digest-auth.md) 或 [bearer](client-bearer-auth.md)），您需要在 `install` 塊內部呼叫相應的函數。例如，若要使用 `basic` 身份驗證，請呼叫 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函數：

```kotlin
install(Auth) {
    basic {
        // 配置 basic 身份驗證
    }
}
```
在該塊內部，您可以配置此提供者特有的設定。

### 步驟 2：（可選）配置 realm {id="realm"}

（可選）您可以使用 `realm` 屬性配置 realm：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以建立多個具有不同 realm 的提供者，以存取不同的資源：

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

在這種情況下，客戶端會根據包含 realm 的 `WWW-Authenticate` 回應標頭來選擇必要的提供者。

### 步驟 3：配置提供者 {id="configure-provider"}

若要了解如何配置特定 [提供者](#supported) 的設定，請參閱相應的主題：
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)