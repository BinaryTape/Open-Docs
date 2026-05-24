---
title: Koin 컴파일러 플러그인
---

# Koin 컴파일러 플러그인 (Koin Compiler Plugin)

**Koin 컴파일러 플러그인**은 모든 새로운 Kotlin 2.x 프로젝트에 권장되는 방식입니다. 이는 자동 연결(auto-wiring), 컴파일 타임 안전성, 그리고 더 깔끔한 구문을 통해 **DSL과 어노테이션(Annotations)** 모두를 지원하는 네이티브 Kotlin 컴파일러 플러그인입니다.

## 컴파일러 플러그인이란?

Koin 컴파일러 플러그인은 KSP나 어노테이션 프로세싱이 아닌 **네이티브 Kotlin 컴파일러 플러그인(K2)**입니다. Kotlin 컴파일러와 직접 통합되어 다음과 같은 기능을 수행합니다:

- **생성자 파라미터 자동 감지** - 수동으로 `get()`을 호출할 필요가 없습니다.
- **컴파일 타임에 코드 변환** - 빌드 중에 에러를 포착합니다.
- **DSL 및 어노테이션 모두 지원** - 원하는 스타일을 선택할 수 있습니다.
- **가시적인 파일 생성 없음** - 프로젝트 구조가 더 깔끔해집니다.

## 왜 컴파일러 플러그인을 사용해야 하나요?

### 1. 더 안전한 코드

플러그인이 생성자 의존성을 자동으로 감지하여 수동 연결 시 발생할 수 있는 실수를 줄여줍니다:

```kotlin
// 컴파일러 플러그인이 없는 경우 - 실수하기 쉽습니다.
val appModule = module {
    single { UserService(get(), get(), get()) }  // 순서를 올바르게 맞췄기를 바랍니다!
}

// 컴파일러 플러그인을 사용하는 경우 - 자동 연결(auto-wired)
val appModule = module {
    single<UserService>()  // 플러그인이 모든 생성자 파라미터를 감지합니다.
}
```

### 2. 더 깔끔한 구문

보일러플레이트가 줄어들고 가독성이 높아집니다:

| Classic DSL | Compiler Plugin DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyPresenter)` | `scoped<MyPresenter>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |

### 3. 컴파일 타임 안전성

Koin 컴파일러 플러그인은 DSL과 어노테이션 모두에 대해 **컴파일 타임 의존성 검증**을 제공합니다:

- **A2 — 모듈별(Per-Module):** 가시적인 스코프에 대해 정의를 검증합니다 (조기 피드백).
- **A3 — 전체 그래프(Full Graph):** `startKoin<T>()`에서 조립된 전체 그래프를 검증합니다.
- **A4 — 호출부(Call-Site):** 모든 `get<T>()`, `inject<T>()`, `koinViewModel<T>()` 호출을 검증합니다.

컴파일이 완료된다면, 모든 의존성과 모든 주입 호출부가 충족되었음을 의미합니다. 이는 `verify()`와 `checkModules()`를 대체하며, 별도의 런타임 테스트 하네스가 필요하지 않습니다.

자세한 내용은 [컴파일 타임 안전성](/docs/reference/koin-compiler/compile-safety)을 참조하세요.

### 4. DSL 및 어노테이션 - 둘 다 동일하게 강력함

어떤 스타일을 선호하든 상관없습니다. 동일한 플러그인이 두 방식 모두에 동일한 기능을 제공합니다:

**DSL 스타일:**
```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info DSL + 파라미터 어노테이션
DSL 스타일을 사용할 때도, 플러그인에 가이드를 제공하기 위해 클래스에 **파라미터 어노테이션**을 계속 사용할 수 있습니다:

```kotlin
class UserPresenter(
    @InjectedParam val userId: String,      // 런타임 파라미터
    @Named("api") val client: ApiClient,    // 식별자(Qualifier)가 지정된 의존성
    val repository: UserRepository          // 자동 해결됨
)

val appModule = module {
    factory<UserPresenter>()  // 플러그인이 클래스의 어노테이션을 읽습니다.
}
```

DSL은 의존성이 **어디에** 등록되는지 정의합니다. 파라미터 어노테이션은 의존성이 **어떻게** 해결되는지 정의합니다.
:::

**어노테이션 스타일:**
```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val database: Database)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 시작하기

### 설정

프로젝트에 컴파일러 플러그인을 추가합니다.

:::info
상세한 지침은 **[컴파일러 플러그인 설정 가이드](/docs/setup/compiler-plugin)**를 참조하세요.
:::

### 컴파일러 플러그인 DSL 사용하기

컴파일러 플러그인 패키지에서 임포트합니다:

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::note
컴파일러 플러그인 DSL은 `org.koin.plugin.module.dsl`에 위치합니다. Classic DSL은 `org.koin.dsl`에 그대로 유지됩니다.
:::

### 어노테이션 사용하기

어노테이션은 이전과 동일하게 작동합니다:

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

## 동작 원리

컴파일러 플러그인은 두 단계로 작동합니다:

### 1. FIR 단계 (분석)

