---
title: Android 的建構函式 DSL
---

## 新的建構函式 DSL（自 3.2 起）

Koin 現在提供了一種新型態的 DSL 關鍵字，讓您可以直接指向類別建構函式，並避免必須在 Lambda 運算式中輸入定義。

請參閱新的 [建構函式 DSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 章節以了解更多細節。

對於 Android，這包含了以下新的建構函式 DSL 關鍵字：

* `viewModelOf()` - 等同於 `viewModel { }`
* `fragmentOf()` - 等同於 `fragment { }`
* `workerOf()` - 等同於 `worker { }`

:::info
請確保在類別名稱前使用 `::`，以指向您的類別建構函式
:::

### Android 範例

假設一個具有以下元件的 Android 應用程式：

```kotlin
// 一個簡單的服務
class SimpleServiceImpl() : SimpleService

// 一個 Presenter，使用 SimpleService 且可接收 "id" 注入參數
class FactoryPresenter(val id: String, val service: SimpleService)

// 一個 ViewModel，可接收 "id" 注入參數、使用 SimpleService 並獲取 SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// 一個有作用域的 Session，可接收指向 MyActivity 的連結（來自作用域）
class Session(val activity: MyActivity)

// 一個 Worker，使用 SimpleService 並獲取 Context 和 WorkerParameters
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

我們可以這樣宣告它們：

```kotlin
module {
    singleOf(::SimpleServiceImpl){ bind<SimpleService>() }

    factoryOf(::FactoryPresenter)

    viewModelOf(::SimpleViewModel)

    scope<MyActivity>(){
        scopedOf(::Session) 
    }

    workerOf(::SimpleWorker)
}
```

## Android 反射 DSL（自 3.2 起已棄用）

:::caution
Koin 反射 DSL 現已棄用。請使用上方的 Koin 建構函式 DSL
:::