---
title: Kotlin
---

> 本教學將引導您編寫 Kotlin 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 **10 分鐘** 來完成本教學。

:::note
更新 - 2024-10-21
:::

:::tip
正在尋找此教學的**註解版本 (annotations version)**？請查看 [Kotlin 與註解](./kotlin-annotations.md)，該版本使用 Koin Annotations 進行編譯期驗證和自動模組探索。
:::

## 取得程式碼

:::info
[原始碼已發佈於 GitHub](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 設定

首先，檢查是否已如下所示添加了 `koin-core` 相依性：

```groovy
dependencies {
    
    // 適用於 Kotlin 應用程式的 Koin
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## 應用程式概覽

此應用程式的概念是管理使用者清單，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「Repository」組建來管理使用者清單（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

## Koin 模組

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有待注入組建的地方。

```kotlin
val appModule = module {

}
```

讓我們宣告第一個組建。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的執行個體來實現：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
本教學使用 **Koin Compiler Plugin DSL** (`single<T>()`)，它在編譯期提供自動裝配 (auto-wiring)。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 瞭解詳細配置。
:::

## UserService 組建

讓我們編寫 `UserService` 組建來管理使用者操作：

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

> `UserRepository` 在 `UserServiceImpl` 的建構函式中被參照

我們在 Koin 模組中宣告 `UserService`。我們將其宣告為 `single` 定義：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 在 UserApplication 中注入相依性

`UserApplication` 類別將協助從 Koin 引導執行個體。它將透過建構函式注入來解析 `UserService`：

```kotlin
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    // 顯示我們的資料
    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

就這樣，您的應用程式已準備就緒。

:::info
建構函式注入是 Kotlin 應用程式中注入相依性的首選方式。Koin 在建立 `UserApplication` 時會自動解析並注入 `UserService`。
:::

## 啟動 Koin

我們需要在應用程式中啟動 Koin，並將 `UserApplication` 加入到我們的模組中。只需在應用程式的主要入口點（即我們的 `main` 函式）中呼叫 `startKoin()` 函式：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}

fun main() {
    startKoin {
        modules(appModule)
    }

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

:::info
`startKoin` 中的 `modules()` 函式會載入指定的模組列表。我們使用 `KoinPlatform.getKoin().get<UserApplication>()` 從 Koin 取得 `UserApplication` 執行個體。
:::

## Koin 模組：DSL 比較

以下是使用 **傳統 DSL (Classic DSL)**（手動裝配）的 Koin 模組宣告：

```kotlin
val appModule = module {
    single { UserApplication(get()) }
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
}
```

使用 **編譯器外掛程式 DSL (Compiler Plugin DSL)**（編譯期自動裝配）：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::tip
編譯器外掛程式 DSL 需要 [Koin 編譯器外掛程式](/docs/setup/compiler-plugin)。它提供編譯期相依性解析和更簡潔的語法。
:::