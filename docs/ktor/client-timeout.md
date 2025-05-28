[//]: # (title: 超时)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) 插件允许您配置以下超时：
* __请求超时__ — 处理 HTTP 调用所需的时间段：从发送请求到接收响应。
* __连接超时__ — 客户端应与服务器建立连接的时间段。
* __Socket 超时__ — 与服务器交换数据时，两个数据包之间的最大不活动时间。

您可以为所有请求或仅特定请求指定这些超时。

## 添加依赖项 {id="add_dependencies"}
`HttpTimeout` 只需要 [ktor-client-core](client-dependencies.md) 工件，不需要任何特定的依赖项。

## 安装 HttpTimeout {id="install_plugin"}

要安装 `HttpTimeout`，请在 [客户端配置块](client-create-and-configure.md#configure-client) 中将其传递给 `install` 函数：
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

要配置超时，您可以使用相应的属性：

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  指定整个 HTTP 调用的超时，从发送请求到接收响应。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  指定与服务器建立连接的超时。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  指定与服务器交换数据时，两个数据包之间的最大不活动时间。

您可以在 `install` 块内为所有请求指定超时。下面的代码示例展示了如何使用 `requestTimeoutMillis` 设置请求超时：
```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

如果您只需要为特定请求设置超时，请使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) 属性：

```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="24-28"}

请注意，为特定请求指定的超时会覆盖 `install` 块中的全局超时。

如果发生超时，Ktor 会抛出 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 对特定的 [引擎](client-engines.md) 有一些限制。下表显示了这些引擎支持哪些超时：

| 引擎                             | 请求超时 | 连接超时 | Socket 超时 |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |