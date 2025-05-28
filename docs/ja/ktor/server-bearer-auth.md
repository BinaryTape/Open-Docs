[//]: # (title: Ktorサーバーでのベアラー認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-bearer"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

ベアラー認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームには、ベアラー（bearer）トークンと呼ばれるセキュリティトークンが関与します。ベアラー認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、ベアラー トークンを認証するためのカスタムロジックを提供することもできます。

Ktorにおける認証に関する一般情報は、[](server-auth.md)セクションで確認できます。

> ベアラー認証は、[HTTPS/TLS](server-ssl.md)経由でのみ使用されるべきです。

## 依存関係を追加する {id="add_dependencies"}
`bearer`認証を有効にするには、`%artifact_name%`アーティファクトをビルドスクリプトに含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## ベアラー認証フロー {id="flow"}

一般的に、ベアラー認証フローは次のようになります。

1.  ユーザーが認証およびアクセスを正常に認可した後、サーバーはクライアントにアクセストークンを返します。
2.  クライアントは、`Bearer`スキームを使用して`Authorization`ヘッダーでトークンを渡すことで、保護されたリソースへのリクエストを行うことができます。
    ```HTTP
    ```
    {src="snippets/auth-bearer/get.http"}
3.  サーバーはリクエストを受け取り、トークンを[検証](#configure)します。
4.  検証後、サーバーは保護されたリソースのコンテンツで応答します。

## ベアラー認証のインストール {id="install"}
`bearer`認証プロバイダーをインストールするには、`install`ブロック内で[bearer](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/bearer.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    bearer {
        // ベアラー認証を設定
    }
}
```

オプションで、[指定されたルートを認証する](#authenticate-route)ために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## ベアラー認証の構成 {id="configure"}

Ktorでさまざまな認証プロバイダーを構成する方法の一般的なアイデアについては、[](server-auth.md#configure)を参照してください。このセクションでは、`bearer`認証プロバイダーの構成の詳細について説明します。

### ステップ1：ベアラープロバイダーの構成 {id="configure-provider"}

`bearer`認証プロバイダーは、[BearerAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-bearer-authentication-provider/-config/index.html)クラスを介してその設定を公開します。以下の例では、次の設定が指定されています。
*   `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
*   `authenticate`関数は、クライアントによって送信されたトークンをチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="9-20"}

### ステップ2：特定のリソースを保護する {id="authenticate-route"}

`bearer`プロバイダーを構成した後、アプリケーション内の特定のリソースを**[authenticate](server-auth.md#authenticate-route)**関数を使用して保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
```
{src="snippets/auth-bearer/src/main/kotlin/com/example/Application.kt" include-lines="21-27"}