---
title: "Jetpack ComposeとCompose MultiplatformのためのKoin"
---
このページでは、[Android Jetpack Compose](https://developer.android.com/jetpack/compose)または[Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/)アプリに依存関係を注入する方法について説明します。

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

2024年中頃から、ComposeアプリケーションはKoin Multiplatform APIで実行できます。すべてのAPIは、Koin Jetpack Compose (koin-androidx-compose) とKoin Compose Multiplatform (koin-compose) で同一です。

### Compose向けのKoinパッケージ

Android Jetpack Compose APIのみを使用する純粋なAndroidアプリの場合、次のパッケージを使用します。
- `koin-androidx-compose` - Compose base API + Compose ViewModel APIをアンロック
- `koin-androidx-compose-navigation` - Compose ViewModel API とNavigation APIの統合

Android/Multiplatformアプリの場合、次のパッケージを使用します。
- `koin-compose` - Compose base API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - Compose ViewModel API とNavigation APIの統合

## 既存のKoinコンテキストを再開する (Koinがすでに開始されている場合)

アプリケーションで`startKoin`関数がすでに使用されている場合（Androidのメインアプリクラス、Applicationクラスなど）、`KoinContext`または`KoinAndroidContext`を使用して、現在のKoinコンテキストをComposeアプリケーションに通知する必要があります。これらの関数は、現在のKoinコンテキストを再利用し、Composeアプリケーションにバインドします。

```kotlin
@Composable
fun App() {
    // 現在のKoinインスタンスをComposeコンテキストに設定
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext`と`KoinContext`の違い:
- `KoinAndroidContext`は、現在のAndroidアプリコンテキストでKoinインスタンスを検索します
- `KoinContext`は、現在のGlobalContextでKoinインスタンスを検索します
:::

:::note
Composableから`ClosedScopeException`が発生する場合は、Composableで`KoinContext`を使用するか、適切なKoin開始構成[Androidコンテキストを使用](/reference/koin-android/start.md)していることを確認してください
:::

## ComposeアプリでKoinを開始する - KoinApplication

`KoinApplication`関数は、ComposableとしてKoinアプリケーションインスタンスを作成するのに役立ちます。

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // ここに画面を記述 ...
        MyScreen()
    }
}
```

`KoinApplication`関数は、Composeコンテキストのサイクルに関して、Koinコンテキストの開始と停止を処理します。この関数は、新しいKoinアプリケーションコンテキストを開始および停止します。

:::info
Androidアプリケーションでは、`KoinApplication`は、構成の変更またはアクティビティのドロップに関するKoinコンテキストの停止/再起動の必要性をすべて処理します。
:::

:::note
これは、従来の`startKoin`アプリケーション関数の使用を置き換えます。
:::

### Koinを使用したCompose Preview

`KoinApplication`関数は、プレビュー用に専用のコンテキストを開始する場合に役立ちます。これは、Composeプレビューにも役立ちます。

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // ここにプレビュー構成を記述
        modules(previewModule)
    }) {
        // KoinでプレビューするCompose
    }
}
```

## @Composableへの注入

Composable関数を記述する際に、次のKoin APIにアクセスできます。`koinInject()`を使用して、Koinコンテナからインスタンスを注入します。

'MyService'コンポーネントを宣言するモジュールの場合:

```kotlin
val androidModule = module {
    single { MyService() }
    // またはコンストラクタDSL
    singleOf(::MyService)
}
```

インスタンスは次のようになります。

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

Jetpack Composeの機能的な側面に沿って、最適な記述方法は、関数パラメータにインスタンスを直接注入することです。これにより、Koinを使用したデフォルトの実装が可能になりますが、インスタンスを好きなように注入できるように開放されます。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### パラメータを使用して@Composableに注入する

Koinから新しい依存関係を要求する際に、パラメータを注入する必要がある場合があります。これを行うには、`koinInject`関数の`parameters`パラメータを、`parametersOf()`関数とともに使用します。

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
`koinInject<MyService>{ parametersOf("a_string") }`のように、ラムダ注入でパラメータを使用できますが、再構成を頻繁に行う場合は、パフォーマンスに影響を与える可能性があります。ラムダを使用したこのバージョンでは、パラメータを記憶しないように、呼び出し時にパラメータをアンラップする必要があります。

Koinのバージョン4.0.2以降では、koinInject(Qualifier,Scope,ParametersHolder)が導入され、最も効率的な方法でパラメータを使用できます
:::

## @ComposableのViewModel

クラシックなsingle/factoryインスタンスにアクセスできるのと同じように、次のKoin ViewModel APIにもアクセスできます。

* `koinViewModel()` - ViewModelインスタンスを注入
* `koinNavViewModel()` - ViewModelインスタンス + Navigation引数データを注入 (Navigation APIを使用している場合)

'MyViewModel'コンポーネントを宣言するモジュールの場合:

```kotlin
module {
    viewModel { MyViewModel() }
    // またはコンストラクタDSL
    viewModelOf(::MyViewModel)
}
```

インスタンスは次のようになります。

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

関数パラメータでインスタンスを取得できます。

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Lazy APIは、Jetpack Composeの更新ではサポートされていません
:::

### @ComposableのViewModelとSavedStateHandle

`SavedStateHandle`コンストラクタパラメータを持つことができます。これは、Compose環境（Navigation BackStackまたはViewModel）に関して注入されます。
ViewModel `CreationExtras`またはNavigation `BackStackEntry`のいずれかを介して注入されます。

```kotlin
// NavhostでobjectId引数を設定
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

// ViewModelに注入された引数
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
SavedStateHandleの注入の違いに関する詳細: https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

## Composableに結び付けられたモジュールのロードとアンロード

Koinは、特定のComposable関数に対して特定のモジュールをロードする方法を提供します。`rememberKoinModules`関数は、Koinモジュールをロードし、現在のComposableに記憶します。

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // このコンポーネントの最初の呼び出しでモジュールをロード
    rememberKoinModules(myModule)
}
```

破棄関数(`unloadOnForgotten`または`unloadOnAbandoned`)を使用すると、次の2つの側面でモジュールをアンロードできます。
- onForgotten - 構成がドロップアウトした後
- onAbandoned - 構成に失敗した場合

これには、`rememberKoinModules`の`unloadOnForgotten`または`unloadOnAbandoned`引数を使用します。

## Composableを使用したKoinスコープの作成

Composable関数`rememberKoinScope`と`KoinScope`を使用すると、ComposableでKoinスコープを処理し、Composableが終了するとすぐに現在のスコープを閉じることができます。

:::info
このAPIはまだ不安定です
:::