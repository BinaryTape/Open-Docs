---
title: Androidにおけるモジュールのロード
---

このガイドでは、`androidContext()` および `androidLogger()` を使用した Android 特有のモジュールロードについて説明します。

:::info
コアモジュールの概念（宣言、包含、オーバーライド）については、[Modules](/docs/reference/koin-core/modules) を参照してください。遅延モジュールのロードについては、[Lazy Modules](/docs/reference/koin-core/lazy-modules) を参照してください。
:::

## AndroidでのKoinの起動

### アノテーションを使用する場合

```kotlin
@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin<MainApplication> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### DSLを使用する場合

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Androidロガー
            androidLogger()
            // またはレベルを指定
            androidLogger(Level.DEBUG)

            // Androidコンテキスト
            androidContext(this@MainApplication)

            // モジュール
            modules(appModule, networkModule, dataModule)
        }
    }
}
```

## Android特有の関数

| 関数 | 説明 |
|----------|-------------|
| `androidContext()` | 定義内で Application コンテキストを提供します |
| `androidApplication()` | 定義内で Application インスタンスを提供します |
| `androidLogger()` | Koin 用の Android Logcat ロガー |

### Androidコンテキストの使用

```kotlin
val androidModule = module {
    single { DatabaseHelper(androidContext()) }
    single { SharedPrefsManager(androidContext()) }
    single { NotificationHelper(androidApplication()) }
}
```

## 動的なモジュールのロード

Activity のライフサイクルに基づいて、実行時にモジュールをロードまたはアンロードします：

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 機能固有の依存関係をロード
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 機能を離れる際にクリーンアップ
        unloadKoinModules(featureModule)
    }
}
```

### ユースケース

- **プレミアム機能** - ユーザーがサブスクリプションを持っている場合にのみロード
- **デバッグツール** - デバッグビルドでのみロード
- **オプション機能** - オンデマンドでロード

```kotlin
// プレミアム機能モジュール
val premiumModule = module {
    viewModel<PremiumViewModel>()
    single<PremiumRepository>()
}

class PremiumActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        if (userHasPremium()) {
            loadKoinModules(premiumModule)
        }
        super.onCreate(savedInstanceState)
    }
}
```

## Androidにおける遅延ロード（Lazy Loading）

バックグラウンドでのモジュールロードには、lazy モジュールを使用します：

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)

            // クリティカルなモジュールは即座にロード
            modules(coreModule)

            // 非クリティカルなモジュールはバックグラウンドでロード
            lazyModules(analyticsModule, syncModule)
        }
    }
}
```

:::info
並列ロードを含む遅延モジュールの完全なドキュメントについては、[Lazy Modules](/docs/reference/koin-core/lazy-modules) を参照してください。
:::

## 次のステップ

- **[Modules](/docs/reference/koin-core/modules)** - コアモジュールの概念
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - バックグラウンドロード
- **[Multi-Module Apps](/docs/reference/koin-android/multi-module)** - Gradleマルチモジュールアーキテクチャ