[//]: # (title: 超时)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) 插件允许你配置以下超时设置：
* __请求超时__ — 处理一次 HTTP 调用的所需时间：从发送请求到接收响应。
* __连接超时__ — 客户端应与服务器建立连接的时间。
* __套接字超时__ — 与服务器交换数据时，两个数据包之间最长不活动时间。

你可以为所有请求或仅为特定请求指定这些超时设置。

## 添加依赖项 {id="add_dependencies"}
`HttpTimeout` 仅需 [ktor-client-core](client-dependencies.md) 构件，不需要任何特定依赖项。

## 安装 HttpTimeout {id="install_plugin"}

要安装 `HttpTimeout`，请将其传递给 [client configuration block](client-create-and-configure.md#configure-client) 中的 `install` 函数：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 配置超时设置 {id="configure_plugin"}

要配置超时设置，你可以使用相应的属性：

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  指定整个 HTTP 调用的超时时间，从发送请求到接收响应。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  指定与服务器建立连接的超时时间。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  指定与服务器交换数据时，两个数据包之间最长不活动时间。

你可以在 `install` 块中为所有请求指定超时设置。下面的代码示例展示了如何使用 `requestTimeoutMillis` 设置请求超时：
[object Promise]

如果你只需要为特定请求设置超时，请使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) 属性：

[object Promise]

请注意，为特定请求指定的超时设置会覆盖 `install` 块中的全局超时设置。

如果发生超时，Ktor 会抛出 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 对特定 [引擎](client-engines.md) 存在一些限制。下表展示了这些引擎支持的超时类型：

| 引擎                             | 请求超时 | 连接超时 | 套接字超时 |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |