---
title: Ktor에서 의존성 주입
---

`koin-ktor` 모듈은 Ktor에 의존성 주입을 제공하기 위해 설계되었습니다.

## Koin 플러그인 설치

Ktor에서 Koin 컨테이너를 시작하려면 다음과 같이 `Koin` 플러그인을 설치하면 됩니다.

```kotlin
fun Application.main() {
    // Koin 설치
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

### Ktor의 의존성 주입(DI)과 호환 (4.1)

Koin 4.1은 새로운 Ktor 3.2를 완벽하게 지원합니다!

Koin의 의존성 해결 규칙을 추상화하고 `ResolutionExtension`으로 확장을 허용하기 위해 `CoreResolver`를 추출했습니다. Koin이 Ktor의 기본 DI 인스턴스를 해결하는 데 도움을 주기 위해 새로운 `KtorDIExtension`을 Ktor `ResolutionExtension`으로 추가했습니다.

Koin Ktor 플러그인은 Ktor DI 통합을 자동으로 설정합니다. 아래에서 Koin에서 Ktor 의존성을 사용하는 방법을 확인할 수 있습니다.
```kotlin
// Ktor 객체를 정의해 봅시다
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// Koin 정의에 주입해 봅시다
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## Ktor에서 주입하기

Koin의 `inject()` 및 `get()` 함수는 `Application`, `Route`, `Routing` 클래스에서 사용할 수 있습니다.

```kotlin
fun Application.main() {

    // HelloService 주입
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### Ktor 요청 스코프에서 해결하기 (4.1부터)

Ktor 요청 스코프 타임라인 내에서 살아있는 컴포넌트를 선언할 수 있습니다. 이를 위해 `requestScope` 섹션 내에 컴포넌트를 선언하기만 하면 됩니다. Ktor 웹 요청 스코프에서 인스턴스화할 `ScopeComponent` 클래스가 주어졌을 때, 다음과 같이 선언해 봅시다.

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

그리고 HTTP 호출에서 올바른 의존성을 해결하기 위해 `call.scope.get()`을 호출하기만 하면 됩니다.

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

이를 통해 스코프 지정된 의존성이 `ApplicationCall`을 의존성 해결을 위한 스코프의 소스로 해결할 수 있습니다. 생성자에 직접 주입할 수 있습니다.

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
새로운 요청마다 스코프가 다시 생성됩니다. 이는 각 요청에 대해 스코프 인스턴스를 생성하고 제거합니다.
:::

### Ktor 모듈에서 Koin 모듈 선언하기 (4.1)

`Application.koinModule {}` 또는 `Application.koinModules()`를 앱 설정 내에서 직접 사용하여 Ktor 모듈 내에 새 모듈을 선언하세요.

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

### Ktor 이벤트

Ktor Koin 이벤트를 수신할 수 있습니다.

```kotlin
fun Application.main() {
    // ...

    // Ktor 기능 설치
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin이 시작되었습니다.")
    }

    environment.monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin이 중지 중입니다...")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin이 중지되었습니다.")
    }

    //...
}