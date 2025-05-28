[//]: # (title: 從 1.6.x 遷移到 2.0.x)

<show-structure for="chapter" depth="2"/>

本指南提供如何將您的 Ktor 應用程式從 1.6.x 版本遷移到 2.0.x 的說明。

## Ktor 伺服器 {id="server"}
### 伺服器程式碼已移至 'io.ktor.server.*' 套件 {id="server-package"}
為了統一並更好地區分伺服器與客戶端 API，伺服器程式碼已移至 `io.ktor.server.*` 套件 ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865))。
這表示您需要更新應用程式中的 [依賴項](#server-package-dependencies) 和 [匯入](#server-package-imports)，如下所示。

#### 依賴項 {id="server-package-dependencies"}
| 子系統                                           |               1.6.x               |                                                                                2.0.0 |
|:----------------------------------------------------|:---------------------------------:|-------------------------------------------------------------------------------------:|
| [Locations](https://ktor.io/docs/server-locations.html)                    |     `io.ktor:ktor-locations`      |                                                      `io.ktor:ktor-server-locations` |
| [Webjars](server-webjars.md)                        |      `io.ktor:ktor-webjars`       |                                                        `io.ktor:ktor-server-webjars` |
| [AutoHeadResponse](server-autoheadresponse.md)      |    `io.ktor:ktor-server-core`     |                                             `io.ktor:ktor-server-auto-head-response` |
| [StatusPages](server-status-pages.md)               |    `io.ktor:ktor-server-core`     |                                                   `io.ktor:ktor-server-status-pages` |
| [CallId](server-call-id.md)                         |    `io.ktor:ktor-server-core`     |                                                        `io.ktor:ktor-server-call-id` |
| [DoubleReceive](server-double-receive.md)           |    `io.ktor:ktor-server-core`     |                                                 `io.ktor:ktor-server-double-receive` |
| [HTML DSL](server-html-dsl.md)                      |    `io.ktor:ktor-html-builder`    |                                                   `io.ktor:ktor-server-html-builder` |
| [FreeMarker](server-freemarker.md)                  |     `io.ktor:ktor-freemarker`     |                                                     `io.ktor:ktor-server-freemarker` |
| [Velocity](server-velocity.md)                      |      `io.ktor:ktor-velocity`      |                                                       `io.ktor:ktor-server-velocity` |
| [Mustache](server-mustache.md)                      |      `io.ktor:ktor-mustache`      |                                                       `io.ktor:ktor-server-mustache` |
| [Thymeleaf](server-thymeleaf.md)                    |     `io.ktor:ktor-thymeleaf`      |                                                      `io.ktor:ktor-server-thymeleaf` |
| [Pebble](server-pebble.md)                          |       `io.ktor:ktor-pebble`       |                                                         `io.ktor:ktor-server-pebble` |
| [kotlinx.serialization](server-serialization.md)    |   `io.ktor:ktor-serialization`    | `io.ktor:ktor-server-content-negotiation`, `io.ktor:ktor-serialization-kotlinx-json` |
| [Gson](server-serialization.md)                     |        `io.ktor:ktor-gson`        |         `io.ktor:ktor-server-content-negotiation`, `io.ktor:ktor-serialization-gson` |
| [Jackson](server-serialization.md)                  |      `io.ktor:ktor-jackson`       |      `io.ktor:ktor-server-content-negotiation`, `io.ktor:ktor-serialization-jackson` |
| [Authentication](server-auth.md)                    |        `io.ktor:ktor-auth`        |                                                           `io.ktor:ktor-server-auth` |
| [JWT authentication](server-jwt.md)                 |      `io.ktor:ktor-auth-jwt`      |                                                       `io.ktor:ktor-server-auth-jwt` |
| [LDAP authentication](server-ldap.md)               |     `io.ktor:ktor-auth-ldap`      |                                                      `io.ktor:ktor-server-auth-ldap` |
| [DataConversion](server-data-conversion.md)         |    `io.ktor:ktor-server-core`     |                                                `io.ktor:ktor-server-data-conversion` |
| [DefaultHeaders](server-default-headers.md)         |    `io.ktor:ktor-server-core`     |                                                `io.ktor:ktor-server-default-headers` |
| [Compression](server-compression.md)                |    `io.ktor:ktor-server-core`     |                                                    `io.ktor:ktor-server-compression` |
| [CachingHeaders](server-caching-headers.md)         |    `io.ktor:ktor-server-core`     |                                                `io.ktor:ktor-server-caching-headers` |
| [ConditionalHeaders](server-conditional-headers.md) |    `io.ktor:ktor-server-core`     |                                            `io.ktor:ktor-server-conditional-headers` |
| [CORS](server-cors.md)                              |    `io.ktor:ktor-server-core`     |                                                           `io.ktor:ktor-server-cors` |
| [Forwarded headers](server-forward-headers.md)      |    `io.ktor:ktor-server-core`     |                                               `io.ktor:ktor-server-forwarded-header` |
| [HSTS](server-hsts.md)                              |    `io.ktor:ktor-server-core`     |                                                           `io.ktor:ktor-server-hsts` |
| [HttpsRedirect](server-https-redirect.md)           |    `io.ktor:ktor-server-core`     |                                                  `io.ktor:ktor-server-http-redirect` |
| [PartialContent](server-partial-content.md)         |    `io.ktor:ktor-server-core`     |                                                `io.ktor:ktor-server-partial-content` |
| [WebSockets](server-websockets.md)                  |     `io.ktor:ktor-websockets`     |                                                     `io.ktor:ktor-server-websockets` |
| [CallLogging](server-call-logging.md)               |    `io.ktor:ktor-server-core`     |                                                   `io.ktor:ktor-server-call-logging` |
| [Micrometer metric](server-metrics-micrometer.md)   | `io.ktor:ktor-metrics-micrometer` |                                             `io.ktor:ktor-server-metrics-micrometer` |
| [Dropwizard metrics](server-metrics-dropwizard.md)    |      `io.ktor:ktor-metrics`       |                                                        `io.ktor:ktor-server-metrics` |
| [Sessions](server-sessions.md)                      |      `io.ktor:ktor-server-core`   |                                        `io.ktor:ktor-server-sessions` |

> 若要一次新增所有外掛，您可以使用 `io.ktor:ktor-server` artifact。

#### 匯入 {id="server-package-imports"}
| 子系統                                           |                 1.6.x                 |                                                2.0.0 |
|:----------------------------------------------------|:-------------------------------------:|-----------------------------------------------------:|
| [Application](server-create-and-configure.topic)    |    `import io.ktor.application.*`     |                `import io.ktor.server.application.*` |
| [Configuration](server-configuration-file.topic)    |       `import io.ktor.config.*`       |                     `import io.ktor.server.config.*` |
| [Routing](server-routing.md)                        |      `import io.ktor.routing.*`       |                    `import io.ktor.server.routing.*` |
| [AutoHeadResponse](server-autoheadresponse.md)      |      `import io.ktor.features.*`      |           `import io.ktor.server.plugins.autohead.*` |
| [StatusPages](server-status-pages.md)               |      `import io.ktor.features.*`      |        `import io.ktor.server.plugins.statuspages.*` |
| [CallId](server-call-id.md)                         |      `import io.ktor.features.*`      |             `import io.ktor.server.plugins.callid.*` |
| [DoubleReceive](server-double-receive.md)           |      `import io.ktor.features.*`      |      `import io.ktor.server.plugins.doublereceive.*` |
| [Requests](server-requests.md)                      |      `import io.ktor.request.*`       |                    `import io.ktor.server.request.*` |
| [Responses](server-responses.md)                    |      `import io.ktor.response.*`      |                   `import io.ktor.server.response.*` |
| [Plugins](#feature-plugin)                          |      `import io.ktor.features.*`      |                    `import io.ktor.server.plugins.*` |
| [Locations](https://ktor.io/docs/server-locations.html)                    |     `import io.ktor.locations.*`      |                  `import io.ktor.server.locations.*` |
| [Static content](server-static-content.md)          |    `import io.ktor.http.content.*`    |               `import io.ktor.server.http.content.*` |
| [HTML DSL](server-html-dsl.md)                      |        `import io.ktor.html.*`        |                       `import io.ktor.server.html.*` |
| [FreeMarker](server-freemarker.md)                  |     `import io.ktor.freemarker.*`     |                 `import io.ktor.server.freemarker.*` |
| [Velocity](server-velocity.md)                      |      `import io.ktor.velocity.*`      |                   `import io.ktor.server.velocity.*` |
| [Mustache](server-mustache.md)                      |      `import io.ktor.mustache.*`      |                   `import io.ktor.server.mustache.*` |
| [Thymeleaf](server-thymeleaf.md)                    |     `import io.ktor.thymeleaf.*`      |                  `import io.ktor.server.thymeleaf.*` |
| [Pebble](server-pebble.md)                          |       `import io.ktor.pebble.*`       |                     `import io.ktor.server.pebble.*` |
| [ContentNegotiation](server-serialization.md)       |      `import io.ktor.features.*`      | `import io.ktor.server.plugins.contentnegotiation.*` |
| [kotlinx.serialization](server-serialization.md)    |   `import io.ktor.serialization.*`    |        `import io.ktor.serialization.kotlinx.json.*` |
| [Gson](server-serialization.md)                     |        `import io.ktor.gson.*`        |                `import io.ktor.serialization.gson.*` |
| [Jackson](server-serialization.md)                  |      `import io.ktor.jackson.*`       |             `import io.ktor.serialization.jackson.*` |
| [Authentication](server-auth.md)                    |        `import io.ktor.auth.*`        |                       `import io.ktor.server.auth.*` |
| [JWT authentication](server-jwt.md)                 |      `import io.ktor.auth.jwt.*`      |                   `import io.ktor.server.auth.jwt.*` |
| [LDAP authentication](server-ldap.md)               |     `import io.ktor.auth.ldap.*`      |                  `import io.ktor.server.auth.ldap.*` |
| [Sessions](server-sessions.md)                      |      `import io.ktor.sessions.*`      |                   `import io.ktor.server.sessions.*` |
| [DefaultHeaders](server-default-headers.md)         |      `import io.ktor.features.*`      |     `import io.ktor.server.plugins.defaultheaders.*` |
| [Compression](server-compression.md)                |      `import io.ktor.features.*`      |        `import io.ktor.server.plugins.compression.*` |
| [CachingHeaders](server-caching-headers.md)         |      `import io.ktor.features.*`      |     `import io.ktor.server.plugins.cachingheaders.*` |
| [ConditionalHeaders](server-conditional-headers.md) |      `import io.ktor.features.*`      | `import io.ktor.server.plugins.conditionalheaders.*` |
| [CORS](server-cors.md)                              |      `import io.ktor.features.*`      |               `import io.ktor.server.plugins.cors.*` |
| [Forwarded headers](server-forward-headers.md)      |      `import io.ktor.features.*`      |   `import io.ktor.server.plugins.forwardedheaders.*` |
| [HSTS](server-hsts.md)                              |      `import io.ktor.features.*`      |               `import io.ktor.server.plugins.hsts.*` |
| [HttpsRedirect](server-https-redirect.md)           |      `import io.ktor.features.*`      |      `import io.ktor.server.plugins.httpsredirect.*` |
| [PartialContent](server-partial-content.md)         |      `import io.ktor.features.*`      |     `import io.ktor.server.plugins.partialcontent.*` |
| [WebSockets](server-websockets.md)                  |     `import io.ktor.websocket.*`      |                  `import io.ktor.server.websocket.*` |
| [CallLogging](server-call-logging.md)               |      `import io.ktor.features.*`      |         `import io.ktor.server.plugins.callloging.*` |
| [Micrometer metric](server-metrics-micrometer.md)   | `import io.ktor.metrics.micrometer.*` |         `import io.ktor.server.metrics.micrometer.*` |
| [Dropwizard metrics](server-metrics-dropwizard.md)    | `import io.ktor.metrics.dropwizard.*` |         `import io.ktor.server.metrics.dropwizard.*` |

### WebSocket 程式碼已移至 'websockets' 套件 {id="server-ws-package"}

WebSocket 程式碼已從 `http-cio` 移至 `websockets` 套件。這需要按如下方式更新匯入：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

請注意，此變更也影響了 [客戶端](#client-ws-package)。

### Feature 已重新命名為 Plugin {id="feature-plugin"}

在 Ktor 2.0.0 中，_Feature_ 已重新命名為 _[Plugin](server-plugins.md)_，以更好地描述攔截請求/響應管線 ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326)) 的功能。
這影響了整個 Ktor API，並需要按照以下描述更新您的應用程式。

#### 匯入 {id="feature-plugin-imports"}
[安裝任何外掛](server-plugins.md#install) 都需要更新匯入，並且還取決於將[伺服器程式碼移動](#server-package-imports)到 `io.ktor.server.*` 套件：

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### 自訂外掛 {id="feature-plugin-custom"}

將 Feature 重新命名為 Plugin 引入了針對與[自訂外掛](server-custom-plugins-base-api.md)相關的 API 的以下變更：
* `ApplicationFeature` 介面已重新命名為 `BaseApplicationPlugin`。
* `Features` [管線階段](server-custom-plugins-base-api.md#pipelines) 已重新命名為 `Plugins`。

> 請注意，從 2.0.0 版開始，Ktor 提供了[建立自訂外掛](server-custom-plugins.md)的新 API。一般而言，此 API 不需要理解 Ktor 內部概念，例如管線、階段等等。相反地，您可以透過使用各種處理器 (handler)，例如 `onCall`、`onCallReceive`、`onCallRespond` 等，來存取處理請求和響應的不同階段。您可以在本節中了解管線階段如何對應到新 API 中的處理器：[](server-custom-plugins-base-api.md#mapping)。

### 內容協商與序列化 {id="serialization"}

[內容協商與序列化](server-serialization.md) 伺服器 API 已重構，以便在伺服器和客戶端之間重複使用序列化函式庫。
主要變更包括：
* `ContentNegotiation` 已從 `ktor-server-core` 移至獨立的 `ktor-server-content-negotiation` artifact。
* 序列化函式庫已從 `ktor-*` 移至 `ktor-serialization-*` artifact，這些 artifact 也由客戶端使用。

您需要更新應用程式中的 [依賴項](#dependencies-serialization) 和 [匯入](#imports-serialization)，如下所示。

#### 依賴項 {id="dependencies-serialization"}

| 子系統                                 |            1.6.x             |                                     2.0.0 |
|:------------------------------------------|:----------------------------:|------------------------------------------:|
| [ContentNegotiation](server-serialization.md)    |  `io.ktor:ktor-server-core`  | `io.ktor:ktor-server-content-negotiation` |
| [kotlinx.serialization](server-serialization.md) | `io.ktor:ktor-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| [Gson](server-serialization.md)                  |     `io.ktor:ktor-gson`      |         `io.ktor:ktor-serialization-gson` |
| [Jackson](server-serialization.md)               |    `io.ktor:ktor-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 匯入 {id="imports-serialization"}
| 子系統                                 |              1.6.x               |                                         2.0.0 |
|:------------------------------------------|:--------------------------------:|----------------------------------------------:|
| [kotlinx.serialization](server-serialization.md) | `import io.ktor.serialization.*` | `import io.ktor.serialization.kotlinx.json.*` |
| [Gson](server-serialization.md)                  |     `import io.ktor.gson.*`      |         `import io.ktor.serialization.gson.*` |
| [Jackson](server-serialization.md)               |    `import io.ktor.jackson.*`    |      `import io.ktor.serialization.jackson.*` |

#### 自訂轉換器 {id="serialization-custom-converter"}

[ContentConverter](server-serialization.md#implement_custom_serializer) 介面所暴露的函式簽章以以下方式變更：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
interface ContentConverter {
    suspend fun convertForSend(context: PipelineContext<Any, ApplicationCall>, contentType: ContentType, value: Any): Any?
    suspend fun convertForReceive(context: PipelineContext<ApplicationReceiveRequest, ApplicationCall>): Any?
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```

</tab>
</tabs>

### 測試 API {id="testing-api"}

在 2.0.0 版中，Ktor 伺服器使用新的 [測試](server-testing.md) API，解決了 [KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971) 中描述的各種問題。主要變更包括：
* `withTestApplication`/`withApplication` 函式已由新的 `testApplication` 函式取代。
* 在 `testApplication` 函式中，您需要使用現有的 [Ktor 客戶端](client-create-and-configure.md) 實例向您的伺服器發出請求並驗證結果。
* 若要測試特定功能 (例如 Cookie 或 WebSocket)，您需要建立一個新的客戶端實例並安裝對應的[外掛](client-plugins.md)。

讓我們看看幾個將 1.6.x 測試遷移到 2.0.0 的範例：

#### 基本伺服器測試 {id="basic-test"}

在下面的測試中，`handleRequest` 函式已由 `client.get` 請求取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="18-26"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="11-16"}

</tab>
</tabs>

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

在下面的測試中，`handleRequest` 函式已由 `client.post` 請求取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"
include-lines="20-28"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"
include-lines="11-18"}

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

若要在 2.0.0 版中建立 `multipart/form-data`，您需要將 `MultiPartFormDataContent` 傳遞給客戶端的 `setBody` 函式：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt" include-lines="38-63"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt" include-lines="17-36"}

</tab>
</tabs>

#### JSON 資料 {id="json-data"}

在 1.6.x 版中，您可以使用 `kotlinx.serialization` 函式庫提供的 `Json.encodeToString` 函式序列化 JSON 資料。
在 2.0.0 版中，您需要建立一個新的客戶端實例並安裝 [ContentNegotiation](client-serialization.md) 外掛，該外掛允許以特定格式序列化/反序列化內容：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt"
include-lines="46-55"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt"
include-lines="31-44"}

</tab>
</tabs>

#### 在測試期間保留 Cookie {id="preserving-cookies"}

在 1.6.x 版中，`cookiesSession` 用於在測試時在請求之間保留 Cookie。在 2.0.0 版中，您需要建立一個新的客戶端實例並安裝 [HttpCookies](client-cookies.md) 外掛：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt" include-lines="29-46"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt" include-lines="12-27"}

</tab>
</tabs>

#### WebSockets {id="testing-ws"}

在舊的 API 中，`handleWebSocketConversation` 用於測試 [WebSocket 對話](server-websockets.md)。在 2.0.0 版中，您可以使用客戶端提供的 [WebSockets](client-websockets.topic) 外掛來測試 WebSocket 對話：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"
include-lines="28-40"}

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
```
{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"
include-lines="10-26"}

</tab>
</tabs>

### DoubleReceive {id="double-receive"}
在 2.0.0 版中，[DoubleReceive](server-double-receive.md) 外掛配置引入了 `cacheRawRequest` 屬性，這與 `receiveEntireContent` 相反：
- 在 1.6.x 版中，`receiveEntireContent` 屬性預設為 `false`。
- 在 2.0.0 版中，`cacheRawRequest` 預設為 `true`。`receiveEntireContent` 屬性已移除。

### 轉發標頭 {id="forwarded-headers"}

在 2.0.0 版中，`ForwardedHeaderSupport` 和 `XForwardedHeaderSupport` 外掛已分別重新命名為 [ForwardedHeaders](server-forward-headers.md) 和 `XForwardedHeaders`。

### 快取標頭 {id="caching-headers"}

用於定義快取選項的 [options](server-caching-headers.md#configure) 函式現在除了 `OutgoingContent` 之外，還接受 `ApplicationCall` 作為 Lambda 參數：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
install(CachingHeaders) {
    options { outgoingContent ->
        // ...
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
install(CachingHeaders) {
    options { call, outgoingContent ->
        // ...
    }
}
```

</tab>
</tabs>

### 條件式標頭 {id="conditional-headers"}

用於定義資源版本列表的 [version](server-conditional-headers.md#configure) 函式現在除了 `OutgoingContent` 之外，還接受 `ApplicationCall` 作為 Lambda 參數：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
install(ConditionalHeaders) {
    version { outgoingContent ->
        // ... 
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
install(ConditionalHeaders) {
    version { call, outgoingContent ->
        // ... 
    }
}
```

</tab>
</tabs>

### CORS {id="cors"}

[CORS](server-cors.md) 配置中使用的幾個函式已重新命名：
- `host` -> `allowHost`
- `header` -> `allowHeader`
- `method` -> `allowMethod`

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
install(CORS) {
    host("0.0.0.0:5000")
    header(HttpHeaders.ContentType)
    method(HttpMethod.Options)
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
install(CORS) {
    allowHost("0.0.0.0:5000")
    allowHeader(HttpHeaders.ContentType)
    allowMethod(HttpMethod.Options)
}
```

</tab>
</tabs>

### MicrometerMetrics {id="micrometer-metrics"}
在 1.6.x 版中，`baseName` 屬性用於指定用於監控 HTTP 請求的 [Ktor 指標](server-metrics-micrometer.md) 的基本名稱 (前綴)。
預設情況下，它等於 `ktor.http.server`。
在 2.0.0 版中，`baseName` 已由 `metricName` 取代，其預設值為 `ktor.http.server.requests`。

## Ktor 客戶端 {id="client"}
### 請求與響應 {id="request-response"}

在 2.0.0 版中，用於發出請求和接收響應的 API 已更新，使其更一致且更易於發現 ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29))。

#### 請求函式 {id="request-overloads"}

具有多個參數的[請求函式](client-requests.md) 已棄用。例如，`port` 和 `path` 參數需要由 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 暴露的 `url` 參數取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
client.get(port = 8080, path = "/customer/3")
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
client.get { url(port = 8080, path = "/customer/3") }
```

</tab>
</tabs>

`HttpRequestBuilder` 還允許您在請求函式 Lambda 內部指定額外的[請求參數](client-requests.md#parameters)。

#### 請求主體 {id="request-body"}

用於設定[請求主體](client-requests.md#body) 的 `HttpRequestBuilder.body` 屬性已由 `HttpRequestBuilder.setBody` 函式取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
client.post("http://localhost:8080/post") {
    body = "Body content"
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

</tab>
</tabs>

#### 響應 {id="responses"}
在 2.0.0 版中，請求函式 (例如 `get`、`post`、`put`、[submitForm](client-requests.md#form_parameters) 等) 不再接受用於接收特定類型物件的泛型參數。
現在所有請求函式都返回一個 `HttpResponse` 物件，該物件暴露了帶有泛型參數的 `body` 函式，用於接收特定類型實例。
您還可以使用 `bodyAsText` 或 `bodyAsChannel` 將內容接收為字串或通道。

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.receive()
val byteArrayBody: ByteArray = httpResponse.receive()
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
val byteArrayBody: ByteArray = httpResponse.body()
```

</tab>
</tabs>

安裝 [ContentNegotiation](client-serialization.md) 外掛後，您可以按如下方式接收任意物件：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3")
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

</tab>
</tabs>

#### 串流響應 {id="streaming-response"}
由於從請求函式中[移除了泛型參數](#responses)，接收串流響應需要獨立的函式。
為此，增加了帶有 `prepare` 字首的函式，例如 `prepareGet` 或 `preparePost`：

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

以下範例展示了在此情況下如何更改您的程式碼：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
client.get<HttpStatement>("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.receive()
    while (!channel.isClosedForRead) {
        // Read data
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
client.prepareGet("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    while (!channel.isClosedForRead) {
        // Read data
    }
}
```

</tab>
</tabs>

您可以在這裡找到完整的範例：[](client-responses.md#streaming)。

### 響應驗證 {id="response-validation"}

在 2.0.0 版中，用於[響應驗證](client-response-validation.md) 的 `expectSuccess` 屬性預設為 `false`。
這需要在您的程式碼中進行以下變更：
- 若要[啟用預設驗證](client-response-validation.md#default) 並針對非 2xx 響應拋出例外，請將 `expectSuccess` 屬性設定為 `true`。
- 如果您使用 `handleResponseExceptionWithRequest` [處理非 2xx 例外](client-response-validation.md#non-2xx)，您還需要明確啟用 `expectSuccess`。

#### HttpResponseValidator {id="http-response-validator"}

[handleResponseException](client-response-validation.md#non-2xx) 函式已由 `handleResponseExceptionWithRequest` 取代，後者增加了對 `HttpRequest` 的存取權限，以便在例外中提供額外資訊：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
HttpResponseValidator {
    handleResponseException { exception ->
        // ...
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
HttpResponseValidator {
    handleResponseExceptionWithRequest { exception, request ->
        // ...
    }
}
```

</tab>
</tabs>

### 內容協商與序列化 {id="serialization-client"}

Ktor 客戶端現在支援內容協商，並與 Ktor 伺服器共享序列化函式庫。
主要變更包括：
* `JsonFeature` 已棄用，改用 `ContentNegotiation`，可在 `ktor-client-content-negotiation` artifact 中找到。
* 序列化函式庫已從 `ktor-client-*` 移至 `ktor-serialization-*` artifact。

您需要更新客戶端程式碼中的 [依賴項](#imports-dependencies-client) 和 [匯入](#imports-serialization-client)，如下所示。

#### 依賴項 {id="imports-dependencies-client"}

| 子系統             |                1.6.x                |                                     2.0.0 |
|:----------------------|:-----------------------------------:|------------------------------------------:|
| `ContentNegotiation`  |                 n/a                 | `io.ktor:ktor-client-content-negotiation` |
| kotlinx.serialization | `io.ktor:ktor-client-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| Gson                  |     `io.ktor:ktor-client-gson`      |         `io.ktor:ktor-serialization-gson` |
| Jackson               |    `io.ktor:ktor-client-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 匯入 {id="imports-serialization-client"}
| 子系統             |                  1.6.x                  |                                                2.0.0 |
|:----------------------|:---------------------------------------:|-----------------------------------------------------:|
| `ContentNegotiation`  |                   n/a                   | `import io.ktor.client.plugins.contentnegotiation.*` |
| kotlinx.serialization | `import io.ktor.client.features.json.*` |        `import io.ktor.serialization.kotlinx.json.*` |
| Gson                  | `import io.ktor.client.features.json.*` |                `import io.ktor.serialization.gson.*` |
| Jackson               | `import io.ktor.client.features.json.*` |             `import io.ktor.serialization.jackson.*` |

### `Bearer` 認證

[refreshTokens](client-bearer-auth.md) 函式現在使用 `RefreshTokenParams` 實例作為 [Lambda 接收者](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it) (`this`)，而不是 `HttpResponse` Lambda 引數 (`it`)：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
bearer {
    refreshTokens {  // it: HttpResponse
        // ...
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
bearer {
    refreshTokens { // this: RefreshTokenParams
        // ...
    }
}
```

</tab>
</tabs>

`RefreshTokenParams` 暴露了以下屬性：
* `response` 用於存取響應參數；
* `client` 用於發出請求以刷新令牌；
* `oldTokens` 用於存取使用 `loadTokens` 取得的令牌。

### HttpSend {id="http-send"}

[HttpSend](client-http-send.md) 外掛的 API 變更如下：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
client[HttpSend].intercept { originalCall, request ->
    if (originalCall.something()) {
        val newCall = execute(request)
        // ...
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
client.plugin(HttpSend).intercept { request ->
    val originalCall = execute(request)
    if (originalCall.something()) {
        val newCall = execute(request)
        // ...
    }
}
```

</tab>
</tabs>

請注意，在 2.0.0 版中，無法使用索引存取外掛。請改用 [HttpClient.plugin](#client-get) 函式。

### `HttpClient.get(plugin: HttpClientPlugin)` 函式已移除 {id="client-get"}

在 2.0.0 版中，接受客戶端外掛的 `HttpClient.get` 函式已移除。請改用 `HttpClient.plugin` 函式。

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
client.get(HttpSend).intercept { ... }
// or
client[HttpSend].intercept { ... }
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
client.plugin(HttpSend).intercept { ... }
```

</tab>
</tabs>

### Feature 已重新命名為 Plugin {id="feature-plugin-client"}

至於 Ktor 伺服器，在客戶端 API 中，_Feature_ 已重新命名為 _Plugin_。
這可能會影響您的應用程式，如下所述。

#### 匯入 {id="feature-plugin-imports-client"}
更新[安裝外掛](client-plugins.md#install) 的匯入：

<table>
<tr>
<td>子系統</td>
<td>1.6.x</td>
<td>2.0.0</td>
</tr>
<tr>
<td>
<list>
<li>
<a href="client-default-request.md">預設請求</a>
</li>
<li>
<a href="client-user-agent.md">使用者代理</a>
</li>
<li>
<a href="client-text-and-charsets.md">字元集</a>
</li>
<li>
<a href="client-response-validation.md">響應驗證</a>
</li>
<li>
<a href="client-timeout.md">逾時</a>
</li>
<li>
<a href="client-caching.md">Http 快取</a>
</li>
<li>
<a href="client-http-send.md">Http 傳送</a>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.*</code></td>
<td><code>import io.ktor.client.plugins.*</code></td>
</tr>

<tr>
<td><a href="client-auth.md">認證</a></td>
<td>
<code>
import io.ktor.client.features.auth.*
</code-block>
<code>
import io.ktor.client.features.auth.providers.*
</code-block>
</td>
<td>
<code>
import io.ktor.client.plugins.auth.*
</code-block>
<code>
import io.ktor.client.plugins.auth.providers.*
</code-block>
</td>
</tr>

<tr>
<td><a href="client-cookies.md">Cookie</a></td>
<td><code>import io.ktor.client.features.cookies.*</code></td>
<td><code>import io.ktor.client.plugins.cookies.*</code></td>
</tr>

<tr>
<td><a href="client-logging.md">日誌記錄</a></td>
<td><code>import io.ktor.client.features.logging.*</code></td>
<td><code>import io.ktor.client.plugins.logging.*</code></td>
</tr>

<tr>
<td><a href="client-websockets.topic">WebSocket</a></td>
<td><code>import io.ktor.client.features.websocket.*</code></td>
<td><code>import io.ktor.client.plugins.websocket.*</code></td>
</tr>

<tr>
<td><a href="client-content-encoding.md">內容編碼</a></td>
<td><code>import io.ktor.client.features.compression.*</code></td>
<td><code>import io.ktor.client.plugins.compression.*</code></td>
</tr>
</table>

#### 自訂外掛 {id="feature-plugin-custom-client"}
`HttpClientFeature` 介面已重新命名為 `HttpClientPlugin`。

### 針對 Native 目標的新記憶體模型 {id="new-mm"}

在 2.0.0 版中，在 [Native](client-engines.md#native) 目標上使用 Ktor 客戶端需要啟用新的 Kotlin/Native 記憶體模型：[啟用新的 MM](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)。

> 從 2.2.0 版開始，新的 Kotlin/Native 記憶體模型[預設啟用](migration-to-22x.md#new-mm)。

### 'Ios' 引擎已重新命名為 'Darwin' {id="darwin"}

鑑於 `Ios` [引擎](client-engines.md) 不僅針對 iOS，還針對其他作業系統，包括 macOS 或 tvOS，在 2.0.0 版中，它已重新命名為 `Darwin`。這導致以下變更：
* `io.ktor:ktor-client-ios` artifact 已重新命名為 `io.ktor:ktor-client-darwin`。
* 若要建立 `HttpClient` 實例，您需要將 `Darwin` 類別作為參數傳遞。
* `IosClientEngineConfig` 配置類別已重新命名為 `DarwinClientEngineConfig`。

若要了解如何配置 `Darwin` 引擎，請參閱 [](client-engines.md#darwin) 一節。

### WebSocket 程式碼已移至 'websockets' 套件 {id="client-ws-package"}

WebSocket 程式碼已從 `http-cio` 移至 `websockets` 套件。這需要按如下方式更新匯入：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### 預設請求 {id="default-request"}

[DefaultRequest](client-default-request.md) 外掛使用 `DefaultRequestBuilder` 配置類別而不是 `HttpRequestBuilder`：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        // this: HttpRequestBuilder
    }
}
```

</tab>
<tab title="2.0.0" group-key="2_0">

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

</tab>
</tabs>