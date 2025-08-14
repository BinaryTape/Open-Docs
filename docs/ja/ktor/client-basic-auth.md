[//]: # (title: Ktor ClientでのBasic認証)

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

Basic [認証スキーム](client-auth.md)は、ユーザーのログインに使用できます。このスキームでは、ユーザー認証情報がBase64でエンコードされたユーザー名/パスワードのペアとして送信されます。

> サーバー側では、KtorはBasic認証を処理するための[Authentication](server-basic-auth.md)プラグインを提供しています。

## Basic認証のフロー {id="flow"}

Basic認証のフローは次のようになります。

1.  クライアントは、`Authorization`ヘッダーなしで、サーバーアプリケーション内の特定のリソースにリクエストを送信します。
2.  サーバーは、クライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、Basic認証スキームがルートを保護するために使用されているという情報を提供します。典型的な`WWW-Authenticate`ヘッダーは次のようになります。

    ```
    WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
    ```
    {style="block"}

    Ktorクライアントでは、`sendWithoutRequest` [関数](#configure) を使用して、`WWW-Authenticate`ヘッダーを待たずに認証情報を送信できます。

3.  通常、クライアントはユーザーが認証情報を入力できるログインダイアログを表示します。その後、クライアントはBase64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダーを持つリクエストを送信します。例：

    ```
    Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
    ```
    {style="block"}

4.  サーバーはクライアントから送信された認証情報を検証し、要求されたコンテンツで応答します。

## Basic認証の構成 {id="configure"}

`Basic`スキームを使用して`Authorization`ヘッダーにユーザー認証情報を送信するには、`basic`認証プロバイダーを次のように構成する必要があります。

1.  `install`ブロック内で[basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 関数を呼び出します。
2.  [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html) を使用して必要な認証情報を提供し、このオブジェクトを[credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 関数に渡します。
3.  `realm`プロパティを使用してレルムを構成します。

    [object Promise]

4.  オプションで、`WWW-Authenticate`ヘッダーを持つ`401` (Unauthorized) レスポンスを待たずに、最初のリクエストで認証情報を送信できるようにします。booleanを返す`sendWithoutRequest`関数を呼び出し、リクエストパラメータをチェックする必要があります。

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