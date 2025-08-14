[//]: # (title: 1.6.x에서 2.0.x로 마이그레이션)

<show-structure for="chapter" depth="2"/>

이 가이드는 Ktor 애플리케이션을 1.6.x 버전에서 2.0.x 버전으로 마이그레이션하는 방법을 안내합니다.

## Ktor 서버 {id="server"}
### 서버 코드가 'io.ktor.server.*' 패키지로 이동되었습니다. {id="server-package"}
서버 및 클라이언트 API를 통합하고 더 잘 구분하기 위해, 서버 코드가 `io.ktor.server.*` 패키지로 이동되었습니다 ([KTOR-2865](https://youtrack.jetbrains.com/issue/KTOR-2865)).
이는 아래와 같이 애플리케이션의 [의존성](#server-package-dependencies)과 [임포트](#server-package-imports)를 업데이트해야 함을 의미합니다.

#### 의존성 {id="server-package-dependencies"}
| 서브시스템                                           |               1.6.x               |                                                                                2.0.0 |
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

> 모든 플러그인을 한 번에 추가하려면, `io.ktor:ktor-server` 아티팩트를 사용할 수 있습니다.

#### 임포트 {id="server-package-imports"}
| 서브시스템                                           |                 1.6.x                 |                                                2.0.0 |
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

### WebSockets 코드가 'websockets' 패키지로 이동되었습니다. {id="server-ws-package"}

WebSockets 코드가 `http-cio`에서 `websockets` 패키지로 이동되었습니다. 이에 따라 임포트를 다음과 같이 업데이트해야 합니다.

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

이 변경사항은 [클라이언트](#client-ws-package)에도 영향을 미칩니다.

### Feature가 Plugin으로 이름이 변경되었습니다. {id="feature-plugin"}

Ktor 2.0.0에서는 요청/응답 파이프라인을 가로채는 기능을 더 잘 설명하기 위해 _Feature_가 _[Plugin](server-plugins.md)_으로 이름이 변경되었습니다 ([KTOR-2326](https://youtrack.jetbrains.com/issue/KTOR-2326)).
이는 전체 Ktor API에 영향을 미치며 아래 설명된 대로 애플리케이션을 업데이트해야 합니다.

#### 임포트 {id="feature-plugin-imports"}
[플러그인 설치](server-plugins.md#install)에는 임포트 업데이트가 필요하며, [서버 코드](#server-package-imports)를 `io.ktor.server.*` 패키지로 이동하는 것과도 관련이 있습니다.

| 1.6.x                       |                             2.0.0 |
|:----------------------------|----------------------------------:|
| `import io.ktor.features.*` | `import io.ktor.server.plugins.*` |

#### 커스텀 플러그인 {id="feature-plugin-custom"}

Feature를 Plugin으로 이름 변경함에 따라 [커스텀 플러그인](server-custom-plugins-base-api.md)과 관련된 API에 다음과 같은 변경사항이 발생합니다.
* `ApplicationFeature` 인터페이스가 `BaseApplicationPlugin`으로 이름이 변경되었습니다.
* `Features` [파이프라인 단계](server-custom-plugins-base-api.md#pipelines)가 `Plugins`로 이름이 변경되었습니다.

> v2.0.0부터 Ktor는 [커스텀 플러그인 생성](server-custom-plugins.md)을 위한 새로운 API를 제공합니다. 일반적으로 이 API는 파이프라인, 단계 등과 같은 Ktor의 내부 개념에 대한 이해를 요구하지 않습니다. 대신, `onCall`, `onCallReceive`, `onCallRespond` 등과 같은 다양한 핸들러를 사용하여 요청 및 응답 처리의 여러 단계에 접근할 수 있습니다. 이 섹션에서 새로운 API의 파이프라인 단계가 핸들러에 어떻게 매핑되는지 확인할 수 있습니다: [](server-custom-plugins-base-api.md#mapping).

### 콘텐츠 협상 및 직렬화 {id="serialization"}

[콘텐츠 협상 및 직렬화](server-serialization.md) 서버 API는 서버와 클라이언트 간에 직렬화 라이브러리를 재사용하도록 리팩터링되었습니다.
주요 변경사항은 다음과 같습니다.
* `ContentNegotiation`은 `ktor-server-core`에서 별도의 `ktor-server-content-negotiation` 아티팩트로 이동되었습니다.
* 직렬화 라이브러리가 `ktor-*`에서 클라이언트에서도 사용되는 `ktor-serialization-*` 아티팩트로 이동되었습니다.

아래와 같이 애플리케이션의 [의존성](#dependencies-serialization)과 [임포트](#imports-serialization)를 업데이트해야 합니다.

#### 의존성 {id="dependencies-serialization"}

| 서브시스템                                 |            1.6.x             |                                     2.0.0 |
|:------------------------------------------|:----------------------------:|------------------------------------------:|
| [ContentNegotiation](server-serialization.md)    |  `io.ktor:ktor-server-core`  | `io.ktor:ktor-server-content-negotiation` |
| [kotlinx.serialization](server-serialization.md) | `io.ktor:ktor-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| [Gson](server-serialization.md)                  |     `io.ktor:ktor-gson`      |         `io.ktor:ktor-serialization-gson` |
| [Jackson](server-serialization.md)               |    `io.ktor:ktor-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 임포트 {id="imports-serialization"}
| 서브시스템                                 |              1.6.x               |                                         2.0.0 |
|:------------------------------------------|:--------------------------------:|----------------------------------------------:|
| [kotlinx.serialization](server-serialization.md) | `import io.ktor.serialization.*` | `import io.ktor.serialization.kotlinx.json.*` |
| [Gson](server-serialization.md)                  |     `import io.ktor.gson.*`      |         `import io.ktor.serialization.gson.*` |
| [Jackson](server-serialization.md)               |    `import io.ktor.jackson.*`    |      `import io.ktor.serialization.jackson.*` |

#### 커스텀 컨버터 {id="serialization-custom-converter"}

[ContentConverter](server-serialization.md#implement_custom_serializer) 인터페이스에서 노출되는 함수 시그니처가 다음과 같이 변경되었습니다.

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

### 테스팅 API {id="testing-api"}

v2.0.0부터 Ktor 서버는 [테스팅](server-testing.md)을 위한 새로운 API를 사용하며, 이는 [KTOR-971](https://youtrack.jetbrains.com/issue/KTOR-971)에 설명된 다양한 문제를 해결합니다. 주요 변경사항은 다음과 같습니다.
* `withTestApplication`/`withApplication` 함수가 새로운 `testApplication` 함수로 대체되었습니다.
* `testApplication` 함수 내부에서 기존 [Ktor 클라이언트](client-create-and-configure.md) 인스턴스를 사용하여 서버에 요청하고 결과를 확인할 수 있습니다.
* 특정 기능(예: 쿠키 또는 WebSockets)을 테스트하려면 새로운 클라이언트 인스턴스를 생성하고 해당 [플러그인](client-plugins.md)을 설치해야 합니다.

1.6.x 테스트를 2.0.0으로 마이그레이션하는 몇 가지 예시를 살펴보겠습니다.

#### 기본 서버 테스트 {id="basic-test"}

아래 테스트에서는 `handleRequest` 함수가 `client.get` 요청으로 대체되었습니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

아래 테스트에서는 `handleRequest` 함수가 `client.post` 요청으로 대체되었습니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

v2.0.0에서 `multipart/form-data`를 빌드하려면, 클라이언트의 `setBody` 함수에 `MultiPartFormDataContent`를 전달해야 합니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### JSON 데이터 {id="json-data"}

v1.6.x에서는 `kotlinx.serialization` 라이브러리에서 제공하는 `Json.encodeToString` 함수를 사용하여 JSON 데이터를 직렬화할 수 있습니다.
v2.0.0부터는 새로운 클라이언트 인스턴스를 생성하고 특정 형식으로 콘텐츠를 직렬화/역직렬화할 수 있게 하는 [ContentNegotiation](client-serialization.md) 플러그인을 설치해야 합니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### 테스트 중 쿠키 보존 {id="preserving-cookies"}

v1.6.x에서는 `cookiesSession`이 테스트 시 요청 간에 쿠키를 보존하는 데 사용됩니다. v2.0.0부터는 새로운 클라이언트 인스턴스를 생성하고 [HttpCookies](client-cookies.md) 플러그인을 설치해야 합니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

#### WebSockets {id="testing-ws"}

이전 API에서는 `handleWebSocketConversation`이 [WebSocket 대화](server-websockets.md)를 테스트하는 데 사용됩니다. v2.0.0부터는 클라이언트에서 제공하는 [WebSockets](client-websockets.topic) 플러그인을 사용하여 WebSocket 대화를 테스트할 수 있습니다.

<tabs group="ktor_versions">
<tab title="1.6.x" group-key="1_6">

[object Promise]

</tab>
<tab title="2.0.0" group-key="2_0">

[object Promise]

</tab>
</tabs>

### DoubleReceive {id="double-receive"}
v2.0.0부터 [DoubleReceive](server-double-receive.md) 플러그인 구성에 `cacheRawRequest` 속성이 도입되었으며, 이는 `receiveEntireContent`와 반대되는 개념입니다.
- v1.6.x에서는 `receiveEntireContent` 속성이 기본적으로 `false`로 설정되어 있습니다.
- v2.0.0에서는 `cacheRawRequest`가 기본적으로 `true`로 설정됩니다. `receiveEntireContent` 속성은 제거되었습니다.

### Forwarded 헤더 {id="forwarded-headers"}

v2.0.0에서는 `ForwardedHeaderSupport` 및 `XForwardedHeaderSupport` 플러그인이 각각 [ForwardedHeaders](server-forward-headers.md) 및 `XForwardedHeaders`로 이름이 변경되었습니다.

### 캐싱 헤더 {id="caching-headers"}

캐싱 옵션을 정의하는 데 사용되는 [options](server-caching-headers.md#configure) 함수는 이제 `OutgoingContent` 외에도 `ApplicationCall`을 람다 인자로 받습니다.

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

### 조건부 헤더 {id="conditional-headers"}

리소스 버전 목록을 정의하는 데 사용되는 [version](server-conditional-headers.md#configure) 함수는 이제 `OutgoingContent` 외에도 `ApplicationCall`을 람다 인자로 받습니다.

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

[CORS](server-cors.md) 구성에 사용되는 여러 함수 이름이 변경되었습니다.
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
v1.6.x에서는 HTTP 요청 모니터링에 사용되는 [Ktor 메트릭](server-metrics-micrometer.md)의 기본 이름(접두사)을 지정하는 데 `baseName` 속성이 사용됩니다.
기본적으로 `ktor.http.server`와 같습니다.
v2.0.0부터 `baseName`은 기본값이 `ktor.http.server.requests`인 `metricName`으로 대체되었습니다.

## Ktor 클라이언트 {id="client"}
### 요청 및 응답 {id="request-response"}

v2.0.0에서는 요청 및 응답을 처리하는 데 사용되는 API가 더 일관되고 검색하기 쉽도록 업데이트되었습니다 ([KTOR-29](https://youtrack.jetbrains.com/issue/KTOR-29)).

#### 요청 함수 {id="request-overloads"}

여러 매개변수를 가진 [요청 함수](client-requests.md)는 더 이상 사용되지 않습니다. 예를 들어, `port` 및 `path` 매개변수는 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)에서 노출하는 `url` 매개변수로 대체되어야 합니다.

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

`HttpRequestBuilder`는 요청 함수 람다 내에서 추가 [요청 매개변수](client-requests.md#parameters)를 지정할 수 있도록 합니다.

#### 요청 본문 {id="request-body"}

[요청 본문](client-requests.md#body)을 설정하는 데 사용되던 `HttpRequestBuilder.body` 속성이 `HttpRequestBuilder.setBody` 함수로 대체되었습니다.

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

#### 응답 {id="responses"}
v2.0.0부터 요청 함수(예: `get`, `post`, `put`, [submitForm](client-requests.md#form_parameters) 등)는 특정 타입의 객체를 수신하기 위한 제네릭 인자를 받지 않습니다.
이제 모든 요청 함수는 `HttpResponse` 객체를 반환하며, 이 객체는 특정 타입 인스턴스를 수신하기 위한 제네릭 인자와 함께 `body` 함수를 노출합니다.
`bodyAsText` 또는 `bodyAsChannel`을 사용하여 콘텐츠를 문자열 또는 채널로 수신할 수도 있습니다.

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

[ContentNegotiation](client-serialization.md) 플러그인이 설치된 경우 임의의 객체를 다음과 같이 수신할 수 있습니다.

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

#### 스트리밍 응답 {id="streaming-response"}
요청 함수에서 [제네릭 인자를 제거](#responses)했기 때문에 스트리밍 응답을 수신하려면 별도의 함수가 필요합니다.
이를 위해 `prepareGet` 또는 `preparePost`와 같이 `prepare` 접두사가 붙은 함수가 추가되었습니다.

```kotlin
public suspend fun HttpClient.prepareGet(builder: HttpRequestBuilder): HttpStatement
public suspend fun HttpClient.preparePost(builder: HttpRequestBuilder): HttpStatement
```

아래 예시는 이 경우 코드를 변경하는 방법을 보여줍니다.

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

전체 예시는 여기에서 확인할 수 있습니다: [](client-responses.md#streaming).

### 응답 유효성 검사 {id="response-validation"}

v2.0.0부터 [응답 유효성 검사](client-response-validation.md)에 사용되는 `expectSuccess` 속성은 기본적으로 `false`로 설정됩니다.
이에 따라 코드에 다음과 같은 변경이 필요합니다.
- [기본 유효성 검사 활성화](client-response-validation.md#default) 및 2xx가 아닌 응답에 대한 예외를 발생시키려면 `expectSuccess` 속성을 `true`로 설정하세요.
- `handleResponseExceptionWithRequest`를 사용하여 [2xx가 아닌 예외를 처리](client-response-validation.md#non-2xx)하는 경우에도 `expectSuccess`를 명시적으로 활성화해야 합니다.

#### HttpResponseValidator {id="http-response-validator"}

[handleResponseException](client-response-validation.md#non-2xx) 함수는 `handleResponseExceptionWithRequest`로 대체되었으며, 이는 예외에서 추가 정보를 제공하기 위해 `HttpRequest`에 대한 접근을 추가합니다.

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

### 콘텐츠 협상 및 직렬화 {id="serialization-client"}

Ktor 클라이언트는 이제 콘텐츠 협상을 지원하며 Ktor 서버와 직렬화 라이브러리를 공유합니다.
주요 변경사항은 다음과 같습니다.
* `JsonFeature`는 `ktor-client-content-negotiation` 아티팩트에서 찾을 수 있는 `ContentNegotiation`으로 대체되어 더 이상 사용되지 않습니다.
* 직렬화 라이브러리가 `ktor-client-*`에서 `ktor-serialization-*` 아티팩트로 이동되었습니다.

아래와 같이 클라이언트 코드의 [의존성](#imports-dependencies-client)과 [임포트](#imports-serialization-client)를 업데이트해야 합니다.

#### 의존성 {id="imports-dependencies-client"}

| 서브시스템             |                1.6.x                |                                     2.0.0 |
|:----------------------|:-----------------------------------:|------------------------------------------:|
| `ContentNegotiation`  |                 n/a                 | `io.ktor:ktor-client-content-negotiation` |
| kotlinx.serialization | `io.ktor:ktor-client-serialization` | `io.ktor:ktor-serialization-kotlinx-json` |
| Gson                  |     `io.ktor:ktor-client-gson`      |         `io.ktor:ktor-serialization-gson` |
| Jackson               |    `io.ktor:ktor-client-jackson`    |      `io.ktor:ktor-serialization-jackson` |

#### 임포트 {id="imports-serialization-client"}
| 서브시스템             |                  1.6.x                  |                                                2.0.0 |
|:----------------------|:---------------------------------------:|-----------------------------------------------------:|
| `ContentNegotiation`  |                   n/a                   | `import io.ktor.client.plugins.contentnegotiation.*` |
| kotlinx.serialization | `import io.ktor.client.features.json.*` |        `import io.ktor.serialization.kotlinx.json.*` |
| Gson                  | `import io.ktor.client.features.json.*` |                `import io.ktor.serialization.gson.*` |
| Jackson               | `import io.ktor.client.features.json.*` |             `import io.ktor.serialization.jackson.*` |

### Bearer 인증

[refreshTokens](client-bearer-auth.md) 함수는 이제 `HttpResponse` 람다 인자(`it`) 대신 [람다 수신자](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)(`this`)로 `RefreshTokenParams` 인스턴스를 사용합니다.

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

`RefreshTokenParams`는 다음 속성을 노출합니다.
* `response`: 응답 매개변수에 접근;
* `client`: 토큰을 새로 고치기 위한 요청을 수행;
* `oldTokens`: `loadTokens`를 사용하여 얻은 토큰에 접근.

### HttpSend {id="http-send"}

[HttpSend](client-http-send.md) 플러그인의 API가 다음과 같이 변경되었습니다.

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

v2.0.0부터는 플러그인 접근을 위한 인덱스 접근 방식은 더 이상 사용할 수 없습니다. 대신 [HttpClient.plugin](#client-get) 함수를 사용하세요.

### `HttpClient.get(plugin: HttpClientPlugin)` 함수가 제거되었습니다. {id="client-get"}

2.0.0 버전부터 클라이언트 플러그인을 인자로 받는 `HttpClient.get` 함수가 제거되었습니다. 대신 `HttpClient.plugin` 함수를 사용하세요.

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

### Feature가 Plugin으로 이름이 변경되었습니다. {id="feature-plugin-client"}

Ktor 서버와 마찬가지로 클라이언트 API에서도 _Feature_가 _Plugin_으로 이름이 변경되었습니다.
이는 아래 설명된 대로 애플리케이션에 영향을 미칠 수 있습니다.

#### 임포트 {id="feature-plugin-imports-client"}
[플러그인 설치](client-plugins.md#install)를 위해 임포트를 업데이트하세요.

<table>
<tr>
<td>서브시스템</td>
<td>1.6.x</td>
<td>2.0.0</td>
</tr>
<tr>
<td>
<list>
<li>
<Links href="/ktor/client-default-request" summary="DefaultRequest 플러그인을 사용하면 모든 요청에 대한 기본 매개변수를 구성할 수 있습니다.">기본 요청</Links>
</li>
<li>
<Links href="/ktor/client-user-agent" summary="undefined">사용자 에이전트</Links>
</li>
<li>
<Links href="/ktor/client-text-and-charsets" summary="undefined">문자 집합</Links>
</li>
<li>
<Links href="/ktor/client-response-validation" summary="응답 상태 코드에 따라 응답 유효성을 검사하는 방법을 알아보세요.">응답 유효성 검사</Links>
</li>
<li>
<Links href="/ktor/client-timeout" summary="코드 예시:
        
            %example_name%">타임아웃</Links>
</li>
<li>
<Links href="/ktor/client-caching" summary="HttpCache 플러그인을 사용하면 이전에 가져온 리소스를 메모리 또는 영구 캐시에 저장할 수 있습니다.">HttpCache</Links>
</li>
<li>
<Links href="/ktor/client-http-send" summary="코드 예시:
        
            %example_name%">HttpSend</Links>
</li>
</list>
</td>
<td><code>import io.ktor.client.features.*</code></td>
<td><code>import io.ktor.client.plugins.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-auth" summary="Auth 플러그인은 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리합니다.">인증</Links></td>
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
<td><Links href="/ktor/client-cookies" summary="HttpCookies 플러그인은 쿠키를 자동으로 처리하고 호출 간에 스토리지에 보관합니다.">쿠키</Links></td>
<td><code>import io.ktor.client.features.cookies.*</code></td>
<td><code>import io.ktor.client.plugins.cookies.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-logging" summary="필수 의존성: io.ktor:ktor-client-logging

    
        코드 예시:
        
            %example_name%">로깅</Links></td>
<td><code>import io.ktor.client.features.logging.*</code></td>
<td><code>import io.ktor.client.plugins.logging.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-websockets" summary="Websockets 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">WebSockets</Links></td>
<td><code>import io.ktor.client.features.websocket.*</code></td>
<td><code>import io.ktor.client.plugins.websocket.*</code></td>
</tr>

<tr>
<td><Links href="/ktor/client-content-encoding" summary="ContentEncoding 플러그인을 사용하면 지정된 압축 알고리즘(예: 'gzip' 및 'deflate')을 활성화하고 해당 설정을 구성할 수 있습니다.">콘텐츠 인코딩</Links></td>
<td><code>import io.ktor.client.features.compression.*</code></td>
<td><code>import io.ktor.client.plugins.compression.*</code></td>
</tr>
</table>

#### 커스텀 플러그인 {id="feature-plugin-custom-client"}
`HttpClientFeature` 인터페이스가 `HttpClientPlugin`으로 이름이 변경되었습니다.

### 네이티브 타겟을 위한 새로운 메모리 모델 {id="new-mm"}

v2.0.0부터 [네이티브](client-engines.md#native) 타겟에서 Ktor 클라이언트를 사용하려면 새로운 Kotlin/Native 메모리 모델인 [새로운 MM 활성화](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#enable-the-new-mm)를 해야 합니다.

> v2.2.0부터 새로운 Kotlin/Native 메모리 모델은 [기본적으로 활성화됩니다](migration-to-22x.md#new-mm).

### 'Ios' 엔진이 'Darwin'으로 이름이 변경되었습니다. {id="darwin"}

`Ios` [엔진](client-engines.md)이 iOS뿐만 아니라 macOS, tvOS를 포함한 다른 운영 체제를 대상으로 하기 때문에 v2.0.0에서는 `Darwin`으로 이름이 변경되었습니다. 이는 다음과 같은 변경 사항을 야기합니다.
* `io.ktor:ktor-client-ios` 아티팩트가 `io.ktor:ktor-client-darwin`으로 이름이 변경되었습니다.
* `HttpClient` 인스턴스를 생성하려면 `Darwin` 클래스를 인자로 전달해야 합니다.
* `IosClientEngineConfig` 구성 클래스가 `DarwinClientEngineConfig`로 이름이 변경되었습니다.

`Darwin` 엔진을 구성하는 방법을 알아보려면 [](client-engines.md#darwin) 섹션을 참조하세요.

### WebSockets 코드가 'websockets' 패키지로 이동되었습니다. {id="client-ws-package"}

WebSockets 코드가 `http-cio`에서 `websockets` 패키지로 이동되었습니다. 이에 따라 임포트를 다음과 같이 업데이트해야 합니다.

| 1.6.x                                 |                        2.0.0 |
|:--------------------------------------|-----------------------------:|
| `import io.ktor.http.cio.websocket.*` | `import io.ktor.websocket.*` |

### 기본 요청 {id="default-request"}

[DefaultRequest](client-default-request.md) 플러그인은 `HttpRequestBuilder` 대신 `DefaultRequestBuilder` 구성 클래스를 사용합니다.

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