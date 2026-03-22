---
title: 요청 스코프 (Request Scopes)
---

# Ktor의 요청 스코프 (Request Scopes in Ktor)

요청 스코프(Request scopes)는 단일 HTTP 요청 기간 동안 유지되는 인스턴스를 생성하며, 요청별 데이터 및 처리에 적합합니다.

## 요청 스코프 컴포넌트 선언하기 (Declaring Request-Scoped Components)

요청 생명 주기(request lifecycle)에 바인딩된 컴포넌트를 선언하려면 `requestScope`를 사용하세요:

```kotlin
val appModule = module {
    // 싱글톤 - 모든 요청에서 공유됨
    single { UserRepository() }

    // 요청 스코프 - 요청당 새로운 인스턴스 생성
    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)
        scopedOf(::UserSessionHandler)
    }
}
```

## 요청 스코프 컴포넌트 접근하기 (Accessing Request-Scoped Components)

요청 스코프 의존성을 해결(resolve)하려면 `call.scope.get()`을 사용하세요:

```kotlin
routing {
    get("/users/{id}") {
        val requestLogger = call.scope.get<RequestLogger>()
        val metrics = call.scope.get<RequestMetrics>()

        metrics.start()
        requestLogger.log("Processing user request")

        val userId = call.parameters["id"]!!
        val userService = get<UserService>()
        val user = userService.getUser(userId)

        requestLogger.log("Request completed")
        metrics.end()

        call.respond(user)
    }
}
```

## ApplicationCall 주입하기 (Injecting ApplicationCall)

요청 스코프 컴포넌트는 `ApplicationCall`을 자동으로 주입받을 수 있습니다:

```kotlin
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        val requestPath = call.request.path()
        val method = call.request.httpMethod.value
        println("[$method $requestPath] $message")
    }
}

class UserSessionHandler(private val call: ApplicationCall) {
    fun getUserId(): String? {
        return call.request.headers["X-User-ID"]
    }

    fun isAuthenticated(): Boolean {
        return call.request.headers["Authorization"] != null
    }
}
```

## 스코프 생명 주기 콜백 (Scope Lifecycle Callbacks)

```kotlin
requestScope {
    scoped { RequestContext(get()) }

    // onCreate 콜백
    onCreate { requestContext ->
        requestContext.startTime = System.currentTimeMillis()
    }

    // onClose 콜백
    onClose { requestContext ->
        val duration = System.currentTimeMillis() - requestContext.startTime
        println("Request completed in ${duration}ms")
    }
}
```

:::note
요청 스코프는 **각 HTTP 요청마다 생성되고 소멸됩니다**. 인스턴스는 요청 간에 공유되지 않으므로 스레드 안전성(thread safety)을 보장하고 상태 누수(state leakage)를 방지합니다.
:::

## Ktor에서 모듈 선언하기 (Declaring Modules in Ktor)

Koin은 Ktor 애플리케이션 내에서 직접 모듈을 선언할 수 있는 편리한 함수를 제공합니다.

### koinModule 사용하기

모듈을 인라인으로 선언합니다:

```kotlin
fun Application.configureRouting() {
    koinModule {
        singleOf(::CustomerRepository)
        singleOf(::CustomerService)
    }

    routing {
        customerRoutes()
    }
}
```

### koinModules 사용하기

기존의 여러 모듈을 로드합니다:

```kotlin
fun Application.configureCustomerFeature() {
    koinModules(
        customerRepositoryModule,
        customerServiceModule,
        customerRoutesModule
    )

    routing {
        customerRoutes()
    }
}
```

## 모듈화된 애플리케이션 구조 (Modular Application Structure)

기능별로 Ktor 앱을 구성하세요:

```kotlin
// 기능 1: 고객 관리 (Customer Management)
fun Application.customerModule() {
    koinModule {
        singleOf(::CustomerRepository)
        singleOf(::CustomerService)
    }

    routing {
        route("/api/customers") {
            customerRoutes()
        }
    }
}

// 기능 2: 주문 관리 (Order Management)
fun Application.orderModule() {
    koinModule {
        singleOf(::OrderRepository)
        singleOf(::OrderService)
    }

    routing {
        route("/api/orders") {
            orderRoutes()
        }
    }
}

// 메인 애플리케이션
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(coreModule)
    }

    customerModule()
    orderModule()
}
```

## 어노테이션을 사용한 요청 스코프 (Request Scope with Annotations)

요청 스코프 컴포넌트에 어노테이션을 사용하세요:

```kotlin
@Scope(RequestScope::class)
class RequestLogger(private val call: ApplicationCall) {
    fun log(message: String) {
        println("[${call.request.path()}] $message")
    }
}
```

## 전체 예제 (Complete Example)

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
        scopedOf(::RequestMetrics)

        onCreate { metrics: RequestMetrics ->
            metrics.start()
        }

        onClose { metrics: RequestMetrics ->
            metrics.recordDuration()
        }
    }
}

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    routing {
        get("/api/users/{id}") {
            val logger = call.scope.get<RequestLogger>()
            val userService = get<UserService>()

            logger.log("Fetching user")
            val user = userService.getUser(call.parameters["id"]!!)

            call.respond(user)
        }
    }
}
```

## API 레퍼런스 (API Reference)

| 함수 | 설명 |
|----------|-------------|
| `requestScope { }` | 요청 스코프 컴포넌트 선언 |
| `call.scope.get<T>()` | 요청 스코프 인스턴스 가져오기 |
| `onCreate { }` | 스코프가 생성될 때의 콜백 |
| `onClose { }` | 스코프가 닫힐 때의 콜백 |
| `koinModule { }` | 인라인 모듈 선언 |
| `koinModules(...)` | 기존 모듈 로드 |

## 함께 보기 (See Also)

- **[Ktor용 Koin (Koin for Ktor)](/docs/reference/koin-ktor/ktor)** - 메인 Ktor 문서
- **[스코프 (Scopes)](/docs/reference/koin-core/scopes)** - 핵심 스코프 개념