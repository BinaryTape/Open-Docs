---
title: Android 中使用多个 Koin 模块
---

通过使用 Koin，您可以在模块中描述定义。本节我们将了解如何声明、组织和关联您的模块。

## 使用多个模块

组件不必都在同一个模块中。模块是帮助您组织定义的逻辑空间，并且可以依赖于其他模块的定义。定义是惰性的，它们只在组件请求时才会被解析。

让我们以一个示例来说明，其中关联的组件位于不同的模块中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

当启动 Koin 容器时，我们只需声明所使用的模块列表：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // Load modules
            modules(moduleA, moduleB)
        }
        
    }
}
```
您可以自行根据 Gradle 模块进行组织，并集合多个 Koin 模块。

> 有关更多详细信息，请查阅 [Koin 模块部分](/docs/reference/koin-core/modules)

## 模块包含 (自 3.2 起)

`Module` 类中提供了一个新函数 `includes()`，它允许您通过以有组织和结构化的方式包含其他模块来组合模块。

此新功能的两个主要用例是：
- 将大型模块拆分为更小、更聚焦的模块。
- 在模块化项目中，它允许您对模块可见性进行更精细的控制（参见下面的示例）。

它是如何工作的？让我们以一些模块为例，我们将模块包含在 `parentModule` 中：

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

请注意，我们无需显式设置所有模块：通过包含 `parentModule`，所有在 `includes` 中声明的模块都将自动加载（即 `childModule1` 和 `childModule2`）。换句话说，Koin 实际加载的是：`parentModule`、`childModule1` 和 `childModule2`。

值得注意的一个重要细节是，您还可以使用 `includes` 来添加 `internal` 和 `private` 模块——这为您在模块化项目中暴露（expose）什么提供了灵活性。

:::info
模块加载现在经过优化，可以扁平化所有模块图，并避免重复的模块定义。
:::

最后，您可以包含多个嵌套或重复的模块，Koin 会扁平化所有包含的模块并去除重复项：

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` module
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // Load modules
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

请注意，所有模块将只包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## 通过后台模块加载减少启动时间

您现在可以声明“惰性”Koin 模块，以避免触发任何资源的预分配，并在 Koin 启动时在后台加载它们。通过传递要在后台加载的惰性模块，这有助于避免阻塞 Android 启动过程。

- `lazyModule` - 声明 Koin 模块的惰性 Kotlin 版本
- `Module.includes` - 允许包含惰性模块
- `KoinApplication.lazyModules` - 在后台使用协程加载惰性模块，考虑平台默认的 Dispatchers
- `Koin.waitAllStartJobs` - 等待所有启动任务完成
- `Koin.runOnKoinStarted` - 在启动完成后运行代码块

一个好的例子总能更好地帮助理解：

```kotlin

// Lazy loaded module
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // sync module loading
    modules(m1)
    // load lazy Modules in background
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// wait for start completion
koin.waitAllStartJobs()

// or run code after start
koin.runOnKoinStarted { koin ->
    // run after background load complete
}
```