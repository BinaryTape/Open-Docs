---
title: "Android 的建構函式 DSL"
---
## 全新建構函式 DSL（自 3.2 起）

Koin 現在提供了一種新型的 DSL 關鍵字，可讓您直接鎖定類別建構函式，並避免在 Lambda 運算式中輸入定義。

請查看新的[建構函式 DSL](/reference/koin-core/dsl-update.md) 章節，以瞭解更多詳細資訊。

對於 Android，這意味著以下新的建構函式 DSL 關鍵字：

* `viewModelOf()` - 等效於 `viewModel { }`
* `fragmentOf()` - 等效於 `fragment { }`
* `workerOf()` - 等效於 `worker { }`

:::info
請務必在類別名稱前使用 `::`，以鎖定您的類別建構函式
:::

### 一個 Android 範例

假設有一個具有以下元件的 Android 應用程式：

```kotlin
// A simple service
class SimpleServiceImpl() : SimpleService

// a Presenter, using SimpleService and can receive "id" injected param
class FactoryPresenter(val id: String, val service: SimpleService)

// a ViewModel that can receive "id" injected param, use SimpleService and get SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// a scoped Session, that can received link to the MyActivity (from scope)
class Session(val activity: MyActivity)

// a Worker, using SimpleService and getting Context & WorkerParameters
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

我們可以像這樣宣告它們：

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
Koin 反射 DSL 現已棄用。請使用上面的 Koin 建構函式 DSL
:::