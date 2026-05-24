---
title: Compose 中的 ViewModel
---

# Compose 中的 ViewModel

Koin 提供了多个用于在 Compose 应用程序中注入 ViewModel 的 API。本指南涵盖了所有 ViewModel 注入模式。

:::info
关于在模块中声明 ViewModel，请参阅 [核心 ViewModel](/docs/reference/koin-core/viewmodel)。本页面重点介绍在 Compose 中获取 ViewModel。
:::

## 设置

```kotlin
// Compose Multiplatform (或 Android)
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// Android 便捷包（包含 koin-compose + koin-compose-viewmodel）
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 包含导航集成
implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
```

:::info
所有 ViewModel API 都包含在 `koin-compose-viewmodel` 中。`koin-androidx-compose` 软件包会自动包含它。
:::

## 声明 ViewModel

### 编译器插件 DSL

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 注解

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    viewModelOf(::UserViewModel)
    // 或使用 lambda
    viewModel { UserViewModel(get()) }
}
```

## ViewModel 注入 API

### koinViewModel() - 基础注入

在 Compose 中注入 ViewModel 的主要 API：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // 使用 viewModel...
}
```

**最佳实践** —— 注入为默认形参以提高可测试性：

```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()
    // UI...
}
```

### koinNavViewModel() - 包含导航实参

使用 Navigation Compose 时，使用 `koinNavViewModel()` 通过 `SavedStateHandle` 自动接收导航实参：

```kotlin
// 带有实参的路由
NavHost(navController, startDestination = "list") {
    composable("detail/{itemId}") { backStackEntry ->
        DetailScreen()
    }
}

// ViewModel 自动接收实参
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    val itemId: String = savedStateHandle["itemId"] ?: ""
}

@Composable
fun DetailScreen(
    viewModel: DetailViewModel = koinNavViewModel()
) {
    // viewModel.itemId 已从导航实参中填充
}
```

### koinActivityViewModel() - Activity 作用域 (Android)

在同一 Activity 内的所有 Composable 之间共享一个 ViewModel：

```kotlin
@Composable
fun ScreenA() {
    // 在整个 Activity 中使用相同的实例
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}

@Composable
fun ScreenB() {
    // 与 ScreenA 使用相同的实例
    val sharedVM = koinActivityViewModel<SharedViewModel>()
}
```

:::note
从 4.1 版本开始在 `koin-androidx-compose` 中可用。
:::

### sharedKoinViewModel() - 导航图作用域

在导航图中共享 ViewModel（实验性）：

```kotlin
navigation<Route.BookGraph>(startDestination = Route.BookList) {
    composable<Route.BookList> { backStackEntry ->
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookListScreen(sharedVM)
    }
    composable<Route.BookDetail> { backStackEntry ->
        // 在 BookGraph 中使用相同的实例
        val sharedVM = backStackEntry.sharedKoinViewModel<BookSharedViewModel>(navController)
        BookDetailScreen(sharedVM)
    }
}
```

## 带参数的 ViewModel

### 使用 @InjectedParam

使用 `@InjectedParam` 标记运行时参数：

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

// 编译器插件 DSL
val appModule = module {
    viewModel<DetailViewModel>()
}
```

带参数注入：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

使用 `key` 形参为每个标识符（例如，导航实参）创建不同的 ViewModel 实例：

```kotlin
@Composable
fun DetailScreen(newsId: String) {
    val viewModel = koinViewModel<DetailViewModel>(key = newsId) {
        parametersOf(newsId)
    }
}
```

`key` 确保每个唯一的 `newsId` 都能获得自己的 ViewModel 实例，这对于可能以不同实参存在于返回栈中的屏幕非常重要。

### 带参数的经典 DSL

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

Koin 自动为 ViewModel 提供 `SavedStateHandle`：

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {
    // 访问导航实参
    val userId: String? = handle["userId"]

    // 跨进程销毁持久化状态
    var query by handle.saveable { mutableStateOf("") }
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // SavedStateHandle 自动注入
}
```

:::info
根据上下文，`SavedStateHandle` 从 ViewModel `CreationExtras` 或导航 `BackStackEntry` 中注入。
:::

## ViewModel 作用域

使用 `viewModelScope` 将依赖项限定在 ViewModel 生命周期内：

### 编译器插件 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 注解

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

## 快速参考

| API | 用例 | 软件包 |
|-----|----------|---------|
| `koinViewModel()` | 基础 ViewModel 注入 | `koin-compose-viewmodel` |
| `koinNavViewModel()` | 包含导航实参 | `koin-compose-viewmodel-navigation` |
| `koinActivityViewModel()` | 在 Activity 间共享 (Android) | `koin-androidx-compose` |
| `sharedKoinViewModel()` | 在导航图中共享 | `koin-compose-viewmodel-navigation` |

## 最佳实践

1. **注入为默认形参** —— 实现脱离 Koin 的测试
   ```kotlin
   @Composable
   fun MyScreen(viewModel: MyViewModel = koinViewModel())
   ```

2. **在导航中使用 koinNavViewModel()** —— 自动实参处理

3. **优先为 ViewModel 特定依赖项使用 viewModelScope** —— 整洁的生命周期管理

4. **不要在回调中注入 ViewModel** —— 在 Composable 级别注入
   ```kotlin
   // 错误做法
   Button(onClick = { val vm = koinViewModel<MyVM>() })

   // 正确做法
   val vm = koinViewModel<MyVM>()
   Button(onClick = { vm.doSomething() })
   ```

## 下一步

- **[Compose 生命周期](/docs/reference/koin-compose/compose-lifecycle)** —— 状态与重组
- **[核心 ViewModel](/docs/reference/koin-core/viewmodel)** —— ViewModel 声明 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** —— Android 特定功能