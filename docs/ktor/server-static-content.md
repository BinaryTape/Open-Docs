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

无论您是创建网站还是 HTTP 端点，您的应用程序可能都需要提供文件，例如样式表、脚本或图片。
虽然 Ktor 确实可以加载文件内容并将其[在响应中发送](server-responses.md)给客户端，但 Ktor 通过提供额外的函数来简化提供静态内容的过程。

使用 Ktor，您可以从[文件夹](#folders)、[ZIP 文件](#zipped)和[嵌入式应用程序资源](#resources)提供内容。

## 文件夹 {id="folders"}

要从本地文件系统提供静态文件，请使用 [`staticFiles()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-files.html) 函数。在这种情况下，相对路径将使用当前工作目录进行解析。

 ```kotlin
 ```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="10-11,35"}

在上面的示例中，来自 `/resources` 的任何请求都映射到当前工作目录中的 `files` 物理文件夹。
只要 URL 路径和物理文件名匹配，Ktor 就会递归地从 `files` 中提供任何文件。

有关完整示例，请参阅 [static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)。

## ZIP 文件 {id="zipped"}

要从 ZIP 文件提供静态内容，Ktor 提供了 [
`staticZip()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-zip.html) 函数。
这允许您将请求直接映射到 ZIP 归档文件的内容，如下面的示例所示：

 ```kotlin
 ```

{src="snippets/static-zip/src/main/kotlin/com/example/Application.kt" include-lines="10,12,20"}

在此示例中，来自根 URL `/` 的任何请求都直接映射到 ZIP 文件 `text-files.zip` 的内容。

### 自动重载支持 {id="zip-auto-reload"}

`staticZip()` 函数还支持自动重载。如果在 ZIP 文件的父目录中检测到任何更改，ZIP 文件系统将在下一个请求时重新加载。这确保所提供的内容保持最新，而无需重新启动服务器。

有关完整示例，请参阅 [static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)。

## 资源 {id="resources"}

要从类路径 (classpath) 提供内容，请使用 [`staticResources()`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/static-resources.html) 函数。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="8,9,17"}

这会将来自 `/resources` 的任何请求映射到应用程序资源中的 `static` 包。
在这种情况下，只要 URL 路径和资源路径匹配，Ktor 就会递归地从 `static` 包中提供任何文件。

有关完整示例，请参阅 [static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)。

## 额外配置 {id="configuration"}

Ktor 为静态文件和资源提供了更多配置。

### 索引文件 {id="index"}

如果存在名为 `index.html` 的文件，当请求目录时，Ktor 默认会提供它。您可以使用 `index` 参数设置自定义索引文件：

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="10"}

在这种情况下，当请求 `/custom` 时，Ktor 会提供 `/custom_index.html`。

### 预压缩文件 {id="precompressed"}

Ktor 提供了提供预压缩文件并避免使用[动态压缩 (dynamic compression)](server-compression.md) 的能力。
要使用此功能，请在代码块内定义 `preCompressed()` 函数：

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,14,18"}

在此示例中，对于对 `/js/script.js` 的请求，Ktor 可以提供 `/js/script.js.br` 或 `/js/script.js.gz`。

### HEAD 请求 {id="autohead"}

`enableAutoHeadResponse()` 函数允许您自动响应静态路由中定义了 `GET` 的每个路径的 `HEAD` 请求。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,13,16"}

### 默认文件响应 {id="default-file"}

`default()` 函数提供了在静态路由中对任何没有相应文件的请求用文件进行回复的能力。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12-13,18"}

在此示例中，当客户端请求不存在的资源时，`index.html` 文件将作为响应提供。

### 内容类型 {id="content-type"}

默认情况下，Ktor 尝试从文件扩展名猜测 `Content-Type` 头的值。您可以使用 `contentType()` 函数显式设置 `Content-Type` 头。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,22-27,34"}

在此示例中，文件 `html-file.txt` 的响应将包含 `Content-Type: text/html` 头，对于所有其他文件将应用默认行为。

### 缓存 {id="caching"}

`cacheControl()` 函数允许您配置用于 HTTP 缓存 (HTTP caching) 的 `Cache-Control` 头。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="9-10,19,28-36,38-40"}

> 有关 Ktor 中缓存的更多信息，请参阅 [缓存头](server-caching-headers.md)。
>
{style="tip"}

### 排除文件 {id="exclude"}

`exclude()` 函数允许您排除不提供服务的文件。当客户端请求被排除的文件时，服务器将以 `403 Forbidden` 状态码响应。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="19,21,34"}

### 文件扩展名回退 {id="extensions"}

当请求的文件未找到时，Ktor 可以向文件名添加给定的扩展名并进行搜索。

```kotlin
```

{src="snippets/static-resources/src/main/kotlin/com/example/Application.kt" include-lines="11,12,16"}

在此示例中，当请求 `/index` 时，Ktor 将搜索 `/index.html` 并提供找到的内容。

### 自定义修改 {id="modify"}

`modify()` 函数允许您对结果响应应用自定义修改。

```kotlin
```

{src="snippets/static-files/src/main/kotlin/com/example/Application.kt" include-lines="12,15-18"}

## 错误处理 {id="errors"}

如果请求的内容未找到，Ktor 将自动响应 `404 Not Found` HTTP 状态码。

要了解如何配置错误处理，请参阅 [Status Pages](server-status-pages.md)。