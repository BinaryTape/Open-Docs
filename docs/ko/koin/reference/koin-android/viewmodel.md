---
title: Android ViewModel 및 Navigation
---

`koin-android` Gradle 모듈은 `single` 및 `factory`를 보완하는 새로운 `viewModel` DSL 키워드를 도입하여, ViewModel 컴포넌트를 선언하고 이를 안드로이드 컴포넌트 생명주기(lifecycle)에 바인딩할 수 있도록 돕습니다. 생성자를 통해 ViewModel을 선언할 수 있는 `viewModelOf` 키워드도 사용할 수 있습니다.

```kotlin
val appModule = module {

    // 상세 뷰를 위한 ViewModel
    viewModel { DetailViewModel(get(), get()) }

    // 또는 생성자를 사용하여 직접 선언
    viewModelOf(::DetailViewModel)

}
```

선언된 컴포넌트는 최소한 `android.arch.lifecycle.ViewModel` 클래스를 상속해야 합니다. 클래스의 *생성자(constructor)*를 어떻게 주입할지 지정할 수 있으며, `get()` 함수를 사용하여 의존성을 주입할 수 있습니다.

:::info
`viewModel`/`viewModelOf` 키워드는 ViewModel의 팩토리 인스턴스를 선언하는 데 도움이 됩니다. 이 인스턴스는 내부 `ViewModelFactory`에 의해 처리되며, 필요한 경우 ViewModel 인스턴스를 다시 연결(reattach)합니다. 또한 파라미터 주입도 가능하게 해줍니다.
:::

## ViewModel 주입하기

`Activity`, `Fragment` 또는 `Service`에서 ViewModel을 주입하려면 다음을 사용하세요:

* `by viewModel()` - 프로퍼티에 ViewModel을 주입하는 지연 위임(lazy delegate) 프로퍼티
* `getViewModel()` - ViewModel 인스턴스를 직접 가져오기

```kotlin
class DetailActivity : AppCompatActivity() {

    // ViewModel 지연 주입
    val detailViewModel: DetailViewModel by viewModel()
}
```

:::note
ViewModel 키는 Key 및/또는 Qualifier를 기준으로 계산됩니다.
:::

## Activity 공유 ViewModel

하나의 ViewModel 인스턴스를 Fragment와 해당 호스트 Activity 간에 공유할 수 있습니다.

`Fragment`에서 *공유(shared)* ViewModel을 주입하려면 다음을 사용하세요:

* `by activityViewModel()` - 공유된 ViewModel 인스턴스를 프로퍼티에 주입하는 지연 위임 프로퍼티
* `getActivityViewModel()` - 공유된 ViewModel 인스턴스를 직접 가져오기

:::note
`sharedViewModel`은 `activityViewModel()` 함수로 대체되어 지원 중단(deprecated)되었습니다. 후자의 명칭이 더 명확합니다.
:::

ViewModel은 한 번만 선언하면 됩니다:

```kotlin
val weatherAppModule = module {

    // Weather View 컴포넌트를 위한 WeatherViewModel 선언
    viewModel { WeatherViewModel(get(), get()) }
}
```

참고: ViewModel의 한정자(qualifier)는 ViewModel의 Tag로 처리됩니다.

그리고 Activity와 Fragment에서 이를 재사용합니다:

```kotlin
class WeatherActivity : AppCompatActivity() {

    /*
     * Koin으로 WeatherViewModel을 선언하고 생성자 의존성 주입을 허용합니다.
     */
    private val weatherViewModel by viewModel<WeatherViewModel>()
}

class WeatherHeaderFragment : Fragment() {

    /*
     * WeatherActivity와 공유되는 WeatherViewModel을 선언합니다.
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}

class WeatherListFragment : Fragment() {

    /*
     * WeatherActivity와 공유되는 WeatherViewModel을 선언합니다.
     */
    private val weatherViewModel by activityViewModel<WeatherViewModel>()
}
```

## 생성자에 파라미터 전달하기

`viewModel` 키워드 API는 주입 파라미터와 호환됩니다.

모듈에서:

```kotlin
val appModule = module {

    // 파라미터 주입으로 id를 받는 상세 뷰용 ViewModel
    viewModel { parameters -> DetailViewModel(id = parameters.get(), get(), get()) }
    // 그래프에서 해결되는 id를 파라미터 주입으로 받는 상세 뷰용 ViewModel
    viewModel { DetailViewModel(get(), get(), get()) }
    // 또는 생성자 DSL
    viewModelOf(::DetailViewModel)
}
```

주입 호출 지점에서:

```kotlin
class DetailActivity : AppCompatActivity() {

    val id : String // 뷰의 id

    // id 파라미터를 사용하여 ViewModel 지연 주입
    val detailViewModel: DetailViewModel by viewModel{ parametersOf(id)}
}
```

## SavedStateHandle 주입 (3.3.0)

ViewModel 상태를 처리하기 위해 생성자에 `SavedStateHandle` 타입의 새 프로퍼티를 추가하세요:

```kotlin
class MyStateVM(val handle: SavedStateHandle, val myService : MyService) : ViewModel()
```

Koin 모듈에서 `get()` 또는 파라미터를 사용하여 이를 해결(resolve)하기만 하면 됩니다:

```kotlin
viewModel { MyStateVM(get(), get()) }
```

또는 생성자 DSL을 사용합니다:

```kotlin
viewModelOf(::MyStateVM)
```

`Activity`, `Fragment`에서 *상태(state)* ViewModel을 주입하려면 다음을 사용하세요:

* `by viewModel()` - 프로퍼티에 상태 ViewModel 인스턴스를 주입하는 지연 위임 프로퍼티
* `getViewModel()` - 상태 ViewModel 인스턴스를 직접 가져오기

```kotlin
class DetailActivity : AppCompatActivity() {

    // SavedStateHandle과 함께 주입된 MyStateVM viewModel
    val myStateVM: MyStateVM by viewModel()
}
```

:::info
모든 `stateViewModel` 함수는 지원 중단되었습니다. `SavedStateHandle`을 주입하기 위해 일반 `viewModel` 함수를 사용할 수 있습니다.
:::

## Navigation Graph ViewModel

ViewModel 인스턴스의 범위를 Navigation 그래프로 제한(scope)할 수 있습니다. `by koinNavGraphViewModel()`을 사용하여 가져오기만 하면 됩니다. 이때 그래프 ID가 필요합니다.

```kotlin
class NavFragment : Fragment() {

    val mainViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)

}
```

## ViewModel Scope API

ViewModel 및 Scope에 사용되는 모든 API는 다음을 참조하세요: [ViewModel Scope](/docs/reference/koin-android/scope.md#viewmodel-scope-since-354)

## ViewModel 제네릭 API

Koin은 ViewModel 인스턴스를 직접 조정할 수 있는 몇 가지 "내부(under the hood)" API를 제공합니다. `ComponentActivity` 및 `Fragment`에서 사용할 수 있는 함수는 `viewModelForClass`입니다:

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
이 함수는 여전히 `state: BundleDefinition`을 사용하지만, 이를 `CreationExtras`로 변환합니다.
:::

어디서나 호출할 수 있는 최상위(top level) 함수에도 접근할 수 있음에 유의하세요:

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

Java 호환성을 위해 다음 의존성을 추가해야 합니다:

```groovy
// Java 호환성
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat`의 `viewModel()` 또는 `getViewModel()` 정적 함수를 사용하여 Java 코드베이스에 ViewModel 인스턴스를 주입할 수 있습니다:

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