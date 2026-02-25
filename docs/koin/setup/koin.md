---
title: Koin
---

在项目中配置 Koin 所需的一切

## 当前版本

您可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有 Koin 软件包。

以下是当前可用的 Koin 版本：

- Koin 稳定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 非稳定版本 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 设置

### Kotlin

从 3.5.0 版本开始，您可以使用 BOM 版本来管理所有 Koin 库版本。在应用程序中使用 BOM 时，您不需要在 Koin 库依赖项本身中添加任何版本。当您更新 BOM 版本时，您正在使用的所有库都会自动更新到其新版本。

将 `koin-bom` BOM 和 `koin-core` 依赖项添加到您的应用程序： 
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
如果您正在使用版本目录：
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

或者使用指定 Koin 确切依赖项版本的旧方法：
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

```groovy
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
现在您可以继续阅读 Koin 教程以了解如何使用 Koin：[Kotlin 应用教程](/docs/quickstart/kotlin)
:::

### **Android**

将 `koin-android` 依赖项添加到您的 Android 应用程序：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

您现在可以在 `Application` 类中启动 Koin 了：

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

如果您需要额外功能，请添加以下所需的软件包：

```groovy
dependencies {
    // Java 兼容性
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
现在您可以继续阅读 Koin 教程以了解如何使用 Koin：[Android 应用教程](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 或 Compose Multiplatform**

将 `koin-compose` 依赖项添加到您的多平台应用程序，以使用 Koin 和 Compose API：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

如果您使用的是原生的 Android Jetpack Compose，可以使用：

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

将 `koin-core` 依赖项添加到您的多平台应用程序，用于共享 Kotlin 部分：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
现在您可以继续阅读 Koin 教程以了解如何使用 Koin：[Kotlin 多平台应用教程](/docs/quickstart/kmp)
:::

### **Ktor**

将 `koin-ktor` 依赖项添加到您的 Ktor 应用程序：

```groovy
dependencies {
    // 适用于 Ktor 的 Koin 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J 日志记录器
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

您现在可以在您的 Ktor 应用程序中安装 Koin 功能：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
现在您可以继续阅读 Koin 教程以了解如何使用 Koin：[Ktor 应用教程](/docs/quickstart/ktor)
:::

### **Koin BOM**
Koin 物料清单 (BOM) 让您可以通过仅指定 BOM 版本来管理所有 Koin 库版本。BOM 本身包含指向不同 Koin 库稳定版本的链接，从而确保它们可以很好地协同工作。在应用程序中使用 BOM 时，您不需要在 Koin 库依赖项本身中添加任何版本。当您更新 BOM 版本时，您正在使用的所有库都会自动更新到其新版本。

```groovy
dependencies {
    // 声明 koin-bom 版本
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // 声明您需要的 koin 依赖项
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // 如果您需要指定某些版本，只需指向所需版本即可
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // 同样适用于测试库！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}