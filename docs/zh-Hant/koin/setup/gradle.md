---
title: Gradle 設定
---

# Gradle 設定

本指南涵蓋如何將 Koin 相依性新增到您的 Gradle 專案中。

## Koin BOM (建議使用)

**物料清單 (BOM)** 是管理 Koin 相依性的建議方式。它能確保所有 Koin 程式庫都使用相容的版本。

:::info
**最佳實務**：請務必使用 Koin BOM 以避免 Koin 程式庫之間的版本衝突。
:::

### 使用版本目錄 (建議使用)

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
    implementation(libs.koin.android)  // 不需要版本
}
```

### 直接使用 BOM

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 新增不含版本的相依性
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")  // 適用於 Android 與多平台
}
```

## 特定平台設定

### Kotlin/JVM {#kotlin}

對於純 Kotlin 應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

在您的應用程式中啟動 Koin：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }
}
```

**測試相依性：**

```kotlin
dependencies {
    testImplementation("io.insert-koin:koin-test")
    testImplementation("io.insert-koin:koin-test-junit5")  // 或 junit4
}
```

### Android {#android}

對於 Android 應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

在您的 Application 類別中啟動 Koin：

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

**選用的 Android 套件：**

```kotlin
dependencies {
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")

    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")

    // AndroidX Startup
    implementation("io.insert-koin:koin-androidx-startup")

    // Java 相容性
    implementation("io.insert-koin:koin-android-compat")
}
```

### Android 搭配 Jetpack Compose {#compose-android}

對於使用 Jetpack Compose 的 Android 應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
}
```

**搭配 Navigation：**

```kotlin
dependencies {
    // Navigation 2 (僅限 Android)
    implementation("io.insert-koin:koin-androidx-compose-navigation")

    // 或 Navigation 3
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::info
`koin-androidx-compose` 現在已包含在 `koin-compose` 中
:::

### Compose Multiplatform {#compose}

對於 Compose Multiplatform 專案 (Android, iOS, Desktop, Web)：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

:::info
`koin-compose` 已自動包含 Android 支援。在 Compose Multiplatform 專案中不需要額外加入 `koin-android`。
:::

### Kotlin Multiplatform {#kotlin-multiplatform}

在共用模組的 `build.gradle.kts` 中：

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

對於 Ktor 伺服器應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

在您的 Ktor 應用程式中安裝 Koin：

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 所有可用套件

目前最新版本為：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

| 套件 | 說明 |
|---------|-------------|
| `koin-core` | Koin 核心程式庫 |
| `koin-core-coroutines` | Coroutines 支援 |
| `koin-android` | Android 支援 |
| `koin-android-compat` | Android 的 Java 相容性 |
| `koin-androidx-navigation` | Navigation Component 支援 |
| `koin-androidx-workmanager` | WorkManager 支援 |
| `koin-androidx-startup` | AndroidX Startup 支援 |
| `koin-compose` | Compose (Android 與多平台) |
| `koin-compose-viewmodel` | Compose 的 ViewModel |
| `koin-compose-viewmodel-navigation` | Compose MP 的 Navigation + ViewModel |
| `koin-androidx-compose` | ⚠️ 已取代 - 請改用 `koin-compose` |
| `koin-androidx-compose-navigation` | Android 的 Navigation 2 (不相容於 KMP) |
| `koin-compose-navigation3` | Navigation 3 |
| `koin-ktor` | Ktor 伺服器支援 |
| `koin-logger-slf4j` | SLF4J 記錄 |
| `koin-test` | 測試工具 |
| `koin-test-junit4` | JUnit 4 支援 |
| `koin-test-junit5` | JUnit 5 支援 |
| `koin-android-test` | Android 檢測測試 |

## 直接指定版本

如果您偏好不使用 BOM：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

:::note
此方法需要手動保持所有相依性同步。**強烈建議使用 BOM。**
:::

## 後續步驟

- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** - 加入編譯期安全性
- **[啟動 Koin](/docs/reference/koin-core/starting-koin)** - 設定您的應用程式
- **[教學](/docs/quickstart/kotlin)** - 打造您的第一個應用程式