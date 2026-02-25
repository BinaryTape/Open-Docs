---
title: 上下文隔离
---

## 什么是上下文隔离？

对于 SDK 开发者，你也可以以非全局的方式使用 Koin：将 Koin 用于库的依赖注入，并通过隔离上下文来避免库的使用者在使用 Koin 时产生任何冲突。

在标准方式中，我们可以像这样启动 Koin：

```kotlin
// 启动一个 KoinApplication 并将其注册到全局上下文中
startKoin {

    // 声明使用的模块
    modules(...)
}
```

这将使用默认 Koin 上下文来注册你的依赖项。

但如果我们想要使用一个隔离的 Koin 实例，你需要声明一个实例并将其存储在一个类中以持有该实例。
你必须让你的 Koin Application 实例在库中保持可用，并将其传递给你的自定义 `KoinComponent` 实现：

这里的 `MyIsolatedKoinContext` 类持有了我们的 Koin 实例：

```kotlin
// 获取你的 Koin 实例的上下文
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 声明使用的模块
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

让我们使用 `MyIsolatedKoinContext` 来定义我们的 `IsolatedKoinComponent` 类，这是一个将使用我们隔离上下文的 `KoinComponent`：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // 重写默认 Koin 实例
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

一切就绪，只需使用 `IsolatedKoinComponent` 从隔离上下文中检索实例：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject 和 get 将以 MyIsolatedKoinContext 为目标
}
```

## 测试

要测试使用 `by inject()` 委托检索依赖项的类，请重写 `getKoin()` 方法并定义自定义 Koin 模块：

```kotlin
class MyClassTest : KoinTest {
    // 用于检索依赖项的 Koin 上下文
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // 定义自定义 Koin 模块
        val module = module {
            // 注册依赖项
        }

        koin.loadModules(listOf(module))
    }
}