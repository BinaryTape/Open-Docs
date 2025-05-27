---
title: Android
---

> 本教程将引导你编写一个 Android 应用程序，并使用 Koin 依赖注入来获取你的组件。
> 你大约需要 __10 分钟__ 来完成本教程。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 配置

如下所示添加 Koin Android 依赖：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 应用程序概述

该应用程序的构想是管理用户列表，并使用 Presenter 或 ViewModel 在我们的 `MainActivity` 类中显示它：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## “用户”数据

我们将管理一个用户集合。这是数据类：

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

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是我们定义所有要注入的组件的地方。

```kotlin
val appModule = module {
    
}
```

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得一个 `UserRepository` 单例。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 Presenter 显示用户

让我们编写一个 presenter 组件来显示用户：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的构造函数中被引用

我们在 Koin 模块中声明 `UserPresenter`。我们将其声明为 `factoryOf` 定义，以避免在内存中保留任何实例（避免 Android 生命周期造成的任何内存泄漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()` 函数允许请求 Koin 解析所需的依赖项。

## 在 Android 中注入依赖

`UserPresenter` 组件将被创建，并随之解析 `UserRepository` 实例。为了将其引入到我们的 Activity 中，我们使用 `by inject()` 委托函数来注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就这样，你的应用程序就准备好了。

:::info
`by inject()` 函数允许我们在 Android 组件运行时（Activity、fragment、Service 等）获取 Koin 实例。
:::

## 启动 Koin

我们需要在我们的 Android 应用程序中启动 Koin。只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数即可：

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin` 中的 `modules()` 函数加载给定模块列表。
:::

## Koin 模块：经典方式还是构造函数 DSL？

这是我们应用程序的 Koin 模块声明：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

我们可以通过使用构造函数以更紧凑的方式编写它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## 验证你的应用程序！

在启动应用程序之前，我们可以通过简单的 JUnit 测试来验证 Koin 配置是否良好。

### Gradle 配置

如下所示添加 Koin Android 依赖：

```groovy
// Add Maven Central to your repositories if needed
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 检查你的模块

`verify()` 函数允许验证给定的 Koin 模块：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

仅通过一个 JUnit 测试，你就可以确保你的定义配置没有遗漏任何内容！