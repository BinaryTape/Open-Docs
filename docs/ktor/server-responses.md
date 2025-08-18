[//]: # (title: 发送响应)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何发送不同类型的响应。</link-summary>

Ktor 允许您在 [路由处理程序](server-routing.md#define_route) 中处理传入的 [请求](server-requests.md) 并发送响应。您可以发送不同类型的响应：纯文本、HTML 文档和模板、序列化数据对象等等。对于每个响应，您还可以配置各种 [响应参数](#parameters)，例如内容类型、标头和 Cookie。

在路由处理程序内部，可用于处理响应的 API 如下：
* 一组旨在 [发送特定内容类型](#payload) 的函数，例如 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html)、[call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 等等。
* [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函数，允许您在响应中 [发送任何数据](#payload)。例如，通过启用的 [ContentNegotiation](server-serialization.md) 插件，您可以发送以特定格式序列化的数据对象。
* [call.response](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/response.html) 属性，它返回 [ApplicationResponse](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/index.html) 对象，该对象提供对 [响应参数](#parameters) 的访问，并允许您设置状态码、添加标头和配置 Cookie。
* [call.respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 提供添加重定向的功能。

## 设置响应负载 {id="payload"}
### 纯文本 {id="plain-text"}
要将纯文本作为响应发送，请使用 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html) 函数：
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktor 提供了两种主要方式向客户端发送 HTML 响应：
* 使用 Kotlin HTML DSL 构建 HTML。
* 使用 JVM 模板引擎，例如 FreeMarker、Velocity 等。

要发送使用 Kotlin DSL 构建的 HTML，请使用 [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 函数：
```kotlin
routing {
    get("/") {
        val name = "Ktor"
        call.respondHtml(HttpStatusCode.OK) {
            head {
                title {
                    +name
                }
            }
            body {
                h1 {
                    +"Hello from $name!"
                }
            }
        }
    }
}
```

要在响应中发送模板，请调用带有特定内容的 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函数...
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(FreeMarkerContent("index.ftl", mapOf("user" to sampleUser)))
}
```

...或使用相应的 [call.respondTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html) 函数：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
您可以从 [模板](server-templating.md) 帮助章节了解更多信息。

### 对象 {id="object"}
要在 Ktor 中启用数据对象序列化，您需要安装 [ContentNegotiation](server-serialization.md) 插件并注册所需的转换器（例如 JSON）。然后，您可以使用 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 函数在响应中传递数据对象：

```kotlin
routing {
    get("/customer/{id}") {
        val id: Int by call.parameters
        val customer: Customer = customerStorage.find { it.id == id }!!
        call.respond(customer)
```

您可以在此处找到完整示例：[json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

[//]: # (TODO: Check link for LocalPathFile)

### 文件 {id="file"}

要以文件内容响应客户端，您有两种选择：

- 对于 `File` 资源，请使用 [call.respondFile](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-file.html) 函数。
- 对于 `Path` 资源，请使用 `call.respond()` 函数以及 [LocalPathContent](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html) 类。

下面的代码示例展示了如何在响应中发送指定文件，并通过添加 `Content-Disposition` [标头](#headers) 使该文件可下载：

```kotlin
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.plugins.partialcontent.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.nio.file.Path

fun Application.main() {
    install(PartialContent)
    install(AutoHeadResponse)
    routing {
        get("/download") {
            val file = File("files/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }
        get("/downloadFromPath") {
            val filePath = Path.of("files/file.txt")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "file.txt")
                    .toString()
            )
            call.respond(LocalPathContent(filePath))
        }
    }
```

请注意，此示例安装了两个插件：
- [PartialContent](server-partial-content.md) 使服务器能够响应带有 `Range` 标头的请求，并仅发送部分内容。
- [AutoHeadResponse](server-autoheadresponse.md) 提供自动响应 `HEAD` 请求的功能，适用于每个定义了 `GET` 的路由。这允许客户端应用程序通过读取 `Content-Length` 标头值来确定文件大小。

有关完整的代码示例，请参见 [download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)。

### 原始负载 {id="raw"}
如果您需要发送原始主体负载，请使用 [call.respondBytes](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-bytes.html) 函数。

## 设置响应参数 {id="parameters"}
### 状态码 {id="status"}
要为响应设置状态码，请调用 [ApplicationResponse.status](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/status.html)。您可以传递一个预定义的状态码值...
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
...或指定自定义状态码：
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

请注意，用于发送 [负载](#payload) 的函数具有用于指定状态码的重载。

### 内容类型 {id="content-type"}
通过已安装的 [ContentNegotiation](server-serialization.md) 插件，Ktor 会自动为 [响应](#payload) 选择内容类型。如果需要，您可以通过传递相应的形参来手动指定内容类型。例如，下面的代码片段中的 `call.respondText` 函数接受 `ContentType.Text.Plain` 作为形参：
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### 标头 {id="headers"}
有几种方式可以在响应中发送特定标头：
* 将标头添加到 [ApplicationResponse.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/headers.html) 集合中：
   ```kotlin
   get("/") {
       call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* 调用 [ApplicationResponse.header](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/header.html) 函数：
   ```kotlin
   get("/") {
       call.response.header(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* 使用专门用于指定具体标头的函数，例如 `ApplicationResponse.etag`、`ApplicationResponse.link` 等等。
   ```kotlin
   get("/") {
       call.response.etag("7c876b7e")
   }
   ```
  
* 要添加自定义标头，请将其名称作为字符串值传递给上述任何函数，例如：
   ```kotlin
   get("/") {
       call.response.header("Custom-Header", "Some value")
   }
   ```

> 要将标准 `Server` 和 `Date` 标头添加到每个响应中，请安装 [DefaultHeaders](server-default-headers.md) 插件。
>
{type="tip"}

### Cookie {id="cookies"}
要配置在响应中发送的 Cookie，请使用 [ApplicationResponse.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/cookies.html) 属性：
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktor 还提供了使用 Cookie 处理会话的功能。您可以从 [会话](server-sessions.md) 章节了解更多信息。

## 重定向 {id="redirect"}
要生成重定向响应，请调用 [respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 函数：
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}
```