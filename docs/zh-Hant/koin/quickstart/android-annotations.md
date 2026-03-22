---
title: Android 與註解
---

> 本教學將帶領您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 **10 分鐘** 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼已發佈於 GitHub](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 設定

讓我們如下配置 KSP 外掛程式，以及下列相依性：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 編譯期檢查
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
請參閱 `libs.versions.toml` 以了解目前版本
:::

## 應用程式總覽

這個應用程式的概念是管理一個使用者列表，並透過 Presenter 或 ViewModel 將其顯示在我們的 `MainActivity` 類別中：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## 「User」資料

我們將管理 User 的集合。這是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「存儲庫」組建來管理使用者列表（新增使用者或按名稱尋找）。下方是 `UserRepository` 介面及其實作：

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

@Singleton
class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

## UserService 組建

讓我們編寫一個服務組建來管理使用者操作：

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

@Singleton
class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    init {
        loadUsers()
    }

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

## Koin 模組

讓我們如下宣告一個 `AppModule` 模組類別：

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 將此類別宣告為 Koin 模組
* `@ComponentScan("org.koin.sample")` - 自動掃描並註冊 `"org.koin.sample"` 套件中的所有 Koin 定義
* `@Configuration` - 與 `@KoinApplication` 配合使用時，啟用自動模組探索

啟用組建掃描後，我們只需在類別中加入註解：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService {
    // ...
}
```

`@Singleton` 註解將這些類別宣告為 Koin 中的單例。

## 使用 Presenter 顯示使用者

讓我們編寫一個 Presenter 組建來顯示使用者：

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> `UserService` 在 `UserPresenter` 的建構函式中被引用

我們使用 `@Factory` 註解宣告 `UserPresenter`，以便在每次請求時建立新執行個體（避免 Android 生命週期造成的記憶體洩漏）：

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {
    // ...
}
```

## 在 Android 中注入相依性

將會建立 `UserPresenter` 組建，並隨之解析 `UserService` 執行個體。若要在 Activity 中取得它，讓我們使用 `by inject()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就是這樣，您的應用程式已準備就緒。

:::info
`by inject()` 函式讓我們能在 Android 組建執行階段（Activity、Fragment、Service...）中取得 Koin 執行個體。
:::

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。透過 `@KoinApplication` 註解，Koin 會自動探索並載入所有標記為 `@Configuration` 的模組：

```kotlin
import org.koin.android.ext.koin.androidContext
import org.koin.core.annotation.KoinApplication
import org.koin.ksp.generated.*

@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MainApplication)
        }
    }
}
```

**關鍵點：**
* `@KoinApplication` - 自動探索所有標記有 `@Module` 與 `@Configuration` 的模組
* 不需要手動呼叫 `modules(AppModule().module)` —— 模組會自動載入！
* 需要 `import org.koin.ksp.generated.*` 才能使用產生的 Koin 內容
* 您只需要配置 Android 特定的設定，例如 `androidContext`

:::info
`@KoinApplication` 註解配合模組上的 `@Configuration`，可透過 KSP 在編譯期自動探索並載入所有相依性。
:::

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 組建來顯示使用者：

```kotlin
@KoinViewModel
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> `UserService` 在 `UserViewModel` 的建構函式中被引用

`UserViewModel` 標記有 `@KoinViewModel` 註解，用以宣告 Koin ViewModel 定義。這可確保正確的生命週期管理並避免記憶體洩漏。

## 在 Android 中注入 ViewModel

將會建立 `UserViewModel` 組建，並隨之解析 `UserService` 執行個體。若要在 Activity 中取得它，讓我們使用 `by viewModel()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 編譯期檢查

Koin 註解允許在編譯期檢查您的 Koin 配置。這可以透過使用下列 Gradle 選項來實現：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
這個基於 KSP 的選項將被 **Koin 編譯器外掛程式**（Koin Compiler Plugin）取代，它將提供原生編譯期安全性。請參閱 [編譯器外掛程式](/docs/setup/compiler-plugin) 以了解未來的方法。
:::