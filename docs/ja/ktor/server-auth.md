[//]: # (title: Ktorサーバーにおける認証と認可)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
AuthenticationプラグインはKtorにおける認証と認可を処理します。
</link-summary>

Ktorは[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)プラグインを提供し、認証と認可を処理します。典型的な利用シナリオには、ユーザーのログイン、特定のRessourcesへのアクセス許可、および当事者間の情報安全な転送が含まれます。また、リクエスト間でユーザーの情報を保持するために、`Authentication`を[セッション](server-sessions.md)と組み合わせて使用することもできます。

> クライアントでは、Ktorは認証と認可を処理するための[Authentication](client-auth.md)プラグインを提供します。

## サポートされている認証タイプ {id="supported"}
Ktorは以下の認証および認可スキームをサポートしています。

### HTTP認証 {id="http-auth"}
HTTPはアクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供します。Ktorでは、以下のHTTP認証スキームを使用できます。
* [Basic](server-basic-auth.md) - ユーザー名とパスワードを`Base64`エンコーディングで提供します。HTTPSと組み合わせて使用しない限り、一般的に推奨されません。
* [Digest](server-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用することで、ユーザーの資格情報を暗号化された形式で通信する認証方法です。
* [Bearer](server-bearer-auth.md) - ベアラートークンと呼ばれるセキュリティトークンを使用する認証スキームです。
  Bearer認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、ベアラートークンを認可するためのカスタムロジックを提供することも可能です。

### フォームベース認証 {id="form-auth"}
[フォームベース](server-form-based-auth.md)認証は、資格情報とユーザーを認証するために[ウェブフォーム](https://developer.mozilla.org/en-US/docs/Learn/Forms)を使用します。

### JSON Webトークン (JWT) {id="jwt"}
[JSON Webトークン](server-jwt.md)は、JSONオブジェクトとして関係者間で情報を安全に送信するためのオープン標準です。JSON Webトークンは認可に利用できます。ユーザーがログインすると、各リクエストにトークンが含まれ、ユーザーはそのトークンによって許可されたリソースにアクセスできるようになります。Ktorでは、`jwt`認証を使用してトークンを検証し、その中に含まれるクレームを検証できます。

### LDAP {id="ldap"}
[LDAP](server-ldap.md)は、ディレクトリサービス認証に使用されるオープンかつクロスプラットフォームなプロトコルです。Ktorは、指定されたLDAPサーバーに対してユーザーの資格情報を認証するために[ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html)関数を提供します。

### OAuth {id="oauth"}
[OAuth](server-oauth.md)はAPIへのアクセスを保護するためのオープン標準です。Ktorの`oauth`プロバイダーを使用すると、Google、Facebook、Twitterなどの外部プロバイダーを利用した認証を実装できます。

### セッション {id="sessions"}
[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的なユースケースには、ログインしているユーザーのID、ショッピングバスケットの内容、またはクライアントでのユーザー設定の保持などが含まれます。Ktorでは、既に関連付けられたセッションを持つユーザーは、`session`プロバイダーを使用して認証できます。その方法については、[](server-session-auth.md)で確認してください。

### カスタム {id="custom"}
Ktorはまた、[カスタムプラグイン](server-custom-plugins.md)を作成するためのAPIも提供しており、認証と認可を処理するための独自のプラグインを実装するために使用できます。
例えば、`AuthenticationChecked` [フック](server-custom-plugins.md#call-handling)は認証資格情報のチェック後に実行され、認可を実装することができます：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
    </p>
    

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
    

[JWT](server-jwt.md)や[LDAP](server-ldap.md)など、一部の認証プロバイダーは追加のアーティファクトを必要とすることに注意してください。

## Authenticationのインストール {id="install"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>内の<code>install</code>関数にそれを渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています。
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## Authenticationの設定 {id="configure"}
[Authenticationをインストール](#install)した後、次のように`Authentication`を設定して使用できます。

### ステップ1：認証プロバイダーの選択 {id="choose-provider"}

[basic](server-basic-auth.md)、[digest](server-digest-auth.md)、[form](server-form-based-auth.md)などの特定の認証プロバイダーを使用するには、`install`ブロック内で対応する関数を呼び出す必要があります。例えば、Basic認証を使用するには、[
`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数を呼び出します。

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

この関数内で、このプロバイダーに固有の設定を[構成](#configure-provider)できます。

### ステップ2：プロバイダー名の指定 {id="provider-name"}

[特定のプロバイダーを使用](#choose-provider)するための関数では、オプションでプロバイダー名を指定できます。以下のコードサンプルは、[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)および[form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html)プロバイダーをそれぞれ`"auth-basic"`と`"auth-form"`という名前でインストールしています。

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // Configure basic authentication
    }
    form("auth-form") {
        // Configure form authentication
    }
    // ...
}
```
{disable-links="false"}

これらの名前は、後で異なるプロバイダーを使用して[異なるルートを認証](#authenticate-route)するために使用できます。
> プロバイダー名は一意である必要があり、名前なしで定義できるプロバイダーは1つだけであることに注意してください。
>
{style="note"}

### ステップ3：プロバイダーの構成 {id="configure-provider"}

各[プロバイダータイプ](#choose-provider)には独自の構成があります。例えば、[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスは、[`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数のオプションを提供します。このクラスの主要な関数は[`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)で、ユーザー名とパスワードの検証を担当します。以下のコード例はその使用法を示しています。

[object Promise]

`validate()`関数の動作を理解するために、2つの用語を導入する必要があります。

* プリンシパル（_principal_）は認証可能なエンティティ（ユーザー、コンピューター、サービスなど）です。Ktorでは、さまざまな認証プロバイダーが異なるプリンシパルを使用する場合があります。例えば、`basic`、`digest`、`form`プロバイダーは[`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を認証するのに対し、`jwt`プロバイダーは[`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を検証します。
  > カスタムプリンシパルを作成することもできます。これは次の場合に役立ちます。
  > - 資格情報をカスタムプリンシパルにマッピングすることで、[ルートハンドラー](#get-principal)内で認証されたプリンシパルに関する追加情報を持つことができます。
  > - [セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを格納するデータクラスである場合があります。
* 資格情報（_credential_）は、サーバーがプリンシパルを認証するための一連のプロパティ（ユーザー名/パスワードのペア、APIキーなど）です。例えば、`basic`および`form`プロバイダーはユーザー名とパスワードを検証するために[
  `UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)を使用する一方、`jwt`は[
  `JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)を検証します。

したがって、`validate()`関数は指定された資格情報をチェックし、認証が成功した場合はプリンシパル`Any`を返し、認証が失敗した場合は`null`を返します。

> 特定の基準に基づいて認証をスキップするには、[`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)を使用します。例えば、[セッション](server-sessions.md)が既に存在する場合、`basic`認証をスキップできます。
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### ステップ4：特定のリソースの保護 {id="authenticate-route"}

最後のステップは、アプリケーション内の特定のリソースを保護することです。これは[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)関数を使用することで行えます。この関数は、2つのオプションパラメーターを受け入れます。

- ネストされたルートを認証するために使用される[プロバイダー名](#provider-name)。
  以下のコードスニペットは、_auth-basic_という名前のプロバイダーを使用して`/login`および`/orders`ルートを保護します。
   ```kotlin
   routing {
       authenticate("auth-basic") {
           get("/login") {
               // ...
           }    
           get("/orders") {
               // ...
           }    
       }
       get("/") {
           // ...
       }
   }
   ```
- ネストされた認証プロバイダーを解決するために使用されるストラテジー。
  このストラテジーは、[`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)列挙値によって表されます。

  例えば、クライアントは`AuthenticationStrategy.Required`ストラテジーで登録されたすべてのプロバイダーに対して認証データを提供する必要があります。
  以下のコードスニペットでは、[セッション認証](server-session-auth.md)を通過したユーザーのみが、Basic認証を使用して`/admin`ルートにアクセスしようとすることができます。
   ```kotlin
   routing {
       authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
           get("/hello") {
               // ...
           }    
           authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
               get("/admin") {
                   // ...
               }
           }  
       }
   }
   ```

> 完全な例については、
> [auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)を参照してください。

### ステップ5：ルートハンドラー内でのプリンシパルの取得 {id="get-principal"}

認証が成功すると、`call.principal()`関数を使用して、ルートハンドラー内で認証されたプリンシパルを取得できます。この関数は、[構成された認証プロバイダー](#configure-provider)によって返される特定のプリンシパルタイプを受け入れます。以下の例では、`call.principal()`を使用して`UserIdPrincipal`を取得し、認証されたユーザーの名前を取得しています。

[object Promise]

[セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを格納するデータクラスである場合があります。そのため、このデータクラスを`call.principal()`に渡す必要があります。

[object Promise]

[ネストされた認証プロバイダー](#authenticate-route)の場合、目的のプロバイダーのプリンシパルを取得するために、[プロバイダー名](#provider-name)を`call.principal()`に渡すことができます。

以下の例では、トップレベルのセッションプロバイダーのプリンシパルを取得するために、`"auth-session"`の値が渡されています。

[object Promise]