[//]: # (title: Ktor 用戶端的基本身份驗證)

<tldr>
<p>
<b>必要相依性</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Basic [身份驗證方案](client-auth.md)可用於使用者登入。在此方案中，使用者憑證以 Base64 編碼的使用者名稱/密碼對形式傳輸。

> 在伺服器端，Ktor 提供了 [Authentication](server-basic-auth.md) 外掛程式用於處理基本身份驗證。

## 基本身份驗證流程 {id="flow"}

基本身份驗證流程如下所示：

1.  用戶端向伺服器應用程式中的特定資源發出未帶有 `Authorization` 標頭的請求。
2.  伺服器回應用戶端一個 `401` (未經授權) 回應狀態，並使用 `WWW-Authenticate` 回應標頭提供資訊，表明使用基本身份驗證方案來保護路由。一個典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 用戶端允許您無需等待 `WWW-Authenticate` 標頭即可發送憑證，透過使用 `sendWithoutRequest` [函數](#configure)。

3.  通常，用戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，用戶端發出一個帶有 `Authorization` 標頭的請求，其中包含使用 Base64 編碼的使用者名稱和密碼對，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4.  伺服器驗證用戶端發送的憑證並回應所請求的內容。

## 配置基本身份驗證 {id="configure"}

要使用 `Basic` 方案在 `Authorization` 標頭中發送使用者憑證，您需要按如下方式配置 `basic` 身份驗證提供者：

1.  在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函數。
2.  使用 [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供所需憑證，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函數。
3.  使用 `realm` 屬性配置領域。

   ```kotlin
   val client = HttpClient(CIO) {
       install(Auth) {
           basic {
               credentials {
                   BasicAuthCredentials(username = "jetbrains", password = "foobar")
               }
               realm = "Access to the '/' path"
           }
       }
   }
   ```

4.  可選地，啟用在初始請求中發送憑證，無需等待帶有 `WWW-Authenticate` 標頭的 `401` (未經授權) 回應。您需要呼叫返回布林值的 `sendWithoutRequest` 函數並檢查請求參數。

   ```kotlin
   install(Auth) {
       basic {
           // ...
           sendWithoutRequest { request ->
               request.url.host == "0.0.0.0"
           }
       }
   }
   ```

> 您可以在此處找到完整範例：[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。