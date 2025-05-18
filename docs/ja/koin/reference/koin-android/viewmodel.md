---
title: "Android ViewModelとNavigation"
---
`koin-android` Gradleモジュールは、ViewModelコンポーネントを宣言し、それをAndroidコンポーネントのライフサイクルにバインドするのに役立つ、`single`や`factory`を補完する新しい`viewModel` DSLキーワードを導入します。`viewModelOf`キーワードも利用可能で、コンストラクタを使ってViewModelを宣言できます。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

宣言されたコンポーネントは、少なくとも`android.arch.lifecycle.ViewModel`クラスを拡張する必要があります。クラスの*コンストラクタ*をどのように注入するかを指定し、`get()`関数を使って依存関係を注入できます。

:::info
`viewModel`/`viewModelOf`キーワードは、ViewModelのファクトリインスタンスを宣言するのに役立ちます。このインスタンスは、内部のViewModelFactoryによって処理され、必要に応じてViewModelインスタンスを再アタッチします。また、パラメータを注入することもできます。
:::

## ViewModelの注入

`Activity`、`Fragment`、または`Service`でViewModelを注入するには、以下を使用します。

* `by viewModel()` - ViewModelをプロパティに注入するための遅延デリゲートプロパティ
* `getViewModel()` - ViewModelインスタンスを直接取得

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModelキーは、Keyおよび/またはQualifierに基づいて計算されます。
:::

## Activity共有ViewModel

1つのViewModelインスタンスを、複数のFragmentとそのホストActivityの間で共有できます。

`Fragment`で*共有*ViewModelを注入するには、以下を使用します。

* `by activityViewModel()` - 共有ViewModelインスタンスをプロパティに注入するための遅延デリゲートプロパティ
* `getActivityViewModel()` - 共有ViewModelインスタンスを直接取得

:::note
`sharedViewModel`は非推奨となり、`activityViewModel()`関数が推奨されます。後者の方が名前がより明示的です。
:::

ViewModelは一度だけ宣言してください。

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注: ViewModelのqualifierは、ViewModelのTagとして扱われます。

そして、ActivityとFragmentで再利用します。

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

## コンストラクタへのパラメータの受け渡し

`viewModel`キーワードと注入APIは、注入パラメータと互換性があります。

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

注入呼び出し元から：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandleの注入 (3.3.0)

ViewModelの状態を処理するために、`SavedStateHandle`型の新しいプロパティをコンストラクタに追加します。

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

Koinモジュールでは、`get()`またはパラメータで解決するだけです。

```kotlin
viewModel { MyStateVM(get(), get()) }
```

またはConstructor DSLを使用します。

```kotlin
viewModelOf(::MyStateVM)
```

`Activity`、`Fragment`で*state* ViewModelを注入するには、以下を使用します。

* `by viewModel()` - state ViewModelインスタンスをプロパティに注入するための遅延デリゲートプロパティ
* `getViewModel()` - state ViewModelインスタンスを直接取得

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
すべての`stateViewModel`関数は非推奨です。通常の`viewModel`関数を使用してSavedStateHandleを注入できます。
:::

## Navigation Graph ViewModel

ViewModelインスタンスをNavigation graphにスコープすることができます。`by koinNavGraphViewModel()`で取得するだけです。グラフIDが必要です。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

ViewModelおよびScopeで使用されるすべてのAPIを参照してください: [ViewModel Scope](/reference/koin-android/scope.md)

## ViewModel Generic API

Koinは、ViewModelインスタンスを直接調整するためのいくつかの「隠れた」APIを提供します。使用可能な関数は、`ComponentActivity`と`Fragment`の`viewModelForClass`です。

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
この関数はまだ`state: BundleDefinition`を使用していますが、`CreationExtras`に変換します。
:::

どこからでも呼び出し可能なトップレベル関数にアクセスできることに注意してください。

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

## ViewModel API - Java互換

Java互換性を依存関係に追加する必要があります。

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat`の`viewModel()`または`getViewModel()`静的関数を使用して、JavaコードベースにViewModelインスタンスを注入できます。

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
```