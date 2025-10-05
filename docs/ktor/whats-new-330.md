[//]: # (title: Ktor 3.3.0 有哪些新特性)

<show-structure for="chapter,procedure" depth="2"/>

_[发布日期：2025 年 9 月 11 日](releases.md#release-details)_

Ktor 3.3.0 在服务器、客户端和工具方面带来了新功能。这是本次特性发布的亮点：

*   [静态资源自定义回退机制](#custom-fallback)
*   [OpenAPI 规范生成](#openapi-spec-gen)
*   [HTTP/2 明文 (h2c) 支持](#http2-h2c-support)
*   [实验性的 WebRTC 客户端](#webrtc-client)

## Ktor 服务器

### 静态资源自定义回退 {id="custom-fallback"}

Ktor 3.3.0 为静态内容引入了一个新的 `fallback()` 函数，允许你在请求的资源未找到时定义自定义行为。

与总是提供相同回退文件的 `default()` 不同，`fallback()` 让你能够访问原始请求路径和当前的 `ApplicationCall`。你可以使用它进行重定向、返回自定义状态码或动态提供不同的文件。

要定义自定义回退行为，请在 `staticFiles()`、`staticResources()`、`staticZip()` 或 `staticFileSystem()` 中使用 `fallback()` 函数：

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

### 静态内容的 LastModified 和 Etag 头

Ktor 3.3.0 引入了对静态资源的 `ETag` 和 `LastModified` 头的支持。当安装了 [`ConditionalHeaders`](server-conditional-headers.md) 插件后，你可以处理条件头，以避免在内容自上次请求以来未更改时发送内容正文：

```kotlin
staticFiles("/filesWithEtagAndLastModified", File("files")) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

这些值根据每个资源动态计算，并应用于响应。

你还可以使用预定义提供者，例如使用资源内容的 SHA‑256 散列值来生成强 `ETag`：

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", File("files")) {
    etag(ETagProvider.StrongSha256)
}
```

### 开发模式自动重载限制

在 Ktor 3.2.0 中，引入的[对挂起模块函数的支持](whats-new-320.md#suspendable-module-functions)导致了一个回归，即使用阻塞模块引用的应用程序的自动重载停止工作。

此回归在 3.3.0 中依然存在，自动重载继续仅适用于 `suspend` 函数模块和配置引用。

支持的模块声明示例：

```kotlin
// Supported — suspend function reference
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// Supported — configuration reference (application.conf / application.yaml)
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

我们计划在未来版本中恢复对阻塞函数引用的支持。在此之前，请在 `development` 模式下优先使用 `suspend` 模块或配置引用。

### HTTP/2 明文 (h2c) 支持 {id="http2-h2c-support"}

Ktor 3.3.0 为 Netty 引擎引入了对 HTTP/2 明文 (h2c) 的支持，它允许无 TLS 加密的 HTTP/2 通信。这种设置通常用于可信环境，例如本地测试或私有网络。

要启用 h2c，请在引擎配置中将 `enableH2c` 标志设置为 true。更多信息请参见 [无 TLS 的 HTTP/2](server-http2.md#http-2-without-tls)。

## Ktor 客户端

### SSE 响应体缓冲

到目前为止，在 SSE 错误后尝试调用 `response.bodyAsText()` 会因重复消费问题而失败。

Ktor 3.3.0 引入了一个可配置的诊断缓冲，允许你捕获已处理的 SSE 数据，用于调试和错误处理。

你可以在安装 [SSE 插件](client-server-sent-events.topic) 时全局配置此缓冲：

```kotlin
install(SSE) {
    bufferPolicy = SSEBufferPolicy.LastEvents(10)
}
```

或者按每次调用配置：

```kotlin
client.sse(url, { bufferPolicy(SSEBufferPolicy.All) }) {
    // …
}
```

随着 SSE 流被消费，客户端会在内存缓冲中维护已处理数据的快照（无需重新从网络读取）。如果发生错误，你可以安全地调用 `response?.bodyAsText()` 以进行日志记录或诊断。

更多信息请参见 [响应缓冲](client-server-sent-events.topic#response-buffering)。

### WebRTC 客户端 {id="webrtc-client"}

此版本引入了实验性的 WebRTC 客户端支持，用于多平台项目中的点对点实时通信。

WebRTC 实现了视频通话、多人游戏和协作工具等应用程序。通过此版本，你现在可以使用统一的 Kotlin API 建立对等连接，并在 JavaScript/Wasm 和 Android 目标平台之间交换数据通道。未来版本计划支持 iOS、JVM 桌面和 Native 等其他目标平台。

你可以通过选择适合你平台的引擎并提供配置来创建 `WebRtcClient`，类似于 `HttpClient`：

<TabItem title="JS/Wasm" group-key="js-wasm">

```kotlin
val jsClient = WebRtcClient(JsWebRtc) {
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>
<TabItem title="Android" group-key="android">

```kotlin
val androidClient = WebRtcClient(AndroidWebRtc) {
    context = appContext // Required: provide Android context
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>

创建后，客户端可以使用交互式连接建立 (ICE) 建立点对点连接。协商完成后，对等端可以打开数据通道并交换消息。

```kotlin
val connection = client.createPeerConnection()

// Add a remote ICE candidate (received via your signaling channel)
connection.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// Wait until all local candidates are gathered
connection.awaitIceGatheringComplete()

// Listen for incoming data channel events
connection.dataChannelEvents.collect { event ->
   when (event) {
     is Open -> println("Another peer opened a chanel: ${event.channel}")
     is Closed -> println("Data channel is closed")
     is Closing, is BufferedAmountLow, is Error -> println(event)
   }
}

// Create a channel and send/receive messages
val channel = connection.createDataChannel("chat")
channel.send("hello")
val answer = channel.receiveText()
```

有关用法和限制的更多详细信息，请参见 [WebRTC 客户端](client-webrtc.md) 文档。

### OkHttp 版本更新

在 Ktor 3.3.0 中，Ktor 客户端的 `OkHttp` 引擎已升级到使用 OkHttp 5.1.0（之前是 4.12.0）。这次主要版本升级可能会为直接与 OkHttp 交互的项目引入 API 变更。此类项目应验证兼容性。

### 统一的 OkHttp SSE 会话

OkHttp 引擎现在使用服务器发送事件 (SSE) 的标准 API，取代了之前引入的 `OkHttpSSESession`。此变更统一了所有客户端引擎的 SSE 处理，并解决了 OkHttp 特有实现的局限性。

## Gradle 插件

### OpenAPI 规范生成 {id="openapi-spec-gen"}
<secondary-label ref="experimental"/>

Ktor 3.3.0 通过 Gradle 插件和编译器插件引入了一个实验性的 OpenAPI 生成特性。这允许你在构建时直接从应用程序代码生成 OpenAPI 规范。

它提供以下功能：
- 分析 Ktor 路由定义并合并嵌套路由、本地扩展和资源路径。
- 解析前面的 KDoc 注解以提供 OpenAPI 元数据，包括：
    - 路径、查询、头、cookie 和请求体参数
    - 响应码和类型
    - 安全性、描述、弃用信息和外部文档链接
- 从 `call.receive()` 和 `call.respond()` 推断请求和响应体。

undefined</include>

#### 生成 OpenAPI 规范

要从 Ktor 路由和 KDoc 注解生成 OpenAPI 规范文件，请使用以下命令：

```shell
./gradlew buildOpenApi
```

#### 提供规范

要在运行时提供生成的规范，你可以使用 [OpenAPI](server-openapi.md) 或 [SwaggerUI](server-swagger-ui.md) 插件。

以下示例在一个 OpenAPI 端点提供生成的规范文件：

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}
```

有关此特性的更多详细信息，请参见 [OpenAPI 规范生成](openapi-spec-generation.md)。

## 共享

### Jetty 版本更新

Jetty 服务器和客户端引擎已升级到使用 Jetty 12。对于大多数应用程序来说，此次升级完全向后兼容，但客户端和服务器代码现在在内部利用更新的 Jetty API。

如果你的项目直接使用 Jetty API，请注意存在破坏性变更。更多详细信息，请参考 [官方 Jetty 迁移指南](https://jetty.org/docs/jetty/12.1/programming-guide/migration/11-to-12.html)。