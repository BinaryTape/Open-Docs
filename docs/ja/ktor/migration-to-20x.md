[//]: # (title: 1.6.xから2.0.xへの移行)

<show-structure for="chapter" depth="2"/>

このガイドでは、Ktorアプリケーションをバージョン1.6.xから2.0.xに移行する方法について説明します。

## Ktorサーバー {id="server"}
### サーバーコードが 'io.ktor.server.*' パッケージに移動 {id="server-package"}
サーバーとクライアントのAPIを統合し、より明確に区別するため、サーバーコードは`io.ktor.server.*`パッケージに移動されました ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865))。
これは、以下に示すように、アプリケーションの[依存関係](#server-package-dependencies)と[インポート](#server-package-imports)を更新する必要があることを意味します。

#### 依存関係 {id="server-package-dependencies"}
| サブシステム                                           |               1.6.x               |                                                                                2.0.0 |
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

> 一度にすべてのプラグインを追加するには、`io.ktor:ktor-server`アーティファクトを使用できます。

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

### WebSocketsコードが 'websockets' パッケージに移動 {id="server-ws-package"}

WebSocketsコードが`http-cio`から`websockets`パッケージに移動されました。これには、以下のようにインポートの更新が必要です。

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

この変更は[クライアント](#client-ws-package)にも影響することに注意してください。

### FeatureがPluginに名称変更 {id="feature-plugin"}

Ktor 2.0.0では、リクエスト/レスポンスパイプラインをインターセプトする機能をよりよく説明するために、_Feature_が_[Plugin](server-plugins.md)_に名称変更されました ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326))。
これはKtor API全体に影響し、以下に説明するようにアプリケーションの更新が必要です。

