---
title: Android 的构造函数 DSL
---

## 新构造函数 DSL（自 3.2 起）

Koin 现在提供了一种新的 DSL 关键字，它允许您直接定位类构造函数，并避免在 lambda 表达式中输入您的定义。

有关更多详细信息，请查看新的[构造函数 DSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 部分。

对于 Android，这意味着以下新的构造函数 DSL 关键字：

*   `viewModelOf()` - 等同于 `viewModel { }`
*   `fragmentOf()` - 等同于 `fragment { }`
*   `workerOf()` - 等同于 `worker { }`

:::info
请确保在类名前使用 `::`，以定位您的类构造函数
:::

### 一个 Android 示例

给定一个具有以下组件的 Android 应用程序：

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

我们可以这样声明它们：

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

## Android 反射 DSL（自 3.2 起已弃用）

:::caution
Koin 反射 DSL 现已弃用。请使用上面的 Koin 构造函数 DSL。
:::