---
title: Koin
slug: /
---
在你的项目中设置 Koin 所需的一切

## 当前版本

你可以在 [maven central](https://search.maven.org/search?q=io.insert-koin) 上找到所有的 Koin 包。

以下是当前可用的版本：

| 项目                          |                                                                                                      版本                                                                                                       |
|----------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| koin-bom                         |                                   [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)                                   |
| koin-core                        |                                  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)                                  |
| koin-core-viewmodel              |                        [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core-viewmodel)](https://mvnrepository.com/artifact/io.insert-koin/koin-core-viewmodel)                        |
| koin-core-viewmodel-navigation |             [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core-viewmodel-navigation)](https://mvnrepository.com/artifact/io.insert-koin/koin-core-viewmodel-navigation)             |
| koin-core-coroutines             |                       [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core-coroutines)](https://mvnrepository.com/artifact/io.insert-koin/koin-core-coroutines)                       |
| koin-test                        |                                  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-test)](https://mvnrepository.com/artifact/io.insert-koin/koin-test)                                  |
| koin-test-junit4                 |                           [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-test-junit4)](https://mvnrepository.com/artifact/io.insert-koin/koin-test-junit4)                           |
| koin-test-junit5                  |                   [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-test-junit5)](https://mvnrepository.com/artifact/io.insert-koin/koin-test-junit5)                                   |
| koin-android                     |                               [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-android)](https://mvnrepository.com/artifact/io.insert-koin/koin-android)                               |
| koin-android-test                |                          [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-android-test)](https://mvnrepository.com/artifact/io.insert-koin/koin-android-test)                          |
| koin-android-compat              |                        [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-android-compat)](https://mvnrepository.com/artifact/io.insert-koin/koin-android-compat)                        |
| koin-androidx-navigation         |                   [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-androidx-navigation)](https://mvnrepository.com/artifact/io.insert-koin/koin-androidx-navigation)                   |
| koin-androidx-workmanager        |                  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-androidx-workmanager)](https://mvnrepository.com/artifact/io.insert-koin/koin-androidx-workmanager)                  |
| koin-androidx-startup        |                      [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-androidx-startup)](https://mvnrepository.com/artifact/io.insert-koin/koin-androidx-startup)                      |
| koin-compose                     |                               [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compose)](https://mvnrepository.com/artifact/io.insert-koin/koin-compose)                               |
| koin-compose-viewmodel           |                     [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compose-viewmodel)](https://mvnrepository.com/artifact/io.insert-koin/koin-compose-viewmodel)                     |
| koin-compose-viewmodel-navigation|          [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compose-viewmodel-navigation)](https://mvnrepository.com/artifact/io.insert-koin/koin-compose-viewmodel-navigation)          |
| koin-androidx-compose            |                      [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-androidx-compose)](https://mvnrepository.com/artifact/io.insert-koin/koin-androidx-compose)                      |
| koin-androidx-compose-navigation |           [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-androidx-compose-navigation)](https://mvnrepository.com/artifact/io.insert-koin/koin-androidx-compose-navigation)           |
| koin-ktor                        |                                  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ktor)](https://mvnrepository.com/artifact/io.insert-koin/koin-ktor)                                  |
| koin-logger-slf4j                |                          [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-logger-slf4j)](https://mvnrepository.com/artifact/io.insert-koin/koin-logger-slf4j)                          |

## Gradle 设置

### Kotlin

从 3.5.0 版本开始，你可以使用 BOM 版本来管理所有 Koin 库的版本。在你的应用中使用 BOM 时，你不需要为 Koin 库的依赖项本身添加任何版本。当你更新 BOM 版本时，你正在使用的所有库都会自动更新到它们的新版本。

将 `koin-bom` BOM 和 `koin-core` 依赖添加到你的应用程序：
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
如果你正在使用 version catalogs（版本目录）：
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

或者使用旧的方式来指定 Koin 的确切依赖版本：
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

现在你可以开始 Koin 了：

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

如果你需要测试功能：

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
从现在开始，你可以继续学习 Koin 教程，了解如何使用 Koin：[Kotlin 应用教程](/quickstart/kotlin.md)
:::

### **Android**

将 `koin-android` 依赖添加到你的 Android 应用程序：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

现在你可以在你的 `Application` 类中启动 Koin 了：

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

如果你需要额外的功能，添加以下需要的包：

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
从现在开始，你可以继续学习 Koin 教程，了解如何使用 Koin：[Android 应用教程](/quickstart/android-viewmodel.md)
:::

### **Jetpack Compose 或 Compose Multiplatform**

将 `koin-compose` 依赖添加到你的 multiplatform（多平台）应用程序中，用于使用 Koin & Compose API：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

如果你正在使用纯 Android Jetpack Compose，你可以使用

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

将 `koin-core` 依赖添加到你的 multiplatform（多平台）应用程序中，用于共享的 Kotlin 部分：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
从现在开始，你可以继续学习 Koin 教程，了解如何使用 Koin：[Kotlin Multiplatform 应用教程](/quickstart/kmp.md)
:::

### **Ktor**

将 `koin-ktor` 依赖添加到你的 Ktor 应用程序：

```groovy
dependencies {
    // Koin for Ktor 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

现在你可以将 Koin 功能安装到你的 Ktor 应用程序中了：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
从现在开始，你可以继续学习 Koin 教程，了解如何使用 Koin：[Ktor 应用教程](/quickstart/ktor.md)
:::

### **Koin BOM**
Koin Bill of Materials (BOM)（Koin 物料清单）允许你仅通过指定 BOM 的版本来管理所有 Koin 库的版本。 BOM 本身具有指向不同 Koin 库的稳定版本的链接，以便它们可以很好地协同工作。 在你的应用中使用 BOM 时，你不需要为 Koin 库的依赖项本身添加任何版本。 当你更新 BOM 版本时，你正在使用的所有库都会自动更新到它们的新版本。

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