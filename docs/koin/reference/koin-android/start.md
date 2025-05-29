---
title: 在 Android 上启动 Koin
---

`koin-android` 项目致力于为 Android 世界提供 Koin 功能。有关更多详细信息，请参阅[Android 设置](/docs/setup/koin#android)部分。

## 从你的 Application 类开始

从你的 `Application` 类中，你可以使用 `startKoin` 函数并通过 `androidContext` 注入 Android 上下文，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 将 Koin 日志输出到 Android 日志器
            androidLogger()
            // 引用 Android 上下文
            androidContext(this@MainApplication)
            // 加载模块
            modules(myAppModules)
        }
    }
}
```

:::info
如果你不想从 `Application` 类启动 Koin，你也可以从任何地方启动 Koin。
:::

如果你需要从另一个 Android 类启动 Koin，你可以使用 `startKoin` 函数并提供你的 Android `Context` 实例，就像这样：

```kotlin
startKoin {
    //注入 Android 上下文
    androidContext(/* your android context */)
    // ...
}
```

## 额外配置

在你的 Koin 配置中（在 `startKoin { }` 代码块中），你还可以配置 Koin 的几个部分。

### Koin 日志记录 (Koin Logging) for Android

在你的 `KoinApplication` 实例中，我们有一个 `androidLogger` 扩展函数，它使用 `AndroidLogger()` 类。此日志器是 Koin 日志器的 Android 实现。

你可以根据自己的需求更改此日志器。

```kotlin
startKoin {
    // 使用 Android 日志器 - 默认为 Level.INFO
    androidLogger()
    // ...
}
```

### 加载属性

你可以在 `assets/koin.properties` 文件中使用 Koin 属性来存储键/值：

```kotlin
startKoin {
    // ...
    // 使用 assets/koin.properties 中的属性
    androidFileProperties()   
}
```

## 使用 Androidx Startup 启动 Koin (4.0.1) [实验性]

通过使用 Gradle 包 `koin-androidx-startup`，我们可以使用 `KoinStartup` 接口在你的 `Application` 类中声明 Koin 配置：

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

这取代了通常在 `onCreate` 中使用的 `startKoin` 函数。`koinConfiguration` 函数返回一个 `KoinConfiguration` 实例。

:::info
`KoinStartup` 避免了在启动时阻塞主线程，并提供了更好的性能。
:::

## Koin 的启动依赖 (Startup Dependency)

如果需要 Koin 完成设置并允许注入依赖项，你可以让你的 `Initializer` 依赖于 `KoinInitializer`：

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