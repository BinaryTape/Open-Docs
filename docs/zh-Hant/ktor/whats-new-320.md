[//]: # (title: Ktor 3.2.0 有哪些新功能)

<show-structure for="chapter,procedure" depth="2"/>

_發佈日期：2025 年 6 月 12 日](releases.md#release-details)_

本次功能發佈的亮點包括：

* [版本目錄](#published-version-catalog)
* [依賴注入](#dependency-injection)
* [一流的 HTMX 支援](#htmx-integration)
* [可暫停的模組函數](#suspendable-module-functions)

## Ktor Server

### 可暫停的模組函數

從 Ktor 3.2.0 開始，[應用程式模組](server-modules.md)已支援可暫停函數。

之前，在 Ktor 模組中新增非同步函數需要使用 `runBlocking` 區塊，這可能導致伺服器建立時發生死鎖：

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

您現在可以使用 `suspend` 關鍵字，允許在應用程式啟動時執行非同步程式碼：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 並行模組載入

您也可以透過新增 `ktor.application.startup = concurrent` Gradle 屬性來選擇啟用並行模組載入。它會獨立啟動所有應用程式模組，因此當一個模組暫停時，其他模組不會被阻擋。這允許依賴注入的非序列載入，在某些情況下，還可以加快載入速度。

更多資訊請參閱 [並行模組載入](server-modules.md#concurrent-module-loading)。

### 配置檔反序列化

Ktor 3.2.0 引入了型別化配置載入，在 `Application` 類別上新增了 `.property()` 擴充功能。您現在可以直接將結構化配置區段反序列化為 Kotlin 資料類別。

此功能簡化了您存取配置值的方式，並顯著減少了處理巢狀或分組設定時的樣板程式碼。

考慮以下 **application.yaml** 檔案：

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

之前，您必須單獨檢索每個配置值。藉由新的 `.property()` 擴充功能，您可以一次載入整個配置區段：

<compare>
[object Promise]
[object Promise]
</compare>

此功能支援 HOCON 和 YAML 配置格式，並使用 `kotlinx.serialization` 進行反序列化。

### `ApplicationTestBuilder` 的 `client` 可配置

從 Ktor 3.2.0 開始，`ApplicationTestBuilder` 類別中的 `client` 屬性是可變的。之前，該屬性是唯讀的。這項變更讓您可以配置自己的測試客戶端，並在 `ApplicationTestBuilder` 類別可用的任何地方重複使用它。例如，您可以從擴充函數內部存取客戶端：

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // Pre-configure the client
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // Reusable test step extracted into an extension-function
    auth(token = AuthToken("swordfish"))

    val response = client.get("/route")
    assertEquals(OK, response.status)
}

private fun ApplicationTestBuilder.auth(token: AuthToken) {
    val response = client.post("/auth") {
        setBody(token)
    }
    assertEquals(OK, response.status)
}
```

### 依賴注入

Ktor 3.2.0 引入了依賴注入（DI）支援，讓您可以更輕鬆地直接從配置檔和應用程式程式碼中管理及連線依賴。新的 DI 外掛程式簡化了依賴解析、支援非同步載入、提供自動清理，並與測試流暢整合。

<var name="artifact_name" value="ktor-server-di" />

要使用 DI，請在您的建置指令碼中包含 `%artifact_name%` artifact：

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

#### 基本依賴註冊

您可以使用 lambda、函數參考或建構函式參考來註冊依賴項目：

```kotlin
dependencies {
  // Lambda-based
  provide<GreetingService> { GreetingServiceImpl() }

  // Function references
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // Registering a lambda as a dependency
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 基於配置的依賴註冊

您可以使用配置檔中的 Classpath 參考宣告式地配置依賴項目。這支援函數和類別參考：

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // implementation 
}
```

參數會透過 `@Property` 和 `@Named` 等註解自動解析。

#### 依賴解析與注入

##### 解析依賴項目

要解析依賴項目，您可以使用屬性委託或直接解析：

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

##### 非同步依賴解析

為支援非同步載入，您可以使用可暫停函數：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 外掛程式會自動暫停 `resolve()` 呼叫，直到所有依賴項目準備就緒。

##### 注入應用程式模組

您可以透過指定模組參數將依賴項目直接注入應用程式模組。Ktor 將從 DI 容器中解析它們：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt
    modules:
      - com.example.LoggingKt.logging
```

```kotlin
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

使用 `@Named` 注入具有特定鍵的依賴項目：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

##### 屬性與配置注入

使用 `@Property` 直接注入配置值：

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

這簡化了使用結構化配置的工作，並支援基本型別的自動解析。

更多資訊和進階用法，請參閱 [](server-dependency-injection.md)。

## Ktor 客戶端

### `SaveBodyPlugin` 和 `HttpRequestBuilder.skipSavingBody()` 已棄用

在 Ktor 3.2.0 之前，`SaveBodyPlugin` 預設會安裝。它會將整個回應主體快取在記憶體中，允許多次存取。為避免儲存回應主體，該外掛程式必須明確停用。

從 Ktor 3.2.0 開始，`SaveBodyPlugin` 已棄用，並由一個新的內部外掛程式取代，該外掛程式會自動為所有非串流請求儲存回應主體。這改善了資源管理並簡化了 HTTP 回應生命週期。

`HttpRequestBuilder.skipSavingBody()` 也已棄用。如果您需要處理不快取主體的回應，請改用串流方法。

<compare first-title="Before" second-title="After">

```kotlin
val file = client.get("/some-file") {
    skipSavingBody()
}.bodyAsChannel()
saveFile(file)
```
```kotlin
client.prepareGet("/some-file").execute { response ->
    saveFile(response.bodyAsChannel())
}
```

</compare>

此方法直接串流回應，防止主體儲存在記憶體中。

### `.wrapWithContent()` 和 `.wrap()` 擴充函數已棄用

在 Ktor 3.2.0 中，[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) 和 [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) 擴充函數已棄用，取而代之的是新的 `.replaceResponse()` 函數。

`.wrapWithContent()` 和 `.wrap()` 函數用只能讀取一次的 `ByteReadChannel` 取代原始回應主體。如果直接傳遞相同的通道實例，而非傳回新通道的函數，則多次讀取主體將會失敗。這可能會破壞不同存取回應主體的外掛程式之間的相容性，因為第一個讀取它的外掛程式會消耗主體：

```kotlin
// Replaces the body with a channel decoded once from rawContent
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// The first call returns the body
decodedResponse.bodyAsText()

// Subsequent calls return an empty string
decodedResponse.bodyAsText() 
```

為避免此問題，請改用 `.replaceResponse()` 函數。它接受一個 lambda，每次存取時都會傳回一個新通道，確保與其他外掛程式安全整合：

```kotlin
// Replaces the body with a new decoded channel on each access
call.replaceResponse {
    decode(response.rawContent)
}
```

### 存取已解析的 IP 位址

您現在可以在 `io.ktor.network.sockets.InetSocketAddress` 實例上使用新的 `.resolveAddress()` 函數。此函數允許您取得相關聯主機的原始已解析 IP 位址：

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

它會將已解析的 IP 位址作為 `ByteArray` 傳回，如果位址無法解析則傳回 `null`。傳回的 `ByteArray` 大小取決於 IP 版本：IPv4 位址將包含 4 位元組，IPv6 位址將包含 16 位元組。在 JS 和 Wasm 平台上，`.resolveAddress()` 將始終傳回 `null`。

## 共享

### HTMX 整合

Ktor 3.2.0 引入了對 [HTMX](https://htmx.org/) 的實驗性支援，HTMX 是一個現代 JavaScript 函式庫，可透過 `hx-get` 和 `hx-swap` 等 HTML 屬性啟用動態互動。Ktor 的 HTMX 整合提供：

- HTMX 感知的路由，用於根據標頭處理 HTMX 請求。
- HTML DSL 擴充功能，用於在 Kotlin 中產生 HTMX 屬性。
- HTMX 標頭常數和值，以消除字串文字。

Ktor 的 HTMX 支援可在三個實驗性模組中取得：

| 模組             | 描述                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定義和標頭常數                      |
| `ktor-htmx-html`   | 與 Kotlin HTML DSL 的整合       |
| `ktor-server-htmx` | HTMX 特定請求的路由支援 |

所有 API 都標記有 `@ExperimentalKtorApi`，並需要透過 `@OptIn(ExperimentalKtorApi::class)` 選擇啟用。更多資訊請參閱 [](htmx-integration.md)。

## Unix 網域通訊端

在 3.2.0 中，您可以設定 Ktor 客戶端以連接至 Unix 網域通訊端，並設定 Ktor 伺服器以監聽這類通訊端。目前，Unix 網域通訊端僅在 CIO 引擎中支援。

伺服器配置範例：

```kotlin
val server = embeddedServer(CIO, configure = {
    unixConnector("/tmp/test-unix-socket-ktor.sock")
}) {
    routing {
        get("/") {
            call.respondText("Hello, Unix socket world!")
        }
    }
}
```

使用 Ktor 客戶端連接到該通訊端：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您也可以在 [預設請求](client-default-request.md#unix-domain-sockets) 中使用 Unix 網域通訊端。

## 基礎設施

### 已發佈的版本目錄

藉由此版本，您現在可以使用官方 [已發佈的版本目錄](server-dependencies.topic#using-version-catalog) 從單一來源管理所有 Ktor 依賴項目。這消除了在您的依賴項目中手動宣告 Ktor 版本的需要。

若要將目錄新增至您的專案，請在 **settings.gradle.kts** 中配置 Gradle 的版本目錄，然後在模組的 **build.gradle.kts** 檔案中引用它：

<tabs>
<tab title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</tab>
<tab title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</tab>
</tabs>

## Gradle 外掛程式

### 啟用開發模式

Ktor 3.2.0 簡化了啟用開發模式的過程。之前，啟用開發模式需要在 `application` 區塊中進行明確配置。現在，您可以使用 `ktor.development` 屬性來啟用它，無論是動態還是明確地：

* 根據專案屬性動態啟用開發模式。
  ```kotlin
    ktor {
        development = project.ext.has("development")
    }
  ```
* 明確將開發模式設定為 true。

    ```kotlin
    ktor {
        development = true
    }
    ```

依預設，如果定義了 Gradle 專案屬性或系統屬性 `io.ktor.development`，`ktor.development` 值會自動從中解析。這允許您使用 Gradle CLI 旗標直接啟用開發模式：

```bash
./gradlew run -Pio.ktor.development=true
```