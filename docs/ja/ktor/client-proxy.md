[//]: # (title: プロキシ)

<show-structure for="chapter" depth="2"/>

Ktor HTTPクライアントでは、マルチプラットフォームプロジェクトでプロキシ設定を構成できます。
サポートされているプロキシタイプは2種類あります: [HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers)と[SOCKS](https://en.wikipedia.org/wiki/SOCKS)です。

### サポートされているエンジン {id="supported_engines"}

以下の表は、特定の[エンジン](client-engines.md)でサポートされているプロキシタイプを示しています:

| エンジン     | HTTPプロキシ | SOCKSプロキシ |
|------------|------------|-------------|
| Apache     | ✅          |   ✖️         |
| Java       | ✅          |   ✖️         |
| Jetty      | ✖️          |   ✖️         |
| CIO        | ✅          |   ✖️         |
| Android    | ✅          |   ✅         |
| OkHttp     | ✅          |   ✅         |
| JavaScript | ✖️          |   ✖️         |
| Darwin     | ✅          |   ✖️          |
| Curl       | ✅          |   ✅         |

> 現在、Darwinエンジンでは、HTTPプロキシを使用したHTTPSリクエストはサポートされていません。

## 依存関係の追加 {id="add_dependencies"}

クライアントでプロキシを構成するために、特定の依存関係を追加する必要はありません。必要な依存関係は次のとおりです:
- [ktor-client-core](client-dependencies.md#client-dependency);
- [エンジンの依存関係](client-dependencies.md#engine-dependency)。

## プロキシの構成 {id="configure_proxy"}

プロキシ設定を構成するには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`engine`関数を呼び出し、`proxy`プロパティを使用します。
このプロパティは、[ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html)ファクトリを使用して作成できる`ProxyConfig`インスタンスを受け取ります。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTPプロキシ {id="http_proxy"}

以下の例は、`ProxyBuilder`を使用してHTTPプロキシを構成する方法を示しています:

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

JVMでは、`ProxyConfig`は[Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html)クラスにマッピングされるため、次のようにプロキシを構成できます:

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKSプロキシ {id="socks_proxy"}

以下の例は、`ProxyBuilder`を使用してSOCKSプロキシを構成する方法を示しています:

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

HTTPプロキシと同様に、JVMでは`Proxy`を使用してプロキシ設定を構成できます:

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## プロキシの認証と認可 {id="proxy_auth"}

プロキシの認証と認可はエンジン固有であり、手動で処理する必要があります。
たとえば、基本認証を使用してKtorクライアントをHTTPプロキシサーバーに認証するには、次のように[各リクエスト](client-default-request.md)に`Proxy-Authorization`ヘッダーを追加します:

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

JVM上でSOCKSプロキシにKtorクライアントを認証するには、`java.net.socks.username`と`java.net.socks.password`の[システムプロパティ](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)を使用できます。