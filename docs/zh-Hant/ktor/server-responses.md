[//]: # (title: 傳送回應)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何傳送不同類型的回應。</link-summary>

Ktor 允許您在 [路由處理器](server-routing.md#define_route) 內部處理傳入的 [請求](server-requests.md) 並傳送回應。您可以傳送不同類型的回應：純文字、HTML 文件和模板、序列化資料物件等等。對於每個回應，您還可以配置各種 [回應參數](#parameters)，例如內容類型、標頭和 Cookie。

在路由處理器內部，可使用以下 API 來處理回應：
*   一組用於 [傳送特定內容類型](#payload) 的函式，例如 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html)、[call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 等等。
*   [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函式，允許您在回應中 [傳送任何資料](#payload)。例如，啟用 [ContentNegotiation](server-serialization.md) 外掛程式後，您可以傳送以特定格式序列化的資料物件。
*   [call.response](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/response.html) 屬性，會回傳 [ApplicationResponse](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/index.html) 物件，該物件提供對 [回應參數](#parameters) 的存取，並允許您設定狀態碼、新增標頭和配置 Cookie。
*   [call.respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 提供新增重新導向的功能。

## 設定回應負載 {id="payload"}
### 純文字 {id="plain-text"}
若要在回應中傳送純文字，請使用 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html) 函式：
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktor 提供兩種主要方式向用戶端傳送 HTML 回應：
*   透過使用 Kotlin HTML DSL 建構 HTML。
*   透過使用 JVM 模板引擎，例如 FreeMarker、Velocity 等。

若要使用 Kotlin DSL 建構 HTML 並傳送，請使用 [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 函式：
```kotlin
```
{src="snippets/html/src/main/kotlin/com/example/Application.kt" include-lines="12-28"}

若要在回應中傳送模板，請呼叫 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函式並指定特定內容 ...
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}

... 或使用適當的 [call.respondTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html) 函式：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
您可以從 [](server-templating.md) 說明章節了解更多。

### 物件 {id="object"}
若要啟用 Ktor 中資料物件的序列化，您需要安裝 [ContentNegotiation](server-serialization.md) 外掛程式並註冊所需的轉換器 (例如 JSON)。然後，您可以使用 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函式在回應中傳遞資料物件：

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="32-36"}

您可以在此處找到完整的範例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

[//]: # (TODO: Check link for LocalPathFile)

### 檔案 {id="file"}

若要向用戶端回應檔案內容，您有兩種選擇：

-   對於 `File` 資源，請使用 [call.respondFile](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-file.html) 函式。
-   對於 `Path` 資源，請搭配 [LocalPathContent](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html) 類別使用 `call.respond()` 函式。

下面程式碼範例展示了如何在回應中傳送指定檔案，並透過新增 `Content-Disposition` [標頭](#headers) 使此檔案可供下載：

```kotlin
```
{src="snippets/download-file/src/main/kotlin/com/example/DownloadFile.kt" include-lines="3-35"}

請注意，此範例安裝了兩個外掛程式：
-   [PartialContent](server-partial-content.md) 使伺服器能夠回應帶有 `Range` 標頭的請求並僅傳送部分內容。
-   [AutoHeadResponse](server-autoheadresponse.md) 提供自動回應 `HEAD` 請求的能力，適用於每個定義了 `GET` 的路由。這允許用戶端應用程式透過讀取 `Content-Length` 標頭值來確定檔案大小。

如需完整程式碼範例，請參閱 [download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)。

### 原始負載 {id="raw"}
如果您需要傳送原始的身體負載，請使用 [call.respondBytes](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-bytes.html) 函式。

## 設定回應參數 {id="parameters"}
### 狀態碼 {id="status"}
若要為回應設定狀態碼，請呼叫 [ApplicationResponse.status](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/status.html)。您可以傳遞預定義的狀態碼值 ...
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
... 或指定自訂狀態碼：
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

請注意，用於傳送 [負載](#payload) 的函式具有用於指定狀態碼的重載。

### 內容類型 {id="content-type"}
透過已安裝的 [ContentNegotiation](server-serialization.md) 外掛程式，Ktor 會自動為 [回應](#payload) 選擇內容類型。如果需要，您可以透過傳遞相應參數來手動指定內容類型。例如，下面程式碼片段中的 `call.respondText` 函式接受 `ContentType.Text.Plain` 作為參數：
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### 標頭 {id="headers"}
有幾種方式可以在回應中傳送特定標頭：
*   將標頭新增至 [ApplicationResponse.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/headers.html) 集合：
    ```kotlin
    get("/") {
        call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
    }
    ```
*   呼叫 [ApplicationResponse.header](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/header.html) 函式：
    ```kotlin
    get("/") {
        call.response.header(HttpHeaders.ETag, "7c876b7e")
    }
    ```
*   使用專門用於指定具體標頭的函式，例如 `ApplicationResponse.etag`、`ApplicationResponse.link` 等。
    ```kotlin
    get("/") {
        call.response.etag("7c876b7e")
    }
    ```
*   若要新增自訂標頭，請將其名稱作為字串值傳遞給上述任何函式，例如：
    ```kotlin
    get("/") {
        call.response.header("Custom-Header", "Some value")
    }
    ```

> 若要將標準的 `Server` 和 `Date` 標頭新增到每個回應中，請安裝 [DefaultHeaders](server-default-headers.md) 外掛程式。
>
{type="tip"}

### Cookie {id="cookies"}
若要配置在回應中傳送的 Cookie，請使用 [ApplicationResponse.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/cookies.html) 屬性：
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktor 也提供使用 Cookie 處理會話的能力。您可以從 [會話 (Sessions)](server-sessions.md) 章節了解更多。

## 重新導向 {id="redirect"}
若要產生重新導向回應，請呼叫 [respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 函式：
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}
```