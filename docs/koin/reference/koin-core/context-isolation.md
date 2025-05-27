---
title: 上下文隔离
---

## 什么是上下文隔离？

对于 SDK 开发者来说，你也可以用非全局的方式使用 Koin：将 Koin 用于你的库的依赖注入，并通过隔离你的上下文来避免使用你的库和 Koin 之间发生任何冲突。

通常，我们可以这样启动 Koin：

```kotlin
// start a KoinApplication and register it in Global context
startKoin {

    // declare used modules
    modules(...)
}
```

这会使用默认的 Koin 上下文来注册你的依赖项。

但是，如果我们想使用一个隔离的 Koin 实例，你需要声明一个实例并将其存储在一个类中以持有该实例。你将需要让你的 Koin Application 实例在你的库中保持可用，并将其传递给你的自定义 KoinComponent 实现：

这里的 `MyIsolatedKoinContext` 类持有了我们的 Koin 实例：

```kotlin
// Get a Context for your Koin instance
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // declare used modules
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

让我们使用 `MyIsolatedKoinContext` 来定义 `IsolatedKoinComponent` 类，这是一个将使用我们隔离上下文的 KoinComponent：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // Override default Koin instance
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

一切就绪，只需使用 `IsolatedKoinComponent` 从隔离上下文中获取实例即可：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & get will target MyKoinContext
}
```

## 测试

为了测试通过 `by inject()` 委托获取依赖项的类，可以重写 `getKoin()` 方法并定义自定义 Koin 模块：

```kotlin
class MyClassTest : KoinTest {
    // Koin Context used to retrieve dependencies
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // Define custom Koin module
        val module = module {
            // Register dependencies
        }

        koin.loadModules(listOf(module))
    }
}
```