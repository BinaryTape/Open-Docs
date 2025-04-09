---
title: "Android ViewModel & Navigation"
---
`koin-android` Gradle 模块引入了一个新的 `viewModel` DSL 关键字，它是 `single` 和 `factory` 的补充，用于声明 `ViewModel` 组件并将其绑定到 Android 组件的生命周期。`viewModelOf` 关键字也可用，让你可以使用其构造函数声明 `ViewModel`。

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

你声明的组件必须至少扩展 `android.arch.lifecycle.ViewModel` 类。你可以指定如何注入该类的*构造函数*，并使用 `get()` 函数注入依赖项。

:::info
`viewModel`/`viewModelOf` 关键字有助于声明 `ViewModel` 的工厂实例。此实例将由内部 `ViewModelFactory` 处理，并在需要时重新附加 `ViewModel` 实例。它还可以注入参数。
:::

## 注入你的 ViewModel

要在 `Activity`、`Fragment` 或 `Service` 中注入 `ViewModel`，请使用：

* `by viewModel()` - 延迟委托属性，用于将 `ViewModel` 注入到属性中
* `getViewModel()` - 直接获取 `ViewModel` 实例

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 键是根据 Key 和/或 Qualifier 计算的
:::

## Activity 共享 ViewModel

一个 `ViewModel` 实例可以在 `Fragment` 及其宿主 `Activity` 之间共享。

要在 `Fragment` 中注入*共享* `ViewModel`，请使用：

* `by activityViewModel()` - 延迟委托属性，用于将共享 `ViewModel` 实例注入到属性中
* `getActivityViewModel()` - 直接获取共享 `ViewModel` 实例

:::note
`sharedViewModel` 已弃用，建议使用 `activityViewModel()` 函数。后者的命名更加明确。
:::

只需声明一次 `ViewModel`：

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

注意：`ViewModel` 的 `qualifier` 将被视为 `ViewModel` 的 Tag

并在 `Activity` 和 `Fragment` 中重复使用它：

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

## 将参数传递给构造函数

`viewModel` 关键字和注入 API 与注入参数兼容。

在模块中：

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

从注入调用点：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 注入 (3.3.0)

将一个类型为 `SavedStateHandle` 的新属性添加到你的构造函数中，以处理你的 `ViewModel` 状态：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

在 Koin 模块中，只需使用 `get()` 或参数来解析它：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

或者使用构造函数 DSL：

```kotlin
viewModelOf(::MyStateVM)
```

要在 `Activity`、`Fragment` 中注入*状态* `ViewModel`，请使用：

* `by viewModel()` - 延迟委托属性，用于将状态 `ViewModel` 实例注入到属性中
* `getViewModel()` - 直接获取状态 `ViewModel` 实例

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
所有 `stateViewModel` 函数都已弃用。你可以只使用常规的 `viewModel` 函数来注入 `SavedStateHandle`
:::

## Navigation Graph ViewModel

你可以将 `ViewModel` 实例限定到你的 Navigation 图。只需使用 `by koinNavGraphViewModel()` 检索。你只需要你的图 id。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

查看所有可用于 `ViewModel` 和 `Scope` 的 API：[ViewModel Scope](/reference/koin-android/scope.md)

## ViewModel Generic API

Koin 提供了一些“底层” API，可以直接调整你的 `ViewModel` 实例。可用的函数是 `viewModelForClass`，用于 `ComponentActivity` 和 `Fragment`:

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
此函数仍在使用 `state: BundleDefinition`，但会将其转换为 `CreationExtras`
:::

请注意，你可以访问顶层函数，可以从任何地方调用：

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

必须将 Java 兼容性添加到你的依赖项：

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

你可以使用 `ViewModelCompat` 中的 `viewModel()` 或 `getViewModel()` 静态函数将 `ViewModel` 实例注入到你的 Java 代码库中：

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