---
title: "Android ViewModel & Navigation"
---
`koin-android` Gradle 模組引入了一個新的 `viewModel` DSL 關鍵字，作為 `single` 和 `factory` 的補充，用於宣告 ViewModel 元件並將其綁定到 Android 元件生命週期。 `viewModelOf` 關鍵字也可用，可讓您宣告具有其建構子的 ViewModel。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

您宣告的元件必須至少擴展 `android.arch.lifecycle.ViewModel` 類別。 您可以指定如何注入類別的 *建構子*，並使用 `get()` 函數注入相依性。

:::info
`viewModel`/`viewModelOf` 關鍵字有助於宣告 ViewModel 的 factory 實例。 此實例將由內部 ViewModelFactory 處理，並在需要時重新附加 ViewModel 實例。 它還允許注入參數。
:::

## 注入您的 ViewModel

若要在 `Activity`、`Fragment` 或 `Service` 中注入 ViewModel，請使用：

* `by viewModel()` - lazy 委託屬性，用於將 ViewModel 注入到屬性中
* `getViewModel()` - 直接取得 ViewModel 實例

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 鍵是根據 Key 和/或 Qualifier 計算的
:::

## Activity 共享 ViewModel

一個 ViewModel 實例可以在 Fragments 及其宿主 Activity 之間共享。

若要在 `Fragment` 中注入 *共享* ViewModel，請使用：

* `by activityViewModel()` - lazy 委託屬性，用於將共享 ViewModel 實例注入到屬性中
* `getActivityViewModel()` - 直接取得共享 ViewModel 實例

:::note
`sharedViewModel` 已棄用，改用 `activityViewModel()` 函數。 後者的命名更明確。
:::

只需宣告 ViewModel 一次：

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注意：ViewModel 的 qualifier 將被視為 ViewModel 的 Tag

並在 Activity 和 Fragments 中重複使用它：

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

## 將參數傳遞給建構子

`viewModel` 關鍵字和注入 API 與注入參數相容。

在模組中：

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

從注入呼叫位置：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 注入 (3.3.0)

將類型為 `SavedStateHandle` 的新屬性新增到您的建構子，以處理您的 ViewModel 狀態：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

在 Koin 模組中，只需使用 `get()` 或參數來解析它：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

或者使用建構子 DSL：

```kotlin
viewModelOf(::MyStateVM)
```

若要在 `Activity`、`Fragment` 中注入 *state* ViewModel，請使用：

* `by viewModel()` - lazy 委託屬性，用於將 state ViewModel 實例注入到屬性中
* `getViewModel()` - 直接取得 state ViewModel 實例

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
所有 `stateViewModel` 函數都已棄用。 您只需使用常規的 `viewModel` 函數來注入 SavedStateHandle
:::

## Navigation Graph ViewModel

您可以將 ViewModel 實例限定於您的 Navigation graph。 只需使用 `by koinNavGraphViewModel()` 檢索。 您只需要您的 graph id。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

查看用於 ViewModel 和 Scope 的所有 API：[ViewModel Scope](/reference/koin-android/scope.md)

## ViewModel Generic API

Koin 提供了一些「幕後」API，可直接調整您的 ViewModel 實例。 可用的函數是 `viewModelForClass`，用於 `ComponentActivity` 和 `Fragment`：

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
此函數仍在使用 `state: BundleDefinition`，但會將其轉換為 `CreationExtras`
:::

請注意，您可以存取頂層函數，可從任何地方呼叫：

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

## ViewModel API - Java Compat

必須將 Java 相容性新增到您的相依性：

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

您可以使用 `ViewModelCompat` 中的 `viewModel()` 或 `getViewModel()` 靜態函數，將 ViewModel 實例注入到您的 Java 程式碼庫中：

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