---
title: 生命周期与状态
---

# Compose 中的生命周期与状态

本指南涵盖了 Koin 如何与 Compose 的生命周期和状态管理集成。理解这些概念有助于您编写高效、无错误 (bug-free) 的 Compose 应用程序。

:::info
本指南与 [Android 官方 Compose 生命周期文档](https://developer.android.com/develop/ui/compose/lifecycle) 保持一致。
:::

## Compose 生命周期概览

一个 Composable 函数具有三个生命周期事件：

1.  **进入组合 (Enter Composition)** - Composable 首次被调用。
2.  **重组 (Recomposition)** - 当状态变化时，Composable 重新执行（0 次或多次）。
3.  **离开组合 (Leave Composition)** - Composable 从树中移除。

Koin 的 Compose API 旨在与该生命周期高效协作。

## 注入与重组

### koinInject() 的工作原理

`koinInject()` 从 Koin 获取实例，并在多次重组中**记住 (remember)** 它们：

```kotlin
@Composable
fun MyScreen() {
    // 解析一次，在多次重组中被记住
    val repository = koinInject<UserRepository>()

    // 安全 - 使用相同的实例
    val users by repository.users.collectAsState()
}
```

### 注入时机

应在 **Composable 函数级别**注入依赖项，而不是在回调内部：

```kotlin
@Composable
fun MyScreen() {
    // 正确 - 在组合时解析
    val repository = koinInject<UserRepository>()
    val viewModel = koinViewModel<MyViewModel>()

    Button(onClick = {
        // 错误 - 不要从回调中注入
        val service = koinInject<Service>() // 避免！

        // 正确 - 使用已经注入的实例
        repository.save()
    }) {
        Text("Save")
    }
}
```

### 带形参的性能

当在 `koinInject` 中使用形参时，首选显式形参形式：

```kotlin
@Composable
fun MyScreen(userId: String) {
    // 更高效 - 形参仅评估一次
    val presenter = koinInject<UserPresenter>(
        parameters = parametersOf(userId)
    )

    // 效率较低 - lambda 会在重组时重新评估
    val presenter = koinInject<UserPresenter> {
        parametersOf(userId)
    }
}
```

## 使用 Koin 进行状态管理

### StateFlow 与 collectAsState

使用 Koin 进行响应式 UI 开发的标准模式：

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state.asStateFlow()

    init {
        loadUsers()
    }

    private fun loadUsers() {
        viewModelScope.launch {
            _state.value = UiState.Success(repository.getUsers())
        }
    }
}

@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()

    when (val s = state) {
        is UiState.Loading -> LoadingIndicator()
        is UiState.Success -> UserList(s.users)
        is UiState.Error -> ErrorMessage(s.message)
    }
}
```

### 直接注入仓库 (Repository)

对于较简单的场景，直接注入仓库：

```kotlin
@Singleton
class UserRepository {
    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()
}

@Composable
fun UserListScreen() {
    val repository = koinInject<UserRepository>()
    val users by repository.users.collectAsState()

    LazyColumn {
        items(users) { user ->
            UserCard(user)
        }
    }
}
```

### remember() 与 koinInject()

因地制宜，使用正确的工具：

```kotlin
@Composable
fun MyScreen() {
    // Koin 管理的依赖项
    val viewModel = koinViewModel<MyViewModel>()
    val repository = koinInject<Repository>()

    // Compose 管理的状态
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()
    var text by remember { mutableStateOf("") }

    // 不要将 koinInject 包裹在 remember 中（没必要）
    val service = remember { koinInject<Service>() } // 冗余！
}
```

## 使用 Koin 处理副作用 (Side Effects)

### LaunchedEffect

在进入组合或键 (key) 更改时执行挂起代码：

```kotlin
@Composable
fun UserDetailScreen(userId: String) {
    val repository = koinInject<UserRepository>()
    var user by remember { mutableStateOf<User?>(null) }

    // 当 userId 更改时运行
    LaunchedEffect(userId) {
        user = repository.getUser(userId)
    }

    user?.let { UserContent(it) }
}
```

### DisposableEffect

在离开组合时清理资源：

```kotlin
@Composable
fun EventScreen() {
    val eventBus = koinInject<EventBus>()

    DisposableEffect(Unit) {
        val listener = eventBus.subscribe { event ->
            // 处理事件
        }

        onDispose {
            eventBus.unsubscribe(listener)
        }
    }
}
```

### SideEffect

在每次成功的重组后执行非挂起副作用：

```kotlin
@Composable
fun AnalyticsScreen(screenName: String) {
    val analytics = koinInject<Analytics>()

    SideEffect {
        analytics.logScreenView(screenName)
    }
}
```

## 稳定性与跳过

### 理解稳定类型

当输入未发生变化时，Compose 可以跳过重组。为了实现这一点，形参类型必须是**稳定 (stable)** 的：

```kotlin
// 稳定 - Compose 可以跳过
@Composable
fun UserCard(
    name: String,                    // 基本类型 - 稳定
    onClick: () -> Unit,             // Lambda - 稳定
    viewModel: UserViewModel = koinViewModel()  // 被视为稳定
)

