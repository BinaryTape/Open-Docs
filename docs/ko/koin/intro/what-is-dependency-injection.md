---
title: 의존성 주입(Dependency Injection)이란 무엇인가요?
---

# 의존성 주입(Dependency Injection)이란 무엇인가요?

의존성 주입(Dependency Injection, DI)은 객체가 내부에서 의존성을 직접 생성하는 대신 외부에서 전달받는 디자인 패턴입니다. 이는 느슨한 결합(loose coupling)을 촉진하고, 테스트 가능성을 높이며, 더 깔끔한 코드 아키텍처를 가능하게 합니다.

## 의존성이란 무엇인가요?

의존성(dependency)이란 한 객체가 작동하기 위해 필요한 다른 객체를 의미합니다. 예를 들어, `Car`가 주행하기 위해서는 `Engine`이 필요합니다.

### 의존성 주입을 사용하지 않는 경우

```kotlin
class Engine {
    fun start() {
        println("Engine starting...")
    }
}

class Car {
    private val engine = Engine()  // Car가 직접 엔진을 생성함

    fun drive() {
        engine.start()
        println("Car is driving")
    }
}
```

**이 방식의 문제점:**
- `Car`가 특정 `Engine` 구현체와 강하게 결합(tightly coupled)됩니다.
- `Car`를 독립적으로 테스트하기 어렵습니다.
- 엔진 유형(전기, 디젤 등)을 교체하기 어렵습니다.
- `Car`가 `Engine`의 생명주기(lifecycle)를 직접 제어해야 합니다.

### 의존성 주입을 사용하는 경우

```kotlin
class Car(private val engine: Engine) {  // Engine을 주입받음
    fun drive() {
        engine.start()
        println("Car is driving")
    }
}

// 이제 다른 종류의 엔진을 쉽게 제공할 수 있습니다.
val gasolineCar = Car(GasEngine())
val electricCar = Car(ElectricEngine())
```

**장점:**
- `Car`는 `Engine`이 어떻게 생성되는지 알 필요가 없습니다.
- 모의 엔진(mock engines)을 사용하여 테스트하기 쉽습니다.
- 유연함 - 구현체를 쉽게 교체할 수 있습니다.
- 생성자에서 의존성이 명확하게 드러납니다.

## 의존성을 제공하는 세 가지 방법

### 1. 생성자 주입 (권장 방식)

생성자를 통해 의존성을 전달합니다:

```kotlin
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
) {
    fun getUser(id: String): User {
        return database.query(id) ?: apiClient.fetchUser(id)
    }
}
```

**장점:**
- 의존성이 명시적이며 필수적으로 요구됩니다.
- 불변성(Immutable)을 유지할 수 있습니다 (`val` 사용).
- 테스트하기 쉽습니다.
- 의존성 그래프가 명확합니다.

**Koin 사용 시:**

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()  // Koin이 의존성을 자동으로 연결합니다.
}
```

:::info
생성자 주입은 Koin에서 **선호되는 방식**입니다. 단위 테스트에서 Koin 없이도 코드를 테스트할 수 있게 해줍니다.
:::

### 2. 필드 주입 (Field Injection)

클래스의 프로퍼티에 의존성을 주입합니다:

```kotlin
class UserActivity : AppCompatActivity() {
    // 지연 주입(Lazy injection) - 처음 접근할 때 인스턴스가 생성됨
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.loadUser()  // 여기서 ViewModel 인스턴스가 생성됨
    }
}
```

**사용 시점:**
- 객체 생성을 직접 제어할 수 없는 안드로이드 프레임워크 클래스 (Activity, Fragment, Service 등)
- 생성자 주입이 불가능한 경우

**Koin 사용 시:**

```kotlin
// 지연 주입 (Lazy injection)
val presenter: Presenter by inject()

// 즉시 주입 (Eager injection)
val presenter: Presenter = get()
```

### 3. 메서드 주입 (Method Injection)

메서드를 통해 의존성을 전달합니다 (자주 사용되지 않음):

```kotlin
class ReportGenerator {
    fun generateReport(data: DataSource) {
        // data를 사용하여 보고서 생성
    }
}
```

**사용 시점:**
- 선택적 의존성이 필요한 경우
- 객체의 수명 동안 의존성이 변하는 경우
- 콜백 패턴

## 수동 의존성 주입 vs 자동 의존성 주입

### 수동 DI의 문제점

애플리케이션이 커짐에 따라 의존성을 수동으로 관리하는 일은 매우 복잡해집니다:

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 전체 의존성 그래프를 수동으로 생성
        val database = Database()
        val apiClient = ApiClient()
        val userRepository = UserRepository(database, apiClient)
        val authRepository = AuthRepository(database, apiClient)
        val userService = UserService(userRepository, authRepository)
        val viewModel = UserViewModel(userService)

        // 이제서야 viewModel을 사용할 수 있음...
    }
}
```