#### インポート {id="feature-plugin-imports"}
[任意のプラグインをインストールする](server-plugins.md#install)には、インポートの更新が必要であり、[サーバーコードの`io.ktor.server.*`パッケージへの移動](#server-package-imports)にも依存します。

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### カスタムプラグイン {id="feature-plugin-custom"}

FeatureからPluginへの名称変更により、[カスタムプラグイン](server-custom-plugins-base-api.md)に関連するAPIに以下の変更が導入されます。
* `ApplicationFeature`インターフェースは`BaseApplicationPlugin`に名称変更されました。
* `Features` [パイプラインフェーズ](server-custom-plugins-base-api.md#pipelines)は`Plugins`に名称変更されました。

> v2.0.0以降、Ktorは[カスタムプラグインを作成するための](server-custom-plugins.md)新しいAPIを提供することに注意してください。一般的に、このAPIはパイプライン、フェーズなどのKtor内部概念を理解する必要はありません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`などの様々なハンドラを使用して、リクエストとレスポンスを処理する様々なステージにアクセスできます。このセクションから、パイプラインフェーズが新しいAPIでハンドラにどのようにマップされるかを学ぶことができます：[](server-custom-plugins-base-api.md#mapping)。

### コンテンツネゴシエーションとシリアライゼーション {id="serialization"}

[コンテンツネゴシエーションとシリアライゼーション](server-serialization.md)のサーバーAPIは、サーバーとクライアント間でシリアライゼーションライブラリを再利用するためにリファクタリングされました。
主な変更点は次のとおりです。
* `ContentNegotiation`は`ktor-server-core`から別の`ktor-server-content-negotiation`アーティファクトに移動されました。
* シリアライゼーションライブラリは`ktor-*`から、クライアントでも使用される`ktor-serialization-*`アーティファクトに移動されました。

以下に示すように、アプリケーションの[依存関係](#dependencies-serialization)と[インポート](#imports-serialization)を更新する必要があります。

#### 依存関係 {id="dependencies-serialization"}

| サブシステム                                 |            1.6.x             |                                     2.0.0 |
|:------------------------------------------|:----------------------------:|------------------------------------------:|
| [ContentNegotiation](server-serialization.md)    |  `io.ktor:ktor-server-core`  | `io.ktor:ktor-server-content-negotiation` |
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

[ContentConverter](server-serialization.md#implement_custom_serializer)インターフェースによって公開される関数のシグネチャは、次のように変更されました。

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

### テストAPI {id="testing-api"}

v2.0.0では、Ktorサーバーは[テスト](server-testing.md)に新しいAPIを使用し、[KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971)に記載されている様々な問題を解決します。主な変更点は次のとおりです。
* `withTestApplication`/`withApplication`関数は、新しい`testApplication`関数に置き換えられました。
* `testApplication`関数内では、既存の[Ktorクライアント](client-create-and-configure.md)インスタンスを使用してサーバーにリクエストを行い、結果を検証する必要があります。
* 特定の機能（例：クッキーやWebSockets）をテストするには、新しいクライアントインスタンスを作成し、対応する[プラグイン](client-plugins.md)をインストールする必要があります。

1.6.xテストを2.0.0に移行するいくつかの例を見てみましょう。

#### 基本的なサーバーテスト {id="basic-test"}

以下のテストでは、`handleRequest`関数が`client.get`リクエストに置き換えられています。

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

以下のテストでは、`handleRequest`関数が`client.post`リクエストに置き換えられています。

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

v2.0.0で`multipart/form-data`を構築するには、`MultiPartFormDataContent`をクライアントの`setBody`関数に渡す必要があります。

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

#### JSONデータ {id="json-data"}

v1.6.xでは、`kotlinx.serialization`ライブラリが提供する`Json.encodeToString`関数を使用してJSONデータをシリアライズできます。
v2.0.0では、新しいクライアントインスタンスを作成し、特定の形式でコンテンツをシリアライズ/デシリアライズできる[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。

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

#### テスト中にクッキーを保持 {id="preserving-cookies"}

v1.6.xでは、テスト時にリクエスト間でクッキーを保持するために`cookiesSession`が使用されます。v2.0.0では、新しいクライアントインスタンスを作成し、[HttpCookies](client-cookies.md)プラグインをインストールする必要があります。

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

旧APIでは、[WebSocket会話](server-websockets.md)をテストするために`handleWebSocketConversation`が使用されます。v2.0.0では、クライアントが提供する[WebSockets](client-websockets.topic)プラグインを使用することでWebSocket会話をテストできます。

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
v2.0.0では、[DoubleReceive](server-double-receive.md)プラグインの設定に`cacheRawRequest`プロパティが導入され、これは`receiveEntireContent`とは反対の動作をします。
* v1.6.xでは、`receiveEntireContent`プロパティはデフォルトで`false`に設定されていました。
* v2.0.0では、`cacheRawRequest`はデフォルトで`true`に設定されています。`receiveEntireContent`プロパティは削除されました。

### 転送ヘッダー {id="forwarded-headers"}

v2.0.0では、`ForwardedHeaderSupport`および`XForwardedHeaderSupport`プラグインは、それぞれ[ForwardedHeaders](server-forward-headers.md)および`XForwardedHeaders`に名称変更されました。

### キャッシュヘッダー {id="caching-headers"}

キャッシュオプションを定義するために使用される[options](server-caching-headers.md#configure)関数は、`OutgoingContent`に加えて`ApplicationCall`をラムダ引数として受け入れるようになりました。

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

### 条件付きヘッダー {id="conditional-headers"}

リソースバージョンのリストを定義するために使用される[version](server-conditional-headers.md#configure)関数は、`OutgoingContent`に加えて`ApplicationCall`をラムダ引数として受け入れるようになりました。

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

[CORS](server-cors.md)設定で使用されるいくつかの関数が名称変更されました。
* `host` -> `allowHost`
* `header` -> `allowHeader`
* `method` -> `allowMethod`

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
v1.6.xでは、`baseName`プロパティはHTTPリクエストの監視に使用される[Ktorメトリクス](server-metrics-micrometer.md)のベース名（プレフィックス）を指定するために使用されます。
デフォルトでは、`ktor.http.server`に等しくなります。
v2.0.0では、`baseName`はデフォルト値が`ktor.http.server.requests`である`metricName`に置き換えられました。

## Ktorクライアント {id="client"}
### リクエストとレスポンス {id="request-response"}

v2.0.0では、リクエストの作成とレスポンスの受信に使用されるAPIが、より一貫性があり発見しやすいように更新されました ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29))。

#### リクエスト関数 {id="request-overloads"}

複数のパラメータを持つ[リクエスト関数](client-requests.md)は非推奨になりました。たとえば、`port`および`path`パラメータは、[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)によって公開される`url`パラメータに置き換える必要があります。

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

`HttpRequestBuilder`は、リクエスト関数のラムダ内で追加の[リクエストパラメータ](client-requests.md#parameters)を指定することもできます。

#### リクエストボディ {id="request-body"}

[リクエストボディ](client-requests.md#body)を設定するために使用される`HttpRequestBuilder.body`プロパティは、`HttpRequestBuilder.setBody`関数に置き換えられました。

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

#### レスポンス {id="responses"}
v2.0.0では、リクエスト関数（`get`、`post`、`put`、[submitForm](client-requests.md#form_parameters)など）は、特定の型のオブジェクトを受信するためのジェネリック引数を受け入れなくなりました。
すべてのリクエスト関数は`HttpResponse`オブジェクトを返すようになり、これは特定の型インスタンスを受信するためのジェネリック引数を持つ`body`関数を公開します。
コンテンツを文字列またはチャネルとして受信するために、`bodyAsText`または`bodyAsChannel`を使用することもできます。

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

[ContentNegotiation](client-serialization.md)プラグインがインストールされている場合、以下のように任意のオブジェクトを受信できます。

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

#### ストリーミングレスポンス {id="streaming-response"}
リクエスト関数から[ジェネリック引数が削除された](#responses)ため、ストリーミングレスポンスを受信するには別の関数が必要です。
これを実現するために、`prepare`プレフィックスを持つ関数、例えば`prepareGet`や`preparePost`が追加されました。

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

以下の例は、この場合のコードの変更方法を示しています。

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

完全な例はこちらで見つけることができます：[](client-responses.md#streaming)。

### レスポンス検証 {id="response-validation"}

v2.0.0では、[レスポンス検証](client-response-validation.md)に使用される`expectSuccess`プロパティはデフォルトで`false`に設定されています。
これには、コードに以下の変更が必要です。
* [デフォルト検証を有効にする](client-response-validation.md#default)には、非2xxレスポンスに対して例外をスローするために、`expectSuccess`プロパティを`true`に設定します。
* `handleResponseExceptionWithRequest`を使用して[非2xx例外を処理する](client-response-validation.md#non-2xx)場合も、`expectSuccess`を明示的に有効にする必要があります。

#### HttpResponseValidator {id="http-response-validator"}

[handleResponseException](client-response-validation.md#non-2xx)関数は`handleResponseExceptionWithRequest`に置き換えられました。これにより、例外に付加情報を提供するために`HttpRequest`へのアクセスが追加されます。

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

### コンテンツネゴシエーションとシリアライゼーション {id="serialization-client"}

Ktorクライアントは現在、コンテンツネゴシエーションをサポートしており、Ktorサーバーとシリアライゼーションライブラリを共有しています。
主な変更点は次のとおりです。
* `JsonFeature`は非推奨となり、`ktor-client-content-negotiation`アーティファクトにある`ContentNegotiation`が推奨されます。
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

### Bearer認証

[refreshTokens](client-bearer-auth.md)関数は、`HttpResponse`ラムダ引数（`it`）の代わりに、[ラムダレシーバー](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)（`this`）として`RefreshTokenParams`インスタンスを使用するようになりました。

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

`RefreshTokenParams`は以下のプロパティを公開します。
* `response`：レスポンスパラメータにアクセスするため
* `client`：トークンをリフレッシュするリクエストを行うため
* `oldTokens`：`loadTokens`を使用して取得したトークンにアクセスするため

### HttpSend {id="http-send"}

[HttpSend](client-http-send.md)プラグインのAPIは次のように変更されました。

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

v2.0.0では、プラグインにアクセスするためのインデックスアクセスは利用できないことに注意してください。代わりに[HttpClient.plugin](#client-get)関数を使用してください。

### HttpClient.get(plugin: HttpClientPlugin) 関数が削除されました {id="client-get"}

バージョン2.0.0では、クライアントプラグインを受け入れる`HttpClient.get`関数は削除されました。代わりに`HttpClient.plugin`関数を使用してください。

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

### FeatureがPluginに名称変更 {id="feature-plugin-client"}

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
<a href="client-default-request.md">デフォルトリクエスト</a>
</li>
<li>
<a href="client-user-agent.md">ユーザーエージェント</a>
</li>
<li>
<a href="client-text-and-charsets.md">文字セット</a>
</li>
<li>
<a href="client-response-validation.md">レスポンス検証</a>
</li>
<li>
<a href="client-timeout.md">タイムアウト</a>
</li>
<li>
<a href="client-caching.md">HttpCache</a>
</li>
<li>
<a href="client-http-send.md">HttpSend</a>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.*</code></td>
<td><code>import io.ktor.client.plugins.*</code></td>
</tr>

<tr>
<td><a href="client-auth.md">認証</a></td>
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
<td><a href="client-cookies.md">クッキー</a></td>
<td><code>import io.ktor.client.features.cookies.*</code></td>
<td><code>import io.ktor.client.plugins.cookies.*</code></td>
</tr>

<tr>
<td><a href="client-logging.md">ロギング</a></td>
<td><code>import io.ktor.client.features.logging.*</code></td>
<td><code>import io.ktor.client.plugins.logging.*</code></td>
</tr>

<tr>
<td><a href="client-websockets.topic">WebSockets</a></td>
<td><code>import io.ktor.client.features.websocket.*</code></td>
<td><code>import io.ktor.client.plugins.websocket.*</code></td>
</tr>

<tr>
<td><a href="client-content-encoding.md">コンテンツエンコーディング</a></td>
<td><code>import io.ktor.client.features.compression.*</code></td>
<td><code>import io.ktor.client.plugins.compression.*</code></td>
</tr>
</table>

#### カスタムプラグイン {id="feature-plugin-custom-client"}
`HttpClientFeature`インターフェースは`HttpClientPlugin`に名称変更されました。

### Nativeターゲット用の新しいメモリモデル {id="new-mm"}

v2.0.0では、[Native](client-engines.md#native)ターゲットでKtorクライアントを使用するには、新しいKotlin/Nativeメモリモデルを有効にする必要があります: [新しいMMを有効にする](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)。

> v2.2.0以降、新しいKotlin/Nativeメモリモデルは[デフォルトで有効になっています](migration-to-22x.md#new-mm)。

### 'Ios' エンジンが 'Darwin' に名称変更 {id="darwin"}

`Ios` [エンジン](client-engines.md)がiOSだけでなく、macOSやtvOSなどの他のオペレーティングシステムもターゲットとしているため、v2.0.0で`Darwin`に名称変更されました。これにより、以下の変更が生じます。
* `io.ktor:ktor-client-ios`アーティファクトは`io.ktor:ktor-client-darwin`に名称変更されました。
* `HttpClient`インスタンスを作成するには、`Darwin`クラスを引数として渡す必要があります。
* `IosClientEngineConfig`設定クラスは`DarwinClientEngineConfig`に名称変更されました。

`Darwin`エンジンの設定方法については、[](client-engines.md#darwin)セクションを参照してください。

### WebSocketsコードが 'websockets' パッケージに移動 {id="client-ws-package"}

WebSocketsコードが`http-cio`から`websockets`パッケージに移動されました。これには、以下のようにインポートの更新が必要です。

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### デフォルトリクエスト {id="default-request"}

[DefaultRequest](client-default-request.md)プラグインは、`HttpRequestBuilder`の代わりに`DefaultRequestBuilder`設定クラスを使用します。

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