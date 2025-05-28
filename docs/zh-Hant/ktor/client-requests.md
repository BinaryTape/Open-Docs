[//]: # (title: 發出請求)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭和請求本文。
</link-summary>

[設定客戶端](client-create-and-configure.md)後，您可以發出 HTTP 請求。發出 HTTP 請求的主要方式是 `[request](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html)` 函式，該函式可以將 URL 作為參數。在此函式內部，您可以配置各種請求參數：
*   指定 HTTP 方法，例如 `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS` 或 `PATCH`。
*   將 URL 指定為字串，或單獨配置 URL 組件（網域、路徑、查詢參數等）。
*   新增標頭和 Cookie。
*   設定請求本文，例如純文字、資料物件或表單參數。

這些參數由 `[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)` 類別公開。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by [[[HttpRequestBuilder|https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html]]]
}
```
{interpolate-variables="true" disable-links="false"}

請注意，此函式允許您以 `HttpResponse` 物件的形式接收回應。`HttpResponse` 公開了以各種方式（字串、JSON 物件等）獲取回應本文所需的 API，並獲取回應參數，例如狀態碼、內容類型、標頭等等。您可以從 [](client-responses.md) 主題中了解更多資訊。

> `request` 是一個掛起函式 (suspending function)，因此請求應僅從協程 (coroutine) 或另一個掛起函式中執行。您可以從 [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html) 中了解更多關於呼叫掛起函式 (suspending functions) 的資訊。

### 指定 HTTP 方法 {id="http-method"}

呼叫 `request` 函式時，您可以使用 `method` 屬性指定所需的 HTTP 方法：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

除了 `request` 函式之外，`HttpClient` 還為基本的 HTTP 方法提供了特定函式：`[get](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)`、`[post](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html)`、`[put](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html)` 等等。例如，您可以將上述請求替換為以下程式碼：
```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

在這兩個範例中，請求 URL 都指定為字串。您也可以使用 `[HttpRequestBuilder](#url)` 單獨配置 URL 組件。

## 指定請求 URL {id="url"}

Ktor 客戶端允許您透過以下方式配置請求 URL：

-   *傳遞整個 URL 字串*
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}
   
-   *單獨配置 URL 組件*
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="22-28"}
   
   在此情況下，使用了 `HttpRequestBuilder` 公開的 `url` 參數。此參數接受 `[URLBuilder](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html)` 並在建構 URL 時提供更大的靈活性。

> 若要為所有請求配置基本 URL (base URL)，您可以使用 `[DefaultRequest](client-default-request.md#url)` 外掛程式 (plugin)。

### 路徑區段 {id="path_segments"}

在前面的範例中，我們使用 `URLBuilder.path` 屬性指定了整個 URL 路徑。
您也可以使用 `appendPathSegments` 函式傳遞個別的路徑區段。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

請注意，`appendPathSegments` 會對路徑區段進行 [編碼][percent_encoding]。
若要停用編碼，請使用 `appendEncodedPathSegments`。

### 查詢參數 {id="query_parameters"}
若要新增 <emphasis tooltip="query_string">查詢字串</emphasis> 參數，請使用 `URLBuilder.parameters` 屬性：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="34-38"}

請注意，`parameters` 會對查詢參數進行 [編碼][percent_encoding]。
若要停用編碼，請使用 `encodedParameters`。

> `trailingQuery` 屬性可用於即使沒有查詢參數也保留 `?` 字元。

### URL 片段 {id="url-fragment"}

雜湊符號 `#` 在 URL 的末端引入了可選的片段。
您可以使用 `fragment` 屬性配置 URL 片段。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

請注意，`fragment` 會對 URL 片段進行 [編碼][percent_encoding]。
若要停用編碼，請使用 `encodedFragment`。

## 設定請求參數 {id="parameters"}
在本節中，我們將了解如何指定各種請求參數，包括 HTTP 方法、標頭和 Cookie。如果您需要為特定客戶端的所有請求配置一些預設參數，請使用 `[DefaultRequest](client-default-request.md)` 外掛程式。

### 標頭 {id="headers"}

