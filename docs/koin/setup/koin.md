---
title: Koin
---

在项目中配置 Koin 所需的一切

## 当前版本

您可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有 Koin 软件包。

以下是当前可用的 Koin 版本：

- Koin 稳定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 最新版本 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

## Koin BOM (推荐)

:::info
**最佳做法**：使用 Koin 物料清单 (BOM) 来一致地管理所有 Koin 库版本。这是所有项目的推荐方法。
:::

Koin 物料清单 (BOM) 允许您通过仅指定 BOM 的版本来管理所有 Koin 库版本。BOM 本身包含指向不同 Koin 库稳定版本的链接，从而确保它们可以很好地协同工作。在应用程序中使用 BOM 时，您不需要在 Koin 库依赖项本身中添加任何版本。当您更新 BOM 版本时，您正在使用的所有库都会自动更新到其新版本。

### 将 BOM 与版本目录配合使用 (推荐)

在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin-bom = "4.1.1"  # 稳定版本

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
    // 添加其他不带版本的 Koin 依赖项
}
```

### 在不使用版本目录的情况下使用 BOM

```kotlin
dependencies {
    // 声明 koin-bom 版本
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 声明不带版本的 koin 依赖项
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")

    // 如果您需要为特定依赖项指定不同的版本
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")

    // 同样适用于测试库！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```

## 平台特定设置

### Kotlin

将 Koin BOM 和 `koin-core` 依赖项添加到您的应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

或者指定确切的依赖项版本（不推荐）：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

您现在可以启动 Koin 了：

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

如果您需要测试功能：

```kotlin
dependencies {
    // Koin 测试功能
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // 适用于 JUnit 4 的 Koin
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // 适用于 JUnit 5 的 Koin
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
**后续步骤**：继续阅读 [Kotlin 应用教程](/docs/quickstart/kotlin) 或探索 [核心功能](/docs/reference/koin-core/dsl)。
:::

### Android

将 `koin-android` 依赖项添加到您的 Android 应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

您现在可以在 `Application` 类中启动 Koin 了：

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

如果您需要额外功能，请添加以下软件包：

```kotlin
dependencies {
    // Java 兼容性
    implementation("io.insert-koin:koin-android-compat")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")
    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")
    // App Startup - 使用 AndroidX Startup 启动 Koin
    implementation("io.insert-koin:koin-androidx-startup")
}
```

:::info
**后续步骤**：继续阅读 [Android 应用教程](/docs/quickstart/android-viewmodel) 或参阅 [在 Android 上启动 Koin](/docs/reference/koin-android/start) 以了解详细集成信息。
:::

### Jetpack Compose 或 Compose Multiplatform

对于 **Compose Multiplatform** (Android, iOS, Desktop, Web)，添加以下依赖项：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

对于 **原生 Android Jetpack Compose**，您可以使用：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-androidx-compose")
    implementation("io.insert-koin:koin-androidx-compose-navigation")
}
```

对于 **Navigation 3 集成** (实验性)：

```kotlin
dependencies {
    // Navigation 3 支持 (alpha)
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::warning
Navigation 3 处于 alpha 阶段。有关详情，请参阅 [Navigation 3 集成](/docs/reference/koin-compose/navigation3)。
:::

:::info
**后续步骤**：继续阅读 [Compose 教程](/docs/quickstart/android-compose) 或参阅 [Koin Compose](/docs/reference/koin-compose/compose) 以了解详细集成信息。
:::

### Kotlin Multiplatform

在您的 `shared/build.gradle.kts` 中，将 `koin-core` 依赖项添加到 commonMain：

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
**后续步骤**：参阅 [结合使用 Kotlin Multiplatform 与 Koin](/docs/reference/koin-mp/kmp) 以了解特定于平台的设置、expect/actual 模式以及架构指南。
:::

### Ktor

将 `koin-ktor` 依赖项添加到您的 Ktor 应用程序：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    // 适用于 Ktor 的 Koin
    implementation("io.insert-koin:koin-ktor")
    // SLF4J 日志记录器
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

您现在可以在 Ktor 应用程序中安装 Koin 功能：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
**后续步骤**：继续阅读 [Ktor 应用教程](/docs/quickstart/ktor) 或参阅 [Ktor 集成](/docs/reference/koin-ktor/ktor) 以了解详细设置。
:::

## 替代方案：直接指定版本

如果您不想使用 BOM，可以直接为每个依赖项指定版本：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-compose:$koin_version")
}
```

:::note
此方法要求手动使所有 Koin 依赖项同步到兼容版本。**强烈建议使用 BOM** 以避免版本冲突。
:::