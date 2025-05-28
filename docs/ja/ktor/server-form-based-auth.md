[//]: # (title: Ktorサーバーでのフォームベース認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl">auth-form-html-dsl</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session">auth-form-session</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

フォームベース認証は、[Webフォーム](https://developer.mozilla.org/en-US/docs/Learn/Forms)を使用して認証情報を収集し、ユーザーを認証します。KtorでWebフォームを作成するには、[HTML DSL](server-html-dsl.md#html_response)を使用するか、またはJVMの[テンプレートエンジン](server-templating.md)（FreeMarker、Velocityなど）のいずれかを選択できます。

> フォームベース認証ではユーザー名とパスワードが平文で渡されるため、機密情報を保護するために[HTTPS/TLS](server-ssl.md)を使用する必要があります。

## 依存関係を追加する {id="add_dependencies"}
`form`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## フォームベース認証のフロー {id="flow"}

フォームベース認証のフローは次のようになります。

1. 未認証のクライアントが、サーバーアプリケーション内の特定の[ルート](server-routing.md)にリクエストを行います。
2. サーバーは、少なくともHTMLベースのWebフォームで構成されたHTMLページを返します。このフォームはユーザーにユーザー名とパスワードの入力を促します。
   > Ktorでは、[Kotlin DSL](server-html-dsl.md)を使用してフォームを構築できます。または、FreeMarker、Velocityなど、さまざまなJVMテンプレートエンジンから選択できます。
3. ユーザーがユーザー名とパスワードを送信すると、クライアントはWebフォームデータ（ユーザー名とパスワードを含む）をサーバーに送信するリクエストを行います。
   
   ```kotlin
   ```
   {src="snippets/auth-form-html-dsl/post.http"}
   
   Ktorでは、ユーザー名とパスワードを取得するために使用する[パラメータ名](#configure-provider)を指定する必要があります。

4. サーバーはクライアントから送信された認証情報を[検証](#configure-provider)し、要求されたコンテンツで応答します。

## フォーム認証のインストール {id="install"}
`form`認証プロバイダをインストールするには、`install`ブロック内で[form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    form {
        // Configure form authentication
    }
}
```

オプションで、[指定されたルートを認証](#authenticate-route)するために使用できる[プロバイダ名](server-auth.md#provider-name)を指定できます。

## フォーム認証の設定 {id="configure"}

### ステップ1: フォームプロバイダの設定 {id="configure-provider"}
`form`認証プロバイダは、[FormAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-form-authentication-provider/-config/index.html)クラスを介して設定を公開します。以下の例では、次の設定が指定されています。
* `userParamName`プロパティと`passwordParamName`プロパティは、ユーザー名とパスワードを取得するために使用するパラメータ名を指定します。
* `validate`関数は、ユーザー名とパスワードを検証します。
  `validate`関数は`UserPasswordCredential`をチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。
* `challenge`関数は、認証が失敗した場合に実行されるアクションを指定します。例えば、ログインページにリダイレクトしたり、[UnauthorizedResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)を送信したりできます。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="12-27"}

> `basic`認証と同様に、[UserHashedTableAuth](server-basic-auth.md#validate-user-hash)を使用して、ユーザー名とパスワードのハッシュを保持するインメモリテーブルに保存されているユーザーを検証することもできます。

### ステップ2: 特定のリソースを保護する {id="authenticate-route"}

`form`プロバイダを設定した後、データを送信する`post`ルートを定義する必要があります。
次に、このルートを**[authenticate](server-auth.md#authenticate-route)**関数内に記述します。
認証が成功した場合、ルートハンドラ内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="29-34,55"}

ログインしたユーザーのIDを保存するには、[セッション認証](server-session-auth.md)を使用できます。
例えば、ユーザーがWebフォームを使用して初めてログインする際に、ユーザー名をクッキーセッションに保存し、その後のリクエストで`session`プロバイダを使用してこのユーザーを認証できます。