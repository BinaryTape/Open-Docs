[//]: # (title: 代理)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 用戶端允許您在多平台專案中配置代理設定。
支援兩種代理類型：[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) 和 [SOCKS](https://en.wikipedia.org/wiki/SOCKS)。

### 支援的引擎 {id="supported_engines"}

下表顯示了針對特定[引擎](client-engines.md)支援的代理類型：

| 引擎     | HTTP 代理 | SOCKS 代理 |
|------------|------------|-------------|
| Apache     | ✅          | ✖️          |
| Java       | ✅          | ✖️          |
| Jetty      | ✖️         | ✖️          |
| CIO        | ✅          | ✖️          |
| Android    | ✅          | ✅           |
| OkHttp     | ✅          | ✅           |
| JavaScript | ✖️         | ✖️          |
| Darwin     | ✅          | ✅           |
| Curl       | ✅          | ✅           |

> 請注意，目前 Darwin 引擎的 HTTP 代理不支援 HTTPS 請求。

## 新增相依性 {id="add_dependencies"}

要在用戶端中配置代理，您不需要新增特定的相依性。所需的相依性為：
- [ktor-client-core](client-dependencies.md#client-dependency)；
- [一個引擎相依性](client-dependencies.md#engine-dependency)。

## 配置代理 {id="configure_proxy"}

要配置代理設定，請在[用戶端配置區塊](client-create-and-configure.md#configure-client)內呼叫 `engine` 函數，然後使用 `proxy` 屬性。
此屬性接受一個 `ProxyConfig` 實例，該實例可以使用 [ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 工廠建立。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTP 代理 {id="http_proxy"}

以下範例展示如何使用 `ProxyBuilder` 配置 HTTP 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

在 JVM 上，`ProxyConfig` 會映射到 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 類別，因此您可以如下配置代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 代理 {id="socks_proxy"}

以下範例展示如何使用 `ProxyBuilder` 配置 SOCKS 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

與 HTTP 代理類似，在 JVM 上您可以使用 `Proxy` 來配置代理設定：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 代理驗證與授權 {id="proxy_auth"}

代理驗證與授權是引擎特定的，應手動處理。
例如，要使用基本驗證將 Ktor 用戶端驗證到 HTTP 代理伺服器，請如下方式將 `Proxy-Authorization` 標頭附加到[每個請求](client-default-request.md)中：

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

要在 JVM 上將 Ktor 用戶端驗證到 SOCKS 代理，您可以使用 `java.net.socks.username` 和 `java.net.socks.password` [系統屬性](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)。