---
title: Android 的建構函式 DSL
---

## 新的建構函式 DSL (自 3.2 版起)

Koin 現在提供一種新型的 DSL 關鍵字，允許您直接指定類別建構函式，並避免在 lambda 表達式中輸入您的定義。

請查看新的 [建構函式 DSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 部分以獲取更多詳細資訊。

對於 Android，這表示以下新的建構函式 DSL 關鍵字：

*   `viewModelOf()` - 等同於 `viewModel { }`
*   `fragmentOf()` - 等同於 `fragment { }`
*   `workerOf()` - 等同於 `worker { }`

:::info
請確保在類別名稱前使用 `::`，以指定您的類別建構函式
:::

### Android 範例

假設一個 Android 應用程式包含以下元件：

```kotlin
// 一個簡單的服務
class SimpleServiceImpl() : SimpleService

// 一個 Presenter，使用 SimpleService 並可接收注入的 "id" 參數
class FactoryPresenter(val id: String, val service: SimpleService)

// 一個 ViewModel，可接收注入的 "id" 參數、使用 SimpleService 並取得 SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// 一個有作用域的 Session，可接收指向 MyActivity 的連結 (來自作用域)
class Session(val activity: MyActivity)

// 一個 Worker，使用 SimpleService 並取得 Context 與 WorkerParameters
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

## Android 反射 DSL (自 3.2 版起已棄用)

:::caution
Koin 反射 DSL 現已棄用。請改用上方的 Koin 建構函式 DSL。
:::