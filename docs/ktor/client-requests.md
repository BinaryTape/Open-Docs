[//]: # (title: 发出请求)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何发出请求并指定各种请求参数：请求 URL、HTTP 方法、请求头和请求体。
</link-summary>

[设置客户端](client-create-and-configure.md) 后，您就可以发出 HTTP 请求。发出 HTTP 请求的主要方式是 [`request`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html) 函数，该函数可以接受 URL 作为参数。在此函数中，您可以配置各种请求参数：
* 指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
* 将 URL 指定为字符串，或单独配置 URL 组件（域、路径、查询参数等）。
* 添加请求头 (headers) 和 Cookie。
* 设置请求体，例如纯文本、数据对象或表单参数。

这些参数由 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 类公开。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by [[[HttpRequestBuilder|https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html]]]
}
```
{interpolate-variables="true" disable-links="false"}

请注意，此函数允许您以 `HttpResponse` 对象的形式接收响应。`HttpResponse` 公开了以各种方式（字符串、JSON 对象等）获取响应体以及获取响应参数（例如状态码、内容类型、请求头等）所需的 API。您可以从 [](client-responses.md) 主题了解更多信息。

> `request` 是一个挂起函数，因此请求只能从协程 (coroutine) 或另一个挂起函数中执行。您可以从 [协程基础](https://kotlinlang.org/docs/coroutines-basics.html) 了解更多关于调用挂起函数的信息。

### 指定 HTTP 方法 {id="http-method"}

调用 `request` 函数时，可以使用 `method` 属性指定所需的 HTTP 方法：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

除了 `request` 函数，`HttpClient` 还提供了针对基本 HTTP 方法的特定函数：[`get`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)、[`post`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html)、[`put`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html) 等。例如，您可以将上述请求替换为以下代码：
```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

在这两个示例中，请求 URL 都被指定为字符串。您也可以使用 [`HttpRequestBuilder`](#url) 单独配置 URL 组件。

## 指定请求 URL {id="url"}

Ktor 客户端允许您通过以下方式配置请求 URL：

- _传入整个 URL 字符串_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}
   
