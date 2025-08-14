[//]: # (title: 发出请求)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
学习如何发出请求并指定各种请求参数：请求 URL、HTTP 方法、请求头和请求体。
</link-summary>

[配置客户端](client-create-and-configure.md) 后，即可开始发出 HTTP 请求。主要方式是使用接受 URL 作为形参的 [`.request()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html) 函数。在该函数内部，你可以配置各种请求参数：

*   指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
*   将 URL 配置为字符串，或单独配置其组件（例如域、路径和查询形参）。
*   使用 Unix 域套接字。
*   添加请求头和 cookie。
*   包含请求体——例如，纯文本、数据对象或表单形参。

这些形参由 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 类公开。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 函数将响应作为 `HttpResponse` 对象返回。`HttpResponse` 公开获取各种格式（例如字符串、JSON 对象等）响应体所需的 API，以及检索状态码、内容类型和请求头等响应形参。关于更多信息，请参见 [](client-responses.md)。

> `.request()` 是一个挂起函数，这意味着它必须从协程或其他挂起函数内部调用。关于挂起函数，请参阅 [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)。

### 指定 HTTP 方法 {id="http-method"}

调用 `.request()` 函数时，可以使用 `method` 属性指定所需的 HTTP 方法：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

除了 `.request()` 之外，`HttpClient` 还为基本的 HTTP 方法提供了特定函数，例如 [`.get()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)、[`.post()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html) 和 [`.put()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html)。上述示例可以使用 `.get()` 函数进行简化：

[object Promise]

在这两个示例中，请求 URL 都指定为字符串。你也可以使用 [`HttpRequestBuilder`](#url) 单独配置 URL 组件。

## 指定请求 URL {id="url"}

Ktor 客户端允许你通过多种方式配置请求 URL：

### 传递整个 URL 字符串

[object Promise]

### 单独配置 URL 组件

[object Promise]

在这种情况下，使用了 `HttpRequestBuilder` 提供的 `url` 形参。它接受 [`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 的实例，为构建复杂 URL 提供了更大的灵活性。

> 要为所有请求配置基本 URL，请使用 [`DefaultRequest`](client-default-request.md#url) 插件。

### 路径分段 {id="path_segments"}

在前面的示例中，整个 URL 路径是使用 `URLBuilder.path` 属性指定的。或者，你可以使用 `appendPathSegments()` 函数传递单个路径分段。

[object Promise]

默认情况下，`appendPathSegments` 会对路径分段进行 [编码][percent_encoding]。要禁用编码，请改用 `appendEncodedPathSegments()`。

### 查询形参 {id="query_parameters"}

要添加 <emphasis tooltip="query_string">查询字符串</emphasis> 形参，请使用 `URLBuilder.parameters` 属性：

[object Promise]

默认情况下，`parameters` 会对查询形参进行 [编码][percent_encoding]。要禁用编码，请改用 `encodedParameters()`。

> `trailingQuery` 属性可用于保留 `?` 字符，即使没有查询形参。

### URL 片段 {id="url-fragment"}

井号 `#` 在 URL 末尾引入可选的片段。你可以使用 `fragment` 属性配置 URL 片段。

[object Promise]

默认情况下，`fragment` 会对 URL 片段进行 [编码][percent_encoding]。要禁用编码，请改用 `encodedFragment()`。

## 指定 Unix 域套接字

> Unix 域套接字仅在 CIO 引擎中支持。要在 Ktor 服务器中使用 Unix 套接字，请相应地 [配置服务器](server-configuration-code.topic#cio-code)。
> {style="note"}

要向监听 Unix 域套接字的服务器发送请求，在使用 CIO 客户端时调用 `unixSocket()` 函数：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

你也可以将 Unix 域套接字配置为 [默认请求](client-default-request.md#unix-domain-sockets) 的一部分。

## 设置请求形参 {id="parameters"}

你可以指定各种请求形参，包括 HTTP 方法、请求头和 cookie。如果需要为特定客户端的所有请求配置默认形参，请使用 [`DefaultRequest`](client-default-request.md) 插件。

### 请求头 {id="headers"}

你可以通过几种方式向请求添加请求头：

#### 添加多个请求头

[`headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html) 函数允许你一次添加多个请求头：

[object Promise]

#### 添加单个请求头

[`header`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html) 函数允许你追加单个请求头。

#### 使用 `basicAuth` 或 `bearerAuth` 进行授权

`basicAuth` 和 `bearerAuth` 函数会添加 `Authorization` 请求头以及相应的 HTTP 方案。

> 关于高级身份验证配置，请参见 [](client-auth.md)。

### Cookie {id="cookies"}

要发送 cookie，请使用 [`cookie()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html) 函数：

[object Promise]

Ktor 还提供了 [`HttpCookies`](client-cookies.md) 插件，允许你在调用之间保留 cookie。如果安装了此插件，使用 `cookie()` 函数添加的 cookie 将被忽略。

## 设置请求体 {id="body"}

要设置请求体，请调用由 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 提供的 `setBody()` 函数。此函数接受不同类型的负载，包括纯文本、任意类实例、表单数据和字节数组。

### 文本 {id="text"}

以纯文本作为请求体发送可以通过以下方式实现：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 对象 {id="objects"}

启用 [`ContentNegotiation`](client-serialization.md) 插件后，你可以在请求体中以 JSON 形式发送类实例。为此，将类实例传递给 `setBody()` 函数，并使用 [`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 函数将内容类型设置为 `application/json`：

[object Promise]

关于更多信息，请参见 [](client-serialization.md)。

### 表单形参 {id="form_parameters"}

Ktor 客户端提供了用于发送 `application/x-www-form-urlencoded` 类型表单形参的 [`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 函数。以下示例演示其用法：

[object Promise]

*   `url` 指定发出请求的 URL。
*   `formParameters` 是使用 `parameters` 构建的表单形参集。

关于完整示例，请参见 [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 要发送编码在 URL 中的表单形参，请将 `encodeInQuery` 设置为 `true`。

### 上传文件 {id="upload_file"}

如果需要通过表单发送文件，可以使用以下方法：

*   使用 [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 函数。在这种情况下，将自动生成边界。
*   调用 `post` 函数并将 [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html) 实例传递给 `setBody` 函数。`MultiPartFormDataContent` 构造函数也允许你传递边界值。

对于这两种方法，你需要使用 [`formData {}`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html) 函数构建表单数据。

#### 使用 `.submitFormWithBinaryData()`

`.submitFormWithBinaryData()` 函数自动生成边界，适用于文件内容足够小，可以使用 `.readBytes()` 安全地读入内存的简单用例。

[object Promise]

关于完整示例，请参见 [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)。

#### 使用 `MultiPartFormDataContent`

为了高效地流式传输大文件或动态内容，你可以将 `MultiPartFormDataContent` 与 `InputProvider` 一起使用。`InputProvider` 允许你以缓冲流的形式提供文件数据，而不是将其完全加载到内存中，使其非常适合大文件。使用 `MultiPartFormDataContent`，你还可以使用 `onUpload` 回调监控上传进度。

[object Promise]

在多平台项目中，你可以将 `SystemFileSystem.source()` 与 `InputProvider` 一起使用：

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

你还可以手动构造带有自定义边界和内容类型的 `MultiPartFormDataContent`：

[object Promise]

关于完整示例，请参见 [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)。

### 二进制数据 {id="binary"}

要发送带有 `application/octet-stream` 内容类型的二进制数据，请将 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 实例传递给 `setBody()` 函数。例如，你可以使用 [`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 函数打开文件的读取通道：

[object Promise]

关于完整示例，请参见 [client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 并行请求 {id="parallel_requests"}

默认情况下，当你按顺序发送多个请求时，客户端会挂起每个调用，直到上一个调用完成。要并行执行多个请求，请使用 [`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 或 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数。以下示例演示了如何使用 `async()` 并行执行两个请求：

[object Promise]

关于完整示例，请参见 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消请求 {id="cancel-request"}

要取消请求，请取消运行该请求的协程。[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 函数返回一个 `Job`，可用于取消正在运行的协程：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

关于更多详情，请参见 [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html)。