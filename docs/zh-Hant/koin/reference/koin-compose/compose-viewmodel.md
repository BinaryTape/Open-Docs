---
title: Compose 中的 ViewModel
---

# Compose 中的 ViewModel

Koin 提供了多種 API 用於在 Compose 應用程式中注入 ViewModel。本指南涵蓋了所有的 ViewModel 注入模式。

:::info
關於在模組中宣告 ViewModel，請參閱 [Core ViewModel](/docs/reference/koin-core/viewmodel)。本頁面著重於在 Compose 中擷取 ViewModel。
:::

## 安裝

```kotlin
// Compose Multiplatform (或 Android)
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// Android 便利套件 (包含 koin-compose + koin-compose-viewmodel)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 與 Navigation 整合
implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
```

:::info
所有的 ViewModel API 都在 `koin-compose-viewmodel` 中。`koin-androidx-compose` 套件已自動包含它。
:::

## 宣告 ViewModel

### 編譯器外掛程式 DSL

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 註解

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    viewModelOf(::UserViewModel)
    // 或使用 lambda
    viewModel { UserViewModel(get()) }
}
```

## ViewModel 注入 API

### koinViewModel() - 基本注入

在 Compose 中注入 ViewModel 的主要 API：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // 使用 viewModel...
}
```

**最佳實務** - 注入為預設參數以提高測試可能性：

```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()
    // UI...
}
```

### koinNavViewModel() - 搭配 Navigation 引數

使用 Navigation Compose 時，使用 `koinNavViewModel()` 可透過 `SavedStateHandle` 自動接收導覽引數：

```kotlin
// 帶有引數的路由
NavHost(navController, startDestination = "list") {
    composable("detail/{itemId}") { backStackEntry ->
        DetailScreen()
    }
}

// ViewModel 自動接收引數
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    val itemId: String = savedStateHandle["itemId"] ?: ""
}

@Composable
fun DetailScreen(
    viewModel: DetailViewModel = koinNavViewModel()
) {
    // viewModel.itemId 已從導覽引數填入
}
```

### koinActivityViewModel() - Activity 作用域 (Android)

在同一個 Activity 內的所有 Composable 之間共用一個 ViewModel：

```kotlin
@Composable
fun ScreenA() {
    // Activity 內相同的執行個體
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}

@Composable
fun ScreenB() {
    // 與 ScreenA 相同的執行個體
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}
```

:::note
自 4.1 版本起在 `koin-androidx-compose` 中提供。
:::

### sharedKoinViewModel() - Navigation Graph 作用域

在導覽圖中共用一個 ViewModel (實驗性)：

```kotlin
navigation<Route.BookGraph>(startDestination = Route.BookList) {
    composable<Route.BookList> { backStackEntry ->
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookListScreen(sharedVM)
    }
    composable<Route.BookDetail> { backStackEntry ->
        // BookGraph 內相同的執行個體
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookDetailScreen(sharedVM)
    }
}
```

## 帶有參數的 ViewModel

### 使用 @InjectedParam

使用 `@InjectedParam` 標記執行期參數：

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

// 編譯器外掛程式 DSL
val appModule = module {
    viewModel<DetailViewModel>()
}
```

透過參數注入：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

### 帶有參數的 經典 DSL

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

Koin 會自動為 ViewModel 提供 `SavedStateHandle`：

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {
    // 存取導覽引數
    val userId: String? = handle["userId"]

    // 跨程序終止保持狀態
    var query by handle.saveable { mutableStateOf("") }
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // 自動注入 SavedStateHandle
}
```

:::info
`SavedStateHandle` 是從 ViewModel `CreationExtras` 或 Navigation `BackStackEntry` 注入，具體取決於上下文。
:::

## ViewModel 作用域

使用 `viewModelScope` 將相依性設定在 ViewModel 生命週期的作用域內：

### 編譯器外掛程式 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 註解

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 經典 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

## 快速參考

| API | 使用案例 | 套件 |
|-----|----------|---------|
| `koinViewModel()` | 基本 ViewModel 注入 | `koin-compose-viewmodel` |
| `koinNavViewModel()` | 搭配 Navigation 引數 | `koin-compose-viewmodel-navigation` |
| `koinActivityViewModel()` | 跨 Activity 共用 (Android) | `koin-androidx-compose` |
| `sharedKoinViewModel()` | 在導覽圖內共用 | `koin-compose-viewmodel-navigation` |

## 最佳實務

1. **注入為預設參數** - 實現無需 Koin 的測試
   ```kotlin
   @Composable
   fun MyScreen(viewModel: MyViewModel = koinViewModel())
   ```

2. **搭配 Navigation 使用 koinNavViewModel()** - 自動處理引數

3. **優先對 ViewModel 特定的相依性使用 viewModelScope** - 乾淨的生命週期管理

4. **不要在回呼中注入 ViewModel** - 請在 Composable 層級注入
   ```kotlin
   // 不良做法
   Button(onClick = { val vm = koinViewModel<MyVM>() })

   // 良好做法
   val vm = koinViewModel<MyVM>()
   Button(onClick = { vm.doSomething() })
   ```

## 後續步驟

- **[Compose 生命週期](/docs/reference/koin-compose/compose-lifecycle)** - 狀態與重組
- **[Core ViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel 宣告 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 特定功能