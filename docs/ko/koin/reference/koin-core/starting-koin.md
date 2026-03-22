---
title: Koin 시작하기
---

# Koin 시작하기

이 가이드는 Koin 컨테이너를 초기화하고 애플리케이션에 맞게 설정하는 방법을 설명합니다.

## `startKoin` 함수

`startKoin`은 Koin을 실행하는 기본 진입점(entry point)입니다. 컨테이너를 `GlobalContext`에 등록하여 애플리케이션 전체에서 접근할 수 있도록 합니다.

```kotlin
startKoin {
    modules(appModule)
}
```

Koin이 시작되면 `get()` 또는 `by inject()`를 통해 의존성을 주입받을 준비가 됩니다.

### 설정 옵션 (Configuration Options)

```kotlin
startKoin {
    // 로깅
    logger(Level.INFO)

    // 프로퍼티
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))

    // 모듈
    modules(
        coreModule,
        networkModule,
        dataModule
    )

    // 지연 로딩 모듈 (백그라운드 로딩)
    lazyModules(analyticsModule, reportingModule)

    // 즉시 생성되는(eager) 싱글톤 생성
    createEagerInstances()

    // 오버라이드 제어
    allowOverride(false)
}
```

| 옵션 | 설명 |
|--------|-------------|
| `logger()` | 로깅 레벨 및 구현 설정 |
| `modules()` | 모듈을 즉시 로드 |
| `lazyModules()` | 모듈을 백그라운드에서 로드 |
| `properties()` | Map으로부터 프로퍼티 로드 |
| `fileProperties()` | koin.properties 파일로부터 로드 |
| `environmentProperties()` | 시스템/환경 변수로부터 로드 |
| `createEagerInstances()` | 모든 `createdAtStart` 싱글톤 생성 |
| `allowOverride()` | 정의(definition) 오버라이딩 활성화/비활성화 |

:::info
`startKoin`은 오직 **한 번**만 호출할 수 있습니다. 나중에 추가 모듈을 로드하려면 `loadKoinModules()`를 사용하세요.
:::

## Koin 컨테이너 시작하기

| 메서드 | 사용 사례 |
|--------|----------|
| `startKoin { }` | 표준 앱 - GlobalContext에 등록 |
| `koinApplication { }` | 테스트, SDK, 격리된 컨텍스트 - 로컬 인스턴스 |
| `koinConfiguration { }` | 전용 API(Compose, Ktor)를 위한 설정 홀더 |

:::tip
**Koin 컴파일러 플러그인(Koin Compiler Plugin)**을 사용하면 `startKoin<T>()`, `koinApplication<T>()`, `koinConfiguration<T>()`와 같은 타입이 지정된 변형을 사용할 수 있습니다. 아래의 [컴파일러 플러그인으로 Koin 시작하기](#컴파일러-플러그인으로-koin-시작하기)를 참조하세요.
:::

### `startKoin` - 전역 인스턴스 (Global Instance)

가장 일반적인 접근 방식으로, Koin을 전역적으로 시작합니다.

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    // 어디서든 사용 가능
    val service: MyService = get()
}
```

### `koinApplication` - 격리된 인스턴스 (Isolated Instance)

격리된 Koin 인스턴스를 생성합니다(GlobalContext에 등록되지 않음).

```kotlin
val myKoin = koinApplication {
    modules(myModule)
}.koin

// 격리된 인스턴스 사용
val service: MyService = myKoin.get()
```

**사용 사례:**
- 격리된 컨텍스트에서의 테스트
- SDK 개발 (호스트 앱 오염 방지)
- 다중 Koin 인스턴스 운용

### `koinConfiguration` - 설정 홀더 (Configuration Holder)

전용 API(Compose `KoinApplication`, Ktor 플러그인)에서 사용할 설정을 생성합니다.

```kotlin
val config = koinConfiguration {
    modules(appModule)
}

// Compose KoinApplication, Ktor 등에서 사용됨
```

## 컴파일러 플러그인으로 Koin 시작하기

어노테이션과 함께 **Koin 컴파일러 플러그인(Koin Compiler Plugin)**을 사용하는 경우, 생성된 코드 없이 **타입이 지정된 API(typed APIs)**를 사용하여 Koin을 시작할 수 있습니다.

:::info
이 기능을 사용하려면 [Koin 컴파일러 플러그인](/docs/setup/compiler-plugin)이 필요합니다. 애플리케이션 클래스에 `@KoinApplication` 어노테이션을 지정해야 합니다.
:::

### 애플리케이션 정의하기

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp")
class MyModule

@KoinApplication
class MyApp
```

### 타입이 지정된 시작 API (Typed Startup APIs)

| API | 설명 |
|-----|-------------|
| `startKoin<T>()` | 애플리케이션 T로 Koin을 전역적으로 시작 |
| `startKoin<T> { }` | 애플리케이션 T와 추가 설정을 함께 시작 |
| `koinApplication<T>()` | T를 사용하여 격리된 KoinApplication 생성 |
| `koinConfiguration<T>()` | T로부터 KoinConfiguration 생성 (Compose, Ktor용) |

