---
title: Koin vs Hilt/Dagger
---

# Koin vs Hilt/Dagger

이 페이지에서는 Koin과 Hilt, Dagger를 비교하여 차이점을 이해하고 어떤 프레임워크가 여러분의 요구 사항에 적합한지 결정하는 데 도움을 줍니다.

:::info
Koin은 **DSL과 어노테이션(Annotations)**을 모두 지원하므로 팀에 적합한 방식을 선택할 수 있습니다. 두 방식 모두 동일한 컴파일러 플러그인(Compiler Plugin)을 기반으로 하며 동등하게 강력한 기능을 제공합니다. 이 비교에서는 Hilt와의 공정한 비교를 위해 어노테이션 예시를 보여주지만, Koin의 DSL은 더 적은 보일러플레이트(boilerplate)로 동일한 기능을 제공합니다.
:::

## 철학의 차이 (Philosophy Differences)

| 측면 | Koin | Hilt/Dagger |
|--------|------|-------------|
| **학습 곡선** | 배우는 데 몇 분이면 충분함 | 익히는 데 몇 시간 또는 며칠이 걸림 |
| **코드 복잡성** | 단순한 DSL 또는 어노테이션 | 복잡한 어노테이션 규칙 |
| **디버깅** | 명확한 에러, 생성된 코드의 미로가 없음 | 생성된 코드는 추적이 어려울 수 있음 |
| **설정** | 하나의 플러그인, 최소한의 설정 | 다수의 어노테이션, 엄격한 규칙 |
| **컴파일 안전성** | ✅ 컴파일러 플러그인 사용 시 | ✅ 항상 지원 |
| **런타임 유연성** | ✅ 동적 기능 (Dynamic features) | ❌ 정적 기능만 제공 |

## 어노테이션 비교 (Annotation Comparison)

Koin은 어노테이션조차 더 단순합니다.

| 작업 | Koin | Hilt |
|------|------|------|
| **싱글톤 (Singleton)** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **인터페이스 바인딩** | 자동 | 추상 모듈에서 `@Binds` 필요 |
| **컴포넌트 스캔** | `@ComponentScan("package")` | 지원하지 않음 |
| **모듈 탐색** | `@Configuration` - 자동 탐색됨 | 모듈별로 `@InstallIn` 수동 지정 |
| **외부 라이브러리 제공** | `@Singleton fun provide()` | `@Module` 내의 `@Provides` + `@InstallIn` |
| **ViewModel** | `@KoinViewModel class MyVM` | `@HiltViewModel class MyVM @Inject constructor` |

## 코드 비교 (Code Comparison)

### 단순 싱글톤 (Simple Singleton)

**Koin:**
```kotlin
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

**Hilt:**
```kotlin
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

### 인터페이스 바인딩 (Interface Binding)

**Koin - 자동 방식:**
```kotlin
@Singleton
class UserRepositoryImpl(val db: Database) : UserRepository

// 이게 끝입니다! Koin은 자동으로 UserRepository 인터페이스에 바인딩합니다.
```

**Hilt - 명시적 바인딩 필요:**
```kotlin
@Singleton
class UserRepositoryImpl @Inject constructor(val db: Database) : UserRepository

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}
```

### 멀티 모듈 앱 (Multi-Module Apps)

**Koin - 모듈 자동 탐색:**
```kotlin
// feature/auth/AuthModule.kt
@Module
@ComponentScan
@Configuration  // 자동으로 탐색됩니다!
class AuthModule

// feature/profile/ProfileModule.kt
@Module
@ComponentScan
@Configuration  // 자동으로 탐색됩니다!
class ProfileModule

// app/MyApp.kt
@KoinApplication  // 모듈을 일일이 나열할 필요가 없습니다.
class MyApp
```

**Hilt - 각 모듈을 수동으로 설치해야 함:**
```kotlin
// feature/auth/AuthModule.kt
@Module
@InstallIn(SingletonComponent::class)
class AuthModule { ... }

// feature/profile/ProfileModule.kt
@Module
@InstallIn(SingletonComponent::class)
class ProfileModule { ... }

// app/MyApp.kt
@HiltAndroidApp
class MyApp  // 여전히 모든 곳에 올바른 @InstallIn이 필요합니다.
```

### ViewModel

**Koin:**
```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// Activity/Fragment에서
val viewModel: UserViewModel by viewModel()

// Compose에서
val viewModel: UserViewModel = koinViewModel()
```

**Hilt:**
```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// Activity/Fragment에서
val viewModel: UserViewModel by viewModels()

// Compose에서
val viewModel: UserViewModel = hiltViewModel()
```

### 외부 라이브러리 제공 (Providing Third-Party Libraries)

**Koin:**
```kotlin
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

**Hilt:**
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Provides
    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## 동적 기능: Koin만의 고유한 장점

Koin은 **런타임 기반이면서도 성능이 뛰어나고 컴파일 안전성**을 보장합니다. 이를 통해 Hilt가 제공할 수 없는 동적 기능들을 사용할 수 있습니다.

| 동적 기능 | Koin | Hilt |
|-----------------|------|------|
| 런타임에 모듈 로드 | ✅ `loadKoinModules()` | ❌ 불가능 |
| 모듈 언로드 | ✅ `unloadKoinModules()` | ❌ 불가능 |
| 지연 백그라운드 로딩 | ✅ `lazyModules()` | ❌ 불가능 |
| 피처 플래그 주입 | ✅ 간편함 | ⚠️ 복잡한 우회 방법 필요 |
| 플러그인 아키텍처 | ✅ 자연스럽게 적합 | ❌ 매우 어려움 |
| A/B 테스트 구현 | ✅ 런타임 스왑 | ⚠️ 컴파일 타임에만 가능 |
| 동적 구성 (Configuration) | ✅ 지원됨 | ❌ 불가, 다시 컴파일해야 함 |

### 예시: 동적 모듈 로딩 (Dynamic Module Loading)

```kotlin
// KOIN - 동적 모듈 로딩
if (userHasPremium) {
    loadKoinModules(premiumFeatureModule)
}

