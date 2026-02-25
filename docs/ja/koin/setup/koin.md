---
title: Koin
---

プロジェクトにKoinをセットアップするために必要なすべてのこと

## 現在のバージョン

すべてのKoinパッケージは [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) で確認できます。

現在利用可能なKoinのバージョンは以下の通りです：

- Koin 安定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 不安定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradleのセットアップ

### Kotlin

3.5.0以降、BOM（Bill of Materials）バージョンを使用して、すべてのKoinライブラリのバージョンを管理できるようになりました。アプリでBOMを使用する場合、各Koinライブラリの依存関係にバージョンを指定する必要はありません。BOMのバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

アプリケーションに `koin-bom` BOM と `koin-core` の依存関係を追加します：
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
バージョンカタログ（version catalogs）を使用している場合：
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

または、従来の方法でKoinの特定の依存関係バージョンを指定します：
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

これでKoinを開始する準備が整いました：

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
    // Koin テスト機能
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // JUnit 4用 Koin
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // JUnit 5用 Koin
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
これ以降は、Koinチュートリアルに進んでKoinの使い方を学ぶことができます： [Kotlinアプリ チュートリアル](/docs/quickstart/kotlin)
:::

### **Android**

Androidアプリケーションに `koin-android` の依存関係を追加します：

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

これで `Application` クラスでKoinを開始する準備が整いました：

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

追加の機能が必要な場合は、必要に応じて以下のパッケージを追加してください：

```groovy
dependencies {
    // Java 互換性
    implementation("io.insert-koin:koin-android-compat:$koin_android_version")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager:$koin_android_version")
    // ナビゲーショングラフ (Navigation Graph)
    implementation("io.insert-koin:koin-androidx-navigation:$koin_android_version")
    // App Startup
    implementation("io.insert-koin:koin-androidx-startup:$koin_android_version")
}
```

:::info
これ以降は、Koinチュートリアルに進んでKoinの使い方を学ぶことができます： [Androidアプリ チュートリアル](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose または Compose Multiplatform**

KoinとCompose APIを使用するために、マルチプラットフォームアプリケーションに `koin-compose` の依存関係を追加します：

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

Android専用のJetpack Composeを使用している場合は、以下を使用できます：

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

共通のKotlinパーツ用に、マルチプラットフォームアプリケーションに `koin-core` の依存関係を追加します：

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
これ以降は、Koinチュートリアルに進んでKoinの使い方を学ぶことができます： [Kotlin Multiplatformアプリ チュートリアル](/docs/quickstart/kmp)
:::

### **Ktor**

Ktorアプリケーションに `koin-ktor` の依存関係を追加します：

```groovy
dependencies {
    // Ktor用 Koin
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J ロガー
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

これでKtorアプリケーションにKoin機能をインストールする準備が整いました：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
これ以降は、Koinチュートリアルに進んでKoinの使い方を学ぶことができます： [Ktorアプリ チュートリアル](/docs/quickstart/ktor)
:::

### **Koin BOM**
KoinのBOM（Bill of Materials）を使用すると、BOMのバージョンを指定するだけで、すべてのKoinライブラリのバージョンを管理できます。BOM自体が、相互に適切に動作するさまざまなKoinライブラリの安定版へのリンクを保持しています。アプリでBOMを使用する場合、各Koinライブラリの依存関係に個別のバージョンを追加する必要はありません。BOMのバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

```groovy
dependencies {
    // koin-bom のバージョンを宣言
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // 必要な koin の依存関係を宣言
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // 特定のバージョンを指定する必要がある場合は、目的のバージョンを直接指定します
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // テストライブラリでも動作します！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}