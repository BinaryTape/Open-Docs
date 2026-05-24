---
title: Android 与注解
---

> 本教程将带您编写一个 Android 应用程序，并使用 Koin 依赖注入来检索您的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 GitHub 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 设置

让我们像这样配置 KSP 插件以及以下依赖项：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 编译时检查
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
有关当前版本，请参阅 `libs.versions.toml`
:::

## 应用程序概览

该应用程序的想法是管理一个用户列表，并使用 Presenter 或 ViewModel 在我们的 `MainActivity` 类中显示它：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## “User”数据

我们将管理一个 User 集合。这是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个“仓库”组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

@Singleton
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

@Singleton
class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    init {
        loadUsers()
    }

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

让我们声明一个如下所示的 `AppModule` 模块类：

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 将此类声明为 Koin 模块
* `@ComponentScan("org.koin.sample")` - 自动扫描并注册 `"org.koin.sample"` 软件包中的所有 Koin 定义
* `@Configuration` - 与 `@KoinApplication` 配合使用时，启用模块自动发现

启用组件扫描后，我们只需在类上添加注解：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService {
    // ...
}
```

`@Singleton` 注解将这些类声明为 Koin 中的单例。

## 使用 Presenter 显示用户

让我们编写一个 Presenter 组件来显示用户：

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> UserService 在 UserPresenter 的构造函数中被引用

我们使用 `@Factory` 注解声明 `UserPresenter`，以便在每次请求时创建一个新实例（避免 Android 生命周期的任何内存泄漏）：

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {
    // ...
}
```

## 在 Android 中注入依赖项

`UserPresenter` 组件将被创建，并随之解析 `UserService` 实例。为了将其获取到我们的 Activity 中，让我们使用 `by inject()` 委托函数进行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就这样，您的应用准备就绪了。

:::info
`by inject()` 函数允许我们在 Android 组件运行时（Activity、Fragment、Service...）检索 Koin 实例
:::

## 启动 Koin

我们需要在 Android 应用程序中启动 Koin。通过使用 `@KoinApplication` 注解，Koin 会自动发现并加载所有标记为 `@Configuration` 的模块：

```kotlin
import org.koin.android.ext.koin.androidContext
import org.koin.core.annotation.KoinApplication
import org.koin.ksp.generated.*

@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MainApplication)
        }
    }
}
```

**关键点：**
* `@KoinApplication` - 自动发现所有使用 `@Module` 和 `@Configuration` 注解的模块
* 无需手动调用 `modules(AppModule().module)` - 模块会自动加载！
* 为了允许使用生成的 Koin 内容，需要 `import org.koin.ksp.generated.*` 导入
* 您只需要配置 Android 特定的设置，例如 `androidContext`

:::info
`@KoinApplication` 注解与模块上的 `@Configuration` 配合使用，通过 KSP 在编译时自动发现并加载所有依赖项。
:::

## 使用 ViewModel 显示用户

让我们编写一个 ViewModel 组件来显示用户：

```kotlin
@KoinViewModel
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> UserService 在 UserViewModel 的构造函数中被引用

`UserViewModel` 被标记为 `@KoinViewModel` 注解以声明 Koin ViewModel 定义。这确保了正确的生命周期管理并避免内存泄漏。

## 在 Android 中注入 ViewModel

`UserViewModel` 组件将被创建，并随之解析 `UserService` 实例。为了将其获取到我们的 Activity 中，让我们使用 `by viewModel()` 委托函数进行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 编译时检查

Koin 注解允许在编译时检查您的 Koin 配置。这可以通过使用以下 Gradle 选项来实现：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::tip
此基于 KSP 的选项已被 **Koin 编译器插件**取代，该插件提供原生的编译时安全性。请参阅 [编译时安全](/docs/reference/koin-compiler/compile-safety) 和 [编译器插件设置](/docs/setup/compiler-plugin)。
:::