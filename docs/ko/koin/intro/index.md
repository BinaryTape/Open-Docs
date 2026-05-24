---
title: 소개
---

# Koin에 오신 것을 환영합니다

**실용적인 Kotlin 의존성 주입 프레임워크 - 단순하면서도 강력합니다**

Koin은 Kotlin 개발자를 위한 경량 의존성 주입(Dependency Injection) 프레임워크입니다. Android 앱, Kotlin Multiplatform 프로젝트, Ktor를 사용한 백엔드 서비스 또는 기타 모든 Kotlin 애플리케이션을 구축할 때, Koin은 의존성 주입을 간단하고 직관적으로 만들어 줍니다.

## 왜 Koin인가요?

Koin은 명확한 철학을 바탕으로 설계되었습니다: **단순함과 강력한 기능 사이에서 고민할 필요가 없어야 합니다**. Koin을 사용하면 두 가지를 모두 얻을 수 있습니다.

### DSL 및 어노테이션 - 원하는 방식의 선택

Koin은 두 가지 방식 모두에서 강력한 기능을 제공합니다. 깔끔한 Kotlin DSL을 선호하시나요? 그대로 사용하세요. 어노테이션(Annotation) 방식을 선호하시나요? 그것도 가능합니다. 두 방식 모두 동등하게 강력하며 Koin의 핵심 기능입니다.

| 가치 | 의미 |
|-------|---------------|
| **생산성** | 배우기 쉽고 작성하기 쉽습니다. 몇 시간이 아닌 몇 분 만에 DI를 설정할 수 있습니다. |
| **개발자 친화적** | DSL 또는 어노테이션 중 선택할 수 있습니다. 명확한 오류 메시지, 쉬운 디버깅, 최고의 개발자 경험(DX)을 제공합니다. |
| **확장성** | 복잡한 의존성 그래프를 가진 대규모 엔터프라이즈 애플리케이션을 지원합니다. |
| **안전성** | Koin 컴파일러 플러그인을 통한 컴파일 타임 안전성을 제공합니다. |
| **동적 유연성** | 런타임 유연성: 모듈 동적 로드, 지연 로딩(lazy loading), 기능 플래그(feature flags) 등을 지원합니다. |

## 어디서부터 시작할까요?

경험 수준에 따라 학습 경로를 선택하세요:

### 의존성 주입이 처음이신가요?

기본 개념부터 시작하세요:
- **[의존성 주입(Dependency Injection)이란 무엇인가요?](/docs/intro/what-is-dependency-injection)** - 핵심 개념 이해하기

### DI는 알지만 Koin은 처음이신가요?

바로 Koin의 세계로 들어오세요:
- **[Koin이란 무엇인가요?](/docs/intro/what-is-koin)** - Koin의 DI 접근 방식 알아보기
- **[Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin)** - Koin을 사용하는 권장되고 더 안전한 방법

### Hilt나 Dagger를 사용해 보셨나요?

Koin과 어떻게 다른지 확인해 보세요:
- **[Koin vs Hilt/Dagger](/docs/intro/koin-vs-hilt)** - 차이점과 마이그레이션 경로 이해하기

### 바로 코드를 작성하고 싶으신가요?

- **[설정 가이드](/docs/setup/gradle)** - 프로젝트에 Koin 추가하기
- **[튜토리얼](/docs/tutorials/your-first-app)** - 첫 번째 Koin 앱 만들기
- **[Koin IDE 플러그인](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** - Android Studio 및 IntelliJ IDEA용 공식 플러그인을 설치하세요. 코드 내비게이션, 실시간 안전성 검사, 의존성 그래프 시각화 기능을 제공합니다.

## Koin의 접근 방식

Koin은 의존성을 정의하는 방식에 유연성을 제공합니다:

| 접근 방식 | 상태 | 설명 |
|----------|--------|-------------|
| **Koin 컴파일러 플러그인** (Kotlin 2.x) | 권장 | DSL: `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()`. |
| **Koin 컴파일러 플러그인** (Kotlin 2.x) | 권장 | 어노테이션: `@Singleton`, `@Factory`, `@KoinViewModel`. 의존성 자동 감지, 컴파일 타임 안전성 제공. |
| **클래식 DSL** | 전체 지원 | `singleOf(::MyService)`, `single { MyService(get()) }`. 모든 Kotlin 버전에서 작동합니다. 준비가 되면 컴파일러 플러그인을 추가하여 안전성을 더할 수 있습니다. |
| **KSP 프로세서** (`koin-ksp-compiler`) | 지원 중단(Deprecated) | Koin 어노테이션을 위한 레거시 프로세서입니다. 컴파일러 플러그인으로 마이그레이션하세요. 동일한 어노테이션을 사용하며 네이티브 컴파일러 통합을 제공합니다. |

더 자세한 내용은 [Koin이란 무엇인가요?](/docs/intro/what-is-koin) 및 [Koin 컴파일러 플러그인](/docs/intro/koin-compiler-plugin)에서 확인하세요.

## 플랫폼 지원

Koin은 Kotlin이 실행되는 모든 곳에서 작동합니다:

| 플랫폼 | 패키지 | 상태 |
|----------|---------|--------|
| **Kotlin/JVM** | `koin-core` | ✅ 전체 지원 |
| **Android** | `koin-android` | ✅ 전체 지원 |
| **Compose (Android & Multiplatform)** | `koin-compose` | ✅ 전체 지원 |
| **iOS** | `koin-core` | ✅ 전체 지원 |
| **Desktop** | `koin-core` | ✅ 전체 지원 |
| **Web (JS/Wasm)** | `koin-core` | ✅ 전체 지원 |
| **Ktor** | `koin-ktor` | ✅ 전체 지원 |

## 빠른 예제

Koin이 어떤 모습인지 맛보기를 살펴봅시다:

```kotlin
// 클래스 정의
class UserRepository(private val api: ApiService)
class UserViewModel(private val repository: UserRepository) : ViewModel()

// 컴파일러 플러그인 DSL로 모듈 정의
val appModule = module {
    single<ApiService>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}

// Koin 시작
startKoin {
    modules(appModule)
}

// Activity에서 주입
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

또는 어노테이션을 사용하는 방식입니다:

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

시작할 준비가 되셨나요? [설정 가이드](/docs/setup/gradle)로 이동하세요.