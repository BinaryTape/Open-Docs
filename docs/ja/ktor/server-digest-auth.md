[//]: # (title: KtorサーバーにおけるDigest認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>サポート</b>: ✖️
    </p>
    
</tldr>

Digest認証スキームは、アクセスコントロールと認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー名とパスワードをネットワーク経由で送信する前にハッシュ関数が適用されます。

Ktorでは、ユーザーのログインと特定の[ルート](server-routing.md)の保護にDigest認証を使用できます。Ktorでの認証に関する一般的な情報については、[認証](server-auth.md)セクションを参照してください。

## 依存関係を追加する {id="add_dependencies"}
`digest`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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
    

## Digest認証フロー {id="flow"}

Digest認証フローは次のようになります。

1. クライアントは、サーバーアプリケーション内の特定の[ルート](server-routing.md)に対して、`Authorization`ヘッダーなしでリクエストを行います。
2. サーバーはクライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、そのルートを保護するためにDigest認証スキームが使用されているという情報を提供します。典型的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   Ktorでは、`digest`認証プロバイダーを[構成する](#configure-provider)際に、レルムとnonce値の生成方法を指定できます。

3. 通常、クライアントはログインダイアログを表示し、そこでユーザーは資格情報を入力できます。その後、クライアントは次の`Authorization`ヘッダーを含むリクエストを行います。

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response`値は次のように生成されます。
   
   a. `HA1 = MD5(username:realm:password)`
   > この部分はサーバーに[保存され](#digest-table)、Ktorによってユーザー資格情報の検証に使用されます。
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

4. サーバーはクライアントから送信された資格情報を[検証し](#configure-provider)、要求されたコンテンツで応答します。

## Digest認証のインストール {id="install"}
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
オプションで、[指定されたルートを認証する](#authenticate-route)ために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## Digest認証の構成 {id="configure"}

Ktorで異なる認証プロバイダーを構成する方法の一般的な考え方については、[認証](server-auth.md#configure)を参照してください。このセクションでは、`digest`認証プロバイダーの構成の具体的な内容について見ていきます。

### ステップ1: ダイジェストを含むユーザーテーブルを提供する {id="digest-table"}

`digest`認証プロバイダーは、ダイジェストメッセージの`HA1`部分を使用してユーザー資格情報を検証します。そのため、ユーザー名とそれに対応する`HA1`ハッシュを含むユーザーテーブルを提供できます。以下の例では、`getMd5Digest`関数が`HA1`ハッシュの生成に使用されています。

[object Promise]

### ステップ2: Digestプロバイダーを構成する {id="configure-provider"}

`digest`認証プロバイダーは、[DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html)クラスを介して設定を公開します。以下の例では、次の設定が指定されています。
* `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
* `digestProvider`関数は、指定されたユーザー名に対してダイジェストの`HA1`部分をフェッチします。
* (オプション) `validate`関数は、資格情報をカスタムの[Principal](Principal)にマッピングすることを可能にします。

[object Promise]

また、[nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html)プロパティを使用してノンス値の生成方法を指定することもできます。

### ステップ3: 特定のリソースを保護する {id="authenticate-route"}

`digest`プロバイダーを構成した後、アプリケーション内の特定のリソースを**[authenticate](server-auth.md#authenticate-route)**関数を使用して保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)を取得し、認証されたユーザー名を取得できます。

[object Promise]