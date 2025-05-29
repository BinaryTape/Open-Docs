---
title: Android - Jetpack Compose
---

> 本教程将指导你编写一个 Android 应用程序，并使用 Koin 依赖注入来检索你的组件。
> 你大约需要 **10 分钟** 来完成本教程。

:::note
更新 - 2024-10-21
:::

## 获取代码

:::info
[源代码可在 Github 上获取](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 配置

如下所示添加 Koin Android 依赖：

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 应用程序概览

此应用程序的构想是管理一个用户列表，并在我们的 `MainActivity` 类中使用 Presenter 或 ViewModel 来显示它：

> 用户 -> UserRepository -> (Presenter 或 ViewModel) -> Composable

## “User”数据

我们将管理一个 User 集合。数据类如下：

```kotlin
data class User(val name : String)
```

我们创建一个 “Repository” 组件来管理用户列表（添加用户或按名称查找用户）。下面是 `UserRepository` 接口及其实现：

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

让我们声明我们的第一个组件。我们希望通过创建 `UserRepositoryImpl` 的实例来获得 `UserRepository` 的单例。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## 使用 UserViewModel 显示用户

### UserViewModel 类

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

我们在 Koin 模块中声明 `UserViewModel`。我们将其声明为 `viewModelOf` 定义，以避免在内存中保留任何实例（避免 Android 生命周期中的任何内存泄漏）：

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 函数允许请求 Koin 解析所需的依赖。

### 在 Compose 中注入 ViewModel

`UserViewModel` 组件将被创建，并解析其所需的 `UserRepository` 实例。要将其引入我们的 Activity，我们使用 `koinViewModel()` 函数注入它：

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 函数允许我们检索 ViewModel 实例，为你创建关联的 ViewModel 工厂并将其绑定到生命周期。
:::

## 使用 UserStateHolder 显示用户

### UserStateHolder 类

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

我们在 Koin 模块中声明 `UserStateHolder`。我们将其声明为 `factoryOf` 定义，以避免在内存中保留任何实例（避免 Android 生命周期中的任何内存泄漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### 在 Compose 中注入 UserStateHolder

`UserStateHolder` 组件将被创建，并解析其所需的 `UserRepository` 实例。要将其引入我们的 Activity，我们使用 `koinInject()` 函数注入它：

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 函数允许我们检索 ViewModel 实例，为你创建关联的 ViewModel 工厂并将其绑定到生命周期。
:::

## 启动 Koin

我们需要在我们的 Android 应用程序中启动 Koin。只需在应用程序的主入口点，即我们的 `MainApplication` 类中调用 `startKoin()` 函数：

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
`startKoin` 中的 `modules()` 函数加载给定的模块列表。
:::

在启动 Compose 应用程序时，我们需要使用 `KoinAndroidContext` 将 Koin 链接到当前的 Compose 应用程序：

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

## Koin 模块：经典写法还是构造函数 DSL？

以下是我们的应用程序的 Koin 模块声明：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我们可以通过使用构造函数以更紧凑的方式编写它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 验证你的应用程序！

在启动应用程序之前，我们可以通过简单的 JUnit 测试来验证 Koin 配置，以确保其良好。

### Gradle 配置

如下所示添加 Koin Android 依赖：

```groovy
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

仅仅通过一个 JUnit 测试，你就可以确保你的定义配置没有遗漏任何东西！