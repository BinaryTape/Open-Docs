[//]: # (title: 缓存)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCache 插件允许您将先前获取的资源保存在内存或持久化缓存中。
</link-summary>

Ktor 客户端提供了 [HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 插件，该插件允许您将先前获取的资源保存在内存或持久化缓存中。

## 添加依赖 {id="add_dependencies"}
`HttpCache` 只需要 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定的依赖项。

## 内存缓存 {id="memory_cache"}
要安装 `HttpCache`，请在[客户端配置块](client-create-and-configure.md#configure-client)内将其传递给 `install` 函数：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

这足以使客户端能够将先前获取的资源保存在内存缓存中。例如，如果您对配置了 `Cache-Control` 头的资源发出两次连续的[请求](client-requests.md)，客户端只会执行第一个请求并跳过第二个请求，因为数据已保存在缓存中。

## 持久化缓存 {id="persistent_cache"}

Ktor 允许您通过实现 [CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 接口来创建持久化缓存。在 JVM 上，您可以通过调用 [FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 函数来创建文件存储。

要创建文件缓存存储，请将 `File` 实例传递给 `FileStorage` 函数。然后，根据此存储是用作共享缓存还是私有缓存，将创建的存储传递给 `publicStorage` 或 `privateStorage` 函数。

```kotlin
```
{src="snippets/client-caching/src/main/kotlin/com/example/Application.kt" include-lines="18-22,24"}

> 您可以在此处找到完整示例：[client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching)。