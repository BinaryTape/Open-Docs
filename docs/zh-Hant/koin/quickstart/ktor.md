---
title: Ktor
---

> Ktor 是一個使用強大的 Kotlin 程式語言，在連網系統中建置非同步伺服器與用戶端的架構。我們將在這裡使用 Ktor 建置一個簡單的 Web 應用程式。

出發吧 🚀

:::note
更新 - 2024-10-21
:::

:::tip
正在尋找此教學的 **註解版本 (annotations version)** 嗎？請查看 [Ktor & Annotations](./ktor-annotations.md)，它使用 Koin Annotations 搭配 Jakarta `@Singleton` 進行編譯期驗證。
:::

## 取得程式碼

:::info
[原始碼已發佈於 GitHub](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradle 設定

首先，如下所示加入 Koin 相依性：

```kotlin
dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## 應用程式概覽

此應用程式的想法是管理使用者列表，並在我們的 `UserApplication` 類別中顯示：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 資料

我們將管理一個使用者集合。這是其資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「Repository」組建來管理使用者列表（新增使用者或依名稱尋找一個）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入的組建的地方。

```kotlin
val appModule = module {

}
```

讓我們宣告第一個組建。我們想要一個 `UserRepository` 的單例，透過建立一個 `UserRepositoryImpl` 的執行個體：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
本教學使用 **Koin 編譯器外掛程式 DSL** (`single<T>()`)，其提供編譯時的自動連結 (auto-wiring)。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 以進行配置。
:::

## UserService 組建

讓我們撰寫 `UserService` 組建來管理使用者操作：

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

## HTTP 控制器

最後，我們需要一個 HTTP 控制器來建立 HTTP 路由。在 Ktor 中，這將透過 Ktor 擴充函式來表達：

```kotlin
fun Application.main() {

    // Lazy inject UserService
    val service by inject<UserService>()
    service.loadUsers()

    // Routing section
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

`/hello` 端點接受一個選用的 `name` 查詢參數。如果未提供，則預設為 "Alice"。

範例請求：
- `http://localhost:8080/hello` - 向 Alice 打招呼（預設）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 打招呼

## 宣告您的相依性

讓我們使用 Koin 模組來組合我們的組建：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 啟動與注入

最後，讓我們從 Ktor 啟動 Koin：

```kotlin
fun Application.main() {
    // Install Koin
    install(Koin) {
        modules(appModule)
    }

    // Lazy inject UserService
    val service by inject<UserService>()
    service.loadUsers()

    // Routing section
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

就是這樣！您已經準備就緒。請查看這些網址：
- `http://localhost:8080/hello` - 向 Alice 打招呼（預設使用者）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 打招呼