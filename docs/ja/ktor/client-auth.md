[//]: # (title: Ktor Clientにおける認証と認可)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Authプラグインは、クライアントアプリケーションにおける認証と認可を処理します。
</link-summary>

Ktorは、クライアントアプリケーションで認証と認可を処理するための[Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth)プラグインを提供します。一般的な使用シナリオには、ユーザーのログインや特定のリソースへのアクセスが含まれます。

> サーバー側では、Ktorは認証と認可を処理するための[Authentication](server-auth.md)プラグインを提供します。

## サポートされている認証タイプ {id="supported"}

HTTPは、アクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供します。Ktorクライアントでは、以下のHTTP認証スキームを使用できます。

*   [Basic](client-basic-auth.md) - `Base64`エンコーディングを使用してユーザー名とパスワードを提供します。通常、HTTPSと組み合わせて使用しない限り推奨されません。
*   [Digest](client-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用して、ユーザー資格情報を暗号化された形式で通信する認証方式です。
*   [Bearer](client-bearer-auth.md) - ベアラートークンと呼ばれるセキュリティトークンを伴う認証スキームです。例えば、このスキームをOAuthフローの一部として使用し、Google、Facebook、Twitterなどの外部プロバイダーを使用してアプリケーションのユーザーを認証できます。

## 依存関係の追加 {id="add_dependencies"}

認証を有効にするには、ビルドスクリプトに`ktor-client-auth`アーティファクトを含める必要があります。

<var name="artifact_name" value="ktor-client-auth"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## Authのインストール {id="install_plugin"}
`Auth`プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 認証を構成
    }
}
```
これで、必要な認証プロバイダーを[構成](#configure_authentication)できます。

## 認証の構成 {id="configure_authentication"}

### ステップ1: 認証プロバイダーの選択 {id="choose-provider"}

特定の認証プロバイダー（[basic](client-basic-auth.md)、[digest](client-digest-auth.md)、または[bearer](client-bearer-auth.md)）を使用するには、`install`ブロック内で対応する関数を呼び出す必要があります。例えば、`basic`認証を使用するには、[basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html)関数を呼び出します。

```kotlin
install(Auth) {
    basic {
        // Basic認証を構成
    }
}
```
このブロック内では、このプロバイダーに固有の設定を構成できます。

### ステップ2: (オプション) レルムの構成 {id="realm"}

オプションとして、`realm`プロパティを使用してレルムを構成できます。

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

この場合、クライアントはレルムを含む`WWW-Authenticate`レスポンスヘッダーに基づいて必要なプロバイダーを選択します。

### ステップ3: プロバイダーの構成 {id="configure-provider"}

特定の[プロバイダー](#supported)の設定を構成する方法については、対応するトピックを参照してください:
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)