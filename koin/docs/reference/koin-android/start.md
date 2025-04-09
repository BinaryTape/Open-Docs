---
title: "在 Android 上启动 Koin"
---
`koin-android` 项目致力于为 Android 世界提供 Koin 的能力。有关更多详细信息，请参见 [Android 设置](/setup/koin.md) 部分。

## 从你的 Application 类

从你的 `Application` 类中，你可以使用 `startKoin` 函数并通过 `androidContext` 注入 Android 上下文，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 将 Koin 日志记录到 Android logger
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
如果你不想从你的 Application 类启动 Koin，你也可以从任何地方启动 Koin。
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

从你的 Koin 配置（在 `startKoin { }` 代码块中）中，你还可以配置 Koin 的几个部分。

### Koin Android 日志

在你的 `KoinApplication` 实例中，我们有一个扩展 `androidLogger`，它使用 `AndroidLogger()` 类。此日志记录器是 Koin 日志记录器的 Android 实现。

你可以根据自己的需要更改此日志记录器。

```kotlin
startKoin {
    // 使用 Android logger - 默认 Level.INFO
    androidLogger()
    // ...
}
```

### 加载属性

你可以在 `assets/koin.properties` 文件中使用 Koin 属性来存储键/值：

```kotlin
startKoin {
    // ...
    // 使用来自 assets/koin.properties 的属性
    androidFileProperties()   
}
```

## 使用 Androidx Startup 启动 Koin (4.0.1) [实验性]

通过使用 Gradle 包 `koin-androidx-startup`，我们可以使用 `KoinStartup` 接口来声明你的 Koin 配置你的 Application 类：

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

这取代了通常在 `onCreate` 中使用的 `startKoin` 函数。 `koinConfiguration` 函数返回一个 `KoinConfiguration` 实例。

:::info
`KoinStartup` 避免在启动时阻塞主线程，并提供更好的性能。
:::

## 具有 Koin 的启动依赖项

如果需要设置 Koin 并允许注入依赖项，则可以使你的 `Initializer` 依赖于 `KoinInitializer`：

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