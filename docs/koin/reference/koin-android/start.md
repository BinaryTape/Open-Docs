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

## 通过 Androidx Startup 启动 Koin (4.0.1) [实验性]

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
`KoinStartup` 避免在启动时间阻塞主线程，并提供更好的性能。
:::

## 配合 Koin 使用 Startup 依赖项

如果你需要设置 Koin 并允许注入依赖项，可以使你的 `Initializer` 依赖于 `KoinInitializer`：

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