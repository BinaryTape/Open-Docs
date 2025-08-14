[//]: # (title: 代理)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 用戶端允許您在多平台專案中設定代理伺服器設定。支援的代理伺服器類型有兩種：[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) 和 [SOCKS](https://en.wikipedia.org/wiki/SOCKS)。

### 支援的引擎 {id="supported_engines"}

下表顯示了特定[引擎](client-engines.md)支援的代理類型：

| 引擎     | HTTP 代理 | SOCKS 代理 |
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

> 請注意，目前 Darwin 引擎不支援透過 HTTP 代理進行 HTTPS 請求。

## 新增依賴 {id="add_dependencies"}

要在用戶端中設定代理，您不需要新增特定的依賴。所需的依賴為：
- [ktor-client-core](client-dependencies.md#client-dependency)；
- [引擎依賴](client-dependencies.md#engine-dependency)。

## 設定代理 {id="configure_proxy"}

要設定代理伺服器設定，請在[用戶端設定區塊](client-create-and-configure.md#configure-client)中呼叫 `engine` 函數，然後使用 `proxy` 屬性。此屬性接受 `ProxyConfig` 實例，該實例可以使用 [ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 工廠建立。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTP 代理 {id="http_proxy"}

以下範例展示了如何使用 `ProxyBuilder` 設定 HTTP 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

在 JVM 上，`ProxyConfig` 被映射到 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 類別，因此您可以按如下方式設定代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 代理 {id="socks_proxy"}

以下範例展示了如何使用 `ProxyBuilder` 設定 SOCKS 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

與 HTTP 代理一樣，在 JVM 上您可以使用 `Proxy` 來設定代理伺服器設定：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 代理驗證與授權 {id="proxy_auth"}

代理驗證和授權是引擎特定的，應手動處理。例如，要使用基本驗證來驗證 Ktor 用戶端到 HTTP 代理伺服器，請將 `Proxy-Authorization` 標頭附加到[每個請求](client-default-request.md)，如下所示：

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

要在 JVM 上驗證 Ktor 用戶端到 SOCKS 代理，您可以使用 `java.net.socks.username` 和 `java.net.socks.password` [系統屬性](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)。