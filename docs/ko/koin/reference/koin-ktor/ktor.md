---
title: Ktor를 위한 Koin
---

`koin-ktor` 모듈은 Ktor의 내장 DI 시스템과 함께 작동하며, Ktor 애플리케이션에 의존성 주입(dependency injection) 통합 기능을 제공합니다.

## 왜 Ktor에서 Koin을 사용해야 하나요?

Ktor 3.4 버전 이상에는 내장 DI 시스템이 포함되어 있습니다. Ktor DI와 Koin의 비교는 다음과 같습니다:

| 기능 | Ktor DI | Koin |
|---------|---------|------|
| 기본 주입 | 지원 | 지원 |
| 한정자(Qualifiers, `@Named`) | 지원 | 지원 |
| 속성 주입(Property injection) | 지원 (`@Property`) | 지원 |
| Null 허용/선택적 의존성 | 지원 | 지원 |
| 스코프 (요청, 커스텀) | 미지원 | 지원 |
| 모듈 구성 | 미지원 | 지원 |
| 지연 모듈(Lazy modules) | 미지원 | 지원 |
| 어노테이션 기반 컴포넌트 | 미지원 | 지원 |
| 컴파일러 플러그인 검증 | 미지원 | 지원 |

### Ktor DI의 한계

- **스코프 지정 불가** - 요청(request) 또는 커스텀 스코프를 지원하지 않으며, 정리 순서(cleanup ordering)가 있는 싱글톤 방식의 동작만 가능합니다.
- **어노테이션 기반 컴포넌트 없음** - Koin Annotations와 같은 `@Singleton`, `@Factory` 컴포넌트 스캐닝을 지원하지 않습니다.
- **컴파일 타임 검증 없음** - 런타임 전에 DI 구성을 확인하는 컴파일러 플러그인이 없습니다.
- **제한적인 매개변수화된 타입(parameterized types)** - 타입 인자 하위 타입(type argument subtypes) 간의 매개변수화된 타입을 해결할 수 없습니다.

**Koin을 사용해야 할 때:**
- 스코프가 지정된 의존성(요청 스코프, 커스텀 스코프)이 필요한 경우
- 모듈 기반의 구성이 필요한 경우
- 어노테이션 기반의 컴포넌트 스캐닝을 원하는 경우
- 컴파일러 플러그인을 통한 컴파일 타임 검증이 필요한 경우

**Ktor DI로 충분할 때:**
- 의존성이 적은 단순한 애플리케이션인 경우
- 스코프 지정 요구 사항이 없는 경우
- 기본적인 한정자(qualifier) 기능만 필요한 경우

## 설정

Koin Ktor 의존성을 추가합니다:

```kotlin
dependencies {
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version") // 선택 사항
}
```

## 의존성 선언하기

Koin은 여러 가지 DSL 방식을 지원합니다.

### 컴파일러 플러그인 DSL

가장 단순한 구문입니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

### 어노테이션

컴파일 타임 검증을 지원하며 Spring과 유사한 방식입니다:

```kotlin
@Module
@ComponentScan("com.example")
class AppModule

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserService(private val repository: UserRepository)
```

### 클래식 DSL

생성자 참조를 사용하는 방식입니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)
}
```

## Koin 플러그인 설치

`Application` 모듈에 Koin을 설치합니다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

### 전체 구성 예시

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        fileProperties("/application.conf")
        modules(
            networkModule,
            repositoryModule,
            serviceModule
        )
        createEagerInstances()
    }
}
```

## 의존성 주입

Koin은 Ktor의 핵심 타입들을 위한 확장 함수를 제공합니다.

### 주입 가능 지점

`inject()` 및 `get()`은 다음에서 사용할 수 있습니다:
- `Application`
- `Route`
- `Routing`
- `ApplicationCall` (라우트 핸들러 내)

### 애플리케이션 레벨

```kotlin
fun Application.main() {
    val helloService by inject<HelloService>()  // 지연 주입(Lazy)
    val configService = get<ConfigService>()     // 즉시 주입(Eager)

    routing {
        get("/hello") {
            call.respondText(helloService.sayHello())
        }
    }
}
```

### 라우트 레벨

```kotlin
fun Route.customerRoutes() {
    val customerService by inject<CustomerService>()

    get("/customers") {
        call.respond(customerService.getAllCustomers())
    }

    get("/customers/{id}") {
        val id = call.parameters["id"]?.toInt()
            ?: return@get call.respond(HttpStatusCode.BadRequest)
        call.respond(customerService.getCustomer(id))
    }
}
```

### 요청 핸들러

```kotlin
routing {
    get("/users/{id}") {
        val userService = get<UserService>()
        val userId = call.parameters["id"]!!
        call.respond(userService.getUser(userId))
    }
}
```

## Ktor 이벤트

Koin 라이프사이클 이벤트를 모니터링할 수 있습니다:

| 이벤트 | 설명 |
|-------|-------------|
| `KoinApplicationStarted` | Koin 컨테이너 시작됨 |
| `KoinApplicationStopPreparing` | Koin 중지 준비 중 |
| `KoinApplicationStopped` | Koin 컨테이너 중지됨 |

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started")
        get<CacheWarmer>().warmUp()
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped")
    }
}
```

## 빠른 참조

| 함수 | 설명 |
|----------|-------------|
| `install(Koin) { }` | Koin 플러그인 설치 |
| `inject<T>()` | 지연 주입(Lazy injection) |
| `get<T>()` | 즉시 주입(Eager injection) |
| `koinModule { }` | 인라인 모듈 선언 |
| `koinModules(...)` | 기존 모듈 로드 |

## 문서

| 주제 | 설명 |
|-------|-------------|
| **[DI 브릿지](/docs/reference/koin-ktor/ktor-bridge)** | Koin ↔ Ktor DI 통합 |
| **[요청 스코프](/docs/reference/koin-ktor/ktor-scopes)** | 요청 스코프(Request-scoped) 의존성 |
| **[테스트](/docs/reference/koin-ktor/ktor-testing)** | Koin을 사용한 Ktor 테스트 |
| **[격리된 컨텍스트](/docs/reference/koin-ktor/ktor-isolated)** | 격리된 Koin 인스턴스 |

## 관련 항목

- **[튜토리얼: Ktor](/docs/quickstart/ktor)** - 단계별 튜토리얼
- **[튜토리얼: 어노테이션을 사용한 Ktor](/docs/quickstart/ktor-annotations)** - 어노테이션 튜토리얼
- **[Koin 어노테이션](/docs/reference/koin-annotations/start)** - 어노테이션 레퍼런스
- **[Ktor 문서](https://ktor.io/)** - 공식 Ktor 문서