[//]: # (title: 从 1.6.x 迁移到 2.0.x)

<show-structure for="chapter" depth="2"/>

本指南提供了将 Ktor 应用程序从 1.6.x 版本迁移到 2.0.x 版本的说明。

## Ktor 服务端 {id="server"}
### 服务端代码已移至 'io.ktor.server.*' 包 {id="server-package"}
为了统一并更好地区分服务端和客户端 API，服务端代码已移至 `io.ktor.server.*` 包 ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865))。
这意味着您需要更新应用程序的 [依赖项](#server-package-dependencies) 和 [导入](#server-package-imports)，如下所示。

#### 依赖项 {id="server-package-dependencies"}
| 子系统                                           |               1.6.x               |                                                                                2.0.0 |
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

> 要一次性添加所有插件，您可以使用 `io.ktor:ktor-server` artifact。

#### 导入 {id="server-package-imports"}
| 子系统                                           |                 1.6.x                 |                                                2.0.0 |
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

### WebSockets 代码已移至 'websockets' 包 {id="server-ws-package"}

WebSockets 代码已从 `http-cio` 移至 `websockets` 包。这要求更新导入，如下所示：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

请注意，此更改也影响 [客户端](#client-ws-package)。

### Feature 已重命名为 Plugin {id="feature-plugin"}

在 Ktor 2.0.0 中，_Feature_ 已重命名为 _[Plugin](server-plugins.md)_，以更好地描述拦截请求/响应流水线的功能性 ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326))。
这影响了整个 Ktor API，需要您按照如下描述更新应用程序。

