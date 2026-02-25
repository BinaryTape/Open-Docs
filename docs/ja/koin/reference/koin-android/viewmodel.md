---
title: Android ViewModel と Navigation
---

`koin-android` Gradle モジュールは、`single` や `factory` を補完する新しい `viewModel` DSL キーワードを導入しています。これは ViewModel コンポーネントを宣言し、Android コンポーネントのライフサイクルにバインドするのに役立ちます。また、コンストラクタを使用して ViewModel を宣言できる `viewModelOf` キーワードも利用可能です。

```kotlin
val appModule = module {

    // 詳細画面用の ViewModel
    viewModel { DetailViewModel(get(), get()) }

    // またはコンストラクタを使用して直接宣言
    viewModelOf(::DetailViewModel)

}
```

宣言するコンポーネントは、少なくとも `android.arch.lifecycle.ViewModel` クラスを継承している必要があります。クラスの *コンストラクタ* をどのように注入するかを指定し、`get()` 関数を使用して依存関係を注入できます。

:::info
`viewModel`/`viewModelOf` キーワードは、ViewModel のファクトリインスタンスを宣言するのに役立ちます。このインスタンスは内部の ViewModelFactory によって処理され、必要に応じて ViewModel インスタンスを再アタッチします。また、パラメータの注入も可能です。
:::

## ViewModel の注入

`Activity`、`Fragment`、または `Service` で ViewModel を注入するには、以下を使用します。

* `by viewModel()` - ViewModel をプロパティに注入するための lazy デリゲートプロパティ
* `getViewModel()` - ViewModel インスタンスを直接取得する

```kotlin
class DetailActivity : AppCompatActivity() {

    // ViewModel を Lazy 注入
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel のキーは、Key および/または Qualifier に基づいて計算されます。
:::

## Activity で共有される ViewModel

1 つの ViewModel インスタンスを、複数の Fragment とそれらをホストする Activity の間で共有できます。

`Fragment` で *共有* ViewModel を注入するには、以下を使用します。

* `by activityViewModel()` - 共有 ViewModel インスタンスをプロパティに注入するための lazy デリゲートプロパティ
* `getActivityViewModel()` - 共有 ViewModel インスタンスを直接取得する

:::note
`sharedViewModel` は `activityViewModel()` 関数のために非推奨となりました。後者の命名の方がより明示的です。
:::

ViewModel の宣言は一度だけで構いません：

```kotlin
val weatherAppModule = module {

    // Weather View コンポーネント用の WeatherViewModel 宣言
    viewModel { WeatherViewModel(get(), get()) }
}
```

注：ViewModel の限定子（qualifier）は、ViewModel のタグとして扱われます。

そして、Activity と Fragment で再利用します：

```kotlin
class WeatherActivity : AppCompatActivity() {

    /*
     * Koin で WeatherViewModel を宣言し、コンストラクタによる依存性注入を許可する
     */
    private val weatherViewModel by viewModel<WeatherViewModel>()
}

class WeatherHeaderFragment : Fragment() {

    /*
     * WeatherActivity と共有される WeatherViewModel を宣言
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}

class WeatherListFragment : Fragment() {

    /*
     * WeatherActivity と共有される WeatherViewModel を宣言
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}
```

## コンストラクタへのパラメータの渡し方

`viewModel` キーワード API は、注入パラメータに対応しています。

モジュール内：

```kotlin
val appModule = module {

    // パラメータ注入として id を持つ詳細画面用 ViewModel
    viewModel { parameters -> DetailViewModel(id = parameters.get(), get(), get()) }
    // グラフから解決される、パラメータ注入として id を持つ詳細画面用 ViewModel
    viewModel { DetailViewModel(get(), get(), get()) }
    // またはコンストラクタ DSL
    viewModelOf(::DetailViewModel)
}
```

注入の呼び出し側：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // ビューの ID

    // id パラメータを使用して ViewModel を Lazy 注入
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle の注入 (3.3.0)

ViewModel の状態を処理するために、コンストラクタに `SavedStateHandle` 型の新しいプロパティを追加します。

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

Koin モジュールでは、`get()` またはパラメータを使用して解決します：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

またはコンストラクタ DSL を使用します：

```kotlin
viewModelOf(::MyStateVM)
```

`Activity` や `Fragment` で *状態（state）* ViewModel を注入するには、以下を使用します。

* `by viewModel()` - 状態 ViewModel インスタンスをプロパティに注入するための lazy デリゲートプロパティ
* `getViewModel()` - 状態 ViewModel インスタンスを直接取得する

```kotlin
class DetailActivity : AppCompatActivity() {

    // SavedStateHandle が注入された MyStateVM viewModel
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
すべての `stateViewModel` 関数は非推奨になりました。`SavedStateHandle` を注入するには、通常の `viewModel` 関数を使用するだけです。
:::

## Navigation Graph ViewModel

ViewModel インスタンスを Navigation グラフのスコープに含めることができます。`by koinNavGraphViewModel()` で取得するだけです。グラフの ID が必要です。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

ViewModel と Scope で使用されるすべての API については、[ViewModel Scope](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354) を参照してください。

## ViewModel Generic API

Koin は、ViewModel インスタンスを直接微調整するためのいくつかの「内部（under the hood）」API を提供しています。`ComponentActivity` と `Fragment` で利用可能な関数は `viewModelForClass` です。

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
この関数は依然として `state: BundleDefinition` を使用していますが、内部で `CreationExtras` に変換されます。
:::

また、どこからでも呼び出し可能なトップレベル関数にもアクセスできます。

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

## ViewModel API - Java 互換性

Java の互換性を依存関係に追加する必要があります。

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat` の `viewModel()` または `getViewModel()` 静的関数を使用して、Java コードベースに ViewModel インスタンスを注入できます。

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