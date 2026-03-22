---
title: 在 Android 上启动 Koin
---

`koin-android` 项目致力于为 Android 世界提供 Koin 动力。详见 [Android 设置](/docs/setup/koin#android)部分。

## 在 Application 类中

在 `Application` 类中，你可以使用 `startKoin` 函数并使用 `androidContext` 注入 Android context，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 将 Koin 日志记录到 Android 日志记录器中
            androidLogger()
            // 引用 Android context
            androidContext(this@MainApplication)
            // 加载模块
            modules(myAppModules)
        }
    }
}
```

:::info
如果你不想在 Application 类中启动 Koin，也可以从任何地方启动它。
:::

如果你需要从另一个 Android 类启动 Koin，可以使用 `startKoin` 函数并提供你的 Android `Context` 实例，就像这样：

```kotlin
startKoin {
    // 注入 Android context
    androidContext(/* 你的 android context */)
    // ...
}
```

## 使用注解启动 Koin

使用 Koin Annotations 时，可以使用 `startKoin<T>()` 并结合已注解的模块类来启动 Koin：

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

`startKoin<T>()` 函数会自动从带有 `@Module` 注解的类中加载生成的模块。

对于多个模块：

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp.data")
class DataModule

@Module
@Configuration
@ComponentScan("com.myapp.domain")
class DomainModule

@KoinApplication
class MainApplication

// 使用多个模块启动
startKoin<MainApplication> {
    androidLogger()
    androidContext(this@MainApplication)
}
```

## 额外配置

在 Koin 配置中（在 `startKoin { }` 代码块中），你还可以配置 Koin 的多个部分。

### 适用于 Android 的 Koin 日志记录

在 `KoinApplication` 实例中，我们提供了一个 `androidLogger` 扩展，它使用 `AndroidLogger()` 类。此日志记录器是 Koin 日志记录器的 Android 实现。

如果该日志记录器不符合你的需求，你可以自行更改。

```kotlin
startKoin {
    // 使用 Android 日志记录器 - 默认级别为 Level.INFO
    androidLogger()
    // ...
}
```

### 加载属性

你可以使用 `assets/koin.properties` 文件中的 Koin 属性来存储键/值：

```kotlin
startKoin {
    // ...
    // 使用来自 assets/koin.properties 的属性
    androidFileProperties()   
}
```

## 通过 AndroidX Startup 启动 Koin (4.0.1)

[AndroidX Startup](https://developer.android.com/topic/libraries/app-startup) 是一个提供简单方式在应用启动时初始化组件的库。它使用单个 ContentProvider 来初始化所有依赖项，避免了每个需要早期初始化的组件都使用单独 ContentProvider 所带来的开销。

通过使用 Gradle 软件包 `koin-androidx-startup`，我们可以使用 `KoinStartup` 接口在 Application 类中声明你的 Koin 配置：

```kotlin
class MainApplication : Application(), KoinStartup {

     override fun onKoinStartup() = koinConfiguration {
        androidContext(this@MainApplication)
        modules(appModule)
    }

    override fun onCreate() {
        super.onCreate()
    }
}
```

这取代了通常在 `onCreate` 中使用的 `startKoin` 函数。`koinConfiguration` 函数会返回一个 `KoinConfiguration` 实例。

:::info
`KoinStartup` 与 AndroidX App Startup 集成，在 `Application.onCreate()` 之前通过 ContentProvider 初始化 Koin。当你需要管理依赖于 Koin 的其他 Initializer 的初始化顺序时，这非常有用。
:::

:::warning
`KoinStartup` 在应用启动期间在主线程上运行。如果你不使用 AndroidX App Startup 库来管理其他 Initializer，那么使用 `KoinStartup` **没有任何好处** —— 请改用标准的 `startKoin` 方式。有关将模块加载调度到后台线程的信息，请参阅 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

如果你还有其他需要 Koin 的 Initializer，请让它们依赖于 `KoinInitializer`：

```kotlin
class CrashTrackerInitializer : Initializer<Unit>, KoinComponent {
    private val crashTrackerService: CrashTrackerService by inject()

    override fun create(context: Context) {
        crashTrackerService.configure(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return listOf(KoinInitializer::class.java)
    }
}
```

## 后续步骤

- **[JSR-330 兼容性](/docs/reference/koin-android/jsr330)** — 使用标准的 `@Inject`、`@Singleton` 注解
- **[在 Android 中注入](/docs/reference/koin-android/get-instances)** — 在 Activity、Fragment、Service 中获取实例
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** — ViewModel 注入与作用域
- **[Hilt 迁移](/docs/reference/koin-android/hilt-migration)** — 从 Hilt 迁移到 Koin