---
title: Android - Jetpack Compose
---

> 本教程将引导您编写一个 Android 应用程序，并使用 Koin 注入来检索您的组件。
> 完成本教程大约需要 **10 分钟**。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 设置

如下所示添加 Koin Android 依赖项：

```groovy
dependencies {

    // 针对 Android 的 Koin
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 应用程序概览

该应用程序的想法是管理一个用户列表，并在我们的 `MainActivity` 类中使用 Presenter 或 ViewModel 显示它：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> Composable

## “User”数据

我们将管理一个 User 集合。以下是数据类： 

```kotlin
data class User(val name : String)
```

我们创建一个“仓库”组件来管理用户列表（添加用户或按名称查找）。下面是 `UserRepository` 接口及其实现：

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

使用 `module` 函数来声明一个 Koin 模块。Koin 模块是我们定义所有要注入组件的地方。

```kotlin
val appModule = module {
    
}
```

让我们声明第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## 使用 UserViewModel 显示用户

### `UserViewModel` 类

让我们编写一个 ViewModel 组件来显示用户：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的构造函数中被引用

我们在 Koin 模块中声明 `UserViewModel`。我们将其声明为 `viewModelOf` 定义，以避免在内存中保留任何实例（避免 Android 生命周期的任何内存泄漏）：

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 函数允许请求 Koin 解析所需的依赖项。

### 在 Compose 中注入 ViewModel

`UserViewModel` 组件将被创建，并随之解析 `UserRepository` 实例。为了将其引入我们的 Activity，让我们使用 `koinViewModel()` 函数来注入它： 

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 函数允许我们检索 ViewModel 实例，为您创建相关的 ViewModel 工厂并将其绑定到生命周期。
:::

## 使用 UserStateHolder 显示用户

### `UserStateHolder` 类

让我们编写一个状态持有者 (State holder) 组件来显示用户：

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的构造函数中被引用

我们在 Koin 模块中声明 `UserStateHolder`。我们将其声明为 `factoryOf` 定义，以避免在内存中保留任何实例（避免 Android 生命周期的任何内存泄漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### 在 Compose 中注入 UserStateHolder

`UserStateHolder` 组件将被创建，并随之解析 `UserRepository` 实例。为了将其引入我们的 Activity，让我们使用 `koinInject()` 函数来注入它： 

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 函数允许我们检索 ViewModel 实例，为您创建相关的 ViewModel 工厂并将其绑定到生命周期。
:::

## 启动 Koin

我们需要在 Android 应用程序中启动 Koin。只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数：

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
`startKoin` 中的 `modules()` 函数用于加载给定的模块列表。
:::

在启动 Compose 应用程序时，我们需要使用 `KoinAndroidContext` 将 Koin 链接到我们当前的 Compose 应用程序：

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                KoinAndroidContext {
                    App()
                }
            }
        }
    }
}
```

## Koin 模块：传统方式还是构造函数 DSL？

这是我们应用的 Koin 模块声明：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我们可以通过使用构造函数，以更简洁的方式编写它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 验证您的应用！

在启动应用之前，我们可以通过简单的 JUnit 测试来验证 Koin 配置，从而确保 Koin 配置是正确的。

### Gradle 设置

如下所示添加 Koin Android 依赖项：

```groovy
dependencies {
    
    // 针对测试的 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 检查您的模块

`verify()` 函数允许验证给定的 Koin 模块：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

只需一个 JUnit 测试，您就可以确保您的定义配置没有遗漏任何内容！