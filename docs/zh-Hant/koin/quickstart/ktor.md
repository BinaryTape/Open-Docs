---
title: Ktor
---

> Ktor 是一個使用強大的 Kotlin 程式語言，在連網系統中建置非同步伺服器與用戶端的架構。我們將在這裡使用 Ktor 建置一個簡單的 Web 應用程式。

出發吧 🚀

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼已發佈於 Github](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
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
data class User(val name : String)
```

我們建立一個 "Repository" 組建來管理使用者列表（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入的組建的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個組建。我們想要一個 `UserRepository` 的單例，透過建立一個 `UserRepositoryImpl` 的執行個體：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserService 組建

讓我們編寫 `UserService` 組建來請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被參照

我們在 Koin 模組中宣告 `UserService`。我們將其宣告為 `singleOf` 定義：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTP 控制器

最後，我們需要一個 HTTP 控制器來建立 HTTP 路由。在 Ktor 中，這將透過 Ktor 擴充函式來表達：

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

請檢查您的 `application.conf` 配置如下，以協助啟動 `Application.main` 函式：

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

## 宣告您的相依性

讓我們使用 Koin 模組來組合我們的組建：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 啟動與注入

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

啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就是這樣！您已經準備就緒。請查看 `http://localhost:8080/hello` 網址！