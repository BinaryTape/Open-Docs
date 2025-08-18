[//]: # (title: Ktor Server 中的 Bearer 認證)

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
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，允許您在不需額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

Bearer 認證方案是 [HTTP 框架](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) 的一部分，用於存取控制與認證。此方案涉及稱為 Bearer 權杖（bearer tokens）的安全權杖。Bearer 認證方案作為 [OAuth](server-oauth.md) 或 [JWT](server-jwt.md) 的一部分使用，但您也可以提供自訂邏輯來授權 Bearer 權杖。

您可以在 [Ktor Server 中的認證與授權](server-auth.md) 部分取得有關 Ktor 中認證的一般資訊。

> Bearer 認證應僅透過 [HTTPS/TLS](server-ssl.md) 使用。

## 新增依賴項 {id="add_dependencies"}
若要啟用 `bearer` 認證，您需要將 `%artifact_name%` artifact 包含在建構腳本中：

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

## Bearer 認證流程 {id="flow"}

通常，Bearer 認證流程可能如下所示：

1.  使用者成功認證並授權存取後，伺服器會將存取權杖傳回給客戶端。
2.  客戶端可以使用 `Bearer` 模式，在 `Authorization` 標頭中傳遞權杖，向受保護資源發出請求。
   ```HTTP
   GET http://localhost:8080/
   Authorization: Bearer abc123
   
   
   ```
3.  伺服器接收請求並[驗證](#configure)權杖。
4.  驗證後，伺服器回應受保護資源的內容。

## 安裝 Bearer 認證 {id="install"}
若要安裝 `bearer` 認證提供者，請在 `install` 區塊內呼叫 [bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

您可以選擇指定一個 [提供者名稱](server-auth.md#provider-name)，該名稱可用於[認證指定路由](#authenticate-route)。

## 配置 Bearer 認證 {id="configure"}

若要了解如何在 Ktor 中配置不同的認證提供者，請參閱 [配置認證](server-auth.md#configure)。在本節中，我們將探討 `bearer` 認證提供者的配置細節。

### 步驟 1：配置 Bearer 提供者 {id="configure-provider"}

`bearer` 認證提供者透過 [BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html) 類別公開其設定。在下面的範例中，指定了以下設定：
*   `realm` 屬性設定要在 `WWW-Authenticate` 標頭中傳遞的 realm。
*   `authenticate` 函數檢查客戶端傳送的權杖，並在認證成功的情況下傳回 `UserIdPrincipal`，或在認證失敗時傳回 `null`。

```kotlin
install(Authentication) {
    bearer("auth-bearer") {
        realm = "Access to the '/' path"
        authenticate { tokenCredential ->
            if (tokenCredential.token == "abc123") {
                UserIdPrincipal("jetbrains")
            } else {
                null
            }
        }
    }
}
```

### 步驟 2：保護特定資源 {id="authenticate-route"}

配置完 `bearer` 提供者後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數來保護應用程式中的特定資源。在認證成功的情況下，您可以在路由處理程式內部使用 `call.principal` 函數擷取已認證的 [UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)，並取得已認證使用者的名稱。

```kotlin
routing {
    authenticate("auth-bearer") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}