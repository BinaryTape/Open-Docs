[//]: # (title: クッキー)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookiesプラグインはクッキーを自動的に処理し、ストレージを使用して呼び出し間で保持します。
</link-summary>

Ktorクライアントでは、以下の方法でクッキーを手動で処理できます。
* `cookie`関数を使用すると、[特定の要求](client-requests.md#cookies)にクッキーを追加できます。
* `setCookie`関数を使用すると、[レスポンス](client-responses.md#headers)で受信した`Set-Cookie`ヘッダーの値をパースできます。

[HttpCookies](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html)プラグインは、クッキーを自動的に処理し、ストレージに保存して呼び出し間で保持します。
デフォルトではインメモリ・ストレージを使用しますが、[CookiesStorage](#custom_storage)を使用して永続的ストレージを実装することも可能です。

## 依存関係の追加 {id="add_dependencies"}
`HttpCookies`には[ktor-client-core](client-dependencies.md)アーティファクトのみが必要で、特定の依存関係は必要ありません。

## HttpCookiesのインストールと設定 {id="install_plugin"}

`HttpCookies`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します。
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

これだけで、Ktorクライアントはリクエスト間でクッキーを保持できるようになります。完全な例はこちらで確認できます: [client-cookies](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-cookies)。

`HttpCookies`プラグインでは、`ConstantCookiesStorage`を使用して各リクエストに特定のクッキーセットを追加することもできます。これは、サーバーのレスポンスを検証するテストケースなどで役立ちます。以下の例は、特定のドメインに対するすべてのリクエストに指定したクッキーを追加する方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## クッキーの取得 {id="get_cookies"}

クライアントは、指定されたURLのすべてのクッキーを取得するための`cookies`関数を提供しています。

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## カスタムクッキーストレージ {id="custom_storage"}

必要に応じて、[CookiesStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html)インターフェースを実装することで、カスタムクッキーストレージを作成できます。

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

[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)を参考にしてください。