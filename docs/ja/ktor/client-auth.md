[//]: # (title: Ktor Clientにおける認証と認可)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Authプラグインは、クライアントアプリケーションにおける認証と認可を処理します。
</link-summary>

Ktorは、クライアントアプリケーションにおける認証と認可を処理するための[Auth](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth/-auth)プラグインを提供します。典型的な使用シナリオには、ユーザーのログインや、特定のリソースへのアクセス権の取得が含まれます。

> サーバー側では、Ktorは認証と認可を処理するための[Authentication](server-auth.md)プラグインを提供しています。

## サポートされている認証タイプ {id="supported"}

HTTPは、アクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供しています。Ktorクライアントでは、以下のHTTP認証スキームを使用できます。

*   [Basic](client-basic-auth.md) - `Base64`エンコーディングを使用してユーザー名とパスワードを提供します。HTTPSと組み合わせて使用しない限り、一般的に推奨されません。
*   [Digest](client-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用することで、暗号化された形式でユーザー認証情報を通信する認証方法です。
*   [Bearer](client-bearer-auth.md) - ベアラートークンと呼ばれるセキュリティトークンを使用する認証スキームです。例えば、OAuthフローの一部としてこのスキームを使用して、Google、Facebook、Twitterなどの外部プロバイダーを利用してアプリケーションのユーザーを認可できます。

## 依存関係の追加 {id="add_dependencies"}

認証を有効にするには、ビルドスクリプトに`ktor-client-auth`アーティファクトを含める必要があります。

<var name="artifact_name" value="ktor-client-auth"/>
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
<p>
    Ktorクライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係の追加</Links>を参照してください。
</p>

## Authのインストール {id="install_plugin"}
`Auth`プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // Configure authentication
    }
}
```
これで、必要な認証プロバイダーを[設定](#configure_authentication)できます。

## 認証の設定 {id="configure_authentication"}

### ステップ1：認証プロバイダーの選択 {id="choose-provider"}

特定の認証プロバイダー（[basic](client-basic-auth.md)、[digest](client-digest-auth.md)、または[bearer](client-bearer-auth.md)）を使用するには、`install`ブロック内で対応する関数を呼び出す必要があります。例えば、`basic`認証を使用するには、[basic](https://api.ktor.io/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html)関数を呼び出します。

```kotlin
install(Auth) {
    basic {
        // Configure basic authentication
    }
}
```
このブロック内で、このプロバイダーに固有の設定を行うことができます。

### ステップ2：（オプション）レルムの設定 {id="realm"}

オプションとして、`realm`プロパティを使用してレルムを設定できます。

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

異なるリソースにアクセスするために、異なるレルムを持つ複数のプロバイダーを作成できます。

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
    basic {
        realm = "Access to the '/admin' path"
        // ...
    }
}
```

この場合、クライアントは`WWW-Authenticate`レスポンスヘッダー（レルムが含まれています）に基づいて必要なプロバイダーを選択します。

### ステップ3：プロバイダーの設定 {id="configure-provider"}

特定の[プロバイダー](#supported)の設定方法については、以下の対応するトピックを参照してください。
*   [Ktor ClientにおけるBasic認証](client-basic-auth.md)
*   [Ktor ClientにおけるDigest認証](client-digest-auth.md)
*   [Ktor ClientにおけるBearer認証](client-bearer-auth.md)