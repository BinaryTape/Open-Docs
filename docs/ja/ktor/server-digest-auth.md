[//]: # (title: KtorサーバーでのDigest認証)

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
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

Digest認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー名とパスワードをネットワーク経由で送信する前に、ハッシュ関数が適用されます。

Ktorでは、ユーザーのログインと特定の[ルート](server-routing.md)の保護にDigest認証を使用できます。Ktorでの認証に関する一般情報は、[Ktorサーバーでの認証と認可](server-auth.md)セクションで確認できます。

## 依存関係の追加 {id="add_dependencies"}
`digest`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## Digest認証フロー {id="flow"}

Digest認証フローは次のようになります。

1. クライアントは、`Authorization`ヘッダーなしで、サーバーアプリケーション内の特定の[ルート](server-routing.md)にリクエストを行います。
2. サーバーは、クライアントに`401`（Unauthorized）応答ステータスで応答し、`WWW-Authenticate`応答ヘッダーを使用して、そのルートを保護するためにDigest認証スキームが使用されているという情報を提供します。一般的な`WWW-Authenticate`ヘッダーは次のようになります。

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   Ktorでは、`digest`認証プロバイダーを[設定する](#configure-provider)際に、レルムとノンス値の生成方法を指定できます。

3. 通常、クライアントはユーザーが資格情報を入力できるログインダイアログを表示します。その後、クライアントは次の`Authorization`ヘッダーを含むリクエストを行います。

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
   > この部分はサーバーに[保存され](#digest-table)、Ktorがユーザーの資格情報を検証するために使用できます。
   
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
        // Digest認証を設定します
    }
}
```
オプションで、[指定されたルートを認証する](#authenticate-route)ために使用できる[プロバイダー名](server-auth.md#provider-name)を指定できます。

## Digest認証の設定 {id="configure"}

Ktorで異なる認証プロバイダーを設定する方法の概要については、[認証の設定](server-auth.md#configure)を参照してください。このセクションでは、`digest`認証プロバイダーの設定の詳細について説明します。

### ステップ1: ダイジェストを含むユーザーテーブルの提供 {id="digest-table"}

`digest`認証プロバイダーは、ダイジェストメッセージの`HA1`部分を使用してユーザーの資格情報を検証します。したがって、ユーザー名とそれに対応する`HA1`ハッシュを含むユーザーテーブルを提供できます。以下の例では、`getMd5Digest`関数を使用して`HA1`ハッシュを生成しています。

```kotlin
fun getMd5Digest(str: String): ByteArray = MessageDigest.getInstance("MD5").digest(str.toByteArray(UTF_8))

val myRealm = "Access to the '/' path"
val userTable: Map<String, ByteArray> = mapOf(
    "jetbrains" to getMd5Digest("jetbrains:$myRealm:foobar"),
    "admin" to getMd5Digest("admin:$myRealm:password")
)
```

### ステップ2: Digestプロバイダーの設定 {id="configure-provider"}

`digest`認証プロバイダーは、[DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html)クラスを介して設定を公開します。以下の例では、次の設定が指定されています。
* `realm`プロパティは、`WWW-Authenticate`ヘッダーで渡されるレルムを設定します。
* `digestProvider`関数は、指定されたユーザー名のダイジェストの`HA1`部分を取得します。
* (オプション) `validate`関数を使用すると、資格情報をカスタムプリンシパルにマッピングできます。

```kotlin
fun Application.main() {
    install(Authentication) {
        digest("auth-digest") {
            realm = myRealm
            digestProvider { userName, realm ->
                userTable[userName]
            }
            validate { credentials ->
                if (credentials.userName.isNotEmpty()) {
                    CustomPrincipal(credentials.userName, credentials.realm)
                } else {
                    null
                }
            }
        }
    }
}

data class CustomPrincipal(val userName: String, val realm: String)
```

[nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html)プロパティを使用して、ノンス値の生成方法を指定することもできます。

### ステップ3: 特定のリソースを保護する {id="authenticate-route"}

`digest`プロバイダーを設定した後、**[authenticate](server-auth.md#authenticate-route)**関数を使用してアプリケーション内の特定のリソースを保護できます。認証が成功した場合、`call.principal`関数を使用してルートハンドラー内で認証された[Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
routing {
    authenticate("auth-digest") {
        get("/") {
            call.respondText("Hello, ${call.principal<CustomPrincipal>()?.userName}!")
        }
    }
}