[//]: # (title: 接收响应)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解如何接收响应、获取响应体以及获取响应参数。
</link-summary>

所有用于[发起 HTTP 请求](client-requests.md)的函数（`request`、`get`、`post` 等）都允许您将响应接收为 [`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 对象。

`HttpResponse` 提供了通过各种方式（原始字节、JSON 对象等）获取[响应体](#body)以及获取状态码、内容类型和标头等[响应参数](#parameters)所需的 API。
例如，您可以通过以下方式接收不带参数的 `GET` 请求的 `HttpResponse`：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 接收响应参数 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 类允许您获取各种响应参数，例如状态码、标头、HTTP 版本等。

### 状态码 {id="status"}

要获取响应的状态码，请使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 属性：

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

[`HttpResponse.headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 属性允许您获取包含所有响应标头的 [`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射。

此外，`HttpResponse` 类还提供了以下函数用于接收特定的标头值：

* `contentType()` 用于获取 `Content-Type` 标头值。
* `charset()` 用于从 `Content-Type` 标头值中获取字符集。
* `etag()` 用于获取 `E-Tag` 标头值。
* `setCookie()` 用于获取 `Set-Cookie` 标头值。
  > Ktor 还提供了 [`HttpCookies`](client-cookies.md) 插件，允许您在调用之间保持 Cookie。

#### 拆分标头值

如果标头可以包含多个以逗号或分号分隔的值，您可以使用 `.getSplitValues()` 函数从标头中检索所有拆分后的值：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val headers: Headers = httpResponse.headers

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```

使用常用的 `get` 运算符将返回未拆分的值：

```kotlin
val values = headers["X-Multi-Header"]!!
// ["1, 2", "3"]
```

## 接收响应体 {id="body"}

### 原始体 {id="raw"}

要接收响应的原始体，请调用 `body` 函数并将所需的类型作为参数传递。下面的代码片段显示了如何将原始体接收为 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

同样，您可以将体获取为 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

下面的[可运行示例](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-download-file)展示了如何将响应获取为 `ByteArray` 并将其保存到文件中：

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

上述示例中的 [`onDownload()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/on-download.html) 扩展函数用于显示下载进度。

对于非流式请求，响应体会被自动加载并缓存到内存中，以便重复访问。虽然这对于小型负载很高效，但在处理大型响应时可能会导致高内存使用情况。

为了高效处理大型响应，请使用[流式方法](#streaming)，该方法会增量处理响应而不会将其保存在内存中。

### JSON 对象 {id="json"}

安装 [ContentNegotiation](client-serialization.md) 插件后，您可以在接收响应时将 JSON 数据反序列化为数据类：

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

要了解更多信息，请参阅[接收和发送数据](client-serialization.md#receive_send_data)。

> ContentNegotiation 插件同时适用于[客户端](client-serialization.md)和[服务器](server-serialization.md)。请确保根据您的用例使用正确的插件。

### 多部分表单数据 {id="multipart"}

当接收包含多部分表单数据的响应时，您可以将其响应体作为 [`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html) 实例读取。这允许您处理响应中包含的表单字段和文件。

下面的示例演示了如何处理多部分响应中的文本表单字段和文件上传：

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

`PartData.FormItem` 代表一个表单字段，其值可以通过 value 属性访问：

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

`PartData.FileItem` 代表一个文件项。您可以将文件上传作为字节流处理：

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

一旦表单处理完成，需要使用 `.dispose()` 函数销毁每个部分以释放资源。

```kotlin
part.dispose()
```

### 流式数据 {id="streaming"}

默认情况下，调用 `HttpResponse.body()` 会将完整的响应加载到内存中。对于大型响应或文件下载，通常最好分块处理数据，而不是等待完整的响应体。

Ktor 提供了几种使用 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 和 I/O 实用程序来实现此目的的方法。

#### 顺序分块处理

要按顺序分块处理响应，请使用 `HttpStatement` 配合作用域内的 [`execute`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 块。

> 在 JVM 上，`HttpStatement.execute {}` 和 `HttpStatement.body {}` 的引擎调度器执行是选择性加入的，以保持向后兼容性。
> 要在 JVM 上的引擎调度器上运行这些块，请将 `io.ktor.client.statement.useEngineDispatcher` JVM 系统属性设置为 `true`
> （例如，`-Dio.ktor.client.statement.useEngineDispatcher=true`）。
>
{style="warning"}

以下示例演示了分块读取响应并将其保存到文件中：

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize: Long = 1024 * 1024

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

使用 `ByteReadChannel.readRemaining()` 获取通道中所有可用的字节，而 `Source.transferTo()` 则直接将数据写入文件，从而减少了不必要的分配。

> 有关完整的流式示例，请参阅 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-download-streaming)。

#### 直接将响应写入文件

对于不需要逐块处理的简单下载，您可以选择以下方法之一：

- [将所有字节复制到 `ByteWriteChannel` 并关闭](#copyAndClose)。
- [复制到 `RawSink`](#readTo)。

##### 将所有字节复制到 `ByteWriteChannel` 并关闭 {id="copyAndClose"}

[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函数将 `ByteReadChannel` 中所有剩余的字节复制到 `ByteWriteChannel`，然后自动关闭这两个通道：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```

这对于您无需手动管理通道的完整文件下载非常方便。

##### 复制到 `RawSink` {id="readTo"}

[`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 函数在没有中间缓冲区的情况下直接将字节写入 `RawSink`：

```kotlin
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()

client.prepareGet(url).execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.readTo(stream)
}
println("A file saved to ${file.path}")

```

与 `.copyAndClose()` 不同，接收器在写入后保持打开状态，只有在传输过程中发生错误时才会自动关闭。

> 有关 Ktor 通道与 `RawSink`、`RawSource` 或 `OutputStream` 等类型之间的转换，请参阅 [I/O 互操作性](io-interoperability.md)。
>
{style="tip"}