---
title: Jetpack ComposeおよびCompose Multiplatform向けのKoin
---

このページでは、[Android Jetpack Compose](https://developer.android.com/jetpack/compose) または [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) アプリで依存関係を注入する方法について説明します。

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024年半ば以降、ComposeアプリケーションはKoin Multiplatform APIを使用して作成できるようになりました。Koin Jetpack Compose (`koin-androidx-compose`) と Koin Compose Multiplatform (`koin-compose`) の間ですべてのAPIが共通化されています。

### ComposeにはどのKoinパッケージを使用すべきか？

Android Jetpack Compose APIのみを使用する純粋なAndroidアプリの場合は、以下のパッケージを使用してください。
- `koin-androidx-compose` - Compose基本API + Compose ViewModel APIを利用可能にします
- `koin-androidx-compose-navigation` - Navigation APIと統合されたCompose ViewModel API

Android/マルチプラットフォーム（Multiplatform）アプリの場合は、以下のパッケージを使用してください。
- `koin-compose` - Compose基本API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Navigation APIと統合されたCompose ViewModel API

## 既存のKoinコンテキストから開始する

Composeアプリケーションの前に `startKoin` 関数を使用することで、アプリケーションでKoinの注入を利用できるようになります。ComposeでKoinコンテキストをセットアップするために追加で必要なことはありません。

:::note
`KoinContext` および `KoinAndroidContext` は非推奨です。
:::

## ComposeアプリでKoinを開始する - KoinApplication
`startKoin` 関数を実行できる場所にアクセスできない場合は、ComposeとKoinに頼ってKoinの設定を開始できます。

Composable関数である `KoinApplication` は、ComposableとしてKoinアプリケーションインスタンスを作成するのに役立ちます。

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // ここにスクリーンを記述 ...
        MyScreen()
    }
}
```

`KoinApplication` 関数は、Composeコンテキストのサイクルに合わせて、Koinコンテキストの開始と停止を処理します。この関数は、新しいKoinアプリケーションコンテキストを開始および停止します。

:::info
Androidアプリケーションでは、`KoinApplication` は設定変更（configuration changes）やActivityの破棄に伴うKoinコンテキストの停止/再開の必要性を処理します。
:::

:::note
（実験的API）
`KoinMultiplatformApplication` を使用して、マルチプラットフォームのエントリポイントを置き換えることができます。これは `KoinApplication` と同じですが、`androidContext` と `androidLogger` を自動的に注入します。
:::

## KoinApplicationPreviewによるComposeプレビュー

Composable関数 `KoinApplicationPreview` は、Composableのプレビュー専用です。

```kotlin
@Preview(name = "1 - Pixel 2 XL", device = Devices.PIXEL_2_XL, locale = "en")
@Preview(name = "2 - Pixel 5", device = Devices.PIXEL_5, locale = "en", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "3 - Pixel 7 ", device = Devices.PIXEL_7, locale = "ru", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun previewVMComposable(){
    KoinApplicationPreview(application = { modules(appModule) }) {
        ViewModelComposable()
    }
}
```

## @Composable内での注入

Composable関数を記述する際、Koinコンテナからインスタンスを注入するためのKoin API `koinInject()` にアクセスできます。

'MyService' コンポーネントを宣言するモジュールの場合：

```kotlin
val androidModule = module {
    single { MyService() }
    // または コンストラクタ DSL
    singleOf(::MyService)
}
```

以下のようにインスタンスを取得できます：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Composeの関数型の側面を維持するために、最適な記述方法は関数のパラメータに直接インスタンスを注入することです。この方法により、Koinによるデフォルトの実装を持ちつつ、必要に応じてインスタンスを自由に注入できる柔軟性を保つことができます。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### パラメータを指定して @Composable 内に注入する

Koinから新しい依存関係を要求する際に、パラメータを注入する必要がある場合があります。これを行うには、`koinInject` 関数の `parameters` パラメータを `parametersOf()` 関数とともに以下のように使用します。

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }` のようにラムダ注入でパラメータを使用することもできますが、周囲で頻繁に再コンポーズ（recomposition）が発生する場合、パフォーマンスに影響を与える可能性があります。このラムダ版では、パラメータの `remember` を避けるために、呼び出し時にパラメータをアンラップする必要があります。

Koin バージョン 4.0.2 からは、最も効率的な方法でパラメータを使用できるように `koinInject(Qualifier, Scope, ParametersHolder)` が導入されました。
:::

## @Composable 用の ViewModel

通常の single/factory インスタンスにアクセスするのと同じように、以下の Koin ViewModel API にアクセスできます。

* `koinViewModel()` - ViewModel インスタンスを注入
* `koinNavViewModel()` - ViewModel インスタンス + Navigation 引数データを注入 (`Navigation` API を使用している場合)

'MyViewModel' コンポーネントを宣言するモジュールの場合：

```kotlin
module {
    viewModel { MyViewModel() }
    // または コンストラクタ DSL
    viewModelOf(::MyViewModel)
}
```

以下のようにインスタンスを取得できます：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

関数のパラメータでインスタンスを取得することもできます：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Composeのアップデートに伴い、Lazy APIはサポートされていません。
:::

### 共有 Activity ViewModel (4.1 - Android)

`koinActivityViewModel()` を使用して、同じ ViewModel ホストである Activity から ViewModel を注入できるようになりました。

```kotlin
@Composable
fun App() {
    // ActivityレベルでViewModelインスタンスを保持
    val vm = koinActivityViewModel<MyViewModel>()
}
```

### @Composable 用の ViewModel と SavedStateHandle

`SavedStateHandle` コンストラクタパラメータを持つことができ、これは Compose 環境 (Navigation BackStack または ViewModel) に応じて注入されます。
ViewModel の `CreationExtras` 経由、または Navigation の `BackStackEntry` 経由のいずれかで注入されます。

```kotlin
// Navhost で objectId 引数を設定
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

// ViewModel に注入される引数
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
SavedStateHandle 注入の違いに関する詳細：https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

### 共有 ViewModel と Navigation (実験的)

Koin Compose Navigation に `NavBackEntry.sharedKoinViewModel()` 関数が追加され、現在の `NavBackEntry` に既に保存されている ViewModel を取得できるようになりました。ナビゲーション部分の中で、単に `sharedKoinViewModel` を使用します。

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // ここで SharedViewModel を使用 ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

## Composable に紐付いたモジュールのロードとアンロード

Koin は、特定の Composable 関数に対して特定のモジュールをロードする方法を提供します。`rememberKoinModules` 関数は Koin モジュールをロードし、現在の Composable で保持（remember）します。

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // このコンポーネントの初回呼び出し時にモジュールをロード
    rememberKoinModules(myModule)
}
```

以下の2つの側面でモジュールをアンロードするために、abandon 関数のいずれかを使用できます。
- onForgotten - コンポジションが破棄された後
- onAbandoned - コンポジションが失敗したとき

これには、`rememberKoinModules` の `unloadOnForgotten` または `unloadOnAbandoned` 引数を使用してください。

## Composable による Koin Scope の作成

Composable 関数 `rememberKoinScope` および `KoinScope` を使用すると、Composable 内で Koin Scope を処理でき、Composable が終了したときにスコープを閉じるように追従します。

:::info
この API は現時点ではまだ不安定（unstable）です。
:::