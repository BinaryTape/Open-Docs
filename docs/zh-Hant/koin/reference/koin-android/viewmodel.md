---
title: Android ViewModel 與 Navigation
---

`koin-android` Gradle 模組引入了一個新的 `viewModel` DSL 關鍵字，作為 `single` 和 `factory` 的補充，它有助於宣告一個 ViewModel 元件並將其綁定到 Android 元件的生命週期 (lifecycle)。`viewModelOf` 關鍵字也可用，讓您可以使用其建構函式 (constructor) 來宣告 ViewModel。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

您宣告的元件必須至少繼承 `android.arch.lifecycle.ViewModel` 類別。您可以指定如何注入該類別的 *建構函式 (constructor)*，並使用 `get()` 函式來注入依賴 (dependencies)。

:::info
`viewModel`/`viewModelOf` 關鍵字有助於宣告 ViewModel 的工廠實例 (factory instance)。此實例將由內部 ViewModelFactory 處理，並在需要時重新連接 ViewModel 實例。它還將允許注入參數 (parameters)。
:::

## 注入您的 ViewModel

要在 `Activity`、`Fragment` 或 `Service` 中注入 ViewModel，請使用：

*   `by viewModel()` - 惰性委託屬性 (lazy delegate property)，用於將 ViewModel 注入到屬性中
*   `getViewModel()` - 直接取得 ViewModel 實例

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 的鍵 (key) 是根據 Key 和/或 Qualifier 計算的
:::

## Activity 共享 ViewModel

一個 ViewModel 實例可以在 Fragment 及其主機 Activity 之間共享。

要在 `Fragment` 中注入一個 *共享* 的 ViewModel，請使用：

*   `by activityViewModel()` - 惰性委託屬性 (lazy delegate property)，用於將共享 ViewModel 實例注入到屬性中
*   `getActivityViewModel()` - 直接取得共享 ViewModel 實例

:::note
`sharedViewModel` 已被 `activityViewModel()` 函式棄用。後者的命名更為明確。
:::

只需宣告 ViewModel 一次：

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注意：ViewModel 的限定符 (qualifier) 將被視為 ViewModel 的標籤 (Tag)

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

## 向建構函式 (Constructor) 傳遞參數 (Parameters)

`viewModel` 關鍵字和注入 API 與注入參數 (injection parameters) 相容。

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

從注入呼叫端 (call site)：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 注入 (3.3.0)

在您的建構函式 (constructor) 中添加一個 `SavedStateHandle` 型別的新屬性，以處理您的 ViewModel 狀態 (state)：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

在 Koin 模組中，只需使用 `get()` 或參數 (parameters) 解析它：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

或使用 Constructor DSL：

```kotlin
viewModelOf(::MyStateVM)
```

要在 `Activity`、`Fragment` 中注入一個 *狀態* ViewModel，請使用：

*   `by viewModel()` - 惰性委託屬性 (lazy delegate property)，用於將狀態 ViewModel 實例注入到屬性中
*   `getViewModel()` - 直接取得狀態 ViewModel 實例

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
所有 `stateViewModel` 函式都已棄用。您可以直接使用常規的 `viewModel` 函式來注入 SavedStateHandle。
:::

## Navigation Graph ViewModel

您可以將 ViewModel 實例範圍限定在您的 Navigation graph。只需使用 `by koinNavGraphViewModel()` 擷取。您只需要您的 graph ID。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel 範圍 (Scope) API

查看所有用於 ViewModel 和範圍 (Scopes) 的 API：[ViewModel 範圍 (Scope)](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModel 通用 API

Koin 提供了一些「幕後 (under the hood)」API，可以直接調整您的 ViewModel 實例。可用的函式是 `ComponentActivity` 和 `Fragment` 的 `viewModelForClass`：

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
此函式仍使用 `state: BundleDefinition`，但會將其轉換為 `CreationExtras`。
:::

請注意，您可以從任何地方呼叫頂層函式 (top level function)：

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

## ViewModel API - Java 相容性 (Compat)

Java 相容性必須添加到您的依賴 (dependencies) 中：

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

您可以透過使用 `ViewModelCompat` 中的 `viewModel()` 或 `getViewModel()` 靜態函式，將 ViewModel 實例注入到您的 Java 程式碼庫 (codebase) 中：

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