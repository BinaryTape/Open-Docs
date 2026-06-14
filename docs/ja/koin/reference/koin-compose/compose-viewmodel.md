---
title: Compose における ViewModel
---

# Compose における ViewModel

Koin は、Compose アプリケーションで ViewModel を注入（inject）するためのいくつかの API を提供しています。このガイドでは、すべての ViewModel 注入パターンについて説明します。

:::info
モジュールでの ViewModel の宣言については、[Core ViewModel](/docs/reference/koin-core/viewmodel) を参照してください。このページでは、Compose での ViewModel の取得に焦点を当てています。
:::

## セットアップ

```kotlin
// Compose Multiplatform (または Android)
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// Android 向けの便利なパッケージ (koin-compose + koin-compose-viewmodel を含む)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// Navigation 連携を使用する場合
implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
```

:::info
すべての ViewModel API は `koin-compose-viewmodel` に含まれています。`koin-androidx-compose` パッケージにはこれが自動的に含まれます。
:::

## ViewModel の宣言

### コンパイラプラグイン DSL

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### アノテーション

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### クラシック DSL

```kotlin
val appModule = module {
    viewModelOf(::UserViewModel)
    // またはラムダを使用
    viewModel { UserViewModel(get()) }
}
```

## ViewModel 注入 API

### koinViewModel() - 基本的な注入

Compose で ViewModel を注入するための主要な API です。

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // viewModel を使用...
}
```

**ベストプラクティス** - テスト容易性（Testability）のためにデフォルトパラメータとして注入します：

```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()
    // UI...
}
```

### koinNavViewModel() - Navigation 引数を使用する場合

Navigation Compose を使用する場合、`koinNavViewModel()` を使用すると、`SavedStateHandle` を介してナビゲーション引数を自動的に受け取ることができます。

```kotlin
// 引数付きのルート
NavHost(navController, startDestination = "list") {
    composable("detail/{itemId}") { backStackEntry ->
        DetailScreen()
    }
}

// ViewModel は自動的に引数を受け取る
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    val itemId: String = savedStateHandle["itemId"] ?: ""
}

@Composable
fun DetailScreen(
    viewModel: DetailViewModel = koinNavViewModel()
) {
    // viewModel.itemId にはナビゲーション引数の値が入っている
}
```

### koinActivityViewModel() - Activity スコープ (Android)

同じ Activity 内のすべての Composable で ViewModel を共有します。

```kotlin
@Composable
fun ScreenA() {
    // Activity 全体で同じインスタンス
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}

@Composable
fun ScreenB() {
    // ScreenA と同じインスタンス
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}
```

:::note
バージョン 4.1 以降の `koin-androidx-compose` で利用可能です。
:::

### sharedKoinViewModel() - ナビゲーショングラフスコープ

ナビゲーショングラフ内で ViewModel を共有します（実験的機能）。

```kotlin
navigation<Route.BookGraph>(startDestination = Route.BookList) {
    composable<Route.BookList> { backStackEntry ->
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookListScreen(sharedVM)
    }
    composable<Route.BookDetail> { backStackEntry ->
        // BookGraph 内で同じインスタンス
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookDetailScreen(sharedVM)
    }
}
```

## パラメータ付きの ViewModel

### @InjectedParam の使用

ランタイムパラメータに `@InjectedParam` を付けます。

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

// コンパイラプラグイン DSL
val appModule = module {
    viewModel<DetailViewModel>()
}
```

パラメータを指定して注入します：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

識別子（例：ナビゲーション引数）ごとに異なる ViewModel インスタンスを作成するには、`key` パラメータを使用します：

```kotlin
@Composable
fun DetailScreen(newsId: String) {
    val viewModel = koinViewModel<DetailViewModel>(key = newsId) {
        parametersOf(newsId)
    }
}
```

`key` を使用することで、一意な `newsId` ごとに専用の ViewModel インスタンスが確実に作成されます。これは、異なる引数を持つ複数の画面がバックスタックに保持される場合に重要です。

### クラシック DSL でのパラメータ指定

```kotlin
val appModule = module {
    viewModel { params ->
        DetailViewModel(
            itemId = params.get(),
            repository = get()
        )
    }
}
```

## SavedStateHandle

Koin は `SavedStateHandle` を自動的に ViewModel に提供します。

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {
    // ナビゲーション引数にアクセス
    val userId: String? = handle["userId"]

    // プロセスの終了（Process death）をまたいで状態を保持する
    var query by handle.saveable { mutableStateOf("") }
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // SavedStateHandle は自動的に注入される
}
```

:::info
`SavedStateHandle` は、コンテキストに応じて ViewModel の `CreationExtras` または Navigation の `BackStackEntry` から注入されます。
:::

## ViewModel スコープ

`viewModelScope` を使用して、依存関係を ViewModel のライフサイクルにスコープします。

### コンパイラプラグイン DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### アノテーション

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### クラシック DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

:::caution viewModelScopeFactory() オプションが必要です
`viewModelScope { }` 内で ViewModel を宣言するには、Koin 設定で `options(viewModelScopeFactory())` を有効にする必要があります。そうしないと、`koinViewModel()` は `No definition found … on scope '['_root_']'` というエラーで失敗します。詳細は [ViewModel Scope](/docs/reference/koin-core/viewmodel#viewmodel-scope) を参照してください。
:::

## クイックリファレンス

| API | ユースケース | パッケージ |
|-----|----------|---------|
| `koinViewModel()` | 基本的な ViewModel 注入 | `koin-compose-viewmodel` |
| `koinNavViewModel()` | Navigation 引数を使用する場合 | `koin-compose-viewmodel-navigation` |
| `koinActivityViewModel()` | Activity 全体で共有 (Android) | `koin-androidx-compose` |
| `sharedKoinViewModel()` | ナビゲーショングラフ内で共有 | `koin-compose-viewmodel-navigation` |

## ベストプラクティス

1. **デフォルトパラメータとして注入する** - Koin なしでのテストが可能になります。
   ```kotlin
   @Composable
   fun MyScreen(viewModel: MyViewModel = koinViewModel())
   ```

2. **Navigation では koinNavViewModel() を使用する** - 引数の処理が自動化されます。

3. **ViewModel 固有の依存関係には viewModelScope を優先する** - クリーンなライフサイクル管理が可能になります。

4. **コールバック内で ViewModel を注入しない** - Composable レベルで注入してください。
   ```kotlin
   // 非推奨 (Bad)
   Button(onClick = { val vm = koinViewModel<MyVM>() })

   // 推奨 (Good)
   val vm = koinViewModel<MyVM>()
   Button(onClick = { vm.doSomething() })
   ```

## 次のステップ

- **[Compose ライフサイクル](/docs/reference/koin-compose/compose-lifecycle)** - 状態と再コンポジション
- **[Core ViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel 宣言 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 固有の機能