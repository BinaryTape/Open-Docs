[//]: # (title: Ktor Serverにおけるセッション認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
</p>
<var name="example_name" value="auth-form-session"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的な使用例としては、ログイン中のユーザーIDの保存、ショッピングカートの内容の保存、またはクライアントでのユーザー設定の保持などが挙げられます。

Ktorでは、関連付けられたセッションをすでに持っているユーザーは、`session`プロバイダーを使用して認証できます。たとえば、ユーザーが初めて[ウェブフォーム](server-form-based-auth.md)を使用してログインした場合、ユーザー名をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認証できます。

> Ktorにおける認証と認可の一般的な情報については、[](server-auth.md)セクションを参照してください。

## 依存関係の追加 {id="add_dependencies"}
`session`認証を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。

* セッションを使用するための`ktor-server-sessions`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-sessions"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 認証のための`ktor-server-auth`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-auth"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>

## セッション認証フロー {id="flow"}

セッションによる認証フローは様々であり、アプリケーションでユーザーがどのように認証されるかに依存します。[フォームベース認証](server-form-based-auth.md)の場合のフローを見てみましょう。

1. クライアントがウェブフォームデータ（ユーザー名とパスワードを含む）を含むリクエストをサーバーに送信します。
2. サーバーはクライアントから送信されたクレデンシャルを検証し、ユーザー名をクッキーセッションに保存し、要求されたコンテンツとユーザー名を含むクッキーで応答します。
3. クライアントはクッキーを含む後続のリクエストを保護されたリソースに送信します。
4. 受信したクッキーデータに基づいて、Ktorはこのユーザーのクッキーセッションが存在することを確認し、必要に応じて受信したセッションデータに対する追加の検証を実行します。検証が成功した場合、サーバーは要求されたコンテンツで応答します。

## セッション認証のインストール {id="install"}
`session`認証プロバイダーをインストールするには、`install`ブロック内で必要なセッションタイプを指定して[session](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/session.html)関数を呼び出します。

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

このセクションでは、[フォームベース認証](server-form-based-auth.md)でユーザーを認証し、このユーザーに関する情報をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認可する方法を示します。

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。

### ステップ1: データクラスの作成 {id="data-class"}

まず、セッションデータを保存するためのデータクラスを作成する必要があります。

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="12-13"}

### ステップ2: セッションのインストールと設定 {id="install-session"}

データクラスを作成したら、`Sessions`プラグインをインストールして設定する必要があります。以下の例では、指定されたクッキーパスと有効期限を持つクッキーセッションをインストールおよび設定します。

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

> セッションの設定の詳細については、[](server-sessions.md#configuration_overview)を参照してください。

### ステップ3: セッション認証の設定 {id="configure-session-auth"}

`session`認証プロバイダーは、その設定を[
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)クラス経由で公開しています。以下の例では、以下の設定が指定されています。

* `validate()`関数は[セッションインスタンス](#data-class)をチェックし、認証が成功した場合に`Any`型のプリンシパルを返します。
* `challenge()`関数は、認証が失敗した場合に実行されるアクションを指定します。たとえば、ログインページにリダイレクトしたり、[
  `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)を送信したりできます。

```kotlin
```
{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="22,34-46"}

### ステップ4: ユーザーデータをセッションに保存 {id="save-session"}

ログインしたユーザーの情報をセッションに保存するには、[`call.sessions.set()`](server-sessions.md#use_sessions)関数を使用します。

以下の例は、ウェブフォームを使用したシンプルな認証フローを示しています。

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="69-75"}

> フォームベース認証フローの詳細については、[フォームベース認証](server-form-based-auth.md)ドキュメントを参照してください。

### ステップ5: 特定のリソースの保護 {id="authenticate-route"}

`session`プロバイダーを設定した後、[`authenticate()`](server-auth.md#authenticate-route)関数を使用して、アプリケーション内の特定のリソースを保護できます。

認証が成功すると、ルートハンドラー内で`call.principal()`関数を使用することにより、認証されたプリンシパル（この場合は[`UserSession`](#data-class)インスタンス）を取得できます。

```kotlin
```

{src="snippets/auth-form-session/src/main/kotlin/com/example/Application.kt" include-lines="77-83"}

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。