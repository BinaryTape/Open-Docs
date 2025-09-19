[//]: # (title: Ktor Serverにおけるセッション認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
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

[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。一般的なユースケースとしては、ログイン中のユーザーIDの保存、ショッピングカートの内容、クライアント上でのユーザー設定の保持などがあります。

Ktorでは、既存の関連セッションを持つユーザーは、`session`プロバイダーを使用して認証できます。たとえば、ユーザーが初めて[Webフォーム](server-form-based-auth.md)を使用してログインした場合、ユーザー名をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してそのユーザーを認可できます。

> Ktorにおける認証と認可に関する一般的な情報については、「[Ktor Serverにおける認証と認可](server-auth.md)」セクションを参照してください。

## 依存関係の追加 {id="add_dependencies"}
`session`認証を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。

* セッションを使用するための`ktor-server-sessions`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-sessions"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 認証のための`ktor-server-auth`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-auth"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

## セッション認証フロー {id="flow"}

セッションを使用した認証フローはさまざまであり、アプリケーションでのユーザー認証方法によって異なります。[フォームベース認証](server-form-based-auth.md)でどのように見えるかを見てみましょう。

1. クライアントは、ウェブフォームデータ（ユーザー名とパスワードを含む）を含むリクエストをサーバーに送信します。
2. サーバーはクライアントから送信されたクレデンシャルを検証し、ユーザー名をクッキーセッションに保存し、要求されたコンテンツとユーザー名を含むクッキーで応答します。
3. クライアントは、クッキーを付けて保護されたリソースに後続のリクエストを行います。
4. 受信したクッキーデータに基づき、Ktorはこのユーザーのクッキーセッションが存在するかどうかを確認し、オプションで受信したセッションデータに対して追加の検証を行います。検証が成功した場合、サーバーは要求されたコンテンツで応答します。

## セッション認証のインストール {id="install"}
`session`認証プロバイダーをインストールするには、`install`ブロック内で、必要なセッション型を指定して[session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html)関数を呼び出します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
//...
install(Authentication) {
    session<UserSession> {
        // Configure session authentication
    }
}
```

## セッション認証の設定 {id="configure"}

このセクションでは、[フォームベース認証](server-form-based-auth.md)を使用してユーザーを認証し、このユーザーに関する情報をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認可する方法を示します。

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。

### ステップ1: データクラスの作成 {id="data-class"}

まず、セッションデータを保存するためのデータクラスを作成する必要があります。

```kotlin
@Serializable
data class UserSession(val name: String, val count: Int)
```

### ステップ2: セッションのインストールと設定 {id="install-session"}

データクラスを作成したら、`Sessions`プラグインをインストールして設定する必要があります。以下の例では、指定されたクッキーパスと有効期限を持つクッキーセッションをインストールし、設定します。

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.path = "/"
        cookie.maxAgeInSeconds = 60
    }
}
```

> セッションの設定の詳細については、「[セッション設定の概要](server-sessions.md#configuration_overview)」を参照してください。

### ステップ3: セッション認証の設定 {id="configure-session-auth"}

`session`認証プロバイダーは、[`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)クラスを介してその設定を公開します。以下の例では、以下の設定が指定されています。

*   `validate()`関数は、[セッションインスタンス](#data-class)をチェックし、認証が成功した場合に`Any`型のプリンシパルを返します。
*   `challenge()`関数は、認証が失敗した場合に実行されるアクションを指定します。例えば、ログインページにリダイレクトしたり、[`UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)を送信したりできます。

```kotlin
install(Authentication) {
    session<UserSession>("auth-session") {
        validate { session ->
            if(session.name.startsWith("jet")) {
                session
            } else {
                null
            }
        }
        challenge {
            call.respondRedirect("/login")
        }
    }
}
```

### ステップ4: セッションへのユーザーデータの保存 {id="save-session"}

ログイン中のユーザーに関する情報をセッションに保存するには、[`call.sessions.set()`](server-sessions.md#use_sessions)関数を使用します。

以下の例は、ウェブフォームを使用したシンプルな認証フローを示しています。

```kotlin
authenticate("auth-form") {
    post("/login") {
        val userName = call.principal<UserIdPrincipal>()?.name.toString()
        call.sessions.set(UserSession(name = userName, count = 1))
        call.respondRedirect("/hello")
    }
}
```

> フォームベース認証フローの詳細については、[フォームベース認証](server-form-based-auth.md)のドキュメントを参照してください。

### ステップ5: 特定のリソースを保護する {id="authenticate-route"}

`session`プロバイダーを設定した後、[`authenticate()`](server-auth.md#authenticate-route)関数を使用してアプリケーション内の特定のリソースを保護できます。

認証に成功すると、ルートハンドラ内で`call.principal()`関数を使用することで、認証されたプリンシパル（この場合は[`UserSession`](#data-class)インスタンス）を取得できます。

```kotlin
authenticate("auth-session") {
    get("/hello") {
        val userSession = call.principal<UserSession>()
        call.sessions.set(userSession?.copy(count = userSession.count + 1))
        call.respondText("Hello, ${userSession?.name}! Visit count is ${userSession?.count}.")
    }
}
```

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。