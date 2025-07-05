---
title: Koin
---

在你的项目中设置 Koin 所需的一切

## 当前版本

你可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有 Koin 包。

以下是当前可用的 Koin 版本：

- Koin 稳定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 非稳定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 配置

### Kotlin

从 3.5.0 版本开始，你可以使用 BOM (Bill of Materials) 来管理所有 Koin 库的版本。当你在应用中使用 BOM 时，你无需为 Koin 库依赖项本身指定版本。当你更新 BOM 版本时，所有你正在使用的库都会自动更新到它们的新版本。

将 `koin-bom` BOM 和 `koin-core` 依赖项添加到你的应用程序中：
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
如果你正在使用版本目录 (version catalogs)：
```toml
[versions]
koin-bom = "x.x.x"
...

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
...
```
```kotlin
dependencies {
    implementation(project.dependencies.platform(libs.koin.bom))
    implementation(libs.koin.core)
}
```

或者使用旧的方式来指定 Koin 的精确依赖版本：
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

现在你可以启动 Koin 了：

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

如果你需要测试能力：

```groovy
dependencies {
    // Koin Test features
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // Koin for JUnit 4
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // Koin for JUnit 5
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
现在你可以继续学习 Koin 教程，了解如何使用 Koin：[Kotlin 应用教程](/docs/quickstart/kotlin)
:::

### **Android**

将 `koin-android` 依赖项添加到你的 Android 应用程序中：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

现在你可以在 `Application` 类中启动 Koin 了：

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        startKoin {
            modules(appModule)
        }
    }
}
```

如果你需要额外功能，请添加以下所需包：

```groovy
dependencies {
    // Java Compatibility
    implementation("io.insert-koin:koin-android-compat:$koin_android_version")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager:$koin_android_version")
    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation:$koin_android_version")
    // App Startup
    implementation("io.insert-koin:koin-androidx-startup:$koin_android_version")
}
```

:::info
现在你可以继续学习 Koin 教程，了解如何使用 Koin：[Android 应用教程](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 或 Compose 多平台**

将 `koin-compose` 依赖项添加到你的多平台应用程序中，以便使用 Koin 和 Compose API：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

如果你使用的是纯 Android Jetpack Compose，你可以使用：

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin 多平台**

将 `koin-core` 依赖项添加到你的多平台应用程序中，用于共享 Kotlin 部分：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
现在你可以继续学习 Koin 教程，了解如何使用 Koin：[Kotlin 多平台应用教程](/docs/quickstart/kmp)
:::

### **Ktor**

将 `koin-ktor` 依赖项添加到你的 Ktor 应用程序中：

```groovy
dependencies {
    // Koin for Ktor 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

现在你可以将 Koin 功能安装到你的 Ktor 应用程序中：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
现在你可以继续学习 Koin 教程，了解如何使用 Koin：[Ktor 应用教程](/docs/quickstart/ktor)
:::

### **Koin BOM (Bill of Materials)**
Koin 物料清单 (BOM) 允许你仅通过指定 BOM 的版本来管理所有 Koin 库的版本。BOM 本身包含不同 Koin 库稳定版本的链接，确保它们能够良好协同工作。当你在应用中使用 BOM 时，你无需为 Koin 库依赖项本身添加任何版本。当你更新 BOM 版本时，所有你正在使用的库都会自动更新到它们的新版本。

```groovy
dependencies {
    // Declare koin-bom version
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // Declare the koin dependencies that you need
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // If you need specify some version it's just point to desired version
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // Works with test libraries too!
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```