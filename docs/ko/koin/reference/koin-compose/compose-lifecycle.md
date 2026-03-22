---
title: 수명 주기 및 상태(Lifecycle & State)
---

# Compose에서의 수명 주기 및 상태(Lifecycle & State)

이 가이드에서는 Koin이 Compose의 수명 주기 및 상태 관리와 어떻게 통합되는지 설명합니다. 이러한 개념을 이해하면 효율적이고 버그 없는 Compose 애플리케이션을 작성하는 데 도움이 됩니다.

:::info
이 가이드는 [Android의 공식 Compose 수명 주기 문서](https://developer.android.com/develop/ui/compose/lifecycle)와 내용을 같이 합니다.
:::

## Compose 수명 주기 개요

컴포저블(Composable)은 세 가지 수명 주기 이벤트를 가집니다:

1. **컴포지션 시작(Enter Composition)** - 컴포저블이 처음 호출될 때
2. **재구성(Recomposition)** - 상태가 변경되어 컴포저블이 다시 실행될 때 (0회 이상)
3. **컴포지션 종료(Leave Composition)** - 컴포저블이 트리에서 제거될 때

Koin의 Compose API는 이러한 수명 주기와 효율적으로 작동하도록 설계되었습니다.

## 주입 및 재구성(Recomposition)

### koinInject()의 작동 방식

`koinInject()`는 Koin에서 인스턴스를 가져오고, 재구성 전반에 걸쳐 해당 인스턴스를 **기억(remember)**합니다.

```kotlin
@Composable
fun MyScreen() {
    // 한 번만 해석(resolve)되고, 재구성 시에도 기억됨
    val repository = koinInject<UserRepository>()

    // 안전함 - 동일한 인스턴스를 사용
    val users by repository.users.collectAsState()
}
```

### 주입 시점

의존성은 콜백 내부가 아니라 **컴포저블 함수 수준**에서 주입하세요.

```kotlin
@Composable
fun MyScreen() {
    // 올바름 - 컴포지션 시점에 해석됨
    val repository = koinInject<UserRepository>()
    val viewModel = koinViewModel<MyViewModel>()

    Button(onClick = {
        // 잘못됨 - 콜백 내부에서 주입하지 마세요
        val service = koinInject<Service>() // 피해야 함!

        // 올바름 - 이미 주입된 인스턴스를 사용
        repository.save()
    }) {
        Text("Save")
    }
}
```

### 파라미터 사용 시 성능

`koinInject`와 함께 파라미터를 사용할 때는 명시적 파라미터 형태를 권장합니다.

```kotlin
@Composable
fun MyScreen(userId: String) {
    // 더 효율적 - 파라미터가 한 번만 평가됨
    val presenter = koinInject<UserPresenter>(
        parameters = parametersOf(userId)
    )

    // 덜 효율적 - 재구성 시 람다가 다시 평가됨
    val presenter = koinInject<UserPresenter> {
        parametersOf(userId)
    }
}
```

## Koin을 이용한 상태 관리

### StateFlow 및 collectAsState

Koin을 사용하는 반응형 UI의 표준 패턴은 다음과 같습니다.

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

### 저장소(Repository) 직접 주입

더 간단한 경우에는 저장소를 직접 주입할 수 있습니다.

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

각 작업에 적합한 도구를 사용하세요.

```kotlin
@Composable
fun MyScreen() {
    // Koin이 관리하는 의존성
    val viewModel = koinViewModel<MyViewModel>()
    val repository = koinInject<Repository>()

    // Compose가 관리하는 상태
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()
    var text by remember { mutableStateOf("") }

    // koinInject를 remember로 감싸지 마세요 (불필요함)
    val service = remember { koinInject<Service>() } // 중복입니다!
}
```

## Koin을 이용한 사이드 이펙트(Side Effects)

### LaunchedEffect

컴포지션이 시작되거나 키가 변경될 때 중단(suspending) 코드를 실행합니다.

```kotlin
@Composable
fun UserDetailScreen(userId: String) {
    val repository = koinInject<UserRepository>()
    var user by remember { mutableStateOf<User?>(null) }

    // userId가 변경될 때 실행됨
    LaunchedEffect(userId) {
        user = repository.getUser(userId)
    }

    user?.let { UserContent(it) }
}
```

### DisposableEffect

컴포지션을 벗어날 때 리소스를 정리합니다.

```kotlin
@Composable
fun EventScreen() {
    val eventBus = koinInject<EventBus>()

    DisposableEffect(Unit) {
        val listener = eventBus.subscribe { event ->
            // 이벤트 처리
        }

        onDispose {
            eventBus.unsubscribe(listener)
        }
    }
}
```

### SideEffect

성공적인 모든 재구성 후에 비중단(non-suspending) 사이드 이펙트를 실행합니다.

```kotlin
@Composable
fun AnalyticsScreen(screenName: String) {
    val analytics = koinInject<Analytics>()

    SideEffect {
        analytics.logScreenView(screenName)
    }
}
```

## 안정성(Stability) 및 건너뛰기(Skipping)

### 안정적인 타입(Stable Types) 이해하기

Compose는 입력값이 변경되지 않았을 때 재구성을 건너뛸 수 있습니다. 이것이 작동하려면 파라미터 타입이 **안정적(stable)**이어야 합니다.

```kotlin
// 안정적 - Compose가 재구성을 건너뛸 수 있음
@Composable
fun UserCard(
    name: String,                    // 기본 타입 - 안정적
    onClick: () -> Unit,             // 람다 - 안정적
    viewModel: UserViewModel = koinViewModel()  // 안정적인 것으로 간주됨
)

// 잠재적으로 불안정 - 재구성을 건너뛰지 못할 수 있음
@Composable
fun UserCard(
    user: User  // 데이터 클래스 - 모든 속성이 안정적일 때만 안정적임
)
```

### Koin 주입 및 안정성

Koin 주입은 동일한 인스턴스를 반환(싱글톤의 경우)하거나 기억(remember)되기 때문에 안정적인 것으로 간주됩니다.

```kotlin
@Composable
fun MyScreen() {
    // 안정적 - 싱글톤은 동일한 인스턴스를 반환함
    val repository = koinInject<UserRepository>()

    // 안정적 - ViewModel은 기억(remember)됨
    val viewModel = koinViewModel<MyViewModel>()
}
```

## 파라미터 전달 vs 주입

### 결정 가이드

| 파라미터로 전달 | Koin으로 주입 |
|-------------------|------------------|
| 자주 변경됨 (userId, 쿼리) | 안정적인 의존성 (저장소, 서비스) |
| UI 상태 (선택된 아이템) | 인프라 (데이터베이스, 네트워크) |
| 내비게이션 인수 | 비즈니스 로직 (유스케이스) |
| 부모가 제공하는 데이터 | ViewModel |

### 예시 패턴

```kotlin
// userId는 변경됨 - 파라미터로 전달
// repository는 안정적임 - 주입
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

// 순수 컴포저블 - 주입이 필요 없음
@Composable
fun ProfileContent(user: User) {
    Column {
        Text(user.name)
        Text(user.email)
    }
}
```

## 권장 사항(Best Practices)

### 1. 최상위 수준에서 주입하기

```kotlin
@Composable
fun FeatureScreen() {
    // 여기서 주입
    val viewModel = koinViewModel<FeatureViewModel>()
    val repository = koinInject<FeatureRepository>()

    // 하위 컴포저블로 전달
    FeatureContent(
        state = viewModel.state,
        onAction = viewModel::handleAction
    )
}
```

### 2. 하위 컴포저블을 순수하게 유지하기

```kotlin
// 순수함 - 모든 데이터를 파라미터로 받음
@Composable
fun UserCard(
    user: User,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    // 여기서는 주입하지 않음
}
```

### 3. 복잡한 상태에는 ViewModel 사용하기

```kotlin
// ViewModel에서의 복잡한 상태 관리
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

### 4. 루프 내부에서 주입 피하기

```kotlin
@Composable
fun UserList(userIds: List<String>) {
    // 루프 외부에서 한 번만 주입
    val repository = koinInject<UserRepository>()

    LazyColumn {
        items(userIds) { userId ->
            // items 내부에서 주입하지 마세요!
            UserCard(userId, repository)
        }
    }
}
```

## 다음 단계

- **[Compose에서의 ViewModel](/docs/reference/koin-compose/compose-viewmodel)** - ViewModel API
- **[동적 모듈](/docs/reference/koin-compose/compose-modules)** - 모듈 로드/언로드
- **[테스트](/docs/reference/koin-compose/compose-testing)** - 컴포저블 테스트