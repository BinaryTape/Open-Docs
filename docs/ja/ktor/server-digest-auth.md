[//]: # (title: Ktor Serverにおけるダイジェスト認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

ダイジェスト認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー名とパスワードにハッシュ関数が適用されてから、それらがネットワーク経由で送信されます。

Ktorでは、ユーザーのログインや特定の[ルート](server-routing.md)の保護にダイジェスト認証を使用できます。Ktorにおける認証に関する一般的な情報は、[](server-auth.md)セクションで確認できます。

## 依存関係の追加 {id="add_dependencies"}
`digest`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## ダイジェスト認証フロー {id="flow"}

ダイジェスト認証フローは次のようになります。

1. クライアントは、サーバーアプリケーションの特定の[ルート](server-routing.md)に対して、`Authorization`ヘッダーなしでリクエストを行います。
1. サーバーはクライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、ダイジェスト認証スキームがルートを保護するために使用されているという情報を提供します。典型的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   Ktorでは、`digest`認証プロバイダーを[設定](#configure-provider)する際に、レルムとナンス値（nonce value）を生成する方法を指定できます。

1. 通常、クライアントはユーザーが認証情報を入力できるログインダイアログを表示します。その後、クライアントは次の`Authorization`ヘッダーを含むリクエストを行います。

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response`の値は次のように生成されます。
   
   a. `HA1 = MD5(username:realm:password)`
   > この部分はサーバーに[保存](#digest-table)され、Ktorがユーザーの認証情報を検証するために使用できます。
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

1. サーバーはクライアントから送信された認証情報を[検証](#configure-provider)し、リクエストされたコンテンツで応答します。

## ダイジェスト認証のインストール {id="install"}
`digest`認証プロバイダーをインストールするには、`install`ブロック内で[digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // Configure digest authentication
    }
}
```
オプションで、[指定されたルートを認証](#authenticate-route)するために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## ダイジェスト認証の設定 {id="configure"}

Ktorでさまざまな認証プロバイダーを設定する方法の一般的な概念については、[](server-auth.md#configure)を参照してください。このセクションでは、`digest`認証プロバイダーの設定の具体的な内容を見ていきます。

### ステップ1: ダイジェストを含むユーザーテーブルを提供する {id="digest-table"}

`digest`認証プロバイダーは、ダイジェストメッセージの`HA1`部分を使用してユーザーの認証情報を検証します。そのため、ユーザー名と対応する`HA1`ハッシュを含むユーザーテーブルを提供できます。以下の例では、`getMd5Digest`関数が`HA1`ハッシュの生成に使用されています。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="10-16"}

### ステップ2: ダイジェストプロバイダーを設定する {id="configure-provider"}

`digest`認証プロバイダーは、[DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html)クラスを介してその設定を公開します。以下の例では、次の設定が指定されています。
* `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
* `digestProvider`関数は、指定されたユーザー名のダイジェストの`HA1`部分を取得します。
* (オプション)`validate`関数を使用すると、認証情報をカスタムプリンシパルにマッピングできます。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="18-33,41-43"}

[nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html)プロパティを使用して、ナンス値の生成方法を指定することもできます。

### ステップ3: 特定のリソースを保護する {id="authenticate-route"}

`digest`プロバイダーを設定した後、**[authenticate](server-auth.md#authenticate-route)** 関数を使用して、アプリケーション内の特定の**リソース**を保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
```
{src="snippets/auth-digest/src/main/kotlin/authdigest/Application.kt" include-lines="34-40"}