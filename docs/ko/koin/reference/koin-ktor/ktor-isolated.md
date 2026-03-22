---
title: 격리된 컨텍스트
---

# Ktor에서의 격리된 컨텍스트

`KoinIsolated` 플러그인은 전역 Koin 인스턴스와는 별개로 격리된 컨텍스트(isolated context)에서 Koin을 실행합니다. 이는 테스트, 멀티 테넌트(multi-tenant) 애플리케이션, 그리고 여러 Koin 인스턴스를 실행하는 데 유용합니다.

## 격리된 컨텍스트를 사용하는 경우

- **테스트** - 각 테스트는 자신만의 격리된 Koin 인스턴스를 가집니다.
- **멀티 테넌트 애플리케이션** - 서로 다른 설정을 가진 다양한 테넌트들을 지원할 때 유용합니다.
- **플러그인/모듈 시스템** - 자체 의존성을 가진 독립적인 모듈을 구성할 때 유용합니다.
- **내장형(Embedded) Ktor 서버** - 동일한 JVM 내에서 여러 Ktor 인스턴스를 실행할 때 유용합니다.

## 기본 설정

`Koin` 대신 `KoinIsolated`를 설치합니다:

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 전역 컨텍스트 vs 격리된 컨텍스트

### 전역 컨텍스트 (기본값)

```kotlin
// GlobalContext를 사용하며, 애플리케이션 전체에서 공유됩니다.
install(Koin) {
    modules(appModule)
}

// GlobalContext를 통해 어디서나 Koin에 접근할 수 있습니다.
val service = GlobalContext.get().get<UserService>()
```

### 격리된 컨텍스트

```kotlin
// 격리된 컨텍스트를 사용하며, GlobalContext를 통해 접근할 수 없습니다.
install(KoinIsolated) {
    modules(appModule)
}

// GlobalContext.get()은 이 Koin 인스턴스를 반환하지 않습니다.
// 오직 Ktor 애플리케이션 스코프 내에서만 접근 가능합니다.
```

:::warning
`KoinIsolated`를 사용할 때는 `GlobalContext`를 통해 Koin에 접근할 수 없습니다. 모든 주입(injection)은 `inject()` 또는 `get()`을 사용하여 Ktor 애플리케이션 스코프 내에서 이루어져야 합니다.
:::

## 전체 예제

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
    }
}

fun Application.main() {
    // 격리 모드로 Koin 설치
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // Application 스코프 내에서 주입이 작동함
    val userService by inject<UserService>()

    routing {
        get("/users/{id}") {
            val logger = call.scope.get<RequestLogger>()
            val id = call.parameters["id"]!!

            logger.log("Fetching user $id")
            val user = userService.getUser(id)

            call.respond(user)
        }
    }
}
```

## DI 브리지 사용 시

격리된 컨텍스트는 Ktor DI 브리지(DI Bridge)도 지원합니다:

```kotlin
fun Application.main() {
    // Ktor DI - 인프라스트럭처
    val database = Database(environment.config)
    dependencies {
        provide<Database> { database }
    }

    // 브리지가 포함된 Koin Isolated
    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koin이 Ktor DI로부터 의존성을 해결할 수 있도록 허용
        }

        modules(appModule)
    }

    routing {
        userRoutes()
    }
}

val appModule = module {
    // 브리지를 통해 Ktor DI로부터 Database를 주입받을 수 있음
    singleOf(::UserRepository)
    singleOf(::UserService)
}
```

## 격리된 컨텍스트를 사용한 테스트

격리된 컨텍스트는 특히 테스트에 유용합니다:

```kotlin
class UserServiceTest {
    @Test
    fun `test user endpoint`() = testApplication {
        application {
            // 각 테스트는 자신만의 격리된 Koin 인스턴스를 가짐
            install(KoinIsolated) {
                modules(testModule)
            }
            configureRouting()
        }

        client.get("/users/123").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}

val testModule = module {
    single<UserRepository> { MockUserRepository() }
    singleOf(::UserService)
}
```

### 병렬 테스트 실행

격리된 컨텍스트를 사용하면 간섭 없이 테스트를 병렬로 실행할 수 있습니다:

```kotlin
class ParallelTests {
    @Test
    fun `test A`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleA)  // 자체 격리 인스턴스
            }
        }
        // ...
    }

    @Test
    fun `test B`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleB)  // 다른 격리 인스턴스
            }
        }
        // ...
    }
}
```

## 여러 Ktor 서버

독립적인 Koin 인스턴스를 가진 여러 Ktor 서버를 실행할 수 있습니다:

```kotlin
fun main() {
    // 서버 1 - 사용자 서비스
    val userServer = embeddedServer(Netty, port = 8080) {
        install(KoinIsolated) {
            modules(userServiceModule)
        }
        userRouting()
    }

    // 서버 2 - 주문 서비스 (다른 Koin 인스턴스)
    val orderServer = embeddedServer(Netty, port = 8081) {
        install(KoinIsolated) {
            modules(orderServiceModule)
        }
        orderRouting()
    }

    // 두 서버 모두 독립적인 Koin 컨테이너를 가짐
    userServer.start(wait = false)
    orderServer.start(wait = true)
}
```

## 생명주기(Lifecycle)

격리된 Koin 인스턴스는 Ktor 애플리케이션의 생명주기를 따릅니다:

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // Koin 생명주기 모니터링
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Isolated Koin started")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Isolated Koin stopped")
    }
}
```

## 격리된 Koin 인스턴스 접근하기

Ktor 애플리케이션 내에서 격리된 Koin 인스턴스에 접근할 수 있습니다:

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        modules(appModule)
    }

    // Application에서 Koin 인스턴스 접근
    val koin = getKoin()

    // 또는 플러그인 속성(attribute)을 통해 접근
    val koinApp = attributes[KoinPluginKey]
}
```

## 격리된 컨텍스트를 사용하지 않아야 하는 경우

- **단일 Ktor 애플리케이션** - 전역 컨텍스트가 더 간단합니다.
- **모듈 간에 공유되는 의존성** - 전역 컨텍스트를 사용해야 공유가 가능합니다.
- **Koin에 접근해야 하는 백그라운드 작업** - 이러한 작업에는 `GlobalContext`가 필요합니다.

## 권장 사항(Best Practices)

1. **테스트에 사용하세요** - 격리된 컨텍스트는 테스트 간의 간섭을 방지합니다.
2. **멀티 테넌트에 사용하세요** - 각 테넌트는 서로 다른 설정을 가질 수 있습니다.
3. **단순한 앱에서는 피하세요** - 대부분의 일반적인 사용 사례에서는 전역 컨텍스트가 더 간단합니다.
4. **선택 이유를 기록하세요** - 격리된 컨텍스트를 사용하는 이유를 팀원들이 알 수 있도록 명확히 문서화하세요.

## 참고 항목

- **[Ktor 통합](/docs/reference/koin-ktor/ktor)** - 메인 Ktor 문서
- **[컨텍스트 격리](/docs/reference/koin-core/context-isolation)** - 핵심 격리 개념
- **[테스트](/docs/reference/koin-test/testing)** - Koin을 사용한 테스트 방법