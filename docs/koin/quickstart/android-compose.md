---
title: Android - Jetpack Compose
---

> 本教程将引导您编写一个使用 Jetpack Compose UI 的 Android 应用程序，并使用 Koin 依赖注入来检索您的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-11-28
:::

## 获取代码

:::info
[源代码可在 Github 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 设置

如下所示添加 Koin Android 和 Koin Compose 依赖项：

```groovy
dependencies {

    // 针对 Android 的 Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // 针对 Jetpack Compose 的 Koin
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
}
```

## 应用程序概览

该应用程序的想法是管理一个用户列表，并在我们的 `MainActivity` 类中使用 ViewModel 和 Jetpack Compose UI 显示它：

> Users -> UserRepository -> UserService -> UserViewModel -> MainActivity (Compose UI)

## “User”数据

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个“仓库”组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

## UserService 组件

让我们编写一个服务组件来管理用户操作：

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

## Koin 模块

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是我们定义所有要注入组件的地方。

```kotlin
val appModule = module {

}
```

让我们声明我们的组件。我们希望获得 `UserRepository` 和 `UserService` 的单例：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
本教程使用 **Koin 编译器插件 DSL** (`single<T>()`、`viewModel<T>()`)，它在编译时提供自动装配。有关配置，请参阅[编译器插件设置](/docs/setup/compiler-plugin)。
:::

## 使用 ViewModel 显示用户

让我们编写一个 ViewModel 组件来显示用户：

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> UserService 在 UserViewModel 的构造函数中被引用

我们在 Koin 模块中声明 `UserViewModel`。我们将其声明为 `viewModel` 定义，以避免在内存中保留任何实例（避免 Android 生命周期的任何内存泄漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## 在 Jetpack Compose 中注入 ViewModel

在 Jetpack Compose 中，我们使用 `ComponentActivity` 而不是 `AppCompatActivity`，并且我们使用可组合函数来构建 UI，而不是 XML 布局。

`UserViewModel` 组件将被创建，并随之解析 `UserService` 实例。为了将其引入我们的 Compose UI，我们使用 `koinViewModel()` 函数：

```kotlin
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MainScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    var nameInput by remember { mutableStateOf("") }
    var greetingMessage by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Koin Sample") }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            OutlinedTextField(
                value = nameInput,
                onValueChange = { nameInput = it },
                label = { Text("Enter name") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    val userName = nameInput.trim().ifEmpty { "Alice" }
                    greetingMessage = viewModel.sayHello(userName)
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Say Hello")
            }

            if (greetingMessage.isNotEmpty()) {
                Text(
                    text = greetingMessage,
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
```

就这样，您的 Compose 应用准备就绪了！

:::info
`koinViewModel()` 函数从 Koin 检索 ViewModel 实例，并自动将其绑定到 Compose 生命周期。这是 Compose 特有的注入 ViewModel 的方式，取代了传统 Android View 中使用的 `by viewModel()` 委托。
:::

### Compose 核心概念

- **ComponentActivity**: Compose 应用的基类（取代 AppCompatActivity）
- **setContent**: 将可组合内容设置为 Activity 的 UI
- **@Composable**: 以声明方式构建 UI 的函数
- **remember & mutableStateOf**: 用于响应式 UI 更新的 Compose 状态管理
- **koinViewModel()**: 用于 ViewModel 注入的 Koin Compose 集成

## 启动 Koin

我们需要在 Android 应用程序中启动 Koin。只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数：

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()

        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin` 中的 `modules()` 函数用于加载给定的模块列表
:::

## Koin 模块：DSL 对比

这是使用**传统 DSL**（手动装配）的 Koin 模块声明：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

使用**编译器插件 DSL**（在编译时自动装配）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
编译器插件 DSL 需要使用 [Koin 编译器插件](/docs/setup/compiler-plugin)。它提供编译时依赖解析和更简洁的语法。
:::

## Compose 与 XML View 对比

本教程演示了与 [Android ViewModel 教程](./android-viewmodel.md)相同的功能，但使用的是 Jetpack Compose 而不是 XML 布局：

| 维度 | XML View | Jetpack Compose |
|--------|-----------|-----------------|
| Activity 基类 | `AppCompatActivity` | `ComponentActivity` |
| UI 定义 | XML 布局文件 | `@Composable` 函数 |
| ViewModel 注入 | `by viewModel()` 委托 | `koinViewModel()` 函数 |
| 状态管理 | LiveData/StateFlow | `remember` + `mutableStateOf` |
| UI 更新 | 视图绑定 + 观察者 | 自动重组 |

:::tip
有关在 Compose 中使用 Koin 注解的版本，请参阅 [Compose Multiplatform Annotations 教程](./compose-multiplatform-annotations.md)。
:::