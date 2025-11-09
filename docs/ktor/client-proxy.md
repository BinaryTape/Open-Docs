[//]: # (title: 代理)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 客户端允许你在多平台项目中配置代理设置。支持两种类型的代理：[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) 和 [SOCKS](https://en.wikipedia.org/wiki/SOCKS)。

### 支持的引擎 {id="supported_engines"}

下表显示了特定 [引擎](client-engines.md) 支持的代理类型：

| 引擎         | HTTP 代理 | SOCKS 代理 |
|------------|-----------|------------|
| Apache     | ✅         | ✖️         |
| Java       | ✅         | ✖️         |
| Jetty      | ✖️         | ✖️         |
| CIO        | ✅         | ✖️         |
| Android    | ✅         | ✅          |
| OkHttp     | ✅         | ✅          |
| JavaScript | ✖️         | ✖️         |
| Darwin     | ✅         | ✅          |
| Curl       | ✅         | ✅          |

> 请注意，目前 Darwin 引擎的 HTTP 代理不支持 HTTPS 请求。

## 添加依赖项 {id="add_dependencies"}

要在客户端中配置代理，你无需添加特定依赖项。所需的依赖项是：
- [ktor-client-core](client-dependencies.md#client-dependency);
- [引擎依赖项](client-dependencies.md#engine-dependency)。

## 配置代理 {id="configure_proxy"}

要配置代理设置，请在 [客户端配置块](client-create-and-configure.md#configure-client) 内调用 `engine` 函数，然后使用 `proxy` 属性。该属性接受 `ProxyConfig` 实例，可以使用 [ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 工厂创建它。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // Create proxy configuration
    }
}
```

### HTTP 代理 {id="http_proxy"}

以下示例展示了如何使用 `ProxyBuilder` 配置 HTTP 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

在 JVM 上，`ProxyConfig` 映射到 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 类，因此你可以如下配置代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 代理 {id="socks_proxy"}

以下示例展示了如何使用 `ProxyBuilder` 配置 SOCKS 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

与 HTTP 代理类似，在 JVM 上你可以使用 `Proxy` 配置代理设置：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 代理认证与授权 {id="proxy_auth"}

代理认证与授权是引擎特有的，应手动处理。例如，要使用基本认证将 Ktor 客户端认证到 HTTP 代理服务器，请将 `Proxy-Authorization` 请求头附加到 [每个请求](client-default-request.md) 中，如下所示：

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

要在 JVM 上认证 Ktor 客户端到 SOCKS 代理，你可以使用 `java.net.socks.username` 和 `java.net.socks.password` [系统属性](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)。