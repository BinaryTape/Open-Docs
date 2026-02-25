[//]: # (title: Ktor Clientにおけるベーシック認証)

<tldr>
<p>
<b>必要となる依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

ベーシック[認証スキーム](client-auth.md)は、ユーザーのログインに使用できます。このスキームでは、ユーザーの認証情報は、Base64を使用してエンコードされたユーザー名とパスワードのペアとして送信されます。

> サーバー側では、Ktorはベーシック認証を処理するための[Authentication](server-basic-auth.md)プラグインを提供しています。

## ベーシック認証のフロー {id="flow"}

ベーシック認証のフローは以下の通りです：

1. クライアントは、`Authorization`ヘッダーなしでサーバーアプリケーションの保護されたリソースにリクエストを送信します。
2. サーバーは`401 Unauthorized`レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、ベーシック認証が必要であることを示します。典型的な`WWW-Authenticate`ヘッダーは以下のようになります：

   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}

   Ktorクライアントでは、[`sendWithoutRequest()`関数](#configure)を使用することで、`WWW-Authenticate`ヘッダーを待たずに、あらかじめ（先制的に）認証情報を送信することができます。

3. 通常、クライアントはユーザーに認証情報の入力を求めます。その後、Base64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダーを付けてリクエストを送信します。例：

   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. サーバーはクライアントから送信された認証情報を検証し、要求されたコンテンツを返します。

## ベーシック認証の設定 {id="configure"}

`Basic`スキームを使用して`Authorization`ヘッダーでユーザーの認証情報を送信するには、`basic`認証プロバイダーを設定する必要があります：

1. `install(Auth)`ブロック内で[`basic`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html)関数を呼び出します。
2. [`BasicAuthCredentials`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html)を使用して必要な認証情報を指定し、このオブジェクトを[`credentials`](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html)関数に渡します。
3. `realm`プロパティを使用してレルムを設定します。

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

4. （オプション）`sendWithoutRequest`関数を使用して、リクエストパラメータをチェックし、最初のリクエストに認証情報を付加するかどうかを決定する先制的（preemptive）認証を有効にします。

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
5. （オプション）認証情報のキャッシュを無効にします。デフォルトでは、`credentials {}`プロバイダーによって返された認証情報は、リクエスト間で再利用するためにキャッシュされます。`cacheTokens`オプションでキャッシュを無効にできます。

    ```kotlin
    basic {
        cacheTokens = false   // すべてのリクエストで認証情報をリロードする
        // ...
    }
    ```
    キャッシュの無効化は、クライアントセッション中に認証情報が変更される可能性がある場合や、最新の保存状態を反映する必要がある場合に役立ちます。

    > プログラムでキャッシュされた認証情報をクリアする方法の詳細については、一般的な[トークンのキャッシュとキャッシュ制御](client-auth.md#token-caching)セクションを参照してください。

> Ktor Clientにおけるベーシック認証の完全な例については、[client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic)を参照してください。