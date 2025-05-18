---
title: 延迟模块和后台加载
---
在本节中，我们将了解如何使用延迟加载（lazy loading）方法来组织你的模块。

## 定义延迟模块 [Experimental]

你现在可以声明延迟 Koin 模块（lazy Koin module），以避免触发任何资源的预先分配，并在 Koin 启动时在后台加载它们。

- `lazyModule` - 声明 Koin 模块的 Kotlin 延迟版本
- `Module.includes` - 允许包含延迟模块

一个好的例子总是更容易理解：

```kotlin
// 一些延迟模块
val m2 = lazyModule {
    singleOf(::ClassB)
}

// 包含 m2 延迟模块
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    在被以下 API 加载之前，`LazyModule` 不会触发任何资源
:::

## 使用 Kotlin 协程进行后台加载 [Experimental]

一旦你声明了一些延迟模块，你就可以从你的 Koin 配置中在后台加载它们，甚至可以做更多。

- `KoinApplication.lazyModules` - 使用协程在后台加载延迟模块，考虑平台默认的 Dispatchers
- `Koin.waitAllStartJobs` - 等待启动任务完成
- `Koin.runOnKoinStarted` - 在启动完成后运行代码块

一个好的例子总是更容易理解：

```kotlin
startKoin {
    // 在后台加载延迟模块
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// 等待加载任务完成
koin.waitAllStartJobs()

// 或者在加载完成后运行代码
koin.runOnKoinStarted { koin ->
    // 在后台加载完成后运行
}
```

:::note
    `lazyModules` 函数允许你指定一个调度器（dispatcher）：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    协程引擎的默认调度器（dispatcher）是 `Dispatchers.Default`
:::

### 限制 - 混合模块/延迟模块

目前，我们建议避免在启动时混合模块和延迟模块。避免 `mainModule` 需要 `lazyReporter` 中的依赖项。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前 Koin 不会检查你的模块是否依赖于延迟模块
:::