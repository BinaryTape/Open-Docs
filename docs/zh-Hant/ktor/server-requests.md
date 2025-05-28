[//]: # (title: 處理請求)

<show-structure for="chapter" depth="3"/>

<link-summary>了解如何在路由處理器中處理傳入的請求。</link-summary>

Ktor 允許您在[路由處理器](server-routing.md#define_route)內部處理傳入的請求並傳送[回應](server-responses.md)。在處理請求時，您可以執行各種操作：
*   取得[請求資訊](#request_information)，例如標頭、Cookie 等。
*   取得[路徑參數](#path_parameters)值。
*   取得[查詢字串](#query_parameters)的參數。
*   接收[內文內容](#body_contents)，例如資料物件、表單參數和檔案。

## 一般請求資訊 {id="request_information"}
在路由處理器中，您可以使用 [call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html) 屬性來存取請求。這會傳回 [ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 實例，並提供對各種請求參數的存取權限。例如，下面的程式碼片段展示了如何取得請求 URI：
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text) 方法用於將回應傳送回用戶端。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html) 物件允許您存取各種請求資料，例如：
*   標頭  
    若要存取所有請求標頭，請使用 [ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 屬性。您也可以使用專用的擴充函數（例如 `acceptEncoding`、`contentType`、`cacheControl` 等）來存取特定標頭。
*   Cookie  
    [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 屬性提供對與請求相關的 Cookie 的存取權限。若要了解如何使用 Cookie 處理會話，請參閱[會話](server-sessions.md)一節。
*   連線詳細資料  
    使用 [ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性來存取連線詳細資料，例如主機名稱、連接埠、方案等。
*   `X-Forwarded-` 標頭  
    若要取得有關透過 HTTP 代理伺服器或負載平衡器傳遞的請求資訊，請安裝 [](server-forward-headers.md) 外掛程式並使用 [ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性。

## 路徑參數 {id="path_parameters"}
處理請求時，您可以使用 `call.parameters` 屬性來存取[路徑參數](server-routing.md#path_parameter)值。例如，在下面的程式碼片段中，對於 `/user/admin` 路徑，`call.parameters["login"]` 將傳回 _admin_：
```kotlin
```
{src="snippets/_misc/RouteParameter.kt"}

## 查詢參數 {id="query_parameters"}

若要存取 <emphasis tooltip="query_string">查詢字串</emphasis> 的參數，您可以使用 [ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 屬性。例如，如果向 `/products?price=asc` 發出請求，您可以透過這種方式存取 `price` 查詢參數：

```kotlin
```
{src="snippets/_misc/QueryParameter.kt"}

您也可以使用 [ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html) 函數取得整個查詢字串。

## 內文內容 {id="body_contents"}
本節展示如何接收以 `POST`、`PUT` 或 `PATCH` 傳送的內文內容。

### 原始酬載 {id="raw"}

若要存取原始內文酬載並手動解析它，請使用接受要接收的酬載類型的 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函數。
假設您有以下 HTTP 請求：

```HTTP
```
{src="snippets/post-raw-data/post.http" include-lines="1-4"}

您可以透過以下其中一種方式，將此請求的內文作為指定類型的物件接收：

-   **字串**

    若要將請求內文作為字串值接收，請使用 `call.receive<String>()`。
    您也可以使用 [receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html) 達到相同的結果：
    ```kotlin
    ```
    {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="13-16"}
-   **位元組陣列**

    若要將請求內文作為位元組陣列接收，請呼叫 `call.receive<ByteArray>()`：
    ```kotlin
    ```
    {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="18-22"}
-   **ByteReadChannel**

    您可以使用 `call.receive<ByteReadChannel>()` 或 [receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html) 來接收 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)，它能實現位元組序列的非同步讀取：
    ```kotlin
    ```
    {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="23-27"}

    下面的範例展示了如何使用 `ByteReadChannel` 上傳檔案：
    ```kotlin
    ```
    {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

您可以在這裡找到完整範例：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### 物件 {id="objects"}
Ktor 提供一個 [ContentNegotiation](server-serialization.md) 外掛程式，用於協商請求的媒體類型並將內容反序列化為所需類型的物件。若要接收和轉換請求的內容，請呼叫接受資料類別作為參數的 [ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html) 函數：
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="38-42"}

您可以從 [](server-serialization.md) 中了解更多資訊。

### 表單參數 {id="form_parameters"}
Ktor 允許您使用 [receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html) 函數接收以 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送的表單參數。下面的範例展示了一個 [HTTP 用戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其中表單參數在內文中傳遞：
```HTTP
```
{src="snippets/post-form-parameters/post.http"}

您可以如下在程式碼中取得參數值：
```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="12-16"}

您可以在這裡找到完整範例：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### 多部分表單資料 {id="form_data"}

若要接收作為多部分請求一部分傳送的檔案，請呼叫
[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)
函數，然後根據需要遍歷每個部分。

多部分請求資料是按順序處理的，因此您無法直接存取其特定部分。此外，
這些請求可以包含不同類型的部分，例如表單欄位、檔案或二進位資料，需要以不同方式處理。

此範例展示了如何接收檔案並將其儲存到檔案系統：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="3-39"}

#### 預設檔案大小限制

預設情況下，可以接收的二進位和檔案項目的允許大小限制為 50MB。如果接收的檔案
或二進位項目超過 50MB 限制，將拋出 `IOException`。

若要覆寫預設的表單欄位限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="17"}

在此範例中，新限制設定為 100MB。

#### 表單欄位

`PartData.FormItem` 表示一個表單欄位，其值可以透過 `value` 屬性存取：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20-23,32"}

#### 檔案上傳

`PartData.FileItem` 表示一個檔案項目。您可以將檔案上傳作為位元組流處理：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20,25-29,32"}

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函數會傳回一個 `ByteReadChannel`，它允許您增量讀取資料。
使用 `.copyAndClose()` 函數，您可以將檔案內容寫入指定目的地，
同時確保適當的資源清理。

若要判斷上傳檔案的大小，您可以在 `post` 處理器中取得 `Content-Length` [標頭值](#request_information)：

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 資源清理

表單處理完成後，每個部分都會使用 `.dispose()` 函數來釋放資源。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="33"}

若要了解如何執行此範例，請參閱
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。