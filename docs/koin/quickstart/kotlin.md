---
title: Kotlin
---

> 本教程将引导你编写一个 Kotlin 应用程序，并使用 Koin 依赖注入来检索你的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-10-21
:::

:::tip
正在寻找本教程的**注解版本**？请查看 [Kotlin 与注解](./kotlin-annotations.md)，它使用 Koin 注解进行编译时验证和自动模块发现。
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 设置

首先，检查是否已按如下方式添加 `koin-core` 依赖项：

```groovy
dependencies {
    
    // 适用于 Kotlin 应用的 Koin
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## 应用程序概览

该应用程序的想法是管理一个用户列表，并将其显示在我们的 `UserApplication` 类中：

> Users -> UserRepository -> UserService -> UserApplication

## “User” 数据

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个 “Repository” 组件来管理用户列表（添加用户或按名称查找用户）。以下是 `UserRepository` 接口及其实现：

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

## Koin 模块

使用 `module` 函数来声明 Koin 模块。Koin 模块是我们定义所有待注入组件的地方。

```kotlin
val appModule = module {

}
```

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
本教程使用的是 **Koin 编译器插件 DSL** (`single<T>()`)，它在编译时提供自动装配。有关配置，请参阅 [编译器插件设置](/docs/setup/compiler-plugin)。
:::

## UserService 组件

让我们编写 `UserService` 组件来管理用户操作：

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

> `UserRepository` 在 `UserServiceImpl` 的构造函数中被引用

我们在 Koin 模块中声明 `UserService`。我们将其声明为 `single` 定义：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 在 UserApplication 中注入依赖项

`UserApplication` 类将帮助从 Koin 中引导实例。它将通过构造函数注入来解析 `UserService`：

```kotlin
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    // 显示我们的数据
    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

就是这样，你的应用已准备就绪。

:::info
构造函数注入是 Kotlin 应用程序中注入依赖项的首选方式。Koin 将在创建 `UserApplication` 时自动解析并注入 `UserService`。
:::

## 启动 Koin

我们需要随应用程序一起启动 Koin，并将 `UserApplication` 添加到我们的模块中。只需在应用程序的主入口点（即我们的 `main` 函数）中调用 `startKoin()` 函数即可：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}

fun main() {
    startKoin {
        modules(appModule)
    }

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

:::info
`startKoin` 中的 `modules()` 函数加载给定的模块列表。我们使用 `KoinPlatform.getKoin().get<UserApplication>()` 从 Koin 中检索 `UserApplication` 实例。
:::

## Koin 模块：DSL 比较

以下是使用**经典 DSL**（手动装配）的 Koin 模块声明：

```kotlin
val appModule = module {
    single { UserApplication(get()) }
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
}
```

使用**编译器插件 DSL**（编译时自动装配）：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::tip
编译器插件 DSL 需要 [Koin 编译器插件](/docs/setup/compiler-plugin)。它提供编译时依赖解析和更整洁的语法。
:::