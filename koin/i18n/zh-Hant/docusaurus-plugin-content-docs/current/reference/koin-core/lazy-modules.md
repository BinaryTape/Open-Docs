---
title: "延遲載入模組（Lazy Modules）與背景載入 (Background Loading)"
---
在本節中，我們將了解如何使用延遲加載（lazy loading）方法來組織你的模組。

## 定義延遲模組 [實驗性]

你現在可以宣告延遲 Koin 模組（lazy Koin module），以避免觸發任何資源的預先分配，並在 Koin 啟動時在後台加載它們。

- `lazyModule` - 宣告一個 Koin 模組的延遲 Kotlin 版本
- `Module.includes` - 允許包含延遲模組

一個好的範例總是更容易理解：

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
    在透過以下 API 加載 `LazyModule` 之前，它不會觸發任何資源
:::

## 使用 Kotlin 協程進行背景加載 [實驗性]

一旦你宣告了一些延遲模組，你就可以從你的 Koin 配置中，以及更進一步地在後台加載它們。

- `KoinApplication.lazyModules` - 使用協程在後台加載延遲模組，關於平台預設的 Dispatchers
- `Koin.waitAllStartJobs` - 等待啟動工作完成
- `Koin.runOnKoinStarted` - 在啟動完成後執行程式碼塊

一個好的範例總是更容易理解：

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
    `lazyModules` 函數允許你指定一個 dispatcher：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    協程引擎的預設 dispatcher 是 `Dispatchers.Default`
:::

### 限制 - 混合模組/延遲模組

目前，我們建議避免在啟動時混合使用模組和延遲模組。 避免讓 `mainModule` 需要 `lazyReporter` 中的依賴。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
目前，Koin 不會檢查你的模組是否依賴於延遲模組
:::