// 나중에 구독이 만료되면
unloadKoinModules(premiumFeatureModule)

// 빠른 시작을 위한 지연 로딩
startKoin {
    modules(coreModule)
    lazyModules(
        analyticsModule,  // 백그라운드에서 로드됨
        heavyFeatureModule
    )
}
```

**이것은 Hilt에서는 불가능합니다.** 모든 의존성이 컴파일 타임에 연결되기 때문입니다.

### 예시: 피처 플래그 (Feature Flags)

```kotlin
// KOIN - 런타임에 구현체 교체
val featureModule = module {
    if (FeatureFlags.useNewApi) {
        single<ApiService> { NewApiService() }
    } else {
        single<ApiService> { LegacyApiService() }
    }
}

// 또는 동적으로 교체
fun updateApiImplementation(useNew: Boolean) {
    unloadKoinModules(apiModule)
    loadKoinModules(if (useNew) newApiModule else legacyApiModule)
}
```

## 설정 비교 (Setup Comparison)

### Koin 설정

자세한 지침은 **[컴파일러 플러그인 설정 가이드](/docs/setup/compiler-plugin)**를 참조하세요.

### Hilt 설정

```kotlin
// settings.gradle.kts
plugins {
    id("com.google.dagger.hilt.android") version "2.x" apply false
}

// app/build.gradle.kts
plugins {
    id("com.google.devtools.ksp")
    id("dagger.hilt.android.plugin")
}

dependencies {
    implementation("com.google.dagger:hilt-android:2.x")
    ksp("com.google.dagger:hilt-compiler:2.x")
}
```

## 에러 메시지 (Error Messages)

### Koin

```
org.koin.core.error.NoBeanDefFoundException:
No definition found for class 'com.app.UserRepository'.
Check your module definitions.
```

명확하며 문제의 원인을 직접적으로 가리킵니다.

### Hilt/Dagger

```
error: [Dagger/MissingBinding] com.app.UserRepository cannot be provided
without an @Inject constructor or an @Provides-annotated method.
com.app.UserRepository is injected at
    com.app.UserService(repository)
com.app.UserService is injected at
    com.app.UserActivity.service
com.app.UserActivity is injected at
    dagger.hilt.android.internal.managers.ActivityComponentManager.inject
```

내용이 길며 컴포넌트 그래프에 대한 이해가 필요합니다.

## 선택 기준 (When to Choose Each)

### 다음과 같은 경우 Koin을 선택하세요:

- **생산성과 단순성**을 중요하게 생각할 때
- **런타임 유연성**(동적 모듈, 피처 플래그 등)이 필요할 때
- **Kotlin Multiplatform** 앱을 개발할 때
- 팀이 **빠르게 배우기**를 원할 때
- **적은 보일러플레이트 코드**를 선호할 때
- **더 쉬운 디버깅**을 원할 때

### 다음과 같은 경우 Hilt를 선택하세요:

- 팀이 **이미 Dagger에 익숙할** 때
- **구글 우선 생태계(Google-first ecosystem)**와의 호환성이 필요할 때
- **Dagger만의 특정 기능**이 필요할 때

## Hilt에서 Koin으로 마이그레이션 (Migration from Hilt to Koin)

마이그레이션을 고려 중이라면 다음을 참고하세요:

### 개념 매핑 (Concept Mapping)

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `@KoinApplication` 및 `startKoin<T> { }` |
| `@AndroidEntryPoint` | `by inject()` |
| `by viewModels()`가 적용된 `@HiltViewModel` | `by viewModel()`이 적용된 `@KoinViewModel` |
| `@Inject constructor` | 일반 생성자 (자동 감지됨) |
| `@Binds` | 자동 또는 `bind` |
| `@InstallIn(SingletonComponent)` | `@Configuration` |
| 함수에 붙은 `@Provides` | 함수에 붙은 `@Factory` |

### 점진적 마이그레이션

점진적으로 마이그레이션할 수 있습니다:

1. 프로젝트에 Koin을 추가합니다.
2. 한 번에 하나의 피처 모듈씩 마이그레이션합니다.
3. 전환 기간 동안 두 DI 프레임워크를 공존시킬 수 있습니다 (Koin은 `@ComponentScan`을 통해 대상 패키지를 스캔할 수 있습니다).
4. 마이그레이션이 완료되면 Hilt를 제거합니다.

자세한 단계는 [Hilt에서 마이그레이션하기](/docs/migration/from-hilt)를 참조하세요.

## 요약

**Koin: 단순하면서도 강력함**

- Hilt와 같은 **컴파일 타임 안전성** (컴파일러 플러그인 사용 시)
- **DSL 또는 어노테이션** - 두 방식 모두 강력하며 선택 가능
- Hilt가 따라올 수 없는 **단순함과 생산성**
- Hilt로는 불가능한 **동적 런타임 기능**

안전성과 단순성 사이에서 고민할 필요가 없습니다. Koin과 함께라면 두 가지 모두를 얻을 수 있습니다.

## 다음 단계

- **[Koin이란 무엇인가요?](/docs/intro/what-is-koin)** - Koin에 대해 더 알아보기
- **[설정 가이드](/docs/setup/gradle)** - 프로젝트에 Koin 추가하기
- **[Hilt에서 마이그레이션하기](/docs/migration/from-hilt)** - 단계별 마이그레이션 가이드