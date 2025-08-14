[//]: # (title: JSON Webトークン)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートし、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

<link-summary>
%plugin_name%プラグインを使用すると、JSON Webトークン（JWT）を使用してクライアントを認証できます。
</link-summary>

[JSON Webトークン（JWT）](https://jwt.io/)は、情報をJSONオブジェクトとして安全にパーティ間で送信する方法を定義するオープンスタンダードです。この情報は、共有シークレット（`HS256`アルゴリズムを使用）または公開/秘密鍵ペア（例：`RS256`）を使用して署名されているため、検証および信頼することができます。

Ktorは、`Authorization`ヘッダーで`Bearer`スキームを使用して渡されるJWTを処理し、以下のことを可能にします。
*   JSON Webトークンの署名を検証する。
*   JWTペイロードに対して追加の検証を実行する。

> Ktorにおける認証と認可に関する一般的な情報は、[](server-auth.md)セクションで確認できます。

## 依存関係を追加する {id="add_dependencies"}
`JWT`認証を有効にするには、`ktor-server-auth`および`ktor-server-auth-jwt`アーティファクトをビルドスクリプトに含める必要があります。

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

## JWT認可フロー {id="flow"}
KtorにおけるJWT認可フローは以下のようになります。
1.  クライアントは、サーバーアプリケーション内の特定の認証[ルート](server-routing.md)に対して、資格情報を含む`POST`リクエストを行います。以下の例は、JSONで渡される資格情報を含む[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の`POST`リクエストを示しています。
    [object Promise]
2.  資格情報が有効な場合、サーバーはJSON Webトークンを生成し、指定されたアルゴリズムで署名します。例えば、これは特定の共有シークレットを使用する`HS256`、または公開/秘密鍵ペアを使用する`RS256`である場合があります。
3.  サーバーは生成されたJWTをクライアントに送信します。
4.  クライアントは、`Authorization`ヘッダーで`Bearer`スキームを使用してJSON Webトークンを渡すことで、保護されたリソースにリクエストを行えるようになります。
    [object Promise]
5.  サーバーはリクエストを受信し、以下の検証を実行します。
    *   トークンの署名を検証します。なお、[検証方法](#configure-verifier)はトークンの署名に使用されたアルゴリズムによって異なります。
    *   JWTペイロードに対して[追加の検証](#validate-payload)を実行します。
6.  検証後、サーバーは保護されたリソースのコンテンツで応答します。

## JWTをインストールする {id="install"}
`jwt`認証プロバイダーをインストールするには、`install`ブロック内で[jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // Configure jwt authentication
    }
}
```
オプションで、[指定されたルートを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## JWTを設定する {id="configure-jwt"}
このセクションでは、サーバーKtorアプリケーションでJSON Webトークンを使用する方法を見ていきます。トークンの検証方法が少し異なるため、トークンに署名する2つのアプローチを説明します。
*   指定された共有シークレットを使用した`HS256`。
*   公開/秘密鍵ペアを使用した`RS256`。

完全なプロジェクトは、こちらで確認できます：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)、[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### ステップ1：JWT設定を構成する {id="jwt-settings"}

JWT関連の設定を構成するには、[設定ファイル](server-configuration-file.topic)にカスタムの`jwt`グループを作成できます。例えば、`application.conf`ファイルは以下のようになる場合があります。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

> シークレット情報は、設定ファイルにプレーンテキストで保存すべきではありません。そのようなパラメータを指定するには、[環境変数](server-configuration-file.topic#environment-variables)の使用を検討してください。
>
{type="warning"}

これらの設定には、以下の方法で[コードからアクセス](server-configuration-file.topic#read-configuration-in-code)できます。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### ステップ2：トークンを生成する {id="generate"}

JSON Webトークンを生成するには、[JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)を使用できます。以下のコードスニペットは、`HS256`と`RS256`の両方のアルゴリズムでこれを行う方法を示しています。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

1.  `post("/login")`は、`POST`リクエストを受信するための認証[ルート](server-routing.md)を定義します。
2.  `call.receive<User>()`は、JSONオブジェクトとして送信されたユーザー資格情報を[受信](server-serialization.md#receive_data)し、それを`User`クラスオブジェクトに変換します。
3.  `JWT.create()`は、指定されたJWT設定でトークンを生成し、受信したユーザー名を含むカスタムクレームを追加し、指定されたアルゴリズムでトークンに署名します。
    *   `HS256`の場合、共有シークレットがトークン署名に使用されます。
    *   `RS256`の場合、公開/秘密鍵ペアが使用されます。
4.  `call.respond`は、JSONオブジェクトとしてトークンをクライアントに[送信](server-serialization.md#send_data)します。

### ステップ3：レルムを設定する {id="realm"}
`realm`プロパティを使用すると、[保護されたルート](#authenticate-route)にアクセスする際に`WWW-Authenticate`ヘッダーで渡されるレルムを設定できます。

[object Promise]

### ステップ4：トークンベリファイアを設定する {id="configure-verifier"}

`verifier`関数を使用すると、トークンのフォーマットとその署名を検証できます。
*   `HS256`の場合、トークンを検証するために[JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html)インスタンスを渡す必要があります。
*   `RS256`の場合、トークン検証に使用される公開鍵にアクセスするためのJWKSエンドポイントを指定する[JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)を渡す必要があります。この例では、発行者が`http://0.0.0.0:8080`であるため、JWKSエンドポイントのアドレスは`http://0.0.0.0:8080/.well-known/jwks.json`になります。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

[object Promise]

</tab>
<tab title="RS256" group-key="rs256">

[object Promise]

</tab>
</tabs>

### ステップ5：JWTペイロードを検証する {id="validate-payload"}

1.  `validate`関数を使用すると、JWTペイロードに対して追加の検証を実行できます。`credential`パラメータは[JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)オブジェクトを表し、JWTペイロードを含みます。以下の例では、カスタム`username`クレームの値がチェックされます。
    [object Promise]
    
    認証が成功した場合は、[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を返します。
2.  `challenge`関数を使用すると、認証が失敗した場合に送信される応答を構成できます。
    [object Promise]

### ステップ6：特定のリソースを保護する {id="authenticate-route"}

`jwt`プロバイダーを構成した後、アプリケーション内の特定のリソースを**[authenticate](server-auth.md#authenticate-route)**関数を使用して保護できます。認証が成功した場合、`call.principal`関数を使用してルートハンドラー内で認証済み[JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を取得し、JWTペイロードを取得できます。以下の例では、カスタム`username`クレームの値とトークンの有効期限が取得されます。

[object Promise]