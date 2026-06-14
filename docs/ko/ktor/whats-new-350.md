[//]: # (title: Ktor 3.5.0의 새로운 기능)

<show-structure for="chapter,procedure" depth="2"/>

_[출시일: 2026년 5월 15일](releases.md#release-details)_

Ktor 3.5.0은 서버와 클라이언트 전반에 걸쳐 다양한 개선 사항을 제공합니다. 이번 기능 릴리스의 주요 내용은 다음과 같습니다:

* [RFC 7616 다이제스트 인증(Digest authentication) 지원](#rfc-7616-digest-auth)
* [루트 구성 데이터 클래스 매핑(Root configuration data class mapping)](#config-data-class-mapping)
* [변경된 경우에만 세션 쿠키 전송](#session-cookies)
* [OkHttp 및 Apache5 클라이언트 엔진의 커스텀 DNS 리졸버(DNS resolver)](#custom-dns-resolvers)

## Ktor 서버 {id="ktor-server"}

### RFC 7616 다이제스트 인증 지원 {id="rfc-7616-digest-auth"}

Ktor 3.5.0은 [RFC 7616](https://datatracker.ietf.org/doc/html/rfc7616)을 준수하도록 [`digest` 인증 프로바이더](server-digest-auth.md)를 업데이트하여 보안을 개선하고 현대적인 다이제스트 기능을 지원합니다.

이번 릴리스에서는 다음과 같은 변경 사항이 도입되었습니다:

* 이제 `algorithms` 속성을 사용하여 여러 해시 알고리즘을 구성할 수 있습니다. 여러 값이 지정되면 Ktor는 클라이언트가 지원되는 옵션 중 가장 강력한 것을 선택할 수 있도록 여러 `WWW-Authenticate` 헤더를 보냅니다.
* 문자열 기반 구성을 대체하기 위해 `DigestAlgorithm` 및 `DigestQop` 열거형(enum)이 도입되었습니다.
* `digestProvider {}` 람다는 이제 `algorithm` 파라미터를 수신하므로, 다이제스트를 동적으로 올바르게 계산할 수 있습니다.
* RFC 7616에 따라 인증 챌린지에 `qop` 파라미터가 포함됩니다.
* `SHA-256-sess` 및 `SHA-512-256-sess`와 같은 세션 기반 알고리즘에 대한 지원이 추가되었습니다.
* 개인 정보 보호 강화를 위해 RFC 7616 사용자 이름 해싱(`userhash`) 지원이 추가되었습니다.

다음 예제는 레거시 구성에서 RFC 7616을 준수하는 API로 마이그레이션하는 방법을 보여줍니다:

<compare type="left-right" first-title="레거시" second-title="RFC 7616">

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        algorithmName = "MD5"  // Deprecated property
        digestProvider { userName, realm ->
            // Old signature without algorithm parameter
            getMd5Digest("$userName:$realm:$password")
        }
    }
}
```

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        // Support both modern and legacy clients
        algorithms = listOf(DigestAlgorithm.SHA_512_256, DigestAlgorithm.MD5)
        digestProvider { userName, realm, algorithm ->
            // New signature receives the algorithm
            val password = getPassword(userName) ?: return@digestProvider null
            algorithm.toDigester().digest("$userName:$realm:$password".toByteArray())
        }
    }
}
```
</compare>

기존 구성은 변경 없이 계속 작동합니다. 하지만 새로운 애플리케이션의 경우 다음과 같은 사항을 권장합니다:

* `SHA-512-256` 또는 `SHA-256`과 같은 안전한 알고리즘을 사용하십시오.
* 새로운 `algorithms` 파라미터를 사용하도록 `digestProvider`를 업데이트하십시오.
* 레거시 클라이언트 호환성을 위해 필요한 경우가 아니면 `MD5` 기반 알고리즘은 피하십시오.

전체 가이드는 [Ktor 서버의 다이제스트 인증](server-digest-auth.md)을 참조하십시오.

### 커스텀 프로바이더의 중단 가능한(suspending) .authenticate() 오버로드

[커스텀 인증 프로바이더](server-auth.md#custom-auth-provider)는 이제 `DynamicProviderConfig.authenticate()` 함수의 중단(suspending) 버전을 구현할 수 있습니다. `.authenticate()` 함수는 중단 람다를 허용하므로 인증 내부에서 직접 코루틴 API를 호출할 수 있습니다:

```kotlin
install(Authentication) {
  provider("custom") {
    authenticate { context ->
      delay(10.milliseconds)
      context.principal(null)
    }
  }
}
```

### 루트 구성 데이터 클래스 매핑 {id="config-data-class-mapping"}

`ApplicationConfig`는 이제 전체 구성을 데이터 클래스로 역직렬화(deserializing)할 수 있는 `.getAs()` 함수를 제공합니다.

이전에는 역직렬화가 개별 속성으로 제한되어 `.property()` 함수를 통해 액세스해야 했습니다. 루트 레벨 지원을 통해 전체 구성 구조를 단일 데이터 클래스에 직접 매핑할 수 있습니다:

<compare type="top-bottom" first-title="이전" second-title="이후">

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)

val app = ApplicationConfig("application.yaml").property("app").getAs<App>()
val security = ApplicationConfig("application.yaml").property("security").getAs<Security>()
```

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)
@Serializable data class Config(val app: App, val security: Security)

val config = ApplicationConfig("application.yaml").getAs<Config>()
```

</compare>

### 필수 요청 파라미터 헬퍼 함수

Ktor 3.5.0은 `ApplicationCall`에서 필수 요청 데이터에 더 쉽게 액세스할 수 있는 새로운 확장 함수 세트를 도입했습니다.

이전에는 필수 요청 데이터를 검증할 때 반복적인 null 체크와 레이블이 지정된 반환(labeled returns)이 필요한 경우가 많았습니다. 이 워크플로를 개선하기 위해 Ktor는 이제 다음과 같은 새로운 확장 함수를 제공합니다:

* `ApplicationCall.requireQueryParameter()` — 요청 URL에서 필수 쿼리 파라미터를 가져옵니다. 파라미터가 없으면 예외를 발생시킵니다.
* `ApplicationCall.requireHeader()` — 필수 HTTP 헤더 값을 가져옵니다. 요청에 헤더가 없으면 예외를 발생시킵니다.
* `ApplicationCall.requireCookie()` — 필수 쿠키 값을 가져오며, 선택적으로 지정된 인코딩을 사용하여 디코딩합니다. 쿠키가 없으면 예외를 발생시킵니다.
* `RoutingCall.requirePathParameter()` — 라우트 정의에서 필수 경로 파라미터를 가져옵니다. 일치하는 라우트에 파라미터가 없으면 예외를 발생시킵니다.

각 함수는 null이 아닌 값을 반환하거나, 값이 없는 경우 `MissingRequestParameterException`을 발생시킵니다.

<compare>

```kotlin
post("/checkout") {
  val userId = call.request.cookies["userId"]
    ?: return@post call.respondText(
      "Login required",
      status = HttpStatusCode.Forbidden
    )

  val amount = call.request.queryParameters["amount"]?.toLongOrNull()
    ?: return@post call.respondText(
     "Amount missing",
     status = HttpStatusCode.BadRequest
  )
  
  // Business logic
}
```

```kotlin
post("/checkout") {
    val userId = call.requireCookie("userId")
    val amount = call.requireQueryParameter("amount").toLong()

    // Business logic
}
```

</compare>

### ktor-network의 ES 모듈 호환성

ES 모듈이 활성화되었을 때 `ktor-network` 및 모든 종속 모듈을 사용할 수 없게 만들었던 문제를 해결했습니다.

향후 회귀(regression)를 방지하기 위해 JavaScript 테스트 인프라는 이제 기본적으로 ES2015와 ES 모듈 모두를 대상으로 합니다.

> Kotlin/JS 모듈 시스템 및 ES2015 지원에 대한 자세한 내용은 다음을 참조하십시오:
> * [JavaScript 모듈](https://kotlinlang.org/docs/js-modules.html)
> * [ES2015 기능 지원](https://kotlinlang.org/docs/js-project-setup.html#support-for-es2015-features)
>
{style="tip"}

### Sessions 플러그인의 세션 관리 개선

Ktor 3.5.0은 세션 생명 주기, 식별자(identity) 생성 및 네트워크 동작을 더 세밀하게 제어할 수 있는 새로운 구성 옵션을 통해 [Sessions](server-sessions.md) 플러그인의 세션 처리 방식을 개선했습니다.

#### 변경된 경우에만 세션 데이터 전송 {id="session-cookies"}

이제 세션 데이터가 변경된 경우에만 전송하도록 구성을 설정할 수 있습니다. 쿠키 기반 세션의 경우, 이는 `Set-Cookie` 헤더가 수정 시에만 전송됨을 의미합니다. 이 최적화는 쿠키 및 헤더 기반 세션 모두에 적용됩니다.

기본적으로 세션 데이터는 기존 동작을 유지하기 위해 모든 응답에서 전송됩니다. 변경된 경우에만 전송하려면 세션 쿠키 구성에서 `sendOnlyIfModified` 옵션을 활성화하십시오:

```kotlin
install(Sessions) {
    cookie<MySession>("SESSION") {
        sendOnlyIfModified = true
    }
}
```

#### 요청 데이터로부터 세션 ID 생성

`CookieIdSessionBuilder.identity()` 함수는 이제 `ApplicationCall`을 인자로 받을 수 있어, 현재 애플리케이션 호출로부터 세션 ID를 유도할 수 있습니다. 이를 통해 세션을 인증된 사용자나 요청 메타데이터에 바인딩하는 등의 유스케이스가 가능해집니다.

```kotlin
install(Sessions) {
    cookie<UserSession>("user_session", storage = RedisSessionStorage()) {
        identity { call ->
            call.principal<UserIdPrincipal>()?.name ?: generateSessionId()
        }
    }
}
```

기존의 `identity()` 함수는 call을 인식하는(call-aware) 새로운 오버로드로 대체되어 더 이상 권장되지 않습니다(deprecated).

#### ID로 세션 삭제

이제 `call.sessions.clear<UserSession>()` 및 `CurrentSession.clear()` 편의 함수를 사용하여 활성 호출 없이도 저장소 ID(storage ID)를 통해 세션을 무효화할 수 있습니다. 두 함수 모두 `SessionTrackerById.clearById()`에 작업을 위임합니다.

```kotlin
post("/logout/{sessionId}") {
    val sessionId = call.requirePathParameter("sessionId")
    call.sessions.clear<UserSession>(sessionId)
    call.respond(HttpStatusCode.OK)
}
```

이 기능은 사용자의 모든 기기에서 로그아웃하거나 백그라운드 작업에서 세션을 만료시키는 등의 시나리오에서 유용합니다.

### 커스텀 SSE 하트비트(heartbeat) 이벤트

이번 릴리스에서는 이벤트 프로바이더 함수를 사용하여 하트비트 이벤트를 완전히 커스터마이징할 수 있는 Ktor 서버 측 SSE 지원을 위한 새로운 옵션을 도입했습니다:

```kotlin
heartbeat {
    period = 30.milliseconds
    eventProvider = { ServerSentEvent(data = "ts=${Clock.System.now()}") }
}
```

이를 통해 타임스탬프 및 상태 정보와 같은 커스텀 하트비트 페이로드를 일정한 간격으로 전송할 수 있습니다.

## Ktor 클라이언트 {id="ktor-client"}

### OkHttp 및 Apache5 엔진의 커스텀 DNS 리졸버 {id="custom-dns-resolvers"}

Ktor 3.5.0은 OkHttp 및 Apache5 클라이언트 엔진에서 커스텀 DNS 리졸버 구성을 위한 퍼스트 클래스(first-class) 지원을 추가했습니다.

이전에는 OkHttp의 `config {}` 또는 Apache5의 `configureConnectionManager { setDnsResolver(...) }`와 같이 엔진 고유의 내부 요소에 액세스하여 커스텀 DNS 해소를 구성했습니다. 이제 Ktor는 일관되고 타입 안전한(type-safe) API를 제공하기 위해 각 엔진에 전용 구성 속성을 노출합니다.

#### OkHttp

이제 `OkHttpConfig.dns` 속성을 사용하여 OkHttp에서 커스텀 DNS 리졸버를 구성할 수 있습니다:

```kotlin
HttpClient(OkHttp) {
    engine {
        dns = Dns { hostname -> listOf(InetAddress.getByName("127.0.0.1")) }
    }
}
```

`dns` 속성을 구성하지 않으면 OkHttp 엔진은 OkHttp의 기본 `Dns.SYSTEM` 리졸버를 계속 사용합니다.

#### Apache5

이제 `Apache5EngineConfig.dnsResolver` 속성을 사용하여 Apache5에서 커스텀 DNS 리졸버를 구성할 수 있습니다:

```kotlin
HttpClient(Apache5) {
    engine {
        dnsResolver = SystemDefaultDnsResolver.INSTANCE
    }
}
```

`dnsResolver` 속성이 구성되지 않은 경우 Apache5 엔진은 Apache 클라이언트의 기본 DNS 리졸버를 계속 사용합니다.