[//]: # (title: Ktor 3.4.0의 새로운 기능)

<show-structure for="chapter,procedure" depth="2"/>

_[출시일: 2026년 1월 23일](releases.md#release-details)_

Ktor 3.4.0은 서버, 클라이언트 및 툴링 전반에 걸쳐 다양한 개선 사항을 제공합니다. 이번 기능 릴리스의 주요 하이라이트는 다음과 같습니다:

* [Zstd 압축 지원](#zstd-compression-support)
* [HTTP 요청 라이프사이클](#http-request-lifecycle)
* [런타임 OpenAPI 라우트 어노테이션](#runtime-openapi-route-annotations)
* [OkHttp를 위한 듀플렉스 스트리밍(Duplex streaming)](#duplex-streaming-for-okhttp)

## Ktor Server

### 에러 처리를 위한 OAuth 폴백(fallback)

Ktor 3.4.0은 [OAuth](server-oauth.md) 인증 프로바이더를 위해 새로운 [`fallback()`](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-authentication-provider/-config/fallback.html) 함수를 도입했습니다. 폴백은 토큰 교환 실패, 네트워크 문제 또는 응답 파싱 에러와 같이 OAuth 흐름이 `AuthenticationFailedCause.Error`로 실패할 때 호출됩니다.

이전에는 OAuth 실패를 우회하기 위해 OAuth로 보호된 라우트에 `authenticate(optional = true)`를 사용했을 수 있습니다. 그러나 선택적 인증(optional authentication)은 자격 증명이 제공되지 않았을 때만 챌린지(challenge)를 억제할 뿐, 실제 OAuth 에러를 처리하지는 않습니다.

새로운 `fallback()` 함수는 이러한 시나리오를 처리하기 위한 전용 메커니즘을 제공합니다. 폴백에서 호출을 처리하지 않으면 Ktor는 `401 Unauthorized`를 반환합니다.

폴백을 구성하려면 `oauth` 블록 내부에서 정의하세요:

```kotlin
install(Authentication) {
    oauth("login") {
        client = ...
        urlProvider = ...
        settings = ...
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

### 정적 OAuth 프로바이더 설정

Ktor 3.4.0은 [OAuth](server-oauth.md) 인증 프로바이더를 위한 `settings` 속성을 도입했습니다. 이를 사용하여 `oauth` 블록에서 직접 정적인 OAuth 프로바이더 설정을 구성할 수 있습니다. 정적 프로바이더 구성의 경우 `providerLookup`보다 `settings`를 권장하는데, 이는 Ktor가 생성된 [OpenAPI 사양](openapi-spec-generation.md)을 위한 메타데이터를 추론할 수 있게 해주기 때문입니다.

`providerLookup` 속성은 특정 호출에 대해 동적으로 OAuth 설정을 해결해야 하는 경우를 위해 여전히 사용할 수 있습니다.

### Zstd 압축 지원

이제 [Compression](server-compression.md) 플러그인에서 [Zstd](https://github.com/facebook/zstd) 압축을 지원합니다.

`Zstd`는 높은 압축률과 짧은 압축 시간을 제공하는 빠른 압축 알고리즘이며, 압축 레벨을 구성할 수 있습니다.

이를 활성화하려면 프로젝트에 `ktor-server-compression-zstd` 의존성을 추가하세요:
```kotlin
implementation("io.ktor:ktor-server-compression-zstd:$ktor_version")
```

그런 다음, `install(Compression) {}` 블록 내부에서 원하는 설정과 함께 `zstd()` 함수를 호출하세요:

```kotlin
install(Compression) {
    gzip()
    deflate()
    zstd(level = 3)
    identity()
}
```

### 설정 파일에서의 SSL 트러스트 스토어(trust store) 설정

이제 애플리케이션 설정 파일을 사용하여 서버에 대한 추가적인 [SSL 설정](server-ssl.md#config-file)을 구성할 수 있습니다. 트러스트 스토어, 해당 비밀번호, 활성화된 TLS 프로토콜 목록을 설정에서 직접 지정할 수 있습니다.

이러한 설정은 `ktor.security.ssl` 섹션 아래에 정의합니다:

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

위의 코드에서:
- `trustStore` – 신뢰할 수 있는 인증서가 포함된 트러스트 스토어 파일의 경로.
- `trustStorePassword` – 트러스트 스토어의 비밀번호.
- `enabledProtocols` – 허용되는 TLS 프로토콜 목록.

### 부분 응답을 위한 HTML 프래그먼트(fragment)

Ktor는 이제 HTML 부분 응답을 보내기 위한 새로운 [`.respondHtmlFragment()`](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html-fragment.html) 함수를 제공합니다. 이는 HTMX와 같은 도구를 사용한 동적 UI 업데이트와 같이 전체 `<html>` 문서가 필요하지 않은 마크업을 생성할 때 유용합니다.

새로운 API는 [HTML DSL](server-html-dsl.md) 플러그인의 일부이며, 어떤 요소에서든 시작되는 HTML을 반환할 수 있게 해줍니다:

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

### HTTP 요청 라이프사이클

새로운 [`HttpRequestLifecycle` 플러그인](server-http-request-lifecycle.md)을 사용하면 클라이언트의 연결이 끊어졌을 때 실행 중인(inflight) HTTP 요청을 취소할 수 있습니다. 이는 클라이언트가 연결을 끊었을 때 리소스를 많이 소모하거나 오래 걸리는 실행 중인 HTTP 요청을 취소해야 할 때 유용합니다.

`HttpRequestLifecycle` 플러그인을 설치하고 `cancelCallOnClose = true`를 설정하여 이 기능을 활성화하세요:

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

클라이언트의 연결이 끊기면 요청을 처리하는 코루틴이 취소되고, 구조화된 동시성(structured concurrency)을 통해 모든 리소스가 정리됩니다. 해당 요청에 의해 시작된 모든 `launch` 또는 `async` 코루틴도 함께 취소됩니다. 이 기능은 현재 `Netty`와 `CIO` 엔진에서만 지원됩니다.

### 리소스로 응답하는 새로운 메서드

새로운 [`call.respondResource()`](server-responses.md#resource) 메서드는 [`call.respondFile()`](server-responses.md#file)과 유사하게 작동하지만, 파일 대신 응답에 사용할 리소스를 받습니다.

클래스패스(classpath)에서 단일 리소스를 서빙하려면 `call.respondResource()`를 사용하고 리소스 경로를 지정하세요:

```kotlin
routing {
    get("/resource") {
        call.respondResource("public/index.html")
    }
}
```

### 런타임 OpenAPI 라우트 어노테이션

<primary-label ref="experimental"/>

Ktor 3.4.0은 런타임 어노테이션을 사용하여 라우트에 OpenAPI 메타데이터를 직접 추가할 수 있는 `ktor-server-routing-openapi` 모듈을 도입했습니다. 이러한 어노테이션은 런타임에 라우트에 적용되어 라우팅 트리의 일부가 되며, OpenAPI 관련 툴링에서 사용할 수 있게 됩니다.

이 API는 실험적이며 `@OptIn(ExperimentalKtorApi::class)`를 사용한 옵트인이 필요합니다.

런타임에 라우트에 메타데이터를 추가하려면 `.describe {}` 확장 함수를 사용하세요:

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

이 API를 독립적인 확장 기능으로 사용하거나 Ktor의 OpenAPI 컴파일러 플러그인과 결합하여 이러한 호출을 자동으로 생성할 수 있습니다. [OpenAPI](server-openapi.md) 및 [SwaggerUI](server-swagger-ui.md) 플러그인도 OpenAPI 사양을 빌드할 때 이 메타데이터를 읽습니다.

> Ktor 3.4.0에서 `SwaggerUI` 및 `OpenAPI` 플러그인은 이제 `ktor-server-routing-openapi` 의존성을 필요로 합니다. 이는 의도치 않은 하위 호환성 단절(breaking change)이며 3.4.1 릴리스에서 수정될 예정입니다. 두 플러그인 중 하나를 사용하는 경우, 런타임 에러를 방지하기 위해 해당 의존성을 수동으로 추가하세요.
> 
{style="warning"}

더 자세한 내용과 예제는 [런타임 라우트 어노테이션](openapi-spec-generation.md#runtime-route-annotations)을 참조하세요.

### API Key 인증

새로운 [API Key 인증 플러그인](server-api-key-auth.md)을 사용하면 일반적으로 HTTP 헤더로 전달되는 공유 비밀(shared secret)을 사용하여 서버 라우트를 보호할 수 있습니다.

`apiKey` 프로바이더는 Ktor의 [인증 플러그인](server-auth.md)과 통합되어 커스텀 로직을 통해 들어오는 API 키를 검증하고, 헤더 이름을 사용자 정의하며, 표준 `authenticate` 블록으로 특정 라우트를 보호할 수 있게 해줍니다:

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
API Key 인증은 서비스 간 통신이나 가벼운 인증 메커니즘으로 충분한 기타 시나리오에서 사용할 수 있습니다.

더 자세한 내용과 구성 옵션은 [API Key 인증](server-api-key-auth.md)을 참조하세요.

## Core

### 다중 헤더 파싱

새로운 [`Headers.getSplitValues()`](https://api.ktor.io/ktor-http/io.ktor.http/get-split-values.html) 함수는 단일 라인에 여러 값을 포함하는 헤더를 다루는 작업을 단순화합니다.

`getSplitValues()` 함수는 지정된 구분 기호(기본값은 `,`)를 사용하여 지정된 헤더의 모든 값을 분할하여 반환합니다:

```kotlin
val headers = headers {
    append("X-Multi-Header", "1, 2")
    append("X-Multi-Header", "3")
}

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```
기본적으로 큰따옴표로 묶인 문자열 내부의 구분 기호는 무시되지만, `splitInsideQuotes = true`를 설정하여 이를 변경할 수 있습니다:

```kotlin
val headers = headers {
    append("X-Multi-Header", """a,"b,c",d""")
}

val forceSplit = headers.getSplitValues("X-Quoted", splitInsideQuotes = true)
// ["a", "\"b", "c\"", "d"]
```

## Ktor Client

### 인증 토큰 캐시 제어

Ktor 3.4.0 이전에는 [Basic](client-basic-auth.md) 및 [Bearer 인증](client-bearer-auth.md) 프로바이더를 사용하는 애플리케이션에서 사용자가 로그아웃하거나 인증 데이터를 업데이트한 후에도 오래된 토큰이나 자격 증명을 계속 보낼 수 있었습니다. 이는 각 프로바이더가 로드된 인증 토큰을 저장하는 내부 컴포넌트를 통해 `loadTokens()` 함수의 결과를 내부적으로 캐싱하고, 이 캐시가 수동으로 지워질 때까지 활성 상태로 유지되었기 때문입니다.

Ktor 3.4.0은 토큰 캐싱 동작에 대해 명시적이고 편리한 제어 기능을 제공하는 새로운 함수와 구성 옵션을 도입했습니다.

#### 인증 토큰 액세스 및 삭제

이제 클라이언트에서 직접 인증 프로바이더에 액세스하고 필요할 때 캐싱된 토큰을 삭제할 수 있습니다.

특정 프로바이더의 토큰을 삭제하려면 `.clearToken()` 함수를 사용하세요:

```kotlin
val provider = client.authProvider<BearerAuthProvider>()
provider?.clearToken()
```

모든 인증 프로바이더 가져오기:

```kotlin
val providers = client.authProviders
```

토큰 삭제를 지원하는 모든 프로바이더(현재 Basic 및 Bearer)에서 캐싱된 토큰을 삭제하려면 `HttpClient.clearAuthTokens()` 함수를 사용하세요:

```kotlin
 // 로그아웃 시 캐싱된 모든 인증 토큰 삭제
fun logout() {
    client.clearAuthTokens()
    storage.deleteTokens()
}

// 자격 증명이 업데이트될 때 캐싱된 인증 토큰 삭제
fun updateCredentials(new: Credentials) {
    storage.save(new)
    client.clearAuthTokens()  // 강제 재로드
}
```

#### 토큰 캐시 동작 구성

Basic 및 Bearer 인증 프로바이더 모두에 새로운 `cacheTokens` 구성 옵션이 추가되었습니다. 이를 통해 요청 간에 토큰이나 자격 증명을 캐싱할지 여부를 제어할 수 있습니다.

예를 들어, 자격 증명이 동적으로 제공되는 경우 캐싱을 비활성화할 수 있습니다:

```kotlin
basic {
    cacheTokens = false  // 모든 요청에서 자격 증명을 로드함
    credentials {
        getCurrentUserCredentials()
    }
}
```

캐싱 비활성화는 인증 데이터가 자주 변경되거나 항상 최신 상태를 반영해야 하는 경우에 특히 유용합니다.

### OkHttp를 위한 듀플렉스 스트리밍(Duplex streaming)

이제 OkHttp 클라이언트 엔진은 듀플렉스 스트리밍을 지원하여 클라이언트가 요청 본문 데이터를 보내는 동시에 응답 데이터를 받을 수 있도록 합니다.

응답이 시작되기 전에 요청 본문을 모두 보내야 하는 일반적인 HTTP 호출과 달리, 듀플렉스 모드는 양방향 스트리밍을 지원하여 클라이언트가 데이터를 동시에 보내고 받을 수 있게 합니다.

듀플렉스 스트리밍은 HTTP/2 연결에서 사용할 수 있으며, `OkHttpConfig`의 새로운 `duplexStreamingEnabled` 속성을 사용하여 활성화할 수 있습니다:

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

### Apache5 연결 관리자 구성

Apache5 엔진은 이제 새로운 [`configureConnectionManager {}`](https://api.ktor.io/ktor-client-apache5/io.ktor.client.engine.apache5/-apache5-engine-config/configure-connection-manager.html) 함수를 사용하여 연결 관리자를 직접 구성하는 것을 지원합니다.

이 접근 방식은 이전에 사용되던 `customizeClient { setConnectionManager(...) }` 방식보다 권장됩니다. `customizeClient`를 사용하면 Ktor가 관리하는 연결 관리자를 대체하게 되어, 엔진 설정, 타임아웃 및 기타 내부 구성을 우회할 가능성이 있습니다.

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

새로운 `configureConnectionManager {}` 함수는 Ktor가 제어권을 유지하면서 라우트당 최대 연결 수(`maxConnPerRoute`) 및 총 최대 연결 수(`maxConnTotal`)와 같은 매개변수를 조정할 수 있게 해줍니다.

### 네이티브 클라이언트 엔진을 위한 디스패처(Dispatcher) 구성

네이티브 HTTP 클라이언트 엔진(`Curl`, `Darwin`, `WinHttp`)은 이제 구성된 엔진 디스패처를 존중하며 기본적으로 `Dispatchers.IO`를 사용합니다.

`dispatcher` 속성은 항상 클라이언트 엔진 구성에서 사용할 수 있었지만, 이전에는 네이티브 엔진들이 이를 무시하고 항상 `Dispatchers.Unconfined`를 사용했습니다. 이번 변경을 통해 네이티브 엔진은 구성된 디스패처를 사용하며, 지정되지 않은 경우 `Dispatchers.IO`를 기본값으로 사용하여 다른 Ktor 클라이언트 엔진과 동작을 일치시킵니다.

다음과 같이 디스패처를 명시적으로 구성할 수 있습니다:

```kotlin
val client = HttpClient(Curl) {
    engine {
        dispatcher = Dispatchers.IO
    }
}
```
### 엔진 디스패처를 사용한 HttpStatement 실행 {id="use-engine-dispatcher"}

> Ktor 3.4.1에서 이 동작은 하위 호환성을 유지하기 위해 JVM에서 옵트인(opt-in) 방식으로 제공됩니다. 이를 기본적으로 활성화하면 Ktor를 내부적으로 사용하는 일부 라이브러리가 중단될 수 있기 때문입니다.
> 이를 활성화하려면 `io.ktor.client.statement.useEngineDispatcher` JVM 시스템 속성을 `true`로 설정하세요.
>  ```shell
>  -Dio.ktor.client.statement.useEngineDispatcher=true
>  ```
> 이 옵션은 향후 릴리스에서 기본값이 될 예정이므로, 조기에 옵트인하는 것을 권장합니다.
>
{style="warning"}

`HttpStatement.execute {}` 및 `HttpStatement.body {}` 블록은 이제 호출자의 코루틴 컨텍스트 대신 HTTP 엔진의 디스패처에서 실행됩니다. 이는 이러한 블록이 메인 스레드에서 호출될 때 실수로 블로킹되는 것을 방지합니다.

이전에는 스트리밍 응답을 파일에 쓰는 것과 같은 I/O 작업 중에 UI가 멈추는 것을 피하기 위해 사용자가 `withContext`를 사용하여 수동으로 디스패처를 전환해야 했습니다. 이번 변경을 통해 Ktor는 이러한 블록을 엔진의 코루틴 컨텍스트로 자동으로 디스패치합니다:

<compare>

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    withContext(Dispatchers.IO) {
        val channel: ByteReadChannel = httpResponse.body()
        // 데이터 처리 및 쓰기
    }
}
```

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    // 데이터 처리 및 쓰기
}
```
</compare>

### 플러그인 및 기본 요청 구성 대체

Ktor 클라이언트 구성은 이제 런타임에 기존 설정을 대체하는 기능에 대해 더 많은 제어권을 제공합니다.

#### 플러그인 구성 대체

새로운 [`installOrReplace()`](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/install-or-replace.html) 함수는 클라이언트 플러그인을 설치하거나, 이미 설치되어 있는 경우 기존 구성을 대체합니다. 이는 수동으로 플러그인을 먼저 제거하지 않고 구성을 다시 설정해야 할 때 유용합니다.

```kotlin
val client = HttpClient {
    installOrReplace(ContentNegotiation) {
        json()
    }
}
```

위의 예제에서 `ContentNegotiation`이 이미 설치되어 있다면, 해당 구성은 블록에서 제공된 새로운 구성으로 대체됩니다.

#### 기본 요청 구성 대체

[`defaultRequest()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/default-request.html) 함수는 이제 선택적 `replace` 매개변수(기본값은 `false`)를 허용합니다. `true`로 설정하면 새로운 구성이 이전의 기본 요청 설정과 병합되는 대신 이를 완전히 대체합니다.

```kotlin
val client = HttpClient {
    defaultRequest(replace = true) {
        // ...
    }
}
```

이를 통해 클라이언트 설정을 조합하거나 재사용할 때 이전의 기본 요청 구성을 명시적으로 덮어쓸 수 있습니다.

### `js` 및 `wasmJs` 타겟을 위한 공유 소스 세트 지원

Ktor는 이제 멀티플랫폼 프로젝트에서 [Kotlin의 공유 `web` 소스 세트](https://kotlinlang.org/docs/whatsnew2220.html#shared-source-set-for-js-and-wasmjs-targets)를 지원하여 `js` 및 `wasmJs` 타겟 간에 Ktor 의존성을 공유할 수 있게 합니다. 이를 통해 JavaScript와 Wasm/JS 전반에서 HTTP 클라이언트 및 엔진과 같은 웹 전용 클라이언트 코드를 더 쉽게 공유할 수 있습니다.

<Path>build.gradle.kts</Path> 파일에서 `webMain` 소스 세트에 Ktor 의존성을 선언할 수 있습니다:

```kotlin
kotlin {
    sourceSets {
        webMain.dependencies {
            implementation("io.ktor:ktor-client-js:%ktor_version%")
        }
    }
}
```

그런 다음 `js` 및 `wasmJs` 타겟 모두에서 사용 가능한 API를 사용할 수 있습니다:

```kotlin
// src/webMain/kotlin/Main.kt

actual fun createClient(): HttpClient = HttpClient(Js)
```

## I/O

### `ByteReadChannel`에서 `RawSink`로 바이트 스트리밍

이제 새로운 [`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 함수를 사용하여 채널에서 바이트를 읽고 이를 지정된 `RawSink`로 직접 쓸 수 있습니다. 이 함수는 중간 버퍼나 수동 복사 없이 대용량 응답이나 파일 다운로드를 처리하는 과정을 단순화합니다.

다음 예제는 파일을 다운로드하고 이를 새로운 로컬 파일에 씁니다:

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

println("파일이 ${file.path}에 저장되었습니다.")

```

## Gradle 플러그인

### OpenAPI 컴파일러 확장

이전에는 OpenAPI 컴파일러 플러그인이 빌드 시점에 정적인 완전한 OpenAPI 문서를 생성했습니다. Ktor 3.4.0에서는 대신 런타임에 OpenAPI 메타데이터를 제공하는 코드를 생성하며, 이는 사양을 서빙할 때 [OpenAPI](server-openapi.md) 및 [Swagger UI](server-swagger-ui.md) 플러그인에서 사용됩니다.

전용 `buildOpenApi` Gradle 태스크는 제거되었습니다. 컴파일러 플러그인은 이제 일반 빌드 중에 자동으로 적용되며, 라우트나 어노테이션의 변경 사항은 추가적인 생성 단계 없이 실행 중인 서버에 반영됩니다.

#### 구성

구성은 여전히 `ktor` Gradle 확장 내부의 `openApi {}` 블록을 사용하여 수행됩니다. 그러나 `title`, `version`, `description`, `target`과 같이 전역 OpenAPI 메타데이터를 정의하는 데 사용되던 속성들은 더 이상 사용되지 않으며(deprecated) 무시됩니다.

전역 OpenAPI 메타데이터는 이제 컴파일 시점이 아닌 런타임에 정의되고 해결됩니다.

컴파일러 확장 구성은 이제 메타데이터가 추론되고 수집되는 방식을 제어하는 기능 옵션으로 제한됩니다.

Ktor 3.3.0의 실험적 프리뷰에서 마이그레이션하는 사용자의 경우, 구성이 다음과 같이 변경되었습니다:

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
        // 컴파일러 플러그인에 대한 전역 제어
        enabled = true
        // 호출 핸들러 코드에서 세부 정보를 추론할지 여부를 설정
        codeInferenceEnabled = true
        // 모든 라우트를 분석할지 아니면 주석이 달린 라우트만 분석할지 토글
        onlyCommented = false
    }
}
```

</compare>