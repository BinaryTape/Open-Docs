[//]: # (title: Ktor 用戶端中的摘要認證)

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

在摘要認證方案中，雜湊函式會先應用於使用者名稱和密碼，再透過網路傳送。

> 在伺服器端，Ktor 提供了 [認證](server-digest-auth.md) 插件來處理摘要認證。

## 摘要認證流程 {id="flow"}

摘要認證流程如下所示：

1. 用戶端向伺服器應用程式中的特定資源發出未帶 `Authorization` 標頭的請求。
2. 伺服器向用戶端回應 `401` (未授權) 狀態，並使用 `WWW-Authenticate` 回應標頭來提供資訊，表明該路由受摘要認證方案保護。一個典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常，用戶端會顯示登入對話框，供使用者輸入憑證。然後，用戶端會發出帶有以下 `Authorization` 標頭的請求：

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 值以下列方式生成：

   a. `HA1 = MD5(username:realm:password)`

   b. `HA2 = MD5(method:digestURI)`

   c. `response = MD5(HA1:nonce:HA2)`

4. 伺服器驗證用戶端傳送的憑證，並回應所請求的內容。

## 配置摘要認證 {id="configure"}

若要使用 `Digest` 方案在 `Authorization` 標頭中傳送使用者憑證，您需要按以下方式配置 `digest` 認證提供者：

1. 在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html) 函式。
2. 使用 [DigestAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html) 提供所需的憑證，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html) 函式。
3. (可選) 使用 `realm` 屬性配置領域。

```kotlin
```
{src="snippets/client-auth-digest/src/main/kotlin/com/example/Application.kt" include-lines="17-26"}

> 您可以在此處找到完整範例：[client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。