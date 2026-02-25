[//]: # (title: 快取)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCache 外掛程式允許您將先前擷取的資源儲存在記憶體內或持久化快取中。
</link-summary>

Ktor 用戶端提供 [HttpCache](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 外掛程式，允許您將先前擷取的資源儲存在記憶體內或持久化快取中。

## 新增相依性 {id="add_dependencies"}
`HttpCache` 只需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的相依性。

## 記憶體內快取 {id="memory_cache"}
要安裝 `HttpCache`，請將其傳遞給 [用戶端組態區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

這足以讓用戶端將先前擷取的資源儲存在記憶體內快取中。
例如，如果您對具有配置 `Cache-Control` 標頭的資源進行兩次連續的 [請求](client-requests.md)，
由於資料已儲存在快取中，用戶端僅執行第一個請求並跳過第二個請求。

## 持久化快取 {id="persistent_cache"}

Ktor 允許您透過實作 [CacheStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 介面來建立持久化快取。
在 JVM 上，您可以透過呼叫 [FileStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 函式來建立檔案存儲。

要建立檔案快取存儲，請將 `File` 執行個體傳遞給 `FileStorage` 函式。
然後，根據此存儲是用作共用快取還是私有快取，將建立的存儲傳遞給 `publicStorage` 或 `privateStorage` 函式。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCache) {
        val cacheFile = Files.createDirectories(Paths.get("build/cache")).toFile()
        publicStorage(FileStorage(cacheFile))
    }
}
```

> 您可以在此處找到完整的範例：[client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。