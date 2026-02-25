---
title: Kotlin
---

> 本教程将引导你编写一个 Kotlin 应用程序，并使用 Koin 依赖注入来检索你的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-10-21
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
data class User(val name : String)
```

我们创建一个 “Repository” 组件来管理用户列表（添加用户或按名称查找用户）。以下是 `UserRepository` 接口及其实现：

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

使用 `module` 函数来声明 Koin 模块。Koin 模块是我们定义所有待注入组件的地方。

```kotlin
val appModule = module {
    
}
```

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserService 组件

让我们编写 `UserService` 组件来请求默认用户：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的构造函数中被引用

我们在 Koin 模块中声明 `UserService`。我们将其声明为 `single` 定义：

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 函数允许请求 Koin 解析所需的依赖项。

## 在 UserApplication 中注入依赖项

`UserApplication` 类将帮助从 Koin 中引导实例。得益于 `KoinComponent` 接口，它将解析 `UserService`。这允许使用 `by inject()` 委托函数来注入它：

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // 显示我们的数据
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

就是这样，你的应用已准备就绪。

:::info
`by inject()` 函数允许我们在任何扩展了 `KoinComponent` 的类中检索 Koin 实例。
:::

## 启动 Koin

我们需要随应用程序一起启动 Koin。只需在应用程序的主入口点（即我们的 `main` 函数）中调用 `startKoin()` 函数即可：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` 中的 `modules()` 函数加载给定的模块列表。
:::

## Koin 模块：经典 DSL 还是构造函数 DSL？

以下是我们应用的 Koin 模块声明：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

我们可以通过使用构造函数，以更紧凑的方式编写它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}