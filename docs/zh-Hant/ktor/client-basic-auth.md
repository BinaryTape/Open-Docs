[//]: # (title: Ktor 客戶端中的基本認證)

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

基本 [認證方案](client-auth.md) 可用於登入使用者。在此方案中，使用者憑證以使用 Base64 編碼的用戶名/密碼對形式傳輸。

> 在伺服器端，Ktor 提供了 [Authentication](server-basic-auth.md) 外掛程式來處理基本認證。

## 基本認證流程 {id="flow"}

基本認證流程如下所示：

1. 客戶端在沒有 `Authorization` 標頭的情況下，向伺服器應用程式中的特定資源發出請求。
2. 伺服器以 `401` (Unauthorized) 回應狀態回應客戶端，並使用 `WWW-Authenticate` 回應標頭提供基本認證方案用於保護路由的資訊。典型的 `WWW-Authenticate` 標頭如下：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 客戶端允許您使用 `sendWithoutRequest` [函數](#configure) 在不等待 `WWW-Authenticate` 標頭的情況下傳送憑證。

3. 通常，客戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，客戶端會發出一個帶有 `Authorization` 標頭的請求，該標頭包含一個使用 Base64 編碼的用戶名和密碼對，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器驗證客戶端傳送的憑證，並以所請求的內容回應。

## 設定基本認證 {id="configure"}

若要使用 `Basic` 方案在 `Authorization` 標頭中傳送使用者憑證，您需要按如下方式設定 `basic` 認證提供者：

1. 在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函數。
2. 使用 [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供所需憑證，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函數。
3. 使用 `realm` 屬性設定領域。

   [object Promise]

4. （可選）啟用在初始請求中傳送憑證，而無需等待帶有 `WWW-Authenticate` 標頭的 `401` (Unauthorized) 回應。您需要呼叫返回布林值的 `sendWithoutRequest` 函數並檢查請求參數。

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

> 您可以在這裡找到完整的範例：[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。