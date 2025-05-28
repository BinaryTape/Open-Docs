[//]: # (title: 從 2.2.x 遷移到 3.0.x)

<show-structure for="chapter" depth="3"/>

本指南提供了如何將您的 Ktor 應用程式從 2.2.x 版本遷移到 3.0.x 版本的說明。

## Ktor 伺服器 {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment` 和 `Application`

引入了多項設計變更，以提升可配置性，並在 `ApplicationEngine`、`ApplicationEnvironment` 和 `Application` 實例之間提供更明確的分離。

在 3.0.0 版之前，`ApplicationEngine` 管理 `ApplicationEnvironment`，而 `ApplicationEnvironment` 又管理 `Application`。

然而，在目前的設計中，`Application` 負責建立、擁有並初始化 `ApplicationEngine` 和 `ApplicationEnvironment`。

這種重組帶來了以下一系列破壞性變更：

- [`ApplicationEngineEnvironmentBuilder` 和 `applicationEngineEnvironment` 類別已重新命名](#renamed-classes)。
- [`start()` 和 `stop()` 方法已從 `ApplicationEngineEnvironment` 移除](#ApplicationEnvironment)。
- [`commandLineEnvironment()` 已移除](#CommandLineConfig)。
- 引入了 `ServerConfigBuilder`。
- `embeddedServer()` 回傳 `EmbeddedServer` 而不是 `ApplicationEngine`。

這些變更將影響依賴舊模型的現有程式碼。

#### 重新命名的類別 {id="renamed-classes"}

| 套件 (Package)             | 2.x.x                                 | 3.0.x                           |
|----------------------------|---------------------------------------|---------------------------------|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment`        | `applicationEnvironment`        |

#### `ApplicationEngineEnvironment` 中的 `start()` 和 `stop()` 方法已移除 {id="ApplicationEnvironment"}

隨著 `ApplicationEngineEnvironment` 合併到 [
`ApplicationEnvironment`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/index.html)，
`start()` 和 `stop()` 方法現在
僅能透過 [
`ApplicationEngine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/index.html) 存取。

| 2.x.x                                                 | 3.0.x                                |
|-------------------------------------------------------|--------------------------------------|
| `ApplicationEngineEnvironment.start()`                | `ApplicationEngine.start()`          |
| `ApplicationEngineEnvironment.stop()`                 | `ApplicationEngine.stop()`           |

此外，在下表中，您可以看到已移除屬性及其目前對應所有權的列表：

| 2.x.x                                           | 3.0.x                                        |
|-------------------------------------------------|----------------------------------------------|
| `ApplicationEngineEnvironment.connectors`       | `ApplicationEngine.Configuration.connectors` |
| `ApplicationEnvironment.developmentMode`        | `Application.developmentMode`                |
| `ApplicationEnvironment.monitor`                | `Application.monitor`                        |
| `ApplicationEnvironment.parentCoroutineContext` | `Application.parentCoroutineContext`         |
| `ApplicationEnvironment.rootPath`               | `Application.rootPath`                       |

所有權的變更可透過以下範例說明：

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

在 Ktor `3.0.0` 中，用於從命令列引數建立 `ApplicationEngineEnvironment` 實例的 `commandLineEnvironment()` 函數已移除。相反地，您可以使用 [
`CommandLineConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html)
函數將命令列引數解析為配置物件。

要將您的應用程式從 `commandLineEnvironment` 遷移到 `CommandLineConfig`，請將 `commandLineEnvironment()` 替換為如下所示的 `configure` 區塊。

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
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="13,58-72"}

</compare>

有關 `embeddedServer` 命令列配置的更多資訊，請參閱[程式碼中的配置](server-configuration-code.topic#command-line) 主題。

#### 引入 `ServerConfigBuilder` {id="ServerConfigBuilder"}

為配置伺服器屬性，已引入一個新實體 [
`ServerConfigBuilder`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html)，
它取代了先前 `ApplicationPropertiesBuilder` 的配置機制。
`ServerConfigBuilder` 用於建構 [
`ServerConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config/index.html)
類別的實例，該類別現在持有先前由 `ApplicationProperties` 管理的模組、路徑和環境詳細資訊。

下表總結了主要的變更：

| 套件 (Package)             | 2.x.x                          | 3.0.x                 |
|----------------------------|--------------------------------|-----------------------|
| `io.ktor:ktor-server-core` | `ApplicationProperties`        | `ServerConfig`        |
| `io.ktor:ktor-server-core` | `ApplciationPropertiesBuilder` | `ServerConfigBuilder` |

此外，在 `embeddedServer()` 函數中，`applicationProperties` 屬性已重新命名為 `rootConfig`，以反映這種新的配置方法。

使用 `embeddedServer()` 時，請將 `applicationProperties` 屬性替換為
`rootConfig`。
以下是使用 `serverConfig` 區塊配置伺服器並將 `developmentMode` 明確設定為 `true` 的範例：

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

引入了 [
`EmbeddedServer`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html)
類別，並用它來取代 `embeddedServer()` 函數的 `ApplicationEngine` 回傳類型。

有關模型變更的更多詳細資訊，請參閱 [YouTrack 上的問題 KTOR-3857](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design)。

### 測試

##### `withTestApplication` 和 `withApplication` 已移除

`withTestApplication` 和 `withApplication` 函數（[先前在 `2.0.0` 版本中已棄用](migration-to-20x.md#testing-api)）現已從 `ktor-server-test-host` 軟體包中移除。

相反地，請使用 `testApplication` 函數搭配現有的 [Ktor 用戶端](client-create-and-configure.md) 實例，向您的伺服器發出請求並驗證結果。

在下面的測試中，`handleRequest` 函數已替換為 `client.get` 請求：

<compare first-title="1.x.x" second-title="3.0.x">

```kotlin
```

{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="18-26"}

```kotlin
```

{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="11-16"}

</compare>

如需更多資訊，請參閱 [](server-testing.md)。

#### `TestApplication` 模組載入 {id="test-module-loading"}

`TestApplication` 不再自動從配置檔案（例如 `application.conf`）載入模組。相反地，您必須在 `testApplication` 函數中[明確載入您的模組](#explicit-module-loading) 或[手動載入配置檔案](#configure-env)。

##### 明確模組載入 {id="explicit-module-loading"}

要明確載入模組，請在 `testApplication` 中使用 `application` 函數。這種方法允許您手動指定要載入哪些模組，從而更好地控制您的測試設定。

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

##### 從配置檔案載入模組 {id="configure-env"}

如果您想從配置檔案載入模組，請使用 `environment` 函數為您的測試指定配置檔案。

```kotlin
```

{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

有關配置測試應用程式的更多資訊，請參閱 [](server-testing.md) 章節。

### `CallLogging` 外掛程式套件已重新命名

[
`CallLogging`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html)
外掛程式套件由於拼寫錯誤已重新命名。

| 2.x.x                               | 3.0.x                                |
|-------------------------------------|--------------------------------------|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common` 模組已移除

由於 `Application` 需要了解 `ApplicationEngine`，`ktor-server-host-common` 模組的內容已合併到 `ktor-server-core` 中，即
`io.ktor.server.engine` 套件。

確保您的依賴項已相應更新。在大多數情況下，您只需移除 `ktor-server-host-common` 依賴項即可。

### `Locations` 外掛程式已移除

Ktor 伺服器的 `Locations` 外掛程式已移除。要建立類型安全的路由，請改用 [Resources 外掛程式](server-resources.md)。這需要以下變更：

* 將 `io.ktor:ktor-server-locations` artifact 替換為 `io.ktor:ktor-server-resources`。

* `Resources` 外掛程式依賴於 Kotlin 序列化外掛程式。要新增序列化外掛程式，請參閱 [kotlinx.serialization 設定](https://github.com/Kotlin/kotlinx.serialization#setup)。

* 將外掛程式的匯入從 `io.ktor.server.locations.*` 更新為 `io.ktor.server.resources.*`。

* 此外，從 `io.ktor.resources` 匯入 `Resource` 模組。

以下範例展示了如何實作這些變更：

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

有關使用 `Resources` 的更多資訊，請參閱 [](server-resources.md)。

### WebSockets 配置中 `java.time` 的替換

[WebSockets](server-websockets.md) 外掛程式的配置已更新為使用 Kotlin 的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 處理 `pingPeriod` 和 `timeout` 屬性。這取代了先前使用 `java.time.Duration` 的方式，以提供更符合 Kotlin 習慣的體驗。

要將現有程式碼遷移到新格式，請使用 `kotlin.time.Duration` 類別的擴充函數和屬性來建構持續時間。在以下範例中，`Duration.ofSeconds()` 已替換為 Kotlin 的 `seconds` 擴充功能：

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

您可以根據其他持續時間配置的需要，使用類似的 Kotlin 持續時間擴充功能（`minutes`、`hours` 等）。如需更多資訊，請參閱 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 文件。

### 伺服器 Socket `.bind()` 現在是 suspending 函數

為了支援 JS 和 WasmJS 環境中的非同步操作，`TCPSocketBuilder` 和 `UDPSocketBuilder` 中伺服器 Socket 的 `.bind()` 函數已更新為 suspending 函數。這表示任何對 `.bind()` 的呼叫現在都必須在 coroutine 內進行。

為進行遷移，請確保 `.bind()` 僅在 coroutine 或 suspending 函數中呼叫。以下是使用 `runBlocking` 的範例：

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

有關使用 Socket 的更多資訊，請參閱 [Sockets 文件](server-sockets.md)。

## 多部分表單資料 (Multipart form data)

### 二進位和檔案項目的新預設限制

在 Ktor 3.0.0 中，已為使用 [`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html) 接收二進位和檔案項目引入了 50MB 的預設限制。如果接收到的檔案或二進位項目超過 50MB 限制，將會拋出 `IOException`。

#### 覆寫預設限制

如果您的應用程式先前依賴於在沒有明確配置的情況下處理大於 50MB 的檔案，則需要更新程式碼以避免意外行為。

要覆寫預設限制，請在呼叫 `.receiveMultipart()` 時傳遞 `formFieldLimit` 參數：

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="17"}

### `PartData.FileItem.streamProvider()` 已棄用

在 Ktor 的先前版本中，`PartData.FileItem` 中的 `.streamProvider()` 函數用於將檔案項目的內容作為 `InputStream` 進行存取。從 Ktor 3.0.0 開始，此函數已棄用。

為遷移您的應用程式，請將 `.streamProvider()` 替換為 [
`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
函數。`.provider()` 函數會回傳一個 `ByteReadChannel`，這是一個對 coroutine 友好、非阻塞的抽象，用於以增量方式讀取位元組流。
然後，您可以使用 `ByteReadChannel` 提供的 [
`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html) 或 [
`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html)
方法，直接將資料從通道串流到檔案輸出。

在此範例中，`.copyAndClose()` 方法將資料從 `ByteReadChannel`
傳輸到檔案的 `WritableByteChannel`。

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

如需完整範例以及有關處理多部分表單資料的更多資訊，請參閱 [多部分表單資料的請求處理](server-requests.md#form_data)。

### Session 加密方法更新

`Sessions` 外掛程式提供的加密方法已更新，以增強安全性。

具體來說，`SessionTransportTransformerEncrypt` 方法先前是從解密後的 session 值派生 MAC，現在則是從加密後的值計算 MAC。

為確保與現有 session 的相容性，Ktor 引入了 `backwardCompatibleRead` 屬性。對於目前的配置，請在 `SessionTransportTransformerEncrypt` 的建構函數中包含此屬性：

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

有關 Ktor 中 session 加密的更多資訊，請參閱 [](server-sessions.md#sign_encrypt_session)。

## Ktor 用戶端 (Client)

### `HttpResponse` 的 `content` 屬性重新命名

在 Ktor 3.0.0 之前，`HttpResponse` 的 `content` 屬性提供了一個原始的 `ByteReadChannel`，用於從網路讀取回應內容。從 Ktor 3.0.0 開始，`content` 屬性已重新命名為 `rawContent`，以更好地反映其用途。

### `SocketTimeoutException` 現在是一個 typealias

`io.ktor.client.network.sockets` 套件中的 [
`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html)
已從 Kotlin 類別轉換為 Java 類別的別名 (alias)。此變更在某些情況下可能會導致 `NoClassDefFoundError`，並可能需要更新現有程式碼。

為遷移您的應用程式，請確保您的程式碼沒有引用舊類別，並且已使用最新的 Ktor 版本編譯。以下是如何更新例外檢查的方法：

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
    <code-block lang="kotlin">
    if (exception is io.ktor.client.network.sockets.SocketTimeoutException) { ... }
    </code-block>
    <code-block lang="kotlin">
    if (exception is java.net.SocketTimeoutException) { ... }
    </code-block>
</compare>

## 共享模組

### 遷移到 `kotlinx-io`

隨著 3.0.0 版本的發布，Ktor 已轉換為使用 `kotlinx-io` 函式庫，該函式庫在 Kotlin 函式庫中提供標準化且高效的 I/O API。此變更改善了效能、減少了記憶體分配並簡化了 I/O 處理。如果您的專案與 Ktor 的底層 I/O API 互動，您可能需要更新程式碼以確保相容性。

這影響了許多類別，例如 [
`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html)
和 [
`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)。
此外，以下 Ktor 類別現在由 `kotlinx-io` 提供支援，其先前的實作已棄用：

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

已棄用的 API 將支援到 Ktor 4.0，但我們建議盡快遷移。為遷移您的應用程式，請更新您的程式碼以利用 `kotlinx-io` 中對應的方法。

#### 範例：串流 I/O

如果您正在處理大型檔案下載並需要高效的串流解決方案，您可以將手動位元組陣列處理替換為 `kotlinx-io` 優化的串流 API。

在 Ktor 2.x 中，處理大型檔案下載通常涉及使用 `ByteReadChannel.readRemaining()` 手動讀取可用位元組，並使用 `File.appendBytes()` 將其寫入檔案：

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

在 Ktor 3.x 中，`ByteReadChannel.readRemaining()` 現在回傳一個 `Source`，透過 `Source.transferTo()` 啟用資料串流：

```Kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

這種方法將資料直接從通道傳輸到檔案的 sink，最大程度地減少記憶體分配並提高效能。

如需完整範例，請參閱 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)。

> 有關 API 替換的更多詳細資訊，請參閱 [`kotlinx-io` 文件](https://kotlinlang.org/api/kotlinx-io/)。

### 屬性鍵現在需要精確的類型匹配

在 Ktor 3.0.0 中，[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html)
實例現在按身份比較，並在儲存和檢索值時需要精確的類型匹配。這確保了類型安全，並防止因類型不匹配而導致的意外行為。

以前，可以檢索與儲存時不同泛型類型的屬性，例如使用 `getOrNull<Any>()` 來獲取 `AttributeKey<Boolean>`。

為遷移您的應用程式，請確保檢索類型與儲存類型完全匹配：

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 移除空 artifact

從 Ktor 1.0.0 開始，空的 artifact `io.ktor:ktor` 因錯誤發布到 [Maven](https://repo1.maven.org/maven2/io/ktor/ktor/)。此 artifact 已從 Ktor 3.0.0 開始移除。

如果您的專案包含此 artifact 作為依賴項，您可以安全地將其移除。