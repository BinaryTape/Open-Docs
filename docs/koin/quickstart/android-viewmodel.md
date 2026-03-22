---
title: Android - ViewModel
---

> 本教程将指导您编写一个 Android 应用程序，并使用 Koin SQL 注入来检索您的组件。
> 您大约需要 **10 分钟** 来完成本教程。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 设置

如下所示添加 Koin Android 依赖项：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 应用程序概览

该应用程序的想法是管理用户列表，并使用 Presenter 或 ViewModel 在我们的 `MainActivity` 类中显示它：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## “User” 数据

我们将管理 User 的集合。这是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个“仓库”组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数声明 Koin 模块。Koin 模块是定义我们要注入的所有组件的地方。

```kotlin
val appModule = module {

}
```

让我们声明我们的组件。我们想要 `UserRepository` 和 `UserService` 的单例：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
本教程使用的是 **Koin Compiler Plugin DSL** (`single<T>()`, `viewModel<T>()`)，它在编译时提供自动装配。有关配置，请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
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

> UserService 在 `UserViewModel` 的构造函数中被引用

我们在 Koin 模块中声明 `UserViewModel`。我们将其声明为 `viewModel` 定义，以便不将任何实例保留在内存中（避免 Android 生命周期的任何泄漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## 在 Android 中注入 ViewModel

`UserViewModel` 组件将被创建，并随之解析 `UserService` 实例。要在我们的 Activity 中获取它，让我们使用 `by viewModel()` 委托函数来注入它： 

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就这些，您的应用已准备就绪。

:::info
`by viewModel()` 函数允许我们检索 ViewModel 实例，为您创建相关的 ViewModel Factory 并将其绑定到生命周期
:::

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
`startKoin` 中的 `modules()` 函数加载给定的模块列表
:::

## Koin 模块：DSL 比较

这是使用 **Classic DSL**（手动装配）的 Koin 模块声明：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

使用 **Compiler Plugin DSL**（编译时自动装配）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
Compiler Plugin DSL 需要 [Koin Compiler Plugin](/docs/setup/compiler-plugin)。它提供了编译时依赖项解析和更简洁的语法。
:::