Frontend Intermediate Representation 단계에서 플러그인은 다음을 수행합니다:
- 모듈 정의 분석
- 생성자 파라미터 감지
- 의존성 선언 검증

### 2. IR 단계 (변환)

Intermediate Representation 단계에서 플러그인은 다음을 수행합니다:
- 각 파라미터에 대한 적절한 `get()` 호출 생성
- 식별자(Qualifiers, `@Named`) 처리
- 주입된 파라미터(`@InjectedParam`) 처리
- Nullable 및 Lazy 타입 처리

### 생성되는 코드

다음과 같이 작성하면:

```kotlin
single<UserRepository>()
```

플러그인은 이를 다음과 같이 변환합니다:

```kotlin
single { UserRepository(get(), get()) }  // 파라미터가 자동으로 감지됨
```

더 복잡한 경우:

```kotlin
// 소스 코드
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?,
    @Named("special") val named: NamedDep,
    val lazy: Lazy<LazyDep>,
    @InjectedParam val param: String
)
```

플러그인은 각 파라미터 타입에 대해 적절한 처리를 생성합니다:
- 필수(Required): `get()`
- 옵션(Optional): `getOrNull()`
- 이름 지정(Named): `get(named("special"))`
- 지연 로딩(Lazy): `inject()`
- 주입 파라미터(InjectedParam): `params.get()`

## 컴파일러 플러그인 DSL 레퍼런스

### 정의 유형

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // 싱글톤 - 하나의 인스턴스
    single<MyService>()

    // 팩토리 - 호출할 때마다 새로운 인스턴스
    factory<MyPresenter>()

    // 스코프 - 스코프당 하나의 인스턴스
    scope<MyActivity> {
        scoped<ActivityPresenter>()
    }

    // 뷰모델 (ViewModel)
    viewModel<MyViewModel>()

    // 워커 (Android WorkManager Worker)
    worker<MyWorker>()
}
```

### `create()`를 이용한 안전한 인스턴스 생성

정의 람다 내부에서 `create(::T)`를 사용하여 생성자 의존성이 자동으로 해결되는 인스턴스를 안전하게 빌드할 수 있습니다:

```kotlin
val appModule = module {
    single { create(::MyService) }
}
```

컴파일러 플러그인은 `create(::MyService)`를 `MyService(get(), get(), ...)`으로 변환하여 모든 생성자 파라미터를 자동으로 연결합니다.

### 식별자(Qualifiers) 사용

클래스에 `@Named`를 사용하여 식별자를 정의하고, 파라미터에 사용하여 어떤 의존성을 주입할지 지정할 수 있습니다:

```kotlin
// @Named 식별자를 사용하여 구현체 정의
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

// 파라미터에 @Named를 사용하여 주입할 대상 지정
class SyncService(
    @Named("local") val localDb: Database,
    @Named("remote") val remoteDb: Database
)

// DSL - 플러그인이 클래스와 파라미터에서 @Named를 읽음
val appModule = module {
    single<LocalDatabase>()
    single<RemoteDatabase>()
    single<SyncService>()
}
```

`@Qualifier`를 사용하여 커스텀 식별자를 만들 수도 있습니다:

```kotlin
@Qualifier
annotation class LocalDb

@Qualifier
annotation class RemoteDb

@LocalDb
class LocalDatabase : Database

@RemoteDb
class RemoteDatabase : Database

class SyncService(
    @LocalDb val localDb: Database,
    @RemoteDb val remoteDb: Database
)
```

### 파라미터 사용

주입 시점에 전달되는 파라미터를 표시하려면 클래스에 `@InjectedParam`을 사용하세요:

```kotlin
// 클래스에 어노테이션 사용 - 플러그인에게 이 파라미터를 처리하는 방법을 알려줌
class UserPresenter(
    @InjectedParam val userId: String,    // parametersOf()를 통해 전달됨
    val repository: UserRepository        // Koin에 의해 자동 해결됨
)

// 모듈의 DSL - Koin에게 어디에 등록할지 알려줌
val appModule = module {
    factory<UserPresenter>()
}

// 사용 - 런타임 파라미터 전달
val presenter: UserPresenter = get { parametersOf("user123") }
```

### 인터페이스 바인딩

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class

    // 또는 여러 바인딩
    single<MyServiceImpl>() binds arrayOf(
        ServiceA::class,
        ServiceB::class
    )
}
```

## 어노테이션 레퍼런스

### 정의 어노테이션

| 어노테이션 | 설명 |
|------------|-------------|
| `@Singleton` / `@Single` | 싱글톤 인스턴스 |
| `@Factory` | 매번 새로운 인스턴스 |
| `@Scoped` | 스코프당 인스턴스 |
| `@KoinViewModel` | Android ViewModel |
| `@KoinWorker` | Android WorkManager Worker |

### 파라미터 어노테이션

| 어노테이션 | 설명 |
|------------|-------------|
| `@Named("qualifier")` | 이름이 지정된 식별자 |
| `@InjectedParam` | 런타임 파라미터 (`parametersOf()`를 통해 전달) |
| `@Property("key")` | Koin 프로퍼티 값 |
| `@Provided` | 외부 의존성 (검증 건너뛰기) |

