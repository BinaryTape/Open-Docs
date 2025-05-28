[//]: # (title: 接收响应)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收响应、获取响应体以及获取响应参数。
</link-summary>

所有用于[发送 HTTP 请求](client-requests.md)的函数（如 `request`、`get`、`post` 等）都允许您以 [`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 对象的形式接收响应。

`HttpResponse` 提供了获取[响应体](#body)（以原始字节、JSON 对象等多种方式）和获取[响应参数](#parameters)（如状态码、内容类型和头部）所需的 API。例如，您可以按以下方式接收不带参数的 `GET` 请求的 `HttpResponse`：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

## 接收响应参数 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 类允许您获取各种响应参数，例如状态码、头部、HTTP 版本等。

### 状态码 {id="status"}

要获取响应的状态码，请使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 属性：

```kotlin
```

{src="snippets/_misc_client/ResponseTypes.kt" include-lines="1-4,9,11,15-17"}

### 头部 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 属性允许您获取包含所有响应头部的 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射。此外，`HttpResponse` 提供了以下用于接收特定头部值的函数：

* `contentType` 用于 `Content-Type` 头部值
* `charset` 用于 `Content-Type` 头部值中的字符集
* `etag` 用于 `E-Tag` 头部值
* `setCookie` 用于 `Set-Cookie` 头部值
  > Ktor 还提供了 [HttpCookies](client-cookies.md) 插件，允许您在调用之间保持 cookie。

## 接收响应体 {id="body"}

### 原始响应体 {id="raw"}

要接收响应的原始响应体，请调用 `body` 函数并将所需的类型作为参数传递。以下代码片段展示了如何将原始响应体接收为 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)：

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,12"}

类似地，您可以将响应体获取为 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)：

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,13"}

以下[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)展示了如何将响应作为 `ByteArray` 获取并保存到文件：

```kotlin
```
{src="snippets/client-download-file/src/main/kotlin/com/example/Downloader.kt" include-lines="12-24"}

上述示例中的 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 扩展函数用于显示下载进度。

这种方法一次性将整个响应加载到内存中，这对于大文件可能会出现问题。为了减少内存使用，请考虑以块（chunks）的形式[流式传输数据](#streaming)。

### JSON 对象 {id="json"}

安装了 [ContentNegotiation](client-serialization.md) 插件后，您可以在接收响应时将 JSON 数据反序列化为数据类：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

要了解更多信息，请参阅 [](client-serialization.md#receive_send_data)。

> ContentNegotiation 插件同时适用于[客户端](client-serialization.md)和[服务器](server-serialization.md)。请确保根据您的具体情况使用正确的插件。

### 流式传输数据 {id="streaming"}

当您调用 `HttpResponse.body` 函数以获取响应体时，Ktor 会在内存中处理响应并返回完整的响应体。如果您需要按顺序获取响应块而不是等待整个响应，请使用 `HttpStatement` 及其作用域 [execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 块。
以下[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)展示了如何以块（字节包）的形式接收响应内容并将其保存到文件：

```kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

在此示例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用于异步读取数据。使用 `ByteReadChannel.readRemaining()` 可以检索通道中所有可用的字节，而 `Source.transferTo()` 则直接将数据写入文件，从而减少不必要的分配。

要将响应体保存到文件而无需额外处理，您可以使用 [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函数：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}