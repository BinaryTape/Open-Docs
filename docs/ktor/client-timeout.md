[//]: # (title: 超时)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout) 插件允许你配置以下超时：
*   **请求超时 (request timeout)** — 处理一次 HTTP 调用所需的时间：从发送请求到接收响应。
*   **连接超时 (connection timeout)** — 客户端与服务器建立连接应花费的时间段。
*   **套接字超时 (socket timeout)** — 与服务器交换数据时，两个数据包之间的最大非活动时间。

你可以为所有请求或仅针对特定请求指定这些超时。

## 添加依赖项 {id="add_dependencies"}
`HttpTimeout` 仅需要 [ktor-client-core](client-dependencies.md) 构件，不需要任何特定的依赖项。

## 安装 HttpTimeout {id="install_plugin"}

要安装 `HttpTimeout`，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 内部的 `install` 函数：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 配置超时 {id="configure_plugin"}

要配置超时，你可以使用相应的属性：

*   [requestTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
    为整个 HTTP 调用指定超时，从发送请求到接收响应。
*   [connectTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
    为与服务器建立连接指定超时。
*   [socketTimeoutMillis](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
    为与服务器交换数据时，两个数据包之间的最大间隔时间指定超时。

你可以在 `install` 块内为所有请求指定超时。下面的代码示例展示了如何使用 `requestTimeoutMillis` 设置请求超时：
```kotlin
val client = HttpClient(CIO) {
    install(HttpTimeout) {
        requestTimeoutMillis = 1000
    }
}
```

如果你需要仅为特定请求设置超时，请使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/timeout.html) 属性：

```kotlin
val response: HttpResponse = client.get("http://0.0.0.0:8080/path1") {
    timeout {
        requestTimeoutMillis = 3000
    }
}
```

请注意，为特定请求指定的超时会覆盖 `install` 块中的全局超时。

在发生超时的情况下，Ktor 会抛出 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 对特定的 [引擎 (engine)](client-engines.md) 有一些限制。下表显示了这些引擎支持哪些超时：

| 引擎 (Engine)                        | 请求超时 | 连接超时 | 套接字超时 |
|------------------------------------|------|------|------|
| [Darwin](client-engines.md#darwin) | ✅️   | ✖️   | ✅️   |
| [JavaScript](client-engines.md#js) | ✅    | ✖️   | ✖️   |
| [Curl](client-engines.md#curl)     | ✅    | ✅️   | ✖️   |
| [MockEngine](client-testing.md)    | ✅    | ✖️   | ✅    |