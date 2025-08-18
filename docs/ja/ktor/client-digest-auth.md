[//]: # (title: Ktorクライアントでのダイジェスト認証)

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

ダイジェスト認証スキームでは、ユーザー名とパスワードをネットワーク経由で送信する前に、ハッシュ関数が適用されます。

> サーバー側では、Ktorはダイジェスト認証を処理するための[Authentication](server-digest-auth.md)プラグインを提供します。

## ダイジェスト認証のフロー {id="flow"}

ダイジェスト認証のフローは次のようになります。

1. クライアントは、サーバーアプリケーション内の特定のリソースに対して、`Authorization`ヘッダーなしでリクエストを行います。
2. サーバーはクライアントに`401` (未承認) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、ダイジェスト認証スキームがルートを保護するために使用されているという情報を提供します。一般的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

3. 通常、クライアントはユーザーが資格情報を入力できるログインダイアログを表示します。その後、クライアントは次の`Authorization`ヘッダーを付けてリクエストを行います。

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

4. サーバーはクライアントによって送信された資格情報を検証し、要求されたコンテンツで応答します。

## ダイジェスト認証の設定 {id="configure"}

ユーザーの資格情報を`Authorization`ヘッダーに`Digest`スキームを使用して送信するには、`digest`認証プロバイダーを次のように設定する必要があります。

1. `install`ブロック内で[digest](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html)関数を呼び出します。
2. 必要な資格情報を[DigestAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html)を使用して提供し、このオブジェクトを[credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html)関数に渡します。
3. オプションとして、`realm`プロパティを使用してrealmを設定します。

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

> 完全な例はこちらで確認できます: [client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest)。