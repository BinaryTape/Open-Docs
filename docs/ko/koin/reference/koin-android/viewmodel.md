---
title: Android ViewModel
---

이 페이지는 Android 전용 ViewModel 기능을 다룹니다. 핵심 ViewModel DSL 및 멀티플랫폼 지원에 대해서는 [ViewModel](/docs/reference/koin-core/viewmodel)을 참조하세요.

## 개요

[ViewModels](https://developer.android.com/topic/libraries/architecture/viewmodel)는 구성 변경(configuration changes)에도 유지되고 UI 관련 데이터를 관리하도록 설계된 아키텍처 컴포넌트입니다. Koin은 생명주기를 인식하는 주입(lifecycle-aware injection)을 통해 ViewModel에 대한 특별한 지원을 제공합니다.

### 주요 개념

- **구성 변경에도 유지됨** - ViewModel은 화면 회전 및 테마 변경 시에도 유지됩니다.
- **생명주기에 스코프 지정** - Activity, Fragment 또는 Navigation Graph 생명주기에 연결됩니다.
- **지연 생성 (Lazy Creation)** - 처음 액세스할 때만 생성됩니다.
- **공유 인스턴스** - Fragment와 호스트 Activity 간에 공유할 수 있습니다.

:::info
**멀티플랫폼 ViewModel** - Koin ViewModel DSL은 `koin-core-viewmodel`을 통해 완전한 멀티플랫폼을 지원합니다. Compose Multiplatform의 경우, [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)을 참조하세요.
:::

### ViewModel 스코프 제한 사항

:::warning
**중요:** ViewModel은 루트 Koin 스코프를 기준으로 생성되며, Activity 또는 Fragment 스코프의 의존성에 **접근할 수 없습니다**. 이는 ViewModel이 Activity나 Fragment보다 더 오래 생존하기 때문에 메모리 누수를 방지하기 위함입니다.

**ViewModel에서 스코프 의존성이 필요하신가요?** [ViewModel 스코프](/docs/reference/koin-core/scopes#viewmodel-scope)를 사용하여 ViewModel의 생명주기에 연결된 전용 스코프를 생성하세요.
:::

## ViewModel 선언하기

### 컴파일러 플러그인 DSL

```kotlin
val appModule = module {
    viewModel<DetailViewModel>()
    viewModel<UserViewModel>()
}
```

### 애노테이션

```kotlin
@KoinViewModel
class DetailViewModel(
    private val repository: DetailRepository
) : ViewModel()

@KoinViewModel
class UserViewModel(
    private val userRepository: UserRepository
) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    // 생성자 참조 사용
    viewModelOf(::DetailViewModel)

    // 람다 사용
    viewModel { DetailViewModel(get()) }
}
```

## ViewModel 주입하기

`Activity`, `Fragment` 또는 `Service`에서 다음을 사용하세요:

* `by viewModel()` - 지연 위임(lazy delegate) 프로퍼티
* `getViewModel()` - 즉시 가져오기(eager fetch)

```kotlin
class DetailActivity : AppCompatActivity() {

    // ViewModel 지연 주입
    private val viewModel: DetailViewModel by viewModel()

    // 또는 즉시 주입
    // private val viewModel: DetailViewModel = getViewModel()
}
```

## 공유 ViewModel (Activity)

Fragment와 해당 호스트 Activity 간에 ViewModel을 공유합니다:

* `by activityViewModel()` - 공유된 ViewModel을 위한 지연 위임 프로퍼티
* `getActivityViewModel()` - 공유된 ViewModel 즉시 가져오기

```kotlin
class WeatherActivity : AppCompatActivity() {
    private val weatherViewModel: WeatherViewModel by viewModel()
}

class WeatherHeaderFragment : Fragment() {
    // Activity와 공유됨
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}

class WeatherListFragment : Fragment() {
    // WeatherHeaderFragment와 동일한 인스턴스
    private val weatherViewModel: WeatherViewModel by activityViewModel()
}
```

## 파라미터 전달하기

### 컴파일러 플러그인 DSL

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### 애노테이션

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    viewModel { params ->
        DetailViewModel(
            itemId = params.get(),
            repository = get()
        )
    }
}
```

### 주입 시점

```kotlin
class DetailActivity : AppCompatActivity() {

    private val itemId: String by lazy { intent.getStringExtra("ITEM_ID")!! }

    // 주입 시점에 파라미터 전달
    private val viewModel: DetailViewModel by viewModel { parametersOf(itemId) }
}
```

## SavedStateHandle

ViewModel 생성자에 `SavedStateHandle`을 추가하면 Koin이 자동으로 주입합니다:

### 애노테이션

```kotlin
@KoinViewModel
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()
```

### DSL

```kotlin
class MyStateViewModel(
    private val handle: SavedStateHandle,
    private val repository: MyRepository
) : ViewModel()

val appModule = module {
    viewModel<MyStateViewModel>()  // 컴파일러 플러그인 DSL
    // 또는
    viewModelOf(::MyStateViewModel)  // 클래식 DSL
}
```

### 사용법

```kotlin
class DetailActivity : AppCompatActivity() {
    // SavedStateHandle이 자동으로 주입됨
    private val viewModel: MyStateViewModel by viewModel()
}
```

:::info
모든 `stateViewModel` 함수는 지원 중단(deprecated)되었습니다. 일반 `viewModel` 함수를 사용하세요. `SavedStateHandle`은 자동으로 주입됩니다.
:::

## Navigation Graph ViewModel

ViewModel의 범위를 Navigation 그래프로 제한합니다:

```kotlin
class NavFragment : Fragment() {

    // navigation 그래프에 스코프가 지정됨
    private val navViewModel: NavViewModel by koinNavGraphViewModel(R.id.my_graph)
}
```

이 ViewModel은 다음과 같이 동작합니다:
- 그래프의 첫 번째 Fragment가 액세스할 때 생성됨
- 그래프 내의 모든 Fragment에서 공유됨
- Navigation 그래프가 팝(pop)될 때 소멸됨

## 스코프 의존성을 가진 ViewModel

ViewModel에 고유한 스코프 의존성이 필요한 경우 [ViewModel 스코프](/docs/reference/koin-core/scopes#viewmodel-scope)를 사용하세요:

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

## ViewModel 제네릭 API

고급 사용 사례를 위해 Koin은 하위 수준의 API를 제공합니다:

```kotlin
// ComponentActivity 또는 Fragment에서 호출
val viewModel = viewModelForClass(
    clazz = MyViewModel::class,
    qualifier = null,
    owner = this,
    key = null,
    parameters = { parametersOf("param") }
)
```

## Java 호환성

호환성(compat) 의존성을 추가하세요:

```groovy
implementation "io.insert-koin:koin-android-compat:$koin_version"
```

`ViewModelCompat` 정적 메서드를 사용하세요:

```java
MyViewModel viewModel = ViewModelCompat.getViewModel(this, MyViewModel.class);
```

## 빠른 참조

| 작업 | 코드 |
|--------|------|
| ViewModel 선언 | `viewModel<MyVM>()` / `@KoinViewModel` |
| Activity/Fragment에서 주입 | `by viewModel()` |
| Activity와 공유 | `by activityViewModel()` |
| 파라미터 전달 | `by viewModel { parametersOf(id) }` |
| Navigation 그래프 스코프 | `by koinNavGraphViewModel(R.id.graph)` |
| SavedStateHandle과 함께 사용 | 생성자에 추가만 하면 됨 |

## 다음 단계

- **[핵심 ViewModel](/docs/reference/koin-core/viewmodel)** - 멀티플랫폼 ViewModel DSL
- **[스코프](/docs/reference/koin-core/scopes#viewmodel-scope)** - 스코프 의존성을 위한 ViewModel 스코프
- **[테스트](/docs/reference/koin-test/testing)** - ViewModel 테스트
- **[Compose](/docs/reference/koin-compose/compose)** - Compose에서의 ViewModel