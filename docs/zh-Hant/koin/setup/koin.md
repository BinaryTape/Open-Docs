---
title: Koin
---

你專案中設定 Koin 所需的一切。

## 目前版本

你可以在 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) 上找到所有 Koin 套件。

以下是目前可用的 Koin 版本：

- Koin 穩定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 不穩定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 設定

### Kotlin

從 3.5.0 版開始，你可以使用 BOM (Bill of Materials) 版本來管理所有 Koin 函式庫的版本。當你在應用程式中使用 BOM 時，你不需要為 Koin 函式庫的依賴項本身添加任何版本。當你更新 BOM 版本時，你正在使用的所有函式庫都會自動更新到它們的新版本。

在你的應用程式中添加 `koin-bom` BOM 和 `koin-core` 依賴項：
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
如果你正在使用版本目錄 (version catalogs)：
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

或者使用舊的方式來指定 Koin 的確切依賴項版本：
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

你現在可以開始 Koin：

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

如果你需要測試功能：

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
現在你可以繼續閱讀 Koin 教學課程，了解如何使用 Koin：[Kotlin 應用程式教學](/docs/quickstart/kotlin)
:::

### **Android**

在你的 Android 應用程式中添加 `koin-android` 依賴項：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

你現在可以在你的 `Application` 類別中啟動 Koin：

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

如果你需要額外功能，請添加以下所需套件：

```groovy
dependencies {
    // Java 相容性
    implementation("io.insert-koin:koin-android-compat:$koin_android_version")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager:$koin_android_version")
    // 導覽圖 (Navigation Graph)
    implementation("io.insert-koin:koin-androidx-navigation:$koin_android_version")
    // 應用程式啟動 (App Startup)
    implementation("io.insert-koin:koin-androidx-startup:$koin_android_version")
}
```

:::info
現在你可以繼續閱讀 Koin 教學課程，了解如何使用 Koin：[Android 應用程式教學](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 或 Compose Multiplatform**

在你的多平台應用程式中添加 `koin-compose` 依賴項，以便使用 Koin 和 Compose API：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

如果你正在使用純 Android Jetpack Compose，你可以選擇：

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

在你的多平台應用程式中添加 `koin-core` 依賴項，用於共享的 Kotlin 部分：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
現在你可以繼續閱讀 Koin 教學課程，了解如何使用 Koin：[Kotlin 多平台應用程式教學](/docs/quickstart/kmp)
:::

### **Ktor**

在你的 Ktor 應用程式中添加 `koin-ktor` 依賴項：

```groovy
dependencies {
    // Ktor 專用的 Koin (Koin for Ktor)
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J 記錄器 (SLF4J Logger)
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

你現在可以將 Koin 功能安裝到你的 Ktor 應用程式中：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
現在你可以繼續閱讀 Koin 教學課程，了解如何使用 Koin：[Ktor 應用程式教學](/docs/quickstart/ktor)
:::

### **Koin BOM**
Koin 物料清單 (Bill of Materials, BOM) 允許你透過僅指定 BOM 的版本來管理所有 Koin 函式庫版本。BOM 本身連結了不同 Koin 函式庫的穩定版本，確保它們能夠良好協同工作。當你在應用程式中使用 BOM 時，你不需要為 Koin 函式庫依賴項本身添加任何版本。當你更新 BOM 版本時，你正在使用的所有函式庫都會自動更新到它們的新版本。

```groovy
dependencies {
    // 宣告 koin-bom 版本
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // 宣告你需要的 koin 依賴項
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // 如果你需要指定某個版本，只需指向所需版本
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // 測試函式庫也適用！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```