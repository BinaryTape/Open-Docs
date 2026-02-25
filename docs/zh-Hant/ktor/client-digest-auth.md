[//]: # (title: Ktor Client 中的 Digest 驗證)

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

在 Digest 驗證架構中，使用者名稱和密碼在透過網路傳送之前，會先經過雜湊函式處理。

> 在伺服器端，Ktor 提供了 [Authentication](server-digest-auth.md) 外掛程式來處理 Digest 驗證。

## Digest 驗證流程 {id="flow"}

Digest 驗證流程如下：

1. 用戶端向伺服器端應用程式中的特定資源發出不含 `Authorization` 標頭的請求。
2. 伺服器向用戶端回傳 `401` (Unauthorized) 回應狀態，並使用 `WWW-Authenticate` 回應標頭提供資訊，說明該路由受 Digest 驗證架構保護。典型的 `WWW-Authenticate` 標頭如下所示：

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常，用戶端會顯示登入對話方塊，讓使用者輸入憑據。接著，用戶端會發出帶有以下 `Authorization` 標頭的請求：

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 的值是透過以下方式產生的：

   a. `HA1 = MD5(username:realm:password)`

   b. `HA2 = MD5(method:digestURI)`

   c. `response = MD5(HA1:nonce:HA2)`

4. 伺服器驗證用戶端傳送的憑據，並回傳請求的內容。

## 配置 Digest 驗證 {id="configure"}

若要使用 `Digest` 架構在 `Authorization` 標頭中傳送使用者憑據，您需要按照以下步驟配置 `digest` 驗證提供者：

1. 在 `install` 區塊內呼叫 [digest](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html) 函式。
2. 使用 [DigestAuthCredentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html) 提供必要的憑據，並將此物件傳遞給 [credentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html) 函式。
3. （選用）使用 `realm` 屬性配置領域。

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

> 您可以在此處找到完整的範例：[client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。