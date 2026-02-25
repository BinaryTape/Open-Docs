---
title: Android 中的多个 Koin 模块
---

通过使用 Koin，您可以在模块中描述定义。在本节中，我们将了解如何声明、组织和链接您的模块。

## 使用多个模块

组件不必非要在同一个模块中。模块是一个逻辑空间，可以帮助您组织定义，并且可以依赖于另一个模块中的定义。定义是延迟加载的，只有在组件请求它们时才会被解析。

让我们来看一个例子，其中链接的组件位于不同的模块中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 单例 ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 带有链接实例 ComponentA 的单例 ComponentB
    single { ComponentB(get()) }
}
```

我们只需在启动 Koin 容器时声明使用的模块列表：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 加载模块
            modules(moduleA, moduleB)
        }
        
    }
}
```
您可以根据 Gradle 模块进行组织，并收集多个 Koin 模块。

> 检查 [Koin 模块部分](/docs/reference/koin-core/modules)以了解详情

## 模块包含（自 3.2 起）

`Module` 类中提供了一个新函数 `includes()`，它允许您通过以有组织且结构化的方式包含其他模块来组合模块。

该新功能的两个主要用例是：
- 将大型模块拆分为更小且更专注的模块。
- 在模块化项目中，它允许您对模块可见性进行更精细的控制（参见下面的示例）。

它是如何工作的？让我们取一些模块，并将它们包含在 `parentModule` 中：

```kotlin
// `:feature` 模块
val childModule1 = module {
    /* 此处为其他定义。 */
}
val childModule2 = module {
    /* 此处为其他定义。 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 模块
startKoin { modules(parentModule) }
```

请注意，我们不需要显式设置所有模块：通过包含 `parentModule`，`includes` 中声明的所有模块都将自动加载（`childModule1` 和 `childModule2`）。换句话说，Koin 实际上加载了：`parentModule`、`childModule1` 和 `childModule2`。

一个需要观察的重要细节是，您也可以使用 `includes` 来添加 `internal` 和 `private` 模块——这为您在模块化项目中暴露哪些内容提供了灵活性。

:::info
模块加载现在经过优化，可以扁平化所有模块图并避免重复的模块定义。
:::

最后，您可以包含多个嵌套或重复的模块，Koin 将扁平化所有包含的模块并移除重复项：

```kotlin
// :feature 模块
val dataModule = module {
    /* 此处为其他定义。 */
}
val domainModule = module {
    /* 此处为其他定义。 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` 模块
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 加载模块
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

请注意，所有模块将仅包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## 通过后台模块加载减少启动时间

您现在可以声明“延迟加载”Koin 模块，以避免触发任何资源的预分配，并在 Koin 启动时在后台加载它们。通过传递要在后台加载的延迟模块，这有助于避免阻塞 Android 启动过程。

- `lazyModule` - 声明 Koin 模块的延迟 Kotlin 版本
- `Module.includes` - 允许包含延迟模块
- `KoinApplication.lazyModules` - 使用协程在后台加载延迟模块，遵循平台默认的 Dispatchers
- `Koin.waitAllStartJobs` - 等待启动作业完成
- `Koin.runOnKoinStarted` - 在启动完成后运行代码块

一个好的例子总是更有助于理解：

```kotlin

// 延迟加载的模块
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同步模块加载
    modules(m1)
    // 在后台加载延迟模块
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 等待启动完成
koin.waitAllStartJobs()

// 或在启动后运行代码
koin.runOnKoinStarted { koin ->
    // 在后台加载完成后运行
}