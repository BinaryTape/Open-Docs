---
title: Navigation 3
---

# Navigation 3

Koin 提供了与 [AndroidX Navigation 3](https://developer.android.com/guide/navigation/navigation-3) 的集成，用于通过依赖注入实现类型安全的多平台导航。

## 什么是 Navigation 3？

Navigation 3 是 Jetpack 专为 Compose 设计的新导航库：

- **完整的回退栈控制** - 通过从列表中添加/删除项来进行导航
- **类型安全路由** - 路由是带有 `@Serializable` 注解的 Kotlin 类
- **自适应布局** - 同时显示多个目的地（列表-详情）
- **自动动画** - 内置过渡支持

## 设置

### 多平台项目

```kotlin
// shared/build.gradle.kts
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

### 仅限 Android 项目

```kotlin
dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

应用序列化插件：

```kotlin
plugins {
    kotlin("plugin.serialization")
}
```

### 平台支持

| 平台 | 状态 |
|----------|--------|
| Android | 完全支持 |
| iOS | 完全支持 |
| Desktop | 完全支持 |
| Web | 完全支持 |

## 核心概念

### 作为 Kotlin 类的路由

使用 `@Serializable` 定义类型安全路由：

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

### 回退栈

Navigation 3 使用简单的基于列表的回退栈：

```kotlin
// 基础回退栈
val backStack = remember { mutableStateListOf<Any>(HomeRoute) }

// 持久化回退栈（在配置更改后幸存）
val backStack = rememberNavBackStack(HomeRoute)

// 向前导航
backStack.add(DetailRoute("123"))

// 向后导航
backStack.removeLastOrNull()
```

### NavDisplay

`NavDisplay` 渲染带动画的回退栈：

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { route -> /* NavEntry */ }
)
```

## Koin 集成

### 声明导航条目

在您的模块中使用 `navigation<T>` DSL：

```kotlin
val appModule = module {
    // 依赖项
    single<ApiClient>()
    viewModel<HomeViewModel>()
    viewModel<DetailViewModel>()

    // 使用 Koin 注入的导航条目
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

从 Koin 获取所有导航条目：

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

### 完整示例

```kotlin
// 路由
@Serializable data object ConversationList
@Serializable data class ConversationDetail(val id: Int)
@Serializable data object Profile

// 导航器类，用于更整洁的导航
class Navigator(startDestination: Any) {
    val backStack = mutableStateListOf(startDestination)

    fun goTo(destination: Any) {
        backStack.add(destination)
    }

    fun goBack() {
        backStack.removeLastOrNull()
    }
}

// Koin 模块
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

## 作用域导航

在 Koin 作用域内声明导航条目：

```kotlin
val appModule = module {
    // Activity-retained 作用域（在配置更改后幸存）
    activityRetainedScope {
        scoped { UserSession() }
        viewModel<ProfileViewModel>()

        navigation<ProfileRoute> { route ->
            ProfileScreen(viewModel = koinViewModel())
        }
    }

    // 自定义作用域
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

## ViewModel 集成

### 配合导航实参

将路由数据传递给 ViewModel：

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

### 配合条目装饰器

使用装饰器进行 ViewModel 状态保留：

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

## 动画

### 默认过渡

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = entryProvider,
    // 前进导航动画
    transitionSpec = {
        slideInHorizontally(initialOffsetX = { it }) togetherWith
        slideOutHorizontally(targetOffsetX = { -it })
    },
    // 后退导航动画
    popTransitionSpec = {
        slideInHorizontally(initialOffsetX = { -it }) togetherWith
        slideOutHorizontally(targetOffsetX = { it })
    }
)
```

### 单个路由动画

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

## 自适应布局

### 列表-详情模式

为自适应布局使用场景策略：

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

### 使用 Koin 模块

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

## Android 扩展

### 延迟加载条目提供程序

```kotlin
class MainActivity : ComponentActivity() {
    // 延迟初始化
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

### 急速加载条目提供程序

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

## API 参考

### DSL 函数

| 函数 | 描述 |
|----------|-------------|
| `Module.navigation<T> { }` | 在模块级别声明导航条目 |
| `ScopeDSL.navigation<T> { }` | 在作用域内声明导航条目 |

### Composable 函数

| 函数 | 描述 |
|----------|-------------|
| `koinEntryProvider<T>()` | 从 Koin 获取聚合后的条目提供程序 |

### Android 扩展

| 函数 | 描述 |
|----------|-------------|
| `entryProvider<T>()` | 延迟加载条目提供程序委托 |
| `getEntryProvider<T>()` | 急速加载条目提供程序 |

## 从 Navigation 2.x 迁移

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

### 之后 (Navigation 3)

```kotlin
// 类型安全路由
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)

// 模块声明
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

## 资源

- [Navigation 3 官方指南](https://developer.android.com/guide/navigation/navigation-3)
- [Nav3 Recipes 仓库](https://github.com/android/nav3-recipes)
- [Koin Compose 文档](/docs/reference/koin-compose/compose)