[//]: # (title: 处理请求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由处理程序内部处理传入的请求。</link-summary>

Ktor 允许您在[路由处理程序](server-routing.md#define_route)内部处理传入的请求并发送[响应](server-responses.md)。在处理请求时，您可以执行各种操作：

* 获取[请求信息](#request_information)，例如标头、Cookie 等。
* 获取[路径形参](#path_parameters)的值。
* 获取[查询字符串](#query_parameters)的形参。
* 接收[正文内容](#body_contents)，例如数据对象、表单形参和文件。

## 通用请求信息 {id="request_information"}
在路由处理程序内部，您可以使用 [`call.request`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call/request.html) 属性访问请求。这将返回 [`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 实例，并提供对各种请求形参的访问。例如，下面的代码段显示了如何获取请求 URI：

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
[`call.respondText()`](server-responses.md#plain-text) 方法用于将响应发送回客户端。

[`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 对象允许您访问各种请求数据，例如：

* **标头**

  要访问所有请求标头，请使用 [`ApplicationRequest.headers`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 属性。您还可以使用专用的扩展函数访问特定标头，例如 `acceptEncoding`、`contentType`、`cacheControl` 等。

* **Cookie**  

  [`ApplicationRequest.cookies`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 属性提供了对请求相关 Cookie 的访问。要了解如何使用 Cookie 处理会话，请参阅[会话](server-sessions.md)部分。

* **连接详情**

  使用 [`ApplicationRequest.local`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/local.html) 属性可以访问连接详情，例如主机名、端口、方案等。

* **`X-Forwarded-` 标头**

  要获取通过 HTTP 代理或负载均衡器传递的请求信息，请安装 [Forwarded headers](server-forward-headers.md) 插件并使用 [`ApplicationRequest.origin`](https://api.ktor.io/ktor-server-core/io.ktor.server.plugins/origin.html) 属性。

## 路径形参 {id="path_parameters"}
处理请求时，您可以使用 `call.parameters` 属性访问[路径形参](server-routing.md#path_parameter)的值。例如，在下面的代码段中，对于 `/user/admin` 路径，`call.parameters["login"]` 将返回 _admin_：

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## 查询形参 {id="query_parameters"}

要访问 <emphasis tooltip="query_string">查询字符串</emphasis> 的形参，可以使用 [`ApplicationRequest.queryParameters()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 属性。例如，如果向 `/products?price=asc` 发起请求，您可以通过以下方式访问 `price` 查询形参：

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // 按价格从低到高显示产品
    }
}
```

您还可以使用 [`ApplicationRequest.queryString()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/query-string.html) 函数获取整个查询字符串。

## 正文内容 {id="body_contents"}
本节介绍如何接收通过 `POST`、`PUT` 或 `PATCH` 发送的正文内容。

### 原始载荷 {id="raw"}

要访问原始正文载荷并手动进行解析，请使用 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 函数，该函数接受要接收的载荷类型。假设您有以下 HTTP 请求：

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

您可以通过以下方式之一将此请求的正文作为指定类型的对象接收：

- **String**

   要将请求正文作为 String 值接收，请使用 `call.receive<String>()`。您也可以使用 [`.receiveText()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-text.html) 来实现相同的结果：
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **ByteArray**

   要将请求正文作为字节数组接收，请调用 `call.receive<ByteArray>()`：
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   您可以使用 `call.receive<ByteReadChannel>()` 或 [`.receiveChannel()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-channel.html) 来接收 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它支持异步读取字节序列：
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readString()
       call.respondText(text)
   }
   ```

   下面的示例展示了如何使用 `ByteReadChannel` 上传文件：
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

> 有关在 Ktor 通道与 `RawSink`、`RawSource` 或 `OutputStream` 等类型之间进行转换的信息，请参阅 [I/O 互操作性](io-interoperability.md)。
>
{style="tip"}

> 有关完整示例，请参阅 [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 对象 {id="objects"}

Ktor 提供了 [ContentNegotiation](server-serialization.md) 插件来协商请求的媒体类型并将内容反序列化为所需类型的对象。

要为请求接收并转换内容，请调用 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 函数，该函数接受一个数据类作为参数：

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 更多信息请参阅 [Ktor Server 中的内容协商与序列化](server-serialization.md)。

### 表单形参 {id="form_parameters"}
Ktor 允许您使用 [receiveParameters](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函数接收通过 `x-www-form-urlencoded` 和 `multipart/form-data` 类型发送的表单形参。下面的示例展示了一个 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 请求，其中表单形参在正文中传递：
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

您可以按如下方式在代码中获取形参值：
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 有关完整示例，请参阅 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表单数据 {id="form_data"}

要接收作为多部分请求的一部分发送的文件，请调用 [`.receiveMultipart()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-multipart.html) 函数，然后根据需要循环处理每个部分。

多部分请求数据是按顺序处理的，因此您无法直接访问其特定部分。此外，这些请求可能包含不同类型的部分，例如表单字段、文件或二进制数据，需要以不同方式进行处理。

该示例演示了如何接收文件并将其保存到文件系统：

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

默认情况下，可以接收的二进制项和文件项的允许大小限制为 50 MB。如果接收到的文件或二进制项超过 50 MB 限制，则会抛出 `IOException`。

要替代默认的表单字段限制，请在调用 `.receiveMultipart()` 时传递 `formFieldLimit` 形参：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

在此示例中，新限制设置为 100 MB。

#### 表单字段

`PartData.FormItem` 代表表单字段，其值可以通过 `value` 属性访问：

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### 文件上传

`PartData.FileItem` 代表文件项。您可以将文件上传作为字节流进行处理：

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 函数返回一个 `ByteReadChannel`，允许您增量读取数据。使用 `.copyAndClose()` 函数，您可以将文件内容写入指定目的地，同时确保正确的资源清理。

要确定上传的文件大小，您可以在 `post` 处理程序内部获取 `Content-Length` [标头值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 资源清理

一旦表单处理完成，每个部分都会使用 `.dispose()` 函数进行处置以释放资源。

```kotlin
part.dispose()
```

> 要了解如何运行此示例，请参阅 [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。