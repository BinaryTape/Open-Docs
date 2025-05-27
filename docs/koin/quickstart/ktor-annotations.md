---
title: Ktor 与注解
---

> Ktor 是一个框架，用于使用强大的 Kotlin 编程语言在互联系统中构建异步服务器和客户端。我们将在此处使用 Ktor 来构建一个简单的 Web 应用程序。

开始吧 🚀

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 配置

首先，如下所示添加 Koin 依赖：

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

## 应用程序概述

该应用程序的理念是管理用户列表，并在我们的 `UserApplication` 类中显示它：

> 用户 -> UserRepository -> UserService -> UserApplication

## “User” 数据

我们将管理用户集合。这是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个“Repository”组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

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

使用 `@Module` 注解从给定的 Kotlin 类声明一个 Koin 模块。Koin 模块是我们定义所有要注入的组件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` 将有助于扫描目标包中的带注解的类。

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得一个 `UserRepository` 单例。我们将其标记为 `@Single`。

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

我们在 Koin 模块中声明 `UserService`。我们使用 `@Single` 注解进行标记：

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 控制器

最后，我们需要一个 HTTP 控制器来创建 HTTP 路由。在 Ktor 中，这将通过 Ktor 扩展函数来表达：

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

检查你的 `application.conf` 配置如下，以帮助启动 `Application.main` 函数：

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

通过编写 `AppModule().module`，我们使用了 `AppModule` 类上生成的一个扩展。

让我们启动 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就是这样！你已准备就绪。检查 `http://localhost:8080/hello` URL！