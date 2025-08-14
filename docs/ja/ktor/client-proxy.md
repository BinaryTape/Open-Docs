[//]: # (title: プロキシ)

<show-structure for="chapter" depth="2"/>

Ktor HTTP クライアントは、マルチプラットフォームプロジェクトでプロキシ設定を構成できます。サポートされているプロキシのタイプは2つあります。[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) と [SOCKS](https://en.wikipedia.org/wiki/SOCKS) です。

### サポートされているエンジン {id="supported_engines"}

以下の表は、特定の [エンジン](client-engines.md) でサポートされているプロキシのタイプを示しています。

| Engine     | HTTP プロキシ | SOCKS プロキシ |
|------------|--------------|----------------|
| Apache     | ✅            |   ✖️           |
| Java       | ✅            |   ✖️           |
| Jetty      | ✖️            |   ✖️           |
| CIO        | ✅            |   ✖️           |
| Android    | ✅            |   ✅           |
| OkHttp     | ✅            |   ✅           |
| JavaScript | ✖️            |   ✖️           |
| Darwin     | ✅            |   ✖️           |
| Curl       | ✅            |   ✅           |

> Darwin エンジンでは、HTTPS リクエストが HTTP プロキシで現在サポートされていないことに注意してください。

## 依存関係の追加 {id="add_dependencies"}

クライアントでプロキシを設定するために、特定の依存関係を追加する必要はありません。必要な依存関係は以下の通りです。
- [ktor-client-core](client-dependencies.md#client-dependency);
- [エンジン依存関係](client-dependencies.md#engine-dependency)。

## プロキシの設定 {id="configure_proxy"}

プロキシ設定を行うには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で `engine` 関数を呼び出し、`proxy` プロパティを使用します。このプロパティは、[ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) ファクトリを使用して作成できる `ProxyConfig` インスタンスを受け入れます。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTP プロキシ {id="http_proxy"}

以下の例は、`ProxyBuilder` を使用して HTTP プロキシを設定する方法を示しています。

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

JVM 上では、`ProxyConfig` は [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) クラスにマッピングされるため、以下のようにプロキシを設定できます。

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS プロキシ {id="socks_proxy"}

以下の例は、`ProxyBuilder` を使用して SOCKS プロキシを設定する方法を示しています。

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

HTTP プロキシと同様に、JVM 上では `Proxy` を使用してプロキシ設定を行うことができます。

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## プロキシ認証と認可 {id="proxy_auth"}

プロキシの認証と認可はエンジン固有であり、手動で処理する必要があります。
例えば、基本認証を使用して Ktor クライアントを HTTP プロキシサーバーに認証するには、次のように `Proxy-Authorization` ヘッダーを [各リクエスト](client-default-request.md) に付加します。

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

JVM 上で Ktor クライアントを SOCKS プロキシに認証するには、`java.net.socks.username` および `java.net.socks.password` [システムプロパティ](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html) を使用できます。