[//]: # (title: Ktor クライアントでの認証と認可)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Authプラグインは、クライアントアプリケーションでの認証と認可を処理します。
</link-summary>

Ktor は、クライアントアプリケーションでの認証と認可を処理するための [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) プラグインを提供します。一般的な使用シナリオには、ユーザーのログインや特定のリソースへのアクセスが含まれます。

> サーバー側では、Ktor は認証と認可を処理するための [Authentication](server-auth.md) プラグインを提供します。

## サポートされている認証タイプ {id="supported"}

HTTPは、アクセス制御と認証のための[一般的なフレームワーク](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)を提供します。Ktor クライアントでは、以下のHTTP認証スキームを使用できます。

* [Basic](client-basic-auth.md) - ユーザー名とパスワードを提供するために `Base64` エンコーディングを使用します。HTTPSと組み合わせて使用しない場合は、一般的に推奨されません。
* [Digest](client-digest-auth.md) - ユーザー名とパスワードにハッシュ関数を適用することにより、ユーザーの資格情報を暗号化された形式で通信する認証方法です。
* [Bearer](client-bearer-auth.md) - ベアラートークンと呼ばれるセキュリティトークンを含む認証スキームです。例えば、このスキームをOAuthフローの一部として使用し、Google、Facebook、Twitterなどの外部プロバイダーを利用してアプリケーションのユーザーを認可することができます。

## 依存関係を追加する {id="add_dependencies"}

認証を有効にするには、`ktor-client-auth` アーティファクトをビルドスクリプトに含める必要があります。

<var name="artifact_name" value="ktor-client-auth"/>

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
    

    <p>
        Ktor クライアントに必要なアーティファクトについては、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びましょう。">クライアントの依存関係を追加する</Links>で詳細を確認できます。
    </p>
    

## Authをインストールする {id="install_plugin"}
`Auth` プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で `install` 関数に渡します。

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

## 認証を設定する {id="configure_authentication"}

### ステップ1: 認証プロバイダーを選択する {id="choose-provider"}

特定の認証プロバイダー ([basic](client-basic-auth.md)、[digest](client-digest-auth.md)、または [bearer](client-bearer-auth.md)) を使用するには、`install` ブロック内で対応する関数を呼び出す必要があります。例えば、`basic` 認証を使用するには、[basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 関数を呼び出します。

```kotlin
install(Auth) {
    basic {
        // Configure basic authentication
    }
}
```
このブロック内で、このプロバイダーに固有の設定を構成できます。

### ステップ2: (オプション) レルムを設定する {id="realm"}

オプションで、`realm` プロパティを使用してレルムを設定できます。

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

異なるレルムを持つ複数のプロバイダーを作成して、異なるリソースにアクセスできます。

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

この場合、クライアントはレルムを含む `WWW-Authenticate` レスポンスヘッダーに基づいて、必要なプロバイダーを選択します。

### ステップ3: プロバイダーを設定する {id="configure-provider"}

特定の[プロバイダー](#supported)の設定を構成する方法については、対応するトピックを参照してください。
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)