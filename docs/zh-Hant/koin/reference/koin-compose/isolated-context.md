---
title: 在 Compose 應用程式中使用孤立上下文
---

對於 Compose 應用程式，您可以以相同的方式使用[孤立上下文](/docs/reference/koin-core/context-isolation.md)，以處理 SDK 或白標應用程式，從而避免將您的 Koin 定義與終端使用者的定義混淆。

## 定義孤立上下文

首先，讓我們宣告我們的孤立上下文持有者，以便將我們的孤立 Koin 實例儲存在記憶體中。這可以透過一個簡單的 Object 類別來完成，如下所示。`MyIsolatedKoinContext` 類別持有我們的 Koin 實例：

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
請根據您的初始化需求調整 `MyIsolatedKoinContext` 類別。
:::

## 使用 Compose 設定孤立上下文

現在您已經定義了一個孤立的 Koin 上下文，我們可以將其設定到 Compose 中，以便使用它並覆寫所有 API。只需在根 Compose 函數中使用 `KoinIsolatedContext`。這會將您的 Koin 上下文傳播到所有子 composables 中。

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
所有 Koin Compose API 在使用 `KoinIsolatedContext` 後，將會使用您的 Koin 孤立上下文。
:::