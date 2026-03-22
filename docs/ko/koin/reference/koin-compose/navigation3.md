---
title: Navigation 3
---

# Navigation 3

Koin은 의존성 주입을 포함한 타입 안전(type-safe) 멀티플랫폼 내비게이션을 위해 [AndroidX Navigation 3](https://developer.android.com/guide/navigation/navigation-3)와의 통합을 지원합니다.

## Navigation 3란 무엇인가요?

Navigation 3는 Compose를 위해 특별히 설계된 Jetpack의 새로운 내비게이션 라이브러리입니다:

- **전체 백 스택 제어** - 리스트에서 항목을 추가하거나 제거하여 내비게이션을 수행합니다.
- **타입 안전한 라우트** - 라우트는 `@Serializable`이 적용된 Kotlin 클래스로 정의됩니다.
- **적응형 레이아웃(Adaptive layouts)** - 여러 목적지를 동시에 표시할 수 있습니다(리스트-상세 구조 등).
- **자동 애니메이션** - 기본적으로 트랜지션 지원이 내장되어 있습니다.

## 설정

### 멀티플랫폼 프로젝트

```kotlin
// shared/build.gradle.kts
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

### Android 전용 프로젝트

```kotlin
dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

serialization 플러그인을 적용합니다:

```kotlin
plugins {
    kotlin("plugin.serialization")
}
```

### 플랫폼 지원

| 플랫폼 | 상태 |
|----------|--------|
| Android | 전체 지원 |
| iOS | 전체 지원 |
| Desktop | 전체 지원 |
| Web | 전체 지원 |

## 핵심 개념

### Kotlin 클래스로 정의하는 라우트

`@Serializable`을 사용하여 타입 안전한 라우트를 정의합니다:

```kotlin
@Serializable
data object HomeRoute

@Serializable
data object ProfileRoute

@Serializable
data class DetailRoute(val itemId: String)

@Serializable
data class SettingsRoute(val section: String? = null)
```

### 백 스택 (Back Stack)

Navigation 3는 간단한 리스트 기반의 백 스택을 사용합니다:

```kotlin
// 기본 백 스택
val backStack = remember { mutableStateListOf<Any>(HomeRoute) }

// 지속성 백 스택 (구성 변경 시에도 유지됨)
val backStack = rememberNavBackStack(HomeRoute)

// 앞으로 가기 (Navigate forward)
backStack.add(DetailRoute("123"))

// 뒤로 가기 (Navigate back)
backStack.removeLastOrNull()
```

### NavDisplay

`NavDisplay`는 애니메이션과 함께 백 스택을 렌더링합니다:

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { route -> /* NavEntry */ }
)
```

## Koin 통합

### 내비게이션 엔트리 선언

모듈에서 `navigation<T>` DSL을 사용합니다:

```kotlin
val appModule = module {
    // 의존성
    single<ApiClient>()
    viewModel<HomeViewModel>()
    viewModel<DetailViewModel>()

    // Koin 주입을 포함한 내비게이션 엔트리
    navigation<HomeRoute> { route ->
        HomeScreen(viewModel = koinViewModel())
    }

    navigation<DetailRoute> { route ->
        DetailScreen(
            itemId = route.itemId,
            viewModel = koinViewModel { parametersOf(route.itemId) }
        )
    }

    navigation<ProfileRoute> { route ->
        ProfileScreen(viewModel = koinViewModel())
    }
}
```

### koinEntryProvider 사용하기

Koin에서 모든 내비게이션 엔트리를 가져옵니다:

```kotlin
@Composable
fun App() {
    val backStack = rememberNavBackStack(HomeRoute)
    val entryProvider = koinEntryProvider<Any>()

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider
    )
}
```

### 전체 예제

```kotlin
// 라우트
@Serializable data object ConversationList
@Serializable data class ConversationDetail(val id: Int)
@Serializable data object Profile

// 더 깔끔한 내비게이션을 위한 Navigator 클래스
class Navigator(startDestination: Any) {
    val backStack = mutableStateListOf(startDestination)

