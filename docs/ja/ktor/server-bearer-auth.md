[//]: # (title: Ktor ServerでのBearer認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✅
    </p>
    
</tldr>

Bearer認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ベアラートークンと呼ばれるセキュリティトークンが関与します。Bearer認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、ベアラートークンを承認するためのカスタムロジックを提供することもできます。

Ktorでの認証に関する一般情報は、[](server-auth.md)セクションで確認できます。

> Bearer認証は、[HTTPS/TLS](server-ssl.md)経由でのみ使用すべきです。

## 依存関係の追加 {id="add_dependencies"}
`bearer`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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
    

## Bearer認証フロー {id="flow"}

一般的に、Bearer認証フローは次のようになります。

1. ユーザーが認証してアクセスを許可すると、サーバーはクライアントにアクセストークンを返します。
2. クライアントは、`Authorization`ヘッダーで`Bearer`スキームを使用して渡されたトークンとともに、保護されたリソースにリクエストを行うことができます。
   [object Promise]
3. サーバーはリクエストを受信し、トークンを[検証](#configure)します。
4. 検証後、サーバーは保護されたリソースのコンテンツで応答します。

## Bearer認証のインストール {id="install"}
`bearer`認証プロバイダーをインストールするには、`install`ブロック内で[bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // Configure bearer authentication
    }
}
```

オプションで、[特定のルートを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## Bearer認証の設定 {id="configure"}

Ktorで異なる認証プロバイダーを設定する方法の概要を把握するには、[](server-auth.md#configure)を参照してください。このセクションでは、`bearer`認証プロバイダーの構成の詳細について説明します。

### ステップ1: ベアラープロバイダーの設定 {id="configure-provider"}

`bearer`認証プロバイダーは、[BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html)クラスを介して設定を公開します。以下の例では、次の設定が指定されています。
*   `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
*   `authenticate`関数は、クライアントから送信されたトークンをチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。

[object Promise]

### ステップ2: 特定のリソースを保護する {id="authenticate-route"}

`bearer`プロバイダーを設定した後、アプリケーション内の特定のリソースを**[authenticate](server-auth.md#authenticate-route)**関数を使用して保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザー名を取得できます。

[object Promise]