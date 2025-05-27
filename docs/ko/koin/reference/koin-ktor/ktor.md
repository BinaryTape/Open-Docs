---
title: Ktor에서 의존성 주입
---

`koin-ktor` 모듈은 Ktor에 의존성 주입을 제공하기 위해 설계되었습니다.

## Koin 플러그인 설치

Ktor에서 Koin 컨테이너를 시작하려면 다음과 같이 `Koin` 플러그인을 설치하면 됩니다.

```kotlin
fun Application.main() {
    // Install Koin
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

## Ktor에서 주입하기

Koin의 `inject()` 및 `get()` 함수는 `Application`, `Route`, `Routing` 클래스에서 사용할 수 있습니다.

```kotlin
fun Application.main() {

    // inject HelloService
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### Ktor 요청 스코프에서 해결하기 (4.1.0부터)

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

:::note
새로운 요청마다 스코프가 다시 생성됩니다. 이는 각 요청에 대해 스코프 인스턴스를 생성하고 제거합니다.
:::

### 외부 Ktor 모듈에서 Koin 실행하기

Ktor 모듈의 경우, 특정 Koin 모듈을 로드할 수 있습니다. `koin { }` 함수로 선언하기만 하면 됩니다.

```kotlin
fun Application.module2() {

    koin {
        // load koin modules
        modules(appModule2)
    }

}
```

### Ktor 이벤트

Ktor Koin 이벤트를 수신할 수 있습니다.

```kotlin
fun Application.main() {
    // ...

    // Install Ktor features
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started.")
    }

    environment.monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin stopping...")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped.")
    }

    //...
}
```