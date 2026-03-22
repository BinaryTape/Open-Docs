---
title: Gradleのセットアップ
---

# Gradleのセットアップ

このガイドでは、Koinの依存関係をGradleプロジェクトに追加する方法について説明します。

## Koin BOM (推奨)

**Bill of Materials (BOM)** は、Koinの依存関係を管理するための推奨される方法です。これにより、すべてのKoinライブラリが互換性のあるバージョンを使用していることが保証されます。

:::info
**ベストプラクティス**: Koinライブラリ間のバージョン競合を避けるため、常にKoin BOMを使用してください。
:::

### Version Catalogの使用 (推奨)

`gradle/libs.versions.toml` 内:

```toml
[versions]
koin-bom = "4.2.0"

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-android = { module = "io.insert-koin:koin-android" }
koin-compose = { module = "io.insert-koin:koin-compose" }
koin-compose-viewmodel = { module = "io.insert-koin:koin-compose-viewmodel" }
koin-ktor = { module = "io.insert-koin:koin-ktor" }
koin-test = { module = "io.insert-koin:koin-test" }
```

`build.gradle.kts` 内:

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.android)  // バージョン指定は不要
}
```

### BOMを直接使用する

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // バージョン指定なしで依存関係を追加
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")  // Androidおよびマルチプラットフォームで動作
}
```

## プラットフォーム固有のセットアップ

### Kotlin/JVM {#kotlin}

純粋なKotlinアプリケーションの場合:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

アプリケーションでKoinを開始する:

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }
}
```

**テスト用の依存関係:**

```kotlin
dependencies {
    testImplementation("io.insert-koin:koin-test")
    testImplementation("io.insert-koin:koin-test-junit5")  // または junit4
}
```

### Android {#android}

Androidアプリケーションの場合:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

ApplicationクラスでKoinを開始する:

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

**オプションのAndroidパッケージ:**

```kotlin
dependencies {
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")

    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")

    // AndroidX Startup
    implementation("io.insert-koin:koin-androidx-startup")

    // Java Compatibility
    implementation("io.insert-koin:koin-android-compat")
}
```

### AndroidとJetpack Compose {#compose-android}

Jetpack Composeを使用するAndroidアプリの場合:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
}
```

**Navigationを使用する場合:**

```kotlin
dependencies {
    // Navigation 2 (Androidのみ)
    implementation("io.insert-koin:koin-androidx-compose-navigation")

    // または Navigation 3
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::info
`koin-androidx-compose` は現在 `koin-compose` に統合されています。
:::

### Compose Multiplatform {#compose}

Compose Multiplatformプロジェクト（Android, iOS, Desktop, Web）の場合:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

:::info
`koin-compose` にはAndroidサポートが自動的に含まれています。Compose Multiplatformプロジェクトで個別に `koin-android` を追加する必要はありません。
:::

### Kotlin Multiplatform {#kotlin-multiplatform}

共有モジュールの `build.gradle.kts` 内:

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

        androidMain.dependencies {
            implementation("io.insert-koin:koin-android")
        }
    }
}
```

### Ktor {#ktor}

Ktorサーバーアプリケーションの場合:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

KtorアプリケーションにKoinをインストールする:

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 利用可能なすべてのパッケージ

現在の最新バージョンは以下の通りです: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

| パッケージ | 説明 |
|---------|-------------|
| `koin-core` | Koinコアライブラリ |
| `koin-core-coroutines` | Coroutinesサポート |
| `koin-android` | Androidサポート |
| `koin-android-compat` | Android向けJava互換性 |
| `koin-androidx-navigation` | Navigation Componentサポート |
| `koin-androidx-workmanager` | WorkManagerサポート |
| `koin-androidx-startup` | AndroidX Startupサポート |
| `koin-compose` | Compose (Androidおよびマルチプラットフォーム) |
| `koin-compose-viewmodel` | Compose向けViewModel |
| `koin-compose-viewmodel-navigation` | Compose MP向けNavigation + ViewModel |
| `koin-androidx-compose` | ⚠️ 代替済み - 代わりに `koin-compose` を使用してください |
| `koin-androidx-compose-navigation` | Android向けNavigation 2 (KMP非対応) |
| `koin-compose-navigation3` | Navigation 3 |
| `koin-ktor` | Ktorサーバーサポート |
| `koin-logger-slf4j` | SLF4Jロギング |
| `koin-test` | テスト用ユーティリティ |
| `koin-test-junit4` | JUnit 4サポート |
| `koin-test-junit5` | JUnit 5サポート |
| `koin-android-test` | Androidインストルメンテーションテスト |

## バージョンの直接指定

BOMを使用したくない場合:

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

:::note
このアプローチでは、すべての依存関係を手動で同期させる必要があります。**BOMの使用を強くお勧めします。**
:::

## 次のステップ

- **[コンパイラプラグインのセットアップ](/docs/setup/compiler-plugin)** - コンパイル時の安全性を追加
- **[Koinの開始](/docs/reference/koin-core/starting-koin)** - アプリケーションの設定
- **[チュートリアル](/docs/quickstart/kotlin)** - 初めてのアプリを作成する