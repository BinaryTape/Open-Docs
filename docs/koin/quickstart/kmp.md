---
title: Kotlin Multiplatform - 无共享 UI
---

> 这篇教程将引导你编写一个 Android 应用程序，并使用 Koin 依赖注入来获取组件。
> 完成本教程大约需要 **15 分钟**。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 GitHub 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 应用程序概览

该应用程序的设计思路是管理用户列表，并通过共享的 Presenter 在原生 UI 中显示：

`Users -> UserRepository -> Shared Presenter -> Native UI`

## “User”数据

> 所有公共/共享代码都位于 `shared` Gradle 项目中

我们将管理一个 User 集合。以下是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个 “Repository” 组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数声明 Koin 模块。Koin 模块是定义所有待注入组件的地方。

让我们声明第一个组件。我们希望通过创建 `UserRepositoryImpl` 实例来获得 `UserRepository` 的单例。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享 Presenter

让我们编写一个用于显示用户的 Presenter 组件：

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

我们在 Koin 模块中声明 `UserPresenter`。我们将其声明为 `factoryOf` 定义，以便不在内存中保留任何实例，而是由原生系统持有：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 模块以可运行函数（此处为 `appModule`）的形式提供，以便通过 `initKoin()` 函数从 iOS 端轻松运行。
:::

## 原生组件

以下原生组件在 Android 和 iOS 中定义：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

两者都获得本地平台实现。

## 在 Android 中注入

> 所有 Android 应用都位于 `androidApp` Gradle 项目中

系统将创建 `UserPresenter` 组件，并随之解析 `UserRepository` 实例。为了在 Activity 中获取它，让我们使用 `koinInject` Compose 函数进行注入：

```kotlin
// 在 App() 中

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

就这样，你的应用准备就绪了。

:::info
`koinInject()` 函数允许我们在 Android Compose 运行时中检索 Koin 实例。
:::

我们需要在 Android 应用程序中启动 Koin。只需在 Compose 应用程序函数 `App` 中调用 `KoinApplication()` 函数即可：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

我们从共享的 KMP 配置中收集 Koin Android 配置：

```kotlin
// Android 配置
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
我们使用 `LocalContext.current` 从 Compose 中获取当前 Android context。
:::

以及共享的 KMP 配置：

```kotlin
// 公共配置
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 函数加载给定的模块列表。
:::

## 在 iOS 中注入

> 所有 iOS 应用都位于 `iosApp` 文件夹中

系统将创建 `UserPresenter` 组件，并随之解析 `UserRepository` 实例。为了在 `ContentView` 中获取它，我们需要创建一个用于为 iOS 检索 Koin 依赖项的函数：

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

就这样，你只需从 iOS 部分调用 `KoinKt.getUserPresenter().sayHello()` 函数。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

我们需要在 iOS 应用程序中启动 Koin。在 Kotlin 共享代码中，我们可以通过 `initKoin()` 函数使用共享配置。
最后，在 iOS 主入口中，我们可以调用 `KoinAppKt.doInitKoin()` 函数，该函数会调用我们上面的辅助函数。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}