---
title: 在 Android 中注入
---

一旦你声明了一些模块并启动了 Koin，该如何在你 Android 的 Activity、Fragment 或 Service 中检索实例呢？

## 适用于 Android 类

`Activity`、`Fragment` 和 `Service` 已通过 Koin 扩展程序进行了扩展。任何 `ComponentCallbacks` 类都可以访问：

* `by inject()` - 来自 Koin 容器的延迟计算实例
* `get()` - 从 Koin 容器中立即获取实例
* `by viewModel()` - 延迟加载的 ViewModel 实例
* `getViewModel()` - 立即获取的 ViewModel 实例

## 定义依赖项

### 编译器插件 DSL

```kotlin
val appModule = module {
    factory<Presenter>()
    viewModel<UserViewModel>()
}
```

### 注解

```kotlin
@Factory
class Presenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    factory { Presenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 在 Activity 中注入

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延迟注入 Presenter
    private val presenter: Presenter by inject()

    // 延迟注入 ViewModel
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 使用 presenter 和 viewModel
    }
}
```

## 在 Fragment 中注入

```kotlin
class UserFragment : Fragment() {

    // Fragment 自己的 ViewModel
    private val viewModel: UserViewModel by viewModel()

    // 与 Activity 共享的 ViewModel
    private val sharedViewModel: SharedViewModel by activityViewModel()

    // 常规依赖项
    private val presenter: Presenter by inject()
}
```

## 在 Service 中注入

```kotlin
class MyService : Service() {

    private val repository: UserRepository by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        repository.doSomething()
        return START_STICKY
    }
}
```

## 立即注入 vs 延迟注入

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延迟注入 - 在首次访问时创建
    private val presenter: Presenter by inject()

    // 立即注入 - 立即创建
    private val service: MyService = get()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 或者在函数中立即获取
        val anotherPresenter: Presenter = get()
    }
}
```

| 方法 | 何时创建 | 用例 |
|--------|--------------|----------|
| `by inject()` | 首次访问时 | 大多数情况，避免不必要的创建 |
| `get()` | 立即 | 当你需要立即使用实例时 |

:::info
如果你的类没有 Koin 扩展程序，请实现 `KoinComponent` 接口以访问 `inject()` 或 `get()`。
:::

## 带有参数的注入

在注入时传递参数：

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository
)
```

```kotlin
class UserActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject { parametersOf("user_123") }
}
```

## 带有限定符的注入

当你对同一种类型有多个定义时：

```kotlin
val appModule = module {
    single<Database>(named("local")) { LocalDatabase() }
    single<Database>(named("remote")) { RemoteDatabase() }
}
```

```kotlin
class MyActivity : AppCompatActivity() {

    private val localDb: Database by inject(named("local"))
    private val remoteDb: Database by inject(named("remote"))
}
```

## 在定义中使用 Android Context

一旦你的 `Application` 类使用 `androidContext` 配置了 Koin，你就可以在定义中解析它。

### 注解

使用注解时，只需声明一个 `Context` 或 `Application` 形参 —— 它将被自动注入：

```kotlin
@Factory
class MyPresenter(private val context: Context)

@Singleton
class MyRepository(private val application: Application)
```

### DSL

在你的模块中使用 `androidContext()` 或 `androidApplication()` 函数：

```kotlin
val appModule = module {
    factory {
        MyPresenter(androidContext())
    }
    single {
        MyRepository(androidApplication())
    }
}
```

## Android 作用域与 Context 解析

当你有一个绑定了 `Context` 类型的作用域时，你可能需要从不同层级解析 `Context`：

```kotlin
class MyPresenter(val context: Context)

val appModule = module {
    scope<MyActivity> {
        scoped { MyPresenter(get()) }
    }
}
```

Context 解析：
- `get()` - 解析最接近的 `Context`，此处为 `MyActivity`
- `androidContext()` - 解析最接近的 `Context`，此处为 `MyActivity`
- `androidApplication()` - 从 Koin 设置中解析 `Application`