[//]: # (title: 从 1.6.x 迁移到 2.0.x)

<show-structure for="chapter" depth="2"/>

本指南提供了有关如何将 Ktor 应用程序从 1.6.x 版本迁移到 2.0.x 版本的说明。

## Ktor 服务器 {id="server"}
### 服务器代码已移至 'io.ktor.server.*' 软件包 {id="server-package"}
为了统一并更好地区分服务器和客户端 API，服务器代码已移至 `io.ktor.server.*` 软件包 ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865))。
这意味着您需要更新应用程序中的[依赖项](#server-package-dependencies)和[导入](#server-package-imports)，如下所示。

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

> 要一次性添加所有插件，可以使用 `io.ktor:ktor-server` 构件。

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

### WebSockets 代码已移至 'websockets' 软件包 {id="server-ws-package"}

WebSockets 代码已从 `http-cio` 移至 `websockets` 软件包。这需要按如下方式更新导入：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

请注意，此更改也会影响[客户端](#client-ws-package)。

### Feature 已重命名为 Plugin {id="feature-plugin"}

在 Ktor 2.0.0 中，Feature 已重命名为[插件](server-plugins.md)，以更好地描述拦截请求/响应流水线的功能 ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326))。
这会影响整个 Ktor API，并要求按如下所述更新您的应用程序。

