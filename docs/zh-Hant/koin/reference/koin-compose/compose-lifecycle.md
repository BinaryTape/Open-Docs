---
title: 生命週期與狀態
---

# Compose 中的生命週期與狀態 (Lifecycle & State)

本指南涵蓋 Koin 如何與 Compose 的生命週期和狀態管理整合。瞭解這些概念有助於您編寫高效且無錯誤的 Compose 應用程式。

:::info
本指南與 [Android 的官方 Compose 生命週期文件](https://developer.android.com/develop/ui/compose/lifecycle) 保持一致。
:::

## Compose 生命週期概覽

一個 Composable 具有三個生命週期事件：

1. **進入 Composition** - Composable 首次被呼叫
2. **重組 (Recomposition)** - 當狀態改變時，Composable 重新執行（0 次或多次）
3. **離開 Composition** - Composable 從樹狀結構中移除

Koin 的 Compose API 旨在與此生命週期高效配合。

## 注入與重組 (Injection and Recomposition)

### koinInject() 如何運作

`koinInject()` 從 Koin 檢索執行個體，並在重組之間**記住 (remembers)** 它們：

```kotlin
@Composable
fun MyScreen() {
    // 僅解析一次，並在重組之間記住
    val repository = koinInject<UserRepository>()

    // 安全 - 使用相同的執行個體
    val users by repository.users.collectAsState()
}
```

### 注入時機

請在 **Composable 函式層級**注入相依性，而不是在回呼內部：

```kotlin
@Composable
fun MyScreen() {
    // 正確 - 在 composition 時解析
    val repository = koinInject<UserRepository>()
    val viewModel = koinViewModel<MyViewModel>()

    Button(onClick = {
        // 錯誤 - 不要在回呼中注入
        val service = koinInject<Service>() // 應避免！

        // 正確 - 使用已經注入的執行個體
        repository.save()
    }) {
        Text("Save")
    }
}
```

### 搭配參數的效能

當 `koinInject` 使用參數時，偏好使用顯式參數形式：

```kotlin
@Composable
fun MyScreen(userId: String) {
    // 更高效 - 參數僅評估一次
    val presenter = koinInject<UserPresenter>(
        parameters = parametersOf(userId)
    )

    // 較低效 - Lambda 在重組時會重新評估
    val presenter = koinInject<UserPresenter> {
        parametersOf(userId)
    }
}
```

## 使用 Koin 進行狀態管理

### StateFlow 與 collectAsState

使用 Koin 進行響應式 UI 的標準模式：

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

### 直接注入存儲庫 (Repository)

對於較簡單的情況，直接注入存儲庫：

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

### remember() vs koinInject()

為每項工作使用正確的工具：

```kotlin
@Composable
fun MyScreen() {
    // 由 Koin 管理的相依性
    val viewModel = koinViewModel<MyViewModel>()
    val repository = koinInject<Repository>()

    // 由 Compose 管理的狀態
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()
    var text by remember { mutableStateOf("") }

    // 不要將 koinInject 包裝在 remember 中（這是不必要的）
    val service = remember { koinInject<Service>() } // 冗餘！
}
```

## 使用 Koin 處理副作用 (Side Effects)

### LaunchedEffect

在進入 composition 或 key 更改時執行暫停程式碼：

```kotlin
@Composable
fun UserDetailScreen(userId: String) {
    val repository = koinInject<UserRepository>()
    var user by remember { mutableStateOf<User?>(null) }

    // 當 userId 改變時執行
    LaunchedEffect(userId) {
        user = repository.getUser(userId)
    }

    user?.let { UserContent(it) }
}
```

### DisposableEffect

在離開 composition 時清理資源：

```kotlin
@Composable
fun EventScreen() {
    val eventBus = koinInject<EventBus>()

    DisposableEffect(Unit) {
        val listener = eventBus.subscribe { event ->
            // 處理事件
        }

        onDispose {
            eventBus.unsubscribe(listener)
        }
    }
}
```

### SideEffect

在每次成功的重組後執行非暫停副作用：

```kotlin
@Composable
fun AnalyticsScreen(screenName: String) {
    val analytics = koinInject<Analytics>()

    SideEffect {
        analytics.logScreenView(screenName)
    }
}
```

## 穩定性與跳過 (Stability and Skipping)

### 瞭解穩定類型 (Stable Types)

當輸入未更改時，Compose 可以跳過重組。為了使此功能運作，參數型別必須是**穩定 (stable)** 的：

```kotlin
// 穩定 - Compose 可以跳過
@Composable
fun UserCard(
    name: String,                    // 基本型別 - 穩定
    onClick: () -> Unit,             // Lambda - 穩定
    viewModel: UserViewModel = koinViewModel()  // 被視為穩定
)

// 可能不穩定 - 可能不會跳過
@Composable
fun UserCard(
    user: User  // 資料類別 - 如果所有屬性都穩定，則穩定
)
```

### Koin 注入與穩定性

Koin 注入被視為穩定的，因為它們傳回相同的執行個體（對於單例而言）或是被記住的：

```kotlin
@Composable
fun MyScreen() {
    // 穩定 - 單例傳回相同的執行個體
    val repository = koinInject<UserRepository>()

    // 穩定 - ViewModel 被記住
    val viewModel = koinViewModel<MyViewModel>()
}
```

## 傳遞參數 vs 注入

### 決策指南

| 作為參數傳遞 | 使用 Koin 注入 |
|-------------------|------------------|
| 頻繁變動 (userId, query) | 穩定的相依性 (存儲庫, 服務) |
| UI 狀態 (所選項目) | 基礎結構 (資料庫, 網路) |
| 導覽引數 | 業務邏輯 (案例) |
| 父級提供的資料 | ViewModel |

### 範例模式

```kotlin
// userId 會變動 - 作為參數傳遞
// repository 是穩定的 - 注入
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

// 純粹的 Composable - 不需要注入
@Composable
fun ProfileContent(user: User) {
    Column {
        Text(user.name)
        Text(user.email)
    }
}
```

## 最佳實務

### 1. 在頂層注入

```kotlin
@Composable
fun FeatureScreen() {
    // 在這裡注入
    val viewModel = koinViewModel<FeatureViewModel>()
    val repository = koinInject<FeatureRepository>()

    // 向下傳遞給子元件
    FeatureContent(
        state = viewModel.state,
        onAction = viewModel::handleAction
    )
}
```

### 2. 保持子 Composable 的純粹性

```kotlin
// 純粹 - 接收所有資料作為參數
@Composable
fun UserCard(
    user: User,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    // 這裡不要注入
}
```

### 3. 使用 ViewModel 處理複雜狀態

```kotlin
// 在 ViewModel 中進行複雜的狀態管理
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

### 4. 避免在迴圈中注入

```kotlin
@Composable
fun UserList(userIds: List<String>) {
    // 在迴圈外注入一次
    val repository = koinInject<UserRepository>()

    LazyColumn {
        items(userIds) { userId ->
            // 不要在 items 內部注入！
            UserCard(userId, repository)
        }
    }
}
```

## 下一步

- **[Compose 中的 ViewModel](/docs/reference/koin-compose/compose-viewmodel)** - ViewModel API
- **[動態模組](/docs/reference/koin-compose/compose-modules)** - 模組的載入與卸載
- **[測試](/docs/reference/koin-compose/compose-testing)** - 測試 Composable