**문제점:**
- 여러 Activity/Fragment에서 반복되는 코드
- 의존성 순서를 실수하기 쉬움
- 앱이 커질수록 유지보수가 어려움
- 생명주기(싱글톤, 스코프 객체 등) 관리의 어려움
- 중앙화된 설정의 부재

### 컨테이너 패턴 (수동 방식)

개발자들은 종종 객체 생성을 중앙화하기 위해 컨테이너를 만듭니다:

```kotlin
object AppContainer {
    private val database by lazy { Database() }
    private val apiClient by lazy { ApiClient() }

    val userRepository by lazy { UserRepository(database, apiClient) }
    val authRepository by lazy { AuthRepository(database, apiClient) }

    fun createUserViewModel() = UserViewModel(
        UserService(userRepository, authRepository)
    )
}

// 사용 예시
class MainActivity : AppCompatActivity() {
    private val viewModel = AppContainer.createUserViewModel()
}
```

**여전히 존재하는 문제:**
- 의존성을 수동으로 연결해야 함
- 자동 생명주기 관리가 없음
- 전역 상태 (싱글톤 컨테이너)
- 복잡한 그래프의 경우 여전히 반복 작업 발생

### Koin이 해결하는 방법

Koin은 **DSL 또는 어노테이션(Annotations)** 중 선택하여 의존성을 자동으로 해결해줍니다:

```kotlin
// 의존성을 한 번만 정의함
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    single<AuthRepository>()
    single<UserService>()
    viewModel<UserViewModel>()
}

// Koin을 한 번만 시작함
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(appModule)
        }
    }
}

// 어디서든 사용 가능 - Koin이 전체 의존성 그래프를 처리함
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
    // 끝! Koin이 UserViewModel과 그에 필요한 모든 의존성을 생성합니다.
}
```

**Koin의 장점:**
- 선언적인 의존성 설정
- 자동 의존성 해결
- 생명주기 관리 (싱글톤, 팩토리, 스코프)
- 타입 안전한 주입
- 쉬운 테스트 및 모듈 교체

## 자동 DI 솔루션

자동 의존성 주입에는 여러 가지 접근 방식이 있습니다:

| 방식 | 예시 | 작동 원리 |
|----------|----------|--------------|
| **리플렉션 기반 (Reflection-based)** | (이전 프레임워크들) | 런타임에 리플렉션 사용 |
| **코드 생성 (Code generation)** | Dagger, Hilt | 컴파일 타임에 코드 생성 (어노테이션 프로세싱) |
| **컴파일러 플러그인 (Compiler plugins)** | Koin Compiler Plugin | DSL 및 어노테이션을 위한 네이티브 컴파일러 통합 |
| **DSL 기반 (DSL-based)** | Koin (기본형) | 런타임 DSL 설정 |

**Koin의 방식 - DSL & 어노테이션, 둘 다 강력합니다:**
- **DSL 스타일:** 깔끔한 Kotlin DSL 설정 (`single<MyService>()`, `viewModel<MyVM>()`)
- **어노테이션 스타일:** 익숙한 어노테이션 (`@Singleton`, `@KoinViewModel`)
- 두 방식 모두 컴파일 타임 안전성을 위해 동일한 컴파일러 플러그인을 사용함
- 리플렉션 없음, 가벼움
- 팀에 적합한 스타일을 선택 가능

## 서비스 로케이터 vs 의존성 주입

이 둘의 차이를 이해하는 것이 중요합니다:

### 서비스 로케이터(Service Locator) 패턴

컴포넌트가 레지스트리에서 직접 의존성을 요청합니다:

```kotlin
class UserService : KoinComponent {
    private val repository: UserRepository by inject()  // 의존성을 "당겨옴(Pulling)"
}
```

### 의존성 주입(Dependency Injection) 패턴

의존성이 외부에서 제공됩니다:

