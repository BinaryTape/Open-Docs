---
title: Android ViewModel 및 Navigation
---

`koin-android` Gradle 모듈은 `single` 및 `factory`에 더해 새로운 `viewModel` DSL 키워드를 도입합니다. 이 키워드는 ViewModel 컴포넌트를 선언하고 이를 Android 컴포넌트 생명주기에 바인딩하는 데 도움을 줍니다. `viewModelOf` 키워드 또한 ViewModel을 생성자와 함께 선언할 수 있도록 제공됩니다.

```kotlin
val appModule = module {

    // ViewModel for Detail View
    viewModel { DetailViewModel(get(), get()) }

    // or directly with constructor
    viewModelOf(::DetailViewModel)

}
```

선언된 컴포넌트는 최소한 `android.arch.lifecycle.ViewModel` 클래스를 확장해야 합니다. 클래스의 *생성자*를 어떻게 주입할지 지정할 수 있으며, `get()` 함수를 사용하여 의존성을 주입할 수 있습니다.

:::info
`viewModel`/`viewModelOf` 키워드는 ViewModel의 팩토리 인스턴스를 선언하는 데 도움을 줍니다. 이 인스턴스는 내부 ViewModelFactory에 의해 처리되며, 필요한 경우 ViewModel 인스턴스를 다시 연결합니다.
또한 매개변수 주입도 가능하게 합니다.
:::

## ViewModel 주입

`Activity`, `Fragment` 또는 `Service`에 ViewModel을 주입하려면 다음을 사용합니다.

*   `by viewModel()` - 프로퍼티에 ViewModel을 주입하는 지연(lazy) 델리게이트 프로퍼티
*   `getViewModel()` - ViewModel 인스턴스를 직접 가져옵니다.

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject ViewModel
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 키는 Key 및/또는 Qualifier를 기준으로 계산됩니다.
:::

## Activity 공유 ViewModel

하나의 ViewModel 인스턴스는 Fragment와 이를 호스팅하는 Activity 간에 공유될 수 있습니다.

`Fragment`에서 *공유* ViewModel을 주입하려면 다음을 사용합니다.

*   `by activityViewModel()` - 공유 ViewModel 인스턴스를 프로퍼티에 주입하는 지연 델리게이트 프로퍼티
*   `getActivityViewModel()` - 공유 ViewModel 인스턴스를 직접 가져옵니다.

:::note
`sharedViewModel`은 `activityViewModel()` 함수로 대체되어 더 이상 사용되지 않습니다. `activityViewModel()`의 명명법이 더 명확합니다.
:::

ViewModel은 한 번만 선언하면 됩니다.

```kotlin
val weatherAppModule = module {

    // WeatherViewModel declaration for Weather View components
    viewModel { WeatherViewModel(get(), get()) }
}
```

참고: ViewModel의 한정자(qualifier)는 ViewModel의 태그(Tag)로 처리됩니다.

그리고 Activity와 Fragment에서 재사용합니다.

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

## 생성자로 매개변수 전달

`viewModel` 키워드와 주입 API는 매개변수 주입과 호환됩니다.

모듈에서:

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

주입 호출 위치에서:

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // id of the view

    // Lazy inject ViewModel with id parameter
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 주입 (3.3.0)

ViewModel 상태를 처리하려면 생성자에 `SavedStateHandle` 타입의 새 프로퍼티를 추가하세요.

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

Koin 모듈에서는 `get()`을 사용하거나 매개변수와 함께 해결하면 됩니다.

```kotlin
viewModel { MyStateVM(get(), get()) }
```

또는 Constructor DSL을 사용합니다.

```kotlin
viewModelOf(::MyStateVM)
```

`Activity`, `Fragment`에서 *상태(state)* ViewModel을 주입하려면 다음을 사용합니다.

*   `by viewModel()` - 상태 ViewModel 인스턴스를 프로퍼티에 주입하는 지연 델리게이트 프로퍼티
*   `getViewModel()` - 상태 ViewModel 인스턴스를 직접 가져옵니다.

```kotlin
class DetailActivity : AppCompatActivity() {

    // MyStateVM viewModel injected with SavedStateHandle
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
모든 `stateViewModel` 함수는 더 이상 사용되지 않습니다. 일반적인 `viewModel` 함수를 사용하여 SavedStateHandle을 주입할 수 있습니다.
:::

## Navigation Graph ViewModel

ViewModel 인스턴스를 Navigation 그래프에 스코프할 수 있습니다. `by koinNavGraphViewModel()`을 사용하여 가져오기만 하면 됩니다. 그래프 ID만 있으면 됩니다.

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

ViewModel 및 스코프에 사용되는 모든 API는 다음을 참조하십시오: [ViewModel Scope](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModel 일반 API

Koin은 ViewModel 인스턴스를 직접 조정할 수 있는 "내부" API를 제공합니다. `ComponentActivity` 및 `Fragment`에 사용할 수 있는 함수는 `viewModelForClass`입니다.

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
이 함수는 여전히 `state: BundleDefinition`을 사용하지만, 이를 `CreationExtras`로 변환할 것입니다.
:::

어디서든 호출할 수 있는 최상위 함수에 접근할 수 있습니다.

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

## ViewModel API - Java 호환성

Java 호환성은 의존성에 추가되어야 합니다.

```groovy
// Java Compatibility
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat`의 `viewModel()` 또는 `getViewModel()` 정적 함수를 사용하여 ViewModel 인스턴스를 Java 코드베이스에 주입할 수 있습니다.

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