[//]: # (title: Ktor 3.4.0 新功能)

<show-structure for="chapter,procedure" depth="2"/>

_[發佈日期：2026 年 1 月 23 日](releases.md#release-details)_

Ktor 3.4.0 在伺服器、用戶端及工具方面提供廣泛的增強功能。以下是此功能版本的重點摘要：

* [Zstd 壓縮支援](#zstd-compression-support)
* [HTTP 請求生命週期](#http-request-lifecycle)
* [執行時 OpenAPI 路由註解](#runtime-openapi-route-annotations)
* [OkHttp 的全雙工串流](#duplex-streaming-for-okhttp)

## Ktor 伺服器

### OAuth 錯誤處理的備援機制

Ktor 3.4.0 為 [OAuth](server-oauth.md) 驗證提供者引入了新的 [`fallback()`](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-authentication-provider/-config/fallback.html) 函式。
當 OAuth 流程因 `AuthenticationFailedCause.Error`（例如權杖交換失敗、網路問題或回應剖析錯誤）而失敗時，會呼叫該備援函式。

在此之前，您可能在受 OAuth 保護的路由上使用 `authenticate(optional = true)` 來繞過 OAuth 失敗。然而，選用驗證僅在未提供憑據時抑制挑戰（Challenge），並不涵蓋實際的 OAuth 錯誤。

新的 `fallback()` 函式為處理這些情境提供了專用機制。如果備援函式未處理該呼叫，Ktor 將傳回 `401 Unauthorized`。

若要配置備援機制，請在 `oauth` 區塊內定義：

```kotlin
install(Authentication) {
    oauth("login") {
        client = ...
        urlProvider = ...
        providerLookup = { ... }
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

### Zstd 壓縮支援

[Compression](server-compression.md) 外掛程式現在支援 [Zstd](https://github.com/facebook/zstd) 壓縮。

`Zstd` 是一種快速壓縮演算法，提供高壓縮比和低壓縮時間，並具有可配置的壓縮級別。 

若要啟用它，請將 `ktor-server-compression-zstd` 相依性新增到您的專案：
```kotlin
implementation("io.ktor:ktor-server-compression-zstd:$ktor_version")
```

然後，在 `install(Compression) {}` 區塊內呼叫 `zstd()` 函式並進行所需配置：

```kotlin
install(Compression) {
    gzip()
    deflate()
    zstd(level = 3)
    identity()
}
```

### 配置檔案中的 SSL 信任存放區設定

Ktor 現在允許您使用應用程式配置檔案為伺服器配置額外的 [SSL 設定](server-ssl.md#config-file)。您可以直接在配置中指定信任存放區（Trust Store）、其對應的密碼以及啟用的 TLS 協定清單。

您可以在 `ktor.security.ssl` 區段下定義這些設定：

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

從上述程式碼中：
- `trustStore` – 包含受信任憑證的信任存放區檔案路徑。
- `trustStorePassword` – 信任存放區的密碼。
- `enabledProtocols` – 允許的 TLS 協定清單。

### 用於部分回應的 HTML 片段

Ktor 現在提供一個新的 [`.respondHtmlFragment()`](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html-fragment.html) 函式，用於傳送部分 HTML 回應。當產生的標記不需要完整的 `<html>` 文件時（例如使用 HTMX 等工具進行動態 UI 更新），這非常有用。

此新 API 是 [HTML DSL](server-html-dsl.md) 外掛程式的一部分，允許您傳回根植於任何元素的 HTML：

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

### HTTP 請求生命週期

新的 [`HttpRequestLifecycle` 外掛程式](server-http-request-lifecycle.md)允許您在用戶端中斷連線時取消正在進行的 HTTP 請求。當您需要在用戶端斷開連線時，取消耗時較長或資源密集型請求的在途 HTTP 請求時，這非常有用。 

透過安裝 `HttpRequestLifecycle` 外掛程式並將 `cancelCallOnClose` 設為 `true` 來啟用此功能：

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

當用戶端中斷連線時，處理該請求的協同程式會被取消，且結構化並行（Structured Concurrency）會處理所有資源的清理。由該請求啟動的任何 `launch` 或 `async` 協同程式也會被取消。
目前僅 `Netty` 和 `CIO` 引擎支援此功能。

### 回應資源的新方法

新的 [`call.respondResource()`](server-responses.md#resource) 方法與 [`call.respondFile()`](server-responses.md#file) 類似，但它接受資源而非檔案作為回應內容。

若要提供來自類別路徑（Classpath）的單一資源，請使用 `call.respondResource()` 並指定資源路徑：

```kotlin
routing {
    get("/resource") {
        call.respondResource("public/index.html")
    }
}
```

### 執行時 OpenAPI 路由註解

<primary-label ref="experimental"/>

Ktor 3.4.0 引入了 `ktor-server-routing-openapi` 模組，允許您使用執行時註解直接將 OpenAPI 中繼資料附加到路由。這些註解在執行時套用於路由，並成為路由樹的一部分，供 OpenAPI 相關工具使用。

此 API 尚處於實驗階段，需要使用 `@OptIn(ExperimentalKtorApi::class)` 加入。

若要在執行時為路由新增中繼資料，請使用 `.describe {}` 擴充函式：

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

您可以將此 API 作為獨立擴充使用，或結合 Ktor 的 OpenAPI 編譯器外掛程式來自動產生這些呼叫。[OpenAPI](server-openapi.md) 和 [SwaggerUI](server-swagger-ui.md) 外掛程式在建置 OpenAPI 規格時也會讀取此中繼資料。

> 在 Ktor 3.4.0 中，`SwaggerUI` 和 `OpenAPI` 外掛程式現在需要 `ktor-server-routing-openapi` 相依性。
> 這並非故意的重大變更，將在 3.4.1 版本中修正。
> 如果您使用其中任一外掛程式，請手動新增相依性以避免執行時錯誤。
> 
{style="warning"}

如需更多細節和範例，請參閱[執行時路由註解](openapi-spec-generation.md#runtime-route-annotations)。

### API Key 驗證

新的 [API Key 驗證外掛程式](server-api-key-auth.md)允許您使用隨每個請求傳送的共用金鑰（通常位於 HTTP 標頭中）來保護伺服器路由。

`apiKey` 提供者與 Ktor 的 [Authentication 外掛程式](server-auth.md)整合，讓您可以使用自訂邏輯驗證傳入的 API 金鑰、自訂標頭名稱，並使用標準的 `authenticate` 區塊保護特定路由：

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
API Key 驗證可用於服務對服務（Service-to-service）通訊以及其他輕量級驗證機制足以應付的場景。

如需更多細節和配置選項，請參閱 [API Key 驗證](server-api-key-auth.md)。

## 核心

### 多標頭剖析

新的 [`Headers.getSplitValues()`](https://api.ktor.io/ktor-http/io.ktor.http/get-split-values.html) 函式簡化了處理在單行中包含多個值的標頭。

`getSplitValues()` 函式會傳回指定標頭的所有值，並使用指定的間隔符號（預設為 `,`）拆分它們：

```kotlin
val headers = headers {
    append("X-Multi-Header", "1, 2")
    append("X-Multi-Header", "3")
}

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```
預設情況下，雙引號字串內的間隔符號會被忽略，但您可以透過將 `splitInsideQuotes` 設定為 `true` 來變更此行為：

```kotlin
val headers = headers {
    append("X-Multi-Header", """a,"b,c",d""")
}

val forceSplit = headers.getSplitValues("X-Quoted", splitInsideQuotes = true)
// ["a", "\"b", "c\"", "d"]
```

## Ktor 用戶端

### 驗證權杖快取控制

在 Ktor 3.4.0 之前，使用 [Basic](client-basic-auth.md) 和 [Bearer 驗證](client-bearer-auth.md)提供者的應用程式，在使用者登出或更新其驗證資料後，可能會繼續傳送過時的權杖或憑據。這是因為每個提供者都會透過負責儲存已載入驗證權杖的內部組件，在內部快取 `loadTokens()` 函式的結果，而此快取會保持有效直到手動清除。

Ktor 3.4.0 引入了新的函式和配置選項，讓您可以對權杖快取行為進行明確且便利的控制。

#### 存取並清除驗證權杖

您現在可以直接從用戶端存取驗證提供者，並在需要時清除其快取的權杖。

若要清除特定提供者的權杖，請使用 `.clearToken()` 函式：

```kotlin
val provider = client.authProvider<BearerAuthProvider>()
provider?.clearToken()
```

擷取所有驗證提供者：

```kotlin
val providers = client.authProviders
```

若要清除所有支援權杖清除的提供者（目前為 Basic 和 Bearer）之快取權杖，請使用 `HttpClient.clearAuthTokens()` 函式：

```kotlin
 // 登出時清除所有快取的驗證權杖
fun logout() {
    client.clearAuthTokens()
    storage.deleteTokens()
}

// 憑據更新時清除快取的驗證權杖
fun updateCredentials(new: Credentials) {
    storage.save(new)
    client.clearAuthTokens()  // 強制重新載入
}
```

#### 配置權杖快取行為

Basic 和 Bearer 驗證提供者均新增了 `cacheTokens` 配置選項。這允許您控制是否應在請求之間快取權杖或憑據。

例如，當憑據是動態提供時，您可以停用快取：

```kotlin
basic {
    cacheTokens = false  // 每次請求都載入憑據
    credentials {
        getCurrentUserCredentials()
    }
}
```

當驗證資料頻繁變動或必須始終反映最新狀態時，停用快取特別有用。

### OkHttp 的全雙工串流

OkHttp 用戶端引擎現在支援全雙工串流，讓用戶端能夠同時傳送請求主體資料並接收回應資料。

與一般的 HTTP 呼叫（必須在回應開始前完整傳送請求主體）不同，全雙工模式支援雙向串流，允許用戶端同時傳送與接收資料。

全雙工串流可用於 HTTP/2 連線，並可透過 `OkHttpConfig` 中新的 `duplexStreamingEnabled` 屬性啟用：

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

### Apache5 連線管理器配置

Apache5 引擎現在支援使用新的 [`configureConnectionManager {}`](https://api.ktor.io/ktor-client-apache5/io.ktor.client.engine.apache5/-apache5-engine-config/configure-connection-manager.html) 函式直接配置連線管理器。

建議使用此方法而非之前使用 `customizeClient { setConnectionManager(...) }` 的方法。使用 `customizeClient` 會取代 Ktor 管理的連線管理器，可能會繞過引擎設定、逾時（Timeout）及其他內部配置。

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

新的 `configureConnectionManager {}` 函式讓 Ktor 保持控制，同時允許您調整參數，例如每個路由的最大連線數（`maxConnPerRoute`）和總最大連線數（`maxConnTotal`）。

### 原生用戶端引擎的 Dispatcher 配置

原生 HTTP 用戶端引擎（`Curl`、`Darwin` 和 `WinHttp`）現在會遵循配置的引擎 Dispatcher，並預設使用 `Dispatchers.IO`。

`dispatcher` 屬性一直存在於用戶端引擎配置中，但原生引擎以前會忽略它並始終使用 `Dispatchers.Unconfined`。透過此變更，原生引擎會使用配置的 Dispatcher，並在未指定時預設為 `Dispatchers.IO`，使其行為與其他 Ktor 用戶端引擎一致。

您可以如下所示明確配置 Dispatcher：

```kotlin
val client = HttpClient(Curl) {
    engine {
        dispatcher = Dispatchers.IO
    }
}
```
### 使用引擎 Dispatcher 執行 HttpStatement {id="use-engine-dispatcher"}

> 在 Ktor 3.4.1 中，此行為在 JVM 上為選用加入，以保持回溯相容性，因為預設啟用它可能會破壞某些在內部使用 Ktor 的程式庫。
> 若要啟用它，請將 `io.ktor.client.statement.useEngineDispatcher` JVM 系統屬性設為 `true`
>  ```shell
>  -Dio.ktor.client.statement.useEngineDispatcher=true
>  ```
> 此選項將在未來版本中成為預設值，因此我們建議儘早加入。
>
{style="warning"}

`HttpStatement.execute {}` 和 `HttpStatement.body {}` 區塊現在在 HTTP 引擎的 Dispatcher 上執行，而非呼叫者的協同程式內容。這可以防止當這些區塊從主執行緒調用時意外發生阻塞。

在此之前，使用者必須使用 `withContext` 手動切換 Dispatcher，以避免在 I/O 操作（例如將串流回應寫入檔案）期間凍結 UI。透過此變更，Ktor 會自動將這些區塊分派到引擎的協同程式內容：

<compare>

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    withContext(Dispatchers.IO) {
        val channel: ByteReadChannel = httpResponse.body()
        // 處理並寫入資料
    }
}
```

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    // 處理並寫入資料
}
```
</compare>

### 外掛程式與預設請求配置替換

Ktor 用戶端配置現在為執行時替換現有設定提供了更多控制權。

#### 替換外掛程式配置

新的 [`installOrReplace()`](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/install-or-replace.html) 函式會安裝用戶端外掛程式，或者如果該外掛程式已安裝，則替換其現有配置。當您需要重新配置外掛程式而不想先手動移除它時，這非常有用。

```kotlin
val client = HttpClient {
    installOrReplace(ContentNegotiation) {
        json()
    }
}
```

在上面的範例中，如果已安裝 `ContentNegotiation`，其配置將被區塊中提供的新配置取代。

#### 替換預設請求配置

[`defaultRequest()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/default-request.html) 函式現在接受一個選用的 `replace` 參數（預設為 `false`）。當設為 `true` 時，新配置將取代之前定義的任何預設請求設定，而不是與之合併。

```kotlin
val client = HttpClient {
    defaultRequest(replace = true) {
        // ...
    }
}
```

這允許您在組合或重複使用用戶端設定時，明確覆蓋早前的預設請求配置。

### `js` 與 `wasmJs` 目標的共用來源集支援

Ktor 現在支援多平台專案中的 [Kotlin 共用 `web` 來源集](https://kotlinlang.org/docs/whatsnew2220.html#shared-source-set-for-js-and-wasmjs-targets)，允許您在 `js` 與 `wasmJs` 目標之間共用 Ktor 相依性。這使得在 JavaScript 和 Wasm/JS 之間共用 Web 特定的用戶端程式碼（例如 HTTP 用戶端和引擎）變得更加容易。

在您的
<Path>build.gradle.kts</Path>
檔案中，您可以在 `webMain` 原始碼集中宣告 Ktor 相依性：

```kotlin
kotlin {
    sourceSets {
        webMain.dependencies {
            implementation("io.ktor:ktor-client-js:%ktor_version%")
        }
    }
}
```

接著您可以使用這兩個目標共用的 API：

```kotlin
// src/webMain/kotlin/Main.kt

actual fun createClient(): HttpClient = HttpClient(Js)
```

## I/O

### 從 `ByteReadChannel` 將位元組串流至 `RawSink`

您現在可以使用新的 [`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 函式從通道讀取位元組並將其直接寫入指定的 `RawSink`。此函式簡化了大型回應或檔案下載的處理，無需中間緩衝區或手動複製。

以下範例下載一個檔案並將其寫入新的本機檔案：

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

println("A file saved to ${file.path}")

```

## Gradle 外掛程式

### OpenAPI 編譯器擴充

在此之前，OpenAPI 編譯器外掛程式在組建時會產生完整的靜態 OpenAPI 文件。在 Ktor 3.4.0 中，它改為產生在執行時提供 OpenAPI 中繼資料的程式碼，這些中繼資料在提供規格時由 [OpenAPI](server-openapi.md) 和 [Swagger UI](server-swagger-ui.md) 外掛程式使用。

專用的 `buildOpenApi` Gradle 任務已被移除。編譯器外掛程式現在會在一般組建期間自動套用，對路由或註解的變更會反映在執行中的伺服器中，無需任何額外的產生步驟。

#### 配置

配置仍透過 `ktor` Gradle 擴充內的 `openApi {}` 區塊完成。然而，用於定義全域 OpenAPI 中繼資料的屬性（例如 `title`、`version`、`description` 和 `target`）已被棄用且會被忽略。

全域 OpenAPI 中繼資料現在於執行時而非編譯期間定義與解析。

編譯器擴充配置現在僅限於控制如何推論與收集中繼資料的功能選項。

對於從 Ktor 3.3.0 實驗性預覽版遷移的使用者，配置變更如下：

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
        // 編譯器外掛程式的全域控制
        enabled = true
        // 啟用與停用從呼叫處理程式程式碼推論詳細資料
        codeInferenceEnabled = true
        // 切換是否應分析所有路由或僅分析加上註解的路由
        onlyCommented = false
    }
}
```

</compare>