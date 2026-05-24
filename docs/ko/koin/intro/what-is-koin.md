---
title: Koin이란 무엇인가요?
---

# Koin이란 무엇인가요?

### 실용적인 Kotlin 의존성 주입(DI) 프레임워크 - 단순하면서도 강력합니다

Koin은 Kotlin을 위해 특별히 설계된 경량 의존성 주입(Dependency Injection, DI) 프레임워크입니다. 코드 생성이나 리플렉션(reflection)에 의존하는 기존 DI 프레임워크와 달리, Koin은 두 가지 강력한 방식을 제공합니다: 깔끔한 **Kotlin DSL**과 직관적인 **애노테이션(Annotations)**입니다. 팀의 성격에 맞는 방식을 선택하세요 - 두 방식 모두 최고 수준으로 지원(first-class citizens)됩니다.

## Koin의 핵심 가치

| 가치 | 의미 |
|-------|---------------|
| **생산성(Productive)** | 배우기 쉽고 작성하기 쉽습니다. 몇 시간이 아닌 몇 분 만에 DI를 구축할 수 있습니다. |
| **개발자 친화적(Developer-Friendly)** | DSL 또는 애노테이션 중 원하는 것을 선택하세요. 명확한 오류 메시지, 쉬운 디버깅, 최적의 개발자 경험(DX)을 제공합니다. |
| **확장성(Scalable)** | 복잡한 의존성 그래프를 가진 대규모 엔터프라이즈 애플리케이션을 지원합니다. |
| **안전성(Safe)** | Koin 컴파일러 플러그인을 통한 컴파일 타임 안전성을 보장합니다. |
| **동적 유연성(Dynamic)** | 런타임 유연성: 모듈 동적 로드, 지연 로딩(lazy loading), 기능 플래그(feature flags) 등을 지원합니다. |

## 개발자들이 Koin을 사랑하는 이유

- **몇 분 만에 익히기** - 복잡한 개념 없이 직관적인 DSL과 단순한 애노테이션만으로 충분합니다.
- **더 적은 코드 작성** - DSL이나 애노테이션을 사용하면 컴파일러 플러그인이 의존성을 자동으로 연결해 줍니다.
- **스타일 선택 가능** - Kotlin 순수주의자를 위한 DSL, 익숙한 패턴을 선호하는 이들을 위한 애노테이션 - 두 방식 모두 강력합니다.
- **쉬운 디버깅** - 명확한 에러 메시지를 제공하며, 추적해야 할 생성된 코드가 없습니다.
- **자신감 있는 확장** - 전 세계 엔터프라이즈 환경의 프로덕션에서 이미 검증되었습니다.
- **안전 유지** - 컴파일 타임 검증을 통해 런타임 전에 에러를 잡아냅니다.
- **유연성 유지** - 런타임 기반이면서도 성능이 뛰어납니다. 동적 모듈, 지연 로딩, 기능 플래그를 지원합니다.
- **IDE 지원** - Android Studio 및 IntelliJ IDEA용 공식 플러그인 제공 — 정의 이동, 실시간 안전성 체크, 그래프 시각화가 가능합니다.

## 두 가지 스타일, 하나의 프레임워크 - 모두 강력함

Koin은 의존성을 정의하는 두 가지 스타일을 지원합니다. 두 방식 모두 모든 기능을 동등하게 지원하는 일급 객체(first-class citizens)입니다. 팀에 적합한 방식을 선택하세요.

### DSL 스타일

Kotlin DSL 구문을 사용하여 의존성을 정의합니다.

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 애노테이션 스타일

애노테이션을 사용하여 의존성을 정의합니다.

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
```

두 스타일 모두 컴파일 타임 안전성을 위해 **Koin 컴파일러 플러그인(Koin Compiler Plugin)**에 의해 처리됩니다.

## 더 간단한 Koin의 애노테이션

Hilt나 Dagger를 사용해 보셨다면, Koin 애노테이션이 훨씬 적은 절차적 코드(ceremony)를 요구한다는 점을 느끼실 것입니다.

| 작업 | Koin | Hilt |
|------|------|------|
| **Singleton** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **인터페이스 바인딩** | 자동 (인터페이스만 구현하면 됨) | 추상 모듈에서 `@Binds` 필요 |
| **컴포넌트 스캔** | `@ComponentScan("package")` | 지원 안 함 |
| **모듈 탐색** | `@Configuration` - 자동 탐색 | 모듈마다 수동으로 `@InstallIn` 필요 |

**예시 비교:**

```kotlin
// KOIN - 이게 전부입니다!
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

