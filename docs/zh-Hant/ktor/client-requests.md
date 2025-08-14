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
了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。
</link-summary>

[設定客戶端](client-create-and-configure.md)後，您可以開始發出 HTTP 請求。主要的方式是使用
[`.request()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html)
函數，它接受一個 URL 作為參數。在這個函數內部，您可以設定各種請求參數：

*   指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
*   將 URL 設定為字串，或分別設定其組件（例如網域、路徑和查詢參數）。
*   使用 Unix 網域通訊端。
*   新增標頭和 Cookie。
*   包含請求主體 – 例如，純文字、資料物件或表單參數。

這些參數由
[`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)
類別公開。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 函數將回應作為 `HttpResponse` 物件返回。`HttpResponse` 公開了以各種格式（例如字串、JSON 物件等）取得回應主體以及擷取回應參數（例如狀態碼、內容類型和標頭）所需的 API。有關更多資訊，
請參閱 [](client-responses.md)。

> `.request()` 是一個暫停函數，這表示它必須從協程或另一個暫停函數內部呼叫。要了解有關暫停函數的更多資訊，請參閱
> [協程基礎](https://kotlinlang.org/docs/coroutines-basics.html)。

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

除了 `.request()` 之外，`HttpClient` 還提供用於基本 HTTP 方法的特定函數，例如
[`.get()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)、
[`.post()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html) 和
[`.put()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html)。
上述範例可以使用 `.get()` 函數簡化：

[object Promise]

在這兩個範例中，請求 URL 都指定為字串。您也可以使用
[`HttpRequestBuilder`](#url) 分別設定 URL 組件。

## 指定請求 URL {id="url"}

Ktor 客戶端允許您以多種方式設定請求 URL：

### 傳遞整個 URL 字串

[object Promise]

### 分別設定 URL 組件

[object Promise]

在這種情況下，使用由 `HttpRequestBuilder` 提供的 `url` 參數。它接受一個
[`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 實例，為建立複雜 URL 提供更多彈性。

> 若要為所有請求設定基礎 URL，請使用 [`DefaultRequest`](client-default-request.md#url) 外掛程式。

### 路徑區段 {id="path_segments"}

在前面的範例中，整個 URL 路徑是使用 `URLBuilder.path` 屬性指定的。
或者，您可以透過 `appendPathSegments()` 函數傳遞單獨的路徑區段。

[object Promise]

依預設，`appendPathSegments` 會對路徑區段進行[編碼][percent_encoding]。
若要停用編碼，請改用 `appendEncodedPathSegments()`。

### 查詢參數 {id="query_parameters"}

若要新增<emphasis tooltip="query_string">查詢字串</emphasis>參數，請使用 `URLBuilder.parameters` 屬性：

[object Promise]

依預設，`parameters` 會對查詢參數進行[編碼][percent_encoding]。
若要停用編碼，請改用 `encodedParameters()`。

> `trailingQuery` 屬性可用於即使沒有查詢參數也保留 `?` 字元。

### URL 片段 {id="url-fragment"}

雜湊符號 `#` 在 URL 接近結尾處引入可選片段。
您可以使用 `fragment` 屬性來設定 URL 片段。

[object Promise]

依預設，`fragment` 會對 URL 片段進行[編碼][percent_encoding]。
若要停用編碼，請改用 `encodedFragment()`。

## 指定 Unix 網域通訊端

> Unix 網域通訊端僅在 CIO 引擎中支援。
> 若要搭配 Ktor 伺服器使用 Unix 通訊端，請依據 [設定伺服器](server-configuration-code.topic#cio-code) 進行設定。
>
{style="note"}

若要向監聽 Unix 網域通訊端的伺服器傳送請求，請在使用 CIO 客戶端時呼叫 `unixSocket()` 函數：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您也可以將 Unix 網域通訊端設定為[預設請求](client-default-request.md#unix-domain-sockets)的一部分。

## 設定請求參數 {id="parameters"}

您可以指定各種請求參數，包括 HTTP 方法、標頭和 Cookie。如果您需要為特定客戶端的所有請求設定預設參數，請使用 [`DefaultRequest`](client-default-request.md) 外掛程式。

### 標頭 {id="headers"}

您可以透過多種方式將標頭新增至請求：

#### 新增多個標頭

[`headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html) 函數允許您一次新增多個標頭：

[object Promise]

#### 新增單一標頭

[`header`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html) 函數允許您附加單一標頭。

#### 使用 `basicAuth` 或 `bearerAuth` 進行身份驗證

`basicAuth` 和 `bearerAuth` 函數會新增帶有相應 HTTP 方案的 `Authorization` 標頭。

> 若要進行進階身份驗證設定，請參閱 [](client-auth.md)。

### Cookie {id="cookies"}

若要傳送 Cookie，請使用
[`cookie()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html) 函數：

[object Promise]

Ktor 還提供 [`HttpCookies`](client-cookies.md) 外掛程式，允許您在呼叫之間保留 Cookie。如果安裝了此外掛程式，則使用 `cookie()` 函數新增的 Cookie 將被忽略。

## 設定請求主體 {id="body"}

若要設定請求主體，請呼叫由
[`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 提供的 `setBody()` 函數。
此函數接受不同類型的酬載，包括純文字、任意類別實例、表單資料和位元組陣列。

### 文字 {id="text"}

傳送純文字作為主體可以透過以下方式實現：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 物件 {id="objects"}

啟用 [`ContentNegotiation`](client-serialization.md) 外掛程式後，您可以將類別實例作為 JSON 包含在請求主體中傳送。為此，請將類別實例傳遞給 `setBody()` 函數，並使用 [`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 函數將內容類型設定為 `application/json`：

[object Promise]

有關更多資訊，請參閱 [](client-serialization.md)。

### 表單參數 {id="form_parameters"}

Ktor 客戶端提供了 [`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html)
函數，用於傳送 `application/x-www-form-urlencoded` 類型的表單參數。以下範例展示了其用法：

[object Promise]

*   `url` 指定發出請求的 URL。
*   `formParameters` 是使用 `parameters` 建立的一組表單參數。

有關完整範例，請參閱 [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 若要傳送在 URL 中編碼的表單參數，請將 `encodeInQuery` 設定為 `true`。

### 上傳檔案 {id="upload_file"}

如果您需要透過表單傳送檔案，可以使用以下方法：

*   使用
    [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html)
    函數。在這種情況下，將自動產生邊界。
*   呼叫 `post` 函數並將
    [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html)
    實例傳遞給 `setBody` 函數。`MultiPartFormDataContent` 建構函數也允許您傳遞邊界值。

對於這兩種方法，您都需要使用
[`formData {}`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html) 函數來建立表單資料。

#### 使用 `.submitFormWithBinaryData()`

`.submitFormWithBinaryData()` 函數會自動產生邊界，適用於檔案內容足夠小，可以安全地使用 `.readBytes()` 讀取到記憶體中的簡單用例。

[object Promise]

有關完整範例，請參閱
[client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)。

#### 使用 `MultiPartFormDataContent`

若要有效率地串流大型或動態內容，您可以搭配 `InputProvider` 使用 `MultiPartFormDataContent`。
`InputProvider` 允許您以緩衝串流形式提供檔案資料，而不是將其完全載入到記憶體中，這使得它非常適合大型檔案。使用 `MultiPartFormDataContent`，您還可以透過 `onUpload` 回呼監控上傳進度。

[object Promise]

在多平台專案中，您可以搭配 `InputProvider` 使用 `SystemFileSystem.source()`：

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

您也可以手動建構具有自訂邊界和內容類型的 `MultiPartFormDataContent`：

[object Promise]

有關完整範例，請參閱
[client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)。

### 二進位資料 {id="binary"}

若要傳送帶有 `application/octet-stream` 內容類型的二進位資料，請將
[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 實例傳遞給 `setBody()` 函數。
例如，您可以使用 [`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html)
函數為檔案開啟一個讀取通道：

[object Promise]

有關完整範例，請參閱
[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 平行請求 {id="parallel_requests"}

依預設，當您依序傳送多個請求時，客戶端會暫停每個呼叫，直到前一個完成。若要同步執行多個請求，請使用
[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)
或 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)
函數。以下範例展示如何使用 `async()` 平行執行兩個請求：

[object Promise]

有關完整範例，請參閱
[client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消請求 {id="cancel-request"}

若要取消請求，請取消執行該請求的協程。
[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)
函數會返回一個可用於取消正在執行協程的 `Job`：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

有關更多詳細資訊，請參閱 [取消和逾時](https://kotlinlang.org/docs/cancellation-and-timeouts.html)。