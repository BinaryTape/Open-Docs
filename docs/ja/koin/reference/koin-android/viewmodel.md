---
title: Android ViewModel
---

このページでは、Android 特有の ViewModel 機能について説明します。コアの ViewModel DSL およびマルチプラットフォーム対応については、[ViewModel](/docs/reference/koin-core/viewmodel) を参照してください。

## 概要

[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) は、構成変更（configuration changes）後も保持され、UI 関連のデータを管理するように設計されたアーキテクチャコンポーネントです。Koin は、ライフサイクルを認識した注入（lifecycle-aware injection）により、ViewModel の特別なサポートを提供します。

### 主なコンセプト

- **構成変更後も保持される** - ViewModel は回転やテーマの変更を越えて存続します。
- **ライフサイクルにスコープされる** - Activity、Fragment、または Navigation グラフのライフサイクルに関連付けられます。
- **Lazy 生成** - 最初にアクセスされたときにのみ作成されます。
- **共有インスタンス** - Fragment とそのホスト Activity の間で共有できます。

:::info
**マルチプラットフォーム ViewModel** - Koin の ViewModel DSL は `koin-core-viewmodel` を通じて完全にマルチプラットフォームに対応しています。Compose Multiplatform については、[Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable) を参照してください。
:::

### ViewModel スコープの制限

:::warning
**重要：** ViewModel はルートの Koin スコープに対して作成されるため、Activity や Fragment にスコープされた依存関係には**アクセスできません**。これは、ViewModel が Activity や Fragment よりも長く生存するため、メモリリークを防ぐための仕様です。

**ViewModel でスコープされた依存関係が必要な場合**は、[ViewModel Scope](/docs/reference/koin-core/scopes#viewmodel-scope) を使用して、ViewModel のライフサイクルに関連付けられた専用のスコープを作成してください。
:::

## ViewModel の宣言

### コンパイラプラグイン DSL

```kotlin
val appModule = module {
    viewModel<DetailViewModel>()
    viewModel<UserViewModel>()
}
```

### アノテーション

```kotlin
@KoinViewModel
class DetailViewModel(
    private val repository: DetailRepository
) : ViewModel()

@KoinViewModel
class UserViewModel(
    private val userRepository: UserRepository
) : ViewModel()
```

### クラシック DSL

```kotlin
val appModule = module {
    // コンストラクタ参照を使用する場合
    viewModelOf(::DetailViewModel)

    // ラムダを使用する場合
    viewModel { DetailViewModel(get()) }
}
```

## ViewModel の注入

`Activity`、`Fragment`、または `Service` では以下を使用します：

* `by viewModel()` - lazy デリゲートプロパティ
* `getViewModel()` - インスタンスを直接取得（eager fetch）

```kotlin
class DetailActivity : AppCompatActivity() {

    // ViewModel を Lazy 注入
    private val viewModel: DetailViewModel by viewModel()

    // または直接取得
    // private val viewModel: DetailViewModel = getViewModel()
}
```

## 共有 ViewModel (Activity)

Fragment とそのホスト Activity の間で ViewModel を共有します：

* `by activityViewModel()` - 共有 ViewModel 用の lazy デリゲート
* `getActivityViewModel()` - 直接取得

```kotlin
class WeatherActivity : AppCompatActivity() {
    private val weatherViewModel: WeatherViewModel by viewModel()
}

class WeatherHeaderFragment : Fragment() {
    // Activity と共有
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}

class WeatherListFragment : Fragment() {
    // WeatherHeaderFragment と同じインスタンス
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}
```

## パラメータの渡し方

### コンパイラプラグイン DSL

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

### クラシック DSL

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

### 注入箇所

```kotlin
class DetailActivity : AppCompatActivity() {

    private val itemId: String by lazy { intent.getStringExtra("ITEM_ID")!! }

    // 注入時にパラメータを渡す
    private val viewModel: DetailViewModel by viewModel { parametersOf(itemId) }
}
```

## SavedStateHandle

ViewModel のコンストラクタに `SavedStateHandle` を追加すると、Koin が自動的に注入します：

### アノテーション

```kotlin
@KoinViewModel
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()
```

### DSL

```kotlin
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()

val appModule = module {
    viewModel<MyStateViewModel>()  // コンパイラプラグイン DSL
    // または
    viewModelOf(::MyStateViewModel)  // クラシック DSL
}
```

### 使用方法

```kotlin
class DetailActivity : AppCompatActivity() {
    // SavedStateHandle が自動的に注入される
    private val viewModel: MyStateViewModel by viewModel()
}
```

:::info
すべての `stateViewModel` 関数は非推奨になりました。通常の `viewModel` 関数を使用してください。`SavedStateHandle` は自動的に注入されます。
:::

## Navigation Graph ViewModel

ViewModel を Navigation グラフのスコープに含めます：

```kotlin
class NavFragment : Fragment() {

    // Navigation グラフにスコープされる
    private val navViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)
}
```

この ViewModel は：
- グラフ内の最初の Fragment がアクセスしたときに作成される
- グラフ内のすべての Fragment で共有される
- Navigation グラフがバックスタックから破棄（popped）されたときに破棄される

## スコープされた依存関係を持つ ViewModel

ViewModel 自体にスコープされた依存関係が必要な場合は、[ViewModel Scope](/docs/reference/koin-core/scopes#viewmodel-scope) を使用します：

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

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

## ViewModel Generic API

高度なユースケース向けに、Koin はより低レベルの API を提供しています：

```kotlin
// ComponentActivity または Fragment から
val viewModel = viewModelForClass(
    clazz = MyViewModel::class,
    qualifier = null,
    owner = this,
    key = null,
    parameters = { parametersOf("param") }
)
```

## Java 互換性

互換性（compat）依存関係を追加します：

```groovy
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat` の静的メソッドを使用します：

```java
MyViewModel viewModel = ViewModelCompat.getViewModel(this, MyViewModel.class);
```

## クイックリファレンス

| アクション | コード |
|--------|------|
| ViewModel の宣言 | `viewModel<MyVM>()` / `@KoinViewModel` |
| Activity/Fragment での注入 | `by viewModel()` |
| Activity との共有 | `by activityViewModel()` |
| パラメータの受け渡し | `by viewModel { parametersOf(id) }` |
| Navigation グラフのスコープ | `by koinNavGraphViewModel(R.id.graph)` |
| SavedStateHandle を使用する場合 | コンストラクタに追加するだけ |

## 次のステップ

- **[コア ViewModel](/docs/reference/koin-core/viewmodel)** - マルチプラットフォーム ViewModel DSL
- **[スコープ](/docs/reference/koin-core/scopes#viewmodel-scope)** - スコープされた依存関係のための ViewModel Scope
- **[テスト](/docs/reference/koin-test/testing)** - ViewModel のテスト
- **[Compose](/docs/reference/koin-compose/compose)** - Compose における ViewModel