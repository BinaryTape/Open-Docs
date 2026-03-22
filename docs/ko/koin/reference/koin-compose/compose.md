---
title: Compose를 위한 Koin
---

# Compose를 위한 Koin

Koin은 의존성 주입(dependency injection)을 위한 전용 패키지를 통해 Jetpack Compose 및 Compose Multiplatform 애플리케이션에 대한 완전한 지원을 제공합니다.

## 패키지 개요

| 패키지 | 사용 사례 |
|---------|----------|
| `koin-compose` | 기본 Compose API (멀티플랫폼) |
| `koin-compose-viewmodel` | ViewModel 주입 (멀티플랫폼) |
| `koin-compose-viewmodel-navigation` | ViewModel + Navigation 2.x |
| `koin-compose-navigation3` | Navigation 3 통합 (멀티플랫폼) |
| `koin-androidx-compose` | Android 편의 패키지 (`koin-compose` + `koin-compose-viewmodel` 포함) |

:::info
모든 Compose API는 `koin-compose` 및 `koin-compose-viewmodel`에 정의되어 있습니다. `koin-androidx-compose` 패키지는 Android 프로젝트를 위해 이 둘을 모두 포함하는 편의용 래퍼(wrapper)입니다.
:::

### 어떤 패키지를 사용해야 하나요?

**Android 전용 프로젝트의 경우:**
```kotlin
// 옵션 1: Android 편의 패키지 (koin-compose + koin-compose-viewmodel 포함)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 옵션 2: 멀티플랫폼 패키지를 직접 사용
implementation("io.insert-koin:koin-compose:$koin_version")
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// 선택 사항: Navigation 통합
implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
```

**Compose Multiplatform 프로젝트의 경우:**
```kotlin
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

    // 선택 사항: Navigation 통합
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

## 플랫폼 지원

| 플랫폼 | Compose 유형 | 상태 |
|----------|-------------|--------|
| Android | Jetpack Compose | 완전 지원 |
| iOS | Compose Multiplatform | 완전 지원 |
| Desktop | Compose Desktop | 완전 지원 |
| Web | Compose for Web | 실험적(Experimental) |

## Koin 시작하기

### 옵션 1: startKoin (Android 전용 또는 외부 설정)

완전한 제어를 위해 Compose 외부에서 Koin을 초기화합니다:

```kotlin
// Android Application 클래스
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            androidLogger()
            modules(appModule)
        }
    }
}

// Compose UI에서 Koin을 자동으로 사용
@Composable
fun App() {
    val viewModel = koinViewModel<MyViewModel>()
}
```

**사용 시점:** Koin 수명 주기(lifecycle)에 대한 완전한 제어, 커스텀 설정 또는 다른 프레임워크와의 통합이 필요한 경우.

### 옵션 2: KoinApplication (Compose 관리형)

Compose가 Koin 설정을 자동으로 처리하도록 합니다:

```kotlin
@Composable
fun App() {
    KoinApplication(configuration = koinConfiguration {
        modules(appModule)
    }) {
        MyScreen()
    }
}
```

**장점:**
- 외부 설정이 필요 없음 (Application 클래스가 필요 없음)
- Android Context가 자동으로 주입됨
- 컴포지션 수명 주기(composition lifecycle)에 따라 시작/종료를 처리함
- Android의 구성 변경(configuration changes)을 관리함

**사용 시점:** 제어는 덜 필요하지만 가장 간단한 설정이 필요한 경우.

Android에서 `androidContext`와 `androidLogger`를 자동으로 주입합니다.

:::note
`KoinMultiplatformApplication`은 지원 중단(deprecated)되었습니다. 대신 `koinConfiguration`과 함께 `KoinApplication`을 사용하세요.
:::

## 기본 주입

### koinInject() - 의존성 가져오기

Koin에서 관리하는 모든 의존성을 주입합니다:

```kotlin
@Composable
fun UserScreen() {
    val repository = koinInject<UserRepository>()
    // repository 사용...
}
```

**권장 사항(Best practice)** - 기본 파라미터로 주입:

```kotlin
@Composable
fun UserScreen(
    repository: UserRepository = koinInject()
) {
    // Koin 없이도 테스트 가능
}
```

### koinViewModel() - ViewModel 가져오기

적절한 수명 주기 관리와 함께 ViewModel을 주입합니다:

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    val state by viewModel.state.collectAsState()
}
```

:::info
모든 ViewModel API에 대해서는 [Compose에서의 ViewModel](/docs/reference/koin-compose/compose-viewmodel)을 참조하세요.
:::

### 파라미터와 함께 사용

런타임 파라미터를 전달합니다:

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

빈번한 리컴포지션(recomposition)에서 더 나은 성능을 위해 다음과 같이 사용할 수 있습니다:

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel>(
        parameters = parametersOf(itemId)
    )
}
```

## 모듈 정의하기

### 컴파일러 플러그인 DSL

```kotlin
val appModule = module {
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 어노테이션(Annotations)

```kotlin
@Singleton
class UserRepository

@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

## 빠른 참조 (Quick Reference)

| 함수 | 용도 |
|----------|---------|
| `koinInject<T>()` | 모든 의존성 주입 |
| `koinViewModel<T>()` | ViewModel 주입 |
| `koinNavViewModel<T>()` | 네비게이션 인자가 포함된 ViewModel |
| `koinActivityViewModel<T>()` | 액티비티 범위(Activity-scoped) ViewModel (Android) |
| `rememberKoinModules()` | 컴포지션과 함께 모듈 로드 |
| `KoinScope {}` | 범위가 지정된 컨텍스트(scoped context) 생성 |

## 문서

| 주제 | 설명 |
|-------|-------------|
| **[ViewModel](/docs/reference/koin-compose/compose-viewmodel)** | 모든 ViewModel 주입 API |
| **[수명 주기 및 상태](/docs/reference/koin-compose/compose-lifecycle)** | 리컴포지션, 상태, 사이드 이펙트(side effects) |
| **[동적 모듈](/docs/reference/koin-compose/compose-modules)** | rememberKoinModules, 지연 로딩(lazy loading) |
| **[스코프(Scopes)](/docs/reference/koin-compose/compose-scopes)** | KoinScope, KoinNavigationScope, UnboundKoinScope |
| **[테스트](/docs/reference/koin-compose/compose-testing)** | 미리보기(Preview), 단위 테스트 |
| **[격리된 컨텍스트](/docs/reference/koin-compose/isolated-context)** | SDK 격리 |
| **[Navigation 3](/docs/reference/koin-compose/navigation3)** | 타입 안전 네비게이션 (멀티플랫폼) |

## 관련 항목

- **[Core ViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel 선언 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 전용 기능
- **[KMP 설정](/docs/reference/koin-core/kmp-setup)** - 멀티플랫폼 구성