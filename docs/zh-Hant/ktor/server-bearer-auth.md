[//]: # (title: Ktor 伺服器中的 Bearer 認證)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外運行時或虛擬機器下運行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

Bearer 認證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制與認證。此方案涉及稱為 Bearer 權杖的安全權杖。Bearer 認證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以為授權 Bearer 權杖提供自訂邏輯。

您可以從 [](server-auth.md) 區段中獲取有關 Ktor 認證的通用資訊。

> Bearer 認證應僅在 [HTTPS/TLS](server-ssl.md) 上使用。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `bearer` 認證，您需要在建置指令碼中包含 `%artifact_name%` 構件：

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
    

## Bearer 認證流程 {id="flow"}

一般而言，Bearer 認證流程可能如下所示：

1.  在使用者成功認證並授權存取後，伺服器會向用戶端返回一個存取權杖。
2.  用戶端可以使用 `Bearer` 方案，透過在 `Authorization` 標頭中傳遞權杖，向受保護的資源發出請求。
   [object Promise]
3.  伺服器收到請求並 [驗證](#configure) 權杖。
4.  驗證後，伺服器以受保護資源的內容回應。

## 安裝 Bearer 認證 {id="install"}
若要安裝 `bearer` 認證提供者，請在 `install` 區塊內呼叫 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // 配置 Bearer 認證
    }
}
```

您可以選擇性地指定一個 [提供者名稱](server-auth.md#provider-name)，可用於 [認證指定的路由](#authenticate-route)。

## 配置 Bearer 認證 {id="configure"}

若要了解如何在 Ktor 中配置不同的認證提供者，請參閱 [](server-auth.md#configure)。在本區段中，我們將探討 `bearer` 認證提供者的配置細節。

### 步驟 1：配置 Bearer 提供者 {id="configure-provider"}

`bearer` 認證提供者透過 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
*   `realm` 屬性設定要傳遞在 `WWW-Authenticate` 標頭中的 realm。
*   `authenticate` 函式檢查用戶端傳送的權杖，若認證成功，則返回一個 `UserIdPrincipal`；若認證失敗，則返回 `null`。

[object Promise]

### 步驟 2：保護特定資源 {id="authenticate-route"}

配置 `bearer` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函式來保護應用程式中的特定資源。若認證成功，您可以透過 `call.principal` 函式在路由處理器內部檢索已認證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html) 並取得已認證使用者的名稱。

[object Promise]