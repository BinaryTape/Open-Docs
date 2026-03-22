---
title: Kotlin 与注解
---

> 本教程将引导您编写一个 Kotlin 应用程序，并使用带有注解的 Koin 依赖注入来检索您的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-11-12
:::

## 获取代码

:::info
[源代码可在 GitHub 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin-annotations)
:::

## 设置

首先，检查 Koin 注解依赖项是否已按如下方式添加：

```groovy
plugins {
    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // 适用于 Kotlin 应用程序的 Koin
    implementation("io.insert-koin:koin-core:$koin_version")

    // Koin 注解
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## 应用程序概览

该应用程序的设计思路是管理用户列表，并将其显示在我们的 `UserApplication` 类中：

> Users -> UserRepository -> UserService -> UserApplication

## “User”数据

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name: String, val email: String)
```

我们创建一个“Repository”组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

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

:::note
该项目使用 Koin 的 `@Singleton` 注解（来自 `org.koin.core.annotation`）来声明单例组件。
:::

## Koin 模块

使用 `@Module` 注解来声明一个 Koin 模块：

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 将其声明为一个 Koin 模块
* `@ComponentScan("org.koin.sample")` - 扫描并注册该软件包中带有注解的类
* `@Configuration` - 通过 `@KoinApplication` 启用模块自动发现

让我们通过添加 `@Singleton` 注解来声明我们的组件：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## UserService 组件

让我们编写 UserService 组件来管理用户操作：

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

> `UserRepository` 在 `UserServiceImpl` 的构造函数中被引用

我们使用 `@Singleton` 注解来声明 `UserService`。

## UserApplication

`UserApplication` 类使用构造函数注入来接收 `UserService`：

```kotlin
@Singleton
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

:::info
构造函数注入是注入依赖项的首选方式。Koin 在创建 `UserApplication` 时会自动解析并注入 `UserService`。
:::

## Koin 应用程序对象

创建一个 `@KoinApplication` 对象，以标记 Koin 基于注解配置的入口点：

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 注解与 KSP 处理器协同工作，为该对象生成 `startKoin()` 扩展函数。

## 启动 Koin

我们需要随应用程序一起启动 Koin。只需在应用程序的 main 入口点调用生成的 `startKoin()` 函数：

```kotlin
fun main() {
    KoinUserApplication.startKoin()

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

**关键点：**
* `KoinUserApplication.startKoin()` - 自动发现并加载所有模块的生成函数
* 无需手动调用 `modules()` —— 所有带有注解的依赖项都会在编译时被发现！
* 我们使用 `KoinPlatform.getKoin().get<UserApplication>()` 从 Koin 中检索 `UserApplication` 实例

:::info
带有 `@Configuration` 的模块上的 `@KoinApplication` 注解会通过 KSP 在编译时自动发现并加载所有带有注解的依赖项。
:::

## 注解 vs 编译器插件 DSL

以下是基于注解的配置与编译器插件 DSL 的对比：

**使用注解：**
```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule

@Singleton
class UserApplication(private val userService: UserService)

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService
```

**编译器插件 DSL（来自 kotlin.md）：**
```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

两种方法都能达到相同的结果：
- **注解**：通过 KSP 进行编译时验证，自动模块发现
- **编译器插件 DSL**：在编译时自动装配，更简洁的 `single<T>()` 语法