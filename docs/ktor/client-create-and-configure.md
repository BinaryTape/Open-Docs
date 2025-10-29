[//]: # (title: 创建和配置客户端)

<show-structure for="chapter" depth="2"/>

<link-summary>学习如何创建和配置 Ktor 客户端。</link-summary>

添加[客户端依赖项](client-dependencies.md)后，您可以通过创建 [HttpClient](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client/index.html) 类实例并传入一个 [engine](client-engines.md) 作为形参来实例化客户端：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

在此示例中，我们使用了 [CIO](https://api.ktor.io/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。
您也可以省略 engine：

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

在这种情况下，客户端将根据[构建脚本中添加的](client-dependencies.md#engine-dependency) artifact 自动选择一个 engine。您可以从[默认 engine](client-engines.md#default) 文档章节中了解客户端如何选择 engine。

## 配置客户端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置客户端，您可以向客户端构造函数传入一个额外的函数式形参。
[HttpClientConfig](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/index.html) 类是配置客户端的基类。
例如，您可以使用 `expectSuccess` 属性来启用[响应验证](client-response-validation.md)：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

### 引擎配置 {id="engine-config"}
您可以使用 `engine` 函数来配置 engine：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    engine {
        // Configure an engine
    }
}
```

关于更多详情，请参见[引擎](client-engines.md)章节。

### 插件 {id="plugins"}
要安装插件，您需要将其传入[客户端配置代码块](#configure-client)内的 `install` 函数。例如，您可以通过安装 [Logging](client-logging.md) 插件来记录 HTTP 调用：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

您也可以在 `install` 代码块内配置插件。例如，对于 [Logging](client-logging.md) 插件，您可以指定日志器、日志级别以及过滤日志消息的条件：
```kotlin
val client = HttpClient(CIO) {
    install(Logging) {
        logger = Logger.DEFAULT
        level = LogLevel.HEADERS
        filter { request ->
            request.url.host.contains("ktor.io")
        }
        sanitizeHeader { header -> header == HttpHeaders.Authorization }
    }
}
```

请注意，特定插件可能需要独立的[依赖项](client-dependencies.md)。

## 使用客户端 {id="use-client"}
在您[添加](client-dependencies.md)所有必需的依赖项并创建客户端后，您可以使用它来[发送请求](client-requests.md)和[接收响应](client-responses.md)。

## 关闭客户端 {id="close-client"}

完成使用 HTTP 客户端后，您需要释放资源：线程、连接以及用于协程的 `CoroutineScope`。为此，请调用 `HttpClient.close` 函数：

```kotlin
client.close()
```

请注意，`close` 函数禁止创建新请求，但不会终止当前活跃的请求。资源仅会在所有客户端请求完成后才会被释放。

如果您需要将 `HttpClient` 用于单个请求，请调用 `use` 函数，它会在执行代码块后自动调用 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 请注意，创建 `HttpClient` 并非廉价操作，在处理多个请求时最好重用其实例。