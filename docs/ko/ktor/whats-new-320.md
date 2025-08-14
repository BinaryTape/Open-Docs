[//]: # (title: Ktor 3.2.0의 새로운 기능)

<show-structure for="chapter,procedure" depth="2"/>

_[릴리스: 2025년 6월 12일](releases.md#release-details)_

다음은 이번 기능 릴리스의 주요 내용입니다.

*   [버전 카탈로그](#published-version-catalog)
*   [의존성 주입](#dependency-injection)
*   [일급 HTMX 지원](#htmx-integration)
*   [서스펜드 가능한 모듈 함수](#suspendable-module-functions)

## Ktor 서버

### 서스펜드 가능한 모듈 함수

Ktor 3.2.0부터 [애플리케이션 모듈](server-modules.md)이 서스펜드 가능한 함수를 지원합니다.

이전에는 Ktor 모듈 내부에 비동기 함수를 추가하려면 서버 생성 시 교착 상태를 유발할 수 있는 `runBlocking` 블록이 필요했습니다.

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

이제 `suspend` 키워드를 사용하여 애플리케이션 시작 시 비동기 코드를 사용할 수 있습니다.

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 동시 모듈 로딩

`ktor.application.startup = concurrent` Gradle 속성을 추가하여 동시 모듈 로딩을 선택할 수도 있습니다. 이 속성은 모든 애플리케이션 모듈을 독립적으로 시작하므로, 하나가 일시 중단되어도 다른 모듈은 차단되지 않습니다. 이를 통해 의존성 주입을 위한 비순차 로딩과, 경우에 따라 더 빠른 로딩이 가능합니다.

자세한 내용은 [동시 모듈 로딩](server-modules.md#concurrent-module-loading)을 참조하세요.

### 구성 파일 역직렬화

Ktor 3.2.0은 `Application` 클래스에 새로운 `.property()` 확장 함수를 통해 타입이 지정된(typed) 구성 로딩을 도입합니다. 이제 구조화된 구성 섹션을 Kotlin 데이터 클래스로 직접 역직렬화할 수 있습니다.

이 기능은 구성 값에 액세스하는 방법을 간소화하고, 중첩되거나 그룹화된 설정을 다룰 때 반복적인 코드(boilerplate)를 크게 줄여줍니다.

다음 **application.yaml** 파일을 고려해 보세요.

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

이전에는 각 구성 값을 개별적으로 검색해야 했습니다. 새로운 `.property()` 확장 함수를 사용하면 전체 구성 섹션을 한 번에 로드할 수 있습니다.

<compare>
[object Promise]
[object Promise]
</compare>

이 기능은 HOCON 및 YAML 구성 형식을 모두 지원하며, 역직렬화를 위해 `kotlinx.serialization`을 사용합니다.

### `ApplicationTestBuilder`에 구성 가능한 `client`가 추가됨

Ktor 3.2.0부터 `ApplicationTestBuilder` 클래스의 `client` 속성이 변경 가능(mutable)해졌습니다. 이전에는 읽기 전용(read-only)이었습니다. 이 변경으로 인해 `ApplicationTestBuilder` 클래스를 사용할 수 있는 모든 곳에서 자신만의 테스트 클라이언트를 구성하고 재사용할 수 있게 됩니다. 예를 들어, 확장 함수 내에서 클라이언트에 액세스할 수 있습니다.

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // Pre-configure the client
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // Reusable test step extracted into an extension-function
    auth(token = AuthToken("swordfish"))

    val response = client.get("/route")
    assertEquals(OK, response.status)
}

private fun ApplicationTestBuilder.auth(token: AuthToken) {
    val response = client.post("/auth") {
        setBody(token)
    }
    assertEquals(OK, response.status)
}
```

### 의존성 주입

Ktor 3.2.0은 의존성 주입(DI) 지원을 도입하여, 구성 파일과 애플리케이션 코드에서 직접 의존성을 관리하고 연결하는 것을 더 쉽게 만듭니다. 새로운 DI 플러그인은 의존성 해결을 간소화하고, 비동기 로딩을 지원하며, 자동 정리를 제공하고, 테스트와 원활하게 통합됩니다.

<var name="artifact_name" value="ktor-server-di" />

DI를 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함하세요.

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>

#### 기본 의존성 등록

람다, 함수 참조 또는 생성자 참조를 사용하여 의존성을 등록할 수 있습니다.

```kotlin
dependencies {
  // Lambda-based
  provide<GreetingService> { GreetingServiceImpl() }

  // Function references
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // Registering a lambda as a dependency
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 구성 기반 의존성 등록

구성 파일에서 클래스패스 참조를 사용하여 의존성을 선언적으로 구성할 수 있습니다. 이는 함수 참조와 클래스 참조를 모두 지원합니다.

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // implementation 
}
```

인수는 `@Property` 및 `@Named`와 같은 어노테이션을 통해 자동으로 해결됩니다.

#### 의존성 해결 및 주입

##### 의존성 해결

의존성을 해결하려면 속성 위임(property delegation) 또는 직접 해결(direct resolution)을 사용할 수 있습니다.

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

##### 비동기 의존성 해결

비동기 로딩을 지원하려면 서스펜딩 함수(suspending functions)를 사용할 수 있습니다.

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 플러그인은 모든 의존성이 준비될 때까지 `resolve()` 호출을 자동으로 일시 중단합니다.

##### 애플리케이션 모듈에 주입

모듈 파라미터를 지정하여 애플리케이션 모듈에 직접 의존성을 주입할 수 있습니다. Ktor는 DI 컨테이너에서 이들을 해결합니다.

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt
    modules:
      - com.example.LoggingKt.logging
```

```kotlin
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

특정 키가 지정된 의존성을 주입하려면 `@Named`를 사용하세요.

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

##### 속성 및 구성 주입

구성 값을 직접 주입하려면 `@Property`를 사용하세요.

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

이는 구조화된 구성을 다루는 것을 간소화하고, 기본(primitive) 타입의 자동 파싱을 지원합니다.

자세한 내용 및 고급 사용법은 [](server-dependency-injection.md)를 참조하세요.

## Ktor 클라이언트

### `SaveBodyPlugin` 및 `HttpRequestBuilder.skipSavingBody()`는 더 이상 사용되지 않습니다.

Ktor 3.2.0 이전에는 `SaveBodyPlugin`이 기본적으로 설치되었습니다. 이 플러그인은 전체 응답 본문을 메모리에 캐시하여 여러 번 액세스할 수 있도록 했습니다. 응답 본문을 저장하지 않으려면 플러그인을 명시적으로 비활성화해야 했습니다.

Ktor 3.2.0부터 `SaveBodyPlugin`은 더 이상 사용되지 않으며(deprecated), 모든 비스트리밍 요청에 대해 응답 본문을 자동으로 저장하는 새로운 내부 플러그인으로 대체됩니다. 이는 리소스 관리를 개선하고 HTTP 응답 라이프사이클을 간소화합니다.

`HttpRequestBuilder.skipSavingBody()`도 더 이상 사용되지 않습니다. 본문을 캐시하지 않고 응답을 처리해야 하는 경우, 대신 스트리밍 방식을 사용하세요.

<compare first-title="Before" second-title="After">

```kotlin
val file = client.get("/some-file") {
    skipSavingBody()
}.bodyAsChannel()
saveFile(file)
```
```kotlin
client.prepareGet("/some-file").execute { response ->
    saveFile(response.bodyAsChannel())
}
```

</compare>

이 방식은 응답을 직접 스트리밍하여 본문이 메모리에 저장되는 것을 방지합니다.

### `.wrapWithContent()` 및 `.wrap()` 확장 함수는 더 이상 사용되지 않습니다.

Ktor 3.2.0에서는 [`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) 및 [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) 확장 함수가 새로운 `.replaceResponse()` 함수로 대체되어 더 이상 사용되지 않습니다.

`.wrapWithContent()` 및 `.wrap()` 함수는 원본 응답 본문을 한 번만 읽을 수 있는 `ByteReadChannel`로 대체합니다. 새 채널을 반환하는 함수 대신 동일한 채널 인스턴스가 직접 전달되면, 본문을 여러 번 읽는 것이 실패합니다. 이는 응답 본문에 액세스하는 여러 플러그인 간의 호환성을 깨뜨릴 수 있습니다. 왜냐하면 본문을 처음 읽는 플러그인이 본문을 소비하기 때문입니다.

```kotlin
// Replaces the body with a channel decoded once from rawContent
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// The first call returns the body
decodedResponse.bodyAsText()

// Subsequent calls return an empty string
decodedResponse.bodyAsText() 
```

이 문제를 피하려면 대신 `.replaceResponse()` 함수를 사용하세요. 이 함수는 액세스할 때마다 새 채널을 반환하는 람다를 받아서 다른 플러그인과의 안전한 통합을 보장합니다.

```kotlin
// Replaces the body with a new decoded channel on each access
call.replaceResponse {
    decode(response.rawContent)
}
```

### 해결된 IP 주소 액세스

이제 `io.ktor.network.sockets.InetSocketAddress` 인스턴스에 새로운 `.resolveAddress()` 함수를 사용할 수 있습니다. 이 함수를 사용하면 연결된 호스트의 원시(raw) 해결된 IP 주소를 얻을 수 있습니다.

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

이 함수는 해결된 IP 주소를 `ByteArray`로 반환하거나, 주소를 해결할 수 없는 경우 `null`을 반환합니다. 반환된 `ByteArray`의 크기는 IP 버전에 따라 달라집니다. IPv4 주소의 경우 4바이트를, IPv6 주소의 경우 16바이트를 포함합니다. JS 및 Wasm 플랫폼에서는 `.resolveAddress()`가 항상 `null`을 반환합니다.

## 공통

### HTMX 통합

Ktor 3.2.0은 `hx-get` 및 `hx-swap`과 같은 HTML 속성을 통해 동적인 상호작용을 가능하게 하는 최신 JavaScript 라이브러리인 [HTMX](https://htmx.org/)에 대한 실험적 지원을 도입합니다. Ktor의 HTMX 통합은 다음을 제공합니다.

*   헤더를 기반으로 HTMX 요청을 처리하기 위한 HTMX 인식 라우팅.
*   Kotlin에서 HTMX 속성을 생성하기 위한 HTML DSL 확장.
*   문자열 리터럴을 제거하기 위한 HTMX 헤더 상수 및 값.

Ktor의 HTMX 지원은 다음 세 가지 실험적 모듈을 통해 제공됩니다.

| 모듈                 | 설명                                       |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 코어 정의 및 헤더 상수                       |
| `ktor-htmx-html`   | Kotlin HTML DSL과의 통합                  |
| `ktor-server-htmx` | HTMX 특정 요청을 위한 라우팅 지원            |

모든 API는 `@ExperimentalKtorApi`로 표시되며 `@OptIn(ExperimentalKtorApi::class)`를 통해 옵트인(opt-in)해야 합니다. 자세한 내용은 [](htmx-integration.md)를 참조하세요.

## Unix 도메인 소켓

3.2.0부터 Ktor 클라이언트를 Unix 도메인 소켓에 연결하고 Ktor 서버가 해당 소켓을 수신하도록 설정할 수 있습니다. 현재 Unix 도메인 소켓은 CIO 엔진에서만 지원됩니다.

서버 구성 예시:

```kotlin
val server = embeddedServer(CIO, configure = {
    unixConnector("/tmp/test-unix-socket-ktor.sock")
}) {
    routing {
        get("/") {
            call.respondText("Hello, Unix socket world!")
        }
    }
}
```

Ktor 클라이언트를 사용하여 해당 소켓에 연결하기:

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

[기본 요청](client-default-request.md#unix-domain-sockets)에서도 Unix 도메인 소켓을 사용할 수 있습니다.

## 인프라

### 게시된 버전 카탈로그

이 릴리스부터 이제 공식 [게시된 버전 카탈로그](server-dependencies.topic#using-version-catalog)를 사용하여 모든 Ktor 의존성을 단일 소스에서 관리할 수 있습니다. 이는 의존성에 Ktor 버전을 수동으로 선언할 필요를 없애줍니다.

카탈로그를 프로젝트에 추가하려면 **settings.gradle.kts**에서 Gradle의 버전 카탈로그를 구성한 다음, 모듈의 **build.gradle.kts** 파일에서 이를 참조하세요.

<tabs>
<tab title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</tab>
<tab title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</tab>
</tabs>

## Gradle 플러그인

### 개발 모드 활성화

Ktor 3.2.0은 개발 모드를 활성화하는 것을 간소화합니다. 이전에는 개발 모드를 활성화하려면 `application` 블록에 명시적인 구성이 필요했습니다. 이제 `ktor.development` 속성을 사용하여 동적으로 또는 명시적으로 활성화할 수 있습니다.

*   프로젝트 속성에 따라 개발 모드를 동적으로 활성화합니다.
    ```kotlin
      ktor {
          development = project.ext.has("development")
      }
    ```
*   개발 모드를 명시적으로 true로 설정합니다.

    ```kotlin
    ktor {
        development = true
    }
    ```

기본적으로 `ktor.development` 값은 Gradle 프로젝트 속성 또는 시스템 속성 `io.ktor.development` 중 하나가 정의되어 있으면 자동으로 해결됩니다. 이를 통해 Gradle CLI 플래그를 사용하여 개발 모드를 직접 활성화할 수 있습니다.

```bash
./gradlew run -Pio.ktor.development=true