```kotlin
class UserService(
    private val repository: UserRepository  // 컴포넌트로 "밀어넣어짐(Pushed)"
)
```

### 비교

| 측면 | 서비스 로케이터 | 의존성 주입 |
|--------|----------------|---------------------|
| 의존성 가시성 | 클래스 내부에 숨겨짐 | 생성자에 명시됨 |
| 테스트 | 프레임워크가 필요함 | 쉬움 - 테스트 더블 전달 가능 |
| 결합도 | 컨테이너에 의존함 | 인터페이스에 의존함 |
| Koin에서의 사용 | `get()`, `by inject()` | Koin 모듈이 있는 생성자 |
| 적합한 용도 | 안드로이드 프레임워크 클래스 | 비즈니스 로직, 서비스 |

### Koin 사용 시 권장 사항 (Best Practices)

1. 비즈니스 로직에는 **생성자 주입을 선호**하세요:

```kotlin
// 좋음 - Koin 없이도 테스트 가능
class UserViewModel(private val userService: UserService) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()  // Koin이 의존성을 해결함
}
```

2. **서비스 로케이터**는 필요한 경우에만 사용하세요:

```kotlin
// 허용됨 - Activity 생성은 안드로이드가 제어하므로
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

3. **비즈니스 로직에서 `KoinComponent`를 피하세요:**

```kotlin
// 나쁨 - 테스트하기 어려움
class UserService : KoinComponent {
    private val repository: UserRepository = get()
}

// 좋음 - 명시적인 의존성
class UserService(private val repository: UserRepository)
```

## 의존성 주입의 이점

### 1. 테스트 가능성 (Testability)

DI가 없으면 테스트가 어렵습니다:

```kotlin
class UserService {
    private val repository = UserRepository()  // 모의 객체(Mock)를 넣을 수 없음!
}
```

DI를 사용하면 테스트가 직관적입니다:

```kotlin
class UserService(private val repository: UserRepository)

@Test
fun testGetUser() {
    val mockRepository = mockk<UserRepository>()
    val service = UserService(mockRepository)  // 완전한 제어 가능

    every { mockRepository.findUser("123") } returns testUser
    assertEquals(testUser, service.getUser("123"))
}
```

### 2. 유연성 (Flexibility)

구현체를 쉽게 교체할 수 있습니다:

```kotlin
val appModule = module {
    single<EmailService> { GmailService() }  // 운영 환경
}

val testModule = module {
    single<EmailService> { MockEmailService() }  // 테스트 환경
}
```

### 3. 코드 조직화 (Code Organization)

중앙화된 의존성 설정:

```kotlin
val dataModule = module {
    single<Database>()
    single<ApiClient>()
}

val domainModule = module {
    single<UserRepository>()
    single<AuthRepository>()
}

val presentationModule = module {
    viewModel<UserViewModel>()
}

startKoin {
    modules(dataModule, domainModule, presentationModule)
}
```

### 4. 생명주기 관리 (Lifecycle Management)

Koin이 객체의 생명주기를 관리합니다:

```kotlin
val appModule = module {
    single<Database>()       // 앱 전체에서 하나의 인스턴스
    factory<Presenter>()     // 매번 새로운 인스턴스
    scoped<SessionData>()    // 스코프당 하나의 인스턴스
}
```

## 요약

의존성 주입은 다음과 같은 강력한 패턴입니다:
- 컴포넌트와 그 의존성 사이의 **결합을 해제**합니다.
- 의존성 교체를 허용하여 **테스트 가능성을 향상**시킵니다.
- 중앙화된 설정을 통해 **유지보수를 단순화**합니다.
- 수동 의존성 관리보다 **확장성이 뛰어납니다**.

Koin은 다음과 같은 방법으로 Kotlin에서의 DI를 단순화합니다:
- **두 가지 강력한 스타일** 제공: DSL 또는 어노테이션 중 선택 가능
- **생성자 주입**(권장)과 **필드 주입**(필요시) 모두 지원
- 컴파일러 플러그인을 통한 **컴파일 타임 안전성** 제공
- **리플렉션 제로** - 순수 Kotlin 방식

## 다음 단계

- **[Koin이란 무엇인가요?](/docs/intro/what-is-koin)** - Koin의 접근 방식에 대해 알아보기
- **[Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin)** - 권장되는 더 안전한 접근 방식
- **[설정 가이드](/docs/setup/gradle)** - 프로젝트에 Koin 추가하기