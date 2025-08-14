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
HttpCookies プラグインはクッキーを自動的に処理し、呼び出し間でストレージに保持します。
</link-summary>

Ktorクライアントでは、以下の方法でクッキーを手動で処理できます。
*   `cookie` 関数は、[特定の要求](client-requests.md#cookies)にクッキーを追加できます。
*   `setCookie` 関数は、[応答](client-responses.md#headers)で受信した `Set-Cookie` ヘッダー値を解析できます。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) プラグインは、クッキーを自動的に処理し、呼び出し間でストレージに保持します。デフォルトでは、インメモリのストレージを使用しますが、[CookiesStorage](#custom_storage) を使用して永続ストレージを実装することもできます。

## 依存関係の追加 {id="add_dependencies"}
`HttpCookies` は [ktor-client-core](client-dependencies.md) アーティファクトのみを必要とし、特定の依存関係は不要です。

## HttpCookies のインストールと設定 {id="install_plugin"}

`HttpCookies` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡します。
[object Promise]

これで Ktor クライアントがリクエスト間でクッキーを保持できるようになります。完全な例はこちらで見つけることができます: [client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies` プラグインは、`ConstantCookiesStorage` を使用して、各リクエストに特定のクッキーセットを追加することもできます。これは、サーバー応答を検証するテストケースで役立つ場合があります。以下の例は、特定のドメインのすべてのリクエストに指定されたクッキーを追加する方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## クッキーの取得 {id="get_cookies"}

クライアントは、指定されたURLのすべてのクッキーを取得するための `cookies` 関数を提供します。

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## カスタムクッキーストレージ {id="custom_storage"}

必要に応じて、[CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html) インターフェースを実装することで、カスタムクッキーストレージを作成できます。

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

参考として、[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt) を使用できます。