[//]: # (title: Ktor Serverにおける認証と認可)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication"/>
<var name="package_name" value="io.ktor.server.auth"/>
<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
</tldr>

<link-summary>
AuthenticationプラグインはKtorにおける認証と認可を処理します。
</link-summary>

Ktorは認証と認可を処理するための[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)プラグインを提供します。典型的な使用シナリオには、ユーザーのログイン、特定のリソースへのアクセス許可、および当事者間での情報の安全な送信が含まれます。また、`Authentication`を[セッション](server-sessions.md)と組み合わせて使用することで、リクエスト間でユーザーの情報を保持することもできます。

> クライアント側では、Ktorは認証と認可を処理するための[Authentication](client-auth.md)プラグインを提供します。

## サポートされている認証タイプ {id="supported"}
Ktorは以下の認証および認可スキームをサポートしています。

### HTTP認証 {id="http-auth"}
HTTPはアクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供します。Ktorでは、以下のHTTP認証スキームを使用できます。
* [Basic](server-basic-auth.md) - `Base64`エンコーディングを使用してユーザー名とパスワードを提供します。HTTPSと組み合わせて使用しない限り、一般的には推奨されません。
* [Digest](server-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用して、暗号化された形式でユーザー認証情報を通信する認証方法です。
* [Bearer](server-bearer-auth.md) - ベアラートークンと呼ばれるセキュリティトークンを伴う認証スキームです。
  ベアラ認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、ベアラートークンの認可にカスタムロジックを提供することもできます。

### フォームベース認証 {id="form-auth"}
[フォームベース](server-form-based-auth.md)認証は、[Webフォーム](https://developer.mozilla.org/en-US/docs/Learn/Forms)を使用して認証情報を収集し、ユーザーを認証します。

### JSON Web Tokens (JWT) {id="jwt"}
[JSON Web Token](server-jwt.md)は、JSONオブジェクトとして当事者間で情報を安全に送信するためのオープンスタンダードです。JSON Web Tokensを認可に使用できます。ユーザーがログインすると、各リクエストにトークンが含まれ、そのトークンで許可されたリソースにユーザーがアクセスできるようになります。Ktorでは、`jwt`認証を使用してトークンを検証し、その中に含まれるクレームを検証できます。

### LDAP {id="ldap"}
[LDAP](server-ldap.md)は、ディレクトリサービス認証に使用されるオープンなクロスプラットフォームプロトコルです。Ktorは、指定されたLDAPサーバーに対してユーザー認証情報を認証するための[ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html)関数を提供します。

### OAuth {id="oauth"}
[OAuth](server-oauth.md)は、APIへのアクセスを保護するためのオープンスタンダードです。Ktorの`oauth`プロバイダーを使用すると、Google、Facebook、Twitterなどの外部プロバイダーを使用した認証を実装できます。

### セッション {id="sessions"}
[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的なユースケースには、ログインしたユーザーのID、ショッピングカートの内容の保存、またはクライアントでのユーザー設定の保持などがあります。Ktorでは、既に関連付けられたセッションを持つユーザーは、`session`プロバイダーを使用して認証できます。これを行う方法については、[](server-session-auth.md)を参照してください。

### カスタム {id="custom"}
Ktorは[カスタムプラグイン](server-custom-plugins.md)を作成するためのAPIも提供しており、これを使用して認証と認可を処理するための独自のプラグインを実装できます。
例えば、`AuthenticationChecked` [フック](server-custom-plugins.md#call-handling)は認証情報がチェックされた後に実行され、認可を実装することができます: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

[JWT](server-jwt.md)や[LDAP](server-ldap.md)など、一部の認証プロバイダーは追加のアーティファクトを必要とすることに注意してください。

## Authenticationをインストールする {id="install"}

<include from="lib.topic" element-id="install_plugin"/>

## Authenticationを設定する {id="configure"}
[Authenticationをインストール](#install)した後、次のように`Authentication`を設定して使用できます。

### ステップ1: 認証プロバイダーを選択する {id="choose-provider"}

[basic](server-basic-auth.md)、[digest](server-digest-auth.md)、[form](server-form-based-auth.md)などの特定の認証プロバイダーを使用するには、`install`ブロック内で対応する関数を呼び出す必要があります。たとえば、Basic認証を使用するには、[`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    basic {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
}
```

この関数内で、このプロバイダーに固有の[設定](#configure-provider)を行うことができます。

### ステップ2: プロバイダー名を指定する {id="provider-name"}

[特定のプロバイダーを使用する](#choose-provider)ための関数は、オプションでプロバイダー名を指定できます。以下のコードサンプルは、[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)および[form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html)プロバイダーを、それぞれ`"auth-basic"`および`"auth-form"`という名前でインストールしています。

```kotlin
install(Authentication) {
    basic("auth-basic") {
        // [[[Configure basic authentication|server-basic-auth.md]]]
    }
    form("auth-form") {
        // [[[Configure form authentication|server-form-based-auth.md]]]
    }
    // ...
}
```
{disable-links="false"}

これらの名前は、後で異なるプロバイダーを使用して[異なるルートを認証する](#authenticate-route)ために使用できます。
> プロバイダー名は一意である必要があり、名前のないプロバイダーは1つだけ定義できます。
>
{style="note"}

### ステップ3: プロバイダーを設定する {id="configure-provider"}

各[プロバイダータイプ](#choose-provider)には独自の設定があります。たとえば、[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスは[`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数のオプションを提供します。このクラスの主要な関数は[`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)で、ユーザー名とパスワードの検証を担当します。以下のコード例はその使用法を示しています。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="9-20"}

`validate()`関数の仕組みを理解するには、2つの用語を導入する必要があります。

* _プリンシパル_とは、認証できるエンティティのことです。例えば、ユーザー、コンピューター、サービスなどです。Ktorでは、さまざまな認証プロバイダーが異なるプリンシパルを使用する場合があります。例えば、`basic`、`digest`、`form`プロバイダーは[`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を認証し、`jwt`プロバイダーは[`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を検証します。
  > カスタムプリンシパルを作成することもできます。これは以下の場合に役立ちます。
  > - 認証情報をカスタムプリンシパルにマッピングすることで、[ルートハンドラー](#get-principal)内で認証されたプリンシパルに関する追加情報を取得できます。
  > - [セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを保存するデータクラスになることがあります。
* _クレデンシャル_とは、サーバーがプリンシパルを認証するための一連のプロパティです。例えば、ユーザー名/パスワードのペア、APIキーなどです。例えば、`basic`および`form`プロバイダーは[`UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)を使用してユーザー名とパスワードを検証し、`jwt`は[`JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)を検証します。

したがって、`validate()`関数は指定されたクレデンシャルをチェックし、認証が成功した場合はプリンシパル`Any`を返し、認証が失敗した場合は`null`を返します。

> 特定の条件に基づいて認証をスキップするには、[`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)を使用します。
> たとえば、[セッション](server-sessions.md)が既に存在する場合は`basic`認証をスキップできます。
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### ステップ4: 特定のリソースを保護する {id="authenticate-route"}

最後のステップは、アプリケーションの特定のリソースを保護することです。これは、[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)関数を使用して行うことができます。この関数は2つのオプションのパラメータを受け取ります。

- ネストされたルートを認証するために使用される[プロバイダーの名前](#provider-name)。
  以下のコードスニペットは、`/login`および`/orders`ルートを保護するために、_auth-basic_という名前のプロバイダーを使用しています。
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
- ネストされた認証プロバイダーを解決するために使用される戦略。
  この戦略は[`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)列挙値で表されます。

  たとえば、`AuthenticationStrategy.Required`戦略で登録されたすべてのプロバイダーに対して、クライアントは認証データを提供する必要があります。
  以下のコードスニペットでは、[セッション認証](server-session-auth.md)を通過したユーザーのみが、Basic認証を使用して`/admin`ルートにアクセスを試みることができます。
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

> 完全な例については、[auth-form-session-nested](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session-nested)を参照してください。

### ステップ5: ルートハンドラー内でプリンシパルを取得する {id="get-principal"}

認証が成功すると、`call.principal()`関数を使用して、ルートハンドラー内で認証されたプリンシパルを取得できます。この関数は、[設定された認証プロバイダー](#configure-provider)によって返される特定のプリンシパルタイプを受け取ります。以下の例では、`call.principal()`を使用して`UserIdPrincipal`を取得し、認証されたユーザーの名前を取得しています。

```kotlin
```
{src="snippets/auth-basic/src/main/kotlin/authbasic/Application.kt" include-lines="21-27"}

[セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを格納するデータクラスになることがあります。
そのため、このデータクラスを`call.principal()`に渡す必要があります。

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-79,82-83"}

[ネストされた認証プロバイダー](#authenticate-route)の場合、[プロバイダー名](#provider-name)を`call.principal()`に渡して、目的のプロバイダーのプリンシパルを取得できます。

以下の例では、トップレベルのセッションプロバイダーのプリンシパルを取得するために、`"auth-session"`値が渡されています。

```kotlin
```
{src="snippets/auth-form-session-nested/src/main/kotlin/com/example/Application.kt" include-lines="87,93-95,97-99"}