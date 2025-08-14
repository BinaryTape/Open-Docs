[//]: # (title: 快取)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
HttpCache 外掛允許您將先前擷取的資源儲存在記憶體內或持久性快取中。
</link-summary>

Ktor 用戶端提供 [HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 外掛，允許您將先前擷取的資源儲存在記憶體內或持久性快取中。

## 新增依賴項 {id="add_dependencies"}
`HttpCache` 僅需要 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定的依賴項。

## 記憶體內快取 {id="memory_cache"}
要安裝 `HttpCache`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

這足以使用戶端能夠將先前擷取的資源儲存在記憶體內快取中。
例如，如果您對具有已配置 `Cache-Control` 標頭的資源發出兩個連續的 [請求](client-requests.md)，
用戶端只會執行第一個請求並跳過第二個，因為資料已儲存在快取中。

## 持久性快取 {id="persistent_cache"}

Ktor 允許您透過實作 [CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 介面來建立持久性快取。
在 JVM 上，您可以透過呼叫 [FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 函式來建立檔案儲存。

要建立檔案快取儲存，請將 `File` 實例傳遞給 `FileStorage` 函式。
然後，將建立的儲存傳遞給 `publicStorage` 或 `privateStorage` 函式，具體取決於此儲存是用作共用還是私有快取。

[object Promise]

> 您可以在此處找到完整範例：[client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。