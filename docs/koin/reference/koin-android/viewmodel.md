---
title: Android ViewModel 与导航
---

`koin-android` Gradle 模块引入了新的 `viewModel` DSL 关键字，作为 `single` 和 `factory` 的补充，用于帮助声明 ViewModel 组件并将其绑定到 Android 组件的生命周期。此外还提供了 `viewModelOf` 关键字，让你能够通过构造函数来声明 ViewModel。

```kotlin
val appModule = module {

    // Detail View 的 ViewModel
    viewModel { DetailViewModel(get(), get()) }

    // 或直接使用构造函数
    viewModelOf(::DetailViewModel)

}
```

你声明的组件必须至少继承 `android.arch.lifecycle.ViewModel` 类。你可以指定如何注入该类的构造函数，并使用 `get()` 函数来注入依赖项。

:::info
`viewModel`/`viewModelOf` 关键字有助于声明 ViewModel 的工厂实例。该实例将由内部的 ViewModelFactory 处理，并在需要时重新附加 ViewModel 实例。它还支持注入参数。
:::

## 注入你的 ViewModel

要在 `Activity`、`Fragment` 或 `Service` 中注入 ViewModel，请使用：

* `by viewModel()` - 用于将 ViewModel 注入到属性中的延迟委托属性
* `getViewModel()` - 直接获取 ViewModel 实例

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延迟注入 ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 的键（key）是根据 Key 和/或限定符计算的
:::

## Activity 共享 ViewModel

一个 ViewModel 实例可以在 Fragment 及其宿主 Activity 之间共享。

要在 `Fragment` 中注入“共享”的 ViewModel，请使用：

* `by activityViewModel()` - 用于将共享 ViewModel 实例注入到属性中的延迟委托属性
* `getActivityViewModel()` - 直接获取共享 ViewModel 实例

:::note
`sharedViewModel` 已被弃用，建议使用 `activityViewModel()` 函数。后者的命名更加明确。
:::

只需声明一次 ViewModel：

```kotlin
val weatherAppModule = module {

    // 为 Weather View 组件声明 WeatherViewModel
    viewModel { WeatherViewModel(get(), get()) }
}
```

注意：ViewModel 的限定符将被视为 ViewModel 的标签 (Tag)。

然后在 Activity 和 Fragment 中复用它：

```kotlin
class WeatherActivity : AppCompatActivity() {

    /*
     * 使用 Koin 声明 WeatherViewModel 并允许构造函数依赖项注入
     */
    private val weatherViewModel by viewModel<WeatherViewModel>()
}

class WeatherHeaderFragment : Fragment() {

    /*
     * 声明与 WeatherActivity 共享的 WeatherViewModel
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}

class WeatherListFragment : Fragment() {

    /*
     * 声明与 WeatherActivity 共享的 WeatherViewModel
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}
```

## 向构造函数传递参数

`viewModel` 关键字 API 与注入参数兼容。

在模块中：

```kotlin
val appModule = module {

    // Detail View 的 ViewModel，将 id 作为参数注入
    viewModel { parameters -> DetailViewModel(id = parameters.get(), get(), get()) }
    // Detail View 的 ViewModel，将 id 作为参数注入，从图中解析
    viewModel { DetailViewModel(get(), get(), get()) }
    // 或使用构造函数 DSL
    viewModelOf(::DetailViewModel)
}
```

在注入调用站点：

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // 视图的 id

    // 使用 id 参数延迟注入 ViewModel
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 注入 (3.3.0)

在你的构造函数中添加一个类型为 `SavedStateHandle` 的新属性来处理 ViewModel 状态：

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

在 Koin 模块中，只需通过 `get()` 或参数解析它：

```kotlin
viewModel { MyStateVM(get(), get()) }
```

或使用构造函数 DSL：

```kotlin
viewModelOf(::MyStateVM)
```

要在 `Activity`、`Fragment` 中注入“状态”ViewModel，请使用：

* `by viewModel()` - 用于将状态 ViewModel 注入到属性中的延迟委托属性
* `getViewModel()` - 直接获取状态 ViewModel 实例

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入了 SavedStateHandle 的 MyStateVM viewModel
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
所有的 `stateViewModel` 函数均已弃用。你只需使用常规的 `viewModel` 函数即可注入 SavedStateHandle。
:::

## 导航图 ViewModel

你可以将 ViewModel 实例的作用域限定到你的导航图 (Navigation graph)。只需使用 `by koinNavGraphViewModel()` 进行检索。你只需要提供你的导航图 id。

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel 作用域 API

查看所有用于 ViewModel 和作用域的 API：[ViewModel 作用域](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModel 泛型 API

Koin 提供了一些“底层”API 来直接调整你的 ViewModel 实例。适用于 `ComponentActivity` 和 `Fragment` 的函数是 `viewModelForClass`：

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
此函数仍在使用 `state: BundleDefinition`，但会将其转换为 `CreationExtras`。
:::

请注意，你可以访问顶层函数，可在任何地方调用：

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

## ViewModel API - Java 兼容性 

必须将 Java 兼容性添加到你的依赖项中：

```groovy
// Java 兼容性
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

你可以通过使用 `ViewModelCompat` 中的 `viewModel()` 或 `getViewModel()` 静态函数将 ViewModel 实例注入到你的 Java 代码库中：

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