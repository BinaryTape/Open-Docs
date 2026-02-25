---
title: 延迟加载模块与后台加载
---

在本节中，我们将了解如何使用延迟加载方法来组织模块。

## 定义延迟加载模块 [实验性]

现在您可以声明延迟加载 Koin 模块，以避免触发任何资源的预分配，并在 Koin 启动时在后台加载它们。

- `lazyModule` - 声明 Koin 模块的延迟加载 Kotlin 版本
- `Module.includes` - 允许包含延迟加载模块

好的示例总是更有助于理解：

```kotlin
// 一些延迟加载模块
val m2 = lazyModule {
    singleOf(::ClassB)
}

// 包含 m2 延迟加载模块
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    `LazyModule` 在被以下 API 加载之前不会触发任何资源
:::

## 使用 Kotlin 协程进行后台加载 [实验性]

声明延迟加载模块后，您可以从 Koin 配置及后续步骤中在后台加载它们。

- `KoinApplication.lazyModules` - 使用协程在后台加载延迟加载模块，参考平台默认的 `Dispatcher`
- `Koin.waitAllStartJobs` - 等待启动作业完成
- `Koin.runOnKoinStarted` - 在启动完成后运行代码块

好的示例总是更有助于理解：

```kotlin
startKoin {
    // 在后台加载延迟加载模块
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// 等待加载作业完成
koin.waitAllStartJobs()

// 或者在加载完成后运行代码
koin.runOnKoinStarted { koin ->
    // 在后台加载完成后运行
}
```

:::note
    `lazyModules` 函数允许您指定一个 `dispatcher`：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    协程引擎的默认 `dispatcher` 是 `Dispatchers.Default`
:::

### 限制 - 混合使用模块/延迟加载模块

目前，我们建议在启动时避免混合使用模块和延迟加载模块。避免让 `mainModule` 需要 `lazyReporter` 中的依赖项。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前 Koin 不会检查您的模块是否依赖于延迟加载模块
:::