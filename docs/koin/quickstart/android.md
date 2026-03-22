---
title: Android
---

> 本教程将引导你编写一个 Android 应用程序，并使用 Koin 依赖注入来获取组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 设置

像下面这样添加 Koin Android 依赖项：

```groovy
dependencies {

    // 适用于 Android 的 Koin
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 应用程序概览

该应用程序的设计思路是管理一个用户列表，并使用 Presenter 或 ViewModel 在我们的 `MainActivity` 类中显示它：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## “User” 数据

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个 “Repository” 组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数来声明 Koin 模块。Koin 模块是我们定义所有要注入的组件的地方。

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
本教程使用 **Koin 编译器插件 DSL** (`single<T>()`、`factory<T>()`)，它在编译时提供自动装配。有关配置请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
:::

## 使用 Presenter 显示用户

让我们编写一个 Presenter 组件来显示用户：

```kotlin
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> `UserService` 在 `UserPresenter` 的构造函数中被引用

我们在 Koin 模块中声明 `UserPresenter`。我们将其声明为 `factory` 定义，以便不在内存中保留任何实例（避免 Android 生命周期的任何内存泄漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

## 在 Android 中注入依赖项

`UserPresenter` 组件将被创建，并随之解析 `UserService` 实例。为了在 Activity 中获取它，让我们使用 `by inject()` 委托函数进行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就这样，你的应用准备就绪了。

:::info
`by inject()` 函数允许我们在 Android 组件运行时（Activity、fragment、Service...）检索 Koin 实例。
:::

## 启动 Koin

我们需要随 Android 应用程序一起启动 Koin。只需在应用程序的主入口点（即我们的 `MainApplication` 类）中调用 `startKoin()` 函数：

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
`startKoin` 中的 `modules()` 函数会加载给定的模块列表。
:::

## Koin 模块：DSL 对比

这是使用 **经典 DSL**（手动装配）的 Koin 模块声明：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    factory { UserPresenter(get()) }
}
```

使用 **编译器插件 DSL**（编译时自动装配）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

:::tip
编译器插件 DSL 需要 [Koin 编译器插件](/docs/setup/compiler-plugin)。它提供编译时依赖解析和更整洁的语法。
:::