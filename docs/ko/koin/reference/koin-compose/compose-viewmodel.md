---
title: Compose에서의 ViewModel
---

# Compose에서의 ViewModel

Koin은 Compose 애플리케이션에서 ViewModel을 주입하기 위한 여러 API를 제공합니다. 이 가이드는 모든 ViewModel 주입 패턴을 다룹니다.

:::info
모듈에서 ViewModel을 선언하는 방법은 [Core ViewModel](/docs/reference/koin-core/viewmodel)을 참조하세요. 이 페이지는 Compose에서 ViewModel을 가져오는(retrieving) 방법에 집중합니다.
:::

## 설정 (Setup)

```kotlin
// Compose 멀티플랫폼 (또는 Android)
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// Android 편의 도구 (koin-compose + koin-compose-viewmodel 포함)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 네비게이션(Navigation) 통합 사용 시
implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
```

:::info
모든 ViewModel API는 `koin-compose-viewmodel`에 포함되어 있습니다. `koin-androidx-compose` 패키지는 이를 자동으로 포함합니다.
:::

## ViewModel 선언하기

### 컴파일러 플러그인 DSL

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 어노테이션 (Annotations)

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    viewModelOf(::UserViewModel)
    // 또는 람다 사용
    viewModel { UserViewModel(get()) }
}
```

## ViewModel 주입 API

### koinViewModel() - 기본 주입

Compose에서 ViewModel을 주입하기 위한 기본 API입니다.

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // viewModel 사용...
}
```

**권장 사항(Best practice)** - 테스트 가능성을 위해 기본 파라미터로 주입하세요.

```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()
    // UI...
}
```

### koinNavViewModel() - 네비게이션 인자 포함

Navigation Compose를 사용할 때, `SavedStateHandle`을 통해 네비게이션 인자(arguments)를 자동으로 전달받으려면 `koinNavViewModel()`을 사용하세요.

```kotlin
// 인자가 있는 경로(Route)
NavHost(navController, startDestination = "list") {
    composable("detail/{itemId}") { backStackEntry ->
        DetailScreen()
    }
}

// ViewModel은 자동으로 인자를 전달받음
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    val itemId: String = savedStateHandle["itemId"] ?: ""
}

@Composable
fun DetailScreen(
    viewModel: DetailViewModel = koinNavViewModel()
) {
    // viewModel.itemId는 네비게이션 인자로부터 채워짐
}
```

### koinActivityViewModel() - Activity 스코프 (Android)

동일한 Activity 내의 모든 Composable에서 ViewModel 인스턴스를 공유합니다.

```kotlin
@Composable
fun ScreenA() {
    // Activity 전체에서 동일한 인스턴스
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}

@Composable
fun ScreenB() {
    // ScreenA와 동일한 인스턴스
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}
```

:::note
버전 4.1부터 `koin-androidx-compose`에서 사용할 수 있습니다.
:::

### sharedKoinViewModel() - 네비게이션 그래프 스코프

네비게이션 그래프 내에서 ViewModel을 공유합니다 (실험적 기능).

```kotlin
navigation<Route.BookGraph>(startDestination = Route.BookList) {
    composable<Route.BookList> { backStackEntry ->
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookListScreen(sharedVM)
    }
    composable<Route.BookDetail> { backStackEntry ->
        // BookGraph 내에서 동일한 인스턴스
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookDetailScreen(sharedVM)
    }
}
```

## 파라미터가 있는 ViewModel

### @InjectedParam 사용

런타임 파라미터를 `@InjectedParam`으로 표시합니다.

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

// 컴파일러 플러그인 DSL
val appModule = module {
    viewModel<DetailViewModel>()
}
```

파라미터와 함께 주입:

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

### 파라미터가 있는 클래식 DSL

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

## SavedStateHandle

Koin은 ViewModel에 `SavedStateHandle`을 자동으로 제공합니다.

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {
    // 네비게이션 인자에 접근
    val userId: String? = handle["userId"]

    // 프로세스 종료 후에도 상태 유지
    var query by handle.saveable { mutableStateOf("") }
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // SavedStateHandle이 자동으로 주입됨
}
```

:::info
`SavedStateHandle`은 컨텍스트에 따라 ViewModel의 `CreationExtras` 또는 네비게이션의 `BackStackEntry`에서 주입됩니다.
:::

## ViewModel 스코프 (ViewModel Scope)

`viewModelScope`를 사용하여 의존성의 스코프를 ViewModel 생명주기에 맞춥니다.

### 컴파일러 플러그인 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 어노테이션

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

## 빠른 참조 (Quick Reference)

| API | 사용 사례 | 패키지 |
|-----|----------|---------|
| `koinViewModel()` | 기본적인 ViewModel 주입 | `koin-compose-viewmodel` |
| `koinNavViewModel()` | 네비게이션 인자 포함 시 | `koin-compose-viewmodel-navigation` |
| `koinActivityViewModel()` | Activity 간 공유 (Android) | `koin-androidx-compose` |
| `sharedKoinViewModel()` | 네비게이션 그래프 내 공유 | `koin-compose-viewmodel-navigation` |

## 권장 사항 (Best Practices)

1. **기본 파라미터로 주입하세요** - Koin 없이도 테스트가 가능해집니다.
   ```kotlin
   @Composable
   fun MyScreen(viewModel: MyViewModel = koinViewModel())
   ```

2. **네비게이션 사용 시 koinNavViewModel()을 사용하세요** - 인자 처리가 자동화됩니다.

3. **ViewModel 전용 의존성에는 viewModelScope를 선호하세요** - 깔끔한 생명주기 관리가 가능합니다.

4. **콜백 안에서 ViewModel을 주입하지 마세요** - Composable 레벨에서 주입하세요.
   ```kotlin
   // 나쁜 예
   Button(onClick = { val vm = koinViewModel<MyVM>() })

   // 좋은 예
   val vm = koinViewModel<MyVM>()
   Button(onClick = { vm.doSomething() })
   ```

## 다음 단계

- **[Compose Lifecycle](/docs/reference/koin-compose/compose-lifecycle)** - 상태 및 리컴포지션(Recomposition)
- **[Core ViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel 선언 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 관련 기능