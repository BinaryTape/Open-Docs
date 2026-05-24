---
title: 문제 해결
---

# 문제 해결

이 가이드에서는 디버깅, 일반적인 오류, 그리고 피해야 할 안티 패턴에 대해 다룹니다.

## 순환 의존성(Circular Dependencies)

### 문제

```kotlin
// 순환 의존성
class ServiceA(val serviceB: ServiceB)
class ServiceB(val serviceA: ServiceA)

module {
    single { ServiceA(get()) }
    single { ServiceB(get()) }  // 오류: 순환 의존성 발생!
}
```

:::tip 컴파일러 플러그인을 통한 컴파일 타임 탐지
[Koin 컴파일러 플러그인](/docs/reference/koin-compiler/compile-safety)은 컴파일 과정(A2/A3 단계) 중에 순환 의존성을 탐지하므로, 런타임까지 기다릴 필요가 없습니다. 플러그인이 없으면 런타임 오류와 함께 시작 시점에 실패하게 됩니다.
:::

### 해결 방법 1: 지연 주입(Lazy Injection)

지연 해결(lazy resolution)을 통해 순환을 끊습니다:

```kotlin
class ServiceA : KoinComponent {
    val serviceB: ServiceB by inject()  // Lazy
}

class ServiceB : KoinComponent {
    val serviceA: ServiceA by inject()  // Lazy
}

module {
    single { ServiceA() }
    single { ServiceB() }
}
```

### 해결 방법 2: 공통 의존성 추출

순환을 제거하도록 리팩터링합니다(권장):

```kotlin
// 공통 로직 추출
@Singleton
class SharedService

@Singleton
class ServiceA(private val shared: SharedService)

@Singleton
class ServiceB(private val shared: SharedService)
```

### 해결 방법 3: 인터페이스 사용

```kotlin
interface ServiceBContract {
    fun doSomething()
}

@Singleton
class ServiceA(private val serviceB: ServiceBContract)

@Singleton
class ServiceB(private val serviceA: ServiceA) : ServiceBContract
```

## 디버깅

### 로깅 활성화

```kotlin
startKoin {
    // 로그 레벨 설정
    printLogger(Level.DEBUG)  // DEBUG, INFO, ERROR, NONE

    modules(appModule)
}
```

### `verify()`를 사용한 모듈 검증

모든 정의가 해결될 수 있는지 확인합니다:

```kotlin
// 테스트에서
@Test
fun `verify all modules`() {
    appModule.verify()  // 의존성이 누락된 경우 실패함
}
```

:::tip
Koin 컴파일러 플러그인은 이제 컴파일 타임 의존성 검증을 제공하여 `verify()`와 `checkModules()`를 대체합니다. 자세한 내용은 [컴파일 타임 안정성(Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)을 참조하세요.
:::

## 일반적인 오류

**정의 누락(Missing Definition):**
```
No definition found for class 'UserRepository'
```
해결 방법: 모듈에 누락된 정의를 추가합니다.

**순환 의존성(Circular Dependency):**
```
Circular dependency detected
```
해결 방법: 지연 주입을 사용하거나 리팩터링합니다(위 내용 참조).

**스코프를 찾을 수 없음(Scope Not Found):**
```
No scope definition found for 'MyScope'
```
해결 방법: 스코프가 지정된 의존성에 액세스하기 전에 스코프가 생성되었는지 확인합니다.

**중복 정의(Multiple Definitions):**
```
Multiple definitions found for type 'ApiClient'
```
해결 방법: 한정자(qualifier)를 사용하여 정의를 구분합니다.

## 일반적인 안티 패턴

### 1. 서비스 로케이터 오용

```kotlin
// 나쁜 예 - 서비스 로케이터 패턴
class UserViewModel : ViewModel(), KoinComponent {
    fun loadUser() {
        val repository = get<UserRepository>()  // 수동 해결
        // ...
    }
}

// 좋은 예 - 생성자 주입
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun loadUser() {
        // 의존성이 이미 주입됨
    }
}
```

### 2. 갓 모듈(God Modules)

```kotlin
// 나쁜 예 - 모든 것을 하나의 모듈에 포함
val appModule = module {
    // 100개 이상의 정의가 여기에 포함됨
}

// 좋은 예 - 조직화된 모듈
val databaseModule = module { /* ... */ }
val networkModule = module { /* ... */ }
val homeModule = module { /* ... */ }
```

### 3. 과도한 한정자 사용

```kotlin
// 나쁜 예 - 서로 다른 타입에 한정자 사용
module {
    single(named("user_repository")) { UserRepository() }
    single(named("order_repository")) { OrderRepository() }
}

// 좋은 예 - 타입 자체로 구분 가능
module {
    singleOf(::UserRepository)
    singleOf(::OrderRepository)
}
```

### 4. 관심사 혼용

```kotlin
// 나쁜 예 - 모듈 내의 부수 효과(side effects)
module {
    single {
        println("Loading database...")  // 부수 효과
        Database()
    }
}

// 좋은 예 - 순수한 의존성 생성
module {
    single { Database() }
}
```

### 5. 숨겨진 의존성

```kotlin
// 나쁜 예 - 내부에 숨겨진 의존성
class UserService {
    private val api = ApiClient()  // 숨겨진 의존성
}

// 좋은 예 - 명시적인 의존성
class UserService(private val api: ApiClient)
```

## 베스트 프랙티스 요약

1. **생성자 주입 선호** - 클래스 내부에서 `get()` 호출 지양
2. **Koin 컴파일러 플러그인 사용** - 컴파일 타임에 누락된 정의 탐지 (또는 테스트에서 `verify()` 사용)
3. **집중된 모듈 유지** - 모듈당 하나의 책임 부여
4. **순환 의존성 방지** - 리팩터링하거나 지연 주입 사용
5. **한정자 사용 절제** - 동일한 타입의 인스턴스가 여러 개인 경우에만 사용

## 다음 단계

- **[모듈(Modules)](/docs/reference/koin-core/modules)** - 모듈 조직화
- **[테스트(Testing)](/docs/reference/koin-test/testing)** - Koin으로 테스트하기
- **[스코프(Scopes)](/docs/reference/koin-core/scopes)** - 수명 주기 관리