[//]: # (title: 處理請求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由處理常式中處理傳入的請求。</link-summary>

Ktor 允許您在 [路由處理常式](server-routing.md#define_route) 中處理傳入的請求並傳送 [回應](server-responses.md)。處理請求時，您可以執行各種操作：

* 獲取 [請求資訊](#request_information)，例如頁首、Cookies 等。
* 獲取 [路徑參數](#path_parameters) 值。
* 獲取 [查詢字串](#query_parameters) 的參數。
* 接收 [主體內容](#body_contents)，例如資料物件、表單參數和檔案。

## 一般請求資訊 {id="request_information"}
在路由處理常式中，您可以使用 [`call.request`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call/request.html) 屬性存取請求。這會傳回 [`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 執行個體，並提供對各種請求參數的存取。例如，下方的程式碼片段顯示如何獲取請求 URI：

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
[`call.respondText()`](server-responses.md#plain-text) 方法用於將回應傳回給用戶端。

[`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 物件允許您存取各種請求資料，例如：

* **頁首 (Headers)**

  要存取所有請求頁首，請使用 [`ApplicationRequest.headers`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 屬性。您也可以使用專用的擴充函式存取特定的頁首，例如 `acceptEncoding`、`contentType`、`cacheControl` 等。

* **Cookies**  

  [`ApplicationRequest.cookies`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 屬性提供對請求相關 Cookies 的存取。要了解如何使用 Cookies 處理工作階段，請參閱 [Sessions](server-sessions.md) 章節。

* **連線詳細資訊**

  使用 [`ApplicationRequest.local`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性來存取連線詳細資訊，例如主機名稱、埠 (port)、scheme 等。

* **`X-Forwarded-` 頁首**

  要獲取透過 HTTP 代理或負載平衡器傳遞的請求資訊，請安裝 [Forwarded headers](server-forward-headers.md) 外掛程式並使用 [`ApplicationRequest.origin`](https://api.ktor.io/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性。

## 路徑參數 {id="path_parameters"}
處理請求時，您可以使用 `call.parameters` 屬性存取 [路徑參數](server-routing.md#path_parameter) 值。例如，在下方的程式碼片段中，對於 `/user/admin` 路徑，`call.parameters["login"]` 將傳回 _admin_：

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## 查詢參數 {id="query_parameters"}

要存取 <emphasis tooltip="query_string">查詢字串</emphasis> 的參數，您可以使用 [`ApplicationRequest.queryParameters()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 屬性。例如，如果請求傳送到 `/products?price=asc`，您可以用以下方式存取 `price` 查詢參數：

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // 顯示價格從最低到最高的產品
    }
}
```

您也可以使用 [`ApplicationRequest.queryString()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/query-string.html) 函式獲取整個查詢字串。

## 主體內容 {id="body_contents"}
本節說明如何接收隨 `POST`、`PUT` 或 `PATCH` 傳送的主體內容。

### 原始負載 (Raw payload) {id="raw"}

要存取原始主體負載並手動剖析，請使用 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 函式，該函式接受要接收的負載型別。假設您有以下 HTTP 請求：

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

您可以透過以下方式之一，將此請求的主體作為指定型別的物件接收：

- **字串 (String)**

   要將請求主體作為字串值接收，請使用 `call.receive<String>()`。您也可以使用 [`.receiveText()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-text.html) 來達到相同的結果：
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **ByteArray**

   要將請求的主體作為位元組陣列接收，請呼叫 `call.receive<ByteArray>()`：
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   您可以使用 `call.receive<ByteReadChannel>()` 或 [`.receiveChannel()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-channel.html) 來接收 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它能實現位元組序列的非同步讀取：
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readString()
       call.respondText(text)
   }
   ```

   下方範例顯示如何使用 `ByteReadChannel` 來上傳檔案：
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

> 關於 Ktor 通道 (channels) 與 `RawSink`、`RawSource` 或 `OutputStream` 等型別之間的轉換，請參閱 [I/O 互通性](io-interoperability.md)。
>
{style="tip"}

> 如需完整範例，請參閱 [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-raw-data)。

### 物件 {id="objects"}

Ktor 提供 [ContentNegotiation](server-serialization.md) 外掛程式來交涉請求的媒體類型，並將內容反序列化為所需型別的物件。

要接收並轉換請求內容，請呼叫 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 函式，並傳入一個資料類別 (data class) 作為參數：

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 若要了解更多資訊，請參閱 [Ktor Server 中的內容交涉與序列化](server-serialization.md)。

### 表單參數 {id="form_parameters"}
Ktor 允許您使用 [receiveParameters](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函式接收以 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送的表單參數。下方範例顯示了一個 [HTTP 用戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其表單參數在主體中傳遞：
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

您可以在程式碼中按如下方式獲取參數值：
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 如需完整範例，請參閱 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-form-parameters)。

### 多部分表單資料 (Multipart form data) {id="form_data"}

要接收作為多部分請求的一部分傳送的檔案，請呼叫 [`.receiveMultipart()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-multipart.html) 函式，然後根據需要對每個部分進行迴圈處理。

多部分請求資料是循序處理的，因此您無法直接存取其中的特定部分。此外，這些請求可能包含不同類型的部分，例如表單欄位、檔案或二進位資料，需要以不同方式處理。

此範例示範如何接收檔案並將其儲存到檔案系統：

```kotlin
import io.ktor.server.application.*
import io.ktor.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import java.io.File

fun Application.main() {
    routing {
        post("/upload") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val file = File("uploads/$fileName")
                        part.provider().copyAndClose(file.writeChannel())
                    }

                    else -> {}
                }
                part.dispose()
            }

            call.respondText("$fileDescription is uploaded to 'uploads/$fileName'")
        }
    }
}
```

#### 預設檔案大小限制

預設情況下，允許接收的二進位和檔案項目大小限制為 50 MiB。如果接收的檔案或二進位項目超過 50 MiB 限制，則會拋出 `IOException`。

要覆寫預設表單欄位限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

在此範例中，新的限制設定為 100 MiB。

#### 表單欄位

`PartData.FormItem` 代表表單欄位，其值可以透過 `value` 屬性存取：

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### 檔案上傳

`PartData.FileItem` 代表檔案項目。您可以將檔案上傳作為位元組串流處理：

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 函式會傳回 `ByteReadChannel`，這允許您增量讀取資料。使用 `.copyAndClose()` 函式，您隨後可以將檔案內容寫入指定的目的地，同時確保正確的資源清理。

要確定上傳檔案的大小，您可以在 `post` 處理常式中獲取 `Content-Length` [頁首值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 資源清理

一旦表單處理完成，會使用 `.dispose()` 函式處理掉每個部分以釋放資源。

```kotlin
part.dispose()
```

> 要了解如何執行此範例，請參閱 [upload-file](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/upload-file)。