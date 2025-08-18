[//]: # (title: クッキー)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookiesプラグインはクッキーを自動的に処理し、呼び出し間でストレージに保持します。
</link-summary>

Ktorクライアントでは、以下の方法でクッキーを手動で処理できます。
* `cookie`関数を使用すると、特定の[リクエスト](client-requests.md#cookies)にクッキーを追加できます。
* `setCookie`関数を使用すると、[レスポンス](client-responses.md#headers)で受信した`Set-Cookie`ヘッダーの値をパースできます。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html)プラグインはクッキーを自動的に処理し、呼び出し間でストレージに保持します。
デフォルトでは、インメモリストレージを使用しますが、[CookiesStorage](#custom_storage)を使用して永続ストレージを実装することもできます。

## 依存関係を追加する {id="add_dependencies"}
`HttpCookies`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## HttpCookiesのインストールと設定 {id="install_plugin"}

`HttpCookies`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

これは、Ktorクライアントがリクエスト間でクッキーを保持するのに十分です。完全な例は[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)で見つけることができます。

`HttpCookies`プラグインは、`ConstantCookiesStorage`を使用することで、特定の一連のクッキーを各リクエストに追加することもできます。これは、サーバーレスポンスを検証するテストケースで役立つ場合があります。以下の例は、特定のドメインに対するすべてのリクエストに指定されたクッキーを追加する方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## クッキーを取得する {id="get_cookies"}

クライアントは、指定されたURLのすべてのクッキーを取得するために`cookies`関数を提供します。

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## カスタムクッキーストレージ {id="custom_storage"}

必要に応じて、[CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html)インターフェースを実装することで、カスタムクッキーストレージを作成できます。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = CustomCookiesStorage()
    }
}

public class CustomCookiesStorage : CookiesStorage {
    // ...
}
```

[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)を参考にすることができます。