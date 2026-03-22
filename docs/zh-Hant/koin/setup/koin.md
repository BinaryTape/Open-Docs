---
title: Koin
---

在專案中設定 Koin 所需的一切

## 目前版本

您可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有的 Koin 軟件包。

以下是目前可用的 Koin 版本：

- Koin 穩定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 最新版本 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

## Koin BOM (推薦)

:::info
**最佳實務**：使用 Koin 產品清單 (BOM) 來一致地管理所有 Koin 程式庫版本。這是所有專案推薦的做法。
:::

Koin 產品清單 (BOM) 讓您只需指定 BOM 的版本，即可管理所有的 Koin 程式庫版本。BOM 本身包含了不同 Koin 程式庫穩定版本的連結，並確保它們能良好地協作。在應用程式中使用 BOM 時，您不需要在 Koin 程式庫相依性本身新增任何版本。當您更新 BOM 版本時，您正在使用的所有庫都會自動更新至其新版本。

### 搭配版本目錄使用 BOM (推薦)

在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin-bom = "4.1.1"  # 穩定版本

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-android = { module = "io.insert-koin:koin-android" }
koin-androidx-compose = { module = "io.insert-koin:koin-androidx-compose" }
koin-compose = { module = "io.insert-koin:koin-compose" }
koin-compose-viewmodel = { module = "io.insert-koin:koin-compose-viewmodel" }
koin-ktor = { module = "io.insert-koin:koin-ktor" }
koin-test = { module = "io.insert-koin:koin-test" }
```

在您的 `build.gradle.kts` 中：

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.core)
    // 新增其他不含版本的 Koin 相依性
}
```

### 不使用版本目錄的情況下使用 BOM

```kotlin
dependencies {
    // 宣告 koin-bom 版本
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 宣告不含版本的 koin 相依性
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")

    // 如果您需要為特定相依性指定不同的版本
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")

    // 同樣適用於測試程式庫！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```

## 特定平台設定

### Kotlin

將 Koin BOM 與 `koin-core` 相依性新增至您的應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

或指定確切的相依性版本（不推薦）：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

您現在已準備好啟動 Koin：

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

如果您需要測試功能：

```kotlin
dependencies {
    // Koin 測試功能
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // 適用於 JUnit 4 的 Koin
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // 適用於 JUnit 5 的 Koin
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
**後續步驟**：繼續閱讀 [Kotlin 應用程式教學](/docs/quickstart/kotlin) 或探索 [核心功能](/docs/reference/koin-core/dsl)。
:::

### Android

將 `koin-android` 相依性新增至您的 Android 應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

您現在已準備好在您的 `Application` 類別中啟動 Koin：

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

如果您需要額外功能，請新增以下軟件包：

```kotlin
dependencies {
    // Java 相容性
    implementation("io.insert-koin:koin-android-compat")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")
    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")
    // App Startup - 使用 AndroidX Startup 啟動 Koin
    implementation("io.insert-koin:koin-androidx-startup")
}
```

:::info
**後續步驟**：繼續閱讀 [Android 應用程式教學](/docs/quickstart/android-viewmodel) 或參閱 [在 Android 上啟動 Koin](/docs/reference/koin-android/start) 以了解詳細的整合方式。
:::

### Jetpack Compose 或 Compose Multiplatform

針對 **Compose Multiplatform** (Android, iOS, Desktop, Web)，請新增這些相依性：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

如果您使用的是**純 Android Jetpack Compose**，可以使用：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-androidx-compose")
    implementation("io.insert-koin:koin-androidx-compose-navigation")
}
```

針對 **Navigation 3 整合**（實驗性）：

```kotlin
dependencies {
    // Navigation 3 支援 (alpha)
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::warning
Navigation 3 處於 alpha 階段。詳情請參閱 [Navigation 3 整合](/docs/reference/koin-compose/navigation3)。
:::

:::info
**後續步驟**：繼續閱讀 [Compose 教學](/docs/quickstart/android-compose) 或參閱 [Koin Compose](/docs/reference/koin-compose/compose) 以了解詳細的整合方式。
:::

### Kotlin Multiplatform

在您的 `shared/build.gradle.kts` 中，將 `koin-core` 相依性新增至 commonMain：

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
    }
}
```

:::info
**後續步驟**：參閱 [搭配 Koin 使用 Kotlin Multiplatform](/docs/reference/koin-mp/kmp) 以了解特定平台設定、expect/actual 模式及架構指南。
:::

### Ktor

將 `koin-ktor` 相依性新增至您的 Ktor 應用程式：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    // 適用於 Ktor 的 Koin
    implementation("io.insert-koin:koin-ktor")
    // SLF4J 記錄器
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

您現在已準備好將 Koin 功能安裝到您的 Ktor 應用程式中：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
**後續步驟**：繼續閱讀 [Ktor 應用程式教學](/docs/quickstart/ktor) 或參閱 [Ktor 整合](/docs/reference/koin-ktor/ktor) 以了解詳細設定。
:::

## 替代方案：直接指定版本

如果您偏好不使用 BOM，可以為每個相依性直接指定版本：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-compose:$koin_version")
}
```

:::note
此方法需要手動保持所有 Koin 相依性同步為相容的版本。**強烈建議使用 BOM** 以避免版本衝突。
:::