```kotlin
// HILT - 더 많은 절차가 필요합니다
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

## Koin 컴파일러 플러그인 기반

**Koin 컴파일러 플러그인(Koin Compiler Plugin)**은 모든 신규 프로젝트에 권장되는 Koin 사용 방식입니다.

- **네이티브 Kotlin 컴파일러 플러그인 (K2)** - KSP가 아닌 직접적인 컴파일러 통합 방식입니다.
- **생성자 파라미터 자동 감지** - 수동 연결 작업이 줄어듭니다.
- **컴파일 타임 안전성** - 빌드 중에 에러를 잡아냅니다.
- **DSL과 애노테이션 모두 지원** - 선택은 여러분의 몫입니다.
- **간단한 설정** - 단 하나의 Gradle 플러그인으로 충분합니다.

### 컴파일러 플러그인을 통한 더 깔끔한 구문

| 기존 DSL (Classic DSL) | 컴파일러 플러그인 DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |

더 자세한 내용은 [Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin)에서 확인하세요.

## 클래식 DSL (완전 지원)

클래식 DSL은 모든 Kotlin 버전에 대해 계속해서 완전히 지원됩니다.

```kotlin
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

또는 명시적 연결 방식을 사용할 수 있습니다.

```kotlin
val appModule = module {
    single { Database() }
    single { ApiClient() }
    single { UserRepository(get(), get()) }
    viewModel { UserViewModel(get()) }
}
```

:::info
클래식 DSL은 지원 중단(deprecated)되지 않았습니다. Koin은 이 방식과 완벽하게 작동합니다. 컴파일러 플러그인은 마이그레이션 준비가 되었을 때 컴파일 타임 분석 기능을 추가로 제공해 줍니다.
:::

## Koin Annotations는 이제 Koin 프로젝트의 일부입니다

`@Singleton`, `@Factory`, `@KoinViewModel`, `@Module`, `@ComponentScan` 등을 포함한 `koin-annotations` 라이브러리는 메인 Koin 버전과 함께 릴리스되며 완전히 지원됩니다. 이 또한 지원 중단되지 **않았습니다**.

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // Koin 버전과 동일
}
```

여러분의 애노테이션은 **Koin 컴파일러 플러그인**에 의해 처리됩니다 — [Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin) 및 [애노테이션 레퍼런스](/docs/reference/koin-annotations/start)를 참조하세요.

## Koin KSP 컴파일러는 Koin 컴파일러 플러그인으로 대체되어 지원 중단되었습니다

:::info
기존의 KSP 프로세서인 `koin-ksp-compiler`는 **지원 중단(deprecated)**되었으며 향후 Koin 버전에서 제거될 예정입니다. 대체 기술은 **Koin 컴파일러 플러그인**입니다 — 네이티브 K2 컴파일러 통합, 생성 파일 없음, 더 간단한 KMP 설정이 특징입니다.
:::

`koin-ksp-compiler`와 함께 Koin Annotations를 사용 중이라면 컴파일러 플러그인으로 마이그레이션하세요:

- **동일한 애노테이션** — 코드 변경이 필요 없습니다.
- **더 나은 처리 방식** — 네이티브 컴파일러 통합으로 생성 파일이 없습니다.
- **더 간단한 설정** — KSP 설정이 필요 없습니다.

[KSP에서 컴파일러 플러그인으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)를 확인하세요.

## 런타임 유연성 + 컴파일 안전성 = 두 세계의 장점 결합

Koin은 **런타임 기반이면서도 성능이 뛰어나고 컴파일 시 안전**합니다. 이 독특한 조합은 다음을 가능하게 합니다:

**컴파일 타임 안전성** (컴파일러 플러그인 사용 시):
- 빌드 중에 의존성 그래프를 검증합니다.
- 생성자 파라미터를 자동으로 감지합니다.
- 런타임 전에 누락된 의존성을 잡아냅니다.

**런타임 유연성** (컴파일 타임 전용 프레임워크가 제공할 수 없는 기능):
- 동적 모듈 로드/언로드
- 지연 모듈 로딩 (백그라운드)
- 기능 플래그 기반의 주입
- 플러그인 아키텍처
- 다양한 구현체를 활용한 A/B 테스팅

```kotlin
// 동적 모듈 로딩 - Hilt에서는 불가능합니다.
if (featureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 이후 기능이 비활성화될 경우
unloadKoinModules(premiumFeatureModule)
```

## Koin은 누구를 위한 것인가요?

Koin은 다음과 같은 경우에 이상적입니다:

- **생산성을 중요하게 생각하는 팀** - 보일러플레이트 코드를 줄이고 개발 속도를 높이고자 할 때
- **Android 개발자** - Hilt/Dagger보다 깔끔한 DI를 원하는 경우
- **Kotlin Multiplatform 프로젝트** - Android, iOS, 데스크톱, 웹, 백엔드 대응
- **엔터프라이즈 프로젝트** - 확장이 필요한 대규모 프로젝트
- **DI가 복잡해서는 안 된다고 믿는 모든 이들**

## 다음 단계

- **[의존성 주입이란 무엇인가요?](/docs/intro/what-is-dependency-injection)** - DI의 기본 개념 익히기
- **[Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin)** - 권장되는 접근 방식
- **[설정 가이드](/docs/setup/gradle)** - 프로젝트에 Koin 추가하기
- **[튜토리얼](/docs/tutorials/your-first-app)** - Koin으로 첫 번째 앱 만들기