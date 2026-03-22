---
title: Koin
---

プロジェクトにKoinをセットアップするために必要なすべてのこと

## 現在のバージョン

すべてのKoinパッケージは [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) で確認できます。

現在利用可能なKoinのバージョンは以下の通りです：

- Koin 安定版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 最新版 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

## Koin BOM (推奨)

:::info
**ベストプラクティス**: すべてのKoinライブラリのバージョンを一貫して管理するために、Koin BOM（Bill of Materials）を使用してください。これはすべてのプロジェクトで推奨される方法です。
:::

KoinのBOM（Bill of Materials）を使用すると、BOMのバージョンを指定するだけで、すべてのKoinライブラリのバージョンを管理できます。BOM自体が、相互に適切に動作するさまざまなKoinライブラリの安定版へのリンクを保持しています。アプリでBOMを使用する場合、各Koinライブラリの依存関係に個別のバージョンを追加する必要はありません。BOMのバージョンを更新すると、使用しているすべてのライブラリが自動的に新しいバージョンに更新されます。

### バージョンカタログ（Version Catalogs）で BOM を使用する (推奨)

`gradle/libs.versions.toml` 内：

```toml
[versions]
koin-bom = "4.1.1"  # 安定版

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

`build.gradle.kts` 内：

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.core)
    // バージョンを指定せずに他のKoin依存関係を追加します
}
```

### バージョンカタログを使用せずに BOM を使用する

```kotlin
dependencies {
    // koin-bom のバージョンを宣言
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // バージョンを指定せずに koin の依存関係を宣言
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")

    // 特定の依存関係に別のバージョンを指定する必要がある場合
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")

    // テストライブラリでも動作します！
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```

## プラットフォーム固有のセットアップ

### Kotlin

アプリケーションに Koin BOM と `koin-core` の依存関係を追加します：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

または、特定の依存関係バージョンを直接指定します（非推奨）：

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

```kotlin
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
**次のステップ**: [Kotlinアプリ チュートリアル](/docs/quickstart/kotlin) に進むか、[コア機能](/docs/reference/koin-core/dsl) を参照してください。
:::

### Android

Androidアプリケーションに `koin-android` の依存関係を追加します：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

これで `Application` クラスでKoinを開始する準備が整いました：

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

追加の機能が必要な場合は、必要に応じて以下のパッケージを追加してください：

```kotlin
dependencies {
    // Java 互換性
    implementation("io.insert-koin:koin-android-compat")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")
    // ナビゲーショングラフ (Navigation Graph)
    implementation("io.insert-koin:koin-androidx-navigation")
    // App Startup - AndroidX Startup で Koin を開始
    implementation("io.insert-koin:koin-androidx-startup")
}
```

:::info
**次のステップ**: [Androidアプリ チュートリアル](/docs/quickstart/android-viewmodel) に進むか、統合の詳細について [AndroidでのKoinの開始](/docs/reference/koin-android/start) を参照してください。
:::

### Jetpack Compose または Compose Multiplatform

**Compose Multiplatform** (Android, iOS, Desktop, Web) の場合は、以下の依存関係を追加します：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

**Android専用のJetpack Compose** を使用している場合は、以下を使用できます：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-androidx-compose")
    implementation("io.insert-koin:koin-androidx-compose-navigation")
}
```

**Navigation 3 統合** (実験的) の場合：

```kotlin
dependencies {
    // Navigation 3 サポート (alpha)
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::warning
Navigation 3 はアルファ版です。詳細は [Navigation 3 統合](/docs/reference/koin-compose/navigation3) を参照してください。
:::

:::info
**次のステップ**: [Compose チュートリアル](/docs/quickstart/android-compose) に進むか、統合の詳細について [Koin Compose](/docs/reference/koin-compose/compose) を参照してください。
:::

### Kotlin Multiplatform

`shared/build.gradle.kts` で、`commonMain` に `koin-core` の依存関係を追加します：

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
**次のステップ**: プラットフォーム固有のセットアップ、expect/actual パターン、およびアーキテクチャのガイダンスについては、[Kotlin Multiplatform with Koin](/docs/reference/koin-mp/kmp) を参照してください。
:::

### Ktor

Ktorアプリケーションに `koin-ktor` の依存関係を追加します：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    // Ktor用 Koin
    implementation("io.insert-koin:koin-ktor")
    // SLF4J ロガー
    implementation("io.insert-koin:koin-logger-slf4j")
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
**次のステップ**: [Ktorアプリ チュートリアル](/docs/quickstart/ktor) に進むか、セットアップの詳細について [Ktor 統合](/docs/reference/koin-ktor/ktor) を参照してください。
:::

## 代替案：バージョンの直接指定

BOMを使用したくない場合は、各依存関係のバージョンを直接指定できます：

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-compose:$koin_version")
}
```

:::note
この方法では、すべてのKoin依存関係を互換性のあるバージョンに手動で同期させる必要があります。バージョン競合を避けるために、**BOMの使用を強く推奨します**。
:::