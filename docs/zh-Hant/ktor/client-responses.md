[//]: # (title: 接收回應)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收回應、取得回應主體以及獲取回應參數。
</link-summary>

所有用於[發送 HTTP 請求](client-requests.md)的函式 (`request`、`get`、`post` 等) 都允許您將回應接收為一個 [`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 物件。

`HttpResponse` 提供了取得各種[回應主體](#body) (原始位元組、JSON 物件等) 和獲取[回應參數](#parameters) (例如狀態碼、內容類型和標頭) 所需的 API。例如，您可以透過以下方式接收無參數的 `GET` 請求的 `HttpResponse`：

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

## 接收回應參數 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 類別允許您獲取各種回應參數，例如狀態碼、標頭、HTTP 版本等。

### 狀態碼 {id="status"}

若要獲取回應的狀態碼，請使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 屬性：

```kotlin
```

{src="snippets/_misc_client/ResponseTypes.kt" include-lines="1-4,9,11,15-17"}

### 標頭 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 屬性允許您獲取一個包含所有回應標頭的 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射 (map)。此外，`HttpResponse` 還提供了以下函式用於接收特定的標頭值：

* `contentType` 用於 `Content-Type` 標頭值
* `charset` 用於 `Content-Type` 標頭值中的字元集
* `etag` 用於 `E-Tag` 標頭值
* `setCookie` 用於 `Set-Cookie` 標頭值
  > Ktor 也提供了 [HttpCookies](client-cookies.md) 外掛程式，它允許您在呼叫之間保留 Cookie。

## 接收回應主體 {id="body"}

### 原始主體 {id="raw"}

若要接收回應的原始主體，請呼叫 `body` 函式並傳遞所需類型作為參數。以下程式碼片段展示了如何將原始主體接收為一個 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)：

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,12"}

同樣地，您可以將主體獲取為一個 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)：

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,13"}

以下[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)展示了如何將回應作為 `ByteArray` 獲取並儲存到檔案：

```kotlin
```
{src="snippets/client-download-file/src/main/kotlin/com/example/Downloader.kt" include-lines="12-24"}

上述範例中的 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 擴充函式用於顯示下載進度。

這種方法會一次將整個回應載入到記憶體中，這對於大型檔案來說可能會產生問題。為了減少記憶體使用量，請考慮以區塊 (chunk) 的方式[串流資料](#streaming)。

### JSON 物件 {id="json"}

在安裝 [ContentNegotiation](client-serialization.md) 外掛程式後，您可以在接收回應時將 JSON 資料反序列化 (deserialize) 為資料類別：

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

若要了解更多資訊，請參閱 [](client-serialization.md#receive_send_data)。

> ContentNegotiation 外掛程式適用於[用戶端](client-serialization.md)和[伺服器](server-serialization.md)。請確保根據您的情況使用正確的外掛程式。

### 串流資料 {id="streaming"}

當您呼叫 `HttpResponse.body` 函式來獲取主體時，Ktor 會在記憶體中處理回應並返回完整的回應主體。如果您需要依序取得回應的區塊 (chunk)，而不是等待整個回應，請使用帶有作用域 (scoped) [execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 區塊的 `HttpStatement`。
以下[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)展示了如何以區塊 (位元組封包) 的方式接收回應內容並將其儲存到檔案中：

```kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

在此範例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用於非同步讀取資料。使用 `ByteReadChannel.readRemaining()` 可檢索通道中所有可用的位元組，而 `Source.transferTo()` 則直接將資料寫入檔案，從而減少了不必要的記憶體分配。

若要將回應主體儲存到檔案而無需額外處理，您可以改用 [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函式：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}