[//]: # (title: 提供静态内容)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
了解如何提供静态内容，例如样式表、脚本、图片等。
</link-summary>

无论您是创建网站还是 HTTP 端点，您的应用程序都可能需要提供文件，例如样式表、脚本或图片。
虽然 Ktor 确实可以加载文件内容并将其[在响应中发送](server-responses.md)给客户端，但 Ktor 通过提供额外的函数来简化此过程，以便提供静态内容。

借助 Ktor，您可以从[文件夹](#folders)、[ZIP 文件](#zipped)和[嵌入式应用程序资源](#resources)中提供内容。

## 文件夹 {id="folders"}

要从本地文件系统提供静态文件，请使用
[`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html)
函数。在此情况下，相对路径将使用当前工作目录进行解析。

 ```kotlin
 routing {
     staticFiles("/resources", File("files"))
 }
 ```

在上面的示例中，来自 `/resources` 的任何请求都映射到当前工作目录中的 `files` 物理文件夹。
只要 URL 路径和物理文件名匹配，Ktor 就会递归地提供 `files` 中的任何文件。

关于完整示例，请参见 [static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)。

## ZIP 文件 {id="zipped"}

要从 ZIP 文件提供静态内容，Ktor 提供了 [
`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html) 函数。
这允许您将请求直接映射到 ZIP 归档的内容，如下例所示：

 ```kotlin
 routing {
     staticZip("/", "", Paths.get("files/text-files.zip"))
 }
 ```

在此示例中，来自根 URL `/` 的任何请求都直接映射到 ZIP 文件 `text-files.zip` 的内容。

### 自动重新加载支持 {id="zip-auto-reload"}

`staticZip()` 函数还支持自动重新加载。如果在 ZIP 文件的父目录中检测到任何更改，ZIP 文件系统将在下一个请求时重新加载。这确保了所提供的内容保持最新，而无需服务器重新启动。

关于完整示例，请参见 [static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)。

## 资源 {id="resources"}

要从 classpath 提供内容，请使用
[`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html)
函数。

```kotlin
routing {
    staticResources("/resources", "static")
}
```

这会将来自 `/resources` 的任何请求映射到应用程序资源中的 `static` 包。
在此情况下，只要 URL 路径和资源路径匹配，Ktor 就会递归地提供 `static` 包中的任何文件。

关于完整示例，请参见 [static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)。

## 附加配置 {id="configuration"}

Ktor 为静态文件和资源提供了更多配置。

### 索引文件 {id="index"}

如果存在名为 `index.html` 的文件，Ktor 默认会在请求目录时提供该文件。您可以使用 `index` 参数设置自定义索引文件：

```kotlin
staticResources("/custom", "static", index = "custom_index.html")
```

在此情况下，当请求 `/custom` 时，Ktor 将提供 `/custom_index.html`。

### 预压缩文件 {id="precompressed"}

Ktor 提供了提供预压缩文件的能力，并避免使用[动态压缩](server-compression.md)。要使用此功能性，请在代码块语句中定义 `preCompressed()` 函数：

```kotlin
staticFiles("/", File("files")) {
    preCompressed(CompressedFileType.BROTLI, CompressedFileType.GZIP)
}
```

在此示例中，对于对 `/js/script.js` 发出的请求，Ktor 可以提供 `/js/script.js.br` 或 `/js/script.js.gz`。

### HEAD 请求 {id="autohead"}

`enableAutoHeadResponse()` 函数允许您自动响应静态路由内定义了 `GET` 的每个路径的 `HEAD` 请求。

```kotlin
staticResources("/", "static"){
    enableAutoHeadResponse()
}
```

### 默认文件响应 {id="default-file"}

`default()` 函数提供了在静态路由中没有相应文件时，用文件回复任何请求的能力。

```kotlin
staticFiles("/", File("files")) {
    default("index.html")
}
```

在此示例中，当客户端请求不存在的资源时，`index.html` 文件将作为响应提供。

### 内容类型 {id="content-type"}

默认情况下，Ktor 会尝试从文件扩展名猜测 `Content-Type` 标头的值。您可以使用 `contentType()` 函数显式设置 `Content-Type` 标头。

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

在此示例中，文件 `html-file.txt` 的响应将包含 `Content-Type: text/html` 标头，对于所有其他文件，将应用默认行为。

### 缓存 {id="caching"}

`cacheControl()` 函数允许您配置 HTTP 缓存的 `Cache-Control` 标头。

```kotlin
    install(ConditionalHeaders)
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

当安装了 [`ConditionalHeaders`](server-conditional-headers.md) 插件时，Ktor 可以提供带有 `ETag` 和 `LastModified` 标头的静态资源，并处理条件标头以避免在内容未更改时发送内容主体：

```kotlin
staticFiles("/filesWithEtagAndLastModified", File("files")) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

在此示例中，`etag` 和 `lastModified` 值根据每个资源动态计算，并应用于响应。

为了简化 `ETag` 生成，您还可以使用预定义提供者：

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", File("files")) {
    etag(ETagProvider.StrongSha256)
}
```

在此示例中，使用资源内容的 SHA‑256 散列生成一个强 `ETag`。
如果发生 I/O 错误，则不生成 `ETag`。

> 关于 Ktor 中缓存的更多信息，请参见 [Caching headers](server-caching-headers.md)。
>
{style="tip"}

### 排除文件 {id="exclude"}

`exclude()` 函数允许您排除文件不被提供。当客户端请求被排除的文件时，服务器将以 `403 Forbidden` 状态码响应。

```kotlin
staticFiles("/files", File("textFiles")) {
    exclude { file -> file.path.contains("excluded") }
}
```

### 文件扩展名回退 {id="extensions"}

当请求的文件未找到时，Ktor 可以将给定的扩展名添加到文件名并进行搜索。

```kotlin
staticResources("/", "static"){
    extensions("html", "htm")
}
```

在此示例中，当请求 `/index` 时，Ktor 将搜索 `/index.html` 并提供找到的内容。

### 自定义回退

要配置请求的静态资源未找到时的自定义回退行为，请使用 `fallback()` 函数。
借助 `fallback()`，您可以探查请求路径并决定如何响应。例如，您可以重定向到另一个资源、返回特定的 HTTP 状态，或提供替代文件。

您可以在 `staticFiles()`、`staticResources()`、`staticZip()` 或 `staticFileSystem()` 中添加 `fallback()`。回调提供了请求的路径和当前的 `ApplicationCall`。

以下示例展示了如何重定向某些扩展名、返回自定义状态或回退到 `index.html`：

```kotlin
staticFiles("/files", File("textFiles")) {
    fallback { requestedPath, call ->
        when {
            requestedPath.endsWith(".php") -> call.respondRedirect("/static/index.html") // absolute path
            requestedPath.endsWith(".kt") -> call.respondRedirect("Default.kt") // relative path
            requestedPath.endsWith(".xml") -> call.respond(HttpStatusCode.Gone)
            else -> call.respondFile(File("files/index.html"))
        }
    }
}
```

### 自定义修改 {id="modify"}

`modify()` 函数允许您对结果响应应用自定义修改。

```kotlin
staticFiles("/", File("files")) {
    modify { file, call ->
        call.response.headers.append(HttpHeaders.ETag, file.name.toString())
    }
}
```

## 错误处理 {id="errors"}

如果请求的内容未找到，Ktor 将自动以 `404 Not Found` HTTP 状态码响应。

要了解如何配置错误处理，请参见 [Status Pages](server-status-pages.md)。