#### 导入 {id="feature-plugin-imports"}
[安装任何插件](server-plugins.md#install) 都需要更新导入，并且还取决于 [将服务端代码移至](#server-package-imports) `io.ktor.server.*` 包：

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### 自定义插件 {id="feature-plugin-custom"}

将 Feature 重命名为 Plugin 为与 [自定义插件](server-custom-plugins-base-api.md) 相关的 API 引入了以下更改：
*   `ApplicationFeature` 接口已重命名为 `BaseApplicationPlugin`。
*   `Features` [流水线阶段](server-custom-plugins-base-api.md#pipelines) 已重命名为 `Plugins`。

> 请注意，从 v2.0.0 开始，Ktor 为 [创建自定义插件](server-custom-plugins.md) 提供了新的 API。通常，此 API 不需要理解 Ktor 内部概念，例如流水线、阶段等。相反，您可以通过使用各种处理程序（例如 `onCall`、`onCallReceive`、`onCallRespond` 等）来访问处理请求和响应的不同阶段。您可以从本节了解流水线阶段如何映射到新 API 中的处理程序：[](server-custom-plugins-base-api.md#mapping)。

### 内容协商和序列化 {id="serialization"}

[内容协商和序列化](server-serialization.md) 服务端 API 已重构，以在服务端和客户端之间复用序列化库。
主要更改包括：
*   `ContentNegotiation` 已从 `ktor-server-core` 移至单独的 `ktor-server-content-negotiation` artifact。
*   序列化库已从 `ktor-*` 移至 `ktor-serialization-*` artifacts，客户端也使用这些 artifacts。

您需要更新应用程序的 [依赖项](#dependencies-serialization) 和 [导入](#imports-serialization)，如下所示。

#### 依赖项 {id="dependencies-serialization"}

| 子系统                                 |            1.6.x             |                                     2.0.0 |
|:------------------------------------------|:----------------------------:|------------------------------------------:|
| [ContentNegotiation](server-serialization.md)    |  `io.ktor:ktor-server-core`  | `io.ktor:ktor-server-content-negotiation` |
| [kotlinx.serialization](server-serialization.md) | `io.ktor:ktor-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| [Gson](server-serialization.md)                  |     `io.ktor:ktor-gson`      |         `io.ktor:ktor-serialization-gson` |
| [Jackson](server-serialization.md)               |    `io.ktor:ktor-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 导入 {id="imports-serialization"}
| 子系统                                 |              1.6.x               |                                         2.0.0 |
|:------------------------------------------|:--------------------------------:|----------------------------------------------:|
| [kotlinx.serialization](server-serialization.md) | `import io.ktor.serialization.*` | `import io.ktor.serialization.kotlinx.json.*` |
| [Gson](server-serialization.md)                  |     `import io.ktor.gson.*`      |         `import io.ktor.serialization.gson.*` |
| [Jackson](server-serialization.md)               |    `import io.ktor.jackson.*`    |      `import io.ktor.serialization.jackson.*` |

#### 自定义转换器 {id="serialization-custom-converter"}

[ContentConverter](server-serialization.md#implement_custom_serializer) 接口暴露的函数签名更改如下：

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

### 测试 API {id="testing-api"}

在 v2.0.0 中，Ktor 服务端使用新的 [测试](server-testing.md) API，这解决了 [KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971) 中描述的各种问题。主要更改包括：
*   `withTestApplication`/`withApplication` 函数已被新的 `testApplication` 函数取代。
*   在 `testApplication` 函数内部，您需要使用现有的 [Ktor 客户端](client-create-and-configure.md) 实例向您的服务端发出请求并验证结果。
*   要测试特定功能（例如，cookies 或 WebSockets），您需要创建一个新的客户端实例并安装相应的 [插件](client-plugins.md)。

让我们看一下将 1.6.x 测试迁移到 2.0.0 的几个示例：

#### 基本服务端测试 {id="basic-test"}

在下面的测试中，`handleRequest` 函数被 `client.get` 请求取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

在下面的测试中，`handleRequest` 函数被 `client.post` 请求取代：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

要在 v2.0.0 中构建 `multipart/form-data`，您需要将 `MultiPartFormDataContent` 传递给客户端的 `setBody` 函数：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### JSON 数据 {id="json-data"}

在 v.1.6.x 中，您可以使用 `kotlinx.serialization` 库提供的 `Json.encodeToString` 函数序列化 JSON 数据。
在 v2.0.0 中，您需要创建一个新的客户端实例并安装 [ContentNegotiation](client-serialization.md) 插件，该插件允许以特定格式序列化/反序列化内容：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### 在测试期间保留 cookies {id="preserving-cookies"}

在 v1.6.x 中，`cookiesSession` 用于在测试期间保留请求之间的 cookies。在 v2.0.0 中，您需要创建一个新的客户端实例并安装 [HttpCookies](client-cookies.md) 插件：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### WebSockets {id="testing-ws"}

在旧的 API 中，`handleWebSocketConversation` 用于测试 [WebSocket 会话](server-websockets.md)。在 v2.0.0 中，您可以通过使用客户端提供的 [WebSockets](client-websockets.topic) 插件来测试 WebSocket 会话：

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

### DoubleReceive {id="double-receive"}
在 v2.0.0 中，[DoubleReceive](server-double-receive.md) 插件配置引入了 `cacheRawRequest` 属性，该属性与 `receiveEntireContent` 相反：
*   在 v1.6.x 中，`receiveEntireContent` 属性默认设置为 `false`。
*   在 v2.0.0 中，`cacheRawRequest` 默认设置为 `true`。`receiveEntireContent` 属性已移除。

### Forwarded headers {id="forwarded-headers"}

在 v2.0.0 中，`ForwardedHeaderSupport` 和 `XForwardedHeaderSupport` 插件分别重命名为 [ForwardedHeaders](server-forward-headers.md) 和 `XForwardedHeaders`。

### Caching headers {id="caching-headers"}

用于定义缓存选项的 [options](server-caching-headers.md#configure) 函数，除了 `OutgoingContent` 之外，现在还接受 `ApplicationCall` 作为 lambda 实参：

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

### Conditional headers {id="conditional-headers"}

用于定义资源版本列表的 [version](server-conditional-headers.md#configure) 函数，除了 `OutgoingContent` 之外，现在还接受 `ApplicationCall` 作为 lambda 实参：

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

在 [CORS](server-cors.md) 配置中使用的几个函数已重命名：
*   `host` -> `allowHost`
*   `header` -> `allowHeader`
*   `method` -> `allowMethod`

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
在 v1.6.x 中，`baseName` 属性用于指定用于监控 HTTP 请求的 [Ktor 指标](server-metrics-micrometer.md) 的基本名称（前缀）。
默认情况下，它等于 `ktor.http.server`。
在 v2.0.0 中，`baseName` 被 `metricName` 取代，其默认值为 `ktor.http.server.requests`。

## Ktor 客户端 {id="client"}
### 请求和响应 {id="request-response"}

在 v2.0.0 中，用于发出请求和接收响应的 API 已更新，使其更加一致和可发现 ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29))。

#### 请求函数 {id="request-overloads"}

具有多个参数的 [请求函数](client-requests.md) 已弃用。例如，`port` 和 `path` 参数需要被 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 暴露的 `url` 参数取代：

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

`HttpRequestBuilder` 还允许您在请求函数的 lambda 中指定额外的 [请求参数](client-requests.md#parameters)。

#### 请求体 {id="request-body"}

用于设置 [请求体](client-requests.md#body) 的 `HttpRequestBuilder.body` 属性已被 `HttpRequestBuilder.setBody` 函数取代：

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

#### 响应 {id="responses"}
在 v2.0.0 中，请求函数（例如 `get`、`post`、`put`、[submitForm](client-requests.md#form_parameters) 等）不接受用于接收特定类型对象的泛型实参。
现在所有请求函数都返回一个 `HttpResponse` 对象，该对象暴露了带有泛型实参的 `body` 函数，用于接收特定类型实例。
您还可以使用 `bodyAsText` 或 `bodyAsChannel` 以字符串或通道形式接收内容。

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

安装了 [ContentNegotiation](client-serialization.md) 插件后，您可以按如下方式接收任意对象：

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

#### 流式响应 {id="streaming-response"}
由于请求函数中 [移除了泛型实参](#responses)，接收流式响应需要单独的函数。
为此，添加了带有 `prepare` 前缀的函数，例如 `prepareGet` 或 `preparePost`：

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

下面的示例显示了在这种情况下如何更改您的代码：

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

您可以在此处找到完整示例：[](client-responses.md#streaming)。

### 响应验证 {id="response-validation"}

在 v2.0.0 中，用于 [响应验证](client-response-validation.md) 的 `expectSuccess` 属性默认设置为 `false`。
这需要在您的代码中进行以下更改：
*   要 [启用默认验证](client-response-validation.md#default) 并对非 2xx 响应抛出异常，请将 `expectSuccess` 属性设置为 `true`。
*   如果您使用 `handleResponseExceptionWithRequest` [处理非 2xx 异常](client-response-validation.md#non-2xx)，您还需要显式启用 `expectSuccess`。

#### HttpResponseValidator {id="http-response-validator"}

[`handleResponseException`](client-response-validation.md#non-2xx) 函数已被 `handleResponseExceptionWithRequest` 取代，后者添加了对 `HttpRequest` 的访问，以在异常中提供额外信息：

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

### 内容协商和序列化 {id="serialization-client"}

Ktor 客户端现在支持内容协商，并与 Ktor 服务端共享序列化库。
主要更改包括：
*   `JsonFeature` 已弃用，取而代之的是 `ContentNegotiation`，该 `ContentNegotiation` 可以在 `ktor-client-content-negotiation` artifact 中找到。
*   序列化库已从 `ktor-client-*` 移至 `ktor-serialization-*` artifacts。

您需要更新客户端代码的 [依赖项](#imports-dependencies-client) 和 [导入](#imports-serialization-client)，如下所示。

#### 依赖项 {id="imports-dependencies-client"}

| 子系统             |                1.6.x                |                                     2.0.0 |
|:----------------------|:-----------------------------------:|------------------------------------------:|
| `ContentNegotiation`  |                 n/a                 | `io.ktor:ktor-client-content-negotiation` |
| kotlinx.serialization | `io.ktor:ktor-client-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| Gson                  |     `io.ktor:ktor-client-gson`      |         `io.ktor:ktor-serialization-gson` |
| Jackson               |    `io.ktor:ktor-client-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 导入 {id="imports-serialization-client"}
| 子系统             |                  1.6.x                  |                                                2.0.0 |
|:----------------------|:---------------------------------------:|-----------------------------------------------------:|
| `ContentNegotiation`  |                   n/a                   | `import io.ktor.client.plugins.contentnegotiation.*` |
| kotlinx.serialization | `import io.ktor.client.features.json.*` |        `import io.ktor.serialization.kotlinx.json.*` |
| Gson                  | `import io.ktor.client.features.json.*` |                `import io.ktor.serialization.gson.*` |
| Jackson               | `import io.ktor.client.features.json.*` |             `import io.ktor.serialization.jackson.*` |

### Bearer 认证

[`refreshTokens`](client-bearer-auth.md) 函数现在使用 `RefreshTokenParams` 实例作为 [lambda 接收者](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it) (`this`)，而不是 `HttpResponse` lambda 实参 (`it`)：

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

`RefreshTokenParams` 暴露以下属性：
*   `response` 用于访问响应参数；
*   `client` 用于发出请求以刷新令牌；
*   `oldTokens` 用于访问使用 `loadTokens` 获取的令牌。

### HttpSend {id="http-send"}

[`HttpSend`](client-http-send.md) 插件的 API 更改如下：

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

请注意，在 v2.0.0 中，索引访问不可用于访问插件。请改用 [`HttpClient.plugin`](#client-get) 函数。

### HttpClient.get(plugin: HttpClientPlugin) 函数已移除 {id="client-get"}

在 2.0.0 版本中，接受客户端插件的 `HttpClient.get` 函数已移除。请改用 `HttpClient.plugin` 函数。

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

### Feature 已重命名为 Plugin {id="feature-plugin-client"}

与 Ktor 服务端一样，客户端 API 中的 _Feature_ 已重命名为 _Plugin_。
这可能会影响您的应用程序，如下所述。

#### 导入 {id="feature-plugin-imports-client"}
更新 [安装插件](client-plugins.md#install) 的导入：

<table>
<tr>
<td>子系统</td>
<td>1.6.x</td>
<td>2.0.0</td>
</tr>
<tr>
<td>
<list>
<li>
<Links href="/ktor/client-default-request" summary="DefaultRequest 插件允许您为所有请求配置默认参数。">默认请求</Links>
</li>
<li>
<Links href="/ktor/client-user-agent" summary="undefined">用户代理</Links>
</li>
<li>
<Links href="/ktor/client-text-and-charsets" summary="undefined">字符集</Links>
</li>
<li>
<Links href="/ktor/client-response-validation" summary="了解如何根据状态码验证响应。">响应验证</Links>
</li>
<li>
<Links href="/ktor/client-timeout" summary="代码示例：
        
            %example_name%">超时</Links>
</li>
<li>
<Links href="/ktor/client-caching" summary="HttpCache 插件允许您将先前获取的资源保存在内存或持久化缓存中。">HttpCache</Links>
</li>
<li>
<Links href="/ktor/client-http-send" summary="代码示例：
        
            %example_name%">HttpSend</Links>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.*</code></td>
<td><code>import io.ktor.client.plugins.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-auth" summary="Auth 插件处理客户端应用程序中的身份验证和授权。">Authentication</Links></td>
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
<td><Links href="/ktor/client-cookies" summary="HttpCookies 插件自动处理 cookies，并将它们保留在存储中以供调用之间使用。">Cookies</Links></td>
<td><code>import io.ktor.client.features.cookies.*</code></td>
<td><code>import io.ktor.client.plugins.cookies.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-logging" summary="所需依赖项：io.ktor:ktor-client-logging

    
        代码示例：
        
            %example_name%">日志</Links></td>
<td><code>import io.ktor.client.features.logging.*</code></td>
<td><code>import io.ktor.client.plugins.logging.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-websockets" summary="WebSockets 插件允许您在服务端和客户端之间创建多向通信会话。">WebSockets</Links></td>
<td><code>import io.ktor.client.features.websocket.*</code></td>
<td><code>import io.ktor.client.plugins.websocket.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-content-encoding" summary="ContentEncoding 插件允许您启用指定的压缩算法（例如 'gzip' 和 'deflate'）并配置其设置。">内容编码</Links></td>
<td><code>import io.ktor.client.features.compression.*</code></td>
<td><code>import io.ktor.client.plugins.compression.*</code></td>
</tr>
</table>

#### 自定义插件 {id="feature-plugin-custom-client"}
`HttpClientFeature` 接口已重命名为 `HttpClientPlugin`。

### 原生目标的新内存模型 {id="new-mm"}

在 v2.0.0 中，在 [原生](client-engines.md#native) 目标上使用 Ktor 客户端需要启用新的 Kotlin/Native 内存模型：[启用新 MM](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)。

> 请注意，从 v2.2.0 开始，新的 Kotlin/Native 内存模型 [默认启用](migration-to-22x.md#new-mm)。

### 'Ios' 引擎已重命名为 'Darwin' {id="darwin"}

鉴于 `Ios` [引擎](client-engines.md) 不仅面向 iOS，还面向其他操作系统，包括 macOS 或 tvOS，在 v2.0.0 中，它已重命名为 `Darwin`。这导致以下更改：
*   `io.ktor:ktor-client-ios` artifact 已重命名为 `io.ktor:ktor-client-darwin`。
*   要创建 `HttpClient` 实例，您需要将 `Darwin` 类作为实参传递。
*   `IosClientEngineConfig` 配置类已重命名为 `DarwinClientEngineConfig`。

要了解如何配置 `Darwin` 引擎，请参见 [](client-engines.md#darwin) 部分。

### WebSockets 代码已移至 'websockets' 包 {id="client-ws-package"}

WebSockets 代码已从 `http-cio` 移至 `websockets` 包。这要求更新导入，如下所示：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### 默认请求 {id="default-request"}

[`DefaultRequest`](client-default-request.md) 插件使用 `DefaultRequestBuilder` 配置类，而不是 `HttpRequestBuilder`：

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