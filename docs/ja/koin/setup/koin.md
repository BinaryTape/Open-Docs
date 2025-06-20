---
title: Koin
---

Koinをプロジェクトにセットアップするために必要なものすべて

## 現在のバージョン

すべてのKoinパッケージは[Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name)で確認できます。

現在利用可能なKoinのバージョンは以下の通りです。

- Koin 安定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 不安定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle セットアップ

### Kotlin

バージョン3.5.0以降、BOMバージョンを使用することで、すべてのKoinライブラリのバージョンを管理できます。アプリでBOMを使用する場合、Koinライブラリの依存関係にバージョンを個別に指定する必要はありません。BOMバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

アプリケーションに`koin-bom` BOMと`koin-core`の依存関係を追加します。
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

または、Koinの正確な依存関係バージョンを指定する古い方法を使用する場合：
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

これでKoinを開始する準備ができました：

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
ここからKoinチュートリアルに進み、Koinの使用方法について学ぶことができます：[Kotlin アプリケーションチュートリアル](/docs/quickstart/kotlin)
:::

### **Android**

Androidアプリケーションに`koin-android`の依存関係を追加します：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

これで`Application`クラスでKoinを開始する準備ができました：

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

追加機能が必要な場合は、次の必要なパッケージを追加します：

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
ここからKoinチュートリアルに進み、Koinの使用方法について学ぶことができます：[Android アプリケーションチュートリアル](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose または Compose Multiplatform**

マルチプラットフォームアプリケーションに`koin-compose`の依存関係を追加し、KoinとCompose APIを使用します：

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

マルチプラットフォームアプリケーションに`koin-core`の依存関係を追加し、共有Kotlinパートに使用します：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
ここからKoinチュートリアルに進み、Koinの使用方法について学ぶことができます：[Kotlin Multiplatform アプリケーションチュートリアル](/docs/quickstart/kmp)
:::

### **Ktor**

Ktorアプリケーションに`koin-ktor`の依存関係を追加します：

```groovy
dependencies {
    // Koin for Ktor 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

これでKtorアプリケーションにKoin機能をインストールする準備ができました：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
ここからKoinチュートリアルに進み、Koinの使用方法について学ぶことができます：[Ktor アプリケーションチュートリアル](/docs/quickstart/ktor)
:::

### **Koin BOM**
KoinのBill of Materials (BOM) を使用すると、BOMのバージョンを指定するだけで、すべてのKoinライブラリのバージョンを管理できます。BOM自体は、さまざまなKoinライブラリの安定バージョンへのリンクを持っており、それらが連携してうまく機能するように設定されています。アプリでBOMを使用する場合、Koinライブラリの依存関係にバージョンを個別に指定する必要はありません。BOMバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

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