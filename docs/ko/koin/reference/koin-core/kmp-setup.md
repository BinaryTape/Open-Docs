---
title: Kotlin Multiplatform 설정
---

# Kotlin Multiplatform 설정

Koin은 Kotlin Multiplatform (KMP) 프로젝트를 위한 퍼스트 클래스(first-class) 지원을 제공합니다. 이 가이드는 설정 및 구성에 대해 다룹니다.

:::info
정의 유형(Single, Factory, ViewModel) 및 세 가지 선언 방식(컴파일러 플러그인 DSL, 애노테이션, 클래식 DSL)에 대해서는 [정의](/docs/reference/koin-core/definitions)를 참조하세요.
:::

## 지원 플랫폼

| 플랫폼 | 상태 |
|----------|--------|
| Android | ✅ 전체 지원 |
| iOS (arm64, x64, simulatorArm64) | ✅ 전체 지원 |
| JVM | ✅ 전체 지원 |
| JS | ✅ 전체 지원 |
| Wasm | ✅ 전체 지원 |
| macOS | ✅ 전체 지원 |
| Linux | ✅ 전체 지원 |
| Windows | ✅ 전체 지원 |

## 의존성 설정

### shared/build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform")
    id("io.insert-koin.compiler.plugin")  // 선택 사항: 컴파일러 플러그인용
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    jvm()
    js(IR) { browser() }

    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:4.2.0"))
            implementation("io.insert-koin:koin-core")
        }

        commonTest.dependencies {
            implementation("io.insert-koin:koin-test")
        }

        androidMain.dependencies {
            implementation("io.insert-koin:koin-android")
        }
    }
}
```

### Compose Multiplatform과 함께 사용 시

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:4.2.0"))
            implementation("io.insert-koin:koin-core")
            implementation("io.insert-koin:koin-compose")
            implementation("io.insert-koin:koin-compose-viewmodel")
        }
    }
}
```

## 프로젝트 구조

```
project/
├── shared/
│   ├── src/
│   │   ├── commonMain/
│   │   │   └── kotlin/
│   │   │       ├── di/
│   │   │       │   └── KoinModules.kt
│   │   │       └── domain/
│   │   │           └── UserRepository.kt
│   │   ├── androidMain/
│   │   │   └── kotlin/
│   │   │       └── di/
│   │   │           └── PlatformModule.android.kt
│   │   └── iosMain/
│   │       └── kotlin/
│   │           └── di/
│   │               └── PlatformModule.ios.kt
│   └── build.gradle.kts
├── androidApp/
│   └── src/main/kotlin/
│       └── MainApplication.kt
└── iosApp/
    └── iOSApp.swift
```

## 공통 모듈 정의

### commonMain/kotlin/di/KoinModules.kt

```kotlin
import org.koin.dsl.module

// 공유 정의 (컴파일러 플러그인 DSL)
val sharedModule = module {
    single<UserRepository>()
    single<ApiClient>()
    factory<GetUserUseCase>()
}

// 플랫폼별 모듈 (플랫폼별로 정의됨)
expect val platformModule: Module
```

:::note
공유 모듈에는 컴파일러 플러그인 DSL(`single<Type>()`)을 사용하는 것이 권장됩니다. 컴파일러 플러그인이 필요하지만, 플랫폼별 KSP 설정 없이 가장 깔끔한 구문을 제공합니다.
:::

## 플랫폼별 모듈

플랫폼 모듈은 어떤 방식이든 사용할 수 있습니다. 여기서는 커스텀 생성 로직이 필요한 경우를 위해 람다를 사용하는 클래식 DSL을 예로 들어 보여줍니다.

### androidMain/kotlin/di/PlatformModule.android.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 커스텀 생성을 위한 람다 기반의 클래식 DSL
    single<PlatformHelper> { AndroidPlatformHelper(get()) }
    single<DatabaseDriver> { AndroidDatabaseDriver(get()) }
}
```

### iosMain/kotlin/di/PlatformModule.ios.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 커스텀 로직이 필요 없는 경우 컴파일러 플러그인 DSL / 애노테이션 사용 가능
    single<IosPlatformHelper>() bind PlatformHelper::class
    single<IosDatabaseDriver>() bind DatabaseDriver::class
}
```

## 공유 초기화

### commonMain/kotlin/di/KoinInit.kt

```kotlin
import org.koin.core.context.startKoin
import org.koin.core.KoinApplication

fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)
        modules(
            sharedModule,
            platformModule
        )
    }
}
```

## 플랫폼 진입점

### Android

```kotlin
// androidApp/src/main/kotlin/MainApplication.kt
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### iOS

```kotlin
// shared/src/iosMain/kotlin/di/KoinInitIos.kt
fun initKoinIos() {
    initKoin()
}
```

```swift
// iosApp/iOSApp.swift
import shared

@main
struct iOSApp: App {
    init() {
        KoinInitIosKt.initKoinIos()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### JVM

```kotlin
fun main() {
    initKoin {
        printLogger()
    }

    val repository: UserRepository = get()
}
```

## KMP에서의 DSL 방식

| 방식 | 사용 시기 |
|----------|-------------|
| **컴파일러 플러그인 DSL** | 기본 권장 사항 - 모든 곳에서 작동하며, 가장 깔끔한 구문 제공 |
| **애노테이션** | 기본 권장 사항 - 모든 곳에서 작동하며, 별도의 모듈 코드가 필요 없음 |
| **람다 기반 클래식 DSL** | 빌더 패턴, 커스텀 팩토리 로직, 모의 객체(mocks)가 필요한 경우 |

:::info
**컴파일러 플러그인 DSL**과 **애노테이션**은 모든 환경에서 작동합니다. 커스텀 생성 로직이 필요한 경우에만 **람다 기반 클래식 DSL**을 사용하세요. 자세한 내용은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.
:::

## 권장 사항

1. **공유 코드를 commonMain에 배치하세요** - 비즈니스 로직, 리포지토리, 유스케이스 등
2. **플랫폼별 사양에는 expect/actual을 사용하세요** - 파일 시스템, 장치 API, 플랫폼 라이브러리 등
3. **플랫폼별로 Koin을 초기화하세요** - 각 플랫폼에는 고유한 진입점이 있습니다.
4. **플랫폼 모듈을 최소한으로 유지하세요** - 진정으로 플랫폼에 특화된 내용만 포함하세요.

## 다음 단계

- **[공유 패턴](/docs/reference/koin-core/kmp-shared-modules)** - 모듈 구성, expect/actual 패턴
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 멀티플랫폼 ViewModel
- **[고급 패턴](/docs/reference/koin-mp/kmp)** - 아키텍처 패턴, 테스트, 플랫폼 통합
- **[테스팅](/docs/reference/koin-test/testing)** - KMP 프로젝트 테스트하기