### 모듈 어노테이션

| 어노테이션 | 설명 |
|------------|-------------|
| `@Module` | Koin 모듈 선언 |
| `@ComponentScan("package")` | 어노테이션이 달린 클래스를 찾기 위해 패키지 스캔 |
| `@Configuration` | 자동 감지되는 모듈 |

## 접근 방식 비교

| 접근 방식 | 상태 | 패키지 | 구문 |
|----------|--------|---------|--------|
| **컴파일러 플러그인 DSL** | 권장됨 | Koin의 **`org.koin.plugin.module.dsl`**에 위치 | `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()` |
| **컴파일러 플러그인 어노테이션** | 권장됨 | **`koin-annotations`**에서 사용 가능 | `@Singleton`, `@Factory`, `@KoinViewModel ` |
| **Classic DSL** | 완전히 지원됨 | `org.koin.dsl` | `singleOf(::MyService)`, `single { MyService(get()) }`, `viewModelOf(::MyVM)` |
| **KSP 프로세서** | 지원 중단(Deprecated) | `koin-ksp-compiler` | Koin 어노테이션을 위한 레거시 프로세서 — 동일한 어노테이션을 사용하며, **컴파일러 플러그인으로 마이그레이션하세요 ⚠️** |

### 컴파일러 플러그인 DSL (권장됨)

- 의존성 자동 감지
- 컴파일 타임 분석
- 가장 깔끔한 구문

### 컴파일러 플러그인 어노테이션 (권장됨)

- 의존성 자동 감지
- 컴파일 타임 분석
- 익숙한 어노테이션 스타일

### Classic DSL (완전히 지원됨)

- 모든 Kotlin 버전에서 작동
- 연결 방식에 대한 완전한 제어
- 준비가 되었을 때 플러그인 DSL로 마이그레이션 가능

### KSP 프로세서 `koin-ksp-compiler` (지원 중단)

- `koin-annotations` 라이브러리는 **지원 중단되지 않았습니다** — 이제 Koin 프로젝트의 일부입니다.
- 레거시 KSP 기반 프로세서(`koin-ksp-compiler`)만 지원 중단되었습니다.
- Koin 컴파일러 플러그인으로 마이그레이션하세요 — 어노테이션은 동일하게 유지됩니다.
- `koin-ksp-compiler`는 향후 Koin 버전에서 제거될 예정입니다.

## 마이그레이션

### Classic DSL로부터 마이그레이션

Classic DSL을 사용 중이라면 마이그레이션은 선택 사항이지만 권장됩니다:

1. Gradle에 컴파일러 플러그인 추가
2. 임포트를 `org.koin.plugin.module.dsl.*`로 업데이트
3. `singleOf(::Class)`를 `single<Class>()`로 교체
4. 수동 `get()` 호출 제거

컴파일 타임에 안전한 구문에 대해서는 [컴파일러 플러그인 DSL 레퍼런스](/docs/setup/compiler-plugin#dsl-style)를 참조하세요.

### KSP 프로세서(`koin-ksp-compiler`)로부터 마이그레이션

레거시 KSP 프로세서와 함께 Koin 어노테이션을 사용 중이라면 지금 마이그레이션하는 것이 좋습니다:

1. Kotlin을 2.x로 업데이트
2. `koin-ksp-compiler`를 Koin 컴파일러 플러그인으로 교체
3. **어노테이션은 동일하게 유지됩니다** — 코드 변경이 필요 없습니다!
4. 생성된 파일 삭제

[KSP에서 컴파일러 플러그인으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)를 참조하세요.

## 요구 사항

- **Kotlin 2.x** (K2 컴파일러)
- Gradle 8.x 이상

## 구성 옵션

```kotlin
// build.gradle.kts
koinCompiler {
    // 옵션은 여기에 문서화될 예정입니다.
}
```

## Classic DSL: 여전히 완전히 지원됨

컴파일러 플러그인이 Classic DSL을 대체하는 것이 아니라, 그 위에 분석 및 생성 기능을 추가하는 것입니다. Classic DSL은 여전히 완전히 지원됩니다:

```kotlin
// 여전히 완벽하게 작동합니다
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    single { CustomService(get(), get(), configValue) }  // 커스텀 로직
    viewModelOf(::UserViewModel)
}
```

다음과 같은 경우에 Classic DSL을 사용하세요:
- 커스텀 팩토리 로직이 필요한 경우
- 선택적 의존성을 위한 `getOrNull()`이 필요한 경우
- 조건부 인스턴스화
- Kotlin 1.x와의 하위 호환성

## 다음 단계

- **[설정 가이드](/docs/setup/compiler-plugin)** - 상세 설정 지침
- **[DSL 레퍼런스](/docs/reference/dsl-reference)** - 전체 DSL 문서
- **[어노테이션 레퍼런스](/docs/reference/annotations-reference)** - 전체 어노테이션 문서
- **[마이그레이션 가이드](/docs/migration/from-ksp-to-compiler-plugin)** - 프로젝트 업그레이드 방법