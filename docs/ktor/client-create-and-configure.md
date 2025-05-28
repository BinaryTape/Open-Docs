[//]: # (title: 创建和配置客户端)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何创建和配置 Ktor 客户端。</link-summary>

添加[客户端依赖项](client-dependencies.md)后，您可以通过创建 `HttpClient` 类实例并传入[引擎](client-engines.md)作为参数来实例化客户端：

```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

在此示例中，我们使用 `CIO` 引擎。您也可以省略引擎：

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

在这种情况下，客户端将根据[构建脚本中添加的](client-dependencies.md#engine-dependency)构件自动选择引擎。您可以从[](client-engines.md#default)文档部分了解客户端如何选择引擎。

## 配置客户端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置客户端，您可以向客户端构造函数传入一个额外的函数式参数。`HttpClientConfig` 类是配置客户端的基类。例如，您可以使用 `expectSuccess` 属性启用[响应验证](client-response-validation.md)：

```kotlin
```
{src="snippets/_misc_client/BasicClientConfig.kt"}

### 引擎配置 {id="engine-config"}
您可以使用 `engine` 函数配置引擎：

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfig.kt"}

有关更多详细信息，请参阅[引擎](client-engines.md)部分。

### 插件 {id="plugins"}
要安装插件，您需要将其传入[客户端配置块](#configure-client)内的 `install` 函数。例如，您可以通过安装 `Logging` [插件](client-logging.md)来记录 HTTP 调用：

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

您还可以在 `install` 块内配置插件。例如，对于 `Logging` [插件](client-logging.md)，您可以指定日志器、日志级别以及过滤日志消息的条件：
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="13-22"}

请注意，特定的插件可能需要单独的[依赖项](client-dependencies.md)。

## 使用客户端 {id="use-client"}
在您[添加](client-dependencies.md)所有必需的依赖项并创建客户端后，您可以使用它来[发出请求](client-requests.md)和[接收响应](client-responses.md)。

## 关闭客户端 {id="close-client"}

完成 `HTTP` 客户端的工作后，您需要释放资源：线程、连接和协程的 `CoroutineScope`。为此，请调用 `HttpClient.close` 函数：

```kotlin
client.close()
```

请注意，`close` 函数会禁止创建新请求，但不会终止当前活跃的请求。资源只会在所有客户端请求完成后才会被释放。

如果您需要将 `HttpClient` 用于单个请求，请调用 `use` 函数，它会在代码块执行后自动调用 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 请注意，创建 `HttpClient` 并不是一项开销小的操作，在有多个请求的情况下，最好复用其实例。