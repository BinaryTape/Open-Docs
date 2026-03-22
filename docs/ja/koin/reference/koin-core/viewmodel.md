---
title: ViewModel
---

Koinは`koin-core-viewmodel`モジュールを通じて、マルチプラットフォームのViewModelサポートを提供します。これにより、すべてのKotlin Multiplatformターゲットにおいて[AndroidX ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)のインスタンスを宣言および注入できるようになります。

## セットアップ

コアとなるViewModelの依存関係を追加します：

```kotlin
// build.gradle.kts (commonMain)
implementation("io.insert-koin:koin-core-viewmodel:$koin_version")
```

プラットフォーム固有の注入APIについては、以下を追加してください：

```kotlin
// Android
implementation("io.insert-koin:koin-android:$koin_version")

// Compose Multiplatform
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
```

## ViewModelの宣言

### コンパイラプラグインDSL

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

### クラシックDSL

```kotlin
val appModule = module {
    // コンストラクタ参照を使用する場合
    viewModelOf(::UserViewModel)

    // ラムダを使用する場合
    viewModel { UserViewModel(get()) }
}
```

## パラメータを持つViewModel

注入時にパラメータを渡すには、`@InjectedParam`を使用します：

### コンパイラプラグインDSL

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### アノテーション

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### クラシックDSL

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

## ViewModelスコープ

独自のスコープ付き依存関係を必要とするViewModelは、`viewModelScope`アーキタイプを使用します。`viewModelScope`内で宣言された依存関係は、ViewModelのライフサイクルに関連付けられます。

### コンパイラプラグインDSL

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
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### クラシックDSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

:::info
`viewModelScope`内の依存関係は、ViewModelに最初にアクセスしたときに作成され、ViewModelが破棄（クリア）されたときに破棄されます。
:::

## ViewModelの注入

### Compose (マルチプラットフォーム) の場合

Composable関数内で `koinViewModel()` を使用します：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // またはパラメータを指定する場合
    val detailVM = koinViewModel<DetailViewModel> { parametersOf("item_123") }
}
```

### Android の場合

ActivityまたはFragmentで `by viewModel()` デリゲートを使用します：

```kotlin
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()

    // パラメータを指定する場合
    private val detailVM: DetailViewModel by viewModel { parametersOf("item_123") }
}
```

## SavedStateHandle

ViewModelのコンストラクタに `SavedStateHandle` を追加すると、Koinが自動的に注入します：

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {

    val userId: String? = handle["userId"]
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // コンパイラプラグインDSL
    // または
    viewModelOf(::MyViewModel)  // クラシックDSL
}
```

## クイックリファレンス

| 手法 | モジュール宣言 | スコープ宣言 |
|----------|-------------------|-------------------|
| コンパイラプラグインDSL | `viewModel<MyVM>()` | `viewModelScope { viewModel<MyVM>() }` |
| アノテーション | `@KoinViewModel` | `@KoinViewModel @ViewModelScope` |
| クラシックDSL | `viewModelOf(::MyVM)` | `viewModelScope { viewModelOf(::MyVM) }` |

| プラットフォーム | 注入API |
|----------|---------------|
| Compose | `koinViewModel<MyVM>()` |
| Android | `by viewModel()` |

## プラットフォーム固有の機能

- **Android**: Activity/Fragment間での共有、Navigation Graphのスコープ設定については、[Android ViewModel](/docs/reference/koin-android/viewmodel)を参照してください。
- **Compose**: Compose固有のAPIについては、[Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)を参照してください。

## 次のステップ

- **[スコープ](/docs/reference/koin-core/scopes)** - コアのスコープ概念について
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android固有の機能について
- **[Compose](/docs/reference/koin-compose/compose)** - Compose Multiplatformとの統合について