---
title: Navigation 3
---

# Navigation 3

Koin 提供與 [AndroidX Navigation 3](https://developer.android.com/guide/navigation/navigation-3) 的整合，實現具備相依注入的型別安全多平台導覽。

## 什麼是 Navigation 3？

Navigation 3 是 Jetpack 的新導覽程式庫，專為 Compose 設計：

- **完整的返回堆疊控制** - 透過從清單中新增/移除項目來進行導覽
- **型別安全路由** - 路由是帶有 `@Serializable` 的 Kotlin 類別
- **自適應佈局** - 同時顯示多個目的地（清單-詳細資訊）
- **自動動畫** - 內建轉換支援

## 設定

### 多平台專案

```kotlin
// shared/build.gradle.kts
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

### 僅限 Android 的專案

```kotlin
dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

套用序列化外掛程式：

```kotlin
plugins {
    kotlin("plugin.serialization")
}
```

### 平台支援

| 平台 | 狀態 |
|----------|--------|
| Android | 完整支援 |
| iOS | 完整支援 |
| Desktop | 完整支援 |
| Web | 完整支援 |

## 核心概念

### 以 Kotlin 類別表示路由

使用 `@Serializable` 定義型別安全路由：

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

### 返回堆疊

Navigation 3 使用簡單的基於清單的返回堆疊：

```kotlin
// 基礎返回堆疊
val backStack = remember { mutableStateListOf<Any>(HomeRoute) }

// 持久化返回堆疊（在配置變更後仍可存續）
val backStack = rememberNavBackStack(HomeRoute)

// 向前導覽
backStack.add(DetailRoute("123"))

// 返回
backStack.removeLastOrNull()
```

### NavDisplay

`NavDisplay` 渲染帶有動畫的返回堆疊：

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { route -> /* NavEntry */ }
)
```

## Koin 整合

### 宣告導覽項目

在您的模組中使用 `navigation<T>` DSL：

```kotlin
val appModule = module {
    // 相依性
    single<ApiClient>()
    viewModel<HomeViewModel>()
    viewModel<DetailViewModel>()

    // 具備 Koin 注入的導覽項目
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

### 使用 koinEntryProvider

從 Koin 檢索所有導覽項目：

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

:::tip 當 NavDisplay 具備型別時，請傳遞您的路由型別
`koinEntryProvider<T>()` 是泛型 —— `T` 是路由型別。如果您將其保留為 `koinEntryProvider<Any>()` 但 `NavDisplay` 變成了具備型別的（例如透過型別化的 `SceneStrategy`，如 `rememberSupportingPaneSceneStrategy<Route>()`），編譯器會推論出 `NavDisplay<Route>` 並預期接收 `(Route) -> NavEntry<Route>`，因此 `Any` 型別的提供者將無法符合：

```
Argument type mismatch: actual type is 'Function1<Any, NavEntry<Any>>',
but 'Function1<Route, NavEntry<Route>>' was expected.
```

請傳遞您的路由型別以進行比對：

```kotlin
val sceneStrategy = rememberSupportingPaneSceneStrategy<Route>()
val entryProvider = koinEntryProvider<Route>()   // (Route) -> NavEntry<Route>

NavDisplay(
    backStack = backStack,
    onBack = onBack,
    sceneStrategy = sceneStrategy,
    entryProvider = entryProvider,               // ✅ 符合 NavDisplay<Route>
)
```

（同樣地，`val entryProvider: EntryProvider<Route> = koinEntryProvider()` —— 型別引數會從預期型別中推論出來。）
:::

### 完整範例

```kotlin
// 路由
@Serializable data object ConversationList
@Serializable data class ConversationDetail(val id: Int)
@Serializable data object Profile

// 導覽器類別，用於更簡潔的導覽
class Navigator(startDestination: Any) {
    val backStack = mutableStateListOf(startDestination)

    fun goTo(destination: Any) {
        backStack.add(destination)
    }

    fun goBack() {
        backStack.removeLastOrNull()
    }
}

// Koin 模組
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

## 作用域導覽

在 Koin 作用域內宣告導覽項目：

```kotlin
val appModule = module {
    // Activity-retained 作用域（在配置變更後仍可存續）
    activityRetainedScope {
        scoped { UserSession() }
        viewModel<ProfileViewModel>()

        navigation<ProfileRoute> { route ->
            ProfileScreen(viewModel = koinViewModel())
        }
    }

    // 自訂作用域
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

## ViewModel 整合

### 搭配導覽引數

將路由資料傳遞給 ViewModel：

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

### 搭配項目裝飾器

使用裝飾器來保留 ViewModel 狀態：

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

## 動畫

### 預設轉換

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = entryProvider,
    // 向前導覽動畫
    transitionSpec = {
        slideInHorizontally(initialOffsetX = { it }) togetherWith
        slideOutHorizontally(targetOffsetX = { -it })
    },
    // 返回導覽動畫
    popTransitionSpec = {
        slideInHorizontally(initialOffsetX = { -it }) togetherWith
        slideOutHorizontally(targetOffsetX = { it })
    }
)
```

### 針對個別路由的動畫

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

## 自適應佈局

### 清單-詳細資訊模式

為自適應佈局使用場景策略：

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

### 搭配 Koin 模組

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

## Android 擴充功能

### 延遲項目提供者 (Lazy Entry Provider)

```kotlin
class MainActivity : ComponentActivity() {
    // 延遲初始化
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

### 立即項目提供者 (Eager Entry Provider)

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

## API 參考

### DSL 函式

| 函式 | 說明 |
|----------|-------------|
| `Module.navigation<T> { }` | 在模組層級宣告導覽項目 |
| `ScopeDSL.navigation<T> { }` | 在作用域內宣告導覽項目 |

### Composable 函式

| 函式 | 說明 |
|----------|-------------|
| `koinEntryProvider<T>()` | 從 Koin 取得聚合的項目提供者 |

### Android 擴充功能

| 函式 | 說明 |
|----------|-------------|
| `entryProvider<T>()` | 延遲項目提供者委派 |
| `getEntryProvider<T>()` | 立即項目提供者 |

## 從 Navigation 2.x 遷移

### 之前 (Navigation 2.x)

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

### 之後 (Navigation 3)

```kotlin
// 型別安全路由
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)

// 模組宣告
val appModule = module {
    navigation<HomeRoute> { HomeScreen(viewModel = koinViewModel()) }
    navigation<DetailRoute> { route ->
        DetailScreen(id = route.id, viewModel = koinViewModel())
    }
}

// 用法
val backStack = rememberNavBackStack(HomeRoute)
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = koinEntryProvider()
)
```

## 資源

- [Navigation 3 官方指南](https://developer.android.com/guide/navigation/navigation-3)
- [Nav3 Recipes 儲存庫](https://github.com/android/nav3-recipes)
- [Koin Compose 文件](/docs/reference/koin-compose/compose)