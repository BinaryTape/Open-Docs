---
title: Ktor 與註解
---

> Ktor 是一個使用強大的 Kotlin 程式語言，在連網系統中建置非同步伺服器和用戶端的架構。我們將在此使用 Ktor 來建置一個簡單的 Web 應用程式。

出發吧 🚀

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可以在 GitHub 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 設定

首先，如下所示加入 Koin 相依性：

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // 適用於 Kotlin 應用程式的 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 應用程式概覽

此應用程式的想法是管理使用者列表，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## 「User」資料

我們將管理一個使用者集合。這是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「Repository」組件來管理使用者列表（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

## Koin 模組

使用 `@Module` 註解從指定的 Kotlin 類別宣告 Koin 模組。Koin 模組是我們定義所有要被注入的組件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 宣告此為 Koin 模組
* `@ComponentScan("org.koin.sample")` - 掃描並註冊套件中帶有註解的類別
* `@Configuration` - 透過 `@KoinApplication` 啟用自動模組發現

:::note
此專案使用 Koin 的 `@Singleton` 註解（來自 `org.koin.core.annotation`）來宣告單例組件。
:::

讓我們宣告第一個組件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的執行個體。我們將其標記為 `@Singleton`：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository
```

## UserService 組件

讓我們撰寫 `UserService` 組件來管理使用者操作：

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

> `UserRepository` 在 `UserServiceImpl` 的建構函式中被引用

我們使用 `@Singleton` 註解宣告 `UserService`：

## HTTP 控制器與 Koin 應用程式

最後，我們需要建立一個 `@KoinApplication` 物件並配置我們的 HTTP 路由：

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 註解將其標記為 Koin 基於註解配置的入口點。KSP 處理器會產生可用於 `withConfiguration<T>()` 的配置來初始化 Koin。

## 啟動與注入

現在讓我們使用 Koin 配置 Ktor 應用程式：

```kotlin
fun Application.main() {
    // 使用產生的配置安裝 Koin
    install(Koin) {
        slf4jLogger()
        withConfiguration<KoinUserApplication>()
    }

    // 延遲注入 UserService
    val service by inject<UserService>()
    service.loadUsers()

    // 路由區段
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

**重點：**
* `withConfiguration<KoinUserApplication>()` - 使用來自帶有註解的應用程式物件所產生的 Koin 配置
* 無需手動呼叫 `modules(AppModule().module)` — 它已自動包含在內！
* `/hello` 端點接受一個選用的 `name` 查詢參數

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

就這樣！您已經準備就緒。請查看以下網址：
- `http://localhost:8080/hello` - 向 Alice 打招呼（預設使用者）
- `http://localhost:8080/hello?name=Bob` - 向 Bob 打招呼

:::info
帶有 `@Configuration` 的 `@KoinApplication` 註解會在編譯期自動發現並載入所有帶有註解的相依性。
:::