---
title: 지연 로딩 모듈 및 백그라운드 로딩
---

지연 로딩 모듈(Lazy modules)은 시작 성능을 향상시키기 위해 비동기적이고 병렬적인 모듈 로딩을 가능하게 합니다. 시작 시 모든 모듈을 동기적으로 로드하는 대신, 모듈 초기화를 지연시키고 병렬화할 수 있습니다.

:::info
이 페이지에서는 **Koin 컴파일러 플러그인 DSL**(`single<T>()`)을 사용합니다. 설정 방법은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.
:::

## 지연 로딩 모듈이란 무엇인가요?

지연 로딩 모듈은 명시적으로 로드될 때까지 모듈 등록과 인스턴스 생성을 지연시킵니다. 특히 다음과 같은 경우에 유용합니다:

- **대규모 애플리케이션** - 여러 스레드에 걸쳐 초기화를 분산
- **성능 최적화** - 시작 시간 단축
- **조건부 기능** - 필요한 경우에만 모듈 로드
- **백그라운드 초기화** - 중요하지 않은 모듈을 비동기적으로 로드

## 지연 로딩 모듈 정의하기

`lazyModule` 함수를 사용하여 지연 로딩 모듈을 생성합니다:

```kotlin
// 지연 로딩 모듈 - 명시적으로 요청될 때까지 로드되지 않음
val networkModule = lazyModule {
    single<ApiClient>()
    single<NetworkMonitor>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}
```

### 지연 로딩 모듈 구성하기

지연 로딩 모듈은 일반 모듈과 마찬가지로 `includes()`를 지원합니다:

```kotlin
val dataModule = lazyModule {
    single<UserRepository>()
}

val featureModule = lazyModule {
    includes(dataModule)  // 다른 지연 로딩 모듈 포함
    single<FeatureService>()
}
```

:::info
지연 로딩 모듈은 `lazyModules()` 함수를 통해 로드되기 전까지는 어떠한 리소스도 할당하지 않습니다.
:::

## 지연 로딩 모듈 로드하기

Koin 설정 내에서 `lazyModules()`를 사용하여 지연 로딩 모듈을 로드합니다.

### 기본 로딩

```kotlin
val analyticsModule = lazyModule {
    single<AnalyticsService>()
}

val reportingModule = lazyModule {
    single<CrashReporter>()
}

startKoin {
    // 중요한 모듈은 즉시 로드
    modules(coreModule, networkModule)

    // 중요하지 않은 모듈은 백그라운드에서 로드
    lazyModules(analyticsModule, reportingModule)
}
```

### 병렬 로딩 (4.2.0+)

4.2.0 버전부터는 여러 지연 로딩 모듈이 각각의 코루틴에서 **병렬로** 로드됩니다:

```kotlin
val module1 = lazyModule { single<DatabaseService>() }
val module2 = lazyModule { single<NetworkService>() }
val module3 = lazyModule { single<AnalyticsService>() }

startKoin {
    // 세 모듈이 동시에 로드됩니다!
    lazyModules(module1, module2, module3)
}
```

**성능 영향:**

| 시나리오 | 4.2.0 이전 (순차적) | 4.2.0 이후 (병렬) |
|----------|--------------------------|------------------------|
| 모듈 1개 @ 100ms | 100ms | 100ms |
| 모듈 3개 @ 각 100ms | 300ms | ~100ms |
| 모듈 10개 @ 각 100ms | 1000ms | ~100ms |

### 완료 대기하기

#### 모든 플랫폼: `waitAllStartJobs()`

```kotlin
startKoin {
    lazyModules(module1, module2, module3)
}

val koin = KoinPlatform.getKoin()

// 모든 지연 로딩 모듈이 로드될 때까지 블로킹
koin.waitAllStartJobs()

// 이제 지연 로딩 모듈의 의존성을 안전하게 사용 가능
val service = koin.get<AnalyticsService>()
```

**플랫폼 동작:**
- **JVM/Native**: `runBlocking`을 사용한 실제 블로킹
- **JS**: `GlobalScope.promise` 사용 (실제로 블로킹되지 않으며, 경고 로그 출력)

#### JVM 전용: `runOnKoinStarted()`

```kotlin
startKoin {
    lazyModules(analyticsModule)
}

// JVM 전용 콜백
KoinPlatform.getKoin().runOnKoinStarted { koin ->
    // 모든 지연 로딩 모듈 로드가 완료된 후 실행
    koin.get<AnalyticsService>().trackAppStart()
}
```

#### 중단(Suspending) 대안: `awaitAllStartJobs()`

코루틴 컨텍스트 또는 블로킹을 지원하지 않는 플랫폼의 경우:

