[//]: # (title: 处理请求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由处理器中处理传入请求。</link-summary>

Ktor 允许你在 [路由处理器](server-routing.md#define_route) 中处理传入请求并发送 [响应](server-responses.md)。在处理请求时，你可以执行各种操作：
* 获取 [请求信息](#request_information)，例如请求头、Cookie 等。
* 获取 [路径参数](#path_parameters) 值。
* 获取 [查询字符串](#query_parameters) 的参数。
* 接收 [请求体内容](#body_contents)，例如数据对象、表单参数和文件。

## 通用请求信息 {id="request_information"}
在路由处理器内部，你可以使用 [call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html) 属性来访问请求。该属性返回 [ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 实例，并提供对各种请求参数的访问。例如，下面的代码片段展示了如何获取请求 URI：
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text) 方法用于向客户端发送响应。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 对象允许你访问各种请求数据，例如：
* 请求头 (Headers)  
  要访问所有请求头，请使用 [ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 属性。你还可以使用专用的扩展函数来访问特定的请求头，例如 `acceptEncoding`、`contentType`、`cacheControl` 等。
* Cookie  
  [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 属性提供对请求相关 Cookie 的访问。要了解如何使用 Cookie 处理会话，请参阅 [会话](server-sessions.md) 部分。
* 连接详情  
  使用 [ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 属性来访问连接详情，例如主机名、端口、方案等。
* `X-Forwarded-` 请求头  
  要获取通过 HTTP 代理或负载均衡器传递的请求信息，请安装 [](server-forward-headers.md) 插件并使用 [ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 属性。

## 路径参数 {id="path_parameters"}
在处理请求时，你可以使用 `call.parameters` 属性来访问 [路径参数](server-routing.md#path_parameter) 值。例如，在下面的代码片段中，对于 `/user/admin` 路径，`call.parameters["login"]` 将返回 _admin_：
```kotlin
```
{src="snippets/_misc/RouteParameter.kt"}

## 查询参数 {id="query_parameters"}

要访问 <emphasis tooltip="query_string">查询字符串</emphasis> 的参数，你可以使用 [ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-parameters.html) 属性。例如，如果向 `/products?price=asc` 发出请求，你可以通过以下方式访问 `price` 查询参数：

```kotlin
```
{src="snippets/_misc/QueryParameter.kt"}

你还可以使用 [ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html) 函数获取整个查询字符串。

## 请求体内容 {id="body_contents"}
本节展示如何接收通过 `POST`、`PUT` 或 `PATCH` 发送的请求体内容。

### 原始负载 {id="raw"}

要访问原始请求体负载并手动解析它，请使用 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函数，该函数接受要接收的负载类型。
假设你有一个以下 HTTP 请求：

```HTTP
```
{src="snippets/post-raw-data/post.http" include-lines="1-4"}

你可以通过以下任一方式将此请求的请求体作为指定类型的对象接收：

- **String**

   要将请求体作为 String 值接收，请使用 `call.receive<String>()`。
   你也可以使用 [receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html) 来实现相同的效果：
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="13-16"}
- **ByteArray**

   要将请求体作为字节数组接收，请调用 `call.receive<ByteArray>()`：
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="18-22"}
- **ByteReadChannel**

   你可以使用 `call.receive<ByteReadChannel>()` 或 [receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html) 来接收 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它支持字节序列的异步读取：
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="23-27"}

   下面的示例展示了如何使用 `ByteReadChannel` 上传文件：
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

你可以在这里找到完整示例：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 对象 {id="objects"}
Ktor 提供了一个 [ContentNegotiation](server-serialization.md) 插件，用于协商请求的媒体类型并将内容反序列化为所需类型的对象。要接收和转换请求的内容，请调用接受数据类作为参数的 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函数：
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="38-42"}

你可以从 [](server-serialization.md) 了解更多信息。

### 表单参数 {id="form_parameters"}
Ktor 允许你使用 [receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函数接收 `x-www-form-urlencoded` 和 `multipart/form-data` 类型发送的表单参数。下面的示例展示了一个通过请求体传递表单参数的 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 请求：
```HTTP
```
{src="snippets/post-form-parameters/post.http"}

你可以在代码中按如下方式获取参数值：
```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="12-16"}

你可以在这里找到完整示例：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表单数据 {id="form_data"}

要接收作为多部分请求一部分发送的文件，请调用
[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)
函数，然后根据需要遍历每个部分。

多部分请求数据是按顺序处理的，因此你无法直接访问其特定部分。此外，
这些请求可以包含不同类型的部分，例如表单字段、文件或二进制数据，需要以不同方式处理。

该示例演示了如何接收文件并将其保存到文件系统：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="3-39"}

#### 默认文件大小限制

默认情况下，可接收的二进制和文件项的允许大小限制为 50MB。如果接收到的文件
或二进制项超出 50MB 限制，则会抛出 `IOException`。

要覆盖默认的表单字段限制，请在调用 `.receiveMultipart()` 时传入 `formFieldLimit` 参数：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="17"}

在此示例中，新限制设置为 100MB。

#### 表单字段

`PartData.FormItem` 代表一个表单字段，其值可以通过 `value` 属性访问：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20-23,32"}

#### 文件上传

`PartData.FileItem` 代表一个文件项。你可以将文件上传作为字节流处理：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20,25-29,32"}

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函数返回一个 `ByteReadChannel`，它允许你增量读取数据。
然后，使用 `.copyAndClose()` 函数将文件内容写入指定目标，
同时确保正确清理资源。

要确定上传的文件大小，你可以在 `post` 处理器内部获取 `Content-Length` [请求头值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 资源清理

表单处理完成后，每个部分都会使用 `.dispose()` 函数进行释放，以释放资源。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="33"}

要了解如何运行此示例，请参阅
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。