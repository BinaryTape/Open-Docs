[//]: # (title: Ktor Client 中的基本驗證)

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

基本 [驗證配置](client-auth.md) 可用於登入使用者。在此配置中，使用者憑據會以使用 Base64 編碼的使用者名稱/密碼組進行傳輸。 

> 在伺服器上，Ktor 提供了 [Authentication](server-basic-auth.md) 外掛程式來處理基本驗證。

undefined

## 基本驗證流程 {id="flow"}

基本驗證流程如下所示：

1. 用戶端向伺服器應用程式中的受保護資源發送請求，且不帶有 `Authorization` 標頭。
2. 伺服器回傳 `401 Unauthorized` 回應狀態，並使用 `WWW-Authenticate` 回應標頭來指示需要基本驗證。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktor 用戶端允許您透過使用 [`sendWithoutRequest()`](#configure) 函式來主動地（preemptively）發送憑據，而無需等待 `WWW-Authenticate` 標頭。

3. 用戶端通常會提示使用者輸入憑據。接著發送帶有 `Authorization` 標頭的請求，其中包含使用 Base64 編碼的使用者名稱和密碼組，例如：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. 伺服器驗證用戶端發送的憑據，並回應所請求的內容。

## 配置基本驗證 {id="configure"}

若要使用 `Basic` 配置在 `Authorization` 標頭中發送使用者憑據，您需要配置 `basic` 驗證提供者：

1. 在 `install(Auth)` 區塊中呼叫 [`basic`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 函式。
2. 使用 [`BasicAuthCredentials`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) 提供必要的憑據，並將此物件傳遞給 [`credentials`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 函式。
3. 使用 `realm` 屬性配置 realm。

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

4. （選用）使用 `sendWithoutRequest` 函式啟用主動式驗證，該函式會檢查請求參數並決定是否將憑據附加到初始請求。

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
5. （選用）停用憑據快取。預設情況下，`credentials {}` 提供者傳回的憑據會被快取，以便在請求之間重複使用。您可以使用 `cacheTokens` 選項停用快取：

    ```kotlin
    basic {
        cacheTokens = false   // 每次請求都會重新載入憑據
        // ...
    }
    ```
    當憑據在用戶端工作階段期間可能會變更，或者必須反映最新的存儲狀態時，停用快取非常有用。

    > 有關以程式化方式清除快取憑據的詳細資訊，請參閱通用的 [權杖快取與快取控制](client-auth.md#token-caching) 章節。

> 有關 Ktor Client 中基本驗證的完整範例，請參閱 [client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-auth-basic)。