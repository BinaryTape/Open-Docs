---
title: Koin
---

在專案中設定 Koin 所需的一切

## 當前版本

您可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有的 Koin 軟件包。

以下是目前可用的 Koin 版本：

- Koin 穩定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 非穩定版本 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 設定

### Kotlin

從 3.5.0 開始，您可以使用 BOM 版本來管理所有 Koin 程式庫版本。在應用程式中使用 BOM 時，您不需要在 Koin 程式庫相依性本身新增任何版本。當您更新 BOM 版本時，您正在使用的所有庫都會自動更新至其新版本。

將 `koin-bom` BOM 與 `koin-core` 相依性新增至您的應用程式：
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
如果您使用的是版本目錄 (version catalogs)：
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

或使用舊有的方式來指定 Koin 的確切相依性版本：
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

```groovy
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
從現在起，您可以繼續閱讀 Koin 教學以了解如何使用 Koin：[Kotlin 應用程式教學](/docs/quickstart/kotlin)
:::

### **Android**

將 `koin-android` 相依性新增至您的 Android 應用程式：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

您現在已準備好在您的 `Application` 類別中啟動 Koin：

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

如果您需要額外功能，請新增以下所需的軟件包：

```groovy
dependencies {
    // Java 相容性
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
從現在起，您可以繼續閱讀 Koin 教學以了解如何使用 Koin：[Android 應用程式教學](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 或 Compose Multiplatform**

將 `koin-compose` 相依性新增至您的多平台應用程式，以使用 Koin 與 Compose API：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

如果您使用的是純 Android Jetpack Compose，可以使用：

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

將 `koin-core` 相依性新增至您的多平台應用程式，用於共享的 Kotlin 部分：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
從現在起，您可以繼續閱讀 Koin 教學以了解如何使用 Koin：[Kotlin 多平台應用程式教學](/docs/quickstart/kmp)
:::

### **Ktor**

將 `koin-ktor` 相依性新增至您的 Ktor 應用程式：

```groovy
dependencies {
    // 適用於 Ktor 的 Koin 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J 記錄器
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
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
從現在起，您可以繼續閱讀 Koin 教學以了解如何使用 Koin：[Ktor 應用程式教學](/docs/quickstart/ktor)
:::

### **Koin BOM**
Koin 產品清單 (BOM) 讓您只需指定 BOM 的版本，即可管理所有的 Koin 程式庫版本。BOM 本身包含了不同 Koin 程式庫穩定版本的連結，並確保它們能良好地協作。在應用程式中使用 BOM 時，您不需要在 Koin 程式庫相依性本身新增任何版本。當您更新 BOM 版本時，您正在使用的所有庫都會自動更新至其新版本。

```groovy
dependencies {
    // 宣告 koin-bom 版本
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // 宣告您需要的 koin 相依性
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // 如果您需要指定某些版本，只需指向所需版本即可
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // 同樣適用於測試庫！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}