---
title: Android 模組載入
---

本指南涵蓋了使用 `androidContext()` 與 `androidLogger()` 進行 Android 特有的模組載入。

:::info
關於核心模組概念（宣告、包含、覆寫），請參閱 [Modules](/docs/reference/koin-core/modules)。關於延遲模組載入，請參閱 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

## 在 Android 上啟動 Koin

### 使用註解

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

### 使用 DSL

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android 記錄器
            androidLogger()
            // 或帶有層級
            androidLogger(Level.DEBUG)

            // Android 上下文
            androidContext(this@MainApplication)

            // 模組
            modules(appModule, networkModule, dataModule)
        }
    }
}
```

## Android 特有的函式

| 函式 | 說明 |
|----------|-------------|
| `androidContext()` | 在定義中提供 Application 上下文 |
| `androidApplication()` | 在定義中提供 Application 執行個體 |
| `androidLogger()` | 適用於 Koin 的 Android Logcat 記錄器 |

### 使用 Android 上下文

```kotlin
val androidModule = module {
    single { DatabaseHelper(androidContext()) }
    single { SharedPrefsManager(androidContext()) }
    single { NotificationHelper(androidApplication()) }
}
```

## 動態模組載入

根據 Activity 生命週期在執行時載入或卸載模組：

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 載入特定功能的相依性
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 離開功能時進行清理
        unloadKoinModules(featureModule)
    }
}
```

### 使用案例

- **進階功能** - 僅在使用者擁有訂閱時載入
- **偵錯工具** - 僅在偵錯組建中載入
- **選用功能** - 按需載入

```kotlin
// 進階功能模組
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

## 在 Android 上延遲載入

對於背景模組載入，請使用延遲模組：

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)

            // 關鍵模組立即載入
            modules(coreModule)

            // 非關鍵模組在背景載入
            lazyModules(analyticsModule, syncModule)
        }
    }
}
```

:::info
關於包含並列載入在內的完整延遲模組文件，請參閱 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

## 後續步驟

- **[Modules](/docs/reference/koin-core/modules)** - 核心模組概念
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - 背景載入
- **[Multi-Module Apps](/docs/reference/koin-android/multi-module)** - Gradle 多模組架構