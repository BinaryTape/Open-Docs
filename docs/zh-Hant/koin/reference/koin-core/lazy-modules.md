---
title: 延遲載入模組與背景載入
---

在本節中，我們將探討如何利用延遲載入 (lazy loading) 方法組織您的模組。

## 定義延遲載入模組 [實驗性]

您現在可以宣告延遲載入的 Koin 模組，以避免觸發任何資源的預先分配，並在 Koin 啟動時於背景載入它們。

*   `lazyModule` - 宣告 Koin 模組的延遲載入 Kotlin 版本
*   `Module.includes` - 允許包含延遲載入模組

一個好的範例總是有助於理解：

```kotlin
// Some lazy modules
val m2 = lazyModule {
    singleOf(::ClassB)
}

// include m2 lazy module
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
延遲載入模組 (LazyModule) 在被下列 API 載入之前，不會觸發任何資源。
:::

## 使用 Kotlin 協程進行背景載入 [實驗性]

一旦您宣告了一些延遲載入模組，您就可以從 Koin 配置中於背景載入它們，甚至更多。

*   `KoinApplication.lazyModules` - 使用協程於背景載入延遲載入模組，依據平台預設的 Dispatchers
*   `Koin.waitAllStartJobs` - 等待啟動任務完成
*   `Koin.runOnKoinStarted` - 在啟動完成後執行程式碼區塊

一個好的範例總是有助於理解：

```kotlin
startKoin {
    // load lazy Modules in background
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// wait for loading jobs to finish
koin.waitAllStartJobs()

// or run code after loading is done
koin.runOnKoinStarted { koin ->
    // run after background load complete
}
```

:::note
`lazyModules` 函數允許您指定一個 dispatcher：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
協程引擎的預設 dispatcher 是 `Dispatchers.Default`。
:::

### 限制 - 混合模組與延遲載入模組

目前我們建議避免在啟動時混合使用模組與延遲載入模組。避免讓 `mainModule` 依賴於 `lazyReporter` 中的內容。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前 Koin 不會檢查您的模組是否依賴於延遲載入模組。
:::