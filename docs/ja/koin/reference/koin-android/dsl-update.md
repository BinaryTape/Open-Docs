---
title: Android向けコンストラクタDSL
---

## 新しいコンストラクタDSL (3.2以降)

Koinは、クラスのコンストラクタを直接指定できる新しい種類のDSLキーワードを提供するようになりました。これにより、ラムダ式内に定義を記述する必要がなくなります。

詳細については、新しい[コンストラクタDSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32)セクションを参照してください。

Androidの場合、以下の新しいコンストラクタDSLキーワードが提供されます。

*   `viewModelOf()` - `viewModel { }`に相当
*   `fragmentOf()` - `fragment { }`に相当
*   `workerOf()` - `worker { }`に相当

:::info
クラスのコンストラクタをターゲットにするには、クラス名の前に `::` を使用してください。
:::

### Androidの例

以下のコンポーネントを持つAndroidアプリケーションを考えます。

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

これらは以下のように宣言できます。

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

## AndroidリフレクションDSL (3.2以降非推奨)

:::caution
KoinリフレクションDSLは現在非推奨です。上記のKoinコンストラクタDSLを使用してください。
:::