---
title: 适用于 Android 的构造函数 DSL
---

## 新的构造函数 DSL（自 3.2 版本起）

Koin 现在提供了一种新型 DSL 关键字，允许你直接指向类构造函数，并避免在 lambda 表达式中输入定义。

查看新的 [构造函数 DSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 部分以了解更多详细信息。

对于 Android，这涉及以下新的构造函数 DSL 关键字：

* `viewModelOf()` - 等效于 `viewModel { }`
* `fragmentOf()` - 等效于 `fragment { }`
* `workerOf()` - 等效于 `worker { }`

:::info
请确保在类名前使用 `::` 以指向类构造函数
:::

### Android 示例

假设一个包含以下组件的 Android 应用程序：

```kotlin
// 一个简单的服务
class SimpleServiceImpl() : SimpleService

// 一个 Presenter，使用 SimpleService 并可以接收 "id" 注入参数
class FactoryPresenter(val id: String, val service: SimpleService)

// 一个 ViewModel，可以接收 "id" 注入参数，使用 SimpleService 并获取 SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// 一个作用域化的 Session，可以接收指向 MyActivity 的链接（来自作用域）
class Session(val activity: MyActivity)

// 一个 Worker，使用 SimpleService 并获取 Context 和 WorkerParameters
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

## Android 反射 DSL（自 3.2 版本起已弃用）

:::caution
Koin 反射 DSL 现在已弃用。请使用上述 Koin 构造函数 DSL
:::