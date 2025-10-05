[//]: # (title: Ktor 3.3.0의 새로운 기능)

<show-structure for="chapter,procedure" depth="2"/>

_[릴리스일: 2025년 9월 11일](releases.md#release-details)_

Ktor 3.3.0은 서버, 클라이언트 및 툴링 전반에 걸쳐 새로운 기능을 제공합니다. 이번 기능 릴리스의 주요 내용은 다음과 같습니다:

*   [정적 리소스의 사용자 지정 폴백 메커니즘](#custom-fallback)
*   [OpenAPI 사양 생성](#openapi-spec-gen)
*   [HTTP/2 클리어텍스트 (h2c) 지원](#http2-h2c-support)
*   [실험적인 WebRTC 클라이언트](#webrtc-client)

## Ktor 서버

### 정적 리소스의 사용자 지정 폴백 {id="custom-fallback"}

Ktor 3.3.0은 정적 콘텐츠를 위한 새로운 `fallback()` 함수를 도입했습니다. 이 함수를 사용하면 요청된 리소스를 찾을 수 없을 때 사용자 지정 동작을 정의할 수 있습니다.

`default()`가 항상 동일한 폴백 파일을 제공하는 것과 달리, `fallback()`은 원래 요청된 경로와 현재 `ApplicationCall`에 대한 액세스를 제공합니다. 이를 사용하여 리디렉션하거나, 사용자 지정 상태 코드를 반환하거나, 다른 파일을 동적으로 제공할 수 있습니다.

사용자 지정 폴백 동작을 정의하려면 `staticFiles()`, `staticResources()`, `staticZip()`, 또는 `staticFileSystem()` 내에서 `fallback()` 함수를 사용하세요:

```kotlin
staticFiles("/files", File("textFiles")) {
    fallback { requestedPath, call ->
        when {
            requestedPath.endsWith(".php") -> call.respondRedirect("/static/index.html") // absolute path
            requestedPath.endsWith(".kt") -> call.respondRedirect("Default.kt") // relative path
            requestedPath.endsWith(".xml") -> call.respond(HttpStatusCode.Gone)
            else -> call.respondFile(File("files/index.html"))
        }
    }
}
```

### 정적 콘텐츠에 대한 LastModified 및 Etag 헤더

Ktor 3.3.0은 정적 리소스에 대한 `ETag` 및 `LastModified` 헤더 지원을 도입했습니다. [`ConditionalHeaders`](server-conditional-headers.md) 플러그인이 설치된 경우, 조건부 헤더를 처리하여 마지막 요청 이후 내용이 변경되지 않았다면 콘텐츠 본문을 전송하지 않도록 할 수 있습니다:

```kotlin
staticFiles("/filesWithEtagAndLastModified", File("files")) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

값은 각 리소스에 따라 동적으로 계산되어 응답에 적용됩니다.

미리 정의된 제공자(provider)를 사용할 수도 있습니다. 예를 들어, 리소스 콘텐츠의 SHA-256 해시를 사용하여 강력한 `ETag`를 생성하는 경우입니다:

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", File("files")) {
    etag(ETagProvider.StrongSha256)
}
```

### 개발 모드 자동 리로드 제한 사항

Ktor 3.2.0에서 도입된 [suspend 모듈 함수 지원](whats-new-320.md#suspendable-module-functions)으로 인해 블로킹 모듈 참조를 사용하는 애플리케이션에서 자동 리로드가 작동하지 않는 회귀(regression)가 발생했습니다.

이 회귀는 3.3.0에서도 여전히 존재하며, 자동 리로드는 `suspend` 함수 모듈 및 구성 참조에서만 계속 작동합니다.

지원되는 모듈 선언의 예:

```kotlin
// Supported — suspend function reference
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// Supported — configuration reference (application.conf / application.yaml)
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

향후 릴리스에서 블로킹 함수 참조에 대한 지원을 복원할 계획입니다. 그때까지 `development` 모드에서는 `suspend` 모듈 또는 구성 참조를 선호하십시오.

### HTTP/2 클리어텍스트 (h2c) 지원 {id="http2-h2c-support"}

Ktor 3.3.0은 Netty 엔진에 HTTP/2 over cleartext (h2c) 지원을 도입했습니다. 이는 TLS 암호화 없이 HTTP/2 통신을 가능하게 합니다. 이 설정은 일반적으로 로컬 테스트나 사설 네트워크와 같은 신뢰할 수 있는 환경에서 사용됩니다.

h2c를 활성화하려면 엔진 구성에서 `enableH2c` 플래그를 `true`로 설정하십시오. 자세한 내용은 [TLS 없는 HTTP/2](server-http2.md#http-2-without-tls)를 참조하십시오.

## Ktor 클라이언트

### SSE 응답 바디 버퍼

지금까지 SSE 오류 후 `response.bodyAsText()`를 호출하려 하면 이중 소비(double-consume) 문제로 인해 실패했습니다.

Ktor 3.3.0은 디버깅 및 오류 처리를 위해 이미 처리된 SSE 데이터를 캡처할 수 있는 구성 가능한 진단 버퍼를 도입했습니다.

[SSE 플러그인](client-server-sent-events.topic)을 설치할 때 버퍼를 전역적으로 구성할 수 있습니다:

```kotlin
install(SSE) {
    bufferPolicy = SSEBufferPolicy.LastEvents(10)
}
```

또는 호출별로 구성할 수 있습니다:

```kotlin
client.sse(url, { bufferPolicy(SSEBufferPolicy.All) }) {
    // …
}
```

SSE 스트림이 소비됨에 따라 클라이언트는 처리된 데이터의 스냅샷을 인메모리 버퍼에 유지합니다 (네트워크에서 다시 읽지 않고). 오류가 발생하면 로깅 또는 진단을 위해 `response?.bodyAsText()`를 안전하게 호출할 수 있습니다.

자세한 내용은 [응답 버퍼링](client-server-sent-events.topic#response-buffering)을 참조하십시오.

### WebRTC 클라이언트 {id="webrtc-client"}

이번 릴리스에서는 멀티플랫폼 프로젝트에서 P2P(peer-to-peer) 실시간 통신을 위한 실험적인 WebRTC 클라이언트 지원을 도입했습니다.

WebRTC는 영상 통화, 멀티플레이어 게임, 협업 도구와 같은 애플리케이션을 가능하게 합니다. 이번 릴리스를 통해 통합된 Kotlin API를 사용하여 JavaScript/Wasm 및 Android 타겟 간에 피어 연결을 설정하고 데이터 채널을 교환할 수 있습니다. iOS, JVM 데스크톱, Native와 같은 추가 타겟은 향후 릴리스에서 지원될 예정입니다.

`HttpClient`와 유사하게 플랫폼에 맞는 엔진을 선택하고 구성을 제공하여 `WebRtcClient`를 생성할 수 있습니다:

<TabItem title="JS/Wasm" group-key="js-wasm">

```kotlin
val jsClient = WebRtcClient(JsWebRtc) {
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>
<TabItem title="Android" group-key="android">

```kotlin
val androidClient = WebRtcClient(AndroidWebRtc) {
    context = appContext // 필수: Android 컨텍스트 제공
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>

생성되면 클라이언트는 ICE(Interactive Connectivity Establishment)를 사용하여 P2P 연결을 설정할 수 있습니다. 협상이 완료되면 피어는 데이터 채널을 열고 메시지를 교환할 수 있습니다.

```kotlin
val connection = client.createPeerConnection()

// Add a remote ICE candidate (received via your signaling channel)
connection.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// Wait until all local candidates are gathered
connection.awaitIceGatheringComplete()

// Listen for incoming data channel events
connection.dataChannelEvents.collect { event ->
   when (event) {
     is Open -> println("Another peer opened a chanel: ${event.channel}")
     is Closed -> println("Data channel is closed")
     is Closing, is BufferedAmountLow, is Error -> println(event)
   }
}

// Create a channel and send/receive messages
val channel = connection.createDataChannel("chat")
channel.send("hello")
val answer = channel.receiveText()
```

사용법 및 제한 사항에 대한 자세한 내용은 [WebRTC 클라이언트](client-webrtc.md) 문서를 참조하십시오.

### OkHttp 버전 업데이트

Ktor 3.3.0에서 Ktor 클라이언트의 `OkHttp` 엔진이 OkHttp 5.1.0 (이전 버전 4.12.0)을 사용하도록 업그레이드되었습니다. 이 주요 버전 업그레이드는 OkHttp와 직접 상호작용하는 프로젝트에 API 변경 사항을 발생시킬 수 있습니다. 이러한 프로젝트는 호환성을 확인해야 합니다.

### 통합 OkHttp SSE 세션

OkHttp 엔진은 이제 기존에 도입되었던 `OkHttpSSESession`을 대체하여 SSE(Server-Sent Events)를 위한 표준 API를 사용합니다. 이 변경 사항은 모든 클라이언트 엔진에서 SSE 처리를 통합하고 OkHttp 특정 구현의 제한 사항을 해결합니다.

## Gradle 플러그인

### OpenAPI 사양 생성 {id="openapi-spec-gen"}
<secondary-label ref="experimental"/>

Ktor 3.3.0은 Gradle 플러그인과 컴파일러 플러그인을 통해 실험적인 OpenAPI 생성 기능을 도입했습니다. 이를 통해 빌드 시 애플리케이션 코드에서 직접 OpenAPI 사양을 생성할 수 있습니다.

다음과 같은 기능을 제공합니다:
*   Ktor 라우트 정의를 분석하고 중첩된 라우트, 로컬 확장, 리소스 경로를 병합합니다.
*   선행 KDoc 주석을 파싱하여 다음을 포함한 OpenAPI 메타데이터를 제공합니다:
    *   경로(path), 쿼리(query), 헤더(header), 쿠키(cookie), 바디(body) 파라미터
    *   응답 코드 및 타입
    *   보안, 설명, 비추천(deprecation), 외부 문서 링크
*   `call.receive()` 및 `call.respond()`에서 요청 및 응답 바디를 추론합니다.

undefined</include>

#### OpenAPI 사양 생성

Ktor 라우트 및 KDoc 주석에서 OpenAPI 사양 파일을 생성하려면 다음 명령어를 사용하십시오:

```shell
./gradlew buildOpenApi
```

#### 사양 제공

생성된 사양을 런타임에 사용할 수 있도록 하려면 [OpenAPI](server-openapi.md) 또는 [SwaggerUI](server-swagger-ui.md) 플러그인을 사용할 수 있습니다.

다음 예제는 OpenAPI 엔드포인트에서 생성된 사양 파일을 제공합니다:

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}
```

이 기능에 대한 자세한 내용은 [OpenAPI 사양 생성](openapi-spec-generation.md)을 참조하십시오.

## 공유

### Jetty 버전 업데이트

Jetty 서버 및 클라이언트 엔진이 Jetty 12를 사용하도록 업그레이드되었습니다. 대부분의 애플리케이션에서 이 업그레이드는 완벽하게 이전 버전과 호환되지만, 클라이언트 및 서버 코드는 이제 내부적으로 업데이트된 Jetty API를 활용합니다.

프로젝트에서 Jetty API를 직접 사용하는 경우, 호환성을 깨뜨리는 변경 사항(breaking changes)이 있음을 유의하십시오. 자세한 내용은 [공식 Jetty 마이그레이션 가이드](https://jetty.org/docs/jetty/12.1/programming-guide/migration/11-to-12.html)를 참조하십시오.