    fun goTo(destination: Any) {
        backStack.add(destination)
    }

    fun goBack() {
        backStack.removeLastOrNull()
    }
}

// Koin 모듈
val appModule = module {
    includes(conversationModule, profileModule)

    activityRetainedScope {
        scoped { Navigator(startDestination = ConversationList) }
    }
}

val conversationModule = module {
    activityRetainedScope {
        navigation<ConversationList> {
            val navigator = get<Navigator>()
            ConversationListScreen(
                onConversationClicked = { detail ->
                    navigator.goTo(detail)
                }
            )
        }

        navigation<ConversationDetail> { route ->
            val navigator = get<Navigator>()
            ConversationDetailScreen(
                conversationId = route.id,
                onProfileClicked = { navigator.goTo(Profile) }
            )
        }
    }
}

val profileModule = module {
    activityRetainedScope {
        navigation<Profile> {
            ProfileScreen()
        }
    }
}

// Activity
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityRetainedScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            val navigator: Navigator = get()

            Scaffold { padding ->
                NavDisplay(
                    backStack = navigator.backStack,
                    modifier = Modifier.padding(padding),
                    onBack = { navigator.goBack() },
                    entryProvider = getEntryProvider()
                )
            }
        }
    }
}
```

## 스코프 내비게이션 (Scoped Navigation)

Koin 스코프 내에서 내비게이션 엔트리를 선언합니다:

```kotlin
val appModule = module {
    // Activity-retained 스코프 (구성 변경 시에도 유지됨)
    activityRetainedScope {
        scoped { UserSession() }
        viewModel<ProfileViewModel>()

        navigation<ProfileRoute> { route ->
            ProfileScreen(viewModel = koinViewModel())
        }
    }

    // 커스텀 스코프
    scope<CheckoutFlow> {
        scoped { CheckoutState() }
        viewModel<CheckoutViewModel>()

        navigation<CartRoute> { route ->
            CartScreen(viewModel = koinViewModel())
        }

        navigation<PaymentRoute> { route ->
            PaymentScreen(viewModel = koinViewModel())
        }
    }
}
```

## ViewModel 통합

### 내비게이션 인자 포함하기

라우트 데이터를 ViewModel에 전달합니다:

```kotlin
@Serializable
data class DetailRoute(val itemId: String, val fromSearch: Boolean = false)

class DetailViewModel(
    val route: DetailRoute,
    private val repository: Repository
) : ViewModel() {
    val item = repository.getItem(route.itemId)
}

val appModule = module {
    viewModelOf(::DetailViewModel)

    navigation<DetailRoute> { route ->
        DetailScreen(
            viewModel = koinViewModel { parametersOf(route) }
        )
    }
}
```

### 엔트리 데코레이터 사용하기

ViewModel 상태 유지를 위해 데코레이터를 사용합니다:

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryDecorators = listOf(
        rememberSaveableStateHolderNavEntryDecorator(),
        rememberViewModelStoreNavEntryDecorator()
    ),
    entryProvider = entryProvider {
        entry<DetailRoute> { route ->
            val viewModel = koinViewModel<DetailViewModel> {
                parametersOf(route)
            }
            DetailScreen(viewModel)
        }
    }
)
```

## 애니메이션

