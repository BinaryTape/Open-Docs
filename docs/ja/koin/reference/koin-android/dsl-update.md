---
title: Android用コンストラクタDSL
---

## 新しいコンストラクタDSL (3.2以降)

Koinは現在、クラスのコンストラクタを直接ターゲットにし、ラムダ式の中に定義を記述することを回避できる新しい種類のDSLキーワードを提供しています。

詳細については、新しい[コンストラクタDSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32)のセクションを確認してください。

Androidでは、これに付随して以下の新しいコンストラクタDSLキーワードが導入されています：

* `viewModelOf()` - `viewModel { }` と同等
* `fragmentOf()` - `fragment { }` と同等
* `workerOf()` - `worker { }` と同等

:::info
クラスのコンストラクタをターゲットにするために、クラス名の前に必ず `::` を使用してください。
:::

### Androidでの例

以下のコンポーネントを持つAndroidアプリケーションがあるとします：

```kotlin
// シンプルなサービス
class SimpleServiceImpl() : SimpleService

// 注入されたパラメータ "id" を受け取り、SimpleService を使用する Presenter
class FactoryPresenter(val id: String, val service: SimpleService)

// 注入されたパラメータ "id" を受け取り、SimpleService を使用し、SavedStateHandle を取得する ViewModel
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// MyActivity へのリンクを（スコープから）受け取ることができるスコープ付き Session
class Session(val activity: MyActivity)

// SimpleService を使用し、Context と WorkerParameters を取得する Worker
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

これらは次のように宣言できます：

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

## AndroidリフレクションDSL (3.2以降は非推奨)

:::caution
KoinリフレクションDSLは現在非推奨です。上記のKoinコンストラクタDSLを使用してください。
:::