---
title: "Ktor & 注解(Annotations)"
---
> Ktor 是一个使用强大的 Kotlin 编程语言在连接系统中构建异步服务器和客户端的框架。 我们将在此处使用 Ktor 构建一个简单的 Web 应用程序。

让我们开始吧 🚀

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 设置

首先，像下面这样添加 Koin 依赖项：

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 应用概览

该应用程序的想法是管理一个用户列表，并在我们的 `UserApplication` 类中显示它：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 数据

我们将管理一个用户集合。 这是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个 "Repository" 组件来管理用户列表（添加用户或按名称查找）。 下面是 `UserRepository` 接口及其实现：

```kotlin
interface UserRepository {
    fun findUser(name : String): User?
    fun addUsers(users : List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUser(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users : List<User>) {
        _users.addAll(users)
    }
}
```

## Koin 模块

使用 `@Module` 注解从给定的 Kotlin 类声明 Koin 模块。 Koin 模块是我们定义所有要注入的组件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` 将有助于扫描目标包中的注解类。

让我们声明我们的第一个组件。 我们想要一个 `UserRepository` 的单例（singleton），通过创建 `UserRepositoryImpl` 的一个实例。 我们用 `@Single` 标记它

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 组件

让我们编写 UserService 组件来请求默认用户：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository 在 UserPresenter 的构造函数中被引用

我们在 Koin 模块中声明 `UserService`。 我们使用 `@Single` 注解进行标记：

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 控制器

最后，我们需要一个 HTTP 控制器来创建 HTTP 路由。 在 Ktor 中，它将通过 Ktor 扩展函数表示：

```kotlin
fun Application.main() {

    // Lazy inject HelloService
    val service by inject<UserService>()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

检查您的 `application.conf` 是否配置如下，以帮助启动 `Application.main` 函数：

```kotlin
ktor {
    deployment {
        port = 8080

        // For dev purpose
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 启动和注入

最后，让我们从 Ktor 启动 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(AppModule().module)
    }

    // Lazy inject HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

通过编写 `AppModule().module`，我们使用 `AppModule` 类上的一个生成的扩展。

让我们启动 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就这样！ 你已经准备好了。 检查 `http://localhost:8080/hello` url！