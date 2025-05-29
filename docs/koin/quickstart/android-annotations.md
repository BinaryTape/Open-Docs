---
title: Android 与注解
---

> 本教程将指导你编写一个 Android 应用程序，并使用 Koin 依赖注入来获取你的组件。完成本教程大约需要 __10 分钟__。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 配置

让我们这样配置 KSP 插件，以及以下依赖项：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// Compile time check
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
查看 `libs.versions.toml` 获取当前版本
:::

## 应用程序概述

应用程序的思路是管理一个用户列表，并使用 Presenter 或 ViewModel 在我们的 `MainActivity` 类中显示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## “User” 数据

我们将管理一个用户集合。以下是数据类：

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

## Koin 模块

让我们像下面这样声明一个 `AppModule` 模块类。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 我们使用 `@Module` 将我们的类声明为 Koin 模块
* `@ComponentScan("org.koin.sample")` 允许扫描 `"org.koin.sample"` 包中的任何 Koin 定义

我们只需在 `UserRepositoryImpl` 类上添加 `@Single` 以将其声明为单例：

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## 使用 Presenter 显示用户

让我们编写一个 Presenter 组件来显示用户：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserPresenter 的构造函数中被引用

我们在 Koin 模块中声明 `UserPresenter`。我们使用 `@Factory` 注解将其声明为 `factory` 定义，以便不在内存中保留任何实例（避免 Android 生命周期中的内存泄漏）：

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 在 Android 中注入依赖

`UserPresenter` 组件将被创建，并随之解析 `UserRepository` 实例。为了在我们的 Activity 中获取它，让我们使用 `by inject()` 委托函数来注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就是这样，你的应用程序已准备就绪。

:::info
`by inject()` 函数允许我们在 Android 组件运行时（Activity、fragment、Service 等）中检索 Koin 实例。
:::

## 启动 Koin

我们需要在 Android 应用程序中启动 Koin。只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数：

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

Koin 模块是从 `AppModule` 使用 `.module` 扩展生成的：只需使用 `AppModule().module` 表达式即可从注解中获取 Koin 模块。

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

`UserViewModel` 带有 `@KoinViewModel` 注解，用于声明 Koin ViewModel 定义，以便不在内存中保留任何实例（避免 Android 生命周期中的内存泄漏）。

## 在 Android 中注入 ViewModel

`UserViewModel` 组件将被创建，并随之解析 `UserRepository` 实例。为了在我们的 Activity 中获取它，让我们使用 `by viewModel()` 委托函数来注入它：

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

Koin 注解允许在编译时检查你的 Koin 配置。这可以通过使用以下 Gradle 选项来实现：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 验证你的应用程序！

我们可以在启动应用程序之前，通过一个简单的 JUnit 测试来验证 Koin 配置是否正确，从而确保其良好。

### Gradle 配置

添加 Koin Android 依赖项，如下所示：

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

`androidVerify()` 函数允许验证给定的 Koin 模块：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

只需一个 JUnit 测试，你就可以确保你的定义配置没有遗漏任何内容！