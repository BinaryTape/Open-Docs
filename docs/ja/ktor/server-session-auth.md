[//]: # (title: Ktorサーバーでのセッション認証)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-sessions</code>
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

[セッション](server-sessions.md)は、異なるHTTPリクエスト間でデータを永続化するメカニズムを提供します。典型的な使用例としては、ログイン済みユーザーのID、ショッピングカートの内容、またはユーザー設定をクライアントに保持することなどがあります。

Ktorでは、関連付けられたセッションをすでに持っているユーザーは、`session`プロバイダーを使用して認証できます。たとえば、ユーザーが初めて[Webフォーム](server-form-based-auth.md)を使用してログインした場合、ユーザー名をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認可することができます。

> Ktorにおける認証と認可に関する一般的な情報については、[](server-auth.md)セクションを参照してください。

## 依存関係の追加 {id="add_dependencies"}
`session`認証を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。

*   セッションを使用するために`ktor-server-sessions`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-sessions"/>
  
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
    

*   認証のために`ktor-server-auth`依存関係を追加します。

  <var name="artifact_name" value="ktor-server-auth"/>
  
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
    

## セッション認証フロー {id="flow"}

セッションによる認証フローは様々であり、アプリケーションでユーザーがどのように認証されるかによって異なります。ここでは、[フォームベース認証](server-form-based-auth.md)の場合にどのように見えるかを見てみましょう。

1.  クライアントはWebフォームデータ（ユーザー名とパスワードを含む）を含むリクエストをサーバーに送信します。
2.  サーバーはクライアントから送信された認証情報を検証し、ユーザー名をクッキーセッションに保存し、要求されたコンテンツとユーザー名を含むクッキーで応答します。
3.  クライアントはクッキー付きで保護されたリソースへ後続のリクエストを送信します。
4.  Ktorは受信したクッキーデータに基づき、このユーザーのクッキーセッションが存在することを確認し、必要に応じて受信したセッションデータに対して追加の検証を実行します。検証が成功した場合、サーバーは要求されたコンテンツで応答します。

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

このセクションでは、[フォームベース認証](server-form-based-auth.md)でユーザーを認証し、そのユーザーに関する情報をクッキーセッションに保存し、その後のリクエストで`session`プロバイダーを使用してこのユーザーを認可する方法を示します。

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。

### ステップ1: データクラスの作成 {id="data-class"}

まず、セッションデータを保存するためのデータクラスを作成する必要があります。

[object Promise]

### ステップ2: セッションのインストールと設定 {id="install-session"}

データクラスを作成したら、`Sessions`プラグインをインストールして設定する必要があります。以下の例では、指定されたクッキーパスと有効期限を持つクッキーセッションをインストールして設定しています。

[object Promise]

> セッションの設定の詳細については、[](server-sessions.md#configuration_overview)を参照してください。

### ステップ3: セッション認証の設定 {id="configure-session-auth"}

`session`認証プロバイダーは、[
`SessionAuthenticationProvider.Config`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-session-authentication-provider/-config/index.html)
クラスを介してその設定を公開しています。以下の例では、次の設定が指定されています。

*   `validate()`関数は[セッションインスタンス](#data-class)をチェックし、認証が成功した場合に`Any`型のプリンシパルを返します。
*   `challenge()`関数は、認証が失敗した場合に実行されるアクションを指定します。たとえば、ログインページにリダイレクトするか、[
    `UnauthorizedResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-unauthorized-response/index.html)
    を送信できます。

[object Promise]

### ステップ4: セッションへのユーザーデータの保存 {id="save-session"}

ログインしたユーザーの情報をセッションに保存するには、[
`call.sessions.set()`](server-sessions.md#use_sessions)
関数を使用します。

以下の例は、Webフォームを使用したシンプルな認証フローを示しています。

[object Promise]

> フォームベース認証フローの詳細については、[フォームベース認証](server-form-based-auth.md)ドキュメントを参照してください。

### ステップ5: 特定のリソースの保護 {id="authenticate-route"}

`session`プロバイダーを設定した後、`authenticate()`関数を使用してアプリケーション内の特定のリソースを保護できます。

認証が成功すると、ルートハンドラー内で`call.principal()`関数を使用して、認証されたプリンシパル（この場合は[`UserSession`](#data-class)インスタンス）を取得できます。

[object Promise]

> 完全な例については、[auth-form-session](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-session)を参照してください。