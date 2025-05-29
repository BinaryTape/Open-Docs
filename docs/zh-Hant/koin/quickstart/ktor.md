---
title: Ktor
---

> Ktor 是一個使用強大 Kotlin 程式語言，用於在互聯系統中建構非同步伺服器和客戶端的框架。我們將在此處使用 Ktor，來建構一個簡單的網路應用程式。

讓我們開始吧 🚀

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradle 設定

首先，如下所示加入 Koin 依賴：

```kotlin
dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## 應用程式概覽

此應用程式的構想是管理一份使用者列表，並在我們的 `UserApplication` 類別中顯示它：

> Users -> UserRepository -> UserService -> UserApplication

## 「使用者」資料

我們將管理一個使用者集合。這是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」元件來管理使用者列表（新增使用者或按名稱尋找使用者）。以下是 `UserRepository` 介面及其實作：

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

## Koin 模組

使用 `module` 函數來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入的元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個元件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的實例。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserService 元件

讓我們撰寫 UserService 元件來請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository 在 UserPresenter 的建構子中被引用

我們在 Koin 模組中宣告 `UserService`。我們將其宣告為一個 `singleOf` 定義：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTP 控制器

最後，我們需要一個 HTTP 控制器來建立 HTTP 路由。在 Ktor 中，這將透過 Ktor 擴充函數來表示：

```kotlin
fun Application.main() {

    // Lazy inject HelloService
    val service by inject<UserService>()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

請檢查您的 `application.conf` 是否如下所示配置，以幫助啟動 `Application.main` 函數：

```kotlin
ktor {
    deployment {
        port = 8080

        // For dev purpose
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 宣告您的依賴

讓我們使用 Koin 模組來組裝我們的元件：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 啟動並注入

最後，讓我們從 Ktor 啟動 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    // Lazy inject HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就是這樣！您已經準備就緒。檢查 `http://localhost:8080/hello` 網址！