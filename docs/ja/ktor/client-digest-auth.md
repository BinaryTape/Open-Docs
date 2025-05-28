[//]: # (title: Ktor ClientにおけるDigest認証)

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

Digest認証スキームでは、ユーザー名とパスワードがネットワーク経由で送信される前に、ハッシュ関数が適用されます。

> サーバー側では、KtorはDigest認証を処理するための[Authentication](server-digest-auth.md)プラグインを提供しています。

## Digest認証フロー {id="flow"}

Digest認証フローは次のようになります。

1. クライアントは、サーバーアプリケーション内の特定のリソースに対して、`Authorization`ヘッダーなしでリクエストを送信します。
2. サーバーはクライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、そのルートを保護するためにDigest認証スキームが使用されているという情報を提供します。一般的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常、クライアントはユーザーが認証情報を入力できるログインダイアログを表示します。その後、クライアントは次の`Authorization`ヘッダーを含むリクエストを送信します。

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response`値は次の方法で生成されます。

   a. `HA1 = MD5(username:realm:password)`

   b. `HA2 = MD5(method:digestURI)`

   c. `response = MD5(HA1:nonce:HA2)`

4. サーバーはクライアントから送信された認証情報を検証し、要求されたコンテンツで応答します。

## Digest認証を構成する {id="configure"}

`Digest`スキームを使用して`Authorization`ヘッダーにユーザー認証情報を送信するには、`digest`認証プロバイダーを次のように構成する必要があります。

1. `install`ブロック内で[digest](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html)関数を呼び出します。
2. [DigestAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html)を使用して必要な認証情報を提供し、このオブジェクトを[credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html)関数に渡します。
3. オプションで、`realm`プロパティを使用してレルムを構成します。

```kotlin
```
{src="snippets/client-auth-digest/src/main/kotlin/com/example/Application.kt" include-lines="17-26"}

> 完全な例はこちらで確認できます: [client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。