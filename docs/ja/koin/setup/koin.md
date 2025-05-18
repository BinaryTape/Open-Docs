---
title: Koin
slug: /
---
プロジェクトにKoinをセットアップするために必要なすべて

## 現在のバージョン

すべてのKoinパッケージは[maven central](https://search.maven.org/search?q=io.insert-koin)で確認できます。

現在利用可能なバージョンは以下のとおりです。

| Project                          |                                                                                                      Version                                                                                                       |
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

## Gradleの設定

### Kotlin

3.5.0以降、BOMバージョンを使用してすべてのKoinライブラリのバージョンを管理できます。 アプリでBOMを使用する場合、Koinライブラリの依存関係自体にバージョンを追加する必要はありません。 BOMバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

`koin-bom` BOMと`koin-core`依存関係をアプリケーションに追加します。
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
バージョンカタログを使用している場合：
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

または、Koinの正確な依存関係バージョンを指定する古い方法を使用します。
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

これでKoinを開始する準備ができました。

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

テスト機能が必要な場合：

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
これからKoinのチュートリアルに進み、Koinの使用方法を学ぶことができます：[Kotlin App Tutorial](/quickstart/kotlin.md)
:::

### **Android**

`koin-android`の依存関係をAndroidアプリケーションに追加します。

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

これで、`Application`クラスでKoinを開始する準備ができました。

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

追加機能が必要な場合は、次の必要なパッケージを追加します。

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
これからKoinのチュートリアルに進み、Koinの使用方法を学ぶことができます：[Android App Tutorial](/quickstart/android-viewmodel.md)
:::

### **Jetpack Compose or Compose Multiplatform**

KoinとCompose APIを使用するために、`koin-compose`の依存関係をマルチプラットフォームアプリケーションに追加します。

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

純粋なAndroid Jetpack Composeを使用している場合は、以下を使用できます。

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

共有Kotlin部分のために、`koin-core`の依存関係をマルチプラットフォームアプリケーションに追加します。

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
これからKoinのチュートリアルに進み、Koinの使用方法を学ぶことができます：[Kotlin Multiplatform App Tutorial](/quickstart/kmp.md)
:::

### **Ktor**

`koin-ktor`の依存関係をKtorアプリケーションに追加します。

```groovy
dependencies {
    // Koin for Ktor 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

これで、Koin機能をKtorアプリケーションにインストールする準備ができました。

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
これからKoinのチュートリアルに進み、Koinの使用方法を学ぶことができます：[Ktor App Tutorial](/quickstart/ktor.md)
:::

### **Koin BOM (Bill of Materials)**
Koin部品表 (Koin Bill of Materials (BOM)) を使用すると、BOM のバージョンのみを指定して、すべての Koin ライブラリのバージョンを管理できます。 BOM 自体には、異なる Koin ライブラリの安定バージョンへのリンクがあり、それらがうまく連携するように構成されています。 アプリで BOM を使用する場合、Koin ライブラリの依存関係自体にバージョンを追加する必要はありません。 BOM のバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

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
```