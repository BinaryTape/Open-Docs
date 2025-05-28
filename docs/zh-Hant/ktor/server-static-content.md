[//]: # (title: 提供靜態內容)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
了解如何提供靜態內容，例如樣式表、腳本、圖片等。
</link-summary>

無論您是建立網站還是 HTTP 端點，您的應用程式很可能需要提供檔案，例如樣式表、腳本或圖片。
雖然 Ktor 確實可以載入檔案內容並將其[在回應中](server-responses.md)傳送給客戶端，但 Ktor 透過提供額外的函數來簡化此流程，以提供靜態內容。

使用 Ktor，您可以從[資料夾](#folders)、[ZIP 檔案](#zipped)和[嵌入式應用程式資源](#resources)提供內容。

## 資料夾 {id="folders"}

若要從本地檔案系統提供靜態檔案，請使用
[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)
函數。在此情況下，相對路徑會使用目前工作目錄解析。

 ```kotlin
 ```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="10-11,35"}

在上述範例中，來自 `/resources` 的任何請求都會對應到目前工作目錄中的 `files` 實體資料夾。
只要 URL 路徑和實體檔案名稱匹配，Ktor 就會遞迴地提供 `files` 中的任何檔案。

有關完整範例，請參閱
[static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)。

## ZIP 檔案 {id="zipped"}

為了從 ZIP 檔案提供靜態內容，Ktor 提供了 [
`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html) 函數。
這允許您將請求直接對應到 ZIP 壓縮檔的內容，如下列範例所示：

 ```kotlin
 ```

{src="snippets/static-zip/src/main/kotlin/com/example/Application.kt" include-lines="10,12,20"}

在此範例中，來自根 URL `/` 的任何請求都會直接對應到 `text-files.zip` ZIP 檔案的內容。

### 自動重新載入支援 {id="zip-auto-reload"}

`staticZip()` 函數也支援自動重新載入。如果在 ZIP 檔案的父目錄中偵測到任何變更，ZIP 檔案系統會在下一個請求時重新載入。這確保了所提供的內容保持最新，而無需重新啟動伺服器。

有關完整範例，請參閱
[static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)。

## 資源 {id="resources"}

若要從類別路徑提供內容，請使用
[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)
函數。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="8,9,17"}

這將來自 `/resources` 的任何請求對應到應用程式資源中的 `static` 套件。
在此情況下，只要 URL 路徑和資源路徑匹配，Ktor 就會遞迴地提供 `static` 套件中的任何檔案。

有關完整範例，請參閱
[static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)。

## 額外配置 {id="configuration"}

Ktor 為靜態檔案和資源提供了更多配置。

### 索引檔案 {id="index"}

如果存在名為 `index.html` 的檔案，當請求目錄時，Ktor 預設會提供該檔案。您可以使用 `index` 參數設定自訂索引檔案：

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="10"}

在此情況下，當請求 `/custom` 時，Ktor 會提供 `/custom_index.html`。

### 預先壓縮的檔案 {id="precompressed"}

Ktor 提供了提供預先壓縮檔案的能力，並避免使用[動態壓縮](server-compression.md)。
若要使用此功能，請在區塊語句內定義 `preCompressed()` 函數：

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,14,18"}

在此範例中，對於對 `/js/script.js` 的請求，Ktor 可以提供 `/js/script.js.br` 或 `/js/script.js.gz`。

### HEAD 請求 {id="autohead"}

`enableAutoHeadResponse()` 函數允許您自動回應靜態路由中每個具有 `GET` 定義的路徑的 `HEAD` 請求。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,13,16"}

### 預設檔案回應 {id="default-file"}

`default()` 函數提供了在靜態路由中，對於任何沒有對應檔案的請求，以檔案進行回應的能力。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12-13,18"}

在此範例中，當客戶端請求不存在的資源時，將會提供 `index.html` 檔案作為回應。

### 內容類型 {id="content-type"}

預設情況下，Ktor 會嘗試從檔案副檔名猜測 `Content-Type` 標頭的值。您可以使用
`contentType()` 函數明確設定 `Content-Type` 標頭。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,22-27,34"}

在此範例中，檔案 `html-file.txt` 的回應將具有 `Content-Type: text/html` 標頭，而對於其他所有檔案，將應用預設行為。

### 快取 {id="caching"}

`cacheControl()` 函數允許您配置用於 HTTP 快取的 `Cache-Control` 標頭。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="9-10,19,28-36,38-40"}

> 有關 Ktor 中快取的更多資訊，請參閱 [快取標頭](server-caching-headers.md)。
>
{style="tip"}

### 排除的檔案 {id="exclude"}

`exclude()` 函數允許您排除不被提供的檔案。當客戶端請求被排除的檔案時，伺服器將回應 `403 Forbidden` 狀態碼。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,21,34"}

### 檔案副檔名後備 {id="extensions"}

當找不到請求的檔案時，Ktor 可以將給定的副檔名添加到檔案名稱並搜尋它。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,12,16"}

在此範例中，當請求 `/index` 時，Ktor 將搜尋 `/index.html` 並提供找到的內容。

### 自訂修改 {id="modify"}

`modify()` 函數允許您對結果回應應用自訂修改。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,15-18"}

## 處理錯誤 {id="errors"}

如果找不到請求的內容，Ktor 將自動回應 `404 Not Found` HTTP 狀態碼。

若要了解如何配置錯誤處理，請參閱 [狀態頁面](server-status-pages.md)。