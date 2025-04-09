---
title: "Kotlin Multiplatform - 无共享 UI"
---
> 本教程将引导你编写一个 Android 应用程序，并使用 Koin 依赖注入来检索你的组件。
> 完成本教程大约需要 __15 分钟__。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可以在 Github 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 应用概览

该应用程序的目的是管理一个用户列表，并在我们的原生 UI 中显示它，使用一个共享的 Presenter：

`Users -> UserRepository -> Shared Presenter -> Native UI`

## “用户”数据

> 所有公共/共享代码都位于 `shared` Gradle 项目中

我们将管理一个用户集合。以下是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个“Repository（仓库）”组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

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

让我们声明我们的第一个组件。我们想要一个 `UserRepository` 的单例，通过创建一个 `UserRepositoryImpl` 的实例：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享 Presenter

让我们编写一个 presenter 组件来显示一个用户：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的构造函数中被引用

我们在 Koin 模块中声明 `UserPresenter`。我们将其声明为 `factoryOf` 定义，以不在内存中保留任何实例，并让本机系统持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 模块可以作为一个函数运行（这里是 `appModule`），以便可以轻松地从 iOS 端使用 `initKoin()` 函数运行。
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

## 在 Android 中注入

> 所有 Android 应用程序都位于 `androidApp` Gradle 项目中

`UserPresenter` 组件将被创建，并解析 `UserRepository` 实例。为了将其引入我们的 Activity，让我们使用 `koinInject` compose 函数注入它：

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

就这样，你的应用程序已准备就绪。

:::info
`koinInject()` 函数允许我们在 Android Compose 运行时检索 Koin 实例
:::

我们需要使用我们的 Android 应用程序启动 Koin。只需在 compose 应用程序函数 `App` 中调用 `KoinApplication()` 函数：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

我们从共享的 KMP 配置中收集 Koin android 配置：

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
我们使用 `LocalContext.current` 从 Compose 获取当前的 Android 上下文
:::

以及共享的 KMP 配置：

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 函数加载给定的模块列表
:::

## 在 iOS 中注入

> 所有 iOS 应用程序都位于 `iosApp` 文件夹中

`UserPresenter` 组件将被创建，并解析 `UserRepository` 实例。为了将其引入我们的 `ContentView`，我们需要创建一个函数来检索 iOS 的 Koin 依赖项：

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

就是这样，你可以从 iOS 部分调用 `KoinKt.getUserPresenter().sayHello()` 函数。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

我们需要使用我们的 iOS 应用程序启动 Koin。在 Kotlin 共享代码中，我们可以使用带有 `initKoin()` 函数的共享配置。
最后，在 iOS 主入口中，我们可以调用调用上面 helper 函数的 `KoinAppKt.doInitKoin()` 函数。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}
```