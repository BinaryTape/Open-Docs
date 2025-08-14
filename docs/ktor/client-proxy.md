[//]: # (title: 代理)

<show-structure for="chapter" depth="2"/>

Ktor HTTP 客户端允许您在多平台项目中配置代理设置。Ktor 支持两种代理类型：[HTTP](https://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) 和 [SOCKS](https://en.wikipedia.org/wiki/SOCKS)。

### 支持的引擎 {id="supported_engines"}

下表显示了针对特定[引擎](client-engines.md)支持的代理类型：

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

> 请注意，目前通过 HTTP 代理不支持 Darwin 引擎的 HTTPS 请求。

## 添加依赖项 {id="add_dependencies"}

要在客户端中配置代理，您无需添加特定的依赖项。所需的依赖项包括：
- [ktor-client-core](client-dependencies.md#client-dependency)；
- [一个引擎依赖项](client-dependencies.md#engine-dependency)。

## 配置代理 {id="configure_proxy"}

要配置代理设置，请在[客户端配置代码块](client-create-and-configure.md#configure-client)内部调用 `engine` 函数，然后使用 `proxy` 属性。此属性接受一个 `ProxyConfig` 实例，该实例可以使用 [ProxyBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-proxy-builder/index.html) 工厂来创建。

```kotlin
val client = HttpClient() {
    engine {
        proxy = // 创建代理配置
    }
}
```

### HTTP 代理 {id="http_proxy"}

下面的示例展示了如何使用 `ProxyBuilder` 配置 HTTP 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.http("http://sample-proxy-server:3128/")
    }
}
```

在 JVM 上，`ProxyConfig` 映射到 [Proxy](https://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) 类，因此您可以按如下方式配置代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("sample-proxy-server", 3128))
    }
}
```

### SOCKS 代理 {id="socks_proxy"}

下面的示例展示了如何使用 `ProxyBuilder` 配置 SOCKS 代理：

```kotlin
val client = HttpClient() {
    engine {
        proxy = ProxyBuilder.socks(host = "sample-proxy-server", port = 1080)
    }
}
```

与 HTTP 代理类似，在 JVM 上您可以使用 `Proxy` 来配置代理设置：

```kotlin
val client = HttpClient() {
    engine {
        proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress("sample-proxy-server", 1080))
    }
}
```

## 代理认证与授权 {id="proxy_auth"}

代理认证和授权是引擎特有的，并且需要手动处理。例如，要使用基本认证来认证 Ktor 客户端到 HTTP 代理服务器，请将 `Proxy-Authorization` 头追加到[每个请求](client-default-request.md)中，如下所示：

```kotlin
val client = HttpClient() {
    defaultRequest {
        val credentials = Base64.getEncoder().encodeToString("jetbrains:foobar".toByteArray())
        header(HttpHeaders.ProxyAuthorization, "Basic $credentials")
    }
}
```

要在 JVM 上认证 Ktor 客户端到 SOCKS 代理，您可以使用 `java.net.socks.username` 和 `java.net.socks.password` [系统属性](https://docs.oracle.com/javase/7/docs/api/java/net/doc-files/net-properties.html)。