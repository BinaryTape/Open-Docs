[//]: # (title: 服務靜態內容)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
了解如何服務靜態內容，例如樣式表、腳本、圖片等等。
</link-summary>

無論您是正在建立網站還是 HTTP 端點，您的應用程式很可能需要服務檔案，例如
樣式表、腳本或圖片。
雖然 Ktor 確實能夠載入檔案內容並[在回應中](server-responses.md)傳送給客戶端，但 Ktor 透過提供額外的函式來簡化此過程，以服務靜態內容。

使用 Ktor，您可以從[資料夾](#folders)、[ZIP 檔案](#zipped)
以及[嵌入式應用程式資源](#resources)服務內容。

## 資料夾 {id="folders"}

若要從本機檔案系統服務靜態檔案，請使用
[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)
函式。在此情況下，相對路徑會使用目前工作目錄解析。

 ```kotlin
 routing {
     staticFiles("/resources", File("files"))
 }
 ```

在上述範例中，任何來自 `/resources` 的請求都會映射到目前工作目錄中名為 `files` 的實體資料夾。
只要 URL 路徑和實體檔案名稱匹配，Ktor 就會遞迴地服務 `files` 中的任何檔案。

有關完整範例，
請參閱 [static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)。

## ZIP 檔案 {id="zipped"}

若要從 ZIP 檔案服務靜態內容，Ktor 提供了
[`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html) 函式。
這允許您將請求直接映射到 ZIP 壓縮檔的內容，如下列範例所示：

 ```kotlin
 routing {
     staticZip("/", "", Paths.get("files/text-files.zip"))
 }
 ```

在此範例中，任何來自根 URL `/` 的請求都會直接映射到 `text-files.zip` ZIP 檔案的內容。

### 自動重新載入支援 {id="zip-auto-reload"}

`staticZip()` 函式也支援自動重新載入。如果在 ZIP 檔案的父目錄中偵測到任何變更，ZIP 檔案系統會在下次請求時重新載入。這確保了服務的內容保持
最新，而無需伺服器重新啟動。

有關完整範例，
請參閱 [static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)。

## 資源 {id="resources"}

若要從類路徑服務內容，請使用
[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)
函式。

```kotlin
routing {
    staticResources("/resources", "static")
}
```

這會將任何來自 `/resources` 的請求映射到應用程式資源中的 `static` 套件。
在此情況下，只要 URL 路徑和資源路徑匹配，Ktor 就會遞迴地服務 `static` 套件中的任何檔案。

有關完整範例，
請參閱 [static-resources](https://github.ktor.io/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)。

## 額外配置 {id="configuration"}

Ktor 為靜態檔案和資源提供了更多配置。

### 索引檔案 {id="index"}

如果存在名為 `index.html` 的檔案，當請求目錄時，Ktor 預設會服務該檔案。您可以使用 `index` 參數設定自訂索引檔案：

```kotlin
staticResources("/custom", "static", index = "custom_index.html")
```

在此情況下，當請求 `/custom` 時，Ktor 會服務 `/custom_index.html`。

### 預壓縮檔案 {id="precompressed"}

Ktor 提供了服務預壓縮檔案並避免使用[動態壓縮](server-compression.md)的能力。
要使用此功能，請在區塊語句中定義 `preCompressed()` 函式：

```kotlin
staticFiles("/", File("files")) {
    preCompressed(CompressedFileType.BROTLI, CompressedFileType.GZIP)
}
```

在此範例中，對於對 `/js/script.js` 的請求，Ktor 可以服務 `/js/script.js.br` 或 `/js/script.js.gz`。

### HEAD 請求 {id="autohead"}

`enableAutoHeadResponse()` 函式允許您自動回應靜態路由中每個定義了 `GET` 的路徑的 `HEAD` 請求。

```kotlin
staticResources("/", "static"){
    enableAutoHeadResponse()
}
```

### 預設檔案回應 {id="default-file"}

`default()` 函式提供了為靜態路由中任何沒有對應檔案的請求回覆檔案的能力。

```kotlin
staticFiles("/", File("files")) {
    default("index.html")
}
```

在此範例中，當客戶端請求不存在的資源時，會將 `index.html` 檔案作為回應服務。

### 內容類型 {id="content-type"}

預設情況下，Ktor 會嘗試從檔案副檔名猜測 `Content-Type` 標頭的值。您可以使用
`contentType()` 函式來明確設定 `Content-Type` 標頭。

```kotlin
staticFiles("/files", File("textFiles")) {
    contentType { file ->
        when (file.name) {
            "html-file.txt" -> ContentType.Text.Html
            else -> null
        }
    }
}
```

在此範例中，檔案 `html-file.txt` 的回應將具有 `Content-Type: text/html` 標頭，而對於其他所有檔案，將應用預設行為。

### 快取 {id="caching"}

`cacheControl()` 函式允許您為 HTTP 快取配置 `Cache-Control` 標頭。

```kotlin
fun Application.module() {
    routing {
        staticFiles("/files", File("textFiles")) {
            cacheControl { file ->
                when (file.name) {
                    "file.txt" -> listOf(Immutable, CacheControl.MaxAge(10000))
                    else -> emptyList()
                }
            }
        }
    }
}
object Immutable : CacheControl(null) {
    override fun toString(): String = "immutable"
}
```

> 有關 Ktor 中快取的更多資訊，請參閱[快取標頭](server-caching-headers.md)。
>
{style="tip"}

### 排除的檔案 {id="exclude"}

`exclude()` 函式允許您排除不被服務的檔案。當客戶端請求排除的檔案時，
伺服器將以 `403 Forbidden` 狀態碼回應。

```kotlin
staticFiles("/files", File("textFiles")) {
    exclude { file -> file.path.contains("excluded") }
}
```

### 檔案副檔名回溯 {id="extensions"}

當找不到請求的檔案時，Ktor 可以將給定的副檔名新增到檔案名稱並搜尋它。

```kotlin
staticResources("/", "static"){
    extensions("html", "htm")
}
```

在此範例中，當請求 `/index` 時，Ktor 將搜尋 `/index.html` 並服務找到的內容。

### 自訂修改 {id="modify"}

`modify()` 函式允許您對結果回應應用自訂修改。

```kotlin
staticFiles("/", File("files")) {
    modify { file, call ->
        call.response.headers.append(HttpHeaders.ETag, file.name.toString())
    }
}
```

## 處理錯誤 {id="errors"}

如果找不到請求的內容，Ktor 將自動以 `404 Not Found` HTTP 狀態碼回應。

要了解如何配置錯誤處理，請參閱 [Status Pages](server-status-pages.md)。