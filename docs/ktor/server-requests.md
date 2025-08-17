[//]: # (title: 处理请求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由处理器内处理传入请求。</link-summary>

Ktor 允许您在[路由处理器](server-routing.md#define_route)内处理传入传入请求并发送[响应](server-responses.md)。处理请求时，您可以执行多种操作：
* 获取[请求信息](#request_information)，例如请求头、Cookie 等。
* 获取[路径参数](#path_parameters)值。
* 获取[查询字符串](#query_parameters)的参数。
* 接收[正文内容](#body_contents)，例如数据对象、表单参数和文件。

## 常规请求信息 {id="request_information"}
在路由处理器内，您可以使用 [call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html) 属性访问请求。这会返回 [ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 实例，并提供对各种请求参数的访问。例如，以下代码片段展示了如何获取请求 URI：
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text) 方法用于向客户端发送响应。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 对象允许您访问各种请求数据，例如：
* 请求头  
  要访问所有请求头，请使用 [ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 属性。您还可以使用专用的扩展函数访问特定请求头，例如 `acceptEncoding`、`contentType`、`cacheControl` 等。
* Cookie  
  [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 属性提供对与请求相关的 Cookie 的访问。要了解如何使用 Cookie 处理会话，请参阅[会话](server-sessions.md)部分。
* 连接详情  
  使用 [ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 属性访问连接详情，例如主机名、端口、方案等。
* `X-Forwarded-` 请求头  
  要获取通过 HTTP 代理或负载均衡器传递的请求信息，请安装 [Forwarded headers](server-forward-headers.md) 插件并使用 [ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 属性。

## 路径参数 {id="path_parameters"}
处理请求时，您可以使用 `call.parameters` 属性访问[路径参数](server-routing.md#path_parameter)值。例如，以下代码片段中的 `call.parameters["login"]` 对于 `/user/admin` 路径将返回 _admin_：
```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## 查询参数 {id="query_parameters"}

要访问<emphasis tooltip="query_string">查询字符串</emphasis>的参数，您可以使用 [ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 属性。例如，如果向 `/products?price=asc` 发出请求，您可以按以下方式访问 `price` 查询参数：

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // 显示从最低价到最高价的产品
    }
}
```

您还可以使用 [ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html) 函数获取整个查询字符串。

## 正文内容 {id="body_contents"}
本节展示了如何接收随 `POST`、`PUT` 或 `PATCH` 请求发送的正文内容。

### 原始有效负载 {id="raw"}

要访问原始正文有效负载并手动解析它，请使用 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函数，该函数接受要接收的有效负载类型。
假设您有以下 HTTP 请求：

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

您可以通过以下方式之一将此请求的正文作为指定类型的对象接收：

- **字符串**

   要将请求正文作为 String 值接收，请使用 `call.receive<String>()`。
   您也可以使用 [receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html) 来达到相同的结果：
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **字节数组**

   要将请求正文作为字节数组接收，请调用 `call.receive<ByteArray>()`：
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   您可以使用 `call.receive<ByteReadChannel>()` 或 [receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html) 来接收 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它支持字节序列的异步读取：
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readText()
       call.respondText(text)
   }
   ```

   以下示例展示了如何使用 `ByteReadChannel` 上传文件：
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

您可以在此处找到完整示例：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 对象 {id="objects"}
Ktor 提供了一个 [ContentNegotiation](server-serialization.md) 插件，用于协商请求的媒体类型并将内容反序列化为所需类型的对象。要接收并转换请求的内容，请调用 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函数，该函数接受数据类作为参数：
```kotlin

        post("/customer") {
            val customer = call.receive<Customer>()
            customerStorage.add(customer)
            call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
```

您可以从 [Ktor Server 中的内容协商和序列化](server-serialization.md)了解更多信息。

### 表单参数 {id="form_parameters"}
Ktor 允许您使用 [receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函数接收随 `x-www-form-urlencoded` 和 `multipart/form-data` 类型发送的表单参数。以下示例展示了一个 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 请求，表单参数通过正文传递：
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

您可以在代码中按如下方式获取参数值：
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

您可以在此处找到完整示例：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表单数据 {id="form_data"}

要接收作为多部分请求一部分发送的文件，请调用
[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)
函数，然后根据需要遍历每个部分。

多部分请求数据是按顺序处理的，因此您无法直接访问它的特定部分。此外，
这些请求可以包含不同类型的部分，例如表单字段、文件或二进制数据，需要以
不同方式处理。

以下示例演示了如何接收文件并将其保存到文件系统：

```kotlin
import io.ktor.server.application.*
import io.ktor.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import java.io.File

fun Application.main() {
    routing {
        post("/upload") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val file = File("uploads/$fileName")
                        part.provider().copyAndClose(file.writeChannel())
                    }

                    else -> {}
                }
                part.dispose()
            }

            call.respondText("$fileDescription is uploaded to 'uploads/$fileName'")
        }
    }
}
```

#### 默认文件大小限制

默认情况下，可接收的二进制和文件项的大小限制为 50MB。如果接收到的文件
或二进制项超过 50MB 限制，将抛出 `IOException`。

要覆盖默认表单字段限制，请在调用 `.receiveMultipart()` 时传递 `formFieldLimit` 参数：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

在此示例中，新限制设置为 100MB。

#### 表单字段

`PartData.FormItem` 表示一个表单字段，其值可以通过 `value` 属性访问：

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### 文件上传

`PartData.FileItem` 表示一个文件项。您可以将其作为字节流处理文件上传：

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函数返回一个 `ByteReadChannel`，它允许您增量读取数据。
使用 `.copyAndClose()` 函数，然后将文件内容写入指定目标，
同时确保正确清理资源。

要确定上传文件的大小，您可以在 `post` 处理器内获取 `Content-Length` [请求头值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 资源清理

表单处理完成后，每个部分都使用 `.dispose()` 函数进行处置以释放资源。

```kotlin
part.dispose()
```

要了解如何运行此示例，请参阅
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。