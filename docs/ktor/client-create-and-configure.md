[//]: # (title: 创建和配置客户端)

<show-structure for="chapter" depth="2"/>

<link-summary>学习如何创建和配置 Ktor 客户端。</link-summary>

添加[客户端依赖项](client-dependencies.md)后，你可以通过创建 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 类实例并传入[引擎](client-engines.md)作为形参来实例化客户端：

[object Promise]

在此示例中，我们使用 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。
你也可以省略引擎：

[object Promise]

在这种情况下，客户端将根据[在构建脚本中添加的](client-dependencies.md#engine-dependency) artifact 自动选择引擎。你可以从 [](client-engines.md#default) 文档章节中了解客户端如何选择引擎。

## 配置客户端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置客户端，你可以向客户端构造函数传入一个额外的函数形参。
[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) 类是配置客户端的基类。
例如，你可以使用 `expectSuccess` 属性启用[响应验证](client-response-validation.md)：

[object Promise]

### 引擎配置 {id="engine-config"}
你可以使用 `engine` 函数配置引擎：

[object Promise]

关于更多详细信息，请参见 [Engines](client-engines.md) 章节。

### 插件 {id="plugins"}
要安装插件，你需要将其传入[客户端配置代码块](#configure-client)内的 `install` 函数。例如，你可以通过安装 [Logging](client-logging.md) 插件来记录 HTTP 调用：

[object Promise]

你也可以在 `install` 代码块内配置插件。例如，对于 [Logging](client-logging.md) 插件，你可以指定日志记录器、日志级别以及过滤日志消息的条件：
[object Promise]

请注意，特定插件可能需要单独的[依赖项](client-dependencies.md)。

## 使用客户端 {id="use-client"}
在添加了所有必需的[依赖项](client-dependencies.md)并创建了客户端后，你可以使用它来[发出请求](client-requests.md)和[接收响应](client-responses.md)。

## 关闭客户端 {id="close-client"}

使用完 HTTP 客户端后，你需要释放资源：线程、连接以及协程的 `CoroutineScope`。为此，请调用 `HttpClient.close` 函数：

```kotlin
client.close()
```

请注意，`close` 函数禁止创建新请求，但不会终止当前正在执行的请求。资源只会在所有客户端请求完成后才会被释放。

如果你需要将 `HttpClient` 用于单个请求，请调用 `use` 函数，它会在代码块执行完毕后自动调用 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 请注意，创建 `HttpClient` 不是一个廉价的操作，在处理多个请求的情况下，最好重用其实例。