#### 导入 {id="feature-plugin-imports"}
[安装任何插件](server-plugins.md#install)都需要更新导入，同时也取决于是否将[服务器代码移动](#server-package-imports)到 `io.ktor.server.*` 软件包：

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### 自定义插件 {id="feature-plugin-custom"}

将 Feature 重命名为 Plugin 为与[自定义插件](server-custom-plugins-base-api.md)相关的 API 引入了以下更改：
* `ApplicationFeature` 接口已重命名为 `BaseApplicationPlugin`。
* `Features` [流水线阶段](server-custom-plugins-base-api.md#pipelines)已重命名为 `Plugins`。

> 请注意，从 v2.0.0 开始，Ktor 提供了用于[创建自定义插件](server-custom-plugins.md)的新 API。通常，此 API 不需要理解内部的 Ktor 概念（如流水线、阶段等）。相反，您可以使用各种处理程序（如 `onCall`、`onCallReceive`、`onCallRespond` 等）访问处理请求和响应的不同阶段。您可以在此章节中了解流水线阶段如何映射到新 API 中的处理程序：[将流水线阶段映射到新 API 处理程序](server-custom-plugins-base-api.md#mapping)。

### 内容协商与序列化 {id="serialization"}

[内容协商与序列化](server-serialization.md)服务器 API 经过重构，以便在服务器和客户端之间复用序列化库。
主要更改包括：
* `ContentNegotiation` 已从 `ktor-server-core` 移至独立的 `ktor-server-content-negotiation` 构件。
* 序列化库已从 `ktor-*` 移至 `ktor-serialization-*` 构件，供客户端同时使用。

您需要更新应用程序中的[依赖项](#dependencies-serialization)和[导入](#imports-serialization)，如下所示。

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

`ContentConverter` 接口公开的函数签名按以下方式进行了更改：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
interface ContentConverter {
    suspend fun convertForSend(context: PipelineContext<Any, ApplicationCall>, contentType: ContentType, value: Any): Any?
    suspend fun convertForReceive(context: PipelineContext<ApplicationReceiveRequest, ApplicationCall>): Any?
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```

</TabItem>
</Tabs>

### 测试 API {id="testing-api"}

在 v2.0.0 中，Ktor 服务器使用了新的[测试](server-testing.md) API，解决了 [KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971) 中描述的各种问题。主要更改包括：
* `withTestApplication`/`withApplication` 函数被替换为新的 `testApplication` 函数。
* 在 `testApplication` 函数内部，您需要使用现有的 [Ktor 客户端](client-create-and-configure.md)实例向服务器发出请求并验证结果。
* 要测试特定功能（例如 cookie 或 WebSockets），您需要创建一个新的客户端实例并安装相应的[插件](client-plugins.md)。

让我们来看几个将 1.6.x 测试迁移到 2.0.0 的示例：

#### 基础服务器测试 {id="basic-test"}

在下面的测试中，`handleRequest` 函数被替换为 `client.get` 请求：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

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

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
@Test
fun testRoot() = testApplication {
    val response = client.get("/")
    assertEquals(HttpStatusCode.OK, response.status)
    assertEquals("Hello, world!", response.bodyAsText())
}
```

</TabItem>
</Tabs>

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

在下面的测试中，`handleRequest` 函数被替换为 `client.post` 请求：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
@Test
fun testPostLegacyApi() = withTestApplication(Application::main) {
    with(handleRequest(HttpMethod.Post, "/signup"){
        addHeader(HttpHeaders.ContentType, ContentType.Application.FormUrlEncoded.toString())
        setBody(listOf("username" to "JetBrains", "email" to "example@jetbrains.com", "password" to "foobar", "confirmation" to "foobar").formUrlEncode())
    }) {
        assertEquals("The 'JetBrains' account is created", response.content)
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
@Test
fun testPost() = testApplication {
    val response = client.post("/signup") {
        header(HttpHeaders.ContentType, ContentType.Application.FormUrlEncoded.toString())
        setBody(listOf("username" to "JetBrains", "email" to "example@jetbrains.com", "password" to "foobar", "confirmation" to "foobar").formUrlEncode())
    }
    assertEquals("The 'JetBrains' account is created", response.bodyAsText())
}
```

</TabItem>
</Tabs>

#### multipart/form-data {id="multipart-form-data"}

要在 v2.0.0 中构建 `multipart/form-data`，您需要将 `MultiPartFormDataContent` 传递给客户端的 `setBody` 函数：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
    @Test
    fun testUploadLegacyApi() = withTestApplication(Application::main) {
        with(handleRequest(HttpMethod.Post, "/upload"){
            val boundary = "WebAppBoundary"
            val fileBytes = File("ktor_logo.png").readBytes()

            addHeader(HttpHeaders.ContentType, ContentType.MultiPart.FormData.withParameter("boundary", boundary).toString())
            setBody(boundary, listOf(
                PartData.FormItem("Ktor logo", { }, headersOf(
                    HttpHeaders.ContentDisposition,
                    ContentDisposition.Inline
                        .withParameter(ContentDisposition.Parameters.Name, "description")
                        .toString()
                )),
                PartData.FileItem({ fileBytes.inputStream().asInput() }, {}, headersOf(
                    HttpHeaders.ContentDisposition,
                    ContentDisposition.File
                        .withParameter(ContentDisposition.Parameters.Name, "image")
                        .withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                        .toString()
                ))
            ))
        }) {
            assertEquals("Ktor logo is uploaded to 'uploads/ktor_logo.png'", response.content)
        }
    }
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
@Test
fun testUpload() = testApplication {
    val boundary = "WebAppBoundary"
    val response = client.post("/upload") {
        setBody(
            MultiPartFormDataContent(
                formData {
                    append("description", "Ktor logo")
                    append("image", File("ktor_logo.png").readBytes(), Headers.build {
                        append(HttpHeaders.ContentType, "image/png")
                        append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                    })
                },
                boundary,
                ContentType.MultiPart.FormData.withParameter("boundary", boundary)
            )
        )
    }
    assertEquals("Ktor logo is uploaded to 'uploads/ktor_logo.png'", response.bodyAsText())
}
```

</TabItem>
</Tabs>

#### JSON 数据 {id="json-data"}

在 v.1.6.x 中，您可以使用 `kotlinx.serialization` 库提供的 `Json.encodeToString` 函数序列化 JSON 数据。
在 v2.0.0 中，您需要创建一个新的客户端实例并安装 [ContentNegotiation](client-serialization.md) 插件，该插件允许以特定格式序列化/反序列化内容：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
@Test
fun testPostCustomerLegacyApi() = withTestApplication(Application::main) {
    with(handleRequest(HttpMethod.Post, "/customer"){
        addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
        setBody(Json.encodeToString(Customer(3, "Jet", "Brains")))
    }) {
        assertEquals("Customer stored correctly", response.content)
        assertEquals(HttpStatusCode.Created, response.status())
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
@Test
fun testPostCustomer() = testApplication {
    val client = createClient {
        install(ContentNegotiation) {
            json()
        }
    }
    val response = client.post("/customer") {
        contentType(ContentType.Application.Json)
        setBody(Customer(3, "Jet", "Brains"))
    }
    assertEquals("Customer stored correctly", response.bodyAsText())
    assertEquals(HttpStatusCode.Created, response.status)
}
```

</TabItem>
</Tabs>

#### 在测试期间保留 cookie {id="preserving-cookies"}

在 v1.6.x 中，`cookiesSession` 用于在测试时保留请求之间的 cookie。在 v2.0.0 中，您需要创建一个新的客户端实例并安装 [HttpCookies](client-cookies.md) 插件：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
    @Test
    fun testRequestsLegacyApi() = withTestApplication(Application::main) {
        fun doRequestAndCheckResponse(path: String, expected: String) {
            handleRequest(HttpMethod.Get, path).apply {
                assertEquals(expected, response.content)
            }
        }

        cookiesSession {
            handleRequest(HttpMethod.Get, "/login") {}.apply {}
            doRequestAndCheckResponse("/user", "Session ID is 123abc. Reload count is 0.")
            doRequestAndCheckResponse("/user", "Session ID is 123abc. Reload count is 1.")
            doRequestAndCheckResponse("/user", "Session ID is 123abc. Reload count is 2.")

            handleRequest(HttpMethod.Get, "/logout").apply {}
            doRequestAndCheckResponse("/user", "Session doesn't exist or is expired.")
        }
    }
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
    @Test
    fun testRequests() = testApplication {
        val client = createClient {
            install(HttpCookies)
        }

        val loginResponse = client.get("/login")
        val response1 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 1.", response1.bodyAsText())
        val response2 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 2.", response2.bodyAsText())
        val response3 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 3.", response3.bodyAsText())
        val logoutResponse = client.get("/logout")
        assertEquals("Session doesn't exist or is expired.", logoutResponse.bodyAsText())
    }
```

</TabItem>
</Tabs>

#### WebSockets {id="testing-ws"}

在旧 API 中，`handleWebSocketConversation` 用于测试 [WebSocket 对话](server-websockets.md)。在 v2.0.0 中，您可以使用客户端提供的 [WebSockets](client-websockets.topic) 插件来测试 WebSocket 对话：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
    @Test
    fun testConversationLegacyApi() {
        withTestApplication(Application::module) {
            handleWebSocketConversation("/echo") { incoming, outgoing ->
                val greetingText = (incoming.receive() as Frame.Text).readText()
                assertEquals("Please enter your name", greetingText)

                outgoing.send(Frame.Text("JetBrains"))
                val responseText = (incoming.receive() as Frame.Text).readText()
                assertEquals("Hi, JetBrains!", responseText)
            }
        }
    }
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
    @Test
    fun testConversation() {
        testApplication {
            val client = createClient {
                install(WebSockets)
            }

            client.webSocket("/echo") {
                val greetingText = (incoming.receive() as? Frame.Text)?.readText() ?: ""
                assertEquals("Please enter your name", greetingText)

                send(Frame.Text("JetBrains"))
                val responseText = (incoming.receive() as Frame.Text).readText()
                assertEquals("Hi, JetBrains!", responseText)
            }
        }
    }
```

</TabItem>
</Tabs>

### DoubleReceive {id="double-receive"}
在 v2.0.0 中，[DoubleReceive](server-double-receive.md) 插件配置引入了 `cacheRawRequest` 属性，它与 `receiveEntireContent` 相反：
- 在 v1.6.x 中，`receiveEntireContent` 属性默认设置为 `false`。
- 在 v2.0.0 中，`cacheRawRequest` 默认设置为 `true`。`receiveEntireContent` 属性已移除。

### 转发头 {id="forwarded-headers"}

在 v2.0.0 中，`ForwardedHeaderSupport` 和 `XForwardedHeaderSupport` 插件分别重命名为 [ForwardedHeaders](server-forward-headers.md) 和 `XForwardedHeaders`。

### 缓存头 {id="caching-headers"}

用于定义缓存选项的 [options](server-caching-headers.md#configure) 函数现在除了接收 `OutgoingContent` 外，还接收 `ApplicationCall` 作为 Lambda 参数：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
install(CachingHeaders) {
    options { outgoingContent ->
        // ...
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
install(CachingHeaders) {
    options { call, outgoingContent ->
        // ...
    }
}
```

</TabItem>
</Tabs>

### 条件头 {id="conditional-headers"}

用于定义资源版本列表的 [version](server-conditional-headers.md#configure) 函数现在除了接收 `OutgoingContent` 外，还接收 `ApplicationCall` 作为 Lambda 参数：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
install(ConditionalHeaders) {
    version { outgoingContent ->
        // ... 
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
install(ConditionalHeaders) {
    version { call, outgoingContent ->
        // ... 
    }
}
```

</TabItem>
</Tabs>

### CORS {id="cors"}

[CORS](server-cors.md) 配置中使用的几个函数已重命名：
- `host` -> `allowHost`
- `header` -> `allowHeader`
- `method` -> `allowMethod`

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
install(CORS) {
    host("0.0.0.0:5000")
    header(HttpHeaders.ContentType)
    method(HttpMethod.Options)
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
install(CORS) {
    allowHost("0.0.0.0:5000")
    allowHeader(HttpHeaders.ContentType)
    allowMethod(HttpMethod.Options)
}
```

</TabItem>
</Tabs>

### MicrometerMetrics {id="micrometer-metrics"}
在 v1.6.x 中，`baseName` 属性用于指定用于监控 HTTP 请求的 [Ktor 指标](server-metrics-micrometer.md)的基准名称（前缀）。
默认情况下，它等于 `ktor.http.server`。
在 v2.0.0 中，`baseName` 被替换为 `metricName`，其默认值为 `ktor.http.server.requests`。

## Ktor 客户端 {id="client"}
### 请求与响应 {id="request-response"}

在 v2.0.0 中，用于发出请求和接收响应的 API 进行了更新，使其更具一致性和可发现性 ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29))。

#### 请求函数 {id="request-overloads"}

带多个参数的[请求函数](client-requests.md)已被弃用。例如，`port` 和 `path` 参数需要替换为 [HttpRequestBuilder](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 公开的 `url` 参数：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.get(port = 8080, path = "/customer/3")
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.get { url(port = 8080, path = "/customer/3") }
```

</TabItem>
</Tabs>

`HttpRequestBuilder` 还允许您在请求函数 Lambda 内部指定额外的[请求参数](client-requests.md#parameters)。

#### 请求体 {id="request-body"}

用于设置[请求体](client-requests.md#body)的 `HttpRequestBuilder.body` 属性被替换为 `HttpRequestBuilder.setBody` 函数：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.post("http://localhost:8080/post") {
    body = "Body content"
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

</TabItem>
</Tabs>

#### 响应 {id="responses"}
在 v2.0.0 中，请求函数（如 `get`、`post`、`put`、[submitForm](client-requests.md#form_parameters) 等）不再接收用于接收特定类型对象的泛型参数。
现在所有请求函数都返回一个 `HttpResponse` 对象，该对象公开了带有泛型参数的 `body` 函数，用于接收特定类型的实例。
您还可以使用 `bodyAsText` 或 `bodyAsChannel` 将内容作为字符串或通道接收。

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.receive()
val byteArrayBody: ByteArray = httpResponse.receive()
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
val byteArrayBody: ByteArray = httpResponse.body()
```

</TabItem>
</Tabs>

在安装了 [ContentNegotiation](client-serialization.md) 插件的情况下，您可以按如下方式接收任意对象：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3")
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

</TabItem>
</Tabs>

#### 流式响应 {id="streaming-response"}
由于从请求函数中[移除了泛型参数](#responses)，接收流式响应需要单独的函数。
为了实现这一点，添加了带有 `prepare` 前缀的函数，如 `prepareGet` 或 `preparePost`：

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

以下示例演示了在这种情况下如何更改代码：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.get<HttpStatement>("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.receive()
    while (!channel.isClosedForRead) {
        // 读取数据
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.prepareGet("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    while (!channel.isClosedForRead) {
        // 读取数据
    }
}
```

</TabItem>
</Tabs>

您可以在此处找到完整示例：[流式数据](client-responses.md#streaming)。

### 响应验证 {id="response-validation"}

在 v2.0.0 中，用于[响应验证](client-response-validation.md)的 `expectSuccess` 属性默认设置为 `false`。
这需要在代码中进行以下更改：
- 要[启用默认验证](client-response-validation.md#default)并针对非 2xx 响应抛出异常，请将 `expectSuccess` 属性设置为 `true`。
- 如果您使用 `handleResponseExceptionWithRequest` [处理非 2xx 异常](client-response-validation.md#non-2xx)，还需要显式启用 `expectSuccess`。

#### HttpResponseValidator {id="http-response-validator"}

`handleResponseException` 函数被替换为 `handleResponseExceptionWithRequest`，后者增加了对 `HttpRequest` 的访问权限，以便在异常中提供额外信息：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
HttpResponseValidator {
    handleResponseException { exception ->
        // ...
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
HttpResponseValidator {
    handleResponseExceptionWithRequest { exception, request ->
        // ...
    }
}
```

</TabItem>
</Tabs>

### 内容协商与序列化 {id="serialization-client"}

Ktor 客户端现在支持内容协商，并与 Ktor 服务器共享序列化库。
主要更改包括：
* `JsonFeature` 已弃用，改为使用 `ContentNegotiation`，可在 `ktor-client-content-negotiation` 构件中找到。
* 序列化库已从 `ktor-client-*` 移至 `ktor-serialization-*` 构件。

您需要更新客户端代码中的[依赖项](#imports-dependencies-client)和[导入](#imports-serialization-client)，如下所示。

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

### Bearer 身份验证

`refreshTokens` [函数](client-bearer-auth.md)现在使用 `RefreshTokenParams` 实例作为 [Lambda 接收器](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it) (`this`)，而不是原来的 `HttpResponse` Lambda 参数 (`it`)：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
bearer {
    refreshTokens {  // it: HttpResponse
        // ...
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
bearer {
    refreshTokens { // this: RefreshTokenParams
        // ...
    }
}
```

</TabItem>
</Tabs>

`RefreshTokenParams` 公开了以下属性：
* `response` 用于访问响应参数；
* `client` 用于发出刷新令牌的请求；
* `oldTokens` 用于访问通过 `loadTokens` 获取的令牌。

### HttpSend {id="http-send"}

[HttpSend](client-http-send.md) 插件的 API 已按如下方式更改：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client[HttpSend].intercept { originalCall, request ->
    if (originalCall.something()) {
        val newCall = execute(request)
        // ...
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.plugin(HttpSend).intercept { request ->
    val originalCall = execute(request)
    if (originalCall.something()) {
        val newCall = execute(request)
        // ...
    }
}
```

</TabItem>
</Tabs>

请注意，在 v2.0.0 中，无法使用索引访问来访问插件。请改用 [HttpClient.plugin](#client-get) 函数。

### HttpClient.get(plugin: HttpClientPlugin) 函数已移除 {id="client-get"}

在 2.0.0 版本中，接收客户端插件的 `HttpClient.get` 函数已移除。请改用 `HttpClient.plugin` 函数。

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.get(HttpSend).intercept { ... }
// 或
client[HttpSend].intercept { ... }
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.plugin(HttpSend).intercept { ... }
```

</TabItem>
</Tabs>

### Feature 已重命名为 Plugin {id="feature-plugin-client"}

与 Ktor 服务器一样，客户端 API 中的 Feature 已重命名为 Plugin。
这可能会影响您的应用程序，如下所述。

#### 导入 {id="feature-plugin-imports-client"}
更新用于[安装插件](client-plugins.md#install)的导入：

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
<Links href="/ktor/client-user-agent" summary="undefined">用户代理 (User agent)</Links>
</li>
<li>
<Links href="/ktor/client-text-and-charsets" summary="undefined">字符集 (Charsets)</Links>
</li>
<li>
<Links href="/ktor/client-response-validation" summary="了解如何根据状态代码验证响应。">响应验证</Links>
</li>
<li>
<Links href="/ktor/client-timeout" summary="代码示例：%example_name%">超时</Links>
</li>
<li>
<Links href="/ktor/client-caching" summary="HttpCache 插件允许您将先前获取的资源保存在内存或持久缓存中。">HttpCache</Links>
</li>
<li>
<Links href="/ktor/client-http-send" summary="代码示例：%example_name%">HttpSend</Links>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.&#42;</code></td>
<td><code>import io.ktor.client.plugins.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-auth" summary="Auth 插件处理客户端应用程序中的身份验证和授权。">身份验证</Links></td>
<td>
<code>
import io.ktor.client.features.auth.&#42;
</code>
<code>
import io.ktor.client.features.auth.providers.&#42;
</code>
</td>
<td>
<code>
import io.ktor.client.plugins.auth.&#42;
</code>
<code>
import io.ktor.client.plugins.auth.providers.&#42;
</code>
</td>
</tr>

<tr>
<td><Links href="/ktor/client-cookies" summary="HttpCookies 插件自动处理 cookie，并在存储中的调用之间保留它们。">Cookie</Links></td>
<td><code>import io.ktor.client.features.cookies.&#42;</code></td>
<td><code>import io.ktor.client.plugins.cookies.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-logging" summary="所需依赖项：io.ktor:ktor-client-logging 代码示例：%example_name%">日志记录</Links></td>
<td><code>import io.ktor.client.features.logging.&#42;</code></td>
<td><code>import io.ktor.client.plugins.logging.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">WebSockets</Links></td>
<td><code>import io.ktor.client.features.websocket.&#42;</code></td>
<td><code>import io.ktor.client.plugins.websocket.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-content-encoding" summary="ContentEncoding 插件允许您启用指定的压缩算法（如 'gzip' 和 'deflate'）并配置其设置。">内容编码</Links></td>
<td><code>import io.ktor.client.features.compression.&#42;</code></td>
<td><code>import io.ktor.client.plugins.compression.&#42;</code></td>
</tr>

</table>

#### 自定义插件 {id="feature-plugin-custom-client"}
`HttpClientFeature` 接口已重命名为 `HttpClientPlugin`。

### 原生 (Native) 目标的新内存模型 {id="new-mm"}

在 v2.0.0 中，在 [Native](client-engines.md#native) 目标上使用 Ktor 客户端需要启用新的 Kotlin/Native 内存模型：[启用新内存模型 (MM)](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)。

> 从 v2.2.0 开始，新的 Kotlin/Native 内存模型已[默认启用](migration-to-22x.md#new-mm)。

### 'Ios' 引擎重命名为 'Darwin' {id="darwin"}

鉴于 `Ios` [引擎](client-engines.md)不仅针对 iOS，还针对包括 macOS 或 tvOS 在内的其他操作系统，在 v2.0.0 中，它已重命名为 `Darwin`。这引起了以下更改：
* `io.ktor:ktor-client-ios` 构件重命名为 `io.ktor:ktor-client-darwin`。
* 要创建 `HttpClient` 实例，您需要传递 `Darwin` 类作为参数。
* `IosClientEngineConfig` 配置类重命名为 `DarwinClientEngineConfig`。

要了解如何配置 `Darwin` 引擎，请参阅 [Darwin](client-engines.md#darwin) 章节。

### WebSockets 代码已移至 'websockets' 软件包 {id="client-ws-package"}

WebSockets 代码已从 `http-cio` 移至 `websockets` 软件包。这需要按如下方式更新导入：

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### 默认请求 {id="default-request"}

[DefaultRequest](client-default-request.md) 插件使用 `DefaultRequestBuilder` 配置类，而不是 `HttpRequestBuilder`：

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        // this: HttpRequestBuilder
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

</TabItem>
</Tabs>