---
title: Compose Multiplatform - 共享UI
---

> 本教程将引导您编写一个 Android 应用程序，并使用 Koin 依赖注入来检索您的组件。
> 您大约需要 **15 分钟** 来完成本教程。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## 应用程序概览

该应用程序的理念是管理一个用户列表，并将其显示在我们的原生 UI 中，使用共享的 ViewModel：

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## "User" 数据

> 所有通用/共享代码都位于 `shared` Gradle 项目中

我们将管理一个用户集合。这是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个“Repository”组件来管理用户列表（添加用户或按名称查找用户）。以下是 `UserRepository` 接口及其实现：

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

## 共享 Koin 模块

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是我们定义所有要注入的组件的地方。

让我们声明我们的第一个组件。我们想要一个 `UserRepository` 的单例（singleton），通过创建一个 `UserRepositoryImpl` 的实例：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享 ViewModel

让我们编写一个 ViewModel 组件来显示一个用户：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的构造函数中被引用

我们在 Koin 模块中声明 `UserViewModel`。我们将其声明为一个 `viewModelOf` 定义，以便不保留任何实例在内存中，并让原生系统持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
该 Koin 模块可作为函数（此处为 `appModule`）运行，以便通过 `initKoin()` 函数从 iOS 侧轻松运行。
:::

## 原生组件

以下原生组件在 Android 和 iOS 中定义：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

两者都获取本地平台实现。

## 在 Compose 中注入

> 所有 Common Compose 应用程序都位于 `composeApp` Gradle 模块的 `commonMain` 中：

`UserViewModel` 组件将被创建，并解析其 `UserRepository` 实例。为了将其注入到我们的 Activity 中，我们可以使用 `koinViewModel` 或 `koinNavViewModel` Compose 函数来注入它：

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

就是这样，您的应用程序已准备就绪。

我们需要在我们的 Android 应用程序中启动 Koin。只需在 Compose 应用程序函数 `App` 中调用 `KoinApplication()` 函数：

```kotlin
fun App() {
    
    KoinApplication(
        application = {
            modules(appModule)
        }
    )
{
// Compose content
}
}
```

:::info
`modules()` 函数加载给定模块列表
:::

## iOS 上的 Compose 应用

> 所有 iOS 应用程序都位于 `iosMain` 文件夹中

`MainViewController.kt` 已准备好启动 iOS 版 Compose：

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }
```