---
title: Kotlin Multiplatform 設定
---

# Kotlin Multiplatform 設定

Koin 為 Kotlin Multiplatform (KMP) 專案提供一等公民支援。本指南涵蓋了相關的設定與配置。

:::info
關於定義類型 (Single、Factory、ViewModel) 以及三種宣告方式 (編譯器外掛程式 DSL、註解、經典 DSL)，請參閱 [定義](/docs/reference/koin-core/definitions)。
:::

## 支援的平台

| 平台 | 狀態 |
|----------|--------|
| Android | ✅ 完全支援 |
| iOS (arm64, x64, simulatorArm64) | ✅ 完全支援 |
| JVM | ✅ 完全支援 |
| JS | ✅ 完全支援 |
| Wasm | ✅ 完全支援 |
| macOS | ✅ 完全支援 |
| Linux | ✅ 完全支援 |
| Windows | ✅ 完全支援 |

## 相依性設定

### shared/build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform")
    id("io.insert-koin.compiler.plugin")  // 選填：用於編譯器外掛程式
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

### 搭配 Compose Multiplatform

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

## 專案結構

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

## 共用模組定義

### commonMain/kotlin/di/KoinModules.kt

```kotlin
import org.koin.dsl.module

// 共用定義 (編譯器外掛程式 DSL)
val sharedModule = module {
    single<UserRepository>()
    single<ApiClient>()
    factory<GetUserUseCase>()
}

// 平台特定模組 (依平台定義)
expect val platformModule: Module
```

:::note
推薦在共用模組中使用編譯器外掛程式 DSL (`single<Type>()`)。它需要編譯器外掛程式，但能提供最簡潔的語法，且無需為每個平台進行 KSP 配置。
:::

## 平台特定模組

平台模組可以使用任何方式。此處展示了包含 Lambda 的經典 DSL，適用於需要自訂建構邏輯的情況。

### androidMain/kotlin/di/PlatformModule.android.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 包含 Lambda 的經典 DSL，用於自訂建構
    single<PlatformHelper> { AndroidPlatformHelper(get()) }
    single<DatabaseDriver> { AndroidDatabaseDriver(get()) }
}
```

### iosMain/kotlin/di/PlatformModule.ios.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 如果不需要自訂邏輯，也可以使用編譯器外掛程式 DSL 或註解
    single<IosPlatformHelper>() bind PlatformHelper::class
    single<IosDatabaseDriver>() bind DatabaseDriver::class
}
```

## 共用初始化

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

## 平台入口點

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

## KMP 中的 DSL 方式

| 方式 | 使用時機 |
|----------|-------------|
| **編譯器外掛程式 DSL** | 預設選擇 — 適用於所有地方，語法最簡潔 |
| **註解** | 預設選擇 — 適用於所有地方，無需模組程式碼 |
| **包含 Lambda 的經典 DSL** | 產生器模式、自訂工廠邏輯、Mock |

:::info
**編譯器外掛程式 DSL** 與 **註解** 適用於各處。僅在需要自訂建構邏輯時，才使用 **包含 Lambda 的經典 DSL**。詳情請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin)。
:::

## 最佳實務

1. **將共用程式碼放在 commonMain** — 商業邏輯、存儲庫 (Repository)、使用案例 (Use Case)
2. **針對平台特性使用 expect/actual** — 檔案系統、裝置 API、平台函式庫
3. **依平台初始化 Koin** — 每個平台都有其入口點
4. **保持平台模組極簡** — 僅保留真正與平台相關的內容

## 後續步驟

- **[共用模式](/docs/reference/koin-core/kmp-shared-modules)** — 模組組織、expect/actual 模式
- **[ViewModel](/docs/reference/koin-core/viewmodel)** — Multiplatform ViewModel
- **[進階模式](/docs/reference/koin-mp/kmp)** — 架構模式、測試、平台整合
- **[測試](/docs/reference/koin-test/testing)** — 測試 KMP 專案