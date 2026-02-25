[//]: # (title: 發送請求)

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
了解如何發送請求並指定各種請求參數：請求 URL、HTTP 方法、標頭和請求主體。
</link-summary>

在[配置用戶端](client-create-and-configure.md)之後，您就可以開始發送 HTTP 請求。發送請求的主要方式是使用接受 URL 作為參數的 [`.request()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/request.html) 函式。在此函式內部，您可以配置各種請求參數：

* 指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
* 將 URL 配置為字串，或分別配置其組件（例如網域、路徑和查詢參數）。
* 使用 Unix 網域通訊端（Unix domain socket）。
* 新增標頭和 cookies。
* 包含請求主體 – 例如純文字、資料物件或表單參數。

這些參數由 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 類別提供。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // 配置 HttpRequestBuilder 提供的請求參數
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 函式會將回應以 `HttpResponse` 物件形式傳回。`HttpResponse` 提供了獲取各種格式回應主體（例如字串、JSON 物件等）所需的 API，以及檢索回應參數（例如狀態碼、內容類型和標頭）。如需更多資訊，請參閱[接收回應](client-responses.md)。

> `.request()` 是一個掛起函式（suspending function），這意味著它必須從協同程式（coroutine）或其他掛起函式中呼叫。要了解更多關於掛起函式的資訊，請參閱 [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)。

### 指定 HTTP 方法 {id="http-method"}

呼叫 `.request()` 函式時，您可以使用 `method` 屬性指定所需的 HTTP 方法：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

除了 `.request()` 之外，`HttpClient` 還為基本的 HTTP 方法提供了特定的函式，例如 [`.get()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/get.html)、[`.post()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/post.html) 和 [`.put()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/put.html)。上述範例可以使用 `.get()` 函式簡化：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

在這兩個範例中，請求 URL 都是以字串形式指定的。您也可以使用 [`HttpRequestBuilder`](#url) 分別配置 URL 組件。

## 指定請求 URL {id="url"}

Ktor 用戶端允許您以多種方式配置請求 URL：

### 傳遞完整的 URL 字串

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

### 分別配置 URL 組件

```kotlin
client.get {
    url {
        protocol = URLProtocol.HTTPS
        host = "ktor.io"
        path("docs/welcome.html")
    }
}
```

在這種情況下，使用了 `HttpRequestBuilder` 提供的 `url` 參數。它接受 [`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 的實體，為建置複雜的 URL 提供更多彈性。

> 若要為所有請求配置基礎 URL，請使用 [`DefaultRequest`](client-default-request.md#url) 外掛程式。

### 路徑片段 {id="path_segments"}

在前面的範例中，整個 URL 路徑是使用 `URLBuilder.path` 屬性指定的。或者，您可以使用 `appendPathSegments()` 函式傳遞個別的路徑片段（path segments）。

```kotlin
client.get("https://ktor.io") {
    url {
        appendPathSegments("docs", "welcome.html")
    }
}
```

預設情況下，`appendPathSegments` 會對路徑片段進行 [百分比編碼 (encode)][percent_encoding]。若要停用編碼，請改用 `appendEncodedPathSegments()`。

### 查詢參數 {id="query_parameters"}

要新增 <emphasis tooltip="query_string">查詢字串 (query string)</emphasis> 參數，請使用 `URLBuilder.parameters` 屬性：

```kotlin
client.get("https://ktor.io") {
    url {
        parameters.append("token", "abc123")
    }
}
```

預設情況下，`parameters` 會對查詢參數進行 [編碼][percent_encoding]。若要停用編碼，請改用 `encodedParameters()`。

> 即使沒有查詢參數，也可以使用 `trailingQuery` 屬性來保留 `?` 字元。

### URL 片段 {id="url-fragment"}

井字號 `#` 在 URL 結尾附近引入選用的片段（fragment）。您可以使用 `fragment` 屬性配置 URL 片段。

```kotlin
client.get("https://ktor.io") {
    url {
        fragment = "some_anchor"
    }
}
```

預設情況下，`fragment` 會對 URL 片段進行 [編碼][percent_encoding]。若要停用編碼，請改用 `encodedFragment()`。

## 指定 Unix 網域通訊端

> Unix 網域通訊端（Unix domain sockets）僅在 CIO 引擎中支援。要將 Unix 通訊端與 Ktor 伺服器配合使用，請相應地[配置伺服器](server-configuration-code.topic#cio-code)。
>
{style="note"}

要向監聽 Unix 網域通訊端的伺服器發送請求，請在呼叫 CIO 用戶端時呼叫 `unixSocket()` 函式：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您也可以將 Unix 網域通訊端配置為[預設請求](client-default-request.md#unix-domain-sockets)的一部分。

## 設定請求參數 {id="parameters"}

您可以指定各種請求參數，包括 HTTP 方法、標頭和 cookies。如果您需要為特定用戶端的所有請求配置預設參數，請使用 [`DefaultRequest`](client-default-request.md) 外掛程式。

### 標頭 {id="headers"}

您可以透過幾種方式將標頭新增至請求：

#### 新增多個標頭

[`headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/headers.html) 函式允許您一次新增多個標頭：

```kotlin
client.get("https://ktor.io") {
    headers {
        append(HttpHeaders.Accept, "text/html")
        append(HttpHeaders.Authorization, "abc123")
        append(HttpHeaders.UserAgent, "ktor client")
    }
}
```

您也可以將 `appendAll()` 函式與 `Map` 或 `vararg Pair` 配合使用，以方便地新增多個標頭：

```kotlin
        client.get("https://ktor.io") {
            headers {
                // 使用 vararg Pairs
                appendAll(
                    HttpHeaders.Accept to "text/html",
                    HttpHeaders.Authorization to "abc123"
                )

                // 使用 Map
                appendAll(mapOf("foo" to "bar", "baz" to "qux"))
                appendAll(mapOf("test" to listOf("1", "2", "3")))

                // 使用具有多個值的自訂標頭
                appendAll("X-Custom-Header" to listOf("val1", "val2"))
            }
        }
```

#### 新增單一標頭

[`header`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/header.html) 函式允許您附加單一標頭。

#### 使用 `basicAuth` 或 `bearerAuth` 進行授權

`basicAuth` 和 `bearerAuth` 函式會新增帶有對應 HTTP 配置的 `Authorization` 標頭。

> 有關進階身分驗證配置，請參閱 [Ktor Client 中的身分驗證與授權](client-auth.md)。

### Cookies {id="cookies"}

要發送 cookies，請使用 [`cookie()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/cookie.html) 函式：

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

Ktor 還提供了 [`HttpCookies`](client-cookies.md) 外掛程式，允許您在呼叫之間保留 cookies。如果安裝了此外掛程式，使用 `cookie()` 函式新增的 cookies 將被忽略。

## 設定請求主體 {id="body"}

要設定請求主體，請呼叫 [`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 提供的 `setBody()` 函式。此函式接受不同類型的酬載，包括純文字、任意類別實體、表單資料和位元組陣列。

### 文字 {id="text"}

將純文字作為主體發送可以透過以下方式實作：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 物件 {id="objects"}

在啟用了 [`ContentNegotiation`](client-serialization.md) 外掛程式的情況下，您可以將類別實體作為 JSON 在請求主體中發送。為此，請將類別實體傳遞給 `setBody()` 函式，並使用 [`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 函式將內容類型設定為 `application/json`：

```kotlin
val response: HttpResponse = client.post("http://localhost:8080/customer") {
    contentType(ContentType.Application.Json)
    setBody(Customer(3, "Jet", "Brains"))
}
```

如需更多資訊，請參閱 [Ktor Client 中的內容協商與序列化](client-serialization.md)。

### 表單參數 {id="form_parameters"}

Ktor 用戶端提供了 [`submitForm()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 函式，用於發送 `application/x-www-form-urlencoded` 類型的表單參數。以下範例示範了其用法：

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

* `url` 指定發送請求的 URL。
* `formParameters` 是一組使用 `parameters` 建置的表單參數。

有關完整範例，請參閱 [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 要發送在 URL 中編碼的表單參數，請將 `encodeInQuery` 設定為 `true`。

### 上傳檔案 {id="upload_file"}

如果您需要隨表單發送檔案，可以使用以下方法：

* 使用 [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 函式。在這種情況下，將自動產生邊界（boundary）。
* 呼叫 `post` 函式並將 [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html) 實體傳遞給 `setBody` 函式。`MultiPartFormDataContent` 建構函式也允許您傳遞邊界值。

對於這兩種方法，您都需要使用 [`formData {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/form-data.html) 函式來建置表單資料。

#### 使用 `.submitFormWithBinaryData()`

`.submitFormWithBinaryData()` 函式會自動產生邊界，適用於檔案內容足夠小，可以安全地使用 `.readBytes()` 讀入記憶體的簡單使用案例。

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

有關完整範例，請參閱 [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)。

#### 使用 `MultiPartFormDataContent`

要有效地串流大型或動態內容，您可以將 `MultiPartFormDataContent` 與 `InputProvider` 配合使用。`InputProvider` 允許您以緩衝串流的形式提供檔案資料，而不是將其完整載入記憶體，因此非常適合大型檔案。使用 `MultiPartFormDataContent`，您還可以使用 `onUpload` 回呼來監控上傳進度。

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
                println("Sent $bytesSentTotal bytes from $contentLength")
            }
        }
```

在多平台（multiplatform）專案中，您可以將 `SystemFileSystem.source()` 與 `InputProvider` 配合使用：

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

您也可以手動建構具有自訂邊界和內容類型的 `MultiPartFormDataContent`：

```kotlin
fun customMultiPartMixedDataContent(parts: List<PartData>): MultiPartFormDataContent {
    val boundary = "WebAppBoundary"
    val contentType = ContentType.MultiPart.Mixed.withParameter("boundary", boundary)
    return MultiPartFormDataContent(parts, boundary, contentType)
}
```

有關完整範例，請參閱 [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)。

### 二進位資料 {id="binary"}

要發送 `application/octet-stream` 內容類型的二進位資料，請將 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 實體傳遞給 `setBody()` 函式。
例如，您可以使用 [`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 函式為檔案開啟讀取通道：

```kotlin
val response = client.post("http://0.0.0.0:8080/upload") {
    setBody(File("ktor_logo.png").readChannel())
}
```

有關完整範例，請參閱 [client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 平行請求 {id="parallel_requests"}

預設情況下，當您循序發送多個請求時，用戶端會掛起每個呼叫，直到上一個呼叫完成。要同時執行多個請求，請使用 [`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 或 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函式。以下範例示範了如何使用 `async()` 平行執行兩個請求：

```kotlin
coroutineScope {
    // 平行請求
    val firstRequest: Deferred<String> = async { client.get("http://localhost:8080/path1").bodyAsText() }
    val secondRequest: Deferred<String> = async { client.get("http://localhost:8080/path2").bodyAsText() }
    val firstRequestContent = firstRequest.await()
    val secondRequestContent = secondRequest.await()
}
```

有關完整範例，請參閱 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消請求 {id="cancel-request"}

要取消請求，請取消執行該請求的協同程式。[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 函式會傳回一個 `Job`，可用於取消執行中的協同程式：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

如需更多詳細資訊，請參閱 [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html)。