여기서 `T`는 `@KoinApplication` 어노테이션이 달린 클래스입니다.

### 예시

```kotlin
// 단순 시작
startKoin<MyApp>()

// 추가 설정과 함께 시작
startKoin<MyApp> {
    printLogger()
}

// 격리된 인스턴스
val myKoin = koinApplication<MyApp>().koin

// Compose/Ktor를 위한 설정
val config = koinConfiguration<MyApp>()
```

### 멀티 모듈 프로젝트 (Multi-Module Projects)

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@Configuration
@ComponentScan("com.myapp.feature")
class FeatureModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

// Koin 시작
startKoin<MyApp>()
```

## 플랫폼 통합 (Platform Integrations)

### 안드로이드 (Android)

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

**컴파일러 플러그인 사용 시:**

```kotlin
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApp> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### Compose

`koinConfiguration`과 함께 `KoinApplication` 컴포저블을 사용하세요.

```kotlin
@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration { modules(appModule) }
    ) {
        MainScreen()
    }
}
```

**컴파일러 플러그인 사용 시:**

```kotlin
@KoinApplication
class MyApp

@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration<MyApp>()
    ) {
        MainScreen()
    }
}
```

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

**컴파일러 플러그인 사용 시:**

```kotlin
@KoinApplication
class MyApp

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        withConfiguration<MyApp>()
    }
}
```

:::info
자세한 내용은 [Ktor 통합](/docs/reference/koin-ktor/ktor)을 참조하세요.
:::

### Kotlin 멀티플랫폼 (Kotlin Multiplatform)

여러 플랫폼에서 설정을 공유합니다.

```kotlin
// commonMain
fun initKoin(config: KoinAppDeclaration? = null) {
    startKoin {
        config?.invoke(this)
        modules(sharedModule)
    }
}

// androidMain
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}

// iosMain
fun initKoinIos() = initKoin()
```

## 동적 모듈 관리 (Dynamic Module Management)

### 시작 후 모듈 로드하기

```kotlin
// 초기 시작
startKoin {
    modules(coreModule)
}

// 나중에 추가 모듈 로드
loadKoinModules(featureModule)
```

### 모듈 언로드하기

```kotlin
unloadKoinModules(featureModule)
```

### 피처 토글(Feature Toggle) 예시

```kotlin
if (isFeatureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 나중에 비활성화된 경우
unloadKoinModules(premiumFeatureModule)
```

## Koin 중지하기

컨테이너를 닫고 리소스를 해제합니다.

```kotlin
stopKoin()
```

격리된 인스턴스의 경우:

```kotlin
val koinApp = koinApplication { modules(myModule) }
koinApp.close()
```

## 로깅 (Logging)

### 로깅 활성화

```kotlin
startKoin {
    logger(Level.INFO)  // 또는 DEBUG, WARNING, ERROR, NONE
}
```

### 사용 가능한 로거 (Available Loggers)

| 로거 | 플랫폼 | 설명 |
|--------|----------|-------------|
| `EmptyLogger` | 모든 플랫폼 | 로깅 없음 (기본값) |
| `PrintLogger` | 모든 플랫폼 | 콘솔 출력 |
| `AndroidLogger` | 안드로이드 | 안드로이드 Logcat |
| `SLF4JLogger` | JVM | SLF4J 통합 |

### 플랫폼별 로거

```kotlin
// 안드로이드
startKoin {
    androidLogger(Level.DEBUG)
}

// Ktor
install(Koin) {
    slf4jLogger()
}
```

## 프로퍼티 (Properties)

### 프로퍼티 로드하기

```kotlin
startKoin {
    // 환경 변수로부터 로드
    environmentProperties()

    // 파일로부터 로드 (koin.properties)
    fileProperties()

    // 코드에서 직접 로드
    properties(mapOf(
        "server_url" to "https://api.example.com",
        "api_key" to "secret123"
    ))
}
```

### 프로퍼티 사용하기

```kotlin
val appModule = module {
    single {
        ApiClient(
            url = getProperty("server_url"),
            key = getProperty("api_key", "default")
        )
    }
}
```

## 권장 사항 (Best Practices)

1. **`startKoin`은 한 번만 호출하세요** - 애플리케이션의 진입점에서 호출합니다.
2. **중요한 모듈은 즉시 로드하세요** - `modules()`를 사용합니다.
3. **지연 로딩 모듈을 활용하세요** - 중요하지 않은 모듈은 `lazyModules()`로 로딩을 늦추세요.
4. **개발 단계에서는 로깅을 활성화하세요** - `logger(Level.DEBUG)`
5. **프로덕션 환경에서는 엄격한 모드를 사용하세요** - `allowOverride(false)`
6. **테스트 사이에는 Koin을 중지하세요** - 상태를 리셋하기 위해 `stopKoin()`을 호출합니다.

## 다음 단계

- **[모듈](/docs/reference/koin-core/modules)** - 정의를 체계화하세요.
- **[정의](/docs/reference/koin-core/definitions)** - DSL 또는 어노테이션으로 정의를 생성하세요.
- **[주입](/docs/reference/koin-core/injection)** - 의존성을 가져오는 방법을 알아보세요.