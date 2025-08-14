[//]: # (title: 2.0.x에서 2.2.x로 마이그레이션)

<show-structure for="chapter" depth="2"/>

이 가이드는 Ktor 애플리케이션을 2.0.x 버전에서 2.2.x 버전으로 마이그레이션하는 방법에 대한 지침을 제공합니다.

> `WARNING` 폐기 수준으로 표시된 API는 3.0.0 릴리스까지 계속 작동합니다.
> 폐기 수준에 대한 자세한 내용은 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)에서 확인할 수 있습니다.

## Ktor 서버 {id="server"}

### 쿠키 {id="cookies"}
v2.2.0부터 응답 [쿠키](server-responses.md#cookies) 구성과 관련된 다음 API 멤버가 변경됩니다:
- `append` 함수에 전달되는 `maxAge` 파라미터 타입이 `Int`에서 `Long`으로 변경됩니다.
- `appendExpired` 함수는 폐기됩니다. 대신 `expires` 파라미터와 함께 `append` 함수를 사용하세요.

### 요청 주소 정보 {id="request-address-info"}

2.2.0 버전부터 `RequestConnectionPoint.host` 및 `RequestConnectionPoint.port` 프로퍼티는 요청이 이루어진 호스트 이름/포트를 가져오는 데 사용되었던 기능이 폐기됩니다.

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

대신 `RequestConnectionPoint.serverHost` 및 `RequestConnectionPoint.serverPort`를 사용하세요.
또한 요청이 수신된 호스트 이름/포트를 반환하는 `localHost`/`localPort` 프로퍼티도 추가되었습니다.
자세한 내용은 [](server-forward-headers.md#original-request-information)에서 확인할 수 있습니다.

### 구성 병합 {id="merge-configs"}
v2.2.0 이전에는 `List<ApplicationConfig>.merge()` 함수를 사용하여 애플리케이션 구성을 병합했습니다.
두 구성에 동일한 키가 있는 경우, 결과 구성은 첫 번째 구성의 값을 사용했습니다.
이번 릴리스부터 이 동작을 개선하기 위해 다음 API가 도입되었습니다:
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`: 이 함수는 `merge()`와 동일하게 작동하며 첫 번째 구성의 값을 사용합니다.
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`: 결과 구성은 두 번째 구성의 값을 사용합니다.

## Ktor 클라이언트 {id="client"}

### 캐싱: 영구 저장소 {id="persistent-storage"}

v2.2.0부터 응답 [캐싱](client-caching.md)과 관련된 다음 API가 폐기됩니다:
- `HttpCacheStorage` 클래스는 `CacheStorage` 인터페이스로 대체됩니다. 이 인터페이스는 필요한 플랫폼에 대한 영구 저장소를 구현하는 데 사용될 수 있습니다.
- `publicStorage`/`privateStorage` 프로퍼티는 `CacheStorage` 인스턴스를 허용하는 해당 함수로 대체됩니다.

### 사용자 지정 플러그인 {id="custom-plugins"}

2.2.0 릴리스부터 Ktor는 사용자 지정 클라이언트 플러그인을 생성하기 위한 새로운 API를 제공합니다.
자세한 내용은 [](client-custom-plugins.md)를 참조하세요.

## 새 메모리 모델 {id="new-mm"}

v2.2.0부터 Ktor는 Kotlin 1.7.20 버전을 사용하며, 이 버전에서는 새로운 Kotlin/Native 메모리 모델이 [기본적으로 활성화됩니다](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default).
이는 [네이티브 서버](server-native.md) 또는 [Kotlin/Native](client-engines.md#native)를 대상으로 하는 클라이언트 엔진에 대해 명시적으로 활성화할 필요가 없음을 의미합니다.