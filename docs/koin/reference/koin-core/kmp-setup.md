---
title: Kotlin 多平台设置
---

# Kotlin 多平台设置

Koin 为 Kotlin 多平台 (KMP) 项目提供一等支持。本指南涵盖了相关设置与配置。

:::info
关于定义类型（Single、Factory、ViewModel）和三种声明方式（编译器插件 DSL、注解、经典 DSL），请参阅 [定义](/docs/reference/koin-core/definitions)。
:::

## 支持的平台

| 平台 | 状态 |
|----------|--------|
| Android | ✅ 完全支持 |
| iOS (arm64, x64, simulatorArm64) | ✅ 完全支持 |
| JVM | ✅ 完全支持 |
| JS | ✅ 完全支持 |
| Wasm | ✅ 完全支持 |
| macOS | ✅ 完全支持 |
| Linux | ✅ 完全支持 |
| Windows | ✅ 完全支持 |

## 依赖项设置

### shared/build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform")
    id("io.insert-koin.compiler.plugin")  // 可选：用于编译器插件
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

### 配合 Compose 多平台使用

```kotlin {
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

## 项目结构

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

## 通用模块定义

### commonMain/kotlin/di/KoinModules.kt

```kotlin
import org.koin.dsl.module

// 共享定义 (编译器插件 DSL)
val sharedModule = module {
    single<UserRepository>()
    single<ApiClient>()
    factory<GetUserUseCase>()
}

// 平台特定模块 (在每个平台中定义)
expect val platformModule: Module
```

:::note
建议在共享模块中使用编译器插件 DSL (`single<Type>()`)。它需要编译器插件，但能提供最简洁的语法，且无需按平台进行 KSP 配置。
:::

## 平台特定模块

平台模块可以使用任何方式。此处展示了在需要自定义构建逻辑时使用的带 lambda 的经典 DSL。

### androidMain/kotlin/di/PlatformModule.android.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 带 lambda 的经典 DSL，用于自定义构建
    single<PlatformHelper> { AndroidPlatformHelper(get()) }
    single<DatabaseDriver> { AndroidDatabaseDriver(get()) }
}
```

### iosMain/kotlin/di/PlatformModule.ios.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // 如果不需要自定义逻辑，也可以使用编译器插件 DSL / 注解
    single<IosPlatformHelper>() bind PlatformHelper::class
    single<IosDatabaseDriver>() bind DatabaseDriver::class
}
```

## 共享初始化

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

## 平台入口点

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

| 方式 | 何时使用 |
|----------|-------------|
| **编译器插件 DSL** | 默认选择 - 适用于所有平台，语法最简洁 |
| **注解** | 默认选择 - 适用于所有平台，无需编写模块代码 |
| **带 lambda 的经典 DSL** | 构建器模式、自定义工厂逻辑、Mock |

:::info
**编译器插件 DSL** 和 **注解** 适用于所有平台。仅在需要自定义构建逻辑时才使用 **带 lambda 的经典 DSL**。详情请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
:::

## 最佳做法

1. **将共享代码放在 commonMain 中** - 业务逻辑、仓库、用例
2. **对平台特定内容使用 expect/actual** - 文件系统、设备 API、平台库
3. **按平台初始化 Koin** - 每个平台都有其入口点
4. **保持平台模块精简** - 仅保留真正属于平台特定的内容

## 后续步骤

- **[共享模式](/docs/reference/koin-core/kmp-shared-modules)** - 模块组织、expect/actual 模式
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel
- **[高级模式](/docs/reference/koin-mp/kmp)** - 架构模式、测试、平台集成
- **[测试](/docs/reference/koin-test/testing)** - 测试 KMP 项目