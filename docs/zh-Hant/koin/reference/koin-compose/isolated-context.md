---
title: 在 Compose 應用程式中使用隔離上下文
---

使用 Compose 應用程式時，您可以透過相同的方式使用 [隔離上下文](/docs/reference/koin-core/context-isolation.md) 來處理 SDK 或白牌應用程式，以避免將您的 Koin 定義與最終使用者的定義混淆。

## 定義隔離上下文

首先，讓我們宣告隔離上下文持有者，以便將隔離的 Koin 執行個體儲存在記憶體中。這可以透過像這樣的簡單 `Object` 類別來完成。`MyIsolatedKoinContext` 類別持有了我們的 Koin 執行個體：

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

## 在 Compose 中設定隔離上下文

現在您已經定義了隔離的 Koin 上下文，我們可以將其設定到 Compose 中以供使用並覆寫所有 API。只需在根 Compose 函式中使用 `KoinIsolatedContext` 即可。這會將您的 Koin 上下文傳遞到所有子級 Composable 中。

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
使用 `KoinIsolatedContext` 後，所有 Koin Compose API 都將使用您的 Koin 隔離上下文
:::