---
title: Android - ViewModel
---

> 這篇教學將帶領您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 __10 min__ 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 設定

如下所示新增 Koin Android 相依性：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 應用程式概觀

此應用程式的構想是管理使用者列表，並透過 Presenter 或 ViewModel 在我們的 `MainActivity` 類別中顯示：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## "User" 資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個 "Repository" 組建來管理使用者列表（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

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

讓我們撰寫一個服務組建來管理使用者操作：

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入之組建的地方。

```kotlin
val appModule = module {

}
```

讓我們宣告我們的組建。我們想要 `UserRepository` 和 `UserService` 的單例：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
本教學使用 **Koin 編譯器外掛程式 DSL** (`single<T>()`, `viewModel<T>()`)，它在編譯時提供自動裝配。請參閱 [編譯器外掛程式配置](/docs/setup/compiler-plugin) 以了解設定方式。
:::

## 使用 ViewModel 顯示使用者

讓我們撰寫一個 ViewModel 組建來顯示使用者：

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> `UserService` 在 `UserViewModel` 的建構函式中被參照。

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModel` 定義，以避免在記憶體中保留任何執行個體（防止與 Android 生命週期相關的記憶體洩漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## 在 Android 中注入 ViewModel

`UserViewModel` 組建將被建立，並隨之解析 `UserService` 執行個體。為了將其獲取到我們的 Activity 中，讓我們使用 `by viewModel()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，您的應用程式準備就緒了。

:::info
`by viewModel()` 函式允許我們獲取 ViewModel 執行個體，為您建立關聯的 ViewModel Factory 並將其綁定到生命週期。
:::

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。只需在應用程式的主要入口點（即我們的 `MainApplication` 類別）中呼叫 `startKoin()` 函式：

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
`startKoin` 中的 `modules()` 函式會載入指定的模組列表。
:::

## Koin 模組：DSL 比較

以下是使用 **傳統 DSL**（手動裝配）的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

使用 **編譯器外掛程式 DSL**（編譯時自動裝配）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
編譯器外掛程式 DSL 需要 [Koin 編譯器外掛程式](/docs/setup/compiler-plugin)。它提供編譯時的相依性解析與更簡潔的語法。
:::