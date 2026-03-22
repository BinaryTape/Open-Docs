---
title: 在 Android 中進行注入
---

一旦你宣告了一些模組並啟動了 Koin，該如何在 Android 的 Activity、Fragment 或 Service 中獲取執行個體？

## 支援 Android 類別

`Activity`、`Fragment` 與 `Service` 已透過 Koin 擴充功能進行擴充。任何 `ComponentCallbacks` 類別都可以存取：

* `by inject()` - 從 Koin 容器延遲求值的執行個體
* `get()` - 從 Koin 容器立即獲取執行個體
* `by viewModel()` - 延遲求值的 ViewModel 執行個體
* `getViewModel()` - 立即獲取 ViewModel 執行個體

## 定義相依性

### 編譯器外掛程式 DSL

```kotlin
val appModule = module {
    factory<Presenter>()
    viewModel<UserViewModel>()
}
```

### 註解

```kotlin
@Factory
class Presenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 傳統 DSL

```kotlin
val appModule = module {
    factory { Presenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 在 Activity 中進行注入

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延遲注入 Presenter
    private val presenter: Presenter by inject()

    // 延遲注入 ViewModel
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 使用 presenter 與 viewModel
    }
}
```

## 在 Fragment 中進行注入

```kotlin
class UserFragment : Fragment() {

    // Fragment 自己的 ViewModel
    private val viewModel: UserViewModel by viewModel()

    // 與 Activity 共用的 ViewModel
    private val sharedViewModel: SharedViewModel by activityViewModel()

    // 一般相依性
    private val presenter: Presenter by inject()
}
```

## 在 Service 中進行注入

```kotlin
class MyService : Service() {

    private val repository: UserRepository by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        repository.doSomething()
        return START_STICKY
    }
}
```

## 立即與延遲注入

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延遲 (Lazy) - 在第一次存取時建立
    private val presenter: Presenter by inject()

    // 立即 (Eager) - 立即建立
    private val service: MyService = get()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 或在函式中立即獲取
        val anotherPresenter: Presenter = get()
    }
}
```

| 方法 | 建立時機 | 使用案例 |
|--------|--------------|----------|
| `by inject()` | 第一次存取時 | 大多數情況，避免不必要的建立 |
| `get()` | 立即 | 當你需要立即使用執行個體時 |

:::info
如果你的類別沒有 Koin 擴充功能，請實作 `KoinComponent` 介面以存取 `inject()` 或 `get()`。
:::

## 帶參數的注入

在注入時傳遞參數：

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

## 使用限定詞進行注入

當你有多個相同型別的定義時：

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

## 在定義中使用 Android Context

一旦你的 `Application` 類別使用 `androidContext` 配置了 Koin，你就可以在定義中解析它。

### 註解

使用註解時，只需宣告 `Context` 或 `Application` 參數，它將會被自動注入：

```kotlin
@Factory
class MyPresenter(private val context: Context)

@Singleton
class MyRepository(private val application: Application)
```

### DSL

在模組中使用 `androidContext()` 或 `androidApplication()` 函式：

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

## Android 作用域與 Context 解析

當你具有一個繫結 `Context` 型別的作用域時，你可能需要從不同層級解析 `Context`：

```kotlin
class MyPresenter(val context: Context)

val appModule = module {
    scope<MyActivity> {
        scoped { MyPresenter(get()) }
    }
}
```

Context 解析：
- `get()` - 解析最接近的 `Context`，此處為 `MyActivity`
- `androidContext()` - 解析最接近的 `Context`，此處為 `MyActivity`
- `androidApplication()` - 從 Koin 設定中解析 `Application`