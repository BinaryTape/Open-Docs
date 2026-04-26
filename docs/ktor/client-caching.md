[//]: # (title: 缓存)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCache 插件允许您将之前获取的资源保存在内存或持久化缓存中。
</link-summary>

Ktor 客户端提供了 [HttpCache](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 插件，允许您将之前获取的资源保存在内存或持久化缓存中。

## 添加依赖项 {id="add_dependencies"}
`HttpCache` 只需要 [ktor-client-core](client-dependencies.md) 构件，不需要任何特定依赖项。

## 内存缓存 {id="memory_cache"}
要安装 `HttpCache`，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

这足以让客户端在内存缓存中保存之前获取的资源。
例如，如果您对配置了 `Cache-Control` 标头的资源执行两次连续 [请求](client-requests.md)，客户端将仅执行第一次请求并跳过第二次，因为数据已经保存在缓存中。

## 持久化缓存 {id="persistent_cache"}

Ktor 允许您通过实现 [CacheStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 接口来创建持久化缓存。
在 JVM 上，您可以通过调用 [FileStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 函数来创建文件存储。

要创建文件缓存存储，请将 `File` 实例传递给 `FileStorage` 函数。
然后，根据此存储是作为共享缓存还是私有缓存使用，将创建的存储传递给 `publicStorage` 或 `privateStorage` 函数。

```kotlin
val client = HttpClient(CIO) {
    install(HttpCache) {
        val cacheFile = Files.createDirectories(Paths.get("build/cache")).toFile()
        publicStorage(FileStorage(cacheFile))
    }
}
```

> 您可以在此处找到完整示例：[client-caching](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-caching)。