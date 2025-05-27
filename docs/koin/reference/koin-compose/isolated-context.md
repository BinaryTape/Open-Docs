---
title: 在 Compose 应用中使用隔离上下文
---

对于 Compose 应用，你可以使用[隔离上下文](/docs/reference/koin-core/context-isolation.md)以相同的方式处理 SDK 或白标应用，从而避免将你的 Koin 定义与终端用户的定义混淆。

## 定义隔离上下文

首先，让我们声明我们的隔离上下文持有者，以便在内存中存储隔离的 Koin 实例。这可以通过一个简单的对象类来完成，如下所示。`MyIsolatedKoinContext` 类持有我们的 Koin 实例：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
请根据你的初始化需求调整 `MyIsolatedKoinContext` 类
:::

## 在 Compose 中设置隔离上下文

现在你已经定义了隔离的 Koin 上下文，我们可以将其设置到 Compose 中，以便使用并覆盖所有 API。只需在根 Compose 函数中使用 `KoinIsolatedContext`。这将把你的 Koin 上下文传播到所有子 Composable 中。

```kotlin
@Composable
fun App() {
    // Set current Koin instance to Compose context
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
在使用 `KoinIsolatedContext` 之后，所有 Koin Compose API 都将使用你的 Koin 隔离上下文
:::