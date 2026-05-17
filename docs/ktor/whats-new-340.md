[//]: # (title: Ktor 3.4.0 最新变化)

<show-structure for="chapter,procedure" depth="2"/>

_[发布日期：2026 年 1 月 23 日](releases.md#release-details)_

Ktor 3.4.0 在服务器、客户端和工具方面带来了一系列增强功能。以下是此功能版本的亮点：

* [Zstd 压缩支持](#zstd-compression-support)
* [Http 请求生命周期](#http-request-lifecycle)
* [运行时 OpenAPI 路由注解](#runtime-openapi-route-annotations)
* [OkHttp 的双工流](#duplex-streaming-for-okhttp)

## Ktor 服务器

### 针对错误处理的 OAuth 回退

Ktor 3.4.0 为 [OAuth](server-oauth.md) 身份验证提供程序引入了新的 [`fallback()`](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-authentication-provider/-config/fallback.html) 函数。
当 OAuth 流程因 `AuthenticationFailedCause.Error`（例如令牌交换失败、网络问题或响应解析错误）而失败时，将调用该回退。

以前，您可能会在受 OAuth 保护的路由上使用 `authenticate(optional = true)` 来绕过 OAuth 失败。
然而，可选身份验证仅在未提供凭据时抑制质询，并不涵盖实际的 OAuth 错误。

新的 `fallback()` 函数为处理这些场景提供了专用机制。如果回退未处理该调用，Ktor 将返回 `401 Unauthorized`。

要配置回退，请在 `oauth` 块内定义它：

```kotlin
install(Authentication) {
    oauth("login") {
        client = ...
        urlProvider = ...
        settings = ...
        fallback = { cause ->
            if (cause is OAuth2RedirectError) {
                respondRedirect("/login-after-fallback")
            } else {
                respond(HttpStatusCode.Forbidden, cause.message)
            }
        }
    }
}
```

### 静态 OAuth 提供程序设置

Ktor 3.4.0 为 [OAuth](server-oauth.md) 身份验证提供程序引入了 `settings` 属性。可以使用它直接在 `oauth` 块中配置静态 OAuth 提供程序设置。对于静态提供程序配置，建议优先使用 `settings` 而非 `providerLookup`，因为这允许 Ktor 为生成的 [OpenAPI 规范](openapi-spec-generation.md)推断元数据。

`providerLookup` 属性仍然可用于为特定调用动态解析 OAuth 设置。

### Zstd 压缩支持

[Compression](server-compression.md) 插件现在支持 [Zstd](https://github.com/facebook/zstd) 压缩。

`Zstd` 是一种快速压缩算法，提供高压缩率和低压缩时间，并具有可配置的压缩级别。 

要启用它，请将 `ktor-server-compression-zstd` 依赖项添加到您的项目中：
```kotlin
implementation("io.ktor:ktor-server-compression-zstd:$ktor_version")
```

然后，在 `install(Compression) {}` 块中使用所需的配置调用 `zstd()` 函数：

```kotlin
install(Compression) {
    gzip()
    deflate()
    zstd(level = 3)
    identity()
}
```

### 配置文件中的 SSL 信任库设置

Ktor 现在允许您使用应用程序配置文件为服务器配置额外的 [SSL 设置](server-ssl.md#config-file)。您可以直接在配置中指定信任库、其相应的密码以及启用的 TLS 协议列表。

您可以在 `ktor.security.ssl` 部分下定义这些设置：

```kotlin
// application.conf
ktor {
    security {
        ssl {
            // ...
            trustStore = truststore.jks
            trustStorePassword = foobar
            enabledProtocols = ["TLSv1.2", "TLSv1.3"]
        }
    }
}
```

在上面的代码中：
- `trustStore` – 包含受信任证书的信任库文件的路径。
- `trustStorePassword` – 信任库的密码。
- `enabledProtocols` – 允许的 TLS 协议列表。

### 用于部分响应的 HTML 片段

Ktor 现在提供了一个新的 [`.respondHtmlFragment()`](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html-fragment.html) 函数，用于发送部分 HTML 响应。这在生成不需要完整 `<html>` 文档的标记时非常有用，例如使用 HTMX 等工具进行动态 UI 更新。

新的 API 是 [HTML DSL](server-html-dsl.md) 插件的一部分，允许您返回以任何元素为根的 HTML：

```kotlin
get("/books.html") {
    call.respondHtmlFragment {
        div("books") {
            for (book in library.books()) {
                bookItem()
            }
        }
    }
}
```

### HTTP 请求生命周期

新的 [`HttpRequestLifecycle` 插件](server-http-request-lifecycle.md)允许您在客户端断开连接时取消正在处理的 HTTP 请求。
当您需要在客户端断开连接时取消长时间运行或资源密集型的正在处理的 HTTP 请求时，这非常有用。 

通过安装 `HttpRequestLifecycle` 插件并设置 `cancelCallOnClose = true` 来启用此功能：

```kotlin
install(HttpRequestLifecycle) {
    cancelCallOnClose = true
}

routing {
    get("/long-process") {
        try {
            while (isActive) {
                delay(10_000)
                logger.info("Very important work.")
            }
            call.respond("Completed")
        } catch (e: CancellationException) {
            logger.info("Cleaning up resources.")
        }
    }
}
```

当客户端断开连接时，处理请求的协程将被取消，结构化并发将处理所有资源的清理工作。由请求启动的任何 `launch` 或 `async` 协程也会被取消。
目前仅 `Netty` 和 `CIO` 引擎支持此功能。

### 响应资源的新方法

新的 [`call.respondResource()`](server-responses.md#resource) 方法的工作方式与 [`call.respondFile()`](server-responses.md#file) 类似，但它接受资源而不是文件作为响应。

要从类路径提供单个资源，请使用 `call.respondResource()` 并指定资源路径：

```kotlin
routing {
    get("/resource") {
        call.respondResource("public/index.html")
    }
}
```

### 运行时 OpenAPI 路由注解

<primary-label ref="experimental"/>

Ktor 3.4.0 引入了 `ktor-server-routing-openapi` 模块，它允许您使用运行时注解直接将 OpenAPI 元数据附加到路由。这些注解在运行时应用于路由并成为路由树的一部分，从而使其可用于 OpenAPI 相关的工具。

该 API 是实验性的，需要使用 `@OptIn(ExperimentalKtorApi::class)` 进行选择性启用。

要在运行时向路由添加元数据，请使用 `.describe {}` 扩展函数：

```kotlin
@OptIn(ExperimentalKtorApi::class)
get("/messages") {
    val query = call.parameters["q"]?.let(::parseQuery)
    call.respond(messageRepository.getMessages(query))
}.describe {
    parameters {
        query("q") {
            description = "An encoded query"
            required = false
        }
    }
    responses {
        HttpStatusCode.OK {
            description = "A list of messages"
            schema = jsonSchema<List<Message>>()
            extension("x-sample-message", testMessage)
        }
        HttpStatusCode.BadRequest {
            description = "Invalid query"
            ContentType.Text.Plain()
        }
    }
    summary = "get messages"
    description = "Retrieves a list of messages."
}
```

您可以将此 API 作为独立的扩展程序使用，也可以与 Ktor 的 OpenAPI 编译器插件结合使用以自动生成这些调用。[OpenAPI](server-openapi.md) 和 [SwaggerUI](server-swagger-ui.md) 插件在构建 OpenAPI 规范时也会读取这些元数据。

> 在 Ktor 3.4.0 中，`SwaggerUI` 和 `OpenAPI` 插件现在需要 `ktor-server-routing-openapi` 依赖项。
> 这不是故意的破坏性更改，将在 3.4.1 版本中修复。
> 如果您使用这两个插件中的任何一个，请手动添加该依赖项以避免运行时错误。
> 
{style="warning"}

有关更多详情和示例，请参阅[运行时路由注解](openapi-spec-generation.md#runtime-route-annotations)。

### API Key 身份验证

新的 [API Key 身份验证插件](server-api-key-auth.md)允许您使用随每个请求传递的共享密钥（通常在 HTTP 标头中）来保护服务器路由。

`apiKey` 提供程序与 Ktor 的[身份验证插件](server-auth.md)集成，让您可以使用自定义逻辑验证传入的 API 密钥、自定义标头名称，并使用标准的 `authenticate` 块保护特定路由：

```kotlin
install(Authentication) {
    apiKey("my-api-key") {
        validate { apiKey ->
            if (apiKey == "secret-key") {
                UserIdPrincipal(apiKey)
            } else {
                null
            }
        }
    }
}

routing {
    authenticate {
        get("/") {
            val principal = call.principal<UserIdPrincipal>()!!
            call.respondText("Key: ${principal.key}")
        }
    }
}
```
API Key 身份验证可用于服务间通信以及其他轻量级身份验证机制足以满足要求的场景。

有关更多详情和配置选项，请参阅 [API Key 身份验证](server-api-key-auth.md)。

## 核心

### 多标头解析

新的 [`Headers.getSplitValues()`](https://api.ktor.io/ktor-http/io.ktor.http/get-split-values.html) 函数简化了对单行中包含多个值的标头的处理。

`getSplitValues()` 函数返回给定标头的所有值，并使用指定的分隔符（默认为 `,`）对其进行拆分：

```kotlin
val headers = headers {
    append("X-Multi-Header", "1, 2")
    append("X-Multi-Header", "3")
}

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```
默认情况下，双引号字符串内的分隔符会被忽略，但您可以通过设置 `splitInsideQuotes = true` 来更改此行为：

```kotlin
val headers = headers {
    append("X-Multi-Header", """a,"b,c",d""")
}

val forceSplit = headers.getSplitValues("X-Quoted", splitInsideQuotes = true)
// ["a", "\"b", "c\"", "d"]
```

## Ktor 客户端

### 身份验证令牌缓存控制

在 Ktor 3.4.0 之前，使用 [Basic](client-basic-auth.md) 和 [Bearer 身份验证](client-bearer-auth.md)提供程序的应用程序在用户注销或更新其身份验证数据后可能会继续发送过时的令牌或凭据。发生这种情况是因为每个提供程序都会通过负责存储已加载身份验证令牌的内部组件，在内部缓存 `loadTokens()` 函数的结果，并且该缓存会一直保持活动状态，直到手动清除。

Ktor 3.4.0 引入了新的函数和配置选项，让您可以显式且便捷地控制令牌缓存行为。

#### 访问和清除身份验证令牌

您现在可以直接从客户端访问身份验证提供程序，并在需要时清除其缓存的令牌。

To clear the token for a specific provider, use the `.clearToken()` function:
要清除特定提供程序的令牌，请使用 `.clearToken()` 函数：

```kotlin
val provider = client.authProvider<BearerAuthProvider>()
provider?.clearToken()
```

检索所有身份验证提供程序：

```kotlin
val providers = client.authProviders
```

要从所有支持令牌清除的提供程序（目前为 Basic 和 Bearer）中清除缓存的令牌，请使用 `HttpClient.clearAuthTokens()` 函数：

```kotlin
 // 注销时清除所有缓存的身份验证令牌
fun logout() {
    client.clearAuthTokens()
    storage.deleteTokens()
}

// 凭据更新时清除缓存的身份验证令牌
fun updateCredentials(new: Credentials) {
    storage.save(new)
    client.clearAuthTokens()  // 强制重新加载
}
```

#### 配置令牌缓存行为

Basic 和 Bearer 身份验证提供程序都添加了一个新的 `cacheTokens` 配置选项。这允许您控制是否应在请求之间缓存令牌或凭据。

例如，您可以在动态提供凭据时禁用缓存：

```kotlin
basic {
    cacheTokens = false  // 在每个请求上加载凭据
    credentials {
        getCurrentUserCredentials()
    }
}
```

当身份验证数据频繁更改或必须始终反映最新状态时，禁用缓存特别有用。

### OkHttp 的双工流

OkHttp 客户端引擎现在支持双工流，使客户端能够同时发送请求正文数据和接收响应数据。

与必须在响应开始前完整发送请求正文的常规 HTTP 调用不同，双工模式支持双向流，允许客户端并发地发送和接收数据。

双工流适用于 HTTP/2 连接，并可以使用 `OkHttpConfig` 中新的 `duplexStreamingEnabled` 属性启用：

```kotlin
val client = HttpClient(OkHttp) {
    engine {
        duplexStreamingEnabled = true
        config {
            protocols(listOf(Protocol.H2_PRIOR_KNOWLEDGE))
        }
    }
}
```

### Apache5 连接管理器配置

Apache5 引擎现在支持使用新的 [`configureConnectionManager {}`](https://api.ktor.io/ktor-client-apache5/io.ktor.client.engine.apache5/-apache5-engine-config/configure-connection-manager.html) 函数直接配置连接管理器。

建议使用此方法，而不是之前使用 `customizeClient { setConnectionManager(...) }` 的方法。使用 `customizeClient` 会替换 Ktor 管理的连接管理器，可能会绕过引擎设置、超时和其他内部配置。

<compare>

```kotlin
val client = HttpClient(Apache5) {
    engine {
        customizeClient {
            setConnectionManager(
                PoolingAsyncClientConnectionManagerBuilder.create()
                    .setMaxConnTotal(10_000)
                    .setMaxConnPerRoute(1_000)
                    .build()
            )
        }
    }
}
```

```kotlin
val client = HttpClient(Apache5) {
    engine {
        configureConnectionManager {
            setMaxConnTotal(10_000)
            setMaxConnPerRoute(1_000)
        }
    }
}
```

</compare>

新的 `configureConnectionManager {}` 函数让 Ktor 保持控制，同时允许您调整参数，例如每个路由的最大连接数 (`maxConnPerRoute`) 和总最大连接数 (`maxConnTotal`)。

### 原生客户端引擎的调度器配置

原生 HTTP 客户端引擎（`Curl`、`Darwin` 和 `WinHttp`）现在遵循配置的引擎调度器，并默认使用 `Dispatchers.IO`。

`dispatcher` 属性在客户端引擎配置中一直可用，但原生引擎之前会忽略它并始终使用 `Dispatchers.Unconfined`。通过此更改，原生引擎将使用配置的调度器，并在未指定时默认为 `Dispatchers.IO`，从而使其行为与其他 Ktor 客户端引擎保持一致。

您可以如下显式配置调度器：

```kotlin
val client = HttpClient(Curl) {
    engine {
        dispatcher = Dispatchers.IO
    }
}
```
### 使用引擎调度器执行 HttpStatement {id="use-engine-dispatcher"}

> 在 Ktor 3.4.1 中，此行为在 JVM 上是选择性启用的，以保持向后兼容性，因为默认启用它可能会破坏一些在内部使用 Ktor 的库。
> 要启用它，请将 `io.ktor.client.statement.useEngineDispatcher` JVM 系统属性设置为 `true`
>  ```shell
>  -Dio.ktor.client.statement.useEngineDispatcher=true
>  ```
> 此选项将在未来的版本中成为默认设置，因此我们建议尽早选择性启用。
>
{style="warning"}

`HttpStatement.execute {}` 和 `HttpStatement.body {}` 块现在在 HTTP 引擎的调度器上运行，而不是在调用者的协程上下文中运行。这可以防止从主线程调用这些块时发生意外阻塞。

以前，用户必须使用 `withContext` 手动切换调度器，以避免在 I/O 操作期间（例如将流式响应写入文件）冻结 UI。通过此更改，Ktor 会自动将这些块调度到引擎的协程上下文：

<compare>

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    withContext(Dispatchers.IO) {
        val channel: ByteReadChannel = httpResponse.body()
        // 处理并写入数据
    }
}
```

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    // 处理并写入数据
}
```
</compare>

### 插件和默认请求配置替换

Ktor 客户端配置现在提供了更多在运行时替换现有设置的控制权。

#### 替换插件配置

新的 [`installOrReplace()`](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/install-or-replace.html) 函数会安装客户端插件，或者如果插件已经安装，则替换其现有的配置。当您需要重新配置插件而无需先手动移除它时，这非常有用。

```kotlin
val client = HttpClient {
    installOrReplace(ContentNegotiation) {
        json()
    }
}
```

在上面的示例中，如果 `ContentNegotiation` 已经安装，其配置将被块中提供的新配置替换。

#### 替换默认请求配置

[`defaultRequest()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/default-request.html) 函数现在接受一个可选的 `replace` 参数（默认为 `false`）。当设置为 `true` 时，新配置将替换之前定义的任何默认请求设置，而不是与其合并。

```kotlin
val client = HttpClient {
    defaultRequest(replace = true) {
        // ...
    }
}
```

这允许您在组合或重用客户端设置时显式覆盖早期的默认请求配置。

### 对 `js` 和 `wasmJs` 目标的共享源集支持

Ktor 现在支持多平台项目中的 [Kotlin 共享 `web` 源集](https://kotlinlang.org/docs/whatsnew2220.html#shared-source-set-for-js-and-wasmjs-targets)，允许您在 `js` 和 `wasmJs` 目标之间共享 Ktor 依赖项。这使得在 JavaScript 和 Wasm/JS 之间共享特定于 Web 的客户端代码（例如 HTTP 客户端和引擎）变得更加容易。

在您的 <Path>build.gradle.kts</Path> 文件中，您可以在 `webMain` 源集中声明 Ktor 依赖项：

```kotlin
kotlin {
    sourceSets {
        webMain.dependencies {
            implementation("io.ktor:ktor-client-js:%ktor_version%")
        }
    }
}
```

然后，您可以使用对 `js` 和 `wasmJs` 目标都可用的 API：

```kotlin
// src/webMain/kotlin/Main.kt

actual fun createClient(): HttpClient = HttpClient(Js)
```

## I/O

### 将字节从 `ByteReadChannel` 流式传输到 `RawSink`

您现在可以使用新的 [`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 函数从通道读取字节并直接将其写入指定的 `RawSink`。此函数简化了在没有中间缓冲区或手动复制的情况下处理大型响应或文件下载的过程。

以下示例下载一个文件并将其写入新的本地文件：

```kotlin
val client = HttpClient(CIO)
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()
val fileSize = 100 * 1024 * 1024

runBlocking {
    client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
        val channel: ByteReadChannel = httpResponse.body()
        channel.readTo(stream)
    }
}

println("文件已保存至 ${file.path}")

```

## Gradle 插件

### OpenAPI 编译器扩展程序

以前，OpenAPI 编译器插件在构建时生成完整的静态 OpenAPI 文档。在 Ktor 3.4.0 中，它改为生成在运行时提供 OpenAPI 元数据的代码，这些元数据由 [OpenAPI](server-openapi.md) 和 [Swagger UI](server-swagger-ui.md) 插件在提供规范时使用。

专用的 `buildOpenApi` Gradle 任务已被移除。编译器插件现在在常规构建期间自动应用，对路由或注解的更改会反映在运行的服务器中，而无需任何额外的生成步骤。

#### 配置

配置仍然使用 `ktor` Gradle 扩展程序内的 `openApi {}` 块完成。然而，用于定义全局 OpenAPI 元数据（如 `title`、`version`、`description` 和 `target`）的属性已被弃用并被忽略。

全局 OpenAPI 元数据现在是在运行时而不是在编译期间定义和解析的。

编译器扩展程序的配置现在仅限于控制如何推断和收集元数据的特殊功能选项。

对于从 Ktor 3.3.0 中的实验性预览版迁移的用户，配置更改如下：

<compare>

```kotlin
// build.gradle.kts
ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        target = project.layout.projectDirectory.file("api.json")
        title = "OpenAPI example"
        version = "2.1"
        summary = "This is a sample API"
    }
}
```

```kotlin
// build.gradle.kts
ktor {
    openApi {
        // 编译器插件的全局控制
        enabled = true
        // 启用和禁用从调用处理程序代码推断详细信息
        codeInferenceEnabled = true
        // 切换是分析所有路由还是仅分析带有注释的路由
        onlyCommented = false
    }
}
```

</compare>