若要向請求新增標頭，您可以使用以下方式：
-   `[headers](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html)` 函式允許您一次新增多個標頭：
   ```kotlin
   ```
  {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}
-   `[header](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html)` 函式允許您附加單個標頭。
-   `basicAuth` 和 `bearerAuth` 函式新增帶有相應 HTTP 方案的 `Authorization` 標頭。
   > 有關進階身份驗證配置，請參閱 [](client-auth.md)。

### Cookie {id="cookies"}
若要傳送 Cookie，請使用 `[cookie](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html)` 函式：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="55-64"}

Ktor 還提供了 `[HttpCookies](client-cookies.md)` 外掛程式，允許您在呼叫之間保留 Cookie。如果安裝了此外掛程式，則使用 `cookie` 函式新增的 Cookie 將被忽略。

## 設定請求本文 {id="body"}
若要設定請求本文，您需要呼叫 `[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)` 公開的 `setBody` 函式。此函式接受不同類型的負載 (payloads)，包括純文字、任意類別實例、表單資料、位元組陣列等等。下面，我們將看幾個範例。

### 純文字 {id="text"}
以純文字作為本文傳送可以透過以下方式實現：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 物件 {id="objects"}
啟用 `[ContentNegotiation](client-serialization.md)` 外掛程式後，您可以將類別實例作為 JSON 在請求本文中傳送。為此，請將類別實例傳遞給 `setBody` 函式，並使用 `[contentType](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html)` 函式將內容類型設定為 `application/json`：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

您可以從 [](client-serialization.md) 說明章節中了解更多資訊。

### 表單參數 {id="form_parameters"}

Ktor 客戶端提供了 `[`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html)` 函式，用於傳送 `application/x-www-form-urlencoded` 類型的表單參數。以下範例展示了其用法：

*   `url` 指定用於發出請求的 URL。
*   `formParameters` 是一組使用 `parameters` 建構的表單參數。

```kotlin
```
{src="snippets/client-submit-form/src/main/kotlin/com/example/Application.kt" include-lines="16-25"}

您可以在此處找到完整範例：[client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> 若要傳送在 URL 中編碼的表單參數，請將 `encodeInQuery` 設定為 `true`。

### 上傳檔案 {id="upload_file"}

如果您需要隨表單傳送檔案，您可以使用以下方法：

-   使用 `[submitFormWithBinaryData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html)` 函式。在此情況下，邊界 (boundary) 將自動產生。
-   呼叫 `post` 函式，並將 `[MultiPartFormDataContent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html)` 實例傳遞給 `setBody` 函式。請注意，`MultiPartFormDataContent` 建構函式也允許您傳遞邊界值。

對於這兩種方法，您都需要使用 `[formData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html)` 函式來建構表單資料。

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

`MultiPartFormDataContent` 還允許您覆寫邊界和內容類型，如下所示：

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

您可以在此處找到完整範例：
-   [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)
-   [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)

### 二進位資料 {id="binary"}

若要傳送 `application/octet-stream` 內容類型的二進位資料，請將 `[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)` 實例傳遞給 `setBody` 函式。
例如，您可以使用 `[File.readChannel](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html)` 函式為檔案開啟讀取通道並填充它：

```kotlin
```
{src="snippets/client-upload-binary-data/src/main/kotlin/com/example/Application.kt" include-lines="14-16"}

您可以在此處找到完整範例：[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 並行請求 {id="parallel_requests"}

當同時傳送兩個請求時，客戶端會暫停第二個請求的執行，直到第一個請求完成。如果您需要同時執行多個請求，可以使用 `[launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)` 或 `[async](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)` 函式。下面的程式碼片段展示了如何非同步執行兩個請求：
```kotlin
```
{src="snippets/client-parallel-requests/src/main/kotlin/com/example/Application.kt" include-lines="12,19-23,28"}

若要查看完整範例，請參閱 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)。

## 取消請求 {id="cancel-request"}

如果您需要取消請求，可以取消執行此請求的協程。`[launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)` 函式返回一個 `Job`，可用於取消正在執行的協程：

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

從 [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html) 了解更多資訊。