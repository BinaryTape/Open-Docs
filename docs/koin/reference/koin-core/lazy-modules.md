---
title: 惰性模块与后台加载
---

本节将介绍如何使用惰性加载方式组织你的模块。

## 定义惰性模块 [实验性]

你现在可以声明惰性 Koin 模块，以避免触发任何资源的预分配，并在 Koin 启动时在后台加载它们。

- `lazyModule` - 声明 Koin 模块的惰性 Kotlin 版本
- `Module.includes` - 允许包含惰性模块

一个好的例子总能更好地帮助理解：

```kotlin
// Some lazy modules
val m2 = lazyModule {
    singleOf(::ClassB)
}

// include m2 lazy module
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    `LazyModule` 在通过以下 API 加载之前，不会触发任何资源。
:::

## 使用 Kotlin 协程进行后台加载 [实验性]

声明一些惰性模块后，你可以从 Koin 配置中在后台加载它们，并进行更多操作。

- `KoinApplication.lazyModules` - 使用协程在后台加载惰性模块，遵循平台默认的调度器 (Dispatchers)
- `Koin.waitAllStartJobs` - 等待启动任务完成
- `Koin.runOnKoinStarted` - 在启动完成后运行代码块

一个好的例子总能更好地帮助理解：

```kotlin
startKoin {
    // load lazy Modules in background
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// wait for loading jobs to finish
koin.waitAllStartJobs()

// or run code after loading is done
koin.runOnKoinStarted { koin ->
    // run after background load complete
}
```

:::note
    `lazyModules` 函数允许你指定一个调度器 (dispatcher)：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    协程引擎的默认调度器是 `Dispatchers.Default`
:::

### 限制 - 混合使用模块与惰性模块

目前我们建议在启动时避免混合使用模块和惰性模块。避免让 `mainModule` 依赖于 `lazyReporter`。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前 Koin 不会检查你的模块是否依赖于惰性模块
:::