---
title: Android
---

> 本教學將引導您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
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

## 應用程式概覽

此應用程式的想法是管理使用者清單，並透過 Presenter 或 ViewModel 將其顯示在我們的 `MainActivity` 類別中：

> Users -> UserRepository -> UserService -> (Presenter 或 ViewModel) -> MainActivity

## 「User」資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個 「Repository」組建來管理使用者清單（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

讓我們編寫一個服務組建來管理使用者操作：

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
本教學使用 **Koin Compiler Plugin DSL** (`single<T>()`, `factory<T>()`)，它在編譯期提供自動裝配。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 以進行配置。
:::

## 使用 Presenter 顯示使用者

讓我們編寫一個 presenter 組建來顯示使用者：

```kotlin
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> `UserService` 在 `UserPresenter` 的建構函式中被引用

我們在 Koin 模組中宣告 `UserPresenter`。我們將其宣告為 `factory` 定義，以便不將任何執行個體保留在記憶體中（避免 Android 生命週期導致的記憶體洩漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

## 在 Android 中注入相依性

`UserPresenter` 組建將被建立，並解決其中的 `UserService` 執行個體。要在我們的 Activity 中取得它，讓我們使用 `by inject()` 委派函式來注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，您的應用程式準備好了。

:::info
`by inject()` 函式讓我們能在 Android 組建執行階段（Activity、fragment、Service...）取得 Koin 執行個體
:::

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。只需在應用程式的主要進入點（即我們的 `MainApplication` 類別）呼叫 `startKoin()` 函式：

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
`startKoin` 中的 `modules()` 函式會載入指定的模組清單
:::

## Koin 模組：DSL 比較

以下是使用 **Classic DSL** (手動裝配) 的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    factory { UserPresenter(get()) }
}
```

使用 **Compiler Plugin DSL** (編譯期自動裝配)：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

:::tip
Compiler Plugin DSL 需要 [Koin Compiler Plugin](/docs/setup/compiler-plugin)。它提供了編譯期相依性解決方案和更簡潔的語法。
:::