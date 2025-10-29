[//]: # (title: 處理請求)

<show-structure for="chapter" depth="3"/>

<link-summary>學習如何在路由處理器中處理傳入的請求。</link-summary>

Ktor 允許您在 [路由處理器](server-routing.md#define_route) 內部處理傳入的請求並傳送 [回應](server-responses.md)。在處理請求時，您可以執行各種操作：

*   取得 [請求資訊](#request_information)，例如標頭、Cookie 等。
*   取得 [路徑參數](#path_parameters) 值。
*   取得 [查詢字串](#query_parameters) 的參數。
*   接收 [主體內容](#body_contents)，例如資料物件、表單參數和檔案。

## 一般請求資訊 {id="request_information"}
在路由處理器內部，您可以使用 [`call.request`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html) 屬性來存取請求。這會傳回 [`ApplicationRequest`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 實例，並提供對各種請求參數的存取權限。例如，以下程式碼片段顯示如何取得請求 URI：

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
[`call.respondText()`](server-responses.md#plain-text) 方法用於將回應傳送回客戶端。

[`ApplicationRequest`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 物件允許您存取各種請求資料，例如：

*   **標頭**

    若要存取所有請求標頭，請使用 [`ApplicationRequest.headers`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 屬性。您也可以使用專用的擴充函式來存取特定標頭，例如 `acceptEncoding`、`contentType`、`cacheControl` 等。

*   **Cookie**  

    [`ApplicationRequest.cookies`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 屬性提供對與請求相關的 Cookie 的存取權限。若要了解如何使用 Cookie 處理會話，請參閱 [會話](server-sessions.md) 一節。

*   **連線詳情**

    使用 [`ApplicationRequest.local`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性來存取連線詳情，例如主機名稱、埠、方案等。

*   **`X-Forwarded-` 標頭**

    若要取得透過 HTTP 代理或負載平衡器傳遞的請求資訊，請安裝 [轉發標頭](server-forward-headers.md) 外掛並使用 [`ApplicationRequest.origin`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性。

## 路徑參數 {id="path_parameters"}
處理請求時，您可以使用 `call.parameters` 屬性來存取 [路徑參數](server-routing.md#path_parameter) 值。例如，以下程式碼片段中的 `call.parameters["login"]` 對於 `/user/admin` 路徑將傳回 _admin_：

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## 查詢參數 {id="query_parameters"}

若要存取 <emphasis tooltip="query_string">查詢字串</emphasis> 的參數，您可以使用 [`ApplicationRequest.queryParameters()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 屬性。例如，如果對 `/products?price=asc` 發出請求，您可以透過以下方式存取 `price` 查詢參數：

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // Show products from the lowest price to the highest
    }
}
```

您也可以使用 [`ApplicationRequest.queryString()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html) 函式取得整個查詢字串。

## 主體內容 {id="body_contents"}
本節介紹如何接收隨 `POST`、`PUT` 或 `PATCH` 傳送的主體內容。

### 原始酬載 {id="raw"}

若要存取原始主體酬載並手動解析它，請使用接受要接收的酬載類型的 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函式。假設您有以下 HTTP 請求：

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

您可以透過以下其中一種方式，將此請求的主體接收為指定類型的物件：

-   **String**

    若要將請求主體接收為 String 值，請使用 `call.receive<String>()`。您也可以使用 [`.receiveText()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html) 達到相同的結果：
    ```kotlin
    post("/text") {
        val text = call.receiveText()
        call.respondText(text)
    }
    ```
-   **ByteArray**

    若要將請求主體接收為位元組陣列，請呼叫 `call.receive<ByteArray>()`：
    ```kotlin
            post("/bytes") {
                val bytes = call.receive<ByteArray>()
                call.respond(String(bytes))
            }
    
    ```
-   **ByteReadChannel**

    您可以使用 `call.receive<ByteReadChannel>()` 或 [`.receiveChannel()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html) 來接收 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它能夠非同步地讀取位元組序列：
    ```kotlin
    post("/channel") {
        val readChannel = call.receiveChannel()
        val text = readChannel.readRemaining().readString()
        call.respondText(text)
    }
    ```

    以下範例顯示如何使用 `ByteReadChannel` 上傳檔案：
    ```kotlin
    post("/upload") {
        val file = File("uploads/ktor_logo.png")
        call.receiveChannel().copyAndClose(file.writeChannel())
        call.respondText("A file is uploaded")
    }
    ```

> 有關 Ktor 頻道與 `RawSink`、`RawSource` 或 `OutputStream` 等類型之間的轉換，請參閱 [I/O 互通性](io-interoperability.md)。
>
{style="tip"}

> 您可以在此處找到完整範例：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 物件 {id="objects"}

Ktor 提供 [ContentNegotiation](server-serialization.md) 外掛來協商請求的媒體類型並將內容反序列化為所需類型的物件。

若要接收並轉換請求的內容，請呼叫接受資料類別作為參數的 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函式：

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 如需更多資訊，請參閱 [Ktor 伺服器中的內容協商與序列化](server-serialization.md)。

### 表單參數 {id="form_parameters"}
Ktor 允許您使用 [receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函式接收隨 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送的表單參數。以下範例顯示一個 [HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其中表單參數在主體中傳遞：
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

您可以透過以下方式在程式碼中取得參數值：
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 您可以在此處找到完整範例：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表單資料 {id="form_data"}

若要接收作為多部分請求一部分傳送的檔案，請呼叫
[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)
函式，然後根據需要迴圈處理每個部分。

多部分請求資料是依序處理的，因此您無法直接存取其特定部分。此外，
這些請求可能包含不同類型的部分，例如表單欄位、檔案或二進位資料，需要以不同的方式處理。

此範例演示如何接收檔案並將其儲存到檔案系統：

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

依預設，可接收的二進位和檔案項目的大小限制為 50MB。如果接收到的檔案
或二進位項目超過 50MB 限制，將拋出 `IOException`。

若要覆寫預設的表單欄位限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

在此範例中，新限制設定為 100MB。

#### 表單欄位

`PartData.FormItem` 代表一個表單欄位，其值可以透過 `value` 屬性存取：

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### 檔案上傳

`PartData.FileItem` 代表一個檔案項目。您可以將檔案上傳作為位元組串流處理：

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函式傳回一個 `ByteReadChannel`，它允許您遞增地讀取資料。
然後，使用 `.copyAndClose()` 函式，您將檔案內容寫入指定目的地，
同時確保適當的資源清理。

若要確定上傳的檔案大小，您可以在 `post` 處理器內部取得 `Content-Length` [標頭值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 資源清理

一旦表單處理完成，每個部分都會使用 `.dispose()` 函式進行釋放以釋出資源。

```kotlin
part.dispose()
```

> 若要了解如何執行此範例，請參閱
> [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。