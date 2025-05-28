[//]: # (title: Ktor 用戶端中的基本身份驗證)

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

基本 [身份驗證方案](client-auth.md) 可用於用戶登入。在此方案中，用戶憑證會以使用 Base64 編碼的用戶名/密碼對形式傳輸。

> 在伺服器端，Ktor 提供 [Authentication](server-basic-auth.md) 外掛程式用於處理基本身份驗證。

## 基本身份驗證流程 {id="flow"}

基本身份驗證流程如下所示：

1. 用戶端向伺服器應用程式中的特定資源發出沒有 `Authorization` 標頭的請求。
2. 伺服器以 `401` (未授權) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭提供資訊，表明基本身份驗證方案用於保護路由。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 用戶端允許您使用 `sendWithoutRequest` [函式](#configure) 傳送憑證，而無需等待 `WWW-Authenticate` 標頭。

3. 通常，用戶端會顯示一個登入對話框，用戶可以在其中輸入憑證。然後，用戶端發出包含使用 Base64 編碼的用戶名和密碼對的 `Authorization` 標頭的請求，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器驗證用戶端傳送的憑證，並回應所請求的內容。

## 配置基本身份驗證 {id="configure"}

若要使用 `Basic` 方案在 `Authorization` 標頭中傳送用戶憑證，您需要按以下方式配置 `basic` 身份驗證提供者：

1. 在 `install` 區塊內呼叫 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函式。
2. 使用 [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供所需的憑證，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函式。
3. 使用 `realm` 屬性配置 realm。

   ```kotlin
   ```
   {src="snippets/client-auth-basic/src/main/kotlin/com/example/Application.kt" include-lines="17-26"}

4. (選填) 啟用在初始請求中傳送憑證，而無需等待帶有 `WWW-Authenticate` 標頭的 `401` (未授權) 回應。您需要呼叫返回布林值的 `sendWithoutRequest` 函式並檢查請求參數。

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

> 您可以在此處找到完整的範例：[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。