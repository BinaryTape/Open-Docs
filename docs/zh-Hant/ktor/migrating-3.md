[//]: # (title: 從 2.2.x 遷移至 3.0.x)

<show-structure for="chapter" depth="3"/>

本指南提供了如何將您的 Ktor 應用程式從 2.2.x 版本遷移至 3.0.x 的說明。

## Ktor 伺服器 {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment` 和 `Application`

為改善可配置性並在 `ApplicationEngine`、`ApplicationEnvironment` 和 `Application` 實例之間提供更明確的分離，引入了多項設計變更。

在 v3.0.0 之前，`ApplicationEngine` 管理 `ApplicationEnvironment`，而 `ApplicationEnvironment` 又管理 `Application`。

然而，在目前的設計中，`Application` 負責建立、擁有並初始化 `ApplicationEngine` 和 `ApplicationEnvironment`。

此重組帶來了以下一系列破壞性變更：

- [`ApplicationEngineEnvironmentBuilder` 和 `applicationEngineEnvironment` 類別已重新命名](#renamed-classes)。
- `ApplicationEngineEnvironment` 中的 [`start()` 和 `stop()` 方法已移除](#ApplicationEnvironment)。
- [`commandLineEnvironment()` 已移除](#CommandLineConfig)。
- [引入 `ServerConfigBuilder`](#ServerConfigBuilder)。
- [`embeddedServer()` 回傳 `EmbeddedServer`](#EmbeddedServer) 而非 `ApplicationEngine`。

這些變更將影響依賴舊模型的現有程式碼。

#### 重新命名類別 {id="renamed-classes"}

| 套件                       | 2.x.x                                 | 3.0.x                           |
|----------------------------|---------------------------------------|---------------------------------|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment`        | `applicationEnvironment`        |

#### `ApplicationEngineEnvironment` 中的 `start()` 和 `stop()` 方法已移除 {id="ApplicationEnvironment"}

隨著 `ApplicationEngineEnvironment` 合併至 [`ApplicationEnvironment`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/index.html)，`start()` 和 `stop()` 方法現在只能透過 [`ApplicationEngine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/index.html) 存取。

| 2.x.x                                                 | 3.0.x                                |
|-------------------------------------------------------|--------------------------------------|
| `ApplicationEngineEnvironment.start()`                | `ApplicationEngine.start()`          |
| `ApplicationEngineEnvironment.stop()`                 | `ApplicationEngine.stop()`           |

此外，在下表中，您可以看到已移除的屬性清單及其目前對應的所有權：

| 2.x.x                                           | 3.0.x                                        |
|-------------------------------------------------|----------------------------------------------|
| `ApplicationEngineEnvironment.connectors`       | `ApplicationEngine.Configuration.connectors` |
| `ApplicationEnvironment.developmentMode`        | `Application.developmentMode`                |
| `ApplicationEnvironment.monitor`                | `Application.monitor`                        |
| `ApplicationEnvironment.parentCoroutineContext` | `Application.parentCoroutineContext`         |
| `ApplicationEnvironment.rootPath`               | `Application.rootPath`                       |

所有權變更可透過以下範例說明：

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

用於從命令列引數建立 `ApplicationEngineEnvironment` 實例的 `commandLineEnvironment()` 函式已在 Ktor `3.0.0` 中移除。您可以改用 [`CommandLineConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html) 函式將命令列引數解析為配置物件。

若要將應用程式從 `commandLineEnvironment` 遷移至 `CommandLineConfig`，請將 `commandLineEnvironment()` 替換為 `configure` 區塊，如下所示。

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

有關使用 `embeddedServer` 進行命令列配置的更多資訊，請參閱[程式碼配置](server-configuration-code.topic#command-line)主題。

#### 引入 `ServerConfigBuilder` {id="ServerConfigBuilder"}

為配置伺服器屬性，引入了一個新實體 [`ServerConfigBuilder`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html)，它取代了先前 `ApplicationPropertiesBuilder` 的配置機制。`ServerConfigBuilder` 用於建構 [`ServerConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config/index.html) 類別的實例，該類別現在持有先前由 `ApplicationProperties` 管理的模組、路徑和環境詳細資訊。

下表總結了主要變更：

| 套件                       | 2.x.x                          | 3.0.x                 |
|----------------------------|--------------------------------|-----------------------|
| `io.ktor:ktor-server-core` | `ApplicationProperties`        | `ServerConfig`        |
| `io.ktor:ktor-server-core` | `ApplicationPropertiesBuilder` | `ServerConfigBuilder` |

此外，在 `embeddedServer()` 函式中，`applicationProperties` 屬性已重新命名為 `rootConfig`，以反映這種新的配置方法。

使用 `embeddedServer()` 時，請將 `applicationProperties` 屬性替換為 `rootConfig`。以下是使用 `serverConfig` 區塊配置伺服器並將 `developmentMode` 明確設為 `true` 的範例：

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

#### 引入 `EmbeddedServer` {id="EmbeddedServer"}

[`EmbeddedServer`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html) 類別被引入，用於取代 `ApplicationEngine` 作為 `embeddedServer()` 函式的回傳類型。

有關模型變更的更多詳細資訊，請參閱 [YouTrack 上的問題 KTOR-3857](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design)。

### 測試

##### `withTestApplication` 和 `withApplication` 已移除

`withTestApplication` 和 `withApplication` 函式，[先前在 `2.0.0` 版本中已棄用](migration-to-20x.md#testing-api)，現在已從 `ktor-server-test-host` 套件中移除。

請改用 `testApplication` 函式搭配現有的 [Ktor 客戶端](client-create-and-configure.md)實例來向您的伺服器發出請求並驗證結果。

在下面的測試中，`handleRequest` 函式被 `client.get` 請求取代：

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

更多資訊請參閱 [Ktor 伺服器中的測試](server-testing.md)。

#### `TestApplication` 模組載入 {id="test-module-loading"}

`TestApplication` 不再自動從配置檔（例如 `application.conf`）載入模組。您必須改為在 `testApplication` 函式中[明確載入您的模組](#explicit-module-loading)或[手動載入配置檔](#configure-env)。

##### 明確的模組載入 {id="explicit-module-loading"}

若要明確載入模組，請在 `testApplication` 中使用 `application` 函式。這種方法允許您手動指定要載入的模組，從而更好地控制測試設定。

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

##### 從配置檔載入模組 {id="configure-env"}

如果您想從配置檔載入模組，請使用 `environment` 函式為您的測試指定配置檔。

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

有關配置測試應用程式的更多資訊，請參閱 [Ktor 伺服器中的測試](server-testing.md)一節。

### `CallLogging` 插件套件已重新命名

[`CallLogging`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html) 插件套件因拼寫錯誤而重新命名。

| 2.x.x                               | 3.0.x                                |
|-------------------------------------|--------------------------------------|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common` 模組已移除

由於 `Application` 需要知道 `ApplicationEngine`，`ktor-server-host-common` 模組的內容已合併到 `ktor-server-core` 中，即 [`io.ktor.server.engine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/index.html) 套件。

請確保您的依賴項已相應更新。在大多數情況下，您只需移除 `ktor-server-host-common` 依賴項即可。

### `Locations` 插件已移除

Ktor 伺服器的 `Locations` 插件已移除。若要建立型別安全路由，請改用 [Resources 插件](server-resources.md)。這需要以下變更：

* 將 `io.ktor:ktor-server-locations` 工件替換為 `io.ktor:ktor-server-resources`。

* `Resources` 插件依賴於 Kotlin 序列化插件。若要添加序列化插件，請參閱 [kotlinx.serialization 設定](https://github.com/Kotlin/kotlinx.serialization#setup)。

* 將插件匯入從 `io.ktor.server.locations.*` 更新為 `io.ktor.server.resources.*`。

* 此外，從 `io.ktor.resources` 匯入 `Resource` 模組。

以下範例顯示了如何實施這些變更：

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

有關使用 `Resources` 的更多資訊，請參閱[型別安全路由](server-resources.md)。

### WebSockets 配置中 `java.time` 的替換

[WebSockets](server-websockets.md) 插件的配置已更新為使用 Kotlin 的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 作為 `pingPeriod` 和 `timeout` 屬性。這取代了先前使用 `java.time.Duration` 的方式，以提供更符合 Kotlin 慣用方式的體驗。

若要將現有程式碼遷移至新格式，請使用 `kotlin.time.Duration` 類別的擴充功能函式和屬性來建構持續時間。在以下範例中，`Duration.ofSeconds()` 被 Kotlin 的 `seconds` 擴充功能取代：

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

您可以根據需要使用類似的 Kotlin 持續時間擴充功能（如 `minutes`、`hours` 等）來進行其他持續時間配置。更多資訊請參閱 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 文件。

### 伺服器 Socket 的 `.bind()` 現在是掛起函式

為了支援 JS 和 WasmJS 環境中的非同步操作，[`TCPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-tcp-socket-builder/index.html) 和 [`UDPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-u-d-p-socket-builder/index.html) 中伺服器 Socket 的 `.bind()` 函式已更新為掛起函式。這表示現在任何對 `.bind()` 的呼叫都必須在協程內進行。

若要遷移，請確保 `.bind()` 僅在協程或掛起函式內呼叫。以下是使用 `runBlocking` 的範例：

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

有關使用 Socket 的更多資訊，請參閱 [Sockets 文件](server-sockets.md)。

## 多部分表單資料

### 二進位和檔案項目的新預設限制

在 Ktor 3.0.0 中，使用 [`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html) 接收二進位和檔案項目時，引入了 50 MB 的預設限制。如果接收到的檔案或二進位項目超過 50 MB 的限制，將會拋出 `IOException`。

#### 覆寫預設限制

如果您的應用程式先前依賴於在沒有明確配置的情況下處理大於 50 MB 的檔案，您將需要更新程式碼以避免意外行為。

若要覆寫預設限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

### `PartData.FileItem.streamProvider()` 已棄用

在 Ktor 的先前版本中，`PartData.FileItem` 中的 `.streamProvider()` 函式用於以 `InputStream` 形式存取檔案項目的內容。從 Ktor 3.0.0 開始，此函式已棄用。

若要遷移您的應用程式，請將 `.streamProvider()` 替換為 [`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 函式。`.provider()` 函式回傳一個 `ByteReadChannel`，這是一個協程友好、非阻塞的抽象，用於逐步讀取位元組流。然後，您可以直接從通道將資料串流傳輸到檔案輸出，使用 `ByteReadChannel` 提供的 [`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html) 或 [`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 方法。

在範例中，`.copyAndClose()` 方法將資料從 `ByteReadChannel` 傳輸到檔案的 `WritableByteChannel`。

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

有關完整範例以及處理多部分表單資料的更多資訊，請參閱[多部分表單資料的請求處理](server-requests.md#form_data)。

### 會話加密方法更新

`Sessions` 插件提供的加密方法已更新，以增強安全性。

具體來說，`SessionTransportTransformerEncrypt` 方法先前從解密後的會話值導出 MAC，現在則從加密值計算 MAC。

為了確保與現有會話的相容性，Ktor 引入了 `backwardCompatibleRead` 屬性。對於目前的配置，請在 `SessionTransportTransformerEncrypt` 的建構子中包含此屬性：

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

有關 Ktor 中會話加密的更多資訊，請參閱[簽署和加密會話資料](server-sessions.md#sign_encrypt_session)。

## Ktor 客戶端

### `HttpResponse` 的 `content` 屬性重新命名

在 Ktor 3.0.0 之前，[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 的 `content` 屬性提供了一個原始的 `ByteReadChannel`，用於在從網路讀取時存取回應內容。從 Ktor 3.0.0 開始，`content` 屬性已重新命名為 `rawContent`，以更好地反映其目的。

### `SocketTimeoutException` 現在是型別別名

來自 `io.ktor.client.network.sockets` 套件的 [`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html) 已從 Kotlin 類別轉換為 Java 類別的別名。此變更可能在某些情況下導致 `NoClassDefFoundError`，並且可能需要更新現有程式碼。

若要遷移您的應用程式，請確保您的程式碼未引用舊類別，並使用最新的 Ktor 版本編譯。以下是更新例外檢查的方法：

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
    <code-block lang="kotlin" code="    if (exception is io.ktor.client.network.sockets.SocketTimeoutException) { ... }"/>
    <code-block lang="kotlin" code="    if (exception is java.net.SocketTimeoutException) { ... }"/>
</compare>

## 共享模組

### 遷移至 `kotlinx-io`

隨著 3.0.0 版本的發布，Ktor 已轉換為使用 `kotlinx-io` 函式庫，該函式庫在 Kotlin 函式庫中提供了標準化且高效的輸入/輸出應用程式介面。此變更提高了效能，減少了記憶體分配，並簡化了輸入/輸出處理。如果您的專案與 Ktor 的底層輸入/輸出應用程式介面互動，您可能需要更新程式碼以確保相容性。

這會影響許多類別，例如 [`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html) 和 [`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)。此外，以下 Ktor 類別現在由 `kotlinx-io` 提供支援，其先前的實作已棄用：

| Ktor 2.x                                  | Ktor 3.x                  |
|-------------------------------------------|---------------------------|
| `io.ktor.utils.io.core.Buffer`            | `kotlinx.io.Buffer`       |
| `io.ktor.utils.io.core.BytePacketBuilder` | `kotlinx.io.Sink`         |
| `io.ktor.utils.io.core.ByteReadPacket`    | `kotlinx.io.Source`       |
| `io.ktor.utils.io.core.Input`             | `kotlinx.io.Source`       |
| `io.ktor.utils.io.core.Output`            | `kotlinx.io.Sink`         |
| `io.ktor.utils.io.core.Sink`              | `kotlinx.io.Buffer`       |
| `io.ktor.utils.io.errors.EOFException`    | `kotlinx.io.EOFException` |
| `io.ktor.utils.io.errors.IOException`     | `kotlinx.io.IOException`  |

已棄用的應用程式介面將支援至 Ktor 4.0，但我們建議盡快遷移。若要遷移您的應用程式，請更新您的程式碼以利用 `kotlinx-io` 中對應的方法。

#### 範例：串流輸入/輸出

如果您正在處理大型檔案下載並需要高效的串流解決方案，您可以將手動位元組陣列處理替換為 `kotlinx-io` 最佳化的串流應用程式介面。

在 Ktor 2.x 中，處理大型檔案下載通常涉及手動使用 `ByteReadChannel.readRemaining()` 讀取可用位元組並使用 `File.appendBytes()` 將其寫入檔案：

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

這種方法涉及多次記憶體分配和冗餘資料複製。

在 Ktor 3.x 中，`ByteReadChannel.readRemaining()` 現在回傳一個 `Source`，透過 `Source.transferTo()` 啟用資料串流傳輸：

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

這種方法將資料直接從通道傳輸到檔案的接收器，最大限度地減少了記憶體分配並提高了效能。

有關完整範例，請參閱 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)。

> 有關應用程式介面替換的更多詳細資訊，請參閱 [`kotlinx-io` 文件](https://kotlinlang.org/api/kotlinx-io/)。

### 屬性鍵現在需要精確的類型匹配

在 Ktor 3.0.0 中，[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html) 實例現在透過識別進行比較，並且在儲存和檢索值時需要精確的類型匹配。這確保了型別安全並防止了因類型不匹配導致的意外行為。

先前，可以使用與儲存時不同的泛型類型來檢索屬性，例如使用 `getOrNull<Any>()` 來獲取 `AttributeKey<Boolean>`。

若要遷移您的應用程式，請確保檢索類型與儲存類型精確匹配：

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 移除空工件

自 Ktor 1.0.0 以來，空工件 `io.ktor:ktor` 因錯誤而發布到 [Maven](https://repo1.maven.org/maven2/io/ktor/ktor/)。此工件已從 Ktor 3.0.0 開始移除。

如果您的專案包含此工件作為依賴項，您可以安全地移除它。