### 기본 트랜지션 (Default Transitions)

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = entryProvider,
    // 정방향 내비게이션 애니메이션
    transitionSpec = {
        slideInHorizontally(initialOffsetX = { it }) togetherWith
        slideOutHorizontally(targetOffsetX = { -it })
    },
    // 뒤로 가기 애니메이션
    popTransitionSpec = {
        slideInHorizontally(initialOffsetX = { -it }) togetherWith
        slideOutHorizontally(targetOffsetX = { it })
    }
)
```

### 라우트별 애니메이션

```kotlin
navigation<ModalRoute>(
    metadata = NavDisplay.transitionSpec {
        slideInVertically(initialOffsetY = { it }) togetherWith
        ExitTransition.KeepUntilTransitionsFinished
    } + NavDisplay.popTransitionSpec {
        EnterTransition.None togetherWith
        slideOutVertically(targetOffsetY = { it })
    }
) { route ->
    ModalScreen()
}
```

## 적응형 레이아웃 (Adaptive Layouts)

### 리스트-상세 패턴 (List-Detail Pattern)

적응형 레이아웃을 위해 씬 전략(scene strategies)을 사용합니다:

```kotlin
@Composable
fun App() {
    val backStack = rememberNavBackStack(ConversationList)
    val listDetailStrategy = rememberListDetailSceneStrategy<Any>()

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        sceneStrategy = listDetailStrategy,
        entryProvider = entryProvider {
            entry<ConversationList>(
                metadata = ListDetailSceneStrategy.listPane()
            ) {
                ConversationListScreen()
            }

            entry<ConversationDetail>(
                metadata = ListDetailSceneStrategy.detailPane()
            ) { route ->
                ConversationDetailScreen(route.id)
            }
        }
    )
}
```

### Koin 모듈과 함께 사용하기

```kotlin
val appModule = module {
    navigation<ConversationList>(
        metadata = ListDetailSceneStrategy.listPane()
    ) {
        ConversationListScreen(
            onItemClick = { get<Navigator>().goTo(it) }
        )
    }

    navigation<ConversationDetail>(
        metadata = ListDetailSceneStrategy.detailPane()
    ) { route ->
        ConversationDetailScreen(route.id)
    }
}
```

## Android 확장 기능

### 지연 엔트리 프로바이더 (Lazy Entry Provider)

```kotlin
class MainActivity : ComponentActivity() {
    // 지연 초기화
    private val entryProvider by entryProvider<Any>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val backStack = rememberNavBackStack(HomeRoute)

            NavDisplay(
                backStack = backStack,
                onBack = { backStack.removeLastOrNull() },
                entryProvider = entryProvider
            )
        }
    }
}
```

### 즉시 엔트리 프로바이더 (Eager Entry Provider)

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val entryProvider = getEntryProvider<Any>()

        setContent {
            NavDisplay(
                backStack = backStack,
                entryProvider = entryProvider,
                onBack = { backStack.removeLastOrNull() }
            )
        }
    }
}
```

## API 레퍼런스

### DSL 함수

| 함수 | 설명 |
|----------|-------------|
| `Module.navigation<T> { }` | 모듈 수준에서 내비게이션 엔트리 선언 |
| `ScopeDSL.navigation<T> { }` | 특정 스코프 내에서 내비게이션 엔트리 선언 |

### Composable 함수

| 함수 | 설명 |
|----------|-------------|
| `koinEntryProvider<T>()` | Koin에서 집계된 엔트리 프로바이더를 가져옴 |

### Android 확장 기능

| 함수 | 설명 |
|----------|-------------|
| `entryProvider<T>()` | 지연 엔트리 프로바이더 위임(delegate) |
| `getEntryProvider<T>()` | 즉시 엔트리 프로바이더 |

## Navigation 2.x에서 마이그레이션

### 이전 (Navigation 2.x)

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen(viewModel = koinViewModel())
    }
    composable("detail/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetailScreen(id = id, viewModel = koinViewModel())
    }
}
```

### 이후 (Navigation 3)

```kotlin
// 타입 안전한 라우트
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)

// 모듈 선언
val appModule = module {
    navigation<HomeRoute> { HomeScreen(viewModel = koinViewModel()) }
    navigation<DetailRoute> { route ->
        DetailScreen(id = route.id, viewModel = koinViewModel())
    }
}

// 사용 예시
val backStack = rememberNavBackStack(HomeRoute)
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = koinEntryProvider()
)
```

## 참고 자료

- [Navigation 3 공식 가이드](https://developer.android.com/guide/navigation/navigation-3)
- [Nav3 Recipes 저장소](https://github.com/android/nav3-recipes)
- [Koin Compose 문서](/docs/reference/koin-compose/compose)