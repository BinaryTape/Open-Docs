---
title: 在 Compose 应用程序中使用隔离上下文
---

在 Compose 应用程序中，你可以采用同样的方式使用 [隔离上下文](/docs/reference/koin-core/context-isolation.md) 来处理 SDK 或白标应用，从而避免将你的 Koin 定义与最终用户的定义混淆。

## 定义隔离上下文

首先，让我们声明隔离上下文持有者，以便将隔离的 Koin 实例存储在内存中。可以使用如下简单的 Object 类来完成。`MyIsolatedKoinContext` 类持有我们的 Koin 实例：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // 声明使用的模块
        modules(sdkAppModule)
    }
}
```

:::note
根据你的初始化需求调整 `MyIsolatedKoinContext` 类
:::

## 在 Compose 中设置隔离上下文

既然你已经定义了隔离的 Koin 上下文，我们就可以将其设置到 Compose 中以供使用并重写所有 API。只需在根 Compose 函数中使用 `KoinIsolatedContext`。这将在所有子可组合项中传播你的 Koin 上下文。

```kotlin
@Composable
fun App() {
    // 将当前 Koin 实例设置到 Compose 上下文
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
在使用 `KoinIsolatedContext` 之后，所有 Koin Compose API 都将使用你的 Koin 隔离上下文
:::