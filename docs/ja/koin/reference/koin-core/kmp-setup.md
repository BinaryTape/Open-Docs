---
title: Kotlin Multiplatformのセットアップ
---

# Kotlin Multiplatformのセットアップ

Koinは、Kotlin Multiplatform (KMP) プロジェクトに対してファーストクラスのサポートを提供します。このガイドでは、セットアップと構成について説明します。

:::info
定義の種類（Single、Factory、ViewModel）および3つの宣言方法（Compiler Plugin DSL、Annotations、Classic DSL）については、[Definitions](/docs/reference/koin-core/definitions)を参照してください。
:::

## サポートされているプラットフォーム

| プラットフォーム | ステータス |
|----------|--------|
| Android | ✅ フルサポート |
| iOS (arm64, x64, simulatorArm64) | ✅ フルサポート |
| JVM | ✅ フルサポート |
| JS | ✅ フルサポート |
| Wasm | ✅ フルサポート |
| macOS | ✅ フルサポート |
| Linux | ✅ フルサポート |
| Windows | ✅ フルサポート |

## 依存関係のセットアップ

### shared/build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform")
    id("io.insert-koin.compiler.plugin")  // オプション：Compiler Plugin用
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    jvm()
    js(IR) { browser() }

    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:4.2.0"))
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

### Compose Multiplatformを使用する場合

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:4.2.0"))
            implementation("io.insert-koin:koin-core")
            implementation("io.insert-koin:koin-compose")
            implementation("io.insert-koin:koin-compose-viewmodel")
        }
    }
}
```

## プロジェクト構造

```
project/
├── shared/
│   ├── src/
│   │   ├── commonMain/
│   │   │   └── kotlin/
│   │   │       ├── di/
│   │   │       │   └── KoinModules.kt
│   │   │       └── domain/
│   │   │           └── UserRepository.kt
│   │   ├── androidMain/
│   │   │   └── kotlin/
│   │   │       └── di/
│   │   │           └── PlatformModule.android.kt
│   │   └── iosMain/
│   │       └── kotlin/
│   │           └── di/
│   │               └── PlatformModule.ios.kt
│   └── build.gradle.kts
├── androidApp/
│   └── src/main/kotlin/
│       └── MainApplication.kt
└── iosApp/
    └── iOSApp.swift
```

## 共通モジュールの定義

### commonMain/kotlin/di/KoinModules.kt

```kotlin
import org.koin.dsl.module

// 共有定義 (Compiler Plugin DSL)
val sharedModule = module {
    single<UserRepository>()
    single<ApiClient>()
    factory<GetUserUseCase>()
}

// プラットフォーム固有のモジュール (プラットフォームごとに定義)
expect val platformModule: Module
```

:::note
共有モジュールにはCompiler Plugin DSL (`single<Type>()`) を推奨します。これにはコンパイラプラグインが必要ですが、プラットフォームごとのKSP構成なしで、最もクリーンな構文を提供します。
:::

## プラットフォーム固有のモジュール

プラットフォームモジュールでは、どのアプローチも使用できます。ここでは、カスタムの構築ロジックが必要な場合のために、ラムダを使用したClassic DSLを示しています。

### androidMain/kotlin/di/PlatformModule.android.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // カスタム構築のためのラムダを使用したClassic DSL
    single<PlatformHelper> { AndroidPlatformHelper(get()) }
    single<DatabaseDriver> { AndroidDatabaseDriver(get()) }
}
```

### iosMain/kotlin/di/PlatformModule.ios.kt

```kotlin
import org.koin.dsl.module

actual val platformModule = module {
    // カスタムロジックが不要な場合は、Compiler Plugin DSLまたはAnnotationsを使用
    single<IosPlatformHelper>() bind PlatformHelper::class
    single<IosDatabaseDriver>() bind DatabaseDriver::class
}
```

## 共有の初期化

### commonMain/kotlin/di/KoinInit.kt

```kotlin
import org.koin.core.context.startKoin
import org.koin.core.KoinApplication

fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)
        modules(
            sharedModule,
            platformModule
        )
    }
}
```

## プラットフォームのエントリポイント

### Android

```kotlin
// androidApp/src/main/kotlin/MainApplication.kt
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### iOS

```kotlin
// shared/src/iosMain/kotlin/di/KoinInitIos.kt
fun initKoinIos() {
    initKoin()
}
```

```swift
// iosApp/iOSApp.swift
import shared

@main
struct iOSApp: App {
    init() {
        KoinInitIosKt.initKoinIos()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### JVM

```kotlin
fun main() {
    initKoin {
        printLogger()
    }

    val repository: UserRepository = get()
}
```

## KMPにおけるDSLアプローチ

| アプローチ | 使用場面 |
|----------|-------------|
| **Compiler Plugin DSL** | デフォルトの選択肢 - どこでも動作し、最もクリーンな構文 |
| **Annotations** | デフォルトの選択肢 - どこでも動作し、モジュールコードが不要 |
| **Classic DSL with lambda** | ビルダーパターン、カスタムファクトリロジック、モック |

:::info
**Compiler Plugin DSL**と**Annotations**はどこでも動作します。カスタムの構築ロジックが必要な場合にのみ**Classic DSL with lambda**を使用してください。詳細は[Compiler Plugin Setup](/docs/setup/compiler-plugin)を参照してください。
:::

## ベストプラクティス

1. **共有コードをcommonMainに配置する** - ビジネスロジック、リポジトリ、ユースケースなど。
2. **プラットフォーム固有のものにexpect/actualを使用する** - ファイルシステム、デバイスAPI、プラットフォーム固有のライブラリなど。
3. **プラットフォームごとにKoinを初期化する** - 各プラットフォームにはそれぞれのエントリポイントがあります。
4. **プラットフォームモジュールを最小限に保つ** - 本当にプラットフォーム固有のものだけを定義するようにします。

## 次のステップ

- **[共有パターン](/docs/reference/koin-core/kmp-shared-modules)** - モジュールの構成、expect/actualパターン
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - マルチプラットフォームViewModel
- **[高度なパターン](/docs/reference/koin-mp/kmp)** - アーキテクチャパターン、テスト、プラットフォーム統合
- **[テスト](/docs/reference/koin-test/testing)** - KMPプロジェクトのテスト