// 可能不稳定 - 可能无法跳过
@Composable
fun UserCard(
    user: User  // 数据类 - 如果所有属性都稳定，则其也是稳定的
)
```

### Koin 注入与稳定性

Koin 注入被视为稳定的，因为它们返回相同的实例（对于单例）或已被记住：

```kotlin
@Composable
fun MyScreen() {
    // 稳定 - 单例返回相同实例
    val repository = koinInject<UserRepository>()

    // 稳定 - ViewModel 已被记住 (remembered)
    val viewModel = koinViewModel<MyViewModel>()
}
```

## 传递形参 vs 注入

### 决策指南

| 作为形参传递 | 使用 Koin 注入 |
|-------------------|------------------|
| 频繁变化的内容 (userId, query) | 稳定的依赖项（仓库、服务） |
| UI 状态（选定项） | 基础架构（数据库、网络） |
| 导航实参 | 业务逻辑（用例） |
| 父级提供的数据 | ViewModels |

### 示例模式

```kotlin
// userId 会变化 - 作为形参传递
// repository 是稳定的 - 进行注入
@Composable
fun UserProfile(
    userId: String,
    repository: UserRepository = koinInject()
) {
    var user by remember { mutableStateOf<User?>(null) }

    LaunchedEffect(userId) {
        user = repository.getUser(userId)
    }

    user?.let { ProfileContent(it) }
}

// 纯 Composable - 无需注入
@Composable
fun ProfileContent(user: User) {
    Column {
        Text(user.name)
        Text(user.email)
    }
}
```

## 最佳做法

### 1. 在顶层注入

```kotlin
@Composable
fun FeatureScreen() {
    // 在此处注入
    val viewModel = koinViewModel<FeatureViewModel>()
    val repository = koinInject<FeatureRepository>()

    // 向下传递给子项
    FeatureContent(
        state = viewModel.state,
        onAction = viewModel::handleAction
    )
}
```

### 2. 保持子 Composable 纯净

```kotlin
// 纯净 - 将所有数据作为形参接收
@Composable
fun UserCard(
    user: User,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    // 此处不进行注入
}
```

### 3. 为复杂状态使用 ViewModel

```kotlin
// 在 ViewModel 中进行复杂的状态管理
@KoinViewModel
class SearchViewModel(
    private val searchRepository: SearchRepository
) : ViewModel() {
    var query by mutableStateOf("")
        private set

    private val _results = MutableStateFlow<List<Result>>(emptyList())
    val results = _results.asStateFlow()

    fun updateQuery(newQuery: String) {
        query = newQuery
        viewModelScope.launch {
            _results.value = searchRepository.search(newQuery)
        }
    }
}
```

### 4. 避免在循环中注入

```kotlin
@Composable
fun UserList(userIds: List<String>) {
    // 在循环外注入一次
    val repository = koinInject<UserRepository>()

    LazyColumn {
        items(userIds) { userId ->
            // 不要再 items 内部注入！
            UserCard(userId, repository)
        }
    }
}
```

## 后续步骤

- **[Compose 中的 ViewModel](/docs/reference/koin-compose/compose-viewmodel)** - ViewModel API
- **[动态模块](/docs/reference/koin-compose/compose-modules)** - 模块加载/卸载
- **[测试](/docs/reference/koin-compose/compose-testing)** - 测试 Composable