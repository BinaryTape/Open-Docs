[//]: # (title: 从 2.2.x 迁移到 3.0.x)

<show-structure for="chapter" depth="3"/>

本指南提供了关于如何将 Ktor 应用程序从 2.2.x 版本迁移到 3.0.x 的说明。

## Ktor Server {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment` 和 `Application`

引入了几项设计变更，以改进可配置性，并在 `ApplicationEngine`、`ApplicationEnvironment` 和 `Application` 实例之间提供更明确的分离。

在 v3.0.0 之前，`ApplicationEngine` 管理 `ApplicationEnvironment`，而 `ApplicationEnvironment` 又管理 `Application`。

然而，在当前设计中，`Application` 负责创建、拥有并初始化 `ApplicationEngine` 和 `ApplicationEnvironment`。

此次重构带来了一系列如下的破坏性变更：

- [`ApplicationEngineEnvironmentBuilder` 和 `applicationEngineEnvironment` 类已重命名](#renamed-classes)。
- [`start()` 和 `stop()` 方法已从 `ApplicationEngineEnvironment` 中移除](#ApplicationEnvironment)。
- [`commandLineEnvironment()` 已移除](#CommandLineConfig)。
- [`ServerConfigBuilder` 的引入](#ServerConfigBuilder)。
- [`embeddedServer()` 现在返回 `EmbeddedServer` 而不是 `ApplicationEngine`](#EmbeddedServer)。

这些变更将影响依赖旧模型的现有代码。

#### 已重命名类 {id="renamed-classes"}

| 包 | 2.x.x | 3.0.x |
|---|---|---|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment` | `applicationEnvironment` |

#### `start()` 和 `stop()` 方法已从 `ApplicationEngineEnvironment` 中移除 {id="ApplicationEnvironment"}

随着 `ApplicationEngineEnvironment` 合并到 [
`ApplicationEnvironment`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-environment/index.html)，`start()` 和 `stop()` 方法现在只能通过 [
`ApplicationEngine`](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-application-engine/index.html) 访问。

| 2.x.x | 3.0.x |
|---|---|
| `ApplicationEngineEnvironment.start()` | `ApplicationEngine.start()` |
| `ApplicationEngineEnvironment.stop()` | `ApplicationEngine.stop()` |

此外，在下表中你可以看到已移除属性及其当前所属权的列表：

| 2.x.x | 3.0.x |
|---|---|
| `ApplicationEngineEnvironment.connectors` | `ApplicationEngine.Configuration.connectors` |
| `ApplicationEnvironment.developmentMode` | `Application.developmentMode` |
| `ApplicationEnvironment.monitor` | `Application.monitor` |
| `ApplicationEnvironment.parentCoroutineContext` | `Application.parentCoroutineContext` |
| `ApplicationEnvironment.rootPath` | `Application.rootPath` |

所属权变更可通过以下示例说明：

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import org.slf4j.helpers.NOPLogger

fun defaultServer(module: Application.() -> Unit) =
  embeddedServer(CIO,
    environment = applicationEngineEnvironment {
      log = NOPLogger.NOP_LOGGER
      connector { 
          port = 8080
      }
      module(module)
    }
  )
```

{validate="false"}

```kotlin
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import org.slf4j.helpers.NOPLogger

fun defaultServer(module: Application.() -> Unit) =
  embeddedServer(CIO,
    environment = applicationEnvironment { log = NOPLogger.NOP_LOGGER },
    configure = {
      connector {
          port = 8080
      }
    },
    module
  )
```

</compare>

#### `commandLineEnvironment()` 已移除 {id="CommandLineConfig"}

`commandLineEnvironment()` 函数，用于从命令行实参创建 `ApplicationEngineEnvironment` 实例，已在 Ktor `3.0.0` 中移除。取而代之的是，你可以使用 [
`CommandLineConfig`](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-command-line-config.html) 函数将命令行实参解析为配置对象。

要将应用程序从 `commandLineEnvironment` 迁移到 `CommandLineConfig`，请将 `commandLineEnvironment()` 替换为 `configure` 代码块，如下所示。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, commandLineEnvironment(args) {
        connector { port = 8080 }
        module {
            routing {
                get("/") {
                    call.respondText("Hello, world!")
                }
            }
        }
    }) {
        requestReadTimeoutSeconds = 5
        responseWriteTimeoutSeconds = 5
    }.start(wait = true)
}
```

```kotlin
fun main(args: Array<String>) {
    embeddedServer(
        factory = Netty,
        configure = {
            val cliConfig = CommandLineConfig(args)
            takeFrom(cliConfig.engineConfig)
            loadCommonConfiguration(cliConfig.rootConfig.environment.config)
        }
    ) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}
```

</compare>

关于 `embeddedServer` 的命令行配置的更多信息，请参见 [代码中的配置](server-configuration-code.topic#command-line) 主题。

#### `ServerConfigBuilder` 的引入 {id="ServerConfigBuilder"}

为了配置服务器属性，引入了一个新实体 [
`ServerConfigBuilder`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html)，它取代了 `ApplicationPropertiesBuilder` 的旧有配置机制。
`ServerConfigBuilder` 用于构建 [
`ServerConfig`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-server-config/index.html) 类的实例，该类现在持有先前由 `ApplicationProperties` 管理的模块、路径和环境详细信息。

下表总结了主要变更：

| 包 | 2.x.x | 3.0.x |
|---|---|---|
| `io.ktor:ktor-server-core` | `ApplicationProperties` | `ServerConfig` |
| `io.ktor:ktor-server-core` | `ApplicationPropertiesBuilder` | `ServerConfigBuilder` |

此外，在 `embeddedServer()` 函数中，`applicationProperties` 属性已重命名为 `rootConfig`，以反映这种新的配置方法。

使用 `embeddedServer()` 时，请将 `applicationProperties` 属性替换为 `rootConfig`。
以下是使用 `serverConfig` 代码块配置服务器并将 `developmentMode` 显式设置为 `true` 的示例：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty,
        serverConfig {
            developmentMode = true
            module(Application::module)
        },
        configure = {
            connector { port = 12345 }
        }
    ).start(wait = true)
}
```

#### `EmbeddedServer` 的引入 {id="EmbeddedServer"}

[
`EmbeddedServer`](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html) 类被引入并用于替代 `ApplicationEngine` 作为 `embeddedServer()` 函数的返回类型。

关于模型变更的更多详情，请参见 [YouTrack 上的 KTOR-3857 问题](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design)。

### 测试

##### `withTestApplication` 和 `withApplication` 已移除

`withTestApplication` 和 `withApplication` 函数，[先前在 2.0.0 版本中已弃用](migration-to-20x.md#testing-api)，现已从 `ktor-server-test-host` 包中移除。

取而代之的是，请使用 `testApplication` 函数以及现有的 [Ktor client](client-create-and-configure.md) 实例来向你的服务器发出请求并验证结果。

在下面的测试中，`handleRequest` 函数被 `client.get` 请求替换：

<compare first-title="1.x.x" second-title="3.0.x">

```kotlin
@Test
fun testRootLegacyApi() {
    withTestApplication(Application::module) {
        handleRequest(HttpMethod.Get, "/").apply {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("Hello, world!", response.content)
        }
    }
}
```

```kotlin
@Test
fun testRoot() = testApplication {
    val response = client.get("/")
    assertEquals(HttpStatusCode.OK, response.status)
    assertEquals("Hello, world!", response.bodyAsText())
}
```

</compare>

更多信息请参见 [Ktor Server 中的测试](server-testing.md)。

#### `TestApplication` 模块加载 {id="test-module-loading"}

`TestApplication` 不再自动从配置文件（例如 `application.conf`）加载模块。取而代之的是，你必须在 `testApplication` 函数中[显式加载你的模块](#explicit-module-loading)或[手动加载配置文件](#configure-env)。

##### 显式模块加载 {id="explicit-module-loading"}

要显式加载模块，请在 `testApplication` 中使用 `application` 函数。这种方法允许你手动指定要加载哪些模块，从而更好地控制测试设置。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
  @Test
  fun testRoot() = testApplication {
    client.get("/").apply {
      assertEquals(HttpStatusCode.OK, status)
      assertEquals("Hello World!", bodyAsText())
    }
  }
}
```

{validate="false"}

```kotlin
import com.example.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
  @Test
  fun testRoot() = testApplication {
    application {
      configureRouting()
    }
    client.get("/").apply {
      assertEquals(HttpStatusCode.OK, status)
      assertEquals("Hello World!", bodyAsText())
    }
  }
}

```

{validate="false"}

</compare>

##### 从配置文件加载模块 {id="configure-env"}

如果你想从配置文件加载模块，请使用 `environment` 函数为你的测试指定配置文件。

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

关于配置测试应用程序的更多信息，请参见 [Ktor Server 中的测试](server-testing.md) 部分。

### `CallLogging` 插件包已重命名

[
`CallLogging`](https://api.ktor.io/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html) 插件包因拼写错误已重命名。

| 2.x.x | 3.0.x |
|---|---|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common` 模块已移除

由于 `Application` 需要了解 `ApplicationEngine`，`ktor-server-host-common` 模块的内容已合并到 `ktor-server-core` 中，即 [
`io.ktor.server.engine`](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/index.html) 包。

确保你的依赖项已相应更新。在大多数情况下，你只需移除 `ktor-server-host-common` 依赖项即可。

### `Locations` 插件已移除

Ktor 服务器的 `Locations` 插件已移除。要创建类型安全的路由，请改用 [Resources 插件](server-resources.md)。这需要进行以下更改：

* 将 `io.ktor:ktor-server-locations` artifact 替换为 `io.ktor:ktor-server-resources`。

* `Resources` 插件依赖于 Kotlin 序列化插件。要添加序列化插件，请参见 [kotlinx.serialization 设置](https://github.com/Kotlin/kotlinx.serialization#setup)。

* 将插件导入从 `io.ktor.server.locations.*` 更新为 `io.ktor.server.resources.*`。

* 此外，从 `io.ktor.resources` 导入 `Resource` 模块。

以下示例展示了如何实现这些变更：

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.server.locations.*

@Location("/articles")
class article(val value: Int)

fun Application.module() {
    install(Locations)
    routing {
        get<article> {
            // Get all articles ...
            call.respondText("List of articles")
        }
    }
}
```

```kotlin
import io.ktor.resources.Resource
import io.ktor.server.resources.*

@Resource("/articles")
class Articles(val value: Int)

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> {
            // Get all articles ...
            call.respondText("List of articles")
        }
    }
}
```

</compare>

关于使用 `Resources` 的更多信息，请参考 [类型安全路由](server-resources.md)。

### WebSockets 配置中 `java.time` 的替换

[WebSockets](server-websockets.md) 插件配置已更新为使用 Kotlin 的 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 来配置 `pingPeriod` 和 `timeout` 属性。这取代了之前对 `java.time.Duration` 的使用，以提供更符合 Kotlin 习惯的体验。

要将现有代码迁移到新格式，请使用 `kotlin.time.Duration` 类的扩展函数和属性来构建持续时间。在以下示例中，`Duration.ofSeconds()` 被 Kotlin 的 `seconds` 扩展替换：

<compare first-title="2.x.x" second-title="3.0.x">

```kotlin
import java.time.Duration
  
install(WebSockets) {
    pingPeriod = Duration.ofSeconds(15)
    timeout = Duration.ofSeconds(15)
    //..
}
```

```kotlin
import kotlin.time.Duration.Companion.seconds

install(WebSockets) {
    pingPeriod = 15.seconds
    timeout = 15.seconds
    //..
}
```

</compare>

你可以根据需要为其他持续时间配置使用类似的 Kotlin 持续时间扩展（`minutes`、`hours` 等）。更多信息，请参见 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 文档。

### 服务器 socket 的 `.bind()` 现在是挂起函数

为了支持 JS 和 WasmJS 环境中的异步操作，`TCPSocketBuilder` 和 `UDPSocketBuilder` 中服务器 socket 的 `.bind()` 函数已更新为挂起函数。这意味着现在任何对 `.bind()` 的调用都必须在协程内进行。

要迁移，请确保 `.bind()` 仅在协程或挂起函数中调用。以下是使用 `runBlocking` 的示例：

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

有关使用 socket 的更多信息，请参见 [Sockets 文档](server-sockets.md)。

## Multipart 表单数据

### 二进制和文件项的新默认限制

在 Ktor 3.0.0 中，对使用 [
`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html) 接收二进制和文件项引入了 50MB 的默认限制。如果接收到的文件或二进制项超过 50MB 限制，则会抛出 `IOException`。

#### 覆盖默认限制

如果你的应用程序先前依赖于在没有显式配置的情况下处理大于 50MB 的文件，则你需要更新代码以避免意外行为。

要覆盖默认限制，请在调用 `.receiveMultipart()` 时传入 `formFieldLimit` 形参：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

### `PartData.FileItem.streamProvider()` 已弃用

在 Ktor 的早期版本中，`PartData.FileItem` 中的 `.streamProvider()` 函数用于将文件项的内容作为 `InputStream` 进行访问。从 Ktor 3.0.0 开始，此函数已被弃用。

要迁移你的应用程序，请将 `.streamProvider()` 替换为 [
`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 函数。`.provider()` 函数返回一个 `ByteReadChannel`，这是一个协程友好的非阻塞抽象，用于增量读取字节流。
然后，你可以使用 `ByteReadChannel` 提供的 [
`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html) 或 [
`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 方法，直接将数据从通道传输到文件输出。

在示例中，`.copyAndClose()` 方法将数据从 `ByteReadChannel` 传输到文件的 `WritableByteChannel`。

<compare first-title="2.x.x" second-title="3.0.x">

```kotlin
fun Application.main() {
    routing {
        post("/upload") {
            val multipart = call.receiveMultipart()
            multipart.forEachPart { partData ->
                if (partData is PartData.FileItem) {
                    var fileName = partData.originalFileName as String
                    val file = File("uploads/$fileName")
                    file.writeBytes(partData.streamProvider().readBytes())
                }
                // ...
            }
        }
    }
}
```

```kotlin
fun Application.main() {
    routing {
        post("/upload") {
            val multipart = call.receiveMultipart()
            multipart.forEachPart { partData ->
                if (partData is PartData.FileItem) {
                    var fileName = partData.originalFileName as String
                    val file = File("uploads/$fileName")
                    partData.provider().copyAndClose(file.writeChannel())
                }
                // ...
            }
        }
    }
}
```

</compare>

关于完整示例以及处理 multipart 表单数据的更多信息，请参见 [multipart 表单数据的请求处理](server-requests.md#form_data)。

### 会话加密方法更新

`Sessions` 插件提供的加密方法已更新以增强安全性。

具体来说，`SessionTransportTransformerEncrypt` 方法先前从解密的会话值派生 MAC，现在则从加密值计算 MAC。

为了确保与现有会话的兼容性，Ktor 引入了 `backwardCompatibleRead` 属性。对于当前配置，请在 `SessionTransportTransformerEncrypt` 的构造函数中包含此属性：

```kotlin
install(Sessions) {
  cookie<UserSession>("user_session") {
    // ...
    transform(
      SessionTransportTransformerEncrypt(
        secretEncryptKey, // your encrypt key here
        secretSignKey, // your sign key here
        backwardCompatibleRead = true
      )
    )
  }
}
```

有关 Ktor 中会话加密的更多信息，请参见 [签名和加密会话数据](server-sessions.md#sign_encrypt_session)。

## Ktor Client

### `HttpResponse` 的 `content` 属性重命名

在 Ktor 3.0.0 之前，[
`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 的 `content` 属性提供了一个原始的 `ByteReadChannel`，用于从网络读取响应内容。从 Ktor 3.0.0 开始，`content` 属性已重命名为 `rawContent`，以更好地反映其用途。

### `SocketTimeoutException` 现在是一个类型别名 (typealias)

[`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html) 已从 Kotlin 类转换为 Java 类的别名。
此更改在某些情况下可能导致 `NoClassDefFoundError`，并可能需要更新现有代码。

要迁移你的应用程序，请确保你的代码没有引用旧类，并且已使用最新的 Ktor 版本进行编译。以下是更新异常检测的方法：

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
    <code-block lang="kotlin" code="    if (exception is io.ktor.client.network.sockets.SocketTimeoutException) { ... }"/>
    <code-block lang="kotlin" code="    if (exception is java.net.SocketTimeoutException) { ... }"/>
</compare>

## 共享模块

### 迁移到 `kotlinx-io`

随着 3.0.0 版本的发布，Ktor 已过渡到使用 `kotlinx-io` 库，该库在 Kotlin 库中提供了标准化且高效的 I/O API。此更改可提高性能，减少内存分配，并简化 I/O 处理。如果你的项目与 Ktor 的底层 I/O API 进行交互，你可能需要更新代码以确保兼容性。

这会影响许多类，例如 [
`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html)
和 [
`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)。此外，以下 Ktor 类现在由 `kotlinx-io` 支持，其先前的实现已被弃用：

| Ktor 2.x | Ktor 3.x |
|---|---|
| `io.ktor.utils.io.core.Buffer` | `kotlinx.io.Buffer` |
| `io.ktor.utils.io.core.BytePacketBuilder` | `kotlinx.io.Sink` |
| `io.ktor.utils.io.core.ByteReadPacket` | `kotlinx.io.Source` |
| `io.ktor.utils.io.core.Input` | `kotlinx.io.Source` |
| `io.ktor.utils.io.core.Output` | `kotlinx.io.Sink` |
| `io.ktor.utils.io.core.Sink` | `kotlinx.io.Buffer` |
| `io.ktor.utils.io.errors.EOFException` | `kotlinx.io.EOFException` |
| `io.ktor.utils.io.errors.IOException` | `kotlinx.io.IOException` |

弃用的 API 将在 Ktor 4.0 之前得到支持，但我们建议尽快迁移。要迁移你的应用程序，请更新代码以利用 `kotlinx-io` 中相应的方法。

#### 示例：流式 I/O

如果你正在处理大型文件下载并需要高效的流式解决方案，你可以用 `kotlinx-io` 优化的流式 API 替换手动字节数组处理。

在 Ktor 2.x 中，处理大型文件下载通常涉及使用 `ByteReadChannel.readRemaining()` 手动读取可用字节，并使用 `File.appendBytes()` 将它们写入文件：

```Kotlin
val client = HttpClient(CIO)
val file = File.createTempFile("files", "index")

runBlocking {
    client.prepareGet("https://ktor.io/").execute { httpResponse ->
        val channel: ByteReadChannel = httpResponse.body()
        while (!channel.isClosedForRead) {
            val packet = channel.readRemaining(DEFAULT_BUFFER_SIZE.toLong())
            while (!packet.isEmpty) {
                val bytes = packet.readBytes()
                file.appendBytes(bytes)
                println("Received ${file.length()} bytes from ${httpResponse.contentLength()}")
            }
        }
        println("A file saved to ${file.path}")
    }
}
```

这种方法涉及多次内存分配和冗余数据复制。

在 Ktor 3.x 中，`ByteReadChannel.readRemaining()` 现在返回一个 `Source`，从而能够使用 `Source.transferTo()` 流式传输数据：

```Kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

这种方法将数据直接从通道传输到文件的 `sink`，最大限度地减少内存分配并提高性能。

有关完整示例，请参见 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)。

> 有关 API 替换的更多详情，请参考 [`kotlinx-io` 文档](https://kotlinlang.org/api/kotlinx-io/)。

### 属性键现在需要精确类型匹配

在 Ktor 3.0.0 中，[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html) 实例现在通过标识进行比较，并在存储和检索值时需要精确的类型匹配。这确保了类型安全，并防止由类型不匹配引起的意外行为。

以前，可以使用与存储时不同的泛型类型来检索属性，例如使用 `getOrNull<Any>()` 来获取 `AttributeKey<Boolean>`。

要迁移你的应用程序，请确保检索类型与存储类型精确匹配：

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 空 artifact 的移除

自 Ktor 1.0.0 以来，空的 artifact `io.ktor:ktor` 被错误地发布到 [Maven](https://repo1.maven.org/maven2/io/ktor/ktor/)。此 artifact 已从 Ktor 3.0.0 开始移除。

如果你的项目包含此 artifact 作为依赖项，你可以安全地将其移除。