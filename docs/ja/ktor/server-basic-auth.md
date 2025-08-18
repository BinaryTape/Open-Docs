[//]: # (title: Ktor ServerにおけるBasic認証)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic">auth-basic</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-basic-hash-table">auth-basic-hash-table</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

Basic認証スキームは、アクセス制御と認証に使用される[HTTPフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)の一部です。このスキームでは、ユーザー認証情報はユーザー名とパスワードのペアとしてBase64でエンコードされて送信されます。

Ktorでは、ユーザーのログインや特定の[ルート](server-routing.md)の保護にBasic認証を使用できます。Ktorでの認証に関する一般的な情報は、[Ktor Serverにおける認証と認可](server-auth.md)セクションで確認できます。

> Basic認証ではユーザー名とパスワードが平文で渡されるため、機密情報を保護するには[HTTPS/TLS](server-ssl.md)を使用する必要があります。

## 依存関係を追加する {id="add_dependencies"}
`basic`認証を有効にするには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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

## Basic認証フロー {id="flow"}

Basic認証フローは次のようになります。

1.  クライアントは、サーバーアプリケーションの特定の[ルート](server-routing.md)に対して、`Authorization`ヘッダーなしでリクエストを行います。
2.  サーバーは、クライアントに`401` (Unauthorized) レスポンスステータスで応答し、`WWW-Authenticate`レスポンスヘッダーを使用して、Basic認証スキームがルートを保護するために使用されているという情報を提供します。典型的な`WWW-Authenticate`ヘッダーは次のようになります。
   
   ```
   WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
   ```
   {style="block"}
   
   Ktorでは、`basic`認証プロバイダーを[設定](#configure-provider)する際に、対応するプロパティを使用してレルムと文字セットを指定できます。

3.  通常、クライアントはログインダイアログを表示し、ユーザーが認証情報を入力できるようにします。その後、クライアントはBase64でエンコードされたユーザー名とパスワードのペアを含む`Authorization`ヘッダー付きでリクエストを行います。例:
   
   ```
   Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
   ```
   {style="block"}

4.  サーバーは、クライアントから送信された認証情報を[検証](#configure-provider)し、リクエストされたコンテンツで応答します。

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

必要に応じて、[プロバイダー名](server-auth.md#provider-name)を指定できます。これは、[指定されたルートを認証](#authenticate-route)するために使用できます。

## Basic認証の構成 {id="configure"}

Ktorで様々な認証プロバイダーを構成する方法の一般的な考え方については、[認証の構成](server-auth.md#configure)を参照してください。このセクションでは、`basic`認証プロバイダーの設定の詳細について説明します。

### ステップ1: Basicプロバイダーの構成 {id="configure-provider"}

`basic`認証プロバイダーは、[BasicAuthenticationProvider.Configuration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスを介して設定を公開します。以下の例では、次の設定が指定されています。
*   `realm`プロパティは、`WWW-Authenticate`ヘッダーに渡すレルムを設定します。
*   `validate`関数は、ユーザー名とパスワードを検証します。

```kotlin
install(Authentication) {
    basic("auth-basic") {
        realm = "Access to the '/' path"
        validate { credentials ->
            if (credentials.name == "jetbrains" && credentials.password == "foobar") {
                UserIdPrincipal(credentials.name)
            } else {
                null
            }
        }
    }
}
```
   
`validate`関数は`UserPasswordCredential`をチェックし、認証が成功した場合は`UserIdPrincipal`を返し、認証が失敗した場合は`null`を返します。
> ユーザー名とパスワードのハッシュを保持するインメモリテーブルに格納されたユーザーを検証するために、[UserHashedTableAuth](#validate-user-hash)を使用することもできます。

### ステップ2: 特定のリソースの保護 {id="authenticate-route"}

`basic`プロバイダーを構成した後、**[authenticate](server-auth.md#authenticate-route)**関数を使用してアプリケーション内の特定のリソースを保護できます。認証が成功した場合、ルートハンドラー内で`call.principal`関数を使用して認証された[UserIdPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を取得し、認証されたユーザーの名前を取得できます。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

## UserHashedTableAuthによる検証 {id="validate-user-hash"}

Ktorでは、ユーザー名とパスワードのハッシュを保持するインメモリテーブルに格納されたユーザーを[検証](#configure-provider)するために、[UserHashedTableAuth](#validate-user-hash)を使用できます。これにより、データソースが漏洩した場合でもユーザーパスワードが危うくなることを防ぐことができます。

ユーザーの検証に`UserHashedTableAuth`を使用するには、以下の手順に従います。

1.  [getDigestFunction](https://api.ktor.io/ktor-utils/io.ktor.util/get-digest-function.html)関数を使用して、指定されたアルゴリズムとソルトプロバイダーでダイジェスト関数を作成します。
   
   ```kotlin
   val digestFunction = getDigestFunction("SHA-256") { "ktor${it.length}" }
   ```

2.  `UserHashedTableAuth`の新しいインスタンスを初期化し、以下のプロパティを指定します。
    *   `table`プロパティを使用して、ユーザー名とハッシュ化されたパスワードのテーブルを提供します。
    *   `digester`プロパティにダイジェスト関数を割り当てます。
   
   ```kotlin
   val hashedUserTable = UserHashedTableAuth(
       table = mapOf(
           "jetbrains" to digestFunction("foobar"),
           "admin" to digestFunction("password")
       ),
       digester = digestFunction
   )
   ```
   
3.  `validate`関数内で、[UserHashedTableAuth.authenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-hashed-table-auth/authenticate.html)関数を呼び出してユーザーを認証し、認証情報が有効な場合は`UserIdPrincipal`のインスタンスを返します。

   ```kotlin
   install(Authentication) {
       basic("auth-basic-hashed") {
           realm = "Access to the '/' path"
           validate { credentials ->
               hashedUserTable.authenticate(credentials)
           }
       }
   }