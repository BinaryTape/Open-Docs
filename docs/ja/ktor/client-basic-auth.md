[//]: # (title: KtorクライアントでのBasic認証)

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Basic [認証スキーム](client-auth.md)は、ユーザーのログインに使用できます。このスキームでは、ユーザーの資格情報は、Base64でエンコードされたユーザー名とパスワードのペアとして送信されます。

> サーバー側では、KtorはBasic認証を処理するための[Authentication](server-basic-auth.md)プラグインを提供します。

## Basic認証のフロー {id="flow"}

Basic認証のフローは次のようになります。

1. クライアントは、`Authorization`ヘッダーなしでサーバーアプリケーション内の特定のリソースに対してリクエストを送信します。
2. サーバーは、クライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、Basic認証スキームがルートを保護するために使用されているという情報を提供します。典型的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktorクライアントでは、`sendWithoutRequest` [関数](#configure)を使用して、`WWW-Authenticate`ヘッダーを待たずに資格情報を送信できます。

3. 通常、クライアントはユーザーが資格情報を入力できるログインダイアログを表示します。その後、クライアントは、Base64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダーでリクエストを送信します。例：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. サーバーはクライアントから送信された資格情報を検証し、要求されたコンテンツで応答します。

## Basic認証を構成する {id="configure"}

`Basic`スキームを使用して`Authorization`ヘッダーにユーザーの資格情報を送信するには、`basic`認証プロバイダーを次のように構成する必要があります。

1. `install`ブロック内で[basic](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html)関数を呼び出します。
2. [BasicAuthCredentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html)を使用して必要な資格情報を提供し、このオブジェクトを[credentials](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html)関数に渡します。
3. `realm`プロパティを使用してレルムを構成します。

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

4. オプションで、`WWW-Authenticate`ヘッダーを含む`401` (Unauthorized) レスポンスを待たずに、初期リクエストで資格情報を送信するように有効にします。ブール値を返す`sendWithoutRequest`関数を呼び出し、リクエストパラメーターをチェックする必要があります。

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

> 完全な例はこちらで確認できます: [client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)。