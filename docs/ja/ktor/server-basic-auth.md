[//]: # (title: Ktor Serverにおける基本認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

基本認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー認証情報がBase64でエンコードされたユーザー名/パスワードのペアとして送信されます。

Ktorでは、ユーザーのログインや特定の[ルート](server-routing.md)を保護するために基本認証を使用できます。Ktorでの認証に関する一般的な情報は、[](server-auth.md)セクションを参照してください。

> 基本認証ではユーザー名とパスワードが平文で渡されるため、機密情報を保護するには[HTTPS/TLS](server-ssl.md)を使用する必要があります。

## 依存関係の追加 {id="add_dependencies"}
`basic`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 基本認証フロー {id="flow"}

基本認証フローは次のようになります。

1.  クライアントは、サーバーアプリケーション内の特定の[ルート](server-routing.md)に対して、`Authorization`ヘッダーなしでリクエストを行います。
2.  サーバーは、クライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、そのルートが基本認証スキームによって保護されているという情報を提供します。一般的な`WWW-Authenticate`ヘッダーは次のようになります。

    ```
    WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
    ```
    {style="block"}

    Ktorでは、`basic`認証プロバイダを[設定する](#configure-provider)際に、対応するプロパティを使用してrealmとcharsetを指定できます。

3.  通常、クライアントはログインダイアログを表示し、ユーザーが認証情報を入力できるようにします。その後、クライアントはBase64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダーでリクエストを行います。例:

    ```
    Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
    ```
    {style="block"}

4.  サーバーは、クライアントから送信された認証情報を[検証し](#configure-provider)、リクエストされたコンテンツで応答します。

## 基本認証のインストール {id="install"}
`basic`認証プロバイダをインストールするには、`install`ブロック内で[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // 基本認証を設定
    }
}
```

オプションで[プロバイダ名](server-auth.md#provider-name)を指定できます。これは[指定されたルートを認証する](#authenticate-route)ために使用できます。

## 基本認証の設定 {id="configure"}

Ktorで異なる認証プロバイダを設定する方法の一般的な概念については、[](server-auth.md#configure)を参照してください。このセクションでは、`basic`認証プロバイダの設定の詳細について説明します。

### ステップ1: basicプロバイダの設定 {id="configure-provider"}

`basic`認証プロバイダは、[BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスを介して設定を公開しています。以下の例では、次の設定が指定されています。
*   `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるrealmを設定します。
*   `validate`関数は、ユーザー名とパスワードを検証します。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}

`validate`関数は`UserPasswordCredential`をチェックし、認証が成功した場合は`UserIdPrincipal`を、認証が失敗した場合は`null`を返します。
> [UserHashedTableAuth](#validate-user-hash)を使用して、ユーザー名とパスワードハッシュを保持するインメモリテーブルに格納されているユーザーを検証することもできます。

### ステップ2: 特定のリソースの保護 {id="authenticate-route"}

`basic`プロバイダを設定した後、**[authenticate](server-auth.md#authenticate-route)**関数を使用して、アプリケーション内の特定のリソースを保護できます。認証が成功した場合、ルートハンドラ内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

## UserHashedTableAuthによる検証 {id="validate-user-hash"}

Ktorでは、[UserHashedTableAuth](#validate-user-hash)を使用して、ユーザー名とパスワードハッシュを保持するインメモリテーブルに格納されているユーザーを[検証](#configure-provider)できます。これにより、データソースが漏洩した場合でもユーザーのパスワードが漏洩しないようにできます。

ユーザーの検証に`UserHashedTableAuth`を使用するには、以下の手順に従ってください。

1.  [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html)関数を使用して、指定されたアルゴリズムとソルトプロバイダでダイジェスト関数を作成します。

    ```kotlin
    ```
    {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="9"}

2.  `UserHashedTableAuth`の新しいインスタンスを初期化し、次のプロパティを指定します。
    *   `table`プロパティを使用して、ユーザー名とハッシュ化されたパスワードのテーブルを提供します。
    *   `digester`プロパティにダイジェスト関数を割り当てます。

    ```kotlin
    ```
    {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="10-16"}

3.  `validate`関数内で[UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html)関数を呼び出してユーザーを認証し、認証情報が有効な場合は`UserIdPrincipal`のインスタンスを返します。

    ```kotlin
    ```
    {src="snippets/auth-basic-hash-table/src/main/kotlin/com/example/Application.kt" include-lines="19-26"}