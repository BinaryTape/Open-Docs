[//]: # (title: 接收回應)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收回應、取得回應主體及獲取回應參數。
</link-summary>

所有用於[發出 HTTP 請求](client-requests.md)的函數（`request`、`get`、`post` 等）都允許您將回應作為
一個 [`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
物件來接收。

`HttpResponse` 揭示了所需的 API，以各種方式（原始位元組、JSON
物件等）取得[回應主體](#body)並獲取[回應參數](#parameters)，例如狀態碼、內容類型和標頭。
例如，您可以用以下方式接收一個不帶參數的 `GET` 請求的 `HttpResponse`：

[object Promise]

## 接收回應參數 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
類別允許您獲取各種回應參數，例如狀態碼、標頭、HTTP 版本等。

### 狀態碼 {id="status"}

要獲取回應的狀態碼，請使用
[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html)
屬性：

[object Promise]

### 標頭 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
屬性允許您獲取包含所有回應標頭的 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 映射。此外，`HttpResponse` 揭示了以下用於接收特定標頭值的函數：

* `contentType` 用於 `Content-Type` 標頭值
* `charset` 用於 `Content-Type` 標頭值中的字元集。
* `etag` 用於 `E-Tag` 標頭值。
* `setCookie` 用於 `Set-Cookie` 標頭值。
  > Ktor 還提供了 [HttpCookies](client-cookies.md) 外掛程式，可讓您在呼叫之間保留 Cookie。

## 接收回應主體 {id="body"}

### 原始主體 {id="raw"}

要接收回應的原始主體，請呼叫 `body` 函數並將所需類型作為參數傳遞。下面的程式碼
片段展示了如何將原始主體作為 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 來接收：

[object Promise]

同樣，您可以將主體作為 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) 獲取：

[object Promise]

下面的[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)展示了如何將回應作為 `ByteArray` 獲取並儲存到檔案：

[object Promise]

上面範例中的 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 擴充函數用於顯示下載進度。

對於非串流請求，回應主體會自動載入並快取在記憶體中，允許重複存取。
雖然這對於小型酬載是高效的，但對於大型回應可能會導致高記憶體用量。

為了有效處理大型回應，請使用[串流方法](#streaming)，
它以增量方式處理回應而無需將其儲存在記憶體中。

### JSON 物件 {id="json"}

安裝 [ContentNegotiation](client-serialization.md) 外掛程式後，您可以在接收回應時將 JSON 資料解序列化為資料類別：

[object Promise]

若要了解更多資訊，請參閱 [](client-serialization.md#receive_send_data)。

> ContentNegotiation 外掛程式適用於[客戶端](client-serialization.md)和
> [伺服器](server-serialization.md)。請確保為您的情況使用正確的外掛程式。

### 串流資料 {id="streaming"}

當您呼叫 `HttpResponse.body` 函數來獲取主體時，Ktor 會在記憶體中處理回應並返回完整的回應主體。
如果您需要循序獲取回應的區塊，而不是等待整個回應，請使用帶有
作用域 [execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)
區塊的 `HttpStatement`。
下面的[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)展示了如何以區塊（位元組封包）形式接收回應內容並將其儲存到檔案：

[object Promise]

在此範例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用於
非同步讀取資料。使用 `ByteReadChannel.readRemaining()` 擷取通道中所有可用位元組，而
`Source.transferTo()` 直接將資料寫入檔案，減少不必要的記憶體配置。

要將回應主體儲存到檔案而無需額外處理，您可以改用
[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函數：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}