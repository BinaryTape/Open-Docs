---
title: Android ViewModel 與 Navigation
---

`koin-android` Gradle 模組引入了新的 `viewModel` DSL 關鍵字，作為 `single` 與 `factory` 的補充，協助宣告 `viewModel` 元件並將其綁定到 Android 元件的生命週期。`viewModelOf` 關鍵字也同樣可用，讓您可以使用其建構函式來宣告 `viewModel`。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

您宣告的元件必須至少繼承 `android.arch.lifecycle.ViewModel` 類別。您可以指定如何注入該類別的建構函式，並使用 `get()` 函式來注入相依性。

:::info
`viewModel`/`viewModelOf` 關鍵字有助於宣告 `ViewModel` 的工廠執行個體。此執行個體將由內部的 `ViewModelFactory` 處理，並在需要時重新附加 `ViewModel` 執行個體。它還允許注入參數。
:::

## 注入您的 ViewModel

若要在 `Activity`、`Fragment` 或 `Service` 中注入 `ViewModel`，請使用：

* `by viewModel()` - 延遲委派屬性，用於將 `ViewModel` 注入到屬性中
* `getViewModel()` - 直接獲取 `ViewModel` 執行個體

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 金鑰是根據金鑰和／或限定詞計算的
:::

## Activity 共享 ViewModel

一個 `ViewModel` 執行個體可以在 `Fragment` 及其宿主 `Activity` 之間共享。

若要在 `Fragment` 中注入「共享」的 `ViewModel`，請使用：

* `by activityViewModel()` - 延遲委派屬性，用於將共享的 `ViewModel` 執行個體注入到屬性中
* `getActivityViewModel()` - 直接獲取共享的 `ViewModel` 執行個體

:::note
`sharedViewModel` 已棄用，建議改用 `activityViewModel()` 函式。後者的命名更為明確。
:::

只需宣告 `ViewModel` 一次：

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注意：`ViewModel` 的限定詞將被視為 `ViewModel` 的標籤處理

並在 `Activity` 和 `Fragment` 中重複使用：

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

## 傳遞參數給建構函式

`viewModel` 關鍵字 API 與注入參數相容。

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

從注入呼叫點：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 注入 (3.3.0)

在您的建構函式中新增一個類型為 `SavedStateHandle` 的屬性來處理您的 `ViewModel` 狀態：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

在 Koin 模組中，只需使用 `get()` 或參數來解析它：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

或使用建構函式 DSL：

```kotlin
viewModelOf(::MyStateVM)
```

若要在 `Activity`、`Fragment` 中注入「狀態」`ViewModel`，請使用：

* `by viewModel()` - 延遲委派屬性，用於將狀態 `ViewModel` 執行個體注入到屬性中
* `getViewModel()` - 直接獲取狀態 `ViewModel` 執行個體

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
所有 `stateViewModel` 函式均已棄用。您可以直接使用一般的 `viewModel` 函式來注入 `SavedStateHandle`
:::

## Navigation Graph ViewModel

您可以將 `ViewModel` 執行個體的作用域限定在您的 Navigation 圖表中。只需使用 `by koinNavGraphViewModel()` 獲取即可。您只需要您的圖表 ID。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel 作用域 API

查看用於 `ViewModel` 和作用域的所有 API：[ViewModel 作用域](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModel 泛型 API

Koin 提供了一些「底層」API 來直接調整您的 `ViewModel` 執行個體。`ComponentActivity` 和 `Fragment` 的可用函式為 `viewModelForClass`：

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
此函式仍在使用 `state: BundleDefinition`，但會將其轉換為 `CreationExtras`
:::

請注意，您可以存取可從任何地方呼叫的頂層函式：

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

## ViewModel API - Java 相容性 

必須將 Java 相容性新增到您的相依性中：

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

您可以使用 `ViewModelCompat` 中的 `viewModel()` 或 `getViewModel()` 靜態函式，將 `ViewModel` 執行個體注入到您的 Java 程式碼庫中：

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