```kotlin
suspend fun initializeApp() {
    startKoin {
        lazyModules(module1, module2)
    }

    // 블로킹 없이 대기
    KoinPlatform.getKoin().awaitAllStartJobs()

    // 진행 가능
    println("All modules loaded!")
}
```

## 커스텀 디스패처

지연 로딩 모듈 로드를 실행할 디스패처를 제어합니다:

```kotlin
import kotlinx.coroutines.Dispatchers

startKoin {
    // Default 대신 IO 디스패처에서 로드
    lazyModules(
        databaseModule,
        networkModule,
        dispatcher = Dispatchers.IO
    )
}
```

**일반적인 디스패처 선택지:**
- `Dispatchers.Default` - CPU 집약적 작업 (기본값)
- `Dispatchers.IO` - I/O 작업, 파일 접근, 네트워크
- `Dispatchers.Main` - UI 업데이트 (Android/Desktop)

:::info
지정하지 않을 경우 기본 디스패처는 `Dispatchers.Default`입니다.
:::

## 실제 사용 예시

```kotlin
// 코어 모듈 - 즉시 로드
val coreModule = module {
    single<AppConfig>()
    single<UserSession>()
}

// 기능 모듈 - 백그라운드에서 로드
val analyticsModule = lazyModule {
    single<AnalyticsEngine>()
    single<EventTracker>()
}

val networkingModule = lazyModule {
    single<ApiClient>()
    single<WebSocketManager>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}

// Android Application
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApp)

            // 필수 모듈은 즉시 로드
            modules(coreModule)

            // 필수적이지 않은 모듈은 백그라운드에서 병렬로 로드
            lazyModules(
                analyticsModule,
                networkingModule,
                databaseModule,
                dispatcher = Dispatchers.IO
            )
        }

        // 선택 사항: 백그라운드 로딩이 완료될 때까지 대기
        lifecycleScope.launch {
            KoinPlatform.getKoin().awaitAllStartJobs()
            Log.d("Koin", "All modules loaded!")
        }
    }
}
```

## 중요한 제한 사항

### 교차 의존성 피하기

지연 로딩 모듈과 일반 모듈은 서로 독립적이어야 합니다. 일반 모듈에서 지연 로딩 모듈로의 의존성을 만들지 마세요:

```kotlin
// ❌ 나쁜 예 - mainModule이 지연 로딩 모듈에 의존함
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController(get<AnalyticsService>()) }  // 실패할 수 있음!
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

```kotlin
// ✅ 좋은 예 - 의존성을 분리 유지
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController() }
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

:::warning
Koin은 현재 일반 모듈과 지연 로딩 모듈 간의 의존성을 검증하지 않습니다. 일반 모듈이 지연 로딩 모듈 정의에 의존하지 않도록 주의하세요.
:::

### 모범 사례: 로드 순서

1. **즉시 로드할 모듈** - 시작 시 필요한 필수 서비스
2. **지연 로딩 모듈** - 중요하지 않거나 지연 가능한 서비스
3. **필요한 경우 대기** - 지연 로딩 정의에 접근하기 전에 `waitAllStartJobs()` 사용

## 지연 로딩 모듈을 사용해야 하는 경우

### 좋은 사용 사례

- **분석/트래킹** - 핵심 기능에 필요하지 않음
- **크래시 리포팅** - 백그라운드에서 초기화 가능
- **기능 모듈** - 필요에 따라 로드되는 모듈화된 기능들
- **데이터베이스/네트워크** - 지연 가능한 무거운 초기화 작업
- **대규모 앱** - 시작 부하를 여러 스레드로 분산

### 권장하지 않는 경우

- **코어 서비스** - 즉시 필요한 핵심 의존성
- **소규모 앱** - 오버헤드가 이점보다 클 수 있음
- **밀접하게 결합된 모듈** - 모듈 간에 많은 교차 의존성이 있는 경우

## API 레퍼런스

| 함수 | 플랫폼 | 설명 |
|----------|----------|-------------|
| `lazyModules()` | 전체 | 백그라운드에서 지연 로딩 모듈 로드 |
| `waitAllStartJobs()` | 전체 | 모든 지연 로딩 모듈이 로드될 때까지 블로킹 |
| `awaitAllStartJobs()` | 전체 | 모든 지연 로딩 모듈이 로드될 때까지 중단(Suspend) |
| `runOnKoinStarted()` | JVM 전용 | 로딩 완료 후 실행되는 콜백 |

## 관련 항목

- **[Modules](/docs/reference/koin-core/modules)** - `includes()`를 사용한 모듈 구성
- **[Definitions](/docs/reference/koin-core/definitions)** - Eager(즉시) vs Lazy(지연) 싱글톤
- **[Starting Koin](/docs/reference/koin-core/starting-koin)** - Koin 시작 설정