---
title: "使用 Compose 應用程式建立隔離環境 (Isolated Context)"
---
使用 Compose 應用程式，您可以透過[隔離的上下文](/reference/koin-core/context-isolation.md)以相同的方式處理 SDK 或白標應用程式 (white label application)，以避免將您的 Koin 定義與最終使用者的定義混淆。

## 定義隔離的上下文 (isolated context)

首先，讓我們宣告隔離的上下文持有者，以便將隔離的 Koin 實例儲存在記憶體中。這可以使用一個簡單的 Object 類別來完成，如下所示。`MyIsolatedKoinContext` 類別持有我們的 Koin 實例：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
根據您的初始化需求調整 `MyIsolatedKoinContext` 類別
:::

## 使用 Compose 設定隔離的上下文 (isolated context)

現在您已經定義了一個隔離的 Koin 上下文，我們可以將其設定到 Compose 中以使用它並覆蓋所有 API。只需在根 Compose 函式中使用 `KoinIsolatedContext` 即可。這將在所有子 composable 中傳播您的 Koin 上下文。

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
在使用 `KoinIsolatedContext` 之後，所有 Koin Compose API 都將使用您的 Koin 隔離的上下文
:::