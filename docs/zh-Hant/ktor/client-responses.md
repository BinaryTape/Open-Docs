[//]: # (title: 接收回應)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解如何接收回應、取得回應主體以及獲取回應參數。
</link-summary>

所有用於 [發送 HTTP 請求](client-requests.md) 的函式（`request`、`get`、`post` 等）都允許您將回應接收為一個 [`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 物件。

`HttpResponse` 公開了以各種方式（原始位元組、JSON 物件等）獲取 [回應主體](#body) 以及獲取 [回應參數](#parameters)（例如狀態碼、內容型別和標頭）所需的 API。
例如，您可以透過以下方式接收不帶參數的 `GET` 請求的 `HttpResponse`：

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 獲取回應參數 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 類別允許您獲取各種回應參數，例如狀態碼、標頭、HTTP 版本等。

### 狀態碼 {id="status"}

若要獲取回應的狀態碼，請使用 [`HttpResponse.status`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 屬性：

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

[`HttpResponse.headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 屬性允許您獲取包含所有回應標頭的 [`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) map。

此外，`HttpResponse` 類別還公開了以下用於接收特定標頭值的函式：

* `contentType()` 用於獲取 `Content-Type` 標頭值。
* `charset()` 用於從 `Content-Type` 標頭值獲取字元集。
* `etag()` 用於獲取 `E-Tag` 標頭值。
* `setCookie()` 用於獲取 `Set-Cookie` 標頭值。
  > Ktor 還提供了 [`HttpCookies`](client-cookies.md) 外掛程式，允許您在呼叫之間保留 Cookie。

#### 分隔標頭值

如果標頭可以包含多個以逗號或分號分隔的值，您可以使用 `.getSplitValues()` 函式從標頭中獲取所有分隔後的值：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val headers: Headers = httpResponse.headers

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```

使用常用的 `get` 運算子會傳回未經分割的值：

```kotlin
val values = headers["X-Multi-Header"]!!
// ["1, 2", "3"]
```

## 接收回應主體 {id="body"}

### 原始主體 {id="raw"}

若要接收回應的原始主體，請呼叫 `body` 函式並將所需的型別作為參數傳遞。下方的程式碼片段展示了如何將原始主體接收為一個 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

同樣地，您可以將主體獲取為一個 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)：

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

下方的 [可執行範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file) 展示了如何將回應獲取為 `ByteArray` 並將其儲存到檔案中：

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

上述範例中的 [`onDownload()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/on-download.html) 擴充函式用於顯示下載進度。

對於非串流請求，回應主體會自動載入並快取在記憶體中，從而允許重複存取。雖然這對於小型負載很高效，但對於大型回應可能會導致高記憶體佔用。

若要高效地處理大型回應，請使用 [串流方式](#streaming)，它會增量處理回應而不將其儲存在記憶體中。

### JSON 物件 {id="json"}

安裝了 [ContentNegotiation](client-serialization.md) 外掛程式後，您可以在接收回應時將 JSON 資料反序列化為資料類別：

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

若要了解更多，請參閱 [接收與發送資料](client-serialization.md#receive_send_data)。

> ContentNegotiation 外掛程式可用於 [用戶端](client-serialization.md) 和 [伺服器](server-serialization.md)。請確保根據您的情況使用正確的一個。

### 多部分表單資料 {id="multipart"}

當接收包含多部分表單資料 (multipart form data) 的回應時，您可以將其主體讀取為一個 [`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html) 執行個體。這允許您處理回應中包含的表單欄位和檔案。

下面的範例示範了如何處理來自多部分回應的文字表單欄位和檔案上傳：

```kotlin
val response = client.post("https://myserver.com/multipart/receive")

val multipart = response.body<MultiPartData>()

multipart.forEachPart { part ->
    when (part) {
        is PartData.FormItem -> {
            println("Form item key: ${part.name}")
            val value = part.value
            // ...
        }
        is PartData.FileItem -> {
            println("file: ${part.name}")
            println(part.originalFileName)
            val fileContent: ByteReadChannel = part.provider()
            // ...
        }
    }
    part.dispose()
}
```

#### 表單欄位

`PartData.FormItem` 代表一個表單欄位，可以透過 value 屬性存取其值：

```kotlin
when (part) {
    is PartData.FormItem -> {
        println("Form item key: ${part.name}")
        val value = part.value
        // ...
    }
}
```

#### 檔案上傳

`PartData.FileItem` 代表一個檔案項目。您可以將檔案上傳作為位元組串流處理：

```kotlin
when (part) {
    is PartData.FileItem -> {
        println("file: ${part.name}")
        println(part.originalFileName)
        val fileContent: ByteReadChannel = part.provider()
        // ...
    }
}
```

#### 資源清理

一旦表單處理完成，每個部分都會使用 `.dispose()` 函式進行處置以釋放資源。

```kotlin
part.dispose()
```

### 串流資料 {id="streaming"}

預設情況下，呼叫 `HttpResponse.body()` 會將完整回應載入到記憶體中。對於大型回應或檔案下載，通常最好以分塊 (chunks) 方式處理資料，而無需等待完整主體。

Ktor 提供了幾種使用 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 和 I/O 公用程式來執行此操作的方法。

#### 順序分塊處理

若要以分塊方式按順序處理回應，請使用帶有作用域 [`execute`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 區塊的 `HttpStatement`。

以下範例示範了以分塊方式讀取回應並將其儲存到檔案中：

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize: Long = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

使用 `ByteReadChannel.readRemaining()` 會獲取通道中所有可用的位元組，而 `Source.transferTo()` 則直接將資料寫入檔案，從而減少不必要的分配。

> 有關完整的串流範例，請參閱 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)。

#### 直接將回應寫入檔案

對於不需要逐塊處理的簡單下載，您可以選擇以下方法之一：

- [將所有位元組複製到 `ByteWriteChannel` 並關閉](#copyAndClose)。
- [複製到 `RawSink`](#readTo)。

##### 將所有位元組複製到 `ByteWriteChannel` 並關閉 {id="copyAndClose"}

[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 函式會將 `ByteReadChannel` 中所有剩餘的位元組複製到 `ByteWriteChannel`，然後自動關閉這兩個通道：

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```

這對於不需要手動管理通道的完整檔案下載非常方便。

##### 複製到 `RawSink` {id="readTo"}

[`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 函式會直接將位元組寫入 `RawSink`，無需中間緩衝區：

```kotlin
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()

client.prepareGet(url).execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.readTo(stream)
}
println("A file saved to ${file.path}")

```

與 `.copyAndClose()` 不同，接收器 (sink) 在寫入後保持開啟狀態，並且只有在傳輸過程中發生錯誤時才會自動關閉。

> 有關在 Ktor 通道與 `RawSink`、`RawSource` 或 `OutputStream` 等型別之間進行轉換，請參閱 [I/O 互通性](io-interoperability.md)。
>
{style="tip"}