[//]: # (title: Ktor 客戶端中的認證與授權)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要的依賴項</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 外掛程式處理您的客戶端應用程式中的認證與授權。
</link-summary>

Ktor 提供 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 外掛程式，用於處理您的客戶端應用程式中的認證與授權。典型的使用場景包括登入使用者以及取得特定資源的存取權限。

> 在伺服器端，Ktor 提供 [Authentication](server-auth.md) 外掛程式用於處理認證與授權。

## 支援的認證類型 {id="supported"}

HTTP 提供一個 [通用框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 用於存取控制與認證。Ktor 客戶端允許您使用以下 HTTP 認證方案：

*   [Basic](client-basic-auth.md) - 使用 `Base64` 編碼來提供使用者名稱和密碼。通常在未與 HTTPS 結合使用時不建議。
*   [Digest](client-digest-auth.md) - 一種認證方法，透過對使用者名稱和密碼應用雜湊函數，以加密形式傳輸使用者憑證。
*   [Bearer](client-bearer-auth.md) - 一種認證方案，涉及稱為 Bearer 權杖 (Bearer tokens) 的安全權杖。例如，您可以將此方案作為 OAuth 流程的一部分，透過使用外部提供者（例如 Google、Facebook、Twitter 等）來授權您應用程式的使用者。

## 添加依賴項 {id="add_dependencies"}

要啟用認證，您需要在建構腳本中包含 `ktor-client-auth` Artifact：

<var name="artifact_name" value="ktor-client-auth"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安裝 Auth {id="install_plugin"}
要安裝 `Auth` 外掛程式，請將其傳遞給 [客戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：

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

### 步驟 1：選擇一個認證提供者 {id="choose-provider"}

要使用特定的認證提供者（[basic](client-basic-auth.md)、[digest](client-digest-auth.md) 或 [bearer](client-bearer-auth.md)），您需要在 `install` 區塊內呼叫相應的函數。例如，要使用 `basic` 認證，請呼叫 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函數：

```kotlin
install(Auth) {
    basic {
        // 配置 basic 認證
    }
}
```
在此區塊內，您可以配置此提供者特定的設定。

### 步驟 2：（可選）配置 Realm {id="realm"}

可選地，您可以使用 `realm` 屬性配置 Realm：

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

您可以建立多個具有不同 Realm 的提供者，以存取不同的資源：

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

在這種情況下，客戶端會根據包含 Realm 的 `WWW-Authenticate` 回應標頭來選擇必要的提供者。

### 步驟 3：配置提供者 {id="configure-provider"}

要了解如何為特定的 [提供者](#supported) 配置設定，請參閱相應主題：
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)