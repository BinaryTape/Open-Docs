[//]: # (title: Ktor Serverにおける認証と認可)

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
AuthenticationプラグインはKtorにおける認証と認可を扱います。
</link-summary>

Ktorは、認証と認可を処理するために[Authentication](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication/index.html)プラグインを提供します。典型的な使用シナリオには、ユーザーのログイン、特定のリソースへのアクセス許可、関係者間での情報の安全な送信などがあります。`Authentication`を[セッション](server-sessions.md)と併用して、リクエスト間でユーザー情報を保持することもできます。

> クライアント側では、Ktorは認証と認可を処理するための[Authentication](client-auth.md)プラグインを提供します。

## サポートされている認証タイプ {id="supported"}
Ktorは以下の認証および認可スキームをサポートしています。

### HTTP認証 {id="http-auth"}
HTTPは、アクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供します。Ktorでは、以下のHTTP認証スキームを使用できます。
* [Basic](server-basic-auth.md) - `Base64`エンコーディングを使用してユーザー名とパスワードを提供します。HTTPSと組み合わせて使用しない限り、一般的に推奨されません。
* [Digest](server-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用することで、ユーザー資格情報を暗号化された形式で通信する認証方法です。
* [Bearer](server-bearer-auth.md) - Bearerトークンと呼ばれるセキュリティトークンを使用する認証スキームです。
  Bearer認証スキームは[OAuth](server-oauth.md)または[JWT](server-jwt.md)の一部として使用されますが、Bearerトークンを認可するためのカスタムロジックを提供することもできます。

### フォームベース認証 {id="form-auth"}
[フォームベース](server-form-based-auth.md)認証は、[ウェブフォーム](https://developer.mozilla.org/en-US/docs/Learn/Forms)を使用して資格情報を収集し、ユーザーを認証します。

### JSON Webトークン (JWT) {id="jwt"}
[JSON Webトークン](server-jwt.md)は、JSONオブジェクトとして関係者間で情報を安全に送信するためのオープンスタンダードです。JSON Webトークンを認可に使用できます。ユーザーがログインすると、各リクエストにはトークンが含まれ、そのトークンで許可されたリソースにユーザーがアクセスできるようになります。Ktorでは、`jwt`認証を使用してトークンを検証し、その中に含まれるクレームを検証できます。

### LDAP {id="ldap"}
[LDAP](server-ldap.md)は、ディレクトリサービス認証に使用されるオープンなクロスプラットフォームプロトコルです。Ktorは、指定されたLDAPサーバーに対してユーザー資格情報を認証するために、[ldapAuthenticate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-ldap/io.ktor.server.auth.ldap/ldap-authenticate.html)関数を提供します。

### OAuth {id="oauth"}
[OAuth](server-oauth.md)は、APIへのアクセスを保護するためのオープンスタンダードです。Ktorの`oauth`プロバイダーを使用すると、Google、Facebook、Twitterなどの外部プロバイダーを使用して認証を実装できます。

### セッション {id="sessions"}
[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的な使用例としては、ログインしたユーザーのID、ショッピングバスケットの内容の保存、クライアント上でのユーザー設定の保持などがあります。Ktorでは、関連付けられたセッションを持つユーザーは、`session`プロバイダーを使用して認証できます。その方法は[Ktor Serverでのセッション認証](server-session-auth.md)で学ぶことができます。

### カスタム {id="custom"}
Ktorは[カスタムプラグイン](server-custom-plugins.md)を作成するためのAPIも提供しており、認証と認可を処理するための独自のプラグインを実装するために使用できます。
例えば、`AuthenticationChecked` [フック](server-custom-plugins.md#call-handling)は認証資格情報がチェックされた後に実行され、認可を実装することができます: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
</p>
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

[JWT](server-jwt.md)や[LDAP](server-ldap.md)など、一部の認証プロバイダーは追加のアーティファクトを必要とすることに注意してください。

## Authenticationのインストール {id="install"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールはルートをグループ化することでアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## Authenticationの設定 {id="configure"}
[Authenticationをインストール](#install)した後、次のように`Authentication`を設定して使用できます。

### ステップ1: 認証プロバイダーを選択する {id="choose-provider"}

[basic](server-basic-auth.md)、[digest](server-digest-auth.md)、[form](server-form-based-auth.md)などの特定の認証プロバイダーを使用するには、`install`ブロック内で対応する関数を呼び出す必要があります。例えば、basic認証を使用するには、[
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

### ステップ2: プロバイダー名を指定する {id="provider-name"}

[特定のプロバイダーを使用](#choose-provider)するための関数は、オプションでプロバイダー名を指定できます。以下のコードサンプルは、[basic](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)および[form](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/form.html)プロバイダーをそれぞれ`"auth-basic"`および`"auth-form"`という名前でインストールしています。

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

これらの名前は後で異なるプロバイダーを使用して[異なるルートを認証](#authenticate-route)するために使用できます。
> プロバイダー名は一意である必要があり、名前なしのプロバイダーは1つしか定義できないことに注意してください。
>
{style="note"}

### ステップ3: プロバイダーを設定する {id="configure-provider"}

各[プロバイダータイプ](#choose-provider)には独自の構成があります。例えば、[`BasicAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/index.html)クラスは[`.basic()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/basic.html)関数にオプションを提供します。このクラスの主要な関数は[`validate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-basic-authentication-provider/-config/validate.html)で、ユーザー名とパスワードを検証する役割を担っています。以下のコード例はその使用法を示しています。

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

`validate()`関数の動作を理解するには、2つの用語を導入する必要があります。

* プリンシパル（_principal_）とは、認証できるエンティティです。ユーザー、コンピューター、サービスなどです。Ktorでは、さまざまな認証プロバイダーが異なるプリンシパルを使用する場合があります。例えば、`basic`、`digest`、`form`プロバイダーは[`UserIdPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-id-principal/index.html)を認証し、`jwt`プロバイダーは[`JWTPrincipal`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)を検証します。
  > カスタムプリンシパルを作成することもできます。これは次の場合に役立つ可能性があります。
  > - 資格情報をカスタムプリンシパルにマッピングすることで、[ルートハンドラー](#get-principal)内で認証されたプリンシパルに関する追加情報を持つことができます。
  > - [セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを格納するデータクラスである可能性があります。
* クレデンシャル（_credential_）とは、サーバーがプリンシパルを認証するための一連のプロパティです。ユーザー名とパスワードのペア、APIキーなどです。例えば、`basic`および`form`プロバイダーは[
  `UserPasswordCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-user-password-credential/index.html)を使用してユーザー名とパスワードを検証し、`jwt`は[
  `JWTCredential`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html)を検証します。

したがって、`validate()`関数は指定されたクレデンシャルをチェックし、認証が成功した場合はプリンシパル`Any`を返し、認証が失敗した場合は`null`を返します。

> 特定の基準に基づいて認証をスキップするには、[`skipWhen()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-provider/-config/skip-when.html)を使用します。例えば、[セッション](server-sessions.md)が既に存在する場合、`basic`認証をスキップできます。
> ```kotlin
> basic {
>     skipWhen { call -> call.sessions.get<UserSession>() != null }
> }

### ステップ4: 特定のリソースを保護する {id="authenticate-route"}

最後のステップは、アプリケーション内の特定のリソースを保護することです。これは[`authenticate()`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/authenticate.html)関数を使用することで実現できます。この関数は2つのオプションパラメーターを受け入れます。

- ネストされたルートを認証するために使用される[プロバイダーの名前](#provider-name)。以下のコードスニペットは、_auth-basic_という名前のプロバイダーを使用して`/login`および`/orders`ルートを保護しています。
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
- ネストされた認証プロバイダーを解決するために使用される戦略。この戦略は[`AuthenticationStrategy`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-strategy/index.html)列挙値で表されます。

  例えば、クライアントは`AuthenticationStrategy.Required`戦略で登録されたすべてのプロバイダーに対して認証データを提供する必要があります。
  以下のコードスニペットでは、[セッション認証](server-session-auth.md)を通過したユーザーのみがbasic認証を使用して`/admin`ルートにアクセスできます。
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

認証に成功すると、ルートハンドラー内で`call.principal()`関数を使用して認証されたプリンシパルを取得できます。この関数は、[設定された認証プロバイダー](#configure-provider)によって返される特定のプリンシパルタイプを受け入れます。以下の例では、`call.principal()`を使用して`UserIdPrincipal`を取得し、認証されたユーザーの名前を取得しています。

```kotlin
routing {
    authenticate("auth-basic") {
        get("/") {
            call.respondText("Hello, ${call.principal<UserIdPrincipal>()?.name}!")
        }
    }
}
```

[セッション認証](server-session-auth.md)を使用する場合、プリンシパルはセッションデータを格納するデータクラスである可能性があります。
そのため、このデータクラスを`call.principal()`に渡す必要があります。

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
    }
}
```

[ネストされた認証プロバイダー](#authenticate-route)の場合、目的のプロバイダーのプリンシパルを取得するために、[プロバイダー名](#provider-name)を`call.principal()`に渡すことができます。

以下の例では、最上位のセッションプロバイダーのプリンシパルを取得するために`"auth-session"`値が渡されています。

```kotlin
authenticate("auth-session", strategy = AuthenticationStrategy.Required) {
    authenticate("auth-basic", strategy = AuthenticationStrategy.Required) {
        get("/admin") {
            val userSession = call.principal<UserSession>("auth-session")
        }
    }
}
```