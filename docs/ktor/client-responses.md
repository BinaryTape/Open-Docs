[//]: # (title: 接收响应)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收响应、获取响应正文和获取响应参数。
</link-summary>

所有用于[发出 HTTP 请求](client-requests.md)的函数（如 `request`、`get`、`post` 等）都允许你将响应作为 [`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 对象接收。

`HttpResponse` 公开所需的 API，以各种方式（原始字节、JSON 对象等）获取[响应正文](#body)并获取[响应参数](#parameters)，例如状态码、内容类型和请求头。例如，你可以按以下方式接收不带参数的 `GET` 请求的 `HttpResponse`：

[object Promise]

## 接收响应参数 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 类允许你获取各种响应参数，例如状态码、请求头、HTTP 版本等。

### 状态码 {id="status"}

要获取响应的状态码，请使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 属性：

[object Promise]

### 请求头 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 属性允许你获取包含所有响应头的 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射。此外，`HttpResponse` 还公开了以下函数用于接收特定的请求头值：

* `contentType` 用于 `Content-Type` 请求头值
* `charset` 用于 `Content-Type` 请求头值中的字符集。
* `etag` 用于 `E-Tag` 请求头值。
* `setCookie` 用于 `Set-Cookie` 请求头值。
  > Ktor 还提供了 [HttpCookies](client-cookies.md) 插件，允许你在多次调用之间保留 Cookie。

## 接收响应正文 {id="body"}

### 原始正文 {id="raw"}

要接收响应的原始正文，请调用 `body` 函数并传入所需的类型作为参数。以下代码片段展示了如何将原始正文作为 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 接收：

[object Promise]

类似地，你可以将正文作为 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) 获取：

[object Promise]

以下是一个[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)，展示了如何将响应作为 `ByteArray` 获取并保存到文件中：

[object Promise]

上述示例中的 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 扩展函数用于显示下载进度。

对于非流式请求，响应正文会自动加载并缓存到内存中，从而允许重复访问。虽然这对于小负载是高效的，但对于大型响应可能会导致高内存使用。

为了高效处理大型响应，请使用[流式处理方法](#streaming)，它会以增量方式处理响应，而无需将其保存在内存中。

### JSON 对象 {id="json"}

安装 [ContentNegotiation](client-serialization.md) 插件后，你可以在接收响应时将 JSON 数据反序列化为数据类：

[object Promise]

要了解更多信息，请参阅 [](client-serialization.md#receive_send_data)。

> ContentNegotiation 插件适用于[客户端](client-serialization.md)和[服务器](server-serialization.md)。请确保根据你的情况使用正确的插件。

### 流式数据 {id="streaming"}

当你调用 `HttpResponse.body` 函数获取正文时，Ktor 会在内存中处理响应并返回完整的响应正文。如果你需要按顺序获取响应块而不是等待整个响应，请使用带有作用域 [execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 代码块的 `HttpStatement`。
以下是一个[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)，展示了如何以数据块（字节包）的形式接收响应内容并将其保存到文件中：

[object Promise]

在此示例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用于异步读取数据。使用 `ByteReadChannel.readRemaining()` 可以检索通道中所有可用的字节，而 `Source.transferTo()` 则将数据直接写入文件，从而减少不必要的内存分配。

为了将响应正文保存到文件而无需额外处理，你可以改用 [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函数：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```