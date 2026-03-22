---
title: Gradle 设置
---

# Gradle 设置

本指南介绍如何向 Gradle 项目中添加 Koin 依赖项。

## Koin BOM (推荐)

**物料清单 (BOM)** 是管理 Koin 依赖项的推荐方式。它能确保所有 Koin 库使用兼容的版本。

:::info
**最佳实践**：始终使用 Koin BOM，以避免 Koin 库之间的版本冲突。
:::

### 使用版本目录 (推荐)

在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin-bom = "4.2.0"

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-android = { module = "io.insert-koin:koin-android" }
koin-compose = { module = "io.insert-koin:koin-compose" }
koin-compose-viewmodel = { module = "io.insert-koin:koin-compose-viewmodel" }
koin-ktor = { module = "io.insert-koin:koin-ktor" }
koin-test = { module = "io.insert-koin:koin-test" }
```

在您的 `build.gradle.kts` 中：

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.android)  // 无需指定版本
}
```

### 直接使用 BOM

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 添加依赖项，无需指定版本
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")  // 适用于 Android 和多平台
}
```

## 特定平台设置

### Kotlin/JVM {#kotlin}

对于纯 Kotlin 应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

在您的应用程序中启动 Koin：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }
}
```

**测试依赖项：**

```kotlin
dependencies {
    testImplementation("io.insert-koin:koin-test")
    testImplementation("io.insert-koin:koin-test-junit5")  // 或 junit4
}
```

### Android {#android}

对于 Android 应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

在您的 Application 类中启动 Koin：

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

**可选的 Android 软件包：**

```kotlin
dependencies {
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")

    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")

    // AndroidX Startup
    implementation("io.insert-koin:koin-androidx-startup")

    // Java 兼容性
    implementation("io.insert-koin:koin-android-compat")
}
```

### 结合 Jetpack Compose 的 Android {#compose-android}

对于使用 Jetpack Compose 的 Android 应用：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
}
```

**配合 Navigation：**

```kotlin
dependencies {
    // Navigation 2 (仅限 Android)
    implementation("io.insert-koin:koin-androidx-compose-navigation")

    // 或 Navigation 3
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::info
`koin-androidx-compose` 现在已被 `koin-compose` 取代
:::

### Compose 多平台 {#compose}

对于 Compose 多平台项目 (Android, iOS, Desktop, Web)：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

:::info
`koin-compose` 自动包含 Android 支持。在 Compose 多平台项目中无需单独添加 `koin-android`。
:::

### Kotlin 多平台 {#kotlin-multiplatform}

在您的共享模块的 `build.gradle.kts` 中：

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:$koin_version"))
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

### Ktor {#ktor}

对于 Ktor 服务器应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

在您的 Ktor 应用程序中安装 Koin：

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 所有可用软件包

当前最新版本为：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

| 软件包 | 描述 |
|---------|-------------|
| `koin-core` | Koin 核心库 |
| `koin-core-coroutines` | 协程支持 |
| `koin-android` | Android 支持 |
| `koin-android-compat` | Android 的 Java 兼容性 |
| `koin-androidx-navigation` | Navigation Component 支持 |
| `koin-androidx-workmanager` | WorkManager 支持 |
| `koin-androidx-startup` | AndroidX Startup 支持 |
| `koin-compose` | Compose (Android 和多平台) |
| `koin-compose-viewmodel` | Compose 的 ViewModel |
| `koin-compose-viewmodel-navigation` | Compose 多平台项目的 Navigation + ViewModel |
| `koin-androidx-compose` | ⚠️ 已取代 - 请改用 `koin-compose` |
| `koin-androidx-compose-navigation` | Android 的 Navigation 2 (不兼容 KMP) |
| `koin-compose-navigation3` | Navigation 3 |
| `koin-ktor` | Ktor 服务器支持 |
| `koin-logger-slf4j` | SLF4J 日志记录 |
| `koin-test` | 测试实用程序 |
| `koin-test-junit4` | JUnit 4 支持 |
| `koin-test-junit5` | JUnit 5 支持 |
| `koin-android-test` | Android 仪表化测试 |

## 直接指定版本

如果您不想使用 BOM：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

:::note
这种方法需要手动保持所有依赖项同步。**强烈建议使用 BOM。**
:::

## 后续步骤

- **[编译器插件设置](/docs/setup/compiler-plugin)** - 添加编译时安全性
- **[启动 Koin](/docs/reference/koin-core/starting-koin)** - 配置您的应用程序
- **[教程](/docs/quickstart/kotlin)** - 构建您的第一个应用