---
title: Koin 시작하기 레퍼런스
---

Koin 시작을 위한 빠른 참조 가이드입니다. 자세한 가이드는 **[Core - Koin 시작하기](/docs/reference/koin-core/starting-koin)**를 참조하세요.

## 시작 메서드

| 메서드 | 사용 사례 |
|--------|----------|
| `startKoin { }` | 표준 앱 - GlobalContext에 등록 |
| `koinApplication { }` | 테스트, SDK - 격리된 인스턴스 |
| `koinConfiguration { }` | Compose, Ktor를 위한 설정 |
| `startKoin<T>()` | 컴파일러 플러그인을 사용한 타입 기반 시작 |

## 기본 시작

```kotlin
startKoin {
    modules(appModule)
}
```

## 전체 설정

```kotlin
startKoin {
    logger(Level.INFO)
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))
    modules(coreModule, networkModule)
    lazyModules(analyticsModule)
    createEagerInstances()
    allowOverride(false)
}
```

## 설정 옵션

| 옵션 | 설명 |
|--------|-------------|
| `logger()` | 로깅 수준 및 구현체 설정 |
| `modules()` | 모듈을 즉시 로드 |
| `lazyModules()` | 백그라운드에서 모듈 로드 |
| `properties()` | 맵(map)에서 프로퍼티 로드 |
| `fileProperties()` | koin.properties 파일에서 로드 |
| `environmentProperties()` | 시스템/환경 변수에서 로드 |
| `createEagerInstances()` | 모든 `createdAtStart` 싱글톤 생성 |
| `allowOverride()` | 정의(definition) 오버라이딩 활성화/비활성화 |

## 타입 기반 시작 (컴파일러 플러그인)

[Koin 컴파일러 플러그인](/docs/setup/compiler-plugin) 및 `@KoinApplication`이 필요합니다:

```kotlin
@KoinApplication
class MyApp

// 시작
startKoin<MyApp>()

// 설정 포함
startKoin<MyApp> {
    printLogger()
}
```

## 동적 모듈 관리

```kotlin
// 시작 후 로드
loadKoinModules(featureModule)

// 언로드
unloadKoinModules(featureModule)
```

## Koin 중지

```kotlin
stopKoin()  // 전역 인스턴스 중지

// 격리된 인스턴스
koinApp.close()
```

## 로깅

| 로거 | 플랫폼 | 설명 |
|--------|----------|-------------|
| `EmptyLogger` | 전체 | 로깅 없음 (기본값) |
| `PrintLogger` | 전체 | 콘솔 출력 |
| `AndroidLogger` | Android | Logcat 출력 |
| `SLF4JLogger` | JVM | SLF4J 사용 |

```kotlin
startKoin {
    logger(Level.DEBUG)  // Android의 경우 androidLogger() 사용 가능
}
```

## 프로퍼티

```kotlin
startKoin {
    environmentProperties()
    fileProperties()  // koin.properties
    properties(mapOf("key" to "value"))
}

// 모듈 내에서
single {
    ApiClient(url = getProperty("server_url"))
}
```

## 플랫폼별 예시

### Android

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

### Compose

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

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 참고 항목

- **[Core - Koin 시작하기](/docs/reference/koin-core/starting-koin)** - 전체 가이드
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - 백그라운드 로딩
- **[KoinComponent](/docs/reference/koin-core/koin-component)** - 인스턴스 검색 (Retrieving instances)