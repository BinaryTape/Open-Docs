---
title: Android 모듈 로딩
---

이 가이드에서는 `androidContext()`와 `androidLogger()`를 사용한 Android 전용 모듈 로딩을 다룹니다.

:::info
핵심 모듈 개념(선언, 포함, 재정의)에 대해서는 [Modules](/docs/reference/koin-core/modules)를 참조하세요. 지연 모듈 로딩(lazy module loading)에 대해서는 [Lazy Modules](/docs/reference/koin-core/lazy-modules)를 참조하세요.
:::

## Android에서 Koin 시작하기

### 애노테이션(Annotations) 사용

```kotlin
@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin<MainApplication> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### DSL 사용

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android 로거
            androidLogger()
            // 또는 로그 레벨 설정
            androidLogger(Level.DEBUG)

            // Android 컨텍스트
            androidContext(this@MainApplication)

            // 모듈
            modules(appModule, networkModule, dataModule)
        }
    }
}
```

## Android 전용 함수

| 함수 | 설명 |
|----------|-------------|
| `androidContext()` | 정의(definitions) 내에서 Application 컨텍스트를 제공합니다. |
| `androidApplication()` | 정의 내에서 Application 인스턴스를 제공합니다. |
| `androidLogger()` | Koin을 위한 Android Logcat 로거입니다. |

### Android 컨텍스트 사용하기

```kotlin
val androidModule = module {
    single { DatabaseHelper(androidContext()) }
    single { SharedPrefsManager(androidContext()) }
    single { NotificationHelper(androidApplication()) }
}
```

## 동적 모듈 로딩

Activity 생명주기에 따라 런타임에 모듈을 로드하거나 언로드할 수 있습니다:

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 기능 전용 의존성 로드
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 기능을 벗어날 때 정리
        unloadKoinModules(featureModule)
    }
}
```

### 사용 사례

- **프리미엄 기능** - 사용자가 구독 중일 때만 로드
- **디버그 도구** - 디버그 빌드에서만 로드
- **선택적 기능** - 필요에 따라(on-demand) 로드

```kotlin
// 프리미엄 기능 모듈
val premiumModule = module {
    viewModel<PremiumViewModel>()
    single<PremiumRepository>()
}

class PremiumActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        if (userHasPremium()) {
            loadKoinModules(premiumModule)
        }
        super.onCreate(savedInstanceState)
    }
}
```

## Android에서의 지연 로딩(Lazy Loading)

백그라운드 모듈 로딩을 위해 지연 모듈(lazy modules)을 사용하세요:

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)

            // 중요한 모듈은 즉시 로드
            modules(coreModule)

            // 중요하지 않은 모듈은 백그라운드에서 로드
            lazyModules(analyticsModule, syncModule)
        }
    }
}
```

:::info
병렬 로딩을 포함한 지연 모듈에 대한 전체 문서는 [Lazy Modules](/docs/reference/koin-core/lazy-modules)를 참조하세요.
:::

## 다음 단계

- **[Modules](/docs/reference/koin-core/modules)** - 핵심 모듈 개념
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - 백그라운드 로딩
- **[Multi-Module Apps](/docs/reference/koin-android/multi-module)** - Gradle 멀티 모듈 아키텍처