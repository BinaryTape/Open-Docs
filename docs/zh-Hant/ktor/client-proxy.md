[//]: # (title: 代理)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 用戶端允許你在多平台專案中配置代理設定。
支援的代理類型有兩種：[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) 與 [SOCKS](https://en.wikipedia.org/wiki/SOCKS)。

### 支援的引擎 {id="supported_engines"}

下表顯示特定[引擎](client-engines.md)支援的代理類型：

| 引擎         | HTTP 代理 | SOCKS 代理 |
|------------|----------|-----------|
| Apache     | ✅        | ✖️        |
| Java       | ✅        | ✖️        |
| Jetty      | ✖️       | ✖️        |
| CIO        | ✅        | ✖️        |
| Android    | ✅        | ✅         |
| OkHttp     | ✅        | ✅         |
| JavaScript | ✖️       | ✖️        |
| Darwin     | ✅        | ✅         |
| Curl       | ✅        | ✅         |

> 請注意，Darwin 引擎的 HTTP 代理目前不支援 HTTPS 請求。

## 新增相依性 {id="add_dependencies"}

要在用戶端中配置代理，你不需要新增特定的相依性。必要的相依性為：
- [ktor-client-core](client-dependencies.md#client-dependency)；
- [引擎相依性](client-dependencies.md#engine-dependency)。

## 配置代理 {id="configure_proxy"}

要配置代理設定，請在[用戶端配置區塊](client-create-and-configure.md#configure-client)內呼叫 `engine` 函式，然後使用 `proxy` 屬性。
此屬性接受 `ProxyConfig` 執行個體，該執行個體可使用 [ProxyBuilder](https://api.ktor.io/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 工廠建立。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // 建立代理配置
    }
}
```

### HTTP 代理 {id="http_proxy"}

下列範例示範如何使用 `ProxyBuilder` 配置 HTTP 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

在 JVM 上，`ProxyConfig` 會對應到 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 類別，因此你可以按照以下方式配置代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 代理 {id="socks_proxy"}

下列範例示範如何使用 `ProxyBuilder` 配置 SOCKS 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

與 HTTP 代理相同，在 JVM 上你可以使用 `Proxy` 來配置代理設定：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 代理驗證與授權 {id="proxy_auth"}

代理驗證與授權是引擎特定的，應手動處理。
例如，若要使用基本驗證（basic authentication）向 HTTP 代理伺服器驗證 Ktor 用戶端，請將 `Proxy-Authorization` 標頭附加到[每個請求](client-default-request.md)，如下所示：

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

若要在 JVM 上向 SOCKS 代理驗證 Ktor 用戶端，你可以使用 `java.net.socks.username` 與 `java.net.socks.password` [系統屬性](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)。