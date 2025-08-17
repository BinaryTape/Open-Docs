[//]: # (title: Ktor Client 中的摘要驗證)

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在摘要驗證方案中，雜湊函式會應用於使用者名稱和密碼，然後再將它們透過網路傳送。

> 在伺服器端，Ktor 提供了 [Authentication](server-digest-auth.md) 插件來處理摘要驗證。

## 摘要驗證流程 {id="flow"}

摘要驗證流程如下所示：

1. 用戶端向伺服器應用程式中的特定資源發出不帶有 `Authorization` 標頭的請求。
2. 伺服器以 `401` (未授權) 回應狀態回應用戶端，並使用 `WWW-Authenticate` 回應標頭提供資訊，表明摘要驗證方案用於保護路由。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常，用戶端會顯示一個登入對話框，使用者可以在其中輸入憑證。然後，用戶端會發出一個帶有以下 `Authorization` 標頭的請求：

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 值透過以下方式產生：

   a. `HA1 = MD5(username:realm:password)`

   b. `HA2 = MD5(method:digestURI)`

   c. `response = MD5(HA1:nonce:HA2)`

4. 伺服器驗證用戶端傳送的憑證，並回應所請求的內容。

## 設定摘要驗證 {id="configure"}

要使用 `Digest` 方案在 `Authorization` 標頭中傳送使用者憑證，您需要按以下方式設定 `digest` 驗證提供者：

1. 在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html) 函式。
2. 使用 [DigestAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html) 提供所需的憑證，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html) 函式。
3. 選擇性地，使用 `realm` 屬性設定領域。

```kotlin
val client = HttpClient(CIO) {
    install(Auth) {
        digest {
            credentials {
                DigestAuthCredentials(username = "jetbrains", password = "foobar")
            }
            realm = "Access to the '/' path"
        }
    }
}
```

> 您可以在這裡找到完整範例：[client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。