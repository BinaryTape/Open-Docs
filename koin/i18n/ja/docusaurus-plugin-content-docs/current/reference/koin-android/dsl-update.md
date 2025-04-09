---
title: "Android 向け Constructor DSL"
---
## 新しいコンストラクタ DSL (3.2 以降)

Koin は、クラスのコンストラクタを直接ターゲットにできる新しい種類の DSL キーワードを提供するようになりました。これにより、ラムダ式内で定義を入力する必要がなくなります。

詳細については、新しい[コンストラクタ DSL](/reference/koin-core/dsl-update.md)セクションを確認してください。

Android の場合、これは次の新しいコンストラクタ DSL キーワードを意味します。

* `viewModelOf()` - `viewModel { }` と同等
* `fragmentOf()` - `fragment { }` と同等
* `workerOf()` - `worker { }` と同等

:::info
クラスコンストラクタをターゲットにするには、クラス名の前に `::` を必ず使用してください。
:::

### Android の例

次のコンポーネントを持つ Android アプリケーションがあるとします。

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

これらは次のように宣言できます。

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

## Android Reflection DSL (3.2 以降非推奨)

:::caution
Koin Reflection DSL は非推奨になりました。上記の Koin コンストラクタ DSL を使用してください。
:::