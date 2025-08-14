[//]: # (title: Ktorサーバーでのフォームベース認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>コード例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl">auth-form-html-dsl</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session">auth-form-session</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

フォームベース認証は、[ウェブフォーム](https://developer.mozilla.org/en-US/docs/Learn/Forms)を使用して認証情報を収集し、ユーザーを認証します。
Ktorでウェブフォームを作成するには、[HTML DSL](server-html-dsl.md#html_response)を使用するか、FreeMarker、Velocityなど、JVMの[テンプレートエンジン](server-templating.md)を選択できます。

> フォームベース認証を使用する場合、ユーザー名とパスワードは平文で渡されるため、機密情報を保護するために[HTTPS/TLS](server-ssl.md)を使用する必要があります。

## 依存関係を追加する {id="add_dependencies"}
`form`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## フォームベース認証フロー {id="flow"}

フォームベース認証フローは次のようになるでしょう。

1. 未認証のクライアントが、サーバーアプリケーション内の特定の[ルート](server-routing.md)にリクエストを行います。
2. サーバーは、少なくともHTMLベースのウェブフォームで構成され、ユーザーにユーザー名とパスワードの入力を促すHTMLページを返します。 
   > Ktorでは、[Kotlin DSL](server-html-dsl.md)を使用してフォームを構築できるほか、FreeMarker、Velocityなど、さまざまなJVMテンプレートエンジンを選択できます。
3. ユーザーがユーザー名とパスワードを送信すると、クライアントはウェブフォームデータ（ユーザー名とパスワードを含む）を含むリクエストをサーバーに行います。
   
   [object Promise]
   
   Ktorでは、ユーザー名とパスワードを取得するために使用される[パラメータ名を指定する](#configure-provider)必要があります。

4. サーバーはクライアントから送信されたクレデンシャルを[検証](#configure-provider)し、要求されたコンテンツで応答します。

## フォーム認証のインストール {id="install"}
`form`認証プロバイダーをインストールするには、`install`ブロック内で[form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html)関数を呼び出します。

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

オプションで、[指定されたルートを認証する](#authenticate-route)ために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## フォーム認証の設定 {id="configure"}

### ステップ1: フォームプロバイダーの設定 {id="configure-provider"}
`form`認証プロバイダーは、[FormAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-form-authentication-provider/-config/index.html)クラス経由で設定を公開します。以下の例では、次の設定が指定されています。
*   `userParamName`および`passwordParamName`プロパティは、ユーザー名とパスワードを取得するために使用されるパラメータ名を指定します。
*   `validate`関数は、ユーザー名とパスワードを検証します。
    `validate`関数は`UserPasswordCredential`をチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。
*   `challenge`関数は、認証が失敗した場合に実行されるアクションを指定します。例えば、ログインページにリダイレクトしたり、[UnauthorizedResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)を送信したりできます。

[object Promise]

> `basic`認証と同様に、ユーザー名とパスワードのハッシュを保持するインメモリテーブルに保存されているユーザーを検証するために、[UserHashedTableAuth](server-basic-auth.md#validate-user-hash)も使用できます。

### ステップ2: 特定のリソースを保護する {id="authenticate-route"}

`form`プロバイダーを設定した後、データが送信される`post`ルートを定義する必要があります。
次に、このルートを**[authenticate](server-auth.md#authenticate-route)**関数内に追加します。
認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

[object Promise]

ログインしたユーザーのIDを保存するために、[セッション認証](server-session-auth.md)を使用できます。
例えば、ユーザーが初めてウェブフォームを使用してログインするとき、ユーザー名をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認証できます。