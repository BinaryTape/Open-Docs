---
title: Android 模块加载
---

本指南涵盖了使用 `androidContext()` 和 `androidLogger()` 的 Android 特定模块加载。

:::info
有关核心模块概念（声明、包含、重写），请参阅 [Modules](/docs/reference/koin-core/modules)。有关延迟模块加载，请参阅 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

## 在 Android 上启动 Koin

### 使用注解

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
            // Android 日志记录器
            androidLogger()
            // 或带有级别
            androidLogger(Level.DEBUG)

            // Android 上下文
            androidContext(this@MainApplication)

            // 模块
            modules(appModule, networkModule, dataModule)
        }
    }
}
```

## Android 特定函数

| 函数 | 描述 |
|----------|-------------|
| `androidContext()` | 在定义中提供 Application 上下文 |
| `androidApplication()` | 在定义中提供 Application 实例 |
| `androidLogger()` | 适用于 Koin 的 Android Logcat 日志记录器 |

### 使用 Android 上下文

```kotlin
val androidModule = module {
    single { DatabaseHelper(androidContext()) }
    single { SharedPrefsManager(androidContext()) }
    single { NotificationHelper(androidApplication()) }
}
```

## 动态模块加载

根据 Activity 生命周期在运行时加载或卸载模块：

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 加载功能特定的依赖项
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 离开功能时进行清理
        unloadKoinModules(featureModule)
    }
}
```

### 用例

- **高级功能** - 仅在用户拥有订阅时加载
- **调试工具** - 仅在调试构建中加载
- **可选功能** - 按需加载

```kotlin
// 高级功能模块
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

## 在 Android 上延迟加载

对于后台模块加载，请使用延迟模块：

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)

            // 关键模块立即加载
            modules(coreModule)

            // 非关键模块在后台加载
            lazyModules(analyticsModule, syncModule)
        }
    }
}
```

:::info
有关包含并行加载在内的完整延迟模块文档，请参阅 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

## 下一步

- **[Modules](/docs/reference/koin-core/modules)** - 核心模块概念
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - 后台加载
- **[Multi-Module Apps](/docs/reference/koin-android/multi-module)** - Gradle 多模块架构