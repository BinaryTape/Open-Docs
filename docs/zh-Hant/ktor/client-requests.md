[//]: # (title: 發出請求)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭和請求主體。
</link-summary>

在[配置客戶端](client-create-and-configure.md)後，您就可以開始發送 HTTP 請求。執行此操作的主要方式是使用接受 URL 作為參數的 [`.request()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/request.html) 函數。在這個函數中，您可以配置各種請求參數：

*   指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
*   將 URL 配置為字串，或單獨配置其組件（例如網域、路徑和查詢參數）。
*   使用 Unix 網域通訊端。
*   新增標頭和 Cookie。
*   包含請求主體 – 例如，純文字、資料物件或表單參數。

這些參數由 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 類別公開。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 函數以 `HttpResponse` 物件形式返回回應。`HttpResponse` 公開了以各種格式（例如字串、JSON 物件等）獲取回應主體以及檢索回應參數（例如狀態碼、內容類型和標頭）所需的 API。有關更多資訊，請參閱[接收回應](client-responses.md)。

> `.request()` 是一個暫停函式，這表示它必須從協程或另一個暫停函式中呼叫。要了解有關暫停函式的更多資訊，請參閱[協程基礎](https://kotlinlang.org/docs/coroutines-basics.html)。

### 指定 HTTP 方法 {id="http-method"}

呼叫 `.request()` 函數時，您可以使用 `method` 屬性指定所需的 HTTP 方法：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

除了 `.request()` 之外，`HttpClient` 還提供了用於基本 HTTP 方法的特定函數，例如 [`.get()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/get.html)、[`.post()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/post.html) 和 [`.put()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/put.html)。上面的範例可以使用 `.get()` 函數簡化：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

在這兩個範例中，請求 URL 都指定為字串。您還可以使用 [`HttpRequestBuilder`](#url) 單獨配置 URL 組件。

## 指定請求 URL {id="url"}

Ktor 客戶端允許您以多種方式配置請求 URL：

### 傳遞整個 URL 字串

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

### 單獨配置 URL 組件

```kotlin
client.get {
    url {
        protocol = URLProtocol.HTTPS
        host = "ktor.io"
        path("docs/welcome.html")
    }
}
```

在這種情況下，使用 `HttpRequestBuilder` 提供的 `url` 參數。它接受 [`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 的實例，為建構複雜 URL 提供了更大的彈性。

> 若要為所有請求配置基礎 URL，請使用 [`DefaultRequest`](client-default-request.md#url) 插件。

### 路徑段 {id="path_segments"}

在前面的範例中，整個 URL 路徑是使用 `URLBuilder.path` 屬性指定的。或者，您可以使用 `appendPathSegments()` 函數傳遞單個路徑段。

```kotlin
client.get("https://ktor.io") {
    url {
        appendPathSegments("docs", "welcome.html")
    }
}
```

預設情況下，`appendPathSegments` 會[編碼][percent_encoding]路徑段。若要禁用編碼，請改用 `appendEncodedPathSegments()`。

### 查詢參數 {id="query_parameters"}

若要新增 <emphasis tooltip="查詢字串">查詢字串</emphasis> 參數，請使用 `URLBuilder.parameters` 屬性：

```kotlin
client.get("https://ktor.io") {
    url {
        parameters.append("token", "abc123")
    }
}
```

預設情況下，`parameters` 會[編碼][percent_encoding]查詢參數。若要禁用編碼，請改用 `encodedParameters()`。

> 即使沒有查詢參數，`trailingQuery` 屬性也可用於保留 `?` 字元。

### URL 片段 {id="url-fragment"}

雜湊符號 `#` 在 URL 結尾附近引入可選的片段。您可以使用 `fragment` 屬性配置 URL 片段。

```kotlin
client.get("https://ktor.io") {
    url {
        fragment = "some_anchor"
    }
}
```

預設情況下，`fragment` 會[編碼][percent_encoding] URL 片段。若要禁用編碼，請改用 `encodedFragment()`。

## 指定 Unix 網域通訊端

> Unix 網域通訊端僅在 CIO 引擎中受支持。若要將 Unix 通訊端與 Ktor 伺服器一起使用，請相應地[配置伺服器](server-configuration-code.topic#cio-code)。
>
{style="note"}

若要向監聽 Unix 網域通訊端的伺服器發送請求，請在使用 CIO 客戶端時呼叫 `unixSocket()` 函數：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您還可以將 Unix 網域通訊端配置為[預設請求](client-default-request.md#unix-domain-sockets)的一部分。

## 設定請求參數 {id="parameters"}

您可以指定各種請求參數，包括 HTTP 方法、標頭和 Cookie。如果您需要為特定客戶端的所有請求配置預設參數，請使用 [`DefaultRequest`](client-default-request.md) 插件。

### 標頭 {id="headers"}

您可以透過幾種方式將標頭新增至請求中：

#### 新增多個標頭

[`headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/headers.html) 函數允許您一次新增多個標頭：

```kotlin
client.get("https://ktor.io") {
    headers {
        append(HttpHeaders.Accept, "text/html")
        append(HttpHeaders.Authorization, "abc123")
        append(HttpHeaders.UserAgent, "ktor client")
    }
}
```

#### 新增單個標頭

[`header`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/header.html) 函數允許您附加單個標頭。

#### 使用 `basicAuth` 或 `bearerAuth` 進行授權

`basicAuth` 和 `bearerAuth` 函數會新增帶有相應 HTTP 方案的 `Authorization` 標頭。

> 如需進階身份驗證配置，請參閱[Ktor 客戶端中的身份驗證和授權](client-auth.md)。

### Cookie {id="cookies"}

若要發送 Cookie，請使用 [`cookie()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/cookie.html) 函數：

```kotlin
client.get("https://ktor.io") {
    cookie(name = "user_name", value = "jetbrains", expires = GMTDate(
        seconds = 0,
        minutes = 0,
        hours = 10,
        dayOfMonth = 1,
        month = Month.APRIL,
        year = 2023
    ))
}
```

Ktor 還提供了 [`HttpCookies`](client-cookies.md) 插件，它允許您在呼叫之間保留 Cookie。如果安裝了此插件，則會忽略使用 `cookie()` 函數新增的 Cookie。

## 設定請求主體 {id="body"}

若要設定請求主體，請呼叫 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 提供的 `setBody()` 函數。此函數接受不同類型的負載，包括純文字、任意類別實例、表單資料和位元組陣列。

### 文字 {id="text"}

可以透過以下方式實作將純文字作為主體發送：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 物件 {id="objects"}

啟用 [`ContentNegotiation`](client-serialization.md) 插件後，您可以將類別實例作為 JSON 在請求主體中發送。為此，請將類別實例傳遞給 `setBody()` 函數，並使用 [`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 函數將內容類型設定為 `application/json`：

```kotlin
val response: HttpResponse = client.post("http://localhost:8080/customer") {
    contentType(ContentType.Application.Json)
    setBody(Customer(3, "Jet", "Brains"))
}
```

有關更多資訊，請參閱[Ktor 客戶端中的內容協商和序列化](client-serialization.md)。

### 表單參數 {id="form_parameters"}

Ktor 客戶端提供了 [`submitForm()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 函數，用於發送 `application/x-www-form-urlencoded` 類型的表單參數。以下範例演示了其用法：

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.submitForm(
    url = "http://localhost:8080/signup",
    formParameters = parameters {
        append("username", "JetBrains")
        append("email", "example@jetbrains.com")
        append("password", "foobar")
        append("confirmation", "foobar")
    }
)
```

*   `url` 指定用於發出請求的 URL。
*   `formParameters` 是使用 `parameters` 建構的一組表單參數。

如需完整範例，請參閱 [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 若要發送編碼在 URL 中的表單參數，請將 `encodeInQuery` 設定為 `true`。

### 上傳檔案 {id="upload_file"}

如果您需要透過表單發送檔案，可以使用以下方法：

*   使用 [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 函數。在這種情況下，將自動生成一個 boundary。
*   呼叫 `post` 函數，並將 [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html) 實例傳遞給 `setBody` 函數。`MultiPartFormDataContent` 構造函數也允許您傳遞 boundary 值。

對於這兩種方法，您都需要使用 [`formData {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/form-data.html) 函數建構表單資料。

#### 使用 `.submitFormWithBinaryData()`

`.submitFormWithBinaryData()` 函數會自動生成一個 boundary，適用於檔案內容小到足以使用 `.readBytes()` 安全讀取到記憶體中的簡單使用案例。

```kotlin
        val client = HttpClient(CIO)

        val response: HttpResponse = client.submitFormWithBinaryData(
            url = "http://localhost:8080/upload",
            formData = formData {
                append("description", "Ktor logo")
                append("image", File("ktor_logo.png").readBytes(), Headers.build {
                    append(HttpHeaders.ContentType, "image/png")
                    append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                })
            }
        )
```

如需完整範例，請參閱 [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)。

#### 使用 `MultiPartFormDataContent`

為了有效率地串流大型或動態內容，您可以將 `MultiPartFormDataContent` 與 `InputProvider` 一起使用。`InputProvider` 允許您將檔案資料作為緩衝串流提供，而不是將其完全載入到記憶體中，這使其非常適合大型檔案。使用 `MultiPartFormDataContent`，您還可以使用 `onUpload` 回呼監控上傳進度。

```kotlin
        val client = HttpClient(CIO)

        val file = File("ktor_logo.png")

        val response: HttpResponse = client.post("http://localhost:8080/upload") {
            setBody(
                MultiPartFormDataContent(
                    formData {
                        append("description", "Ktor logo")
                        append(
                            "image",
                            InputProvider { file.inputStream().asInput().buffered() },
                            Headers.build {
                                append(HttpHeaders.ContentType, "image/png")
                                append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                            }
                        )
                    },
                    boundary = "WebAppBoundary"
                )
            )
            onUpload { bytesSentTotal, contentLength ->
                println("已發送 $bytesSentTotal 位元組，共 $contentLength 位元組")
            }
        }
```

在多平台專案中，您可以將 `SystemFileSystem.source()` 與 `InputProvider` 一起使用：

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

您還可以手動建構具有自訂 boundary 和內容類型的 `MultiPartFormDataContent`：

```kotlin
fun customMultiPartMixedDataContent(parts: List<PartData>): MultiPartFormDataContent {
    val boundary = "WebAppBoundary"
    val contentType = ContentType.MultiPart.Mixed.withParameter("boundary", boundary)
    return MultiPartFormDataContent(parts, boundary, contentType)
}
```

如需完整範例，請參閱 [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)。

### 二進位資料 {id="binary"}

若要發送帶有 `application/octet-stream` 內容類型的二進位資料，請將 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 實例傳遞給 `setBody()` 函數。例如，您可以使用 [`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 函數為檔案開啟讀取通道：

```kotlin
val response = client.post("http://0.0.0.0:8080/upload") {
    setBody(File("ktor_logo.png").readChannel())
}
```

如需完整範例，請參閱 [client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 並行請求 {id="parallel_requests"}

預設情況下，當您依序發送多個請求時，客戶端會暫停每個呼叫，直到前一個呼叫完成。若要並行執行多個請求，請使用 [`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 或 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函數。以下範例演示了如何使用 `async()` 並行執行兩個請求：

```kotlin
coroutineScope {
    // Parallel requests
    val firstRequest: Deferred<String> = async { client.get("http://localhost:8080/path1").bodyAsText() }
    val secondRequest: Deferred<String> = async { client.get("http://localhost:8080/path2").bodyAsText() }
    val firstRequestContent = firstRequest.await()
    val secondRequestContent = secondRequest.await()
}
```

如需完整範例，請參閱 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消請求 {id="cancel-request"}

若要取消請求，請取消執行該請求的協程。[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 函數返回一個 `Job`，可用於取消正在執行的協程：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

有關更多詳細資訊，請參閱[取消和逾時](https://kotlinlang.org/docs/cancellation-and-timeouts.html)。