---
title: Ktor
---

> Ktor 是一个用于在连接系统中使用强大的 Kotlin 编程语言构建异步服务器和客户端的框架。我们将在这里使用 Ktor 来构建一个简单的 Web 应用程序。

开始吧 🚀

:::note
更新 - 2024-10-21
:::

:::tip
正在寻找本教程的**注解版本**吗？请查看 [Ktor 与注解](./ktor-annotations.md)，它使用 Koin Annotations 与 Jakarta `@Singleton` 进行编译时验证。
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradle 设置

首先，如下所示添加 Koin 依赖项：

```kotlin
dependencies {
    // 适用于 Kotlin 应用程序的 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## 应用程序概览

该应用程序的想法是管理用户列表，并将其显示在我们的 `UserApplication` 类中：

> Users -> UserRepository -> UserService -> UserApplication

## “User”数据

我们将管理一个 User 集合。这是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个“仓库 (Repository)”组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是定义我们所有要注入组件的地方。

```kotlin
val appModule = module {

}
```

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
本教程使用 **Koin 编译器插件 DSL** (`single<T>()`)，它提供编译时自动装配。有关配置请参阅[编译器插件设置](/docs/setup/compiler-plugin)。
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

## HTTP 控制器

最后，我们需要一个 HTTP 控制器来创建 HTTP 路由。在 Ktor 中，这将通过 Ktor 扩展函数来表达：

```kotlin
fun Application.main() {

    // 延迟注入 UserService
    val service by inject<UserService>()
    service.loadUsers()

    // 路由部分
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

`/hello` 端点接受可选的 `name` 查询参数。如果未提供，则默认为 "Alice"。

示例请求：
- `http://localhost:8080/hello` - 向 Alice 问候（默认）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 问候

## 声明您的依赖项

让我们使用 Koin 模块组装我们的组件：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 启动并注入

最后，让我们从 Ktor 启动 Koin：

```kotlin
fun Application.main() {
    // 安装 Koin
    install(Koin) {
        modules(appModule)
    }

    // 延迟注入 UserService
    val service by inject<UserService>()
    service.loadUsers()

    // 路由部分
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

让我们启动 Ktor：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

就这样！您已经准备就绪。查看这些 URL：
- `http://localhost:8080/hello` - 向 Alice 问候（默认用户）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 问候