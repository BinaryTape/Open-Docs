[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCookiesプラグインは、Cookieを自動的に処理し、呼び出し間でそれらをストレージに保持します。
</link-summary>

Ktorクライアントでは、以下の方法でCookieを手動で処理できます。
* `cookie` 関数は、[特定の要求](client-requests.md#cookies)にCookieを追加できます。
* `setCookie` 関数は、[応答](client-responses.md#headers)で受け取った`Set-Cookie`ヘッダー値を解析できます。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html)プラグインは、Cookieを自動的に処理し、呼び出し間でそれらをストレージに保持します。デフォルトでは、インメモリのストレージを使用しますが、[CookiesStorage](#custom_storage)を使用して永続的なストレージを実装することもできます。

## 依存関係を追加する {id="add_dependencies"}
`HttpCookies`は、[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は必要ありません。

## HttpCookiesのインストールと設定 {id="install_plugin"}

`HttpCookies`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
```kotlin
```
{src="snippets/client-cookies/src/main/kotlin/com/example/Application.kt" include-lines="16-18"}

これは、Ktorクライアントが要求間でCookieを保持できるようにするために十分です。完全な例は以下で確認できます: [client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies`プラグインは、`ConstantCookiesStorage`を使用することで、各要求に特定のCookieセットを追加することもできます。これは、サーバー応答を検証するテストケースで役立つ場合があります。以下の例は、特定のドメインのすべての要求に指定されたCookieを追加する方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## Cookieの取得 {id="get_cookies"}

クライアントは、指定されたURLのすべてのCookieを取得するために`cookies`関数を提供します。

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## カスタムCookieストレージ {id="custom_storage"}

必要に応じて、[CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html)インターフェースを実装することでカスタムCookieストレージを作成できます。

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

[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)を参照として使用できます。