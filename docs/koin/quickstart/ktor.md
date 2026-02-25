---
title: Ktor
---

> Ktor 是一个用于在连接系统中使用强大的 Kotlin 编程语言构建异步服务器和客户端的框架。我们将在这里使用 Ktor 来构建一个简单的 Web 应用程序。

开始吧 🚀

:::note
更新 - 2024-10-21
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
data class User(val name : String)
```

我们创建一个“仓库 (Repository)”组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是定义我们所有要注入组件的地方。

```kotlin
val appModule = module {
    
}
```

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserService 组件

让我们编写 UserService 组件来请求默认用户：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository 在 UserPresenter 的构造函数中被引用

我们在 Koin 模块中声明 `UserService`。我们将其声明为 `singleOf` 定义：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTP 控制器

最后，我们需要一个 HTTP 控制器来创建 HTTP 路由。在 Ktor 中，这将通过 Ktor 扩展函数来表达：

```kotlin
fun Application.main() {

    // 延迟注入 HelloService
    val service by inject<UserService>()

    // 路由部分
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

检查您的 `application.conf` 是否如下配置，以帮助启动 `Application.main` 函数：

```kotlin
ktor {
    deployment {
        port = 8080

        // 用于开发目的
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 声明您的依赖项

让我们使用 Koin 模块组装我们的组件：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 启动并注入

最后，让我们从 Ktor 启动 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    // 延迟注入 HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // 路由部分
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

让我们启动 Ktor：

```kotlin
fun main(args: Array<String>) {
    // 启动 Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就这样！您已经准备就绪。查看 `http://localhost:8080/hello` 网址！