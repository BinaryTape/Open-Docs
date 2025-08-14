[//]: # (title: 處理請求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由處理器中處理傳入請求。</link-summary>

Ktor 允許你在[路由處理器](server-routing.md#define_route)內部處理傳入請求並傳送[響應](server-responses.md)。在處理請求時，你可以執行各種操作：
* 獲取[請求資訊](#request_information)，例如標頭 (headers)、Cookie 等等。
* 獲取[路徑參數](#path_parameters)值。
* 獲取[查詢字串](#query_parameters)的參數。
* 接收[主體內容](#body_contents)，例如資料物件、表單參數和檔案。

## 一般請求資訊 {id="request_information"}
在路由處理器內部，你可以使用 [call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html) 屬性來存取請求。這會返回 [ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 實例並提供對各種請求參數的存取。例如，下面的程式碼片段展示了如何獲取請求 URI：
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text) 方法用於將響應傳送回客戶端。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 物件允許你存取各種請求資料，例如：
* 標頭 (Headers)
  若要存取所有請求標頭，請使用 [ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 屬性。你也可以使用專用的擴充函式來存取特定的標頭，例如 `acceptEncoding`、`contentType`、`cacheControl` 等等。
* Cookie
  [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 屬性提供對與請求相關的 Cookie 的存取。要了解如何使用 Cookie 處理會話，請參閱 [Sessions](server-sessions.md) 章節。
* 連線詳細資訊
  使用 [ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性來存取連線詳細資訊，例如主機名稱、連接埠、scheme 等等。
* `X-Forwarded-` 標頭
  若要獲取通過 HTTP 代理或負載平衡器傳遞的請求資訊，請安裝 [](server-forward-headers.md) 插件並使用 [ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性。

## 路徑參數 {id="path_parameters"}
在處理請求時，你可以使用 `call.parameters` 屬性來存取[路徑參數](server-routing.md#path_parameter)值。例如，下面的程式碼片段中，對於 `/user/admin` 路徑，`call.parameters["login"]` 將返回 _admin_：
[object Promise]

## 查詢參數 {id="query_parameters"}

若要存取<emphasis tooltip="query_string">查詢字串</emphasis>的參數，你可以使用 [ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 屬性。例如，如果請求是發送到 `/products?price=asc`，你可以透過這種方式存取 `price` 查詢參數：

[object Promise]

你也可以使用 [ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html) 函式來獲取整個查詢字串。

## 主體內容 {id="body_contents"}
本節展示了如何接收隨 `POST`、`PUT` 或 `PATCH` 傳送的主體內容。

### 原始負載 {id="raw"}

若要存取原始主體負載並手動解析它，請使用 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函式，它接受要接收的負載類型。
假設你有以下 HTTP 請求：

[object Promise]

你可以透過以下方式之一將此請求的主體作為指定類型的物件接收：

- **String (字串)**

   若要將請求主體作為 String 值接收，請使用 `call.receive<String>()`。
   你也可以使用 [receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html) 達到相同的結果：
   [object Promise]
- **ByteArray (位元組陣列)**

   若要將請求主體作為位元組陣列接收，請呼叫 `call.receive<ByteArray>()`：
   [object Promise]
- **ByteReadChannel (位元組讀取通道)**

   你可以使用 `call.receive<ByteReadChannel>()` 或 [receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html) 來接收 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它支援位元組序列的非同步讀取：
   [object Promise]

   下面的範例展示了如何使用 `ByteReadChannel` 上傳檔案：
   [object Promise]

你可以在這裡找到完整範例：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 物件 {id="objects"}
Ktor 提供了一個 [ContentNegotiation](server-serialization.md) 插件，用於協商請求的媒體類型並將內容反序列化為所需類型的物件。若要接收並轉換請求的內容，請呼叫 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函式，它接受一個資料類別作為參數：
[object Promise]

你可以從 [](server-serialization.md) 了解更多資訊。

### 表單參數 {id="form_parameters"}
Ktor 允許你使用 [receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函式接收以 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送的表單參數。以下範例展示了一個 [HTTP client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其中表單參數透過主體傳遞：
[object Promise]

你可以在程式碼中如下獲取參數值：
[object Promise]

你可以在這裡找到完整範例：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表單資料 {id="form_data"}

若要接收作為多部分請求一部分傳送的檔案，請呼叫
`.receiveMultipart()` 函式，然後根據需要遍歷每個部分。

多部分請求資料是按順序處理的，因此你無法直接存取其特定部分。此外，
這些請求可以包含不同類型的部分，例如表單欄位、檔案或二進位資料，它們需要
以不同的方式處理。

此範例演示了如何接收檔案並將其儲存到檔案系統：

[object Promise]

#### 預設檔案大小限制

預設情況下，可以接收的二進位和檔案項的允許大小限制為 50MB。如果接收到的檔案
或二進位項超過 50MB 限制，則會拋出 `IOException`。

若要覆寫預設的表單欄位限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

[object Promise]

在此範例中，新限制設定為 100MB。

#### 表單欄位

`PartData.FormItem` 代表一個表單欄位，其值可以透過 `value` 屬性存取：

[object Promise]

#### 檔案上傳

`PartData.FileItem` 代表一個檔案項。你可以將檔案上傳作為位元組流處理：

[object Promise]

[`().provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函式返回一個 `ByteReadChannel`，它允許你增量讀取資料。
使用 `.copyAndClose()` 函式，你隨後將檔案內容寫入指定的目的地，
同時確保資源正確清理。

若要確定上傳的檔案大小，你可以在 `post` 處理器中獲取 `Content-Length` [標頭值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 資源清理

表單處理完成後，每個部分都使用 `.dispose()` 函式進行處理，以釋放資源。

[object Promise]

若要了解如何執行此範例，請參閱
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。