---
title: Jetpack Compose および Compose Multiplatform 向けの Koin
---

このページでは、[Android Jetpack Compose](https://developer.android.com/jetpack/compose) または [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) アプリケーションで依存関係を注入する方法について説明します。

## Koin Compose Multiplatform と Koin Android Jetpack Compose の比較

2024年半ば以降、Compose アプリケーションは Koin Multiplatform API を使用して開発できるようになりました。Koin Jetpack Compose (koin-androidx-compose) と Koin Compose Multiplatform (koin-compose) の間のすべての API は同一です。

### Compose にはどの Koin パッケージを使用するか？

Android Jetpack Compose API のみを使用する純粋な Android アプリケーションの場合、以下のパッケージを使用します:
- `koin-androidx-compose` - Compose のベース API と Compose ViewModel API を有効にする
- `koin-androidx-compose-navigation` - Navigation API 統合による Compose ViewModel API

Android/Multiplatform アプリケーションの場合、以下のパッケージを使用します:
- `koin-compose` - Compose のベース API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation API 統合による Compose ViewModel API

## 既存の Koin コンテキストから開始する (Koin が既に起動している場合)

`startKoin` 関数がアプリケーション内で既に Koin を起動するために使用されている場合があります（例えば、Android のメインアプリクラスである `Application` クラスなど）。その場合、`KoinContext` または `KoinAndroidContext` を使用して、現在の Koin コンテキストを Compose アプリケーションに知らせる必要があります。これらの関数は既存の Koin コンテキストを再利用し、それを Compose アプリケーションにバインドします。

```kotlin
@Composable
fun App() {
    // 現在の Koin インスタンスを Compose コンテキストに設定
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext` と `KoinContext` の違い:
- `KoinAndroidContext` は、Koin インスタンスのために現在の Android アプリのコンテキストを探します。
- `KoinContext` は、Koin インスタンスのために現在の GlobalContext を探します。
:::

:::note
Composable から `ClosedScopeException` が発生した場合、Composable で `KoinContext` を使用するか、[Android コンテキストでの適切な Koin の起動設定](/docs/reference/koin-android/start.md#from-your-application-class)がされていることを確認してください。
:::

## Compose アプリケーションで Koin を起動する - KoinApplication

`KoinApplication` 関数は、Koin アプリケーションインスタンスを Composable として作成するのに役立ちます:

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // your screens here ...
        MyScreen()
    }
}
```

`KoinApplication` 関数は、Compose コンテキストのライフサイクルに応じて、Koin コンテキストの開始と停止を処理します。この関数は新しい Koin アプリケーションコンテキストを開始および停止します。

:::info
Android アプリケーションでは、`KoinApplication` は設定変更や Activity のドロップに伴う Koin コンテキストの停止/再起動の必要性を処理します。
:::

:::note
これは、従来の `startKoin` アプリケーション関数の使用を置き換えるものです。
:::

### Koin を使用した Compose プレビュー

`KoinApplication` 関数は、プレビュー用の専用コンテキストを開始するのに興味深いものです。これは Compose プレビューを支援するためにも使用できます:

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // your preview config here
        modules(previewModule)
    }) {
        // Compose to preview with Koin
    }
}
```

## @Composable への注入

Composable 関数を記述する際、Koin コンテナからインスタンスを注入するための Koin API である `koinInject()` にアクセスできます。

'MyService' コンポーネントを宣言するモジュールの場合:

```kotlin
val androidModule = module {
    single { MyService() }
    // or constructor DSL
    singleOf(::MyService)
}
```

インスタンスは次のように取得できます:

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Compose の関数型アスペクトに合わせるため、最適な記述アプローチは、インスタンスを関数のパラメーターに直接注入することです。この方法により、Koin を使用したデフォルトの実装が可能になりつつ、インスタンスを自由に注入する余地を残します。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### パラメーターを持つ @Composable への注入

Koin から新しい依存関係を要求する際に、パラメーターを注入する必要がある場合があります。これを行うには、`koinInject` 関数の `parameters` パラメーターを `parametersOf()` 関数とともに次のように使用できます:

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }` のようにラムダ注入でパラメーターを使用できますが、頻繁に再コンポーズする場合、パフォーマンスに影響を与える可能性があります。このラムダを使ったバージョンは、呼び出し時にパラメーターをアンラップする必要があり、パラメーターを記憶するのを避けるのに役立ちます。

Koin のバージョン 4.0.2 から、パラメーターを最も効率的な方法で使用できるように `koinInject(Qualifier,Scope,ParametersHolder)` が導入されました。
:::

## @Composable 用の ViewModel

従来の single/factory インスタンスにアクセスするのと同様に、以下の Koin ViewModel API にアクセスできます:

*   `koinViewModel()` - ViewModel インスタンスを注入
*   `koinNavViewModel()` - ViewModel インスタンス + Navigation 引数データ（`Navigation` API を使用している場合）を注入

'MyViewModel' コンポーネントを宣言するモジュールの場合:

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

インスタンスは次のように取得できます:

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

インスタンスは関数のパラメーターでも取得できます:

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose の更新では Lazy API はサポートされていません。
:::

### @Composable 用の ViewModel と SavedStateHandle

`SavedStateHandle` コンストラクターパラメーターを持つことができ、それは Compose 環境（Navigation の BackStack または ViewModel）に応じて注入されます。
ViewModel の `CreationExtras` 経由で注入されるか、Navigation の `BackStackEntry` 経由で注入されます:

```kotlin
// Setting objectId argument in Navhost
NavHost(
    navController,
    startDestination = "list"
) {
    composable("list") { backStackEntry ->
        //...
    }
    composable("detail/{objectId}") { backStackEntry ->
        val objectId = backStackEntry.arguments?.getString("objectId")?.toInt()
        DetailScreen(navController, objectId!!)
    }
}

// Injected Argument in ViewModel
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
SavedStateHandle の注入の違いに関する詳細: https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

## Composable に紐付けられたモジュールのロードとアンロード

Koin は、特定の Composable 関数用に特定のモジュールをロードする方法を提供します。`rememberKoinModules` 関数は、Koin モジュールをロードし、現在の Composable 上でそれらを記憶します:

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // このコンポーネントが最初に呼び出されたときにモジュールをロード
    rememberKoinModules(myModule)
}
```

2つの側面でモジュールをアンロードするために、以下の機能を使用できます:
- `onForgotten` - コンポジションがドロップされた後
- `onAbandoned` - コンポジションが失敗した場合

このためには、`rememberKoinModules` の `unloadOnForgotten` または `unloadOnAbandoned` 引数を使用します。

## Composable で Koin スコープを作成する

Composable 関数 `rememberKoinScope` および `KoinScope` は、Composable 内で Koin Scope を処理し、Composable の終了時にスコープを閉じるように追跡します。

:::info
この API は現時点ではまだ不安定です。
:::