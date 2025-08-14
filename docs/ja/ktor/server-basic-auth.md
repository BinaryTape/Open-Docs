[//]: # (title: KtorサーバーでのBasic認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

Basic認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー認証情報はBase64でエンコードされたユーザー名/パスワードのペアとして送信されます。

Ktorでは、ユーザーのログインや特定の[ルーティング](server-routing.md)の保護にBasic認証を使用できます。Ktorでの認証に関する一般的な情報は、[](server-auth.md)セクションで確認できます。

> Basic認証はユーザー名とパスワードを平文で渡すため、機密情報を保護するには[HTTPS/TLS](server-ssl.md)を使用する必要があります。

## 依存関係の追加 {id="add_dependencies"}
`basic`認証を有効にするには、`%artifact_name%`アーティファクトをビルドスクリプトに含める必要があります。

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
    

## Basic認証フロー {id="flow"}

Basic認証のフローは次のとおりです。

1. クライアントは、サーバーアプリケーション内の特定の[ルーティング](server-routing.md)に対し、`Authorization`ヘッダーなしでリクエストを送信します。
2. サーバーはクライアントに対し`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、Basic認証スキームがルーティングを保護するために使用されているという情報を提供します。一般的な`WWW-Authenticate`ヘッダーは次のようになります。
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   Ktorでは、`basic`認証プロバイダーを[設定](#configure-provider)する際に、対応するプロパティを使用してレルムと文字セットを指定できます。

3. 通常、クライアントはユーザーが認証情報を入力できるログインダイアログを表示します。その後、クライアントはBase64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダー付きでリクエストを送信します。例：
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4. サーバーはクライアントから送信された認証情報を[検証](#configure-provider)し、要求されたコンテンツで応答します。

## Basic認証のインストール {id="install"}
`basic`認証プロバイダーをインストールするには、`install`ブロック内で[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // Configure basic authentication
    }
}
```

必要に応じて、[指定されたルーティングを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## Basic認証の設定 {id="configure"}

Ktorで異なる認証プロバイダーを設定する方法の概要については、[](server-auth.md#configure)を参照してください。このセクションでは、`basic`認証プロバイダーの設定の詳細について説明します。

### ステップ1: Basicプロバイダーの設定 {id="configure-provider"}

`basic`認証プロバイダーは、[BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスを介してその設定を公開しています。以下の例では、次の設定が指定されています。
* `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
* `validate`関数は、ユーザー名とパスワードを検証します。

[object Promise]
   
`validate`関数は`UserPasswordCredential`をチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。
> ユーザー名とパスワードハッシュを保持するインメモリテーブルに保存されているユーザーを検証するには、[UserHashedTableAuth](#validate-user-hash)も使用できます。

### ステップ2: 特定のリソースを保護する {id="authenticate-route"}

`basic`プロバイダーの設定後、**[authenticate](server-auth.md#authenticate-route)** 関数を使用してアプリケーション内の特定のリソースを保護できます。認証が成功した場合、`call.principal`関数を使用してルーティングハンドラー内で認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

[object Promise]

## UserHashedTableAuthによる検証 {id="validate-user-hash"}

Ktorでは、ユーザー名とパスワードハッシュを保持するインメモリテーブルに保存されているユーザーを[検証](#configure-provider)するために、[UserHashedTableAuth](#validate-user-hash)を使用できます。これにより、データソースが漏洩した場合でもユーザーパスワードが危殆化するのを防ぐことができます。

ユーザーを検証するために`UserHashedTableAuth`を使用するには、以下の手順に従います。

1. [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html)関数を使用して、指定されたアルゴリズムとソルトプロバイダーを持つダイジェスト関数を作成します。
   
   [object Promise]

2. `UserHashedTableAuth`の新しいインスタンスを初期化し、次のプロパティを指定します。
   * `table`プロパティを使用して、ユーザー名とハッシュ化されたパスワードのテーブルを提供します。
   * `digester`プロパティにダイジェスト関数を割り当てます。
   
   [object Promise]
   
3. `validate`関数内で、[UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html)関数を呼び出してユーザーを認証し、認証情報が有効な場合は`UserIdPrincipal`のインスタンスを返します。

   [object Promise]