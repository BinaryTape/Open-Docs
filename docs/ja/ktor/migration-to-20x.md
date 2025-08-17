[//]: # (title: 1.6.x から 2.0.x へのマイグレーション)

<show-structure for="chapter" depth="2"/>

このガイドでは、Ktorアプリケーションを1.6.xバージョンから2.0.xバージョンへ移行する方法について説明します。

## Ktorサーバー {id="server"}
### サーバーコードは 'io.ktor.server.*' パッケージに移動されました {id="server-package"}
サーバーとクライアントのAPIを統一し、より明確に区別するため、サーバーコードは`io.ktor.server.*`パッケージに移動されました ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865))。
これは、以下に示すように、アプリケーションの[依存関係](#server-package-dependencies)と[インポート](#server-package-imports)を更新する必要があることを意味します。

#### 依存関係 {id="server-package-dependencies"}
| サブシステム                                          |               1.6.x               |                                                                                2.0.0 |
|:----------------------------------------------------|:---------------------------------:|-------------------------------------------------------------------------------------:|
| [Locations](https://ktor.io/docs/server-locations.html) |     `io.ktor:ktor-locations`      |                                                      `io.ktor:ktor-server-locations` |
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

> すべてのプラグインを一度に追加するには、`io.ktor:ktor-server`アーティファクトを使用できます。

#### インポート {id="server-package-imports"}
| サブシステム                                           |                 1.6.x                 |                                                2.0.0 |
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
| [Locations](https://ktor.io/docs/server-locations.html) |     `import io.ktor.locations.*`      |                  `import io.ktor.server.locations.*` |
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

### WebSocketsコードは 'websockets' パッケージに移動されました {id="server-ws-package"}

WebSocketsコードは`http-cio`から`websockets`パッケージに移動されました。これにより、インポートを以下のように更新する必要があります。

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

この変更は[クライアント](#client-ws-package)にも影響することに注意してください。

### FeatureはPluginに名称変更されました {id="feature-plugin"}

Ktor 2.0.0では、_Feature_ はリクエスト/レスポンスパイプラインをインターセプトする機能をより適切に記述するため、_[Plugin](server-plugins.md)_ に名称変更されました ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326))。
これはKtor API全体に影響を与え、以下に説明するようにアプリケーションの更新が必要です。

#### インポート {id="feature-plugin-imports"}
任意のプラグインをインストールするには、インポートの更新が必要であり、[サーバーコードを`io.ktor.server.*`パッケージに移動すること](#server-package-imports)にも依存します。

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### カスタムプラグイン {id="feature-plugin-custom"}

FeatureからPluginへの名称変更により、[カスタムプラグイン](server-custom-plugins-base-api.md)に関連するAPIに以下の変更が導入されます。
* `ApplicationFeature`インターフェースは`BaseApplicationPlugin`に名称変更されました。
* `Features`[パイプラインフェーズ](server-custom-plugins-base-api.md#pipelines)は`Plugins`に名称変更されました。

> v2.0.0以降、Ktorは[カスタムプラグインを作成するための](server-custom-plugins.md)新しいAPIを提供することに注意してください。一般的に、このAPIはパイプライン、フェーズなどの内部Ktorコンセプトの理解を必要としません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`などの様々なハンドラーを使用して、リクエストとレスポンスを処理する異なるステージにアクセスできます。パイプラインフェーズが新しいAPIハンドラーにどのようにマッピングされるかについては、このセクションで学習できます: [パイプラインフェーズと新しいAPIハンドラーのマッピング](server-custom-plugins-base-api.md#mapping)。

### コンテンツネゴシエーションとシリアライゼーション {id="serialization"}

[コンテンツネゴシエーションとシリアライゼーション](server-serialization.md)サーバーAPIは、サーバーとクライアント間でシリアライゼーションライブラリを再利用するようにリファクタリングされました。
主な変更点は以下の通りです。
* `ContentNegotiation`は`ktor-server-core`から分離された`ktor-server-content-negotiation`アーティファクトに移動されました。
* シリアライゼーションライブラリは`ktor-*`から、クライアントでも使用される`ktor-serialization-*`アーティファクトに移動されました。

以下に示すように、アプリケーションの[依存関係](#dependencies-serialization)と[インポート](#imports-serialization)を更新する必要があります。

#### 依存関係 {id="dependencies-serialization"}

| サブシステム                                 |            1.6.x             |                                     2.0.0 |
|:------------------------------------------|:----------------------------:|------------------------------------------:|
| [ContentNegotiation](server-serialization.md) |  `io.ktor:ktor-server-core`  | `io.ktor:ktor-server-content-negotiation` |
| [kotlinx.serialization](server-serialization.md) | `io.ktor:ktor-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| [Gson](server-serialization.md)                  |     `io.ktor:ktor-gson`      |         `io.ktor:ktor-serialization-gson` |
| [Jackson](server-serialization.md)               |    `io.ktor:ktor-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### インポート {id="imports-serialization"}
| サブシステム                                 |              1.6.x               |                                         2.0.0 |
|:------------------------------------------|:--------------------------------:|----------------------------------------------:|
| [kotlinx.serialization](server-serialization.md) | `import io.ktor.serialization.*` | `import io.ktor.serialization.kotlinx.json.*` |
| [Gson](server-serialization.md)                  |     `import io.ktor.gson.*`      |         `import io.ktor.serialization.gson.*` |
| [Jackson](server-serialization.md)               |    `import io.ktor.jackson.*`    |      `import io.ktor.serialization.jackson.*` |

#### カスタムコンバーター {id="serialization-custom-converter"}

[ContentConverter](server-serialization.md#implement_custom_serializer)インターフェースによって公開される関数のシグネチャは、以下のように変更されました。

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

### テストAPI {id="testing-api"}

v2.0.0では、Ktorサーバーは[テスト](server-testing.md)に新しいAPIを使用し、[KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971)で説明されている様々な問題を解決します。主な変更点は以下の通りです。
* `withTestApplication`/`withApplication`関数は、新しい`testApplication`関数に置き換えられました。
* `testApplication`関数内では、既存の[Ktorクライアント](client-create-and-configure.md)インスタンスを使用してサーバーにリクエストを送信し、結果を検証する必要があります。
* 特定の機能（例えば、クッキーやWebSockets）をテストするには、新しいクライアントインスタンスを作成し、対応する[プラグイン](client-plugins.md)をインストールする必要があります。

1.6.xテストを2.0.0に移行するいくつかの例を見てみましょう。

#### 基本的なサーバーテスト {id="basic-test"}

以下のテストでは、`handleRequest`関数が`client.get`リクエストに置き換えられています。

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

以下のテストでは、`handleRequest`関数が`client.post`リクエストに置き換えられています。

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

v2.0.0で`multipart/form-data`を構築するには、`MultiPartFormDataContent`をクライアントの`setBody`関数に渡す必要があります。

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

#### JSONデータ {id="json-data"}

v1.6.xでは、`kotlinx.serialization`ライブラリが提供する`Json.encodeToString`関数を使用してJSONデータをシリアライズできます。
v2.0.0では、新しいクライアントインスタンスを作成し、特定の形式でコンテンツをシリアライズ/デシリアライズできる[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。

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

#### テスト中のクッキーの保持 {id="preserving-cookies"}

v1.6.xでは、テスト時にリクエスト間でクッキーを保持するために`cookiesSession`が使用されます。v2.0.0では、新しいクライアントインスタンスを作成し、[HttpCookies](client-cookies.md)プラグインをインストールする必要があります。

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

旧APIでは、[WebSocket会話](server-websockets.md)をテストするために`handleWebSocketConversation`が使用されます。v2.0.0では、クライアントが提供する[WebSockets](client-websockets.topic)プラグインを使用することでWebSocket会話をテストできます。

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
v2.0.0では、[DoubleReceive](server-double-receive.md)プラグイン設定に`cacheRawRequest`プロパティが導入され、これは`receiveEntireContent`とは逆の動作をします。
- v1.6.xでは、`receiveEntireContent`プロパティはデフォルトで`false`に設定されています。
- v2.0.0では、`cacheRawRequest`はデフォルトで`true`に設定されています。`receiveEntireContent`プロパティは削除されました。

### Forwarded headers {id="forwarded-headers"}

v2.0.0では、`ForwardedHeaderSupport`と`XForwardedHeaderSupport`プラグインは、それぞれ[ForwardedHeaders](server-forward-headers.md)と`XForwardedHeaders`に名称変更されました。

### Caching headers {id="caching-headers"}

キャッシュオプションを定義するために使用される[options](server-caching-headers.md#configure)関数は、`OutgoingContent`に加えて`ApplicationCall`をラムダ引数として受け入れるようになりました。

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

### Conditional headers {id="conditional-headers"}

リソースバージョンのリストを定義するために使用される[version](server-conditional-headers.md#configure)関数は、`OutgoingContent`に加えて`ApplicationCall`をラムダ引数として受け入れるようになりました。

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

[CORS](server-cors.md)設定で使用されるいくつかの関数が名称変更されました。
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
v1.6.xでは、HTTPリクエストの監視に使用される[Ktorメトリクス](server-metrics-micrometer.md)のベース名（プレフィックス）を指定するために`baseName`プロパティが使用されます。
デフォルトでは、`ktor.http.server`に等しいです。
v2.0.0では、`baseName`は`metricName`に置き換えられ、そのデフォルト値は`ktor.http.server.requests`です。

## Ktorクライアント {id="client"}
### リクエストとレスポンス {id="request-response"}

v2.0.0では、リクエストとレスポンスを行うために使用されるAPIが、より一貫性があり発見しやすいように更新されました ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29))。

#### リクエスト関数 {id="request-overloads"}

複数のパラメータを持つ[リクエスト関数](client-requests.md)は非推奨になりました。例えば、`port`および`path`パラメータは、[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)によって公開される`url`パラメータに置き換える必要があります。

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

また、`HttpRequestBuilder`を使用すると、リクエスト関数ラムダ内で追加の[リクエストパラメータ](client-requests.md#parameters)を指定できます。

#### リクエストボディ {id="request-body"}

[リクエストボディ](client-requests.md#body)を設定するために使用されていた`HttpRequestBuilder.body`プロパティは、`HttpRequestBuilder.setBody`関数に置き換えられました。

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

#### レスポンス {id="responses"}
v2.0.0では、リクエスト関数（`get`、`post`、`put`、[submitForm](client-requests.md#form_parameters)など）は、特定の型のオブジェクトを受け取るためのジェネリック引数を受け入れなくなりました。
現在、すべてのリクエスト関数は`HttpResponse`オブジェクトを返します。これは、特定の型インスタンスを受け取るためのジェネリック引数を持つ`body`関数を公開しています。
コンテンツを文字列またはチャネルとして受け取るために、`bodyAsText`または`bodyAsChannel`を使用することもできます。

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

[ContentNegotiation](client-serialization.md)プラグインをインストールすると、以下のように任意のオブジェクトを受け取ることができます。

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

#### ストリーミングレスポンス {id="streaming-response"}
リクエスト関数から[ジェネリック引数が削除された](#responses)ため、ストリーミングレスポンスを受け取るには個別の関数が必要です。
これを実現するために、`prepareGet`や`preparePost`などの`prepare`プレフィックスが付いた関数が追加されました。

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

以下に、この場合のコード変更方法の例を示します。

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.get<HttpStatement>("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.receive()
    while (!channel.isClosedForRead) {
        // Read data
    }
}
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.prepareGet("https://ktor.io/").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    while (!channel.isClosedForRead) {
        // Read data
    }
}
```

</TabItem>
</Tabs>

完全な例は、こちらで確認できます: [ストリーミングデータ](client-responses.md#streaming)。

### レスポンス検証 {id="response-validation"}

v2.0.0では、[レスポンス検証](client-response-validation.md)に使用される`expectSuccess`プロパティは、デフォルトで`false`に設定されています。
これには、コードに以下の変更が必要です。
- [デフォルトの検証を有効にする](client-response-validation.md#default)には、非2xxレスポンスに対して例外をスローするように、`expectSuccess`プロパティを`true`に設定します。
- もし`handleResponseExceptionWithRequest`を使用して[非2xx例外を処理する](client-response-validation.md#non-2xx)場合、`expectSuccess`も明示的に有効にする必要があります。

#### HttpResponseValidator {id="http-response-validator"}

[handleResponseException](client-response-validation.md#non-2xx)関数は、例外に追加情報を提供するために`HttpRequest`へのアクセスを追加する`handleResponseExceptionWithRequest`に置き換えられました。

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

### コンテンツネゴシエーションとシリアライゼーション {id="serialization-client"}

Ktorクライアントは現在コンテンツネゴシエーションをサポートしており、Ktorサーバーとシリアライゼーションライブラリを共有しています。
主な変更点は以下の通りです。
* `JsonFeature`は、`ktor-client-content-negotiation`アーティファクトにある`ContentNegotiation`を推奨し、非推奨になりました。
* シリアライゼーションライブラリは`ktor-client-*`から`ktor-serialization-*`アーティファクトに移動されました。

以下に示すように、クライアントコードの[依存関係](#imports-dependencies-client)と[インポート](#imports-serialization-client)を更新する必要があります。

#### 依存関係 {id="imports-dependencies-client"}

| サブシステム             |                1.6.x                |                                     2.0.0 |
|:----------------------|:-----------------------------------:|------------------------------------------:|
| `ContentNegotiation`  |                 n/a                 | `io.ktor:ktor-client-content-negotiation` |
| kotlinx.serialization | `io.ktor:ktor-client-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| Gson                  |     `io.ktor:ktor-client-gson`      |         `io.ktor:ktor-serialization-gson` |
| Jackson               |    `io.ktor:ktor-client-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### インポート {id="imports-serialization-client"}
| サブシステム             |                  1.6.x                  |                                                2.0.0 |
|:----------------------|:---------------------------------------:|-----------------------------------------------------:|
| `ContentNegotiation`  |                   n/a                   | `import io.ktor.client.plugins.contentnegotiation.*` |
| kotlinx.serialization | `import io.ktor.client.features.json.*` |        `import io.ktor.serialization.kotlinx.json.*` |
| Gson                  | `import io.ktor.client.features.json.*` |                `import io.ktor.serialization.gson.*` |
| Jackson               | `import io.ktor.client.features.json.*` |             `import io.ktor.serialization.jackson.*` |

### ベアラー認証

[refreshTokens](client-bearer-auth.md)関数は、`HttpResponse`ラムダ引数（`it`）の代わりに、[ラムダレシーバー](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)（`this`）として`RefreshTokenParams`インスタンスを使用するようになりました。

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

`RefreshTokenParams`は以下のプロパティを公開しています。
* `response`: レスポンスパラメータにアクセスするため
* `client`: トークンをリフレッシュするリクエストを行うため
* `oldTokens`: `loadTokens`を使用して取得したトークンにアクセスするため

### HttpSend {id="http-send"}

[HttpSend](client-http-send.md)プラグインのAPIは以下のように変更されました。

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

v2.0.0では、プラグインへのインデックスアクセスは利用できないことに注意してください。[HttpClient.plugin](#client-get)関数を使用してください。

### HttpClient.get(plugin: HttpClientPlugin) 関数は削除されました {id="client-get"}

2.0.0バージョンでは、クライアントプラグインを受け入れる`HttpClient.get`関数は削除されました。代わりに`HttpClient.plugin`関数を使用してください。

<Tabs group="ktor_versions">
<TabItem title="1.6.x" group-key="1_6">

```kotlin
client.get(HttpSend).intercept { ... }
// or
client[HttpSend].intercept { ... }
```

</TabItem>
<TabItem title="2.0.0" group-key="2_0">

```kotlin
client.plugin(HttpSend).intercept { ... }
```

</TabItem>
</Tabs>

### FeatureはPluginに名称変更されました {id="feature-plugin-client"}

Ktorサーバーと同様に、クライアントAPIでも_Feature_は_Plugin_に名称変更されました。
これは以下に説明するように、アプリケーションに影響を与える可能性があります。

#### インポート {id="feature-plugin-imports-client"}
[プラグインのインストール](client-plugins.md#install)のためのインポートを更新します。

<table>

<tr>
<td>サブシステム</td>
<td>1.6.x</td>
<td>2.0.0</td>
</tr>

<tr>
<td>
<list>
<li>
<Links href="/ktor/client-default-request" summary="The DefaultRequest plugin allows you to configure default parameters for all requests.">Default request</Links>
</li>
<li>
<Links href="/ktor/client-user-agent" summary="undefined">User agent</Links>
</li>
<li>
<Links href="/ktor/client-text-and-charsets" summary="undefined">Charsets</Links>
</li>
<li>
<Links href="/ktor/client-response-validation" summary="Learn how to validate a response depending on its status code.">Response validation</Links>
</li>
<li>
<Links href="/ktor/client-timeout" summary="Code example: %example_name%">Timeout</Links>
</li>
<li>
<Links href="/ktor/client-caching" summary="The HttpCache plugin allows you to save previously fetched resources in an in-memory or persistent cache.">HttpCache</Links>
</li>
<li>
<Links href="/ktor/client-http-send" summary="Code example: %example_name%">HttpSend</Links>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.&#42;</code></td>
<td><code>import io.ktor.client.plugins.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-auth" summary="The Auth plugin handles authentication and authorization in your client application.">Authentication</Links></td>
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
<td><Links href="/ktor/client-cookies" summary="The HttpCookies plugin handles cookies automatically and keep them between calls in a storage.">Cookies</Links></td>
<td><code>import io.ktor.client.features.cookies.&#42;</code></td>
<td><code>import io.ktor.client.plugins.cookies.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-logging" summary="Required dependencies: io.ktor:ktor-client-logging Code example: %example_name%">Logging</Links></td>
<td><code>import io.ktor.client.features.logging.&#42;</code></td>
<td><code>import io.ktor.client.plugins.logging.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-websockets" summary="The Websockets plugin allows you to create a multi-way communication session between a server and a client.">WebSockets</Links></td>
<td><code>import io.ktor.client.features.websocket.&#42;</code></td>
<td><code>import io.ktor.client.plugins.websocket.&#42;</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-content-encoding" summary="The ContentEncoding plugin allows you to enable specified compression algorithms (such as 'gzip' and 'deflate') and configure their settings.">Content encoding</Links></td>
<td><code>import io.ktor.client.features.compression.&#42;</code></td>
<td><code>import io.ktor.client.plugins.compression.&#42;</code></td>
</tr>

</table>

#### カスタムプラグイン {id="feature-plugin-custom-client"}
`HttpClientFeature`インターフェースは`HttpClientPlugin`に名称変更されました。

### ネイティブターゲット向けの新しいメモリモデル {id="new-mm"}

v2.0.0では、[ネイティブ](client-engines.md#native)ターゲットでKtorクライアントを使用するには、新しいKotlin/Nativeメモリモデルを有効にする必要があります: [新しいMMを有効にする](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)。

> v2.2.0以降、新しいKotlin/Nativeメモリモデルは[デフォルトで有効](migration-to-22x.md#new-mm)になっています。

### 'Ios' エンジンは 'Darwin' に名称変更されました {id="darwin"}

`Ios`[エンジン](client-engines.md)がiOSだけでなく、macOSやtvOSを含む他のオペレーティングシステムもターゲットとしているため、v2.0.0では`Darwin`に名称変更されました。これにより、以下の変更が生じます。
* `io.ktor:ktor-client-ios`アーティファクトは`io.ktor:ktor-client-darwin`に名称変更されました。
* `HttpClient`インスタンスを作成するには、`Darwin`クラスを引数として渡す必要があります。
* `IosClientEngineConfig`設定クラスは`DarwinClientEngineConfig`に名称変更されました。

`Darwin`エンジンの設定方法については、[Darwin](client-engines.md#darwin)セクションを参照してください。

### WebSocketsコードは 'websockets' パッケージに移動されました {id="client-ws-package"}

WebSocketsコードは`http-cio`から`websockets`パッケージに移動されました。これにより、インポートを以下のように更新する必要があります。

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### Default request {id="default-request"}

[DefaultRequest](client-default-request.md)プラグインは、`HttpRequestBuilder`の代わりに`DefaultRequestBuilder`設定クラスを使用します。

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