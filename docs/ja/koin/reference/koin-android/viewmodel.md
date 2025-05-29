---
title: Android ViewModelとナビゲーション
---

`koin-android` Gradleモジュールは、`single`や`factory`を補完する新しい`viewModel` DSLキーワードを導入しており、これによりViewModelコンポーネントを宣言し、Androidコンポーネントのライフサイクルにバインドするのに役立ちます。また、`viewModelOf`キーワードも利用でき、これによりコンストラクタでViewModelを宣言できます。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

宣言するコンポーネントは、少なくとも`android.arch.lifecycle.ViewModel`クラスを継承している必要があります。クラスの*コンストラクタ*をどのようにインジェクトするかを指定でき、`get()`関数を使用して依存関係をインジェクトできます。

:::info
`viewModel`/`viewModelOf`キーワードは、ViewModelのファクトリインスタンスを宣言するのに役立ちます。このインスタンスは内部のViewModelFactoryによって処理され、必要に応じてViewModelインスタンスを再アタッチします。また、パラメータをインジェクトすることも可能です。
:::

## ViewModelのインジェクション

`Activity`、`Fragment`、`Service`でViewModelをインジェクトするには、以下を使用します：

*   `by viewModel()` - プロパティにViewModelをインジェクトするための遅延デリゲートプロパティ
*   `getViewModel()` - ViewModelインスタンスを直接取得

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModelのキーは、Keyおよび/またはQualifierに対して計算されます。
:::

## Activityでの共有ViewModel

1つのViewModelインスタンスは、FragmentとそのホストActivity間で共有できます。

`Fragment`で*共有*ViewModelをインジェクトするには、以下を使用します：

*   `by activityViewModel()` - 共有ViewModelインスタンスをプロパティにインジェクトするための遅延デリゲートプロパティ
*   `getActivityViewModel()` - 共有ViewModelインスタンスを直接取得

:::note
`sharedViewModel`は`activityViewModel()`関数に置き換えられ、非推奨となりました。後者の名前はより明示的です。
:::

ViewModelは一度だけ宣言してください：

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注: ViewModelのクオリファイアは、ViewModelのTagとして扱われます。

そして、ActivityとFragmentで再利用します：

```kotlin
class WeatherActivity : AppCompatActivity() {

    /*
     * Declare WeatherViewModel with Koin and allow constructor dependency injection
     */
    private val weatherViewModel by viewModel<WeatherViewModel>()
}

class WeatherHeaderFragment : Fragment() {

    /*
     * Declare shared WeatherViewModel with WeatherActivity
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}

class WeatherListFragment : Fragment() {

    /*
     * Declare shared WeatherViewModel with WeatherActivity
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}
```

## コンストラクタへのパラメータの渡し方

`viewModel`キーワードとインジェクションAPIは、インジェクションパラメータと互換性があります。

モジュール内：

```kotlin
val appModule = module {

    // ViewModel for Detail View with id as parameter injection
    viewModel { parameters -> DetailViewModel(id = parameters.get(), get(), get()) }
    // ViewModel for Detail View with id as parameter injection, resolved from graph
    viewModel { DetailViewModel(get(), get(), get()) }
    // or Constructor DSL
    viewModelOf(::DetailViewModel)
}
```

インジェクション呼び出し元からは：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandleのインジェクション (3.3.0)

ViewModelの状態を扱うために、`SavedStateHandle`型の新しいプロパティをコンストラクタに追加します：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

Koinモジュールでは、`get()`またはパラメータで解決するだけです：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

またはコンストラクタDSLで：

```kotlin
viewModelOf(::MyStateVM)
```

`Activity`、`Fragment`で*状態を持つ*ViewModelをインジェクトするには、以下を使用します：

*   `by viewModel()` - 状態を持つViewModelインスタンスをプロパティにインジェクトするための遅延デリゲートプロパティ
*   `getViewModel()` - 状態を持つViewModelインスタンスを直接取得

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
すべての`stateViewModel`関数は非推奨になりました。`SavedStateHandle`をインジェクトするには、通常の`viewModel`関数を使用するだけで済みます。
:::

## ナビゲーショングラフのViewModel

ViewModelインスタンスをナビゲーショングラフにスコープすることができます。`by koinNavGraphViewModel()`で取得するだけです。グラフIDが必要となります。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModelスコープAPI

ViewModelとScopeに使用されるすべてのAPIを参照してください：[ViewModel Scope](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModelの汎用API

Koinは、ViewModelインスタンスを直接調整するための「内部的な」APIを提供しています。利用可能な関数は、`ComponentActivity`および`Fragment`向けの`viewModelForClass`です：

```kotlin
ComponentActivity.viewModelForClass(
    clazz: KClass<T>,
    qualifier: Qualifier? = null,
    owner: ViewModelStoreOwner = this,
    state: BundleDefinition? = null,
    key: String? = null,
    parameters: ParametersDefinition? = null,
): Lazy<T>
```

:::note
この関数はまだ`state: BundleDefinition`を使用していますが、`CreationExtras`に変換されます。
:::

どこからでも呼び出し可能なトップレベル関数にアクセスできることに注意してください：

```kotlin
fun <T : ViewModel> getLazyViewModelForClass(
    clazz: KClass<T>,
    owner: ViewModelStoreOwner,
    scope: Scope = GlobalContext.get().scopeRegistry.rootScope,
    qualifier: Qualifier? = null,
    state: BundleDefinition? = null,
    key: String? = null,
    parameters: ParametersDefinition? = null,
): Lazy<T>
```

## ViewModel API - Java互換性

Java互換性を依存関係に追加する必要があります：

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat`の`viewModel()`または`getViewModel()`静的関数を使用することで、JavaコードベースにViewModelインスタンスをインジェクトできます：

```kotlin
@JvmOverloads
@JvmStatic
@MainThread
fun <T : ViewModel> getViewModel(
    owner: ViewModelStoreOwner,
    clazz: Class<T>,
    qualifier: Qualifier? = null,
    parameters: ParametersDefinition? = null
)