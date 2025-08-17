[//]: # (title: Ktor 3.2.0 有什麼新功能)

<show-structure for="chapter,procedure" depth="2"/>

_[發布日期：2025 年 6 月 12 日](releases.md#release-details)_

本次功能發布的重點如下：

* [版本目錄](#published-version-catalog)
* [依賴注入](#dependency-injection)
* [對 HTMX 的一流支援](#htmx-integration)
* [可暫停的模組函式](#suspendable-module-functions)

## Ktor Server

### 可暫停的模組函式

從 Ktor 3.2.0 開始，[應用程式模組](server-modules.md)支援可暫停函式。

以前，在 Ktor 模組內部新增非同步函式需要 `runBlocking` 區塊，這可能導致伺服器建立時出現死鎖：

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

#### 併發模組載入

您也可以透過新增 `ktor.application.startup = concurrent` Gradle 屬性來選擇啟用併發模組載入。它會獨立啟動所有應用程式模組，因此當一個模組暫停時，其他模組不會被阻塞。這允許依賴注入的非循序載入，在某些情況下，可以加快載入速度。

如需更多資訊，請參閱[併發模組載入](server-modules.md#concurrent-module-loading)。

### 配置檔反序列化

Ktor 3.2.0 引入了型別化配置載入，並在 `Application` 類別上新增了 `.property()` 擴充功能。您現在可以直接將結構化配置區段反序列化為 Kotlin 資料類別。

此功能簡化了您存取配置值的方式，並在處理巢狀或分組設定時顯著減少了樣板程式碼。

請考慮以下 **application.yaml** 檔案：

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

以前，您必須單獨檢索每個配置值。使用新的 `.property()` 擴充功能，您可以一次載入整個配置區段：

<compare>
<code-block lang="kotlin" code="data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig = DatabaseConfig(&#10;    url = environment.config.property(&quot;database.url&quot;).getString(),&#10;    username = environment.config.property(&quot;database.username&quot;).getString(),&#10;    password = environment.config.property(&quot;database.password&quot;).getString(),&#10;  )&#10;  // use configuration&#10;}"/>
<code-block lang="kotlin" code="@Serializable &#10;data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig: DatabaseConfig = property(&quot;database&quot;)&#10;  // use configuration&#10;}"/>
</compare>

此功能支援 HOCON 和 YAML 配置格式，並使用 `kotlinx.serialization` 進行反序列化。

### `ApplicationTestBuilder` 具有可配置的 `client`

從 Ktor 3.2.0 開始，`ApplicationTestBuilder` 類別中的 `client` 屬性是可變的。以前，它是唯讀的。此更改允許您配置自己的測試用戶端，並在 `ApplicationTestBuilder` 類別可用的任何地方重複使用它。例如，您可以從擴充功能函式內部存取用戶端：

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // 預先配置用戶端
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // 提取為擴充功能函式的可重用測試步驟
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

Ktor 3.2.0 引入了依賴注入 (DI) 支援，使其更容易直接從您的配置檔和應用程式程式碼管理和連接依賴。新的 DI 外掛程式簡化了依賴解析，支援非同步載入，提供自動清理，並與測試順暢整合。

<var name="artifact_name" value="ktor-server-di" />

要使用 DI，請在您的建置腳本中包含 `%artifact_name%` 構件：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### 基本依賴註冊

您可以透過 lambda 運算式、函式引用或建構函式引用來註冊依賴：

```kotlin
dependencies {
  // 基於 Lambda 的
  provide<GreetingService> { GreetingServiceImpl() }

  // 函式引用
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // 將 Lambda 註冊為依賴
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 基於配置的依賴註冊

您可以在配置檔中透過類別路徑引用以宣告式方式配置依賴。這支援函式和類別引用：

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

引數會透過 `@Property` 和 `@Named` 等註解自動解析。

#### 依賴解析與注入

##### 解析依賴

要解析依賴，您可以使用屬性委託或直接解析：

```kotlin
// 使用屬性委託
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

##### 非同步依賴解析

為了支援非同步載入，您可以使用暫停函式：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // 暫停直到提供
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 外掛程式將自動暫停 `resolve()` 呼叫，直到所有依賴準備就緒。

##### 注入到應用程式模組

您可以透過指定模組參數將依賴直接注入到應用程式模組中。Ktor 將從 DI 容器中解析它們：

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

使用 `@Named` 注入特定鍵名的依賴：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名為 "mongo" 的依賴
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

這簡化了結構化配置的工作，並支援基本型別的自動解析。

如需更多資訊和進階用法，請參閱[依賴注入](server-dependency-injection.md)。

## Ktor Client

### `SaveBodyPlugin` 和 `HttpRequestBuilder.skipSavingBody()` 已棄用

在 Ktor 3.2.0 之前，`SaveBodyPlugin` 預設安裝。它將整個回應主體快取在記憶體中，允許多次存取。為了避免儲存回應主體，必須明確停用該外掛程式。

從 Ktor 3.2.0 開始，`SaveBodyPlugin` 已棄用，並由一個新的內部外掛程式取代，該外掛程式會自動儲存所有非串流請求的回應主體。這改進了資源管理並簡化了 HTTP 回應生命週期。

`HttpRequestBuilder.skipSavingBody()` 也已棄用。如果您需要在不快取主體的情況下處理回應，請改用串流方法。

<compare first-title="之前" second-title="之後">

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

此方法直接串流回應，防止主體儲存到記憶體中。

### `.wrapWithContent()` 和 `.wrap()` 擴充功能函式已棄用

在 Ktor 3.2.0 中，[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) 和 [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) 擴充功能函式已棄用，取而代之的是新的 `.replaceResponse()` 函式。

`.wrapWithContent()` 和 `.wrap()` 函式用 `ByteReadChannel` 替換原始回應主體，該通道只能讀取一次。如果直接傳遞相同的通道實例而不是返回新通道的函式，則多次讀取主體將會失敗。這可能會破壞不同存取回應主體的外掛程式之間的相容性，因為第一個讀取它的外掛程式會消耗主體：

```kotlin
// 用從 rawContent 解碼一次的通道替換主體
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// 第一次呼叫返回主體
decodedResponse.bodyAsText()

// 後續呼叫返回空字串
decodedResponse.bodyAsText() 
```

為避免此問題，請改用 `.replaceResponse()` 函式。它接受一個 lambda 運算式，該 lambda 運算式在每次存取時返回一個新通道，確保與其他外掛程式的安全整合：

```kotlin
// 每次存取時用新的解碼通道替換主體
call.replaceResponse {
    decode(response.rawContent)
}
```

### 存取已解析的 IP 位址

您現在可以使用 `io.ktor.network.sockets.InetSocketAddress` 實例上的新 `.resolveAddress()` 函式。此函式允許您取得關聯主機的原始解析 IP 位址：

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

它將解析的 IP 位址作為 `ByteArray` 返回，如果無法解析該位址則返回 `null`。返回的 `ByteArray` 的大小取決於 IP 版本：對於 IPv4 位址，它將包含 4 位元組；對於 IPv6 位址，它將包含 16 位元組。在 JS 和 Wasm 平台上，`.resolveAddress()` 將始終返回 `null`。

## Shared

### HTMX 整合

Ktor 3.2.0 引入了對 [HTMX](https://htmx.org/) 的實驗性支援，HTMX 是一個現代 JavaScript 函式庫，可透過 `hx-get` 和 `hx-swap` 等 HTML 屬性實現動態互動。Ktor 的 HTMX 整合提供：

- 支援 HTMX 的路由，用於根據標頭處理 HTMX 請求。
- HTML DSL 擴充功能，用於在 Kotlin 中生成 HTMX 屬性。
- HTMX 標頭常數和值，以消除字串常值。

Ktor 的 HTMX 支援可在三個實驗性模組中使用：

| 模組                | 描述                              |
|--------------------|-----------------------------------|
| `ktor-htmx`        | 核心定義和標頭常數                |
| `ktor-htmx-html`   | 與 Kotlin HTML DSL 的整合         |
| `ktor-server-htmx` | 對 HTMX 特定請求的路由支援        |

所有 API 都標記為 `@ExperimentalKtorApi`，並需要透過 `@OptIn(ExperimentalKtorApi::class)` 選擇啟用。
如需更多資訊，請參閱 [HTMX 整合](htmx-integration.md)。

## Unix 網域通訊端

在 3.2.0 中，您可以設定 Ktor 用戶端連接到 Unix 網域通訊端，並設定 Ktor 伺服器監聽這些通訊端。目前，Unix 網域通訊端僅在 CIO 引擎中支援。

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

使用 Ktor 用戶端連接到該通訊端：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

您還可以在[預設請求](client-default-request.md#unix-domain-sockets)中使用 Unix 網域通訊端。

## Infrastructure

### 已發布的版本目錄

透過此版本，您現在可以使用官方[已發布的版本目錄](server-dependencies.topic#using-version-catalog)從單一來源管理所有 Ktor 依賴。這消除了手動在依賴中聲明 Ktor 版本的需要。

要將目錄新增到您的專案中，請在 **settings.gradle.kts** 中配置 Gradle 的版本目錄，然後在您的模組的 **build.gradle.kts** 檔案中引用它：

<Tabs>
<TabItem title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</TabItem>
<TabItem title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</TabItem>
</Tabs>

## Gradle 外掛程式

### 啟用開發模式

Ktor 3.2.0 簡化了開發模式的啟用。以前，啟用開發模式需要 `application` 區塊中的明確配置。現在，您可以使用 `ktor.development` 屬性來動態或明確地啟用它：

* 根據專案屬性動態啟用開發模式。
  ```kotlin
    ktor {
        development = project.ext.has("development")
    }
  ```
* 明確設定開發模式為 true。

    ```kotlin
    ktor {
        development = true
    }
    ```

預設情況下，如果 Gradle 專案屬性或系統屬性 `io.ktor.development` 中的任何一個已定義，則會自動解析 `ktor.development` 的值。這允許您直接使用 Gradle CLI 旗標啟用開發模式：

```bash
./gradlew run -Pio.ktor.development=true