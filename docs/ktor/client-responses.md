[//]: # (title: 接收响应)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收响应、获取响应体以及获取响应参数。
</link-summary>

所有用于[发送 HTTP 请求](client-requests.md)的函数（如 `request`、`get`、`post` 等）都允许你以
[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
对象的形式接收响应。

`HttpResponse` 暴露了所需的 API，用于以各种方式（原始字节、JSON 对象等）获取[响应体](#body)，以及获取[响应参数](#parameters)，例如状态码、内容类型和标头。
例如，你可以通过以下方式接收不带参数的 `GET` 请求的 `HttpResponse`：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 接收响应参数 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
类允许你获取各种响应参数，例如状态码、标头、HTTP 版本等。

### 状态码 {id="status"}

要获取响应的状态码，请使用
[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html)
属性：

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

val httpResponse: HttpResponse = client.get("https://ktor.io/")
if (httpResponse.status.value in 200..299) {
    println("Successful response!")
}
```

### 标头 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
属性允许你获取一个包含所有响应标头的 [`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射。此外，`HttpResponse` 暴露了以下用于接收特定标头值的函数：

* `contentType` 用于 `Content-Type` 标头值
* `charset` 用于从 `Content-Type` 标头值获取字符集。
* `etag` 用于 `E-Tag` 标头值。
* `setCookie` 用于 `Set-Cookie` 标头值。
  > Ktor 也提供了 [HttpCookies](client-cookies.md) 插件，允许你在调用之间保持 cookie。

## 接收响应体 {id="body"}

### 原始体 {id="raw"}

要接收响应的原始体，请调用 `body` 函数并传入所需类型作为参数。下面的代码片段展示了如何以 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 的形式接收原始体：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

类似地，你可以以 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) 的形式获取体：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

下面的[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)
展示了如何以 `ByteArray` 的形式获取响应并将其保存到文件：

```kotlin
    val client = HttpClient()
    val file = File.createTempFile("files", "index")

    runBlocking {
        val httpResponse: HttpResponse = client.get("https://ktor.io/") {
            onDownload { bytesSentTotal, contentLength ->
                println("Received $bytesSentTotal bytes from $contentLength")
            }
        }
        val responseBody: ByteArray = httpResponse.body()
        file.writeBytes(responseBody)
        println("A file saved to ${file.path}")
    }
```

上面示例中的 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html)
扩展函数用于显示下载进度。

对于非流式请求，响应体会自动加载并缓存到内存中，允许重复访问。虽然这对于小负载是高效的，但对于大响应可能会导致高内存使用。

为了高效处理大响应，请使用[流式方法](#streaming)，
它会递增地处理响应，而不将其保存在内存中。

### JSON 对象 {id="json"}

安装 [ContentNegotiation](client-serialization.md) 插件后，你可以在接收响应时将 JSON 数据反序列化为数据类：

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

要了解更多信息，请参见[接收和发送数据](client-serialization.md#receive_send_data)。

> ContentNegotiation 插件适用于[客户端](client-serialization.md)和
> [服务器](server-serialization.md)。请确保针对你的情况使用正确的插件。

### Multipart 表单数据 {id="multipart"}

当接收到包含 Multipart 表单数据的响应时，你可以将其体读取为
[`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html) 实例。
这允许你处理响应中包含的表单字段和文件。

下面的示例演示了如何处理来自 multipart 响应的文本表单字段和文件上传：

```kotlin
val response = client.post("https://myserver.com/multipart/receive")

val multipart = response.body<MultiPartData>()

multipart.forEachPart { part ->
    when (part) {
        is PartData.FormItem -> {
            println("Form item key: ${part.name}")
            val value = part.value
            // ...
        }
        is PartData.FileItem -> {
            println("file: ${part.name}")
            println(part.originalFileName)
            val fileContent: ByteReadChannel = part.provider()
            // ...
        }
    }
    part.dispose()
}
```

#### 表单字段

`PartData.FormItem` 表示一个表单字段，其值可以通过 `value` 属性访问：

```kotlin
when (part) {
    is PartData.FormItem -> {
        println("Form item key: ${part.name}")
        val value = part.value
        // ...
    }
}
```

#### 文件上传

`PartData.FileItem` 表示一个文件项。你可以将文件上传作为字节流处理：

```kotlin
when (part) {
    is PartData.FileItem -> {
        println("file: ${part.name}")
        println(part.originalFileName)
        val fileContent: ByteReadChannel = part.provider()
        // ...
    }
}
```

#### 资源清理

一旦表单处理完成，每个部分都会通过调用 `.dispose()` 函数来释放资源。

```kotlin
part.dispose()
```

### 流式数据 {id="streaming"}

当你调用 `HttpResponse.body` 函数以获取体时，Ktor 会在内存中处理响应并返回完整的响应体。如果你需要顺序获取响应块而不是等待整个响应，请使用带作用域
[`execute`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)
代码块的 `HttpStatement`。
下面的[可运行示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)
展示了如何以块（字节包）的形式接收响应内容并将其保存到文件：

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

在此示例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用于异步读取数据。使用 `ByteReadChannel.readRemaining()` 会检索通道中所有可用的字节，而
`Source.transferTo()` 直接将数据写入文件，从而减少不必要的内存分配。

若要将响应体保存到文件而无需额外处理，你可以改为使用
[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函数：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```