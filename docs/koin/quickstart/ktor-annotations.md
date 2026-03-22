---
title: Ktor 与注解
---

> Ktor 是一个用于在连接系统中利用强大的 Kotlin 编程语言构建异步服务器和客户端的框架。我们将在这里使用 Ktor 来构建一个简单的 Web 应用程序。

出发 🚀

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 设置

首先，如下所示添加 Koin 依赖项：

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // 适用于 Kotlin 应用的 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 应用程序概览

该应用程序的构思是管理一个用户列表，并将其显示在我们的 `UserApplication` 类中：

> Users -> UserRepository -> UserService -> UserApplication

## “User” 数据

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建了一个 “Repository” 组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

## Koin 模块

使用 `@Module` 注解从给定的 Kotlin 类声明 Koin 模块。Koin 模块是我们定义所有要注入的组件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 将其声明为一个 Koin 模块
* `@ComponentScan("org.koin.sample")` - 扫描并注册来自该软件包的注解类
* `@Configuration` - 通过 `@KoinApplication` 启用自动模块发现

:::note
此项目使用 Koin 的 `@Singleton` 注解（来自 `org.koin.core.annotation`）来声明单例组件。
:::

让我们声明第一个组件。我们希望通过创建 `UserRepositoryImpl` 实例来获得 `UserRepository` 的单例。我们使用 `@Singleton` 对其进行标记：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository
```

## UserService 组件

让我们编写 `UserService` 组件来管理用户操作：

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

> UserRepository 在 `UserServiceImpl` 的构造函数中被引用

我们使用 `@Singleton` 注解声明 `UserService`：

## HTTP 控制器与 Koin 应用程序

最后，我们需要创建一个 `@KoinApplication` 对象并配置我们的 HTTP 路由：

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 注解将此标记为 Koin 基于注解配置的入口点。KSP 处理器生成的配置可以与 `withConfiguration<T>()` 配合使用以初始化 Koin。

## 启动与注入

现在让我们为 Ktor 应用程序配置 Koin：

```kotlin
fun Application.main() {
    // 使用生成的配置安装 Koin
    install(Koin) {
        slf4jLogger()
        withConfiguration<KoinUserApplication>()
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

**关键点：**
* `withConfiguration<KoinUserApplication>()` - 使用来自被注解应用程序对象的生成 Koin 配置
* 无需手动调用 `modules(AppModule().module)` —— 它已自动包含在内！
* `/hello` 端点接受一个可选的 `name` 查询参数

让我们启动 Ktor：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

就这样！您已准备就绪。检查这些 URL：
- `http://localhost:8080/hello` - 向 Alice 致意（默认用户）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 致意

:::info
带有 `@Configuration` 的模块上的 `@KoinApplication` 注解会在编译时自动发现并加载所有被注解的依赖项。
:::