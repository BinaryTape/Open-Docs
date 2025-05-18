---
title: "Android 的构造器 DSL"
---
## 新的构造函数 DSL（自 3.2 起）

Koin 现在提供了一种新的 DSL 关键字，允许您直接定位类的构造函数，避免在 lambda 表达式中键入定义。

查看新的 [构造函数 DSL](/reference/koin-core/dsl-update.md) 部分，了解更多详细信息。

对于 Android，这表示以下新的构造函数 DSL 关键字：

* `viewModelOf()` - 相当于 `viewModel { }`
* `fragmentOf()` - 相当于 `fragment { }`
* `workerOf()` - 相当于 `worker { }`

:::info
请务必在类名前使用 `::`，以定位您的类构造函数
:::

### 一个 Android 示例

给定一个具有以下组件的 Android 应用程序：

```kotlin
// 一个简单的服务
class SimpleServiceImpl() : SimpleService

// 一个 Presenter，使用 SimpleService 并且可以接收注入的 "id" 参数
class FactoryPresenter(val id: String, val service: SimpleService)

// 一个 ViewModel，可以接收注入的 "id" 参数，使用 SimpleService 并获取 SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// 一个有作用域的 Session，可以接收与 MyActivity 的链接（来自作用域）
class Session(val activity: MyActivity)

// 一个 Worker，使用 SimpleService 并获取 Context & WorkerParameters
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

我们可以像这样声明它们：

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
Koin 反射 DSL 现在已弃用。请使用上面的 Koin 构造函数 DSL
:::