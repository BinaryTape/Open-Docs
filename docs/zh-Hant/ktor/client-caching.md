[//]: # (title: 緩存)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCache 外掛允許您將先前擷取到的資源儲存到記憶體或持久化緩存中。
</link-summary>

Ktor 用戶端提供了 [HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 外掛，允許您將先前擷取到的資源儲存到記憶體或持久化緩存中。

## 新增依賴 {id="add_dependencies"}
`HttpCache` 僅需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的依賴。

## 記憶體緩存 {id="memory_cache"}
若要安裝 `HttpCache`，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數中傳遞它：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

這足以讓用戶端將先前擷取到的資源儲存到記憶體緩存中。
例如，如果您對一個設定了 `Cache-Control` 標頭的資源發出兩個連續的 [請求](client-requests.md)，
用戶端將只執行第一個請求，並跳過第二個，因為資料已儲存到緩存中。

## 持久化緩存 {id="persistent_cache"}

Ktor 允許您透過實作 [CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 介面來建立持久化緩存。
在 JVM 上，您可以透過呼叫 [FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 函數來建立檔案儲存。

若要建立檔案緩存儲存，請將 `File` 實例傳遞給 `FileStorage` 函數。
然後，根據此儲存是用作共用緩存還是私有緩存，將所建立的儲存傳遞給 `publicStorage` 或 `privateStorage` 函數。

```kotlin
```
{src="snippets/client-caching/src/main/kotlin/com/example/Application.kt" include-lines="18-22,24"}

> 您可以在此處找到完整的範例：[client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。