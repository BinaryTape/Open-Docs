---
title: 延遲模組與背景載入
---

在本節中，我們將了解如何使用延遲載入（lazy loading）方法來組織您的模組。

## 定義延遲模組 [實驗性]

您現在可以宣告延遲 Koin 模組，以避免觸發任何資源的預分配，並在 Koin 啟動時於背景載入它們。

- `lazyModule` - 宣告 Koin 模組的延遲 Kotlin 版本
- `Module.includes` - 允許包含延遲模組

好的範例總是有助於理解：

```kotlin
// 一些延遲模組
val m2 = lazyModule {
    singleOf(::ClassB)
}

// 包含 m2 延遲模組
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    `LazyModule` 在透過以下 API 載入之前，不會觸發任何資源
:::

## 使用 Kotlin 協同程式進行背景載入 [實驗性]

一旦您宣告了一些延遲模組，您就可以從您的 Koin 配置中在背景載入它們，甚至更多。

- `KoinApplication.lazyModules` - 使用協同程式在背景載入延遲模組，並遵循平台預設的 `Dispatchers`
- `Koin.waitAllStartJobs` - 等待啟動任務完成
- `Koin.runOnKoinStarted` - 在啟動完成後執行程式碼區塊

好的範例總是有助於理解：

```kotlin
startKoin {
    // 在背景載入延遲模組
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// 等待載入任務完成
koin.waitAllStartJobs()

// 或在載入完成後執行程式碼
koin.runOnKoinStarted { koin ->
    // 在背景載入完成後執行
}
```

:::note
    `lazyModules` 函式允許您指定一個發送器（dispatcher）：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    協同程式引擎的預設發送器為 `Dispatchers.Default`
:::

### 限制 - 混合模組／延遲模組

目前我們建議在啟動時避免混合模組與延遲模組。避免讓 `mainModule` 需要 `lazyReporter` 中的相依性。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前 Koin 不會檢查您的模組是否依賴於延遲模組
:::