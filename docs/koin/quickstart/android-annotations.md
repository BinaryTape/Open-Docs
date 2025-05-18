---
title: "Android & 注解 (Annotations)"
---
> 本教程将引导你编写一个 Android 应用程序，并使用 Koin 依赖注入来检索你的组件。
> 完成本教程大约需要 __10 分钟__。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 设置

让我们像这样配置 KSP 插件，以及以下依赖项：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 编译时检查
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
请查看 `libs.versions.toml` 以获取当前版本
:::

## 应用概述

该应用程序的目的是管理一个用户列表，并在我们的 `MainActivity` 类中使用 Presenter 或 ViewModel 显示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## “User”数据

我们将管理一个用户集合。以下是数据类：

```kotlin
data class User(val name : String)
```

我们创建一个“Repository”（仓库）组件来管理用户列表（添加用户或按名称查找用户）。以下是 `UserRepository` 接口及其实现：

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

让我们声明一个 `AppModule` 模块类，如下所示。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 我们使用 `@Module` 将我们的类声明为 Koin 模块
* `@ComponentScan("org.koin.sample")` 允许扫描 `"org.koin.sample"` 包中的任何 Koin 定义

让我们简单地在 `UserRepositoryImpl` 类上添加 `@Single`，将其声明为单例：

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
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

> UserRepository 在 UserPresenter 的构造函数中被引用

我们在 Koin 模块中声明 `UserPresenter`。 我们使用 `@Factory` 注解将其声明为 `factory` 定义，以不在内存中保留任何实例（避免 Android 生命周期中的任何泄漏）：

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 在 Android 中注入依赖

`UserPresenter` 组件将被创建，并解析 `UserRepository` 实例。 为了在我们的 Activity 中获取它，让我们使用 `by inject()` 委托函数注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

这样，你的应用程序就准备好了。

:::info
`by inject()` 函数允许我们在 Android 组件运行时（Activity、fragment、Service...）检索 Koin 实例
:::

## 启动 Koin

我们需要使用我们的 Android 应用程序启动 Koin。 只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数：

```kotlin
// generated
import org.koin.ksp.generated.*

class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(AppModule().module)
        }
    }
}
```

Koin 模块是从带有 `.module` 扩展名的 `AppModule` 生成的：只需使用 `AppModule().module` 表达式从注解中获取 Koin 模块。

:::info
需要 `import org.koin.ksp.generated.*` 导入才能使用生成的 Koin 模块内容
:::

## 使用 ViewModel 显示用户

让我们编写一个 ViewModel 组件来显示用户：

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的构造函数中被引用

`UserViewModel` 使用 `@KoinViewModel` 注解进行标记，以声明 Koin ViewModel 定义，以不在内存中保留任何实例（避免 Android 生命周期中的任何泄漏）。

## 在 Android 中注入 ViewModel

`UserViewModel` 组件将被创建，并解析 `UserRepository` 实例。 为了在我们的 Activity 中获取它，让我们使用 `by viewModel()` 委托函数注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 编译时检查

Koin Annotations 允许在编译时检查 Koin 配置。 这可以通过使用以下 Gradle 选项来实现：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 验证你的应用程序！

我们可以在启动应用程序之前，通过使用一个简单的 JUnit 测试验证 Koin 配置来确保我们的 Koin 配置良好。

### Gradle 设置

如下所示添加 Koin Android 依赖项：

```groovy
// 如果需要，将 Maven Central 添加到你的 repositories 中
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 检查你的模块

`androidVerify()` 函数允许验证给定的 Koin 模块：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

只需一个 JUnit 测试，你就可以确保你的定义配置没有任何遗漏！