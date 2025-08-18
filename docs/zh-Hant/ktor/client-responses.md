[//]: # (title: 接收回應)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何接收回應、取得回應主體及獲取回應參數。
</link-summary>

所有用於[發出 HTTP 請求](client-requests.md)的函數（如 `request`、`get`、`post` 等）都允許您將回應接收為 [`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 物件。

`HttpResponse` 提供了取得[回應主體](#body)的各種方式（原始位元組、JSON 物件等）所需 API，並可獲取[回應參數](#parameters)，例如狀態碼、內容類型及標頭。例如，您可以透過以下方式為不帶參數的 `GET` 請求接收 `HttpResponse`：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 接收回應參數 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 類別允許您獲取各種回應參數，例如狀態碼、標頭、HTTP 版本等。

### 狀態碼 {id="status"}

若要獲取回應的狀態碼，請使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 屬性：

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

val httpResponse: HttpResponse = client.get("https://ktor.io/")
if (httpResponse.status.value in 200..299) {
    println("Successful response!")
}
```

### 標頭 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 屬性允許您獲取包含所有回應標頭的 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 對映。此外，`HttpResponse` 提供了以下用於接收特定標頭值的函數：

*   `contentType` 用於 `Content-Type` 標頭值
*   `charset` 用於 `Content-Type` 標頭值中的字元集。
*   `etag` 用於 `E-Tag` 標頭值。
*   `setCookie` 用於 `Set-Cookie` 標頭值。
  > Ktor 還提供了 [HttpCookies](client-cookies.md) 外掛程式，允許您在呼叫之間保留 Cookie。

## 接收回應主體 {id="body"}

### 原始主體 {id="raw"}

若要接收回應的原始主體，請呼叫 `body` 函數並將所需類型作為參數傳遞。以下程式碼片段展示了如何將原始主體接收為 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

同樣地，您可以將主體獲取為 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

以下[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)展示了如何將回應獲取為 `ByteArray` 並儲存到檔案中：

```kotlin
    val client = HttpClient()
    val file = File.createTempFile("files", "index")

    runBlocking {
        val httpResponse: HttpResponse = client.get("https://ktor.io/") {
            onDownload { bytesSentTotal, contentLength ->
                println("Received $bytesSentTotal bytes from $contentLength")
            }
        }
        val responseBody: ByteArray = httpResponse.body()
        file.writeBytes(responseBody)
        println("A file saved to ${file.path}")
    }
```

[`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 在上述範例中的擴充函數用於顯示下載進度。

對於非串流請求，回應主體會自動載入並快取到記憶體中，允許重複存取。雖然這對於小型負載是高效的，但對於大型回應可能會導致高記憶體使用量。

若要有效率地處理大型回應，請使用[串流方式](#streaming)，這會在不將回應儲存到記憶體的情況下，以增量方式處理回應。

### JSON 物件 {id="json"}

在安裝 [ContentNegotiation](client-serialization.md) 外掛程式後，您可以在接收回應時將 JSON 資料反序列化為資料類別：

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

若要了解更多資訊，請參閱[接收和傳送資料](client-serialization.md#receive_send_data)。

> ContentNegotiation 外掛程式適用於[用戶端](client-serialization.md)和[伺服器](server-serialization.md)。請確保根據您的情況使用正確的外掛程式。

### 串流資料 {id="streaming"}

當您呼叫 `HttpResponse.body` 函數來獲取主體時，Ktor 會在記憶體中處理回應並傳回完整的回應主體。如果您需要依序取得回應的區塊（chunk），而不是等待整個回應，請使用具有範圍 [execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 區塊的 `HttpStatement`。
以下[可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)展示了如何以區塊（位元組封包）形式接收回應內容並將其儲存到檔案中：

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining()
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

在此範例中，[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 用於非同步讀取資料。使用 `ByteReadChannel.readRemaining()` 可擷取通道中所有可用的位元組，而 `Source.transferTo()` 則直接將資料寫入檔案，減少不必要的記憶體分配。

若要將回應主體儲存到檔案而不進行額外處理，您可以改用 [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函數：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```