- _单独配置 URL 组件_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="22-28"}
   
   在这种情况下，使用 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 公开的 `url` 参数。此参数接受 [`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 并提供更大的 URL 构建灵活性。

> 要为所有请求配置基本 URL，可以使用 [`DefaultRequest`](client-default-request.md#url) 插件。

### 路径段 {id="path_segments"}

在前面的示例中，我们使用 `URLBuilder.path` 属性指定了整个 URL 路径。您也可以使用 `appendPathSegments` 函数传入单个路径段。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

请注意，`appendPathSegments` 会对路径段进行 [百分比编码][percent_encoding]。要禁用编码，请使用 `appendEncodedPathSegments`。

### 查询参数 {id="query_parameters"}
要添加 <emphasis tooltip="query_string">查询字符串</emphasis> 参数，请使用 `URLBuilder.parameters` 属性：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="34-38"}

请注意，`parameters` 会对查询参数进行 [百分比编码][percent_encoding]。要禁用编码，请使用 `encodedParameters`。

> `trailingQuery` 属性可用于在没有查询参数的情况下也保留 `?` 字符。

### URL 片段 {id="url-fragment"}

哈希标记 `#` 在 URL 末尾引入可选片段。您可以使用 `fragment` 属性配置 URL 片段。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

请注意，`fragment` 会对 URL 片段进行 [百分比编码][percent_encoding]。要禁用编码，请使用 `encodedFragment`。

## 设置请求参数 {id="parameters"}
在本节中，我们将介绍如何指定各种请求参数，包括 HTTP 方法、请求头和 Cookie。如果您需要为特定客户端的所有请求配置一些默认参数，请使用 [`DefaultRequest`](client-default-request.md) 插件。

### 请求头 {id="headers"}

要将请求头添加到请求中，可以使用以下方式：
- [`headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html) 函数允许您一次添加多个请求头：
   ```kotlin
   ```
  {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}
- [`header`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html) 函数允许您追加单个请求头。
- `basicAuth` 和 `bearerAuth` 函数会添加带有相应 HTTP 方案的 `Authorization` 请求头。
   > 有关高级身份验证配置，请参阅 [](client-auth.md)。

### Cookie {id="cookies"}
要发送 Cookie，请使用 [`cookie`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html) 函数：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="55-64"}

Ktor 还提供了 [`HttpCookies`](client-cookies.md) 插件，允许您在调用之间保留 Cookie。如果安装了此插件，则使用 `cookie` 函数添加的 Cookie 将被忽略。

## 设置请求体 {id="body"}
要设置请求体，您需要调用 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 公开的 `setBody` 函数。此函数接受不同类型的负载 (payloads)，包括纯文本、任意类实例、表单数据、字节数组等。下面，我们将看几个示例。

### 文本 {id="text"}
发送纯文本作为请求体可以通过以下方式实现：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 对象 {id="objects"}
启用 [`ContentNegotiation`](client-serialization.md) 插件后，您可以将类实例作为 JSON 发送到请求体中。为此，请将类实例传递给 `setBody` 函数，并使用 [`contentType`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 函数将内容类型设置为 `application/json`：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

您可以从 [](client-serialization.md) 帮助部分了解更多信息。

### 表单参数 {id="form_parameters"}

Ktor 客户端提供了 [`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 函数，用于发送 `application/x-www-form-urlencoded` 类型的表单参数。以下示例演示了其用法：

* `url` 指定用于发出请求的 URL。
* `formParameters` 是使用 `parameters` 构建的一组表单参数。

```kotlin
```
{src="snippets/client-submit-form/src/main/kotlin/com/example/Application.kt" include-lines="16-25"}

您可以在此处找到完整示例：[client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 要发送在 URL 中编码的表单参数，请将 `encodeInQuery` 设置为 `true`。

### 上传文件 {id="upload_file"}

如果您需要通过表单发送文件，可以使用以下方法：

- 使用 [`submitFormWithBinaryData`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 函数。在这种情况下，将自动生成一个边界 (boundary)。
- 调用 `post` 函数并将 [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html) 实例传递给 `setBody` 函数。请注意，`MultiPartFormDataContent` 构造函数也允许您传递一个边界值。

对于这两种方法，您都需要使用 [`formData`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html) 函数构建表单数据。

<tabs>

<tab title="submitFormWithBinaryData">

```kotlin
```
{src="snippets/client-upload/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

</tab>

<tab title="MultiPartFormDataContent">

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="16-33"}

</tab>

</tabs>

`MultiPartFormDataContent` 也允许您按如下方式覆盖边界和内容类型：

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

您可以在此处找到完整示例：
- [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)
- [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)

### 二进制数据 {id="binary"}

要发送 `application/octet-stream` 内容类型的二进制数据，请将 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 实例传递给 `setBody` 函数。例如，您可以使用 [`File.readChannel`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 函数为文件打开一个读取通道并填充它：

```kotlin
```
{src="snippets/client-upload-binary-data/src/main/kotlin/com/example/Application.kt" include-lines="14-16"}

您可以在此处找到完整示例：[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 并行请求 {id="parallel_requests"}

当同时发送两个请求时，客户端会暂停第二个请求的执行，直到第一个请求完成。如果您需要同时执行多个请求，可以使用 [`launch`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 或 [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数。以下代码片段展示了如何异步执行两个请求：
```kotlin
```
{src="snippets/client-parallel-requests/src/main/kotlin/com/example/Application.kt" include-lines="12,19-23,28"}

要查看完整示例，请访问 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消请求 {id="cancel-request"}

如果您需要取消请求，可以取消运行该请求的协程 (coroutine)。[`launch`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 函数返回一个 `Job`，可用于取消正在运行的协程：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

从 [取消与超时](https://kotlinlang.org/docs/cancellation-and-timeouts.html) 了解更多信息。