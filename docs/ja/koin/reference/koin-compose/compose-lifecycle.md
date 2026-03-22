---
title: ライフサイクルと状態
---

# Composeにおけるライフサイクルと状態

このガイドでは、KoinがComposeのライフサイクルと状態管理とどのように統合されるかについて説明します。これらの概念を理解することで、効率的でバグのないComposeアプリケーションを作成できるようになります。

:::info
このガイドは、[Android公式のComposeライフサイクルドキュメント](https://developer.android.com/develop/ui/compose/lifecycle)に基づいています。
:::

## Composeライフサイクルの概要

Composableには3つのライフサイクルイベントがあります。

1. **コンポジションの開始 (Enter Composition)** - Composableが最初に呼び出されたとき
2. **再コンポジション (Recomposition)** - 状態が変化したときにComposableが再実行される（0回以上）
3. **コンポジションの終了 (Leave Composition)** - Composableがツリーから削除されるとき

KoinのCompose APIは、このライフサイクルで効率的に動作するように設計されています。

## 注入と再コンポジション

### koinInject() の仕組み

`koinInject()` はKoinからインスタンスを取得し、再コンポジションを跨いでそれらを**記憶 (remember)** します。

```kotlin
@Composable
fun MyScreen() {
    // 一度解決されると、再コンポジション間で保持されます
    val repository = koinInject<UserRepository>()

    // 安全 - 同じインスタンスが使用されます
    val users by repository.users.collectAsState()
}
```

### 注入のタイミング

依存関係の注入はコールバック内ではなく、**Composable関数のレベル**で行ってください。

```kotlin
@Composable
fun MyScreen() {
    // 正解 - コンポジション時に解決される
    val repository = koinInject<UserRepository>()
    val viewModel = koinViewModel<MyViewModel>()

    Button(onClick = {
        // 間違い - コールバック内で注入しない
        val service = koinInject<Service>() // 避けてください！

        // 正解 - すでに注入済みのインスタンスを使用する
        repository.save()
    }) {
        Text("Save")
    }
}
```

### パラメータ使用時のパフォーマンス

`koinInject` でパラメータを使用する場合は、明示的なパラメータ形式を推奨します。

```kotlin
@Composable
fun MyScreen(userId: String) {
    // より効率的 - パラメータが一度だけ評価される
    val presenter = koinInject<UserPresenter>(
        parameters = parametersOf(userId)
    )

    // 非効率 - 再コンポジションのたびにラムダが再評価される
    val presenter = koinInject<UserPresenter> {
        parametersOf(userId)
    }
}
```

## Koinによる状態管理

### StateFlow と collectAsState

Koinを使用したリアクティブUIの標準的なパターンです。

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

### 直接のリポジトリ注入

よりシンプルなケースでは、リポジトリを直接注入します。

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

用途に応じて適切なツールを使用してください。

```kotlin
@Composable
fun MyScreen() {
    // Koinが管理する依存関係
    val viewModel = koinViewModel<MyViewModel>()
    val repository = koinInject<Repository>()

    // Composeが管理する状態
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()
    var text by remember { mutableStateOf("") }

    // koinInjectをrememberでラップしないでください（不要です）
    val service = remember { koinInject<Service>() } // 冗長です！
}
```

## Koinによるサイドエフェクト

### LaunchedEffect

コンポジションが開始されたとき、またはキーが変更されたときに、サスペンドコードを実行します。

```kotlin
@Composable
fun UserDetailScreen(userId: String) {
    val repository = koinInject<UserRepository>()
    var user by remember { mutableStateOf<User?>(null) }

    // userIdが変更されたときに実行される
    LaunchedEffect(userId) {
        user = repository.getUser(userId)
    }

    user?.let { UserContent(it) }
}
```

### DisposableEffect

コンポジションを終了するときにリソースをクリーンアップします。

```kotlin
@Composable
fun EventScreen() {
    val eventBus = koinInject<EventBus>()

    DisposableEffect(Unit) {
        val listener = eventBus.subscribe { event ->
            // イベントを処理
        }

        onDispose {
            eventBus.unsubscribe(listener)
        }
    }
}
```

### SideEffect

再コンポジションが成功するたびに、非サスペンドのサイドエフェクトを実行します。

```kotlin
@Composable
fun AnalyticsScreen(screenName: String) {
    val analytics = koinInject<Analytics>()

    SideEffect {
        analytics.logScreenView(screenName)
    }
}
```

## 安定性とスキップ

### 安定した型 (Stable Types) の理解

Composeは、入力が変更されていない場合に再コンポジションをスキップできます。これが機能するためには、パラメータの型が**安定 (stable)** している必要があります。

```kotlin
// 安定している - Composeはスキップ可能
@Composable
fun UserCard(
    name: String,                    // プリミティブ - 安定
    onClick: () -> Unit,             // ラムダ - 安定
    viewModel: UserViewModel = koinViewModel()  // 安定として扱われる
)

// 不安定な可能性がある - スキップされない場合がある
@Composable
fun UserCard(
    user: User  // データクラス - すべてのプロパティが安定していれば安定
)
```

### Koinの注入と安定性

Koinの注入は、同じインスタンスを返す（シングルトンの場合）か、記憶（remember）されるため、安定していると見なされます。

```kotlin
@Composable
fun MyScreen() {
    // 安定 - シングルトンは同じインスタンスを返す
    val repository = koinInject<UserRepository>()

    // 安定 - ViewModelは記憶される
    val viewModel = koinViewModel<MyViewModel>()
}
```

## パラメータ渡し vs 注入

### 判断ガイド

| パラメータとして渡す | Koinで注入する |
|-------------------|------------------|
| 頻繁に変更されるもの (userId, query) | 安定した依存関係 (repositories, services) |
| UIの状態 (選択されたアイテム) | インフラストラクチャ (database, network) |
| ナビゲーション引数 | ビジネスロジック (use cases) |
| 親から提供されるデータ | ViewModels |

### パターンの例

```kotlin
// userIdは変わるため、パラメータとして渡す
// repositoryは安定しているため、注入する
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

// 純粋なComposable - 注入は不要
@Composable
fun ProfileContent(user: User) {
    Column {
        Text(user.name)
        Text(user.email)
    }
}
```

## ベストプラクティス

### 1. トップレベルで注入する

```kotlin
@Composable
fun FeatureScreen() {
    // ここで注入する
    val viewModel = koinViewModel<FeatureViewModel>()
    val repository = koinInject<FeatureRepository>()

    // 子コンポーネントに渡す
    FeatureContent(
        state = viewModel.state,
        onAction = viewModel::handleAction
    )
}
```

### 2. 子のComposableを純粋に保つ

```kotlin
// 純粋 - すべてのデータをパラメータとして受け取る
@Composable
fun UserCard(
    user: User,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    // ここでは注入しない
}
```

### 3. 複雑な状態にはViewModelを使用する

```kotlin
// ViewModelでの複雑な状態管理
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

### 4. ループ内での注入を避ける

```kotlin
@Composable
fun UserList(userIds: List<String>) {
    // ループの外で一度だけ注入する
    val repository = koinInject<UserRepository>()

    LazyColumn {
        items(userIds) { userId ->
            // itemsの中で注入してはいけません！
            UserCard(userId, repository)
        }
    }
}
```

## 次のステップ

- **[ComposeにおけるViewModel](/docs/reference/koin-compose/compose-viewmodel)** - ViewModel API
- **[動的モジュール](/docs/reference/koin-compose/compose-modules)** - モジュールのロード/アンロード
- **[テスト](/docs/reference/koin-compose/compose-testing)** - Composableのテスト